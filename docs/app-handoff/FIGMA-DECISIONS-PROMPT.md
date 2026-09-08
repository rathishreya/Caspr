> ⛔ **SUPERSEDED — folded into [`DEV-BRIEF.md`](DEV-BRIEF.md) (2026-08-19).** Kept for history. Do not build from this file.

# Caspr app — two things to draw, one to confirm, one to decide

**File:** `y2F394I4CwEeSzH2kKuDCt`
**From:** the build session · **Date:** 2026-08-15
**Companion to:** `FIGMA-FINAL-PASS-PROMPT.md`, which is **still outstanding** — this does not replace it.

Process notes, unchanged: `setCurrentPageAsync` before any sweep · read every node back after an edit · a `use_figma` call that throws rolls back every edit in that call, so guard `if ("cornerRadius" in n)` and split batches.

---

## Read this first

The product is **wired end to end**. Prompt → layout → gate → theater → generation → report runs against a real service over real transports; the wallet reserves and refunds; Ask, Edit, Outputs, the library, filters and search all work.

What remains is not plumbing. It is **four places where the build ran out of design** and I stopped rather than invent one. Each is small, and each unblocks something already working underneath.

Since the last version: **3 is built** — the file turned out to contain the
answer, in a frame I had not thought to look at — and it now needs one number
confirmed rather than a decision.

They are ordered by what they cost the product, not by effort.

**1 and 2 are decided and ready to draw** — both carry full specs below, taken
from the frames that already exist, so nothing needs inventing. **3 and 4 still
need an answer.**

Both of the decided ones land with **no further code change**: the build already
filters proposals to the kinds it can draw, and the queued phase already routes
to the Generation screen with its position in the eyebrow.

---

## 1. 🔴 The Edit pane has three thumbnails and six intents

**This is the blocking one.** Edit is the most-used pane in the reader after Ask, and five of its six intents currently do nothing visible.

### The arithmetic

`EditChartPane` draws **3** thumbnails. The intent rail offers **6** intents. The service returns **15** kinds across them.

So five intents come back with nothing the pane can draw and fall back to the frame's own three. Clicking `Trend` today shows the same proposals as `Composition` — which is worse than the pill being disabled, because it reads as Caspr ignoring you.

Even Composition is partial: it returns `stacked-bar`, `hundred-stacked` and `treemap`, so its third proposal is dropped and the pane shows two.

**Worth knowing:** the frame's three are not any one intent's set. `stacked-bar` and `hundred-stacked` are Composition; `small-multiples` is Compare. It is a good-looking sample, drawn before the tool existed — which is exactly what you would expect.

### What is needed

| Intent | Kinds | Exists |
|---|---|---|
| Compare | `grouped-bar` · `column` · `small-multiples` | 1 of 3 |
| Trend | `line` · `area` · `multi-line` | 0 of 3 |
| Composition | `stacked-bar` · `hundred-stacked` · `treemap` | 2 of 3 |
| Relationship | `scatter` · `bubble` · `quadrant` | 0 of 3 |
| Geography | `column-by-region` · `treemap-region` · `stacked-region` | 0 of 3 |
| Flow | `stacked-bar` · `column` · `area` | 1 of 3 |

Several kinds repeat across intents, so the true count of **new drawings is 9**: `grouped-bar` · `column` · `line` · `area` · `multi-line` · `treemap` · `scatter` · `bubble` · `quadrant`. (`column-by-region`, `treemap-region` and `stacked-region` can reuse `column` and `treemap` — regional framing is the data, not the mark.)

They are small: the three that exist are simple stroke marks at ~64×40 in the proposal card.

### ✅ DECIDED — draw the nine (Joy, 2026-08-15)

Here is everything needed to draw them, taken from the three that exist.

**The slot.** `ThumbPanel` inside the proposal card `1373:2`: **76 × 46**, radius
2, 1px `#e2e1de` border, background `#faf9f7`. The mark is drawn in that box
with ~7px of breathing room on each side, so the usable area is about **62 × 34**.

**The palette is fixed and is the report's own series colours**, so a thumbnail
reads as *this chart in miniature* rather than as an icon:

| Role | Hex | Used for |
|---|---|---|
| Series 1 | `#cbcac6` | the pale series |
| Series 2 | `#57564f` | the mid series |
| Series 3 | `#e8453c` | the one accent — at most one series per thumb |

Bars are 10px wide on an 18px pitch; lines are 1.5px. No labels, no axes, no
gridlines — at 76 × 46 they are noise.

**The nine, with what each has to communicate at a glance:**

| # | Kind | Intent(s) | The read |
|---|---|---|---|
| 1 | `grouped-bar` | Compare | Pairs side by side, same baseline |
| 2 | `column` | Compare · Flow | One series, ranked, descending |
| 3 | `line` | Trend | A single rising line, no fill |
| 4 | `area` | Trend · Flow | The same line with weight beneath it |
| 5 | `multi-line` | Trend | Two lines diverging — that gap is the point |
| 6 | `treemap` | Composition · Geography | Nested rectangles, one dominant |
| 7 | `scatter` | Relationship | Loose points with a visible drift |
| 8 | `bubble` | Relationship | The same, with size as a third dimension |
| 9 | `quadrant` | Relationship | A 2×2 cross with points weighted to one corner |

`column-by-region`, `treemap-region` and `stacked-region` reuse `column` and
`treemap` — regional framing is in the data, not the mark.

Name them `thumb/<kind>` in a frame beside the existing three (`1373:3`,
`1373:20`, and the 100%-stacked one), so they export the same way. Once they
land, the intent rail works with no further code change: the build already
filters to the kinds it can draw and falls back when it cannot.

---

## 2. 🔴 A queued analysis has no frame

Above capacity, a commit returns `queued` with a position. The position falls as the queue drains and never rises. All of that works.

**But there is no queued screen.** The user lands on Generation, whose centre draws five section cards filling in — which is not what is happening. Their analysis has not started.

For now the eyebrow carries it: `MARKET ANALYSIS · BRIEF · QUEUED · No. 3`. That is inside the drawn pattern — the title bar is `TYPE · DEPTH · STATUS` and already fills in progressively — so nothing is invented. **But the centre below it is telling the user something untrue**, and that is the part I will not paper over.

### ✅ DECIDED — draw the centre (Joy, 2026-08-15)

**Scope: one centre, on the existing Generation screen.** The title bar, rail,
pane and bottom nav are unchanged, and the eyebrow already reads
`MARKET ANALYSIS · BRIEF · QUEUED · No. 3` from the build. What is drawn is the
800-wide column that currently holds the section cards.

**Geometry to work within**, from `775:2`: content column 800 at x=547, opening
below the title bar at y=68. The generating composition it replaces is a stack
of `min-h 88` cards on a 1px `#e0ded9` divider — so the vertical budget is
familiar, and the queued centre should feel *lighter* than it, not heavier.

**What it has to say, in priority order:**

1. **The work is committed and paid for.** This is the most important line on
   the screen and the one a queued user most needs. A queue that reads like a
   failure is a support ticket.
2. **Position, falling.** The build has the live number; it updates on its own.
3. **Roughly how long.** Position × average run time is defensible. If you would
   rather not state a time, say nothing — a wrong estimate is worse than none.
4. **That they can leave.** It carries on without the tab open. Today nothing
   tells them that, so they sit and watch.

**What it must not do:** show progress. There is none yet, and a progress
indicator on work that has not started is the specific lie the current screen
tells.

**One state, not four.** Queued does not need empty/loading/error variants — the
error path is the existing `1827:2` failure centre, and there is nothing to
load.

---

## 3. ✅ Ask threading — BUILT (one number to confirm)

Ask threads. A red dot sends its anchor and section, streams back a framing
line, the quoted figure and the answer — and a follow-up now stacks beneath it
as its own turn rather than replacing what is there.

### ✅ Built — turns stack, oldest first

The frame answered it. `REPORT GENERATED · 13 JUL` sits **inside** the drawn
exchange, between Caspr's reply and the quoted answer: it separates the prompt
that produced the report from the answer that followed. So it is a **one-time
boundary**, a follow-up has no marker to draw, and each turn is the drawn
composition repeated on the drawn rhythm. Nothing new was invented.

**The gap between turns is now derived from the file, not guessed.** I went
looking for a drawn precedent and found one.

`708:2`, the Gate's scoping pane, is the only place in the file that draws a
**multi-turn** conversation. Measured:

| From | To | Gap |
|---|---|---|
| eyebrow `BEFORE CASPR WRITES` | turn 1 bubble | 17 |
| turn 1 bubble | turn 1 reply | **24** |
| turn 1 reply | **turn 2 bubble** | **36** |
| turn 2 bubble | turn 2 reply | **24** |

So a turn boundary is **1.5× the reply gap**, and the 24 appears twice, which
makes it a rhythm rather than a coincidence. Applied to Ask's own reply gaps
(16 pane, 6 drawer) that gives **24** and **9**, and those are what the build
now uses.

It replaced 27 — which was the *eyebrow* gap borrowed for a job it does not do.
"Space below a heading" is not "space between turns"; it only looked right by
accident.

**One caveat worth your attention: the compact number is weaker.** I checked
`639:2` (Conversation — Mobile) hoping for a second precedent, and it draws a
single turn too. So there is **no drawn multi-turn conversation at any compact
width anywhere in the file**. The pane's 24 rests on a measured ratio; the
drawer's **9 rests on that ratio alone**, and the drawer is not a uniform scale
of the pane elsewhere (its quote gap is *larger* than the pane's: 19 against
17). Treat 9 as the one I would most like corrected.

**What I need from you — one of these:**

1. **Confirm 24 / 9.** A yes and it is done; nothing to draw.
2. **Give me the two numbers.** If the ratio does not transfer to Ask, say what
   does and I will use it.
3. **Draw one frame with two Ask turns**, at either width, and I will measure
   it. The compact one is the more useful of the two.

Also fixed alongside: a new question no longer abandons the answer still
arriving. Several can be in flight, each writing into its own turn.

---

## 4. 🟡 The Theater decode motion — assets and a validation gate

`THEATER-SOURCE-DECODE-MOTION.md` specifies the flap row as an **Nsibidi glyph decode**: the line churns ideographic script, flips to a real cited source in English, then slides into the sources list.

**The build does not do this.** The flap currently scrambles random uppercase alphanumerics — the mechanism (timing, queueing, never-idle) is right, the *script* and the slide are not. That is a build gap, not a design one, and it is on my list.

Two things I need from the design side before I build it:

**(a) Confirm the glyph assets.** The spec names `Nsibidi — Theater decode glyphs` **`2099:168`** on `🧩 Components — Core`, twelve nodes named `nsibidi/<meaning>`, exportable as SVG (viewBox 24, `stroke-width 1.8`, round caps). Please confirm the node exists with all twelve and exports cleanly.

**(b) The cultural validation the spec itself requires — and I want to underline it.**

The document says the forms are *"stylised renderings"* and that they must be validated with a Nsibidi/Ekpe cultural reference or consultant before ship. That is not a nicety. Nsibidi is a living West African script with real and occasionally sacred meaning, and the current glyphs are our approximation of it.

Shipping approximated sacred symbols as a loading animation is the kind of thing that is very hard to undo and entirely avoidable by doing the check first. **I would treat this as a gate on the feature, not a step in it** — if the validation has not happened by the time everything else is ready, the honest move is to ship the reduced-motion path (plain source names appearing in the list) and add the glyphs later.

That path is specified and costs nothing extra: the spec already requires it for `prefers-reduced-motion`, so it is a code path we need regardless.

---

## What "done" looks like

- **1** and **2** **drawn** to the specs above — both are decided, and the build
  picks them up with no further code change.
- **3** — built. Confirm the derived turn gap (**24** pane / **9** drawer), give
  me different numbers, or draw two Ask turns. The compact **9** is the one
  worth checking: nothing multi-turn is drawn at any compact width.
- **4a** confirmed; **4b** answered with who is doing the validation and roughly when.

And `FIGMA-FINAL-PASS-PROMPT.md` is still open — Part 1 there (the red/green ruling reversing §5) is the one item in it that would otherwise move the file in the wrong direction.

Reply in the shape of `FIGMA-FIX-ROUND-5-RESPONSE.md`: a table of what changed with node ids, and your own calls marked as calls. That format has caught several of my errors already.

*Prompt from the build session · 2026-08-14.*
