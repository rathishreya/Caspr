> ⛔ **SUPERSEDED — folded into [`DEV-BRIEF.md`](DEV-BRIEF.md) (2026-08-19).** Kept for history. Do not build from this file.

# Caspr app — Figma final pass

**File:** `y2F394I4CwEeSzH2kKuDCt`
**Reference:** your own `FIGMA-FINAL-ALIGNMENT.md` — it is the locked system and nothing below overrides it except Part 1, which Joy has ruled on.
**Date:** 2026-08-14

Process notes, unchanged: `setCurrentPageAsync` before any sweep · read every node back after an edit · **a `use_figma` call that throws rolls back every edit in that call**, so guard `if ("cornerRadius" in n)` and split batches.

---

## Read this first

The **code build is complete** — all six pages, both breakpoints, measured to zero delta. `184:6` Insights was built today, which is the last one.

So this is not a build request. It is the file catching up to three things:

1. **One ruling that reverses your §5.** Part 1. Do this one first; it is the only item where the file would otherwise be changed in the wrong direction.
2. **The only frames that genuinely don't exist.** Part 2 — Insights' four states, and three Data Room mobile halves. Everything else in the app is drawn.
3. **Two pages that were never swept** to the locked system, because reconciliation happened on `184:4` and `184:5` where we were measuring. Part 3.

Parts 4–6 are confirmations and long-tail judgment calls.

---

## Part 1 — 🔴 Joy's ruling reverses `FIGMA-FINAL-ALIGNMENT.md` §5

**Do not send `#2e7d33` to accent.**

Your §5 lists `#2e7d33` (×3) as a stray green and §1.1 reserves green for the `+$X` ledger credit, so the pre-flight action was `#2e7d33` → `accent`. I built that, and flagged the consequence: it makes rising and falling deltas the same colour on `1231:2860`, leaving `▲`/`▼` as the only carrier of direction — on the one page whose entire job is showing market movement.

**Joy, 2026-08-14: "red and green for up/down is the convention — we should follow it."**

### What to change

| Node | From | To |
|---|---|---|
| `1261:105` · `1261:108` · `1261:111` | `#2e7d33` | **`#1a7f4b`** (`credit-green`'s value) |

Not accent. The point is **one green, two roles** — two greens 20 apart in hue was the drift §1.1 set out to kill, and that problem is solved by unifying the *value*, not by removing the role.

The build carries this as a token named for its own role, `--color-market-up`, deliberately holding `#1a7f4b`. If you want a matching Figma variable, `market/up` = `#1a7f4b` aliased to the same value is the shape — but a plain hex match is fine.

### §1.1 wants restating

Current wording ("signed amounts only — the `+$X` credit in a ledger. **Never** a feature tick or status") no longer covers the case. Proposed:

> **`credit-green` `#1a7f4b`** — a **positive signed quantity**: ledger credits and upward market movement. Never a tick, a status, or a feature marker; those are `accent`. The paired downward value is `accent`.

---

## Part 2 — 🔴 The only frames that don't exist

### 2a · Insights `184:6` — four states, both widths

`184:6` holds exactly two frames, both the coming-soon base. Your §5 says to draw the 390 siblings as it gets built. **It is now built**, so these are the gap:

| State | Desktop | Compact | Why it exists |
|---|---|---|---|
| **Loading** | needed | needed | The KPI/chart/feed shell before the first payload lands |
| **Empty** | needed | needed | Filters set, nothing matched yet |
| **Error** | needed | needed | The live feed drops — this is a *streaming* surface, so it will happen |
| **No results** | needed | needed | Filters set so narrow nothing qualifies |

Same reason the Data Room needed three drawn in round 4: without frames I either invent them or ship dead screens, and both break hard rule 1.

**Precedent to reuse rather than invent:** the Data Room's ramp (`1808:2` empty · `1832:2` loading · `1812:2` no-results · `1809:2` failed) already establishes the type scale, measure and vertical rhythm for this exact set. Insights differs in one way worth deciding explicitly — **the pane stays live in every state**, because the filters are what a user came to set. Only the centre changes.

Also apply §5's own list while you are in there: retire `#0f0e0d`, `#deddda`, `#e9e8e6`, `#e6e5e2` (×16), `#0a0605`; resolve `1246:124`–`129` (r1) and `1253:121`–`139` (r3) to the 0/2 scale.

### 2b · Data Room — three compact frames (open since §30a, round 4)

`1812:2` (no results), `1832:2` (loading) and `1851:2` (search results) exist at 1440 only. A phone reaches all three, so I built them from the compact ramp `1808:2` establishes plus the card geometry from `1784:304`. **Those three compact halves are derived, not drawn.** Three frames confirm or correct them.

---

## Part 3 — 🟡 The two pages never swept

`184:4` and `184:5` converged over five rounds because that is where we were measuring. `184:2` and `184:3` got partial passes only. Run the seven-check sweep (`FIGMA-FINAL-ALIGNMENT.md` §3) over each.

### 3a · `184:2` Report Creation

Greys, eyebrows and body auto-height were swept in round 5. Still to verify:
- **Radius per B2** — this is the one that will find things. B2 moved content and layout cards from 12 down to **2**, and `184:2` is where most content cards live: the Layout section cards, the gate rows, the Outputs feed, the Edit proposal cards. Known off-scale already: **section cards on `692:2` and `708:2` are radius 8** (open since §13).
- **Scrims** — 42% black, mobile y52 h736, named `Scrim`.
- **DM Mono on every figure** — the gate totals and the Outputs metering are the likely misses.
- `692:2`'s docked input is at **x=76 / w=332** where every other paned frame uses **x=80 / w=358** (§14).

### 3b · `184:3` Onboarding

Eyebrows were bound in round 5. Still to verify:
- **Auth-card radius** — overlay cards **12**, every control inside them **2**. Onboarding predates the radius scale and was the page that blocked the Login build once already (§8).
- **Auto-height** on body copy.
- **Scrims** on the signup and gate overlays.
- The **mobile accelerator cards are a uniform scale-down** landing type at ~9.7px (§11) — the same 0.895 artefact, and this is its last home.

---

## Part 4 — 🟡 Components and tokens

### 4a · Masters carry the locked values

Confirm the masters, so instances inherit rather than drift: drawer `628:5`, rail, bottom nav, toast, title bar. The drawer is the one that matters most — §1.4's top-edge-only border and the `628:3` handle need to be on the **master**, or the next instance re-introduces the peek drift.

### 4b · Publish the four new variables

Per §2 — `fill/skeleton` `#e5e5e3` · `fill/chip` `#ededeb` · `text/label` `#474642` · `brand/accent-pressed` `#be3530`. The build carries all four. Add `market/up` `#1a7f4b` if you take that option in Part 1.

Also drop any remaining wide-grey swatches so the ramp is the only source.

---

## Part 5 — 🟡 Three things measuring turned up

**(a) The first feed rule breaks the row rhythm by 8.** On `1231:2860`, feed rows sit at 444 / 524 / 604 / 684 — a clean 80 pitch. Their dividers sit at **428 / 516 / 596 / 676** — gaps of **88, 80, 80**. `1247:107` is 16 above its row where `:114` / `:121` / `:128` are 8 above theirs. I matched it as drawn and carried it per-row so nobody "fixes" it back. **Move `1247:107` 428 → 436** if it is a slip; say so if the extra air above the first row is intended.

**(b) The peek radius: 16 or 20?** §1.4 locks drawer top corners at **20**. The three persistent peek sheets in the build were at **16**. I moved them to 20 to follow the locked value. If peeks were deliberately tighter than a half drawer, that intent is now gone — confirm either way.

**(c) §1.4's drop shadow has no number.** "A top drop-shadow carries lift" is the whole spec. I used `0 -2px 16px rgb(0 0 0 / 0.06)`, which is what the hand-built peeks already carried, and applied it to all three detents. Send the master's value if it differs.

---

## Part 6 — 🟡 Four judgment calls open since round 2

These have each been "built as drawn, flagged" for several rounds. They are not blocking anything; they are places where the file may be carrying drift that nobody has ruled on. **A one-line answer each closes them permanently.**

1. **Three user-bubble treatments.** Ask Caspr `865:2` is filled `#edece9`, no stroke, 13/20 at 12/8. The pane conversation is white with an `#e5e3de` hairline at 12.5/15. The Conversation screen is a fixed 340×40 block with an `#e0ded9` hairline at 14/18. Deliberate per-surface, or collapse to one?

2. **Contents' pane heading is a fourth style.** Inter Semi Bold **13** `#1a1a17` at **0.26** tracking, where every other pane heading is **14** `#474642` at **0.3** (now `text/label`). Deliberate, or bind it?

3. **Theater node sizes are ~1.3× the spec.** The frames draw hub 44 / locked 20 / idle 12 / lines 2px; §3–6 scaled to 390 would give 33 / 15 / 8.4 / 1.5. I followed the frames. If the spec was meant to win it is four numbers in `layout.ts` — but then the frames want redrawing.

4. **The Outputs feed rhythm is hand-set.** Gaps down `831:2242` are 19, 19, 10, 14 with no derivable rule, so they ship as per-item data. One pitch would make the list generative rather than a fixed composition. Also: the pane is titled **OUTPUTS** while the frame is named "Versions" (I shipped Outputs, matching the switcher), and its commit is Semi Bold 13.5 where every other commit in the build is Medium 14.

---

## What "done" looks like

- Part 1 applied — the one item that would otherwise move the file the wrong way.
- Parts 2a and 2b drawn — after which **every screen in the app has a frame**, which is not true today.
- Parts 3a and 3b swept — after which all six pages are on one locked system.
- Parts 4–6 answered.

Reply in the same shape as `FIGMA-FIX-ROUND-5-RESPONSE.md`: a table of what changed with node IDs, and your own calls marked as calls. That format has caught two of my errors already.

*Prompt from the build session · 2026-08-14.*
