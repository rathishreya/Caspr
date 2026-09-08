# Website v2 — proposal from the app build

What the app's design and build changed, and what it means for the 16 existing designs, the site structure, and
the pages we still need. Grounded in `document-taxonomy.md`, `gate-output-spec.md`, `visualization-library.md`,
`pricing-model.md`.

**Proposal only.** Nothing executed. Numbers marked ⚠ need your validation before they go near a page.

---

# 1 · The anchor problem — the highest-value change on this page

**Your diagnosis is right, and the site is currently making it worse in one specific way.**

The homepage already carries a research-firm anchor: *"The $50,000 question. From $15."* The problem is the
size of the gap. A 600× difference doesn't read as value, it reads as *implausible* — and a reader who doesn't
believe the anchor falls back to the one they do believe, which is the $20/month LLM sitting in their other tab.
The anchor is present but it isn't doing its job.

**The credible anchor is not a consulting firm. It's the research they actually buy.**

The ICPs in `icp-personas.md` don't commission McKinsey. They buy off-the-shelf reports, or they wait for a
commissioned study. That's the comparison that lands — and it's the one where your three differentiators bite.

## 1.1 Proposed: a comparison band, not a headline claim

A four-row table, placed directly above the pricing cards on `/pricing` and as a band on the homepage. Not a
boast — a table the reader can check.

| | Off-the-shelf report | Commissioned study | **Caspr** |
|---|---|---|---|
| **Cost** | ⚠ $1,500–$5,000 each — and the answer usually needs two or three | ⚠ $15,000–$50,000 | **$80** |
| **Time** | Immediate, *if one exists on your question* | ⚠ 4–8 weeks | **15 minutes** |
| **Data** | Published ⚠ 6–24 months ago | Current at delivery | **Today** |
| **The question** | Theirs. You triangulate the rest. | Yours | **Yours** |

Three things this does that the current line does not:

1. **It frames the category as research, not AI.** The LLM comparison never gets invited, because the page is
   not competing on that axis. This is the whole fix.
2. **It makes triangulation visible.** "You need two or three reports and you still have to do the work" is the
   pain the ICP actually feels, and no competitor states it for them.
3. **It makes currency a line item.** "Published 6–24 months ago" versus "today" is the sourcing stage's
   entire value proposition expressed as a number a buyer can act on.

⚠ **Every figure in that table needs your sign-off.** I have not invented sources for them and I would not
publish them until they are defensible — the brand's whole claim is that it cites.

## 1.2 The structural bonus

The site already has **nine `/vs/` pages** — Statista, IBISWorld, Euromonitor, Mintel, Gartner, PitchBook,
ChatGPT, Perplexity, consulting-firms — and every one of them is orphaned, linked from no nav or footer. Those
are precisely the "off-the-shelf report" vendors in row 1. The comparison band gives them a home: each row links
out to the relevant `/vs/` page, and `/vs/chatgpt` handles the LLM question head-on rather than leaving it to
the reader's imagination.

---

# 2 · Tiers are no longer universal — this breaks copy on 4 of the 16 pages

Per `document-taxonomy.md` Facet 1 + Facet 3, there are **five deliverable types sharing one $15 / $80 / $300
ladder, each using its own rung names**:

| Deliverable type | $15 | $80 | $300 |
|---|---|---|---|
| **Market Research** | Brief | Study | Intelligence |
| **Investment & Deal** | **Screen** | **Thesis** | **Diligence** |
| **Business Case** | *(pitch only)* | Sales / Board paper / Strategic options | Board paper / Strategic options |
| **Legal Document** *(tentative)* | Screen | Review | Deep |
| **Academic Research** | Brief $8 | Study $40 | *(none)* |

**The website presents Brief / Study / Intelligence as if it were universal.** It isn't — it's the Market
Research ladder. Consequences:

| Page | Currently says | Should say | Severity |
|---|---|---|---|
| `/investors` | Brief · Study · Intelligence | **Screen $15 · Thesis $80 · Diligence $300** | **High** — wrong vocabulary for the highest-value ICP |
| `/startups` | Brief · Study · Intelligence | Business Case ladder — pitch decks are **$15 / $80 only**; there is no $300 rung | **High** — the page sells a tier they can't buy |
| `/strategy` | Brief · Study · Intelligence | Strategic Options Paper is **$80 / $300**; no $15 rung | Medium |
| `/academic` | Brief $8 · Study $40 | ✓ already correct | — |
| `/consulting` `/agencies` `/category-managers` `/market-research` | Brief · Study · Intelligence | ✓ correct — these are Market Research ICPs | — |

**And `/pricing` needs restructuring, not editing.** Its `04 Analysis Types` section presents three *products*.
They are three *price points* whose names change by deliverable type. Proposed shape: the ladder as the spine,
with a type selector or a footnote table showing what each rung is called for Market Research, Investment &
Deal, and Business Case.

Two availability rules also need surfacing somewhere: **Market Sizing has no Brief rung** (Study/Intelligence
only) and **Executive Profile has no Intelligence rung**.

## 2.1 The use-case pages have drifted from the taxonomy

The taxonomy states it explicitly: *"Each Deliverable Type is also a website use-case page — the taxonomy and
the site's use-case vocabulary are one list."* They are currently not one list.

| Live page | Taxonomy status |
|---|---|
| `/use-cases/market-research` | ✓ a deliverable type |
| `/use-cases/business-case` | ✓ a deliverable type |
| `/use-cases/due-diligence` | ✗ a **tier** of Investment & Deal, not a type |
| `/use-cases/investment-thesis` | ✗ a **tier** of the same type — these two pages are the same product at different rungs |
| `/use-cases/competitive-analysis` | ✗ a **sub-type** of Market Research |
| `/use-cases/rfp-response` | ✗ **not in the taxonomy at all** |

**Recommendation:** make `/use-cases/*` mirror the five deliverable types, and demote sub-types and tiers to
sections within those pages. Due Diligence and Investment Thesis become one `/use-cases/investment-deal` page
showing the Screen → Thesis → Diligence ladder — which is a far stronger page than either half. Keep the old
URLs as redirects; they hold whatever SEO equity exists.

---

# 3 · New capability surfaces — and the live / coming-soon line

The most important thing here is not what to say, it's what **not** to promise. Status per the specs:

| Capability | Status in the specs | Website treatment |
|---|---|---|
| **Data Room — upload your own files** | Locked (`document-taxonomy.md` §B) · Business milestone unlock | **Live feature.** Deserves its own page |
| **Connect your own data sources** (connectors) | **Not in any spec.** §B covers uploaded files only | **Coming soon.** Named, not detailed |
| **Charts & templated infographics** | Locked, free and unlimited (`visualization-library.md` Lane A) | **Live — and under-sold.** See §3.1 |
| **Model-generated images / bespoke graphics** | Locked, metered (Lane B) | Live, but a detail — not a headline |
| **Output styles — consulting / investor / academic** | `gate-output-spec.md` §5: **launch is a single Caspr template.** Custom templates are future, pricing undecided | **Coming soon.** Must not be promised as live |
| **Updates to generated reports** | **Phase 2, deferred** (`updates-feature-phase2.md`) | Coming soon, or omit entirely |
| **Insights dashboards** | **Not in any spec I can find** | Coming soon at most — needs a spec before it's a claim |
| **Caspr gets to know you** | Locked (`gate-output-spec.md` §8.0 — get-to-know thread, profile-building for future runs) | **Live feature.** See §3.2 |

## 3.1 Visualization is the most under-sold thing we have

`visualization-library.md` documents a deterministic template library — compare, trend, composition,
distribution, relationship, geography, flow — plus **business-framework infographics** (2×2s, magic-quadrant
style, value chains). All free, all unlimited, all rendered as vector for print fidelity.

The website currently says "100-page PDF" and shows a mock. It never says the report contains **real,
data-bound charts and consulting-grade framework graphics** — which is exactly the thing an LLM cannot do and
an off-the-shelf report does badly. This belongs in the anchor argument in §1, not in a feature list.

## 3.2 "Caspr gets to know you" — the retention story the site doesn't tell

Every acquisition page sells a single transaction. `gate-output-spec.md` §8.0 describes Caspr building a
profile across runs — the get-to-know thread, engagement formats, personalisation over time. That is the
argument for a *standing* Research Budget rather than a one-off purchase, and it is the missing bridge between
"$80 for a report" and "$200/month". It belongs on `/pricing`, next to the budget explanation.

---

# 4 · Proposed structure changes

**Fix the drift (no new design):**
- `/use-cases/*` → mirror the five deliverable types; redirect the three orphan URLs (§2.1)
- `/vs` → add an index page; link the nine orphans from the comparison band and the footer
- Nav `Solutions` → add `/market-research` and `/corporate-dev`, both live and unreachable today

**New pages, in priority order:**

| Page | Why | Depends on |
|---|---|---|
| **`/product`** | The app exists and the site has never shown it. Conversation → layout → gate → Theater → report | app screens |
| **`/data-room`** | Upload your own documents, private-by-default classification, Gate 1 selection. Connectors as coming-soon | §B locked |
| **`/visuals`** | Charts, framework infographics, what a Caspr chart actually is. Feeds §1's anchor | viz library locked |
| **`/outputs`** | Formats, languages, per-output pricing, edit credits | already drafted |
| **`/languages`** | Multilingual differentiator + programmatic SEO seed | already drafted |
| **`/use-cases/investment-deal`** | Merges two half-pages into the Screen → Thesis → Diligence ladder | §2.1 |
| **`/vs` index** | Homes nine orphaned high-intent pages | — |
| **`/roadmap`** or `/changelog` | Where connectors, updates, dashboards and styles live honestly as "coming" | — |

**Deliberately not proposed:** a page for Legal Document. `document-taxonomy.md` flags it tentative, pending a
Lawyers ICP and legal sign-off, and it ships as *a draft for a lawyer to review, never legal advice*. That needs
a disclaimer and legal review before it appears anywhere public.

---

# 5 · One copy constraint to carry forward

`document-taxonomy.md` Facet 3a flags it and it needs to reach whoever writes the primary-research copy:
**synthetic panels are AI-simulated audience response, not real fieldwork.** The *"Caspr does not do primary
research"* claim holds for fielded surveys. Any page touching primary data must say **AI-simulated** and never
imply real respondents. Given the brand is built on defensibility, this is the single highest-risk copy line on
the roadmap.

---

# 6 · What I'd do first

1. **§1 comparison band** — highest value, needs only your number validation. It changes how every visitor reads
   the price.
2. **§2 tier vocabulary on `/investors` and `/startups`** — currently wrong, not merely incomplete.
3. **§2.1 use-case restructure** — cheap, and it aligns the site with the product's own vocabulary before more
   pages get built on the wrong list.
4. Then the new pages, in the §4 order.

## Still open from the last pass

- `/pricing` desktop and mobile FAQs carry different copy (pre-existing) — reconciliation queued
- The edit-credit tier row has no home; **§2 supersedes this** — the analysis-types section needs restructuring
  anyway, and the row should land inside that rework rather than being bolted on now
