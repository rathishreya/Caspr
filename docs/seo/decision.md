# Search — where we land

*2026-08-25. The decision record. Analysis in [`strategy-stress-test.md`](strategy-stress-test.md) and [`hybrid-validation.md`](hybrid-validation.md).*

---

## 1 · Is search a big part of the GTM?

**Yes — but I mislabelled the channel, and the label was doing real damage.**

**Three different things were bundled under "SEO", and they behave nothing alike:**

| | | Speed | Risk | Audience |
|---|---|---|---|---|
| **(a)** | **Ranking our own pages** for queries | 6 months | Thin-content penalty, domain-wide | Mixed — commodity shapes attract students and journalists |
| **(b)** | **Being present** where buyers already look — tools roundups, G2, Datarade, AI answers | **Weeks** | **Near zero** | **Purchase intent by definition** |
| **(c)** | **Being cited** by AI as a source | Weeks–months | Near zero | Whoever asked the question |

**I built the channel model on (a), gave it the swing-factor role, and set its kill condition as *"nothing in the top 20 after six months."* That measures the slowest, riskiest third of the channel and ignores the two-thirds that pay fastest.**

> **The channel is not SEO. It is discoverability — and its fastest, highest-intent components are not search at all.**

**Revised weighting:**

- **(b) and (c) should be producing signal by week 4–8.** They are cheap, they hit purchase intent, and they need no ranking
- **(a) is a bet placed now that pays from month 6** — worth placing, not worth leaning on
- **The first-quarter contribution comes from presence, not position**

**So: yes, big — bigger than scoped in one respect, because the AI-tools category is being chosen *right now* on citation quality, which is our exact claim. But its shape and its clock are different from what `channel-model.md` §3.1 says.**

---

## 2 · The approach we believe, in order

| | | Why first | Evidence |
|---|---|---|---|
| **1** | **Get into the lists buyers and AIs already read** — AI-research-tool roundups, G2, Datarade, Capterra | **Purchase intent, immediate on inclusion, outreach not ranking.** 6.5× more citations come via third parties than own domain | The AI answer for *"best AI deep research tool"* names Perplexity, ChatGPT DR, Kimi, Consensus, Scite. **Caspr appears in none of it** |
| **2** | **AEO as a build standard** — every template, not a content family | Costs almost nothing at build time, expensive to retrofit. **No downside case exists** | Citing sources **+40%**, statistics **+37%**, low-authority bonus **up to 115%** |
| **3** | **Data pages on commercial-CPC shapes**, seeded narrow — valuations, B2B niches, emerging geographies. **Not commodity trivia** | Highest ceiling, weakest conversion evidence. **Test before scale** | 7 of 7 shapes tested carry unreconciled contradictions; the worst are in the thinnest coverage |
| **4** | **The Record** | Already funded, already scheduled | Original research is rung 1 of data defensibility |

**Dropped: methodology as a family** — Scribbr and university libraries own it, CPC $9 against $300, wrong audience.
**Dropped: `/alternatives/*` at eight pages** — ~490 searches/month total, and G2 owns those SERPs. **Replaced by item 1**, which targets the pages that actually rank.

**The single discriminator that runs through all of it:** **CPC, not volume.** `secondary research` at $9 is a student. `competitive landscape analysis` at $300 is a buyer. **Advertisers will not pay $300 to reach an undergraduate**, and no volume figure tells you that.

---

## 3 · Do we need more Ahrefs?

**Not to make this decision. It is made, and none of it hinges on volume.**

**Two specific jobs remain, and they are separated by months.**

### Now — small, and it qualifies item 1

**Which roundup and directory targets are worth the outreach hours.** Traffic and authority for the sites that rank for `best AI deep research tool` and `best market research tools` — kimi.ai, cybernews, jotform, index.dev, theairankings, G2, Datarade. **~15 domains, Site Explorer overview only.**

**Roughly 2,000–4,000 units.** It stops us spending outreach on a listicle nobody reads.

> **⚠ Downgraded 2026-08-25 — no longer blocking.** Running the presence-basket questions produced the domain list directly ([`../gtm/presence-baseline-2026-08.md`](../gtm/presence-baseline-2026-08.md) §4). **Ahrefs would add traffic and authority figures to a list we now have; it was never going to change *who* is there.** Reduce the pull to a priority check, or drop it.

**One target is confirmed across two independent query families and should go first: `cybernews.com`.**

### Later — the big one, and it is gated

**Sizing the data-page pattern before we build it**: aggregate volume and CPC across commercial shapes, so we know whether to seed 50 pages or 5,000, and which sectors first.

**Gated on the conversion test.** If three test pages do not send visitors into the product, item 3 is a brand asset rather than an acquisition channel, and sizing it would be sizing something we are not going to build.

> **Free tools answered every question that decides direction. Ahrefs answers questions of degree — how many, which first, how much.** Those matter when building, not when choosing.

**One adjustment from §3A:** the sizing pull is no longer gated on the conversion test, because seeding starts regardless. **It is gated on the seeded pages being indexed** — sizing what to build next is only useful once we know the first 40 can rank at all.

---

## 3A · The long-lever correction — start now, scale on evidence

*Joy, 2026-08-25: the sequencing above optimises for what can be tested in weeks, which quietly biases against
anything that pays in months. If a lever pays at month 12, starting it in month 6 means results at month 18.*

**That is right, and I had conflated two different decisions.**

> **Starting is not scaling.** I gated the *start* of a six-month lever on a conversion test that itself takes
> eight weeks to read — pushing results to month eight or ten **for no reason**, when the first pages *are*
> the test.

**Three changes.**

### 3A.1 De-sequence the data pages — the first 40 are the test

**Seed 40 pages now**, on commercial-CPC shapes, built to the AEO standard. **They serve both purposes at
once:** the six-month indexation clock starts immediately, and they are the sample the conversion test reads.

**The gate moves from *start* to *scale*.** Under 1% of visitors reaching `prompt_submitted` after 1,000
sessions means we do not go from 40 pages to 4,000 — it does not mean the 40 should not exist. **They remain a
citation and brand asset either way**, and they cost a cached `fact_lookup` each.

**Seeding narrow was already the thin-content mitigation.** It is now also the test design.

### 3A.2 Authority building starts week 1 — it is the input to everything else

**Under-weighted badly, because it is slow and therefore untestable in the window I was optimising for.**

**Domain authority is the multiplier on every other search play.** The same page published on a DR-20 domain
in month 1 and a DR-40 domain in month 12 performs differently — **and the DR-40 is only available in month 12
if the work started in month 1.**

**Already a runbook target at 15 backlink conversations a month, and it was sitting below items that pay
faster.** It moves to week 1 and it does not wait for anything: guest posts, digital PR off The Record,
directory citations, and the original-research links that `operations-runbook` §6 already names as the only
legitimate routes.

### 3A.3 Entity establishment starts now — the cheapest long lever there is

**Not previously proposed at all.**

AI systems cite entities they recognise, and **Wikipedia alone is ~7.8% of ChatGPT citations.** Caspr today has
no Wikidata entry, no consistent entity signals, and `Organization` schema nowhere on the site — the site has
**zero JSON-LD on any page.**

**This takes months to establish and costs almost nothing to begin:**

- **`Organization` schema** with consistent naming, founding, location and identifiers — already in the website
  scope, now with a second reason
- **Wikidata entry** — permitted and straightforward, unlike Wikipedia
- **Consistent entity signals** across every directory, profile and listing
- **Getting mentioned in the kind of source Wikipedia would cite**, which is what makes a page possible later

> **Do not create a Wikipedia page for ourselves.** Notability and conflict-of-interest rules make
> self-authored pages a liability rather than an asset. **Earn the citations first; the page follows or it
> does not.**

---

## 3B · The revised shape

| | | Starts | Scales on |
|---|---|---|---|
| **1** | Roundup and directory inclusion | **Week 1** | Immediate — inclusion is the outcome |
| **2** | AEO build standard | **Week 1** | No gate. It is a bar, not a bet |
| **3** | **Authority building** — backlinks, digital PR | **Week 1** | Continuous. Never gated |
| **4** | **Entity establishment** — Wikidata, schema, consistency | **Week 1** | Continuous. Never gated |
| **5** | **Data pages — 40 seeded** | **Week 1–2** | **The conversion test at ~1,000 sessions.** Scale to thousands only if it passes |
| **6** | The Record | Already scheduled | Already funded |

**Everything starts in the first fortnight. Only item 5 has a gate, and the gate is on scale rather than
existence.**

**The cost of this hedge is low and the asymmetry is favourable:** if the slow levers work, we see it at month
six instead of month twelve; if they do not, we have spent 40 generated pages and outreach hours that were
already committed to other targets.

---

## 4 · What this changes upstream

| Document | Change |
|---|---|
| **`channel-model.md` §3.1** | Retitle from *organic search* to **discoverability**. Split the line into presence (weeks) and ranking (6 months). **The kill condition is wrong** — position is the wrong measure |
| **`content-approach.md` §3B** | Search answers reframed: AEO standard first. Data pages skew to commercial CPC. Methodology dropped |
| **`website-session-prompt.md`** | `/alternatives/*` cut from 8 to 1. **AEO requirements added as a standard every template meets.** Declare a sitemap — none exists today |
| **`plan.md`** | Directory and roundup outreach moves to weeks 1–2. It is the fastest search-adjacent win available |
| **`operations-runbook.md` §6** | Directory submissions target already exists at 10/month. **Add roundup inclusion as a named target** |
| **`findings.md` §1.4** | Wrong, and corrected in the stress test. The programmatic pattern is validated, not weak |

---

## 5 · The honest residual

**Two things are still unknown and both are testable rather than arguable:**

1. **Does the disagreement convert?** §3.1 of the validation doc. Three pages, 1,000 sessions, 1% bar
2. **Does our buyer ask Google or ask an AI?** If mostly the latter, every volume number understates demand and overstates the value of position — **and item 1 matters even more than it already does**

**Neither blocks starting.** Items 1 and 2 are correct under either answer.
