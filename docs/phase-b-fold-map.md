# Phase B — fold map

Fold-by-fold: what stays, what changes, what's new, what goes. Derives from
[`site-truth.md`](site-truth.md). Reviewable without opening Figma.

**Legend:** `KEEP` unchanged · `EDIT` same fold, new content · `NEW` · `REPLACE` fold is rebuilt ·
`MOVE` reorder · `CUT`

**Pass 1 covers** the ICP template (9 pages), the homepage, and `/pricing` — roughly 70% of the site's traffic
and every structural decision. Remaining pages in §4.

---

# 1 · ICP template — propagates to 9 pages

`/consulting` `/strategy` `/investors` `/agencies` `/startups` `/category-managers` `/market-research`
`/corporate-dev` `/academic`

| # | Fold | Action | What changes |
|---|---|---|---|
| 01 | Navigation | KEEP | — |
| 02 | Hero | **EDIT** | Restore the designed **security micro-copy** ("Client data never leaves your account. ISO 27001:2022 certified →"). **CUT** the live 3-up stat row — it repeats numbers already in the headline and displaces the only inbound link to `/security` |
| 03 | Pain Points | **EDIT** | Re-voice against that ICP's **trigger events** (`site-truth.md` §2.1). These are already close; the gain is using the trigger's own words |
| 04 | Solution | KEEP | — |
| 04c | Output Showcase | **EDIT** | Currently proves *length* ("100 pages, cited"). Add proof of **what's in it** — real data-bound charts and framework infographics. This is the argument an LLM can't answer and an off-the-shelf report answers badly |
| — | **Written in your register** | **NEW** | Style ships at launch. Investor / consulting / academic register — vocabulary, section titles, conventions. Sits with the showcase because it's an output property |
| — | **What this costs elsewhere** | **NEW** | The cited case study (`site-truth.md` §1.3), using a comparable relevant to *this* ICP. **Precedes** the ladder — the anchor has to land before the price does |
| 05 | Pricing Strip | **REPLACE** | From one 3-card strip to a **use-case × ladder block**: every deliverable type this ICP buys, each with its own rung names and prices. `/investors` shows Screen · Thesis · Diligence *and* Market Research. States its own availability exceptions |
| 04b | Analytical AI | **MOVE** | Currently sits *before* pricing, putting "Generative AI" in the reader's head immediately before the price — the exact frame `site-truth.md` §1.1 exists to avoid. Move to **after** the ladder. The category claim is retained; only its position changes |
| 06 | Testimonial | KEEP | Placeholders stand (OD-7) |
| 06b | Objection Handling | **EDIT** | Absorb the three new objections the app created: *"is my data safe if I upload it"* → Data Room · *"can I change it after"* → edit credits · *"will it look like our work"* → style |
| 06c | FAQ | **EDIT** | Add the two `/pricing` entries (what's included / editing) plus one ICP-specific ladder question |
| 07 | Final CTA | KEEP | Step-1 fixes already applied |
| 09 | Footer | KEEP | — |

**Net: 12 folds → 14.** Two new, one replaced, one moved, five edited.

### 1.1 Per-page variation

| Page | Ladder blocks | Case-study comparable |
|---|---|---|
| `/consulting` | Market Research · Business Case | a sector/competitive landscape report |
| `/strategy` | Business Case · Market Research | a commissioned strategic options study |
| `/investors` | **Investment & Deal** · Market Research | a sector report bought for deal screening |
| `/corporate-dev` | **Investment & Deal** · Market Research | as above |
| `/agencies` | Market Research · Business Case | an industry report bought for a pitch |
| `/startups` | Business Case *(pitch, no $300)* · Market Research | a market-sizing report |
| `/market-research` | Market Research · **Business Case** *(proposal/RFP)* | a syndicated report bought to scope a proposal |
| `/category-managers` | Market Research · Business Case *(internal approval)* | a category report |
| `/academic` | Academic Research · Market Research *(academic pricing)* | a paywalled industry report a student can't expense |

**Data Room fold — not on every page.** Add only where confidentiality is a live objection:
`/consulting` · `/investors` · `/corporate-dev`. Elsewhere it's a link from Objection Handling.

---

# 2 · Homepage

| # | Fold | Action | What changes |
|---|---|---|---|
| 01 | Navigation | **EDIT** | Solutions gains `/market-research` and `/corporate-dev` — both live and unreachable today |
| 02 | Hero | KEEP | Proof row already updated (4 items, two lines) |
| 03 | Social Proof | KEEP | Placeholders stand |
| 04 | How It Works | KEEP | — |
| 05b | Engine | KEEP | 25M+ applied |
| 05c | Multilingual | KEEP | Built this session |
| — | **What research costs** | **NEW** | The **high-level** comparison (`site-truth.md` §1.3) — the case studies live on use-case and ICP pages. **Replaces** the "$50,000 question" framing, which reads as implausible and pushes readers back to the LLM anchor |
| 05 | Pricing | **EDIT** | Ladder presented as three price points whose names change by deliverable type, not three fixed products. Link to `/pricing` for the full matrix |
| 06 | Testimonials | KEEP | — |
| 07 | Category Claim | KEEP | **Correction:** I listed this as MOVE. It is already after the pricing fold on the homepage — the problem is specific to the ICP template, where Analytical AI sits *before* it |
| 08 | Final CTA | KEEP | — |
| — | Trust Strip · Footer | KEEP | — |

**Net: 11 → 12 folds.** The single most consequential change on the site is replacing the $50,000 line.

---

# 3 · `/pricing`

| # | Fold | Action | What changes |
|---|---|---|---|
| 01 | Nav | KEEP | — |
| 02 | Hero | KEEP | "One budget. Every analysis you need." still correct |
| — | **What research costs** | **NEW** | The comparison, directly above the ladder. Anchor before price |
| 03 | Pricing Plans | KEEP | Professional / Business / Enterprise unchanged |
| 04 | Analysis Types | **REPLACE** | The ladder as a **spine with type-dependent rung names** — Market Research (Brief/Study/Intelligence), Investment & Deal (Screen/Thesis/Diligence), Business Case, Academic. Carries the availability exceptions, the inclusion line, and the **edit-credit row** that currently has no home |
| — | **Caspr learns how you work** | **NEW** | The retention argument (`gate-output-spec.md` §8.0) — why a standing budget beats a one-off purchase. The missing bridge between "$80 a report" and "$200 a month" |
| 05 | FAQ | KEEP | 8 entries, built this session |
| 06 | Enterprise Strip | **EDIT** | Add **"Caspr in your house template"** — $1,000, 1 week, team-delivered, client supplies samples or `.potx`. Quoted, not listed |
| 07 | Final CTA | KEEP | — |

**Net: 8 → 10 folds.**

---

# 4 · Remaining pages — pass 2

**Existing, lighter edits:** `/enterprise` (template offering, connectors on the roadmap) · `/about` (no change) ·
`/security` (Data Room classification model) · legal pages (no change) · 404 (no change).

**Use-case restructure** (`site-truth.md` §3.1): merge `/use-cases/due-diligence` + `/investment-thesis` →
`/use-cases/investment-deal` · demote `/competitive-analysis` to a section · keep `/rfp-response`, mapped to
Business Case → `sales`. Each use-case page carries its own cited case study — that is the page's spine.

**New pages**, priority order: `/product` · `/data-room` · `/visuals` · `/outputs` · `/languages` ·
`/use-cases/investment-deal` · `/vs` index · `/roadmap` (connectors, updates, insights dashboards — named, no
dates) · insights-dashboards coming-soon page.

---

# 5 · Three things this exposes

1. **The Analytical-AI fold is in the wrong place on 10 pages.** It argues the category *before* the reader has
   an anchor, which is precisely when the LLM comparison is cheapest to reach for. Moving it after the price is
   free and should measurably change how the price reads.
2. **The showcase proves the wrong thing.** "100 pages, cited" answers *how much*. Charts and framework
   infographics answer *what kind* — and that is the claim neither an LLM nor a syndicated report can match.
3. **`/pricing` gains the retention argument it never had.** Every current fold sells a transaction; nothing
   explains why the budget is monthly. "Caspr learns how you work" is that argument and it already exists in the
   product spec.

**~~Blocking Phase C:~~ OD-10 closed on figures 2026-08-25** — [`od-10-results.md`](od-10-results.md). Everything else here can be
drawn.

---
---

# PASS 2 — remaining pages, the use-case restructure, and the new set

# 6 · Existing pages — lighter edits

| Page | Action | What changes |
|---|---|---|
| `/enterprise` | **EDIT** | Add **"Caspr in your house template"** — $1,000, 1 week, team Caspr, client supplies samples or `.potx`, **full price again on rebrand**. Quoted, not listed. Add **connectors** as a roadmap line. The features fold gains Data Room as an enterprise capability, not just an upload box |
| `/security` | **EDIT** | Add the **Data Room classification model** — private by default, one-way-safe, included/excluded reuse states, and that Gate 1 selection *is* the link to an analysis. This page answers the objection the ICP pages raise |
| `/about` | KEEP | Copy verified against Figma this session — clean match |
| `/customers` | **BLOCKED** | A testimonials page built entirely on placeholders. Do not extend until OD-7 resolves |
| `/samples` | **REPLACE** | Three "Report coming soon" cards. **20+ CTAs across the site land here.** ~~Needs three real generated reports~~ — ✅ **the three are selected 2026-08-26:** **Saudi industrial valves** · **Reconcile UK ready meals** · **Vertical SaaS valuations**. **⚠ Held on two product defects** — [`report-evaluation-2026-08.md`](report-evaluation-2026-08.md) §5 |
| `/blog` | **EDIT** | Stub. The five seed posts in `pages-for-production.md` target AI-tool search intent; under the new anchor they should target **research-buying** intent — what a market research report costs, how to brief a research agency, syndicated versus commissioned |
| `/privacy` `/terms` `/refund` | KEEP | Add the missing `#gdpr` anchor; add `/refund` to `sitemap.ts` |
| 404 | KEEP | — |

---

# 7 · The tier pages — `/analyses/*`

The new ladder creates a problem: `/analyses/brief` is a **Market Research** rung name, but the nav offers it as
though it were universal.

`document-taxonomy.md` resolves it — *the Market Research rung names are the canonical tier slugs; other types
reuse the same three price points under their own display names.*

**So canonical names stay, and aliases get shown.** Each tier page keeps its URL and gains an alias row:

> **Study — $80.** Called a **Thesis** when you are screening a deal, a **Board Paper** when you are making the
> case internally, a **Proposal** when you are pitching for work. Same depth, same price.

That turns three thin product pages into the clearest explanation of the ladder anywhere on the site, and it
resolves "is Brief universal?" without a rename. The nav dropdown keeps `Brief · Study · Intelligence`.

---

# 8 · Use-case pages — one template, five instances

Per `site-truth.md` §3.1 these mirror the deliverable types. **The cited case study is the spine of the page**,
not a section within it.

| Fold | Content |
|---|---|
| Hero | The job in the buyer's words, from the ICP trigger events |
| **The comparison** | The cited case study: named report, real price, publication date, against the Caspr equivalent. **The page's reason to exist** |
| What you get | Sub-types within this deliverable type, and what each answers |
| The ladder | This type's rungs, names, prices, availability exceptions |
| Output | Formats, style register, charts |
| Objections · FAQ · CTA | Type-specific, then standard |

| Instance | Status |
|---|---|
| `/use-cases/market-research` | exists — restructure to the template |
| `/use-cases/business-case` | exists — restructure; absorbs RFP response as a sub-type section |
| **`/use-cases/investment-deal`** | **NEW** — merges due-diligence + investment-thesis into one Screen → Thesis → Diligence ladder. Both old URLs redirect |
| `/academic` | already the Academic Research instance |
| *(Legal Document)* | **not built** — tentative, pending legal sign-off |

`/use-cases/competitive-analysis` demotes to a section inside market-research, redirect retained.
`/use-cases/rfp-response` keeps its URL and maps to Business Case → `sales`.

---

# 9 · The `/vs` set changes job

Nine pages — Statista, IBISWorld, Euromonitor, Mintel, Gartner, PitchBook, ChatGPT, Perplexity,
consulting-firms — orphaned and linked from nothing.

**They stop being competitor pages and become the evidence layer under the anchor.** Every comparison on the site
cites a real report at a real price; the `/vs` page for that vendor is where the citation resolves. That gives
them inbound links, a reason to be maintained, and a role in the funnel they have never had.

| Action | |
|---|---|
| **NEW** `/vs` index | Homes the set; linked from the footer and every comparison |
| **EDIT** the seven report vendors | Restructure around the four comparison rows — whose question, how current, how long, what it costs |
| **EDIT** `/vs/chatgpt` `/vs/perplexity` | The **only** place the LLM comparison is argued (`site-truth.md` §1.1). Keep them honest — name what an LLM does better |

---

# 10 · New pages

| Page | Spine | Notes |
|---|---|---|
| **`/product`** | Conversation → layout → gate → Theater → report | The app exists and the site has never shown it. Highest-value new page |
| **`/data-room`** | Upload, private by default, how selection works, what never leaves | Pairs with `/security`. Connectors appear as roadmap only |
| **`/visuals`** | What a Caspr chart is; the framework infographic library; free and unlimited | Feeds the anchor — the thing an LLM cannot do |
| **`/outputs`** | Formats by tier, languages, per-output pricing, edit credits | Copy drafted in `website-copy-step2.md` |
| **`/languages`** | Native generation, not translation | Copy drafted. Programmatic SEO seed |
| **`/roadmap`** | Connectors · report updates · insights dashboards | See §10.1 |
| **Insights dashboards** | One coming-soon page showing the finished thing | Show it, do not advertise it |
| **`/careers` `/contact`** | Both currently **404 from the footer of every page** | Not design work — they just need to exist |
| `/gdpr` `/cookies` `/dpa` `/subprocessors` | Procurement set | Follows `/security` |
| `/academic/clubs` | Academic Club, Research Dollars, Share Card | The entire programme is absent from the site |

### 10.1 The coming-soon rule

Three things are committed but unspecced — connectors, report updates, insights dashboards. A roadmap page is
where brands overpromise. The rule:

- **Name it. Show it if it is designed. Never date it.**
- No quarters, no "soon", no waitlist implying imminence
- Anything without a spec gets a name and a sentence, nothing more
- Every item carries the same visual weight, so nothing reads as nearly-shipped

For a brand built on defensibility, a roadmap that under-promises is worth more than one that excites.

---

# 11 · Ordering for Phase C

**~~Blocked on OD-10~~ — unblocked 2026-08-25** (one cited comparable each, in [`od-10-results.md`](od-10-results.md) §2): the ICP template comparison fold, every use-case page, the
homepage comparison band. This is now the critical path for most of the site.

**Unblocked, can be drawn immediately:**

1. `/pricing` — Analysis Types rework, retention fold, enterprise template line
2. ICP template — everything but the comparison fold: hero security line, showcase, style fold, ladder block, the Analytical-AI move
3. `/analyses/*` alias rows
4. `/enterprise`, `/security`
5. New pages with no external dependency: `/product`, `/data-room`, `/visuals`, `/outputs`, `/languages`
6. `/vs` index and restructure

**Not design work, highest return:** three real sample reports; `/careers` and `/contact` existing at all.

---

# 12 · What pass 2 exposed

1. **`/analyses/*` needed a decision, not an edit.** The alias row turns three thin pages into the site's
   clearest explanation of the ladder, and resolves "is Brief universal?" without a rename.
2. **The `/vs` set was a liability and becomes an asset.** Nine orphaned pages become the citation layer the
   anchor requires. Nothing else was going to give them a job.
3. **The blog's seed topics aim at the wrong intent.** Written to catch AI-tool searches; the new anchor
   competes for research-buying intent — a different keyword set and a different reader.
4. ~~**OD-10 is the critical path.** Nine cited comparables gate most of the site.~~ **Done 2026-08-25** — all nine contexts answered. **The critical path moved to the shadow reports** ([`od-10-results.md`](od-10-results.md) §5), which Joy commissions. Worth starting before Phase C
   rather than during it.
