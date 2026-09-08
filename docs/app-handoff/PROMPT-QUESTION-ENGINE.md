# Prompt — the relationship engine

*(Supersedes the first draft of this file, which scoped it as a "question
engine". That was too small. Joy's reframing, 2026-08-18, is below.)*

**Paste this into the session that will design it.** Product and content design
first; the engineering shape is at the end.

---

## The reframe

> *"This is the kind of conversation I used to have with a client while the team
> was working, over a coffee in their office, during my days as a McKinsey
> consultant. To get to know them, as a professional."* — Joy

The waiting time is not dead space to fill. It is **the only recurring moment
where Caspr has the user's attention and is not competing with the work
product.** Every other screen is about the report. This one is about them.

That reframes the whole thing. It is not a survey that harvests profile data
between runs. It is a **relationship layer** with two standing objectives:

1. **Know the user professionally** — so every future analysis is sharper.
2. **Teach them the product** — what it can already do, and what has just
   shipped.

And it has one quality bar, which is the useful test for every decision below:

> **Would a good consultant say this, to this person, at this moment?**

A consultant who asked the same question twice, pitched a feature at the wrong
moment, or filled every silence with chatter would lose the room. So fatigue,
timing and restraint are not polish here — they are the product.

**Silence is a legitimate output.** When there is nothing worth saying, the
engine says nothing. Design for that case explicitly; it will be common.

## Reconciling the consultant framing with the brand voice

Flagged by Joy, and worth being precise about, because the two could pull apart.

**They operate on different axes.** The consultant framing sets *what the moment
is* — a professional getting to know a client while the work runs. The brand
persona sets *how Caspr sounds* — the Trusted Senior Analyst: precise,
authoritative, dry, never wastes a word, never over-explains, trusts the
reader's intelligence.

The failure mode is drift from "consultant" into "chatty", which would collide
head-on with *"not a helpful colleague"*.

- **In character:** *"Who is this for — you, or a committee?"* Short, useful,
  the answer changes the work.
- **Out of character:** *"Hi! Hope your week's going well. Mind if I ask a
  couple of quick questions?"* Warm, wasteful, and not who Caspr is.

The register does not soften because the subject is the user. A senior analyst
asking about your remit is still a senior analyst.

## It must earn the interruption

Joy: *"these people are busy and everything needs to add value."*

Two consequences that shape the engine rather than decorate it:

**1. It responds to engagement.** The system reads whether the user is actually
engaging — answering, ignoring, dismissing — and adjusts. Someone who answers
gets more; someone who ignores twice gets left alone, and the engine does not
treat that as a failure to retry harder. This is a feedback loop, not a fixed
cadence, and it needs designing as one.

**2. It must not feel like a survey.** The test is whether the exchange reads as
someone intelligent genuinely getting to know them, or as a form. Volume is not
the enemy — *low-value* volume is. One question that changes the next analysis
beats three that populate a database.

## Not everything is a card

Joy: some items are square cards; some are **inline conversation**.

The card is right for a discrete choice with options — the Research Profile's
four types. It is wrong for a remark, a single observation, or a one-line
insight, where a card puts a heavy frame around something light.

So the engine chooses a **presentation** as well as a content item:

| Form | Fits |
|---|---|
| Card | A discrete question with options, a poll, a rating |
| Inline | An observation, an early insight, a short question expecting free text, a product note |

This does **not** breach the boundary. Inline conversation here is the product
speaking about the user or the product, in the window where Caspr is working —
which is exactly the space the boundary reserves for it.

---

## Three content streams, not one

The first draft only had the first of these.

### 1. ASK — build the research profile

Questions whose answers become **memories**, and memories tune every future
analysis. Mixed model:

- **A small fixed bank** — the things worth knowing about everyone: role,
  seniority, industry focus, who the output is for, the decision it feeds,
  geography, preferred depth.
- **The rest generated from history** — what they have analysed, refined,
  exported, returned to, asked about.

Ruthless test: *a question whose answer changes nothing should not be asked.*

### 2. TELL — educate about the product

What the user can do that they are not doing, and what has just launched.
Examples: what happens after a report is generated, Updates, Insights,
Intelligence depth, editing, the Data Room, exports.

Two hard requirements:

- **It must pull from product updates automatically.** A hand-maintained list
  will be stale within a month and nobody will notice. This needs a **registry**
  the engine reads — see *Auto-sourcing* below.
- **It must stop.** Once a user knows a feature — has seen it, or better, used
  it — that item retires for them. An engine that keeps explaining Insights to
  someone who uses Insights weekly is the consultant who does not listen.

### 3. SHOW — early insights from the running analysis

**This stream already exists and is the strongest content the engine has.** The
API emits `early_finding` — `{ stat, label, section_id }`, `stat` ≤12 characters
so it can headline — as sections finalise, and the client controls the display
cadence. It is already implemented in the reference service and accumulated in
the client's flow state.

It is the strongest because it is the only content that is about **the thing the
user is paying for, right now**. *"31% — of EU charge points are in three
countries"* while their EV study runs beats any question about their job title.

Design implications:
- When an early finding is available, it should probably win over ASK and TELL.
  Decide the precedence explicitly.
- **Findings are provisional.** They arrive before the section completes. Decide
  what happens if the final report revises one — and put the question to Jayant:
  *can an early finding ever be contradicted by the finished report?*
- No frame draws this yet. It needs one.

---

## The mix changes over the relationship

This is the part the first draft missed entirely. The ratio is not fixed — it
shifts as the user matures:

| Stage | Weighted toward |
|---|---|
| First run | Orientation. What is about to happen, what they will get |
| Early runs | ASK — the fixed bank, filling the profile while it is empty |
| Established | SHOW — insights from their own analyses; TELL when something ships |
| Power user | Mostly SHOW. ASK only for genuine gaps. TELL only for genuinely new |

Design questions:
- What defines the stage — run count, days active, profile completeness, or a
  mix?
- What wins when two streams are eligible in the same moment?
- Does the wait length change the choice? A 3–5s Learning pause and a
  multi-minute Generation wait are not the same opportunity.

---

## Auto-sourcing — the registry requirement

Joy: *"the engine should automatically pull from the updates that happen on the
product and not something we need to keep updating."*

Taken seriously, this is an architectural requirement, not a content one. It
needs a **product-update registry** that ships with each release, carrying per
item:

- What shipped, in one line, in Caspr voice.
- **Who it is relevant to** — tier, plan, behaviour, profile attributes.
  Without targeting, "automatic" becomes "show everyone everything."
- What counts as the user having *learned* it — seen it N times, or used the
  feature.
- Whether it expires. A feature announced eight months ago is not news.

Design question: does this registry live in the repo alongside the release, or
in a service the product reads? The repo makes it part of shipping — you cannot
launch a feature without writing its line — which is the property worth having.

---

## LinkedIn

Joy: connect the user's LinkedIn so the engine can surface items relevant to
their profile, and track job changes and work anniversaries.

What it buys:
- **The fixed question bank largely answers itself.** Role, seniority, industry,
  company — no need to ask what we can read, which is the best kind of question:
  the one never asked.
- **Change signals.** A job change is the single highest-value moment in this
  relationship: new company, new remit, new research needs. A consultant would
  absolutely notice.
- **Work anniversaries** as a light touchpoint.

What it needs, and none of it is optional:
- **Explicit consent**, with the scope stated plainly and a visible disconnect.
- **A narrow scope** — read the professional profile, nothing more.
- **A stated retention position.** What we keep, for how long, and what happens
  on disconnect.
- **It must be skippable forever.** A user who declines should not be asked
  repeatedly, and should lose nothing but convenience.

---

## The line: professional, not personal

Joy: *"To get to know them, as a professional (personal life is strictly off
limits)."*

Worth drawing precisely, because the list includes one item that sits on the
line:

- **Clearly professional** — role, industry, seniority, employer, job change,
  work anniversary, what they research, who they report to.
- **Clearly off limits** — family, health, politics, anything not on a business
  card.
- **On the line — birthdays.** LinkedIn surfaces them, and a consultant who
  wished a client happy birthday would not be out of order. But it is the first
  item on the list that is about the person rather than the professional, and
  once crossed the line is harder to hold. **Recommend: work anniversaries and
  job changes yes, birthdays no** — and if Joy wants birthdays, make it a
  deliberate, separately-consented choice rather than something that arrives
  with the LinkedIn scope.

---

## The boundary (unchanged, and it constrains all three streams)

The product **narrates machine state** and **speaks about the user and the
product**. It never answers on Caspr's behalf about the analysis.

- ASK and TELL are about the user and the product. In bounds.
- SHOW is engine output rendered verbatim. In bounds.
- **Banned:** *"Noted — I'll weight competitive dynamics and deal risk in the
  read."* The product does not run the analysis and cannot commit it to
  anything.

The acknowledgement pattern still has to be solved: confirm an answer landed
without claiming what the engine will do with it. Candidates:

- *"Noted."* — honest, cold.
- *"Filed: runs diligence on live deals."* — states what actually happened, a
  memory was created. **Current preference.**
- *"That will sharpen future scoping."* — true, and about the profile rather
  than this analysis.
- Silence — the answer appears in the transcript and the question clears.

Whichever wins must survive being read on the fifth run.

---

## What already exists (do not redesign)

**Research Profile** (`2195:2927`, built) — the question-card system, with four
working types: single-select, distribution bars (derived, read-only), star
rating, numeric recall. Header `SHARPEN YOUR PROFILE` / *"Answer any — each
becomes a memory below, tuning every analysis."* Answers land in the **Memories**
list, each removable, each a plain sentence.

**Early findings** — `early_finding` in the contract, emitted by the reference
service, accumulated in flow state. Display slot undrawn.

**The four surfaces:**

| Surface | Wait | Space |
|---|---|---|
| Layout Canvas — Learning (`2138:4416`) | 3–5s | pane, brief |
| Theater — engagement carousel (`763:77`) | ~30s | pane, 2×2 grid |
| Generation transcript (`1527:2`) | minutes | pane, conversational |
| Research Profile (`2195:2927`) | none — a deliberate visit | full 800 column |

The Research Profile is different in kind: the user came on purpose, so it can
ask more, and ask harder.

---

## The hard problems, named

1. **Precedence.** Three streams, one slot. What wins, and why.
2. **Fatigue across the relationship, not the run.** Someone running five
   analyses a day must not be interrupted five times.
3. **Knowing when to stop** — per item, per stream, per user.
4. **Provisional insights.** What if the report revises an early finding.
5. **Targeting without creepiness.** *"You have run three EV studies"* and
   *"Which industries do you research most?"* are the same question; one is
   uncomfortable.
6. **Silence.** Designing the empty case as a first-class outcome.
7. **Registry discipline.** Making it impossible to ship a feature without its
   line, or the automation rots.

---

## Deliverables

1. The fixed question bank — question, options, memory sentence, and what each
   memory changes.
2. The TELL registry schema, plus the first set of entries for what already
   ships.
3. Precedence and mix policy by lifecycle stage.
4. Phrasing rules with worked examples, including bad versions and why.
5. The acknowledgement pattern, decided.
6. Fatigue and stop rules.
7. LinkedIn: consent copy, scope, disconnect, retention position.
8. Frames for the early-insight slot and anything not fitting an existing card.

## Engineering shape

- **Who writes the question text?** If the API generates it, it is Caspr
  speaking and the boundary is satisfied structurally. If the product generates
  it from templates, the boundary holds only because the subject is the user —
  a rule someone must keep enforcing forever. **Prefer the API.**
- Selection needs profile + history + registry + live findings. The first two
  exist product-side; the third does not exist; the fourth arrives on the
  WebSocket.
- Answers already have a home in the Memories list.
- LinkedIn is an OAuth integration with consent storage and a disconnect path.
- **One contract question:** must an answer reach the engine before the current
  run finishes, or only tune the next one? Today's copy implies the former and
  nothing implements it. This needs deciding before the revised API contract
  goes to Jayant.

---

*Written 2026-08-18 by the dev session, after Joy's reframing: a living
relationship engine, not a question list.*
