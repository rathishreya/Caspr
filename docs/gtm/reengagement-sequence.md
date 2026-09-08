# Re-engagement — the founders' sequence

*Written 2026-08-20. Replaces Sequence B in [`../../.agents/email-sequences.md`](../../.agents/email-sequences.md), which was drafted in May for a product and a positioning that no longer exist.*

**Audience:** everyone who has ever signed up — ~1,600 accounts
**Senders:** `founders@caspr.ai` — Joy and Jayant, personally, alternating
**Shape:** 5 emails over 3 weeks, branching by segment
**Fires once.** There is no second run of this list.

---

## 1 · The frame

**These people signed up for a different product.** Old positioning — *"AI for Market Research."* Retired token pricing — Free / Plus $50 / Pro $200. An app now being replaced. Most never generated an analysis.

That is not something to apologise for. **It is the story.** The strongest thing two founders can say to an early list that went quiet is: *we went away and rebuilt it, and you were here first.*

Three consequences for the writing:

- **No "just signed up" framing.** They signed up months ago and they know it. *(Kept from the May draft — it was right.)*
- **No pretending nothing changed.** Naming the gap honestly is what buys the read.
- **The ask comes last, and only from people who came back.** Asking a dormant user for a referral converts at approximately zero.

---

## 2 · What must be true before a single email sends

**All five. This is a one-shot asset and sending early wastes it.**

| | Precondition | Owner |
|---|---|---|
| **1** | **The product is live** and the new onboarding works end to end. Email 3 sends people into it | Jayant |
| **2** | **`/samples` holds three real reports.** Email 4 shows output. A "coming soon" page kills the sequence at its most persuasive moment | Joy |
| **3** | **The segmentation export is back** ([`segmentation-ask.md`](segmentation-ask.md)) — without it this is one generic blast to four audiences | Jayant's team |
| **4** | ~~The founding-member credit exists in the product~~ — **downgraded 2026-08-26 from blocker to accelerant.** The access model gives an expired trial a viable path without it: **top up and run one analysis.** The credit still lifts response; **Email 3 is no longer blocked on it** — §4 | Jayant |
| **5** | **The sending domain is warmed** (§7). 1,600 cold addresses from a new sender lands in spam regardless of the copy | Jayant / DM TL |

**Precondition 5 has the longest lead time — roughly three weeks — and nothing else depends on it. Start it first.**

---

## 3 · Segments

From [`segmentation-ask.md`](segmentation-ask.md) §"What we do with it".

| | Definition | Treatment |
|---|---|---|
| **S0 — Suppress** | Test, internal, deleted, hard-bounced, unsubscribed | Nothing |
| **S1 — Never activated** | Zero completed analyses. **The bulk of the list** | The full five |
| **S2 — Activated once** | Exactly one | Full five, different Email 1 — they saw the output and did not return, and we want to know why |
| **S3 — Repeat users** | Two or more | Emails 1, 2 and 5 only. They do not need convincing; they are the testimonial and referral pool |
| **S4 — Ever paid** | Any revenue | **A personal note from both founders before anything automated reaches them.** Then Emails 2 and 5 |

---

## 4 · The founding-member credit

### ⚠ What the access model changed — 2026-08-26

**The ask this sequence has to make just got materially easier, and that is the most important change to this
document.**

| | Before | Now |
|---|---|---|
| **What an expired trial faced** | **A $200 commitment** — or nothing | **Top up and run one analysis.** Top-up is available to anyone, at any time |
| **What Email 3 must overcome** | A subscription decision | **A single $15 or $80 purchase** |
| **What the credit does** | **Carried the whole offer.** No credit, no ask | **Accelerates a viable ask.** A gift still beats a purchase, but the sequence works without it |

**Why this matters more than it reads.** The old sequence asked a dormant user who never generated an
analysis to **commit to a monthly budget before they had ever seen the product work.** That is the hardest
ask in the funnel, made to the coldest segment we have.

> **Now the ask is: run one. That is the same ask a first-time visitor gets, made to someone who has already
> heard of us.**

**Two consequences for the copy.** The offer line stops being load-bearing — so *"$150 in analysis"* becomes a
reason to return rather than the only route back. And **the price framing rule binds here**
([`../product/access-model.md`](../product/access-model.md) §1, `COPY-11a/b`): **never write the budget as a
subscription.** *"$200 a month of research"*, never *"from $200/mo"* — paired with *"unused balance carries
forward"*.

> **⚠ Corrected 2026-08-26.** This section previously required the phrase *"only what you run is recharged"*.
> **That phrase is false and must not be used.** `pricing-model` §3.1: `R = F + top_up`, and **the platform
> fee is charged every month regardless of use** — $14 on a $200 budget even at zero consumption, $94 for one
> $80 analysis. **Permitted instead:** *unused balance carries forward* · *each month restores only what you
> consumed* · *a quiet month costs far less than a busy one*.

---

### The credit itself

**This is an engineering dependency, not a copy decision.** `pricing-model.md` grants one $100 trial per identity, 90-day expiry. These people have consumed theirs, most under the retired token model.

**Proposed:** **$150, 60-day expiry, no card, tagged `founding_member`** so its conversion can be measured separately from the standard trial.

Also needs a position on **legacy token balances** — honour, convert, or write off. Whatever is decided, Email 3 must state it plainly. Going quiet on balances people still remember is the one thing that would turn this sequence hostile.

---

## 5 · The five emails

Copy is final. Bracketed values are merge fields.

---

### Email 1 · Day 0 · Joy · **What we've been doing**

```
Subject:  What we've been doing since you signed up
Preview:  The short version: we rebuilt it.
```

[First name],

You signed up for Caspr in [month]. Then we went quiet.

Here is why. What you saw was a first version, and it was not the product we wanted attached to our names. So we rebuilt it — the analysis engine, the sources it reads, how it shows its reasoning, the interface, and the pricing.

You were among the first two thousand people to sign up. I know what that is worth, because for a long time you were most of the evidence we had that any of this mattered.

Over the next couple of weeks I would like to show you what changed. Jayant — my co-founder — is going to write next about how it actually works. He built it, and he explains it better than I do.

Nothing to do today. I just did not want the first thing you heard from us in months to be a pitch.

Joy
Co-founder, Caspr

---

**S2 variant** — replace paragraph two:

> You signed up in [month], ran one analysis, and never came back. I have thought about that more than you would expect. Either it was not good enough or it was not obvious what to do next — and both were on us.

**Copy notes** · No CTA at all, deliberately. The only job is to buy the second open, and a first email after months of silence that asks for something spends credibility it has not earned. *"For a long time you were most of the evidence we had"* is true, specific, and cannot be said by a marketing team. **Traceable:** the silence, the rebuild and the pricing change are all documented in `gtm-strategy.md` §1 and `pricing-model.md`.

---

### Email 2 · Day 4 · Jayant · **How it works now**

```
Subject:  How it works now
Preview:  Written by the person who built it.
```

[First name],

Joy asked me to explain what changed. I will keep it to what I would want to know.

**The sources.** We went from about a million to **25 million** curated sources — licensed databases, government records, filings, trade press, primary research. Not the open web. The point was never volume, it was what is behind a paywall that a general model cannot reach.

**How it reasons.** Caspr reads what is credible, works out what the sources disagree on, and reaches a conclusion. When two sources give different numbers, it does not average them and move on — it decides, and shows you which it used.

**Where the data runs out.** This is the part I am most pleased with. Where there is no reliable data, Caspr does not fill the gap with a confident sentence. It reasons the way an analyst does, and shows you it did that.

**Language.** It writes natively in your working language. Not English translated afterwards.

**Your data.** Never used to train anything. ISO 27001:2022 certified. Our SOC 2 Type I audit is in progress.

If any of that is interesting and you want more detail, reply — I read these myself.

Jayant
Co-founder & CTO, Caspr

---

**Copy notes** · This is the credibility email and **marketing must not write it.** The register is an engineer explaining his own work to a peer — declarative, specific, unembellished. *"The part I am most pleased with"* is the only warm phrase in it, and it lands on the thing that actually differentiates. Note what is absent: no competitor named, nothing sold, no CTA but a reply. **Traceable:** all five claims sit in `site-truth.md` §6 and §7 and `security-posture.md`. **"SOC 2 Type I audit in progress"** is the only permitted phrasing.

---

### Email 3 · Day 9 · Joy · **The grant** — the only hard CTA in the sequence

```
Subject:  Something for the people who were here first
Preview:  $150 in analysis. No card.
```

[First name],

The rebuilt Caspr is live.

You signed up before there was much to sign up for, so: **$150 in analysis, on us. No card, nothing to cancel.** It runs for 60 days.

[Legacy balance line — see §4]

If it helps, here is a prompt worth trying:

> *"[Segment-matched prompt]"*

Paste it, answer the two questions it asks you, and step away. What comes back is a structured, sourced analysis — not a summary, and not a draft you have to finish.

[Start with $150 →](https://caspr.ai/?utm_source=email&utm_medium=founders&utm_campaign=reengagement&icp_hint=general)

Joy

*P.S. If none of the example prompts are close to your work, reply with what you are actually trying to figure out and I will write you one.*

---

**Segment-matched prompts:**

| | |
|---|---|
| **S1 — corporate domain** | *"Competitive landscape and market dynamics in [their sector]."* |
| **S1 — unknown domain** | *"Market size, competition and outlook for [a sector you work in]."* |
| **S2** | *"[Same shape as their first analysis, one level deeper.]"* |

**Copy notes** · The offer sits in the second line, not buried in a P.S. — this is the transactional email and pretending otherwise wastes it. *"Nothing to cancel"* pre-answers the reflex objection without naming it. The P.S. is kept from the May draft because a personal prompt-writing offer is the highest-response element in the original and it captures intent data as a by-product. **Cost is the third act:** $150 is a gift, not a price, and no price appears anywhere in the email.

---

### Email 4 · Day 15 · Joy · **What it does now** — shown, not described

```
Subject:  Five things it does that it could not do before
Preview:  Real output, not a feature list.
```

[First name],

Rather than list what changed, here is the work itself.

**Market research** — landscape, sizing, competitive dynamics.
**Investment and deal** — a first screen through to full diligence.
**Business cases** — board papers, strategic options, sales decks.
**Deal sourcing** — acquisition targets and investable sectors.
**Research synthesis** — regulation and evidence, read into one view.

Three real reports, start to finish, nothing removed except client names:

[See three real analyses →](https://caspr.ai/samples?utm_source=email&utm_medium=founders&utm_campaign=reengagement)

They are long. That is the point — every number in them has a source behind it, and it is there the moment anyone asks.

Your $150 is still open for [n] days.

Joy

---

**Copy notes** · The five types come from `document-taxonomy.md` and match the five Type cards in the product, so the email teaches the interface without explaining it. **This email is why `/samples` is a precondition** — sending it to a "coming soon" page is worse than not sending it. *"It is there the moment anyone asks"* is the citation framed as readiness, never as a task for the reader. **Deliberately no tier names** — *Brief*, *Study* and *Intelligence* mean nothing to someone who has not seen the product.

---

### Email 5 · Day 21 · Joy and Jayant · **The asks** — behaviour-gated

**Sends only to S3, S4, and anyone from S1 or S2 who ran an analysis during the sequence.** Everyone else exits here.

```
Subject:  Three things, and then we will leave you alone
Preview:  You came back. That is worth asking about.
```

[First name],

You have run [n] analyses since we wrote. Thank you — genuinely. Three things, and then this sequence ends.

**Tell us what is wrong with it.** Twenty minutes, either of us, whenever suits. We would rather hear the sharp version. [Book time →]

**Would you say so publicly?** If it has been useful, a few sentences with your name and title would matter more to us than anything we could write ourselves. We will send you the questions first.

**Do you know a team that should see this?** Introduce us and we will credit **$100 to your account** for anyone who runs their first analysis. If there is a company where this belongs rather than a person, tell us and one of us will take it from there.

That is everything. Thank you for coming back.

Joy and Jayant

---

**Copy notes** · Three asks in ascending order of cost to them, each one earned by the preceding email rather than by the relationship. *"We would rather hear the sharp version"* signals the feedback is real. The referral credit is a stated number because a vague *"we'll look after you"* reads as evasion. **The enterprise ask is deliberately soft** — *"tell us and one of us will take it from there"* removes the work from them, which is the whole point of an intro. **Never send this to a dormant user**; the ask is the reward for returning, not a substitute for it.

---

## 6 · What is kept and departed from the May draft

| | May Sequence B | Here | Why |
|---|---|---|---|
| Senders | Joy only | **Joy and Jayant, alternating** | Jayant's builder voice is the credibility asset the GTM has no other source for, and it is entirely unused |
| Length | 3 emails, 12 days | **5 emails, 21 days** | Joy: one email cannot carry rebuild, capability, offer and ask |
| Opening | Use-case education | **What we have been doing** | They already know what it does. What they do not know is why we went quiet |
| Segmentation | None | **S0–S4** | The message to someone who ran eight analyses is not the message to someone who bounced at the upload modal |
| Asks | None | **Feedback, testimonial, referral, enterprise — gated on return** | Joy's brief |
| *"Your competitors are still waiting for the research"* | Closer on Email A | **Cut** | Retired 2026-08-20. Speed-led and combative |
| *"Two minutes of your time"* | Throughout | **Cut** | Demoted to supporting; no longer a lead message |
| *"Reply and I'll write you a prompt"* | Email A | **Kept** | Highest-response element in the original, and it captures intent data |
| *"Do not use 'just signed up' framing"* | Instruction | **Kept and extended** | It was right, and it now shapes the whole sequence |

---

## 7 · Operations

**Sending domain.** A subdomain separate from transactional mail. Marketing complaints must never reach the identity that carries password resets and "your report is ready."

**Warming.** ~100–150/day, ramping over two to three weeks before the first real send. At 1,600 addresses across five emails, plan the calendar around this rather than around the copy. **Longest lead time in the project.**

**Required for bulk sending:** SPF, DKIM, DMARC, one-click `List-Unsubscribe`, complaint rate held under 0.3%.

**Reply handling.** Emails 1, 2, 3 and 5 all invite a reply. Both founders read them. **A founder email that bounces replies into an unmonitored inbox is worse than no founder email** — check this before the first send, not after.

**Exit conditions.** S1 and S2 exit on running an analysis and move to Email 5's audience. Everyone exits on unsubscribe. Suppression is enforced automatically on every send.

**Send times.** Tuesday to Thursday, 08:00 in the recipient's timezone where known, otherwise 08:00 GMT.

---

## 8 · What to measure

Tagged `utm_campaign=reengagement`, read through the funnel in [`tracking-spec.md`](tracking-spec.md).

| Metric | Watch for |
|---|---|
| Open rate by email | Email 1 sets the ceiling. Under 25% means deliverability, not copy |
| Reply rate, Emails 1 and 2 | The honest signal on whether the founder voice is working |
| **Activation — signup → first analysis** | The number the whole GTM is gated on |
| Founding-member credit redemption | Tagged separately from the standard trial |
| Conversion to a paid budget | The commercial outcome |
| Complaint rate | Above 0.1%, investigate before the next send |
| Testimonials, referrals, enterprise intros | Email 5 only |

**The honest baseline.** These addresses have been cold for months, signed up for a different product, and mostly never activated. Modelled at 45–90 paid users in `gtm-strategy.md` §3; **realistic is lower.** It remains the cheapest list available and the single highest-RoI action in the plan — but it fires once, and every precondition in §2 exists to stop it being spent on a half-ready funnel.
