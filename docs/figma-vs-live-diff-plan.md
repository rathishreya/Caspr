# Figma ↔ Live Website Diff — Execution Plan

**Goal:** produce one consolidated list of every difference between the Figma design file
and the live site, each item sorted into exactly one of four categories.

**Figma file:** `rmurwf7WT9B4kKhXcju3ro` (Caspr.ai — Website Redesign)
**Live site:** https://new.caspr.ai
**Code:** `caspr-web/` (Next.js App Router)

---

## Categories (the required output)

| # | Category | Meaning | Action later |
|---|---|---|---|
| 1 | **Different — match to Figma** | Live drifted from an intentional design decision | Fix the website |
| 2 | **Different — keep website** | Live is a deliberate, later improvement; Figma is stale | Update Figma (or ignore) |
| 3 | **Missing on website — add from Figma** | Designed but never built | Build it |
| 4 | **Missing in Figma — FYI only** | Built after the design freeze | No action |

**Category 1 vs 2 is the whole value of this exercise.** Every row needs a one-line
reason, not just a verdict.

---

## Scope (approved)

The live site renders all 7 ICP pages from a single `ICPLayout` component, and the
header/footer from one `Header`/`Footer`. So diffing all 16 Figma pages independently
would repeat identical component-level findings 7×. Instead:

| Pass | Surface | Figma node | Live route | Depth |
|---|---|---|---|---|
| A | Header / Footer / Trust Strip | `14:3`, `19:16`, `317:2` | any page | Full — once, applies everywhere |
| B | Homepage | `14:2` (+ mobile `20:2`) | `/` | Full |
| C | Pricing | page `64:2` | `/pricing` | Full |
| D | ICP template (Consulting as representative) | page `71:2` | `/consulting` | Full — findings apply to all 7 |
| E | Academic | page `402:189` | `/academic` | Full (recently changed — expect many Cat 2) |
| F | Remaining ICP pages ×6 | pages `74:2`, `76:2`, `80:2`, `81:2`, `82:2`, `398:189` | `/strategy` etc. | Passes 1–2 + copy (never copy-only — see below) |
| G | Standalone pages | `78:2`, `83:2`, `406:189`, `84:2`, `569:2` | `/enterprise`, `/about`, `/security`, `/privacy`+`/terms`, 404 | Passes 1–2 + copy |
| H | Live-only routes | — | `/vs/*`, `/use-cases/*`, `/samples`, `/customers`, `/corporate-dev`, `/blog`, `/careers`, `/contact`, `/refund` | List as Category 4 |

---

## Method per surface

**Run the passes in this order. Structure before copy — deliberately.**
The most common real-world defect is *right copy, wrong component*: the build grabbed
the nearest existing component instead of the one designed. A text diff returns a false
"match" for those, so a copy-first method structurally cannot find them.

### Pass 1 — Section inventory (catches Cat 3 / Cat 4)
List the top-level section frames in Figma (`get_metadata`) and the `<section>` elements
live. Compare presence and order.

### Pass 2 — Structural fingerprint (catches component mismatch) ← **the pass that matters**
For each section, describe its **shape**, not its words. Record for both sides:

- Which **component archetype** is used (numbered editorial card / pricing card / plain
  column / accordion / strip)
- Ordered list of **element roles**: numeral? eyebrow label? serif title? price — and at
  what visual weight? divider? description? bullet list? CTA button?
- **Bullet marker glyph** (dot ellipse vs em-dash vs check)
- **Presence or absence of a CTA** inside the card
- Card count and grid columns

Then ask explicitly: *does live use the component Figma designed for this section, or a
different one reused from elsewhere?* Any mismatch → Category 1, labelled
**"component mismatch"**.

> Worked example (found in the pilot): `/pricing` → "WHAT YOU GET" / Analysis Types.
> Figma designs a numbered editorial card (big `01`, serif "Brief" title, small inline
> `$15 · ~15 min · 1–3 pages` meta row, dot bullets, **no CTA**). Live reuses
> `AnalysisCard` (uppercase `BRIEF`, **56px $15**, "per analysis", em-dash bullets,
> **plus a CTA button**). Copy is identical — a text diff scores this a perfect match.

### Pass 3 — Visual comparison (screenshot pair)
For each section, put the Figma frame screenshot and a live screenshot of the same
section, captured at the **same viewport width (1440)**, side by side and compare.
This is the backstop for anything Pass 2's checklist didn't name — type scale, colour,
weight, density, alignment, spacing rhythm.

### Pass 4 — Copy and numbers
Only now diff the strings: headline, subhead, body, CTA labels, FAQ Q&A, then prices,
stats, source counts, timings.

### Pass 5 — Categorise
Assign 1–4 with a one-line reason.

**Measure, don't eyeball.** Widths/sizes/weights must come from `getBoundingClientRect()`
/ `getComputedStyle()`, not from looking at a screenshot. (A screenshot-eyeballed width
call already produced a wrong conclusion once in this project.) Use screenshots for
*gestalt* comparison, numbers for *claims*.

---

## Known priors — seed these, then verify

Already established in earlier sessions; do not re-litigate, but do confirm:

- **Logo/wordmark** — Figma shows the old Source Serif "Caspr."; live uses the new
  outlined Instrument Serif wordmark with the true-circle red dot. → **Category 2**
  (deliberate, approved, shipped). Figma should be updated.
- **Fonts generally** — Figma predates the font decisions; treat font drift as Cat 2
  unless it contradicts the current design guidelines.
- **Academic pricing** — Figma "05 Pricing Strip" shows 3 inline blocks ($8/$40/$300)
  and "first $100"; live now shows 2 centered cards with struck-through standard
  pricing, "Academic rate", $150 CTAs, Intelligence note. → **Category 2** (approved
  and shipped this week).
- **Favicon** — live uses the new "C." monogram; Figma has no favicon artboard. → Cat 4.
- **Source count** — Figma and live both say "25M+ curated sources"; the real current
  number is **25M+**. This is neither a Figma nor a live win — flag it separately as a
  **content-accuracy issue affecting both** (recommend a site-wide copy update).

---

## Output format

One markdown table, sorted by category then surface:

| # | Surface | Section | Type | Figma | Live | Category | Reason |
|---|---|---|---|---|---|---|---|

`Type` is one of: **component-mismatch** · structure · copy · number · visual · missing.
Tagging the type makes the component-mismatch findings countable — they are the ones
most likely to be under-reported.

Followed by a short summary: counts per category **and per type**, plus the top 5
highest-impact items.

---

## Note on splitting the work across models

An earlier version of this plan proposed handing the bulk pass to a cheaper model as
"pure text extraction." That is now known to be unsafe on its own: **Pass 2 and Pass 3
cannot be done by text extraction** — they are structural and visual. A text-only pass
would silently score component mismatches as perfect matches.

If the work is split:
- **Passes 1 and 4** (section inventory, copy/number diffing) are mechanical and safe
  to delegate.
- **Passes 2, 3 and 5** (structural fingerprint, screenshot comparison, categorisation)
  need a vision-capable model and product judgment. Do not delegate these to a
  text-only or small model.

---

## Guardrails

- **Do not change any code or Figma content during this exercise.** It is read-only;
  the deliverable is the list. Fixes come after Joy reviews the categories.
- When a difference is ambiguous (can't tell if it's drift or a deliberate update),
  put it in Category 1 *only* if Figma is clearly more correct; otherwise mark it
  **"needs Joy's call"** rather than guessing.
- Ignore trivial anti-aliasing / sub-pixel differences. Report a diff only if a
  reasonable person would notice or care.
