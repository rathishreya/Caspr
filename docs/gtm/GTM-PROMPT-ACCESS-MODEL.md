# GTM prompt — the access model

*2026-08-26. Paste into the GTM execution layer session. **This changes messaging, the funnel model, and at
least four documents you own.***

**Spec:** [`docs/product/access-model.md`](../product/access-model.md). **Rules:**
[`docs/website-copy-rules.md`](../website-copy-rules.md) · `CLAUDE.md` pricing block · `CONCEPTS.md`.

---

## 1 · ⛔ Two framing rules that bind every piece of collateral

**1 · Never write a budget as a subscription price.** Not *from $200/mo*, not *$200 per month*, not
*starting at $200*. **It is money set aside to spend on your own analyses.** Write **`$200 a month of
research`**, and pair it with *"unused balance carries forward"*. Enforced as `COPY-11a`.

**⚠ 1b · And never write *"you are only charged for what you run"* — it is false.** `pricing-model` §3.1:
**`R = F + top_up`**, and **the platform fee is charged every month regardless of use.**

| $200 budget · `F` = $14 · cap = $186 | Charged |
|---|---|
| Ran nothing | **$14** |
| Ran one $80 analysis | **$94** — $80 restores the balance, plus the fee |
| Ran $175 | **$189** |

**True and usable:** *unused balance carries forward* · *each month restores only what you consumed* ·
*a quiet month costs far less than a busy one*. Enforced as `COPY-11b`.

> **⚠ This corrects a figure circulated earlier in this project.** An earlier version of this prompt said a
> $200 budget with one $80 analysis is charged ~$86. **That was wrong** — it applied the fee to the analysis
> rather than to the budget. **`plan.md` §4 and `reengagement-sequence.md` both inherited the error and have
> been corrected; check anything else drafted from them.**

**2 · Never write a depth name without its type.** `Brief · Study · Intelligence` is the **Market Research**
ladder only — Investment & Deal is `Screen · Thesis · Diligence`. Use **"the $300 depth"** for the rung across
types. `COPY-07b`.

---

## 2 · The four modes

| Mode | Budget | For |
|---|---|---|
| **Try** | none — $100 gifted, no card, 90 days · then top up | Anyone. Every depth, every output purchasable, **Ask Caspr and citations never gated** |
| **Solo** | **$200 a month of research** · ~$186 for analyses | One professional working alone |
| **Team** ⭐ | **$600 a month of research** · ~$558 for analyses | **The recommended mode.** Your own data, and colleagues who can edit |
| **Org** | **$1,800 a month, committed** · 3 seats min · ~$1,674 pooled | The organisation. SSO, API, residency — and **deployment quoted separately** |

**In published collateral the two figures travel together** — gross and available — because the app's wallet
shows the available one. **Never name the fee:** no *platform fee*, no `7%`, no `$14`. The arithmetic in §1b is
for your modelling, not for copy.

**Named for how you work, not what you spend.** *"Am I a $600 person"* has no answer; *"do I work with my own
data and with colleagues"* has an obvious one.

**`Try · Solo · Team · Org` replaces `Professional · Business · Enterprise` everywhere.**

---

## 3 · The acquisition mechanic you now have — and it is the important part

**Collaboration is the growth loop, and it works like this:**

1. An owner shares an analysis. **Viewing is free and ungated, always** — forwarding is the distribution mechanism
2. They invite a colleague to **edit**. Editing debits the **owner's** wallet, so it works immediately with no friction
3. **The colleague's own $100 trial is untouched** — it sits in their account, reserved for their own first question
4. An editor **cannot start** an analysis. The moment they have a question of their own, they are in the funnel with $100 already waiting
5. Colleague three on the same domain **fires the Org gate** at 3+ active accounts

> **The trial is no longer only a signup incentive. It travels through the work**, delivered to someone who
> arrives with a real document, a real task, and a colleague who already vouched for the product.

**That is a better first touch than any campaign can buy**, and it should be modelled as a channel rather than
a product detail.

---

## 4 · Org is a sale, not a bigger plan

Data residency, organisational boundary and deployment shape are **scoped work**, and `phase-map` already
records them as *"enterprise-procurement driven — these ship when a deal requires them."*

**So the enterprise premium sits in deployment work actually performed, not in a higher subscription for the
same product.** That is defensible in a way a 2× price multiple is not.

**⚠ And we publish the base price deliberately.** `od-10-results` §3 found **six of nine incumbent publishers
name no price publicly**, and guerrilla rung 4 is *price transparency*. **Hiding our own enterprise price would
make us the thing we are about to attack**, in front of the audience most likely to notice. Publish the base;
quote what is genuinely scoped.

---

## 5 · What this changes in documents you own

| Document | Change |
|---|---|
| **`content-approach.md`** | Tier vocabulary throughout. The collaboration loop is a new acquisition mechanic worth a section |
| **`plan.md`** | §2 funnel model — the invited-collaborator path is a route to first-touch that isn't in the channel table |
| **`channel-model.md`** | Same. It may deserve a line of its own alongside the seven existing channels |
| **`reengagement-sequence.md`** | Plan names, and the offer: an expired trial can now **top up and run one analysis** rather than facing a $200 commitment. That is a materially better re-engagement ask |
| **`operations-runbook.md`** | Plan names in any published copy |
| **`portal-build-spec.md`** · **`portal-design-spec.md`** | Plan names wherever the portal shows them |

---

## 6 · Naming, settled — do not reintroduce

| | |
|---|---|
| **~~Caspr Signals~~** | **Retired.** Folds into Insights. Never write it, never tier it, never sell watched topics |
| **The Signal** | Singular. The **opinion and sentiment layer inside a report** — Reddit, Quora, forums, sentiment. Part of what a report contains, **never a plan feature and never priced** |
| **Monthly Brief** | **Folds into Updates.** One name |
| **No page counts** | Depth is **levels of decomposition** — one, two, three. Length follows the topic |

---

## 7 · Claims that changed with the corpus

**From [`report-evaluation-2026-08.md`](../report-evaluation-2026-08.md), scored 2026-08-26:**

- ✅ **"Every source, credible" is supported and countable** — **355–678 cited claims per analysis**, human-verified
- ⚠ **"Every claim, triangulated" holds at the $80 depth and above, not at $15.** §10.4 is explicit: **do not ship the unqualified line** on the strength of this corpus
- ✅ **Currency is the easiest claim for a buyer to check themselves** — **87% of dated references are 2025–26**, against incumbent reports on sale at 15 and 25 months old
- ⚠ **"90% cheaper" is true and should not lead.** §9.4: the one comparison where price led is the one we lose

> **The line the corpus actually earns:** *the publication date is on their page, and every source is on ours.*
> Both halves checkable without trusting us — which is the only proof that works for a company with no track record.

---

## 8 · Open, and it affects your modelling

**Seats 4+ pricing** *(TBD, and it is the real revenue lever)* · **whether Insights gates and where** ·
**whether Solo and Team are tiers or presets** on a continuous $200 floor.
