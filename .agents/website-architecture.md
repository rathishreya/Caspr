# Caspr.ai — Website Architecture

*Last updated: 2026-05-14*
*Status: Approved — in design*
*Stack: Next.js → GitHub → AWS Amplify · Mobile-first · Designed in Figma*

---

## Page Hierarchy

```
caspr.ai/
│
├── / ................................. Homepage
├── /pricing .......................... Pricing & plans
├── /enterprise ....................... Enterprise page
├── /about ............................ Company / story
│
├── /consulting ....................... Consulting Associates & EMs
├── /strategy ......................... VP Strategy / Chief of Staff
├── /investors ........................ PE / VC / HF / Family Offices
├── /agencies ......................... Agency Strategists
├── /startups ......................... Startup Founders
├── /category-managers ................ Category & Commercial Managers
│
├── /use-cases/ ....................... Job-to-be-done pages
│   ├── /use-cases/market-research
│   ├── /use-cases/business-case
│   ├── /use-cases/due-diligence
│   ├── /use-cases/competitive-analysis
│   ├── /use-cases/investment-thesis
│   └── /use-cases/rfp-response
│
├── /analyses/ ........................ Product education + SEO
│   ├── /analyses/brief ............... $15 · 15 min · 1–3 pages
│   ├── /analyses/study ............... $80 · 1–2 hrs · 100-page PDF/PPTX
│   └── /analyses/intelligence ........ $300 · 24 hrs · multi-model validation
│
├── /samples/ ......................... Sample reports — conversion asset
│   └── /samples/[slug] ............... Individual sample (read-only preview)
│
├── /vs/ .............................. Comparison pages — SEO
│   ├── /vs/chatgpt
│   ├── /vs/perplexity
│   ├── /vs/consulting-firms
│   └── /vs/statista
│
├── /blog ............................. Blog index
│   └── /blog/[slug] ................. Individual posts
│
├── /security ......................... Information security — product page, converts to /pricing
└── /privacy · /terms · /gdpr ......... Legal (minimal design)
```

Total pages at launch: 8 (Phase 1) → 23 (Phase 2) → 33 (Phase 3)

---

## Navigation

### Header

```
[Caspr.]   Solutions ↓   Use Cases ↓   Analyses ↓   Pricing   Blog   [Start Free →]
```

| Dropdown | Links |
|---|---|
| **Solutions** | Consulting · Strategy · Investors · Agencies · Startups · Category Managers |
| **Use Cases** | Market Research · Business Case · Due Diligence · Competitive Analysis · Investment Thesis · RFP Response |
| **Analyses** | Brief ($15 · 15 min) · Study ($80 · 1–2 hrs) · Intelligence ($300 · 24 hrs) |

**CTA button:** `Start Free →` — red (#E8453C), rightmost position, always visible. Links to caspr.ai signup.

**Mobile header:** Hamburger menu. Sections expand as accordions in a full-screen drawer. CTA pinned to bottom of drawer.

### Footer

| Product | Solutions | Use Cases | Company | Trust & Legal |
|---|---|---|---|---|
| Pricing | Consulting | Market Research | About | Security |
| Enterprise | Strategy | Business Case | Blog | Privacy |
| Sample Reports | Investors | Due Diligence | Careers | Terms |
| Brief | Agencies | Competitive Analysis | Contact | GDPR |
| Study | Startups | Investment Thesis | | |
| Intelligence | Category Managers | RFP Response | | |

**Footer note:** Security appears first in the Trust & Legal column — it is a product page, not a legal document. Linking to it from the footer signals trust without requiring the visitor to hunt for it.

---

## SEO Intent by Page

| Page | Primary keyword | Secondary keywords | Search intent |
|---|---|---|---|
| / | analytical AI for business | AI business research tool, AI market research | Branded + category |
| /consulting | AI for consultants | market analysis tool consulting, desk analysis AI | ICP awareness |
| /strategy | AI for strategy teams | business analysis VP strategy, strategic options paper AI | ICP awareness |
| /investors | AI due diligence tool | investment analysis AI PE VC, sector analysis AI | ICP awareness |
| /agencies | AI for marketing agencies | pitch analysis tool AI, agency competitive analysis | ICP awareness |
| /startups | AI market sizing tool | startup market analysis, TAM SAM SOM analysis AI | ICP awareness |
| /category-managers | category intelligence tool | retail market analysis AI, category review analysis | ICP awareness |
| /use-cases/market-research | AI market research report | automated market research, AI industry analysis | JTBD |
| /use-cases/business-case | AI business case generator | business case template AI, business case report | JTBD |
| /use-cases/due-diligence | AI due diligence tool | automated due diligence report, M&A research AI | JTBD |
| /use-cases/competitive-analysis | AI competitive analysis | competitive landscape report generator | JTBD |
| /use-cases/investment-thesis | investment thesis AI | sector analysis report AI, investment memo AI | JTBD |
| /use-cases/rfp-response | AI RFP response generator | RFP research automation, proposal research AI | JTBD |
| /analyses/brief | quick market research report | 15 minute market analysis AI | Product education |
| /analyses/study | AI 100 page business report | in-depth market research report AI | Product education |
| /analyses/intelligence | enterprise business intelligence AI | due diligence report AI 24 hours | Product education |
| /vs/chatgpt | Caspr vs ChatGPT research | ChatGPT for business analysis alternative | Comparison |
| /vs/consulting-firms | AI alternative to consulting firms | McKinsey alternative AI, consulting research AI | Comparison |
| /vs/perplexity | Caspr vs Perplexity business | Perplexity for market research alternative | Comparison |
| /vs/statista | Caspr vs Statista | Ibisworld alternative AI, market data AI | Comparison |
| /blog/[slug] | Long-tail per post | Topic cluster terms per category | Educational |

---

## Conversion Architecture

One primary CTA and one secondary on every page. No exceptions.

| Page | Primary CTA | Secondary CTA |
|---|---|---|
| Homepage | Start free — first $100 on Caspr | See a sample report |
| /consulting · /strategy · /investors · /agencies · /startups · /category-managers | Run your first [role] analysis free | See a sample |
| Use case pages | Try this analysis free | See how it works |
| Analyses pages | Run a [Brief/Study/Intelligence] free | See sample output |
| Pricing | Start free — no credit card | Talk to us (Enterprise) |
| Enterprise | Book a call | See pricing |
| Sample reports | Run this analysis on your topic | Start free |
| Comparison pages | Start free — see the difference | See a sample |
| Blog posts | [Contextual CTA matching post topic] | — |
| /security | Start free — your data stays yours | See pricing |

---

## Internal Linking Plan

| From | Links to | Rationale |
|---|---|---|
| Homepage | /consulting · /strategy · /investors · /agencies · /startups · /category-managers | "For your role" section — ICP self-selection |
| Homepage | /pricing | Pricing section + CTA |
| Homepage | /samples | "See an example" secondary CTA |
| Each ICP page | 2 relevant use case pages | Deepens engagement, adds keyword coverage |
| Each ICP page | 1 analysis type page | Brief vs Study vs Intelligence — product education |
| Each ICP page | /pricing | Conversion path |
| Use case pages | 1–2 ICP pages | Reverse path — use case discovers ICP page |
| Use case pages | Relevant analysis page | Brief for quick, Study for deep, Intelligence for enterprise |
| /pricing | /enterprise | Upsell path |
| /pricing | Top 3 ICP pages | "Built for your role" contextual links |
| /analyses/[type] | /pricing | Primary conversion path from product education |
| /analyses/[type] | Relevant ICP pages | Role-based relevance |
| /vs/[competitor] | /pricing | Highest-intent comparison traffic → direct to pricing |
| /vs/[competitor] | /samples | "See the output before you decide" |
| /samples/[slug] | "Run this on your topic" → signup | Highest-converting sample CTA |
| Blog posts | Relevant ICP or use case page | Contextual inline CTA mid-post |
| Blog posts | /blog | Navigation back to index |

| Each ICP page | /security (inline micro-link) | Security signal at the trust moment — near CTA or data upload mention |
| /enterprise | /security | Enterprise buyers require security review; link near the "Book a call" CTA |
| /pricing | /security | Near "Start free" CTA — answers the unstated data concern |
| /use-cases/due-diligence | /security | Data room upload workflow makes security objection live |
| /security | /pricing | Primary CTA — converts trust concern into purchase decision |

No orphan pages. Every page receives minimum 2 inbound internal links.

---

## Build Phases

### Phase 1 — Launch (2 weeks)
Must ship before email sequences go out.

| Page | Priority reason |
|---|---|
| Homepage (`/`) | All channels lead here |
| Pricing (`/pricing`) | Email sequences reference plans |
| Enterprise (`/enterprise`) | B2B expansion path |
| `/consulting` | Highest signup volume ICP |
| `/strategy` | Highest revenue per user |
| `/investors` | Highest revenue per user |
| `/security` | Trust conversion asset — linked from every ICP page; redirects to /pricing |
| `/privacy` | Legal requirement |
| `/terms` | Legal requirement |

### Phase 2 — Sprint 1–2 (4–6 weeks)
- `/agencies` · `/startups` · `/category-managers`
- `/use-cases/market-research` · `/use-cases/business-case` · `/use-cases/due-diligence`
- `/analyses/brief` · `/analyses/study` · `/analyses/intelligence`
- `/samples/` + 3 sample report pages
- `/about`
- `/blog` index + first 5 posts

### Phase 3 — Sprint 3+ (ongoing)
- Remaining use case pages (competitive analysis, investment thesis, RFP)
- All 4 comparison pages (`/vs/`)
- Programmatic SEO templates (blog at scale)
- Additional sample reports

---

## Page Templates Required

Three templates cover all 32 pages:

| Template | Used by | Key sections |
|---|---|---|
| **Homepage** | `/` only | Hero · Category claim · ICP selector · How it works · Output showcase · Testimonials · Pricing preview · Enterprise strip · Final CTA |
| **ICP/Use Case** | `/for/[icp]` · `/use-cases/[slug]` · `/analyses/[type]` | ICP-specific hero · Pain points · How Caspr solves it · Output example · Proof · Pricing strip · CTA |
| **Comparison** | `/vs/[competitor]` | Honest comparison table · Where Caspr wins · Where it doesn't · Testimonial · CTA |
| **Blog post** | `/blog/[slug]` | Title · Byline · Body · Contextual inline CTA · Related posts · Bottom CTA |
| **Security** | `/security` | Certification strip · What we protect · How it works · FAQ · CTA to /pricing |
| **Legal** | `/privacy` · `/terms` · `/gdpr` | Structured text, minimal design |

---

## Security Integration by Page

Security signals are subtle, contextual, and linked to `/security` on every occurrence. Four levels of integration — apply the appropriate level per page.

| Level | What it is | Placement |
|---|---|---|
| **L1 — Trust strip** | One-line certification bar: *"ISO 27001:2022 · GDPR Compliant · [Your data never trains our models →](/security)"* | Homepage (above footer) · /enterprise (below hero) |
| **L2 — CTA micro-copy** | Single line below the primary CTA: *"ISO 27001:2022 certified. [Your data stays yours →](/security)"* | All ICP pages · /pricing |
| **L3 — Contextual inline** | 1–2 sentences woven into body copy where data sensitivity is mentioned | /use-cases/due-diligence · /investors · /enterprise · /consulting · /strategy |
| **L4 — FAQ answer** | One FAQ entry: "Is my data secure?" → 2-sentence answer + link to /security | /pricing · /enterprise · ICP pages (optional) |

### Per-Page Security Integration

| Page | Level | Copy |
|---|---|---|
| Homepage | L1 | Trust strip above footer: *"ISO 27001:2022 · GDPR Compliant · [Your data never trains our models →](/security)"* |
| /enterprise | L1 + L4 | Trust strip below hero. FAQ entry: "Enterprise security requirements?" + link to /security |
| /pricing | L2 + L4 | Below "Start free" CTA: *"ISO 27001:2022 certified. [Your data stays yours →](/security)"* · FAQ: "Is my data secure?" |
| /consulting | L2 | Below CTA: *"Client data never leaves your account. [ISO 27001:2022 certified →](/security)"* |
| /strategy | L2 | Below CTA: *"Your strategic data never trains our models. [ISO 27001:2022 certified →](/security)"* |
| /investors | L3 | In body, near data room upload mention: *"Every data room upload is encrypted and stays in your account. [ISO 27001:2022 certified →](/security)"* |
| /agencies | L2 | Below CTA: *"Client briefs stay in your account. [ISO 27001:2022 certified →](/security)"* |
| /startups | — | No security integration — this ICP's primary concern is speed and fundraising, not data sensitivity |
| /category-managers | — | No security integration — category data is generally not confidential at this level |
| /use-cases/due-diligence | L3 | Near data room upload feature description: *"Your uploaded documents are encrypted at rest and in transit. They are never used to train any model. [Full security posture →](/security)"* |
| /use-cases/market-research | — | Not required — no sensitive data implication |
| /use-cases/business-case | — | Optional L2 if competitive intel angle is present |
| /security | Full page | See /security page spec below |

### /security Page Spec

This is a product page, not a legal document. Design language matches the rest of the site — not walls of text.

**Sections (in order):**
1. **Headline:** *"Your analysis is yours. Full stop."*
2. **Certification strip:** ISO 27001:2022 badge · GDPR badge (linked to certificate)
3. **Four claims (icons + 1-line each):**
   - *"Your data never trains any model."*
   - *"Every analysis encrypted at rest and in transit."*
   - *"Access logs on every event."*
   - *"ISO 27001:2022 independently audited — not self-reported."*
4. **FAQ (3–5 entries):** What certifications? · Is uploaded data used for training? · Where is data stored? · How long is data retained? · Who are your subprocessors?
5. **CTA:** *"Secure analysis starts free."* → /pricing

**Note:** FAQ answers pending Jayant confirmation on: subprocessors, data retention period, full deletion on cancellation. Placeholder answers approved; finalize before /security page ships.

---

## URL Conventions

- Hyphens, not underscores
- All lowercase
- No trailing slash
- No dates in URLs
- Slugs reflect the keyword, not internal naming

Example: `/for/consulting` not `/icp/icp-1-consulting-associates`

---

## Redirect Plan (from current site)

| Old URL pattern | New URL |
|---|---|
| `/` (current) | `/` (new homepage) |
| `/pricing` (if exists) | `/pricing` |
| Any `/blog/[post]` | Preserve slug, redirect if structure changes |
| All other current URLs | Audit after launch — 301 to nearest equivalent |
