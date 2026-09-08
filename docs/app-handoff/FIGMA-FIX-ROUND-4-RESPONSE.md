> ⛔ **SUPERSEDED — folded into [`DEV-BRIEF.md`](DEV-BRIEF.md) (2026-08-19).** Kept for history. Do not build from this file.

# Caspr app — Figma fix, round 4: design-session response

**Re:** `FIGMA-FIX-ROUND-4-PROMPT.md` · **File:** `y2F394I4CwEeSzH2kKuDCt` · **Page:** `184:4` (Product App) · **Date:** 2026-08-14

Every item below was **applied and re-read in the file** — values pasted back are the node's actual state after the edit, not carried from the prompt. Process notes honoured: `setCurrentPageAsync` before every sweep; read-back after every set.

---

## A. Three missing mobile Data Room frames — drawn ✅

All three built on `184:4`, screenshot-verified at 390×844, on the standard mobile chrome (Header, dark title bar #0b0b09/h58, peek "Add files" drawer, Bottom Nav).

| State | New frame | Built from |
|---|---|---|
| Data Room — Mobile · search results | **`2071:2215`** | `1766:2` shell + one `1784:304`-style card |
| Data Room — Mobile · loading | **`2072:2278`** | skeleton ramp off desktop `1832:2` |
| Data Room — Mobile · search no results | **`2073:2337`** | compact ramp off `1808:2` |

Details, so you can match rather than infer:

- **Search results** — search field at 16/126 (358×44) prefilled `market`; result line `1 result for "market"` (Inter Semi Bold 13, x16) with `Clear search` (brand red, right-aligned x254, y186); one file card at y214 (`2071:2229`), filename set to `market-sizing-model.xlsx` so the result actually matches the query.
- **Loading** — skeleton label bar 90×12 (r2) at 16/126, then **4 skeleton cards** 358×64 (r2, #ececea border) at y150/222/294/366 (pitch 72). Each card: glyph placeholder 20×22, title bar 150×10, meta bar 90×8 — all r2, fill #e5e5e3, at the real card's 17/42 columns.
- **Search no results** — magnifier glyph (cloned from desktop `1812:97/98`, centred on the 195 column at y300); **25px** Instrument Serif headline `No files match "quarterly earnings deck"` (auto-height, centres to 2 lines); **15/22** body `Try a different term, or clear the search to see everything.` (auto-height, centred, 10px under the headline); search field 16/126 (358×44) prefilled with the query; eyebrow reads `NO MATCHES`.

Headline box was auto-heighted (66) and the body re-stacked below it — the first draft had a fixed-height headline colliding with the body; corrected and re-screenshotted.

---

## B. Sign-out trigger — resolved (the Account screen was already drawn)

The Account screen **exists** — it was filed under a misleading name, which is why a search for "Account" missed it. Fixed and completed:

1. **Renamed** `1596:2` "Profile — Desktop v3" → **"Account — Desktop v3"** (page `184:5`, `👤 Profile & Wallet`). This is the live Account destination — rail Account‑selected, identity card, full section menu (Profile ▸ Details / Research profile · Security ▸ Password / Two‑factor / Devices · Notifications · Preferences), defaulting to Profile ▸ Details. The reference frame `1629:2` even labels itself *"not a screen — build 1596:2."*
2. **The trigger already exists** — the red **Sign out** row at the foot of the pane menu (`1614:21`, x16 y858, level with the rail's `Account ›`). Not a bare `/sign-out` route.
3. **Built the missing desktop confirmation** — **`2081:2853` "Account — Sign out (confirm) — Desktop"** (cloned from the account‑overlay pattern; scrim over the dimmed Account page; card: "Stay signed in?" / retention body / red **Stay signed in** primary / **Sign out anyway** text link). This mirrors the existing mobile sheet `1248:104` ("Stay signed in?" retention sheet) per the scrim rule (mobile drawer ⟺ desktop scrimmed modal). Screenshot‑verified; backdrop menu aligned to the live account (stale "Context questions" row removed).

**Note on `1248:104`:** it lives on page `184:4` demonstrated over a home frame — it is raised from the account menu's Sign out row (More → Account → Sign out on mobile), not from home. Treat home as the demo backdrop, not the trigger location.

**Design decision:** Sign out stays a single home at the foot of Account — **not** duplicated into the More sheet.

---

## C. Auto-height on body copy ✅

| Node | Was | Now (read-back) |
|---|---|---|
| `1805:95` (Data Room empty body) | h44 / NONE | **HEIGHT · h66** (3 lines) |
| `1271:197` (Sign-out body) | h30 / NONE | **HEIGHT · h42** (2 lines) |

Applied as the standing rule for body copy going forward — every new body box on the three A-frames was authored `textAutoResize:"HEIGHT"` from the start.

---

## D. Toast labels hug ✅

The three label nodes set to hug (`WIDTH_AND_HEIGHT`); cards re-sized to the row `15 · glyph 16 · 8 · label · 6 · action 60 · 15`, kept right-aligned (right edge held at 1424).

| Label | Card | Card width now |
|---|---|---|
| `1922:95` "Memory added" | `1922:93` | **215** |
| `1922:98` "Report generating…" | `1922:97` | **372** |
| `1922:101` "Couldn't reach the server" | `1922:99` | **278** |

The padding was not deliberate — widths now derive from the message.

---

## E. Mobile scrims unified ✅

**One fill, one extent, everywhere.** Both the outlier "Scrim" nodes and the shared `Drawer` now match §13 and `1885:151`:

- **Fill** — `rgba(0,0,0,0.42)` (42% pure black). The warm `#0a0605 @45%` on the two named nodes is gone.
- **Extent** — **y52, height 736** → starts below the bright brand bar, stops clean at the bottom nav's top edge (788). `1885:151`'s old 792 (running over the nav, which §10 forbids) is corrected.

Applied to `1236:2937` (More), `1248:129` (Sign-out), `1885:151` (Data Room locked), and the shared `Drawer` — so delete-file, feature-locked, More and sign-out all read identically.

> **Recovery note:** the first scrim sweep filtered on darkness/opacity and over-caught **8 dark title-bar rects** (z-index 1) on the Data Room mobile frames, dimming them. Detected via z-index analysis (real scrims sit at z12–17; title bars at z1) and screenshots. Reverted all 8 to #0b0b09 / opacity 1 / y52 / h58 and re-verified. Lesson logged: **discriminate scrims from chrome by z-index, never by colour.**

---

## F. Two hug glyphs centred ✅

- `1808:119` (empty-tray glyph) → **x176** (centre 195).
- `1812:97` + `1812:98` (desktop magnifier) → both shifted **left 1.4** (centre 400).

Centred rather than replicated, per your steer.

---

## G. Three radii normalised to 2 ✅

`1832:94/95/96` (skeleton bars, was 3), `1922:93/97/99` (toast cards, was 8), `1271:206` (Stay signed in, was 10) → **all r2**. `1271:198` (notifications layout card, 12) left on-scale as agreed.

---

## H. Six off-ramp greys ✅

| Value | Node | → merged to |
|---|---|---|
| `#9e9c99` | `1269:203` More chevron | **#9c9b98** (grey-400) |
| `#1a1817` | `1271:199` notify glyph outline | **#1a1a17** (grey-900) |
| `#ecebe9` | `1269:204` More row rule | **#ececea** (line-050) |
| `#e8e7e5` | `1832:93` loading card border | **#ececea** (line-050) |
| `#d4d3d0` | `1271:198` notifications card border | **#e2e1de** (line-200) |

Page-scoped sweep (`setCurrentPageAsync` first) caught the sibling More chevrons/rules on the same values, not just the three named nodes.

**`#e5e5e3` → new `fill/skeleton` token (Joy approved).** It is a **fill**, not a hairline: the skeleton-bar / progress-track shade. Added **`fill/skeleton` = `#e5e5e3`** to the Brand collection (scopes: frame/shape fill), and **bound all 51 uses** to it (9 Report Creation progress-tracks · 42 Documents skeletons) — **zero raw `#e5e5e3` fills remain** on live pages. Kept distinct from the line tokens by design.

---

## I. Text artefact ✅

`1791:96` → `5.1 MB · Uploading…` (single spaces around the separator).

---

## Still open from earlier rounds — cleared

Read-backs in the file:

| Flag | Status |
|---|---|
| **3** wallet balance font | Bottom-nav `625:41` = **DM Mono Medium 11** ✅ (matches the rail treatment) |
| **4** error colour / `--error` tokens | `error/default` + `error/subtle` **removed** in round 1; every error uses brand red ✅ |
| **5** title card radius | Master `659:2` ships **r2** — the "square (0px)" wording in the spec is stale; use 2 ✅ |
| **6** `accent-pressed` has no value | **Resolved** — `brand/accent-pressed` variable exists at **#be3530** (rgb 190/53/48) ✅ |
| **14** `692:2` docked input x76/w332 | `693:7` now **x80 / w358** ✅ |
| **15** "six sections" vs five | Copy set to **"five"** across the section screens in round 1 ✅ |
| **1** full drawer covers the nav | **Keep** — a full-screen composer is meant to take the viewport; not a scrimmed drawer, so §10 doesn't apply. |
| **2** peek drawer chrome drift | **One master** — reconcile the peek detent to the `628:5` Half/Full master. Flagged for the drawer-component pass; no per-frame patching. |
| **13** layout card radius 8 | **On-scale** — layout/overlay cards may be 8/12; not drift. Keep. |
| **16** between-breakpoint reflow | Data-only; the 390 and 1440 frames are the two authored breakpoints. No mid reflow to draw. |
| **24** Theater pane carousel vs docked input | **Confirm deliberate** — the carousel is the pane's content, the docked input is persistent chrome; both intended. No change. |

---

*Response by design session · 2026-08-14. Page `184:4` is fully built and verified. The only open dependencies are the un-drawn Account screen (`184:5`, carries the sign-out row) and the `#e5e5e3` → shared-fill-token call.*
