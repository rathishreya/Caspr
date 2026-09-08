# Account & Wallet Screens — Spec

*Logic captured with Joy 2026-08-08 for the dev session. Governs the Wallet and Account (ex-Profile) areas on both breakpoints. Figma `y2F394I4CwEeSzH2kKuDCt`, page 👤 Profile & Wallet (`184:5`). UI tokens: `design-guidelines.md`. Related: `caspr-figma-state-registry.md`.*

> **Desktop vs mobile divergence is intentional (Joy, 2026-08-08).** Desktop keeps its actions **in the centre screen** (pane = menu, centre = the section incl. its edit forms). Mobile consolidates and moves actions into **drawers**. The mobile IA changes below were **not** cascaded to desktop and should **not** be — desktop is left as-is.

---

## 1. The mobile drawer model (foundation)

On mobile the desktop three-column shell collapses to **one centre screen + one bottom drawer**. The drawer is a **single control surface with three jobs**, so navigation and actions share it and no top "selector" is needed (selector was explicitly rejected):

1. **Navigate** — drawer's home state is the **account menu**. At rest it sits at the **peek** detent on every section screen; pull up → the menu.
2. **Edit** — an action with input (change email, edit a field, answer questions) rises **in the drawer**.
3. **Confirm** — destructive actions (reset, delete) rise as an **action-sheet drawer**.

### Detents (LOCKED)
`closed · peek · half · full` — **four only, no intermediate positions.** If content exceeds the detent height it **scrolls inside the drawer** (never grow the drawer to fit).

| Detent | Height | Use |
|---|---|---|
| peek | 76 | menu at rest (nav handle) on every section |
| half | 408 | menu open · all edit/confirm actions |
| full | 760 | reserved (not currently needed on account) |

- **Component reality:** the old `Bottom Drawer` set `146:20` (Peek/Half/Full) is **deprecated**. The only live v3 drawer component is **`Drawer — v3 (white)` `628:5` (Half 408)**. There is **no v3 Peek or Full component**. Standard placement: `628:5` instance at **x=0, y=380** so its bottom meets the Bottom-Nav top at 788. **Never resize it** — overlay content as siblings on top.
- **Peek** has no component; it's a short (~94px) drawer strip: handle + "Account menu · Pull up to switch section" + ⌃, sitting above the Bottom Nav.

### Centre-vs-drawer split rule (LOCKED)
- **Centre = what you *read*** — current values, lists, status, and **instant toggles**.
- **Drawer = what you *do*** — anything with input or multiple steps.

### Drawer exits (LOCKED)
Action drawers are **Cancel / Confirm only** — **no "back to main menu"** control. Rationale: an action is a focused, blocking task; a third exit is ambiguous (save-and-go vs discard-and-go) and actively wrong on destructive confirms. Dismiss (Cancel / pull handle down / tap scrim) **returns to the section**, which always shows the peek → the menu is one gesture away. The only "back" that belongs in a drawer is the menu drawer collapsing to peek (same pull-down gesture).

### Scrim / blocking
When any drawer rises to Half, a scrim (`#0a0a08` @ 0.42) covers the screen from y52 down (brand bar stays lit); the Bottom Nav is dimmed/blocked. Actions are **blocking** — including destructive confirms (tap-outside = Cancel = the safe default).

---

## 2. Mobile account — information architecture (consolidated)

Because categories collapse on mobile and single-item screens were too spare, sections are **combined** and the menu goes **flat** (no groups → nothing to expand/collapse).

### The menu (drawer open · `1669:2`)
Flat list, fits Half with room to spare:

- **Identity card** (dark) — shows who you are; **a `›` chevron on its RHS opens Details** (name/phone/email). The card *is* the profile, so Details is reached by tapping it — **there is no "Details" menu row.**
- **Research profile** `›`
- **Security** `›`
- **Notifications** `›`
- **Preferences** `›`
- **Sign out** (red, **no** chevron — it's an action, not a destination)

Every navigable row carries a RHS `›`. Peek is present on every resting section; **absent only when the menu is open or an action drawer is up**.

### Two merges

**A. Research profile absorbs Context questions.** They're one mechanism (the get-to-know loop): context questions are the *input*, the research profile is the *output*. **Context questions is NOT a separate menu item on either breakpoint** (removed from the desktop pane too).
- **Mobile centre** = the list of things Caspr has learned (each with `✕` to remove, inline) + a nudge to sharpen the profile. **Mobile drawer** = the get-to-know Q&A — **cloning the approved engagement carousel `209:757`** (serif question · option pills · pagination dots), eyebrow **"SHARPEN YOUR PROFILE"** (was "GET TO KNOW YOU").
- **Desktop centre (integrated, `1736:2`)** = title → a full-width **"Sharpen your profile" carousel card** → a **Memories list**. The carousel uses **square engagement cards (~240×216)** — a redesign of the engagement formats for a scannable deck (the thread formats `1525:2` are horizontal/one-at-a-time; forcing them side-by-side fought their design, so a square variant was made). **One card per format** for visual variety: **Prompt** (radio options) · **Poll** (result bars) · **Feedback** (stars) · Info (peek). Desktop = **3-up + peek** + pagination; the next slides in from the right. **The square card is reused in the mobile half-detent drawer** (`1689:2`) — but **one card per frame, full drawer width, no peek** (Joy: bigger card; the desktop 3-up peek doesn't carry to mobile), swipe for the next (pagination dots). **On mobile the card has NO border/fill** — content sits directly on the **white drawer** (drawers are white per the lockdown; the card border is a desktop-on-grey-canvas thing only). Answering any card drops a memory to the list. The **Memories list** = the learned facts (`✕` to forget); **answering a card drops a memory to the top** (top row flagged `JUST ADDED`, opaque red — no tint). Carousel is the input, memories the output; one section. This IS the desktop cascade of the merge (Joy 2026-08-08). **The standalone Research-profile + Context-questions center-states were removed from the reference `1629:2`** as redundant, and Context questions is no longer a pane item.

**B. Security = Password + Two-factor + Devices (one screen).** Each was too spare alone. One Security screen, **three cards**:
1. **Sign-in card** — `Password · last changed ›` and `Two-factor · Off ›` (trigger rows → drawers).
2. **Devices card** — device list, `Sign out` per device.
3. **Danger card (its own separate card)** — `Reset account` / `Delete account` (red). Joy: the danger zone gets **its own card**, not tacked onto the end of the devices list. **No "Danger zone" label** (dev/GitHub jargon, off-voice) — the red treatment + descriptions carry the caution.

---

## 3. Mobile section screens & their action drawers

Each section = a **centre display** (read-only) with the **peek at rest**; actions open a Half drawer. All assembled from components (`628:5` + `Button — Generate` `1072:2047` + cloned inputs), never hand-built.

| Section (centre) | Figma | Centre shows | Action → drawer | Drawer Figma |
|---|---|---|---|---|
| **Details** | `1697:76` | NAME · PHONE · EMAIL values | Edit name → input+Save | `1698:2` |
| | | | **Edit phone** (country code + number) → **Send code** | `1884:107` |
| | | | **Verify your number** (6-digit OTP · Verify · Resend · Change) | `1895:3` |
| | | | Change email → 2-step | `1658:98` (enter) · `1662:2` (sent) |
| **Research profile** | `1680:2` | learned-facts list (✕ inline) + nudge | Answer questions → carousel | `1689:2` |
| **Security** | `1686:2` | Password/2FA rows · devices · danger card | Change password → form | `1700:2` |
| | | | Enable two-factor → method select | `1698:37` |
| | | | Reset account → confirm | `1662:52` |
| | | | Delete account → confirm (type DELETE) | `1658:151` |
| | | | Sign out device → confirm | *(build when needed)* |
| **Notifications** | `1680:211` | 3 toggle rows — **inline/instant, no drawer** | — | — |
| **Preferences** | `1680:312` | Language · Output style · Format (values) | Tap row → picker | `1698:86` (language) |

**Password & Two-factor centres are deliberately thin** (single trigger row) — their forms are actions, so they live in the Security screen's rows and open drawers, not in a centre form.

### Action-drawer contents
- **Change email** — 2 states: (enter) current email shown + new-email input + "Send verification link"; (sent) "Check your inbox" + "Back to account" + "Resend link". Verification-link flow (link expires 30 min).
- **Reset account** — warns it forgets profile + deletes all reports but **leaves account + wallet balance untouched**; red Reset · Cancel.
- **Delete account** — warns it forfeits remaining balance; **type `DELETE` to arm** the red button; Cancel.
- **Change password** — Current / New / Confirm inputs + "Update password".
- **Enable two-factor** — method radios (Authenticator app *recommended* · SMS) + "Enable two-factor".
- **Language picker** — option list, current one checked, "Done".
- **Edit name** — pre-filled input + "Save".
- **Edit phone** — country-code selector (`🇸🇬 +65 ▾`) + number field + "Send code" (number is **not saved until verified**). → **Verify your number**: 6-digit OTP boxes + "Verify" · "Resend code" · "Change number". **SMS via AWS SNS** (Jayant's choice) — Caspr owns the OTP logic (generate/store/expire/rate-limit/verify; SNS only sends) + anti-SMS-pumping guards (rate-limit + country allow-list). Verification is **on from day one** (Jayant).
- **Context questions** — get-to-know carousel (one question, option pills, pagination).

---

## 4. Wallet

- **Desktop** `1532:2` — pane (recent activity / balance chart) + centre (Wallet title bar in the Screen-Title-Dark style, chart card, activity ledger).
- **Mobile** — `1571:2` (peek: compact dark balance card + chart + activity + plans-drawer peek) and `1581:2` (plans drawer at Half over the content).
- Balance shown = **$186** spendable (Research Budget $200 − 7% platform fee; fee is **internal, never shown**). Tier cards show the **$200/mo budget**. Terminology is **budget**, not "plan" (`.agents/pricing-model.md` §1).
- Activity ledger: uniform vertical rhythm (equal space above first row, between rows, after last row); next-recharge as a tinted top band; recharge line reconciles at **+$186** ("$200 charged, adjusted for last cycle's usage") + Download invoice.

### 4.1 One money balance — no per-item buckets (Joy, 2026-08-18)

**The Wallet shows money; the ledger shows utilization.** There is exactly **one balance**, in dollars. The Wallet never breaks it into separate currencies or buckets — no "edit tokens" card, no "credits" sub-balance. Everything the user spends on — **analyses, outputs, and overflow edit credits** — draws this one balance and appears as **dollar line-items in the activity ledger.**

- **Edit charges roll up per report (not per action).** An edited report shows **one ledger line** — `Edits · [report name]` · date · −$X — never one line per regeneration (matches the "no taxi meter" rule in `EDIT-ECONOMICS.md`). Same row pattern as the existing analysis rows (title = report/item · subtitle = type · date · amount); dev builds it from the same component.
- **Free per-report edit allowance is NOT shown in the Wallet.** It's report-scoped and already paid for, so it lives **in the report's Edit context** (a calm balance, like a purchased-credit balance), never as a wallet line. Only *overflow* edits (past the free allowance) reach the wallet, as a dollar ledger line. See `EDIT-ECONOMICS.md`.

### 4.2 Top-up = the one mechanism (Joy, 2026-08-18)

The Wallet **top-up is the only "buy more" flow** — for analyses, outputs, and edit overflow alike. **No separate "buy edit credits / tokens" screen exists or should be built** (none was — verified in Figma). Frames: `Wallet — Desktop · top up` `1854:2` / `Wallet — Mobile · top up` `1857:2`; custom (stepper) `1887:2` / `1888:2`; success `1855:2`/`1858:2`; payment-failed `1855:230`/`1858:175`; billing (Stripe) `1878:2`/`1878:135`.

- **Amount presets = the three tier anchors: `$20 · $50 · $100` + Custom** (updated 2026-08-18 from $50/$100/$200). The **user's tier value is pre-selected** — Professional $20 (as shown), Business $50, Enterprise $100.
- **Custom stepper: $10 increments, $10 minimum** (helper reads "$10 minimum · $10 increments").
- Top-up **adds to the existing balance** (`pricing-model.md` §8.3); credited to Paid Analysis Balance; no platform fee; does not change the authorised budget or milestone.

---

## 5. Desktop account (left as-is — reference only)

- **Account page** `1596:2`: pane `1596:70` (identity card + **expanded** nested menu: Profile ▸ Details/Research profile/Context questions · Security ▸ Password/Two-factor/Devices · Notifications · Preferences · Sign out) + centre `1596:4` (per-section content, header-per-selection).
- **Section-states reference** `1629:2`: all centre states (Research profile · Context questions · Password · Two-factor · Devices · Notifications · Preferences).
- Section header meta (right-aligned, y12, Inter Medium 10.5 white@0.6) mirrors the wallet title meta: e.g. Details=MEMBER SINCE MARCH 2025 · Research profile=7 THINGS LEARNED · Password=LAST CHANGED 3 MONTHS AGO · Two-factor=OFF · Devices=2 ACTIVE.
- **Desktop keeps forms/actions in the centre** and keeps the pane groups expanded. The mobile merges (flat menu, combined Security, Context-into-Research) are **mobile-only**.

---

## 6. Change-email & confirmations — desktop overlays (reference)

Desktop uses **centred modal cards** (reusing the onboarding signup/login card shell `1182:329`: white r8, drop-shadow, red button r4) over a dimmed account page — **not** drawers. Frames: change email enter `1646:2` · sent `1646:54` · reset `1646:106` · delete `1646:158`. Same blocking/scrim + cancel/confirm logic as mobile; the surface differs (centred modal vs bottom drawer). **The card is centred on the CONTENT COLUMN (x=747), not the viewport** (Joy, 2026-08-08) — it belongs to the centre where the action was triggered; the scrim still covers the whole app.

---

## 6b. Get Help

Reached from the Help control (rail bottom / More). **Centre = browse the FAQ; pane/drawer = message support.**

**Centre (both breakpoints):**
- Screen-Title-Dark header "Get help".
- **Search field** (`Search Field v3` `636:16`, relabelled "Search help…").
- **Category pills** (`Filter Pill v3` `926:2503` — HORIZONTAL auto-layout, so it hugs its relabelled text; **set the label only, never resize or move the child**). Short tags derived from the content-repository categories — **All · Basics · Analyses · Pricing · Reports · Account** (Basics=Getting Started, Analyses=Running an Analysis, Reports=Understanding Your Report, Account=Account/Security/Teams). **Same labels on both breakpoints** (no tag confusion). One pill selected (red). **Mobile scrolls horizontally with a right-edge gradient fade** (transparent→surface `#f6f5f3`) signalling more — pills are NOT wrapped (wrapping wastes the vertical space above the FAQ list).
- **FAQ = expandable white cards** on the grey surface (title + `›`/`⌄`; expanded shows the answer). Content = `content/caspr-help-content-repository.xlsx` "Answer Cards" (10 categories, canonical answers).
- **Title-bar meta** = `80+ ANSWERS` (knowledge-base depth; Help has no per-user status). Alternative if an SLA is committed: a support response time ("Replies in hours").
- **Navigation out:** the persistent nav owns it — mobile bottom nav (tap another tab or More) / desktop rail (Help icon highlighted, click another). No dedicated back. While the message drawer is at Full it covers the nav (focused task) → dismiss first.

**Support form (desktop pane / mobile drawer):**
- Heading "MESSAGE SUPPORT" uses the **§57 pane-heading style** (Inter Semi Bold 14, LS 0.3px, `#47463f`) on **both** breakpoints — because the support form is a *pane* on desktop, its mobile drawer carries the same heading (NOT a serif title). Serif drawer titles are reserved for the confirmation/edit drawers that derive from desktop *modals* (change email, reset, delete, edit-name, 2FA, picker).
- Shows the **same selected pill** as the centre under a "REGARDING" label (pre-tags the message with the category context).
- Subject input + Message textarea + "Send message" (`Button — Generate`).
- **Desktop:** the form lives in the pane (`Help — Desktop` `1711:2`) — heading "MESSAGE SUPPORT" in the **pane-heading style** (Inter Semi Bold 14, LS 0.3px, `#47463f`) at the standard **pane-heading y=68** (design-guidelines §57), and the "Send message" button **docked at the fixed foot slot y=782** (§58), never floating after the textarea.
- **Mobile:** starts at **peek** ("Message support · tap to message the team", `Help — Mobile (peek)` `1712:2`) → expands to **Full** when the user decides to send (`Help — Mobile (full · message)` `1713:2`). The Full detent uses the new **`Drawer — v3 (white) · Full` `1706:2` (390×760)** component (derived from the Half — the first Full-detent v3 drawer) at y=84; the **bottom nav stays visible** (on top of the drawer's foot) with Send/Cancel placed above it, and the centre content sits behind the scrim.

---

## 7. Component & asset references

| Element | Component / source |
|---|---|
| Mobile bottom drawer (Half) | `Drawer — v3 (white)` `628:5` @ y=380, not resized |
| Mobile bottom drawer (Full) | `Drawer — v3 (white) · Full` `1706:2` (390×760) @ y=84 — new, for the Help message form |
| Primary button | `Button — Generate` `1072:2047` (relabel) |
| Search field | `Search Field v3` `636:16` (relabel) |
| Category pill | `Filter Pill v3` `926:2503` (auto-layout; set label only) |
| Text input | cloned from login card `1303:528` child `email` (no dedicated input component) |
| Get-to-know / context drawer | engagement carousel `209:757` |
| Identity card | `1614:2` |
| Screen Title (dark) | `Screen Title — Dark v3` `659:2` |
| Header / Bottom Nav (mobile) | `Header — Mobile v3` `628:25` · `Bottom Nav — v3` `625:2` |
| Peek | cloned from the section screens (no component) |

**Build rule:** assemble by cloning/instancing these — never hand-rebuild a drawer, row, input, button, or card.

---

## 8. Open / not-yet-built

- Mobile: Edit phone drawer, Sign-out-device confirm drawer (both follow existing patterns).
- Desktop parity for the *new* onboarding-style overlays is done; the mobile-IA merges are **not** planned for desktop (per §Divergence).
- All frames laid out on page `184:5` in labelled bands (Wallet · Account · Change email · Reset · Delete · Mobile sections beside the desktop reference) for review.

---

## Update — account resets restructured (2026-08-17)

Joy (2026-08-17): the **account-level "Reset account" is removed entirely** — replaced by **three scoped destructive actions** in their natural homes. **Delete Account stays** (legal/GDPR).

**Removed:** the Reset-account row from the Devices card (desktop reference `1638:78`, shared mobile Danger card `1691:2` used by Security mobile `1686:2`, and the mobile Delete-confirm background `1658:157`); both Reset-account confirm frames (`1646:106`, `1662:52`) retired; orphan label `§ RESET ACCOUNT` deleted. Zero "Reset account" text remains.

**Added — three scoped actions**, each a bottom danger row (red label + grey sub, style cloned from the surviving Delete-account row) + a scrimmed confirm reusing the existing sheet pattern:

| Action | Home | Row desktop / mobile | Confirm desktop / mobile |
|---|---|---|---|
| **Reset research profile** | Research Profile (foot of Memories card) | `1736:135` / `1680:26` | `2195:2927` / `2206:3001` |
| **Reset Data Room** | Data Room (below Connected) | `1756:4` / `1766:2` | `2199:12745` / `2206:5607` |
| **Delete all documents** | Documents library (scroll-end) | `843:164` / `1280:196` | `2199:12923` / `2207:2629` |

Domain mapping: Documents = generated reports · Data Room = uploaded/connected sources · Research Profile = learned memories. Note: Documents-mobile `1280:196` was extended 844→970 (nav→914) to show the delete-all row at the honest scroll-end; its confirm normalises back to 844.
