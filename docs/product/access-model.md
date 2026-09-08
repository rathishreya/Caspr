# The access model — modes, budgets, collaboration, Data Room

*2026-08-26. Settled in session with Joy. **Supersedes** the tier structure in `.agents/pricing-model.md` §5
and the à-la-carte mechanic in §4.3. For product, engineering and the `/pricing` copy.*

**Reads with:** `pricing-model.md` §3 *(budget mechanics)* · `document-taxonomy.md` §B *(Data Room)* ·
`security-posture.md` · `gtm-strategy.md` §11 *(the Org gate)*.

> **This is the product-side view: who can do what, and whose budget pays.**
> **`pricing-model.md` is the money-side view: what things cost and how they are charged.**
> Neither is complete alone. **`pricing-model.md` §5 must reference this file** rather than restating the
> tier table, or the two will fork — which is how the Signals and Monthly Brief collisions happened.

---

## 1 · The shape

**Two questions decide everything a user can do:**

> **Do you hold a Research Budget?** — gates product features.
> **How much have you committed?** — gates *which* product features.

**Everything else is purchasable by anyone.** Analyses, outputs, languages, custom templates. The plan never
changes what a thing costs; it changes what comes with it and how it is charged.

| | Budget | Unlocks |
|---|---|---|
| **Try** | none — top up as you go | Every depth · every output on that depth's menu, purchasable · **Ask Caspr** · citations |
| **Solo** | **$200 a month of research** | **+ editing** · Updates · collaboration *(view)* |
| **Team** ⭐ | **$600 a month of research** | **+ Data Room** · collaborative editing |
| **Org** | **$1,800 a month, committed · 3 seats min** | Pooled budget · **Org-scoped Data Room** · SSO · API · Projects · 24/7 desk · deployment quoted |

**⭐ Team is the recommended plan** — it is where a second person enters the account, and the only rung that
produces expansion.

**Named for how you work, not for what you spend.** *"Am I a $600 person"* has no answer; *"do I work with my
own data and with colleagues"* has an obvious one. **Try is a verb among nouns deliberately** — everything to
its right is a commitment and it is not.

> **⛔ Never write these as `from $200/mo`** — it is money set aside to spend on your own analyses.
> **⚠ And never write *"you are only charged for what you run"* — it is false.** `pricing-model` §3.1:
> `R = F + top_up`, and **the fee is charged every month regardless of use.** On a $200 budget: **$14 if
> nothing ran · $94 for one $80 analysis** *(the $80 top-up plus the $14 fee)*.
> **True and usable:** *unused balance carries forward* · *a quiet month costs far less than a busy one*.
> `CLAUDE.md` · `COPY-11a/b`.

### 1.1 The plan name *is* the entity — deliberately

**Org → Team(s) → User.** Rather than avoid the collision, the vocabulary leans into it: **Solo** means you
have no team · **Team** means you are one · **Org** means you contain them. The Data Room scopes reuse the
same three words — `Own · Team · Org` — so plan, entity and data scope share one set of nouns instead of
three parallel ones.

---

## 2 · Budget mechanics

| | |
|---|---|
| **One price per analysis** | **$15 · $80 · $300** by depth. **The à-la-carte $399 is retired** — with top-up available to anyone, a no-subscription price point has nothing left to do |
| **The budget is a floor, not a cap** | Set any amount from $200. **Top up mid-month at any tier** |
| **Delta recharge — self-serve only** | Unused balance carries forward; the next charge restores only what was consumed |
| **Platform fee** | 7%, flat, **internal — never named, never itemised.** The charge and the amount available are both stated; the fee is not |
| **Organisation is committed spend** | **Charged in full monthly, per seat, regardless of consumption.** Not delta-recharged. §7 |

**⚠ Why Organisation differs, stated plainly because it is easy to miss.** Under delta recharge **revenue equals
consumption plus the fee** — so a declared budget is a ceiling, not a commitment, and raising it earns nothing.
Committed spend is the only mechanism that makes a seat price real.

---

## 3 · Outputs — two constraints, and they are different

> **Depth sets the menu. Plan sets what is included from it.**

**Depth** decides what formats exist for an analysis. A **$15** Brief is a briefing note with no chart
furniture — PDF, Markdown, DOCX. **$80** and **$300** add PPTX, XLSX, CSV and infographics. *There is no
"PPTX for a Brief" question: it is not on the menu at that depth, at any plan.*

**Plan** decides what is on the house. The **first output set, in the working language of the conversation, is
included with every analysis at every level.** Everything else on the menu is purchasable: **$5** PDF · DOCX ·
XLSX · CSV · **$10** PPTX · Markdown free · additional languages per output · custom template **$1,000**.

**PAYG pays directly. Budget-holders have it deducted. That is the only difference.**

---

## 4 · What is gated, and what never is

| Never gated — any mode, including free trial |
|---|
| Running an analysis at any depth · **every citation** · **the Ask Caspr citation layer** · reading and receiving a shared analysis |

**Gating the proof would mean the free trial cannot demonstrate the thing that converts.** Ask Caspr is the
answer to the leading objection across every ICP; it stays open.

| Gated | At | Why it earns the gate |
|---|---|---|
| **Editing** | Solo | Cheap to serve. Sits low deliberately — it is the *analyst, not a document* argument, and burying it blunts the entry-point differentiator |
| **Data Room** | **Team** | **A real cost to serve** — storage, security boundary, per-file processing, the Gate-1 relevance match. And it only matters once the work involves proprietary material |
| **Collaborative editing** | **Team** | A second person in the account. This is where a team stops being one person with a card |
| **Team-scoped Data Room · SSO · API · Projects** | Organisation | Organisational identity and integration |

**Nothing is gated that costs nothing to serve.** That is deliberate: we are about to argue in public that
licence tiers on an identical document are a pricing artefact rather than a value difference, and we cannot do
the same thing.

---

## 5 · Collaboration

### 5.1 Roles

| Role | Can |
|---|---|
| **Owner** | Everything. Their budget funds the analysis and all editing on it |
| **Editor** | Refine sections, re-visualise, run follow-ups — **on the owner's analysis, from the owner's budget** |
| **Viewer** | Read · every citation · the Ask Caspr citation layer. **Free, always** |

**Viewing is never gated.** Forwarding is the distribution mechanism the whole publication strategy runs on —
*"the citation line is the distribution mechanism"* — and a forwarded analysis that cannot show its sources is
just a PDF.

### 5.2 The two pots — the growth mechanic

> **Editing on an owner's analysis always draws on the owner's wallet.**
> **A new collaborator's own $100 trial is untouched, and reserved for their own first question.**

**Why two pots rather than a shared cap.** No cap logic, no friction, and the owner's feature works the moment
they buy it. More importantly, **the new user's trial credit stays a genuine invitation** rather than being
consumed on somebody else's document — it sits in their account as a standing reason to come back with a
question of their own.

**The loop closes because an editor cannot *start* an analysis.** The moment they have their own question they
are in the funnel, with $100 already waiting.

**And it is the natural path to Organisation.** Colleague two arrives through editing. Colleague three fires the
Enterprise gate at 3+ active accounts on one domain.

### 5.3 Generation always bills the actor

Follow-ups, re-visualisation and edits **outside** an owner's analysis draw on **the actor's own** balance.
A viewer can never spend someone else's budget except through the editor role the owner granted.

---

## 6 · Data Room

### 6.1 ⚠ A name collision to resolve before build

**`document-taxonomy` §B1 already uses `public` / `private`, and it means *output eligibility*** — whether an
analysis touching the file may ever be surfaced publicly (§A.9 provenance). **It does not mean "who can see
it."** Adding a visibility scope that also uses *public* would give one word two meanings in one feature.

**Proposed: two orthogonal axes, no shared vocabulary.**

| Axis | Values | Governs |
|---|---|---|
| **Confidentiality** *(existing B1, renamed)* | **Confidential** *(default)* · **Publishable** | Whether outputs drawing on it can be surfaced publicly — `/samples`, shareable links |
| **Visibility** *(new)* | **Only me** *(default)* · **My team** · **Organisation** | Who can see the file |

**Both default to the safe direction**, per B1's own rule: *forgetting to mark it open is an inconvenience;
forgetting to mark it closed is a leak.*

### 6.2 Sharing on an analysis — explicit, per share, default deny

**Auto-sharing the files an analysis used cannot be the default.** For the primary launch ICP those files are a
data room, and inviting a colleague to edit would silently expose them.

> **On share:** *"This analysis drew on 3 files from your Data Room. Share them with [name]?"* — explicit,
> per share, **defaulting to no.**

This is the Gate-1 pattern one layer out: **selection is per act, never a standing permission** (§B2).

**What a collaborator sees for a claim sourced from an unshared file:** the claim, the source named as a private
file, **no content rendered.** They can see it *is* sourced without seeing what it is — the same position as a
consultant citing client-confidential data in a deck. The citation discipline holds; there is no hole where a
source should be.

**Provenance already covers the downstream risk.** An analysis touching a confidential file is
`includes_private` and can never reach `/samples` or a public link, whoever edits it.

### 6.3 The Organisation view

| Mode | Data Room |
|---|---|
| **Solo** | Yours. No sharing |
| **Team** | Per-analysis, per-share explicit grant |
| **Organisation** | **Scoped library** — Own · Team(s) · Organisation-wide, with role-based access |

**Organisation supports multiple teams**, so the hierarchy is Organisation → Team(s) → User, and a file's
visibility resolves against it.

**This is the upgrade trigger, and it is felt before it is argued.** Per-share grants are fine for two people
and intolerable for five. The friction that makes Team work at small scale is exactly what makes Organisation
obvious at larger scale — a better upgrade argument than SSO, because the buyer feels it before procurement
ever asks.

---

## 7 · Organisation

| | |
|---|---|
| **Minimum** | **3 seats** — matching the gate at 3+ active accounts on one domain |
| **Charging** | **Committed spend, per seat, monthly. Used or lost.** Not delta-recharged |
| **Budget** | Pooled across seats |
| **Included** | Team-scoped Data Room · SSO · API · Projects · 24/7 desk · dedicated onboarding · first custom template |
| **Quoted separately** | **Data residency · organisational boundary · deployment support · seats 4+** |

**Why publish a price at all**, when six of nine incumbent publishers do not: **we are about to attack price
opacity in public.** Hiding our own enterprise price would make us the thing we are pointing at. **Publish the
base; quote what is genuinely scoped.** The enterprise premium sits in deployment work actually performed, not
in a higher subscription for the same product.

**⚠ Two consequences that need handling elsewhere:**

- **The promise becomes tier-specific.** *"Unused balance carries forward — you are never charged for value you
  did not receive"* is on the homepage and `/pricing`, and it is **not true under committed spend.** The line
  needs scoping to self-serve.
- **`refund-policy.md` §9.1 refunds unused balance on cancellation.** That needs an Organisation carve-out. It
  is a legal document, not copy.

---

## 8 · Open

| | |
|---|---|
| **1** | **Seats 4+ pricing** — `pricing-model` §5.2 still says TBD, and it is the real revenue lever |
| **2** | **Insights** — whether it gates, and at which mode. Not yet thought through |
| **3** | **The `public` rename in §6.1** — engineering impact on an existing field |
| **4** | **Whether Solo and Team are tiers or presets.** They differ by two features and a floor; the budget itself is a continuous slider from $200 |
| **5** | **Trailing-consumption discount** — considered and **held in reserve.** A rate tied to a *declared* budget is free to game under delta recharge; one tied to trailing consumption is not, but it permanently reduces revenue per analysis. Pull only if Team underperforms |

---

*Written 2026-08-26. Naming decided this session: **Monthly Brief folds into Updates** · **Caspr Signals is
retired into Insights** · **The Signal** is the in-report sentiment layer only.*
