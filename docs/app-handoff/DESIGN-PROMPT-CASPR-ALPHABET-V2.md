# Design prompt — Caspr alphabet v2

*2026-08-31. Paste into the design session. One asset, one reason, precise brief.*

**Current asset:** `Caspr alphabet — angular full set (A–Z · 0–9)` — node **`2104:168`** on
`🧩 Components — Core`, file `y2F394I4CwEeSzH2kKuDCt`. 36 frames named `caspr-alpha/<char>`.
**Governing spec:** [`THEATER-SOURCE-DECODE-MOTION.md`](THEATER-SOURCE-DECODE-MOTION.md).
**Where it is used:** the Theater flap row — the decode animation above the source list.

---

## 1 · Why v2, in one measurement

**v1 glyphs are drawn square. The slot they live in is not.**

| | |
|---|---|
| v1 box | **46 × 46**, ink spanning 9.58 → 36.42 — **26.84 units, 58% of the box** |
| The slot | The flap cell, whose pitch matches the resolved source name in **Inter Regular 14** |
| Inter's average advance across these source names | **≈ 7.3px at 14px — roughly 0.52 : 1** |

So a square glyph sized to match Inter's ~10px cap height needs a **17.2px box, whose ink is
10px wide** — against a **7.3px** cell. It either overflows its neighbours or, sized to fit,
renders at ~7px of ink and **reads visibly smaller and lighter than the letters it becomes.**

**Neither is fixable by tuning.** A square glyph cannot sit correctly in a 0.52 : 1 slot. The
letterforms have to be redrawn narrow.

**The spec already anticipated this pass.** §Assets: *"This is v1 — a type-design polish pass
(optical sizing / spacing) is worth doing before it's a locked brand asset."* This is that pass,
and the trigger is now a measurement rather than a preference.

---

## 2 · The brief

**Redraw all 36 glyphs on a narrow box at monospace-style proportions.**

| Property | Value |
|---|---|
| **Box** | **24 × 46** (≈ 0.52 : 1, matching Inter's average advance in this context) |
| **Ink height** | **~32 units** — y ≈ **7 → 39**. Matches Inter 14's cap height (~10.2px) when rendered |
| **Ink width** | **~19 units** — x ≈ **2.5 → 21.5**, leaving even side bearings |
| **Stroke** | **3.45**, unchanged. Round caps, round joins |
| **Fill** | none — stroke only, as v1 |

**At a 14px render that produces a 7.3 × 14px glyph with ~5.8 × 9.7px of ink** — the same
optical weight and the same footprint as the Inter letter it resolves into.

### 2.1 What must survive the redraw

- **The motif DNA** — arcs, crosses, diamonds, chevrons, combs, zigzags. Angular, cohesive,
  drawn from Nsibidi motifs without reproducing them
- **An original cipher.** The whole point of the bespoke set is zero IP exposure and no
  cultural-validation gate (§The script). v2 must stay original — do not converge on any
  existing script
- **All 36 characters** — A–Z · 0–9, one glyph per character
- **Scrambled assignment** — no Latin resemblance between a glyph and the letter it maps to

### 2.2 What changes, and why it is not a compromise

Several v1 glyphs are inherently square — the diamond (`C` `D` `E`), the square (`O` `P`), the
X (`M`). **Condensing those is more letter-like, not less.** Latin `O`, `D` and `X` are all
narrower than they are tall in every text face. A cipher meant to read as *running script*
should have letter proportions; v1's squareness is what makes it read as a row of icons.

**Do not produce v2 by scaling v1 horizontally.** A mechanical squash steepens every diagonal
and turns considered shapes into distorted ones. Each glyph wants redrawing in the narrow frame.

---

## 3 · Delivery

| | |
|---|---|
| **Location** | Same page — `🧩 Components — Core`, beside `2104:168` |
| **Frame name** | `Caspr alphabet — angular full set v2 (A–Z · 0–9)` |
| **Node names** | `caspr-alpha-v2/<char>` — 36 nodes, exactly as v1's convention |
| **Keep v1** | Do **not** delete `2104:168`. It stays as the lineage reference |
| **Export** | Each glyph must export cleanly as SVG with a single stroked path |

---

## 4 · Acceptance test

Set a source name — **`Office for National Statistics`** — in **Inter Regular 14**. Directly
above it, set the same number of v2 glyphs at the same pitch.

**The two lines must span the same width, and neither should look heavier, taller or smaller
than the other.** If the glyph row reads as icons rather than as text, the ink is too wide or
the strokes too heavy.

---

## 5 · What is waiting on this

The live animation is at
[`content/assets/visuals/video/hp02_theater_source_web.html`](../../content/assets/visuals/video/hp02_theater_source_web.html).
It currently renders v1 **condensed at `scaleX(.62)` with a non-scaling stroke** — a deliberate
interim so the proportion is right while the shapes are not. **That transform is removed the day
v2 lands**, and the glyph data swapped for the v2 export.

---

## 6 · Two spec corrections to make in the same pass

**⚠ `THEATER-SOURCE-DECODE-MOTION.md` §Assets states `viewBox 24, stroke-width 1.8`.**
The actual v1 export is **`viewBox 46, stroke-width 3.45`** — identical optical weight (both
7.5% of the box), but anyone building from the written numbers scales the strokes wrong.
Correct it to the real values, and state v2's separately.

**⚠ §Font states DM Mono Medium for the flap cells *and the resolved rows*.**
Frame `1177:2860` sets the source list in **Inter Regular 14 `#1a1a17`**, and the list wins —
it is the content; the flap is the effect. **The flap resolves into Inter**, which is why the
glyph proportions had to change at all. Update §Font to match the frame.

**One consequence worth recording:** because Inter is proportional, the churn's cell pitch is
the resolved name's measured width divided by its character count — an average. The two lines
span the same distance, but glyph positions do not correspond to individual letters. That is
consistent with §The script (*"the churn is random and never spells the actual source name"*),
and it means a per-letter width match is impossible by design. **0.52 : 1 is the correct
compromise, not a fitting error.**
