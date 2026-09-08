# Caspr.ai Website — Build Spec

*Created: 2026-05-17*
*Updated: 2026-05-18 — open decisions resolved*
*Status: Approved*

---

## Overview

Build and deploy the Caspr.ai marketing website as a Next.js application on Vercel. The site is fully designed in Figma (`rmurwf7WT9B4kKhXcju3ro`). This spec covers the pre-design-handoff setup work — everything that can be built before the Figma is finalized — and the full build scope thereafter.

---

## Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | Next.js 14 (App Router) | Required by brief. App Router gives per-page metadata, server components, and native Vercel optimisation |
| Language | TypeScript | Type safety across page props, metadata, and component interfaces |
| Styling | Tailwind CSS + CSS custom properties | Tailwind for layout/spacing utilities; CSS tokens (`--accent`, `--surface-0`, etc.) for brand colours and the `data-theme="dark"` section override system |
| Fonts | `next/font/google` | Instrument Serif (400, italic) · Inter (400, 500, 600) · DM Mono (400) — loaded with `display: swap`, exposed as CSS variables |
| Deployment | Vercel | First-party Next.js support, zero build config, automatic preview deployments on every PR, production on `main` |
| Repo | GitHub | Source of truth; Vercel pulls from `main` for production |
| Analytics | PostHog | Product analytics, session replay, funnels — better for diagnosing activation gap than GA4 |

---

## Phase 0 — Pre-Handoff Setup (starts now)

Everything in this phase is independent of the final Figma designs.

### 0.1 Project Scaffold
- `npx create-next-app@latest caspr-web --typescript --tailwind --app --src-dir`
- Configure `tailwind.config.ts` to extend with brand tokens as Tailwind theme values where useful
- `globals.css` — define all CSS custom property tokens: colour system (light + dark), spacing scale, font variables, motion tokens
- `data-theme="dark"` override block for dark sections

### 0.2 Fonts
- `next/font/google` setup for Instrument Serif, Inter, DM Mono
- Variables exposed as `--font-display`, `--font-text`, `--font-mono`
- Applied at `<html>` level in `layout.tsx`

### 0.3 Design Token Layer
All tokens from the visual design guidelines committed as CSS custom properties:
- Colour: `--ink`, `--white`, `--accent`, `--accent-hover`, `--accent-pressed`, full surface/border/text scale for light and dark
- Spacing: `--space-1` through `--space-40` (4px base unit)
- Motion: `--duration-fast` through `--duration-slow`, easing tokens
- `prefers-reduced-motion` media query block

### 0.4 Header Component
- Desktop: logo left, nav centre, `Start Free →` CTA right
- Dropdowns: Solutions · Use Cases · Analyses — all links populated from the architecture doc
- Sticky on scroll, shadow on scroll past 48px
- Mobile: hamburger → full-screen drawer, sections as accordions, CTA pinned to bottom
- Shared across all pages via `layout.tsx`

### 0.5 Footer Component
- Five columns: Product · Solutions · Use Cases · Company · Trust & Legal
- All links populated — Security first in Trust & Legal
- Dark background (`--ink`)
- Shared across all pages via `layout.tsx`

### 0.6 URL Routing Structure
Create the App Router directory tree for all Phase 1–3 routes with placeholder `page.tsx` files. No 404s on any planned URL from day one:

```
app/
├── page.tsx                          /
├── pricing/page.tsx
├── enterprise/page.tsx
├── about/page.tsx
├── consulting/page.tsx
├── strategy/page.tsx
├── investors/page.tsx
├── agencies/page.tsx
├── startups/page.tsx
├── category-managers/page.tsx
├── market-research/page.tsx
├── academic/page.tsx
├── use-cases/
│   ├── market-research/page.tsx
│   ├── business-case/page.tsx
│   ├── due-diligence/page.tsx
│   ├── competitive-analysis/page.tsx
│   ├── investment-thesis/page.tsx
│   └── rfp-response/page.tsx
├── analyses/
│   ├── brief/page.tsx
│   ├── study/page.tsx
│   └── intelligence/page.tsx
├── samples/
│   └── [slug]/page.tsx
├── vs/
│   ├── chatgpt/page.tsx
│   ├── perplexity/page.tsx
│   ├── consulting-firms/page.tsx
│   └── statista/page.tsx
├── blog/
│   ├── page.tsx
│   └── [slug]/page.tsx
├── security/page.tsx
├── privacy/page.tsx
└── terms/page.tsx
```

### 0.7 SEO Infrastructure
- Reusable `generateMetadata()` pattern in a shared utility
- OG tag template (title, description, image, url, type)
- Twitter card tags
- Canonical URL logic
- `robots.ts` — all pages `index, follow` by default
- `sitemap.ts` — auto-generated from known routes
- All six ICP page metadata values from `docs/website/icp-pages-seo.md` wired in immediately

### 0.8 Design-Independent Pages

**`/privacy` and `/terms`**
- Content already exists in `docs/legal/`
- Minimal design template: structured text, site header/footer, no custom sections
- Lawyer review still required before publishing — pages can be built and sit behind a flag

**`/security`**
- Fully specced: headline, certification strip, four claims, eight FAQ entries (all confirmed), CTA to `/pricing`
- Full Caspr design language applies — this is a product page, not a legal document
- Can be built to completion without Figma

### 0.9 Vercel Deployment
- Create GitHub repo, push scaffold
- Connect to Vercel — auto-detects Next.js, no `vercel.json` needed
- Confirm: production branch = `main`, preview on all other branches
- Set environment variables (analytics keys, any API endpoints)
- Confirm domain: `caspr.ai` — add to Vercel and update DNS

### 0.10 Analytics — PostHog
- Install `posthog-js` and `posthog-node`
- `PostHogProvider` wrapping `app/layout.tsx`
- Conversion event on all primary CTA clicks (`start_free_clicked`)
- Signup completion event (`signup_completed`)
- UTM parameter capture and persistence across session
- PageView tracked automatically via PostHog's Next.js integration

---

## Phase 1 — Design-Dependent Pages (after Figma finalised)

Build all pages from the Figma file as the exact requirement. Pages in scope:

**Must ship before email sequences go live:**
Homepage · /pricing · /enterprise · /consulting · /strategy · /investors · /security · /privacy · /terms

**Phase 2 (4–6 weeks post-launch):**
/agencies · /startups · /category-managers · /market-research · /academic · all /use-cases pages · all /analyses pages · /samples (3 reports) · /about · /blog + first 5 posts

**Phase 3 (ongoing):**
All /vs pages · programmatic SEO templates · additional sample reports

---

## Page Templates

Three reusable templates cover all pages:

| Template | Used by |
|---|---|
| `HomepageLayout` | `/` only |
| `ICPLayout` | All ICP, use case, and analysis pages |
| `LegalLayout` | `/privacy` · `/terms` · `/gdpr` |

Plus two bespoke pages: `/security` (full design language, unique structure) and `/blog/[slug]` (prose-optimised).

---

## Component Architecture

Shared components built in Phase 0 that all pages consume:

- `<Header>` — sticky, dropdown-aware, mobile drawer
- `<Footer>` — five-column, dark background
- `<CTAButton>` — primary (red) and secondary (ghost) variants, correct copy enforced via props
- `<Overline>` — red ALL CAPS label, mandatory on every section
- `<SecurityMicroCopy level="L1|L2|L3|L4">` — renders correct security copy per level, always links to /security
- `<PricingCard>` — standard and featured (dark) variants

---

## URL Conventions

- Hyphens not underscores
- All lowercase
- No trailing slash — configure in `next.config.ts`
- No dates in URLs
- Canonical on every page

---

## Pre-Launch Checklist

Before any page goes public:
- [ ] All copy matches `security-posture.md` — no paraphrasing of security claims
- [ ] No banned words — run grep across all content files
- [ ] "First $100 on Caspr" confirmed live in product (Jayant sign-off)
- [ ] All ICP pages confirmed `index, follow` — not noindex'd
- [ ] Privacy policy lawyer-reviewed
- [ ] Cookie banner implemented (GDPR)
- [ ] Core Web Vitals passing: LCP < 2.5s · CLS < 0.1 · FID < 100ms
- [ ] Mobile tested at 375px, 390px, 430px
- [ ] Conversion tracking live on all primary CTAs
- [ ] OG image `caspr-og.png` (1200×630) created and deployed

---

## Resolved Decisions

| Decision | Resolution |
|---|---|
| Analytics provider | **PostHog** |
| Blog CMS | **Headless CMS** — Sanity recommended (visual editor, Joy can publish independently) |
| GitHub repo | **Joy creates** — GitHub already configured on Joy's machine; no Jayant involvement needed |
| caspr.ai DNS | **Jayant confirmed** — will update DNS records when site is ready to go live; Vercel preview URL used during development |
