# Content Calendar — the spread

*Version 1 — 2026-08-24. Twelve weeks of slots, and an audit of what they actually cover.*

**Implements:** [`content-approach.md`](content-approach.md) §3 *(four types)* and §4 *(the editorial line)* · [`plan.md`](plan.md) §1–3 · [`operations-runbook.md`](operations-runbook.md) §1, §4, §5 · `caspr-dm-handover/02-linkedin-profiles/audit.md` §5 *(voice lanes)*

---

## 0 · Why this comes before the engine

**The strategy above this document is asserted, not tested.** Channel model, content approach and editorial line are all statements of principle. Laying out twelve weeks is the first point at which they can be checked against arithmetic — and §5 below shows they do not fully survive it.

**Cheap now, expensive later.** A calendar is an afternoon to change. Generation prompts built against the wrong item mix are not.

### What this is, and what it deliberately is not

> **This plans slots, not topics.**

Topic selection is demand-driven (`content-approach.md` §5) — a four-source pipeline ranks candidates and a human picks. **A calendar that pre-named twenty-four topics would contradict that and would be fiction by week three.**

So every row below fixes **the slot**: which week, which type, which channel, which movement, which ICP it serves, which pillar it carries, who reviews it. **What fills the slot comes from the pipeline.**

---

## 1 · The week — the repeating unit

The rhythm is fixed by `operations-runbook.md` §1: generation Thursday 06:00, review Thursday–Monday, deadline Monday 18:00, publishing Tuesday–Sunday.

### 1.1 What gets made — 23 items

| Type | Item | Per week | Origination? | Reviewer | Review min |
|---|---|---|---|---|---|
| **B** | Search answers | 2 | **Yes** | SEO + TL | 20–30 |
| **A** | Published analysis | 0.25–0.5 | **Yes** | TL + Joy | 10–15 amortised |
| **D** | LinkedIn — Joy | 1 | No | TL | 2 |
| **D** | LinkedIn — Jayant | 1 | No | TL | 2 |
| **D** | LinkedIn — rotating team | 2–3 | No | Social | 4 |
| **D** | X posts | 3 | No | Social | 4 |
| **D** | Community thread drafts | 5 | No | Social | 6 |
| **D** | Outreach drafts | 4 | No | TL | 6 |
| **D** | Email | 0–2 | No | TL + Joy | 3 |
| **—** | SEO tasks — schema, links, metadata | 3 | n/a | SEO | 5 |
| | **Total** | **~23** | | | **~62–77** |

**Plus 14 personal comments** — two per person — which do not pass the review gate. They are personal, low-risk, and gating them would triple the queue for no benefit.

**Plus the `/market-size/*` pages**, generated from `fact_lookup` and not in the review queue as individual items. **The template is reviewed once; the pages are not.** *(This is the single biggest reason the volume plan fits — see §5.4.)*

**Against ~450 available minutes, the plan spends ~62–77.** The headroom absorbs regeneration and the weeks a published analysis lands.

### 1.2 Which days

| Day | Publishes | Who |
|---|---|---|
| **Tue** | Search answer #1 · Joy LinkedIn · 1 X post | Automatic |
| **Wed** | Company page · 1 X post · community threads *(human posts)* | Auto + Social |
| **Thu** | Jayant LinkedIn · rotating team post | Automatic |
| **Fri** | Search answer #2 · 1 X post | Automatic |
| **Mon** | Rotating team post · email when scheduled | Auto + TL |
| **Any** | Outreach — Joy taps send | Joy |

**Joy's post lands Tuesday** because the engagement rule depends on colleagues commenting inside 30–60 minutes, and a mid-week morning is when that is realistic. **Never two people on the same subject in the same week** — the lanes in `audit.md` §5 enforce it.

---

## 2 · The twelve weeks

**One argument, three movements.** The movement sets what every item that week is *about*; the pipeline sets the specific topic.

| Wk | Movement | Type A lands | Type B focus | ICP weight | Pillar |
|---|---|---|---|---|---|
| **1** | **The question after the number** | — | Market-size template live · 2 written | Investors | 1 |
| **2** | ” | — | `/alternatives` ×2 | Investors · Consultants | 1 |
| **3** | ” | **Analysis 1 — THE RECORD no.1: the research industry, analysed** | `/alternatives` ×2 | Investors | 1 |
| **4** | ” | *(fan-out)* | Job-shaped ×2 | Consultants | 1 |
| **5** | **Where numbers come from** | — | `/alternatives` ×2 | Investors | 1 + 2 |
| **6** | ” | **Analysis 2** | Job-shaped ×2 | Consultants · **Agencies open** | 2 |
| **7** | ” | *(fan-out)* | Job-shaped ×2 | Agencies | 2 |
| **8** | ” | — | `/vs/*` refresh ×2 | Investors · **Strategy opens** | 2 |
| **9** | **What research costs** | **Analysis 3** | *"how much does market research cost"* | Strategy | 4 |
| **10** | ” | *(fan-out)* | Job-shaped ×2 | Consultants | 4 |
| **11** | **Back to the analyst** | — | `/alternatives` ×2 | Agencies | **1** |
| **12** | ” | **Analysis 4** | Job-shaped ×2 | Investors | **1** |

**Type A lands every third week**, and its twenty derivatives spread across that week and the next — which answers the engine brief's open question about lumpy weeks. **The fan-out is deliberately spread, not dumped.**

**Weeks 1–4 are tight; weeks 9–12 are indicative.** By week 9 the demand pipeline has real prompt clusters and the rejection ledger has real failure modes. **A calendar that pretended to know week 11 in August would be theatre.**

---

## 3 · Coverage — ICP

| ICP | Weeks with dedicated content | Share of Type A/B | Passive coverage |
|---|---|---|---|
| **3 · Investors** | 1, 2, 3, 5, 8, 12 | **~35%** | Site + search |
| **1 · Consultants** | 2, 4, 6, 10 | **~25%** | Site + search |
| 4 · Agencies | 6, 7, 11 | ~20% | Site + search |
| 2 · Strategy | 8, 9 | ~15% | Site + search |
| 5 · Founders | — | 0% | **Site + search only** |
| 6 · Market Research | — | 0% | **Site + search only** |
| 7 · Category | — | 0% | **Site + search only** |
| 8 · Students | — | 0% | **Site + search only** |

**Four ICPs get no active content for twelve weeks, and that is correct.** The narrow launch is the plan (`plan.md` §1). Their pages ship, rank and convert passively; they simply do not get origination minutes.

**But it needs stating explicitly rather than emerging by accident**, because the drift risk is real: a team with eight ICP pages in front of them will naturally produce content for all eight and dilute everything.

**Search answers are substantially ICP-agnostic.** *"Market size of [industry]"* serves whoever searched it. **So the unserved four are not invisible — they are unaddressed, which is different.**

---

## 4 · Coverage — pillars

| Pillar | Share | Where |
|---|---|---|
| **1 · An Analyst, Not an Assistant** | **~45%** | Movements 1 and 2. The spine |
| **2 · Analytical AI** | ~20% | Movement 2 — `/vs/*`, social, founder content only |
| **3 · From Weeks to Minutes** | ~10% | Proof lines only. Correctly demoted |
| **4 · A Fraction of the Cost** | ~20% | Movement 3, weeks 9–12 |
| **5 · Your Data is Your Data** | ~~5%~~ → **~12%** | Permission layer **+ a monthly standing slot in Jayant's lane.** Fixed 2026-08-24 |

---

## 5 · What the spread audit found

**Four things. Two are real problems.**

### 5.1 ⚠ Pillar 5 is at ~5% and it answers our primary ICP's main objection

**The editorial line was written before the launch ICP was chosen, and it shows.**

Three movements cover pillars 1, 2 and 4. **Nothing covers Pillar 5 — *Your Data is Your Data*.** Meanwhile the primary launch ICP's leading objection is:

> *"Our compliance team reviews all third-party research tools."* — `icp-personas.md:276`

**For Investors, trust is not a nice-to-have fold; it is the gate.** `brand-guidelines.md` says Pillar 5 *"surfaces at the moment of trust — when a professional is about to upload a data room."* That is exactly the investor's moment, and the twelve weeks contain no content that meets it.

**Fix, and it is small:** the permission layer already covers the factual half. **Add one recurring slot — Jayant's lane, monthly, on the security and data-handling side of the build.** It is already his lane (`audit.md` §5 names security explicitly), it needs no new capability, and it moves Pillar 5 from ~5% to ~12% without displacing anything.

### 5.2 ⚠ Movement 3 leads on cost for a quarter of the calendar

Weeks 9–12 are *"what research costs"* — Pillar 4. **`CLAUDE.md` rule 3 says cost is the third act, never the hook.**

**Being the third act is not the same as being a third of the output.** Four consecutive weeks of cost-led content is a tonal shift a reader will notice, and it lands precisely when the `x@3` reading arrives — so if conversion looks weak in month three, the instinct will be to discount further, off the back of a month of price-led content.

**Fix:** keep movement 3, shorten it. **Weeks 9–10 on cost; weeks 11–12 return to Pillar 1** with the accumulated evidence of three published analyses behind it. **Cost as the closing argument, not the closing quarter.**

### 5.3 ✓ Channel coverage holds

| Channel | Weekly | Enough? |
|---|---|---|
| Organic search | 2 written + generated `/market-size/*` | **Yes** — the only compounding line, and it gets the most published surface |
| LinkedIn | 4–5 posts + 14 comments | Yes — matches the re-based 20–50/month |
| Communities | 5 drafts, human-posted | Yes |
| Outreach | 4 drafts | Yes — bootstraps weeks 1–2, then steady |
| X | 3 | Yes |
| Email | 0–2 | Yes — re-engagement opens week 5 |
| Trade press | Monthly, not weekly | **Human-only work, correctly outside the queue** |

### 5.4 ✓ The volume fits, for one specific reason

**~62–77 minutes against ~450 available.** It fits because **only 2.5 items a week are origination.** Twenty derivatives at 1–2 minutes each is 20–40 minutes; two search answers at 10–15 each is the same again.

**The generated `/market-size/*` pages are the reason this works at all.** Had they stayed hand-written type B, the two-a-week origination budget would have gone entirely to market-size pages and there would be nothing left for `/alternatives`, the job-shaped queries or anything else. **Retiring the free tool as a tool and keeping the pages as generated content is what freed the calendar.**

**The failure mode to watch:** origination creeping up because derivatives are cheap. `content-approach.md` §6 — **scale derivatives freely, origination only against reviewer minutes.**

---

## 6 · Cold start — weeks 1 and 2

**The engine's first fortnight is a different problem from its tenth week**, and it is the open question in `content-engine-prompt.md` §6.

| Missing | Substitute |
|---|---|
| Prompt clusters — no users yet | External signal: search volume, community question flow, event flow |
| A rejection ledger | **Joy's corrections during the outreach bootstrap.** An hour a day for two weeks, editing rather than composing — those corrections *are* the seed ledger |
| A published analysis to derive from | **Joy's 60+ existing analyses** and the three `/samples` reports. Both are real, cited Caspr output and both exist on Day 1 |
| Case material | The ten testimonials |

**No week-one item is generated from nothing.** That is the test the cold start has to pass.

---

## 7 · What this changes upstream

| Document | Change |
|---|---|
| **`content-approach.md` §4** | **Movement 3 shortens to weeks 9–10**; 11–12 return to Pillar 1. §5.2 |
| **`content-approach.md` §4** | **Add a monthly Pillar 5 slot in Jayant's lane** — security and data handling. §5.1 |
| **`content-engine-prompt.md` §6** | Two of its three open questions are answered here: **fan-out spreads across two weeks** (§2), and **cold start runs on external signal plus Joy's existing analyses** (§6). The rejection-ledger mechanism remains open |
| **`operations-runbook.md` §4** | Volume table reconciles at ~23 items; **review minutes revised to 62–77**, split origination vs derivative |

---

## 8 · Open

| | |
|---|---|
| **1** | ~~Confirm the two fixes~~ — **both agreed, 2026-08-24.** Movement 3 shortens to weeks 9–10; Pillar 5 gets a monthly standing slot in Jayant's lane | ✅ |
| **2** | ~~Type A cadence~~ — **four analyses in twelve weeks.** Agreed 2026-08-24 | ✅ |
| **3** | ~~Who commissions Analysis 1~~ — **Joy, personally.** Due end of week 1, from external signal and judgement; the demand pipeline has no prompt data that early | ✅ |
| **4** | ~~The launch~~ — **carried in [`launch-plan.md`](launch-plan.md).** Issue 1 lands week 3 and sets the register; the **staleness index** launches at the peak as a standing monthly feature | ✅ |
| **5** | ~~Disclosure on issue 1~~ — **decided.** Standing note in the cover foot of every issue touching the research sector; wording in `guerrilla-evaluation.md` §5.1 | ✅ |
