# Content Engine — Decisions Record

*2026-09-10. Every open question, taken. Basis stated. Reversible by Joy at any point.*

**Twenty-seven questions were accumulating across four documents.** A spec full of open questions is a spec
nobody can build against — so each is now a **decision that runs**, not a question that waits.

> **⛔ Nothing here overrides anything Joy specified.** Where Joy has stated a position, it is adopted, not
> re-decided. These are the gaps *between* Joy's decisions, and they are marked by basis so any of them can be
> overturned in one line.

---

## 0 · How each one was decided — four tests, in order

| | Test | Meaning |
|---|---|---|
| **1** | **Is it already decided somewhere?** | Several "open" questions had answers sitting in another file. Those are adopted, not re-argued |
| **2** | **Which way does the asymmetry point?** | Where being wrong costs more in one direction than the other, take the cheap-to-reverse side. A held post costs a day; a published breach costs a brand |
| **3** | **Does it protect the position?** | Caspr sells *cited, or it does not ship*. A decision that makes the engine faster but the position weaker is not a trade, it is a loss |
| **4** | **Can it be reversed in one line?** | Prefer the option that is a config change over the option that is a rebuild |

**Marked `⚑` where the basis is my judgement rather than a citation** — `CLAUDE.md` Rule 5.5: traceable, or
flagged as invented.

---

## 1 · The decisions

### Already answered elsewhere — adopted, not re-decided

| # | Question | **Decision** | Basis |
|---|---|---|---|
| **1** | The watchlist | **Closed.** ㉓ Source Register, plus Google demand surfaces | `operating-model` ㉓ |
| **7** | Outreach draft split | **Guest posts + directories → SEO. Podcasts + community threads → Content & Social** | **`portal-design-spec.md` §5 already records this** — it was never actually open |
| **10** | Index engine overlap with ④⑤ | **No overlap. The boundary is written** — nothing needing review may be routed to an engine that has none | `index-engine-runtime-spec` §7 |
| **5** | Atom chart route | **(a) `propose_visuals`** | Built, conformance-tested, returns chart data from the section's own data — **the only route that can be source-stamped truthfully.** Joy's own recommendation |

### Decided on asymmetry — the cheap-to-reverse side

| # | Question | **Decision** | Basis |
|---|---|---|---|
| **16** | Dashboard 3 bands or 4 | **Four. Funnel renders "not collected" until the stream is live** | Consistent with ⑳'s own rule. Shipping three means shipping the page without the band it exists for |
| **14a** | Truth-layer re-ingest cadence | **Hourly poll + a manual re-ingest button** ⚑ | A stale fact for an hour is tolerable; a fact table nobody can force-refresh is not |
| **14c** | Approved-but-unpublished on a fact change | **Held, regenerated, re-reviewed** | An approval is a decision about *specific text*. The regenerated body is different text, so the decision does not carry |
| **21** | Does the stale sweep reach images | **Yes — `asset_urls[]`, and the action is REGENERATE, not a text diff** | A number set in 76pt is exactly where `25M+` goes wrong and stays wrong |
| **18** | `VISUAL_OVERFLOW` as a fifth control token | **Yes** | The other four already establish that refusing is a success. A broken card the linter cannot see is worse than a missing one |
| **6** | Watermark service timing | **It ships inside the portal — same repo, same deploy, phase 3d. ㉙ fails closed until it is live** | *"Remove the dependency on my laptop being turned on."* A separately-deployed service is a dependency on somebody remembering to deploy it — §4.3 |

### Decided to protect the position

| # | Question | **Decision** | Basis |
|---|---|---|---|
| **17** | One service principal or two | **TWO. Non-negotiable** | The index engine's safety test asserts `trigger_generation` is **absent**; the content engine needs it **present**. One principal cannot satisfy both, and **the test is the safety mechanism, not a formality** |
| **23** | ㉒'s primary signal | **`utm_content` → `prompt_submitted`. Frozen for a year. Audited against `x@6`** | A reaction costs the reader nothing; a prompt costs intent. And a metric you can retune when you dislike it is not a metric |
| **22** | ㉒'s bounds | **±5 points per cycle · min 12 items across 4 weeks · floors and ceilings from calendar §4.2 · ⛔ pillar 2 never raised** | Pillar 2's cap is structural, not a quantity |
| **11** | `p` and atom travel — one instrument or two | **Two. The `p` basket is never touched** | The freeze is the metric's only defence. Atom travel is a format signal and belongs to ㉒ |
| **28** | Who is tier 4 | **ChatGPT — the only one the repo names. Nothing visible is permitted regardless — §4.5** | `/vs/chatgpt` exists, and a `/vs/` page **is** the sanctioned home for the contrast. **The register follows the pages; it never leads them** |
| **8** | Comment Desk approved | **Yes, with the guard rail** — `the_fact_to_bring` empty → the target never surfaces | Joy set the volume; the guard rail is what makes *"no coordinated applause"* mechanical |

### Decided on build cost

| # | Question | **Decision** | Basis |
|---|---|---|---|
| **19** | HTML + Chromium, or SVG templates | **HTML + headless Chromium** | The browser does text measurement and wrapping for free, and Chromium is already in the org's CI. It kills the entire `cx="582.16"` class of bug |
| **4** | Topic board — screen or interim | **Interim: a list view for the first month** ⚑ | Used once a week by one person. **Designing a screen for a ranking nobody has seen yet is designing blind** — draw it once we know what the ranking looks like |
| **2** | Automate signal 3 | **Automate the collection. Keep the discipline** | Joy: *"a logging discipline, not new work."* The Listener removes the remembering, not the judgement |
| **3** | Service principal timing | **The ask is a spec, not a conversation — §4.2.** The mock is **checked in and permanent**, not scaffolding | It is how ⑤ is regression-tested forever, and it is written before the principal arrives rather than after |
| **20** | Font licences | **Ship the files with the renderer, pinned, licence recorded** ⚑ | Both appear to be open-licence; **that is a five-minute confirmation, not a decision.** Without shipping them every card silently falls back to Georgia and Arial |
| **15** | Outreach stages · lapsed rows | **`identified → researched → drafted → sent → in conversation → won │ lost │ lapsed`. Lapsed rows render** | *"That should be a decision rather than a discovery"* |
| **14b** | `surface_forms[]` | **Generated at ingest, confirmed by a person once per fact, reused free** ⚑ | One minute per fact, once, against a recall failure that is otherwise invisible |

### Editorial

| # | Question | **Decision** | Basis |
|---|---|---|---|
| **9** | `diverges` findings — Type A or B | **Type B by default. Type A only when reconciling it *is* the analysis** ⚑ | A divergence is usually one reconciled number — that is a search answer. **Type A is 1 per 3 weeks and cannot be spent on every divergence** |
| **12** | May ⑥ emit `type: outreach` | **Yes** | Case B proved a `no_data` claim can carry a real distribution finding. **㉑ now exists to receive it — this is what makes ㉑ worth building** |
| **13** | Daily track approved | **Yes. 3 items/day. ⚑ Revised 2026-09-10: NOTHING EXPIRES** — unreviewed at 48h it **demotes** into the weekly queue | A drafted, sourced item cost real money to produce, so discarding it is waste. But a reply a week after the conversation ended is embarrassing, so it stops being a *today* item. **Demotion is both** |
| **27** | Narrative caps | **N4 journey ≤1 per 4 weeks · N5 product ≤15%** ⚑ | The two failure modes of a founder-led feed. Both reversible upward once there is data |

---

## 2 · The three that change something material

### 2.1 · Q25 — **US spelling in all customer-facing copy**

**Decision: American spelling everywhere a buyer reads. British left alone in internal documents.
⛔ Never mixed inside one artefact.**

**Why the counter-argument does not hold.** The house register is *FT / Bloomberg / The Economist* and two of
those are British — **but that argument is about tone, not orthography.** Bloomberg is American and reads
exactly as premium as the other two. **Nothing about "the most credible person in the room" requires
`organisation` over `organization`**; what it requires is precision, conclusions, and no exclamation points,
all of which survive the switch untouched.

**And the cost of not switching is real.** *Analyse* and *prioritise* read as foreign to the buyer we have
just decided to sell to — a small, constant signal that this was written for somewhere else.

**Enforced as a linter rule at ⑫**, not as a review instruction, because it is deterministic and reviewers
should not spend minutes on it.

### 2.2 · Q24 — **3 of 7, not 4** ⚑

**I proposed 4. Taking the decision, it should be 3.**

**The asymmetry decides it.** Joy's own line: *"'Great post' from five colleagues is visible astroturf, and it
costs a defensibility brand more than the reach is worth."* **The downside is the brand; the upside is
marginal reach on one post.** When the costs are that lopsided, the right number is the lower one.

**3 of 7, staggered across the 60-minute window, rotating so the same three never appear twice running.** The
other four still owe their two comments — **on external posts**, which is the half that actually buys reach we
do not already have.

### 2.3 · Q26 — **the part I cannot take, and the design that reduces it**

**I cannot commit seven people's evenings. That is theirs.** What I can do is make the ask much smaller.

> **Only the two founder posts need a live comment window. Nothing else does.**

| | Before | **After** |
|---|---|---|
| Evenings needed | 5 | **2 — Tuesday and Thursday** |
| People per evening | 7 | **3, rotating** |
| Window | 18:00–19:00 IST | unchanged |

**Everything else publishes on the US clock with no live window at all** — search answers, Company Page, X,
carousels, email. **They were never going to get a coordinated comment burst anyway**, and pretending
otherwise was what made the ask look like five evenings.

**⚑ And if even two evenings are refused, the post time does not move.** There are ~40 items a week and only
**2.5 originations** — the two founder posts are the most valuable slots in the whole engine. **Optimising
them for the team's convenience rather than the reader's attention is the wrong trade**, and the engagement
rule degrades gracefully: fewer comments in the window is a smaller boost, not a broken post.

---

## 3 · What this unblocks

**The build order now has exactly one external blocker.**

| | Was blocked on | Now |
|---|---|---|
| Phases **0, 0b, 1, 2, 2b** | — | 🟢 **Nothing. Start today** |
| Phases **3, 3b, 3c, 3d** | Q14, Q16, Q21 | 🟢 **Decided.** SES production access is a *request*, not a question — **make it day one** |
| Phase **4 ⑤ Verifier** | **Q3 — the service principal** | 🟡 **Build against the mock. The mock is the contract test** |
| Phase **5, 5b, 5c** | Q1, Q2, Q4, Q7, Q10, Q28 | 🟢 **All decided** |
| Phase **6, 6b, 6c** | Q5, Q6, Q8, Q13, Q18, Q19, Q20 | 🟢 **Decided.** ⑪ waits only on the watermark service, and it **holds images rather than blocking the build** |
| Phase **7, 7b, 8** | Q16, Q22, Q23 | 🟢 **Decided.** Needs the product event stream |

**🔴 The one real blocker: the service principal, and it must now be TWO** — one for the content engine with
`trigger_generation`, one for the index engine without it. **That is Jayant's, and it is the single ask that
gates the most.**

---

## 4 · The five I had left — taken

**⚑ Added 2026-09-10.** §3 left five things standing as *"not mine."* Four of them were **questions I had
framed as needing someone else, when the right move was to remove the need.** They are taken below.

### 4.1 · Q26 — **the engine no longer depends on a live comment window at all**

**I had this backwards.** I was asking seven people to be online at 18:00 IST **so that a machine could work**
— in a system whose entire premise is that **human minutes are the scarce resource.** That is a design smell,
not a scheduling problem.

> **Decision: the engine never depends on human synchronicity.**

| | |
|---|---|
| **Post times** | Set purely by **reader attention** — Tue/Thu 08:30 ET. Never negotiated against team convenience |
| **Comments** | **Asynchronous, 24-hour horizon.** Measured **weekly, not per post** |
| **The 30–60 minute window** | **A bonus when it happens. Never a requirement, never a rota, never a quota** |
| **What anyone must agree to** | **Nothing** |

**What this costs:** some posts get a smaller early boost. **What it buys:** the two most valuable slots in
the engine stay optimised for the reader, and **nobody has to commit an evening.** With ~40 items a week and
2.5 originations, that trade is not close.

**And it makes Joy's own rule easier to keep, not harder.** *"No coordinated applause"* is trivially satisfied
by a system that never coordinates. **3 of 7 stays as a ceiling, not a target** — nobody is assigned.

### 4.2 · Q3 — **the ask is now a ticket, not a conversation**

**Two principals, specified so it is a ten-minute task:**

| | `gtm-content-engine` | `gtm-index-engine` |
|---|---|---|
| `principal_type` | `service` | `service` |
| **Scopes** | `retrieve_analysis` · `fact_lookup` · `demand_signal` · **`trigger_generation`** | `retrieve_analysis` · `fact_lookup` · `demand_signal` — **⛔ and nothing else** |
| TTL | ≤60 min | ≤60 min |
| Credits/month | 150,000 | shares the same ceiling |
| Data Room · user history | ⛔ none | ⛔ none |

**And meanwhile nothing waits:** a **mock returning all four verdicts is checked into the repo and becomes the
permanent contract test.** It is not scaffolding to be thrown away — **it is how ⑤ is regression-tested
forever**, and it is written before the real principal arrives rather than after.

### 4.3 · Q6 — **the watermark service ships inside the portal**

**It was never a third party's timeline. Same repo, same deploy, phase 3d.**

Joy's own standing instruction settles it: ***"remove the dependency on my laptop being turned on."*** A
service that deploys separately is a dependency on somebody remembering to deploy it. **㉙ fails closed until
it is live**, so images are held rather than published unchecked — and holding images does not block the
build.

### 4.4 · **Joy's calendar — replaced with a pointer**

**Done.** `content-calendar.md` now redirects to v2 and carries a change table.

**⚠ And my earlier reason for hesitating was wrong, so it is corrected rather than left standing.** I said a
deletion here *"can propagate to Joy's Drive."* **It cannot** — this is a plain git clone of a GitHub remote
with no sync configured, and every version is in history regardless.

**The real reason for a stub over a deletion is better:** **ten files link to that path**, `CLAUDE.md` among
them. **Deleting breaks ten references; leaving the text leaves two calendars claiming to be the calendar.** A
stub does neither.

### 4.5 · Q28 — **tier 4 has exactly one member, and it was already named**

**Not invented — found.** The repo commits to naming exactly one competitor anywhere: **`/vs/chatgpt`**, which
exists as a page. **That page is the sanctioned home for the contrast**, so ChatGPT is tier 4 by the
product's own hand.

| | |
|---|---|
| **Tier 4** | **ChatGPT** — the only one the repo names |
| **The other eight `/vs/*` pages** | Exist, but **are not enumerated anywhere.** ⛔ I am not inventing eight competitor names to fill a table |
| **The rule is unchanged** | ⛔ **Nothing visible.** Being in tier 4 grants no action — it only marks who the `/vs/*` contrast may address |
| **How it grows** | **A name enters when a `/vs/` page is written, never before.** The register follows the pages; it does not lead them |

---

## 5 · What genuinely cannot be decided here

**One thing, and it is not a decision at all.**

| | |
|---|---|
| **When Jayant actually issues the two principals** | **A calendar entry in someone else's week.** §4.2 turns it into a spec that can be actioned in ten minutes, and the mock means **nothing waits for it** |

**Everything else in this document is taken.** Where a decision needed someone's agreement, the design was
changed so it needs none — §4.1 is the clearest case: an engine that never coordinates cannot produce
coordinated applause, and nobody has to promise an evening.

---

*Revised the same day: the five items §3 had left as "not mine" are taken in §4. Four of them were questions
framed as needing another person when the right move was to remove the need — most of all the engagement
window, which had a machine's schedule depending on seven humans being online in a system whose scarce
resource is human minutes. **One thing remains outside this document and it is a calendar entry, not a
decision.***

*Document: `content-engine-decisions.md` · 2026-09-10 · Twenty-seven questions, taken. Four adopted from
positions already recorded elsewhere; the rest decided on asymmetry, position, build cost or editorial
judgement, with `⚑` marking the eight where the basis is judgement rather than citation. **Every one is
reversible in a line, and none overrides anything Joy specified.** The build order now has one external
blocker: two service principals, from Jayant.*
