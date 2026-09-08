# Tier Guidance — Intelligence

*Layer 1 · Pass 2 (render) · `tier = intelligence` · `format = pdf`*
*Reads alongside `report-style-guide.md` (the master system — this document specifies Intelligence-only deviations)*
*Version 1.0 · 2026-08-19*

---

## How to read this document

The master design system governs all Caspr output. This document specifies what is **different** at Intelligence tier. Where silent, the master applies. Where it conflicts, this takes precedence for Intelligence output. *(Same contract as `brief-design-v2.md`.)*

> **Outcome, not method.** Specifies how depth and validation are *expressed*. Does not specify sections, order, which models to run, or which sources to consult.

---

## 1. The tier promise — and the problem it creates

Intelligence is *"multiple analytical models challenging and validating each other. Highest rigour, maximum source depth"* at **$300** (`pricing-model.md §4`) — 3.75× a Study.

**The problem: rigour is invisible.** A reader who receives a longer Study cannot see that three models argued with each other. If Intelligence reads as Study-plus-pages, the price is indefensible and the tier collapses.

**So the defining rule of this tier:**

> **The validation must be visible on the page.**

Manufactured consensus is the failure mode of Intelligence. A report that is confident about everything has hidden precisely the work the reader paid for.

### ⚠ What actually separates Intelligence from a Study — corrected 2026-08-26 (Joy)

**An earlier version of this section made *reporting disagreement* the defining rule of the tier. That was
wrong, and it leaked:** the type files and the resolution map picked it up and gated disagreement-surfacing to
Intelligence only, which left everything a customer can buy specified to give them one number.

**Reporting disagreement is the claim, at every tier** — `report-style-guide.md` §9b.

**What separates Intelligence is architectural:**

| | |
|---|---|
| **More independent analytical passes** | Multiple analytical models challenging and validating each other, rather than one |
| **Depth of the analysis tree** | **Intelligence goes deep on the second level of the tree. A Study does not** |

**That yields more alternatives found and each tested harder — so the disagreement Intelligence surfaces is
usually richer and better adjudicated.** It is a difference of **degree and rigour, not of permission.**

> **A Study that finds two conflicting figures must report both. Intelligence is more likely to have found
> four, and to have tested which survives.**

---

## 2. Already in the master

No change needed — implemented in `report-style-guide.md`:

| Element | Spec |
|---|---|
| Depth indicator lines | **3** — 25px · 17px · 9px, 4px gaps (`§4.2`) |
| Badge | `INTELLIGENCE` (`§4.1`) |
| Scope / subtitle line | present (`§4.2`) |
| 32px `caspr-red` rule on cover | Intelligence only (`§4.2`) |
| Capability row | Intelligence only — three descriptors, 5.5pt Medium ALL CAPS, red dot separators (`§4.2`) |
| Indicative length | ~120 pages including cover (`§5.1`) — a target, not a cap |

---

## 3. Content treatment — where the tier earns its price

These are content obligations that the render must accommodate.

### 3.0 Resolution — the analysis tree goes deeper *(the primary $300 argument)*

**Added 2026-08-19 (Joy).** Validation alone does not justify 3.75× a Study, and it is hard for a reader to see. **Resolution is the other half — and it is the half a buyer can verify from the contents page.** Canonical statement: `00-resolution-map.md` § Tier semantics.

| Tier | Treatment of the analysis tree |
|---|---|
| Brief | states the **aggregate** — *"ten players hold 80% of the market"* |
| Study | **enumerates and profiles** — all ten named, roughly half a page each |
| **Intelligence** | **full analysis of each node, and often the level below it** — each of the ten analysed in depth: segments, economics, trajectory, exposure |

**The nodes are whatever the analysis actually branches on** — competitors, segments, geographies, targets, risks, scenarios, sources. Intelligence does not simply write more about the same ten things at the same grain; **it opens each one.**

**What this means for the render:** the page architecture must carry a deeper hierarchy without the reader losing the thread. This is why §5's navigation additions are not optional at this tier — the nested table of contents and the running headers exist precisely because the tree is deeper. Sub-sections (`§3` scale, 12–13pt Semi Bold) carry real structural weight here; at Study they are occasional.

**A test that catches the failure:** if the Intelligence contents page reads like the Study contents page with longer sections beneath it, the tree did not deepen and the tier has not been delivered.

### 3.1 Calibrated confidence on load-bearing findings

Every finding the report's conclusions rest on carries an explicit sense of how well-established it is. This is **not** hedging — `§11`'s hedging ban stands in full. It is `§11`'s *"hedge the conditions, not the findings"* rule applied systematically:

✗ *"The market may reach USD 4.2bn."*
✓ *"USD 4.2bn by 2028 on the base case. Two independent sources converge within 6%; a third, using a broader category definition, puts it at 5.1bn — the gap is definitional, not analytical."*

The second states a finding, a range, and *why* the range exists. That is the Intelligence register.

### 3.2 Divergence is content, not a footnote

Where models or sources genuinely conflict, the conflict is **presented and explained** — what each says, why they differ, and which is more load-bearing for the reader's decision. Averaging two conflicting estimates into one number destroys the information the reader is paying for.

### 3.3 What remains unresolved

Intelligence states what it could **not** establish, and why. This is a credibility asset, not an admission — it is also the tier's honest boundary (see `type-investment-deal.md`, where it is a RULE at Diligence).

### 3.4 Scenarios and sensitivities

Where the analysis turns on assumptions, the report shows how conclusions move when those assumptions move. Presented as exhibits (`§9` tables / `§13` charts) — not buried in prose.

---

## 4. The Divergence block — **APPROVED 2026-08-19 (Joy)**

**Optional, exactly like The Signal.** Not every Intelligence report carries one, and it is never forced. Where the evidence genuinely diverges on something material, this is how it renders.

**Precedent:** `report-style-guide.md §9a` ("The Signal") establishes the pattern — a distinct block marking a *different class of evidence*, without implying it is lesser. Divergence is the same idea for a different purpose: marking where the evidence base does not agree. The two are deliberate siblings and must read as one family.

**Anatomy:**

| Element | Specification |
|---|---|
| Container | Full content-column width, in document flow between paragraphs — never a sidebar. Generous padding |
| Surface | `caspr-grey-light` (#F2F1EF) — the warm neutral, distinct from §9a's cool `#F2F2F4` |
| Left edge | 3px `caspr-red` vertical rule, full block height. **Square corners** — `§` no rounded corners on single-sided borders |
| Header | Label `WHERE THE EVIDENCE DIVERGES` — Inter Medium, 10px, letter-spacing 0.8px, `caspr-grey-mid` |
| Positions | Each: source or model named left, its figure or claim right (tabular figures), Inter Regular 11.5px, hairline `caspr-rule` between |
| Resolution line | Inter Medium 12px, `caspr-black`, above a `caspr-rule` top border — **why** they differ and which is load-bearing |
| Source line | Standard `§14` Layer 1 treatment beneath, naming every source in the block |

### The two rules

1. **Optional — use sparingly.** At most one per section, only where the divergence is material to a conclusion. Expect two or three in a 120-page Intelligence, not one per section. **Overuse reads as indecision, not rigour.**
2. **If it renders, the resolution line is required.** The resolution line is what separates analysis from a list of disagreeing sources — anyone can print three numbers. A block emitted without one must not render.

### Data contract — inline from Jayant's API

**Divergence is emitted by the assessment stage as structured data, not inline prose** — the renderer draws the block treatment. This is the same contract already established for The Signal (`architecture-alignment-final.md`: *"The Thinking Brain must emit these as structured data, not inline prose (the frontend renders the distinct block treatment)"*). **⚠ That quotation is verbatim and still says *Thinking Brain*, because `architecture-alignment-final.md` has not yet been swept — it is a product file, on Joy's list. The contract is unchanged; only the emitter's name is pending.**

Shape: an ordered list of `{source, claim}` positions plus a single `resolution` string. A payload missing `resolution` is invalid and is dropped rather than rendered — enforcing rule 2 at the data layer, not in review.

**Both `§9a` The Signal and this block follow one pattern:** the analysis identifies the evidence class; the renderer owns the treatment. New evidence-class blocks should extend the same union rather than inventing a new mechanism.

---

## 5. Navigating 120 pages

At Study length a reader scans. At Intelligence length they navigate. Additions to the master:

- **Table of contents is mandatory and nested** — sections and sub-sections, per `gate-output-spec.md §9` (*"Study + Intelligence = nested"*). Brief omits it; Intelligence cannot.
- **Running headers do real work.** `§5.4`'s abbreviated section finding is load-bearing at this length — a reader landing on page 74 must know where they are from the header alone.
- **Section opening pages** (`§5.2`) are more valuable, not less, at this length. The temptation to drop them to save pages must be resisted — they are the reader's structural anchor.
- **Executive Summary** (`§7`) carries more weight: for most readers of a 120-page document it *is* the document. Its 2–3 page target holds — it does not scale with the report.

---

## 6. What does **not** change

Explicitly, to prevent scope drift at this tier:

- **The visual system.** Same palette, type scale, margins, table and chart rules. Intelligence is not a more decorated Study.
- **One callout stat per top-level section maximum** (`§8`). Length does not license more.
- **Bullet discipline** (`§11`). Long reports drift toward lists; the rule holds.
- **Citation obligations** (`§14`). More pages, more claims, same standard.
- **No new colours, no new gradients, no new decoration.**

---

## 7. Checklist — Intelligence additions

Beyond `report-style-guide.md §12`:

### Automated
- [ ] 3 depth indicator lines on cover (25px · 17px · 9px)
- [ ] Badge reads `INTELLIGENCE`
- [ ] Capability row present (three descriptors, red dot separators)
- [ ] 32px `caspr-red` rule present on cover
- [ ] Nested table of contents present (sections + sub-sections)
- [ ] Divergence payloads missing `resolution` are dropped, not rendered

### Manual
- [ ] **The analysis tree is genuinely deeper than a Study** — each major node analysed, not just profiled *(§3.0)*
- [ ] Contents page does not read as the Study contents with longer sections beneath
- [ ] **Disagreement between sources or models is reported, not averaged**
- [ ] Load-bearing findings carry calibrated confidence — a range with a stated reason, not a hedge
- [ ] What could not be established is stated explicitly
- [ ] Scenarios and sensitivities presented as exhibits, not buried in prose
- [ ] Executive Summary still 2–3 pages — has not scaled with the report
- [ ] Section opening pages retained throughout
- [ ] Running headers carry the abbreviated finding and orient a mid-document reader
- [ ] **The report visibly demonstrates multi-model rigour** — a reader can see what the extra $220 bought
- [ ] No new visual vocabulary introduced beyond the master

---

## 8. Open

1. ~~Divergence block sign-off~~ — **approved 2026-08-19 (Joy).** Optional like The Signal; emitted as structured data by the assessment stage (§4).
2. Whether the capability row descriptors (`§4.2`) should name the analytical models engaged, or stay topic-level as today. Currently topic-level; naming models would make rigour visible on the cover but risks over-claiming.
3. **Marketing consequence — worth a decision, not a build item.** §3.0 (the deeper analysis tree) is the clearest, most checkable defence of the $300 price anywhere in the product. It is a candidate for `/analyses/intelligence` and for the pricing page. Flagged for the website realignment, not owned here.

---

*Owner: Joy · Engineering: Jayant · Layer 1 of `00-resolution-map.md`*
*Master design system: `docs/report-guidance/report-style-guide.md`*
