# Component Library — visual elements below the tier level

*Layer 1 · Pass 2 (render) · resolves on `deliverable_type` (and `primary_data` where present)*
*Reads alongside `report-style-guide.md` (the master system)*
*Version 1.0 · 2026-08-19*

---

## Why this exists

**The gap this closes (Joy, 2026-08-19):** visual guidance previously resolved on `(format, tier)` alone — so a Pitch Deck, an IC Memo, a Board Paper, and a Market Sector Study all rendered identically. A primary-research output had no visual treatment at all.

**The model that fixes it:**

> **Tier governs the page system. Type governs the component set and density.**

| Layer | Owns | Where specified |
|---|---|---|
| **Tier** | margins, type scale, cover treatment, depth marks, page architecture, length | `report-style-guide.md` + `brief-design-v2.md` / `tier-intelligence.md` |
| **Format** | how those render in PDF vs PPTX vs data files | `format-pptx.md` / `format-data-outputs.md` |
| **Type** | **which components appear, and how densely** | **this file** |

> **Components, not sequence.** This file defines what is available and how each is built. It does **not** define which components a given report uses or in what order. **Caspr decides.** A component library is a vocabulary, not a template.

---

## The existing components — inherited, not redefined

These live in the master and are unchanged. Listed so the type matrix can reference them:

| Component | Spec |
|---|---|
| Cover · section opener · running header/footer | `§4`, `§5` |
| Callout stat | `§8` — one per top-level section maximum |
| Data table | `§9` |
| Chart | `§13` |
| Source tag · superscript · References | `§14` |
| **The Signal** — crowd sentiment | `§9a` |
| Last page | `§15` |
| Key Takeaways block · infographic page · closing red rule | `brief-design-v2.md` §8, §2, §9 (Brief only) |

---

## New components

### C1 · Primary Data Exhibit — **the integrity-critical one**

For any finding resting on primary data — synthetic panel or fielded survey (`document-taxonomy.md` Facet 3a).

**This is not a prose aside. It is an exhibit with mandatory provenance.** A standard `§9` table or `§13` chart, preceded by a **method header** and followed by the standard source line.

**The method header — every field mandatory, no exceptions:**

| Field | Treatment |
|---|---|
| **Method label** | A pill, ALL CAPS, Inter Semi Bold 8pt, 2px radius. **`FIELDED PANEL`** — white fill, `caspr-black` text. **`AI-SIMULATED PANEL`** — `caspr-grey-light` fill, `caspr-grey-mid` text, **plus the literal words "AI-simulated"** |
| **Base** | `n = 412 · UK adults 25–54 · fielded Mar 2026` — Inter Regular 8pt, `caspr-grey-mid` |
| **Question wording** | The question **verbatim**, in quotation marks, Inter Regular Italic 8.5pt. Never paraphrased — a rephrased question is a different question |
| **Method note** | One line on how the data was produced. For synthetic: **required** — see the rule below |

> **RULE — synthetic data is never presented as collected data.**
> Where the method is synthetic, the block carries this, unabbreviated and unsoftened:
> *"Responses are model-simulated from audience profiles, not collected from people."*
>
> This is a **brand-integrity rule, not a legal disclaimer.** `.agents/brand-guidelines.md` and `security-posture.md` commit Caspr to *"cited, credible, not web-scraped"*, and `app-shell-framework.md §1a` is explicit that **Caspr does not do fieldwork.** Simulated panel data presented as real primary research would break that claim at the exact moment it is being relied on. Both the label and the sentence are required — one without the other is insufficient.

**Container:** white surface, 1px `caspr-rule` border on all sides, 10px radius, full content-column width. Distinct from `§9a` The Signal (cool tint, no border) and from C2 Divergence (warm tint, red left rule) — three containers, one family, never confusable.

**Chart types for survey data:** `§13` already covers what is needed — **horizontal stacked bar** for Likert distributions, **horizontal bar** for top-2-box and ranked responses. `§13`'s ban on **pie and donut charts holds absolutely**, including here. Survey reporting convention reaches for them constantly; Caspr does not.

---

### C2 · Divergence Block — **approved 2026-08-19**

Where models or sources materially disagree. **Full spec: `tier-intelligence.md §4`** — not duplicated here.

Summary for the matrix: warm `caspr-grey-light` surface · 3px `caspr-red` left rule, square corners · label `WHERE THE EVIDENCE DIVERGES` · named positions · **resolution line** explaining why they differ.

**Optional, exactly like `§9a` The Signal** — at most one per section, only where the divergence is material. Overuse reads as indecision. **Emitted by the assessment stage as structured data, not inline prose**; a payload without `resolution` is dropped rather than rendered.

**The two blocks are one family and one mechanism.** The Signal marks *crowd sentiment*; Divergence marks *evidence that disagrees*. Both: the analysis identifies the evidence class → the renderer owns the treatment. Any future evidence-class block extends this union rather than inventing a new path.

---

### C3 · Scenario / Sensitivity Exhibit

Where a conclusion turns on assumptions that could move.

- **Preferred form: a `§9` table** — scenarios as columns, drivers as rows. Precise values beat a shape here, and `§13`'s rule applies: use a chart only when the *pattern* is the finding.
- Where a chart is right, a **horizontal bar** ranked by impact magnitude reads cleanly. No tornado-chart styling that requires a diverging axis — `§13`'s zero-baseline rule stands.
- **The base case is the highlighted series** (`caspr-red`); all other scenarios in `caspr-grey-mid`. One highlight only.
- **A scenario exhibit without stated assumptions is not an exhibit.** Each scenario names what it assumes, in the table or immediately beneath it.

---

### C4 · Option Comparison Exhibit

For `strategic_options` and `market_entry` — several routes judged on shared criteria.

- A `§9` table: options as rows, criteria as columns. Criteria are named before the table, not implied by it.
- **No scoring theatre.** No stars, no traffic lights, no weighted composite score. Reduction to a single number hides the judgment that *is* the analysis. State the trade-off in words.
- The recommended option carries the `§9` key-figure treatment — `caspr-red` at bold weight, or a 2px red left-border rule on the row. **Never both**, and only one option marked.

---

### C5 · Risk Register

For `due_diligence`, `legal_dd`, and `internal_approval`.

- A `§9` table: risk · what it would mean · what would resolve it. **The third column is what makes it a register rather than a worry list.**
- **No probability×impact scoring or heat-map colouring.** Manufactured precision on unquantifiable risk is exactly the false confidence `tier-intelligence.md` exists to prevent.
- Where a risk cannot be assessed from available evidence, it stays in the register marked as unresolved — **never dropped.** A short register is not a clean one.

---

### C6 · Position Pair — bull / bear

For `investment_thesis` (Company · Thesis).

- Two-column block, equal width, separated by a 1px `caspr-rule` vertical. **Equal visual weight is the point** — an asymmetric layout signals the conclusion before the reader has read it.
- Labels `THE CASE FOR` / `THE CASE AGAINST` — Inter Semi Bold 8pt ALL CAPS, letter-spacing 6%, `caspr-grey-mid`.
- **Both columns cite.** A bear case built on assertion where the bull case is sourced is not a bear case.

---

### C9 · Discourse Analysis — the Signal at section scale

**Added 2026-08-19 (Joy).** `§9a` The Signal is a **callout**: one synthesised claim, aggregate attribution, at most one per section. That is the right form when sentiment is an *input* to an argument built on cited evidence.

It is the wrong form when **public opinion is itself what is being studied.** C9 is the same evidence class at section scale.

**The escalation trigger — testable, not a judgment call:**

> **Is public opinion an *input* to the argument, or an *object* of it?**
> **Input → `§9a` callout.** **Object → C9 section.**

Determinable from the research question. *"What does the literature say about vaccine uptake, and what is the public mood?"* → callout. *"How has public discourse on vaccine uptake shifted since 2020?"* → the discourse **is** the subject; a callout cannot carry it.

**What C9 must carry that a callout does not.** A section-scale treatment invites the question a callout does not: *what is your sampling frame?* Forum and platform data is **not** a population sample, and presenting it at section length without saying so reads as methodological naivety — worse than omitting it.

| Element | Requirement |
|---|---|
| **Corpus** | platforms, volume, and what was included and excluded |
| **Timeframe** | the window, and why that window |
| **Classification method** | how sentiment was determined — stated plainly, not implied |
| **Limitations** | **mandatory and prominent.** Self-selection, platform demographics, bot and brigading risk, and an explicit statement that this is **not representative of any population** |
| Breakdown | distribution (poll-style), movement over time, and by cohort or platform where the data supports it |
| Source treatment | `§14` Layer 1 on every exhibit, as any other data |

> **RULE — the limitations statement is not optional and is never relegated to a footnote.** A discourse section that reports sentiment percentages without stating its sampling frame has manufactured the appearance of survey data. That is the same failure C1's synthetic-panel rule exists to prevent, in a different costume.

**Visual treatment.** A section, not a block: standard `§5.2` section opener and body architecture, so it reads as analysis rather than an aside. The **cool `#F2F2F4` tint appears only on the corpus/method header**, tying it visually to `§9a` — one family, two scales. Charts follow `§13`: **horizontal stacked bar** for distributions, **line** for movement over time; **no pie or donut**, here as everywhere.

**Where it applies:** Academic Research (most likely) · Market Research, where consumer sentiment is genuinely a subject rather than colour · Investment & Deal, where sentiment on a target warrants more than a callout. Not Business Case — a discourse section in an advocacy document is almost always padding.

**Earn the escalation — on methodological grounds only.** A C9 section where a callout would do is padding, and in academic work padding is penalised. That is the *whole* reason to keep it rare.

**Not a cost decision.** An earlier draft of this file argued C9 should also be rare because it is expensive to produce at academic pricing. That was wrong and is retracted (Joy, 2026-08-19): **scope is a property of the tier, never of the price** (`00-resolution-map.md` § Scope is a property of the tier). Where the research question calls for a discourse section, a $40 Academic Study gets the same one an $80 Study would. Compute cost at a discounted price point is a pricing question, never a generation question.

---

### C7 · Legal Disclaimer Block · C8 · Quoted Clause

For `legal_document`. **Both PENDING — do not implement.** Blocked on legal sign-off and Lawyers ICP research (`type-legal-document.md`, postponed 2026-08-19). Specified as placeholders only so nothing is improvised in the meantime.

---

## Type → component matrix

Which components each type may draw on, and the density register. **Availability, not instruction** — Caspr selects.

| Type | Signature components | Density | Notes |
|---|---|---|---|
| **Market Research** | tables · charts · callout stats · The Signal | moderate — white space is a feature (`§1`) | the master's default balance |
| **Business Case** · `pitch` `sales` | callout stats · charts · **one dominant number per argument** | **low — the sparsest of any type** | persuasion by clarity; a dense pitch slide reads as unconfident |
| **Business Case** · `internal_approval` `strategic_options` | **C4 Option Comparison** · **C3 Scenario** ($300) · **C5 Risk Register** · tables | moderate–high | the alternatives table is the credibility anchor |
| **Investment & Deal** · Screen | tables · callout stats | moderate | fast triage — no exhibit should slow a pass/proceed call |
| **Investment & Deal** · Thesis | **C6 Position Pair** · C3 Scenario · comparables tables | **high — the densest type** | investors read exhibits first, prose second |
| **Investment & Deal** · Diligence | **C5 Risk Register** · **C2 Divergence** · C3 Scenario · C6 · comparables | **highest** | `tier-intelligence.md` also applies |
| **Academic Research** | citation-dense prose · evidence tables · **References as backbone** | moderate; **citation density far above every other type** | never thin superscripts for aesthetics (`type-academic-research.md`) |
| **Legal Document** | C7 · C8 | — | **postponed** |
| **Any type + primary data** | **C1 Primary Data Exhibit** | — | rides whichever base it enriches; the C1 rules apply regardless of host type |

---

## The evidence-class family — Signal · Divergence · Primary Data

Three blocks share one job: **marking evidence that is a different *class* from the cited findings around it.** They must read as one family — and never be confusable with each other.

**Canonical specs live in one place each. This section is the family contract, not a copy:**

| | Block | Marks | Canonical spec |
|---|---|---|---|
| — | **The Signal** | crowd sentiment — what the market *thinks* | `report-style-guide.md §9a` |
| **C9** | **Discourse Analysis** | the same evidence class **at section scale**, when sentiment is the *object* of study | this file, C9 |
| C2 | **Divergence** | evidence that *disagrees* | `tier-intelligence.md §4` |
| C1 | **Primary Data** | data *we gathered* (or simulated) | this file, C1 |

**Signal and C9 are one evidence class at two scales** — callout vs section. The escalation trigger is in C9 and is testable from the research question, not a render-time judgment.

### Visual differentiation — the three must never be confused

| | Surface | Edge | Label | Typeface signal |
|---|---|---|---|---|
| **Signal** | cool `#F2F2F4` | none | `THE SIGNAL` + waveform icon | sans (Inter) — marks it as *not* the cited analyst voice |
| **Divergence** | warm `#F2F1EF` | **3px `caspr-red` left rule**, square corners | `WHERE THE EVIDENCE DIVERGES` | sans, resolution line in Medium |
| **Primary Data** | **white** | **1px `caspr-rule` full border** | method pill (`FIELDED` / `AI-SIMULATED PANEL`) | exhibit, not prose |

Warm vs cool tint, edge treatment, and container weight are the three discriminators. **Never introduce a fourth tint or a new accent colour for a new evidence class** — extend this vocabulary.

### One mechanism, always

All three are **emitted by the assessment stage as structured data, not inline prose**; the renderer owns the treatment (`architecture-alignment-final.md`). A new evidence class extends the same typed union — it never arrives as prose the renderer has to detect.

### Applicability by type — not every block suits every type

| Type | Signal (callout) | **C9 Discourse (section)** | Divergence | Primary Data |
|---|---|---|---|---|
| **Market Research** | ✓ — market sentiment often leads the data | ✓ where consumer sentiment is a genuine subject | ✓ at Intelligence | ✓ with add-on |
| **Business Case** | **rare** — never as proof of your own traction; category sentiment only | ✗ — a discourse section in an advocacy document is padding | rare — advocacy that surfaces disagreement usually should resolve it in prose | ✓ with add-on |
| **Investment & Deal** | ✓ — sentiment on a target moves before filings do | ✓ where sentiment warrants more than a callout | ✓✓ **core at Diligence** | ✓ with add-on |
| **Academic Research** | ✓ *(un-banned 2026-08-19)* | ✓✓ **the most likely home** | ✓✓ **near-essential** | ✓ with add-on |
| **Legal Document** | ✗ | ✗ | — | — |

**Three rulings worth stating plainly:**

- **The Signal is permitted in Academic Research** *(corrected 2026-08-19 — an earlier blanket ban was wrong).* The real distinction is not the field but the **role sentiment plays**: as *evidence for a factual claim* (*"the market thinks X, therefore X"*) it is illegitimate in scholarly work; as an *object of study* (*"discourse on X exhibits these patterns"*) it is legitimate data, and in several fields it is the entire research question. Banning both conflated them.
- **Where sentiment is the object, escalate to C9** — with corpus, method, and a mandatory non-representativeness statement. A callout cannot carry a subject.
- **⚠ The Divergence *block* defaults to Intelligence. The *expectation* it renders does not** — `report-style-guide.md` §9b requires that materially disagreeing sources reach the reader at **every** tier. A Brief expresses that without this component.
- **Divergence is near-essential in Academic Research**, and it is the one type where the **block** may appear at *any* tier rather than Intelligence only. Contested findings are not an edge case there — mapping where the literature disagrees **is the deliverable.**

### Format degradation

These blocks are specified for PDF. Their treatment elsewhere:

| Format | Treatment |
|---|---|
| **PPTX** | `format-pptx.md` §12 — the block becomes a slide or a body-zone element; never a shrunken PDF block |
| **MD · DOCX** | `format-data-outputs.md` §5a — structure and labels survive; tint does not |
| **XLSX · CSV** | not carried as blocks. Divergence positions may become rows in a comparison table; Signal and Primary Data method metadata belong in the `Notes` sheet |

**The label and its meaning must survive every format.** A Signal that renders as ordinary prose in a DOCX has silently promoted crowd sentiment to a cited finding — the one failure this family exists to prevent.

---

## Density vs resolution — do not confuse them

Density (this file) and resolution (`00-resolution-map.md` § Tier semantics) are different levers, and treating them as one produces the worst possible output.

- **Resolution is set by tier** — how far down the analysis tree the work goes. Intelligence analyses each of the ten players; a Study profiles them.
- **Density is set by type** — how much sits on a page or slide.

**An Intelligence report is deeper, not more crowded.** The extra depth arrives as *more nodes analysed*, each still laid out to the master's white-space discipline (`§1`: *"white space is a feature. Density is friction."*). Compressing a deeper tree onto the same page count is the failure mode — it produces a dense, unreadable report that is also no more insightful.

Equally: a `pitch` stays sparse whatever its tier. Type governs density; tier governs how many nodes there are to be sparse about.

---

## What does not change by type

Type selects components; it never overrides the system:

- **The palette, type scale, margins, and grid.** No type gets its own colours.
- **One callout stat per top-level section maximum** (`§8`).
- **Findings-as-headers** (`§6`) — every type, every format.
- **Citation obligations** (`§14`) — a component that displays a figure carries its source. No exceptions for any component in this file.
- **No gradients** outside the cover photography overlay; no drop shadows; no 3D.
- **Bullet discipline** (`§11`) — components are not a way to smuggle in fragmentation.

---

## Checklist — components

- [ ] **C1: every primary-data exhibit carries method label, base, verbatim question, and method note** *(RULE)*
- [ ] **C1: synthetic data carries the `AI-SIMULATED PANEL` label AND the "not collected from people" sentence** *(RULE — both, not either)*
- [ ] No pie or donut chart anywhere, including survey data
- [ ] C2 Divergence blocks carry a resolution line
- [ ] C3 Scenario exhibits state their assumptions
- [ ] C4 Option comparisons carry no composite score or traffic lights; criteria named before the table
- [ ] C5 Risk registers include the "what would resolve it" column; unresolvable risks retained, not dropped
- [ ] C6 Position pairs are visually equal and both sides cited
- [ ] Component density matches the type register (a sparse pitch, a dense diligence)
- [ ] No component introduces a colour, gradient, or effect outside the master
- [ ] **No component sequence was imposed by this file**

---

*Owner: Joy · Engineering: Jayant · Layer 1 of `00-resolution-map.md`*
*Master design system: `docs/report-guidance/report-style-guide.md`*
