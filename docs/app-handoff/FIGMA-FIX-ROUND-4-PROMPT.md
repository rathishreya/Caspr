> ⛔ **SUPERSEDED — folded into [`DEV-BRIEF.md`](DEV-BRIEF.md) (2026-08-19).** Kept for history. Do not build from this file.

# Figma fix — round 4

Everything below comes from building the Data Room's nine remaining states and
the three shell odds (More, Sign-out, Toasts) against the file, and measuring
each one in the browser. Page `184:4` is now fully built, so these are the last
things on it that need a design decision rather than a code change.

All node IDs are in `y2F394I4CwEeSzH2kKuDCt`, page `184:4` (Product App).

---

## Before you start — two process notes

**1. `page.findAll` lies on a non-active page.** Under dynamic page loading it
returns incomplete results, which is what made rounds 1 and 2 report 31 nodes
re-pointed when the screen copies were untouched. Call `setCurrentPageAsync`
first, always, before any sweep.

**2. Verify before reporting.** After each edit, re-read the node and paste its
**actual** value back. "Done" without a read-back is what cost us two rounds.

---

## A. Three states have no mobile frame — please draw them

These exist at 1440 only. A phone reaches all three, so they are built, but
their compact halves are **derived, not drawn** and I would rather match a
frame than my own inference.

| Missing | Desktop source | What it needs |
|---|---|---|
| Data Room — Mobile · search no results | `1812:2` | 390 sibling |
| Data Room — Mobile · loading | `1832:2` | 390 sibling |
| Data Room — Mobile · search results | `1851:2` | 390 sibling |

What I built them from, so you can confirm or correct:

- the compact state ramp from **`1808:2`** (mobile empty) — glyph, then a
  **25px** Instrument Serif headline, then **14/21** body on a **330** measure,
  all centred;
- the compact file card from **`1784:304`** — 358×64, glyph 17, text 42, tag to
  a 318 right edge;
- search field 16/126, 358×**44**, as every other compact Data Room frame draws.

---

## B. Nothing in the file opens the sign-out sheet

`1248:104` is drawn over Welcome, but no frame anywhere has the control that
triggers it. The rail and the More sheet (`1236:2860`) both end at `Account`,
and Account lives on page `184:5`, which isn't drawn yet.

**Please add the trigger** — most likely a row at the foot of the Account
screen — or tell me where it should live. It is on a bare `/sign-out` route
until then, which is not a real entry point.

---

## C. Body copy boxes are drawn a line short (auto-height is off)

Two more instances of a thing that has now come up six times. The text box is
sized to fewer lines than the copy actually sets to, so anything measured off
its bottom edge lands wrong.

| Node | Box | Copy actually sets to | Screen |
|---|---|---|---|
| `1805:95` | h **44** (2 lines) | **3** lines — 15/22 in a 420 measure = 66 | Data Room empty |
| `1271:197` | h **30** | **2** lines — 15/21 in a 342 measure = 42 | Sign-out |

Neither collides with what sits below it, so nothing is broken — but the boxes
are lying about the layout.

**Please turn auto-height on for body copy across the file** rather than fixing
these two. Every previous instance was the same root cause.

---

## D. Toast label boxes are hand-padded, so the card widths aren't derivable

The toast card is a clean row and all three drawn widths fall straight out of
it: `15 · glyph 16 · 8 · label · 6 · action 60 · 15`. The problem is the label
boxes are much wider than their text:

| Label node | Box width | Text measures | Card | Card width |
|---|---|---|---|---|
| `1922:95` "Memory added" | 160 | **94** | `1922:93` | 282 |
| `1922:98` "Report generating…" | 420 | **343** | `1922:97` | 452 |
| `1922:101` "Couldn't reach the server" | 178 | **157** | `1922:99` | 300 |

The slack is 66 / 77 / 21 — no rule to it. A real toast has to size to its
message, so the component hugs, which makes it exactly that much narrower than
each drawn card. Every anchor (15 / 39 / right 15 / 38 tall) is exact.

**Please set the three label nodes to hug**, so the card widths follow from the
row. If the padding is deliberate, tell me the rule and I'll build to it.

---

## E. Mobile scrim — three frames, two values, two extents

| Node | Fill | y | Height |
|---|---|---|---|
| `1236:2937` (More) | `#0a0605` @ **45%** | 52 | **740** |
| `1248:129` (Sign-out) | `#0a0605` @ **45%** | 52 | **740** |
| `1885:151` (Data Room locked) | `rgba(0,0,0,0.42)` | 52 | **792** |

`design-guidelines.md` §13 says **42% black**, which is what the app ships and
what `1885:151` agrees with — so the two nodes actually *named* "Scrim" are the
outliers.

All three start at **52**, leaving the brand bar bright, which reads as
deliberate and matches §10 (persistent chrome is not what's being interrupted).
I corrected the shared `Drawer` to match, so this now affects **every** scrimmed
mobile drawer — delete file, feature locked, More, sign-out.

**Please make all mobile scrims one fill and one extent.** Two specifics:

1. **Fill** — 42% black everywhere, per §13 and `1885:151`? (my assumption)
2. **Height** — 740 leaves the bottom nav's **top 4px** under the scrim. **736**
   would stop clean at the nav's top edge (788). And `1885:151`'s 792 runs to
   the floor, over the nav, which §10 forbids. 736 for all three?

---

## F. Two hug-content glyphs sit off the column centre

Not centred, by a hair, because each node is hug-sized independently.

- **`1808:119`** (empty-tray glyph, mobile) — spans 178–216, centre **197**
  against the column's 195. Set `x` to **176**.
- **`1812:97` + `1812:98`** (magnifier ring + handle, desktop) — the pair spans
  384–418.75, centre **401.4** against 400. Group them and centre, or shift both
  left 1.4.

I replicated both rather than centring them, so the build currently matches the
frame. Say the word and I'll centre instead — I'd expect that's what you want.

---

## G. Three radii break the rule you already settled

Flag 8 is resolved as **radius 2 everywhere except confirmation overlays**.
These three are neither 2 nor confirmation overlays:

| Node | Radius | What it is |
|---|---|---|
| `1832:94` / `95` / `96` | **3** | loading skeleton bars |
| `1922:93` / `97` / `99` | **8** | toast cards |
| `1271:206` | **10** | `Stay signed in` button |

(`1271:198`, the notifications card at 12, is on the scale — layout card. Fine.)

Shipped as drawn. **Please either normalise them to 2 or tell me they're
intentional exceptions**, so the rule stays a rule.

---

## H. Six new greys off the collapsed ramp

The 13 Aug collapse got us to 6 greys. These six have appeared since. Nearest
ramp value in each case, for merging:

| Value | Where | Nearest ramp |
|---|---|---|
| `#9e9c99` | `1269:203` More chevron | `grey-400` **#9c9b98** — merge |
| `#1a1817` | `1271:199` notify glyph outline | `grey-900` **#1a1a17** — merge |
| `#ecebe9` | `1269:204` More row rule | `line-050` **#ececea** — merge |
| `#e8e7e5` | `1832:93` loading card border | `line-050` **#ececea** — merge? |
| `#e5e5e3` | `1832:94–96` skeleton + `1791:101` progress track | it's a **fill**, not a line — wants one shared fill token, not a line value |
| `#d4d3d0` | `1271:198` notifications card border | between `line-200` #e2e1de and `#cccbc8` — needs a call |

The first three are within 1–2 of a ramp value and should just merge.

---

## I. One text artefact

**`1791:96`** reads `5.1 MB  ·  Uploading…` with **double** spaces around the
separator. Every other row on the screen uses single. Built with single —
please fix the node, or tell me the wide separator was deliberate.

---

## Still open from earlier rounds

Not part of this build, but a design session may as well clear them:
flags **1** (full drawer covers the nav), **2** (peek drawer chrome drifted from
the Half/Full master), **3** (wallet balance font differs between the two navs),
**4** (error colour: brand red vs the `--error` tokens), **5** (title card
radius: spec says square, master says 2), **6** (`accent-pressed` has no value),
**12–16** (conversation rhythm, layout card radius 8, `692:2` docked input
x=76/w=332, "six sections" but five drawn, between-breakpoint reflow), **24**
(Theater pane carousel vs its docked input).

Full detail on each in `QUESTIONS-FOR-JOY.md`.
