# Homepage Theater — build spec

*2026-08-31. For the dev session. Every value below is taken from a working animation, not
from a description of one.*

> ## ⚠ The build is the deliverable, not a reference
>
> **[`content/assets/visuals/video/hp02_theater_source_web.html`](../../content/assets/visuals/video/hp02_theater_source_web.html)
> is the component that ships. LOCKED 2026-08-31.**
>
> **Do not rebuild it from this document.** Take the file, wire it to the source-stream (§10),
> and replace the sample list. Everything else — geometry, timing, the decode, the
> normalisation, the responsive behaviour — is already correct in it and was arrived at
> through a long iteration this document only records.
>
> **This spec exists to explain *why* the values are what they are**, so that when something
> has to change, it changes for a reason rather than by re-deriving from scratch. Where the
> file and this document disagree, **the file is right** and the document needs correcting.
>
> **The homepage Figma holds a static snapshot, not the component.** It is named
> *"THEATER — snapshot (not source of truth)"* and exists so the fold can be composed and
> judged at full width; it is redrawn by hand whenever the file changes. **Never build from
> it and never treat a difference between the two as a design decision** — the snapshot is
> always the thing that is behind. Motion cannot be carried by a static frame, and where the
> snapshot approximates something the file does properly (the mask fades are painted as
> gradient rectangles, for instance) the approximation is the snapshot's limitation.

**Upstream:** [`../product/theater-visualization-spec.md`](../product/theater-visualization-spec.md)
(composition logic) · [`THEATER-SOURCE-DECODE-MOTION.md`](THEATER-SOURCE-DECODE-MOTION.md)
(the flap row). **§11 of the former is superseded here — see §9.**

---

## 1 · What this is

The **website** Theater: the terminus of the homepage *How It Works* fold. It renders the
Source stage — Caspr identifying candidate sources, reading them, and keeping the ones
that yield a citable claim.

**It is not the in-app Theater.** The app version is full-screen immersion with the rail and
chrome hidden (`app-shell-framework` §6). This is a bounded block inside a marketing page. The
composition logic and the animation are shared; the shell is not.

**Content is supplied separately.** This document specifies behaviour and geometry only. The
topic string, the source names and any counts come from the data layer (§10) or from whatever
recorded stream the marketing build is pointed at.

---

## 2 · Stage and container

| | Desktop | Mobile |
|---|---|---|
| Container max-width | **1200px** | 430px |
| Container padding | **`0 0 20`** — the masthead spans the full width | `0 0 20` |
| Inner padding | **`0 24`** — everything below the masthead | `0 20` |
| Stage | **White `#FFFFFF`** | White |
| Block height | **~774px** | **`100svh`**, `overflow:hidden` |

**The container matches the homepage measure (1200), not its own.** It was 1000 for as long as
it was a standalone artefact, which put the fold's rung copy 100px outside the proof on each
side. **The artefact must never be narrower than the argument above it.** If the homepage
measure changes, this changes with it and §3's arithmetic re-runs.

**The masthead is edge-to-edge, and the 24px inset lives on an inner wrapper.** Inset, the dark
band read as a card floating inside a white card — one nesting level that says nothing. Spanning
the full width it reads as the block's own header.

**Stage is white, not dark.** `theater-visualization-spec` §12.1 supersedes §§3–6 on colour.
`app-shell-framework` §9a still describes a `#0A0908` theater — that is stale (see §12).

**Mobile must use `height`, not `min-height`.** `min-height` is a floor: the source list has
nothing to shrink against and grows the block past the viewport. Use `100svh` (not `vh`) so
browser chrome appearing does not shift the layout mid-scroll.

---

## 3 · Layout

### Desktop
```
┌ masthead (dark) · edge to edge ─────────────────────── 71px ┐
└─────────────────────────────────────────────────────────────┘
                            ↕ 20
┌ left column · 300px ──┬ graph · fills remainder ────────────┐
│ count             legend right-aligned to the inset →       │
│ SOURCES REVIEWED      │                                     │
│   ↕ 22                │    canvas — 852 × 682 (5:4)         │
│ flap row · 26         │                                     │
│ source rows · 26 each │                                     │
│ list column · 591     │                                     │
└───────────────────────┴─────────────────────────────────────┘
                            ↕ 20
```

**The graph starts level with the count, not level with the list** — the grid opens directly
under the masthead, giving equal 20px above the starfield and below the canvas.

**Graph zone is 5:4.** `1200 − 48 inner padding − 300 list = 852` wide, so **682** tall. A
wider, flatter zone reads squat; **re-run this if the container width changes** — the ratio is
the instruction, the two numbers are its output.

**The list column is 591**, which is the canvas height less the 22px offset and the count block
above it. It holds 23 rows at the 26px pitch. Derived, never typed — §5.

### Mobile
Single column, flex, in order: masthead · count + legend · label · flap · list · canvas.
The list **flexes** to fill what is left; the canvas is fixed.

| | |
|---|---|
| Canvas | **`52svh`, min 320px** — the animation holds at least half the screen |
| List | `flex: 1 1 0`, `min-height: 0`, `overflow: hidden` |
| Masthead, count, label | **`flex: none`** — without it a short viewport compresses the count instead of the list |

At a 390 × 844 viewport that resolves to a 62px masthead, a 302 × 439 canvas and roughly
196px of list — seven rows and a clipped eighth under the fade.

---

## 4 · Type and colour

| Element | Font | Size | Colour |
|---|---|---|---|
| Title-card eyebrow | Inter Medium | 10.5 · `.13em` · uppercase | `#FFFFFF` |
| Title-card topic | Instrument Serif Regular | 22 (20 mobile) | `#FFFFFF` |
| Count | **DM Mono Medium** | **44** (36 mobile) · tabular | `#1A1A17` |
| Count label | Inter Medium | 11 · `.13em` · uppercase | `#5C5B58` |
| **Legend labels** | Inter Medium | **11 · `.13em` · uppercase** (10 · `.125em` mobile) | `#5C5B58` |
| Legend dots | — | 6px circles | `#BAB8B2` · `#E8453C` |
| **Source rows** | **Inter Regular** | **13 · UPPERCASE · `.02em`** · row pitch **26** | `#1A1A17` |
| **Flap, resolved** | DM Mono Medium | **13.5 · UPPERCASE**, tracked to the cell | `#1A1A17` |
| Citation dot | — | 5px circle | `#E8453C` |
| Title card ground | — | — | `#0C0B09` |

> ### One cap height governs the whole component: **9.45px**
> Inter 13's cap height. **Script ink, resolved mono caps and list caps are all 9.45px**, so
> nothing resizes at any point — the flip changes the glyph, the slide changes the typeface.
> Every size in this document derives from that one number. Change it and everything follows.

**Uppercase throughout the decode and the list.** The cipher has no case: every glyph fills one
band. A mixed-case resolve would introduce ascenders, descenders and x-height the glyphs never
had, so the line would change silhouette at the moment it is meant to be decoding *in place*.
Caps hold the band, and carrying them into the list means **only the typeface changes on the
slide**. All-caps also reads heavier than sentence case at the same size — which is why the
list is 13 and not 14.

**The flap matches the list, not the reverse.** The list is the content; the flap is a transient
effect. `THEATER-SOURCE-DECODE-MOTION` §Font specifies DM Mono for both — the built frame sets
the list in Inter and the frame wins. See §13.

**Every row, including the flap, is led by a red citation dot** so the churning line reads as
the top row of one continuous list rather than as separate furniture.

---

## 4a · The legend

Two lines, stacked, right-aligned, level with the count.

```
25M+ CURATED SOURCES  ●     (grey  #BAB8B2)
     23 CITED SO FAR  ●     (red   #E8453C)
```

**It is a legend second and a number third.** Its first job is to say what the two dot colours
mean, which nothing else on the component does. Its second is to complete a chain that reads in
one movement — **25M+ curated → 11,486 reviewed → 23 cited.** Universe, effort, evidence. That is
the Source argument stated in three numbers, and the middle one was carrying it alone.

| | |
|---|---|
| **Anchor** | The **inner wrapper**, not either column: `position:absolute; top:20px; right:{inner padding}` |
| **Vertical centring** | Give the block the **count's line-height** (44 desktop, 36 mobile) and centre its contents. No offsets to maintain |
| **Dots on the right** | Two labels of different length cannot both align to a shared left edge; a ragged dot column reads as a mistake |
| **Labels stay grey** | Only the dots carry colour, as everywhere else in this component |

**Anchoring to the inner wrapper is what makes one rule serve both breakpoints.** The count sits
20px below the inner edge on desktop *and* on mobile — on desktop because `.body` carries the
margin, on mobile because `.count` does. So the legend lands beside the number either way, even
though on mobile the graph has dropped below the list and there is no right-hand column at all.

### The mobile short form

`25M+ CURATED` · `n CITED` — the trailing words sit in a `.lgtail` span that is hidden at the
breakpoint. **The full labels do not fit:** 302px of content against a 132px count leaves 4px of
clearance. The nouns are supplied by `SOURCES REVIEWED` directly beneath, which is the line the
legend is read against anyway.

### The cited number counts locked spokes

**Bind it to `lockPtr`, never to the source loop.** The loop is unbounded and would eventually
claim more citations than the graph shows; the lock count is capped at 20 desktop / 13 mobile
and is exactly what is on screen. Bound this way the legend is a **caption on the picture**, it
cannot drift out of agreement with it, and it survives the breakpoint change that rebuilds the
spokes with a different cap.

---

## 5 · The source list

- **Newest at the top.** Each resolved source is inserted at position 1 and pushes the rest down
- **On insert the whole list translates** `−26px → 0` over **380ms** `cubic-bezier(.2,.7,.2,1)`,
  so existing rows slide rather than jump
- **Row count is derived from the container height**, never hardcoded:
  `floor((listHeight − 26) / 26)`, clamped 5–16. Rows beyond it are dropped from the tail
- The list must be bounded by its container. It may never grow the block

### The fade
| | |
|---|---|
| **Desktop — horizontal** | `linear-gradient(to right, opaque 0%, opaque 46%, transparent 100%)`. Long names read as sliding *behind* the graph |
| **Mobile — vertical** | `linear-gradient(to bottom, opaque 0%, opaque 52%, transparent 100%)`. The list sinks into the graph below it |

**The desktop start-point matters.** At a 300px column, a fade beginning at 66% starts at 198px
— longer than most source names, so nothing ever fades. 46% is calibrated so a long name goes
solid through its first words and dissolves toward the graph.

---

## 6 · The flap decode row

The top line holds cipher script, resolves to a real source name, and slides into the list.
Loops while sources are being read.

### Cell pitch — set by the glyph, not by the font
**Cell width 11.5px, fixed.**

A square glyph at cap-height H is H wide; DM Mono at the same cap height has an advance of only
**0.857 H**. The glyph is therefore ~17% wider than the font's own cell. **The glyph wins** —
it sets the pitch, and the resolved caps sit centred in it, tracked out by roughly a third.
Tracked caps read as a machine readout, which suits the state.

Do not derive the pitch from the resolved text's measured width. That was an earlier approach,
needed only because the flip resolved directly into proportional Inter. With a monospace
intermediate the pitch is **fixed and exact by construction**, and the proportional change moves
into the slide where motion absorbs it.

### Choreography
**Three states, not two.** The flip resolves into **DM Mono at the script's own size**, and only
the *slide* takes it down to the list's Inter 14. This is what makes it a decode: the flip
changes the glyph and nothing else — same cell, same size, same position.

| Phase | Duration | Behaviour |
|---|---|---|
| **Hold** | **1340ms** | Every cell shows a cipher glyph; each swaps independently every **112–170ms**, staggered, so the line reads as living script |
| **Flip** | single frame | **The whole line resolves at once** — no ripple. Glyph → Latin letter in the same cell at the same cap height, in **DM Mono 13.5 UPPERCASE**. Flashes `#E8453C`, settles to `#1A1A17` over **300ms** ease-out |
| **Register** | **220ms** | The resolved name holds |
| **Slide** | **400ms** | Inserts as the newest row in **Inter 13 uppercase**. Flap fades over 200ms. **No scale change** — the two share a cap height, so only the typeface changes |
| **Gap** | **70ms** | Next source begins |

**≈2.03s per source**, and independent of name length. No idle state — it loops continuously
while reading.

> **The hold is not where you save time.** It is the only phase in which the cipher is legible
> *as writing*; below ~1.1s it reads as flicker and the effect becomes decoration. Take any
> speed out of register, slide and gap.

> **The mono state is UPPERCASE, and this is structural.** The cipher has no case — every glyph
> fills the same 32-unit band. A mixed-case resolve introduces ascenders, descenders and
> x-height the glyphs never had, so the line changes silhouette at the exact moment it is
> supposed to be decoding in place. Caps hold the band. It also separates the two states
> semantically: **caps mono is machine output; sentence-case Inter in the list is content.**

### The glyphs
The **Caspr alphabet** — original 36-glyph cipher, `caspr-alpha/*`, node **`2104:168`** on
`🧩 Components — Core`. Square 46 × 46 frames, stroke-only, round caps and joins.

> ### ⚠ The glyphs must be optically normalised at render time
> **The frame is 46 × 46. The ink inside it is not.** It spans anywhere from **37.5% of the
> frame (`0`) to 58.3% (`C`)** — `0` is 64% the height of `C`. Sizing the *frame* therefore
> sizes nothing consistently: a line of random glyphs averages roughly half the frame and reads
> short and ragged beside the text, whatever the arithmetic says.

**Per glyph, at load:**
1. Parse the path (`M / L / V / H / Z` only) and compute the **ink bounding box**
2. Emit a **tight `viewBox`** around that ink, padded 12% of ink height for the stroke
3. Render to the **uniform 9.45px ink height**; width follows the glyph's own aspect
4. Set a **per-glyph `stroke-width` of `1.3 × inkHeight ÷ 9.45`** so the on-screen weight stays
   constant at 1.3px however far that glyph was scaled

**Step 4 is not optional.** `0` scales up ~1.55× to reach the target; without a compensating
stroke-width its strokes would render half again as heavy as `C`'s.

**This is the optical pass the spec says the set still needs, applied at runtime.** It should
eventually be corrected in the asset — the per-glyph scale factors above are exactly the
numbers to apply — at which point the renderer can drop to a single uniform size.

> **`caspr-alpha-v2` (`2658:178`, narrow 24 × 46) is NOT the set to use here**, and its brief
> is superseded. It was drawn for a 7.3px cell, which existed only while the flip resolved
> directly into Inter 14. With the mono intermediate the cell is 11.5px, where v2's narrow ink
> reads sparse. **v2 also does not solve the normalisation problem** — its widths are uniform
> but its ink heights still range 24–32 units. Keep it in the file; do not build with it.

---

## 7 · The graph — field generation

**Generate once, in normalised coordinates. Never regenerate on resize.**

Stars are stored as `u,v` fractions of the box and remapped to pixels each frame. Spokes store
angle and radial fraction; their reach is derived at draw time. **Regenerate spokes only when
the breakpoint changes their count.** Randomising on every resize event deals a new
composition dozens of times during a single drag.

### Starfield
| | |
|---|---|
| Generation | **Grid + jitter** — 11 × 9 cells, one star per cell at a random 15–85% offset within it |
| Exclusion | Skip any star within **52px** of the hub, checked live against the drifted position |
| Radius | 0.7 – 2.0px |
| Colour | `#D1CFCC` |
| Drift | `home + sin(t·ω + φ)·amp`, **x and y each with their own φ and ω** · period **2.4–5.4s** · amp **1.0–2.2px** |
| Twinkle | Opacity **0.16 → 0.62** · period 2.5–3.8s · stagger 0–2.2s · desynced |

**Do not drive both axes from one phase.** A shared phase locks every star onto a fixed
diagonal and the field reads mechanical.

### Spokes
| | Desktop | Mobile |
|---|---|---|
| Count | **32** | 18 |
| Eventually locked | **20** | 13 |

- **Angle:** `(180/N)° + i·(360/N)°` — the offset keeps them off the cardinal axes
- **Reach — measured against the rectangle, not an ellipse:**
  `min( (W/2 · 0.94) / |cos θ| , room · 0.94 / |sin θ| )` where `room` is the space below the
  hub when `sin θ ≥ 0` and above it otherwise
- **Radial position:** a random **34–96%** of that reach, fixed per spoke (§4 — *mix short and
  long freely*)
- **Connected from frame one.** The line is the starting state, not something drawn in —
  investigation, not discovery
- **Drift:** own φ and ω per axis, period 3–6s, amp 1.6px
- **Line endpoints recalculate every frame** against both the hub's drift and the node's, or
  the line detaches from its own ends
- **Idle line:** `#D0CFCC`, width 1, alpha 0.6
- **Idle node:** r 2.8, `#C2C1BB`, opacity breathing **0.55 → 0.95**, period 2.4–3.3s, stagger 0–1.7s

### The hub
| | |
|---|---|
| Fill | **`#E8453C`, always** |
| Position | **`x = W/2`, `y = H × 0.40`** — not centred vertically |
| Radius | `13 × (min(W,H)/620)` desktop · **11.5 fixed** on mobile |
| Pulse | **`scale(1 → 1.12)` only**, 2.1s ease-in-out |
| Opacity | **Fixed at 1.0. Never animate it** |
| Drift | ~1.1px, own phase |

**The fixed opacity is a bug fix, not a preference.** Every spoke line converges on the hub's
centre; a translucent hub lets those stubs show through.

**The hub does not scale with canvas height.** Tying it to `min(W,H)` collapses it to ~7px on
mobile — barely larger than a 5px locked node — and it stops reading as the hub.

**The hub sits above centre, at 40% of the height.** The reach in §7 is measured against the
rectangle, so the hemisphere with more room gets longer spokes. Centring the hub splits that
room evenly and the composition sits low; at 0.40 the lower half carries the longer reach and
the field fills. It was 0.34 while the canvas was shorter, which left an empty pocket at the
bottom — **the fraction is tuned to the zone's ratio and should be revisited if that changes.**

---

## 8 · Locking in

**The first resolved source locks a spoke immediately.** The reader has to see the mechanism
happen once before the grey nodes mean anything; if the first lock is several sources in, the
opening seconds read as a static field with a list scrolling beside it.

**After that, one spoke locks every 2–5 resolved sources**, redrawn at random each time — not
one per source. At ~1.58s per source that fills the web over roughly two minutes, so the
finished picture arrives well after the fold has been read.

**Not every spoke resolves.** Only the counts in §7 ever lock; the remainder twinkle grey
indefinitely — *checked, nothing kept*. This is true to how research works and **must not be
designed away.** It is also the most persuasive thing in the composition: a system that visibly
discards sources is not one anyone suspects of inventing them.

### The transition — one shared eased clock, ~550ms, ease-out cubic
| Property | From | To |
|---|---|---|
| Line colour | `#D0CFCC` | `#E8453C` — **interpolated, not swapped** |
| Line alpha | 0.6 | 0.85 |
| Node colour | `#C2C1BB` | `#E8453C` — **interpolated** |
| Node radius | 2.8 | 5, with a 0.6px overshoot |
| Node opacity | **its live twinkle value** | 1.0 |
| Ring | one-shot 5 → 20px, alpha 0.20 with squared falloff | — |

**Three things must not snap.** Interpolate the *colours* rather than switching them when the
opacity happens to be easing. And ease the node's opacity **from wherever its twinkle currently
sits** — starting from a nominal value makes every lock pop differently depending on when it
fires.

**Locked nodes are steady.** Twinkling means *still being evaluated*; solid red means
*confirmed*. Do not reintroduce motion on a locked node.

---

## 9 · Responsive

> **Single breakpoint: 860px. One source of truth.**

CSS and the animation must read the **same** media query. Keying the script off canvas width
puts it out of step with the layout — between roughly 861 and 1010px viewport the page is in
desktop layout while the graph still draws its mobile spoke count and hub size.

**This supersedes `theater-visualization-spec` §11's `scaleX / scaleY`.** Those stretch a
circle to fit a non-square zone, but a stretched circle is an ellipse: it meets the box at four
mid-edges and leaves every corner empty, which reads as a circular graph in a rectangular
space. The rectangle-aware reach in §7 replaces them and needs no per-zone tuning.

---

## 10 · Data binding

The reference build runs on a fixed list. **The real implementation consumes the source-stream**
(`architecture-alignment-final` §9 Endpoint 2, `theater-visualization-spec` §9):

- Each event supplies a **source name** and whether it **yielded a citable claim**
- Kept sources enter the flap and resolve into the list; the lock cadence in §8 is independent
  of that ratio
- **The count is a separate figure** from the number of named rows — sources *reviewed* is far
  larger than sources *cited*, and showing both is stronger than either. Increment it
  continuously, not per row
- **Three figures, three sources.** `25M+` is a fixed brand claim, *reviewed* comes from the
  stream, *cited* is the locked-spoke count (§4a). Do not wire the legend's second number to
  the stream — it is a caption on the graph, and the graph is a sample
- **Loop guard:** run only while sources are actively being read; settle on the final list when
  reading completes

---

## 11 · Reduced motion — required

`prefers-reduced-motion: reduce` → **no churn, no slide, no drift, no pulse.** Each source
appears directly as its name in the list at a steady **650ms** interval, citation dot intact.
Stars render at a flat 0.42 opacity, nodes at 0.8, hub unpulsed.

The feature degrades to a plain, honest source feed. **The meaning is never carried by motion
alone.**

---

## 12 · Accessibility

- The decode is decorative. Mark the churning cells **`aria-hidden`** and expose only the
  **resolved names**, via the list or an `aria-live="polite"` region — *"Reading source: …"*
- The canvas carries an `aria-label` describing what the web represents
- **The legend is content, not decoration** — it is the only text that says what the colours
  mean, so it is not `aria-hidden`. It carries no `aria-live`: the cited number changes every
  few seconds and announcing each change would talk over the source feed
- Glyphs must never be the only signal; the cited source list is the real content
- **Note for review:** Caspr red `#E8453C` on white measures **3.62:1** — fine for large text
  and graphics, **below the 4.5:1 minimum for small text.** No small text in this component is
  set in red, and the citation dot is a graphic, not text. Keep it that way.

---

## 13 · Corrections to upstream specs — apply in the same pass

| # | Where | Correction |
|---|---|---|
| 1 | `theater-visualization-spec` §3 | Drift `f ≈ 0.1–0.3` is **per frame at 60fps**, not per second. Read as rad/s it gives a 21–63s period — a static field. State the period in seconds instead |
| 2 | §3 | *"both axes independently"* must mean **separate phase *and* frequency**, not one phase driving a sin/cos pair |
| 3 | §6 | Hub base radius has no scaling rule. State that it **does not scale with canvas height** |
| 4 | §11 | `scaleX / scaleY` **superseded** by the rectangle-aware reach (§7 here). They were an output of one zone's measurements, not portable settings |
| 5 | §11 / §3 | Star counts (`~46 Compact`, `~90–150 Expanded`) are outputs of the **11 × 9 cell grid**, not targets. The grid is the instruction |
| 6 | §9a of `app-shell-framework` | Still specifies a `#0A0908` theater and calls it *"the one unresolved case."* §12.1 of the visualization spec makes the stage **white**. Resolve it |
| 7 | `THEATER-SOURCE-DECODE-MOTION` §Assets | Documented as `viewBox 24, stroke-width 1.8`; the real export is **`46 / 3.45`**. Same optical weight, wrong numbers to build from |
| 8 | §Font | Specifies DM Mono for the flap **and the resolved rows**. The built frame sets the list in **Inter Regular 14** and wins |
| 9 | §Choreography | Documents a 20ms/cell left-to-right ripple. **Superseded: the line flips in a single shot** |
| 10 | §Choreography | Documents two states — churn, then resolve into the list. **There are three:** churn → **monospace at the script's own cap height** → the list font. The mono intermediate is what makes the flip a decode rather than a substitution |
| 11 | §Assets | Records the glyph frame size but not the **ink** inside it, which varies 37.5%–58.3% of the frame. Every downstream sizing instruction is therefore unusable as written. State the ink extents per glyph, or normalise the asset |
| 12 | `THEATER-SOURCE-DECODE-MOTION` §Hidden-word | The `CITED` easter egg is **not built.** Decided 2026-08-31: it reads as a wink against the dry register, and it costs a beat of the hold, which is the phase the effect depends on |

| 13 | `theater-visualization-spec` §2 / §12.2 | Records the block at a **1000px** container. The measure is **1200** — the homepage's, not the component's — and §3 here re-derives every dependent number from it |
| 14 | §6 | Gives the hub a radius but no **vertical position**. It is `H × 0.40`, and that fraction is tuned to the zone's ratio (§7) |

**The pattern across all of them:** the spec records *values* that were correct for the frame they
were measured in, without the *ratio or unit* they were derived from. Every one of them
misleads the moment the zone changes. Where a number is an output of a rule, state the rule.

---

## 14 · Open

- **Normalise the asset, not the renderer.** The runtime normalisation in §6 is a correction
  applied on every load. The per-glyph scale factors it computes are exactly what an optical
  pass in Figma should bake in; once done, the renderer drops to one uniform size
- **`S` is a genuine outlier** — drawn as a wide flat zigzag at 1.67 : 1, so normalising its
  height makes it ~40% wider than the 11.5px cell and it overhangs its neighbours. One glyph
  in thirty-six, appearing transiently. Left as-is; fix in the asset if it reads badly
- **Uppercase in the list diverges from frame `1177:2860`**, which sets it sentence case.
  Deliberate — it keeps the casing constant across the flip and the slide — but the frame
  should be updated to match, or the divergence recorded
- **Mobile is unverified in a real browser.** The preview pane serves the file as a `data:`
  snapshot and does not apply the media query against an emulated viewport, so `100svh`, the
  vertical fade and the legend's short form have been reasoned to but not seen. **Check them
  on a device before the fold ships**
- **Theatre → Layout transition motion** — still undesigned (`theater-visualization-spec` §12.5)
