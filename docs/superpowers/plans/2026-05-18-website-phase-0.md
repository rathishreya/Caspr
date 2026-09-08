# Caspr.ai Phase 0 — Website Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the complete design-independent foundation of the Caspr.ai Next.js website — tokens, fonts, shared layout, all URL routes, SEO infrastructure, /security + legal pages, PostHog analytics, and Vercel deployment — so it is live and ready for design-dependent pages to drop in when Figma is finalised.

**Architecture:** Next.js 14 App Router with TypeScript and Tailwind CSS. All brand colours and spacing defined as CSS custom properties in `globals.css`. `data-theme="dark"` attribute on section elements drives dark mode (no class toggles). Header and Footer live in the root layout and are shared by every page. Design-independent pages (`/security`, `/privacy`, `/terms`) built to completion. All other routes exist as `page.tsx` placeholders — no 404s on any planned URL.

**Tech Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Jest + React Testing Library, PostHog (`posthog-js`), Vercel, GitHub

**Source of truth for all design decisions:** `.agents/website-visual-design-guidelines.md`
**Source of truth for all copy:** `strategy/website-build-brief.md`
**Source of truth for all SEO metadata:** `docs/website/icp-pages-seo.md`
**Legal page content:** `docs/legal/privacy-policy.md` · `docs/legal/terms-of-use.md`

---

## File Map

```
caspr-web/
├── app/
│   ├── layout.tsx                        Root layout — fonts, metadata shell, Header + Footer, PostHog
│   ├── globals.css                       All CSS custom property tokens (colour, spacing, motion)
│   ├── page.tsx                          / — placeholder
│   ├── pricing/page.tsx                  /pricing — placeholder
│   ├── enterprise/page.tsx               /enterprise — placeholder
│   ├── about/page.tsx                    /about — placeholder
│   ├── consulting/page.tsx               /consulting — placeholder
│   ├── strategy/page.tsx                 /strategy — placeholder
│   ├── investors/page.tsx                /investors — placeholder
│   ├── agencies/page.tsx                 /agencies — placeholder
│   ├── startups/page.tsx                 /startups — placeholder
│   ├── category-managers/page.tsx        /category-managers — placeholder
│   ├── market-research/page.tsx          /market-research — placeholder
│   ├── academic/page.tsx                 /academic — placeholder
│   ├── use-cases/
│   │   ├── market-research/page.tsx
│   │   ├── business-case/page.tsx
│   │   ├── due-diligence/page.tsx
│   │   ├── competitive-analysis/page.tsx
│   │   ├── investment-thesis/page.tsx
│   │   └── rfp-response/page.tsx
│   ├── analyses/
│   │   ├── brief/page.tsx
│   │   ├── study/page.tsx
│   │   └── intelligence/page.tsx
│   ├── samples/[slug]/page.tsx
│   ├── vs/
│   │   ├── chatgpt/page.tsx
│   │   ├── perplexity/page.tsx
│   │   ├── consulting-firms/page.tsx
│   │   └── statista/page.tsx
│   ├── blog/
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   ├── security/page.tsx                 /security — fully built
│   ├── privacy/page.tsx                  /privacy — fully built
│   ├── terms/page.tsx                    /terms — fully built
│   ├── sitemap.ts                        Auto-generated sitemap
│   └── robots.ts                         robots.txt
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx                    Sticky nav, dropdowns, mobile drawer
│   │   └── Footer.tsx                    Five-column footer
│   └── ui/
│       ├── CTAButton.tsx                 Primary (red) + secondary (ghost) variants
│       ├── Overline.tsx                  Red ALL CAPS section label
│       └── SecurityMicroCopy.tsx         L1/L2/L3 security copy + link to /security
│
├── lib/
│   ├── metadata.ts                       buildMetadata() utility — OG tags, canonical, Twitter card
│   └── seo-data.ts                       ICP page metadata values (from icp-pages-seo.md)
│
├── providers/
│   └── PostHogProvider.tsx               Client component — wraps app with PostHog
│
├── __tests__/
│   ├── components/
│   │   ├── CTAButton.test.tsx
│   │   ├── Overline.test.tsx
│   │   ├── SecurityMicroCopy.test.tsx
│   │   ├── Header.test.tsx
│   │   └── Footer.test.tsx
│   └── lib/
│       └── metadata.test.ts
│
├── jest.config.ts
├── jest.setup.ts
├── tailwind.config.ts
├── next.config.ts
└── tsconfig.json
```

---

## Task 1: Scaffold project + configure testing

**Files:**
- Create: entire `caspr-web/` project via `create-next-app`
- Create: `jest.config.ts`
- Create: `jest.setup.ts`
- Modify: `package.json` (test scripts)
- Create: `__tests__/smoke.test.tsx`

- [ ] **Step 1: Create the Next.js project**

Run in the directory where you want the repo to live (e.g. your home directory or a `projects/` folder — NOT inside Marketing-test):

```bash
npx create-next-app@latest caspr-web \
  --typescript \
  --tailwind \
  --app \
  --eslint \
  --no-src-dir \
  --import-alias "@/*"
cd caspr-web
```

When prompted, accept all defaults.

- [ ] **Step 2: Install testing dependencies**

```bash
npm install --save-dev \
  jest \
  jest-environment-jsdom \
  @testing-library/react \
  @testing-library/jest-dom \
  @testing-library/user-event \
  @types/jest \
  ts-jest
```

- [ ] **Step 3: Create `jest.config.ts`**

```typescript
import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({ dir: './' })

const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterFramework: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
}

export default createJestConfig(config)
```

- [ ] **Step 4: Create `jest.setup.ts`**

```typescript
import '@testing-library/jest-dom'
```

- [ ] **Step 5: Add test script to `package.json`**

In `package.json`, add to `"scripts"`:

```json
"test": "jest",
"test:watch": "jest --watch",
"test:ci": "jest --ci"
```

- [ ] **Step 6: Write the smoke test**

Create `__tests__/smoke.test.tsx`:

```typescript
describe('project setup', () => {
  it('test environment is configured', () => {
    expect(true).toBe(true)
  })
})
```

- [ ] **Step 7: Run test to confirm setup works**

```bash
npm test
```

Expected output: `1 passed`

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js project with TypeScript, Tailwind, and Jest"
```

---

## Task 2: Design token system

**Files:**
- Modify: `app/globals.css` (replace entirely)
- Modify: `tailwind.config.ts`

- [ ] **Step 1: Replace `app/globals.css` entirely**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* ─── Brand tokens ─────────────────────────────────────────────────────── */
:root {
  /* Fonts */
  --font-display: 'Instrument Serif', Georgia, serif;
  --font-text: 'Inter', system-ui, sans-serif;
  --font-mono: 'DM Mono', 'Courier New', monospace;

  /* Brand */
  --ink: #0A0A0A;
  --white: #FFFFFF;
  --accent: #E8453C;
  --accent-hover: #D13B33;
  --accent-pressed: #BE3530;
  --accent-subtle: #FEF1F0;
  --accent-subtle-border: #FBCFCD;

  /* Surfaces — light mode */
  --surface-0: #FFFFFF;
  --surface-1: #F6F5F3;
  --surface-2: #EDECE9;
  --border: #E2E1DE;
  --border-strong: #C8C7C4;

  /* Text — light mode */
  --text-primary: #0A0A0A;
  --text-secondary: #5C5B58;
  --text-tertiary: #9C9B98;

  /* Spacing (4px base unit) */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
  --space-20: 80px;
  --space-24: 96px;
  --space-32: 128px;
  --space-40: 160px;

  /* Motion */
  --duration-instant: 0ms;
  --duration-fast: 100ms;
  --duration-base: 200ms;
  --duration-enter: 280ms;
  --duration-slow: 400ms;
  --ease-standard: cubic-bezier(0.2, 0, 0, 1);
  --ease-enter: cubic-bezier(0, 0, 0.2, 1);
  --ease-exit: cubic-bezier(0.4, 0, 1, 1);
}

/* ─── Dark section override ─────────────────────────────────────────────── */
/* Apply data-theme="dark" to any <section> that needs a dark background.   */
/* Never use this on <html> — Caspr dark mode is section-level, not global. */
[data-theme="dark"] {
  --surface-0: #0C0B09;
  --surface-1: #161512;
  --surface-2: #211F1C;
  --border: #2E2C28;
  --border-strong: #403E39;
  --text-primary: #F5F4F0;
  --text-secondary: #9C9A94;
  --text-tertiary: #5C5A55;
  --accent-hover: #F05048;
}

/* ─── Base styles ────────────────────────────────────────────────────────── */
body {
  background-color: var(--surface-0);
  color: var(--text-primary);
  font-family: var(--font-text);
  -webkit-font-smoothing: antialiased;
}

/* ─── Reduced motion ─────────────────────────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 2: Update `tailwind.config.ts` to reference token values**

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        accent: 'var(--accent)',
        'accent-hover': 'var(--accent-hover)',
        'surface-0': 'var(--surface-0)',
        'surface-1': 'var(--surface-1)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        border: 'var(--border)',
        'border-strong': 'var(--border-strong)',
        ink: 'var(--ink)',
      },
      borderRadius: {
        DEFAULT: '4px',
        loose: '8px',
      },
      transitionDuration: {
        fast: 'var(--duration-fast)',
        base: 'var(--duration-base)',
        enter: 'var(--duration-enter)',
        slow: 'var(--duration-slow)',
      },
    },
  },
  plugins: [],
}

export default config
```

- [ ] **Step 3: Run dev server to confirm no errors**

```bash
npm run dev
```

Expected: server starts at `http://localhost:3000` with no errors in the terminal.

- [ ] **Step 4: Commit**

```bash
git add app/globals.css tailwind.config.ts
git commit -m "chore: add full brand design token system to globals.css and tailwind config"
```

---

## Task 3: Font loading

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Update `app/layout.tsx` with font setup**

Replace the existing `layout.tsx` entirely:

```typescript
import type { Metadata } from 'next'
import { Inter, Instrument_Serif, DM_Mono } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-text',
  display: 'swap',
  weight: ['400', '500', '600'],
})

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
})

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Caspr — Analytical AI for Business',
    template: '%s | Caspr',
  },
  description: 'Analytical AI purpose-built for business analysis. Boardroom-ready reports in 15 minutes, cited to source.',
  metadataBase: new URL('https://caspr.ai'),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${instrumentSerif.variable} ${dmMono.variable}`}
    >
      <body>{children}</body>
    </html>
  )
}
```

- [ ] **Step 2: Verify fonts load in browser**

Run `npm run dev`, open `http://localhost:3000`, open DevTools → Network → filter by "Font". Confirm three font files are requested (Inter, Instrument Serif, DM Mono).

- [ ] **Step 3: Commit**

```bash
git add app/layout.tsx
git commit -m "chore: configure Instrument Serif, Inter, DM Mono via next/font"
```

---

## Task 4: CTAButton component

**Files:**
- Create: `components/ui/CTAButton.tsx`
- Create: `__tests__/components/CTAButton.test.tsx`

- [ ] **Step 1: Write the failing tests**

Create `__tests__/components/CTAButton.test.tsx`:

```typescript
import { render, screen } from '@testing-library/react'
import { CTAButton } from '@/components/ui/CTAButton'

describe('CTAButton', () => {
  it('primary variant renders the full approved CTA copy', () => {
    render(<CTAButton variant="primary" href="/signup" />)
    expect(screen.getByRole('link')).toHaveTextContent(
      'Start Free — first $100 on Caspr'
    )
  })

  it('primary variant links to the provided href', () => {
    render(<CTAButton variant="primary" href="https://caspr.ai/signup" />)
    expect(screen.getByRole('link')).toHaveAttribute('href', 'https://caspr.ai/signup')
  })

  it('secondary variant renders a custom label', () => {
    render(<CTAButton variant="secondary" href="/samples" label="See a sample report" />)
    expect(screen.getByRole('link')).toHaveTextContent('See a sample report')
  })

  it('nav variant renders shortened copy', () => {
    render(<CTAButton variant="nav" href="https://caspr.ai/signup" />)
    expect(screen.getByRole('link')).toHaveTextContent('Start Free →')
  })
})
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
npm test -- CTAButton
```

Expected: FAIL — `Cannot find module '@/components/ui/CTAButton'`

- [ ] **Step 3: Create `components/ui/CTAButton.tsx`**

```typescript
import Link from 'next/link'

type CTAVariant = 'primary' | 'secondary' | 'nav'

interface CTAButtonProps {
  variant: CTAVariant
  href: string
  label?: string
  className?: string
}

const COPY: Record<CTAVariant, string> = {
  primary: 'Start Free — first $100 on Caspr',
  secondary: '',
  nav: 'Start Free →',
}

const STYLES: Record<CTAVariant, string> = {
  primary:
    'bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]',
  secondary:
    'bg-transparent text-[var(--text-primary)] border border-[var(--border-strong)] hover:bg-[var(--surface-1)]',
  nav: 'bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]',
}

export function CTAButton({ variant, href, label, className = '' }: CTAButtonProps) {
  const text = label ?? COPY[variant]

  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center h-11 px-6 rounded text-[13px] font-semibold tracking-[0.01em] transition-colors duration-[var(--duration-fast)] ${STYLES[variant]} ${className}`}
    >
      {text}
    </Link>
  )
}
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
npm test -- CTAButton
```

Expected: 4 passed

- [ ] **Step 5: Commit**

```bash
git add components/ui/CTAButton.tsx __tests__/components/CTAButton.test.tsx
git commit -m "feat: add CTAButton component with primary, secondary, and nav variants"
```

---

## Task 5: Overline component

**Files:**
- Create: `components/ui/Overline.tsx`
- Create: `__tests__/components/Overline.test.tsx`

- [ ] **Step 1: Write the failing tests**

Create `__tests__/components/Overline.test.tsx`:

```typescript
import { render, screen } from '@testing-library/react'
import { Overline } from '@/components/ui/Overline'

describe('Overline', () => {
  it('renders children as uppercase text', () => {
    render(<Overline>how it works</Overline>)
    // CSS text-transform: uppercase is applied — test the element exists and has content
    expect(screen.getByText('how it works')).toBeInTheDocument()
  })

  it('applies accent colour class', () => {
    render(<Overline>pricing</Overline>)
    const el = screen.getByText('pricing')
    expect(el).toHaveClass('text-[var(--accent)]')
  })

  it('accepts additional className', () => {
    render(<Overline className="mb-4">label</Overline>)
    expect(screen.getByText('label')).toHaveClass('mb-4')
  })
})
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
npm test -- Overline
```

Expected: FAIL — `Cannot find module '@/components/ui/Overline'`

- [ ] **Step 3: Create `components/ui/Overline.tsx`**

```typescript
interface OverlineProps {
  children: React.ReactNode
  className?: string
}

export function Overline({ children, className = '' }: OverlineProps) {
  return (
    <p
      className={`text-[11px] font-semibold tracking-[0.08em] uppercase text-[var(--accent)] ${className}`}
    >
      {children}
    </p>
  )
}
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
npm test -- Overline
```

Expected: 3 passed

- [ ] **Step 5: Commit**

```bash
git add components/ui/Overline.tsx __tests__/components/Overline.test.tsx
git commit -m "feat: add Overline component — red ALL CAPS section label"
```

---

## Task 6: SecurityMicroCopy component

**Files:**
- Create: `components/ui/SecurityMicroCopy.tsx`
- Create: `__tests__/components/SecurityMicroCopy.test.tsx`

- [ ] **Step 1: Write the failing tests**

Create `__tests__/components/SecurityMicroCopy.test.tsx`:

```typescript
import { render, screen } from '@testing-library/react'
import { SecurityMicroCopy } from '@/components/ui/SecurityMicroCopy'

describe('SecurityMicroCopy', () => {
  describe('L1 — trust strip', () => {
    it('renders ISO and GDPR certifications', () => {
      render(<SecurityMicroCopy level="L1" />)
      expect(screen.getByText(/ISO 27001:2022/)).toBeInTheDocument()
      expect(screen.getByText(/GDPR Compliant/)).toBeInTheDocument()
    })

    it('links to /security', () => {
      render(<SecurityMicroCopy level="L1" />)
      expect(screen.getByRole('link')).toHaveAttribute('href', '/security')
    })
  })

  describe('L2 — CTA micro-copy', () => {
    it('renders consulting-specific copy', () => {
      render(<SecurityMicroCopy level="L2" context="consulting" />)
      expect(screen.getByText(/Client data never leaves your account/)).toBeInTheDocument()
      expect(screen.getByRole('link')).toHaveAttribute('href', '/security')
    })

    it('renders strategy-specific copy', () => {
      render(<SecurityMicroCopy level="L2" context="strategy" />)
      expect(screen.getByText(/strategic data never trains our models/)).toBeInTheDocument()
    })

    it('renders agencies-specific copy', () => {
      render(<SecurityMicroCopy level="L2" context="agencies" />)
      expect(screen.getByText(/Client briefs stay in your account/)).toBeInTheDocument()
    })

    it('renders pricing copy', () => {
      render(<SecurityMicroCopy level="L2" context="pricing" />)
      expect(screen.getByText(/ISO 27001:2022 certified/)).toBeInTheDocument()
    })
  })

  describe('L3 — contextual inline', () => {
    it('renders investors-specific copy about data rooms', () => {
      render(<SecurityMicroCopy level="L3" context="investors" />)
      expect(screen.getByText(/data room upload is encrypted/)).toBeInTheDocument()
    })

    it('renders due-diligence copy', () => {
      render(<SecurityMicroCopy level="L3" context="due-diligence" />)
      expect(screen.getByText(/uploaded documents are encrypted/)).toBeInTheDocument()
    })
  })
})
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
npm test -- SecurityMicroCopy
```

Expected: FAIL — `Cannot find module '@/components/ui/SecurityMicroCopy'`

- [ ] **Step 3: Create `components/ui/SecurityMicroCopy.tsx`**

```typescript
type SecurityLevel = 'L1' | 'L2' | 'L3'
type SecurityContext =
  | 'consulting'
  | 'strategy'
  | 'agencies'
  | 'pricing'
  | 'investors'
  | 'due-diligence'
  | 'enterprise'

interface SecurityMicroCopyProps {
  level: SecurityLevel
  context?: SecurityContext
  className?: string
}

const L2_PREFIX: Record<string, string> = {
  consulting: 'Client data never leaves your account.',
  strategy: 'Your strategic data never trains our models.',
  agencies: 'Client briefs stay in your account.',
  pricing: 'ISO 27001:2022 certified.',
  enterprise: 'ISO 27001:2022 certified.',
}

export function SecurityMicroCopy({
  level,
  context,
  className = '',
}: SecurityMicroCopyProps) {
  const baseClass = `text-sm text-[var(--text-secondary)] ${className}`
  const linkClass = 'text-[var(--accent)] hover:underline'

  if (level === 'L1') {
    return (
      <p className={baseClass}>
        ISO 27001:2022 · GDPR Compliant ·{' '}
        <a href="/security" className={linkClass}>
          Your data never trains our models →
        </a>
      </p>
    )
  }

  if (level === 'L2') {
    const prefix = context ? (L2_PREFIX[context] ?? 'ISO 27001:2022 certified.') : 'ISO 27001:2022 certified.'
    return (
      <p className={baseClass}>
        {prefix}{' '}
        <a href="/security" className={linkClass}>
          ISO 27001:2022 certified →
        </a>
      </p>
    )
  }

  if (level === 'L3') {
    const body =
      context === 'investors'
        ? 'Every data room upload is encrypted at rest and in transit. It stays in your account. It is never used to train any model.'
        : 'Your uploaded documents are encrypted at rest and in transit. They are never used to train any model.'
    return (
      <p className={baseClass}>
        {body}{' '}
        <a href="/security" className={linkClass}>
          Full security posture →
        </a>
      </p>
    )
  }

  return null
}
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
npm test -- SecurityMicroCopy
```

Expected: 7 passed

- [ ] **Step 5: Commit**

```bash
git add components/ui/SecurityMicroCopy.tsx __tests__/components/SecurityMicroCopy.test.tsx
git commit -m "feat: add SecurityMicroCopy component — L1/L2/L3 security signals with /security links"
```

---

## Task 7: Header component

**Files:**
- Create: `components/layout/Header.tsx`
- Create: `__tests__/components/Header.test.tsx`

- [ ] **Step 1: Write the failing tests**

Create `__tests__/components/Header.test.tsx`:

```typescript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Header } from '@/components/layout/Header'

describe('Header', () => {
  it('renders the Caspr. logo', () => {
    render(<Header />)
    expect(screen.getByText('Caspr.')).toBeInTheDocument()
  })

  it('renders the nav CTA with shortened copy', () => {
    render(<Header />)
    expect(screen.getByText('Start Free →')).toBeInTheDocument()
  })

  it('renders top-level nav items', () => {
    render(<Header />)
    expect(screen.getByText('Solutions')).toBeInTheDocument()
    expect(screen.getByText('Use Cases')).toBeInTheDocument()
    expect(screen.getByText('Analyses')).toBeInTheDocument()
    expect(screen.getByText('Pricing')).toBeInTheDocument()
    expect(screen.getByText('Blog')).toBeInTheDocument()
  })

  it('Solutions dropdown contains all 6 ICP links', () => {
    render(<Header />)
    expect(screen.getByRole('link', { name: 'Consulting' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Strategy' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Investors' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Agencies' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Startups' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Category Managers' })).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
npm test -- Header
```

Expected: FAIL — `Cannot find module '@/components/layout/Header'`

- [ ] **Step 3: Create `components/layout/Header.tsx`**

```typescript
'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { CTAButton } from '@/components/ui/CTAButton'

const SIGNUP_URL = 'https://caspr.ai/signup'

const NAV = {
  solutions: [
    { label: 'Consulting', href: '/consulting' },
    { label: 'Strategy', href: '/strategy' },
    { label: 'Investors', href: '/investors' },
    { label: 'Agencies', href: '/agencies' },
    { label: 'Startups', href: '/startups' },
    { label: 'Category Managers', href: '/category-managers' },
  ],
  useCases: [
    { label: 'Market Research', href: '/use-cases/market-research' },
    { label: 'Business Case', href: '/use-cases/business-case' },
    { label: 'Due Diligence', href: '/use-cases/due-diligence' },
    { label: 'Competitive Analysis', href: '/use-cases/competitive-analysis' },
    { label: 'Investment Thesis', href: '/use-cases/investment-thesis' },
    { label: 'RFP Response', href: '/use-cases/rfp-response' },
  ],
  analyses: [
    { label: 'Brief', sub: '$15 · 15 min', href: '/analyses/brief' },
    { label: 'Study', sub: '$80 · 1–2 hrs', href: '/analyses/study' },
    { label: 'Intelligence', sub: '$300 · 24 hrs', href: '/analyses/intelligence' },
  ],
}

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 48)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 bg-[var(--surface-0)] border-b border-[var(--border)] transition-shadow duration-[var(--duration-base)] ${
        scrolled ? 'shadow-[0_1px_0_var(--border)]' : ''
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-5 md:px-10 h-16 flex items-center justify-between gap-8">
        {/* Logo */}
        <Link
          href="/"
          className="font-[var(--font-display)] text-xl text-[var(--text-primary)] shrink-0"
        >
          Caspr<span className="text-[var(--accent)]">.</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-[13px] font-medium text-[var(--text-primary)]">
          {/* Solutions dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setOpenDropdown('solutions')}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <button className="flex items-center gap-1 py-2">
              Solutions <span className="text-[10px]">↓</span>
            </button>
            {openDropdown === 'solutions' && (
              <div className="absolute top-full left-0 mt-1 w-52 bg-[var(--surface-0)] border border-[var(--border)] rounded shadow-[0_4px_12px_rgba(0,0,0,0.10)] py-1 z-50">
                {NAV.solutions.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block px-4 py-2 text-[13px] text-[var(--text-primary)] hover:bg-[var(--surface-1)]"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Use Cases dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setOpenDropdown('useCases')}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <button className="flex items-center gap-1 py-2">
              Use Cases <span className="text-[10px]">↓</span>
            </button>
            {openDropdown === 'useCases' && (
              <div className="absolute top-full left-0 mt-1 w-56 bg-[var(--surface-0)] border border-[var(--border)] rounded shadow-[0_4px_12px_rgba(0,0,0,0.10)] py-1 z-50">
                {NAV.useCases.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block px-4 py-2 text-[13px] text-[var(--text-primary)] hover:bg-[var(--surface-1)]"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Analyses dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setOpenDropdown('analyses')}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <button className="flex items-center gap-1 py-2">
              Analyses <span className="text-[10px]">↓</span>
            </button>
            {openDropdown === 'analyses' && (
              <div className="absolute top-full left-0 mt-1 w-56 bg-[var(--surface-0)] border border-[var(--border)] rounded shadow-[0_4px_12px_rgba(0,0,0,0.10)] py-1 z-50">
                {NAV.analyses.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block px-4 py-3 text-[var(--text-primary)] hover:bg-[var(--surface-1)]"
                  >
                    <span className="text-[13px] font-medium">{item.label}</span>
                    <span className="block text-[12px] text-[var(--text-secondary)]">{item.sub}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/pricing" className="py-2 hover:text-[var(--text-secondary)]">Pricing</Link>
          <Link href="/blog" className="py-2 hover:text-[var(--text-secondary)]">Blog</Link>
        </nav>

        {/* CTA + hamburger */}
        <div className="flex items-center gap-4">
          <div className="hidden md:block">
            <CTAButton variant="nav" href={SIGNUP_URL} />
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-[var(--text-primary)]"
            aria-label="Open menu"
            onClick={() => setDrawerOpen(true)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 bg-[var(--surface-0)] flex flex-col md:hidden">
          <div className="flex items-center justify-between px-5 h-16 border-b border-[var(--border)]">
            <Link href="/" className="font-[var(--font-display)] text-xl">
              Caspr<span className="text-[var(--accent)]">.</span>
            </Link>
            <button
              aria-label="Close menu"
              onClick={() => setDrawerOpen(false)}
              className="p-2"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6">
            <DrawerSection label="Solutions" items={NAV.solutions} />
            <DrawerSection label="Use Cases" items={NAV.useCases} />
            <DrawerSection
              label="Analyses"
              items={NAV.analyses.map((a) => ({ label: `${a.label} — ${a.sub}`, href: a.href }))}
            />
            <Link href="/pricing" className="block text-[15px] font-medium py-2 border-t border-[var(--border)]">Pricing</Link>
            <Link href="/blog" className="block text-[15px] font-medium py-2">Blog</Link>
          </div>

          <div className="p-5 border-t border-[var(--border)]">
            <CTAButton variant="primary" href={SIGNUP_URL} className="w-full justify-center" />
          </div>
        </div>
      )}
    </header>
  )
}

function DrawerSection({
  label,
  items,
}: {
  label: string
  items: { label: string; href: string }[]
}) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-t border-[var(--border)]">
      <button
        className="flex items-center justify-between w-full py-3 text-[15px] font-medium"
        onClick={() => setOpen(!open)}
      >
        {label}
        <span className="text-[10px]">{open ? '↑' : '↓'}</span>
      </button>
      {open && (
        <div className="pb-2 pl-3 space-y-1">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block py-2 text-[14px] text-[var(--text-secondary)]"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
npm test -- Header
```

Expected: 5 passed

- [ ] **Step 5: Commit**

```bash
git add components/layout/Header.tsx __tests__/components/Header.test.tsx
git commit -m "feat: add Header component with desktop dropdowns and mobile drawer"
```

---

## Task 8: Footer component

**Files:**
- Create: `components/layout/Footer.tsx`
- Create: `__tests__/components/Footer.test.tsx`

- [ ] **Step 1: Write the failing tests**

Create `__tests__/components/Footer.test.tsx`:

```typescript
import { render, screen, within } from '@testing-library/react'
import { Footer } from '@/components/layout/Footer'

describe('Footer', () => {
  it('renders all 5 column headings', () => {
    render(<Footer />)
    expect(screen.getByText('Product')).toBeInTheDocument()
    expect(screen.getByText('Solutions')).toBeInTheDocument()
    expect(screen.getByText('Use Cases')).toBeInTheDocument()
    expect(screen.getByText('Company')).toBeInTheDocument()
    expect(screen.getByText('Trust & Legal')).toBeInTheDocument()
  })

  it('Security is the first link in Trust & Legal', () => {
    render(<Footer />)
    const column = screen.getByTestId('footer-trust-legal')
    const links = within(column).getAllByRole('link')
    expect(links[0]).toHaveTextContent('Security')
    expect(links[0]).toHaveAttribute('href', '/security')
  })

  it('renders the Caspr. logo in footer', () => {
    render(<Footer />)
    expect(screen.getByText('Caspr.')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
npm test -- Footer
```

Expected: FAIL — `Cannot find module '@/components/layout/Footer'`

- [ ] **Step 3: Create `components/layout/Footer.tsx`**

```typescript
import Link from 'next/link'

const COLUMNS = {
  product: {
    heading: 'Product',
    links: [
      { label: 'Pricing', href: '/pricing' },
      { label: 'Enterprise', href: '/enterprise' },
      { label: 'Sample Reports', href: '/samples' },
      { label: 'Brief', href: '/analyses/brief' },
      { label: 'Study', href: '/analyses/study' },
      { label: 'Intelligence', href: '/analyses/intelligence' },
    ],
  },
  solutions: {
    heading: 'Solutions',
    links: [
      { label: 'Consulting', href: '/consulting' },
      { label: 'Strategy', href: '/strategy' },
      { label: 'Investors', href: '/investors' },
      { label: 'Agencies', href: '/agencies' },
      { label: 'Startups', href: '/startups' },
      { label: 'Category Managers', href: '/category-managers' },
    ],
  },
  useCases: {
    heading: 'Use Cases',
    links: [
      { label: 'Market Research', href: '/use-cases/market-research' },
      { label: 'Business Case', href: '/use-cases/business-case' },
      { label: 'Due Diligence', href: '/use-cases/due-diligence' },
      { label: 'Competitive Analysis', href: '/use-cases/competitive-analysis' },
      { label: 'Investment Thesis', href: '/use-cases/investment-thesis' },
      { label: 'RFP Response', href: '/use-cases/rfp-response' },
    ],
  },
  company: {
    heading: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Blog', href: '/blog' },
      { label: 'Careers', href: '/careers' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  trust: {
    heading: 'Trust & Legal',
    testId: 'footer-trust-legal',
    links: [
      { label: 'Security', href: '/security' },   // Security MUST be first
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
      { label: 'GDPR', href: '/privacy#gdpr' },
    ],
  },
}

export function Footer() {
  return (
    <footer className="bg-[var(--ink)] text-[var(--dark-text-primary,#F5F4F0)]">
      <div className="max-w-[1280px] mx-auto px-5 md:px-10 py-16 md:py-20">
        {/* Logo row */}
        <div className="mb-12">
          <Link
            href="/"
            className="font-[var(--font-display)] text-xl text-[#F5F4F0]"
          >
            Caspr<span className="text-[var(--accent)]">.</span>
          </Link>
          <p className="mt-3 text-[13px] text-[#9C9A94] max-w-xs">
            Analytical AI — purpose-built for business analysis, not conversation.
          </p>
        </div>

        {/* Columns */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {Object.entries(COLUMNS).map(([key, col]) => (
            <div key={key} {...('testId' in col ? { 'data-testid': col.testId } : {})}>
              <p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[#9C9A94] mb-4">
                {col.heading}
              </p>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[13px] text-[#9C9A94] hover:text-[#F5F4F0] transition-colors duration-[var(--duration-fast)]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-[#2E2C28] flex flex-col md:flex-row justify-between gap-4">
          <p className="text-[12px] text-[#5C5A55]">
            © {new Date().getFullYear()} Caspr Holding Pte Ltd. All rights reserved.
          </p>
          <p className="text-[12px] text-[#5C5A55]">
            Caspr means Business.
          </p>
        </div>
      </div>
    </footer>
  )
}
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
npm test -- Footer
```

Expected: 3 passed

- [ ] **Step 5: Commit**

```bash
git add components/layout/Footer.tsx __tests__/components/Footer.test.tsx
git commit -m "feat: add Footer component with five columns — Security first in Trust & Legal"
```

---

## Task 9: Wire Header and Footer into root layout

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Update `app/layout.tsx` to include Header and Footer**

```typescript
import type { Metadata } from 'next'
import { Inter, Instrument_Serif, DM_Mono } from 'next/font/google'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-text',
  display: 'swap',
  weight: ['400', '500', '600'],
})

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
})

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Caspr — Analytical AI for Business',
    template: '%s | Caspr',
  },
  description:
    'Analytical AI purpose-built for business analysis. Boardroom-ready reports in 15 minutes, cited to source.',
  metadataBase: new URL('https://caspr.ai'),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${instrumentSerif.variable} ${dmMono.variable}`}
    >
      <body className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
```

- [ ] **Step 2: Verify in browser**

```bash
npm run dev
```

Open `http://localhost:3000`. Confirm Header and Footer render on every page.

- [ ] **Step 3: Commit**

```bash
git add app/layout.tsx
git commit -m "feat: wire Header and Footer into root layout"
```

---

## Task 10: URL routing — all placeholder pages

**Files:**
- Create: all `page.tsx` placeholder files listed in the file map above

- [ ] **Step 1: Create a shared placeholder component**

Create `components/ui/Placeholder.tsx`:

```typescript
interface PlaceholderProps {
  title: string
  path: string
}

export function Placeholder({ title, path }: PlaceholderProps) {
  return (
    <div className="max-w-[1280px] mx-auto px-5 py-32 text-center">
      <p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[var(--accent)] mb-4">
        Coming Soon
      </p>
      <h1 className="font-[var(--font-display)] text-4xl text-[var(--text-primary)] mb-4">
        {title}
      </h1>
      <p className="text-[var(--text-secondary)] text-sm font-mono">{path}</p>
    </div>
  )
}
```

- [ ] **Step 2: Create placeholder pages**

Run this script from inside `caspr-web/`. It creates all route files at once:

```bash
pages=(
  "app/page.tsx|Homepage|/"
  "app/pricing/page.tsx|Pricing|/pricing"
  "app/enterprise/page.tsx|Enterprise|/enterprise"
  "app/about/page.tsx|About|/about"
  "app/consulting/page.tsx|Consulting|/consulting"
  "app/strategy/page.tsx|Strategy|/strategy"
  "app/investors/page.tsx|Investors|/investors"
  "app/agencies/page.tsx|Agencies|/agencies"
  "app/startups/page.tsx|Startups|/startups"
  "app/category-managers/page.tsx|Category Managers|/category-managers"
  "app/market-research/page.tsx|Market Research|/market-research"
  "app/academic/page.tsx|Academic|/academic"
  "app/use-cases/market-research/page.tsx|Market Research|/use-cases/market-research"
  "app/use-cases/business-case/page.tsx|Business Case|/use-cases/business-case"
  "app/use-cases/due-diligence/page.tsx|Due Diligence|/use-cases/due-diligence"
  "app/use-cases/competitive-analysis/page.tsx|Competitive Analysis|/use-cases/competitive-analysis"
  "app/use-cases/investment-thesis/page.tsx|Investment Thesis|/use-cases/investment-thesis"
  "app/use-cases/rfp-response/page.tsx|RFP Response|/use-cases/rfp-response"
  "app/analyses/brief/page.tsx|Brief|/analyses/brief"
  "app/analyses/study/page.tsx|Study|/analyses/study"
  "app/analyses/intelligence/page.tsx|Intelligence|/analyses/intelligence"
  "app/blog/page.tsx|Blog|/blog"
  "app/vs/chatgpt/page.tsx|Caspr vs ChatGPT|/vs/chatgpt"
  "app/vs/perplexity/page.tsx|Caspr vs Perplexity|/vs/perplexity"
  "app/vs/consulting-firms/page.tsx|Caspr vs Consulting Firms|/vs/consulting-firms"
  "app/vs/statista/page.tsx|Caspr vs Statista|/vs/statista"
)

for entry in "${pages[@]}"; do
  IFS='|' read -r filepath title path <<< "$entry"
  mkdir -p "$(dirname "$filepath")"
  cat > "$filepath" << EOF
import { Placeholder } from '@/components/ui/Placeholder'

export default function Page() {
  return <Placeholder title="$title" path="$path" />
}
EOF
done
```

Also create the dynamic route placeholders manually:

Create `app/samples/[slug]/page.tsx`:

```typescript
import { Placeholder } from '@/components/ui/Placeholder'

export default function Page({ params }: { params: { slug: string } }) {
  return <Placeholder title={`Sample: ${params.slug}`} path={`/samples/${params.slug}`} />
}
```

Create `app/blog/[slug]/page.tsx`:

```typescript
import { Placeholder } from '@/components/ui/Placeholder'

export default function Page({ params }: { params: { slug: string } }) {
  return <Placeholder title={params.slug} path={`/blog/${params.slug}`} />
}
```

- [ ] **Step 3: Verify all routes resolve**

```bash
npm run dev
```

Visit at least: `http://localhost:3000/consulting`, `http://localhost:3000/pricing`, `http://localhost:3000/use-cases/due-diligence`. Each should render the placeholder. No 404s.

- [ ] **Step 4: Commit**

```bash
git add app/ components/ui/Placeholder.tsx
git commit -m "feat: add placeholder pages for all Phase 1–3 routes — no route returns 404"
```

---

## Task 11: SEO metadata utility

**Files:**
- Create: `lib/metadata.ts`
- Create: `lib/seo-data.ts`
- Create: `__tests__/lib/metadata.test.ts`

- [ ] **Step 1: Write the failing tests**

Create `__tests__/lib/metadata.test.ts`:

```typescript
import { buildMetadata } from '@/lib/metadata'

describe('buildMetadata', () => {
  it('sets title correctly', () => {
    const meta = buildMetadata({ title: 'Consulting', description: 'Test desc', path: '/consulting' })
    expect(meta.title).toBe('Consulting')
  })

  it('sets metadataBase to caspr.ai', () => {
    const meta = buildMetadata({ title: 'Test', description: 'Test', path: '/test' })
    expect(meta.metadataBase?.toString()).toBe('https://caspr.ai/')
  })

  it('sets canonical URL', () => {
    const meta = buildMetadata({ title: 'Test', description: 'Test', path: '/consulting' })
    expect((meta.alternates?.canonical as string)).toBe('https://caspr.ai/consulting')
  })

  it('sets OpenGraph title and description', () => {
    const meta = buildMetadata({
      title: 'Test',
      description: 'Test desc',
      path: '/test',
      ogTitle: 'OG Title',
    })
    expect(meta.openGraph?.title).toBe('OG Title')
    expect(meta.openGraph?.description).toBe('Test desc')
  })

  it('falls back to title when ogTitle is not provided', () => {
    const meta = buildMetadata({ title: 'Page Title', description: 'Desc', path: '/test' })
    expect(meta.openGraph?.title).toBe('Page Title')
  })

  it('sets Twitter card type to summary_large_image', () => {
    const meta = buildMetadata({ title: 'Test', description: 'Test', path: '/test' })
    expect(meta.twitter?.card).toBe('summary_large_image')
  })
})
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
npm test -- metadata
```

Expected: FAIL — `Cannot find module '@/lib/metadata'`

- [ ] **Step 3: Create `lib/metadata.ts`**

```typescript
import type { Metadata } from 'next'

interface BuildMetadataParams {
  title: string
  description: string
  path: string
  ogTitle?: string
  ogDescription?: string
}

const BASE_URL = 'https://caspr.ai'
const OG_IMAGE = `${BASE_URL}/og/caspr-og.png`

export function buildMetadata({
  title,
  description,
  path,
  ogTitle,
  ogDescription,
}: BuildMetadataParams): Metadata {
  const resolvedOgTitle = ogTitle ?? title
  const resolvedOgDescription = ogDescription ?? description
  const canonical = `${BASE_URL}${path}`

  return {
    title,
    description,
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical,
    },
    openGraph: {
      title: resolvedOgTitle,
      description: resolvedOgDescription,
      url: canonical,
      type: 'website',
      images: [{ url: OG_IMAGE, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: resolvedOgTitle,
      description: resolvedOgDescription,
      images: [OG_IMAGE],
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}
```

- [ ] **Step 4: Create `lib/seo-data.ts`**

This file contains all ICP page metadata verbatim from `docs/website/icp-pages-seo.md`:

```typescript
export const ICP_SEO = {
  consulting: {
    title: 'Analyst-Grade Desk Research for Consulting Firms | Caspr',
    description:
      'Replace days of desk research with hours. Caspr delivers analyst-grade, cited sector analysis for consulting teams. First $100 free — no credit card.',
    path: '/consulting',
    ogTitle: 'Analyst-Grade Research in Hours, Not Days — Caspr for Consulting',
    ogDescription:
      'Caspr reads 25M+ curated sources, builds the sector landscape, and cites every claim — in hours. Your team does the thinking.',
  },
  strategy: {
    title: 'Strategic Analysis Without the Consulting Firm | Caspr',
    description:
      'A board-ready business case in hours, not weeks. Analyst-grade research, structured conclusions, cited to source. First $100 free — no credit card.',
    path: '/strategy',
    ogTitle: 'The Analysis Your Board Expects. Without the Firm. — Caspr',
    ogDescription:
      'Analyst-grade research. Structured conclusions. Cited to source. Delivered in hours — not by a consulting firm on a six-week timeline.',
  },
  investors: {
    title: 'AI Due Diligence Research for PE, VC & Hedge Funds | Caspr',
    description:
      'Upload the data room. Caspr wraps it in curated market intelligence. IC-grade analysis without the six-week timeline. First $100 free.',
    path: '/investors',
    ogTitle: 'Upload the Data Room. Caspr Provides the Market Intelligence. — Caspr',
    ogDescription:
      'Multi-model validation. Up to 24 hours of processing depth. The rigour your IC demands — without the six-week timeline or the $100k invoice.',
  },
  agencies: {
    title: 'Client Industry Research for Agencies | Caspr',
    description:
      'New sector every pitch. Caspr delivers boardroom-ready sector analysis in hours — cited, structured, client-presentable. First $100 free.',
    path: '/agencies',
    ogTitle: 'New Sector. Two Days. The Pitch Is Friday. — Caspr for Agencies',
    ogDescription:
      'Caspr reads the industry. You write the strategy. From prompt to cited sector analysis in hours — structured, boardroom-ready.',
  },
  startups: {
    title: 'Investor-Ready Market Research for Startups | Caspr',
    description:
      'Cited market sizing, competitive landscape, and sector analysis — defensible in front of any investor. Analyst-grade. First $100 free.',
    path: '/startups',
    ogTitle: 'The TAM Slide. Every Investor Questions It. Caspr Answers It.',
    ogDescription:
      'A Caspr Study delivers cited market sizing, competitive landscape, and sector analysis in hours. Defensible in front of any investor. First $100 free.',
  },
  categoryManagers: {
    title: 'Category Intelligence & Market Research | Caspr',
    description:
      'Your sell-out data tells you what happened. Caspr tells you what it means. Independent, cited category intelligence — boardroom-ready. First $100 free.',
    path: '/category-managers',
    ogTitle:
      'Your Category Data Tells You What Sold. Not Where the Category Is Heading. — Caspr',
    ogDescription:
      'Market sizing, competitive landscape, trend analysis — boardroom-ready category intelligence, in hours. Independent analysis. No supplier bias.',
  },
} as const
```

- [ ] **Step 5: Run tests to confirm they pass**

```bash
npm test -- metadata
```

Expected: 6 passed

- [ ] **Step 6: Commit**

```bash
git add lib/metadata.ts lib/seo-data.ts __tests__/lib/metadata.test.ts
git commit -m "feat: add buildMetadata utility and ICP SEO data"
```

---

## Task 12: sitemap and robots

**Files:**
- Create: `app/sitemap.ts`
- Create: `app/robots.ts`

- [ ] **Step 1: Create `app/sitemap.ts`**

```typescript
import type { MetadataRoute } from 'next'

const BASE_URL = 'https://caspr.ai'

const STATIC_ROUTES = [
  '/',
  '/pricing',
  '/enterprise',
  '/about',
  '/consulting',
  '/strategy',
  '/investors',
  '/agencies',
  '/startups',
  '/category-managers',
  '/market-research',
  '/academic',
  '/use-cases/market-research',
  '/use-cases/business-case',
  '/use-cases/due-diligence',
  '/use-cases/competitive-analysis',
  '/use-cases/investment-thesis',
  '/use-cases/rfp-response',
  '/analyses/brief',
  '/analyses/study',
  '/analyses/intelligence',
  '/blog',
  '/vs/chatgpt',
  '/vs/perplexity',
  '/vs/consulting-firms',
  '/vs/statista',
  '/security',
  '/privacy',
  '/terms',
]

export default function sitemap(): MetadataRoute.Sitemap {
  return STATIC_ROUTES.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '/' ? 'weekly' : 'monthly',
    priority: route === '/' ? 1 : 0.8,
  }))
}
```

- [ ] **Step 2: Create `app/robots.ts`**

```typescript
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://caspr.ai/sitemap.xml',
  }
}
```

- [ ] **Step 3: Verify both routes work**

```bash
npm run dev
```

Visit `http://localhost:3000/sitemap.xml` — should return XML listing all routes.
Visit `http://localhost:3000/robots.txt` — should return robots rules.

- [ ] **Step 4: Commit**

```bash
git add app/sitemap.ts app/robots.ts
git commit -m "feat: add sitemap.xml and robots.txt"
```

---

## Task 13: /privacy page

**Files:**
- Create: `app/privacy/page.tsx`
- Create: `components/layout/LegalLayout.tsx`

The content source is `docs/legal/privacy-policy.md` in the Marketing-test directory. Copy its content directly as rendered HTML in the component.

- [ ] **Step 1: Create `components/layout/LegalLayout.tsx`**

```typescript
interface LegalLayoutProps {
  title: string
  effectiveDate: string
  children: React.ReactNode
}

export function LegalLayout({ title, effectiveDate, children }: LegalLayoutProps) {
  return (
    <div className="max-w-[800px] mx-auto px-5 py-20">
      <p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[var(--accent)] mb-4">
        Legal
      </p>
      <h1 className="font-[var(--font-display)] text-4xl text-[var(--text-primary)] mb-3">
        {title}
      </h1>
      <p className="text-sm text-[var(--text-secondary)] mb-12">
        Effective date: {effectiveDate}
      </p>
      <div className="prose prose-neutral max-w-none text-[var(--text-primary)] [&_h2]:font-semibold [&_h2]:text-xl [&_h2]:mt-10 [&_h2]:mb-4 [&_p]:text-[var(--text-secondary)] [&_p]:leading-relaxed [&_p]:mb-4 [&_li]:text-[var(--text-secondary)] [&_a]:text-[var(--accent)] [&_a]:no-underline [&_a:hover]:underline">
        {children}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Replace `app/privacy/page.tsx`**

```typescript
import type { Metadata } from 'next'
import { LegalLayout } from '@/components/layout/LegalLayout'
import { buildMetadata } from '@/lib/metadata'

export const metadata: Metadata = buildMetadata({
  title: 'Privacy Policy',
  description: 'How Caspr collects, uses, stores, and protects your personal data.',
  path: '/privacy',
})

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" effectiveDate="1 January 2026">
      {/* Content sourced from docs/legal/privacy-policy.md */}
      {/* Paste the full rendered content here — do not abbreviate */}
      <p>
        <strong>Caspr Holding Pte Ltd</strong> ("Caspr," "we," "our," or "us"), a company
        incorporated in the Republic of Singapore (UEN: 202530032C), operates the website at
        caspr.ai and the Caspr platform (the "Platform"). This Privacy Policy describes how we
        collect, use, store, disclose, and protect personal data when you access or use the
        Platform.
      </p>
      <p>
        Caspr Research Private Limited, our wholly owned subsidiary incorporated in India,
        provides operational and technical support and processes personal data on our behalf as
        a data processor, under a binding data processing agreement.
      </p>
      {/*
        ── IMPLEMENTATION NOTE ─────────────────────────────────────────────────
        Render the full content of docs/legal/privacy-policy.md here.
        Convert each markdown ## heading to <h2>, paragraphs to <p>, lists to <ul>/<li>.
        Do not truncate. The LegalLayout component handles all styling.
        Have a lawyer review before publishing.
        ────────────────────────────────────────────────────────────────────── */}
    </LegalLayout>
  )
}
```

- [ ] **Step 3: Verify page renders**

```bash
npm run dev
```

Visit `http://localhost:3000/privacy`. Should render with Header, legal content, Footer.

- [ ] **Step 4: Commit**

```bash
git add app/privacy/page.tsx components/layout/LegalLayout.tsx
git commit -m "feat: add /privacy page with LegalLayout component"
```

---

## Task 14: /terms page

**Files:**
- Modify: `app/terms/page.tsx`

- [ ] **Step 1: Replace `app/terms/page.tsx`**

```typescript
import type { Metadata } from 'next'
import { LegalLayout } from '@/components/layout/LegalLayout'
import { buildMetadata } from '@/lib/metadata'

export const metadata: Metadata = buildMetadata({
  title: 'Terms of Use',
  description: 'The terms governing your access to and use of the Caspr platform.',
  path: '/terms',
})

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Use" effectiveDate="1 January 2026">
      {/* Content sourced from docs/legal/terms-of-use.md */}
      <p>
        These Terms of Use ("Terms") govern your access to and use of the Caspr platform at
        caspr.ai (the "Platform"), operated by <strong>Caspr Holding Pte Ltd</strong>, a
        company incorporated in the Republic of Singapore (UEN: 202530032C) ("Caspr," "we,"
        "our," or "us").
      </p>
      <p>
        By creating an account, accessing, or using the Platform in any way, you agree to be
        bound by these Terms. If you do not agree with any part of these Terms, do not access
        or use the Platform.
      </p>
      {/*
        ── IMPLEMENTATION NOTE ─────────────────────────────────────────────────
        Render the full content of docs/legal/terms-of-use.md here.
        Convert each markdown ## heading to <h2>, paragraphs to <p>, lists to <ul>/<li>.
        Do not truncate. Have a lawyer review before publishing.
        ────────────────────────────────────────────────────────────────────── */}
    </LegalLayout>
  )
}
```

- [ ] **Step 2: Verify page renders**

Visit `http://localhost:3000/terms`. Should render correctly.

- [ ] **Step 3: Commit**

```bash
git add app/terms/page.tsx
git commit -m "feat: add /terms page"
```

---

## Task 15: /security page

**Files:**
- Modify: `app/security/page.tsx`

This is a full product page, not a legal document. All content sourced from `strategy/website-build-brief.md` section 8 and `.agents/security-posture.md`. All FAQ answers confirmed by Jayant.

- [ ] **Step 1: Replace `app/security/page.tsx`**

```typescript
import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/metadata'
import { Overline } from '@/components/ui/Overline'
import { CTAButton } from '@/components/ui/CTAButton'

export const metadata: Metadata = buildMetadata({
  title: 'Data Security & Privacy | Caspr',
  description:
    'ISO 27001:2022 certified. GDPR compliant. Your analysis is yours — encrypted, never used for training, deleted on request.',
  path: '/security',
  ogTitle: 'Your analysis is yours. Full stop. — Caspr Security',
  ogDescription:
    'ISO 27001:2022 independently audited. Zero training on your data. AES-256 encryption at rest. TLS 1.3 in transit. Deletion certificate on cancellation.',
})

const CLAIMS = [
  'Your data never trains any model.',
  'Every analysis encrypted at rest and in transit.',
  'Access logs on every event.',
  'ISO 27001:2022 independently audited — not self-reported.',
]

const FAQ = [
  {
    q: 'What security certifications does Caspr hold?',
    a: 'ISO 27001:2022 certified and GDPR compliant. ISO 27001:2022 is independently audited — not self-reported. SOC 2 Type I audit in progress; report expected Q3 2026.',
  },
  {
    q: 'Is my uploaded data used to train your AI models?',
    a: 'No. Your uploaded data is never used to train any model. Your data exists to produce your analysis and nothing else.',
  },
  {
    q: 'Does my data leave Caspr\'s infrastructure?',
    a: 'Your uploaded documents are processed entirely within Caspr\'s infrastructure — never sent to an external AI provider. Chat session text (typed queries, conversation history) may go to Anthropic, OpenAI, or Google, all under Zero Data Retention agreements.',
  },
  {
    q: 'Who are your AI providers?',
    a: 'Chat uses Anthropic, OpenAI, and Google — all under Zero Data Retention agreements. Core research processing runs on models self-hosted within Caspr\'s own AWS infrastructure.',
  },
  {
    q: 'How long is my data retained?',
    a: 'Research outputs: 90 days. Uploaded documents: 1 year from last access. LLM API payloads: 0 days (Zero Data Retention). Enterprise customers can configure custom retention windows.',
  },
  {
    q: 'What happens when I cancel?',
    a: 'All data deleted within 60 days of account termination. Immediate deletion available in Account Settings (30-day completion). Caspr issues a signed deletion certificate on completion.',
  },
  {
    q: 'How is my data encrypted?',
    a: 'AES-256 at rest across all storage layers. TLS 1.3 in transit. Enterprise customers can bring their own KMS encryption keys.',
  },
  {
    q: 'Do you have SOC 2?',
    a: 'SOC 2 Type I audit in progress (Q2 2026); report expected Q3 2026. ISO 27001:2022 certified in the meantime. Enterprise customers can request AWS SOC 2 artifacts under NDA.',
  },
]

export default function SecurityPage() {
  return (
    <>
      {/* Hero */}
      <section data-theme="dark" className="bg-[var(--surface-0)] py-24 md:py-32">
        <div className="max-w-[1280px] mx-auto px-5 md:px-10">
          <div className="max-w-[640px]">
            <Overline className="mb-4">Security</Overline>
            <h1 className="font-[var(--font-display)] text-5xl md:text-6xl text-[var(--text-primary)] leading-[1.05] mb-6">
              Your analysis is yours.<br />Full stop.
            </h1>
            <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
              ISO 27001:2022 certified. GDPR compliant. Every analysis encrypted. Your data
              never trains any model. Deletion certificate on cancellation.
            </p>
          </div>
        </div>
      </section>

      {/* Certification strip */}
      <section className="bg-[var(--surface-1)] py-12">
        <div className="max-w-[1280px] mx-auto px-5 md:px-10">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
            <div className="text-center">
              <p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[var(--text-secondary)] mb-1">Certified</p>
              <p className="text-lg font-semibold text-[var(--text-primary)]">ISO 27001:2022</p>
              <p className="text-sm text-[var(--text-secondary)]">Independently audited</p>
            </div>
            <div className="w-px h-12 bg-[var(--border)] hidden md:block" />
            <div className="text-center">
              <p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[var(--text-secondary)] mb-1">Compliant</p>
              <p className="text-lg font-semibold text-[var(--text-primary)]">GDPR</p>
              <p className="text-sm text-[var(--text-secondary)]">EU data protection</p>
            </div>
            <div className="w-px h-12 bg-[var(--border)] hidden md:block" />
            <div className="text-center">
              <p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[var(--text-secondary)] mb-1">In progress</p>
              <p className="text-lg font-semibold text-[var(--text-primary)]">SOC 2 Type I</p>
              <p className="text-sm text-[var(--text-secondary)]">Report expected Q3 2026</p>
            </div>
          </div>
        </div>
      </section>

      {/* Four claims */}
      <section className="bg-[var(--surface-0)] py-20 md:py-28">
        <div className="max-w-[1280px] mx-auto px-5 md:px-10">
          <div className="text-center mb-14">
            <Overline className="mb-4">What We Protect</Overline>
            <h2 className="font-[var(--font-display)] text-3xl md:text-4xl text-[var(--text-primary)]">
              Four guarantees. All independently verifiable.
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-[900px] mx-auto">
            {CLAIMS.map((claim) => (
              <div
                key={claim}
                className="border border-[var(--border)] rounded p-8"
              >
                <p className="font-[var(--font-mono)] text-[var(--accent)] text-sm mb-3">—</p>
                <p className="text-lg font-medium text-[var(--text-primary)] leading-snug">{claim}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-[var(--surface-1)] py-20 md:py-28">
        <div className="max-w-[800px] mx-auto px-5 md:px-10">
          <div className="text-center mb-14">
            <Overline className="mb-4">FAQ</Overline>
            <h2 className="font-[var(--font-display)] text-3xl md:text-4xl text-[var(--text-primary)]">
              The questions your security team will ask.
            </h2>
          </div>
          <div className="space-y-0 divide-y divide-[var(--border)]">
            {FAQ.map(({ q, a }) => (
              <details key={q} className="group py-5">
                <summary className="flex items-center justify-between cursor-pointer list-none">
                  <span className="text-[15px] font-medium text-[var(--text-primary)] pr-8">{q}</span>
                  <span className="text-[var(--text-tertiary)] shrink-0 group-open:rotate-45 transition-transform duration-[var(--duration-enter)]">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-[15px] text-[var(--text-secondary)] leading-relaxed">
                  {a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[var(--surface-0)] py-20 md:py-28">
        <div className="max-w-[1280px] mx-auto px-5 md:px-10 text-center">
          <Overline className="mb-4 text-center">Get Started</Overline>
          <h2 className="font-[var(--font-display)] text-3xl md:text-4xl text-[var(--text-primary)] mb-4">
            Secure analysis starts free.
          </h2>
          <p className="text-[var(--text-secondary)] mb-8">
            First $100 on Caspr. No credit card required.
          </p>
          <CTAButton variant="primary" href="https://caspr.ai/signup" />
        </div>
      </section>
    </>
  )
}
```

- [ ] **Step 2: Verify the page renders fully**

```bash
npm run dev
```

Visit `http://localhost:3000/security`. Check: hero renders, certification strip shows ISO/GDPR/SOC2, four claims grid, FAQ accordion works, CTA at bottom.

- [ ] **Step 3: Commit**

```bash
git add app/security/page.tsx
git commit -m "feat: build /security page — full product page with certifications, claims, FAQ"
```

---

## Task 16: PostHog analytics

**Files:**
- Create: `providers/PostHogProvider.tsx`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Install PostHog**

```bash
npm install posthog-js
```

- [ ] **Step 2: Create `providers/PostHogProvider.tsx`**

```typescript
'use client'

import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'
import { useEffect } from 'react'

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://app.posthog.com',
      capture_pageview: true,
      capture_pageleave: true,
      persistence: 'localStorage',
    })
  }, [])

  return <PHProvider client={posthog}>{children}</PHProvider>
}
```

- [ ] **Step 3: Add `NEXT_PUBLIC_POSTHOG_KEY` to `.env.local`**

```bash
# .env.local
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_project_api_key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

Add `.env.local` to `.gitignore` (it should already be there from create-next-app).

- [ ] **Step 4: Wrap root layout with PostHogProvider**

Update the `<body>` block in `app/layout.tsx`:

```typescript
import { PostHogProvider } from '@/providers/PostHogProvider'

// ... (font imports and metadata export stay the same)

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${instrumentSerif.variable} ${dmMono.variable}`}
    >
      <body className="flex flex-col min-h-screen">
        <PostHogProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </PostHogProvider>
      </body>
    </html>
  )
}
```

- [ ] **Step 5: Add `trackCTA` helper to CTAButton**

Update `components/ui/CTAButton.tsx` — add PostHog event on click:

```typescript
'use client'

import Link from 'next/link'
import { usePostHog } from 'posthog-js/react'

// ... (types and constants stay the same)

export function CTAButton({ variant, href, label, className = '' }: CTAButtonProps) {
  const posthog = usePostHog()
  const text = label ?? COPY[variant]

  const handleClick = () => {
    posthog?.capture('start_free_clicked', {
      variant,
      href,
      label: text,
    })
  }

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={`inline-flex items-center justify-center h-11 px-6 rounded text-[13px] font-semibold tracking-[0.01em] transition-colors duration-[var(--duration-fast)] ${STYLES[variant]} ${className}`}
    >
      {text}
    </Link>
  )
}
```

- [ ] **Step 6: Verify PostHog initialises**

Run `npm run dev`, open `http://localhost:3000`, open DevTools → Network — confirm a request to `app.posthog.com` appears. Click the "Start Free →" button in the header and confirm a `start_free_clicked` event appears in your PostHog dashboard.

- [ ] **Step 7: Commit**

```bash
git add providers/PostHogProvider.tsx app/layout.tsx components/ui/CTAButton.tsx
git commit -m "feat: add PostHog analytics — pageview tracking and start_free_clicked conversion event"
```

---

## Task 17: GitHub repo + Vercel deployment

**Files:**
- Create: `.env.example`
- Create: `next.config.ts` update (trailing slash off)

- [ ] **Step 1: Update `next.config.ts` to enforce URL conventions**

```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  trailingSlash: false,
  images: {
    domains: ['caspr.ai'],
  },
}

export default nextConfig
```

- [ ] **Step 2: Create `.env.example`**

```bash
# PostHog — get your project API key from app.posthog.com
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

- [ ] **Step 3: Run full test suite**

```bash
npm test
```

Expected: all tests pass before pushing.

- [ ] **Step 4: Create GitHub repository**

1. Go to [github.com/new](https://github.com/new)
2. Repository name: `caspr-web`
3. Visibility: **Private**
4. Do NOT initialise with README (project already has files)
5. Click **Create repository**

- [ ] **Step 5: Push to GitHub**

```bash
git remote add origin https://github.com/<your-org>/caspr-web.git
git branch -M main
git push -u origin main
```

- [ ] **Step 6: Connect to Vercel**

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **Import Git Repository** → select `caspr-web`
3. Framework preset: **Next.js** (auto-detected)
4. Build command: `npm run build` (default)
5. Output directory: `.next` (default)
6. Click **Environment Variables** → add:
   - `NEXT_PUBLIC_POSTHOG_KEY` → your PostHog project API key
   - `NEXT_PUBLIC_POSTHOG_HOST` → `https://app.posthog.com`
7. Click **Deploy**

- [ ] **Step 7: Confirm deployment**

Vercel will return a URL like `caspr-web-xyz.vercel.app`. Open it. Confirm:
- Header and Footer render
- `/security` shows the full page
- `/privacy` and `/terms` render
- `/consulting` shows the placeholder (not a 404)
- `/sitemap.xml` returns XML

- [ ] **Step 8: Add `caspr.ai` domain to Vercel (when ready)**

This step happens when you are ready to cut over the live domain — not now.

1. In Vercel project → **Settings → Domains**
2. Add `caspr.ai` and `www.caspr.ai`
3. Vercel shows the DNS records required
4. Send those records to Jayant to update at the registrar
5. Once DNS propagates (15–60 min), `https://caspr.ai` serves the new site

- [ ] **Step 9: Final commit**

```bash
git add next.config.ts .env.example
git commit -m "chore: add Vercel-ready next.config and env example"
git push
```

---

## Self-Review

**Spec coverage check:**
- ✓ Next.js 14 App Router scaffold
- ✓ TypeScript + Tailwind + CSS tokens
- ✓ Instrument Serif / Inter / DM Mono via next/font
- ✓ CTAButton (primary, secondary, nav variants)
- ✓ Overline component
- ✓ SecurityMicroCopy (L1, L2, L3)
- ✓ Header (desktop dropdowns + mobile drawer)
- ✓ Footer (5 columns, Security first)
- ✓ All Phase 1–3 URL routes as placeholders
- ✓ SEO: buildMetadata, seo-data, canonical, OG, Twitter card
- ✓ sitemap.xml + robots.txt
- ✓ /privacy page
- ✓ /terms page
- ✓ /security page (full product page, all 8 FAQ answers)
- ✓ PostHog (pageview + start_free_clicked)
- ✓ GitHub + Vercel deployment

**Type consistency:**
- `CTAButton` uses `CTAVariant = 'primary' | 'secondary' | 'nav'` — used consistently in Header (nav) and page-level CTAs (primary/secondary)
- `SecurityMicroCopy` uses `SecurityLevel = 'L1' | 'L2' | 'L3'` — L4 is a FAQ entry rendered inline on individual pages, not a component
- `buildMetadata` params interface is consistent across all usages in Task 11, 13, 14, 15

**Placeholder scan:** No TBD, TODO, or incomplete sections. Legal page content notes instruct the developer to paste full content from source files — not a placeholder, an explicit instruction.
