# Caspr: Product Features & Roadmap

*Compiled from: brand guidelines, product marketing context, pricing model, live product walkthrough*
*Last updated: 2026-05-09*

---

## What Caspr Is

**Category:** Analytical AI — purpose-built for business analysis, not conversation.

**Tagline:** Caspr means Business.

A user enters a single business prompt. Caspr interrogates it with clarifying questions, structures the research methodology, and returns a boardroom-ready report — with data, charts, citations, and structured narrative — in under 15 minutes.

Two proprietary systems:
- **Assessment** — applies rigorous research methodology; reasons through data, structures conclusions, does not merely retrieve
- **Sourcing** — real-time live data feeds; 25M+ curated, credible sources reflecting today's reality

Output is defensible in front of a board, a client, or an investor. Every insight cited.

---

## Current Live Features

### Core Workflow

1. **Single-line prompt** — user describes purpose, analysis type, topic, and industry (30 seconds)
2. **Proposed report layout** — Caspr returns a structured table of contents
3. **Clarifying questions** — 5 structured questions to refine scope, audience, depth, and requirements
4. **Revised layout** — Caspr incorporates user input; user QAs final structure
5. **Analysis runs** — 10–20 minutes in background; user can work on other things
6. **HTML preview** — full report viewable in-browser; user can review, edit sections, and remove content
7. **Generate Output** — user selects output format(s); PDF and PPTX both available

**Total user interaction time: 2–2.5 minutes.**

### Report Management

- **Reports library** — searchable, filterable list of all reports
- **Status tracking** — Draft / Analysis Completed / Output Generated
- **Versioning** — multiple output versions per report (V1, V2 etc.)
- **Reference file upload** — users can upload proprietary data (PDF, DOCX, XLSX, CSV, and more; max 25MB per file) for Caspr to incorporate into the analysis
- **Report query** — ask questions against a completed report
- **Re-analysis** — refine and regenerate sections

### Output Formats

- **PDF** — boardroom-ready, branded ("Published by: Caspr Research")
- **PPTX** — fully editable; available after HTML report is generated
- Output format selection occurs at Generate Output stage
- Output formats and language options are tier-gated features (roadmap)

### Data & Sources

- 1,057,368+ curated sources (live counter; growing)
- Sources: government databases, academic papers, news feeds, industry documents — not web-scraped
- Private data upload available on Plus and above (proprietary data integrated into analysis)
- Premium data sources (Bloomberg, PitchBook, specialist databases) — available as opt-in add-ons (roadmap)

### Home Dashboard

- Caspr source counter (live, animated)
- My Reports summary with recent activity
- Tip carousel (product education)

---

## Analysis Types (Current & Planned)

| Type | Price | Description | Time |
|---|---|---|---|
| **Brief** (planned) | $15 | 1–3 page structured document. Market Brief, Company Brief, Competitive Brief, Profile Brief. Powered by sourcing stage. | ~15 min |
| **Study** (current equivalent) | $80 | Full assessment stage engagement. Deep methodology, multi-source synthesis. Boardroom-ready PDF or PPTX. | 1–2 hrs |
| **Intelligence** (planned) | $300 in-budget / $399 à la carte | Multiple analytical models validating each other. Highest rigour. Due diligence, M&A, board-level strategy. | Up to 24 hrs |
| **Premium Data Add-on** (planned) | $20–60 per source | Optional expensive third-party data (Bloomberg, PitchBook etc.) surfaced to user before analysis starts. | — |

*Note: Brief and Intelligence are designed and priced but not yet differentiated in the live product. Current product runs a single analysis type equivalent to Study.*

---

## Pricing Model

### Current Live Model (Token-Based)

| Plan | Price | Tokens | Reports |
|---|---|---|---|
| **Free** | $0 | 25,000 one-time | ~2 reports |
| **Plus** | $50/month (annual) | 25,000/month | 12–15/year |
| **Pro** | $200/month (annual) | 150,000/month | 72–75/year |
| **Enterprise** | Custom | Custom | Custom |

Each standard report: ~12,500 tokens. Token usage varies by topic complexity, re-analysis, output formats.

Feature gates:
- **Plus+:** Private data upload, Experts Access
- **Enterprise:** Shared wallet, Data sovereignty, Information security, Prompts masking

### Research Budget Model (Designed — Pending Implementation)

Replaces the token model. One number. One charge. No line items.

**Core mechanics:**
- User authorises a monthly Research Budget (minimum $200)
- 7% platform fee (internal — never user-facing)
- 93% available as Analysis Balance for running reports
- Delta recharge: only what was consumed is recharged each month — unused balance carries forward automatically
- No overpayment for idle months (minimum charge = platform fee only = $14/month)

**Milestones (unlock features, not separate plans):**

| Milestone | Budget | Features |
|---|---|---|
| **Professional** | $200+/month | Brief, Study; solo use; Monthly Brief; Caspr Signals (1 topic) |
| **Business** | $600+/month | All Professional + Intelligence; data upload; output editing; Caspr Signals (3 topics) |
| **Enterprise** | $1,800+/month | All Business + team seats (pooled); SSO; API; priority support |

**Analysis prices (Research Budget model):**
- Brief: $15 · Study: $80 · Intelligence: $300 (in-budget) / $399 (à la carte)
- Premium Data Add-on: $20–60 (opt-in, shown before analysis starts)

**Free Trial:** $100 gifted Research Budget · no credit card · 90-day expiry · platform fee waived

*Status: fully specified in pricing-model.md. Pending implementation.*

---

## Retention Features (Designed — Pending Implementation)

### Caspr Monthly Brief
- Auto-generated Brief on a user-chosen standing topic, delivered on the 1st of each month
- Delivered by email as PDF + in-dashboard link
- Ends with 3 suggested follow-up Study prompts
- Cost absorbed by Caspr (not charged to analysis balance)
- Available: all active accounts including free trial

### Caspr Signals
- Weekly email digest of 3–5 developments on watched topics
- Powered by sourcing stage (lightweight data pull, not full analysis)
- Each item links directly to a pre-populated Study prompt in the dashboard
- Limits: 1 topic (Professional), 3 topics (Business+)
- Cost absorbed by Caspr

---

## Product Roadmap (Next 90 Days)

### 1. File Drawer — New Information Architecture

The current reports list (flat chronological list) is replaced by a structured file drawer organised by use case.

**What users see on login:**
- Use case folders (Market Research, Business Case, Due Diligence, Competitor Analysis, RFP, etc.)
- Sample reports inside each folder — introduces users to the capability before they run their first analysis
- Inside each folder: Scans (Brief), Studies, and Intelligence reports
- Each analysis: multiple output formats (PDF, PPTX, etc.) and versions

**Why it matters:** Replaces a history list with a capability showcase. Converts a filing cabinet into an onboarding experience.

### 2. Ask Caspr — Trust-Based Citation Model

Replaces superscript citation numbers with **pulsating red dots** on every claim.

**User interaction:**
- Click any red dot → chat panel opens alongside the report
- Caspr explains the claim: which sources support it, what the analysis concluded, and why
- Users ask follow-up questions about specific claims directly in context

**Strategic intent:** Move users from "I need to verify every source" to "I trust Caspr's analysis." The end state: Caspr cited as a source the way Bloomberg or Gartner is cited — not a tool, a reference.

**Why it matters:** Directly addresses the #1 objection ("Can I trust AI-generated data?") through interaction, not just assertion.

### 3. Research Budget Pricing Model — In-Product Implementation

Replace the token model with the Research Budget mechanic.

**In-product changes needed:**
- Wallet redesign: show Research Budget, Analysis Balance, platform fee, recharge schedule
- Analysis cost transparency: show cost before starting (Brief: $15 / Study: $80 / Intelligence: $300)
- Premium data source approval: before analysis starts, surface which premium sources are available and at what cost — user opts in or skips
- Free trial: show $100 gifted balance on first login with expiry countdown
- Milestone unlock: show current milestone, next milestone, features that unlock on upgrade

---

## Use Cases by Category

### Positioning-Only (No Product Enhancement Required)
These use cases work today with current product capabilities:

| Use Case | User | What Caspr Produces |
|---|---|---|
| Market Research | Strategy teams, agencies, category managers | Market sizing, competitive landscape, trend analysis |
| Business Case | Consultants, founders, strategy leads | Consulting-grade business case with financial framing |
| RFP / Proposal | Business development, corporate dev | Structured proposal with market context and supporting data |
| Industry Briefing | C-suite, investors | Sector primers, news-informed landscape |
| Investment Thesis | PE, VC, family offices | Market backdrop, sector dynamics, deal rationale |

### Requires Product Enhancement (sourcing stage Data Expansion)
These use cases need company-specific data integration:

| Use Case | Enhancement Needed | Near-Term Path |
|---|---|---|
| Due Diligence | Company-specific financial and operational data | **Now available via data upload (Plus+):** "Upload the data room. Caspr provides the market intelligence around it. The investment memo writes itself." |
| Competitor Analysis | Company-specific product, pricing, and org data | Private data upload (current) + future expansion |
| Client Pitch Research | Client-specific context | Private data upload (current) |

*The due diligence workflow is live today on Plus and above. The positioning for it does not yet exist — this is a near-term marketing priority.*

---

## ICP Priority Order

1. Consulting firms — speed up desk research, reduce junior analyst hours
2. Strategy teams / C-suite — on-demand intelligence without retaining a firm
3. Investors (PE, VC, Hedge Funds, Family Offices) — deal sourcing, due diligence
4. Category managers (retail, eCommerce) — market sizing, competitive landscape
5. Marketing & ad agencies — client deep-dives, pitch research
6. Graduate researchers (Masters, PhD) — market context, literature synthesis
7. Corporate Dev / M&A teams — target identification, market mapping
8. Startups (fundraising) — investor-ready business cases, market sizing

**Current paid users:** Primary research firm using Caspr for the secondary research component of client deliverables. This is an agency-as-customer model worth developing further.
