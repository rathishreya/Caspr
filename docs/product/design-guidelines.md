# Caspr · Web & Mobile Design Guidelines

The consolidated UI system for the Caspr product app (mobile + desktop). This is the *how it's built* companion to the brand voice (`.agents/brand-guidelines.md`) and the shell/motion spec (`app-shell-framework.md`). Where they overlap, this doc governs visual execution.

Persona anchor: **the Trusted Senior Analyst** — FT / Bloomberg / Economist register. Every rule below serves *precise, authoritative, editorial* — never soft, consumer, or chatbot.

---

## 1. Colour

- **Palette:** Black · White · Red. Accent red = **`#e8453c`**.
- **Chrome = white** (`#ffffff`): app header, bottom nav, left rail, pane, drawers.
- **Centre = canvas `#f6f5f3`** (surface/1) on card-composition modes (all Report Creation stages); **white** on content/document modes (Documents, Reading, Wallet, Settings). Report cover keeps its dark treatment.
  - Structural build: set the FRAME fill to canvas, lay a **white rectangle** over the rail(+pane) region so chrome reads white and the centre reads canvas.
- **Opaque accent ONLY — no tints, no pale fills.** The accent is used at full opacity as ink (text, glyphs, tags, the logo dot, the active nav item) — never as a washed-out background wash. *(Killed this session: the pale-red "current analysis" card fill.)* To signal an active/current item, use an **opaque accent tag or mark**, never a tinted surface.
- User chat bubbles = white with a hairline (so they pop off the canvas).

### Grey ramp (canonical — Figma `🎨 Tokens & Variables` → Brand)

Text and hairline greys resolve to this ramp — **do not hand-type off-token hex** (drift reconciled 2026-08-12).

| Token | Hex | Role |
|---|---|---|
| **`text/primary` · `brand/ink`** | **`#1a1a17`** | **primary ink — the app's text black (Joy, 2026-08-21)** |
| `grey-900` · `brand/black` | `#0a0a0a` | **website chrome only** — the live site's ink. Nav, wordmark and footer in the onboarding frames bind to this directly |
| `report-grey-dark` | `#1a1a18` | report body-dark, compact body, filenames |
| `#333330` | `#333330` | report body (deliberate darker body — kept) |
| `grey-700` · `text/secondary` | `#5c5b58` | secondary text |
| `text/label` | `#474642` | eyebrows, overlines, section & pane headings (absorbs the `#47463f` drift; `--color-text-label`) |
| `report-grey-mid` | `#6b6b66` | muted body, Theater/counter/flap label, footers |
| **`grey-650`** (new) | **`#8a8a85`** | metadata / placeholders / card bullets / dates (the mid-grey that was drifting as #8c–#80) |
| `grey-600` · `text/tertiary` | `#9c9b98` | tertiary / faint (incl. the failed-glyph) |
| `text/disabled` | `#a5a29d` | disabled labels (semantic) |
| `signal/label` · `signal/secondary` | `#6b6a78` · `#8b8a96` | **The Signal only** — a deliberate *cool*-grey family (kept, not warm) |

**The two near-blacks are not interchangeable (LOCKED 2026-08-21, Joy).** `text/primary` resolves to **`#1a1a17`** — that is what "primary text" means everywhere in the product. `#0a0a0a` survives as `brand/black` for **one purpose only: replicating the live website's chrome** in the onboarding frames, because those frames sit under the real site header and must match it. 70 nav/footer nodes are bound directly to `brand/black`; the other 161 primary-text nodes follow `text/primary` to ink. Never use `brand/black` for app text.

**Hairlines:** `border` `#e2e1de` · `divider` `#e0ded9` (grey-400) · `rule-light` `#ececea` · `report-rule` `#d6d4cf`.

**Fills (area, not edge):** `fill/skeleton` **`#e5e5e3`** — the inert grey *surface* of skeleton placeholders and the unfilled progress-track. A **fill** token (scopes: frame/shape fill), distinct from the hairlines above; do not fold it into a line value (added 2026-08-14).

### Text contrast — the ramp is now three levels (LOCKED 2026-08-21, Joy)

**Every text colour must reach 4.5:1 against its background.** Computed against `#ffffff`; on `#f6f5f3` the numbers are ~0.1 worse, and every failing usage in the file sits on white or canvas — none on the dark cards.

| Token | Ratio | Ruling |
|---|---|---|
| ink `#1a1a17` · `#333330` · `#474642` | 17.4 / 9.7 / 8.9 | text ✓ |
| `text/secondary` `#5c5b58` | **6.79** | text ✓ |
| `report-grey-mid` `#6b6b66` | **5.36** | text ✓ |
| `signal/label` `#6b6a78` | **5.30** | text ✓ |
| **`text/tertiary` `#75746f`** (was `#9c9b98`) | **4.68** | **text ✓ — the new floor** |
| ~~`grey-650` `#8a8a85`~~ | 3.47 | **not text.** Merges into `text/tertiary` |
| ~~`grey-600` `#9c9b98`~~ | 2.78 | **not text.** Merges into `text/tertiary` |
| `accent` `#e8453c` | 3.93 | **not text on paper.** Fill and border only |
| **`accent-text` `#be3530`** | **5.61** | red *text* on light surfaces |
| ~~`signal/secondary` `#8b8a96`~~ | 3.40 | **not text.** Replaced by `signal-secondary` below |
| **`brand/signal-secondary` `#75747f`** | **4.60** | The Signal's cool text floor — the cool twin of `#75746f` |
| `text/disabled` `#a5a29d` | 2.54 | **exempt** — WCAG excludes inactive controls. Unchanged |

**The two rules that follow:**

1. **`#9c9b98`, `#8a8a85`, `#8b8a96` and `#e8453c` may never be a text fill *on a light surface*.** They remain valid for hairlines, icon strokes, dividers, the applied-dot and area fills, which carry no contrast minimum — and `#e8453c` remains correct as text **on the dark cards**, where it passes comfortably. This is lintable: a text node with one of those four fills on a light ancestor is a defect.
2. **The quiet text ramp is three levels, not four** — ink → `#5c5b58` → `#75746f`. Nothing lighter than ~`#767570` can pass, so the two old quiet greys collapse into one. **Where two quiet levels genuinely need separating, separate them with size or weight, not colour.**

**Scope of the change:** 2,094 text nodes — Documents 933, Profile & Wallet 542, Report Creation 453, Components 67, Onboarding 67, Insights 32. Mostly small labels, caps eyebrows (`AMOUNT`, `COVER OPTIONS`), file metadata lines (*2.4 MB · Jul 13, 2026*), input placeholders.

**Why this is not a preference:** the European Accessibility Act has applied since 28 June 2025 and reaches us extraterritorially. WCAG 2.2 AA is the referenced standard.

## 2. Corner radius (locked 2026-07-24)

Radius is **semantic**, not decorative — it encodes what a thing *is*.

| Token | Value | Applied to | Meaning |
|---|---|---|---|
| `radius/sharp` | **0px** | document-page cards, dark cover/title cards, full-bleed bands, dividers, table rules | the finished, authoritative record — editorial/print |
| `radius/edge` | **2px** | **default for all functional chrome AND every content/layout card** — buttons, inputs, search fields, tags/chips, status pills, selectors, hover states, page content cards (wallet balance/detail cards, profile identity/details cards, file/list cards) **and layout/structure cards** (notifications card, section cards) | takes the harsh aliased edge off a square without reading as curved; crisp, not brittle |
| `radius/soft` | **12px** — **overlay surfaces only: modals, confirmation cards, popovers** (auth: login · signup · forgot · reset-link-sent · set-new-password · email-verification; wallet top-up / payment modals; account confirmation + sign-out dialogs; row-actions popover) · drawer top corners **20px** | these categories only | "lifted above the page" — the surfaces that float over the canvas |

Rules: rounding is a **reserved signal**. 2px is the workhorse for functional chrome **and for every content/layout card** — and it stays 2px **on the controls *inside* a 12px overlay** (a login card is 12px but its inputs/buttons stay 2px). **12px = overlay surfaces only** (modals, confirmation cards, popovers — the "lifted above the page" surfaces). 20px = drawer tops. 0px = documents/records and structural full-bleed. Pills, progress bars, pager dots and icon glyphs are fully-rounded shapes and are **not governed by the scale**. *(B2 ruling, Joy 2026-08-14: overlay surfaces 12, everything else — controls AND content/layout cards — 2. Supersedes the earlier "12px = layout/structure cards + overlay cards"; layout/content cards are now 2. Also supersedes: "inputs = 6px" → 2px; the 2026-08-10 "flatten auth to 2px" and 2026-08-11 interim "8px".)*

## 3. Typography

Three fonts, no others:
- **Instrument Serif** — display & brand voice (headings, greeting, report titles, the wordmark). Serif = Caspr's *authority / cited* voice; **never** used for wayfinding/nav.
- **Inter** — all UI: body, labels, nav, buttons, tags, metadata.
- **DM Mono** — figures & numbers (prices, balances, data points).

## 4. Logo & brand mark

- **Full "Caspr." wordmark** wherever a pane or brand bar provides a white surface for it (desktop rail+pane frames, mobile brand bar).
- **Collapses to "C."** (centred in the 64px rail, with the red dot) whenever **no pane is shown** (e.g. Welcome desktop). Size the "C." to the wordmark's true **cap height (~19px)** — *not* the padded logo-frame height (matching the frame box over-sizes it, since "Caspr." height includes the p-descender while "C." is pure cap height).
- The **red dot** is the brand mark. In the Welcome greeting ("Hi, Jayant. Welcome to Caspr."), the final "." is opaque accent red — echoing the logo when the mark is reduced to "C.".

## 5. Screen title & the eyebrow

- **Title style throughout = the dark square card** (`Screen Title — Dark v3`): `#0b0b09`, **square (0px)**, overline + Instrument Serif title in white.
- Desktop: title-card **bottom edge = y=68** (the shared line where the pane header + divider begin). Mobile: full-width, docked under the 52px brand bar.
- **Eyebrow = `Type · Status`**, and it **fills in left-to-right as each attribute resolves**: `NEW ANALYSIS` → `MARKET ANALYSIS · DRAFT` → `MARKET ANALYSIS · GENERATING` → `MARKET ANALYSIS`. Depth (tier) is **not** in the eyebrow — it rides as a separate badge.
- Full taxonomy (3 orthogonal attributes: Type / Depth / Status; 5 core Types) → `app-shell-framework.md` §18.

## 6. Navigation frame

- **Rail → pane → centre** (desktop) is the mobile **bottom → top** stack rotated left→right. Same logic, rotated 90°.
- **The pane = the desktop drawer; it exists only when open.** Welcome = no pane (the centre *is* "start new"). Conversation → the pane appears (analyses list: current pinned top + recent below; `Analyses` header + right-aligned `+ New`) and persists to Layout Canvas, where its content swaps to the live conversation.
- Rail 64px · nav icons 24px · pane 390px · wallet/avatar 28px, bottom-anchored.
- Icon set (Tabler): Analyses `sparkles` · Documents `files` · Insights `chart-histogram` · Data Room `database` · **Alerts `bell`** (notification bell + red unread badge) · Help `help` · Wallet `wallet` · **Account `user-circle`** · New `plus`. *(No "Settings" nav item — settings live inside Account; the old "Profile" is now "Account".)*
- **Rail is labelled (icon + label)** on the top four + the bottom cluster — not icon-only (updated 2026-08-10). Bottom cluster order: **Alerts · Help · Wallet (`$balance`) · Account**.
- Active nav item = **red icon + red label, no grey box**.
- **Pane section heading** (`EDIT`, `CONTENTS`, `GENERATE OUTPUT`, `OUTPUTS`…): **Inter Semi Bold 14, letter-spacing 0.3px, colour `#47463f`**, at the pane content left edge (**x=16** inside the 64-origin content frame = abs x=80), **y=20**. Right-aligned actions share that row: Discard/Save, or — on a **sub-screen reached from another pane** — a **`‹ Back`** (Inter Medium 13, grey, right-aligned to the pane content edge) as the way back.
- **Docked commit button + input sit at FIXED slots** (`app-shell-framework.md` §11c) — desktop button **y=782**, input **y=840, both frame-level (never inside the scrolling content frame), x=80, w=358**. Never float the commit button after variable content.
- **Pane-switcher activation follows existence** — a tab is live only once its target exists (during generation only Ask Caspr; on completion Contents·Ask·Edit·Outputs, Updates coming-soon). Disabled tab = `col.opacity 0.4`. Full table: `gate-output-spec.md` §8.1.

## 7. List rows (analyses / recents)

- **Light list, not cards:** title (Inter Medium 15) + muted **status** on the right + a subtle `›` chevron (reads "resume", *not* the ↳ "start-new" elbow) + hairline separator.
- Row height: **44px mobile · 52px desktop**. Desktop list width = flush with the prompt bar.
- The **current** item is an *identical* row — only its tag differs: **`CURRENT` in opaque accent red** vs the grey status tags on the rest.

## 8. Dividers

- **Keep** a hairline between two **white** surfaces (e.g. rail | pane — both white, would otherwise merge).
- **Drop** the divider where a white surface meets the **canvas** centre — the tone step (`#fff` vs `#f6f5f3`) already separates them.

## 9. Spacing & breathing room

- **Welcome is a landing, not a workbench** — generous space: on mobile the top ~30% stays empty above the greeting; open gaps between greeting → prompt → list.
- Work screens (Conversation, Layout, Gate, Working) are tighter and more efficient.

### The spacing scale (LOCKED 2026-08-21) — and why Auto Layout needed it

**`4 · 8 · 12 · 16 · 20 · 24 · 32 · 48 · 64`.** Every gap and pad resolves to one of these. Nothing else.

This existed only as prose until now, and the absence is precisely what blocked the Auto Layout conversion. A Figma frame carries **one** `itemSpacing`, so a stack whose gaps run 16 · 12 · 27 · 32 · 16 cannot be expressed at all. Automated conversion failed on 94 of 119 onboarding containers for exactly this reason — not overlaps, **uneven gaps**.

**The technique: one gap per wrapper.** Nest frames so each level holds a single spacing value.

```
content stack   VERTICAL gap 32
├─ hero         VERTICAL gap 24
│  ├─ text      VERTICAL gap 16
│  │  ├─ greeting
│  │  └─ headline+proof  VERTICAL gap 12
│  └─ prompt bar
└─ action       VERTICAL gap 16
   ├─ "Not sure where to start?"
   └─ cards row  HORIZONTAL gap 20
```

**Consequence to accept up front: converting a frame moves pixels slightly**, because off-scale gaps normalise. On `First-Time User — Desktop` a 27px gap became 24 and everything below the prompt bar rose 3px. **That is the conversion working, not drift** — a pixel audit will flag it, and the audit is wrong when it does.

**Converted so far** — Onboarding page 7% → **23%**, in the dev's rebuild order:

| Frame | Containers | Auto | Drift |
|---|---|---|---|
| Gate + Theater — Desktop | 17 | **59%** | none |
| Gate + Theater — Mobile | 13 | **54%** | none |
| First-Time User — Mobile | 15 | **53%** | x20 → x16 (gutter fix) |
| Login — Mobile | 15 | **40%** | card 479 → 494 |
| First-Time User — Desktop | 16 | **38%** | −3px below prompt bar |
| Login — Desktop | 16 | **38%** | card 528 → 540 |

**The Gate frames converted with zero drift** — their 24px conversation rhythm was already on scale, which is what the scale being real looks like. The two login cards grew 12–15px because their internal gaps were 5 · 23 · 19 · 10 · 13; the sign-up link below each was re-spaced to 24 (desktop) / 16 (mobile).

**Then Conversation · Theater · Generation** (Report Creation): Conversation Desktop 33% · Mobile 41% · Theater Desktop 27% · Generation Desktop 27% · Mobile 38%.

**One structural defect found and fixed while converting: the user chat bubble was not a container.** The rounded background was a `Frame` and the text was an *overlapping sibling* positioned on top of it — so the bubble could never grow with its text, and nothing could lay it out. The text is now a child, with the frame hugging at padding 14/11. **This is worth checking wherever a bubble appears** — the same shape may exist on the Ask and Versions frames.

**Patterns worth reusing:**

| Pattern | Encoding |
|---|---|
| Right-aligned user bubble | full-width `HORIZONTAL` wrapper, `primaryAxisAlignItems: MAX` — not a per-child alignment override |
| Numbered question row | `HORIZONTAL`, gap 0, **number fixed 20px**, text fills — holds the text edge steady when the numeral becomes 10 |
| `or` divider | `HORIZONTAL`, both rules fill, word hugs — self-solves at any card width |
| Chat bubble | text is a **child**, frame hugs with padding — never an overlapping sibling |
| Card / row stacks | `VERTICAL` gap 12, children `FILL` |

**Then the reader** — 21 `Working ·` frames, average **30%**, Report Creation page 27% → 28%.

The reader was done with a **list-run detector** rather than by hand: any run of ≥3 siblings sharing x and width with gaps within ±2 of each other gets wrapped in a `VERTICAL` frame whose spacing is snapped to the scale. 25 runs, 80 items, **zero reverts**. That covers Contents rows, Versions rows, Outputs cards, Updates cards and the edit control stacks — most of what the reader's pane actually contains.

**Left absolute on purpose:** the Theater graph zone (138 children) is a data visualisation, not a layout, and the pinned bottom furniture — input bar, pane switcher, bottom nav.

**The bubble defect was localised, not systemic.** A sweep for the shape across both pages — a childless frame with exactly one text sibling inside its bounds — returned **one** hit, and that was a Login *button*, not a bubble. The reader's bubbles are proper component instances. Only the two Conversation frames carried the defect, and both are fixed.

**Then Documents and Profile & Wallet** — the run detector extended to **horizontal** runs as well, which picks up toolbars and pill rows. **96 runs, 585 items, zero reverts.** Documents 20% → 21%, Profile & Wallet 24% → **28%**.

**Containers make latent collisions measurable — this is the real argument for the conversion.** The line *"More budget, more depth — Business unlocks upload, editing, Intelligence."* had been flagged twice as a 2px hairline touch and left alone both times, because the rendered text sat clear of the plan card. Once the plan cards became a single auto-layout run, the overlap was **−2px against a real container across 7 frames** and no longer arguable. The run now sits 16px below the line (absolute y 240 → 258). *Loose nodes hide this class of defect; containers surface it.*

**Where coverage is still low it is honest, not lazy.** The desktop reader frames sit at 24–27% because they are genuinely two-dimensional: a document column, a pane, a floating header, an overlay and pinned furniture that legitimately overlap. Percentage is not the target — *the content that stacks should stack*, and the rest should stay absolute and say so.

## 10. Shell dimensions (desktop, LOCKED 2026-07-26)

Fixed **1440** viewport. Distribution is a single system — **no width variation across screens**:

`rail 64 + pane 390 + buffer 93 + content 800 + buffer 93 = 1440`

| Region | Width | X range |
|---|---|---|
| **Nav rail** (icon + label) | **64** | 0–64 (rail\|pane hairline at x=63) |
| **LHS pane** (conversation / gate / filters) | **390** | 64–454 |
| Left buffer | 93 | 454–547 |
| **Content / document column** | **800** | **547–1347** (paned) |
| Right buffer | 93 | 1347–1440 |

- **The 800px content column is one token.** Title card, conversation, layout/section cards, gate, reading view, recent-analyses list — all 800. The header must always equal the cards.
- **Paned screens** (Conversation, Layout, Gate, Working…): content **x=547**, centred in the pane→edge area (454–1440, centre 947).
- *(Corrected 2026-08-11 — the pane is **390** with a **93** buffer, as drawn in every paned frame, e.g. `Gate — Desktop v3` `708:2`. The earlier "360 + 108" did not match the file; confirmed by Joy against the frames. The 800 content column and the pane-less x=352 are unchanged.)*
- **Pane-less screens** (Welcome): content **x=352**, centred in the rail→edge area (64–1440, centre 752).
- **800 = A4/Letter page width** — the column renders the boardroom document, so it uses page proportions, not prose measure. Pane = 390 because the inline gate form (label→value rows + filenames + prices) needs it; narrower clipped it.
- Mobile: 390 frame, 16px gutters → **358** content.

**Mobile nav + drawer z-order (build rule):** the bottom nav (y=788, 56 tall) is **persistent and top-most in z-order** — it stays visible even with a drawer up. Drawers rise to **just above the nav (bottom edge = 788), never to the frame bottom (844)**; a drawer sliding to 844 paints over the nav. Half detent = 380–788. (Exception under review: Theater may hide the nav for full-screen immersion, §8.)

## 10a. Focus, keyboard and target sizes (LOCKED 2026-08-21)

**One focus indicator everywhere: 1.5px ring, 2px offset, radius = element radius + 2.** `focus/ring` = accent on light (3.93:1, passes the 3:1 UI minimum), white on dark. **The 2px offset is structural, not decorative** — it is what keeps the ring legal on an accent-filled button, where a flush ring would sit red-on-red.

**It shows on keyboard focus only** (`:focus-visible`) — a mouse user never sees it. Never `outline: none` without a replacement. The ring must never be clipped by an ancestor (WCAG 2.4.11), and nothing — drawer, scrim, edge-prompt — may cover a focused control. *(1.5px, not 2: the 2px perimeter is a AAA rule; we hold AA, where 1.4.11's 3:1 is the measurable requirement.)*

**Targets: 24×24 minimum.** Decorative dots and citation dots inline in a sentence are exempt; **72 checkboxes are not** and need a 24px hit area with no change to the drawn box.

Built: `🧩 Components — Core` → `Focus states — LOCKED 2026-08-21` (`2455:169`).
Full keyboard models for drawer, pane switcher, menus, confirms, prompt bar and skip link → [`focus-keyboard-spec.md`](focus-keyboard-spec.md).

## 10b. Responsive model — fluid, not breakpointed (LOCKED 2026-08-21, Joy)

§10 gives the **reference composition at 1440**. It is not a licence to build only 1440. *"As responsive as possible"* (Joy) — laptops at every resolution and zoom level, tablets of all sizes, phones, and foldables that change posture mid-session.

**You cannot enumerate that.** Browser zoom alone defeats a breakpoint list: 150% zoom on a 1440 screen *is* a 960 viewport. So intent is declared **per region**, and every width falls out of it.

| Region | Behaviour | Value |
|---|---|---|
| Nav rail | **fixed** | 64 |
| LHS pane | **fixed** on wide · **fills** on narrow | 390 |
| Content column | **800, shrinking to a 560 floor** | ideal 800 · min 560 |
| Buffers | **fill** — absorb the remainder, shrink to 0 first | ≥0 |

**The precise declaration — the buffers give way before the centre does:**

```css
.rail   { flex: 0 0 64px; }
.pane   { flex: 0 0 390px; }
.buffer { flex: 1 1 0; }              /* grows and shrinks to 0 */
.centre { flex: 0 1 800px; min-width: 560px; }   /* holds 800, shrinks only when buffers are gone */
```

**Order of collapse as the viewport narrows:** buffers absorb down to 0 at **1254** (`64 + 390 + 800`), then the centre shrinks from 800 toward **560**, then at **1180** the structural switch fires and three columns become one column plus drawer.

**A Figma caveat the file cannot express, so read the CSS as authoritative.** Auto Layout has no flex-shrink and no priority — three `FILL` siblings split space *equally*. Encoding the centre as `FILL` with min 560 / max 800 produced a **560px centre at 1440**, which is wrong. The reference frames therefore pin the centre `FIXED 800` with the buffers `FILL`, which reproduces §10 exactly at 1440 · 1280 · 1254 but cannot demonstrate the centre shrinking below 800. **Where the frame and this CSS disagree, the CSS wins.**

**Below 1180 — one composition, not a third.** Header 52 fixed · content fill with 16px gutters · drawer at its detents · bottom nav 56 fixed and always top-most (§10). **Tablet and phone are the same structure**; they differ only in how much width the content region receives. There is no separate tablet layout to design.

Built: `🧩 Components — Core` → `Shell regions — §10b · 1440 / 1280 / 1254` and `Shell single-column — §10b · 834 / 390`.

**On the 834 reference width.** 834 is a width to *test at*, not a third design. The frames above exist so a build can be checked against something drawn; they are not a separate source of truth. **If a fluid build and an 834 frame disagree, the build is probably right and the frame is what needs fixing** — the region rules and the CSS above are authoritative, and the frames are downstream of them.

**One structural breakpoint, at ~1180.** That is the only place the layout changes *shape* — three columns (rail + pane + centre) become one column plus drawer. Above it and below it, nothing switches; it flexes. §10's exact numbers describe the state of this system at 1440, which is why they must stay consistent with it rather than compete with it.

**Four rules that make it hold:**

1. **Container queries on components, not viewport queries.** A file row, card or list item must respond to *its container*, so the same component works in a 390 pane and an 800 centre. This is what removes the need for separate mobile and desktop components — and it is the root fix for the 0.77-scale artifact (§3 of the dev inputs).
2. **Fluid type for display sizes only.** Hero and section headings may use `clamp()`. **UI text stays in fixed px** so the user's own font-size setting is respected rather than overridden.
3. **Zoom and foldables need no separate design.** Zoom is a narrower viewport. A foldable unfolded is a tablet width, folded is a phone width, and the transition is an ordinary resize. Both are already answered by the rules above.
4. **Auto Layout is how this is expressed in Figma.** `fixed` / `fill` / `hug` on every container *is* the responsive spec — a frame of absolutely-positioned children carries none of it. Conversion is therefore not tidying; it is the deliverable.

**Reference frames: three, not many** — 390 (phone) · 834 (tablet) · 1440 (desktop). Everything between is the rules. A fluid system needs **fewer** drawn widths than a breakpointed one, not more.

**Test matrix:** 320 · 390 · 768 · 834 · 1024 · 1180 · 1280 · 1440 · 1512 · 1920, each at 100 / 125 / 150% zoom, plus foldable folded and unfolded.

## 11. Conversation / chat (LOCKED 2026-08-01)

The pane conversation (Welcome → Layout → Gate) and the onboarding tool. **Caspr speaks as plain left-aligned text; the user speaks in bordered bubbles.**

### 11.0 The four text families — decided by ONE test: *does it scroll?* (LOCKED 2026-08-19, Joy)

The pane/drawer holds exactly four kinds of text. Anything new must be assigned to one of them — no fifth format.

| Family | Test | Treatment |
|---|---|---|
| **1 · Pinned chrome** | **stays put when the thread scrolls** | pane/drawer heading (Inter Semi Bold 14 caps `#474642`) · selection indicator. `EDIT`, `ASK CASPR`, `WHILE CASPR WORKS`, `BEFORE CASPR WRITES`, `CONTENTS`, `OUTPUTS` are **headings — they do not become voice.** |
| **2 · In-thread speech** | **scrolls away**, and could be said aloud | **Caspr** upright (nudge ink / reply grey) · **Product** italic + dot (engaging / quiet) |
| **3 · In-thread control label** | scrolls, but *names a control group* | small caps — `COVER OPTIONS`, `AMOUNT`, `REGARDING`, `SUBJECT`, `MESSAGE` |
| **4 · Meta / data** | not conversation | title eyebrows (`MARKET ANALYSIS · STUDY`), `FIGURE 1`, `01`–`05`, `SOURCES REVIEWED`, `%` |

**Consequence (applied 2026-08-19):** `OR JUST ASK` and `OR STEER BY INTENT` scroll away with turn-1 content and are therefore **speech, not labels** → converted to product-voice quiet, sentence case, **with the dot** (`Or just ask` · `Or steer by intent`). Same for `Preparing your questions`. The pane heading is untouched — it is pinned and always visible, which is its whole value.

**Pinning (locked):** the **heading + the selection indicator** are pinned; **everything else scrolls** — proposal cards, intent pills, connectors, chips, `COVER OPTIONS`. Proposal cards are *an answer*, not a control: Caspr regenerates them on request, and pinning ~210px of cards would leave a mobile Half drawer with almost no room for the conversation. *(If persistent controls are ever wanted, use the slim `Chart type · Style · Data` row — designed and currently hidden — not the cards.)*

### 11.0b Canonical values (applied across 📝 Report Creation, 2026-08-19)

| Role | Value |
|---|---|
| Caspr — nudge | Inter Regular **13 / lh 19** · ink `#1a1a17` |
| Caspr — reply | Inter Regular **13 / lh 19** · grey `#5c5b58` |
| Product — engaging | Inter **Italic 13 / lh 19** · warm `#34332f` + 7px dot |
| Product — quiet | Inter **Italic 13 / lh 19** · muted `#5c5b58` + 7px dot |
| User bubble | Inter **13** · ink `#1a1a17` — **Regular if typed**, **Italic if it echoes a tapped option/poll** |
| Numbered question | number at column left; text indented **+20**, 13 / lh 19 |
| Conversation column | **x = 80 desktop / 16 mobile, width 358** — shares one left edge with the prompt bar (§142) |

**Italic is exclusive to two things:** the product voice, and a selection echo inside a user bubble. Gate parameter values (`English (UK)`, `Investor`, `PDF, PPTX, XLSX, MD`) and the citation scope line are **data, not speech → Regular** (de-italicised 2026-08-19, 23 nodes).

**Caspr's dialogue is engine output (Jayant's API); the frames hold samples, not copy to hardcode. The product voice is product-side strings.** Never edit Caspr dialogue copy as a design change.

- **Caspr text — two roles, two colours:**
  - **Reply** (conversational — acknowledgements, questions back; "…calling my Ghost minions" is a reply): **Inter Regular 13, grey `#5c5b58`**, line-height 19, left-aligned, no bubble.
  - **Nudge** (directive — "answer these to sharpen the scope"): same Inter Regular 13 / lh 19, but **ink `#1a1a17`** (darker = more directive).
- **Product voice — the app speaking as itself (LOCKED 2026-08-18, Joy):** a *second speaker*, distinct from Caspr's analytical dialogue. Covers the relationship / get-to-know engagement, status narration ("Initiating Learning Brain…"), and account/state notices (the edit-budget crossing). Rendered as **italic Inter with a small grey outline dot (`#8a887f`, ~7px) leading the line** — the differentiator is *italic + the dot*, not colour (Caspr stays upright). **Never a red dot** (reserved for citations / Ask-Caspr). **Two modes, one voice:** *engaging* (relationship conversation) = warm **`#34332f`**; *quiet* (status / account) = muted **`#5c5b58`**, one step smaller. **No separate "notification" style — status is the quiet mode.** Full rule + rationale: `app-shell-framework.md §5`.
  - **One mark per *turn*, not per line.** The dot leads the turn's opening line; a continuation/supporting line in the same turn is italic + muted with **no** dot (e.g. "One quick thing while I work…" carries the dot; "It helps me tailor this report…" beneath it does not).
  - **The dot is inline — NOT a bullet. No hanging indent.** Wrapped lines, and any further paragraph of the same turn, run **flush to the content left edge** (the dot's own column) — they are never indented under the first line. In Figma: text sits at the content left edge at full column width with **`paragraphIndent = 18`** (first line only) and the 7px dot placed at that same left edge; continuation paragraphs use `paragraphIndent = 0`.
  - **Spacing follows the §11 table** — a product turn's supporting line is a *paragraph inside one message* (**8px**), not a new turn (24 desktop / 16 mobile).
  - **Phase markers use the SAME product voice — no third style.** `Initiating Learning Brain` · `Generating the report` · `Creating outputs` · `Report generated · 13 Jul` render as **a full-width hairline, then the product-voice line beneath it — left-aligned, italic 13, muted `#5c5b58`, grey dot**, sentence case. *(Retires the earlier centred-caps-between-hairlines label.)*
  - **Alignment:** Caspr and Product are **always left-aligned** at the content left edge, full column width, un-bubbled. **Only the user is right-aligned** (hug-width bordered bubble). Nothing else sits right.
  - *Applied 2026-08-18 to the Theater / Generation (incl. failed · Contact support · Creating) / Layout-Canvas / Ask-Caspr frames, desktop + mobile.*
- **User message = bubble:** white fill, **1px border `#e2e1de`, 2px radius**, padding **12 / 7**, **hug content with a max-width ≈ 72% of the content column (~260px on the 358 pane)**, **right-aligned to the column's right edge**; text Inter Regular 12.5–13 ink `#1a1a17`. Short messages stay compact, long ones wrap — a user bubble is **never full-width** (full-width reads as Caspr/system, not the user). This is the industry standard (iMessage / ChatGPT / Claude). Caspr's own replies, by contrast, DO take the full column width (plain text, no bubble) — the width asymmetry is intentional and is what distinguishes the two speakers.
- **Eyebrow** (e.g. `BEFORE CASPR WRITES`): the §5 eyebrow — Inter Semi Bold ~12, tracked, grey.
- **Inline gate block** (slides in when the user says "generate"): eyebrow → Caspr nudge → **scope questions** (red number `#e8453c` Inter Semi Bold 13 + question text Inter Regular 13 ink, lh 18) → **commit BUTTON** ("Start free — first $100" onboarding / "Generate · $price" app — a button, *never* a chat nudge). **The onboarding commit is INLINE** — a conversation beat immediately after the questions (turn gap 24), NOT docked. The **refine input stays docked at the pane foot** (persistent chat input). *Distinction:* the **app's** persistent Generate action IS docked at a fixed slot (`app-shell-framework.md §11c`, button y=782 desktop / 686 mobile) because it's a screen-level commit; the **onboarding gate flows with the conversation** because it's a one-time conversational beat. Don't dock the onboarding "Start free."
- **Vertical rhythm — a 4px scale mapped by semantic grouping** (tighter bond → smaller gap; gap = bottom-of-prev → top-of-next). **Mobile runs a compact density** (the conversation lives in a constrained drawer): the tight relationships stay identical across breakpoints; only the turn gap compacts.
  | Relationship | Desktop | Mobile |
  |---|---|---|
  | Line within a message (wrap) | line-height 19 | 19 |
  | Paragraphs inside one message | 8 | 8 |
  | Between list items (numbered / bulleted) | **8** | **8** |
  | A message → its own list (nudge → list) | **12** | **12** |
  | Between turns / replies / nudges | **24** *(centre only)* · **16** *(390px pane)* | **16** |
  | Eyebrow / heading → first message | **24** *(centre only)* · **16** *(390px pane)* | **16** |
  | Message → its card / pill / chip stack | **12** | **12** |
  | Between cards / pills / chips in a stack | **8** | **8** |
  Tight relationships (items 8, message→list 12) are identical on both breakpoints — they encode grouping, which doesn't change with screen width. **The turn gap follows the CONTAINER, not the breakpoint (Joy, 2026-08-19):** 24 only where the conversation owns the **800px centre column** (onboarding compose); **16 in the 390px pane and the mobile drawer** — the desktop pane is exactly as wide as the whole mobile shell, so it takes the compact rhythm too. *(This is a device density adaptation, NOT the frame-to-frame "bounce" problem — that was about frames of the **same** breakpoint.)*
- **Content column:** the conversation and the prompt bar share ONE left edge + width — desktop pane **x=80, w=358** (24px inside the box); mobile **x=16, w=358** (16px gutters). This is the *only* mobile/desktop delta. Never let the conversation sit narrower than / offset from the prompt bar (a text kept at a stale narrow width wraps to more lines than its stored height → overlaps when re-spaced; widen to the gutter first).
- *Applied to the **Onboarding page** (`184:3`), desktop + mobile, 2026-08-01.*
- ***Applied to 📝 Report Creation (`184:2`), 2026-08-19*** — the pending sweep is done. Conversation text normalised to **Inter 13 / line-height 19** (was `AUTO`≈16, plus stray 13.5/14 on Layout Canvas) and the gap table applied to: Theater desktop + mobile, Generation desktop + mobile (incl. `failed`, `Contact support`, `Creating`), Layout Canvas desktop + mobile, and the Ask-Caspr desktop threads. Phase-marker rows use hairline → **12** → the product-voice line. **Two deliberate exceptions:** (a) the **Ask-Caspr threads keep their 12.5px type scale** — normalising the *scale* there is a separate decision, only gaps were fixed; (b) **`Working · Ask Caspr — Mobile` (`944:1400`) was left as-is** — its Half drawer has a pinned input at y=336, and full 16px turn gaps push the thread past it, so its tighter spacing is deliberate (it scrolls in the real build).

## 12. Edit mode (LOCKED 2026-08-04)

Editing any element in a report. **The pane is contextual — it morphs to the selected element; the centre shows that element selected as the live edit target.** Controls are **proposal-driven, not dropdowns**: Caspr proposes 2–3 options *built from the section's data*, each a live preview + one-line rationale. Pick one, steer it, or just tell it. (Full data model + economics: `visualization-library.md`.)

- **Two families:** **Chart** (data viz) and **Visual** (images + infographics). **The cover folds into Visual** — a cover is a Visual element plus a Title-block control.
- **Intent steering (6, stable):** Compare · Trend · Composition · Relationship · Geography · Flow — pills on Chart + body infographics. **Not on the cover** (intents steer *data*; a cover is layout).
- **Visual pane:** first proposal is an **Image card** (curated 2-per-row grid = free; "＋ Generate bespoke" = paid, draws edit credits) then infographic proposals. **No Image/Infographic toggle.**
- **Cover:** Visual proposals + **COVER OPTIONS on/off toggles** (Light · Eyebrow · Standfirst · Page count · Date · Confidential). No "Title" toggle — title/eyebrow **text & type are edited by selecting the element**.
- **Selection = a red pulse border on the element's OWN boundary** (stroke the element's frame; for a loose figure, a rect at its exact bbox). No corner handles, no "EDITING" tag. Animate as the recorded red-dot pulse (not a glow).
- **Eyebrow** carries `MARKET ANALYSIS · STUDY · EDITING` with **EDITING in accent red** (the live-mode signal, cohering with the pulse border).
- **Edit-credit budget:** **no counter.** Generation draws from the report's shared edit-credit balance silently — no `↻ x/10`, no running total, no per-click price. Chart edits are free/unlimited. Interrupt **only at the edge** (a generation exceeds the remaining balance → top-up prompt). Model: `EDIT-ECONOMICS.md` · `pricing-model.md` §4.6-A.
- **Prompt bar position is FIXED — always** (mobile drawer input at drawer-y=314); never moved by reflow. It accepts freeform "analyse + show as X" requests.
- **Mobile:** same model reflowed into the drawer — proposals become a **horizontal carousel**, intents a scroll row; **Half detent default** (element stays visible while editing; swipe up→Full, down→Peek).
- **Frames** (`y2F394I4CwEeSzH2kKuDCt`, 📝 Report Creation): Chart `1131:2455`/`1275:2860` · Visual·Cover `1131:2668`/`1275:2968` · Visual·Infographic `1395:2`/`1422:2`.

## 13. File lists, row actions & scrim (LOCKED 2026-08-08)

Promoted from `data-room-screens.md` so every surface stays consistent.

- **File / list card.** White card on the grey canvas. Left→right: document glyph (folded-corner vector, **not** a checkbox) · title (truncates with ellipsis) · meta (`size · date`) · a right cluster **vertically centred on the card**: a **state chip** then a **`≡` control**.
- **State chip** (e.g. `PRIVATE` / `PUBLIC`): compact, 2px radius. Dark = ink fill / white text; light = grey fill / grey text. Read-only indicator — switching happens in the row menu, not on the chip.
- **`≡` (three-line control) = one control, two jobs:** drag handle **and** row-menu trigger. Keeps the row narrow so long names truncate cleanly. Never stack multiple action icons on a row — collapse them into the `≡` menu.
- **Row menu / mobile action sheet:** the same action list on both breakpoints (desktop = anchored popover, mobile = bottom sheet). Destructive item last, in red, with `…` when it opens a confirm.
- **Progress bar** (uploads, any determinate progress): **ink fill on a light-grey track — never red (reads as error), never green.** Percent readout in DM Mono, grey. On completion the row becomes a normal card; there is **no separate success colour** (palette stays Black / White / Red).
- **"Coming soon" tag:** small, **red text**, right-aligned to the block it annotates.
- **Scrim.** Black @ **0.42**. **Rule (app-wide): a mobile drawer gets a scrim ⟺ its desktop counterpart is a scrimmed modal.** Working-surface drawers (add/edit/menu/actions that map to a desktop pane, centre form, or popover) get **no scrim** — they must not dim the screen they act on. Only blocking confirmations (delete, reset, change-email, etc.) dim, on both breakpoints.

---

*Owner: Joy · Consolidated 2026-07-24 from the app design-system session. Sources: `app-shell-framework.md`, `.agents/brand-guidelines.md`, `.agents/pricing-model.md`, `visualization-library.md`. Figma: file `y2F394I4CwEeSzH2kKuDCt`.*
