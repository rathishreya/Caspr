# Caspr Report Guidance — Resolution Map

*For: Engineering (Jayant's team) · Owner: Joy (Marketing)*
*Version: 1.0 · Created 2026-08-19*
*The single entry point for report generation guidance. Start here.*

---

## What this folder is

The guidance that decides **how a Caspr report reads and looks** — its voice, register, content treatment, and visual system. These files are **prompt content**: they are loaded into generation and output rendering at runtime.

**This document is the map.** It defines which files load for any given report, in what order, and who wins when they disagree.

### The one rule that governs every file here

> **Guidance constrains the OUTCOME, never the METHOD.**
>
> These files specify *what questions must be answered*, *what voice and register*, *what the page looks like*, and *where the ceiling is*.
>
> They must **never** prescribe a table of contents, a section order, which analyses to run, or which sources to use. **That is Caspr's to decide** — it is the core differentiator (`app-shell-framework.md §1a`: *"Caspr is the informed one that already knows"*).
>
> This applies to visual specs too: a cover or section spec must not smuggle in a mandated section sequence.

---

## The two resolution passes

Generation and rendering are **separate API calls over different inputs** — a direct consequence of the locked architecture (`gate-output-spec.md §4`: *"every output is rendered by Jayant's output-generation API… Product sends report state → receives the file(s)"*).

```
PASS 1 — ANALYSIS                          PASS 2 — RENDER
runs ONCE per report                       runs ONCE PER OUTPUT FILE
                                           (format × language, multiplicative)

key:  deliverable_type · sub_type           key:  format · tier
      · tier · icp · language

loads: L0 Voice                             loads: L1 Visual (format, tier)
       L2 Type
       L3 ICP

produces: report state (the content)        produces: the PDF / PPTX / XLSX file
```

A report resolved once in Pass 1 may be rendered many times in Pass 2 (a PDF, a PPTX, a French PDF…) from the same report state.

---

## Resolution inputs — and where each comes from

Only two of the five keys are Gate selections. This matters: **Style is not a discriminator today.**

| Key | Source | Set when | Decides |
|---|---|---|---|
| `deliverable_type` | Prompt Detection + user confirm | **Intent-confirmation, *before* the Gate** (`app-shell §6` phase 1b) | which **L2** file |
| `sub_type` | Prompt Detection | with the type | which **questions block** inside L2 |
| `tier` | **Gate** | Gate | **L1** visual depth · format defaults · price |
| `format` | **Gate** | Gate (multi-select) | which **L1** file — *per output* |
| `icp` | **User account attribute** | signup / profile — **never asked per report** | which **L3** profile |
| `language` | **Gate** | Gate (multi-select) | **`report-style-guide.md §11.1`** — the voice in other languages. A translation is a *rewrite*, not a format-conversion (`gate-output-spec.md §6`), so language binds at Pass 1, not at render |
| `style` | Gate | Gate | **nothing at launch** — see below |

### On `style`

`gate-output-spec.md §5` defines Style as *"not just visual — it governs content treatment: text style, vocabulary, density, chart/infographic style, output length, and appendices"* — and sets launch at **a single Caspr template**. One value, zero discriminating power.

**So this guidance system *is* the implementation of Style, auto-resolved from (type, tier, ICP) rather than user-picked.** The Gate's Style row stays `Caspr default · Included`; the user never self-classifies. Style remains the override hatch and the future custom-template slot.

Each resolved bundle carries an internal **style identity** for provenance and debugging — and, if ever wanted, a ready-made dropdown list:

| Style identity | Resolved from |
|---|---|
| `analytical` | Market Research · Investment & Deal |
| `management` | Business Case |
| `legal` | Legal Document |
| `academic` | Academic Research |
| `generic` | any type where `icp` is unknown |

---

## The layer stack

| Layer | Pass | Key | File(s) |
|---|---|---|---|
| **L0 · Voice** | 1 | — (constant) | `report-style-guide.md` **§1, §6, §11** — *the register, findings-as-headers, copy rules* |
| **L2 · Type** | 1 | `deliverable_type` | `type-market-research.md` · `type-business-case.md` · `type-investment-deal.md` · `type-legal-document.md` · `type-academic-research.md` |
| **L3 · ICP** | 1 | `icp` | `report-style-guide.md` **§10.1–10.9** — *fallback `§10.9` when unknown* |
| **L1a · Page system** | 2 | `format` × `tier` | see the render table below |
| **L1b · Components** | 2 | `deliverable_type` (+ `primary_data`) | `components.md` — which components appear, and how densely |

### L1 — render resolution

**Two parts, both always loaded** — because tier and type govern different things:

> **Tier governs the page system. Type governs the component set and density.**

**L1a — page system,** keyed `format` × `tier`:

| `format` | `tier` | Files loaded |
|---|---|---|
| `pdf` | brief | `report-style-guide.md` (master) **+** `brief-design-v2.md` (overlay) |
| `pdf` | study | `report-style-guide.md` |
| `pdf` | intelligence | `report-style-guide.md` **+** `tier-intelligence.md` (overlay) |
| `pptx` | study · intelligence | `format-pptx.md` |
| `xlsx` `csv` `md` `docx` | any | `format-data-outputs.md` |

**L1b — component set,** keyed `deliverable_type` (and `primary_data` where present): **`components.md`** — always loaded alongside L1a. It carries the type → component matrix and the density register, so a Pitch Deck, an IC Memo, a Board Paper, and a Market Sector Study do not render identically.

**`primary_data ≠ none` additionally requires `components.md` C1** — the Primary Data Exhibit, whose method-label and *"not collected from people"* rules are brand-integrity **RULES**, not styling.

**The master + overlay pattern is already established and working** — `brief-design-v2.md` states it exactly: *"specifies only what is different… where this document is silent, the master applies; where it conflicts, this document takes precedence."* Every new overlay follows that contract.

---

## Tier semantics — what depth actually means

*Canonical, cross-type. Each type file's "How tiers extend" table refines this; none of them contradicts it.*

Depth moves on **two independent axes.** Most of the tier's perceived value comes from the first, and it is the easier one to defend commercially.

### Axis 1 — resolution: how far down the analysis tree

Every analysis has a set of nodes it *could* go deeper on — competitors, segments, geographies, targets, risks, scenarios, sources. Tier decides how far down it goes (Joy, 2026-08-19):

| Tier | Treatment of the tree | Worked example — market structure |
|---|---|---|
| **Brief** | states the **aggregate** | *"Ten players hold 80% of the market."* |
| **Study** | **enumerates and profiles** each node | all ten named, ~half a page each |
| **Intelligence** | **full analysis per node**, and often opens the level below | each of the ten analysed in depth — segments, economics, trajectory |

Same question, three resolutions. The Brief is not a shorter Study — it answers at a coarser grain.

### Axis 2 — validation: how hard the conclusions are tested

| Tier | Treatment |
|---|---|
| **Brief** | single pass — structured facts, stated once |
| **Study** | reasoned — implications, scenarios, a recommendation |
| **Intelligence** | **multi-model challenge** — more independent analytical passes, and depth on the **second level of the analysis tree** (`tier-intelligence.md`). **Disagreement is surfaced at every tier** (`report-style-guide.md` §9b); Intelligence additionally **adjudicates** it |

### Scope is a property of the tier, never of the price

**Joy, 2026-08-19 — a hard rule across the whole system:**

> **A tier delivers its full scope regardless of what it was charged for. If we are giving a discount, give a discount — not a quietly reduced product.**

A tier's scope is fixed: its resolution, its validation, its output base set (`gate-output-spec.md §4`), and its **included edit credits** — **Brief 15,000 · Study 80,000 · Intelligence 300,000** (`pricing-model.md §4.6-A`, *"included per analysis… sized as a benefit, not a fee"*).

**Discounted contexts change the price and nothing else.** An Academic Study at $40 is a full Study: the same analysis tree, the same format base set, the same 80,000 edit credits as the $80 Study. A promotional or trial-funded analysis is the same. **There is no reduced-scope variant of any tier, and none may be introduced** — a cheaper tier that silently delivers less is a worse product sold dishonestly, and it would be discovered the first time a discounted user compared notes with a full-price one.

**The consequence for this guidance:** never ration a component, a depth, or an entitlement on the grounds that a given analysis was cheap. Where something should be rare, the reason must be **editorial or methodological** — never economic. Cost pressure at a discounted price point is a **pricing** question (`pricing-model.md`, Jayant's cost validation), never a generation question.

**Entitlements follow the canonical tier slug, never the display name — an integration risk worth stating.** A *Diligence* is `tier = intelligence` and therefore carries **300,000** edit credits and the Intelligence base format set. A *Screen* is `tier = brief` → 15,000. The per-type display names (Screen · Thesis · Diligence · Review · Deep) are a **lingo-layer concern only** (`document-taxonomy.md`); they must never be used to look up an entitlement, a price, or a format default.

### Why both matter

**Resolution is the commercially legible axis.** *"Every one of the ten players analysed, not just listed"* is something a buyer can see on the contents page and check. Multi-model validation is real and harder to demonstrate — it shows up as calibrated confidence and Divergence blocks, which a reader has to read to notice.

**Both must be present at Intelligence.** Depth without validation is a long Study; validation without depth is a Study that argues with itself. The $300 rests on the pair.

---

## Precedence — RULES vs GUIDANCE

Layers will disagree. Resolution depends on **which kind of statement** is in conflict. Every statement in every file is one of two kinds:

- **RULE** — inviolable. Cannot be overridden by any layer, any user request, any ICP.
- **GUIDANCE** — a default. A more specific layer may refine it.

| Layer | Contains | Authority |
|---|---|---|
| **L0 Voice** | almost entirely RULES | **absolute — nothing overrides it** |
| **L1 Visual** | RULES on visual matters | authoritative on rendering only; silent on prose |
| **L2 Type** | mostly GUIDANCE, some RULES | refines L0's defaults |
| **L3 ICP** | almost entirely GUIDANCE | most specific — but lowest authority |
| **User style request** *(post-gen, metered — `gate-output-spec.md §5`)* | GUIDANCE only | most specific of all; **still cannot break an L0 RULE** |

**Specificity order for GUIDANCE** (later refines earlier): `L0 → L2 → L3 → user request`
**Authority order for RULES:** `L0 wins, always.`

This is what prevents *"the ICP profile says use heavy financial jargon"* from beating *"every word earns its place."* It also gives a clean answer to metered style requests: *"make it denser"* refines density GUIDANCE; it can never license an exclamation point.

**Worked conflict:** L3 §10.6 (Graduate Researchers) permits *"evidence suggests"* — calibrated uncertainty. L0 §11 deletes hedging on sight. Resolution: §11 **names this exception explicitly**, so it is a RULE with a scoped carve-out, not a conflict. Where an ICP needs to bend an L0 rule, the carve-out must be written **into L0**, never asserted from L3.

---

## Validity — illegal cells

The resolver rejects these before loading anything. Full matrix in each type file.

| Constraint | Rule |
|---|---|
| `executive_profile` | no Intelligence tier |
| `market_sizing` | no Brief tier (Study floor) |
| `academic_research` | no Intelligence tier; academic pricing only ($8 / $40) |
| `business_case · pitch` | no $300 tier |
| `legal_document` | **provisional** — pending Lawyers ICP research + legal review |
| `pptx` | not in the Brief base set (`gate-output-spec.md §4`) — available as a paid extra |

---

## Fallbacks

| Missing | Behaviour |
|---|---|
| `icp` unknown / unrecognised / first-time user | **Load `report-style-guide.md §10.9`.** See below. |
| L0 / L1 / L2 file unresolvable | **Hard error. Never silent.** These define output quality. |
| `sub_type` undetected | Load the type file's general questions; do not guess a sub-type. |

### The fallback is not a degraded mode

**`§10.9` is the default experience and — at launch — likely the most-used profile in the system.** 1,500 existing signups have no ICP set, and every first-time user resolves to it.

Therefore **L3 is ADDITIVE ONLY**: the output must be complete, correct, and excellent with **no ICP data at all**. ICP modulation is pure enhancement, never a dependency. If removing L3 from a bundle would make the report incoherent, the guidance is wrongly layered — the missing substance belongs in L0 or L2.

---

## Versioning and provenance

Every generated document records the `guidance_version` that produced it.

- Gives reproducibility — a report can be explained by the rules in force when it ran.
- Answers *"when does a guidance edit take effect"* — at the next version bump, not silently mid-flight.
- Lets quality regressions be traced to a specific guidance change.

Bump the version in this file's header on any change to any file in this folder.

---

## Integration notes for Jayant

1. **These files are runtime prompt content.** They live on Drive (source of truth) and must reach the generation/render APIs — vendored at deploy, or fetched and cached. **Your call on mechanism; it must exist and be versioned.**
2. **Two calls, two bundles.** Do not send L1 visual content into the analysis call, or L0/L2/L3 into the render call. They are separate inputs to separate stages.
3. **Tier slugs stay canonical** — `brief` · `study` · `intelligence` — across all types. Per-type display names (*Screen · Thesis · Diligence*) are a **display concern**, resolved through the lingo layer in `document-taxonomy.md`. Consequence: the Gate's tier-change dialog copy (`gate-output-spec.md §2`) needs per-type display-name substitution.
4. **`icp` must exist as an account field.** It is the L3 key and it is never collected per report.

### Contract status — three keys short, work in flight

**Checked against the shipped contract `docs/product/api-spec-v2.md` §3 `trigger_generation`** (2026-08-21). *An earlier draft of this section read the older `architecture-alignment-final.md` and reported the gap as far worse than it is — v2 is well ahead of that doc. Corrected.*

| Resolution key | Status in v2 |
|---|---|
| `tier` | ✅ `depth` — `brief`/`study`; Intelligence is Phase 2 |
| `language` | ✅ `gate.output_prefs.language` (BCP-47, preferred over top-level) |
| `format` | ✅ `gate.output_prefs.output_formats` |
| Data Room | ✅ `file_ids` · `new_file_id` · `include_user_files` |
| `icp` | ⚠️ **present but untyped** — `client_knowledge.icp` exists, spec'd *"free-form"*. L3 needs a controlled key matching a `§10` profile; free-form text falls through to §10.9 |
| `deliverable_type` · `sub_type` | ❌ missing — the user's **confirmed** intent (`app-shell §6` phase 1b) is discarded and re-detected from the prompt |
| `primary_data.method` | ❌ missing — **C1's synthetic-labelling RULE cannot be enforced.** `premium_addons` proves a purchase, not a method |
| `guidance_version` | ❌ not stamped |

**`primary_data.method` is the only one that can produce a materially wrong claim** — simulated data shipping as though it were fieldwork. The others degrade to bland-but-correct output, which is why they will not surface as bugs.

**`gate.style` → `caspr_default` only — ruled by Joy, 2026-08-21.** The contract carried the same decision twice: `mbb`/`big4`/`pe`/`academic` are audience labels, a crude proxy for what `icp` now carries properly with ten researched profiles. **The six house styles are retired.** `gate.style` accepts one value at launch; register resolves from `deliverable_type` × `tier` × `icp`, and the Gate's Style row stays *"Caspr default · Included"*. This aligns the contract with `gate-output-spec.md §5` (*"launch = a single Caspr template"*), which the enum had been contradicting. The field stays on the wire as the reserved slot for Phase 2 user-defined templates.

**In flight:** [`docs/app-handoff/DEV-PROMPT-RESOLUTION-KEYS.md`](../app-handoff/DEV-PROMPT-RESOLUTION-KEYS.md) — app and proxy changes, then `api-spec-v3.md`. **Update this section and the README warning once v3 lands.**

---

### Manifest

```jsonc
{
  "guidance_version": "1.0.0",
  "layers": {
    "voice":  { "pass": 1, "key": [],
                "file": "report-style-guide.md#11" },
    "type":   { "pass": 1, "key": ["deliverable_type"],
                "file": "type-{deliverable_type}.md" },
    "icp":    { "pass": 1, "key": ["icp"], "optional": true,
                "file": "report-style-guide.md#10.{icp}", "fallback": "10.9" },
    "visual": { "pass": 2, "key": ["format", "tier"],
                "table": "see § L1 render resolution" }
  },
  "hard_error_if_missing": ["voice", "type", "visual"],
  "style_identity": { "market_research": "analytical", "investment_deal": "analytical",
                      "business_case": "management", "legal_document": "legal",
                      "academic_research": "academic", "_icp_unknown": "generic" }
}
```

---

## Worked examples

**A. Consultant runs a Study on a market sector, exports PDF + PPTX**
`type=market_research · sub_type=market_sector · tier=study · icp=consulting · formats=[pdf,pptx]`

- Pass 1 → `§11 Voice` + `type-market-research.md` (market_sector questions, Study tier) + `§10.1 Consulting` → **one report state**, style identity `analytical`
- Pass 2a → `report-style-guide.md` → the PDF
- Pass 2b → `format-pptx.md` → the deck

**B. First-time user, no ICP set, Brief**
`type=market_research · sub_type=company_profile · tier=brief · icp=null · formats=[pdf,md]`

- Pass 1 → `§11` + `type-market-research.md` + **`§10.9` fallback** → style identity `generic`
- Pass 2a → `report-style-guide.md` **+ `brief-design-v2.md`** → the PDF
- Pass 2b → `format-data-outputs.md` → the MD

**C. Investor runs Diligence on a company**
`type=investment_deal · sub_type=company · tier=intelligence · icp=investors · formats=[pdf,pptx,xlsx]`

- Pass 1 → `§11` + `type-investment-deal.md` (company × Diligence questions) + `§10.3 Investors` → `analytical`
- Pass 2 → `report-style-guide.md` + `tier-intelligence.md` → PDF · `format-pptx.md` → deck · `format-data-outputs.md` → XLSX

---

## Files in this folder

**Consolidated 2026-08-19** — `docs/report-design/` was merged into this folder and removed. This is now the single location for all report generation and rendering guidance; all references across the repo were updated.

| File | Layer | Status |
|---|---|---|
| `00-resolution-map.md` | — | this document |
| **`report-style-guide.md`** | **L0 · L3 · L1 (PDF master)** | the authoritative master system |
| **`brief-design-v2.md`** | L1a | Brief PDF overlay |
| `tier-intelligence.md` | L1a | Intelligence PDF overlay |
| `format-pptx.md` | L1a | |
| `format-data-outputs.md` | L1a | |
| **`components.md`** | **L1b** | type → component matrix + density; the six new components |
| `type-market-research.md` | L2 | |
| `type-business-case.md` | L2 | |
| `type-investment-deal.md` | L2 | |
| `type-academic-research.md` | L2 | |
| `type-legal-document.md` | L2 | **provisional — postponed** |

| Sub-folder | Contents |
|---|---|
| `reference/` | rendered samples and reference HTML — `brief-sample-v2.html/.pdf`, `sodium-report-reference.html`, `report-last-page.html`, `cover-variants.html`, `sodium-report-revisions.md` |
| `archive/` | superseded v1s, kept for history, **not operative** — `report-design.md`, `brief-design.md`, `brief-sample.html` |

---

## Known drift — all resolved 2026-08-19

1. ~~**§10 ICP list ≠ `icp-personas.md`**~~ — **resolved.** Joy's ruling: **Corporate Development belongs with Strategy; M&A belongs with Investors** — they differ by *acquirer lens*, not output shape. §10.7 reframed as **Corporate Development (strategic acquirer)**, §10.3 absorbs M&A as the **financial acquirer**, §10.2 notes the kinship. That freed the conceptual slot: **§10.10 Market Research Professionals added** — a full ICP in the persona research that had been silently resolving to §10.9. Propagated to `CLAUDE.md` and `.agents/product-marketing-context.md`. *(Lawyers remain a postponed candidate — `type-legal-document.md`.)*
2. ~~**§10 "ICP is user-selected at report submission"**~~ — **resolved.** Rewritten as an **account-level attribute**, never asked per report, with §10.9 named as the explicit first-time-user default.
3. ~~**Brief page count stated three ways**~~ — **resolved.** §5.1 corrected to **4–6 pages including cover**, aligned to `brief-design-v2.md`, with a pointer to the Brief layout deviations.
4. ~~**`report-design.md` is a stale near-duplicate**~~ — **resolved.** Moved to `archive/` with `brief-design.md` (v1). Fork closed; neither is operative.

### The two acquirer lenses — the rule that came out of item 1

| Lens | Profile | Buys for | Every finding serves |
|---|---|---|---|
| **Financial acquirer** | §10.3 Investors | return on capital — the asset stands alone | *"what does this do to the return?"* |
| **Strategic acquirer** | §10.7 Corporate Development | fit with the business already owning it | *"what does this do to* ***us*** *?"* |

Same questions, same output shape, **different lead metric and vocabulary.** Never mix the registers: synergy language in a return thesis is wrong; IRR-and-exit framing for a team that will integrate and hold is equally wrong. A target can be a poor financial buy and an excellent strategic one.

---

## ~~Known gap — visual guidance below the tier level~~ — resolved 2026-08-19

**The gap (Joy):** L1 resolved on `(format, tier)` only, so a Pitch Deck, an IC Memo, a Board Paper, and a Market Sector Study all rendered identically — and primary-research output had no visual treatment at all.

**Resolved by `components.md`,** which splits L1 into **L1a page system** (tier) and **L1b component set** (type), and specifies six new components:

| | Component | For |
|---|---|---|
| C1 | **Primary Data Exhibit** | any type + primary data — method label, base, verbatim question. **Synthetic must carry `AI-SIMULATED PANEL` *and* "not collected from people"** *(brand-integrity RULE)* |
| C2 | Divergence Block | Intelligence — spec in `tier-intelligence.md §4` · **approved 2026-08-19** · optional like The Signal, emitted as structured data |
| C3 | Scenario / Sensitivity | Business Case $300 · Investment & Deal |
| C4 | Option Comparison | `strategic_options` · `market_entry` — **no composite scores or traffic lights** |
| C5 | Risk Register | Diligence · `internal_approval` — **no probability×impact heat maps** |
| C6 | Position Pair (bull / bear) | Investment Thesis — equal weight, both sides cited |
| C7–C8 | Legal disclaimer · quoted clause | **postponed** with `type-legal-document.md` |
| **C9** | **Discourse Analysis** | The Signal at **section scale**, where sentiment is the *object* of study rather than an input. Requires corpus, method, and a **mandatory non-representativeness statement**. Most likely in Academic Research |

Density is now a type property too — a Pitch Deck is the sparsest output Caspr produces; a Diligence is the densest.

**Still open:** C7–C8 only, blocked on legal review (postponed). C2 approved 2026-08-19.

---

*Owner: Joy · Engineering: Jayant · Questions to Joy.*
