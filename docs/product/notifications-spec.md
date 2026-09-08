# Caspr App — Notifications Spec

**Status:** Toasts + bell entry points BUILT and approved (2026-08-10). Notification Center + User-Education layer = **post-handover layers** (build after core, non-blocking — they sit over the existing shell, no structural change required). Companion to `motion-and-interaction-states.md` (motion tokens) and `design-guidelines.md` (§13 states).

---

## 1. Toasts (BUILT)

Ephemeral, non-blocking confirmations and errors. Auto-dismiss; never block the surface underneath.

### Anatomy
- **Card:** white fill, 1px ink-border (`#CCC9C8` ~ `{0.80,0.795,0.785}`), radius **8**, soft drop-shadow (`y6, blur20, black @12%`). Height **38px**.
- **Leading icon (optional):** 13px, `✓` in ink for success, `!` in red (`#E8453C`) for errors. 14–16px left inset.
- **Message:** Inter Medium 13px, ink (`{0.102,0.102,0.09}`), vertically centred.
- **Action (optional):** Inter Semi Bold 12.5px, red, right-aligned (e.g. *Undo*, *Retry*).
- Width fits content: short ~282–344px, long single-line info ~452px.

### Placement
- **Desktop:** bottom-**right**, bottom-aligned to the **nav/pane divider's bottom edge** (24px margin from frame bottom). Stack upward, 8px gap, newest on top.
- **Mobile:** horizontally **centred**, floating just above the bottom nav (~52px above nav top). Stack upward, 8px gap.
- **Rule:** mobile matches desktop card height (38px) and styling exactly — one toast system, two placements.

### Types
| Type | Icon | Use | Example |
|---|---|---|---|
| Success | `✓` ink | Confirm a completed action | "Memory added" · "Budget topped up — $151.00" |
| Info | none | Async status, no action needed | "Report generating — we'll let you know when it's ready." |
| Error | `!` red | Recoverable failure + retry | "Couldn't reach the server" · *Retry* |

- **Copy:** follows `copy-standards.md` — errors carry reason + reassurance, red text only, no exclamation points. Sentence case.

### Motion & timing
- Enter: fade + 8px rise, `--motion-base` (180ms), ease-out. Exit: fade + shrink, `--motion-fast` (120ms).
- **Dwell:** ~3.5s default; **errors and toasts with an action** persist longer (~6s) or until dismissed/acted. Hover pauses the timer.
- Max **3** stacked; older ones drop off the far end.
- Respect `prefers-reduced-motion`: crossfade only, no translate.

### A11y
- `role="status"` (info/success, polite) / `role="alert"` (error, assertive).
- Action is a real focusable button; toast is keyboard-dismissible (Esc).

**Built frames:** Desktop `1922:2` (📄 pg), Mobile `1928:76`.

---

## 2. Bell / notification entry points (BUILT)

Persistent, always-visible access to the (Phase-2) Notification Center. Line-icon bell, matched to sibling icon grey (`{0.36,0.357,0.345}`), 15px glyph in a 24px slot, with a **red unread badge** (7px, white ring) top-right.

### Desktop — icon rail (`626:76`)
- New **"Alerts"** slot in the bottom cluster, directly **above Help** (same 54px pitch, label style matches Help/Wallet/Account).
- Order (bottom cluster, top→bottom): **Alerts · Help · Wallet ($balance) · Account**.

### Mobile — header (`628:25`)
- Bell replaces the old header **balance chip**, placed **left of the `+ New`** button: `Caspr.` … `🔔•` `+ New`.
- **Consequence — mobile nav restructure** (the balance had to move somewhere always-visible):
  - **Bottom nav** (`625:2`): the **Insights** tab → **Wallet** tab (wallet glyph + live balance label, e.g. `$86.40`). Nav is now **Analyses · Documents · Wallet · More**.
  - **Insights** moves **into "More"** overflow (`1236:2860`) as its **first row**. More now mirrors the desktop rail's non-primary destinations: **Insights · Data Room · Help · Account** (icons matched to the rail — bar-chart / database / headset / avatar). The old Wallet row is removed (now a primary tab); there is **no "Settings"** item and the account row is **"Account"** (not "Profile"), matching desktop.
- Desktop rail keeps Insights as a top-cluster destination — this restructure is **mobile-only** (space-driven).

### Badge logic (dev)
- Badge visible when `unreadCount > 0`. No number shown at this size — dot only. Clears when the Center is opened.

### ⚠️ No destination screen yet — PHASE 2
The bell entry points (rail "Alerts" + mobile header bell) are built, but the **Alerts / Notification Center screen they open does NOT exist in Figma yet.** It is a **Phase 2 deliverable** — Joy will design the Center frame and it will be handed over then. Until then, dev should wire the bell as a stub (no-op or "coming soon"), NOT invent a Center screen. See §3.

---

## 3. Notification Center ("Alerts") — POST-HANDOVER (Phase 2, NOT YET IN FIGMA)

**The Alerts / Notification Center page is pending — it will be designed by Joy and handed over in Phase 2.** Do not build it from assumption. The bell opens this (stubbed until the frame lands). A panel listing past notifications (results ready, budget events, system). Opened from the bell (rail on desktop, header on mobile).

**Intended shape (for dev to stub, design to follow):**
- Desktop: right-hand **drawer** (white, 4-detent async pattern per shell) or popover under the rail bell.
- Mobile: full-height sheet from the header bell.
- Row: icon · title · one-line detail · relative time · unread dot; tap → deep-link to the relevant surface (report, wallet, doc).
- Groups: **Today / Earlier**. Empty state follows the built pattern (line glyph + serif headline + one body line, no CTA needed).
- Actions: mark-all-read; per-row dismiss.
- Source of truth: product backend feed (ties to the Updates/re-analyse feed in `updates-feature-phase2.md` where relevant).

**Not blocking core handoff** — it layers onto the existing bell + shell with no structural change.

---

## 4. User-Education layer — POST-HANDOVER (Phase 2, not yet designed)

Lightweight, dismissible guidance to drive activation (the funnel's core problem). Layers over the built shell.

**Candidate patterns (to spec + design later):**
- **First-run coach-marks** on the compose/gate screen (one-time, dismissible) pointing at the prompt bar and the gate.
- **Empty-state nudges** already partly covered by the built empty states — extend with a single "Run your first analysis" affordance.
- **Contextual tips** (e.g. first time a report completes → tip on citations / Ask-Caspr / Outputs), delivered as the info-toast or a one-time inline callout.
- Frequency-capped; never modal; always skippable. No exclamation points.

**Design principle:** education must not read as a chatbot or an onboarding wizard — it is the Trusted Senior Analyst leaving a margin note, then getting out of the way.

---

*Owner: Joy · 2026-08-10. Toasts + bell = built & approved. Center + Education = post-handover, additive.*
