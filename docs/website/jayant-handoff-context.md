# Caspr.ai Website Build — Context for Jayant

*Prepared: 2026-05-18*
*From: Joy (Marketing)*
*Purpose: Share full context from the marketing/build planning session so Jayant can answer four open decisions before the implementation plan is written*

---

## What was decided in this session

### 1. Stack
| Layer | Decision |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + CSS custom properties for brand tokens |
| Fonts | `next/font/google` — Instrument Serif · Inter · DM Mono |
| Deployment | **Vercel** (not AWS Amplify) |
| Source control | GitHub |

### 2. Build scope — Phase 0 (starts now, design-independent)
These can be built immediately without waiting for Figma:

1. Next.js project scaffold with TypeScript and Tailwind
2. Full design token layer (all brand colours, spacing, motion — fully documented)
3. Font loading (`next/font`)
4. Header component (desktop nav with dropdowns + mobile hamburger drawer)
5. Footer component (5 columns, all links populated)
6. App Router file structure — all Phase 1–3 URL routes created as placeholders so no links ever 404
7. SEO infrastructure — `generateMetadata()` pattern, OG tags, canonical URLs, sitemap, robots
8. `/privacy` and `/terms` pages — content already exists in the repo
9. `/security` page — fully specced, all FAQ answers confirmed by Jayant already
10. Vercel deployment — GitHub → Vercel connection, preview deployments, production on `main`
11. Analytics scaffolding — conversion events on CTAs, UTM capture

### 3. Phase 1 (after Figma is finalised)
Build all pages from the Figma file (`rmurwf7WT9B4kKhXcju3ro`) as the exact requirement.

Must ship before the re-engagement email sequences go live:
- Homepage · /pricing · /enterprise · /consulting · /strategy · /investors · /security · /privacy · /terms

Phase 2 (4–6 weeks post-launch):
- /agencies · /startups · /category-managers · /market-research · /academic · all /use-cases · all /analyses · /samples (3 reports) · /about · /blog + 5 posts

### 4. Page templates
Three reusable templates: `HomepageLayout` · `ICPLayout` · `LegalLayout`
Plus bespoke: `/security` and `/blog/[slug]`

### 5. Reference docs already in the repo
Everything below is fully written and ready for the build — the developer does not need to make any content or design decisions:

| Doc | What it covers |
|---|---|
| `.agents/website-architecture.md` | Full page hierarchy, nav structure, URL conventions, internal linking |
| `.agents/website-visual-design-guidelines.md` | Complete design system — tokens, typography, spacing, components, motion |
| `strategy/website-build-brief.md` | Page-by-page copy, section structure, ICP copy, security page spec |
| `docs/website/icp-pages-seo.md` | Exact `<title>`, `<meta description>`, OG tags for all 6 ICP pages — ready to paste |
| `docs/website/pages-for-production.md` | Phase-by-phase page inventory, Figma page names, dev URLs, pre-launch checklist |
| `docs/legal/privacy-policy.md` | Privacy policy content |
| `docs/legal/terms-of-use.md` | Terms of service content |
| `.agents/security-posture.md` | All security claims and FAQ answers (confirmed by Jayant) |
| `.agents/pricing-model.md` | Full pricing model, billing rules, what to show/hide on the site |
| `.agents/brand-guidelines.md` | Voice, tone, copy rules, approved/rejected words |

---

## Four open decisions needed from Jayant

### Decision 1 — Analytics provider

**Question:** Should the site use **Posthog** or **Google Analytics 4**?

**Why it matters:** The analytics scaffolding goes in during Phase 0. Whichever provider is chosen, the implementation is identical from the site's perspective (event names, conversion tracking on CTAs, UTM capture) — the difference is just the SDK and the data destination.

**Key events to track regardless of provider:**
- `start_free_clicked` — on every primary CTA
- `signup_completed` — activation funnel entry
- UTM parameters (`utm_source`, `utm_medium`, `utm_campaign`) persisted across the session

**Recommendation if no preference:** Posthog — self-hostable, better product analytics (funnels, session replay), more useful for diagnosing the activation gap (signup → first report) than GA4.

---

### Decision 2 — Blog CMS

**Question:** Should blog posts be managed as **MDX files in the GitHub repo**, or via a **headless CMS** (e.g. Contentful, Sanity)?

**Why it matters:** The blog ships in Phase 2 (first 5 posts). The CMS decision determines who can write and publish posts — a developer-only workflow (MDX) vs. a non-technical editor workflow (headless CMS).

**Option A — MDX files in the repo**
- Posts are `.mdx` files committed to GitHub
- No external dependency, no cost, full version control
- Only people with repo access can publish — every post requires a deployment
- Right choice if: Jayant or a developer will manage blog content

**Option B — Headless CMS (Sanity recommended)**
- Posts written in a visual editor, published without a deployment
- Joy or any non-technical team member can write and publish independently
- Small additional cost and setup (~1 day)
- Right choice if: Joy will manage blog content herself

---

### Decision 3 — GitHub repo

**Questions:**
1. What GitHub organisation should the repo live under? (personal account, or a Caspr org?)
2. What should the repo be named? (e.g. `caspr-web`, `caspr-marketing-site`)
3. Does Jayant want to create the repo and invite Joy, or should Joy create it?
4. Should it be private or public?

---

### Decision 4 — DNS for caspr.ai on Vercel

**Question:** Can Jayant update the `caspr.ai` DNS records to point to Vercel when the site is ready to go live?

**What Vercel requires:**
- For the apex domain (`caspr.ai`): either an `A` record pointing to Vercel's IP, or transfer nameservers to Vercel DNS
- For `www.caspr.ai`: a `CNAME` to `cname.vercel-dns.com`

**What needs to happen:**
- Vercel generates the DNS values after the domain is added to the project
- Jayant updates the DNS at the current registrar
- Propagation typically takes 15–60 minutes

**No urgency for now** — this only needs to happen when the site is ready to replace the current caspr.ai. During development, Vercel provides a free preview URL (e.g. `caspr-web.vercel.app`) that is fully functional.

---

## What happens once Jayant answers

Once the four decisions above are confirmed, the implementation plan will be written and Phase 0 build starts. Phase 0 is estimated at 2–3 days and produces a working deployment shell on Vercel before a single design-dependent page is built.

The Figma file can be finalised in parallel — Phase 1 (design-dependent pages) starts as soon as both the Phase 0 shell and the final Figma are ready.

---

## Reference: full spec document

Full build spec: `docs/superpowers/specs/2026-05-17-website-build-design.md`
