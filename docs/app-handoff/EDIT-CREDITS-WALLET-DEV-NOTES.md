# Edit credits × Wallet — dev build notes (Joy-aligned 2026-08-18)

One-page brief for the dev session. Model authority: [`EDIT-ECONOMICS.md`](EDIT-ECONOMICS.md) · pricing [`../../.agents/pricing-model.md`](../../.agents/pricing-model.md) §4.6-A + §8.3 · wallet UI [`../product/account-wallet-screens.md`](../product/account-wallet-screens.md) §4 · visual metering [`../product/visualization-library.md`](../product/visualization-library.md) §6–7.5.

## The principle (decided)

**Wallet = money. Ledger = utilization. One balance, no per-item buckets.** There is no separate "edit tokens" wallet and no second currency anywhere in the UI.

## The model

1. **Free per-report edit allowance** — Brief **15,000** · Study **80,000** · Intelligence **300,000** credits. Included in the analysis price, **locked to that report**, **spent first**. Shown **in the report's Edit context only** (a calm balance, like a purchased-credit balance — think Claude credits), **never in the Wallet**.
2. **Overflow → the account money balance.** Once a report's free allowance is exhausted, further edits draw the **same Research Budget / Paid Analysis Balance** (dollars) that analyses and outputs draw. Conversion ≈ **1,000 credits ≈ $1** (a generation ≈ 500 credits ≈ $0.50). Overflow is the exception — the free allowance is sized generously.
3. **Credits are metered on actual compute.** Jayant's API returns **already-marked-up** credit counts per call; product records/charges as-is (no product-side margin). Charts & templated infographics = **free, never metered**; only model generations (bespoke image/infographic) and substantial regenerations draw credits.
4. **Buying more = the Wallet top-up. One mechanism for everything** (analyses, outputs, edit overflow). No separate "buy credits" flow.

## What the dev builds / changes

| Item | Spec |
|---|---|
| **Per-report free allowance** | 15k/80k/300k credits, attached to the report, spent before any money balance is touched |
| **Overflow → money balance** | after free allowance = 0, edits debit the Research Budget / Paid Analysis Balance in $ (credits→$ at ~1,000≈$1) |
| **In-report edit affordance** | calm balance ("plenty of edit budget" / "running low"). **No `↻ x/10` counter** (removed from Figma). No live number ticking. |
| **Edge prompt** | fires only when an edit would exceed the remaining balance → opens the **Wallet top-up**; otherwise edits draw silently |
| **Minor edits** | applied inline, **free/unlimited, show "0 credits"** |
| **Ledger line for edits** | **one rolled-up line per report** — `Edits · [report]` · date · −$X — same row component as analysis rows; **not** one line per regeneration |
| **Top-up dialog** | presets **$20 / $50 / $100 + Custom**; **user's tier value pre-selected** (Professional $20 · Business $50 · Enterprise $100); custom stepper **$10 increments, $10 minimum**; adds to existing balance; no platform fee; does not change authorised budget/milestone (`pricing-model.md` §8.3) |

## Figma — already done in this pass (file `y2F394I4CwEeSzH2kKuDCt`)

- **Top-up presets retargeted** $50/$100/$200 → **$20/$50/$100**, `$20` pre-selected (Professional), on all four top-up frames: `1854:2` (desktop), `1857:2` (mobile), `1887:2` (desktop custom), `1888:2` (mobile custom).
- **Custom stepper helper** "$20 minimum · $10 increments" → **"$10 minimum · $10 increments"** (`1887:2`, `1888:2`).
- **`↻ 7/10 revisions` counter removed** from the Edit frames (Visual·Cover + Visual·Infographic, desktop + mobile); the "＋ Generate bespoke · 1 revision" tag → **"＋ Generate bespoke"**. Per-card `↻` regenerate icons kept.

## Figma — the two edit surfaces (designed 2026-08-18, reference frames on page 📝 Report Creation `184:2`)

### The three budget states — NO persistent chrome (Joy, 2026-08-18)

The Edit surface is a **conversational thread** (see the interaction-model note below), so there is **no persistent budget bar or counter** in the pane/drawer — an earlier "chunky balance" bar was a misread and has been removed. The three states surface as follows:

| State | What's happening | How it shows |
|---|---|---|
| **1 · Bundled** | drawing the report's included edit credits | **silent** — editing is simply included |
| **2 · On budget** | included credits spent → edits now draw the money balance | **a Product-voice status line in the thread** at the crossing: *"That's used up this report's included edits — I'll draw further edits from your budget from here."* This is **product voice, quiet mode** (italic Inter + grey outline dot, muted `#5C5B58`) — NOT Caspr's analytical voice. See the two-voice rule in `app-shell-framework.md` §5. Product-side maintains the ledger and injects this line. |
| **3 · Out** | balance can't cover the next edit | the **edge-prompt** (below) |

- State-2 ref frames: `Edit (Chart) — Desktop · edit-budget State 2 note (ref)` **`2304:5072`** · mobile **`2309:5354`** — the Caspr line rendered in the conversation.

**PRODUCT-SIDE RESPONSIBILITY (Joy, 2026-08-18):** edit-credit accounting is **product-side, not Jayant's API**. The product **maintains the edit-credit ledger** (bundled allowance per report, then the money balance) **and injects the State-2 crossing line into the conversation** when a report's included credits are exhausted. Jayant's API returns marked-up token counts per generation; the product records/debits and decides when the crossing message and the edge-prompt fire.

### Edge-prompt — fires **only** when an edit would exceed the remaining balance

Built on the **established confirm pattern** (reset/delete confirms), not a bespoke dialog: title **"Top up to keep editing"**, body *"This edit is larger than what's left in your balance…"*, **one** primary button **`Top up`** (→ opens the Wallet top-up) + a **`Not now` text link** beneath it (no second button — the system has no two-button format).
- Desktop: **`2306:5213`** — **pane-scoped scrim** (`x63 w391 h900`, report/centre stays lit — the gate/tier-change pattern) + a pane dialog (white r12 + shadow) with the single button + `Not now` text link.
- Mobile: **`2310:5470`** — **scrim y52→788 (Bottom Nav stays lit below)** + **`Drawer — v3 (white) · Half`** `628:5` at y380 + `Button — Generate` (native 358-wide, centred) + `Not now` text, cloned from the mobile reset confirm `2206:3001`.

All ref frames on page 📝 Report Creation `184:2`, captioned on-canvas.

### Interaction model — the Edit surface is a conversation, not a static panel (Joy-agreed, 2026-08-18)

Per [`../product/app-shell-framework.md`](../product/app-shell-framework.md) §5–6, the Edit drawer/pane is the **same Work Card conversational thread** as Ask Caspr: the proposal cards + intents + "OR JUST ASK" are **turn-1 content** (not fixed chrome); as the user steers/asks and Caspr replies, the thread grows, earlier turns **scroll up**, and the drawer grows **Half→Full** during an active edit. The **docked input is pinned**; content lays out above it. This is why no status element can live on the "OR JUST ASK" row (it scrolls) — hence the conversational treatment above. *(Get-to-know stays a swipe carousel — a distinct pattern.)*

### ⚠ Detent/nav correction (Joy, 2026-08-18)

**Full detent does NOT hide the nav.** The nav (and pane switcher/selector) stays visible below the card at **every** detent, Full included. The nav recedes in only two places: **document read-mode** (the mobile user taps the document → header + nav both fade) and the **Theatre**. Corrected in `app-shell-framework.md` §5.

## Not yet in Figma (dev to build against the model)

- The **per-report edit ledger line** in the Wallet, rendered from real data (row pattern already exists; sample not added to avoid inconsistent totals across the wallet frames).

## Deprecations

**None.** No separate "buy edit credits / tokens / Visual Pack" screen was ever built (verified across the file) — so nothing to archive. The Wallet was already money-only; this pass keeps it that way.
