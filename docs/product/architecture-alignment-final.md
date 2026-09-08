# Caspr App — Architecture Alignment

**For:** Jayant (CTO)  
**From:** Joy  
**Date:** 2026-05-23  
**Status:** Awaiting Jayant sign-off  

**Purpose:** This document defines the proposed architecture for the new Caspr product front-end, the division of work between Joy's team and Jayant's team, the integration contract between the two, and all security requirements. Your answers to the 16 questions at the end are required before the full technical spec and API contract are written. Once you confirm, Joy's team begins building immediately against mocked APIs — we swap in your real endpoints as you complete them.

---

## 1. The Approach

Joy's team is building the entire product front-end and all surrounding non-AI infrastructure. This frees Jayant and the backend team to focus exclusively on the proprietary AI pipeline — the Learning Brain, the Thinking Brain, and the generation layer. That is where Caspr's competitive advantage lives. Everything else is handled.

The front-end communicates with Jayant's backend through six well-defined API endpoints. Once those are agreed, the two teams build in parallel with no blocking dependencies.

---

## 2. Security Principles

These govern every architecture decision. Where a proposal conflicts with a principle, the principle wins.

**Principle 1: Sensitive data never leaves Caspr's infrastructure.**  
Analysis content and uploaded files reside exclusively in Jayant's infrastructure. They never touch a third-party service. This preserves the security claim already on the Caspr security page and makes it true in the new architecture.

**Principle 2: Caspr's proprietary models are the most important thing to protect.**  
The Learning Brain and Thinking Brain are Caspr's core IP. Legal protection is necessary but insufficient. The architecture must make it practically impossible to extract, replicate, or steal these models through both technical controls and operational discipline.

**Principle 3: Every API request is authenticated. No public endpoints.**  
Every request carries a short-lived JWT. No long-lived credentials exist that, if exfiltrated, give persistent access.

**Principle 4: Third-party services hold only non-sensitive data.**  
Clerk holds identity. Stripe holds payment tokens. Supabase holds metadata and preferences. None of them hold analysis content, uploaded files, or anything a user would consider confidential.

**Principle 5: The API surface is minimal.**  
Fewer endpoints mean a smaller attack surface. The integration contract exposes only high-level business operations. Nothing in the API reveals model architecture, weights, or training data.

---

## 3. Division of Work

### Joy's Team Owns

| Area | Approach |
|---|---|
| All product UI/UX | React + Vite, TypeScript, Tailwind v4 |
| Authentication & user management | Clerk |
| Payments & subscriptions | Stripe (Joy builds full integration; Jayant handles one webhook) |
| Non-sensitive data layer | Supabase — metadata, preferences, collaboration, wallet only |
| Real-time UI updates (sections completing, analysis status) | Supabase Realtime |
| File upload UI | Direct browser-to-Jayant-storage upload via presigned URLs |
| Source web visualisation | React frontend consuming Jayant's SSE event stream |
| Report streaming display | React frontend consuming Jayant's SSE section stream |
| Collaboration UI (permissions, annotations, versioning display) | Frontend + Supabase |
| Wallet display | Frontend consuming balance data Jayant writes to Supabase |
| Context Layer / user profile | Frontend + Supabase |
| Frontend hosting | Vercel (static SPA — CDN delivery, not SSR; scales to millions of concurrent users without configuration) |

### Jayant's Team Owns

| Area | Notes |
|---|---|
| Learning Brain | Source identification; all source event streaming |
| Thinking Brain | Analysis, reasoning, projections, stress tests |
| Report generation | Section streaming; all AI output |
| Executive summary generation | Written after all sections complete; must include `section_id` references |
| Infographic generation | One-page visual summary per report |
| Live data feeds | Real-time source data powering the Learning Brain |
| "What Changed" detection | Monitor previously analysed markets for significant data changes |
| Analysis content storage | All section text, executive summaries stored in Jayant's DB only — never Supabase |
| Uploaded file storage | All user files in Jayant's encrypted storage only — never Supabase |
| Report retrieval API | `GET /analyses/{id}` — serves completed reports from Jayant's DB |
| Presigned URL generation | Browser uploads directly to Jayant's storage; Jayant generates short-lived URLs |
| Stripe webhook handler | One endpoint: payment confirmed → write updated balance to Supabase |
| JWT verification | Verify Clerk JWT on every FastAPI request (~10 lines with Clerk's Python SDK) |
| Secure model deployment | See Section 6 |
| Audit log generation | Log every analysis access, file upload, share event |

---

## 4. Data Classification

Every piece of data routes to exactly one store. This is not adjustable.

| Data | Sensitivity | Store |
|---|---|---|
| User identity (name, email) | Low | Clerk |
| User preferences, ICP category, onboarding status | Low | Supabase |
| Folder names, analysis titles, timestamps, status | Low | Supabase |
| Collaboration permissions, annotations | Medium | Supabase |
| Wallet balance, transaction history | Medium | Supabase |
| Context Layer profile answers | Medium | Supabase |
| Payment methods, invoices | Medium | Stripe (tokenised — no raw card data anywhere) |
| **Analysis content (sections, executive summary)** | **High** | **Jayant's DB only** |
| **Uploaded files** | **Very High** | **Jayant's encrypted storage only** |
| **Model weights, architecture, training data** | **Critical** | **Jayant's air-gapped infrastructure only** |

---

## 5. Service Stack

### Clerk — Authentication

Handles the full auth layer. Jayant writes zero auth code beyond JWT verification middleware.

**What it covers:**
- Email/password signup and login
- Google OAuth
- Microsoft/Outlook OAuth — essential; primary ICPs are on Microsoft 365
- LinkedIn OAuth — strategic; profile data pre-fills onboarding; same identity users use when they discover Caspr on LinkedIn
- Short-lived JWTs (60-minute max), refresh token rotation
- Device session management — users can revoke all active sessions instantly (critical if a device is lost)
- Enterprise SAML/SSO — Clerk Enterprise plan; required for Enterprise tier customers

**Jayant's only requirement:** verify the Clerk JWT on every FastAPI request. Clerk's Python SDK makes this ~10 lines of middleware.

**Cost:** Free up to 10,000 MAU; ~$0.02/MAU above that.

---

### Supabase — Non-Sensitive Data Layer

Stores only Low and Medium sensitivity data. Analysis content and files never touch Supabase.

**Tables:**

| Table | Contents |
|---|---|
| `users` | Clerk user ID, ICP category, onboarding status, plan, LinkedIn profile snapshot |
| `analyses` | ID, user ID, title, depth, status, version count, folder ID, created/updated timestamps |
| `folders` | User ID, folder name, folder type (use-case / project / client / topic) |
| `collaborators` | Analysis ID, user ID, permission level per section, granted by, granted at |
| `annotations` | Analysis ID, section ID, user ID, comment text, resolved flag |
| `versions` | Analysis ID, version number, created timestamp, created by |
| `wallet` | User ID, current balance, plan, refill date, last updated |
| `wallet_transactions` | User ID, analysis ID, amount debited, timestamp, analysis type |
| `context_layer` | User ID, question ID, answer, answered at |
| `audit_log` | User ID, event type, analysis ID, timestamp, IP, user agent |

**Row-Level Security (RLS):** Every table has RLS policies enforcing per-user isolation at the database level. A compromised application layer cannot return another user's rows.

**Region:** EU Frankfurt for European customers (GDPR); US East default. Configuration only — no architectural change.

**Cost:** Free tier at launch; Pro $25/month from ~1,000 MAU; Team $599/month from ~10,000 MAU.

---

### Stripe — Payments

Joy's team builds the full Stripe integration. Jayant handles one webhook endpoint.

**Joy handles:** Plan selection, Stripe.js payment forms (PCI DSS Level 1 — card data never touches Caspr servers), subscription management, upgrade/downgrade, invoice history, Research Budget top-up, free trial activation.

**Jayant handles:**

```
POST /webhooks/stripe
Stripe-Signature: <header>

Events to handle:
  invoice.paid                   → update wallet.balance in Supabase
  customer.subscription.updated  → update users.plan in Supabase
  customer.subscription.deleted  → downgrade users.plan in Supabase
```

---

## 6. Model Security — Protecting Caspr's Core IP

The Learning Brain and Thinking Brain are Caspr's primary competitive asset and the primary target for sophisticated attacks. Legal protection is necessary but not sufficient. The controls below must be in place before the API is connected to any production traffic.

### Threat Model

| Threat | Description |
|---|---|
| Model extraction | Attacker queries the API systematically to reconstruct model behaviour without accessing weights |
| Infrastructure breach | Attacker gains access to servers and exfiltrates model weight files directly |
| API abuse at scale | Automated scraping to extract training data or reconstruct output patterns |
| Supply chain attack | Compromising a dependency or infrastructure provider for indirect model access |
| Insider threat | Someone with legitimate infrastructure access exfiltrating model weights |
| Prompt injection | Malicious inputs designed to reveal model architecture or training data |

### Required Infrastructure Architecture

The API gateway is the only internet-facing component. Model serving and model storage have no public IP addresses.

```
Internet
    │
    ▼
[API Gateway / FastAPI]       ← only public-facing component; JWT verification here
    │  private network only
    ▼
[Model Serving Layer]          ← no public IP; no direct internet access
    │  private network only
    ▼
[Model Weight Storage]         ← encrypted at rest; access-controlled; separate from serving layer
```

**Requirements:**
- Model weights encrypted at rest (AES-256 minimum)
- Access to model weight files restricted to minimum required service accounts only — not accessible to application code or API services
- Audit log of every access to model weight storage
- Secrets manager in use (AWS Secrets Manager, HashiCorp Vault, or equivalent) — zero hardcoded credentials or model paths in any codebase
- Dependency audit completed before production launch

### Defence Against Model Extraction

**Rate limiting — three layers:**
- Per-user: the Research Budget model is the natural rate limiter; users can only run analyses they can afford
- Per-IP: flag anomalous request volumes from a single IP
- Per-account: flag accounts running analyses far beyond expected usage for their plan age and tier

**Anomaly detection:**
- Monitor for extraction patterns: systematically varied prompts, high volume relative to account age, prompts that probe model boundaries
- Automated flagging and manual review for suspicious accounts
- Suspend accounts showing confirmed extraction behaviour

**Output controls:**
- Never return model confidence scores, logits, token probabilities, or internal model state in any API response
- Post-process outputs to strip any metadata that could reveal model internals

**Output watermarking (Phase 2):**
- Embed invisible watermarks in generated analysis content
- If Caspr outputs appear in a competitor product or public training dataset, the watermark traces them to the originating Caspr account
- Forensic evidence for legal proceedings; deters systematic commercial extraction

### Frontend Contributions to Model Security

The API contract is designed to expose no model internals:
- All endpoints are high-level business operations — none reference or reveal model architecture
- Every request requires a valid, short-lived Clerk JWT; the frontend enforces this and surfaces proper error states rather than retrying silently
- All communication over TLS 1.3 enforced at Vercel edge — no fallback
- All inference is server-side; the browser never receives anything that reveals model behaviour outside the structured API response

### Pre-Production Checklist (Jayant)

- [ ] Model serving infrastructure has no public IP
- [ ] Model weight storage is on a separate network layer from model serving
- [ ] Model weights encrypted at rest
- [ ] Secrets manager in use — zero hardcoded credentials
- [ ] Rate limiting active at API gateway (per-user, per-IP)
- [ ] Request and access logging active
- [ ] JWT verification middleware deployed and tested
- [ ] TLS 1.3 enforced
- [ ] Dependency audit complete
- [ ] Penetration test scheduled before production launch

---

## 7. Additional Security Requirements

### Uploaded File Encryption

Storage-level AES-256 is necessary but insufficient for Caspr's ICP. A PE analyst uploading an acquisition target's data room or a consulting associate uploading a client brief needs application-layer protection — envelope encryption with per-user keys. This means a Caspr employee with storage access cannot read a user's uploaded documents without that user's encryption key.

### Audit Logging

Enterprise and investor ICPs will ask "who accessed this report and when?" in vendor security reviews. Jayant must generate an immutable audit log entry for every:
- Analysis created, opened, downloaded, or exported
- File uploaded or used in an analysis
- Report shared (with whom, at what permission level)
- Collaborator access granted or revoked
- Failed authentication attempt on a shared report link

Requirements: append-only (not editable, including by Caspr staff), retained for minimum 12 months, surfaced in the UI for Enterprise accounts (Joy builds the display).

### Data Residency

EU-based users have GDPR data residency requirements. Supabase EU region is a configuration choice. Jayant's infrastructure needs a deployment decision on where EU users' analysis data is stored and processed. This must be decided before launch — retrofitting data residency is architectural work, not configuration.

### Sharing Security

When a report is shared with a collaborator:
- Collaborators access analysis content only — never the underlying uploaded files that informed the analysis
- Access is enforced at the API level; the frontend cannot override it
- Every collaborator access is written to the audit log
- Owners can revoke access immediately; revocation takes effect on the next API request
- Shared links require the recipient to authenticate with a Caspr account before accessing any content — no public read access

---

## 8. Scaling & Capacity

### Clarification on Vercel

The concern that "Vercel breaks under load" applies to Next.js SSR apps where every page render is a serverless function invocation. Our front-end is a pure React SPA — Vercel serves static files (HTML, JS, CSS) from a global CDN. There is no per-request computation on Vercel's side. Static CDN delivery scales to millions of concurrent users without configuration changes. Vercel is not a scaling bottleneck for this architecture.

### SSE Connection Architecture

One change is required to make the analysis flow scalable. An Intelligence analysis takes up to 24 hours. Holding an SSE connection open for 24 hours per user is not feasible at any meaningful scale. The proposed hybrid:

```
Phase 1 — Learning Brain (minutes):
  Frontend maintains SSE connection
  Source events stream in real time
  Layout proposed → user approves

Phase 2 — Generation (15 min to 24 hrs):
  Frontend disconnects from SSE
  Jayant's backend continues asynchronously
  On each section complete → Jayant writes to Supabase (analysis table)
  Supabase Realtime notifies frontend (lightweight persistent WebSocket)
  On analysis complete → email notification + in-app notification

Result:
  SSE connections are held for minutes only, not hours
  Concurrent SSE load on Jayant's backend ≈ users currently in the Learning Brain phase only
```

This change should be reflected in Jayant's backend design. The section stream SSE endpoint (endpoint 3 below) can be structured to close after the generation is kicked off rather than streaming for the full analysis duration.

### Scaling Table

| Stage | MAU | Peak Concurrent Users | Peak Concurrent Analyses | Vercel | Clerk | Supabase | Realtime | Jayant Backend | Action Required |
|---|---|---|---|---|---|---|---|---|---|
| **Launch** | 0–1K | ~50 | ~10 | ✅ | ✅ Free | ✅ Free | ✅ 200 connections | ✅ Low load | Upgrade Supabase to Pro before launch |
| **Early traction** | 1K–10K | ~500 | ~100 | ✅ | ✅ ~$150/mo | ✅ Pro $25/mo | ✅ 500 connections | ⚠️ Add job queue | Add Redis/Celery queue for analysis jobs |
| **Growth** | 10K–100K | ~5,000 | ~1,000 | ✅ | ⚠️ ~$2K/mo | ⚠️ Team $599/mo | ⚠️ Approaching Pro limit | ⚠️ Horizontal GPU scaling needed | Dedicated real-time service (Ably/Pusher); Cloudflare in front of API |
| **Scale** | 100K–500K | ~20,000 | ~5,000 | ✅ | ⚠️ ~$10K/mo | ❌ Self-host Postgres | ❌ Replace with Ably/Pusher | ❌ GPU cluster + load balancing | Migrate off managed Supabase; evaluate self-hosted auth |
| **Enterprise scale** | 500K+ | ~100,000 | ~20,000 | ✅ | ❌ Self-hosted auth | ❌ Self-hosted + read replicas | ❌ Dedicated infra | ❌ Enterprise GPU infrastructure | Full infrastructure ownership; regional deployment |

### Estimated Monthly Infrastructure Cost (Excluding Jayant's AI Compute)

| Stage | MAU | Vercel | Clerk | Supabase | Real-time | Other | **Total** |
|---|---|---|---|---|---|---|---|
| Launch | 0–1K | $0 | $0 | $25 | Included | $0 | **~$25/mo** |
| Early traction | 1K–10K | $20 | $150 | $25 | Included | $50 | **~$245/mo** |
| Growth | 10K–100K | $20 | $2,000 | $599 | $250 | $200 | **~$3,070/mo** |
| Scale | 100K–500K | $150 | $10,000 | ~$800 | $1,000 | $500 | **~$12,450/mo** |
| Enterprise | 500K+ | Custom | Self-hosted | Self-hosted | Self-hosted | Custom | Custom |

*Stripe fees are revenue-proportional (2.9% + $0.30/transaction) and are excluded as they scale with revenue, not with infrastructure load.*

### Migration Triggers

Migrate when these thresholds are hit, not on a time schedule:

| Trigger | Action |
|---|---|
| Supabase Realtime approaching 400 concurrent connections | Migrate Realtime to Ably or Pusher |
| Clerk cost exceeding $3,000/month | Evaluate self-hosted auth |
| Supabase DB query p95 latency > 200ms | Add read replica or migrate to self-hosted Postgres |
| Jayant's analysis queue depth consistently > 50 | Scale GPU capacity |
| Any critical finding in penetration test | Address before next growth stage |

### Critical Input Needed from Jayant

**What is the maximum number of concurrent analyses your current infrastructure can support?**  
This determines how aggressively we can offer free trials, what the queue UX looks like, and whether rate limits are needed at launch. Without this number, we cannot set appropriate guardrails.

---

## 9. Integration Contract

Six endpoints. This is the complete integration surface between Joy's frontend and Jayant's backend.

---

### Endpoint 1 — Trigger Analysis

```
POST /analyses
Authorization: Bearer <clerk_jwt>

Request body:
{
  "prompt":               string,
  "depth":                "brief" | "study" | "intelligence",
  "file_ids":             string[],          // previously uploaded file IDs to include
  "new_file_id":          string | null,     // file uploaded for this analysis only
  "include_user_files":   boolean,           // whether to include all user's uploaded files
  "clarifications": [
    { "question_id": string, "answer": string }
  ],
  "style":                "mbb" | "big4" | "academic" | "pe" | "scholarly" | "enterprise",
  "output_language":      string,            // ISO 639-1, e.g. "en", "fr", "de"
  "template_id":          string | null      // enterprise custom template ID, or null
}

Response:
{
  "analysis_id":       string,
  "status":            "started",
  "estimated_minutes": number
}
```

---

### Endpoint 2 — Source Event Stream (Learning Brain)

```
GET /analyses/{analysis_id}/source-stream
Authorization: Bearer <clerk_jwt>
Accept: text/event-stream

Server-Sent Events:

{ "event": "source_category_activated",
  "data": { "category": string } }

{ "event": "source_category_progress",
  "data": { "category": string, "count": number } }

{ "event": "source_category_completed",
  "data": { "category": string, "total": number } }

{ "event": "total_sources_reviewed",
  "data": { "count": number } }

{ "event": "notable_source_found",
  "data": { "name": string, "category": string } }

{ "event": "cross_reference_detected",
  "data": { "category_a": string, "category_b": string } }

{ "event": "layout_ready",
  "data": {
    "sections": [
      { "id": string, "title": string, "estimated_pages": number }
    ],
    "clarifying_questions": [
      { "id": string, "question": string }
    ]
  }
}

{ "event": "stream_complete", "data": {} }

// Stream closes after layout_ready. Generation proceeds asynchronously.
// Frontend switches to Supabase Realtime for section completion events.
```

---

### Endpoint 3 — Section Stream (Thinking Brain + Generation)

```
GET /analyses/{analysis_id}/section-stream
Authorization: Bearer <clerk_jwt>
Accept: text/event-stream

Server-Sent Events:

{ "event": "section_started",
  "data": { "section_id": string, "title": string } }

{ "event": "section_content",
  "data": { "section_id": string, "chunk": string } }   // streamed text chunks

{ "event": "section_complete",
  "data": {
    "section_id":  string,
    "chart_data":  object | null   // see chart_data format question below
  }
}

{ "event": "exec_summary_ready",
  "data": {
    "insights": [
      { "text": string, "section_id": string }     // section_id required for hyperlinks
    ],
    "questions": [
      { "text": string, "section_id": string }     // section_id required for hyperlinks
    ],
    "infographic_url": string
  }
}

{ "event": "analysis_complete",
  "data": { "analysis_id": string } }

{ "event": "stream_complete", "data": {} }
```

**Critical:** Every insight and key question in `exec_summary_ready` must include the `section_id` it references. The frontend uses these to wire hyperlinks from the executive summary directly to the relevant sections.

---

### Endpoint 4 — Retrieve Completed Analysis

```
GET /analyses/{analysis_id}
Authorization: Bearer <clerk_jwt>

Response:
{
  "analysis_id":   string,
  "title":         string,
  "depth":         "brief" | "study" | "intelligence",
  "style":         string,
  "created_at":    string,   // ISO 8601
  "version":       number,
  "sections": [
    {
      "id":         string,
      "index":      number,
      "title":      string,
      "content":    string,
      "chart_data": object | null
    }
  ],
  "exec_summary": {
    "insights":  [ { "text": string, "section_id": string } ],
    "questions": [ { "text": string, "section_id": string } ],
    "infographic_url": string
  },
  "cover": {
    "title":         string,
    "date":          string,
    "author":        string,
    "analysis_type": string,
    "style":         string
  }
}
```

---

### Endpoint 5 — Presigned File Upload URL

```
POST /files/upload-url
Authorization: Bearer <clerk_jwt>

Request body:
{
  "filename":     string,
  "content_type": string,
  "size_bytes":   number
}

Response:
{
  "file_id":    string,
  "upload_url": string,     // short-lived presigned URL, browser uploads directly
  "expires_at": string      // ISO 8601, expires in 15 minutes
}
```

---

### Endpoint 6 — Stripe Webhook

```
POST /webhooks/stripe
Stripe-Signature: <stripe_signature_header>

Handles:
  invoice.paid                   → write updated balance to wallet table in Supabase
  customer.subscription.updated  → write updated plan to users table in Supabase
  customer.subscription.deleted  → write cancelled/downgraded plan to users table in Supabase
```

---

### Red-dot provenance / Ask Caspr — ALREADY BUILT by Jayant (documented 2026-07-13)

Per Joy, the **red-dot mechanism is already implemented on Jayant's side** and is not part of the six-endpoint proposal above — documenting here so the contract is complete. On the screen report, a tappable red dot sits at every figure/derived number that has a source to cite or a calculation to explain (product spec: `app-shell-framework.md §5`, `report-style-guide.md` Layer 4). Tapping raises Ask Caspr, pre-scoped to that anchor, with Caspr's provenance/derivation answer as the first reply, then free-form follow-up.

**To confirm with Jayant (so the frontend wires it correctly, not to request new work):**
- How does a report anchor (figure/claim) carry its red-dot identity — an inline marker/`anchor_id` in the section content, or a separate map of anchors per section?
- What is the request/response shape for "explain this anchor" (the first reply) and for follow-up questions in that scoped thread — endpoint path, and does the scoped thread reuse the same Ask-Caspr conversation endpoint?

### Endpoint additions — engagement layer + The Signal (added 2026-07-13)

Two product features locked in design require backend support. Neither adds a new endpoint; both extend the existing streams / records.

**A) The engagement carousel (Generation phase).** While the report generates, the frontend shows a tap-based carousel (product spec: `app-shell-framework.md §16`). Most of it is frontend-only, but two card types need backend data:

- **"Early finding" card** — a real stat/insight already locked by the analysis, shown mid-generation to build anticipation. Add to **Endpoint 3 (section-stream)** a lightweight early event, emitted as soon as the first high-confidence figure is available (well before `analysis_complete`):
  ```
  { "event": "early_signal",
    "data": { "stat": string, "label": string, "section_id": string } }
  // e.g. { "stat": "78%", "label": "of global EV volume sits in 3 regions", "section_id": "market-overview" }
  ```
  If surfacing an early figure is not feasible, the frontend degrades gracefully (this card type is simply omitted) — confirm feasibility.
- **"Read the work" / feedback answers** — pills/ratings the user taps. These are **frontend + Supabase only** (write to the existing `context_layer` table, §5) — **no Jayant work.** Same store already feeds Gate Style pre-selection and Compose personalisation.

**B) The Signal — opinion / sentiment blocks in reports** (report spec: `report-style-guide.md §9a`). A report section may contain one or more **synthesised opinion blocks** drawn from crowd-sourced-but-credible sources (social/news/forums), visually and epistemically distinct from cited findings. The Thinking Brain must emit these as **structured data, not inline prose** (the frontend renders the distinct block treatment). Extend:

- **Endpoint 3 `section_complete`** and **Endpoint 4 section object** — add an optional `signal_blocks` array per section:
  ```
  "signal_blocks": [
    {
      "id":           string,
      "statement":    string,   // the synthesised position — "The market thinks…"
      "attribution":  {
        "mention_count":  number | null,   // e.g. 2400
        "channels":       string[],        // e.g. ["forums","x","reddit"]
        "named_sources":  number | null,   // e.g. 9 named operators on the record
        "period":         string           // e.g. "Jan–Jun 2026"
      }
    }
  ] | null
  ```
- **Source provenance:** every source Jayant returns (for both cited findings and Signal blocks) must carry a `provenance` field — **`curated`** (the 25M+ curated/cited corpus) vs **`crowd_sourced`** (social/forum/news sentiment). The frontend uses this to route content into cited-citation vs Signal-block treatments, and to derive the document's overall provenance tag (`document-taxonomy.md §A.9 / §9a`). **Signal blocks must never be built from `curated` sources, and cited findings must never be built from `crowd_sourced` sources** — the separation is the credibility guarantee.

---

## 10. Questions for Jayant

Please answer all 16 questions. Priority markers indicate what blocks the spec:

🔴 **Blocking** — must be answered before the spec is written  
🟡 **Important** — will significantly affect the spec  
🟢 **Non-blocking** — good to know now, can be finalised later

---

**Architecture**

1. 🔴 Do existing caspr.ai users need to be migrated to the new auth system? If yes, how many users, and do they have associated data (analyses, files) that must transfer?

2. 🔴 Do you have an existing database? Should we use Supabase as an additive non-sensitive data store alongside your existing DB, or do you prefer to align on a single database system?

3. 🔴 Do you have an existing file storage system? Can the new front-end use it, or do we set up separate storage?

4. 🟡 Is Stripe already integrated in caspr.ai? If yes, we add new products and prices to the existing account rather than creating a new one.

5. 🟡 Does your current architecture support a single `POST /analyses` trigger as described? Or is the trigger mechanism different?

6. 🟡 Is the `layout_ready` event emitted by the Learning Brain after source identification, as described in Endpoint 2? Or does the layout proposal come from a separate process?

7. 🟡 **SSE hybrid architecture:** The proposal is that the source-stream SSE closes after `layout_ready`, and the generation phase communicates via Supabase Realtime (Jayant writes section completions to Supabase, frontend subscribes). Does this work for your backend design, or do you need to keep the SSE connection open for the full generation? This directly affects how we handle long-running Intelligence analyses (up to 24 hours).

8. 🟡 What format does `chart_data` come in? (e.g. Vega-Lite spec, Chart.js config, raw data + chart type string?) The frontend renders the chart — we need the underlying data structure.

9. 🟢 How should enterprise custom templates be referenced — does the frontend send a `template_id`, or is the template resolved server-side from the user's enterprise account record?

10. 🟢 For "What Changed" notifications — when the backend detects significant changes in a previously analysed market, should the frontend be notified via Supabase Realtime (Jayant writes a flag to the analyses table) or via a separate push notification endpoint?

10a. 🟡 **Early-signal event (engagement carousel):** Can the Thinking Brain emit an `early_signal` event on the section-stream — one high-confidence stat + label + section_id — as soon as it's available, well before generation completes? (See Endpoint 3 addition.) If not feasible, we omit that one carousel card; confirm either way.

10b. 🟡 **The Signal / source provenance:** Two parts. (i) Can every source you return carry a `provenance` tag of `curated` vs `crowd_sourced`? This is a hard requirement — the frontend renders crowd-sourced sentiment in a visually and epistemically distinct block ("The Signal"), and cited findings must *never* draw from crowd-sourced sources nor vice versa. (ii) Can the Thinking Brain emit synthesised opinion as structured `signal_blocks` (statement + aggregate attribution: mention count, channels, named-source count, period) per section, rather than as inline prose? (See Endpoint 3 / 4 additions.)

---

**Security**

11. 🔴 What is the current deployment architecture for the caspr.ai models? Is the model serving layer already isolated from the public internet on a private network? If not, what is the plan and timeline?

12. 🔴 Is rate limiting currently in place at the API gateway — per-user, per-IP? If not, this must be implemented before the API is connected to any production front-end traffic.

13. 🟡 What is the current encryption approach for uploaded files? Is application-layer envelope encryption (per-user keys) feasible for Phase 1, or is this a Phase 2 hardening item?

14. 🟡 Is EU data residency in scope for Phase 1 (required for GDPR compliance for EU users), or is Phase 1 US-only with EU added in Phase 2?

15. 🟢 Is a penetration test planned before production launch? If yes, who is conducting it and on what timeline?

---

**Capacity**

16. 🔴 What is the maximum number of concurrent analyses your current infrastructure can support without degraded performance? This determines free trial rate limits, queue UX design, and whether we need to throttle signups at launch.

---

## 11. What Caspr Can Claim Once This Is Implemented

> *"Your analysis content and uploaded documents are stored exclusively within Caspr's own infrastructure — never in a third-party service. They are never sent to an external AI provider. AES-256 encrypted at rest. TLS 1.3 in transit. ISO 27001:2022 certified."*

This is a materially stronger claim than any competing AI research tool can make. It directly answers the vendor security review question that will arise with every consulting firm, PE fund, and enterprise strategy team in Caspr's ICP.

---

## 12. Next Steps

| Step | Owner | When |
|---|---|---|
| Jayant reviews this document and answers all 16 questions | Jayant | ASAP |
| Joy's team incorporates answers, writes full Product & Frontend Spec | Joy | After Jayant sign-off |
| Joy's team writes versioned Backend API Contract | Joy | After Jayant sign-off |
| Both teams begin building in parallel against agreed contract | Both | Immediately after spec |
| Integration: swap mocked responses for Jayant's real endpoints | Both | As Jayant completes each endpoint |

---

*Document: architecture-alignment-final.md*  
*Owner: Joy Sharma*  
*Version: 3 (final pre-spec) — 2026-05-23*  
*Previous drafts: architecture-alignment.md, architecture-alignment-v2.md*
