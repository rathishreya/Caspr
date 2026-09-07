# Caspr — Website Copy Deck

**Step 1 deliverable.** Per [`website-session-prompt.md`](website-session-prompt.md). Not Figma edits, not live
edits. Joy approves this before anything moves.

*Pass 1 — 2026-08-20. Covers the homepage, `/pricing`, and the full ICP system (8 pages). `/enterprise`,
`/security` and `/about` carry their headlines here; their body copy is pass 2.*

---

# A · Sources opened (rule 1)

| File | What I read | Weight |
|---|---|---|
| `.agents/icp-personas.md` | **The Persona** and **Pain Points — In Their Own Language** for all eight ICPs, in full (~19KB of the 76KB). Not the trigger tables | **Primary** |
| `.agents/icp-copy.md` **v3** | Complete. The eight approved heroes, their sources and copy notes | Approved — used as written |
| `docs/site-truth.md` | Complete, re-read after this session's §1.0 edit | Binding |
| `.agents/brand-guidelines.md` | Complete | Binding on voice |
| `.agents/product-marketing-context.md` | §5 competitive, §8 objections, §10 switching dynamics, §11 customer language | Context |
| `docs/phase-b-fold-map.md` · `docs/website-workplan.md` · `docs/website-copy-step2.md` | Complete — I wrote them earlier this session | Structure / re-judge |
| `.agents/pricing-model.md` | §4.6, §5, §6, §14, §15 | Binding on facts |
| `CLAUDE.md` | Complete, including the tiered approved-copy list | Binding |
| **Live site** `new.caspr.ai` | Homepage, `/pricing`, `/consulting`, `/academic` in full; all ICP heroes; `/security`, `/about`, `/enterprise` copy extracted | Evidence |
| **Figma** `rmurwf7WT9B4kKhXcju3ro` | All 16 page designs, section by section, this session | Evidence |

**Read but not relied on:** `.agents/website-visual-design-guidelines.md` and `.agents/website-architecture.md`
— opened for scope, but they bind the *Figma* step, not the copy. Flagged so the gap is visible rather than
silent. `.agents/security-posture.md` is **not yet read**; `/security` body copy is deferred to pass 2 for that
reason.

---

# B · Keep / depart (rule 4)

## Kept from the live site — because it is better than a replacement

| Kept | Why |
|---|---|
| `/academic` hero — *"Your library closed at 9pm. Your case brief doesn't care."* | The best line on the site. From `icp-personas.md:709`. Approved to stay |
| `/agencies` hero — *"Know your client's industry better than they do. Every time. Before the briefing."* | Near-verbatim from `:356`. `icp-copy.md` v3 could not beat it |
| Homepage **How It Works** 01/02/03 body | Concrete, second person, no padding. Only the source count changes |
| Homepage **Engine** — *"Built to reason. Not just retrieve."* | Asserts the category without naming the other one. Survives rule 1 unchanged |
| **Testimonials** headline — *"For decisions that can't afford to be wrong."* | Earns its place. The quotes beneath it do not (§H) |
| `/pricing` hero — *"One budget. Every analysis you need."* | Still true under the new ladder |
| Final CTA — *"Caspr means Business."* / *"Your first $100. On us."* | The tagline doing its job at the last moment |

## Departed from — with reasons

| Departed | Why |
|---|---|
| Homepage **Category Claim** — *"Generative AI writes. Analytical AI analyses."* | **Names the LLM category in a homepage headline.** Rule 1 forbids it. See §G-1 — this is the single biggest change in the deck |
| Homepage pricing — *"The $50,000 question. From $15."* | A 600× gap reads as implausible, and disbelief sends the reader back to the $20/month anchor. Cost also leads, against rule 3 |
| Hero microcopy — *"Zero hallucinations"* | Retired. An absolute is the most attackable claim available |
| Hero microcopy — *"1M+ curated sources"* | Wrong. **25M+** |
| ICP hero **stat rows** (`1M+ / <15 min / 100 pages`) | Repeat the headline and displace the security micro-copy, which is the only inbound link to `/security` from those pages |
| Engine stat — *"Zero / hallucinations"* | Same retirement. Replaced |
| `/pricing` **Analysis Types** as three products | They are three price points with type-dependent names. `site-truth` §2 |
| **`"15 minutes. 100 pages. Cited to source."` as a lead** | Demoted, not deleted. It moves to How It Works, where speed is a supporting fact |

---

# C · Layer 1 — every eyebrow on the site

Read as one set. They are labels, not sentences: flat, plain, no wit. The wit lives in the headline beneath.

| Page | Eyebrows in order |
|---|---|
| **Homepage** | — · `TRUSTED BY` · `HOW IT WORKS` · `THE ENGINE` · `MULTILINGUAL BY DEFAULT` · `WHAT RESEARCH COSTS` · `PLANS & PRICING` · `FROM THE FIELD` · `WHAT ARRIVES` · — |
| **`/pricing`** | `PLANS & PRICING` · `WHAT RESEARCH COSTS` · `RESEARCH BUDGET` · `OVER TIME` · `WHAT YOU GET` · `FREQUENTLY ASKED` · `FOR ENTERPRISE` · `GET STARTED` |
| **ICP pages** | `FOR [SEGMENT]` · `THE PROBLEM` · `HOW IT WORKS` · — *(showcase)* · `WRITTEN IN YOUR REGISTER` · `WHAT RESEARCH COSTS` · `WHAT YOU CAN RUN` · `WHAT ARRIVES` · `FROM THE FIELD` · `WHY PROFESSIONALS TRUST CASPR` · `FREQUENTLY ASKED` · `GET STARTED` |
| **`/enterprise`** | `ENTERPRISE` · `WHAT ENTERPRISE UNLOCKS` · `ENTERPRISE PLAN` · `OPTIONAL` · `WHAT ENTERPRISE TEAMS SAY` · `GET STARTED` |
| **`/security`** | `SECURITY` · `INDEPENDENTLY AUDITED` · `YOUR DATA ROOM` · `ZERO TRAINING` · `RETENTION & DELETION` · `FREQUENTLY ASKED` · `GET STARTED` |
| **`/about`** | `ABOUT CASPR` · `THE STORY` · `WHAT CASPR IS` · `WHY WE EXIST` · `GET STARTED` |

**Two changes.** `A NEW CATEGORY` → **`WHAT ARRIVES`** (§G-1). ICP `ANALYST-GRADE OUTPUT` → **`WHAT YOU CAN RUN`**,
because that fold is now a use-case block, not a price strip.

---

# D · Layer 2 — every headline on the site, read as one list

The judging artefact. Read top to bottom before reading anything else.

| # | Page · Fold | Headline | Source |
|---|---|---|---|
| 1 | **Home** · Hero | **Not an assistant. An analyst.** | `site-truth` §1.0 — locked |
| 2 | Home · How It Works | One prompt. Boardroom-ready output. | live — kept |
| 3 | Home · Engine | Built to reason. Not just retrieve. | live — kept |
| 4 | Home · Multilingual | Written in your language. Not translated into it. | `website-copy-step2.md` — approved |
| 5 | Home · What research costs | Buy the report. Commission the study. Or ask the question. | NEW — §G-2 |
| 6 | Home · Pricing | One budget. Three depths of answer. | NEW — replaces the $50,000 line |
| 7 | Home · Testimonials | For decisions that can't afford to be wrong. | live — kept |
| 8 | Home · What arrives | Every source, credible. Every claim, triangulated. Every report, defensible. | `site-truth` §1.0 — the locked proof, promoted to a fold |
| 9 | Home · Final CTA | Caspr means Business. | live — kept |
| 10 | **`/pricing`** · Hero | One budget. Every analysis you need. | live — kept |
| 11 | `/pricing` · What research costs | The same answer, three ways to buy it. | NEW |
| 12 | `/pricing` · Research Budget | Institutional analysis. Without the institutional price. | live — kept |
| 13 | `/pricing` · Over time | The tenth analysis is better than the first. | Figma draft — **KEEP**, §F |
| 14 | `/pricing` · What you get | Three levels of analysis. One Research Budget. | live — kept |
| 15 | `/pricing` · FAQ | The Research Budget, explained. | live — kept |
| 16 | `/pricing` · **Org** | One Research Budget. Shared across your team. | **name updated 2026-08-26** |
| 17 | **`/consulting`** · Hero | "Four hours of research. Three usable numbers." | `icp-copy.md` v3 — approved |
| 18 | **`/strategy`** · Hero | "You know exactly what analysis you need. That was never the problem." | v3 — approved |
| 19 | **`/investors`** · Hero | "You were hired to evaluate businesses. Not to be a research librarian." | v3 — approved |
| 20 | **`/agencies`** · Hero | Know your client's industry better than they do. Every time. Before the briefing. | v3 — live retained |
| 21 | **`/startups`** · Hero | "Two weeks on the market size slide. It still won't survive the question." | v3 — approved |
| 22 | **`/market-research`** · Hero | "You research for a living. You still have to research before you can research." | v3 — approved |
| 23 | **`/category-managers`** · Hero | "The only independent research in your category was paid for by a supplier." | v3 — approved |
| 24 | **`/academic`** · Hero | Your library closed at 9pm. Your case brief doesn't care. | v3 — live retained |
| 25–32 | ICP · The problem | *eight distinct — see §E-3* | `icp-personas.md`, per ICP |
| 33 | ICP · Your register | It reads like your team wrote it. | Figma draft — **KEEP**, §F |
| 34 | ICP · What arrives | Every source, credible. Every claim, triangulated. Every report, defensible. | locked proof — shared |
| 35 | **`/enterprise`** · Hero | Institutional-quality analysis, at institutional scale. | live — kept |
| 36 | **`/security`** · Hero | Your analysis is yours. Full stop. | live — kept |
| 37 | **`/about`** · Hero | Built by the analyst who spent 15 years producing exactly this kind of analysis. | live — kept |

**Reading the list.** Rows 17–24 are eight different sentence shapes: arithmetic · a concession · a status
insult · an instruction · a duration · a paradox · an accusation · a closed door. That is the test the previous
attempt failed. Rows 1, 8 and 34 repeat the locked stack deliberately — the identity opens the site, the proof
closes each argument.

---

# E · The pages

## E-1 · Homepage

### Home · Hero — KEEP (locked)
**Headline:** Not an assistant. An analyst.
**Body:** Any question your board will ask — answered, sourced, and ready before they ask it.
**Microcopy:** `No credit card · 25M+ curated sources · From $15`
**CTA:** **Run the analysis** · secondary: See a sample report →  *(set 2026-08-25 — [`entry-routes-and-cta.md`](entry-routes-and-cta.md))*
**Source:** `site-truth` §1.0, locked 2026-08-20.
**Note:** `1M+`→`25M+`, "Zero hallucinations" deleted, `From $15` sits in microcopy — the three corrections ship together.

### Home · Trusted by — KEEP
**Eyebrow:** TRUSTED BY · logos unchanged.
**Note:** Placeholders. Blocked (§H).

### Home · How It Works — EDIT
**Eyebrow:** HOW IT WORKS
**Headline:** One prompt. Boardroom-ready output.
**Support:** **15 minutes. 100 pages. Cited to source.**
**01 You ask** — One line. Any business topic. Caspr proposes a structured layout and asks targeted clarifying questions.
**02 Caspr analyses** — Caspr reasons through 25M+ curated sources — government databases, academic papers, news feeds, financial reports. Every conclusion built from evidence, not pattern-matching.
**03 You present** — A boardroom-ready PDF or editable PPTX — structured, cited, and ready to present. In under 15 minutes.
**Source:** live copy, retained. Support line relocated per `site-truth` §1.0.
**Note:** This is where the demoted line now lives. As a supporting fact it is true and useful; as a position it was carrying weight it cannot hold.

### Home · The Engine — EDIT
**Eyebrow:** THE ENGINE
**Headline:** Built to reason. Not just retrieve.
**Support:** Two proprietary systems. One output you can defend.
**Weigh — every claim, triangulated.** Not retrieval — reasoning. Caspr structures your question, applies analytical frameworks, and interprets data the way a senior consultant would. Every conclusion is built from evidence.
**Source — every source, credible. 25M+ curated sources.** Real-time feeds from government databases, academic papers, financial reports and news sources. Every source vetted. Your analysis reflects today's reality, not training data from two years ago.
**Stat row:** `25M+ / curated sources` · `Real-time / live data pipelines` · `Every figure / attributed to a named source`
**Source:** live copy. Third stat replaces "Zero / hallucinations".
**Note:** The replacement stat states what *is* there rather than what is absent. An absolute negative invites one counter-example to break it.

### Home · Multilingual — KEEP
**Eyebrow:** MULTILINGUAL BY DEFAULT
**Headline:** Written in your language. Not translated into it.
**Body:** Caspr reasons and writes in your working language. The structure, the vocabulary and the conclusions are native to it — not produced in English and passed through a translator.
Where a translation pipeline demonstrably outperforms native generation, we use that instead. The test is the output, not the method.
**Source:** `website-copy-step2.md`, approved. **Re-judged against §3: passes.** No competitor named, no reader labour assigned, no cost.

### Home · What research costs — NEW · ✅ **figures landed 2026-08-26**
**Eyebrow:** WHAT RESEARCH COSTS
**Headline:** Buy the report. Commission the study. Or ask the question.
**Body:** An off-the-shelf report answers the question its publisher chose. A commissioned study answers yours, eventually. Caspr answers yours today.
**Table:**

| | Off-the-shelf report | Commissioned study | **Caspr** |
|---|---|---|---|
| **The question** | The publisher's | Yours | **Yours** |
| **The data** | *Mordor, AI clinical documentation: published Apr 2026* · *IBISWorld, US EV charging: published **Jul 2024**, on sale today* | Fielded for you | **87% of sources dated 2025–26** |
| **The wait** | Immediate | Weeks | **15 minutes** |
| **The cost** | **$4,750** single user · $8,490 enterprise, same document | Drive Research **states** $20,000–50,000 for a custom project | **$80** |

*Figures read from each seller's own page. Mordor and IBISWorld observed 2026-08-24/25 — [`od-10-results.md`](od-10-results.md) §1. **The $20,000–50,000 is a claim by a named firm, not a market fact** — §4 there.*
**Row labels:** The question · The data · The wait · The cost
**CTA:** See the full comparison →
**Source:** `site-truth` §1.2–1.4.
**Note:** Cost is the last row, not the first. The headline sells the *choice*, not the discount — the reader arrives at the price having already accepted the frame. ~~Nothing ships until OD-10 lands.~~ **OD-10 landed 2026-08-25** — figures in [`od-10-results.md`](od-10-results.md) §2. **Every figure must carry its currency and observation date** (§1.3 there: the Statista page geo-localises).

### Home · Pricing — EDIT
**Eyebrow:** PLANS & PRICING
**Headline:** One budget. Three depths of answer.
**Body:** Set a monthly Research Budget. Run what you need against it. **Unused balance carries forward, and each month restores only what you consumed.**
**⚠ Swept 2026-08-26 · `COPY-11b`.** Previously ended *"you are never charged for value you did not receive."* **That is false** — `R = F + top_up`, and the platform fee is charged monthly regardless of use ($14 on a $200 budget at zero consumption). **Permitted phrasings only:** *unused balance carries forward* · *each month restores only what you consumed* · *a quiet month costs far less than a busy one*.
**Microcopy:** Your first $100 is on Caspr — no credit card.
**Note:** Replaces *"The $50,000 question. From $15."* The gap claim moves to the comparison fold above, where it is cited rather than asserted.

### Home · Testimonials — KEEP
**Headline:** For decisions that can't afford to be wrong.
**Note:** Quotes are invented placeholders. Blocked (§H).

### Home · What arrives — **REPLACES Category Claim** · §G-1
**Eyebrow:** WHAT ARRIVES
**Headline:** Every source, credible. Every claim, triangulated. Every report, defensible.
**Body:** Caspr does not hand you a summary and leave the judgment to you. It reads the market, reconciles what the sources disagree on, weighs the alternatives, and reaches a conclusion — with the evidence attached to it.
**Source:** `site-truth` §1.0, the locked proof line.
**Note:** The generative contrast that used to occupy this fold moves to `/vs/*` in full. See §G-1.

### Home · Sourcing — NEW · **the strongest claim this corpus earns**
**Eyebrow:** EVERY SOURCE, NAMED
**Headline:** When the room asks where the number came from, the answer is already on the page.
**Body:** Not a methodology note at the back. The source, on the claim, everywhere a claim is made — **355 to 678 of them in a single analysis.**
**Proof row:** `3,060 sources across 23 analyses · 87% dated 2025–26`
**Source:** [`report-evaluation-2026-08.md`](report-evaluation-2026-08.md) §10.2.
**Note:** ⚠ **Register check — this is deliberately not framed as verification.** Positioning rule 2 forbids selling the reader labour: the line answers *"when the room asks"*, never *"so you can check us."* The per-report figure is used live on `/samples`, taken from the report on screen.

---

## ✅ CLAIMS REGISTER — what this corpus earns, and what it does not

*Added 2026-08-26 from the 23-report evaluation. **A claim is usable here only if it is demonstrated in a named
output, survives the comparison stated fairly, repeats across at least two analyses, and has a known
boundary** — [`report-evaluation-rubric.md`](report-evaluation-rubric.md) §5.*

### May be used

| Claim | Evidence | Boundary |
|---|---|---|
| **Every source named, claim by claim** | 355–678 per report · 3,060 across 23 · **human-verified before delivery** | None found. **The strongest thing we own** |
| **Sources are current** | **87% of dated references are 2025–26** | **Gulf healthcare has zero dated references** — do not use that report as the example |
| **A Study reconciles conflicting sources** | Saudi valves · UK ready meals · AI clinical documentation — **three outputs** | ⚠ **Say "a Study."** The Brief did not do it — evaluation §2 |
| **The answer goes below the publisher's level of definition** | Premium ready meals, **Southeast England** — the incumbent segments ten countries | **One output.** Use as a demonstration, not as a general property |
| **$80 against $4,750** | Read from Mordor's own page, 2026-08-24 | **Third act, never the hook** — §9.4 |

### ⛔ May not be used

| | Why |
|---|---|
| **"Every claim, triangulated"** — unqualified | **The Brief did not.** True of a Study; not yet an unconditional property. Now a spec expectation at every tier (`report-guidance/report-style-guide.md` §9b), so it is re-testable on the next corpus |
| **Any comparison led by price** | The one case where price led — US EV charging — is the one we lose. **Lead with the question the $4,750 report does not answer** |
| **Anything about EV charging** | That analysis failed its own answer key and is **not published in any form** — evaluation §6, §9.3 |
| **"Verify", "check the working", "audit it yourself"** | Positioning rule 2. **Unchanged, and the sourcing fold above is written to obey it** |

### ⚠ Counsel-gated — drafted, not cleared

**These are factual, dated and adjective-free. They are also comparative, and the first comparative claim
requires counsel** (open decision, `guerrilla-campaign-plan.md`):

| Draft line | Basis |
|---|---|
| *"The report we compared this against was published in July 2024. It is still on sale."* | IBISWorld product page, observed 2026-08-25 |
| *"That report's contents list seven sections. None of them is references."* | Mordor product page ToC, verified 2026-08-26. **We do not claim it is uncited — only that a buyer cannot find out before paying** |
| *"The same document is $4,490 for one reader and $8,490 for the company."* | TBRC / Research and Markets licence ladder, observed 2026-08-24 |

---

### Home · Final CTA — KEEP
**Tagline:** Caspr means Business.
**Headline:** Your first $100. On us.
**Body:** No credit card required. No subscription. No commitment.
**CTA:** **Run the analysis** · stacked beneath: See a sample report →  *(set 2026-08-25)*

> **⚠ Eyebrow dropped 2026-08-25.** It read `START FOR FREE` — **restating, worse, the offer the headline
> already makes.** *Your first $100. On us.* says it in the brand's voice; `START FOR FREE` said it in
> anyone's. It was also the last surviving second statement of the offer, which
> [`site-truth.md`](site-truth.md) §45 exists to end. **The tagline above already does the eyebrow's job for
> this section.**


---

## E-2 · `/pricing`

### Hero — KEEP
**Eyebrow:** PLANS & PRICING · **Headline:** One budget. Every analysis you need.
**Body:** No retainer, no per-seat charges, no hidden fees. Set your monthly Research Budget — unused analysis balance carries forward automatically.
**Proof row:** `No credit card required · Unused balance carries forward · Cancel anytime`

> **⚠ Two lines above this row need a decision — flagged 2026-08-26, not swept, because both are judgement
> calls rather than factual errors.**
>
> **"No per-seat charges"** — **false for Org**, which is committed spend charged **per seat**, minimum three.
> True for Try, Solo and Team. **It cannot stand as an unqualified line on a page that sells all four.**
>
> **"No hidden fees"** — defensible but thin. The 7% platform fee is **never named and never itemised**
> (`access-model.md` §2); what the user sees is the budget and the amount available, both stated. **The
> effect is visible; the line item is not.** For a company whose position is *cited, or it does not ship*,
> this is the sort of phrase a sceptic tests. **Recommend cutting it** — the row loses nothing.
**Security micro-copy:** ISO 27001:2022 certified. Your data stays yours →

### What research costs — NEW · ✅ **figures landed 2026-08-26**
**Eyebrow:** WHAT RESEARCH COSTS · **Headline:** The same answer, three ways to buy it.
**Note:** As the homepage fold, one level more detailed. Figures in [`od-10-results.md`](od-10-results.md) §2.
**⚠ Add the licence ladder here, which the homepage fold omits:** the same document is **$4,490 single user and $8,490 enterprise**. It is a property of the model, stated without adjective — and it is the detail that makes the Research Budget comparison land.

### Research Budget — KEEP
**Headline:** Institutional analysis. Without the institutional price.
**Body:** Not a subscription. A Research Budget — you set the monthly amount, and **each month restores only what you consumed.** Unused balance carries forward automatically.
**Cards:** **Solo $200 a month of research** · **Team $600** ⭐ · **Org $1,800 committed, 3 seats minimum**
**⚠ Swept 2026-08-26.** *"only the analyses you complete are recharged"* removed — **false**, `COPY-11b`. Plan names replaced: **Try · Solo · Team · Org** supersede Professional / Business / Enterprise ([`product/access-model.md`](product/access-model.md) §1).
**Footnote:** First $100 on Caspr — no credit card required. Unused paid balance refunded if you cancel.

### Over time — **KEEP** (Figma draft, re-judged)
**Eyebrow:** OVER TIME · **Headline:** The tenth analysis is better than the first.
**Body:** Caspr asks as it works — your sector, who the output is for, how deep this needs to go. Those answers persist. Each analysis starts closer to the one you would have briefed, in the register your audience expects.
That is why the Research Budget is monthly. Research is rarely a one-off, and neither is the thing that gets better at it.
**Three supports:** Your sector — no re-explaining your market on every run · Your register — the vocabulary and structure your audience expects · Your standards — the depth, sourcing and length you have accepted before
**Source:** `gate-output-spec.md` §8.0.
**Verdict:** **KEEP.** Passes §3 — no competitor, no reader labour, cost appears only as the billing rationale. It is the only fold that argues for a *standing* budget rather than a transaction.

### What you get + ladder table — EDIT
**Eyebrow:** WHAT YOU GET · **Headline:** Three levels of analysis. One Research Budget.
**Inclusion line:** Your language. Included. Every format your tier delivers, generated natively in your working language — not translated after the fact.
**Cards:** 01 Brief · 02 Study · 03 Intelligence — live copy retained, `3–5 pages` corrected.
**Ladder lead:** Three price points. The names change with the work.
**Ladder table:** rows Market Research · Investment & Deal · Business Case · Academic · **Edit credits**
**Caption:** Market Sizing starts at Study. Executive Profile stops at Study. Pitch decks stop at $80. Strategic Options starts at $80.
**Note:** Inclusion line approved in `website-copy-step2.md`; re-judged and passes.

### FAQ — KEEP (8 entries)
Live six plus the two added: *"What's included, and what costs extra?"* and *"Can I change the report after it's generated?"*. Research Budget answer now states the $200 minimum.
**Re-judged:** both new entries pass §3.

### Enterprise strip — EDIT
**Eyebrow:** FOR ENTERPRISE · **Headline:** One Research Budget. Shared across your team.
**Body:** Shared research budget, SSO, API access, and dedicated onboarding — 3 seat bundle starting at $1,800.
**Optional block:** **OPTIONAL** — Caspr in your house template. Your deck master and document styling, set up by our team. $1,000 one-time, one week. Send us the samples you need matched, or just the `.potx`.
**CTA:** Talk to us →

### Final CTA — KEEP
As homepage, with the secondary link **stacked** beneath the button.

---

## E-3 · The ICP system

**Shared across all eight** — written once, identical everywhere: How It Works · Output Showcase · Your Register
(one variable) · What Arrives · Final CTA. **Variable per ICP** — Hero (approved, v3) · The Problem ·
Ladder block · Objections · FAQ · Comparison (blocked).

### Shared · How It Works
**Eyebrow:** HOW IT WORKS · **Headline:** From brief to cited analysis. In hours, not days.
**01 Describe the question** — One line. Caspr proposes the structure and asks what it needs to know.
**02 Caspr reads the market** — 25M+ curated sources, reasoned through and reconciled where they disagree.
**03 You present** — Structured, cited, boardroom-ready. PDF or editable PPTX.

### Shared · Output Showcase — EDIT
**Headline:** The deliverable.
**Support:** 100 pages. Every insight cited. Generated in under 15 minutes.
**Added line:** With the charts built from the data — comparison, trend, composition, share-shift — and the frameworks your audience already reads.
**Source:** `visualization-library.md` Lane A.
**Note:** The showcase proved *length*. Charts and framework infographics prove *kind* — the thing a syndicated report does badly and a chat window cannot do at all.

### Shared · Your Register — **KEEP** (Figma draft, re-judged)
**Eyebrow:** WRITTEN IN YOUR REGISTER · **Headline:** It reads like your team wrote it.
**Body:** Caspr writes in the register your audience expects — the vocabulary, section titles and conventions of ⟨*variable*⟩. Choose the register before you generate. It costs nothing.
**Variable:** consulting deliverable · board paper · IC memo · pitch document · investor deck · research report · category review · academic paper
**Verdict:** **KEEP.** Style ships at launch (`site-truth` §4) and no competitor can match a house register.

### Shared · What Arrives
**Eyebrow:** WHAT ARRIVES · **Headline:** Every source, credible. Every claim, triangulated. Every report, defensible.
**Note:** Replaces the ICP `04b Analytical AI` fold for the same reason as the homepage (§G-1).

### Variable · The Problem — eight different wounds

| Page | Eyebrow | Headline | Source |
|---|---|---|---|
| `/consulting` | THE PROBLEM | Sixty per cent finding it. Forty per cent thinking about it. | `:66` — *"I spend 60% of my time finding data, and only 40% thinking about it."* |
| `/strategy` | THE PROBLEM | The bottleneck was never the judgment. | `:159` — *"I have the judgment… I don't have the hours."* |
| `/investors` | THE PROBLEM | The same conclusion. Three days late. | `:245` — the lost deal |
| `/agencies` | THE PROBLEM | A new industry every pitch. None of it billable. | `:347`, `:350` |
| `/startups` | THE PROBLEM | Fifteen hours of research. Nothing you can defend. | `:441` — *"I've spent 15 hours on market research and still have nothing defensible."* |
| `/market-research` | THE PROBLEM | Two or three days at the start of every project. Nobody bills them. | `:527` |
| `/category-managers` | THE PROBLEM | Your data says what sold. Not why, and not what next. | `:628` |
| `/academic` | THE PROBLEM | The databases are on campus. You are not. | `:717` |

Three supporting cards per page, each a persona quote in the reader's own words. Sources are the numbered pain
points in `icp-personas.md`; the deck lists them per page in pass 2.

### Variable · Ladder block — **REWRITE** the rung descriptors

**Verdict on the Figma drafts: REWRITE.** They describe the *product* (*"Screen — first look at a target"*).
They should describe the *reader's job*, and they must obey rule 4 — say what you get before naming the rung.

| Type | $15 | $80 | $300 |
|---|---|---|---|
| **Market Research** | **Brief** — the sector, its players and where it is moving | **Study** — the full landscape, sized and sourced | **Intelligence** — multiple models over the same question |
| **Investment & Deal** | **Screen** — is this worth a second meeting | **Thesis** — the view you take to IC | **Diligence** — deal-grade, with the market wrapped around your data room |
| **Business Case** | **Pitch** — the market slide that survives the question | **Board paper** — the case, with the alternatives weighed | **Strategic options** — every route costed and compared |
| **Academic** | **$8 Brief** — a cited landscape, tonight | **$40 Study** — the full context chapter | — |

### Variable · Objections — three per page

Same three questions everywhere, answered in that ICP's terms. Drawn from
`product-marketing-context.md` §8 and §10 — the anxiety is always credibility.

| | Question | Answer shape |
|---|---|---|
| 1 | **Will it hold up in the room?** | Name the room — the partner then the client · the board · IC · the judge |
| 2 | **What about our confidential data?** | ISO 27001:2022 certified. Uploaded documents never reach an external AI provider. Never trains any model → `/security` |
| 3 | **Can I change it after?** | Every analysis carries an editing allowance — rewrite a section, regenerate a chart, without paying for a second analysis |

### Variable · FAQ — five per page
Per-ICP, in pass 2. Every page carries one ladder question (*"What is a Brief / Screen / Pitch?"* — rule 4) and
one security question linking to `/security`.

### Shared · Final CTA
**Tagline:** Caspr means Business. · **Eyebrow:** GET STARTED
**Headline:** *ICP-specific — e.g.* Run your first analysis on a live project.
**Body:** First $100 Research Budget gifted. No credit card. No commitment.
**CTA:** **Run the analysis** · stacked: See a sample report →  ⚠ *ICP-specific CTAs are ruled out — [`entry-routes-and-cta.md`](entry-routes-and-cta.md) §6. Each ICP has eight prompts; a button narrows to one and the landing screen immediately widens. The personalisation lives in the flipping placeholder, below the bar.*
**Note:** Restores `GET STARTED` and the $100 line, both of which the build dropped.

---

# F · Re-judging what was already written

| Copy | Verdict | Reason |
|---|---|---|
| Inclusion line · multilingual · 2 FAQ entries · tier row (`website-copy-step2.md`) | **KEEP** | Re-read against §3. No competitor named, no reader labour, cost never leads |
| Homepage hero proof row (4 items) | **EDIT** | Keep the shape; *"Zero hallucinations"* is retired — replace with `From $15` per the locked hero |
| `/pricing` **Over time** fold | **KEEP** | The only argument for a standing budget. Passes §3 |
| ICP **Your Register** fold | **KEEP** | Style ships at launch; no competitor can match a house register |
| ICP **ladder rung descriptors** | **REWRITE** | Product-shaped, not reader-shaped, and they name rungs before explaining them (rule 4) |
| `/pricing` **ladder table** lead + caption | **KEEP** | *"The names change with the work"* is the clearest statement of §2 on the site |
| `/enterprise` **house template** block | **KEEP** | Facts correct; framed as a service, kept off the ladder |
| `/academic` **also at academic pricing** line | **KEEP** | Adds the second use case without duplicating the card ladder |

---

# G · Decisions taken

**G-1 · The generative contrast leaves the homepage and every ICP page.**
*"Generative AI writes. Analytical AI analyses."* is a headline on the homepage (fold 07) and on all eight ICP
pages (fold 04b). Rule 1 is unambiguous: never a hero, a headline or an ad. Both folds are replaced by
**What arrives**, carrying the locked proof line. The contrast survives in full on `/vs/chatgpt` and
`/vs/perplexity`, which `phase-b-fold-map.md` §9 already makes the sanctioned home. **This is the largest
single change in the deck and the one most worth arguing about.**

**G-2 · The comparison fold sells the choice, not the discount.**
*"Buy the report. Commission the study. Or ask the question."* keeps cost in the last row. Leading on the gap is
what made *"The $50,000 question"* implausible.

**G-3 · The proof line is promoted from a strapline to a fold headline.** It is the locked proof, it is three
clauses of parallel structure, and nothing else on the site says what actually arrives.

**G-4 · Rung descriptors describe the job, not the artefact.** *"Is this worth a second meeting"* is what a PE
associate is deciding. *"First look at a target"* is what the software does.

**G-5 · Eight problem headlines, eight sentence shapes.** Written from the persona narratives, each traceable to
a line. None is a deadline.

---

# H · Flags

| # | Flag | Blocks |
|---|---|---|
| **1** | ~~OD-10 still open~~ — ✅ **closed on figures 2026-08-25.** Every comparison fold can now be filled from [`od-10-results.md`](od-10-results.md) §2. **Two rules travel with the figures:** carry currency + observation date on every one, and **never present a vendor's blog range as a market fact** (§4 there) | The highest-value fold on the site |
| **2** | **Testimonials and TRUSTED BY are invented**, in Figma and live. No new attributed quotes written. Attributed quotes from named people at named employers are a regulated claim in the US, UK and EU | Every social-proof fold |
| **3** | **`brand-guidelines.md` §Calibration is stale.** It still lists *"Stop Googling. Start analyzing."* and *"Your competitors are still waiting for the research."* as approved — both retired in `CLAUDE.md`. It also lists *"15 minutes. 100 pages. Cited to source."* without its demotion. `CLAUDE.md` is newer and wins; the file should be updated so the next writer is not misled | Voice reference integrity |
| **4** | **`product-marketing-context.md` §11 glossary says a Brief is "1–3 pages."** `site-truth` §6 says **3–5**. site-truth wins; the glossary needs correcting | Fact integrity |
| **5** | **`/security` body copy deferred** — `.agents/security-posture.md` not yet read. Headline carried here; body in pass 2 | `/security` |
| **6** | **`/enterprise` and `/about` body copy deferred** to pass 2. Headlines and the house-template block are here | Two pages |
| **7** | **ICP FAQ and pain-card copy deferred** to pass 2 — 8 pages × 5 questions and 8 × 3 cards, all ICP-specific. The structure and sources are fixed above so they cannot drift | ICP page completeness |
| **8** | **The 25M+ figure needs a statable basis** (`site-truth` §7). It is now on every page in this deck | Every page |

---
---

# PASS 2 — `/security`, `/enterprise`, `/about`, and the ICP variables

*Added 2026-08-20. `.agents/security-posture.md` now read in full — §9 of that file is marked "ready to
publish" and is used verbatim.*

## E-4 · `/security`

### Hero — KEEP
**Eyebrow:** SECURITY · **Headline:** Your analysis is yours. Full stop.
**Body:** ISO 27001:2022 certified. GDPR compliant. Your uploaded documents are processed entirely within Caspr's infrastructure — they never reach an external AI provider, and they never train any model.
**Microcopy:** `ISO 27001:2022 · GDPR compliant · SOC 2 Type I audit in progress`

### Independently audited — EDIT
**Eyebrow:** INDEPENDENTLY AUDITED · **Headline:** Audited, not self-reported.
**Body:** ISO 27001:2022 is a current-revision certification, independently audited. SOC 2 Type I audit is in progress, with the report expected Q3 2026. Certificates and controls documentation are available to enterprise customers on request.
**Note:** Never *"SOC 2 certified"*. `security-posture.md` §1.

### Your data room — NEW
**Eyebrow:** YOUR DATA ROOM · **Headline:** Upload it. It stays here.
**Body:** Every file you upload is private by default. It is processed inside Caspr's own infrastructure and never sent to an external AI provider. You choose, per analysis, which files it draws on — and a file marked private for one project is never quietly reused in another.
**Three supports:** **Private by default** — the safe direction, always · **You pick what it reads** — selection is per analysis, not a standing permission · **Never trains a model** — not yours, not ours, not anyone's
**Source:** `document-taxonomy.md` §B · `security-posture.md` §2.
**Note:** The fold `phase-b-fold-map.md` §6 asked for. It answers the objection every ICP page raises.

### Zero training — KEEP
**Eyebrow:** ZERO TRAINING · **Headline:** Your data never trains our models. Ever.
**Body:** Chat text that reaches Anthropic, OpenAI or Google is governed by Zero Data Retention agreements — not stored, not used for training. Uploaded documents never leave Caspr's infrastructure at all.
**Note:** Tier 2 providers are **never named publicly** (`security-posture.md` §2, marketing note).

### Retention & deletion — EDIT
**Eyebrow:** RETENTION & DELETION · **Headline:** Deleted means deleted, and we put it in writing.
**Body:** Research outputs: 90 days. Uploaded documents: one year from last access. Chat payloads with third-party providers: zero days. Request deletion and it completes within 30 days — with a signed, timestamped certificate.
**Encryption line:** AES-256 encrypted at rest. TLS 1.3 in transit. Customer-managed keys available on Enterprise.

### FAQ — NEW, **verbatim from `security-posture.md` §9**
Eight questions, already cleared: certifications · training · does data leave · who are the providers · retention · cancellation · encryption · SOC 2. **Use as written — do not paraphrase.**

### Final CTA
**Headline:** Secure analysis starts free. · **Body:** First $100 on Caspr. No credit card. ISO 27001:2022 certified.

## E-5 · `/enterprise`

### Hero — KEEP
**Headline:** Institutional-quality analysis, at institutional scale.
**Body:** Team-pooled research budgets. SSO. API access. Data room integration. The analytical infrastructure serious organisations need.
**Stats:** `$1,800/mo` Enterprise plan — team analysis budget · `3 seats` Team access, pooled budget · `API` Integrate with your internal systems

### What enterprise unlocks — EDIT
**01 Team-pooled analysis budget** — $1,800/month. $1,674 available for analyses, shared across 3 seats. Teams use what they need, when they need it. No per-seat waste.
**02 SSO and API access** — Single sign-on across your organisation. API access to bring Caspr's output into your own systems.
**03 Your data room** — Upload proprietary files alongside Caspr's curated sources. Processed inside Caspr's infrastructure, never sent to an external AI provider.
**Note:** 03 rewritten to carry the security claim, since this is where procurement reads.

### Plan detail — EDIT
**Headline:** $1,800 per month. Pooled across your team.
**Included:** 3 seats — shared analysis pool · $1,674/mo for analyses · every analysis type and depth · data room upload · SSO · API access · priority support · cancel any time
**Optional block:** **OPTIONAL** — Caspr in your house template. Your deck master and document styling, set up by our team. $1,000 one-time, one week. Send us the samples you need matched, or just the `.potx`.
**Roadmap line:** Connectors to your own data sources are in development.
**Note:** Roadmap line is named, undated, no detail (`site-truth` §4).

### Final CTA — KEEP
**Headline:** Deploy Caspr across your team. · **Body:** $1,800/month. Team-pooled. Cancel any time. · **CTA:** Contact Sales · View pricing

## E-6 · `/about` — VERIFY ONLY
Live and Figma match, copy verified this session. **One correction: `1M+` → `25M+`** in the sourcing fold
paragraph. Nothing else changes.

## E-7 · ICP pain cards — three per page, each a persona quote

| Page | Card 1 | Card 2 | Card 3 |
|---|---|---|---|
| `/consulting` | *"I spend 60% of my time finding data, and only 40% thinking about it."* `:66` | *"Paywalled, outdated, or doesn't cite its source."* `:69` | *"The partner will ask where it came from. And the client will ask again in the room."* `:75` |
| `/strategy` | *"I have the judgment to know what analysis I need. I don't have the hours."* `:159` | *"Half my time briefing consultants, the other half fixing their work."* `:162` | *"My board questions every number I can't attribute to a named source."* `:168` |
| `/investors` | *"I'm paid to evaluate businesses, not to be a research librarian."* `:249` | *"Independent reports cost $5–15k each. I can't commission one per deal."* `:252` | *"We lost the deal because we couldn't move fast enough."* `:258` |
| `/agencies` | *"Every new pitch is a new research sprint. I become a fake expert in 3 days."* `:347` | *"Research is unbillable overhead. Every hour comes off the margin."* `:350` | *"We win when we know the client's industry better than they do."* `:356` |
| `/startups` | *"Every investor asks where my number came from. My answer makes me look unserious."* `:439` | *"Fifteen hours of research and still nothing defensible."* `:441` | *"Research agencies want $30,000 minimum. I have $0."* `:445` |
| `/market-research` | *"Two or three days of desk research that no one bills the client for."* `:527` | *"We lost that proposal because our context section looked thin."* `:535` | *"Syndicated data doesn't cover my specific subcategory."* `:538` |
| `/category-managers` | *"It tells me what my category sold. Not why the market is moving."* `:628` | *"Supplier-funded research is biased. I can't present it as independent."* `:631` | *"Generic reports cover 'food delivery globally.' My question is specific."* `:640` |
| `/academic` | *"The databases are only accessible on campus. I am in my apartment."* `:717` | *"The number came with no source. I can't put that in front of a judge."* `:720`, **de-named** | *"'It seemed reasonable' is not an answer."* `:727` |

**Note on `/academic` card 2.** The persona line names ChatGPT. `brand-guidelines.md` §Academic forbids it as a
primary comparison outside objection handling, so the wound is kept and the name removed.

## E-8 · ICP FAQ — five per page

**Two shared, three specific.** Shared: a **ladder question** (rule 4 — say what you get before naming a rung)
and a **security question** linking to `/security`.

| Page | The three specific questions |
|---|---|
| `/consulting` | Will this hold up when the partner asks for the source? · Can I use it on client work? · What if I'm in a sector we've never covered? |
| `/strategy` | Is this board-ready, or a first draft? · How does this compare to commissioning the work? · Can my analyst build on the output? |
| `/investors` | Can I upload the data room? · How fast is a screen, really? · Is the market view defensible at IC? |
| `/agencies` | Can I use this in a client pitch? · What if the industry is niche? · Is the research mine to keep if we lose the pitch? |
| `/startups` | Will this survive investor scrutiny? · What if my market has no published data? · Can I run it again as the story changes? |
| `/market-research` | Does this replace my analysts? *(answer: no — and say so first)* · How specific can the subcategory be? · Can I use it inside a client deliverable? |
| `/category-managers` | Is it independent of suppliers? · Can it get to my subcategory, not the global market? · Will it stand up in a category review? |
| `/academic` | Is this allowed in academic work? · How do I get the academic rate? · Can I cite it in a dissertation? |

**Answer rules.** Second person. One idea. Never assign the reader labour. `/market-research` question 1 is
answered *"No"* in the first word — that ICP must never feel replaced (`icp-copy.md` v3 copy notes).

## Flags added in pass 2

| # | Flag |
|---|---|
| **9** | **`/security` desktop Figma is a stale ICP clone** — sections are still `03 Pain Points`, `04 Solution`, `05 Pricing Strip`. Mobile has the real structure. Desktop needs rebuilding before this copy lands |
| **10** | **`security-posture.md` §9 is verbatim-approved.** Do not let a later pass "improve" it — the wording is cleared, and paraphrase weakens specificity |
