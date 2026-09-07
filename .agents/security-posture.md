# Caspr — Information Security Posture

*Last updated: 2026-05-14*
*Status: Complete — all items confirmed by Jayant (see jayant-answers-security.md)*
*Owner: Joy (Marketing) · Jayant (Engineering)*
*Source: jayant-answers-security.md v1.0, 2026-05-14*
*Cross-references: brand-guidelines.md §Security Claims · website-architecture.md §Security Integration · icp-copy.md ICPs 1–3*

---

## Purpose

This document is the single source of truth for Caspr's information security posture. It drives:

1. The `/security` page content
2. Security micro-copy on ICP and product pages
3. Enterprise sales conversations
4. Investor due diligence responses
5. Press and PR accuracy checks

All claims in this document are confirmed by Jayant and cleared for marketing use unless explicitly marked with a caution note.

---

## 1. Certifications

| Certification | Status | Notes |
|---|---|---|
| **ISO 27001:2022** | ✓ Active | Current revision. Independently audited. Certificate available on request (enterprise: under NDA). |
| **GDPR** | ✓ Compliant | All user data, EU/EEA scope. DPAs executed with all Tier 1 providers. |
| **SOC 2 Type I** | ✓ Audit initiated Q2 2026 | Report expected Q3 2026. AWS compliance artifacts available under NDA in the interim. |
| **SOC 2 Type II** | Planned Q3 2027 | Audit period begins Q1 2027. |

**Marketing note on SOC 2:** We can now say "SOC 2 Type I audit in progress." Do not say "SOC 2 certified" until the Type I report is issued (Q3 2026 target). For enterprise prospects requiring SOC 2 before contract: "We are ISO 27001:2022 certified and SOC 2 Type I audit is underway — we can share AWS SOC 2 reports and our current security controls documentation under NDA."

---

## 2. Model Architecture & Data Flow

Caspr uses a two-tier model architecture. The data flow for each tier determines what, if anything, reaches an external provider.

### Tier 1 — Chat interface (Anthropic / OpenAI / Google)

Used for: query clarification, report summarisation, follow-up Q&A in the conversational interface.

**What is sent:** Chat session text only — typed query text, conversation history, system-generated summaries.

**What is never sent:** Uploaded documents, proprietary datasets, research corpora, embeddings.

| Provider | Model(s) | DPA | Training |
|---|---|---|---|
| Anthropic | Claude Sonnet / Haiku | ✓ Executed | Never. Commercial API DPA confirmed. |
| OpenAI | GPT-4o, GPT-4o mini | ✓ Zero Data Retention (ZDR) | Never. ZDR agreement in place. |
| Google | Gemini 1.5 Pro / Flash | ✓ Google Cloud GDPR DPA | Never. Data not used for model training. |

All Tier 1 transmissions are over TLS 1.2+. LLM API payloads are retained for **0 days** (ZDR agreements).

> ### ⚠ Updated 2026-09-01 — an intermediation layer now sits in front of Tier 1
>
> **Confirmed by Joy, 2026-09-01. This supersedes the "what is sent" line above, which describes the
> pre-2026-09 architecture and must not be quoted as current.**
>
> **A layer now sits between the user's conversation and anything passed to a Tier 1 model. The *context*
> passes through. The user's own words do not.** The request that reaches an external provider is
> reformulated, and **cannot be connected back to the user, their organisation, or the subject of the
> request** — a consulting firm researching an acquisition target is not identifiable as either the asker or
> the subject at any point outside Caspr's own infrastructure.
>
> **What changes, in one line:** the old claim was *"only chat text leaves, and it is never trained on."*
> The claim now available is stronger — ***what leaves cannot be traced to you.***
>
> **Two things this note does not yet do, and both are open:**
>
> 1. **§8 Approved Marketing Claims has not been rewritten** against this. Until it is, §8's short-form and
>    long-form claims describe the older architecture. **Do not ship §8 copy verbatim** on this subject.
> 2. **The boundary options are undocumented.** Self / team / organisation / country-level residency were
>    raised on 2026-09-01 as configurable per client. §7 records BYOK, custom retention and on-premise Tier 2
>    with zero data egress, but **not country-level data residency** — which is therefore not yet a
>    publishable claim.
>
> **Why this note exists rather than an edit to the table above:** the table is cited by the `/security` page,
> enterprise questionnaires and investor diligence. Overwriting it would erase the fact that the architecture
> changed, and *when* — which is the thing a diligence reader most needs to see.

### Tier 2 — Research models (self-hosted on Caspr's AWS infrastructure)

Used for: all core market research functions — competitive intelligence, trend extraction, entity recognition, sector classification, synthesis, long-context document analysis.

**What is processed:** Uploaded documents, file contents, retrieved document chunks (RAG context), structured metadata, research task inputs.

**Data flow:** Stays entirely within Caspr's AWS infrastructure. No external API calls. Model weights are licensed and run on Caspr-owned compute.

| Model Family | Specialisation | Infrastructure |
|---|---|---|
| Qwen (Alibaba) | Industry classification, structured data extraction | Self-hosted on Caspr AWS |
| GLM (Zhipu AI) | Enterprise knowledge graphs | Self-hosted on Caspr AWS |
| Kimi (Moonshot AI) | Long-context document analysis, research synthesis | Self-hosted on Caspr AWS |

**Marketing and public copy note:** Do not name Tier 2 model providers in public-facing marketing. These are Chinese AI companies; naming them in above-the-fold copy creates unnecessary friction with enterprise security reviewers even though the data never leaves Caspr's infrastructure. The correct public claim is: *"Your uploaded documents are processed entirely within Caspr's infrastructure. They are never sent to any external AI provider."* Full provider detail is disclosed in enterprise procurement documentation.

---

## 3. Encryption

| Layer | Standard | Details |
|---|---|---|
| **Data at rest — S3** | AES-256 | SSE-S3 default; SSE-KMS with customer-managed keys (CMK) for Enterprise |
| **Data at rest — RDS (PostgreSQL)** | AES-256 | Enabled at instance level |
| **Data at rest — vector database** | AES-256 | Encrypted volumes |
| **Data at rest — EBS volumes** | AES-256 | Via AWS KMS |
| **Data in transit** | TLS 1.2+ (1.3 preferred) | HTTPS enforced, HSTS enabled |
| **Internal service-to-service** | Mutual TLS | All internal traffic |
| **Key management** | AWS KMS | Annual rotation default; BYOK available for Enterprise |

**Copy-ready claim:** *"AES-256 encrypted at rest. TLS 1.3 in transit. Customer-managed encryption keys available on Enterprise."*

---

## 4. Data Retention

| Data Type | Retention | Notes |
|---|---|---|
| Research queries & outputs | **90 days** | Configurable per org (Enterprise Admin Console) |
| Uploaded documents | **1 year** from last access | Auto-purged if inactive |
| Account & billing records | **7 years** | Legal/compliance requirement |
| Audit logs | **2 years** | SOC 2 requirement |
| LLM API payloads (Tier 1) | **0 days** | Zero Data Retention agreements with all Tier 1 providers |

Enterprise customers can configure custom retention windows (30-day minimum, 7-year maximum) via the Admin Console or support.

---

## 5. Data Deletion

| Trigger | Completion timeline |
|---|---|
| User-initiated deletion ("Delete My Data" in Account Settings) | 30 days |
| Account termination (subscription cancelled or expired) | 60 days from termination |
| GDPR / CCPA erasure request (written to privacy@caspr.ai) | 30 days (legally mandated) |
| Enterprise offboarding (mutual agreement / contract end) | 30 days, confirmed in writing |

**What gets deleted:** All queries, outputs, saved reports, uploaded documents, associated embeddings/vectors, user profiles, workspace configurations, and backups containing user data (purged on backup rotation cycle, max +14 days).

**Deletion certificate:** Caspr issues a signed, timestamped written deletion certificate upon completion of any full deletion request.

**Residual data note:** Residual data in encrypted backups is rendered inaccessible immediately on deletion trigger; physical purge completes within the backup rotation window.

---

## 6. Access Logging & Penetration Testing

**Access logging:** Audit logs maintained for 2 years (SOC 2 requirement). All external LLM API calls logged with provider, timestamp, and token count (no payload logging by default).

**Automated security scanning:**
- Weekly automated vulnerability scanning (AWS Inspector, Snyk)
- Dependency scanning (Snyk) on all CI/CD pipelines
- Static analysis (Semgrep) on every PR
- AWS Security Hub with CIS Benchmark compliance checks
- OWASP Top 10 review completed internally

**External penetration test:** Planned Q3 2026. Executive summary will be available to enterprise customers under NDA on completion.

**Bug bounty programme:** Planned Q4 2026.

---

## 7. Enterprise Capabilities

| Feature | Availability |
|---|---|
| Customer-managed encryption keys (BYOK) | ✓ Enterprise |
| Custom data retention windows | ✓ Enterprise (Admin Console) |
| On-premise Tier 2 model deployment (zero data egress) | ✓ Enterprise (dedicated tenancy) |
| SOC 2 / ISO 27001 documentation under NDA | ✓ Available now |
| Security questionnaire completion | ✓ CTO-led |
| Deletion certificate | ✓ All plans |

---

## 8. Approved Marketing Claims (Ready to Use)

All claims below are confirmed by Jayant. Use verbatim — do not paraphrase in ways that weaken specificity.

### Short-form (inline, linked to /security)
- *"ISO 27001:2022 certified."*
- *"GDPR compliant."*
- *"Your data never trains our models."*
- *"Your uploaded documents never reach an external AI provider."*
- *"AES-256 encrypted at rest. TLS 1.3 in transit."*
- *"SOC 2 Type I audit in progress."*

### Medium-form (trust strip, CTA micro-copy)
- *"ISO 27001:2022 · GDPR Compliant · Your data never trains our models."*
- *"Client data never leaves your account. ISO 27001:2022 certified."*
- *"Your strategic data never trains our models. ISO 27001:2022 certified."*
- *"Every data room upload is processed within Caspr's infrastructure. Never sent to an external AI provider."*

### Long-form (/security page, enterprise proposals)
> *"Caspr is ISO 27001:2022 certified and GDPR compliant. Your uploaded documents are processed entirely within Caspr's own infrastructure — they are never sent to any external AI provider. Chat session text that reaches third-party providers (Anthropic, OpenAI, Google) is governed by Zero Data Retention agreements — it is not retained or used for training. Data is AES-256 encrypted at rest and TLS 1.3 in transit. ISO 27001:2022 certification means these controls are independently audited, not self-reported. SOC 2 Type I audit is currently in progress."*

---

## 9. /security Page — Final FAQ

All answers confirmed. Ready to publish. Notes where exact wording needs care.

**Q: What security certifications does Caspr hold?**
> *Caspr is ISO 27001:2022 certified and GDPR compliant. ISO 27001:2022 is independently audited — not self-reported. SOC 2 Type I audit is currently in progress; report expected Q3 2026. Certificates and compliance documentation are available to enterprise customers on request.*

**Q: Is my uploaded data used to train your AI models?**
> *No. Your uploaded data is never used to train any model. This applies to all tiers of Caspr's architecture. Your data exists to produce your analysis and nothing else.*

**Q: Does my data leave Caspr's infrastructure?**
> *Your uploaded documents are processed entirely within Caspr's infrastructure. They are never sent to an external AI provider. Chat session text (your typed queries and conversation history) may be processed by Anthropic, OpenAI, or Google — all under Zero Data Retention agreements, meaning it is not stored or used for training. Your documents and their contents remain in Caspr's infrastructure throughout.*

**Q: Who are your AI providers?**
> *Chat functionality uses Anthropic (Claude), OpenAI (GPT-4o), and Google (Gemini) — all under executed Data Processing Agreements with Zero Data Retention on API inputs. Core research processing runs on models self-hosted within Caspr's AWS infrastructure; those models do not make external API calls.*

**Q: How long is my data retained?**
> *Research queries and outputs: 90 days. Uploaded documents: 1 year from last access. LLM API payloads (chat text sent to third-party providers): 0 days — Zero Data Retention agreements. Billing records: 7 years (legal requirement). Enterprise customers can configure custom retention windows via the Admin Console.*

**Q: What happens to my data when I cancel?**
> *All your data — reports, uploaded documents, queries, vectors, and backups — is deleted within 60 days of account termination. You can also request immediate deletion from Account Settings; that completes within 30 days. Caspr issues a signed, timestamped deletion certificate on completion.*

**Q: How is my data encrypted?**
> *AES-256 at rest across all storage layers (databases, file storage, vector databases). TLS 1.3 in transit. All internal service-to-service communication uses mutual TLS. Enterprise customers can bring their own KMS encryption keys (BYOK).*

**Q: Do you have SOC 2?**
> *SOC 2 Type I audit is currently in progress (initiated Q2 2026; report expected Q3 2026). We are ISO 27001:2022 certified — independently audited and broader in scope. Enterprise customers requiring SOC 2 can request our AWS SOC 2 compliance artifacts and current security controls documentation under NDA.*

---

## 10. Enterprise Sales — Security Objection Handling

| Objection | Response |
|---|---|
| "Do you have SOC 2?" | "SOC 2 Type I audit is currently in progress — report expected Q3 2026. We are ISO 27001:2022 certified in the meantime. We can share our AWS SOC 2 artifacts and full security controls documentation under NDA." |
| "Which LLMs process our data?" | "Your uploaded documents are processed by models that run entirely within Caspr's own AWS infrastructure — no external API calls. Chat text goes to Anthropic, OpenAI, and Google under Zero Data Retention agreements. Full provider documentation available for procurement review." |
| "Is our uploaded data used for training?" | "No. Explicit design decision. Your uploaded data is processed only to produce your analysis. Zero Data Retention agreements cover all third-party providers." |
| "Where is data stored?" | "AWS, AES-256 at rest across all storage layers, TLS 1.3 in transit. Enterprise customers can bring their own KMS keys." |
| "What is your data retention policy?" | "90 days for research outputs (configurable), 1 year for uploaded documents, 0 days for LLM API payloads. Full schedule in our security documentation." |
| "Can we request full deletion?" | "Yes. User-initiated deletion completes in 30 days. We issue a signed deletion certificate on completion." |
| "Can we run a security review?" | "Yes. ISO 27001:2022 certificate, security questionnaire completed by our CTO, and AWS compliance artifacts — all available under NDA." |
| "Do you do penetration testing?" | "External pentest is planned Q3 2026. Current controls include weekly automated scanning (AWS Inspector, Snyk), static analysis on every PR, and AWS Security Hub CIS Benchmark checks. Pentest executive summary will be available under NDA on completion." |

---

## 11. Security Contacts

- **General security enquiries:** security@caspr.ai
- **Technical / engineering:** tech@caspr.ai
- **GDPR / CCPA erasure requests:** privacy@caspr.ai
