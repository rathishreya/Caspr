# Accessibility — contrast, focus, targets, keyboard

WCAG 2.2 AA. Scripts in `figma-scripts.md` §2.

## Contrast thresholds

| What | Minimum |
|---|---|
| Body text | **4.5:1** |
| Large text — ≥18px, or bold ≥14px | 3:1 |
| UI components, focus indicators, meaningful graphics | 3:1 |
| Disabled / inactive controls | **exempt** |
| Decorative elements | no minimum |

## Method

**Compute against the actual background.** Walk up to the nearest opaque ancestor. Audits that assume white are wrong on every tinted surface, and tinted surfaces are where borderline cases flip.

**Classify by size and weight before judging.** A colour pair failing at 4.5 may pass at 3 for a heading. Reporting those as failures destroys trust in the whole audit.

**Test every brand colour in both roles.** This is the step most audits skip:

- **as foreground** — the colour as text on light surfaces
- **as background** — white or near-white text sitting *on* that colour

Mid-tone brand colours frequently land just under 4.5:1 against white. When they do, **the primary button fails** — a white label on a brand-coloured fill — while a foreground-only audit reports the palette clean. It is the single most consequential miss available, because the failing element is the main call to action.

The resolution is usually one of: darken the fill, or make the label large or bold so 3:1 applies. Changing the brand colour is rarely necessary and rarely welcome.

## What the finding usually looks like

**There is a hard luminance ceiling.** Against white, a foreground needs relative luminance of roughly **0.175 or less** to reach 4.5:1. Compute the equivalent for the actual background rather than memorising a hex — that number moves with the surface.

The consequence is structural, not cosmetic: **a palette often carries more quiet levels than the standard permits**, and some must merge. Say that explicitly. It is a design decision, not a token swap, and the follow-on is that the surviving levels get separated by size and weight instead of by colour.

**Group failures by colour pair.** A handful of pairs usually account for everything. That converts an unreadable node list into a short set of palette decisions.

## Two rules that survive most audits

**A brand accent usually fails as text and passes as a fill.** Keep it for fills and borders; introduce a darker sibling for text. Many palettes already contain one as a hover or pressed state.

**Failing colours stay valid where no minimum applies** — hairlines, icon strokes, dividers, decorative marks. So write the rule scoped: *"never a text fill on a light surface."* Note the qualifier — the same colour is often correct as text on a dark surface. A scoped rule is lintable, and a lint is what stops the problem returning.

## Focus indicators

**Audit before designing.** Two common states:

- Frames *named* for focus that draw no focus — they differ from their default twin only by having text typed in. Worse than nothing, because it looks solved.
- A full set of hover/pressed/active/disabled variants with **no focus variant at all.** This is the norm, not the exception.

**The spec:**

| | |
|---|---|
| Ring | 1.5–2px |
| **Offset** | **≥2px — structural, not styling** |
| Radius | element radius + offset |
| Colour | ≥3:1 against adjacent colours, both sides of the gap |
| Trigger | **`:focus-visible`**, never `:focus` |

**Why the offset is non-negotiable:** on a filled button a flush ring in the same colour family sits colour-on-colour and fails 1.4.11. The offset puts the ring's outer edge against the page surface, where it passes. Thickness is negotiable; the gap is not.

**Thickness and the AA/AAA line.** The 2px-perimeter requirement belongs to **2.4.13 Focus Appearance, which is AAA**. At **AA**, 2.4.7 asks only that the indicator be visible, and the measurable requirement is 1.4.11's 3:1 — met at any thickness. Do not go thinner than the design's hairline border, or the ring stops reading as a state change and becomes a border-colour change.

**Two rules people forget:** never `outline: none` without a replacement in the same rule, and the ring must not be clipped by an ancestor's `overflow: hidden` (2.4.11 Focus Not Obscured) — its full bleed must fit inside a scroll container's padding.

## Target sizes — 2.5.8, 24×24

**Check parents and exemptions before counting.** Raw sweeps overstate this dramatically; most apparent failures are not failures.

Excluded:
- **A small icon inside a large control** — only the control is the target. Check the parent first; this alone usually clears the majority.
- **Inline targets** — anything within a sentence of text
- **Decorative elements** that are not targets
- **Spacing exception** — a small target whose 24px-diameter circle does not overlap another's
- **Essential** — where the size is legally or functionally required

**Fix hit area, not appearance.** Keep the drawn control and extend the tappable region with padding or a pseudo-element. Redrawing changes every screen it appears on for no accessibility gain.

## Keyboard models

Follow the [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/) per pattern. The failures that recur:

**Focus return.** When a dialog, drawer or menu closes, focus goes back to the control that opened it. The most common keyboard regression, and invisible to mouse testing.

**Confirms open focus on the safe control.** Never the destructive one. A keyboard user pressing Enter reflexively should cancel, not delete.

**Manual activation for expensive tabs.** If switching a tab loads content, arrow keys move focus *without* activating; Enter or Space activates. Automatic activation fires a load per keypress.

**Escape steps rather than dismisses.** For a multi-detent drawer or a nested overlay, `Esc` should step down one level — otherwise a keyboard user cannot reach intermediate states at all.

**A skip link** as the first tabbable element, revealed on focus, targeting main content. Without it, keyboard users traverse the whole navigation on every page.

**Modality follows size.** A drawer at full height is a modal dialog — trap focus, `aria-modal`, background inert. The same drawer at a partial detent is not — let Tab pass through.

## Compliance dates — verify before citing

- **European Accessibility Act** — applies since **28 June 2025**, reaches non-EU vendors serving EU consumers. WCAG 2.1/2.2 AA via EN 301 549.
- **EU AI Act Article 50** — from **2 August 2026**. Disclosure of AI interaction (with an "obvious from context" exemption), and **machine-readable marking of generated content**.

**A visible line does not satisfy the marking obligation.** It needs metadata — XMP for PDF, core properties plus a custom part for OOXML — and **C2PA Content Credentials** is what detection tooling actually reads. Ship metadata fields now; architect so a signed manifest can be added without reworking the export pipeline.

Getting one of these dates wrong by a year undermines the argument you are using it to make.
