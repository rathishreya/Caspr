# Caspr App — Motion & Interaction States (dev spec)

**Purpose:** the motion + hover/focus/pressed/disabled rules the frames don't carry. Closes the two gaps in `figma-dev-readiness-review.md` §4–5. **Extends** the existing motion tokens (`visual-design-language.md Part VI`, `app-shell-framework.md §7/§14`) to the shell + CRUD interactions built during handoff prep; it does **not** redo the signature beats (compression, Source Web) — those stay as specced there.

**Weighting (frequency-gated, for a productivity/analytical tool):** restraint + speed is the default (Emil); production polish on the states that ship daily (Jakub); **expressive motion is reserved for the ONE signature beat — the compression → Theatre pivot — which is already specced.** Everything in this doc is fast, subtle, and ideally **unnoticed**. If a reviewer says "nice animation" about a CRUD interaction, it's too much.

---

## 1. Principles

**The frequency gate — decide before adding any motion:**
| How often the user triggers it | Motion |
|---|---|
| Rare (the aha, onboarding, first upload) | expressive allowed — but only the already-specced signature beats |
| Occasional (open a drawer, confirm, top-up) | subtle + fast, 120–220ms |
| Frequent (100s/day: scroll, hover, tag toggle, tab switch) | **instant or none** |
| Keyboard-initiated | **never animate** |

- **Golden rule:** the best animation goes unnoticed. Motion clarifies a state change or spatial relationship; it never decorates.
- **`prefers-reduced-motion: reduce` is mandatory** — every motion below has a reduced alternative (crossfade or instant). No exceptions.
- **No shadows except the bottom drawer + modal cards** (`app-shell §11c-sexies`). Hover/lift states use **border, background, or a 1–2% scale — never a drop shadow.** The one sanctioned transient exception is a *dragged* row (§2, it is literally elevated) — keep it minimal.
- **Honour the accent discipline:** motion never introduces a new colour; opaque-accent-only.

---

## 2. Motion tokens (consolidated — reuse existing, add the two starred)

```css
/* Durations */
--motion-instant:  0ms;
--motion-fast:     120ms;   /* exits, small state flips */         ★ new
--motion-base:     180ms;   /* the workhorse: drawers, modals, reflow */ ★ new
--motion-settle:   280ms;   /* section completion — existing --duration-settle */
--motion-signature:400ms;   /* compression / open→centre — existing, §7/§14 */
--duration-type:   12ms;    /* streaming — existing */
--duration-scroll: 800ms;   /* auto-scroll — existing */

/* Easing */
--ease-standard:   cubic-bezier(0.2, 0, 0, 1);   /* enters + moves (decelerate) */
--ease-out:        cubic-bezier(0.0, 0, 0.2, 1);  /* = existing --easing-settle */
--ease-in:         cubic-bezier(0.4, 0, 1, 1);    /* exits (accelerate) */
```
Reconciliation: existing `--duration-settle`/`--easing-settle`/`--duration-type`/`--duration-scroll` and the 400ms signature are unchanged; `--motion-fast`/`--motion-base` are the only additions, for the everyday shell interactions that previously had no token. Existing button rules (hover 100ms opacity, active = immediate `accent-pressed`) fold into §4.

---

## 3. Motion per interaction

| Interaction | Trigger | Motion (property · duration · easing) | Reduced-motion |
|---|---|---|---|
| **Drawer open** (peek/half/full) | open control | `translateY` from below → detent · **base** · ease-standard; scrim fades in parallel | instant snap |
| **Drawer close / dismiss** | ✕ / backdrop / Esc | `translateY` down · **fast** · ease-in; scrim fades out | instant |
| **Detent change** (peek↔half↔full) | drag / control | height + position · **base** · ease-standard (bottom edge stays pinned, grows upward — `app-shell §5`) | instant |
| **Scrim** | modal/blocking drawer | opacity 0↔0.42 · in **base** / out **fast** | instant on/off |
| **Modal / confirm** (payment, delete) | open | opacity 0→1 + scale 0.98→1 · **base** · ease-standard; exit opacity→0 · **fast** | fade only, no scale |
| **Upload progress bar** | bytes landing | width animates **continuously** (linear, rAF/`transition: width`), never stepped — the "live ticker" feel of the source counter | jump to current % (no tween) |
| **Upload complete → card** | file `ready` | the progress row crossfades into the normal card (tag + `≡` appear) · **base** | instant swap |
| **New item lands at top of list** | upload/create | **FLIP:** new row fades+slides in at top; existing rows shift down · **base** · ease-standard | instant insert |
| **Row drag** (Included↔Excluded, via `≡`) | pointer down + move | pick-up: scale 1.02 + a *minimal* elevation shadow (sanctioned exception) · **fast**; follows pointer; other rows reflow (FLIP) to open a gap; drop: settle to slot · **base** · ease-standard | **no drag** — use the `≡` menu "Move to…" (the accessible equivalent, already the primary path) |
| **`≡` row menu (popover)** | click `≡` | opacity 0→1 + scale 0.98→1 from the anchor · **fast** | instant |
| **`≡` action sheet (mobile)** | tap `≡` | drawer motion (above) | instant |
| **Tag Private↔Public** | menu action | **instant** state flip (frequent, low-stakes) — no tween on the chip | instant |
| **Pane-switcher tab** (Contents/Ask/Edit/Outputs/Updates) | tab click | content **crossfade** · **fast**; active indicator slides under the tab · **fast** | instant crossfade |
| **Search filtering** | typing | result list reflow/crossfade · **base**; **no per-item stagger** (too busy at frequency) | instant |
| **Toast / inline confirmation** ("Memory added", "Balance updated") | success | fade + 4px rise · **base**; auto-dismiss after ~3s (fade **fast**) | fade only |
| **Report reading** | scroll | text has **no** entrance animation; chrome collapse per `app-shell §8` | unchanged |

**Signature beats (unchanged — do not re-implement here):** compression (brief docks into card, ~400ms, `app-shell §7`), open→centre (document lifts out, §14), Source Web / streaming / section-seal / auto-scroll (`visual-design-language Part VI`). Reduced-motion for these = instant cut, already specced.

---

## 4. Component interaction states (hover · focus · pressed · disabled)

**Global focus rule:** every interactive element shows a **2px `--accent` (red) focus ring at 2px offset**, keyboard-only (`:focus-visible`) — never on mouse click. Hit targets **≥44px** on Compact. Icon-only controls need an aria-label (§5).

| Control | Hover | Focus (kbd) | Pressed / active | Disabled |
|---|---|---|---|---|
| **Primary button** (red — Generate, Add-to-budget, Try-again) | fill darken ~6% (100ms opacity ok) | focus ring | `accent-pressed` fill, **immediate** | 40% opacity, no pointer |
| **Neutral button** (ink — Done) | ink darken ~6% | focus ring | darker ink, immediate | 40% opacity |
| **Text action** (Cancel/Clear/Delete-permanently/Change/Download) | darken + underline the label | focus ring | darker | 40% opacity |
| **File-card `≡`** | glyph grey→ink; **whole row** gets `surface-1` bg (Expanded only) | ring on the card | cursor `grab` (drag) / opens menu | — |
| **State chip** (PRIVATE/PUBLIC) | none — it's a read-only indicator (switch via menu) | — | — | — |
| **Menu row / action-sheet row** | `surface-1` bg | ring | ~80ms bg flash | dimmed |
| **Destructive menu row** (Delete…) | red text stays red, `error-subtle`-free light bg | ring | bg flash | — |
| **Amount pill / filter pill** | border darken (unselected) | ring | — | — |
| **Selected pill** (red fill) | no change (already committed) | ring | — | — |
| **Checkbox** | border darken | ring | — | dimmed |
| **Search field** | border darken | border→`--accent` + ring | caret visible | — |
| **List row** (analyses/recents) / **Contents TOC row** | `surface-1` bg | ring | bg flash; TOC current-leaf = red text (`gate-output §9`) | — |
| **Cover card** (Documents) | 1–2% scale + border darken (**no shadow**) | ring | scale down 1% | — |
| **Source row** (Bloomberg/…) | `surface-1` bg + Connect darkens | ring | — | **Soon** = 60% opacity, `COMING SOON` tag, not focusable |
| **Drop box** (dashed) | border grey→ink + bg `surface-1` | ring | drag-over: border `--accent` | — |
| **Red-dot citation** | 1.5× scale + cursor pointer | ring | opens Ask-Caspr scoped | — |

**Colour note:** built error states use **brand red `#E8453C`** for error *text* (upload-failed, payment-failed). Tokens `--error #B91C1C` / `--error-subtle #FEE2E2` exist but are **not** used in the shipped states — keep to brand red for error text unless Joy decides otherwise (flag).

---

## 5. Focus, keyboard & assistive

- **Tab order:** rail/nav → header → pane → centre → docked input → bottom nav. Logical, no traps outside modals.
- **Drawers & modals:** trap focus; **Esc** dismisses (= Cancel, never the destructive action); on close, **return focus to the trigger**.
- **Blocking confirms** (delete/reset/delete-account/payment): the **safe** option is the default focus (e.g. "Move to Excluded", "Cancel") — never the destructive one. Delete-account keeps the type-`DELETE`-to-arm gate.
- **Aria-labels for icon-only controls:** `≡` = "File actions" · red dot = "Show where this figure comes from" · `✕` = "Dismiss" · `+ New` = "New analysis" · progress = `role="progressbar"` with `aria-valuenow`.
- **Reduced-motion:** honour `prefers-reduced-motion: reduce` globally — swap every tween for a crossfade or instant change; the signature beats become instant cuts.
- **Live regions:** upload progress, "Memory added", balance changes announce via `aria-live="polite"`.

---

## 6. No-motion zones (never animate these)

- **Report body text** on read (no entrance/reveal — it's content, not an event).
- **Tag state flips** and other frequent, low-stakes toggles — instant.
- **Scrolling lists** — no per-item entrance; no scroll-jacking (except the one specced cover→exec auto-scroll).
- **Numbers/counts** — no tweened count-ups, **except** the Source-Web counter (a signature).
- **Nav tab content** — crossfade only, never a horizontal slide (reads as "moving between pages", which the app isn't).
- Anything keyboard-initiated.

---

*Owner: Joy · 2026-08-10. Companion to `visual-design-language.md Part VI` + `app-shell-framework.md §7/§14`. Frequency-gated per the design-motion-principles method; expressive motion stays confined to the signature Theatre beat.*
