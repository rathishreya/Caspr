# Caspr GTM Strategy — Final

*Last updated: 2026-05-13*
*Supersedes: gtm-strategy.md (2026-05-09)*
*Reads alongside: icp-personas.md · icp-copy.md · academic-programme.md · website-architecture.md · email-sequences.md · security-posture.md · product-sprint-gtm-alignment.md · product-marketing-context.md*

---

## 1. Situation

**What exists:**
- 1,500+ signups. ~2 paid users. <0.1% conversion.
- No activation email sequence. No onboarding flow.
- No ICP-specific landing pages. No paid acquisition active.
- Joy's LinkedIn: 22k connections, posting once every 2–3 months.
- $1,000/month marketing budget.
- Senior market research professionals willing to give written and video testimonials — not yet collected.
- Joy's own account: 60+ reports across due diligence, M&A, market research, competitive analysis, business proposals, government/policy — live evidence of "Caspr means Business."
- One primary research firm using Caspr for client deliverables — the strongest proof point available.

**Current product state:**
The live product runs on the Research Budget model (Brief $15 / Study $80 / Intelligence $300 / Professional / Business / Enterprise). The previous token-based model (Free / Plus $50 / Pro $200) has been retired. Several UX friction points prevent activation: the file upload modal blocks first-message, chat is disabled after report generation, the Insights nav leads to a 404. These are being addressed in Sprint 1.

**The diagnosis — restated 2026-08-20 (Joy).**

The 1,500 signups and the <0.1% conversion are **evidence about a retired pitch, not about Caspr.** Those users arrived through positioning that no longer exists (*"AI for Market Research"*), pricing that has been retired (Free / Plus $50 / Pro $200), website messaging that contradicted the product, and targeting that was never ICP-specific. A conversion rate measured on a cohort acquired that way describes **the acquisition, not the product.**

**Reading it as a product or activation failure was the error.** The likelier explanation is that the wrong people signed up, with the wrong expectation of what they were signing up for.

**So the strategy is forward-looking.** The objective is a net-new funnel run correctly for the first time: the right message, in front of the right ICP, arriving with an accurate understanding of the value, and carried the whole way from awareness to paid. That is knowable, repeatable and **scalable**. Whatever the existing 1,600 yields is **a bonus, not the plan.**

**Two consequences.**

- **The ≥25% activation gate applies to net-new signups.** Measured on a mis-acquired cohort it was never going to mean anything. The old cohort's rate, once measured, is a floor and a diagnostic — not a target.
- **This is now a hypothesis, not a finding.** Dropping the old number as evidence means operating on judgement until the new cohort produces data. Instrumenting net-new from day one ([`tracking-spec.md`](../docs/gtm/tracking-spec.md)) is what tells us whether the reframe was right, and how fast.

**The one diagnostic use of the old cohort that survives:** which ICPs the old pitch actually attracted, and from where. Not a benchmark — a read on who self-selects toward this category. It falls out of the segmentation pull for free.

---

## 2. Strategic Principles

Five rules. These override tactics when they conflict.

**1. Nothing activates until the website and the app are live (Joy, 2026-08-20).**
No campaign, no sequence, no paid, no content push — for net-new or existing users — until the rebuilt website and the rebuilt app are both in place. Driving anyone into the old surfaces spends the one thing that cannot be re-spent: a first impression. **Waiting two weeks costs nothing when what follows is materially better.**

Then: **acquire the right ICP, and measure activation on them.** The old formulation was *"activation before acquisition"* — which assumed the acquired cohort was the right one. It was not. Activation measured on people who arrived through the wrong pitch only ever told us about the pitch.

**2. Time and quality lead. Cost follows.**
Cost is a must-have, not a differentiator. The primary hook for every ICP is time saved and quality of output. Cost appears as a proof point — specific and stark — not as the headline. Exception: ad creative where price contrast stops the scroll.

**3. Caspr is the hero. Joy is the credibility signal.**
Joy's McKinsey → EZ → Caspr story is a background proof point. It appears on the About page, in PR, and as one sentence in conversion sequences where the credibility objection must be answered. It never leads content.

**4. The identity leads. Speed supports it.**
The primary message is the stack in `docs/site-truth.md` §1.0 — *Not an assistant. An analyst.* / *Arrive certain.* / *Every source, credible. Every claim, triangulated. Every report, defensible.* The 2-minute interaction model remains true and remains useful: it answers *"how much work is this?"* on the how-it-works fold, in onboarding, and in the Day 0 activation email. It is no longer the headline. **Superseded 2026-08-20** — speed and length are commoditising, and a position built on them erodes with every model release.

**5. Show the output.**
The most persuasive asset Caspr has is an actual Caspr report. Use them on every channel. Redact client data where needed. The output is the argument.

---

## 3. Revenue Model

### Research Budget model (current — live)

| Milestone | Budget | Typical monthly charge (active user) |
|---|---|---|
| Professional | $200/month | $120–200 (depends on report volume) |
| Business | $600/month | $400–600 |
| Enterprise | $1,800/month | $1,200–1,800 (team-pooled) |

**Revenue is earned on analyses run, not budgets authorised.** A Professional user who runs no analyses pays $14/month (platform fee only). A Professional user running 2 Studies and 1 Brief pays ~$189. The GTM must drive report generation, not just signups or plan activations.

**$25k MRR under Research Budget model:** ~167 active paying users at an average charge of $150/month.

| ICP segment | Target users | Avg monthly charge | MRR contribution |
|---|---|---|---|
| Consulting Associates/EMs | 45–55 | $185 | $8,300–$10,200 |
| Strategy Professionals | 25–35 | $480 | $12,000–$16,800 |
| Investors (PE/VC/HF) | 20–30 | $520 | $10,400–$15,600 |
| Agency Strategists | 20–30 | $480 | $9,600–$14,400 |
| Startup Founders | 15–25 | $130 | $1,950–$3,250 |
| Market Research Professionals | 9–35 | $250 | $2,250–$8,750 |
| Category Managers | 10–15 | $160 | $1,600–$2,400 |
| Graduate Students † | 8–40 transactions | $75 avg/transaction | $600–$4,000 total † |
| Re-engaged (existing 1,500) | 45–90 | $150 | $6,750–$13,500 |

† Graduate Students are per-analysis buyers at Academic pricing — not MRR contributors. Figures represent total transaction revenue, not recurring revenue. The commercial case is post-graduation LTV: former students convert to Professional ($200/month) or Business ($600/month) on joining a consulting or strategy role. See `academic-programme.md`.

**Conservative 90-day MRR projection:** $38k–$128k across all subscription ICPs + $600–$4k in student transaction revenue
**Key insight:** ICP 2 (Strategy) and ICP 3 (Investors) represent ~55% of MRR despite being lower-volume segments. Acquisition spend should weight toward these ICPs even if ICP 1 (Consulting) drives more signup volume. ICP 6 (Market Research) arrives warm — desk research is their job — and converts at higher-than-average rates once the credibility signal is established.

---

## 4. ICP Priority

Eight ICPs in priority order. Full personas, channel specifics, and lead volume estimates: see `icp-personas.md`. Primary messages and copy variants: see `icp-copy.md`. Academic programme details: see `academic-programme.md`.

| Priority | ICP | Buy motion | Primary plan | Avg MRR/user | Phase 1 focus |
|---|---|---|---|---|---|
| 1 | Consulting Associates / EMs | DtBP → Enterprise expansion | Professional → Business | $185 | Joy network + LinkedIn content |
| 2 | Strategy Professionals (VP Strategy, CoS) | DtBP | Business | $480 | LinkedIn content + CoS communities |
| 3 | Investors (PE / VC / HF Analysts) | DtBP → firm-wide | Business (Intelligence-heavy) | $520 | LinkedIn + Finance Twitter |
| 4 | Agency Strategists (boutique/mid agencies) | DtBP | Business | $480 | LinkedIn + AMI community + trade press |
| 5 | Startup Founders (pre-seed to Series A) | Pure DtBP | Professional (project-based) | $130 | LinkedIn + Twitter + Product Hunt (Phase 3) |
| 6 | Market Research Professionals (boutique/mid agencies) | DtBP → firm-level B2B | Professional → Business | $250 | LinkedIn #mrx + ESOMAR community |
| 7 | Category/Commercial Managers | DtBP (procurement risk at large retailers) | Professional | $160 | LinkedIn only (Phase 1 test); scale in Phase 2 |
| 8 | Graduate Students (MBA/MSc — consulting track) | DtBP — per-analysis, no subscription | Academic tier (top-up) | $8–40/transaction | Reddit r/MBA + consulting club partnerships |

**DtBP defined:** The individual professional is the economic buyer. Corporate card or personal card, expenses it, no procurement. Sales cycle: minutes. All ICPs except ICP 8 (students) are DtBP at this stage — Caspr has no sales team, no enterprise MSA, and is fully self-serve.

**ICP 6 note (Market Research):** Desk research is literally their job. Caspr removes the pre-fieldwork context layer they currently do manually on every engagement — unbillable overhead at boutique agencies. They arrive pre-qualified. The credibility objection is sharper here (client-facing output standards); address it with the research firm testimonial before other proof points.

**ICP 8 note (Students):** Low direct revenue. High strategic LTV. A student who uses Caspr at LBS becomes an Associate at McKinsey 12 months later — at which point they know the product, trust it, and expense it. Do not treat students as a subscription ICP; treat them as a pipeline investment. Full mechanics: see `academic-programme.md`.

**B2B expansion path:** When 3+ users at the same firm have active accounts, Joy reaches out directly. For ICPs 1–3, this is the natural Enterprise conversion path. The signal to act: three or more caspr.ai email registrations from the same company domain.

---

## 4A. Caspr Academic Programme — GTM Summary

The Academic programme runs in parallel to the core GTM. It has its own pricing model, its own channels, and its own success metrics. This section is the GTM summary. Full mechanics, copy, and phase plans: see `academic-programme.md`.

### What the programme offers

| | |
|---|---|
| Brief price | $8 (vs. $15 standard) |
| Study price | $40 (vs. $80 standard) |
| Free trial | $150 gifted (vs. $100 standard) |
| Billing model | Top-up only — no subscription, no platform fee |
| Club account | Self-serve pooled budget for student clubs — minimum 20 members, $100/month pool |

Students are never asked to set a monthly Research Budget. Any friction that suggests a subscription is required will kill conversion to zero.

### The viral mechanic: Research Dollars

Students earn non-cash Research Dollars through four fully automated events: referral signups ($15), referral activations ($10), onboarding completion ($5), and Share Card engagement ($10 when 10 unique devices click a tracked analysis card). The club activation bonus ($20 to club pool when 20 members activate) incentivises club presidents to drive club-wide adoption. No manual review required for any earn event.

The Share Card progress counter ("6 of 10 clicks received — share with more classmates") is visible in real time and turns every student into an active distributor into the consulting club channels where the next cohort lives.

### The commercial case

Direct student revenue: $50–120 over a 2-year programme. Irrelevant.

Post-graduation conversion: a student who used Caspr at LBS or Wharton joins McKinsey, BCG, or a strategy team. They know the product. They expense it. They convert to Professional ($200/month) or Business ($600/month) — a 10–30× return on the student transaction cost, with zero further acquisition spend. The graduation conversion email (sent automatically on .edu email bounce or profile update) includes a $100 promotional credit to reduce first-month friction.

### Phase 1 GTM actions (Academic)

| Action | Owner | Sprint |
|---|---|---|
| Launch `caspr.ai/academic` landing page | Marketing | Sprint 1 |
| Add Academic section to pricing page | Marketing | Sprint 1 |
| Seed r/MBA + r/consulting with authentic case competition content | Joy | Sprint 1 |
| Direct outreach to club presidents at LBS, Booth, Kellogg | Joy | Sprint 1 |
| PrepLounge: contribute "how I researched this sector in 15 minutes" resource | Joy | Sprint 2 |

### Phase 2 GTM actions (Academic)

| Action | Owner | Sprint |
|---|---|---|
| Expand club partnerships to 8–12 target schools | Joy | Sprint 2–3 |
| Management Consulted featured listing in consulting prep tools | Joy | Sprint 2 |
| Wall Street Oasis engagement in research and case prep forums | Joy | Sprint 2 |
| Collect 3–5 student testimonials (competition wins, dissertation outcomes) | Joy | Sprint 2 |
| Build graduation conversion email sequence (automated trigger) | Marketing | Sprint 3 |

---

## 5. Phase 1 — Fix and Prove (Sprints 0–1, Weeks 1–3)

**Goal:** Non-broken product. Website Phase 1 live. First testimonials. LinkedIn presence established. Re-engagement emails live.

### Website Foundation (prerequisite — before email sequences launch)

Every email in both sequences (re-engagement and new signup activation) links to caspr.ai. Sending 1,500 re-engagement emails to the current site — which carries the wrong positioning headline ("AI for Market Research"), prohibited copy ("Large Analysis Model"), and old token pricing — would undermine the entire campaign. The website must be rebuilt before the email sequences launch.

**Phase 1 website pages (8 pages, target 2 weeks to build):** Homepage · /pricing · /enterprise · /for/consulting · /for/strategy · /for/investors · /privacy · /terms. These are the minimum required before email sequences go live.

Full site architecture, SEO intent, conversion structure, and build phases: see `website-architecture.md`.

Stack: **Next.js → GitHub → AWS Amplify.** Mobile-first. Designed in Figma.

### Sprint 0 (Days 1–2): Brand Sync

Copy changes only. No engineering required beyond config. Ships in hours.

What changes: chat greeting → "Hi, I'm Caspr. Tell me what you need to know — I'll have a boardroom-ready analysis ready in minutes." Architecture card → "Analytical AI." Quick-start tags fixed and expanded (Business Case · Due Diligence · Market Research · Investment Thesis · Competitive Landscape · RFP). In-product copy updated throughout to "Caspr means Business" scope.

**GTM actions that start immediately at Sprint 0:**
- Joy contacts all testimonial candidates. Written testimonials first, video to follow.
- Joy runs 3 demonstration analyses (market research Study, business case Study, due diligence Study) for use as both marketing samples and Sprint 1 sample reports.
- LinkedIn content plan drafted: 12 posts for the first 4 weeks.
- First LinkedIn post published.
- Community mapping: identify the right consulting, strategy, and investor communities before engaging.

### Sprint 1 (Weeks 1–3): Activation Foundation

Fixes every friction point blocking the first complete analysis. After Sprint 1, the product is ready for the re-engagement campaign.

Critical fixes: Insights nav removed (currently 404). Updates tab replaced with useful content. File upload modal: Confirm enabled by default, close button prominent, copy clarified ("Add reference files — optional"). Post-report engagement re-enabled: "Run a follow-up analysis" and "Start a related analysis" replace the disabled chat. PPTX surfaced earlier. Token count translated to reports remaining ("≈ N reports remaining"). Home screen gains a direct prompt input. Three sample reports appear on first login with SAMPLE badge.

**Dependency:** Joy must complete the 3 demonstration analyses during Sprint 0 before the sample reports can go live.

**GTM actions that start at Sprint 1 completion:**
- Re-engagement email sequence launches to all 1,500 signups (full brief in Section 8).
- New signup activation sequence goes live (Day 0 / Day 3 / Day 7 / Day 14 / Day 30).
- LinkedIn at 3 posts/week cadence.
- First testimonials published on LinkedIn and submitted to the design team for homepage.
- Activation rate measurement begins. Baseline established within 2 weeks of email launch.

**Gate before Phase 2:** Activation rate (signup → first analysis) ≥ 25%. Do not proceed to paid acquisition below this threshold.

---

## 6. Phase 2 — Build the Machine (Sprints 2–3, Weeks 4–10)

**Goal:** Research Budget model live. ICP landing pages. Paid acquisition begins. Business tier marketed in full.

### Sprint 2 (Weeks 4–7): Pricing Model Migration

The token model is replaced by the Research Budget model. Brief / Study / Intelligence tiering introduced. This is the largest engineering sprint and unlocks the full commercial story.

What ships: new wallet UI (Research Budget, Analysis Balance, progress bar, human-readable history). Free trial displayed as $100 gifted balance with expiry countdown. Stage Gate 1 (pre-analysis cost modal: "This Study will use $80 from your Analysis Balance. Balance after: $[X]. Start Analysis."). Analysis depth selection (Brief / Study / Intelligence) introduced post-prompt, pre-layout. Professional / Business / Enterprise plan cards replace Free / Plus / Pro. Low balance warning with specific dollar guidance.

**Critical note on Business plan card:** PPTX, Word, Infographic, and multi-language output must be marked "coming in Sprint 3" on the Business card — not presented as live features. A user who upgrades and finds these locked has grounds for a billing dispute.

**User migration:** Explicit deliverable. Existing token-model users must receive a clear communication before go-live explaining the transition — token-to-budget conversion rate or clean-cutover credit. This is a trust moment, not a product footnote.

**GTM actions at Sprint 2:**
- Pricing page launches with Research Budget model, clear use-case pricing (Brief $15 / Study $80 / Intelligence $300 / à la carte $399).
- ICP-specific landing pages launch — one per priority ICP (ICPs 1–4 in Phase 2, ICPs 5–6 deferred to Phase 3).
- LinkedIn paid ads begin: $500/month. Retargeting first (website visitors + email list upload). Cold ICP targeting added when retargeting conversion rate is confirmed.
- À la carte Intelligence ($399) marketed directly to investors and C-suite: a single high-stakes analysis, no subscription required.
- Community engagement begins: consulting forums, strategy communities, Chief of Staff networks. Provide value before mentioning Caspr.
- Upgrade email sequence: re-engage activated free trial users who haven't converted.

**LinkedIn ad targeting by ICP:**

| ICP | Job titles | Industry filter | Budget |
|---|---|---|---|
| Consulting | Associate Consultant, Engagement Manager, Senior Consultant | Management Consulting | $100 |
| Strategy | VP Strategy, Chief of Staff, Strategy Director, Head of Corporate Strategy | All industries, 100–5,000 employees | $120 |
| Investors | Investment Analyst, PE Analyst, VC Associate, Fund Associate | Financial Services | $100 |
| Agencies | Head of Strategy, Senior Strategist, Strategy Director | Marketing & Advertising | $80 |
| Market Research | Research Manager, Senior Research Executive, Research Director, Insights Manager | Market Research, Research Services | $0 (organic only Phase 2; paid Phase 3 if #mrx community converts) |
| Retargeting | All | All | $100 |

LinkedIn CPC for this audience: $8–18. At $500/month, this is reinforcement and retargeting — not cold acquisition at scale. Volume is low; quality is high. Do not expect volume; expect conversion rate.

### Sprint 3 (Weeks 8–10): Output Tier-Gating

Stage Gate 2 ships — the highest-converting upgrade surface in the product. After receiving a complete Study, the user chooses output format. PPTX, Word, and Infographic are visible but locked on Professional with a one-click upgrade prompt. Section-level refinement ("Refine a section") is introduced. Language tier-gating ships.

**Engineering prerequisite (confirm before scoping):** Can a completed analysis be re-rendered into PPTX/Word without re-running the full generation pipeline? If yes: user upgrades and downloads immediately. If no: the upgrade CTA must be reworded — "upgrade and re-download from your next analysis."

**GTM actions at Sprint 3:**
- Business tier marketing begins in full: PPTX and multi-language output as the hero features for consulting (presentations to clients) and multinational strategy teams.
- Upgrade-focused email sequence: triggered when Professional users encounter a locked output format.
- First formal case studies published: use case → Caspr output → business outcome. Format: 400-word written case study + one real output sample (redacted where needed).
- Product Hunt preparation begins: build a supporter list of 100+ pre-committed upvoters, prepare listing and demo video, select launch week.

---

## 7. Phase 3 — Public Launch (Sprint 4, Weeks 11–14)

**Goal:** Caspr Signals, Monthly Brief, and Ask Caspr live. Product Hunt launch. Podcasts and Hacker News. Retention established before scale.

### Sprint 4: Retention and Intelligence Layer

The retention infrastructure ships as a coherent unit: Caspr Signals (weekly topic digest → pre-populated Study prompt), Monthly Brief (auto-generated, cost absorbed by Caspr), and Ask Caspr v1 (pulsating red dot citations on all analyses generated after go-live).

**Ask Caspr citation strategy (decide before Sprint 4 scopes):** Reports generated before Sprint 4 have no inline citation metadata. Decision required: (a) retroactive backfill — high engineering cost, (b) version label — "Ask Caspr available on analyses run after [date]", or (c) cutover date — older reports show a CTA to re-run. Option (b) or (c) is recommended. A mixed experience where some reports have red dots and others have none, without explanation, erodes trust.

**GTM actions at Sprint 4:**

**Product Hunt launch:** Top-5 of the day target. Launch on Tuesday or Wednesday. Team responds to every comment in real time. Supporter list pre-built during Sprint 3. Demo video showing the full 2-minute → analysis flow with Ask Caspr inline. Goal: Product of the Day → press coverage → backlinks → sustained organic signups.

**Hacker News Show HN:** "We built an Analytical AI that produces cited 100-page business reports in hours — every claim traceable to its source." Show the methodology: how Caspr weighs what its sources disagree on and reaches a conclusion, how Ask Caspr works. HN rewards transparency and specificity. One well-prepared Show HN generates 100–500 signups.

**Podcast outreach:** Target consulting, strategy, and business intelligence podcasts. Joy as the guest: the analyst who spent 15 years producing this analysis at McKinsey and EZ — then automated it. Pitch lead: "Why analytical AI is different from generative AI — and why it matters for business decisions." Aim for 3–5 appearances in the Sprint 4 window.

**Caspr Signals and Monthly Brief as acquisition:** Every Signals email and Monthly Brief contains a pre-populated Study prompt. The retention mechanic is also the activation mechanic. Users who have gone dormant receive a Signals email, click the prompt, and re-activate.

---

## 8. Phase 4 — Enterprise Scale (Sprints 5a/5b, Weeks 15–26)

**Goal:** Team-level adoption. Enterprise conversion. B2B sales motion begins. API-led distribution.

### Sprint 5a (Weeks 15–20): Enterprise Core
Projects, Custom templates, Team seat management. Minimum viable enterprise experience. Target: firms where 3+ individual users already have active accounts.

**Signal to act:** Three or more active Caspr accounts from the same company domain. Joy reaches out directly to the most senior of them with a personalised message: "I see [Name], [Name], and [Name] at [Company] are each running Caspr individually. At $1,800/month pooled, your whole team gets SSO, shared budget, and custom templates — for roughly the same monthly spend."

### Sprint 5b (Weeks 15–26, parallel or sequential): Enterprise Infrastructure
SSO, API access, premium data add-on (Bloomberg, PitchBook). These have different engineering dependencies from 5a and can run in parallel based on Jayant's team capacity.

**GTM actions at Sprint 5a/5b:**
- Enterprise sales page and security documentation (SOC2 status, data handling, DPA for EU/UK users).
- Outbound to consulting firms and fund managers with confirmed multi-user presence.
- Partnership outreach: accelerator programmes (YC, Techstars, On Deck), PE fund data providers, consulting tool integrations.
- API-led GTM: developer segment, technical buyers at Enterprise accounts.

---

## 9. Channel Playbook

> **Superseded on channel selection and volumes by [`docs/gtm/channel-model.md`](../docs/gtm/channel-model.md) (2026-08-20).** That document re-based these estimates against observed data — Joy's LinkedIn was carrying 98–245 signups a month across the eight ICP tables, against a realistic 20–50 — added organic search, which appears nowhere below, and separated one-time from recurring. **Where the two disagree, the channel model wins.** The keyword clusters and the borrowed-channel table below remain useful and are still current.

### Owned Channels

**Email list (1,500 signups)**
The most immediate, highest-leverage asset. Two sequences required:

*Re-engagement sequence (existing 1,500 — compressed, runs over 2 weeks):*
- Email A: "Caspr has improved since you last saw it." Product updates, specific example prompt relevant to their likely ICP, single CTA. Subject: "We've improved Caspr. Here's what's new — and here's a prompt to try right now."
- Email B: "What are you trying to figure out?" Three use cases with real output descriptions: business case, competitive landscape, due diligence. Brief / Study / Intelligence framing once Sprint 2 is live. Subject: "Three things Caspr can do for you in the next two hours."
- Email C: "A primary research firm is using Caspr for client deliverables." Social proof. The story of how the most credible user (research firm) uses Caspr for deliverable-grade output. Subject: "The output a research firm is using with clients."

*New signup activation sequence (ongoing — all new signups from Sprint 1):*
- Day 0: "Your first analysis is ready to run." One specific prompt. "Paste this into Caspr right now: [use-case-matched prompt]." Lead with the 2-minute interaction model.
- Day 3: "What are you trying to figure out?" Use-case education with three output descriptions and example prompts.
- Day 7: "Here's what a senior research professional produced with Caspr." Social proof email. One testimonial, one output sample (image or linked PDF).
- Day 14: "Caspr has one feature most people miss." Feature education email — the clarifying question flow, Ask Caspr citations (once Sprint 4 live), or PPTX output. Specific, not generic.
- Day 30: "We'd like to know what would make Caspr useful for you." Two-question survey. Generates re-engagement and product insight simultaneously.

**Blog / SEO content**
Start Month 2. Compounding from Month 5+. Priority keyword clusters:
1. "[industry] market research report" — high intent, broad reach
2. "business case for [X] in [country]" — matches actual Caspr use cases
3. "market size of [industry]" — investor and strategy ICP
4. "due diligence [sector]" — investor ICP
5. "how much does market research cost" — comparison intent, strong conversion copy opportunity

### Rented Channels

**Joy's LinkedIn (22k connections)**

Cadence: 3 posts/week. Content mix:
- 40% — Output showcases: a striking finding from a real Caspr analysis. Lead with the data point, not the product. "Here's what 2 hours of analysis on [topic] produced." End with the prompt that generated it.
- 30% — Category education: Analytical AI vs. Generative AI. What weighing conflicting sources does that an LLM cannot. How the clarifying question flow works. Why citations matter in a board setting.
- 20% — ICP pain: "The consulting research problem that nobody talks about." "What investors actually mean when they ask for 'market context' before a first meeting." Pain-first, no product mention until the comment thread.
- 10% — Social proof: testimonial quotes with name and title. Real output samples shared with permission.

Content rule: Caspr is always the subject, never the hero of Joy's self-promotion. Joy is the analyst publishing findings. Caspr is the source.

**LinkedIn Company Page**
Mirrors and amplifies Joy's content. Publishes 2–3x/week. Used for ad campaigns in Sprint 2+.

**Twitter / X**
Finance Twitter is active and reaches ICP 3 (Investors) more directly than LinkedIn. One Finance Twitter thread per week — typically a sector analysis finding or the Analytical AI vs. Generative AI argument. Repurposed from LinkedIn content.

### Borrowed Channels

| Channel | ICP | Timing | Tactic |
|---|---|---|---|
| Management Consulted community | Consulting / Students | Sprint 1 | Submit Caspr as a research tool; provide value in threads first; add to "tools for consulting prep" resource for students |
| Chief of Staff Association (COSA) | Strategy | Sprint 2 | Joy joins; one webinar or article on AI for strategy teams |
| Wall Street Oasis | Consulting / Investors / Students | Sprint 1 | Answer research-related threads genuinely; link to Caspr output as demonstration |
| AMI (Agency Management Institute) | Agencies | Sprint 2 | Guest webinar: "AI for agency research" with live Caspr demo |
| The Drum / Campaign / Digiday | Agencies | Sprint 2 | Contributed article: "How boutique agencies can compete on research depth without a research team" |
| LinkedIn #mrx community | Market Research Professionals | Sprint 1 | Authentic contribution to market research practitioner discussions; share findings on AI for desk research efficiency |
| ESOMAR LinkedIn group (40k members) | Market Research Professionals | Sprint 2 | Community engagement; share Caspr output relevant to research agency workflows |
| Quirks.com / GreenBook blog | Market Research Professionals | Sprint 2 | Contributed article: "How research agencies are using AI to cut pre-fieldwork desk research time" |
| Reddit r/MBA + r/consulting | Graduate Students | Sprint 1 | Authentic participation in "case comp resources" and "how do I research X industry" threads; share real Brief output when relevant |
| PrepLounge | Graduate Students | Sprint 2 | Forum contribution + featured tool listing in prep resources section |
| University consulting clubs (LBS, Booth, Kellogg — Phase 1) | Graduate Students | Sprint 1 | Direct outreach to club presidents; offer personal free account + club activation benefit |
| University consulting clubs (8–12 schools — Phase 2) | Graduate Students | Sprint 2–3 | Expand club partnerships; each club president WhatsApp to 150 members > 100 LinkedIn ads |
| Category Management Association | Category Managers | Sprint 3 | Contributed content or sponsored piece |
| Consulting / strategy podcasts | Consulting / Strategy | Sprint 4 | Joy as guest; 3–5 appearances |
| Product Hunt | Founders / Students / Broad | Sprint 4 | Full launch — top 5 of the day target |
| Hacker News | Founders / Technical | Sprint 4 | Show HN post |
| Accelerator programmes (YC, Techstars) | Founders | Sprint 5 | Partnership for cohort access |

---

## 10. Budget Allocation ($1,000/month)

### Phase 1 (Sprints 0–1): $0 paid media

Zero paid spend until the activation gate (≥25%) is cleared. All budget is reserved. GTM activities in Phase 1 are zero-cost: email, LinkedIn organic, direct outreach, testimonial collection.

### Phase 2 (Sprints 2–3): $800/month paid, $200/month tools and community

| Line | Monthly | Purpose |
|---|---|---|
| LinkedIn Ads | $500 | Retargeting ($200) + Cold ICP targeting ($300) |
| Community memberships / sponsorships | $150 | AMI, strategy communities, trade press access |
| Content tools (email platform, design) | $100 | Activation sequence tooling |
| Misc | $50 | — |

**LinkedIn ROI threshold:** If CAC (cost per paid user from LinkedIn ads) exceeds $300, pause and diagnose before resuming. At Professional ($200/month avg charge), CAC must be below $600 (3× monthly revenue) to be positive. At Business ($480/month avg), the threshold is $1,440.

### Phase 3+ (Sprint 4 onwards): Increase proportionally with MRR

When MRR reaches $10k, allocate 10% of MRR to paid acquisition. When MRR reaches $25k (breakeven), increase to 15% and begin planning for a proper acquisition budget informed by validated CAC/LTV data.

---

## 11. Purpose, x, and the Metric Framework

*Rewritten 2026-08-20 (Joy). Supersedes the previous KPI table, which measured a mis-acquired cohort.*

### Purpose

> **Bring the right professional to their first real analysis, expecting the right thing.**

- **"The right professional"** — the old cohort's failure. Signups without ICP fit are worse than none: they cost money and teach nothing.
- **"Their first real analysis"** — the documented Aha moment, and the only event that converts.
- **"Expecting the right thing"** — the difference between a trial that lands and one that disappoints. Someone arriving expecting a chatbot judges a cited Study against the wrong yardstick.

**Excluded deliberately:** awareness for its own sake, signup volume as a target, lead generation. There is no sales team — the funnel is self-serve end to end, so **marketing owns the whole path to revenue**, not the top of it.

### The north star — x

> **x = revenue generated per $1 of total GTM spend, by signup cohort.**

**Measured at two points:** `x@3` and `x@6` months from signup, as a cohort curve.

**Why two.** The free trial is **$100 with a 90-day expiry**, so a user can sit on credit for the entire third month and convert in the fourth. A 3-month window alone would systematically undercount the cohort behaving exactly as designed. `x@3` is the fast signal you act on; `x@6` is the one you scale on. **The shape matters as much as the level** — `x@3` of 1.2 on a steep curve is a better machine than 1.8 on a flat one.

**Threshold: x > 2.** A judgement call with the cost items baked in, not a derivation. Do not attempt to re-derive it from gross margin — at a fixed budget, margin is irrelevant to the objective and only ever calibrated the threshold.

**Why x and not CAC.** CAC measures acquisition cost per customer and ignores almost everything this machine actually costs — the portal, API calls, tooling, review time. It also breaks against this pricing model: a user can authorise a $200 budget, run nothing, pay the **$14 platform fee**, and count as a "paid user." **Revenue is earned on analyses run, not budgets authorised.** x measures revenue directly and sidesteps this. *Retire "trial-to-paid" as a headline metric for the same reason.*

### The scaling rule

**Maximise x at fixed spend. Do not maximise x when spend becomes variable.**

x is highest at near-zero spend — the cheapest conversions go first, and x always falls as you scale. So:

> **Establish x. Once x > 2, scale spend while x holds above 2. Then stop and improve the machine.**

**x is the gate and the health metric. Revenue is the objective.** Confusing the two produces a beautifully efficient machine that stays small. At the current fixed $1,000/month this distinction is dormant; it activates the day the taps open.

### Diagnostics — because x cannot be debugged directly

If x comes in at 1.4, these tell you whether it is a reach, trust, activation or conversion problem.

| | Stage | Measure | Target |
|---|---|---|---|
| **1** | **Reach** | **ICP fit of net-new signups** — the metric the old strategy never had | >60% |
| **2** | **Trust** | Signup rate among sessions exposed to proof assets vs not | Positive lift |
| **3** | **Activate** | Activation rate, **net-new cohort** | 40%+ |
| **4** | **Convert** | Revenue per activated user, **net-new cohort** | Rising |

### User buckets — each implies a different engagement

**On trial**

| Bucket | Definition | The question |
|---|---|---|
| **Never activated** | Signed up, zero analyses | Onboarding failure, or wrong ICP? |
| **Sampled** | One analysis, stopped | Did the output land, or was there no second question? |
| **Consuming** | Multiple analyses, credit burning down | Healthy — protect the path |
| **Converted early** | Budget set **before** the trial was exhausted | **The cream.** Study them — they define what the machine should select for |
| **Exhausted, not converted** | Used the $100, no budget set | **The most informative bucket.** They got the value and still did not pay |
| **Expired unused** | 90 days passed, credit forfeited | Reactivate, or learn from the mis-acquisition |

**Paying**

| Bucket | Definition | Why it matters |
|---|---|---|
| **Paying and consuming** | Budget set, analyses running | The actual business |
| **Paying, dormant** | Budget authorised, **nothing run — paying the $14 floor** | **A state normal SaaS does not have.** Counts as a "paid user" while generating almost no revenue. Hides a revenue problem behind a healthy headcount |
| **Lapsed** | Stopped, or fell below the minimum | Why, and was it predictable? |

**The 4.5-month rule:** past that point, *Exhausted, not converted* moves to a long-cycle bucket with a lower-frequency approach rather than continued nurture.

### Attribution

> **x measures the repeatable machine. Anything one-off gets its own line.**

- **`x_netnew`** — the gate and the north star
- **`x_reengagement`** — the existing 1,600, reported alongside, **never blended in.** Re-engagement is a one-shot asset; folding it into the headline would flatter a machine that cannot reproduce it
- **Unattributed** — the ~2 pre-existing paying users, and any direct or word-of-mouth arrival with no tracked prior touch. Reported explicitly rather than left to inflate the machine silently

### Gates

| Gate | Criteria | Unlocks |
|---|---|---|
| **Launch gate** | Rebuilt website **and** app live | Everything. Nothing activates before it (§2, principle 1) |
| **Proof gate** | Real testimonials published · `/samples` holding three real reports | Paid spend of any kind |
| **Scale gate** | **`x@6` > 2 on the net-new cohort** | Increase spend while x holds above 2 |
| **Enterprise gate** | 3+ active accounts on one company domain | Direct outreach (§8) |

**Breakeven is no longer a planning target.** It is an output of scaling once x is proven, not something to plan toward before it.

---

## 12. The Credibility Objection — The Full Answer

The #1 conversion barrier across all ICPs: *"Will AI-generated research be credible enough to present to a board / investor / client?"*

The answer has three parts, in order:

1. **Ask Caspr (product-level):** Every claim in every report has a pulsating red dot. Click it and see the exact source, the reasoning, and the supporting data — inline. You can trace every insight before presenting it. This is not a black box. (Sprint 4 live; reference as "coming soon" before then.)

2. **The founder story (credibility signal):** Caspr was built by a former McKinsey consultant who spent 15 years producing exactly this kind of analysis — and then automated it. One sentence. Then move on.

3. **The free trial (risk reversal):** Judge by the output before committing a dollar. $100 in analysis, no credit card. Run a Study on a topic you know well. Compare it to what you'd produce manually. The trial is the argument.

This three-part answer should appear — in this order — on the homepage objection section, in the Day 7 activation email (social proof), and in any ICP landing page handling the "trust" objection.

---

## 13. Immediate Actions — This Week

In priority order. Items 1–3 have no product dependency.

| # | Action | Owner | Deadline |
|---|---|---|---|
| 1 | Contact all testimonial candidates — written testimonials first, video to follow | Joy | Day 2 |
| 2 | Joy runs 3 demonstration analyses (market research, business case, due diligence) — for marketing samples AND Sprint 1 sample reports | Joy | Day 3 |
| 3 | Publish first LinkedIn post | Joy | Day 3 |
| 4 | Ship Sprint 0 copy changes (~2 hours dev) | Jayant | Day 2 |
| 5 | Measure activation baseline: how many of 1,500 signups have generated ≥1 analysis? | Jayant | Day 3 |
| 6 | Segment 1,500 signups: activated vs. not, trial balance remaining vs. expired | Jayant | Day 3 |
| 7 | Draft LinkedIn content calendar — 12 posts for 4 weeks | Joy + Claude | Day 5 |
| 8 | Confirm with Jayant: can a completed analysis be re-rendered into PPTX/Word without re-running generation? (Sprint 3 scope dependency) | Joy + Jayant | Day 5 |
| 9 | Decide Ask Caspr citation strategy: retroactive, version label, or cutover date (Sprint 4 scope dependency) | Joy + Jayant | Day 7 |
| 10 | Set up email tool (Loops or equivalent) and configure activation sequence triggers | Jayant | Day 10 |

---

## 14. Reference Files

| File | Purpose |
|---|---|
| `icp-personas.md` | Deep persona analysis for all 8 ICPs: day-in-life, pain points, buy motion, 90-day lead volume estimates per channel |
| `icp-copy.md` | Final primary messages, secondary copy, proof points, CTAs and channel variants for all 8 ICPs |
| `academic-programme.md` | Complete Caspr Academic programme reference: pricing, verification, Research Dollars, club model, GTM, copy, and success metrics |
| `website-architecture.md` | Full 32-page site architecture: page hierarchy, navigation spec, SEO intent, conversion architecture, internal linking, build phases, URL conventions |
| `email-sequences.md` | Two email sequences: Sequence A (new signup activation, 5 emails over 30 days) and Sequence B (re-engagement for existing 1,500 signups, 3 emails over 12 days) |
| `product-sprint-gtm-alignment.md` | Sprint-by-sprint feature releases, GTM unlocks, "coming soon" framework, engineering flags |
| `product-marketing-context.md` | Master product reference: UX flow, pricing model, messaging architecture, competitive positioning |
| `brand-guidelines.md` | Voice, tone, writing rules, approved/rejected copy; includes Caspr Academic sub-brand voice section |
| `pricing-model.md` | Research Budget model engineering spec, billing rules, refund policy; Section 15 covers Academic Tier mechanics in full |
| `security-posture.md` | Caspr's information security posture: confirmed certifications (ISO 27001:2022, GDPR), cleared marketing claims, pending Jayant answers, /security page FAQ draft, enterprise objection handling |
