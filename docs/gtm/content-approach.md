# Content Approach

*Version 1 — 2026-08-20. What Caspr publishes, why, and what it is made from.*

**Sits between** [`channel-model.md`](channel-model.md) *(where the audience is)* **and** [`content-engine-prompt.md`](content-engine-prompt.md) *(how the machine makes it)*.
**Derived from** `.agents/icp-personas.md` — the Pain-In-Their-Own-Language and Objections sections for all eight ICPs, read in full. Every finding below carries its line number.

---

## 1 · The job

Content is not a channel. It is **what the channels carry.** Its job is the two things the channel model cannot do on its own:

1. **Produce the ~100 of ~150 monthly signups that come from search and social** — channels that have nothing to distribute without it
2. **Answer the objections that block conversion after the signup** — the reason a 3–5% trial-to-paid becomes a 10%

Anything that serves neither is not content. It is a hobby.

---

## 2 · Five findings from the personas

### 2.1 Six of eight personas describe the same scene

Not the same pain — **the same moment.** Someone senior asks where the number came from.

> *"If I put a number in the deck, the partner will ask where it came from. And the partner's client will ask again in the meeting."* — `icp-personas.md:74`
> *"My board questions every market size number I can't attribute to a named source."* — `:167`
> *"When the GP asks 'what's the market size for X in Y region,' I need a defensible answer in 24 hours."* — `:255`
> *"Every investor asks where my market size number came from. My current answer makes me look unserious."* — `:439`
> *"Supplier-funded research is biased. I can't present it to the board as independent insight."* — `:631`
> *"My interviewer will ask where my market size number came from. 'It seemed reasonable' is not an answer."* — `:726`

**Consulting, strategy, investors, founders, category managers, students** — six ICPs, six different rooms, one question. This is *"Arrive certain"* in its natural habitat, and it is the editorial spine.

**The consequence is not a topic. It is a format.** If the shared pain is *the number that must survive the room*, then the highest-value thing Caspr can publish is **numbers that survive the room** — real analysis, real sources, given away. Not commentary about analysis.

### 2.2 The stock answer to the biggest objection is an artefact that does not exist

Five of the six objection tables answer the credibility objection the same way:

> *"Show them an actual Study output. Let the quality answer."* — `:93`
> *"Test it on a sector you know well. Compare the output to a report you previously paid $10k for."* — `:279`
> *"Test it on a niche you know."* — `:376`
> *"Test it on a sector you know well… Let the output answer the objection."* — `:558`

**The research already concluded that output beats argument.** But `/samples` is empty and sits in Tier 3 of the website plan. **Published analysis is therefore not one content type among others — it is the answer the research already gave.**

### 2.3 The comparison set is research databases, not AI

Four independent persona sets say the same thing, unprompted:

> *"Position as a 'research compilation tool' not an AI product — same category as IBISWorld."* — `:276`
> *"…a research data subscription in the same bracket as Statista or IBISWorld… a market data synthesis tool, not an AI writing product."* — `:556`
> *"…the same category as IBISWorld or Mintel."* — `:745`

**This is a strategic instruction sitting in a persona file.** The buyer's mental shelf is **IBISWorld · Statista · Mintel · Euromonitor · Bloomberg** — and that shelf is what clears compliance, matches procurement categories, and carries commercial search volume. The AI comparison does not go away — ICP 8 genuinely arrives from ChatGPT (`:746`) and Perplexity (`:749`) — but it is the smaller of the two sets.

**And the pages already exist.** Nine are live: `chatgpt · perplexity · consulting-firms · gartner · statista · mintel · euromonitor · ibisworld · pitchbook`. **Six of the nine are already the database shelf.** They were built in May under the old positioning, they are linked from no nav or footer, they rank for nothing, and `pages-for-production.md` files them under *"Phase 3 — not launch-critical."*

**So the gap is not the comparison set. It is the query shape.**

> **Nobody searches "Caspr vs IBISWorld."** They have never heard of Caspr. That is the entire problem with a `vs` page built by a company with no brand awareness — it targets a query that only exists once you are already known.

The query that has volume today is **`IBISWorld alternatives`** · `Statista alternatives` · `Mintel alternatives` · `cheaper alternative to Euromonitor` · `McKinsey alternative` · `how much does market research cost`. **Commercial intent, bottom-of-funnel, and searched by someone who has already decided the incumbent is too expensive or too generic.**

`/vs/*` is the page you need in year two. **`/alternatives/*` is the page you need now** — and it does not exist.

### 2.4 "Is this allowed?" is the most universal objection and has zero content

It appears in **every one of the six objection tables** — in six different institutional forms:

| ICP | The form it takes | Line |
|---|---|---|
| 1 Consulting | *"My firm might not allow third-party AI tools."* | `:94` |
| 2 Strategy | *"We have a procurement policy for SaaS tools over $500/month."* | `:186` |
| 3 Investors | *"Our compliance team reviews all third-party research tools."* | `:276` |
| 4 Agencies | *"Will my agency's IT or compliance team allow it?"* | `:556` |
| 6 Market Research | *"My clients pay for proprietary insights, not aggregated public data."* | `:559` |
| 8 Academic | *"Is this allowed for my dissertation?… Confirm with your supervisor."* | `:745` |

**Nothing on the site, in the library or in the plan addresses it.** It is cheap to write, evergreen, never needs regenerating, and it unblocks a purchase that has already been decided emotionally. **It is the highest ratio of conversion value to production cost available.**

### 2.5 The identity objection is the only place opinion content earns its keep

> *"The client pays for analyst rigour. Am I cheating?"* — `:95`
> *"I need to be the author of the thinking, not just a curator."* — `:374`
> *"Isn't this a threat to my job?"* — `:557`

Four ICPs. This one cannot be answered with an artefact or a fact — it needs a **position, argued by a named person.** It is the *only* content need in the research that justifies founder opinion writing. Everything else is better served by evidence.

---

## 3 · Four content types. Not more

**Origination is small, expensive and human-picked. Derivatives are large, cheap and machine-made.** The engine is a fan-out machine, not a writing machine — and that distinction is what keeps volume affordable and quality defensible.

| | Type | Origination? | Rate | Serves |
|---|---|---|---|---|
| **A** | **Published analysis** | Yes — a real Caspr run | **1–2 / month** | §2.1, §2.2 · LinkedIn · communities · backlinks · PR · `/samples` |
| **B** | **Search answers** | Yes — programmatic, from Caspr facts | **2 / week** | Organic search — the compounding channel |
| **C** | **The permission layer** | Yes — evergreen, written once | **~10 total, front-loaded** | §2.4 · conversion, not acquisition |
| **D** | **Derivatives** | No — transformation only | ~20 / week | Every social, community, email and outreach surface |

### A · Published analysis — the centrepiece

A real Caspr Study on a live question, published free and fully cited, as a report page and a downloadable PDF.

**Why it is the centrepiece and not a quarterly side-item:** it is simultaneously the objection-killer (§2.2), the backlink asset, the PR asset, the community credibility artefact, the `/samples` content, **and a live product demonstration** — and it is the format the evidence already favours. *The two best-performing Caspr posts across both founders were both real analysis with the document attached.*

**Cost: one Study — $80 at list price.** Two a month is $160. **The constraint is not money.** It is who picks the question and who checks the output before it carries the company's name.

**Selection rule:** the question must be one the six rooms in §2.1 are actually asking this quarter. Not *"the state of X"* — **the specific number someone is about to be asked to defend.**

### B · Search answers — the compounding layer

Job-shaped queries, per `gtm-strategy` §9: *"market size of [industry]"* · *"[industry] competitive analysis"* · *"business case for [X] in [country]"* · *"due diligence [sector]"* · *"how much does market research cost"*.

> **⚠ Revised 2026-08-25 by measurement — [`docs/seo/decision.md`](../seo/decision.md).**
> **AEO first, ranking second.** Every page is built to be *cited* — 40–60 word answer blocks, every figure
> with its source and date, comparison tables, schema, a visible freshness stamp. Citing sources is **+40%**
> AI visibility, statistics **+37%**, and a low-authority domain gains **up to 115%** — which is the single
> most relevant finding for a site with no authority.
>
> **Target on CPC, not volume.** `secondary research` (3,400/mo, KD 3) looked like the prize until the SERP
> showed **Scribbr first and a university library second** — students. Its CPC is **$9**;
> `competitive landscape analysis` is **$300**. **The methodology family is dropped** except the two or three
> terms with commercial CPC.
>
> **And the highest-value family was missed entirely: AI deep research.** Buyers are choosing an AI research
> tool right now, explicitly on citation reliability, and Caspr is absent from every list and every AI answer.
> **That is purchase intent, it is our exact claim, and it needs no ranking** — it needs inclusion.

**Plus the alternatives family from §2.3** — `/alternatives/ibisworld`, `/alternatives/statista`, `/alternatives/mintel`, `/alternatives/euromonitor`, `/alternatives/pitchbook`, `/alternatives/gartner`, plus *"McKinsey alternative"* and *"market research agency alternative"*. **Cut from eight pages to one, 2026-08-25.** Measured: `ibisworld alternatives` has **0 US searches a month**,
`euromonitor alternatives` **0**, and the whole family totals ~490 — while the SERPs are owned end-to-end by
G2, Slashdot, SourceForge and Datarade, **with no vendor page ranking at all.**
**Get listed on those instead.** One page at most, covering `pitchbook` and `statista` together.

**The nine existing `/vs/*` pages are rewritten and linked, not deleted** — they are the sanctioned home for the generative contrast (`CLAUDE.md`, rule 1) and they cost nothing to keep. They simply stop being the primary acquisition bet.

**Meets the ICP at the job, never at the category.** Nobody searches *"analytical AI."*

**Every number on these pages is a real Caspr number with a real citation.** That is what makes them defensible, and it is the dependency in §5.

### The sourced-number pages — the market-size family, generated

*Added 2026-08-24, absorbing the design from the retired free-tool proposal (`channel-model.md` §3.8).*

**The *"market size of [industry]"* family is generated from `fact_lookup`, not written.** One page per sector–geography intersection, at `/market-size/[sector]-[geography]`, using the same GICS and ISO vocabulary as `demand_signal`.

**The number is not the product.** Anyone gets a market size from a chatbot in four seconds. **What nobody gets is the number with its provenance and its contradictions visible** — and that is the most repeated pain in the persona file (§2.1, six ICPs). A page showing three credible figures that disagree, each with its publisher, date and methodology basis, **is** *"every source, credible; every claim, triangulated."* **Averaging them into one clean number is what everything else does.**

**`not_found` is a published answer, and the best pitch on the site.** For niche intersections — *premium ready meals in Southeast England*, `:536` — no credible source exists. Say so:

> No credible published source gives a market size for this. That is not a gap in our data — it is the reason this analysis has to be built rather than looked up.

**Economics:** a cached `fact_lookup`, never a `trigger_generation`. First visitor pays the lookup; nobody else does. **Re-look-up at 18 months** (`gtm-api-contract.md` §3.2) — a stale number on a page arguing *"we cite"* is worse than no page. **The build must verify these pages cannot reach the billable endpoint.**

**Seed narrow.** Every GICS sector × every geography on day one is thousands of pages that read as thin programmatic content. **Seed what the demand pipeline and the two launch ICPs point at; let the tail fill on demand.**

**No tool wrapper, no separate landing page, no second front door.** These are pages the engine publishes. The entrance to Caspr is Caspr.

**What this frees:** the two-a-week origination budget no longer covers market-size pages — it goes to the queries that genuinely need writing: *how much does market research cost* · *[industry] competitive analysis* · *business case for [X] in [country]* · `/alternatives/*`.

### C · The permission layer — the cheapest conversion asset available

~10 evergreen pieces answering §2.4, each written for one institutional gatekeeper:

*Using Caspr in a client deliverable* · *Caspr and your firm's AI policy* · *What compliance actually needs to approve a research tool* · *Citing Caspr sources in an IC memo* · *Caspr for a dissertation — what your supervisor needs to know* · *Procurement: what category Caspr sits in* · *Client confidentiality and desk research* · *Is using a research tool cheating?*

Written once. Linked from every ICP page, every objection fold, the FAQ, and the activation email sequence. **They never regenerate, so after week one they cost the review budget nothing.**

### D · Derivatives — everything else

**Nothing is originated on-channel.** Every LinkedIn post, X post, community contribution, email and outreach message derives from an A, B or C. Frontier model for A–C; Haiku for D.

**Fan-out from one published analysis, counted honestly:**

| Derivative | Count |
|---|---|
| Report page + PDF | 1 |
| LinkedIn — Joy, Jayant, 2–3 rotating team | 4–5 |
| X posts | 3 |
| Charts as standalone social cards | 2–4 |
| Community contributions *(only where genuinely on-topic)* | 2–4 |
| Email — activation or re-engagement | 1 |
| Search-page updates using its numbers | 2–3 |
| Outreach hooks | 2–3 |
| **Total** | **17–24** |

**The CMS screen's "one blog post becomes twenty items" is confirmed** — but only for type A. A search page fans out to 3–4, not 20, and the permission layer barely fans out at all. **Correct the screen to read "one published analysis", not "one blog post."**

**And the honest caveat:** fan-out multiplies reach, it does not create quality. Twenty derivatives of a dull analysis are twenty dull items.

---

## 4 · The editorial line — twelve weeks

**Not a topic calendar. One argument, in three movements**, so that a reader who sees three posts two months apart hears a consistent point of view.

> **The argument: a number that cannot survive the room is not an answer.**

| Weeks | Movement | Says | Pillar | Anchored in |
|---|---|---|---|---|
| **1–4** | **The question after the number** | Every serious number gets challenged. Here is the analysis — and here is where every figure came from | 1 — An Analyst, Not an Assistant | `:74` `:167` `:255` `:439` `:631` `:726` |
| **5–8** | **Where numbers actually come from** | Curated sources vs. scraped ones; reconciling sources that disagree; why the comparison set is IBISWorld and Mintel, not chatbots | 1 and 2 | `:65` `:276` `:536` `:556` |
| **9–10** | **What research costs, and what it costs not to do it** | Unbillable desk research, $15k commissions for pitches you may not win, the $5–15k independent report | 4 — A Fraction of the Cost | `:349` `:357` `:251` `:528` |
| **11–12** | **Back to the analyst** | The argument closed, with three published analyses now standing behind it | 1 | — |

**Cost is the third act — literally.** Movement 3 is the only place it leads, and by then two months of evidence stand behind it.

**Shortened to two weeks, 2026-08-24.** The calendar audit (`content-calendar.md` §5.2) found cost leading a full quarter of the output. **Being the third act is not the same as being a third of the output** — and four consecutive cost-led weeks would land exactly as `x@3` arrives, so a soft reading would meet a month of price-led content and invite discounting. Weeks 11–12 return to Pillar 1.

**A fourth, standing slot — Pillar 5, monthly.** *Your Data is Your Data* had no home in the three movements and sits at ~5% of output, while the primary launch ICP's leading objection is *"our compliance team reviews all third-party research tools"* (`:276`). **One post a month in Jayant's lane** — security, data handling, what happens to an uploaded file — which `audit.md` §5 already names as his beat. No new capability; Pillar 5 moves to ~12%.

**The category argument (Analytical vs Generative) runs underneath movement 2 only**, on `/vs/*`, social and founder content. Never a hero, headline or ad — `CLAUDE.md`, rule 1.

**The identity objection (§2.5) is the one founder-opinion slot per movement.** One piece a month, from Joy or Jayant, in the first person. It is the only content in this plan that is an opinion rather than an artefact, and it is capped deliberately.

---

## 5 · How the question gets picked — and what it needs from the product

*Joy, 2026-08-20: the questions must be demand-driven, not assumed — what is trending, what research is actually in demand.*

**This is a system, not a habit.** Topic selection is the highest-leverage decision in the whole engine — a well-chosen published analysis fans out to twenty items and a badly-chosen one also fans out to twenty items — and it is exactly the kind of decision that quietly reverts to somebody's hunch unless it has a pipeline.

### 5.1 The strongest signal is one we own and are not yet collecting

> **Every prompt submitted to Caspr is a buyer telling us what research they need.**

The tracking spec already fires `prompt_submitted` **before any account exists** — so this captures people who never signed up, which is the demand the funnel is currently losing. Clustered by sector, geography, deliverable type and depth, it is a live demand map drawn from real buyers, at zero cost, with no third-party estimate in the middle of it.

**Nothing else available comes close.** Keyword tools tell us what the internet searches; prompts tell us what our buyer asked, in their words, at the moment they needed it.

**The privacy constraint is real and must be designed for, not waived.** `tracking-spec.md` Part 6 forbids prompt text in the analytics stream, and that rule stands. The demand signal is therefore **derived server-side and aggregated before it leaves the product** — sector, region, deliverable type, depth, a topic label — never raw prompt text, never anything that identifies who asked. **Suppress any cluster below a threshold count**, or a "cluster" becomes one identifiable customer's confidential question.

### 5.2 The four signal sources, in priority order

| | Signal | Available | Tells us |
|---|---|---|---|
| **1** | **Prompt clusters** — what users ask Caspr | **Post-launch only** | Real demand from real buyers, including those who did not sign up |
| **2** | **Search demand** — volume and trend on the job-shaped query families | **Now** | What the wider market is looking for, and which of it is rising |
| **3** | **Community question flow** — r/consulting, r/MBA, WSO, #mrx, ESOMAR | **Now** | The question as the ICP phrases it, plus how often it recurs |
| **4** | **Event flow** — M&A, funding rounds, regulatory change, category disruption by sector | **Now** | Which sectors have someone about to be asked a hard question this quarter |

**Signals 2–4 are all available pre-launch, and signal 1 is not.** So the pipeline runs on external signal at launch and re-weights to prompt clusters as soon as volume exists. **Build the intake for all four now** — per the standing rule, widening is a configuration change, not a build.

**One owned dataset exists today and should be mined before launch:** Joy's 60+ analyses already run, plus the segmentation export of the 1,600 (pending from Jayant's team). Both say what was actually asked for, by whom.

### 5.3 Signal ranks. A human picks

**Trending is not the same as worth publishing**, and the difference matters because this artefact carries the company's name.

- A high-volume question with no defensible answer produces a weak analysis
- A rising question in a sector where our sources are thin produces an embarrassing one
- The best question is often the *third* on the list — high demand, genuinely answerable, and nobody credible has answered it

**So the pipeline produces a ranked candidate list with the evidence attached** — signal source, volume, trend, which ICP it serves, and whether Caspr can source it well. **A person picks from the top of that list.** That is the answer to "who picks the question": not an assumption, and not an automaton — a human choosing between evidenced options.

### 5.4 What this needs from the product

| Type | Needs | Endpoint |
|---|---|---|
| **Topic selection** | **Aggregated, anonymised, thresholded demand clusters** — sector, region, deliverable type, depth, topic label, count, trend | **`demand signal`** — **new.** Not in the previous three-endpoint scope, and it is what makes §5.1 possible |
| **A · Published analysis** | A real run, human-initiated and human-checked | `analysis request` + `analysis retrieval` — **not automated at first.** A person commissions it and a person reads it |
| **B · Search answers** | Market sizes, growth rates, category figures — each with its citation | **`fact lookup`** — the load-bearing one. Programmatic SEO at any volume is impossible without it |
| **C · Permission layer** | Nothing | — |
| **D · Derivatives** | Nothing new — inherits the citations of its parent | — |

**The rule stands: retrieve → look up → only then request.** A new analysis is the last resort, not the first call. Most content needs a *fact*, and a fact should never cost a Study.

**Written up as [`gtm-api-contract.md`](gtm-api-contract.md) — and the ask turned out smaller than expected.** `retrieve_analysis` and `trigger_generation` **already exist and ship with a conformance suite** (`api-spec-v2.md` §7 and §3); no change is requested to either. The real ask is **two new tools — `fact_lookup` and `demand_signal` — and one service principal**, because v2 assumes every caller is a person and this caller is not.

---

## 5A · The collaboration loop — an acquisition mechanic the engine does not run

**Added 2026-08-26 from [`../product/access-model.md`](../product/access-model.md) §5.2.** It belongs in this
document because **it produces first touches, and this document owns how first touches are earned** — even
where the mechanism is the product rather than the content.

**The loop:** an owner shares an analysis (**viewing is free and ungated, always**) → invites a colleague to
**edit**, which debits the **owner's** wallet so it starts with no card and no friction → **the colleague's own
$100 trial stays untouched**, waiting → an editor **cannot start** an analysis, so the moment they have a
question of their own they are in the funnel **with $100 already there** → a third colleague on the domain
fires the **Org** gate.

> **The trial stops being a signup incentive and becomes something that travels through the work.**

### ⚠ Why this belongs to content strategy and not only to product

**Every content type in §3 works to make a stranger care enough to try. This mechanic delivers someone who
already has the document open, the task in front of them, and a colleague who vouched.**

**That is a better first touch than any published analysis can manufacture** — and it means **the most
valuable reader of a Caspr analysis may not be the person who commissioned it.** A shared analysis is
distribution, and it is distribution the engine did not have to write.

**What follows for the content plan, and it is one thing:** **an analysis that is worth forwarding is worth
more than an analysis that is merely worth reading.** Where two candidate topics are otherwise equal,
**prefer the one a reader would send to a colleague** — a contested number, a category read someone will be
asked about, a reconciliation of figures a team is arguing over. **Not the one that is merely comprehensive.**

**⛔ What the engine must not do.** It does not run this loop, does not automate sharing, and never publishes
anything derived from who shared what with whom. §7A holds — **customer activity is not content input.**

---

## 6 · Volume against capacity — a correction to the runbook

`operations-runbook.md` §4 budgets **~21–24 items at ~70 minutes across three people.** It treats every item as equal. **They are not, and the difference is roughly tenfold.**

| | Reviewing | Cost |
|---|---|---|
| **Origination** (A, B, C) | A claim, a source, a position — checked against reality | **8–15 min each** |
| **Derivative** (D) | Whether a transformation of already-approved material stayed faithful | **1–2 min each** |

**Recast weekly:**

| Item | Per week | Minutes |
|---|---|---|
| Search answers *(B)* | 2 | 20–30 |
| Published analysis *(A)* | 0.25–0.5 | 10–15 *(amortised; ~40 in the week it lands)* |
| Permission layer *(C)* | front-loaded, then 0 | 0 |
| Derivatives *(D)* | ~20 | 20–40 |
| **Total** | **~23** | **50–85 min** |

**It fits — but only because origination is small.** The scaling rule must change accordingly: **scale derivatives freely; scale origination only when a reviewer's minutes exist for it.** Doubling item count is cheap. Doubling origination is not.

---

## 7 · The 113-card library — neither extended nor superseded

`content-engine-prompt.md` §6 poses this as a choice. **It is a false choice, and reading the library resolves it.**

The 113 cards are a **product support corpus** — in-app Help under six pills, per `pass2-refinement.md` Decision 1. That is a different asset, with a different owner and a different lifecycle. **The marketing engine neither inherits it nor retires it.**

**Three of its eleven categories are demand content and do hand over:**

| Category | Becomes |
|---|---|
| **B · What Makes Caspr Different** | Source material for movement 2 of the editorial line |
| **H · Use Cases by Role** | The ICP-page substrate |
| **J · Glossary** | **Type B directly** — the answer-engine surface named in the channel model |

**Everything else stays where it is**, and `pass3-change-proposal.md` remains the plan for it. **The pass-3 corrections still block the handover** — A2 (the ~100-page/15-minute claim must be split by tier) and A4 (tier names are not universal) are both wrong in the cards today and would propagate straight into published marketing.

---

## 7A · The boundary — the engine never originates data

*Joy, 2026-08-24: "his team should own everything that provides the reliable insights/data — just make sure the ask is clear."*

> **The GTM layer publishes and distributes. It never produces a fact, a figure or an insight of its own.**

Every number in every published item comes from the product, through the tools in [`gtm-api-contract.md`](gtm-api-contract.md). **The engine has no research capability, no data source and no estimation logic** — and must never grow one, however convenient it looks in the moment.

**Three consequences:**

- **A number the product cannot source does not get published.** Not estimated, not averaged, not caveated into existence
- **The API contract is the ask, and clarity in it is the whole job.** If the engine needs something, it is specified there and Jayant's team builds it — it is not worked around locally
- **`fact_lookup` volume is now materially higher than first scoped.** It backs a generated page family rather than occasional lookups. **Flag this to Jayant's team** — the 600/hour suggestion in the contract §3.3 was sized for the smaller case

---

## 8 · The rule, restated

> **Cited, or it does not ship.** Every item carries either a finding traceable to a real Caspr analysis, or an attributed opinion from a named person. An item with neither is not generated.

The company's whole position is that it is not the machine that produces confident unsourced text — `:720`, *"When I ask for the source, it makes one up."* **A marketing engine that produced exactly that would be the most expensive possible own goal.**

---

## 9 · Traceability

**Sources opened:** `.agents/icp-personas.md` — Pain Points and Objections, all eight ICPs, in full · `.agents/brand-guidelines.md` §Content Pillars · `.agents/gtm-strategy.md` §9, §11 · `docs/gtm/operations-runbook.md` §4 · `docs/gtm/channel-model.md` · `content/_refresh/current_assumptions.md` · `content/pass2-refinement.md` · `content/pass3-change-proposal.md`.

**Not opened:** `content/caspr-help-content-repository.xlsx` card by card, and `content/_refresh/delta_1..5`. The three summary documents above establish the library's *shape and purpose*, which is what §7 needed. **The content-engine session must open the workbook itself** before treating categories B, H and J as source material.

**Invented, and labelled as such:** the twelve-week movement structure in §4, and the ~10 titles in §3C. Both are constructed *over* the persona evidence rather than found in it. The **arguments** they carry are cited; the **sequencing and the titles** are mine.

**Estimates, not measurements:** the 8–15 and 1–2 minute review costs in §6 are judgement. **They must be measured in week one and the table corrected** — the whole capacity case rests on that ratio holding.

---

## 10 · Decisions — resolved 2026-08-20

**1 · Topic selection is demand-driven, via the API.** Not assumed. A four-source signal pipeline produces a ranked candidate list; a human picks from the top of it. Full design in §5. **Consequence: the API contract carries a fourth endpoint** — `demand signal`, with a privacy design attached.

**2 · The website expands as far as required — approved.** One-time, low cost. Scope:

- **`/alternatives/*` — new, and the priority.** `ibisworld` · `statista` · `mintel` · `euromonitor` · `pitchbook` · `gartner`, plus `mckinsey` / `market-research-agency`. This is the query family that has volume for a company nobody has heard of yet
- **The nine `/vs/*` pages — rewritten to current positioning and linked** into nav and footer. They move out of Phase 3
- **Programmatic templates and the glossary** — already carried into the website session from the channel model

**3 · The permission layer — six before launch, four held.**

**Recommendation, and the reasoning:**

*Write now (6).* **They cost reviewer minutes that are currently idle.** Pre-launch is the only period where the review budget is not consumed by weekly volume, and these never regenerate — so the spend happens once, at the cheapest possible moment. **They also unblock the website session**, which is about to write objection folds on eight ICP pages that need somewhere to link. And three of them are not conversion content at all — *"can I use AI for my dissertation"*, *"AI policy [profession]"* — they are **acquisition** content with live search volume that almost nobody credible is answering.

| | Piece | Why this one |
|---|---|---|
| 1 | **What Caspr is, in the terms a compliance team asks about** | The factual base. Every other piece links to it |
| 2 | **Using Caspr output in a client deliverable** | ICPs 1, 4, 6 — the billing-work objection |
| 3 | **Citing sources from a Caspr analysis** | One piece, three audiences: IC memo, client deck, bibliography |
| 4 | **Caspr for a dissertation — what your supervisor will want to know** | Real search volume; ICP 8 is highest-volume, lowest-friction |
| 5 | **What procurement category Caspr sits in** | Short. Unblocks ICP 2's $500 threshold objection, `:186` |
| 6 | **Is using a research tool cheating?** | §2.5's founder-voice slot. The identity objection, argued by a named person |

*Hold (4)* — client-confidentiality specifics, firm-AI-policy interpretation, and two remaining role variants. **Hold them until traffic says which gatekeeper actually blocks most.** Writing all ten now guesses at the answer the first month of data will give for free.

**One constraint on all six.** Describe what Caspr **is and does** — where inputs go, what is retained, what is never trained on. **Never interpret the reader's own obligations.** *"Your firm permits this"* is a claim about their policy, not ours, and it is not ours to make. State the facts their compliance function needs; let them apply it.
