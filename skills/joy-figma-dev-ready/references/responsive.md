# The responsive region model

## Why not breakpoints

A breakpoint list cannot cover what real traffic does. **Browser zoom alone defeats it** — 150% zoom on a wide screen *is* a narrow viewport, and zoom levels cannot be enumerated. Foldables change posture mid-session. Tablets span a wide band.

So declare **intent per region** and let every width fall out of it. For each region, state three things:

| | |
|---|---|
| **Behaviour** | fixed · fills · hugs |
| **Ideal** | the width it wants |
| **Bounds** | min, max — where it stops giving way |

A typical app shell has some fixed chrome, one or two content regions, and flexible gutters that absorb the remainder. Derive the actual regions from the file; the pattern is universal, the numbers never are.

## Write it as CSS, because prose hides the trap

```css
.fixed-chrome  { flex: 0 0 <width>; }
.gutter        { flex: 1 1 0; }                          /* grows and shrinks to 0 */
.content       { flex: 0 1 <ideal>; min-width: <floor>; } /* holds ideal; shrinks last */
```

**"Content fills, min X, max Y" is not the same thing and will bite you.** Written that way, the content region is one of several flexible siblings and takes an *equal share* — which yields a region sitting at its **minimum** on a wide screen. The intent is almost always *the gutters give way before the content does*, and that is `flex: 0 1 <ideal>` against gutters on `flex: 1 1 0`.

State it in CSS. Prose descriptions of flex behaviour are reliably misread.

## Derive the thresholds — do not choose them

Compute where each region runs out:

```
first threshold = sum of all fixed widths + content ideal
```

Below that, gutters are at zero and the content region begins to shrink. It keeps shrinking until it hits its floor; below *that*, the layout must change shape.

**The first threshold is often not the number anyone wrote down.** Teams tend to record the width where the structure switches and never notice the earlier one where the gutters vanish — which is where users actually first see a difference. Compute both and name both.

## Structural breakpoints only

A breakpoint is justified when the layout changes *shape* — multiple columns becoming one plus a drawer. Everything else flexes. One structural breakpoint is usually enough; two is a lot.

**Below the switch is one composition, not a third design.** Tablet and phone share a structure and differ only in how much width the content region receives. If you find yourself designing a separate tablet layout, check whether the region rules already answer it.

## One product, one narrow width

Marketing sites and product apps commonly diverge — 375 in one, 390 in the other — because they were drawn by different people at different times. It is invisible in Figma and produces two slightly different mobile layouts in production. Check for it explicitly; it is a one-line fix early and a migration later.

## Figma cannot express this, and that is fine if you say so

**Auto Layout has no flex-shrink and no priority.** Sibling `FILL` frames split space equally; there is no way to say "this one holds its size while those give way".

So a reference frame can only approximate: pin the content region `FIXED` at its ideal width with the gutters `FILL`. That reproduces the target composition exactly at the reference widths and **cannot show the content region shrinking**.

**Write down which one wins.** Without that line, someone builds the frame and ships the wrong behaviour:

> Where the frames and this CSS disagree, the CSS wins.

## Reference widths, not sources of truth

Three drawn widths is enough — narrow, mid, wide. A fluid system needs **fewer** drawn widths than a breakpointed one, not more.

Say clearly what they are for: **frames are a check on the build, not its source.** If a fluid build and a reference frame disagree, the build is usually right and the frame needs fixing. Say it explicitly to both sides, or the frame quietly becomes the spec again.

## Components respond to their container, not the viewport

Use **container queries**. The same card in a narrow pane and a wide column should adapt to its container — that is what removes the need for separate mobile and desktop components, and it is the root fix for scaled-duplicate artifacts, where a "mobile" component is the desktop one at some fraction.

**Fluid type for display sizes only.** Headings may `clamp()`. **UI text stays in fixed px** so the user's own font-size setting is respected rather than overridden by viewport maths.

## Test matrix

Widths **320 · 375 · 390 · 768 · 834 · 1024 · 1180 · 1280 · 1440 · 1920**, each at **100 / 125 / 150%** zoom, plus foldable folded and unfolded. Zoom is the cheapest way to find a layout that only works at one width.
