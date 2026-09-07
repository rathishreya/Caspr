# Website structure — the tree

*2026-08-26. For alignment before the copy pass. Supersedes the page hierarchy in
[`.agents/website-architecture.md`](../.agents/website-architecture.md), which is dated 2026-05-14 and predates
the taxonomy, the offer, the launch ICPs and the search decision.*

**Derived from:** `docs/product/document-taxonomy.md` §A (the facet model) · `docs/seo/decision.md` §2–3B ·
`docs/gtm/content-approach.md` §2–3 · `docs/gtm/guerrilla-campaign-plan.md` §4 ·
`docs/gtm/launch-plan.md` §4A · `docs/gtm/presence-metric.md` §4 · `docs/entry-routes-and-cta.md` ·
`docs/site-truth.md` §2–3.

---

## 0 · The correction this structure exists to fix

The site organised its product layer as **three tier pages** — `/analyses/brief`, `/analyses/study`,
`/analyses/intelligence`. That is the **Tier** facet, and it is the one facet a buyer never says out loud.

> `document-taxonomy.md:81` — **"This is the level users actually name (nobody says 'a Market Research'; they
> say 'a competitive landscape')."**

The real model is a cascade: **Type (5) → Sub-type (22) → Tier (3).** The **sub-type** is what people search,
name and buy. It is also where the commercial CPC sits — `seo/decision.md` §2 puts `competitive landscape
analysis` at **$300 CPC** (a buyer) against `secondary research` at **$9** (a student).

**So the sub-type layer becomes the site's SEO spine, and depth collapses to one explainer.**

**Legal Document is excluded entirely** — no type page, no sub-types, no use cases, no nav entry (Joy,
2026-08-26). It is the one exception to the coming-soon rule below.

**Everything else that is not yet built still ships, tagged `Coming soon`.** The intent is one comprehensive
build that holds for a year: as features land, the team deletes a tag rather than commissioning a page.

---

## 1 · Legend

| | Lean | Skills that own it |
|---|---|---|
| 🔍 | **SEO-led** — earns the visit | `seo-audit` · `ai-seo` · `schema-markup` · `programmatic-seo` · `content-strategy` |
| 🎯 | **CRO-led** — converts the visit | `page-cro` · `copywriting` · `marketing-psychology` · `pricing-strategy` |
| ⚖ | **Both** — ranks *and* closes | all of the above |
| 📚 | **Authority** — earns citations and links, not conversions | `content-strategy` · `ai-seo` |
| ⚙ | **Utility / compliance** — no optimisation target | `legal` · `copy-editing` |

---

## 2 · The tree

```
caspr.ai/
│
├── /                                    🎯  Homepage
├── /pricing                             🎯  Research Budget, ladder, plan gating, FAQ
├── /enterprise                          🎯  Pooled budget, SSO, API, Projects, house template
├── /about                               🎯  Founder story, what Caspr is, why it exists
├── /security                            ⚖   Certifications, data room, zero training, retention
├── /samples                             🎯  Three real reports — the proof gate
│   └── /samples/[slug]                  🎯  One report, read-only, "run this on your topic"
│
├── SOLUTIONS — who you are (9)          🎯 primary · 🔍 secondary
│   ├── /consulting                          ICP 1 — secondary launch ICP
│   ├── /strategy                            ICP 2
│   ├── /investors                           ICP 3 — PRIMARY launch ICP
│   ├── /agencies                            ICP 4
│   ├── /startups                            ICP 5
│   ├── /market-research                     ICP 6 — ships, no homepage real estate
│   ├── /category-managers                   ICP 7
│   ├── /academic                            ICP 8 — academic pricing
│   └── /corporate-dev                       ICP 2b — the strategic acquirer lens
│
├── USE CASES — what you need                🔍
│   │
│   ├── TYPE pages (3)
│   │   ├── /use-cases/market-research        Desk research on curated public sources
│   │   ├── /use-cases/business-case          Your own case — raise, sell, approve
│   │   └── /use-cases/investment-deal        The investor's decision — back or buy them
│   │
│   └── SUB-TYPE pages (18) — THE SEO SPINE
│       │
│       ├── Market Research (10)
│       │   ├── /use-cases/industry-primer
│       │   ├── /use-cases/competitive-landscape      ← $300 CPC, highest commercial intent
│       │   ├── /use-cases/market-sizing              ← "TAM", the founder + investor query
│       │   ├── /use-cases/company-profile
│       │   ├── /use-cases/executive-profile
│       │   ├── /use-cases/country-market-conditions
│       │   ├── /use-cases/category-review
│       │   ├── /use-cases/regulatory-overview
│       │   ├── /use-cases/market-entry
│       │   └── /use-cases/trend-analysis
│       │
│       ├── Business Case (4)
│       │   ├── /use-cases/pitch-deck
│       │   ├── /use-cases/sales-deck
│       │   ├── /use-cases/board-paper
│       │   └── /use-cases/strategic-options
│       │
│       ├── Investment & Deal (3)
│       │   ├── /use-cases/sector-screen
│       │   ├── /use-cases/ic-memo
│       │   └── /use-cases/due-diligence
│       │
│       └── Academic (1)
│           └── /use-cases/literature-review
│
├── /analyses                            🎯  ONE page. How depth works
│                                            (/analyses/brief|study|intelligence → 301 here)
│
├── COMPARISON (11)                      🔍
│   ├── /alternatives                        ONE page, not eight (seo/decision §2)
│   ├── /vs                                  Index — the internal-linking hub
│   └── /vs/{chatgpt, perplexity, consulting-firms, gartner,
│            statista, mintel, euromonitor, ibisworld, pitchbook}
│
├── TRUST — the permission layer (6)     ⚖
│   ├── /trust/what-caspr-is
│   ├── /trust/client-deliverables
│   ├── /trust/citing-sources
│   ├── /trust/dissertation
│   ├── /trust/procurement
│   └── /trust/is-it-cheating
│
├── DATA (2 + 40 seeded)                 🔍  Generated, not written
│   ├── /market-size                         Index — every generated page
│   └── /market-size/[sector]-[geography]    Template, 3 states + the Age module (§4)
│
├── THE RECORD                           📚  The publication
│   ├── /the-record                          Index + subscribe (ungated, no account)
│   ├── /the-record/[issue]                  One issue + its atom
│   └── /the-record/age-of-the-numbers       The standing monthly index (§4)
│
├── PRODUCT (7)                          🎯
│   ├── /product                             What Caspr is, end to end
│   ├── /data-room                           Upload your own files — private by default
│   ├── /outputs                             Formats, editing, edit credits
│   ├── /visuals                             Charts and framework infographics
│   ├── /languages                           Native generation      · Coming soon
│   ├── /roadmap                             Named, undated
│   └── /insights                            Dashboards             · Coming soon
│
├── RESOURCES
│   ├── /blog                            🔍  Index
│   │   └── /blog/[slug]                 🔍
│   ├── /glossary                        🔍  Answer-engine surface (channel-model §3.1)
│   │   └── /glossary/[term]             🔍
│   └── /customers                       🎯  Testimonials — blocked until real ones land
│
└── UTILITY & LEGAL                      ⚙
    ├── /careers · /contact                  Footer already links both — must exist or 404
    ├── /privacy · /terms · /refund · /gdpr
    ├── /ai-disclosure                       EU AI Act Art 50
    └── /404
```

**~110 URLs. ~10 templates.** Sub-types share one, `/vs` one, trust one, market-size one, glossary one,
Record one. That ratio is what makes "comprehensive, then leave it alone for a year" buildable.

---

## 3 · What each page contains

### 3.1 Core — 🎯 CRO

| Page | Contents |
|---|---|
| **`/`** | Hero *"Not an assistant. An analyst."* · how it works · the engine · multilingual · **what research costs** (OD-10 cited) · pricing · what arrives · testimonials · final CTA. **Proof skews to an IC memo and a client deck** — the two launch ICPs |
| **`/pricing`** | Research Budget mechanics · what research costs · the three plans with milestone gating · **over time** (the retention argument) · the ladder table by type · 8 FAQ · enterprise strip |
| **`/enterprise`** | Pooled budget · SSO · API · Projects · data room · house template as a quoted service · plan detail · contact sales |
| **`/about`** | Founder story · what Caspr is · why it exists · the analyst-house position |
| **`/security`** | Certifications (audited, not self-reported) · your data room · zero training · retention & deletion · 8 FAQ verbatim from `security-posture.md` §9 |
| **`/samples`** | Three real reports, ungated. The proof gate that unlocks paid spend |

### 3.2 Solutions — 🎯 primary, 🔍 secondary

Nine pages, **one template, eight different wounds.** Each: approved hero from `icp-copy.md` v3 · the problem
(three persona cards in the reader's own words) · how it works · output showcase · **written in your register** ·
what research costs (that ICP's cited comparable) · **the ladder block — every deliverable type that ICP
actually buys** · what arrives · objections ×3 · FAQ ×5 · final CTA.

**`/investors` and `/consulting` get extra passes** — `plan.md` §1.

### 3.3 Type pages — 🔍

Three. Each is the parent of its sub-types: what this type of work is · who commissions it · the sub-types
beneath it as links · the rung names and prices for this type · one worked example · CTA.

**These exist for internal linking and for the type-level query.** The volume is on the sub-types.

### 3.4 Sub-type pages — 🔍 **the SEO spine**

Eighteen, one template. Each answers a job-shaped query in the reader's own vocabulary:

- **The question this answers**, phrased as the buyer phrases it
- **What arrives** — sections, length, the charts specific to this sub-type
- **Which depths it comes in** — with the type's rung names, and availability exceptions stated
  (*Market Sizing has no Brief · Executive Profile has no Intelligence · pitch decks have no $300 rung*)
- **A real worked example**
- **What it costs against the alternative** — cited, from `od-10-results.md`
- **AEO block** — the question answered in one paragraph, first, for citation
- **CTA** — pre-filled with a question of this sub-type

**Titled in the reader's words, not ours** — the Lingo table in `document-taxonomy.md` gives the aliases:
*industry primer · TAM · IC memo · DD · category review · lit review.*

### 3.5 Comparison — 🔍

**`/alternatives`** — one page, not eight. `seo/decision.md` §2 cut it: ~490 searches/month across all eight
and G2 owns those SERPs. What survives is the honest shelf comparison, with real prices from
`od-10-results.md` §1, each carrying **currency, region and observation date**.

**`/vs/*`** — nine, rewritten to current positioning and linked. **The only sanctioned home for the generative
contrast.** Honest structure: where Caspr wins, and where it does not — real-time news, primary research,
qualitative fieldwork.

### 3.6 Trust — the permission layer — ⚖

Six evergreen pages answering *"is this allowed?"*, which appears in **all six** objection tables. Also a
direct answer to `presence-metric.md` basket item **C8** — *"can I cite AI-generated research in a formal
memo"*.

**The constraint on all six:** describe what Caspr **is and does** — where inputs go, what is retained, what
is never trained on. **Never interpret the reader's own obligations.**

### 3.7 Data — 🔍 generated

**`/market-size/[sector]-[geography]`** — three states, and the second is the differentiator:

| State | Shows |
|---|---|
| Found, agreed | Figure · unit · period · basis · publisher · date |
| **Found, disagreeing** | **All credible candidates side by side. Never averaged, never resolved** |
| `not_found` | *"No credible published source gives a market size for this. That is not a gap in our data — it is the reason this analysis has to be built rather than looked up."* |

Plus **the Age module** (§4), `Dataset` + `Organization` JSON-LD, and a pre-filled CTA. **No gate, no email
capture, no account ask anywhere on these pages.**

### 3.8 The Record — 📚

**The publication.** `launch-plan.md` §2 — the launch is not *"software is available"*, it is *"an analyst
house has started publishing, and the research is free and fully cited."*

- **`/the-record`** — index, plus **subscribe**. An email list that is *not* a signup list: people who will
  not create an account will subscribe to research
- **`/the-record/[issue]`** — the issue in full, ungated, plus **the atom**: one chart or number that stands
  alone, legible in two seconds, carrying its own source line. *"The citation line is the distribution
  mechanism"*
- **Minimal branding, compulsory attribution.** The more it is branded the less it travels

**Nothing here is gated.** `launch-plan.md` §4A.6 — a gate stops a forward dead, and the forward is the
entire mechanism.

---

## 4 · The staleness index — what it is, and where it goes

### 4.1 What it is

**By sector: how old the most-cited market figure actually is.** The canonical number for a category, who
published it, when, and how many other sources have since repeated it without re-measuring.

| Column | Content |
|---|---|
| Sector | GICS sector / sub-industry |
| **The figure in circulation** | The market size that appears most often |
| **Publisher** | Who actually measured it |
| **Published** | Date |
| **Age** | In months, at time of publication |
| **Repetitions** | How many publications carry it without new measurement |

**Why it works:** it is the one structural advantage turned into a recurring event. Checkable, un-rebuttable,
and it needs no judgement about anyone's work. `od-10-results.md` §1A.2 already holds the first real entry —
a Mordor report **published May 2025, on sale at full price in August 2026**, with a forecast window opening
in a year that has already passed.

### 4.2 Where it lives on the website — **not a page family**

This is the part I had wrong. It is **a module plus a recurring issue**, not a section:

| | Surface | Role |
|---|---|---|
| **1** | **A module on every `/market-size/[sector]-[geography]` page** | **The permanent, per-sector, linkable surface.** This is the primary home |
| **2** | **`/the-record/age-of-the-numbers`** | The monthly issue that **summarises** surface 1 across sectors |
| **3** | **The atom** — one sector row as a standalone card with its source line | What actually travels |

**Why per-sector rather than per-issue.** *"A general index is interesting. 'Here is yours' is shareable."*
Consumer people share the consumer row; healthcare people share theirs. Each row is a specific, checkable
fact about a number that reader has personally repeated.

**It pairs with the disagreement state.** One page says: *here is the number everyone repeats, published N
months ago by X, carried in M other publications — and here is what the credible sources actually say today,
three of which do not agree.* That is *"every source, credible; every claim, triangulated"* rendered as a
page.

### 4.3 The copy rules — non-negotiable

| | Rule |
|---|---|
| **1** | **The published word is `Age`.** *"Staleness"* is the internal name and never appears in copy. The piece is *how old the numbers are* |
| **2** | **State facts. Never judgement.** Publisher, date, age. Never *outdated*, *stale*, *unreliable* |
| **3** | **Where a figure is current, say so.** An index that never has good news is an argument, not a measurement — and it reads as one |
| **4** | **Currency check before publishing.** A publisher who issued an update we missed is the likeliest error in the campaign and the one that hands them a free rebuttal |
| **5** | **A spot-check is labelled as one.** Three sectors checked is not a full count, and a miscounted column is a correction we would have to publish |
| **6** | **Never in a hero, headline or ad.** `CLAUDE.md` rule 1 |

**The rule underneath everything:** *attack the format and the economics, never the firms or their data
quality.* We cite these publishers as sources — discrediting them discredits our own output.

---

## 5 · SEO / CRO split, summarised

| Lean | Pages | Count |
|---|---|---|
| 🔍 **SEO-led** | Sub-types (18) · types (3) · `/vs/*` + index (10) · `/alternatives` · market-size (2 + 40) · blog · glossary | **~36 + 40 generated** |
| 🎯 **CRO-led** | `/` · `/pricing` · `/enterprise` · `/about` · `/samples` · 9 ICP pages · `/analyses` · 7 product pages · `/customers` | **~22** |
| ⚖ **Both** | `/security` · the 6 trust pages | **7** |
| 📚 **Authority** | The Record — index, issues, age-of-the-numbers | **3+** |
| ⚙ **Utility** | Careers · contact · 4 legal · ai-disclosure · 404 | **8** |

**Skills are assigned by lean, and every page gets `copy-editing` and the Rule 6 hygiene pass before it
ships.**

---

## 6 · Coming-soon inventory

Ships, tagged, so the team removes a tag rather than commissioning a page:

| Item | Where it appears |
|---|---|
| **The $300 depth** — Intelligence · Diligence · Strategic options | Every ladder, `/pricing`, `/analyses`, nav dropdown |
| **Insights dashboards** | `/insights`, `/product` |
| **Updates / What Changed** | `/product`, `/outputs` |
| **Connect-a-source** — live connectors | `/data-room`, `/roadmap`, `/enterprise` |
| **Multilingual** | `/languages`, homepage fold |
| **Fielded primary research** | `/use-cases/*` where relevant — off-ladder, quote-based |

**Excluded entirely, not tagged:** Legal Document — the type, its 5 sub-types, and any use case built on it.

---

## 7 · Open

| | |
|---|---|
| **1** | **Sub-type slugs** — the tree uses reader-vocabulary slugs (`/use-cases/market-sizing`, not `/use-cases/tam`). Worth a keyword check once the SEO research lands |
| **2** | **`/trust/*` vs `/permission/*`** as the path. `trust` reads better and matches the footer column |
| **3** | **Sitemap does not exist** — `seo/decision.md` §4 requires one declared |
| **4** | **The Record's name** — recommended, not yet locked (`launch-plan.md` §11) |
