# What the product app needs from Jayant's team

**Date:** 2026-08-18 · **For:** a live working session with Jayant and team
**Companion:** [`CONFIGURATION.md`](CONFIGURATION.md) — the full env-var reference

---

## Read this first

**Joy's understanding is right.** To go live, the asks are **credentials** and
**two values that must match on both sides**. That is sections A and B, and
between them they are perhaps an hour of work.

Everything below that is one of three things, and **none of it blocks launch**:

- **C — three additive API fields.** Omitting each one is already handled: the
  app degrades to a defined, honest state rather than breaking. They make three
  features real rather than approximated.
- **D — numbers to confirm.** No code. We have modelled values; we need a yes or
  a correction before real money moves.
- **E — one genuine decision** about the old reports, which is a bigger piece of
  work and worth its own conversation.

If the session is short, **do A and B and stop.** The rest can be email.

---

## A — Credentials and endpoints (blocking for launch, not for testing)

Nothing here is needed to start testing: with no SES the app prints email links
to the log, and `--sandbox-payments` gives a working fake gateway.

### A1 · AWS SES — so signup and password-reset emails send

| Variable | Notes |
|---|---|
| `SES_REGION` | e.g. `ap-southeast-1`. Must be where the identity is verified |
| `SES_SENDER` | A **verified** identity — `Caspr <no-reply@caspr.ai>` |
| `AWS_ACCESS_KEY_ID` 🔑 | Or skip both and give the task an IAM role with `ses:SendEmail` — cleaner |
| `AWS_SECRET_ACCESS_KEY` 🔑 | |
| `SES_CONFIGURATION_SET` | Optional but strongly recommended — routes bounces somewhere visible |

**Two console steps that are easy to miss:**

1. Verify the sending domain (or at minimum the sender address).
2. **Leave the SES sandbox.** A new SES account can only send to *verified*
   addresses, so signup will appear to work and reach nobody. This is the single
   most likely cause of "SES is configured but no email arrives."

**Why a configuration set matters:** a bounce nobody sees is a user who never
got their link and has no way to tell us.

### A2 · Stripe — so the wallet can take money

| Variable | Notes |
|---|---|
| `STRIPE_SECRET_KEY` 🔑 | `sk_test_…` or `sk_live_…`. **The key you inject is the only thing that decides test or live** — there is no flag to get wrong |
| `STRIPE_WEBHOOK_SECRET` 🔑 | `whsec_…`. Absent → the webhook answers 501 rather than trusting what arrives |

**In the Stripe dashboard:** point a webhook at
`{BACKEND_ORIGIN}/webhooks/stripe` and subscribe it to `payment_intent.succeeded`,
`invoice.paid`, `customer.subscription.deleted`.

We use **hosted Checkout**, so no publishable key is needed and card details
never touch a page we serve — which removes most of the PCI surface.

**An unverified webhook is a URL that credits wallets on request**, which is why
the endpoint refuses rather than guesses when the secret is missing.

### A3 · Deployed addresses

| Variable | What it is |
|---|---|
| `APP_ORIGIN` | Where the SPA lives. Emailed links point here and Stripe returns users here |
| `CORS_ORIGIN` | Comma-separated list of who may call the API |
| `VITE_BACKEND_ORIGIN` | The product backend |
| `VITE_MCP_ENDPOINT` | **Jayant's service.** Re-point this and nothing else changes |
| `VITE_REALTIME_ORIGIN` | The WebSocket origin — `wss://`, not `https://` |

`APP_ORIGIN` and `CORS_ORIGIN` are deliberately separate: one is a list of who
may call us, the other is the single address a browser gets sent to. Conflating
them means the first extra CORS origin silently redirects verification links.

⚠ The three `VITE_` values are **baked in at build time**. Changing one means a
rebuild, not a restart.

### A4 · Legacy S3 — only if we migrate old reports (see E)

`LEGACY_S3_BUCKET`, `LEGACY_S3_REGION`, and **read-only** credentials. A
migration credential that can write is a migration credential that can destroy
the thing it is migrating.

---

## B — The two values that must match exactly (blocking, 5 minutes)

| Variable | Ours | Theirs |
|---|---|---|
| `AUTH_JWT_ISSUER` | set on our backend | their service verifies against it |
| `AUTH_JWT_AUDIENCE` | set on our backend | same |

Their service fetches our JWKS from `AUTH_ORIGIN` to verify our tokens. **If
these differ by a character, every call fails with an authentication error that
looks like a dozen other problems.** Agree the two strings in the session and
write them down.

Related, already agreed and worth confirming out loud: **no bearer token ever
appears in a URL or query string.** SSE authenticates via `fetch` headers; the
WebSocket authenticates on its first frame and closes with 4401 on timeout.

---

## C — Three additive API fields (not blocking; each degrades cleanly)

All three are optional and backward-compatible. Existing payloads keep working,
so these can land whenever suits.

### C1 · `cost` on `propose_visuals` — edit metering

```ts
interface EditCost {
  tokens: number;    // already marked up; the product charges it as-is
  metered: boolean;  // false for work that is free by policy (charts, minor edits)
}
// propose_visuals response: { proposals, cost? }
```

**Why:** `EDIT-ECONOMICS.md` retired the flat "revision" unit because compute
varies by change type — we lost money on expensive edits and overcharged cheap
ones. The model is now *the engine reports what a call actually consumed.*
There is currently **no field for that number anywhere** in the contract, so
edit metering does not exist end to end.

**Without it:** every edit shows as "not reported". Nothing breaks, but no edit
is ever charged.

**Note:** `metered: false` and `tokens: 0` are deliberately different. The first
is policy — a chart re-plot is never charged. The second is an amount. Keeping
them apart is what lets us tell a free edit from a broken meter.

### C2 · `mode_change` with `mode: 'creating'`

Today `mode_change` carries only `'generating'`. We need to know when a run moves
from writing sections to **rendering outputs**, because that is the cutoff after
which a new request applies to the *next* version rather than folding into this
one — and the UI tells the user so.

**Without it:** we derive it from "last section arrived, version not yet stored",
which works but moves if a layout changes length mid-run. A wrong *label*, not
wrong money — the version boundary is enforced server-side either way.

### C3 · `AnalysisSection.signal`

```ts
interface SectionSignal { claim: string; evidence: string }
// AnalysisSection gains:  signal?: SectionSignal | null
```

Present only when a market view was actually found.

**Without it:** the Signal card is simply absent and the paragraph below closes
the gap. An empty card would say "we looked and found nothing", which is a
different claim from "we did not look."

---

## D — Numbers to confirm (no code, but needed before real money moves)

| # | What we modelled | Need |
|---|---|---|
| **D1** | Edit tokens ≈ **$1 per 1,000**; a visual regeneration ≈ **500 tokens ≈ $0.50** | Confirm or correct. Everything else scales off actual compute |
| **D2** | Same-scope refresh = **50%** of the original price; new-scope or tier-change = **full**, priced at the gate | Confirm 50% is defensible on compute |
| **D3** | Capacity: **no queue** — Theater absorbs 5–30s, then streaming | Already confirmed. Flag only if expected load changes, so we wire the async fallback |

On margin — settled and worth restating so nobody re-opens it: **Jayant's API
returns already-marked-up token numbers, and the product records and charges
them as-is.** No margin percentage is set, computed, or stored product-side.

---

## E — The one real decision: old reports and unfinished conversations

Roughly 1,600–1,700 existing users. Two separate questions:

**Unfinished conversations** — straightforward. They exist in the current app's
DB and the migration script carries them over. No ask here beyond DB access.

**Old deliverables** — this is the decision. Three things stand in the way of
putting old reports into the new reader:

1. **There is no way to put a report into the store.** `api-spec-v2.md` has six
   tools and none ingests an existing analysis. The reader gets content from
   `retrieve_analysis`, so a converted report has nowhere to live until an
   **import capability** exists. That is a contract change and a cross-team one.
2. **The new reader needs two things the old data lacks** — per-section
   `anchors` (the red-dot citations, each with its own explanation) and an
   executive-summary `infographic`. Neither exists in the old `cards`. Both
   would have to be **generated per report, at real compute cost.**
3. **Generating them writes new text onto old conclusions.** Hard rule 9a says
   report content is never rephrased. Anchor explanations arguably are not the
   report — but it is new sentences attached to old findings, and that deserves
   a decision rather than an assumption.

**The two options:**

- **Archive (cheap).** Old reports stay as downloadable files in their original
  format, listed in the library and marked as such. Needs only the read-only S3
  credentials in A4. No import tool, no generation cost, no rule-9a question.
- **Convert (expensive).** Needs Jayant's import tool, a generation pass per
  report, and a ruling on 9a.

**Recommendation: archive.** It is honest about what those reports are, costs
almost nothing, and does not put new words on old conclusions. Convert later for
specific reports if anyone asks.

---

## F — Not for Jayant

Listing these so they do not get discussed in the wrong room. All are Joy or the
design session:

- The four email copy strings (verify, reset, changed, welcome) and the
  `/verify` failure-state copy.
- Where the per-call token line renders (§49) — Joy chose the Edit pane; it
  still wants a drawn frame.
- The decode's hidden-word easter egg (§48).
- Sample reports — content does not exist yet; explicitly non-blocking.
- Migration balance actuals: we credit **$3–4 for every $1 outstanding**
  (modelled at 3.2×) to honour the old $20–25 per study against the new $80.
  Joy's call, needs confirming before any real data moves.

---

## F — Report-generation defects, passed through (2026-09-01)

**Not ours to fix, and confirmed absent from both our repositories** — grepped
`caspr-frontend` and `caspr-backend` for each. They live in the report renderer.
From `DEV-PROMPT-ROUND-5.md` §5.

### F1 · `§§PG|COVER|§§` markers leak into the PDF text layer

Six of them in the first three pages of **every** PDF; none in the `.md`. They
are invisible on the page, which is why they survived — but they are
**copy-pasted, indexed by search, and read aloud by screen readers.** A pagination
directive that was meant to be consumed by the renderer is instead being drawn as
text with no ink.

### F2 · Duplicated tables, Briefs only

All three Briefs checked repeat a table immediately after itself. **Zero Studies
do**, which localises it to the Brief template rather than the table renderer.

### F3 · ⚠ The cover provenance line — and **do not ship it alone**

> *"Analysis generated by Caspr's Thinking Brain"* →
> **"Sourced, assessed and concluded by Caspr; every claim cited to source."**

The old string is on **23 delivered reports**. The new one is better on its own
terms — it says what was done rather than which organ did it
(`source-assess-conclude.md` §4) — but that is not why this is here.

**It is half of EU AI Act Article 50(2), and the other half is missing entirely.**
`docs/product/ai-disclosure-spec.md` (locked 2026-08-21) requires the mark to be
**both** visible on the cover **and** machine-readable in XMP / OOXML. The XMP
fields are absent.

**Changing the visible string without adding the XMP fields leaves the gap open
and makes it look closed** — which is worse than the current state, because the
current state is at least legibly wrong. **One pass, both halves, or neither.**

---

## Suggested order for the session

1. **B** — agree the two JWT strings out loud. Five minutes, and everything else
   fails confusingly without it.
2. **A3** — the deployed addresses, since the `VITE_` ones need a rebuild.
3. **A1 / A2** — SES and Stripe, including the two SES console steps.
4. **D1 / D2** — the two numbers.
5. **E** — the old-reports decision, if there is time.
6. **C** — hand over as a written spec; nothing needs discussing live.
7. **F** — three renderer defects. F1 and F2 are bugs; **F3 is a compliance
   item and must ship with its XMP half.**

**Then:** run the conformance suite against their service —
`CONFORMANCE_TOKEN=<a real JWT> npm run conformance -- --origin <AI_ORIGIN>`.
All green **and zero skips** is the integration gate.
