> ⛔ **SUPERSEDED — folded into [`DEV-BRIEF.md`](DEV-BRIEF.md) (2026-08-19).** Kept for history. Do not build from this file.

# Caspr app — Figma reconciliation brief

**For:** the design session · **File:** `y2F394I4CwEeSzH2kKuDCt`
**From:** the dev session · **Date:** 2026-08-12

---

## What this is

The build matches Figma frame by frame — every screen is measured in the browser
against its frame's numbers and the deltas driven to zero before it ships. What
has accumulated is drift **inside the file**: the same thing drawn differently on
different frames, and values that have wandered off `design-guidelines.md`, which
is the locked system.

None of it is visible on screen. The cost is that every new screen becomes a
judgement call — when a frame says `#9c9b98` where its master says `#8c8a85`,
the file alone cannot say whether that is intent or a slip, so the build matches
the frame and raises a flag. That is why the flag list is long.

**Fix these in Figma and the dev session will re-match in a single pass.** Where
a fix is a component-level change, changing the master is enough — instances
will follow. Where a value was hand-drawn onto a screen, the screen needs
touching directly; those are called out.

**Ordering:** §1 is what actually changes what ships. §2–§5 are hygiene — real,
but nothing breaks if they wait.

---

## 1. New / changed screens

### 1.1 Generation — Mobile · failed  ·  NEW SCREEN  ·  390×844

The only compact screen with no designed state. A phone currently has nothing to
show when a run dies, which is the one failure every user eventually hits.

Start from **`777:83` "Generation — Mobile v3"** and keep all of its chrome:

| | |
|---|---|
| Header — Mobile v3 | 0 / 0 / 390×52 |
| Screen Title — Dark v3 | 0 / 52 / 390×58 · eyebrow `MARKET ANALYSIS · STUDY · GENERATING` |
| Bottom Drawer (Half) | 0 / 380 / 390×408, engagement carousel |
| Ask input | drawer-y 314 |
| Pane switcher | drawer-y 350 |
| Bottom Nav — v3 | 0 / 788 / 390×56 |

Remove the three report cards. In their place, centred inside 16px gutters, put
the centre of **`1827:2`** (Generation — Desktop v3 · failed):

- warning glyph — `1827:194`, 44×37, 1.6 stroke `#9E9E96`
- headline — "Generation stopped", Instrument Serif 30, `#1a1a17`, centred
- body — Inter 15 / lh 22, `#6b6b66`, centred:
  *"We hit an error partway through. You haven't been charged — your budget is
  intact. Try again, or contact support if it keeps happening."*
- `Try again` — accent commit, 358×46, radius 2
- `Contact support` — Inter Medium 13.5, `#6b6b66`, centred

**Size the body box for THREE lines.** At Inter 15 that string measures 959px,
so it needs three at a 358 measure. `1827:2` currently sizes it for two (460×44)
and its `Try again` / `Contact support` sit ~22px too high as a result — worth
fixing on the desktop frame at the same time.

**Your call:** does the failure collapse the drawer, or does the carousel keep
running underneath? The build currently assumes it keeps running.

### 1.2 Theater — Desktop · add the flap row  ·  `762:2`

**Joy approved 2026-08-12.** The mobile Theater draws the split-flap row —
`724:35`, the scrambling top row of the source list, `M9K2X0Q8ZP` in DM Mono 11
`#73706b` — and desktop has none; its list opens straight onto resolved names.
`theater-visualization-spec.md` §7 describes one engine driving both.

Add the row above the desktop source list. The build ships it now using the
mobile row's type at the desktop list's own 26 pitch; please confirm or restyle.

### 1.3 The Signal on compact needs room for its evidence line  ·  `971:71`

**Hard rule (Joy, 2026-08-12): report content is sacrosanct — the product never
rephrases, edits, abridges or truncates anything the API delivers, at any
breakpoint.**

`971:71` draws The Signal with only its claim. The 800 page (`812:29`) also
carries the evidence line — *"~2,400 mentions across forums, X and Reddit, and
9 named operators on the record · Jan–Jun 2026"* — which is the provenance the
whole block exists to provide.

The build now renders the evidence on compact too, so the card grows from **96
to ~178**. Please redraw `971:71` to hold both, and re-space the document below
it. The desktop treatment to match: Inter 10 / lh 1.4, `#8b8a96`, 10px under the
claim.

Same rule, worth a sweep: **anywhere a frame shows report content clipped,
ellipsised or abridged to fit, the frame needs to grow.** Report content means
section titles, body copy, The Signal, anchor explanations, source names and
version summaries. Navigation chrome, filenames and UI labels may still truncate.

### 1.4 "six sections" vs five cards  ·  copy or a card

`692:2`, `708:2`, `694:2`, `722:2` and both onboarding frames (`1301:3280`,
`1309:3280`) say *"Structure drafted — six sections…"* while drawing **five**
section cards. Either add a sixth card or change the copy to "five".

### 1.5 Intelligence needs its SOON treatment  ·  `708:63`

**Joy confirmed 2026-08-12.** Launch depths are Brief + Study; Intelligence is
Phase 2. `708:63` draws it as an ordinary selectable tier with no marker, so the
frame currently says a user can pick a depth that cannot be generated.

The build renders it at the frame's exact position and colours but
non-interactive, with a small accent `SOON` after the label. Please add that to
the frame so the two agree.

---

## 2. Radius — four values off the locked scale

`design-guidelines.md` §2 locks radius as a **semantic, reserved signal**:
`0` documents · `2` all functional chrome and page content cards · `12` layout
and overlay cards · `20` drawer tops. Rounding means something; these break it.

| Where | Node | Drawn | Should be |
|---|---|---|---|
| **Section cards pasted onto Layout Canvas + Gate** | `692:129`… and `708:17`… (10 copies) | **8** | **12** — their master `1301:3294` is already 12 |
| The Signal | `812:29` | **10** | 2 or 12 — compact already draws it at **2** |
| Edit selection chip + the three selects | `1125:7`, `1144:2904/2907/2910` | **4** | **2** |
| Generate Output add-card + queued rows | `1493:3`, `1493:7` | **6** | **2** |
| Filter pills | `926:2503` | 100 | fine — that is a pill |

The section-card one is the most worth doing: the **master is right and the
copies are wrong**, because they were pasted as frames rather than instances so
they never inherited the fix. The build ships 12 today, so the file and the
build currently disagree.

---

## 3. Colour — one accent, and a grey palette that has trebled

### 3.1 The accent has a second value
§1 says `#e8453c` is *the only* accent. The pane switcher's active label and the
Ask glyph (`1491:49`) use **`#e9453c`**. One unit, but it makes the accent
un-tokenisable. Please set it to `#e8453c`.

### 3.2 Greys: 4 → 15
The token file began with four text greys because the system specifies four. The
frames have since required fifteen, plus six hairlines where there were four.
Every one is faithful to its frame; several look like drift rather than intent.

**Text greys now in the build**

| Value | Where it came from |
|---|---|
| `#5c5b58` | `text/secondary` — the system value |
| `#9c9b98` | `text/tertiary` — the system value |
| `#8a8a85` | peek Ask placeholder `1579:9`, gate prices, Contents rows |
| `#8c8a85` | list-row chevron `673:5` |
| `#6f6e6b` | onboarding footer `1194:377` |
| `#6b6b66` | legal body, generation-failed body |
| `#73706b` | Theater counter label + flap row `755:6` |
| `#807d78` | layout-card bullets, Outputs dates |
| `#8a8884` | Updates description, Edit select carets |
| `#5c5c57` | report page index `812:23` |
| `#333330` | report body `812:26` |
| `#171716` | compact report body + Outputs filenames |
| `#9e9e96` | generation-failed glyph |
| `#a5a29d` | disabled commit label `1104:125` |
| `#8b8a96` · `#6b6a78` | The Signal's own cool greys |

**Hairlines now in the build:** `#e2e1de` (border) · `#e0ded9` (divider) ·
`#d9d6d1` (drawer edge) · `#ebe8e3` (list-row rule) · `#ececea` (gate rows) ·
`#f2f1ef` (Contents sub-rows) · `#e8e6e2` (Updates rows) · `#dcdad6` (Edit
toolbar).

**Ask:** collapse these to a named ramp — ideally 4–6 text greys and 2–3
hairlines — and tell us which of the above are deliberate. The build will
re-point in one pass. Special cases worth a decision:

- **The Signal runs a cool-grey family** (`#f2f2f4` / `#6b6a78` / `#1a1a18` /
  `#8b8a96`) against the warm greys used everywhere else. Deliberate signal that
  it is a different kind of content, or drift?
- **`#9c9b98` vs `#8c8a85`** on the analyses list row: the master `673:4` says
  one, its instances on `640:2` say the other.

---

## 4. Type and component drift

| Thing | The inconsistency | Suggested |
|---|---|---|
| **Pane heading** | 14 / `#474642` / 0.3 on five panes · **13 / `#1a1a17` / 0.26** on Contents `1446:157` · `#47463f` on Theater `763:78` | one style |
| **User bubble — three treatments** | pane: white + `#e5e3de` hairline, 12.5/15, hugs to 280 · Conversation centre: fixed 340×40, `#e0ded9`, 14/18 · Ask: **filled `#edece9`, no stroke**, 13/20 | confirm each is deliberate, or pick |
| **Pane content column** | five panes at **x=24 / 342**; Generate Output `923:2419` at **x=16 / 358** — one click apart, so content jumps 8px left and grows 16 | one column |
| **Report paragraph leading** | `812:26` and `812:28` at 16 · `812:35` at 20 — same style, same page | one, probably 20 |
| **Apostrophes** | `1527:7495` uses a straight `'` · `1827:196` uses a curly `’` | curly throughout |
| **Commit button** | every commit is Inter Medium 14 · Generate Output `924:24` is **Semi Bold 13.5** | Medium 14 |
| **Docked input slot** | every paned frame puts it at x=80 / w=358 · `692:2` alone at **x=76 / w=332** | 80 / 358 |
| **Ask on compact** | bubble and input span 16→374 · the divider rules span 16→358 | one inset |
| **Theater node sizes** | frames draw hub r22 / locked node r10 / idle r6 / line 2 · `theater-visualization-spec.md` §3–6 scales to r16.5 / 7.5 / 4.2 / 1 | frames win, but update the spec so they agree |
| **Outputs feed rhythm** | gaps run 19 / 19 / 10 / 14 with no derivable rule, so they ship as per-item data | one pitch, if it was meant to be regular |
| **Wallet balance** | rail `1541:7` is DM Mono · bottom nav `625:41` is Inter Medium — §3 says DM Mono is for figures | DM Mono in both |
| **Title card radius** | §5 calls it "square (0px)" · master `659:2` ships **2** | confirm 2, or square the master |

---

## 5. Small open values

- **`accent-pressed` has no value anywhere** — `motion-and-interaction-states.md`
  §4 specifies a pressed fill but no hex exists in the docs or the Figma
  variables. The build darkens the accent ~12% via filter. Please supply the hex
  or confirm the filter.
- **`--error` / `--error-subtle` tokens look dead** — every shipped error state
  uses brand red. Confirm they can be removed.
- **The Full drawer covers the bottom nav.** §10 says drawers stop at 788; the
  only Full instance in the file (`Help — Mobile (full · message)`) sits 84–844
  and paints over the nav. Confirm that is right for a full-screen composer, or
  move the frame.
- **Peek drawer chrome has drifted from the Half/Full master.** The 24 peek
  frames were hand-drawn and agree with each other but not with `628:5` —
  different handle colour, radius, offset and border. One master serving all
  three detents would settle it.

---

## What happens after

Send this back when the file is updated — or just say which items you have done
and which you are deliberately keeping — and the dev session will re-measure
every affected screen and re-match in one pass. Anything you keep as-is is
fine; it just needs to be a decision rather than an accident, so the next screen
does not have to guess.

Full running log with per-item detail: `QUESTIONS-FOR-JOY.md`.
