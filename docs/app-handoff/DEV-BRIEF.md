# Caspr app — dev brief (single consolidated source)

**Current as of 2026-08-19.** Figma `y2F394I4CwEeSzH2kKuDCt`. This is the **one brief** for the dev session — it replaces the round-by-round chain. Where it and an older doc disagree, **this wins**; §10 lists what is superseded.

**How to use it:** §1–§3 are the systems (design, conversation, economics) — read them once, they govern everything. §4 is what's built and buildable. §5 draws the product/API line. §6 is Figma process. §7–§9 are status, open items and supersessions.

---

## 0 · Authority map — the living specs

This brief indexes; these files are the authority and are kept current.

| Topic | Authority |
|---|---|
| Edit economics (model) | [`EDIT-ECONOMICS.md`](EDIT-ECONOMICS.md) |
| Edit credits × wallet (build brief) | [`EDIT-CREDITS-WALLET-DEV-NOTES.md`](EDIT-CREDITS-WALLET-DEV-NOTES.md) |
| Pricing / billing | [`../../.agents/pricing-model.md`](../../.agents/pricing-model.md) §4.6 · §8.3 · §14 |
| Gate + output generation | [`../product/gate-output-spec.md`](../product/gate-output-spec.md) |
| Wallet & account screens | [`../product/account-wallet-screens.md`](../product/account-wallet-screens.md) |
| Visual metering (charts vs generation) | [`../product/visualization-library.md`](../product/visualization-library.md) §6–§7.5 |
| Shell, detents, the two voices | [`../product/app-shell-framework.md`](../product/app-shell-framework.md) §5–§6 |
| UI system + conversation grammar | [`../product/design-guidelines.md`](../product/design-guidelines.md) §11.0 · §11.0b · §11 · §12 |
| Product-voice **copy register** | [`VOICE-PRODUCT-CONVERSATION.md`](VOICE-PRODUCT-CONVERSATION.md) |
| Theater / source decode | [`THEATER-SOURCE-DECODE-MOTION.md`](THEATER-SOURCE-DECODE-MOTION.md) |
| Sample reports | [`SAMPLE-REPORTS.md`](SAMPLE-REPORTS.md) |
| API contract | [`API-CONTRACT-REVISION-2026-08-18.md`](API-CONTRACT-REVISION-2026-08-18.md) |
| Prompt/question engine | [`PROMPT-QUESTION-ENGINE.md`](PROMPT-QUESTION-ENGINE.md) |
| Onboarding / first-run behaviour | [`../product/onboarding-understanding.md`](../product/onboarding-understanding.md) |
| First-run ICP prompt content | [`../product/onboarding-placeholder-prompts.md`](../product/onboarding-placeholder-prompts.md) |
| Text contrast · responsive model | [`../product/design-guidelines.md`](../product/design-guidelines.md) §1 · §10a · §10b |
| Focus, keyboard, target sizes | [`../product/focus-keyboard-spec.md`](../product/focus-keyboard-spec.md) |
| AI disclosure (EU AI Act art. 50) | [`../product/ai-disclosure-spec.md`](../product/ai-disclosure-spec.md) |
| Accessibility / conventions response | [`DESIGN-INPUTS-RESPONSE.md`](DESIGN-INPUTS-RESPONSE.md) |
| **Current dev prompt** | [`DEV-PROMPT-ROUND-4.md`](DEV-PROMPT-ROUND-4.md) — wordmark SVG, header type, auth card |
| Previous dev prompt | [`DEV-PROMPT-ROUND-3.md`](DEV-PROMPT-ROUND-3.md) — structure, spacing scale, corrected shell CSS |
| Entry routes · CTA · canonical header/footer | [`../entry-routes-and-cta.md`](../entry-routes-and-cta.md) §3 · §3.1 · §3.2 · §3.3 |
| Spacing scale · Auto Layout technique | [`../product/design-guidelines.md`](../product/design-guidelines.md) §9 |
| **Phase map — what ships when** | [`../product/phase-map.md`](../product/phase-map.md) — supersedes scattered "Phase 2" markers |

---

## 1 · The locked design system

### 1.1 Colour

**Text (warm greys — one token per role):** `text/primary` `#1a1a17` · `report-body` `#333330` (deliberately darker) · `text/secondary` `#5c5b58` · `report-grey-mid` `#6b6b66` · **`text/label` `#474642`** (eyebrows, overlines, section & pane headings) · `grey-650` `#8a8a85` · `text/tertiary` `#9c9b98` · `text/disabled` `#a5a29d` · `signal/label` `#6b6a78` + `signal/secondary` `#8b8a96` (**The Signal only** — cool on purpose, never warm-merge) · pending grey `#b8b5b0`.

**Hairlines:** `border` `#e2e1de` · `divider` `#e0ded9` · `rule-light` `#ececea` · `report-rule` `#d6d4cf`.

**Fills:** `fill/skeleton` `#e5e5e3` (skeletons + unfilled progress track) · `fill/chip` `#ededeb` (light chips, DEFAULT chip, PUBLIC pills).

**Brand:** `accent` `#e8453c` — the one brand colour: CTAs, links, selected states **and feature ticks** · `accent-pressed` `#be3530` · `credit-green` `#1a7f4b` — **signed ledger amounts only** (`+$X`), never a tick or status.

**Dark surfaces:** dark title/cover bars `#0b0b09`, height **58**, radius **0**.

**Token layer to carry:** `--color-fill-track` `#e5e5e3` · `--color-fill-chip` `#ededeb` · `--color-text-label` `#474642` · `--color-accent-pressed` `#be3530`.

### 1.2 Radius

**0** documents, dark cover/title bars, full-bleed bands, dividers, rules · **2** *all* functional chrome **and** content/layout cards (buttons, inputs, search, tags, selectors, hover states, notification + section cards) · **12** overlay surfaces only (modals, confirmation cards, popovers) · **20** drawer top corners · *off-scale* pills, progress bars, pager dots, toggles, glyphs.

### 1.3 Scrims

Mobile `rgba(0,0,0,0.42)`, **y52 h736** — below the brand bar, stopping at the bottom-nav top (788). Desktop full-viewport. **A mobile drawer gets a scrim ⟺ its desktop counterpart is a scrimmed modal**; working-surface drawers do not dim. Node named `Scrim`. Discriminate scrims from chrome by **z-index** (scrims z12–17, dark title bars z1), never by colour.

### 1.4 Drawers

**Three detents only:** peek **94** / half **408** / full **760**. No content-sized heights. **One border across all three** — top edge only, `#e0ded9`, `strokeTopWeight 1`, others 0, align INSIDE (per-side weights, not a line node). Handle 44×5, r2.5, y12, `#c7c4bf`. Top corners r20 + top drop-shadow. Master `Drawer — v3 (white)` `628:5`; Full variant `1706:2`.

> **The nav stays visible at EVERY detent, Full included** — a Full card sits *above* the nav. The nav recedes in only two places: **document read-mode** (tap the document; header + nav fade) and the **Theatre**. *(Corrects an earlier draft that said Full hides the nav.)*

### 1.5 Typography

**Instrument Serif** — display/brand only (headings, greeting, report titles, wordmark); never wayfinding. **Inter** — all UI. **DM Mono Medium** — **every figure** (prices, balances, counts, data points); a stray Inter on a number is the easy miss. **Body copy is always `textAutoResize: HEIGHT`.**

### 1.6 The seven-check sweep (run per page)

1. Every desktop state has a 390 sibling (empty / loading / error / no-results are the forgotten ones) · 2. Body copy auto-height · 3. Radius per §1.2 · 4. Greys on the ramp, fills on `fill/*`, no hand-typed hex · 5. Scrims named, 42%, correct geometry · 6. Figures in DM Mono Medium · 7. Mobile drawers on one of the three detents with the single top border.

### 1.7 Deliberate exceptions — do not "fix"

`#b8b5b0` pending grey · The Signal's cool greys · `credit-green` on signed ledger amounts · the full-screen composer drawer covering the nav (it's a full surface, not a scrimmed drawer).

---

## 2 · The conversation system

### 2.1 Two voices

| | **Caspr — the analyst** | **The Product — the app** |
|---|---|---|
| Covers | proposals, clarifying questions, Ask-Caspr answers | the relationship / get-to-know module during busy phases, status narration, account & state events |
| Type | **upright Inter 13 / lh19** — nudge (directive) ink `#1a1a17`, reply (conversational) grey `#5c5b58` | **italic Inter 13 / lh19 + a 7px grey outline dot** (`#8a887f`) leading the line — engaging warm `#34332f`, quiet muted `#5c5b58` |
| Source | **Jayant's API** — the frames hold *samples*, never copy to hardcode | **product-side strings** |

**Four rules:**
1. **No separate "notification" style.** Status (*"Initiating sourcing stage"*) is the **quiet mode** of the product voice. There is no third treatment.
2. **The dot is inline, NOT a bullet — no hanging indent.** Wrapped lines and further paragraphs of the same turn run **flush to the content left edge**. Figma: full-column text with `paragraphIndent = 18` on the first line; continuations `0`. In CSS it's an inline marker — **do not build a `<ul>`**.
3. **One mark per turn, not per line.**
4. **The red ● is reserved for citations / Ask-Caspr.** Never the product-voice mark.

**Phase markers use the same voice** — `Initiating sourcing stage` · `Generating the report` · `Creating outputs` · `Report generated · 13 Jul` are **a full-width hairline, then the product-voice line beneath it**, left-aligned, sentence case. *(Retires the centred-caps-between-hairlines label.)*

**Alignment:** Caspr and the Product are **always left-aligned**, full column width, un-bubbled. **Only the user is right-aligned**, in a hug-width bordered bubble. Nothing else sits right.

### 2.2 Four text families — decided by ONE test: *does it scroll?*

| Family | Test | Treatment |
|---|---|---|
| **Pinned chrome** | stays put while the thread scrolls | pane/drawer heading (Inter Semi Bold 14 caps `#474642`) + **selection indicator**. `EDIT`, `ASK CASPR`, `WHILE CASPR WORKS`, `BEFORE CASPR WRITES` are **headings, not voice** |
| **In-thread speech** | scrolls, and could be said aloud | Caspr / Product per §2.1 |
| **In-thread control label** | scrolls, but names a control group | small caps — `COVER OPTIONS`, `AMOUNT`, `REGARDING`, `SUBJECT` |
| **Meta / data** | not conversation | title eyebrows, `FIGURE 1`, `01`–`05`, `SOURCES REVIEWED`, `%` |

Consequence: `Or just ask` · `Or steer by intent` · `Preparing your questions` scroll away, so they are **speech** → product voice, quiet, sentence case, **with the dot**.

**Pinning:** pin the **heading + selection indicator**; **everything else scrolls** — proposal cards, intent pills, connectors, chips, `COVER OPTIONS`. Cards are *an answer* (regenerated on request), not a control; pinning ~210px of them would consume the mobile Half drawer. *(If persistent controls are wanted, use the slim `Chart type · Style · Data` row — designed, currently hidden — not the cards.)*

### 2.3 The Edit surface is a conversation, not a panel

Per `app-shell-framework.md` §5–6, the Edit drawer/pane is the **same Work-Card thread** as Ask Caspr. Proposal cards, intent pills and *"Or just ask"* are **turn-1 content**: as the user steers and Caspr replies the thread grows, earlier turns **scroll up**, and the drawer grows **Half → Full**. The **docked input is pinned** (mobile drawer-relative y=314 — hard rule). *(Get-to-know stays a swipe carousel — a distinct pattern.)*

### 2.4 Type + rhythm (canonical)

| Role | Value |
|---|---|
| Caspr nudge / reply | Inter Regular **13 / lh19** · `#1a1a17` / `#5c5b58` |
| Product engaging / quiet | Inter **Italic 13 / lh19** · `#34332f` / `#5c5b58` + 7px dot |
| User bubble | Inter **13** · `#1a1a17` — **Regular when typed**, **Italic when it echoes a tapped option/poll** |
| Numbered question | number at column left; text indented **+20**; 13 / lh19 |
| Conversation column | **x = 80 desktop / 16 mobile, width 358** — shares one left edge with the prompt bar |

**Gaps:** heading → first message **16** · between turns **16** in the pane/drawer (**24 only where the conversation owns the 800px centre**, i.e. onboarding compose) · paragraphs inside one message **8** · message → its card/pill/chip stack or list **12** · between stack/list items **8** · hairline → phase-marker line **12**.

> **The turn gap follows the container, not the breakpoint.** The desktop pane is exactly as wide as the whole mobile shell, so it takes the compact rhythm.

**Italic is exclusive** to the product voice and to selection echoes in bubbles. Gate parameter values (`English (UK)`, `Investor`, `PDF, PPTX, XLSX, MD`) and the Ask citation scope line are **data → Regular**.

---

## 3 · Economics

### 3.1 Edit credits

**The visual-revision count model is RETIRED** — Brief 2 · Study 10 · Intelligence 25, the `$5 per 10` top-up and the `↻ x/10` counter are gone. Do not build them.

- Metered in **edit credits, included per analysis: Brief 15,000 · Study 80,000 · Intelligence 300,000.** A benefit, not a fee.
- **Minor** edits (inline — reword, reorder, re-emphasize, re-plot a chart) are **free, unlimited, show 0 credits**. **Substantial** (a regeneration) draws credits. **New** (identity change: subject, industry, geography, analysis type) = a fresh analysis.
- **Charts and templated infographics are always free.** Only a model generation draws credits (≈500 credits ≈ $0.50; ≈1,000 credits ≈ $1).
- **Margin is not product-side** — Jayant's API returns **already-marked-up** counts; record and charge as-is.

### 3.2 Wallet = money · Ledger = utilization

- **One balance, in dollars.** No token bucket, no second currency, no per-item buckets.
- The report's **free allowance is report-scoped**, spent first, shown **in the Edit context only** — never in the Wallet.
- **Overflow draws the same Research Budget / Paid Analysis Balance** as analyses and outputs.
- **Edit charges roll up per report** — one ledger line, `Edits · [report]` · date · −$X. Not per regeneration.
- **Buying more = the existing Wallet top-up.** One mechanism for analyses + outputs + edits; **no separate "buy credits" flow**.
- **Top-up dialog:** presets **$20 / $50 / $100 + Custom**, **user's tier pre-selected** (Professional $20 · Business $50 · Enterprise $100); custom stepper **$10 minimum, $10 increments**; adds to the existing balance; no platform fee; does not change the authorised budget or milestone. Frames: `1854:2` / `1857:2`, custom `1887:2` / `1888:2`.

### 3.3 The three budget states — no persistent chrome

| State | What's happening | How it surfaces |
|---|---|---|
| **1 · Bundled** | drawing included credits | **silent** |
| **2 · On budget** | included spent → drawing the money balance | **a product-voice quiet line in the thread**: *"That's used up this report's included edits — I'll draw further edits from your budget from here."* Refs `2304:5072` / `2309:5354` |
| **3 · Out** | balance can't cover the next edit | the **edge-prompt** |

**Edge-prompt** — built on the **established confirm pattern** (reset/delete confirms), never bespoke: title *"Top up to keep editing"*, **one** primary `Top up` (→ Wallet top-up) + a **`Not now` text link** beneath. **The system has no two-button format — do not invent one.**
- Desktop `2306:5213` — **pane-scoped scrim** (`x63 w391 h900`; report/centre stays lit, as gate/tier-change) + pane dialog.
- Mobile `2310:5470` — **scrim y52→788 so the nav stays lit** + `Drawer — v3 (white) · Half` `628:5` at y380. The `Button — Generate` instance must use its **native 358 width at x=16** — its label is anchored 358 wide, so a 342 instance renders ~8px off-centre.

### 3.4 Outputs & gate

Per-output, **value-priced, no quota and no pack**. Base = the tier's committed set in the user's working language (**Brief PDF·MD**; Study/Intelligence PDF·PPTX·XLSX·CSV·MD), generated **natively in that language**. Charged beyond base: PDF/DOCX/XLSX/CSV **$5** · PPTX **$10** · MD free · each additional language = one output. Prices **sum in red into the Generate button**. Authority: `gate-output-spec.md` + `pricing-model.md` §4.6-B.

---

## 4 · Product areas — built and buildable

### 4.1 Item management / multi-select

One mechanism on **Documents** and **Data Room**, desktop + mobile. Every item carries an **always-visible right-aligned checkbox** (no hover-reveal — must work on touch): Documents cover cards use **checkbox-on-dark** top-right (`2226:2681`); Data Room rows use **checkbox-light** (`2240:169`); checked state reuses `1760:70`. **Select-all** sits top-right in the same column. **Selecting ≥1 swaps the filter row for an action toolbar** — desktop bordered buttons, mobile glyph-over-label (**never take over the title bar**). Body-click opens; only the checkbox selects.

| Surface | Toolbar (destructive last) |
|---|---|
| Documents | Add to Data Room · Export · Archive · Rename\* · **Delete** |
| Data Room | Include · Exclude · Make private/public\*\* · **Delete** |

\* one item only · \*\* mixed selection shows both toggles. **Add to Data Room** adds reports as sources — **Included by default, Private**. **Data Room has no Archive** — Exclude is its declutter (intentional asymmetry).

**Frames** — idle (live screens): Documents `843:89` / `1280:196`, Data Room `1756:2` / `1766:2`. Selection: `2229:2680` / `2256:2868`, `2242:2777` / `2258:2927`.
**Glyphs** (all stroke `#5C5B58`): add-to-dataroom `2223:184` · archive `2223:174` · restore `2265:173` · trash/pencil/eye/eye-off `2228:173` / `177` / `181` / `187` · lock `2245:172` (**not** `157:153`, which is a red status blob) · export `926:2497`. Toolbar buttons: bordered, icon 15px + Inter 12.5, border `0.5px #d6d4cd`; **Delete red `#E8453C`**. Mobile: icon 22px over Inter 9.5.

**Build in code:** the **"Select all N"** escape hatch for the whole library (Gmail pattern) — select-all currently scopes to the filtered view.

### 4.2 Archive — a third lifecycle state

Reports are **Active / Archived / Deleted**. "Archived" sits at the **foot of the Documents filter rail** (`843:243`) below GEOGRAPHY. Archived view: desktop `2266:3233` / mobile `2268:3321` — grid retitled `Archived`, toolbar reduced to **Restore + Delete**. **Mobile route:** a **Filters bottom-sheet** (`2271:3373`) listing the categories with Archived at the foot. Empty state: `2273:3425` / `2274:13877`, CTA repurposed to **"Back to your library"**. **Data Room needs no archive.**
**Build in code:** wiring the `+3` pill (or a filter icon) to open the Filters sheet; single-delete on mobile.

### 4.3 Delete confirms & scoped resets

Single names the item, bulk uses a live count; all reuse existing confirm patterns.

| Confirm | Node |
|---|---|
| Documents bulk | `2199:12923` / `2207:2629` — parameterize N; select-all → "Delete all 2,847 documents?" |
| Documents single | `2264:3003` (desktop; mobile follows the same sheet) |
| Data Room bulk | `2264:13646` / `2264:13822` — inherits **Move to Excluded** (primary) / **Delete permanently** (secondary) |
| Data Room single | `1775:2` / `1784:290` (unchanged) |

**Account-level "Reset account" is removed entirely** (zero occurrences remain). **Delete Account stays** (legal/GDPR). Three **scoped** destructive actions instead, each a bottom danger row + scrimmed confirm:

| Action | Row (desktop / mobile) | Confirm |
|---|---|---|
| Reset research profile | `1736:135` / `1680:26` | `2195:2927` / `2206:3001` |
| Reset Data Room | `1756:4` / `1766:2` | `2199:12745` / `2206:5607` |
| Delete all documents | `843:164` / `1280:196` | `2199:12923` / `2207:2629` |

Domain mapping: **Documents** = generated reports · **Data Room** = uploaded/connected sources · **Research Profile** = learned memories.

### 4.4 Status spine & the Creating cutoff

The spine `Learning → Analyzing → Generating → Creating` lives **in the report-title eyebrow only**. In the thread it is narrated **conversationally, never as a progress bar** (Joy rejected the progress row): phase markers per §2.1, the user's mid-run answers as an **italic reply bubble** (selection echo), Caspr's mid-run notes as product-voice statements. Frames: Generation `775:2` / `777:83`; **Creating cutoff** `2186:4565` / `2187:4708` — eyebrow → `… · CREATING`, poll removed, `Creating outputs` marker + *"Finalizing your outputs — new requests will apply to the next version."* **Routing:** pre-Creating edits fold into v1; post-Creating requests queue to v2.

### 4.5 Theater

**No queued screen — do not draw or build one.** Capacity is confirmed near-immediate (theater 5–30s then streaming); remove the position counter and the queued centre. Keep only a rare **async fallback** — *"At capacity — we'll notify you when it starts"*, **never a position number**. The decode churn is the **Caspr alphabet**, an original 36-glyph cipher (`2104:168`, `caspr-alpha/<char>`, viewBox 24, stroke 1.8, round caps) — because it's original the cultural-validation gate is **dissolved**; build when ready. The `prefers-reduced-motion` path (plain source names appearing) ships regardless. Spec: `THEATER-SOURCE-DECODE-MOTION.md`.

### 4.6 Edit-pane chart marks

Nine `thumb/<kind>` marks drawn beside the existing three at **`2123:4416`**: grouped-bar · column · line · area · multi-line · treemap · scatter · bubble · quadrant. 76×46, r2, `#e2e1de` border, `#faf9f7` bg; series `#cbcac6` / `#57564f` / `#e8453c`, ≤1 accent per thumb, no axes/labels. `column-by-region` / `treemap-region` / `stacked-region` reuse `column` / `treemap`. **Every intent now has a mark — no code change needed.**

### 4.7 Sample reports

Build the **mechanism** now, content post-launch: a `sample` tag + `sampleId` + per-user archive/delete state that survives re-seeding; an idempotent seeding job. Samples ride the existing library/reader/Ask/Edit/Outputs paths with two specials — a `Sample` label and **free, non-persistent edits**. Does not block the core build. Spec: `SAMPLE-REPORTS.md`.

---

## 5 · Product-side vs Jayant's API

**Product-side owns:**
- The **edit-credit ledger** (per-report bundled allowance → then the money balance).
- **Deciding when the State-2 crossing line fires and injecting it** into the conversation.
- **Deciding when the edge-prompt fires.**
- Minor / Substantial / New **classification**, against the rules in `EDIT-ECONOMICS.md`.
- Balance, billing, top-ups, milestones.

**Jayant's API owns:**
- All **Caspr dialogue** (the frames hold samples, never hardcode them).
- **Already-marked-up credit counts** per generation.
- The **output-generation API** — the product never renders the final deliverable.
- The analysis itself and the source stream.

---

## 6 · Figma process rules (learned the hard way)

- `await figma.setCurrentPageAsync(page)` before any sweep — page context resets on every call.
- **A `use_figma` call that throws rolls back every edit in that call** — guard (`if ("cornerRadius" in n)`) and split batches.
- **`findAll(TEXT)` skips INSTANCE children** — eyebrow/title-bar text on mobile frames is an instance override; fetch by node id.
- **Never create a component inside a screen frame** — cloning the screen clones the component and instances point at the stale copy.
- Re-read nodes after edits; screenshot-verify layout-sensitive frames.
- **The drawer always occludes the selection pulse** — z-order the pulse below the drawer (fixed on `1422:2`).

---

## 7 · Per-page status

| Page | State |
|---|---|
| `184:4` **Documents** | ✅ converged — spot-check only |
| `184:5` **Profile & Wallet** | ✅ converged; top-up frames updated to the new presets |
| `184:2` **Report Creation** | ✅ conversation system + rhythm applied 2026-08-19; verify radius per §1.2, scrims, DM Mono on figures |
| `184:3` **Onboarding** | 🟡 the reference for the **centre** rhythm (24px turn gap) — untouched by the 2026-08-19 pass; verify auth-card radius, auto-height, overlay scrims |
| `184:6` **Insights** | 🔴 not built — full build, not a sweep. Retire greys `#0f0e0d` `#deddda` `#e9e8e6` `#e6e5e2` `#0a0605`; stray green `#2e7d33` → accent; off-scale radii `1246:124–129`, `1253:121–139`. Draw the 390 siblings as you go. Phase 2 / coming-soon |
| `🧩 Components — Core` | 🟡 confirm masters carry locked values so instances inherit |
| `🎨 Tokens & Variables` | 🟡 add the four §1.1 variables; drop wide-grey swatches |

---

## 8 · Open items

**Joy:**
- Documents-desktop **Select-all placement** — leave at the shared far-right x (762), or rework the toolbar to free the last card column?
- **Copy voice pass** on the get-to-know lines — they read in Caspr's first person (*"while I work"*); now product voice, run against `VOICE-PRODUCT-CONVERSATION.md`. *(Sample content — not a blocker.)*

**Jayant:**
- **Cost per edit credit** — validates the rate (≈1,000 ≈ $1) and the tier allowances.
- **Refresh ratio** — same-scope refresh set at **50%**, new-scope / tier-change at full, priced at the gate. Confirm 50% is defensible.
- **Capacity** — no queue confirmed; flag if load ever breaks near-immediate start so we wire the async fallback.
- Per-generation cost of a **bespoke image vs infographic** (post token-cap).

**Not yet drawn:**
- Per-report **edit ledger line** in the Wallet from real data (row pattern exists; sample omitted to avoid inconsistent totals).
- The **"From balance"** intermediate budget state (States 1 and 3 are drawn).

**Accepted, not bugs:** three mobile drawers clip at the pinned input (`Ask Caspr — Mobile`, `Generation — Mobile · Creating`, the State-2 ref) — the thread is longer than a Half drawer holds and clips cleanly, which is what scrolling does. **Joy reviewed: leave as-is, do not switch to Full detent.**

---

## 9 · Suggested build order

1. **Selection system** — checkboxes, select-all, pills→toolbar swap, both surfaces + mobile.
2. **Delete flow** — single (named) + bulk (counted) + the select-all N escape hatch.
3. **Archive lifecycle** — state, view, rail entry, Restore, mobile Filters sheet.
4. **Add to Data Room** — report → source (Included + Private).
5. **Conversation system** — the two voices, four text families, pinning, type + rhythm (§2). This touches every pane and drawer, so land it before the surfaces multiply.
6. **Edit credits + wallet** — ledger, states, edge-prompt, top-up (§3).
7. **Status spine / Creating cutoff**, then Theater, then Samples.

---

## 10 · Superseded — ignore these

These are kept for history only. **Do not build from them.**

| Document / claim | Status |
|---|---|
| `DEV-HANDOFF-2026-08-17.md` · `FIGMA-DECISIONS-*` · `FIGMA-FIX-ROUND-1…5-*` · `FIGMA-FINAL-*` · `DEV-PROMPT-2026-08-19.md` | **Folded into this brief.** History only. |
| Visual-revision quota (Brief 2 · Study 10 · Intelligence 25), `$5 per 10`, the `↻ x/10` counter, "Visual Pack" | **Retired** → §3.1 |
| "Full detent hides the nav" | **Wrong** → §1.4 |
| Ask thread gaps "turn 24 desktop / 9 mobile"; Ask text at 12.5px | **Superseded** → §2.4 (16 / 16, 13px) |
| Centred-caps-between-hairlines phase labels (`INITIATING LEARNING BRAIN`) | **Retired** → §2.1 |
| `OR JUST ASK` / `OR STEER BY INTENT` as caps labels | **Now product voice** → §2.2 |
| Output quota "Brief 0 / Study 5 / Intelligence 10" | **Retired** → §3.4 |
| Queued-analysis screen with a position counter | **Do not build** → §4.5 |
| "Product sets a margin on edit tokens" | **Wrong** — API returns marked-up figures → §3.1 |
| Tier-scaled free bundle sizes "open" | **Resolved** — 15,000 / 80,000 / 300,000 → §3.1 |

---

*Single source. Update this file rather than starting a new round doc.*
