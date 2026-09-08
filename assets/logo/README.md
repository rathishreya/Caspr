# Caspr logo — wordmark

The wordmark **Caspr** set in **Instrument Serif** (the site's display face) with the
serifs outlined to vector paths and a synthetic bold baked in as a centered same-color
stroke. The full stop is a true geometric red circle — the brand mark, not punctuation.

Outlined to paths on purpose: no web-font dependency, no `-webkit-text-stroke` (a
browser-only trick that vanishes on export). Renders identically in a browser, a favicon,
a PDF, a PPTX deck, or print.

## Files

| File | Colour | Use |
|---|---|---|
| `caspr-logo.svg` | `currentColor` (defaults black) · red dot | **Master.** Recolour via CSS `color:` — black, reversed, or ghost from one file |
| `caspr-logo-black.svg` | `#000000` · red dot | Explicit black, for tools that ignore `currentColor` (favicon generators, PPTX, some PDF) |
| `caspr-logo-white.svg` | `#FFFFFF` · red dot | Explicit reversed, for dark backgrounds |

Recolour the master in code:

```html
<!-- primary -->      <span style="color:#000">…inline svg…</span>
<!-- reversed -->     <span style="color:#fff">…inline svg…</span>
<!-- ghost/watermark--><span style="color:#000;opacity:.06">…inline svg…</span>
```

The dot stays `#E8453C` in every variant — hard-coded in the SVG, not tied to `color`.

## Specs

- Typeface: Instrument Serif Regular (SIL Open Font License) — single weight, 1000 upm
- Bold: centered stroke, `stroke-width = 0.016em` (16 units), `paint-order="stroke"`,
  round joins. This is the "synthetic bold" preview, made permanent.
- Dot: diameter `0.12em`, gap from the `r` `0.04em`, sits on the baseline
- viewBox `0 0 2189 1055`, aspect **2.075 : 1**
- Kerning: shaped with HarfBuzz, so spacing matches the browser render exactly

## Regenerating / retuning

Source font + generator live in the session scratchpad (`make_logo.py`). One knob:

```
python make_logo.py <stroke_em> <out.svg>
```

`0.012` = semibold · `0.016` = current pick · `0.020` = heavy (counters start to fill).

## Known gap

At favicon sizes (16–32px) the bold stroke is sub-pixel and the 5-letter wordmark is too
cramped to read — true of any wordmark that small. The favicon should be a **monogram**
(a `C` + red dot, or the dot alone), designed separately. Not yet built.
