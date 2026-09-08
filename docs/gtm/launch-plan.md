# The Launch Campaign

*Version 3 — 2026-08-24. A campaign with a shape: build-up, peak, and fourteen weeks that do not flatten.*

**Separate from** [`content-calendar.md`](content-calendar.md) *(the always-on cadence)* **by design.** The cadence runs from Day 1 regardless. This fires once, when the numbers say the funnel holds — and then keeps firing until `x@6`.

---

## 1 · The real risk is not the launch. It is week three after it

**Most launches are a spike, and spikes decay.** Big day, traffic, some signups, back to baseline inside 72 hours, and $7,500 of assets sit unused for the rest of the quarter. *(Joy, 2026-08-24: "a lot of people do these launches but then there is little follow through and the investment goes to waste.")*

**The obvious fix makes it worse.** Spreading the campaign evenly across fourteen weeks turns it into a drip — and a drip is indistinguishable from business-as-usual, which is exactly what a launch is supposed to escape.

**So the requirement is genuinely two-sided: sustained, and not flat.**

> **Resolution: sustained does not mean constant. It means repeated peaks.**

A campaign holds attention through a **rhythm of discrete events**, not a steady stream. The question is therefore not *"how do we keep posting"* — it is **"what legitimately produces an event every few weeks for fourteen weeks?"**

---

## 2 · The structural answer — launch a publication, not a product

**Caspr has an advantage almost no company launching has: the product manufactures the campaign's fuel.**

Every published analysis is, in one artefact: a marketing asset, a product demonstration, a press hook, a backlink magnet, and **a genuine news event** — and it costs one Study.

> **So the launch is not "a software product is now available."** It is **an analyst house has started publishing, and the research is free and fully cited.**

**This is not a repositioning. It is the position, executed.** *"Not an assistant. An analyst."* Analysts publish. A research house with a flagship publication is the most literal possible expression of the identity — and it is a far better story than a product announcement, because *a company launched software* is not a story and *someone is giving away $50,000 research, fully sourced* is.

**And it solves every part of the brief at once:**

| Requirement | How the publication meets it |
|---|---|
| **Does not flatten** | Each issue is a dated, discrete event |
| **Sustains** | The rhythm continues past `x@6` indefinitely |
| **Real engagement** | Each issue takes a position that can be argued with |
| **Affordable** | One Study per issue. Already in the calendar as Type A |
| **Un-copyable** | Competitors do not have the output |

### 2.1 The name

**Recommendation: *The Record.*** It carries *on the record*, *for the record*, *correcting the record* — press register, dry, no cleverness announced. It suits the flagship format in §4.1 and it sits in the FT/Bloomberg world the brand already occupies.

**Alternatives:** *Second Opinion* (analyst-appropriate, slightly cute) · *Caspr Findings* (safe, forgettable). **Joy's call.**

---

## 3 · The arc

### 3.1 Build-up — weeks 5–9. Publish before you announce

**No teasing.** Teasing is hype, and hype is off-register for a voice that *"arrives with the numbers done."*

> **The build-up is not a promise. It is accumulating evidence.**

Issues 1–3 publish during the video production window. **On launch day there is a body of work to point at, not a coming-soon page.** That is *"Arrive certain"* applied to the launch itself — and it inverts what every other launch does.

**Issue 1 is decided: [Caspr run on the market research industry itself](guerrilla-evaluation.md) §5.1** — approved 2026-08-24. It turns the instrument on the incumbents without a word against them, and it demonstrates the product on the one subject this audience knows well enough to judge. **It sets the publication's register from the first issue**, which is why it leads rather than waits for the peak.

**It is also a test, and that is the underrated part.** If three issues generate no argument, no inbound and no citations, **the launch premise is wrong and you have learned it for the cost of three Studies** — before committing the video budget. The build-up de-risks the peak.

### 3.2 Peak — weeks 10–12

Concentrated, one week, everything at once:

| | |
|---|---|
| **The founder video** | Hero asset |
| **The staleness index launches** — as a standing monthly feature, §4.1 | The reason to look, **and the reason to come back** |
| **Product Hunt** + **Show HN** | The one-shots |
| **Press release** | On the category |
| **Expert practitioners** | Publishing on their own credentials, same week |

**Why the peak launches a recurring feature rather than a one-off analysis.** A single strong issue gives peak attention something to read. **A standing monthly index gives it a reason to subscribe** — which converts a spike into the audience that carries the fourteen weeks after it. That is the sustain problem solved at the moment attention is highest, rather than three weeks later when it is not.

### 3.3 Sustain — weeks 13–26. Where launches die

**Four mechanics, and the important thing is that three of them are already resourced.**

| | Mechanic | New work? |
|---|---|---|
| **1** | **The rhythm.** An issue every three weeks. Anticipation is a real mechanic — people learn when to expect it | **No** — Type A is already in the calendar |
| **2** | **Response cycles.** Each issue draws counter-arguments; answering them substantively *is* the engagement, and it is founder time, not production | **No** — Joy's existing hour |
| **3** | **Staggered borrowed channels.** Podcasts at 1/month, expert practitioners publishing on a stagger rather than dumped at launch | **No** — already runbook §6 targets |
| **4** | **The video cutdowns**, released across weeks rather than dumped on launch day | **No** — same shoot |

**The sustain phase adds shape to work already planned. It does not add work.** That is what makes it credible against 2.5 hrs/week per person.

### 3.4 The second peak — around week 18–20

**A rhythm alone still decays.** One deliberate escalation, halfway through the sustain window:

> **The most ambitious issue of the series — and the audience chooses the question.**

An open call: which market should Caspr take apart next. **That converts readers into participants**, which is engagement by construction rather than by hope; it costs nothing; and **it feeds the demand pipeline directly** — the vote is itself a demand signal.

**Considered and rejected for this slot:** an original-data piece built from Caspr's own aggregated demand signal — *what business is actually asking.* Genuinely novel and un-copyable, **but at month 4–5 the underlying volume is roughly 600 signups and a few thousand prompts. That is too thin to call an index without overclaiming.** Hold it for month 6+, when it becomes the natural anniversary asset.

---

## 4 · What makes an issue an event rather than a blog post

**Four formats. They rotate, and each is inherently discussable.**

### 4.1 Correct the record — the flagship format

**Take a number everybody cites and show what it actually rests on.** That the sources disagree by 3×. That the canonical figure traces to a 2019 press release. That two credible bodies define the market differently and nobody reconciles them.

**This is journalism an analyst does, and it is the product's differentiator turned into a story.** It is inherently newsworthy, inherently arguable, and it is the single format nobody can copy without the sourcing infrastructure.

It is also *exactly* what `fact_lookup` returns — §3.1 of the API contract requires the disagreement be returned rather than resolved. **The engine's most awkward-sounding rule is the campaign's best format.**

**Its recurring form is the staleness index** — published monthly from the launch peak onwards: by sector, how old the most-cited market figure actually is, who published it, and how many sources have since simply repeated it. **Checkable, un-rebuttable, and it converts the one structural advantage we have into a standing event.** Full reasoning in [`guerrilla-evaluation.md`](guerrilla-evaluation.md) §5.2.

### 4.2 The question the room will ask

A full sector analysis, given free, on a question a board or an IC is asking right now. **Straight demonstration.**

### 4.3 The reader's question

The audience-chosen issue. §3.4.

### 4.4 What we got wrong

**Publish a correction when an issue turns out to be wrong.** Rare, and disproportionately powerful for a brand whose entire claim is defensibility. **A research house that corrects itself is more credible than one that never has to.**

**One rule across all four:** every issue **takes a position.** A summary gets read and forgotten; a conclusion gets argued with. **Argument is the engagement.**

---

## 4A · How an issue travels — designing for spread

**"Viral" is the wrong word for this audience, and using it would produce the wrong tactics.** A PE associate does not share a vendor's content with their followers. Four things happen instead, and all four are worth more than reach:

| | What actually happens | Why it matters |
|---|---|---|
| **1** | **They forward it to their MD or a colleague** | One recipient, high value, invisible to analytics |
| **2** | **They paste a chart into a deck** | The finding enters an institution |
| **3** | **They argue with it in public** | Distribution, and proof it was read |
| **4** | **They cite it in their own work** | The most durable outcome available |

> **All four run on one mechanism: sharing it has to make the sharer look good.** Professional standing is the currency here. So the design question is not *"how do we get shared"* — it is **"what would make an analyst look sharper for having sent this to their MD?"**

**The answer is narrow: a finding their peers do not have, about a number their MD is about to ask them for.** That is the whole brief.

### 4A.1 The unit that travels is the finding, not the issue

A hundred-page analysis does not move. **One chart with a source line does.**

So every issue produces, deliberately and as a named deliverable, **one atom**: a single chart or number that stands alone, is legible in two seconds, carries its own source, and needs no context from the issue it came from.

**And here the product's discipline pays off in a way nothing else does.** Every Caspr figure carries its source — that is the whole standard. **Which means our attribution travels attached to the artefact.** A chart pasted into someone else's deck arrives with its provenance printed on it.

> **The citation line is the distribution mechanism.** Nobody else's chart carries provenance, so nobody else's chart tells the third reader where it came from.

**The tension to hold:** the more we brand it, the less it travels, because nobody forwards something that makes them look like they are doing our marketing. **The resolution is minimal branding and compulsory attribution** — the source line does the work a logo would do, and it is welcome where a logo would not be.

### 4A.2 Make it personal — the index is per sector, not per issue

A general staleness index is interesting. **"Here is yours" is shareable.**

Publishing per sector multiplies the sharing surface by the number of sectors: consumer people share the consumer row, healthcare people share theirs. Each row is a specific, checkable, faintly embarrassing fact about a number that reader has personally repeated.

**And it already has a home.** Every `/market-size/*` page can carry the staleness of the incumbent figure for that sector — so the index is not a monthly post, it is a **permanent, per-sector, linkable surface** that the monthly issue summarises.

### 4A.3 Credit for contribution — the strongest mechanic on this list

**If a reader adds something we did not have — a correction, a better source, knowledge no publication holds — we name them in the next issue.**

In this audience, professional credit is worth more than money, and it is free to give. It does four things at once:

- **It makes being corrected an asset** rather than a liability — and format 4.4, *what we got wrong*, becomes a feature instead of an embarrassment
- **It builds a contributor community** around the publication, which is a moat nothing else on this list produces
- **Being cited in The Record is itself shareable** — the contributor distributes it for us, for reasons entirely their own
- **It is unarguable proof of the standard.** A research house that publicly corrects itself, with attribution, is making a claim no competitor can cheaply copy

**This is the mechanic that turns a publication into an institution**, and it costs nothing but the willingness to be wrong in public.

#### And if nobody finds a mistake?

*Joy, 2026-08-24. A fair challenge: the mechanic as first written depends on us being wrong, which is a poor thing to depend on.*

**Three answers, and the first is a correction to the design.**

**1 · The invitation is wrong. It should not ask for errors.**

*"Tell us if we got it wrong"* has a narrow surface and it fires only when we fail. **The wider invitation is: tell us what we could not see.**

| What a reader can contribute | Requires us to be wrong? |
|---|---|
| A factual correction | Yes |
| **A better or more recent source** | **No** |
| **Local knowledge no published source contains** — *"true nationally, not in our segment"* | **No** |
| **An alternative we did not weigh** | **No** |
| **Disagreement with the conclusion, not the facts** | **No** |

**Four of the five need us to be right, not wrong.** A practitioner inside a category always knows something no publication contains — and being asked for it, by name, in a publication that will credit them, is a genuinely attractive offer. **Rename the mechanic accordingly: credit for contribution.**

**2 · Be arguable by taking positions, not by making errors.**

*"The market is $4.2bn"* is either right or wrong, and if it is right there is nothing to say. **"The market is $4.2bn — roughly 40% below the figure everyone repeats, and here is why the consensus number does not hold"** is contestable whether or not it is correct.

> **The argument is never about our accuracy. It is about our judgement.** A measurement can be right and boring. A conclusion is arguable even when it is sound.

This is already the rule in §4 — *every issue takes a position* — and this is why it is load-bearing rather than stylistic.

**3 · Unchallenged is publishable, and it is a stronger claim than a testimonial.**

If we invite correction in public and nothing material comes back, **that fact is the asset**: *"We published our working in March and asked to be corrected. Here is everything that came back, and here is what we changed."*

**No competitor can make that claim, because none of them asked.** Silence only becomes evidence if the question was put publicly first.

#### The trap in this, and how to avoid it

**No corrections is not proof we are right. It is equally consistent with nobody having read it** — and the difference matters enormously.

**The distinguishing signal is the rest of §5.** If forwards, citations, coverage requests and public argument are present and corrections are not, we are right and it is worth saying. **If none of them are present, we are not unchallenged — we are unread**, and the correct response is to fix distribution, not to publish a claim about rigour.

**Never report an absence of corrections without reporting the engagement alongside it.**

### 4A.4 The same-day response — the structural advantage, made visible

**When something material happens in a sector, publish the full cited analysis while the news cycle is still live.**

Nobody else can. A syndicated publisher's cycle is measured in months; ours is measured in hours. **This is not commentary on the news — it is the analysis, complete and sourced, on the day.** The demonstration and the story are the same object.

**Gated, and the gate matters:** only sectors where our sourcing is strong. **A rushed analysis that is wrong costs more than every fast one gains**, and the audience that would notice is exactly the audience we want.

### 4A.5 Invite the rebuttal, in writing

Every issue that takes a contestable position ends the same way: **here is our working; if we have this wrong, tell us and we will publish that.**

Argument is distribution. And an invitation to disagree, honoured in public, is the cheapest credibility available to a company nobody has heard of.

### 4A.6 What we will not do

| | Ruled out |
|---|---|
| **1** | **Asking to be shared.** *"Please share"* converts a reader into an unpaid distributor and reads as such |
| **2** | **Engagement bait** — polls with no purpose, "thoughts?", manufactured controversy. This audience recognises it instantly |
| **3** | **Coordinated amplification.** Already ruled out for LinkedIn and Product Hunt; the same rule holds here |
| **4** | **Gating anything.** A gate stops a forward dead — and the forward is the entire mechanism |

### 4A.7 The honest ceiling

**B2B research does not go viral in the consumer sense, and planning as though it might would be the mistake.**

**A successful issue looks like this:** a few hundred forwards inside firms that we will never see; twenty to fifty substantive public comments; two or three trade or newsletter pickups; a handful of coverage requests; and one or two people citing it in their own work.

**That is a good outcome, and it compounds** — because each of those is a person who will read the next one. **Planning for a spike would produce tactics that spend the brand for one week of attention.**

---

## 5 · Real engagement — defining it so it cannot be faked

*Joy: "real engagement — otherwise there is no point."*

**What does not count:** impressions, likes, reach, follower growth, PH upvote count.

**What counts:**

| | Signal |
|---|---|
| **1** | **Someone argues with a conclusion in public.** The strongest signal available — it means the work was read and taken seriously |
| **2** | **Requests for coverage** — *"do this for my sector."* Demand, volunteered |
| **3** | **A practitioner cites an issue** in their own work |
| **4** | **Inbound from a journalist or an analyst** |
| **5** | **Subscriptions to the publication** — §6 |

**Tracked weekly, reported at the Wednesday review.** If issues 1–3 in the build-up produce none of these, §3.1 says the premise is wrong — **and that is a finding, not a failure.**

---

## 6 · The owned-channel play — the asset that survives a weak `x`

**The publication builds an email list that is not a signup list.**

People who will not create an account for a product **will subscribe to research.** That is a different, larger, earlier-funnel audience — and it is the one asset from this campaign that keeps compounding even if `x@6` comes in under 2.

- **The issues stay public and ungated.** Gating contradicts the offer and kills the backlink value
- **The subscription is to be *told*, not to gain access.** No dark patterns, no "unlock"
- **It is the conversion target for borrowed and rented attention** — Product Hunt, Show HN and press traffic that will not sign up today can still subscribe

---

## 7 · If the week-4 gate fails

**The campaign does not fire. The publication still does.**

Issues 1–3 have already published by then and cost three Studies. **The rhythm continues as part of the ordinary cadence**, the video is not commissioned, and the one-shots stay unspent — which is the entire point of holding them.

**A launch you can decline to fire is the only kind worth preparing.**

---

## 8 · Budget

*Video marked to the lower end of the range (Joy, 2026-08-24).*

| | Cost | Note |
|---|---|---|
| **Founder video — production** | **$4,000–6,000** | Freelance DP, sound, editor, colourist. **Three quotes before commitment** |
| Cutdowns — 6–8 shorts | $500 | **Specify in the shot list.** Cheap at the shoot, expensive afterwards |
| PH asset pack — gallery, GIF, thumbnail | $0 | In-house |
| Press release + distribution | $500 | Self-service wire; targeted outreach is founder time |
| Launch paid burst | $1,500 | Google Search, above the ongoing $1,000/mo |
| Contingency — 15% | $1,000 | |
| **Total** | **~$7,500–9,500** | One-time |

**The publication itself costs 4–5 Studies over the window — $320–400 at list.** The cheapest part of the campaign is the part that carries it.

### 8.1 Where the quality comes from, and it is free

**The largest quality lever on this video is not the camera, the crew or the grade. It is whether the analysis on screen is genuinely impressive.**

A founder walking through a hard question with conflicting sources and a defensible conclusion looks like nothing else in the category, shot competently. **A generic explainer shot beautifully still looks like every AI product video ever made.** Put the preparation into the analysis; put the money into edit and sound, which separate professional from amateur far more reliably than resolution does.

**Gated separately:** influencers and paid *scale* are not in this budget. They are spend, spend is what `x` governs, and they open on `x@6 > 2`.

---

## 9 · Timing — set by lead time, not by preference

> **A week-4 gate does not produce a week-5 launch. It produces a week-4 *decision*.**

| | |
|---|---|
| **Day 1** | Cadence starts. **No announcement.** Script and shot list drafted — free, and takes a week off the critical path |
| **Weeks 1–4** | Funnel finds its level |
| **Week 4** | **Gate read. Go / no-go on the spend.** This is the real decision; everything after is execution |
| **Weeks 5–9** | Video production, 4–5 weeks. **Issues 1–3 publish** — the build-up |
| **Weeks 9–10** | PH assets, press, mobilisation briefing |
| **Weeks 10–12** | **Peak** |
| **Weeks 13–26** | **Sustain.** Rhythm, response cycles, second peak ~18–20 |
| **Month 6** | `x@6`. Influencers and paid scale open if > 2 |

**If the gate is ambiguous at week 4, re-read at week 6 and the launch moves to month 4.** Worth agreeing now what *ambiguous* means, so it is not argued about in the moment.

---

## 10 · Product Hunt — the correction

**I called it free. True in cash, false in every other sense.** The gap between top-five and falling flat is almost entirely **pre-mobilised distribution**, and ~100 people at EZ is an asset most launches do not have.

**But the brief has to be right, because the obvious version is against the rules and gets penalised.**

| Against PH's rules | Legitimate, and standard |
|---|---|
| Soliciting upvotes, incentivising them, coordinated vote rings. **Products get downranked or removed** — the exact failure this exists to prevent | Telling your network the launch is live, giving them the link, letting them decide |

**One sentence in the brief:** *"We are live today, here is the link"* — never *"please upvote."*

**And the tactical point matters more than the rule.** Ranking weights engagement, not raw votes, and accounts created that morning carry little weight:

> **Thirty people with real, aged accounts leaving substantive comments beat a hundred new accounts clicking upvote.**

**The runbook already applies this rule to LinkedIn** — *no coordinated applause; a comment adds a fact, a number, a counter-example.* Five identical "great product" comments read as astroturf to precisely the audience most likely to notice.

**The mobilisation:** two weeks out, find who genuinely holds an aged account — **that number, not 100, is the mobilisation.** One week out, brief the link, the timing, the one-sentence rule, and what a substantive comment looks like. **No script.** Concentrate the real accounts in the first hour. **Everyone else gets sent to the product, not the listing** — a signup is worth more than a discounted vote. No hunter needed; self-launching is normal.

---

## 11 · Open

| | |
|---|---|
| **1** | **The name.** *The Record* recommended. §2.1 |
| **2** | **Three video quotes.** $4–6k is the marked range; it needs real numbers |
| **3** | **How many people genuinely hold aged Product Hunt accounts?** §10 |
| **4** | **Who fronts Show HN** — the engineering argument, Jayant's lane not Joy's |
| **5** | **What "ambiguous" means at the week-4 gate**, agreed in advance |
| **6** | ~~Issue 1's question~~ — **decided: the market research industry, analysed by Caspr.** Joy commissions it; it lands week 3, a week before the funnel gate, so its engagement is evidence going *into* that decision | ✅ |
