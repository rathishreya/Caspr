> **⛔ HISTORICAL DOCUMENT — vocabulary below is superseded.**
> This predates **2026-08-27**, when **the Thinking Brain and the Learning Brain were retired together.**
> The architecture is now **Source. Assess. Conclude.** — [`source-assess-conclude.md`](../source-assess-conclude.md).
> **The body is left unedited on purpose:** it records what was true when it was written. **Do not copy
> vocabulary out of it.**

> ⛔ **SUPERSEDED — folded into [`DEV-BRIEF.md`](DEV-BRIEF.md) (2026-08-19).** Kept for history. Do not build from this file.

# Dev prompt — 2026-08-19

Everything decided and built since the last prompt round. Five workstreams: **edit-credit economics + wallet**, **the product voice**, **a shell-rule correction**, the **pane/drawer text taxonomy + pinning**, and a **conversation-rhythm normalisation**. Figma file `y2F394I4CwEeSzH2kKuDCt`, page 📝 Report Creation `184:2` (wallet frames on 👤 Profile & Wallet `184:5`).

*Current as of 2026-08-19, end of session — supersedes any earlier statement in this file's own history (notably: Ask-Caspr is now 13px, not 12.5; and the pane turn gap is 16, not 24).*

**Read the logic files, not just this summary** — this is the index, they are the authority:

| Topic | Authority |
|---|---|
| Edit economics (the model) | [`EDIT-ECONOMICS.md`](EDIT-ECONOMICS.md) |
| Edit credits × wallet (build brief) | [`EDIT-CREDITS-WALLET-DEV-NOTES.md`](EDIT-CREDITS-WALLET-DEV-NOTES.md) |
| Pricing / billing rules | [`../../.agents/pricing-model.md`](../../.agents/pricing-model.md) §4.6-A · §8.3 · §14 |
| Wallet & account screens | [`../product/account-wallet-screens.md`](../product/account-wallet-screens.md) §4, §4.1, §4.2 |
| Visual metering (charts vs generation) | [`../product/visualization-library.md`](../product/visualization-library.md) §6–§7.5 |
| Shell, detents, the two voices | [`../product/app-shell-framework.md`](../product/app-shell-framework.md) §5–§6 |
| UI system + conversation grammar | [`../product/design-guidelines.md`](../product/design-guidelines.md) **§11.0 (text families + pinning) · §11.0b (canonical type values)** · §11 (spacing table) · §12 (Edit mode) |
| Product-voice **copy register** | [`VOICE-PRODUCT-CONVERSATION.md`](VOICE-PRODUCT-CONVERSATION.md) |

---

## 1. Edit credits — the metering model changed

**The visual-revision count model is RETIRED.** Brief 2 · Study 10 · Intelligence 25, the `$5 per 10` top-up, and the `↻ x/10` counter are all gone. Do not build them.

**The landed model** (Joy, 2026-08-18):

- Editing a finished report is metered in **edit credits**, **included per analysis**: **Brief 15,000 · Study 80,000 · Intelligence 300,000**. Positioned as a benefit, not a fee.
- **Minor** edits (applied inline — reword, reorder, re-emphasize, re-plot a chart) are **free and unlimited** and show **0 credits**. **Substantial** edits (a regeneration) draw credits. A scope/identity change is **New** — a fresh analysis, not an edit.
- **Charts and templated infographics are always free** and never draw credits. Only a model generation (bespoke image / not-yet-templated infographic) does (≈500 credits ≈ $0.50; ≈1,000 credits ≈ $1).
- **Margin is not product-side.** Jayant's API returns **already-marked-up** credit counts per call; record and charge them as-is.

### Wallet = money. Ledger = utilization.

- **One balance, in dollars.** No "edit tokens" card, no second currency, no per-item buckets.
- The report's **free allowance is report-scoped** and spent first — shown **in the report's Edit context only**, never in the Wallet.
- **Overflow draws the same Research Budget / Paid Analysis Balance** that analyses and outputs draw.
- **Edit charges roll up per report** in the activity ledger — one line, `Edits · [report]` · date · −$X. **Not** one line per regeneration.
- **Buying more = the existing Wallet top-up.** One mechanism for analyses + outputs + edits. **No separate "buy credits" flow** (none exists in Figma — nothing to migrate).
- **Top-up dialog:** presets **$20 / $50 / $100 + Custom**, with the **user's tier value pre-selected** (Professional $20 · Business $50 · Enterprise $100). Custom stepper **$10 minimum, $10 increments**. Adds to the existing balance; no platform fee; does not change the authorised budget or milestone (§8.3).

**Figma (updated):** top-up `1854:2` desktop · `1857:2` mobile · custom `1887:2` / `1888:2`.

### PRODUCT-SIDE RESPONSIBILITY (important)

Edit-credit accounting is **product-side, not Jayant's API**. The product:
1. **maintains the edit-credit ledger** (bundled allowance per report → then the money balance),
2. **decides when the crossing message fires** and **injects it into the conversation**,
3. **decides when the edge-prompt fires**.

Jayant's API only returns marked-up credit counts per generation.

### The three budget states — no persistent chrome

The Edit surface is a **conversation**, so there is **no budget bar, counter or readout**.

| State | What's happening | How it surfaces |
|---|---|---|
| **1 · Bundled** | drawing the report's included credits | **silent** |
| **2 · On budget** | included credits spent → drawing the money balance | **a product-voice status line in the thread** (see §2): *"That's used up this report's included edits — I'll draw further edits from your budget from here."* |
| **3 · Out** | balance can't cover the next edit | the **edge-prompt** |

**Edge-prompt** — built on the **established confirm pattern** (the reset/delete confirms), not a bespoke dialog: title *"Top up to keep editing"*, **one** primary button `Top up` (→ opens the Wallet top-up) + a **`Not now` text link** beneath it. **The system has no two-button format — do not invent one.**
- Desktop `2306:5213` — **pane-scoped scrim** (`x63 w391 h900`; the report/centre stays lit — same as the gate/tier-change pattern) + pane dialog.
- Mobile `2310:5470` — **scrim y52→788 so the Bottom Nav stays lit** + `Drawer — v3 (white) · Half` `628:5` at y380. The `Button — Generate` instance must use its **native 358 width at x=16** — its internal label is anchored 358 wide, so a 342-wide instance renders the label ~8px off-centre. `Not now` sits centred beneath at the same 358.
- State-2 reference frames: desktop `2304:5072` · mobile `2309:5354`.

---

## 2. The product voice — a second speaker (LOCKED)

Two speakers appear in the work surface and they are **visually distinct**. Full copy register in [`VOICE-PRODUCT-CONVERSATION.md`](VOICE-PRODUCT-CONVERSATION.md); visual rule in `app-shell-framework.md` §5 + `design-guidelines.md` §11.

| | **Caspr — the analyst** | **The Product — the app** |
|---|---|---|
| Covers | proposals, clarifying questions, Ask-Caspr answers | the relationship / get-to-know module during busy phases, status narration, account/state events |
| Type | **upright Inter**, ink `#1A1A17` | **italic Inter + a small grey outline dot** (`#8A887F`, **7px**) leading the line |
| Modes | — | **engaging** (warm `#34332F`) · **quiet** (muted `#5C5B58`, smaller) |

**Rules that fall out of this — all four matter:**

1. **No separate "notification" style.** Status ("Initiating Learning Brain") is simply the **quiet mode** of the product voice. There is no third treatment.
2. **The dot is inline, NOT a bullet — no hanging indent.** Wrapped lines and any further paragraph of the same turn run **flush to the content left edge**. In Figma: text at the content left edge, full column width, **`paragraphIndent = 18`** on the first line; continuation paragraphs `paragraphIndent = 0`. In CSS this is just an inline marker — do not build a `<ul>`.
3. **One mark per *turn*, not per line.** The dot leads the turn's opening line only.
4. **The red ● is reserved for citations / Ask-Caspr.** Never the product-voice mark.

### Phase markers use the same voice

`Initiating Learning Brain` · `Generating the report` · `Creating outputs` · `Report generated · 13 Jul` are **not** a label style. The old centred-caps-between-hairlines treatment is **retired**. The pattern is:

> **a full-width hairline, then the product-voice line beneath it — left-aligned, italic, muted, with the grey dot.** Sentence case, never caps.

### Alignment (governs both voices)

**Caspr and the Product are always left-aligned**, full column width, un-bubbled. **Only the user is right-aligned**, in a hug-width bordered bubble. Nothing else ever sits right.

---

## 3. Shell correction — Full detent does NOT hide the nav

An earlier draft of `app-shell-framework.md` said Full was "the only detent that hides the nav." **That was wrong and is corrected.**

- The **nav (and the pane switcher / selector) stays visible below the card at *every* detent, Full included.** A Full-detent card sits *above* the nav, never over it.
- The nav recedes in **only two places**: **document read-mode** (the user taps the document; header + nav both fade) and the **Theatre**.

---

## 4. The Edit surface is a conversation, not a static panel

Per `app-shell-framework.md` §5–6, the Edit drawer/pane is the **same Work-Card thread** as Ask Caspr:

- The proposal cards, intent pills and the *"Or just ask"* line are **turn-1 content**, not fixed chrome. As the user steers and Caspr replies, the thread grows, earlier turns **scroll up**, and the drawer grows **Half → Full**.
- The **docked input is pinned**; content lays out above it. The **heading and selection indicator are pinned too** (§5b) — nothing else is.
- **Consequence:** no status element can live on the *"Or just ask"* row — it scrolls away. This is why the budget states are conversational (§1), and why that row is product **voice**, not a label.
- *(Get-to-know remains a swipe carousel — a distinct pattern, not this thread model.)*

---

## 5. Conversation vertical rhythm — normalised

`design-guidelines.md` §11 had been applied to Onboarding only, with Report Creation "pending". **That sweep is now done**, using the Onboarding frames as the reference implementation.

- **Conversation text = Inter 13 / line-height 19px** everywhere (was `AUTO`≈16; Layout Canvas had stray 13.5/14; **Ask-Caspr was 12.5 → now 13**).
- **Gaps (final — see §5b for the container rule):** heading → first message **16** · between turns **16** in the pane/drawer (**24** only in the 800px centre) · paragraphs inside one message **8** · message → its card/pill/chip stack or list **12** · between stack/list items **8** · hairline → phase-marker line **12**.
- **Numbered clarifying questions:** number sits at the column left edge, question text indented **+20**, 13 / lh19. Group reads as one list (12 from the message, 8 between items) — previously 17/18 apart, which read as three separate messages.
- **Conversation column aligned to the prompt bar:** **x = 80 desktop / 16 mobile, width 358**. Generation, Layout Canvas and Ask-Caspr desktop were at x=88 and Gate at 84 — a real misalignment against the docked bar at 80 (the fault `design-guidelines.md` §142 warns about). Now corrected.
- Applied to: Theater, Generation (incl. `failed`, `Contact support`, `Creating`), Layout Canvas (base + `Learning`), Gate (base + `Tier-change` + `insufficient budget`), Ask-Caspr, and the Edit family — desktop **and** mobile.

**Known and accepted — not bugs:**
1. **Three mobile drawers clip at the pinned input** (`Ask Caspr — Mobile`, `Generation — Mobile · Creating`, and the State-2 ref). The thread is longer than a Half drawer holds; it clips cleanly and reads as "continues below", which is what scrolling does in the build. **Joy reviewed and confirmed: leave as-is, do not switch these to Full detent.**
2. **Ask-Caspr threads carry more turns than the pane shows at once** — same reason; they scroll.

---

## 5b. Pane/drawer text taxonomy — four families, one test (added 2026-08-19)

Canonical: `design-guidelines.md` **§11.0 / §11.0b**. The test for any string in the pane or drawer is **"does it scroll?"**

- **Pinned → chrome.** The pane/drawer heading (`EDIT`, `ASK CASPR`, `WHILE CASPR WORKS`, `BEFORE CASPR WRITES`) and the **selection indicator** stay put while the thread scrolls. They are headings, not voice.
- **Scrolls → conversation.** Hence `Or just ask` · `Or steer by intent` · `Preparing your questions` are **product voice** (quiet, sentence case, with the dot) — they were caps labels and are worthless once the user is talking.
- **Scrolls but names a control group** → small-caps label (`COVER OPTIONS`, `AMOUNT`, `REGARDING`).
- **Not conversation** → meta/data (title eyebrows, `FIGURE 1`, `01`–`05`, `SOURCES REVIEWED`).

**Pinning (build this way):** pin the **heading + selection indicator**; **everything else scrolls** — proposal cards, intent pills, connectors, chips. Cards are *an answer*, regenerated on request, not a persistent control; pinning them would consume the mobile Half drawer.

**Canonical type:** Caspr 13/lh19 (nudge `#1a1a17`, reply `#5c5b58`) · Product italic 13/lh19 (engaging `#34332f`, quiet `#5c5b58`) + 7px grey dot · user bubble 13 `#1a1a17`, **Regular when typed, Italic when it echoes a tapped option** · conversation column **x=80 desktop / 16 mobile, w=358, sharing the prompt bar's left edge**.

**Turn gap follows the container, not the breakpoint:** **24** only where the conversation owns the 800px centre (onboarding compose); **16** in the 390px pane and the mobile drawer. Cards/pills/chips: **12** from the message, **8** between.

**Italic is exclusive** to the product voice and to selection echoes in bubbles. Gate parameter values and the citation scope line are data → Regular.

> **Caspr's dialogue is engine output from Jayant's API — the frames hold samples, not copy to hardcode. The product voice is product-side strings.** Do not treat sample dialogue as fixed copy.

## 5c. Figma correctness fixes made in this round

- **`Working · Edit (Visual · Infographic) — Mobile` `1422:2`** — the red *Editing pulse* border was the topmost child and ran to y=385, overlapping the drawer at y=380. Re-ordered **below the drawer**, so the drawer covers it. Build rule: **the drawer always occludes the selection pulse.** (Sibling Edit frames sit above the drawer in z-order too, but their pulses stop short of it — harden if you touch them.)
- **`↻ x/10` counters removed** from all Edit frames; the `＋ Generate bespoke · 1 revision` tag is now **`＋ Generate bespoke`**. Per-card `↻` regenerate icons are **kept** (regeneration still exists — it just draws credits).
- **23 nodes de-italicised** — gate parameter values (`English (UK)`, `Investor`, `PDF, PPTX, XLSX, MD`, `2 files · premium`) and the Ask-Caspr citation scope line. They are data, not speech.

## 6. Open / not yet in Figma

- **Per-report edit ledger line** rendered from real data in the Wallet (the row pattern exists; sample data was deliberately not added, to avoid inconsistent totals across the wallet frames).
- **The "From balance" intermediate state** of the budget signal is specified but not drawn (States 1 and 3 are).
- **Copy voice pass on the get-to-know lines.** They currently read in Caspr's first person (*"while I work"*, *"It helps me tailor this report"*). Now that they are product voice, run them against [`VOICE-PRODUCT-CONVERSATION.md`](VOICE-PRODUCT-CONVERSATION.md). *(Sample content — copy task, not a build blocker.)*
- **Onboarding page (`184:3`) is untouched by this pass.** It is the reference implementation for the *centre* rhythm (24px turn gap) and was already correct; the pass covered 📝 Report Creation only.
