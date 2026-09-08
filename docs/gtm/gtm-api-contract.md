# GTM Engine — API Contract

**For:** Jayant (CTO) and the backend team
**From:** Joy · **v1** 2026-08-20 · **v1.1** 2026-08-24 · **v1.2** 2026-08-25 · incl. credit metering (§1.1–1.2)
**Companion to:** [`docs/product/api-spec-v2.md`](../product/api-spec-v2.md) — **that document governs.** This one adds a second consumer. Where they differ, v2 wins.

---

## v1.2 — 2026-08-25 · three additions to `fact_lookup`, and the ceiling moves to credits

**Two changes, and neither adds an endpoint.**

| | | Where |
|---|---|---|
| **A** | **Three additions to `fact_lookup`** — `source_last_verified`, mandatory `basis`, a batch endpoint | Below |
| **B** | **The spend ceiling is now denominated in credits, not dollars**, and covers every metered call rather than `trigger_generation` alone | **§1.1–1.2** |

**B uses the metering you already built for edit credits** — no second accounting path, and the engine never has to hold a price list.

**Why now:** an autonomous engine ([`index-engine.md`](index-engine.md)) will publish, without human review, how
old the most-cited market figures are and how far their sources disagree. **A human currently sits in that loop
as the safety gate. These three changes are what let a machine replace them safely.**

### 1 · `source_last_verified` — a new field, and the important one

```json
"source": {
  "publisher": "IMARC Group",
  "published_at": "2026-02-14",
  "source_last_verified": "2026-08-22",     ← NEW
  "url": "https://…"
}
```

**`published_at` is when the publisher published it. `source_last_verified` is when the corpus last confirmed
nothing newer exists.** They answer different questions, and **only the second makes autonomous publishing
safe.**

**The engine gates on it: if `source_last_verified` is older than 30 days, the row is suppressed rather than
published.** Publishing *"this is the latest figure"* without having checked is the single most likely error
in the programme and the one that would hand a publisher a free rebuttal.

**If the corpus cannot supply this per-source, say so** — it changes the design rather than blocking it, and it
is far cheaper to know now.

### 2 · `basis` — promote from best-effort to mandatory

**Already implied by §3.1** *(return the disagreement rather than resolving it)*. **It now has to be
guaranteed**, because a structural safety rule depends on it:

> **Not all differences are disagreements.** Copper: *mine* production vs *refined* production. SaaS: *NTM* vs
> *TTM* revenue. **Those measure different things** — reporting them as "sources disagree" would be exactly the
> sloppiness Caspr sells against.

**The engine compares `basis` across candidates. Bases differ → classified as definitional. Bases match and
values differ → genuine disagreement. `basis` absent → the row is suppressed, because it cannot be told apart.**

**A candidate without a stated basis is unusable to us.** Dropping it server-side is fine; returning it with a
null basis is not.

### 3 · `POST /fact_lookup/batch`

```
POST /fact_lookup/batch     { "queries": [ … up to 100 … ] }
```

**Same response shape per query, one round trip.** We measured roughly **200 units of fixed overhead per
request** on 2026-08-24 — a several-hundred-row index run made sequentially is mostly overhead.

**Volume is modest and stays modest:** 40 seeded data pages, and an index basket that starts narrow. **This is
about efficiency per run, not about scale.** The v1.1 seeding-burst allowance can be reduced accordingly.

---

## Not an ask on you — context only

**Caspr is adding a second top-level metric alongside `x`: `p`, presence** — the share of a fixed basket of
buyer questions where Caspr appears in the answer, whether cited by an AI, listed in a third-party roundup, or
ranked. Full definition: [`presence-metric.md`](presence-metric.md).

**It needs nothing from the AI service.** It is measured through third-party AI-visibility tooling.

**One small product-side item it does imply**, for whoever owns the app rather than the AI service:

> **Recognise AI referrers in the attribution block.** `tracking-spec.md` Part 2 already captures
> `referrer_host`. **Traffic arriving from `chat.openai.com`, `perplexity.ai`, `gemini.google.com` and similar
> should be identifiable as a class**, not lost among "direct". Otherwise a channel that works through
> citation is invisible to the funnel, and we would read a working channel as a dead one.

---

## Revisions since the version you were sent

**Both changes make the ask smaller. Nothing new has been added.**

| | v1 said | v1.1 says | Where |
|---|---|---|---|
| **1** | **`demand_signal`** — a second AI-service tool returning aggregated demand clusters | **Withdrawn as an endpoint.** It cannot be built on your side: the field that makes it worth having is `signup_rate` per cluster, and the AI service has no visibility of whether a session became an account — `api-spec-v2` §1.8 puts that data on our side by design. **What we need instead is one field on an existing response**, not a tool | **§4.1** |
| **2** | `fact_lookup` metered at ~600/hour | **Same sustained rate. The seeding burst is much smaller than v1.1 implied** — 40 pages initially, not thousands, after the page plan was cut on measured data. **Caching is ours; we are not asking you to absorb per-visitor load.** See also v1.2 item 3 — a batch endpoint matters more than a higher rate | **§3.3** |

**The replacement ask, in full — this is all of §4 that touches your side:**

`propose_layout` already determines the domain of a prompt; it cannot propose sections for a market analysis
without knowing which market. **Return that determination on the response you already send:**

```json
"classification": {
  "sector": "25",            // GICS, or null when undeterminable
  "geography": "GB",         // ISO 3166-1 alpha-2, or "WORLD", or null
  "analysis_type": "market_research",
  "depth_implied": "study"
}
```

**Closed vocabularies only — no free text crosses the boundary.** Everything else (aggregation, thresholds,
consent, the signup join) is ours, over our own event stream.

> **One question back:** is GICS the right vocabulary here, or do you already hold a taxonomy we should use
> instead? If the service does not classify to a fixed vocabulary today, say so — it changes the sequencing
> but not the launch, since none of this is on the critical path (§4.4).

**Unchanged from v1:** the service principal (§1), the server-side spend ceiling (§1.1), the call order (§2),
and the three `fact_lookup` rules in §3.1 — **return the disagreement rather than resolving it**, `not_found`
is a valid answer that **must never escalate to generation**, and a candidate without a resolvable source is
dropped rather than returned with nulls.

---

## 0 · What this is, and the good news

The GTM engine ([`content-approach.md`](content-approach.md)) publishes marketing content under one rule: **cited, or it does not ship.** Every published number traces to a real Caspr analysis or a named person's opinion. That makes the product a dependency of the marketing engine, which is why this document exists.

**Two of the four things the engine needs are already built.**

| Engine need | Tool | Status |
|---|---|---|
| Read an analysis that already exists | **`retrieve_analysis`** — v2 §7 | 🟢 **Built.** No change requested |
| Commission a new analysis | **`trigger_generation`** — v2 §3 | 🟢 **Built.** No change requested |
| Look up a single cited fact | **`fact_lookup`** | 🔴 **New** — §3 |
| Read aggregated demand | — | 🟢 **Nothing needed.** §4 — **product-side end to end.** One question that may resolve to no work at all |

**So the ask is one new tool, one credential, and a metering block** — not a new interface.

**It has shrunk twice.** `demand_signal` was first scoped as a second tool; then reduced to one field on
`propose_layout`; **and on 2026-08-25 removed altogether** — it is product-side work, and putting any of it on
the AI service was a mistake in the draft rather than a requirement (§4.1).

§1 is the credential, and it is the part that cannot be skipped: **v2 assumes every caller is a person, and
this caller is not.**

**Everything in v2 §1 applies unchanged** — transport (§1.1), identifiers and time (§1.3), the error envelope (§1.4), the 429 shape (§1.5), the never-appears list (§1.7), audit obligations (§1.8). None of it is restated here. Both new tools ride **Streamable HTTP at `{AI_ORIGIN}/mcp`**, per §1.1: request/response with a bounded answer.

---

## 1 · The service principal — the one structural difference

v2 §1.2 says *"Caspr is the identity provider"* and every JWT carries `sub` = a Caspr user id. **The GTM engine is a server-side service on AWS. It is not a person, it has no browser, and it must not borrow a human's token.**

**Requested:** a machine principal issued by the same Caspr backend, verified against the same JWKS, differing only in its claims.

```json
{
  "iss": "https://auth.caspr.ai",
  "aud": "caspr-ai-service",
  "sub": "svc_gtm_engine",
  "principal_type": "service",
  "scopes": ["fact_lookup", "demand_signal", "retrieve_analysis", "trigger_generation"],
  "iat": 1755657600,
  "exp": 1755661200
}
```

- **`principal_type: "service"`** is the branch point. A service principal has **no Data Room, no personal documents and no user history** — §5.1 explains why that is a hard boundary rather than a convenience
- **`scopes` is enumerated and enforced server-side.** The engine should be unable to call anything not listed, so that a compromised engine cannot read customer analyses
- **Same ≤60-min RS256 JWT, same JWKS, no second auth system.** D2 holds: **no token in a URL, ever**
- **No `email` or `plan` claim** — there is no person and no subscription behind this caller

### 1.1 A hard ceiling, enforced server-side — denominated in credits

`trigger_generation` is *"the only call that starts billable work"* (v2 §3). **A loop in a marketing engine that can start billable work is the most expensive bug available here**, and it is exactly the failure that never shows up in testing.

**Requested:** a monthly ceiling on the service principal, enforced **in the backend, not in the engine.**

**Changed 2026-08-25: the ceiling is denominated in credits rather than dollars, and it now covers every metered call rather than `trigger_generation` alone.**

#### Why credits — three reasons, and the third decides it

| | |
|---|---|
| **1** | **The meter already exists and you already return it.** Per `EDIT-CREDITS-WALLET-DEV-NOTES.md`: *"Jayant's API returns already-marked-up credit counts per call; product records/charges as-is (no product-side margin)."* **The GTM principal becomes one more consumer of a meter that is already built** — dollars would mean a second accounting path maintained for exactly one caller |
| **2** | **The engine never has to hold a price list.** List prices move. A ceiling in dollars means whatever enforces it must know the current price of a Study and keep on knowing it. **A credit is a unit of compute and does not move when a plan does** |
| **3** | **Booking our own analyses at list price would corrupt `x`** — below |

#### ⚠ The third reason, stated properly

**`x` is revenue per $1 of total GTM spend — *charges actually taken*, never budgets authorised** ([`plan.md`](plan.md)). **An analysis this engine commissions for itself is not a charge taken. It is compute consumed.**

Booking it at $80 list would **overstate GTM spend and understate `x`** — and what follows is not an accounting error, it is **killing a channel that is working**, because its denominator was inflated by an internal transfer price.

> **Charge actual marked-up compute, exactly as an edit does. Never the list price of the analysis.**

#### The mechanism

| | |
|---|---|
| **Unit** | **Credits.** Same unit, same markup, same *no product-side margin* rule as edit credits |
| **Scope** | **The whole service principal** — `trigger_generation`, `fact_lookup`, `fact_lookup/batch`. **One ceiling, not one per endpoint** |
| **Default** | **150,000 credits/month.** A placeholder — see the sizing note |
| **Soft alert** | **70% of ceiling**, surfaced in the response so the portal can warn before it stops |
| **On breach** | **`403` `{"code": "gtm_budget_exhausted", "credits_used": …, "credits_ceiling": …}`.** Not a queue, not a silent degrade. The engine surfaces it and halts |
| **Never metered** | **Anything served from your cache.** The direct analogue of the product rule that charts and templated infographics draw nothing: **a repeat lookup of the same sector–geography pair is not new compute** |

#### On the number — we cannot size it yet, and are not pretending otherwise

**The old $500 was 3× headroom over 1–2 Studies at list. In credits we do not know what a Study costs, or a `fact_lookup` on a cache miss.**

**150,000 is chosen as a runaway-loop backstop rather than as a budget — set it properly on the first month of actuals.** Same posture as [`index-engine.md`](index-engine.md) gate G1's 30-day threshold: a starting value, openly labelled as one.

**Two numbers from you would let us set it correctly today** — §6.

**Client-side limits do not count.** The whole point is that the ceiling survives a bug in the thing it is limiting.

### 1.2 What every metered response returns

**One block on every response to the service principal:**

```json
"metering": {
  "credits_charged": 412,        // this call, already marked up
  "credits_remaining": 138204,   // against the principal's monthly ceiling
  "cache_hit": false             // true → credits_charged is 0
}
```

**Charged per query on batch, never per request.** `POST /fact_lookup/batch` carrying 100 queries returns 100 charges. **If a batch were charged once, the batch endpoint would look free** — and the accounting would quietly stop being true, which is worse than having none at all.

**Why `credits_remaining` rather than the engine keeping its own running total:** the ceiling is enforced in your backend precisely so that it survives a bug in ours. **An engine that tracks its own spend client-side has rebuilt the thing the ceiling exists to defend against.**

**One ledger line per published item, not per call.** The portal rolls every call made in producing an item into a single figure — the same rule as the wallet's *"one rolled-up line per report"*. **Four hundred `fact_lookup` calls behind one index issue is one number a person will actually read; four hundred rows is noise nobody checks.**

---

## 2 · The call order — a rule, not a preference

> **Retrieve → look up → only then request.**

| Step | Tool | Cost |
|---|---|---|
| 1 | `retrieve_analysis` — is this already answered in an analysis we have run? | Free |
| 2 | `fact_lookup` — is this a single fact rather than a piece of research? | Cheap |
| 3 | `trigger_generation` — commission a new analysis | **Billable, and human-commissioned** |

**Most content needs a fact, and a fact should never cost a Study.** A marketing engine that reflexively commissions research to source a market-size figure would burn the ceiling in a week and produce nothing better than step 2.

**Step 3 additionally requires a human.** Per `content-approach.md` §5.3, the demand pipeline ranks candidates and a person picks — so `trigger_generation` from a service principal carries one extra required field:

```json
{ "commissioned_by": "joy@caspr.ai" }
```

A named human, recorded in the audit trail (v2 §1.8). **Reject the call if it is absent.** This is the interface making an editorial policy unforgettable rather than trusting the engine to remember it.

---

## 3 · 🔴 `fact_lookup` — a single cited figure

**The load-bearing one.** Programmatic search content at any volume is impossible without it, and it is what keeps step 3 rare.

### Request

```json
{
  "question": "Market size of the UK electric vehicle market",
  "metric": "market_size",
  "sector": "25",
  "geography": "GB",
  "period": "2025",
  "max_candidates": 3
}
```

| Field | Type | Req | Notes |
|---|---|---|---|
| `question` | string | ✓ | Natural language. ≤300 chars |
| `metric` | enum | — | `market_size` · `growth_rate` · `share` · `count` · `price` · `other`. A hint, not a constraint |
| `sector` | string | — | **GICS code**, matching the taxonomy already used in the product |
| `geography` | string | — | ISO 3166-1 alpha-2, or `WORLD` |
| `period` | string | — | Year or `YYYY-YYYY` |
| `max_candidates` | int | — | Default 3, max 5 — see below |

### Response

```json
{
  "status": "found",
  "candidates": [
    {
      "value": 4.2,
      "unit": "USD_BN",
      "period": "2025",
      "geography": "GB",
      "basis": "New passenger BEV registrations, retail value",
      "source": {
        "publisher": "Society of Motor Manufacturers and Traders",
        "title": "Vehicle registration data, December 2025",
        "url": "https://…",
        "published_at": "2026-01-08",
        "source_type": "industry_body"
      }
    }
  ],
  "disagreement": true,
  "retrieved_at": "2026-08-20T11:04:00Z"
}
```

`status` ∈ `found` · `not_found` · `ambiguous`.

### 3.1 Three rules that make this tool usable rather than dangerous

**1 · Return the disagreement. Do not resolve it.**

When credible sources give different numbers, **return all of them** with `disagreement: true`. This is not a limitation to be tidied away — *"Every claim, triangulated"* is a third of the company's proof line, and `icp-personas.md:65` is a buyer describing exactly this pain: *"IBISWorld numbers that don't match a newer Euromonitor report."* **A single averaged figure with no visible workings is what the competition does.**

**2 · `not_found` is a correct answer and must never escalate.**

If no credible source supports a figure, return `not_found`. **Do not fall back to generation, do not infer, do not estimate.** The engine handles `not_found` by not publishing the claim.

> **This tool must never trigger billable work as a side effect.** If `fact_lookup` can silently become an analysis, cost and latency both become unpredictable and the ceiling in §1.1 stops meaning anything.

**3 · Every candidate carries a resolvable source or it is not returned.**

A candidate without `publisher`, `title`, `url` and `published_at` is dropped server-side rather than returned with nulls. The engine cannot publish it, so returning it only creates a filtering job — and one day, a bug that publishes it.

### 3.2 Latency and freshness

Target **p95 under 3 seconds**. Cache is welcome and expected; return `retrieved_at` so the engine can age out a figure. **A published number older than 18 months should be re-looked-up, not reused** — a stale market size on a page whose argument is *"we cite"* is worse than no page.

### 3.3 Metering — sized for a page family, not occasional lookups

**Revised 2026-08-24.** `fact_lookup` now backs a **generated page family** — one page per sector–geography intersection for the *"market size of [industry]"* queries (`content-approach.md` §3B) — rather than ad-hoc lookups during writing. **The volume assumption changed; the endpoint did not.**

Per v2 §1.5. Suggested **600/hour** sustained for the service principal, with **burst headroom for an initial seeding run** — a few thousand calls over a day or two as the first pages are generated, then a low steady state as the cache does the work.

`429` with `reason: "fact_lookup_rate_limited"`. **This is a read against cached sources**, so a generous ceiling costs little and a tight one throttles the only compounding channel we have.

> **⚠ The rate limit and the credit ceiling are different instruments, and we need both.** 600/hour sustained is roughly **430,000 calls a month** — entirely within the rate limit and ruinous on cost. **A rate limit stops a burst. Only the credit ceiling (§1.1) stops a slow leak** — and a slow leak is by far the more likely bug in a scheduled engine.

**Caching is ours, not yours.** A given sector–geography pair resolves once and is served from our page thereafter. **We are not asking you to absorb per-visitor load.**

---

## 4 · 🟢 `demand_signal` — and where it actually lives

> **Corrected 2026-08-24.** v1 of this document put `demand_signal` in this contract alongside `fact_lookup`.
> **That was wrong, and the error was structural rather than cosmetic.**

`api-spec-v2` §1.8 draws a hard line: *"Analysis content never transits the Caspr product backend. Our
backend sees identifiers, status and money, never research content."*

**Read that against what `demand_signal` needs and it splits in two:**

| What it needs | Who holds it |
|---|---|
| Prompt text, and the ability to classify it by sector and type | **AI service** — `propose_layout` receives the prompt, including pre-signup |
| Aggregation, thresholding, consent filtering | **Product backend** — it owns the event stream |
| **`signup_rate` per cluster** | **Product backend only.** The AI service has no idea whether a session became an account |

> **So the AI service cannot build this endpoint, because the field that makes it worth having is data the
> AI service does not have.** Asking Jayant's team for `demand_signal` as originally written would have
> produced either a refusal or something without its most valuable column.

### 4.1 The correct split — and there is no AI-service ask in it

**Corrected 2026-08-25.** This was scoped as a small ask on Jayant's team. **It should not have been.
`demand_signal` is product-side end to end, and the argument that put any of it on the AI service was wrong.**

#### The argument that was wrong

The earlier text claimed the split meant *"no free text ever leaves"*, and that this was what made the privacy
design in §4.2 work. **It is not, and it never was.**

**`propose_layout` cannot propose sections for a market analysis without reading the prompt.** The text is
already inside the AI service either way. **The boundary that matters is product → GTM engine, and that
boundary sits downstream of the product** — whichever side derives the label, the engine receives only the
label. Moving classification across a team boundary bought nothing.

#### The product already holds everything else

Signup, abandonment and the analytics consent decision are all product-side. **`signup_rate` — the field this
endpoint exists for — is a join against `signup_completed`**, which the AI service has no view of.
**Classification was the single piece sitting on the far side of a team boundary, and there was no reason for
it to be there.**

#### What the product does instead

The app already fires `prompt_submitted` with the text. It derives the four-field label itself and attaches it
to that event:

| Field | How |
|---|---|
| **`sector`**, **`geography`** | A bounded classification over **fixed vocabularies** — GICS, ISO 3166-1. The product has the prompt. **A small model call or a rules-plus-embedding lookup, not a research problem** |
| **`analysis_type`**, **`depth`** | ⚠ **Read off the layout. Never re-derived** — below |

> **⚠ The one rule that matters here.** `propose_layout` has *already decided* type and depth — that is what
> proposing a layout is. **A second, independent classifier that disagrees with it would have `demand_signal`
> describing something other than what was actually run**, with `signup_rate` joined against the wrong label.
> **Read those two values from the layout the product already received; do not compute them twice.**

#### The only thing left to ask — and it may be nothing

**Does the `propose_layout` response already expose the analysis type and depth it settled on?**

**If yes, the AI service needs to do nothing at all.** If those values are currently internal to the call, then
exposing them is the entire ask — and it is *"return what you already computed"*, **not** *"classify for us."*

### 4.2 The privacy design — unchanged, and now easier to guarantee

Four constraints. They are the specification, not a caveat on it:

| | Constraint |
|---|---|
| **1** | **Closed vocabulary only.** GICS sector, ISO region, the five core Types, the three depths. **No free text ever leaves the product** — no prompt text, no verbatim phrasing, no extracted entities |
| **2** | **Counts only, above a threshold.** Suppress any cluster below `min_count` (default **10**). A cluster of one is one identifiable customer's confidential question |
| **3** | **Derived before it reaches the engine.** The product labels, the backend aggregates, **the engine receives buckets and never anything it could recover a prompt from.** *(Corrected 2026-08-25: this constraint used to be justified by classification happening inside the AI service. It does not depend on that and never did — the protection is that free text stops at the product boundary, not which side of that boundary computes the label)* |
| **4** | **Honour the analytics consent decision.** A user who declined is excluded from the aggregate, not merely unlabelled |

**Uploaded files, Data Room contents and report bodies are out of scope entirely.** This reads what people
*asked for*, never what they uploaded or received.

**Constraint 1 is structural because of where the engine sits, not because of who classifies:** the only
thing that ever crosses into the GTM engine is a four-field label drawn from fixed vocabularies, and the
engine has no route back to the text behind it.

### 4.3 The shape the engine consumes

```json
{
  "window": { "from": "2026-07-21", "to": "2026-08-20" },
  "min_count_applied": 10,
  "clusters": [
    { "sector": "25", "sector_label": "Consumer Discretionary", "geography": "GB",
      "analysis_type": "market_research", "depth": "study",
      "count": 34, "trend_vs_prior_window": 0.42, "signup_rate": 0.19 }
  ],
  "suppressed_clusters": 12,
  "suppressed_count_total": 41
}
```

**`signup_rate` is why this exists.** Share of sessions in that cluster reaching `signup_completed`.

> **High volume with a low signup rate is a demand the product is failing to convert** — and it is the best
> published-analysis candidate available, because it names a question people are asking that we are not yet
> answering well enough to be worth an account.

**Report the suppression.** `suppressed_clusters` and `suppressed_count_total` must be returned. A response
that silently drops small clusters reads as *"this is the whole demand picture"* when it is not, **and thin
tails are where new segments first appear.**

### 4.4 Sequencing, and where each half is tracked

| | Owner | Where it is specified | When |
|---|---|---|---|
| Deriving `classification` | **Caspr product backend** | **§4.1** — *(was Jayant's team until 2026-08-25; there is no AI-service ask left)* | With the app build |
| Aggregation, suppression, consent, `signup_rate` | **Caspr product backend** | **[`tracking-spec.md`](tracking-spec.md)** — add it there | Post-launch |

**Neither is on the launch critical path.** This endpoint has no data until the app is live and taking
prompts. The engine runs on external signal — search, community question flow, event flow — and re-weights
to this the moment volume exists (`content-approach.md` §5.2).

**Build the intake now, run it narrow.** Widening is a configuration change, not a build.


## 5 · Rules that bind the engine, stated here so they are enforceable

### 5.1 No customer data reaches published content. Ever

Every `trigger_generation` from the service principal:

```json
{ "include_user_files": false, "file_ids": [], "new_file_id": null }
```

**Reject the call if any of these is otherwise.** The service principal has no Data Room by construction (§1), so this is belt and braces — and it is worth both, because the failure mode is customer material appearing in public marketing.

`brand-guidelines.md` Pillar 5 states *"user-uploaded data is never used to train any model. Ever."* Publishing it would be worse.

### 5.2 Published analyses are Caspr's own work

`author` is `"Caspr Research"` (v2 §7 `cover.author`). No customer is named, quoted or identifiable in a published analysis, and no published analysis derives from a customer engagement.

### 5.3 Everything published is auditable back to its call

Per v2 §1.8, every state transition is already audited. The engine additionally records, for each published item: the `analysis_id` or `fact_lookup` response that produced each claim, the `commissioned_by` human, and the reviewer who approved it.

**This is the same standard the product sells.** *Cited, or it does not ship* has to be true of the marketing engine or it is not true of the company.

---

## 6 · What we need from Jayant

| | Ask |
|---|---|
| **1** | **The service principal** — §1. `principal_type`, enumerated scopes, no Data Room. This is the blocking item; nothing else can be integrated without it |
| **2** | **The server-side ceiling, in credits** — §1.1. **Changed from $500/month.** One ceiling across the whole principal; `403 gtm_budget_exhausted` on breach |
| **2a** | **A `metering` block on every response** — §1.2. `credits_charged`, `credits_remaining`, `cache_hit`. **Per query on batch, not per request** |
| **2b** | **Two numbers so we can size the ceiling:** the typical credit cost of **(a)** a Study and **(b)** one `fact_lookup` on a cache miss. **Estimates are fine** — they get replaced with actuals after month one |
| **3** | **`fact_lookup`** — §3. Confirm the three rules in §3.1 are implementable as stated, particularly **that `not_found` never escalates to generation**. **And confirm the §3.3 volume shape** — sustained 600/hour plus a seeding burst — is workable |
| **4** | **One question, and it may cost you nothing** — §4.1. **Does the `propose_layout` response already expose the analysis type and depth it settled on?** If it does, there is nothing to do. If they are internal, returning them is the whole of it. **The `classification` field asked for in the draft you may have seen is withdrawn** — that work is product-side, and `demand_signal` with it |
| **5** | **A view on `min_count`.** We propose 10. If your read on re-identification risk says higher, **take the higher number** — the engine degrades gracefully, and a suppressed cluster costs us a topic while a leaked one costs a customer |

**Not asked for:** any change to `retrieve_analysis`, `trigger_generation`, or anything else in v2. They work as specified.

---

*Document: `docs/gtm/gtm-api-contract.md` · Owner: Joy · 2026-08-20. Companion to `api-spec-v2.md`; that document governs. Derived from `content-approach.md` §5, `tracking-spec.md` Parts 3 and 6, and `api-spec-v2.md` §1, §3 and §7.*
