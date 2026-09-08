# Ahrefs — what to pull, in order

*2026-08-25. Work through this once; drop every export in `docs/seo/exports/`.*

**Format: CSV, UTF-8.** Filenames matter — they are how I match an export to its purpose. Each pull below names the file.

**Do them in the order given.** Standard has a monthly export allowance, and pull 1 is worth more than the rest combined. If the allowance runs out, it should run out at the bottom of this list rather than the top.

---

## 1 · Competitor organic keywords — the pull that matters most

> **This is the reason we bought the tool.** It replaces guessing a keyword list with taking the one that already works for the incumbents.

**Site Explorer → [domain] → Organic keywords → Export**

| Domain | Why it is on this list |
|---|---|
| `ibisworld.com` | The buyer's mental shelf. Named unprompted in four persona sets |
| `statista.com` | Same shelf, different shape — subscription rather than per-report |
| `mintel.com` | Named in the personas |
| `euromonitor.com` | Named in the personas |
| `mordorintelligence.com` | $4,750 sector reports — our closest price comparable |
| `researchandmarkets.com` | The aggregator. Vast keyword surface |
| `grandviewresearch.com` | Publishes at the same tier |
| `driveresearch.com` | **Ranks #1 for "how much does market research cost."** A small agency beating everyone on our best commercial query |
| `thefarnsworthgroup.com` | Same SERP, same shape |

**Filters, applied to every one:**

- **Position 1–20** *(page 1–2 only — beyond that it is not driving traffic)*
- **Volume ≥ 50/month**
- **Exclude branded** — keyword does not contain the company's own name

**Columns to keep:** `Keyword` · `Volume` · `Keyword Difficulty` · `CPC` · `Current position` · `Current URL` · `Current traffic` · `SERP features`

**Save as:** `exports/organic--{domain}.csv` — e.g. `organic--ibisworld.com.csv`

**What I do with it:** cluster across all nine, strip anything only a subscription business can answer, and rank what remains by volume against difficulty. **That produces the real page list, in place of the one we assumed from persona research.**

---

## 2 · Content gap — what they all rank for and we do not

**Site Explorer → `caspr.ai` → Content gap →** add `ibisworld.com`, `statista.com`, `mintel.com`, `driveresearch.com`, `mordorintelligence.com`

Set to **"intersect: at least 3 targets rank"** and export.

**Save as:** `exports/content-gap.csv`

**Why:** a query three separate incumbents all rank for is a query the category rewards. **This is the shortest path to what we are missing.**

---

## 3 · Our candidate list — volume and difficulty on what we already planned

**Keywords Explorer → paste the list → Export "Matching terms"**

Paste these, plus anything the SEO practitioner wants to add:

```
ibisworld alternatives · statista alternatives · mintel alternatives
euromonitor alternatives · pitchbook alternatives · gartner alternatives
cheaper alternative to ibisworld · market research subscription cost
how much does market research cost · market research report cost
cost of a market research study · industry report cost
market size of · market sizing report · competitive landscape analysis
due diligence checklist sector · industry primer · tam analysis
market research for consultants · desk research tool
can i use ai for my dissertation · ai policy market research
is it ok to use ai for research · citing ai generated research
ai research tool compliance · procurement category research tools
what is analytical ai · what is a market sizing report
boardroom ready report · what is desk research
```

**Columns:** `Keyword` · `Volume` · `KD` · `Global volume` · `Parent topic` · `SERP features` · `Clicks` · `CPS`

**Save as:** `exports/candidates.csv`

**Why:** this tells us which of our assumed pages are worth building. **I expect a meaningful share of them to have no volume at all** — the permission-layer queries especially, which I claimed had "real search volume" with nothing behind it.

---

## 4 · SERP overviews — who owns the query

**Keywords Explorer → click each keyword → SERP overview → Export**

Only these eight, and only if the allowance permits:

`ibisworld alternatives` · `statista alternatives` · `how much does market research cost` ·
`market research report cost` · `competitive landscape analysis` · `market sizing report` ·
`can i use ai for my dissertation` · `desk research tool`

**Save as:** `exports/serp--{keyword-with-hyphens}.csv`

**Why:** a free search already showed that **"IBISWorld alternatives" is owned end-to-end by G2, Slashdot, SourceForge and Datarade** — no vendor page ranks. If that pattern holds across the alternatives family, **the right move is getting listed on those directories rather than building eight pages**, and that is a scope decision worth several weeks.

---

## 5 · Our own baseline

**Site Explorer → `caspr.ai` → Overview → Export**, plus **Organic keywords** and **Backlinks**

**Save as:** `exports/caspr--overview.csv`, `exports/caspr--organic.csv`, `exports/caspr--backlinks.csv`

**Why:** we have no baseline at all. This is also the only pull that stays useful after the subscription lapses — **set up Ahrefs Webmaster Tools for `caspr.ai` while you are in there. It is free, permanent, and covers this pull forever.**

---

## What I do not need

**Rank tracking, site audit, alerts, and anything requiring the subscription to stay live.** This is a one-month research pass, not a monitoring setup — Search Console covers monitoring, free.

---

## Then

Drop the files in `docs/seo/exports/` and say so. I will read them directly and produce:

1. **The real page list**, ranked by volume against difficulty, replacing the assumed one
2. **A verdict on `/alternatives/*`** — build the pages, or pursue directory listings instead
3. **Which permission-layer pieces have search volume** and which are conversion-only
4. **The programmatic template families** worth building, with their query counts
5. **A corrected `icp-pages-seo.md`** — titles and descriptions written against measured keywords rather than assumed intent

**Two things I will be checking my own work against:** I claimed the permission-layer queries have "real search volume" without a source, and I assumed the `/alternatives/*` family was worth eight pages. **Both were assumptions and both are now testable.**
