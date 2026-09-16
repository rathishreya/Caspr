# GTM activation framework

*v2 — 2026-09-14 (Joy). **Supersedes v1 of the same date**, which described the always-on cadence and called it activation. The single operating document for how the GTM strategy becomes each person's work, each day.*

> ⚑ **Transcribed into the repository 2026-09-16** from the PDF Joy shared, so the portal build can cite it by section the way it cites every other spec. The Drive copy remains the source of truth; if the two ever disagree, Drive wins and this file is the stale one.

**What this owns, and what it does not.** [`launch-plan.md`](launch-plan.md) owns **the campaign** — *launch a publication, not a product*: the arc, issue formats, spread mechanics, budget and the week-4 gate. **This document owns execution:** engines, channels, the stance, the morning queue, email, people, and what a week looks like. **Where another document establishes a value, it is cited here, not restated.**

**Read by:** the portal build · the planning engine · the DM team · the core team.

---

## 0 · What was decided

### 0.1 Structure

| | Decision | Date |
|---|---|---|
| **1** | **Two top-line KPIs, co-equal: `x` and `p`** | 2026-09-11 |
| **2** | **Build every engine now. Each carries a trigger, not a date.** Not re-opened week to week | 2026-09-11 |
| **3** | **One queue, two drains** — weekly review carries the load; anything that cannot wait is approved in minutes, daily | 2026-09-11 |
| **4** | **This framework sits under `launch-plan.md`** — the campaign, then the cadence | 2026-09-14 |
| **5** | **Two narratives: The Argument and The Evidence**, paired week by week | 2026-09-14 |
| **6** | **Earned Media is a fifth portal workstream**, owned by the new hire | 2026-09-14 |
| **7** | **Interim owners:** Social runs the daily drain · SEO runs `p` reading zero | 2026-09-14 |

### 0.2 The launch

| | Decision | Date |
|---|---|---|
| **8** | **Day 1 opens the doors on renewable channels.** Non-renewable one-shots — Product Hunt, Show HN, the press release — are held for the peak | 2026-09-14 |
| **9** | **The publication is named *The Record*** | 2026-09-14 |
| **10** | **Founder X accounts are active** — the investor audience is on Finance X | 2026-09-14 |
| **11** | **Launch broad, convert narrow.** The launch reaches every professional ICP; conversion stays focused on Investors and Consultants for a readable first `x` | 2026-09-14 |
| **12** | **Meta is the recall layer, not discovery** — audiences built from Day 1 at $0, retargeting only | 2026-09-14 |

### 0.3 Voice and conversations

| | Decision | Date |
|---|---|---|
| **13** | **The stance is the website's** — a library of angles by conversation, not one line (§5) | 2026-09-14 |
| **14** | **The portal drafts; nobody writes from scratch.** People operate from emotion — drafts from approved lines are the brand-safety mechanism | 2026-09-14 |
| **15** | **Discovery is automated, not human-led.** Every morning each person receives post previews with drafted responses | 2026-09-14 |
| **16** | **~100 drafted engagements a week** across the team | 2026-09-14 |
| **17** | **A cap of ~10 approvals a day per person** | 2026-09-14 |
| **18** | **Discovery runs on DataForSEO plus free APIs**, behind one adapter, with a tripwire to Octolens (§6.2) | 2026-09-14 |
| **19** | **Every team member connects LinkedIn**, and reconnects at login when prompted | 2026-09-14 |

### 0.4 Email

| | Decision | Date |
|---|---|---|
| **20** | **Cold outreach is research-led and fully automated**, using Caspr's `fact_lookup` — **one approval from Joy on the message frames** | 2026-09-14 |
| **21** | **Replies to cold email stay human** — a reply stops the sequence and reaches Joy | 2026-09-14 |

### 0.5 Settled in the open-questions round — Joy, 2026-09-14

| | Decision |
|---|---|
| **22** | **Comments publish by one tap** — the post opens in LinkedIn with the approved comment ready — plus **a copy-text button** as a fallback |
| **23** | **The launch burst splits $1,000 search · $500 Meta retargeting — only if Meta audiences reach 1,000 by week 8.** Otherwise all $1,500 stays on search |
| **24** | **A thin Meta shell** — Instagram and Facebook auto-posting existing cutdowns only, no community management |
| **25** | **Email has no standing owner.** It runs automatically once approved; **Joy owns the exceptions.** Email is a separate portal surface, reassignable to any user |
| **26** | **Founders on X: ~3 posts a week each**, automatic after approval |
| **27** | **Core-team time rises to ~20–40 minutes a week — accepted.** The team is committed; week-1 actuals replace the estimates |
| **28** | **`p`: no AI Overview counts as a miss on that surface** · top-100 rank tracking and the Overview flag become an SEO read-out, outside `p` |
| **29** | **`p`: three samples on ChatGPT and Perplexity, a hit on two of three** |
| **30** | **`p`: "Casper" never counts** — logged as a near-miss |

---

## 1 · L0 — two KPIs

| | Measures | Gate | Defined in |
|---|---|---|---|
| **`x`** | Revenue per $1 of GTM spend, **net-new cohort** | **`x@6 > 2`** — the scale decision | [`plan.md`](plan.md) §5 · `.agents/gtm-strategy.md` §11 |
| **`p`** | Presence per ICP and per intent, across four surfaces | **None until three readings exist** | [`presence-metric.md`](presence-metric.md) |

> **Every task declares which KPI it serves. A task that serves neither is not generated.**

**Read them together** (`presence-metric.md` §5.1): `p` rising with `x` flat is a conversion problem, not a reach problem. `x` rising with `p` flat means discoverability is not earning its keep.

---

## 2 · L1 — constants, reviewed quarterly

| | | Source |
|---|---|---|
| **Positioning** | Analytical AI · *Not an assistant. An analyst.* · *Arrive certain.* · the proof line | `CLAUDE.md` |
| **Pillars** | Five, with their output shares | `.agents/brand-guidelines.md` |
| **Conversion ICPs** | **Investors and Consultants from launch** · Agencies week 6 · Strategy week 8 | `plan.md` §1 |
| **Launch audience** | **Every professional ICP.** Market research professionals are **the most engaged audience for issue 1** — which analyses their industry — **and not a conversion target** | 2026-09-14 |
| **Geography** | **United States.** Every task and event tagged from Day 1 | §4 |
| **AEO objective** | Topic queries where the sources disagree | `presence-metric.md` §3A |

**Why conversion stays narrow while the launch goes broad.** The criterion is *an approved budget plus a directly reachable decision-maker* (`plan.md` §1), and a blended first cohort would make `x@6` unreadable. **By the peak, four ICPs are open anyway.**

---

## 3 · L2 — the campaign

### 3.1 The arc — from `launch-plan.md`

| When | What | Changed here |
|---|---|---|
| **Day 1** | Cadence starts | **Doors open on renewable channels** — founder and team posts, first expert posts, an email to the warm network. **One-shots held** |
| **Weeks 1–4** | The funnel finds its level · **issue 1 lands in week 3** | — |
| **Week 4** | **The gate** — go or no-go on campaign spend | — |
| **Weeks 5–9** | Build-up — issues publish before any announcement | — |
| **Weeks 10–12** | **The peak** — §3.4 | Run-of-show added |
| **Weeks 13–26** | Sustain · **second peak around week 18–20**, where readers choose the market | — |

**Why Day 1 changed.** A silent Day 1 opens the doors with nobody told. **Splitting renewable from non-renewable keeps both requirements:** the doors open with a voice, and the peak keeps its ammunition.

### 3.2 The Argument, paired with The Evidence

**The Argument is the three movements in [`content-calendar.md`](content-calendar.md) §2. Every claim lands with its proof in the same week.**

| Weeks | The Argument | The Evidence |
|---|---|---|
| **1–4** | The question after the number | The disagreement index · sample reports on `/samples` |
| **5–8** | Where numbers come from | **355–678 named sources per report** · Sandeep on footnotes · Vivek on link integrity |
| **9–10** | What research costs | The OD-10 price comparables · Vivek's 35 people × 15 days |
| **11–12** | Back to the analyst | Damodara's verdict · *"a polished report isn't entirely a validated report"* |

**The Evidence adds no items; it is what the week's items are made from.** Testimonial items wait on the cuts, and Damodara's on the disclosure decision.

### 3.3 One issue of The Record, fanned out

**Every issue produces one atom — a single chart with its source line** (`launch-plan.md` §4A.1). Each channel gets a native version with its own job, and everything leads back to owned channels.

| | Channel | Native format | Per issue | Posted | Its job |
|---|---|---|---|---|---|
| **Owned** | The Record — site + PDF | The full analysis | 1 | **Auto** | The source everything links to |
| | Per-sector index pages | *"Here is yours"* rows | One per sector | **Auto** | Permanent and linkable · **cited by AI answers → `p`** |
| | Email to subscribers | The finding + link | 1 | **Auto** — sends once the issue is approved | The list that survives a weak `x` |
| | **"Run it on yours"** | The same question, open to any market | 1 | **Auto** | **Attention → a live analysis, no account** |
| **Rented** | LinkedIn | Joy's document post · Jayant's builder angle · 2–3 lane angles · Company Page document post · chart cards · **a LinkedIn newsletter edition** | ~7 | **Auto** | Professional reach |
| | **X** | **Data thread, one chart per post with its source** · single-chart posts · a quote-post on related news | ~5 | **Auto** | Finance and VC |
| | X → LinkedIn | The sharpest post, screenshotted | 1 | **Auto** | A one-line finding travels well as an image |
| | **YouTube** | A 5–8 min *correct the record* walkthrough · 2–3 Shorts | 3–4 | **Release** | **Searchable for years; Google's AI answers cite it → `p`** |
| | Reddit and communities | The per-sector row, where it answers a live question | 2–4 | **Manual — always** | **Cited by AI answers → `p`** |
| **Borrowed** | **An exclusive first look** | Data before publication, to one journalist or newsletter | 1 | **Manual** | Coverage, credibility, a backlink |
| | Newsletter and data-journalist pitches | *"The industry can't agree on the size of X"* | 3–5 | **Manual** | Their audience and trust |
| | Expert practitioners | Their view, **on their own accounts, in their own words** | 1–2 | **Manual — by them** | Borrowed networks inside the ICP |
| | Podcast pitch | The founder on the finding | 1 | **Manual** | Long-form trust |
| | Credit for contribution | Contributors named in the next issue | Next issue | **Manual** | They distribute it for their own reasons |
| | | | **~30–40, every three weeks** | | |

### 3.4 The peak week — run-of-show

| | |
|---|---|
| **Day 1** | Founder video **uploaded natively** to YouTube, LinkedIn and X — not links · **Product Hunt at 00:01 Pacific** · the index goes live per sector · email to all subscribers |
| **Day 2** | **Show HN, fronted by Jayant** · the press release · the exclusive publishes |
| **Days 3–5** | **Expert practitioners publish on their own accounts, one a day, staggered** · per-sector index rows go to the communities where each sector lives |
| **Throughout** | 6–8 cutdowns across the week · same-day replies to every argument · the launch search burst — **$1,000** · **Meta retargeting of peak visitors and subscribers — $500, only if audiences reach 1,000 by week 8** (§9.6) |
| **After** | Cutdowns and experts keep releasing — `launch-plan.md` §3.3 |

**Product Hunt and Show HN rules hold** (`launch-plan.md` §10): *"We are live today, here is the link"* — never *"please upvote."* Real, aged accounts leaving substantive comments beat a hundred new ones.

### 3.5 The borrowed-reach programme

**The largest single lever an unknown brand has** — borrowed channels *"shortcut the hardest part — getting noticed."*

| Source | Why it matters | What it needs |
|---|---|---|
| **10–12 expert practitioners** posting their own clips | **Ten to twelve borrowed moments inside ICP networks** — Damodara has already asked to post his | ⚠ **The release must cover self-posting plus the disclosure line** · Damodara's disclosure decision first |
| **Newsletters and data journalists** | The index is press-ready: *two credible sources 36% apart on the same market* | A target list from audience research, not guessed |
| **A co-published issue** | A named practitioner or trade body as co-author | One willing partner by the second peak |
| **Podcasts** | Founder as guest on the finding | Pulled forward to the peak |
| **Creators surfaced by the conversation engine** | Every author who replies to our comments | §6.8 — they become Earned Media's prospects |

---

## 4 · L3 — engines, all built now

| Engine | Produces | KPI | Trigger | Status |
|---|---|---|---|---|
| **Narrative** | Planned weekly items from L2 | `x` · `p` | Day 1 | **Exists** — `content-calendar.md`, `content-engine.md` |
| **Publication** | The Record and its fan-out (§3.3) | `x` · `p` | Issue 1, week 3 | **Specified** — `launch-plan.md` |
| **Index** | The disagreement index | `p` · topic | Per `index-engine.md` | **Exists** |
| **Conversation** | **The morning queue** — posts worth joining, with drafts (§6) | `p` · `x` | Day 1 | **New** |
| **Signal** | Sector events and same-day analysis | `p` | Day 1 | `content-engine.md` §2 — signals 3–4, daily |
| **Presence** | The monthly `p` reading · misses become tasks | `p` | Reading zero before Day 1 | **Specified** — `presence-metric.md` §6.3–6.12 |
| **Lifecycle email** | Behaviour-triggered emails to new sign-ups (§8.2) | `x` | Day 1 | **New** |
| **Cold outreach** | Research-led cold email (§8.4) | `x` | **After Joy's one-time approval** | **New** |
| **Re-engagement** | The sequence to existing sign-ups | `x_reengagement` — **never blended** | Week 5 | **Exists** — `reengagement-sequence.md` |
| **Meta audiences** | Retargeting audiences, accumulating (§9) | `x` | **Day 1 at $0** · spend at the peak | **New** |
| **Paid** | Targeting · formats · creative · tuning | `x` | §4.1 | **Built, dormant** |
| **Timing optimiser** | Publishing windows per surface | `p` | **8 weeks of publishing data** | **Built, dormant** |
| **Geography optimiser** | US sub-regions | `x` | `x@3` | **Built, dormant** |

### 4.1 The paid engine — four conditions, in three documents

**All four, not any:**

| | Condition | Established in |
|---|---|---|
| **1** | **Net-new activation ≥ 25%** | `.agents/gtm-strategy.md` §2 |
| **2** | **A reviewer is in the seat** | `operations-runbook.md` §2A |
| **3** | **Real testimonials published** | `operations-runbook.md` §7 |
| **4** | **`/samples` holds three real reports** | `operations-runbook.md` §7 |

### 4.2 The launch burst is not the paid engine

The launch burst (`launch-plan.md` §8) is a one-time campaign line, **governed by the week-4 gate**. The paid engine is ongoing acquisition, **governed by §4.1**.

⚠ **At the peak, condition 2 may still be unmet** — the hire lands in 8–12 weeks. **The burst runs on automatic kill rules** (`operations-runbook.md` §7), so it does not need a reviewer to be safe. The ongoing paid engine does.

---

## 5 · The stance library

**Every conversation out there is one of these shapes, and the website already has a locked answer for each. Drafts draw only from this library — and only from claims `website-copy-deck.md`'s claims register marks *may be used*.**

| When the post is about… | The angle | Lines drafts may use — verbatim | Evidence allowed |
|---|---|---|---|
| **"Research is dying" · "AI replaces analysts"** | **The identity** | *Not an assistant. An analyst.* · *Caspr does not hand you a summary and leave the judgment to you.* · **Research isn't dying — the unreconciled number is** | A Study reconciled conflicting sources in three published analyses |
| **"Can you trust AI for research?"** | **Sourcing** | *When the room asks where the number came from, the answer is already on the page.* | 355–678 named sources per analysis, human-verified · ⛔ **never *verify* or *check*** |
| **"Research is slow, stale, expensive"** | **What research costs** | *Buy the report. Commission the study. Or ask the question.* · *An off-the-shelf report answers the question its publisher chose.* | 87% of sources dated 2025–26 · **price comes last, never first** |
| **"Drowning in desk research"** | **The ICP wounds** | *Sixty per cent finding it. Forty per cent thinking about it.* · *The bottleneck was never the judgment.* · *The same conclusion. Three days late.* · *Two or three days at the start of every project. Nobody bills them.* | The persona line behind each |
| **High-stakes decisions · boards · IC** | **The promise** | *Arrive certain.* · *For decisions that can't afford to be wrong.* · *Any question your board will ask — answered, sourced, and ready before they ask it.* | — |
| **"Is client data safe in AI?"** | **Your data is your data** | *Uploaded documents never reach an external AI provider. Never trains any model.* | ISO 27001:2022 · link to `/security` |
| **"Which market number is right?"** | **The Record** | *Two credible sources, 36% apart, on the same market* · *These measure different things — and nobody says so* | Saudi valves · UK ready meals · copper mine vs refined · SaaS forward vs trailing multiples |
| **Global teams · "AI thinks in English"** | **Multilingual** | *Written in your language. Not translated into it.* | — |
| **Posts comparing AI tools** | **Category education — with care** | Only *"While the world was building generative AI, we built analytical AI"* — **no tool is ever named** | — |

**The rule from `guerrilla-evaluation.md` §4: attack the format and the economics, never the firms or their data.** We cite them — *"discrediting the source discredits the transfer."*

⛔ **Never in a draft** — from the claims register: **anything about EV charging** · **unqualified *"every claim, triangulated"*** — say *"a Study"* · **any comparison led by price** · *verify, check the working, audit it yourself.*

---

## 6 · The conversation engine — the morning queue

**Every morning, each person receives previews of posts worth joining, with drafted responses in their own lane. They approve; publishing is handled.** Joining conversations that already have an audience puts Caspr in front of the creator and the ICP already interested in the topic.

### 6.1 Discovery — DataForSEO and free APIs, behind one adapter

| Surface | Source | Quality |
|---|---|---|
| **LinkedIn** | DataForSEO — public posts Google has indexed | ⚠ **Weakest where it matters most** — indexed late and partially, no engagement counts |
| **Reddit** | DataForSEO + Reddit's API *(confirm commercial-use terms)* | Good |
| **News · blogs · newsletters** | DataForSEO — Google News | Good |
| **YouTube** | YouTube Data API — free quota | Good |
| **Hacker News** | Algolia HN API — free | Good |
| **X** | Google-indexed posts | Weak |

**One adapter, so a paid source plugs in later without a rebuild.**

⛔ **Never used for discovery:** tools that connect a team member's LinkedIn account or install a browser extension · scrapers running on anyone's login · anything that creates accounts. **The team's personal accounts are the asset** — and LinkedIn sued Proxycurl out of existence for fake-account scraping.

### 6.2 The tripwire — so a weak tool cannot pass as a weak strategy

| | |
|---|---|
| **The bar** | **At least 10 relevant LinkedIn posts a day, under 24 hours old at discovery** |
| **How it is measured** | **LinkedIn post URLs carry their own timestamp** — freshness is read from the URL, without touching LinkedIn |
| **Week 1 misses the bar** | **Octolens switches on, monthly** — $159/month on annual pricing; start monthly. 15+ platforms, no account connection, an API on every plan. **Before buying: confirm how it collects LinkedIn data, and that its API returns engagement counts** |
| **Week 1 clears the bar** | Stay on DataForSEO · revisit Octolens when the budget rises |

**Discovery quality is reported separately from the thesis**, so a failed tool reads as a failed tool.

### 6.3 Ranking and assignment

**Rank:** engagement velocity · ICP relevance · author reach · fit with a §5 angle · freshness.

**Assign:**
- **By lane** — `Caspr-dm-handover/02-linkedin-profiles/audit.md` §5. **Kartikey and Keshav never receive the category debate** — *"never anything speaking for the company"*
- **Rotated** — the same people are not on the same authors' posts every time
- **Never more than two of us on one external post** — more is brigading
- **Approvals spread across the day**, not all at 9:00

### 6.4 Drafting and the linter

**2–3 variants per card, in that person's lane and voice, each built on a specific sourced finding** — from the index, or from Caspr's `fact_lookup`. **Never the same draft for two people.**

**The linter blocks:** naming an AI tool or the category · attacking a firm or its data · *verify / check / audit* · price-led comparison · EV charging · unqualified *"every claim, triangulated"* · links · pitches · exclamation points · banned vocabulary (`content-engine.md` §4).

### 6.5 The morning queue — each card

| | |
|---|---|
| **The post** | Author · preview · reactions and comments so far · age |
| **Why this one** | The conversation shape · the ICP reading it · author reach |
| **2–3 drafts** | Lane-voiced, grounded in a finding · **one line highlighted to make it their own** |
| **Actions** | **Approve** · Edit · Skip · *Not my lane* |

**Delivered before each person's working day, in the Personal Queue.** A **midday top-up** carries posts gaining traction fast — a comment in a post's first hours is worth far more than one the next morning.

**About 8–12 cards a day. Capped at 10 approvals.**

### 6.6 Publishing

| | How it publishes |
|---|---|
| **Own posts and reposts with commentary** | **Automatic, through LinkedIn's API** — `w_member_social` |
| **Comments on other people's posts** | **One tap** *(Joy, 2026-09-14)* — opens the post in LinkedIn with the approved comment ready to paste, ~5 seconds · **plus a copy-text button**, for when the app opens without the text ready |
| **X replies** | Same as comments — **X's automation rules restrict automated replies to posts found by keyword search**, which is this pipeline |
| **Reddit** | **Manual, always** |

**Why one tap, not the API.** The API permits commenting on another member's post. **LinkedIn's 2026 enforcement targets comments *"posted to LinkedIn through a third party"*, detected by *"where the post is coming from"* — it cannot see an approval made in our portal.** The penalty is a comment pushed out of *Most relevant* and shown only to the commenter's network — **so the creator's audience, the reason we comment, never sees it.**

### 6.7 Guardrails

| | |
|---|---|
| **1** | **Drafts, never unreviewed.** A person approves every word before it publishes |
| **2** | **No two people get the same or a similar draft** |
| **3** | **At most two of us on any external post** |
| **4** | **~10 approvals a day per person** — normal behaviour for a real professional |
| **5** | **No third-party engagement tools. Ever** |
| **6** | ⛔ **No drafts for the expert practitioners.** The testimonial programme's rule: *"Never supply the words"* — a coached line from someone we recorded is an undisclosed endorsement |
| **7** | **The tripwire:** if team comments stop showing in *Most relevant*, or a person's reach collapses overnight, **engagement pauses** until reviewed |
| **8** | **Respect the anxiety.** Market research professionals are worried about their jobs — the register is *accelerator, not replacement* |

### 6.8 The creator pipeline

**Every author who replies to, or engages with, one of our comments is logged and handed to Earned Media** as a prospect for podcasts, collaborations, a co-published issue or a guest post. **The conversation engine is the top of the borrowed-reach funnel.**

---

## 7 · Amplification inside the team

### 7.1 Own beats — more voices, weeks 1–8

| Person | Lane | Was | Now |
|---|---|---|---|
| Joy | The analyst | 1 a week | **2** |
| Jayant | The builder | 1 | **2** |
| Dixit · Amit · Kartikey · Keshav | Scientist · engineer · interface · learner | 1 a fortnight | **1 a week each** |
| Naman | Comments only for eight weeks | — | — |
| **Total** | | ~4.5 | **8 — Automatic** |

⚠ **Engineering beats need real input.** The engine drafts from a two-line note each person gives weekly — what shipped, what broke. ~5 minutes each.

**Founders on X — decided (Joy, 2026-09-14):** Joy and Jayant, **~3 posts a week each**, repurposed from their beats and the week's findings. **Automatic.**

### 7.2 Concentrated engagement — not blanket

| Action | Per week | Posted | Rule |
|---|---|---|---|
| **Substantive comments on team and Company Page posts** | ~25 | Per §6.6 | **2–3 people per post, by lane, rotated** — never the same group on every post |
| **Reposts with the person's own commentary** | ~8 | **Automatic**, once approved | **24–72 hours after the original** — a second wave from a network that doesn't overlap. **Never a bare reshare** |
| **Notify employees** | ~3 | **Release** | LinkedIn's own tool, once a day, on the strongest posts |
| **Company Page reshares of team posts** | 2 | **Release** | |

**Why concentrated.** Seven separate posts on one subject split engagement across networks that overlap heavily; **seven people engaging on one post concentrate it.** And seven colleagues hitting every post within minutes is what LinkedIn's 2026 pod detection looks for.

---

## 8 · Email — four streams

| Stream | Status |
|---|---|
| **Existing sign-ups** | **Specified** — `reengagement-sequence.md`. Partner-production accounts suppressed (2026-09-14). **Domain warming first — ~3 weeks** |
| **New sign-ups** | §8.2 — behaviour-triggered |
| **The Record subscribers** | §8.3 |
| **Cold outreach** | §8.4 |

**Email has no standing owner — it runs once approved. Joy owns the exceptions** — §8.5.

### 8.1 The rules across all four

- **Four lists, never merged.** Someone who subscribed to be told about research did not ask for product email
- **Every budget figure follows `COPY-11a` / `COPY-11b`** — *"$200 a month of research"*, never a subscription price, never *"only what you run"*
- **The marketing subdomain only** for owned streams — never the transactional identity (`operations-runbook.md` §8). **Cold outreach sends from its own domain**

### 8.2 New sign-ups — triggered by what they do

**The highest-leverage email we send, because activation is the first gate to `x`.** One action per email, founder-signed. **Replaces** the calendar outline in `.agents/gtm-strategy.md` §9, which was written for the retired pricing.

| Trigger | The email | Why |
|---|---|---|
| **Signed up, no analysis after 24 hours** | One prompt matched to their ICP, ready to run | The most common leak |
| **First analysis was a $15 depth** | What the $80 depth would have found on the same question | Every answer-key pass in the evaluation was an $80 Study |
| **Credit untouched at day 30 and day 60** | A question someone like them just ran | Unused, the $100 converts nobody |
| **Trial expiring — day 83 of 90** | What they lose, plainly | Honest urgency |
| **Invited a colleague** | What the colleague can do — **their own $100 is untouched** | The collaboration loop, `channel-model.md` §3.9 |
| **Three accounts on one company domain** | A note from Joy | The Org path |
| **Paid, then quiet for 21 days** | A new issue in their sector | Retention, not upsell |

### 8.3 The Record subscribers

**A welcome** — the strongest past issue, their sector's index row, and *run it on yours* — **then the issues. The subscription is to be told, not to gain access** (`launch-plan.md` §6). **No nurture sequence pushing them to sign up. An issue's email sends automatically once the issue is approved** — the issue is already reviewed as origination, so a second release adds nothing.

### 8.4 Cold outreach — research-led, fully automated, one approval

> *"Your fund covers vertical SaaS. The two most-cited revenue multiples for the sector are 8.5× and 3.3× — one forward, one trailing, and neither source says which. Here's the reconciliation."*

| | |
|---|---|
| **What Joy approves, once** | **The message frames, rendered on ~10 real examples** — so she approves what recipients will read, not an abstract template · the personalisation rules · the send rules |
| **Then, automatically** | Named recipient from public sources → **`fact_lookup` pulls a sourced finding** about their sector or market → inserted into an approved frame → linted → sent from the cold domain, inside the cap |
| **No finding, no send** | Nothing well-sourced returned → **the recipient is skipped** |
| **Volume** | **20–40 a week** |
| **Cost** | `fact_lookup` is a lookup — **never an $80 analysis per prospect** |
| **Re-approval triggers** | A new frame · a new type of finding · a kill condition tripping. **Not individual messages** |
| **Replies** | **Stop the sequence and reach Joy's inbox.** *"Replies — never. One exchange and it breaks"* (`channel-model.md` §3.4) |
| **Kill condition** | Response below 10% over 100 messages |
| **Compliance** | CAN-SPAM — a real postal address, a working opt-out, an honest subject line · **EU and UK recipients excluded** |
| **Lists** | **Named people from public sources. No bought lists** |

**Why this is consistent with `channel-model.md` §7.** What §7 rules out is cold email *at volume* — the wrong register, and a risk to the sending domain. **Research-led, low-volume email on its own domain avoids both.**

### 8.5 Ownership — exceptions, not operation *(Joy, 2026-09-14)*

**Once approved, email needs no standing owner. It needs someone to receive the exceptions, and every exception pauses itself first.** Joy owns them. **The Email surface stays reassignable** to any user.

| Exception | What happens automatically | Reaches |
|---|---|---|
| **A reply** | The sequence stops for that person | **Joy's inbox** — the emails are founder-signed |
| **Deliverability breach** — complaints above 0.1%, a bounce spike, a blocklisting | **Sending pauses** | Joy |
| **A kill condition** — cold response under 10% over 100 | **That stream pauses** | **Joy decides** whether it resumes |
| **An approved email goes stale** — pricing or the product changes | **Change detection flags it** — email templates are registered with it (`portal-build-spec.md` §3.1) | **Joy**, to re-approve |
| **The two sending domains** | — | **A one-time technical setup**, not ongoing |

**On a normal week, nobody touches email.**

---

## 9 · Meta — the recall layer

**LinkedIn and X reach the ICP in analytical mode. Meta reaches the same person at 9pm, with more mind space. Meta is not where they discover Caspr — it is where they remember it.**

### 9.1 Why it can only be retargeting

| | 2026 reality |
|---|---|
| **Cold targeting** | **Job title, industry and company-size targeting removed in January 2026** |
| **Custom audiences** | **Need at least 1,000 people** before Meta serves ads |
| **Uploaded lists** | **B2B lists match only 20–40%** — work emails are rarely a Facebook login |
| **Automated targeting** | Wants ~50 conversions a week to learn |

### 9.2 Audiences — accumulating from Day 1, at $0

| Audience | How it builds |
|---|---|
| **Visitors to the marketing site** | Meta's tag, from Day 1 |
| **The Record's subscribers** | The list, uploaded — **likely a better match than sign-ups**, since newsletters are often subscribed with a personal email *(plausible; the match rate will tell)* |
| **People who watched our clips on Meta** | Anyone who watches half |
| **Lookalikes of subscribers** | Once 1,000 exist |

⛔ **Never:** interest or job-title targeting.

### 9.3 What they see — and the ask

| Format | Source |
|---|---|
| **The finding in 10 seconds** — one number, source line on screen, captions | Each issue's atom |
| **Expert micro-cuts, 6–15s vertical** | Already specified in the testimonial brief §9.2 — *"for paid ads and stories"* |
| **The founder, as a person** | Founder content |
| **Run it on yours, in 15 seconds** | The Theater |

**The ask matches the mood: subscribe to The Record.** Running an analysis is the second ask; signing up is never the first. **The register is warmer, still calm — no hype, never "an AI tool."**

### 9.4 A thin, automatic shell

**Instagram and Facebook pages that auto-post the cutdowns already being made. No community management.** When someone taps the name on an ad, they land somewhere credible. **Decided (Joy, 2026-09-14).** ⚠ **API access to confirm** — if Meta refuses it, the cutdowns are posted by hand once a week.

### 9.5 Three guardrails

| | |
|---|---|
| **1** | ⛔ **Meta's tag runs on the marketing site only — never in the app, the open run, or any page where a prompt is typed.** A tag that could pass a prompt, an analysis title or Data Room content would contradict Pillar 5 and `gtm-api-contract.md` §4.2. **Enforced in the build** |
| **2** | **Consent first** — the tag respects the cookie decision; **subscriber lists are uploaded only if the privacy notice covers ad matching** |
| **3** | **Measured as an assist** — **~20% of each audience is held back**, and return visits, branded search and subscriber-to-sign-up rates are compared. On last-click, Meta always looks weak |

### 9.6 Money

| When | Spend |
|---|---|
| **Day 1 → peak** | **$0** — audiences accumulate |
| **Peak** | **$500 of the $1,500 launch burst — only if audiences reach 1,000 by week 8.** Otherwise all $1,500 stays on search *(Joy, 2026-09-14)* |
| **After** | Inside the paid engine, on §4.1 |

---

## 10 · L4 — one queue, two drains

| | Weekly drain | Daily drain |
|---|---|---|
| **What** | Everything with **72 hours or more** of shelf life | **Under 72 hours** — the morning queue, reactive items |
| **When** | Thursday generation → review to Monday 18:00 → publish Tuesday–Sunday | **Every morning, plus a midday top-up** |
| **Who** | The DM team | **Each person approves their own queue.** The DM team approves reactive brand items |
| **Time** | ~100–140 min a week across the DM team | **A few minutes a day each** |

- **Nothing publishes unreviewed**
- **One daily digest, only on days with something in it** — *"a queue that nags gets muted"*
- **Ranking weights are configuration, not code.** The engine demotes items rather than overload anyone

---

## 11 · L5 — the task

**If any field cannot be filled, the engine has not finished thinking.**

| Field | Values |
|---|---|
| `engine` | narrative · publication · index · conversation · signal · presence · lifecycle · cold · reengagement · meta · paid |
| `owner` · `workstream` | A named person · content_social · seo · performance · email · earned_media |
| `surface` | site · linkedin_company · linkedin_personal · linkedin_newsletter · x · youtube · meta · email · reddit · wso · preplounge · mrx · esomar · cos_community · ami · hacker_news · product_hunt · trade_press · podcast · roundup · directory · backlink |
| `artefact` | search_answer · analysis · issue · index_row · post · repost · comment · reply · thread_reply · data_thread · video · short · newsletter_edition · email · cold_email · outreach_message · guest_post · podcast_booking · listing · backlink_conversation · seo_task |
| `publish_mode` | **auto · release · one_tap · manual** |
| `drain` · `shelf_life_hours` · `deadline` | Derived from shelf life |
| `pillar` · `icp` · `narrative` · `stance_angle` | 1–5 · the ICP · argument, evidence or reactive · a §5 row |
| `intent` · `geo` · `kpi` | tool · job · topic · permission · **US** until the geography optimiser triggers · `x`, `p` or both |

**Constraints the schema enforces:**

- **Community surfaces are always `manual`**
- **A `comment` or `reply` is never `auto`** — always `one_tap` *(decided 2026-09-14)*
- **Cold email cannot send without a `fact_lookup` finding attached**

---

## 12 · Workstreams and owners

| Workstream | Tabs | Owner | Until the hire lands |
|---|---|---|---|
| **Content & Social** | Dashboard · Tasks · Library | Social | **Also the daily drain and the conversation engine's health** |
| **SEO** | Dashboard · Tasks · Backlog | SEO | **Also `p` reading zero** |
| **Performance** | Dashboard · Tasks · Paid | New hire | Dormant · **the launch burst runs on automatic kill rules** |
| **Email** | Dashboard · Tasks · Sequences — **a separate surface, reassignable to any user** | **No standing owner** — runs once approved | **Exceptions route to Joy** — §8.5 |
| **Earned Media** | Dashboard · Tasks · Pipeline | **New hire** | **Editorial pitching lapses.** The creator pipeline accumulates for them |

**Weekly time per person** is in §13.4. **The split between SEO and Earned Media:** a directory submission is a form; converting an editor is a relationship (`operations-runbook.md` §2A).

---

## 13 · A week

**Three kinds of week.** §13.1–13.5 describe **a standard week**. §13.6 adds **an issue week** — every third week, from issue 1 in week 3. §13.7 adds **the peak**.

**Key: Auto** — publishes once approved · **One tap** — approved, then posted natively · **Release** — a person releases, the system sends · **Manual** — a person does it.

### 13.1 The standard week, day by day

| | The system | Goes out automatically | People |
|---|---|---|---|
| **Every weekday** | **Morning queue before each working day** · midday top-up · lifecycle emails on their triggers · cold email sends · reposts released on their 24–72h stagger | X posts · reactive items | **Everyone clears their morning queue — ~5 min** · Social clears the brand daily drain |
| **Monday** | Review reminder 09:00 · **review deadline 18:00** · approved week scheduled 20:00 | **Jayant's second beat** · one engineer beat · Company Page post | Final weekly reviews |
| **Tuesday** | — | **Search answer #1** · **Joy's first beat** · founder X posts | **2–3 rotated colleagues comment in Joy's first hour** |
| **Wednesday** | Metric snapshot 09:00 | Jayant's first beat · Company Page document post | **Community threads — Social, by hand** · **Wednesday review 15:00 — Joy + new hire, 30 min** |
| **Thursday** | **Generation 06:00** · queue-open notice 07:00 | One engineer beat · founder X posts | Weekly review opens |
| **Friday** | — | **Search answer #2** · **Joy's second beat** · one engineer beat | 2–3 rotated colleagues on Joy's post |
| **Saturday · Sunday** | Scheduled X only | X posts | **No personal LinkedIn posts** — a B2B audience is not reading |

**One founder post a day, plus at most one engineer beat.** Two team posts a day keeps engagement concentrated rather than split — and never two people on the same subject in the same week.

### 13.2 What goes out — by channel

| Channel | Per week | Posted | Who |
|---|---|---|---|
| **Search answers** | 2 | **Auto** | SEO + origination review |
| **LinkedIn — own beats** | **8** | **Auto** | Joy 2 · Jayant 2 · Dixit, Amit, Kartikey, Keshav 1 each |
| **LinkedIn — Company Page** | 3 | **Release until LinkedIn approves the API, then Auto** | Social |
| **LinkedIn — reposts with commentary** | ~8 | **Auto**, staggered | Rotated |
| **LinkedIn — Notify employees · Page reshares** | ~3 · 2 | **Release** | Social |
| **X — company** | 5 | **Auto** | Social |
| **X — founders** | ~6 | **Auto** | Joy ~3 · Jayant ~3 |
| **Reactive reshares** | ~3 | **Auto** | Daily drain |
| **Meta shell** | ~2 cutdowns, once cuts exist | **Auto** | — |
| **Conversation engagements — external** | **~95** | **One tap** · copy-text fallback | Everyone, by lane |
| **Comments on team posts** | ~25 | **One tap** | Rotated, 2–3 per post |
| **Community threads** | ~5 | **Manual — always** | Social |
| **Founder outreach — LinkedIn messages** | 4 | **Manual** — Joy taps send | Engine drafts |
| **Cold email** | **20–40** | **Auto**, after Joy's one-time approval | — |
| **Lifecycle email** | On triggers | **Auto** | — |
| **Directories · backlink conversations** | ~2.5 · ~3.5 | **Manual** | SEO |
| **Guest posts · podcasts** | ~0.5 · ~0.25 | **Manual** | New hire — **lapses until they arrive** |

### 13.3 The split

| | Per week |
|---|---|
| **Auto posts** | **~37** — search 2 · LinkedIn beats 8 · reposts 8 · X 11 · reactive 3 · Company Page 3 · Meta 2 |
| **Auto emails** | **20–40 cold** + lifecycle on triggers |
| **One-tap engagements** | **~120** — ~95 external · ~25 on team posts |
| **Manual actions** | **~16** — communities 5 · outreach 4 · directories and backlinks 6 · earned media ~0.75 |
| **Weekly DM review** | **~100–140 min** — against a ~450-minute budget |

> **The system publishes the output. People spend a few minutes a day approving — and every action they take is in a conversation where the ICP already is.**

### 13.4 Each person's week

| Person | Morning queue | Own beats and posts | Everything else | Total |
|---|---|---|---|---|
| **Joy** | ~15 external + ~4 team · ~30 min | 2 beats · ~3 X · ~10 min | Wednesday review 30 · origination review 30–45 · 4 outreach sends · response post fortnightly · email releases | **~2–2.5 hrs** — origination moves to the hire |
| **Jayant** | ~15 + ~4 · ~30 min | 2 beats · ~3 X · ~10 min | **Show HN at the peak** | **~40 min** |
| **Dixit · Amit** | ~10 + ~4 · ~20 min | 1 beat + input · ~7 min | — | **~30 min each** |
| **Kartikey · Keshav** | ~5 + ~3, **technical posts only** · ~12 min | 1 beat + input · ~7 min | — | **~20 min each** |
| **Naman** | ~10 + ~4 · ~20 min | — | — | **~20 min** |
| **Social** | ~25 external | — | Daily brand drain · derivative review · 5 community threads · Meta shell · conversation-engine health | **~3 hrs** |
| **SEO** | — | — | SEO review · tasks · directories · backlinks · **interim reading zero** | **~2.5 hrs** |
| **New hire** — once in | — | — | Origination and outreach review · earned media · creator pipeline · `p` · challenging the plan | **~3 hrs** |

**Core-team time rises from 10–20 to ~20–40 minutes a week — accepted (Joy, 2026-09-14);** the team is committed. **Week-1 actuals replace these estimates.**

### 13.5 Scaling

**Hold this volume for four weeks, then scale derivatives by 25% if reject rates sit under 10%** (`operations-runbook.md` §4). **Origination scales only when a reviewer's minutes exist.** The engagement cap stays at ~10 a day per person regardless.

### 13.6 An issue week — every third week

**On top of the standard week** — the §3.3 fan-out:

| | Extra |
|---|---|
| **Owned** | The issue · per-sector index rows · subscriber email · *run it on yours* |
| **Rented** | ~7 LinkedIn items, including a newsletter edition · an X data thread + ~4 posts · an X screenshot to LinkedIn · a YouTube walkthrough + 2–3 Shorts · 2–4 community contributions |
| **Borrowed** | 1 exclusive · 3–5 pitches · 1–2 expert views, theirs · 1 podcast pitch |
| **Total** | **~30–40 more**, spread across that week and the next |
| **Extra time** | **Joy ~1 hr** for the walkthrough recording · the morning queue shifts toward the issue's conversation |

### 13.7 The peak — weeks 10–12

**On top of an issue week** — the §3.4 run-of-show: founder video native on three platforms · Product Hunt · Show HN · press release · the exclusive · experts one a day · the index launched per sector · 6–8 cutdowns · the launch search burst · Meta retargeting · email to all subscribers.

**Extra time:** Joy and Jayant, **most of Product Hunt day and Show HN day**, answering every comment in real time · the team's aged Product Hunt accounts, briefed a week before.

---

## 14 · External dependencies — what makes "automatic" true

| | Dependency | Why it matters | Action |
|---|---|---|---|
| **1** | **LinkedIn personal tokens expire every 60 days, no refresh** | Auto-posting stops silently at day 60 | **Reconnect prompt at portal login from day 53** · an expired token moves posts to the queue, never drops them |
| **2** | **Company Page posting needs LinkedIn's Community Management API approval** — two-tier vetting; a rejection means a new app | The Company Page is **Release** until approved | **Apply now** · the approving member needs a Page admin role |
| **3** | **DataForSEO credential** | Discovery and `p` both depend on it | **Rotate it and move it into AWS Secrets Manager** before anything is built |
| **4** | **X API tier** | Scheduled posting at this volume | Confirm |
| **5** | **Two warmed sending domains** — marketing, and cold | ~3 weeks' lead each · **the longest lead time in the project** | **Start now** |
| **6** | **Meta** — business account, the tag, API access for the shell | Audiences must accumulate from Day 1 | Set up before Day 1 |
| **7** | **Reddit's API terms** | Commercial use of discovery | Confirm |
| **8** | **Legal** — privacy notice covering ad matching · CAN-SPAM for cold email | Blocks list uploads and cold sends | Counsel |
| **9** | **Testimonial releases** covering self-posting and disclosure | Blocks the borrowed-reach programme | Before any expert posts |
| **10** | **Founders' X accounts** — both exist and are ready to activate | Founder X posting from Day 1 | Joy · Jayant |

---

## 15 · What the portal must build

| | Component | New |
|---|---|---|
| **1** | **The morning queue** — cards with post previews, drafts, approve / edit / skip | **Yes** |
| **2** | **The discovery adapter** — DataForSEO, Reddit, YouTube, Hacker News; **Octolens pluggable** | **Yes** |
| **3** | **Ranking, lane assignment, rotation, the two-per-post cap, the daily cap** | **Yes** |
| **4** | **Grounded drafting** — stance library + claims register + `fact_lookup` + the linter | **Yes** |
| **5** | **Publishing** — own posts through the API · **one-tap native** for comments and replies · **a copy-text button** | **Yes** |
| **6** | **LinkedIn token tracking** and the login reconnect prompt | **Yes** |
| **7** | **The creator pipeline** into Earned Media | **Yes** |
| **8** | **Cold outreach** — frame approval on rendered examples, `fact_lookup` personalisation, the cold domain, caps, reply-stops, re-approval triggers | **Yes** |
| **9** | **Lifecycle email triggers** | **Yes** |
| **10** | **Meta tag on the marketing site only**, with audience accumulation | **Yes** |
| **11** | **Tripwires** — discovery quality (§6.2) · engagement penalty (§6.7) | **Yes** |
| **12** | **The Earned Media workstream** and the **Presence band** | Specified 2026-09-14 |
| **13** | **The Email surface** — reassignable · **exceptions auto-pause and route to Joy** · templates registered with change detection (`portal-build-spec.md` §3.1) | **Yes** |
| **14** | **The SEO rank read-out** — top-100 positions per question, who ranks above, the Overview flag, and the play it implies (`presence-metric.md` §6.12) | **Yes** |

---

## 16 · What this changed elsewhere

| Document | Change |
|---|---|
| [`launch-plan.md`](launch-plan.md) | §9 Day 1 opens on renewable channels · pointer to §3.3–3.5 here for channel execution |
| [`content-calendar.md`](content-calendar.md) | §1 points to §13 for the full week |
| [`operations-runbook.md`](operations-runbook.md) | §4 and §5 point to §6, §7 and §13 |
| `Caspr-dm-handover/02-linkedin-profiles/audit.md` | §5 cadence for weeks 1–8 · the morning queue |
| [`content-engine.md`](content-engine.md) | §5.3 — the one-subject rule governs posts, not amplification |
| [`channel-model.md`](channel-model.md) | §7 research-led cold email · the added channels |
| [`reengagement-sequence.md`](reengagement-sequence.md) | §3 partner-production accounts suppressed |
| `.agents/gtm-strategy.md` | §9 new-signup sequence superseded by §8.2 |
| `website-copy-deck.md` | The Engine fold's retired *Weigh* and *two proprietary systems* corrected |

*v1's propagation (2026-09-14) — the runbook's daily drain, the portal's Earned Media workstream and Presence band, the content calendar's Evidence pairing, the daily signals, the LinkedIn dependencies, the superseded baseline instruction — stands.*

---

## 17 · Open

*Eight questions settled on 2026-09-14 — §0.5.*

| | | Owner |
|---|---|---|
| **1** | **The earned-media hire** — 8 to 12 weeks. Until then editorial pitching lapses and the creator pipeline accumulates | Joy |
| **2** | **Basket completion and freeze** — the critical path to reading zero | Claude → Joy signs off |
| **3** | **The DataForSEO credential** — rotated and in AWS Secrets Manager before discovery or `p` can run | Joy |
| **4** | **The Community Management API application** — outcome and timing | Apply now |
| **5** | **Two sending domains warmed** — ~3 weeks' lead each | Start now |
| **6** | **Meta API access for the shell** · founders' X accounts ready | Confirm |
| **7** | **Estimates to replace with week-1 actuals** — reactive volume, daily minutes, draft-edit rates, core-team time | Social |
