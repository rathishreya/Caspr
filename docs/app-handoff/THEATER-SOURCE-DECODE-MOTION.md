# Theater — source decode motion (the flap row)

**Surface:** Theater, the analysis-in-progress screen · **Figma node:** flap row `762:2` (desktop), atop the sources list · **Date:** 2026-08-14

## What it is

While an analysis runs, the top line of the sources list is a **decode animation**: it holds a line of cipher script for a beat, flips the whole line at once into a **real, cited source name in English**, then that line **slides down into the sources list**. The next source begins decoding in the cleared top line. It loops as long as sources are being read.

The idea in one sentence: *analytical AI reading at inhuman speed, resolving to a source you can name and cite.* The churn carries the intrigue; the resolve carries the trust. This is a deliberate, quiet moment of craft — an easter egg, not a tone shift. It never appears in copy or anywhere else.

**Non-negotiable:** the resolved line is always a real source in English (Bloomberg, IMF, S&P Capital IQ…) with a red-dot citation. The script only ever lives in the transient churn, which makes no claim to be a source.

## The script — the Caspr alphabet (bespoke cipher)

> **Direction change (2026-08-15):** this supersedes the earlier Nsibidi-ideogram plan. The churn is now the **Caspr alphabet**, an original cipher. Reason below. The dev prompt (`FIGMA-DECISIONS-PROMPT.md`, item 4) references the old plan — the alphabet is the current approach and it dissolves the cultural-validation gate.

The churn cycles the **Caspr alphabet** — an original **36-glyph cipher** (A–Z · 0–9), one glyph per character, drawn from Nsibidi motifs (arcs, crosses, diamonds, chevrons, combs, zigzags) but designed as a cohesive **angular** alphabet. Because it's a real letter-set, the row reads as *running script* and the resolve is a true letter-for-letter decode — alien glyph → English letter — which is exactly what the ideographic approach could not deliver (Nsibidi is ideographic: one symbol = a whole word, so it never read as an alphabet).

**Why bespoke, not a found script.** An original alphabet gives the alien-script aesthetic (the *Black Panther* register) with **zero IP exposure** — the Wakandan font is Marvel/Disney property and the fan fonts online can't license it — and, unlike a real living script, it never reduces a working writing system to decorative noise. It's ours; it survives scrutiny, legal and cultural. It nods to Nsibidi through its motif DNA without appropriating it. **No cultural-validation gate applies** — the set is original, not a rendering of a living/sacred script. (The Nsibidi ideogram set `2100:168` remains in the file as reference for the lineage.)

**The churn is random** — it shuffles cipher glyphs and never spells the actual source name; only the resolve is English, so no letter-for-letter mapping of the source is needed.

**Assets — two sets, and v2 is the one to build with.**

| | Node | Box | Ink | Stroke | Use |
|---|---|---|---|---|---|
| **v1** — square | **`2104:168`** · `caspr-alpha/<char>` | `46 × 46` | `26.8 × 26.8` | **`3.45`**, round caps | **Lineage reference. Do not build from it** |
| **v2** — narrow | **`2658:178`** · `caspr-alpha-v2/<char>` | `24 × 46` | `16 × 32` | **`3.45`**, round caps | **The flap row.** Ships here |

**⚠ Corrected 2026-08-31.** This section previously stated `viewBox 24, stroke-width 1.8` for v1. **Both numbers
were wrong** — the actual v1 export is `viewBox 46, stroke-width 3.45`. The ratio is the same (7.5% of the box),
so anyone reading only the ratio was fine, but anyone building from the literal numbers scaled the strokes wrong.

**Why v2 exists.** A square glyph cannot sit in the flap cell, whose pitch is Inter's average advance —
**measured at 7.19px at 14px across 16 real source names, a ratio of 0.513**. A 46-square sized to Inter's cap
height renders ~10px of ink into a ~7.2px cell. v2's `24 × 46` box is that ratio.

**Ink is 16, not the 19 first specified.** With the `3.45` round-cap stroke a 19-wide path occupies **22.45 of
the 24 box** — 0.24px of side bearing at render, and the churn row reads as a solid band rather than as text.
At 16 the glyph occupies 19.45, leaving **2.28 units — 0.69px** — and the row reads as script. The acceptance
test is drawn inside `2658:178`.

**Hidden-word easter egg (optional, enabled by the full alphabet).** Because every letter exists, the line can occasionally resolve into a real word — default **`CITED`** — for a beat before flipping to the actual source. The alien script turns out to be saying something. Frequency: rare (≈ 1 in 6 sources). This is the payoff a partial churn-set couldn't offer.

Render each glyph as a stroke-based SVG — **v2: `viewBox "0 0 24 46"`, `stroke-width 3.45`, round caps and joins, `fill: none`**; colour inherits the cell (faint grey while churning, ink on resolve). **No `scaleX` transform and no `vector-effect: non-scaling-stroke`** — both were interim workarounds for v1's square proportions and must be removed when v2 lands.

## Choreography (per source)

| Phase | Duration | Behaviour |
|---|---|---|
| **Hold** | **1340ms** | Every cell shows a cipher glyph; each cell independently swaps glyph every ~112–170ms (staggered start) so the line reads as living script, not a flicker. The full line holds the whole time. Optionally the line resolves to the hidden word (`CITED`) on the rare pass — see the easter egg above. |
| **Flip** | ~20ms × cells | The whole line resolves together — a tight left-to-right ripple (~20ms/cell) so it reads as "the word turns," not a dead snap. Each cell: glyph → English letter, with a brief red flash then settling to ink (`.30s` ease-out). |
| **Register** | ~300ms | The resolved English source holds at the top line. |
| **Slide** | **~420ms** | The resolved line inserts as the newest row of the sources list and animates from the flap position down into its slot (`translateY`, `cubic-bezier(.2,.7,.2,1)`); the flap fades out (`.2s`) so it reads as the *same* line travelling. New row carries a red citation dot. |
| **Next** | ~120ms gap | Flap clears and the next source begins its hold. |

Total ≈ 2.1–2.3s per source. Tempo was tuned to feel like "working fast" without losing the moment the script reads — hold under ~1.4s, quick flip, brisk slide.

**Font: Inter Regular 14 `#1a1a17`** for the flap cells and the resolved rows; the analysis title above stays Instrument Serif. **Colour:** ink `#1a1a17`, faint churn `#b0aca3`, the one accent `#e8453c` on the flip flash and the citation dot. No second colour.

**⚠ Corrected 2026-08-31.** This previously said **DM Mono Medium**. Frame `1177:2860` sets the source list in
**Inter Regular 14**, and **the list wins** — it is the content; the flap is the effect. The flap resolves into
Inter, which is the whole reason the glyph proportions had to change.

**One consequence, because it looks like a bug and is not.** Inter is proportional, so the churn's cell pitch is
the resolved name's **measured width ÷ its character count** — an average. **The two lines span the same
distance, but glyph positions do not correspond to individual letters**, and per-name advance ranges from
**0.44 to 0.59** across real sources (`Office for National Statistics` 0.443 · `BloombergNEF` 0.589). That is
consistent with *"the churn is random and never spells the actual source name"*. **A per-letter width match is
impossible by design — 0.52 : 1 is the correct compromise, not a fitting error.**

## `prefers-reduced-motion` (required)

No churn, no slide. Each source **appears directly** as its English name in the list at a steady interval (~650ms), citation dot intact. The feature degrades to a plain, honest source feed — the meaning is never carried by motion alone.

## Accessibility

- The decode is decorative; expose the **resolved source names** to assistive tech, never the glyph churn. Mark the churning cells `aria-hidden`; announce each resolved source via the list (or an `aria-live="polite"` region) as "Reading source: Bloomberg."
- The glyphs must never be the only signal — the cited source list is the real content.

## Implementation notes

- Cells are fixed-width mono slots; a glyph SVG and a resolved letter occupy the same box so the flip has no reflow.
- The slide distance is measured at runtime (flap rect vs. the new row's landing rect) so it stays correct across source-name lengths and breakpoints — don't hard-code it.
- Mobile Theater: same choreography, narrower list; the flap row and slide behave identically.
- Loop guard: only run while sources are actively being read; stop and settle on the final list when reading completes.

## Reference

The interactive prototype (this session) demonstrates all of the above with the Caspr alphabet: 1.34s hold, whole-word flip, slide-into-list, resolve-to-cited-source. Build to that motion. No cultural-validation gate — the alphabet is original; the only pre-ship nicety is the optional type-design polish pass on the glyph set.
