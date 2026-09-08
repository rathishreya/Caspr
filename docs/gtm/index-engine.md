# The Index Engine

*2026-08-25. An autonomous engine that publishes how old market figures are and how far their sources disagree — with no human in the happy path.*

**Reads alongside:** [`guerrilla-campaign-plan.md`](guerrilla-campaign-plan.md) §4 · [`gtm-api-contract.md`](gtm-api-contract.md) §3 · [`content-engine.md`](content-engine.md)

---

## 1 · What it publishes, and why it is one artefact rather than two

**The original proposal was a staleness index — how old the most-cited figure in each sector is.** Seven SERP tests on 2026-08-25 found something consistently worse than age:

| Query | What was on page one |
|---|---|
| `UK ready meals market` | **`$5.86bn · 4.95% CAGR`** against **`$6.46bn · 12.4% CAGR`** — same market, same base year |
| `industrial valves Saudi Arabia` | IMARC **$725.0M** against MarkNtel **$990M** — **36% apart** |
| `SaaS revenue multiples` | **`8.5x NTM`** against **`3.3x TTM`** — a 2.5× swing on a definitional difference |
| `copper production by country` | *"Chile is largest"* against *"China is 48% of refined"* |

> **Age is one failure. Two credible sources 36% apart on the same market is a better story, and it is more common.** One index, two columns: **how old the number is, and how far the sources are apart.** Both are facts. Neither is a judgement.

**This is `icp-personas.md:65` turned into a recurring publication** — *"IBISWorld numbers that don't match a newer Euromonitor report. Reconciling conflicting data sources is a multi-hour job with no guaranteed resolution."*

---

## 2 · ⚠ The distinction the whole thing rests on

**Not all differences are disagreements, and conflating them would be the exact sloppiness we sell against.**

| | Case | How it is reported |
|---|---|---|
| **Different definition** | Copper: *mine* production vs *refined* production. SaaS: *NTM* vs *TTM* revenue | **"These measure different things."** The finding is that **nobody says so** |
| **Genuine disagreement** | UK ready meals: two sources, same definition, same base year, **$5.86bn vs $6.46bn** | **"These measure the same thing and do not agree."** |

**The engine must never report the first as the second.** It is enforced structurally: **every candidate must carry a `basis` field, and rows where the bases differ are classified as definitional, never as disagreement.**

**A row whose candidates have no stated basis cannot be classified and is suppressed.** We do not guess.

> **The definitional cases are the more interesting half.** *"The two most-cited copper figures measure different things and neither page says which"* is a sharper finding than *"two numbers differ"* — and it is unarguable.

---

## 3 · Why it is a separate engine

| | Content engine | Index engine |
|---|---|---|
| **Output** | Written items | **Rendered data** |
| **Review** | Human queue, three actions | **None. Publishes autonomously** |
| **Clock** | Weekly, tied to review capacity | **Monthly issue, continuous underlying refresh** |
| **Model use** | Frontier + Haiku generation | **Almost none.** Templated rendering over structured data |
| **Failure mode** | An item is weak | **A published claim about a named company is wrong** |

**The last row is why it is separate.** The content engine's safety comes from a human reading every item. **This one has no human, so its safety has to be structural** — and mixing the two would mean either gating this behind a review it does not need, or removing a gate the other one does.

---

## 4 · The pipeline

```
BASKET  (sector × geography × metric — the tracked set)
   │
   ▼
BATCH fact_lookup                    ← §6, the one new API ask
   │   returns per candidate: value · unit · period · basis
   │                          publisher · published_at · source_last_verified · url
   ▼
GATES  (§5 — every one suppresses rather than degrades)
   ▼
CLASSIFY   definitional │ disagreement │ agreed │ single-source
   ▼
COMPUTE    age_months · spread_pct · repetition_count
   ▼
HYGIENE    CLAUDE.md Rule 6 — prose only, figures untouched
   ▼
PUBLISH    per-sector rows (permanent) + monthly issue + data-page inputs
```

**One item, three destinations, computed once.** The per-sector row lives permanently on the data page; the monthly issue summarises what moved; the guerrilla campaign draws its examples from the same rows.

---

## 5 · The gates — how a machine publishes safely

**The human check this replaces was `CURRENCY_CHECK_MISSING` — a person verifying the publisher had not issued a newer figure. I called it *"the single most likely error in this programme."* Removing the human does not remove the risk; it moves it into a field.**

| | Gate | Fails → |
|---|---|---|
| **G1** | **Freshness.** `source_last_verified` older than **30 days** | **Suppress the row.** Never publish "this is the latest" on an unverified source |
| **G2** | **Resolvable source.** Every candidate has publisher, date and a URL that resolves | **Drop the candidate.** A row below two candidates is suppressed |
| **G3** | **Stated basis.** Every candidate declares what it measures | **Suppress.** Without it, definitional and disagreement cannot be told apart — §2 |
| **G4** | **Period alignment.** Candidates compared must share a base period | **Reclassify as definitional**, never as disagreement |
| **G5** | **Sanity bound.** Spread above 500% | **Suppress and flag.** Almost certainly a unit error on our side, not theirs |
| **G6** | **Basket-level.** More than **20% of rows suppressed** in a run | **Publish nothing. Alert a human.** That is corpus degradation, not a bad row |

**G6 is the one that makes autonomy safe.** Individual suppressions are normal and silent. **A pattern of them means the input is rotting**, and publishing a thinned index off a degrading corpus is how an automated system embarrasses you slowly.

### 5.1 The risk that moved rather than disappeared

**Removing the human check shifts the risk onto the corpus's freshness guarantee.** If Jayant's crawl goes stale, we now publish stale claims **at scale** rather than one at a time.

**G1 and G6 bound that** — nothing publishes without a verification stamp inside 30 days, and a systemic problem stops the whole run. **But it should be said plainly rather than discovered: this engine's blast radius is larger than a human-reviewed one, and its safety is entirely in the gates.**

---

## 6 · What it needs from Jayant — two things, both small

**No new API surface.** Both are extensions of `fact_lookup`, which is already specced.

### 6.1 `source_last_verified` — the field that replaces the human

```json
{
  "value": 725.0, "unit": "USD_M", "period": "2025",
  "basis": "Industrial valves, all end-use, sell-in value",
  "source": {
    "publisher": "IMARC Group",
    "published_at": "2026-02-14",
    "source_last_verified": "2026-08-22",     // ← NEW
    "url": "https://…"
  }
}
```

**`published_at` is when the publisher published. `source_last_verified` is when our corpus last confirmed nothing newer exists.** They are different questions and only the second makes autonomous publishing safe.

**`basis` is already implied by §3.1 of the contract** *(return the disagreement, do not resolve it)* — **but it must be mandatory rather than best-effort**, because G3 depends on it.

### 6.2 Batch lookup

**Measured on 2026-08-24: roughly 200 units of fixed overhead per request.** A 500-row basket run sequentially is mostly overhead.

```
POST /fact_lookup/batch     { "queries": [ …up to 100… ] }
```

**Same response shape per query, one round trip.** This is the difference between a monthly index that is viable and one that is not.

---

## 7 · The register — unchanged, and it is the whole position

**Inherited verbatim from `guerrilla-campaign-plan.md` §4, and enforced in the template rather than trusted to a prompt:**

- **State the publisher, the date, the age, the spread. Never an evaluative adjective about a named firm.** No *stale*, *outdated*, *unreliable*, *poor*, *lazy*. **"Published fourteen months ago" is unarguable; "outdated" is an opinion we cannot afford in public** — we cite these publishers as sources
- **Where a figure is current and the sources agree, say so, in the same neutral register.** **An index that never has good news is an argument, not a measurement**, and it will be read as one
- **We are not exposing a fraud.** Most canonical figures are stale because everyone repeated a reasonable number and nobody re-measured. That is a systemic property
- **The standing disclosure applies** — every issue touches the research sector

**Because there is no human reviewer, these are not guidance. They are template constraints:** the renderer has no field into which an adjective could be placed.

---

## 8 · Cost

| | |
|---|---|
| **Model use** | **Near zero.** Rendering structured data, not writing |
| **`fact_lookup`** | One batch call per run. **Never `trigger_generation`** — this engine cannot start billable work |
| **Human** | **Zero in the happy path.** Exception handling on G6 only |
| **Build** | Small. A scheduler, the gates, a renderer. **The gates are the work** |

**The engine must be structurally unable to reach `trigger_generation`** — the service principal's scopes already enumerate what it may call, and this one should not have it.

---

## 9 · Open

| | |
|---|---|
| **1** | **The name.** *Staleness index* is no longer accurate now that it carries both columns. It should not be a word that implies judgement — **the artefact reports age and spread and lets the reader conclude** |
| **2** | **The basket.** Which sectors × geographies × metrics, and how many. **Start narrow** — the same seed-and-verify logic as the data pages |
| **3** | **Publication cadence.** Monthly issue is proposed. **The underlying rows can refresh continuously**; the question is how often the *issue* is worth publishing |
| **4** | **G1's 30-day threshold** is a starting value, not a measurement. Tune once we see real `source_last_verified` distributions |
