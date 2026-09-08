# Caspr — AI Integration API Specification (v2)

**For:** Jayant (CTO) and the backend team
**From:** Joy · **Date:** 2026-08-14
**Supersedes:** `api-spec-v1.md` (2026-08-11). v1 is retained as history; where the two differ, **this document wins**.
**Companion to:** `architecture-alignment-v4.md` (v4.1) — the architecture contract, which still governs division of work, security and deployment.

---

## 0. Status of this document

**Jayant chose Option A** (`jayant-open-inputs-answered.md` A1). That changes what this document *is*.

v1 was a proposal. **v2 is the contract.** Caspr publishes the interface; the AI service implements to it. Every 🟢 tool below has a running reference implementation and a conformance test. All-green against your service means drop-in compatible.

It also means the five open questions at the end of v1 are **no longer Jayant's to answer** — under Option A they are ours to decide, and §0.2 records the decisions.

### 0.1 What Jayant settled

| Item | Answer | Effect here |
|---|---|---|
| A1 | **Option A** | This document is normative, not proposed |
| A2 | HTTP **and** SSE both available | We choose per call — §1.1 |
| A3 | ✅ Verifies our JWTs via our JWKS | §1.2 firm; no parallel auth |
| A4 | Draft layout on a **separate stream** | §2.2 is now a real stream, not a push |
| A5 | Ask Caspr **streamed** | §9.1 promoted to FIRM |
| A6 | ✅ Structured data + layout, never a rendered image | §6.5 firm |
| A7 | ✅ Adopts the 429 contract | §1.5 firm |
| A8 | **EKS** | Product backend deploys as an EKS service |
| B3 | **500 concurrent analyses** | §1.6 — queue thresholds now derivable |

### 0.2 What we decided, because Option A makes them ours

Each of these was an open question to Jayant in v1 §10. **Flagged as decisions, not discoveries** — if any is wrong for your infrastructure, say so now and we version it rather than discovering it at integration.

| # | Decision | Why |
|---|---|---|
| D1 | **Streamable HTTP for request/response; SSE for bounded streams; WebSocket for the analysis lifecycle** | §1.1 |
| D2 | **No bearer token ever appears in a URL** — SSE is consumed via `fetch`+`ReadableStream` with an `Authorization` header; WebSocket authenticates on its first frame | §1.2. Tokens in query strings land in ALB, CloudFront and proxy access logs. This is the single cheapest SOC-2 mistake to avoid and the most expensive to retrofit |
| D3 | **Section content rides `section_complete`**; `retrieve_analysis` remains the authoritative refetch | §6.3. It is the difference between a reader that fills live over a 1–2 h Study and one that sits empty until the end |
| D4 | **`⟦anchor_id⟧` (U+27E6/U+27E7) is the anchor delimiter**, now firm | §6.2. Jayant did not object; centralised in one place client-side either way |
| D5 | **We render nothing server-side that the user can edit; you render the exports** | §9.3 |

---

## 1. Conventions

### 1.1 Transport — decided

Three channels, chosen by **lifetime**, not by preference:

| Channel | Carries | Why this one |
|---|---|---|
| **Streamable HTTP** (MCP) at `{AI_ORIGIN}/mcp` | `propose_layout` · `trigger_generation` · `retrieve_analysis` · `presigned_upload_url` · `propose_visuals` · `generate_output` | Request/response with a bounded answer |
| **SSE** at `{AI_ORIGIN}/stream/{name}` | `layout_stream` · `source_stream` · `ask_caspr` | Bounded streams that begin and end within one user action. One-directional; nothing to send back |
| **WebSocket** at `{REALTIME_ORIGIN}` | Generation events (§5) | The only channel that must survive the **entire analysis lifecycle** — a Study runs 1–2 hours and must resume across a reconnect, a tab sleep or a network change. Already your architecture (FastAPI → Redis → WS pods); we are not proposing to change it |

**Every origin is config-injected.** `{AI_ORIGIN}` and `{REALTIME_ORIGIN}` are environment variables on our side (`VITE_MCP_ENDPOINT`, `VITE_REALTIME_ORIGIN`); no host, port or path is compiled into the client. Re-pointing local → staging → production is a config change, never a code change.

### 1.2 Authentication

**Caspr is the identity provider.** Every request carries a short-lived (≤60 min) RS256 JWT issued by the Caspr backend. Jayant **verifies** it against our JWKS endpoint:

```
GET {AUTH_ORIGIN}/.well-known/jwks.json
```

Claims: `sub` (Caspr user id), `email`, `plan`, `iss`, `aud`, `iat`, `exp`. Jayant never mints tokens. **No endpoint is unauthenticated.**

**Per-channel mechanics — this is the part that bites if left to assumption:**

| Channel | How the JWT travels |
|---|---|
| MCP / HTTP | `Authorization: Bearer <jwt>` on every request, including the MCP `initialize` |
| SSE | `Authorization: Bearer <jwt>` header. **The endpoint must accept a normal `fetch` with a header** — do not require browser `EventSource` semantics, which cannot set headers |
| WebSocket | First frame after connect is `{ "type": "auth", "token": "<jwt>" }`. Server closes with **4401** if no valid auth frame arrives within **5 s**. No subprotocol hacks, no token in the URL |

**Never accept a token in a query string**, even as a fallback. If a client sends one, reject it — a permissive fallback is how the URL path becomes the real path.

**Token refresh mid-stream:** a Study outlives a 60-minute token. The client re-authenticates by sending a fresh `auth` frame on the open WebSocket; the server accepts it and resets expiry **without dropping the connection**. For SSE, the client reconnects with `Last-Event-ID` (§1.9).

### 1.3 Identifiers & time

- `analysis_id`, `section_id`, `file_id`, `anchor_id`, `version_id`, `output_id` — opaque strings, generated by whichever side owns the object. Case-sensitive, ≤128 chars, `[A-Za-z0-9_-]`.
- All timestamps are **ISO 8601 UTC** (`2026-08-14T09:30:00Z`).
- Money is **integer cents**, never floats. Product-side only; the AI service never prices anything.

### 1.4 Errors

Non-2xx responses use one envelope:

```json
{ "code": "analysis_not_found", "message": "No analysis with that id.", "details": null }
```

`code` is a stable machine-readable slug — the client branches on it and never parses `message`. `message` is for our logs, **not** shown to users verbatim.

### 1.5 Rate limiting — confirmed (A7)

```
HTTP 429
Retry-After: 30
```
```json
{ "reason": "ask_caspr_rate_limited", "retry_after_seconds": 30 }
```

`reason` ∈ `ask_caspr_rate_limited` · `analysis_concurrency_limit` · `account_flagged` · `global_capacity`.

The client renders a soft auto-recovering cooldown for `ask_caspr_rate_limited`, and a **queued state — never an error** — for `analysis_concurrency_limit`. Without the machine-readable body, every rate limit renders as the same generic failure, which is why this shape is load-bearing rather than cosmetic.

### 1.6 Capacity and queueing — new in v2

Jayant confirms **500 concurrent analyses** (B3). That fixes three things previously unset:

- **Queue, don't fail.** Above capacity, `trigger_generation` returns `202` with `status: "queued"` and a `queue_position`, not a 429. A 429 on a *paid, committed* action is a broken promise; the user has already been charged at the gate.
- **`queue_position` must be monotonically non-increasing** for a given analysis. It renders as a live position; a number that goes up reads as a bug (same rule as §4.1).
- **`global_capacity` 429s apply to `propose_layout` and `ask_caspr` only** — the free, pre-commit surfaces. Never to committed work.

### 1.7 What must never appear in a response

No model confidence scores, logits, token probabilities, internal model state, prompt text, or model/architecture identifiers. Strip metadata that could reveal model internals (`architecture-alignment-v4.md` §8).

**This is enforced, not requested.** The conformance suite asserts the absence of these keys at every level of every response body; a leak fails the run.

### 1.8 Audit and data handling — new in v2

Joy's instruction is to **build for SOC 2 from the start** rather than retrofit. Two obligations on this interface:

1. **Every state transition on an analysis is auditable** — `queued`, `started`, `generating`, `complete`, `failed`, plus every `generate_output`. Emit with `analysis_id`, `sub` (the acting user), and a UTC timestamp. We keep the product-side audit trail; you keep yours. Neither is reconstructable from the other alone.
2. **Analysis content never transits the Caspr product backend.** File bytes go browser → your S3 via presigned URL (§8); section content goes your service → browser. Our backend sees identifiers, status and money, never research content. This is what makes the product-side blast radius small, and it is already how the client is built.

### 1.9 Stream resumption

Every SSE stream emits standard `id:` fields. On reconnect the client sends `Last-Event-ID`; the server **replays from the next event**. If replay is impossible, the server sends `{"event":"stream_reset"}` and the client re-fetches state via `retrieve_analysis` rather than showing a gap.

A stream that cannot resume and does not say so is the one failure mode that produces a silently incomplete report.

---

## 2. 🟢 `propose_layout` — instant draft structure

Called the moment the user submits their first prompt. **Perceived latency matters more than completeness**: the client paints a skeleton on submit and populates on arrival. Return a first pass fast, then refine (§2.2).

### Request
```json
{
  "prompt": "The UK electric vehicle market.",
  "depth": "study",
  "client_knowledge": { "icp": "investor", "role": "Strategy Director" }
}
```

| Field | Type | Req | Notes |
|---|---|---|---|
| `prompt` | string | ✓ | Raw user text. |
| `depth` | `"brief" \| "study"` | ✓ | `intelligence` is Phase 2. |
| `client_knowledge` | object | — | Product-side context snapshot; free-form, may be `{}`. |

### Response
```json
{
  "analysis_id": "an_9f2c",
  "revision": 0,
  "sections": [
    { "id": "sec_1", "title": "Executive Summary", "estimated_pages": 2 },
    { "id": "sec_2", "title": "Market Overview and Size", "estimated_pages": 4 }
  ],
  "refinement_questions": [
    { "id": "q_1", "question": "Passenger EVs only, or include commercial fleets?" }
  ]
}
```

- `sections[].id` must be **stable for the life of the analysis** — the client keys UI off it and links executive-summary items to it later.
- `refinement_questions` — rendered as the numbered scope list. **5 is the design norm**; fewer is fine.
- `estimated_pages` — positive integer; drives the "~4p" hint.

### 2.2 🟢 `layout_stream` — live refinement (A4: separate stream)

SSE at `{AI_ORIGIN}/stream/layout?analysis_id=…`. Opened as soon as `propose_layout` returns and closed when the user commits at the gate.

```json
{ "event": "layout_revised", "data": { "analysis_id": "an_9f2c", "revision": 1, "sections": [ … ], "refinement_questions": [ … ] } }
{ "event": "layout_final",   "data": { "analysis_id": "an_9f2c", "revision": 3 } }
```

- **`revision` strictly increases.** The client replaces its layout when `revision` is higher than the one it holds and **ignores** anything lower or equal — so out-of-order delivery is safe.
- Sections not yet drafted may be **omitted**; the client renders the remainder as pending skeletons.
- `layout_final` tells the client to stop expecting revisions. Absent it, the client keeps the stream open until the gate, which is correct but wasteful.

---

## 3. 🟢 `trigger_generation` — commit

Fired by **Generate** at the gate. This is the only call that starts billable work.

### Request
```json
{
  "analysis_id": "an_9f2c",
  "prompt": "The UK electric vehicle market.",
  "depth": "study",
  "clarifications": [ { "question_id": "q_1", "answer": "Passenger EVs only." } ],
  "file_ids": ["file_a1b2"],
  "new_file_id": null,
  "include_user_files": false,
  "output_language": "en",
  "gate": { "style": "mbb", "output_prefs": { } },
  "client_knowledge": { "icp": "investor" },
  "idempotency_key": "gen_01J8Z…"
}
```

| Field | Type | Req | Notes |
|---|---|---|---|
| `clarifications` | array | ✓ | May be empty; unanswered questions are simply absent. |
| `file_ids` | string[] | ✓ | Previously uploaded files to include. |
| `new_file_id` | string \| null | ✓ | File uploaded for this analysis only. |
| `include_user_files` | boolean | ✓ | Include the user's whole Data Room. |
| `output_language` | string | ✓ | ISO 639-1. |
| `gate.style` | enum | ✓ | `mbb` · `big4` · `academic` · `pe` · `scholarly` · `enterprise` |
| `gate.output_prefs` | object | ✓ | 🟢 firm — §3.1. |
| `client_knowledge` | object | ✓ | Sent at generation start, per architecture §7.3. |
| `idempotency_key` | string | ✓ | **New in v2.** |

**`idempotency_key` is required.** A retried `trigger_generation` — a flaky network, a double-tap, a client retry — must return the *original* ack, not start a second analysis. The user has been charged once at the gate; charging compute twice for one commit is the most expensive bug this interface can have. Keys are unique per commit and retained ≥24 h.

### 3.1 🟢 `gate.output_prefs`

The gate is the **single pre-generation confirmation**: everything affecting cost or output is stated once and committed together (Figma `708:63`).

```json
{
  "output_formats": ["pdf", "pptx", "xlsx", "md"],
  "language": "en-GB",
  "style": "pe",
  "template_id": null,
  "data_sources": {
    "file_ids": ["file_a1b2", "file_c3d4"],
    "include_user_files": false,
    "premium_addons": [ { "id": "bloomberg_terminal", "price_cents": 2500 } ]
  }
}
```

| Field | Type | Req | Notes |
|---|---|---|---|
| `output_formats` | string[] | ✓ | Subset of `pdf` · `pptx` · `xlsx` · `md`. Included in the analysis price at launch. |
| `language` | string | ✓ | BCP-47 (`en-GB`), narrower than the top-level `output_language`. Prefer this one. |
| `style` | enum | ✓ | Mirrors `gate.style`; kept here so the confirmed config travels as one object. |
| `template_id` | string \| null | ✓ | Enterprise custom template. **Phase 2** — always `null` at launch. |
| `data_sources.file_ids` | string[] | ✓ | Files explicitly included via Gate-1 selection. |
| `data_sources.include_user_files` | boolean | ✓ | Include the whole Data Room. |
| `data_sources.premium_addons` | array | ✓ | Opt-in paid sources, each with the price shown **before** commit. Empty at launch unless offered. |

**Premium add-ons are the only line that changes the price at the gate.** The user sees `+$25` next to *Data & sources* before committing; that number must equal `sum(premium_addons[].price_cents)`.

**Depth (tier) is confirmed here too**, but travels as the top-level `depth` field.

### Response
```json
{ "analysis_id": "an_9f2c", "status": "started", "estimated_minutes": 90, "queue_position": null }
```

`status` ∈ `started` · `queued`. When `queued`, `queue_position` is a positive integer (§1.6). `estimated_minutes` drives expectation copy — Brief ≈ 15, Study ≈ 60–120.

---

## 4. 🟢 `source_stream` — the Theater

Drives the single most important visual in the product. The client has a **working consumer**, so these semantics are load-bearing. SSE at `{AI_ORIGIN}/stream/sources?analysis_id=…`.

### Events
```json
{ "event": "source_category_activated",  "data": { "category": "Government" } }
{ "event": "source_category_progress",   "data": { "category": "Government", "count": 3 } }
{ "event": "source_category_completed",  "data": { "category": "Government", "total": 7 } }
{ "event": "total_sources_reviewed",     "data": { "count": 1284512 } }
{ "event": "notable_source_found",       "data": { "name": "IMF World Economic Outlook", "category": "Government" } }
{ "event": "cross_reference_detected",   "data": { "category_a": "Government", "category_b": "Academic" } }
{ "event": "stream_complete",            "data": {} }
```

### 4.1 Rules the client depends on

1. **`total_sources_reviewed.count` is monotonically non-decreasing** and ends on the true total. It renders as a live counter; a decrease reads as a bug.
2. **`notable_source_found.name` is the display string.** The client matches it against the candidate shortlist; a match locks that node red, a non-match joins as an organically-found extra.
3. **Partial resolution is expected and correct.** Not every candidate resolves — sources that yield nothing simply never appear. **Do not pad the stream** to make everything resolve.
4. `cross_reference_detected` is accepted but **not yet visualised** (v2.1).
5. `stream_complete` ends the Learning phase.

---

## 5. 🟢 Generation events

After commit, generation runs asynchronously. Delivered over the WebSocket channel (§1.1), multiplexed by `analysis_id`.

```json
{ "event": "mode_change",       "data": { "analysis_id": "an_9f2c", "mode": "generating" } }
{ "event": "early_finding",     "data": { "stat": "31%", "label": "of EU charge points are in three countries", "section_id": "sec_2" } }
{ "event": "section_complete",  "data": { "analysis_id": "an_9f2c", "section": { /* §6.1, full object */ } } }
{ "event": "analysis_complete", "data": { "analysis_id": "an_9f2c", "version_id": "v1" } }
{ "event": "analysis_failed",   "data": { "analysis_id": "an_9f2c", "code": "generation_failed", "message": "…", "refundable": true } }
```

- **`mode_change`** switches the UI from Theater to the generating screen. Emit when Learning + Thinking are done and writing begins.
- **`early_finding`** — emit as sections finalise; the client controls display cadence. `stat` ≤12 chars so it can headline.
- **`section_complete`** now carries the **full section object** (decision D3, §6.3).
- **`analysis_failed`** is new in v2 and **required**. The client has a built failure screen (`1827:2` / `2002:2`) and a refund path; without this event a failed Study is indistinguishable from a slow one, and the user waits forever. `refundable` drives whether we return the wallet reservation automatically.

---

## 6. 🟢 Section content — the reading experience

### 6.1 Section object
```json
{
  "id": "sec_2",
  "index": 1,
  "title": "Market Overview and Size",
  "content": "The UK fleet reached 1.3m units⟦sec_2_a1⟧ in 2025, growing 21% year on year⟦sec_2_a2⟧.",
  "anchors": [
    {
      "anchor_id": "sec_2_a1",
      "explanation": "Derived by cross-referencing DfT vehicle licensing statistics with SMMT registrations to Q4 2025.",
      "sources": [
        { "name": "DfT Vehicle Licensing Statistics", "category": "Government", "url": "https://…" }
      ]
    }
  ],
  "chart_data": null
}
```

### 6.2 Red-dot citations — the critical mechanic

- Anchors are **inline trailing markers inside `content`**, immediately after the figure they cite.
- **Marker syntax: `⟦anchor_id⟧`** (U+27E6 / U+27E7). **Firm as of v2** (decision D4).
- **Every `anchor_id` in `content` must have a matching entry in `anchors`.** Unmatched markers are dropped by the client.
- **Every anchor carries its explanation and at least one source inline.** Clicking a red dot must require **zero round-trip** — a product commitment, not an optimisation.
- `sources[].url` is optional; `name` and `category` are required.
- **Escaping:** a literal `⟦` in prose must be sent as `⟦⟦`. Rare, but it is the kind of thing that surfaces once in production on a maths-heavy report.

### 6.3 Delivery — decided (D3)

**Section content rides `section_complete`.** The reader fills live across a 1–2 hour Study rather than sitting empty until the end, which is the difference between watching work happen and watching a spinner.

`retrieve_analysis` (§7) remains the **authoritative** source and must return the identical object. The client refetches on reconnect, on `stream_reset`, and whenever a section is opened that it has no content for. **Both paths must agree byte-for-byte** — the conformance suite asserts it.

### 6.4 Charts — raw data, not images

Caspr renders charts client-side so the user can switch type and we can export cleanly. Send data and a suggestion, never a rendered image.

```json
{
  "title": "Charge points by country",
  "suggested_type": "column",
  "fields": [
    { "key": "country", "label": "Country", "role": "dimension" },
    { "key": "points",  "label": "Charge points", "role": "measure" }
  ],
  "rows": [
    { "country": "Netherlands", "points": 152000 },
    { "country": "Germany",     "points": 120000 }
  ]
}
```

- `role` ∈ `dimension` · `measure`. Add `"temporal": true` on a time-axis dimension — the client uses it to allow line/area and to **forbid pie**.
- `suggested_type` ∈ `column` · `bar` · `line` · `area` · `pie` · `donut` · `treemap` · `grouped_bar` · `stacked_bar` · `multi_line` · `scatter` · `bubble` · `stat`.
- Row values: string · number · null. Keys must match `fields[].key`.

### 6.5 Executive summary
```json
{
  "insights":  [ { "text": "Charging capacity, not vehicle supply, is the binding constraint.", "section_id": "sec_3" } ],
  "questions": [ { "text": "What would change the conclusion on regulation?", "section_id": "sec_4" } ],
  "infographic": {
    "suggested_template": "headline-led",
    "blocks": [
      { "type": "headline_stat",   "value": "31%", "label": "of capacity in three countries", "emphasis": 1 },
      { "type": "supporting_stat", "value": "$4.2B", "label": "invested in 2025" },
      { "type": "takeaway",        "text": "Concentration is rising; the entry window is narrowing." }
    ]
  }
}
```

- **Every insight and question must carry a valid `section_id`.** The client hyperlinks the summary into the body; a dangling id breaks navigation.
- **Infographic is structured data, never an image URL** (A6 ✅). The client renders it into a branded template and lets the user restyle it. Block types: `headline_stat` · `supporting_stat` · `takeaway` · `mini_chart` (`chart_ref`).

---

## 7. 🟢 `retrieve_analysis`

### Request
```json
{ "analysis_id": "an_9f2c", "version_id": null }
```

`version_id` is new in v2 and optional — `null` means current. Versions are created by regeneration (§9.2/§9.3) and the reader pins outputs to them.

### Response
```json
{
  "analysis_id": "an_9f2c",
  "title": "UK EV market",
  "depth": "study",
  "style": "mbb",
  "status": "complete",
  "version_id": "v1",
  "created_at": "2026-08-14T09:30:00Z",
  "sections": [ /* §6.1 */ ],
  "exec_summary": { /* §6.5 */ },
  "cover": {
    "title": "UK EV market",
    "date": "2026-08-14T09:30:00Z",
    "author": "Caspr Research",
    "analysis_type": "Study",
    "style": "mbb"
  }
}
```

`status` ∈ `draft` · `layout_ready` · `queued` · `generating` · `complete` · `failed`. Sections arrive in `index` order.

---

## 8. 🟢 `presigned_upload_url`

Browser uploads go **directly to your S3** — file bytes never transit Caspr's product backend (§1.8).

### Request
```json
{ "filename": "data-room.pdf", "content_type": "application/pdf", "size_bytes": 2482301 }
```

### Response
```json
{
  "file_id": "file_a1b2",
  "upload_url": "https://…s3…?X-Amz-Signature=…",
  "expires_at": "2026-08-14T09:45:00Z"
}
```

Expiry ≈ 15 minutes. Client constraints already enforced: **max 25 MB**, types PDF · DOC/DOCX · XLS/XLSX · CSV · TXT. **Validate them server-side too** — a client-side limit is a UX affordance, not a control.

---

## 9. 🟢 Promoted from provisional — the screens are now built

v1 §9 marked these provisional *because the screens that consume them did not exist*. **All three are now built and measured**, so the shapes below are extracted from running code exactly as §2–8 were. They are FIRM.

### 9.1 🟢 `ask_caspr` — streamed (A5)

SSE at `{AI_ORIGIN}/stream/ask`. Shape from `features/reader/AskCasprPane.tsx` (`AskExchange`).

**Request**
```json
{
  "analysis_id": "an_9f2c",
  "question": "How exposed is this to the 2027 subsidy cliff?",
  "scope": { "section_id": "sec_3", "anchor_id": null },
  "version_id": "v1"
}
```

`scope` is the one field that does double duty: `null` for a free-form question in the Ask pane, populated when the question was raised **from** a red dot or a selected section. Same tool either way — a separate scoped tool would be two implementations of one behaviour.

**Stream**
```json
{ "event": "ask_reply",       "data": { "exchange_id": "ex_1", "reply": "Materially — three ways." } }
{ "event": "ask_quote",       "data": { "exchange_id": "ex_1", "quote": "1.3m units in 2025", "section_id": "sec_2" } }
{ "event": "ask_answer_delta","data": { "exchange_id": "ex_1", "text": "The subsidy taper lands in " } }
{ "event": "ask_suggestions", "data": { "exchange_id": "ex_1", "suggestions": ["Model the 2027 cliff", "Compare to Germany"] } }
{ "event": "ask_complete",    "data": { "exchange_id": "ex_1" } }
```

The four-part shape is not arbitrary — it is what the built pane renders, in order:

| Event | Renders as |
|---|---|
| `ask_reply` | Caspr's one-line framing under the question |
| `ask_quote` | The figure quoted back, so the answer is visibly anchored to the report |
| `ask_answer_delta` | The answer body, streamed token-wise |
| `ask_suggestions` | Offered follow-ups, 0–3 |

`ask_reply` and `ask_quote` are optional; `ask_answer_delta` and `ask_complete` are required. **This is the surface your per-user rate limiting targets** — see §1.5.

### 9.2 🟢 `propose_visuals`

MCP/HTTP. Shape from `features/reader/EditChartPane.tsx` (`ChartProposal`, `INTENTS`).

The Edit pane's premise: Caspr proposes **2–3 alternatives built from the section's own data**, each with a one-line rationale. The user steers by **what the chart is for**, not by what it is called.

**Request**
```json
{
  "analysis_id": "an_9f2c",
  "section_id": "sec_2",
  "target": "chart",
  "intent": "Composition",
  "ask": null
}
```

| Field | Type | Req | Notes |
|---|---|---|---|
| `target` | enum | ✓ | `chart` · `visual` · `cover` · `infographic` |
| `intent` | enum \| null | ✓ | `Compare` · `Trend` · `Composition` · `Relationship` · `Geography` · `Flow` |
| `ask` | string \| null | ✓ | Free-form steer — the pane's `OR JUST ASK`. Mutually exclusive with `intent`; if both arrive, `ask` wins |

**Response**
```json
{
  "proposals": [
    { "kind": "stacked-bar",      "title": "Stacked bar",      "rationale": "Composition and total, in one read.",
      "chart_data": { /* §6.4 */ } },
    { "kind": "small-multiples",  "title": "Small multiples",  "rationale": "Compare each region's own trajectory.",
      "chart_data": { /* §6.4 */ } },
    { "kind": "hundred-stacked",  "title": "100% stacked",     "rationale": "Share shift over time, not absolute size.",
      "chart_data": { /* §6.4 */ } }
  ]
}
```

- **2–3 proposals.** More does not help; the pane shows three.
- **`rationale` is one sentence and user-facing.** It is the entire justification the user sees, so it must read like an analyst, not like a tooltip: *"Share shift over time, not absolute size."*
- **Every proposal carries complete `chart_data`** built from the section's real data. The client renders the preview locally with **no further round-trip** — same commitment as the red dot.

### 9.3 🟢 `generate_output` — decision D5

MCP/HTTP. Shape from `features/reader/GenerateOutputPane.tsx` (`QueuedOutput`) and `OutputsPane.tsx` (`FeedItem`).

**Who renders what:** the user edits charts and infographics in the browser, so the client holds the authoritative visual state. **We send it; you render the file.** Any other split means the export silently differs from what the user approved — which is the one defect a boardroom document cannot have.

**Request**
```json
{
  "analysis_id": "an_9f2c",
  "version_id": "v3",
  "outputs": [
    { "id": "pptx-fr", "format": "pptx", "language": "fr-FR" },
    { "id": "pdf-fr",  "format": "pdf",  "language": "fr-FR" }
  ],
  "overrides": { "sec_2": { "chart_data": { /* §6.4 — the user's edited chart */ } } },
  "idempotency_key": "out_01J8Z…"
}
```

**Response**
```json
{ "job_id": "job_7a1", "outputs": [ { "id": "pptx-fr", "status": "queued" } ] }
```

Completion arrives on the WebSocket channel:
```json
{ "event": "output_ready",  "data": { "job_id": "job_7a1", "id": "pptx-fr", "filename": "uk-ev-market-v3.pptx", "url": "https://…", "expires_at": "…" } }
{ "event": "output_failed", "data": { "job_id": "job_7a1", "id": "pptx-fr", "code": "render_failed", "refundable": true } }
```

- **Outputs are version-pinned.** `version_id` is required; an output always states which version it came from, and restoring an old version does not invalidate its outputs.
- **Pricing is entirely ours.** The `price_cents` on the built pane is product-side metering against the wallet. **The AI service never prices, meters or refuses on cost** — it renders what it is asked for, and we decide whether the user may ask.
- `url` is a short-lived signed URL, not a permanent address.

---

## 10. Phase 2 — explicitly not in v2

Intelligence depth · The Signal (`signal_blocks` + `provenance`) · What Changed / Updates · enterprise custom templates · infographic regenerate · output watermarking.

**The Signal is wired but dormant** (Joy, 2026-08-12): the client renders it only when the API sends it. Send nothing and nothing is created; the moment `signal_blocks` appears on a section, the section renders. No client change needed to turn it on.

---

## 11. The reference implementation — **built**

Caspr publishes a running implementation of every 🟢 tool above. This is the Option A deliverable, and it exists: `services/reference-ai` in the product repo.

- **Same transports.** MCP JSON-RPC over HTTP at `/mcp`, SSE at `/stream/{sources,layout,ask}`, WebSocket at `/realtime`.
- **Same auth.** It verifies Caspr JWTs against the live JWKS endpoint and holds no signing key of its own — a full compromise of it yields no ability to impersonate anyone.
- **Modelled latency**, selected by `LATENCY_PROFILE`:

  | Profile | Behaviour |
  |---|---|
  | `real` | The spec's own numbers — `propose_layout` ~2 s, a Brief ~15 min, a Study 60–120 |
  | `compressed` *(default)* | The same **proportions** ~600× faster, so a Study still takes four times a Brief and ordering bugs still surface, in seconds rather than hours |
  | `zero` | Unit tests only |

- **Injectable failure**, armed per request with `x-caspr-fault` and **refused entirely unless the service is started with `ALLOW_FAULTS=true`** — a header must never be able to break a real analysis on a shared environment.

  `timeout` · `rate_limited` · `analysis_failed` · `stream_drop` · `stream_reset` · `render_failed` · `upload_expired` · `queued` · `server_error`

  Every designed error state in the client is now reachable by the code path that produces it, rather than only by typing its URL.

- **Every origin is config-injected.** `PORT`, `AUTH_ORIGIN`, `CORS_ORIGIN`, `LATENCY_PROFILE`, `ALLOW_FAULTS`. No host, port or path is compiled in.

Run it:

```
PORT=8788 AUTH_ORIGIN=http://localhost:8787 ALLOW_FAULTS=true npm start --workspace @caspr/reference-ai
```

It is not a scaffold we discard at integration. It stays as the conformance oracle.

## 12. The conformance suite — **built**

21 checks, one command, per-field pass/fail, runnable against **any** origin:

```
CONFORMANCE_TOKEN=<a Caspr JWT> npm run conformance -- --origin https://ai-staging.example --faults
```

`--faults` is opt-in: a target that does not implement fault injection **skips** those checks rather than failing them. `--content-timeout` (default 90 s) bounds how long the content checks wait for a generation to finish.

What it asserts, by clause: tool catalogue (§1.1) · auth required and **no query-string token** (§1.2, D2) · ownership isolation (§1.2) · error envelope with a machine-readable code (§1.4) · the 429 envelope with `Retry-After` (§1.5) · no model internals at any depth (§1.7) · stream resumption via `Last-Event-ID` (§1.9) · layout shape and stable section ids (§2) · ack shape and **idempotency** (§3) · SSE framing with ascending ids and the monotonic counter (§4, §4.1) · anchor/marker integrity and inline evidence (§6.2) · summary links resolve (§6.5) · `retrieve_analysis` shape and status enum (§7) · server-side upload limits (§8) · Ask streams in deltas (§9.1) · 2–3 visual proposals carrying complete chart data (§9.2).

**Two properties worth knowing about:**

1. **The suite shares no code with the reference implementation.** Its client is written against this document alone. A suite built out of the thing it tests proves only that the implementation agrees with itself — so an all-green run here means two independent readings of the contract produced the same behaviour.
2. **Green and complete are different claims.** A skipped check verified nothing, so a run with any skip reports `GREEN, BUT INCOMPLETE` and names what did not run. A suite that can skip its way to a pass is one people stop running.

A green run against the reference implementation is part of our own test suite, so the suite cannot rot silently.

**Current status:** 21 passed, 0 failed, 0 skipped against the reference implementation.

---

## 13. What we still need from Jayant

Down from seven to three. Everything else Option A moved to our side.

1. **`{AI_ORIGIN}` and `{REALTIME_ORIGIN}` for staging** — plus the written confirmation from B1 that staging holds **no real customer data**. That second half is still outstanding and our security tooling refuses to run without it.
2. **Confirmation of the §0.2 decisions** — five calls we made because Option A made them ours. Silence is acceptance, but a wrong one is cheaper to fix now than at integration. **D2 (no tokens in URLs) is the one to check**, because it constrains how your SSE and WebSocket endpoints accept credentials.
3. **A signed pentest authorisation in-window** (B2). "Y" in a document is not the signature our tooling checks for; it needs `docs/security/pentest-authorization-request.md` executed and dated.

---

*Document: `api-spec-v2.md` · Owner: Joy · 2026-08-14. Payloads extracted from the Caspr client's `@caspr/contract` package and the built reader panes, which a working front-end already consumes. Supersedes `api-spec-v1.md`.*
