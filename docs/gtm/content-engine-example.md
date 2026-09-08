# Content Engine — A Worked Example

*2026-09-08. One case, start to finish, through all eighteen stations.*

**Reads with:** [`content-engine-runtime-spec.md`](content-engine-runtime-spec.md) — the mechanism this example
walks through. Station numbers below (①–⑱) are its numbering.

---

## 0 · How to read this, and what is real

**This is not a hypothetical.** The case is one Joy's own documents already chose: **UK ready meals**, named in
[`index-engine.md`](index-engine.md) §1 as a genuine source disagreement, and named in
[`report-evaluation-2026-08.md`](../report-evaluation-2026-08.md) §6 as one of the three reports going on
`/samples` — *"the strongest line in the corpus, and it is the buyer's own request verbatim."*

**Every fact below is marked.** `CLAUDE.md` Rule 5.5 — traceable, or flagged as invented.

| Mark | Means |
|---|---|
| 🟢 | **Real.** Taken from a file in this repository. The file and section are cited |
| 🔵 | **Illustrative.** Invented to make the example concrete — a plausible thread, a plausible count. **Nothing downstream depends on the specific value** |

**Where the two meet:** the trend that starts this example is 🔵 — we have no live listener yet, so no real
thread exists to quote. **Everything it produces is 🟢** — the figures, the report, the lanes, the calendar
slot, the prompts and the rules are all real.

---

## 1 · The case, in one line

> 🔵 A consultant asks, in a public thread, why two research firms give different sizes for the UK ready meals
> market — and 🟢 **they are right that the numbers differ, and wrong about why.**
>
> 🟢 Most of the spread is **definitional**. But even after controlling for definition, **two sources on the
> same basis and the same base year still disagree** — `$5.86bn · 4.95% CAGR` against
> `$6.46bn · 12.4% CAGR` ([`index-engine.md`](index-engine.md) §1).
>
> **That second half is the finding, and nobody else can produce it.**

---

## 2 · The timeline

```
WEEK 4                                                    WEEK 5
─────────────────────────────────────────────────────────────────────────────────
Wed         Thu ── Sat            Mon              Tue            Wed 15:00
 │             │                   │                │                │
 ▼             ▼                   ▼                ▼                ▼
🔵thread    ②LISTENER          ④CLAIM READER   ⑥ANGLE DESK   ⑦TOPIC BOARD
 appears    ③TREND READER      ⑤VERIFIER       → Type A?      Joy picks
            velocity ↑          → DIVERGES                    + commissions
                                                              (Wednesday review)
─────────────────────────────────────────────────────────────────────────────────
WEEK 6                                                    WEEK 6 ── 7
─────────────────────────────────────────────────────────────────────────────────
Thu 06:00      Thu ── Mon 18:00      Mon 20:00      Tue ── Sun     spread
    │                 │                   │             │             │
    ▼                 ▼                   ▼             ▼             ▼
⑧WORK ORDER      ⑬REVIEW ROOM       ⑮HYGIENE      ⑯PUBLISHER    16–23 items
⑨ASSEMBLY        ⑭LEDGER            branch on     +utm/icp_hint  ⑰COMMENTS
⑩WRITER          (1 rejection)      artefact_type
⑪VISUAL DESK
⑫LINTER
─────────────────────────────────────────────────────────────────────────────────
MONTH 3                                    MONTH 6
    │                                          │
    ▼                                          ▼
 ⑱ x@3 — the fast signal              ⑱ x@6 — the scale gate
```

🟢 **Week 5–8 movement is *"Where numbers come from"*** — [`content-calendar.md`](content-calendar.md) §2.
A reconciliation story is the literal subject of that movement, which is why this case lands in this window
rather than being forced into it.

---

## 3 · Act 1 — Listen & Decide

### ① The Watchlist — what made this thread visible at all

🟢 A config table, versioned. 🔵 The relevant row:

```
{ source_id: "r_consulting",
  platform:  "reddit",
  icp_served: "consulting",
  read_method: "api_readonly",
  enabled: true }
```

**Why this matters:** 🟢 an unbounded listener drifts toward whatever is loudest. Naming the rooms is what
keeps the signal inside the ICP. The watchlist is Joy's to write — **open question 1 in the runtime spec.**

---

### ② The Listener — Thursday, off-peak

🔵 **What it read** (illustrative — the shape is real, the thread is not):

```json
{
  "text": "Client wants a UK ready meals market size. IBISWorld and Mintel are
           ~10% apart and I can't tell which to put in the deck. How do you
           handle this?",
  "platform": "reddit",
  "url": "https://reddit.com/r/consulting/…",
  "posted_at": "2026-08-26T09:14:00Z",
  "engagement": { "score": 71, "replies": 23, "velocity": "rising" },
  "author_signal": "practitioner",
  "source_id": "r_consulting"
}
```

**What it did NOT do** — 🟢 and this is a hard limit, not a preference:

> ⛔ **Never posts. Never replies. Never votes. Never follows.**
> [`portal-build-spec.md`](portal-build-spec.md) §11: *"Automated posting to Reddit, WSO, ESOMAR, PrepLounge
> or any community — **permanently out of scope, by design**."*

🟢 **X is excluded from this station** — §11 also puts *"X monitoring and analytics"* out of scope, and the
free API tier is writes-only regardless.

---

### ③ The Trend Reader — Thursday to Saturday

🔵 **What it accumulated:**

| | This week | Prior week | Verdict |
|---|---|---|---|
| Cluster: *"conflicting market size estimates"* | 31 mentions | 6 mentions | **RISING** |
| `author_signal` mix | 78% practitioner | — | **PROMOTE** |
| `icp_match` | consulting · investors | — | Both launch-relevant |

**Why velocity and not volume** — 🟢 runtime spec ③:

> A question asked 100 times every week is a **constant** — that belongs to the SEO workstream's evergreen
> pages. A question asked 31 times this week against 6 last week is a **trend**, and it has a window.

**Why the practitioner filter** — 🟢 [`docs/seo/decision.md`](../seo/decision.md) §2:

> *"`secondary research` at $9 CPC is a student. `competitive landscape analysis` at $300 is a buyer.
> **Advertisers will not pay $300 to reach an undergraduate**"* — the cleanest available filter, applied here
> to a room rather than to a keyword.

🟢 **Output:**

```json
{ "topic_cluster": "conflicting market size estimates — UK ready meals",
  "volume": 31, "velocity": "rising", "first_seen": "2026-08-26",
  "icp_match": ["consulting", "investors"], "sample_urls": [ … ] }
```

---

### ④ The Claim Reader — Monday

🟢 **Its job is to turn a topic into something Caspr can actually check.** A trend cannot be verified; an
assertion can.

🔵 **Extracted:**

```json
[
  { "statement": "UK ready meals market size",
    "asserted_value": "~$5.9bn", "basis": "retail packaged, 2024",
    "period": "2024", "source_cited": "IBISWorld" },

  { "statement": "UK ready meals market size",
    "asserted_value": "~$6.5bn", "basis": "retail packaged, 2024",
    "period": "2024", "source_cited": "Mintel" }
]
```

> 🟢 **`basis` is mandatory and load-bearing.** A claim without one is returned as unusable and never reaches
> the Verifier. [`index-engine.md`](index-engine.md) §2: *"every candidate must carry a `basis` field, and rows
> where the bases differ are classified as definitional, never as disagreement."*
>
> **This is the field that decides which of the four verdicts fires.** Everything in the next station turns on
> it.

---

### ⑤ The Verifier — Monday · **the call to Caspr**

🟢 **The call order is a rule, not a preference** — [`gtm-api-contract.md`](gtm-api-contract.md) §2:

```
STEP 1   retrieve_analysis                                          FREE
         "have we already answered this?"
         → 🟢 HIT.  "UK Ready Meals Market: Sizing and Analysis v1"
                     209 KB · Reports/Reports/Reports-md/
                     subtitle: "reconciling UK ready meals market size
                     estimates, focusing on key divergences"

         ⛔ STOP HERE. Steps 2 and 3 are not called.
```

**Why this is the whole cost case** — 🟢 §2:

> *"Most content needs a fact, and a fact should never cost a Study. A marketing engine that reflexively
> commissions research to source a market-size figure would burn the ceiling in a week and produce nothing
> better than step 2."*

🟢 **Auth on this call:** the **service principal** — a machine JWT, `principal_type: "service"`, scopes
enumerated and enforced server-side, ≤60 min, same JWKS, no token in a URL. **Not yet issued — open question
3, and it blocks this station entirely.**

🟢 **Metering:** `credits_charged: 0`, because a retrieve of an existing analysis draws nothing.
`cache_hit: true`.

#### The verdicts — and this case produces two, which is the interesting part

🟢 From the real report's own executive summary:

> *"Significant market size discrepancies are chiefly attributive to differing definitions, ranging between
> **USD 5.75 billion** for a narrow scope to **USD 8.70 billion** for broader inclusions like pizzas and meal
> kits."*

🟢 And from [`index-engine.md`](index-engine.md) §2, on the specific pair:

> *"UK ready meals: two sources, **same definition, same base year**, `$5.86bn` vs `$6.46bn`"* — filed
> explicitly under **genuine disagreement**, not definitional.

**So the station returns two rows, and they are classified differently:**

| Row | `basis` | Verdict | Why |
|---|---|---|---|
| The **$5.75bn → $8.70bn spread** | bases **differ** — narrow retail vs broad incl. pizza and meal kits | **`definitional`** | *"These measure different things. The finding is that nobody says so"* |
| The **$5.86bn vs $6.46bn pair** | bases **match** — same definition, same base year | **`diverges`** | *"These measure the same thing and do not agree"* |

> ⛔ **The engine must never report the first as the second.**
> 🟢 [`index-engine.md`](index-engine.md) §2: it is *"the exact sloppiness we sell against."*
>
> **And it is enforced structurally, not by prompt** — where two rows' `basis` values differ, the verdict is
> `definitional`. The model is never asked to make that call.

🟢 **One more gate before anything proceeds** — `gtm-api-contract.md` §1: **`source_last_verified` older than
30 days suppresses the row rather than publishing it.** *"Publishing 'this is the latest figure' without having
checked is the single most likely error."*

---

### ⑥ The Angle Desk — Tuesday

🟢 Four gates, in order:

| Gate | Result | Authority |
|---|---|---|
| **1 · Source** | ✅ Pass — a real cited analysis exists | `content-approach.md` §3 — *"cited, or it does not ship"* |
| **2 · Lane** | ✅ **Joy.** *"The analyst — findings from real analyses, the category argument, ICP pain"* | `audit.md` §5 |
| **3 · Collision** | ✅ Pass — no one else assigned this subject in week 6 | `content-engine.md` §5.3 — *"never two people on the same subject in the same week"* |
| **4 · Movement** | ✅ **Direct fit.** Weeks 5–8 = *"Where numbers come from"* | `content-calendar.md` §2 |

**The type call.** 🔵 The desk proposes **Type A — published analysis**, not Type B, on two grounds:

- The analysis already exists, so the marginal cost is the framing, not the research
- 🟢 A `diverges` finding is the highest-travelling artefact available, and Type A is the only type that
  produces an atom, a PDF and a 16–23 item fan-out

🟢 **Output:**

```json
{ "type": "A", "lane": "joy", "movement_fit": "direct",
  "thesis": "Most of the spread is definitional. What is left is a real
             disagreement, and nobody says which is which.",
  "verdict_ref": ["definitional:5.75-8.70", "diverges:5.86-6.46"] }
```

---

### ⑦ The Topic Board — Wednesday 15:00

🟢 **The Wednesday operations review** — 30 minutes, TL + Joy, same agenda every week
([`operations-runbook.md`](operations-runbook.md) §9). Item 7 is *"one decision — the single thing needing Joy
that week."* 🔵 This week, it is this.

🔵 **What Joy sees — evidence, not a score:**

| # | Candidate | Signal | Vol | Trend | ICP | `sourceable` | Verdict |
|---|---|---|---|---|---|---|---|
| 1 | AI research tool comparisons | community | 44 | rising | mixed | ⚠️ `thin` | — |
| 2 | UK vet practice multiples | community | 38 | rising | investors | ✅ `found` | `confirmed` |
| **3** | **Conflicting market size estimates** | **community** | **31** | **rising** | **consulting · investors** | ✅ **`found`** | **`diverges`** |

**Joy picks #3.** 🟢 And the board is built so that she can:

> *"The best question is often the **third** on the list — high demand, genuinely answerable, and nobody
> credible has answered it."* — [`content-approach.md`](content-approach.md) §5.3

**Note what the ranking did to #1.** 🟢 It has the highest volume and it was demoted anyway:

> *"`not_found` demotes a candidate regardless of its demand.** A high-demand question Caspr cannot source
> well produces a weak analysis."* — [`content-engine.md`](content-engine.md) §2.1

🔴 **The gap this step exposes:** there is **no screen for this board.** `portal-design-spec.md` §11 lists 23
built screens; searching it for "candidate" or "demand" returns nothing. **Open question 4** — until it is
answered, the board renders as a list and the picked topic is entered by hand.

**And because it is Type A, one more thing is required** — 🟢 `gtm-api-contract.md` §2:

```json
{ "commissioned_by": "joy@caspr.ai" }
```

> *"A named human, recorded in the audit trail. **Reject the call if it is absent.** This is the interface
> making an editorial policy unforgettable rather than trusting the engine to remember it."*

---

## 4 · Act 2 — Plan

### ⑧ The Work Order Desk — Thursday 06:00

🟢 Reads two inputs, produces one list.

**Input A — the week 6 slot**, seeded from [`content-calendar.md`](content-calendar.md) §2:

```
{ week: 6,
  movement: "Where numbers come from",
  type_a_lands: true,          ← Analysis 2
  type_b_focus: "job-shaped ×2",
  icp: "consultants · agencies open",
  pillar: 2 }
```

**Input B —** the picked topic from ⑦.

🟢 **Output — the week's rows, per the §1.1 volume table:**

| Type | Item | Count | Reviewer | Review min |
|---|---|---|---|---|
| **A** | **UK ready meals reconciliation** | **1** | **TL + Joy** | **10–15** |
| B | Search answers | 2 | SEO + TL | 20–30 |
| D | LinkedIn — Joy | 1 | TL | 2 |
| D | LinkedIn — Jayant | 1 | TL | 2 |
| D | LinkedIn — rotating team | 2–3 | Social | 4 |
| D | X posts | 3 | Social | 4 |
| D | Community drafts | 5 | Social | 6 |
| D | Outreach drafts | 4 | TL | 6 |
| D | Email | 0–2 | TL + Joy | 3 |
| — | SEO tasks | 3 | SEO | 5 |
| | **~23** | | | **62–77** |

🟢 **The sizing rule that produced this:** *"The generator reads the configured weekly review budget in minutes
and sizes its output to fit. **It never overshoots.**"* ~450 minutes available; 62–77 spent.

🟢 **Two things not in the table, and both matter to the build:**

- **14 personal comments** — 2 per person, **outside the review gate** (⑰)
- **`/market-size/*` pages** — generated, **never review-queue items**. *"The template is reviewed once; the
  pages are not."* This is *"the single biggest reason the volume plan fits"*
  ([`content-calendar.md`](content-calendar.md) §5.4)

---

## 5 · Act 3 — Make

### ⑨ The Assembly Desk — Thursday 06:00

🟢 Nine blocks, in Joy's order ([`content-engine.md`](content-engine.md) §3.1). What each `{brace}` got:

**Blocks 1–4 — the shared preamble, assembled once for the whole run:**

| Token | Filled with | From |
|---|---|---|
| `{canonical_facts}` | 25M+ sources · $15/$80/$300 · Research Budget arithmetic · SOC 2 Type I *in progress* | Truth layer |
| *(prohibitions)* | The linter rule set as instructions | Static |
| *(voice)* | Trusted Senior Analyst | `brand-guidelines.md` + `CLAUDE.md`. ⛔ **Never the workbook's Voice Cheat Sheet** |
| `{active_failure_modes}` | 🔵 *"Do not round a cited figure"* · *"Do not write a depth name without its type"* | The Ledger, last 60 days only |

**Blocks 5–9 — for this item:**

| Token | Value |
|---|---|
| `{analysis_title}` | 🟢 *UK Ready Meals Market: Sizing and Analysis v1* |
| `{analysis_depth}` | 🟢 Study — **and it is written as "a Study" only because the type is Market Research** |
| `{figures_with_sources}` | 🟢 `$5.75bn` narrow · `$8.70bn` broad · `$5.86bn / 4.95%` · `$6.46bn / 12.4%` · CAGR ~6% to 2030 |
| `{disagreements}` | 🟢 **non-empty** — the `$5.86 / $6.46` pair |
| `{movement}` | 🟢 `2` — *"Where numbers come from"* |
| `{icp}` | 🟢 consultants |
| `{icp_pain_verbatim}` | 🟢 *"IBISWorld numbers that don't match a newer Euromonitor report. Reconciling conflicting data sources is a multi-hour job with no guaranteed resolution."* — `icp-personas.md:65` |
| `{lane_owns}` / `{lane_never}` | 🟢 Joy: *findings from real analyses, the category argument, ICP pain* / *technical architecture; generic AI commentary* |

> 🟢 **`{movement}` is required, not optional.** The shared preamble reads it: *"Cost is the third act. Price
> never leads a headline or a first sentence **unless `{movement}` is 3**."* A missing `{movement}` silently
> disables a prohibition.

---

### ⑩ The Writer — Thursday 06:00 · frontier model

🟢 **Frontier, because this takes a position.** [`content-engine.md`](content-engine.md) §3.2 —
*"anything taking a position"* is frontier; every derivative is Haiku.

🟢 **The prompt is `content-engine-prompts.md` §1, used verbatim.** Nothing here rewrites it. It produces five
things:

| | | 🔵 What it produced |
|---|---|---|
| **1** | **TITLE** — a conclusion, not a topic. Under 12 words | *"Two firms size UK ready meals. Only one gap is real."* |
| **2** | **STANDFIRST** — 2 sentences | *"Most of the £3bn spread between published UK ready meals estimates is definitional — narrow retail against a scope that includes pizza and meal kits. Strip that out and two sources on the same basis still sit 10% apart, and neither page says so."* |
| **3** | **THE ATOM** — number, unit, period, publisher | *"On the same definition and the same 2024 base year, published UK ready meals estimates run from $5.86bn at 4.95% CAGR to $6.46bn at 12.4% — a 10% gap in size and a 2.5× gap in growth."* |
| **4** | **WHY IT MATTERS** — 3 sentences, to this ICP | *(addressed to a consultant putting a number in a client deck)* |
| **5** | **WHERE THE SOURCES DISAGREE** | 🟢 **The competing figures side by side. Not resolved. Not averaged. "The disagreement is the finding"** |

🟢 **The atom is written to survive being separated from everything else:**

> *"This will be read with no surrounding context, pasted into someone else's deck. **It must survive that.**"*

🟢 **Three type rules that applied here:**

- **Take a position** — *"a summary gets read and forgotten; a conclusion gets argued with, and the argument is
  what we are after"*
- **The research-sector disclosure is appended automatically** — do not write your own
- ⛔ **Never characterise a named firm's work as poor.** State price, date, coverage and specificity as facts.
  *"Those are unarguable; judgements are not."*

🟢 **No control token fired.** Had the source been missing, the model would have returned
`INSUFFICIENT_SOURCE` and **the item would not exist** — see §8.

---

### ⑪ The Visual Desk — 🔴 **this is where the example hits the gap**

🟢 The fan-out graph ([`content-engine.md`](content-engine.md) §5.2) commits to:

```
├── The atom — one chart, source-stamped                 1    Social
├── Charts as social cards                               1–3  Social
```

**🔴 There is no prompt for either.** `content-engine-prompts.md` §0–§5 are all text prompts.
**Nothing specifies how a chart is produced.**

🔵 **What the chart would need to be**, for this case: a two-bar comparison, `$5.86bn` against `$6.46bn`, each
bar labelled with its publisher, its basis and its base year — **and the publisher on the chart itself**,
because 🟢 the atom is defined as carrying *"the number, its unit, its period, and its publisher."* A chart
that drops the publisher is not the atom.

🟢 **Before anything new is commissioned:** `content-engine-prompt.md` §3 — *"`content/assets/visuals/*` —
existing diagrams, infographics, social cards. **Inventory before commissioning anything new.**"* There are 27
SVG, 15 HTML and 16 PNG already in that tree.

🟢 **Three routes, and the choice is Joy's — open question 5:**

| | Route | Note |
|---|---|---|
| **a** | **`propose_visuals`** — `api-spec-v2.md` §9.2, built and conformance-tested, returns **2–3 proposals carrying complete chart data**, never a rendered image | **Recommended.** The chart data is already in the analysis |
| **b** | House templates filled from analysis figures | Deterministic; a new template per shape |
| **c** | Image generation | ⛔ Not recommended — cannot be source-stamped truthfully |

🟢 **And the hygiene dependency bites here** — `remove-ai-marks` handles image metadata but is a thin client
over `WATERMARKS_SERVICE_URL`, **which is not reachable today**. Until it deploys, **image output must not
publish** (open question 6).

---

### ⑫ The Linter — before any human sees it

🟢 Two classes, and this item hit one check in each.

**Deterministic — `L01`–`L11`, no model call:**

| Check | Result |
|---|---|
| Banned vocabulary | ✅ pass |
| Exclamation points | ✅ pass |
| `LAM` / `SOC 2 certified` / `zero hallucinations` | ✅ pass |
| Competitor or LLM category in lead copy | ✅ pass — the firms are named in body, not headline |
| Stale numbers vs canonical facts | ✅ pass |
| 🔵 **Depth name without its type** (`COPY-07b`) | ❌ **FAIL** — draft wrote *"a Study"* in a sentence where the type was not established |

🔵 **Regenerated silently.** 🟢 *"Failures are regenerated silently, never queued"* — a human is never the first
line of defence on this.

**Semantic — `L20`–`L24`, one model call each:**

| Check | Result |
|---|---|
| `L20` reader-labour | ✅ pass — *"neither page says so"* is a statement about the sources, not an instruction to the reader |
| `L22` **citation resolves** | ✅ pass — 🟢 **and this check must actually FETCH the source.** *"A populated-but-dead citation is worse than no citation — it looks like proof and is not"* |

🟢 **`L20` is the highest false-positive risk in the set** and Joy's instruction is to *"run it supervised for a
month, logging every catch, before it rejects unattended."* 🔵 In week 6 it is still supervised.

---

## 6 · Act 4 — Approve & Ship

### ⑬ The Review Room — Thursday 07:00 → Monday 18:00

🟢 **07:00 Thursday:** one notification — how many items, estimated minutes, deadline. 🟢 **Two notifications a
week, no more** — *"a queue that nags gets muted, and a muted queue is a stopped machine."*

🔵 **Joy opens My Week, hits Start reviewing.** 🟢 Full-screen takeover — the rail and tabs disappear, because
*"the rail and tabs are what fragment attention."*

🔵 **What happened across the week's items:**

| Item | Action | Code | Note (≤200 chars) |
|---|---|---|---|
| **Type A — the reconciliation** | ✅ **Approve** | — | — |
| Search answer #1 | ✅ Approve | — | — |
| LinkedIn — Joy | ✅ Approve | — | — |
| **LinkedIn — rotating (Amit)** | ❌ **Reject** | **`OFF_VOICE`** | 🔵 *"Reads as marketing. Amit's lane is what shipped and what broke — this is a positioning claim."* |
| X ×3 | ✅ Approve | — | — |
| Community drafts ×5 | ✅ Approve | — | — |

🟢 **The reject taxonomy is fixed at ten codes**, and free text is an additional note, never a substitute.
🟢 **A note is required on every rejection.**

🟢 **⛔ No editing.** Joy did not rewrite Amit's post. The rejection **regenerates it with the correction
applied**, and the new version returns to the queue.

🟢 **Commit on action, no batch save, no undo** — *"a reviewer interrupted at item 6 of 14 has genuinely
decided six."*

🟢 **Review cost, and this is why 23 items fit in 70 minutes:**

| | Time |
|---|---|
| Type A — origination | **10–15 min** |
| Each derivative | **1–2 min** |

*"Only 2.5 items a week are origination, which is the entire reason the volume fits."*

---

### ⑭ The Ledger — on the rejection

🟢 Stored: reason code, note, the original item, the regenerated item, and whether the regeneration was
accepted.

🔵 **What it produced from this one rejection:**

```
active_failure_mode (added, expires 2026-11-05):
  "Amit's lane is what shipped and what broke. Do not write positioning
   claims in the engineer lane."
```

🟢 **That string is injected into block 4 of every subsequent generation** — *"so the same mistake is not made
twice."*

🟢 **And it is a query, not a stored list:** *"A mode that has not fired in 60 days is removed. Otherwise the
list accumulates a hundred stale rules and every prompt gets worse."*

🟢 **Health check on the week:** 🔵 1 rejection in 23 items = **4.3%**. 🟢 Inside the healthy 5–15% band's lower
edge. *"Below 2%: reviewers are rubber-stamping."* Not triggered, but worth watching.

🟢 **If `OFF_VOICE` were to exceed 15% of rejections over a month**, the fix is to add a constraint to
**the §4.1 LinkedIn prompt, not the shared preamble** — *"the preamble is already long and every addition
dilutes the rest."*

---

### ⑮ The Hygiene Bench — Monday 20:00, after approval

🟢 **After approval, deliberately** — *"a reviewer should read what was written, not a cleaned version of it."*

⛔ **This item is the exact case the branch exists for.** It is **two objects with opposite rules**:

| Object | Hygiene | Why |
|---|---|---|
| **The generated PDF deliverable** | ⛔ **NEVER TOUCHED** | 🟢 It carries a legally required AI-provenance mark under **EU AI Act Article 50(2)**, in force since 2 August 2026. **Stripping it is a compliance breach** |
| The report **web page**, the standfirst, the atom, every derivative | ✅ **Cleaned** | 🟢 Published marketing prose |

🟢 **Branch on `artefact_type`, not on item type.** The item passes the PDF through untouched and cleans only
the surrounding prose.

🟢 **Flags:** `--no-normalize-spaces`. ⛔ **Never `--aggressive-homoglyphs`, `--nfkc` or
`--strip-emoji-glue`.** 🟢 **Citations are a protected span** — *"a mangled citation URL is a broken proof."*

🟢 **The standing research-sector disclosure is not stripped** — this issue touches the research sector, so it
carries the note, and hygiene never removes a required disclosure.

---

### ⑯ The Publisher — Tuesday to Sunday, week 6

🟢 **Monday 20:00** approved content is scheduled. 🟢 **Unreviewed items hold. There is no timeout that pushes
anything live.**

🟢 **The day slots** — [`content-calendar.md`](content-calendar.md) §1:

| Day | 🔵 What went out |
|---|---|
| **Tue** | Report page + PDF → caspr.ai · **Joy's LinkedIn post** · 1 X post |
| **Wed** | Company page · 1 X post · **community drafts surfaced — a human posts** |
| **Thu** | Jayant's LinkedIn (his own angle — sourcing and corpus currency, not the market) · rotating team post |
| **Fri** | Search answer #2 · 1 X post |
| **Mon** | Rotating team post · email block |

🟢 **Joy's post lands Tuesday** because the engagement rule depends on colleagues commenting inside 30–60
minutes, and a mid-week morning is when that is realistic.

**Channel mechanics that applied** — 🟢 all from `portal-build-spec.md` §3.6 and §6:

| Channel | How it went |
|---|---|
| Blog → caspr.ai | CMS write + build trigger. Automated. Structured data attached: `Article` · `BreadcrumbList` · `Organization`. ⛔ **No `aggregateRating`** |
| LinkedIn — Joy | `w_member_social`. Automated. Open permission, one OAuth grant |
| X | Free tier, writes only |
| **Communities** | ⛔ **Drafts surfaced. A person posted.** *"Automated posting here gets accounts banned and burns the channel permanently"* |

#### ✅ The attribution stamp — the step that makes this case measurable

🔵 Every outbound link carried:

```
?utm_source=linkedin&utm_medium=organic&utm_campaign=wk6-ready-meals
&icp_hint=consulting
```

🟢 **This is not a nit.** [`tracking-spec.md`](tracking-spec.md) Part 4 item 5: *"Without this the portal cannot
attribute revenue to a channel and **the RoI target is unprovable**."*

**An unstamped link is a permanently unattributable acquisition** — its revenue lands in the numerator with no
channel, which understates whichever channel actually earned it.

---

### ⑰ The Comment Desk — through the week

🟢 **14 comments a week, 2 per person, outside the review gate.** The desk does not write them — it surfaces
**which post** and **which fact to bring**.

🔵 **One target it surfaced:**

```json
{
  "post_url": "https://linkedin.com/posts/…",
  "why_relevant": "A category manager posted a UK ready meals size with no
                   basis stated",
  "the_fact_to_bring": "Published estimates on the same 2024 basis run $5.86bn
                        to $6.46bn — the figure needs its scope attached",
  "our_source": "UK Ready Meals Market: Sizing and Analysis v1",
  "assigned_person": "joy"
}
```

🟢 **The guard rail, and it is a data constraint rather than a reviewer's judgement:**

> **If `the_fact_to_bring` is empty, the target never appears.**

Which means the engine **cannot** surface a post we have nothing to say about — so it cannot generate applause.

🟢 The standard it enforces, from `audit.md` §5:

> **No coordinated applause.** Every comment must add a fact, a number, a counter-example, or a genuine
> question from that person's own domain. **If a comment could have been written by someone who had not read
> the post, it does not go out.**

🟢 ⛔ **A person posts it. Always.** The desk never posts and never drafts a finished one-click comment.

---

## 7 · The fan-out — one analysis becomes 16–23 items

🟢 [`content-engine.md`](content-engine.md) §5.2, applied to this case. **Spread across weeks 6 and 7 — not
dumped.**

| | Item | Count | Reviewer | 🔵 This case |
|---|---|---|---|---|
| 1 | Report page + PDF | 1 | SEO + TL | The reconciliation, published free and fully cited |
| 2 | **LinkedIn — Joy** (analyst lane) | 1 | TL | The atom, opened with the finding |
| 3 | **LinkedIn — Jayant** (builder lane, **own angle**) | 1 | TL | 🟢 Not the market — *why reconciling sources is hard to build*. His lane, his angle |
| 4 | LinkedIn — rotating team | 1–2 | Social | 🔵 Amit's rejected and regenerated |
| 5 | X posts | 3 | Social | Number leads, source named in the post |
| 6 | **The atom — one chart, source-stamped** | 1 | Social | 🔴 **no prompt exists** |
| 7 | Charts as social cards | 1–3 | Social | 🔴 same gap |
| 8 | Community contributions | 2–4 | Social | Only where genuinely on-topic |
| 9 | Email block | 1 | TL | 80–120 words, one idea, one link |
| 10 | Search-page updates using its figures | 2–3 | SEO | `/market-size/*` rows refreshed |
| 11 | Outreach hooks | 2–3 | TL | Under 90 words, specific reason or `INSUFFICIENT_RELEVANCE` |
| | **TOTAL** | **16–23** | | |

🟢 **Two rules the graph enforced while generating these:**

- **Lane integrity.** Jayant's item is *not* a version of Joy's — 🟢 his lane excludes marketing claims and
  pricing, so he writes about sourcing and citation difficulty. **If no lane fits, the derivative is not
  generated** — `LANE_MISMATCH`, and *"an empty slot beats a lane violation."*
- **One subject, one person, one week.** The graph checked week 6's assignments before generating.

🟢 **The cost, stated plainly:** one Study — **$80 at list** — produced 16–23 items.
*"The constraint is not money. It is who picks the question and who checks the output before it carries the
company's name."*

---

## 8 · What would have happened if it had gone differently

🟢 Each of these is a real branch in the specification, not a hypothetical.

| If | Station | What happens |
|---|---|---|
| **`retrieve_analysis` had missed** | ⑤ | Fall to `fact_lookup`. Only if *that* missed would `trigger_generation` be considered — **and only with `commissioned_by` present** |
| **`fact_lookup` returned `not_found`** | ⑤⑦ | The candidate is **demoted regardless of its demand**. It would not have reached the board's top rows |
| **The two `basis` values had differed** | ⑤ | Verdict is **`definitional`, never `diverges`.** *"These measure different things. The finding is that nobody says so"* — a different, and per `index-engine.md` §2 often sharper, story |
| **`source_last_verified` were >30 days old** | ⑤ | **Row suppressed, not published** |
| **No source at all** | ⑩ | Model returns **`INSUFFICIENT_SOURCE`** and **the item is not produced.** *"The generator refusing is cheaper than the linter rejecting, and far cheaper than a reviewer approving something unsourced on a Friday"* |
| **The subject fell outside Jayant's lane** | ⑩ | **`LANE_MISMATCH`**, slot left empty |
| **A community thread were off-topic** | ⑩ | **`NOT_RELEVANT`**, no draft produced |
| **The only reason to contact someone were their job title** | ⑩ | **`INSUFFICIENT_RELEVANCE`**, no outreach draft |
| **Nobody reviewed by Monday 18:00** | ⑬⑯ | Nothing publishes. TL extends to Tuesday **or skips the week.** 🟢 *"Skipping a week is a valid outcome. Publishing unreviewed content is not"* |
| **The linter failed 3× on one item** | ⑫ | Marked `linter_blocked` and surfaced on the dashboard. **Not looped** |
| **A published figure later changed** | Truth layer | A **stale flag** is raised against this page, with its channel, URL and publish date. 🟢 *"Anything over 7 days old is a live inaccuracy on a public page"* |
| **The published item turned out factually wrong** | ⑬⑭ | 🟢 **Unpublish first, then correct, then a `FACT_WRONG` ledger entry so the ledger learns. In that order** |

---

## 9 · How this one case reaches `x`

🟢 **`x` = revenue per $1 of total GTM spend, by signup cohort. Reported at `x@3` and `x@6`.**

```
Tue wk6   ⑯ published — every link stamped utm_campaign=wk6-ready-meals
                                            icp_hint=consulting
                    │
                    ▼
          🟢 product event stream — tracking-spec.md
             prompt_submitted → signup_completed → analysis_completed
                              → payment_succeeded
                    │
                    ▼
          🟢 cohort = signup month + first-touch utm_campaign + icp_hint
                    │
                    ▼
          🟢 revenue = Σ payment_succeeded at 3 and 6 months
                       ⚠ CHARGES ACTUALLY TAKEN — never budgets authorised
                    │
                    ▼
                   x@3  ·  x@6        gate: x@6 > 2 → paid opens, ICPs widen
```

### 🟢 Two traps this case would have fallen into

**Trap 1 — booking the Study at list price.** 🟢 `gtm-api-contract.md` §1.1:

> **An analysis this engine commissions for itself is not a charge taken. It is compute consumed.**
> Booking it at $80 list would **overstate GTM spend and understate `x`** — and what follows is not an
> accounting error, it is **killing a channel that is working**, because its denominator was inflated by an
> internal transfer price.

🟢 **In this case it does not even arise** — `retrieve_analysis` hit, so nothing was commissioned and
`credits_charged` was 0. **But the same item on a cache miss would have to book actual marked-up compute, not
$80.**

🟢 **One ledger line per published item, not per call.** *"Four hundred `fact_lookup` calls behind one index
issue is one number a person will actually read; four hundred rows is noise nobody checks."*

**Trap 2 — counting paid users instead of revenue.** 🟢 `tracking-spec.md` Part 5: a `paying_dormant` user
authorises $200, runs nothing, pays only the **$14 platform fee** — and counts as a "paid user" while
generating almost no revenue.

### 🟢 And the leading indicator — `p`

`x` is lagging. `p` is not:

> **One basket per ICP. Each month, ask every question in it. `p` is the share where Caspr appears in the
> answer.**

**The atom is the unit built to reach it** — *"read with no surrounding context, pasted into someone else's
deck."* Three ways of appearing, weighted equally: cited in an AI answer (a mention without a link still
counts) · listed on a third-party page ranking page one (**6.5× of citations come from here**) · our own page
ranks page one.

🟢 **Baseline, 2026-08-25: `p` = 0 on every question tested.** Reported per ICP, never aggregated.

### The contribution, station by station, for this one case

| Station | Side | This case |
|---|---|---|
| ②③ Listener / Trend | Denominator | Found a rising practitioner question without a weekly manual scan |
| ⑤ **Verifier** | **Both** | `retrieve_analysis` hit → **$0 spent.** And it produced the `diverges` finding, which is the artefact built to travel |
| ⑦ **Topic Board** | **Numerator** | Joy picked #3 over the higher-volume #1. One pick, 16–23 items |
| ⑩ Writer | Denominator | 1 frontier call; ~20 Haiku calls |
| ⑫ Linter | Denominator | Caught `COPY-07b` before a human saw it |
| ⑬ Review | Ceiling | 62–77 min against 450 available |
| ⑭ Ledger | Compounding | One `OFF_VOICE` note now prevents a class of future rejections |
| ⑯ **Publisher** | **Makes `x` computable** | Without the stamp, every signup from this case is unattributable |
| ⑰ Comments | Numerator | Reach from 130 min/week already committed |

---

## 10 · What this example proves, and what it exposes

**Proves:**

- 🟢 The call order keeps cost near zero on the common path — this entire case cost **$0 in Caspr credits**
- 🟢 `basis` is what separates the two verdicts, and it is enforced structurally rather than by prompt
- 🟢 One Study at $80 is the parent of 16–23 items, spread over two weeks
- 🟢 One human decision — Joy picking #3 over #1 — is the highest-leverage moment in the whole line

**Exposes — the three gaps, in the order they were hit:**

| Station | Gap | Open question |
|---|---|---|
| ⑦ Topic Board | **No screen exists** for the pick. 23 screens drawn, none is this | **4** |
| ⑪ Visual Desk | **No prompt exists** for the atom chart or the social cards the graph promises | **5** |
| ⑪⑮ Hygiene | **`WATERMARKS_SERVICE_URL` is not reachable**, so image metadata cannot be cleaned | **6** |

**And one blocker that stops the example being run at all today:**

| ⑤ Verifier | **The service principal is not issued.** *"The blocking item; nothing else can be integrated without it"* | **3** |

---

---
---

# CASE B — the harder one

## 11 · Why a second case

**Case A is the clean path.** A question is asked, Caspr has the answer, the answer is publishable, and every
gate passes. It is the common case and it is worth understanding first.

**Case B is the one that teaches more**, because it is a genuinely high-value trend where **the obvious content
response is banned** — and watching the engine route around a prohibition is the only way to see whether the
gates actually hold.

🟢 It is also the trend Joy's own documents call the biggest thing currently being missed:

> **"And the highest-value family was missed entirely: AI deep research. Buyers are choosing an AI research
> tool right now, explicitly on citation reliability, and Caspr is absent from every list and every AI answer.
> That is purchase intent, it is our exact claim, and it needs no ranking — it needs inclusion."**
> — [`docs/seo/decision.md`](../seo/decision.md) §2

---

## 12 · The case

> 🟢 People are actively choosing an AI research tool, in public, **on citation reliability** — which is Caspr's
> exact claim. 🟢 **Caspr appears in none of it.**
>
> 🟢 And the tools that *are* named mostly solve a different problem.

**This is a real, recorded reading, not a supposition** — 🟢
[`presence-baseline-2026-08.md`](presence-baseline-2026-08.md) §3, measured 2026-08-25:

| | Question | Caspr present |
|---|---|---|
| **C1** | best AI tool for market research | **No** |
| **C2** | best AI deep research tool | **No** |
| **C6** | alternatives to IBISWorld | **No** |

> **`p` = 0. Caspr appears in nothing.** Not in a result, not in a roundup, not in an answer, on any question
> tested.

---

## 13 · Where Case B diverges, station by station

Only the stations that behave differently are walked. Everything else runs as in Case A.

### ②③ Listener and Trend Reader

🔵 **What the listener would pick up** (illustrative threads; 🟢 the underlying phenomenon is recorded):

```
r/consulting     "which AI tool actually cites its sources?"
r/PromptEngineering  comparison threads, rising weekly
Hacker News      "Show HN"-adjacent discussion of research agents
LinkedIn         practitioners posting their tool stacks
```

🟢 **Velocity is high and sustained, and the audience is right** — these are practitioners choosing tools with
budget, which is exactly what the CPC discriminator selects for.

**On paper this is the strongest trend the engine will see. That is what makes what happens next instructive.**

---

### ④⑤ Claim Reader and Verifier — **the claim is not a number**

**Case A's claim was a market size.** Case B's claim is a **category claim**, and it verifies differently.

🔵 The extracted claim:

```json
{ "statement": "the leading AI research tools cite their sources reliably",
  "asserted_value": "category assertion",
  "basis": "tool capability",
  "source_cited": null }
```

🟢 **`retrieve_analysis` and `fact_lookup` cannot verify this.** There is no market figure to look up. What
*is* verifiable — and is already recorded — is **who the answer names, and what those tools actually do:**

🟢 [`presence-baseline-2026-08.md`](presence-baseline-2026-08.md) §5 — the tools named in the answer to
*"best AI tool for market research"*:

| What they are | Named |
|---|---|
| **Qualitative synthesis** — interviews and open-ends into insight | Yabble · DoReveal · Notably |
| **Trend and signal detection** | Glimpse · Optimo |
| **Consumer-data platform with an AI layer** | GWI Spark |
| **Workflow aggregation over multiple models** | nexos.ai |
| **Actually generates a market research report** | **Manus, and essentially only Manus** |

> 🟢 **"Almost none of them do what Caspr does."**

🟢 And for *"best AI deep research tool"*, the answer names **Perplexity, ChatGPT DR, Kimi, Consensus, Scite**
— *"Caspr appears in none of it"* ([`docs/seo/decision.md`](../seo/decision.md) §2).

**So the verdict is not one of the four content verdicts at all.** 🔵 The Verifier returns:

```
verdict: no_data     — the claim is a category assertion, not a sourceable figure
finding: the answer set is real, recorded, and shaped around a different problem
```

🟢 **`no_data` would normally end it** — `INSUFFICIENT_SOURCE`, item not produced. **But the finding underneath
is not a content finding. It is a distribution finding**, and that is what the next station is for.

---

### ⑥ The Angle Desk — **the gates that fire, and the one that blocks**

🟢 Four gates, in order:

| Gate | Result | |
|---|---|---|
| **1 · Source** | ⚠️ **No sourceable figure** — but a recorded, citable observation exists | `presence-baseline-2026-08.md` §5 |
| **2 · Lane** | ✅ **Joy.** *"the category argument"* is explicitly in her lane | `audit.md` §5 |
| **3 · Collision** | ✅ Pass | |
| **4 · Movement** | ✅ Fits *"Where numbers come from"* obliquely; fits Pillar 2 directly | `content-calendar.md` §2 |

**And then the constraint that decides the whole case:**

> 🟢 **`L21` — Competitor in lead copy.** *"Named competitor or the LLM category in a headline, hero, first
> line, or any ad."*
> **Exempt: body copy on `/vs/*`, `/alternatives/*`, social and founder content.**
> — [`content-engine.md`](content-engine.md) §4.2

> 🟢 **`CLAUDE.md`, message stack rule 1:** *"Never name a competitor or the LLM category in lead copy. Naming
> them **concedes we are in the same category**. The contrast with generative AI is category education — it
> belongs on `/vs/*` pages, in social and in founder content, **never in a hero, a headline or an ad.**"*

> 🟢 **And Pillar 2 — Analytical AI — carries the same restriction and a weight cap:** *"**Category education
> only** — `/vs/*`, `/alternatives/*`, social and founder content. Never a hero, headline or ad."* **~18% of
> output.**

**So the desk cannot produce the obvious thing.** A blog post titled *"Caspr vs ChatGPT for research"* is
blocked three separate ways, and none of them is a style preference — 🟢 it is *"the one thing the positioning
exists to avoid."*

🔵 **What the desk returns instead — three angles, none of which is a headline:**

```json
[
  { "type": "D", "channel": "linkedin", "lane": "joy",
    "note": "social is L21-exempt — the category argument is her lane" },

  { "type": "B", "channel": "web", "destination": "/vs/chatgpt",
    "note": "the sanctioned home for the generative contrast" },

  { "type": "outreach", "owner": "seo",
    "note": "NOT content. Inclusion in the roundups that already rank" }
]
```

---

### ⑦ The Topic Board — and the routing that follows

🔵 **What Joy sees:**

| Candidate | Signal | Velocity | ICP | `sourceable` | Verdict |
|---|---|---|---|---|---|
| **AI research tool comparisons** | community | **high** | consulting · investors | ⚠️ **`thin`** | **`no_data`** |

**Note it is the same row that was demoted in Case A.** 🟢 There, `not_found`/`thin` correctly pushed it below
a lower-volume, better-sourced candidate — *"a high-demand question Caspr cannot source well produces a weak
analysis."*

**Here it is picked anyway — because it is not being routed to content.** 🟢 It is being routed to the
distribution answer Joy's own decision record already gives:

> 🟢 **"Get into the lists buyers and AIs already read"** — ranked **item 1**, ahead of everything else.
> *"Purchase intent, immediate on inclusion, **outreach not ranking**. **6.5× more citations come via third
> parties than own domain.**"* — [`docs/seo/decision.md`](../seo/decision.md) §2

**This is the lesson of Case B in one line:**

> **The highest-value trend the engine will find does not produce a blog post. It produces an outreach list.**

---

### ⑧⑩ Work Order and Writer — what actually gets made

🔵 Three items, and they are deliberately unlike Case A's twenty:

**1 · A founder LinkedIn post — Joy's lane, `L21`-exempt**

🟢 Written to `content-engine-prompts.md` §4.1. 🟢 The approved category-education line is available to it —
*"While the world was building generative AI, we built analytical AI"* — **and only here.** It is marked
*"Category education only — `/vs/*`, social, founder content. **Never a hero, headline or ad**"* in
`CLAUDE.md`.

🟢 The `§4.1` rules still bind: **120–200 words · first person · opens with the finding · two hashtags at most,
or none · ends on the conclusion, not a question** — *"we do not fish for comments."*

🔵 The finding it opens with is the recorded one: *the tools the answer names solve a different problem.*

> 🟢 ⛔ **And even here, one prohibition does not lift:** *"Never characterise a named firm's work as poor.
> State price, date, coverage and specificity as facts. Those are unarguable; judgements are not."*
> **Naming what a tool does is a fact. Calling it worse is a judgement.**

**2 · A `/vs/chatgpt` refresh — the sanctioned home**

🟢 *"The nine existing `/vs/*` pages are **rewritten and linked, not deleted** — they are the sanctioned home
for the generative contrast (`CLAUDE.md`, rule 1) and they cost nothing to keep. They simply stop being the
primary acquisition bet."* — [`content-approach.md`](content-approach.md) §3B

**3 · An outreach list — and this is not content at all**

🟢 The targets are already named, and they came free:

> *"The domains that own these questions were the point of the ~15-domain Ahrefs qualification pull. **Running
> the questions produced the list directly.**"*

| Target | Shape | Who does the work |
|---|---|---|
| **cybernews.com** | Editorial roundup. 🟢 **Confirmed across two query families — the priority target** | Outreach to a named editor |
| pollfish · gwi · sembly · standard-insights | Vendor blog roundups | Outreach |
| **g2 · sourceforge · slashdot** | Directory listings | 🟢 *"Inclusion is a form submission, not outreach"* |
| **datarade.ai** | Data-provider directory — IBISWorld is listed there | Form |
| **searchfunder.com** | 🟢 ⚠️ **A community forum thread, not a roundup** — a real acquirer asking real peers | 🟢 ⛔ **"Never automate a post here; a person posts, always"** |

🟢 *"The split matters for who does the work. **Directories are a form and a login. Editorial roundups are
outreach to a named editor. A forum thread is neither, and it is the only one that could go wrong.**"*

🟢 **This work belongs to SEO, not Content & Social** — guest posts and directories were redistributed to SEO
when Outreach was dissolved ([`portal-design-spec.md`](portal-design-spec.md) §5).

---

### ⑫ The Linter — where Case B would fail if the routing were wrong

🔵 If someone had written the obvious blog post, this is what would have caught it:

| Check | Result |
|---|---|
| **`L21` competitor in lead copy** | ❌ **FAIL** — the headline names the LLM category |
| Regenerate | ❌ **FAIL again** — the topic *is* the category |
| Third attempt | ❌ → 🟢 marked **`linter_blocked`**, surfaced on the dashboard, **not looped** |

🟢 **The linter is the backstop, not the design.** The Angle Desk is where this should be caught — and it is,
because gate 4 reads Pillar and `L21` reads channel. **A trend routed to the wrong channel fails three times
and produces nothing.** That is the correct outcome and it is expensive; catching it at ⑥ is free.

---

## 14 · What Case B does to `x` — and why it looks like nothing at first

**Case A produced revenue-shaped output.** Case B produces **presence**, and presence is measured by a
different instrument.

```
outreach → inclusion in cybernews / G2 / Datarade / roundups
                    │
                    ▼
        🟢 p  — "does Caspr appear when the buyer looks?"
           three ways, weighted equally:
             · cited in an AI answer (a mention without a link still counts)
             · listed on a third-party page ranking page one  ← 6.5× of citations
             · our own page ranks page one
                    │
                    ▼
        traffic arrives already stamped by the destination's utm
                    │
                    ▼
                   x@3 · x@6
```

🟢 **This is why `p` exists as a separate metric:**

> **`x` measures whether the machine pays for itself. `p` measures whether we exist at the moment the buyer
> looks.** One is lagging and commercial; the other is leading and cannot be bought.

🟢 **And why this channel is ranked first despite producing no content:**

| | | Speed | Risk | Audience |
|---|---|---|---|---|
| (a) Ranking our own pages | | 6 months | Thin-content penalty | Mixed |
| **(b) Being present where buyers already look** | | **Weeks** | **Near zero** | **Purchase intent by definition** |
| (c) Being cited by AI | | Weeks–months | Near zero | Whoever asked |

> 🟢 *"**The first-quarter contribution comes from presence, not position.**"*

---

## 15 · ⚠ The open question Case B sits on top of

🟢 This is recorded in `presence-baseline-2026-08.md` §5 and it is not resolved. It should be visible in any
build that acts on this trend:

> **Two readings, and they point in opposite directions:**
>
> | | |
> |---|---|
> | **Opportunity** | *"The category as currently answered **contains no analyst-grade report generator**. The question is being answered by tools that solve a different problem, which means **the position is genuinely open**"* |
> | **Problem** | *"A buyer searching this phrase is shown survey and qual tools. If that is the phrase our ICP uses, we are competing for a term whose answer set has already been shaped around something else — and **reshaping an established answer set is far harder than entering an empty one**"* |
>
> **Which reading is right depends on a question we have not answered: is *"AI tool for market research"* even
> the phrase our buyer uses?** The persona research says investors and consultants **describe the job, not the
> tool category** — *"industry primer on commercial logistics in the Nordics"*, not *"AI market research
> tool."*

🟢 And the conclusion Joy drew, which the engine should encode rather than relitigate:

> *"This **strengthens the existing decision rather than changing it** — roundup and directory inclusion first,
> job-shaped content over category terms. **This is the same conclusion arriving from a different direction,
> which is the most reassuring way for a conclusion to arrive.**"*

**For the build, that means one concrete rule:**

> **A category-term trend is routed to outreach and to `/vs/*`. A job-shaped trend is routed to content.**
> The Angle Desk decides which by reading whether the claim is a *tool comparison* or a *question about a
> market*.

---

## 16 · The two cases, side by side

| | **Case A — UK ready meals** | **Case B — AI research tools** |
|---|---|---|
| **Trend origin** | A practitioner question in a thread | A live category being chosen in public |
| **Velocity** | Rising | **High and sustained** |
| **Verdict** | `definitional` + **`diverges`** | **`no_data`** — the claim is not a figure |
| **Caspr call** | `retrieve_analysis` **hit** · $0 | Nothing to look up |
| **Blocked by** | Nothing | **`L21` · Pillar 2 · message-stack rule 1** |
| **Primary output** | **A published analysis** → 16–23 items | **An outreach list** → 3 content items |
| **Owner** | Content & Social | **SEO** (outreach) + Content & Social (the post) |
| **Reaches** | **`x`** — directly, via stamped links | **`p`** — leading, and `x` follows |
| **Payback** | Weeks | **Weeks for (b), months for (c)** |
| **What it teaches** | The clean path, and that the common path is cheap | **That the biggest trend can be one you must not write a headline about** |

---

## 17 · What Case B exposes that Case A did not

| | Finding | Where it lands |
|---|---|---|
| **1** | **The Angle Desk needs to read `L21` and Pillar weight, not just lane and movement.** Case A never tested this — every gate passed | Runtime spec ⑥. **A build note, not an open question** |
| **2** | **Not every trend produces content.** The engine needs a route to **outreach** as a first-class outcome, not as a leftover | ⑥ output must allow `type: "outreach"` with `owner: "seo"` |
| **3** | **`no_data` is not always a dead end.** Case A's rule — `no_data` → `INSUFFICIENT_SOURCE` → not produced — is right **for content**. Case B shows a `no_data` claim carrying a real distribution finding | ⑥. **Worth confirming with Joy — a twelfth open question** |
| **4** | **The presence basket is frozen for a year**, so a trend cannot add a question to it. The trend informs outreach; it never edits `p` | ⑱. Confirms open question 11 |

---

*Document: `content-engine-example.md` · 2026-09-08 · Two worked examples of
[`content-engine-runtime-spec.md`](content-engine-runtime-spec.md). **Case A** is the clean path where every
gate passes; **Case B** is the high-value trend where the obvious response is prohibited and the engine routes
around it. Every fact is marked 🟢 real with its source, or 🔵 illustrative. No specification is changed by this
file; §17 raises one further open question for Joy.*
