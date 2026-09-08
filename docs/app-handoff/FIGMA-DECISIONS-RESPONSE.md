> ⛔ **SUPERSEDED — folded into [`DEV-BRIEF.md`](DEV-BRIEF.md) (2026-08-19).** Kept for history. Note its Ask-thread gaps (24/9) and 12.5px scale are **overridden** by DEV-BRIEF §2.4. Do not build from this file.

# Caspr app — decisions round: design-session response

**Re:** `FIGMA-DECISIONS-PROMPT.md` (your 4 items) + Joy's 7-point workflow review · **File:** `y2F394I4CwEeSzH2kKuDCt` · **Date:** 2026-08-17

Process, unchanged: `setCurrentPageAsync` before every sweep · every edit re-read after the set · the layout-sensitive frames screenshot-verified. Reminder still live: **a `use_figma` call that throws rolls back every edit in that call** — guard `if ("cornerRadius" in n)` and split batches. New gotcha this round: **`findAll(TEXT)` skips INSTANCE children** — eyebrow/title-bar text on mobile frames is an instance override; fetch it by node id, don't expect a frame-level `findAll` to return it.

This closes the plan in `WORKFLOW-REVIEW-PLAN.md` (Joy-approved). Two living specs ride alongside and **do not block the build**: `EDIT-ECONOMICS.md` (review 4+5) and `SAMPLE-REPORTS.md` (sample reports).

---

## Your four items

| # | Item | Result |
|---|---|---|
| **1** | Edit-pane chart thumbnails — draw the nine | **DONE.** Nine `thumb/<kind>` marks drawn beside the existing three, node **`2123:4416`** on `184:2` (Report Creation): `grouped-bar · column · line · area · multi-line · treemap · scatter · bubble · quadrant`. 76×46 slot, r2, `#e2e1de` border, `#faf9f7` bg; series palette `#cbcac6` / `#57564f` / `#e8453c`, ≤1 accent per thumb; no axes/labels. `column-by-region` / `treemap-region` / `stacked-region` reuse `column` / `treemap`. Intent rail now has a mark for every kind — no code change. |
| **2** | Queued-analysis centre | **DO NOT DRAW IT — no queued screen.** Jayant confirmed capacity (theater 5s→~30s then streaming, exec summary mostly last; no queue). Rework the `queued`-with-position path: remove the position counter and the queued centre. Keep only a rare **async fallback** — *"At capacity — we'll notify you when it starts"*, **not a position number** — for the edge where a start can't be guaranteed. The theater absorbs the wait via the status spine (item review-3/6). |
| **3** | Ask threading gap — confirm 24 / 9 | **Drew the precedent at both widths so you can measure — please confirm.** Desktop `2211:4828` (2-turn, **turn gap 24**, reply gap 16). Mobile `2214:4957` (2-turn, **turn gap 9**, reply gap 6) — drawn as the drawer scrolled to its foot: turn-1's citation-answer tail, then the follow-up turn. Both are new frames; the live Ask frames (`810:2147` / `944:1394`) are untouched. If you measure 24 / 9, ship as-is. |
| **4** | Theater decode — assets + validation gate | **PIVOTED — no gate.** The churn is now the **Caspr alphabet**, an original 36-glyph cipher (A–Z · 0–9), node **`2104:168`** on `🧩 Components — Core` (`caspr-alpha/<char>`, SVG viewBox 24, stroke 1.8, round caps). Because it's original, the **cultural-validation gate is dissolved** — build when ready. The Nsibidi set `2100:168` stays as lineage reference only. The `prefers-reduced-motion` path (plain source names appearing in the list) still ships regardless. Full spec: `THEATER-SOURCE-DECODE-MOTION.md`. |

---

## The 7-point workflow review — outcomes

| # | Decision | Build state |
|---|---|---|
| **1** | Pre-prompt title = muted **"New analysis"** (not `…`) | **DONE** — analyses pane, desktop `1037:1892` + mobile `965:1660`. |
| **2** | Layout-canvas mobile drawer bg → **white** | **DONE** — `694:130`. |
| **3** | 3–5s question-wait = a **Learning state** of the layout canvas (not a new screen) | **DONE** — desktop `2138:4416` + mobile `2139:4497` (cloned from Layout Canvas). Eyebrow → `… · LEARNING`; scope questions replaced by a red pulse dot + *"Reading your live pipelines to sharpen the questions…"* + `PREPARING YOUR QUESTIONS` + 3 skeleton bars; centre draft layout shows later sections still forming (the gentle live-revision beat). |
| **4+5** | Edit economics — **Minor (free, shows 0 tokens) / Substantial (metered in edit tokens) / New (identity change → new analysis)** | **Model LOCKED, `EDIT-ECONOMICS.md`.** Track, not blocker. Charts free; infographics/images metered. Classification is product-side against the rules. Numbers pending Jayant's cost-per-edit-token (see deps). |
| **6** | Conversational status in-chat + **Creating cutoff** (pre-Creating → v1, post-Creating → v2) | **DONE — see below.** |
| **7** | Remove **Reset account**; add scoped resets; keep **Delete account** (GDPR) | **DONE — see below.** |

### review-6 — conversational status + Creating cutoff

The status spine (`Learning → Analyzing → Generating → Creating`) lives **in the report-title eyebrow only**. In the chat it is narrated **conversationally**, not as a tracking bar (Joy rejected the progress-row): inline **rule-text-rule dividers** mark phase transitions; the user's mid-run answers render as an **italicised reply bubble**; Caspr's mid-run notes as an **italicised statement**.

| Surface | Node | Contents |
|---|---|---|
| Generation — desktop | `775:2` | `INITIATING LEARNING BRAIN` → prompt → italic reply *"A live deal — I'm running diligence."* → italic *"Noted — I'll weight competitive dynamics and deal risk in the read."* → `GENERATING THE REPORT`. A follow-up question then appears using the Research-Profile engagement visual (poll `1749:79`, widened to pane). |
| Generation — mobile | `777:83` (drawer Content `1527:7493`) | Same flow, mobile spacing. |
| **Creating cutoff — desktop** | `2186:4565` | Eyebrow → `… · CREATING`; poll removed; `GENERATING THE REPORT` → **`CREATING OUTPUTS`** divider → cutoff line *"Finalizing your outputs — new requests will apply to the next version."* |
| **Creating cutoff — mobile** | `2187:4708` | Same; eyebrow fixed via the instance-override (see gotcha above). |

**Routing you already have:** pre-Creating edits fold into v1; post-Creating requests queue to v2. The Creating signal above is what surfaces the cutoff.

### review-7 — account resets (Joy, 2026-08-17: account-level reset removed entirely; three new scoped actions; Delete Account stays)

**Removed** the account-level *Reset account* everywhere: desktop reference Devices card `1638:78` (Delete slid up, card 266→208), the shared mobile **Danger card `1691:2`** (live Security mobile `1686:2`, card →78), and the leftover in the mobile Delete-confirm bg `1658:157` (→202). **Retired** both *Reset account* confirm frames (desktop `1646:106`, mobile `1662:52`) and the orphan canvas label `§ RESET ACCOUNT` `1676:16`. **Delete Account stays** (legal/GDPR). Verified: **zero "Reset account" text remains** app-wide.

**Three scoped destructive actions** — each a bottom danger row (red label + grey sub, cloned from the surviving Delete-account row for exact style match) + a scrimmed confirm reusing the existing pattern. Placement = "match today" (bottom danger row).

| Action | Row (desktop / mobile) | Confirm (desktop / mobile) | Copy (row) |
|---|---|---|---|
| **Reset research profile** | foot of Memories card `1736:135` / `1680:26` | `2195:2927` / `2206:3001` | "Forget every memory Caspr has about you. Your reports, Data Room and wallet stay untouched." |
| **Reset Data Room** | content col `1756:4` (below Connected) / frame `1766:2` (above peek) | `2199:12745` / `2206:5607` | "Remove every uploaded and connected source. Your reports and profile stay untouched." |
| **Delete all documents** | content col `843:164` (scroll-end) / `1280:196` | `2199:12923` / `2207:2629` | "Permanently delete every report in your library. This can't be undone." |

**Two calls worth your attention (marked as calls):**
- **Documents mobile `1280:196` clips at 844 with the grid filling the viewport**, so I **extended the frame 844→970** and moved the bottom nav 788→914 to show the delete-all row at the honest scroll-end. Its confirm `2207:2629` clones the screen and **normalises back to 844** (nav→788) for the modal-over-viewport look. If you'd rather the delete-all live in an overflow/"…" menu on mobile instead of a scroll-end row, say so — the row is trivial to relocate.
- **Confirm bodies** follow the existing sheet: *"This forgets/removes/deletes … stay untouched. This can't be undone."* + red button (label = the action) + Cancel.

**Domain mapping (confirmed):** Documents = your generated reports library · Data Room = uploaded/connected sources · Research Profile = what Caspr has learned about you.

---

## Sample reports (review-1 idea) — plumbing now, content post-launch

New spec **`SAMPLE-REPORTS.md`** (placeholder). Build the mechanism: a `sample` tag + `sampleId` + per-user archive/delete state that survives re-seeding; an idempotent seeding job that plants the current set into every account; sample records ride the **existing** library/reader/Ask/Edit/Outputs paths with only two specials — a `Sample` label and **free, non-persistent edits**. Content (which topics) is deferred until Joy generates real reports post-launch and hands over `{conversation, report, outputs}` to seed. Does not block the core build.

---

## Jayant dependencies (open)

1. **Edit economics numbers** — cost-per-edit-token → the token rate, tier-scaled free bundle sizes, top-up increments. Also the **corpus-vs-new-pass signal** if we ever want engine-side classification (we default to product-side).
2. **Refresh ratio** — we've set same-scope refresh = 50%, new-scope / tier-change = full, priced at the gate. Confirm 50% is defensible on compute.
3. **Capacity** — confirmed no queue (theater absorbs the wait). Flag if expected load ever breaks the near-immediate start so we wire the async fallback.

## Open numbers (Joy)

- Tier-scaled **free edit bundle** sizes (the retention dial).
- *(Margin resolved 2026-08-17: not a product concern — Jayant's API returns marked-up token numbers; product records them as-is.)*

---

## Spec deltas applied / to apply

- `EDIT-ECONOMICS.md` — **written, locked model.**
- `SAMPLE-REPORTS.md` — **written, placeholder mechanism.**
- `THEATER-SOURCE-DECODE-MOTION.md` — **updated** to the Caspr alphabet + dissolved gate.
- `onboarding-understanding.md` — muted "New analysis" (review-1) + the Learning state (review-3).
- `gate-output-spec.md` — the Creating cutoff signal + conversational status narration (review-6).
- `account-wallet-screens.md` — reset-account removed; three scoped destructive actions + Delete-account kept (review-7).

*Response from the design session · 2026-08-17. Reply in kind — a table of what changed with node ids, and your own calls marked as calls.*
