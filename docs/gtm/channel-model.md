# Channel Model

*Version 1 — 2026-08-20. Derived by validating `icp-personas.md`'s existing channel research against the locked positioning and the owned-channel constraint — not by inventing a new plan.*

**Reads alongside:** [`gtm-strategy.md`](../../.agents/gtm-strategy.md) §9 and §11 · [`icp-personas.md`](../../.agents/icp-personas.md) · [`operations-runbook.md`](operations-runbook.md)

---

## 1 · What this corrects

`icp-personas.md` already carries a channel table for all eight ICPs with monthly lead estimates. **The map existed. Four things were wrong with it**, and three were only visible once the arithmetic was done.

### 1.1 The plan was a bet on one LinkedIn account

Joy's LinkedIn organic appears in **all eight** ICP tables: `15–40 · 20–50 · 10–25 · 12–30 · 15–35 · 10–25 · 8–20 · 8–20` — **98–245 signups a month from one personal account**, a third to a half of the whole plan.

**Against observed data:** 22,161 followers · best-ever Caspr post **2,945 impressions** · typical 900–1,600. Three posts a week is roughly **19,500 impressions a month.** A hundred signups from that needs **0.5% impression-to-signup**; organic social runs **0.05–0.2%**.

**Re-based to 20–50/month across all seven accounts.** The other six add ~9,300 followers against Joy's 22,161 — amplification helps, it does not close a 5× gap.

### 1.2 There was no search channel at all

Not one of the eight tables contained organic search, SEO or programmatic. `gtm-strategy` §9 lists keyword clusters; they never reached the channel model. **Search is the only channel that compounds without more human hours**, and ~285 of ~300 monthly signups must come from owned. That was the structural gap.

### 1.3 A fifth of the plan worked exactly once

Founder outreach (ICPs 1–4), trade press (6, 7), Management Consulted and PrepLounge, club partnerships — roughly **140–300 of the 90-day totals are non-repeating**, and nothing separated them from run-rate.

### 1.4 The founder time it assumed contradicted the operating plan

The persona plan needs 3 posts a week, ~100 personal messages, community work, podcasts and a webinar — **10+ hours a week.** The operating plan allocated **20 minutes.** Resolved in §3.4.

---

## 2 · The target

**~150 signups a month**, not ~300 (Joy, 2026-08-20).

Breakeven at 3–5% signup-to-paid needs ~4,200 signups. **At 10% it needs ~1,670.** The correct-ICP hypothesis is that conversion improves materially — so **the volume requirement is more sensitive to conversion than to channel breadth.** Planning to 300 before conversion is proven would be building for a number we invented. `x` tells us which world we are in.

---

## 3 · The channels

**Confidence** is stated because most estimates inherit persona research that proved optimistic where it could be checked.

| | Channel | Owner | Recurring | Monthly | Confidence |
|---|---|---|---|---|---|
| **3.1** | **Discoverability** — presence · citation · ranking | SEO | Yes — compounds | 10 → 100+ | **Re-scoped 2026-08-25** |
| **3.2** | LinkedIn — seven accounts | Social | Yes | 20–50 | **Observed**, re-based |
| **3.3** | Communities and Reddit | Social | Yes | 20–50 | Estimated |
| **3.4** | Founder outreach | Joy → delegated | Partly | 15–25 | Estimated |
| **3.5** | Trade press and guest posts | TL / SEO | Partly | 10–25 | Estimated |
| **3.6** | Paid | TL | Yes | 10–15 | Estimated |
| **3.7** | Product Hunt · Show HN | TL + Joy | **One-time** | 600–2,500 *(event)* | Assumed |
| **3.8** | ~~Free tool~~ — **retired 2026-08-24.** Folded into 3.1 | — | — | — | See §3.8 |
| **3.9** | **Collaboration** — the invited editor | **Product, not marketing** | **Yes — compounds** | **Unmodelled** | **New 2026-08-26** |

---

### 3.1 Discoverability — retitled and re-scoped 2026-08-25

> **This was *"organic search — the swing factor"*, built entirely on ranking our own pages.
> [`docs/seo/decision.md`](../seo/decision.md) splits it into three things that behave nothing alike.**

| | | Speed | Risk |
|---|---|---|---|
| **(a)** | **Ranking our own pages** | 6 months | Thin-content penalty, domain-wide |
| **(b)** | **Presence** — tools roundups, G2, Datarade, AI answers | **Weeks** | Near zero |
| **(c)** | **Citation** by AI as a source | Weeks–months | Near zero |

**The first-quarter contribution comes from (b) and (c), not from (a).** Testing across seven query shapes
found the AI-research-tools category is being chosen **right now** on citation quality — Caspr appears in
none of it — while the ranking play needs six months and its highest-volume terms attract students.

**The kill condition below is wrong and is replaced in §3.1a.** Position measures only (a).

### 3.1a The old framing, kept for the argument it still makes

**The difference between ~85 and ~265 a month, and the only line that grows without more human hours.**

Three surfaces: **job-shaped queries** (*"market size of [industry]"*, *"[industry] competitive analysis"*, *"how much does market research cost"*) · the **glossary** as an answer-engine surface · the nine **`/vs/*` pages**, which exist, rank for nothing, and are linked from nowhere.

**Meets the ICP at the job, never at the category.** Nobody searches "analytical AI."

**Needs from the website:** structured data (site has **zero JSON-LD**) · the **12 orphan pages** linked into nav and footer · programmatic templates · a glossary · internal linking.
**Kill conditions — revised 2026-08-25, one per component:**

| | Component | Kill condition |
|---|---|---|
| **(b)** | Presence | **Under 3 roundup or directory inclusions after 25 approaches.** Reads in weeks |
| **(c)** | Citation | **Not cited in any AI answer for 10 tracked queries after 3 months** of publishing to the AEO standard |
| **(a)** | Ranking | No page in the top 20 for any target query after **6 months**. **Not sooner** — search does not fail fast, and killing it early is the classic error |

**The discriminator for what to target is CPC, not volume.** `secondary research` at **$9** is a student;
`competitive landscape analysis` at **$300** is a buyer. **Advertisers will not pay $300 to reach an
undergraduate**, and no volume figure tells you that.

### 3.2 LinkedIn — seven accounts

Voice lanes and cadence in [`profile-audit.md`](../../caspr-dm-handover/02-linkedin-profiles/audit.md) §5. Joy 1/week, Jayant 1/week, the rest fortnightly, two substantive comments each.

**The format is settled by evidence:** the two best-performing Caspr posts across both founders were both *real analysis, document attached* — 2,945 impressions on Joy's, and the same format on Jayant's.

**Needs from the website:** ICP landing pages with `icp_hint` · sharable assets.
**Kill condition:** median impressions per post falling for **4 consecutive weeks** at maintained cadence.

### 3.3 Communities and Reddit

Strongest for **ICP 8** — r/MBA, r/consulting, WSO, PrepLounge. Also #mrx and ESOMAR (ICP 6), Chief of Staff communities (ICP 2), AMI (ICP 4).

**Never automated. A person posts, always.** The portal surfaces the thread and drafts; automated posting here burns the channel permanently.

**Needs from the website:** `/samples` holding real reports — community credibility depends on showing output, not describing it.
**Kill condition:** any account warned or removed. Community trust does not survive a second breach.

### 3.4 Founder outreach — bonus, not pillar

**Three types, different rules:**

| Type | Delegable | Why |
|---|---|---|
| **Cold** — targeted strangers | **Yes**, once the voice is learned | No prior relationship to damage |
| **Warm** — people who know Joy | **No** | A message not really from Joy, to someone who knows Joy, is worse than none |
| **Replies** | **Never** | One exchange and it breaks |

**Bootstrap (weeks 1–2):** the **engine drafts from day one and Joy corrects.** Corrections carry more signal than originals — they show what was nearly right and what was rejected. Same rejection-ledger pattern, applied to voice. Joy's hour a day is spent editing, not composing.

**Then:** engine drafts → team QAs → **Joy taps send.** One OAuth grant, one tap — the pattern already designed for the personal post queue. **Nobody sends from Joy's account:** account sharing breaches the spirit of LinkedIn's terms, exposes credentials, and is discoverable the moment a reply doesn't sound like Joy.

**Time:** an hour a day for two weeks, then ~10 minutes.
**Kill condition:** cold response below **10%** over 100 messages.

### 3.5 Trade press and guest posts

Quirks and GreenBook (ICP 6), The Drum and Campaign (ICP 4), category-management press (ICP 7). **Also the backlink route** — `operations-runbook` §6 names guest posts and original research as the legitimate paths.

**Largely one-time per placement.** Targets: 2 guest posts, 1 podcast a month.
**Kill condition:** fewer than 1 placement per 15 conversations opened.

### 3.6 Paid — a validation instrument, not an acquisition channel

**Google Search first, not LinkedIn.** High commercial intent at materially lower CPC; LinkedIn charges $8–18 to interrupt someone who wasn't looking.

**Its job is to find out which message converts, cheaply**, so the owned engine knows what to amplify. At ~$850 deployable it buys ~10 signups a month — real, but never the funnel.

**Gated:** does not start until testimonials are published and `/samples` holds three real reports.
**Kill conditions:** `operations-runbook` §7 — CAC > $300 · zero conversions after 100 clicks · CTR < 1% after 500 impressions.

### 3.7 Product Hunt and Show HN — planned, not parked

**The largest numbers in the persona research** — 500–2,000 and 100–500 — and free. Currently deferred to a phase that keeps receding.

**One-time, and they only fire once**, so they need the proof layer live and the product genuinely ready. **Schedule them deliberately once `x` is established**, not as a phase-4 aspiration.

### 3.9 Collaboration — a channel the GTM layer does not run

**Added 2026-08-26 from [`../product/access-model.md`](../product/access-model.md) §5.2. It belongs in this
table even though nobody on the DM team touches it.**

**The mechanic:**

| | |
|---|---|
| **1** | An owner shares an analysis. **Viewing is free and ungated, always** — forwarding is the distribution |
| **2** | They invite a colleague to **edit**. Editing debits the **owner's** wallet, so it starts with no friction and no card |
| **3** | **The colleague's own $100 trial is untouched.** It sits in their account, reserved for their first question |
| **4** | An editor **cannot start** an analysis. The moment they have a question of their own, **they are already in the funnel with $100 waiting** |
| **5** | A third colleague on the same domain **fires the Org gate** at 3+ active accounts |

> **The trial stops being a signup incentive and becomes something that travels through the work** — delivered
> to someone holding a real document, on a real task, vouched for by a colleague.

**⚠ Why it is a channel and not a product detail.** Every other row in this table buys a stranger's attention
and hopes it survives to a first analysis. **This one arrives with the attention, the context and the
referral already in place.** Treating it as a feature means nobody measures it.

**What the GTM layer owes it:** nothing to run, **two things to instrument** — first touch attributed to
*invited collaborator*, and domain-cluster detection surfaced early enough to act on before the third
signup, not after.

**Monthly volume is deliberately blank.** It cannot be estimated before the app is live, and **a fabricated
number here would be worse than an empty cell** — it would get planned against.

---

### 3.8 Free tool — retired as a channel, 2026-08-24

**Specced, then dropped, and the reasoning is worth keeping.**

The free tool was to be a sourced market size on a public page. Testing it against the product exposed two problems:

**1 · It was a second front door in front of a product that is already free.** Caspr's offer is *"Ask a question. No account needed"* — the visitor prompts, converses, sees a layout and watches the Theater before any account exists. **A weaker free thing standing in front of that splits the entrance and reads as Caspr Lite**, which is corrosive for a brand positioned as *the analyst*. *(Joy, 2026-08-24.)*

**2 · The valuable part was never the tool.** Its justification was the public, permanent, citable URL — which the product genuinely cannot produce. **But that is a page, not a tool.** The dropdowns added only on-demand generation of a page that does not exist yet. **The wrapper was a tenth of the value and all of the front-door problem.**

**And the headline claim did not survive checking.** §3.8 previously called it *"the only option that could produce volume without waiting for search to compound."* That was asserted, never argued. A page ranks on the same timeline whichever way it was made, and the **20–80/month was partly double-counted against the organic search line** in §3.1.

**What survives, and where it went:** the sourced-number page design — every credible source shown, the disagreement displayed rather than resolved, backed by `fact_lookup` rather than a billable analysis — is now **type B content in [`content-approach.md`](content-approach.md) §3B**, owned by the content engine.

**Net effect: one fewer thing to build.**

---

## 4 · What the website must provide

**Time-critical — the website session is about to run, and if these land after the Figma freeze they wait for the next build cycle.**

| Requirement | Serves |
|---|---|
| **Every CTA carries `icp_hint` and lands on a pre-filled, ICP-relevant question** | All channels. The onboarding already personalises on it; a generic landing wastes it |
| **The offer stated once** — *"Ask a question. No account needed."* The $100 leaves acquisition surfaces | All channels |
| **Structured data** — `Organization`, `BreadcrumbList`, `Article`, `VideoObject`, `SoftwareApplication` | 3.1 |
| **The 12 orphan pages linked** into nav and footer | 3.1 |
| **Programmatic templates + glossary** | 3.1 |
| **`/samples` holding three real reports** | 3.3, 3.6, and every credibility moment |
| **`utm_*` on every outbound link** | Attribution, and therefore `x` |

---

## 5 · Sequencing

Nothing runs before the launch gate — rebuilt website **and** app live (`gtm-strategy` §2, principle 1).

| Phase | Channels |
|---|---|
| **Pre-launch** | Build only. SEO groundwork, testimonial production, engine build, tracking instrumented |
| **Launch + 0–4 weeks** | LinkedIn · communities · founder-outreach bootstrap. **Narrow: one or two ICPs.** First cohort instrumented for `x` |
| **+4–12 weeks** | Search publishing compounds · trade press · re-engagement of the 1,600 *(bonus)* |
| **Once `x@6` > 2** | Paid opens · Product Hunt and Show HN scheduled · widen ICPs — **a configuration change, not a build** |

---

## 6 · Decisions still open

| | Decision |
|---|---|
| **1** | ~~Free tool~~ — **retired as a channel, 2026-08-24.** No second front door. The page design survives as type B content; §3.8 records why |
| **2** | **Which one or two ICPs go first.** → **Moved to [`plan.md`](plan.md) §1.** Criterion is propensity to pay; recommendation is **Investors primary, Agencies secondary** |
| **3** | ~~Search resourcing~~ — **resourced. Joy will provide what Day 1 requires (2026-08-24).** The plan's upper half — ~265/month — is live rather than aspirational |

---

## 7 · Not channels

**Not doing, deliberately:** brand awareness · category thought-leadership *(the most sloppable format in existence, and it serves none of the four goals)* · paid link-building *(penalty risk, off-brand for a defensibility company)* · conference sponsorship *(no budget)* · outbound cold email at volume *(wrong register for this buyer, and it risks the sending domain the founders' sequence depends on)*.
