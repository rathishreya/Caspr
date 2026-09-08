# Caspr App — Architecture Alignment (AWS)

**For:** Jayant (CTO)  
**From:** Joy  
**Date:** 2026-05-23  
**Status:** Awaiting Jayant sign-off  

**Purpose:** This document defines the proposed architecture for the new Caspr product front-end, the division of work between Joy's team and Jayant's team, the integration contract between the two, and all security requirements. Deployment is fully AWS-native — no Vercel, no Supabase. Your answers to the 16 questions at the end are required before the full technical spec and API contract are written. Once you confirm, Joy's team begins building immediately against mocked APIs — we swap in your real endpoints as you complete them.

---

## 1. The Approach

Joy's team is building the entire product front-end and all surrounding non-AI infrastructure. This frees Jayant and the backend team to focus exclusively on the proprietary AI pipeline — the Learning Brain, the Thinking Brain, and the generation layer. That is where Caspr's competitive advantage lives. Everything else is handled.

The front-end communicates with Jayant's backend through six well-defined API endpoints. Once those are agreed, the two teams build in parallel with no blocking dependencies.

**Deployment platform:** AWS throughout. Frontend on S3 + CloudFront. Non-sensitive data on Amazon RDS PostgreSQL. Real-time on a WebSocket service running on Jayant's EKS cluster. Jayant's AI backend (FastAPI) on EKS.

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
Clerk holds identity. Stripe holds payment tokens. Amazon RDS holds metadata and preferences. None of them hold analysis content, uploaded files, or anything a user would consider confidential.

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
| Non-sensitive data layer | Amazon RDS PostgreSQL — metadata, preferences, collaboration, wallet only |
| Real-time UI updates (sections completing, analysis status) | WebSocket client connecting to Jayant's EKS WebSocket service |
| File upload UI | Direct browser-to-Jayant-storage upload via presigned URLs |
| Source web visualisation | React frontend consuming Jayant's SSE event stream |
| Report streaming display | React frontend consuming Jayant's SSE section stream |
| Collaboration UI (permissions, annotations, versioning display) | Frontend + RDS |
| Wallet display | Frontend consuming balance data Jayant writes to RDS |
| Context Layer / user profile | Frontend + RDS |
| Frontend hosting | AWS S3 + CloudFront (static SPA — CDN delivery, scales to millions of concurrent users without configuration) |

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
| Analysis content storage | All section text, executive summaries stored in Jayant's DB only — never RDS |
| Uploaded file storage | All user files in Jayant's encrypted storage only — never RDS |
| Report retrieval API | `GET /analyses/{id}` — serves completed reports from Jayant's DB |
| Presigned URL generation | Browser uploads directly to Jayant's storage; Jayant generates short-lived URLs |
| Stripe webhook handler | One endpoint: payment confirmed → write updated balance to RDS |
| JWT verification | Verify Clerk JWT on every FastAPI request (~10 lines with Clerk's Python SDK) |
| EKS cluster | Runs FastAPI backend + WebSocket service + internal services |
| WebSocket service (EKS) | On section complete → publish event to ElastiCache Redis → WebSocket pods fan out to connected frontend clients |
| ElastiCache Redis | Internal pub/sub broker between FastAPI and WebSocket service |
| Secure model deployment | See Section 6 |
| Audit log generation | Log every analysis access, file upload, share event |

---

## 4. Data Classification

Every piece of data routes to exactly one store. This is not adjustable.

| Data | Sensitivity | Store |
|---|---|---|
| User identity (name, email) | Low | Clerk |
| User preferences, ICP category, onboarding status | Low | Amazon RDS PostgreSQL |
| Folder names, analysis titles, timestamps, status | Low | Amazon RDS PostgreSQL |
| Collaboration permissions, annotations | Medium | Amazon RDS PostgreSQL |
| Wallet balance, transaction history | Medium | Amazon RDS PostgreSQL |
| Context Layer profile answers | Medium | Amazon RDS PostgreSQL |
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

### Amazon RDS PostgreSQL — Non-Sensitive Data Layer

Replaces Supabase. Stores only Low and Medium sensitivity data. Analysis content and files never touch RDS.

**Instance sizing:**
- Launch: `db.t3.micro` (2 vCPU, 1 GB RAM) — ~$15/month
- Early traction: `db.t3.medium` (2 vCPU, 4 GB RAM) — ~$50/month
- Growth: `db.m5.large` (2 vCPU, 8 GB RAM) + read replica — ~$280/month

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

**Row-Level Security (RLS):** PostgreSQL on RDS supports native RLS policies enforcing per-user isolation at the database level. A compromised application layer cannot return another user's rows.

**Multi-AZ:** Enabled from launch for automatic failover. Synchronous standby replica in a second AZ.

**Region:** `eu-central-1` (Frankfurt) for European customers (GDPR); `us-east-1` default. For EU users, a separate RDS instance or RDS Global Database cluster routes writes to Frankfurt.

**Backups:** Automated daily snapshots, 7-day retention at launch, 30-day at growth stage.

**Access:** RDS sits in a private VPC subnet. Only EKS pods (FastAPI, WebSocket service) can reach it. No public endpoint.

---

### Real-Time Layer — WebSocket on EKS + ElastiCache Redis

Replaces Supabase Realtime. Runs entirely within Jayant's EKS cluster.

**Architecture:**

```
Frontend (browser)
    │  WebSocket (wss://)
    ▼
[ALB / NLB — WebSocket listener]
    │
    ▼
[WebSocket Service — EKS pods]
    │  Subscribe to Redis channels
    ▼
[Amazon ElastiCache Redis]
    ▲
    │  Publish events (section_complete, what_changed, etc.)
[FastAPI Backend — EKS pods]
```

**Event flow:**
1. FastAPI completes a section → publishes `section_complete:{analysis_id}` to Redis
2. WebSocket pods subscribed to that channel push the event to connected frontend clients
3. Frontend receives event, updates section status without polling

**Events published by FastAPI → Redis → frontend:**

| Event | Payload |
|---|---|
| `section_complete` | `{ analysis_id, section_id, title }` |
| `analysis_complete` | `{ analysis_id }` |
| `what_changed` | `{ analysis_id, summary }` |

**Authentication:** WebSocket connection requires a valid Clerk JWT at handshake. Connection rejected without it.

**ElastiCache Redis:** `cache.t3.micro` at launch (~$15/month). Scales to `cache.r6g.large` at growth.

---

### AWS S3 + CloudFront — Frontend Hosting

Replaces Vercel. Serves the static React SPA.

**Architecture:**
```
Browser → CloudFront (global CDN) → S3 bucket (static assets)
```

- S3 bucket: private, no public access. CloudFront Origin Access Control (OAC) only.
- CloudFront distribution: global edge network, HTTP/2, TLS 1.3 enforced.
- Cache-Control headers: assets hashed by Vite build → aggressive caching; `index.html` `no-cache` so deploys take effect immediately.
- Custom domain via Route 53 + ACM certificate.

**Deployment:** GitHub Actions → `aws s3 sync` → CloudFront cache invalidation on deploy. Zero downtime.

**Cost:** S3 storage ~$0.023/GB/month. CloudFront ~$0.0085/GB transfer. At launch, effectively $0–5/month.

---

### Stripe — Payments

Joy's team builds the full Stripe integration. Jayant handles one webhook endpoint.

**Joy handles:** Plan selection, Stripe.js payment forms (PCI DSS Level 1 — card data never touches Caspr servers), subscription management, upgrade/downgrade, invoice history, Research Budget top-up, free trial activation.

**Jayant handles:**

```
POST /webhooks/stripe
Stripe-Signature: <header>

Events to handle:
  invoice.paid                   → update wallet.balance in RDS
  customer.subscription.updated  → update users.plan in RDS
  customer.subscription.deleted  → downgrade users.plan in RDS
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

The API gateway (ALB in front of EKS) is the only internet-facing component. Model serving and model storage have no public IP addresses. All services run in a private VPC.

```
Internet
    │
    ▼
[ALB — public-facing]            ← only public-facing component; JWT verification at FastAPI
    │  private VPC subnet only
    ▼
[FastAPI on EKS]                 ← no public IP; no direct internet access
    │  private subnet only
    ▼
[Model Serving Layer — EKS GPU nodes]   ← isolated node group; no public IP
    │  private subnet only
    ▼
[Model Weight Storage — S3 + KMS]       ← private S3 bucket; encrypted; separate IAM role
```

**Requirements:**
- Model weights encrypted at rest (AWS KMS with customer-managed keys)
- IAM role for model serving nodes grants S3 access to weight bucket — not accessible to FastAPI pods or application code
- CloudTrail + S3 access logging: audit log of every access to model weight storage
- AWS Secrets Manager in use — zero hardcoded credentials or model paths in any codebase
- EKS network policies (Calico or AWS VPC CNI) enforce pod-to-pod communication rules
- Dependency audit completed before production launch

### Defence Against Model Extraction

**Rate limiting — three layers:**
- Per-user: the Research Budget model is the natural rate limiter; users can only run analyses they can afford
- Per-IP: AWS WAF rule on ALB — flag anomalous request volumes from a single IP
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
- All communication over TLS 1.3 enforced at CloudFront and ALB — no fallback
- All inference is server-side; the browser never receives anything that reveals model behaviour outside the structured API response

### Pre-Production Checklist (Jayant)

- [ ] Model serving EKS node group has no public IP; isolated node group with network policies
- [ ] Model weight S3 bucket is private; OAC or IAM-only access
- [ ] Model weights encrypted at rest with KMS customer-managed key
- [ ] AWS Secrets Manager in use — zero hardcoded credentials
- [ ] AWS WAF active on ALB (rate limiting per-IP)
- [ ] CloudTrail and EKS audit logging active
- [ ] JWT verification middleware deployed and tested
- [ ] TLS 1.3 enforced at ALB and CloudFront
- [ ] Dependency audit complete
- [ ] Penetration test scheduled before production launch

---

## 7. Additional Security Requirements

### Uploaded File Encryption

Storage-level encryption (KMS) is necessary but insufficient for Caspr's ICP. A PE analyst uploading an acquisition target's data room or a consulting associate uploading a client brief needs application-layer protection — envelope encryption with per-user keys. This means a Caspr employee with storage access cannot read a user's uploaded documents without that user's encryption key.

### Audit Logging

Enterprise and investor ICPs will ask "who accessed this report and when?" in vendor security reviews. Jayant must generate an immutable audit log entry for every:
- Analysis created, opened, downloaded, or exported
- File uploaded or used in an analysis
- Report shared (with whom, at what permission level)
- Collaborator access granted or revoked
- Failed authentication attempt on a shared report link

Requirements: append-only (not editable, including by Caspr staff), retained for minimum 12 months, surfaced in the UI for Enterprise accounts (Joy builds the display). Stored in the `audit_log` RDS table and optionally mirrored to CloudWatch Logs for long-term retention and querying.

### Data Residency

EU-based users have GDPR data residency requirements. RDS deployed in `eu-central-1` (Frankfurt) covers the EU data layer. Jayant's EKS cluster needs a parallel deployment decision for EU users' analysis data and inference. This must be decided before launch — retrofitting data residency is architectural work, not configuration.

### Sharing Security

When a report is shared with a collaborator:
- Collaborators access analysis content only — never the underlying uploaded files that informed the analysis
- Access is enforced at the API level; the frontend cannot override it
- Every collaborator access is written to the audit log
- Owners can revoke access immediately; revocation takes effect on the next API request
- Shared links require the recipient to authenticate with a Caspr account before accessing any content — no public read access

---

## 8. Scaling & Capacity

### Frontend Hosting on S3 + CloudFront

S3 + CloudFront serves static files (HTML, JS, CSS) from a global CDN. There is no per-request computation on AWS's side. Static CDN delivery scales to millions of concurrent users without configuration changes and is not a scaling bottleneck.

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
  On each section complete → FastAPI publishes to ElastiCache Redis
  WebSocket service fans out to connected frontend clients
  On analysis complete → email notification + in-app notification

Result:
  SSE connections are held for minutes only, not hours
  Concurrent SSE load on Jayant's backend ≈ users currently in the Learning Brain phase only
  WebSocket connections are lightweight persistent connections — each EKS WebSocket pod handles thousands concurrently
```

### Scaling Table

| Stage | MAU | Peak Concurrent Users | Peak Concurrent Analyses | S3 + CloudFront | Clerk | RDS PostgreSQL | WebSocket (EKS) | Jayant Backend (EKS) | Action Required |
|---|---|---|---|---|---|---|---|---|---|
| **Launch** | 0–1K | ~50 | ~10 | ✅ | ✅ Free | ✅ t3.micro ~$15/mo | ✅ 1–2 pods | ✅ Low load | Enable Multi-AZ on RDS before launch |
| **Early traction** | 1K–10K | ~500 | ~100 | ✅ | ✅ ~$150/mo | ✅ t3.medium ~$50/mo | ✅ 2–4 pods (HPA) | ⚠️ Add Celery/Redis job queue | Add Redis job queue for analysis backlog; enable RDS autoscaling |
| **Growth** | 10K–100K | ~5,000 | ~1,000 | ✅ | ⚠️ ~$2K/mo | ⚠️ m5.large + read replica ~$280/mo | ⚠️ 10–20 pods; ElastiCache cluster mode | ⚠️ Horizontal GPU node scaling | CloudFront WAF; RDS read replica for reporting queries |
| **Scale** | 100K–500K | ~20,000 | ~5,000 | ✅ | ⚠️ ~$10K/mo | ⚠️ Migrate to Aurora PostgreSQL ~$600/mo | ⚠️ Dedicated WebSocket node group | ❌ GPU cluster + load balancing | Upgrade RDS to Aurora; evaluate self-hosted auth |
| **Enterprise scale** | 500K+ | ~100,000 | ~20,000 | ✅ | ❌ Self-hosted auth | ❌ Aurora Global DB + read replicas | ❌ Multi-region WebSocket | ❌ Enterprise GPU infrastructure | Full multi-region deployment; dedicated infra per enterprise tenant |

### Estimated Monthly Infrastructure Cost (Excluding Jayant's AI Compute)

| Stage | MAU | S3 + CloudFront | Clerk | RDS PostgreSQL | ElastiCache Redis | Other (Route53, ACM, WAF) | **Total** |
|---|---|---|---|---|---|---|---|
| Launch | 0–1K | ~$2 | $0 | ~$15 | ~$15 | ~$5 | **~$37/mo** |
| Early traction | 1K–10K | ~$10 | ~$150 | ~$50 | ~$15 | ~$20 | **~$245/mo** |
| Growth | 10K–100K | ~$30 | ~$2,000 | ~$280 | ~$80 | ~$100 | **~$2,490/mo** |
| Scale | 100K–500K | ~$100 | ~$10,000 | ~$600 | ~$300 | ~$300 | **~$11,300/mo** |
| Enterprise | 500K+ | Custom | Self-hosted | Aurora Global | Self-hosted | Custom | Custom |

*Stripe fees are revenue-proportional (2.9% + $0.30/transaction) and excluded as they scale with revenue.*  
*Jayant's EKS cluster, GPU compute, and AI model infrastructure costs are excluded — these are Jayant's team costs.*

### Migration Triggers

Migrate when these thresholds are hit, not on a time schedule:

| Trigger | Action |
|---|---|
| RDS CPU sustained > 70% | Upgrade instance class or add read replica |
| RDS connection count approaching limit for instance class | Add PgBouncer connection pooler on EKS |
| ElastiCache memory > 70% used | Upgrade node or enable cluster mode |
| WebSocket pod CPU > 70% at peak | Increase HPA max replicas; review ElastiCache configuration |
| Clerk cost exceeding $3,000/month | Evaluate self-hosted auth (Keycloak on EKS) |
| CloudFront p95 latency > 100ms | Review cache hit rate; optimise asset caching headers |
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
// FastAPI publishes section_complete events to ElastiCache Redis.
// WebSocket service on EKS fans out to connected frontend clients.
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
    "chart_data":  object | null
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
  "upload_url": string,     // short-lived presigned S3 URL, browser uploads directly
  "expires_at": string      // ISO 8601, expires in 15 minutes
}
```

---

### Endpoint 6 — Stripe Webhook

```
POST /webhooks/stripe
Stripe-Signature: <stripe_signature_header>

Handles:
  invoice.paid                   → write updated balance to wallet table in RDS
  customer.subscription.updated  → write updated plan to users table in RDS
  customer.subscription.deleted  → write cancelled/downgraded plan to users table in RDS
```

---

## 10. Questions for Jayant

Please answer all 16 questions. Priority markers indicate what blocks the spec:

🔴 **Blocking** — must be answered before the spec is written  
🟡 **Important** — will significantly affect the spec  
🟢 **Non-blocking** — good to know now, can be finalised later

---

**Architecture**

1. 🔴 Do existing caspr.ai users need to be migrated to the new auth system? If yes, how many users, and do they have associated data (analyses, files) that must transfer?

2. 🔴 Do you have an existing database? Should we use Amazon RDS as an additive non-sensitive data store alongside your existing DB, or do you prefer to align on a single database system?

3. 🔴 Do you have an existing file storage system (S3 bucket or otherwise)? Can the new front-end use it for presigned uploads, or do we set up a separate bucket?

4. 🟡 Is Stripe already integrated in caspr.ai? If yes, we add new products and prices to the existing account rather than creating a new one.

5. 🟡 Does your current architecture support a single `POST /analyses` trigger as described? Or is the trigger mechanism different?

6. 🟡 Is the `layout_ready` event emitted by the Learning Brain after source identification, as described in Endpoint 2? Or does the layout proposal come from a separate process?

7. 🟡 **Real-time hybrid architecture:** The proposal is that the source-stream SSE closes after `layout_ready`, and the generation phase communicates via WebSocket (FastAPI → ElastiCache Redis → WebSocket EKS pods → frontend). Does this work for your backend design, or do you need to keep the SSE connection open for the full generation? This directly affects how we handle long-running Intelligence analyses (up to 24 hours).

8. 🟡 What format does `chart_data` come in? (e.g. Vega-Lite spec, Chart.js config, raw data + chart type string?) The frontend renders the chart — we need the underlying data structure.

9. 🟢 How should enterprise custom templates be referenced — does the frontend send a `template_id`, or is the template resolved server-side from the user's enterprise account record?

10. 🟢 For "What Changed" notifications — when the backend detects significant changes in a previously analysed market, should the frontend be notified via the WebSocket service (FastAPI publishes `what_changed` event to Redis → WebSocket pods fan out) or via a separate push notification endpoint?

---

**Security**

11. 🔴 What is the current deployment architecture for the caspr.ai models? Is the model serving layer already isolated from the public internet on a private VPC subnet? If not, what is the plan and timeline?

12. 🔴 Is rate limiting currently in place at the ALB / FastAPI level — per-user, per-IP? If not, this must be implemented (AWS WAF + application-level) before the API is connected to any production front-end traffic.

13. 🟡 What is the current encryption approach for uploaded files? Is application-layer envelope encryption (per-user KMS keys) feasible for Phase 1, or is this a Phase 2 hardening item?

14. 🟡 Is EU data residency in scope for Phase 1 (required for GDPR compliance for EU users) — meaning a separate EKS cluster and RDS instance in `eu-central-1`? Or is Phase 1 US-only with EU added in Phase 2?

15. 🟢 Is a penetration test planned before production launch? If yes, who is conducting it and on what timeline?

---

**Capacity**

16. 🔴 What is the maximum number of concurrent analyses your current EKS infrastructure can support without degraded performance? This determines free trial rate limits, queue UX design, and whether we need to throttle signups at launch.

---

## 11. What Caspr Can Claim Once This Is Implemented

> *"Your analysis content and uploaded documents are stored exclusively within Caspr's own infrastructure — never in a third-party service. They are never sent to an external AI provider. AES-256 encrypted at rest via AWS KMS. TLS 1.3 in transit. ISO 27001:2022 certified."*

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

*Document: architecture-alignment-aws.md*  
*Owner: Joy Sharma*  
*Version: 1 (AWS deployment) — 2026-05-23*  
*Based on: architecture-alignment-final.md (Vercel + Supabase variant)*
