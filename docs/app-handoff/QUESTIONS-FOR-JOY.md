# Open questions & flags for Joy

Running log from the build. Nothing here was invented around — each item was
either built to the frame (and flagged) or left unbuilt pending a decision.

**Status key:** 🔴 blocked (not built) · 🟡 built to the frame, needs a ruling ·
✅ resolved.

---

## ✅ 21. RESOLVED — the grey collapse landed file-wide on 2026-08-13

Two earlier passes reported this done while the screens still carried the old
hexes. The design session found why: **`page.findAll` returns incomplete results
on a non-active page** under Figma's dynamic page loading, so a sweep silently
skipped every page but the open one — which is exactly why masters moved and
hand-drawn screen copies did not. Calling `setCurrentPageAsync` before each page
fixed it; the re-run touched 4,244 nodes.

Re-measured on 13 Aug and confirmed at target: `812:23` → `#5c5b58` ·
`1301:3298`/`1301:3300` → `#8a8a85` · `971:73` → `#1a1a17` · `1144:2906` →
`#8a8a85` · `1144:2904` → `#e0ded9` · `1446:172` → `#ececea` · `2025:2`/`724:35`
→ `#5c5b58` · `628:5` → `#e0ded9` · `926:2496` → `#1a1a17`.

**The token file is collapsed.** `index.css` now carries a named ramp
(`grey-900/800/600/500/400/350/300`, `line-200/100/050`) and every semantic name
is an alias onto it, so the value has one source while the name still says which
node it traces to. 33 semantic greys now resolve to 10 distinct values.

Kept off the ramp, each deliberately: `#b8b5b0` undrafted (Joy's ruling),
`#6b6b66` legal-sheet body (report-content greys were not swept), `#0a0a0a`
chrome ink, and the Signal's cool family.

**One new one-unit pair to watch:** `--color-output-card-border` `#dedbd6`
(`926:2495`) and `--color-bubble-border` `#e5e3de` were not on any sweep list,
and `#e5e3de` sits one unit from the Updates skeleton's `#e5e3df`. Same shape as
the old `#e9453c`/`#e8453c`. Not urgent.

---

## ✅ 22. RESOLVED — the 0.895 scale artefact is reset on all four field nodes

`2011:30`, `2011:33`, `2044:72`, `2044:75` are now **border 1 · radius 2 · type
14 · inset 13**, and the subject boxes were widened so the prefilled subject sits
on one line. Measured: the desktop subject field renders 32/218 358×44 at 14px
with a 1px border and radius 2. `2011:11`'s failed content was re-centred to
match `2002:2`.

Still open, cosmetic: the `REGARDING` pill rail is drawn ~2px narrower per pill
than the labels measure, so by the sixth pill it is ~9px short. It scrolls, so
nothing clips.

---

## ✅ 23. RESOLVED — `924:24`'s label box

Widened 342 → 358 at x=0, so the centred label now sits on the button's centre.
The button stays at the frame-level docked slot, 80/358. No code change — the
build already centred it.

---

## ✅ 24. RESOLVED — desktop contact support is drawn and built

`2044:9` (2026-08-13) gives desktop the scrimmed-modal counterpart of compact's
drawer: `2044:67`, a 422×620 card at 736/140 — centred on the **content column**
(947), not the viewport. Built and measured exact. The app has no dead links.

`1827:2` keeps its left pane on the failed screen (Joy) and is built as drawn.

---

## ✅ 26. RESOLVED — Ask divider widened, with one follow-up

**Joy, 2026-08-13: widen the rules, never narrow the shared 358 input.** Applied:
on the compact drawer `944:1400` the label `1020:13` is re-centred on 195 (x=124)
and the right rule `1020:14` is x=286/w=88, ending at 374. Equal rules, symmetric
about the centre. Correct, and built.

**✅ Follow-up RESOLVED by evidence — `865:8` wants x=278/w=88, not 286.**
`1848:21` on Document View is the *untouched* sibling of the same rule and it
ends at pane-relative **366**, exactly the column's edge. The round-3 move sent
`865:8` to 286/88, which ends at 374 — 8px past. The build already ships the
366 ending, so nothing changes here; `865:8` should be pulled back to match its
own sibling.

*Original finding:* `810:2162`'s column starts at **x=24**, not 16, so its 342 measure runs
24→366. `865:8` at x=286/w=88 ends at **374**, i.e. 8px past the column, while its
label `865:7` stays centred on 195 — so the cluster is now lopsided. The build
keeps both rules at 88 and symmetric about 195 (24→112 and 278→366), because a
rule that overshoots its own column while the label stays centred is a slip
rather than a design. **`865:8` wants x=278.**

---

## ✅ 25. RESOLVED — the Generate Output cards reflowed

`1493:7`/`12`/`17` now put the price at a 32 right inset (x=234) and the `×` at 7
(x=319), so the `×` is back inside the 342 card on all three. That is what the
build already shipped, so it re-matched with no change.

---

## 🟡 27. Two compact copies missed the radius pass

The 12 Aug radius fix reached the desktop instances but not their compact twins,
so two nodes are still off the semantic scale:

| Node | Screen | Drawn | Its desktop twin |
|---|---|---|---|
| `1139:2851` selection chip | Edit — Mobile `1138:2748` | **4** | `1125:7` is **2** |
| `1505:11` add-output card | Generate Output — Mobile `1283:3126` | **6**, 1px dashed | `1493:3` is **2**, 1.5 dashed |

Both ship at `radius/edge` in the build, on the same reasoning as the section
cards: the master is right and the copy is stale. The add-card keeps the compact
frame's **1px** dashed border, which is a real per-screen difference against the
pane's 1.5 — worth confirming that one is deliberate.

---

## 🟡 28. Documents — three things the frame and the locked spec disagree on

**`843:89` is built and measured.** Three flags from it:

**a. The cover card is a 0.65-scaled instance.** `843:173` renders 7.15px type,
a 1.3px rule, 2.6 radius and 9.1 insets — 11 / 2 / 4 / 14 scaled by 0.65, i.e. a
200×250 cover shrunk to 130×162.5. Built at the drawn size because it is a
thumbnail and a title in a grid is navigation chrome rather than report content,
but **7.15px is below any legible minimum**. Wants a decision: a real thumbnail
scale with its own type sizes, or a bigger card.

**b. The `Tier` sort pill should not be showing.** The locked spec is explicit —
offer a sort dimension only when meaningful, and hide Tier unless the library is
filtered to a single Type, because rung names are type-dependent. The frame
draws all five pills in the unfiltered state. Built as drawn; the rule is
implemented as `sortsFor()` and tested, ready to drive the row once filtering is
wired.

**c. Empty-state bodies are drawn one line short — a pattern now, not a one-off.**
`1803:195` is boxed at 44 (2 lines) and `1846:165` at 42, but at Inter 15/22 on
their own measures the copy takes **3**. Rule 9a grows the frame, so the desktop
`Start an analysis` lands at 504 rather than the drawn 482. This is the third
time — `1827:196` and `2002:161` had it too, and both were fixed on request.
Worth a sweep of every empty/error body in the file rather than another round
trip each time.

**d. Two more off-ramp greys.** `#e7e6e4` (filter-pane row divider + group rule,
`1208:16`) and `#8c8b87` (recency group label, `1085:2062`) are on neither the
text ramp nor the hairline ramp, and were not in the 13 Aug sweep. Two more from
the states: `#999991` (`1804:2`, the pane's empty line) and `#0f0e0d`
(`1280:358`, the compact Documents heading — one unit off `text/primary`).

**e. The empty-state glyph sits ~2.5px right of centre** on `1803:2`, `1846:51`
and `1824:2`, while every other element in those blocks is centred. Built
centred.

---

## 🟡 29. Data Room — the 0.895 scale artefact has spread again

**`1756:2` (the base desktop screen) is built and measured.** Three flags:

**a. `1763:72`, the paste-a-URL field, is the artefact's fifth instance** —
0.895px border, 3.58 radius, 12.53 type, 11.63 inset. Same 1 / 4 / 14 / 13
field scaled by 0.895 that `2011:30`, `2011:33`, `2044:72` and `2044:75` carried.
Those four were reset on 13 Aug; this one was missed because it lives on a
different page. **Worth fixing the source component once** rather than node by
node — it is clearly being copied.

**b. The drop box `1760:73` is radius 6**, off the semantic scale (0/2/12/20).
Ships at `radius/edge`.

**c. Three more off-ramp greys.** `#dbdad8` (file-card border, `1764:74`),
`#c9c8c6` (source row + drop box border, `1760:84`/`1760:73`) and `#292926`
(the PRIVATE tag fill, `1777:73`).

Also worth knowing: the Data Room search is **44 tall** (`1757:68`) where every
other search field in the app is 40. Reproduced, and `SearchField` now takes a
height.

---

## ✅ 17. RESOLVED — the three missing Conversation suggestion strings

They read cleanly out of the instance overrides on the second attempt, so this
is no longer blocked and nothing was invented:

| Node | String |
|---|---|
| `640:95` | Due diligence on a specific target *(already confirmed)* |
| `640:100` | Market sizing & competitive landscape |
| `640:105` | Competitive teardown of the top OEMs |
| `640:110` | Primary-research synthesis |

**Built with all four.** Shout if any of them has since changed in the file.

---

## ✅ 18. RESOLVED — Intelligence stays disabled/SOON on the Gate

**Joy, 2026-08-12: "agree."** Ships as built: rendered at the frame's exact
position and colours, non-interactive, with the accent `SOON` marker. Worth
adding that marker to `708:63` so the file and the build agree.

*Original finding:*

### 18. Gate: the frame draws Intelligence as a normal selectable tier

`708:63` gives Intelligence the same treatment as Brief — grey label, grey
`$300`, an ordinary radio. No SOON tag, nothing disabled. But hard rule 9 says
launch depths are Brief + Study and **Intelligence renders disabled/SOON**.

**Built to the rule, not the frame** — a selectable tier that cannot be
generated is a functional defect, not a styling nuance. It renders at the
frame's exact position and colours but is non-interactive, with a small accent
`SOON` after the label (the one mark the frame does not have).
**Need:** either confirm that, or add the SOON treatment to `708:63` and I'll
match it exactly.

---

## 🟡 19. Gate: §11 makes the pane taller than the frame, so it scrolls

Consequence of your "§11 stands" ruling, flagged so it isn't a surprise. On
`708:2` the conversation ends at y=435 and the gate block starts at 436; under
§11 the conversation ends at 470, which pushes the block to 494 and its foot to
819. The **Generate button (y=782) and refine input (y=840) are fixed slots and
did not move**, so on a 900-tall viewport the conversation + gate block now
scroll ~72px between the header line and the button.

**Built that way** — the alternative is compressing §11 back out or floating the
commit after variable content, and §6 forbids the second.
**Need:** nothing, unless you'd rather the gate block sat above the fold at 900,
in which case the pane conversation has to lose the §11 spacing again.

---

## 🟡 20. Two more per-screen splits worth knowing about

- **`640:2` types its conversation larger.** In the 800 centre column Caspr's
  reply is **Inter 14/20** and the user's message is a fixed **340×40 bordered
  block** (`#e0ded9`, 14/11 insets, Inter 14 `#0a0a0a`) — not §11's 13/19 pane
  reply and hug bubble (`#e5e3de`, 12.5). I read this as a different surface
  rather than a conflict, since §11 scopes itself to "the pane conversation".
  Built as drawn on both.
- **The list-row status colour is `#9c9b98` on the `640:2` instances**, where the
  master `673:4` reads `#8c8a85` — and §7 writes the current tag as `CURRENT`
  where the frames render "Current". Built to the instances, since that is what
  renders. Folds into the grey-consolidation pass in item 7 (which now has a
  fifth hairline too: `#ececea`, the gate row rules).

---

## 🟡 33. The compact report re-sets The Signal — including its radius

`971:64` is not the 800 page scaled down; it is re-set for the phone, and I
built it that way. Most of it is clearly deliberate (a 22 serif title against
the desktop 20, a 318 measure). Two are worth confirming:

- **The Signal is radius 2 on compact and radius 10 on desktop.** Compact is on
  the semantic scale and desktop is not — which suggests the desktop 10 is the
  drift, not the mobile 2 (see item 31).
- **Compact drops The Signal's icon and its evidence line entirely.** The claim
  survives, the "~2,400 mentions … 9 named operators" provenance does not. On a
  block whose whole point is *captured beyond the cited record*, losing the
  provenance is a bigger cut than it looks. Deliberate, or a casualty of space?

Also: body ink is `#171716` on compact against `#333330` on desktop, and the
index goes `#9c9b98` against `#5c5c57`. Built per frame.

---

## 🟡 34. Ask on compact: the divider runs 342 while everything else runs 358

In `944:1400` the bubble and the docked input span 16→374, but the two divider
rules span 16→358. A 16px inset on one row only. Built as drawn.

---

## 🟡 31. The reader pane has two content columns, and four off-scale radii

Five of the six panes put their column at **x=24, 342 wide**. **Generate Output
(`923:2419`) uses x=16, 358** — the gate/Layout column — on the same pane, one
click from the others, so the content shifts 8px left and grows 16 as you go in
and back out.

Radii off the semantic scale (0/2/12/20), all built as drawn:

| Where | Radius |
|---|---|
| The Signal (`812:29`) | **10** |
| Edit selection chip + the three selects (`1125:7`, `1144:2904`) | **4** |
| Generate Output's add-card and queued rows (`1493:3`, `1493:7`) | **6** |
| Filter pills (`926:2503`) | 100 — fine, that's a pill |

**Need:** one column, and a ruling on the radii — either they join the scale or
the frames come back to it.

---

## 🟡 32. Outputs: the feed's vertical rhythm is hand-set

Gaps down `831:2242`'s feed are 19 (with its rule 10 in), 19, 10, 14 — no rule
to derive, so they ship as per-item data. Fine if deliberate; if not, one pitch
would make the list generative rather than a fixed composition.

Two smaller things on the same pane: it is titled **OUTPUTS** while the frame is
named "Versions" (I shipped Outputs, matching the switcher), and the Generate
Output commit is **Semi Bold 13.5** where every other commit in the build is
Medium 14.

---

## ✅ 28. RESOLVED — The Signal ships, wired conditionally

**Joy, 2026-08-12:** *"yes ship — this will only show when Caspr sends relevant
information, so no harm in making the wiring. If the API doesn't send anything
nothing will get created; when it does, The Signal section will get generated in
the report."*

**Built to that rule, not to the frame's always-on composition.** The block now
renders **only when the section carries Signal data**; with none it is absent
entirely and the paragraph below closes the gap (20 → 14). An empty card would
say "we looked and found nothing", which is a different claim.

**Contract change (handover rule 20 — please forward to Jayant):**
`AnalysisSection` gains an optional field. Additive and backward-compatible —
omitting it is the normal case, and existing payloads keep working.

```ts
interface SectionSignal { claim: string; evidence: string }
interface AnalysisSection {
  …
  signal?: SectionSignal | null;   // NEW — present only when a market view was found
}
```

`architecture-alignment-v4.md` / `api-spec-v1.md` need the same line adding.
**Also note:** the compact report (`971:71`) shows only `claim` — the frame has
no room for `evidence` — so on a phone the provenance is currently dropped. That
is item 33, still open.

*Original finding:*

### 28. The Signal is drawn in every report page, but §5 lists it as Phase 2

`DEV-HANDOVER.md` §5 puts **The Signal** under "Phase 2 — coming-soon
placeholders only, do NOT build internals". But all six Working frames draw it
inline and complete inside the report page (`812:29`), with real copy.

**Built as drawn**, since it is part of the deliverable the reader is reading.
**Need:** confirm it ships at launch, or tell me to hold it and I'll pull it
from the page.

It also brings two things of its own worth a look:
- its **own cool-grey family** (`#f2f2f4` surface, `#6b6a78`, `#1a1a18`,
  `#8b8a96`) against the warm greys used everywhere else in the app;
- **radius 10**, which is not on the semantic scale at all (0/2/12/20).

---

## 🟡 29. A third user-bubble treatment, and a fourth pane-heading style

Ask Caspr's bubble (`865:2`) is **filled `#edece9` with no stroke**, 13/20, at
12/8. That is a third distinct treatment: the pane conversation uses white with
an `#e5e3de` hairline at 12.5/15, and the Conversation screen uses a fixed
340×40 block with an `#e0ded9` hairline at 14/18. All three are built as drawn.

Separately, Contents' heading is Inter Semi Bold **13** `#1a1a17` at **0.26**
tracking, where every other pane heading is **14** `#474642` at **0.3**.

**Need:** if these are deliberate per-surface choices, nothing to do. If they're
drift, one pass would collapse them.

---

## 🟡 30. The report page sets two different leadings

`812:26` and `812:28` are at the font's natural leading (16 on 13px); `812:35`
is at 1.55 (20). Same paragraph style, same column, same page. Built per
paragraph. A document should almost certainly use one — probably the 20.

---

## 🔴 25. There is no mobile generation-failed frame

`1827:2` is desktop only — the readiness review lists it under Desktop and the
file has no compact counterpart. A phone therefore has no designed state for a
run that dies, which is the one failure a user is guaranteed to hit eventually.

**Built:** the desktop state's own elements — glyph, headline, body, `Try
again`, `Contact support` — reflowed at the mobile gutters, so the route is
never a dead end. **Nothing new was drawn**, but the arrangement is mine.
**Need:** a compact frame, or a look at what's there and a nod.

---

## 🟡 26. Generation-failed: the body copy needs three lines, not the two its box allows

`1827:196` is a 460×44 box — two lines at line-height 22. The string is **959px
wide** at Inter 15, so it needs **three** lines at 460; Figma's own render
overflows the box, and everything positioned under it (`Try again` at 484,
`Contact support` at 540) was placed against the two-line assumption.

**Built flowing**, keeping the designed *gaps*, so nothing overlaps — which puts
the button at **506** and the link at **562**, both +22.
**Need:** widen the box to ~500 if two lines was the intent, or confirm three.

---

## 🟡 27. Two apostrophes

`1527:7495` / `763:79` use a **straight** apostrophe ("what's this one for?");
`1827:196` uses a **curly** one ("You haven't been charged"). Both are built as
drawn, so the product currently ships both. Curly is the editorial default and
matches the rest of the copy — worth one pass through the file.

---

## 🟡 21. Theater: five small colour drifts, built to the frames

None of these change how anything looks; they are worth a sweep in Figma so the
file stops growing near-duplicates.

| Where | Frame ships | Elsewhere |
|---|---|---|
| Pane switcher active label + Ask glyph (`1491:49`) | `#e9453c` | accent is `#e8453c` |
| `WHILE CASPR WORKS` eyebrow (`763:78`) | `#47463f` | every other eyebrow `#474642` |
| Idle spoke line (`724:65`) | `#bdbab5` | §12.1 says "≈ `#D0CFCC`" |
| Idle candidate node | `#c2bfba` | §12.1 says `#C2C1BB` |
| Starfield | `#9a968d` @ 0.4 | §12.1 says `#D1CFCC` (composites to ~the same) |

**Built:** the frames' values, except the accent — §1 is explicit that `#e8453c`
is *the only* accent, so the 1/255 switcher drift ships as the single token
rather than becoming a second red. Two new greys were unavoidable: `#73706b`
(counter label + flap row) and `#d1cfcc` (pagination). That takes the
consolidation list in item 7 to seven greys and five hairlines.

---

## 🟡 22. Theater: the desktop frame has no flap row

`724:35` gives mobile the split-flap row — DM Mono 11 `#73706b`, showing
`M9K2X0Q8ZP` mid-scramble — above the confirmed list. The desktop frame
(`762:163` onward) opens straight onto resolved names with no equivalent row.

§7 describes **one** engine driving both, so this reads like an omission rather
than a decision. **Built to each frame** — mobile flaps, desktop doesn't.
**Need:** confirm, or add the row to `762:2` and I'll turn it on.

---

## 🟡 23. Theater: node sizes are ~1.3× the spec, and I followed the frames

§3–6 size the graph against a 260-wide Compact reference: hub r11, locked node
r5, idle r2.8, spoke line 1px. Scaled to the 390 frame that would be r16.5 / 7.5
/ 4.2 / 1.5px. The frames draw **hub 44 (r22), locked 20 (r10), idle 12 (r6),
lines 2px** — consistently larger.

**Built to the frames**, since they are the composed screens. The one place I
kept the spec instead is **star radius**: the frame's stars are all one instance
size, and §3 is explicit that radius varies 0.7–2.0 "for organic size variety",
so they vary across the frame's size as their maximum.
**Need:** nothing, unless the spec's radii were meant to win — in which case
they are four numbers in `layout.ts`.

---

## 🟡 24. Theater: the pane carousel doesn't line up with its own docked input

On `762:2` the carousel's content frame is 360 wide at x=64, so its column runs
**x=88 w=312** — but the same pane's docked input is **x=80 w=358** and its pane
switcher is the full 390. Three different left edges on one pane.

Layout Canvas has the same class of problem (§14). **Built as drawn.**
**Need:** one pane content column, or confirmation that these are deliberate.

---

## 🟡 12. Conversation rhythm: the frames and §11 disagree — I built §11

**RULED: Joy, 2026-08-12 — "§11 stands."** Kept for the record; the deltas below
are the amount by which Layout Canvas and Gate now differ from their frames'
hand-placed conversation spacing, and are expected rather than defects.

`design-guidelines.md` §11 locks the conversation's vertical rhythm (turn 24
desktop / 16 mobile · message→list 12 · between list items 8). The frames
hand-place every line instead, and they land somewhere else:

| Gap | `692:2` frame | §11 (built) |
|---|---|---|
| eyebrow → first message | 17 | 24 |
| bubble → reply | 24 | 24 ✓ |
| reply → bubble | 18 | 24 |
| bubble → nudge | 24 | 24 ✓ |
| nudge → question list | 6 | 12 |
| between questions | **0** | 8 |

Measured deltas of what shipped vs `692:2` (x and every width are exact; this is
vertical only): eyebrow 0 · bubble 1 **+7** · reply **+7** · bubble 2 **+13** ·
nudge **+13** · Q1 **+19** · Q2 **+27** · Q3 **+35**. Mobile (`694:2`): eyebrow
0 · bubble **+7** · nudge **+7** · Q1 **+12** · Q2 **+19** · Q3 **+8**.

**Why §11 won here, against the usual "match the frame" rule:**
1. §11 says in its own last line that it was applied to Onboarding and that the
   **app pages are "pending Joy's review"** — so the frame is the older artifact
   on this specific point, not the doc.
2. **`694:2` cannot be reproduced.** Its nudge is a fixed-height 20px box that
   actually renders 38 tall; laying the questions out from the drawn positions
   puts Q1 ~12px *inside* the nudge.
3. Zero gap between question items reads as a mistake, not a decision.
4. Gate (`708:2`) has shipped on §11 since it was built, and its pane
   conversation is **byte-identical** to `692:2` — building the frame here would
   make two identical frames render differently.

**Need:** "§11 stands, re-space the frames" (nothing to do) **or** "the frames
are right" — in which case tell me and the rhythm constants change in one place.

---

## 🟡 13. Layout section cards are radius 8 on `692:2` and `708:2`

The master `1301:3294` ships **radius 12**, and the locked scale says layout
cards are 12. But the copies drawn onto `Layout Canvas` (`692:129`…) and
`Gate` (`708:17`…) are **radius 8** — a value that is not on the semantic scale
at all. They are raw frames, not instances, so they didn't inherit the master.

**Built:** 12 (master + locked rule). Same call as the onboarding frames' stale
4/8 radii in item 8.
**Need:** re-radius those ten card copies in Figma to 12 so master and screen agree.

---

## 🟡 14. `692:2`'s docked input sits at x=76 / w=332; every other paned frame uses x=80 / w=358

| Frame | Docked input |
|---|---|
| Gate `708:2` | x=80 · w=358 · y=840 |
| Conversation `640:2` | x=547 · w=800 · y=830 (centre column) |
| Conversation+Layout `1301:3280` | x=80 · w=358 · y=880 |
| **Layout Canvas `692:2`** | **x=76 · w=332 · y=832** |

§6 says the desktop slot is x=80, w=358. `692:2` is the only frame that differs,
and it also puts the conversation text at x=84 — so on this one screen the input
is 8px left of the text it belongs to, where every other frame has them 4px apart.

**Built:** to the frame (76/332/832) — it measures exactly.
**Need:** confirm it's deliberate, or nudge the frame to 80/358 and I'll follow.

---

## 🟡 15. "six sections on the right" — but five are drawn

The nudge copy says **six** sections on `692:2`, `694:2`, `708:2` and both
onboarding frames; all of them draw **five** cards (3 drafted + 2 pending).

**Built:** the frame's copy verbatim, with five cards.
**Need:** a sixth card, or the copy changed to "five".

---

## 🟡 16. Between-breakpoint reflow on the canvas (rule 3 — asking, not guessing)

Figma gives 1440 and 390. Two places in between are mine to decide and I'd
rather you saw them:

- **1180–1440.** The 800 content column can't hold: rail 64 + pane 390 + buffer
  93 leaves 633 at 1180. Built to compress fluidly (no bleed, nothing clipped),
  with the pane and buffer fixed. The alternative is dropping the pane earlier.
- **~700–1179 (tablet / unfolded foldable).** This runs the *compact* tree, so
  the section cards stretch toward their 720 max while the pending skeleton bars
  stay at their mobile 260/190 — correct per frame, a bit short at that width.

Everything from 280px up is clean: no horizontal bleed, no clipping, nothing
overlapping, at 320 · 390 · 1179 · 1180 · 1440 and at 700-tall viewports.

---

## 🟡 1. Full drawer covers the bottom nav

`design-guidelines.md` §10 states drawers stop at **788** and *never* reach the
frame floor (844), because the bottom nav is persistent and top-most. But the
only Full-detent instance in the file — **`Help — Mobile (full · message)`** —
sits at **84–844**, covering the nav.

**Built:** to the frame (`coversNav: true` for `full` only).
**Need:** confirm Full is meant to cover the nav (plausible for a full-screen
composer), or move that frame and I'll flip it.

---

## 🟡 2. Peek drawer chrome has drifted from the Half/Full master

The 24 peek frames were hand-drawn per screen, so their chrome differs from
master `628:5`:

| | Peek frames (`1579:2`) | Half/Full master |
|---|---|---|
| Handle colour | `#d3d1c7` | `#c7c4bf` |
| Handle radius | 3 | 2.5 |
| Handle top | 9 | 11 (half) / 12 (full) |
| Border | full 1px `#e2e1de` | top-only 1px `#d9d6d1` |

All 24 peeks agree *with each other*, so peek keeps its own shell values and
every screen stays pixel-identical today.
**Need:** ideally one drawer master serving all three detents in Figma.

---

## 🟡 3. Wallet balance font differs between the two navs

- Rail balance (`1541:7`) → **DM Mono**
- Bottom-nav balance (`625:41`) → **Inter Medium**

`design-guidelines.md` §3 says DM Mono is for figures, so the bottom nav looks
like the outlier. Built to each frame.
**Need:** confirm whether the bottom nav should be DM Mono.

---

## 🟡 4. Error colour: brand red vs the `--error` tokens

`motion-and-interaction-states.md` §4 flags this itself: shipped error states
use brand red `#E8453C` for error *text*, while `--error #B91C1C` /
`--error-subtle #FEE2E2` exist but are unused.

**Built:** brand red, per the shipped states.
**Need:** confirm the `--error` tokens are dead so they can be removed.

---

## 🟡 5. Title card radius: spec says square, master says 2px

`design-guidelines.md` §5 describes the title card as *"the dark square card …
`#0b0b09`, **square (0px)**"*, and §2 puts "dark cover/title cards" in the 0px
`radius/sharp` bucket. The built master **`659:2` ships radius 2**.

**Built:** to the master (2px).
**Need:** confirm 2px, or square the master.

---

## 🟡 6. `accent-pressed` has no value

`motion-and-interaction-states.md` §4 specifies a pressed primary button uses an
`accent-pressed` fill, but no value exists in any doc or in the Figma variables.

**Built:** pressed = accent darkened ~12% via filter (hover is ~6% per §4).
**Need:** the real `accent-pressed` hex, or confirm the filter approach.

---

## 🟡 7. Grey palette has proliferated

Distinct greys now in the build, each traced to a different master:

| Value | Role | Source |
|---|---|---|
| `#5c5b58` | secondary text | figma var `text/secondary` |
| `#8a8a85` | peek Ask placeholder | `1579:9` |
| `#8c8a85` | list-row status + chevron | `673:4` |
| `#9c9b98` | tertiary / docked-input placeholder | figma var `text/tertiary` |

…and **five** separate hairlines: `#e2e1de` (border), `#e0ded9` (rail/nav
divider **and the `640:92` user block**), `#d9d6d1` (drawer edge), `#ebe8e3`
(list-row rule), `#ececea` (gate row rules, `1466:16`).

Each is faithful to its frame, so nothing is broken — but several look like
drift rather than intent. **Need:** worth a consolidation pass in Figma; tell me
which are deliberate and I'll collapse the rest.

---

## ✅ 8. RESOLVED — radius is 2 everywhere except confirmation overlays

**Joy, 2026-08-11:** *"radius stays 2 everywhere other than confirmation
overlays."*

So the onboarding frames' 4px/8px radii are **stale**, and the build uses
`radius/edge` (2) for the login card, OAuth buttons, email input and CTA. This
is a deliberate, documented override of those frames — the §2 semantic scale
wins. The confirmation overlays on Profile & Wallet keep their own radius.

*Original finding, kept for context:*

### 8. Onboarding uses a different radius scale — BLOCKED the Login build

`design-guidelines.md` §2 locks radius as a **semantic, reserved signal**:
`0` sharp · `2` edge (default for all functional chrome) · `12` layout cards ·
`20` drawer tops — *"if it's rounded it's a layout card or a drawer, nothing
else"*.

**`Login — Desktop` (`1167:146`) uses neither:**

| Element | Radius in the frame |
|---|---|
| Login card (`1168:2`) | **8** |
| OAuth buttons ×3 | **4** |
| Email input | **4** |
| "Continue with email" | **4** |
| "Start Free" header button | **4** |

The card also carries a **drop shadow** (`0 8px 16px rgba(0,0,0,0.06)`), while
`motion-and-interaction-states.md` §1 says *"no shadows except the bottom drawer
+ modal cards"* — arguably a modal card, so possibly fine.

**Not built** — this needs a ruling first, because the answer changes every
onboarding screen and possibly the token scale itself. Options: (a) onboarding
is deliberately a separate "pre-app / marketing-adjacent" surface with its own
4/8 scale; (b) the frames predate the §2 lock and should be re-radiused to 2.

---

## ✅ 9. RESOLVED — all three OAuth providers ship at launch

**Joy, 2026-08-11:** *"all three at launch."* Google, LinkedIn and Outlook are
all live from day one.

**Contract impact (rule 5):** `architecture-alignment-v4.md` v4.1 lists
Outlook/LinkedIn as Phase 2 — that is now superseded and the doc has been
updated. Backend note: Google and Outlook can run PKCE from the SPA, but
**LinkedIn requires a server-side secret exchange**, so the product backend
needs a LinkedIn code-exchange path in addition to the shared mint endpoint.

*Original finding, kept for context:*

### 9. Login shows three OAuth providers; launch scope said one

The frame renders **Google, LinkedIn and Outlook** buttons. But
`architecture-alignment-v4.md` v4.1 and `DEV-HANDOVER.md` §5 both put
**Outlook + LinkedIn in Phase 2**, Google only at launch.

**Need:** at launch do I (a) render only Google, (b) render all three with
LinkedIn/Outlook disabled + "Soon", or (c) build all three live and treat the
Phase-2 note as stale? Affects Login, First-Time User and the Signup overlay.

---

## ✅ 10. RESOLVED — the auth frames now carry password fields

**Verified in Figma, 2026-08-12.** `Login — Desktop` (`1167:146`) now has a
`password` field at 40/372 and a `forgot link` at 40/426; the Signup overlay
(`1182:329`) has `Create a password` at 40/372, a password hint at 40/424, and
the consent line at 33/508 reading *"By continuing, you agree to our **Terms of
Use** and **Privacy Policy**."* (Inter 11 `#6b6b66`, links in accent).

That closes this **and** the last outstanding copy gap — the two signup consent
strings. Rebuilding Login/Signup against the updated frames is now ordinary
build work, no longer blocked.

*Original finding, kept for context:*

### 10. Auth = email + password (decided) — frames pending update

**Joy, 2026-08-11: email + password**, not passwordless.

The Login (`1167:146`) and Signup (`1182:127`) frames currently show **email
only, no password field** — i.e. as drawn, Caspr is passwordless. The existing
`Forgot password` frames (`1881:2` / `1881:47`) only make sense with passwords,
which is what flagged the drift.

**Blocked until the frames carry a password field** (rule 1 — not inventing one).
`LoginPage.tsx` currently posts to the existing session endpoint as a
placeholder and must be revisited once the frames land.

Also needed: a **"Set new password"** screen to complete the reset chain
(request → email sent → set new password) — likely missing today.

---

## ✅ 11. RESOLVED — mobile scale-down is an artifact; option (a) approved

**Joy, 2026-08-11:** *"yes it's a scaling artefact, not by design — your approach
is approved."*

So across **all** mobile frames: keep the frame's **layout** (column counts,
widths, positions) but use the **designed type sizes and radius 2**, letting
heights grow to fit. Do not reproduce fractional scaled values
(0.772 borders, 6.179 radii, 9.654px type) — they are Figma group-scaling
artifacts, not design intent. Applies to Login, Gate + Theater and
Conversation + Layout mobile as well.

*Original finding, kept for context:*

### 11. Mobile accelerator cards are a uniform scale-down — type lands ~9.7px

`First-Time User — Mobile` (`1289:377`) lays the five accelerator cards out in a
**2-column grid, 173 × 157.55**, which is the desktop card (224 × 204) scaled by
**0.7723**. Every value inside scales with it:

| | Desktop | Mobile | = desktop × 0.7723 |
|---|---|---|---|
| Border | 1 | **0.772** | ✓ |
| Radius | 8 | **6.179** | ✓ |
| Title | 15 | **11.585** | ✓ |
| Description | 13 / lh 18 | **10.04 / lh 13.902** | ✓ |
| Example | 12.5 / lh 17 | **9.654 / lh 13.129** | ✓ |
| Insets | 19 / 21 / 49 / 119 | **14.67 / 16.22 / 37.84 / 91.91** | ✓ |

The exactness of the ratio says this is a **group scaled in Figma**, not a
mobile design. Shipping it means **~9.7px body text on a phone** — below
readable minimums, and it would also break the radius-2 ruling (6.179) and the
type scale.

**Not built to these values.** Two options:
- **(a)** it's a scaling artifact → I keep the 2-column layout and the 173-wide
  card, but use the designed type (15 / 13 / 12.5) and radius 2, letting card
  height grow to fit. My recommendation.
- **(b)** it's intentional → tell me and I'll match it exactly.

Worth checking the other mobile frames for the same artifact.

## §30 — Data Room states: three missing mobile frames, and four small flags

**Built, measured, and matching:** empty (`1805:2` / `1808:2`), upload failed
(`1809:2` / `1824:197`), uploading (`1791:2` / `1796:2`), add-files drawer
(`1768:2`), search no-results (`1812:2`), loading (`1832:2`), search results
(`1851:2`), feature locked (`1885:2` / `1885:109`). Every geometry above is
verified in the browser against the frame's own numbers.

### (a) Three states have no mobile frame — needs a decision

`1812:2` (no results), `1832:2` (loading) and `1851:2` (search results) exist
at 1440 only. A phone still reaches all three, so I built them rather than
leaving dead screens, using the compact ramp your own `1808:2` establishes for
this screen (25px serif headline, 14/21 body on a 330 measure) over the compact
card geometry from `1784:304`. **These three compact halves are derived, not
drawn.** Three frames would confirm or correct them.

### (b) Upload failed is no longer TBD

The spec marked its styling TBD; the frame now answers it, so nothing is
blocked: the row keeps its ordinary `#dbdad8` edge, the reason replaces the
date in accent (`1.8 MB · Upload failed — file exceeded 25 MB limit`), and the
tag/`≡` cluster is replaced by `Retry` + `✕`. Built exactly that way. Flagging
only so you know the spec doc is now behind the file.

### (c) The recurring flags, two more instances each

- **Empty-state body drawn one line short** — 5th instance. `1805:95` is boxed
  at h44 (2 lines) but the copy runs to 3 at 15/22 in a 420 measure. Shipped as
  3 lines; the copy is unchanged.
- **Hug-content nodes off the column centre** — `1808:119` sits 2 right of
  centre and `1812:97`/`98` 1.5 right. Replicated rather than centred, so the
  build matches the frame; both are almost certainly hug artefacts and would be
  better centred if you agree.
- **Off-scale radius** — the loading skeleton's three bars are **radius 3**
  (`1832:94`–`96`) against the 0/2/12/20 scale. Shipped as drawn.
- **Two more off-ramp greys** — `#e5e5e3` (skeleton bars + upload progress
  track) and `#e8e7e5` (the loading card's paler edge). Now tokens
  `--color-fill-track` and `--color-skeleton-border`.

### (d) One text artefact, not replicated

`1791:96` writes `5.1 MB  ·  Uploading…` with **double** spaces around the
separator, where every other row on the screen uses single. Built with single.
Say the word if the wide separator was deliberate.


## §31 — Shell odds + toasts: what opens sign-out, and a scrim correction

**Built and measured:** More (nav overflow) `1236:2860` · Sign-out
confirmation `1248:104` · Toasts `1922:2` / `1928:76`. Both drawers match their
frames exactly at every anchor. That closes page `184:4`.

### (a) Nothing in the file shows what opens sign-out — needs a decision

`1248:104` draws the sheet over Welcome, but no frame anywhere has a control
that triggers it. The rail and the More sheet both stop at `Account`, and
Account (page `184:5`) is not built yet. It is on `/sign-out` for now and wired
to the real `signOut()`. **Where should it live — a row at the foot of Account,
or somewhere else?**

### (b) Scrim: two frames disagree with the rest of the file, and I followed them

Every mobile scrim in the file is drawn **52 down from the top and 52 up from
the bottom** (`1236:2937` · `1248:129` · `1885:151`) — the brand bar and the
bottom nav stay bright. The `Drawer` was covering the full viewport, so I
corrected it to match, which changes **every** scrimmed mobile drawer (delete
file, feature locked, More, sign-out). Same logic as design-guidelines §10:
persistent chrome is not the thing being interrupted. Two things to confirm:

- the bottom 52 leaves the nav's **top 4px** under the scrim (740 tall where
  736 would stop clean at the nav's edge). Built as drawn — say if it should be
  736;
- `1885:151` runs the full 792 to the floor rather than stopping at 792−52.
  Two frames say 740, one says 792. I used 740.

Separately, the two nodes actually **named** `Scrim` (`1236:2937`,
`1248:129`) fill `#0a0605` at 45% where `1885:151` and design-guidelines §13
both say **42% black**, which is what the app ships. Two outliers against the
rest of the file — left on the token.

### (c) Toast widths cannot match the frame, and that is the frame

The card is a row — `15 · glyph 16 · 8 · label · 6 · action 60 · 15` — and all
three drawn widths fall out of it exactly. But the frames' label boxes are
hand-padded (160 for a `Memory added` that measures 94), so a card that hugs
its message comes out 66 / 77 / 21 narrower than drawn, precisely the padding.
Every anchor is exact; only the arbitrary slack is gone. A real toast has to
size to its message, so this is built to hug. Flagging in case those widths were
deliberate.

### (d) Two more off-scale radii, four more off-ramp greys

Radius **8** on the toast card and **10** on the sign-out commit, against the
0/2/12/20 scale (the notifications card's 12 is on it). Greys: `#9e9c99` (More
chevron), `#ecebe9` (More rule), `#d4d3d0` (notifications card), `#1a1817` (its
glyph outline) — now tokens. Shipped as drawn.


## ✅ §30 + §31 — RESOLVED by round 4, five items carried to round 5

`FIGMA-FIX-ROUND-4-RESPONSE.md`, verified node-by-node in the file before
building. Unlike rounds 1-2, every claim held.

**Closed:** three missing mobile Data Room frames drawn (`2071:2215`
search results, `2072:2278` loading, `2073:2337` no results) · sign-out trigger
decided (last row of Account, `184:5`) · auto-height on body copy · toast labels
hug so the card widths derive from the row · mobile scrims unified at 42% black,
y52 h736 · both hug glyphs centred · three radii to 2 · five greys merged onto
the ramp.

Two things the new frames settle that the desktop ones do not: **compact loading
and search results carry no count in the header at all**, and compact no-results
reads `NO MATCHES`. Compact loading also drops the tag placeholder - three
skeleton rectangles, not four.

**Carried to `FIGMA-FIX-ROUND-5-PROMPT.md`:** the mobile toasts kept radius 8
(`1928:142` / `1928:139`) while desktop went to 2, so the build ships 2 at both
widths · `#e5e5e3` wants a named fill variable · `2071:2231` names a file absent
from the library · `1808:121` missed the auto-height sweep · the peek-drawer
reconcile (flag 2) is still outstanding.


## §32 — Page 184:5 (Profile & Wallet): what the build turned up

Built so far: **Wallet** desktop + mobile + the four top-up cards at both
widths; **Account** desktop hub with all seven centres, the mobile menu and
details, the four confirmations at both widths, and the seven editing drawers;
**Help** desktop + compact. All measured against their frames.

### (a) The first non-accent hue in the app — needs a ruling

`#1a7f4b`, a green, appears in two roles on the Wallet:

- **`+$186`** in the activity list (`1623:61`) — money coming *in*. I think this
  is right and I have built it: a credit is not an error and not a call to
  action, and accent reads as both.
- **The plan-feature ticks** (`1553:15`, `1553:21`–`29`). But the Data Room's
  upgrade card draws the same semantic in **accent** (`1885:98`–`104`).

Same meaning, two colours, two screens. Which one is the rule?

### (b) The account confirmations carry three radii on one card

`1648:67` and siblings: card **8**, commit **4**, and the fields **2**. Flag 8
settled 2 everywhere except confirmation overlays at 12. None of these three is
either. Shipped as drawn.

Also off-scale on this page: the top-up amount chips at **8** (`1854:127`), and
the top-up cards themselves at 8.

### (c) Four frames still scrim at the old extent

Round 4 unified mobile scrims to y52 **h736**. These four were not in that
sweep and still read **h792**: `1658:117`, `1662:21`, `1662:73`, `1658:172`
(the account confirmation drawers). The shared `Drawer` uses 736, so the build
is right and the frames are behind.

### (d) A stale pane copy in the confirmation frames

`1646:2` / `:54` / `:106` / `:158` all carry a **`Context questions`** row in
their account pane (`1646:30` and siblings) that `1596:2` no longer has, which
pushes Security down from 278 to 306 and every rule after it. The current pane
is `1596:2`; those four are older copies. Built to `1596:2`.

### (e) Three stray `Danger card` frames — **partly withdrawn**

`1698:64`, `1700:29`, `1864:60` — 358×136 frames at 16/398 under the content of
the two-factor, password and sign-out-device drawers.

I called these "drawn by nothing". That was half wrong: the card is **real** —
it is `1691:2` on compact Security (`1686:2`), the third card, carrying Reset
and Delete account. What is in those three drawers are *copies* of it left
behind. The component is built; only the three copies want deleting.

### (f) The 0.895 scale artefact, in nine more places

Every field in the account drawers (`1698:32`, `1700:42`/`45`/`48`,
`1884:134`/`138`, `1667:165`, `1672:219`) and the Help composer's subject field
(`1711:161`) render at **39.38 tall / 12.53 type / 12.53 inset** — 44 / 14 / 14
scaled by 0.895. Shipped as drawn, as agreed for the earlier instances, but the
count keeps growing.

### (g) Two more hug artefacts

`1834:99` (the research-profile empty star) sits ~4 right of the column centre,
the same thing round 4 fixed on `1808:119` and `1812:97`. And `1623:36` /
`1626:107` — the `TODAY` marker on the budget chart — is centred **20** right of
today's bar on desktop and **32** on compact, rather than on it. Replicated;
both look like hand placement.

### (h) Two more greys, and one near-duplicate

`#47463f` (the `SHARPEN YOUR PROFILE` / `MEMORIES` eyebrows) is genuinely new.
`#ecebea` (the memories-card rules and the depth track, `1736:139`) is **one
value off** `#ececea`, which is `line-050`. Merged in code; worth merging in the
file.


## §33 — Page 184:5 is complete; three more findings

All **44 screens** built and measured. These came out of the last sixteen.

### (a) Compact copy differs from desktop, per frame — confirm it is deliberate

| Desktop | Compact | Frames |
|---|---|---|
| `NO MEMORIES YET` | `NOTHING LEARNED YET` | `1834:8` / `1811:7` |
| `7 MEMORIES` | `7 THINGS LEARNED` | `1736:8` / `1680:7` |
| `MEMBER SINCE MARCH 2025` | `MEMBER SINCE MAR 2025` | `1615:5` / `1669:7` |

Built per frame. The month abbreviation is clearly a width fix; the other two
read as deliberate rewordings, but they mean the same thing twice, and a user
who moves between devices sees the same screen say two things.

### (b) `1581:154` is the only non-detent drawer in the file

Every other mobile drawer is peek 94 / half 408 / full 760. The Wallet's plans
drawer is **368** — exactly three plan cards and a composer. I gave `Drawer` an
optional height rather than adding a fourth detent for one instance. If 368 is
meant to be a detent, say so and it becomes one; otherwise it stays an override.

### (c) The compact memory list shows five of seven

`1680:26` draws five memories where the header counts seven, with no "show all".
Built as drawn — the entry row underneath goes to the questions, not to the
rest of the list. Worth confirming the remaining two are reachable somewhere.


## §35 — Page 184:6 (Insights): built, measured, four flags

`184:6` is the smallest page in the file — **two frames**, `1231:2860` desktop
and `1277:196` compact — and **both are the coming-soon state**. There is no
"live" Insights drawn anywhere, so per hard rule 8 the coming-soon state *is*
the screen. Built at both widths, measured to zero delta, gate green.

Four things the frames want deciding.

### (a) ✅ `#2e7d33` — RESOLVED: red/green for up/down, on one hue

The three rising deltas (`1261:105`, `1261:108`, `1261:111`) are drawn `#2e7d33`,
a **second green** against the Wallet's credit `#1a7f4b`.

`FIGMA-FINAL-ALIGNMENT.md` §5 would send them to **accent** — §1.1 reserves green
for the `+$X` ledger credit and nothing else. I built that, flagged that it left
`▲` / `▼` as the only carrier of direction on the one page whose job is showing
market movement, and asked.

**Joy, 2026-08-14: red/green for up/down is the convention — follow it.** Done.

The build resolves it on **one hue, not two**: a new `--color-market-up` that
deliberately carries `credit`'s `#1a7f4b`. Two greens 20 apart was the drift
§1.1 set out to kill; one green doing two *named* jobs is not the same problem,
and naming the second role means either can move later without touching the
other.

**⚠ This overrules §5 for those three nodes.** The design session should send
`#2e7d33` → **`#1a7f4b`**, not → accent. §1.1's rule wants restating as:
*green marks a positive signed quantity — ledger credits and market movement.
It is never a tick, a status or a feature marker; those are accent.*

### (b) The first feed rule breaks the row rhythm by 8 — still open

Feed rows sit at 444 / 524 / 604 / 684 — a clean 80 pitch. Their dividers sit at
**428 / 516 / 596 / 676** — gaps of **88, 80, 80**. The first rule is 8 higher
than the other three are above theirs.

Matched as drawn (hard rule 5) and carried per row in the code rather than
derived, so nobody "fixes" it back. **`1247:107` wants moving 428 → 436** if it
is a slip; tell me if the extra air above the first row is intended.

### (c) ✅ The feed rules are `#e9e8e6`, 3 off `line-050` — on §5's retire list

Every other rule in the file is `line-050`. `1247:107` / `:114` / `:121` /
`:128` are `#e9e8e6`. Built on the token. Same family as the off-ramp greys
already logged in §30 and §32 — this is now the **fourth** page where a rule or
hairline was hand-picked rather than taken from the token.

### (d) ✅ Radius: the chart bars are r1 and the feed squares r3 — both now 2

`1246:124`–`129` (the six bars) are radius **1**; `1253:121`/`127`/`133`/`139`
(the feed squares) are radius **3**. The scale is 0 / 2 / reserved. Both built at
**2** per §34 ruling 2. Six + four nodes to normalise.

### Not a flag, for the record

Every figure on the page reads `XX` or `YY%`, and the only stated number is
`25M SOURCES` in the feed eyebrow. **That is the design and I kept it** — a
coming-soon page that invents plausible market figures is the one thing Insights
must not do. There is a test that fails if anyone later replaces them.

The compact drawer keeps three of the five facets: `INDUSTRY` and `TIME RANGE`
are the ones dropped. Confirm that is the intended pair — it is what `1277:196`
draws, and the reasoning holds (most options, least likely to be set on a
phone), but it is a product choice, not a layout one.

---

## §36 — The final alignment pass, applied to the build

`FIGMA-FINAL-ALIGNMENT.md` arrived while I was measuring Insights. It closes
three of my four §35 flags before I raised them — the design session's own
pre-flight caught the stray green, the off-scale radii and the off-ramp greys
independently, which is the first time the two sides have converged without a
round-trip.

**What I changed in the build to meet §1:**

| § | Locked value | Build was | Now |
|---|---|---|---|
| 1.4 | Peek border = **top edge only**, shared with half/full | peek had a full 4-side hairline | shared `DRAWER_LIFT` |
| 1.4 | Handle 44×5, r**2.5**, y**12**, `#c7c4bf` | peek had r3, y**9**, `#d3d1c7` | unified; `--color-handle-peek` retired |
| 1.4 | Drawer top corners **20** | the three persistent peeks used **16** | `--radius-drawer` (20) |
| 2 | `fill/chip` `--color-fill-chip` | `--color-chip-quiet` | renamed |
| 2 | `text/label` `#474642` | `--color-eyebrow-strong` `#47463f` | renamed + retoned |
| 5 | `#deddda` / `#e6e5e2` retired | two Insights-only tokens | both → `fill/skeleton` |
| 1.2 | 12 = overlay **only** | token comment still said "layout cards" | comment corrected |

Measured after: all three peeks and the half drawer now report h94 / bottom 56 /
radius 20 / handle 44×5 r2.5 at y12 `rgb(199,196,191)` / border
`rgb(224,222,217) inset 0 1px 0` — identical across `/wallet`, `/account`,
`/help`. Gate green.

**Two things worth your eye** (a third, the delta colour, is settled above):

**(a) The peek radius moved 16 → 20.** §1.4 locks drawer tops at 20 and the
peeks are drawers, so they follow. If the peeks were deliberately tighter than
a half drawer, that intent is now gone — tell me and I will put it back.

**(b) Three pages were pasting the same peek.** `/wallet`, `/account` and
`/help` each carried their own copy of the same fourteen classes, which is why
§1.4's unification would have needed the same edit in three files. They now
share a `PeekSheet` that reads its numbers from `Drawer`'s constants. It is
deliberately **not** a `Drawer`: these never close, and giving a permanent
affordance `role="dialog"` announces a modal the user cannot exit.

**One value in §1 I could not verify:** §1.4 says "a top drop-shadow carries
lift" without a number. I used `0 -2px 16px rgb(0 0 0 / 0.06)` — the value the
three hand-built peeks already carried — for all three detents. If the master
has a different shadow, send it and I will match.

---

## ✅ §37 — RESOLVED: Ask threads (Joy, 2026-08-15)

Ask now runs against the reference service. A red dot sends its anchor and
section, a free-form question sends neither, and both stream back a framing
line, the quoted figure and the answer.

**✅ Built. Turns stack, oldest first.**

The frame settled it. `REPORT GENERATED · 13 JUL` sits *inside* the drawn
exchange, between Caspr's reply and the quoted answer — it separates the prompt
that produced the report from the answer that followed. That makes it a
**one-time boundary**, so a follow-up asked afterwards has no marker to draw,
and the rest of the turn is the same composition repeated on the same rhythm.
Nothing new was drawn.

**The turn gap is now derived, not guessed.** `708:2` — the Gate's scoping pane
— is the only multi-turn conversation drawn anywhere in the file. It puts 24
between a bubble and its reply (twice) and **36** between one turn and the next:
a boundary is **1.5× the reply gap**. Applied to Ask's own reply gaps that gives
**24** on the pane and **9** in the drawer, which is what the build uses.

It replaced 27, which was the eyebrow gap borrowed for a different job — "below
a heading" is not "between turns", and it only looked right by accident.

The ratio is drawn; applying it to Ask is the inference. Confirm 24 / 9, or draw
two Ask turns and I will measure it.

The original question, for the record:

A real Ask is a conversation — you ask, Caspr answers, you push back. The frame
shows one question and one answer, and its own `marker` row ("REPORT GENERATED
· 13 JUL") is described as the rule between *the pre-report thread and the
post-report one*, which implies a thread exists. But no frame draws a second
turn, so I have not invented one: asking again replaces what is there.

**Three ways out, and this is a design decision rather than a build one:**

1. **Leave it.** One exchange at a time. Defensible — the dot is the primary
   way in, and each dot is its own question about its own figure.
2. **Scroll the thread.** Exchanges stack in the pane and it scrolls. Needs one
   frame showing two turns and the gap between them.
3. **Keep the last answer, collapse the rest.** A middle path: the current
   exchange in full with previous questions as one-line rows above it. Needs a
   frame for the collapsed row.

The build supports any of them — the state is already a list-shaped fold; only
the rendering differs. Say which and it is a small change.

**One smaller thing, same page:** a question asked while an answer is still
streaming abandons the first stream. That is the right behaviour with one
exchange and the wrong one with a thread, so it moves with this decision.

---

## ✅ §38 — RESOLVED: draw the nine thumbnails (Joy, 2026-08-15)

Edit is wired to `propose_visuals` and works. The blocker is artwork.

**The numbers:** `EditChartPane` draws **3** thumbnails — `stacked-bar`,
`small-multiples`, `hundred-stacked`. The intent rail offers **6** intents. The
service returns **15** kinds across them.

So five of the six intents come back with nothing the pane can draw, and fall
back to the frame's own three. Clicking `Trend` today shows the same proposals
as `Composition`, which is worse than the pill doing nothing — it looks like
Caspr ignored you.

Even Composition is only partial: it returns `stacked-bar`, `hundred-stacked`
and `treemap`, so its third proposal is dropped and the pane shows two.

**Worth noting:** the frame's three thumbnails are not any single intent's set.
`stacked-bar` and `hundred-stacked` are Composition; `small-multiples` is
Compare. The drawn composition is a nice-looking sample rather than one
intent's answer, which is exactly what you would expect from a frame drawn
before the tool existed.

### What is needed

**The full set is 15 thumbnails**, by intent:

| Intent | Kinds |
|---|---|
| Compare | `grouped-bar` · `column` · `small-multiples` ✅ |
| Trend | `line` · `area` · `multi-line` |
| Composition | `stacked-bar` ✅ · `hundred-stacked` ✅ · `treemap` |
| Relationship | `scatter` · `bubble` · `quadrant` |
| Geography | `column-by-region` · `treemap-region` · `stacked-region` |
| Flow | `stacked-bar` ✅ · `column` · `area` |

Three exist; **twelve do not**. They are small (the existing ones are simple
vector marks at thumbnail size), and several repeat across intents, so the true
count of new drawings is closer to **9**.

### ✅ Decided: draw the nine

Joy chose option 1. The drawing spec — slot size, palette, and what each of the
nine has to read as — is in `FIGMA-DECISIONS-PROMPT.md` §1. The build needs no
change: it already filters proposals to the kinds it can draw and falls back
when it cannot, so the rail starts working the moment the thumbnails land.

The options as they were put:

1. **Draw the nine.** The rail works properly and Edit becomes what the spec
   describes. My recommendation — it is the smallest set of drawings that
   unlocks the most-used pane in the reader.
2. **Cut the rail to two intents** (Composition, Compare) until the rest exist.
   Honest, and nothing looks broken — but it hides a feature that already works
   on the service side.
3. **One generic thumbnail** for kinds without their own. Cheapest, and I would
   argue against it: the thumbnail *is* the proposal, and a generic mark turns
   "three ways I'd show this" into three identical boxes.

Until then the fallback is deliberate and visible rather than silent, and the
plumbing is complete — whichever you pick is a rendering change, not a rebuild.

---

## ✅ §39 — RESOLVED: draw the queued centre (Joy, 2026-08-15)

The queue works: above capacity a commit returns `queued` with a position, the
position falls as the queue drains, and it never goes up.

**But there is no queued screen.** The user lands on Generation, whose centre
draws the five section cards filling in — which is not what is happening. Their
analysis has not started.

For now the eyebrow carries it: `MARKET ANALYSIS · BRIEF · QUEUED · No. 3`.
That is within the drawn pattern (the title bar is `TYPE · DEPTH · STATUS` and
already fills in progressively), so nothing is invented — but the centre below
it is telling the user something untrue.

**✅ Decided: draw it.** The spec — scope, geometry, and what it must and must
not say — is in `FIGMA-DECISIONS-PROMPT.md` §2. No code change needed: the
queued phase already routes to Generation and puts its live position in the
eyebrow, so the centre is the only missing piece.

**What a queued centre needs to say:**
  · The work is **committed and paid for** — this is the single most important
    thing, because a queue that looks like a failure is a support ticket.
  · Their position, falling.
  · Roughly how long, if we can say it: position × average run time is a
    defensible estimate and better than silence.
  · That they can leave — it carries on without the tab open.

It is one centre on an existing screen, not a new screen: the title bar, rail,
pane and bottom nav are all unchanged.

**Alternative, if you would rather not draw it:** the Theater already means
"work is happening before your report exists". A queued analysis could sit in
the Theater with the counter idle until it starts. Cheaper, and honest, though
the idle counter is its own kind of odd.

---

## §41 — The decode is built and verified; the gate is the only thing off

**Correction to what I said earlier.** I reported the wiring as broken because
the row never animated in my browser. It was not broken. The Browser pane I
verify in runs **hidden**, and `requestAnimationFrame` does not fire in a hidden
tab — `document.hidden === true`, zero frames in 600ms, measured. The old flap
appeared to work only because `setInterval` still ticks (throttled) in a
background tab.

Two things misled me and both are now fixed:

· **`data-figma-node="762:2"` was on two elements.** The spec names the flap
  row `762:2`, and the Theater screen's own root already carries that id, so
  every probe I ran was reading the page root. The row now has its own marker.
· **rAF is the right choice and I am keeping it.** Pausing in a hidden tab is
  correct — it is the spec's loop guard, and it is kinder to a laptop than an
  interval that animates something nobody is looking at. The cost is that it
  cannot be checked by poking a hidden browser, so the painting is covered by
  **8 component tests** with a fake frame clock instead: glyphs churn, the word
  ripples left to right, the name resolves, each source announces once, the
  queue never skips one, and with the gate off every source still arrives with
  nothing drawn.

**So the only thing standing between this and shipping is the cultural
validation.** `GLYPHS_VALIDATED = false` until a Nsibidi/Ekpe reference has
checked the forms (§40). Flipping that constant is the whole switch.

---

## 🔴 §40 — The Theater decode spec arrived and is NOT built

`THEATER-SOURCE-DECODE-MOTION.md` landed in the repo and I did not act on it —
it came in while I was mid-flow on the wiring and I only found it sweeping the
tree. Flagging rather than quietly adding it to a list.

**What it specifies:** the flap row churns **Nsibidi glyphs**, flips the whole
line to a real cited source in English, then slides into the sources list.

**What the build does:** scrambles random uppercase alphanumerics, then snaps.
No glyphs, no slide, no per-cell stagger.

The *mechanism* is right — timing, queueing, never-idle, cleared timers — so
this is a re-skin plus a slide, not a rebuild. It is on my list and I will do it
after the four decisions land.

**One thing I want to raise rather than schedule.** The spec says the glyph
forms are "stylised renderings" and must be validated with a Nsibidi/Ekpe
cultural reference or consultant before ship. I think that is right and I would
go further: treat it as a **gate on the feature, not a step in it.**

Nsibidi is a living script with real and sometimes sacred meaning, and what we
have is our approximation of it. Shipping approximated sacred symbols as a
loading animation is hard to undo and entirely avoidable by checking first.

If the validation has not happened when everything else is ready, the honest
ship is the **reduced-motion path** — source names appearing plainly in the
list, citation dots intact. The spec already requires that path for
`prefers-reduced-motion`, so it is a code path we need either way and costs
nothing extra to lead with.

Asked in `FIGMA-DECISIONS-PROMPT.md` §4.

---

## ✅ §42 — Four build gaps — ALL FOUR FIXED (2026-08-15)

Written up because I found them looking rather than hitting them, which means
nobody has hit them yet — and one is on the product's front door.

**1. Welcome's input drops the prompt and lands on the dev harness.**
`WelcomePage` submits with `navigate('/compose')` and never calls
`submitPrompt`. So someone typing the first thing they ever type into Caspr
loses it, and arrives at an unstyled diagnostic page. Every designed screen
behind it works; the door does not open onto them. **I would fix this first.**

**2. Data Room files never reach an analysis.** The commit sends
`file_ids: []`, hardcoded. Upload works, Include/Exclude works, the room lists
them correctly — and no analysis has ever read one. The whole Data Room is
currently a filing cabinet with no door into the work.

**3. Outputs cannot be downloaded.** `output_ready` delivers a signed URL,
`OutputsPane` accepts an `onDownload`, and `WorkingPage` never passes one. The
button renders, does nothing, and the file sits there reachable only by reading
the WebSocket frame. The most annoying kind of bug: everything upstream is
right.

**4. Signup does not create an account.** `SignupPage` navigates to
`/email-sent` without calling auth. Signing *in* works. Signing *up* does not —
which for 1,500 re-engaged users is the wrong half to have working.

None is deep: they are four connections between things that already exist.
Together they are perhaps a day. **Tell me the order** — my instinct is 1, 4,
2, 3, because 1 and 4 are the two a new user meets first.

### ✅ All four are fixed. What each turned into

**1 — Welcome.** The prompt bar now calls `submitPrompt` and goes to
`/conversation`, so the first thing anyone types starts the analysis it
describes. I also removed `scoping` from the flow's automatic destination map:
that phase spans Conversation, Layout and Gate, so leaving it in would have
skipped Conversation entirely and yanked a user off the Gate mid-shortfall.

**2 — Data Room.** The commit reads the library, filters to the files marked
**Included**, and sends those ids — both at the top level and inside the
confirmed gate configuration, because the gate priced them and the two must
agree. A library that fails to load no longer blocks a paid analysis; the run
goes ahead without the room's files rather than not going ahead.

**3 — Download.** Bigger than it looked, because the button had nothing to point
at: the reference implementation published a url for a route that did not
exist. There is now a real one, and the link is genuinely signed —
HMAC over job, file, analysis, version and expiry, fifteen minutes, refused
403 if edited and 410 once stale. It is unauthenticated **by design**: a
download is a top-level navigation and cannot carry an `Authorization` header,
which is the same constraint that shapes SSE in §1.2.

Two things I got wrong on the way and caught: I first resolved the relative url
against `VITE_REALTIME_ORIGIN`, which is a `ws://` address — that would have
produced a link no browser fetches, failing silently. It resolves against the
MCP endpoint. And any url that is not `http(s)` is now dropped rather than
opened, because it ends up in a link the user clicks.

**One thing worth your call:** the reference renderer produces **plain text**
with `.txt` appended to the filename. We cannot produce a real PDF or PPTX, and
a file named `.pptx` that PowerPoint refuses to open is a worse stand-in than
one that is honestly a text file. Jayant's renderer replaces this and the
client changes nothing.

**4 — Signup.** The overlay now creates the account before advancing, with a
busy state and a single error message for every failure — distinguishing "that
email is taken" from "that password is wrong" hands an attacker a way to
enumerate our users. Verified against the running backend: the account is
created, the session is stored, and the wallet comes back with the $100 trial.

**A real gap this exposed** — our backend provisioned users with
`ensureByEmail`, so signing up with an existing email signed that person in and
the password was never verified. **Now built; see §43.**

### Also fixed alongside, because it blocked verification

`npm run dev` could not bring up all three processes under a harness that sets
`PORT`: the backend and the AI service both read it, so whichever bound second
died on `EADDRINUSE` with a message that did not say which. Each service now
takes `--port` (passed explicitly by the root script), then its own named
variable, then `PORT` last for a production container.

---

## ✅ §43 — Real signup, password verification and email verification (2026-08-15)

You asked for this after §42; it is built and verified over the real wire.

### What changed, and why each part is the way it is

**Passwords are hashed with scrypt** — per-user salt, self-describing
parameters so the cost can be raised later without signing everyone out, and a
constant-time compare. No new dependency: argon2 or bcrypt would be a native
build in every environment we deploy to, for a margin that does not matter at
our scale.

**Signup answers identically whether or not the email is registered.** This is
the decision in here most worth your attention, because it will look like a bug
the first time you test it. If the API said "that email is taken", it would be
a way to ask *"does this person use Caspr?"* about anyone whose address you can
guess — and our users are named partners at consultancies and people at funds,
so the mere fact of an account is worth protecting. Whoever owns the address is
told, by email, which is the one channel that proves they own it. A second
signup also cannot overwrite the first account's password.

**The $100 trial is gifted at verification, not at signup.** An unverified
address is a free-analysis faucet with an unlimited supply of addresses behind
it.

**Sign-in gives one answer to unknown email, wrong password and OAuth-only
account** — and an unknown email still pays the cost of a hash, because
skipping it makes "no such user" measurably faster than "wrong password" and
hands back the same oracle through a stopwatch. Measured locally: unknown
72–110ms, real-account-wrong-password 95–149ms, i.e. the same band with noise
larger than any systematic gap.

**Unverified is the one failure that answers differently**, because that user
has an account and the right password and would otherwise be told their
credentials are wrong and go round in circles. It only reaches a caller who
already has the password, so it gives an attacker nothing.

**Five sign-in attempts per address per minute.** Hashing raises the cost of an
*offline* attack, against someone who already has the table. This is the online
one, which needs no breach at all.

### One thing I need your eye on

**`/verify` has no frame.** The emailed link has to land somewhere and nothing
draws it, so I built the smallest thing that can be true rather than inventing
a screen: on success there is nothing to show — the promise on Email Sent is
"click it to run your analysis" — so it signs the user in and goes straight to
the app. Only the two failures need words, and they reuse the existing auth
chrome exactly as `1183:252` composes it.

**The copy on those two is mine**, and it is the one thing here I would like
replaced or blessed:

> **That link has expired** — Verification links last 24 hours and work once.
> Sign up again with the same email and we will send a new one.

> **That link is not valid** — Check that you copied the whole link from the
> email, or sign up again with the same email.

### What is still outstanding, in the order I would do it

1. **A mail provider.** The backend prints the link to the console today. It
   needs SES (or Postmark) behind the `Mailer` seam — an afternoon, and it is
   config plus one implementation, no screen changes. **Nothing about signup is
   usable by a real user until this exists.**
2. ~~**Password reset.**~~ **BUILT** (2026-08-15). All three screens are wired;
   nothing new was drawn. Reset links last an hour rather than a day, confirming
   one revokes every existing session, and a verification token cannot be
   redeemed as a reset token or vice versa. It also rescues an account that
   never verified its address, and lets an OAuth-only account add a password.
3. **The 1,500 existing signups.** They have no password hash, so on migration
   they cannot sign in at all. The clean path is to import them as verified
   accounts with no password and send everyone a set-a-password link — which is
   the reset flow above, and is also a re-engagement email you wanted to send
   anyway. Worth deciding together rather than me choosing.

---

## ✅ §47 — Jayant's team on the chat: mostly right, one distinction missing

They are right about the thing that matters, and their argument contains a fact
I did not have. §46 is amended rather than defended.

### What they are right about

**The tool calls.** This is the strongest point in their reply and it is decisive.
Their thread is not `[user turn, Caspr turn]` — it is an **agent trace**: tool
calls, arguments, results, metadata. One Ask can fan out into several calls before
an answer comes back. That means a visible turn is a *rendering* of the trace, not
a position in it, and my `after_ordinal` cursor was quietly assuming the two lined
up. They do not. **Only the side that writes the tool calls can resume the thread.**

**A thin view is not a resumable thread.** Correct, and I said the opposite by
implication when I wrote that the service could "reconstruct the thread from its
own turns plus the user turns it already received". For a trace, it cannot — the
user's questions are the smallest part of what it needs.

**Copying the blob and syncing it would be the expensive path.** Also correct —
though this was never the proposal. That is option A/D in §46, which I rejected
too. We agree; they were arguing against a position nobody held.

### The one distinction their reply flattens

**There are two conversations, not one, and only one of them is theirs.**

| | Pre-gate: prompt → clarifying questions → answers | Post-gate: Ask, Edit |
|---|---|---|
| What it is | A prompt and some answers | An agent trace with tool calls |
| Resumable from the user's turns? | **Yes** — that is all there is | No |
| Exists when? | **Before** anything is committed or paid for | Only after a delivered analysis |
| Owner | **Product** | **AI service** |

Their case is airtight for the right-hand column and does not reach the left. Four
reasons the pre-gate half has to stay product-side:

1. **It exists before there is anything to own.** A Draft is a prompt typed by
   someone who has not committed, not paid, and may never do either. Putting it in
   the AI service means every half-typed idea becomes a write into their
   infrastructure and their retention scope.
2. **The library must load when the AI service does not.** That is an existing
   rule, not a new one, and a draft with no title is a row that says nothing.
3. **The migration has nowhere else to land.** ~1,600 users' unfinished
   conversations come out of the old Postgres at cutover. There is no analysis on
   their side to attach them to, so they would have to be pushed into their store
   as analyses that were never proposed.
4. **There is no analysis id yet.** One is minted by `propose_layout`. Everything
   the user types before it comes back has nothing on their side to belong to.

**And this is not two copies.** The clarification answers do reach them — inside
`trigger_generation.clarifications[]`, which is already in the contract — but as
*input to generation*, exactly like `client_knowledge`. Their store of record is
the trace; ours is the draft. Different objects, one writer each.

### The rule, restated — better than the one it replaces

§46 drew the line at **authorship**. Theirs is better: draw it at the **gate**.

> **Before the gate, ours. After the gate, theirs.**

It is one line, it needs no per-field adjudication, and it happens to coincide
with the money boundary, the draft boundary and the content boundary at once.

### Already changed in the build

`conversation_turns` accepted four kinds. It now accepts **two** — `prompt` and
`clarification_answer` — and the route **rejects** `ask_question` and
`edit_instruction` with a test pinning that. Nothing wrote them, so nothing was
lost; what is gone is the room to drift into a second source of truth later.
`section_id` and `anchor_id` came out with them: they only ever described
post-gate scope.

### What we still need from them

1. **The thin view API, as they offered.** For Ask, per analysis and version:
   question, answer, quote, scope, timestamp, in order, with paging. Their shape
   — we render it, we store none of it.
2. **Two questions their reply does not answer:**
   - **Is the thread version-pinned?** Ask is scoped to a version here, and
     restoring an earlier version must not silently show a thread about a
     different one.
   - **What is the retention?** If a trace is pruned at 30 or 90 days, a user's
     Ask history disappears from the reader. That may be the right call — traces
     are large — but it is a product decision, not an infrastructure one, and we
     should be the ones telling users rather than finding out.
3. **Confirmation that they do not want the pre-gate turns.** They already receive
   the answers at `trigger_generation`. If they would rather own the drafts too,
   that is a different conversation and it needs answers to the four points above
   — particularly the migration.

**Nothing is blocked.** The pre-gate half is built and working; the Ask thread is
ephemeral today exactly as it is now, and becomes durable the day their view
lands, with no rework on our side.

---

## 🟡 §46 — Where the chat sits (tech team's question, 2026-08-15) — **amended by §47**

**Neither side. There is no copy at all.** The premise of the question — two
copies drifting out of sync — describes a problem we do not have yet, because
nothing durable exists to drift.

### What is actually true today

| | Where it lives | Survives a reload? |
|---|---|---|
| Prompt + depth | React state | No |
| Caspr's clarifying questions | React state (from `propose_layout`) | No |
| The user's answers | React state; sent to the AI **only at commit**, inside `trigger_generation.clarifications[]` | No |
| Ask Caspr thread | React state in `useAsk` | No |
| Edit instructions | React state | No |

Checked rather than assumed:

- **Product database:** no conversation table and no Ask table. `annotations` is
  section comments, a different feature; `context_layer` is the per-user
  get-to-know-you profile, not per-analysis.
- **AI side:** `trigger_generation` *receives* the clarification answers but the
  store keeps only `prompt`, `depth`, `layout` and `revision` — the answers are
  not retained as a thread. `ask.ts` persists nothing.
- **The contract:** `api-spec-v2.md` has no `retrieve_conversation` and no Ask
  history read. There is no way to ask either side for a thread.

So closing a tab mid-conversation loses the conversation, and reloading a
delivered report loses every question the user has asked about it. That is the
same root cause as the missing Draft state in §45.

### The four options, and why one of them is not really a choice

**A — product side holds everything.** Caspr's answers would have to transit and
rest in our database. That breaks §1.8 (analysis content never lives here),
enlarges the blast radius of a product-side compromise from "metadata" to "what
our clients are researching and what we told them", and makes us the store of
record for text Jayant's service generates. **No.**

**B — Jayant's side holds everything.** Clean, one writer, no sync. Two real
costs. The library needs the prompt to title a draft and to resume it, so every
half-typed idea becomes a write into the AI service *before* anything is
committed or paid for. And when the AI service is unavailable the user cannot
see **their own question**, which contradicts the rule we already hold
elsewhere: the library must load when the AI service does not.

**C — split by who wrote it. Recommended.** Not two copies of one thing: one
record, divided by authorship, with exactly one writer per fact.

| Turn | Owner | Why |
|---|---|---|
| The prompt | Product | It is the user's, it titles the draft, it is what resumption needs |
| Clarification **answers** | Product | User input, and it feeds the context layer |
| Ask **questions** | Product | Same — and it is what lets a thread render at all when the AI is down |
| Edit instructions | Product | User input |
| Clarifying **questions** Caspr asks | AI | Derived from the layout |
| Ask **answers**, with quotes and citations | AI | Derived from the report and its sources — §1.8 content |

There is **nothing to keep in sync**, because no fact is written twice. A thread
is assembled at read time by `analysis_id` + turn ordinal. And the failure mode
is honest and already the house pattern: if the AI service is unreachable you see
your own side of the conversation and a placeholder where the answer goes, rather
than an empty screen.

This is also not a new pattern for us. `context_layer` already lives product-side
and travels to the AI as `client_knowledge` on `propose_layout`. C extends
exactly that arrangement.

**D — two copies plus a sync protocol.** What the team was worried about. Needs
versioning, conflict resolution and a reconciliation job, and it still leaves us
holding content we should not hold. It is strictly worse than C on every axis.

### What C needs that does not exist yet

**One addition to the contract, from Jayant.** A read for the AI-authored turns —
the clarifying questions for an analysis, and the Ask history for a version.
Shape suggestion, deliberately minimal:

```
retrieve_conversation(analysis_id, version_id?) →
  { turns: [{ ordinal, kind: 'clarifying_question' | 'ask_answer',
              text, quote?, section_id?, anchor_id?, created_at }] }
```

Until it exists, C degrades gracefully rather than blocking: the product side
persists the user's turns — which is what Draft needs and what §45 is about —
and the AI-authored turns stay ephemeral exactly as they are now. Nothing has to
be rebuilt when the read arrives; the thread simply stops having gaps.

### The payload question — measured

The follow-up from the tech team: *if the product side owns the context, does it
have to ship the whole thing on every call, and does the payload get heavy?*

Measured, using the shapes the contract actually defines and realistic text
lengths:

| | Size |
|---|---|
| Pre-generation context (prompt + 6 clarification answers) | **0.73 KB** |
| One **user** Ask turn (the question) | **0.12 KB** |
| One **Caspr** Ask turn (answer + quote + scope) | **0.92 KB** |
| 20-turn thread — whole transcript | 21.0 KB |
| 20-turn thread — **user turns only** | **2.5 KB** |
| 50-turn thread — whole transcript | 52.5 KB |
| 50-turn thread — **user turns only** | **6.2 KB** |

Three things fall out of that, and together they answer the concern.

**1. The pre-generation context is not a payload problem at any scale.** It is
under a kilobyte. It is already being sent — `trigger_generation` carries the
clarification answers today — and nobody has noticed, because there is nothing
to notice.

**2. Caspr's turns are ~7.5× the size of the user's, and under the split they
never cross the wire at all.** That is the part worth sitting with: the heavy
half of a conversation is the answers, and the answers are already on the AI
side because that is where they were written. So the split is the **cheaper**
arrangement, not the expensive one. Sending "the whole context" is only
expensive in the design where the product side holds the answers too — which is
option A, the one we rejected for a different reason.

**3. Nothing needs re-sending cumulatively anyway.** Each user turn is sent
**once, when it happens**, and the request carries a cursor rather than a
transcript:

```
ask(analysis_id, version_id, question, scope, after_ordinal)
```

The service reconstructs the thread from its own turns plus the user turns it has
already received. That makes the payload **O(1) per call — 0.12 KB — rather than
O(thread)**. An O(n) payload would be a genuine design smell; it is also
avoidable, and this avoids it.

**And a hard transport fact that settles it.** `/stream/ask` is a **GET** with
query parameters (`analysis_id`, `question`, `section_id`, `anchor_id`,
`version_id`), because SSE is consumed with `fetch` and the token has to travel
in a header (D2). A 20-turn transcript is 21 KB; practical URL limits are around
8 KB and ALB's is lower. So "send the entire context every time" is **not
available on the current transport** — it would require turning Ask into a POST.
The cursor design fits the transport we already agreed.

### The honest residue

One thing I do not want to gloss: under the split, the AI service *does* end up
holding the user's turns for the life of an analysis, because it needs them to
answer a follow-up. So there is a second copy of the user's half.

It is not a sync problem, and the reason is structural rather than hopeful: that
copy is **append-only with a single writer**. Turns are only ever appended, only
ever by us, always in order. There is no update, no delete and no second writer,
so it can **lag but cannot diverge** — and the lag is closed by the next append.
That is a categorically different thing from two mutable copies needing
reconciliation, which is what option D would have been.

The product side stays the store of record. The AI side's copy is working state
it is free to discard once the analysis is complete.

**What I am building now:** the product-side half. It is unblocked, it is
required for Draft either way, and it is the same code whichever of B or C we
end up with.

**What I need from you:** a yes to C, and the `retrieve_conversation` ask put to
Jayant. If the tech team prefers B, say so before I wire the read path — the
persistence work is shared, but where the prompt is written is not.

---

## 🔴 §45 — Old reports and unfinished conversations (Joy asked, 2026-08-15)

Two questions, and my earlier one-line answer in `migration/README.md` was too
glib on both. Correcting it.

### First, a correction

I wrote that migrating report metadata "would produce a library full of rows
that open onto nothing". That reasoning was about **our** architecture rule —
analysis content never lives in the product database — not about the old app,
and it read as though the old content did not exist. **It does.** The old
database holds both:

- **The rendered files.** `reports.s3_uri` and `report_versions.s3_uri` carry
  `{md, pdf, html, pptx, info_pdf}` per version, plus `poster_image_url`.
- **The structured content.** `cards.content` (jsonb), `cards.citations`,
  `sub_sections`, `summary`, `tables`, and `web_search_citations` with
  `was_cited_in_output`.

So this is a real choice rather than an impossibility.

### Q1 — keep the old deliverables, or convert them?

**Converting is not a SQL job, and it cannot be done losslessly.** Three things
stand in the way, in order of how hard they are:

1. **There is no way to put a report into Jayant's store.** `api-spec-v2.md` has
   six tools and none of them ingests an existing analysis. The new reader gets
   its content from `retrieve_analysis`, so a converted report has nowhere to
   live until Jayant adds an import capability. That is a contract change and a
   cross-team one.
2. **The new reader needs two things the old data does not have.** Every
   section carries `anchors` — the red dots, each with its own pre-written
   explanation — and the executive summary carries an `infographic`. Neither
   exists in `cards`. They would have to be **generated**, per report, at real
   cost.
3. **Generating them means writing new text onto old conclusions.** Hard rule 9a
   says report content is never rephrased or edited. Anchor explanations are not
   the report, so this is arguably within the rule — but it is new sentences
   attached to somebody's delivered analysis, and I would not want to do that
   silently.

**My recommendation: keep the files, do not convert.**

- **A — keep them (recommended).** The old S3 objects come across as downloadable
  documents in the library, marked as archive. It is SQL plus a bucket policy,
  nothing is generated, nothing is invented, and every user keeps every
  deliverable they paid for. What they do not do is open in the new reader.
- **B — convert.** Needs Jayant's import tool, a generation pass per report, and
  the judgement call in (3). Weeks, cross-team, and it produces reports that are
  subtly not what was delivered.
- **C — A now, B on demand.** Migrate the files, and convert individual reports
  later if and when someone actually asks. This is the path I would take: it
  spends nothing on the reports nobody opens again, which will be most of them.

**What I need to size it:**

```sql
SELECT count(*) AS reports,
       count(DISTINCT m.user_id) AS users,
       count(*) FILTER (WHERE r.s3_uri->>'pdf' IS NOT NULL) AS with_pdf
FROM reports r JOIN messages m ON m.id = r.chat_id;
```

### Q2 — unfinished conversations

No, and the reason is worse than a migration oversight: **our app does not keep
unfinished conversations for new users either.**

A draft is written to the library from the **Theater onward** — that is, after
the gate, after payment. Everything before it (the prompt, the clarifying
answers, the proposed layout) lives only in the browser tab. Close the tab
during the conversation today and it is gone.

That is a build gap, and it is mine. Two things make it clearly a gap rather
than a decision:

- `analyses.status` in our own schema already includes `draft`.
- The designed library and Welcome's recent list both draw a **Draft** state.
  Nothing in the app ever creates one.

**So the order is: fix ours first, migrate theirs second.** Once a draft
persists, an old chat can come across as one — but only partly, and the limit is
worth stating now: `messages.chat_messages` is a freeform chat, while our
pre-gate state is a prompt plus clarification answers plus a proposed layout. An
old conversation can migrate as a **draft prompt** carrying its text. It cannot
migrate as a proposed layout, because no layout was ever proposed for it. A
returning user would find their question waiting, not their structure.

**Ready to build the draft persistence whenever you say** — it is needed
regardless of the migration, and it is the difference between closing a tab
costing someone a sentence and costing them their thinking.

---

## ✅ §44 — The wallet takes money (sandbox), 2026-08-15

Top up now works end to end. Chosen amount → payment page → wallet credited →
receipt, with a declined path that credits nothing. Verified through the drawn
UI against the running services: paid balance $0 → $100, spendable $100 → $200.

**Hosted Checkout, not Elements.** Card details never enter a page we serve.
That is the difference between a PCI SAQ-A and something much larger, and it is
the cheapest decision available for the SOC 2 work coming.

**The sandbox is not a mock.** It builds a real `payment_intent.succeeded` event
and hands it to the same code the Stripe webhook uses, so it cannot pass while
the part that moves money is broken. Switching to real Stripe is two environment
variables and no code.

### Three calls of mine, all overrulable

1. **No Stripe SDK.** Creating a session and verifying a webhook signature are
   the only two things we do; both are small and documented. Against that, a
   dependency is a package to keep patched inside the payment path and weight in
   every cold start. Say the word and I will swap in the official library.
2. **A $10,000 ceiling on a single top-up.** The pricing model states the $20
   minimum (§8.3) and no maximum. Five figures at once is far more likely a typo
   or a stolen card than a customer, so it refuses rather than charging.
3. **The declined screen also covers "the user cancelled"**, because Stripe does
   not distinguish an abandoned checkout from a refused card in the return url.
   The drawn screen says declined; a cancelled checkout is not, strictly.

### What I need from you, when you have it

- `STRIPE_SECRET_KEY` — a `sk_test_…` key gets us onto real Stripe immediately.
- `STRIPE_WEBHOOK_SECRET` — `whsec_…`, from the Stripe CLI or the dashboard.
- Live keys at deployment; Jayant's team injects them and they never enter the
  repo.

**Not blocking:** the sandbox means the flow is testable today.

---

## 🟡 §49 — Where does the per-call token line actually render?

**The meter is removed. The thing that replaces it is not drawn.**

The `↻ 7/10 revisions` meter is gone from all three Edit panes (Joy,
2026-08-18) — it was an artefact of the old per-revision metering, and
`EDIT-ECONOMICS.md` retired the revision unit outright: *"a flat revision unit
is a lossy fudge"*, because Jayant's cost varies by change type. The frames
agree: `1131:2681`, `1395:15` and `1422:56` all now show a bare `OR JUST ASK`
with nothing beside it, and `＋ Generate bespoke` no longer carries `· 1
revision`. All of that is built.

What is **not** built is the replacement, because no frame shows it.
`EDIT-ECONOMICS.md` is explicit that reporting is required, not optional:

> **Minor edits show `0 tokens` explicitly.** Not merely unmetered — the
> interface *shows* a Minor edit consumed **0 tokens**, a positive signal that
> says "tinker freely, this is free."

So the model needs a surface that, after each edit, says what that call
actually cost — `0 tokens` for a Minor one, the real number for a regeneration.
Three things are undecided and I am not inventing them:

1. **Where it renders.** In the Edit pane where the meter used to sit? As a
   line in the Ask/edit conversation? On the proposal that was re-rolled?
2. **Whether a running balance is still shown anywhere.** The spec says a
   visible balance is part of what keeps this anxiety-free ("a visible balance,
   `0` on minor edits, and an edge-prompt are enough") — but the balance is
   account-level now, so it may belong in the wallet rather than the pane.
3. **The wording.** `0 tokens` is quoted in the spec; the non-zero case is not.

### Bigger than the display: **there is no transport for the number**

Checked 2026-08-18 after Joy asked whether the reference service could return
approximate token values for testing. It cannot, and the reason matters:

- **`packages/contract`** has no edit-token field anywhere. The only `token`
  hits are anchor parsing and `ask_answer_delta` streaming.
- **`api-spec-v2.md`** has none either — only auth tokens and the streamed
  delta.
- **`propose_visuals`** returns `{ proposals }` and nothing else. There is no
  apply/regenerate call that could carry a cost.

So the locked model's central mechanism — *"the engine returns the tokens
utilized after each call"*, the balance drawing down by actual usage, that data
feeding back to refine predictions — has **no field to travel in**. This is not
a UI gap; nothing is being metered at all.

### BUILT 2026-08-18 (commit `f40abf9`) — transport, variation and faults

Joy: *"yes go ahead, and put the token line in the Edit pane."* Done:

- **`EditCost { tokens, metered }`** added to the contract, additive. An engine
  that omits it is a legitimate state, not an error.
- **Reference service** returns varied values (~500 ±25% for a visual
  regeneration, seeded so runs repeat). Charts never metered.
- **Five faults** on the existing `x-caspr-fault` header: `cost_absent`,
  `cost_zero`, `cost_negative`, `cost_fractional`, `cost_huge` — tested over
  the wire, and ignored unless the service is started with `ALLOW_FAULTS=true`.
- **Client guard** treats missing / non-finite / negative as *unreported*
  rather than as a number. Fractions round; huge values are kept.
- **The line sits in the Edit pane**, in the retired meter's slot. `Free` for
  policy-free work, `0 tokens` for chargeable work that cost nothing, nothing
  at all when the service does not report.

**Still open on this:** no frame draws the line, so its placement is Joy's
instruction and its type treatment is inherited from the meter it replaced. It
wants a real frame before launch. **And Jayant still has to populate `cost`** —
until he does, every real edit reads as unreported.

**Original ask, for the record:**

1. **Joy:** a frame for the per-call line — or a decision that it lives in the
   conversation, in which case I will build it there.
2. **Jayant:** a `cost` object on every call that can regenerate, e.g.
   `cost: { tokens: number, metered: boolean }`. Additive, so it breaks nothing.
   Once it exists I can have the reference service return **varied, realistic**
   values — 0 for charts and Minor edits (the spec says never meter a chart),
   ~400–650 for a visual regeneration (the spec anchors one at ≈500 ≈ $0.50) —
   and extend the existing `x-caspr-fault` knob so testing can force the nasty
   cases: absent field, 0, negative, non-integer, enormous, and a value that
   arrives after the UI has already rendered. That is how we find out what the
   system does with a number it did not expect, before a real user does.

## 🟡 §48 — The decode's hidden word: how does a 5-letter word sit on a 20-cell line?

**Built without it. One decision needed, and it is small.**

`THEATER-SOURCE-DECODE-MOTION.md` describes an optional easter egg the Caspr
alphabet makes possible: because every letter now exists, the churning line can
occasionally resolve into a real word — default **`CITED`** — for a beat before
flipping to the actual source. Roughly one source in six. It is the payoff the
old ideogram set could not offer, and I think it is worth having.

What the spec does not say is **where the word sits**. The line is exactly as
long as the source name it is about to become, so on `S&P Capital IQ` there are
fourteen cells and `CITED` is five. Centred, left-aligned, or does the line
briefly shorten to five cells and grow back? Each reads differently, and the
last one costs the "no reflow, the word turns in place" property the rest of the
motion is built on.

Rather than pick one and call it the design, the decode ships without the easter
egg. Everything else in item 4 is built: the 36 glyphs, the churn, the flip, the
slide, and the removal of the cultural-validation gate. Adding the word later is
a contained change to one pure function.

**Ask:** left-aligned in the full-length line is my recommendation — it keeps
the no-reflow rule and reads as the script *saying something* rather than as a
separate caption. Confirm, or name another.

## ✅ §34 — Round 5's five rulings, applied

Joy, 2026-08-14. All five are in the build; the file needs to follow.

| # | Ruling | Applied as |
|---|---|---|
| 1 | **Green is for signed amounts only** | `+$186` keeps `#1a7f4b`. The Wallet's plan ticks (`1553:15`, `1553:21`–`29`) are now **accent**, matching the Data Room's upgrade card. |
| 2 | **Align to the radius rules** | Overlay and confirmation cards → **12**; everything inside them — commits, chips, steppers, field rows, checkboxes, chips — → **2**. Nine surfaces changed. |
| 3 | **Standardise the compact copy** | `NOTHING LEARNED YET` → `NO MEMORIES YET`; `7 THINGS LEARNED` → `n MEMORIES`. `MAR` stays — a width fix, not a rewording. |
| 4 | **Show every memory** | The compact card lists them all and grows; the header's count is now **derived** from the list, so the two can never disagree. |
| 5 | **Three detents, nothing else** | `Drawer`'s height override is gone. The Wallet's plans drawer ships as a **Half** (408) where the frame draws 368. |

Two consequences worth recording:

- **The build now leads the file on all five.** Every one is a place where the
  code is deliberately not pixel-identical to the frame, which is the first time
  that has been true by decision rather than by mistake. `FIGMA-FIX-ROUND-5-PROMPT.md`
  Part D lists exactly what to change so they converge again.
- **Radius rule, stated once:** overlay surfaces (modals, confirmation cards,
  popovers) are **12**; every control and content card is **2**; documents and
  bands are **0**; drawer tops are **20**. Pills, progress bars, pager dots and
  icon glyphs are fully-rounded shapes and are not governed by it.


---

## ✅ Resolved

- **Active nav item** = red icon **+ red label** everywhere (Joy, 2026-08-11).
- **Peek detent height** = **94px** — derived from 24 identical frames, not a guess.
- **Drawer motion** = `--motion-base` 180ms ease-standard open / `--motion-fast`
  120ms ease-in close, per `motion-and-interaction-states.md` §3 (supersedes the
  earlier 300ms ease-out, which predated reading the spec).
- **Phone verification** = ON at launch, OTP via AWS SNS.
- **Reference frames** — `(ref)` / `(representative)` / `(for review)` / Toasts
  demos are guidance, not screens (DEV-HANDOVER §5a).
