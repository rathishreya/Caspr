# Figma Pre-Handoff Review Checklist

*Review this before finalizing the Figma file as the dev input.*

---

## 1. Page Inventory
- [ ] All Phase 1 pages exist as separate Figma frames: `/` · `/pricing` · `/enterprise` · `/consulting` · `/strategy` · `/investors` · `/security` · `/privacy` · `/terms`
- [ ] All Phase 2 ICP pages designed: `/agencies` · `/startups` · `/category-managers` · `/market-research` · `/academic`
- [ ] Each page has both a **desktop** (1440px) and **mobile** (390px) frame — not just desktop with a note "make it responsive"
- [ ] No placeholder lorem ipsum copy anywhere — every text block uses the real approved copy

---

## 2. Brand Compliance

### Colour
- [ ] Red is exactly `#E8453C` — not Tailwind `#EF4444`, not `#FF4444`. Check every button, overline label, and accent dot
- [ ] Near-black body backgrounds use `#0C0B09` (dark sections) — not `#000000`, `#121212`, or any other near-black
- [ ] Light section backgrounds use `#F6F5F3` (warm off-white) — not cold gray `#F5F5F5` or `#EEEEEE`
- [ ] No gradients anywhere

### Typography
- [ ] Display text (hero headline, section statements) uses **Instrument Serif Regular 400** — never Bold
- [ ] Instrument Serif is never used below 32px — below that, it must be Inter
- [ ] All body copy, labels, navigation, and buttons use **Inter** — max weight SemiBold 600, never Bold 700
- [ ] Price figures and key statistics (`$80`, `15 min`, `100 pages`, `25M+`) use **DM Mono** — nothing else uses DM Mono
- [ ] Overline labels (`HOW IT WORKS`, `ANALYTICAL AI`, `PLANS & PRICING`) are Inter SemiBold 11px ALL CAPS in `#E8453C` — every section has one, no exceptions

### Corners & Shadows
- [ ] Cards use 4px border-radius (featured pricing card: 8px) — nothing above 8px
- [ ] Default cards are flat with a `1px #E2E1DE` border — no drop shadows except on hover state

---

## 3. Alignment
- [ ] Hero headlines: LEFT on both desktop and mobile
- [ ] Full-width body sections (How It Works, Pricing, Testimonials, Final CTA): CENTER on desktop, LEFT on mobile
- [ ] No centered text on mobile anywhere — universally LEFT on mobile

---

## 4. Copy Accuracy

### CTAs
- [ ] Primary CTA copy is **"Start Free — first $100 on Caspr"** — not shortened to "Start Free" or "Get Started"
- [ ] Navigation header CTA may use shortened "Start Free →" — that's the only exception
- [ ] Each page has exactly one primary CTA and one secondary CTA — no page has more

### ICP Hero Headlines
Verify each matches exactly:
- [ ] `/consulting` — *"The sector you've never covered. The client briefing is tomorrow."*
- [ ] `/strategy` — *"The board needs a strategic options paper. They need it in three weeks, not twelve."*
- [ ] `/investors` — *"The deal lands Monday. Sector context is ready Tuesday."*
- [ ] `/agencies` — *"Know your client's industry better than they do. Every time. Before the briefing."*
- [ ] `/startups` — *"Every investor will question your market size number. Have the right answer."*
- [ ] `/category-managers` — *"The data tells you what happened. Caspr tells you what it means."*

### Banned Words
Scan all frames for:
- [ ] No exclamation points anywhere
- [ ] None of: *platform, leverages, algorithms, workflows, powerful AI, revolutionary, game-changing, chatbot, web scraping, hallucinate, "excited to announce", "Here's how:", LAM*

---

## 5. Pricing Copy
- [ ] Analysis prices shown: Brief **$15** · Study **$80** · Intelligence **$300**
- [ ] Free trial framed as: *"First $100 on Caspr — no credit card"* (not "$14/month" or other variations)
- [ ] Platform fee (7%) is **not shown anywhere**
- [ ] SOC 2 copy reads *"SOC 2 Type I audit in progress"* — never *"SOC 2 certified"*
- [ ] Study tier carries a `MOST POPULAR` overline badge in the pricing card

---

## 6. Security Integration
Verify the correct level per page:
- [ ] `/consulting`, `/strategy`, `/agencies` — L2 micro-copy below CTA
- [ ] `/investors` — L3 contextual inline in body copy (near data room mention)
- [ ] `/startups`, `/category-managers` — no security copy (intentional)
- [ ] `/pricing` — L2 below CTA + L4 FAQ entry
- [ ] `/enterprise` — L1 trust strip below hero + L4 FAQ entry
- [ ] Homepage — L1 trust strip above footer
- [ ] Every security mention links to `/security`

---

## 7. Navigation

### Header
- [ ] Logo: *"Caspr."* with red dot — the dot is part of the mark
- [ ] Dropdowns designed: Solutions · Use Cases · Analyses
- [ ] "Start Free →" button is red (`#E8453C`), rightmost, always visible
- [ ] Mobile hamburger drawer designed with sections as accordions and CTA pinned to bottom

### Footer
- [ ] All 5 columns present: Product · Solutions · Use Cases · Company · Trust & Legal
- [ ] Security is **first** in the Trust & Legal column (not Privacy)
- [ ] All links accounted for per the architecture doc

---

## 8. Component States
- [ ] Buttons have hover state designed (`#D13B33` background)
- [ ] Cards have hover state (shadow level 1 on)
- [ ] Navigation dropdowns have open/closed states
- [ ] FAQ accordions have open/closed states
- [ ] Form inputs (if any on pricing/enterprise) have focus state

---

## 9. Dark Sections
- [ ] Dark sections are only used for: Hero · Output Showcase/Category Claim · Enterprise Strip · Footer — maximum 3–4 per page
- [ ] Dark section backgrounds use `#0C0B09` only — no other near-blacks
- [ ] Text on dark uses `#F5F4F0` (primary) and `#9C9A94` (secondary)

---

## 10. Dev Handoff Specifics
- [ ] All layers are named semantically (not "Rectangle 47", "Group 12")
- [ ] Figma styles/variables are used for colours — not hard-coded fills
- [ ] Spacing follows the 4px grid (every gap/padding is a multiple of 4)
- [ ] Auto-layout applied to all components that contain variable-length text
- [ ] Assets that need to be exported (logo, OG image, icons) are marked for export
- [ ] The `/security` certification badges (ISO 27001:2022, GDPR) are present as components — not missing placeholders
