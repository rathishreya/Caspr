# Dev prompt — round 2 (pixel audit + positioning copy)

> **Read [`DESIGN-INPUTS-RESPONSE.md`](DESIGN-INPUTS-RESPONSE.md) alongside this file — it is newer and it changes things described here.** Since this prompt was written: every text colour was recoloured for contrast (2,497 nodes), `text/primary` now means `#1a1a17`, the first-run card type sizes are designed rather than scaled, and an `AI disclosure` item was added to every onboarding footer (desktop footers re-anchored to x=1320, mobile centred). Geometry below is current as of 2026-08-21; **colours below are superseded by the response doc.**

**Re:** `DEV-RESPONSE-PIXEL-PASS-1.md` · commits `3f59701` + `92c5144` (+ `096e519`). **Pass 1 is accepted and closed** — every item verified applied and measured.

**This is the single file for the next pass.** It carries three withdrawals, your four questions, the Figma changes that came out of them, and the two positioning-copy fixes (§5) that were previously in a separate prompt. Nothing else is coming.

**Nothing here is blocking. It is one pass.**

---

## 1 · Three findings withdrawn — the audit was run signed out

You were right on all three, and the root cause was mine.

| # | Was | Actually |
|---|---|---|
| **7** | "the 64px rail is not rendered" | The rail is gated on `session` (`AppShell.tsx:62`). Signed in, `main` is `x=64 w=1376` and the column is `x=80 w=358`. **Withdrawn.** |
| **11** | "bottom nav is a nav-height too high, 2px too tall" | I measured the **PaneSwitcher** (y730–788 h58, exactly as `2310:5527` draws it). The real `BottomNav` is y788–844 h56. Both correct. **Withdrawn.** |
| **9 (mechanism)** | "the DM Mono 500 latin face fails to load" | Audit-browser artefact — the faces load fine for you. **Withdrawn.** The **weight** half was real and your fix stands: 13/13 at 500 on `/wallet`. |

Reproducing my numbers signed out before replying is what made this quick to settle — thank you for doing that rather than just disagreeing.

**Fixed at source:** `PIXEL-AUDIT-PROTOCOL.md` now opens with *"establish a session first,"* including your `localStorage` snippet and a hard stop if the rail is not visible. The font check now also states that an unused face reporting `unloaded` is not a defect.

## 2 · Your two findings — both accepted

**`COVER OPTIONS` through the product voice** — correct revert, and it is the exact mirror of finding 1. It also confirms the taxonomy is doing its job: it scrolls, but it *names a control group*, so it is family 3 (label), not speech.

**The mobile State-3 prompt that could never render** — the best catch in the exchange. A `display:none` ancestor that types, unit tests and desktop rendering all pass straight through is only findable at a real viewport. `/report/edge-prompt` is exactly the right response.

---

## 3 · Your four questions, answered

### Q1 · Edge-prompt body vs button — **keep the copy, re-space. And it is bigger than the edge-prompt.**

You are right that the frame was showing one line of a paragraph. The cause is not the copy: the body node was `textAutoResize: NONE` at 288×**20** holding 124 characters — **and so was the canonical reset confirm** (`2206:3042`, 342×10, 127 chars), which is where I cloned mine from, defect included.

That breaks a locked rule — `FIGMA-FINAL-ALIGNMENT` §1.5: *"Body copy = `textAutoResize: HEIGHT`, always. No fixed-height body boxes"* — which is check #2 of the seven-check sweep.

**Swept: 23 confirm/dialog body nodes across all three pages set to auto-height.** Zero real collisions — the spacing had always been eyeballed against rendered text, so only the metadata was wrong. *(Two apparent collisions were false positives: a background cover card behind a scrim, and the report's source caption where the red citation dot sits on the line by design.)*

**Take these numbers for the edge-prompt** — they differ slightly from yours because the body is 13px, not 14:

| | Desktop (`2328:5590`) | Mobile |
|---|---|---|
| Card | **336 × 228** | drawer, unchanged |
| Title | y24, h30 (Instrument Serif 24/30) | y414, **h31** (was a stale h10) |
| Body | y62, **h48**, w288 — 3 lines | y453, **h48**, w342 |
| Button | **y130**, h44 | y694 (unchanged, 193px clear) |
| `Not now` | **y188** | y752 (unchanged) |

### Q2 · `COVER OPTIONS` — **chrome as built. Caps is not retired.**

Caps is retired **for speech only**. `COVER OPTIONS`, `AMOUNT`, `REGARDING`, `SUBJECT` are family-3 control labels and keep Inter Semi Bold 10.5 / `#8a8a85` / ls 0.84 (`design-guidelines.md` §11.0). No frame change needed — you restored it to what the frame already said.

### Q3 · The signed-out desktop shell — **no rail, but the column must not collapse**

The frames already answer this. **None of the 10 onboarding desktop frames carries a rail** — so signed-out = no rail is correct and intended.

But `Gate + Theater — Desktop` keeps its conversation column at **x=80**. So the rail's 64px is simply *empty*; the layout does **not** shift left.

Your build already matches on the routes a real anonymous user actually walks — I measured `/scope` at **x=80**. The chromeless state I hit was on *authenticated app routes* viewed signed out, which per `onboarding-understanding.md` (signup gates at the value moment) a real anonymous user should never reach.

**So: no frame needed, no change needed.** If an anonymous user *can* reach an app route, the fix is to hold the pane at x=80 rather than collapse to 16 — worth a guard, not a redesign.

### Q4 · `WalletBadge` — **delete it. But not for the reason you gave, and the reason matters.**

A persistent money balance **is** approved — it is in the rail (`1541:7`) and it is the mobile Wallet tab's label. `EDIT-ECONOMICS` §2's "no persistent budget chrome" is about the **edit allowance in the report context**, not the wallet balance. If we accept that argument, someone later deletes the rail balance too.

The actual reason is **placement**. Your own `MobileHeader.tsx:9` records it: *"The wallet balance is deliberately NOT here — it moved to the Wallet tab."* `app-shell-framework.md` says the same. `WalletBadge` is a header chip for a balance that was deliberately moved out of the header.

**Delete it** — right call, right instinct on not leaving it looking approved.

### Confirmed · **336** is correct for the desktop edge-prompt width. The frame is 336; the old build's 327 was wrong.

---

## 4 · What changed in Figma — pull before you start

1. **Edge-prompt re-spaced**, both breakpoints — numbers in Q1 above.
2. **Every fixed-height body-copy node in the file → `textAutoResize: HEIGHT`. 150 nodes across all five pages.** This started as the 23 confirm/dialog bodies in Q1 and was then extended to the whole file. Heights are now truthful; many grew from a stale `10` to 15–57. **If you read node heights when building, re-read them — the old numbers were fiction.**

   | Page | Nodes fixed |
   |---|---|
   | `184:5` Profile & Wallet | 48 (+7 confirms) |
   | `184:4` Documents | 49 (+12 confirms) |
   | `184:2` Report Creation | 17 (+4 confirms) |
   | `184:3` Onboarding | 13 |
   | `184:6` Insights | 0 — already clean |

3. **Mobile edge-prompt title** was a stale `h10` node for Instrument Serif 24 — now h31.
4. **One real defect the sweep surfaced — `Data Room — Mobile · selection` (`2258:2927`).** With the true height, the `Reset Data Room` subtitle ran two lines and the second was half-covered by the opaque `Drawer — peek`, cutting the sentence at *"…and connected source. Your"*. **The danger row moved up 18px** — rule y614, label y636, subtitle y656 h30 — leaving 8px clear of the peek at y694. Verified by render. Copy unchanged.

5. **First-time-user stack rebuilt**, both breakpoints — `1170:146` and `1289:377`. This is the one place copy *did* change; specs and rationale in §5.3.

**Otherwise no copy changed.** No layout intent changed. Node metadata, the edge-prompt spacing, and that one 18px shift.

---

## 5 · Positioning copy, and the first-run screen

Caspr's positioning was locked on 2026-08-20. I swept every user-facing string in the build (`08b9d38`), the Figma file and the product specs against it. **Across the whole build the result is small — two one-line fixes** (§5.1, §5.2). Full working: [`../app-positioning-alignment.md`](../app-positioning-alignment.md).

The first-run screen is the exception and gets the rest of this section: a rebuilt hero (§5.3), ICP personalisation with its content library (§5.4), and a standing rule about onboarding chrome (§5.5).

The locked stack, for context:

| | |
|---|---|
| Category | Analytical AI |
| Identity | **Not an assistant. An analyst.** |
| Promise | **Arrive certain.** |
| Proof | **Every source, credible. Every claim, triangulated. Every report, defensible.** |

### 5.1 · The source count on the Help page

`apps/web/src/pages/HelpPage.tsx:58`, the answer to *"Where does Caspr get its data?"*

```diff
- '1M+ curated sources — documents, government databases and news feeds — plus anything you add to your Data Room.',
+ '25M+ curated sources — documents, government databases and news feeds — plus anything you add to your Data Room.',
```

**25M+ is the only approved figure.** Any other count is a retired claim. This is the sole wrong source count in the build — every other reference already says 25M+.

### 5.2 · Update the comment — and you were right

`apps/web/src/pages/LayoutCanvasPage.tsx:110–117`. You flagged a conflict: the frames said **25M+ live sources** while `CLAUDE.md` said **1M+**. You went with the frames and left a note saying it deserved a second look.

**That was the right call, and the source doc has since caught up** — `CLAUDE.md` now states 25M+. `LEARNING_LINE` needs no change.

Please just update the comment so it records the resolution rather than an open conflict — otherwise the next reader re-opens a settled question:

```
FLAGGED → RESOLVED 2026-08-20. The frames said 25M+, CLAUDE.md said 1M+;
the frames were right and CLAUDE.md now says 25M+. 25M+ is the only
approved source count.
```

*(Worth saying plainly: catching that and flagging it rather than silently picking one is exactly the behaviour that makes this build auditable.)*

### 5.3 · The first-time-user hero — decided, and already in Figma

**This was on hold in the last draft. Joy has decided; the frames are updated. Build to them.**

`apps/web/src/pages/onboarding/FirstTimeUserPage.tsx:95–103` is three stacked lines. The problem was that line 2 already carried the positioning, so dropping the identity into line 3 would have left two adjacent lines making the same point. The resolution deletes line 2 and re-ranks the other two:

| | Was | Now |
|---|---|---|
| 1 | *You're in. Let's get to work.* — Instrument Serif 42 (desktop) / 32 (mobile) | **same copy**, Inter Regular **16 / 13**, `#5c5b58` |
| 2 | *Analytical AI for business professionals — analysis, not conversation.* | **deleted** — the identity line says it |
| 3 | *15 minutes. 100 pages. Cited to source.* — retired | **Not an assistant. An analyst.** — Instrument Serif **42 / 24**, `#1a1a17` |
| 4 | — | **Every source, credible. Every claim, triangulated. Every report, defensible.** — desktop Instrument Serif 22; mobile Inter Regular 13 `#5c5b58`, wraps to 2 lines |

The greeting takes the size the sub-line had, the identity takes the size the greeting had. **Note the mobile proof line is sans, not serif** — at serif it wrapped to three lines and pushed the thread cards off the viewport.

Geometry (`1170:146` desktop · `1289:377` mobile) — everything below the stack is unchanged from what you already built:

| | Desktop | Mobile |
|---|---|---|
| Greeting | y116 h19 | y72 h16 |
| Identity | y151 h55 | y104 h31 |
| Proof | y218 h29 | y143 h32 |
| Input bar | y274 *(unchanged)* | y196 *(unchanged)* |

**Two mobile-only changes that came with it:**

1. **The stack is centre-aligned on mobile — this screen only.** All four lines (greeting, identity, proof, *"Not sure where to start? Pick a thread."*) are `text-align: center`, x16 w358, matching desktop. **Every other mobile screen stays left-aligned** — do not generalise this. It is a title-card moment, not a new rule.
2. **The thread cards are a lead card plus a 2×2, and their text is centred too.** Five cards in a plain 2-column grid left an orphan hanging in row 3. Instead the **lead Type takes a full-width card at position 1**, with the remaining four beneath it, 8px gutters, each row equalised to its taller tile. All three text nodes in every card are centre-aligned, width = card width − 30. In the generic frame the lead card is `Market Analysis`; **which Type leads is ICP-dependent** — see §5.4. Desktop is unchanged at 5-across.

   | | x | y | w | h |
   |---|---|---|---|---|
   | Lead card | 16 | 300 | **358** | **108** |
   | Row 1 — two tiles | 16 · 201 | **416** | 173 | **162** |
   | Row 2 — two tiles | 16 · 201 | **586** | 173 | **162** |

   **Card type sizes: 12.5 / 11 / 11** (Type name · one-liner · `↳` example). These are designed values — the old `11.585 / 10.04 / 9.654` were `15 / 13 / 12.5 × 0.7723` and are gone.

**The card count stays at five, and that is not a layout decision.** The five cards *are* the five core Types (`app-shell-framework.md` §18) — `onboarding-understanding.md` forbids expanding them: *"Do not expand to a wall of cards (that reintroduces the paralysis the page exists to defeat)."* Joy considered 4-when-known / 6–8-when-unknown and rejected it: cutting to 4 hides a Type from the user who needs it, and 6–8 forces overlapping sub-types. **Reordering degrades gracefully where filtering fails hard** — a wrong ICP guess must never remove the card they came for. If a sixth card ever appears in a design, it is a bug.

**Why there is no wordmark in the stack:** it was tried and rejected. Both frames already carry the Caspr lockup in the page header (desktop `1170:148` at 26px, mobile `1289:380` at 24px), and a second one 60px below read as a duplication bug rather than a masthead. If you see a `stack wordmark · *` node in an older copy of the file, it is deleted — do not build it.

### 5.4 · The flipping placeholder is where personalisation lives

`onboarding-understanding.md` §"ICP-based personalization" is a **DEV SPEC** and it now has its content. Detect the entry ICP from the referrer path / UTM off `/consulting`, `/investors`, `/agencies`, `/strategy`, `/startups`, `/category-managers`, `/academic`, `/market-research`, or the signup segment.

**The dividing line is the prompt bar: nothing above it ever varies.** A card has three lines — ① Type name, ② one-liner, ③ `↳` example.

| Element | Flexes by ICP? |
|---|---|
| Hero stack (§5.3) | **No.** Above the bar. Identical for every visitor. |
| **Prompt-bar placeholder** | **Yes.** 5–10 prompts, flipping, one at a time in order, looping. |
| **Card order** — including which card is the full-width mobile lead | **Yes.** |
| Card ① Type name · ② one-liner | **No.** They are the taxonomy and its definition. |
| **Card ③ `↳` example** | **Yes.** One per Type per ICP. |

**All the strings are in [`../product/onboarding-placeholder-prompts.md`](../product/onboarding-placeholder-prompts.md)** — §3 the flipping placeholders (8 per ICP, 8 ICPs + generic), §5 the card `↳` examples (5 per ICP, one per Type, + generic). Every one is traceable to a pain point in `.agents/icp-personas.md`. Take them from there; do not write your own. Both layers come from the same library on purpose, so what flips in the bar and what sits on the cards never contradict each other.

**Shape it as two lookups keyed on the same ICP token:** `placeholders[icp] → string[]` and `cards[icp] → { type, order, example }[]`. Type names and one-liners are static — they are not part of the lookup.

Behaviour: first prompt shows on load · **pauses on focus** and the field clears · never flips while the user is typing · **placeholder only, never a value** — nothing may be submitted that the user did not write · generic set whenever no ICP is known.

### 5.5 · Onboarding chrome — use the website's header and footer. Do not build one.

**This applies to every onboarding screen, desktop and mobile:** Login, First-Time User, Gate + Theater, Signup / Email-Sent overlays, Forgot password, Set new password, Reset link sent, Terms overlay.

⚠️ **CORRECTED 2026-08-21 — the original instruction here was impossible.** It said "import `caspr-web/components/layout/Header.tsx`". You cannot: `caspr-website` is Next.js, `caspr-app` is a Vite SPA on react-router, and those components bind to `next/link` and `next/navigation`. Only `Wordmark` is portable. **I specified an import across a framework boundary without checking the boundary existed** — the same class of error as auditing coordinates without asking whether the frames could express responsive intent.

**What stands is the *intent*, not the mechanism: there must be exactly one implementation of the site header and footer.** The app currently has four hand-built onboarding headers, so the drift this rule exists to prevent has already started.

**Recommended route — extract a shared router-agnostic package.** `Header`, `Footer`, `Wordmark`, `CTAButton` as presentational components with navigation *injected*: they take `href` strings and a `LinkComponent` prop, and each app passes its own (`next/link` or react-router's `Link`). Four components, no framework coupling, one source of truth.

**Why not the alternatives:** serving onboarding from the website fails because onboarding is not marketing — signup *is* the live tool, gated at the value moment (`onboarding-understanding.md`), so the website would need the app runtime. A marked mirror plus drift test is the honest fallback if the package cannot be scoped this week, but it accepts drift and merely detects it.

Tokens still come from the live `globals.css`.

**The header and footer in the Figma frames are INDICATIVE ONLY.** They are hand-replicated approximations built so the onboarding content could be composed in context. They do not exactly match the live site, and **the mobile ones are the weakest** — the mobile frames draw a simplified 56px bar with a wordmark and a text "Login", which is a placeholder, not a design. `onboarding-understanding.md` §Pending has always said mobile nav resolves to the website's hamburger. **Use the website's mobile header as-is; do not reproduce what the frame draws.**

What the frames *are* authoritative for is the onboarding content between the header and footer — the login card, the first-run stack and thread cards, the gate box, the overlays. Build those to the frames. Everything above and below comes from the website.

**Why this matters beyond tidiness:** a second header implementation means the nav, the wordmark, the CTA and the mobile breakpoint all drift the moment the marketing site changes, and the drift shows up on the highest-intent screens we have — the ones a user sees immediately after signing up. `caspr-web` is the single source for site chrome.

### 5.6 · Verified clean — no action

Searched and confirmed **zero** instances in the build and Figma:

- *"Zero hallucinations"* — gone (the only two occurrences were rationale lines in the specs, now restated)
- *"LAM" / "Large Analysis Model"* — none
- *"SOC 2 certified"* — none
- **Citations framed as work for the user** — none. This was the item the alignment brief called *"the single most common error to look for"*, and the build does not commit it once. Every `verify` in the codebase is JWT, OTP or phone verification. The citation-adjacent copy already reads as readiness: *"cited, never leaked"*, *"boardroom-ready, cited to source"*.

### 5.7 · One thing the positioning work surfaced in your favour

`features/reader/AskCasprPane.tsx:102` already carries this:

> *"IMF's 2026 outlook puts the 2030 market at $390bn; BloombergNEF at $431bn. Caspr triangulates $412bn — a 21% CAGR — weighting BNEF's bottom-up fleet data against IMF's macro model."*

Two sources disagreeing, the derived figure, and why one was weighted over the other. That is the **"every claim, triangulated"** proof beat, working today. The alignment brief assumed nothing in the product expressed it and asked for a new feature; it does, so no feature is being built.

Keep that answer shape when the real Ask responses get wired — it is doing more positioning work than anything else in the app.

---

## 6 · Still open — not for this pass

- ~~The wider fixed-height problem.~~ **Closed — swept in full, see §4.2.** The file now has zero fixed-height body-copy nodes. `FIGMA-FINAL-ALIGNMENT` §1.5 holds across all five pages.
- **One cosmetic thing left alone deliberately.** On seven Profile & Wallet frames the line *"More budget, more depth — Business unlocks upload, editing, Intelligence."* now ends 2px into the plan card below it. I rendered `1532:2` and the second line sits cleanly above the card, so I did **not** shift seven frames for an invisible 2px hairline. Build to the visual, not the 2px.
- **Layer C re-run** — signed in this time, now that `096e519` has the edit-credit path wired. States 1–3 are re-auditable and `/report/edge-prompt` gives State 3 a front door. I will pick that up separately.
- **Routes** — noted: `Contact support` is reachable-by-click (composition at `/help/message`), Gate is one route with depth as session state, Data Room has four more than I found. The protocol's coverage ledger is updated accordingly.

---

## What to actually do

1. **Pull Figma** — §4. Node heights changed across the file; re-read any you build from.
2. Apply the edge-prompt spacing, both breakpoints — §3 Q1.
3. Delete `WalletBadge` — §3 Q4.
4. Two one-line copy edits — §5.1, §5.2.
5. Rebuild the first-time-user stack — §5.3. Three lines, not four; line 2 is deleted. Mobile centres, and the cards become lead + 2×2.
6. Wire the flipping placeholder to the ICP prompt library — §5.4.
7. Check the onboarding screens import the **website's** header and footer, desktop and mobile — §5.5. Do not build a second one.
8. Nothing in §6.

---

*Design session · 2026-08-20. Pass 1 closed. This file supersedes `DEV-PROMPT-POSITIONING-COPY.md` — it is the only prompt for this round. Take it in one go.*
