# Caspr — Data Room screens & file-management flows (dev handoff)

**Scope:** the Data Room screen on the Documents page — file list, per-file actions (move / switch privacy / delete), the add-file pane/drawer, the multi-file **uploading** state, and the **delete confirmation** flow. Desktop + mobile.

**Data model is authoritative in [`document-taxonomy.md` §B](document-taxonomy.md#§b--data-room-all-user-uploaded-files).** This doc is the UI/interaction layer only; every state below maps to a field there (B1 Classification, B2 Inclusion, B7 Status). Where a rule reads "why," it is quoting §B — don't reinvent it.

Figma file `y2F394I4CwEeSzH2kKuDCt`, page **📁 Documents** (`184:4`).

---

## 1. Frame index

| Frame | Node | Breakpoint |
|---|---|---|
| Data Room — base | `1756:2` | Desktop |
| Data Room — add files (pane state) | in `1756:2` (Conversation Pane) | Desktop |
| Data Room — uploading | `1791:2` | Desktop |
| Data Room — row actions (menu) | `1778:81` | Desktop |
| Data Room — delete file (confirm) | `1775:2` | Desktop |
| Data Room — base | `1766:2` | Mobile |
| Data Room — add files (drawer) | `1768:2` | Mobile |
| Data Room — uploading | `1796:2` | Mobile |
| Data Room — row actions (sheet) | `1785:356` | Mobile |
| Data Room — delete file (confirm) | `1784:290` | Mobile |

On the Documents page the new-flow frames sit **below** the base row (desktop flow ≈ y2382, mobile flow ≈ y3462).

---

## 2. Layout

**Desktop** = three-column shell (rail · add-file pane · content). **Centre** = the file library (read); **pane** = add-a-file (do).
**Mobile** = centre is the library; the add-file / actions / confirm surfaces are **bottom drawers** (`Drawer — v3 (white)` `628:5`, Half detent, instanced at y380, never resized).

**Centre (both):** dark eyebrow title bar (`YOUR FILES · Data room`, right side = live counts "2 Included · 1 Excluded") → search → three grouped sections: **Included** (surfaces by default) · **Excluded** (never auto-attached — opt-in per analysis) · **Connected** (external subscriptions — **Coming soon**). Content sourced from the taxonomy §B states, not separate stores.

---

## 3. File-card anatomy (the row)

Left → right: **document glyph** (folded-corner vector, not a checkbox) · **filename** (truncates with ellipsis) · **meta** line (`size · date`, plus `From: <source>` on excluded) · then a right cluster, **vertically centred on the card**:

```
[ PRIVATE|PUBLIC tag ]   [ ≡ ]
```

- **State tag** — compact chip. `PRIVATE` = dark (ink) fill/white text; `PUBLIC` = light grey fill/grey text. Read-only indicator of B1.
- **`≡` (three-line control) — dual purpose:** it is **both the drag handle** (drag a card between Included ↔ Excluded) **and the row-menu trigger** (tap/click opens the actions menu). One control, so the row stays narrow and long filenames never collide with a stack of icons. *(Replaced the earlier tag▾ + trash + grip trio, which ate horizontal space.)*

Everything else a user does to a file (switch privacy, move, delete) lives in the menu the `≡` opens — see §4.

### 3a. Sort order
Each centre section (Included / Excluded) is sorted **most-recent-first** (newest upload/created date on top). Consequence: an in-progress upload appears at the **top** of Included and simply settles into place when it completes (§6).

---

## 4. Row actions — menu (desktop `1778:81`) / sheet (mobile `1785:356`)

Opening `≡` shows the same three actions on both breakpoints (desktop = anchored popover; mobile = bottom action sheet titled with the filename + `size · Included · Private`):

1. **Make public** / **Make private** — toggles B1. Label reflects the *opposite* of current state.
2. **Move to Excluded** / **Move to Included** — toggles B2.
3. **Delete…** (red) — opens the confirmation (§6). The `…` signals a second step.

Desktop popover carries a caption: *"≡ also drags the file between Included / Excluded."*

### Privacy-switch logic (B1 — one-way-safe)
- Default on upload = **Private**. `Public → Private` is always allowed (no confirm). `Private → Public` is the **explicit** action (the menu item / the upload's Private checkbox) — because forgetting to mark private is a leak, forgetting public is only inconvenient.

### Move logic (B2 — asymmetric)
- **Included → Excluded is instant** (drag or menu).
- **Excluded → Included requires a one-tap confirm** — it opens previously-locked material to default reuse everywhere. (Same rationale the delete dialog leans on.)

---

## 5. Add a file — pane (desktop, in `1756:2`) / drawer (mobile `1768:2`)

Heading `ADD FILES` (§57 eyebrow style). Then **two checkboxes on one row:**
- **Include in future analyses** — pre-checked (drops the file into the general Included pool).
- **Private** — **unchecked by default** (sets B1 for the incoming files; leaving it unchecked = public-by-default *for this upload*, independent of the per-file default). Checking it uploads them Private.

**Input:**
- **Desktop:** a square dashed **drop box** ("Drop files, or click to browse · PDF · XLSX · CSV · DOCX — multiple at once"), tray-and-up-arrow glyph, no button (the box *is* the action). Below it, secondary: **"— or paste a link —"** + a URL field (articles, datasets, public reports — Caspr fetches & indexes them).
- **Mobile:** the drop box collapses to a primary **"Upload files" button** (touch-friendly); **paste-a-URL is the second option** beneath it.

**Connect a source** (below, both): `OR CONNECT A SOURCE` + **COMING SOON** tag (red text, right-aligned to the box edge) + full-width source rows (Bloomberg, Refinitiv, S&P Capital IQ, PitchBook…) — monogram + name + "Connect via your account" + grey **Connect** (pull via the user's own subscription/login, API-connected). Non-functional until built.

---

## 6. Uploading state (desktop `1791:2` / mobile `1796:2`)

Maps to **B7 Status `uploading`.** **The uploading files appear in the CENTRE, not in the pane/drawer** — the add-file surface stays exactly as-is so the user can keep adding more while others upload. **No scrim** (see §10).

- **Each uploading file shows as a normal file card at the TOP of the centre Included list** (files are sorted most-recent-first, so new uploads land on top — see §3a). The card shows: doc glyph · filename · `size · Uploading…` · a right-aligned **percent** (DM Mono, grey) · a **neutral dark/ink progress bar along the card's bottom edge** on a light track (no tag / no `≡` yet). **The bar is ink, NOT red** — red reads as an error (Joy). **On completion the card simply becomes a normal file card** (tag + `≡`); there is no separate "done" colour or state.
- The **pane (desktop) / drawer (mobile) is untouched** — drop box / Upload button, paste-a-link, and connect-a-source all remain live for the next file(s).
- A completed file flips to a normal card (tag + `≡`); a failed file → `upload_failed` (red state + retry — *styling TBD*).

**Rationale (Joy):** the file is the deliverable — it belongs in the library the moment it starts landing; the add-file surface is a tool, not a status board. Uploaded inside a Project → lands in Excluded instead (B2 default-by-path). New uploads sit at the top of Included per the sort rule (§3a).

---

## 7. Delete confirmation (desktop `1775:2` / mobile `1784:290`)

**Delete is never immediate — it always confirms, and the confirm nudges toward keeping the file.** Triggered by **Delete…** in the row menu/sheet.

- **Title:** "Delete this file?"
- **Body:** *"This removes "<filename>" from your Data Room — Caspr can't re-attach it to future analyses. To keep it out of analyses but still available, move it to Excluded instead."*
- **Actions (hierarchy = nudge to the safe path):**
  1. **Move to Excluded** — primary red CTA (the recommended alternative; performs the B2 move, no delete).
  2. **Delete permanently** — subordinate red **text link** (the actual destructive action).
  3. **Cancel** — neutral/grey.

Desktop = centred modal card over a scrim (x747, matching the account-overlay convention). Mobile = Half drawer (`628:5`) over a scrim, serif title, same three actions stacked. Rationale: deletion loses the uploaded copy irreversibly; Excluded preserves it while removing it from default reuse — so the dialog offers the reversible move first.

---

## 8. Scrim rule (applies app-wide — Joy, 2026-08-08)

**A mobile drawer gets a scrim ⟺ its desktop counterpart is a scrimmed modal. Otherwise, no scrim.** A drawer that is the working surface (add-file, actions, a menu, an edit form that on desktop lives in a pane or the centre) must **not** dim the screen it is acting on — that context is the whole point. Only a **blocking modal** (a destructive/confirmational overlay that on desktop appears on a scrim) dims on both breakpoints.

Applied:
- **Data Room** — *scrim:* delete-file confirm (desktop `1775:2` + mobile `1784:290`). *No scrim:* add-file drawer `1768:2`, uploading `1796:2`, row-actions sheet `1785:356` (its desktop form is a popover).
- **Profile & Wallet** — *scrim kept:* change-email (enter/sent), reset, delete-account (mobile `1658:98` / `1662:2` / `1662:52` / `1658:151`; desktop `1646:*`). *Scrim removed:* account menu `1669:2`, research-profile questions `1689:2`, edit-name `1698:2`, two-factor `1698:37`, language picker `1698:86`, password change `1700:2`, Help full-message `1713:2` — all have a desktop pane / centre-form / popover counterpart, no scrim.

## 9. Nav rail fix (component-level)

The **Rail — v3 (slim)** master (`626:76`) bottom cluster (Help / wallet / Avatar + `Help` · `$51.00` · `Account ›`) was nudged **+5px down** so **`Account ›` sits at y858 — level with the pane's `Sign out`** (ref frame `1596:2`). Done in the component, so it cascades to every rail instance. No per-frame edits.

---

## 10. Build notes / component references

- File cards, tags, `≡`, progress rows, drop box, source rows = restyled primitives on the existing frames (cloned, not rebuilt).
- Mobile drawers = `Drawer — v3 (white)` `628:5`, Half detent, **instanced at y=380, not resized**; content overlaid as siblings; nav (`Bottom Nav — v3`) kept on top.
- Delete-confirm modal (desktop) cloned from the account overlay card pattern (`1648:2` family) on a scrim; mobile primary button cloned from **Button — Generate** `1072:2047`.
- Colours: ink `#1A1A17`, red `#E8453C`, greys per design-guidelines. **Upload progress bar = ink on a light-grey track (no red, no green).** Palette stays Black/White/Red — no new status colour.
- Fonts: Instrument Serif (confirm titles) · Inter (UI) · DM Mono (percent readouts).
