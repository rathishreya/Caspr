# Caspr — Pages Required Before Production
*Last updated: 2026-05-14*
*Owner: Joy (Marketing) · Jayant (Engineering)*
*Source: website-architecture.md · icp-copy.md · security-posture.md · brand-guidelines.md*

---

## Status Summary

| Phase | Pages | Status |
|---|---|---|
| **Phase 1 — Must ship before email sequences go live** | 9 pages | Designed in Figma ✓ — needs dev build |
| **Phase 2 — Sprint 1–2 (4–6 weeks post-launch)** | 14 pages | Design pending |
| **Phase 3 — Ongoing** | 10+ pages | Design pending |

---

## Phase 1 — Launch Blockers

These pages must exist before the re-engagement email sequence goes out. Every email either links to one of these pages or assumes the product is reachable from them. Missing any one blocks launch.

### 1. Homepage (`/`)
**Why it's critical:** All acquisition channels land here. Cold traffic from LinkedIn ads, press, and word of mouth hits this page first.

**Must include:**
- Hero with value proposition and primary CTA ("Start Free — first $100 on Caspr")
- ICP selector section ("For your role" — links to all 8 ICP pages)
- How It Works (3 steps)
- Analytical AI category claim section
- Output showcase (visual of a Caspr Study PDF)
- Testimonials strip
- Pricing preview (Brief / Study / Intelligence with prices)
- Enterprise trust strip (L1 security integration)
- Final CTA

**Design status:** Not yet in Figma. Priority to create.

**Notes:** The homepage carries the broadest audience — consulting, strategy, investors, and everyone else. Copy must be ICP-agnostic at the hero, then funnel into role-specific paths below the fold.

---

### 2. Pricing (`/pricing`)
**Why it's critical:** All email CTAs reference plan tiers. Without this page, upgrade intent has nowhere to land.

**Must include:**
- All three analysis types (Brief / Study / Intelligence) with prices ($15 / $80 / $300)
- Free trial prominently positioned ("First $100 on Caspr — no credit card")
- Plan comparison (Professional / Business / Enterprise milestones)
- L2 security micro-copy below primary CTA
- L4 FAQ entry: "Is my data secure?" with link to /security
- Enterprise upsell path → /enterprise

**Design status:** Figma page exists (`💰 /pricing`) — verify it includes the Research Budget model language and correct milestone pricing.

**Note on pricing language — revised 2026-08-26.** Do not show the 7% platform fee. Show the gross budget and the amount available. **Correct framing: "Solo — $200 a month of research, ~$186 available for analyses."** ⛔ **Never** *"$200/month"* or *"from $200/mo"* (`COPY-11a`), and **never** *"only pay for what you run"* — the fee is charged monthly regardless of use (`COPY-11b`). **Plan names: Try · Solo · Team · Org.** Full rules in `.agents/pricing-model.md`.

---

### 3. Enterprise (`/enterprise`)
**Why it's critical:** B2B expansion path. Enterprise deals close faster when there's a dedicated page to send procurement and IT security reviewers to.

**Must include:**
- L1 trust strip below hero
- Enterprise capabilities table (BYOK, custom retention, on-prem Tier 2, SSO, API, 3 seats)
- Security questionnaire / CTO-led review offer
- "Book a call" primary CTA
- L4 FAQ entry: "Enterprise security requirements?" → link to /security

**Design status:** Figma page exists (`🏛 /enterprise`) — verify content matches current enterprise capability set.

---

### 4–6. Core ICP pages: `/consulting` · `/strategy` · `/investors`
**Why they're critical:** These are the three highest-value ICPs. The re-engagement email sequence directs each segment to its specific ICP page.

**Status:** All three fully designed in Figma with all Group A/B/C updates applied:
- ✓ Hero with role-specific copy
- ✓ Secondary CTA ("See a sample report →")
- ✓ Pain points, How It Works, Analytical AI section
- ✓ Pricing with MOST POPULAR badge
- ✓ Testimonial
- ✓ Objection handling strip (3 columns)
- ✓ FAQ (5 Q&As each)
- ✓ L2/L3 security integration
- ✓ Final CTA

**Ready for dev build.** SEO metadata in `docs/icp-pages-seo.md`.

---

### 7. Security (`/security`)
**Why it's critical:** Every ICP page links to `/security` as a trust signal. Without it, those links 404. Enterprise buyers require it before procurement sign-off.

**Status:** ✓ Fully designed in Figma (`🔒 /security`) — content drawn directly from `security-posture.md` (all claims confirmed by Jayant).

**Page sections:**
- Hero: "Your analysis is yours. Full stop."
- Certifications: ISO 27001:2022 · GDPR · SOC 2 Type I in progress
- Data Architecture: two-tier model explainer
- Zero Training dark section
- Data Retention & Deletion summary
- Enterprise security quote
- Three claims: Independently audited / Zero training / Deletion certificate
- FAQ (5 key Q&As from confirmed security posture)
- CTA: "Secure analysis starts free"

---

### 8–9. Legal pages: `/privacy` · `/terms`
**Why they're critical:** Legal requirement. Cannot launch without them.

**Status:** Figma page exists (`⚖ /privacy · /terms`).

**Must verify before launch:**
- Privacy policy reflects current data retention periods (90 days queries, 1 year uploads, 0 days LLM payloads)
- GDPR erasure rights and contact (privacy@caspr.ai) are stated
- Terms of Service cover the Research Budget model (gifted trial, billing rules, refund policy)
- Cookie policy is accurate
- Have a lawyer review before publishing

---

## Phase 2 — Sprint 1–2 (4–6 Weeks Post-Launch)

These pages are needed to serve the full ICP set and capture organic search traffic. Launch without them is acceptable; they must ship within 6 weeks.

### ICP Pages (Phase 2)

| Page | ICP | Priority | Notes |
|---|---|---|---|
| `/agencies` | Agency Strategists | High | Figma ✓ (all updates applied) |
| `/startups` | Startup Founders | High | Figma ✓ (all updates applied) |
| `/category-managers` | Category & Commercial Managers | Medium | Figma ✓ (all updates applied) |
| `/market-research` | Market Research Professionals | Medium | Figma ✓ (created this session) |
| `/academic` | Graduate Students | Medium | Figma ✓ (created this session) — needs Academic programme backend active |

**Note on `/academic`:** Do not launch until Jayant confirms Academic account pricing ($8/$40) and the $150 free trial are live in the product. The page promises academic pricing that must be deliverable at signup.

### Use Case Pages

These are job-to-be-done pages targeting search intent rather than ICP identity. They convert visitors who search for a specific output rather than identifying as a role.

| Page | Primary keyword | Priority | Why |
|---|---|---|---|
| `/use-cases/market-research` | AI market research report | High | Highest search volume in category |
| `/use-cases/business-case` | AI business case generator | High | Converts strategy + startup ICPs |
| `/use-cases/due-diligence` | AI due diligence tool | High | Converts investors ICP via organic |
| `/use-cases/competitive-analysis` | AI competitive analysis | Medium | Broad appeal across all ICPs |
| `/use-cases/investment-thesis` | investment thesis AI | Medium | Investor-specific organic path |
| `/use-cases/rfp-response` | AI RFP response generator | Low | Agency + enterprise secondary use case |

**`/use-cases/due-diligence` must include L3 security integration** (data room upload workflow makes the security objection live). See website-architecture.md §Security Integration.

### Analysis Type Pages

These are product education pages. They explain what a Brief, Study, and Intelligence analysis actually is — and convert visitors who arrive from organic search or content links.

| Page | Price point | Primary conversion |
|---|---|---|
| `/analyses/brief` | $15 | Free trial → first Brief |
| `/analyses/study` | $80 | Free trial → first Study |
| `/analyses/intelligence` | $300 in-budget / $399 à la carte | Enterprise upsell |

### Sample Reports (`/samples/`)

**Highest-converting asset on the site.** A visitor who reads a sample report converts at significantly higher rates than one who does not.

**Minimum three samples at launch of this section:**
1. Consulting sector landscape (e.g., UK direct-to-consumer logistics — Brief or Study)
2. Investment due diligence (e.g., European SaaS M&A market — Intelligence)
3. Category management report (e.g., UK sustainable personal care — Study)

Each sample page should have:
- Read-only preview of the actual output (PDF or embedded PPTX)
- "Run this analysis on your topic" CTA → free signup
- ICP-specific sub-copy (e.g., for investors sample: trust strip + data room mention)

**Action required:** Generate real sample reports through the product. Do not mock them up. The credibility of the sample is the conversion mechanism.

### About (`/about`)
Company story, founding narrative, Analytical AI positioning, team. Required before any significant press coverage. Not a launch blocker for the email sequences but needed before PR outreach.

### Blog (`/blog` + first 5 posts)
**SEO flywheel starter.** The first 5 posts should target long-tail keywords matching ICP search behaviour:

| Post title | Target keyword | ICP |
|---|---|---|
| "How to write a board-ready strategic options paper in hours" | strategic options analysis AI | Strategy |
| "Market sizing for your pitch deck: why investors challenge your TAM number" | market sizing for pitch deck | Startups |
| "Due diligence market research: how PE firms cut the six-week timeline" | due diligence market research | Investors |
| "The pre-fieldwork problem: how research agencies cut the context-gathering phase" | market research pre-fieldwork | Market Research |
| "How consulting associates can turn desk research from two days to two hours" | desk research tool for consultants | Consulting |

Each post must have:
- Contextual inline CTA mid-post (matching the post topic to an ICP page)
- Bottom CTA to free trial
- 1,200–2,000 words, fully cited
- Canonical URL, meta description, OG tags per `docs/icp-pages-seo.md` format

---

## Phase 3 — Ongoing (Sprint 3+)

Not launch-critical. Build as SEO and conversion data warrant.

### Comparison Pages (`/vs/`)

High-intent traffic. Visitors searching "Caspr vs ChatGPT" have already heard of Caspr and are evaluating. Convert at higher rates than cold traffic.

| Page | Target keyword | Priority |
|---|---|---|
| `/vs/chatgpt` | Caspr vs ChatGPT research | High — most searched |
| `/vs/consulting-firms` | AI alternative to consulting firms | High — validates core positioning |
| `/vs/perplexity` | Caspr vs Perplexity business | Medium |
| `/vs/statista` | Caspr vs Statista | Medium — category manager ICP |

**Copy principle for comparison pages:** Be honest. State clearly where Caspr wins (analytical depth, citations, structured output, price) and where it does not (real-time news, primary research, qualitative fieldwork). Trust is lost by overclaiming; conversion is won by precision.

### Programmatic SEO Templates

Once traffic data from Phase 1–2 confirms which keywords convert, build programmatic templates:
- `[industry] market research report` (e.g., "UK fintech market research report")
- `business case for [X] in [country]`
- `market size of [industry]`
- `acquisition targets in [sector]`

Requires: content pipeline, template build, URL structure locked (no trailing slashes, hyphens not underscores — see website-architecture.md §URL Conventions).

### Additional Sample Reports
Scale to 10+ samples covering every ICP. Real outputs only.

---

## Pre-Launch Checklist

Before any page goes live:

### Copy
- [ ] All claims match `security-posture.md` (no paraphrasing of security claims)
- [ ] No "exclamation points, platform, leverages, algorithms, workflows, powerful AI, revolutionary, game-changing, chatbot, hallucinate" — see brand-guidelines.md §Rejected language
- [ ] "First $100 on Caspr" confirmed live in product (Jayant sign-off required per icp-copy.md)
- [ ] Academic pricing ($8/$40, $150 trial) confirmed live before `/academic` launches
- [ ] SOC 2 copy: never say "SOC 2 certified" — "SOC 2 Type I audit in progress" only
- [ ] ICP 3 proof line: "$100k invoice" — confirm accuracy (pending Joy sign-off per icp-copy.md)

### SEO
- [ ] All 6 existing ICP pages: `<title>`, `<meta name="description">`, OG tags — use `docs/icp-pages-seo.md` verbatim
- [ ] All ICP pages confirmed `index, follow` (not noindex'd during development) — Jayant
- [ ] Canonical URLs set on all pages — no duplicate content
- [ ] No dates in URLs
- [ ] `/security`, `/market-research`, `/academic` need SEO metadata written (not yet in `docs/icp-pages-seo.md`)

### Internal Linking
- [ ] Every ICP page links to `/security` (micro-copy already in Figma)
- [ ] `/enterprise` links to `/security`
- [ ] `/pricing` links to `/security`
- [ ] No orphan pages — every page receives minimum 2 inbound internal links
- [ ] Footer links complete and working on all pages

### Trust & Legal
- [ ] Privacy policy reviewed by lawyer
- [ ] Terms of Service cover Research Budget model
- [ ] Cookie banner implemented (GDPR requirement — privacy-preserving defaults)
- [ ] GDPR erasure workflow live (privacy@caspr.ai → 30-day completion)
- [ ] Deletion certificate process operational for all plans

### Performance
- [ ] OG image `caspr-og.png` (1200×630) created for all ICP pages
- [ ] All images compressed and served via CDN
- [ ] Core Web Vitals passing (LCP < 2.5s, CLS < 0.1, FID < 100ms)
- [ ] Mobile-first verified — all pages tested at 375px, 390px, 430px
- [ ] HSTS enabled, HTTPS enforced

### Analytics
- [ ] Conversion tracking on all primary CTAs ("Start Free →")
- [ ] Activation tracking: signup → first report generated (the critical funnel event)
- [ ] UTM parameter capture for all email sequence links
- [ ] Heatmap tool installed (e.g., Hotjar, Microsoft Clarity) — activation gap diagnosis

---

## Pages Not Required at Launch

| Page | Reason to defer |
|---|---|
| `/gdpr` (standalone) | GDPR section within `/privacy` is sufficient at launch |
| Programmatic SEO | Requires traffic data to know which templates to build |
| `/vs/` comparison pages | Valuable but not in the activation funnel |
| Additional blog posts beyond 5 | 5 posts is sufficient to seed the SEO flywheel |
| ICP-specific OG images | Single `caspr-og.png` covers all pages at launch |
| Structured data / schema markup | Not required at launch; SoftwareApplication schema on homepage is the Phase 2 priority |
| Hreflang tags | Not required until international expansion |

---

## Figma → Dev Handoff Notes

All Figma pages are at `rmurwf7WT9B4kKhXcju3ro`. Pages ready for dev build:

| Page | Figma page name | Dev URL | SEO metadata |
|---|---|---|---|
| Consulting | `🏢 /consulting` | `/consulting` | ✓ `docs/icp-pages-seo.md` |
| Strategy | `📊 /strategy` | `/strategy` | ✓ `docs/icp-pages-seo.md` |
| Investors | `💼 /investors` | `/investors` | ✓ `docs/icp-pages-seo.md` |
| Agencies | `🎯 /agencies` | `/agencies` | ✓ `docs/icp-pages-seo.md` |
| Startups | `🚀 /startups` | `/startups` | ✓ `docs/icp-pages-seo.md` |
| Category Managers | `🛒 /category-managers` | `/category-managers` | ✓ `docs/icp-pages-seo.md` |
| Market Research | `🔬 /market-research` | `/market-research` | ⚠ needs writing |
| Academic | `🎓 /academic` | `/academic` | ⚠ needs writing — hold until pricing confirmed live |
| Security | `🔒 /security` | `/security` | ⚠ needs writing |
| Homepage | Not yet designed | `/` | Needs design + SEO |
| Pricing | `💰 /pricing` | `/pricing` | Needs SEO |
| Enterprise | `🏛 /enterprise` | `/enterprise` | Needs SEO |

Stack: Next.js → GitHub → AWS Amplify. Mobile-first. Designed in Figma.
