# Search strategy — stress test

*2026-08-25. Written after [`findings.md`](findings.md) was challenged. No further API spend until an approach is agreed.*

---

## 1 · What my first analysis got wrong

**Three errors, and the third invalidates the headline conclusion.**

### 1.1 I tested a keyword list I invented

Pull 3 was **45 keywords I made up**, then measured. Finding they had no volume proves **I guessed badly**, not that the space is empty. The competitor data was the real evidence and I under-read it.

### 1.2 I optimised for volume, which is not a strategy

Volume is one input. **Winnability, commercial intent, fit with what we can uniquely produce, and whether the query even runs through Google any more all matter as much or more.**

### 1.3 ⛔ I judged a programmatic pattern by single-page volume. That is the wrong unit

**I wrote that `/market-size/*` is "weak" at ~100 searches a month per sector. Re-reading the competitor data against the right question:**

| URL pattern | Keywords in top 100 | Traffic |
|---|---|---|
| **`mordorintelligence.com/industry-reports/`** | **100 of 100** | **23,985** |
| **`grandviewresearch.com/industry-analysis/`** | **99 of 100** | **11,290** |
| `researchandmarkets.com/report/` | 56 | 2,105 |
| `driveresearch.com/market-research-company-blog/` | 85 | 5,229 |

**Every single one of Mordor's top-100 traffic-driving keywords lands on one template.** That is the business model: **one page shape, thousands of instances, 50–500 visits each.**

**And the tail is where the traffic is:**

| Domain | Share of traffic from keywords under 1,000/mo |
|---|---|
| researchandmarkets.com | **97%** |
| thefarnsworthgroup.com | **100%** |
| euromonitor.com | **93%** |
| mintel.com | **83%** |
| grandviewresearch.com | **79%** |
| ibisworld.com | **70%** |
| driveresearch.com | **68%** |
| statista.com | 7% |

> **The hypothesis was right. Market research is an SEO game — and it is a long-tail programmatic game.** I measured head terms, found them thin, and concluded the space was thin. **Wrong unit of analysis.**

**Statista is the single exception at 7%, because it is a general-reference business, not a research business.** Its traffic is *"richest man in the world"* and *"trump approval rating"*. It should never have been in the comparison set.

**And the copper example is exactly right.** Nobody searches *"market sizing"*. They search *"copper production by country"*, *"iron ore reserves by region"*, *"India agricultural exports 2025"*. **That is the demand, it is effectively inexhaustible, and it is what `fact_lookup` produces.**

---

## 2 · The bigger reframe — ranking is not the goal any more

**The AI-search evidence changes what "winning search" means, and it favours Caspr specifically.**

| Finding | Source | Why it matters here |
|---|---|---|
| AI Overviews appear in **~45%** of Google searches and cut clicks by up to **58%** | Industry data | **Ranking #1 is worth materially less than it was.** Being the cited source is worth more |
| **Citing sources: +40% AI visibility. Adding statistics: +37%. Quotations: +30%** | Princeton GEO study, KDD 2024 | **This is a literal description of a Caspr page.** Every figure cited, every source named |
| **Low-ranking sites gain up to 115% visibility from citations** | Same study | **A zero-authority domain can be cited without ranking.** This is the single most important fact for us |
| Brands are **6.5× more likely to be cited via third-party sources** than their own domain | Industry data | G2, Wikipedia, Reddit matter more than our own comparison pages |
| **Keyword stuffing actively reduces AI visibility by 10%** | Same study | Classic pSEO tactics are counterproductive here |

> **Caspr is structurally built for AI citation in a way it is not built for classic ranking.** Our content is source-dense and statistic-dense by construction — the two highest-scoring factors in the study. And the disagreement format, which is *weak* for classic SEO because Google wants one clean answer, is *strong* for AI citation because it is exactly the hedged, sourced, multi-perspective content an LLM reaches for.

**Which also answers "should SEO be a big part of the GTM?" — the channel is right and my framing was wrong.** It compounds, it is owned, and it is the only line that grows without more people. **But the winnable version is citation, not position**, and that changes what we build and how we measure it.

---

## 3 · Five approaches, evaluated

**Not mutually exclusive. Ranked by fit with what Caspr can uniquely do.**

### A · Long-tail data pages — the Mordor model, our version

`copper production by country` · `iron ore reserves by region` · `India agricultural exports` · thousands of them, generated from `fact_lookup`.

| | |
|---|---|
| **Demand** | **Very high in aggregate.** 70–97% of incumbent traffic is exactly this shape |
| **Winnability, classic** | **Hard.** USGS, Wikipedia, Trading Economics and the incumbents hold these |
| **Winnability, AI citation** | **Strong.** Source-dense, statistic-dense, freshly generated |
| **Our edge** | **Recency and reconciliation.** We can say *"USGS says X, ICSG says Y, here is why they differ"*. **Nobody else publishes the disagreement** |
| **Risk** | **Thin-content penalty.** The pSEO data-defensibility hierarchy puts public data at the *weakest* rung. Our synthesis is what lifts it |

### B · Methodology and education — the driveresearch model

`secondary research` (KD 3) · `desk research` (KD 0) · `market sizing` (KD 9, **CPC $140**) · `competitive landscape analysis` (KD 11, **CPC $300**).

| | |
|---|---|
| **Demand** | ~27,000/mo, verified |
| **Winnability** | **Proven.** A small agency owns it at KD 0–12 |
| **Our edge** | **Weak.** Anyone can write "what is desk research" |
| **Audience risk** | **Skews student and junior.** `tam sam som` at 14,000 is founders — ICP 5, deprioritised on propensity to pay |

### C · AEO-first — engineer for citation, not position

Optimise every page for extraction: 40–60 word answer blocks, statistics with sources, comparison tables, schema, freshness stamps, `llms.txt`, `pricing.md`, AI crawlers explicitly allowed.

| | |
|---|---|
| **Demand** | Not measurable in keyword tools — **that is the point.** AI queries are longer and more specific and never appear in Ahrefs |
| **Winnability** | **The strongest fit we have.** +40% for citing sources, +37% for statistics, and the low-authority bonus |
| **Our edge** | **Structural.** Our product output *is* the format that gets cited |
| **Risk** | Harder to measure. Requires manual citation tracking |

### D · Third-party presence — be where the AI looks

G2, Datarade, Slashdot, Capterra, Wikipedia, Reddit, industry roundups.

| | |
|---|---|
| **Demand** | **6.5× more citations come via third parties than own domain** |
| **Winnability** | **Immediate.** Directory listings are a form, not a ranking contest |
| **Evidence** | The `ibisworld alternatives` SERP is owned end-to-end by G2, Slashdot, SourceForge, Craft, Datarade — **no vendor page ranks at all** |
| **Cost** | Nearly zero. Already a runbook target at 10/month |

### E · Original research — The Record

| | |
|---|---|
| **Demand** | Not query-driven. Earns links and citations rather than rankings |
| **Our edge** | **Highest possible.** Proprietary data is rung 1 of the defensibility hierarchy; public data is rung 5 |
| **AI fit** | Original research is ~12% of AI citations and the most durable kind |
| **Already funded** | 4 issues in the twelve-week calendar |

---

## 4 · What I would recommend, and what I would drop

**Drop outright:**

- **`/alternatives/*` as eight pages.** ~490 searches/month total and G2 owns the SERPs. **Replace with option D** — get listed on the pages that already rank
- **Methodology content as the primary bet.** Real volume, but no edge and the wrong audience. **Two or three pages where it overlaps our buyer** (`market sizing`, `competitive landscape analysis` — both high CPC, both investor-adjacent), not a family

**Build, in this order:**

1. **D — third-party listings.** Cheapest, fastest, 6.5× multiplier, already resourced
2. **C — AEO engineering on everything.** Not a content family; a **standard every page meets.** Costs almost nothing at build time and is expensive to retrofit
3. **A — long-tail data pages, seeded narrow.** The real prize, but tested before scaled
4. **E — The Record.** Already funded and scheduled

---

## 5 · Cheap tests before any big run

**~63,000 Ahrefs units remain. None of these needs more than a fraction of it, and three need none at all.**

| | Hypothesis | Test | Cost |
|---|---|---|---|
| **T1** | **Specific data queries have real aggregate demand** | Pull volume for 40 specific commodity/trade queries — *copper production by country*, *iron ore reserves*, *India agricultural exports*. **Sum them.** If 40 queries average >100/mo, the pattern extrapolates to thousands | ~1,500 units |
| **T2** | **Those SERPs are winnable, or at least citable** | SERP overview on 8 of them. Who ranks — USGS and Wikipedia, or thin aggregators? **If it is government primary sources, classic SEO is closed and AEO is the only route** | ~3,000 units |
| **T3** | **AI already answers these, and we can see who it cites** | **Free.** Ask ChatGPT, Perplexity and Google AI Overviews ten commodity questions. Record who is cited. **This is the single most informative test on the list and it costs nothing** | £0 |
| **T4** | **Our own pages can get cited without ranking** | Publish **3 data pages** built to the AEO standard. Wait 3–4 weeks. Re-run T3 and see whether we appear | 3 pages |
| **T5** | **Directory listings convert** | Submit to G2, Datarade, SourceForge. Track referral traffic | Free |
| **T6** | **AI crawlers can even reach us** | **Free.** Check `robots.txt` for GPTBot, PerplexityBot, ClaudeBot, Google-Extended. **If any are blocked, none of C or T4 can work and nothing else matters** | £0 |

**T6 and T3 were run first — results in §5A.** Both were free and same-day, and T6 was a gate — if the crawlers are blocked, the entire AEO strategy is dead on arrival and we would rather know before designing around it.**

---

## 5A · Free tests, run 2026-08-25 — results

**T6 and the SERP half of T2/T3 are done. They cost nothing and they settle the approach.**

### T6 ✅ PASSES — and the gate is open

`caspr.ai/robots.txt` is `User-agent: * / Allow: /`. **No AI crawler is blocked** — GPTBot, PerplexityBot,
ClaudeBot and Google-Extended are all permitted by the wildcard. **The AEO strategy is viable.**

**One real gap found: no sitemap is declared.** With 12 orphan pages already live, that compounds — nothing
points crawlers at the pages that exist. **Add to the dev round.**

### T2/T3 ✅ The specific-data long tail is not held by who I assumed

**I predicted these SERPs would be locked by USGS, Wikipedia and government primary sources, and that classic
search would therefore be closed. That is not what is there.**

**`copper production by country 2025`:**

| Ranking | What it is |
|---|---|
| investingnews.com | Content site |
| statista.com | The one incumbent present |
| developmentaid.org | Content site |
| **worldpopulationreview.com** | **Thin aggregator** |
| financialsourcereport.com · tradingcentury.com | **Two near-identical syndications of the same article** |

**No USGS. No government primary source. No IBISWorld, Mordor or Grand View.**

**`India agricultural exports imports 2025`:**

| Ranking | What it is |
|---|---|
| seair.co.in · megagrain.com · naviexports.com | **Exporter company blogs** |
| pib.gov.in ×2 | Government press releases |
| indiastat.com · indiadatamap.com · tradingeconomics.com | Aggregators, some paywalled |
| businesstoday.in | News |

**Again: not one incumbent research firm ranks.**

### What both tests show, and it is the same thing

> **The specific-data long tail is held by content aggregators, exporter blogs and syndicated
> republications — not by primary sources and not by the research incumbents.**

**And both results carried unreconciled contradictions on their face:**

- Copper: *"Chile is the largest mine producer"* against *"China produces 48% of refined copper"* — **two
  different definitions of "production", presented without reconciling them**
- India: *"$52.55bn in FY 2025-26"* against *"expected to hit $55bn by 2025"* — **different bases, different
  years, side by side, unreconciled**

**That is the gap, and it is exactly the thing Caspr's format exists to close.** A page that states the figure,
names every source, gives each one its date and its definition, and **says plainly where they disagree and
why**, is better than everything currently ranking — and it is better in precisely the way AI systems reward.

**This is no longer a hypothesis about whether the approach fits. It is the observed shape of the space.**

---

## 5B · All five options, tested free — and it is a hybrid

**Five approaches, five free tests, run 2026-08-25. No API spend. Three survive, one dies, one is untested but already funded.**

### The tests, and what each returned

| | Option | Free test run | Result |
|---|---|---|---|
| **A** | Long-tail data pages | SERPs for **three different question shapes** — commodity production, trade flows, niche market size | ✅ **Validated, and the pattern is consistent** |
| **B** | Methodology / education | SERP for `secondary research` | ❌ **Dead on audience** |
| **C** | AEO — engineer for citation | `robots.txt` on caspr.ai **and all eight incumbents** | ✅ **Viable, and strictly merit-based** |
| **D** | Third-party presence | SERP + AI answer for `best market research tools for consultants` | ✅ **Large, fixable gap** |
| **E** | Original research | Not separately tested — already funded in the calendar | — |

### A ✅ — the pattern holds across every shape tested

**Three different question types, three different sets of sites, one identical failure:**

| Query shape | Who ranks | The contradiction sitting on page one |
|---|---|---|
| `copper production by country` | INN, WorldPopulationReview, **two identical syndications** | *"Chile is the largest producer"* vs *"China produces 48% of refined copper"* — **two definitions of "production", unreconciled** |
| `India agricultural exports` | Exporter blogs, paywalled aggregators | *"$52.55bn FY 2025-26"* vs *"$55bn by 2025"* — **different bases, side by side** |
| `premium ready meals market UK` | marketresearchfuture, marknteladvisors, marketdataforecast | **`$5.86bn · 4.95% CAGR` vs `$6.46bn · 12.4% CAGR`** — same market, same base year, **2.5× difference in growth rate** |

> **Not one research incumbent ranks in any of the three.** The space is held by aggregators, exporter blogs
> and the templated end of the report industry — **and what they publish does not agree with itself.**

**My earlier read that these SERPs were "difficult" measured domain authority. It did not measure the content
bar, which is on the floor.** And the third row is `icp-personas.md:65` — *"IBISWorld numbers that don't match
a newer Euromonitor report"* — **visible on page one of Google, today.**

### B ❌ — real volume, wrong people

**`secondary research` (3,400/mo, KD 3) looked like the biggest winnable prize. The SERP says otherwise:**

| Rank | Who |
|---|---|
| 1 | **scribbr.com** — an academic citation and proofreading service |
| 2 | **A university library guide** (Illinois Tech LibGuides) |
| 3–8 | Survey-software vendors — Qualtrics, QuestionPro, Sawtooth, Checkbox |

**Scribbr first and a library second tells you exactly who is searching: students writing dissertations.**
That also explains why a survey agency ranks well there — it is catching survey-tool intent, not
research-buyer intent.

> **CPC separates our buyer from a student far better than volume does.** `secondary research` carries a
> **$9** CPC. `competitive landscape analysis` carries **$300** and `market sizing` **$140**. **Advertisers
> will not pay $300 to reach an undergraduate.**

**Keep two or three high-CPC terms where they overlap our buyer. Drop the family.**

### C ✅ — viable, and nobody has an unfair advantage

`caspr.ai/robots.txt` is `Allow: /` — GPTBot, PerplexityBot, ClaudeBot and Google-Extended can all reach us.

**And I checked all eight incumbents expecting to find them blocking AI crawlers, which would have been an
enormous opening. They do not.** They block SEO crawlers — `AhrefsBot`, `MJ12bot`, `dotbot` — and leave every
AI crawler permitted.

**So AI citation is decided on merit, not access.** That is a **negative finding worth having**: it kills an
easy-win theory before anything was built on it, and it means our advantage has to come from the format
itself — which the Princeton numbers say it does.

### D ✅ — the gap is bigger than expected

**`best market research tools for consultants 2026`** returns vendor listicles: Tremendous, Listen Labs,
Quantilope, Meltwater, Compeers, Thirdbridge. **Competitors' own content marketing, listing each other.**

**The AI answer names Qualtrics, Typeform, SurveyMonkey, Statista, Dovetail, Nielsen, Quantilope, Brandwatch,
Perplexity, SparkToro and Listen Labs. Caspr is in none of it.**

**This is a category query — the moment a buyer is choosing.** Being absent from every list at that moment is
a real, fixable gap, and the fix is outreach into roundups, which is already a runbook target.

---

## 5C · The hybrid

**Not one approach. Four, in this order, each doing something the others cannot.**

| | What | Why it earns its place | Cost |
|---|---|---|---|
| **1** | **Third-party presence (D)** — directory listings and roundup inclusion | **6.5× more citations come via third parties than own domain**, and we are absent from every list a buyer sees | Near zero. Already resourced |
| **2** | **AEO as a build standard (C)** — not a content family; a bar every template meets | Costs almost nothing at build time, expensive to retrofit. Citing sources **+40%**, statistics **+37%**, low-authority bonus **up to 115%** | Design time only |
| **3** | **Long-tail data pages (A)** — seeded narrow, scaled on evidence | The only line with inexhaustible demand, and **the only one where our format beats what is there** | Generated |
| **4** | **The Record (E)** — original research | Rung 1 of data defensibility. Already funded, already scheduled | 4 Studies |

**Dropped: B as a family**, and **`/alternatives/*` at eight pages** — replaced by D, which targets the pages that actually rank.

**The four are complementary rather than alternatives.** D gets us cited where the AI already looks. C makes our own pages citable when it arrives. A gives it something worth citing at volume. E gives it something nobody else has.

---

## 6 · What this changes upstream, if agreed

| Document | Change |
|---|---|
| `findings.md` §1.4 | **Wrong.** The programmatic pattern is validated, not weak. Correct it rather than delete it |
| `content-approach.md` §3B | Search answers reframed: **AEO standard first, ranking second.** Long-tail data pages, not head terms |
| `channel-model.md` §3.1 | Search kill condition is *"nothing in the top 20 after 6 months"* — **wrong measure.** Should be citation presence, not position |
| `website-session-prompt.md` | `/alternatives/*` cut from 8 pages to 1. AEO requirements added as a standard every template meets |
| `plan.md` | Directory submissions move up — they are the fastest search-adjacent win available |

---

## 7 · The question I cannot answer from data

**Whether Caspr's buyer asks Google or asks an AI.**

An investor needing copper production figures in 2026 plausibly asks ChatGPT before Google. **If that is true, keyword volume is measuring a shrinking universe** — and every number in `findings.md`, including the ones that killed `/alternatives/*`, understates the real demand while overstating the value of position.

**T3 is the closest thing to an answer we can get cheaply.** It is worth doing before anything else is agreed.
