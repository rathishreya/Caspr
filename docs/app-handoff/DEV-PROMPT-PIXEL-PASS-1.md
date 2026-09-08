> ✅ **APPLIED AND CLOSED 2026-08-20** — commits `3f59701` + `92c5144`, verified in-browser (see `DEV-RESPONSE-PIXEL-PASS-1.md`).
> **Findings 7, 11, and 9's load-failure *mechanism* are WITHDRAWN** — the audit was run signed out, and the rail / bottom nav / mobile header are session-gated. The DM Mono **weight** finding was real and is fixed.
> **Work from the next round: [`DEV-PROMPT-PIXEL-PASS-2.md`](DEV-PROMPT-PIXEL-PASS-2.md).**

# Dev prompt — pixel audit pass 1

Design session audited commit `08b9d38` against Figma `y2F394I4CwEeSzH2kKuDCt` and [`DEV-BRIEF.md`](DEV-BRIEF.md). Full findings: [`PIXEL-AUDIT-FINDINGS-2026-08-20.md`](PIXEL-AUDIT-FINDINGS-2026-08-20.md).

**Verdict: the build is substantially faithful.** The token layer, `ProductVoice.tsx`, the credit model and the top-up presets are all correct — `ProductVoice.tsx` in particular is a near-exact implementation, including `textIndent` on the first line only rather than a list. Four fixes, one deletion, one question.

**Two of the four fixes were our fault, not yours. Figma has already been corrected — pull the file before you start.**

---

## 1 · Fix — mobile Edit · Visual missed the conversation sweep

`apps/web/src/features/reader/CompactEditVisual.tsx` did not get the treatment its desktop sibling did.

**a) The connector is still the retired caps label** (≈line 177–182):

```tsx
<p className="... text-[10.5px] font-semibold ... text-placeholder"
   style={{ top: 228 + shift, letterSpacing: '0.84px' }}>
  OR JUST ASK
</p>
```

Replace with the product voice, as `EditChartPane.tsx` already does:

```tsx
<OrLabel top={228 + shift}>Or just ask</OrLabel>
```

Sentence case, italic 13/19, with the 7px mark. `DEV-BRIEF` §2.2: it scrolls, so it is speech, not a label. The caps treatment is explicitly retired (§10).

**b) Caspr's message is 12.5px** (≈line 145–150): `text-[12.5px] leading-[normal]` → **`text-[13px] leading-[19px]`**, and the colour per item 2 below.

## 2 · Fix — off-ramp ink for Caspr in the Edit panes

`index.css:149` defines `--color-edit-body: #2a2927`, used on **6** message nodes across `EditChartPane`, `EditInfographicPane`, `EditPane`, `EditVisualPane`, `CompactEditVisual`.

**Delete the token; use `text-ink` (`#1a1a17`).** `DEV-BRIEF` §2.4 gives Caspr's nudge exactly one ink, and §1.1's ramp has no `#2a2927` — it is a second near-black, the drift `FIGMA-FINAL-ALIGNMENT` §1.1 exists to kill. Figma already reads `#1a1a17` on those nodes.

## 3 · Fix — user bubble: **Figma was wrong, and is now fixed**

`Conversation.tsx:90` renders the bubble at 13/16 on mobile and **12.5/15 on desktop** via `shell:` variants:

```tsx
... text-[13px] leading-[16px] text-ink shell:text-[12.5px] shell:leading-[15px]
```

**You built this correctly from the file.** Figma genuinely showed 12.5 on the Gate and Layout Canvas desktop frames, and `#0a0a0a` on the Ask-Caspr bubbles — the design session's normalisation pass missed them. That has now been corrected: **all 40 bubbles are 13 / `#1a1a17`**, mobile and desktop alike.

**Action: drop the `shell:` overrides.** One value everywhere:

```tsx
... text-[13px] leading-[16px] text-ink
```

Italic stays where the bubble echoes a tapped option (selection echo) — that part is right.

## 4 · Fix — desktop edge-prompt title: **you were right, our frame was wrong**

`EditEdgePrompt.tsx` renders the title in **Instrument Serif** — correct. `design-guidelines.md` §140 reserves serif titles for confirm surfaces derived from desktop modals, and the canonical confirms are Instrument Serif (`2206:3041` mobile 24 · `2195:3029` desktop 30). Our reference frame had used Inter Semi Bold 16, which was our error; it is now serif.

**One residual — the desktop size.** You have **26**; Figma is now **24 / lh30**.

```tsx
// desktop branch
<p className="font-serif text-[24px] leading-[30px] text-ink">Top up to keep editing</p>
```

24 rather than the canonical 30 because our desktop edge-prompt is a **pane-scoped dialog (336 wide)**, not the 400-wide centred modal — the scale follows the container. Mobile stays **24**, which you already have.

---

## 5 · Delete — the "running low" helper is dead code

`features/wallet/editCredits.ts:180` — `allowanceNote()` returns *"Running low on this report's included edits."* at ≤15%.

**Delete the function and its test.** We traced it first: it has **zero callers** — only its own test references it, and `useEditBudget` imports `CROSSING_LINE` but not this. So nothing renders it and there is no user-visible difference either way.

No current spec asks for it: `DEV-BRIEF` §3.3 defines **three** states with State 1 (bundled) **silent**, and `EDIT-ECONOMICS.md` §2 says no persistent budget chrome. The phrase did exist in an earlier EDIT-ECONOMICS draft, removed on 2026-08-19 when the model went conversational — very likely the version you were working from, so this is a spec-moved-under-you problem, not a mistake.

Removing it is about not leaving a helper that contradicts the spec lying around for someone to wire up later assuming it was approved. **If a pre-wall warning is wanted** — and it may well be the better experience — it should be decided, written into the brief, and then built deliberately.

## 5b · Question — is the edit-credit path mid-wiring?

Not filed as a defect, but it bounds what we could check. These have **no external references** anywhere in `apps/web/src`, and there is no barrel file re-exporting them:

`useEditBudget` · `EditEdgePrompt` · `TopUpModal` · `WalletBadge` — all **0**.

The Wallet screen itself *is* wired (`useWallet`, `ActivityList`, `BudgetPace`, `PlansDrawer`, `BillingModal` all have live consumers). So the wallet renders, but the **top-up flow and the three budget states do not** — which means States 1–3 could not be verified beyond their pure functions.

**Is this simply the next commit?** The proxy APIs only just landed, so mid-wiring is the obvious explanation and there may be nothing to do. Just confirm, so we know whether to re-audit or wait.

---

---

# Added after the rendered pass (localhost:5173, 1440×900)

Two CRITICALs that only the running app could reveal — both invisible in code review.

## 8 · CRITICAL — the 64px desktop rail is not rendered

The desktop shell renders as **`aside` 390 @ x0 + `section` 1050 @ x390**. There is no rail: the `Analyses` / `Documents` labels are absent from the DOM, and `Insights` / `Data Room` exist only in the hidden mobile nav.

Verified on `/generation`, `/documents`, `/gate`, `/theater`, `/report/chart`, `/layout/learning` — `main` is `x=0, w=1440` on every one.

`--spacing-rail: 64px` is defined in `index.css:199` but nothing lays out against it. **Every desktop frame in Figma carries `Rail — v3 (slim)` at x0 w64** — checked on `775:2`, `692:2`, `708:2`, `762:2`, `1131:2455`, `810:2147`, `2186:4565`.

**Effect:** the whole desktop shell sits 64px left of spec. The conversation column lands at **x=16** (or 24 on `/layout/learning`) instead of **80**, and the centre column shifts with it. The internal spacing is correct — it is the shell offset that is wrong, so this single fix should bring a lot back into line at once.

**This is the highest-impact item in the audit.** Worth doing first.

## 9 · CRITICAL — figures are DM Mono **Regular**, spec is **Medium**

`DEV-BRIEF` §1.5 and the seven-check sweep: **"DM Mono Medium — every figure."**

On `/wallet`, **13 of 13** mono elements compute to `font-weight: 400`. In code, **66** `font-mono` usages but only **5** paired with `font-medium`.

**And a second, related problem:** the DM Mono **500 latin face fails to load** — `FontFace.load()` returns `NetworkError` for the `U+0-FF` subset, which is exactly where digits, `$`, `,` and `.` live. The latin-**ext** 500 face and both 400 faces load fine, and the file itself fetches `200` as a valid `wOF2` (14,988 bytes) — so it is not a missing asset. Net effect: even the 5 elements that already ask for Medium would fall back.

Please add the weight **and** get to the bottom of the 500-face failure — adding `font-medium` alone will not fix the rendering while that face errors. *(Observed in our audit browser; sanity-check it in a normal browser first, in case the environment is a factor.)*

## 9b · CRITICAL — mobile bottom nav is a nav-height too high, and 2px too tall

| | Expected | Measured |
|---|---|---|
| Height | **56** (`--spacing-mobile-nav`) | **58** (`class="flex h-[58px] …"`) |
| Position | **y 788 → 844** | **y 730 → 788** |

Figma has `Bottom Nav — v3` at **y=788, h=56** (`1422:2`). The build ends the nav *at* 788 instead of starting it there, leaving **788–844 empty** and the nav floating above the bottom of the screen.

The token `--spacing-mobile-nav-top: 788px` is commented *"drawers rise to here, never to 844"* — 788 is the nav's **top** edge, not its bottom. Easy misread; the comment could have been clearer.

## 9c · CRITICAL — drawers have no top border

Every drawer measures `border-top-width: 0px`. `DEV-BRIEF` §1.4: **one border across all three detents — top edge only, `#e0ded9`, 1px, other sides 0**, via per-side stroke weights rather than a separate line node. The reason it is one border across all three: *a border that changes mid-swipe reads as a disruption.*

Fix: `border-top: 1px solid var(--color-drawer-edge)` on the drawer surface.

## 10 · Minor — clarifying-question line-height

Question text renders **13/18**; Figma is now **19**. Position is already correct (`x=100, w=338`).

---

## 6 · Verified correct — no action

**Mobile passes too:** the product voice is exact at 390×844 as well (column `x=16, w=358`, dot `7.0px @ dx 0`, indent 18 / 0 on the continuation) · drawer detents **94 and 408** both correct with `20px 20px 0 0` top corners · dark title card 58 · and **zero** elements use `border-radius: 12px` outside overlays across `/documents`, `/wallet` and `/account/delete` — ruling B2 is genuinely honoured, which is usually the first thing to rot.

**`ProductVoice.tsx` is exact — measured, not assumed.** italic 13/19 · quiet `rgb(92,91,88)` · engaging `rgb(52,51,47)` · dot `7.0×7.0`, 1px stroke `rgb(138,136,127)`, transparent fill, at `dx 0 / dy 6` · `text-indent: 18px` on the first line only · continuation with no dot and `text-indent: 0` · phase marker = 358 hairline + 12px gap · **zero `<ul>` in the pane**. That is every rule in §2.1 honoured, including the two easiest to get wrong. Also measured correct: column `w=358` sharing the prompt bar's left edge, Caspr reply `#5c5b58` / nudge `#1a1a17` at 13/19, pane heading 14/17 `#474642`.

Worth knowing what not to touch: all three fonts self-hosted (no CDN) · the four newest tokens exact · grey ramp clean, The Signal's cool greys correctly kept separate · `credit-green` reserved for signed amounts **and** Insights' rising delta re-pointed to it, killing the `#2e7d33` second green · radius scale exact including ruling B2 · 66 `font-mono` usages · `prefers-reduced-motion` honoured globally and on both custom animations · `INCLUDED_CREDITS` 15,000 / 80,000 / 300,000 **with a test** · `TOP_UP_PRESETS = [20, 50, 100]` · crossing-line copy verbatim · no trace of the retired revision model in the UI.

---

## 7 · Still to come

This pass was **code-side only**. Rendered measurement — computed colours, actual gaps, the pinned-heading behaviour, drawer detents, and the Documents / Data Room / Wallet / Onboarding screens — needs the app running. **Send the localhost URL** and the design session runs Layer C with measured values rather than inference.

Helpfully, `app/router.tsx` already exposes explicit state routes — `/documents/empty`, `/documents/no-results`, `/documents/loading`, `/data-room/uploading`, `/data-room/empty`, `/data-room/no-results` — so those states are directly addressable and need no fixtures. If equivalents exist (or are easy to add) for the **Generation** states (`failed`, `Contact support`, `Creating`) and the **Gate** variants, say so — otherwise they get logged as unverified rather than passed.

*Design session · 2026-08-20. Reply in the usual shape — a table of what changed, with node ids, and your own calls marked as calls.*
