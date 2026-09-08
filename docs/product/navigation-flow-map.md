# Caspr App — Navigation Flow Map (element → destination)

**Purpose:** the single place that says what every interactive element does and which screen it leads to — the wiring the Figma file itself does not carry (the file has **zero prototype reactions**; navigation is described here, not clickable). Built for a Claude-driven dev session: read this alongside the frames.

**Sources cross-checked (authoritative — this doc must not contradict them):** `app-shell-framework.md` (shell, nav, lifecycle §6/§6a, rail §9b), `gate-output-spec.md` (gate → generation → pane-switcher §8.1), `data-room-screens.md`, `account-wallet-screens.md`, `document-taxonomy.md` (Docs ↔ Data Room, Gate-1), `design-guidelines.md`, `figma-dev-readiness-review.md` (states + built frames). Where this map and a spec differ, the spec wins — flagged in §10.

**Legend:** `→` navigates to · `⤢` opens as overlay/drawer over current screen · `(node)` Figma frame id · **Soon** = Phase 2, non-navigable · *cond.* = conditional. Frame ids are Compact(mobile)/Expanded(desktop) where both exist.

---

## 1. Global chrome — always reachable

**Two responsive shells (`app-shell §9b`): Compact (bottom nav) < ~1180px · Expanded (left rail) ≥ ~1180px.** Atoms shared; only chrome differs.

### 1a. Bottom nav — Compact (`app-shell §4`, persistent; hides on scroll-down §8)
**Mobile bottom nav (restructured 2026-08-10): Analyses · Documents · Wallet · More.** The old Insights tab became **Wallet** (balance moved off the header — the header now carries the notification **bell**); **Insights moved into "More".**
| Tab | → destination |
|---|---|
| **Analyses / Home** | Home / Welcome (recent work) — `637:2` |
| **Documents** | Documents library — `1280:196` (full-screen destination) |
| **Wallet** (`$balance`) | Wallet — `1571:2` (was the Insights tab; label shows live balance) |
| **More** | Nav-overflow sheet — `1236:2860` ⤢ → **Insights (Soon) · Data Room · Help · Account** (Sign out via Account). No "Settings"; account row is "Account", not "Profile". |

### 1b. Left rail — Expanded (`app-shell §9a/§9b`; replaces "More" entirely)
- **Top row:** wordmark · `+ New` (red) → starts a new analysis → Compose/Welcome (`638:2`).
- **Nav items (now icon + LABEL — Joy, 2026-08-10; text-in-nav for a new product):** **Analyses** → `638:2` · **Documents** → `843:89` · **Insights** → `1231:2860` (**Soon**) · **Data Room** → `1756:2`. Master rail `626:76` updated in place (54px pitch from y58, four labels); cascades to all desktop frames.
- **Bottom cluster (as built, supersedes §9b's Settings/Profile-card layout — see §10):** **Alerts** (bell + red unread badge → Notification Center, **Phase 2 stub**) · **Help** → `1711:2` · **Wallet** (`$balance`) → `1532:2` · **Account** → desktop Account `1596:2`. No separate Settings; settings live inside Account.

### 1c. Header (Compact, `app-shell §3`) — Tier 1 brand bar: wordmark · **notification bell** (+ red unread badge → Notification Center, **Phase 2 stub**) · `+ New` → new analysis. *(The wallet balance is no longer in the header — it moved to the Wallet bottom-nav tab, 2026-08-10.)* Tier 2 context strip (only when an analysis is open): `‹ back` · report title · `⋯` → share / export / rename / **View the brief** (`app-shell §10`).

---

## 2. The analysis lifecycle — the main flow (`app-shell §6/§6a`, `gate-output-spec`)

**One front door: the prompt** (`app-shell §1a`). No use-case menu — landing accelerator chips *prime* the prompt, they don't fork. Order (corrected 2026-07-11): structure & questions first, Theatre fires **after** commit.

```
Welcome/Compose ─send─▶ [Intent confirmation? cond.] ─pick─▶ Instant structure ─▶ Live refine
   (638:2/637:2)          (only if intent ambiguous)         (Layout Canvas 692:2/694:2)
        │                                                              │
        └─────────────────────────── clarifying Qs (drawer, Half) ────┘
                                              │
                                          Gate (708:2/722:2)  ── "Generate" ──▶ [COMPRESSION ~400ms]
                                              │                                        │
                                     (refine loops back to 2–5,                        ▼
                                      no commit)                              Theatre (762:2/724:2)  nav HIDDEN
                                                                                       │
                                                                             Generation (775:2/777:83)
                                                                                       │
                                                                             Reading = Working screens
```

- **Intent confirmation (`§6 phase 1b`, cond.):** shown only when deliverable intent is ambiguous — 2–4 prompt-seeded options (each = depth × type). Confident prompt → skipped. Pick selects the **archetype** (`§6a`): *structure-proposal* (→ section canvas) · *brief-considerations* (→ scope + 2–3 Qs, no canvas) · *input-gathering / DD* (→ **Data Room first** `1756:2`, then structure).
- **Gate (`gate-output §1–7`):** confirm style · language · template · formats · **premium data / Data-Room selection** (Gate-1 rows Included/Excluded per `document-taxonomy §B`). `Generate` commits → compression. `Top up $54 to run` appears here when budget < cost → **Wallet top-up** (`1854:2`, §5) [state: insufficient-budget `1814:2`].
- **Theatre → Generation:** Source Web (`theater-visualization-spec.md`), then the report builds. Error → **generation-failed** (`1827:2`) → `Try again` (re-enters Generation) · `Contact support` → Help.

### 2a. Reading / Working — the report reader + pane switcher (`gate-output §8.1`, §9)
The finished report with the foot **pane-switcher: `Contents · Ask Caspr · Edit · Outputs · Updates`** — **progressively active**: none during build → **Ask Caspr only** (others dimmed) during Theatre/Generation → all active on complete (**Updates = Soon**).

| Switcher tab | → pane/screen | Node (Expanded/Compact) |
|---|---|---|
| **Contents** | report TOC (scroll-synced; tap row → scroll report) | `1446:2` / `1452:2` |
| **Ask Caspr** | cited Q&A thread (docked input + **red-dot citations** anywhere in the report ⤢ open Ask scoped to that figure — `app-shell §5`) | `810:2147` / `944:1394` |
| **Edit** | contextual proposal pane (Chart/Visual families) — v1.1, `design-guidelines §12` | `837:2331` / `1138:2734` (+ Chart `1131:2455`, Visual·Cover `1131:2668`, Infographic `1395:2`) |
| **Outputs** | generate/download outputs by tier (metered) | `923:2405` / `1283:3112` |
| **Updates** | re-analyse feed — **Soon** (Phase 2) | `1099:2` / `1120:2295` |

**Versions** (`831:2227` / `946:1492`) reached from `⋯` / the actions model (`project-caspr-report-actions-model`). Every red dot → Ask Caspr drawer (the "analyst on call").

---

## 3. Documents library (`app-shell §13/§11c-septies`, `document-taxonomy §A`)

- **Documents** (`843:89` / `1280:196`) — grid of cover cards; filter pane (Expanded) / filter pills (Compact); Sort.
  - **A cover card →** **Document View** (the report reader for a *complete* doc): `1848:2` / `1849:2` — same reader as §2a (Contents/Ask/Edit/Outputs/Updates switcher), entered from the library instead of mid-creation.
  - **Search** (typing) → results-active (`1851:2` pattern: query · "N results" · Clear) → *no matches* → **search no-results** (`1824:2` docs / `1812:2` data room).
  - **Grid ↔ Details(list) toggle** (`§11c-septies`) — both scroll vertically.
  - **Empty (0 docs)** → **empty state** `1803:2` / `1846:51` → `Start an analysis` → Compose (`638:2`).
  - **Loading** → skeleton `1832:113`.
  - **Deliverable type is a tag, never a nav section** — DD / legal / study all land here (`§1a`).

---

## 4. Data Room (`data-room-screens.md`, `document-taxonomy §B`)

- **Data Room** (`1756:2` / `1766:2`) — Included / Excluded / Connected (**Soon**) sections; each file = a card.
- **File card `≡`** (drag handle **and** menu) ⤢ **row menu / sheet** (`1778:81` / `1785:356`): **Make public/private** (B1) · **Move to Excluded/Included** (B2; Excluded→Included needs a confirm) · **Delete…** → **delete-file confirm** (`1775:2` / `1784:290`) → primary **Move to Excluded** (safe) · **Delete permanently** · Cancel.
- **Add a file** — pane (Expanded) / drawer (`1768:2`, Compact): drop box / **Upload files** button · paste-a-URL · **Connect a source** (Bloomberg/Refinitiv/… — **Soon**). Uploading → files land in the **centre** with a progress bar (`1791:2` / `1796:2`); fail → **upload-failed** row (`1809:2` / `1824:197`) → Retry / ✕.
- **Empty (0 files)** → `1805:2` / `1808:2` (pane stays = add path). **Search no-results** → `1812:2`. **Loading** → `1832:2`.
- **Entry:** rail Data-Room icon (Expanded) / More → Data Room (Compact) / DD archetype (`§6a`) / Gate-1 file selection.

---

## 5. Account, Settings & Wallet (`account-wallet-screens.md`)

### 5a. Account (Compact, flat menu — `§2`)
Avatar / More → Account. **Menu drawer `1669:2`** ⤢:
- **Identity card `›`** → **Details** (`1697:76`) → Edit name (`1698:2`) · Edit phone · **Change email** (`1658:98` enter → `1662:2` sent).
- **Research profile `›`** → `1680:2` → *Answer questions* → carousel drawer `1689:2`. Empty → `1811:2`.
- **Security `›`** → `1686:2` → Change password (`1700:2`) · Enable 2FA (`1698:37`) · **Reset account** (`1662:52`) · **Delete account** (`1658:151`, type DELETE) · Sign out device.
- **Notifications `›`** → `1680:211` (inline toggles, no drawer, no empty state).
- **Preferences `›`** → `1680:312` → Language picker (`1698:86`) · Output style · Format.
- **Sign out** (red, action) → **Sign-out confirmation** `1248:104`.

### 5b. Account (Expanded — `§5`, kept as-is)
Account page `1596:2` — pane (identity card + expanded nested menu: Profile ▸ Details/Research-profile · Security ▸ Password/2FA/Devices · Notifications · Preferences · Sign out) + centre per-section (change-email/reset/delete are **desktop modal overlays** on a scrim, `1646:*`). Research-profile empty → `1834:2`. **Desktop keeps forms in the centre; the mobile merges are mobile-only — do not cascade (`§5`).**

### 5c. Wallet & payment — **Model B: Stripe-hosted** (Joy, 2026-08-10)
- **Wallet** (`1532:2` / `1571:2`) — balance ($186 spendable; 7% fee internal) + activity ledger + plans. Empty (new user) → `1830:2`.
- **Top up** (balance card / Gate `Top up to run`) ⤢ **top-up** modal/drawer (`1854:2` / `1857:2`): choose amount (**$20/$50/$100**/**Custom** — **our** product logic; the **user's tier value is pre-selected** — Professional $20 · Business $50 · Enterprise $100, updated 2026-08-18) → **`Continue to payment ↗`** → **Stripe Checkout (hosted)** owns card entry + **Stripe Tax** (total + tax shown *there*, never in our UI) + 3DS/SCA → on return: **success/receipt** (`1855:2` / `1858:2`, `Done` → Wallet · `Download receipt` = Stripe-hosted invoice) or **payment failed** (`1855:230` / `1858:175`, light return state; retries happen inside Checkout).
  - **This is the single top-up mechanism** — analyses, outputs, and **edit-credit overflow** all draw the one money balance and top up here (no separate "buy credits" flow — `EDIT-CREDITS-WALLET-DEV-NOTES.md`).
  - **Custom amount** (`1887:2` / `1888:2`): picking `Custom` reveals a `−  $N  +` **stepper — minimum $10, $10 increments, no maximum** (updated 2026-08-18). Steppers move by $10; typing snaps to a valid $10 multiple ≥ $10 on blur; hint "$10 minimum · $10 increments" turns red + **disables `Continue to payment`** while invalid. The amount = budget added; tax is added on top at Stripe checkout.
- **Manage billing** (top-up `Manage in Stripe`, or a wallet "Payment & billing" entry) ⤢ **billing handoff** (`1878:2` / `1878:135`): read-only default card + `Manage in Stripe ↗` → **Stripe Customer Portal** (add/edit/remove cards, invoices, billing details). *(This replaced the earlier custom add-card form — Caspr does not collect or store card data.)*
  - **Gateway = Stripe, hosted (Model B).** We own: amount selection, budget/plan logic, lightweight success/return states. **Stripe owns:** card collection (Checkout / Customer Portal), **tax (Stripe Tax — we never compute or display tax)**, SCA, payment methods, receipts/invoices. Entity = **Caspr Holding Pte Ltd (Singapore)**, charged in **USD**; **payout = a Singapore-domiciled USD account** (SVB US can't attach to an SG Stripe account — Dev&Deploy session). *Not* Razorpay / Indian account. Balance updates via the product-side `POST /webhooks/stripe` handler. **Auth = self-hosted (NOT Clerk):** Caspr's own backend is the identity provider — issues JWTs (`jose`), Jayant verifies via JWKS; sign-in = password + Google OAuth (`POST /auth/oauth`). **Phone verification is ON at launch** (Joy, 2026-08-11) — **SMS/OTP = AWS SNS** (Jayant's choice), Caspr owns the OTP logic (SNS only transmits) with anti-SMS-pumping guards; authenticator-TOTP remains primary for 2FA. Frames: **Edit phone `1884:107` · Verify phone `1895:3`**. *(Supersedes the earlier "phone = unverified contact field / SMS deferred" wording.)* *(Earlier stale-doc flag re: Clerk + Stripe Model A is now resolved — `architecture-alignment-v4.md` v4/v4.1 already record self-hosted auth + Model B hosted payments.)*
- **Plans / Switch budget** (Wallet plan cards) → budget-change confirm *(reuses the change pattern; not a separate build)*.

### 5d. Get Help (`§6b`)
Help (`1711:2` / `1712:2`) — search + category FAQ cards (expandable) + message-support form (pane/drawer; mobile Full when sending → `1713:2`). Entry: rail Help / More → Help / Generation-failed `Contact support`.

---

## 6. Onboarding (`onboarding-understanding.md` — signup IS the tool, gated at the value moment)

`Login` (`1167:146` / `1286:377`) ⇄ **Signup overlay** (`1182:127` / `1303:429`) → **Email sent** (`1183:252` / `1303:560`) · `First-Time User` (`1170:146` / `1289:377`) → **Gate + Theater** (`1177:3075` / `1302:397`) → **Conversation + Layout** (`1301:3280` / `1309:3280`) → into the normal lifecycle (§2). The gate/theater is the live tool gated at the aha moment. *Forgot-password → reset-request screen: not yet built (flagged, §10 / review §1).*

---

## 7. State entry / exit (empty · error · loading — `figma-dev-readiness-review §0`)

Every empty/error/loading frame is a **state of a surface**, reached automatically by data condition, not by a nav control. Exits: empty CTAs route to Compose (Documents) or the add pane (Data Room); error CTAs Retry in place or Contact support; loading resolves to the populated surface. Full node list in the readiness review §0. Notifications has **no** empty state (settings toggles); Insights stays **Soon**.

---

## 8. "Coming soon" surfaces (non-navigable in v1)

Insights (dashboards) · Data-Room **Connect a source** · report **Updates** tab · Business-tier features shown to lower tiers (feature-locked treatment — **not yet designed**, review P1). These render but do not lead anywhere; they carry a `COMING SOON` / `Soon` tag.

---

## 9. One-way & guarded transitions (don't auto-wire these as simple links)

- **Generate** (Gate) — the *only* action that fires compression → Theatre; refinement loops back without committing (`§6`).
- **Move Excluded → Included** — one-tap **confirm** (opens locked material to reuse; `document-taxonomy §B2`).
- **Delete file / Reset / Delete account / Sign out / Payment** — all **confirm** first (blocking modal, scrim on both breakpoints per `design-guidelines §13`). Delete-account additionally requires typing `DELETE`.
- **Private → Public** (file) — explicit action only; Public → Private always allowed (`§B1`).

---

## 10. Cross-check notes (alignment + divergences found)

- ✅ **Lifecycle, gate, pane-switcher, Ask-Caspr red-dots, Documents-as-tag, Data-Room B1/B2, account IA, wallet-fee-internal** — this map matches the specs verbatim.
- ⚠️ **Rail (desktop):** the **built** rail (master `626:76`) now shows **icon + label** on the top four (**Analyses · Documents · Insights · Data Room**, Joy 2026-08-10) and **Alerts (bell) · Help · Wallet · Account** at the bottom (one Account hub; settings live inside Account — no separate Settings destination). This supersedes `app-shell §9b` (icon-only top + Settings + Profile-card) and the earlier icon-only build. Dev: follow the built labeled rail.
- ⚠️ **Insights** appears in nav (bottom nav + rail) but is **Soon** — the tab is present, the destination is a teaser. Keep the tab; don't wire a live dashboard.
- ⚠️ **Not-yet-built destinations referenced by controls:** payment-methods (add/edit card, off "Change"), forgot-password (off Login), feature-locked/upgrade overlay (off Soon features), Details→Edit-phone drawer, Sign-out-device confirm. All are flagged in `figma-dev-readiness-review.md` §7; controls exist, targets pending.
- ⚠️ **Desktop vs mobile divergence is intentional** (`account-wallet-screens §5`): desktop keeps actions in the centre + expanded pane; mobile uses the flat menu + merged Security + action drawers. Not a bug — do not "reconcile".

*Owner: Joy · 2026-08-10. Companion to `figma-dev-readiness-review.md`. Every frame id verified against the file during handoff prep.*
