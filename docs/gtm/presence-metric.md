# `p` — the presence metric

*2026-08-25. The second top-level metric, alongside `x`. Proposed for agreement.*

> **Baseline taken 2026-08-25: `p` = 0 on every question tested.** [`presence-baseline-2026-08.md`](presence-baseline-2026-08.md) — partial (ranking and citation legs only; **the AI-surface leg is still to run and is unrecoverable after launch**).

---

## 1 · What it is

> **One basket per ICP. Each month, ask every question in it. `p` for that ICP is the share where Caspr
> appears in the answer.**

**`x` measures whether the machine pays for itself. `p` measures whether we exist at the moment the buyer
looks.** One is lagging and commercial; the other is leading and cannot be bought.

**`p` is reported per ICP and never aggregated into a single figure** — §4.1.

**Baseline today is honestly zero.** Every test run on 2026-08-25 found Caspr absent — from the AI-tools answers, from the roundups, from all seven SERPs.

---

## 2 · The five rules that keep it honest

**A metric like this degrades into a vanity number unless the construction rules are fixed before anyone starts optimising against it. These are those rules.**

### 2.1 Unbranded only

**No question in the basket may contain "Caspr".** Branded queries measure whether people who already know us can find us — which is not the problem. **Every question is one a buyer asks who does not know we exist.**

### 2.2 The basket is frozen for a year

**Questions are added or removed once a year, in a scheduled review, never in-flight.** The failure mode is obvious and gradual: a basket that quietly drifts toward the questions we happen to win. **Freezing it is the whole defence.**

**If a question turns out to be badly chosen, it stays until the annual review and the error is noted.** A metric you can edit when you dislike the reading is not a metric.

### 2.3 It must survive the CPC test

**No question a student would plausibly ask.** `secondary research` carries a $9 CPC and returns Scribbr and a university library; `competitive landscape analysis` carries $300. **Advertisers will not pay $300 to reach an undergraduate**, and that is the cleanest available filter.

### 2.4 Phrased as a person asks, not as a keyword

**AI queries are longer, more natural and more specific than search queries.** The basket is phrased the way someone actually asks — *"where do I get defensible market size data for due diligence"*, not *"market size data"*. **A basket written in keyword-ese would measure the wrong universe**, which is the error that produced the first round of this analysis.

### 2.5 Sourced, not invented

**Where a question has a persona line behind it, the line is recorded.** Where it does not, it is marked as constructed. **This exists because the last keyword list was 45 terms I made up**, and measuring an invented list taught us nothing except that I invent badly.

---

## 3 · What counts as "appears"

**Three ways, weighted equally, because they mean the same thing to the buyer: *Caspr was there when I looked.***

| | Counts |
|---|---|
| **Cited in an AI answer** | Named, with or without a link. **A mention without a link still counts** — the buyer saw the name |
| **Listed in a third-party page that ranks page one** | A roundup, a directory, a comparison. **This is where 6.5× of citations come from** |
| **Our own page ranks page one** | Page two does not count. Nobody looks |

**Surfaces checked, each recorded separately:** ChatGPT · Perplexity · Google AI Overview · Google page one.

**No weighting between surfaces.** We have no basis for one, and an invented weight would be the first thing to argue about when the number is inconvenient.

---

## 4 · The baskets — one per ICP, over a shared core

**Structure: a 15-question CORE that every ICP asks, plus a 35-question JOB basket specific to that buyer.**
**`p` for an ICP is measured across all 50 — their core plus their job questions.**

**Why a shared core rather than fully separate baskets.** Tool selection, permission and cost are asked in
almost identical words by every buyer — *"best AI tool for market research"* is not an investor question or a
consultant question, it is a category question. **Writing it into eight baskets would triple the work and make
cross-ICP comparison meaningless**, because any difference would partly reflect how differently we happened to
phrase the same thing.

**The core is what makes the ICPs comparable. The job basket is what makes each one actionable.**

**Adding an ICP is 35 questions, not 50** — which is what makes widening a configuration change rather than a
project, per the standing rule.

### 4.1 ⛔ There is no single aggregate `p`, deliberately

**Do not average across ICPs.** Two reasons, and the second is decisive:

- **Averaging would import a weighting we cannot justify.** Equal weights contradict the ICP prioritisation
  in `plan.md` §1; MRR weights would smuggle revenue assumptions into a metric whose whole purpose is to be
  independent of revenue
- **Presence is not fungible.** Visible to investors and invisible to consultants is **not "half visible"** —
  it is a specific state with a specific fix. **An average is the one number that hides which.**

> **This is already how `x` works.** `x_netnew`, `x_reengagement` and `unattributed` are reported separately
> and never blended, because blending lets one flatter another. **`p` follows the same rule for the same
> reason.**

**Report as a short vector: `p_investors`, `p_consultants`** — and later `p_agencies`, `p_strategy` as those
open. Top-level does not have to mean scalar.

### 4.2 What gets built now

| Basket | Status |
|---|---|
| **CORE** · 15 | **Write now.** Shared by every ICP |
| **Investors** · 35 | **Write now.** Launch ICP |
| **Consultants** · 35 | **Write now.** Launch ICP |
| Agencies · 35 | **Write when it opens, week 6.** Not before |
| Strategy · 35 | **Write when it opens, week 8** |
| MR · Founders · Category · Academic | Only if they ever become active |

**Deliberately not writing the other five now.** Rule 2.2 freezes a basket for a year — **writing questions for
an ICP we are not serving would freeze them against a strategy that may well change before we get there.**

---

### CORE · 15 — asked in near-identical words by every ICP

**These are category questions, not buyer questions.** They are what make `p` comparable across ICPs.

#### C1–C6 · Tool and category selection
*The highest-intent moment in the set: someone is choosing a tool.*

| | Question |
|---|---|
| **C1** | best AI tool for market research |
| **C2** | best AI deep research tool |
| **C3** | which AI actually cites its sources for business research |
| **C4** | is there an AI that does proper market analysis, not just summaries |
| **C5** | AI market research tools compared |
| **C6** | alternatives to IBISWorld |

#### C7–C11 · Permission and compliance
*The most universal objection in the persona research, and the one nobody has written for. **Asked in near-identical words by every buyer**, which is why it is core rather than per-ICP.*

| | Question | Source |
|---|---|---|
| **C7** | can I use AI research in work I hand to a client | `:95` |
| **C8** | can I cite AI-generated research in a formal memo | `:276` |
| **C9** | is AI-generated market research reliable enough for a board | — |
| **C10** | what does compliance need in order to approve a research tool | `:276` |
| **C11** | will my firm allow a third-party AI research tool | `:94` |

#### C12–C15 · Cost and substitution

| | Question |
|---|---|
| **C12** | how much does market research cost |
| **C13** | cost of a single industry report |
| **C14** | is an IBISWorld subscription worth it |
| **C15** | cheaper ways to get industry reports |

---

### INVESTORS · job basket — 35
*ICP 3. **`p_investors` = these 35 + the 15 core.** Sourced to `icp-personas.md` where marked.*

**Fifteen shown. The remaining twenty extend these shapes across the sectors the fund actually screens** — written once, with the sector list, at basket freeze.

| | Question | Source |
|---|---|---|
| **I1** | SaaS revenue multiples by sector | *observed live: `8.5x NTM` vs `3.3x TTM`, unreconciled* |
| **I2** | where do I get defensible market size data for due diligence | — |
| **I3** | how do I size a market for an IC memo | `:255` |
| **I4** | how to do commercial due diligence on a sector quickly | — |
| **I5** | comparable company multiples for a private software business | — |
| **I6** | how do I check whether a market size number is credible | `:74` |
| **I7** | reliable source for industry growth rates | — |
| **I8** | sector primer for a deal I am screening | — |
| **I9** | TAM for a B2B software company | — |
| **I10** | market entry analysis for an investment thesis | — |
| **I11** | how do smaller funds get the research data the large ones have | `:261` |
| **I12** | AI research tool for investment analysis | — |
| **I13–I15** | **Sector shapes** — *EV charging market size · industrial valves market Saudi Arabia · copper production by country* | representatives of the long-tail family |

---

### CONSULTANTS · job basket — 35
*ICP 1. **`p_consultants` = these 35 + the 15 core.***

| | Question | Source |
|---|---|---|
| **K1** | how to get up to speed on an industry in two days | `:347` |
| **K2** | competitive landscape analysis for an unfamiliar sector | — |
| **K3** | industry primer for a client pitch | — |
| **K4** | where to find market data I can cite in a client deck | `:74` |
| **K5** | how to research a sector I have never covered | `:64` |
| **K6** | credible market data sources for consulting work | — |
| **K7** | what market data can I put in a client deliverable | — |
| **K8** | how to build a competitive landscape quickly | — |
| **K9** | sources for market sizing in a strategy project | — |
| **K10** | how do I avoid spending four hours for three usable numbers | `:57` |
| **K11** | industry analysis with citations I can defend | — |
| **K12** | tools for desk research in consulting | — |
| **K13** | what do consultants use instead of buying industry reports | — |
| **K14–K15** | **Sector shapes** — *UK ready meals market size · desk research for a sector with no syndicated coverage* | `:536` |

---

### The sector-shape cap

**No more than 5 of any 35-question job basket may be a specific data question.**

They are the least buyer-specific questions in the set — *copper production by country* is asked by analysts,
students, journalists and the merely curious alike. **Capping them keeps `p` a measure of buyer presence
rather than of traffic**, while still testing whether the data-page play works at all.

---

## 5 · How it is read

**Monthly. Reported four ways:**

| Cut | Why |
|---|---|
| **`p` per ICP** | **The headline. There is no overall figure** — §4.1 |
| **Core vs job basket**, within each ICP | **The most diagnostic cut available.** Strong core and weak job means we are visible as a category player but not at the moment of the actual task. Weak core and strong job is the reverse |
| **By block** — tool selection, permission, cost, sector shapes | Tells us *which play* is working. Tool selection is roundup outreach; sector shapes are the data pages |
| **By surface** | ChatGPT vs Perplexity vs Google. The levers are not the same |

### 5.1 Against `x`

| | Reading |
|---|---|
| `p` up, `x` follows | Working as designed |
| **`p` up, `x` flat** | Visible and not persuasive. **A conversion problem, not a reach problem** |
| **`x` up, `p` flat** | Revenue is coming from outreach and network. **Discoverability is not earning its budget** |
| Both flat | Nothing is working |

**This is the pair's real value.** `x` alone cannot distinguish *"nobody sees us"* from *"they see us and are not convinced"* — and those call for opposite responses.

### 5.2 No threshold yet, deliberately

**`x > 2` has a basis: below it the machine is RoI-negative at a 50% margin.** **`p` has no equivalent basis, and inventing one would be false precision.**

**Measure for one quarter, then set it.** The first three readings establish the baseline and the achievable slope; a threshold set before that would be a number someone made up, which is what this document exists to avoid.

---

## 6 · How it is measured — automated from the first reading

**Two ICPs × 50 questions × 4 surfaces = 400 checks a month**, or **340 actual** since the 15 core questions
are asked once and counted for both.

### 6.1 Automate from reading one, not after a manual pilot

**The first reading is the baseline.** A manual month one and an automated month two are not comparable — it
would **bake a methodology change into the first delta** of a metric whose entire value is the trend.

**And the manual work is not judgement, it is access.** Nobody is deciding whether we appeared; someone is
opening four tabs fifty times, because two of the four surfaces have no clean programmatic door:

| Surface | Programmatic access |
|---|---|
| **Perplexity** | **Good** — a real API that returns citations |
| **Google page one** | **Workable** — fetch and parse, fighting anti-bot |
| **Google AI Overview** | **Poor** — not reliably present in a normal SERP fetch |
| **ChatGPT** | **Poor** — the consumer product's web-search behaviour is not what the API returns |

### 6.2 Buy the observation, build the definition

**This is a solved problem with purpose-built tools** — Otterly, Peec, ZipTie, LLMrefs track brand citation
across ChatGPT, Perplexity and AI Overviews, roughly **$50–200/month.**

**Building it ourselves means a Perplexity integration, a paid SERP API for AI Overviews, and something
fragile and terms-questionable for ChatGPT — plus permanent maintenance on all three. We are not in the
AI-visibility-monitoring business.**

**But a bought tool tracks *its* definition of presence, not ours.** Most return a brand-mention percentage.
We need three ways to appear, four surfaces recorded separately, per-ICP baskets, and **no aggregate.**

> **Buy the observation. Build the thin layer that applies our definition.** The tool answers *"did Caspr
> appear for this query on this surface"*; a small scheduled job maps that onto the baskets and computes
> `p_investors` and `p_consultants` our way. **A day of work, not a project — and the metric stays ours.**

**Two things to check before committing to a vendor:**

- **Custom query baskets.** Several are keyword-list based, which is exactly what we need. A tool that only
  tracks a fixed category taxonomy cannot run our basket
- **API or export.** **A dashboard we have to read by hand recreates the problem we are solving**

**Shortlist two, trial both against the same 50 questions for one month, keep whichever supports custom
baskets and exports.** **Perplexity's own API as a backstop regardless** — it is cheap and it covers one
surface properly whatever else we choose.

**Automation must be live before Agencies opens in week 6**, when the basket count doubles to 620 checks and
any manual fallback stops being viable.

---

## 7 · Open for agreement

| | |
|---|---|
| **1** | **Does a mention without a link count?** I say yes — the buyer saw the name. It is a judgement, and it should be settled before the first reading rather than after an inconvenient one |
| **2** | ~~Is 50 the right size~~ — **agreed, and now 50 *per ICP*** over a shared 15-question core (Joy, 2026-08-25) | ✅ |
| **3** | ~~How many sector-shape questions~~ — **capped at 5 of 35 per basket.** They test the data-page play without letting it dominate a buyer-presence metric | ✅ |
| **4** | **Who owns the monthly reading?** It is 2 hours manual, near zero automated, and it is a **top-level metric** — it should not sit with whoever has spare time |
