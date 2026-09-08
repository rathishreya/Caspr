# Format Guidance — PPTX

*Layer 1 · Pass 2 (render) · `format = pptx` · tiers: Study · Intelligence*
*Reads alongside `report-style-guide.md` (the master system — this document specifies PPTX-only deviations)*
*Version 1.0 · 2026-08-19*

---

## How to read this document

The master design system (`report-style-guide.md`) governs all Caspr output. This document specifies what is **different** for PPTX. Where this document is silent, the master applies. Where it conflicts, this document takes precedence for PPTX output. *(Same contract as `brief-design-v2.md`.)*

> **Layouts, not sequence.** This file defines the slide layouts available and how each is built. It does **not** define a deck order, an agenda, or which slides a given report should contain. **Caspr decides the structure.** A renderer that hard-codes "cover → agenda → exec summary → sections" has violated the core rule.

**PPTX is not in the Brief base set** (`gate-output-spec.md §4`) — a Brief is a note, not a deck. It is available as a paid extra; if generated, it follows Study layouts at reduced volume.

---

## 1. The governing difference: this file gets edited

The PDF is a finished artefact. **The PPTX is raw material.** A consultant drops three slides into a client deck; a founder rebuilds the story around two exhibits; a strategist adds a slide of their own.

Everything below follows from that. Four consequences, all **RULES**:

1. **Native objects only.** Text is real text boxes. Tables are real PowerPoint tables. Charts are **native PPT charts with their data intact** — never images of charts. A user who cannot edit a number, or who finds a flattened picture where a chart should be, has received a broken deliverable.
2. **Everything sits on a Slide Master.** A user who inserts a new slide must get Caspr's typography, colour, and footer automatically. Layouts are defined once on the master and instanced — never hand-built per slide.
3. **Fonts embedded, with a declared fallback.** Inter embedded in the file; declare `Inter → Segoe UI → Helvetica Neue → Arial` in the theme, since embedding is unreliable across PowerPoint versions. **The wordmark is not a font** — place `caspr-logo-black.svg` / `caspr-logo-white.svg` as vector artwork. That is exactly why it was outlined to paths.
4. **No locked or grouped decoration.** Nothing that blocks a user from selecting, moving, or deleting an element. No background images baked into content slides.

---

## 2. Deck setup

| Property | Specification |
|---|---|
| Slide size | **16:9 — 13.333in × 7.5in** (33.87cm × 19.05cm / 12192000 × 6858000 EMU) |
| Theme colours | Map the master palette (`report-style-guide.md §2`) into the theme: `dk1` = `#0B0B09` · `lt1` = `#FFFFFF` · `accent1` = `#E8453C` · `dk2` = `#1A1A18` · `lt2` = `#F2F1EF` · `accent2` = `#6B6B66` · `accent3` = `#D6D4CF` |
| Theme fonts | Major + minor = **Inter** |
| Margins (content area) | 0.6in left / right · 0.5in top · 0.55in bottom |
| Content width | 12.13in |
| Baseline grid | 12-column grid, 0.15in gutter — for exhibit alignment |

**Colour discipline is unchanged from the master:** black, white, red accent, three greys. No gradients (the cover photograph overlay is the single permitted exception, §4). No drop shadows. No 3D. PowerPoint's default effects must be explicitly disabled in the theme.

---

## 3. Type scale (PPTX)

Print sizes do not survive projection. This scale replaces `report-style-guide.md §3` for PPTX only; weights, casing rules, and the no-exclamation rule carry over unchanged.

| Role | Weight | Size | Notes |
|---|---|---|---|
| Cover title | Bold | 40pt | ≤2 lines; drop to 34pt beyond 65 chars |
| Section divider headline | Bold | 30pt | ≤2 lines |
| **Action title** (standard slide) | Semi Bold | **20pt** | ≤2 lines — the finding, see §5 |
| Slide sub-head | Semi Bold | 14pt | optional |
| Body / bullet text | Regular | 14pt | never below 12pt |
| Exhibit label | Semi Bold | 11pt | ALL CAPS, letter-spacing 6% |
| Table column header | Semi Bold | 10pt | ALL CAPS, white on `caspr-black` |
| Table body | Regular | 10–11pt | |
| Callout stat number | Bold | 54pt | `caspr-red` |
| Callout stat label | Regular | 12pt | `caspr-grey-mid` |
| Source line | Regular Italic | 9pt | `caspr-grey-mid` |
| Footer text | Regular | 9pt | `caspr-grey-mid` |

**12pt is the floor.** If content will not fit at 12pt, the slide holds too much — split it. Shrinking type to fit is a **RULE** violation, and PowerPoint's autofit must be **disabled** on all text placeholders so it cannot happen silently.

---

## 4. Layouts

Define these on the Slide Master. Caspr selects which to use and in what order — this file only specifies how each is built.

### 4.1 Cover

Mirrors the PDF cover (`report-style-guide.md §4`) at 16:9.

| Element | Specification |
|---|---|
| Photograph | Full-bleed, `§4.3` selection rules and brightness filter unchanged |
| Overlay gradient | The single permitted gradient — `§4.3` stops, adapted to 16:9 height |
| Caspr dot + depth lines | Top left, 0.5in from each edge. **2 lines (Study) / 3 lines (Intelligence)** per `§4.2` |
| Badge pill | `STUDY` / `INTELLIGENCE` — white fill, 8pt Semi Bold ALL CAPS, `caspr-red` text, 2px radius |
| Title | 40pt Bold, white, left-aligned, lower-left content block |
| Scope line | 12pt Regular, `rgba(255,255,255,0.58)` |
| Date + wordmark | Bottom edge — date left, Caspr wordmark right: `caspr-logo-white.svg` placed as vector, ~28mm wide |

### 4.2 Section divider

The dark transition page, adapted. Full-bleed `caspr-grey-dark` (#1A1A18), flat — no photograph, no gradient.

- Section number: `caspr-red`, 40pt Bold, upper left
- Section finding: white, 30pt Semi Bold, vertically centred, max 2 lines
- Optional supporting stat: `caspr-red`, 20pt Regular, below the finding
- Remainder empty — **intentional restraint, not a layout error**

### 4.3 Standard content

The workhorse. Three zones, top to bottom:

```
┌──────────────────────────────────────────────┐
│ ACTION TITLE — the finding, 20pt Semi Bold   │  ← §5
│ ──────────────────────────────────────────── │  ← 2pt caspr-red rule, content width
│                                              │
│  Body zone — prose, exhibit, or split        │  ← §4.4
│                                              │
│ ──────────────────────────────────────────── │  ← 0.5pt caspr-rule
│ Source: […]                    Caspr.   │ 7  │  ← source line · wordmark · number
└──────────────────────────────────────────────┘
```

### 4.4 Body-zone variants

Available arrangements. Caspr chooses; the renderer must support all four.

| Variant | Split | Use |
|---|---|---|
| Full-width prose | 12 col | narrative, argument |
| Text + exhibit | 5 / 7 col | the standard analytical slide — argument left, evidence right |
| Full-bleed exhibit | 12 col | a chart or table that is itself the finding |
| Callout + text | 4 / 8 col | one dominant number beside its interpretation |

### 4.5 Exhibit slide

A chart or table as the whole argument. Action title + exhibit filling the body zone + mandatory source line. Exhibit label (ALL CAPS, 11pt) sits above the exhibit where the deck references exhibits by name.

### 4.6 Closing slide

Mirrors the PDF last page (`report-style-guide.md §15`), compressed to one slide: `caspr-grey-dark` background · depth mark + `Caspr.` wordmark + tagline · About Caspr (short form) · disclaimer at 8pt · contact and social row · copyright.

**Disclaimer text is `§15`'s approved wording — do not paraphrase.** Where the full text will not fit at 8pt, use the approved short form and carry the full disclaimer in the PDF; never rewrite it to fit.

### 4.7 References slide(s)

`§14` Layer 3 unchanged — numbered entries matching in-deck superscripts, continued across as many slides as needed. Never truncate the reference list to save slides.

---

## 5. Action titles — the most important rule in this document

**Every content slide's title states the finding.** This is `report-style-guide.md §6` applied to slides, and it is the convention every consulting ICP already lives by — the reason a deck can be read by title alone.

| Do not write | Write instead |
|---|---|
| Market Overview | India imports 75% of its pharmaceutical sodium from a single source |
| Competitive Landscape | Three suppliers control 60% of global capacity |
| Financial Analysis | Base-case IRR reaches 22% only above 6,000 tonnes |

**The test:** reading only the action titles, in order, must give the reader the argument. If they read as a table of contents, the deck has failed.

Titles run to two lines maximum at 20pt. A title needing three lines is carrying two findings — split the slide.

---

## 6. One slide, one point

A slide carries **one finding**. Where a slide holds two arguments, it becomes two slides.

- **Prose over bullets**, per `§11`. The bullet discipline applies in full: no lists under three items, no nested bullets ever, no list where the items have a causal relationship — that relationship *is* the analysis and belongs in a sentence.
- **A slide of six fragmentary bullets is a failure state.** Two short paragraphs beat six fragments.
- Where bullets are genuinely right (discrete, parallel, reorderable), each item must be a complete finding that stands alone.

---

## 7. Charts

`report-style-guide.md §13` governs entirely — permitted chart types, the greyscale-plus-one-red-series rule, zero-baselined axes, horizontal grid lines only, no 3D, no gradient fills, no pie or donut charts.

**PPTX-specific requirements:**

- **Native PowerPoint charts with the underlying data intact.** A user must be able to open the data, correct a number, and have the chart update. Images of charts are a **RULE** violation.
- PowerPoint's default styling must be overridden explicitly — its defaults contradict nearly every rule in `§13`.
- Chart fonts inherit the theme; data labels 10pt, `caspr-grey-mid` (`caspr-black` Semi Bold on the highlighted series).
- Legends only where there are two or more series; positioned above or below, never inside the plot area.
- Every chart carries its source line in the slide's source position, not floating inside the chart object.

---

## 8. Tables

`report-style-guide.md §9` governs: black header row with white ALL CAPS Semi Bold, alternating white / `caspr-grey-light` banding starting white, outer border only, no vertical dividers, one key figure per table in `caspr-red`, mandatory source line.

**PPTX-specific:**
- Real PowerPoint tables — never images, never text boxes faking a grid.
- **Maximum ~8 rows × 6 columns on one slide.** Larger tables split across slides with the header row repeated, or move to the XLSX output (`format-data-outputs.md`).
- Row height minimum 0.28in; never clip text.
- PowerPoint's default table styles must be disabled — banding is set explicitly, not via a built-in style.

---

## 9. Citations

`report-style-guide.md §14` holds, with one adaptation to how decks are actually used.

| Layer | On slides |
|---|---|
| **1 — Source tag** | Directly beneath every table, chart, and callout stat, in the slide's source position. **Mandatory, no exceptions.** |
| **2 — Superscript** | Inline after the specific claim in body text, 9pt superscript |
| **3 — References** | Reference slide(s) at the end, numbered to match |

**Why Layer 1 matters more in PPTX than anywhere else:** slides get separated from their deck. A slide pasted into a client presentation must carry its own source, or Caspr's central credibility claim breaks at exactly the moment it is being relied on. **A slide with an unsourced exhibit does not ship.**

---

## 10. Tier differences

| | Study | Intelligence |
|---|---|---|
| Depth lines on cover | 2 (21px · 13px equivalent) | 3 (25px · 17px · 9px) |
| Badge | `STUDY` | `INTELLIGENCE` |
| Capability row on cover | ✗ | ✓ — three descriptors, `§4.2` |
| Indicative volume | ~25–40 slides | ~50–80 slides |
| Scenario / sensitivity exhibits | where the analysis calls for it | expected — the tier's distinguishing content |

Volumes are **indicative, not targets.** Length follows analytical completeness (`§5.1`). Padding a deck to reach a number is a failure; so is compressing findings to stay under one.

---

## 12. Evidence-class blocks on slides

**Added 2026-08-19.** The Signal (`report-style-guide.md §9a`), Divergence (`tier-intelligence.md §4`), and Primary Data (`components.md` C1) were specified for the page. A deck needs its own treatment — and **shrinking the PDF block onto a slide is not it.**

**The governing rule:** the distinction between an evidence class and a cited finding must survive at projection distance and, more importantly, **survive a slide being lifted out of the deck.** A Signal slide pasted into a client presentation that no longer reads as sentiment has become a fabricated finding.

### Shared slide treatment

| Element | Specification |
|---|---|
| Placement | **Its own slide** where the block carries a finding; a body-zone element (§4.4 "Text + exhibit", 5/7) where it supports the argument on the slide |
| Surface | The block's tint fills the **body zone only** — never the full slide. The action title and footer sit on white, so the slide still reads as a Caspr slide |
| Label | The block's label at **11pt** Semi Bold ALL CAPS (up from 10px on the page) — letter-spacing 0.8px, `caspr-grey-mid` |
| Action title | Still the finding (§5). **The label is not the title** — a slide titled `THE SIGNAL` has wasted its title |
| Attribution / source | Full attribution on the slide, never abbreviated to fit. If it does not fit, the block is too large for one slide — split it |

### Per block

**The Signal** — cool `#F2F2F4` body zone, no left rule. Aggregate attribution in full (`§9a` forbids a single pulled quote; that holds here). The waveform icon scales to 16px.

**Divergence** — warm `#F2F1EF` body zone, **3px `caspr-red` left rule, square corners.** Positions as a two-column list, source left / figure right, tabular figures. **The resolution line is the largest text in the block** (13pt Medium) — on a slide the eye must land on it before the disagreeing numbers, or the audience takes away confusion rather than the finding.

**Primary Data** — white body zone with a **1px `caspr-rule` full border**, method pill top-left. **The `AI-SIMULATED PANEL` pill and the "not collected from people" line are both required on the slide** — the C1 integrity RULE does not relax because space is tight. A synthetic-panel chart on a slide with no method pill is the single most damaging output this format can produce, because slides travel.

### What must not happen

- **No block rendered as a plain bulleted list.** Stripping the container silently promotes the content to a cited finding.
- **No tint on the full slide** — that reads as a section divider (§4.2) and breaks the deck's structural grammar.
- **No abbreviating attribution or method metadata** to make it fit. Split the slide instead.

---

## 11. Checklist — PPTX

### Automated
- [ ] Slide size 16:9 (13.333in × 7.5in)
- [ ] All slides instanced from Slide Master layouts
- [ ] Fonts embedded; fallback chain declared in theme
- [ ] **No chart is an image** — all charts native with data intact
- [ ] **No table is an image** — all tables native
- [ ] Text autofit disabled on all placeholders
- [ ] No text below 12pt except source lines (9pt) and footers (9pt)
- [ ] Every table, chart, and callout stat has a source line on its own slide
- [ ] All superscripts resolve to a References slide entry
- [ ] No exclamation points
- [ ] No gradient outside the cover overlay; no drop shadows; no 3D
- [ ] **Every evidence-class block retains its container and label** — never flattened to bullets (§12)
- [ ] **Primary Data slides carry the method pill and, if synthetic, the "not collected from people" line** *(RULE)*
- [ ] Evidence-block tint fills the body zone only, never the full slide
- [ ] Depth lines and badge correct for tier
- [ ] Closing slide present with unmodified approved disclaimer text
- [ ] Caspr wordmark on every slide footer — placed SVG asset, never typeset text

### Manual
- [ ] **Every content slide title states a finding, not a topic**
- [ ] **Reading titles alone conveys the argument**
- [ ] One finding per slide
- [ ] No slide of fragmentary bullets where prose belongs
- [ ] No nested bullets anywhere
- [ ] Exhibits are legible at projection distance
- [ ] A slide could be lifted into a client deck and still carry its source
- [ ] Section dividers use flat dark background with white space intact
- [ ] **No deck sequence was imposed by this file** — structure is Caspr's own

---

*Owner: Joy · Engineering: Jayant · Layer 1 of `00-resolution-map.md`*
*Master design system: `docs/report-guidance/report-style-guide.md`*
