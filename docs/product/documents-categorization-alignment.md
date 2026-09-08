# Documents Library — Categorization Alignment

*Status: **RECONCILED to the facet model, locked 2026-07-31 (Joy).** Single dev input for the Documents library.*
*Owner: Joy · For: Jayant (Engineering) + Design*
*Reconciles: `document-taxonomy.md` (now the **facet model** — Deliverable Type · Sub-type · Tier · Sector · …) ⇄ the Documents Figma frame (`843:89`)*
*Last updated: 2026-07-31*

---

## ⭐ RECONCILIATION — 2026-07-31 (supersedes the "5 core Types" model below)

`document-taxonomy.md` was rewritten into a **facet model**; the earlier "15 research types → 5 core Types (Market Analysis · Diligence · Deal Sourcing · Research Synthesis · Strategy)" rollup is **retired**. The Documents library now aligns to the facets. **Joy's decisions (2026-07-31):**

**Filter pane = nested, collapsible sections** (Sub-type *cascades* under Type; secondary filters are collapsed nested sections, not hidden behind a "More" button):
1. **Type** (Deliverable Type, 5) — **Market Research · Business Case · Investment & Deal · Legal Document · Academic Research**. Expanding/selecting a Type reveals its **Sub-types nested** (cascading) — e.g. Market Research → Market Sector · Competitive Landscape · Company Profile · TAM · … (`document-taxonomy.md §A.2`).
2. **Sector** — GICS 11, present-only (unchanged).
3. **Tier** — Brief · Study · Intelligence (relabel of the old "Depth"; rung names alias per type: Screen/Thesis/Diligence etc.).
4. **Secondary (nested, collapsed by default):** Geography · Theme · Provenance · Project.

- **Status = a TAG, NOT a filter and NOT a sort** (Joy held this over the taxonomy's "primary pill" — Status renders as a tag on non-`complete` covers only).
- **Sort options:** Recency (default) · Type (Deliverable Type) · Tier · Sector · Name. Group dividers: Recency → This Month/Quarter/Year/Older · Type → the 5 Deliverable Types · Tier → Brief/Study/Intelligence · Sector → GICS present · Name → A–Z.
- **Metric strip:** Documents · Industries (distinct GICS) · Geographies (distinct countries) · **Types** (distinct Deliverable Types, ≤5).

*The sections below (5 core Types rollup etc.) are the prior model — kept for history but SUPERSEDED by this reconciliation.*

---

## ⚙️ FILTER & SORT BEHAVIOUR — 2026-07-31 (for the dev session)

### Filter pane order (top → bottom)
1. **Project** *(first)* — the user's projects, with a **+ New Project** action (see §Projects below).
2. **Type** (Deliverable Type) → **Sub-type** cascades nested → **Tier** cascades nested.
3. **Sector** (GICS 11, present-only).
4. Secondary, collapsed: **Geography · Theme**.

### Tier is NOT a top-level filter — it cascades under Type
Tiers are **type-dependent** (Market Research: Brief/Study/Intelligence · Investment & Deal: Screen/Thesis/Diligence · Legal: Screen/Review/Deep · Academic: Brief/Study only). A flat universal "Tier" pill using MR's names is wrong (Joy, 2026-07-31). **Tier appears contextually once a single Type is selected**, showing that Type's own rung names — the same cascade pattern as Sub-type. It is therefore removed from the flat filter pane.

### Sort pills are contextual — driven by the active filter
Offer a sort dimension **only when it's meaningful**: never sort by a dimension already collapsed to a single value, and never sort by Tier/Sub-type across mixed Types (incoherent scales).

| Sort option | Shown when |
|---|---|
| **Recency** (default) | always |
| **Name** | always |
| **Type** | NOT filtered to a single Type |
| **Sector** | NOT filtered to a single Sector |
| **Tier** | filtered to a **single Type** (uses that Type's rung names) |
| **Sub-type** | filtered to a **single Type** |

Rule: hide a sort pill if (a) the library is already filtered to one value on that axis, or (b) the axis is type-dependent (Tier/Sub-type) and >1 Type is in view. The group-divider labels follow the active sort (e.g. sort=Tier within Market Research → Brief · Study · Intelligence dividers).

### Provenance — NOT a library filter or sort (Joy, 2026-07-31)
Provenance (`document-taxonomy.md §A.9`, `public_only | includes_private`) = whether a doc drew on private uploaded material — the share-eligibility gate. It is **derived metadata, surfaced only at share time** (block/allow making a doc a `/samples` or share link), **not** a Documents-library filter or sort dimension. Dropped from the filter pane and sort options.

### Projects — create & add documents *(new on this screen)*
- **+ New Project** at the top of the Project filter section → inline name field (or a small modal). A Project is an optional user container (`document-taxonomy.md §C`); a Document belongs to **0–1** Project (§A.10).
- **Add documents to a project:** enter multi-select (checkbox on cover hover / a "Select" mode) → a bottom action bar **"Add to project ▾"** (pick existing or create new). Also per-doc via the cover `⋯` → "Add to project."
- Project tags (sector/geo/theme) **aggregate up** from members — not set by hand.

---

---

## Why this doc exists

Three surfaces categorize documents and they don't agree:

| Surface | Types | Sectors | Metrics |
|---|---|---|---|
| **Figma pane / sort** | 5 core Types | 7 ad-hoc (Energy, Fintech, Retail, Technology, Healthcare, Automotive, Logistics) | documents · industries · geographies · **6 research types** |
| **`document-taxonomy.md`** | 15 research types | **GICS 11** | industries (GICS) · geographies (countries) |
| **`app-shell §18`** | 5 core Types | — | — |

Dev cannot build against three vocabularies. This locks **one user-facing vocabulary** and defines how it maps to the pipeline vocabulary underneath.

---

## The core reconciliation — Type

**There is one stored classification and one displayed classification, and they are different granularities of the same axis:**

- **Pipeline (stored):** the **15 research types** in `document-taxonomy.md §Axis 2` (`market_sector`, `due_diligence`, …). This is what Prompt Detection emits and what search/precision needs. **Unchanged — keep as-is.**
- **User-facing (pills, sort, list grouping, the report eyebrow):** the **5 core Types**. These are a deterministic **rollup** of the 15 — board-legible, lean, and already what the eyebrow (`app-shell §18`) uses.

**The 5 ← 15 rollup (lock this table):**

| Core Type (user-facing) | Rolls up research types |
|---|---|
| **Market Analysis** | `market_sector`, `competitive_landscape`, `market_sizing`, `category`, `geography` |
| **Diligence** | `company_profile`, `due_diligence`, `executive_profile` |
| **Deal Sourcing** | `ma_target`, `sector_investment` |
| **Research Synthesis** | `regulatory` *(+ literature/evidence synthesis)* |
| **Strategy** | `market_entry`, `business_case`, `investment_thesis`, `strategic_options` |

Rules:
- The rollup is **single-valued in → single-valued out** (a document has one research type → one core Type). Computed on read from a lookup, **not stored separately** (same pattern as JTBD in `document-taxonomy.md §Axis 7`).
- The 15-type slug is still stored (search facet, "by research type" advanced view). The 5-Type is what every **pill, sort option, list-group header, and the report eyebrow** show.
- If a genuinely new research type is added later, it must be assigned to exactly one of the 5 core Types at that time.

---

## The core reconciliation — Sector

**Lock GICS 11 as the user-facing sector set** (per `document-taxonomy.md §Axis 3`); retire the ad-hoc 7. Fintech / Retail / Automotive / Logistics are **not** sectors — they are `niche_tags` (search-only) or GICS industry-groups.

**User-facing sector pills/filter/metric = the 11 GICS sectors:**
Energy · Materials · Industrials · Consumer Discretionary · Consumer Staples · Health Care · Financials · Information Technology · Communication Services · Utilities · Real Estate.

- The pane's SECTOR list shows these (with counts), **not** ad-hoc labels.
- `niche_tags` ("logistics-tech", "fintech") stay **search-only**, never a pill, never counted.
- The **"Industries" metric = count of distinct `gics_sector`** (≤3 per doc), so it's honest and comparable (unchanged from taxonomy).

---

## The full alignment — one vocabulary across every surface

| Axis | Stored (pipeline) | User-facing set | Pane filter | Metric strip | Sort option | List group-by |
|---|---|---|---|---|---|---|
| **Depth** | `brief`/`study`/`intelligence` | same (3) | ✓ | — | ✓ | Brief · Study · Intelligence |
| **Type** | 15 research types | **5 core Types** (rollup) | ✓ | *"5 Types"* (see below) | ✓ | the 5 core Types |
| **Sector** | GICS sector + `niche_tags` | **GICS 11** | ✓ | **Industries** | ✓ | GICS sectors present |
| **Geography** | ISO countries + region | 6 regions + country typeahead | secondary | **Geographies** | (optional) | region |
| **Status** | lifecycle | Complete · In-progress · Draft · Archived | **— (a TAG on the doc, not a filter)** | — | **— (not a sort)** | — |
| **Recency** | `created_at` | — | — | — | ✓ (default) | **This Month · This Quarter · This Year · Older** |
| **Name** | title | — | — | — | ✓ | A–Z |

### Metric strip — lock

`Documents (total)` · `Industries` (distinct GICS sectors) · `Geographies` (distinct countries) · `Types` (distinct core Types, max 5).
→ Rename the current **"research types"** metric to **"Types"** and count **distinct core Types** (so the number is ≤5, matching the pills). Drop any implication it counts the 15.

### Sort → list group dividers — lock

The list is always grouped by the **active sort dimension**, with a labeled divider before each group:

| Sort by | Group dividers (in order) |
|---|---|
| **Recency** (default) | This Month · This Quarter · This Year · Older |
| **Type** | Market Analysis · Diligence · Deal Sourcing · Research Synthesis · Strategy |
| **Depth** | Brief · Study · Intelligence |
| **Sector** | GICS sectors present in the result set (alphabetical, "Multiple sectors" bucket for ≤3-tag docs handled by primary sector) |
| **Name** | A · B · C … (first-letter buckets) |

Recency bucket boundaries (calendar-relative to today): **This Month** = current calendar month; **This Quarter** = current calendar quarter, earlier months; **This Year** = current calendar year, earlier quarters; **Older** = prior years.

---

## What changes vs. today (the dev + design checklist)

1. **Pane SECTOR list → GICS 11** (retire Energy/Fintech/Retail/Technology/Healthcare/Automotive/Logistics as the set). Counts per GICS sector.
2. **Pane TYPE list → the 5 core Types** (already correct in the Figma — confirm it stays 5, and that each maps via the rollup table above).
3. **Metric "research types" → "Types"**, counting distinct **core Types** (≤5).
4. **Sort options** = Recency (default) · Type · Depth · Sector · Name — each drives the group dividers above.
5. **Every pill/sort/eyebrow uses the 5 core Types**; the 15 research types are stored + search-only.
6. `document-taxonomy.md §Axis 2` gains a note: "the 15 research types roll up to the 5 core Types for all user-facing pills/sort/grouping — see this doc's rollup table."

## Locked decisions (Joy, 2026-07-30)

- **A. Sector pills = present-only (dynamic)** — show only GICS sectors actually in the user's library, with counts. No empty pills.
- **B. Status is a TAG on the document, NOT a filter or sort dimension.** It renders as a tag on the cover for non-`complete` docs (e.g. a `Draft` / `In-progress` tag); `complete` docs show no status tag. Remove Status from the filter pane and from the sort options entirely.
- **C. Metric strip 4th tile = "Types"** (count of distinct **core Types**, ≤5). Strip = `Documents · Industries · Geographies · Types`.
- **D. Sector cardinality differs by surface:**
  - **Filtering** — a multi-sector doc matches **every** GICS sector it carries (appears under each sector filter).
  - **Sorting / grouping** — a multi-sector doc groups under its **primary (first) `gics_sector`** only (one home per doc in the grouped list).

**Sort options (final):** Recency (default) · Type · Depth · Sector · Name. *(No Status.)*
**Filter pane categories (final):** Sector (GICS, present-only) · Type (5 core) · Depth (3). *(No Status.)*

---

*Locked. `document-taxonomy.md` gets the one-line cross-reference note (15 research types → 5 core Types rollup; Status is a tag, not a pill), and the Figma frame is updated to match (sectors → GICS, metric → Types, Status off the filter/sort).*
