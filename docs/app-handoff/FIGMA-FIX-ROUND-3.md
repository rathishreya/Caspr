> ⛔ **SUPERSEDED — folded into [`DEV-BRIEF.md`](DEV-BRIEF.md) (2026-08-19).** Kept for history. Do not build from this file.

# Caspr app — Figma fix list, round 3

**For:** the design session · **File:** `y2F394I4CwEeSzH2kKuDCt`
**From:** the dev session · **Date:** 2026-08-13

---

## What this is

Round 2 landed almost everything. `2044:9` is built, the pane headings are one
style, Generate Output is on the shared column, `accent-pressed` is bound to
`#be3530`. Thank you — those all re-matched cleanly.

What is left is **node-level and specific**. Every item below names the exact
nodes and the exact target value, so none of it needs a judgement call. They are
ordered by how much they cost the build.

**One process note, said once and not laboured:** three rounds have now reported
a fix as applied where the file still carries the old value. It is always the
same shape — the **component master** gets fixed and the **hand-drawn copies on
the screens** do not. Everything below was re-measured in the file on 13 Aug, not
read off the previous report. Worth running a "select all with this fill" sweep
per value rather than fixing the master and assuming instances follow, because on
these screens most of them are not instances.

---

## 1. The greys — the collapse has not reached the screens

`FIGMA-FIX-RESPONSE.md` §3.2 reports 31 nodes re-pointed and the ramp collapsed
to six warm + two cool. **Measured in the file today, the screens still carry the
old values.** These are the nodes, current value on the left, the response's own
target on the right:

| Node | What it is | Still | Target per §3.2 |
|---|---|---|---|
| `812:23` | Report page index | `#5c5c57` | `text/secondary` **#5c5b58** |
| `1301:3298`, `1301:3300` | Layout-card bullets | `#807d78` | `text/tertiary` **#8a8a85** |
| `2002:161` | Generation-failed body (compact) | `#6b6b66` | `text/secondary` **#5c5b58** |
| `1827:196`, `2044:63` | Generation-failed body (desktop) | `#6b6b66` | `text/secondary` **#5c5b58** |
| `762:162` | Theater `SOURCES REVIEWED` | `#73706b` | `text/secondary` **#5c5b58** |
| `1144:2906` + siblings | Edit select carets | `#8a8884` | `text/tertiary` **#8a8a85** |
| `971:73` | Compact report body | `#171716` | `text/primary` **#1a1a17** |
| `926:2495` group | Outputs filenames | `#171716` | `text/primary` **#1a1a17** |
| `1194:377` | Onboarding footer | `#6f6e6b` | `text/secondary` **#5c5b58** |
| `1144:2904` + siblings | Edit toolbar rules + select borders | `#dcdad6` | `divider` **#e0ded9** |
| `1446:172` | Contents sub-section rule | `#f2f1ef` | `rule-light` **#ececea** |
| `1099:15` group | Updates row dividers | `#e8e6e2` | `divider` **#e0ded9** |
| `628:5` | Drawer top edge | `#d9d6d1` | `divider` **#e0ded9** |

**Two greys are not on the §3.2 map at all** — please rule on them rather than
leaving them to be discovered:

- `1301:3316` / `1301:3317` — the **pending** section title and index on a layout
  card, `#b8b5b0`. Lighter than `text/quaternary`. Deliberate "not yet drafted"
  state, or drift?
- `2011:26` and `2044:68` — the two new **MESSAGE SUPPORT** headings, `#47463f`,
  where §4 just unified every pane heading on `#474642`. Three units apart. The
  build ships `#474642` on both; please align the frames.

**And one that moved onto a value the map says should not exist:** `724:35` and
`2025:2` (the split-flap rows) went `#73706b` → **`#6b6b66`**, but `#6b6b66` is
itself on the absorb list. They should be `#5c5b58` if the collapse holds.

**What changed and is already in the build:** `673:4`/`673:5` → `#8a8a85`,
`673:6` → `#ececea`. Those two re-matched.

### 1b. A second accent-style one-unit drift

The `Filter Pill v3` instances on both Help composers (`2011:38/40/44/46/48`,
`2044:79/81/85/87/89`) carry a **`#e2e1df`** border where the `border` token is
**`#e2e1de`**. Exactly the `#e9453c` / `#e8453c` shape from round 1 — one unit,
invisible, but it makes the token unusable. Please set them to `#e2e1de`.

---

## 2. The 0.895 scale artefact — now on four nodes, not two

`2011:30`, `2011:33`, `2044:72`, `2044:75` — the subject and message fields on
both Help composers — are a **1 / 4 / 14 / 13 field scaled to 0.895** inside an
unscaled parent:

| Property | Drawn | Should be |
|---|---|---|
| Border width | 0.895px | **1px** |
| Corner radius | 3.58px | **2** (`radius/edge`) |
| Font size | 12.53px | **14** |
| Text inset | 11.63px | **13** |

Sub-pixel borders do not paint and 3.58 is not on the radius scale, so the build
ships 1px and radius 2 on all four. **The desktop pair is new** — `2044:9` was
drawn after this was flagged, so the artefact was copied forward rather than
fixed. Please reset the source field once so it stops propagating, then re-place
the four instances.

Same screen, one smaller thing: **`2011:11` draws the failed screen behind the
scrim 31px higher than `2002:2` does** (glyph 269 vs 300, and so on down). It is
invisible behind the drawer, but they should be the same screen. Built from
`2002:2`.

---

## 3. `1493:7` was resized without reflowing — introduced by the column move

Moving Generate Output onto x=24/342 shrank the queued-output cards from 358 to
342, but **their children kept their 358-era x**:

| Node | Drawn | Result in a 342 card |
|---|---|---|
| `1493:11` (the `×`) | x=336, w=16 | ends at **352 — 10px outside the card** |
| `1493:10` (the price) | right edge 326 | right inset silently **32 → 16** |

`1493:12` and `1493:17` are the same card and need the same sweep.

**Target:** keep the master's insets — price right edge **32** from the card's
right edge, `×` right edge **7**. That is what the build ships, because a control
drawn outside its own card is a resize artefact rather than a design. Please
confirm by fixing the nodes.

---

## 4. `924:24` — the label box is 342 inside a 358 button

The commit's text layer is 342 wide, left-aligned at x=0 in a 358 button, so its
centred label sits **8px left of the button's centre**. A leftover from when the
button was 342. The build centres it in the button.

Either widen the text layer to 358 at x=0, or centre it — but the button itself
should stay at **80 / 358**: that is the frame-level docked slot every paned
screen uses, and it is correctly *not* the pane's 88/342 content column.

---

## 5. Ask on compact — widen the divider rules, not the input

**Joy agrees with your read, so this is a decision, not a question:** the 358
`Docked Input Bar` (`945:12`) is right and must not be narrowed — it is the
shared component and every screen depends on it. **The divider cluster is what
moves.**

You could not find the rule nodes because they are on the compact Ask *drawer*,
not the desktop pane. They are on **`944:1400`** ("Bottom Drawer (Half — Ask
Caspr)"):

| Node | What | Drawn | Problem |
|---|---|---|---|
| `1020:12` | left rule | x=16, w=88 → ends 104 | fine |
| `1020:13` | `REPORT GENERATED · 13 JUL` | x=116, w=143 → centre **187.5** | centred on 342, not 358 |
| `1020:14` | right rule | x=271, w=87 → ends **358** | should end at **374** |

The whole cluster is set to a 342 measure (16→358) while the input above it spans
16→374. Two ways to land it on 358, both fine — pick one and the build follows:

- **Keep the 12px gaps:** leave `1020:12` and `1020:13` where they are, and set
  `1020:14` to **x=271, w=103** (ends 374). The rules end up unequal, 88 vs 103.
- **Keep the rules equal:** `1020:12` x=16 w=88; `1020:13` re-centred on **195**,
  i.e. x=**123.5**; `1020:14` x=**286**, w=88 (ends 374). Gaps become 19.5.

Worth checking the same cluster on the other compact Ask frames while you are in
there.

---

## What happens after

Same as before — send it back with what is done and what you are deliberately
keeping, and the build re-measures every affected screen in one pass. The greys
are the only item with real cost: until the screens carry the collapsed ramp, the
token file has to keep the wide palette, because the build matches frames rather
than intentions.

Running per-item detail: `QUESTIONS-FOR-JOY.md` §21–25.
