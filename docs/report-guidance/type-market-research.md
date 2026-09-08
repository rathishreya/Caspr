# Type Guidance — Market Research

*Layer 2 · Pass 1 (analysis) · `deliverable_type = market_research`*
*Style identity: `analytical` · Reads with `00-resolution-map.md`*
*Version 1.0 · 2026-08-19*

> **Outcome, not method.** This file states what must be answered, in what register, and where the ceiling is. It does **not** prescribe a table of contents, a section order, which analyses to run, or which sources to use. Caspr decides all of that.

---

## What this type is

Desk research over curated public sources — Caspr's core deliverable and the widest type by volume. It answers *what is true about a market, a company, a category, a geography, or a rule set*, cited to source.

**The boundary that defines it:** Market Research reports **the state of the world**. It does not argue a position for a specific party (→ Business Case) or reach a buy/back verdict on a target (→ Investment & Deal). Where a Market Research ceiling is reached, the handoff is named in the block below.

**Primary ICPs:** Consulting · Strategy · Agencies · Market Research professionals · Category managers · Grad students — effectively all. This is the type most likely to resolve against the `§10.9` fallback profile, so it must read excellently with **no ICP data at all**.

---

## Sub-types, tiers, and validity

Canonical tier slugs `brief` · `study` · `intelligence`. Prices per `pricing-model.md §4`.

| Sub-type | Display | Brief $15 | Study $80 | Intelligence $300 | Entity-centric |
|---|---|---|---|---|---|
| `market_sector` | Market Sector | ✓ | ✓ | ✓ | — |
| `competitive_landscape` | Competitive Landscape | ✓ | ✓ | ✓ | — |
| `company_profile` | Company Profile | ✓ | ✓ | ✓ | Company |
| `executive_profile` | Executive Profile | ✓ | ✓ | **✗** | Person |
| `geography` | Market Conditions | ✓ | ✓ | ✓ | — |
| `category` | Category | ✓ | ✓ | ✓ | — |
| `regulatory` | Regulatory Overview | ✓ | ✓ | ✓ | — |
| `market_entry` | Market Entry | ✓ | ✓ | ✓ | — |
| `market_sizing` | TAM | **✗** | ✓ | ✓ | — |
| `trends` | Trend Analysis | ✓ | ✓ | ✓ | — |

---

## How tiers extend — stated once

The questions below are the sub-type's **core**. Tiers are cumulative:

Tiers extend on **two axes** — canonical statement in `00-resolution-map.md` § Tier semantics.

| Tier | Resolution — how far down the tree | Validation — how hard it is tested |
|---|---|---|
| **Brief** $15 | the **aggregate** — *"ten players hold 80% of the market"* | single pass · answers ***what*** |
| **Study** $80 | **enumerate and profile** — all ten named, ~half a page each | reasoned · adds ***so what / now what***, **deliberately crossing the Brief's ceiling** |
| **Intelligence** $300 | **full analysis per node, and often the level below** — each of the ten analysed in depth | multi-model challenge, cross-source triangulation, explicit treatment of what remains contested · adds ***validation*** |

**The nodes are whatever the sub-type branches on** — for `competitive_landscape` the players; for `market_sector` the sub-segments; for `geography` the local players and regulatory regimes; for `category` the sub-segments and channels. A Brief is not a shorter Study — **it answers at a coarser grain.**

**Every ceiling below is a Brief-tier ceiling unless marked otherwise, and every ceiling is exactly what the next tier up delivers.** This is the mechanism that keeps the three price points honestly differentiated — a Brief that answers "so what" has destroyed the Study's reason to exist.

---

## The questions, by sub-type

### `market_sector` — Market Sector
**Answers:** market size and growth rate, anchored to a named source · the key sub-segments (what the market actually consists of, not just a headline number) · the leading players in terms of what they do and how they compete · a snapshot of significant activity in the last ~12 months · the structural trends defining direction.
**Where relevant:** market concentration (fragmented vs dominated) · geographic breakdown · regulatory or macro forces shaping the market now · a named example that makes the abstract concrete.
**Ceiling:** does not analyse what the trends mean for a *specific* business, evaluate entry strategy, recommend which segment to target, or model share-shift. → **Study**, or `market_entry`.

### `competitive_landscape` — Competitive Landscape
**Answers:** who the main competitors are and what they actually offer · how the market is structured (winner-takes-all vs genuinely fragmented) · the real differentiators — observable differences in product, price, go-to-market, or customer base, **not** marketing claims · the most significant recent competitive moves · where the gaps and underserved positions are.
**Where relevant:** approximate revenue or scale indicators · segments particularly well or poorly served · pricing and business-model differences that define the dynamic.
**Ceiling:** does not recommend a competitive strategy, evaluate how a specific company should position, identify which competitor is most vulnerable, or model share-shift. → **Study**.

### `company_profile` — Company Profile
**Answers:** what the company does and how it makes money, in plain language — never its own marketing copy · ownership structure and scale (headcount, geographies, public / private / PE-backed) · revenue model and financial trajectory where available · who leads it and their relevant background · how it sits against its two or three nearest competitors, specifically · the most important recent developments.
**Where relevant:** named customers in the public record · stated strategic priorities or M&A ambitions · red flags or reputational signals.
**Ceiling:** does not evaluate whether to acquire, partner with, or compete against, model financial upside, or assess fit against a thesis. → **Study**, or **Investment & Deal**.

### `executive_profile` — Executive Profile *(Brief · Study only)*
**Answers:** current role and tenure · the career history that explains how they got here — the roles that matter for context, not an exhaustive CV · education, briefly · what they are known to focus on, drawn from public statements, interviews, or press · relevant public record (press, speaking, published writing, board seats).
**Where relevant:** professional positions relevant to the meeting's topic · prior relationships with people the reader knows · reputation signals (data-driven, aggressive on M&A, operationally focused).
**Ceiling:** does not assess how to negotiate with this person, what offer structure would land, or how to manage the relationship. That is the reader's judgment; this supplies the factual foundation.
**No Intelligence tier** — the public record on an individual does not support multi-model validation, and attempting it would manufacture false confidence about a named person.

### `geography` — Market Conditions
**Answers:** the macro baseline — GDP, population, growth trajectory, and a one-sentence characterisation of the economic context · the state of the sector of interest in this market (size, maturity, what drives it) · key local players and their approximate position · the regulatory environment **as it affects the business type in the prompt** — licensing, ownership rules, data requirements · the foreign investment climate and practical entry conditions · the most important country-specific risks.
**Where relevant:** recent notable foreign entrants and how they entered · government-stated industrial policy · infrastructure or payments context where it bears on the business model.
**Ceiling:** does not recommend whether to enter, which route, or how to sequence; does not size the realistic addressable opportunity for a specific business. → **Study**, or `market_entry`.

### `category` — Category
**Answers:** category size and growth — value and volume where available, from a named source · the key sub-segments and which are growing faster or slower than category average · leading brands, their positioning, and approximate share · the demand-side trends driving the category, with evidence **specific to this category**, not generic consumer trends · recent product or format innovation and what it signals · the channel picture and where share is shifting.
**Where relevant:** private-label penetration and trajectory · price architecture dynamics (premiumisation, trading down) · supplier or retailer moves reshaping category structure.
**Ceiling:** does not recommend a ranging strategy, evaluate SKUs for listing or delisting, advise on supplier negotiations, or model P&L impact. → **Study**.

### `regulatory` — Regulatory Overview
**Answers:** the primary regulations in force — named, with jurisdiction and responsible regulator · what compliance requires in practice, not a legal summary · recent enforcement activity, as a signal of how aggressive regulators actually are · upcoming changes with expected timelines · the practical checklist for a new entrant: what must be in place before the first customer can pay.
**Where relevant:** jurisdictional differences that matter across geographies · widely used safe harbours · recent rulings or guidance that shifted interpretation.
**Ceiling:** does not provide legal advice, assess a specific business's compliance posture, recommend a compliance strategy, or model compliance cost. → **Study**, and in many cases **a lawyer** (→ **Legal Document**, which is itself a draft for a lawyer to review).

### `market_entry` — Market Entry
**Answers:** the size and growth of the addressable opportunity in the target market, with a realistic sense of what is **serviceable** — not just TAM · an honest read on competitive density and how entrenched incumbents are · the viable entry routes with a one-line assessment of each — enough to know which merit investigation · regulatory and compliance requirements before trading · the 3–4 factors that determined success or failure for prior entrants · the headline risks.
**Where relevant:** recent comparable entrants and how they fared · cultural or relationship dynamics affecting how foreign players are received · timing considerations (regulatory windows, inflection points, incumbent weakness).
**Ceiling:** does not recommend whether to enter or which route, model financial return, size the required investment, or assess fit against a specific company's capabilities. → **Business Case** (`strategic_options`), or **Study**.

### `market_sizing` — TAM *(Study · Intelligence only)*
**Answers:** the TAM and **how it is defined** — the definition is as load-bearing as the number · SAM and SOM with their assumptions stated · the methodology, and the source anchoring each input · growth trajectory and what drives it · sensitivities — how the number moves when the key assumptions move.
**No Brief tier.** Credible sizing requires stated methodology and sensitivities; a 3–5 page note cannot carry them, and a market size without its method is exactly the uncited number this ICP is trying to escape.
**Ceiling (Study):** does not forecast a specific company's revenue, state a capture rate as fact, or validate against primary data (that is a Primary-data add-on).
**Intelligence adds:** top-down and bottom-up reconciled against each other, scenario ranges, and source-by-source validation of the inputs.

### `trends` — Trend Analysis
**Answers:** the trends genuinely defining this space now · the evidence for each — **and an honest separation of real movement from hype** · what is driving each trend and how durable it looks · who is moving on it and who is exposed · the signals that would confirm or break the trend.
**Where relevant:** adjacent-market trends that will arrive here · counter-trends and where the consensus may be wrong.
**Ceiling:** does not recommend a response or model the impact on a specific business. → **Study**.

---

## Register and content treatment

L0 (`report-style-guide.md §11`) governs the voice absolutely. This section refines **within** it.

**The default posture is analytical neutrality.** Market Research describes what is true and lets the reader decide. It is the one type where Caspr is not advocating anything — a discipline worth protecting, because it is what makes the Study's recommendation credible when it does come.

- **Findings-as-headers is a RULE** (`§6`). *"Market Overview"* is a failure; *"India imports 75% of its pharmaceutical sodium from a single source country"* is the standard.
- **Sourcing is the product.** Every number carries its source; a market size without a named source is worse than no market size (`icp-personas.md`, every ICP, unprompted).
- **Where sources genuinely disagree, say so and show the range.** Reconciling conflicting estimates is analysis; silently picking one is not. This is a differentiator, not a weakness — the ICPs currently spend hours doing exactly this by hand.
- **Currency of data is a claim.** Where a figure is materially dated, its date is part of the finding.
- **The Brief's upsell line is content, not marketing** (`brief-design-v2.md §9`): one honest sentence on what deeper analysis would cover. It must describe real additional analysis, never overstate.

**Tier-specific register:**
- **Brief** — a briefing note. Tight, no padding, no scene-setting. The reader is walking into a room in ten minutes.
- **Study** — the recommendation appears and must be *earned*: stated plainly, with the reasoning visible and the conditions under which it fails.
- **Intelligence** — confidence is calibrated explicitly. Where models or sources disagree, the disagreement is reported, not averaged away. **Manufactured consensus is the failure mode of this tier.**

---

## ICP emphasis

L3 (`§10.1–10.9`) carries vocabulary and framing. These are **emphasis** notes only — they never change which questions get answered.

| ICP | Lean into |
|---|---|
| Consulting (§10.1) | the "so what" for the client decision; findings that read directly onto a slide |
| Strategy (§10.2) | implications for the organisation; narrowing options rather than recommending |
| Investors (§10.3) | deal activity, valuation benchmarks, and what the finding does to a return |
| Category managers (§10.4) | `category` sub-type especially — shelf, velocity, ranging consequence |
| Agencies (§10.5) | the tension or human truth beneath the market data |
| Grad researchers (§10.6) | the state of the evidence base; **calibrated uncertainty is permitted here and only here** (L0 §11 carve-out) |
| Corporate Development (§10.7) | the **strategic-acquirer** lens — what a market or player means for *the business already owning it*; synergy and capability, never IRR |
| Startups (§10.8) | `market_sizing` especially — conservative, benchmarked, every number defensible under challenge |
| Market Research pros (§10.10) | the **pre-fieldwork context layer** — methodology transparency, sub-category granularity syndicated sources miss. **Never write as though it replaces their expertise** |
| **Unknown (§10.9)** | **plain professional English, no borrowed jargon, the clearest number leading.** The default and the most-used. |

*(§10.10 Market Research Professionals added 2026-08-19 — previously missing, so this ICP fell through to §10.9. Drift closed.)*

---

## Visual

**Page system (L1a).** No deviations. `report-style-guide.md` governs; `brief-design-v2.md` overlays at Brief; `tier-intelligence.md` at Intelligence. **This type is the master's reference implementation** — where another type's visual section says "as Market Research", it means the unmodified master.

**Density: moderate.** The master's own balance — *"white space is a feature. Density is friction"* (`§1`). Deeper tiers add **more nodes analysed**, not more per page.

**Cover imagery.** `§4.3` sector logic applies directly and this type exercises it hardest, since the subject *is* a sector or category. Sector-relevant, industrial or infrastructural in scale, no people as primary subject, dark-treated. For `category`, the subject is the category's production or retail world — a food line, a distribution centre — not a shopper.

**Component set (L1b).**

| Component | Use in this type |
|---|---|
| Tables (`§9`) · charts (`§13`) | the workhorses — market size, share, segment splits |
| Callout stat (`§8`) | one per top-level section max; usually the market size or growth rate |
| **The Signal** (`§9a`) | ✓ — sentiment often moves before the data confirms it, which is exactly this type's blind spot. At most one per section |
| **C2 Divergence** | ✓ at Intelligence — and `market_sizing` is where it earns most, since conflicting estimates are the norm. **⚠ The *block* is an Intelligence rendering; the *expectation* that disagreement reaches the reader holds at every tier** — `report-style-guide.md` §9b |
| **C1 Primary Data** | ✓ where an add-on rides the analysis |
| C3 Scenario | at Study+ for `market_entry`, `market_sizing` |

**Sub-type visual notes:**
- **`market_sizing`** — the methodology must be *visible*, not buried: the TAM/SAM/SOM build belongs in a table where each layer's assumption is a row. This is the sub-type most likely to carry a Divergence block.
- **`competitive_landscape`** — a scatter plot (`§13`, permitted) for positioning where two axes genuinely explain the market. Never a 2×2 with unlabelled axes.
- **`executive_profile`** — the one sub-type where `§4.3`'s "no people as primary subject" rule creates tension. It holds: **do not put a photograph of the individual on the cover.** Use their organisation's or sector's world.
- **`trends`** — line charts over time; the highlighted series is the trend being argued, all others `caspr-grey-mid`.

**Primary data on this type** renders as **C1** — method label, base, verbatim question. If synthetic, it carries the `AI-SIMULATED PANEL` pill **and** the "not collected from people" line. Both, in every format (`components.md` § evidence-class family). That is a RULE, not styling.

---

## Checklist additions

Beyond `report-style-guide.md §12`:

- [ ] Every question in the sub-type's block is answered, or its absence is explained by the evidence not existing
- [ ] The tier ceiling is respected — a Brief does not answer "so what"; a Study does
- [ ] Every market size, growth rate, and share figure carries a named source
- [ ] Where sources conflict, the range is shown rather than a silent pick
- [ ] Sub-type detected matches what the report actually delivers
- [ ] **No prescribed structure was imported from this file** — section order is Caspr's own
- [ ] Brief only: upsell line describes genuine additional analysis
- [ ] **Every tier:** a figure presented as the answer carries what it measures; where credible sources materially disagree, the reader learns that; definitional differences are named as definitional (`report-style-guide.md` §9b)
- [ ] Intelligence: the disagreement is additionally **adjudicated** — what each says, why they differ, which is load-bearing

---

*Owner: Joy · Engineering: Jayant · Layer 2 of `00-resolution-map.md`*
