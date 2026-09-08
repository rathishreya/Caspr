# Auto Layout conversion

Scripts in `figma-scripts.md` §5–§7.

## First: check whether you should convert at all

Run the coverage audit (`figma-scripts.md` §1) across every page before planning anything.

**If coverage is already healthy — roughly 65%+ — stop and go do spacing, tokens and accessibility instead.** A well-structured file gets worse, not better, from a conversion sweep, and the remaining absolute containers in such a file are usually absolute for good reason. Conversion is the right work for a file in the low tens of percent; it is the wrong work for a file in the seventies.

## Why conversions stall — measure, do not assume

When conversion *is* warranted, run the gap analysis before forming a theory. The intuitive explanation — overlapping children — is frequently wrong; the more common blocker is **uneven gaps**, which no single `itemSpacing` can express.

The distinction decides the whole approach. Uneven gaps are fixed by **a spacing scale and nesting**. Overlaps are fixed by **lifting backgrounds to absolute**. Two-dimensional compositions need **wrapper frames inserted by hand**. Guessing wrong wastes days, and the measurement takes one call.

## The scale comes first

A frame carries one `itemSpacing`. A stack whose gaps vary cannot be expressed. So:

1. **Derive a scale from the file's own histogram** — count every gap and padding, sort by frequency, and read what base the product actually uses. Do not import a scale from another project; a 2px-base system and an 8px-grid system are both valid and imposing one on the other rewrites thousands of values for nothing.
2. Nest so **each wrapper holds exactly one gap**
3. Warn the team that off-scale gaps will normalise and pixels will move

## Order of attack

**Bottom-up beats top-down**, even though "start with containers" sounds right. Leaves and mid-level containers (cards, rows, list items) are where clean stacks live; screen roots are compositions with overlays. Converting leaves first also means the wrappers exist when you come to the parents.

| Priority | Why |
|---|---|
| Repeated list runs | Highest yield per unit of risk, and fully automatable |
| Cards, rows, form stacks | Clean single-axis, usually convert directly |
| Components | Highest reuse — one fix propagates to every instance |
| Screen roots | Compositions; hand-build with wrappers |
| Data viz, thumbnails, pinned furniture | Leave absolute |

## Detecting a plan

For each candidate container:

1. **Separate absolute from flow.** A child covering ≥85% of the frame is a background — mark `layoutPositioning: ABSOLUTE`. So is a small child overlapping two or more others (a badge, a status pill).
2. **Sort the rest on each axis** and compute gaps. Any negative gap means real overlap — try the other axis, then give up.
3. **Require consistent gaps** (within ~1.5px). Uneven means nesting is needed, which is a hand job.
4. **Derive padding** from the bounding box against the frame edges. Negative padding means a child escapes the frame; skip it.
5. **Pick alignment** — all children sharing a start edge is `MIN`, all sharing a centre is `CENTER`, mixed means no plan.
6. **Set fill vs fixed per child** — a child spanning the full inner width is `FILL`, otherwise `FIXED`. This is the responsive information the build actually needs.

If no plan fits either axis, stop. **Record why it was left absolute** so the next person does not re-litigate it.

## The safety net

Record every child's position, convert, verify, revert on drift. Tolerance of 1px absorbs rounding.

This is not defensive padding — it is what makes bulk conversion safe to attempt at all. Expect a meaningful share of attempts to be caught and rolled back; that is the net doing its job, and the file stays intact.

**Do not bulk-script wrapper insertion.** Wrappers change the node tree and move IDs that prompts, specs and builds reference, and position-preservation cannot verify a tree where new nodes legitimately appear. Automate the safe transforms; hand-build the rest with review.

## Pattern library

| Pattern | Encoding | Why |
|---|---|---|
| Right-aligned bubble | full-width `HORIZONTAL` wrapper, `primaryAxisAlignItems: MAX` | Per-child alignment overrides are fragile and break when the parent changes |
| Numbered row | `HORIZONTAL` gap 0, number **fixed width**, text `FILL` | Holds the text edge when the numeral becomes 10 |
| Divider with a word | `HORIZONTAL`, both rules `FILL`, word hugs | Self-solves at any container width — no hand-measured rule lengths |
| Chat bubble | text is a **child**; frame hugs with padding | See below |
| Card / row stack | `VERTICAL`, children `FILL` | |
| Full-bleed background | `layoutPositioning: ABSOLUTE`, restore x/y | Keeps it behind content without joining the stack |

## What conversion finds

**Containers surface defects that loose nodes hide.** Expect the pass to find real bugs — this is a benefit, not a complication.

**The chat-bubble shape.** A rounded background `Frame` with the text as an *overlapping sibling* rather than a child. It looks perfect and cannot grow with its content — a longer string overflows silently. Sweep for it: a childless frame with exactly one text node inside its bounds. Filter out buttons, where the text fills the frame width edge to edge.

**Hairline overlaps you had dismissed.** A 2px touch against a text bounding box is arguable and gets waved through. The same 2px against a real container is not. If you dismissed something twice as invisible, re-measure it after conversion.

**Fixed-height text boxes.** Body copy at `textAutoResize: NONE` holds a stale height — often 10px for a 40px paragraph. Layout looks right because spacing was eyeballed against rendered text, so the metadata lies and nobody notices until something reflows. Set body copy to `HEIGHT` and re-check collisions.

## Reporting coverage honestly

**Percentage is not the goal.** A screen at 25% may be entirely correct if the remainder is a document column, a floating header, an overlay and pinned furniture that legitimately overlap.

Report it as: what converted, what is deliberately absolute **and why**, and what still needs hand-building. A bare percentage invites someone to force Auto Layout onto things that are not stacks — which is how files get mangled.
