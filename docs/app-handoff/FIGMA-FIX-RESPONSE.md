> ⛔ **SUPERSEDED — folded into [`DEV-BRIEF.md`](DEV-BRIEF.md) (2026-08-19).** Kept for history. Do not build from this file.

# Caspr app — Figma reconciliation: design-session response

**Re:** `FIGMA-FIX-LIST.md` (2026-08-12) · **File:** `y2F394I4CwEeSzH2kKuDCt` · **Date:** 2026-08-12

Status per item: **✅ done in Figma** · **🟡 needs Joy decision** · **⏭ next pass** · **ℹ note**.
Re-match the ✅ items; the 🟡/⏭ are called out for a follow-up.

---

## §1 — New / changed screens

- **1.1 Generation — Mobile · failed** — ✅ **built** (`2002:2`). Chrome kept; report cards replaced by the desktop centre content; body sized for **3 lines** (66px) with gaps from its real height. **Drawer decision (Joy):** the failure **closes the drawer** — and the docked input + pane switcher are **removed** too (a stopped run has no report to Ask about). Clean state = message + Try again + Contact support + nav. Plus a new **Contact-support state** (`2011:11`): the Help message drawer opens over the (scrimmed) failed screen, REGARDING pre-set to **Analyses**, Subject pre-filled **"Generation stopped — UK EV market"**.
  - **Desktop `1827:2`** — ✅ body re-sized to **3 lines**; Try again → y500, Contact support → y560 (were ~22px high). 🟡 *the desktop failed still keeps its left-pane carousel + "Ask…while it works" input — same "while it works" staleness you flagged on mobile. Close those on desktop too, or keep the pane for context? (see decisions)*
- **1.2 Theater — Desktop · flap row** (`762:2`) — ✅ **added** the split-flap row (`M9K2X0Q8ZP`, DM Mono 11 `#73706b`) atop the desktop source list at its 26 pitch (y196, above IMF @ y222).
- **1.3 The Signal on compact needs room** (`971:71`) — ✅ **done.** Ported the full desktop evidence line (`812:34` — "The market's view — captured beyond the cited record: ~2,400 mentions…", Inter 10 / lh140% `#8b8a96`) 10px under the claim; card grew **96 → 160**. No siblings below it in the container, so no re-space needed.
- **1.4 "six sections" vs five cards** — ✅ changed copy to **"five"** on `692:2 · 708:2 · 694:2 · 1301:3280 · 1309:3280`. (`722:2` is the gate-confirm screen — it never carried that string.)
- **1.5 Intelligence SOON** (`708:63`) — ✅ added a small accent **`SOON`** after the Intelligence label. (Colours unchanged; non-interactive is a build behaviour.)

## §2 — Radius off the locked scale

- ✅ **Section cards** `692:129…` + `708:17…` (10 copies) **8 → 12** (master `1301:3294` already 12).
- ✅ **The Signal** `812:29` **10 → 2**.
- ✅ **Edit selection chip + 3 selects** `1125:7`, `1144:2904/2907/2910` **4 → 2**.
- ✅ **Generate Output add-card + queued rows** `1493:3`, `1493:7` **6 → 2**.
- ℹ Filter pills 100 — left as-is (it's a pill).

## §3 — Colour

- **3.1 Accent second value `#e9453c`** — ℹ **no Figma fix needed.** Scanned the whole file (all live pages): **0 nodes at `#e9453c`**. Figma is already `#e8453c`; the `#e9453c` you measured is a build-side/variable rounding — re-check the variable binding on your side.
- **3.2 Greys 4 → 15 / hairlines 4 → 8** — ✅ **applied (Joy: "fix the drift; Signal fine as-is").** Added token **`brand/grey-650 #8a8a85`** (the missing mid-grey); **re-pointed 31 nodes** — `#807d78`, `#73706b`, `#8c8a85`, `#8a8884`, `#6f6e6b`, `#5c5c57`, `#9e9e96` → nearest token, and hairlines `#d9d6d1`, `#e8e6e2`, `#dcdad6`, `#ebe8e3` → `#e0ded9` / `#ececea`. **Kept:** the Signal's cool greys (`#8b8a96` / `#6b6a78`), `#333330` report body, `#a5a29d` disabled. Consolidated table now in `design-guidelines.md §1`. Proposed mapping retained below for reference.
- **Housekeeping** — ✅ moved 4 components off the Tokens page onto **Components — Core**: `Floating Header — Page` `398:2`, `Report Card — Generating v3` `635:3`, `Action Overlay v3` `635:9`, `ToC Row v3` `635:34`.

**Proposed text greys — 15 → 6 (warm) + 2 (Signal cool, kept deliberate):**

| Token | Value | Absorbs (drift) |
|---|---|---|
| `text/primary` | **#1a1a17** | `#171716` |
| `text/body` (report body, darker) | **#333330** | — |
| `text/secondary` | **#5c5b58** | `#5c5c57`, `#6f6e6b`, `#6b6b66`, `#73706b` |
| `text/tertiary` | **#8a8a85** | `#8c8a85`, `#807d78`, `#8a8884` |
| `text/quaternary` (faint) | **#9c9b98** | `#9e9e96` |
| `text/disabled` (semantic) | **#a5a29d** | — |
| `signal/label` (cool, deliberate) | **#6b6a78** | — |
| `signal/secondary` (cool, deliberate) | **#8b8a96** | — |

**Proposed hairlines — 8 → 3:** `border` **#e2e1de** · `divider` **#e0ded9** (absorbs `#d9d6d1`, `#e8e6e2`, `#dcdad6`) · `rule-light` **#ececea** (absorbs `#ebe8e3`, `#f2f1ef`).

**Deliberate (keep):** the Signal's cool-grey family (`signal/*`) — it *is* a different kind of content, so the cool tint is a signal, not drift. Everything else above is drift → collapse. Say the word and I'll re-point every affected node.

## §4 — Type / component drift

- ✅ **Apostrophes** `1527:7495` straight `'` → curly `'`.
- ✅ **Commit button** `924:24` Semi Bold 13.5 → **Inter Medium 14**.
- ✅ **Wallet balance** bottom-nav `625:41` Inter Medium → **DM Mono** (Medium 11).
- ✅ **Docked input slot** `692:2` `693:7` x76/w332 → **x80/w358**.
- ✅ **Report paragraph leading** `812:26` + `812:28` → matched `812:35` (155%).
- ✅ **Pane heading** unified to **14 / `#474642` / 0.3** — fixed Contents `1446:157` (was 13/`#1a1a17`/2) and Theater `763:78` (`#47463f`→`#474642`).
- ✅ **Pane content column** — Generate Output `923:2419` content shifted to **x24 / 342** (heading, subtitle, add-card, output rows; config card `929:2` was already right; ‹Back re-aligned).
- ✅ **Title card radius** — master `659:2` already 2; §5 "square (0px)" wording is stale. No change.
- ✅ **Removed dead tokens** — `error/default` + `error/subtle` deleted from the Semantic collection.
- ⚠️ **Ask inset — NOT applied, needs your call.** The "input at 16→374" is the **standard 358-wide `Docked Input Bar`** (`945:12`, used file-wide) — narrowing it to 342 would break that shared component. The right fix is **widening the Ask pane's divider rules to 358** to match the standard input; point me to those rule nodes (I couldn't locate them on `944:1394`) or confirm you want the input narrowed.
- 🟡 **User-bubble treatments · Theater node sizes (frames→spec) · Outputs feed rhythm** — still need your eyes (genuine "confirm deliberate").
- ℹ **accent-pressed** — the Tokens swatch `8:17` already documents **`#be3530`**; there's no *variable* though. Bind to that hex, or keep the ~12% build filter — your call (no Figma change made).

## §1 addendum — desktop failure flow

- **Generation — Desktop · failed · Contact support** (`2044:9`) — ✅ **NEW.** Desktop parallel of the mobile `2011:11`: failed screen behind a scrim, a **centred message-support modal** (ported from the desktop Help form), **REGARDING = Analyses** pre-selected, **Subject** prefilled "Generation stopped — UK EV market". Per the scrim rule (mobile drawer ⟺ desktop scrimmed modal). The desktop failed base (`1827:2`) keeps its left pane for context (Joy, 2026-08-12).

## §5 — Small open values

- 🟡 **`accent-pressed` hex** · **`--error` / `--error-subtle` removal** · **Full drawer over nav** · **peek-drawer chrome vs `628:5` master** — all need a Joy call. Defaults suggested below.

---

## Suggested defaults for the 🟡 items (apply on your nod)

| Item | Suggested |
|---|---|
| Pane heading | one style: **14 / `#474642` / 0.3** (the five-pane majority) |
| Pane content column | **x=24 / 342** (five panes vs one) |
| Report paragraph leading | **20** |
| Ask inset | **16 → 358** (match the divider rules) |
| Title card radius | **2** (master `659:2` ships 2 — square wording in §5 is stale) |
| Theater node sizes | **frames win**; update `theater-visualization-spec.md` §3–6 to match |
| Outputs feed rhythm | one pitch if it was meant regular; else keep as data |
| User bubble (3) | confirm each deliberate, or pick — needs your eyes |
| `accent-pressed` | confirm the ~12% darken filter, or supply a hex |
| `--error` tokens | **remove** (every error uses brand red) |
| Full drawer over nav | keep (it's a full-screen composer) — or move the frame |
| Peek-drawer chrome | one master (`628:5`) for all three detents |
| Greys | collapse to ~5 text + 2–3 hairlines; I'll propose a mapping if you want |

---

*Response by design session · 2026-08-12. ⏭ items (1.2, 1.3) queued for the next pass.*
