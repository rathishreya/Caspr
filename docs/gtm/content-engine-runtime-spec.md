# Content Engine — Runtime Specification

*2026-09-08. **The mechanism, not the model.***

**Companion to — and subordinate to — the following. Where any of them disagrees with this file, they win:**

| File | Governs |
|---|---|
| [`content-approach.md`](content-approach.md) | The four content types, the editorial line, the source rule, how topics get picked |
| [`content-calendar.md`](content-calendar.md) | The twelve-week slots, the ~23-item weekly volume, the review budget |
| [`content-engine.md`](content-engine.md) | The demand intake, the nine context blocks, model tiering, the linter rule set, the repurposing graph |
| [`content-engine-prompts.md`](content-engine-prompts.md) | **Every generation prompt, verbatim.** Nothing here rewrites one |
| [`portal-build-spec.md`](portal-build-spec.md) | Module structure, the reject taxonomy, the review model, the hygiene branch |
| [`operations-runbook.md`](operations-runbook.md) | The weekly cycle, who reviews what, the health metrics |
| `caspr-dm-handover/02-linkedin-profiles/audit.md` §5 | The voice lanes and the engagement rule |

**The diagrams:** [`content-engine-flowchart.md`](content-engine-flowchart.md) — ten flowcharts of this
mechanism. It holds no rules; where it and this file disagree, this file is correct.

---

## 0 · What this document is, and what it deliberately is not

**`content-engine.md` says what the machine makes. This says how it runs.**

Everything strategic is already decided and is not reopened here. This file answers the four questions that
decision left open, for every station on the line:

> **What** happens · **When** it fires · **Why** it exists · **How** it works

And one more, added because it is the question that decides whether any of it was worth building:

> **What it does to `x`.**

**Three rules this document holds itself to:**

1. **Nothing here changes anything Joy has specified.** Every station cites the file and section it implements.
   Where a station is new, it is marked **NEW** and says what it adds and why nothing existing covers it.
2. **Where a prompt exists, it is used verbatim.** This file never restates prompt text — it says who fills
   which `{brace}`, from where, and what happens when a token cannot be filled.
3. **Where something is genuinely undecided, it is listed in §8 as an open question rather than resolved
   quietly.** Thirteen are open. None blocks the first four stations.

**Not in scope here:** the Website, SEO, Performance and Email workstreams beyond where content crosses into
them; paid campaign management; video editing (`portal-build-spec.md` §11 — the DM team's editor owns it).

---

## 1 · The line, end to end

Five acts. Eighteen stations. One item passes through them in order; a published analysis re-enters at Act 3
once per derivative.

```
╔═══════════════════════════════════════════════════════════════════════════════╗
║  ACT 1 — LISTEN & DECIDE            what is worth making                      ║
╚═══════════════════════════════════════════════════════════════════════════════╝

   ①  THE WATCHLIST          the sources we listen to            config, Joy owns
            │                                                     
            ▼                                                     
   ②  THE LISTENER           read-only collection                 NEW · daily
            │                 ⛔ never posts, never votes          
            ▼                                                     
   ③  THE TREND READER       cluster · velocity · audience        NEW · daily
            │                 velocity > volume                    
            ▼                                                     
   ④  THE CLAIM READER       "what do they believe?"              NEW · daily
            │                 → checkable assertions + basis       
            ▼                                                     
   ⑤  THE VERIFIER           "is it true?"  ── calls Caspr ──────► retrieve_analysis
            │                 confirmed │ DIVERGES │ definitional │ no_data
            │                                                  ──► fact_lookup
            ▼                                                     
   ⑥  THE ANGLE DESK         publishable? which type? which lane?  NEW · daily
            │                                                     
            ▼                                                     
   ⑦  THE TOPIC BOARD        ranked candidates + evidence          NEW · weekly
            │                 ⚠ A HUMAN PICKS. Never the machine   
            │                                                     
╔═══════════╪═══════════════════════════════════════════════════════════════════╗
║  ACT 2 — PLAN                        what this week holds                     ║
╚═══════════╪═══════════════════════════════════════════════════════════════════╝
            ▼                                                     
   ⑧  THE WORK ORDER DESK    calendar slot + picked topic          Thu 06:00
            │                 → ~23 ContentItems, sized to the review budget
            │                                                     
╔═══════════╪═══════════════════════════════════════════════════════════════════╗
║  ACT 3 — MAKE                        the artefact                             ║
╚═══════════╪═══════════════════════════════════════════════════════════════════╝
            ▼                                                     
   ⑨  THE ASSEMBLY DESK      nine context blocks → filled prompt   Thu 06:00
            │                                                     
            ▼                                                     
   ⑩  THE WRITER             frontier (originate) │ Haiku (transform)
            │                 ⛔ INSUFFICIENT_SOURCE · LANE_MISMATCH · NOT_RELEVANT
            │                    · INSUFFICIENT_RELEVANCE  → item is not produced
            ▼                                                     
   ⑪  THE VISUAL DESK        the atom chart · social cards         NEW · 🔴 GAP
            │                 no prompt exists today               
            ▼                                                     
   ⑫  THE LINTER             L01–L11 deterministic · L20–L24 semantic
            │                 fail → back to ⑩, silently. Never queued
            │                                                     
╔═══════════╪═══════════════════════════════════════════════════════════════════╗
║  ACT 4 — APPROVE & SHIP                                                       ║
╚═══════════╪═══════════════════════════════════════════════════════════════════╝
            ▼                                                     
   ⑬  THE REVIEW ROOM        approve │ reject+reason │ hold        Thu–Mon 18:00
            │                 ⛔ no editing. full-screen. commit on action
            │                                                     
            ├─ rejected ─► ⑭  THE LEDGER ──► active failure modes ──► back to ⑩
            │                                (60-day expiry)
            ▼ approved                                            
   ⑮  THE HYGIENE BENCH      prose cleaned · PDF untouched         Mon 20:00
            │                 ⚠ branches on artefact_type, not item type
            ▼                                                     
   ⑯  THE PUBLISHER          blog · LinkedIn · X · email · community
            │                 ⛔ unreviewed never publishes. communities = human
            │                 ✅ every outbound link carries utm_* + icp_hint
            │                                                     
   ⑰  THE COMMENT DESK       which post, which fact, which person  NEW · daily
                              ⛔ human posts. always. 14/week, outside the gate

╔═══════════════════════════════════════════════════════════════════════════════╗
║  ACT 5 — MEASURE                                                              ║
╚═══════════════════════════════════════════════════════════════════════════════╝

   ⑱  THE METER              publish log → event stream → cohort → x
                              + p (presence), monthly
```

**One loop, one re-entry and two clocks:**

- **The rejection loop** — ⑬ → ⑭ → ⑩. Compounds. This is how the engine gets better.
- **The fan-out re-entry** — a published analysis re-enters at ⑨ once per derivative, 16–23 times,
  spread across two weeks. This is how the engine gets *bigger* without getting more expensive.
- **Two clocks** — the **weekly track** produces what compounds; the **daily track** produces what responds.
  **Same stations, same gates, different trigger and budget — §5A.**

```
                    ⑥ ANGLE DESK
                         │
          ┌──────────────┴──────────────┐
          ▼                             ▼
   WEEKLY CLOCK                   DAILY CLOCK   §5A
   ⑦ TOPIC BOARD                    ⛔ skips ⑦ — nothing is commissioned
     Wed pick · any type             Type D only  (+ ⑰ comments)
     Type A · Type B                 confirmed │ diverges │ definitional
          │                          ⛔ never no_data
          ▼                             │  no notification · expires 24h
   ⑧ WORK ORDER ◄────────────────────┘
     Thu 06:00 · ~23 rows           daily · 1–3 rows · no calendar slot
          │                             │
          └──────────────┬──────────────┘
                         ▼
              ⑨⑩⑫⑬⑮⑯  identical from here
          │                             │
          ▼                             ▼
   Mon 18:00 deadline              same day, next open window
   Tue–Sun publishing              ⏱ or discarded
```

**⏱ Timing, so the diagram is not misread as elapsed time.** ⑧ through ⑫ is **minutes of machine work on both
clocks.** What makes a week a week on the weekly track is ⑬ (three people at ~2.5 hrs each, spread Thu→Mon),
the deliberate publishing spread Tue→Sun, and the Type A cadence of one per three weeks. **The daily track
exists because none of those three applies to a derivative** — it is 1–2 minutes to review and it has a window
that closes.

---

## 2 · Act 1 — Listen & Decide

### ① The Watchlist

| | |
|---|---|
| **What** | The named list of sources the engine listens to — subreddits, forums, publications, and the people whose posts are worth reading. Plus, per source, which ICP it serves. |
| **When** | Static config. Reviewed in the quarterly build sprint, never mid-week. |
| **Why** | An unbounded listener drifts toward whatever is loudest, which is the opposite of what the positioning needs. Naming the rooms is what keeps the signal inside the ICP. |
| **How** | A config table, versioned. `{ source_id, platform, url, icp_served, read_method, enabled }`. Changing it is a config change, never a build — per the standing rule in `portal-build-spec.md` §1: *"Capability complete, throughput configurable."* |
| **Joy** | **The list itself is Joy's to write.** `content-engine.md` §2 names the signal (*"Community question flow — manually logged from the threads Social already reads"*) but does not enumerate the threads. **Open question 1.** |
| **→ x** | Indirect. A watchlist scoped to buyer rooms rather than practitioner-adjacent noise is what keeps the topic board's ICP match real, which is what makes `icp_hint` on the eventual CTA mean something. |

---

### ② The Listener — **NEW**

| | |
|---|---|
| **What** | Reads the watchlist on a schedule and stores what was said. Nothing more. |
| **When** | Daily, off-peak. Not weekly — a trend that is only visible on Thursday morning has already been three days old. |
| **Why** | Signal 3 is the only pre-launch signal drawn from people talking in their own words rather than from a keyword tool. Joy scoped it manual and gave the reason: *"Signal 3 is free because Social is already in those threads — it is a logging discipline, not new work."* **Automating it does not replace the discipline; it removes the dependency on someone remembering.** The same standing instruction applies as everywhere else: *"remove the dependency on my laptop being turned on."* |
| **How** | Read-only platform APIs. Rate-limited, cached, backed off. Output shape: <br>`RawConversation { text, platform, url, posted_at, engagement { score, replies, velocity }, author_signal, source_id }` |
| **⛔ Hard limits** | **Never posts. Never replies. Never votes. Never follows.** `portal-build-spec.md` §11: *"Automated posting to Reddit, WSO, ESOMAR, PrepLounge or any community — permanently out of scope, by design."* Reading is not banned; posting is, permanently. <br>**X is excluded from this station.** §11 also puts *"X monitoring and analytics"* out of scope, and the free API tier is writes-only in any case. |
| **Joy** | `content-engine.md` §2, signal 3. **This station automates what Joy specified as manual — open question 2.** |
| **→ x** | The denominator. A manual scan costs ~20 minutes of a specialist's week; the same 20 minutes spent on review is 10–20 derivative items. This station converts a recurring human cost into a fixed one. |

---

### ③ The Trend Reader — **NEW**

| | |
|---|---|
| **What** | Clusters similar conversations, measures whether each cluster is *rising*, and scores its audience against the ICP set. |
| **When** | Daily, after ②. |
| **Why** | **Volume and trend are not the same thing, and confusing them produces SEO work labelled as news.** A question asked 100 times every week is a constant — that belongs to the SEO workstream's evergreen pages. A question asked 40 times this week against 4 last week is a trend, and it has a window. |
| **How** | `Trend { topic_cluster, volume, velocity, first_seen, icp_match, sample_urls[] }` <br>**Velocity, not volume, is the ranking input.** Volume is carried for context. <br>**Audience filter reuses Joy's own discriminator.** `docs/seo/decision.md` §2: *"`secondary research` at $9 CPC is a student. `competitive landscape analysis` at $300 is a buyer. Advertisers will not pay $300 to reach an undergraduate."* The same test applies to a thread: a room of students is demoted, a room of practitioners is promoted. |
| **Joy** | Implements `content-engine.md` §2 signal 3 and §2.1 (*"never a topic; always a candidate plus its reason"*). The CPC discriminator is `docs/seo/decision.md` §2. |
| **→ x** | Protects the origination budget. Only 2.5 items a week are origination (`content-calendar.md` §5.4); spending one on a constant that an evergreen page already serves is a wasted frontier call and a wasted 8–15 review minutes. |

---

### ④ The Claim Reader — **NEW**

| | |
|---|---|
| **What** | Extracts, from a trend, the specific factual assertions people are making — with the **basis** each is measured on. |
| **When** | Daily, after ③. |
| **Why** | This is the bridge to Caspr. A trend is a topic; the engine cannot verify a topic. It can verify *"UK vet practice acquisitions are clearing 12× EBITDA."* |
| **How** | `Claim { statement, asserted_value, basis, period, source_cited?, confidence }` <br>**`basis` is mandatory and is the load-bearing field.** It records *what is being measured* — `EBITDA multiple` · `mine production` · `NTM revenue`. A claim without a basis is not passed to ⑤; it is returned to ③ as unusable. |
| **Joy** | `index-engine.md` §2 establishes both the field and the reason: *"every candidate must carry a `basis` field, and rows where the bases differ are classified as definitional, never as disagreement."* This station is where that field is first populated. |
| **→ x** | Nothing directly. It is the precondition for ⑤, which is where the value is. |

---

### ⑤ The Verifier — where the engine calls Caspr

| | |
|---|---|
| **What** | Asks Caspr whether each claim is true, and returns one of four verdicts. |
| **When** | Daily, after ④, and again on demand from ⑧ when a work order needs a figure. |
| **Why** | **This station is the entire reason the engine is defensible.** Everything downstream inherits its citation. `content-approach.md` §3: *"cited, or it does not ship."* |
| **How — the call order is a rule, not a preference** | `gtm-api-contract.md` §2: <br>**1. `retrieve_analysis`** — is this already answered in an analysis we have run? **Free** <br>**2. `fact_lookup`** — is this a single fact rather than a piece of research? **Cheap** <br>**3. `trigger_generation`** — commission a new analysis. **Billable, and requires a named human** <br><br>Step 3 carries `{"commissioned_by": "joy@caspr.ai"}`. **The call is rejected without it.** Joy's words: *"This is the interface making an editorial policy unforgettable rather than trusting the engine to remember it."* |
| **Auth** | The **service principal** — `gtm-api-contract.md` §1. A machine JWT, `principal_type: "service"`, scopes enumerated and enforced server-side, ≤60 min, same JWKS, **no token in a URL, ever**. No Data Room, no personal documents, no user history. **Not yet issued — open question 3, and it blocks this station entirely.** |
| **Spend** | One ceiling for the whole principal — **150,000 credits/month**, enforced in Caspr's backend, not here. Soft alert at 70%, surfaced in the response. On breach: `403 gtm_budget_exhausted` — *"Not a queue, not a silent degrade. The engine surfaces it and halts."* **Cache hits charge nothing.** |

#### The four verdicts, and the third is the one that gets mishandled

| Verdict | Meaning | What it is worth |
|---|---|---|
| `confirmed` | The crowd is right | **Low.** Everyone already knows |
| **`diverges`** | **Same basis, different numbers** | **Highest.** This is the story |
| `definitional` | **They are measuring different things** | **High — but a different story** |
| `no_data` | Nothing credible | **Not published.** → `INSUFFICIENT_SOURCE` |

> **⛔ The engine must never report a definitional difference as a disagreement.**
>
> `index-engine.md` §2: copper *mine* production against *refined* production; SaaS *NTM* against *TTM* revenue.
> **These measure different things, and the finding is that nobody says so.** Reporting them as a
> disagreement is *"the exact sloppiness we sell against."*
>
> **Enforced structurally, not by prompt:** where two rows' `basis` values differ, the verdict is
> `definitional`. The model is never asked to make that call.

Also carried through from `gtm-api-contract.md` §1: **`source_last_verified` older than 30 days suppresses the
row rather than publishing it.** *"Publishing 'this is the latest figure' without having checked is the single
most likely error."*

| **Joy** | `gtm-api-contract.md` §1, §2, §3 · `index-engine.md` §2 · `content-approach.md` §3 |
|---|---|
| **→ x** | **Both sides of the ratio.** <br>**Numerator:** a `diverges` finding is the highest-travelling artefact the company can produce, and it is un-copyable — nobody else has the corpus. It feeds the atom (⑪), which feeds `p`. <br>**Denominator:** the call order keeps most content on free and cheap calls. *"Most content needs a fact, and a fact should never cost a Study."* <br>**⚠ And one trap that would corrupt `x` outright** — see §7. |

---

### ⑥ The Angle Desk — **NEW**

| | |
|---|---|
| **What** | Decides whether a verified trend is publishable at all, and if so as what. |
| **When** | Daily, after ⑤. |
| **Why** | Not every true finding is worth the company's name on it, and not every finding fits someone's lane. Deciding this before the topic board keeps the board short and every row actionable. |
| **How** | Four gates, all of them Joy's, applied in order: <br>**1. Source gate** — `no_data` → dropped (`INSUFFICIENT_SOURCE`). <br>**2. Lane gate** — is there a person whose lane covers this subject? If not, no derivative is generated. *"An empty slot beats a lane violation."* <br>**3. Collision gate** — is another person already assigned this subject this week? *"Never two people on the same subject in the same week."* <br>**4. Movement gate** — does it sit inside this week's movement, or is it strong enough to justify sitting outside it? <br><br>Output: `Angle { type, thesis, lane, movement_fit, verdict_ref }` or `NO_ANGLE`. |
| **Joy** | `content-engine.md` §5.3 (lane integrity, one-subject-one-week) · `audit.md` §5 (the lanes) · `content-calendar.md` §2 (movements) |
| **→ x** | Denominator. Every angle killed here is a frontier call and 8–15 review minutes not spent. |

---

### ⑦ The Topic Board — **NEW**

| | |
|---|---|
| **What** | The ranked list of candidates with their evidence attached, and the surface where **a person picks**. |
| **When** | Assembled continuously; **read and acted on once a week**, before Thursday generation. |
| **Why** | Joy's rule, and it is deliberate: *"The pipeline ranks. A person picks from the top of the list."* And the reasoning: *"Trending is not the same as worth publishing, and the difference matters because this artefact carries the company's name."* |
| **How** | Each row shows the candidate, its signal source, volume, trend, ICP served, **`sourceable`**, and its verdict. **`not_found` demotes a candidate regardless of its demand.** <br><br>The row a reviewer needs to be able to reach: *"The best question is often the **third** on the list — high demand, genuinely answerable, and nobody credible has answered it."* So the board shows evidence, not a score. |
| **🔴 The gap** | **No screen exists for this.** `portal-design-spec.md` §11 lists 23 built screens; searching it for "candidate" or "demand" returns nothing. **Open question 4** — and until it is answered, the interim is: the board renders as a list, a person picks in it, and the chosen topic is what ⑧ reads. |
| **Joy** | `content-approach.md` §5.3 · `content-engine.md` §2.1 |
| **→ x** | The single highest-leverage human decision in the system. Four analyses in twelve weeks; each is a Study, and each is the parent of 16–23 items. Picking the wrong one wastes three weeks of derivative capacity. |

---

## 3 · Act 2 — Plan

### ⑧ The Work Order Desk

| | |
|---|---|
| **What** | Turns *this week's calendar slot* plus *the picked topic* into a concrete list of `ContentItem` rows. |
| **When** | **Thursday 06:00**, on an EventBridge schedule. |
| **Why** | The calendar fixes the shape of the week and the topic board fixes its subject. Neither alone is a work order. |
| **How** | Reads two things and produces one: <br><br>**Input A — the week slot** (config, seeded from `content-calendar.md` §2): <br>`{ week, movement, movement_thesis, type_a_lands, type_b_focus, icp, pillar }` <br><br>**Input B — the picked topic**, from ⑦. <br><br>**Output** — ~23 `ContentItem` rows, per the volume table in `content-calendar.md` §1.1: <br>2 search answers · 0.25–0.5 published analysis · 1 LinkedIn Joy · 1 LinkedIn Jayant · 2–3 LinkedIn rotating · 3 X · 5 community drafts · 4 outreach · 0–2 email · 3 SEO tasks. |
| **The sizing rule** | **The generator reads the configured weekly review budget in minutes and sizes its output to fit. It never overshoots.** ~450 minutes available; the plan spends 62–77. |
| **Two things that are not rows** | **14 personal comments** — 2 per person, **outside the review gate** (⑰). <br>**`/market-size/*` pages** — generated, and **not review-queue items**: *"the template is reviewed once; the pages are not."* This is the single biggest reason the volume plan fits (`content-calendar.md` §5.4). |
| **Joy** | `content-calendar.md` §1.1, §2 · `operations-runbook.md` §1, §4 · `portal-build-spec.md` §3.2 |
| **→ x** | Denominator control. Volume is a function of review capacity, not ambition — which is what stops the engine from producing more than the team can approve and then publishing the overflow unreviewed. |

---

## 4 · Act 3 — Make

### ⑨ The Assembly Desk

| | |
|---|---|
| **What** | Fills every `{brace}` in the prompt for one item. |
| **When** | Per item, immediately before ⑩. The shared preamble is assembled **once per run**, not per item. |
| **Why** | The prompts are written; nothing here rewrites them. What has never been written down is **who fills which token, from where, and what happens when one cannot be filled.** |
| **How** | Nine blocks, in Joy's order (`content-engine.md` §3.1). Source of each token below. |

**Blocks 1–4 — the shared preamble, assembled once per run**

| Token | Filled from | On failure |
|---|---|---|
| `{canonical_facts}` | Truth layer — the canonical facts table (`portal-build-spec.md` §3.1) | **Halt the run.** A generation without canonical facts will contradict a published number |
| *(prohibitions)* | Static. The linter rule set restated as instructions | — |
| *(voice)* | `brand-guidelines.md` + the tiered copy list in `CLAUDE.md`. **⛔ Never the workbook's Voice Cheat Sheet** — `content-engine.md` §1.1 | — |
| `{active_failure_modes}` | The Ledger (⑭) — **the live list, not the whole history** | Empty is valid — that is week one |

**Blocks 5–9 — per item**

| Token | Filled from | On failure |
|---|---|---|
| `{writing_brief}` `{proof_points}` `{target_keyword}` `{word_count}` `{cta}` `{buyer_stage}` `{question_customer_words}` `{working_title}` | The card schema on `ContentItem` — `content-engine.md` §4.1 | Type B cannot run without `writing_brief` and `proof_points`. Halt the item |
| `{parent_item}` `{atom}` | The approved parent — derivatives only | **A derivative with no approved parent is not generated.** This is what stops the engine originating on-channel |
| `{analysis_title}` `{figures_with_sources}` `{disagreements}` `{section_list}` | `retrieve_analysis` | Halt the item |
| `{icp}` `{icp_pain_verbatim}` | `icp-copy.md` v3 + `icp-personas.md` | Fall back to the ICP-less path |
| `{lane_owns}` `{lane_never}` `{lane_cadence}` `{person}` | `audit.md` §5 — the lane table | **No lane → item not generated** |
| `{movement}` `{movement_thesis}` `{pillar}` | The week slot, from ⑧ | Halt the item |
| *(channel constraints)* | Static per channel — §6 of this document | — |

**One rule that lives here and nowhere else:** `{movement}` is read by the shared preamble, not only by the
type prompt — *"Cost is the third act. Price never leads a headline or a first sentence unless `{movement}` is
3."* A missing `{movement}` therefore silently disables a prohibition. **Treat it as required.**

| **Joy** | `content-engine.md` §3.1 · `content-engine-prompts.md` §0 |
|---|---|
| **→ x** | Indirect but large. A wrong `{canonical_facts}` publishes a wrong number, which becomes a stale flag, an unpublish, a correction, and a `FACT_WRONG` ledger entry — four costs for one missing token. |

---

### ⑩ The Writer

| | |
|---|---|
| **What** | The model call. |
| **When** | Per item, after ⑨. |
| **Why** | — |
| **How — tiering is a cost control, not a preference** | **Frontier:** published-analysis framing · search answers · permission layer · founder posts · outreach first drafts · **anything taking a position**. <br>**Haiku:** every derivative — voiced variants, threads, glossary entries, metadata, subtitles, internal-link updates. <br>**~80% of volume is Haiku. That is what keeps the bill at $40–100/month.** |

#### The four control tokens — the model refusing is a success, not an error

Joy's prompts define these. The runtime must treat each as a terminal state, not a retry:

| Token | Emitted when | Runtime does |
|---|---|---|
| `INSUFFICIENT_SOURCE` | No finding traceable to a Caspr analysis and no attributed opinion | **Item is not produced.** Logged against the topic, not the writer |
| `LANE_MISMATCH` | Subject outside the person's lane, or already assigned this week | **Slot left empty.** *"An empty slot beats a lane violation"* |
| `NOT_RELEVANT` | A community thread is not genuinely on topic | **Draft not produced** |
| `INSUFFICIENT_RELEVANCE` | The only reason to contact this person is their job title | **Outreach draft not produced** |

> *"`INSUFFICIENT_SOURCE` is load-bearing. The generator refusing is cheaper than the linter rejecting, and far
> cheaper than a reviewer approving something unsourced on a Friday."*

**Retry policy — NEW, because none is written.** A control token is **never** retried. A *transport* failure
(timeout, 5xx, rate limit) retries three times with backoff, then marks the item `generation_failed` and
surfaces it on the workstream dashboard. **A failed item is never silently dropped and never published.**

**Rising `INSUFFICIENT_SOURCE` rates are a selection signal, not a prompt fault** — `content-engine-prompts.md`
§6: *"fix selection, not the prompt."* Route the rate to the topic board, not to the prompt backlog.

| **Joy** | `content-engine-prompts.md` §0–§4 · `content-engine.md` §3.2, §3.3 |
|---|---|
| **→ x** | Direct denominator. Tiering is the difference between a $40–100 monthly bill and a $200–300 one at the same output. |

---

### ⑪ The Visual Desk — **NEW · 🔴 THE LARGEST GAP**

| | |
|---|---|
| **What** | Produces the visual artefacts the fan-out graph already promises. |
| **When** | Per item, where the item's `Visual Type` is set. |
| **Why this is flagged as a gap** | `content-engine.md` §5.2 commits to **"The atom — one chart, source-stamped · 1"** and **"Charts as social cards · 1–3"** per published analysis. `content-engine-prompts.md` contains **no visual prompt** — §0 through §5 are all text. **Nothing specifies how a chart is produced.** |

**What already exists and must be inventoried before anything new is commissioned** — `content-engine-prompt.md`
§3 is explicit about this: *"`content/assets/visuals/*` — existing diagrams, infographics, social cards.
**Inventory before commissioning anything new.**"*

| Folder | Count |
|---|---|
| `content/assets/visuals/diagrams/` | 6 SVG |
| `content/assets/visuals/infographics/` | 9 SVG |
| `content/assets/visuals/social/` | 12 SVG — one per ICP, plus offer cards |
| `content/assets/visuals/screenshots/` | 15 HTML + 16 raw PNG |
| `content/assets/visuals/video/` | 8 HTML |

**These are hand-made assets, not generated ones.** They are a library to draw from and a house style to match
— not a pipeline.

**Three routes, and the choice is Joy's — open question 5:**

| | Route | What it means |
|---|---|---|
| **a** | **`propose_visuals`** — `api-spec-v2.md` §9.2, already built and conformance-tested. Returns **2–3 proposals carrying complete chart data**, never a rendered image | The chart data already exists inside the analysis. This reuses it. **Recommended** |
| **b** | **Template + data** — a fixed set of house chart templates, filled from the analysis figures | No AI call, fully deterministic, but a new template each time the shape differs |
| **c** | **Image generation** | ⛔ Not recommended — a generated chart cannot be source-stamped truthfully, which breaks the one rule the atom exists to satisfy |

**Two constraints that hold whichever route is chosen:**

1. **Source-stamped.** The atom carries *"the number, its unit, its period, and its publisher."* A chart that
   drops the publisher is not the atom.
2. **Hygiene branches here.** `content-engine.md` §4A: `remove-ai-marks` handles image metadata (C2PA, EXIF,
   XMP) but is *"a thin client over an HTTP service at `WATERMARKS_SERVICE_URL`"* which **is not reachable
   today**. Without it, published images carry unstripped generation metadata. **Deploy it with the portal.**

**⛔ Video is out of scope for this engine.** `portal-build-spec.md` §11: *"Video editing — the DM team's editor
owns this."* The eight briefs in `docs/video-briefs/` are hand-produced pieces, not pipeline output. The engine
may *reference* a produced video (and the page carrying it gets `VideoObject` schema) but never produces one.

| **Joy** | `content-engine.md` §5.2, §4A · `content-engine-prompt.md` §3 · `api-spec-v2.md` §9.2 · `portal-build-spec.md` §11 |
|---|---|
| **→ x** | The atom is the unit designed to travel — *"read with no surrounding context, pasted into someone else's deck."* It is the primary input to `p`, and `p` is the leading indicator that `x` is a lagging one. |

---

### ⑫ The Linter

| | |
|---|---|
| **What** | Machine checks every item before any human sees it. |
| **When** | Immediately after ⑩ / ⑪. |
| **Why** | *"A human should never be the first line of defence on whether we wrote 'leverages.' That is what makes a strict three-minute review realistic."* |
| **How** | Two classes, and the split matters for cost and for trust: <br>**`L01`–`L11` deterministic** — regex or table lookup, **no model call**. <br>**`L20`–`L24` semantic** — a model call, each with a stated false-positive cost. <br><br>**Failures regenerate silently. They are never queued to a human.** |
| **Two that need care, and Joy named both** | **`L20` reader-labour** — the highest false-positive risk in the set. *"Every source is here"* passes; *"check every source"* fails. **Run it supervised for a month**, logging every catch, before it rejects unattended. <br>**`L22` citation resolves** — must **fetch the source**, not merely check the field is non-empty. *"A populated-but-dead citation is worse than no citation — it looks like proof and is not."* |
| **Runtime — NEW** | **Regeneration is bounded at three attempts.** On the third failure the item is marked `linter_blocked` and surfaced on the workstream dashboard rather than looping. An unbounded regenerate loop against a semantic check is a cost leak with no natural stop. |
| **Joy** | `content-engine.md` §4.1, §4.2, §4.3 · `portal-build-spec.md` §3.3 |
| **→ x** | Denominator, directly. Every catch here is a review minute not spent, and review minutes are the binding constraint on weekly volume. |

---

## 5 · Act 4 — Approve & Ship

### ⑬ The Review Room

| | |
|---|---|
| **What** | A person decides. Three actions, no fourth: **Approve · Reject with reason · Hold for discussion.** |
| **When** | **Thursday 07:00** queue-open notification → **Monday 18:00** deadline. One reminder Monday 09:00. **Two notifications a week, no more** — *"a queue that nags gets muted, and a muted queue is a stopped machine."* |
| **Why** | This is the product. Everything else is infrastructure around it. |
| **How — the shape is already designed** | **Full-screen takeover.** Not a modal, not a pane, not a list — *"the rail and tabs are what fragment attention."* <br>**One entry point: My Week.** Workstream Tasks tabs show items but never start the flow. <br>**Every action advances** to the next item. <br>**Commit on action.** No batch save, no undo — *"a reviewer interrupted at item 6 of 14 has genuinely decided six."* <br>**⛔ No editing.** Reviewers do not rewrite. A rejection regenerates the item with the correction applied. |
| **Reject taxonomy — fixed, ten codes** | `FACT_WRONG` · `STALE_NUMBER` · `UNSUPPORTED_CLAIM` · `OFF_VOICE` · `BANNED_TERM` · `WRONG_CTA` · `DUPLICATE` · `LEGAL_RISK` · `BOUNDARY_BREACH` · `WEAK` <br>A note of ≤200 characters is **required** on every rejection. Free text is an additional note, never a substitute for a code. |
| **Assignment** | By channel, to the reviewer who owns it. Per-reviewer minutes-remaining estimate. **Unreviewed items hold and never publish.** |
| **The review-cost asymmetry — build to it** | Origination **8–15 min** · derivative **1–2 min**. Roughly tenfold, and *"only 2.5 items a week are origination, which is the entire reason the volume fits."* The minutes estimate must use the two figures, not an average. |
| **Joy** | `portal-build-spec.md` §3.4 · `portal-design-spec.md` §5A · `content-calendar.md` §1.1 · `operations-runbook.md` §3 |
| **→ x** | The gate on everything. Nothing publishes unreviewed, so review throughput is the ceiling on output, and output is the numerator's supply. |

---

### ⑭ The Ledger

| | |
|---|---|
| **What** | Stores every rejection — reason code, note, the original item, the regenerated item, and whether the regeneration was accepted. |
| **When** | On every rejection, synchronously. |
| **Why** | *"The portal's compounding asset."* It is the only mechanism by which the engine gets better rather than merely faster. |
| **How — three outputs** | **1. Active failure modes** → injected into every subsequent generation (block 4 at ⑨), *"so the same mistake is not made twice."* <br>**2. Reject rate** by reason and by channel — the calibration signal. <br>**3. Linter defect list** — every `BANNED_TERM` rejection is a rule the linter should have caught. |
| **Health thresholds — and the direction of the fix is specified** | **Above 20%:** the generator is miscalibrated. **Fix the generator, not the humans.** <br>**Below 2%:** reviewers are rubber-stamping. Tighten the criteria and audit a sample. <br>Healthy band: **5–15%**. |
| **Expiry — NEW is only the implementation** | *"A mode that has not fired in 60 days is removed. Otherwise the list accumulates a hundred stale rules and every prompt gets worse."* So `active_failure_modes` is a **query**, not a stored list: modes whose last occurrence is within 60 days. |
| **Prompt iteration, monthly** | *"A reason code appearing in >15% of rejections means the relevant prompt is missing a constraint. Add it to **that prompt, not to the shared preamble** — the preamble is already long and every addition dilutes the rest."* |
| **The regeneration prompt has one clause that must not be softened** | `UNSUPPORTED_CLAIM` → *"Either attach the source or remove the claim. **Never soften it into a hedge** — 'may', 'often', 'arguably' are how an unsupported claim survives review, and they are not permitted as a fix."* |
| **Joy** | `portal-build-spec.md` §3.5 · `content-engine-prompts.md` §5, §6 · `operations-runbook.md` §10 |
| **→ x** | Compounding denominator improvement. Reject rate falling from 15% to 8% is ~7% of generation cost and ~7% of review minutes recovered, permanently, at no ongoing cost. |

---

### ⑮ The Hygiene Bench

| | |
|---|---|
| **What** | A Unicode and metadata pass on everything leaving for a public surface. |
| **When** | **After approval, before publish.** Deliberately after — *"a reviewer should read what was written, not a cleaned version of it."* |
| **Why** | `CLAUDE.md` Rule 6, a hard rule. Zero-width characters and homoglyphs break copy-paste, search indexing and screen readers, and a uniform invisible fingerprint across every published asset is a bulk-attribution surface handed away for free. |
| **How** | Default tool **`anthropic-skills:clean-user-facing-text`** — self-contained, no service. <br>Flags: **`--no-normalize-spaces`**. <br>**⛔ Never `--aggressive-homoglyphs`, `--nfkc` or `--strip-emoji-glue`** — they alter multilingual text and typography. <br>**Prose only.** Protect code, commands, paths, URLs, identifiers, exact values, formulas and **citations** — *"a mangled citation URL is a broken proof."* |

#### ⛔ The branch, and getting it wrong is a compliance breach

**Branch on `artefact_type`, not on item type.** One issue of *The Record* is two objects with opposite rules:

| Object | Hygiene |
|---|---|
| **The generated PDF deliverable** | **NEVER.** Every Caspr PDF carries a legally required AI-provenance mark under **EU AI Act Article 50(2)**, in force since 2 August 2026. **Stripping it is a compliance breach** |
| The report web page, the standfirst, the atom, every derivative | **Yes.** Published marketing prose |

An item whose payload includes a generated PDF **passes the PDF through untouched** and cleans only the
surrounding prose.

**Two things this station never does:** claim or imply human authorship, and strip a required disclosure —
including the standing note on any issue touching the research sector.

**⚠ Images.** `remove-ai-marks` is needed for container and image metadata and is **a thin client over
`WATERMARKS_SERVICE_URL`, which is not reachable today.** Without it this stage silently degrades to the
text-only path — acceptable for prose, **insufficient for published images**. **Deploy it alongside the
portal.** Until then, ⑪'s image output must not publish. **Open question 6.**

| **Joy** | `CLAUDE.md` Rule 6 · `content-engine.md` §4A, §4A.2 · `portal-build-spec.md` §3.6a |
|---|---|
| **→ x** | Protective. A compliance breach on Article 50 is a legal cost with no upper bound; everything else here is reputational hygiene. |

---

### ⑯ The Publisher

| | |
|---|---|
| **What** | Sends the approved, cleaned item to its channel on schedule. |
| **When** | **Monday 20:00** approved content is scheduled. **Tuesday–Sunday** publishing runs. |
| **Why** | — |
| **⛔ The invariant** | **Unreviewed content never publishes. There is no timeout that pushes it live.** If nobody reviewed by Monday 18:00, the TL decides: extend to Tuesday, or **skip the week**. *"Skipping a week is a valid outcome. Publishing unreviewed content is not."* |

**Channels — mechanism and real limits**

| Channel | Mechanism | Reality |
|---|---|---|
| **Blog → caspr.ai** | CMS write + build trigger | Fully automated. Our own site. **The write path is a website-session dependency — `portal-build-spec.md` §8.1** |
| **Email** | AWS SES | Fully automated. **⚠ SES is in sandbox — 200/day to verified addresses only. Production access must be requested day 1; approval takes days.** *"This is the single most likely cause of 'SES is configured but no email arrives.'"* |
| **LinkedIn Company Page** | Community Management API | Development tier granted on application: 500 req/app/day, 100/member/day. **Standard tier is not required and should not be pursued.** ⛔ **Do not request `r_member_social`** — reading member feeds forces Standard tier onto the whole app |
| **LinkedIn personal** | `w_member_social` via **Share on LinkedIn** | **Open permission, no approval needed.** One OAuth grant per person, once. 150 req/member/day. **5 of 7 granted** |
| **X** | API free tier | **Writes only. No read or monitoring at free tier** |
| **Communities** | ⛔ **Never automated** | The portal surfaces the thread and drafts the reply. **A human posts it.** *"Automated posting here gets accounts banned and burns the channel permanently"* |

**The day slots are fixed** — `content-calendar.md` §1:

```
Tue   search answer #1 · Joy LinkedIn · 1 X post
Wed   company page · 1 X post · community threads (human posts)
Thu   Jayant LinkedIn · rotating team post
Fri   search answer #2 · 1 X post
Mon   rotating team post · email when scheduled
```

> **Joy's post lands Tuesday** because the engagement rule depends on colleagues commenting inside 30–60
> minutes, and a mid-week morning is when that is realistic.

#### ✅ The attribution stamp — the one thing that makes `x` computable

**Every outbound link this station emits carries `utm_*` and `icp_hint`.** No exceptions — blog CTAs, social
links, email links, outreach links.

`portal-build-spec.md` §8.1 lists this as a website handover item; **`tracking-spec.md` Part 4 item 5 states
the consequence:** *"Without this the portal cannot attribute revenue to a channel and the RoI target is
unprovable."*

**A published item with an unstamped link is a defect, not a nit.** It is a permanently unattributable
acquisition — its revenue lands in the numerator with no channel, which understates whichever channel actually
earned it.

**Also automatic on published pages:** structured data — `Organization` · `BreadcrumbList` ·
`Article`/`BlogPosting` · `VideoObject` on any page carrying a testimonial film · `SoftwareApplication`.
**⛔ Never `aggregateRating` on our own pages** — self-serving review markup breaches Google's guidelines.
**`FAQPage`: keep the markup for answer engines, drop the Tier-0 justification** — Google deprecated FAQ rich
results on 7 May 2026.

**Failure handling — NEW.** A failed publish retries three times with backoff, then marks the item
`publish_failed` and raises it on the workstream dashboard. **An expired OAuth token raises a named alert to
the affected person** — `operations-runbook.md` §11: *"A social token expires → dashboard flags it. The affected
person re-authorises."*

| **Joy** | `portal-build-spec.md` §3.6, §6.1, §6.2, §8.1 · `content-calendar.md` §1 · `operations-runbook.md` §5, §11 · `tracking-spec.md` Part 4 |
|---|---|
| **→ x** | **This station is where `x` becomes measurable at all.** Everything upstream produces the numerator's supply; this is where each unit gets the label that lets revenue be traced back to it. |

---

### ⑰ The Comment Desk — **NEW**

| | |
|---|---|
| **What** | Tells each person **which post to comment on** and **which fact to bring**. |
| **When** | Daily, from the Listener's stream. |
| **Why this station is needed** | Joy specified the **volume** — 14 comments a week, 2 per person, one on a team post and one external, **outside the review gate**. Joy also specified the **standard**. What is not specified anywhere is **which post**, and without that the standard cannot be met — a person cannot bring a fact they do not have. |
| **Why it carries the most risk of any station** | The failure mode is astroturf, and Joy named it precisely: *"Five colleagues saying 'Great post' is visible astroturf, and it costs a defensibility brand more than the reach is worth."* |

**The standard, verbatim — `audit.md` §5:**

> **No coordinated applause.** Every comment must add a fact, a number, a counter-example, or a genuine
> question from that person's own domain. **If a comment could have been written by someone who had not read
> the post, it does not go out.**

**The guard rail — this is a data constraint, not a policy note:**

```
CommentTarget {
  post_url, platform, posted_at,
  why_relevant,
  the_fact_to_bring   ← REQUIRED. No fact → the target is never surfaced
  our_source,         ← REQUIRED. The citation behind the fact
  assigned_person     ← lane match, from audit.md §5
}
```

> **If `the_fact_to_bring` is empty, the target does not appear.** The engine cannot surface a post we have
> nothing to say about, which means it cannot generate applause. **The constraint that keeps this honest is
> structural, not a reviewer's judgement.**

**Three more rules that follow:**

1. **A person posts it. Always.** The desk surfaces the target and the fact; it never posts, never drafts a
   finished comment for one-click sending.
2. **Lane-matched.** A target is assigned to the person whose lane covers its subject. Kartikey never gets a
   target that speaks for the company; Jayant never gets one about pricing.
3. **Timing is surfaced, not enforced.** LinkedIn weights substantive comments in the first 30–60 minutes, so
   team-post targets are surfaced at publish time. Nobody is nagged.

**Time budget, per `audit.md` §6:** Joy and Jayant 20 min/week each · Dixit, Amit, Kartikey, Keshav 20 min each
· Naman 10 min (**comments only for eight weeks**, then joins the engineer lane). **≈130 min/week across the
core team, distribution only.** *"The core team should not be reviewing content."*

| **Joy** | `audit.md` §5, §6 · `operations-runbook.md` §5 · `content-calendar.md` §1.1 |
|---|---|
| **→ x** | Numerator, through reach. Seven people commenting substantively in the first hour *"materially changes"* a founder post's distribution. And it is the cheapest reach available — 130 minutes a week of time already committed. |

---

## 5A · The daily track — the engine's second clock · **NEW**

> **The engine runs on two clocks, not one.**
>
> **The weekly clock produces what compounds** — a published analysis, a search answer. Calendar-anchored,
> movement-bound, origination, expensive to review.
>
> **The daily clock produces what responds** — a post and a comment on something being discussed today.
> Trend-anchored, lane-bound, transformation, cheap to review.
>
> **They are separate tracks that share the same eighteen stations, the same gates and the same prohibitions.
> Only the trigger, the cadence and the budget differ.**

**This is an addition and it needs sign-off — open question 13.** §5A.6 names exactly what it changes.

### 5A.1 · Joy's own taxonomy already implies two clocks

🟢 [`content-approach.md`](content-approach.md) §3 splits content four ways, and **the split is already along
this line:**

| Type | Rate | Origination? | Clock |
|---|---|---|---|
| **A** Published analysis | 1–2 / month | ✅ Yes — a real Caspr run | **Weekly.** Calendar-anchored |
| **B** Search answers | 2 / week | ✅ Yes | **Weekly.** Evergreen, no window |
| **C** Permission layer | ~10, once | ✅ Yes | Neither — written once |
| **D** Derivatives | ~20 / week | ❌ **Transformation only** | **Daily.** This is the responsive half |

> 🟢 *"Origination is small, expensive and human-picked. Derivatives are large, cheap and machine-made.
> **The engine is a fan-out machine, not a writing machine** — and that distinction is what keeps volume
> affordable and quality defensible."*

**The daily track is Type D plus comments. Nothing else.**

### 5A.2 · Half of it already exists

🟢 **Comments are already outside the weekly gate**, and Joy put them there deliberately:

> *"**Plus 14 personal comments** — two per person — which **do not pass the review gate**. They are personal,
> low-risk, and gating them would triple the queue for no benefit."*
> — [`content-calendar.md`](content-calendar.md) §1.1

**So the Comment Desk (⑰) was always a daily station.** It needs no new approval mechanism, no new budget and
no sign-off. **What is new is only the post half.**

### 5A.3 · Nine rules

| | Rule | Why |
|---|---|---|
| **1** | **Same eighteen stations. A second clock, never a second pipeline** | 🟢 Joy's own pattern — *"review is a mode, not a node."* Two pipelines are two rulesets that will drift |
| **2** | **Type D only** — one X post, one lane-matched LinkedIn post, plus comment targets. ⛔ Never Type A, Type B, email or a community draft | 🟢 Review cost differs **tenfold**: origination 8–15 min, derivative 1–2. **A daily track carrying origination is the weekly queue with a shorter deadline** |
| **3** | ⛔ **Zero new notifications.** It appears as a badge on My Week — 🟢 which is already *"every person's landing"* | 🟢 *"Two notifications per week. No more. **A queue that nags gets muted, and a muted queue is a stopped machine**"* |
| **4** | **⏱ It expires in 24 hours.** Unreviewed, the item is **discarded**, never carried into the weekly queue | **This is what stops it becoming queue debt.** A response reviewed three days late is not a response, so nothing is lost by dropping it — and a track that cannot accumulate a backlog cannot nag |
| **5** | **Its own budget, stated and capped** — see 5A.5. It never draws on the weekly plan's minutes | 🟢 *"Volume is a function of review capacity, not ambition"* |
| **6** | ⛔ **Fires only on `confirmed`, `diverges` or `definitional`. Never on `no_data`** | **Case B is the reason.** The highest-velocity trend the engine found was the one that must not become a post. A track keyed to velocity alone would have grabbed exactly that |
| **7** | **It consumes no calendar slot** and publishes to the next open window, not to a fixed day | 🟢 The Tue/Wed/Thu/Fri/Mon slots belong to the weekly plan. Joy's post lands Tuesday for a reason; a daily item must not displace it |
| **8** | **Every other gate is unchanged, and none is relaxed** | The hard gate, the full linter, hygiene, the `utm` stamp, **lane integrity**, **one subject one person one week**, and *communities are posted by a human, always* |
| **9** | ⛔ **Two Caspr calls, never three.** `retrieve_analysis` then `fact_lookup`. **Never `trigger_generation`** | 🟢 That call requires a named `commissioned_by`, which an unattended run cannot supply honestly — and 🟢 *"a loop in a marketing engine that can start billable work is the most expensive bug available here."* **§5A.5** |

> **⚠ The temptation to resist:** speed and a defensibility brand pull against each other, so the instinct is to
> loosen a check "just for the daily items." **The guard rails are tighter here, not looser** — this is the
> track where a mistake reaches the public fastest and with the least deliberation behind it.

### 5A.4 · The daily cycle

```
EVERY DAY
─────────────────────────────────────────────────────────────────────
07:00   ②③④  listen · trend · claim   (already daily — unchanged)
          │
          ▼
07:30   ⑤ VERIFIER — two steps only, never three   §5A.5
          │   1. own recent verdicts   → reuse, no call
          │   2. retrieve_analysis     → FREE
          │   3. fact_lookup (batched) → CHEAP
          │   ⛔ trigger_generation is CLOSED on this track
          │
          ├── nothing found ─────────────► ⛔ not a daily item.
          │                                 Candidate is PROMOTED to ⑦,
          │                                 where a human may commission it
          ▼
07:45   ⑥ ANGLE DESK
          │
          ├── verdict is no_data ────────► ⛔ not a daily item.
          │                                 Routes to ⑦, or to outreach
          ▼
08:00   ⑧ WORK ORDER (daily variant)
          │   1–3 rows. No calendar slot consumed
          ▼
08:15   ⑨⑩⑫  assemble · write (Haiku) · lint
          │   ⛔ INSUFFICIENT_SOURCE / LANE_MISMATCH → item not produced
          ▼
        ⑬ REVIEW — badge on My Week, no notification
          │   same 3 actions · same 10 codes · same full screen
          │   1–2 min each
          │   ⏱ unreviewed by 08:00 tomorrow → DISCARDED
          ▼
        ⑮⑯  hygiene → publish, same day, next open window
                 stamped utm_* + icp_hint

        ⑰ COMMENT DESK — runs alongside, already outside the gate
                 surfaces post + the_fact_to_bring + assigned person
                 ⛔ a human posts. always
─────────────────────────────────────────────────────────────────────

EVERY THURSDAY 06:00 — the weekly clock, unchanged
        ⑦ topic board pick → ⑧ ~23 rows → … → Mon 18:00 deadline
```

### 5A.5 · Calling Caspr on the daily track — two steps, never three

**The daily track runs unattended and fires every day. That changes which Caspr calls it may make.**

🟢 The call order itself is unchanged — [`gtm-api-contract.md`](gtm-api-contract.md) §2 — but **the third step
is closed on this track:**

```
STEP 1   retrieve_analysis     "have we already answered this?"        FREE
              │  hit  ─────────────────────────────► use it. Proceed.
              ▼  miss
STEP 2   fact_lookup           "is this a single fact?"               CHEAP
              │  found ────────────────────────────► use it. Proceed.
              ▼  thin / not_found
STEP 3   trigger_generation                        ⛔ NEVER ON THIS TRACK
              │
              └──► the item is not produced, and the candidate is
                   HANDED TO THE WEEKLY TOPIC BOARD (⑦), where a
                   human can commission it if it is worth a Study
```

#### Why step 3 is closed, and it is not a preference

🟢 [`gtm-api-contract.md`](gtm-api-contract.md) §2 — `trigger_generation` from a service principal carries one
extra required field:

```json
{ "commissioned_by": "joy@caspr.ai" }
```

> *"A named human, recorded in the audit trail. **Reject the call if it is absent.** This is the interface
> making an editorial policy unforgettable rather than trusting the engine to remember it."*

**A daily automated track has no named human at the moment it fires.** It could not satisfy that field
honestly, and filling it with a standing name would be exactly the fiction the field exists to prevent.

🟢 The second reason is the one Joy states most sharply:

> **"A loop in a marketing engine that can start billable work is the most expensive bug available here, and
> it is exactly the failure that never shows up in testing."** — §1.1

**A track that fires daily, unattended, is that loop.** Closing step 3 is what makes the daily track safe to
run with nobody watching it.

#### The candidate is not lost — it is promoted

**This is what makes the rule cheap rather than restrictive.** A daily candidate needing research Caspr has not
done **does not die at step 2.** It is written to the topic board with its evidence attached, and 🟢 the weekly
pick decides — *"the pipeline ranks. A person picks from the top of that list."*

> **The daily track answers what is already answerable. The weekly track answers what is worth commissioning.
> Step 2 is the boundary between them — a routing decision, not a failure.**

#### Four operating rules

| | Rule | Why |
|---|---|---|
| **1** | ⛔ **Never `trigger_generation`. Two steps only** | Above. `commissioned_by` cannot be satisfied honestly by an unattended run |
| **2** | **Check the track's own recent verdicts before calling out at all** | The same trend recurs for days. A claim verified inside the retention window is reused. 🟢 The remote rule is the same — anything *"served from your cache"* is never metered, because *"a repeat lookup of the same sector–geography pair is not new compute"* |
| **3** | **Batch the day's probes** into one `POST /fact_lookup/batch` | 🟢 It exists, and 🟢 charging is **per query, never per request** — *"if a batch were charged once, the batch endpoint would look free, and the accounting would quietly stop being true"* |
| **4** | **On `403 gtm_budget_exhausted` the daily track halts; the weekly track continues** | 🟢 *"Not a queue, not a silent degrade. The engine surfaces it and halts."* **The priority is deliberate:** a daily post is one post; a Type A is the parent of 16–23 items and a Type B is the compounding line. **If credits are scarce, the daily track yields first** |

#### Metering and visibility

🟢 Every metered response carries the same block, and the daily track reads it exactly as the weekly one does:

```json
"metering": { "credits_charged": 0, "credits_remaining": 138204, "cache_hit": true }
```

🟢 **One ceiling, not one per endpoint** — *"the whole service principal."* **This section does not propose a
second ceiling and must not be read as doing so.** What it asks for is **visibility**: the dashboard shows
daily-track consumption as a distinct line beneath the single ceiling, so a runaway is attributable before it
is exhausting.

🟢 **The ledger rule is unchanged:** *"One ledger line per published item, not per call."*

### 5A.6 · The budget — stated, so it cannot quietly grow

🟢 The weekly plan spends **62–77 minutes against ~450 available**. The headroom is not spare capacity — it is
deliberate: *"The headroom absorbs regeneration and the weeks a published analysis lands."*

**So the daily track takes a named slice of it, not "whatever is left":**

| | 🔵 Suggested | Working |
|---|---|---|
| **Items per day** | **2–3** | Type D only |
| **Review per day** | **3–6 min** | at 1–2 min per derivative |
| **Review per week** | **~20–40 min** | |
| **Combined weekly total** | **~85–115 min of ~450** | weekly 62–77 + daily 20–40 |
| **Expiry window** | **24 hours** | one working day, and nothing stale publishes |

🟢 **Both numbers are starting values and are labelled as such** — the same posture
`gtm-api-contract.md` §1.1 takes with its credit ceiling: *"chosen as a runaway backstop rather than as a
budget — set it properly on the first month of actuals."*

🟢 **And the existing scaling rule governs both tracks:** *"Scale derivatives freely. Scale origination only
when a reviewer's minutes exist for it. The failure mode is origination creeping up because derivatives are
cheap."*

### 5A.7 · What this changes about Joy's design — named, not buried

**Four things, and they are why this needs a sign-off rather than a note:**

| | Change | Mitigation |
|---|---|---|
| **1** | **A second generation trigger.** Today generation fires only at Thursday 06:00 | The daily trigger produces 1–3 Type D rows and never a work order |
| **2** | **A review surface outside the Monday deadline** | No notification, and it expires — so it cannot become a second deadline |
| **3** | **An item source that is not the Work Order Desk** | It consumes no calendar slot and draws on its own capped budget |
| **4** | **Weekly volume rises from ~23 to ~35–44 items** | All of the increase is derivative, at 1–2 min each. **Origination is unchanged at 2.5 a week**, which is the figure the capacity case actually rests on |

**What it does not change:** the notification count, the reject taxonomy, the publishing day slots, the review
model, the hard gate, lane integrity, one-subject-one-week, or any prohibition.

**And on one axis it is deliberately *more* restrictive than the weekly track:** 🟢 the call order is unchanged,
but **step 3 is closed** — the daily track may never call `trigger_generation`. **§5A.5.** Nothing this track
does can start billable work.

### 5A.8 · Which track a trend goes to

**One question decides it, and the Angle Desk already asks it:**

```
Is there a publishable angle, and what type is it?

  Type D — a post responding to something being said today
     └─► DAILY TRACK.  Same day. Expires in 24h.

  Type A or B — an analysis to commission, or an evergreen answer
     └─► WEEKLY TRACK.  Topic board → Wednesday pick → Thursday generation.

  no_data with a distribution finding
     └─► NEITHER. Outreach — see open question 12.
```

> **A trend can produce both, and often should.** A same-day post that says *what is happening*, and a weekly
> analysis that says *what is true*. **Case A in the example does exactly this** — the X post goes out on day
> one, the reconciliation lands in week 6.

### 5A.9 · → `x`

**Numerator, and it is the only track that can act inside a window.**

🟢 A finding published six days after the conversation moved on reaches none of the three ways `p` counts an
appearance. **The daily track is what makes a trend reachable at all.**

**And the cost is small and bounded:** ~20–40 review minutes a week, a few Haiku calls, and a hard expiry that
guarantees the number cannot drift.

---

## 6 · The artefact breakdown — every format, every rule

Each of the following is one `type` value moving through the same eighteen stations. **What differs is the
prompt, the channel constraints, and the reviewer.** Nothing else forks.

### 6.1 Blog / search answer — Type B

| | |
|---|---|
| **Volume** | **2 a week.** Origination. Frontier model |
| **Reviewer** | SEO + TL · **20–30 minutes** |
| **Prompt** | `content-engine-prompts.md` §2 |
| **Brief tokens** | `question_customer_words` · `working_title` · `target_keyword` · `icp` · `buyer_stage` · `pillar` · `writing_brief` · `proof_points` · `word_count` · `cta` |
| **Structure rules** | Opening **answers the query in the first two sentences** — *"search readers do not scroll to find out whether you know."* · every factual claim carries its source **inline** · **one CTA, at the end, never mid-body** · the CTA **invites a question, never an account** |
| **Content rules** | Meet the reader **at the job, never at the category** — *"nobody searches 'analytical AI'."* · a `NOT_FOUND` figure is stated plainly: *no credible published source gives this number*. **Do not estimate, do not infer, do not hedge it into existence** · naming Brief / Study / Intelligence requires saying what the reader gets **before** naming the rung |
| **AEO — a build standard, not a per-post choice** | 40–60 word answer blocks · every figure with its **source and date** · comparison tables · schema · a **visible freshness stamp**. Evidence: citing sources **+40%** AI visibility, statistics **+37%**, low-authority domain **up to +115%** — *"the single most relevant finding for a site with no authority"* |
| **Metadata discipline** | Titles **50–60 characters** · meta descriptions **145–160**. *(The only part of the superseded `icp-pages-seo.md` that survives — it is explicitly marked "kept for reference: still correct.")* |
| **Publish** | CMS write + build trigger. Fully automated. Structured data attached automatically |
| **→ x** | The compounding line. It is the only channel whose output keeps earning after the week it was made |

### 6.2 Published analysis — Type A

| | |
|---|---|
| **Volume** | **1–2 a month** · lands weeks 3, 6, 9, 12 · **four in twelve weeks** |
| **Cost** | **One Study — $80 at list.** *"The constraint is not money. It is who picks the question and who checks the output before it carries the company's name"* |
| **Reviewer** | TL + Joy · 10–15 minutes amortised |
| **Prompt** | `content-engine-prompts.md` §1 — the analysis is run by Caspr; the prompt writes **what wraps it** |
| **Produces** | **1. TITLE** — a conclusion, not a topic. Under 12 words · **2. STANDFIRST** — 2 sentences · **3. THE ATOM** — one sentence: the number, its unit, its period, its publisher · **4. WHY IT MATTERS** — 3 sentences to this ICP's situation · **5. WHERE THE SOURCES DISAGREE** — competing figures side by side. **Do not resolve them. Do not average them. The disagreement is the finding** |
| **Type rules** | **Take a position** — *"a summary gets read and forgotten; a conclusion gets argued with, and the argument is what we are after"* · research-sector disclosure is **appended automatically; do not write your own** · **never characterise a named firm's work as poor** — state price, date, coverage and specificity as facts |
| **Fan-out** | **16–23 items**, spread across **two weeks**, not dumped |
| **→ x** | The parent of everything else. One Study at $80 produces ~20 items. **This is the whole cost case** |

### 6.3 LinkedIn — personal posts

| | |
|---|---|
| **Volume** | **4–5 a week** — Joy 1 · Jayant 1 · rotating team 2–3 |
| **Reviewer** | Joy/Jayant → TL · rotating → Social · **2 min each** (derivative) |
| **Prompt** | `content-engine-prompts.md` §4.1 · Haiku |
| **Lane gate** | Runs **before writing**. Outside `lane_owns`, inside `lane_never`, or subject already assigned this week → **`LANE_MISMATCH`, nothing else** |
| **Length** | **120–200 words. First person** |
| **Hashtags** | **⛔ No hashtag stack — two at most, or none.** This is the only hashtag rule in the system and it lives inside this prompt. There is no separate hashtag module |
| **Opening** | **Opens with the finding, not with context. The first line is the whole hook** |
| **Ending** | **Ends on the conclusion, not on a question. *"We do not fish for comments"*** |
| **Attachment** | The document or page is attached or linked — **the post stands alone without it** |
| **Voice** | *"Do not write in Joy's voice unless `{person}` is Joy. Each lane is a different person with a different job and a different thing they are entitled to say"* |
| **Publish** | `w_member_social` — open permission, no approval. One OAuth grant per person |
| **⚠ Analytics** | **Personal-profile post analytics are not available via API. Nobody solves this, including the commercial schedulers.** v1 captures self-reported impressions via a **two-field weekly form**. Directional, and **honest about being directional** |

**The lanes — `audit.md` §5, and they are not interchangeable:**

| Person | Owns | Cadence | **Never** |
|---|---|---|---|
| **Joy** | The analyst — findings from real analyses, the category argument, ICP pain, customer stories | 1/week | Technical architecture; generic AI commentary |
| **Jayant** | The builder — sourcing, corpus currency, why citation is hard, evaluation, security, multilingual generation, engineering trade-offs | 1/week | **Marketing claims; pricing** |
| **Dixit** | The applied scientist — retrieval, evaluation, hallucination measurement, agent design | 1/fortnight | Product roadmap |
| **Amit** | The engineer at work — what shipped, what broke, what the team learned | 1/fortnight | Strategy; positioning |
| **Kartikey** | The interface — long documents, citation UI, reading experience, performance | 1/fortnight | **Anything speaking for the company** |
| **Keshav** | The learner — technical notes from inside the build | 1/fortnight | **Anything speaking for the company** |
| **Naman** | **Comments only for eight weeks**, then the engineer lane | — | — |

### 6.4 X posts

| | |
|---|---|
| **Volume** | **3 a week** · Reviewer: Social · 4 min for all three |
| **Prompt** | `content-engine-prompts.md` §4.2 · Haiku |
| **Length** | **Under 260 characters, leaving room for the link** |
| **Structure** | **The number leads. The source is named in the post, not only in the link** |
| **⛔ Banned** | **No thread-bait, no "a 🧵", no numbered hooks.** Not a thread unless `{thread}` is true |
| **Publish** | Free tier, **writes only** |
| **⛔ Monitoring** | **Out of scope** — `portal-build-spec.md` §11 |

### 6.5 Community contributions

| | |
|---|---|
| **Volume** | **5 drafts a week** · Reviewer: Social · 6 min |
| **Prompt** | `content-engine-prompts.md` §4.3 · Haiku |
| **⛔ The rule above all others** | **"A PERSON WILL POST THIS. It is never posted automatically."** Permanently out of scope, by design |
| **Structure** | **Answer the question first, completely, with the actual information** |
| **Caspr mention** | **Only if it is genuinely the best answer, at most once, and never in the first half** |
| **The clause that earns the channel** | *"If the honest answer is that Caspr does not help here, say that and answer anyway. **That is the post that earns the right to the next one**"* |
| **Off-topic** | → **`NOT_RELEVANT`** |

### 6.6 Outreach drafts

| | |
|---|---|
| **Volume** | **4 a week** · Reviewer: TL · 6 min |
| **Prompt** | `content-engine-prompts.md` §4.4 · Frontier (first drafts) |
| **Length** | **Under 90 words** |
| **Opening** | The **specific** reason this person, not a category. **If the only reason is their job title → `INSUFFICIENT_RELEVANCE`** |
| **The ask** | **One, and small.** A question worth their answer, or a look at something relevant to their sector. **Never a meeting request in message one** |
| **⛔ Banned** | No flattery · no *"I've been following your work"* · no *"quick question"* |
| **Warm contacts** | Drafted **for correction rather than approval** — a starting point, not a finished artefact |
| **⚠ Split** | Outreach was dissolved as a workstream and redistributed — guest posts and directories → **SEO**; podcasts and community threads → **Content & Social**. The weekly table still carries a single row of 4. **Open question 7** |

### 6.7 Email blocks

| | |
|---|---|
| **Volume** | **0–2 a week** · Reviewer: TL + Joy · 3 min |
| **Prompt** | `content-engine-prompts.md` §4.5 · Haiku |
| **Length** | **80–120 words. One idea. One link** |
| **Voice** | Founder voice where sender is Joy or Jayant — **first person, plain, no marketing register** |
| **⛔ Banned** | No *"just checking in"* · no *"hope this finds you well"* · no re-introduction |
| **Send gate** | **Joy signs off the first email of any sequence.** Subsequent sends go on the TL's release |
| **⚠ SES** | **Sandbox today.** Production access is a week-1, day-1 request |

### 6.8 Visuals — the atom, social cards, infographics

| | |
|---|---|
| **Volume** | Per published analysis: **the atom ×1** · **charts as social cards ×1–3** |
| **Reviewer** | Social |
| **Prompt** | **🔴 None exists.** See ⑪ |
| **Existing library** | 27 SVG + 15 HTML + 16 PNG in `content/assets/visuals/`. **Inventory before commissioning anything new** |
| **Hygiene** | Needs `remove-ai-marks` → needs `WATERMARKS_SERVICE_URL` → **not reachable today** |

### 6.9 Comments

| | |
|---|---|
| **Volume** | **14 a week** — 2 per person, one on a team post, one external |
| **Review** | **⛔ None. Comments do not pass the review gate** — *"they are personal, low-risk, and gating them would triple the queue for no benefit"* |
| **Standard** | A fact, a number, a counter-example, or a genuine question from that person's own domain |
| **Surfaced by** | ⑰ — with the fact attached |

### 6.10 Generated pages — `/market-size/*`

| | |
|---|---|
| **Volume** | 40 seeded |
| **Source** | `fact_lookup`, not written |
| **⚠ Review** | **The template is reviewed once. The pages are not.** They **never enter the review queue as individual items** |
| **Why it matters for the build** | *"This is the single biggest reason the volume plan fits."* Treating them as ordinary `ContentItem`s would put 40 rows in a queue budgeted for 23 |

---

## 7 · Act 5 — Measure, and how each station reaches `x`

### ⑱ The Meter

> **`x` = revenue per $1 of total GTM spend, by signup cohort. Reported at `x@3` and `x@6` months.**

Two points because the trial is **$100 with a 90-day expiry** — a user can sit on credit through month three
and convert in month four. **`x@3` is the fast signal; `x@6` is the one scaling decisions rest on.**

**The scale gate:** `x@6 > 2` → paid opens, Product Hunt and Show HN are scheduled, ICPs widen — *"a
configuration change, not a build."* Below 2 → *"the machine is not working and more media will not fix it."*

**The chain, and every link is a build requirement:**

```
⑯ every outbound link carries utm_* + icp_hint
        ↓
   product event stream — tracking-spec.md
   prompt_submitted → signup_completed → analysis_completed → payment_succeeded
        ↓
   cohort membership = signup month + first-touch utm_campaign + icp_hint
        ↓
   revenue = Σ payment_succeeded at 3 and 6 months
             ⚠ CHARGES ACTUALLY TAKEN — never budgets authorised
        ↓
   x = revenue ÷ total GTM spend
```

### ⚠ Two traps that corrupt `x`, and both are ours to avoid in code

**Trap 1 — booking our own analyses at list price.** `gtm-api-contract.md` §1.1:

> **An analysis this engine commissions for itself is not a charge taken. It is compute consumed.**
> Booking it at $80 list would **overstate GTM spend and understate `x`** — and what follows is not an
> accounting error, it is **killing a channel that is working**, because its denominator was inflated by an
> internal transfer price.
>
> **Charge actual marked-up compute, exactly as an edit does. Never the list price of the analysis.**

**One ledger line per published item, not per call.** *"Four hundred `fact_lookup` calls behind one index issue
is one number a person will actually read; four hundred rows is noise nobody checks."*

**Trap 2 — counting paid users instead of revenue.** `tracking-spec.md` Part 5:

> **`paying_dormant`** — a user authorises a $200 budget, runs nothing, and pays only the **$14 platform fee**,
> counting as a "paid user" while generating almost no revenue. **Any metric counting paid users rather than
> revenue hides this.** It is why `x` is measured on revenue, and why *trial-to-paid* is retired as a headline
> metric.

### The other metric — `p`, and it is the leading one

> **One basket per ICP. Each month, ask every question in it. `p` for that ICP is the share where Caspr
> appears in the answer.**
>
> **`x` measures whether the machine pays for itself. `p` measures whether we exist at the moment the buyer
> looks.** One is lagging and commercial; the other is leading and cannot be bought.

Five construction rules, all Joy's, all binding: **unbranded only** · **the basket is frozen for a year**
(*"a metric you can edit when you dislike the reading is not a metric"*) · **must survive the CPC test** ·
**phrased as a person asks, not as a keyword** · **sourced, not invented**.

Three ways of appearing, weighted equally: cited in an AI answer (a mention without a link still counts) ·
listed on a third-party page ranking page one (**6.5× of citations come from here**) · our own page ranks page
one.

**Baseline, 2026-08-25: `p` = 0 on every question tested.** Reported per ICP, **never aggregated**.

### Contribution table — every station, one line

| Station | Side of the ratio | How |
|---|---|---|
| ① Watchlist | — | Keeps the funnel's ICP labelling honest at source |
| ② Listener | Denominator | Converts a recurring 20-min weekly scan into a fixed cost |
| ③ Trend Reader | Denominator | Stops origination budget going to constants an evergreen page already serves |
| ④ Claim Reader | — | Precondition for ⑤ |
| **⑤ Verifier** | **Both** | `diverges` findings are the highest-travelling artefact; the call order keeps most content free or cheap |
| ⑥ Angle Desk | Denominator | Every angle killed is a frontier call and 8–15 review minutes saved |
| **⑦ Topic Board** | **Numerator** | Four picks in twelve weeks, each the parent of 16–23 items |
| ⑧ Work Order | Denominator | Volume sized to review capacity — the engine cannot outrun its gate |
| ⑨ Assembly | Protective | A wrong canonical fact costs four downstream corrections |
| ⑩ Writer | Denominator | Tiering: $40–100/month instead of $200–300 at the same output |
| ⑪ Visual Desk | Numerator | The atom is the unit built to travel; primary input to `p` |
| ⑫ Linter | Denominator | Every catch is a review minute, and review minutes are the binding constraint |
| ⑬ Review Room | Ceiling | Throughput here is the ceiling on everything |
| ⑭ Ledger | Compounding denominator | Reject rate 15% → 8% recovers ~7% of cost, permanently |
| ⑮ Hygiene | Protective | Article 50 breach is an unbounded legal cost |
| **⑯ Publisher** | **Makes `x` computable** | Without `utm_*` + `icp_hint`, revenue has no channel and the target is unprovable |
| ⑰ Comment Desk | Numerator | Cheapest reach available — 130 min/week already committed |
| ⑱ Meter | — | Computes `x` and `p`; enforces both traps above |

---

## 8 · Open questions — for Joy

**None of these blocks stations ⑧ through ⑯, which can be built today.**

| # | Question | Blocks | Why it is Joy's and not ours |
|---|---|---|---|
| **1** | **What is the watchlist?** Which subreddits, forums, publications, people | ①②③ | An editorial judgement about which rooms contain buyers |
| **2** | **Automate signal 3?** You specified it manual — *"a logging discipline, not new work."* The Listener replaces the remembering, not the discipline | ② | It changes something you deliberately specified |
| **3** | **When does the service principal land?** | ⑤ and everything downstream of it | *"The blocking item; nothing else can be integrated without it."* Jayant's to issue |
| **4** | **The topic board — screen, or interim?** No screen exists among the 23. Options: (a) spec and draw one, (b) first month picks in a list view and the chosen topic is entered | ⑦ | Adding a 24th screen is a design decision |
| **5** | **How is the atom chart produced?** (a) `propose_visuals` — built, returns chart data, **recommended** · (b) house templates + data · (c) image generation — **not recommended**, cannot be source-stamped truthfully | ⑪ | Determines whether this is an integration or a build |
| **6** | **When does `WATERMARKS_SERVICE_URL` deploy?** Until it does, Rule 6 is unenforceable for images | ⑪⑮ | Infrastructure, and it must ship with the portal |
| **7** | **How do the 4 outreach drafts split** between SEO and Content & Social, now that Outreach is dissolved? | ⑧ assignment | An ownership call |
| **8** | **Comment Desk — approved?** Volume is yours (14/week); targeting is not specified. Guard rail proposed: **`the_fact_to_bring` empty → the target never surfaces** | ⑰ | The astroturf risk is a brand call |
| **9** | **`diverges` findings — Type A or Type B?** | ⑥ classification | Editorial |
| **10** | **Does `index-engine.md` already do stations ④–⑤?** It is an autonomous engine publishing how old figures are and how far sources disagree. **We should not build two.** We can map the overlap on request | ④⑤ scope | Avoids duplicating your own engine |
| **11** | **`p` and atom-travel — same instrument or two?** The `p` basket is **frozen for a year**; a travel signal must not break that freeze | ⑪⑱ | The freeze is the metric's defence |
| **12** | **Does a `no_data` verdict always end a content item?** Today it does — `INSUFFICIENT_SOURCE`, not produced, which is right for content. **But Case B shows a `no_data` claim carrying a real distribution finding**, and that finding is worth acting on through outreach rather than through a post. Should ⑥ be allowed to emit `type: "outreach"`, `owner: "seo"`? | ⑥ | It widens what a station may produce |
| **13** | **⏱ The daily track — approved?** §5A. A second clock: **Type D only** · zero new notifications · 24-hour expiry · its own capped budget · never on `no_data`. **Four things it changes are named in §5A.6**, the largest being weekly volume rising ~23 → ~35–44 — **all of it derivative; origination stays at 2.5.** The two numbers — items per day and the expiry window — are yours to set | 5A | It adds a second review cadence, and the two-notifications rule is deliberate |

---

## 9 · Build order

Sequenced so nothing waits on an answer it does not need.

| Phase | Stations | Why here | Blocked on |
|---|---|---|---|
| **1** | **⑨ Assembly · ⑩ Writer · ⑫ Linter · ⑭ Ledger** | The whole data model falls out of ⑨. ⑫ is pure functions, testable today. ⑭ closes the loop | **Nothing** |
| **2** | **⑧ Work Order · ⑬ Review Room** | One item can now go end to end against mocks | Nothing |
| **3** | **⑮ Hygiene · ⑯ Publisher** | Real output, real attribution stamps | SES production · CMS write path |
| **4** | **⑤ Verifier** | Replaces mocked facts with real ones | **Q3 — service principal** |
| **5** | **② Listener · ③ Trend · ④ Claim · ⑥ Angle · ⑦ Board** | The intake half | **Q1, Q2, Q4, Q10** |
| **6** | **⑪ Visual Desk · ⑰ Comment Desk** | The two genuinely new capabilities | **Q5, Q6, Q8** |
| **6b** | **⏱ Daily track** (§5A) | **A second trigger, a track flag and an expiry timer over stations already built.** ⑰ comments need none of it — 🟢 they are already outside the gate. Cheap once ⑬ and ⑯ exist; pointless before the intake half is live | **Q13** + phases 2, 3, 5 |
| **7** | **⑱ Meter** | Needs the app live for the event stream | Product event tracking |

**Start at ⑨.** Listing every `{brace}` and naming its source produces the data model for all eighteen
stations, and it is the one piece of work that no open question touches.

---

*Document: `content-engine-runtime-spec.md` · 2026-09-08 · An addition to the content engine specification,
not a revision of it. Every station cites the file and section it implements; every station marked **NEW**
states what it adds and why nothing existing covers it. Thirteen open questions in §8 are flagged rather than
resolved — including §5A, the daily track, which is proposed in full and named as needing sign-off.*
