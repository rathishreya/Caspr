# Type Guidance — Legal Document

> ## ⏸ POSTPONED — NOT IN SCOPE (Joy, 2026-08-19)
>
> **Deferred deliberately.** There is no `/legal` landing page and no surface for this type in the app today, so there is nothing for it to serve. Draft kept so the work is not lost when it returns.
>
> Before it can be un-postponed, two things must clear:
> 1. **Lawyers ICP research** — no persona in `icp-personas.md` names a legal *deliverable*; Lawyers are a flagged candidate ICP only.
> 2. **Legal / liability review and sign-off** — required before any Legal Document ships to a user.
>
> Do not enable this type in production. Do not build against it.

*Layer 2 · Pass 1 (analysis) · `deliverable_type = legal_document`*
*Style identity: `legal` · Reads with `00-resolution-map.md`*
*Version 1.0 (provisional) · 2026-08-19*

> **Outcome, not method.** States what must be answered, in what register, and where the ceiling is. Never prescribes a table of contents, a section order, which analyses to run, or which sources to use.

---

## The rule that governs every sub-type and every tier

> **A Caspr Legal Document is a first-pass draft prepared for a qualified lawyer to review.**
> **It is not legal advice. It is not a legal opinion. It is not a substitute for counsel.**

This is a **RULE** at the highest authority — it cannot be softened by tier, ICP, register, or a user request. It carries three obligations:

1. **A standing disclaimer** on every Legal Document output, distinct from and additional to the standard report disclaimer (`report-style-guide.md §15`). Wording requires legal sign-off.
2. **The register never asserts settled law.** Every conclusion is framed as an assessment to be confirmed, with the basis stated.
3. **Uncertainty is surfaced, not smoothed.** Where a question turns on facts, jurisdiction, or interpretation Caspr cannot resolve, that is stated plainly and prominently.

The existing `regulatory` sub-type in Market Research already draws this line — *"does not provide legal advice… that requires a Study, and in many cases, a lawyer."* Legal Document sits one step further along, and the line moves with it: it produces the draft a lawyer starts from, never the answer a client relies on.

---

## What this type is

A legal work-product: the first pass a lawyer would otherwise spend billable hours producing. Its value is time — it replaces associate or paralegal drafting hours (charged at $300–1000/hr), not judgment.

**Primary audience:** Investors and Corporate Dev, who encounter legal work-product inside deal flow (§10.3, §10.7) · **Lawyers** as a candidate ICP, unresearched.

---

## Sub-types, tiers, and validity

| Sub-type | Display | Screen $15 | Review $80 | Deep $300 |
|---|---|---|---|---|
| `legal_memo` | Legal Memo | ✓ | ✓ | ✓ |
| `nda_review` | NDA Review | ✓ | ✓ | ✗ |
| `contract_review` | Contract Review | ✗ | ✓ | ✓ |
| `term_sheet` | Term Sheet Review | ✓ | ✓ | ✗ |
| `legal_dd` | Legal Due Diligence | ✗ | ✗ | ✓ |

Canonical tier slugs remain `brief` · `study` · `intelligence`; *Screen · Review · Deep* are display names.

**Most sub-types here require a user-uploaded document** (the NDA, the contract, the term sheet). Where none is provided, the analysis cannot proceed meaningfully — the resolver should surface a Data Room prompt rather than generating against a hypothetical. `legal_memo` is the exception: it answers a question, not a document.

---

## How tiers extend

| Tier | Adds |
|---|---|
| **Screen** $15 | first-pass flag — what this is, and what stands out |
| **Review** $80 | full structured review of the document or question, with the basis stated |
| **Deep** $300 | multi-document cross-referencing, jurisdictional comparison, and the full risk register |

---

## The questions, by sub-type

### `legal_memo` — Legal Memo
**Answers:** the legal question as posed, restated precisely · the rules, statutes, or precedents that bear on it, named with jurisdiction · how they apply to the situation described · the practical answer, with its caveats stated · **what remains uncertain and requires counsel**.
**Ceiling:** does not opine on a specific matter as settled, and does not account for facts not supplied.

### `nda_review` — NDA Review
**Answers:** what the NDA covers and its key terms — parties, scope, duration, carve-outs · clauses that are unusual, one-sided, or unusually broad · what is missing relative to market standard · the specific points to raise before signing.
**Ceiling:** not a signable redline and not advice to sign or refuse. Counsel must confirm.

### `contract_review` — Contract Review
**Answers:** each party's key obligations and rights · the risk clauses — liability, indemnity, termination, IP assignment, change of control · terms that are non-standard or onerous, and in whose favour · gaps and ambiguities that could be litigated · the points that warrant negotiation.
**Where relevant:** how the terms compare to market standard for this contract type · interactions between clauses that are not apparent in isolation.
**Ceiling:** not advice, not a negotiation strategy, and no guarantee of enforceability — which turns on jurisdiction and facts beyond the document.

### `term_sheet` — Term Sheet Review
**Answers:** the key commercial and legal terms, in plain language · how each compares to market standard for the stage and geography · the terms that are unfavourable and why · **what each term means downstream** — the consequence a non-specialist would miss.
**Ceiling:** does not advise whether to accept, and does not model the economic outcome of the terms.

### `legal_dd` — Legal Due Diligence *(Deep only)*
**Answers:** the target's material contracts, licences, IP position, litigation history, and compliance posture **as far as the public and provided record allows** · the legal red flags a buyer must resolve before proceeding · **what cannot be assessed without privileged access or a full data room** — stated explicitly and prominently.
**Ceiling:** not a legal opinion and not confirmatory, counsel-led diligence. It scopes the legal workstream; it does not complete it.

---

## Register and content treatment

L0 (`§11`) governs. Two deliberate modifications, both flowing from the governing rule:

**1. `§11`'s hedging-removal list is partially suspended here — and this must be written into L0 as a scoped carve-out, not asserted from this file.**

`§11` deletes *"this suggests"* and *"it should be noted"* on sight. In legal work-product, calibrated qualification is not weakness — it is accuracy, and unqualified assertion is a liability. The carve-out is narrow:

- **Permitted:** qualification of a *legal conclusion* where the outcome genuinely turns on facts, jurisdiction, or interpretation not available to Caspr.
- **Still deleted:** hedging that pads prose, avoids commitment on a factual matter, or substitutes for analysis. *"There are a number of factors"* remains banned.

The test: qualification must attach to a **specific, named uncertainty**. Vague softening is still vague softening.

**2. Precision outranks concision.** Elsewhere Caspr cuts every unnecessary word. Here, a term stated imprecisely is worse than a term stated at length. `§11`'s no-padding rule holds; its brevity preference yields to exactness.

Otherwise the voice is unchanged: conclusions not descriptions, no adjectival inflation, no exclamation points, findings-as-headers.

- **Name the jurisdiction, always.** A legal statement without a jurisdiction is not a legal statement.
- **Quote the operative language.** Where a clause carries the risk, the clause is quoted — not paraphrased into ambiguity.
- **Never state a probability of litigation outcome.**

---

## ICP emphasis

| ICP | Lean into |
|---|---|
| Investors (§10.3) | deal-context framing — what the legal position does to the deal, the timeline, or the price |
| Corporate Development (§10.7) | the strategic-acquirer lens — integration and transferability: what survives a change of control, and what it costs the acquiring business |
| **Lawyers** *(candidate ICP — unresearched)* | **no profile exists.** Resolves to §10.9 until researched. Flagged in `00-resolution-map.md`. |
| **Unknown (§10.9)** | plain professional English; explain the consequence of each term for a non-lawyer |

---

## Visual

Master governs, with two additions requiring sign-off:

- **The legal disclaimer block** — distinct from and additional to `§15`'s standard disclaimer, and present on **every** Legal Document regardless of tier (including Brief tier, where `brief-design-v2.md` otherwise eliminates the last page). Placement and wording pending legal review.
- **Quoted operative language** needs a distinct treatment (indent + rule) so quoted contract text is never mistaken for Caspr's own prose. Spec pending; do not improvise.

---

## Checklist additions

- [ ] **The "draft for counsel, not advice" disclaimer is present** *(RULE — blocks delivery)*
- [ ] Jurisdiction named for every legal statement
- [ ] No conclusion stated as settled law
- [ ] Every qualification attaches to a specific named uncertainty — no vague softening
- [ ] Operative clause language quoted, not paraphrased, where risk turns on it
- [ ] No probability of litigation outcome asserted
- [ ] `legal_dd`: what cannot be assessed without privileged access is stated prominently
- [ ] Document-dependent sub-types: a source document was actually provided
- [ ] **No prescribed structure imported from this file**

---

## Open before launch

1. Lawyers ICP research → a §10 profile, or a decision to serve them via §10.9.
2. Legal review and sign-off on: the governing disclaimer wording, the `§11` carve-out, and the type as a whole.
3. Visual spec for the disclaimer block and quoted-clause treatment.
4. Confirm sub-type list and tier availability against real legal-workflow evidence — currently reasoned, not researched.

---

*Owner: Joy · Engineering: Jayant · Layer 2 of `00-resolution-map.md` · **PROVISIONAL***
