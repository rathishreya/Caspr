# OD-10 — research brief for a parallel session

**Paste the block below into a fresh session.** It is self-contained. The output comes back here and unblocks the
comparison folds across the site.

---

## THE PROMPT

You are doing market research for Caspr (https://caspr.ai) — an Analytical AI product that produces
analyst-grade research reports in about 15 minutes, cited to source. Prices: **$15** (Brief, 3–5 pages), **$80**
(Study, ~100 pages), **$300** (Intelligence, multi-model, up to 24 hours).

### Why this matters

Caspr's website is being rebuilt. Its central problem is **the wrong price anchor**: visitors mentally compare
Caspr to a $20/month LLM, which makes $80 look expensive. The fix is to anchor against **the research people
actually buy** — syndicated reports and commissioned studies.

The comparison must be a **cited case study, not a range**. Caspr's entire brand claim is that it cites every
insight to a credible source; a comparison table with invented or unsourced competitor prices is the one place
that claim can be destroyed. So every number you return must be **publicly verifiable and linkable**.

### Your task

Find **one real, buyable, citable comparable report for each of the nine buyer contexts below.** For each one,
identify the specific published report a buyer in that context would realistically purchase to answer a
realistic question — then capture everything needed to cite it.

| # | Buyer context | The kind of question they are answering |
|---|---|---|
| 1 | Consulting associate | A competitive landscape in a sector they do not cover |
| 2 | Corporate strategy team | Market context for a strategic options paper or market-entry decision |
| 3 | PE/VC investor | Sector context for screening a deal or building an investment thesis |
| 4 | Corporate development / M&A | Target identification and market mapping in a sector |
| 5 | Agency strategist | Industry depth for a new-business pitch in an unfamiliar category |
| 6 | Startup founder | Market sizing / TAM defensible enough for a VC meeting |
| 7 | Market research professional | Category or geography context to scope a client proposal |
| 8 | Category / commercial manager (retail, FMCG) | A category review — size, growth, competitors, trends |
| 9 | Graduate student | An industry primer for a case competition or dissertation chapter |

### For each of the nine, return

- **Report title** (exact, as published)
- **Publisher** — e.g. Mintel, IBISWorld, Euromonitor, Statista, GlobalData, Gartner, Forrester, PitchBook,
  Grand View, MarketsandMarkets, Frost & Sullivan
- **List price with currency**, and the **date you observed it**
- **Publication / last-updated date** of the report itself
- **Page count**, if published
- **Direct URL** to the page showing that price
- **What question it actually answers** — in one sentence, in the publisher's own framing
- **What it does not answer** for this buyer — the gap that forces triangulation
- **Whether a single report is enough**, or the buyer realistically needs two or three, and why
- **The Caspr equivalent**: which rung ($15 / $80 / $300) and why

### Also return, for each

**The exact one-line prompt a user would type into Caspr** to get the equivalent analysis — phrased the way that
buyer would actually ask it, not as a keyword string. These will be run through Caspr to produce shadow reports
for a side-by-side comparison, so they must be genuinely equivalent in scope to the purchased report.

### Also find, separately

**Commissioned custom research** — what an agency or consultancy charges to run a bespoke study answering one
specific question, and how long it takes. Give a defensible range with sources (published rate cards, industry
association surveys, procurement guidance, credible trade press). This is the second column of the comparison.

### Quality bar — read before starting

- **Verifiable or excluded.** If the price is behind "contact us" and appears nowhere public, say so and find a
  different report. Do not estimate, do not infer from a competitor, do not use a figure from a blog post that
  itself has no source.
- **Subscription-only products need flagging.** Euromonitor Passport and similar have no single-report price.
  Either find a single-report SKU or note explicitly that the entry cost is an annual subscription, with its price.
- **Currency and date matter.** Prices move; record what you saw and when.
- **Recency counts against them, fairly.** A report published 18 months ago is genuinely older data — record the
  date, do not editorialise.
- **Be honest about where the report wins.** Some carry proprietary panel data, primary fieldwork, or
  transaction databases Caspr does not have. Note it. Caspr's comparison pages are meant to be honest, and
  overclaiming here would be the exact failure the brand cannot afford.
- **No fabrication under any circumstances.** If you cannot find nine, return the ones you verified and say which
  are missing. Eight sourced beats nine with one invented.

### Output format

1. A **summary table** — buyer context · report · publisher · price · date · rung
2. A **detail block per report** with every field above and the URL
3. A **citation line per report**, publication-ready, in the form:
   *Publisher, "Title", £/$X, published Month Year. Observed DD Mon 2026.*
4. The **nine Caspr prompts**, as a clean list
5. The **commissioned-research** section with its sources
6. A **notes** section: anything that surprised you, any context where the comparison is weak, and any report
   that beats Caspr on a dimension worth conceding

---

## What happens next

1. The nine Caspr prompts get run to produce shadow reports.
2. Report and shadow report come back here as matched pairs.
3. Each pair becomes the cited case study on the matching use-case and ICP page, per
   [`site-truth.md`](site-truth.md) §1.3.
4. The citation resolves on the relevant [`/vs/`](phase-b-fold-map.md) page — which is what finally gives those
   nine orphaned pages a job.

**Re-check cadence once live: quarterly.** Prices move and publication dates age; a stale citation is worse than
no citation.
