# Index Engine — Runtime Specification

*2026-09-09. **The mechanism, not the model.***

**Companion to — and subordinate to — [`index-engine.md`](index-engine.md).** Where that file and this one
disagree, **it wins**. It decides what the engine publishes and why; this decides how it runs.

**Sibling:** [`content-engine-runtime-spec.md`](content-engine-runtime-spec.md) — the other engine.
**§7 below is the boundary between them**, and it matters more than usual because the two have opposite
safety models.

---

## 0 · Read this first — why this is a separate document

🟢 [`index-engine.md`](index-engine.md) §3 has a section titled *"Why it is a separate engine."* This file
exists because that section is correct.

| | Content engine | **Index engine** |
|---|---|---|
| Output | Written items | **Rendered data** |
| **Review** | Human queue, three actions | **⛔ None. It publishes autonomously** |
| Clock | Weekly, tied to review capacity | Monthly issue, continuous underlying refresh |
| Model use | Frontier + Haiku | **Almost none.** Templated rendering |
| Failure mode | An item is weak | **A published claim about a named company is wrong** |

> 🟢 **"The last row is why it is separate.** The content engine's safety comes from a human reading every
> item. **This one has no human, so its safety has to be structural** — and mixing the two would mean either
> gating this behind a review it does not need, or removing a gate the other one does."

**And Joy states the consequence plainly rather than leaving it to be discovered:**

> 🟢 **"This engine's blast radius is larger than a human-reviewed one, and its safety is entirely in the
> gates."**

**Everything in this document follows from that sentence.** The gates are not validation around the feature.
**The gates are the feature.**

---

## 1 · The line — nine stations, no human in the happy path

```
╔══════════════════════════════════════════════════════════════════════════╗
║  ⓐ  THE BASKET          sector × geography × metric        config, Joy   ║
╚═════════════════════╪════════════════════════════════════════════════════╝
                      ▼
   ⓑ  THE PROBE        one POST /fact_lookup/batch · up to 100 per call
                      │  ⛔ trigger_generation is NOT IN SCOPE for this principal
                      ▼
   ⓒ  THE GATES        G1 freshness · G2 resolvable · G3 basis
                      │  G4 period · G5 sanity · G6 basket-level
                      │
                      ├── G1–G5 fail ──► ⬛ row suppressed. silent. normal.
                      │
                      └── G6: >20% suppressed ──► ⛔ PUBLISH NOTHING
                      │                            🔔 ALERT A HUMAN
                      ▼                            (the only human touchpoint)
   ⓓ  THE CLASSIFIER   definitional │ disagreement │ agreed │ single-source
                      │  ⚠ decided by `basis`, never by a model
                      ▼
   ⓔ  THE COMPUTE      age_months · spread_pct · repetition_count
                      ▼
   ⓕ  THE RENDERER     templates with no field an adjective could enter
                      ▼
   ⓖ  HYGIENE          prose only. FIGURES UNTOUCHED
                      ▼
   ⓗ  THE THREE        1 · the per-sector row      permanent
       DESTINATIONS    2 · the monthly issue        summarises what moved
                       3 · campaign examples        drawn from the same rows
                      │
                      ▼
   ⓘ  THE METER        contributes to p, not to weekly x
```

🟢 **One item, three destinations, computed once.**

---

## 2 · The stations

### ⓐ The Basket

| | |
|---|---|
| **What** | The tracked set — which **sector × geography × metric** rows the engine watches |
| **When** | Static config. Changed in a scheduled review, never mid-run |
| **Why** | An unbounded basket is an unbounded blast radius. **The basket is the scope of what this engine can be wrong about** |
| **How** | `BasketRow { sector, geography, metric, gics_code, iso_code, enabled, added_at }`. 🟢 GICS and ISO vocabulary — **the same as `demand_signal` and the `/market-size/*` pages**, so a row joins to a page without a mapping table |
| **Joy** | 🟢 `index-engine.md` §9 open item 2 — *"Which sectors × geographies × metrics, and how many. **Start narrow** — the same seed-and-verify logic as the data pages."* **Open question I-1** |
| **→ x** | Indirect. Basket scope sets how many `/market-size/*` pages carry a live Age module, and those pages are a `p` surface |

---

### ⓑ The Probe — the only outbound call

| | |
|---|---|
| **What** | One batched `fact_lookup` per run |
| **When** | On the refresh schedule — **⚠ open question I-2** |
| **Why** | 🟢 *"Roughly **200 units of fixed overhead per request**. A 500-row basket run sequentially is mostly overhead. **This is the difference between a monthly index that is viable and one that is not**"* |
| **How** | `POST /fact_lookup/batch { "queries": [ …up to 100… ] }` — a 500-row basket is **5 calls, not 500** |

**Per candidate the response must carry:**

```
value · unit · period · basis
publisher · published_at · source_last_verified · url
```

#### ⛔ The scope constraint — and it is enforced in the credential, not in code

> 🟢 **"The engine must be structurally unable to reach `trigger_generation`** — the service principal's
> scopes already enumerate what it may call, and **this one should not have it**." — §8

**This is a different principal from the content engine's**, or the same principal with a narrower scope list.
**Either way `trigger_generation` is absent from it.** 🟢 Scopes are *"enumerated and enforced server-side"* —
so a bug in this engine cannot start billable work even if it tries.

**Metering:** 🟢 same block, same single ceiling — *"one ceiling, not one per endpoint."* **Charged per query,
never per request**, so a 100-query batch returns 100 charges. **No second ceiling is proposed.**

**Partial batch failure — NEW, because none is specified.** A batch where some queries error returns the
successful ones and the failures are **counted as suppressions for G6**. A transport failure on a whole batch
retries three times, then aborts the run and alerts. **A partial run never publishes.**

---

### ⓒ The Gates — the whole safety model

🟢 Six gates. **Every one suppresses rather than degrades.**

| | Gate | Fails → |
|---|---|---|
| **G1** | **Freshness** — `source_last_verified` older than **30 days** | **Suppress the row.** *"Never publish 'this is the latest' on an unverified source"* |
| **G2** | **Resolvable source** — publisher, date, and a URL that resolves | **Drop the candidate.** A row left with fewer than two candidates is suppressed |
| **G3** | **Stated basis** — every candidate declares what it measures | **Suppress.** *"Without it, definitional and disagreement cannot be told apart"* |
| **G4** | **Period alignment** — compared candidates share a base period | **Reclassify as definitional, never as disagreement** |
| **G5** | **Sanity bound** — spread above **500%** | **Suppress and flag.** *"Almost certainly a unit error on our side, not theirs"* |
| **G6** | **Basket-level** — more than **20% of rows suppressed in a run** | **⛔ Publish nothing. Alert a human** |

#### G6 is the one that makes autonomy safe

> 🟢 *"Individual suppressions are normal and silent. **A pattern of them means the input is rotting**, and
> publishing a thinned index off a degrading corpus is **how an automated system embarrasses you slowly**."*

**Runtime specifics — NEW, because the doc gives the rule but not the mechanics:**

| | |
|---|---|
| **Measured over** | **The whole run's basket**, not per sector. A single bad sector is a suppression pattern; the whole basket thinning is corpus degradation |
| **G2 URL resolution** | An actual fetch, not a non-empty check. 🟢 Same standard as the content linter's `L22` — *"a populated-but-dead citation is worse than no citation"* |
| **G5 direction** | Flagged as **ours**, not theirs. The alert reads *"probable unit error on our side"* |
| **On G6** | The run **halts before the renderer**. Nothing partial ships. **Previously published rows stay up** — G6 stops new publication, it does not retract |
| **Every suppression is logged** | With its gate, its row and its reason. **The suppression log is the audit trail that replaces the reviewer** |

🟢 **And the honest note, which belongs in any handover:**

> *"Removing the human check **shifts the risk onto the corpus's freshness guarantee**. If the crawl goes
> stale, we now publish stale claims **at scale** rather than one at a time. G1 and G6 bound that."*

---

### ⓓ The Classifier — a rule, never a model

| | |
|---|---|
| **What** | Sorts each row into `definitional` · `disagreement` · `agreed` · `single-source` |
| **Why** | 🟢 Getting this wrong is *"the exact sloppiness we sell against"* |
| **How** | **Deterministic. `basis` decides it. No model call.** |

```
bases DIFFER            → definitional     "these measure different things"
bases MATCH, values differ → disagreement  "these measure the same thing and do not agree"
bases MATCH, values align  → agreed        ✅ and it is published, see below
only one candidate         → single-source
no stated basis            → ⬛ suppressed (G3). we do not guess
```

🟢 **`agreed` is published, not dropped**, and the reason is a positioning one:

> *"Where a figure is current and the sources agree, say so, in the same neutral register. **An index that
> never has good news is an argument, not a measurement**, and it will be read as one."*

---

### ⓔ The Compute

`age_months` · `spread_pct` · `repetition_count`

**Deterministic arithmetic over the gated candidates.** No model. `repetition_count` = how many publications
carry the figure without new measurement.

---

### ⓕ The Renderer — the register is a data shape, not a prompt

**This is the station where an autonomous engine either holds its voice or does not.**

🟢 The register, inherited verbatim from `guerrilla-campaign-plan.md` §4:

- **State the publisher, the date, the age, the spread. Never an evaluative adjective about a named firm.**
  ⛔ No *stale*, *outdated*, *unreliable*, *poor*, *lazy*
- 🟢 *"**'Published fourteen months ago' is unarguable; 'outdated' is an opinion we cannot afford in public**
  — we cite these publishers as sources"*
- 🟢 **We are not exposing a fraud.** *"Most canonical figures are stale because everyone repeated a reasonable
  number and nobody re-measured. **That is a systemic property**"*

#### 🟢 And the mechanism, which is the important part

> **"Because there is no human reviewer, these are not guidance. They are template constraints: the renderer
> has no field into which an adjective could be placed."**

**What that means for the build — NEW:**

The renderer takes **only typed values**, never free text:

```
RenderRow {
  sector, geography, metric              enum / code
  figure { value, unit, period }         numeric
  publisher                              string, from source
  published_at, source_last_verified     dates
  age_months, spread_pct, repetition_count   computed numbers
  classification                         enum of four
}
```

**There is no `summary`, no `note`, no `comment` field.** Prose in the issue comes from **fixed sentence
templates** with these values substituted. **A model never writes a sentence that reaches a reader here.**

🟢 **Copy rules that ride with it** — `website-structure.md` §4.3:

| | |
|---|---|
| **1** | **The published word is `Age`.** *"Staleness"* is the internal name and **never appears in copy** |
| **2** | **State facts. Never judgement.** Publisher, date, age. Never *outdated*, *stale*, *unreliable* |

**Enforce rule 1 as a lint over the templates**, not as a habit — the internal name is in the filename, the
schema and this document, and it will leak otherwise.

---

### ⓖ Hygiene — and one difference from the content engine

🟢 `CLAUDE.md` Rule 6 applies. **But the branch is narrower here:**

> 🟢 **"prose only, FIGURES UNTOUCHED"**

| Object | Hygiene |
|---|---|
| Issue prose, standfirst, page copy | ✅ Cleaned |
| **Every figure, unit, period, publisher name, URL** | ⛔ **Never touched** |

🟢 Same protected-span rule as the content engine — *"a mangled citation URL is a broken proof"* — and here it
is load-bearing rather than cautionary, because **the figures are the entire artefact**.

**The standing research-sector disclosure applies to every issue.**

---

### ⓗ The three destinations

🟢 **One item, three destinations, computed once.**

| | Destination | Nature |
|---|---|---|
| **1** | **The per-sector row** on `/market-size/[sector]-[geography]` | **Permanent. The primary home** |
| **2** | **`/the-record/age-of-the-numbers`** | The monthly issue summarising what moved |
| **3** | **Campaign examples** | 🟢 *"the guerrilla campaign draws its examples from the same rows"* |

🟢 **Why per-sector rather than per-issue:**

> *"A general index is interesting. **'Here is yours' is shareable.**" Consumer people share the consumer row;
> healthcare people share theirs. **Each row is a specific, checkable fact about a number that reader has
> personally repeated.**"*

**And a third artefact falls out of it** — 🟢 *"**the atom** — one sector row as a standalone card with its
source line. **What actually travels.**"*

#### ⚠ These pages are not review-queue items

🟢 Same rule as the content engine's generated pages: **the template is reviewed once; the rows are not.**
Putting them in the queue would put hundreds of rows into a queue budgeted for 23 items.

#### Publishing mechanics — NEW

| | |
|---|---|
| **Idempotency** | A row is keyed on `sector × geography × metric`. **A re-run updates in place; it never appends.** A run that produces an identical row publishes nothing and logs a no-op |
| **Versioning** | Each published row keeps its previous values. **A figure that changes is a change we can show**, and it is the index's own subject matter |
| **Unpublish** | A row found wrong is **removed first, corrected second** — 🟢 the runbook's order for the content engine, and it applies here with more force because nobody reviewed it going out |
| **The issue is a snapshot** | The monthly issue is generated from the rows **as at its publication date** and does not mutate afterwards |

---

### ⓘ The Meter — and it reports to `p`, not to weekly `x`

**This engine's contribution is presence, not attributed revenue.**

🟢 The atom is *"what actually travels"*, and travel is exactly what `p` counts: cited in an AI answer ·
listed on a page-one third party · our own page ranks page one.

**Still stamped.** Every outbound link from an issue or a row carries `utm_*` and `icp_hint`, **because a row
that converts must be attributable like anything else.**

🟢 **Cost, for the record:** model use *"near zero"* · one batch call per run · **human zero in the happy path,
exception handling on G6 only** · *"the gates are the work."*

---

## 3 · What runs when — NEW, because the doc leaves cadence open

🟢 Open item 3: *"Monthly issue is proposed. **The underlying rows can refresh continuously**; the question is
how often the issue is worth publishing."*

**Proposed, and both numbers are starting values:**

| | 🔵 Suggested | Note |
|---|---|---|
| **Row refresh** | **Weekly** | G1 allows 30 days; refreshing weekly means a row is never close to its own expiry |
| **Issue** | **Monthly** | 🟢 as proposed |
| **G1 threshold** | **30 days** | 🟢 *"a starting value, not a measurement. **Tune once we see real `source_last_verified` distributions**"* |
| **G6 threshold** | **20%** | Same posture |

**Two rules that follow:**

- **The issue never triggers a refresh.** It renders whatever the rows say on its date. Coupling them would
  mean a monthly deadline could push a thin run out.
- **A refresh that trips G6 does not block the issue** — it blocks the *update*. The issue renders the last
  good rows, and **the alert says so**.

---

## 4 · The alert — the only human touchpoint

**One trigger: G6.** Everything else is silent by design.

```
G6 trips
   │
   ▼  publish nothing this run
   ▼  keep previously published rows up
   ▼  🔔 alert, carrying:
         · suppression rate this run vs the last four
         · the gate breakdown  (how many G1, G2, G3, G5)
         · the sectors most affected
         · the last good run's date
```

**Why the breakdown matters.** 🟢 G6 means *"the input is rotting"* — but **which** gate is failing says what
kind of rot. Mostly G1 is a crawl going stale; mostly G3 is a corpus change that dropped `basis`; mostly G2 is
link rot. **Three different conversations with Jayant's team, and the alert should name which one.**

**Routing — open question I-3.** The content engine has no alerting spec either; **whatever is built should
serve both.**

---

## 5 · What must be tested — and this is not optional here

**The content engine's safety is a person. This engine's safety is six gates.** So the gates are the only
thing standing between a bug and a wrong published claim about a named company.

**Six tests, one per gate, each proving the gate SUPPRESSES:**

| | Fixture | Must produce |
|---|---|---|
| G1 | `source_last_verified` 31 days old | row suppressed |
| G2 | A URL that 404s | candidate dropped; row suppressed if fewer than two remain |
| G3 | A candidate with no `basis` | row suppressed |
| G4 | Same basis, different base years | **classified `definitional`**, never `disagreement` |
| G5 | Spread of 600% | suppressed **and** flagged as our unit error |
| G6 | A basket where 21% suppress | **nothing published · alert raised · prior rows still up** |

**Plus two that are not gates but are the same class of risk:**

| | Test | Must produce |
|---|---|---|
| **Register** | Attempt to render any evaluative adjective | **Impossible by shape** — the test asserts there is no field to put one in |
| **Scope** | The principal attempts `trigger_generation` | **Rejected server-side.** Asserts the scope list, not the code path |

> **If these eight do not exist, the engine is not safe to run unattended — regardless of how correct the code
> looks.**

---

## 6 · What it needs, and from whom

| | Need | From | Status |
|---|---|---|---|
| **1** | **`source_last_verified`** — mandatory on `fact_lookup` | Jayant | 🔴 **Not built.** 🟢 *"the field that replaces the human"* |
| **2** | **`basis` mandatory, not best-effort** | Jayant | 🔴 **G3 depends on it** |
| **3** | **`POST /fact_lookup/batch`** | Jayant | 🔴 Not built |
| **4** | **A service principal without `trigger_generation`** | Jayant | 🔴 Not issued |
| **5** | **The basket** | Joy | 🔴 I-1 |
| **6** | **Cadence + thresholds** | Joy | 🔵 Proposed in §3 |
| **7** | **Alert routing** | Either | 🔴 I-3 |

🟢 **None of 1–3 is a new API surface** — *"both are extensions of `fact_lookup`, which is already specced."*

---

## 7 · The boundary with the content engine

**They share a corpus and a contract. They share nothing else, and that is deliberate.**

| | Which engine |
|---|---|
| A trend somebody is discussing | **Content** |
| A tracked figure moving | **Index** |
| Anything a person writes or approves | **Content** |
| Anything published with no human in the loop | **Index. And only this** |

**Three concrete interlocks:**

1. **A content-engine `diverges` verdict is not an index row.** The content engine reacts to a conversation;
   the index tracks a basket. **A finding may appear in both, computed separately.** Coupling them would put
   an autonomous publisher downstream of a trend detector.
2. **The index's rows are legitimate content-engine source material.** A monthly issue is a Type A input the
   content engine may fan out — **through its own human gate**, as normal.
3. **The Age module on a `/market-size/*` page is the index's output**, not the content engine's. The content
   engine may cite it; it never writes it.

> **The rule in one line: nothing the index engine publishes has been through a review, so nothing that
> requires a review may be routed into it.**

---

## 8 · Open questions

| # | Question | Blocks | Whose |
|---|---|---|---|
| **I-1** | **The basket** — which sectors × geographies × metrics, and how many. 🟢 *"Start narrow"* | ⓐ, everything | Joy |
| **I-2** | **Cadence** — weekly refresh + monthly issue, as proposed in §3? | ⓑ | Joy |
| **I-3** | **Alert routing** — where does a G6 alert go, and to whom? **Serve both engines with one mechanism** | ⓘ | Either |
| **I-4** | **The name.** 🟢 *"Staleness index is no longer accurate now that it carries both columns. **It should not be a word that implies judgement**"* | ⓕ copy | Joy |
| **I-5** | **Thresholds** — G1 at 30 days and G6 at 20% are 🟢 starting values. Tune on the first real distributions | ⓒ | Joy, on data |
| **I-6** | **Does this principal share the content engine's ceiling, or have its own?** 🟢 The contract says *one ceiling for the whole principal* — so a **separate principal** implies a separate ceiling. Which? | ⓑ | Jayant |

---

## 9 · Build order

| Phase | What | Blocked on |
|---|---|---|
| **1** | **The gates and their six tests**, against fixtures | **Nothing.** 🟢 *"The gates are the work"* |
| **2** | Classifier + compute — deterministic, testable | Nothing |
| **3** | Renderer + the two structural tests | I-4 for copy |
| **4** | The probe | **Needs 1–4 in §6** |
| **5** | Scheduling, idempotency, the G6 alert | I-2, I-3 |
| **6** | The three destinations | The website's CMS write path |

**Start with the gates.** They are pure functions over fixture data, they need no API and no decision, and
**they are the entire safety model.** Building anything else first builds a machine whose brakes are not
finished.

---

*Document: `index-engine-runtime-spec.md` · 2026-09-09 · The runtime for
[`index-engine.md`](index-engine.md), which governs. An addition, not a revision — every rule cited is hers;
everything marked **NEW** is mechanism she left open. Six open questions in §8. Sibling engine:
[`content-engine-runtime-spec.md`](content-engine-runtime-spec.md); the boundary between them is §7.*
