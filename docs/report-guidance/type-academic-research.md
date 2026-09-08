# Type Guidance — Academic Research

*Layer 2 · Pass 1 (analysis) · `deliverable_type = academic_research`*
*Style identity: `academic` · Reads with `00-resolution-map.md`*
*Version 1.0 · 2026-08-19*

> **Outcome, not method.** States what must be answered, in what register, and where the ceiling is. Never prescribes a table of contents, a section order, which analyses to run, or which sources to use.

---

## What this type is — and what it deliberately is not

**One sub-type: `literature_synthesis`.** Synthesising the *scholarly* literature — what the research says, where it agrees, where it does not, and what it leaves open.

**This type is narrow on purpose.** A graduate student's other needs — industry primers for recruiting, market context, market sizing, case-competition research — are **Market Research at academic pricing**, not this type. "Academic" is mostly a *pricing and account attribute*; only the literature review is a genuinely different deliverable.

Getting this wrong would duplicate the entire Market Research catalogue under an academic label. It resolves cleanly: `icp = grad_researcher` + `deliverable_type = market_research` covers most academic use; this type covers the dissertation chapter.

**Gated on `/academic` going live** — academic pricing must be active in the product before this type is enabled (`pages-for-production.md`).

---

## Tiers, pricing, and validity

| Tier | Academic price | Standard price | Scope delivered | Edit credits included |
|---|---|---|---|---|
| Brief | **$8** | $15 | **identical to a standard Brief** | **15,000** |
| Study | **$40** | $80 | **identical to a standard Study** | **80,000** |
| Intelligence | — | $300 | **✗ not offered** | — |

### The discount is on the price. Nothing else. *(Joy, 2026-08-19)*

> **An Academic Study is a full Study.** Same analysis tree, same validation, same output base set, same 80,000 edit credits. The only difference is what it cost.

**No reduced-scope academic variant exists, and none may be introduced.** If Caspr is discounting for students, it discounts — it does not ship a quietly thinner product at a lower price and call it a discount. That would be discovered the first time a student compared their output with a colleague's, and it would cost more in trust than it saved in compute.

**Never ration content on academic-price grounds.** Where something should be rare in this type — a C9 discourse section, a callout stat — **the reason is methodological, never economic.** Cost pressure at $8 is a pricing question for `pricing-model.md` and Jayant's cost validation; it has no bearing on what the generation pipeline produces.

**No Intelligence tier** — deliberately withheld per the pricing model. This is a *scope* decision about the deliverable (a literature review does not benefit from multi-model challenge the way a diligence does), not a cost decision.

**On the economics, stated plainly so nobody is tempted to "fix" it in the product:** at $8, compute may exceed the sale. **That is accepted and intentional.** This ICP is an acquisition investment — *"each converting student is a pipeline investment in a future Professional- or Business-tier professional user"* (`icp-personas.md` 8). A thin or negative margin here is the strategy working, not a pricing error to be recovered by trimming the output.

---

## How tiers extend

| Tier | Adds |
|---|---|
| **Brief** $8 | the mapped, cited synthesis — what exists and what it says |
| **Study** $40 | critical appraisal of the literature's quality, deeper thematic synthesis, explicit research-gap framing |

---

## The questions

### `literature_synthesis` — Literature Review

**Answers:** what the existing scholarly literature says on the question · the main schools of thought and where the genuine debates lie · the seminal works and the recent ones, and **what each actually contributes** — not a chronological list · where consensus holds and where findings conflict · **the gaps the literature leaves open**.

**Where relevant:** the dominant methodologies and their known limitations · how the evidence base differs across geographies or populations · adjacent literatures that bear on the question.

**Ceiling (Brief $8):** a mapped, cited synthesis of what exists. It does **not** advance an original argument, deliver a deep methodological critique, or position the student's own contribution. → **Study**.

**Study ($40) adds:** critical appraisal — the *quality* of the evidence, not only its content: sample sizes, methodological weaknesses, replication status, where a widely-cited finding rests on thin foundations · deeper thematic synthesis across the literature · explicit framing of the research gap the student's work could address.

**Ceiling at every tier:** does not write the student's argument, formulate their research question, or design their study. It maps the territory so they can do those things.

---

## Register and content treatment

L0 (`§11`) governs, with the **one existing carve-out already written into it**:

> `§11`: *"**Exception:** Graduate researcher ICP (§10.6) permits calibrated uncertainty language where the evidence base is genuinely mixed."*

This type is where that exception does its real work. §10.6 states it precisely: ***"evidence suggests" rather than "evidence shows" is correct when the body of research is mixed.***

**This is the one type where acknowledged uncertainty is not a weakness but the point.** Everywhere else Caspr speaks in conclusions; here, overstating consensus that does not exist is the primary failure mode. A literature review that flattens a live academic debate into a confident summary is *wrong*, not merely cautious.

The carve-out is still scoped: calibration must attach to a **genuinely contested** finding. Where the literature is settled, say so plainly. Vague hedging to avoid commitment remains banned.

- **Attribution is the deliverable.** Every claim traces to a specific work. This is stricter than the standard citation rule (`§14`) — in academic work, unattributed synthesis is not a style issue, it is a misconduct issue.
- **Prefer peer-reviewed sources**, and say when a claim rests on something weaker. `§14`'s source-quality hierarchy places peer-reviewed research second overall; **for this type it ranks first.**
- **Represent disagreement as disagreement.** Where two credible bodies of work conflict, both are presented with their evidence. Do not adjudicate.
- **Recency matters differently here.** A 1987 paper may be foundational and current; a 2025 preprint may be unreplicated. Age is not quality — say which is which.
- **Findings-as-headers still applies** (`§6`) — but the finding may legitimately be about the *state of the evidence*: *"Embedded finance adoption in the 18–34 cohort is documented in six markets; the evidence base for behaviour beyond initial uptake remains thin"* (§10.6's own example).

### Completeness outranks concision here — and that is not a licence to pad

**Joy, 2026-08-19: in academic work, more information is usually better than less.** That sits in real tension with `§1` (*"white space is a feature. Density is friction"*) and `§11` (*"every word earns its place"*). The reconciliation is a clean split:

| | Holds | Yields |
|---|---|---|
| **Prose economy** (`§11`) | **holds in full** — no padding, no throat-clearing, no hedging to fill space | — |
| **Evidence completeness** | — | **yields to completeness.** A relevant study is never dropped because the section is already long; a reference list is never trimmed for page count |

**The distinction:** cut *words*, never *evidence*. A literature review that omits a contradictory study to stay tight has failed at the one thing it exists to do. A literature review padded with restated findings has failed a different way. Both are failures — they are not opposites to be traded off.

This is the same logic as `type-legal-document.md`'s *"precision outranks concision"*: the master's brevity preference bends where the deliverable's purpose demands it, while the ban on padding never does.

### Academic integrity — a RULE

The report **sources the literature; the student writes their own analysis and cites the underlying works, not Caspr.** This is exactly the objection §10.6 and `icp-personas.md` 8 anticipate — *"Is this allowed for my dissertation?"* — and the honest answer is that Caspr occupies the same category as IBISWorld, Scopus, or a library database.

Two obligations follow:
- The output must be **usable as input, not submittable as output.** It maps and cites; it does not produce prose designed to be pasted into a dissertation.
- Bibliographic detail must be **complete enough to cite the original** — the student cites the source, never Caspr.

---

## ICP emphasis

| ICP | Lean into |
|---|---|
| **Grad researchers (§10.6)** | the primary and near-exclusive audience — literature synthesis, theoretical framework, empirical evidence, research gap, limitations, contested findings. **Lead metric: the state of the evidence** — what is known, what is contested, what is genuinely unknown and therefore researchable |
| Market Research professionals | occasionally use literature synthesis as pre-fieldwork grounding — **no §10 profile exists**, resolves to §10.9 (logged drift) |
| **Unknown (§10.9)** | plain professional English; explain the state of the evidence without assuming academic conventions |

---

## Visual

**Page system (L1a).** Master governs, at Brief or Study tier. **No Intelligence tier exists**, so `tier-intelligence.md` never loads for this type.

**Density: moderate prose, but citation density far above every other type.** `§14`'s three layers hold and inline superscripts will run heavy. **That is correct and must never be thinned for aesthetics** — in academic work, sparse attribution is not a cleaner page, it is a weaker document.

**The References section is the backbone, not an appendix.** It is the part of the deliverable the reader will use most, because they cite the originals rather than Caspr. Entries must be complete enough to locate the source. It is never truncated, never abbreviated to save pages, and — unlike every other type — **it may legitimately run to a significant share of the document.**

**Cover imagery.** `§4.3`'s register holds — restrained, dark-treated, no people. But this is the type where its *industrial infrastructure* default fits worst: a literature review on labour-market policy has no plant or port. **Prefer the subject's real-world domain over a forced industrial scene**, and where no honest image exists, a restrained typographic cover is better than an irrelevant photograph. Flagged as the one `§4.3` gap this type exposes.

**Component set (L1b).**

| Component | Use |
|---|---|
| Evidence tables (`§9`) | comparing studies — design, sample, finding, limitation. The workhorse here |
| **C2 Divergence** | **near-essential, and the exception to its Intelligence-only default.** Contested findings are not an edge case in a literature review — **mapping where the literature disagrees *is* the deliverable.** Permitted at both tiers |
| Callout stat (`§8`) | sparingly — a single figure rarely carries a literature review, and over-using it implies more certainty than the evidence supports |
| **The Signal** (`§9a`) | ✓ *(un-banned 2026-08-19)* — as a callout, where public mood is context alongside the cited literature. **Never as evidence that a claim is true** |
| **C9 Discourse Analysis** | ✓✓ **this type's most likely home.** Where public discourse is itself the object of study, escalate from callout to section — with corpus, method, and the mandatory non-representativeness statement |
| Charts (`§13`) | where the *pattern* across studies is the finding; not to decorate a synthesis |
| **C1 Primary Data** | ✓ with an add-on, though rare at this tier |

**Brief tier** uses `brief-design-v2.md`; its *"A Study on [topic] would cover…"* upsell line applies, adapted honestly to what the $40 Study adds — critical appraisal and gap framing.

---

## Checklist additions

- [ ] Every claim attributed to a specific work *(RULE — stricter than §14)*
- [ ] Bibliographic detail complete enough to cite the original source
- [ ] Contested findings presented as contested; consensus stated plainly where it exists
- [ ] Calibrated uncertainty attaches to genuinely mixed evidence — not used as general hedging
- [ ] Peer-reviewed sources preferred; weaker sources flagged as such
- [ ] Foundational vs unreplicated distinguished — age not treated as quality
- [ ] Output reads as **input to the student's work**, not as submittable prose
- [ ] Study tier: methodological quality appraised, not just content summarised
- [ ] Sentiment, where present, is treated as an **object of study or context — never as evidence a claim is true**
- [ ] Where sentiment is the object of study, it is a **C9 section, not a callout** — and carries corpus, timeframe, classification method
- [ ] **C9: the non-representativeness statement is present and prominent** *(RULE — never a footnote)*
- [ ] Where the literature is contested, a Divergence block or equivalent treatment carries it — disagreement is not flattened into a summary
- [ ] References complete and untruncated; citation density not thinned for page count
- [ ] **No prescribed structure imported from this file**

---

*Owner: Joy · Engineering: Jayant · Layer 2 of `00-resolution-map.md`*
