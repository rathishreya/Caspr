> ⛔ **SUPERSEDED — folded into [`DEV-BRIEF.md`](DEV-BRIEF.md) §1 + §7 (2026-08-19).** Kept for history. Do not build from this file.

# Caspr app — final alignment pass

**File:** `y2F394I4CwEeSzH2kKuDCt` · **Date:** 2026-08-14 · **From:** design session

Five reconciliation rounds have converged the two most-worked pages (`184:4` Documents, `184:5` Profile & Wallet). This is the **single source of truth** for one final pass across **every** page, so Figma and the build agree everywhere on the same locked system — not just where we happened to be measuring.

How to use it: adopt the locked values below as the reference, then run the **seven-check sweep** over each page in the status table. Same two process notes as always — `setCurrentPageAsync` before any sweep, and read each node back after an edit. And: **a `use_figma` call that throws rolls back every edit in that call** — guard `if ("cornerRadius" in n)` etc. so a batch never dies on one wrong node.

---

## 1. The locked system

### 1.1 Colour tokens

**Text (warm greys — one token per role):**

| Token | Hex | Role |
|---|---|---|
| `text/primary` | `#1a1a17` | primary ink |
| `report-body` | `#333330` | report body (deliberately darker) |
| `text/secondary` | `#5c5b58` | secondary text |
| `report-grey-mid` | `#6b6b66` | muted body, counters, flap/footer labels |
| **`text/label`** | **`#474642`** | eyebrows, overlines, section & pane headings — **new this cycle** (`--color-text-label`; absorbs `#47463f` drift) |
| `grey-650` | `#8a8a85` | metadata, placeholders, dates |
| `text/tertiary` | `#9c9b98` | faint / tertiary |
| `text/disabled` | `#a5a29d` | disabled labels |
| `signal/label` · `signal/secondary` | `#6b6a78` · `#8b8a96` | **The Signal only** — deliberate cool greys, do not warm-merge |
| pending grey | `#b8b5b0` | undrafted/"not yet" state — deliberate, keep |

**Hairlines (1px edges):** `border` `#e2e1de` · `divider` `#e0ded9` · `rule-light` `#ececea` · `report-rule` `#d6d4cf`.

**Fills (area, not edge — new this cycle):**

| Token | Hex | Role |
|---|---|---|
| **`fill/skeleton`** | **`#e5e5e3`** | skeleton placeholders + unfilled progress-track (`--color-fill-track`) |
| **`fill/chip`** | **`#ededeb`** | light chips — DEFAULT chip, PUBLIC tag pills (`--color-fill-chip`) |

**Brand / accent:**

| Token | Hex | Rule |
|---|---|---|
| `accent` | `#e8453c` | the one brand colour; all CTAs, links, selected states, **and feature ticks** |
| `accent-pressed` | `#be3530` | pressed state (`brand/accent-pressed`) |
| `credit-green` | `#1a7f4b` | **signed amounts only** — the `+$X` credit in a ledger. **Never** a feature tick or status; those are `accent` (ruling B1) |

**Dark surfaces:** dark title/cover bars = `#0b0b09`, height **58**, radius **0**.

### 1.2 Radius (ruling B2 — this supersedes "layout cards = 12")

| Value | Applies to |
|---|---|
| **0** | documents, dark cover/title bars, full-bleed bands, dividers, rules |
| **2** | **all functional chrome AND all content/layout cards** — buttons, inputs, search, tags/chips, selectors, hover states, content cards, **notification card, section cards** |
| **12** | **overlay surfaces only** — modals, confirmation cards, popovers |
| **20** | drawer top corners |
| *(off-scale)* | pills, progress bars, pager dots, toggles, icon glyphs — fully-rounded shapes, not governed by the scale |

### 1.3 Scrims

- **Mobile:** fill `rgba(0,0,0,0.42)` (42% black), **y52, height 736** — starts below the bright brand bar, stops clean at the bottom-nav top (788). Node named `Scrim`.
- **Desktop:** full-viewport scrim (`0,0` → `1440×900`).
- **Rule:** a mobile drawer gets a scrim **⟺** its desktop counterpart is a scrimmed modal. Working-surface drawers do not dim.
- Discriminate scrims from chrome by **z-index** (real scrims z12–17; dark title bars z1) — never by colour.

### 1.4 Drawers

- **Three detents only:** peek **94** / half **408** / full **760**. No content-sized heights.
- **One border across all three** (they are one surface at three heights — a border that changes mid-swipe reads as a disruption): **top edge only**, stroke `#e0ded9`, `strokeTopWeight 1`, other sides `0`, align INSIDE. Implemented via per-side stroke weights, **not** a separate line node.
- **Handle:** 44×5, radius **2.5**, y **12**, fill `#c7c4bf`.
- Top corners radius **20**; a top drop-shadow carries lift.
- Master: `Drawer — v3 (white)` `628:5`.

### 1.5 Typography

- **Instrument Serif** — display/brand: headings, greeting, report titles, wordmark. Never wayfinding.
- **Inter** — all UI: body, labels, nav, buttons, tags, metadata.
- **DM Mono Medium** — **every figure**: prices, balances, counts, data points. A stray Inter on a number is the easy miss.
- **Body copy** = `textAutoResize: HEIGHT` (auto-height), always. No fixed-height body boxes.

---

## 2. New tokens to add to the code layer

Four variables now exist in Figma (Brand collection) that the build's token layer should carry:

| Figma variable | Code | Value |
|---|---|---|
| `fill/skeleton` | `--color-fill-track` | `#e5e5e3` |
| `fill/chip` | `--color-fill-chip` | `#ededeb` |
| `text/label` | `--color-text-label` | `#474642` |
| `brand/accent-pressed` | `--color-accent-pressed` | `#be3530` |

---

## 3. The seven-check sweep (run per page)

1. **Every desktop state has a 390 sibling** — empty, loading, error, no-results are the ones that get forgotten.
2. **Body copy is auto-height** (`textAutoResize: HEIGHT`).
3. **Radius per §1.2** — 12 overlay-only, 2 everything else, 0 documents/bands, 20 drawer tops.
4. **Greys on the ramp, fills on `fill/*`** — no hand-typed off-token hex.
5. **Scrims** named `Scrim`, 42% black, mobile y52 h736 / desktop full.
6. **Figures are DM Mono Medium.**
7. **Mobile drawers = one of the three detents**, with the one top-edge border.

---

## 4. Per-page status

| Page | State | What the final pass needs |
|---|---|---|
| `184:4` **Documents** | ✅ Converged (r4–r5) | Spot-check only. |
| `184:5` **Profile & Wallet** | ✅ Converged (r5) | Spot-check only. |
| `184:2` **Report Creation** | 🟡 Partly swept | Greys/eyebrows and body auto-height were swept in r5. **Verify radius per B2** (content cards → 2), scrims, and DM Mono on all figures. |
| `184:3` **Onboarding** | 🟡 Partly swept | Eyebrows bound in r5. **Verify auth-card radius** (overlay cards 12, controls inside 2), auto-height, scrims on the signup/gate overlays. |
| `184:6` **Insights** | 🔴 Not built | Only base desktop `1231:2860` + mobile `1277:196` exist. See §5 — this is the real remaining build. |
| `🧩 Components — Core` | 🟡 Check masters | Confirm the masters carry the locked values (drawer `628:5`, rail, nav, toast, title bar) so instances inherit correctly. |
| `🎨 Tokens & Variables` | 🟡 Add tokens | Add the four §2 variables to the published set; drop any remaining wide-grey swatches. |

---

## 5. Insights (`184:6`) — the remaining build

Pre-flighted in round 5. It needs a full build, not a sweep:

- **Missing states** — no empty / loading / error / no-results at either width. Draw the 390 siblings as you build (the Data Room needed three drawn in round 4 for exactly this reason).
- **Off-ramp greys to retire** — `#0f0e0d`, `#deddda`, `#e9e8e6`, `#e6e5e2` (×16), `#0a0605` (old warm scrim).
- **Stray green** — `#2e7d33` (×3): ruling B1 sends any non-signed green to `accent`.
- **Off-scale radii** — `1246:124–129` (r1), `1253:121–139` (r3): resolve to the §1.2 scale.
- The base scrim (`1277:221`) and one body box (`1250:105`) were already fixed to the standard.

Insights remains **Coming-soon / Phase 2** — build it against this spec from the start rather than drawing then reconciling.

---

## 6. Known deliberate exceptions (do not "fix")

- `#b8b5b0` — the undrafted/pending grey (reads intentionally lighter than tertiary).
- `signal/label` `#6b6a78` · `signal/secondary` `#8b8a96` — The Signal's cool greys are a signal, not drift.
- `credit-green` `#1a7f4b` on `+$X` ledger credits — the one non-accent hue, signed-amounts only.
- Full-screen composer drawer covering the nav — it's a full surface, not a scrimmed drawer.

---

*From the design session · 2026-08-14. `184:4` / `184:5` are the reference for how a converged page looks. Report any value in §1 the build already diverges from, with the node, and we close it.*
