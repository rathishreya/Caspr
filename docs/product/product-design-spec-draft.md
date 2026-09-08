# Caspr App — Product Design Spec (Draft)

> ⚠️ **Superseded for shell & navigation.** The three-column shell, file-drawer "icon rail", and any nav here are **out of date** — the built rail (`626:76`), `app-shell-framework.md`, `navigation-flow-map.md`, and `DEV-HANDOVER.md` win. This draft remains useful only for early screen-level content; it is **not** in the build spec index. Do not build nav/shell from here.

**Status:** Draft — pending Jayant's answers to 8 blocking questions (see Open Items)  
**Date:** 2026-05-23  
**Owner:** Joy Sharma  
**Purpose:** Design brief for Figma. Covers all screens, flows, components, and interactions needed to begin high-fidelity design. Open items are flagged with 🔲 and can be resolved without blocking design work.

---

## Contents

1. [Design System](#1-design-system)
2. [Screen Inventory](#2-screen-inventory)
3. [User Journeys](#3-user-journeys)
4. [Screen Specs](#4-screen-specs)
   - 4.1 Auth
   - 4.2 The Analyst's Desk (main shell)
   - 4.3 New Analysis — Greeting
   - 4.4 Gate 1 — Depth + Files
   - 4.5 Source Web (Learning Brain)
   - 4.6 Layout Canvas + Clarifying Questions
   - 4.7 Gate 2 — Style + Language + Template
   - 4.8 Generation — Progressive Report Build
   - 4.9 Report View (completed analysis)
   - 4.10 Ask Caspr (section-level Q&A)
   - 4.11 File Drawer
   - 4.12 User Profile + Context Layer
   - 4.13 Wallet + Billing
   - 4.14 Sharing + Collaboration
   - 4.15 Onboarding
5. [Component Inventory](#5-component-inventory)
6. [Interaction Patterns](#6-interaction-patterns)
7. [Open Items](#7-open-items)

---

## 1. Design System

### Brand Identity

**Category:** Analytical AI — not a chatbot, not a generative tool. A senior analyst.  
**Register:** Financial press — FT, Bloomberg, The Economist. Premium. Dense. Trustworthy.  
**Tagline:** Caspr means Business.

### Typography

| Role | Font | Weight | Notes |
|---|---|---|---|
| Display / headlines | Instrument Serif | Regular, Italic | Large titles, report headings, hero text |
| Body / UI | Inter | 400, 500, 600 | All interface text, labels, body copy |
| Data / monospace | DM Mono | Regular, Medium | Numbers, percentages, source counts, code |
| Wordmark only | Source Serif 4 | Semibold | Never used in UI except the logo |

**Type scale (16px base):**

| Token | Size | Line Height | Usage |
|---|---|---|---|
| `display-2xl` | 48px | 56px | Hero headings |
| `display-xl` | 40px | 48px | Page titles |
| `display-lg` | 32px | 40px | Section headings |
| `display-md` | 24px | 32px | Subsection headings |
| `display-sm` | 20px | 28px | Card titles, emphasis |
| `body-lg` | 18px | 28px | Lead paragraph, first section of report |
| `body-md` | 16px | 24px | Default body |
| `body-sm` | 14px | 20px | Secondary text, metadata |
| `label-md` | 14px | 20px | Labels, buttons — Inter Medium |
| `label-sm` | 12px | 16px | Tags, badges — Inter Medium |
| `mono-md` | 14px | 20px | DM Mono — numbers, counters |
| `mono-sm` | 12px | 16px | DM Mono — small data |

### Colour Palette

| Token | Hex | Usage |
|---|---|---|
| `ink` | `#000000` | Primary text, most UI |
| `white` | `#FFFFFF` | Backgrounds, inverted text |
| `accent` | `#E8453C` | Red dot, CTAs, active states, critical highlights |
| `accent-hover` | `#C93530` | Hover on accent elements |
| `surface-0` | `#FFFFFF` | Page/canvas background |
| `surface-1` | `#F8F8F7` | Elevated surfaces (cards, panels) |
| `surface-2` | `#F0F0EE` | Subtle backgrounds, hover states |
| `border` | `#E4E4E0` | Dividers, card borders |
| `border-strong` | `#C8C8C4` | Stronger borders, active containers |
| `text-primary` | `#111111` | Primary text |
| `text-secondary` | `#555550` | Secondary/supporting text |
| `text-tertiary` | `#909088` | Placeholder, disabled |
| `success` | `#1A7A4A` | Positive states |
| `warning` | `#8B5000` | Caution states |
| `error` | `#B91C1C` | Error states |

**Note:** Red (`accent`) is used sparingly. One or two elements per screen maximum. It marks what matters most.

### Spacing

8px base grid. Key values: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96px.

### Elevation

No drop shadows. Depth communicated through background colour contrast and borders only. Surface-1 sits above Surface-0 without shadows — this is the editorial register.

### Border Radius

| Component | Radius |
|---|---|
| Buttons | 4px |
| Cards, panels | 8px |
| Tags, badges | 4px |
| Modal/sheet | 12px top corners |
| Avatar | 50% |

### Icon Set

Lucide icons — 20px stroke, 1.5px line weight. Never filled icons.

### The Red Dot

Caspr's signature mark. A filled red circle (16–20px) that appears as a period terminating key phrases in the UI — echoing the wordmark. Use deliberately: one per screen, at the most important conclusion or CTA. Not decorative.

---

## 2. Screen Inventory

| Screen | Route | Authenticated | Notes |
|---|---|---|---|
| Sign in | `/sign-in` | No | Clerk-hosted or embedded |
| Sign up | `/sign-up` | No | |
| Onboarding | `/onboarding` | Yes | First-time only; minimal |
| The Analyst's Desk | `/` | Yes | Main shell — all analysis work happens here |
| New analysis (greeting) | `/` (empty state) | Yes | Entry point — shown when no analysis is open |
| Gate 1 | Modal / inline | Yes | Depth + file upload |
| Source Web | Overlay / main panel | Yes | Learning Brain phase |
| Layout Canvas | Main panel | Yes | Aha Moment 1 |
| Gate 2 | Modal / inline | Yes | Style + language + template |
| Generation | Main panel | Yes | Progressive report build |
| Report view | `/analyses/:id` | Yes | Aha Moment 3 |
| Ask Caspr | Panel / drawer | Yes | Section-level cited Q&A |
| File drawer | `/` sidebar | Yes | All analyses + uploaded files |
| User profile | `/profile` | Yes | ICP info, Context Layer summary |
| Context Layer | `/profile/context` | Yes | The 20 ICP questions |
| Wallet | `/wallet` | Yes | Balance, transactions, plans |
| Billing / upgrade | `/billing` | Yes | Plan management via Stripe |
| Share report | Modal | Yes | Collaboration link + permissions |
| Collaborator view | `/analyses/:id?share=:token` | Yes (must sign in) | Read / annotate shared report |
| Version history | Panel | Yes | Analysis versions |
| Audit log | `/settings/audit` | Yes | Enterprise only |
| Settings | `/settings` | Yes | Minimal — auth, notifications |

---

## 3. User Journeys

### Journey 1: New User → First Analysis → Aha Moment (Priority 1)

```
Sign up
  → Minimal onboarding (ICP selection only — 60 seconds)
  → The Analyst's Desk (empty state / greeting)
  → Types research prompt
  → Gate 1: confirm depth + optional file upload
    → Learning Brain starts immediately in background
  → Source Web visualization plays out
  → Layout Canvas appears (Aha Moment 1)
  → User answers 1–3 clarifying questions (while analysis continues)
  → Gate 2: style + language + template
    → Thinking Brain + generation begins
  → Progressive report build (Aha Moment 2 — watching it build)
  → Completed report — auto-scroll to Executive Summary (Aha Moment 3)
```

**Critical:** Aha Moment 3 must be reached in under 15 minutes from Gate 1 submission for Brief analyses. This is the product promise.

### Journey 2: Returning User → New Analysis With Saved Files

```
Sign in
  → Analyst's Desk (with previous analyses in file drawer)
  → Greeting — previous context acknowledged
  → New analysis prompt
  → Gate 1: files already in drawer, one click to include
  → [continues as Journey 1]
```

### Journey 3: Collaboration

```
Report owner opens completed analysis
  → Clicks "Share"
  → Sets permission level per section (view / annotate)
  → Copies link or enters collaborator email
  → Collaborator receives link → must sign in to Caspr
  → Collaborator views report with annotation capability
  → Owner sees collaborator activity in audit log
```

### Journey 4: Version 2 (Re-Analysis)

```
User on completed report
  → Sees "What Changed" badge (if Learning Brain detects updated data)
  → Clicks "Create Version 2"
  → Pre-filled prompt with context from Version 1
  → Gate 1 (same files, same depth, or adjust)
  → [continues as Journey 1]
  → Version 2 appears alongside Version 1 in file drawer
```

### Journey 5: Intelligence Analysis (Long-Form, up to 24 hours)

```
[Same as Journey 1 with depth = Intelligence]
  → After Gate 2, user is told: "This analysis will be ready within 24 hours.
     We'll notify you by email and in-app when it's done."
  → User can leave — analysis continues server-side
  → Email + in-app notification on completion
  → User returns → Report view
```

---

## 4. Screen Specs

---

### 4.1 Auth

**Design approach:** Clerk-embedded (not hosted). The Caspr brand is present. No Clerk logo visible to users.

#### Sign In

**Layout:** Centered card on a black background. The Caspr wordmark above the card. The red dot period in the wordmark is the only red element on the page.

**Card contents (top to bottom):**
1. Headline: "Good to have you back." — Instrument Serif, display-md
2. Subtext: "Sign in to continue your analysis." — body-sm, text-secondary
3. Divider
4. Google OAuth button — full width, `surface-1` background, Google icon + "Continue with Google"
5. Microsoft OAuth button — full width, Microsoft icon + "Continue with Microsoft"
6. LinkedIn OAuth button — full width, LinkedIn icon + "Continue with LinkedIn"
7. Divider with label "or"
8. Email input
9. Password input
10. "Sign in" button — full width, black background, white text
11. "Forgot password?" — text link, text-secondary
12. Divider
13. "Don't have an account? Start for free" — link

**Note:** The three OAuth options listed first. Email/password is secondary. LinkedIn placement is intentional — primary ICP discovery channel.

**Mobile:** Same layout, full-screen card, no background.

#### Sign Up

**Layout:** Same structure as sign in.

**Card contents:**
1. Headline: "Analyst-grade research. In minutes." — Instrument Serif, display-md
2. Subtext: "$100 of free research. No credit card." — body-sm, text-secondary. The "$100" is in DM Mono.
3. [Same OAuth + email/password fields]
4. Instead of sign-in link: "Already have an account? Sign in"
5. Below the button, in label-sm text-tertiary: "By continuing, you agree to our Terms and Privacy Policy."

**Note:** The free trial value ($100) is stated immediately. No hedging.

---

### 4.2 The Analyst's Desk (Main Shell)

**The fundamental layout principle:** Documents are the product. The conversation is a tool. Caspr is not a chatbot that produces documents — it is a document environment with an analyst embedded in it.

#### Desktop Layout (1280px+)

```
┌─────────────────────────────────────────────────────────────────────────┐
│ Topbar: wordmark left | analysis title center | share/export/… right   │
├────────┬────────────────────────────────────────┬────────────────────────┤
│        │                                        │                        │
│  File  │           Main Content Area            │    Caspr Panel         │
│ Drawer │        (report / canvas / source)      │  (conversation flow)   │
│        │                                        │                        │
│ 240px  │           flex: 1                      │       320px            │
│        │                                        │                        │
│ [pin   │                                        │  [collapse ‹]          │
│  icon] │                                        │                        │
└────────┴────────────────────────────────────────┴────────────────────────┘
```

**File Drawer (left, 240px):**
- Pinnable. Default: open on desktop. Can collapse to 48px icon rail.
- "New analysis" button at top — primary CTA, full drawer width.
- Below: folder tree + analysis cards.
- At bottom: user avatar + name + wallet balance display + settings link.
- Transition: smooth slide collapse. Collapsed state shows icons only (folder icon, analysis icon, settings icon).

**Main Content Area:**
- Where all primary content displays: greeting, gates, source web, layout canvas, generation, completed report.
- Full height, scrollable.
- No chrome — the content IS the experience.

**Caspr Panel (right, 320px):**
- The analyst's voice. Not a chat window.
- Shows contextual content based on what's happening in the main area:
  - During Learning Brain: progress notes in analyst voice ("Reviewing IMF WEO projections...")
  - During clarifying questions: Caspr's questions appear here too (mirrored)
  - During generation: section-level observations as each section completes
  - On completed report: "Ask Caspr" input is here
- Collapsible with a chevron toggle.
- Background: `surface-1`.
- No persistent message history scrollback — Caspr's current state, not a chat log.

**Topbar:**
- Height: 52px.
- Left: Caspr wordmark (small, 24px height). Links to `/`.
- Center: Current analysis title. Editable on click. Placeholder: "New Analysis" for unsaved work.
- Right: Share button | Export (PDF/PPTX) | More (⋯) | [Research Budget pill: "$86.40 remaining"]

The Research Budget pill is always visible in the topbar. It's not a notification — it's context. Displayed as `$86.40` in DM Mono. Clicking opens the wallet page.

#### Tablet Layout (768–1279px)

- File drawer collapsed to icon rail by default.
- Caspr panel collapsed by default, accessible via a panel toggle button in topbar.
- Main content area takes full width.

#### Mobile Layout (<768px)

```
┌─────────────────────────────────────────┐
│ Topbar: wordmark | title | ⋯             │
├─────────────────────────────────────────┤
│                                         │
│           Main Content Area             │
│         (full screen, scrollable)       │
│                                         │
│                                         │
│                                         │
├─────────────────────────────────────────┤
│  [≡ Analyses]  [💬 Caspr]  [+ New]      │  ← tab bar (48px)
└─────────────────────────────────────────┘
         ↑ File drawer is a bottom sheet that pulls up
```

- Bottom tab bar: Analyses (file drawer as bottom sheet) | Caspr (panel as bottom sheet) | New analysis
- Bottom sheet: pulls up to 85% screen height. Handle visible at top. Background dims.
- All analysis work (gates, source web, canvas, generation, report) happens in the main content area, full screen.

---

### 4.3 New Analysis — Greeting

This is the empty state of the Analyst's Desk. The user has no analysis open.

**Philosophy:** The first words Caspr says set the tone for the entire relationship. Not "What would you like to research?" (a search engine). Not "State your research objective" (a form). Caspr is a senior analyst. The user has just walked in.

**Layout (Main Content Area):**

```
                                         
  [time-based greeting, Instrument Serif display-md]
  Good morning, Sarah.
  
  [body-md, text-secondary, one line]
  What are you working on today?
  
  [72px vertical space]
  
  ┌───────────────────────────────────────────────────────┐
  │  [input, placeholder: "A market, a company, a          │
  │   decision — start anywhere."]                        │
  └───────────────────────────────────────────────────────┘
  
  [below input, inline depth selector]
  Depth:  [ Brief · ~15 min ]  [ Study · ~45 min ]  [ Intelligence · ~24 hr ]
  
  [small text below depth selector, text-tertiary]
  Brief $15 · Study $80 · Intelligence $300
  
  [file attach icon + "Add files" text link, subtle]
```

**Greeting logic:**
- First visit: "Good [morning/afternoon/evening], [first name]."
- Returning user: "Good morning, [first name]." + optionally one line noting something relevant: "You have 3 analyses in your Global Logistics folder." or "Welcome back." — never over-familiar.
- Name always uses their first name from Clerk profile.
- Time-based: morning before noon, afternoon 12–17, evening 17+.

**Input behaviour:**
- Full width of main content area (max 640px centered).
- On focus: border goes from `border` to `ink`. No animation — immediate.
- Multi-line allowed. Enter submits (with depth selected). Shift+Enter for new line.
- On submit: transition to Gate 1.

**Depth selector:**
- Three inline pills. Default: Study (the middle option).
- Selected state: black background, white text.
- Unselected: `surface-2` background, text-primary.
- Clicking a pill selects it — no separate confirmation.
- Price label below in DM Mono, label-sm.

**Add files:**
- A subtle "📎 Add files" link below the depth selector.
- Clicking opens the Gate 1 file upload inline (see 4.4).
- Optional at this stage — users proceed without files.

**Right panel (Caspr Panel) during greeting state:**
- Shows 3–4 recent analysis summaries from the user.
- If new user, no suggestions — the panel is empty or shows "Your analyses will appear here."

---

### 4.4 Gate 1 — Depth + Files

**When triggered:** User submits a prompt from the greeting (or anytime before Learning Brain starts).

**What this is:** A mandatory confirmation before Learning Brain begins. Two inputs only: depth (likely already selected) and file upload (optional but clearly prompted). This defines cost and available context. It is not a questionnaire.

**Critical:** As soon as Gate 1 is confirmed, Learning Brain begins immediately in the background. The user is not waiting — work is already happening while they're at Gate 1.

**Layout:** This replaces the greeting in the main content area. It is not a modal on desktop (it IS a bottom sheet on mobile).

```
  [label-sm, text-secondary, uppercase tracking]
  BEFORE WE START
  
  [display-sm, Instrument Serif]
  Confirm your analysis parameters.
  
  [12px space]
  
  ┌─── Depth ──────────────────────────────────────────────────────────┐
  │                                                                    │
  │  [ Brief                ] [ Study                ] [ Intelligence ]│
  │  15–25 pages              60–80 pages              100+ pages      │
  │  ~15 minutes              ~45 minutes              Up to 24 hours  │
  │  $15                      $80                      $300            │
  │                                                                    │
  └────────────────────────────────────────────────────────────────────┘
  
  [16px space]
  
  ┌─── Files ──────────────────────────────────────────────────────────┐
  │  Files inform Caspr's analysis — uploaded documents, client        │
  │  briefs, data exports, or background reading.                      │
  │                                                                    │
  │  [Previously uploaded files shown as chips if any exist]           │
  │  ☑  Q1 2025 Market Report.pdf    ☑  Client Brief - TechCorp.docx  │
  │                                                                    │
  │  [+ Upload new file]    [or drag files here]                       │
  │                                                                    │
  │  [small text, text-tertiary]                                       │
  │  Uploaded files are stored securely in your Caspr library.         │
  │  They'll be available for future analyses.                         │
  └────────────────────────────────────────────────────────────────────┘
  
  [24px space]
  
  [full width button]  ████████ Start Research ████████
  
  [below button, text-tertiary label-sm centered]
  $80 will be deducted from your research budget.  Balance after: $6.40
```

**Depth cards:**
- Currently selected depth is highlighted (black border, `ink` background chip in corner).
- Estimated pages, time, and cost shown for each option.
- If user changes depth here, the cost estimate below the button updates.

**Previously uploaded files:**
- If the user has files in their library, they appear as checkboxes.
- Default: all files checked (included). User can uncheck any.
- Unchecking a file: it's still in their library, just excluded from this analysis.
- "Include all files from my library" toggle above the chips if there are >5 files.

**File upload:**
- Drag-and-drop zone.
- File types: PDF, DOCX, XLSX, CSV, PPTX, TXT, images.
- Upload UI: filename + progress bar per file.
- After upload: file added to chips above with checkbox checked.
- Files upload directly to Jayant's storage via presigned URL — not through Caspr's servers.

**"Start Research" button:**
- Black background, white text, full width.
- Below: deduction amount and balance-after, in DM Mono.
- On click: Gate 1 confirmed → Learning Brain starts → transition to Source Web.

**Insufficient balance state:**
- "Start Research" button is disabled.
- Shows: "Insufficient balance. Top up to continue." — with a "Top up" link to wallet.

**Mobile (bottom sheet):**
- Pulls up from bottom, 85% height.
- Same content, vertically stacked.
- "Start Research" button stays pinned at bottom of sheet.

---

### 4.5 Source Web (Learning Brain Visualization)

**What this is:** The most distinctive screen in Caspr. While the Learning Brain scours 25M+ sources, the user watches it happen — not a spinner, a live visualization that builds trust in what's coming. This is the bridge between Gate 1 and the Layout Canvas.

**Duration:** Typically 30 seconds to 3 minutes. Never a dead wait.

**Layout (Main Content Area):**

```
  [label-sm uppercase, text-secondary, top of content area]
  LEARNING BRAIN · ACTIVE
  
  ┌──────────────────────────────────────────────────────────────────┐
  │                                                                  │
  │            THE SOURCE WEB                                        │
  │                                                                  │
  │    [Visual area — animated source constellation]                 │
  │                                                                  │
  │    Nodes appear as source categories are activated:             │
  │      • Industry Databases          • Government Data             │
  │      • Company Filings             • Academic Research           │
  │      • News & Analysis             • Market Data Feeds           │
  │      • Regulatory Filings          • Trade Publications         │
  │                                                                  │
  │    Nodes pulse when active. Lines draw between nodes when        │
  │    cross-references are detected.                                │
  │                                                                  │
  │    Notable sources animate in by name below their node:         │
  │      "IMF World Economic Outlook"                                │
  │      "S&P Global Market Intelligence"                            │
  │                                                                  │
  └──────────────────────────────────────────────────────────────────┘
  
  [Counter, DM Mono display-lg, centered, below visualisation]
  4,271 sources reviewed
  
  [body-sm text-secondary centered]
  and counting
```

**Source category nodes:**
- Each category is a circle node. Size indicates volume of sources found.
- Inactive: light grey circle, label in text-tertiary.
- Activating: circle fills to `ink` with a smooth transition. Label becomes text-primary.
- Active: pulses slowly (opacity 0.8 → 1.0, 2-second cycle).
- Completed: solid fill, stops pulsing, check mark appears.

**Connection lines:**
- When `cross_reference_detected` event fires: a line draws between the two category nodes.
- Line style: thin dashed line (`border-strong`), draws with a trace animation.
- Multiple cross-references between the same two nodes: line thickens.

**Notable sources:**
- When `notable_source_found` fires: source name appears below its category node, fades in.
- Font: DM Mono, label-sm.
- Max 3 visible at once per node. Older ones fade out as new ones appear.

**Source counter:**
- Driven by `total_sources_reviewed` SSE events.
- Increments in real time. Fast-counting animation (odometer style).
- `mono-md` weight.

**Caspr Panel during Source Web:**
- Caspr narrates what's happening, in analyst voice:
  - "Reviewing IMF World Economic Outlook projections for the relevant period."
  - "Cross-referencing 3 conflicting estimates for market size — reconciling now."
  - "Found 47 relevant regulatory filings. Prioritising the most recent."
- These appear as text, one at a time, replacing the previous. Not a scrolling feed — a single sentence that updates.
- Below: a small "Notable sources found" count in DM Mono.

**Mobile:**
- Simplified version: no constellation layout.
- Category pills in a wrapping grid, each with an active/inactive state.
- Counter prominently displayed.
- Caspr narration in the main content area (not a separate panel).

**Transition to Layout Canvas:**
- When `layout_ready` SSE event fires, Source Web holds for 0.5 seconds, then the visualization shrinks and moves to the top-right corner as a smaller element, and the Layout Canvas slides up from the bottom.
- Source Web remains visible but compact throughout the Layout Canvas phase — proof that the work was done.

---

### 4.6 Layout Canvas + Clarifying Questions

**This is Aha Moment 1.** The user sees Caspr propose a structured, intelligent report outline for their specific question — not a generic template. The proposed structure signals "this system knows what it's doing."

**Duration:** User spends 1–3 minutes here, reviewing and adjusting. Clarifying questions appear simultaneously.

**Layout:**

```
  [label-sm uppercase, text-secondary]
  YOUR REPORT STRUCTURE

  [display-sm, Instrument Serif]
  Here's how I've structured your analysis.

  [body-sm, text-secondary]
  Reorder sections by dragging. Add or remove as needed.

  [12px space]

  ┌─── Section cards (vertical list, drag-to-reorder) ─────────────┐
  │                                                                 │
  │  ┌─ 01 ──────────────────────────────────────────────────────┐ │
  │  │ Executive Summary                              8 pages  ⠿ │ │
  │  └────────────────────────────────────────────────────────────┘ │
  │                                                                 │
  │  ┌─ 02 ──────────────────────────────────────────────────────┐ │
  │  │ Market Overview & Size                         12 pages ⠿ │ │
  │  └────────────────────────────────────────────────────────────┘ │
  │                                                                 │
  │  ┌─ 03 ──────────────────────────────────────────────────────┐ │
  │  │ Competitive Landscape                          10 pages ⠿ │ │
  │  └────────────────────────────────────────────────────────────┘ │
  │                                                                 │
  │  [+ Add a section]                                             │
  │                                                                 │
  └─────────────────────────────────────────────────────────────────┘

  [Total: 82 pages · Study · $80]

  [Caspr's clarifying questions — displayed inline below the canvas]
  ───────────────────────────────────────────────────────────────────
  
  [label-sm uppercase, text-secondary]
  A FEW QUESTIONS TO SHARPEN THE ANALYSIS

  [Each question is a card]
  ┌──────────────────────────────────────────────────────────────────┐
  │ Are you focusing on the US market specifically, or global?      │
  │                                                                  │
  │ ○ US only   ○ Global   ○ Specific regions (add below)           │
  │                                                                  │
  │ [open text field if "Specific regions" selected]                │
  └──────────────────────────────────────────────────────────────────┘

  [32px space]

  [Proceed button]
  ████████ This looks right — continue ████████
  
  [text link below]  Edit structure first
```

**Section cards:**
- Drag handle (⠿) on the right.
- Section number (01, 02…) in DM Mono, label-sm, text-tertiary.
- Section title in body-md, text-primary.
- Estimated pages in DM Mono, label-sm, text-secondary, right-aligned.
- Hover state: subtle `surface-2` background.
- Active drag: card lifts slightly (thin border, `border-strong`), others shift position.

**Remove section:**
- Hover → × button appears on right.
- Removing a section: card disappears with a smooth height collapse. Page count totals update.

**Add a section:**
- "+" row at bottom of list.
- Click → inline text input opens for section title.
- Enter to confirm. New card added at bottom with estimated pages TBD.

**Total summary:**
- Below the canvas: "Total: [X] pages · [Depth] · [$Y]"
- Updates in real time as sections are added/removed.
- If total pages would push the cost into a higher tier, a warning appears: "This analysis has grown beyond Study scope. Upgrade to Intelligence ($300) or remove sections."

**Clarifying questions:**
- 1–3 questions max (Jayant determines based on what the Learning Brain found).
- Question text in body-md.
- Answer format varies: radio buttons, checkbox, or open text (driven by question type from API).
- These are optional to answer — the "Continue" button is always available. Answered questions produce a better report.
- Important: while the user is on this screen, the analysis is NOT waiting. Generation has not started yet — that requires Gate 2. These questions inform Gate 2 parameters.

**"This looks right" button:**
- Full width, black background, white text.
- On click: proceed to Gate 2. Questions are included in the Gate 2 request.

**"Edit structure first" link:**
- Brings focus to the canvas, highlighting the drag handles.

---

### 4.7 Gate 2 — Style + Language + Template

**What this is:** The second mandatory gate, before the Thinking Brain begins analysis and generation. Defines the report's form and voice. Three inputs: output style, language, and template (Enterprise only). This is a brief stop — not a questionnaire.

**Approach:** This appears as an overlay panel or slide-in from the right on desktop, not a full-screen replacement. The Layout Canvas remains visible behind it as context.

**Layout (slide-in panel, 480px, from right):**

```
  [panel header]
  ← Back to structure   [×]

  [label-sm uppercase, text-secondary]
  BEFORE CASPR WRITES

  [display-sm, Instrument Serif]
  How should this report read?

  [body-sm text-secondary]
  These choices define the final document.

  ───────────────────────────────────────────

  [Section: Style]
  [label-sm uppercase]
  OUTPUT STYLE

  [Style selector — 5 cards in 2-column grid]
  ┌────────────────────┐  ┌────────────────────┐
  │ MBB                │  │ Big Four           │
  │ McKinsey / BCG /   │  │ Deloitte / PWC /   │
  │ Bain structure     │  │ KPMG / EY format   │
  └────────────────────┘  └────────────────────┘
  ┌────────────────────┐  ┌────────────────────┐
  │ Private Equity     │  │ Academic           │
  │ Terse. Numbers     │  │ Formal. Footnoted. │
  │ first. No padding. │  │ Citation-dense.    │
  └────────────────────┘  └────────────────────┘
  ┌────────────────────┐
  │ Custom ✎           │
  │ Describe your      │
  │ preferred style    │
  └────────────────────┘

  [16px space]

  [Section: Language]
  [label-sm uppercase]
  OUTPUT LANGUAGE

  [Dropdown, full width]
  [ English (UK) ▾ ]
  Options: English (US), English (UK), French, German,
           Spanish, Mandarin, Japanese, Arabic, + more

  ───────────────────────────────────────────

  [🔒 Enterprise: shown only if user is on Enterprise plan]
  [Section: Template]
  [label-sm uppercase]
  CUSTOM TEMPLATE

  [ No template — use standard format ▾ ]
  [Dropdown with user's loaded templates]

  ───────────────────────────────────────────

  [48px space]

  ████████ Begin Analysis ████████

  [label-sm text-tertiary centered, below button]
  $80 deducted from research budget. $6.40 remaining.
```

**Style cards:**
- Default selection: MBB (most common ICP).
- Selected: black border, black background, white text.
- Unselected: `surface-1` background, `border` border.
- Descriptors in label-sm, text-secondary.

**Custom style:**
- If selected: textarea expands below the grid, with placeholder "e.g. Terse executive memos, no jargon, heavy use of tables and bullet points."

**Language dropdown:**
- Search-enabled if >10 options.
- Default: based on browser locale or user profile.

**"Begin Analysis" button:**
- Black, full width.
- This commits the Research Budget deduction.
- On click: Gate 2 confirmed → Thinking Brain + generation begins → transition to Generation view.

**Mobile:**
- Bottom sheet, same content, vertically scrollable.

---

### 4.8 Generation — Progressive Report Build

**This is Aha Moment 2** — watching the report appear in real time. Not a loading screen. An experience.

**Duration:** Brief ~15 min, Study ~45 min, Intelligence up to 24 hours (handled differently — see below).

**Layout:**

The main content area transitions to show the report building progressively. The Layout Canvas shrinks and moves to a thin progress indicator at the top.

```
  [Progress strip at top — thin, 32px]
  [Sections as steps: ● ● ● ○ ○ ○ ○ ○ ○ ○ ○ ○]
  [label-sm]  Section 3 of 12 complete · ~8 minutes remaining

  ──────────────────────────────────────────────────────────────

  [Report content below — scrollable]

  [Report Cover — first section]
  ┌────────────────────────────────────────────────────────────┐
  │                                                            │
  │                  [CASPR wordmark small]                    │
  │                                                            │
  │              The Global Logistics Market                   │
  │              Infrastructure Investment Landscape           │
  │              2025 — 2030                                   │
  │                                                            │
  │              Prepared by Caspr                             │
  │              For: Sarah Chen · StratCo Partners            │
  │              23 May 2026                                   │
  │              Study · MBB Style                             │
  │                                                            │
  └────────────────────────────────────────────────────────────┘
  
  [Auto-scroll begins here, 1.5 seconds after cover renders]

  [Executive Summary — placeholder state while generating]
  ┌────────────────────────────────────────────────────────────┐
  │ EXECUTIVE SUMMARY                                          │
  │                                                            │
  │ [skeleton lines — animated shimmer, light grey bars]       │
  │ ████████████████████████████████████                       │
  │ ████████████████████████████                               │
  │ ████████████████████████████████████████                   │
  │                                                            │
  └────────────────────────────────────────────────────────────┘

  [Section 1: Market Overview — streaming in real time]
  ┌────────────────────────────────────────────────────────────┐
  │ MARKET OVERVIEW & SIZE                                     │
  │                                                            │
  │ The global logistics infrastructure investment market      │
  │ reached $847 billion in 2024, representing a 12.3% CAGR   │
  │ from 2019. [cursor blinking — text still streaming]        │
  │                                                            │
  └────────────────────────────────────────────────────────────┘

  [Sections 2–12 shown as locked placeholders below]
  ┌────────────────────────────────────────────────────────────┐
  │ COMPETITIVE LANDSCAPE                              [locked] │
  │ [light skeleton lines]                                     │
  └────────────────────────────────────────────────────────────┘
```

**Progress strip:**
- Dots = sections. Filled dot = complete. Pulsing dot = currently generating. Empty dot = pending.
- Time estimate updates as sections complete (early sections establish an actual pace).
- For Intelligence analyses: "This analysis runs overnight. We'll notify you when it's ready." — see Long-Form handling below.

**Report cover:**
- Appears first, instantly, with the metadata Caspr knows (title, user name, date, depth, style).
- Instrument Serif for the title. Clean. No images.
- After 1.5 seconds, auto-scroll to the Executive Summary section begins.

**Executive Summary:**
- Skeleton/shimmer state while generating.
- When `exec_summary_ready` event fires: skeleton fades out, content fades in.
- Content: key insights (with section hyperlinks) + key questions + infographic thumbnail.

**Active section (streaming):**
- Text streams in at typing speed — character by character or chunk by chunk.
- Blinking cursor at the active point.
- When `section_complete` fires: cursor disappears, section "settles" (slight opacity transition from 0.85 to 1.0).
- If `chart_data` is included: chart renders at the bottom of the section after the text completes.

**Completed sections:**
- Fully visible and readable. User can scroll up and read completed sections while later ones generate.

**Locked/pending sections:**
- Light shimmer skeleton. Not readable. Not clickable.

**Caspr Panel during generation:**
- As each section completes, a brief observation appears in the Caspr Panel:
  - "Section 3 of 12 complete. The competitive dynamics here are more fragmented than typical for this market size — I've flagged this in the analysis."
  - "Reconciling three conflicting market size estimates in Section 4 — sources disagree on the definition of 'logistics infrastructure.' I've presented the range."
- One observation at a time. Previous observations remain visible in a short scroll below the latest one.

**Long-Form Intelligence Handling (up to 24 hours):**
After Gate 2 is confirmed for an Intelligence analysis, the generation view shows for approximately 5 minutes while initial sections stream, then a notification state appears:

```
  [Banner — replaces progress strip]
  ┌────────────────────────────────────────────────────────────┐
  │ ⏱ This Intelligence analysis is running.                  │
  │ We'll email you at sarah@stratco.com when it's ready.     │
  │ You can close this tab.                [Stay on this page] │
  └────────────────────────────────────────────────────────────┘
```

- User can stay (WebSocket keeps updating if they do) or leave (email + in-app notification on completion).
- Analysis continues server-side regardless.

---

### 4.9 Report View (Completed Analysis)

**This is Aha Moment 3.** The completed document. Boardroom-ready. Fully structured. Cited.

**Layout:**

```
  [Topbar — updated]
  Caspr | The Global Logistics Market… | [Share] [Export ▾] [⋯]

  ├── File Drawer ──┤────────── Report Content ─────────┤── Caspr Panel ──┤
                    │                                   │
                    │  [Cover] → auto-scrolled past     │  [Ask Caspr]
                    │                                   │
                    │  EXECUTIVE SUMMARY                │  ┌─────────────┐
                    │  ┌──────────────────────────────┐ │  │ Ask Caspr   │
                    │  │ [Infographic — 1 per report] │ │  │ about this  │
                    │  └──────────────────────────────┘ │  │ report      │
                    │                                   │  └─────────────┘
                    │  Key Insights:                    │
                    │  → The market will reach $1.2T by │  [input field]
                    │    2028 [→ Section 2]             │  "What is the   │
                    │  → 3 players control 40% of the   │  implied CAGR   │
                    │    volume [→ Section 3]           │  for Asia-Pac?" │
                    │  → Regulatory headwinds in EU     │               │
                    │    [→ Section 5]                  │  [Answer:]    │
                    │                                   │  Asia-Pacific │
                    │  Key Questions:                   │  shows an 18% │
                    │  ? Should we review our EU        │  CAGR vs 11%  │
                    │    exposure? [→ Section 5]        │  global avg.  │
                    │                                   │  [Source: JP  │
                    │  ───────────────────────────────  │  Morgan 2025] │
                    │                                   │              │
                    │  01. MARKET OVERVIEW & SIZE       │
                    │  [full section text]              │
                    │                                   │
                    │  [chart if applicable]            │
                    │                                   │
                    │  02. COMPETITIVE LANDSCAPE        │
                    │  [full section text]              │
                    │  ...
```

**Executive Summary:**
- Always first visible section after auto-scroll past cover.
- Infographic thumbnail (from `infographic_url`) — full width of content area.
- Key Insights list: each insight is a hyperlink → clicking scrolls to the cited section.
- Key Questions list: same — linked to sections.
- Instrument Serif for insight/question text. Label in DM Mono for section references.

**Section navigation:**
- Sticky section navigation within the content area (left side of content area, inside the report column):
  ```
  01 Executive Summary  ←●
  02 Market Overview
  03 Competitive Landscape
  04 Regulatory Environment
  ...
  ```
  - Active section highlighted with a red left border.
  - Clicking scrolls to that section.
  - On mobile: section nav is a bottom-anchored pill that opens a full-screen section list.

**Section structure:**
- Section number (DM Mono, label-sm, text-tertiary) + Section title (display-sm, Instrument Serif)
- Body text in body-md, Inter.
- Charts render inline, full width of content column.
- Each section: "Ask Caspr about this section" link at the bottom — on click, the Caspr Panel focuses with the question input pre-scoped to this section.

**Charts:**
- 🔲 Chart rendering library TBD — awaiting Jayant's `chart_data` format (Q8). Placeholder in design: show generic chart shapes.

**Caspr Panel on completed report:**
- Primary content: Ask Caspr input (free-form question, answered with citations).
- Below input: previous questions/answers in this session, scrollable.
- Ask Caspr answers: brief, in analyst voice. Citations shown as source chips below the answer.

**Topbar actions:**
- **Share:** opens sharing modal (see 4.14).
- **Export ▾:** dropdown — "Download PDF" | "Download PPTX" | "Export to Notion" (future).
- **⋯ more:** "Create Version 2" | "Add to folder" | "Rename" | "Delete" | "View version history"

**"What Changed" badge:**
- If the `what_changed` WebSocket event fires for this analysis: a banner appears at the top of the report:
  ```
  ┌───────────────────────────────────────────────────────────────────────┐
  │ 📡 New data available. The logistics market data has shifted since    │
  │ this analysis was created.  [Create Version 2 to update →]           │
  └───────────────────────────────────────────────────────────────────────┘
  ```

**Version history:**
- Accessible from ⋯ menu.
- Side panel showing all versions: V1, V2, V3…
- Each version: date, key changes summary.
- Click to switch to a different version.

---

### 4.10 Ask Caspr

The cited Q&A feature available on every completed analysis. Not a new chat thread — a focused analyst consultation on the report's content.

**Entry points:**
1. Caspr Panel input on the completed report view.
2. "Ask Caspr about this section" link at the bottom of any section.

**When triggered from a section:**
- The Caspr Panel opens/focuses.
- The question input has a pre-scoped context chip: "About: Competitive Landscape ×"
- User types their question, the answer is scoped to that section's underlying data.
- The × on the chip removes section scoping (questions the full report).

**Answer format in the Caspr Panel:**
```
  Q: What is the implied CAGR for Asia-Pacific specifically?
  
  Asia-Pacific is the fastest-growing region at 18.3% CAGR
  (2024–2028), compared to the global average of 11.2%. Growth
  is concentrated in Vietnam, Indonesia, and India.
  
  Sources:
  [McKinsey Global Institute, 2025]  [APEC Trade Facilitation, 2024]
  [World Bank Logistics Performance Index, 2024]
```

- Answer in analyst voice: factual, terse, no hedging.
- Sources appear as chips below the answer. Clicking a source chip shows the source name, publication date, and excerpt.
- Answers are saved for the session and visible in the panel scroll.

---

### 4.11 File Drawer

The user's analysis library and uploaded document storage. The professional workspace metaphor.

**Desktop (240px sidebar):**

```
  [New analysis button — full width, accent red]
  ████████ + New Analysis ████████

  ───────────────────────────────────────────

  ANALYSES
  
  ▾ Global Logistics                    [folder icon]
    The Global Logistics Market… [status: complete]
    EU Port Infrastructure V2   [status: complete]

  ▾ Client: TechCorp                    [folder icon]
    Market Entry Analysis       [status: complete]
    Competitive Scan — EU       [status: in progress ●]

  ▶ Fundraising Research                [folder icon, collapsed]

  [+ New folder]

  ───────────────────────────────────────────

  FILES
  
  Q1 2025 Market Report.pdf    [doc icon]
  Client Brief - TechCorp.docx [doc icon]
  APEC Data Export.xlsx        [doc icon]
  
  [+ Upload file]

  ───────────────────────────────────────────

  [User section at bottom]
  [avatar] Sarah Chen
  [plan badge] Study Plan
  [$86.40 remaining]          [wallet icon →]
  [⚙ Settings]
```

**Analysis cards (in list):**
- Analysis title (truncated to 1 line).
- Status badge: Complete (no badge, just title) | In Progress (pulsing red dot) | Queued (grey dot).
- Click: opens analysis in main content area.
- Right-click or ⋯ hover: contextual menu — Rename / Move to folder / Delete / Version history.

**Folders:**
- Four default types, plus user-created:
  - Client folders (for consulting/agency users)
  - Project folders
  - Topic folders
  - Use case folders
- Collapse/expand with ▶/▾.
- Drag-and-drop analysis into a folder.
- "New folder" creates an untitled folder inline with a text input.

**Files section:**
- Shows documents uploaded to the user's library.
- File icon reflects type (PDF, Word, Excel, CSV…).
- Hover: shows filename in full if truncated.
- Clicking opens a file detail panel: filename, upload date, "Include in next analysis" toggle, delete.
- "Upload file" triggers the upload UI (drag-and-drop sheet).

**Mobile (bottom sheet):**
- "Analyses" and "Files" as tabs at top of sheet.
- Analysis list: full width cards with more detail (title, date, type, status).
- Swipe up to open the full sheet. Bottom of screen shows a handle.

---

### 4.12 User Profile + Context Layer

**User Profile page (`/profile`):**

```
  [Display: Instrument Serif, display-xl]
  Sarah Chen.
  
  [body-md, text-secondary]
  Strategy Director · StratCo Partners · London

  [Avatar, 80px, circular] [Edit profile]

  ────────────────────────────────────────────────────────────

  YOUR RESEARCH PROFILE

  [Caspr's understanding of the user — drawn from Context Layer answers]
  
  ┌──────────────────────────────────────────────────────────┐
  │ You typically research:                                  │
  │ Market entry, competitive landscape, regulatory risk     │
  │                                                          │
  │ Your sectors:                                            │
  │ Logistics, infrastructure, emerging markets              │
  │                                                          │
  │ Your output goes to:                                     │
  │ Partner-level presentations, board decks                 │
  └──────────────────────────────────────────────────────────┘
  
  [Link: "Update your research profile →"]
  
  ────────────────────────────────────────────────────────────

  RECENT ANALYSES
  [3 most recent analysis cards]

  ────────────────────────────────────────────────────────────

  [Research Budget]
  $86.40 remaining
  [Progress bar: 86.40 / 186.00]
  [Plan: Professional — renews 1 June]
  [View wallet →]
  
  ────────────────────────────────────────────────────────────

  CONNECTED ACCOUNTS
  ✓ Google (sarah@stratco.com)
  ✓ LinkedIn (Sarah Chen)
  [+ Connect Microsoft]
```

**Context Layer (`/profile/context`):**

The 20 ICP-specific questions that Caspr asks over time to build a relationship. These are never asked during active analysis — only between analyses, one per session.

> **Delivery updated 2026-07-13** — the Context Layer is now fed by **two locked delivery mechanisms** (full spec: `app-shell-framework.md §16`), in addition to this standalone page:
> 1. **The Generation engagement carousel (§16a)** — tap-based cards (pills/ratings) shown *during report generation*; "read the work" and feedback answers write here. Note this is a refinement of the "never during active analysis" rule: the *casual, profiling* questions still never interrupt — but low-effort, output-relevant taps during the Generation wait are welcome, because their payoff (a better report, now) is visible. Pure profiling still waits for the pause.
> 2. **The returning greeting (§16b)** — a persona-driven, context-specific callback on sign-in ("The logistics acquisition — still live?"), drawn from Context Layer answers + recent work.
>
> The Context Layer store also **pre-selects the Gate's report Style** (`report-style-guide.md §10` ICP profiles) and personalises Compose accelerators and Data Room relevance — the "shown back" loop that makes answering feel worthwhile. Data model unchanged: `context_layer` table in Supabase (`architecture-alignment-final.md §5`), frontend-owned, no backend work beyond the optional `early_signal` event for the carousel's "early finding" card.

This page shows:
- All questions with user's answers (or "Not yet answered").
- Questions already answered are shown with the answer text and can be edited.
- Questions not yet answered are greyed out — they'll be asked at the right moment.

The questions are ICP-tailored:
- Strategy/Consulting ICP: sector focus, typical client types, output style preferences, research triggers, etc.
- Investor ICP: investment stage focus, sector thesis, deal size, geographic mandate, etc.
- Startup ICP: funding stage, industry, fundraising status, primary research needs, etc.

**How questions are asked in-product:**
- At session start (returning user), if context questions remain unanswered, Caspr greets them with one question:
  ```
  Before you dive in — I have a quick question.
  
  "What industries do you most frequently research?"
  
  [Text input or multi-select chips]
  [→ Answer]  [Skip for now]
  ```
- This appears in the Caspr Panel, not the main content area.
- One question maximum per session. Never during an active analysis.
- Never asked to a new user until after their first completed analysis.

---

### 4.13 Wallet + Billing

**Wallet page (`/wallet`):**

```
  [label-sm uppercase text-secondary]
  RESEARCH BUDGET

  [DM Mono display-xl]
  $86.40

  [body-sm text-secondary]
  remaining of $186.00 · Professional Plan
  
  [Progress bar: used portion in accent red, remaining in surface-2]

  [Plan renewal info]
  Recharges to $186.00 on 1 June 2026.
  $99.60 used this period.

  ────────────────────────────────────────────────────────────

  TRANSACTION HISTORY

  [Table]
  Date          Analysis                        Deducted
  23 May 2026   Global Logistics Market          $80.00  (Study)
  19 May 2026   TechCorp Competitive Scan        $15.00  (Brief)
  15 May 2026   EU Regulatory Landscape          $80.00  (Study)
  01 May 2026   Plan renewal — Professional    +$186.00

  ────────────────────────────────────────────────────────────

  YOUR PLAN

  ┌─ Professional ────────────────────────────────────────────┐
  │ $200 / month · $186 research budget                       │
  │ Brief ($15) · Study ($80) · Intelligence ($300 in-budget) │
  │ Unused balance carries forward automatically              │
  │                                [Manage subscription →]   │
  └───────────────────────────────────────────────────────────┘

  [Compare all plans →]  [Upgrade to Business →]
```

**Billing / Upgrade (`/billing`):**
- Stripe-powered.
- Plan comparison table (Free Trial | Professional | Business | Enterprise).
- Upgrade flow: click plan → Stripe checkout embedded in Caspr UI.
- Current plan highlighted.

---

### 4.14 Sharing + Collaboration

**Share modal (triggered from topbar Share button):**

```
  ┌─ Share this analysis ──────────────────────────────────────────┐
  │                                                                │
  │  The Global Logistics Market Analysis                         │
  │                                                               │
  │  [label-sm uppercase text-secondary]                          │
  │  INVITE BY EMAIL                                              │
  │                                                               │
  │  [email input, full width]                                    │
  │  sarah.jones@example.com                                      │
  │                                                               │
  │  Access level:                                                │
  │  ○ View only    ● View + Annotate    ○ View + Edit sections   │
  │                                                               │
  │  [Send invite]                                                │
  │                                                               │
  │  ────────────────────────────────────────────────────────    │
  │                                                               │
  │  [label-sm uppercase text-secondary]                          │
  │  LINK                                                         │
  │                                                               │
  │  ⚠ Anyone with this link must sign in to Caspr to view.      │
  │                                                               │
  │  [url field with copy button]                                 │
  │  caspr.ai/analyses/a8f2k9...    [Copy link]                  │
  │                                                               │
  │  ────────────────────────────────────────────────────────    │
  │                                                               │
  │  [label-sm uppercase text-secondary]                          │
  │  PEOPLE WITH ACCESS                                           │
  │                                                               │
  │  [avatar] Sarah Chen (you)                   Owner           │
  │  [avatar] James Park                   View + Annotate  [×]  │
  │                                                               │
  │  [×] closes modal                                             │
  └───────────────────────────────────────────────────────────────┘
```

**Security note visible in the share modal:** "Recipients must create a Caspr account to access this report. They will not see your uploaded source files."

**Collaborator view:**
- Same report view layout as owner.
- Cannot access the file drawer (their own file drawer, not the owner's).
- Cannot see owner's uploaded files — ever.
- Annotation-level access: can add inline comments.
- Edit-level access: can modify section text (tracked — versions created).
- Revoke access: instantly removes their session on next API request.

**Annotations:**
- Available in "View + Annotate" and above.
- Select text in any section → annotation button appears → text input → save.
- Annotations appear as margin indicators (small red dots in the margin). Hover/click to read.
- Owner and collaborators with annotation access can see and reply to all annotations.

---

### 4.15 Onboarding

**Philosophy:** Get the user to Aha Moment 1 as fast as possible. No lengthy surveys. One decision: what kind of user are you?

**Screen 1 — Welcome (immediately after sign up):**

```
  [Instrument Serif display-xl, centered]
  Welcome to Caspr.

  [body-md text-secondary centered]
  Before you start — what best describes how you'll use it?

  [ICP selector — 4 cards per row, 2 rows]
  ┌───────────────────┐  ┌───────────────────┐
  │ Consulting &      │  │ Strategy &        │
  │ Advisory          │  │ Corporate         │
  └───────────────────┘  └───────────────────┘
  ┌───────────────────┐  ┌───────────────────┐
  │ Investment &      │  │ Marketing &       │
  │ Finance           │  │ Agency            │
  └───────────────────┘  └───────────────────┘
  ┌───────────────────┐  ┌───────────────────┐
  │ Startups &        │  │ Academic          │
  │ Entrepreneurs     │  │ Research          │
  └───────────────────┘  └───────────────────┘
  ┌───────────────────┐
  │ Other             │
  └───────────────────┘

  [Continue →]  (enabled after selection)
```

**Screen 2 — Free trial reminder:**

```
  [Instrument Serif display-xl centered]
  $100 to start.

  [body-md text-secondary centered]
  Your research budget is loaded. No credit card required.
  Run your first analysis and see what Caspr does.

  [bullet points, body-md]
  ✓  15 minutes to a 100-page briefing
  ✓  Every insight cited to source
  ✓  Download as PDF or PPTX

  [Button: black, full width, max 400px]
  ████████ Start your first analysis ████████
```

That's it. Two screens. No tutorial, no feature tour, no configuration. The product teaches itself through the first analysis.

**Note:** If LinkedIn OAuth was used to sign up, Caspr pre-fills the ICP from LinkedIn job title. If it can determine ICP with high confidence, it skips Screen 1 entirely with a confirmation: "We've set you up as a Strategy & Corporate user based on your LinkedIn profile. That's right?" with a change link.

---

## 5. Component Inventory

All components to design in Figma. Listed with their variants.

| Component | Key Variants |
|---|---|
| **Button** | Primary (black) / Secondary (outline) / Tertiary (text link) / Destructive (red) / Disabled — sizes: lg, md, sm |
| **Input** | Default / Focus / Error / Disabled — with label, with placeholder, with icon prefix |
| **Textarea** | Same variants as Input |
| **Depth selector** | Unselected / Selected — Brief / Study / Intelligence |
| **ICP selector card** | Unselected / Selected / Hover |
| **Style selector card** | Unselected / Selected — 5 styles |
| **Analysis card** (file drawer) | Complete / In Progress / Queued / Hover / Active |
| **File chip** (Gate 1) | Checked / Unchecked / Upload in progress |
| **Section card** (Layout Canvas) | Default / Hover / Dragging |
| **Source node** (Source Web) | Inactive / Activating / Active / Complete |
| **Source counter** | Default (DM Mono, large) |
| **Progress strip** | With dots for all section states |
| **Skeleton** / shimmer | Single line / Block / Section |
| **Report section** | With chart / Without chart |
| **Insight chip** (exec summary) | Hyperlinked insight |
| **Source citation chip** | Default / Hover (shows excerpt) |
| **Annotation indicator** | Margin dot / Expanded comment |
| **Badge** | Plan tier (Free / Pro / Business / Enterprise) / Status (Complete / In Progress) |
| **Research Budget pill** | Topbar variant (DM Mono, compact) |
| **Avatar** | With image / Initials fallback — sizes: sm, md, lg |
| **Bottom sheet** | With handle / With tabs |
| **Modal** | Default / Wide |
| **Dropdown** | Default / With search |
| **Tag / pill** | Default / Removable / Selectable |
| **Notification banner** | Info / Warning / Success / Caspr update |
| **Empty state** | Default (with illustration) |
| **Toast** | Success / Error / Info |

---

## 6. Interaction Patterns

### Animation Principles

- No decorative animation. All motion communicates state.
- Duration: 150ms for micro-interactions (hover, click), 250ms for state transitions (panel slide), 400ms for page-level transitions.
- Easing: `ease-out` for entrances, `ease-in` for exits. Never `linear` for UI elements.

### Key Interactions

**Source Web → Layout Canvas transition:**
- Source Web visualization shrinks to a compact "badge" in the top-right of the main content area.
- Layout Canvas slides up from the bottom with a smooth translate + fade (250ms).
- The compact source badge remains visible throughout the Layout Canvas phase as proof of work.

**Section card dragging (Layout Canvas):**
- Mouse down: card lifts slightly (scale 1.02, thin shadow border).
- Dragging: other cards shift position with smooth transitions.
- Drop: card settles into new position.

**Report streaming:**
- Text appears character by character (simulated typewriter, 2–3ms per character for smooth reading pace).
- Long chunks may stream at word level rather than character level.
- Cursor: a single blinking pipe character (`|`) in accent red.

**Section completion:**
- On `section_complete`: skeleton fades out and reveals text with a fade-in (200ms). The section dot in the progress strip fills.

**Auto-scroll (cover to executive summary):**
- 1.5 seconds after the report cover renders, a smooth eased scroll begins.
- Duration: 800ms for the scroll itself.
- If user has already started scrolling, the auto-scroll is cancelled.

**Ask Caspr:**
- On submit: question slides up into the conversation history. Answer appears below with a streaming typewriter effect (faster than report generation — ~10ms per character). Source chips appear after the full answer renders.

**File drawer (desktop):**
- Collapse: smooth width transition from 240px to 48px (200ms). Icon rail visible in collapsed state.
- Expand: same transition in reverse.

**Bottom sheet (mobile):**
- Pull-up: spring physics (CSS spring or Framer Motion spring). Handle visible.
- Dismiss: swipe down to 30% of height triggers dismiss. Otherwise snaps back.

---

## 7. Open Items

Items awaiting Jayant's responses. Design can proceed. Implementation will be updated when answers arrive.

| # | Question | Design impact |
|---|---|---|
| Q1 | Do existing 1,500 users need to be migrated to Clerk? | Affects onboarding flow — design for both paths. Design the "migrated user first login" screen as a variant. |
| Q5 | Does `POST /analyses` work as a single trigger? | If not, Gate 1 flow may need to split into two steps. Design the single-trigger version; mark as TBD if multi-step. |
| Q6 | Is `layout_ready` event emitted mid-stream by Learning Brain? | If not, Source Web → Layout Canvas transition will differ. Design assumes yes. |
| Q8 | What format is `chart_data`? | Chart component design deferred. All other sections can be designed fully. Use placeholder chart block in designs. |
| Q11 | Is model serving layer on private VPC? | No design impact. |
| Q12 | Is rate limiting in place? | May affect analysis queue UX. If capacity is limited (see Q16), design a "You're in the queue" screen as a variant. |
| Q13 | File encryption: Phase 1 or Phase 2? | No design impact. |
| Q16 | Max concurrent analyses on current EKS? | If limited, add a queue state screen (analysis accepted but queued, with estimated start time). Design as a variant. |

**Designs to prepare as variants (even before Jayant answers):**
1. "Migrated user" onboarding (existing caspr.ai user, first login on new platform)
2. "Analysis queued" state (if concurrent analysis capacity is limited at launch)
3. Chart block placeholder (will be replaced once `chart_data` format is known)

---

## Next Steps

1. **Design the primary flows first** (Journey 1, screens 4.3 → 4.9) in Figma
2. **Design system components** (Section 5) as a shared component library
3. **Design secondary flows** (profile, wallet, sharing, onboarding)
4. **Mark variant screens** (queue state, migrated user) as `[VARIANT — awaiting Jayant Q16/Q1]`
5. **Update chart components** once Q8 is answered

---

*Document: product-design-spec-draft.md*  
*Owner: Joy Sharma*  
*Version: 1.0 — 2026-05-23*  
*Status: Draft — awaiting 8 Jayant responses (see Open Items)*
