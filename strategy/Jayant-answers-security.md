# Caspr – Data Privacy & AI Security Disclosure

**Version:** 1.0  
**Effective Date:** May 14, 2026  
**Contact:** security@caspr.ai | tech@caspr.ai

---

## 1. AI Subprocessors & LLM Providers

Caspr operates a **two-tier model architecture**: general-purpose chat models for conversational interfaces, and domain-adapted proprietary models for deep market research intelligence.

### Tier 1 — Chat Interface Models

Used exclusively for conversational interactions (query clarification, report summarization, follow-up Q&A). **Chat session text only** — no uploaded documents or proprietary datasets sent.

| Provider | Model(s) | DPA Status | Data Region |
|---|---|---|---|
| **Anthropic** | Claude (Sonnet / Haiku) | DPA executed ✓ | US |
| **OpenAI** | GPT-4o, GPT-4o mini | DPA executed ✓ | US |
| **Google** | Gemini 1.5 Pro / Flash | DPA executed ✓ | US |

### Tier 2 — Domain-Adapted Research Models

Used for all core market research functions: competitive intelligence, trend extraction, entity recognition, sector classification, and synthesis. These models are **specifically fine-tuned on market research domains** and run within Caspr's controlled infrastructure.

| Model Family | Provider | Specialization | Data Handling |
|---|---|---|---|
| **Qwen** (Alibaba) | Self-hosted on Caspr AWS infrastructure | Industry classification, structured data extraction | Never leaves Caspr infrastructure |
| **GLM** (Zhipu AI) | Self-hosted on Caspr AWS infrastructure | Enterprise knowledge graphs, Chinese market data | Never leaves Caspr infrastructure |
| **Kimi** (Moonshot AI) | Self-hosted on Caspr AWS infrastructure | Long-context document analysis, research synthesis | Never leaves Caspr infrastructure |

> **Important:** Tier 2 models are self-hosted — model weights run on Caspr-owned AWS compute. No external API calls are made. Your research data never leaves Caspr's infrastructure when processed by these models.

### DPA Details

**Tier 1 (Chat providers):**

- **Anthropic DPA:** Commercial API DPA executed. No training on API data. Reference: [Anthropic Privacy Policy](https://www.anthropic.com/privacy)
- **OpenAI DPA:** Zero Data Retention (ZDR) agreement in place. No training on API inputs. Reference: [OpenAI Enterprise Privacy](https://openai.com/enterprise-privacy)
- **Google DPA:** Google Cloud DPA (GDPR-compliant) executed. Data not used for model training. Reference: [Google Cloud DPA](https://cloud.google.com/terms/data-processing-addendum)

**Tier 2 (Self-hosted domain-adapted models):**

- **Qwen / Alibaba:** Model weights licensed and deployed on Caspr's AWS infrastructure. No data transmitted to Alibaba. No DPA required — data never leaves Caspr.
- **GLM / Zhipu AI:** Model weights licensed and self-hosted on Caspr's AWS infrastructure. No data transmitted to Zhipu AI. No DPA required — data never leaves Caspr.
- **Kimi / Moonshot AI:** Model weights licensed and self-hosted on Caspr's AWS infrastructure. No data transmitted to Moonshot AI. No DPA required — data never leaves Caspr.

---

## 2. Does My Data Leave Caspr's Infrastructure?

**Partially — split by model tier with strict data minimization.**

### What goes to Tier 1 (Anthropic / OpenAI / Google)

Chat session content only:

- Your typed query text in the chat interface
- Conversation history within session
- System-generated summaries (not raw source documents)

**Never sent to Tier 1 providers:**

- Uploaded documents or datasets
- Proprietary research datasets
- Full document corpora or embeddings

### What goes to Tier 2 (Qwen / GLM / Kimi)

Full research context, processed entirely within Caspr's AWS infrastructure:

- Uploaded documents and file contents
- Relevant retrieved document chunks (RAG context)
- Structured metadata (industry tags, date filters, entity data)
- Research task inputs requiring deep domain synthesis

**Data does not leave Caspr's infrastructure.** Tier 2 models are self-hosted — inference runs on Caspr-owned compute with no external API calls.

### Transmission Controls (all tiers)

- All external calls transmitted over **TLS 1.2+**
- Logged with provider, timestamp, and token count (no payload logging by default)
- Governed by respective DPAs listed in Section 1

> Enterprise customers on dedicated tenancy can deploy Tier 2 models fully on-premise to eliminate all data egress.

---

## 3. Data Retention

### Default Retention Schedule

| Data Type | Retention Period | Notes |
|---|---|---|
| Research queries & outputs | **90 days** | Configurable per org |
| Uploaded documents | **1 year** from last access | Auto-purged if inactive |
| Account & billing records | **7 years** | Legal/compliance requirement |
| Audit logs | **2 years** | SOC 2 requirement |
| LLM API payloads (third-party) | **0 days** | Zero Data Retention agreements |

### Enterprise Custom Retention

Enterprise plans can configure custom retention windows (minimum 30 days, maximum 7 years) via the Admin Console or by contacting support.

---

## 4. Full Data Deletion

### Trigger & Timeline

| Action | Trigger | Completion Timeline |
|---|---|---|
| **User-initiated deletion** | "Delete My Data" in Account Settings | 30 days |
| **Account termination** | Subscription cancelled or expired | 60 days from termination date |
| **GDPR/CCPA erasure request** | Written request to privacy@caspr.ai | 30 days (legally mandated) |
| **Enterprise offboarding** | Mutual agreement / contract end | 30 days (confirmed in writing) |

### What Gets Deleted

- All queries, outputs, and saved reports
- Uploaded documents and associated embeddings/vectors
- User profiles and workspace configurations
- Backups containing your data (purged on backup rotation cycle, max +14 days)

### Confirmation

Caspr issues a **written deletion certificate** upon completion of any full deletion request. Certificates are signed and timestamped.

> Residual data in encrypted backups is rendered inaccessible immediately upon deletion trigger; physical purge completes within the backup rotation window.

---

## 5. Encryption at Rest

**AES-256 encryption at rest — confirmed.**

Caspr runs on **AWS** infrastructure. All data at rest is encrypted using:

- **AWS S3:** SSE-S3 (AES-256) and optionally SSE-KMS with customer-managed keys (CMK) for Enterprise
- **AWS RDS (PostgreSQL):** AES-256 encryption enabled at instance level
- **Vector database (embeddings):** Encrypted volumes (AES-256)
- **AWS EBS volumes:** AES-256 via AWS KMS

### Encryption in Transit

- TLS 1.2 minimum, TLS 1.3 preferred
- HTTPS enforced on all endpoints (HSTS enabled)
- Internal service-to-service communication encrypted via mutual TLS

### Key Management

- AWS KMS manages encryption keys
- Enterprise customers can bring their own KMS keys (BYOK)
- Key rotation: annual (default), configurable

---

## 6. SOC 2 Compliance

| Milestone | Status | Target Date |
|---|---|---|
| SOC 2 Type I audit initiated | Done | Q2 2026 |
| SOC 2 Type I report issued | Planned | Q3 2026 |
| SOC 2 Type II audit period begins | Planned | Q1 2027 |
| SOC 2 Type II report issued | Planned | Q3 2027 |

**Trust Service Criteria in scope:** Security (CC), Availability (A), Confidentiality (C)

> Enterprise customers requiring SOC 2 Type II before full rollout can request our current security controls documentation and AWS compliance artifacts (AWS SOC 2 reports, ISO 27001 certificates) under NDA.

---

## 7. Third-Party Penetration Testing

| Activity | Status | Details |
|---|---|---|
| Internal vulnerability scanning | Active | Weekly automated scans (AWS Inspector, Snyk) |
| External pentest | **Planned – Q3 2026** | Engaging third-party firm |
| Bug bounty program | Planned – Q4 2026 | Scope TBD |

**Current security controls in lieu of completed pentest:**

- OWASP Top 10 review completed internally
- Dependency scanning (Snyk) on all CI/CD pipelines
- Static analysis (Semgrep) on every PR
- AWS Security Hub enabled with CIS Benchmark compliance checks

> Pentest report (executive summary) will be available to enterprise customers under NDA upon completion.

