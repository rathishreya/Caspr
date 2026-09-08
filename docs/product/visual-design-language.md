# Caspr App — Visual Design Language

> ⚠️ **Superseded for shell & navigation** (Part VII three-column layout, file-drawer "icon rail"). Use `app-shell-framework.md` + the built rail `626:76` + `navigation-flow-map.md` + `DEV-HANDOVER.md` for shell/nav. This doc remains valid for **tokens, typography, colour, the five registers, and report/editorial styling** — that's why it's still referenced.

**Version:** 1.0  
**Date:** 2026-05-23  
**Owner:** Joy Sharma  
**Scope:** Product application (caspr-app) — distinct from marketing website (caspr-web) and PDF reports  
**For:** Figma design and frontend implementation

---

## The Central Insight

**The website is a pitch. The tool is a place.**

A pitch must be dramatic, assertive, and memorable in seconds. A place must be functional, comfortable, and liveable across hours. The brand is the same. The mode is completely different.

The website hero says *"15 minutes. 100 pages. Cited to source."* in 72px Instrument Serif against a near-black background. That is a conversion moment — seven words that stop a stranger.

The tool greeting says *"Good morning, Sarah. What are you working on today?"* That is a relationship moment — the senior analyst who knows your name and is already at their desk. Same brand. Same typeface. A quarter of the size. Completely different register.

Everything in this document follows from that distinction.

---

## Design Principles

These five principles govern every decision. When two design choices conflict, apply the relevant principle.

### 1. The Analysis is the Product
The report is not something the tool produces. The report **is** the tool. Every UI decision asks: does this help the user get to the report, or does this serve the report as a reading experience? Chrome that competes with report content for attention fails the primary principle.

### 2. Modes, Not Screens
The tool has five distinct visual modes (Instrumental, Invitation, Gateway, Theater, Editorial). Design decisions correct for one mode are often wrong for another. A 72px headline is right for the marketing site — wrong inside the tool. A 16px Inter body is right for the report viewer — wrong for the system topbar. Identify the mode before choosing the treatment.

### 3. Restraint Earns Trust
The ICPs who use this product — PE analysts, strategy directors, consulting associates — judge tools by their visual register before they read a word. An application that looks like a consumer SaaS product loses credibility with these users immediately. Premium = restraint. Fewer colors. No gradients. No shadows. No rounding on document surfaces. The white space in a consulting deliverable is not emptiness — it is structure.

### 4. The Red Dot Is a Signal
Red appears in twelve precisely defined locations in this system and nowhere else. Its value depends entirely on its rarity. A red element means: this is the action, this is the conclusion, this is what matters. When red appears everywhere, it means nothing.

### 5. The Machine Does the Work
Between Gate 1 and the completed report, Caspr is working. That work must be **visible, impressive, and comprehensible** — not hidden behind a spinner. The Source Web and generation streaming are not loading screens. They are the core product experience. They carry their own visual system.

---

## Part I: The Token System

### Relationship to the Website

The tool inherits the website's token system (`caspr-web/app/globals.css`) and extends it. Do not redefine tokens that already exist — reference them. The deltas are documented below.

#### Inherited tokens (unchanged)

```css
/* Fonts */
/* wordmark is NOT a font - outlined SVG asset: assets/logo/caspr-logo.svg */
--font-display:  'Instrument Serif', Georgia, serif;   /* headings, greetings */
--font-text:     'Inter', system-ui, sans-serif;       /* all UI, body, labels */
--font-mono:     'DM Mono', 'Courier New', monospace;  /* numbers, data, counters */

/* Accent */
--accent:           #E8453C;
--accent-hover:     #D13B33;
--accent-pressed:   #BE3530;
--accent-subtle:    #FEF1F0;

/* Surface tokens (light mode) */
--surface-0:    #FFFFFF;
--surface-1:    #F6F5F3;
--surface-2:    #EDECE9;
--border:       #E2E1DE;
--border-strong:#C8C7C4;

/* Text tokens */
--text-primary:   #0A0A0A;
--text-secondary: #5C5B58;
--text-tertiary:  #9C9B98;

/* Dark mode section overrides (website uses data-theme="dark" per-section) */
/* In the tool, dark mode is applied globally via prefers-color-scheme */
```

#### New tokens — app-only

```css
/* ── App Canvas ─────────────────────────────────────────── */
/* The 'desk surface' behind all panels. Slightly darker than surface-1.
   This creates depth without a strong colour. Website uses surface-0 (white)
   as the page background — the tool uses canvas as the shell background,
   making documents on surface-0 float visually. */
--canvas:       #ECEAE6;

/* ── Document surface ───────────────────────────────────── */
/* The 'paper' — the report, the main content area.
   Always white in light mode. Never changes even in dark mode.
   Documents are documents; they do not invert. */
--document:     #FFFFFF;

/* ── Report-system colours (mirrored from report-style-guide.md) ─── */
/* Used in the report viewer to match the PDF output exactly.          */
--report-black:      #0B0B09;
--report-grey-dark:  #1A1A18;
--report-grey-mid:   #6B6B66;
--report-grey-light: #F2F1EF;
--report-rule:       #D6D4CF;

/* ── Source Web (always dark, mode-independent) ──────────── */
--source-bg:         #0A0908;    /* deeper than app dark mode */
--source-node-idle:  #2A2926;    /* inactive node fill */
--source-node-text:  #6B6B66;    /* inactive label */
--source-line:       #3A3835;    /* cross-reference line */

/* ── Functional states ─────────────────────────────────── */
--success:        #1A7A4A;
--success-subtle: #EAF7EE;
--warning:        #7A5000;
--warning-subtle: #FEF5E7;
--error:          #B91C1C;
--error-subtle:   #FEE2E2;

/* ── Motion — tool-specific additions ───────────────────── */
--duration-type:    12ms;     /* character-by-character streaming */
--duration-settle:  280ms;    /* section completion */
--duration-node:    400ms;    /* source node activation */
--duration-scroll:  800ms;    /* auto-scroll (cover → exec summary) */
--easing-settle:    cubic-bezier(0.0, 0.0, 0.2, 1.0);
```

#### Dark mode — global (tool)

The website uses `data-theme="dark"` per-section. The tool uses system-level dark mode, applied to the `<html>` element.

```css
@media (prefers-color-scheme: dark) {
  :root {
    --canvas:       #0A0908;
    --surface-0:    #0D0C09;   /* deepened from website's #0C0B09 */
    --surface-1:    #161512;
    --surface-2:    #211F1C;
    --border:       #2E2C28;
    --border-strong:#403E39;
    --text-primary: #F5F4F0;
    --text-secondary:#9C9A94;
    --text-tertiary: #5C5A55;
    
    /* Document surface — UNCHANGED. The paper stays white. */
    --document:     #FFFFFF;
    
    /* Accent — unchanged */
    --accent:        #E8453C;
    --accent-hover:  #F05048;
  }
}
```

**Critical note on dark mode documents:** When the report viewer is in dark mode, the shell (topbar, drawers, panels) goes dark. The document content area (`--document: #FFFFFF`) does not. This is intentional. Reports are published documents — they have a fixed appearance, like a PDF viewed in a dark-mode PDF reader. The white document on a dark background creates the correct visual metaphor: *a lit page on a dark desk.*

---

### Elevation System

No drop shadows. Depth is communicated through background value and border contrast only.

| Level | Token | Value (light) | Value (dark) | Used for |
|---|---|---|---|---|
| 0 — Canvas | `--canvas` | `#ECEAE6` | `#0A0908` | App shell background |
| 1 — Panel | `--surface-2` | `#EDECE9` | `#211F1C` | File drawer, Caspr panel |
| 2 — Surface | `--surface-1` | `#F6F5F3` | `#161512` | Panel headers, inactive areas |
| 3 — Document | `--document` | `#FFFFFF` | `#FFFFFF` | Report content, main area, gates |
| 4 — Elevated | `--surface-0` + `--border` | `#FFFFFF` + border | `#0D0C09` + border | Modals, dropdowns, tooltips |

Progression from canvas to document: each level is one step lighter (in light mode) or darker (in dark mode). A component at level N should always be visually distinguishable from a component at level N±1.

---

### Border Radius

| Component | Radius | Rationale |
|---|---|---|
| Document surfaces (report content area, gates main canvas) | 0px | These are pages, not cards |
| Panels (file drawer, Caspr panel) | 0px | Structural, not decorative |
| Cards (analysis cards, section cards) | 4px | Subtle — consistent with website step cards |
| Buttons | 4px | Consistent with website |
| Tags, badges, pills | 4px | Consistent |
| Bottom sheet (mobile) | 12px top corners | Matches system sheet convention |
| Modals | 8px | Slightly larger — floating above content |
| Source Web nodes | 50% | They are literal circles |
| Avatar | 50% | Circular |
| Tooltip | 4px | Compact |

**Rule:** The rounder the element, the more it reads as UI chrome. Document surfaces have no radius because they are documents, not UI elements.

---

## Part II: Typography System

### The Website's Pattern (Reference)

The website establishes the family hierarchy:
- **Instrument Serif** — display, headlines, category claims
- **Inter** — body, UI, labels
- **DM Mono** — numbers, data, metrics
- **The wordmark is not a typeface** — it is the outlined vector at `assets/logo/` (Instrument Serif paths, synthetic bold baked in, geometric red circle). Place the asset; never set it as text.

The website's typographic scale:
- Hero: 64–72px Instrument Serif
- Section headers: 36–44px Instrument Serif
- Body: 16–17px Inter
- Labels/overlines: 11–13px Inter

### The Tool's Five Typographic Registers

The tool cannot use a single type scale. Each of the five modes has its own typographic register. They share the same font families — the scale differs.

---

#### Register 1: Instrumental (UI Chrome)
*File drawer, topbar, navigation, settings, forms, panels*

The UI that frames the work. Must be present but invisible — the user's attention should never be on the chrome.

| Style | Font | Weight | Size | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|---|
| `ui-label-lg` | Inter | 500 | 14px | 20px | 0 | Button text, primary labels |
| `ui-label-md` | Inter | 500 | 13px | 18px | 0 | Nav items, section labels |
| `ui-label-sm` | Inter | 500 | 12px | 16px | 0.2px | Tags, badges, overlines (ALL CAPS) |
| `ui-body` | Inter | 400 | 14px | 20px | 0 | Dropdown items, descriptions |
| `ui-meta` | DM Mono | 400 | 12px | 16px | 0 | Dates, prices, counts, file sizes |
| `ui-meta-sm` | DM Mono | 400 | 11px | 14px | 0 | Compact metadata, status |
| `ui-overline` | Inter | 600 | 11px | 14px | 1.5px | Section labels in ALL CAPS, above headings |

**Color:** Primary labels in `--text-primary`. Supporting labels in `--text-secondary`. Metadata in `--text-tertiary`.

**What does NOT appear here:** Instrument Serif. No display type in the chrome. If Instrument Serif appears in the file drawer, it's wrong.

---

#### Register 2: Invitation (Greeting, Onboarding, Empty States)
*The greeting screen, empty analysis state, onboarding*

The user has just arrived or has nothing open. Caspr speaks first. The register is senior analyst, warm morning meeting — not a marketing headline, not a help message.

| Style | Font | Weight | Size | Line Height | Use |
|---|---|---|---|---|
| `invite-headline` | Instrument Serif | 400 | 32–36px | 40–44px | The greeting: "Good morning, Sarah." |
| `invite-subhead` | Inter | 400 | 17px | 28px | The invitation: "What are you working on today?" |
| `invite-prompt-input` | Inter | 400 | 16px | 24px | The analysis prompt input field |
| `invite-prompt-placeholder` | Inter | 400 | 16px | 24px | "A market, a company, a decision." |
| `invite-label` | Inter | 500 | 13px | 18px | Depth selector labels, file attachment |
| `invite-price` | DM Mono | 400 | 12px | 16px | "$15 · $80 · $300" below depth selector |

**Scale rationale:** The website's hero is 72px — Caspr introducing itself to a stranger. The greeting is 32px — Caspr welcoming someone it already knows. The scale drop is intentional and carries meaning.

**Color:** `--text-primary` for the greeting line. `--text-secondary` for the invitation subtext. `--text-tertiary` for placeholder and pricing.

---

#### Register 3: Gateway (Gate 1, Gate 2)
*The two mandatory gates before Learning Brain and Thinking Brain*

The user is making consequential decisions: depth (which determines cost and rigour), files (which determines context), style (which determines output form). This register is precise and professional — like filling in a well-designed briefing form.

| Style | Font | Weight | Size | Line Height | Use |
|---|---|---|---|---|
| `gate-overline` | Inter | 600 | 11px | 14px | "BEFORE WE START" in ALL CAPS, letter-spacing 1.5px |
| `gate-headline` | Instrument Serif | 400 | 22px | 30px | "Confirm your analysis parameters." |
| `gate-label` | Inter | 600 | 11px | 14px | Field section labels: "DEPTH", "FILES", "STYLE" in ALL CAPS |
| `gate-option-title` | Inter | 500 | 15px | 22px | Depth option title: "Study" |
| `gate-option-desc` | Inter | 400 | 13px | 18px | "60–80 pages · ~45 minutes" |
| `gate-option-price` | DM Mono | 500 | 14px | 20px | "$80" |
| `gate-note` | Inter | 400 | 13px | 18px | "Files inform Caspr's analysis..." |
| `gate-commit` | Inter | 500 | 14px | 20px | Button: "Start Research" |
| `gate-commit-meta` | DM Mono | 400 | 12px | 16px | "$80 deducted · $6.40 remaining" |

**Color:** Overlines in `--text-tertiary`. Field labels in `--text-tertiary`. Option titles in `--text-primary`. Descriptions in `--text-secondary`. Prices in `--text-primary` (they matter). Commit meta in `--text-tertiary`.

---

#### Register 4: Theater (Source Web, Generation Streaming)
*The analysis in progress*

The machine is at work and the user is watching. This is the signature Caspr moment. The typography communicates data being processed in real time — not a loading screen.

| Style | Font | Weight | Size | Line Height | Use |
|---|---|---|---|---|
| `theater-phase` | Instrument Serif | 400 | 20px | 28px | "Learning Brain · Active" — phase label |
| `theater-counter` | DM Mono | 400 | 48px | 52px | "4,271" — the main source counter |
| `theater-counter-label` | Inter | 400 | 13px | 18px | "sources reviewed" |
| `theater-category` | DM Mono | 400 | 12px | 16px | Category node labels: "Government Data" |
| `theater-notable` | DM Mono | 400 | 11px | 14px | Notable source names fading in/out |
| `theater-narration` | Inter | 400 | 14px | 22px | Caspr panel narration during Learning Brain |
| `theater-progress` | DM Mono | 400 | 12px | 16px | "Section 3 of 12 · ~8 minutes remaining" |
| `theater-stream` | Inter | 400 | 16px | 26px | Report text as it streams in |
| `theater-cursor` | — | — | — | — | Blinking `|` in `--accent`, never styled as text |

**Source Web colors:** All Source Web typography is on a dark background (`--source-bg`). Phase label: white (`#F5F4F0`). Counter: white. Category labels: start at `--source-node-text` (#6B6B66), transition to `rgba(245,244,240,0.85)` when active. Notable sources: `rgba(245,244,240,0.55)`, fading in/out.

**Counter size rationale:** 48px DM Mono for the source count is deliberate. This is the number that communicates Caspr's work. A user watching the count climb from 0 to 4,271 in real time understands, viscerally, what's happening. The size gives it the weight of a Bloomberg terminal display.

---

#### Register 5: Editorial (Report View)
*Reading the completed analysis*

This is the most important typographic register. The user is reading a 100-page document that Caspr has produced on their behalf. The typography must honor that document as a publication.

The report viewer uses a different type scale than any other part of the tool — it mirrors the PDF report's hierarchy but optimized for screen reading (larger sizes, more generous leading).

| Style | Font | Weight | Size | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `report-title` | Instrument Serif | 400 | 36–44px | 44–52px | -0.5px | Report cover title |
| `report-section-opener` | Instrument Serif | 400 | 28–32px | 36–40px | -0.3px | Section opening page heading |
| `report-section-header` | Inter | 600 | 18px | 26px | -0.2px | Section header (finding statement) |
| `report-subheader` | Inter | 600 | 14px | 20px | 0 | Subsection header |
| `report-lead` | Inter | 500 | 17px | 28px | 0 | Lead sentence (first sentence of each section) |
| `report-body` | Inter | 400 | 16px | 28px | 0 | Body text |
| `report-callout-num` | Instrument Serif | 400 | 48–64px | 1.0 | -1px | Callout statistic number |
| `report-callout-label` | Inter | 400 | 13px | 20px | 0 | Callout statistic label |
| `report-table-header` | Inter | 600 | 11px | 16px | 0.4px | Table column headers (ALL CAPS) |
| `report-table-body` | Inter | 400 | 13px | 18px | 0 | Table cell content |
| `report-source` | DM Mono | 400 | 11px | 16px | 0 | Source citations below tables/charts |
| `report-footnote` | Inter | 400 italic | 12px | 18px | 0 | Footnotes, source references |
| `report-section-num` | DM Mono | 400 | 12px | 16px | 0 | "01", "02"… in section nav |

**Color:** `--report-black` (`#0B0B09`) for all primary report text — not `--text-primary`. The report viewer matches the PDF color system exactly. Secondary text (`--report-grey-mid`) for source lines and captions. Accent red (`--accent`) for section numbers and callout statistics — same as the PDF.

**Why the screen version uses larger type than the PDF:** The PDF is measured in points (10-11pt body = 13-15px at 96dpi). Screen reading benefits from 16px body to account for variable viewing distance, ambient light, and sustained reading sessions. The hierarchy relationships are preserved; the absolute sizes scale up.

**Why callout numbers use Instrument Serif (not Inter like the PDF):** On screen, Instrument Serif at 48-64px for a key statistic ("78%", "USD 2.67/kg") creates a signature editorial moment that DM Mono or Inter cannot match at this size. The PDF uses Inter because Puppeteer/print rendering benefits from a single-family document. The screen experience can be more expressive.

---

## Part III: The Five Modes

Every screen in the tool belongs to one (or a transitional blend) of these five modes.

---

### Mode 1: Instrumental

**What it is:** All UI chrome — the topbar, file drawer, Caspr panel, settings, wallet, navigation.

**Visual tone:** Functional. Subordinate. Invisible when working correctly.

**Layout principles:**
- Topbar: 52px height. White background, 1px bottom border (`--border`). No shadow.
- File drawer: 240px wide on desktop. `--surface-2` (`#EDECE9`) background. 1px right border.
- Caspr panel: 320px wide. `--surface-1` background. 1px left border.
- On collapse: file drawer → 48px icon rail. Caspr panel → off-screen, accessible via toggle.

**Component treatments:**
- Navigation links: Inter 13px, `--text-secondary`. Active: `--text-primary` + thin left accent bar in `--accent`.
- Icon buttons: 32×32px touch target, 20px icon. Default: `--text-tertiary`. Hover: `--text-primary`. Active: `--text-primary`.
- Dividers within panels: 1px `--border`. Never labeled dividers.
- Section headers within panels: `ui-overline` style in `--text-tertiary`, 8px padding above.

**Colors:** Canvas background behind all panels is `--canvas` (`#ECEAE6`). This makes panels feel like they float on a surface, not like they ARE the surface.

**Animations:** 150ms, `var(--ease-standard)`. Panel collapse/expand: 200ms width transition.

**What NOT to do in Instrumental mode:**
- No Instrument Serif
- No large numbers or callout stats
- No photography or imagery
- No gradients
- No color fills (beyond surface tokens)
- Red appears ONLY as the active state indicator for the current analysis item in the file drawer and the current section in the report navigation

---

### Mode 2: Invitation

**What it is:** The empty state / greeting screen. What the user sees when no analysis is open.

**Visual tone:** Warm. Confident. Professional. Like walking into a corner office where the analyst has already made tea.

**Layout — desktop:**
```
┌──────────────────────────────────────────────────────────────────┐
│                    (topbar above, minimal)                       │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│                                                                  │
│   [72px vertical space from topbar]                             │
│                                                                  │
│   Good morning, Sarah.               [Instrument Serif, 34px]   │
│                                                                  │
│   What are you working on today?     [Inter 17px, secondary]    │
│                                                                  │
│   [72px space]                                                   │
│                                                                  │
│   ┌────────────────────────────────────────────────────────┐    │
│   │  A market, a company, a decision.                      │    │
│   │  Start anywhere.                                       │    │
│   └────────────────────────────────────────────────────────┘    │
│                                                                  │
│   Depth:  [Brief]  [Study ●]  [Intelligence]                    │
│   $15 · $80 · $300                                              │
│   📎 Add files                                                   │
│                                                                  │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

**Surface:** The main content area is `--document` (`#FFFFFF`). No canvas color here — this is the invitation into the document space.

**The greeting typography:**
- "Good morning, Sarah." — `invite-headline` (Instrument Serif 34px, `--text-primary`)
- "What are you working on today?" — `invite-subhead` (Inter 17px, `--text-secondary`)
- Note: **never use "What would you like to research?"** or any task-framing language. The greeting is relational.

**The prompt input:**
- Full width up to 640px, centered in the main content area
- 1px border (`--border-strong` on focus, `--border` default)
- 16px padding all sides
- No rounded corners — 4px maximum, or 0px for emphasis
- Multi-line allowed (Enter = submit with depth selected, Shift+Enter = newline)
- Character limit: none visible

**The depth selector:**
- Three pills inline: `[Brief]` `[Study ●]` `[Intelligence]`
- Unselected: `--surface-1` background, `--border` border, `--text-secondary` text
- Selected: `--text-primary` background, white text (ink chip)
- No animation on selection — immediate
- Below each pill: Inter 13px, `--text-tertiary`, price

**Files link:** `📎 Add files` — Inter 14px Medium, `--text-secondary`. Clicking expands the Gate 1 file section inline without leaving this screen.

**Returning user variation:** On the right panel (Caspr panel), if the user has existing analyses, the panel shows a compact list: 3 most recent analyses. Each one is `ui-label-md` title + `ui-meta` date. No other context. The greeting does not reference their previous work in the main canvas — that's for the file drawer.

---

### Mode 3: Gateway

**What it is:** Gate 1 (depth + files) and Gate 2 (style + language + template). The two mandatory configuration steps before each brain engages.

**Visual tone:** Purposeful and precise. A professional briefing form, not a wizard. Not a chat.

**Gate 1 layout:**

```
BEFORE WE START                              [ui-overline, tertiary]

Confirm your analysis parameters.           [gate-headline, 22px Instrument Serif]

──────────────────────────────────────────────────────────────────

DEPTH                                        [gate-label, ALL CAPS]

┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ Brief           │ │ Study       ●   │ │ Intelligence    │
│ ~20 pages       │ │ ~70 pages       │ │ 100+ pages      │
│ 15 minutes      │ │ ~45 minutes     │ │ Up to 24 hrs    │
│ $15             │ │ $80             │ │ $300            │
└─────────────────┘ └─────────────────┘ └─────────────────┘

──────────────────────────────────────────────────────────────────

FILES                                        [gate-label, ALL CAPS]

Files inform Caspr's analysis — uploaded documents,    [gate-note]
client briefs, data exports, or background reading.

  ☑  Q1 2025 Market Report.pdf
  ☑  Client Brief — TechCorp.docx
  + Upload new file  ·  Drag files here

──────────────────────────────────────────────────────────────────

          ████████ Start Research ████████           [full width btn]

    $80 deducted from your research budget. $6.40 remaining.
```

**Depth option cards:**
- Unselected: `--surface-0` background, `--border` border, 1px
- Selected: `--text-primary` background, white text — the selected card is a filled black block
- Selected accent: a thin `--accent` line along the left edge of the selected card (2px)
- **No gradient, no shadow** on any state
- 4px border radius

**Gate 2 layout (slide-in panel from right, 480px):**
- Style selector uses same card treatment as depth cards
- Language: Inter dropdown, full width
- Template: only visible on Enterprise plan — hidden otherwise
- "Begin Analysis" button triggers the Thinking Brain

---

### Mode 4: Theater

**What it is:** Source Web (Learning Brain visualization) and report generation (streaming).

**Visual tone:** The machine at work. Impressive, live, purposeful. Not decorative — every element communicates real work happening.

#### 4a: Source Web

**Background:** `--source-bg` (`#0A0908`) — always dark, regardless of user's light/dark preference. This is a deliberate theatrical mode. The dark background makes the data luminous.

**Phase header:**
```
LEARNING BRAIN · ACTIVE
                            [Instrument Serif 20px, rgba(245,244,240,0.85), letter-spacing 0.5px]
```

**The constellation layout:**
Source categories as nodes arranged in a loose organic pattern (not a grid). Approximately 7–10 nodes visible. Spacing provides breathing room.

- Idle node: 14px diameter circle, `--source-node-idle` fill (`#2A2926`), `--source-node-text` label below
- Activating: 400ms fill transition from idle to `rgba(232,69,60,0.15)` then to `rgba(232,69,60,0.85)` — the red accent *glows* into existence
- Active: 16px diameter, fill `#E8453C` at 75% opacity, slow pulse (opacity 0.65 → 0.85, 2s loop)
- Complete: 16px, solid fill `#E8453C` at 100%, checkmark overlay (tiny, 8px × 8px)

**Category labels:**
- DM Mono 11px, initially `--source-node-text` (#6B6B66)
- When active: transition to `rgba(245,244,240,0.85)` over 200ms
- Category: e.g., "Government Data", "Industry Filings", "Academic Research"

**Cross-reference lines:**
- `--source-line` color (`#3A3835`) by default
- When a cross_reference_detected event fires: line draws from node A to node B (SVG stroke-dashoffset animation over 600ms)
- Active cross-reference: `rgba(232,69,60,0.25)` — a faint red thread

**Notable source names:**
- DM Mono 11px, `rgba(245,244,240,0.50)`
- Appear below the relevant node, fade in over 400ms, fade out after 3 seconds if another source replaces it
- Max 2 visible per node simultaneously

**The counter:**
```
4,271
sources reviewed
```
- Number: DM Mono 48px, `rgba(245,244,240,0.95)`, centered, below the constellation
- Label: Inter 13px, `rgba(245,244,240,0.45)`
- Counter increments smoothly — use CSS counter animation or requestAnimationFrame. Not a hard jump. The increment should feel like watching a live ticker.

**Compact badge (after layout_ready):**
When the Layout Canvas appears, the Source Web shrinks to a compact badge in the top-right of the main content area:
- 160px × 36px
- Background: `--source-bg`
- Shows: small pulsing dot (red) + "4,271 sources" in DM Mono 11px white
- This badge persists through the clarifying questions and Gate 2, then disappears at generation start

#### 4b: Report Generation (Streaming)

**Layout:** The report content area fills the main canvas, white background (`--document`). The topbar shows the progress strip.

**Progress strip (32px, in topbar):**
```
[● ● ● ○ ○ ○ ○ ○ ○ ○ ○ ○]   Section 3 of 12 complete · ~8 minutes remaining
```
- Completed dot: 8px filled circle, `--accent`
- Active dot: 8px, `--accent` + pulse animation
- Pending dot: 8px, `--border-strong`
- Text: DM Mono 12px, `--text-secondary`

**Report cover (first element rendered):**
- Full-width within the document area
- White background, A4-ratio proportions
- Report title: `report-title` — Instrument Serif 40px
- Cover metadata: DM Mono 12px, `--text-tertiary`
- The depth indicator lines mark (red dot + 1/2/3 lines) appears top-left — scaled to screen from report spec
- After 1.5s: smooth auto-scroll (800ms, ease-out-cubic) past the cover to the Executive Summary

**Skeleton loading (pending sections):**
Not grey bars. Instead: very subtle horizontal rules at the expected line heights — `--report-grey-light` (`#F2F1EF`), 1px height, at 28px intervals (matching body line height). This reads as "a document taking shape" rather than "a placeholder."

**Streaming text:**
- Characters appear at `--duration-type` (12ms) interval
- The active cursor: `|` in `--accent` (`#E8453C`), blinking (opacity 1.0 → 0 at 500ms intervals)
- When section completes (`section_complete` event): cursor disappears, a thin rule animates left-to-right under the section title (300ms, `--report-rule` color `#D6D4CF`) — the section "seals"

**Completed sections:** Fully readable, no visual differentiation from a completed report. Users scroll up and read completed sections while generation continues.

**Locked sections (pending):** The skeleton lines. Slightly lower opacity (`0.6`). A lock icon is NOT shown — the sections are simply not yet present, not blocked.

---

### Mode 5: Editorial

**What it is:** The completed report. The primary Caspr experience.

**Visual tone:** Premium publication. The Economist. The Financial Times. Not a web app. Not a conversation.

**The core layout:**

The main content area displays the report as if it is a document sitting on a desk. The key design decision: the document has a fixed maximum width (760px) and is centered in the content area with generous margins. This is the page-width of the report content column — not the full width of the panel.

The white document surface (`--document`) floats on the `--canvas` background. On a very wide screen, the canvas color shows on either side of the document. This reinforces the "document on a desk" metaphor.

**Section navigation sidebar (within document area):**
Left-anchored inside the content area, not a separate panel. 160px wide column showing:
- Section numbers in DM Mono 11px, `--text-tertiary`
- Section titles truncated to 1 line, Inter 13px, `--text-secondary`
- Active section: `--text-primary` text + thin 2px `--accent` left bar
- Scrolls independently from the document content

**Document typography:**
All `report-*` styles apply. Body text (`report-body`): Inter 400, 16px, 1.75 line height, `--report-black` (`#0B0B09`). This is intentionally slightly warmer/darker than the UI's `--text-primary` (`#0A0A0A`) — it matches the PDF exactly.

**The Executive Summary — critical design:**

The Executive Summary is the destination. Auto-scroll lands here. It must land with the weight of opening a premium report.

```
┌─ Executive Summary ─────────────────────────────────────────────────────┐
│                                                                          │
│  [Infographic — full document width, aspect ratio 16:9 approximately]  │
│                                                                          │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  KEY FINDINGS                               [gate-label / ui-overline]  │
│                                                                          │
│  ▌ The market will reach $1.2T by 2028     [insight text — Inter 16px] │
│    [→ Section 2: Market Overview]           [hyperlink — mono 12px red] │
│                                                                          │
│  ▌ Three players control 40% of volume     [insight text]              │
│    [→ Section 3: Competitive Landscape]     [hyperlink]                 │
│                                                                          │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  KEY QUESTIONS                              [gate-label / ui-overline]  │
│                                                                          │
│  ? EU regulatory exposure — review recommended [→ Section 5]           │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

The `▌` left border on key findings: 3px, `--accent`. This is the callout stat treatment from the PDF report — a red left rule marking the most important element on the page. In the screen version, it marks each finding in the executive summary.

Insight text hyperlinks: DM Mono 12px, `--accent` color, underline on hover — not the standard blue link. Red links are Caspr's citation convention.

**Section headers in the report:**

Following the report style guide exactly:
```
[DM Mono 12px, --accent]   1.2
[Inter 600, 18px]          Three Chinese suppliers control 78% of India's pharmaceutical sodium
[thin rule, --report-rule]  ─────────────────────────────────────────────────────────────────
```

The red section number + rule below the finding header is a direct port from the PDF specification.

**Callout statistics (in-page):**
```
78%
of India's pharmaceutical sodium
imports originate from a single
source country.
```
- Number: Instrument Serif 56px, `--accent`
- Label: Inter 13px, `--report-grey-mid`
- Right-aligned in the right column on two-column pages
- On single-column pages: centered block, one-third page height

**Charts:**
Chart rendering follows the report style guide §13:
- `--report-grey-mid` for all data series except the highlighted one
- `--accent` for the single highlighted series
- No 3D, no gradients, no grid backgrounds
- 1px horizontal grid lines in `--report-rule`
- White chart background

**The Ask Caspr panel:**

During report view, the Caspr panel (right) becomes the Ask Caspr interface. Visual treatment:
- Input: full width, 1px border (`--border`), 4px radius, Inter 14px
- Question/answer pairs stack below, oldest at top, newest at bottom
- Answer text: Inter 400, 15px, `--text-primary` — slightly more compact than report body
- Source chips below each answer: `--surface-2` background, `--border` border, DM Mono 11px `--text-secondary` — clicking expands to show source excerpt and publication
- No conversation bubble metaphor. No alternating colors. It reads like a Q&A section in a publication.

---

## Part IV: Component Patterns

### Buttons

| Variant | Background | Border | Text | Use |
|---|---|---|---|---|
| Primary | `--text-primary` (black) | None | White Inter 14px 500 | "Start Research", "Begin Analysis", "New Analysis" |
| Secondary | Transparent | 1px `--border-strong` | `--text-primary` Inter 14px 500 | Confirm, Back |
| Ghost | Transparent | None | `--text-secondary` Inter 14px 400 | Skip, Cancel, minor actions |
| Destructive | Transparent | 1px `--error` | `--error` | Delete |
| Disabled | `--surface-2` | 1px `--border` | `--text-tertiary` | All variants disabled state |

**Button states:** Hover = 100ms opacity transition + cursor:pointer. Active = immediate `--accent-pressed` fill for primary. Loading = spinner replaces text.

**Button sizes:**
- `lg`: 48px height, 20px horizontal padding — used for Gate CTAs
- `md`: 40px height, 16px horizontal padding — default
- `sm`: 32px height, 12px horizontal padding — inline, secondary actions

**The "New Analysis" button (file drawer):** Full drawer width, primary variant. This is the most prominent interactive element in the tool at any time. It is the consistent path to starting work.

### Form Elements

**Input:**
```
[label — ui-overline, ALL CAPS above]
┌──────────────────────────────────────┐
│  [value / placeholder text]          │  ← 1px --border, 0px radius
└──────────────────────────────────────┘
   [helper text — Inter 12px tertiary]
```
- Default: 1px `--border`
- Focus: 1px `--border-strong` (not a colored focus ring — this isn't consumer SaaS)
- Error: 1px `--error`
- Height: 40px single-line, flexible for multi-line

**Dropdown:** Standard `<select>` appearance. Chevron icon (Lucide `ChevronDown`). Same border treatment as input.

**Checkbox:** 16×16px, 4px radius. Default: `--border`. Checked: black fill, white check. No branded colored checkbox — this is a professional context.

**File chip (Gate 1):**
```
☑  Q1 2025 Market Report.pdf    ×
```
- `--surface-1` background, 1px `--border`, 4px radius
- Icon: Lucide file type icon, `--text-tertiary`
- Filename: Inter 13px, `--text-secondary`
- Checked state: checkbox in black
- Remove ×: appears on hover

### Analysis Cards (File Drawer)

```
┌─────────────────────────────────────────┐
│  The Global Logistics Market…           │  ← Inter 13px 500, --text-primary
│  Study · 23 May 2026                    │  ← DM Mono 11px, --text-tertiary
│                                    ●    │  ← in-progress pulse dot, --accent
└─────────────────────────────────────────┘
```
- `--surface-1` background on hover, transparent otherwise
- No border
- Active (open): left border 2px `--accent`, `--surface-1` background
- In-progress: pulsing red dot right-aligned
- Complete: no badge — completion is the default state

### Depth Indicator Mark (from report system)

The 1/2/3 lines motif from the report style guide is used in the tool for:
- Analysis cards in the file drawer (tiny, 6px lines)
- The topbar analysis type indicator when an analysis is open
- Gate 1 depth option cards (slightly larger)
- Loading state of the Source Web

```
Brief:        ●  —               (red dot + 1 line, 14px)
Study:        ●  ——              (red dot + 2 lines, 14px · 9px)
              ——
Intelligence: ●  ———             (red dot + 3 lines, 14px · 9px · 5px)
              ——
              —
```

This is the brand mark extended into the UI system. It appears at small scales (12-16px line widths) and communicates analysis type without text.

### Tags and Badges

```
STUDY          ← black background, white Inter 11px 600
IN PROGRESS    ← --surface-2 background, --text-primary
ENTERPRISE     ← --accent-subtle background, --accent text (border: --accent-subtle-border)
```

No rounded corners on status badges in the report — they have 0px radius. In the UI chrome they have 4px.

### Progress Indicators

**Section progress strip (in topbar during generation):**
- Dots: 8px circles in a horizontal row
- Completed: filled `--accent`
- Active: `--accent` + subtle pulse (opacity 0.6 → 1.0, 1.5s)
- Pending: `--border-strong`
- Spacing: 6px between dots
- No connecting lines between dots

**Skeleton loading (report content):**
Horizontal lines at line heights, not grey boxes. `--report-grey-light` (#F2F1EF), 1px height, full content width. Opacity 0.8. No shimmer animation — these are static placeholders that are replaced by content.

**Source counter:** No loading state. Counter starts at 0 and increments continuously. If the stream hasn't started, show "0 sources reviewed" — never a spinner.

### Sheets and Modals

**Bottom sheet (mobile):**
- `--surface-0` background
- 12px top corners only
- 40px drag handle strip at top (handle: 36px × 4px `--border-strong` pill, centered)
- No shadow — the overlay scrim behind it (`rgba(0,0,0,0.4)`) provides depth

**Modal:**
- `--surface-0` background
- 8px radius
- 1px `--border` border (in dark mode this matters more — provides edge)
- Max width: 540px default, 640px for wide modals
- No shadow

**Gate 2 slide-in panel:**
- 480px wide, slides from right
- `--surface-0` background
- 1px left border `--border`
- Full height of the viewport
- Behind it: main content dims to `rgba(0,0,0,0.15)` (light mode) / `rgba(0,0,0,0.35)` (dark mode)
- Not a modal — the user can see the Layout Canvas behind it

---

## Part V: The Report Cover as an In-App Experience

The report cover in the tool viewer inherits from the PDF report design (report-style-guide.md §4) but adapts for screen.

**Cover dimensions:** A4 aspect ratio (roughly 794 × 1123px) within the document area. On screens smaller than 794px wide, the cover scales proportionally.

**Cover image:** The same sector-relevant, industrial-scale photography used in the PDF. Full bleed within the cover boundaries. Same brightness/contrast treatment.

**Cover gradient overlay:** The one permitted gradient in the Caspr visual language (see report style guide §4.3). Applied exactly as specified.

**Cover typography on screen:**
- Report title: Instrument Serif 40px (slightly smaller than the 44pt PDF spec — better for screen)
- Scope subtitle: Inter 13px `rgba(255,255,255,0.58)`
- Date/wordmark: DM Mono 12px `rgba(255,255,255,0.32)` (date) + `caspr-logo-white.svg` ~66px wide (wordmark)
- STUDY/BRIEF/INTELLIGENCE badge: exactly as PDF spec

**After 1.5 seconds:** The auto-scroll past the cover begins. The cover is the "title card" — acknowledged and passed. The executive summary is where the analysis begins.

---

## Part VI: Motion System (Extended)

### From the Website (Inherited)

| Token | Value | Use |
|---|---|---|
| `--duration-fast` | 100ms | Hover transitions, micro-interactions |
| `--duration-base` | 200ms | State transitions, show/hide |
| `--duration-enter` | 280ms | Entering elements |
| `--duration-slow` | 400ms | Page-level transitions |
| `--ease-standard` | `cubic-bezier(0.2, 0, 0, 1)` | Most transitions |
| `--ease-enter` | `cubic-bezier(0, 0, 0.2, 1)` | Entering elements |
| `--ease-exit` | `cubic-bezier(0.4, 0, 1, 1)` | Exiting elements |

### Tool-Specific Additions

| Token | Value | Use |
|---|---|---|
| `--duration-type` | 12ms | Character-by-character streaming (not CSS, use requestAnimationFrame or intervals) |
| `--duration-settle` | 280ms | Section completion animation |
| `--duration-node` | 400ms | Source node activation |
| `--duration-scroll` | 800ms | Auto-scroll (cover → exec summary) |
| `--duration-counter` | — | requestAnimationFrame, ~30fps increment |
| `--easing-settle` | `cubic-bezier(0.0, 0.0, 0.2, 1.0)` | Section completion |
| `--easing-scroll` | `cubic-bezier(0.4, 0.0, 0.2, 1.0)` | Auto-scroll |

### Motion Zones — What Animates and What Does Not

**Animates:**
- Source Web node activation (400ms, fills and opacity)
- Source Web cross-reference line drawing (600ms, stroke-dashoffset)
- Source counter increment (smooth, requestAnimationFrame)
- Report streaming (character by character)
- Streaming cursor blink (500ms opacity cycle)
- Section completion rule (300ms left-to-right width animation)
- Auto-scroll to executive summary (800ms)
- Panel collapse/expand (200ms)
- Bottom sheet pull-up (spring physics)
- Modal/overlay entrance (280ms fade + translate)
- Page transition when opening an analysis (280ms fade)

**Does NOT animate:**
- The document content itself (no hover animations on report text)
- Navigation items (hover is immediate state change, not transition)
- Section header typography
- Charts after they've rendered
- The report cover after initial render
- Depth indicator marks
- Any element the user is actively reading

**Reduced motion (`prefers-reduced-motion`):**
All animation durations collapse to 1ms. The source counter still increments but immediately. The streaming still typewriters but at 1ms/char. The auto-scroll becomes instant. This is already in the website's globals.css and applies here.

---

## Part VII: Spatial System

### The Desk Metaphor

The tool's spatial design follows a physical desk metaphor:
1. **The desk surface** (`--canvas`): the background everything sits on
2. **The documents** (`--document`, white): the actual work artifacts — the report, the gates
3. **The drawers and tools** (panels): flanking the documents, accessible, subordinate

This metaphor explains every spatial decision:
- Documents sit on the desk (on the canvas, slightly elevated by `--document` vs `--canvas` contrast)
- Drawers are to the sides (file drawer left, Caspr panel right)
- The topbar is the frame (structure above the desk)

### Grid and Breakpoints

| Breakpoint | Width | Columns | Gutter | Margins |
|---|---|---|---|---|
| Mobile | < 768px | 4 | 16px | 16px |
| Tablet | 768–1279px | 8 | 24px | 24px |
| Desktop | 1280px+ | 12 | 24px | 40px |
| Wide | 1920px+ | 12 | 24px | auto (content caps at 760px document width) |

**Document max-width:** 760px in the report viewer (content column only — matches A4 text area proportions at screen scale).

**Shell dimensions:**
- Topbar: 52px, full width, sticky
- File drawer: 240px on desktop, collapses to 48px icon rail
- Caspr panel: 320px on desktop, collapsible
- Main content: flex-1, fills remaining width

### Spacing Applied

All spacing uses the 4px base grid. Key measurements:

**Greeting screen:**
- Greeting headline to invitation text: 12px
- Invitation text to prompt input: 48px
- Vertical centering: 20% from top (not exact center — slightly above)

**Gates:**
- Section to section (DEPTH to FILES): 24px + 1px rule + 24px
- Label to first option: 12px
- Option cards gap: 8px
- Commit button top margin: 32px

**Report content:**
- Outside margins: 80px left, 80px right (matches PDF's 22mm × 3.78px conversion)
- Between sections: 48px
- Between subsections: 32px
- Paragraph spacing: 16px
- Body leading: 28px (1.75× at 16px)

**File drawer:**
- Folder header: 32px tall
- Analysis card: 56px tall
- Card padding: 12px 16px
- Section separator: 1px rule + 16px space above next section label

---

## Part VIII: The Dark Mode Document

The document (report viewer) in dark mode deserves special treatment. When the app shell is dark but the document is white, the transition at the document boundary matters.

**Recommended:** A very subtle `box-shadow: 0 0 0 1px var(--border)` on the document container in dark mode. This one exception to the no-shadow rule provides the edge definition the document needs against the dark canvas. The shadow is 1px — it is not decorative, it is structural.

Alternatively (and preferred if technically feasible): the document canvas in dark mode uses `--surface-1` (`#161512`) instead of `--canvas` (`#0A0908`) — slightly lighter, which makes the white document contrast less abruptly without requiring a shadow.

---

## Part IX: The "Caspr." Wordmark in the Tool

The wordmark appears in exactly three places in the tool:

1. **Topbar** — `caspr-logo.svg` ~42px wide (true cap height ~20px), recoloured via `color:` — black (light) / white (dark). The red dot is baked into the asset, not an `--accent` period. Linked to `/`. Never larger in app chrome.

2. **Report footer** — Following the PDF spec. Each page of the report viewer shows the wordmark bottom right: `caspr-logo.svg` ~30px wide, `color: --report-grey-mid`. This is the publication's colophon.

3. **Report cover** — Bottom right, per PDF spec.

**The wordmark does NOT appear:**
- In the file drawer
- In the Caspr panel
- In gates or modals
- On loading states
- In the Source Web
- In empty states

The user already knows they're using Caspr. The wordmark's value inside the tool is as the publisher's mark on the document — exactly as The Economist's logo appears inside The Economist, not plastered on every margin.

---

## Part X: Figma Structure Guidance

### Variable Groups (Figma Variables panel)

```
Colours/
  Brand/
    ink
    white
    accent
    accent-hover
    accent-pressed
    accent-subtle
  Surface/
    canvas
    surface-0
    surface-1
    surface-2
    document
  Text/
    primary
    secondary
    tertiary
  Border/
    default
    strong
  Report/
    black
    grey-dark
    grey-mid
    grey-light
    rule
  Source Web/
    bg
    node-idle
    node-text
    line
  Functional/
    success
    warning
    error
    success-subtle
    warning-subtle
    error-subtle

Typography/
  [5 register groups, each containing the styles listed in Part II]

Motion/
  duration-fast
  duration-base
  duration-enter
  duration-slow
  duration-type
  duration-settle
  duration-node
  duration-scroll

Spacing/
  [4px scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128]
```

### Page Structure

Design all five modes as separate Figma pages:
1. `01 — Instrumental` (topbar, file drawer, Caspr panel, navigation states)
2. `02 — Invitation` (greeting, onboarding, empty states)
3. `03 — Gateway` (Gate 1, Gate 2, depth options, file components)
4. `04 — Theater` (Source Web, generation streaming, progress strip)
5. `05 — Editorial` (report cover, executive summary, full section, table, chart, Ask Caspr)
6. `00 — Components` (all shared components: buttons, inputs, tags, cards, sheets)
7. `00 — Tokens` (colour swatches, type specimens, spacing scale, motion documentation)

### Component Naming Convention

Following the website's convention:
```
Component/Variant/State
Button/Primary/Default
Button/Primary/Hover
Button/Primary/Loading
Input/Default
Input/Focus
Input/Error
Card.Analysis/Default
Card.Analysis/Active
Card.Analysis/InProgress
DepthIndicator/Brief
DepthIndicator/Study
DepthIndicator/Intelligence
SourceNode/Idle
SourceNode/Activating
SourceNode/Active
SourceNode/Complete
```

---

## Part XI: Anti-Patterns

These are the failure modes specific to this brand and ICP. Any of these in the designs should be flagged and removed.

| Anti-pattern | Why it fails | Correct approach |
|---|---|---|
| 72px Instrument Serif inside the tool | Marketing scale inside a work environment reads as shouting. The ICP finds it immediately off-putting. | Max 36px for the report title (cover), 32px for greetings. |
| Dark hero sections in the app chrome | The website achieves contrast with dark sections. In the tool, dark chrome competes with the white document. | Dark mode is for the whole shell at once. Isolated dark sections inside the tool feel like marketing bleeding into the product. |
| Chat bubbles in Ask Caspr | Every LLM product uses chat bubbles. Caspr is not a chatbot. | Q&A in linear layout, questions left-aligned, answers below. No alternating colors, no bubble borders. |
| Blue hyperlinks in the report viewer | Blue is not in Caspr's palette. It reads as a generic SaaS web link, not a curated citation. | `--accent` (red) for report hyperlinks. Underline on hover only. |
| Shadow on document cards | Shadows say "consumer SaaS". The ICP reads them as low-grade. | Background color contrast only. If needed: 1px border. No shadow. |
| Gradient fills on chart elements | Explicitly prohibited in the report style guide. Also reads as amateur data visualisation. | Flat fills only. Greyscale + one red accent series. |
| Progress bar during Source Web | A progress bar says "loading". The Source Web says "here is the work". | The counter + constellation IS the progress indicator. Never a bar during this phase. |
| Rounded corners on the report content area | Reports are pages, not cards. 16px or 8px radius on a 760px content area reads as a widget, not a document. | 0px radius on document surfaces. |
| Red text for general navigation | Red means "attention" or "action" in this system. Using it for hover states or general navigation dilutes both uses. | Navigation states use `--text-primary` on hover (never red). |
| Caspr speaking in first person in system messages | "I'm analysing your request" or "I found 4,271 sources" — sounds like a chatbot. | "Learning Brain · Active", "4,271 sources reviewed" — describe what's happening, not who's doing it. In greeting context: "Good morning, Sarah. What are you working on?" is the only first-person context, and it's warm, not servile. |
| Empty loading states | A spinner while the Source Web loads says "please wait". Caspr never makes the user wait for nothing. | The counter starts at 0 and increments immediately. The first node activates immediately. The user sees work starting from the first second. |
| Exclamation points | Per brand guidelines: never, anywhere, under any circumstances. | State conclusions. Confidence needs no punctuation. |
| Toast notifications during report generation | "Section 3 complete!" popups interrupt reading. | Section completion is shown in the progress strip (dot fills) and in the Caspr panel commentary. No toast interrupts the document view. |

---

## Part XII: Summary — What Makes This Different From the Website

| Dimension | Website | Tool |
|---|---|---|
| **Purpose** | Convert a stranger | Serve a professional |
| **Session length** | 30–120 seconds | 15 minutes to 24 hours |
| **Primary surface** | Dark hero over white | White document on warm canvas |
| **Headline size** | 64–72px Instrument Serif | 22–36px maximum |
| **Red usage** | Overlines, step numbers, CTAs (more frequent) | 12 specific contexts (more sparse) |
| **Spatial rhythm** | Dramatic alternating light/dark sections | Layered workspace: canvas → panel → document |
| **Typography density** | Open, generous | 5 registers, tight in Instrumental, open in Editorial |
| **Shadow** | None | None (1px border exception in dark mode) |
| **Dark mode** | Per-section drama via data-theme | Global system preference, document stays white |
| **Motion** | Subtle transitions at 100–200ms | + Theater motion for Source Web and generation |
| **Red link** | N/A | All report citations, section navigation |
| **Report typography** | N/A | Separate Editorial register, mirrors PDF spec |
| **Brand mark** | In header, hero | 3 places: topbar, report footer, report cover |

**What stays the same:**
- All three typefaces (Instrument Serif, Inter, DM Mono) — the wordmark is a placed asset, not a fourth face
- All colour tokens (accent, surface, text, border)
- 4px base grid and spacing scale
- No shadows, no gradients (one cover photography exception)
- The wordmark period is always red
- No exclamation points
- Conclusions not descriptions

---

*Document: visual-design-language.md*  
*Owner: Joy Sharma*  
*Version: 1.0 — 2026-05-23*  
*Scope: caspr-app product UI*  
*Adjacent documents: product-design-spec-draft.md (screen specs), report-style-guide.md (PDF outputs), brand-guidelines.md (brand rules)*
