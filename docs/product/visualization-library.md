# Caspr · Visualization Library

*The catalogue of every visual Caspr can render, the data each needs, and which cost lane it sits in. Locked concept 2026-08-03 (Joy). Companion to the Edit-mode design (`design-guidelines.md` §Edit) and the economics below.*

The strategic point: **the bigger this library, the lower our cost.** Every visual we can render deterministically (from data, via a code template) costs ~$0 and can be iterated infinitely. Every visual that needs a model to make pixels costs real money. Growing Lane A shrinks Lane B.

---

## 1. The two cost lanes

| Lane | What it is | How it's produced | Marginal cost | Iteration |
|---|---|---|---|---|
| **A — Deterministic** | Charts + templated data-infographics | Structured data → code template (charting/layout engine) | **~$0** (compute only) | **Unlimited, free** |
| **B — Generative** | Photographic/illustrative images; truly bespoke one-off graphics | A model generates pixels | **$0.2–0.5** image · **$0.1–0.2** bespoke graphic | Metered (quota + pack) |

**Design rule:** Caspr always proposes from Lane A first. A generated image is a deliberate, opt-in choice — never the default. Most of a report's 20–25 visuals should be Lane A.

**Restyle is always free.** Recolour, relabel, resize, crop, reposition, change chart type on the *same data* = deterministic post-processing on a cached asset. Regeneration (Lane B cost) fires only on a **material content change** — new subject, new prompt, new data that needs a fresh composition.

---

## 2. Lane A — the deterministic catalogue

Organised by the six user-facing **intents** (the steering pills). Many more chart families live underneath each than the user ever has to name — Caspr proposes the right one from the data shape.

### 2.1 Compare — magnitudes across categories
| Visual | Data it needs |
|---|---|
| Bar / column | 1 categorical dim + 1 measure |
| Grouped bar | 1 cat dim + 1 sub-dim + measure |
| Stacked bar | cat dim + parts + measure |
| 100% stacked bar | cat dim + parts (share) |
| Bullet chart (actual vs target) | measure + target + bands |
| Lollipop / dot plot | cat dim + measure (sparse) |
| Diverging bar (+/−) | cat dim + signed measure |
| Radar / spider | 1 entity across 3–8 measures |
| Ranked bar table | cat dim + measure, sorted |

### 2.2 Trend — change over time
| Visual | Data it needs |
|---|---|
| Line / multi-line | time dim + 1+ measures |
| Area / stacked area / streamgraph | time dim + parts |
| Small multiples (sparkline grid) | time dim + measure × many entities |
| Slope chart (two-period) | 2 time points + entities |
| Indexed line (rebased to 100) | time dim + measures, normalised |
| Candlestick / OHLC | time + open/high/low/close |
| Area-with-events (annotated) | time series + event markers |

### 2.3 Composition — part-to-whole
| Visual | Data it needs |
|---|---|
| Donut / pie (≤5 parts) | parts summing to a whole |
| 100% stacked bar | parts across categories |
| **Treemap** | hierarchical parts + measure |
| **Sunburst / icicle** | multi-level hierarchy + measure |
| **Waterfall / bridge** | start + signed deltas → end |
| **Marimekko / mekko** | two dims, both weighted |
| Funnel | ordered stages + drop-off |
| Pyramid | ranked tiers |

### 2.4 Distribution — spread & shape
| Visual | Data it needs |
|---|---|
| Histogram | one numeric variable |
| **Box plot / violin** | numeric variable × groups |
| Density / ridgeline | numeric var × groups |
| Beeswarm / strip | numeric var + entities |
| Cumulative (CDF / Pareto) | numeric var, cumulative |
| Population pyramid | two groups × ordered bins |

### 2.5 Relationship — correlation & positioning
| Visual | Data it needs |
|---|---|
| Scatter | 2 measures per entity |
| **Bubble** (3rd var = size) | 3 measures per entity |
| Connected scatter | 2 measures over time |
| **2×2 quadrant** (positioning / BCG) | 2 axes + entities |
| **Correlation heatmap** | matrix of measures |
| **Parallel coordinates** | entities × many measures |
| **Network / node-link graph** | nodes + weighted edges |

### 2.6 Geography — where things are
| Visual | Data it needs |
|---|---|
| Choropleth map | geo region + measure |
| Symbol / bubble map | coords/region + measure |
| **Flow / origin-destination map** | from→to pairs + weight |
| Hex-bin / tile-grid map | geo + measure (equal-area) |
| Geographic heatmap | point density |

### 2.7 Flow — movement, process, sequence
| Visual | Data it needs |
|---|---|
| **Sankey / alluvial** | source→target links + weights |
| **Chord diagram** | node-to-node flow matrix |
| Process / flow diagram | ordered steps + branches |
| Journey map | stages + touchpoints + sentiment |
| Gantt / roadmap | tasks + start/end dates |
| Value chain / swimlane | ordered activities by lane |

### 2.8 Structure & magnitude (surfaced via proposals, not a named pill)
| Family | Visuals | Data |
|---|---|---|
| **Hierarchy** | org tree, dendrogram, circle packing | parent-child |
| **KPI / magnitude** | big-number stat, KPI band, gauge, progress, bullet | 1–few metrics + targets |
| **Matrix / heatmap** | category×category heatmap, calendar heatmap, comparison matrix | 2 cat dims + measure |

### 2.9 Extended variants (same families, deeper coverage)

Each family above ships extended forms as the library matures — all Lane A (deterministic, free):
- **Compare:** dumbbell/barbell · Pareto · deviation bar · heat table (conditional-format) · pictograph/isotype · bar+line combo.
- **Trend:** bump chart (rank over time) · horizon chart · fan/forecast bands · seasonal-cycle plot · in-table sparklines.
- **Composition:** nested donut · circle packing · stacked-100% area.
- **Distribution:** raincloud · ECDF · Q-Q plot · hex-bin density.
- **Relationship:** adjacency matrix · arc diagram · Venn/Euler · 2D density/contour · connected-bubble.
- **Geography:** cartogram · connection/route map · dot-density map.
- **Tables & KPI:** scorecard · table with embedded bars/sparklines · delta/variance card · progress ring.

---

## 3. Business-framework infographics (Lane A — templated)

Structured consulting frameworks are *layouts populated with entities* — deterministic, therefore free. Building these as templates is the single highest-leverage way to keep visuals out of Lane B.

| Framework | What it shows | Data it needs |
|---|---|---|
| 2×2 quadrant (BCG, risk/effort, Eisenhower, positioning) | two-axis positioning | 2 axes + plotted items |
| Magic-quadrant style | leaders/challengers/niche/visionaries | 2 axes + vendors |
| Porter's Five Forces | competitive pressure | 5 forces + intensity notes |
| SWOT | internal/external factors | 4 quadrants of points |
| Value chain | activity flow → margin | primary + support activities |
| Business model canvas | 9-block model | 9 sections of points |
| Market / ecosystem map | players by segment | entities + segment + size |
| TAM / SAM / SOM funnel | market sizing | 3 nested values |
| Maturity / S-curve | adoption stage | phase + position |
| Roadmap / timeline | initiatives over time | items + dates + tracks |
| RACI | responsibility matrix | tasks × roles |
| Pyramid / iceberg | layered hierarchy | ordered tiers |
| Waterfall bridge | value build-up | start + deltas + end |
| Ansoff matrix | growth strategy | products × markets (new/existing) |
| GE–McKinsey 9-box | invest/hold/harvest | attractiveness × strength, 3×3 + units |
| Priority matrix (impact × effort / Eisenhower) | what to do first | 2 axes + items |
| Power–interest / stakeholder map | who to manage how | influence × interest + stakeholders |
| Value curve (Blue Ocean) | how you compete | competing factors × rating × players |
| Three Horizons | growth over time | 3 horizons + initiatives |
| PESTEL | macro-environment scan | 6 factor groups of points |
| McKinsey 7S | org alignment | 7 interlocking elements |
| VRIO | source of advantage | resources × 4 tests |
| Kano model | feature satisfaction | features × delight/basic/linear |
| Fishbone (Ishikawa) | cause → effect | effect + categorised causes |
| Decision tree | options & expected value | nodes + branches + payoffs |
| Flywheel | reinforcing loop | ordered self-reinforcing stages |
| Wardley map | value-chain evolution | components × visibility × evolution |

---

## 4. Complex / Tableau-class visualizations

Explicitly in scope (Joy): the analytical depth of a Tableau dashboard, rendered to Caspr's editorial standard. All Lane A (deterministic):

- **Multi-measure dashboards** — a coordinated set (KPI band + trend + breakdown + map) on one page.
- **Heatmaps** — category×category, calendar, correlation.
- **Treemap / sunburst / circle-packing** — hierarchical composition.
- **Sankey / chord / alluvial** — flow and reallocation.
- **Choropleth + flow maps** — geographic intensity and movement.
- **Box / violin / beeswarm** — statistical distribution.
- **Parallel coordinates / radar** — many-dimension comparison.
- **Network graphs** — relationships, influence, ownership webs.
- **Marimekko** — two-dimensional share (segment × share).
- **Cohort / retention grids** — time-based cohorts.

Each ships as a code template with a defined data contract, so it renders — and re-renders — for free.

---

## 5. Lane B — what genuinely costs money

Only these draw on the generation budget:

| Item | Typical cost | When |
|---|---|---|
| Cover hero **image** (photographic/illustrative) | $0.2–0.5 | opt-in, ~1 per report |
| Section mood/concept **image** | $0.2–0.5 | opt-in, rare |
| **Bespoke** composed graphic (no template fits) | $0.1–0.2 | rare, shrinks as the library grows |

As the library covers more cases, Lane B trends toward *only* photographic imagery — a small, deliberate, budgeted flourish.

---

## 6. Economics & governance

> **Metering model updated (2026-08-18): edit credits, not a revision count.** Visual generation now draws from the report's shared **edit-credit** allowance — the same currency that meters every substantial edit — not a separate "revisions" quota with a visible `↻ x/10` counter. Authority: `docs/app-handoff/EDIT-ECONOMICS.md` (locked model) and `.agents/pricing-model.md` §4.6-A (pricing summary). Below, "a generation" = one Lane-B model run = the unit of *compute analysis*; it is charged in credits, never shown as a counted quota.

### 6.1 Metering unit = the report (not the visual)

A report carries a **shared allowance of edit credits**, included in the report price and scaled to the analysis tier. A **generation** (a bespoke image or not-yet-templated infographic — a model run) draws credits from it; charts, restyles, and curated-image picks are **free and unlimited** and draw nothing.

**Surfacing — a calm balance, never a live counter (per `EDIT-ECONOMICS.md`).** No persistent `↻ x/10` in the header, title bar, or the "OR JUST ASK" row — a ticking count manufactures the meter-anxiety we're avoiding, and wrongly implies *every* edit is capped. Instead:
- **No running total after a generation.** Caspr does the edit and moves on; the balance draws down silently.
- **Interrupt only at the edge:** when a generation would exceed the remaining balance — *"This is a larger edit than your remaining budget — top up $10 to continue."*
- **A calm, chunky read** where the balance is shown at all — "plenty of edit budget" / "running low" — never a number mid-edit.
- **Action-scoped tags** may still mark that a click *costs* (the Image card's *"＋ Generate bespoke"*) without quoting a per-click price; free actions carry no marker.

| Analysis tier | Price (list / student) | Included edit credits |
|---|---|---|
| **Brief** | $15 / $8 | **15,000** |
| **Study** | $80 / $40 | **80,000** |
| **Intelligence** | $300 | **300,000** |

Deeper reports carry more visuals and more editing, so the allowance scales with them (Joy, 2026-08-18). A generation ≈ 500 credits (≈ $0.50); ≈ 1,000 credits ≈ $1. A report's edits draw its **own free allowance first**; **overflow then draws the account money balance** (the Research Budget / wallet), not a separate token pool. Buying more = the **Wallet top-up** (tier-default $20/$50/$100, $10 increments) — no separate mechanism. See `EDIT-ECONOMICS.md` + `account-wallet-screens.md` §4.

- **Charts and templated infographics are always free and never draw credits** — restyle, recolour, resize, change type, re-render on the same data costs nothing.
- **Per visual:** the user still gets a **regenerate control + saved version history** (previous options kept, never destroyed); only the *allowance* is shared across the report.
- **Cover:** generated lazily (deliver 1, generate an alternate on request).

Metering at the report level caps total exposure — the shared allowance can't be exceeded regardless of how many visuals the report has, unlike a per-visual allowance which silently authorises more.

### 6.2 Cost envelope (student Study, $40 list · 20% off · $32 realized)

Philosophy (Joy): the base report already carries decent margin; **add-ons don't need to.** *Scenarios below model a **typical visual load** (~10 generations), not a cap — under the credit model a Study's 80,000 credits buy ~160 generations, shared with text edits. The point is the compute-margin sanity check: even a heavy visual report spends a single-digit-to-mid-teens % of realized price on generation.*

| Scenario | Base (5 info + 1 cover) | ~10 generations | Total | % of $32 |
|---|---|---|---|---|
| Tail worst (all 10 on cover, capped $0.4) | $1.10 | $4.00 | $5.10 | 16% |
| Full-use realistic (8 info + 2 img) | $1.10 | $2.00 | $3.10 | ~10% |
| Average (~4 generations, mostly info) | $1.10 | $0.75 | $1.85 | ~6% |

The 16% tail is implausible (one cover, regenerated ten times) and mitigated by Jayant's per-generation cost cap on cover images. Realistic full-use ≈ 10%; average ≈ 6%.

**Margin cushions:** (1) Jayant caps cover-image generation (token-limit per gen) to the low end; (2) every infographic that becomes a deterministic template drops out of the metered lane entirely — pure margin, and it grows as the library grows; (3) lazy cover generation; (4) the API returns already-marked-up credit counts, so margin is captured per call, not modelled here.

### 6.3 Top-up — the Wallet top-up (one money balance)

> Overflow past a report's free allowance draws the **account money balance** (~1,000 credits ≈ $1). "Buy more" is just the **Wallet top-up** — tier-default **$20 / $50 / $100**, adjustable in **$10 increments** — which adds to that one balance. **No separate token pool, no per-visual pack.**

Priced for *simplicity and generosity*, not for margin — one decision, no meter anxiety. Sold as a small add-on within the Research-Budget model. (Retires the earlier "Visual Pack · $5 / 10 revisions" — a visual-only pack is now just credits, the same currency as every other edit.)

### 6.4 Rules that protect the model
1. **Template-first.** Caspr renders from Lane A whenever possible; generation is a last resort.
2. **Generate once, cache.** Restyle/resize/recolour/move = free. Regeneration only on material change.
3. **Never pre-generate options.** Image grid = curated/stock (free to browse); generation happens on explicit "Generate," drawing edit credits.
4. **Saved history.** Every regeneration is kept; the user chooses among versions rather than destroying and redoing.
5. **Cost is visible only where a model runs.** Charts and templated infographics carry no cost marker; only image/bespoke generation draws from the credit balance — and even then, no per-click price, no live counter (`EDIT-ECONOMICS.md`).

---

## 7. Dev implementation spec

The build has two subsystems that map 1:1 to the two cost lanes: a **deterministic renderer** (Lane A, ~free) and a **generation service** (Lane B, metered). A **proposal engine** sits on top of both, and the **Edit mode** UI drives the whole thing.

**Client / server split (locked 2026-08-04).** There are two render contexts, and they live in different places:
- **Live edit previews** — the proposal cards, restyles, and in-editor renders — run **product-side** (fast, deterministic, free) so editing feels instant.
- **The authoritative analysis and the final rendered output** (the actual PDF/PPTX/XLSX deliverable) run on **Jayant's backend API**, which owns the cost-optimised generation. When the user hits **Generate** on a version, the product sends the report state (structure + edits + chosen visuals + selected formats/languages/style) to that API and receives the file(s). **The product never renders the final deliverable itself** — that's where the backend's cost work is captured, and it's what the output meter (§4.6-B of `pricing-model.md`) counts. **Image / bespoke-graphic generation** (Lane B) is likewise a backend call, cost-capped per generation.

### 7.1 Template library (Lane A) — the core deliverable

Each visual type is a **template module** with a fixed interface:

```
Template = {
  id,                       // e.g. "stacked-bar", "quadrant-2x2", "market-map"
  intents: [...],           // which of the 6 intents it serves (for the proposal engine)
  dataContract,             // JSON Schema: the data shape it needs (§2–4 "data it needs")
  styleParams,              // palette, labels on/off, axis on/off, sort, annotations…
  render(data, style, tokens) -> vector   // pure, deterministic, no model call
}
```

- **Data contract** = the "data it needs" column from §2–4, formalised as a schema (dimensions · measures · time · geo · hierarchy · links). The Thinking Brain maps section data → this contract.
- **Canonical intermediate model:** normalise all inputs to a tidy/long table (`{dimension, key, value, …}`) that every template consumes — one adapter layer, N templates.
- **Renderer output = vector (SVG)** for print fidelity in the 100-page PDF, and mapped to editable shapes for PPTX. Style strictly from brand tokens (Instrument Serif titles, DM Mono figures, opaque brand palette, radius rules, editorial rhythm) — the renderer is the single source of visual truth.
- **Suggested stack:** Vega-Lite or D3 for the chart families; a custom SVG layout engine for the business-framework infographics (quadrant, value chain, funnel, market map) since those are layout-driven, not data-plotted.
- **Coverage priority** (build by frequency, not catalogue order):
  - **P0:** bar/column · grouped/stacked/100%-stacked · line/multi-line · area · donut · **2×2 quadrant** · **market map** · KPI/stat band · comparison matrix · waterfall · timeline/roadmap.
  - **P1:** treemap/sunburst · sankey/chord · choropleth + flow map · box/violin · bubble/scatter · marimekko · funnel · radar · slope.
  - **P2:** network graph · parallel coordinates · cohort/retention grid · calendar heatmap · circle packing.

**Every template that ships moves a whole class of visuals from Lane B (metered) to Lane A (free) — that is the margin.**

### 7.2 Proposal engine (Model C)

- **Input:** a section's data + argument (+ optional intent). **Output:** 2–3 ranked candidates `[{templateId, boundData, rationale}]`.
- **v1 = heuristic ruleset:** data shape → intent → candidate templates (time dim → Trend family; categorical+measure → Compare; parts→whole → Composition; geo field → Geography; source→target → Flow). Rationale from a template string.
- **v2 = model-assisted** (Thinking Brain) for ranking + natural-language rationale.
- **Intent steering:** the 6 intent pills re-filter/re-rank candidates.
- Candidates render as **live previews via the deterministic renderer** (free) — never pre-generate images to populate options.

### 7.3 Generation service (Lane B)

- **Image generation** (cover/section imagery) via an image model; **token/size-capped per generation** for cost (targets: image ≤ $0.4, bespoke graphic ≤ $0.15).
- **Curated/stock image library** = free to browse and apply (the Edit pane's "2 curated · free"); **generation is the only paid image path** ("＋ Generate bespoke · 1 revision").
- **Bespoke graphic generation** only when no template fits — shrinks as the library grows.
- Every generated asset is **cached by content hash**.

### 7.4 Caching, versioning, restyle

- **Generate once, cache.** Restyle / recolour / resize / crop / reposition / change chart type on the same data = deterministic post-processing on the cached asset — **free, no regeneration**.
- **Version history per visual** (the ●○○ dots): persist each generation; the user selects among them, never destroys.
- Regeneration fires **only on a material content/prompt change**.

### 7.5 Edit-credit metering

*Model: `docs/app-handoff/EDIT-ECONOMICS.md` (locked) · pricing summary `.agents/pricing-model.md` §4.6-A. A generation draws **edit credits** from the report's shared allowance — the same currency as every substantial edit — not a separate revision count.*

- **Charging rule (critical): a generation = one run of a MODEL** (image generation or bespoke-graphic generation) and **draws credits** (≈ 500 per generation). **Deterministic renders — every chart, every templated infographic, every restyle — are free and draw nothing.** The test is "did a model run", NOT visual category: a *templated* 2×2 is free; a *model-generated* bespoke infographic draws credits.
- **Report-level shared allowance, tiered:** Brief **15,000** · Study **80,000** · Intelligence **300,000** credits, shared across all edits (text + visual). **Overflow draws the account money balance; top-up = the Wallet top-up ($20/$50/$100 tier-default, $10 increments) — no separate pool.**
- **Surfacing (no counter, no running total):** the balance draws down **silently** — no persistent `↻ x/10`, no "…that leaves N revisions" voice line. Interrupt **only at the edge** (a generation exceeds the remaining balance → top-up prompt). Action-scoped tags may mark that a click *costs* (*"＋ Generate bespoke"*) without a per-click price; free actions carry no marker.
- **Margin guardrails:** template-first proposal ordering; per-generation cost cap on images; lazy cover generation (deliver 1, generate the 2nd on request); curated-first image grid.

### 7.6 Output fidelity

Templates render to **vector** → embedded in the **PDF** (300dpi/print vector) and mapped to **editable PPTX** shapes. Fonts + palette embedded. This is what lets the boardroom deck be both pixel-perfect and editable.

### 7.7 Edit-mode integration (UI is designed — build against it)

The Edit-mode UI is fully designed in Figma (`y2F394I4CwEeSzH2kKuDCt`, 📝 Report Creation page): **Chart · Visual·Cover · Visual·Infographic**, desktop + mobile. It drives: **select element → proposal engine → user picks / steers by intent / prompts → re-render (free) or generate (metered)**.
- **Two families:** Chart (data viz) and Visual (image + infographic; the **cover folds into Visual**). Intents apply to Chart + body infographics; the cover uses on/off toggles (Light, Eyebrow, Page count…).
- **Selection = a red pulse border** on the edited element's own boundary (animate as the recorded red-dot pulse).
- The prompt bar accepts freeform analysis+visual requests ("run a heuristic analysis, show it as a 2×2").
- UI rules: `design-guidelines.md` + the Figma frames.

### 7.8 Suggested build sequence

1. **Renderer + P0 templates + data contracts + canonical model** (the library core).
2. **Proposal engine (heuristic) + Edit-pane wiring** (select → propose → re-render).
3. **Generation service + cache + version history + revision metering.**
4. **P1/P2 templates + model-assisted proposals + PPTX export.**

---

*Owner: Joy · 2026-08-03 (dev spec added 2026-08-04). Figma: file `y2F394I4CwEeSzH2kKuDCt` (Edit-mode frames). Pricing basis: `.agents/pricing-model.md` + CLAUDE.md Research-Budget model.*
