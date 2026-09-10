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
   quietly.** Eighteen are open. None blocks the first four stations.

**Not in scope here:** the Website, SEO, Performance and Email workstreams beyond where content crosses into
them; paid campaign management; video editing (`portal-build-spec.md` §11 — the DM team's editor owns it).

---

## 1 · The line, end to end

Five acts. Eighteen stations in the line, and **three that sit across it** — §7A. One item passes through the
eighteen in order; a published analysis re-enters at Act 3 once per derivative. The other three touch every
act and belong to no single one, which is exactly why a diagram drawn as a line loses them.

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

╔═══════════════════════════════════════════════════════════════════════════════╗
║  ACROSS ALL FIVE — §7A         these belong to no single act                  ║
╚═══════════════════════════════════════════════════════════════════════════════╝

   ⑲  THE TRUTH LAYER        canonical facts ──► ⑨ context AND ⑫ rule set
                              ◄── reads ⑯ publish log → stale flags on live pages
                              ⛔ an enumerated allowlist, never a glob
                              🔴 GAP · "1M+" vs "1 million" — the match, not the diff

   ⑳  THE DASHBOARD          Pipeline · Organic · Paid · Funnel
                              reads ⑬ ⑭ ⑯ ⑱ ⑲ ㉑ · read Wed, 30 min
                              ⛔ a failed collector is "not collected", never 0

   ㉑  THE OUTREACH DESK      relationships, not content · monthly targets
                              ◄── auto-fed by ② (threads) and the event stream (clusters)
                              ⛔ the portal drafts. a person sends. no send path exists

   ㉒  THE PERFORMANCE DESK   ◄── reads ⑱ per item ──► proposes ⑧ mix, ⑦ ranking
                              the positive loop. ⑭ learns from the reviewer,
                              this learns from the reader · monthly
                              ⛔ proposes, never applies · format/channel/pillar only
                              🔴 needs utm_content = content_item.id, from the first publish
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

> **⚠ Corrected 2026-09-09 — that last clause undersells them.** Opening
> `content/assets/visuals/social/a09_no_card.svg` shows a **parameterised template**: fixed palette, fixed
> geometry, and five text slots. **The library is a pipeline missing its runtime, not a set of one-offs**, and
> route (b) below is materially cheaper than this section implies.
>
> **The tell is one number.** The red dot period is placed at `cx="582.16"` — somebody measured the rendered
> width of *"$100 to start."* by hand. **That is the work a generator has to do**, and it is why "fill the
> template" is not sufficient on its own. Full anatomy, the six pieces a pipeline needs whichever route is
> chosen, and the two constraints that bind it:
> **[`content-engine-integrations.md`](content-engine-integrations.md) §6.**

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
| **⑲ Truth Layer** | **Protective, numerator side** | A wrong fact here is not one error — it is the same error generated into ~23 items, linted *as correct*, and published. The only defect class `FACT_WRONG` cannot catch, because it is judged against this table |
| **⑳ Dashboard** | **Where `x` is read** | ⑱ produces the number; this produces the decision. The `x@6 > 2` gate is taken here, and the ⑬ ceiling becomes visible here two weeks before it binds |
| **㉑ Outreach Desk** | **Numerator** | The **only** station that moves `p` through its largest channel — 6.5× of citations come from third-party pages, and ⑯ cannot produce one |
| **㉒ Performance Desk** | **Numerator, compounding** | **The only station that raises return *per item* rather than adding items.** Every other numerator station adds supply at a fixed rate; this one changes the mix at no extra production cost. It is to ⑱ what ⑭ is to ⑬ — the loop that makes the measurement worth taking |

---

## 7A · The four stations that sit across the line — ⑲ ⑳ ㉑ ㉒

Eighteen stations describe an item's journey. **These four do not sit between two others — each of them
touches every act, which is why a diagram drawn as a line misses them.**

```
   ⑲  THE TRUTH LAYER      canonical facts → ⑨ context AND ⑫ rule set
            │               reads back from ⑯ → stale flags on live pages
            │               ⛔ allowlist, never a glob
            │
   ⑳  THE DASHBOARD        Pipeline · Organic · Paid · Funnel
            │               ⛔ a failed collector is "not collected", never 0
            │
   ㉑  THE OUTREACH DESK    relationships, not content
                            ⛔ the portal drafts. a person sends. no send path exists

   ㉒  THE PERFORMANCE DESK  what kind of item earns → ⑧ mix, ⑦ ranking
                            ⛔ proposes. never edits. never touches voice or rules
                            🔴 blocked on one line: utm_content = item id
```

**Why they were missed, stated plainly:** the line was drawn from the shape of one content item, and none of
these four produces one. ⑲ produces the *inputs* to every item, ⑳ produces the *reading* of all of them,
㉑ produces a relationship that may never become an item at all, and ㉒ produces **a change to the mix of
items made next time.** ⑲ ⑳ ㉑ are specified by Joy (`portal-build-spec.md` §3.1, §3.8, §3.9) and are in the
Definition of Done.

**㉒ is the one that is genuinely absent, and its absence is structural.** ⑭ the Ledger is the engine's only
loop and it learns **from the reviewer** — a list of mistakes not to repeat. **Nothing learns from the
reader.** ⑱ computes `x` and no station consumes it. So the engine compounds at not being wrong, and never
compounds at being read.

---

### ⑲ The Truth Layer

| | |
|---|---|
| **What** | Ingests the canonical specs from Drive, versions them on ingest, and extracts a **canonical facts table** — every number, claim and prohibition, each carrying its source file and its line. **That one table is both the generation context at ⑨ and the linter's rule set at ⑫.** On change it diffs against the previous version; every published item containing a superseded value is flagged with its **channel, URL and publish date**. |
| **When** | On ingest, and on every change to a source file. **Joy specifies the behaviour, not the cadence** — proposed: poll the Drive folder hourly, plus a manual re-ingest. **Open question 14.** |
| **Why** | *"`1M+ → 25M+` is currently wrong in roughly six places across Figma and the live site, and nobody has a list. That failure repeats every time a number moves. This module is the reason it stops repeating."* |
| **The source list — nine files** | `site-truth.md` · `.agents/pricing-model.md` · `.agents/brand-guidelines.md` · `.agents/icp-personas.md` · `.agents/icp-copy.md` · `.agents/security-posture.md` · `.agents/caspr-brand-integration-brief.md` · `docs/product/document-taxonomy.md` · `docs/product/gate-output-spec.md` |
| **⛔ An enumerated allowlist, never a glob** | Joy excludes `content/caspr-help-content-repository.xlsx` and states the general rule: ***"a file that instructs writers is not the same as a file that states facts."*** <br>**The runtime consequence:** if the ingest walks a folder, anyone who drops a file into it has silently amended the truth. **The nine paths are enumerated in config and a tenth requires a code change**, because Joy's own reason is that when the linter's rules and the generator's context come from the same wrong place, ***nothing downstream can catch it.*** |

#### 🔴 The diff is the easy half. The match is the hard half — **NEW**

`CanonicalFact` changing from `1M+` to `25M+` is a two-line diff. Finding it on a live page is not.

| A writer wrote | A literal match finds it |
|---|---|
| `1M+ sources` | ✅ |
| `1 million sources` | ❌ |
| `over a million documents` | ❌ |
| `1,000,000+` | ❌ |

**Three of the four are missed, and Joy's own example is the case that proves it** — the figure is wrong in
*roughly six* places, and "roughly" is the tell that nobody could enumerate them.

**Proposal:** each `CanonicalFact` carries `surface_forms[]` — the literal renderings a writer might plausibly
use. Generated once at ingest, **confirmed by a person the first time the fact is seen**, then reused for
every future sweep at no cost. The stale sweep matches on **any** surface form.

> **This is the one place in the engine where a recall failure is invisible.** A missed linter rule shows up as
> a rejection; a missed stale flag shows up as a buyer reading a wrong number and nobody knowing.

#### What happens to items already in flight — three cases, and they are not the same

A fact can change on a Saturday, with items at every stage.

| Where the item is | What happens | Why |
|---|---|---|
| **In the review queue** (⑬) | **Re-linted against the new table. Fails → pulled, back to ⑩.** The reviewer's queue count drops | It was generated against a context that is now wrong. A reviewer approving it would be approving a known error |
| **Approved, not yet published** (between ⑬ and ⑯) | **Held. Back to ⑩, then re-reviewed** | Approval is a decision about a specific body of text. The regenerated body is different text, so the decision does not carry |
| **Published** (past ⑯) | **`StaleFlag` raised** — `publish_record_id`, `fact_key`, `old_value`, `new_value`, `raised_at` | It is now a live inaccuracy on a public page, and Joy's health metric treats it as one |

**The cost of getting this wrong is asymmetric.** Publishing a number we already know is wrong is worse than
losing two review minutes, and it is much worse for a company whose position is *cited, or it does not ship*.

| | |
|---|---|
| **Health metric** | **`Stale flags open: 0`.** *"Anything over 7 days old is a live inaccuracy on a public page"* — `operations-runbook.md` §10 |
| **⚠ It must be visible** | A fact table nobody can see is a fact table nobody trusts. **Open stale flags render in the Pipeline band at ⑳**, which is where the seven-day clock is actually read |
| **Data** | `TruthDoc{source_path, version_hash, ingested_at}` · `CanonicalFact{key, value, source_doc, source_line, effective_from}` + `surface_forms[]` **NEW** · `StaleFlag{publish_record_id, fact_key, old_value, new_value, raised_at, resolved_at}` |
| **Joy** | `portal-build-spec.md` §3.1 · §4 · `operations-runbook.md` §10 |
| **→ x** | **Protective, and it protects the numerator.** Every downstream station consumes this table, so a wrong fact here is not one error — it is the same error generated into ~23 items a week, linted *as correct*, and published. And it is the only defect class the reject codes cannot catch, because `FACT_WRONG` is judged against exactly this table. |

---

### ⑳ The Dashboard

| | |
|---|---|
| **What** | *"One page. Four bands."* — **Pipeline · Organic · Paid · Funnel.** |
| **When** | Read continuously. **The decision moment is the Wednesday review, 30 minutes** (`operations-runbook.md` §9) — which is also where ⑦'s topic pick happens, so the reading and the commissioning sit in the same half hour deliberately. |
| **Why** | The Funnel band is, in Joy's own emphasis, ***"the band that proves RoI."*** The other three exist so that a bad funnel number can be traced to a cause rather than argued about. |

**The four bands, their sources and — the part that is missing today — their freshness:**

| Band | Contents | Source | Lag | Write |
|---|---|---|---|---|
| **Pipeline** | Queue state · items per reviewer · minutes outstanding · reject rate by reason · linter defects · **stale flags from ⑲** | The portal's own tables | **Live** | — |
| **Organic** | Publish log by channel · Search Console impressions, clicks, positions · LinkedIn Company Page metrics · **self-reported** personal-profile reach | GSC API · Community Management API · a weekly form | **2–3 days** (GSC) · **7 days** (the form) | — |
| **Paid** | Spend, clicks, CPC, conversions, CAC by campaign | Google Ads · Meta · LinkedIn Ads | ~1 day | **⛔ Read-only** (§6.3) |
| **Funnel** | `prompt_submitted → signup_completed → analysis_completed → payment_succeeded`, split by `utm_campaign` and `icp_hint` | Product event stream (`tracking-spec.md`) | Depends on the stream | — |

#### ⛔ A failed collector renders as "not collected". **Never as zero** — **NEW**

`MetricSnapshot{source, metric, value, dimension, captured_at}` is a **snapshot table, not a live query** —
which means there is a collector per source, on a cadence, and a collector can fail.

> **A zero from a failed collector is the most dangerous cell on this page.** It reads as *"the channel is
> dead"*, and the action it invites is killing a channel that is working.

**This is Trap 1 in a different costume.** Trap 1 inflates the denominator with an internal transfer price and
kills a working channel; a null rendered as zero empties the numerator and kills the same channel by the same
logic. Both are arithmetic that looks fine on the page.

**Three requirements:** every band cell renders its `captured_at` · a stale or failed collector renders as
**"not collected"** with the age of the last good value · **a null is never coerced to 0** at any layer,
including the chart.

#### The one human input on the page, and it is labelled

**Personal-profile post analytics are unavailable via API** — *"Nobody solves this, including the commercial
schedulers"* (§6.1). v1 takes self-reported impressions through a **two-field weekly form**.

**It renders differently from every other cell:** marked *self-reported*, carrying the date entered and the
person who entered it. Joy's standard is *"directional, and honest about being directional"* — and a
self-reported number sitting in the same visual weight as a Search Console number is not honest about it.

| | |
|---|---|
| **The eight health metrics render here** | `operations-runbook.md` §10 — reject rate 5–15% · review completion 100% · review time 2–4 min · linter defects 0 · **stale flags 0** · activation → 25% · complaint rate <0.1% · CAC <$300. **Each row carries its stated action**, because a threshold without a response is a number people learn to scroll past |
| **The RoI target, rendered so it can fail** | *"By the end of month three: cumulative attributed revenue ≥ 1.5× cumulative spend, with ≥60% attributed to owned channels."* **Both halves shown.** If owned share comes in below half, *"the machine is not working and more media will not fix it"* |
| **Joy** | `portal-build-spec.md` §3.8 · §6.1 · §6.3 · §4 · `operations-runbook.md` §9 · §10 |
| **→ x** | **This is where `x` is read, not computed** — ⑱ computes it. The distinction matters: the Meter produces a number, the Dashboard produces a decision, and the scale gate `x@6 > 2` is taken here. **The Pipeline band is also the only place the ⑬ ceiling becomes visible before it binds** — review completion falling below 90% two weeks running is the signal to cut volume, and it arrives before anything is missed. |

---

### ㉑ The Outreach Desk

| | |
|---|---|
| **What** | *"The human work, tracked and target-driven. **Not content — relationships.**"* Seven entity kinds: guest-blog prospects · podcast targets · influencers and practitioners · testimonial participants · community threads worth answering · directory and listing submissions · **enterprise domain clusters** (3+ users on one domain, from `tracking-spec.md`). |
| **When** | Continuous, against **monthly targets** (`operations-runbook.md` §6). One row has its own clock: domain clusters are worked *"within 7 days of appearing"*. |
| **Why** | The three ways of appearing in `p` are weighted equally, and **⑯ can only ever produce one of them.** The other two — cited in an AI answer, listed on a third-party page ranking page one — are made here. |

#### ⛔ The hard boundary — the portal drafts, a person sends

> *"The portal **sources and drafts** — research the target, draft the approach, surface the thread.
> A person **sends and talks**."*

**The runtime reading: there is no send capability on this path, and none is built.** No email integration, no
LinkedIn message, no form submission. A draft lands in the target's record and a person takes it from there.

**Same class as communities at ⑯, and for the same reason.** An automated approach to a named human is spam,
and the single asset being built by every other station is the credibility that spam destroys. A send button
here would be one configuration change away from a mass send, which is exactly why the button does not exist.

#### Two feeds are automatic. Five are entered — **NEW**

| Entity | Where the row comes from |
|---|---|
| **Enterprise domain clusters** | **Automatic** — product event stream, 3+ signups on one domain. Raises a row with a 7-day clock |
| **Community threads worth answering** | **Automatic** — ② the Listener already reads these rooms daily. **Nothing else consumes that half of its output today** |
| Guest-blog prospects · podcast targets · influencers · testimonial participants · directories | Entered by a person |

**Those two feeds are the whole reason this is a station and not a spreadsheet.** Everything else could live in
a shared sheet; a domain cluster appearing on a Tuesday and being worked by Friday could not.

#### ⚠ The overlap with ⑰ must be resolved, or the same thread is worked twice

⑰ the Comment Desk produces *which post, which fact, which person*. ㉑ tracks *community threads worth
answering*. **Read literally, both stations own the same Reddit thread.**

**One field decides, and it is the guard rail already proposed at open question 8:**

| `the_fact_to_bring` | Owner | Because the action is |
|---|---|---|
| **Present** | **⑰ Comment Desk** | A comment carrying a finding. One-shot, 1–2 min, outside the review gate |
| **Empty** | **㉑ Outreach Desk** | Becoming a real participant in a room. Ongoing, owned, staged |

**This is the same guard rail doing a second job.** Joy's reason for it at ⑰ was the astroturf risk — a
comment with nothing to bring *is* astroturf. The same test also routes correctly: a thread we have nothing
sourced to say about is not a comment opportunity, it is a relationship we have not built yet.

#### Owner — and two rows have no owner today

`operations-runbook.md` §6 assigns every monthly target. **§2A then records that the TL has departed** and the
earned-media hire is **8–12 weeks** out.

| Target | Owner | Status now |
|---|---|---|
| Guest posts placed — 2/month | ~~TL~~ | **Nobody can pitch. Lapses** |
| Podcast appearances booked — 1/month | ~~TL~~ | **Nobody can pitch. Lapses** |
| Directory and listing submissions — 10/month | SEO | Runs — *"SEO can submit a form"* |
| Community threads answered — 20/month | Social | Runs |
| Backlink outreach conversations — 15/month | SEO | Runs |
| **Org** domain clusters — all 3+, within 7 days | Joy | Runs |
| Expert testimonials — 12 recorded, 10 delivered | Social + SPOC | Runs, weeks 1–8 |

**The station renders an unowned row as unowned. It does not hide it and it does not reassign it.** Joy's
words: *"These simply do not happen, and that should be **a decision rather than a discovery**."* An unowned
target that disappears from the screen is precisely how it becomes a discovery.

**Open question 7 lands here too.** Outreach was dissolved as a workstream and redistributed — guest posts and
directories to **SEO**, podcasts and community threads to **Content & Social**. So **㉑ is a station without a
workstream**: one object, rows owned across two tabs. The `owner` field carries it; no third workstream is
created.

| | |
|---|---|
| **Per row** | `owner · stage · next_action · next_action_at · last_contact · outcome` — Joy's six, unchanged |
| **Stage model** | **Not specified.** Proposed minimal: `identified → researched → drafted → sent → in conversation → won │ lost │ lapsed`. Only `drafted → sent` crosses the human boundary. **Open question 15** |
| **Health** | A row whose `next_action_at` is in the past is the outreach equivalent of a stale flag, and it renders in the Pipeline band at ⑳ next to them. *"Backlink outreach conversations opened: 15"* is a count of rows that moved, not rows that exist |
| **⛔ On backlinks** | *"Paid link-building is a penalty risk and is off-brand for a company selling defensibility."* The four routes are **directories, digital PR, guest posts, original research** — and *"Caspr's own output is the strongest link magnet available."* **The best row in this station is generated by ⑯**, which is the loop between the two |
| **Joy** | `portal-build-spec.md` §3.9 · §4 · `portal-design-spec.md` §5 · `operations-runbook.md` §2A · §6 |
| **→ x** | **Numerator — and the only station that moves `p` through its largest channel.** ***6.5× of citations come from third-party pages ranking page one***, and guest posts, directory listings, roundups and podcast pages *are* third-party pages. **No amount of publishing at ⑯ produces a single one of them.** With `p` at a baseline of **0 on every question tested**, this is the station with the most headroom in the engine — and the one currently missing two of its seven owners. |

---

### ㉒ The Performance Desk — **NEW · the engine has no positive loop**

| | |
|---|---|
| **What** | Reads what each published item actually earned, finds which **kinds** of item earn most, and proposes a **mix change** to ⑧ and a **ranking hint** to ⑦. |
| **When** | **Monthly.** Never weekly — §7A.4.2. |
| **Why** | **⑭ the Ledger is the only loop in the engine, and it is entirely negative.** It learns from what a *reviewer rejected* — a list of mistakes not to repeat. **Nothing learns from what an audience rewarded.** ⑱ measures `x` and stops there; no station consumes its output. So the engine gets steadily better at not being wrong, and never better at being read. |
| **The symmetry, and it is the argument for building it** | **⑭ learns from the reviewer. ㉒ learns from the reader.** Same shape — observe an outcome, extract a pattern, feed it forward — and Joy already calls ⑭ *"the portal's compounding asset."* This is the other half of the same asset |
| **Joy** | Extends `content-calendar.md` §4 (the pillar shares) · `tracking-spec.md` Part 2, Part 4 · ⑯'s attribution stamp · ⑱ |
| **→ x** | **Numerator, and it is the only station that compounds it.** Every other numerator station adds supply at a fixed rate; this one raises the *return per item* at no extra production cost. |

#### 🔴 It is blocked on one line, and that line is missing today

`tracking-spec.md` Part 2 captures `utm_source`, `utm_medium`, `utm_campaign`, **`utm_content`**, `utm_term`.
⑯'s attribution stamp says *"every outbound link carries `utm_*` and `icp_hint`"* — **but it never says what
goes in `utm_content`.** Part 4 item 5 and the cohort definition both attribute at **`utm_campaign`** level.

> **Campaign-level attribution can tell you LinkedIn earned $4,000. It cannot tell you which post did.**
> Every question this station exists to answer is a per-item question.

**The fix is one assignment in ⑯:**

```
utm_content = content_item.id
```

**That is the entire dependency.** It costs nothing, it breaks nothing, and **it must be in place before the
first item publishes** — because attribution cannot be applied retroactively to a link already in someone's
feed. **Miss it at launch and the first three months are permanently unmeasurable at item level.**

**⚠ This is ⑯'s own argument turned one notch finer.** The stamp exists because *"a published item with an
unstamped link is a permanently unattributable acquisition."* An item stamped only to its campaign is
permanently unattributable **as an item**.

#### The signal ladder — and the primary is deliberately not the fast one

| | Signal | Speed | Use |
|---|---|---|---|
| **1** | **Revenue** — `x@3`, `x@6` | 3–6 months | **The truth, and far too slow to steer a monthly mix.** Used to audit the loop, not to run it |
| **2** | Signup | weeks | Confirms 3 |
| **3** | **`utm_content` → `prompt_submitted`** | **days** | ⭐ **THE PRIMARY.** The first step of Joy's own funnel, attributable per item |
| **4** | Third-party pickup (`p`) | monthly | ㉑'s channel. Reported, never mixed into 3 |
| **5** | ~~Likes, reactions, follows~~ | hours | ⛔ **Not an input. §7A.4.3** |

**Why 3 and not 5, stated so it survives an argument.** A reaction costs the reader nothing. **Clicking into a
prompt costs intent** — it is the first moment a reader does something that could end in revenue, and
`tracking-spec.md` puts `prompt_submitted` at the head of the funnel for exactly that reason. Between a post
with 400 reactions and 2 prompts and a post with 30 reactions and 19 prompts, **the second one is the one to
make more of**, and any metric that says otherwise is measuring applause.

#### ⛔ Three guard rails, and without them this station is actively harmful

##### 1 · It may propose. It may never edit.

**The mix proposal goes to a human. It is never applied.**

| ㉒ may write to | ㉒ may **never** touch |
|---|---|
| ⑧'s **mix** for next cycle — how many of each type | ⑨'s context blocks |
| ⑦'s **ranking hint** — a sort order on candidates a human still picks from | ⑫'s linter rules |
| ⑳ — the reading | **The voice lanes** (`audit.md` §5) |
| | ⑭'s active failure modes |

**Why the second column is absolute.** ⑫ and the voice lanes are what make the output *ours*. A loop allowed
to edit them optimises the brand away one approved proposal at a time, and **nobody would be able to point at
the meeting where it was decided.** ⑦ and ⑧ are where volume is allocated; that is a planning decision and a
human already makes it weekly.

##### 2 · ⚠ It will want to break two of Joy's own caps. Both are floors and ceilings, not defaults.

`content-calendar.md` §4 sets twelve-week shares. **Two of them are deliberately held *below* what performance
would choose:**

| Pillar | Share | Joy's reason for the cap |
|---|---|---|
| **3 · From Weeks to Minutes** | **~8–10%** | *"Supporting, not leading — speed commoditises and cannot carry the position"* |
| **2 · Analytical AI** | **~18–20%** | **Category education only.** ⛔ *"Never a hero, headline or ad"* — naming the generative category concedes we are in it |

> **A performance loop will find both of these and push on them**, because *"15 minutes instead of three
> weeks"* and *"unlike ChatGPT"* are the two most immediately legible things Caspr can say. **They are legible
> precisely because they are the commodity claims** — which is Joy's argument for capping them.
>
> **The retired-copy list is the proof this is not hypothetical.** *"Your competitors are still waiting for
> the research"* was retired for being *"speed-led and combative"* — and it is exactly the line an engagement
> signal would have promoted.

**So the proposal is bounded, not free:** each pillar carries a **floor and a ceiling taken from §4**, the
proposal may move a share by at most **±5 points per cycle**, and **pillar 2 cannot be raised at all by this
station** — its cap is structural (`/vs/*`, social and founder content only), not a quantity.
**The two numbers are Joy's to set — open question 22.**

##### 3 · The volume is too small to say most things, and the honest response is to scope it

| Dimension | Items in twelve weeks | Can the loop speak? |
|---|---|---|
| **Channel** — blog · LinkedIn · X · email · community | **~420–530** | ✅ **Yes** |
| **Format** — search answer · voiced variant · thread · atom · comment | ~420–530 | ✅ **Yes** |
| **Pillar** — the five | ~420–530 | ✅ **Yes** |
| **ICP** — the eight | ~50–65 each | ⚠ **Marginal** |
| **Origination** — anything a person wrote from scratch | **30** | ❌ **No** |
| **Type A** — published analyses | **3–6** | ❌ **Absolutely not** |

> **Declaring "pricing analyses outperform market-sizing analyses" off four data points is not a finding. It
> is a coin landing heads twice.**

**The rule that follows:** **the loop speaks about *format, channel and pillar*. It never speaks about a
topic.** ⑦ stays a human pick on evidence, exactly as Joy specified — *"⚠ A HUMAN PICKS. Never the machine."*
The ranking hint ㉒ sends ⑦ is a **sort order**, never a shortlist, and never a score on the topic itself.

**Minimum sample, proposed:** no cell speaks below **12 items across at least 4 weeks**. Below that the cell
renders **"not enough yet"** — the same discipline as ⑳'s *"not collected, never 0"*, and for the same reason.
**Number is Joy's — open question 22.**

#### The parent confound — the fan-out makes naive measurement wrong

**One published analysis becomes 16–23 items.** If that analysis's topic happened to land, **every derivative
of it looks good** — and a loop reading them as independent observations will conclude that *the format* works
when in fact *the parent* worked.

**With 3–6 parents in a quarter, this is not a small correction. It is most of the variance.**

**So every measurement is computed within-parent, not across the pool:** for each parent, rank its own
derivatives against each other; the loop reads **the ranking**, never the raw number. A format that wins
inside most parents is a real finding; a format that only wins inside the one parent that did well is the
parent, and the within-parent comparison shows that immediately.

**Comments (⑰) and daily-track items (§5A) have no parent** and are pooled separately — they are the only
items measurable on their own terms, and they are also the highest-volume ones.

#### What it emits — a typed proposal, and there is no free-text field

**Same position as the index engine's renderer, for the same reason** — a proposal a human approves in two
minutes must be inspectable at a glance, and prose is where an unsupported claim hides.

```
MixProposal {
  cycle:            "2026-11"
  dimension:        "format" | "channel" | "pillar"
  cell:             "linkedin_voiced_variant"
  n_items:          47            # ≥ the minimum, or no row
  n_weeks:          6
  within_parent_rank_median: 2    # of 5
  prompts_per_item: 3.1
  baseline:         1.8
  proposed_delta:   +4            # points of share, |Δ| ≤ 5
  floor / ceiling:  8 / 25        # from content-calendar §4
  bounded_by:       null | "ceiling" | "pillar_2_structural"
}
```

**Every field is a number, an enum or a computed value. There is no `rationale` field** — if the numbers do
not make the case, the case is not there.

#### Its own kill condition, because a loop that cannot be wrong is not a loop

**⑭ has health thresholds and states the direction of the fix. This one needs the same.**

| Signal | Reading | Do this |
|---|---|---|
| **Proposals rejected 3 cycles running** | The loop is miscalibrated — or it is finding things that are true and unusable, which is the same problem | **Fix the loop, not the reviewer** — ⑭'s own rule |
| **Every proposal approved, always** | Rubber-stamping, or the deltas are too small to matter | Widen the bound or audit a cycle |
| **`x@6` does not move after 2 quarters of approved proposals** | **The primary signal is not predicting revenue** | **Stop. Signal 3 is wrong and the ladder needs re-deriving from signal 1** |

**The last row is the one that matters.** The whole station rests on the assumption that `prompt_submitted`
predicts revenue. **That assumption is testable, and it is tested against `x@6` — the metric it is not allowed
to steer.**

**And the freeze applies here too.** `p`'s basket is frozen for a year because *"a metric you can edit when you
dislike the reading is not a metric."* **The same holds: the ladder is fixed for a year.** Re-deriving it
because of the third row above is a deliberate, recorded decision — never a quiet retune.

#### §7A.4 · Why monthly, and why the numbers cannot come faster

| | |
|---|---|
| **The cycle is monthly** | Joy's shares are **twelve-week** allocations. A weekly reweight on 35–44 items is chasing noise, and it would put a fourth notification into a week designed for two |
| **The first proposal is at week 12, not week 4** | Below the minimum sample every cell reads *"not enough yet"*. **That is the correct output, and it should be shipped rather than worked around** |
| **What runs from day one** | The **measurement**, not the proposing. `utm_content` stamps from the first publish, and the data accrues. **The station is cheap to run early and expensive to skip early** |

---

## 8 · Open questions — for Joy

**None of these blocks stations ⑧ through ⑯, which can be built today. ⑲ is now the exception worth naming:
it is a phase-1 dependency and three of its details are open — question 14.**

**Question 1 — the watchlist — is now CLOSED.** ㉓ the Source Register in
[`content-engine-operating-model.md`](content-engine-operating-model.md) enumerates it, and separates the
three kinds of source that Q1 had collapsed into one: **listening** (Reddit, forums, trade), **answer-engine
surfaces** (ChatGPT, Perplexity, AI Overviews — where `p` is measured, never a source of fact), and **fact**
(Caspr, through ⑤, and nothing else). **Questions 24 to 28** live there too.

**Questions 17 to 21 live in [`content-engine-integrations.md`](content-engine-integrations.md) §10** — the
consolidated register of what connects, with what auth, and what is blocking. They continue this numbering:
**17** one service principal or two (the index engine's safety test needs `trigger_generation` **absent**,
this engine needs it present) · **18** `VISUAL_OVERFLOW` as a fifth control token · **19** HTML + headless
Chromium or SVG templates · **20** font embedding licences · **21** does ⑲'s stale sweep reach images.

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
| **14** | **⑲ — three things the spec does not settle.** (a) **Re-ingest cadence** — you specify the behaviour, not the clock; hourly poll proposed. (b) **`surface_forms[]`** — a literal diff finds `1M+` and misses *"1 million"*, *"over a million"*, *"1,000,000+"*. Proposed: generated at ingest, **confirmed by a person once per fact**, reused free thereafter. Is that confirmation yours? (c) **Approved-but-unpublished items on a fact change** — proposed **held and regenerated**, because an approval is a decision about specific text | ⑲ | (b) is a recall failure that is invisible by construction, and (c) trades review minutes against a known-wrong page |
| **15** | **㉑ — the stage model, and what a lapsed target looks like.** Six fields are yours; the stages are not. Proposed: `identified → researched → drafted → sent → in conversation → won │ lost │ lapsed`. And with two targets currently unowned (guest posts, podcasts — the TL's), the station **renders them as unowned rather than hiding them**, on your own words: *"that should be a decision rather than a discovery"* | ㉑ | Whether a lapsed target stays on screen is a management call, not a build one |
| **16** | **⑳ — does the Dashboard ship with three bands or four?** The Funnel band is *"the band that proves RoI"* and it depends on the product event stream, which is not live. Options: (a) ship three and add the fourth on the stream, (b) ship four with Funnel rendered **"not collected"** — which is the rule §7A already sets for every other failed collector | ⑳ | (b) is honest and consistent; (a) risks the page shipping without the band it exists for |
| **22** | **㉒ — the three numbers that bound the loop.** (a) **Max share move per cycle** — proposed **±5 points**; (b) **minimum sample** before a cell may speak — proposed **12 items across 4 weeks**, below which it renders *"not enough yet"*; (c) **the floors and ceilings per pillar**, taken from `content-calendar.md` §4. **⚠ And the one that is not a number:** pillars 2 and 3 are capped *below* what performance will choose, deliberately — proposed that **㉒ can never raise pillar 2 at all**, because its cap is structural (`/vs/*`, social and founder content), not a quantity | ㉒ | These are the bounds on a machine allowed to change your allocation. Setting them is the decision |
| **23** | **㉒ — is `prompt_submitted` the right primary signal?** Revenue is the truth and is 3–6 months slow; reactions are hours-fast and measure applause. Proposed primary is **`utm_content` → `prompt_submitted`** — the first step of your own funnel, where the reader spends intent rather than a click. **The assumption is testable:** if `x@6` does not move after two quarters of approved proposals, the signal is wrong and the ladder is re-derived. **And like `p`'s basket, the ladder is frozen for a year** — *"a metric you can edit when you dislike the reading is not a metric"* | ㉒ | It decides what the engine optimises toward, which is a positioning question before it is a metrics one |

---

## 9 · Build order

Sequenced so nothing waits on an answer it does not need.

| Phase | Stations | Why here | Blocked on |
|---|---|---|---|
| **0** | **⑲ Truth Layer — ingest and facts table only** | **Moved to the front, and it is a correction.** ⑨'s context and ⑫'s rule set are both *this table*; building either against hardcoded facts means building them twice. Ingest, version, extract, allowlist — **no stale detection yet**, which needs ⑯ | **Nothing.** Q14 refines it; it does not block it |
| **0b** | **㉓ Source Register · ㉖ Roster · ㉗ Narrative Register** | **Three tables and no code.** ㉓ closes Q1 and unblocks phase 5; ㉗ is two fields on `ContentItem` that ⑨ needs from the first draft | **Nothing.** Q1 answered in ㉓ |
| **1** | **⑨ Assembly · ⑩ Writer · ⑫ Linter · ⑭ Ledger** | The whole data model falls out of ⑨. ⑫ is pure functions, testable today. ⑭ closes the loop | **Phase 0** |
| **2** | **⑧ Work Order · ⑬ Review Room** | One item can now go end to end against mocks | Nothing |
| **2b** | **㉔ Placement Matrix · ㉚ Content Inventory** | The matrix constrains the draft, so it must exist before ⑩ is wired to real channels | Phase 2 |
| **3** | **⑮ Hygiene · ⑯ Publisher** | Real output, real attribution stamps | SES production · CMS write path |
| **3b** | **⑲ stale detection + `surface_forms[]`** | Needs `PublishRecord` to exist before there is anything to sweep. **Held until phase 3 for that reason alone** — the facts table from phase 0 is already earning by then | Phase 3 · **Q14(b)** |
| **3c** | **㉒ — the stamp only.** `utm_content = content_item.id` in ⑯ | **One assignment, and it must ship with the first publish.** Attribution cannot be applied retroactively to a link already in somebody's feed — miss it and the first three months are permanently unmeasurable at item level | **Nothing.** Ships with phase 3 |
| **3d** | **㉙ Provenance Check** | **Sits between ⑮ and ⑯ and fails closed.** Cheap, and the thing it catches is a legal breach | Phase 3 |
| **4** | **⑤ Verifier** | Replaces mocked facts with real ones | **Q3 — service principal** |
| **5** | **② Listener · ③ Trend · ④ Claim · ⑥ Angle · ⑦ Board** | The intake half | **Q1, Q2, Q4, Q10** |
| **5b** | **㉑ Outreach Desk** | The object and the entered rows need nothing. **Its two automatic feeds do** — community threads come from ②, so it lands with the intake half | Phase 5 · **Q7, Q15** |
| **5c** | **㉕ Amplify Register** | Needs ② surfacing posts to match against | Phase 5 · **Q28** |
| **6** | **⑪ Visual Desk · ⑰ Comment Desk** | The two genuinely new capabilities | **Q5, Q6, Q8** |
| **6b** | **⏱ Daily track** (§5A) | **A second trigger, a track flag and an expiry timer over stations already built.** ⑰ comments need none of it — 🟢 they are already outside the gate. Cheap once ⑬ and ⑯ exist; pointless before the intake half is live | **Q13** + phases 2, 3, 5 |
| **6c** | **The creative pipeline** — chart renderer, template layer, text measurement, rasteriser, storage | **⑪ produces nothing without it, whichever route Q5 picks.** Six pieces, one and a half of which exist — [`content-engine-integrations.md`](content-engine-integrations.md) §6.3 | **Q5, Q19, Q20** |
| **7** | **⑱ Meter** | Needs the app live for the event stream | Product event tracking |
| **7b** | **⑳ Dashboard** | Three of its four bands read stations that must already be running, and the fourth reads ⑱ | Phases 3, 7 · **Q16** |
| **8** | **㉒ Performance Desk — the proposing half** | **Deliberately last, and deliberately late.** Below the minimum sample every cell reads *"not enough yet"*, so the first real proposal is week 12. **The measurement runs from day one; only the proposing waits** | Phase 3c · ⑱ · **Q22, Q23** |
| **—** | **㉘ Market Layer — USA** | **Not a build. A decision and a timezone constant** | **Q25, Q26** |

**Start at ⑲, then ⑨.** ⑲'s ingest is half a day and it is what ⑨ and ⑫ both read; going straight to ⑨ means
hardcoding facts and replacing them later in two places. After that, listing every `{brace}` at ⑨ and naming
its source produces the data model for the rest, and it is the one piece of work that no open question touches.

---

*Document: `content-engine-runtime-spec.md` · 2026-09-08 · An addition to the content engine specification,
not a revision of it. Every station cites the file and section it implements; every station marked **NEW**
states what it adds and why nothing existing covers it. Eighteen open questions in §8 are flagged rather than
resolved — including §5A, the daily track, which is proposed in full and named as needing sign-off.*

*Updated 2026-09-10 (b) — **㉓ to ㉚, the operating model**, are specified in
[`content-engine-operating-model.md`](content-engine-operating-model.md): the source register (**which closes
open question 1**), the placement matrix and per-channel formats, the amplify register and what may be done
with a competitor's post, the roster and the cross-engagement guard rails, the narrative axis, the US market
layer, the provenance check, and the full content inventory. Drawn in `content-engine-flowchart.md` §9B. The
calendar they run against is [`content-calendar-v2.md`](content-calendar-v2.md).*

*Updated 2026-09-10 — **㉒ the Performance Desk** joins §7A: the engine's **positive loop**. ⑭ learns from the
reviewer; nothing learned from the reader, and ⑱'s output was consumed by no station. It proposes a mix change
to ⑧ and a ranking hint to ⑦, and it may never edit ⑨'s context, ⑫'s rules or the voice lanes. **Blocked on one
assignment — `utm_content = content_item.id` — which must ship with the first publish or three months are
permanently unmeasurable.**​*

*Updated 2026-09-09 — **§7A adds the three stations that sit across the line**: ⑲ the Truth Layer, ⑳ the
Dashboard, ㉑ the Outreach Desk. All three are Joy's (`portal-build-spec.md` §3.1, §3.8, §3.9) and all three
were missing from the eighteen because none of them produces a content item. **⑲ moves to phase 0** — ⑨'s
context and ⑫'s rule set are the same table, and building either without it means building it twice.*
