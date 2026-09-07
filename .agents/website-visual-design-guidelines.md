# Caspr.ai — Website Visual Design Guidelines

*Scope: Marketing website (caspr.ai). Does not cover tool UI, social media, or reports — those are separate documents that inherit from this foundation.*
*Last updated: 2026-05-14*
*Status: Approved — in design*
*Updated: 2026-05-14 — finalised alignment philosophy: mobile universally LEFT (editorial), desktop hybrid (full-width body sections CENTER, all others LEFT)*

---

## The Problem This Fixes

The previous website design had four failures:
1. Source Serif Pro Black at 60–70px on full-black backgrounds = newspaper front page. Looks like The Economist, not an intelligence platform.
2. Jarring register shift between sections — dark hero felt editorial, light sections felt generic SaaS, pricing felt Squarespace. No consistent visual logic.
3. Rounded cards and soft grays read as another startup, not a precision tool.
4. The red was slightly wrong (#EF4444 not #E8453C) and near-blacks were inconsistent across the file.

This document establishes the rules that prevent these failures.

---

## Design Principles

Five principles. Each decision on the site should be traceable to at least one.

**1. Precision over drama.**
Analytical AI communicates through structure and specificity, not visual spectacle. Typography is controlled. Spacing is intentional. Nothing decorates — everything means something.

**2. One consistent register, every section.**
The site does not shift between editorial and SaaS between sections. The register is: premium intelligence platform. It holds from the hero to the footer.

**3. Dark is earned, not ambient.**
Black backgrounds signal gravity and focus. They are reserved for high-stakes moments — the hero, the category claim. Light sections carry the functional work. The contrast between them is meaningful, not random.

**4. The numbers are the design.**
Caspr's product is analysis. Statistics, prices, and proof points are visual elements — not just content. "15 minutes. $80. 100 pages." is typography and layout, not a footnote.

**5. The serif serves precision, not publication.**
Serif type signals authority and permanence. It does not mean heavy black weights at tabloid scale. The serif is used with restraint: at controlled sizes, for headlines that earn it, where the weight adds gravity not noise.

---

## Typography System

### Typeface Rationale

Three roles. Each chosen for a specific reason.

#### Display — Instrument Serif
**Why:** Contemporary and screen-native. Designed in 2023, it reads as intelligent and editorial without borrowing the newspaper register of Source Serif Pro or Libre Baskerville. It has optical sharpness at large sizes but doesn't overpower. It is not overused in B2B SaaS — it signals that a design decision was made, not a template followed.

**Used for:** Hero headlines (H1), section headline statements (H2 when used as a standalone large text moment), pull quotes.

**Weights available:** Regular (400), Italic (400i). The weight comes from size and spacing — not from bold weights.

**Where NOT to use:** Body copy, UI labels, navigation, buttons, cards, data figures.

> Google Fonts URL: `https://fonts.google.com/specimen/Instrument+Serif`
> CSS: `font-family: 'Instrument Serif', Georgia, serif;`

#### Text / UI — Inter
**Why:** Already in use and correct. Highly legible, excellent numerals, works at every size from 11px to 24px. Neutral enough not to compete with Instrument Serif. Universal professional register — the same font used in Bloomberg, Linear, Notion, and every serious tool the ICP already uses daily.

**Used for:** All body copy, section headings (H3–H4), navigation, buttons, labels, feature lists, captions, footer.

**Weights in use:** Regular (400), Medium (500), SemiBold (600). Do not use Bold (700) for Inter — it reads heavy for a premium product. Use SemiBold where weight is needed.

> Google Fonts URL: `https://fonts.google.com/specimen/Inter`
> CSS: `font-family: 'Inter', system-ui, sans-serif;`

#### Data / Accent — DM Mono
**Why:** The analytical signal. Monospace type on numbers, prices, statistics, and code adds typographic texture that says "we work with data" in a way no serif or sans can. Used sparingly — three to five instances per page maximum. This is the typographic equivalent of the red dot: it means something.

**Used for:** Large price figures ($80, $200/mo), key statistics (15 min, 100 pages, 25M+ sources), any numerical callout that needs to stand alone.

**Weights in use:** Regular (400) only. The uniqueness of the font family is enough — it does not need weight variation.

> Google Fonts URL: `https://fonts.google.com/specimen/DM+Mono`
> CSS: `font-family: 'DM Mono', 'Courier New', monospace;`

---

### Type Scale

All sizes at desktop (≥1280px). Mobile scale is 85% of desktop for display, unchanged for text/UI.

| Style | Family | Weight | Size | Line Height | Letter Spacing | Usage |
|---|---|---|---|---|---|---|
| Display XL | Instrument Serif | 400 | 72px / 4.5rem | 1.0 | −0.03em | Hero headline (1 per page) |
| Display L | Instrument Serif | 400 | 56px / 3.5rem | 1.05 | −0.025em | Section headline statements |
| Display M | Instrument Serif | 400 | 40px / 2.5rem | 1.1 | −0.02em | Sub-hero headlines, pull quotes |
| Heading 1 | Inter | 600 | 32px / 2rem | 1.2 | −0.01em | Page section titles |
| Heading 2 | Inter | 600 | 24px / 1.5rem | 1.25 | −0.01em | Card headings, feature titles |
| Heading 3 | Inter | 600 | 20px / 1.25rem | 1.3 | 0 | Sub-section labels |
| Heading 4 | Inter | 500 | 17px / 1.0625rem | 1.35 | 0 | Small card headings |
| Body L | Inter | 400 | 18px / 1.125rem | 1.65 | 0 | Hero subheadline, intro paragraphs |
| Body M | Inter | 400 | 16px / 1rem | 1.65 | 0 | Default body copy |
| Body S | Inter | 400 | 14px / 0.875rem | 1.6 | 0 | Secondary descriptions, card body |
| Label L | Inter | 500 | 13px / 0.8125rem | 1.4 | 0.04em | Navigation, button text (large) |
| Label M | Inter | 600 | 11px / 0.6875rem | 1.4 | 0.08em | Overline labels (ALL CAPS), tags |
| Label S | Inter | 500 | 11px / 0.6875rem | 1.4 | 0.02em | Footer, legal, captions |
| Data XL | DM Mono | 400 | 48px / 3rem | 1.0 | −0.02em | Hero price/stat callouts |
| Data L | DM Mono | 400 | 32px / 2rem | 1.1 | −0.01em | Section stat callouts |
| Data M | DM Mono | 400 | 20px / 1.25rem | 1.3 | 0 | Inline data points |

**Rules:**
- Instrument Serif is never used below 32px. Below that threshold, it loses its character and reads as a low-quality web font.
- DM Mono is never used for body copy. Numbers only.
- Overline labels (the "ANALYTICAL AI" red category labels) are always Inter SemiBold, 11px, ALL CAPS, letter-spacing 0.08em, in `--accent` red.
- No font mixing within a single text element. Pick one family per block.

---

## Colour System

### Brand Palette (locked)

| Token | Hex | Notes |
|---|---|---|
| `--ink` | `#0A0A0A` | Primary text, dark surfaces. Slightly warm — not pure #000000 |
| `--white` | `#FFFFFF` | Page background (light mode), reversed text |
| `--accent` | `#E8453C` | Brand red. This exact value. Not Tailwind red-500 (#EF4444). Not #FF4444. |

These three values do not change. Everything else is derived from them.

### Extended Colour Tokens

#### Light Mode (primary for content sections)

| Token | Hex | Role |
|---|---|---|
| `--surface-0` | `#FFFFFF` | Page background, card background |
| `--surface-1` | `#F6F5F3` | Section backgrounds (warm off-white, not cold gray) |
| `--surface-2` | `#EDECE9` | Hover states, subtle dividers |
| `--border` | `#E2E1DE` | Card borders, rule lines |
| `--border-strong` | `#C8C7C4` | Emphasized borders, table lines |
| `--text-primary` | `#0A0A0A` | Body copy, headings |
| `--text-secondary` | `#5C5B58` | Supporting copy, captions |
| `--text-tertiary` | `#9C9B98` | Placeholder, disabled, meta |
| `--accent` | `#E8453C` | CTAs, overline labels, accent elements |
| `--accent-hover` | `#D13B33` | Button hover state |
| `--accent-pressed` | `#BE3530` | Button active/pressed state |
| `--accent-subtle` | `#FEF1F0` | Tinted backgrounds, alert backgrounds |
| `--accent-subtle-border` | `#FBCFCD` | Borders on tinted surfaces |

#### Dark Mode (reserved for hero, category claim, and Enterprise sections)

| Token | Hex | Role |
|---|---|---|
| `--dark-surface-0` | `#0C0B09` | Primary dark background |
| `--dark-surface-1` | `#161512` | Card/panel surfaces on dark |
| `--dark-surface-2` | `#211F1C` | Hover states on dark |
| `--dark-border` | `#2E2C28` | Borders on dark |
| `--dark-border-strong` | `#403E39` | Emphasized borders on dark |
| `--dark-text-primary` | `#F5F4F0` | Primary text on dark (warm off-white) |
| `--dark-text-secondary` | `#9C9A94` | Supporting copy on dark |
| `--dark-text-tertiary` | `#5C5A55` | Disabled/meta on dark |
| `--accent` | `#E8453C` | Same red — it works on both dark and light |
| `--accent-hover` | `#F05048` | Slightly lighter on dark for visibility |

**Why warm tones throughout:** Cold grays (#F5F5F5, #E5E5E5) read as generic SaaS or government websites. A warm undertone in the off-whites and near-blacks is subtle but creates the sense of a designed system rather than a default palette.

### Colour Usage Rules

1. **Dark sections are used for: Hero, Category Claim, Enterprise strip.** Maximum 3 dark sections per page. No exceptions without deliberate justification.
2. **Light sections are the default.** How It Works, Pricing, ICP, Testimonials, Footer — all on light.
3. **The accent red never appears as a background at large scale** (exception: the primary CTA button). It is an accent, not a fill.
4. **Avoid near-black proliferation.** Do not introduce additional near-black values (#121212, #1A1A1A, #1F1F1F etc). Use `--dark-surface-0` and `--dark-surface-1` only.
5. **The featured pricing card** uses `--dark-surface-0` as its background in a light section — this is a deliberate dark-in-light moment and the only one allowed outside designated dark sections.

### Accessibility

All text/background combinations must meet WCAG AA minimum (4.5:1 for body, 3:1 for large text ≥24px bold / ≥18px regular).

| Text | Background | Ratio | Status |
|---|---|---|---|
| `--text-primary` on `--surface-0` | #0A0A0A / #FFFFFF | 19.6:1 | ✓ AAA |
| `--text-secondary` on `--surface-0` | #5C5B58 / #FFFFFF | 7.2:1 | ✓ AA |
| `--text-primary` on `--surface-1` | #0A0A0A / #F6F5F3 | 18.4:1 | ✓ AAA |
| `--dark-text-primary` on `--dark-surface-0` | #F5F4F0 / #0C0B09 | 18.9:1 | ✓ AAA |
| `--dark-text-secondary` on `--dark-surface-0` | #9C9A94 / #0C0B09 | 6.7:1 | ✓ AA |
| White on `--accent` (buttons) | #FFFFFF / #E8453C | 4.6:1 | ✓ AA |
| `--accent` on `--surface-0` (links) | #E8453C / #FFFFFF | 4.6:1 | ✓ AA |

---

## Spacing System

**Base unit: 4px.** All spacing is a multiple of 4.

| Token | Value | Usage |
|---|---|---|
| `--space-1` | 4px | Micro gaps (icon to label, bullet indent) |
| `--space-2` | 8px | Tight element groupings |
| `--space-3` | 12px | Internal component padding (sm) |
| `--space-4` | 16px | Default internal padding |
| `--space-5` | 20px | Loose internal padding |
| `--space-6` | 24px | Component spacing |
| `--space-8` | 32px | Between related components |
| `--space-10` | 40px | Card internal padding (desktop) |
| `--space-12` | 48px | Between components in a section |
| `--space-16` | 64px | Section sub-divisions |
| `--space-20` | 80px | Section padding top/bottom (mobile) |
| `--space-24` | 96px | — |
| `--space-32` | 128px | Section padding top/bottom (desktop) |
| `--space-40` | 160px | Major section vertical rhythm |

**Section vertical rhythm (desktop):** 128px top + 128px bottom = 256px total per section. This generosity is intentional — it signals premium, not cramped SaaS.

---

## Grid and Layout

### Breakpoints

| Name | Min width | Layout |
|---|---|---|
| mobile | 0px | 4-col grid, 24px gutter, 20px margin |
| tablet | 768px | 8-col grid, 24px gutter, 40px margin |
| desktop | 1280px | 12-col grid, 32px gutter, 80px margin |
| wide | 1440px | 12-col grid, 32px gutter, 120px margin |

**Maximum content width: 1280px.** On wide viewports, content is centred within this container. Background colours extend full-bleed.

### Content Width Variants

Not all content uses the full 12-column width. Three content containers:

| Variant | Width | Use case |
|---|---|---|
| **Narrow** | 6 of 12 cols (centred) | Single-column headline statements, pull quotes, section openers |
| **Default** | 10 of 12 cols (centred) | Standard content, feature grids, prose |
| **Full** | 12 of 12 cols | Full-bleed cards, comparison tables, showcase frames |

Headlines that span the full width feel tabloid. Headlines set in the narrow container feel considered and authoritative. Default to narrow for Display text.

---

## Surface and Elevation

### Border Radius

| Value | Name | Usage |
|---|---|---|
| `0px` | Sharp | — not used. Even the sharpest elements get 2px. |
| `2px` | Micro | Inline tags, badges, overline pill |
| `4px` | Default | Cards, inputs, buttons, modals. **This is the primary value.** |
| `8px` | Loose | Large featured cards (pricing hero card), product preview frames |
| `9999px` | Pill | Standalone tags only |

**No more than two radius values on any single page.** Mixing 4px and 12px and 24px = generic SaaS. Caspr uses 4px (default) and 8px (feature cards) throughout. The precision of sharp corners signals precision of thought.

### Elevation / Shadow

| Level | CSS | Usage |
|---|---|---|
| 0 | none | Default — most cards are flat, defined by border |
| 1 | `0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)` | Hover state on cards |
| 2 | `0 4px 12px rgba(0,0,0,0.10), 0 2px 4px rgba(0,0,0,0.06)` | Dropdowns, tooltips |
| 3 | `0 12px 32px rgba(0,0,0,0.12), 0 4px 8px rgba(0,0,0,0.06)` | Modals, popovers |

**Default cards have no shadow — they use `--border` instead.** Flat, bordered cards feel more editorial and precise than shadow-heavy cards, which feel generic app UI.

---

## Motion

### Philosophy

Motion at Caspr is purposeful. It does not decorate. It draws attention where meaning is being added — a state change, a transition between contexts, a progressive reveal of content.

The pulsating red dot belongs to Ask Caspr. No other element pulses or loops.

### Duration Scale

| Token | Value | Usage |
|---|---|---|
| `--duration-instant` | 0ms | No transition needed (hide/show without animation) |
| `--duration-fast` | 100ms | Hover state colour changes, focus rings |
| `--duration-base` | 200ms | Default transitions (button states, card hovers) |
| `--duration-enter` | 280ms | Elements entering the viewport |
| `--duration-slow` | 400ms | Page-level transitions, modal opens |

No animation should exceed 400ms. Anything slower reads as indulgent.

### Easing

| Token | CSS | Usage |
|---|---|---|
| `--ease-standard` | `cubic-bezier(0.2, 0, 0, 1)` | Default — most transitions |
| `--ease-enter` | `cubic-bezier(0, 0, 0.2, 1)` | Elements entering (decelerate into position) |
| `--ease-exit` | `cubic-bezier(0.4, 0, 1, 1)` | Elements leaving (accelerate out) |

### What Animates

| Element | Animation | Duration | Trigger |
|---|---|---|---|
| CTA button | Background colour to `--accent-hover` | 100ms | Hover |
| Cards | Shadow level 0 → level 1 | 200ms | Hover |
| Navigation dropdowns | Opacity 0→1, translateY(−4px→0) | 200ms | Hover/click |
| Section entrance | Opacity 0→1, translateY(16px→0) | 280ms | Enters viewport (once) |
| Modal/overlay | Opacity 0→1 | 280ms | Open |
| Accordion / FAQ | Height expand | 280ms | Click |
| Page transition | Opacity 0→1 | 200ms | Route change |

### What Never Animates

- Logo
- Overline labels
- Body text
- Any element that is purely decorative
- Anything the user has not interacted with or that has not entered the viewport

### Reduced Motion

All transitions and entrance animations must respect `prefers-reduced-motion: reduce`. When set: all animations use 0ms duration, no translate transforms.

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Component Patterns

### Navigation (Header)

- White background, `--border` bottom, position sticky
- Logo left. Nav links centre or left of centre. CTA button right.
- Nav links: Inter Label L (13px, 500 weight), `--text-primary`
- Active/current page: `--text-primary` + `--border-strong` underline, 1px
- CTA button: `--accent` background, white Inter Label L SemiBold text, 4px radius, 40px height, 20px horizontal padding
- On scroll past 48px: add `box-shadow: 0 1px 0 var(--border)` to reinforce sticky
- Mobile: hamburger icon (24px, `--text-primary`), full-screen drawer, `--surface-0` background, CTA pinned to bottom

### Overline Labels

The red category labels ("ANALYTICAL AI", "HOW IT WORKS", "PRICING") are a core brand element and are **mandatory on every section**. No section opens without an overline.

- Inter SemiBold, 11px, ALL CAPS, letter-spacing 0.08em
- `--accent` colour
- Always appear alone on their own line, above the headline they introduce
- No decoration (no underline, no pill, no dot prefix)
- Margin below: 16px before the headline

Standard overline values by section:

| Section | Overline text |
|---|---|
| Hero | — (no overline; logo and nav carry the brand) |
| Social proof | `TRUSTED BY` |
| How It Works | `HOW IT WORKS` |
| Analysis types | `WHAT YOU GET` |
| ICP selector | `BUILT FOR YOUR ROLE` |
| Output showcase | `ANALYTICAL AI` |
| Category Claim | `A NEW CATEGORY` |
| Pricing | `PLANS & PRICING` |
| Testimonials | `FROM THE FIELD` |
| Enterprise | `FOR TEAMS` |
| Final CTA | `GET STARTED` |

### Headlines

- **Display XL** (Instrument Serif, 72px): One per page. Hero only. Left-aligned on both desktop and mobile — the hero is always a two-column layout (copy left, visual right) at desktop, and left-aligned at mobile.
- **Display L / M** (Instrument Serif, 56px / 40px): Section headline statements. Alignment depends on section type — see the Alignment Philosophy below.
- **Heading 1** (Inter SemiBold, 32px): Section titles in content-heavy layouts, ICP pages.

---

### Alignment Philosophy

**This is the approved system. Apply it consistently — every section, every breakpoint, no exceptions.**

| Section type | Desktop | Mobile |
|---|---|---|
| **Hero** (two-column: copy left / visual right) | LEFT | LEFT |
| **Full-width body sections** (How It Works, Engine, Pricing, Testimonials, Final CTA) | CENTER | **LEFT** |
| **Two-column body sections** (Category Claim) | LEFT | LEFT |
| **Body copy and card text** | LEFT | LEFT |

**Mobile is universally LEFT.** No exceptions on mobile, regardless of section type.

**Desktop uses a hybrid:** full-width sections center their narrow text block (6-col of 12) because centering a 600px block inside a 1440px canvas produces real visual balance. All other sections remain left-aligned.

**Why mobile diverges from desktop:**
Centering works on desktop because there is canvas on either side of the text block — the composition justifies it. On a 390px mobile viewport with a ~350px text block, there is ~20px margin on each side. The centering effect disappears, but the cognitive cost remains: centered text removes the consistent left anchor the eye uses to begin each line, increasing reading friction. Left-aligned text on mobile is more fluent, more natural to the F-pattern scan, and more consistent with the editorial register Caspr borrows from — the FT, Bloomberg, and Economist all use left alignment universally on mobile.

**The desktop test:** Does this section have a column of copy alongside a visual (screenshot, diagram)? → LEFT. Does this section span full width with a centred narrow text block on an expansive canvas? → CENTER.

**On mobile:** Ignore the desktop test. Everything is LEFT.

**Hero headline copy:** The hero headline should lead with the specific, quantified claim — not the tagline alone. Preferred pattern: *"15 minutes. 100 pages. Cited to source."* in Display XL, with the tagline or a supporting subline in Body L below. The 5-second test: a consulting associate who has never heard of Caspr must understand the output and the time to value within one glance.

### Body Copy

- Measure (line length): 60–75 characters. Never full-width on desktop.
- Body L (18px, 1.65 line height) for hero subheadlines and first paragraphs.
- Body M (16px) for all other body copy.
- No justified text. Left-aligned always.
- Paragraph spacing: 1em (equal to font size) between paragraphs. Do not use margin-top on first paragraph.

### Buttons

**Primary (CTA):**
- Background: `--accent`
- Text: white, Inter SemiBold 13px, letter-spacing 0.01em
- Height: 44px (desktop), 48px (mobile — touch target)
- Padding: 0 24px
- Radius: 4px
- Hover: `--accent-hover` background, 100ms
- Focus: 2px offset outline in `--accent`, 2px gap

**Secondary / Ghost:**
- Background: transparent
- Text: `--text-primary`, Inter SemiBold 13px
- Border: 1px `--border-strong`
- Height: 44px
- Hover: `--surface-1` background, 100ms

**Text link (inline):**
- `--accent` colour
- No underline by default, underline on hover
- Used for in-text links and secondary CTAs that don't warrant a button ("See a sample →")
- Arrow suffix → for directional navigation links

**CTA copy standard:** The primary CTA across all pages is *"Start Free — first $100 on Caspr"*. The second clause does conversion work — it answers the objection "what does free mean?" before it forms and communicates the pricing model simultaneously. Do not shorten to "Start free →" or "Get started". The approved copy is the standard.

Exception: secondary CTAs where space is constrained (navigation header) may use "Start Free →".

**Never use:** Outlined `--accent`-coloured buttons. Either fill with red or ghost with black. Mixed signals.

**Mobile button width — design rule (approved 2026-05-19):**

Button width on mobile depends on context. The distinction is brand statement vs. transaction mechanism.

| Context | Width | Alignment | Reason |
|---|---|---|---|
| **Hero CTA** | HUG (fit text + padding) | Left | Brand statement. The button is part of the editorial voice. Full-width reads as consumer app — incompatible with the FT/Bloomberg register Caspr borrows from. |
| **Final CTA fold** | Full width (FILL) | — | Conversion commitment point. The user has read the page and is deciding. Ease of action takes priority over brand impression. |
| **Pricing fold** | Full width (FILL) | — | Action completion. Same logic as Final CTA. |
| **Short-text buttons** ("Contact Sales", "Book a call" — natural width under ~180px) | Full width (FILL) | — | Tap target at HUG width would be too small for reliable mobile interaction. |

**Why hero buttons should never be full width on mobile:** A 350px full-width button on a 390px viewport is a Duolingo pattern, not a Bloomberg pattern. The Caspr audience — senior consultants, PE associates, VP Strategy — has a subconscious pattern-match between full-width CTAs and low-quality SaaS. Visual rigour is a trust signal. The tap-target concern is resolved by the naturally long CTA text ("Start Free — first $100 on Caspr") which produces a ~280–300px HUG button — well above the 44px minimum height and adequate in width.

**Button text alignment:**

| Button width | Text alignment |
|---|---|
| HUG (hero CTAs) | Left — or irrelevant, since button width = text width |
| Full-width / FILL (pricing, final CTA, short-text) | **Centre** |

Left-alignment applies to editorial content (body copy, headlines, labels) because it follows reading flow. A button is a discrete interactive element, not editorial text. When a button is full-width, left-aligned text looks unanchored — like it accidentally didn't fill the container. Centre-aligned text reads as intentional. This is one convention where the convention is simply correct: Apple HIG, Material Design, and Bloomberg's component library all centre button text regardless of body copy alignment rules.

**Apply at every breakpoint:** This rule applies to mobile (390px) and any viewport below 768px. Tablet and desktop follow their own layout logic.

### Cards

- Background: `--surface-0`
- Border: 1px `--border`
- Radius: 4px (default), 8px (featured/hero card)
- Padding: 32px (desktop), 24px (mobile)
- No shadow by default — add shadow level 1 on hover
- Cards in a grid: equal height via CSS grid, content top-aligned, CTA bottom-aligned

**Featured card** (e.g. Professional pricing plan):
- Background: `--dark-surface-0`
- Text: `--dark-text-primary`
- Border: none
- Radius: 8px
- Slightly larger scale (104% via transform: scale or explicit size)

### Feature / How It Works Cards

The numbered step cards ("01 / 02 / 03") need a specific treatment that avoids the generic SaaS look:

- Numbers: DM Mono Data L (32px), `--accent` colour, displayed as "01" "02" "03"
- Background: `--surface-0`
- Border: 1px `--border`
- Radius: 4px
- The number sits at the top of the card, separated from the heading by 24px
- Heading: Inter Heading 2 (24px SemiBold)
- Body: Inter Body S (14px)

### Pricing Section

The pricing section requires three elements beyond the card design:

**1. Comparison anchor** — A single line above the cards that frames cost in context before the visitor sees the prices. Without this anchor, `$80` is an arbitrary number. With it, `$80` is a revelation.

> Standard anchor copy: *"The same research takes weeks and costs $50,000 from a consulting firm. Caspr delivers comparable depth starting at $15."*

This line appears above the cards in Inter Body M, `--text-secondary`, centred in the narrow container. It is not a heading — it is a pre-frame.

**2. Recommended plan indicator** — The Study tier (featured card in `--dark-surface-0`) carries an Inter SemiBold 11px ALL CAPS overline: `MOST POPULAR`. This is the only text on the dark card in `--accent` red — it signals which plan Caspr recommends without requiring the visitor to reason through the tiers.

**3. Free trial statement below the cards** — After the cards, one line in Inter Body S, `--text-secondary`, centred: *"Start with $100 free. No credit card required. No subscription."* This removes the final objection before the CTA is clicked.

### Testimonial Block

Testimonials are the highest-converting trust signal for this ICP. They must be attributed, specific, and tied to an outcome — not a sentiment.

**Component structure:**
- Quote: Instrument Serif Regular 24px (Display M), `--text-primary`, narrow container (8-col)
- Attribution row below quote: Photo (40px circle) · Full name (Inter SemiBold 14px) · Title and company (Inter Regular 14px, `--text-secondary`)
- Separator: `--border` 1px rule between testimonials in a row

**Quality bar:** Every testimonial must include a specific outcome, number, or before/after. *"Caspr saves me time"* does not qualify. *"I ran a 40-country competitive analysis in 90 minutes. That used to take my team three weeks."* qualifies.

**Placement:** Between the Pricing section and the Final CTA on every page. On ICP pages, use the testimonial from the matching role.

**Section background:** `--surface-1` (warm off-white). Overline: `FROM THE FIELD`.

### Category Claim Section

This section asserts the "Analytical AI, not Generative AI" positioning. The claim requires visual proof alongside the copy — the ICP is professionally sceptical.

**Required visual element:** A cropped screenshot or illustration of an actual Caspr report page showing:
- Structured section headings (not a wall of text)
- A source citation row (e.g. "Source: McKinsey Global Institute, 2024")
- A data point or chart
- Page indicator (e.g. "Page 47 of 100")

This screenshot sits to the right of the copy block at desktop, below it at mobile. It is the evidence that the copy cannot provide. Without it, the category claim is assertion. With it, it is demonstration.

**Background:** `--dark-surface-0`. Copy left-aligned in the narrow container. Visual right-aligned in the remaining columns.

### Product Preview (the UI mockup in the hero)

This is one of Caspr's most important visual assets — showing the product working.

- Background: `--dark-surface-1`
- Border: 1px `--dark-border`
- Radius: 8px
- Internal padding: 20px
- The red dot (status indicator): 8px circle, `--accent`, no pulse (pulsating red dot is reserved for Ask Caspr in the product)
- Content rows: skeleton-style placeholder bars, `--dark-surface-2`, varying widths
- Stats row at bottom: "15 min · $80 · 100+ pages" in Inter Label M, `--dark-text-primary`

### Imagery and Report Preview

The single most persuasive visual asset on the site is an actual Caspr report page — not a UI screenshot, not an illustration, not a generic chart. A page from a real report showing structured headings, source citations, data points, and the 100-page depth.

**Report preview component (for hero and output showcase sections):**
- Browser chrome mockup: window frame in `--dark-surface-1`, red dot (brand red, no pulse), URL bar in DM Mono
- Report page inside the chrome: structured content — section heading, skeleton text rows, stat blocks in DM Mono, source citation row at bottom
- Page indicator in DM Mono (e.g. "Page 23 of 108") — this single element communicates depth more than any copy
- Frame background: `--dark-surface-1`, border `--dark-border`, 8px radius

**Stat blocks within preview:** Use DM Mono Medium at 22px for numbers. These are data. They signal Analytical AI.

**Photography/illustration policy:** Avoid stock photography of people at laptops. Avoid generic abstract AI imagery (glowing nodes, neural network graphics). The product output — the report itself — is the imagery. If a human visual is needed, prefer high-contrast editorial portraiture (FT/Bloomberg style), never stock.

### Section Backgrounds — Usage Map

| Section | Background |
|---|---|
| Navigation | `--surface-0` (white) |
| Hero | `--dark-surface-0` (black) |
| Social Proof (logos) | `--surface-1` (warm off-white) |
| How It Works | `--surface-0` (white) |
| Analysis Types | `--surface-1` |
| ICP selector | `--surface-0` |
| Output showcase | `--dark-surface-0` (black) |
| Category Claim | `--dark-surface-0` (black) |
| Pricing preview | `--surface-0` |
| Testimonials | `--surface-1` |
| Enterprise strip | `--dark-surface-0` or `--ink` |
| Final CTA | `--surface-0` or `--accent` (red CTA strip — use once only, at bottom) |
| Footer | `--ink` (#0A0A0A) |

Dark sections appear at: Hero, Output Showcase, Category Claim, Enterprise Strip, Footer. That is 5 uses. The alternation between light and dark creates rhythm without randomness.

---

## Anti-Patterns

Things specifically observed in the previous design that must not recur.

| Anti-pattern | Why | What to do instead |
|---|---|---|
| Source Serif Pro Black at >48px | Reads as tabloid newspaper front page | Instrument Serif Regular at equivalent size — it commands authority without newspaper weight |
| Multiple near-black values (#121212, #1A1A1A, #0F0F0F, #1F1F1F) | Creates inconsistency across sections, visible as "off" | Use `--dark-surface-0` and `--dark-surface-1` only |
| Red as #EF4444 | Wrong brand colour | `#E8453C` only. No Tailwind red. |
| Rounded corners >8px on rectangular cards | Generic SaaS | 4px default, 8px maximum |
| Light section using cold gray (#F5F5F5, #E5E5E5) | Feels like a template, not designed | Use `--surface-1` (#F6F5F3 — warm) throughout |
| Centred Display XL headline spanning full 12 columns in the **hero** | Looks like a banner or poster | Hero is always LEFT — two-column layout requires left alignment |
| LEFT-aligned headlines in full-width body sections on **desktop** (How It Works, Pricing, Testimonials, etc.) | Produces an asymmetric float with dead space right on a wide canvas | Desktop only: CENTER the narrow text block — see Alignment Philosophy |
| CENTER-aligned headlines on **mobile** in any section | Centering on a 390px viewport has no compositional payoff; removes the left anchor the eye needs; reads as startup landing page, not editorial intelligence | Mobile is universally LEFT — no centering on mobile, ever |
| Every section alternating dark/light without logic | Feels like a theme switcher, not design | Follow the Section Backgrounds usage map above — dark is earned |
| Inter Bold (700) for headings | Too heavy, loses premium feel | Inter SemiBold (600) maximum |
| Instrument Serif at body sizes (<32px) | Loses character, reads poorly | Instrument Serif only at Display sizes. Inter for everything else. |
| DM Mono for anything other than numbers/statistics | Reads as code, not data | DM Mono is strictly for numerical callouts |
| Shadows on cards by default | Soft, rounded, generic app | Flat cards with `--border`, shadow only on hover |
| Animations >400ms | Indulgent, slows the page feel | Cap at 400ms, default to 200ms |

---

## Implementation Notes

**Tech stack:** Next.js + Vercel. No CSS framework specified — recommend CSS custom properties for the token system, Tailwind for utility spacing/layout, with the custom property tokens overriding Tailwind's defaults where needed.

**Font loading:** Use `next/font` with `display: swap` for all three typefaces. Preload the regular weight of each. Instrument Serif is variable — load only weight 400 to minimise payload.

```js
// Example next/font setup
import { Inter, Instrument_Serif, DM_Mono } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const instrumentSerif = Instrument_Serif({ 
  subsets: ['latin'], 
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-display', 
  display: 'swap' 
})
const dmMono = DM_Mono({ 
  subsets: ['latin'], 
  weight: '400',
  variable: '--font-mono', 
  display: 'swap' 
})
```

**CSS custom properties:** Define all colour and spacing tokens in `:root`. Dark section overrides are applied via a `data-theme="dark"` attribute on the section element, not via class toggles or separate stylesheets.

```css
:root {
  --font-display: 'Instrument Serif', Georgia, serif;
  --font-text: 'Inter', system-ui, sans-serif;
  --font-mono: 'DM Mono', 'Courier New', monospace;

  --ink: #0A0A0A;
  --white: #FFFFFF;
  --accent: #E8453C;
  --accent-hover: #D13B33;
  --accent-pressed: #BE3530;
  --accent-subtle: #FEF1F0;

  --surface-0: #FFFFFF;
  --surface-1: #F6F5F3;
  --surface-2: #EDECE9;
  --border: #E2E1DE;
  --border-strong: #C8C7C4;
  --text-primary: #0A0A0A;
  --text-secondary: #5C5B58;
  --text-tertiary: #9C9B98;
}

[data-theme="dark"] {
  --surface-0: #0C0B09;
  --surface-1: #161512;
  --surface-2: #211F1C;
  --border: #2E2C28;
  --border-strong: #403E39;
  --text-primary: #F5F4F0;
  --text-secondary: #9C9A94;
  --text-tertiary: #5C5A55;
}
```

---

## What Comes Next

These guidelines cover the website only. Subsequent documents will cover:

1. **Tool UI visual guidelines** — denser type scale, functional component library, reading mode (reduced contrast for long-form report reading), dark mode as a primary option
2. **Social media visual guidelines** — square/portrait crop system, reduced text, high-contrast compositions for feed and stories
3. **Report design guidelines (PDF/PPTX)** — page grid, print-safe palette, chart colour system, typographic hierarchy for 100-page documents
4. **Email design guidelines** — constrained HTML email rendering, inline styles, mobile-first layout

Each inherits the foundation tokens from this document (palette, typefaces, spacing base unit) and defines channel-specific adaptations.
