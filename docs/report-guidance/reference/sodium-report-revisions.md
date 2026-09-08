# Sodium Production for Pharma — Report Revision Brief
*Reference document for redesigning the existing Intelligence report*
*Owner: Joy (Marketing) · Last updated: 2026-05-15*
*Design system reference: `docs/report-guidance.md`*

---

## How to use this document

This file is a page-by-page and section-by-section revision guide for the existing *Sodium Production for Pharma* Intelligence report. For every change listed, the **Current state** describes what exists in the file today. The **Revised state** describes exactly what it should become. Where applicable, the exact revised copy is provided so there is no ambiguity.

The HTML visual reference (`docs/sodium-report-visual-reference.html`) shows the key redesigned elements rendered.

---

## Priority Order

| Priority | Category | Effort | Impact |
|---|---|---|---|
| 1 | Section headers → findings | Low (copy only) | Critical |
| 2 | Executive Summary restructure | Medium | Critical |
| 3 | Callout stats (new elements) | Medium | High |
| 4 | Table source lines + key figure highlights | Low | High |
| 5 | Section opening pages | Medium | High |
| 6 | Running headers → findings | Low | Medium |
| 7 | Body copy: hedge removal + consequence sentences | Medium | Medium |
| 8 | Cover typography | Low | Medium |
| 9 | Caspr footer wordmark on all pages | Low | Medium |
| 10 | Chart titles → findings | Pass to chart team | High |

---

## 1. Cover Page

### Current state
- Report title at moderate weight, readable but not dominant
- Caspr wordmark present
- *INTELLIGENCE* badge present

### Revised state
- Report title: increase to 40pt Bold, white — must be legible at thumbnail
- Subtitle (scope line): 16pt Regular, white — *"An Intelligence analysis of India's pharmaceutical sodium market: supply sources, production economics, and capital viability."*
- Ensure bottom-left quadrant of photograph is dark enough for white text. If not, apply a dark gradient overlay to the bottom 30% of the image only (exception to no-gradients rule — this is photography treatment, not UI decoration).

### Revised title copy
```
Sodium Production
for Pharma
```
*(line break after "Production" for visual weight)*

---

## 2. Executive Summary (Pages 4–5)

### Current state
Compressed version of the full report. Flowing paragraphs in the same structure as body sections. Does not state what decision the report supports.

### Revised state
Replace with decision brief format.

---

**Opening sentence (new — add at top):**
> *This analysis supports a go/no-go decision on greenfield pharmaceutical-grade sodium production in India, and identifies the three variables that determine investment viability.*

---

**Revised findings blocks (replace current body paragraphs):**

> **Finding 1 — Supply concentration risk is acute**
> India sources approximately 75% of its pharmaceutical-grade sodium from China. At 7,500 tonnes per year, even a moderate tariff event (15%+) would push spot prices from USD 2.67/kg to above USD 4.20/kg — eliminating margin for most finished goods manufacturers. There is no domestic supplier capable of substituting this volume within a 24-month horizon.

> **Finding 2 — Domestic production economics are marginal at small scale**
> Below 6,000 tonnes annual output, no modelled scenario produces an IRR that exceeds cost of capital. The minimum viable greenfield requires approximately INR 280 crore in capital expenditure. This is not a market where incremental entry is rational.

> **Finding 3 — Regulatory timeline is the critical path risk**
> Greenfield approval under current CDSCO and state environmental frameworks adds 18–24 months before commissioning. Any capital deployment decision must account for this lead time before the first tonne is produced.

> **Finding 4 — The market is not contestable at current pricing**
> At USD 2.67/kg, China-origin supply undercuts the production cost of any greenfield Indian facility at volumes below 8,000 tonnes/year. Entry is viable only if: (a) China import costs rise materially, (b) a captive supply rationale exists independent of market pricing, or (c) the investment horizon exceeds 7 years.

---

**Closing sentence (new — add at bottom):**
> *The data narrows the decision to two variables: scale and timing. The sections that follow provide the evidence base for both.*

---

### Layout change
- Convert from single-column flowing paragraphs to two-column layout
- Left column (65%): finding label + finding body
- Right column (35%): key number from each finding, set at 20pt Bold `caspr-red`
  - Finding 1: **75%**
  - Finding 2: **INR 280Cr**
  - Finding 3: **18–24 months**
  - Finding 4: **USD 2.67/kg**

---

## 3. Section Headers — Full Replacement List

Replace every section header with the finding version below. The section number and visual treatment remain the same; only the text changes.

| Section | Current header | Revised header (finding) |
|---|---|---|
| 1 | Market Overview | India imports 75% of pharmaceutical sodium — a structural dependency with no near-term domestic substitute |
| 1.1 | Import Volume and Sources | China supplies 7,500 tonnes annually; no other source exceeds 8% market share |
| 1.2 | Price History | Import prices have held below USD 3.00/kg for five consecutive years — Chinese overcapacity is the mechanism |
| 2 | Regulatory Environment | Greenfield approval adds 18–24 months — the critical path risk for any capital deployment decision |
| 2.1 | CDSCO Framework | CDSCO classification as an API precursor triggers the longer approval track; budget 22 months |
| 2.2 | State Environmental Clearance | Environmental clearance timelines vary 6–14 months by state; Rajasthan and Gujarat are fastest |
| 3 | Competitive Landscape | Three producers control 60% of global pharmaceutical-grade sodium capacity |
| 3.1 | Global Producers | Solvay, Tata Chemicals, and Inner Mongolia Lantai account for majority of certified supply |
| 3.2 | India Domestic | No Indian producer currently holds WHO-GMP certification for pharmaceutical-grade sodium |
| 4 | Supply Chain Analysis | China-origin lead times average 14–18 weeks; a supply disruption event offers 6–8 weeks of buffer before production impact |
| 5 | Production Technology | Castner-Kellner and membrane cell electrolysis are the viable processes; capital cost differential is 35% |
| 5.1 | Process Comparison | Membrane cell requires lower capital but higher operating cost — the NPV crossover is at 5,200 tonnes/year |
| 6 | Raw Material Requirements | Sodium chloride purity is the binding constraint; Indian salt pans can supply but at 12–15% premium to industrial grade |
| 7 | Capital Expenditure | A minimum viable greenfield at 6,000 tonne capacity requires INR 240–320 crore depending on technology and state |
| 7.1 | Capex Breakdown | Land, civil works, and electrolysis equipment account for 78% of total project cost |
| 7.2 | Working Capital | Working capital cycle of 90–120 days requires INR 18–24 crore in permanent working capital |
| 8 | Operating Economics | All-in production cost ranges INR 195–240/kg at 6,000 tonne scale — above China import parity at current prices |
| 8.1 | Cost Build-up | Power is the dominant operating cost at 42% of all-in; tariff stability is a key project risk |
| 8.2 | Economies of Scale | Production cost falls 22% between 4,000 and 8,000 tonnes/year — scale is the primary value driver |
| 9 | Revenue and Market | Addressable revenue at 6,000 tonnes is INR 160–180 crore/year — assuming domestic supply premium of 8–12% over China import price |
| 10 | Financial Model | Base-case IRR reaches 22% at 6,000 tonnes with an 8% domestic price premium — marginal but viable |
| 10.1 | Base Case | 22% IRR, 6.4-year payback — contingent on 8% premium to China CIF price holding through the investment horizon |
| 10.2 | Downside Case | At 0% premium (import price parity), IRR falls to 11% and payback extends to 9.1 years |
| 10.3 | Upside Case | A 15% premium scenario (triggered by tariff or supply disruption) produces 31% IRR and 4.8-year payback |
| 11 | Risk Analysis | Three risks individually break the investment case: tariff removal, Chinese capacity expansion, or power tariff increase above 18% |
| 12 | Sensitivity Analysis | IRR is most sensitive to production scale and domestic price premium — less sensitive to capex and operating cost assumptions |
| 13 | Implementation Roadmap | A 36-month path from financial close to first production is achievable; 48 months is conservative |
| 14 | Strategic Options | Build, toll-manufacture, or import-and-process: only greenfield build delivers supply security — at a cost premium |
| 14.1 | Build vs. Buy | Acquisition of an existing facility would reduce timeline by 14–18 months and eliminate greenfield risk; no known assets currently for sale |
| 14.2 | EBITDA Scenarios | EBITDA turns positive at 5,200 tonnes; above 6,000 tonnes, EBITDA margin stabilises at 18–22% |
| 14.3 | IRR Sensitivity | IRR is viable (>15%) in 7 of 9 modelled scenarios — the two exceptions are price parity with China plus a 10% cost overrun |
| 15 | Conclusion | The investment is viable at scale; the decision is whether the strategic rationale justifies the capital at current import pricing |
| 16 | Appendix | Source data, methodology, and assumptions |

---

## 4. Callout Stats — New Elements to Add

One callout stat per major section. Place in right column on two-column pages, or as a centred full-width block on section transition pages.

| Section | Callout number | Label |
|---|---|---|
| 1 (Market Overview) | **75%** | of India's pharmaceutical sodium imports originate from a single source country |
| 2 (Regulatory) | **18–24 months** | greenfield approval timeline under current CDSCO and state environmental frameworks |
| 3 (Competitive) | **3** | producers control 60% of global pharmaceutical-grade sodium capacity |
| 4 (Supply Chain) | **14–18 weeks** | average lead time from China-origin supply |
| 7 (Capex) | **INR 280Cr** | estimated capital requirement for minimum viable greenfield at 6,000 tonne capacity |
| 8 (Operating Economics) | **42%** | share of all-in production cost attributable to power — the dominant operating variable |
| 10 (Financial Model) | **22%** | base-case IRR at 6,000 tonnes annual output with 8% domestic price premium |
| 12 (Sensitivity) | **6,000 T** | the output threshold below which no scenario produces an IRR above cost of capital |
| 14.3 (IRR Sensitivity) | **7 of 9** | modelled scenarios produce an IRR above 15% — investment is viable under most conditions |

**Typographic spec:** Number at 48–64pt Bold `caspr-red`. Label at 10pt Regular `caspr-grey-mid`. Max 12 words in the label.

---

## 5. Table Revisions

### Mandatory additions to all tables

**Source lines:** Every table currently missing a source line needs one added. Format:
> *Source: [primary source, year]. Caspr analysis.*

Tables identified as missing source lines (verify against final document):
- Import volume table (Section 1.1, approx. p.7)
- Producer capacity table (Section 3.1)
- Capex breakdown table (Section 7.1)
- Cost build-up table (Section 8.1)
- All sensitivity tables (Section 12, Section 14.3)

**Key figure highlights:** In each table, identify the one number the reader should act on. Set it in **bold** or `caspr-red` text.

| Table | Key figure to highlight |
|---|---|
| Import volume (p.7) | 75% share for China-origin supply |
| EBITDA scenarios (p.140) | EBITDA margin at 6,000 tonnes base case |
| IRR sensitivity (p.141) | Base-case IRR figure (22%) |

**Row banding:** Apply alternating white / `#F2F1EF` banding to all tables with 6 or more rows.

**Column header treatment:** Set all column headers to: ALL CAPS · Inter Semi Bold · 8–9pt · letter-spacing 6–8% · white text on `caspr-black` header row.

---

## 6. Section Opening Pages

### Current state
Sections begin directly with section header + body copy on a standard white page.

### Revised state
Each major section (Sections 1–15) gets a dedicated opening page:
- Full-bleed dark background (`#1A1A18`)
- Section number: `caspr-red`, 48pt Bold, top-left
- Section finding (from the revised header list above): white, 24–28pt Semi Bold, left-aligned, vertically centred
- One supporting stat (optional): `caspr-red`, 16pt Regular, immediately below the finding — e.g. for Section 1: *"India: 75% import dependency. China: the only viable current source."*
- Rest of page: empty

This adds approximately 15 pages to the document total. Accept this — it is a feature.

---

## 7. Running Headers — Revised Copy

Replace current section name running headers with the finding.

| Pages | Current running header | Revised running header |
|---|---|---|
| Section 1 pages | Market Overview | India: 75% import dependency on a single source |
| Section 2 pages | Regulatory Environment | Greenfield approval: 18–24 month critical path |
| Section 3 pages | Competitive Landscape | Three producers, 60% of global capacity |
| Section 7 pages | Capital Expenditure | Minimum viable greenfield: INR 280Cr at 6,000T |
| Section 10 pages | Financial Model | Base-case IRR 22% — contingent on scale and premium |
| Section 14 pages | Strategic Options | Build is viable; import parity is the threshold risk |

---

## 8. Body Copy Edits — Section by Section

The following are targeted copy changes. These do not change the analysis — they change the register.

### Section 1 (Market Overview) — opening paragraph
**Current (approximate):**
> *"The market for pharmaceutical-grade sodium in India is characterised by significant import dependency. India imports a substantial proportion of its requirements from overseas, with China representing the dominant supply source."*

**Revised:**
> *"India imports approximately 7,500 tonnes of pharmaceutical-grade sodium annually. China supplies 75% of this volume. No domestic producer holds WHO-GMP certification. This is a single-source dependency with a 14–18 week supply chain — and no credible domestic substitute within a 24-month horizon."*

---

### Section 2 (Regulatory Environment) — opening paragraph
**Current (approximate):**
> *"The regulatory framework governing sodium production in India involves multiple authorities and may present challenges for prospective producers."*

**Revised:**
> *"Greenfield pharmaceutical-grade sodium production in India requires clearance from CDSCO (API precursor classification), state environmental authorities, and municipal/industrial land authorities. The critical path is CDSCO review — budget 22 months from application to approval. No shortcut exists; this timeline is structural, not administrative."*

---

### Section 10 (Financial Model) — IRR summary
**Current (approximate):**
> *"The financial model suggests that returns may be viable under certain conditions, depending on assumptions around scale, pricing, and operating costs."*

**Revised:**
> *"At 6,000 tonnes annual output and an 8% domestic price premium over China CIF, the base case produces a 22% IRR and a 6.4-year payback. This is viable but not robust — IRR falls to 11% at import price parity, and below cost of capital at any scale under 5,200 tonnes. The investment thesis depends on the premium holding."*

---

### Phrases to find and replace throughout

| Find | Replace with |
|---|---|
| *"It is worth noting that..."* | Delete. State the fact directly. |
| *"One could argue that..."* | Delete. State the conclusion. |
| *"This suggests that the market may be..."* | Replace with the specific finding + number. |
| *"Interestingly,..."* | Delete. |
| *"It is important to..."* | Delete. State it as fact. |
| *"significant"* (without a number) | Replace with the number. |
| *"substantial"* (without a number) | Replace with the number. |
| *"may"* / *"might"* / *"could"* in conclusions | Rewrite as a conditional: *"Under [condition], [outcome]."* |
| *"fast-growing"* | Replace with the CAGR. |

---

## 9. Chart Title Revisions (Pass to Chart Team)

| Current chart title | Revised chart title |
|---|---|
| Import Volume by Source Country | China dominates: 75% of India's pharmaceutical sodium imports, 2020–2024 |
| EBITDA by Production Volume | EBITDA margin improves non-linearly — the 6,000 tonne threshold is decisive |
| IRR Sensitivity Analysis | IRR is viable in 7 of 9 scenarios; scale and price premium are the controlling variables |
| Production Cost Build-up | Power accounts for 42% of all-in production cost — tariff risk is the largest operating variable |
| Regulatory Timeline | Greenfield approval: 22-month CDSCO critical path dominates total timeline |

---

## 10. Cover Page — Revised Copy Elements

| Element | Current | Revised |
|---|---|---|
| Title | Sodium Production for Pharma | Sodium Production for Pharma *(same, increase size to 40pt Bold)* |
| Subtitle | *(none or minimal)* | *An Intelligence analysis of India's pharmaceutical sodium market: supply concentration, production economics, and capital viability* |
| Date | *(current date)* | Keep |
| Report type badge | INTELLIGENCE | INTELLIGENCE *(keep — correct)* |

---

## 11. Footer — All Pages

**Add to every page footer (currently missing from body pages):**
- Left: abbreviated section title — 8pt Regular, `#6B6B66`
- Centre: page number — 8pt Regular, `#6B6B66`
- Right: **Caspr** + red dot — 8pt Regular, `#6B6B66` with `caspr-red` dot

This must be consistent on every page including appendix pages.

---

## 12. Page Count Impact

| Change | Pages added |
|---|---|
| Section opening pages (15 sections) | +15 |
| Executive Summary restructure (slight expansion) | +1 |
| Callout stat pages (where full-width placement used) | +3 estimated |
| **Total** | **~19 additional pages** |

Revised document: approximately **165 pages**. This is appropriate for an Intelligence report.

---

## Delivery Checklist

Before the revised report is considered complete:

- [ ] All 16 section headers replaced with findings (see §3 table)
- [ ] Executive Summary restructured per §2
- [ ] All 9 callout stats added (see §4)
- [ ] All tables: source lines added, key figures highlighted, row banding applied, column headers reformatted (see §5)
- [ ] Section opening pages added for all major sections (see §6)
- [ ] Running headers updated to findings (see §7)
- [ ] Body copy edits applied — hedge language removed, consequence sentences added (see §8)
- [ ] Chart titles revised (pass to chart team — see §9)
- [ ] Cover page updated (see §10)
- [ ] Caspr footer added to all body pages (see §11)
- [ ] Full document proofread: no exclamation points, no rejected language

---

*Questions: Joy (Marketing). Visual reference: `docs/sodium-report-visual-reference.html`.*
