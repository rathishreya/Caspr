> ⛔ **SUPERSEDED — folded into [`DEV-BRIEF.md`](DEV-BRIEF.md) (2026-08-19).** Kept for history. Do not build from this file.

# Figma fix — round 5

Round 4 landed properly: every claim in `FIGMA-FIX-ROUND-4-RESPONSE.md` was
re-read in the file before I built to it, and every one held. Thank you for the
z-index recovery note on the eight title bars — `1796:4` is back to `#0b0b09`.

Since then, pages **`184:4`** and **`184:5`** are both **complete** — every
screen built and measured against its frame. This round is what that turned up.

Four parts, all actionable:

- **Part A** — twelve fixes that need no decision.
- **Part B** — five rulings Joy has now made (2026-08-14). Instructions, not
  questions.
- **Part D** — the node-level edits those rulings imply. **The build already
  follows all five, so the file is behind on every one.** This is the list that
  makes them converge again.
- **Part C** — pre-flight for page `184:6` (Insights), the next build.

One thing to be clear about: Part D is the first time the code is deliberately
*not* pixel-identical to a frame. That is by decision, not by drift — each entry
names the ruling it follows.

Same two process notes as always: `setCurrentPageAsync` before any sweep, and
read the node back after every edit.

---

# Part A — twelve fixes, no decision needed

## A1. The mobile toasts kept radius 8

Round 4 normalised the three desktop cards to 2 but not their mobile twins.

| Node | Now | Should be |
|---|---|---|
| `1928:142` (error + Retry) | **8** | 2 |
| `1928:139` (Budget topped up) | **8** | 2 |

One component cannot carry two radii across breakpoints, so the build already
ships 2 at both widths. Bring the file in line.

## A2. `#e5e5e3` wants a named fill variable

Your call in round 4 item H, and I agree: it is a **fill**, not a hairline, so
it stays off the line ramp. It is `--color-fill-track` in code. Give it a
variable — `fill/skeleton` or `fill/track`. Used by `1832:94`–`97`,
`2072:2385`–`2387` (and the same three on `2072:2388`/`2392`/`2396`), and
`1791:101`.

## A3. `2071:2231` names a file that is not in the Data Room

The compact search-results frame shows `market-sizing-model.xlsx` as the hit for
`market`. That filename appears nowhere else in the file — so the screen shows a
library that does not contain its own search result.

Point it at **`market_data_2026.csv`** (meta `640 KB · Jul 8, 2026`, tag
`PUBLIC`, 50 wide), which is what desktop `1851:19` uses and what the build
shows at both widths.

## A4. `1808:121` missed the auto-height sweep

Round 4 turned auto-height on for `1805:95` and `1271:197`. This one is still
fixed at h**44** where the copy sets to **42** (14/21 in a 330 measure). Two
pixels, but it is the same node class the rule was adopted for. Sweep `184:4`
and `184:5` for any other fixed-height body box while you are in there.

## A5. Four frames still scrim at the old extent

Round 4 unified mobile scrims to y52 **h736**. These four were not in the sweep
and still read **h792**: `1658:117` · `1662:21` · `1662:73` · `1658:172` (the
account confirmation drawers). The shared `Drawer` uses 736, so the build is
right and the frames are behind.

## A6. A stale pane copy in the four confirmation frames

`1646:2` / `:54` / `:106` / `:158` carry a **`Context questions`** row
(`1646:30` and siblings) in their account pane that `1596:2` no longer has,
which pushes Security from 278 to 306 and every rule after it. `1596:2` is the
current pane; those four are older copies. Built to `1596:2`.

## A7. Three `Danger card` copies to delete

`1698:64` · `1700:29` · `1864:60` — 358×136 frames at 16/398 sitting under the
content of the two-factor, password and sign-out-device drawers.

**Correcting myself:** I earlier called these "drawn by nothing". Half wrong —
the card is **real**, it is `1691:2` on compact Security (`1686:2`), the third
card, carrying Reset and Delete account. It is built. These three are copies of
it left behind in drawers where nothing draws them. Delete the copies only.

## A8. The 0.895 scale artefact, in nine more fields

`1698:32` · `1700:42`/`45`/`48` · `1884:134`/`138` · `1667:165` · `1672:219` ·
`1711:161` all render **39.38 tall / 12.53 type / 12.53 inset**, which is
44 / 14 / 14 scaled by 0.895. Shipped as drawn per the earlier agreement, but
the count keeps growing — a find-and-reset across both pages would end it.

## A9. Two hug-placed glyphs off the column centre

Round 4 centred `1808:119` and `1812:97`/`98` at Joy's steer. Two more of the
same:

- **`1834:99`** (desktop research-profile empty star) — ~4 right of centre.
- **`1811:103`** (its compact twin) — ~3 right of centre.

Both are centred in the build, per the round-4 precedent.

## A10. Three greys

- `#ecebea` (`1736:139` and the depth track) is **one value off** `#ececea` =
  `line-050`. Merge.
- `#47463f` (the `SHARPEN YOUR PROFILE` / `MEMORIES` eyebrows) is genuinely new
  and now a token — give it a variable.
- `#ededeb` (the `DEFAULT` card chip, `1878:129`) likewise.

## A11. The peek-drawer pass (flag 2) is still outstanding

You closed this as *"one master — reconcile the peek detent to the `628:5`
Half/Full master. Flagged for the drawer-component pass."* Agreed on the
approach; the pass has not happened. The 24 peek frames agree with each other
and disagree with `628:5` on four properties, so the code still carries peek as
a separate detent:

| Property | Peek (24 frames) | `628:5` master |
|---|---|---|
| Handle colour | `#d3d1c7` | `#c7c4bf` |
| Handle radius | 3 | 2.5 |
| Handle top | 9 | 11 |
| Border | full hairline | top edge only |

Reconcile and I collapse the two shells into one. If any of the four is
deliberate, say which.

## A12. One note, not a defect

The round-4 response described the compact no-results body as **15/22**. The
frame (`2073:2351`) is **14/21**, which is what makes its h42 box correct. The
file is right; only the prose slipped. Flagged so nobody builds from a summary.

---

# Part B — five rulings, now decided

**Joy has ruled on all of these (2026-08-14) and the build already follows.**
Instructions, not questions. Part D lists the node-level changes that close the
gap between the file and the build.

## B1. Green — the first non-accent hue in the app

`#1a7f4b` does two jobs on the Wallet:

| Where | Node | Marks |
|---|---|---|
| `+$186` in the ledger | `1623:61` | money coming **in** |
| Plan-feature ticks | `1553:15`, `1553:21`–`29` | a feature you get |

The Data Room's upgrade card draws that second meaning in **accent**
(`1885:98`–`104`). Same semantic, two colours, two screens.

**RULED: green for signed amounts only.** A credit is a quantity and
red-for-money-in is actively wrong, so the ledger keeps `#1a7f4b`. A tick
meaning "you get this" is not a quantity — the Wallet's plan ticks go to
**accent**, matching the Data Room. The palette stays Black · White · Red with
one semantic exception rather than a second colour.

## B2. Radius — does flag 8 still hold?

Flag 8 settled **2 everywhere except confirmation overlays**. Page `184:5`
breaks it in four places:

| Node | Radius |
|---|---|
| `1648:67` and siblings (account confirmation cards) | 8 |
| their commits (`1648:94` etc.) | 4 |
| `1854:124` / `1887:124` / `1855:212` / `1855:440` (top-up cards) | 8 |
| `1854:127`–`133` (amount chips) · `1878:126` (billing card row) | 8 |

**RULED: align to the rules.** Overlay surfaces — modals, confirmation cards,
popovers — are **12**. Every control and content card is **2**. Documents and
bands are **0**; drawer tops are **20**. Pills, progress bars, pager dots and
icon glyphs are fully-rounded shapes and are not governed by the scale.

## B3. Compact copy that differs from desktop in wording, not width

| Desktop | Compact | Frames |
|---|---|---|
| `NO MEMORIES YET` | `NOTHING LEARNED YET` | `1834:8` / `1811:7` |
| `7 MEMORIES` | `7 THINGS LEARNED` | `1736:8` / `1680:7` |
| `MEMBER SINCE MARCH 2025` | `MEMBER SINCE MAR 2025` | `1615:5` / `1669:7` |

**RULED: standardise on the desktop vocabulary; keep `MAR`.** "Memories" is
already the product term — it names the section on desktop — and two words for
one concept is a cost the user pays every time they switch device. `MAR` stays:
that one is a genuine width fix on a 390 bar, not a rewording.

## B4. The compact memory list shows five of seven

`1680:26` lists **5** memories where its own header counts **7**, and the row
underneath goes to the questions carousel rather than to the rest of the list.
The other two are unreachable.

**RULED: show all and let the card grow.** The page already scrolls, so the
count is always true and there is no new control to draw. In the build the
header's number is now *derived from the list*, so the two can never disagree
again.

## B5. Drawer heights

`1581:154` (the Wallet's plans drawer) is **368** — the only mobile drawer in
the file that is not one of the three detents.

**RULED: three detents, and nothing else.** Peek 94 / half 408 / full 760. A
drawer sized to its content is a drawer that has not decided which of the three
it is. `Drawer` no longer accepts a custom height, so a frame at any other value
will not build as drawn.

---

# Part D — what the five rulings change in the file

The build already follows all five. These are the node-level edits that bring
the file back into line, so the next measurement pass finds zero deltas.

## D1. Plan ticks → accent (ruling B1)

`#1a7f4b` → `#e8453c` on: `1553:15` (`✓ Current budget`), `1553:21`, `1553:23`,
`1553:25`, `1553:27`, `1553:29` (the Business feature ticks), and the same tick
on `1581:161` in the plans drawer.

**Leave green** on `1623:61` and `1636:93` — the `+$186` credit at both widths.
That is the only place it survives.

## D2. Radius → 12 / 2 (ruling B2)

**To 12** (overlay surfaces):

| Node | Now |
|---|---|
| `1648:2` / `1648:35` / `1648:67` / `1648:99` — account confirmations | 8 |
| `2081:2905` — desktop sign-out | 8 |
| `1854:124` / `1887:124` / `1855:212` / `1855:440` — top-up cards | 8 |
| `1878:124` — billing card | 8 |
| `1885:93` — Data Room upgrade card | 8 |
| `1775:94` — delete-file dialog | 8 |
| `1778:172` — the row-actions popover | 10 |

**To 2** (controls and content cards inside them):

| Node | Now |
|---|---|
| `1648:29` / `1648:62` / `1648:94` / `1648:126` / `2081:2908` — confirmation commits | 4 |
| `1775:*` commit — delete-file | 4 |
| `1854:127`–`133` and `1887:127`–`133` — top-up amount chips | 8 |
| `1887:205` — the custom stepper | 8 |
| `1878:126` — the stored-card row | 8 |
| `1271:198` — the notifications card (content inside a drawer, not an overlay) | 12 |
| `1271:206` — its commit | 10 |
| `1760:73` — the Data Room drop box | 6 |
| `1760:70` — the include/private checkboxes | 3 |
| `1885:94` — the `BUSINESS` chip | 3 |

**Leave alone:** every progress bar and pager dot at radius 3 (they are
fully-rounded pills, `h6 r3`), the toggles at 10/13 (same), the filter pills at
100, drawer tops at 20, and icon glyphs like `1271:199`.

## D3. Compact copy → desktop vocabulary (ruling B3)

| Node | Now | Change to |
|---|---|---|
| `1811:7` | `NOTHING LEARNED YET` | `NO MEMORIES YET` |
| `1680:7` | `7 THINGS LEARNED` | `6 MEMORIES` |
| `1736:8` | `7 MEMORIES` | `6 MEMORIES` |

`1736:8` and `1680:7` both say **7** where `1736:135` and `1680:26` list **6**
and **5**. The build derives the number from the list, so the frames should
state the number they actually draw. `1669:7`'s `MAR` stays.

## D4. Show every memory (ruling B4)

`1680:26` draws five rows where its header counts seven. Draw **all six** — the
card grows from 304 to 344 on a 40 pitch — and the entry row (`Answer a few
questions →`) moves with it. Its rule stays 14 above.

## D5. Three detents, nothing else (ruling B5 — new)

**Every mobile drawer is peek 94 / half 408 / full 760. No other heights.**

`1581:154` is the only frame that breaks it, at **368**. Redraw it as a **Half**
(408) with every row keeping its current top; the extra 40 falls below the
composer, which puts it on the same floor as every other Half. The build already
ships it that way.

While you are there, this is also the moment for **A11** — reconciling the 24
peek frames to the `628:5` master. Three detents is only true if all three have
one definition each.

---

# Part C — pre-flight for page `184:6` (Insights)

`184:6` is the next build. The same five checks caught something every round, so
please run them over `184:6` **before** I start:

1. **Every desktop state has a 390 sibling.** Round 4 drew three that were
   missing on the Data Room alone; empty, loading, error and no-results are the
   ones that get forgotten.
2. **Body copy is auto-height.** Eight instances of a box drawn a line short so
   far.
3. **Radius per B2** — 12 for overlay surfaces, 2 for everything else.
4. **Greys off the collapsed ramp** — grey 900/800/600/500/400/350/300, line
   200/100/050, `fill/*` for fills.
5. **Scrims named `Scrim`, 42% black, y52 h736.**

Two more worth adding after `184:5`:

6. **Figures are DM Mono Medium** — every currency and count. A stray Inter on a
   number is easy to miss and hard to unsee.
7. **Mobile drawers use one of the three detents** — peek 94 / half 408 /
   full 760, and nothing else (ruled; see D5). `Drawer` no longer accepts a
   custom height, so a frame at any other value will not build as drawn.
