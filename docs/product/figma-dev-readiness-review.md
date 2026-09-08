# Caspr App — Figma + Spec Dev-Readiness Review

> **▶ START HERE for the build:** [`DEV-HANDOVER.md`](DEV-HANDOVER.md) — the developer entry doc (seven non-negotiables + spec index + scope map). This review is a companion to it.

**Date:** 2026-08-08 · **Scope:** all production screens across the Figma file `y2F394I4CwEeSzH2kKuDCt` (pages: Onboarding, Report Creation, Documents, Profile & Wallet, Insights) + the spec docs in `docs/product/`. Exploration (`71:2`) is reference, excluded from the production count.

**Inventory:** ~93 production frames. Onboarding 12 · Report Creation 36 · Documents 13 · Profile & Wallet 30 · Insights 2.

**Headline verdict: NOT YET "ready for development" as a whole.** The *happy paths* (report creation, data-room file management, account/settings) are in good shape and well-specced. But four things block a clean handoff: **(1) no navigation is wired and a few destinations don't exist; (2) no empty/error/loading states are designed for the CRUD surfaces; (3) motion is undefined for every interaction built this session; (4) a handful of visual decisions are still open.** Burn down the punch list (§7) and the core flows are ready.

---

## 0. Handoff-prep progress log (2026-08-08)

**Scope confirmed by Joy: "Everything"** (core loop + Wallet payment + Insights). Progress this session:

- ✅ **Visual decisions locked** — upload progress bar = neutral **ink on grey track** (no red/green); completed upload → normal card; scrim tokenised; file-card / `≡` / tag / progress / coming-soon / scrim rules promoted into `design-guidelines.md §13`.
- ✅ **Empty-state pattern established** (restrained line glyph · serif headline · one body line · single red CTA; pane/counts cleared to match).
- **✅ STATES CHUNK COMPLETE — 15 NEW frames (locked screens untouched):**
  | State | Node | Page |
  |---|---|---|
  | Documents — Desktop · empty | `1803:2` | 📁 Documents |
  | Documents — Mobile · empty | `1846:51` | 📁 Documents |
  | Documents — Desktop · search no results | `1824:2` | 📁 Documents |
  | Documents — Desktop · loading | `1832:113` | 📁 Documents |
  | Data Room — Desktop · empty | `1805:2` | 📁 Documents |
  | Data Room — Mobile · empty | `1808:2` | 📁 Documents |
  | Data Room — Desktop · upload failed | `1809:2` | 📁 Documents |
  | Data Room — Mobile · upload failed | `1824:197` | 📁 Documents |
  | Data Room — Desktop · search no results | `1812:2` | 📁 Documents |
  | Data Room — Desktop · loading | `1832:2` | 📁 Documents |
  | Research profile — Mobile · empty (Memories) | `1811:2` | 👤 Profile & Wallet |
  | Research profile — Desktop · empty (Memories) | `1834:2` | 👤 Profile & Wallet |
  | Wallet — Desktop · no transactions | `1830:2` | 👤 Profile & Wallet |
  | Gate — Desktop · insufficient budget | `1814:2` | 📝 Report Creation |
  | Generation — Desktop · failed | `1827:2` | 📝 Report Creation |
- **Notes:** *Notifications* is a settings-toggle screen (no empty state needed). *Insights* stays Coming-soon (Phase 2). Empty-state pattern = restrained line glyph · serif headline · one body line · single red CTA; counts/panes zeroed for coherence; errors = red text (no stripe/tint); progress/skeleton = ink/grey.
- **✅ RESOLVED — Documents-mobile → full screen** (Joy chose full-screen; approved the base edit): base `1280:196` reworked in place from the scrimmed drawer-over-home into a **full-screen destination** (title · search · filter pills · cover-card grid · nav; no scrim, no home behind). Empty version rebuilt full-screen (`1846:51`).
- **✅ MISSING SCREENS BUILT:**
  | Screen | Node | Notes |
  |---|---|---|
  | Document View — Desktop | `1848:2` | report reader for a complete doc (report + red-dot citations + Ask-Caspr pane + Contents/Ask/Edit/Outputs/Updates switcher). Clone of the v3 reader `810:2147`, marked complete. |
  | Document View — Mobile | `1849:2` | mobile reader (report + Ask-Caspr drawer + switcher + nav). |
  | Data Room — Desktop · search results | `1851:2` | search-active WITH matches: query · "N results" · Clear search · filtered card. Documents mirrors this pattern. |
- **✅ WALLET PAYMENT FLOW BUILT** (modals on desktop, drawers on mobile — scrim on both, since payment is a blocking modal per the §8 rule):
  | Screen | Desktop | Mobile |
  |---|---|---|
  | Top up (amount pills · card on file · pay) | `1854:2` | `1857:2` |
  | Success / receipt (✓ · new balance · receipt rows · Download receipt) | `1855:2` | `1858:2` |
  | Payment failed (declined · reassures no charge · Try another card) | `1855:230` | `1858:175` |
  - Amount pills ($50/$100/$200/Custom, $100 selected); Visa •••• 4242 on file + Change; **7% platform fee kept internal** (never shown); errors reassure "no money left your account". *Note: real card entry is out of scope for the assistant — these are mockups; the "Change / add card" (payment-methods management) screen is an optional follow-up.*
- **✅ FLOW MAP WRITTEN — `navigation-flow-map.md`** (element→destination for every screen, cross-checked against all specs; §10 flags divergences). **Prototype wiring intentionally skipped** (Joy, 2026-08-10): dev is Claude-driven, so a written map beats un-walkable prototype reactions.
- **✅ MOTION + INTERACTION-STATES SPEC — `motion-and-interaction-states.md`** (frequency-gated; extends the existing motion tokens; motion-per-interaction + hover/focus/pressed/disabled per control + focus/keyboard/a11y + no-motion zones; honours no-shadows-except-drawer).
- **✅ Payment = Stripe, Model B (hosted)** (Joy, 2026-08-10): Caspr owns amount selection only; **Stripe Checkout** owns card entry + **Stripe Tax** (never computed/shown by us), **Stripe Customer Portal** owns card/invoice management. Singapore entity, USD, **payout = USD checking account**. Top-up modals → `Continue to payment ↗`; custom add-card form **replaced** by billing handoff `1878:2`/`1878:135` (`Manage in Stripe`). `architecture-alignment-*.md` still says Model A (Stripe.js forms) — update + loop Jayant. Flow: `navigation-flow-map.md §5c`.
- **✅ Mobile nav fix:** brought the bottom nav to front on 5 frames where it was hidden behind a scrim/drawer (4 locked account confirms `1658:98`/`1658:151`/`1662:2`/`1662:52` + payment-methods) — now consistently visible across all mobile modals.
- **✅ SECONDARY SCREENS BUILT (2026-08-10):** billing handoff `1878:2`/`1878:135` (replaced the custom add-card form, Model B) · forgot-password `1881:2`/`1881:47` · feature-locked/upgrade `1885:2`/`1885:109` · edit-phone drawer `1884:107` (**with country-code selector `🇸🇬 +65 ▾` + verify helper**) · sign-out-device confirm `1864:33`.
- **✅ Custom top-up** (`1887:2` / `1888:2`): `Custom` reveals a `− $N +` stepper — **$20 min, $10 increments, no cap** (Joy). Logic in `navigation-flow-map.md §5c`.
- **✅ Phone verification ON from day one** (Jayant): edit-phone → Send code → **Verify your number** `1895:3` (6-digit OTP); SMS via **AWS SNS** (own OTP logic + anti-pumping guards). Button-text centering fixed on the Button-Generate drawers.
- **✅ Copy-editing pass** (Joy-approved): 3 brand edits applied across duplicated frames + **`copy-standards.md`** created (voice guardrails · terminology/currency/top-up consistency · **Lingo/ICP-vocabulary rule** — design shows canonical, spec marks `{lingo:slug}` tokens, product resolves by ICP; mapping in `document-taxonomy §Lingo`).
- ⏳ **Remaining (non-blocking):** confirm whether to archive the superseded ref frame `1525:2` · promote new hand-drawn icons into the locked icon set · a11y audit + tablet reflow (P2). **Core handoff complete.**

Constraint (Joy, 2026-08-08): **no visual changes to last night's locked screens without approval** — only new frames. Honoured; the one edit to an existing screen (upload progress bar → neutral) was Joy-directed this morning.

---

## 1. Links without a go-to screen

**Finding A — the file has ZERO prototype reactions.** Nothing is wired to anything (`totalReactions = 0` across all pages). This is fine for a screen library, but it means: (a) there is no clickable prototype for dev or QA to walk; (b) intended transitions live only in people's heads + prose specs. **Action:** either wire a prototype for the core loops, or ship a **flow/navigation map** (see §3 gap) so every interactive element's destination is explicit.

**Finding B — destinations that DON'T exist as production frames** (the real "dead links"):
| Affordance | Expected destination | Status |
|---|---|---|
| A document row (Documents list) | **Document View** (read a report) | ❌ Only exists on the Exploration page (`510:2`, `595:2`) — no production frame |
| Any **search** field (Documents, Data Room, Help) | results + "no results" | ❌ No results/empty frame anywhere |
| An **Insights** card | Insight detail | ❌ No detail frame (Insights = 2 frames only) |
| Wallet **Add funds / top-up / recharge** | payment / checkout | ❌ No payment frames (Wallet = list + plans drawer only) |
| Login **Forgot password** | reset-request screen | ✅ Built — full reset chain (see §9) |
| Report **red-dot citation** | Ask-Caspr drawer scoped to figure | ✅ `810:2147` / `944:1394` |

**Finding C — destinations that DO exist** (spot-checked, good): all 4 rail destinations (Home/Docs/Insights/Data Room), mobile bottom-nav + "More" overflow, New-analysis → compose, avatar → Account (desktop pane / mobile menu `1669:2`), Help, Wallet, every Account sub-screen (Research profile, Security, Notifications, Preferences, Details, Edit-name, 2FA, Language, Password, Change-email, Reset, Delete), Sign-out confirm, Gate → Theater → Generation → Working states, and the full Data-Room file-management set built this session. Connect-a-source and Updates are intentionally `COMING SOON` (no destination needed yet).

---

## 2. Corner cases with no visual treatment

The single biggest gap. The older framework docs *mention* empty/loading states conceptually (`visual-design-language.md` "Invitation" register; `app-shell-framework.md` "no documents yet", "Upload a file" empty state), and the **generation/Source-Web loading is fully designed** (it's the signature moment). But **no empty / error / boundary frames are actually drawn**, and none of this session's surfaces define them.

**Empty states (none designed):**
- Empty **Documents** folder (new user, 0 reports) — "Your analyses will appear here"
- Empty **Data Room** (0 files) — what do Included / Excluded / Connected show at zero? *(not in `data-room-screens.md`)*
- Empty **Insights**, empty **Wallet / no transactions**, empty **Notifications**
- Empty **Research-profile Memories** (no memories yet)
- **Search — no results** (every search field)
- Brand-new-user **Welcome** with no recents (greeting covers this conceptually — confirm the "recents" list has a zero variant)

**Error / failure states (none designed):**
- **Upload failed** (`upload_failed`, B7) — `data-room-screens.md §6` explicitly says "styling TBD"
- **Generation failed / interrupted**
- **Payment failed / insufficient Research Budget** to run an analysis (the pricing model gates on budget — needs a "top up to run" state)
- **Login error**, **email-send failure**, network **offline / load error**, broken/deleted document (404)

**Loading states:** report generation ✅; **list-level loading** (Documents / Data Room / Insights first paint) — no skeleton defined.

**Boundary / overflow:** long filenames ✅ (fixed this session, truncation); long analysis/section titles, very large `$` balances, many-files pagination, many-transactions wallet — **not addressed**.

**Tier-gated states:** Gate tier-change warning ✅ (`1472:2`); but **feature-locked** treatment for Business/Enterprise-only features (data upload, Edit, Intelligence, SSO) shown to a Free/Pro user — the "upgrade to unlock" visual — is **not designed** (only referenced as "links to the tier tray").

---

## 3. Do the specs cover all aspects?

**Well covered:** shell & nav (`app-shell-framework.md`), report-creation flow + gate/output (`gate-output-spec.md`), Theater/Source-Web (`theater-visualization-spec.md`, `visual-design-language.md`), document taxonomy & Data Room data model (`document-taxonomy.md §B`), Data-Room screens (`data-room-screens.md`), account/wallet screens (`account-wallet-screens.md`), visualization library (`visualization-library.md`).

**Spec gaps:**
- **No navigation/flow map** — nowhere is "element X → screen Y" written down end-to-end. Given zero prototype wiring, this is now a required artifact.
- **Empty / error / loading states** — not specced per surface (only conceptual mentions). Pairs with §2.
- **Insights** — effectively unspecced (2 frames, no detail/interaction spec).
- **Wallet payment flow** — the *pricing model* is thorough (`pricing-model.md`) but the *screens* for top-up / checkout / payment-method / failed-payment / receipt are not specced.
- **Search** — behaviour, scope, results, empty — unspecced.
- **Production Document View** — unspecced (only exploration frames).
- **Motion for this session's interactions** — see §4.
- **Accessibility** — focus order, keyboard nav, visible focus rings, screen-reader labels, `prefers-reduced-motion` for the new interactions — largely absent across the newer specs.
- **Responsive** — only 390 (mobile) and 1440 (desktop) exist; tablet / fluid behaviour between them is undefined.

---

## 4. Motion principles — applied?

Weighting for Caspr (a productivity/analytical tool): **Emil (restraint/speed) primary, Jakub (polish) secondary, Jhey (expressive) reserved for the one signature moment.**

**Where motion IS applied — and applied well:** the compression beat and Source-Web/Theater are treated as *the* signature, rare, expressive moment — exactly where the frequency gate permits spectacle. `app-shell-framework.md §7 / §14` and `visual-design-language.md Part VI` define durations, `--ease-standard`, the ~400ms keystone transition, streaming (12ms), section "seal", and — importantly — a `prefers-reduced-motion` instant-cut fallback. This is principled and correct.

**Where motion is MISSING — everything built this session (and the shell CRUD interactions):**
- **Drawer detent transitions** (peek ↔ half ↔ full, open/close) — core and *frequent*; must be defined (subtle, ~200–250ms, `--ease-standard`), currently undefined.
- **Scrim fade** in/out (and its absence where we removed scrims).
- **Upload progress bar** — should animate width smoothly like the "live ticker" counter, not jump; and the card's arrival/settle when a file completes (FLIP).
- **Row drag** Included ↔ Excluded (the `≡` handle) — needs pick-up lift + drop settle; undefined.
- **Tag Private↔Public toggle**, **`≡` menu open**, **delete-confirm enter/exit** — no feedback motion defined.
- **Hover / focus / pressed states** for the new controls (tag chip, `≡`, menu rows, buttons, source rows) — absent. Emil *and* Jakub both treat these as non-optional.
- `prefers-reduced-motion` is defined for compression but **not restated** for the new interactions.

**Verdict:** motion is excellent for the hero flow, absent for the day-to-day interactions. Needs one focused motion pass over the shell/CRUD surfaces (frequency-gated: fast and subtle, not expressive).

---

## 5. Are the visual rules fully defined?

`design-guidelines.md` is strong for the established system (colour, 0/2 radius, typography, logo, eyebrow, nav, list rows, dividers, spacing, shell dims, conversation, edit mode). **But this session introduced elements that live only in `data-room-screens.md`, not reconciled into the central guidelines, and one decision is genuinely open:**

- ⚠️ **New colour — green "Done" `#5CAE66`** on the upload progress bar. This sits **outside the locked Black / White / Red system.** Flagged in-spec as "indicator only," but it needs an explicit decision: keep as a functional status colour (then add it to the palette + define its full role) **or** replace with red-fill→grey-check. **Decision required.**
- **Scrim** = black @ 0.42 — not a tokenised value in `design-guidelines.md`. Tokenise it (now that the scrim *rule* is app-wide, §data-room §8).
- **File-card anatomy** (tag chip dark/light, the `≡` handle, progress-card layout, coming-soon red-text tag) — defined only in the Data-Room doc. Promote the reusable bits into `design-guidelines.md` so other surfaces stay consistent.
- **Icon reconciliation** — the glyphs drawn this session (folded-corner document, `≡`, tray+arrow, trash) were hand-authored as vectors; confirm they match / get added to the locked icon set rather than diverging.
- **Component states** — hover / focus / pressed / disabled not defined for the new controls (overlaps §4).

Everything else from the session (tag centring, drop-box, checkboxes, uploading, delete-confirm, scrim rule, rail nudge) **is** captured in the specs.

---

## 6. Ready for development?

**Core happy-path flows — READY WITH NOTED GAPS:** report creation, Data-Room file management, account/settings, onboarding. Specs are detailed, components are reused consistently, the taxonomy/data model is solid.

**The app as a whole — NOT READY** until the punch list clears. Building from what exists today would force devs to invent empty/error/loading states, guess navigation targets, and improvise every micro-interaction — exactly the inconsistencies a design system exists to prevent.

---

## 7. Prioritised punch list (for tomorrow's pass)

**P0 — blocks a clean handoff**
1. **Empty + error + loading states** for Documents, Data Room, Insights, Wallet, Search, Research-profile Memories, Notifications — plus **upload-failed** and **insufficient-budget-to-run**. (~8–12 frames.)
2. **Navigation / flow map** (element → destination) covering every screen; OR wire a Figma prototype for the core loops. Resolve the **missing production Document View** and **search results** destinations.
3. **Motion spec pass** over shell/CRUD interactions (drawers, scrim, progress, drag-to-move, toggle, menu, confirm) — frequency-gated, with `prefers-reduced-motion`.

**P1 — needed before build of those areas**
4. **Wallet payment flow** (top-up / checkout / payment method / failed / receipt) screens + spec.
5. **Feature-locked / upgrade-to-unlock** visual for tier-gated features.
6. **Visual decisions:** green "Done" colour (keep or replace); tokenise scrim; promote file-card/`≡`/tag/progress rules into `design-guidelines.md`; reconcile new icons to the locked set.
7. **Component interaction states** (hover/focus/pressed/disabled) for the new controls.

**P2 — polish / completeness**
8. **Insights** detail + interaction spec.
9. **Accessibility** pass (focus order, keyboard, SR labels).
10. **Responsive** behaviour between 390 and 1440 (tablet / fluid).
11. Boundary content (long titles, big numbers, pagination).

**What's genuinely done:** the 4 core rail destinations, the report-creation → theater → working loop, the full Data-Room file-management flow (cards, actions menu, privacy switch, upload-to-centre, delete-confirm, scrim rule), the account/settings screens + drawers, and the signature motion. These can be marked ready.

---

## 8. Notifications + mobile-nav restructure (2026-08-10, approved)

**Toasts BUILT** (desktop `1922:2` / mobile `1928:76`): white card, 1px ink border, r8, soft shadow, **38px** height; success `✓` ink / error `!` red / info no-icon; red action (Undo/Retry). Desktop = bottom-**right**, bottom-aligned to the nav/pane divider bottom; mobile = **centred** above the bottom nav, same 38px card. ~3.5s dwell (errors/actions longer, hover-pause). Full spec + a11y + motion: **`notifications-spec.md`**.

**Bell entry points BUILT:**
- **Desktop rail** (`626:76`): new **"Alerts"** slot above Help (bell + red unread badge), matched to sibling icon grey `{0.36}`, 15px glyph.
- **Mobile header** (`628:25`): bell (+ badge) replaces the balance chip, placed **left of `+ New`**.

**Mobile-nav restructure (mobile-only, space-driven):** balance moved out of the header → **bottom nav Insights tab became a Wallet tab** (wallet glyph + live balance); **Insights moved into "More"** (`1236:2860`); Wallet row removed from More. Mobile nav is now **Analyses · Documents · Wallet · More**. Desktop rail unchanged (Insights stays a top destination). Cascaded via masters; **8 detached header frames** (`637:40 965:1588 1236:2861 1248:105 1280:197 1846:52 1928:77 1277:197`) patched individually (wallet chip → bell) since they were detached in earlier full-screen work. Two Insights-tab nav frames remain only on the scratch **Exploration** page (not handoff set).

**POST-HANDOVER (additive, non-blocking):** Notification Center + User-Education layer — outlined in `notifications-spec.md §3–4`, to be designed after core build. They layer over the existing bell + shell with no structural change.
