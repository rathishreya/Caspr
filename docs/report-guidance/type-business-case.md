# Type Guidance — Business Case

*Layer 2 · Pass 1 (analysis) · `deliverable_type = business_case`*
*Style identity: `management` · Reads with `00-resolution-map.md`*
*Version 1.0 · 2026-08-19*

> **Outcome, not method.** States what must be answered, in what register, and where the ceiling is. Never prescribes a table of contents, a section order, which analyses to run, or which sources to use.

---

## What this type is

**The company making its own case.** A Business Case argues *for* a course of action to a specific audience who must say yes: an investor, a customer, or a board.

**The mirror rule — never collapse these two:**

| | Business Case | Investment & Deal |
|---|---|---|
| Whose side | **the company's own** | the investor's |
| The question | *"back me / buy from me / approve this"* | *"should I back or buy them?"* |
| Posture | **advocacy** | **scepticism** |

Same underlying analysis, opposite sides of the table. A Business Case that hedges like a diligence report fails its job; a diligence report that reads like a pitch is worthless.

**Primary ICPs:** Startup founders (`pitch`) · Strategy professionals (`internal_approval`, `strategic_options`) · Sales-facing teams (`sales`).

---

## Sub-types, tiers, and validity

The rung is set by the **audience's willingness to pay**, not by ambition. See `document-taxonomy.md`.

| Sub-type | Display *(lingo layer)* | $15 | $80 | $300 | Audience |
|---|---|---|---|---|---|
| `pitch` | **Pitch Deck** | ✓ | ✓ | **✗** | investors, at a raise |
| `sales` | **Sales Deck** | ✗ | ✓ | ✗ | a prospective customer |
| `internal_approval` | **Board / Approval Paper** | ✗ | ✓ | ✓ | an internal approver |
| `strategic_options` | **Strategic Options Paper** | ✗ | ✓ | ✓ | an executive choosing a direction |

**`pitch` has no $300 tier by design.** Founders are the lowest-WTP ICP in the research (*"Research agencies want $30,000 minimum. I have $0 for research"* — `icp-personas.md` 5). Offering a $300 pitch would signal wrongly and sell nothing.

---

## How tiers extend

| Tier | Adds | Resolution — how far down the tree |
|---|---|---|
| **$15** *(pitch only)* | the case, tightly — the core questions, no modelling | claims asserted with a source |
| **$80** | the full case: evidence, alternatives, risks, the ask | **each alternative and risk profiled** — named and assessed, not just listed |
| **$300** | scenario modelling, stress-tested assumptions, sensitivity — board-grade | **each option modelled in full**, with the assumptions and sensitivities that determine whether it holds |

Resolution is the second axis at every tier (`00-resolution-map.md` § Tier semantics). Here it is most visible in the alternatives: a board paper that *lists* three options rejected is $80; one that works each of them is $300.

---

## The questions, by sub-type

### `pitch` — Pitch Deck
**Answers:** the market opportunity and its size, defensibly sourced · **why now** — what changed that makes this the moment · what the company does and the traction that proves it · the team and why they win · the ask: how much, and what it buys · the return story.
**Where relevant:** the competitive picture and the defensibility claim · unit economics where they exist · the go-to-market.
**Ceiling:** this argues the bull case. It does **not** stress-test its own TAM, model the downside, or perform diligence on its own claims — that is the investor's job (→ **Investment & Deal**). Nor does it write the founder's narrative *for* them: it is the evidence beneath the narrative.
**The discipline that matters most here:** every number must survive challenge in the room. Confident tone, conservative data. A founder who over-claims TAM loses credibility — and the research says investors probe exactly this number first.

### `sales` — Sales Deck
**Answers:** the customer's problem, in the customer's terms · the solution and how it fits their situation specifically · the value or ROI case, with numbers · proof — cases, references, evidence it has worked · the commercial ask and the next step.
**Where relevant:** what happens if they do nothing · how this compares to the alternative they are currently considering.
**Ceiling:** not a neutral product evaluation and not a competitor teardown (→ `competitive_landscape`). It advocates. It must not fabricate proof — claims that cannot be evidenced are cut, not softened.

### `internal_approval` — Board / Approval Paper
**Answers:** the proposal — precisely what is being approved · the rationale: why this, why now · costs and benefits with the numbers behind them · **the alternatives considered and why they were not chosen** · risks and how each is mitigated · the decision requested and the resources it needs.
**Where relevant:** what happens if the decision is deferred · dependencies and sequencing · who owns delivery.
**Ceiling ($80):** does not carry a full scenario model or sensitivity analysis. → **$300**.
**$300 adds:** modelled outcomes across scenarios, stress-tested assumptions, and the sensitivities that determine whether the case holds.
**The discipline:** an approval paper that omits the alternatives is advocacy without credibility. A board's first question is *"what else did you consider?"* — answering it pre-emptively is what separates a paper that gets approved from one that gets deferred.

### `strategic_options` — Strategic Options Paper
**Answers:** the decision that must be made, stated precisely · the realistic options — including, where honest, doing nothing · the criteria on which they should be judged · each option's trade-offs: upside, cost, risk, feasibility, and time to effect · a recommendation, with its reasoning visible.
**Where relevant:** what would have to be true for a rejected option to become the right one · the reversibility of each option · the window in which the decision stays open.
**Ceiling ($80):** recommends a direction without fully modelling each option's financials; execution planning is out of scope at every tier.
**$300 adds:** per-option financial modelling and sensitivity.
**Note on register:** for Strategy ICPs, §10.2's convention is *"the report does not recommend, it narrows."* Here the recommendation **is** the deliverable — but it is offered as the analyst's view for an executive to overrule, never as a decision taken on their behalf. Narrow first; recommend last; show the reasoning throughout.

---

## Register and content treatment

L0 (`§11`) governs absolutely. Within it:

**This type is advocacy — and advocacy in Caspr's voice means the argument is *carried by evidence*, never by adjectives.** The Trusted Senior Analyst does not sell; they lay out a case so clearly that the conclusion is obvious. Persuasion comes from the numbers and the structure of the reasoning, not from enthusiasm.

- **No adjectival inflation.** "Compelling", "exciting", "massive", "game-changing" are absent (`brand-guidelines.md` rejected list). A large market is described by its size, not by an adjective.
- **The ask is explicit and unhedged.** A business case that does not clearly state what it wants has failed. State it plainly, early, and once.
- **Conservative data, confident tone** — the pairing that survives challenge. Over-claiming is the single most credibility-destroying failure in this type.
- **Address the strongest counter-argument.** Advocacy that ignores the obvious objection reads as naive; advocacy that answers it reads as prepared. This is not hedging (`§11` still applies) — it is pre-empting.
- **Every claim is still cited.** Advocacy does not license unsourced numbers. The audience for all four sub-types is professionally sceptical.

**Bullets:** decks tempt fragmentation. `§11`'s list discipline applies in full — if items have a causal relationship, that relationship *is* the argument and belongs in prose. A pitch deck of disconnected bullets is not a case.

---

## ICP emphasis

| ICP | Lean into |
|---|---|
| Startups (§10.8) | `pitch` — TAM/SAM/SOM discipline, defensibility, runway, market timing; every number benchmarked because the investor will probe it |
| Strategy (§10.2) | `internal_approval`, `strategic_options` — capital allocation, strategic rationale, board-level framing, options narrowed |
| Consulting (§10.1) | findings that read directly onto a client slide; explicit "so what" |
| Agencies (§10.5) | `sales` — the tension the work resolves, the insight the case is built on |
| **Unknown (§10.9)** | plain professional English; state the ask and the evidence without assuming the reader's role |

---

## Visual

**Page system (L1a).** Master governs. **This type splits into two visual registers**, and treating them alike produces a bad version of each:

| | `pitch` · `sales` | `internal_approval` · `strategic_options` |
|---|---|---|
| Primary artefact | **deck-first** — `format-pptx.md` carries the load; the PDF is the read-along | **document-first** — PDF is primary; a deck summarises it, never replaces it |
| Density | **the sparsest output Caspr produces** — one dominant number per argument | moderate–high; the alternatives table is the credibility anchor |
| Governing feel | a case that reads as inevitable | a paper that survives cross-examination |

**Why `pitch` is the sparsest thing we make:** a crowded pitch slide reads as unconfident. Persuasion here comes from clarity — the callout stat (`§8`) does more work in this sub-type than anywhere else, and `§11`'s bullet discipline matters most precisely where the temptation to fragment is highest.

**Cover imagery.** `§4.3` still governs, but the subject shifts: the cover is **the market or opportunity being argued for**, not the company arguing. No logos, no product shots, no team photographs — `§4.3`'s no-people rule holds absolutely, and a founder photograph on a Caspr cover would break the register entirely.

**Component set (L1b).**

| Component | Use |
|---|---|
| **C4 Option Comparison** | `strategic_options` · `market_entry`-adjacent work. Criteria named **before** the table. **No composite scores, stars, or traffic lights** — reduction to one number hides the judgment that *is* the analysis |
| **C5 Risk Register** | `internal_approval` — with the "what would resolve it" column |
| **C3 Scenario** | at $300 — modelled outcomes with assumptions stated |
| Callout stat (`§8`) | heavy use in `pitch` / `sales`; one per top-level section still caps it |
| **The Signal** (`§9a`) | **rare, and never as proof of your own traction.** Category-level sentiment only. A sales deck citing forum opinion as evidence its product works is weak advocacy and reads as such |
| **C2 Divergence** | rare. Advocacy that surfaces a live disagreement usually should *resolve* it in prose. Legitimate in `internal_approval` where a board will encounter the conflicting figure anyway — better they meet it here first |
| **C1 Primary Data** | ✓ with an add-on — consumer validation behind a pitch is a strong use |

**The rule that governs all of it:** advocacy is carried by evidence, never by decoration. No colour, weight, or size is used to make a claim feel stronger than its source supports.

---

## Checklist additions

- [ ] The ask is stated explicitly and appears early
- [ ] Every number would survive challenge from a sceptical audience
- [ ] No adjectival inflation; the argument rests on evidence
- [ ] The strongest counter-argument is addressed, not avoided
- [ ] `internal_approval` / `strategic_options`: alternatives considered are present and honestly assessed
- [ ] `pitch`: TAM is defined as well as sized; sourcing survives scrutiny
- [ ] `sales`: no proof claimed that cannot be evidenced
- [ ] Advocacy has not licensed an uncited figure anywhere
- [ ] **No prescribed structure imported from this file**

---

*Owner: Joy · Engineering: Jayant · Layer 2 of `00-resolution-map.md`*
