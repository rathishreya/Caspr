# Pixel-fidelity audit — findings, pass 1 (code)

**Commit audited:** `08b9d38` ("Sweep: credits not tokens, and figures in DM Mono") · repo `Caspr-Joy/Caspr-app`, cloned read-only to the harness scratchpad.
**Method:** protocol in [`PIXEL-AUDIT-PROTOCOL.md`](PIXEL-AUDIT-PROTOCOL.md). Expected values from [`DEV-BRIEF.md`](DEV-BRIEF.md), cross-checked against the live Figma file.
**Scope of this pass:** pre-flight + Layer A (tokens) + Layer B (conversation system) + the economics surfaces. **Layer C (screen-by-screen rendered measurement) is NOT done** — it needs the running app. See §5.

---

> ## ⚠️ STATUS 2026-08-20 (end of day) — pass 1 applied, **three findings withdrawn**
>
> Dev applied everything in pass 1 (`3f59701`, `92c5144`) and reproduced my numbers before replying. Three of my findings were **not defects — I ran passes 2 and 3 signed out**, and the rail, bottom nav and mobile header are gated on `session` (`AppShell.tsx:62`):
> - **#7 rail** — signed in, `main` is `x=64 w=1376`, column `x=80 w=358`. **Withdrawn.**
> - **#11 bottom nav** — I measured the **PaneSwitcher** (y730–788 h58, as drawn at `2310:5527`); the real nav is y788–844 h56. **Withdrawn.**
> - **#9 mechanism** — the DM Mono `NetworkError` was an audit-browser artefact. **Withdrawn.** The **weight** half was real and is fixed (13/13 now at 500).
>
> Fixed at source: `PIXEL-AUDIT-PROTOCOL.md` now opens with **"establish a session first"** plus a hard stop if the rail is absent, and the font check now notes that an unused face reporting `unloaded` is not a defect.
>
> **Also swept 2026-08-20:** 23 confirm/dialog body nodes set to `textAutoResize: HEIGHT` (they violated `FIGMA-FINAL-ALIGNMENT` §1.5 / seven-check #2), and the edge-prompt re-spaced on both breakpoints. Details in [`DEV-PROMPT-PIXEL-PASS-2.md`](DEV-PROMPT-PIXEL-PASS-2.md).

> **STATUS 2026-08-20 — the two design-side findings are FIXED in Figma.**
> **#3** all 40 user bubbles are now **13 / `#1a1a17`** (36 Regular + 4 Italic selection-echo), re-anchored to the column right edge, zero overflow.
> **#5 was narrower than first written** — the *mobile* edge-prompt was **already** Instrument Serif 24 (it was cloned from the canonical confirm). Only the **desktop pane dialog** was wrong; it is now **Instrument Serif 24 / lh30**, one line, body re-spaced to y62.
> Dev actions: [`DEV-PROMPT-PIXEL-PASS-1.md`](DEV-PROMPT-PIXEL-PASS-1.md).

## 0 · Headline

The build is **substantially faithful**, and unusually well-traced — the token layer cites Figma node ids and design-doc sections in comments, and `ProductVoice.tsx` is a near-exact implementation of a rule we only agreed yesterday. The retired revision model is genuinely gone from the UI.

**Four findings, plus one observation.** One is a real dev gap; two are **our** fault, not the dev's; one is the build being right where Figma is wrong; one turned out to be dead code and was downgraded.

| # | Severity | One line |
|---|---|---|
| 1 | **CRITICAL** | `CompactEditVisual.tsx` (mobile Edit · Visual) was missed by the conversation sweep — retired caps label + 12.5px body |
| 2 | **CRITICAL** | Caspr's Edit-pane message uses off-ramp ink `#2a2927` |
| 3 | **MEDIUM** | User-bubble type disagrees **because Figma still carries the drift** — my pass didn't finish |
| 4 | ~~MEDIUM~~ → **LOW** | A "running low" helper exists that no spec asks for — but it is **dead code and renders nowhere** |
| 6 | **OBSERVATION** | The whole edit-credit path and the top-up modal are **built but not mounted** |
| 5 | **REVERSE** | Edge-prompt title: the build follows the confirm pattern; **my Figma refs don't** |

---

## 1 · CRITICAL — mobile Edit · Visual missed by the conversation sweep

**One root cause, two symptoms.** `features/reader/CompactEditVisual.tsx` did not get the treatment its desktop sibling did.

| | Expected (`DEV-BRIEF` §2.2, §2.4) | Actual |
|---|---|---|
| The connector | *"Or just ask"* — product voice, italic 13/19, sentence case, 7px dot | `OR JUST ASK` — **10.5px semibold caps, letter-spacing 0.84, `text-placeholder`** (line 177–182) |
| Caspr's message | Inter **13 / lh19**, ink `#1a1a17` | `text-[12.5px] leading-[normal] text-edit-body` (line 145–150) |

The desktop panes were converted correctly — `EditChartPane.tsx` renders `<OrLabel>Or steer by intent</OrLabel>` through `ProductLine`, with an accurate comment quoting the "does it scroll?" test. So this is an execution miss on one file, not a misunderstanding.

**Impact:** the retired caps treatment — the exact thing §10 says to stop building — is still on screen on mobile Edit · Visual.
**Route:** dev fix. Replace the `<p>` with `<OrLabel>` / `ProductLine`, and take the message to 13/19/ink.

## 2 · CRITICAL — off-ramp ink for Caspr in the Edit panes

`--color-edit-body: #2a2927` (index.css:149, *"Caspr's message in the Edit pane"*) is used on **6** message nodes across `EditChartPane`, `EditInfographicPane`, `EditPane`, `EditVisualPane`, `CompactEditVisual`.

- **Expected:** `#1a1a17` — `DEV-BRIEF` §2.4 gives Caspr nudge exactly one ink, and §1.1's ramp has no `#2a2927`.
- **Actual:** `#2a2927`.
- **Figma agrees with the brief** — I re-pointed those 5 nodes to `#1a1a17` on 2026-08-19.

**Impact:** invisible in isolation, but it is a second near-black in the ramp — precisely the drift `FIGMA-FINAL-ALIGNMENT` §1.1 set out to kill.
**Route:** dev fix — delete the token, use `text-ink`.

## 3 · MEDIUM — user-bubble type: **Figma still carries the drift, not the dev**

The build renders the user bubble at **13/16 on mobile and 12.5/15 on desktop** (`Conversation.tsx:90`, via `shell:` variants).

`DEV-BRIEF` §2.4 says **13 / `#1a1a17`, everywhere**. But the design file today says:

| In Figma now | Count |
|---|---|
| 13 Regular `#1a1a17` ✅ | 8 |
| 13 Italic `#1a1a17` ✅ *(selection echo — correct)* | 1 |
| **13 Regular `#0a0a0a`** ❌ | 3 *(Ask-Caspr bubbles)* |
| **12.5 Regular `#1a1a17`** ❌ | 6 *(Gate / Layout Canvas)* |

**This is mine.** In the 2026-08-19 pass I listed the bubble change as approved decision #2, inspected the bubble structure, flagged the auto-layout hug risk — and then moved to the margin fix and **never came back to execute it**. The dev built from the file, which still showed 12.5 on those desktop frames. They did the right thing.

**Route:** fix Figma first (complete the change: 12.5 → 13, `#0a0a0a` → `#1a1a17`), then drop the `shell:` override in the build. **Do not ask the dev to change this until Figma is correct** — otherwise the file and the build swap places and we do this again.

## 4 · LOW *(downgraded from MEDIUM)* — the "running low" helper is dead code

`features/wallet/editCredits.ts:180` — `allowanceNote()` returns *"Running low on this report's included edits."* at ≤15% remaining.

**Corrected after tracing it:** I first filed this as MEDIUM, which implied users would see a fourth signal. **They would not — it renders nowhere.**

| Reference | Count |
|---|---|
| `allowanceNote` called by a component | **0** |
| `allowanceNote` referenced by its own test | 4 |
| Imported by `useEditBudget` (the hook that would surface it) | **no** — the hook imports `CROSSING_LINE` only |

So there is no user-visible deviation, and nothing to decide about live UX. What exists is an unused helper encoding a state the spec removed on 2026-08-19, pinned in place by a test.

**Route:** delete the helper and its test. Not because a pre-wall warning is a bad idea — it may well be right — but because an uncalled helper that contradicts the spec is exactly what gets wired up later by someone assuming it was specified. If we want the warning, it should be decided, written into the brief, and *then* built.

## 6 · OBSERVATION — the edit-credit path is built but not mounted

Not a fidelity defect, and possibly just the state of play at this commit — but it bounds what the audit could check, so it is recorded rather than passed over.

| Symbol | External references |
|---|---|
| `useEditBudget` | **0** |
| `EditEdgePrompt` | **0** |
| `TopUpModal` | **0** |
| `WalletBadge` | **0** |
| `CROSSING_LINE` | used only inside `useEditBudget`, which is itself unused |

There is no barrel file in `features/wallet/` that could be re-exporting them. By contrast the **Wallet screen itself is wired** — `useWallet` (3), `ActivityList` (3), `BudgetPace` (2), `PlansDrawer` (1), `BillingModal` (1) all have live consumers.

So: the wallet screen renders; the **top-up flow and the three budget states do not**. States 1–3 could not be verified at any level beyond their pure functions.

**Route:** ask the dev — is wiring in progress? The proxy APIs only just landed, so this may simply be the next commit. Nothing to fix if so.

### Useful for Layer C
`app/router.tsx` exposes **explicit state routes** — `/documents/empty`, `/documents/no-results`, `/documents/loading`, `/data-room/uploading`, `/data-room/empty`, `/data-room/no-results`. That answers the "which states can the proxy reach?" question for those surfaces: they are directly addressable, so Layer C can drive to them without fixtures.

## 5 · REVERSE — the edge-prompt title: build right, my Figma refs wrong

`EditEdgePrompt.tsx` renders the title in **Instrument Serif** (24px mobile / 26px desktop).

I wrote that the edge-prompt is "built on the established confirm pattern" — and then built my reference frames with an **Inter Semi Bold 16** title, copied from the tier-change dialog rather than the reset/delete confirms I cited. The canonical confirms are:

| Canonical confirm | Title |
|---|---|
| `2206:3041` mobile reset | **Instrument Serif 24** |
| `2195:3029` desktop reset | **Instrument Serif 30** |

`design-guidelines.md` §140 is explicit: serif titles belong to confirm drawers derived from desktop modals. **The build is correct; my refs `2306:5213` / `2310:5470` are wrong.**

**Route:** back to design — fix my two ref frames to serif. One residual: desktop should be **30**, the build has **26**; correct Figma first, then align the build.

---

## 2 · What passed — verified, not assumed

**Pre-flight**
- All three families self-hosted via `@fontsource` (Instrument Serif 400; Inter 400/500/600; DM Mono 400/500). No CDN — consistent with the no-third-party-request rule.
- All four newest tokens present and exact: `--color-fill-track` `#e5e5e3` · `--color-fill-chip` `#ededeb` · `--color-text-label` `#474642` · `--color-accent-pressed` `#be3530`.

**Layer A**
- Grey ramp matches `DEV-BRIEF` §1.1 across the board; The Signal's cool greys preserved as a separate family, not warm-merged.
- `credit-green` `#1a7f4b` correctly reserved for signed amounts — **and** Insights' rising delta was re-pointed to the same hue, killing the `#2e7d33` second green the brief flagged.
- Radius scale exact: `sharp 0 · edge 2 · card 12 (RESERVED overlay-only) · drawer 20`, with a comment correctly recording that ruling B2 moved content cards down to `edge`.
- Three font tokens only; `--font-mono` commented "figures & numbers ONLY"; **66** `font-mono` usages.
- Scrim `rgb(0 0 0 / 0.42)`; mobile shell tokens exact (gutter 16 · content 358 · header 52 · nav 56 · nav-top 788).
- `prefers-reduced-motion` honoured globally **and** specifically on the decode flash and Learning pulse.

**Layer B — `ProductVoice.tsx` is essentially exact**
- Italic Inter 13/19; engaging `#34332f` / quiet `#5c5b58`.
- 7px **outline** dot (`border`, not fill), `--color-product-dot` `#8a887f`, offset `top: 6` — matches the Figma placement.
- **`textIndent: 18` on the first line only** — the correct CSS expression of "inline mark, no hanging indent", with an explicit comment that a `<ul>` is forbidden.
- `continuation` drops both mark and indent — one mark per turn.
- `PhaseMarker` = full-width hairline **then** a quiet line beneath at 12px — the retired centred-caps label is gone.
- `CONVERSATION_COLUMN = 358`; every gap constant matches §2.4 exactly, including `centreTurn: 24` with a comment explaining the container-not-breakpoint rule.

**Economics**
- `INCLUDED_CREDITS` = brief 15,000 · study 80,000 · intelligence 300,000 — **with a test asserting it**.
- `TOP_UP_PRESETS = [20, 50, 100]`.
- Crossing-line copy matches the spec **verbatim**.
- `EditEdgePrompt` has "Top up to keep editing" + "Not now".
- **No trace of the retired revision model** in the UI — the only `revision` hits are the API's layout-revision counter, a different concept. `CompactEditVisual` even carries a comment explaining why the `↻ n/10` meter was removed.

---

---

# Pass 2 — rendered (localhost:5173, 1440×900)

Measured with `getComputedStyle` / `getBoundingClientRect`. Two new CRITICALs, and the product voice verified exact.

## 7 · CRITICAL — the 64px desktop rail is not rendered

The desktop shell renders as **aside 390 @ x0 + section 1050 @ x390 = 1440**. There is **no rail**.

- Rail labels `Analyses` / `Documents` are absent from the DOM; `Insights` / `Data Room` exist only in the hidden mobile nav (zero dimensions at this breakpoint).
- Verified on `/generation`, `/documents`, `/gate`, `/theater`, `/report/chart`, `/layout/learning` — `main` is `x=0, w=1440` on all of them.

**Expected:** `--spacing-rail: 64px` + pane 390 + … = 1440 — the token exists in `index.css:199` but nothing lays out against it. **Every desktop frame in Figma carries `Rail — v3 (slim)` at x0 w64** (verified on `775:2`, `692:2`, `708:2`, `762:2`, `1131:2455`, `810:2147`, `2186:4565`).

**Consequence:** the entire desktop shell sits **64px left of spec**. The conversation column lands at **x=16** (`/generation`, `/report/chart`) or **24** (`/layout/learning`) instead of **80**, and the centre column is displaced with it.

This is the highest-impact finding — it affects every desktop screen, and no amount of correct internal spacing survives it.
**Route:** dev fix.

## 8 · CRITICAL — figures render DM Mono **Regular**, spec says **Medium**

`DEV-BRIEF` §1.5 and the seven-check sweep both say **"DM Mono Medium — every figure"**.

- On `/wallet`, **13/13** mono elements compute to `font-weight: 400`. Confirmed rendering *is* DM Mono (measured width differs from the fallback stack), just at the wrong weight.
- In code: **66** `font-mono` usages, only **5** paired with `font-medium` — so ~61 figures are Regular.

**Compounding:** the DM Mono **500 latin face fails to load** — `FontFace.load()` returns `NetworkError` for the `U+0-FF` subset (the range containing digits, `$`, `,`, `.`), while the latin-ext 500 face and both 400 faces load fine. The files themselves fetch 200 as valid `wOF2` (14,988 bytes), so this is not a missing asset. It means even the 5 elements that *do* ask for Medium would fall back.

*Observed in the audit browser; worth a second pair of eyes in a normal browser before chasing the cause.*
**Route:** dev fix — add the weight, and resolve the 500-face load failure.

## 9 · CONFIRMED in the DOM — user bubble at 12.5

Finding #3 validated by measurement, not inference: bubbles compute to **12.5px / lh15** on desktop, right edge **438** (correctly right-aligned to the column). Figma is now fixed to 13; the build follows.

## 10 · Minor — numbered question line-height

Clarifying-question text renders **13px / lh18**; Figma is now **lh19**. Position is correct — `x=100, w=338` (column + 20 indent).

## PASS — the product voice is exact

Measured on `/generation`, and it matches the spec on every attribute:

| Attribute | Expected | Measured |
|---|---|---|
| Style / size / leading | italic 13 / 19 | italic `13px` / `19px` ✅ |
| Quiet colour | `#5c5b58` | `rgb(92,91,88)` ✅ |
| Engaging colour | `#34332f` | `rgb(52,51,47)` ✅ |
| Dot | 7px, stroked, `#8a887f` | `7.0×7.0`, `border 1px rgb(138,136,127)`, `background transparent` ✅ |
| Dot position | column left, optical centre | `dx 0`, `dy 6` ✅ |
| First-line indent | 18, first line only | `text-indent: 18px` ✅ |
| Continuation | no dot, no indent | dot `null`, `text-indent: 0px` ✅ |
| Phase marker | full-width hairline + 12 gap | hairline `w 358`, gap `12` ✅ |
| Not a list | never `<ul>` | `listsInPane: 0` ✅ |

Also passing: conversation column **w=358** and the **prompt bar shares its left edge** (both `x=80, w=358` on `/scope`); Caspr reply `#5c5b58` and nudge `#1a1a17` both at 13/19; pane heading 14/17 `#474642`.

---

# Pass 3 — mobile (390×844) + remaining screens

## 11 · CRITICAL — the bottom nav is a nav-height too high, and 2px too tall

| | Expected | Measured |
|---|---|---|
| Height | **56** (`--spacing-mobile-nav`) | **58** (`class="flex h-[58px] …"`) |
| Position | **y 788 → 844** (the last band of the shell) | **y 730 → 788** |

Figma has `Bottom Nav — v3` at **y=788, h=56** (verified on `1422:2`). The build ends the nav *at* 788 rather than starting it there, leaving **788–844 empty** — the nav floats one nav-height above the bottom of the screen.

The token `--spacing-mobile-nav-top: 788px` is commented *"drawers rise to here, never to 844"* — 788 is the **nav's top edge**. The build has read it as the nav's bottom.

**Route:** dev fix. Height `h-[56px]`, anchored to the bottom of the 844 shell.

## 12 · CRITICAL — drawers have no top border

All drawers measure `border-top-width: 0px`. `DEV-BRIEF` §1.4 is explicit: **one border across all three detents — top edge only, `#e0ded9`, `strokeTopWeight 1`, other sides 0**, implemented via per-side weights rather than a separate line node ("a border that changes mid-swipe reads as a disruption").

**Route:** dev fix — `border-top: 1px solid var(--color-drawer-edge)`.

## PASS — mobile

- **Product voice is exact on mobile too:** italic 13/19 · quiet `rgb(92,91,88)` · engaging `rgb(52,51,47)` · dot `7.0px @ dx 0` · `text-indent` 18 on turn openers and **0 with no dot** on the continuation · column **x=16, w=358** — matching the mobile spec precisely.
- **Drawer detents correct:** 408 (Half) and 94 (Peek) both present, no content-sized heights.
- **Drawer top corners** `20px 20px 0 0` ✅.
- **Dark title card** 58 tall ✅.

## PASS — radius discipline across the app

**Zero** elements use `border-radius: 12px` outside overlay surfaces, on `/account/delete`, `/documents` and `/wallet`. Ruling B2 — which moved content and layout cards down from 12 to 2 — is genuinely honoured, and that is the kind of thing that usually rots first.

## 5 · Coverage ledger — what was NOT verified

Recorded so a gap is not mistaken for a pass.

*Updated after passes 2 and 3.*

| Not verified | Why |
|---|---|
| **Scrims** — 42% black, mobile y52 h736 | `/account/delete` reached by `pushState` rendered the page without the modal open, so no scrim was present to measure. Needs the confirm actually triggered |
| **Pinning** — heading + selection indicator fixed while the thread scrolls | Needs scroll interaction, not a static read |
| **Full detent (760)** | Only Peek (94) and Half (408) appeared in the states reached |
| **The 52px mobile header** | Not present on `/generation`; may be route-specific rather than missing |
| **Documents · Data Room · Wallet · Account** screen-by-screen against Figma nodes | Radius and DM Mono were sampled across them; full per-frame geometry was not |
| **Onboarding (`184:3`)** | Untouched — it is the reference for the *centre* rhythm and out of scope for this pass |
| **The three budget states in situ** | `useEditBudget` / `EditEdgePrompt` are not mounted (§6), so States 1–3 cannot render |
| Whether the other `12.5/13.5px` hits are legitimate | Many are card titles and report internals where 12.5 is correct; blanket-flagging would be noise |
| `#d6d4cf` report-rule | Not in the token layer; may live in `reader.css` |

**Now verified that previously were not:** every rendered measurement listed in passes 2–3 · the conversation column at both breakpoints · drawer detents 94/408 · radius-12 discipline · DM Mono actually rendering (and at what weight).

---

*Pass 1, code-side, 2026-08-20. Send the localhost URL and I run Layer C with measured values.*
