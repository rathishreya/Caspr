# API contract — revision for Jayant's team

**Date:** 2026-08-18 · **Against:** `api-spec-v2.md`
**Companion:** `CASPR-KEYS-REQUEST.txt` (section 3 answers the transport question below)

Everything here is **additive**. A service that ignores every item in this
document keeps working — the client degrades to a defined, honest state in each
case, and those states are named so you can see what you get for free by doing
nothing.

Six changes, then two questions.

---

## 0. Transport — MCP → direct API

Joy's decision, 2026-08-18: drop the MCP JSON-RPC envelope and call the API
directly.

**The argument and return shapes do not change.** What goes is the
`{jsonrpc, id, method: "tools/call", params: {name, arguments}}` wrapper and the
`result.structuredContent` unwrapping. `propose_visuals` stops being a tool call
and becomes a request whose body is the arguments and whose response is the
result.

We need four answers before building it — they are in `CASPR-KEYS-REQUEST.txt`
§3, repeated here so this document stands alone:

| | Question |
|---|---|
| `AI_API_STYLE` | Flat (`POST /v1/propose_visuals`) or REST (`POST /v1/analyses/{id}/visuals`)? |
| `AI_ERROR_ENVELOPE` | Keep the current `{ code, message, details }`, or yours? |
| `AI_SSE_PATH_CHANGED` / `AI_WEBSOCKET_PATH_CHANGED` | Do the streams change, or only the tool calls? |
| `AI_AUTH_METHOD` | Bearer + JWKS, unchanged? |

Unchanged either way, and worth restating because it constrains the design:
**no bearer token in a URL or query string, ever.** SSE authenticates through
`fetch` headers; the WebSocket authenticates on its first frame and closes 4401
on timeout.

---

## 1. `cost` on every call

Joy, 2026-08-18: token counts on **every** Caspr API call, not only edits, so
the product has full visibility into cost as utilisation grows.

```ts
interface Cost {
  /**
   * Tokens consumed. Already marked up — the product records and charges this
   * as-is and never applies a margin of its own (resolved 2026-08-17).
   */
  tokens: number;
  /** False for work that is free by policy. */
  metered: boolean;
}
```

Returned on every response that does work:

```jsonc
{ "proposals": [ … ], "cost": { "tokens": 512, "metered": true } }
```

**Why `metered` exists as well as `tokens`.** They are different statements.
`metered: false` means *this kind of work is never charged*; `tokens: 0` means
*this instance cost nothing*. Keeping them apart is what lets us tell a free
edit from a broken meter when the numbers look wrong.

**Omitting it is fine.** The client reads a missing, non-finite or negative cost
as **unreported** and shows nothing — never as free, because claiming an edit
was free on an engine with no metering would be inventing a fact about the
user's money.

**Already built on our side:** the client guard, the display in the Edit pane
and under each Ask answer, and five injectable faults in our reference service
(`cost_absent`, `cost_zero`, `cost_negative`, `cost_fractional`, `cost_huge`)
so we can prove the UI survives a number it did not expect.

### 1a. `cost` on `ask_complete`

The metering rule after a report exists is now simply: **if it hits the API it
costs; if it is local it is free.** So Ask follow-ups are metered.

```ts
| { event: 'ask_complete'; data: { exchange_id: string; cost?: Cost } }
```

Two things stay free **because they never reach you**, which is why no exception
is needed:

- A red dot's **first** answer is the `AnchorExplanation` that shipped with the
  report.
- A chart re-plot renders client-side from `chart_data`.

---

## 2. The generation → creation handshake

Joy with your team, 2026-08-18. This replaces the `mode_change: 'creating'`
suggestion, which was too thin for what the handshake actually needs.

**The sequence:**

1. You signal **generation complete** — all sections written.
2. **The product decides the cutoff, not the user.** We close the window on our
   own clock.
3. We send **one confirmation**, carrying whatever the user got in during the
   window.
4. You apply those, then begin creating outputs. You flag that you have moved
   into creation.
5. **No second handshake.** You do not come back to ask again.
6. When creation completes, you tell us. Only then does anything else reach you.

**What we need from you — three signals and one call:**

```ts
| { event: 'generation_complete'; data: { analysis_id: string } }
| { event: 'creating';            data: { analysis_id: string } }
| { event: 'creation_complete';   data: { analysis_id: string; version_id: string } }
```

```
confirm_generation_cutoff
  { analysis_id, idempotency_key, requests: [ { id, kind: 'ask'|'edit', text } ] }
```

**Three things we need decided, not guessed:**

- **The timeout.** If we never confirm — idle user, closed tab, crashed client
  — creation has to start anyway or a report never finishes. **How long, and do
  you emit `creating` when you proceed without us?** We handle that case:
  everything we had gathered moves to our queue rather than being stranded. But
  we handle it correctly only because we assume you *will* proceed. Confirm.
  (`GENERATION_CONFIRM_TIMEOUT_SECONDS` in the keys file.)
- **Idempotency.** The confirmation is a network call and will occasionally be
  sent twice. It must be safe to repeat.
- **Ordering.** Our implementation does not care whether `creating` arrives
  before or after our confirmation — a handshake that breaks on message order
  is not a handshake. Please make the same assumption.

**Built on our side:** the product holds the queue between (3) and (6), decides
the race on its own clock at the moment of commit rather than on arrival order,
and shows the user that a queued message is waiting rather than letting it look
sent. Everything queued becomes an Ask call afterwards and consumes tokens.

---

## 3. `AnalysisSection.signal`

```ts
interface SectionSignal { claim: string; evidence: string }

interface AnalysisSection {
  …
  signal?: SectionSignal | null;   // present only when a market view was found
}
```

Present **only** when you actually found one. Absent is the normal case, and the
paragraph below closes the gap — an empty card would say *"we looked and found
nothing"*, which is a different claim from *"we did not look."*

Aligned with Joy; if present it is identified as such in the report output.

---

## 4. Caspr's words in the pre-gate conversation

**Joy's ruling, 2026-08-18 — a hard boundary:** the product never answers the
user on Caspr's behalf. It may narrate machine state (*"INITIATING LEARNING
BRAIN"*, *"PREPARING YOUR QUESTIONS"*) and ask about the *user*. Anything about
the *analysis* comes from you.

Two lines currently hardcoded in our client are in Caspr's voice about the
analysis, and Joy has ruled they should come from you:

- *"Let's scope it. What angle — market sizing, competitive teardown, or a
  diligence read?"* — asked after the opening prompt.
- *"Structure drafted — five sections on the right. Edit them there, or answer
  these to sharpen the scope:"* — the line introducing the refinement questions.

`DraftLayout` already returns `refinement_questions`. We are asking it to also
return the conversational lines around them:

```ts
interface DraftLayout {
  analysis_id: string;
  sections: LayoutSection[];
  refinement_questions: RefinementQuestion[];
  revision: number;
  premium_addons: PremiumAddon[];
  /** NEW — Caspr's own words, so the product never writes them. */
  narration?: {
    /** Asked after the opening prompt, before the layout exists. */
    scoping_question?: string;
    /** Introduces the refinement questions once the layout is drafted. */
    layout_intro?: string;
  };
}
```

**If omitted** we fall back to the current strings, which is the state we are in
today — so this is not blocking. But every run then has the product speaking as
Caspr, which is the thing the boundary exists to prevent.

---

## 5. `early_finding` — already yours, and we now show it

No change requested. Flagging that it went unused: it has been in the contract
and your spec all along, and until today the client accumulated findings and
rendered them nowhere. They now appear inline in the generation pane, verbatim —
we never round a stat or rephrase a label.

**One question.** Findings arrive *before* the section they belong to completes.
**Can a finished report ever contradict an early finding?** If yes we need to
decide what the screen does about a number the user has already read. If no, say
so and we will treat them as final.

---

## 6. Legacy reports — no import capability needed

Withdrawing an ask we raised earlier. We had flagged that nothing in
`api-spec-v2.md` ingests an existing analysis, which would have blocked
migrating old reports into the new reader.

**Joy's decision, 2026-08-18: archive rather than convert.** Migrated reports
open their original PDF or PPTX directly and never enter the reader; the
migrated conversation shows read-only. So **no import tool is required**, and
nothing has to be generated onto old conclusions.

What we need instead is not an API change: the **S3 path structure** for legacy
outputs, so we can write the migration script. Your team supplies the keys and
runs it.

---

## Two questions that are not code

**Q1 — Does an answer have to reach the engine mid-run?**
Our pre-gate conversation asks the user a question while the analysis runs
(*"Who reads this one — you, or a committee?"*). Today's copy implies the answer
sharpens **this** report. Nothing implements that, and if it should be true it
is an API change: a way to pass a mid-run answer into a running analysis.
Otherwise the answer only tunes the next one and we will make the copy say so.

**Q2 — Confirm the numbers.** Rate ≈ **$1 per 1,000 tokens**, a visual
regeneration ≈ **500 tokens**, same-scope refresh at **50%**. We have modelled
against these; they need a yes before real money moves.

---

## Summary — what happens if you do nothing

| Change | Without it |
|---|---|
| 1 · `cost` | Nothing is metered. No edit or question is ever charged |
| 1a · `ask_complete.cost` | Ask follow-ups are free |
| 2 · Handshake | We derive the cutoff from last-section-vs-stored-version. Works; the label moves if a layout changes length mid-run |
| 3 · `signal` | The Signal card never appears |
| 4 · `narration` | The product keeps speaking as Caspr in the scoping conversation |
| 5 · `early_finding` | Already works |
| 6 · Legacy import | Not needed — withdrawn |

**Only item 1 has commercial consequence.** Everything else degrades to a
defined state.

*From the Caspr product team · 2026-08-18. Reply against the numbered items.*
