# Site Truth — the reference the website derives from

**Phase A output.** Everything on the website — structure, copy, Figma, build — derives from this file. If a
page contradicts it, the page is wrong. If reality contradicts it, this file gets updated first.

Sources: `document-taxonomy.md` · `gate-output-spec.md` · `.agents/pricing-model.md` · `visualization-library.md`
· `.agents/brand-guidelines.md` · `.agents/security-posture.md`.

**Open decisions are numbered `OD-n` and listed in §8.** Anything marked ⚠ must not go on a page until resolved.

---

## 1 · Positioning — the anchor

### 1.0 The message stack (locked 2026-08-19, Joy)

| | |
|---|---|
| **Category** | Analytical AI |
| **Identity** | **Not an assistant. An analyst.** |
| **Promise** | **Arrive certain.** |
| **Proof** | **Every source, credible. Every claim, triangulated. Every report, defensible.** |

Every page derives from these four. The identity line is the hero; the promise sits under it; the proof is
the fold beneath. Nothing on the site may contradict them.

**The homepage hero (locked 2026-08-20, Joy):**

> # Not an assistant. An analyst.
> Any question your board will ask — answered, sourced, and ready before they ask it.
>
> `No credit card · 25M+ curated sources · From $15`

**Why this line.** All eight personas contain the same moment — someone senior asks where the number came
from. `icp-personas.md` :74 (partner, then client) · :167 (the board) · :255 (the GP) · :356 (the pitch) ·
:431 (the investor) · :533 (the proposal) · :624 (the board again) · :726 (the interviewer). Eight rooms,
one question. The subhead is the live site's own line, completed.

**The offer (locked 2026-08-20, Joy).** *Use Caspr before you sign up.* Ask a real question, answer the two it
asks back, see the analysis it plans. Sign up only when you want it finished.

- **Hook** — *"Ask a question. No account needed."* The primary CTA everywhere invites the question, never the account
- **Closer** — *"$100 on us"*, at the signup wall, where the product already places it. **The $100 leaves every acquisition surface**
- **Every CTA carries `icp_hint` and lands on a pre-filled, ICP-relevant question** — the onboarding already personalises on it
- ~~The site currently states the offer three ways (nav *"Start Free"* · homepage *"From $15, no subscription"* · ICP CTAs *"first $100 free"*). **Close to one**~~ — ✅ **closed 2026-08-25, [`entry-routes-and-cta.md`](entry-routes-and-cta.md).** One CTA phrase site-wide (**Run the analysis**); **the offer is stated once, in-product, at the gate.** The homepage's `START FOR FREE` eyebrow was **dropped 2026-08-25** — it restated the offer its own headline (*"Your first $100. On us."*) already makes. **No residue**

**Three microcopy corrections that ship with it:** `1M+` → **`25M+`** · **delete "Zero hallucinations"**
(retired by the copy pass; an absolute is the most attackable claim available) · move `From $15` out of the
subhead, since cost is the third act.

**`"15 minutes. 100 pages. Cited to source."` is not deleted** — it moves to the how-it-works fold, where
speed is a supporting fact rather than the position.

**Why analyst and not advisor or expert.** Advisor competes with the buyer — consultants, strategy teams and
agency strategists *are* the advisor, and they do not want a rival one. Expert asks to be trusted on
reputation, which Caspr has not got. An analyst is trusted for how the work was done. That is the only trust
Caspr can earn, and it is the one the product is built to demonstrate.

**Two prohibitions that follow.**

- **No competitor or LLM naming in lead copy.** It concedes the category. The generative contrast is category
  education — `/vs/*`, social, founder content. Never a hero, headline or ad. This *strengthens* §1.1 below.
- **No proof framed as reader labour.** "Verify", "check the working", "traceable", "see for yourself" all
  sell more work and contradict the promise. Citations exist so the reader has the answer when the room asks
  — not so they can confirm we are honest.

### 1.1 The category frame

Caspr competes with **research**, not with AI tools. Every page is written so the reader's mental comparison is
*"what would this cost me from a research firm"*, never *"what would ChatGPT give me for $20 a month."*

The LLM comparison is not argued on the main pages — it is answered in one place, `/vs/chatgpt`, for readers who
arrive already asking it. Raising it anywhere else invites the frame we're trying to avoid.

### 1.2 The three differentiators (in priority order)

1. **Your question, not theirs.** An off-the-shelf report answers the question its publisher chose. Getting your
   answer means buying two or three and triangulating. Caspr answers the question you asked.
2. **Today's data.** Published reports are 6–24 months old ⚠. Caspr sources live.
3. **15 minutes, not weeks.** Commissioning a study takes 4–8 weeks ⚠ minimum.

Cost is the fourth argument, not the first. Leading with cheapness invites the LLM frame; leading with
*specificity* invites the research frame.

### 1.3 The anchor is a case study, not a range **(Joy, decided)**

Ranges invite argument and age badly. **Each use case carries a concrete, named, cited comparison** — a real
report a reader could go and buy, with its real price and its real publication date, against the equivalent
Caspr analysis.

Shape, per use case:

> **The question:** *"Who is winning UK sustainable personal care, and why?"*
> **Off the shelf:** ⟨named report⟩ — ⟨price⟩, published ⟨date⟩. Answers ⟨its own question⟩; you would need
> ⟨n⟩ of them and still triangulate.
> **Commissioned:** ⟨firm type⟩ — ⟨price⟩, ⟨weeks⟩.
> **Caspr:** a Study. $80. 15 minutes. Your question. Today's data.

This is stronger than a range table for three reasons: it's checkable, it's self-citing, and it demonstrates the
"their question, not yours" argument instead of asserting it.

**Placement:**
- **Use-case pages** — the full case study, one per page, using a comparable genuinely relevant to that use case
- **ICP pages** — the case study for that ICP's primary use case
- **Homepage** — the high-level version only, replacing the current *"The $50,000 question"* fold
- Each comparison links to the relevant `/vs/` page

### 1.4 Sourcing rule

Caspr's entire claim is that it cites. A comparison with uncited competitor prices is the one place the brand
can be caught doing what it tells everyone else not to. **Every case study carries its citations like any Caspr
output** — named report, list price, publication date, linked, re-checked quarterly.

**OD-1 is now per use case**: one real comparable per use-case page, sourced and dated. Nothing ships uncited.

---

## 2 · The ladder — tier vocabulary is not universal

Five deliverable types share **one $15 / $80 / $300 ladder**. Each type uses its own rung names. This is the
single most-broken thing on the current site.

| Deliverable type | $15 | $80 | $300 |
|---|---|---|---|
| **Market Research** | Brief | Study | Intelligence |
| **Investment & Deal** | Screen | Thesis | Diligence |
| **Business Case** | *(pitch only)* | Sales deck · Board paper · Strategic options | Board paper · Strategic options |
| **Academic Research** | Brief **$8** | Study **$40** | *(none)* |
| **Legal Document** | Screen | Review | Deep | ← **not for the website** (§4) |

**Availability exceptions that must be stated where the ladder appears:** Market Sizing has no Brief rung ·
Executive Profile has no Intelligence rung · pitch decks have no $300 rung · Strategic Options has no $15 rung.

### 2.1 Ladders are use cases — every relevant one shows on each ICP page **(Joy, decided)**

**A ladder is not a price list, it's a use case.** So each ICP page shows **every deliverable type that ICP
actually buys**, each with its own rung names and prices. This replaces the single 3-card pricing strip with a
use-case × ladder block — a materially different fold, and the main structural change to the ICP template.

Mapping, second pass — each entry earns its place from a **trigger event** in `icp-personas.md`, so the block on
each page can be phrased in that ICP's own language rather than as a generic price list. Primary type first.

| Page | Deliverable types | The trigger it answers |
|---|---|---|
| `/consulting` | Market Research · Business Case | *"The partner asks for a competitive landscape by Thursday"* · *"A brief arrives in a sector they don't know"* |
| `/strategy` | Business Case · Market Research | *"CEO asks for a strategic options paper with a hard deadline"* · *"The company is entering a new market"* |
| `/investors` | **Investment & Deal** · Market Research | *"A teaser arrives in a sector outside the fund's coverage"* · *"The GP wants a market view for IC in 48 hours"* |
| `/corporate-dev` | **Investment & Deal** · Market Research | target identification and screening ahead of a board conversation |
| `/agencies` | Market Research · Business Case | *"A new pitch brief arrives in an unfamiliar industry"* · *"Your industry knowledge wasn't deep enough"* |
| `/startups` | Business Case *(pitch)* · Market Research *(sizing)* | *"A VC meeting is scheduled within 4 weeks"* · *"Your market slide needs work"* |
| `/market-research` | Market Research · **Business Case** *(proposal / RFP)* | *"A proposal is due for a sector outside the firm's coverage"* |
| `/category-managers` | Market Research · Business Case *(internal approval)* | *"Category review cycle begins"* · *"A senior buyer questions the category strategy"* |
| `/academic` | Academic Research · Market Research *(academic pricing)* | *"A case competition brief is released"* · *"Dissertation literature review due"* |
| `/pricing` | all — the ladder as a spine, rung names by type | — |

**Changed on this pass:** Investment & Deal **dropped** from `/consulting` (no trigger supports it) · Business
Case **added** to `/market-research` (the "proposal is due" trigger is explicit) · Business Case **added** to
`/category-managers` as a secondary (weaker — the board-question trigger only).

Each block states its own availability exceptions (§2, e.g. no $300 pitch rung, no Brief for Market Sizing).

---

## 3 · Information architecture

### 3.1 Use-case pages mirror deliverable types

`document-taxonomy.md` states it directly: *"the taxonomy and the site's use-case vocabulary are one list."*
They currently are not.

| Live page | Status | Action |
|---|---|---|
| `/use-cases/market-research` | ✓ a type | keep |
| `/use-cases/business-case` | ✓ a type | keep |
| `/use-cases/due-diligence` | a **tier** of Investment & Deal | merge → `/use-cases/investment-deal`, redirect |
| `/use-cases/investment-thesis` | a **tier** of the same type | merge → same page, redirect |
| `/use-cases/competitive-analysis` | a **sub-type** of Market Research | demote to a section, redirect |
| `/use-cases/rfp-response` | capability exists and is tested (Joy) — but **absent from the taxonomy** | **Keep the page.** Maps to Business Case → `sales`. `document-taxonomy.md` §A.2b needs the sub-type adding |
| — | Academic Research | covered by `/academic` |
| — | Legal Document | **not for the website** (§4) |

Merging Due Diligence and Investment Thesis into one page showing Screen → Thesis → Diligence is a stronger page
than either half, and it is the page the highest-value ICP lands on.

### 3.2 Orphans to reconnect

Live, in the sitemap, linked from no nav or footer: `/market-research` · `/corporate-dev` · `/customers` ·
all nine `/vs/*`. The comparison band (§1.3) homes the `/vs/` set; `/market-research` and `/corporate-dev` are
full ICP pages and belong in the Solutions nav.

---

## 4 · Capability register — what the site may claim

| Capability | Status | Website treatment |
|---|---|---|
| **Style** — investor / consulting / academic register: jargon, section titles, language conventions | **LIVE at launch** | A headline capability. Belongs in the §1 anchor argument — an off-the-shelf report cannot be written in your register |
| **Charts & framework infographics** — deterministic, free, unlimited, vector | **LIVE** | Under-sold today. Belongs in the anchor argument |
| **Model-generated images / bespoke graphics** | LIVE, metered | Detail, not a headline |
| **Data Room — upload your own files**, private by default | **LIVE** (Business milestone) | Own page |
| **Multilingual** — native generation in the user's working language | **LIVE** | Own page + hero proof line |
| **Caspr gets to know you** — profile building across runs | **LIVE** | The retention argument on `/pricing` |
| **Edit credits** — 15k / 80k / 300k | **LIVE** | Tier row + one FAQ, nowhere else |
| **Client templates** — outputs in the client's own house template | **Committed, setup required** | `/enterprise` only, quoted not listed (§5) |
| **Connect your own data sources** — **live connectors** (Joy) | Committed; no spec yet | Roadmap only. Named, not detailed, no dates. Distinct from Data Room upload, which is live |
| **Updates to generated reports** | **Phase 2, deferred** | Roadmap only |
| **Insights dashboards** | Coming (Joy) — no spec yet | **A "coming soon" page** showing what the finished thing looks like. Deliberately under-sold — no dates, no claims beyond the visual |
| **Legal Document type** | Tentative; ships as *a draft for a lawyer*, never advice | **Nothing on the site** pending Lawyers ICP + legal sign-off |
| **Fielded primary research** | Deferred, off-ladder | Nothing |
| **Synthetic panels** | Available as a premium data add-on | Only ever as **AI-simulated** (§7) |

---

## 5 · Style vs template

Two different things. The spec currently conflates them — see OD-8.

**Style** — how the analysis is written: vocabulary, section titles, density, register, length, appendices.
Investor, consulting, academic. **Ships at launch, included, chosen before generation.** Changing style after
generation is a re-generation and draws an output charge.

**Template** — the client's own house format: their deck master, their document styling. Requires a setup round
by the Caspr team; not an upload-and-go. **Commercially a service, not a SKU.**

- **Price:** $1,000 one-time setup
- **Turnaround:** 1 week
- **Delivered by:** team Caspr
- **What the client provides:** samples of the vertical-format and PPT outputs they need — or just the `.potx`
- Placement: `/enterprise`, alongside SSO and API. **Not on the `/pricing` ladder** — "one budget, no line items"
  is the pricing story and a services line breaks it
- Framing: *"Caspr in your house template"* — quoted, not listed
- **This is the first non-self-serve thing in the model.** Still open: what happens when the client rebrands
  (re-setup at full price, or a lower refresh fee?)

---

## 6 · Canonical numbers

The only figures the website may state. Anything not here needs sourcing before use.

| | Value |
|---|---|
| **The three depths** | **$15 · $80 · $300** — price points universal, **names per type** (§2). Never write a depth name without its type |
| Intelligence à la carte | $399 |
| Academic Brief · Study | $8 · $40 (no Intelligence) |
| **The four modes** | **Try** *(no budget)* · **Solo $200** · **Team $600** ⭐ · **Org $1,800 committed, 3 seats** — renamed 2026-08-26 from Professional/Business/Enterprise. Model: [`product/access-model.md`](product/access-model.md). **Never write these as `from $200/mo`** — see `CLAUDE.md`, `COPY-11` |
| Minimum Research Budget | **$200 a month of research** — never *$200/month*, `COPY-11a` |
| Free trial | $100, no card, **90-day expiry** · Academic $150 |
| Enterprise | 3 seats, $1,674 available for analyses, pooled |
| Edit credits | Brief 15,000 · Study 80,000 · Intelligence 300,000 |
| Output base | the tier's committed set, in the user's working language |
| Extra outputs | PDF · DOCX · XLSX · CSV **$5** · PPTX **$10** · MD free |
| Premium data add-on | $20–$60, opt-in, priced before the run |
| Client template setup | ⚠ $1,000 one-time (OD-3) |
| Sources | **25M+** curated sources |
| Brief | **3–5 pages**, ~15 minutes |
| Study | ~100 pages, 1–2 hours |
| Intelligence | up to 24 hours, multi-model |
| Platform fee | 7% — **internal only, never shown** |
| Re-analysis | 50% of fresh price — **Phase 2, not for the site** |

---

## 7 · Claims register

**Must say, exactly:**
- Synthetic panels are **AI-simulated** audience response. Never "primary research", never implying real
  respondents. The *"Caspr does not do fieldwork"* claim holds only for fielded surveys
- **"SOC 2 Type I audit in progress"** — never "SOC 2 certified"
- Legal outputs, if ever mentioned, are **a draft for a lawyer to review**, never legal advice

**Needs sign-off before publishing:**
- The comparison-band cost and currency figures (OD-1)
- *"Reasons and writes natively, not translated"* — Jayant, same bar as the security claims
- The **25M+** source count — needs a statable basis

**Never:**
- "LAM" — the architecture claim isn't defensible publicly yet
- Exclamation points
- platform · leverages · algorithms · workflows · powerful AI · revolutionary · game-changing · chatbot ·
  web scraping · hallucinate · "excited to announce"

**Placeholders stay for now (Joy) — real ones to follow.** Every testimonial and the TRUSTED BY logo row are
invented, in Figma *and* on the live site. Design work continues on them unblocked.

⚠ **One distinction worth holding.** Placeholders in a Figma file are a design convention. The same quotes on a
public page, attributed to named people with job titles and employers, read as real customer endorsements — and
in the US, UK and EU that is a regulated claim, not a design placeholder. The exposure is asymmetric for a brand
whose entire positioning is defensibility. Recommendation: keep them in Figma, and before the rebuilt site goes
live either swap in real ones or render them unattributed/illustrative. Flagged once; your call.

---

## 8 · Open decisions

| # | Decision | Status |
|---|---|---|
| **OD-1** | Anchor comparisons — **now one cited case study per use case**, not ranges (§1.3) | **Reshaped.** Open: sourcing one real comparable per use-case page |
| **OD-2** | ICP pages show **every relevant deliverable type**, each with its ladder (§2.1) | **Decided.** Open: confirm the ICP → type mapping in §2.1 |
| **OD-3** | Client template — $1,000, 1 week, team Caspr, client supplies samples or `.potx` | **Decided.** Open: rebrand/refresh pricing |
| **OD-4** | Insights dashboards — a "coming soon" page, deliberately under-sold | **Decided** |
| **OD-5** | "Connect your own data sources" = **live connectors** | **Decided.** Roadmap entry, named not detailed. Needs a spec before any page describes it |
| **OD-6** | `/use-cases/rfp-response` — keep; maps to Business Case → `sales` | **Decided.** Open: taxonomy §A.2b needs the sub-type adding |
| **OD-7** | Placeholder testimonials continue; real ones to follow | **Decided.** See the §7 flag on attributed quotes going live |
| **OD-8** | `gate-output-spec.md` §5 style/template split | **Approved.** Ask drafted → [`dev-ask-style-template.md`](dev-ask-style-template.md) |

### Newly open, from this round

| # | Decision | Blocks |
|---|---|---|
| **OD-9** | ICP → deliverable-type mapping | **Closed.** Second pass done against `icp-personas.md` triggers (§2.1) |
| **OD-10** | One real, cited comparable per use-case page (§1.3) | ✅ **Closed on figures 2026-08-25.** All nine contexts have a cited anchor — [`od-10-results.md`](od-10-results.md). **The shadow reports remain** (§5 there), and they are what makes a comparison fold convert rather than merely be accurate |
| **OD-11** | Template refresh on rebrand | **Closed.** Full $1,000 again |

---

## 9 · What this file does not cover

Activation. 1,500 signups and ~2 paid is a funnel problem sitting downstream of the website, and nothing in here
fixes it. The two items with the best return — real reports on `/samples`, which currently answers 20+ CTAs with
"coming soon", and the re-engagement sequence — are unblocked by everything above and should run in parallel.
