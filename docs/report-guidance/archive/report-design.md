# Caspr Report Design System
*For Jayant's team — applies to all Intelligence, Study, and Brief outputs*
*Owner: Joy (Marketing) · Version: 1.0 · Last updated: 2026-05-15*

---

## 1. Design Philosophy

Caspr reports are boardroom documents, not research papers. The visual register is **FT / Bloomberg / The Economist** — premium business press. Every design decision answers one question: *does this help a PE partner, strategy director, or consulting principal make a decision in less time?*

Three rules govern everything:

1. **Conclusions, not descriptions.** Headers, titles, and callouts carry findings — not category labels.
2. **Numbers anchor everything.** Every qualitative claim has a number beside it.
3. **White space is a feature.** Density is friction. Remove it.

---

## 2. Colour Palette

| Token | Hex | Usage |
|---|---|---|
| `caspr-black` | `#0B0B09` | Body text, headings, table cell content |
| `caspr-white` | `#FFFFFF` | Page background, table header reversed text |
| `caspr-red` | `#E8453C` | Accent only — callout stats, section number rules, key table cell highlights, Caspr wordmark |
| `caspr-grey-dark` | `#1A1A18` | Section opening page backgrounds, dark callout blocks |
| `caspr-grey-mid` | `#6B6B66` | Body text secondary, source lines, footnotes |
| `caspr-grey-light` | `#F2F1EF` | Table row banding (alternating), sidebar blocks |
| `caspr-rule` | `#D6D4CF` | Horizontal rules, table borders |

**Never use:** gradients, drop shadows, coloured section backgrounds (other than section openers), cartoon illustrations, stock photography of people.

---

## 3. Typography

### Typeface

| Role | Family | Weight | Size |
|---|---|---|---|
| Report title (cover) | Inter | Bold | 36–44pt |
| Section opening headline | Inter | Bold | 28–32pt |
| Section header (finding) | Inter | Semi Bold | 16–18pt |
| Section sub-header | Inter | Semi Bold | 12–13pt |
| Body text | Inter | Regular | 10–11pt |
| Data commentary (lead sentence) | Inter | Medium | 11–12pt |
| Table column header | Inter | Semi Bold | 8–9pt |
| Table body | Inter | Regular | 9–10pt |
| Source / footnote | Inter | Regular | 7–8pt |
| Callout stat (number) | Inter | Bold | 48–64pt |
| Callout stat (label) | Inter | Regular | 10–11pt |
| Running header | Inter | Regular | 8pt |

### Hierarchy Rules

- **Lead sentence** (the first sentence of any section): 12pt Medium, separated from body by 4pt additional top spacing. This is the finding. It must be able to stand alone.
- **Body copy**: 10–11pt Regular, 16pt line height, 1.4× leading.
- **No sentence casing in headers.** All section headers are title case. No ALL CAPS in running text (permitted only in table column headers).
- **No exclamation points.** Ever.

---

## 4. Page Grid

### Standard content page
- **Margins:** 25mm top, 20mm bottom, 22mm left, 22mm right
- **Single column** for narrative sections
- **Two column** (55%/45% split) for data-heavy sections with a companion table or callout
- **Gutter:** 8mm between columns

### Section opening page
- Full-bleed dark background (`caspr-grey-dark`)
- Section number: `caspr-red`, 48pt Bold, top-left
- Section finding: White, 24–28pt Semi Bold, centred vertically
- Supporting stat (optional): `caspr-red`, 18pt, immediately below the finding
- Remainder of page: empty — white space is intentional

### Page footer (every page)
- Left: section title (abbreviated) — 8pt, `caspr-grey-mid`
- Centre: page number — 8pt, `caspr-grey-mid`
- Right: **Caspr wordmark** — 8pt, `caspr-grey-mid` + red dot
- Thin `caspr-rule` above footer, full page width

### Page header (every page, except cover and section openers)
- Running header: section finding (not the section name) — 8pt Regular, `caspr-grey-mid`
- Right: report title (abbreviated) — 8pt Regular, `caspr-grey-mid`

---

## 5. Section Headers

**The most important rule in this document.**

Headers state findings, not topics. The reader should be able to read only the headers and understand the three decisions this report informs.

| Do not write | Write instead |
|---|---|
| Market Overview | India imports 75% of its pharmaceutical sodium from a single country |
| Competitive Landscape | Three suppliers control 60% of global capacity |
| Regulatory Environment | Greenfield approval adds 18–24 months to any capital timeline |
| Financial Analysis | Base-case IRR reaches 22% only above 6,000 tonne annual output |
| Supply Chain | China-origin supply dominates; any tariff event creates immediate margin risk |

**Format:** Section number in `caspr-red` (e.g. *1.2*), followed by the finding in Semi Bold. A 2px `caspr-red` horizontal rule, full width, sits 6pt below the header.

---

## 6. Executive Summary

The Executive Summary is not a compressed version of the report. It is a decision brief.

### Structure (mandatory)

**Opening sentence (mandatory):** One sentence stating what decision this report supports.
> *"This analysis supports a go/no-go decision on greenfield sodium production capacity in India, and identifies the three variables that determine investment viability."*

**Findings block (3–6 findings):** Each finding is a labelled block with:
- Label: e.g. **Finding 1 — Supply concentration risk is acute**
- Body: 2–4 sentences maximum. Lead with the number. End with the consequence.

**Decision sentence (mandatory, final):** A direct statement of what a reader should do next or what the data does not resolve.
> *"The data does not resolve whether to proceed — it narrows the decision to scale and timing. Below 6,000 tonnes, the economics do not justify greenfield capital."*

### Formatting
- Full-width block for each finding, separated by a 1px `caspr-rule`
- Finding label: 11pt Semi Bold, `caspr-black`
- Finding body: 10pt Regular, `caspr-black`, 1.5× leading
- Optional: key number from each finding set at 20pt Bold `caspr-red` in the right margin (two-column layout)

---

## 7. Callout Stats

For every major section, identify the one number that matters most. Give it explicit visual treatment.

### Anatomy
```
[NUMBER]          ← 48–64pt Bold, caspr-red
[short label]     ← 10pt Regular, caspr-grey-mid, max 10 words
```

**Examples:**
```
75%
of India's pharmaceutical sodium imports
originate from a single source country.
```
```
USD 2.67/kg
average import price — China-origin supply,
2024 market average.
```
```
22%
base-case IRR at 6,000 tonne
annual output.
```

### Placement
- Right column on two-column pages (callout sits beside the paragraph that references the number)
- Or full-width centred block on section transition pages
- Frequency: one per major section maximum. More than one per page dilutes impact.

---

## 8. Data Tables

Tables are the core deliverable. They must be immediately legible and credible.

### Structure rules

| Element | Specification |
|---|---|
| Column header | Inter Semi Bold, ALL CAPS, 8pt, letter-spacing 6–8%, white text on `caspr-black` background |
| Row label | Inter Regular, 9pt, left-aligned |
| Numerical cell | Inter Regular, 9pt, right-aligned |
| Row banding | Alternating: white / `caspr-grey-light` (#F2F1EF) |
| Key figure | Bold weight OR `caspr-red` text — one per table, the number the reader should act on |
| Source line | Italic, 7–8pt, `caspr-grey-mid`, right-aligned, below the table |
| Table border | 1px `caspr-rule` — outer border only. No vertical dividers between columns. |

### Mandatory source line
Every table must carry a source line. Format:
> *Source: [Primary source]. Caspr analysis.*

No table ships without this line. It is both a credibility signal and a legal requirement.

### Key figure treatment
One cell per table (maximum) may be highlighted. Use:
- `caspr-red` text weight at bold, or
- A subtle left-border rule in `caspr-red` on the row

Do not use cell background colour highlights — they reduce legibility on print.

---

## 9. Charts and Infographics

*Note: Chart generation is upstream of the report assembly process. These are specifications to pass to the chart production system.*

### Colour rules
- Primary data series: `caspr-red` (#E8453C)
- Secondary data series: `caspr-grey-mid` (#6B6B66)
- Tertiary / reference line: `caspr-rule` (#D6D4CF)
- No blue, green, orange, or purple — they break the brand palette

### Labelling
- **Direct labels preferred over legends.** Label each data series at its endpoint or highest point.
- If a legend is unavoidable, place it below the chart, left-aligned, in 8pt Regular.

### Grid lines
- Horizontal rules only, in `caspr-grey-light`, at 50% opacity
- No vertical grid lines
- No chart borders

### Chart titles
State the finding, not the subject.
- ❌ *EBITDA by Production Volume*
- ✅ *EBITDA Margin Improves Non-Linearly with Scale*

### Chart source line
Same format as table source lines. Mandatory.

---

## 10. Page Density and Rhythm

### Section opening pages
Each of the 16 major sections opens on a near-empty dark page (see §4). This is not waste — it signals transition, creates breathing room, and marks the structural hierarchy.

### Paragraph density
- Maximum 5 lines per paragraph in body copy
- 6pt spacing between paragraphs (in addition to line height)
- No paragraph longer than 80 words

### Image pages
Where a chart or table takes most of the page, the remaining space should be white. Do not add supplementary text to fill space. Incomplete-looking white space is intentional editorial restraint — it is not a layout error.

---

## 11. Cover Page

### Elements (top to bottom)
1. Full-bleed photograph — industrial / sector-relevant. No stock people photography. High-contrast, slightly dark-treated.
2. Caspr red dot mark — top left, 24px
3. Report title — Bottom left, 36–44pt Bold, white, high contrast against image
4. Report subtitle / scope — 16pt Regular, white, immediately below title
5. Report type badge — *INTELLIGENCE* or *STUDY* or *BRIEF* — 9pt Semi Bold, ALL CAPS, `caspr-red` text on white pill badge, bottom left
6. Date — 9pt Regular, white, bottom left below badge
7. Caspr wordmark — bottom right, white

### Photography brief
Photography must be:
- Industrial, infrastructural, or financial — reflecting the report's sector
- High quality, editorial register (not Shutterstock lifestyle)
- Dark enough in the bottom-left quadrant to maintain white text legibility over it

---

## 12. Report Type Differentiation

| Type | Pages | Sections | Callouts | Depth |
|---|---|---|---|---|
| **Brief** | 15–25 | 4–6 | 1–2 | Market sizing + key players + recommendation |
| **Study** | 40–70 | 8–12 | 4–6 | Full landscape + competitive + financial model |
| **Intelligence** | 80–150 | 14–18 | 8–12 | All Study content + regulatory + build/buy/partner scenarios |

All three types use the same design system. The cover badge distinguishes them.

---

## 13. Voice Guidelines (Copy)

These apply to all body copy, section intros, and Executive Summary.

### Write conclusions, not descriptions
Every paragraph must advance an argument. Introductory topic sentences (*"This section examines the market for..."*) are deleted.

### Hedge the conditions, not the findings
- ❌ *"Prices may increase if tariffs are imposed."*
- ✅ *"Under a 15% tariff scenario, spot prices reach USD 4.20/kg — a level that eliminates margin for most finished goods manufacturers."*

### Add the consequence sentence
After any data-heavy paragraph, add one plain-English sentence:
> *"This means [consequence for the reader]."*

### Remove hedging language
These phrases are deleted on sight:
- *"It is worth noting that..."*
- *"One could argue that..."*
- *"This suggests that the market may be..."*
- *"Interestingly..."*
- *"It is important to..."*

### Numbers first
Lead with the number, then the context.
- ❌ *"The market has grown significantly, with a CAGR of 12%."*
- ✅ *"12% CAGR over five years — faster than any adjacent segment."*

---

## 14. Quality Checklist (Pre-Delivery)

### Copy
- [ ] Every section header states a finding, not a topic
- [ ] Executive Summary opens with the decision the report supports
- [ ] Executive Summary closes with what the data does not resolve
- [ ] Every paragraph has a consequence sentence or a number
- [ ] No hedging language (see §13)
- [ ] No exclamation points

### Data and Tables
- [ ] Every table has a source line
- [ ] One key figure per table is highlighted
- [ ] Row banding applied consistently
- [ ] Column headers: ALL CAPS, Semi Bold, white on black header row

### Visual
- [ ] One callout stat per major section
- [ ] Section opening pages: dark background, finding, white space
- [ ] Caspr wordmark in footer on every page
- [ ] Running headers carry the section finding, not the section name
- [ ] Chart titles state findings, not subjects
- [ ] `caspr-red` used as primary chart series colour

### Brand
- [ ] No gradients, no drop shadows, no coloured section backgrounds (except dark section openers)
- [ ] No stock photography of people
- [ ] No exclamation points
- [ ] No language from the rejected list (see brand-guidelines.md §Rejected Language)

---

*This document is the authoritative design specification for all Caspr report outputs. Questions: Joy (Marketing).*
