# Caspr App — Architecture Alignment & Integration Contract (v4)

> **▶ Front-end/build session:** start at [`DEV-HANDOVER.md`](DEV-HANDOVER.md). This document is the **integration contract** it references for anything backend, auth, payments, or Jayant-facing.

**For:** Jayant (CTO)
**From:** Joy
**Date:** 2026-07-30
**Status:** Current source of truth. Supersedes `architecture-alignment-final.md` (v3, Vercel+Supabase) and `architecture-alignment-aws.md` (AWS variant).
**Deployment:** AWS-native throughout.

**Purpose:** Defines the product architecture, the division of work, the integration contract, and the security requirements — updated for every decision taken in the 2026-07-30 alignment. Joy's team builds the entire product (front-end **and** the product-side backend) against mocks now; Jayant's endpoints/MCP tools swap in as they land.

---

## Addendum — 2026-08-10 (v4.1)

Refinements taken since 2026-07-30. **None change Jayant's integration contract (§7) — all are product-side.** Send-safe; no new action required from Jayant beyond the existing §11 open items.

| Area | v4 | v4.1 |
|---|---|---|
| Payments | "Stripe, full integration" (implied Stripe.js forms) | **Hosted "Model B"** — Stripe **Checkout** (card entry) + **Customer Portal** (card/invoice mgmt) + **Stripe Tax**. Caspr owns only amount selection + wallet ledger. No card fields in our UI. §5, §7.9 updated. |
| Entity / payout | — | **Caspr Holding Pte Ltd** (Singapore), **USD**, payout to a **SG-domiciled USD checking account**. |
| Phone / OTP | not covered | **Phone verification ON at launch**; **SMS/OTP via AWS SNS**; Caspr owns the OTP logic (SNS only transmits); anti-pumping guards; TOTP remains primary 2FA. §5, §9 updated. |
| Notifications / mobile nav | not covered | Pure front-end (toasts + bell; mobile nav = Analyses·Documents·Wallet·More; Insights → More). **No contract impact.** Spec: `notifications-spec.md`. Alerts/Notification-Center screen = Phase 2. |

---

## Change log — what's new in v4 (vs v3)

| Area | v3 | v4 |
|---|---|---|
| Auth / identity | Clerk (third-party) | **Product-side. We are the identity provider — we issue the JWT; Jayant verifies it.** No Clerk. |
| User management + client knowledge layer | Split | **Entirely product-side.** Client knowledge layer is sent to Jayant at generation start (with gate info). |
| Product backend | None (static SPA only) | **New product-side backend service** (auth, user mgmt, client knowledge, wallet, Stripe webhook, orchestration). |
| Data layer | New Supabase / RDS | **Reuse Jayant's existing AWS RDS PostgreSQL** (our tables + RLS). |
| File storage | New / Jayant's | **Reuse Jayant's existing S3** via presigned URLs. |
| Backend trigger | REST `POST /analyses` | **MCP interface, integrated directly from the SPA.** |
| Draft layout | End of source-stream | **Fast async endpoint** returning draft layout + refinement questions up front; refines live while the user answers. |
| Stripe webhook | Jayant | **Product-side** (we own the wallet + backend now). |
| Charts | `chart_data` opaque | **Raw data + chart-type string;** frontend renders + offers valid alternative types; edits version-pinned. |
| Infographic | `infographic_url` (image) | **Structured data + layout;** frontend renders into a branded template; versions saved + revertible. |
| Red dot / Ask Caspr | Two-call design | **Inline trailing marker + inline explanation** (zero round-trip on click). Free-form follow-ups hit the Ask Caspr tool. |
| The Signal, What Changed, Intelligence, enterprise templates, per-user envelope encryption | Phase 1 | **Phase 2** (coming-soon placeholders). |
| Launch scope | All depths | **Brief + Study only.** |

---

## 1. The Approach

Joy's team builds the entire product surface: the React SPA **and** a product-side backend service that owns everything non-AI — authentication and user management, the client knowledge layer, the wallet and Stripe, the non-sensitive data layer, and the orchestration that calls Jayant's AI. This frees Jayant's team to focus exclusively on the proprietary AI pipeline — the Learning Brain, the Thinking Brain, generation — plus analysis/file storage and model security.

The two sides meet at a minimal, versioned integration surface (§7). We build against mocks immediately and swap in Jayant's real tools/endpoints as they complete. No blocking dependency in either direction.

**Config discipline (hard rule):** No hardcoded domains or absolute roots anywhere. API base URLs, the MCP endpoint, JWKS URL, storage origins, Stripe keys — all injected via environment/config. Re-pointing from local → `new.caspr.ai` → `caspr.ai` is a config change, never a code change.

---

## 2. Security Principles

1. **Sensitive data never leaves Caspr's infrastructure.** Analysis content and uploaded files live only in Jayant's DB/storage. Never in the product-side data layer, never in a third party.
2. **The proprietary models are the crown jewels.** The architecture must make extraction, replication, or theft practically infeasible — technical controls + operational discipline, not just legal protection.
3. **Every request is authenticated. No public unauthenticated endpoints.** Short-lived JWTs; refresh rotation; no long-lived credentials.
4. **Third parties hold only non-sensitive data.** Stripe holds payment tokens. Nothing else external holds anything a user would consider confidential.
5. **Minimal surface.** The integration exposes only high-level business operations. Nothing reveals model architecture, weights, or training data.

---

## 3. Division of Work

### Joy's team owns

| Area | Approach |
|---|---|
| All product UI/UX | React + Vite, TypeScript, Tailwind v4 |
| **Authentication (identity provider)** | Product-side auth service: email/password, OAuth, JWT issuance + refresh, sessions. **We issue; Jayant verifies.** |
| **User management** | User records, profiles, onboarding, plan, preferences — product-side RDS |
| **Client knowledge layer** | The "get-to-know-you" context; built progressively in-app; **sent to Jayant at generation start with gate info** |
| Payments & wallet | Stripe integration + Research Budget wallet + **Stripe webhook** (product-side) |
| Non-sensitive data layer | Jayant's existing AWS RDS PostgreSQL — our tables, RLS |
| File upload UI | Direct browser → Jayant's S3 via presigned URLs |
| Theater / source visualisation | React consuming Jayant's source/theater stream (MCP) |
| Report reader | Streaming sections, inline red dots, charts, infographics, versions |
| Real-time generation UI | WebSocket client consuming section/analysis-complete events |
| Frontend hosting | AWS S3 + CloudFront (static SPA) |
| Product backend hosting | Same AWS account (EKS service or API Gateway + Lambda — TBD with Jayant) |

### Jayant's team owns

| Area | Notes |
|---|---|
| Learning Brain | Source identification; source/theater event stream |
| Thinking Brain | Analysis, reasoning, projections |
| Report generation | Section streaming; all AI output; charts (raw data + type); structured infographic data |
| Executive summary | After all sections; includes `section_id` references |
| Analysis content storage | Sections, summaries — Jayant's DB only, never product RDS |
| Uploaded file storage | Jayant's S3, KMS/AES-256 encrypted; presigned URL generation |
| **JWT verification** | Verify the **product-issued** JWT on every request (via our JWKS endpoint) |
| MCP interface | Trigger, async layout, source/theater stream, section events, Ask Caspr, retrieve, presigned-upload |
| Draft-layout async endpoint | Returns draft layout + refinement questions fast; refines live |
| Per-user rate limiting | At the API/MCP gateway; standard 429 contract (§7.8) |
| Secure model deployment | §8 |
| Audit log generation | Every analysis access, file upload, share event |

---

## 4. Data Classification

| Data | Sensitivity | Store |
|---|---|---|
| User identity, credentials, sessions | — | **Product-side auth service** |
| User profile, ICP, onboarding, plan | Low | Product RDS |
| Folders, analysis titles, timestamps, status | Low | Product RDS |
| Collaboration permissions, annotations | Medium | Product RDS |
| Wallet balance, transactions | Medium | Product RDS |
| Client knowledge layer answers | Medium | Product RDS (sent to Jayant at generation start) |
| Payment methods, invoices | Medium | Stripe (tokenised) |
| **Analysis content (sections, summary)** | **High** | **Jayant's DB only** |
| **Uploaded files** | **Very High** | **Jayant's S3 (KMS/AES-256) only** |
| **Model weights, architecture, training data** | **Critical** | **Jayant's isolated infrastructure only** |

---

## 5. Service Stack (AWS-native)

- **Frontend:** S3 (private) + CloudFront (OAC, TLS 1.3, HTTP/2). Vite build → `s3 sync` → CloudFront invalidation.
- **Product backend:** Auth + user management + client knowledge + wallet + Stripe webhook + Jayant-orchestration. Runs in Jayant's AWS account (EKS service or API Gateway+Lambda — deployment target TBD). Holds OAuth client secrets and the JWT signing key; exposes a **JWKS endpoint** Jayant uses to verify tokens.
- **Data layer:** Jayant's existing RDS PostgreSQL, private subnet, our tables with native RLS for per-user isolation.
- **File storage:** Jayant's existing S3, presigned uploads, KMS/AES-256.
- **AI interface:** Jayant's **MCP** interface, integrated directly from the SPA (transport/URL/tool schemas — §11).
- **Real-time (generation phase):** WebSocket service on EKS + ElastiCache Redis. FastAPI publishes `section_complete` / `analysis_complete` → WebSocket pods fan out to clients. JWT required at handshake.
- **Payments — Stripe, hosted model ("Model B"):** Caspr owns **only** amount/top-up selection + the wallet ledger. **Stripe Checkout** owns card entry, **Stripe Customer Portal** owns card/invoice management, **Stripe Tax** owns all tax (we never compute or display tax), Stripe owns SCA + receipts. Card data never touches Caspr servers (no Stripe.js/Elements forms in our SPA). USD only. Entity **Caspr Holding Pte Ltd** (Singapore); payout to a **Singapore-domiciled USD checking account**. Webhook handled product-side (§7.9).
- **SMS / OTP — AWS SNS:** phone verification and OTP delivery use **AWS SNS** (AWS-native, matches the stack). **Caspr's auth service owns the OTP logic** (generate / store / expire / rate-limit / verify); SNS only transmits the SMS. **Anti-SMS-pumping guards required** (per-IP + per-user rate limits, country allow-list, bot protection). Authenticator-app **TOTP** stays the primary 2FA (free, in our backend).
- **Auth providers at launch:** email/password + **Google, Outlook and LinkedIn OAuth — all three live from day one** (Joy, 2026-08-11; supersedes "Google only, others to follow"), **plus phone number verification (OTP via SNS)**. Google and Outlook run PKCE from the SPA; **LinkedIn requires a server-side secret exchange**, so the product backend carries a LinkedIn code-exchange path alongside the shared session-mint endpoint. All product-side — no impact on Jayant's §7 contract.

---

## 6. The End-to-End Generate Flow

This is the canonical sequence. It drives the contract in §7.

1. **Prompt → instant draft.** User enters the first prompt. Jayant's **async layout endpoint** returns a draft layout (table of contents) + refinement questions. UX target: *feels instant* — we paint a skeleton on submit and populate on arrival.
2. **Live refinement.** While the user answers the refinement questions — and after — the layout keeps updating from background Learning Brain work (streamed layout updates).
3. **Generate → Theater.** On "Generate," the trigger call is sent to Jayant (MCP), carrying prompt + clarifications + **client knowledge layer + gate information**. The Theater plays: 25M+ live sources; expected nodes connect to the centre red dot but stay grey; as sources are found, spokes/stars turn red. Choreographed to run a **3–5s minimum**; if the real work runs longer, the Theater continues while the get-to-know-you drawer appears.
4. **Mode change → generating screen.** When Learning + Thinking Brain work completes, Jayant emits a **mode-change event** ("entering generation"); the app switches to the generating screen.
5. **Early findings.** As sections finalise, Jayant pushes early findings; the frontend surfaces them as engagement cards at a cadence we control.
6. **Section streaming.** Sections stream to the reader via the real-time layer. Each section carries **inline red-dot markers + their explanations** (no click round-trip). Charts arrive as raw data + type.
7. **Complete.** Executive summary (with `section_id` links) + structured infographic data. Report is retrievable via the retrieve tool.

*(Number reconcile for marketing: public copy says "25M+ curated sources"; the Theater says "25M+ live." Align the two figures before launch.)*

---

## 7. Integration Contract

### 7.1 Identity & JWT

- **We are the identity provider.** The product auth service issues short-lived JWTs (≤60 min) with refresh rotation.
- **Jayant verifies** every request's JWT against our **JWKS endpoint** (`{AUTH_ORIGIN}/.well-known/jwks.json`). No token minting on Jayant's side.
- WebSocket handshake and MCP session init both require a valid JWT.
- *Confirm:* Jayant accepts verifying product-issued JWTs via JWKS (drops any parallel auth for this app).

### 7.2 MCP interface (Jayant → consumed directly by SPA)

Integrated directly from the SPA. **Needed from Jayant (§11):** transport (Streamable HTTP or SSE), endpoint URL, full tool catalog with input/output schemas, and how the JWT is passed at session init. Expected tools:

| Tool | Purpose |
|---|---|
| `propose_layout` (async) | Prompt → draft layout + refinement questions; live updates (flow step 1–2) |
| `trigger_generation` | Start analysis with the full payload in §7.3 (flow step 3) |
| `source_stream` / theater | Source category + node events driving the Theater (flow step 3) |
| `ask_caspr` | Free-form follow-up Q&A (streamed); target of per-user rate limiting |
| `retrieve_analysis` | Fetch a completed analysis |
| `presigned_upload_url` | Short-lived presigned S3 URL for a browser upload |

### 7.3 Generation trigger payload

Sent on "Generate." Extends v3's Endpoint 1 with the client knowledge layer + gate.

```
{
  "prompt":            string,
  "depth":             "brief" | "study",          // intelligence = Phase 2
  "clarifications":    [ { "question_id": string, "answer": string } ],
  "file_ids":          string[],
  "new_file_id":       string | null,
  "include_user_files": boolean,
  "output_language":   string,                       // ISO 639-1
  "gate": {                                           // gate information (style/approval selections)
    "style":           "mbb" | "big4" | "academic" | "pe" | "scholarly" | "enterprise",
    "output_prefs":    object
  },
  "client_knowledge":  object                         // product-side context layer snapshot
}
```

### 7.4 Real-time generation events (WebSocket)

FastAPI → ElastiCache Redis → WebSocket pods → SPA. Used because Study can run 1–2h (Intelligence, later, up to 24h) — holding a stream open is not viable at scale.

| Event | Payload |
|---|---|
| `mode_change` | `{ analysis_id, mode: "generating" }` (flow step 4) |
| `early_finding` | `{ stat, label, section_id }` (flow step 5; frontend controls display cadence) |
| `section_complete` | `{ analysis_id, section_id, title }` |
| `analysis_complete` | `{ analysis_id }` |

Section content (with inline red-dot markers, charts) is delivered on `section_complete` or fetched via `retrieve_analysis`.

### 7.5 Charts

Jayant sends **raw data + chart-type string**. Frontend renders (**ECharts**), infers data shape, and offers only valid alternative chart types with a switcher. Edits are frontend-only, saved **version-pinned** to product RDS, and drive PDF/PPTX export. No callback to Jayant to re-render.

Chart-type options by data shape: 1 cat + 1 measure → column/bar/pie/donut/treemap · time/ordered → line/area/column · multi-series → grouped/stacked bar, multi-line · part-to-whole → pie/donut/stacked bar/treemap · ranking → horizontal bar · 2 measures → scatter/bubble · single value → stat tile. (Histogram, box, map = Phase 2.)

### 7.6 Infographics

Jayant sends **structured data + layout** ("location and data") — the blocks (headline stat, supporting figures, mini-charts, takeaway) and their placement — **not a rendered image** (replaces v3 `infographic_url`). Frontend renders into a branded, export-clean template.

- **Recreate = Restyle at launch:** same data, alternate branded template/layout. Instant, free, frontend-only.
- Every render is saved as a **version in a dropdown**; user reverts anytime; the selected version exports.
- **Regenerate** (new content selection via a Jayant endpoint, possible wallet cost) = Phase 2 fast-follow.
- *Confirm:* Jayant emits structured infographic data, not a baked image.

### 7.7 Red dot / Ask Caspr

- Anchors are **inline trailing markers** in the section content (`anchor_id` inline).
- The explanation (sources + derivation) is **delivered inline with the section** → clicking a red dot reveals already-present content, **zero round-trip**.
- **Free-form follow-ups** go to the `ask_caspr` tool (streamed). Shape TBD from Jayant (§11).

### 7.8 Standard error / rate-limit contract

Every rate-limited response: **HTTP 429** + `Retry-After` header + a machine-readable body `{ "reason": string, "retry_after_seconds": number }`. Lets the frontend branch UX per surface — soft cooldown on Ask Caspr, queued-state on analyses. *Confirm Jayant adopts this shape.*

### 7.9 Stripe (product-side)

We own the full integration **and** the webhook. **Hosted model (Model B):** the SPA creates a Checkout Session server-side and redirects to Stripe-hosted Checkout; card/invoice management is the Stripe **Customer Portal**. No card fields in our UI.
```
POST {BACKEND_ORIGIN}/webhooks/stripe   (product backend)
  checkout.session.completed    → credit wallet.balance / activate top-up (RDS)
  invoice.paid                  → update wallet.balance (RDS)
  customer.subscription.updated → update users.plan (RDS)
  customer.subscription.deleted → downgrade users.plan (RDS)
```
Removed from Jayant's surface entirely. **No Jayant-facing contract change** — payments are wholly product-side.

---

## 8. Model Security (unchanged intent, AWS-native)

- Only the API/MCP gateway (ALB in front of EKS) is internet-facing. Model serving (isolated EKS GPU node group) and weight storage (private S3 + KMS CMK) have no public IP.
- Model weights encrypted at rest (KMS CMK); IAM role for serving nodes only — not FastAPI pods or app code; CloudTrail + S3 access logging on the weight bucket; AWS Secrets Manager (zero hardcoded credentials); EKS network policies.
- **Extraction defence:** per-user rate limiting (Research Budget is the natural limiter for analyses; per-IP via WAF; per-account anomaly flags), never return logits/confidence/internal state, strip revealing metadata. Output watermarking = Phase 2.
- **Pre-production checklist** (Jayant): serving node group no public IP; weight bucket private + KMS CMK; Secrets Manager; WAF rate limiting; CloudTrail + audit logging; JWT verification deployed; TLS 1.3 at ALB + CloudFront; dependency audit; **penetration test before go-live** (§10).

---

## 9. Launch Scope

**Phase 1 (launch):** Brief + Study · full auth + user management + OAuth (Google) + **phone verification (OTP via AWS SNS)** · client knowledge layer · Research Budget wallet + **Stripe hosted (Model B)** · file upload · Theater + generate flow · report reader with inline red dots · charts · structured infographics (Restyle) · Ask Caspr · real-time generation · KMS/AES-256 at rest · US + EU (Frankfurt) residency.

**Phase 2 (coming-soon placeholders in UI):** Intelligence depth · The Signal (`signal_blocks` + `provenance`) · What Changed (placeholder in selector bar) · enterprise custom templates · per-user envelope encryption · infographic Regenerate · output watermarking. *(Outlook + LinkedIn OAuth moved to Phase 1 — all three providers ship at launch, Joy 2026-08-11.)*

---

## 10. Capacity

**Load-test target / guardrail: 500 concurrent analyses** (Jayant's stated ceiling). Drives free-trial limits, queue UX, and signup throttling. **Third-party penetration test scheduled before go-live** (ahead of the single-shot cutover), against the live `new.caspr.ai` deployment, alongside load testing.

---

## 11. Open Items for Jayant

1. **JWT verification:** confirm acceptance of verifying product-issued JWTs via our JWKS endpoint.
2. **MCP:** transport (Streamable HTTP / SSE), endpoint URL, full tool catalog + input/output schemas, and JWT-at-init mechanism.
3. **Async layout:** delivery channel for the draft layout + live updates — streamed result of `propose_layout`, or a separate stream/push?
4. **Ask Caspr:** `ask_caspr` request/response shape; streamed?
5. **Infographic:** confirm structured data + layout (not a rendered image).
6. **429 contract:** confirm the standard shape in §7.8.
7. **Product-backend hosting:** EKS service vs API Gateway + Lambda in the shared AWS account — your preference given ops/IAM.
8. **Knowledge-graph build spec:** location/scope — anything the front-end or data layer must support? (Joy to locate the file.)

---

## 12. Next Steps

| Step | Owner | When |
|---|---|---|
| Jayant answers the 8 open items (§11) | Jayant | ASAP |
| Scaffold product-app repo (Bitbucket) + mock MCP server + mock auth | Joy's team | Now, in parallel |
| Build product against mocks | Joy's team | Now |
| Swap mocks → Jayant's tools as they land | Both | Rolling |
| Load + penetration test on `new.caspr.ai` | Both | Before cutover |
| Single-shot cutover (app live; website untouched) | Both | On green |

---

*Document: architecture-alignment-v4.md*
*Owner: Joy Sharma · Version 4.1 — 2026-08-10 (base v4 2026-07-30)*
*Supersedes: architecture-alignment-final.md (v3), architecture-alignment-aws.md*
*v4.1 addendum: hosted Stripe (Model B), AWS SNS phone/OTP, SG entity + USD payout, notifications/nav — all product-side, no Jayant-contract change.*
