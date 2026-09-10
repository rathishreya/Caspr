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
| **6** | Watermark service timing | **Not a decision — a dependency.** The policy is: **㉙ fails closed** | An unreachable service returns nothing, which looks identical to clean |

### Decided to protect the position

| # | Question | **Decision** | Basis |
|---|---|---|---|
| **17** | One service principal or two | **TWO. Non-negotiable** | The index engine's safety test asserts `trigger_generation` is **absent**; the content engine needs it **present**. One principal cannot satisfy both, and **the test is the safety mechanism, not a formality** |
| **23** | ㉒'s primary signal | **`utm_content` → `prompt_submitted`. Frozen for a year. Audited against `x@6`** | A reaction costs the reader nothing; a prompt costs intent. And a metric you can retune when you dislike it is not a metric |
| **22** | ㉒'s bounds | **±5 points per cycle · min 12 items across 4 weeks · floors and ceilings from calendar §4.2 · ⛔ pillar 2 never raised** | Pillar 2's cap is structural, not a quantity |
| **11** | `p` and atom travel — one instrument or two | **Two. The `p` basket is never touched** | The freeze is the metric's only defence. Atom travel is a format signal and belongs to ㉒ |
| **28** | Who is tier 4 | **Nobody, and that is the decision** ⚑ | **An empty tier 4 is not an incomplete register — it is the policy expressed as a data structure.** We never engage them visibly, so a name would only enable the thing we banned |
| **8** | Comment Desk approved | **Yes, with the guard rail** — `the_fact_to_bring` empty → the target never surfaces | Joy set the volume; the guard rail is what makes *"no coordinated applause"* mechanical |

### Decided on build cost

| # | Question | **Decision** | Basis |
|---|---|---|---|
| **19** | HTML + Chromium, or SVG templates | **HTML + headless Chromium** | The browser does text measurement and wrapping for free, and Chromium is already in the org's CI. It kills the entire `cx="582.16"` class of bug |
| **4** | Topic board — screen or interim | **Interim: a list view for the first month** ⚑ | Used once a week by one person. **Designing a screen for a ranking nobody has seen yet is designing blind** — draw it once we know what the ranking looks like |
| **2** | Automate signal 3 | **Automate the collection. Keep the discipline** | Joy: *"a logging discipline, not new work."* The Listener removes the remembering, not the judgement |
| **3** | Service principal timing | **Not a decision.** Meanwhile: **build against a mock returning all four verdicts, and make the mock the contract test** | Unblocks phases 1–3 entirely, and the mock is reusable as the regression suite |
| **20** | Font licences | **Ship the files with the renderer, pinned, licence recorded** ⚑ | Both appear to be open-licence; **that is a five-minute confirmation, not a decision.** Without shipping them every card silently falls back to Georgia and Arial |
| **15** | Outreach stages · lapsed rows | **`identified → researched → drafted → sent → in conversation → won │ lost │ lapsed`. Lapsed rows render** | *"That should be a decision rather than a discovery"* |
| **14b** | `surface_forms[]` | **Generated at ingest, confirmed by a person once per fact, reused free** ⚑ | One minute per fact, once, against a recall failure that is otherwise invisible |

### Editorial

| # | Question | **Decision** | Basis |
|---|---|---|---|
| **9** | `diverges` findings — Type A or B | **Type B by default. Type A only when reconciling it *is* the analysis** ⚑ | A divergence is usually one reconciled number — that is a search answer. **Type A is 1 per 3 weeks and cannot be spent on every divergence** |
| **12** | May ⑥ emit `type: outreach` | **Yes** | Case B proved a `no_data` claim can carry a real distribution finding. **㉑ now exists to receive it — this is what makes ㉑ worth building** |
| **13** | Daily track approved | **Yes. 3 items/day cap, 24-hour expiry** | Already effectively taken — *"viral content thodi wait karega tumhare weekly approvals ka."* The two numbers are the conservative end |
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

## 4 · What I did not decide, and will not

| | Why |
|---|---|
| **Seven people's evenings** (Q26) | Not mine to commit. §2.3 reduces the ask and gives the fallback |
| **When the service principal lands** (Q3) | A dependency, not a decision |
| **When the watermark service deploys** (Q6) | Infrastructure timing |
| **Whether to delete Joy's calendar** | This repo mirrors Joy's Drive. **A deletion here can propagate to the original** |
| **Naming a competitor** (Q28) | Decided *not to*, which is different from deferring — §1 |

---

*Document: `content-engine-decisions.md` · 2026-09-10 · Twenty-seven questions, taken. Four adopted from
positions already recorded elsewhere; the rest decided on asymmetry, position, build cost or editorial
judgement, with `⚑` marking the eight where the basis is judgement rather than citation. **Every one is
reversible in a line, and none overrides anything Joy specified.** The build order now has one external
blocker: two service principals, from Jayant.*
