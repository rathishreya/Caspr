# The evaluation corpus — 23 analyses to produce

> **✅ Produced and scored 2026-08-26 — [`report-evaluation-2026-08.md`](report-evaluation-2026-08.md).**
> **23 of 23 delivered**, both formats, depths correct. **Answer keys: 3 PASS · 1 PARTIAL · 1 FAIL.**
> **The pattern: every PASS is a Study; the FAIL and the PARTIAL are both Briefs.**
> `/samples` selection: **Saudi industrial valves** · **Reconcile UK ready meals** · **Vertical SaaS valuations**.

*2026-08-25 · For the production team · Requested by Joy*
*Extends [`demonstration-analyses-brief.md`](demonstration-analyses-brief.md), which specifies the first three*

---

## 1 · What this is for

**Twenty-three analyses, produced as real runs through the product, delivered as `.md` and PDF.**

**Three jobs:**

| | |
|---|---|
| **1** | **`/samples` and the comparison folds** — the proof layer, which gates all paid spend |
| **2** | **Content-engine origination** — the GTM layer may only draw facts from a published Caspr analysis |
| **3** | **An honest evaluation of what Caspr is actually better at** — and where it is not |

**Job 3 is why both formats are needed.** The `.md` is what gets read and checked, claim by claim. **The PDF is
a different test** — whether the thing renders as a document a person would put in front of a board, and
whether the provenance mark survives ([`product/ai-disclosure-spec.md`](product/ai-disclosure-spec.md)).

---

## 2 · ⚠ The design principle — this is a test, not a showcase

**Most subjects here were chosen because we already know what the honest answer looks like.**

Seven query shapes were tested live on 2026-08-25 and every one carried an unreconciled contradiction. **Those
contradictions are now the answer key.** When Caspr runs the Saudi industrial valves market, we already know
there are two published figures **36% apart**. Either it surfaces both, or it does not.

> **A corpus of subjects we cannot check produces impressions. A corpus of subjects we can check produces a
> verdict** — and a verdict is the only thing worth putting behind *"cited, or it does not ship."*

**Marked ✅ below: subjects with a *verified* answer key — figures read from live sources, not assumed.** Six of the twenty-three. **Run those first** — they
tell us whether the rest are worth reading.

### The three rules for whoever produces these

| | |
|---|---|
| **1** | **Type the prompt as written. Do not improve it** — these read like a real user's prompt on purpose |
| **2** | **Do not re-run and keep the best.** One run each. If it needs three attempts, that is the finding |
| **3** | **Deliver the failures too.** A weak analysis is more useful to us right now than a strong one, and it will not be held against anybody |

---

## 3 · Tier 1 — the three comparison-anchored analyses

**Already specified in full** — prompts, depth, clarifying answers and drift limits — at
[`demonstration-analyses-brief.md`](demonstration-analyses-brief.md) §9. **Produce these first.**

| | Subject | Type | Depth | Shadows |
|---|---|---|---|---|
| **1** ✅ | **US public EV charging — how big, really** | Market Analysis | **Brief** | IBISWorld · *$414.3M* — **and a verified 12× spread, §4.1** |
| **2** ✅ | **Premium ready meals, Southeast England** | Market Analysis | **Study** | Mordor · *$4,750, 110pp* |
| **3** | **AI clinical documentation — is the forecast credible** | Market Analysis | **Study** | Mordor · *$4,750, 180pp* |

---

## 4 · Tier 2 — the twenty

**Depths are Brief or Study only. Intelligence is "Coming soon" (Phase 2) and must not be produced.**

### 4.1 ⚠ The EV charging answer key, verified 2026-08-25 — the strongest in the corpus

**Tier 1 analysis #1 asks how big the US public EV charging market is. Here is what is actually published:**

| Source | 2025 figure | What it is counting |
|---|---|---|
| **IBISWorld** | **$414.3M** | Industry revenue of charging-station establishments |
| Next MSC | $423.1M | "US EV charging market" |
| **Mordor** — *EV Charging **Equipment*** | **$2.25bn** · **9.88% CAGR** | Equipment |
| **Mordor** — *EV Charging **Systems and** Equipment* | **$4.95bn** · **27.65% CAGR** | Systems + equipment |
| Grand View | $5.09bn *(2024)* · 30.3% CAGR | Charging infrastructure |

> **The same publisher gives $2.25bn and $4.95bn for the same country in the same year** — 2.2× apart,
> distinguished only by two words in the product title, **with growth rates nearly 3× apart.** Across all five
> sources the spread is **12×.**

**This is the single best-instrumented test we have, and it costs $15 to run.** The grading is unambiguous:

| | |
|---|---|
| **Pass** | Surfaces the spread, states what each figure counts, and says which one answers the user's question |
| **Partial** | Surfaces the spread but does not explain it — better than every free AI answer, short of the claim |
| **Fail** | Returns one number as *the* market size |

**A $15 Brief that lands this demonstrates the entire product thesis on one page.** It is also, on its own, a
publishable finding for the index engine and for guerrilla rung 4 — stated as dates and scopes, never as an
adjective.

---

### Market Analysis

**4 ✅ · Saudi industrial valves — market size and growth**
> *How big is the industrial valves market in Saudi Arabia, and how fast is it growing?*
**Study.** **The sharpest answer key we hold.** Two credible publishers give **IMARC $725.0M** against
**MarkNtel $990M** — 36% apart on the same market, and neither page acknowledges the other. This analysis is
graded on one thing: does Caspr surface both figures with their bases, or does it pick one and present it as
the answer? Picking one is what every free AI answer already does. Surfacing both, with why they differ, is
the entire product thesis on a single page. Investors and consultants both encounter this shape constantly.

**5 ✅ · Copper production by country**
> *Which countries produce the most copper, and how has that shifted?*
**Brief.** **A definitional trap, not a disagreement.** The most-cited answers split between *mine* production
(Chile largest) and *refined* production (China ~48%) — measuring genuinely different things, with almost no
page saying which. Reporting this as "sources disagree" would be the exact sloppiness we sell against, so the
grading is precise: Caspr must label it definitional, not conflicting. If it gets this right at Brief depth
for $15, that is a stronger demonstration than any market-size report. Also a natural Signal-versus-cited test.

**6 · Europe heat pumps — installed base against annual shipments**
> *How many heat pumps are installed across Europe, and how fast is the base growing?*
**Study.** Chosen for the same reason as copper: **two different quantities routinely reported as one.**
Installed base and annual shipments differ by an order of magnitude, and policy-driven markets attract
advocacy figures from bodies with a position. Tests whether Caspr distinguishes a trade association's number
from a statistical agency's, and whether it says which it is using. Relevant to consultants running energy
transition work and to investors screening the category.

**7 · UK grocery quick-commerce after the shakeout**
> *What is left of UK quick-commerce grocery, and who is actually making money?*
**Study.** A category that consolidated hard, so **most published sizing predates the shakeout.** Tests
freshness handling directly: does Caspr notice that the widely-cited figures describe a market that no longer
exists in that shape, or does it repeat them? Staleness is the failure mode we have argued is endemic — this
is where we find out whether we handle it better. Consultant-shaped: a category read someone needs on Monday.

**8 · India B2B payments — size, structure and who is winning**
> *Size the India B2B payments market and tell me who is taking share.*
**Study.** A high-velocity emerging market where published estimates diverge widely and regulatory change
moves the numbers quarterly. Tests the sourcing stage claim — analysis reflecting today rather than a training
cut-off — on a market where "today" genuinely matters. Also tests whether Caspr distinguishes transaction
value from revenue, a distinction that inflates payments market sizes routinely.

### Diligence

**9 ✅ · Vertical SaaS revenue multiples**
> *What are vertical SaaS businesses trading at, and on what basis?*
**Study.** **Answer key: 8.5× NTM against 3.3× TTM observed live** — a 2.5× swing that is entirely
definitional, forward versus trailing. An investor who quotes the wrong one in an IC memo has a real problem.
Graded on whether Caspr states the basis alongside every multiple. This is the single most consequential
definitional error in the investor ICP's daily work, and if Caspr handles it cleanly the analysis is a
marketing asset on its own.

**10 · Commercial due diligence — European logistics technology**
> *Commercial due-diligence read on the European logistics tech sector — where is the durable margin?*
**Study.** The core investor job, run at sector rather than target level so nothing confidential is involved.
Tests structure more than sourcing: does the output reach a conclusion a deal team could act on, or does it
stop at a landscape? *"Speaks in conclusions, not caveats"* is a brand claim — this is where it is tested.
Directly serves the primary launch ICP.

**11 · Cybersecurity services — buyer concentration and pricing power**
> *Who holds pricing power in cybersecurity services, and is buyer concentration increasing?*
**Study.** Chosen because the honest answer requires weighing sources that disagree on definitions of the
market, and because vendor-published research dominates the space. Tests source discrimination: does Caspr
distinguish independent analysis from supplier-funded content, which is the objection our own buyer research
records most often. A weak result here is important to know.

**12 · A named listed company — competitive position**
> *Where does [company] actually sit competitively, and what is the evidence?*
**Study.** Company to be chosen at production time — a mid-cap with real analyst coverage, so the output can
be checked against known positions. **Tests the hardest thing: saying something specific about a named entity
without overstepping the sources.** Also the highest-risk output in the corpus, which is exactly why it should
be produced and reviewed internally before anything like it appears publicly.

### Deal Sourcing

**13 · Acquisition targets in European medtech distribution**
> *Who are the credible acquisition targets in European medtech distribution?*
**Study.** Drawn from the locked investor prompt library. Tests whether Caspr can produce a defensible
shortlist rather than a list — the difference being stated criteria and a reason each name is on it. Deal
sourcing is the Type with the least written guidance, so this doubles as a check on whether the output shape
holds up where the specification is thinnest.

**14 · Consolidation in UK veterinary practices**
> *How consolidated is the UK veterinary market, and who is still buying?*
**Brief.** A well-documented roll-up with public regulatory attention, so **the answer is checkable.** Chosen
at Brief depth to test whether $15 produces something a corporate development analyst would actually use.
Consolidation questions are the corp-dev shape that recurs most, and this one has enough public record that a
wrong answer will be obvious.

**15 · Roll-up candidates in UK facilities management**
> *Which parts of UK facilities management are still fragmented enough to roll up?*
**Study.** Tests the analytical move that distinguishes deal sourcing from screening — reasoning from market
structure to opportunity, rather than listing companies. Requires combining fragmentation data with margin
structure, which is exactly the multi-source synthesis the assessment stage claim rests on.

### Research Synthesis

**16 ✅ · Reconcile the conflicting UK ready meals estimates**
> *Reconcile the conflicting market size estimates for UK ready meals.*
**Study.** **The most direct test in the corpus, because the user has asked for the thing we claim to be best
at.** Answer key: **$5.86bn at 4.95% CAGR against $6.46bn at 12.4% CAGR**, same market, same base year. This
prompt is lifted verbatim from the locked consultant library, where it exists because a real buyer described
this as *"a multi-hour job with no guaranteed resolution."* If Caspr resolves it in fifteen minutes with both
figures visible, that output is the strongest single asset the corpus can produce.

**17 · GLP-1 drugs and food category demand — what the evidence actually shows**
> *What does the evidence actually show about GLP-1 drugs affecting food category demand?*
**Study.** A subject saturated with confident claims and thin evidence, where credible studies disagree and
commercial parties have positions. **Tests the discipline to report uncertainty as uncertainty** rather than
manufacturing a conclusion. *"Not found is a correct answer"* is a design rule in the product — this is where
we see whether it holds under pressure from a question everyone has an opinion about.

**18 · AI coding assistants — what has actually been measured**
> *What has actually been measured about AI coding assistant productivity, as opposed to claimed?*
**Study.** Almost all published figures are vendor-produced. Tests whether Caspr separates measured evidence
from marketing, on a topic where our own buyers are sceptical of exactly that. **A useful adjacent property:
it is a subject the reader can evaluate themselves**, which makes it persuasive in a way market sizing is not.

**19 · Remote work and productivity — the state of the evidence**
> *What is the current state of the evidence on remote work and productivity?*
**Brief.** Academic-flavoured synthesis at the cheapest tier, testing whether $15 produces something a graduate
researcher would trust. Serves the academic ICP without a landing page commitment, and tests handling of a
literature where methodology drives the disagreement more than the findings do.

**20 · Battery storage economics — why the cost curves disagree**
> *Why do published battery storage cost curves disagree, and which should I use?*
**Study.** **The user is asking about the disagreement itself**, which is the shape we most want to be good
at. Cost curves diverge on scope — cell versus pack versus installed system — the same definitional problem as
copper, in a sector both investors and consultants are actively working. If Caspr answers *"which should I
use"* with a reasoned recommendation rather than a shrug, that is the analyst-not-assistant claim demonstrated.
**⚠ Not marked ✅: the divergence here is expected from the shape of the market, not verified against live
sources like the six that are.** Treat the result as evidence, not as a scored test.

### Strategy

**21 · Should a mid-market UK retailer enter Ireland?**
> *Should a mid-market UK retailer enter Ireland?*
**Study.** From the locked strategy prompt library. **Tests the hardest output shape: a recommendation.** Market
analysis can hide behind description; a strategy question cannot. Graded on whether it reaches a defensible
position with the reasoning visible, and whether it weighs the alternative it rejects — the second half of the
proof line.

**22 · Business case for Gulf healthcare services expansion**
> *Build the business case for expanding into Gulf healthcare services.*
**Study.** Regional data is genuinely thin here, so this tests behaviour at the edge of the corpus: does Caspr
say what it could not establish, or does it fill the gap? **The honest failure mode is the valuable outcome** —
*"no credible published source gives this number"* is the argument for the product, and this subject is likely
to produce it.

**23 · Where European fintech goes to 2030**
> *Where is European fintech heading over the next five years, and what would have to be true?*
**Study.** A forward-looking question where every source is a projection rather than a measurement. Tests
whether Caspr distinguishes forecast from fact and attributes each projection to whoever made it. **The
"what would have to be true" clause is deliberate** — it asks for the conditions behind a conclusion, which is
the analyst's move and the thing a generative answer reliably skips.

---

## 5 · Cost

| | | |
|---|---|---|
| **Briefs** | 4 × $15 | **$60** |
| **Studies** | 19 × $80 | **$1,520** |
| | | **$1,580 total** |

**Worth stating plainly:** this buys the proof layer that gates all paid spend, the origination material the
content engine cannot legally run without, and the only honest read we will get on where the product is strong.
**If the budget has to be cut, cut Tier 2 by half and keep every ✅** — the analyses with an answer key are
worth more than the ones without.

---

## 6 · What comes back, and what I will do with it

### Deliverables per analysis

| | |
|---|---|
| **1** | **The `.md` output** — what gets read and checked claim by claim |
| **2** | **The PDF** — a separate test: does it render as a document someone puts in front of a board |
| **3** | **The prompt as typed**, and **the clarifying questions Caspr asked** |
| **4** | **Wall-clock time**, prompt to delivered file |
| **5** | **Anything it declined or returned as not-found** — not a failure, and often the most interesting line |

### What I will evaluate against

| | |
|---|---|
| **1** | **Every citation resolves.** ⚠ **This is the one defect that must be zero** — a dead link on a page arguing *"we cite"* is worse than no page |
| **2** | **The answer keys.** Seven subjects have a known honest answer. Did it find it |
| **3** | **Definitional versus genuine disagreement** — labelled correctly, per [`gtm/index-engine.md`](gtm/index-engine.md) §2 |
| **4** | **Conclusions rather than description.** *"Speaks in conclusions, not caveats"* is a claim we make |
| **5** | **The Signal block never borrows a cited finding's authority** — [`report-guidance/report-style-guide.md`](report-guidance/report-style-guide.md):533 |
| **6** | **The AI-provenance mark present and intact** in the PDF — cover foot and XMP |
| **7** | **Freshness** — anything older than 18 months flagged rather than repeated |

### What I produce from it

**An honest assessment of where Caspr is genuinely better, where it is equivalent, and where it is not** —
written to be usable in public copy, which means **every advantage claimed will be traceable to a specific
output.**

> **The assessment will include what did not work.** A proof layer assembled only from the runs that went well
> is not proof, and the first person to notice will be a competitor reading `/samples` closely.
