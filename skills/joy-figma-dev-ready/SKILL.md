---
name: joy-figma-dev-ready
description: Joy's personal design-engineering playbook. Audit and convert a Figma file into something a developer can actually build responsively and accessibly — Auto Layout conversion, a spacing scale, variable binding, WCAG 2.2 AA contrast/focus/target-size compliance, and a responsive region model. Use this whenever the user mentions Figma handoff, design-to-code, dev-ready designs, design system audits, design tokens or variables, auto layout, responsive breakpoints, WCAG/accessibility/EAA compliance in a design file, contrast failures, focus states, or pixel-perfect audits between a build and a design — and also when they simply say a build "doesn't match the design", their design "isn't responsive", or a developer is "building from coordinates". Reach for it even when the request sounds like a small fix, because these problems are almost never local.
---

# Figma → dev-ready

*Joy's playbook. Private.*

A design file is dev-ready when it **encodes intent**, not appearance. A frame drawn at one width with absolutely-positioned children contains no information about what should happen at any other width — and no engineering convention can invent it. This skill turns appearance into intent.

**This skill carries standards and method, not answers.** Every threshold here is a published requirement or a computation. Every *value* — which greys, which gaps, which regions — must be derived from the file in front of you. A scale that fits one product will quietly wreck another.

---

## Measure before you plan

Run the coverage and distribution audits first (`references/figma-scripts.md` §1–§3) and let them decide the work. Files differ enormously, and the same symptom has different causes.

**If Auto Layout coverage is already healthy (roughly 65%+), do not convert anything.** Skip to spacing, tokens and accessibility. Chasing coverage on a file that is already structured is the fastest way to break it. A file at 25% and a file at 77% need almost opposite interventions, and only measurement tells you which you have.

Then work in this order — each step is cheap after the previous and expensive before it:

1. **Decide responsive behaviour** — what is fixed, what fills, what hugs, per region
2. **Derive a spacing scale from the file** — without one, Auto Layout cannot be expressed
3. **Fix contrast and type** — cheap now, thousands of nodes later
4. **Bind variables** — colour *and* type, spacing, radius
5. **Convert Auto Layout** — only where it is actually missing
6. **Focus, targets, keyboard** — design work
7. **Code Connect** — needs 5

**Converting before deciding responsive behaviour just re-encodes a guess in a more expensive format.**

---

## Verify before you report

The expensive failures are not technical. They come from confident conclusions drawn from thin samples.

- **Sample breadth, not depth.** Two nodes on one page is not evidence about a file. Count across every page before claiming "the file has no X" — coverage is usually *uneven* rather than absent, and the fix for uneven differs from the fix for absent.
- **An empty API result means "not here", not "does not exist".** `get_variable_defs` returning `{}` on a frame means *those nodes are unbound*; the file may have a full token layer. Query the collections directly.
- **Check the parent before calling something a defect.** Tiny type inside a `screen`, `cover` or `thumbnail` frame is a miniature, not a bug. A 22px icon inside a 48px button is not a target-size failure. This single check routinely turns a hundred "findings" into none.
- **Establish a session before auditing a running build.** Chrome gated on auth produces confident nonsense about missing navigation.

State what you verified and how. When you were wrong, say so plainly — a correction costs a paragraph; an unchallenged wrong finding costs someone a day.

---

## 1 · The spacing scale — derive it, do not import it

**A Figma frame carries exactly one `itemSpacing`.** A stack whose gaps vary cannot be expressed at all. This — not overlapping children — is the usual reason conversions stall.

**Build the scale from the file's own histogram** (`figma-scripts.md` §3). Count every gap and padding, sort by frequency, and look at what the file already does. A product may be running a 2px base, a 4px base, or an 8px grid; the dominant values tell you which. Then tighten to the smallest set that covers most usage, and treat the rest as drift to be normalised.

Report the two numbers that matter: **what proportion of gaps and paddings are off-scale**. Padding is usually worse than gaps and is usually ignored.

Once a scale exists, use **one gap per wrapper**, nesting to express varied rhythm:

```
outer      VERTICAL  <large gap>
├─ group   VERTICAL  <medium gap>
│  ├─ pair VERTICAL  <small gap>
│  │  ├─ item
│  │  └─ item
│  └─ item
└─ group   VERTICAL  <medium gap>
```

**Tell the team pixels will move.** Off-scale gaps normalise, so things shift a few px. That is the conversion working — but unannounced it arrives as a batch of regressions in someone's pixel audit.

## 2 · Converting Auto Layout

Only where measurement says it is missing. Full method: `references/auto-layout.md`.

**Convert with a safety net, always.** Record every child's absolute position, convert, verify nothing moved beyond tolerance, **revert automatically on drift**. Without this you will mangle a file and not know which frame.

| Shape | Approach |
|---|---|
| Clean single-axis stack | Convert directly |
| Stack with a full-bleed background | Lift the background to `layoutPositioning: ABSOLUTE`, stack the rest |
| Repeated list — 3+ siblings, same cross-axis position and size, even gaps | Wrap in one auto-layout frame, snap spacing to the scale. **Highest yield, fully automatable** |
| Two-dimensional composition — icon beside a multi-line block, badge over a card | **Needs wrapper frames inserted.** Changes the node tree and moves IDs. Hand-build, with review |
| Data visualisations, device mockups, pinned furniture | Leave absolute, **and say so** |

**Do not chase a coverage percentage.** The goal is *the content that stacks, stacks*. A screen at 25% may be entirely correct if the remainder is a document column, a floating header and an overlay that legitimately overlap. Report what is deliberately absolute and why, or someone will read it as unfinished and force layout onto things that are not stacks.

**Containers surface defects that loose nodes hide.** Expect the pass to find real bugs — overlaps previously dismissed as hairlines, text boxes that cannot grow. That is a benefit.

## 3 · Contrast

Method and computation: `references/accessibility.md`.

Audit every text fill **against its actual background** — walk up to the nearest opaque ancestor rather than assuming white. Body text needs **4.5:1**; large text (≥18px, or bold ≥14px) and UI components need **3:1**.

**Check both directions.** Dark text on light surfaces is the obvious half. The half that gets missed is **light text on a saturated fill** — a white label on a brand-coloured button. Mid-tone brand colours frequently land just under 4.5:1 against white, which means the primary call-to-action fails while every audit that only looks at dark-on-light reports it clean. Test foreground *and* background roles for every brand colour.

**Group failures by colour pair, not by node.** Thousands of failures usually reduce to a handful of combinations — which turns an unreadable backlog into a palette decision someone can make in a minute.

**Expect the finding to be structural.** There is a luminance ceiling above which nothing passes: against white, a foreground needs relative luminance of roughly **0.175 or less** to reach 4.5:1. Compute it for the actual background rather than carrying a hex around. The consequence is usually that a palette has *more quiet levels than the standard permits*, and some must merge — say that out loud, because it is a design decision, and separating the survivors is then a job for size and weight.

Two rules that survive most audits:

- **A brand accent usually fails as text and passes as a fill.** The fix is rarely to change the brand colour — keep it for fills and borders and introduce a darker sibling for text. Many palettes already contain one as a hover or pressed state.
- **Failing colours remain valid for hairlines, icon strokes and dividers**, which carry no minimum. So write the rule as *"never a text fill on a light surface"* — scoped, and lintable, which is what stops it recurring.

Disabled text is **exempt** — WCAG excludes inactive controls.

## 4 · Type and variables

**Type.** Distinguish deliberate half-steps from scale artifacts. Half-steps (x.5) are almost always intentional type-scale values and may number in the hundreds. True artifacts are non-half fractions produced by scaling a frame — divide by the suspected factor to confirm. **A blanket "no fractional sizes" rule destroys real type scales**; check the parent, because miniatures inside mockup frames are meant to be tiny.

**Variables.** Bind **by role, not by value** — the same white is an inverse-text token on a label and a surface token on a card, and a hex map gets that wrong.

**Look past colour.** Colour variables are the ones teams create; **type, spacing and radius are the ones they skip**, and their absence is why those values drift. Report all four categories, not just the one that exists.

Binding also surfaces gaps: check which hexes remain unbound after a pass, ranked by frequency. The most-used value in a file is often the one nobody made a token for.

## 5 · Responsive

Full model: `references/responsive.md`.

**Declare intent per region, never per breakpoint.** You cannot enumerate zoom levels — 150% zoom on a wide screen *is* a narrow viewport — and foldables change posture mid-session. Regions plus min/max answer all of it; a breakpoint list answers none of it.

For each region state whether it is **fixed, fills, or hugs**, and its min/max. Then derive the thresholds arithmetically rather than choosing round numbers — **the first width at which something changes is often not the one anyone wrote down.**

**Figma cannot express shrink priority.** Auto Layout has no flex-shrink: sibling `FILL` frames split space *equally*. Encoding "this fills, min X, max Y" literally produces a region at its *minimum* on a wide screen, because it is one of several equal claimants. Where a frame and the CSS disagree, **write down that the CSS wins** — otherwise someone builds the frame.

**Watch for two mobile widths.** Marketing and product often diverge (375 vs 390 is common). One product should have one narrow width.

## 6 · Focus, targets, keyboard

Full spec: `references/accessibility.md`.

**Check whether "focus" frames actually draw focus.** Frames named for focus frequently differ from their default twin only by having text typed in — an empty-vs-filled state wearing the word. That is worse than nothing, because it looks solved. Equally, a file with hover/pressed/active variants and no focus variant at all is common: absence is the norm, not the exception.

- **Ring:** thickness is negotiable, **offset is not.** The gap is what keeps the ring legal on a filled button, where a flush ring sits colour-on-colour and fails. The 2px-perimeter rule is **AAA** (2.4.13) — at AA the measurable requirement is 3:1 contrast, met at any thickness.
- **`:focus-visible`**, never `:focus` — mouse users should not see rings.
- **Targets 24×24 — but check exemptions and parents before counting.** Inline and decorative targets are excluded, and a small icon inside a large button is not a failure. Raw counts overstate this badly. Fix hit area, not the drawn box.
- **Keyboard models** per ARIA APG. The two that break most often: **focus returns to the trigger** when a dialog or drawer closes, and **confirms open focus on the safe control**, never the destructive one.

---

## Compliance framing

Accessibility is a legal exposure, not a preference: the **European Accessibility Act** has applied since **28 June 2025** and reaches non-EU vendors serving EU consumers. If the product generates content, the **EU AI Act Article 50** (from **2 August 2026**) additionally requires machine-readable marking — a visible line does not satisfy it; XMP/OOXML provenance fields do, and C2PA is the durable answer.

**Verify any date or standard before citing it.** Getting one wrong by a year damages the argument you are using it to make.

---

## Reference files

- `references/auto-layout.md` — conversion algorithm, safety net, pattern library
- `references/accessibility.md` — contrast method and computation, focus, targets, keyboard models
- `references/responsive.md` — region model, flex declarations, collapse order
- `references/figma-scripts.md` — working Figma Plugin API snippets for every audit and conversion here
