# Sample reports — the seeded-activation mechanism

**Status: PLACEHOLDER SPEC (v1, 2026-08-17).** The *mechanism* is specified here so the build can carry it. The *content* — which topics, which conversations — is deliberately deferred: once the app is live, Joy generates real reports and hands their conversations + outputs over to seed as the samples. Build the plumbing now, populate post-launch.

Origin: review-1 (Joy, 2026-08-15) — the activation gap is that new signups never reach the Aha! moment (a 100-page, boardroom-ready, fully-cited report in 15 minutes). A pre-seeded sample report *is* that moment, available before the user spends a cent. This is an onboarding/activation asset, not a marketing demo.

---

## The principle

A **sample report** is a real, finished analysis — left in its **post-generation state** so every live surface works on it: Ask threads, Edit proposes, Outputs export, citations resolve. The new user doesn't watch a demo; they open a genuine Caspr deliverable and *use* it. The conversation that produced it is preserved too, so they also see the path from a one-line prompt to the boardroom PDF.

The bet: a user who has *touched* a live, cited, analyst-grade report — asked it a question, seen a citation resolve, exported a page — understands the product in a way no landing page can teach, and is far more likely to run their own.

---

## What a sample is (data model)

A sample is an ordinary report record carrying one extra flag.

| Field | Value | Purpose |
|---|---|---|
| `sample: true` | boolean tag | Marks the record as seeded, not user-generated. Everything else keys off this. |
| `seededAt` | timestamp | When it was planted in the account. |
| `sampleId` | stable id | Same logical sample across all accounts (so "archived" state can be tracked per user). |
| conversation | preserved | The prompt → layout → gate → theater → generation thread that produced it, replayable. |
| outputs | present | The generated PDF/PPTX and any visuals, exactly as a paid report. |

**Seeded across all accounts.** Every account — new and existing — receives the current sample set. Seeding is idempotent on `sampleId` (re-running never duplicates).

**Visible until the user archives or deletes it.** A sample lives in the library like any report. The user can archive or delete it; that choice is per-user (keyed on `sampleId`) and must survive re-seeding — a deleted sample does not reappear.

---

## Behaviour — live, not a screenshot

- **Ask / Edit / Outputs are fully live** on a sample. The whole point is that the user operates a real report.
- **Editing a sample is sandboxed-free** — it's a demo surface, so edits do not meter against the user's edit tokens or wallet. *(Pending final confirm — see open questions. Default: free, and edits to a sample never persist back to the shared seed; they live only in that user's copy.)*
- **The sample is clearly labelled** as a sample in the library and in the reader (a quiet tag, not a watermark that undercuts the "boardroom-ready" promise). Exact treatment: a `Sample` chip on the cover + a one-line reader banner. Design TBD alongside content.
- **No charge, ever, to receive or open a sample.** It ships with the account.

---

## Placement in the funnel

- A new user lands post-signup with **at least one sample already in Documents**, plus its conversation retrievable — so the first thing in an empty-feeling account is a finished, cited, usable report.
- Returning users who never activated also carry the current sample set (re-engagement surface).
- The sample is the concrete referent for every activation nudge ("See what an $80 Study looks like — open the sample").

---

## What the build needs now (plumbing, not content)

1. The `sample` tag + `sampleId` + per-user archive/delete state that survives re-seeding.
2. A **seeding job** that plants the current sample set into every account, idempotently.
3. Sample records render through the **existing** library / reader / Ask / Edit / Outputs paths with **no special-casing except**: (a) the `Sample` label, (b) edits are free + non-persistent to the seed.
4. A **populate hook** Joy uses post-launch: hand over `{conversation, report, outputs}` for a real analysis → it becomes a sample across all accounts.

None of this blocks the core build — it rides on rails that already exist.

## Open questions (for Joy, post-launch)

- **Which topics** seed as samples (broad-appeal vs ICP-specific; how many). *Deferred — decided when Joy generates the real ones.*
- **Sample-edit economics** — confirm free + non-persistent (default above), or meter like a normal report with a fresh free allowance.
- **Label treatment** — `Sample` chip + reader banner copy and styling (design pass with the content).
- **Refresh cadence** — do samples get re-generated periodically to stay current (Learning-Brain freshness), and does that re-seed silently?
