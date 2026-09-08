# Caspr Brief — PDF Design Specification

*For: Engineering (Jayant's team)*
*Owner: Joy (Marketing) · Version: 1.0 · Last updated: 2026-06-29*
*Reads alongside: `report-style-guide.md` (the master system — this document specifies Brief-only deviations)*

---

## How to read this document

The master design system (`report-style-guide.md`) governs all Caspr output. This document specifies only what is **different** for Briefs. Where this document is silent, the master system applies. Where this document conflicts with the master system, this document takes precedence for Brief output.

---

## What is explicitly removed for Briefs

| Element | In Study / Intelligence | In Brief |
|---|---|---|
| Table of contents | ✓ | ✗ — not needed at 3–5 pages |
| Section opening pages (dark transition pages) | ✓ | ✗ — section header does the transition job |
| Executive Summary section | ✓ | ✗ — cover dashboard replaces it |
| Two-column layout | ✓ | ✗ — single column throughout |
| Running header (left side — section finding) | ✓ | ✗ — right side only (Brief title) |
| Sub-headers (1.1, 1.2 level) | ✓ | ✗ — sections have no sub-sections |
| Opening orientation paragraph | ✓ | ✗ — cover dashboard replaces it |
| Scope / subtitle line on cover | Study: ✓ | ✗ — Brief cover carries summary panel instead |

---

## Page count target

| | Master spec (outdated for Brief) | This spec |
|---|---|---|
| Total pages including cover and last page | ~20 | **5–7** |
| Body pages | — | **3–5** |
| Cover | 1 | 1 |
| Last page | 1 | 1 |

---

## 1. Cover Page — Executive Dashboard

The Brief cover does two jobs simultaneously: it establishes the premium register and it delivers the executive summary. A reader who only sees the cover should know the three numbers and the three conclusions the Brief contains.

### Structure

The cover is divided into two vertical zones.

---

#### Zone 1 — Upper (~40% of page height)

Same photo treatment as Study/Intelligence. Full-bleed sector-relevant image, dark-treated (apply the brightness/overlay spec from `report-style-guide.md §4.3`).

Elements (identical to Study cover, bottom-left positioning):
- Caspr red dot mark + **1 depth indicator line** (17px) — top left
- **BRIEF** badge pill — bottom left, above title
- Brief title — white, 36–44pt Bold, bottom left
- Date — bottom left, below title, 8pt Regular, `rgba(255,255,255,0.32)`
- Caspr. wordmark — bottom right

**What is absent on the Brief cover (vs. Study):** scope/subtitle line, 32px caspr-red horizontal rule, capability row. The lower zone replaces all of these.

---

#### Zone 2 — Lower (~60% of page height)

`caspr-grey-dark` (#1A1A18) flat-colour panel — no photograph bleeds into this zone. A 1px `caspr-rule` at 20% opacity marks the boundary between zones.

**Zone 2 is the executive dashboard. It carries three elements:**

---

**Element A — Topic label**

Top of the dark panel, 24px below the zone boundary.

Format: `[BRIEF TYPE] — [TOPIC SCOPE]`
Example: `MARKET SECTOR BRIEF — UK LOGISTICS TECHNOLOGY`

Typography: 6.5pt Semi Bold, ALL CAPS, letter-spacing 0.18em, `rgba(255,255,255,0.28)`.

---

**Element B — 3 callout stats**

Three numbers arranged horizontally across the full panel width, separated by 1px vertical rules at `rgba(214,212,207,0.15)`.

Each stat:
- Number: 36–42pt Bold, `caspr-red` — slightly smaller than interior callouts (48–64pt) to fit three horizontally
- Label: 8pt Regular, `caspr-grey-mid`, max 8 words, directly below the number

These are the same three numbers that appear in the body of the Brief — pulled from content, not generated separately. Caspr identifies the three most analytically significant numbers from the Brief output and surfaces them here.

Vertical positioning: centred within the upper half of Zone 2.

---

**Element C — 3 key findings**

Three one-line findings pulled from the Key Takeaways section of the Brief body.

Each finding:
- A small `caspr-red` dash or bullet (2×2px square, `caspr-red`) as a prefix
- Finding text: 9pt Regular, `rgba(255,255,255,0.72)`, single line
- Findings must be statements, not topics — the same rule as section headers

Vertical positioning: lower half of Zone 2, 20px above the footer rule.

---

**Zone 2 footer**

Same footer as all other pages (see `report-style-guide.md §5.3`): section label left · page number centre · Caspr. wordmark right · thin caspr-rule above.

---

### Cover — complete visual hierarchy (top to bottom)

```
[photo zone — 40%]
  ↳ Caspr dot + 1 depth line        top-left
  ↳ BRIEF badge                     bottom-left of photo zone
  ↳ Brief title                     bottom-left of photo zone
  ↳ Date                            below title
  ↳ Caspr. wordmark                 bottom-right of photo zone

[1px boundary rule at 20% opacity]

[dark panel — 60%]
  ↳ Topic label (ALL CAPS, grey)    top of panel
  ↳ 3 callout stats (horizontal)   upper half of panel
  ↳ 3 key findings (bulleted)       lower half of panel
  ↳ Footer rule + footer            bottom of panel
```

---

## 2. Interior Page Architecture

### General

- **Single column throughout.** No two-column layout.
- Margins: identical to master spec (25mm top, 20mm bottom, 22mm left/right).
- Body text: 10–11pt Regular Inter, 1.4× leading — same as master spec.

### Page header

Right side only: Brief title (abbreviated to ≤ 40 characters), 8pt Regular, `caspr-grey-mid`.
Left side: empty. The section finding does not appear in the running header for a Brief.

### Page footer

Identical to master spec: section label left · page number centre · Caspr. wordmark right.

### No opening orientation paragraph

The brief body begins directly with Section 1. The cover dashboard has already oriented the reader.

---

## 3. Section Headers

Identical to master spec. No exceptions.

- Section number in `caspr-red`
- Finding in Semi Bold 16–18pt (not a topic — a conclusion)
- 2pt `caspr-red` horizontal rule, full text width, 6pt below header

Since there are no section opening pages to do the transition work, the section header carries more visual weight. Ensure 20pt spacing above each section header (vs. the 12pt default paragraph spacing) to give the header room to signal the transition.

---

## 4. Body Copy

The analytical frame rule is mandatory for Briefs.

**Every table must be preceded or followed by 1–3 sentences of interpretation.** The paragraph does not describe what the table contains — it states what the table means. Without this frame, the table is data. With it, the table is analysis. This distinction is what separates a Caspr Brief from an LLM response.

All other copy rules from master spec §11 apply without modification.

---

## 5. Tables

**Maximum one table per section.** Use tabular format only where it genuinely serves the data — competitor comparison, deal activity, player profiles, regulatory requirements. Not every section needs a table.

All table styling from master spec §9 applies: black column headers, alternating row banding, source line mandatory, one key figure per table.

---

## 6. Charts

**Default: zero charts per Brief.**

One chart is permitted if the visual pattern is the finding — a trend line showing market growth acceleration, a bar comparison that cannot be absorbed from a table. Never more than one chart in a Brief regardless of length.

All chart styling from master spec §13 applies.

---

## 7. Callout Stats

**Maximum one callout stat per Brief, discretionary.**

Only use if a single number is the headline finding of the Brief. It is not one per section (that is Study behaviour). Place it inline, full-width centred, on the page where the number is most analytically significant.

Note: the cover dashboard carries three callout stats. The interior callout stat (if used) should be a different number — not a repeat of one of the three already on the cover.

Sizing: 48–56pt Bold, `caspr-red`. Same anatomy as master spec §8.

---

## 8. Key Takeaways Closing Block

The final section of every Brief body. Replaces the "decision sentence" of a Study Executive Summary.

### Structure

**Block background:** `caspr-grey-light` (#F2F1EF), full text width, 12px vertical padding. This is a light block — not a dark section opener. The lighter treatment signals "this is the close" without the visual weight of a section transition.

**3 findings bullets:**
- Small 2×2px `caspr-red` square prefix
- Finding text: 10pt Semi Bold, `caspr-black`
- One line each — same discipline as cover findings
- These are the same findings that appear on the cover dashboard

**Study upsell line:**

One line, below the block, separated by 12px.

Typography: 9pt Regular Italic, `caspr-grey-mid`.

Format: *"A Study on [topic] would cover [X], [Y], and [Z] — run it from your dashboard."*

This line is styled differently from all other body copy (italic, mid-grey) to signal it is supplementary, not part of the Brief's analytical content.

---

## 9. Last Page

Identical to master spec §15. No modifications for Brief.

---

## Pre-delivery Checklist (Brief-specific)

Items that differ from or supplement the master spec checklist:

### Automated checks
- [ ] Cover: 1 depth indicator line (17px), not 2 or 3
- [ ] Cover badge reads BRIEF
- [ ] Cover has no scope/subtitle line
- [ ] No table of contents present
- [ ] No section opening pages present
- [ ] Running header: right side only (Brief title), left side empty
- [ ] Page count: body pages are 3–5 (flag if outside this range)

### Manual checks
- [ ] Cover dashboard: 3 callout stats present, horizontally arranged with separator rules
- [ ] Cover dashboard: 3 key findings present, match Key Takeaways in body
- [ ] Cover callout stat numbers match numbers cited in body — no discrepancy
- [ ] No two-column layouts anywhere in body
- [ ] No sub-headers (1.1, 1.2 level) anywhere in body
- [ ] Maximum 1 table per section
- [ ] Maximum 1 chart in the entire Brief (or zero)
- [ ] Maximum 1 interior callout stat (or zero) — and it is a different number from the 3 on the cover
- [ ] Every table has an analytical frame (1–3 sentences of interpretation)
- [ ] Key Takeaways block: caspr-grey-light background, 3 bullets
- [ ] Study upsell line: italic, caspr-grey-mid, below Key Takeaways block
- [ ] Body begins directly at Section 1 — no opening orientation paragraph

---

*Questions: Joy (Marketing). Engineering: Jayant.*
*Master design system: `docs/report-guidance/report-style-guide.md`*
