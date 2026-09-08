# API contract — gaps against the pass-through model

**Dev session · 2026-08-27.** Reviewed against `api-spec-v2.md` at Joy's request.

> **The model, as Joy states it:** *"The product has no intelligence — all conversations need to be sent to
> Caspr to get replies. The product surface is just the pass-through mechanism. And the context needs to be
> maintained for each analysis and each report so multiple users don't get answers cross-connected."*

**The contract implements about half of this.** What follows is what it covers, and the five places it does
not. Two of them are load-bearing.

---

## What the contract already gets right

| | |
|---|---|
| **Identity** | §1.2 — every request carries a Caspr-issued RS256 JWT with `sub`, verified against our JWKS. **No endpoint is unauthenticated**, and a token in a query string must be *rejected* rather than tolerated |
| **Ask Caspr is a true pass-through** | §9.1 — `POST /stream/ask` per question, SSE reply. One call per turn, scoped by `analysis_id` and `version_id` |
| **Audit** | §1.8 — every state transition emits `analysis_id` + `sub` + UTC timestamp, both sides keeping their own trail |
| **Blast radius** | §1.8 — analysis content never transits the Caspr backend. Our side sees identifiers, status and money |

---

## ⚠ Gap 1 — ownership is never required to be checked

**The most serious one, and it is exactly Joy's cross-connection concern.**

The JWT proves **who is calling**. The payload names **which analysis**. **Nowhere does the contract require
the service to verify that `analysis_id` belongs to `sub`.**

`403` does not appear in the specification at all. §1.4's error envelope has no forbidden case, and §1.2 ends
at *"no endpoint is unauthenticated"* — which is authentication, not authorization.

So a caller holding a valid token for user A, sending user B's `analysis_id`, is within the letter of the
contract. Whether that returns B's report depends entirely on an implementation choice nobody wrote down.

**Needed:** an explicit rule that every request binds `analysis_id` (and `version_id`, `section_id`,
`file_id`) to `sub`, with a named error code — and a conformance check for it, since §1.7 already proves that
style of assertion works.

> **This is the same class as the read-only-database question**, and it lands the same way: authentication is
> not authorization, and a boundary nobody wrote down is not a boundary.

---

## ⚠ Gap 2 — the pre-gate conversation is not a pass-through, by design

The scoping beat does not work the way Joy describes:

| | |
|---|---|
| `propose_layout` §2 | called **once** |
| `layout_stream` §2.2 | server-pushed `layout_revised` — the sourcing stage refining **on a timer**, not in response to the user |
| the user's answers | **accumulate in the client** and ship with `trigger_generation` as `clarifications` (§3) |

**There is no endpoint that takes a single scoping answer and returns a reply.** So between the prompt and
the gate the product is *not* a pass-through: it holds the user's turns and speaks for itself.

Two consequences the build has already hit:

- **Answering a scoping question does not change the layout.** The revisions arrive regardless. The spec's own
  wording is *"refines the layout live **while** the user answers"* — concurrent, not causal.
- **The `Or refine further…` bar has no reply to give.** Free text can be captured into `clarifications` and
  honoured at generation, which works today — but nothing answers, so a chat-shaped control promises a
  response the contract cannot produce.

### The proposed addition — `GET /stream/scope` (SSE)

Written into the client on 2026-08-27 and live against the mock, so the app is complete and the only thing
missing is the service. **The route does not exist yet; until it does the stream errors and the pane says the
reply did not arrive.** That is deliberate — the alternative is the product writing Caspr's words, which
Gap 3 is about.

**Request** — query parameters, same style as `/stream/ask`:

| | |
|---|---|
| `analysis_id` | required. The analysis `propose_layout` created |
| `text` | required. What the user wrote |
| `question_id` | optional. The `refinement_question` this answers; absent for a free steer |

**Events:**

```
event: scope_reply_delta
data: {"turn_id": "...", "text": "..."}     ← appends, does not replace

event: scope_complete
data: {"turn_id": "..."}                    ← terminal
```

**Three deliberate choices, each with a reason:**

1. **No `cost` on the terminal event.** Scoping is pre-gate. Nothing is committed and nothing is billable —
   which is what lets a signed-out visitor scope at all (`showcase-and-auth-spec.md`).
2. **No layout in the payload.** A revision this answer causes should arrive on `/stream/layout` as
   `layout_revised`, where revisions already arrive. One channel for the layout, whatever provoked it; two
   would be a race over which draft is newer.
3. **The answer still travels in `trigger_generation`.** This call is the *conversation*; §3 stays the single
   source of what the analysis was actually asked for. Making the conversation authoritative would mean the
   commit no longer states its own scope.

**What this closes:** with it, answering a scoping question is causal rather than concurrent — the first
bullet above — and the refine bar can keep its promise.

---

## ⚠ Gap 3 — the product currently speaks as Caspr, and we already knew

`API-CONTRACT-REVISION-2026-08-18.md` §4 records Joy's ruling — *"the product never answers the user on
Caspr's behalf"* — and asked for `DraftLayout.narration` to carry the two lines that are hardcoded in our
client. It closes with:

> *"If omitted we fall back to the current strings, which is the state we are in today — so this is not
> blocking. But every run then has the product speaking as Caspr, which is the thing the boundary exists to
> prevent."*

**That request is still unfulfilled, so that is still the state.** It is the clearest instance of the product
holding intelligence it should not: *"What angle — market sizing, competitive teardown, or a diligence
read?"* is our sentence, in Caspr's voice, about the analysis.

---

## Gap 4 — `ask_caspr` has no conversation history

The request is `{ analysis_id, question, scope, version_id }`. There is **no thread identifier and no prior
turns**, and the spec never says whether the service keeps per-analysis memory between exchanges.

Responses carry an `exchange_id`, which implies exchanges are distinct objects — but nothing says a second
question can refer to the first. So *"and what about Germany?"* is undefined: either the server remembers and
that is unstated, or the context is lost and the feature does not work as a conversation.

**Needed:** state it. Either the service maintains per-`analysis_id` conversation state (and says how long),
or the request grows a `thread_id` / prior-turns field and the client sends history.

---

## Gap 5 — "per report" context is only half-expressed

`version_id` scopes an ask to a report version, which is the right primitive and it is already there. But
with Gap 4 unresolved, *"context maintained for each analysis and each report"* is only true for a single
question at a time. The scoping key exists; the memory it is supposed to key does not.

---

## Summary — what to send Jayant

| | Gap | Blocking? |
|---|---|---|
| **1** | Require `analysis_id` ↔ `sub` ownership checks, with an error code and a conformance assertion | **Yes — security** |
| **4** | Define conversation state for `ask_caspr`: server-side memory, or history in the request | **Yes — the feature does not work multi-turn without it** |
| **2** | A per-turn pre-gate scoping endpoint, if the scoping conversation is meant to be a real conversation | Product decision |
| **3** | Ship `DraftLayout.narration`, so the product stops writing Caspr's dialogue | Already agreed, not delivered |
| **5** | Falls out of 4 | — |

**Gaps 1 and 4 are the ones I would not launch without.** The first is a cross-tenant read risk that depends
on an unwritten assumption; the second means Ask Caspr answers the first question and then quietly forgets.
