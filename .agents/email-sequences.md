# Caspr — Email Sequences

*Last updated: 2026-05-09*
*Status: Draft — ready for Joy review before sending*
*Sender: Joy at Caspr <joy@caspr.ai> — all sequences*

---

## Two Sequences

| Sequence | Audience | Length | Goal |
|---|---|---|---|
| **A. New Signup Activation** | All new signups (Day 0 onwards) | 5 emails / 30 days | First report generated → trial-to-paid |
| **B. Re-Engagement** | Existing 1,500 signups, no report generated | 3 emails / 12 days | Re-activate, understand blockers |

---

## Before You Send

**Three things to confirm before either sequence goes live:**

1. **"First $100 free" is live in the product** — all CTAs reference this. Confirm with Jayant before campaign launch.
2. **Activation baseline measured** — know what % of the 1,500 have generated ≥1 report before launching the re-engagement sequence. If activation data is unavailable, send to all 1,500 and track from there.
3. **Sample outputs available** — Emails 3 and B reference sending a "sample Study on request." Joy must have run 3 demonstration analyses (market research, business case, due diligence) before this line can be fulfilled. See Sprint 0 immediate actions.

---

## Sequence A — New Signup Activation

```
Trigger:       User completes signup on caspr.ai
Goal:          User generates first analysis within 14 days
Length:        5 emails over 30 days
Exit:          User generates ≥1 report (remove from sequence)
Sender:        Joy at Caspr <joy@caspr.ai>
Reply-to:      joy@caspr.ai (Joy reads and responds — builds founder-touch at this stage)
```

**Automation note:** Emails 2 and 3 are conditional on no report generated. If behavioural event tracking is not yet integrated with your ESP, replace the condition with soft framing in the copy ("if you haven't run your first analysis yet") and send to all. Flag the tracking integration as a Sprint 1 engineering item.

---

### Email 1 — Day 0 (Send immediately on signup)

**Purpose:** Get them to run their first analysis. One action. Nothing else.

```
Subject:   Your first analysis is ready to run.
Preview:   Two minutes of your time. The rest is Caspr's.
```

[First name],

You signed up. Here's what to do next.

Open Caspr. Paste this:

*"Market landscape and competitive dynamics in [your sector]."*

Replace the bracket with the industry you're working in. Hit enter. Answer two clarifying questions. Then step away.

In 15 minutes you have a Brief — a structured, cited overview. In under two hours, a full Study: 100 pages, every insight traced to source, ready to present.

Your first $100 is on us. No credit card. No deadline on your first report.

[Run your first analysis →](https://caspr.ai)

Joy
Caspr

---

**Copy notes:** Opens with the action, not a welcome. Provides a specific prompt so there is zero ambiguity about what to type. The two-minute interaction model is implicit — "step away" does the work without explaining the mechanism. Cost appears only as a risk reversal, not the hook.

---

### Email 2 — Day 3 (Condition: no report generated)

**Purpose:** Use case education. Show three specific examples. Let them self-identify.

```
Subject:   What are you trying to figure out?
Preview:   Three things people ran on Caspr this week.
```

[First name],

Three analyses running on Caspr this week:

*"Business case for expanding logistics operations into Southeast Asia."*
*"Competitive landscape — mid-market SaaS HR platforms, US and UK."*
*"Due diligence: India renewable energy sector, target identification."*

Each one: a single prompt. Two minutes of active time. A 100-page cited analysis, PDF or editable PPTX.

If any of those are close to what you're working on, you have your prompt. If not — reply to this email with your use case. I'll write you one.

Your $100 trial balance is waiting.

[Start your first analysis →](https://caspr.ai)

Joy
Caspr

*P.S. The analysis isn't a summary. Every insight is cited to source. If you'd like to see a sample output before you run your own, reply and I'll send one.*

---

**Copy notes:** The three examples span three ICPs (Strategy, Consulting, Investors) — any reader will find one that maps to their world. The P.S. handles the credibility objection without making it the body of the email. "Reply to this email" keeps the interaction human and captures intent data.

---

### Email 3 — Day 7 (Condition: no report generated)

**Purpose:** Social proof via use case story. Establishes output quality as client-deliverable standard.

```
Subject:   A research firm is using Caspr for client deliverables.
Preview:   Not internal notes. Not a rough draft.
```

[First name],

A primary market research firm uses Caspr to deliver client reports.

Not internal notes. Not a rough draft. Client-facing deliverables — cited, structured, boardroom-ready. Their analysts still lead the thinking. Caspr handles the two-week research layer in hours.

The distinction: Caspr removes the part of the analyst's job that doesn't require an analyst.

The output is 100 pages. Cited to source. The kind of analysis that used to come with a retainer and a six-week timeline.

If you want to see a Caspr Study before running your own, reply. I'll send a sample.

Your trial balance is still live.

[Run a free analysis →](https://caspr.ai)

Joy
Caspr

---

**Copy notes:** "Not internal notes. Not a rough draft." answers the credibility objection before the reader raises it. The proof is institutional (a firm, client-facing) rather than a founder claim. Copy does not name the firm — update this email when a public testimonial is secured.

---

### Email 4 — Day 14 (Send regardless — no condition)

**Purpose:** Product update. Removes known friction points that may have blocked activation. Reinvites.

```
Subject:   Caspr has improved since you signed up.
Preview:   Three specific things that changed.
```

[First name],

Three things that changed since you signed up:

**Starting a report is simpler.** The file upload modal is optional — close it and type your prompt directly. You don't need reference files to get started.

**The analysis continues after it lands.** Post-report, you can ask Caspr follow-up questions, request refinements, or start a linked analysis — all from inside the report.

**PPTX is live.** Every Study generates as an editable PowerPoint, not just a PDF. Your report arrives ready to open in front of a client or board.

The product is better than what you saw. Worth a second look.

[Run your first analysis →](https://caspr.ai)

Joy
Caspr

---

**Copy notes:** Specific improvements only — no vague "we've been working hard." Each bullet directly removes a known friction point identified in the UX audit (file modal, disabled chat, PPTX discoverability). Send this email regardless of report-generated status — it serves as both activation and re-activation.

*Engineering dependency: This email only works after Sprint 1 UX fixes are live. Do not send before Sprint 1 ships.*

---

### Email 5 — Day 30 (Condition: no report generated)

**Purpose:** The direct ask. Two questions. Generates insight. Creates a path forward for every reader.

```
Subject:   Two questions, if you have 90 seconds.
Preview:   I'd rather know than guess.
```

[First name],

You signed up for Caspr a month ago and haven't run an analysis yet.

I'm not going to send another email about features. One question:

**What would make Caspr useful for you, right now?**

Reply directly — I'll read it.

If the answer is "I'm not sure what to use it for": send me your job title and the last research task you had to do. I'll write you a prompt and, if it helps, run a sample for you to review.

If the answer is "the product isn't ready for what I need": tell me what's missing. I'd rather know now than find out later.

Joy
Caspr

*If Caspr genuinely isn't for you — unsubscribe below. No follow-up. But if there's something we can fix or clarify, I'd prefer to hear it.*

---

**Copy notes:** The direct honesty of "I'd rather know than guess" signals respect — it's not a template. The two paths ("not sure" / "product gap") give every non-converter a clear next step rather than a dead end. The P.S. gives a graceful exit rather than forcing unsubscribes to feel adversarial. Responses to this email are primary research on activation blockers — Joy should track themes and feed them back into product.

---

## Sequence B — Re-Engagement (Existing 1,500 Signups)

```
Trigger:       Manual send to existing signups with no report generated
               (or all 1,500 if activation data unavailable)
Goal:          Re-activate; understand blockers; generate first analysis
Length:        3 emails over 12 days
Timing:        Day 0, Day 5, Day 12
Exit:          User generates ≥1 report
Sender:        Joy at Caspr <joy@caspr.ai>
Note:          Do not use "just signed up" framing — these users signed up weeks or months ago
```

**Framing shift from Sequence A:** These users knew enough to sign up. The barrier is not awareness — it is inertia, competing priorities, or a specific blocker (UX, trust, unclear use case). The re-engagement sequence acknowledges the gap without apology and makes the path back frictionless.

---

### Email A — Day 0

**Purpose:** Use case education. Show what the product is actually used for. Self-selection prompts.

```
Subject:   What are you trying to figure out?
Preview:   Three analyses from this week — one is probably close to yours.
```

[First name],

When you signed up for Caspr, you were interested in analytical AI for business.

Here's what people are running this week:

*"Strategic options paper: SaaS expansion into Asia-Pacific."*
*"Due diligence on a fintech acquisition target, European market."*
*"Market sizing for a board presentation on infrastructure investment."*

One prompt. Two minutes of your time. 100-page cited analysis — PDF or editable PPTX.

Your competitors are still waiting for the research.

If any of those are close to what you're working on, you already have the prompt. If not — reply with your use case. I'll write one for you.

[Run your first analysis →](https://caspr.ai)

Joy
Caspr

*P.S. The trial balance is still there. First $100 on Caspr, no credit card required.*

---

**Copy notes:** Opens by acknowledging they already signed up — "you were interested" — not "you might be interested." The approved line "Your competitors are still waiting for the research" earns its place here as a closer after the use case examples have done their work. The P.S. brings back the trial offer without making it the headline.

---

### Email B — Day 5

**Purpose:** Social proof. Professional-grade output validated by practitioner use.

```
Subject:   What a research firm is doing with Caspr.
Preview:   Client deliverables. Not internal notes.
```

[First name],

A primary market research firm has been using Caspr for three months.

Before: two weeks to deliver a landscape analysis to a client. A team of analysts. Significant time on every engagement.

Now: their analysts use Caspr for the research layer. Two weeks becomes hours. They still lead the thinking — the synthesis, the conclusions, the client relationship. Caspr handles the part that doesn't require their judgment.

The output is client-facing. 100 pages. Cited, structured, boardroom-ready.

The same quality your clients expect from a firm. Available from a single prompt.

If you'd like to see a sample Study before running your own — reply to this email and I'll send one.

[Start your first analysis →](https://caspr.ai)

Joy
Caspr

---

**Copy notes:** The before/after structure is specific and functional — it answers "how does this actually fit into existing workflows" rather than "how does this replace them." The message to consultants and strategists is that Caspr makes their team faster, not redundant. Update when a named testimonial is secured.

---

### Email C — Day 12

**Purpose:** The direct ask. No features. Two paths. Honest close.

```
Subject:   What would make Caspr useful for you?
Preview:   One question. Reply directly.
```

[First name],

You signed up for Caspr and haven't run an analysis.

One question: what would make it useful for you, right now?

Reply to this email. I'll read it.

If you're not sure what to use it for — send me your job title and the last research task you had to complete. I'll write you a prompt. If it helps, I'll run a sample for you to review before you spend anything.

If the product isn't ready for what you need — tell me what's missing. That's more useful to me than a quiet churn.

Joy
Caspr

*Not the right time? Unsubscribe below — no follow-up. But if there's a use case we're not covering, I'd genuinely rather know.*

---

**Copy notes:** The shortest email in both sequences is the right choice for the last touch. The reader has had two previous emails with examples and proof. This one earns the right to be direct. "Quiet churn" signals that Joy is building a product, not running a campaign — it changes the register of the ask. Every response is an interview with a non-converter.

---

## ICP-Specific Subject Line Variants

When signup segmentation data is available (by job title, industry, or self-reported use case), substitute these ICP-specific subject lines from `icp-copy.md`:

| ICP | Subject line variant |
|---|---|
| Consulting Associates / EMs | "Your next desk research project just got 3 days shorter" |
| Strategy / VP Strategy / CoS | "The business case your board wants. Without the 8-week wait." |
| Investors (PE / VC / HF) | "Sector context before the first founder meeting" |
| Agency Strategists | "The sector deep-dive for your next pitch — in hours, not days" |
| Startup Founders | "The market sizing slide that survives investor scrutiny" |
| Market Research Professionals | "The pre-fieldwork research layer your team is still doing manually" |
| Category / Commercial Managers | "The market context your next category review is missing" |
| Graduate Students (MBA/MSc) | "The industry primer your case competition brief expects. In hours." |

Use these as drop-in replacements for Email 2 / Email A subject lines when the ICP is known. Body copy can remain universal until ICP-specific sequences are warranted by volume.

---

## Metrics Targets

| Metric | Benchmark | Caspr target |
|---|---|---|
| Open rate | 20–30% (B2B SaaS) | 35%+ (founder send, warm list) |
| Click-to-open rate | 10–20% | 15%+ |
| Reply rate (Emails 5 / C) | 1–5% | 5%+ (reply = qualified signal) |
| Activation from sequence | — | 10% of re-engaged list generates ≥1 report |
| Trial-to-paid from activated | — | 5% within 30 days of first report |

**What to track per email:**
- Open rate (subject line signal)
- Click rate (CTA relevance signal)
- Reply rate on Emails 5 and C (activation barrier data)
- Report generation within 7 days of each send (activation conversion)

---

## Implementation Order

1. **Launch Sequence B first** (re-engagement, existing 1,500) — these users are already warm, no acquisition cost, and the compressed timeline gives activation data in two weeks.
2. **Launch Sequence A on Sprint 1 ship** — new signup activation should go live the same day as the Sprint 1 UX fixes. Email 4 specifically references those fixes.
3. **Set up exit condition** (removes from sequence when first report generated) before either sequence goes live — prevents over-sending to activated users.
4. **Collect and tag replies** — every reply to Email 5 or Email C is a product interview. Track themes: "unclear use case," "UX blocker," "not the right time," "product gap." Report to Joy weekly during campaign period.

---

## Signoff Items Before Launch

| Item | Owner | Status |
|---|---|---|
| Confirm "first $100 free" is live in product | Jayant | Pending |
| Run 3 demonstration analyses for sample output offers | Joy | Sprint 0 action |
| Connect ESP to product event tracking (report generated) for exit condition | Engineering | Sprint 1 |
| Email 4: do not send until Sprint 1 UX fixes are live | Marketing | Engineering dependency |
| Update Email 3 / Email B when named testimonial is secured | Joy | When available |
