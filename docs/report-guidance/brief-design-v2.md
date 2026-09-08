# Caspr Brief — PDF Design Specification v2

*For: Engineering (Jayant's team)*
*Owner: Joy (Marketing) · Version: 2.0 · Last updated: 2026-07-09*
*Reads alongside: `report-style-guide.md` (the master system — this document specifies Brief-only deviations)*
*Supersedes: `brief-design.md` (kept as v1 reference)*

---

## How to read this document

The master design system (`report-style-guide.md`) governs all Caspr output. This document specifies only what is **different** for Briefs. Where this document is silent, the master system applies. Where this document conflicts with the master system, this document takes precedence for Brief output.

The primary changes from v1 are: the cover panel is simplified from a dashboard (3 stats + 3 findings) to a single dominant stat and a single finding; the infographic page becomes a formal centrepiece element with finding-style heading and a red left-edge rule; the last page is eliminated; and a red rule closing treatment replaces it.

---

## What is explicitly removed for Briefs

| Element | In Study / Intelligence | In Brief |
|---|---|---|
| Table of contents | ✓ | ✗ — not needed at 3–5 pages |
| Section opening pages (dark transition pages) | ✓ | ✗ — section header does the transition job |
| Executive Summary section | ✓ | ✗ — cover panel replaces it |
| Two-column layout | ✓ | ✗ — single column throughout |
| Running header (left side — section finding) | ✓ | ✗ — right side only (Brief title) |
| Sub-headers (1.1, 1.2 level) | ✓ | ✗ — sections have no sub-sections |
| Opening orientation paragraph | ✓ | ✗ — cover panel replaces it |
| Scope / subtitle line on cover | Study: ✓ | ✗ — Brief cover carries the single-finding panel |
| **Last page** | Study: ✓ | ✗ — eliminated for Brief |
| **Cover: 3 callout stats layout** | — | ✗ — replaced by 1 dominant stat |
| **Cover: 3 key findings layout** | — | ✗ — replaced by 1 dominant finding |

---

## Page count target

| | v1 spec | v2 spec |
|---|---|---|
| Total pages | 5–7 | **4–6** |
| Cover | 1 | 1 |
| Infographic page | 0–1 | **1** (required when infographic is produced) |
| Body pages | 3–5 | **2–4** |
| Last page | 1 | **0 — eliminated** |

---

## 1. Cover Page

The Brief cover establishes the premium register and surfaces the single most analytically significant number and conclusion from the Brief. A reader who only sees the cover should have the headline finding and the order-of-magnitude number in their head.

### Structure

Two vertical zones.

---

#### Zone 1 — Upper (~40% of page height)

Full-bleed sector-relevant image, dark-treated (brightness/overlay spec: `report-style-guide.md §4.3`).

Elements (bottom-left positioning, same as Study/Intelligence):
- Caspr red dot mark + **1 depth indicator line** (17px) — top left
- **BRIEF** badge pill — bottom left, above title
- Brief title — white, 36–44pt Bold, bottom left
- Date — below title, 8pt Regular, `rgba(255,255,255,0.32)`
- Caspr. wordmark — bottom right

---

#### Zone 2 — Lower (~60% of page height)

`caspr-grey-dark` (#1A1A18) flat-colour panel. A 1px caspr-rule at 20% opacity marks the zone boundary.

**Zone 2 carries three elements:**

---

**Element A — Topic label**

Typography: 6.5pt Semi Bold, ALL CAPS, letter-spacing 0.18em, `rgba(255,255,255,0.24)`.

Format: `[BRIEF TYPE] — [TOPIC SCOPE]`

Position: top of panel, 24–28px below zone boundary.

---

**Element B — Single dominant stat**

One number — the most analytically significant figure in the Brief.

- Number: 60–68pt Bold, `caspr-red`
- Unit qualifier (e.g. "trillion", "%", "bn"): 36pt Bold, `caspr-red`, 75% opacity — inline after the number, slightly smaller
- Sub-label: 10–11pt Regular, `caspr-grey-mid`, 1–2 lines, directly below the number, max 12 words

Vertical position: 36px below the topic label.

Caspr selects the single most analytically significant number from the Brief content. It must be a number the reader needs before anything else.

---

**Mid-rule**

1px horizontal rule at `rgba(214,212,207,0.12)`, full panel width. 36px above and below.

---

**Element C — Single dominant finding**

One sentence — the primary analytical conclusion of the Brief.

Typography: 13–14pt Regular, `rgba(255,255,255,0.78)`, line-height 1.65, max width 620px.

This is a conclusion, not a topic description. Same rule as section headers: it states what is true, not what the section covers.

This finding is the same as the first bullet in the Key Takeaways closing block.

---

**Zone 2 footer**

Two rows:

Row 1 (standard): section label left · page number centre · Caspr. wordmark right. Above this, a 1px rule at 12% opacity.

Row 2 (micro-disclaimer): 6–6.5pt Regular, `rgba(255,255,255,0.20)`. One sentence: methodology statement, informational disclaimer, date, copyright. Approximately: *"Informational purposes only. Not investment or professional advice. Data as at [Month Year]. Sourced, assessed and concluded by Caspr; every claim cited to source. © [Year] Caspr."*

The micro-disclaimer in the cover footer **replaces the last page** for Brief format. It is not repeated prominently in body footers (see §5).

---

### Cover — complete visual hierarchy (top to bottom)

```
[photo zone — 40%]
  ↳ Caspr dot + 1 depth line           top-left
  ↳ BRIEF badge                        bottom-left of photo zone
  ↳ Brief title                        bottom-left of photo zone
  ↳ Date                               below title
  ↳ Caspr. wordmark                    bottom-right of photo zone

[1px boundary rule at 20% opacity]

[dark panel — 60%]
  ↳ Topic label (ALL CAPS, 24% white)  top of panel
  ↳ Single dominant stat (red)         36px below label
  ↳ Mid-rule (12% white)               36px below stat
  ↳ Single dominant finding (78% white) 36px below rule
  ↳ [breathing room]
  ↳ Footer row 1: label · pg · Caspr.  bottom of panel
  ↳ Footer row 2: micro-disclaimer     below row 1
```

---

## 2. Infographic Page

When Caspr produces an infographic as part of Brief output, it becomes a **centrepiece page** — not an appendix, not a compressed element. The infographic is the visual argument; it carries the weight of the executive summary.

### Treatment

**Left-edge rule:** A 4px vertical rule in `caspr-red` runs the full height of the page on the left edge (outside the margin). This is a visual signal: the infographic page is a designated analytical set-piece, not a standard body page.

**Finding-style heading:** The infographic page heading is a conclusion, not a label. Not "Visual Executive Summary" or "Market Overview." Instead: a one-sentence statement of the primary insight the infographic demonstrates.

Typography: 14–15pt Bold, `caspr-black`, line-height 1.4, max width 640px. 28–32px below top of page content area.

A thin horizontal rule (`caspr-grey-light`, 1px) separates the heading from the infographic content below.

**Infographic content:** The team's analytical infographic — which may be a grid of callout cards, a workflow, a comparison chart, or any other visual structure. No constraints on complexity: the infographic can be as rich as the analysis demands. The centrepiece treatment (finding heading + red left rule) provides the frame; the content fills it.

**Standard footer:** The body footer with micro-disclaimer second row (see §5). The left-edge rule does not extend into the footer.

---

## 3. Interior Page Architecture

### General

- **Single column throughout.** No two-column layout.
- Margins: identical to master spec (25mm top, 20mm bottom, 22mm left/right).
- Body text: 10–11pt Regular Inter, 1.4× leading.

### Page header

Right side only: Brief title (abbreviated to ≤ 40 characters), 8pt Regular, `caspr-grey-mid`. Left side: empty.

### Page footer

Two rows, same as cover Zone 2 footer:

Row 1: section label left · page number centre · Caspr. wordmark right.

Row 2: micro-disclaimer, 6–6.5pt, `caspr-grey-light` (#B8B6B0 on white). The disclaimer text is the same across every page and the cover. It is quiet — it should register if a reader looks for it, not interrupt the reading experience.

### Body begins at Section 1

No opening orientation paragraph. The cover has already oriented the reader.

---

## 4. Section Headers

Identical to master spec. No exceptions.

- Section number in `caspr-red`
- Finding in Semi Bold 13.5–16pt (a conclusion, not a topic)
- 2–3pt `caspr-red` horizontal rule, full text width, 6pt below header
- 20pt spacing above each section header

---

## 5. Body Copy and Tables

The analytical frame rule is mandatory.

**Every table must be preceded or followed by 1–3 sentences of interpretation.** The paragraph states what the data means — not what the table contains. This is what separates a Brief from a list of facts.

**Maximum one table per section.** Use tables only where tabular format genuinely serves the data.

All table styling from master spec §9: black column headers, alternating row banding, source line mandatory, one key figure per table.

---

## 6. Charts

**Default: zero charts per Brief.**

One chart is permitted if the visual pattern is the finding — a trend line, a stark comparison. Never more than one chart in a Brief regardless of length.

If an infographic page is present and contains charts, the "maximum one chart" applies to the infographic; no additional charts in the body.

---

## 7. Callout Stats

**Maximum one callout stat per Brief, discretionary.**

Only use if a single number is the headline finding of a body section. Place it inline, full-width centred, on the page where the number is most analytically significant.

The interior callout stat must be a different number from the single stat on the cover.

Sizing: 48–56pt Bold, `caspr-red`.

---

## 8. Key Takeaways Closing Block

The final content element of every Brief. Placed at the bottom of the last body page.

### Structure

**Block background:** `caspr-grey-light` (#F2F1EF), full text width, 18px vertical padding.

**Label:** "KEY TAKEAWAYS" — 8pt Bold, ALL CAPS, `caspr-black`, letter-spacing 0.16em.

**3 bullets:**
- 5×5px `caspr-red` square prefix
- Finding text: 10–11pt Semi Bold, `caspr-black`, single line where possible
- The first bullet matches the single dominant finding on the cover

---

## 9. Brief Closing Treatment

Immediately below the Key Takeaways block, still on the last body page, before the footer.

### Structure

**Red rule:** A 2px horizontal rule in `caspr-red`. Width: 2/3 of the content column (66.7%), centred. 24px below the Key Takeaways block.

**Upsell line:** One line, 12–14px below the rule, centred.

Typography: 9–9.5pt Regular Italic, `caspr-grey-mid` (#6B6B66).

Format: *"A Study on [topic] would cover [X], [Y], and [Z] — run it from your dashboard."*

This is styled distinctly from all other body copy (italic, mid-grey, centred) to signal it is supplementary, not part of the Brief's analytical content.

**Footer follows immediately below** (standard two-row footer with micro-disclaimer).

### Visual hierarchy of the closing sequence

```
[Key Takeaways block — grey background]
    24px gap
[Red rule — 2/3 width, centred, 2px]
    12–14px gap
[Upsell line — italic, caspr-grey-mid, centred]
    [spacing to footer]
[Footer row 1: label · pg · Caspr.]
[Footer row 2: micro-disclaimer]
```

---

## 10. Last Page

**Eliminated for Brief format.**

The standard "About Caspr / methodology / disclaimer" last page is not used in Briefs. The micro-disclaimer in every page footer and the cover footer row 2 perform the same function — in fewer words, with less visual weight. Ending on the last content page is appropriate for a 4–6 page document.

---

## Pre-delivery Checklist (Brief v2-specific)

### Automated checks
- [ ] Cover: 1 depth indicator line (17px), not 2 or 3
- [ ] Cover badge reads BRIEF
- [ ] Cover panel: single stat present (`caspr-red`, 60–68pt)
- [ ] Cover panel: single finding present (78% white, 13–14pt)
- [ ] Cover footer: two rows — standard row + micro-disclaimer row
- [ ] If infographic present: left-edge caspr-red 4px rule present
- [ ] If infographic present: heading is a finding (not a label)
- [ ] No table of contents present
- [ ] No section opening pages present
- [ ] Running header: right side only (Brief title), left side empty
- [ ] No last page present
- [ ] Page footer: two rows on all pages (standard + micro-disclaimer)
- [ ] Page count: body pages 2–4 (flag if outside this range)

### Manual checks
- [ ] Cover stat is the single most analytically significant number in the Brief
- [ ] Cover finding matches the first Key Takeaways bullet (same conclusion, possibly condensed)
- [ ] No two-column layouts anywhere in body
- [ ] No sub-headers (1.1, 1.2 level) anywhere in body
- [ ] Maximum 1 table per section — every table has an analytical frame (1–3 interpretation sentences)
- [ ] Maximum 1 chart in the Brief (or zero)
- [ ] Maximum 1 interior callout stat (or zero) — a different number from the cover stat
- [ ] Key Takeaways block: caspr-grey-light background, 3 bullets with red square prefix
- [ ] Closing treatment: red rule (2/3 width, centred) immediately below Key Takeaways block
- [ ] Upsell line: italic, caspr-grey-mid, centred, references a Study specifically
- [ ] Body begins directly at Section 1 — no opening orientation paragraph
- [ ] Micro-disclaimer is identical across cover footer row 2 and all body footer row 2s

---

*Questions: Joy (Marketing). Engineering: Jayant.*
*Master design system: `docs/report-guidance/report-style-guide.md`*
*Sample file: `docs/report-guidance/reference/brief-sample-v2.html`*
