# Delta 3 — Item Management (Data Room / Documents) & Account

*Audit of `item-management-spec.md` (NEW, v1, 2026-08-17), `account-wallet-screens.md` (2026-08-08, + Update 2026-08-17), and `notifications-spec.md` (2026-08-10) against `content/_refresh/current_assumptions.md` categories K (Data & the Data Room) and G (Account, Security & Teams). Card titles/briefs/status cross-checked against `content/caspr-help-content-repository.xlsx` → "Answer Cards".*

---

## CURRENT FACTS

### Files/items — NOW

**"Data Room" is still the term.** No rename. `item-management-spec.md` explicitly frames itself as governing "Documents (your generated reports) and Data Room (your uploaded/connected sources)" — Data Room keeps its name and its three groups. **Included / Excluded / Connected are still accurate** — untouched by this spec. Connected (Bloomberg/Refinitiv/S&P/PitchBook) is still Coming Soon (implied by "Reset Data Room ... also clears Connected sources").

What the item-management-spec **changes about the old Data Room model** is the *mechanism*, not the taxonomy:

- **The per-row `☰` menu is removed.** Quote: *"Data Room file rows: a checkbox at the row's right. The old ☰ row-menu is removed — its actions move into the selection toolbar."* Every file/report now carries an **always-visible checkbox** (not hover-revealed, so it works on touch); a **"Select all"** checkbox sits top-right.
- **Selecting ≥1 item swaps the filter/controls row for an action toolbar.** Data Room toolbar = *"Include · Exclude · Make private/public\* · Delete"* (safe→destructive order). A mixed selection shows both Include and Exclude, or both private/public toggles.
- **Body-click opens the item; only the checkbox selects.**
- **Delete is now single, multi, or select-all**, with live-count copy: single = *"Delete this file?"* (offers **Move to Excluded** reversible / **Delete permanently** destructive); multiple = *"Delete N sources?"*; all (via Select-all) = *"Delete all N sources?"*.
- **Data Room deliberately has no Archive.** Quote: *"Data Room has no Archive — Exclude is its non-destructive declutter. That asymmetry is deliberate."*
- **Documents (reports) gets an entirely new capability the library has never covered**: single-report delete (previously impossible — *"Documents had no way to delete a single report — you could only 'delete all'"*), plus a brand-new **Archive** lifecycle (**Active / Archived / Deleted**, with **Restore**), plus a bulk **"Add to Data Room"** action that turns selected report(s) into Data Room sources, *"Included by default, set to Private."*
- **The old blunt "Delete all documents" foot row is gone**, replaced by (a) the new selection/select-all delete workflow and (b) a re-homed, confirm-gated **"Delete all documents"** danger-zone row at the Documents-library scroll-end (see Account section below — this is part of the same 2026-08-17 reset restructuring).
- Upload types, Private/Public tagging, and upload mechanics (drop/browse/paste-link) are **untouched** by this spec — not mentioned, no changes found.
- **Not yet functional (dev, per spec §5):** the mobile filter control opening the Filters/Archive sheet, the "Select all N" (whole-library) escape hatch, and single-delete on mobile. These are designed but not wired yet — worth flagging in copy as still landing.
- **Projects: still unconfirmed.** Not mentioned anywhere in `item-management-spec.md`. No new information — the existing `[VERIFY]` on K-10 stands untouched.

### Account/Wallet/Security/Notifications — NOW

- **Wallet:** unchanged mechanically — *"Balance shown = $186 spendable (Research Budget $200 − 7% platform fee; fee is internal, never shown)."* Terminology is **"budget," not "plan."** New: on **mobile**, Wallet is now a **primary bottom-nav tab** with a live balance label (e.g. `$86.40`), replacing the old Insights tab (Insights moved into "More").
- **Research profile absorbs Context questions** — codified as of this session: *"Context questions is NOT a separate menu item on either breakpoint (removed from the desktop pane too)."* Context questions are now the *input* to the Research profile (via a "Sharpen your profile" carousel); the Research profile page is the *output* (a Memories list, each fact removable with `✕`).
- **Security = Password + Two-factor + Devices, one screen, three cards** (Sign-in / Devices / Danger). The **Danger card now holds only "Delete account."**
- **"Reset account" as a single account-level action is gone entirely.** Quote (2026-08-17 update): *"the account-level 'Reset account' is removed entirely — replaced by three scoped destructive actions in their natural homes. Delete Account stays (legal/GDPR)."* The three replacements, each a red danger row + its own confirm, now live where the thing they affect actually lives:
  | Action | Home |
  |---|---|
  | **Reset research profile** | Research Profile screen (foot of Memories card) |
  | **Reset Data Room** | Data Room screen (below Connected) |
  | **Delete all documents** | Documents library (scroll-end) |
- **Get Help** mechanics match what's already documented (search + 6 pills All/Basics/Analyses/Pricing/Reports/Account, expandable FAQ cards, Message support pre-tagged with the viewed category) — but **on mobile, Help moved into the "More" overflow tab** (bottom nav is now Analyses · Documents · Wallet · More; More = Insights · Data Room · Help · Account).
- **Notifications is now a real, separate concept with two layers**, neither of which the library currently covers at all:
  1. **Toasts (BUILT, live today).** Ephemeral confirmations/errors, e.g. *"Memory added,"* *"Budget topped up — $151.00,"* *"Report generating — we'll let you know when it's ready,"* error + Retry. Auto-dismiss ~3.5s (errors/action toasts ~6s).
  2. **Bell / "Alerts" entry points (BUILT, live today)** — rail icon (desktop) / header bell replacing the old balance chip (mobile) — **but the destination screen (Notification Center) does not exist yet.** Quote: *"The bell entry points ... are built, but the Alerts / Notification Center screen they open does NOT exist in Figma yet. It is a Phase 2 deliverable ... dev should wire the bell as a stub (no-op or 'coming soon')."*
  3. Separately, **Account → Notifications is a live settings screen** — 3 inline toggle rows, instant, no drawer (this is notification *preferences*, distinct from the bell/Center).
  4. A **User-Education layer** (coach-marks, empty-state nudges) is also Phase 2/not designed — not a content item yet.

---

## CHANGED vs the library

Against `current_assumptions.md`'s K and G summaries:

1. **"Data Room" is NOT renamed** — confirms the library's term is still correct. (Ruling out one hypothesis the brief raised.)
2. **Included / Excluded / Connected — taxonomy unchanged**, but **the access mechanism changed**: row `☰` menu → checkbox selection + action toolbar. Every K card that currently says "from its menu" or implies a per-row menu is now mechanically wrong.
3. **Delete is no longer single-file-only in the Data Room's described flow** — it's now single **and** multi **and** select-all, with distinct confirm copy for each. The library currently only documents the single-file case.
4. **Make Private/Public is now also a bulk action** (toolbar toggle across a multi-selection), not just a per-file setting — not reflected anywhere in K-04.
5. **NEW: Documents (reports) now support single-item delete** — a capability that flatly did not exist when the library was written ("only delete all" was the old state). No card covers it.
6. **NEW: Archive/Restore lifecycle for Documents** (Active/Archived/Deleted) — entirely new, no card, no mention in the library at all.
7. **NEW: "Add to Data Room" bulk action** — turns a report into a Data Room source (Included, Private by default) — a genuinely new bridge between Documents and Data Room that doesn't exist in the library.
8. **G-12 is now substantively wrong.** The card frames a single "Reset vs Delete account" choice. That single Reset action **no longer exists** — replaced by three independently-scoped resets (Research profile / Data Room / Documents) living in their own screens, with only **Delete account** remaining as an account-level danger action. This is the single biggest content break in this audit.
9. **G-11 (Securing your account)** — the Danger card inside Security now holds **only Delete account** (Reset account removed from it). If any current copy implies Security's danger zone includes a reset option, that's now wrong.
10. **G-09 (Research profile)** should explicitly document the Context-questions merge (already loosely implied but now formally locked) **and** gets its own new "Reset research profile" control.
11. **G-06 (Managing your account settings)** — the account IA changed: flat mobile menu (Identity card · Research profile · Security · Notifications · Preferences · Sign out), Context questions folded away, danger-zone actions redistributed out of Account entirely into Research Profile / Data Room / Documents.
12. **G-08 (Wallet)** — minor: mobile nav now surfaces Wallet as a primary bottom-nav tab (was Insights); Insights demoted into "More."
13. **G-13 (Get Help)** — minor: mobile placement of Help moved into "More" overflow; not a standalone bottom-nav destination.
14. **NEW category of content entirely: Notifications.** Nothing in the current 113-card library addresses toasts, the bell/Alerts icon, or notification preferences. Two of the three notification layers are live today (toasts; the account Notifications toggle screen); the Notification Center itself is explicitly Phase 2 and must not be described as available.
15. **Terminology check:** no renames found anywhere — "Data Room," "Included/Excluded/Connected," "budget" (not "plan"), "Wallet," "Research profile," "Security" all hold. The only *removed* term is **"Reset account"** (retired) — if that phrase appears anywhere in current copy it needs to go.

---

## CONTENT IMPACT

### K — Data & the Data Room (category name: keep "Data & the Data Room" — no rename needed; Data Room itself is unaffected terminologically, only its interaction model changed)

| Card | Change |
|---|---|
| **K-01** What is the Data Room? | Minor. Groups (Included/Excluded/Connected) still correct — no rewrite needed for the taxonomy. Optionally mention the new checkbox-per-row / select-all UI if the card gets into mechanics. |
| **K-02** File types | No change. |
| **K-03** How to upload a file | No change to the upload flow itself. If the current answer references a row `☰` menu anywhere post-upload, remove it — replaced by checkbox selection. |
| **K-04** Private vs Public | **Update.** Add: Public/Private can now be toggled in bulk across a multi-file selection via the action toolbar ("Make private/public," mixed selections show both), not just per file. |
| **K-05** Included vs Excluded | **Update (mechanism).** Current text: *"Move a file between the two from its menu, or drag it."* The menu is gone — rewrite to: select file(s) via checkbox → **Include**/**Exclude** buttons appear in the action toolbar; works for one file or many at once. |
| **K-06** Keep a file but don't use it (→ Excluded) | **Update (mechanism), same fix as K-05.** Good place to add the quotable line: Data Room has no Archive — Exclude is its deliberate non-destructive declutter. |
| **K-07** How to delete a file | **Update (moderate).** Current text: *"Open the file's menu and choose Delete, then confirm."* Rewrite: select via checkbox → red **Delete** in the action toolbar. Add the now-supported **multi/select-all delete** ("Delete N sources?" / "Delete all N sources?"), keeping the existing Move-to-Excluded-first / Delete-permanently framing for the single-file case. |
| **K-08** Connect a source (Coming soon) | No change — still Coming Soon. |
| **K-09** Are uploaded files secure? | No change found; `[VERIFY]` flag stands (data-handling/retention posture still unconfirmed). |
| **K-10** Projects | No new information. **Still unconfirmed** — leave the `[VERIFY]`/placeholder framing as-is. |

**New cards needed (Data Room side):**
- **NEW — "Reset your Data Room"** (brief: Reset Data Room clears every uploaded file and connected source in one action — a fresh start for your sources — without touching your documents, account, or wallet balance; found below Connected sources on the Data Room screen; irreversible, confirm to proceed). Help pill: **Account**.
- **NEW — "Selecting and acting on multiple files at once"** (brief: every file carries a checkbox; select one or many — or Select all — to Include, Exclude, change Private/Public, or Delete in bulk from one toolbar). Help pill: **Analyses** or **Account**. *(Could instead be folded into K-05/K-07 rather than standing alone — flag for Joy's call on card count vs. depth.)*

### Documents/reports side (not currently a K card — K is Data-Room-specific; these are new ground for the library, likely D "Understanding Your Report" or a new mini-section)

- **NEW — "Can I delete a single report?"** (brief: yes — previously delete-all-only, now every report has a checkbox; select one, several, or all via Select-all, then Delete; permanent, with a live-count confirm). Help pill: **Reports**.
- **NEW — "What is Archive, and how do I restore a report?"** (brief: reports have three states — Active, Archived, Deleted; Archive tucks a report out of your active library without deleting it; find Archived at the foot of the filter rail (desktop) or in the Filters sheet (mobile); Restore brings it back). Help pill: **Reports**.
- **NEW — "Add a report to your Data Room"** (brief: select one or more reports and choose "Add to Data Room" to use them as sources in future analyses — added Included by default and set to Private). Help pill: **Reports** or **Analyses**.
- **NEW — "Delete all your documents"** (brief: a separate, scoped danger action at the foot of your Documents library — deletes every report permanently; does not touch your Data Room, account, or wallet). Help pill: **Account**.

### G — Account, Security & Teams

| Card | Change |
|---|---|
| **G-01** Data security | No change found in these 3 docs. Unaffected. |
| **G-02** Who can see your analyses | No change found. Unaffected. |
| **G-03** Team seats | No change found. Unaffected. |
| **G-04** SSO | No change found. Unaffected. |
| **G-05** API | No change found. Unaffected. |
| **G-06** Managing your account settings | **Update (moderate).** Reflect the current IA: flat mobile menu (Identity card · Research profile · Security · Notifications · Preferences · Sign out); Context questions is folded into Research profile, not a separate item; the three scoped destructive actions (research profile / Data Room / documents) live in *their* screens, not in Account settings — Account's own danger zone is now just Delete account. |
| **G-07** Sharing a report with your team | No new information found. Unaffected by this pass — still carries its original `[VERIFY]`. |
| **G-08** Your Wallet and balance | **Update (minor).** Add: on mobile, Wallet is now a primary bottom-nav tab with a live balance label (e.g. `$86.40`), replacing the old Insights tab (Insights is now under "More"). |
| **G-09** Your Research profile | **Update (moderate).** Formalize the Context-questions merge (get-to-know Q&A is the input, Research profile/Memories list is the output — no separate "Context questions" destination anymore) and add the new **"Reset research profile"** control (foot of the Memories card) that clears all learned facts in one action. |
| **G-10** Setting language/output style | No change found. Unaffected. |
| **G-11** Securing your account | **Update (minor-moderate).** If current copy implies the Security screen's danger zone includes a reset option, remove it — Security's Danger card now holds **only Delete account**. Password/2FA/devices content unaffected. |
| **G-12** Reset vs delete your account | **Rewrite required — largest single change in this audit.** The premise ("choose Reset or Delete") is now wrong: **there is no single account-level "Reset" anymore.** Reframe as either (a) a rewritten G-12 titled around "Delete your account" (the one remaining account-level destructive action — forfeits balance, type DELETE to confirm, stays for legal/GDPR reasons) with pointers out to the three scoped resets now documented on their own cards/screens, or (b) split G-12 into "Delete your account" + cross-links to the new Reset-research-profile / Reset-Data-Room / Delete-all-documents cards. Needs a product/content decision, not just a copy edit. |
| **G-13** Getting help and contacting support | **Update (minor).** Mechanics (search, 6 pills, expandable FAQ, pre-tagged Message support) unchanged. Add: on mobile, Get Help is reached via the "More" tab, not a standalone bottom-nav destination. |

**New cards needed (Account/Notifications side):**
- **NEW — "What are the notification toasts?"** (brief: short confirmations and errors appear bottom-right/above the bottom nav — e.g. "Report generating," "Budget topped up," error + Retry — auto-dismiss in a few seconds, no action needed unless it's an error). Help pill: **Basics** or **Account**.
- **NEW — "What's the bell / Alerts icon for?"** (brief: the bell/Alerts icon is live, but its full Notification Center is **coming soon** — must be written as not-yet-available, do not describe a destination that doesn't exist). Help pill: **Account**. **Flag: Coming Soon — do not overstate.**
- **NEW — "Managing your notification preferences"** (brief: Account → Notifications holds a short set of instant on/off toggles for what you get notified about; no separate save step). Help pill: **Account**. *(This one IS live — distinguish clearly from the bell/Center card above.)*

### Unconfirmed / flag for Joy

- **Projects** (K-10) — still no spec; placeholder stands.
- **Data upload gated at Business tier** — not mentioned or contradicted in `item-management-spec.md`; carried forward unverified.
- **G-01, G-02, G-03, G-04, G-05, G-07** — simply not touched by any of the three docs read for this pass; "no change" here means "no new information found," not "actively re-confirmed."
- **Mobile Filters/Archive sheet wiring, "Select all N," and mobile single-delete** are designed but explicitly **not yet built** (dev) — if content ships before dev catches up, either delay those specific claims or caveat them.
- **Card-count/category decision**: whether the new Documents-side cards (Archive, single-delete, Add-to-Data-Room, Delete-all-documents) belong in a widened **K**, in **D** (Understanding Your Report), or as a new mini-category — this audit surfaces the gap but the taxonomy call is Joy's.
- **G-12's restructuring** (split vs. rewrite) needs a decision before a writer touches it — flagged above, not resolved here.

---

*Sources: `docs/product/item-management-spec.md`, `docs/product/account-wallet-screens.md` (incl. 2026-08-17 update), `docs/product/notifications-spec.md`, `content/_refresh/current_assumptions.md`, `content/caspr-help-content-repository.xlsx` ("Answer Cards" — used to pull exact current K/G titles, briefs, and status for comparison; not otherwise modified).*
