# Caspr Website — Build Brief

*Created: 2026-05-14*
*Purpose: Reference for the website design/build session. Self-contained — all decisions confirmed.*
*Source files (do not edit these directly): `.agents/website-architecture.md` · `.agents/brand-guidelines.md` · `.agents/icp-copy.md` · `.agents/security-posture.md` · `.agents/academic-programme.md`*

---

## 1. Stack & Constraints

- **Framework:** Next.js
- **Deploy:** GitHub → AWS Amplify
- **Design tool:** Figma
- **Mobile-first.** Every page designed for mobile, then scaled up.
- **Logo:** "Caspr." — heavy editorial serif, red dot as the full stop. The dot is part of the mark.
- **Palette:** Black `#000000` · White `#FFFFFF` · Red `#E8453C` (the dot, CTAs)
- **Aesthetic:** Premium financial press — FT, Bloomberg, The Economist. No gradients, no rounded-everything SaaS aesthetic, no cartoon illustrations.

---

## 2. Page Inventory

### Phase 1 — Ship first (8 pages)

| Page | URL | Priority reason |
|---|---|---|
| Homepage | `/` | All channels lead here |
| Pricing | `/pricing` | Email sequences reference it |
| Enterprise | `/enterprise` | B2B expansion path |
| Consulting ICP | `/consulting` | Highest signup volume ICP |
| Strategy ICP | `/strategy` | Highest revenue per user |
| Investors ICP | `/investors` | Highest revenue per user |
| Security | `/security` | Trust conversion asset — links from every ICP page |
| Privacy | `/privacy` | Legal requirement |
| Terms | `/terms` | Legal requirement |

> **Note:** `/security` is a product page, not a legal document. It has a CTA to `/pricing`. It ships in Phase 1 because it is linked from `/consulting`, `/strategy`, `/investors`, and `/pricing` from day one.

### Phase 2 (next 4–6 weeks)
`/agencies` · `/startups` · `/category-managers` · `/use-cases/market-research` · `/use-cases/business-case` · `/use-cases/due-diligence` · `/analyses/brief` · `/analyses/study` · `/analyses/intelligence` · `/samples/` (3 sample report pages) · `/about` · `/blog` index + first 5 posts · `/academic`

### Phase 3 (ongoing)
Remaining use case pages · All 4 comparison pages (`/vs/chatgpt` · `/vs/perplexity` · `/vs/consulting-firms` · `/vs/statista`) · Programmatic SEO blog at scale · Additional sample reports

---

## 3. Full Page Hierarchy

```
caspr.ai/
│
├── /                             Homepage
├── /pricing                      Pricing & plans
├── /enterprise                   Enterprise page
├── /about                        Company / story
│
├── /consulting                   Consulting Associates & EMs
├── /strategy                     VP Strategy / Chief of Staff
├── /investors                    PE / VC / HF / Family Offices
├── /agencies                     Agency Strategists
├── /startups                     Startup Founders
├── /category-managers            Category & Commercial Managers
│
├── /use-cases/
│   ├── /use-cases/market-research
│   ├── /use-cases/business-case
│   ├── /use-cases/due-diligence
│   ├── /use-cases/competitive-analysis
│   ├── /use-cases/investment-thesis
│   └── /use-cases/rfp-response
│
├── /analyses/
│   ├── /analyses/brief           $15 · 15 min · 1–3 pages
│   ├── /analyses/study           $80 · 1–2 hrs · 100-page PDF/PPTX
│   └── /analyses/intelligence    $300 · 24 hrs · multi-model validation
│
├── /samples/
│   └── /samples/[slug]           Individual sample (read-only preview)
│
├── /vs/
│   ├── /vs/chatgpt
│   ├── /vs/perplexity
│   ├── /vs/consulting-firms
│   └── /vs/statista
│
├── /blog
│   └── /blog/[slug]
│
├── /academic                     Caspr Academic — student programme
│
├── /security                     Information security — product page
└── /privacy · /terms · /gdpr    Legal (minimal design)
```

---

## 4. Navigation

### Header (desktop)
```
[Caspr.]   Solutions ↓   Use Cases ↓   Analyses ↓   Pricing   Blog   [Start Free →]
```

| Dropdown | Links |
|---|---|
| **Solutions** | Consulting · Strategy · Investors · Agencies · Startups · Category Managers |
| **Use Cases** | Market Research · Business Case · Due Diligence · Competitive Analysis · Investment Thesis · RFP Response |
| **Analyses** | Brief ($15 · 15 min) · Study ($80 · 1–2 hrs) · Intelligence ($300 · 24 hrs) |

- **CTA:** `Start Free →` — red (`#E8453C`), rightmost, always visible. Links to signup.
- **Mobile:** Hamburger → full-screen drawer, sections as accordions, CTA pinned to bottom.

### Footer

| Product | Solutions | Use Cases | Company | Trust & Legal |
|---|---|---|---|---|
| Pricing | Consulting | Market Research | About | **Security** |
| Enterprise | Strategy | Business Case | Blog | Privacy |
| Sample Reports | Investors | Due Diligence | Careers | Terms |
| Brief | Agencies | Competitive Analysis | Contact | GDPR |
| Study | Startups | Investment Thesis | | |
| Intelligence | Category Managers | RFP Response | | |

> **Security is first in the Trust & Legal column.** It is a product page that converts, not a legal document — its position in the footer signals this.

---

## 5. Three Page Templates

| Template | Used by | Key sections |
|---|---|---|
| **Homepage** | `/` only | Hero · Category claim · ICP selector · How it works · Output showcase · Testimonials · Pricing preview · Enterprise strip · Trust strip · Final CTA |
| **ICP / Use Case** | All `/for/[icp]` · `/use-cases/[slug]` · `/analyses/[type]` | ICP-specific hero · Pain points · How Caspr solves it · Output example · Proof · Security micro-copy · Pricing strip · CTA |
| **Comparison** | `/vs/[competitor]` | Honest comparison table · Where Caspr wins · Where it doesn't · Testimonial · CTA |
| **Blog post** | `/blog/[slug]` | Title · Byline · Body · Contextual inline CTA · Related posts · Bottom CTA |
| **Security** | `/security` | See Section 8 below |
| **Legal** | `/privacy` · `/terms` · `/gdpr` | Structured text, minimal design |

---

## 6. Conversion Architecture

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

## 7. ICP Page Copy

### ICP 1 — `/consulting`

**Hero headline:** *"The sector you've never covered. The client briefing is tomorrow."*

**Subhead:** Caspr reads 25M+ curated sources, builds the landscape, and cites every claim — in hours. Your team does the thinking.

**Proof:** The secondary research layer your firm delegates to junior analysts. Analyst-grade. Defensible in a client room.

**CTA:** Run your first analysis free

**Security micro-copy (below CTA):** *"Client data never leaves your account. [ISO 27001:2022 certified →](/security)"*

---

### ICP 2 — `/strategy`

**Hero headline:** *"The board needs a strategic options paper. They need it in three weeks, not twelve."*

**Subhead:** Analyst-grade research. Structured conclusions. Cited to source. Delivered in hours — not by a consulting firm on a six-week timeline.

**Proof:** A business case that used to take $150,000 and six weeks. Caspr: two hours and $80.

**CTA:** Start your first analysis — first $100 free, no credit card

**Security micro-copy (below CTA):** *"Your strategic data never trains our models. [ISO 27001:2022 certified →](/security)"*

---

### ICP 3 — `/investors`

**Hero headline:** *"The deal lands Monday. Sector context is ready Tuesday."*

**Subhead:** Upload the data room. Caspr wraps it in curated market intelligence. The investment memo writes itself.

**Proof:** Intelligence tier: multi-model validation, up to 24 hours. The rigour your IC demands — without the six-week timeline or the $100k invoice.

**CTA:** Run a sector brief free

**Security inline (body copy, near data room upload mention):**
*"Every data room upload is encrypted at rest and in transit. It stays in your account. It is never used to train any model. [Full security posture →](/security)"*

---

### ICP 4 — `/agencies`

**Hero headline:** *"Know your client's industry better than they do. Every time. Before the briefing."*

**Subhead:** New sector every pitch. Caspr reads the industry. You write the strategy.

**Proof:** From prompt to cited sector analysis in hours — structured, boardroom-ready, and ready to walk into any client meeting.

**CTA:** Run your first pitch analysis free

**Security micro-copy (below CTA):** *"Client briefs stay in your account. [ISO 27001:2022 certified →](/security)"*

---

### ICP 5 — `/startups`

**Hero headline:** *"Every investor will question your market size number. Have the right answer."*

**Subhead:** A Caspr Study delivers cited market sizing, competitive landscape, and sector analysis — in hours. Defensible in front of any investor.

**Proof:** Analyst-grade market research. The same quality your best-prepared competitor used to raise their round.

**CTA:** Get your market analysis — first $100 free, no credit card

*(No security micro-copy on this page — startup ICP's primary concern is speed and fundraising, not data sensitivity.)*

---

### ICP 6 — `/category-managers`

**Hero headline:** *"The data tells you what happened. Caspr tells you what it means."*

**Subhead:** Market sizing, competitive landscape, trend analysis — boardroom-ready category intelligence, in hours.

**Proof:** Independent analysis. No supplier bias. Every insight cited to source. The kind of research your category review actually needs.

**CTA:** Run your first category analysis free

*(No security micro-copy on this page.)*

---

## 8. The /security Page

This is a **product page**, not a legal document. Full design language. CTA to `/pricing`.

### Sections (in order)

**1. Headline**
> *"Your analysis is yours. Full stop."*

**2. Certification strip**
Two badges, side by side, centered:
- ISO 27001:2022 (linked to certificate)
- GDPR Compliant

**3. Four claims (icon + one line each)**
- *"Your data never trains any model."*
- *"Every analysis encrypted at rest and in transit."*
- *"Access logs on every event."*
- *"ISO 27001:2022 independently audited — not self-reported."*

**4. FAQ (all answers confirmed — ready to publish)**

| Question | Answer |
|---|---|
| What security certifications does Caspr hold? | ISO 27001:2022 certified and GDPR compliant. ISO 27001:2022 is independently audited — not self-reported. SOC 2 Type I audit in progress; report expected Q3 2026. |
| Is my uploaded data used to train your AI models? | No. Your uploaded data is never used to train any model. Your data exists to produce your analysis and nothing else. |
| Does my data leave Caspr's infrastructure? | Your uploaded documents are processed entirely within Caspr's infrastructure — never sent to an external AI provider. Chat session text (typed queries, conversation history) may go to Anthropic, OpenAI, or Google, all under Zero Data Retention agreements. |
| Who are your AI providers? | Chat uses Anthropic, OpenAI, and Google — all under Zero Data Retention agreements. Core research processing runs on models self-hosted within Caspr's own AWS infrastructure. |
| How long is my data retained? | Research outputs: 90 days. Uploaded documents: 1 year from last access. LLM API payloads: 0 days (Zero Data Retention). Enterprise customers can configure custom windows. |
| What happens when I cancel? | All data deleted within 60 days of account termination. Immediate deletion available in Account Settings (30 days). Caspr issues a signed deletion certificate on completion. |
| How is my data encrypted? | AES-256 at rest across all storage layers. TLS 1.3 in transit. Enterprise customers can bring their own KMS encryption keys. |
| Do you have SOC 2? | SOC 2 Type I audit in progress (Q2 2026); report expected Q3 2026. ISO 27001:2022 certified in the meantime. Enterprise customers can request AWS SOC 2 artifacts under NDA. |

**5. CTA**
> *"Secure analysis starts free."* → links to `/pricing`

---

## 9. Security Integration by Page

Security signals appear inline — subtle, contextual, linked to `/security` on every occurrence. Four integration levels:

| Level | What | Where |
|---|---|---|
| **L1 — Trust strip** | One-line bar at page bottom: *"ISO 27001:2022 · GDPR Compliant · [Your data never trains our models →](/security)"* | Homepage (above footer) · /enterprise (below hero) |
| **L2 — CTA micro-copy** | One line below primary CTA | All ICP pages · /pricing |
| **L3 — Contextual inline** | 1–2 sentences in body near data-sensitive feature | /investors · /use-cases/due-diligence · /enterprise |
| **L4 — FAQ entry** | "Is my data secure?" question with 2-sentence answer + link | /pricing · /enterprise |

### Per-page summary

| Page | Level | Copy |
|---|---|---|
| Homepage | L1 | *"ISO 27001:2022 · GDPR Compliant · [Your data never trains our models →](/security)"* |
| /enterprise | L1 + L4 | Trust strip below hero. FAQ: "Enterprise security requirements?" |
| /pricing | L2 + L4 | Below CTA: *"ISO 27001:2022 certified. [Your data stays yours →](/security)"* · FAQ: "Is my data secure?" |
| /consulting | L2 | *"Client data never leaves your account. [ISO 27001:2022 certified →](/security)"* |
| /strategy | L2 | *"Your strategic data never trains our models. [ISO 27001:2022 certified →](/security)"* |
| /investors | L3 | In body near data room upload: *"Every data room upload is encrypted at rest and in transit. It stays in your account. It is never used to train any model. [Full security posture →](/security)"* |
| /agencies | L2 | *"Client briefs stay in your account. [ISO 27001:2022 certified →](/security)"* |
| /startups | none | — |
| /category-managers | none | — |
| /use-cases/due-diligence | L3 | Near data upload feature: *"Your uploaded documents are encrypted at rest and in transit. Never used to train any model. [Full security posture →](/security)"* |

**Rule:** Every security reference — at every level — links to `/security`. The conversion path is: inline signal → /security full posture → /pricing CTA.

---

## 10. Internal Linking

| From | Links to | Why |
|---|---|---|
| Homepage | /consulting · /strategy · /investors · /agencies · /startups · /category-managers | ICP self-selection |
| Homepage | /pricing | Pricing section + CTA |
| Homepage | /samples | Secondary CTA |
| Each ICP page | 2 relevant use case pages | Depth + keyword coverage |
| Each ICP page | 1 analysis type page | Product education |
| Each ICP page | /pricing | Conversion path |
| Each ICP page | /security (inline) | Trust signal |
| /enterprise | /security | Enterprise buyers require security review |
| /pricing | /enterprise | Upsell path |
| /pricing | Top 3 ICP pages | Contextual role-based links |
| /pricing | /security | Near CTA — answers unstated data concern |
| /use-cases/due-diligence | /security | Data room workflow |
| /analyses/[type] | /pricing | Primary conversion |
| /analyses/[type] | Relevant ICP pages | Role relevance |
| /vs/[competitor] | /pricing | High-intent traffic → direct to pricing |
| /vs/[competitor] | /samples | See output before deciding |
| /samples/[slug] | Signup | Highest-converting CTA |
| /security | /pricing | Primary CTA — trust converts to purchase |
| Blog posts | Relevant ICP or use case page | Contextual inline CTA |

No orphan pages. Every page has minimum 2 inbound internal links.

---

## 11. SEO Intent by Page

| Page | Primary keyword | Secondary keywords |
|---|---|---|
| / | analytical AI for business | AI business research tool, AI market research |
| /consulting | AI for consultants | market analysis tool consulting, desk analysis AI |
| /strategy | AI for strategy teams | business analysis VP strategy, strategic options paper AI |
| /investors | AI due diligence tool | investment analysis AI PE VC, sector analysis AI |
| /agencies | AI for marketing agencies | pitch analysis tool AI, agency competitive analysis |
| /startups | AI market sizing tool | startup market analysis, TAM SAM SOM analysis AI |
| /category-managers | category intelligence tool | retail market analysis AI, category review analysis |
| /use-cases/market-research | AI market research report | automated market research, AI industry analysis |
| /use-cases/business-case | AI business case generator | business case template AI, business case report |
| /use-cases/due-diligence | AI due diligence tool | automated due diligence report, M&A research AI |
| /use-cases/competitive-analysis | AI competitive analysis | competitive landscape report generator |
| /use-cases/investment-thesis | investment thesis AI | sector analysis report AI, investment memo AI |
| /use-cases/rfp-response | AI RFP response generator | RFP research automation, proposal research AI |
| /analyses/brief | quick market research report | 15 minute market analysis AI |
| /analyses/study | AI 100 page business report | in-depth market research report AI |
| /analyses/intelligence | enterprise business intelligence AI | due diligence report AI 24 hours |
| /vs/chatgpt | Caspr vs ChatGPT research | ChatGPT for business analysis alternative |
| /vs/consulting-firms | AI alternative to consulting firms | McKinsey alternative AI, consulting research AI |
| /vs/perplexity | Caspr vs Perplexity business | Perplexity for market research alternative |
| /vs/statista | Caspr vs Statista | Ibisworld alternative AI, market data AI |
| /security | Caspr data security | ISO 27001 AI research tool, GDPR compliant AI |
| /blog/[slug] | Long-tail per post | Topic cluster terms per category |

---

## 12. Caspr Academic — /academic Page

This page ships in Phase 2. Brief for the designer:

**URL:** `caspr.ai/academic`

**Hero:**
> *"Your library closed at 9pm. Your case brief doesn't care. Caspr is open."*

**Subhead:**
> A cited sector landscape in 15 minutes. 100-page market analysis in hours. $8 per Brief. $40 per Study. Verify your academic email to unlock.

**Secondary CTA area:**
> *"Caspr Academic. Because access to real research shouldn't depend on your institution's library budget."*

**Pricing block:**
> **Caspr Academic**
> The same analyst-grade research as the Professional tier — at the rate students deserve.
> $8 per Brief · $40 per Study · No subscription · Verify your .edu email to unlock.
> [Start with $150 free →]

**Tone note:** The core Caspr voice holds. Register shifts slightly toward peer-level credibility ("I've been in your position") rather than board-level authority. No exclamation points. No "amazing." The student ICP is intelligent and ambitious — condescension kills the message.

---

## 13. Brand Voice Reminders (for copy review)

| Do | Do not |
|---|---|
| Conclusions, not descriptions | Feature lists without outcomes |
| Numbers anchor everything — "15 minutes", "$80 vs. $50,000" | "Fast", "affordable", "powerful" |
| Second person always — "you", "your business case" | "Users", "customers", "the platform" |
| Short sentences. Split at two clauses. | Long, qualified sentences |
| Security certification names — "ISO 27001:2022" | "Enterprise-grade security", "bank-grade" |
| Every security mention links to /security | Floating security claims with no destination |
| No exclamation points. Ever. | ! |
| Dry wit — if you notice you're trying to be witty, stop | Announced humour |

**Do not use:** platform · leverages · algorithms · workflows · powerful AI · revolutionary · game-changing · chatbot · web scraping · hallucinate · "excited to announce" · "Here's how:" · LAM

---

## 14. URL Conventions

- Hyphens, not underscores
- All lowercase
- No trailing slash
- No dates in URLs
- Slugs reflect the keyword, not internal naming

---

## 15. Open Items (do not build these yet)

| Item | Waiting on |
|---|---|
| Sample reports: 3 demonstration analyses | Joy to run them first |
| Student verification page (`/academic/verify`) | Engineering build |
| Named testimonial for research firm | Joy collecting |
| Pentest executive summary (for /security enterprise section) | Q3 2026 — add when available |
| SOC 2 Type I report (for /security certifications strip) | Q3 2026 — add badge when issued |

**Security FAQ:** All answers confirmed by Jayant. /security page is ready to design and build.
