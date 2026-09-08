# Figma ↔ Live Website — Consolidated Difference List

**Figma:** `rmurwf7WT9B4kKhXcju3ro` (Caspr.ai — Website Redesign) · **Live:** https://new.caspr.ai
**Method:** [`figma-vs-live-diff-plan.md`](figma-vs-live-diff-plan.md) — structure before copy. All widths, sizes,
weights and colours measured via `getBoundingClientRect()` / `getComputedStyle()` at a 1440 viewport, not
eyeballed. Read-only: no code and no Figma content was changed.

---

## The list

| # | Surface | Section | Type | Figma | Live | Cat | Reason |
|---|---|---|---|---|---|---|---|
| 1 | All 7 ICP pages | 05 Pricing Strip | **component-mismatch** | 380px strip: serif headline left, 3 inline price blocks ($15 / $80 MOST POPULAR / $300) with one-line descriptors, single red CTA far right | 931px three-card `AnalysisCard` grid: bordered cards, "per analysis", mono duration, 4–5 em-dash bullets each, **three** CTAs, middle card inverted black | 1 | Build grabbed the pricing card from the homepage instead of the designed strip. Widest-reach defect in the audit — 7 pages. Live bullet lists don't exist in Figma at all |
| 2 | /pricing | 04 Analysis Types | **component-mismatch** | Numbered editorial card: red serif `01`, bold sans "Brief", one inline meta row `$15 · ~15 minutes · 1–3 pages` (red dot separators), rule, description, **red dot** bullets, **no CTA**, all 3 cards identical white | `AnalysisCard`: no numeral, uppercase `BRIEF`, 56px `$15`, "per analysis", mono meta row, **em-dash** bullets, **CTA button**, middle card inverted + `MOST POPULAR` | 1 | The pilot finding, confirmed and larger than described. Copy is byte-identical, so a text diff scores it a perfect match. Side effect: /pricing now shows "MOST POPULAR" twice on one page, and a per-analysis price ladder that visually outranks the Research Budget plans above it |
| 3 | Homepage | 02 Hero | visual | Subhead `#9B9A93` (dark-theme `--text-secondary`) | `#5C5A55` (dark-theme `--text-**tertiary**`) | 1 | Wrong token applied. The hero's only supporting sentence renders visibly dimmer than designed on the near-black background |
| 4 | /pricing | 06 Enterprise Strip | visual | "Talk to us →" = **white filled**, dark label | Black filled + faint border on a near-black section | 1 | The button all but disappears. Same defect class as #5 |
| 5 | /pricing | 03 Pricing Plans | visual | Enterprise card CTA "Talk to us" = white with hairline border (ghost) | Black filled | 1 | Secondary/ghost button variant renders dark-on-dark |
| 6 | /pricing | 03 Pricing Plans | visual | Professional card CTA "Start Free" = **red** filled | Black filled | 1 | Only the Business card keeps the red. Weakens the entry-tier CTA |
| 7 | /pricing | 03 Pricing Plans | visual | Feature bullets = 5px **red dot** ellipse | Em-dash `—` | 1 | Repeats in all three cards |
| 8 | Homepage · /pricing · all 7 ICP | Hero proof row | visual | Bullet separators **red** | Grey | 1 | Same marker-colour drift as #7 |
| 9 | Homepage | 02 Hero | structure | "See a sample report →" **stacked** below the CTA button (16px gap, left-aligned) | Inline, to the right of the button | 1 | ICP pages *are* designed inline — this is homepage/final-CTA-specific, not a global pattern |
| 10 | Homepage · /pricing | 07/08 Final CTA | structure | "See a sample report →" stacked and **centred** below the button | Inline right of the button | 1 | The button + link pair is centred as a group, so the primary button is pushed left of centre |
| 11 | All pages | Primary CTA | visual | 304×48 (hero), 282–320×52 (final CTA) | 253×44 everywhere | 1 | One button size overrode three designed sizes |
| 12 | All pages | 01 Navigation | visual | Bar height 72 | 64 + 1px border = 65 | 1 | — |
| 13 | All pages | 01 Navigation | visual | CTA 160×40 | 128×44 | 1 | Narrower and taller than designed |
| 14 | All 7 ICP pages | 07 Final CTA | copy | Eyebrow `GET STARTED` | `START FOR FREE` | 1 | /about and /enterprise correctly render "Get Started", so this is ICP-template drift, not a decision |
| 15 | All 7 ICP pages | 07 Final CTA | copy | "First $100 Research Budget gifted. No credit card. No commitment." | "No credit card required. No subscription. No commitment." | 1 | Drops the $100 offer from the last CTA on the page |
| 16 | All 7 ICP pages | 07 Final CTA | copy | ICP-specific label, e.g. "Run your first **consulting** analysis free" | Generic "Start Free — first $100 on Caspr" | 1 | The pattern *is* implemented in the hero ("Run your first analysis free") — it was only dropped in the final CTA |
| 17 | /academic | 02 Hero | copy | CTA "Start with $150 free — no credit card" | "Run your first analysis free" | 1 | The academic $150 offer is lost above the fold; it survives only in the final CTA |
| 18 | All pages | 09 Footer | visual | Column headings Title Case ("Product", "Use Cases", "Trust & Legal") | UPPERCASE + letterspaced eyebrow style | 1 | — |
| 19 | Homepage | 02 Hero | visual | H1 line-height 80 (Instrument Serif 72) | 75.6 | 1 | 13px tighter across three lines |
| 20 | Homepage | 02 Hero | visual | Stack gaps 24 / 32 / 44 (eyebrow→H1→sub→CTA) | 16 / 24 / 40 | 1 | Hero reads more compressed than designed |
| 21 | All 7 ICP pages | 04b Analytical AI | visual | — | Section background `#0A0A0A` (`--ink`) sits directly against `#0C0B09` (`--surface-0` dark) neighbours | 1 | Two near-blacks stacked; one token is wrong for a page section |
| 22 | All pages | Wordmark | visual | Source Serif "Caspr." bold | Instrument Serif, outlined, true-circle red dot | 2 | Approved and shipped. Update Figma *(known prior — confirmed)* |
| 23 | /academic | 05 Pricing Strip | structure | 3 inline blocks $8 / $40 / $300 + "first $100" | 2 cards, struck-through standard price ($15→$8, $80→$40), `ACADEMIC RATE`, "Start with $150 free" CTAs, Intelligence footnote | 2 | Approved and shipped this week. **The approved design already exists in the same Figma page** as frame `PROPOSAL · Academic Pricing v2` (`1110:2`) — promote it into `05 Pricing Strip` (`402:84`) *(known prior — confirmed, with the fix identified)* |
| 24 | All pages | Mono type | visual | Inter Regular for proof rows, meta rows, stat numerals | DM Mono | 2 | `--font-mono: DM Mono` is a deliberate, consistent part of the live token set; Figma predates it |
| 25 | All pages | 09 Footer | copy | "© 2026 Caspr.ai · All rights reserved." | "© 2026 Caspr Holding Pte Ltd. All rights reserved." | 2 | Live is the correct legal entity |
| 26 | All pages | 09 Footer | copy | "Analytical AI — purpose-built for business analysis." | "…for business analysis, **not conversation**." | 2 | Matches current positioning line |
| 27 | All 7 ICP pages | 02 Hero | missing | "Client data never leaves your account. ISO 27001:2022 certified →" (/academic: "Your work stays in your account…") | Not present — the string "ISO 27001" appears nowhere on the page | **3** | Designed, never built. Security reassurance is a stated objection-handler for the consulting/investor ICPs |
| 28 | All pages | 01 Navigation | ~~missing-in-Figma~~ **structure** | **CORRECTED:** dropdowns *are* designed — `Nav / Trigger` (with `↓` caret), `Nav / Panel (open)` (6 items), `Nav Item / Hover State` (red on `#F6F5F3`) on the `🎨 Component States` page (`921:2`). The 15 page frames just draw the nav without them | Three hover dropdowns + mobile drawer. Hover state is grey text / grey row fill, not the designed red-on-`#F6F5F3` | 1 | Not a Cat 4. The page frames are the incomplete artefact, not the design. Live is right about *having* dropdowns, wrong about the **hover treatment** |
| 29 | All pages | 09 Footer | missing-in-Figma | 5 / 4 / 5 links per column | Adds Sample Reports, Category Managers, Academic, Investment Thesis, RFP Response; adds right-aligned "Caspr means Business." | 4 | Pages built after freeze |
| 30 | All 7 ICP pages | 02 Hero | missing-in-Figma | — | 3-up mono stat row: `25M+ / curated sources · <15 min / Brief turnaround · 100 pages / Study deliverable` | 4 | Added after freeze; occupies the slot the security micro-copy (#27) was designed for |
| 31 | All 7 ICP pages | 07 Final CTA | missing-in-Figma | Single button, no secondary link | Adds "See a sample report →" beside the button | 4 | — |
| 32 | /academic | 05 Pricing | missing-in-Figma | — | Footnote "Intelligence analyses are available on a standard account." | 4 | — |
| 33 | Site | Routes | missing-in-Figma | — | `/vs/*`, `/use-cases/*` (6), `/analyses/*` (3), `/samples`, `/customers`, `/corporate-dev`, `/blog`, `/refund` | 4 | Built after the design freeze. `/corporate-dev` is a full 8th ICP page with no Figma equivalent |
| 34 | Site | Favicon | missing-in-Figma | No favicon artboard | "C." monogram | 4 | *(known prior — confirmed)* |
| 35 | /pricing · 7 ICP · /security | FAQ | ~~component-mismatch~~ **visual** | **CORRECTED: Figma designs an accordion.** `FAQ / Closed` and `FAQ / Open` exist on `🎨 Component States` (`921:2`) — closed row with a `↓`, open row with `↑` + answer + divider. The page frames merely draw every item in its open state | `<details>` accordion with a `+` / `−` toggle | 1 | **Not a mismatch — live picked the right component.** The only real diffs are the toggle glyph (designed `↓`/`↑`, built `+`) and that live ships all rows *closed* while the page frames show them *open* |
| 36 | All pages | 09 Footer | structure | 360px, **one row**: brand block left, 5 link columns to its right | 685px, **stacked**: brand block on its own row, link columns full-width beneath | **Joy's call** | Live is nearly 2× the height and pushes the copyright line well below the fold on short pages. Could be a deliberate response to the extra links (#29) |

| 37 | All pages | Secondary CTA | **component-mismatch** | `Button / Secondary / Default` on `921:2` is a **bordered white button, 199×48**, hover = border darkens. (Figma's own page frames contradict this and draw it as bare text — an inconsistency *inside* Figma) | Bare text link, 14px grey, no border, no button box | 1 | Found on the component page missed in the first pass. Needs one ruling: bordered button or text link — then applied to both the page frames and the build |
| 38 | All pages | Cards | visual | `Card / Default` = 1px border, no shadow · `Card / Hover` = drop shadow, **border removed** | Cards have no hover state at all | 1 | A designed interaction that was never built |

---

## Correction notice (2026-08-18)

The first pass diffed the 16 surfaces named in the plan and missed the file's 16th **page** —
`🎨 Component States` (`921:2`) — which holds the button, card, FAQ and nav-dropdown state specs. Rows 28 and 35
above are corrected as a result, and rows 37–38 are new. Net effect: **one fewer component mismatch** (the FAQ was
built correctly), **one more** (the secondary CTA), and two Cat-4 rows move to Cat 1.

Revised counts: Cat 1 **24** · Cat 2 **5** · Cat 3 **1** · Cat 4 **6** · Joy's call **1** (footer layout only) —
**37 total**. The by-type and top-5 tables below predate this correction.

---

## Summary

### By category

| Category | Count |
|---|---|
| 1 — Different, match to Figma (fix the website) | **21** |
| 2 — Different, keep website (update Figma) | **5** |
| 3 — Missing on website (build it) | **1** |
| 4 — Missing in Figma (FYI only) | **7** |
| Needs Joy's call | **2** |
| **Total** | **36** |

### By type

| Type | Count |
|---|---|
| visual | 15 |
| missing-in-Figma | 7 |
| copy | 6 |
| structure | 4 |
| **component-mismatch** | **3** |
| missing | 1 |
| **Total** | **36** |

Three component mismatches — and every one of them has **identical copy on both sides**. A copy-first diff
would have scored all three as perfect matches and returned a clean bill of health for /pricing and all
seven ICP pages.

### Top 5 by impact

1. **#1 — ICP Pricing Strip → AnalysisCard grid.** Wrong component on 7 of 16 pages. Turns a 380px
   supporting strip into a 931px pricing section that competes with the page's actual conversion goal.
2. **#2 — /pricing Analysis Types → AnalysisCard.** Two "MOST POPULAR" badges and two competing price
   ladders on the one page whose only job is to make the Research Budget legible.
3. **#3 — Homepage hero subhead on the wrong grey token.** One-line fix, and it is the single sentence
   that has to carry "$15, no subscription" to every first-time visitor.
4. **#27 — Hero security micro-copy never built (Cat 3).** The consulting and investor ICPs both name
   client-data confidentiality as a blocking objection; the answer was designed and is missing.
5. **#14–#17 — ICP final-CTA copy drift.** The last CTA on 7 pages drops both the $100 offer and the
   ICP-specific verb the hero already gets right.

---

## Affects both sides — neither Figma nor live "wins"

- **Source count.** Both say "25M+ curated sources"; the current real figure is **25M+**. Appears in the
  hero proof row, How It Works card 02, the Engine section, the Solution cards on all 7 ICP pages, and
  /about. Recommend one site-wide copy update.
- **Placeholder social proof.** The testimonial names (Sarah Chen · James Okafor · Alex Rivera, plus the
  ICP "Senior Consultant / MBA Student" quotes) and the TRUSTED BY logo row (Meridian, Hartwell Group,
  VPC, Stonegate, Crestfield, Elara & Co.) are placeholders in **both** Figma and live. Replacing these
  with the real senior-market-research testimonials is already the highest-priority conversion asset.

## Live defects found in passing (not Figma-vs-live)

- **`/careers` and `/contact` return the 404 page** but are linked from the footer on **every** page.
- **`/blog` is a stub** — a heading and nothing else — and is linked from the primary nav on every page.
- **Trust Strip is inconsistent.** It renders on `/` and `/pricing` but not on `/consulting` (or the other
  ICP pages). Figma has no Trust Strip on the ICP frames either, so this is not a design drift — but the
  site is inconsistent with itself.

---

## Coverage

**Fully diffed (Passes 1–5, screenshot pairs at 1440):** Header · Footer · Trust Strip · `/` (all 9
sections) · `/pricing` (all 6) · `/consulting` (all 10) · `/academic` (all 10).

**Diffed structurally + by copy against Figma:** `/about` (5 sections — clean match, no findings) ·
`/enterprise` (5 sections — clean match, no findings).

**Verified live-side only, findings inherited from the ICP template:** `/strategy`, `/investors`,
`/agencies`, `/startups`, `/category-managers`. Each renders the same 10 sections and 5 FAQ accordions
from the same `ICPLayout`, so rows #1, #8, #14–16, #21, #27, #30, #31 and #35 apply to all of them.
Their **page-specific headline and body copy has not been compared against Figma** — that is the one
gap in this pass.

**Not diffed:** `/security` (9 sections live, Figma `406:189`), `/privacy` + `/terms` (Figma `84:2`),
the 404 page (Figma `569:2`), and **all mobile frames** (Figma has full mobile artboards for every page;
only desktop was compared). These are the next passes.
