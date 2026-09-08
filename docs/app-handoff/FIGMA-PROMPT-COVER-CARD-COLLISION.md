# Cover card — the status tag and the new checkbox occupy the same corner

**File:** `y2F394I4CwEeSzH2kKuDCt` · **From:** the build session · **Date:** 2026-08-18
**One question. Everything else from `DEV-HANDOFF-2026-08-17.md` is built.**

---

## The problem

The selection checkbox added on 2026-08-17 and the status tag that was already
there both sit in the cover card's **top-right corner**, and they overlap.

| | Position in the 130-wide card | Node |
|---|---|---|
| **Status tag** (`DRAFT`, `GENERATING`, `FAILED`) | right inset **9.1**, top 9.1 | `843:173` |
| **Selection checkbox** (20 × 20) | right inset **8**, top 8 | `2226:2681` on `2229:2691` |

They are ~1px apart on both axes, so on any card carrying a status they sit on
top of each other.

**No frame draws both.** Every card in `2229:2680`, `2256:2868` and `2271:3373`
is a completed report, and a completed report has no status tag — Status is a
tag, not a filter, and it renders **only when the analysis is not complete**
(`documents-categorization-alignment.md`, locked 2026-07-31). So the two have
never appeared together on the canvas, which is exactly why it was not caught.

**In the live app they collide immediately.** A draft is created the moment a
layout comes back, so the first thing a new user sees in their library is a card
with a `DRAFT` tag — and now a checkbox drawn through it.

## Why I have not fixed it

There are at least four reasonable answers and they look quite different from
one another. Picking one would be inventing a design, which is the one thing I
do not do — so the collision is in the build exactly as the frames describe it,
waiting on you.

## The options, as I see them

1. **Move the status tag to the bottom-left of the board**, under the accent
   rule, near the title. Keeps the corner for selection, and status reads with
   the title rather than floating. Costs: the tag stops being scannable in a
   grid, which may be the reason it is up there.
2. **Move the checkbox to the top-left**, swapping with the tier label
   (`STUDY` / `BRIEF` / `INTELLIGENCE`). Gmail puts selection on the left, so
   this is not unusual — but the tier label is the card's anchor and it would
   have to go somewhere.
3. **Shift the tag left when a checkbox is present**, e.g. to a right inset of
   ~34. Cheapest change, keeps both where they are, and the tag's position
   becomes conditional — which is a rule someone has to remember later.
4. **Suppress the tag while selecting.** Simple, and wrong in the case that
   matters: choosing what to archive or delete is exactly when you want to know
   which ones failed.

**My weak preference is 1**, because it is unconditional — the tag has one
position and always has it. But this is a compositional judgement about a card
you designed, so it is yours.

## What I need

The option, or a frame. If you draw it, `843:173` with a `DRAFT` tag **and** a
checkbox is the one composition that would settle it — it is the state the app
produces on a user's very first analysis and the only one no frame currently
covers.

## For completeness

Everything else from the 2026-08-17 handover is built and verified: the
selection system on both surfaces, the delete confirms, the Archive lifecycle
with its rail entry, Archived view, Restore, mobile Filters sheet and empty
state, and Add to Data Room. Toolbar buttons are at **radius 8** per the frames
(`2229:2955`, `2266:3346`) — Joy confirmed the frames win over the radius-2
rule for these.

*Prompt from the build session · 2026-08-18.*
