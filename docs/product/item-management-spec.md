# Item management — selection, delete, and archive

**Status: SPEC (v1, 2026-08-17).** Canonical product spec for managing items in **Documents** (your generated reports) and **Data Room** (your uploaded/connected sources). Companion to the dev resume-prompt `../app-handoff/DEV-HANDOFF-2026-08-17.md` (which carries the build node IDs). File: `y2F394I4CwEeSzH2kKuDCt`.

## Why this exists

Documents had **no way to delete a single report** — you could only "delete all". Data Room had a per-row `☰` menu but no way to act on **several** items at once. This spec adds one selection mechanism that gives both surfaces single, multi, and select-all — plus an **Archive** lifecycle so reports can be tucked away without deleting.

---

## 1. The selection model (Gmail-style)

One mechanism, identical on both surfaces, desktop and mobile:

- **Every item carries an always-visible right-aligned checkbox.** Always visible because it must work on touch (no hover to reveal it).
  - Documents cover cards: a subtle checkbox at the card's **top-right**.
  - Data Room file rows: a checkbox at the **row's right**. The old `☰` row-menu is **removed** — its actions move into the selection toolbar.
- **A "Select all" checkbox sits top-right, in the same column as the item checkboxes.**
- **Selecting ≥1 item swaps the filter/controls row for an action toolbar.**
  - Desktop: bordered buttons (icon + label) — same shape as the filter pills they replace.
  - Mobile: standalone **glyph-over-label** items (the bottom-nav grammar). **The title bar is never taken over.**
- **Body-click opens the item; only the checkbox selects.**
- **Select all** scopes to the current filtered/search view, with a "Select all N" escape hatch for the whole library (Gmail pattern).

### Actions

| Surface | Toolbar (safe → destructive) |
|---|---|
| **Documents** | Add to Data Room · Export · Archive · Rename\* · **Delete** |
| **Data Room** | Include · Exclude · Make private/public\*\* · **Delete** |

\* Rename shows only when exactly one item is selected.
\*\* Toggles reflect the selection; a mixed selection shows both Include and Exclude.

- **Add to Data Room** adds the selected report(s) as sources — **Included by default, set to Private.**
- **Data Room has no Archive** — Exclude is its non-destructive declutter. That asymmetry is deliberate.

---

## 2. Delete

Single delete names the item; multi/all delete uses a live count.

| Scope | Documents | Data Room |
|---|---|---|
| **Single** | "Delete "EV Market Study"?" | "Delete this file?" (Move to Excluded / Delete permanently) |
| **Multiple** | "Delete N documents?" | "Delete N sources?" |
| **All (via Select-all)** | "Delete all 2,847 documents?" | "Delete all N sources?" |

- Documents delete is permanent (with the never-undone warning). Data Room offers **Move to Excluded** (reversible) as the primary, **Delete permanently** as the destructive secondary.
- The old **"Delete all documents"** foot row is **removed** — single + multi + select-all cover it. **Reset Data Room stays** (it also clears Connected sources — a genuine superset of a file delete).

---

## 3. Archive — a third lifecycle state

Reports are **Active / Archived / Deleted**. Archive tucks a report out of the active library without deleting; **Restore** brings it back. (Data Room has no archive.)

- **Reaching Archived**
  - Desktop: an **"Archived"** entry at the **foot of the filter rail** (below Geography), with a count.
  - Mobile: a **Filters bottom-sheet** (categories + Archived at the foot), opened from the filter-pills area.
- **The Archived view** is the Documents grid retitled **Archived**; its selection toolbar is reduced to **Restore + Delete** only.
- **Restore** returns items to the active library; **Delete** from the archive is permanent.

---

## 4. Icons (Caspr line set, `#5C5B58`)

New glyphs drawn to match the existing icon color and weight:

- **Add to Data Room** — the existing Data Room icon + a haloed neutral `+` (white outline over the busy glyph, no circle).
- **Archive** — a banker's box with a **down**-arrow (distinct from Export's open-tray download).
- **Restore** — the same box with an **up**-arrow.
- **Delete / Rename / Include / Exclude / Make private** — trash / pencil / eye / eye-off / padlock.

Toolbar buttons: bordered, icon + Inter 12.5 label; **Delete is red `#E8453C`**. Mobile: 22px glyph over a one-word label.

---

## 5. Build state (Figma)

All node IDs are in `../app-handoff/DEV-HANDOFF-2026-08-17.md`. Summary:

- **Selection** built on all four surfaces (Documents + Data Room, desktop + mobile) — idle (live screens) + selection states.
- **Confirms** — single + bulk, both surfaces.
- **Archive** — filter-rail entry (desktop), Filters sheet (mobile), Archived view (desktop + mobile), **empty Archived state (desktop + mobile)**, Restore glyph.
- **Not yet built (dev):** wiring the mobile filter control to open the Filters sheet; the Select-all "select all N" escape hatch; single-delete on mobile.

**Empty Archived state:** follows the empty-state system (line glyph · Instrument Serif headline "Nothing archived" · one Inter body line). The single-red-CTA slot is repurposed to a navigational **"Back to your library"** — archiving isn't a create action, so a create-CTA would be dishonest, but the red button stays for system consistency.

## 6. Open decisions

- **Documents-desktop Select-all** stays parked at the shared far-right x (the card grid + toolbar span can't column-align a single Select-all without collision). Confirmed leave-as-is (Joy, 2026-08-17).
- Everything else in this spec is approved.

---

## Related session updates (not this feature, same session)

For completeness, the same session also delivered (all in `FIGMA-DECISIONS-RESPONSE.md` and the specs below):
- **review-6** — conversational status narration + the **Creating cutoff** (v1/v2 boundary). → `gate-output-spec.md`
- **review-7** — account resets restructured into three scoped actions. → `account-wallet-screens.md`
- **A3** — the 2-turn Ask threading precedent.
- **Edit economics** (`EDIT-ECONOMICS.md`) — now noting margin is Jayant-side (API returns marked-up token numbers; product records as-is).
- **Sample reports** (`SAMPLE-REPORTS.md`) — the seeded-activation mechanism.
