# The Plan

*Version 2 — 2026-08-20. The operating plan from Day 1.*

**Upstream:** [`gtm-strategy.md`](../../.agents/gtm-strategy.md) §11 *(purpose and x)* · [`channel-model.md`](channel-model.md) *(where)* · [`content-approach.md`](content-approach.md) *(what)*
**Downstream:** [`operations-runbook.md`](operations-runbook.md) *(the weekly cycle)*

---

## 0 · Day 1

**Day 1 is the day the rebuilt website and the app go live, with everything in place.** Build sequencing is not this document's problem. This is the operating plan that starts on Day 1 and runs to the `x@6` decision.

**Assumed live on Day 1:**

| | |
|---|---|
| Rebuilt website · the app · funnel tracking instrumented | The gate |
| `/samples` — three real reports · 10 published testimonials | The proof layer. **Reports selected 2026-08-26** — **Saudi industrial valves** · **Reconcile UK ready meals** · **Vertical SaaS valuations**, [`report-evaluation-2026-08.md`](report-evaluation-2026-08.md) §6 |
| The content engine, cold-started · the portal, operating · **the text-hygiene service deployed with it** | The machine |
| `fact_lookup` and `demand_signal` — Jayant's team is tweaking an existing version | The data layer |

**One rule survives from before Day 1 and it is the only one:** nothing publishes into the old surfaces. After Day 1 it is moot.

---

## 1 · Who goes first — Investors primary, Consultants secondary

**Decided by Joy, 2026-08-20. The criterion is an approved budget plus a directly reachable decision-maker** — no B2B sales motion, no procurement, no approval chain.

| ICP | Avg MRR | Whose money | Reachable directly? |
|---|---|---|---|
| **3 · Investors** | **$520** | Fund's research budget | ✓ *"Joy's direct network… fund managers who can be early Enterprise users"* `:305` |
| **1 · Consultants** | $185 | **Client-funded research budget** | ✓ *"Free. Highest conversion rate of any channel."* `:121` |
| 4 · Agencies | $480 | **Own margin** — *"unbillable overhead… every hour comes off my margin"* `:352` | ✓ |
| 2 · Strategy | $480 | Discretionary — *"$1–3k/month for tools"* `:186` | ✓, slower; board-ready bar is highest |
| 6 · Market Research | $250 | Own margin, price-sensitive | Longest objection table, incl. *"a threat to my job?"* `:557` |
| 5 · Founders | $130 | *"I have $0 for research"* `:445` | — |
| 8 · Students | $8–40 | Per-transaction. **Would pollute the first `x` reading** | — |

**The budget distinction is the one that matters, and MRR per user hides it.** An agency strategist spends their **own margin** — research on a pitch they may not win is pure unrecoverable cost. A consultant spends a **client-funded** research budget, against a $200/hour billing rate that makes an $80 Study trivially justifiable (`:78`). **Same purchase friction; entirely different question being asked before the card comes out.**

**Two further reasons this pairing is right, beyond the stated criterion:**

**Both name Joy's direct network as their highest-converting channel** — `:121` and `:305`. The founder-outreach channel that bootstraps in weeks 1–2 serves precisely these two ICPs and nobody else as well.

**Both cluster by email domain; boutique agencies do not.** The **Org** gate fires at 3+ active accounts on one company domain, and `gtm-strategy` §3 names ICPs 1–3 as the natural Enterprise conversion path. **A consultancy or a fund produces domain clusters by construction. A sub-50-person agency rarely will.** That is what makes ICP 1's lower $185 work: it is the entry price of a firm, not the ceiling.

**Opening in Phase 2:** Agencies and Strategy. Both $480, both low-friction, both better once eight weeks of case material exists.

**Market Research is not a launch ICP.** Half the revenue per user of Investors, the longest objection list, price sensitivity, and the sharpest AI-displacement anxiety of any segment. **The testimonials do not change that** — the practitioners' firms are recognised across finance, consulting and strategy, so that proof is portable to every ICP rather than tied to one.

---

## 2 · Weeks 1–4 — one cohort, correctly attributed

**The goal is a readable first cohort, not volume.**

| Channel | State | Target/month |
|---|---|---|
| LinkedIn — seven accounts | Live | 20–50 |
| Communities — Finance X, VC/PE networks, Management Consulted, Wall Street Oasis | Live | 20–50 |
| Founder outreach — **bootstrap** | Live | 15–25 |
| Organic search | Publishing; ranking nothing yet | ~0 |
| Trade press | Conversations opened | 0 |
| Paid | **Google Search, opened** — the proof gate cleared on Day 1 | 10–15 |
| Re-engagement of the 1,600 | **Held to week 5** | — |

**Founder outreach bootstraps here.** The engine drafts from day one and Joy corrects — an hour a day for two weeks, spent editing rather than composing, so the engine learns the voice from corrections. Then draft → team QA → **Joy taps send.** Nobody sends from Joy's account.

**Re-engagement is held four weeks deliberately.** It is a bonus, not the plan. Firing it into an unproven funnel spends the one asset that cannot be re-sent — let the net-new cohort find the breakage first.

**What is watched, and it is not signups:** where the *anonymous* funnel leaks. `prompt_submitted` → `layout_rendered` → `signup_wall_shown` → `signup_completed` → `analysis_completed`. **Death at the wall and death at the layout call for opposite fixes.**

### Gate at week 4

| Test | If it fails |
|---|---|
| Cohorts split cleanly into `x_netnew` / `x_reengagement` / unattributed | Fix before anything scales — everything downstream is unreadable |
| Activation trending toward 40% | Product problem. Do not spend into it |
| Reject rate under 10%, review inside budget | Hold volume. Do not scale on enthusiasm |
| Paid CAC under $300 · CTR above 1% after 500 impressions | Kill the campaign — `operations-runbook` §7 |

---

## 3 · Weeks 5–12 — compound

| | Change |
|---|---|
| **Re-engagement of the 1,600 opens** | [`reengagement-sequence.md`](reengagement-sequence.md), tracked as `x_reengagement` and **never blended** into the net-new number |
| **Search compounds** | 2 search answers/week from Day 1. `/alternatives/*` is the highest-intent set on the site |
| **First published analysis lands** | Topic from the demand pipeline — by now `demand_signal` has real prompt clusters, including the sessions that never signed up |
| **Trade press converts** | 2 guest posts, 1 podcast a month |
| **ICP 4 Agencies and ICP 2 Strategy open** | A configuration change, not a build |
| **Volume scales** | +25% after four weeks under 10% reject. **Derivatives scale freely; origination scales only when reviewer minutes exist** |
| **Paid scales only if CAC holds** | It is a validation instrument, not the funnel |

---

## 4 · `x@3` — month 3. A thermometer, not a verdict

**The trial is $100 with a 90-day expiry**, so a user can sit on credit through month three and convert in month four. `x@3` reads early and reads low by construction.

| `x@3` | Read |
|---|---|
| **> 1** | Ahead of schedule. Hold the plan |
| **0.3 – 1** | Normal. The 90-day trial doing what it does |
| **< 0.3** | **Diagnose, do not spend.** Four diagnostics in `gtm-strategy` §11 — the failure is at a nameable stage |

**Do not scale on `x@3` in either direction.**

---

## 5 · `x@6` — month 6. The decision

> **Scale gate: `x@6` > 2 on the net-new cohort.**

| `x@6` | Decision |
|---|---|
| **> 2** | **Scale while it holds above 2.** More spend, more ICPs, more volume — all configuration, no build |
| **1 – 2** | The machine works; the economics do not yet. **Fix conversion, not volume.** The volume requirement is far more sensitive to conversion than to channel breadth |
| **< 1** | **Stop adding channels.** Something upstream is wrong — the offer, the ICP, or the product's first hour. Adding reach multiplies the error |

**`x` is revenue per $1 of total GTM spend — charges actually taken, never budgets authorised.**

**⚠⚠ Re-corrected 2026-08-26. The "correction" above was wrong and the original was right.** It was written
from a bad summary of the access model, not from `pricing-model.md` §3.1. **The original example stands:**
a user who authorises **$200**, runs nothing, and pays the **$14 platform fee** is a *paid user* producing
$14 — and that state is real, not retired.

**The formula, from the source:** `F = B × 0.07` *(charged every month, always)* · `A = B × 0.93` ·
`top_up = A − balance` · **`R = F + top_up`**.

| On a **$600** budget · `F` = $42 · cap `A` = $558 | Charged that month |
|---|---|
| Runs nothing | **$42** |
| Runs one $80 analysis | **$122** — $80 to restore the balance, plus the fee |
| Runs $480 | **$522** |

**So the principle is sharper than either version said:** a user on **$600 a month of research** who runs one
$80 analysis produces **$122**, not $600. **Counting their declared budget as revenue overstates the funnel
by roughly five times** — and a `paying_dormant` user producing $42 is a state normal SaaS does not have,
which is exactly why `x` measures revenue rather than paid users.

> **A declared budget is a ceiling, not a commitment — but the fee floor is real.** Zero consumption is not
> zero revenue.
>
> **And only Org makes the full plan price real** — committed spend, charged per seat regardless of
> consumption. **Everywhere else, revenue is the fee plus whatever was actually run.**

**The 50% margin assumption is already inside the threshold**, which is why 2 is the number and why margin is not a separate input to this plan.

---

## 6 · Capacity

| Person | Committed |
|---|---|
| Joy | 20 min posting · 30 min Wednesday review · **plus 1 hr/day for weeks 1–2**, then ~10 min |
| Marketing TL | ~2.5 hrs |
| Social | ~2.5 hrs |
| SEO | ~2.5 hrs |
| Core team ×6 | 10–20 min each — **distribution only, no review** |

**Review capacity ~450 min/week. The plan spends 50–85.**

**The headroom is deliberate.** It absorbs regeneration, the scaling steps, and the weeks a published analysis lands and costs ~40 minutes alone. It should not be quietly consumed by raising origination.

**The one real constraint:** organic search is the swing factor between ~85 and ~265 signups a month and has ~2.5 hours a week. Either that changes, or the plan's upper half does not happen. §8, decision 2.

---

## 7 · What could break this

| Risk | Watch | Response |
|---|---|---|
| **Attribution not resolving** | Week 1 cohort split | Fix immediately. `x` is undefined without it |
| **Search under-resourced** | Pages published/week vs. plan | Resource it, or re-plan to ~85/month and say so |
| **Origination scales with derivatives** | Review minutes/week | The scaling rule separates them. Enforce it |
| **Paid becomes the funnel** | Share of signups from paid | It is a validation instrument. Kill rules in `operations-runbook` §7 |
| **Cold start is improvised** | The engine's week one | Open question in the engine brief for exactly this reason |
| **Investors stall on compliance** | Conversion by ICP, week 4 | Their own table calls it documentation, not a block — the permission layer is the answer, and it exists |
| **ICP 1 revenue per user disappoints** | MRR by ICP, week 8 | $185 is the entry price of a firm, not the ceiling. **Watch domain clusters, not individual MRR** — 3+ on one domain fires the **Org** gate |

---

## 8 · Decisions needed

| | | By |
|---|---|---|
| **1** | ~~Which ICP goes first~~ — **decided: Investors primary, Consultants secondary.** §1 | ✅ 2026-08-20 |
| **2** | ~~Search resourcing~~ — **resourced. Joy will provide what Day 1 needs.** The upper half of the plan is live | ✅ 2026-08-24 |
| **3** | ~~Free tool~~ — **not built. Retired as a channel** (`channel-model.md` §3.8): no second front door in front of a product that is already free. The sourced-number page design survives as type B content | ✅ 2026-08-24 |
| **4** | ~~The watermark rule~~ — **written as `CLAUDE.md` Project Rule 6.** Text hygiene on everything published; **never on a product deliverable**, which is legally required to carry its AI mark | ✅ 2026-08-24 |
| **5** | **Deploy the hygiene service with the portal.** `remove-ai-marks` is a thin client over an HTTP service that is not currently running. On AWS, not a laptop | Day 1 |
