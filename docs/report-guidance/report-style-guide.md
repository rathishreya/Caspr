# Caspr Report Style Guide
*For Jayant's engineering team — applies to all Brief, Study, and Intelligence outputs*
*Owner: Joy (Marketing) · Version: 1.1 · Last updated: 2026-05-16*

---

## Rendering Environment Assumption

This document assumes reports are generated via a **web-to-PDF pipeline (Puppeteer / Chromium)** at 96dpi screen resolution, exported to PDF at A4 size (210mm × 297mm).

- **pt** in this document = CSS point (1pt = 1.333px at 96dpi)
- **px** in this document = CSS pixel at 96dpi screen resolution
- **mm** in this document = millimetres at A4 print scale
- **Page size:** A4 portrait (210 × 297mm / 794 × 1123px at 96dpi)
- **Font weights:** mapped to numeric values — see §3
- **Font embedding:** **Inter** must be self-hosted and embedded in the PDF output. Do not rely on system fonts or runtime Google Fonts calls. The wordmark is a placed SVG asset, not a font — see §3.

If the rendering pipeline changes (e.g., native PDF library, InDesign plugin), measurements must be recalculated. Contact Joy before proceeding.

---

## 1. Design Philosophy

Caspr reports are boardroom documents, not research papers. The visual register is **FT / Bloomberg / The Economist** — premium business press. Every design decision answers one question: *does this help a PE partner, strategy director, or consulting principal make a decision in less time?*

Three rules govern everything:

1. **Conclusions, not descriptions.** Headers, titles, and callouts carry findings — not category labels.
2. **Numbers anchor everything.** Every qualitative claim has a number beside it.
3. **White space is a feature.** Density is friction. Remove it.

---

## 2. Colour Palette

| Token | Hex | RGB | Usage |
|---|---|---|---|
| `caspr-black` | `#0B0B09` | 11, 11, 9 | Body text, headings, table cell content |
| `caspr-white` | `#FFFFFF` | 255, 255, 255 | Page background, table header reversed text |
| `caspr-red` | `#E8453C` | 232, 69, 60 | Accent only — callout stats, section number rules, key table cell highlights, depth lines, Caspr wordmark period |
| `caspr-grey-dark` | `#1A1A18` | 26, 26, 24 | Section opening page backgrounds, dark callout blocks |
| `caspr-grey-mid` | `#6B6B66` | 107, 107, 102 | Body text secondary, source lines, footnotes |
| `caspr-grey-light` | `#F2F1EF` | 242, 241, 239 | Table row banding (alternating), sidebar blocks |
| `caspr-rule` | `#D6D4CF` | 214, 212, 207 | Horizontal rules, table borders |

**Never use:** gradients except for the single permitted photography overlay on the cover (see §4.3), drop shadows, coloured section backgrounds other than section openers, cartoon illustrations.

**People in photography:** No photographs where a human face or figure is the primary subject. Incidental background figures are acceptable in infrastructure scenes where no face is distinguishable. This rule applies to both stock and AI-generated images.

**Output format:** These reports are intended for screen reading and standard office printing. Colour values are sRGB. CMYK conversion is not required for this version.

---

## 3. Typography

### Typeface

Body, headings, tables and labels use **Inter**, self-hosted and embedded in the PDF. Do not call Google Fonts APIs at generation time.

> ### ⚠ The wordmark is not typeset — corrected 2026-08-19
>
> **The Caspr wordmark is an outlined SVG asset: [`assets/logo/caspr-logo.svg`](../../assets/logo/caspr-logo.svg).** Place the asset. Never set it as text in any typeface.
>
> **The earlier instruction to use Playfair Display Bold with a red full stop is wrong and is withdrawn.** The real mark is **Instrument Serif**, outlined to vector paths with a synthetic bold baked in as a centred stroke, and its full stop is **a true geometric red circle — the brand mark, not punctuation** (`assets/logo/README.md`).
>
> Outlining is deliberate: *"no web-font dependency… renders identically in a browser, a favicon, a PDF, a PPTX deck, or print."* That is precisely why typesetting it defeats the purpose.
>
> | File | Use |
> |---|---|
> | `caspr-logo.svg` | **master** — `currentColor`, recolour via CSS `color:` |
> | `caspr-logo-black.svg` | explicit black, for tools that ignore `currentColor` (PPTX, some PDF pipelines) |
> | `caspr-logo-white.svg` | explicit reversed, for dark grounds — section openers, the last page |
>
> The dot stays `#E8453C` in every variant, hard-coded in the SVG and not tied to `color`. Aspect ratio is **2.075 : 1** — scale by width and never distort.

### Why print is Inter-only while the app is not — this is deliberate

`docs/product/design-guidelines.md §3` locks the brand to three fonts (Instrument Serif · Inter · DM Mono) and `visual-design-language.md` sets report titles and callout numbers in **Instrument Serif on screen**. Print does not follow, and that is a decision, not drift:

> *"The PDF uses Inter because Puppeteer/print rendering benefits from a single-family document. The screen experience can be more expressive."* — `visual-design-language.md` §Report register

**So: the same report is Instrument Serif on screen and Inter in the PDF.** The rendered artefact is single-family for reliability; the screen view carries the editorial display face. Do not "fix" the PDF to match the app — the divergence is the point, and a single-family print document is materially less likely to fail at generation time.

**This is exactly why the wordmark is outlined.** Because it is vector paths rather than type, it drops into the Inter-only PDF with no font dependency and no conflict. The outlining resolves what would otherwise be a genuine clash.

**Cross-doc flag:** three documents currently name three different wordmark typefaces — this one said *Playfair Display* (now corrected), `visual-design-language.md` says *Source Serif 4 (wordmark only)*, and `design-guidelines.md` plus the shipped asset say *Instrument Serif, outlined*. **The shipped asset is the answer**; the other two are stale. `visual-design-language.md` still needs the same correction applied — flagged for Joy, not changed from here.

### Font Weight Mapping

The spec uses named weights throughout. Map these to numeric CSS values and OpenType weight numbers:

| Named weight | CSS `font-weight` | OpenType |
|---|---|---|
| Regular | 400 | Regular |
| Medium | 500 | Medium |
| Semi Bold | 600 | SemiBold |
| Bold | 700 | Bold |

### Type Scale

| Role | Weight | Size | Line height |
|---|---|---|---|
| Report title (cover) | Bold | 36–44pt | 1.1× |
| Section opening headline | Bold | 28–32pt | 1.15× |
| Section header (finding) | Semi Bold | 16–18pt | 1.25× |
| Section sub-header | Semi Bold | 12–13pt | 1.3× |
| Body text | Regular | 10–11pt | 1.4× |
| Data commentary (lead sentence) | Medium | 11–12pt | 1.4× |
| Table column header | Semi Bold | 8–9pt | 1.2× |
| Table body | Regular | 9–10pt | 1.3× |
| Source / footnote | Regular Italic | 7–8pt | 1.3× |
| Callout stat (number) | Bold | 48–64pt | 1.0× |
| Callout stat (label) | Regular | 10–11pt | 1.4× |
| Running header / footer text | Regular | 8pt | 1.2× |

**Note on source / footnote italic:** Inter Italic must be embedded alongside the Regular and Bold weights. If the build system cannot embed Inter Italic, use Regular at reduced opacity (0.75) as a fallback.

### Font Size Selection for Variable-Width Text

Cover title and section opening headlines use size ranges. Select by character count:

| Character count | Title size | Section headline size |
|---|---|---|
| ≤ 40 chars | 44pt | 32pt |
| 41–65 chars | 38pt | 28pt |
| > 65 chars | 32pt | 24pt |

If a title wraps beyond two lines at the selected size, reduce by 4pt and recheck.

### Hierarchy Rules

- **Lead sentence** — the first sentence of any section: apply Medium weight at body size +1pt, with 4pt additional top spacing. This is the finding. It must stand alone.
- **No sentence casing in headers.** All section headers are title case. ALL CAPS permitted only in table column headers.
- **No exclamation points.** Ever.

---

## 4. Cover Page

### 4.1 Element Order and Positioning (top to bottom)

All measurements below are at A4 PDF scale. For Puppeteer at 96dpi: multiply mm × 3.78 to get CSS pixels.

| # | Element | Position | Specification |
|---|---|---|---|
| 1 | Caspr red dot mark | Top left, 18px from top, 18px from left | 7px diameter circle, fill `caspr-red`. *At A4 scale: ~5mm diameter, 4.8mm from each edge.* |
| 2 | Depth indicator lines | Immediately right of dot mark, 7px gap | See §4.2. Flat `caspr-red` lines, 1px height each. No gradient. |
| 3 | Full-bleed photograph | z-order 1: behind all elements | Covers entire page. See §4.3 for spec. |
| 4 | Photography overlay gradient | z-order 2: above photograph | Dark-to-transparent layer from bottom. See §4.3. Blend mode: Normal. |
| 5 | Thin rule | Full width, above content block | 1px / 0.27mm, `rgba(214,212,207,0.2)`. Marks boundary between photo zone and content block. |
| 6 | Report type badge | Above title, bottom-left content block | See badge spec below. |
| 7 | Report title | Below badge | 36–44pt Bold, `caspr-white`, left-aligned. |
| 8 | Report subtitle / scope | Below title | 10pt Regular, `rgba(255,255,255,0.58)`, left-aligned. *Study and Intelligence only.* |
| 9 | Capability row | Below scope line | *Intelligence only.* See §4.2. |
| 10 | Footer: date + wordmark | Bottom of cover, left + right | Date: 8pt Regular, `rgba(255,255,255,0.32)`. Wordmark: right-aligned. See wordmark spec in §5.3. |

**Stacking / z-order:** Photograph (z:1) → Overlay gradient (z:2) → All text and marks (z:3+). All text and mark elements share z:3 — they do not overlap each other.

**Badge pill specification:**
- Background: `caspr-white`
- Text: 6pt Semi Bold, ALL CAPS, `caspr-red`
- Border radius: 2px
- Padding: 4px vertical, 8px horizontal
- Width: expands to fit text — do not fix width

### 4.2 Brief / Study / Intelligence Visual Differentiation

The three analysis types share one cover layout. They are differentiated by three mechanisms only.

#### Depth indicator lines

Short horizontal lines in `caspr-red`, positioned immediately to the right of the Caspr dot mark, aligned to its top edge. Each line is 1px height, flat colour — no gradient, no opacity reduction.

| Type | Lines | Widths (CSS px) | Vertical spacing between lines |
|---|---|---|---|
| Brief | 1 | 17px | — |
| Study | 2 | 21px · 13px | 4px gap |
| Intelligence | 3 | 25px · 17px · 9px | 4px gap between each |

Lines cascade in descending length. After one or two reports, a reader recognises the tier before reading the badge.

#### Badge text

`BRIEF` · `STUDY` · `INTELLIGENCE` — the primary textual differentiator. All three use identical pill treatment (see §4.1 badge spec).

#### Cover content density

| Element | Brief | Study | Intelligence |
|---|---|---|---|
| Badge | ✓ | ✓ | ✓ |
| Title | ✓ | ✓ | ✓ |
| Scope / subtitle | — | ✓ | ✓ |
| 32px caspr-red horizontal rule | — | — | ✓ |
| Capability row | — | — | ✓ |

**Capability row (Intelligence only):** Three short descriptors of the analysis types included in this report, e.g. *Regulatory Environment · Build / Buy / Partner · Multi-Scenario Model*. Each separated by a 2×2px `caspr-red` dot at 55% opacity. Font: 5.5pt Medium, ALL CAPS, `rgba(255,255,255,0.32)`.

### 4.3 Cover Image Brief

The cover photograph sets the register of the entire report before a word is read.

#### Image resolution requirements

- **Screen / web PDF (96dpi):** minimum 1500px wide
- **Print-quality PDF (300dpi):** minimum 2480px × 3508px (A4 full-bleed at 300dpi)
- Preferred format: JPEG or PNG, sRGB colour space
- No embedded ICC profiles other than sRGB

#### What the image must be

- **Sector-relevant.** A pharmaceutical production report shows a chemical plant or manufacturing facility. A financial markets report shows infrastructure at scale — a trading floor from above, an industrial port, a financial district at dusk. The image should make a reader think: *this report is about my world.*
- **Industrial or infrastructural in scale.** Facilities, structures, landscapes, systems.
- **No people as primary subject.** Incidental background figures in infrastructure scenes where no face is distinguishable are acceptable. AI generation prompts must include "no people" in the negative prompt. For stock, reject any image where a person's face is legible or where a human figure is the compositional focus.
- **High contrast, editorial register.** Infrastructure photography shot for an annual report, not a corporate brochure.

#### What to avoid

- Bright, saturated, cheerful imagery. Choose images that are naturally dark or neutral — they require less correction.
- Generic business imagery — glass office buildings, aerial city shots with no specificity.
- Anything that reads as "startup website hero image."

#### Photography overlay — the permitted exception to the no-gradients rule

A single gradient overlay on the cover photograph is permitted. This is photography treatment, not UI decoration. It is a separate layer (z-order 2) on top of the photograph, using Normal blend mode. The alpha values in the rgba stops provide the opacity — do not apply additional layer opacity.

```
bottom 0%  → rgba(11, 11, 9, 0.98)
at 28%     → rgba(11, 11, 9, 0.92)
at 52%     → rgba(11, 11, 9, 0.55)
at 72%     → rgba(11, 11, 9, 0.12)
top 100%   → rgba(11, 11, 9, 0.00)
```

No other gradient is permitted anywhere in the report.

#### Brightness and contrast filter

Apply a filter to the photograph image itself before the overlay. **Filter tier selection is a manual editorial decision.** The person curating the image selects the appropriate tier based on the dominant brightness of the image. When uncertain, apply the next tier darker.

| Image condition | CSS filter string |
|---|---|
| Naturally dark (industrial night, overcast factory, grey sky) | `brightness(0.62) contrast(1.05)` |
| Medium brightness (overcast day, interior industrial) | `brightness(0.48) contrast(1.08)` |
| Bright (daylight, colourful scene) | `brightness(0.38) contrast(1.08) saturate(0.85)` |

The `saturate(0.85)` on bright images pulls strong non-brand colours (blue, yellow, green) toward the neutral palette without full desaturation.

**For server-side image processing (ImageMagick equivalent):** CSS `brightness(B)` = ImageMagick brightness factor `(B-1) × 100`. CSS `contrast(C)` = ImageMagick contrast `(C-1) × 100`. Example: `brightness(0.38) contrast(1.08)` → ImageMagick `-brightness-contrast -62x8`.

#### Selecting from stock

Search terms that reliably return appropriate results:
- `[sector] industrial facility`
- `[sector] manufacturing plant`
- `chemical plant night`
- `pharmaceutical production facility`
- `infrastructure aerial [sector]`
- `industrial port logistics`
- `financial district architecture`
- `data centre infrastructure`

Prefer images with overcast or dusk/dawn lighting. Avoid results labelled "concept", "illustration", "3D render", "corporate", or any image where a human face is the primary subject.

#### Generating with AI

```
[sector-specific subject], industrial facility, overcast sky, editorial photography style,
high contrast, dramatic lighting, infrastructure scale, steel and concrete,
cinematic composition, photorealistic
```

Negative prompt:
```
people, faces, smiling, office, handshake, laptop, bright sunlight, cartoon,
illustration, text overlay, watermark, blurry, low contrast
```

Sector-specific subjects by ICP:

| ICP / Topic | Subject descriptor |
|---|---|
| Pharmaceuticals / Chemicals | chemical production plant, electrolytic cells, distillation towers |
| Investment / Finance | financial district at dusk, steel and glass architecture |
| Logistics / Supply Chain | container port, industrial warehouse interior, aerial freight terminal |
| Consumer / Retail | large-scale distribution centre, food production line |
| Energy | power grid infrastructure, offshore platform, pipeline network |
| Technology | data centre server rows, cooling infrastructure, fibre optic cables |
| Agriculture / Food | grain processing facility, large-scale cold storage |
| Healthcare | pharmaceutical clean room, medical manufacturing |

Generate at minimum 1500px wide. Apply the brightness/overlay treatment in preview before committing. If the image reads like a website hero section, discard it.

---

## 5. Interior Page Architecture

### 5.1 Standard Content Page

**Page size:** A4 (210 × 297mm)

**Target page counts by analysis type:**
- **Brief: 4–6 pages including cover** *(corrected 2026-08-19 — the earlier "approximately 20 pages" was stale and contradicted both `brief-design-v2.md` (4–6 total) and `brief-spec.md` (3–5 body pages). A Brief is a briefing note, not a short report.)*
- Study: approximately 60 pages including cover
- Intelligence: approximately 120 pages including cover

These are targets, not caps. Length follows analytical completeness. A 7-page Brief is acceptable; a 20-page Brief is not — at that length the reader should have been sold a Study.

**Brief layout deviations are specified separately** in `brief-design-v2.md`, which removes the table of contents, section opening pages, Executive Summary, two-column layout, and last page at this tier.

**Margins:**

| Margin | mm | CSS px (96dpi) |
|---|---|---|
| Top | 25mm | 94px |
| Bottom | 20mm | 76px |
| Left | 22mm | 83px |
| Right | 22mm | 83px |

**Reserved zones:**
- Top 10px of the top margin: running header
- Bottom 10px of the bottom margin: footer
- Body text must not enter these reserved zones

**Column layouts:**

| Layout | When to use |
|---|---|
| Single column | Narrative sections, executive summary, analysis prose |
| Two column (55% / 45%) | Data-heavy sections with a companion table or callout stat |

**Two-column widths at A4:**
- Text area: 210 − 22 − 22 = 166mm (626px)
- Gutter: 8mm (30px)
- Left column (narrative): 166 − 8 = 158mm × 0.55 = **87mm (328px)**
- Right column (table / callout): 158mm × 0.45 = **71mm (268px)**

Left column = narrative text. Right column = table, figure, or callout stat. Columns do not have borders.

### 5.2 Section Opening Page

Every major section opens on a near-empty dark page. This is not waste — it signals transition, marks structural hierarchy, and prepares the reader for the argument ahead.

**Element positioning (at A4 / Puppeteer 96dpi):**

| Element | Specification |
|---|---|
| Background | Full-bleed `caspr-grey-dark` (#1A1A18). Flat colour — no photograph, no gradient. |
| Section number | `caspr-red`, 48pt Bold. Top-left, 25mm from top margin, 22mm from left margin. |
| Section finding (main text) | White, 24–28pt Semi Bold (see §3 for size selection). Vertically centred on the page (150mm from top at A4). Left margin 22mm, right margin 22mm. Maximum 2 lines. |
| Supporting stat (optional) | `caspr-red`, 18pt Regular. 12pt below the section finding. |
| Remainder of page | Empty. This is intentional editorial restraint — not a layout error. The PDF renderer should not interpret this space as incomplete or trigger reflow logic. |

**Implementation note:** The section finding displayed on the opening page and the abbreviated string used in the running header (§5.4) both derive from the same source field in the content system. The system must store the full section finding separately from the section topic label. These are not the same string.

### 5.3 Page Footer (every page)

Present on every page including cover.

- **Left:** section title (abbreviated to ≤ 40 characters) — 8pt Regular, `caspr-grey-mid`
- **Centre:** page number — 8pt Regular, `caspr-grey-mid`
- **Right:** Caspr wordmark — the SVG asset (§3), ~14mm wide, `color: caspr-grey-mid`. The red dot keeps its own colour.
- **Above footer:** thin `caspr-rule` line (1px / 0.27mm), full text width
- **Footer clearance:** footer text sits 8pt above the bottom margin boundary

**Caspr wordmark rendering — place the asset, never typeset it** *(corrected 2026-08-19, see §3):*

```html
<!-- master, recoloured by CSS colour; dot stays #E8453C automatically -->
<svg class="caspr-mark" role="img" aria-label="Caspr" style="color:#6B6B66">
  <use href="assets/logo/caspr-logo.svg#caspr-wordmark"></use>
</svg>
```

- Scale **by width only** — aspect ratio 2.075 : 1. Never distort, never re-letter, never rebuild it in a font.
- On dark grounds (section openers, last page) use `caspr-logo-white.svg`.
- Never substitute text in any typeface, never ALL CAPS, and never a full stop character in place of the red circle.

### 5.4 Page Header (every page except cover and section openers)

- **Left:** abbreviated section finding — 8pt Regular, `caspr-grey-mid`
- **Right:** report title (abbreviated to ≤ 40 characters) — 8pt Regular, `caspr-grey-mid`
- **Header clearance:** header text sits 8pt below the top margin boundary

**Abbreviated section finding:** The full section finding is the source string. Abbreviate to ≤ 60 characters by taking the core numerical claim. Example:
- Full finding: *Three Chinese suppliers control 78% of India's pharmaceutical sodium — consolidating to one contract exposes any manufacturer to a single-point supply failure.*
- Abbreviated: *Three suppliers control 78% of sodium imports*

If the full finding is already ≤ 60 characters, use it verbatim.

---

## 6. Section Headers

**The most important rule in this document.**

Headers state findings, not topics. A reader who reads only the section headers should understand the three decisions this report informs.

| Do not write | Write instead |
|---|---|
| Market Overview | India imports 75% of its pharmaceutical sodium from a single source country |
| Competitive Landscape | Three suppliers control 60% of global capacity |
| Regulatory Environment | Greenfield approval adds 18–24 months to any capital timeline |
| Financial Analysis | Base-case IRR reaches 22% only above 6,000 tonne annual output |
| Supply Chain | China-origin supply dominates; any tariff event creates immediate margin risk |

**Format:** Section number in `caspr-red` (e.g. *1.2*), followed by the finding in Semi Bold (weight 600). Below the header: a 2pt / 0.7mm `caspr-red` horizontal rule, full text-area width, sitting 6pt below the text baseline. The rule does not extend into page margins.

**Implementation note:** This rule applies at the LLM prompt level — Caspr must generate findings-as-headers, not topic-as-headers. The build system cannot reliably detect finding quality programmatically. This check is manual QA (see §12).

---

## 7. Executive Summary

The Executive Summary is not a compressed version of the report. It is a decision brief. A reader who reads only the Executive Summary should know what decision is in front of them and what the data does not resolve.

**Length target:** 2–3 pages.

### Mandatory structure

**Opening sentence:** One sentence stating what decision this report supports.
> *"This analysis supports a go/no-go decision on greenfield sodium production capacity in India, and identifies the three variables that determine investment viability."*

**Findings block (3–6 findings):** Each finding is a labelled block.
- Label: **Finding 1 — Supply concentration risk is acute**
- Body: 2–4 sentences at 10pt Regular, 1.5× leading. Lead with the number. End with the consequence.

*Note: Executive Summary finding bodies use 1.5× leading intentionally. This is wider than the standard body (1.4×) to improve readability in a dense, decision-critical section.*

**Decision sentence (final):** A direct statement of what the data does not resolve, or what the reader must do next.
> *"The data does not resolve whether to proceed — it narrows the decision to scale and timing. Below 6,000 tonnes, the economics do not justify greenfield capital."*

### Formatting

- Full-width block per finding, separated by a 1px `caspr-rule` line
- Finding label: 11pt Semi Bold, `caspr-black`
- Finding body: 10pt Regular, `caspr-black`, 1.5× leading

**Optional: key number per finding**

If a single metric is the primary evidence for a finding, it may be displayed in the right margin:
- Layout changes to two-column: 65% text / 35% key number (no gutter in Executive Summary)
- Key number: 20pt Bold, `caspr-red`
- This is optional per finding — not all findings need a key number
- If included, do not count it against the "one key figure per table" rule in §9

---

## 8. Callout Stats

For every major section, identify the one number that matters most and give it explicit visual treatment.

**Definition of "major section":** A top-level section as listed in the table of contents (e.g. Section 1, Section 2, Section 3). Subsections (1.1, 1.2) do not each receive a callout stat. One callout stat per top-level section maximum.

**Relationship to table key figures:** Callout stats (§8) and table key figures (§9) are separate highlight types. A section may have one callout stat AND tables that each carry one key figure. These do not count against each other.

### Anatomy

```
[NUMBER]       ← 48–64pt Bold, caspr-red
[short label]  ← 10pt Regular, caspr-grey-mid, max 10 words
```

**Font size selection:** Default 56pt. If the label extends beyond one line at 10pt within the allocated column width, reduce the number to 48pt. If number + label together exceed the allocated space at 48pt, reduce the number to 42pt and shorten the label.

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

- Right column on two-column pages — the callout sits beside the paragraph that references the number. Align the top of the callout to the first line of the referencing paragraph.
- Or full-width centred block (horizontally centred, sitting at one-third page height) on section transition pages.
- **One per major section maximum.** More than one per page dilutes impact.

---

## 9. Data Tables

Tables are the core deliverable. They must be immediately legible and credible.

### Structure

| Element | Specification |
|---|---|
| Column header | Inter Semi Bold (weight 600), ALL CAPS, 8pt, letter-spacing 6–8%. White text on `caspr-black` background. Padding: 6px vertical, 8px horizontal. |
| Row label | Inter Regular, 9pt, left-aligned |
| Numerical cell | Inter Regular, 9pt, right-aligned |
| Row banding | Header row: always `caspr-black`. First data row (row 2): white. Second data row (row 3): `caspr-grey-light`. Alternates white / grey-light thereafter. Banding continues without reset across page breaks. |
| Key figure | Bold weight + `caspr-red` text, OR a 2px left-border rule in `caspr-red` on the row. Never both. One key figure per logical table (spanning all pages if table breaks across pages). |
| Source line | Inter Regular Italic, 7–8pt, `caspr-grey-mid`, right-aligned, 6pt below table bottom border |
| Border | 1px `caspr-rule` on outer border only. No vertical dividers between columns. |
| Cell padding | 5px vertical, 8px horizontal (data rows) |
| Row height | Minimum 24px for data rows. Expand to fit content — never clip text. |

### Multi-page tables

- Column header row repeats on every page the table continues.
- Tables always break at row boundaries, never mid-row. If a row is too tall for the remaining page space, the entire row moves to the next page.
- The "outer border only" rule applies per page — add a bottom border on the last row of each page, and a top border on the first row of the next page.

### Source line — mandatory

Every table carries a source line. No exceptions. Format:
> *Source: [Primary source]. Caspr analysis.*

This is both a credibility signal and a legal requirement.

### Key figure treatment

- One key figure per logical table maximum (not per page).
- Treatment is mutually exclusive: apply `caspr-red` text at bold weight, OR a 2px left-border rule in `caspr-red` on the row — never both on the same cell or row.
- Do not use cell background colour highlights. They reduce legibility in print and add visual noise.

---

## 9a. The Signal — opinion / sentiment blocks

**Added 2026-07-13.** Reports may carry blocks of **opinion and sentiment** synthesised from **crowd-sourced-but-credible** sources — social-media mining, news, interviews, and forums (Reddit, Quora, Wiki, X). This is **an additional layer of intelligence, offered on top of the promised curated-and-cited data — never a weaker substitute for it.** Positioning to the reader: *"we captured what the market actually thinks,"* not a disclaimer. It exists precisely because sentiment often moves before the data confirms it — it is *leading* intelligence.

**The reader must instantly register it as a different *class* of evidence** than the cited findings, **without** reading it as lesser. **Why (restated 2026-08-20):** Caspr's proof is **"every source, credible. Every claim, triangulated. Every report, defensible."** A cited finding names a credible source; The Signal names an *aggregate*. Both are real intelligence, but only one can be put in front of a board as a source — so they must not look alike, or the aggregate borrows the cited finding's authority. *(Supersedes the earlier justification "every insight cited, zero hallucination" — that claim is retired. The three levers below are unchanged; they follow from the restated reason equally well.)* Three levers, always together:

1. **Surface tint** — a faint **cool-grey** block (`#F2F2F4`, distinct from `caspr-white` and from the warm `surface-1`), rounded 10px, generous padding. Full content-column width. **In the document flow between sections/paragraphs — never a sidebar or margin note.**
2. **Typeface — sans (Inter), not the editorial serif.** Serif is Caspr's *authority / cited* voice; setting crowd opinion in it would read as Caspr endorsing the opinion. Sans marks it as "not the cited analyst voice."
3. **Aggregate attribution, never a single citation.** The block states a **synthesised** position ("The market thinks…"), attributed in bulk — *e.g.* "~2,400 mentions across forums, X and Reddit, and 9 named operators on the record · Jan–Jun 2026." A single pulled quote is **not permitted** — it invites "who said that, is it representative?" and cannot carry the aggregate's authority.

**Anatomy:**
- **Header:** small soundwave/waveform icon (`caspr-grey-mid`) + label **`THE SIGNAL`** — Inter Semi Bold, 10px, letter-spacing 0.8px, muted.
- **Statement:** Inter Medium, ~13.5px, `caspr-black`/near-ink, 145% line-height. One synthesised claim.
- **Attribution:** Inter Regular, ~10px, muted, 140% line-height. **Copy is bonus-framed, not caveat-framed:** *"The market's view — captured beyond the cited record: …"* — **never** "sentiment, not curated data" or any wording that reads as a warning.

**Naming is locked as "The Signal."** Rejected alternatives: "Popular Opinion" (excludes named thought-leaders, faintly dismissive), "Voices" (warmer but softer). One name spans the full spectrum from anonymous crowd sentiment to named-but-informal expert voices.

**Frequency:** use sparingly — at most one per section, only where the sentiment genuinely adds a dimension the cited data doesn't. Overuse dilutes both the report's rigour and the block's signal.

**Provenance tagging:** a Signal block's sources are `crowd_sourced` provenance, distinct from the `curated` provenance of cited findings — see `document-taxonomy.md` for the source-provenance field this drives.

---

## 9b. Every claim, triangulated — the claim-level expectation

**Added 2026-08-26 (Joy), after the 23-report evaluation found this encoded as an Intelligence-tier feature.
It is not. It is the claim, and it holds at every tier a customer can buy.**

> **Caspr's proof line is *"Every source, credible. Every claim, triangulated. Every conclusion,
> defensible."* The second clause is not a premium feature.**

**Three expectations. They apply to Brief, Study and Intelligence alike:**

| | |
|---|---|
| **1** | **A figure presented as the answer carries what it measures.** Scope, basis, period — whatever makes it the number it is |
| **2** | **Where credible published sources materially disagree, the reader learns that.** Never averaged into a single figure; never resolved silently by choosing one |
| **3** | **Where the difference is definitional rather than factual, it is identified as definitional.** Reporting *mine* against *refined* production as "sources disagree" is the error this expectation exists to prevent — and it is the sloppiness Caspr sells against |

### What the tier changes, and what it does not

**Tiers differ by how much of the analysis tree was explored** — the number of independent analytical passes, and
the depth reached. **Intelligence goes deep on the second level of the tree; a Study does not.**

**That determines how many alternatives are found and how hard each is tested. It does not determine whether
what was found reaches the reader.**

> **A Brief that found one credible figure reports one, and says what it measures. A Brief that found a 12×
> spread reports that it found one.** The expectation is about honesty, not length.

**⚠ Outcome, not method.** This specifies what the reader must end up knowing. **It does not specify a
section, a block, a word count or a position** — how each depth expresses it is Caspr's to determine. The
**C2 Divergence** component (§`components.md`) is one rendering of this expectation, not the expectation
itself.

---

## 10. ICP Language Guide

The Trusted Senior Analyst voice holds across all ICPs. What changes is the **vocabulary**, the **lead metric**, the **framing convention**, and — in practice, the strongest lever — **which findings lead**. The core rules of §11 apply everywhere. The adaptations below are additive, not replacements.

> **⚠ The type ceiling outranks the ICP register.** *(Added 2026-08-19 after a composition test.)*
>
> An ICP profile selects **emphasis and ordering among the questions its deliverable type already answers.** It must never introduce a question the type does not own.
>
> The failure mode is real and was observed in testing: an investor-registered **Competitive Landscape** began answering *exit windows and auction dynamics* — genuine Investment & Deal questions. The register was strong enough to pull the analysis past its type ceiling.
>
> **The rule:** where the ICP's natural interest lies outside the type's ceiling, the correct response is the ceiling's handoff (*"→ Investment & Deal"*), **not** quietly answering it here. A `competitive_landscape` for an investor leads on competitive dynamics *that bear on a return* — it does not become a deal screen.
>
> This applies in both directions: a category-manager register does not turn a `market_sector` into a ranging recommendation, and a startup register does not turn one into a pitch.

**ICP is an account-level attribute** (set at signup / profile, refined by behaviour) — **it is never asked per report.** Making a user self-classify before every analysis contradicts the entry architecture (`app-shell-framework.md §1a`: *"Caspr is the informed one that already knows"*). The generation pipeline reads it from the account and applies the matching profile below. **When the account carries no ICP — which is the case for every first-time user — apply §10.9.** *(Corrected 2026-08-19; the earlier "user-selected at report submission" is superseded. Resolution mechanics: `00-resolution-map.md`.)*

### The two acquirer lenses — read §10.2 / §10.3 / §10.7 together

Three profiles can look at the same acquisition and want different reports. The distinction is **who is buying and why** (Joy, 2026-08-19):

| Lens | Profile | Buys for | The question every finding serves |
|---|---|---|---|
| **Financial acquirer** | §10.3 Investors (incl. M&A as a deal discipline) | **return on capital** — the asset stands alone | *"what does this do to the return?"* |
| **Strategic acquirer** | §10.7 Corporate Development | **fit with the business already owning it** — synergy, capability, defensive position | *"what does this do to* ***us*** *?"* |

The output shape is largely the same; **the vocabulary and the lead metric differ.** Corporate Development sits closer to §10.2 Strategy than to §10.3 Investors — it is a strategy function that happens to buy things, not an investment function. **M&A as pure financial deal-making sits with §10.3.**

---

### 10.1 Consulting Firms

**Who they are:** Strategy consultants and associates producing client-facing analysis. They live in slide decks and issue trees.

**Vocabulary in:** hypothesis, workstream, key findings, client impact, MECE, so what, issue tree, actionable recommendations, sector overview, competitive dynamics, strategic options, top-line, bottom-line

**Vocabulary out:** "insights" (overused to the point of meaninglessness), anything that sounds like a product pitch

**Lead metric:** time saved, cost avoided, or strategic option unlocked for the client

**Framing convention:** Every section delivers a finding the consultant can read directly into a client slide. The "so what" is explicit. The report does not describe the market — it tells the consultant what the market means for the client decision.

**Example section header:**
> *Three Chinese suppliers provide 78% of India's pharmaceutical sodium — consolidating to one contract exposes any manufacturer to a single-point supply failure.*

---

### 10.2 Strategy Teams and C-Suite

**Who they are:** Heads of strategy, Chief Strategy Officers, and senior executives making allocation and direction decisions. **Corporate Development sits alongside this profile** — a corp dev team is a strategy function that executes through acquisition; where the work is specifically about buying a company, use §10.7, which is this register plus the deal vocabulary.

**Vocabulary in:** strategic options, scenario analysis, competitive moat, market positioning, implications for [organisation], organic vs. inorganic growth, board-level, capital allocation, strategic rationale, build / buy / partner

**Vocabulary out:** tactical recommendations, feature lists, operational detail

**Lead metric:** options narrowed — the number of viable strategic paths reduced to the two or three that merit board consideration

**Framing convention:** The report does not recommend. It narrows. The executive makes the call. Every section ends with the implication for the organisation, not a generic industry conclusion.

**Example section header:**
> *Market consolidation is accelerating — the window for an organic entry strategy closes within 18 months.*

---

### 10.3 Investors (PE, VC, Hedge Funds, Family Offices)

**Who they are:** Investment professionals evaluating opportunities against a financial return thesis. **This is the financial-acquirer lens, and it owns M&A as a deal discipline** — the asset is judged on what it returns, standing alone. Where the buyer is an operating company acquiring for fit with its existing business, use §10.7 instead.

**Vocabulary in:** EBITDA, exit multiple, deal thesis, comparable transactions, enterprise value, IRR, deal sourcing, LP, management team quality, market sizing, defensibility, competitive moat, due diligence, return profile, entry multiple, exit path

**Vocabulary out:** consumer sentiment, brand positioning, awareness — anything that does not anchor to a financial outcome. Also **synergy language** (*"accretive to our existing capability"*) — that is the strategic acquirer's frame, §10.7, and it does not belong in a financial return thesis

**Lead metric:** financial return potential — every major section answers "what does this mean for the return?"

**Framing convention:** Page 1 answers two questions: what is the market opportunity, and what does it return? Every section thereafter advances the investment thesis or identifies a risk that modifies it.

**Example section header:**
> *Entry below USD 2.40/kg is achievable only via a greenfield facility above 6,000 tonnes — the minimum economically viable scale.*

---

### 10.4 Category and Commercial Managers

**Who they are:** Senior buyers, category leads, and commercial managers at retailers and consumer goods businesses.

**Vocabulary in:** category dynamics, shelf share, distribution points, ACV weighted, velocity, basket penetration, promotional elasticity, ranging decision, price architecture, private label, branded vs. own-label, category captain

**Vocabulary out:** investment thesis, strategic options — anything from the finance or consulting register

**Lead metric:** volume opportunity and competitive gap — what is available to win and who currently holds it

**Framing convention:** Sections map to the decisions a category manager owns — what to range, how to price, where to promote, and which competitor to defend against. Recommendations are commercial and immediately actionable.

**Example section header:**
> *Plant-based ambient alternatives hold 6.2% of the category and are growing at 3× the segment average — the shelf allocation does not reflect the rate of change.*

---

### 10.5 Marketing and Advertising Agencies

**Who they are:** Strategy and planning teams building brand platforms, campaign briefs, or pitch responses for clients.

**Vocabulary in:** consumer insight, cultural tension, creative territory, brand positioning, audience segmentation, strategic platform, category entry points, mental availability, penetration, salience, brand codes

**Vocabulary out:** EBITDA, IRR, regulatory environment — anything from the financial register

**Lead metric:** the insight — one human truth about the consumer or category that the creative team can build on

**Framing convention:** The report builds toward a single strategic recommendation the creative team can act on. Every section either surfaces a tension or resolves one. The final section should make the brief obvious.

**Example section header:**
> *Sustainable personal care shoppers distrust ingredient claims at purchase but cite them in post-purchase justification — the tension is between aspiration and scepticism.*

---

### 10.6 Graduate Researchers (Masters, PhD)

**Who they are:** Postgraduate students conducting market context research for dissertations, thesis papers, or pre-fieldwork literature synthesis.

**Vocabulary in:** literature synthesis, theoretical framework, empirical evidence, research gap, limitations, methodology note, pre-fieldwork context, existing evidence base, contested findings, peer-reviewed

**Vocabulary out:** deal thesis, brand platform, shelf share — anything from the commercial register

**Lead metric:** the state of existing evidence — what is known, what is contested, and what is genuinely unknown and therefore researchable

**Framing convention:** This is the only ICP where acknowledged uncertainty is appropriate and expected. "Evidence suggests" rather than "evidence shows" is correct when the body of research is mixed. The report does not resolve the research question — it maps the territory so the researcher can design their primary study.

**Example section header:**
> *Embedded finance adoption in the 18–34 cohort is documented in six markets; the evidence base for behaviour beyond initial uptake remains thin.*

---

### 10.7 Corporate Development — the strategic acquirer

*Reframed 2026-08-19. Previously "Corporate Development and M&A Teams", which conflated two different buyers. **M&A as pure financial deal-making now sits with §10.3 Investors**; this profile is the operating company buying for fit.*

**Who they are:** In-house corporate development and business development teams at operating companies, identifying and evaluating acquisitions on behalf of a business that already exists. **They are a strategy function that executes through acquisition** — read this profile as §10.2 Strategy plus deal vocabulary.

**The distinction that defines this profile:** a financial acquirer (§10.3) asks *"what does this asset return?"* A strategic acquirer asks ***"what does this asset do for the business we already own?"*** The same target can be a poor financial buy and an excellent strategic one — because the value is created by the combination, not the asset alone.

**Vocabulary in:** acquisition targets, strategic rationale, **synergies** (revenue and cost), **capability gap**, integration complexity, build / buy / partner, market consolidation, fragmented market, roll-up opportunity, platform company, adjacency, transaction history, asset quality, cultural and technical fit, **accretive to [the business]**

**Vocabulary out:** creative territory, shelf share, consumer insight. Also **pure-return framing** — IRR, exit multiple, LP, exit path (§10.3's register). A corp dev team rarely exits; they integrate and hold.

**Lead metric:** **strategic fit** — what capability, market access, customer base, or defensive position the acquisition delivers to the acquiring business, and at what integration cost. Target count and quality is the secondary metric.

**Framing convention:** Every section advances the fit-and-consequence logic. The market landscape answers: how fragmented is this market and does that create a consolidation opportunity *for us*? The competitive section answers: which players are acquirable, and what would owning each one change about our position? Where a valuation appears, it is framed against what the combination is worth — not against a standalone return.

**Example section header:**
> *The North American fleet management software market has 47 active players below USD 50m revenue — three hold the telematics integration capability that would take us eighteen months to build.*

---

### 10.8 Startups (Fundraising)

**Who they are:** Founding teams preparing investor materials, sizing markets for pitch decks, or producing due diligence backing for a funding round.

**Vocabulary in:** TAM/SAM/SOM, product-market fit, go-to-market, unit economics, competitive moat, funding landscape, investor narrative, market timing, category creation, defensibility, runway

**Vocabulary out:** ranging decision, deal thesis, integration complexity

**Lead metric:** market size — the credible, cited TAM/SAM that the investor will challenge in the room

**Framing convention:** Every claim is benchmarked and sourced, because the investor will probe every number. The tone is confident but the data is conservative — founders who over-claim their TAM lose credibility. The report is evidence for the fundraising narrative, not the narrative itself.

**Example section header:**
> *The North American fleet management software market is USD 4.2bn in 2024 — serviceable addressable market for a mid-market SaaS entrant is USD 640m.*

---

### 10.9 Other / ICP Not Yet Identified

**Who they are:** A user whose professional context has not been captured at submission, or whose role does not map to any of the eight primary profiles. This covers government analysts, non-profit strategy teams, independent consultants, general business researchers, and any user arriving without a declared ICP. This is also the default applied to the first version of any report before the user has confirmed their profile.

**Vocabulary in:** market dynamics, competitive landscape, strategic implications, financial performance, growth trajectory, risk factors, market sizing, key findings, industry context, structural drivers, supply-demand balance

**Vocabulary out:** ICP-specific jargon from any of the eight profiles above. No *deal thesis* (Investors). No *shelf share* (Category Managers). No *TAM/SAM* (Startups). No *hypothesis* (Consulting). No *creative territory* (Agencies). Write in language that any educated professional can parse without domain knowledge.

**Lead metric:** the clearest and most important number in the data — the single figure that most directly answers "what is the size and shape of this market?" **It carries what it measures** (§9). *Leading with one number is an emphasis rule; it is not licence to present one where the record holds several.*

**Framing convention:** Write for a reader who is intelligent and senior but whose specific use case is unknown. Lead with market facts. State implications in plain English. Do not assume what the reader will do with the analysis — deliver the analysis and let the reader apply it. Every finding must stand without assumed professional context. Section headers carry the finding; they do not assume a reader role (avoid "for investors" or "for category managers" framings).

**Example section header:**
> *Global contract pharmaceutical manufacturing is a USD 170bn market — four players control 45% of capacity, and consolidation is accelerating.*

---

### 10.10 Market Research Professionals

*Added 2026-08-19. This ICP is a full profile in `icp-personas.md` (ICP 6) and `icp-copy.md` (ICP 7) but was missing from this guide — reports for research professionals were resolving to §10.9. Numbered .10 to avoid renumbering existing references; **§10.9 remains the fallback regardless of position.***

**Who they are:** Research executives, analysts, managers, and directors at secondary and full-service research agencies — and the growing freelance segment. Boutiques of 5–50, mid-size firms, and the analyst layer inside Kantar/Ipsos-scale agencies.

**The defining context — and the one that governs the register:** *they produce research for a living.* They will judge Caspr's methodology the way they judge a supplier's. Every sourcing weakness a lay reader skims past, this reader will find.

**Where Caspr sits in their workflow:** the **pre-fieldwork context layer** — the two-to-three days of desk research that precedes every project, is essential, and is never billed (`icp-personas.md` 6). It is the layer *before* their primary work begins.

> **RULE — never write as though this replaces their expertise.** This ICP has a live and legitimate anxiety about automation. Caspr aggregates and structures secondary sources; it does not design methodology, write screeners or discussion guides, moderate, field, or interpret primary data. The report is **input to their work.** Any framing that implies otherwise loses the reader permanently. *(Same discipline as §10.6's academic-integrity rule.)*

**Vocabulary in:** desk research, secondary research, pre-fieldwork context, category landscape, competitive dynamics, market structure, sample, methodology note, syndicated data, evidence base, source triangulation, the brief, client deliverable, sub-category granularity

**Vocabulary out:** deal thesis, IRR, shelf share, creative territory, hypothesis-as-consulting-jargon. Also — carefully — **do not borrow primary-research vocabulary for secondary findings.** Never describe desk research as "fieldwork", never imply a sample where sources were aggregated, and never present a synthesised figure as though it were measured. Misusing this vocabulary in front of this ICP is disqualifying.

**Lead metric:** **analyst hours removed from the unbillable context layer** — and, equally, the granularity syndicated sources do not reach. Their recurring frustration is that Mintel covers the category and Euromonitor covers the country, but neither covers *the specific intersection the client asked about*.

**Framing convention:** Write it as the context section they would have written, at the quality they would have written it, and hand it over. Explicit methodology transparency matters more here than for any commercial ICP: name sources, state how figures were triangulated, and flag where the evidence base is thin — because they will check, and finding the gap themselves after using it is far worse than being told.

**Example section header:**
> *Published data covers UK ready-meals at category level; the premium sub-segment is unmeasured below GBP 400m — three trade sources triangulate to GBP 310–340m.*

---

## 11. Voice and Copy Rules

### The register

Caspr speaks like the most credible person in the room — the one who arrives with the numbers already done, speaks in conclusions not caveats, and never wastes a word. Not a helpful colleague. The authoritative source you trust in front of a board.

The model is The Economist or the Financial Times, not a SaaS product blog.

### Write conclusions, not descriptions

Every paragraph must advance an argument. Introductory topic sentences are deleted on sight.

❌ *"This section examines the competitive landscape of the pharmaceutical sodium market."*
✅ *"Three Chinese suppliers control 78% of India's pharmaceutical sodium imports — a concentration level that creates immediate supply risk for any domestic manufacturer."*

### Numbers first

Lead with the number, then the context.

❌ *"The market has grown significantly, with a CAGR of 12%."*
✅ *"12% CAGR over five years — faster than any adjacent segment."*

### The consequence sentence

After any data-heavy paragraph (one containing a table reference, multiple statistics, or a key figure), add one plain-English sentence stating what the data means for the reader:

> *"This means [consequence for the reader]."*

Without the consequence sentence, data is information. With it, data is analysis.

**Detection:** A data-heavy paragraph is any paragraph containing two or more numerical values or a reference to a table or figure. The consequence sentence typically begins with "This means," "This leaves," or "At this rate" — but the precise phrasing is not constrained. QA checks this manually (see §12).

### Hedge the conditions, not the findings

Specify the condition precisely. State the finding as fact.

❌ *"Prices may increase if tariffs are imposed."*
✅ *"Under a 15% tariff scenario, spot prices reach USD 4.20/kg — a level that eliminates margin for most finished goods manufacturers."*

The condition is stated (15% tariff scenario). The finding within that condition is a fact (USD 4.20/kg), not a hedge.

### Remove hedging language

These phrases are deleted on sight:
- *"It is worth noting that..."*
- *"One could argue that..."*
- *"This suggests that the market may be..."*
- *"Interestingly..."*
- *"It is important to..."*
- *"It should be noted..."*
- *"There are a number of factors..."*

**Exception:** Graduate researcher ICP (§10.6) permits calibrated uncertainty language where the evidence base is genuinely mixed.

### Bullet points and lists

Lists are not analysis. Use them sparingly and only when a list is genuinely the right form for the content.

**Use a list when:**
- Items are genuinely discrete, parallel, and do not flow naturally into a sentence
- There are four or more items that would create an unwieldy sentence if run together
- The reader will scan rather than read — e.g. a checklist or a set of acquisition criteria

**A mechanical test for "genuinely discrete":** If you can reorder the items without changing meaning, they are parallel and discrete. If a specific order matters because item B follows from item A, they are not a list — they are argument, and belong in prose.

**Do not use a list when:**
- You are avoiding writing a proper analytical paragraph
- There are fewer than three items — write it as a sentence
- The items have a logical or causal relationship — that relationship is the analysis, and it belongs in prose
- You are dressing up a feature description as strategic insight

**Numbered lists** are for sequential steps only — never for ranked importance. If you number a list, the order must be meaningful.

**Never nest bullets.** If a second level appears, the structure needs rethinking. Either the sub-items belong in a sentence within the parent item, or the parent items are the wrong level of abstraction.

**Each list item must be complete.** It must grammatically complete the opening stem, carry a specific finding or fact, and stand without the surrounding paragraph as context. If a bullet item requires the one above it to make sense, it is not a list — it is a paragraph broken into fragments.

### No exclamation points

Ever. Confidence does not require punctuation.

---

### 11.1 The voice in other languages

*Added 2026-08-19. English is the always-included base, but the Gate is multi-select and **every additional language is a full output** — `gate-output-spec.md §6` is explicit that "a translation is a rewrite, not a format-conversion". These rules govern that rewrite.*

**The voice is not an English voice.** The Trusted Senior Analyst exists in every language Caspr writes in. What travels is the **register**; what does not travel is the phrasing.

**What holds in every language — structural, non-negotiable:**
- Conclusions, not descriptions. Findings-as-headers (`§6`).
- Numbers first, then context.
- The consequence sentence after data-heavy paragraphs.
- Hedge the conditions, not the findings.
- No exclamation points. No padding. Bullet discipline (`§11`).

**What must be re-expressed rather than translated:**
- **Idiom does not survive a literal rendering.** Where an English construction depends on rhythm or wordplay, write the equivalent line natively in the target language. A literal translation of an idiomatic sentence reads as a translation — which immediately breaks the "most credible person in the room" register.
- **`§10` vocabulary lists are English anchors, not glossaries.** Use the **equivalent professional register** a native practitioner in that market actually uses — a French investment professional writes *TRI*, not *IRR*; a German category manager has their own shelf vocabulary. Translating the English term literally marks the document as foreign to its reader.
- **The `§11` rejected-phrase list is English-specific.** The *principle* transfers absolutely — hedging, throat-clearing, and filler are cut in every language. The specific word list is not a lookup table for translation.

**What must not change:**
- **Source names, publication titles, and citations stay in their original language.** A German government statistic keeps its German title. Translating a source name makes it unfindable, which defeats the citation (`§14`).
- **Figures are never converted or restated.** A source reporting EUR 4.2bn is cited as EUR 4.2bn in every language. Add a converted figure alongside only where the source itself provides one.
- **Caspr's own terms** — Brief, Study, Intelligence, the Caspr wordmark — are not translated.

**Local convention applies to formatting, not to substance:** decimal separators, thousands separators, and date order follow the target locale. The underlying value never changes.

**Where a translated report is generated, it is a first-class output**, held to every rule in this document. There is no reduced standard for non-English output — the same principle as `00-resolution-map.md` § Scope is a property of the tier.

---

## 12. Pre-delivery Checklist

The checklist is split into two tracks. Automated checks can be validated programmatically by the build system. Manual checks require human review before delivery.

### Automated checks (system-enforced, flag and fail)

**Copy:**
- [ ] No exclamation points in any text field
- [ ] No hedging phrases from the removal list in §11
- [ ] All section headers in title case (not sentence case, not ALL CAPS)
- [ ] Caspr wordmark is the SVG asset, correctly scaled (aspect 2.075:1), never typeset

**Data and tables:**
- [ ] Every table has a source line
- [ ] No gradient used outside the cover photography overlay
- [ ] No drop shadows applied to any element

**Citations (see §14):**
- [ ] Every table, chart, and callout stat has a source tag directly beneath it (Layer 1)
- [ ] Every factual claim in prose has a superscript citation number (Layer 2)
- [ ] All superscript numbers resolve to a numbered entry in the References section (Layer 3)

### Manual checks (human review before delivery)

**Copy:**
- [ ] Every section header states a finding, not a topic
- [ ] Executive Summary opens with the decision the report supports
- [ ] Executive Summary closes with what the data does not resolve
- [ ] Every data-heavy paragraph has a consequence sentence
- [ ] No bullet lists that fragment what should be continuous argument

**Data and tables:**
- [ ] One key figure per table is highlighted (not more than one)
- [ ] Row banding applied consistently (starts white at first data row)
- [ ] Column headers: ALL CAPS, Semi Bold (weight 600), white on black header row

**Cover:**
- [ ] Depth indicator lines correct for analysis type (1 / 2 / 3 lines, correct widths)
- [ ] Badge text correct: BRIEF · STUDY · INTELLIGENCE
- [ ] Scope line present on Study and Intelligence; absent on Brief
- [ ] Capability row present on Intelligence only
- [ ] Caspr wordmark bottom right — the placed SVG asset, not typeset text
- [ ] Cover image: sector-relevant, no primary human subject, dark-treated
- [ ] Photography overlay applied
- [ ] Filter tier appropriate for image brightness

**Charts (see §13):**
- [ ] No 3D effects, no gradient fills on chart elements
- [ ] Chart source line present
- [ ] caspr-red used for the highlighted data series only; all others in greyscale
- [ ] Y-axis starts at zero for bar and column charts

**Citations and References (see §14):**
- [ ] References section titled *References*, positioned after last content section and before last page
- [ ] Reference list entries numbered to match superscript citations in text
- [ ] No citation marked "Caspr analysis" without an accompanying primary source

**Last page (see §15):**
- [ ] Last page present and positioned after References
- [ ] Disclaimer text unmodified from approved version in §15
- [ ] Social handles and email addresses confirmed correct before delivery
- [ ] Copyright year matches report publication date
- [ ] Caspr wordmark is the placed SVG asset (§3) — never text in any typeface

**Visual:**
- [ ] One callout stat per top-level section maximum
- [ ] Section opening pages: caspr-grey-dark background, finding in white, white space not filled
- [ ] Caspr. wordmark in footer on every page
- [ ] Running headers carry abbreviated section finding, not section name
- [ ] No gradients outside cover photography overlay

**Brand:**
- [ ] No drop shadows
- [ ] No coloured section backgrounds other than dark section openers
- [ ] No language from the rejected list in §11
- [ ] ICP-appropriate vocabulary applied (or §10.9 if ICP not set)

---

## 13. Charts and Data Visualisations

### When to use a chart

Charts replace tables only when the visual pattern — trend, comparison, distribution — is the finding. If the reader needs to read individual values precisely, use a table. If the reader needs to see a shape, use a chart.

Do not use a chart to illustrate a finding that is already stated clearly in the text. A chart that repeats the table data without adding a visual argument is wasted space.

### Permitted chart types

| Chart type | Use for |
|---|---|
| Bar chart (vertical) | Comparing values across categories at a single point in time |
| Bar chart (horizontal) | Comparing many categories where labels are long |
| Line chart | Showing change over time for one or more series |
| Stacked bar chart | Showing composition and comparison simultaneously |
| Waterfall chart | Showing how an initial value changes through additions and subtractions (e.g. cost bridges, revenue bridges) |
| Scatter plot | Showing correlation or competitive positioning (two-axis) |
| Simple table | Default for precise values; never use a chart when a table is more legible |

**Not permitted:** pie charts, donut charts, bubble charts, 3D charts in any form, radar/spider charts, area charts with gradient fills.

### Chart style rules

- **Background:** `caspr-white` — no grey chart background, no grid-background shading
- **Grid lines:** horizontal only, 1px, `caspr-rule` (#D6D4CF), at meaningful intervals. No vertical grid lines.
- **Axes:** `caspr-rule` colour, 1px weight. Y-axis always starts at zero for bar and column charts. Do not truncate axes to exaggerate differences.
- **Data series colour:** Use `caspr-grey-mid` (#6B6B66) for all data series except the one the report is drawing attention to. That highlighted series uses `caspr-red` (#E8453C). Maximum one highlighted series per chart.
- **No 3D effects.** No gradient fills on bars, lines, or areas. No shadows.
- **No legend if there is only one series.** For multiple series, use a legend positioned above or below the chart — never inside it.
- **Data labels:** Optional. If used, use them consistently (all bars labelled, or none). Font: Inter Regular, 8pt, `caspr-grey-mid`. For the highlighted series, use Semi Bold, `caspr-black`.
- **Chart title:** Not required if the section header already states the finding. If used, the chart title must also state a finding, not a description. Same rule as §6.

### Chart dimensions

- **Single-column chart:** full text-area width (166mm / 626px at A4). Height: 90–120mm.
- **Two-column right-column chart:** right column width (71mm / 268px at A4). Height: 60–90mm.
- **Do not stretch or crop charts** to fill space. White space around a chart is acceptable.

### Source line

Every chart carries a source line using the same format as tables (see §9): *Source: [Primary source]. Caspr analysis.* Positioned directly below the chart, right-aligned, 7pt Regular Italic, `caspr-grey-mid`.

---

## 14. Citations and References

Caspr's core credibility claim is that every insight is cited to a verifiable source. The citation system has three layers. Each layer serves a different reader behaviour.

### The three-layer system

| Layer | Location | Purpose |
|---|---|---|
| **Source tag** | Directly below every table, chart, and callout stat | Immediate on-page visibility — the reader sees the source without leaving the page |
| **Superscript citation** | Inline in prose, immediately after each factual claim | Precise claim-level attribution in narrative text |
| **References section** | Final section of the report, titled *References* | Complete bibliography — the audit trail for the full report |

The source tag on tables and callouts is the primary visible credibility signal. Most readers never flip to the References section. The source must be visible on the page where the claim appears.

### Layer 1 — Source tags (tables, charts, callout stats)

Every table, chart, and callout stat carries a source line directly beneath it. Spec is defined in §9 (tables) and §13 (charts). Format:

> *Source: [Primary source name, year]. Caspr analysis.*

"Caspr analysis" is appended when the figure is derived (e.g. a CAGR calculated from raw data, or a market size modelled from multiple inputs). It is never used as the sole source.

### Layer 2 — Inline citations (prose)

Superscript numerals in prose text immediately following the claim they support:

> *"The Indian pharmaceutical sodium market reached USD 340m in 2024.¹"*

**Rules:**
- Sequential throughout the document, starting at ¹. Do not restart per section.
- Placed after the specific number or claim, before any punctuation
- Rendered at 7pt, standard superscript baseline offset
- Every superscript must have a corresponding entry in the References section

### Layer 3 — References section

A numbered list at the end of the report, titled **References**. Entries are numbered to match the superscript citations in the text.

**Format by source type:**

| Source type | Format |
|---|---|
| Published report / study | Author or Organisation. *Title*. Publisher, Year. URL if available. |
| News / press | Author. "Title." *Publication*, Date. URL. |
| Government / regulatory data | Organisation. *Title*. Publication code if available. Year. URL. |
| Database / data feed | Database name. Dataset name. Date accessed. |
| Industry body | Organisation. *Title or publication*. Year. |
| Company filing | Company name. *Document type* (e.g. Annual Report). Year. |

### Source quality hierarchy

Prefer sources in this order:

1. Government statistics and regulatory filings
2. Peer-reviewed academic research
3. Industry body publications and trade association data
4. Major financial institutions and consultancy published research (FT, Bloomberg, Reuters, WSJ)
5. Company filings, investor presentations, press releases

Do not cite: Wikipedia, anonymous blog posts, AI-generated content, or press releases as the sole source for a market size claim.

### Layer 4 — Interactive red dots (screen only — "the analyst on call")

**Added 2026-07-13. Screen-only; the print/PDF export keeps Layers 1–3 (superscripts + References) unchanged.** On screen, the app overlays a tappable **red dot** at every point that has either a **source to cite** or a **calculation to explain** — every figure, derived number, and modelled claim. All dots are **one identical red dot** (no visual sub-types). Tapping one raises **Ask Caspr**, pre-scoped to that figure, with Caspr's provenance/derivation answer as the first reply — *what is this number, where does it come from, how was it triangulated* — after which the user can keep asking. This is the interactive form of "every insight cited to source"; the felt experience is **having the analyst on call.** Full interaction spec: `app-shell-framework.md §5`. The red-dot data (which anchors carry dots, and the provenance/calc answer each returns) is served by **Jayant's backend — already built**; see `architecture-alignment-final.md`.

---

## 15. Last Page

Every Caspr report ends with a dedicated closing page. It is not a back cover — it is a functional document page that carries the disclaimer, About Caspr, contact information, social channels, and copyright. It appears after the References section.

The reference HTML implementation is at `docs/report-guidance/reference/report-last-page.html`.

### Layout

**Page background:** `caspr-grey-dark` (#1A1A18) — full bleed, flat colour. No photograph, no gradient.

The page is divided into three vertical zones:

| Zone | Vertical proportion | Content |
|---|---|---|
| Top | ~22% of page height | Depth mark, Caspr. wordmark, tagline |
| Main | ~58% of page height | Two columns: About + Contact (left) · Disclaimer + Methodology (right) |
| Footer | ~20% of page height | Social row, copyright line |

**Margins:** 44px top, 52px left and right, 36px bottom (at 96dpi / Puppeteer scale). Consistent with interior page margins converted to the dark-background context.

---

### Zone 1 — Top

**Depth mark:** Caspr dot (7px, `caspr-red`) with three depth indicator lines (25px · 17px · 9px) to its right — the Intelligence tier mark. This is a document-level mark, not a report-type indicator. It signals the end of the complete document.

**Caspr wordmark:** the reversed asset `caspr-logo-white.svg`, ~62mm wide, at 88% opacity. Left-aligned, 20px below the depth mark. Never substitute typeset text.

**Tagline:** `"Analytical AI — built for business analysis, not conversation."` — 9.5pt Regular, ALL CAPS, letter-spacing 0.1em, `rgba(255,255,255,0.28)`. 4px below the wordmark.

**Divider:** 1px horizontal rule, full text width, `rgba(232,69,60,0.35)` — a muted red rule separating the top zone from the main content. 36px below the tagline.

---

### Zone 2 — Main content (two columns)

**Column split:** Left 52% · Right 48%. Separated by a 1px vertical rule at `rgba(214,212,207,0.1)`. No gutter — the rule marks the boundary.

**Section labels:** 6.5pt Semi Bold, ALL CAPS, letter-spacing 0.2em, `caspr-red`. 10px below each label, the content begins.

#### Left column

**About Caspr.**

Content: What Caspr is, what powers it, what it promises. Written to the §11 voice standard — conclusions not descriptions. Bold weight on "Analytical AI" and "Source · Assess · Conclude". Approximately 80–100 words.

Approved text:
> *Caspr is* **Analytical AI** *— purpose-built for business analysis, not conversation. A single prompt delivers a boardroom-ready report in under fifteen minutes, citing every insight to a credible, verifiable source.*
>
> *Powered by* **Source · Assess · Conclude** *— a curated corpus kept current by live data feeds, every claim triangulated across independent sources, and a position that survives the room. Over 25 million curated sources: government databases, industry filings, news feeds, and published research. Not web-scraped noise.*
>
> *Every claim cited. Every conclusion traceable. Built for the boardroom.*

Typography: 9pt Regular, `rgba(255,255,255,0.55)`, 1.75× leading. Bold terms at `rgba(255,255,255,0.80)`, weight 500.

**Contact**

Three rows, each with a label and value:

| Label | Value |
|---|---|
| Web | caspr.ai |
| Email | hello@caspr.ai |
| Support | support@caspr.ai |

Label: 6.5pt Semi Bold, ALL CAPS, letter-spacing 0.16em, `rgba(255,255,255,0.22)`, fixed width 44px.
Value: 9pt Regular, `rgba(255,255,255,0.55)`.
Row spacing: 7px between rows.

#### Right column

**Disclaimer**

Four paragraphs covering: informational purpose only / no investment or professional advice / no liability for loss or damage / reproduction rights.

Typography: 7.5pt Regular, `rgba(255,255,255,0.30)`, 1.8× leading. Paragraph spacing: 10px.

Approved text (do not paraphrase without legal review):
> *This report has been prepared by Caspr for informational purposes only. The analysis, data, and conclusions contained herein are based on sources believed to be reliable at the time of preparation. Caspr makes no representation or warranty, express or implied, as to the accuracy, completeness, or fitness for purpose of any information in this report.*
>
> *This report does not constitute investment, legal, financial, or professional advice of any kind. Recipients should seek independent professional advice before acting on any information or analysis contained in this report.*
>
> *Caspr accepts no liability for any direct, indirect, or consequential loss or damage arising from the use of this report or reliance on its contents. The views and analysis expressed are those derived from Caspr's research methodology and do not represent the views of any third party whose data has been referenced.*
>
> *All third-party source material is referenced for informational purposes. Reproduction of this report in whole or in part requires prior written permission from Caspr.*

**Methodology**

One short paragraph explaining how analysis is generated and what "Caspr analysis" means as a citation.

Typography: same as Disclaimer.

Approved text:
> *Analysis is generated using Caspr's* **Source · Assess · Conclude** *methodology, drawing on a curated database of over 25 million verified sources. Every factual claim in this report is cited to a primary source. Where calculations or derivations are Caspr's own, this is indicated as "Caspr analysis" alongside the underlying source data.*

---

### Zone 3 — Footer

**Divider:** 1px horizontal rule, full text width, `rgba(214,212,207,0.10)`. 20px above the social row.

**Social row:** Three items side by side, each showing an inline SVG icon (14×14px, fill `rgba(255,255,255,0.22)`) and a text handle. Items separated by 1px vertical rules at `rgba(214,212,207,0.12)`.

| Platform | Handle / URL |
|---|---|
| LinkedIn | linkedin.com/company/caspr-research |
| X (formerly Twitter) | x.com/casprresearch |
| Instagram | instagram.com/casprresearch |
| Website | caspr.ai |

Social text: 7.5pt Regular, `rgba(255,255,255,0.28)`, letter-spacing 0.04em.

**Copyright row:** immediately below the social row.

- Left: `© [year] Caspr. All rights reserved. Unauthorised reproduction prohibited.` — 7pt Regular, `rgba(255,255,255,0.16)`, letter-spacing 0.04em. Year is generated dynamically from the report date.
- Right: Caspr wordmark — `caspr-logo-white.svg`, ~17mm wide, at 30% opacity.

---

### Implementation notes

- The last page is a fixed template — its content does not change per report except for the copyright year.
- Social handles and email addresses are confirmed and final. Do not modify without approval from Joy.
- The disclaimer text is approved for use. Any modification requires review by Joy before shipping.
- The depth mark (3 lines) on this page is decorative and does not indicate analysis type. It marks document completion.

---

*This document is the authoritative style specification for all Caspr report outputs.*
*Questions: Joy (Marketing). Engineering: Jayant.*
