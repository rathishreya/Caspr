> ⛔ **SUPERSEDED — folded into [`DEV-BRIEF.md`](DEV-BRIEF.md) (2026-08-19).** Kept for history. Do not build from this file.

# Caspr app — dev handover (2026-08-17)

**File:** `y2F394I4CwEeSzH2kKuDCt` · **From:** design session · **For:** the paused dev session, to resume.

This is the master index of everything changed since the dev session was paused. Two prior response docs stand — read them alongside this:
- **`FIGMA-DECISIONS-RESPONSE.md`** — review-1/2/3/6/7, A1/A3/A4, edit-economics, samples, no-queue. All still valid.
- **`EDIT-ECONOMICS.md`**, **`SAMPLE-REPORTS.md`**, **`THEATER-SOURCE-DECODE-MOTION.md`** — living specs.

Process reminders unchanged: `setCurrentPageAsync` before any sweep; re-read nodes after edits; a `use_figma` call that throws rolls back the whole call. New gotchas from this session are flagged inline.

---

## What's new since the pause (index)

1. **Item management / multi-select** — the big one. A Gmail-style selection system on Documents and Data Room (desktop + mobile), replacing the old per-row `☰` menu and giving Documents single/multi delete it never had. **Full spec below.**
2. **Archive** — a new report lifecycle state (Active / Archived / Deleted) with an Archived view and an "Archived" filter-rail entry.
3. **Delete confirms** — single + bulk, both surfaces.
4. **New icon components** — drawn in Caspr's line set (`#5C5B58`).
5. **Margin clarification** — the product no longer computes margin; Jayant's API returns marked-up token numbers, recorded as-is (`EDIT-ECONOMICS.md` updated).
6. Everything in `FIGMA-DECISIONS-RESPONSE.md` (review-6 conversational status + Creating cutoff, review-7 account resets, A3 Ask precedent, A1 chart marks) — unchanged, ready to build.

---

## 1. Item management / multi-select (Joy-approved 2026-08-17)

### The model

One selection mechanism, identical on both surfaces:

- **Every item carries a right-aligned checkbox**, always visible (no hover-reveal — it must work on touch).
  - Documents cover cards: a **checkbox-on-dark** at the card's top-right.
  - Data Room file rows: a **checkbox-light** at the row's right. **The old `☰` row-actions menu is removed** — its actions now live in the selection toolbar.
- **A "Select all" checkbox sits top-right, in the same column as the item checkboxes.**
- **Selecting ≥1 item swaps the filter/controls row for an action toolbar.**
  - Desktop: bordered buttons (icon + label), same shape as the filter pills they replace.
  - Mobile: standalone **glyph-over-label** items (bottom-nav grammar) — **the title bar is never taken over.**
- Body-click still opens the item; only the checkbox selects.

### Actions per surface

| Surface | Toolbar actions (left → right, destructive last) |
|---|---|
| **Documents** | Add to Data Room · Export · Archive · Rename\* · **Delete** |
| **Data Room** | Include · Exclude · Make private/public\*\* · **Delete** |

\* **Rename** shows only when exactly one item is selected.
\*\* Include/Exclude and privacy reflect the selection; a mixed selection shows both toggles.

- **Add to Data Room** adds the selected report(s) as sources — **Included by default, set to Private.**
- **Select all** scopes to the current filtered/search view; a "Select all N" escape hatch is needed for the whole library (Gmail pattern) — **not built, implement in code.**
- **Data Room has no Archive** — Exclude is its declutter. That asymmetry is intentional.

### Frames (built)

| State | Documents | Data Room |
|---|---|---|
| **Idle** (checkboxes present) | `843:89` (desktop) · `1280:196` (mobile) | `1756:2` (desktop) · `1766:2` (mobile) |
| **Selection** (toolbar shown) | `2229:2680` (desktop) · `2256:2868` (mobile) | `2242:2777` (desktop) · `2258:2927` (mobile) |

Idle states are the **live screens** — the checkbox is a real persistent addition. Selection states are separate frames showing 1–2 items selected.

### Components (new, on `🧩 Components — Core`)

| Component | Node | Notes |
|---|---|---|
| checkbox-on-dark / idle | `2226:2681` | 20px, r2, white border @0.55 / black fill @0.32 — subtle on dark covers |
| checkbox-light / idle | `2240:169` | 18px, r2, grey `#b4b2a9` border on white — for Data Room rows + select-all |
| (checked, both) | `1760:70` | existing red + ✓ checkbox, reused for the checked state |
| add-to-dataroom glyph | `2223:184` | the **existing DR rail icon** (`626:26`) + a haloed grey `+` (white underlay stroke + `#5C5B58` stroke, no circle), plus nudged up-left to overlap |
| archive glyph | `2223:174` | banker's box + **down**-arrow |
| restore glyph | `2265:173` | banker's box + **up**-arrow (unarchive) |
| trash / pencil / eye / eye-off | `2228:173` / `2228:177` / `2228:181` / `2228:187` | delete / rename / include / exclude |
| lock (padlock) | `2245:172` | make private — **note:** `157:153 "State=Locked"` is a red status blob, **not** a padlock; use `2245:172` |
| export / download | `926:2497` | existing, reused |

**All new glyphs are stroke `#5C5B58`** to match the existing icon set (not near-black). Toolbar buttons: bordered frame, icon 15px + Inter 12.5 label, border `0.5px #d6d4cd`; **Delete is red `#E8453C`** (border + label). Mobile glyph items: icon 22px over Inter 9.5 label.

### Gotchas (cost me real time — heed them)

- **Never create a component inside a screen frame.** I put `checkbox-on-dark` inside the Documents content column; cloning the screen cloned the component, and the clone's instances pointed at the stale copy — my later fix didn't reach them. Components live on the Components page.
- **Select-all alignment:** it must sit in the same column as the item checkboxes. On the selection frames the select-all is a checked-box clone containing a `✓`, so a "18×18 box with ✓" finder matches the checked *row* box instead — target the box that's a **direct child of the content column**. On mobile, rows are inset at frame-x16, so a row-relative checkbox at x326 is frame-abs 342; set the select-all's frame-x to `rowCheckbox.absoluteBoundingBox.x − frame.absoluteBoundingBox.x`.
- **Documents desktop select-all** can't column-align with the card checkboxes (grid: three columns; the toolbar spans out to ~x530 and would collide). It's parked at the shared far-right x (762) for consistency with Data Room. Flagged to Joy — open if she wants the toolbar reworked to free the last card column.

---

## 2. Archive — a third lifecycle state

Reports are now **Active / Archived / Deleted**. Archive tucks a report away without deleting; Restore brings it back.

- **"Archived" entry** at the **foot of the Documents filter rail** (`843:243`): a divider, the archive glyph, "Archived", and a count. Below GEOGRAPHY.
- **Archived view** — desktop `2266:3233` and **mobile `2268:3321`**: the Documents grid retitled to `Archived`; the selection toolbar is reduced to **Restore + Delete** only (the two actions that apply to archived items). Restore uses the restore glyph (`2265:173`).
- **Data Room needs no archive.**

- **Mobile route into Archived** — a **Filters bottom-sheet** (`2271:3373`): opened from the filter-pills area (the `+3` overflow / a filter control), it lists the categories (Project · Type · Sector · Theme · Geography as tappable rows) with **Archived at the foot** (archive glyph + count), mirroring the desktop rail. Tapping Archived → the mobile Archived view (`2268:3321`).
- **Empty Archived state** — desktop `2273:3425`, mobile `2274:13877`: the empty-state system (line glyph · Instrument Serif "Nothing archived" · one Inter line · single red CTA), the CTA repurposed to **"Back to your library"** (nothing is *created* into an archive, so a create-CTA would be wrong; the red button stays for system consistency). Rail/count shows Archived = 0.

**Not built — spec for dev:** wiring the `+3` pill (or a dedicated filter icon) to open the Filters sheet; the Select-all "select all N" escape hatch; single-delete on mobile.

---

## 3. Delete confirms

Single names the item; bulk uses a live count. All reuse the existing confirm patterns.

| Confirm | Node | Copy |
|---|---|---|
| Documents — bulk | `2199:12923` (desktop) · `2207:2629` (mobile) | "Delete 2 documents?" — repurposed from the old delete-all confirm per Joy. Parameterize N; on Select-all → "Delete all 2,847 documents?" |
| Documents — single (NEW) | `2264:3003` (desktop) | "Delete "EV Market Study"?" — the parity gap Documents never had. Mobile follows the same sheet. |
| Data Room — bulk | `2264:13646` (desktop) · `2264:13822` (mobile) | "Delete 2 sources?" — cloned from the delete-file confirm; inherits its **Move to Excluded** (primary) / **Delete permanently** (secondary) options |
| Data Room — single | `1775:2` (desktop) · `1784:290` (mobile) | existing "Delete this file?" — unchanged |

The **"Delete all documents" foot row** built earlier in review-7 is **removed** (single + multi + select-all now cover it). **Reset Data Room stays** — it clears Connected sources too, a genuine superset. Note: repurposed-confirm backgrounds are frozen at an earlier screen state (dimmed under the scrim) — the modal is the deliverable; dev renders it over the live selection.

---

## 4. Sequencing for the dev

1. **Selection system** — checkboxes, select-all, the pills→toolbar swap, both surfaces + mobile. No code change beyond wiring the actions; the marks all exist.
2. **Delete flow** — single (named) + bulk (counted) confirms; Select-all "select all N" escape hatch.
3. **Archive lifecycle** — the state, the Archived view + rail entry, Restore. Build the mobile Archived variants from the specs above.
4. **Add to Data Room** — report → source (Included + Private).
5. Everything in `FIGMA-DECISIONS-RESPONSE.md` remains on the list (review-6/7, A1, A3).

## Open questions (Joy)

- Documents-desktop Select-all: leave at the shared far-right x, or rework the toolbar so it can sit above the last card column?
- Tier-scaled free edit-bundle sizes (the retention dial) — still the one open number (margin is resolved: Jayant's API returns marked-up figures, recorded as-is).

*Design session · 2026-08-17. Reply in the usual shape — a table of what changed with node ids, your own calls marked as calls.*
