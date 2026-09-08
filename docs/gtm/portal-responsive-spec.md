# GTM Portal — responsive specification

*2026-08-25 · Self-contained. **This file is the source**; `portal-design-spec.md` §10A and
`portal-build-spec.md` §3.11 point here rather than restating it.*

---

## 1 · The gap this closes

**`portal-design-spec.md` §10 said the console was *"responsive to tablet."* That was an assertion, not a
specification.**

**All 29 Figma frames are drawn at a fixed 1440**, and nothing said what happens below it.

> **The unspecified band is not an edge case. A 13-inch MacBook Air is 1280 logical pixels** — comfortably
> inside it, and very likely what someone on the DM team is using right now.

---

## 2 · The approach — one drawing, a flex declaration in words

**Do not draw or expect more frames.** The design spec's whole rationale is 14 frames rather than 28, each
designed once at the posture it is used in.

**The frames are the 1440 case. Everything below it is CSS** — the same pattern the product app uses, where
the shell regions are a locked flex declaration rather than a set of breakpoint frames.

**A consequence worth stating plainly:** the pixel column widths in the Figma file are **the 1440 case, not
the specification.** Reading them as fixed values is how "building from coordinates" happens.

---

## 3 · The bands

| Width | Rail | Work area | Tables |
|---|---|---|---|
| **≥ 1440** | As drawn, expanded | As drawn | As drawn |
| **1180–1439** | **Expanded.** Unchanged | **Compresses.** All gutters shrink before any content does | **Flexible columns.** Identity column holds its width; the rest share the remainder |
| **900–1179** | **Collapses to icons.** The `595:2` icon set already exists | **Full width** | **Scroll horizontally inside their own container.** ⛔ Never squash below legibility |
| **< 900** | — | The message frame `65:1584` — **routes to the Personal Queue**, does not dead-end | — |

---

## 4 · Four rules that decide the edge cases

| | |
|---|---|
| **1** | **⛔ A table scrolls; it never squashes.** Each table sits in its own `overflow-x: auto` container. **The page body never scrolls sideways** — a horizontally-scrolling console is how a dense screen becomes unusable without anyone filing a bug |
| **2** | **Two columns never drop or shrink: the identity column and the decision column.** Everything else is metadata. In the people roster that means **PERSON** and the **actions** survive; **MFA** and **LAST SEEN** go first |
| **3** | **Review mode must be fully usable at every supported width, 900 up.** It is the one thing the console exists for, and as a single-item full-screen takeover it is already the most naturally fluid screen. **If anything has to break at 1180, it is not this** |
| **4** | **Gutters and padding absorb the loss before type does.** No responsive type scale in the console — the review item's reading measure is deliberate, and shrinking it to fit a viewport trades legibility for a layout nobody asked for |

---

## 5 · ⚠ The measurement that changes build order

**Audited all 29 frames on 2026-08-25. Measured, not estimated.**

**Work area = viewport − rail (220) − work padding (80):**

| Viewport | Work area |
|---|---|
| 1440 | **1140px** |
| 1180 | **880px** |
| 900 | **600px** |

### What actually breaks

**Everything fits down to 1180.** Six tables exceed 600px and break in the 900–1179 band:

| Table | Fixed columns need | 1180 | 900 |
|---|---|---|---|
| **Admin · people roster** | **768px** | ✅ | ❌ |
| **Performance · Dashboard** | 704px | ✅ | ❌ |
| **SEO · Dashboard** — kill conditions | 690px | ✅ | ❌ |
| **Content & Social · Dashboard** | 684px | ✅ | ❌ |
| **Email · Sequences** | 610px | ✅ | ❌ |
| Everything else | ≤ 594px | ✅ | ✅ |

### The rail collapse does almost all the work

**Collapsing the rail from 220px to icons (~64px) frees 156px**, taking the 900px work area from **600 to
756**.

**That alone fixes four of the six.** Only the **Admin roster (768px)** still overflows, by **12px** — and
rule 2 already says what gives: **drop MFA and LAST SEEN, keep PERSON and the actions.**

> **So build the rail collapse FIRST. The horizontal-scroll container is a backstop, not the primary
> mechanism** — most tables then never need to scroll at all.

### 5.1 · The 12px closes on its own — measured in the build, 2026-08-25

**The arithmetic above holds. The outcome does not follow from it, because rules 2 and 4 interact.**

**§5 computes the work area as `viewport − rail − 80`, holding the gutter at 80px across every band.** But
**rule 4 says gutters and padding absorb the loss before content does** — so the gutter is not constant, and
by 900 it has already given up most of itself.

**Measured in the running console, not calculated:**

| Viewport | Rail | Gutter | Work content box | Roster needs |
|---|---|---|---|---|
| 1440 | 220 | 80 | **1140** | 768 ✅ |
| 1000 | 64 | 40 | **896** | 768 ✅ |
| **900** | **64** | **40** | **796** | **768 ✅** |

> **At 900 the roster has 796px and needs 768. The 12px gap closes, with 28px to spare** — and nothing is
> dropped or scrolled at any supported width.

**What this changes, and what it does not:**

| | |
|---|---|
| **Changes** | **No column is dropped anywhere in the supported range.** The MFA / LAST SEEN drop order is a **backstop**, not a thing users will see |
| **Does not change** | **Build the rail collapse first.** It is still what frees the 156px; without it the roster overflows at 900 by a wide margin |
| **Does not change** | **Rule 2 still has to be built.** A roster grows, a name runs long, a column is added. The order is decided; it simply is not exercised today |

**⚠ Do not "simplify" by deleting the drop logic.** It is untriggered, not unnecessary — and the width at
which it starts mattering is one added column away.

*Verified against `caspr-gtm-portal` at commit `68f5155`, measuring computed widths in the browser at 1440,
1180, 1179, 1000 and 880.*

---

## 6 · Two things not to chase

| | |
|---|---|
| **1** | **Review Mode's `Reason Codes` and `Checks` rows** measure 4320px and 2640px of children — but both are **`layoutWrap: WRAP`** and reflow by design. **Review mode has no fixed-width text at all**, which is the right outcome under rule 3. **Keep it that way** |
| **2** | **Two frames in the file are retired and should not be built:** `Review Queue — Desktop` (`17:60`) and `Outreach — Desktop` (`23:295`) |

---

## 7 · What this deliberately does not cover

**Tablet portrait (768) and anything below 900 stay unsupported.** The design spec's desktop/mobile split
holds: **the console is a desk instrument; the Personal Queue is the mobile surface**, and the under-900
message routes rather than dead-ends.

**Widening support downward would mean designing the densest screen in the product twice** — which the split
already rejected, for good reasons.
