# Caspr — Document Tag Taxonomy

*For: Engineering (Jayant's team) and Product*
*Last updated: 2026-07-13*
*Status: **v1 hypothesis — structure locked; deliverable types, sub-types, tiers & pricing locked; lingo locked; content constraints (questions per sub-type) folded in.** Legal Document is tentative (pending Lawyers ICP + legal review). Cross-validate against real prompt logs when available (see § Grounding & confidence).*
*Reads with: **`docs/report-guidance/00-resolution-map.md`** (the generation-guidance system these tags resolve into — voice, register, content constraints, visual specs), `.agents/icp-personas.md` + `.agents/icp-copy.md` (the ICP research this is derived from), `brief-spec.md` (Prompt Detection + the Market Research sub-types), `app-shell-framework.md` §1a/§6/§6a (entry flow, deliverable archetypes, nav rail), `product-design-spec-draft.md` §4.4 (Gate 1 upload), `.agents/pricing-model.md` §4 (Market Research tiers), `.agents/security-posture.md` (zero-training / confidentiality).*

---

## Purpose

Caspr's world is **three objects** across **two surfaces**:

| Object | Surface | What it is | Membership |
|---|---|---|---|
| **Document** | Documents | A Caspr-generated output | belongs to 0–1 Project |
| **File** | Data Room | A user-uploaded source | belongs to 0–1 Project |
| **Project** | (cuts across both) | A user-created named container for one engagement / deal / theme | user-created, **optional** |

This spec defines the tags on all three: **§A Documents**, **§B Data Room (Files)**, **§C Projects**. Two things are deliberately *not* here, because they belong to a different layer:

- **ICP is not a document tag.** Who a document is *for* is a property of the **user account**, not the artifact. ICP drives personalisation (which chips surface, which display labels show — § Lingo) and is a design-time coverage lens (§ Grounding) — never a stored facet on a Document. This mirrors the locked `app-shell-framework.md §1a` decision: personalise by audience, classify by intrinsic properties.
- **"Memory" does not exist.** All uploads live in the **Data Room** (one nav destination). The name is deliberate — a feature called "Memory" would fight the zero-training security claim and read as consumer-chatbot language. See §B.

Where a field needs the inference pipeline, it's flagged **[PIPELINE]**; where the app writes it directly, **[METADATA]**.

---

# §A — Documents (Caspr-generated outputs)

## The facet model

A Document has **three type facets in a conditional cascade**, then **universal facets** that apply to everything.

```
Deliverable Type  ──determines──▶  which Sub-types are valid
       │                          which Tier scale applies
       └────────────────────────▶  Sub-type (single)  +  Tier (single)
```

| # | Facet | Applies to | Card. | Source | Filter pill |
|---|---|---|---|---|---|
| 1 | **Deliverable Type** | all | single | detected + confirmed | ✓ Primary |
| 2 | **Sub-type** | type-dependent | single | detected | ✓ Primary |
| 3 | **Tier** | all *(values per type)* | single | user-set | ✓ Primary |
| 3a | **Primary data** *(add-on)* | any | 0–1 | user (Gate) | — |
| 4 | **Sector / Industry** | all | multi (≤3) | derived | ✓ Primary |
| 5 | **Geography** | all | multi | derived | ✓ Secondary |
| 6 | **Topic / Theme** | all | multi (≤3) | derived | — (Insights) |
| 7 | **Subject entity** | entity-centric sub-types | 0–1 + mentions | derived | — (search) |
| 8 | **Status** | all | single | system | ✓ Primary |
| 9 | **Provenance** | all | single | derived from Data Room links | ✓ Secondary |
| 10 | **Project** | all | 0–1 | user | ✓ Secondary |

Facets 1–3 are the **conditional cascade**; 4–10 are universal. This replaces the earlier flat "research type + depth + JTBD" model, which mixed two levels and treated depth as universal. **JTBD is retired** — it folded into Deliverable Type (Due Diligence, Business Case *are* the types now).

---

## Facet 1 — Deliverable Type `[PIPELINE detect + user confirm]`

The spine. **Five ladder types + Primary Research as an add-on layer** (not a peer type — § Facet 3a). Derived from the ICP research (`icp-personas.md`); detected from the prompt; confirmed via the §6a intent-confirmation beat when ambiguous. **Each Deliverable Type is also a website use-case page** (`pages-for-production.md`) — the taxonomy and the site's use-case vocabulary are one list, so a page can pull its sub-types, tiers, prices, and lingo straight from here.

| Type (slug) | What it is | Sub-types | Tier → price | ICP · use-case page |
|---|---|---|---|---|
| `market_research` | Desk research on curated public sources | §A.2a — 10 | Brief **$15** · Study **$80** · Intelligence **$300** | Consulting / Strategy / all · `/use-cases/market-research` |
| `business_case` | The company's own case (raise / sell / approve) | §A.2b — 4 | ladder, rung skewed by sub-type WTP | Founders / Strategy · `/use-cases/business-case` |
| `investment_deal` | The investor's decision (back / buy *them*?) | §A.2c — 2 subjects | Screen **$15** · Thesis **$80** · Diligence **$300** | Investors · `/use-cases/due-diligence` · `/investment-thesis` |
| `legal_document` | A legal work-product — **draft, not advice** | §A.2d — 5 kinds | Screen **$15** · Review **$80** · Deep **$300** *(tentative)* | Investors, **Lawyers** *(candidate ICP)* |
| `academic_research` | Scholarly literature synthesis | §A.2f — `literature_synthesis` | Brief **$8** · Study **$40** *(academic pricing, no Intelligence)* | Grad students · `/academic` |

**Primary Research is not a peer type** — it's a composable primary-data add-on on *any* Document (§ Facet 3a). Demoted because "synthetic vs fielded" is a *data method*, not an output shape (`app-shell §1a`).

**Business Case ≠ Investment & Deal — the mirror rule.** Same underlying analysis, opposite sides of the table: **Business Case** = *"back me / buy from me / approve this"* (the company's own case); **Investment & Deal** = *"should I back / buy them?"* (the investor's decision). Never collapse them.

**Cardinality:** single. **Drives:** primary pill, the §6a first-move archetype, the display label (with account ICP, § Lingo), and the matching website use-case page.

---

## Facet 2 — Sub-type `[PIPELINE]`

The specific deliverable within a type. **This is the level users actually name** (nobody says "a Market Research"; they say "a competitive landscape"). Single-valued, detected via Prompt Detection.

### 2a. Market Research sub-types

| Slug | Canonical display | Entity-centric | Tier availability |
|---|---|---|---|
| `market_sector` | Market Sector | — | Brief · Study · Intel |
| `competitive_landscape` | Competitive Landscape | — | Brief · Study · Intel |
| `company_profile` | Company Profile | Company | Brief · Study · Intel |
| `executive_profile` | Executive Profile | Person | Brief · Study |
| `geography` | Country / Market | — | Brief · Study · Intel |
| `category` | Category | — | Brief · Study · Intel |
| `regulatory` | Regulatory Overview | — | Brief · Study · Intel |
| `market_entry` | Market Entry | — | Brief · Study · Intel |
| `market_sizing` | Market Sizing (TAM) | — | Study · Intel |
| `trends` | Trend Analysis | — | Brief · Study · Intel |

### 2b. Business Case — WHAT = audience/format; tier = depth (rung skews by audience WTP)

| Sub-type | Canonical / lingo | Realistic tiers | Why |
|---|---|---|---|
| `pitch` | Pitch Deck *(founder)* | **$15 / $80** | founders lowest-WTP — no $300 |
| `sales` | Sales Deck | **$80** | deal-sized |
| `internal_approval` | Board / Approval Paper | **$80 / $300** | strategy budget |
| `strategic_options` | Strategic Options Paper | **$80 / $300** | strategy flagship; vs $150k consulting |

### 2c. Investment & Deal — 2 subjects × 3 tiers (Thesis & DD are *tiers*, not sub-types)

The **subject** is the WHAT (single sub-type); the **stage** (Screen → Thesis → Diligence) is the tier/price.

| Subject (sub-type) | $15 Screen | $80 Thesis | $300 Diligence |
|---|---|---|---|
| `sector` | Sector Screen | Sector Thesis | *(rare)* |
| `company` | Target Screen | **Investment Thesis / IC Memo** | **Due Diligence (DD)** |

*The former flat entries `investment_thesis` / `due_diligence` / `ma_target` / `sector_investment` are now cells in this matrix — stored as `subject` + `tier`, not separate slugs. This is the tier/sub-type collapse resolved.*

### 2d. Legal Document — kind (WHAT) × depth (tier) — *tentative*

`legal_memo` · `nda_review` · `contract_review` · `term_sheet` · `legal_dd`, each across Screen $15 / Review $80 / Deep $300. **Flagged pending Lawyers candidate ICP + legal/liability review. Ships as a draft for a lawyer to review — never legal advice; needs a disclaimer and legal sign-off before launch.**

### 2e. Academic Research — narrowed to `literature_synthesis`

The one genuinely-academic output (synthesising scholarly papers). **A grad student's other needs — industry primers, market context, sizing — are Market Research at academic pricing, not this type.** "Academic" is mostly a pricing/account attribute; the former `research_context` folds into Market Research.

*(Primary Research is no longer a sub-type group — it moved to § Facet 3a as an add-on.)*

**Cardinality:** single. **Drives:** primary pill, the display label users see (§ Lingo), and the sub-type's content constraints — *the questions it must answer*, § Content constraints.

---

## Facet 3 — Tier `[METADATA]`

The size/rigour of the deliverable, user-set at compose. **The three price points $15 / $80 / $300 are a shared ladder; each type occupies the rungs its WTP supports.** Pricing logic throughout: **WTP → competitive alternative → Caspr cost** (cost is a floor, binding only when it exceeds WTP).

| Type | Tier scale → price |
|---|---|
| **Market Research** | Brief **$15** · Study **$80** · Intelligence **$300** *(exec_profile: no Intel · market_sizing: no Brief)* |
| **Business Case** | same ladder; rung set by sub-type WTP (§A.2b) |
| **Investment & Deal** | Screen **$15** · Thesis **$80** · Diligence **$300** (§A.2c) |
| **Legal Document** | Screen **$15** · Review **$80** · Deep **$300** *(tentative)* |
| **Academic Research** | Brief **$8** · Study **$40** — academic pricing, **no Intelligence** |

The Market Research rung names (`brief` / `study` / `intelligence`) are the canonical tier slugs from `pricing-model.md §4`; other types reuse the same three price points under their own display names (Screen / Thesis / Diligence, etc.).

**Two types deliberately leave the standard ladder:** **Academic** (discounted $8/$40 — a strategic loss-leader where cost may exceed WTP, accepted for post-grad LTV, `icp-personas.md` 8) and **Primary data** (an add-on, § Facet 3a). **Cardinality:** single, gated by Deliverable Type + sub-type — a Legal Document is never a "Brief," an Academic output is never "Intelligence."

---

## Facet 3a — Primary data `[METADATA + cost]` (an add-on, not a type)

Primary research composes **onto** a base Document, never standalone — real data always ships analysed inside a secondary frame (on-brand: analysis, not raw data). Represented as `primary_data: {method: none|synthetic|fielded, …}` on any Document; it affects **price, not `deliverable_type`.**

| Method | How it prices | Status |
|---|---|---|
| **Synthetic panel** (digital-twin) | base tier ($15 / $80) **+ $20–60 premium data add-on** (`pricing-model.md`), toggled at the Gate | available — a *source*, per `app-shell §1a` |
| **Fielded survey** (real respondents) | base **+ quote-based** field cost — real per-response pass-through, the one case where cost *forces* pricing | **deferred**, off-ladder |

**Positioning note (brand — needs a copy edit):** synthetic panels are *simulated* audience response, not real fieldwork. The *"Caspr does not do primary research / fieldwork"* claim holds for **fielded**, but synthetic must always be described as **AI-simulated**, never overclaimed as real primary data. Any brand/website copy touching this needs review.

**Visual treatment is specified** — `report-guidance/components.md` **C1 Primary Data Exhibit**. Every primary-data finding carries a mandatory method header (method label · base · verbatim question · method note), and synthetic data carries **both** the `AI-SIMULATED PANEL` label **and** the sentence *"Responses are model-simulated from audience profiles, not collected from people."* Both, not either — a brand-integrity RULE, not a disclaimer.

---

## Facet 4 — Sector / Industry `[PIPELINE]`

GICS as the controlled backbone. **11 sectors** are the pill set; store sector + (where confident) industry group.

`10` Energy · `15` Materials · `20` Industrials · `25` Consumer Discretionary · `30` Consumer Staples · `35` Health Care · `40` Financials · `45` Information Technology · `50` Communication Services · `55` Utilities · `60` Real Estate

- `gics_sector[]` — controlled, multi (≤3). Drives the "X industries" metric (counts distinct sectors).
- `niche_tags[]` — uncontrolled slugs the pipeline extracts verbatim ("logistics-tech", "ready-meals"). Search-only; never a pill, never counted.

**Reused by** Data Room §B and the Gate 1 relevance match. *(Licensing: confirm GICS terms or use a Caspr-maintained 11-sector list mirroring the names — recommended, avoids a licence dependency.)*

---

## Facet 5 — Geography `[PIPELINE]`

- `countries[]` — ISO 3166-1 alpha-2 (`GB`, `VN`). Drives the "Y geographies" metric.
- `region` — derived, not stored: `north_america` · `latam` · `europe` · `mea` · `apac` · `global` (sentinel for worldwide/no-country focus). Secondary pill.

---

## Facet 6 — Topic / Theme `[PIPELINE]`

Cross-cutting forces, controlled vocabulary (powers Insights dashboards). Multi (≤3). Starter set — Product owns additions, the pipeline never mints slugs:

`sustainability` · `digitalisation` · `regulation` · `supply_chain` · `consolidation` · `capital_markets` · `consumer_shift` · `pricing` · `geopolitics` · `talent` · `infrastructure` · `tariffs` · `employment`

*(`tariffs` and `employment` added per Joy's examples — theme vocabulary is a drill-down we can extend.)*

---

## Facet 7 — Subject entity `[PIPELINE]`

For entity-centric sub-types (company_profile, executive_profile, ma_target, company-level investment_thesis / due_diligence):

- `primary_entity` (0–1) — the subject; drives title/cover. `{kind: company|person, name, identifier: {domain|lei|null}}`. **v1: resolve companies to a domain; leave persons as strings.**
- `mentioned_entities[]` (0–n) — named in the body; search-only.

---

## Facet 8 — Status `[METADATA]`

System lifecycle: `draft` (abandoned pre-generation) · `generating` · `complete` · `failed` (refundable) · `archived` (user-set). Primary pill / segmented view.

---

## Facet 9 — Provenance `[METADATA — derived]`

Whether the analysis drew on private user material — the **shareability gate**. Derived from the Public/Private tag of linked Data Room files (§B.1), regardless of Included/Excluded:

- `public_only` — no linked files, or all linked files are `public`. **Only these are eligible to become `/samples/` or shareable links.**
- `includes_private` — ≥1 linked file is `private`. Can *never* be surfaced publicly (protects a data room from leaking into marketing; ties to `security-posture.md`).

---

## Facet 10 — Project `[METADATA]`

`project_id` (0–1) — the user-created container this Document belongs to. Optional (§C). Secondary pill / grouping.

---

## The Lingo layer — canonical display + ICP alias `[METADATA lookup]`

**Locked 2026-07-13.** The schema stores only the internal slugs (facets 1–2), which never change. What the user *sees* is resolved through a static `(slug × account-ICP) → label` lookup — a **display concern in the personalisation layer, touching no document record.** Filtering, search, metrics all use the slug.

**Three locked rules:** (1) internal slug is stable and never shown; (2) canonical display = **the most common word the audience actually uses** (jargon wins when it's the real term — hence "TAM", "DD"); (3) an alias exists only where an ICP genuinely uses a *different* word, keyed to the account ICP.

**Type-level aliases** (users rarely see these — the label lives at sub-type level):

| Type | Default label | Alias by ICP |
|---|---|---|
| `business_case` | Business Case | **Pitch Deck** (founder) · **Sales Deck** (sales) · **Board Paper** (strategy/internal) |
| `academic_research` | Academic Research | **Lit Review** (grad) |
| others | (type name) | — |

**Sub-type aliases** — where the real vocabulary lives (source-cited):

| Slug | Canonical | ICP aliases *(source doc)* |
|---|---|---|
| `market_sector` | Market Sector | "industry primer" *(consulting/grad, icp-copy 1/8)* · "sector context / brief" *(investor, 3)* · "sector deep-dive" *(agency, 4)* |
| `competitive_landscape` | Competitive Landscape | "competitive analysis" *(agency)* · "competitive intelligence" *(strategy)* · "competitive dynamics" *(MR pro)* |
| `market_sizing` | **TAM** | "market sizing" *(analyst-neutral)* · "market size number" *(founder, 5)* |
| `category` | Category | "category review" · "category intelligence" *(category mgr, 6)* |
| `market_entry` | Market Entry | "market entry assessment" *(strategy)* |
| `geography` | Market Conditions | "country overview" |
| `investment_thesis` | **IC Memo** | "investment memo" *(investor, 3)* · "investment thesis" *(analyst-neutral)* |
| `due_diligence` | **DD** | "diligence" *(investor)* |
| `sector_investment` | Sector Investment | "sector brief" *(investor)* |
| `strategic_options` | Strategic Options Paper | *(strategy flagship, icp-copy 2)* |
| `fielded_survey` | Fielded Survey | "fieldwork" / "primary research" *(MR pro, personas 6)* · "shopper research" *(category)* |
| `literature_synthesis` | Literature Review | "market context chapter" *(grad, personas 8)* |

**Product consequence:** the §1a discovery chips and §6a intent-confirmation options must be phrased in **sub-type / situation lingo, not type names** — a founder sees "Size my market (TAM)" and "Build my pitch deck," never "Market Research" / "Business Case."

---

## Content constraints — the questions each sub-type answers

**Moved 2026-08-19 → `docs/report-guidance/`.** The detailed question sets now live with the generation guidance that consumes them — one per Deliverable Type, alongside the register and visual guidance for that type:

| Type | File |
|---|---|
| Market Research | `report-guidance/type-market-research.md` |
| Business Case | `report-guidance/type-business-case.md` |
| Investment & Deal | `report-guidance/type-investment-deal.md` |
| Legal Document | `report-guidance/type-legal-document.md` *(provisional)* |
| Academic Research | `report-guidance/type-academic-research.md` |

**Why they moved:** these are *generation* constraints (prompt content loaded at runtime — see `report-guidance/00-resolution-map.md`), not *tagging* metadata. Keeping a second copy here would fork the spec, and a forked spec stops having a single answer. This taxonomy defines **what a document is**; report-guidance defines **what it must contain and how it reads.**

**What stays true here:** the constraint layer keys off **Facet 2 (sub-type) × Facet 3 (tier)**, and is *"a guide for what good looks like — not a rigid template"* (`brief-spec.md`). It states what must be answered and where the ceiling is; **it never prescribes a table of contents, a section order, which analyses to run, or which sources to use.** That is Caspr's to decide.

**The cumulative-tier rule** (relevant here because it explains the Tier facet): **Brief/Screen** answers ***what*** · **Study/Thesis** adds ***so what / now what*** · **Intelligence/Diligence** adds ***validation***. Each tier's ceiling is precisely what the next tier up delivers — the mechanism that keeps the three price points honestly differentiated.

---

# §B — Data Room (all user-uploaded files)

Every uploaded file lives here, one place, one field set. **Included / Excluded** and **Public / Private** are *states on a file*, not separate stores.

| # | Field | Source | Card. | Pipeline? |
|---|---|---|---|---|
| B1 | **Classification** (Public / Private) | user (default **private**) | single | [METADATA] |
| B2 | **Inclusion state** (Included / Excluded) | user (default by upload path) | single | [METADATA] |
| B3 | **Project** | user | 0–1 | [METADATA] |
| B4 | **Sector / geo / theme / entity** | derived | multi | [PIPELINE] |
| B5 | **Content type** | derived | single | [PIPELINE] |
| B6 | **File format** | system | single | [METADATA] |
| B7 | **Status** | system | single | [METADATA] |

**B1 Classification** — `private` (default, always; confidential; makes any analysis it touches `includes_private`) vs `public` (explicit user action; may feed a `public_only` analysis). One-way-safe: forgetting to mark public = inconvenience; forgetting to mark private = a leak. Downgrade public→private always allowed; the reverse needs the explicit toggle.

**B2 Inclusion state** — the reuse default for a *different* analysis. `included` = surfaces by default when relevant (general pool); `excluded` = "don't use for other projects," never auto-attached elsewhere, resurfaces only as an explicit Gate 1 opt-in. Initial value from upload path: uploaded inside a Project's step → `excluded`; general upload → `included`. **Persistent move is asymmetric:** Included→Excluded is instant; **Excluded→Included requires a one-tap confirm** (it opens previously-locked material to default reuse everywhere). The Gate 1 checkbox is a per-analysis override that never changes this persistent field.

**B3 Project** — `project_id` (0–1). A file scoped to a Project is typically `excluded`; the two fields are related but independent (Project = organisation; Inclusion = reuse policy).

**B4** reuses §A facets 4–7 (same GICS / ISO / theme / entity vocabularies — run on file content at `ready`).
**B5 Content type** `[PIPELINE]`: `client_brief` · `data_export` · `background_reading` · `legal` · `financials` · `other`.
**B6 File format**: `pdf` · `docx` · `xlsx` · `csv` · `pptx` · `image` · `other`.
**B7 Status**: `uploading` · `ready` · `upload_failed` · `archived`.

## The Documents ↔ Data Room link, and Gate 1 selection

- `attached_to[]` on a file — analyses that actually used it. `linked_files[]` on a Document — the files it drew on (source of truth for Provenance, §A.9).
- **Gate 1** shows two rows — `Included — N files` and `Excluded · <entity> — N files` — where **N is the relevant-candidate count** (from the Gate 1 relevance match), capped (recommend ≤10 on the Included row) so Gate 1 never becomes a questionnaire (`app-shell §1a/§6a`). Clicking a row expands a checklist in the centre screen.
- **Default checked follows state:** Included files start checked if they cleared the relevance match; a file whose Project = the current analysis is auto-included with no checkbox; Excluded files from *other* projects surface only on an entity match and start **unchecked**. Whatever is checked at "Start Research" is written straight to `linked_files[]` — the checkbox state *is* the link.
- **Gate 1 relevance match `[PIPELINE]`:** score every `ready` file's tags against the emerging analysis's detected sector/geo/theme/entity; **entity match outranks sector-only.** Fast (cached tag-overlap, not a model call).

*(This supersedes `product-design-spec-draft.md §4.4`'s "default all files checked".)*

---

# §C — Projects (user-created containers)

A **Project** is an optional, user-created, named container grouping the Documents and Files for one engagement / deal / theme ("Freightos acquisition", "Q3 EV market"). It replaces the ad-hoc `originating_project` pointer with a real object.

| Field | Source | Notes |
|---|---|---|
| `name` | user | e.g. "Freightos acquisition" |
| `documents[]` / `files[]` | membership | what it groups |
| tags (sector / geo / theme / entity) | **derived — aggregate of members** | powers "show me all Healthcare projects" |

**Optional, not mandatory:** a Document or File can be standalone or in a Project. A one-off analysis needs no project setup; a multi-file DD engagement gets a container. **A Project has no ICP tag** (same rule as Documents — ICP is a user attribute). Tags aggregate up from members rather than being set by hand.

---

## Library surfaces

**Docs view — primary pills:** Status · Deliverable Type · Sub-type · Tier · Sector. **Secondary:** Geography · Theme · Provenance · Project · date.
**Metrics strip:** "X industries" = distinct `gics_sector` across `complete` docs; "Y geographies" = distinct `countries`.
**Data Room view — two tabs (Included / Excluded), primary pills:** Classification · Status · Sector (Excluded tab groups by Project/entity). **Secondary:** Content type · File format · geo · theme.
**Search:** free-text over title + `niche_tags` + entity names, scoped by surface. Everything shows via the **display label** (§ Lingo), keyed to the user's account ICP.

---

## What Jayant needs to build

**Metadata (no ML):** Tier (§A.3), Status (§A.8), Provenance (§A.9, derived from `linked_files`), Project membership (§A.10/§C), Data Room Classification / Inclusion-state / format / status (§B). Plus the **Lingo lookup** — a static `(slug × ICP) → label` table in the personalisation layer, and the **account-level ICP field** it keys on.

**Pipeline `[PIPELINE]`:**
- **Deliverable Type + Sub-type detection** — extend `brief-spec.md`'s Prompt Detection to the 6 types and their sub-types, with depth-gating and the §6a ambiguous-vs-confident branch.
- **Sector / geo / theme / entity extraction** — on prompts, reports, and file content (§A.4–7, §B.4).
- **Content type** — light classifier (§B.5).
- **Gate 1 relevance match** — cached tag-overlap scorer, entity-weighted; runs inside the security boundary (`security-posture.md`).

**Open drill-downs (deliberately not yet decided):** ① Tier scales for the 5 non-Market-Research types. ② Legal Document sub-types (with the Lawyers ICP). ③ Theme vocabulary governance. ④ Whether Documents/Files are one table or two (recommend: separate; Projects a third).

---

## Grounding & confidence — how we know this is comprehensive

This taxonomy is **derived from, and auditable against, `.agents/icp-personas.md`** (primary-research-backed) — not invented. Every ICP's stated deliverables have a home:

| ICP | Deliverables the research states | Deliverable Type |
|---|---|---|
| Consulting | competitive landscape, market sizing, industry primers | Market Research |
| Strategy | strategic options paper, market entry, board deck, M&A landscape | Market Research · Business Case · Investment & Deal |
| Investor | IC memo, due diligence, valuation, sector primer | Investment & Deal · Market Research |
| Agency | pitch research, industry deep-dive, competitive analysis | Market Research · Business Case |
| Founder | TAM / market sizing, competitive landscape, pitch deck | Business Case · Market Research |
| Market Research pro | pre-fieldwork desk research, proposals, **fieldwork** | Market Research (+ synthetic panel add-on) |
| Category mgr | category review, market sizing, **shopper insight** | Market Research (+ synthetic shopper panel) |
| Grad student | industry primer, **dissertation lit review** | Market Research · Academic Research |
| *Lawyers (candidate)* | *legal memos, contract review* | *Legal Document* |

**Confidence:** structure — high (every stated need maps; no orphan types except Legal, kept for the Lawyers candidate ICP). Lingo — grounded in approved copy, **but the definitive validation is real prompt logs** (what the 1,500 signups actually typed). Ship as **v1 hypothesis**; reconcile against logs when Jayant can surface them.

---

## Suggested record shapes

**Document:**
```jsonc
{
  "id": "doc_...",
  "title": "UK Logistics-Tech — Market Sector",
  "deliverable_type": "market_research",     // §A.1  [PIPELINE+confirm]
  "sub_type": "market_sector",               // §A.2  [PIPELINE]
  "tier": "study",                           // §A.3  [METADATA] (tier slug per type; here MR scale)
  "primary_data": { "method": "none" },      // §A.3a add-on: none | synthetic (+$20–60) | fielded (quote)
  "gics_sector": ["20"],                     // §A.4  multi ≤3
  "niche_tags": ["logistics-tech"],          // §A.4  search-only
  "countries": ["GB"], "region": "europe",   // §A.5  region derived
  "themes": ["digitalisation", "supply_chain"], // §A.6
  "primary_entity": null,                    // §A.7
  "status": "complete",                      // §A.8
  "linked_files": [],                        // →Provenance
  "provenance": "public_only",               // §A.9  derived
  "project_id": null,                        // §A.10 optional
  "created_at": "2026-07-10T..."
  // NOTE: display label = lingo_lookup(sub_type, account.icp); JTBD retired; ICP not stored here
}
```

**Data Room file:**
```jsonc
{
  "id": "file_...",
  "title": "Freightos — Financials.pdf",
  "classification": "private",               // §B1 default private
  "inclusion_state": "excluded",             // §B2
  "project_id": "proj_freightos",            // §B3
  "content_type": "financials",              // §B5
  "file_format": "pdf",                      // §B6
  "attached_to": ["doc_ma_freightos"],
  "gics_sector": ["20"], "countries": ["IL","US"], "themes": ["supply_chain"], // §B4
  "primary_entity": { "kind":"company", "name":"Freightos Ltd",
                      "identifier": {"type":"domain","value":"freightos.com"} },
  "status": "ready"                          // §B7
}
```

**Project:**
```jsonc
{
  "id": "proj_freightos",
  "name": "Freightos acquisition",
  "documents": ["doc_ma_freightos"], "files": ["file_..."],
  "gics_sector": ["20"], "primary_entity": {"kind":"company","name":"Freightos Ltd"}, // aggregated
  "created_at": "2026-07-09T..."
}
```

---

*Document: document-taxonomy.md · Owner: Joy (Product/Marketing) · For handoff to Jayant (Engineering).*
