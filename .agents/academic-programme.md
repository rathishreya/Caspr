# Caspr Academic Programme

*Last updated: 2026-05-13*
*Status: Approved — pending Engineering build*
*Owner: Joy (GTM) · Jayant (Engineering)*
*Cross-references: pricing-model.md §15 · icp-personas.md ICP 8 · brand-guidelines.md · icp-copy.md ICP 8*

---

## What This Document Is

The definitive reference for the Caspr Academic programme: who it serves, what it offers, how the mechanics work, and how to go to market. Engineering specs live in pricing-model.md §15 — this document is the go-to reference for marketing, GTM strategy, and programme management.

---

## 1. Strategic Rationale

Graduate students — particularly those on consulting and strategy tracks — are a low-direct-revenue ICP with disproportionate long-term value. They are:

- **Future professional users.** An MBA student at LBS who uses Caspr in Year 1 joins McKinsey in Year 2. They know the product. They expense it. The student relationship is a 12–24 month acquisition funnel for a Business-tier professional user at $600/month.
- **Peer advocates at scale.** The unit of viral spread is the club, not the individual. One student who wins a case competition using Caspr and shares it on their consulting club WhatsApp triggers 50–150 warm signups in 48 hours.
- **Credibility assets.** "Used by students at LBS, Wharton, and Booth" is a social proof signal that works on professional ICPs too. It suggests the product is rigorous enough that serious analysts trust it.

**The commercial logic:** Caspr accepts near-zero margin on student analyses now. The return is post-graduation conversion to Professional ($200/month) and Business ($600/month) subscriptions — a 10–30× multiple on the original student revenue, with zero additional acquisition cost.

---

## 2. ICP Summary

Full persona: see `icp-personas.md` ICP 8.

**The student:** MBA or MSc, consulting or strategy track. 24–28 years old. Time-pressed, deadline-driven, often shut out of institutional databases at the exact moment they need them (10pm, working from home, VPN failing, library closed). Has been burned by ChatGPT hallucinating citations. Has a case competition brief due in 30 hours.

**Primary trigger events:**
- Case competition brief released (24–48 hour window)
- Consulting recruiting season — industry primers for 5–10 sectors
- Dissertation market context chapter due
- Live client practicum project
- Written application case (48–72 hour deadline)

**Target programmes (Phase 1):** LBS, INSEAD, Wharton, Booth, Kellogg, Sloan, Columbia, Oxford Saïd, HEC Paris, NUS Business School

---

## 3. Caspr Academic: Product Structure

### 3.1 Individual Academic Account

| Parameter | Value |
|---|---|
| Eligibility | Verified student at accredited institution |
| Verification | .edu or equivalent institutional email (Tier 1/2 auto); document request for others |
| Brief price | **$8** (vs. $15 standard) |
| Study price | **$40** (vs. $80 standard) |
| Intelligence | Not available |
| Platform fee | Waived |
| Billing model | Top-up only — no monthly subscription |
| Free trial | **$150** gifted (vs. $100 standard) |
| Minimum top-up | $20 |

Students are never asked to commit to a $200/month subscription. They buy analyses as they need them. After the $150 free trial, they top up in minimum $20 increments.

### 3.2 Academic Club Account

The club version of the Enterprise pooled-budget model. Self-service — no sales process required.

| Parameter | Value |
|---|---|
| Created by | Any verified Academic Account holder |
| Minimum active members to activate | **20** (each must have run at least one analysis) |
| Pooled budget minimum | **$100/month** |
| Platform fee on pool | Waived |
| Analysis prices from pool | Academic pricing (Brief $8, Study $40) |
| Club admin benefit | $50 Research Dollars/month to admin's personal account |
| Activation bonus | $20 Research Dollars to club pool when 20th member activates |

**How a student creates a club:**
1. From their Caspr Academic dashboard → "Enroll my club"
2. Enter club name + generate invite link
3. Add payment method and set monthly pool budget (min. $100)
4. Share invite link with club members
5. When 20 members each run their first analysis → club activates, $20 pool bonus issued, admin's $50/month benefit begins

### 3.3 Research Dollars Programme

Promotional credits earned through automated actions. No manual review required for any earn event.

| Earn event | Amount | How it works |
|---|---|---|
| Refer a classmate who signs up | $15 | Referral link tracked; credit on account creation |
| Referred classmate runs first analysis | $10 | Credit on first analysis completion event |
| Complete onboarding (profile + Signals topic) | $5 | Both fields populated in dashboard |
| Club reaches 20 active members | $20 (to pool) | Credit on 20th member's first analysis |
| Share Card receives 10 unique clicks | $10 | Credit on 10th unique engagement event |

**Mechanics:**
- Expiry: 180 days from issuance (matches academic year rhythm)
- Lifetime cap: $200 per account (historical total, including expired)
- Spent before paid balance — same spend order as standard promotional credits

**Maximum earn potential (active, sharing student):**
| Source | Amount |
|---|---|
| $150 free trial | $150 |
| Onboarding completion | $5 |
| 3 referrals who activate (×$25 each) | $75 |
| 3 Share Cards reaching 10 clicks (×$10 each) | $30 |
| **Total before spending a dollar** | **$260** |

That covers 32 Briefs or 6.5 Studies at zero cash cost for an actively engaged student.

### 3.4 Share Card

A student who completes an analysis can generate a branded summary card directly from their dashboard. The card contains:
- Analysis title
- One key insight (auto-pulled from executive summary)
- University name (opt-in)
- "Analysed with Caspr Academic" badge
- A unique tracked link (`caspr.ai/s/[unique-id]`)

When the student posts this card anywhere — LinkedIn, Reddit, consulting club WhatsApp, university Slack — and **10 unique devices click the link**, they earn $10 Research Dollars automatically.

**The progress counter is visible in real-time in the dashboard:** *"6 of 10 clicks received — share with more classmates to earn your $10 Research Dollars."*

This is the viral distribution mechanism. Students with 10-click targets become active distributors of Caspr-branded analysis outputs into exactly the channels where the next cohort of students lives.

### 3.5 Graduation Conversion

When a student's academic email stops working (hard bounce) or they update their profile with an employer name and professional email:

1. Account transitions automatically to standard pricing
2. A **$100 promotional credit** is issued (180-day expiry)
3. They receive an email: *"You've moved. Your research has too. Your $100 credit toward a Professional account is waiting."*

The $100 credit reduces the effective cost of the first $200 Professional charge to $100 net — meaningfully lowering the conversion barrier at the exact moment the former student is starting a new role and looking for tools to expense.

---

## 4. Verification: How It Works Globally

Caspr Academic uses a three-path verification system. The vast majority of global students are covered by the first two paths automatically.

**Tier 1 — Auto-approved (no friction):** Emails from known academic domain patterns (`.edu`, `.ac.uk`, `.edu.au`, `.ac.in`, `.edu.sg`, and 25+ country equivalents) plus all domains in the Hipo university-domains-list database (9,600+ institutions). Email verification click only.

**Tier 2 — Institutional email, unlisted domain:** Any institutional email that successfully receives and verifies a Caspr email is admitted. Domain is whitelisted automatically for future students from the same institution.

**Document Request — No institutional email:** Student submits university name + one supporting document (student ID, enrolment letter, or fee receipt) via `caspr.ai/academic/verify`. 48-hour review SLA. Once approved, account is activated.

**University Domain Activation:** An institution's IT team or student union can request that their domain is added to the Tier 2 whitelist via `caspr.ai/academic/institution`. Caspr proactively solicits these activations from target schools as part of club outreach.

---

## 5. GTM Strategy

### 5.1 Phase 1 — Months 1–3

Objective: embed Caspr Academic into the consulting workflow at 2–3 target programmes. Drive 20+ active club members at each. Measure trial-to-paid conversion from free $150 balance to first top-up.

**Actions:**

| Action | Owner | Channel |
|---|---|---|
| Build and launch `caspr.ai/academic` landing page | Marketing | Website |
| Add Academic section to pricing page | Marketing | Website |
| Reddit seeding — r/MBA + r/consulting | Joy | Reddit |
| Authentic contributions to "case comp resources" and "consulting prep tools" threads | Joy | Reddit |
| Direct outreach to consulting club presidents at 3 target schools (LBS, Booth, Kellogg) | Joy | LinkedIn / email |
| Offer club presidents: free personal account + $50/month Research Dollars benefit | Joy | Direct |
| PrepLounge: contribute one "how I researched this sector in 15 minutes" resource | Joy | PrepLounge |

**Phase 1 success criteria:**
- 3 active Academic Clubs with 20+ members each
- 150+ Academic Account signups
- 10+ first top-ups ($20+ paid transactions) from non-trial students
- 5+ Share Cards with 10+ clicks each (signals organic distribution is working)

### 5.2 Phase 2 — Months 3–6

Objective: expand to 8–12 clubs, activate Management Consulted and Wall Street Oasis channels, begin collecting student testimonials for use in broader marketing.

**Actions:**

| Action | Owner | Channel |
|---|---|---|
| Expand club outreach to 8–12 target schools | Joy | LinkedIn / direct |
| Management Consulted: partner listing in "tools for consulting prep" resources | Joy | Partnership |
| Wall Street Oasis: contribute to consulting research threads | Joy | Community |
| PrepLounge: featured tool placement | Joy | Partnership |
| Collect 3–5 student testimonials (case competition wins, dissertation chapters, recruiting outcomes) | Joy | Direct outreach |
| Build academic → professional conversion email sequence (graduation trigger) | Marketing | Email |

**Phase 2 success criteria:**
- 8+ active clubs
- 400+ Academic Account signups
- 20+ paid student transactions/month (top-ups)
- 3+ graduation conversions to Professional accounts (earliest cohort from Phase 1)

### 5.3 Key Channels

| Channel | Tactic | Why it works |
|---|---|---|
| Reddit r/MBA + r/consulting | Authentic participation in research tool threads; share real Brief output as example | High-trust peer recommendation context; these communities actively discuss tools |
| Consulting club partnerships | Direct outreach to 8–12 club presidents; offer personal free account + club activation benefit | One WhatsApp message from a club president to 150 members > 100 LinkedIn ads |
| Management Consulted | Feature listing in "tools" resources; provide 2 industry primer examples | 100k+ monthly readers; direct audience match |
| PrepLounge | Forum contribution + featured tool listing | 564k members; active consulting prep community |
| Wall Street Oasis | Organic contribution to research and case prep forums | 900k+ members; consulting + finance overlap |
| LinkedIn (MBA-targeted content) | "The case competition data problem — solved at 11pm" narrative posts | Retargeting students who have visited caspr.ai; lower organic reach for this ICP than professional ICPs |

### 5.4 What Not to Do in Phase 1

- **Do not run paid ads to students.** The LTV doesn't justify paid acquisition costs of $50–200/student. Organic and partnership channels only until post-graduation conversion data validates the LTV hypothesis.
- **Do not offer subscription pricing.** Students will not commit to $200/month. Any mention of subscription requirements will kill conversion. Per-analysis top-up only.
- **Do not lead with the academic integrity framing.** Address it when the objection is raised; do not make it the headline. It implies we expect them to misuse it.

---

## 6. Copy Reference

Full ICP copy: see `icp-copy.md` ICP 8. The following are quick-access anchors.

### Landing Page (`caspr.ai/academic`)

**Hero:**
> *"Your library closed at 9pm. Your case brief doesn't care. Caspr is open."*

**Subhead:**
> A cited sector landscape in 15 minutes. 100-page market analysis in hours. $8 per Brief. $40 per Study. Verify your academic email to unlock.

**Secondary CTA area:**
> *"Caspr Academic. Because access to real research shouldn't depend on your institution's library budget."*

### Pricing Page (Academic section)

> **Caspr Academic**
> The same analyst-grade research as the Professional tier — at the rate students deserve.
> $8 per Brief · $40 per Study · No subscription · Verify your .edu email to unlock.
> [Start with $150 free →]

### Email Subject Lines (by trigger)

| Trigger | Subject line |
|---|---|
| Case competition brief dropped | "The industry primer your case brief expects. In hours." |
| Consulting recruiting season | "5 sectors. 5 hours. Not 5 days." |
| Dissertation chapter due | "The market context chapter your dissertation needs. Cited. Done." |
| General academic outreach | "Your library closed at 9pm. Caspr didn't." |

### Objection Handling (at point of use)

| Objection | Response |
|---|---|
| "Is this allowed for my dissertation?" | Caspr is a research database, not a writing tool. You cite the underlying sources in your bibliography, not Caspr. Same category as IBISWorld. Confirm with your supervisor. |
| "ChatGPT does this for free." | ChatGPT generates text. Caspr generates cited analysis. When a judge asks where your Vietnam logistics market size came from, "it seemed reasonable" is not an answer. |
| "I can use the library." | On campus. During library hours. Before download limits kick in. When the VPN works. |
| "I can't afford $80 for a Study." | Your first $150 is free. A Brief is $8. A Study at $40 is less than one PrepLounge coaching session. |

### Community/Reddit Copy Format (organic — never boosted)

> *"Used Caspr for a case comp industry primer last week — 15 minutes, Brief with cited market size data and named players. Not a ChatGPT summary. Actual research. Sharing in case anyone else has a brief this weekend: caspr.ai/academic"*

This is not an ad. It is a peer recommendation. It must read like one. Never sponsor or boost this format.

---

## 7. Success Metrics

| Metric | Phase 1 target | Phase 2 target |
|---|---|---|
| Academic Account signups | 150 | 400 |
| Active Academic Clubs | 3 | 8–12 |
| Share Cards with 10+ clicks | 5 | 25+ |
| First top-ups (paid transactions) | 10 | 50/month |
| Graduation conversions to Professional | 0 (too early) | 3+ |
| Professional-tier LTV from converted students | — | Validate at Month 6 |

**The North Star metric for this programme is post-graduation conversion rate** — not the student revenue itself. If 10–15% of students who used Caspr Academic convert to Professional or Business tier within 12 months of graduation, the programme pays for itself many times over.

---

## 8. Open Items

| Item | Status | Owner |
|---|---|---|
| Engineering build: Academic account type, pricing catalogue, verification logic | Not started | Jayant |
| Engineering build: Research Dollars earn events and ledger | Not started | Jayant |
| Engineering build: Share Card generation and engagement tracking | Not started | Jayant |
| Engineering build: Graduation conversion trigger | Not started | Jayant |
| Engineering build: Academic Club self-serve creation flow | Not started | Jayant |
| `caspr.ai/academic` landing page design and copy | Not started | Marketing |
| `caspr.ai/academic/verify` document request form | Not started | Jayant |
| Pricing page Academic section | Not started | Marketing |
| Club outreach: 3 target schools Phase 1 | Not started | Joy |
| Hipo university-domains-list import | Not started | Jayant |
| Graduation conversion email | Not started | Marketing |
