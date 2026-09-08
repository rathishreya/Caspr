# Caspr Report Guidance — Engineering Handoff

*For: Jayant and team · Owner: Joy (Marketing/Product)*
*Package v1.0 · August 2026 · `guidance_version: 1.0.0`*

---

## What this is

The specification for **how a Caspr report reads and looks** — its voice, register, content obligations, and visual system, across every deliverable type, tier, and output format.

**These files are runtime prompt content.** They are not background reading: they get loaded into the generation and rendering pipelines. Treat them as source.

**Start with [`00-resolution-map.md`](00-resolution-map.md).** It is the integration contract — which files load for a given report, in what order, and who wins when they disagree. Everything else hangs off it.

---

## The one rule that governs every file here

> **Guidance constrains the OUTCOME, never the METHOD.**
>
> These files specify *what questions must be answered*, *what voice and register*, *what the page looks like*, and *where the ceiling is*.
>
> They must **never** prescribe a table of contents, a section order, which analyses to run, or which sources to use. **That is Caspr's to decide** — it is the core product differentiator (`app-shell-framework.md §1a`).

A renderer that hard-codes a section sequence, or a prompt that ships a fixed outline, has broken the product. If any file here reads as though it is doing that, it is a bug in the file — flag it.

---

## How resolution works — the 60-second version

Two passes, different keys, different bundles:

```
PASS 1 — ANALYSIS  (once per report)        PASS 2 — RENDER  (once per OUTPUT FILE)

key: deliverable_type · sub_type            key: format · tier   (+ deliverable_type)
     · tier · icp · language

loads: L0  voice     report-style-guide §11 loads: L1a page system  master + tier overlay
       L2  type      type-*.md                    L1b components    components.md
       L3  icp       report-style-guide §10

produces: report state (the content)        produces: the PDF / PPTX / XLSX file
```

**Three things that commonly surprise people:**

1. **`deliverable_type` and `icp` are not Gate selections.** Type is confirmed at intent-confirmation *before* the Gate; ICP is an **account attribute**, never asked per report.
2. **`style` does nothing at launch.** It has one value. This guidance system *is* the implementation of Style, auto-resolved.
3. **Entitlements follow the canonical tier slug, never the display name.** A *Diligence* is `tier = intelligence` → 300,000 edit credits and the Intelligence format set. Display names (Screen · Thesis · Diligence · Review · Deep) are lingo-layer only.

---

## Suggested build order

Sequenced by dependency and by size of behavioural change, not by file order.

| # | Work | Why here | Size |
|---|---|---|---|
| 1 | **Resolution mechanics** — manifest, two-pass loading, validity gate, fallbacks | nothing else functions without it | small |
| 2 | **L2 type layer** — the five `type-*.md` files into the analysis prompt | **the biggest behavioural change.** Today all output is effectively one type | large |
| 3 | **L3 ICP + fallback** — account ICP field, `§10` profile selection, `§10.9` default | `§10.9` is the most-used path at launch (every ICP-less user) | small |
| 4 | **L1b components** — `components.md` C1–C6, C9 | C1 carries a brand-integrity RULE (see below) | medium |
| 5 | **PPTX** — `format-pptx.md` | **no spec existed before this package**; ships in every Study/Intelligence base set | large |
| 6 | **Data & plain-text outputs** — `format-data-outputs.md` | XLSX/CSV/MD/DOCX currently ungoverned | medium |
| 7 | **Evidence-class structured data** — Divergence + Signal + Primary Data as typed payloads | extends the pattern already established for The Signal | medium |

**Item 2 is the one to start thinking about early** even if it lands later — it changes what the analysis pass produces, not just how it renders.

---

## File index

| File | Layer | What it is |
|---|---|---|
| [`00-resolution-map.md`](00-resolution-map.md) | — | **the integration contract.** Two passes · precedence · validity · fallbacks · tier semantics · manifest · worked examples |
| [`report-style-guide.md`](report-style-guide.md) | **L0 · L3 · L1a** | **the master system.** Palette, type, cover, tables, charts, citations, last page · **§10** ICP profiles · **§11** voice rules · **§12** checklist |
| [`brief-design-v2.md`](brief-design-v2.md) | L1a | Brief PDF overlay — what Brief removes and replaces |
| [`tier-intelligence.md`](tier-intelligence.md) | L1a | Intelligence overlay — deeper analysis tree, calibrated confidence, the Divergence block |
| [`format-pptx.md`](format-pptx.md) | L1a | the deck system — masters, layouts, action titles, native objects |
| [`format-data-outputs.md`](format-data-outputs.md) | L1a | XLSX · CSV · MD · DOCX conventions |
| [`components.md`](components.md) | L1b | type → component matrix, density, and the nine components |
| [`type-market-research.md`](type-market-research.md) | L2 | 10 sub-types · questions · ceilings · register · visual |
| [`type-business-case.md`](type-business-case.md) | L2 | 4 sub-types — advocacy register |
| [`type-investment-deal.md`](type-investment-deal.md) | L2 | 2 subjects × 3 tiers — the sceptical mirror |
| [`type-academic-research.md`](type-academic-research.md) | L2 | literature synthesis + integrity rules |
| [`type-legal-document.md`](type-legal-document.md) | L2 | ⏸ **POSTPONED — do not build** |

| Folder | Contents |
|---|---|
| `reference/` | rendered samples and reference HTML — useful as ground truth for the PDF system |
| `archive/` | superseded v1s. **Not operative.** Kept for history only |

---

## Delivery-blocking RULES

Everything in these files is either a **RULE** (inviolable) or **GUIDANCE** (a default a more specific layer may refine). These are the RULES that should fail a build rather than warn.

*Canonical text lives in the named file — this is an index, not a substitute.*

| # | Rule | Where |
|---|---|---|
| 1 | **Synthetic panel data carries the `AI-SIMULATED PANEL` label AND the sentence "Responses are model-simulated from audience profiles, not collected from people."** Both, in every format | `components.md` C1 |
| 2 | **An evidence-class block never degrades into ordinary prose.** Losing the container silently promotes crowd sentiment to a cited finding | `components.md` § family · `format-data-outputs.md` §5a |
| 3 | **Every table, chart, and callout stat carries a source line** — in every format, including slides and spreadsheets | `report-style-guide.md` §9, §13, §14 |
| 4 | **No exclamation points.** No hedging phrases from the `§11` removal list | `report-style-guide.md` §11 |
| 5 | **Section headers state findings, not topics** | `report-style-guide.md` §6 |
| 6 | **PPTX: native objects only.** Charts keep their data; nothing is an image of a chart or table | `format-pptx.md` §1 |
| 7 | **PPTX: 12pt floor, autofit disabled.** Content that doesn't fit means the slide holds too much | `format-pptx.md` §3 |
| 8 | **Divergence payloads without `resolution` are dropped, not rendered** | `tier-intelligence.md` §4 |
| 9 | **C9 discourse sections carry a prominent non-representativeness statement** | `components.md` C9 |
| 10 | **Academic: every claim attributed to a specific work**; output is input to the student's work, not submittable prose | `type-academic-research.md` |
| 11 | **No gradients** outside the cover photography overlay · no drop shadows · no 3D | `report-style-guide.md` §2 |
| 12 | **Scope is a property of the tier, never the price.** A discounted analysis delivers full scope, including full edit credits | `00-resolution-map.md` § Scope |

---

## Postponed and open

| | Status |
|---|---|
| **Legal Document type** (`type-legal-document.md`) | ⏸ **Postponed** — no landing page or app surface, and it needs Lawyers ICP research plus legal sign-off. Draft kept so the work isn't lost. **Do not build against it.** |
| **C7 · C8** — legal disclaimer block, quoted-clause treatment | Blocked with the above |
| **Fielded primary research** | Deferred lifecycle (`app-shell-framework.md §1a`) — quote-based, off-ladder. Synthetic panels are live as a Gate add-on |
| Capability row descriptors on the Intelligence cover | Open — topic-level today; naming the models engaged would make rigour visible but risks over-claiming |

---

## Integration notes

> ### ⚠ Read first — three resolution keys are not yet on the wire
>
> This package tells you **which file to load for a given report**; it assumes the API receives the keys that decide it. Checked against `api-spec-v2.md` §3: most are there — `depth`, `language`, `output_formats` and the Data Room all resolve cleanly, and `client_knowledge.icp` exists.
>
> **Short: `deliverable_type`, `sub_type`, `primary_data.method`** — plus `icp` needs to become a controlled key rather than free-form text.
>
> **Only `primary_data.method` can produce a wrong claim to a user** (synthetic panel data shipping unlabelled, against a C1 RULE). The rest degrade to *bland but correct* — output looks fine, just never targeted — which is why they will not surface as bugs.
>
> Detail: **`00-resolution-map.md` § Contract status.** Work in flight: `docs/app-handoff/DEV-PROMPT-RESOLUTION-KEYS.md` → `api-spec-v3.md`.

1. **These files must reach the generation and render APIs at runtime.** Drive is the source of truth; vendored-at-deploy or fetched-and-cached are both fine. **Mechanism is your call; it needs to exist and be versioned.**
2. **Stamp `guidance_version` on every generated document.** Gives reproducibility, tells us which reports ran under which rules, and lets a quality regression be traced to a specific guidance change.
3. **Two calls, two bundles.** Don't send L1 visual content into the analysis call, or L0/L2/L3 into the render call.
4. **`icp` must exist as an account field.** It is the L3 key and is never collected per report.
5. **Evidence-class blocks are structured data, not prose.** The analysis identifies the class; the renderer owns the treatment — the pattern already set for The Signal in `architecture-alignment-final.md`. New evidence classes extend the same typed union.

---

## Related specs outside this folder

| Doc | Why it matters here |
|---|---|
| `docs/product/document-taxonomy.md` | the tags these files resolve on — deliverable type, sub-type, tier, ICP, primary data |
| `docs/product/gate-output-spec.md` | what the Gate collects; format base sets by tier; the output model |
| `docs/product/app-shell-framework.md` | §1a entry architecture and the "Caspr decides structure" principle |
| `.agents/pricing-model.md` | tier prices, edit credits (§4.6-A), premium data add-ons |
| `.agents/brief-spec.md` | **partially superseded.** Its per-type question blocks are replaced by `type-market-research.md`; its **Prompt Detection** section remains canonical |
| `.agents/icp-personas.md` · `.agents/icp-copy.md` | the ICP research `§10` is derived from |
| `.agents/brand-guidelines.md` · `.agents/security-posture.md` | voice and the zero-training / confidentiality claims |

---

*Questions to Joy. Package assembled August 2026.*
