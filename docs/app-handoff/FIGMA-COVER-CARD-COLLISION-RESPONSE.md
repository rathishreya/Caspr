# Cover card — status tag vs. checkbox: resolved

**Re:** `FIGMA-PROMPT-COVER-CARD-COLLISION.md` · **File:** `y2F394I4CwEeSzH2kKuDCt` · **Date:** 2026-08-18
**Decision by Joy. Drawn and ready to build.**

## Decision — Option A (status moves to the cover foot)

The selection checkbox **keeps the top-right corner**; the **status tag moves into the cover foot**, taking the slot directly above the title.

Why the corner goes to the checkbox, not the tag: the checkbox is on *every* card and is right-aligned by a locked rule (`in both Data Room and Documents the checkbox is right-aligned`, and the Select-all column alignment depends on it). The status tag is transient (only draft/generating/failed) — so it's the element that adapts. The dev's Option 2 (checkbox to the left) is out for that reason; Option 3 (conditional shift) is out because it either jumps on hover or can't fit `GENERATING` beside the checkbox on a 130px card.

## One refinement worth noting

On a **completed** card the marker above the title is the **red accent rule** (the card's signature). On an **incomplete** card, the **status chip takes that same slot** — the accent rule is hidden while a status is shown. So there's always exactly one marker above the title, never both stacked, and no double-red on `FAILED`.

## The composition (reference: `2291:3553`)

Four cards drawn from `843:173`:

| State | Node | Above the title |
|---|---|---|
| Completed | `2291:3555` | red accent rule (unchanged) |
| Draft | `2291:3563` | `DRAFT` chip (neutral) |
| Generating | `2291:3573` | `GENERATING` chip (neutral) |
| Failed | `2291:3583` | `FAILED` chip (red) |

**Checkbox** — unchanged: `checkbox-on-dark` at cover-rel **x102, y8** (top-right).

**Status chip** — a small pill in the cover, cover-relative **x9, y102** (just above the title, where the accent rule sits):
- Layout: auto-layout, padding **6 / 3**, radius **3**.
- Neutral (`DRAFT`, `GENERATING`): fill white @ **15%**, text white @ **92%**.
- Error (`FAILED`): fill `#E8453C` @ **24%**, text `#FFB8B0` (light red).
- Text: Inter Semi Bold **8**, tracking **+6%**, uppercase.
- When present, set the accent rule (`843:177` equivalent) `visible = false`.

That's the exact first-analysis state (`DRAFT` + checkbox) the prompt asked for, plus the other two status states so the rule is unambiguous.

## No other changes

Everything else from `DEV-HANDOFF-2026-08-17.md` stands. Toolbar buttons stay at radius 8 per the frames — confirmed.

*Design session · 2026-08-18.*
