> **⛔ HISTORICAL DOCUMENT — vocabulary below is superseded.**
> This predates **2026-08-27**, when **the Thinking Brain and the Learning Brain were retired together.**
> The architecture is now **Source. Assess. Conclude.** — [`source-assess-conclude.md`](../../source-assess-conclude.md).
> **The body is left unedited on purpose:** it records what was true when it was written. **Do not copy
> vocabulary out of it.**

# Phase 1 — Full Marketing Site Build (15 Figma Pages)

> **For agentic workers:** Use `superpowers:subagent-driven-development` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build all 15 Figma-designed pages pixel-accurately. Every page is fully designed on both desktop and mobile. The final output must match the Figma exactly in typography, spacing, layout, and copy.

**Figma file:** `rmurwf7WT9B4kKhXcju3ro` — `https://www.figma.com/design/rmurwf7WT9B4kKhXcju3ro/Caspr.ai-—-Website-Redesign`

**Tech stack:** Next.js 16 App Router · React 19 · Tailwind v4 (`@theme {}` in `globals.css`) · TypeScript · Jest 30 + RTL · PostHog analytics

**Critical rules:**
- Always read `caspr-web/AGENTS.md` and `caspr-web/node_modules/next/dist/docs/` before writing Next.js code
- Run all commands from the `caspr-web/` directory
- `params` in dynamic routes is `Promise<{...}>` — must be awaited
- Tailwind v4: no `tailwind.config.ts`; tokens are CSS variables in `globals.css`
- Mock PostHog in every test: `jest.mock('posthog-js/react', () => ({ usePostHog: () => null }))`
- Never include `setupFilesAfterFramework` — the correct key is `setupFilesAfterEnv`
- Run the full test suite after every task to confirm no regressions
- `get_design_context` on Figma node IDs to verify exact copy/spacing when in doubt

---

## Figma Page Map

| Route | Desktop Node | Mobile Node | Desktop H |
|---|---|---|---|
| `/` | `14:2` | `20:2` | 5,735px |
| `/pricing` | `64:3` | `70:2` | 5,733px |
| `/consulting` | `71:3` | `73:2` | 6,830px |
| `/strategy` | `74:3` | `75:2` | 6,883px |
| `/investors` | `76:3` | `77:2` | 6,713px |
| `/enterprise` | `78:3` | `79:2` | 3,892px |
| `/agencies` | `80:3` | `80:124` | 6,961px |
| `/startups` | `81:3` | `81:125` | 7,069px |
| `/category-managers` | `82:3` | `82:124` | 6,851px |
| `/market-research` | `398:2` | `488:14` | 6,880px |
| `/academic` | `402:2` | `488:27` | 6,980px |
| `/security` | `406:2` | `565:2` | 5,887px |
| `/about` | `83:3` | `83:92` | 3,668px |
| `/404` (not-found.tsx) | `569:3` | `570:2` | 1,539px |
| Privacy + Terms | `84:3` / `84:84` | — | — |

---

## Architecture

**Page groups:**
1. **Homepage** (`/`) — unique design; 8 sections
2. **Pricing** (`/pricing`) — unique design; 6 sections
3. **Enterprise** (`/enterprise`) — unique design; 5 sections; sales-focused
4. **ICP pages × 8** — identical template (`ICPLayout`), different copy:
   `/consulting`, `/strategy`, `/investors`, `/agencies`, `/startups`, `/category-managers`, `/market-research`, `/academic`
5. **Security** (`/security`) — rebuild from Phase 0 placeholder; 8 sections
6. **About** (`/about`) — unique design; 5 sections
7. **404** (Next.js `not-found.tsx`) — simple dark page

**Shared components to create:**

| Component | Location | Used by |
|---|---|---|
| `ProductPreview` | `components/home/ProductPreview.tsx` | Homepage Hero, Homepage Category Claim |
| `AnalysisCard` | `components/ui/AnalysisCard.tsx` | Homepage, Pricing, ICP pages |
| `ICPLayout` | `components/icp/ICPLayout.tsx` | All 8 ICP pages |
| `PricingPlanCard` | `components/ui/PricingPlanCard.tsx` | Pricing page |
| `DeliverableCard` | `components/ui/DeliverableCard.tsx` | ICP pages (via ICPLayout) |

**Footer updates needed (per Figma):**
- Add LinkedIn (`in`) + X social icon buttons below tagline
- Add `Refund Policy` link to Trust & Legal column

---

## Design System Reference

All values are from Figma. When implementing, verify with `get_design_context` on the node ID.

**CSS tokens (defined in `globals.css` `@theme {}`):**
- `--surface-0`, `--surface-1` — page backgrounds
- `--text-primary`, `--text-secondary`, `--text-tertiary` — text
- `--accent` — red `#E8453C`; `--accent-hover` — slightly darker
- `--border`, `--border-strong` — dividers
- `--ink` — near-black footer/dark-section bg
- `--font-display` — editorial serif
- `--font-mono` — monospace for stats/metadata
- `--duration-fast` — transition duration

**Dark sections:** Apply `data-theme="dark"` on `<section>`. CSS variables automatically flip to dark values.

**Page max-width:** `max-w-[1280px] mx-auto px-5 md:px-10`

**Section vertical padding pattern:**
- Standard: `py-20 md:py-28`
- Hero: `pt-24 pb-28`
- CTA footer: `py-24 md:py-32`

**Typography scale:**
- Page H1/display: `font-[var(--font-display)] text-[64px] md:text-[72px] leading-[1.1]`
- Section H2: `font-[var(--font-display)] text-[36px] md:text-[44px] leading-tight`
- H3: `font-semibold text-[22px]` or `text-xl`
- Body large: `text-[17px] leading-relaxed`
- Body: `text-[15px] leading-relaxed`
- Overline: `text-[11px] font-semibold tracking-[0.08em] uppercase`
- Stat value: `font-[var(--font-mono)] text-[22px]` or larger

**CTA buttons:**
- Primary (red): `inline-flex items-center justify-center h-12 px-7 rounded text-[14px] font-semibold text-white bg-[var(--accent)] hover:bg-[var(--accent-hover)]`
- Ghost (outline): `inline-flex items-center justify-center h-12 px-6 rounded text-[14px] font-medium border border-current`

**Numbered steps (01/02/03):** `font-[var(--font-mono)] text-[var(--accent)] text-[22px] mb-4`

---

## Task 1: Footer — social icons + Refund Policy

**Files:**
- Modify: `components/layout/Footer.tsx`
- Modify: `__tests__/components/Footer.test.tsx`

The Figma footer (visible clearly in the 404 page screenshot) shows:
1. After the tagline: small square icon buttons for LinkedIn (`in`) and X (`X`), border `#2E2C28`
2. Trust & Legal column adds `Refund Policy` linking to `/refund`

**Steps:**

- [ ] **Step 1: Add two failing tests to `__tests__/components/Footer.test.tsx`**

```typescript
  it('renders LinkedIn social link', () => {
    render(<Footer />)
    expect(screen.getByRole('link', { name: /linkedin/i })).toBeInTheDocument()
  })

  it('renders Refund Policy link in Trust & Legal column', () => {
    render(<Footer />)
    const column = screen.getByTestId('footer-trust-legal')
    expect(within(column).getByRole('link', { name: /refund policy/i })).toBeInTheDocument()
  })
```

Add `import { within } from '@testing-library/react'` at top if not already present.

- [ ] **Step 2: Run tests — confirm the two new tests fail**

```bash
cd caspr-web && npm test -- __tests__/components/Footer.test.tsx
```

- [ ] **Step 3: Update `components/layout/Footer.tsx`**

**Change 1** — Add `Refund Policy` to Trust & Legal links array (after `GDPR`):
```typescript
{ label: 'Refund Policy', href: '/refund' },
```

**Change 2** — Replace the logo row `<div className="mb-12">` block with:
```tsx
{/* Logo row */}
<div className="mb-12">
  <Link href="/" className="font-[var(--font-display)] text-xl text-[#F5F4F0]">
    Caspr.
  </Link>
  <p className="mt-3 text-[13px] text-[#9C9A94] max-w-xs">
    Analytical AI — purpose-built for business analysis, not conversation.
  </p>
  {/* Social icons */}
  <div className="flex items-center gap-3 mt-4">
    <a
      href="https://linkedin.com/company/caspr-ai"
      aria-label="LinkedIn"
      target="_blank"
      rel="noopener noreferrer"
      className="w-7 h-7 flex items-center justify-center border border-[#2E2C28] rounded text-[#9C9A94] hover:text-[#F5F4F0] hover:border-[#5C5A55] transition-colors duration-[var(--duration-fast)] text-[11px] font-bold"
    >
      in
    </a>
    <a
      href="https://x.com/caspr_ai"
      aria-label="X (Twitter)"
      target="_blank"
      rel="noopener noreferrer"
      className="w-7 h-7 flex items-center justify-center border border-[#2E2C28] rounded text-[#9C9A94] hover:text-[#F5F4F0] hover:border-[#5C5A55] transition-colors duration-[var(--duration-fast)] text-[11px] font-bold"
    >
      X
    </a>
  </div>
</div>
```

- [ ] **Step 4: Run Footer tests — all pass**

```bash
npm test -- __tests__/components/Footer.test.tsx
```

- [ ] **Step 5: Full suite — no regressions**

```bash
npm test -- --passWithNoTests
```

- [ ] **Step 6: Commit**

```bash
git add components/layout/Footer.tsx __tests__/components/Footer.test.tsx
git commit -m "feat: footer — LinkedIn/X social icons and Refund Policy link"
```

---

## Task 2: ProductPreview component

**Files:**
- Create: `components/home/ProductPreview.tsx`
- Create: `__tests__/home/ProductPreview.test.tsx`

A decorative dark card mimicking a Caspr-generated report. Shown in Homepage Hero (right column) and Homepage Category Claim section. Takes no props — static content.

**Design (Figma node `14:2`, hero right panel):**
- Dark `bg-[var(--surface-1)]` card, border `border-[var(--border)]`, rounded, `overflow-hidden`
- Title bar: browser chrome row with 3 dots + monospace URL `caspr.ai · Competitive Analysis Report`
- Report title: `Competitive Analysis: Cloud Infrastructure 2024`
- Metadata mono line: `108 pages  ·  47 sources  ·  Generated in 12 min`
- Section heading: `03  Market Share Analysis`
- 4 skeleton lines (grey `h-[9px] rounded-sm` rectangles, varying widths)
- 3 data points row: `34%` / `21%` / `$480B` with labels
- Red citation line: `[12] Gartner Cloud Infrastructure Report, Q3 2024`
- 5 more skeleton lines
- Bottom-right: `Page 23 of 108` in tiny mono

- [ ] **Step 1: Write failing test**

```typescript
// __tests__/home/ProductPreview.test.tsx
import { render, screen } from '@testing-library/react'
import { ProductPreview } from '@/components/home/ProductPreview'

describe('ProductPreview', () => {
  it('renders the report title', () => {
    render(<ProductPreview />)
    expect(screen.getByText('Competitive Analysis: Cloud Infrastructure 2024')).toBeInTheDocument()
  })
  it('renders page count metadata', () => {
    render(<ProductPreview />)
    expect(screen.getByText(/108 pages/)).toBeInTheDocument()
  })
  it('renders the red citation', () => {
    render(<ProductPreview />)
    expect(screen.getByText(/Gartner Cloud Infrastructure Report/)).toBeInTheDocument()
  })
  it('renders page footer', () => {
    render(<ProductPreview />)
    expect(screen.getByText('Page 23 of 108')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Confirm test fails**

```bash
cd caspr-web && npm test -- __tests__/home/ProductPreview.test.tsx
```

- [ ] **Step 3: Implement**

Create `components/home/ProductPreview.tsx` — dark card with all elements described above. Use `font-[var(--font-mono)]` for metadata, `text-[var(--accent)]` for the citation, grey `bg-[rgba(92,91,88,0.4)]` for skeleton bars, monospace stats. The card should be approximately `w-full h-[580px] md:h-[640px]` with `overflow-hidden`.

Use `get_design_context` on node `14:2` and drill into the hero right panel for exact dimensions and spacing.

- [ ] **Step 4: Run tests — 4 pass**

```bash
npm test -- __tests__/home/ProductPreview.test.tsx
```

- [ ] **Step 5: Commit**

```bash
git add components/home/ProductPreview.tsx __tests__/home/ProductPreview.test.tsx
git commit -m "feat: add ProductPreview component — decorative report mock card"
```

---

## Task 3: AnalysisCard component

**Files:**
- Create: `components/ui/AnalysisCard.tsx`
- Create: `__tests__/components/AnalysisCard.test.tsx`

Reused on Homepage, Pricing page, and all ICP pages. Three analysis types: Brief, Study, Intelligence. Study is the `featured` (dark) variant.

**Props interface:**
```typescript
interface AnalysisCardProps {
  type: 'brief' | 'study' | 'intelligence'
  price: string        // "$15", "$80", "$300"
  timeframe: string    // "15 min  ·  1–3 pages"
  description: string  // one-line product description
  bullets: string[]    // 3-4 feature bullets
  href: string         // signup URL
  featured?: boolean   // Study card dark variant
}
```

**Design:**
- Non-featured: light bg `bg-[var(--surface-0)]`, border `border-[var(--border)]`, rounded
- Featured (Study): dark bg `data-theme="dark" bg-[var(--surface-0)]`, overline `MOST POPULAR` in `text-[var(--accent)]`
- Both: type label (e.g., `BRIEF`) in small uppercase + price in large mono + timeframe in mono + description + bullet list + CTA button
- CTA fires `start_free_clicked` PostHog event with `{ variant: 'analysis_card', analysis_type: type }`

- [ ] **Step 1: Write failing tests**

```typescript
// __tests__/components/AnalysisCard.test.tsx
import { render, screen } from '@testing-library/react'
import { AnalysisCard } from '@/components/ui/AnalysisCard'

jest.mock('posthog-js/react', () => ({ usePostHog: () => null }))

const BRIEF_PROPS = {
  type: 'brief' as const,
  price: '$15',
  timeframe: '15 min  ·  1–3 pages',
  description: 'The fastest way to answer a specific question.',
  bullets: ['Boardroom-ready PDF/PPTX', '25M+ curated sources', 'Every insight cited'],
  href: 'https://caspr.ai/signup',
}

describe('AnalysisCard', () => {
  it('renders type label and price', () => {
    render(<AnalysisCard {...BRIEF_PROPS} />)
    expect(screen.getByText('BRIEF')).toBeInTheDocument()
    expect(screen.getByText('$15')).toBeInTheDocument()
  })
  it('renders CTA link', () => {
    render(<AnalysisCard {...BRIEF_PROPS} />)
    expect(screen.getByRole('link', { name: /Start Free/i }))
      .toHaveAttribute('href', 'https://caspr.ai/signup')
  })
  it('featured variant shows MOST POPULAR', () => {
    render(<AnalysisCard {...BRIEF_PROPS} type="study" price="$80" featured />)
    expect(screen.getByText('MOST POPULAR')).toBeInTheDocument()
  })
  it('renders bullets', () => {
    render(<AnalysisCard {...BRIEF_PROPS} />)
    expect(screen.getByText('Boardroom-ready PDF/PPTX')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Confirm tests fail**

```bash
cd caspr-web && npm test -- __tests__/components/AnalysisCard.test.tsx
```

- [ ] **Step 3: Implement `components/ui/AnalysisCard.tsx`**

Mark `'use client'`. Import `usePostHog`. Two render paths: featured (dark) vs default (light). Structure: MOST POPULAR overline (featured only) → type label → price (large mono) → timeframe → description → divider → bullet list → CTA button. The CTA text: `"Start Free — first $100 on Caspr"`.

- [ ] **Step 4: Tests pass**

```bash
npm test -- __tests__/components/AnalysisCard.test.tsx
```

- [ ] **Step 5: Commit**

```bash
git add components/ui/AnalysisCard.tsx __tests__/components/AnalysisCard.test.tsx
git commit -m "feat: add AnalysisCard — Brief/Study/Intelligence pricing cards"
```

---

## Task 4: Homepage — Hero + Social Proof + How It Works

**Files:**
- Create: `app/page.tsx` (replace placeholder)
- Create: `__tests__/home/page.test.tsx` (begin integration test)

**Figma reference:** Desktop node `14:2`, mobile node `20:2`. Use `get_design_context` on the homepage frame's children to get exact section structure and copy.

**Section 01 — Hero (dark):**
- `data-theme="dark"`, dark background
- Layout: left copy stack + right ProductPreview (hidden on mobile)
- Overline: `"Analytical AI"`
- H1: `"15 minutes.\n100 pages.\nCited to source."` in display serif, large
- Body: `"Any question your board will ask. From $15. No subscription required."`
- CTAButton (primary, href=signup URL)
- Secondary link: `"See a sample report →"` → `/samples`
- Microcopy: `"No credit card  ·  25M+ curated sources  ·  Zero hallucinations"`

**Section 02 — Social Proof (light):**
- Light border-y strip
- `"Trusted by"` overline label
- Company names: use `get_design_context` on node `14:2` to get exact names visible in the strip (they appear to include VPC, Dartington, Cooklist, and others)

**Section 03 — How It Works (light):**
- Overline: `"How It Works"`
- H2: `"One prompt. Boardroom-ready output."`
- 3 bordered cards with numbered steps:
  - `01` / `"You ask"` / description
  - `02` / `"Caspr analyses"` / description
  - `03` / `"You present"` / description
- Use `get_design_context` on node `14:2` for exact step body copy

- [ ] **Step 1: Write the failing integration test skeleton**

```typescript
// __tests__/home/page.test.tsx
import { render, screen } from '@testing-library/react'
import HomePage from '@/app/page'

jest.mock('posthog-js/react', () => ({ usePostHog: () => null }))

describe('HomePage', () => {
  it('renders Hero headline', () => {
    render(<HomePage />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/15 minutes/)
  })
  it('renders Social Proof strip', () => {
    render(<HomePage />)
    expect(screen.getByText(/Trusted by/i)).toBeInTheDocument()
  })
  it('renders How It Works section', () => {
    render(<HomePage />)
    expect(screen.getByText(/One prompt\. Boardroom-ready output\./)).toBeInTheDocument()
    expect(screen.getByText('You ask')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run — confirm failures**

```bash
cd caspr-web && npm test -- __tests__/home/page.test.tsx
```

- [ ] **Step 3: Implement `app/page.tsx` with sections 01–03**

```typescript
import type { Metadata } from 'next'
// imports: Link, buildMetadata, CTAButton, Overline, ProductPreview

export const metadata: Metadata = buildMetadata({
  title: 'Caspr — Analytical AI for Business',
  description: 'Boardroom-ready analysis in 15 minutes. Cited to source. From $15.',
  path: '/',
  ogTitle: '15 minutes. 100 pages. Cited to source.',
  ogDescription: 'Caspr is Analytical AI — purpose-built for business analysis, not conversation.',
})

const SIGNUP_URL = 'https://caspr.ai/signup'

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      {/* Social Proof */}
      {/* How It Works */}
      {/* ... Tasks 5 & 6 will add remaining sections */}
    </>
  )
}
```

Build sections 01–03 fully. Use Figma `get_design_context` on `14:2` for all copy.

- [ ] **Step 4: Run integration tests — 3 pass**

```bash
npm test -- __tests__/home/page.test.tsx
```

- [ ] **Step 5: Full suite — no regressions**

```bash
npm test -- --passWithNoTests
```

- [ ] **Step 6: Commit**

```bash
git add app/page.tsx __tests__/home/page.test.tsx
git commit -m "feat: homepage — Hero, Social Proof, How It Works sections"
```

---

## Task 5: Homepage — Engine + Pricing + Testimonials + Category Claim + CTA

**Files:**
- Modify: `app/page.tsx` (add remaining sections)
- Modify: `__tests__/home/page.test.tsx` (add assertions for all new sections)

**Section 04 — The Engine (light):**
- Overline: `"The Engine"`
- H2: `"Built to reason. Not just retrieve."`
- Subheading: `"Two proprietary systems. One output you can defend."`
- Two-column grid:
  - Left: `"The Thinking Brain"` overline + headline + body
  - Right: `"The Learning Brain"` overline + headline + body
- Stats strip (border-t): `25M+` curated sources · `Real-time` live data · `Zero` hallucinations
- Use `get_design_context` on `14:2` for exact copy

**Section 05 — Pricing (light):**
- Overline: `"Plans & Pricing"`
- H2: `"The $50,000 question. From $15."`
- Body: `"The same analysis costs $50,000 from a consulting firm and takes weeks. Caspr delivers it in 15 minutes. Starting at $15."`
- 3-column grid of `AnalysisCard`:
  - Brief: `$15` · `"15 min  ·  1–3 pages"` · bullets from Figma
  - Study (featured): `$80` · `"1–2 hrs  ·  100 pages"` · bullets from Figma
  - Intelligence: `$300` · `"24 hrs  ·  Multi-model"` · bullets from Figma
- Footer note: `"Your first $100 is on Caspr — no credit card required."`

**Section 06 — Testimonials (light/off-white):**
- Overline: `"From the Field"`
- H2: `"For decisions that can't afford to be wrong."`
- 3 bordered cards with quote, name, title (use `get_design_context` for exact quotes)

**Section 07 — Category Claim (dark):**
- `data-theme="dark"`
- Left-right layout: text left + ProductPreview right
- Overline: `"A New Category"`
- H2: `"Generative AI writes.\nAnalytical AI analyses."`
- Body: about building analytical AI while the world built generative AI
- Copy exact from Figma node `14:2`

**Section 08 — Final CTA (dark):**
- `data-theme="dark"`
- Centered layout
- `"Caspr means Business."` — display serif
- Overline: `"Start for free"` (in accent red)
- H2: `"Your first $100. On us."`
- Body: no credit card, no subscription
- `CTAButton` (primary) + secondary link `"See a sample report →"`

- [ ] **Step 1: Add failing assertions to `__tests__/home/page.test.tsx`**

```typescript
  it('renders The Engine section', () => {
    render(<HomePage />)
    expect(screen.getByText(/Built to reason\. Not just retrieve\./)).toBeInTheDocument()
    expect(screen.getByText(/The Thinking Brain/)).toBeInTheDocument()
  })
  it('renders Pricing section with 3 cards', () => {
    render(<HomePage />)
    expect(screen.getByText('BRIEF')).toBeInTheDocument()
    expect(screen.getByText('STUDY')).toBeInTheDocument()
    expect(screen.getByText('INTELLIGENCE')).toBeInTheDocument()
  })
  it('renders Testimonials', () => {
    render(<HomePage />)
    expect(screen.getByText(/For decisions that can.t afford to be wrong/)).toBeInTheDocument()
  })
  it('renders Category Claim', () => {
    render(<HomePage />)
    expect(screen.getByText(/Generative AI writes\./)).toBeInTheDocument()
  })
  it('renders Final CTA', () => {
    render(<HomePage />)
    expect(screen.getByText(/Caspr means Business\./)).toBeInTheDocument()
    expect(screen.getByText(/Your first \$100\. On us\./)).toBeInTheDocument()
  })
```

- [ ] **Step 2: Confirm failures**

```bash
cd caspr-web && npm test -- __tests__/home/page.test.tsx
```

- [ ] **Step 3: Add sections 04–08 to `app/page.tsx`**

Use `get_design_context` on `14:2` to get exact copy for all sections. AnalysisCard bullets should match Figma exactly.

- [ ] **Step 4: All homepage tests pass**

```bash
npm test -- __tests__/home/page.test.tsx
```

- [ ] **Step 5: Full suite — no regressions**

```bash
npm test -- --passWithNoTests
```

- [ ] **Step 6: Commit**

```bash
git add app/page.tsx __tests__/home/page.test.tsx
git commit -m "feat: homepage — Engine, Pricing, Testimonials, Category Claim, Final CTA sections"
```

---

## Task 6: Pricing page (`/pricing`)

**Files:**
- Create: `app/pricing/page.tsx`
- Create: `__tests__/pricing/page.test.tsx`

**Figma reference:** Desktop node `64:3`, mobile node `70:2`. Use `get_design_context` on `64:3` to get all copy.

**Section 01 — Hero (dark):**
- `data-theme="dark"`
- Overline: `"Plans & Pricing"`
- H1: `"One budget.\nEvery analysis you need."`
- Body: about no retainer, no per-seat charges, Research Budget model, balance carries forward
- CTAButton (primary) + secondary link
- Trust bullets: no credit card · balance carries forward · cancel anytime
- ISO cert strip (small text row at bottom of hero)

**Section 02 — Plans (light, Figma overline: "Research Budget"):**
- H2: `"Institutional analysis. Without the institutional price."`
- Subheading: about Research Budget model
- 3 plan cards (left-to-right): Professional · Business (featured/dark) · Enterprise
  - Professional: `$200` Research Budget, features list, `Start Free` CTA
  - Business (featured): `$600` Research Budget, features list, `Start Free` CTA
  - Enterprise: `$1,800` Research Budget, features list, `Talk to us` CTA (links to `/enterprise`)
- Footer note: "First $100 on Caspr..."

> **Note on plan cards:** These are `PricingPlanCard` components. Create `components/ui/PricingPlanCard.tsx` with props: `{ name, price, subtitle, features: string[], ctaLabel, ctaHref, featured?: boolean }`.

**Section 03 — Analysis Levels (light, Figma overline: "What You Get"):**
- H2: `"Three levels of analysis. One Research Budget."`
- 3 `AnalysisCard` instances (Brief / Study / Intelligence) with full descriptions matching Figma

**Section 04 — FAQ (light, Figma overline: "Frequently Asked"):**
- H2: `"The Research Budget, explained."`
- 6 accordion items. Use `get_design_context` on `64:3` for exact questions and answers.
- Implement as `<details>`/`<summary>` HTML accordion (no JS state needed)

**Section 05 — Enterprise Team CTA (dark):**
- H2: `"One Research Budget. Shared across your team."`
- Body: 3 seats team budget, SSO + API, dedicated onboarding
- CTA button: `"Talk to us"` → `/enterprise`

**Section 06 — Page CTA (dark):**
- `"Caspr means Business."` display serif
- Overline: `"Start for free"` (accent red)
- H2: `"Your first $100. On us."`
- Body: no credit card, no subscription, no commitment
- CTAButton (primary) + secondary link `"See a sample report →"`

- [ ] **Step 1: Write failing tests**

```typescript
// __tests__/pricing/page.test.tsx
import { render, screen } from '@testing-library/react'
import PricingPage from '@/app/pricing/page'

jest.mock('posthog-js/react', () => ({ usePostHog: () => null }))

describe('PricingPage', () => {
  it('renders hero headline', () => {
    render(<PricingPage />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/One budget/)
  })
  it('renders three plan cards', () => {
    render(<PricingPage />)
    expect(screen.getByText('Professional')).toBeInTheDocument()
    expect(screen.getByText('Business')).toBeInTheDocument()
    expect(screen.getByText('Enterprise')).toBeInTheDocument()
  })
  it('renders analysis level cards', () => {
    render(<PricingPage />)
    expect(screen.getByText('BRIEF')).toBeInTheDocument()
    expect(screen.getByText('STUDY')).toBeInTheDocument()
    expect(screen.getByText('INTELLIGENCE')).toBeInTheDocument()
  })
  it('renders FAQ section', () => {
    render(<PricingPage />)
    expect(screen.getByText(/The Research Budget, explained\./)).toBeInTheDocument()
    expect(screen.getByText(/What is the Research Budget model\?/)).toBeInTheDocument()
  })
  it('renders page CTA', () => {
    render(<PricingPage />)
    expect(screen.getByText(/Caspr means Business\./)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Confirm failures**

```bash
cd caspr-web && npm test -- __tests__/pricing/page.test.tsx
```

- [ ] **Step 3: Create `components/ui/PricingPlanCard.tsx` and `app/pricing/page.tsx`**

PricingPlanCard props: `{ name: string, price: string, priceUnit: string, description: string, features: string[], ctaLabel: string, ctaHref: string, featured?: boolean }`. Mark `'use client'` only if PostHog needed. Featured card gets `data-theme="dark"`.

Use `get_design_context` on `64:3` to get exact plan features lists, FAQ questions/answers, and all copy.

- [ ] **Step 4: Tests pass**

```bash
npm test -- __tests__/pricing/page.test.tsx
```

- [ ] **Step 5: Full suite**

```bash
npm test -- --passWithNoTests
```

- [ ] **Step 6: Commit**

```bash
git add app/pricing/page.tsx components/ui/PricingPlanCard.tsx __tests__/pricing/page.test.tsx
git commit -m "feat: /pricing page — full implementation"
```

---

## Task 7: Enterprise page (`/enterprise`)

**Files:**
- Create: `app/enterprise/page.tsx`
- Create: `__tests__/enterprise/page.test.tsx`

**Figma reference:** Desktop node `78:3`, mobile node `79:2`. Compact page (~3,892px). Use `get_design_context`.

**Section 01 — Hero (dark):**
- Overline: `"Enterprise"`
- H1: `"Institutional-quality analysis,\nat institutional scale."`
- Body: `"Team-pooled research budgets. SSO. API access. Data room integration. The analytical infrastructure serious organisations need."`
- Stats row: `$1,800/mo` (Enterprise plan) · `3 seats` (Team access, pooled budget) · `API` (Integrate with internal systems)
- CTAs: `"Contact Sales"` (primary, red) + `"Start Free — first $100 on Caspr"` (ghost)

**Section 02 — What Enterprise Unlocks (light, overline: "What Enterprise Unlocks"):**
- H2: `"Everything in Business. Plus the infrastructure for teams."`
- 3 numbered items (01/02/03):
  - `"Team-pooled analysis budget"` + description
  - `"SSO and API access"` + description
  - `"Data room integration"` + description
- Use `get_design_context` on `78:3` for exact descriptions

**Section 03 — Pricing Card (light, overline: "Enterprise Plan"):**
- Left: headline `"$1,800 per month.\nPooled across your team."` + body + `"Contact Sales"` CTA
- Right: dark card with features list (8 bullet points)
- Features: 3 seats shared pool · $1,674 available · Brief/Study/Intelligence · Data upload/room · SSO · API · Priority support · Cancel any time
- Use `get_design_context` on `78:3` for exact feature copy

**Section 04 — Testimonial (light, overline: "What Enterprise Teams Say"):**
- Full-width block quote (no card border)
- Quote: `"We deployed Caspr across our strategy and M&A teams. The shared research budget eliminated the friction of per-project approvals. The output quality is boardroom-ready. It's become a core part of how we do pre-deal market analysis."`
- Attribution: `Chief Strategy Officer, Global Professional Services Firm`

**Section 05 — Page CTA (dark):**
- `"Caspr means Business."` display serif
- Overline: `"Get Started"`
- H2: `"Deploy Caspr across your team.\nOne shared budget. No per-seat waste. No approval friction."`
- Body: `"$1,800/month. Team-pooled. Cancel any time."`
- CTAs: `"Contact Sales"` (primary) + `"View pricing"` (ghost → `/pricing`)

- [ ] **Step 1: Write failing tests**

```typescript
// __tests__/enterprise/page.test.tsx
import { render, screen } from '@testing-library/react'
import EnterprisePage from '@/app/enterprise/page'

jest.mock('posthog-js/react', () => ({ usePostHog: () => null }))

describe('EnterprisePage', () => {
  it('renders hero headline', () => {
    render(<EnterprisePage />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Institutional-quality analysis/)
  })
  it('renders 3 enterprise features', () => {
    render(<EnterprisePage />)
    expect(screen.getByText('Team-pooled analysis budget')).toBeInTheDocument()
    expect(screen.getByText('SSO and API access')).toBeInTheDocument()
    expect(screen.getByText('Data room integration')).toBeInTheDocument()
  })
  it('renders pricing card', () => {
    render(<EnterprisePage />)
    expect(screen.getByText(/\$1,800 per month/)).toBeInTheDocument()
  })
  it('renders testimonial', () => {
    render(<EnterprisePage />)
    expect(screen.getByText(/We deployed Caspr across our strategy/)).toBeInTheDocument()
  })
  it('renders page CTA', () => {
    render(<EnterprisePage />)
    expect(screen.getByText(/Deploy Caspr across your team/)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Confirm failures**

```bash
cd caspr-web && npm test -- __tests__/enterprise/page.test.tsx
```

- [ ] **Step 3: Create `app/enterprise/page.tsx`**

Use `get_design_context` on `78:3` for all copy and exact feature lists.

- [ ] **Step 4: Tests pass**

```bash
npm test -- __tests__/enterprise/page.test.tsx
```

- [ ] **Step 5: Full suite**

```bash
npm test -- --passWithNoTests
```

- [ ] **Step 6: Commit**

```bash
git add app/enterprise/page.tsx __tests__/enterprise/page.test.tsx
git commit -m "feat: /enterprise page — full implementation"
```

---

## Task 8: ICPLayout template component

**Files:**
- Create: `components/icp/ICPLayout.tsx`
- Create: `__tests__/icp/ICPLayout.test.tsx`

All 8 ICP pages (`/consulting`, `/strategy`, `/investors`, `/agencies`, `/startups`, `/category-managers`, `/market-research`, `/academic`) use identical section structure with different copy. `ICPLayout` accepts all page-specific content as props and renders the complete page.

**Props interface:**

```typescript
// components/icp/ICPLayout.tsx
export interface ICPStat {
  value: string   // e.g. "24 hrs"
  label: string   // e.g. "analysis turnaround"
}

export interface ICPStep {
  num: string     // "01", "02", "03"
  heading: string
  body: string
}

export interface ICPFAQItem {
  question: string
  answer: string
}

export interface ICPLayoutProps {
  // SEO
  title: string
  description: string
  path: string

  // Hero
  audienceLabel: string      // e.g. "For Consulting"
  heroHeadline: string       // full headline text (use \n for line breaks)
  heroBody: string
  stats: ICPStat[]           // exactly 3 stats
  signupHref: string         // CTA link
  trustBullets: string[]     // 3 bullet points below CTA

  // Pain section
  painOverline: string
  painHeadline: string
  pains: ICPStep[]           // 3 pain cards

  // How section
  howOverline: string
  howHeadline: string
  steps: ICPStep[]           // 3 steps

  // Deliverable section
  deliverableReportTitle: string   // e.g. "Sodium Production for Pharma"
  deliverableReportSubtitle?: string

  // Pricing section
  pricingOverline: string
  pricingHeadline: string

  // Testimonial
  testimonialOverline: string
  testimonialQuote: string
  testimonialName: string
  testimonialTitle: string

  // FAQ
  faqItems: ICPFAQItem[]    // 4–5 items

  // Page CTA footer
  ctaHeadline: string        // e.g. "Run your first analysis on a live project."
}
```

**Section structure (in order):**
1. `<section data-theme="dark">` Hero — audience overline + H1 headline + body + stats row (3 items) + CTA + secondary link + trust bullets
2. `<section>` Pain — overline + H2 + 3 pain cards (num / heading / body)
3. `<section>` How — overline + H2 + 3 step cards (num / heading / body)
4. `<section data-theme="dark">` Deliverable — `"The deliverable."` heading + DeliverableCard (dark report card with title + play button)
5. `<section data-theme="dark">` Analytical AI — `"Generative AI writes.\nAnalytical AI analyses."` + description para
6. `<section>` Pricing — overline + H2 headline + 3 `AnalysisCard` instances (Brief $15, Study $80 featured, Intelligence $300)
7. `<section>` Testimonial — overline + large blockquote + name + title with circular avatar placeholder
8. `<section>` Trust Pillars — 3 columns: `"Every insight cited to source"` / `"Built by analysts who set the standard"` / `"Your first $100 on Caspr"`
9. `<section>` FAQ — H2 `"Frequently Asked Questions"` + `<details>`/`<summary>` accordion items
10. `<section data-theme="dark">` Page CTA — `"Caspr means Business."` + `ctaHeadline` + CTAButton

**Deliverable card design:**
A dark card (`bg-[var(--surface-0)]` in dark context) with:
- Caspr logo mark top-left
- Report title in serif (`text-[22px] font-[var(--font-display)]`)
- Red play button (circular, `bg-[var(--accent)]`)
- Bottom strip: type label + page count metadata in mono
- Overall: bordered, rounded, shadow, desktop ~`h-[340px]`

**Trust Pillars section:**
Three equal-width columns on desktop, stacked on mobile. Each has:
- Red overline (e.g., `"01"` or category label)
- H3 heading
- Body text
Use `get_design_context` on `71:3` (consulting) to get the exact copy for these 3 pillars.

- [ ] **Step 1: Write ICPLayout tests**

```typescript
// __tests__/icp/ICPLayout.test.tsx
import { render, screen } from '@testing-library/react'
import { ICPLayout } from '@/components/icp/ICPLayout'

jest.mock('posthog-js/react', () => ({ usePostHog: () => null }))

const MOCK_PROPS = {
  title: 'Test ICP Page',
  description: 'Test description',
  path: '/test',
  audienceLabel: 'For Testing',
  heroHeadline: 'The headline.\nSecond line.',
  heroBody: 'Hero body text.',
  stats: [
    { value: '24 hrs', label: 'turnaround' },
    { value: '3M+', label: 'sources' },
    { value: '$80', label: 'per analysis' },
  ],
  signupHref: 'https://caspr.ai/signup',
  trustBullets: ['Bullet one', 'Bullet two', 'Bullet three'],
  painOverline: 'The Problem',
  painHeadline: 'Pain headline here.',
  pains: [
    { num: '01', heading: 'Pain one', body: 'Pain one body.' },
    { num: '02', heading: 'Pain two', body: 'Pain two body.' },
    { num: '03', heading: 'Pain three', body: 'Pain three body.' },
  ],
  howOverline: 'How It Works',
  howHeadline: 'How headline here.',
  steps: [
    { num: '01', heading: 'Step one', body: 'Step one body.' },
    { num: '02', heading: 'Step two', body: 'Step two body.' },
    { num: '03', heading: 'Step three', body: 'Step three body.' },
  ],
  deliverableReportTitle: 'Sample Report Title',
  pricingOverline: 'Pricing',
  pricingHeadline: 'Pricing headline.',
  testimonialOverline: 'From the Field',
  testimonialQuote: 'This is the testimonial quote.',
  testimonialName: 'Jane Doe',
  testimonialTitle: 'CEO, Test Company',
  faqItems: [
    { question: 'FAQ question one?', answer: 'FAQ answer one.' },
    { question: 'FAQ question two?', answer: 'FAQ answer two.' },
  ],
  ctaHeadline: 'CTA headline here.',
}

describe('ICPLayout', () => {
  it('renders audience label', () => {
    render(<ICPLayout {...MOCK_PROPS} />)
    expect(screen.getByText('For Testing')).toBeInTheDocument()
  })
  it('renders hero headline', () => {
    render(<ICPLayout {...MOCK_PROPS} />)
    expect(screen.getByText(/The headline\./)).toBeInTheDocument()
  })
  it('renders 3 stats', () => {
    render(<ICPLayout {...MOCK_PROPS} />)
    expect(screen.getByText('24 hrs')).toBeInTheDocument()
    expect(screen.getByText('3M+')).toBeInTheDocument()
  })
  it('renders 3 pain cards', () => {
    render(<ICPLayout {...MOCK_PROPS} />)
    expect(screen.getByText('Pain one')).toBeInTheDocument()
    expect(screen.getByText('Pain three')).toBeInTheDocument()
  })
  it('renders 3 step cards', () => {
    render(<ICPLayout {...MOCK_PROPS} />)
    expect(screen.getByText('Step one')).toBeInTheDocument()
  })
  it('renders deliverable card title', () => {
    render(<ICPLayout {...MOCK_PROPS} />)
    expect(screen.getByText('Sample Report Title')).toBeInTheDocument()
  })
  it('renders Analytical AI positioning section', () => {
    render(<ICPLayout {...MOCK_PROPS} />)
    expect(screen.getByText(/Generative AI writes\./)).toBeInTheDocument()
  })
  it('renders 3 analysis pricing cards', () => {
    render(<ICPLayout {...MOCK_PROPS} />)
    expect(screen.getByText('BRIEF')).toBeInTheDocument()
    expect(screen.getByText('STUDY')).toBeInTheDocument()
    expect(screen.getByText('INTELLIGENCE')).toBeInTheDocument()
  })
  it('renders testimonial', () => {
    render(<ICPLayout {...MOCK_PROPS} />)
    expect(screen.getByText('This is the testimonial quote.')).toBeInTheDocument()
    expect(screen.getByText('Jane Doe')).toBeInTheDocument()
  })
  it('renders FAQ accordion', () => {
    render(<ICPLayout {...MOCK_PROPS} />)
    expect(screen.getByText('FAQ question one?')).toBeInTheDocument()
  })
  it('renders page CTA', () => {
    render(<ICPLayout {...MOCK_PROPS} />)
    expect(screen.getByText('CTA headline here.')).toBeInTheDocument()
    expect(screen.getByText(/Caspr means Business\./)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Confirm failures**

```bash
cd caspr-web && npm test -- __tests__/icp/ICPLayout.test.tsx
```

- [ ] **Step 3: Implement `components/icp/ICPLayout.tsx`**

- Mark `'use client'` only if needed (it will use AnalysisCard which is client — so yes, `'use client'` OR keep AnalysisCard as server component with its own client wrapper)
- Build all 10 sections as described above
- Headline with line breaks: split `heroHeadline` on `\n` and render each line in a `<span className="block">`
- Deliverable card: dark card, report title in serif, red circular play button
- Analytical AI section: centered, italic/serif large text
- Trust Pillars: 3-column grid
- FAQ: native `<details>`/`<summary>` — no JS required

- [ ] **Step 4: All ICPLayout tests pass**

```bash
npm test -- __tests__/icp/ICPLayout.test.tsx
```

- [ ] **Step 5: Full suite**

```bash
npm test -- --passWithNoTests
```

- [ ] **Step 6: Commit**

```bash
git add components/icp/ICPLayout.tsx __tests__/icp/ICPLayout.test.tsx
git commit -m "feat: add ICPLayout template component — 10-section ICP page template"
```

---

## Task 9: ICP page — `/consulting`

**Files:**
- Create: `app/consulting/page.tsx`
- Create: `__tests__/consulting/page.test.tsx`

**Figma reference:** Desktop `71:3`, mobile `73:2`. Use `get_design_context` on `71:3` to extract all copy before implementing.

**Page content (from Figma):**

| Field | Value |
|---|---|
| audienceLabel | `"For Consulting"` |
| heroHeadline | `"The sector you've never covered.\nThe client briefing is tomorrow."` |
| heroBody | `"Caspr handles 25M+ curated sources, reads the landscape, and cites every claim — in hours. Your team does the Thinking. Caspr does the Thinking."` |
| stats | `24 hrs` · `3M+` curated sources · `$15–$80` per analysis |
| trustBullets | verify from Figma `71:3` |
| painOverline | `"The Problem"` |
| painHeadline | `"The analysis never matches the deadline."` |
| pains (01) | `"Scoped 48% of my time floating desks..."` (verify from Figma) |
| pains (02) | `"Last minute is constant in consulting..."` |
| pains (03) | `"The client presentation is 48 hours away..."` |
| howOverline | `"How It Works"` |
| howHeadline | `"From brief to boardroom. In hours, not days."` |
| steps (01) | `"Describe the analysis you need"` |
| steps (02) | `"Caspr analyses 25M+ curated sources"` |
| steps (03) | `"You receive a boardroom-ready deliverable"` |
| deliverableReportTitle | `"Sodium Production for Pharma"` |
| pricingOverline | `"Prompt to Cited Report"` |
| pricingHeadline | `"The secondary analysis layer your firm delegates to junior analysts. For $80."` |
| testimonialOverline | `"From the Field"` |
| testimonialQuote | `"I needed a competitive landscape for a new sector by Thursday morning. Caspr produced a 100-page cited analysis in 3 hours. The partner asked one question about a data point — I had the source open in 10 seconds."` |
| testimonialName | `"Senior Consultant"` |
| testimonialTitle | `"Top-3 Consulting Firm"` |
| faqItems | 4 items — verify from Figma `71:3` |
| ctaHeadline | `"Run your first analysis on a live project."` |

> **Important:** Use `get_design_context` on `71:3` and drill into each section to verify all copy. The table above is a guide from screenshot reading — Figma is authoritative.

- [ ] **Step 1: Write failing test**

```typescript
// __tests__/consulting/page.test.tsx
import { render, screen } from '@testing-library/react'
import ConsultingPage from '@/app/consulting/page'

jest.mock('posthog-js/react', () => ({ usePostHog: () => null }))

describe('ConsultingPage', () => {
  it('renders hero headline', () => {
    render(<ConsultingPage />)
    expect(screen.getByText(/The sector you've never covered\./)).toBeInTheDocument()
  })
  it('renders audience label', () => {
    render(<ConsultingPage />)
    expect(screen.getByText(/For Consulting/i)).toBeInTheDocument()
  })
  it('renders deliverable report title', () => {
    render(<ConsultingPage />)
    expect(screen.getByText('Sodium Production for Pharma')).toBeInTheDocument()
  })
  it('renders testimonial', () => {
    render(<ConsultingPage />)
    expect(screen.getByText(/I needed a competitive landscape/)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Confirm failure**

```bash
cd caspr-web && npm test -- __tests__/consulting/page.test.tsx
```

- [ ] **Step 3: Create `app/consulting/page.tsx`**

```typescript
import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/metadata'
import { ICPLayout } from '@/components/icp/ICPLayout'

export const metadata: Metadata = buildMetadata({
  title: 'Caspr for Consulting Firms — Analyst-Grade Research in Hours',
  description: 'Caspr delivers boardroom-ready sector analysis in hours. The secondary research layer your firm needs — without the junior analyst bottleneck.',
  path: '/consulting',
})

export default function ConsultingPage() {
  return (
    <ICPLayout
      title="Caspr for Consulting Firms"
      description="..."
      path="/consulting"
      audienceLabel="For Consulting"
      heroHeadline={"The sector you've never covered.\nThe client briefing is tomorrow."}
      // ... all props
    />
  )
}
```

Use `get_design_context` to get all copy before filling props.

- [ ] **Step 4: Tests pass, full suite clean**

```bash
npm test -- __tests__/consulting/page.test.tsx && npm test -- --passWithNoTests
```

- [ ] **Step 5: Commit**

```bash
git add app/consulting/page.tsx __tests__/consulting/page.test.tsx
git commit -m "feat: /consulting page — ICPLayout with consulting-specific content"
```

---

## Task 10: ICP pages — `/strategy` + `/investors`

**Files:**
- Create: `app/strategy/page.tsx` + `__tests__/strategy/page.test.tsx`
- Create: `app/investors/page.tsx` + `__tests__/investors/page.test.tsx`

**Figma references:** Strategy `74:3` / `75:2` · Investors `76:3` / `77:2`. Use `get_design_context` on each node before implementing.

**Strategy content summary:**
- audienceLabel: verify from `74:3`
- heroHeadline: verify from `74:3`
- deliverableReportTitle: verify from `74:3`
- Get all copy from Figma

**Investors content (from screenshot):**

| Field | Value |
|---|---|
| audienceLabel | verify from `76:3` |
| heroHeadline | `"The deal lands Monday.\nSector context is ready Tuesday."` |
| heroBody | `"Upload the data room. Caspr wraps it in context-market intelligence. The investment memo writes within the thinking."` |
| stats | `24 hrs` · `3M+` curated sources · `$399` Intelligence |
| painHeadline | `"Deals move faster than context can be assembled."` |
| howHeadline | `"From deal arrival to IC-ready intelligence. In hours."` |
| deliverableReportTitle | `"European B2B HR Tech Investment"` |
| testimonialQuote | `"Sector context before the first founder meeting. That's what Caspr gives us. The first time we're in the room is the best time to be the smartest in it. The speed is something else entirely."` |
| testimonialName | `"Principal"` |
| testimonialTitle | `"European Equity Fund"` |
| ctaHeadline | `"Sector context before the first founder meeting."` |

> Use `get_design_context` on each node to verify. Screenshot reading may miss details.

- [ ] **Step 1: Write failing tests for both pages**
- [ ] **Step 2: Confirm failures**
- [ ] **Step 3: Create both page files using `ICPLayout`**
- [ ] **Step 4: Tests pass for both pages**
- [ ] **Step 5: Full suite clean**

```bash
npm test -- --passWithNoTests
```

- [ ] **Step 6: Commit**

```bash
git add app/strategy/page.tsx __tests__/strategy/page.test.tsx app/investors/page.tsx __tests__/investors/page.test.tsx
git commit -m "feat: /strategy and /investors pages — ICPLayout with audience-specific content"
```

---

## Task 11: ICP pages — `/agencies` + `/startups`

**Files:**
- Create: `app/agencies/page.tsx` + `__tests__/agencies/page.test.tsx`
- Create: `app/startups/page.tsx` + `__tests__/startups/page.test.tsx`

**Figma references:** Agencies `80:3` / `80:124` · Startups `81:3` / `81:125`. Use `get_design_context` on each node.

**Agencies content (from screenshot):**

| Field | Value |
|---|---|
| heroHeadline | `"Know your client's industry better than they do.\nEvery time. Before the briefing."` |
| stats | `Hours` · `100 pages` · `$15–$80` |
| painHeadline | `"Agencies run 3–5 pitches a month. Each one starts from zero."` |
| howHeadline | `"New sector. The brief lands Thursday. The pitch is Friday."` |
| deliverableReportTitle | `"UK Sustainable Personal Care Pitch Brief"` |
| testimonialQuote | `"We walk into every briefing knowing the client's sector better than they expected us to. That's the first impression that wins retainers. Caspr now before the pitch. My insights on the pitch."` |
| testimonialTitle | `"Strategy Director, Creative Agency"` |
| ctaHeadline | `"New sector. The brief lands Thursday. The pitch is Friday."` |

**Startups content:** Use `get_design_context` on `81:3` for all copy.

- [ ] **Step 1: Write failing tests for both pages**
- [ ] **Step 2: Confirm failures**
- [ ] **Step 3: Create both page files using `ICPLayout`**
- [ ] **Step 4: Tests pass**
- [ ] **Step 5: Full suite clean**
- [ ] **Step 6: Commit**

```bash
git add app/agencies/page.tsx __tests__/agencies/page.test.tsx app/startups/page.tsx __tests__/startups/page.test.tsx
git commit -m "feat: /agencies and /startups pages — ICPLayout with audience-specific content"
```

---

## Task 12: ICP pages — `/category-managers` + `/market-research`

**Files:**
- Create: `app/category-managers/page.tsx` + `__tests__/category-managers/page.test.tsx`
- Create: `app/market-research/page.tsx` + `__tests__/market-research/page.test.tsx`

**Figma references:** Category Managers `82:3` / `82:124` · Market Research `398:2` / `488:14`.

**Market Research content (from screenshot):**

| Field | Value |
|---|---|
| heroHeadline | `"The desk research that used to take two days.\nDone before your first client call."` |
| painHeadline | `"The pre-fieldwork phase consumes every engagement."` |
| howHeadline | `"From prompt to cited landscape. In hours, not days."` |
| deliverableReportTitle | `"UK Embedded Finance & BNPL Consumer Brief"` |
| pricingHeadline | `"From prompt to cited landscape. A line item in your project budget."` |
| testimonialQuote | `"We spent two to three days on pre-fieldwork for every project. Caspr does it in hours. Every claim is cited. We send it straight to the client."` |
| testimonialTitle | `"Research Director, Research Agency"` |
| ctaHeadline | `"The pre-fieldwork phase is over."` |

**Category Managers content:** Use `get_design_context` on `82:3` for all copy.

- [ ] **Step 1–6:** Same pattern as Tasks 9–11

```bash
git add app/category-managers/page.tsx __tests__/category-managers/page.test.tsx app/market-research/page.tsx __tests__/market-research/page.test.tsx
git commit -m "feat: /category-managers and /market-research pages — ICPLayout with audience-specific content"
```

---

## Task 13: ICP page — `/academic`

**Files:**
- Create: `app/academic/page.tsx`
- Create: `__tests__/academic/page.test.tsx`

**Figma reference:** Desktop `402:2`, mobile `488:27`. Use `get_design_context` on `402:2` for all copy.

This is the academic researcher audience page. Follow the same ICPLayout pattern. Extract all section copy from Figma before implementing.

- [ ] **Step 1–5:** Same pattern as other ICP pages

```bash
git add app/academic/page.tsx __tests__/academic/page.test.tsx
git commit -m "feat: /academic page — ICPLayout with academic researcher content"
```

---

## Task 14: Security page (`/security`) — full rebuild

**Files:**
- Replace: `app/security/page.tsx`
- Replace: `__tests__/security/page.test.tsx`

**Figma reference:** Desktop `406:2`, mobile `565:2`. This is a full rebuild of the Phase 0 placeholder — the Figma design is comprehensive.

**Section 01 — Hero (dark):**
- Overline: `"Information Security"`
- H1: `"Your analysis is yours.\nFull stop."`
- Body: GDPR/ISO compliance statement
- CTA: `"Run an analysis, start free"` + secondary link `"See our security posture →"`
- Certification strip (below CTA): `ISO 27001:2022` · `GDPR` · `SOC 2 Type I` · `[n] more in progress`

**Section 02 — Certifications (light, overline: "Certifications"):**
- H2: `"Independently audited. Not self-reported."`
- 3 items (01/02/03):
  - ISO 27001:2022 — independently audited
  - GDPR Compliant — Data Processing Agreements
  - SOC 2 Type I — Audit in Progress

**Section 03 — Data Residency (light, overline: "Data Architecture"):**
- H2: `"Your documents never leave Caspr's infrastructure."`
- 3 items (01/02/03):
  - Uploaded files — self-hosted on AWS infrastructure
  - Chat session text — Zero Data Retention
  - AES-256 at rest · TLS 1.3 in transit

**Section 04 — No Training (dark):**
- H2 (large, centered): `"Your data never trains\nany model. Ever."`
- Body: explanation of architecture decision

**Section 05 — Data Retention (light, overline: "Data Retention Policy"):**
- H2: `"You control your data.\nWe delete it on request."`
- 3 columns: `90 days` standard · `1 year` premium/business · `0 days` ZDR (Enterprise)
- CTA button: `"Review options — 30-day comparison →"`

**Section 06 — Testimonial (light, overline: "Enterprise Security"):**
- Block quote from Joy Sharma (Founder, Caspr)
- Quote: `"Every enterprise prospect runs a security review. Every one has passed. ISO 27001:2022, zero data retention, and our CTO-led security questionnaire process moves procurement forward without delay."`

**Section 07 — Compliance Features (light, overline: "Advanced Infrastructure"):**
- 4 feature columns: GDPR compliant · No AI training · Deletion certificate issued
- Use `get_design_context` on `406:2` for all copy

**Section 08 — FAQ (light, overline: "Frequently Asked Security"):**
- H2: `"Frequently Asked Questions"`
- 5 items — use `get_design_context` on `406:2` for questions/answers

**Section 09 — Page CTA (dark):**
- H2: `"Secure analysis starts free."`
- Body: ISO certified, $100 gifted, no credit card
- CTAButton (primary)

- [ ] **Step 1: Write failing tests (replace existing security tests)**

```typescript
// __tests__/security/page.test.tsx
import { render, screen } from '@testing-library/react'
import SecurityPage from '@/app/security/page'

jest.mock('posthog-js/react', () => ({ usePostHog: () => null }))

describe('SecurityPage', () => {
  it('renders hero headline', () => {
    render(<SecurityPage />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Your analysis is yours/)
  })
  it('renders ISO certification', () => {
    render(<SecurityPage />)
    expect(screen.getAllByText(/ISO 27001:2022/).length).toBeGreaterThan(0)
  })
  it('renders no-training section', () => {
    render(<SecurityPage />)
    expect(screen.getByText(/Your data never trains/)).toBeInTheDocument()
  })
  it('renders data retention values', () => {
    render(<SecurityPage />)
    expect(screen.getByText('90 days')).toBeInTheDocument()
  })
  it('renders FAQ section', () => {
    render(<SecurityPage />)
    expect(screen.getByText(/Frequently Asked Questions/)).toBeInTheDocument()
  })
  it('renders page CTA', () => {
    render(<SecurityPage />)
    expect(screen.getByText(/Secure analysis starts free\./)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Confirm failures**

```bash
cd caspr-web && npm test -- __tests__/security/page.test.tsx
```

- [ ] **Step 3: Replace `app/security/page.tsx`**

Use `get_design_context` on `406:2` for all copy, exact feature text, and FAQ Q&A. Build all 9 sections.

- [ ] **Step 4: Tests pass**

```bash
npm test -- __tests__/security/page.test.tsx
```

- [ ] **Step 5: Full suite**

```bash
npm test -- --passWithNoTests
```

- [ ] **Step 6: Commit**

```bash
git add app/security/page.tsx __tests__/security/page.test.tsx
git commit -m "feat: /security page — full rebuild from Figma design"
```

---

## Task 15: About page (`/about`)

**Files:**
- Create: `app/about/page.tsx`
- Create: `__tests__/about/page.test.tsx`

**Figma reference:** Desktop `83:3`, mobile `83:92`. Use `get_design_context` on `83:3`.

**Section 01 — Hero (dark):**
- Overline: `"About Caspr"`
- H1: `"Built by the analyst who has spent 15 years producing exactly this kind of analysis."`
- Subheading: `"And then automated it."`

**Section 02 — The Story (light, overline: "The Story"):**
- Left: H2 + 3 body paragraphs about Joy Sharma (McKinsey background, EZ company, co-founding Caspr with Jayant)
- Right: Two founder cards stacked vertically:
  - **Joy Sharma** — Co-Founder & CEO — circular avatar placeholder + bio summary
  - **Jayant** — Co-Founder & CTO — circular avatar placeholder + bio summary
- Use `get_design_context` on `83:3` for exact bio copy

**Section 03 — What Caspr Is (light, overline: "What Caspr Is"):**
- H2: `"While the world was building generative AI, we built analytical AI."`
- Subheading: `"Generative AI produces language. Analytical AI produces conclusions."`
- 3 feature cards:
  - B1: `"The Thinking Brain"` + description
  - B2: `"The Learning Brain"` + description
  - B3: `"Zero hallucinations by design"` + description
- Use `get_design_context` on `83:3` for descriptions

**Section 04 — Mission Quote (dark, overline: "Why We Exist"):**
- Large block quote: `"Institutional-quality business analysis has been gated behind institutional budgets for too long. Caspr exists to give every serious professional access to the same analytical rigour that used to require a McKinsey retainer."`
- Attribution: `— Joy Sharma, Co-Founder & CEO`

**Section 05 — Page CTA (light):**
- `"Caspr means Business."` display serif
- Overline: `"Get Started"` (accent)
- H2: `"Experience the analysis. First $100 on Caspr."`
- Body: no credit card, cancel any time, boardroom-ready in 15 minutes
- CTAButton (primary)

- [ ] **Step 1: Write failing tests**

```typescript
// __tests__/about/page.test.tsx
import { render, screen } from '@testing-library/react'
import AboutPage from '@/app/about/page'

jest.mock('posthog-js/react', () => ({ usePostHog: () => null }))

describe('AboutPage', () => {
  it('renders hero headline', () => {
    render(<AboutPage />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Built by the analyst/)
  })
  it('renders founder names', () => {
    render(<AboutPage />)
    expect(screen.getByText('Joy Sharma')).toBeInTheDocument()
    expect(screen.getByText('Jayant')).toBeInTheDocument()
  })
  it('renders What Caspr Is section', () => {
    render(<AboutPage />)
    expect(screen.getByText(/While the world was building generative AI/)).toBeInTheDocument()
    expect(screen.getByText('The Thinking Brain')).toBeInTheDocument()
  })
  it('renders mission quote', () => {
    render(<AboutPage />)
    expect(screen.getByText(/gated behind institutional budgets/)).toBeInTheDocument()
  })
  it('renders page CTA', () => {
    render(<AboutPage />)
    expect(screen.getByText(/Experience the analysis\./)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2–6:** Same pattern — confirm failures, implement, verify, commit

```bash
git add app/about/page.tsx __tests__/about/page.test.tsx
git commit -m "feat: /about page — full implementation"
```

---

## Task 16: 404 page (not-found.tsx)

**Files:**
- Create: `app/not-found.tsx`
- Create: `__tests__/not-found.test.tsx`

**Figma reference:** Desktop `569:3`, mobile `570:2`.

**Design:**
- Full page: dark background (`bg-[var(--ink)]`) from nav to footer edge
- **Section 01 — 404 Hero (dark, full viewport height):**
  - `"404"` in display serif, very large (`text-[180px] md:text-[240px]`), `text-[var(--accent)]`
  - H1: `"This page doesn't exist."` — display serif, white, large
  - Body: `"The analysis you're looking for isn't here. But the one you need probably is."`
  - Two CTAs side by side:
    - Primary (red): `"Start Free — first $100 on Caspr"` → signup URL
    - Ghost (border): `"← Back to Home"` → `/`
- **Section 02 — Pages That Do Exist (light/surface):**
  - Overline (red): `"PAGES THAT DO EXIST"`
  - 5 cards in a row (or responsive grid): Consulting · Strategy · Investors · Pricing · Security
  - Each card: route name + one-line description
  - Link each to its respective page

Note: Next.js `not-found.tsx` exports a default component (no `metadata` export — use `generateMetadata` pattern or the 404 inherits root layout metadata).

- [ ] **Step 1: Write failing test**

```typescript
// __tests__/not-found.test.tsx
import { render, screen } from '@testing-library/react'
import NotFound from '@/app/not-found'

jest.mock('posthog-js/react', () => ({ usePostHog: () => null }))

describe('NotFound page', () => {
  it('renders 404 in the page', () => {
    render(<NotFound />)
    expect(screen.getByText('404')).toBeInTheDocument()
  })
  it("renders headline", () => {
    render(<NotFound />)
    expect(screen.getByText(/This page doesn.t exist\./)).toBeInTheDocument()
  })
  it('renders Start Free link', () => {
    render(<NotFound />)
    expect(screen.getByRole('link', { name: /Start Free/i })).toBeInTheDocument()
  })
  it('renders Back to Home link', () => {
    render(<NotFound />)
    expect(screen.getByRole('link', { name: /Back to Home/i })).toBeInTheDocument()
  })
  it('renders pages-that-do-exist section', () => {
    render(<NotFound />)
    expect(screen.getByText(/Pages that do exist/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Consulting/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Pricing/i })).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Confirm failures**

```bash
cd caspr-web && npm test -- __tests__/not-found.test.tsx
```

- [ ] **Step 3: Create `app/not-found.tsx`**

- Dark full-width hero: "404" in giant red text, serif headline, body, 2 CTA buttons
- Light section below: overline + 5 page cards linking to their routes
- Use Figma `get_design_context` on `569:3` for exact card descriptions

- [ ] **Step 4: Tests pass**

```bash
npm test -- __tests__/not-found.test.tsx
```

- [ ] **Step 5: Full suite**

```bash
npm test -- --passWithNoTests
```

- [ ] **Step 6: Commit**

```bash
git add app/not-found.tsx __tests__/not-found.test.tsx
git commit -m "feat: 404 not-found page — branded dark page with page discovery section"
```

---

## Final Verification Checklist

After all 16 tasks complete:

- [ ] `npm test -- --passWithNoTests` — all tests pass
- [ ] `npm run build` — clean production build, zero type errors
- [ ] All 15 Figma pages have production-quality implementations
- [ ] Footer has LinkedIn/X icons and Refund Policy link
- [ ] All pages include SEO metadata via `buildMetadata`
- [ ] Mobile responsiveness: every page has been designed for both breakpoints — implement with Tailwind responsive prefixes matching Figma mobile frames
- [ ] Dark sections use `data-theme="dark"` on `<section>` (not global)
- [ ] All CTA buttons fire `start_free_clicked` PostHog event

---

## Notes for Subagents

1. **Always use `get_design_context` before writing copy.** The text in this plan is from screenshot reading which may miss details. Figma is the authoritative source. Call `get_design_context` on the desktop node ID for each page before implementing it.

2. **Mobile responsiveness is required.** Every page has a mobile Figma frame. After building the desktop layout, reference the mobile node to verify responsive breakpoints (especially column collapsing, font size changes, and padding).

3. **`'use client'` directive:** Required on any component using PostHog hooks. Pages that use `ICPLayout` or `AnalysisCard` need to check if the client directive propagates correctly.

4. **Signup URL constant:** Use `const SIGNUP_URL = 'https://caspr.ai/signup'` at the top of every page file that needs it.

5. **ICPLayout pages — SEO metadata:** Each ICP page needs a unique `title` and `description` in `buildMetadata`. These should be audience-specific and match the page intent (e.g., for `/consulting`: "Caspr for Consulting Firms — Analyst-Grade Research in Hours").

6. **The deliverable section in ICPLayout:** The dark card showing the report preview is purely decorative. It does NOT need to be clickable. The play button is visual only.

7. **FAQ accordion:** Use native HTML `<details>`/`<summary>` — no React state required. Style with CSS: `summary::-webkit-details-marker { display: none }` and custom chevron via `::after` pseudo-element or a rotated arrow.
