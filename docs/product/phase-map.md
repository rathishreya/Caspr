# Phase map — what ships when

**Locked 2026-08-21 (Joy).** Supersedes the scattered "Phase 2" and "Coming soon" markers across `api-spec-v2.md`, `DEV-HANDOVER.md`, `architecture-alignment-*.md`, `app-shell-framework.md` and `data-room-screens.md`. Where any of those disagrees with this file, this file wins.

Phase 1.5 is new. It exists because a set of items were parked as "Phase 2" that are **small, self-contained, and worth having well before** the deep work on Insights and Updates.

---

## Phase 1 — launch

| Item | Note |
|---|---|
| **Infographic Regenerate** | Moved out of Phase 2. It calls an API of Jayant's that **already works** — there was never a build reason to defer it |
| **User-education layer** | Moved out of Phase 2. **Activation is the broken metric** (1,500 signups, ~0.1% conversion); education is the direct lever, so deferring it defers the fix |
| **The Signal** | Not ours to phase. Jayant's team is building it and will include it when the AI behind it lands |

**On user education vs the walkthrough** — these are different builds and must not be conflated:

- **User education (Phase 1)** — *contextual, in place.* What a Study is, what depth buys you, why a source is cited. It answers a question at the moment it arises.
- **Walkthrough (Phase 1.5)** — *a guided tour.* Coach marks and a sequence on first run. It teaches before the question arises.

One is reference, the other is a tour. Build the reference first.

## Phase 1.5 — after launch, before the deep work

| Item | Note |
|---|---|
| **Custom templates** | $1,000 one-time per template · three for $2,500 · Business and above may purchase · Enterprise includes the first. Mechanics in §"The custom-template offer" below. `gate-output-spec.md` §5 |
| **Revised Get Help** | |
| **Walkthrough help** | Guided first-run tour — distinct from the Phase 1 education layer above |

## Phase 2 — the deep work

| Item |
|---|
| **Insights** |
| **Updates / What Changed** |
| **Intelligence depth** |
| **Connect-a-source** |

## Not phase-gated — these ship when a deal requires them

Per-user envelope encryption · EU data residency. Both are enterprise-procurement driven, not roadmap items.

## Unplaced — need a ruling

| Item | Why it needs one |
|---|---|
| **Alerts / notification centre** | `app-shell-framework.md` §7 says the bell is a **stub** until designed. A bell that does nothing when clicked is a **visible defect at launch**, not a missing feature. Either design it for 1.5 or hide the bell |
| **Output watermarking** | Now overlaps the **EU AI Act 50(2)** marking we need regardless (`ai-disclosure-spec.md` §2.2 — XMP/OOXML provenance fields). Same export pipeline. Doing them separately costs twice |

---

## The custom-template offer

### What it is

A one-time setup that maps a firm's brand onto Caspr's report structure. Once set, it applies to **every subsequent report** — unlike a designer's template, which still has to be filled by hand each time.

**Repeatable per user.** Consultants and agencies work across client brands; people change jobs. This is per-template, not a one-per-account unlock.

### Price, and why it is deliberately under the substitute

**$1,000 per template. Three for $2,500.**

A boutique agency charges **$1,500–3,500** for a branded deck template; $2,000–5,000 for a comprehensive one. We sit under that on purpose — the number must clear without deliberation, and **the first template's real job is to qualify an Enterprise lead**, not to earn margin. A consultant billing $200–400/hr who currently restyles each export spends 2–4 hours a report; at ten reports a year that is $4,000–16,000 of billable time.

**The proposal must state the comparison out loud** — *"less than a design agency charges for the template alone, and this one applies itself to every report you run after it."* Otherwise a low price reads as low value.

### Where the nudge lives — and where it does not

**Not top-right of the reader.** That is the dark title card carrying `57 PAGES · VER 1 · JUL 13, 2026`. A commercial chip there competes with document metadata and would be the only advertisement in the product.

**In the Outputs pane, as a format the user does not have yet:**

> **Your firm's template** · Reports in your own format — one-time setup · `Request ›`

That pane already lists PDF, PPTX and CSV and filters by format, so the row reads as product surface rather than marketing. Same row on both breakpoints — it reuses the existing output-card pattern, no new component.

Plus **one line in product voice after a download**: *"That export can come in your own template."*

### When it fires

**Trigger on export, not on first view.** The format pain is not visible while reading — it becomes visible when the PPTX opens in the user's own world and does not match the house deck. Ideally the **second** export, so it is a pattern rather than a one-off.

**Gates — all must hold:**

1. **Paid.** Never on free trial — it competes with the $200/mo decision, and two commercial asks at once means neither lands
2. **Format-sensitive ICP** — consulting · agencies · market research · corp dev. Academics and solo founders have no company format; to them it is noise
3. **No template yet**
4. **≥2 reports**
5. **Not dismissed** — on dismissal, suppress for N reports

### The flow

1. Row appears in Outputs; the post-export line appears after a PDF/PPTX download
2. `Request ›` opens the existing composition at `/help/message`, **pre-filled with report ID, type, depth, tier, formats used and ICP** — the team should not have to ask what the product already knows
3. **State changes to "Requested · reply within one business day."** Without this the user clicks twice and feels ignored
4. Team responds with the commercial proposal
5. On acceptance `template_id` is populated and the row becomes their template

### The email

Yes — but one line, **below** the primary "view report" CTA, never competing with it. Same gates as above. On report #1 it is presumptuous; by report #3 it is obvious.

### The commitment this creates

**SLA — two hours. Settled (Joy, 2026-08-21).**

This is design, not just operations: **the UI states the promise back to the user**, so the number is copy. It appears in exactly three places, all now reading *2 hours*:

| # | Where | String |
|---|---|---|
| 1 | Outputs row, requested state | *Requested · reply within 2 hours* |
| 2 | Confirmation after sending at `/help/message` | *Requested · we'll reply within 2 hours* |
| 3 | Report-ready email, the nudge line | *…we'll reply within 2 hours* |

**No qualifier. The SLA is met round the clock, all year (Joy, 2026-08-21).** So the string stays unqualified — *"within 2 hours"*, full stop. No coverage-hours footnote, no time-aware variant saying *"first thing tomorrow"*, no timezone. A request at 23:00 is answered by 01:00.

**Do not let a later reader "soften" this into business hours.** An unqualified promise that turns out to be qualified is worse than never making it; this one is deliberate and it is resourced.

**And it is a selling point, not just an operational commitment.** The alternative the buyer is comparing against — a design agency — replies in days. Two hours, any hour, is worth saying out loud in the commercial proposal and worth the sales team knowing.

The rule underneath: **the product must never promise faster than the inbox can answer.** Here the inbox answers, so the product may promise.

---

*Design session · 2026-08-21. Pricing lands in `../../.agents/pricing-model.md` §14 and `gate-output-spec.md` §5.*
