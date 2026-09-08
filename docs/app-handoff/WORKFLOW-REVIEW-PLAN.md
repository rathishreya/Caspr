# Workflow review — decisions & build plan

**Date:** 2026-08-15 · **File:** `y2F394I4CwEeSzH2kKuDCt` · **Status:** for Joy's review before the dev session resumes.

Covers the **7-point workflow review** (Joy, 2026-08-15) and the **4 open items** from `FIGMA-DECISIONS-PROMPT.md`, with the resolutions we agreed and what changes where. Nothing is executed in Figma yet — this is the package to approve first.

---

## Two cross-cutting threads

**A. The status spine** — `Learning → Analyzing → Generating → Creating`. Underlies review-3 and review-6. Shown in the eyebrow (`TYPE · DEPTH · STATUS`, already exists) **and** narrated in the chat (extending the "Initiating sourcing stage" pattern on `775:2`). `Creating` = the v1/v2 cutoff.

**B. Edit economics** — edit (free) vs. re-analyse (paid) vs. visuals (metered). Underlies review-4 and review-5. **Carved into its own living spec: `EDIT-ECONOMICS.md`** — tuned post-launch, does not block the build.

---

## Decisions — the 7-point review

| # | Decision | Figma change | Spec/doc delta | Dev impact |
|---|---|---|---|---|
| **1** | Pre-prompt title = muted **"New analysis"** (sentence case), not `...` (ellipsis is reserved for in-progress). | Welcome desktop + mobile: the current/draft entry in the recent-analyses list shows muted placeholder. | `onboarding-understanding.md` | Trivial — string + state |
| **2** | Layout-canvas **mobile drawer bg → white** (bug). | Locate the layout-canvas mobile drawer; set fill white; confirm it's a white-family drawer per the white/grey semantic. | none | Bug fix |
| **3** | The 3–5s question-wait = a **Learning state of the layout canvas**, not a new screen. Draft layout shows immediately; eyebrow + chat show **Learning** ("Checking today's sources across your pipelines…"); questions area shows a "preparing" affordance; **gentle, restrained** live revision (single settling changes, never a wholesale reflow). | New state on layout canvas, desktop + mobile: draft-layout-present + Learning status + questions-preparing + subtle revision affordance. | `onboarding-understanding.md`, `gate-output-spec.md`, + status-spine note | Real — new state + wiring to the Learning phase |
| **4+5** | **Three buckets — Minor (free, shows 0 tokens) / Substantial (metered in edit tokens) / New (identity change → new analysis, context carried).** Substantial covers new-data *angles* (e.g. tariffs); New is reserved for a *core scope change* (subject/industry/geography/analysis type). Metered in **edit tokens** bundled per tier (illustrative 15k/80k/300k), actual consumption, no pre-quote, calm balance, top-up only at the edge. Charts free; infographics/images consume tokens. **Own spec — `EDIT-ECONOMICS.md` (LOCKED model).** | The nudge pattern (existing UI, no special cost treatment); the calm edit-budget indicator; the "Start as a new analysis →" hand-off; the edge top-up prompt; the export prompt for a stale visual. | **New:** `EDIT-ECONOMICS.md` | Track, not blocker — model locked; numbers pending Jayant's cost-per-edit-token |
| **6** | **Pre-Creating changes fold into v1; post-Creating changes → v2** (queued like a post-completion Ask edit). Cutoff made visible via the status spine; at Creating start, chat line: "Finalizing your outputs — new requests will apply to the next version." | Status narration in chat (extend `775:2` pattern) for all four phases; the Creating cutoff line; eyebrow status labels. | `gate-output-spec.md` + generation-flow | Real — phase signalling + v1/v2 routing (dev has the routing; needs the Creating signal) |
| **7** | **Remove "Reset Account."** Add scoped: **Reset Profile** (Account → Research Profile), **Reset Data Room** (Data Room), **Delete all documents** (Documents). **Delete Account stays** (legal/GDPR). | Remove Reset-account from the account danger card + its confirm sheet; add the 3 scoped actions in their homes with confirm sheets; keep Delete-account. | `account-wallet-screens.md`, `ancillary-pages` | Moderate — 3 new scoped destructive actions |

**Domain mapping confirmed:** Documents = your generated analyses/reports library · Data Room = uploaded/connected source material · Research Profile = what Caspr has learned about you.

---

## Decisions — the 4 open items from `FIGMA-DECISIONS-PROMPT.md`

| # | Item | Resolution | Action |
|---|---|---|---|
| **A1** | Edit-pane chart thumbnails (9 `thumb/<kind>`) | **Draw them** as specced (76×46 slot, fixed series palette, no axes). Separate from review-1's sample-reports idea — **do both.** | Draw 9 marks beside `1373:3/20`; name `thumb/<kind>`. |
| **A1b** | Sample reports (Joy's review-1 idea) | **New onboarding workstream** — pre-populated sample reports + the conversation that made them, tagged `sample`, left post-generation so Ask/Edit/Outputs are live; visible to new + returning users until archived/deleted. | **New spec — `SAMPLE-REPORTS.md`** (open questions below). |
| **A2** | Queued-analysis centre | **No queued screen.** The theater absorbs the wait via the status spine (review-3/6). Only a rare **async fallback** ("at capacity — we'll notify you," not a position counter) *if* Jayant can't guarantee near-immediate starts. | Tell dev: don't draw the queued centre; rework the queue-with-position path. **Jayant: can generation guarantee a start within a theater window at expected load?** |
| **A3** | Ask threading gap (24 pane / 9 drawer) | **Confirmed.** Align Figma by drawing the missing precedent. | Draw a **2-turn Ask example** at both widths (pane 24 / drawer 9). |
| **A4** | Theater decode assets | **Pivoted** Nsibidi ideograms → the **Caspr alphabet cipher** (`2104:168`). Spec updated; **cultural-validation gate dissolved** (original alphabet). | Tell dev; confirm reduced-motion path still ships regardless. |

---

## New standalone specs

1. **`EDIT-ECONOMICS.md`** — written now (accompanying this). Living doc.
2. **`SAMPLE-REPORTS.md`** — **placeholder for now (Joy, 2026-08-15).** Spec the *mechanism* only: a `sample` tag, seeded across all accounts, left in post-generation state so Ask/Edit/Outputs are live, visible to new + returning users until they archive/delete. **Content is placeholder** — once the app is live, Joy generates real reports and hands their conversations + reports over to seed as the samples across all accounts. So no topics to decide now; build the plumbing, populate post-launch. (Editing a sample: treat as sandboxed-free — it's a demo — pending confirm.)

---

## Consolidated Figma tweak list (per page)

| Page | Frame / target | Change | Node |
|---|---|---|---|
| Report Creation | Welcome desktop + mobile | Muted "New analysis" placeholder for pre-prompt draft entry | locate |
| Report Creation | Layout canvas — mobile drawer | Fill → white | locate |
| Report Creation | Layout canvas desktop + mobile | New **Learning** state (draft layout + status + questions-preparing) | new frames |
| Report Creation | Generation / `775:2` | Chat status narration (4 phases) + Creating cutoff line | new content |
| Report Creation | Ask pane + drawer | 2-turn example, gaps 24 / 9 | new frames |
| Documents/Edit | Proposal card `1373:2` | 9 `thumb/<kind>` chart marks | new frames |
| Edit / reader | Visual (infographic/image) | Per-visual stale flag + pre-run revision note | locate |
| Outputs | Export flow | Stale-visual export prompt | locate |
| Profile & Wallet | Account danger card + confirm | Remove Reset-account; keep Delete-account | `1691:2` + `1646:*` |
| Profile & Wallet | Research Profile | Add **Reset Profile** + confirm | locate |
| Documents | Data Room | Add **Reset Data Room** + confirm | locate |
| Documents | Documents library | Add **Delete all documents** + confirm | locate |
| — | Theater flap | (spec only — alphabet `2104:168` ready) | done |

---

## Sequencing

- **Ready for the dev on resume:** review 1, 2, 3, 5, 6, 7 · A1 · A3 · A4 · the A2 *decision* (no queued screen).
- **Own tracks, don't block the build:** review-4 (`EDIT-ECONOMICS.md`, living) · sample reports (`SAMPLE-REPORTS.md`, onboarding).
- **Jayant dependencies:** A2 (capacity guarantee) · review-4 (corpus-vs-new-pass signal) · review-3 (question-gen timing, confirmed ~3–5s).

---

## What I do on your approval

1. Execute the Figma tweaks above (with read-backs, one reviewable batch per page-cluster).
2. Write `SAMPLE-REPORTS.md` (after the open questions land).
3. Apply the spec deltas to the existing docs.
4. Write the dev handoff — the `FIGMA-DECISIONS-PROMPT.md` response + the 7-point outcomes + the two pivots (alphabet, no-queue) + the Jayant asks — in the `FIGMA-FIX-ROUND-5-RESPONSE.md` format.
