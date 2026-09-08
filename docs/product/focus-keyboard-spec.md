# Focus, keyboard and target sizes

**Status:** locked 2026-08-21. Answers §6 of `../app-handoff/DESIGN-INPUTS-WHILE-CONVENTIONS-SETTLE.md`.
Built: `🧩 Components — Core` → **`Focus states — LOCKED 2026-08-21`** (`2455:169`).

---

## 1 · The focus indicator

**One indicator, everywhere.**

| | |
|---|---|
| Ring | **1.5px**, colour `focus/ring` |
| Offset | **2px** — a gap of the underlying surface between element and ring |
| Radius | element radius **+ 2** (pills stay pills) |
| Light surfaces | accent `#e8453c` — **3.93:1**, passes the 3:1 UI-component minimum (WCAG 1.4.11) |
| Dark surfaces | `#ffffff` |

**Why 1.5px and not 2 (Joy, 2026-08-21).** A 2px perimeter is required by **2.4.13 Focus Appearance, which is AAA**. We target **AA** via EN 301 549, where 2.4.7 Focus Visible asks only that the indicator be visible, and the measurable requirement is 1.4.11's 3:1 contrast — met at any thickness. 1.5px is therefore compliant and visually lighter. **1px was rejected**: the hairline border is already 1px, so a 1px ring reads as a border-colour change rather than a focus state.

**The 2px gap is not decorative — it is what makes the ring legal on an accent-filled control.** On the red `Generate` button the ring would otherwise sit red-on-red and fail. With the gap, the ring's outer edge meets the page surface and passes. **Never collapse the offset to zero.**

**Rules:**

1. **Never remove focus without replacing it.** `outline: none` is only acceptable where a custom ring is drawn in the same rule.
2. **Focus-visible, not focus.** Mouse users should not see rings; keyboard and switch users must. `:focus-visible`.
3. **The ring must never be clipped** (WCAG 2.4.11 Focus Not Obscured, AA). An ancestor with `overflow: hidden` will crop it — the ring's 4px total bleed must stay inside a scroll container's padding, or the container must not clip.
4. **Nothing may cover a focused element.** Drawers, scrims and the edge-prompt must not sit over the focused control — see §3.
5. The ring is **not** a hover state. Hover keeps its existing treatment.

## 2 · Target sizes (WCAG 2.5.8, AA — 24×24)

Audited across the live pages: **245 controls below 24×24, of which 72 are real failures.**

| What | Count | Verdict |
|---|---|---|
| `product-voice dot` 7×7 | 57 | **Exempt** — decorative, not a target |
| `citation dot` 7×7 | 33 | **Exempt** — 2.5.8 excludes targets *inline in a sentence* |
| `Wallet Icon` 20×20 | 77 | **Check the built control** — a 20px glyph inside a ≥24px button is fine |
| **Checkboxes 18–20px** | **72** | **Fail. Fix these.** |

**The fix is hit area, not appearance.** Keep the 18–20px box exactly as drawn; extend the tappable region to 24×24 (padding, or a pseudo-element). Redrawing the checkbox would change five screens for no accessibility gain.

## 3 · Keyboard models

Each pattern below follows the [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/). Where our component differs from the APG pattern, the difference is stated.

### 3.1 Drawer (mobile) — APG *Dialog (Modal)* when at Full, *non-modal* at Peek/Half

| Key | Behaviour |
|---|---|
| `Esc` | steps **down** one detent (Full → Half → Peek → dismissed). Never jumps straight to dismissed |
| `Tab` | cycles within the drawer **only when at Full** — Full is modal |
| `Tab` at Peek / Half | moves through drawer content, then continues into the page — these detents are non-modal |
| `Shift+Tab` | reverse of the above |

- **Focus on open:** the drawer's first interactive element; if none, the drawer container (`tabindex="-1"`).
- **Focus on close:** returns to the control that opened it. Non-negotiable — this is the most common keyboard regression.
- **The bottom nav stays reachable at every detent**, matching the z-order rule in `design-guidelines.md` §10.
- At Full, `aria-modal="true"` and the background is inert.

### 3.2 Pane switcher (Contents · Ask · Versions) — APG *Tabs*, manual activation

| Key | Behaviour |
|---|---|
| `←` `→` | move focus between tabs **without** activating |
| `Enter` / `Space` | activate the focused tab |
| `Home` / `End` | first / last tab |
| `Tab` | leaves the tab list and enters the active panel |

**Manual activation, not automatic** — switching panes is expensive (Ask and Versions load content), so arrowing through must not fire loads.

### 3.3 Menus — row actions, nav overflow — APG *Menu Button*

| Key | Behaviour |
|---|---|
| `Enter` / `Space` / `↓` on the trigger | opens, focus on first item |
| `↑` on the trigger | opens, focus on last item |
| `↑` `↓` | move between items, wrapping |
| `Esc` | closes, focus returns to the trigger |
| `Tab` | closes the menu and moves on |
| typing a letter | jumps to the next item starting with it |

### 3.4 Confirms — reset, delete, sign-out — APG *Alert Dialog*

| Key | Behaviour |
|---|---|
| `Esc` | cancel — identical to pressing the cancel control |
| `Tab` | trapped within the dialog |
| focus on open | **the safe control** (`Not now` / `Cancel`), never the destructive one |
| focus on close | the trigger |

`role="alertdialog"`, labelled by the title and described by the body.

### 3.5 The prompt bar

| Key | Behaviour |
|---|---|
| `Enter` | submit |
| `Shift+Enter` | newline |
| `Esc` | clear, if non-empty; otherwise no-op |

**The flipping placeholder stops on focus and the field clears** — see `onboarding-placeholder-prompts.md` §2. A moving placeholder under a caret is a legibility problem, not a delight.

### 3.6 Skip link

A visually-hidden **"Skip to content"** as the first tabbable element, revealed on focus, targeting the centre column. Without it, keyboard users traverse the rail and the whole pane on every page.

---

## 4 · What this does not yet cover

- **Screen-reader semantics** — landmark roles, live regions for the Theater's progress, and `aria-label` copy. Related but a separate pass.
- **Reduced motion** — `prefers-reduced-motion` alternatives for the drawer, the compression transition and the Theater.

---

*Design session · 2026-08-21. Companion to `design-guidelines.md` §1 (contrast) and §10b (responsive).*
