# DEV-HANDOFF-2026-08-17 — build progress

Tracking the four-batch sequence in §4 of the handover. Updated as each lands.

| Batch | Status |
|---|---|
| **1. Selection system** | ✅ **Built and verified** |
| **2. Delete flow** | ✅ **Built and verified** |
| **3. Archive lifecycle** | ✅ **Built and verified** |
| **4. Add to Data Room** | ✅ **Built and verified** |
| 5. `FIGMA-DECISIONS-RESPONSE.md` | ✅ **All items done** (2, 4, review-3, review-6, review-7) |
| Cover-card collision | ✅ **Built and measured** — Option A, `2291:3553` |

---

## Batch 1 — done

**Icons.** All eight new glyphs generated from the Figma SVG exports rather than
transcribed, so the path data is byte-exact; `#5C5B58` becomes `currentColor` so
a destructive button can drive it from CSS. `add-to-dataroom`'s white 3.8
underlay keeps its literal colour — it is a halo against the icon's own strokes,
and without it the `+` and the stack merge. Lock is `2245:172`, not the red
status blob the handover warns about. Originals in `assets/icons/selection/`.

**Selection.** One hook and one toolbar serve both surfaces. Two rules worth
knowing:

- **Selection is pruned to what is visible.** A row can leave the view while
  selected (a filter changes, a search narrows), and keeping its id would let
  "delete selected" act on something the user can no longer see.
- **Select-all scopes to the filtered view**, with the whole library a second
  deliberate act. The escape hatch was marked *"not built, implement in code"* —
  it is built, and it says the real number rather than "all", because the point
  is that the user is about to act on rows they have not seen.

**Measured against the frames, not eyeballed:**

| | Frame | Built |
|---|---|---|
| Documents toolbar x | 0 / 158 / 247 / 342 / 440 | same |
| Documents toolbar y, h | 240, 27 | same |
| Button widths | 150 / 81 / 87 / 90 / 81 | same |
| Card checkbox | 102 / 8, 20px | same |
| Documents select-all | 762 / 243, 18px | same |
| Data Room row checkbox | 20 right inset, y24, 18px | same |
| Data Room toolbar | y150; Exclude 89, Delete 81 | same |

**Two bugs the browser caught** that typecheck and 305 passing tests did not:
selection keyed on query results rather than rendered cards (every tick was
pruned instantly), and a TDZ crash in the Data Room that took the whole page
down. Both fixed.

---

## Batch 2 — done

**One card, two sets of words.** `2264:3003` (single) and `2199:12923` (bulk) are
the same 400×306 at 747/297 on the same 39/39, 39/87, 39/187, 251 rhythm. The
single's metadata reads one higher on every axis only because `get_metadata`
measures the frame's outer box while the card draws its border inside — the
coordinate gotcha, showing up exactly where it always does. So it is one
component, and the difference is copy.

**Documents never had a single delete.** That was the parity gap, and it is why
the single confirm names the document: deleting one thing by name is a different
promise from deleting a count. Verified in the browser at 747/297, 400×306,
titled `Delete “EV Market Study”?`; two selected gives `Delete 2 documents?` and
Rename correctly disappears from the toolbar.

**The Data Room's bulk confirm inherits both options**, as the handover
specifies: Move to Excluded stays primary and Delete permanently secondary at
any count. That ordering is the rule the row menu used to carry — the reversible
thing is the easy one to reach — and it survives the menu's removal, which is
where the retired test's real content now lives.

**Documents offers no reversible alternative**, deliberately: a report has
nowhere to go, which is what Archive is for, and it sits two buttons to the left
in the same toolbar.

The "Delete all documents" foot row the handover says to remove **was never
built**, so there was nothing to take out.

**One fix beyond the spec:** the confirm's scrim was labelled `Cancel`, the same
as the real button, so a screen reader announced two identical controls for
different targets. It is `Dismiss` now, matching the signup overlay. Applied to
the Data Room's dialog too, since it had the same problem.

---

## Batch 3 — core built

**A correction to batch 1 first.** Reading `2229:2955` directly showed the
toolbar buttons are **radius 8**, border `#d6d4c9`, label `#1a1a17` — not the
radius 2 I built them at, nor the `#d6d4cd` the handover's prose gives. Fixed.

**✅ Resolved (Joy, 2026-08-18): follow the frames.** Radius 8 conflicted with
the 2026-08-11 rule ("radius stays 2 everywhere except confirmation overlays"),
and both `2229:2955` and `2266:3346` draw 8. The frames win for these buttons;
the rule stands everywhere else.

**Archive is its own axis, not a `status` value.** `LibraryDocument` gains
`archived_at`, because `status` is the generation lifecycle and archiving says
nothing about it: a finished report and a failed one can both be shelved.
Folding archived into `status` would destroy what a report was before it was
put away.

**Built:** the `archived_at` field end to end; a single
`POST /documents/lifecycle` taking `archive` / `restore` / `delete` for a list of
ids; `setLifecycle` on the documents hook; the shelf switch, which filters every
search, facet and group so an archived report cannot surface anywhere; the rail
entry at the foot with its count and divider; the retitled screen; the reduced
Restore + Delete toolbar; and batch 2's delete confirms now actually deleting.

One route rather than three because it is one decision made in one place, and a
bulk action half-applied across three endpoints leaves a library nobody can
reason about.

**A bug found by testing it:** `/documents/lifecycle` was not behind the auth
guard — `app.use('/documents', requireAuth)` matches the exact path only — so it
threw a 500 instead of refusing with a 401. Guarded now, with a test pinning it.

### The three that were outstanding — now closed

**The mobile Filters sheet** (`2271:3450`) is built and the `+3` overflow pill
opens it, which the handover marked *"not built, implement in code"*. It mirrors
the rail's categories and order, with Archived at the foot behind a divider.

The frame draws the sheet **472** tall, which is not one of the four locked
detents. Its content ends at y=344, so it renders at the nearest legal detent —
`half`, 408 — and nothing is cut. A fifth detent would have been the wrong fix
for 64px of empty space.

**The empty Archived state** is built. Nothing draws it, so it borrows the
library's own empty-state voice and says what the shelf is *for* — an empty view
that only said "nothing here" would leave someone wondering whether archiving
had worked at all.

**The round trip is verified in the browser**, end to end on a real account:

| Step | Result |
|---|---|
| Archive one of two reports | leaves the active shelf; rail count 0 → 1 |
| Open the shelf from the rail | shows exactly the archived report |
| Title | `LIBRARY / Documents` → `LIBRARY / Archived` |
| Toolbar on the shelf | **Restore + Delete only** — no Archive, Export, Rename or Add to Data Room |
| Restore | returns it to the active shelf |
| Empty shelf | "Nothing archived" |
| Mobile: `+3` → sheet → Archived | switches the shelf; compact heading reads `Archived` |

**One thing that check caught:** the compact heading still said "Documents" on
the archived shelf, so a phone showed the archived grid with nothing saying
which shelf it was. It follows the shelf now, like the desktop title card.

---

## Batch 4 — done

**Included and Private**, as specified. Included because that is the point — you
added it so the next analysis can read it. Private because a default that shares
is a default that leaks, and this is the user's own research.

`LibraryFile` already had `source_analysis_id` for exactly this, so nothing new
was needed in the model: a report filed as a source is a file that came from an
analysis, which the Data Room already knew how to say.

**The id is derived from the report's**, which makes it idempotent — pressing
the button twice updates one row instead of leaving two copies of the same
report in the room. Verified: pressed twice, still one file.

**One honesty fix it forced.** `fileMeta` rounds small sizes up to `1 KB`, and a
report added as a source has no byte size on this side — the rendered file lives
with the AI service. So it printed `1 KB · From an analysis`, stating a fact we
do not have. It now shows `From an analysis` alone when the size is genuinely
unknown, with a test either way.

Verified over the real wire: `included: true`, `privacy: private`,
`source_analysis_id` set, and the row lands in the **Included** section marked
`PRIVATE`.

---

## Status — 2026-08-18, end of the build

**The handover is complete.** Batches 1–4 and every item of §5 are built,
browser-verified and committed. Gate: typecheck, lint, **617 tests**, build.

| Item | Commit |
|---|---|
| Cover-card collision (Option A) | `129efe3` |
| Item 4 — Theater decode, Caspr alphabet | `f63ed02` |
| review-6 — conversational status + Creating cutoff | `1940203` |
| review-3 — Learning state (+ a 42px-narrow pane column, fixed) | `25a0784` |
| review-7 — scoped resets | `cbea9db` |
| Revisions meter retired (post-handover, Joy 2026-08-18) | `aaf0f64` |

**Not built, deliberately, each logged:**
- The decode's hidden-word easter egg (`CITED`) — §48. The spec does not say
  where a 5-letter word sits on a line sized to the source name.
- "Delete all documents" — superseded by the selection flow.
- Sample reports — explicitly non-blocking; content does not exist yet.
- The **per-call token line** that replaces the revisions meter — §49. The meter
  is removed and the frames agree, but nothing is drawn for what reports the
  cost, and `EDIT-ECONOMICS.md` requires Minor edits to show `0 tokens`.

**Open for Jayant:** `mode_change` carries only `'generating'`, so the Creating
cutoff is derived from the last-section/stored-version window rather than
signalled. A `mode: 'creating'` would make it first-class.

**Open for Joy:** SES credentials, Stripe test keys, the 4 email copy strings,
the `/verify` failure copy, the migration actuals — and the `25M+ live sources`
line in the Learning state, which sits against CLAUDE.md's `25M+`.

---

## Picking this up in a new session

**Read this section first. It is written to be enough on its own** — the session
that built batches 1–5 ran long, and everything it knew that still matters is
here or in the commits.

### Where things stand

Batches 1–4 of `DEV-HANDOFF-2026-08-17.md` are built and browser-verified. Of
item 5 (`FIGMA-DECISIONS-RESPONSE.md`), only **item 2 — retire the queue** is
done. Gate is green: typecheck, lint, 620 tests, build.

### What is left, in the order I would take it

**~~1. Item 4 — Theater decode.~~ DONE (commit `f63ed02`).** 36 glyphs exported
from `2104:168` and scaled 46 → 24; gate and `nsibidi.ts` deleted; meanings
caption removed. The hidden-word easter egg is **not** built — the spec does not
say where a 5-letter word sits on a line sized to the source name. See §48.

**~~The cover-card collision.~~ DONE (commit `129efe3`).** Option A: the status
chip moved to the cover foot and takes the accent rule's slot, so there is
always exactly one marker above the title.

**1. Item 4 — Theater decode (superseded; kept for the node-id note).**
The cultural-validation gate is **dissolved**: the churn is no longer Nsibidi but
an original 36-glyph **Caspr alphabet** (A–Z, 0–9), node **`2104:168`** on
`🧩 Components — Core`, named `caspr-alpha/<char>`, SVG viewBox 24, stroke 1.8,
round caps. So:
- Export those 36 glyphs the way the selection icons were done — `download_assets`
  with `defaultFormat: 'svg'`, take the **`export`** entry (the whole node), and
  **strip the artboard rects** the export wraps around the mark.
- Replace `apps/web/src/features/theater/nsibidi.ts` with the new set.
- **Delete `GLYPHS_VALIDATED`** and the `useDecodeEnabled` gate that reads it —
  the decode ships. `prefers-reduced-motion` still bypasses the churn.
- The machine itself (`decode.ts`, `DecodeRow.tsx`) does **not** change; it is
  already built and tested against a fake frame clock.
- ⚠️ Node ids in my build (`2099:168`) differ from the response doc
  (`2100:168` lineage / `2104:168` live). **Re-read before trusting either.**

**2. review-6 — conversational status + the Creating cutoff.**
The one with routing consequences: pre-Creating edits fold into v1, post-Creating
queue to v2, and the cutoff is what tells the user. Frames: desktop `2186:4565`,
mobile `2187:4708`. Eyebrow → `… · CREATING`, poll removed, `GENERATING THE
REPORT` → **`CREATING OUTPUTS`** divider → *"Finalizing your outputs — new
requests will apply to the next version."*

**3. review-3 — the Learning state.** Desktop `2138:4416`, mobile `2139:4497`. A
*state of the layout canvas*, not a new screen: eyebrow → `… · LEARNING`, scope
questions replaced by a red pulse dot, a line about reading live pipelines,
`PREPARING YOUR QUESTIONS`, and three skeleton bars.

**4. review-7 — scoped resets.** Three destructive actions with confirms.
⚠️ **The 2026-08-17 handover supersedes one of them:** "Delete all documents" is
retired, because the selection flow in batches 1–2 covers it. Build the other
two (Reset research profile, Reset Data Room) and leave that one out.

Not blocking: sample reports (explicitly "does not block the core build"), and
item 1 (thumbnails) / item 3 (Ask gap 24 / 9) are already satisfied by the build.

### Gotchas that cost this session real time

- **`get_metadata` returns frame-OUTER coordinates; `get_design_context` returns
  CSS (padding-box).** They differ by 1 inside a 1px border. Two confirm frames
  looked like different geometry and were the same card.
- **Figma SVG exports include artboard rects.** Strip them or the icon carries a
  grey background.
- **Never trust the handover's prose over the node.** It said toolbar borders were
  `#d6d4cd` and implied radius 2; the node says `#d6d4c9` and **radius 8**.
- **`rAF does not fire in a hidden browser pane.** Frame-driven work cannot be
  verified by poking a pane that is not on screen — use a fake clock in a test.
- **Check what a page actually renders before keying state to a query.** Documents
  falls back to the frame's own composition when the library is empty.
- **Declaration order in the page components is load-bearing** — a block reading
  `isIncluded` above its `const` took the Data Room down with a TDZ error that
  typecheck did not catch.

### The process failure worth not repeating

`git add -A` staged the deletion of 20 root documents — including
`QUESTIONS-FOR-JOY.md` and the handover itself — because they had already gone
missing from the working tree. Everything was recoverable from history and is
restored (commit `e2fbea3`). **Check `git status --short | grep -E '^.?D'` before
committing** — both columns, since an *unstaged* deletion shows as ` D` with a
leading space and an anchored `^D` sails straight past it. It happened a second
time on 2026-08-18 (`FIGMA-PROMPT-COVER-CARD-COLLISION.md`, restored). Something
in this environment removes root documents from the working tree; the guard is
the check, not the cause. See README-DEV.

---

## Calls I made, flagged for review

1. **`Make public` is 116 wide.** The frame only draws `Make private` (119).
   Include/Exclude and privacy "reflect the selection", so the opposite toggle
   has to exist and needed a width. Mine, from the label.
2. **Mobile Data Room toolbar** follows the Documents compact pattern
   (`2256:2992`) — glyph-over-label at left 16, count then select-all on the
   right. `2258:2927` was not separately measured.
3. **`FileCard` keeps the `≡`** when given no selection handler, so the
   standalone frame still renders as drawn for review. The live page never
   passes one, so the menu is gone from the product.
4. **Cover-card collision — with the design session.** The status tag sits at
   `right: 9.1` and the checkbox at `right: 8`, so they overlap on any document
   that is not `complete` — which is the first thing a new user sees, since a
   draft is created as soon as a layout returns. No frame draws both. Written up
   with four options in
   [`FIGMA-PROMPT-COVER-CARD-COLLISION.md`](FIGMA-PROMPT-COVER-CARD-COLLISION.md);
   left in the build exactly as the frames describe until it comes back.
5. **Three row-menu tests removed**, with the reason recorded in the file.
6. **The mobile delete sheet borrows the Data Room's drawer grammar.**
   `2207:2629` and `2264:13822` were not separately measured — same detent, same
   24 gutter, same rhythm, on the grounds that it is the same question asked
   about a different object.
7. **Nothing is actually deleted yet.** Both confirms close and clear the
   selection; the library mutation belongs with the Archive lifecycle in batch 3,
   which owns the state it writes to.

## Still open from the handover

- **Cover-card collision** — prompt written, awaiting the design session.
- Documents-desktop select-all: parked at the shared far-right x (762) as the
  handover specifies. Joy's question about reworking the toolbar stands.
- Tier-scaled free edit-bundle sizes — still the one open number.
