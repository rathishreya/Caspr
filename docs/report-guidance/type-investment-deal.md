# Type Guidance — Investment & Deal

*Layer 2 · Pass 1 (analysis) · `deliverable_type = investment_deal`*
*Style identity: `analytical` · Reads with `00-resolution-map.md`*
*Version 1.0 · 2026-08-19*

> **Outcome, not method.** States what must be answered, in what register, and where the ceiling is. Never prescribes a table of contents, a section order, which analyses to run, or which sources to use.

---

## What this type is

**The investor's decision.** Whether to look at a space, build a thesis in it, or buy a specific company.

This is Caspr's **highest-WTP, highest-defensibility type.** The research is unambiguous: investors already pay $25k/yr for PitchBook, $5–15k per commissioned report, and reference a *$100k invoice* for the diligence work this replaces (`icp-personas.md` 3, `icp-copy.md` 3). A $300 Diligence sits 30–300× below the alternative. Price is not the objection here — **credibility is.** Everything below serves that.

**The mirror rule:** the sceptical counterpart to **Business Case**. Where a pitch argues *back me*, this asks *should I?* — and the answer must be allowed to be no.

**Primary ICPs:** Investors (PE / VC / hedge funds / family offices) — the **financial acquirer**, §10.3 · Corporate Development — the **strategic acquirer**, §10.7. See § ICP emphasis; the distinction drives vocabulary and lead metric.

---

## Subjects, tiers, and validity

The **subject** is the sub-type (WHAT). The **stage** is the tier (HOW DEEP) — and stage, depth, and price are one axis here.

| Subject ↓ / Tier → | **$15 · Screen** | **$80 · Thesis** | **$300 · Diligence** |
|---|---|---|---|
| `sector` | Sector Screen | Sector Thesis | *(rare — deep sector diligence)* |
| `company` | Target Screen | **Investment Thesis / IC Memo** | **Due Diligence (DD)** |

Canonical tier slugs remain `brief` · `study` · `intelligence`; *Screen · Thesis · Diligence* are **display names** resolved through the lingo layer (`document-taxonomy.md`). Investors say "DD" and "IC memo" — the display layer must surface those words, not the internal slugs.

**The tier decision that defines this type:** Thesis and Diligence are **tiers of the same subject, not different deliverables.** The deal process flows screen → thesis → diligence, and each stage goes deeper on the same company. What changes across them is not the topic but the **burden of proof**.

---

## How tiers extend — the burden of proof

| Tier | Question | Posture | Resolution — how far down the tree |
|---|---|---|---|
| **Screen** $15 | *"Is this worth my time?"* | fast triage — enough to pass or proceed | headline risks and comparables named, not worked |
| **Thesis** $80 | *"What is the case, and what would have to be true?"* | **constructive** — builds the argument | each value driver and risk profiled |
| **Diligence** $300 | *"Does the case survive contact with the evidence?"* | **adversarial** — tries to break it | **each driver, risk, and comparable analysed in full** — customer concentration examined, not listed |

Resolution is the second axis at every tier (`00-resolution-map.md` § Tier semantics). At Diligence it is as load-bearing as the adversarial posture: a risk register that *names* ten risks is a Screen output; one that works each of the ten — what it would mean, what would resolve it — is what $300 buys.

**Thesis argues. Diligence verifies.** A Diligence that simply restates the thesis at greater length has failed — its job is to attack the thesis and report what survived.

---

## The questions, by cell

### `sector` · Screen — $15
**Answers:** what the space is and its size · **is capital actively flowing in, or has the window passed** · who is investing and at what stage · valuation benchmarks where data exists — revenue multiples for SaaS, EBITDA multiples for PE — and how they have moved · notable exits and what they returned · the headwinds that would compress valuations or slow activity.
**Where relevant:** early signals of category convergence or platform risk · regulatory tailwinds or headwinds specific to the sector · whether a clear leader is emerging or the market remains open.
**Ceiling:** does not build a thesis, recommend deployment, or assess any specific company. → **Thesis**.

### `sector` · Thesis — $80
**Adds:** a defensible point of view on **whether and where to deploy** · the sub-segments that merit focus and why · timing — why now, and what closes the window · the thesis stated plainly, with the two or three things that would have to be true · the risks that would invalidate it.
**Ceiling:** does not assess named targets against the thesis (→ `company`), or model returns.

### `company` · Screen — $15
**Answers:** what the company does and how it makes money · scale and financial trajectory from the public record · **what an acquirer would actually be buying** — technology, customers, market position, or team · its competitive position: leader, challenger, or defensible niche · the 3–4 most important risks a buyer must investigate.
**Where relevant:** stated ambitions of current owners · signs of prior M&A interest (rumoured approaches, banker mandates in the press) · integration complexity signals (tech stack, geography, culture).
**Ceiling:** does not value the business, model synergies, recommend a price, verify any claim, or replace diligence. It answers one question: **is this worth a serious look?** → **Thesis / Diligence**.

### `company` · Thesis / IC Memo — $80
**Adds:** the investment thesis — why this asset, why now, and where value is created · a valuation view and entry benchmarks against comparable transactions · the return story and the two or three variables that actually drive it · the bull case and the bear case, both argued honestly · **what would have to be true** for the thesis to hold.
**Where relevant:** management team quality against the public record · the exit paths and who the eventual buyers are.
**Ceiling:** built on public and user-provided data, argued constructively. It does **not** adversarially verify its own claims, assess quality of earnings, or resolve what only privileged access can resolve. → **Diligence**.

### `company` · Diligence / DD — $300
**Adds:** **adversarial verification of the thesis** — each load-bearing claim tested against the evidence, and the ones that do not survive reported as such · deep risk assessment: customer concentration, key-person dependency, IP exposure, regulatory and licensing risk, quality-of-earnings signals · multi-model challenge and cross-source triangulation, with disagreement surfaced rather than resolved by averaging · **the red flags a buyer must resolve before proceeding** · explicitly, **what remains unknowable from outside the data room**.
**Ceiling:** not a financial audit, not a fairness opinion, not a legal opinion (→ **Legal Document**, itself a draft for counsel). Confirmation of private data requires uploads — Data Room files or a Primary-data add-on. It informs the decision; it does not make it.
**The failure mode to design against:** a Diligence that reads as confident about everything. Its credibility comes precisely from naming what it could not verify.

---

## Register and content treatment

L0 (`§11`) governs absolutely. Within it:

**This is the type where scepticism is the product.** Investors are professionally trained to find the hole in an argument; a report that hides its weak points is discovered and discarded. Caspr's advantage here is that it can afford to be honest — it has no deal to win.

- **Lead metric is the return.** §10.3's convention holds: every major section answers *"what does this mean for the return?"* Findings that do not touch the return profile or a risk to it are cut.
- **Uncertainty is stated as scope, not as hedge.** ✗ *"Revenue may be around $40m."* ✓ *"Public filings put revenue at $38–42m; the range reflects two reporting bases, and the difference is not material to the entry multiple."* This is `§11`'s *"hedge the conditions, not the findings"* rule doing its most important work.
- **Say what you could not establish.** A named gap is a credibility asset. An unnamed gap is a landmine. This is a **RULE** at Diligence tier.
- **Never invent a valuation.** Where comparables are thin, say the comparables are thin. A fabricated multiple is the single most damaging possible output of this type.
- **The bear case is written with the same rigour as the bull case.** An IC memo where the bear case is a token paragraph is not an IC memo.
- **A "no" is a valid and valuable output.** Screens exist to kill deals cheaply. A screen that never concludes "not worth pursuing" is not screening.

**On user-uploaded data (Data Room):** where private files inform the analysis, the report must distinguish public-record findings from findings resting on provided material — the reader needs to know which claims a third party can verify. This also drives `provenance = includes_private` and the shareability gate (`document-taxonomy.md`).

---

## ICP emphasis

**This type serves two different buyers, and the difference is not cosmetic** (Joy, 2026-08-19). Same questions, same output shape — **different lead metric and vocabulary.** Getting this wrong is immediately obvious to the reader.

| Lens | ICP | The question every finding serves | Lean into |
|---|---|---|---|
| **Financial acquirer** | **Investors (§10.3)** — the primary audience | *"what does this do to the return?"* | EBITDA, exit multiple, deal thesis, comparable transactions, IRR, entry multiple, exit path, defensibility. The asset is judged standing alone |
| **Strategic acquirer** | **Corporate Development (§10.7)** — a strategy function that buys | *"what does this do to* ***us*** *?"* | synergies (revenue and cost), capability gap, integration complexity, adjacency, build/buy/partner, accretive-to-the-business. Value is created by the **combination**, not the asset |

**Never mix the two registers.** Synergy language in a financial return thesis is wrong; IRR-and-exit framing for a corp dev team that will integrate and hold is equally wrong. A target can be a poor financial buy and an excellent strategic one — the report must know which question it is answering.
| Strategy (§10.2) | where an acquisition is one of several strategic options — implications for the organisation |
| Consulting (§10.1) | commercial diligence framing for a client |
| **Unknown (§10.9)** | plain professional English; the return logic explained without assuming fluency in fund vocabulary |

---

## Visual

**Page system (L1a).** Master governs; **Diligence is Intelligence tier** → `tier-intelligence.md` overlays, including the cover capability row (`§4.2`) and the deeper analysis tree (§3.0 there).

**Density: the highest of any type.** Investors read exhibits first and prose second — the moderate white-space balance that suits Market Research under-serves them. Screen stays moderate (fast triage), Thesis runs high, Diligence highest. **This is the one type where `§9`'s two-column layout (55/45) should be the default rather than the exception**, because almost every argument here has a number beside it.

**Table discipline matters more here than anywhere.** Comparables, multiples, and risk registers are the deliverable. `§9` in full: black header row, banding from white, outer border only, **one key figure per table**, mandatory source line. The temptation at this density is to highlight three figures per table — that is exactly when highlighting stops meaning anything.

**Cover imagery.** `§4.3` sector logic, keyed to **the target's or sector's world** — never generic finance stock (a trading floor, a rising chart, a handshake). For a `company` subject, the industry the company operates in, not a corporate HQ.

**Component set (L1b).**

| Component | Use |
|---|---|
| **C6 Position Pair** | Thesis — bull / bear. **Equal visual weight is the spec**: an asymmetric layout announces the conclusion before the reader has read either side. Both columns cite |
| **C5 Risk Register** | Screen (named) → Diligence (worked). The "what would resolve it" column is what makes it a register. **No probability×impact heat maps** — manufactured precision on unquantifiable risk is the failure this type exists to avoid |
| **C3 Scenario** | Thesis+ — base case is the single highlighted series, all others grey |
| **C2 Divergence** | **core at Diligence** — where sources or models disagree on a valuation input, that disagreement *is* the finding. `tier-intelligence.md §4` |
| **The Signal** (`§9a`) | ✓ — sentiment on a target moves before filings do, which is genuinely leading intelligence for this reader |
| **C1 Primary Data** | ✓ with an add-on — customer-sentiment validation on a target is a strong commercial-diligence use |

**One treatment specific to this type:** where findings rest on **user-uploaded Data Room material**, they must be visually distinguishable from public-record findings — the reader needs to know which claims a third party can independently verify. Use the `§14` Layer 1 source tag naming the provided document. This also drives `provenance = includes_private` and the shareability gate (`document-taxonomy.md` Facet 9).
- **Data density is high and legitimate here** — comparables, multiples, risk registers. Table discipline (`§9`) matters more than in any other type: one key figure per table, mandatory source line, no cell-background highlights.
- **Cover imagery** follows §4.3's sector logic — the target's or sector's world, never generic finance stock.

---

## Checklist additions

- [ ] Every section advances the thesis or identifies a risk that modifies it
- [ ] **Diligence: each load-bearing thesis claim is explicitly tested, and failures are reported**
- [ ] **Diligence: what could not be verified is named** *(RULE)*
- [ ] Bear case carries the same rigour as the bull case
- [ ] No valuation or multiple asserted beyond what the comparables support
- [ ] Findings resting on user-provided data are distinguishable from public-record findings
- [ ] Screen tiers are genuinely capable of concluding "not worth pursuing"
- [ ] Where sources or models disagree, the disagreement is shown, not averaged
- [ ] **No prescribed structure imported from this file**

---

*Owner: Joy · Engineering: Jayant · Layer 2 of `00-resolution-map.md`*
