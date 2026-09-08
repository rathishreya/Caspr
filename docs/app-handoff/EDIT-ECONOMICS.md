# Edit economics — what's free, metered, and paid

**Status: LOCKED MODEL (v1, 2026-08-15).** The *model* is locked. The *numbers* (token bundles, dollar rate, refresh price) are illustrative pending Jayant's edit-compute cost.

Covers review points **4** (edit vs re-analyse) and **5** (visual metering) — one economic model for changing a finished report.

---

## The principle

Three ways a user changes a report they've paid for:

| Bucket | What it is | Cost |
|---|---|---|
| **Minor** | Applied **inline**, no regeneration — reword, reorder, re-emphasize, re-plot a chart | **Free, unlimited** — shows **0 tokens** |
| **Substantial** | A **regeneration** — touches sections, a visual, or the layout; **may pull new data/angles** (e.g. "add tariff impact") as long as the analysis's *identity* is unchanged | **Metered in edit tokens** (bundled with the report) |
| **New** | The analysis's **identity** changes — a core scope parameter (subject, industry, geography, analysis type) | **A new analysis** (context carried over) |

---

## The buckets by *what the change is*, not its size

**Minor vs Substantial is an operation, not a judgement:** if it can be applied inline it's Minor; if it needs a regeneration it's Substantial. That's objective and ungameable — you can't stack 20 "minor" edits into a free substantial one, because the moment something must regenerate, it's Substantial.

**Substantial vs New is *identity*, not data.** The test: *"a different report, or a better version of this one?"*

- **New ≠ new data.** "Add the impact of Trump tariffs" pulls fresh data but it's a *better version of this report* → **Substantial**. Charging for it would feel like Caspr missed something obvious and then billed to fix its own gap — a retention killer. New is reserved for a genuinely different report.
- **New = an identity change** — a core scope/gate parameter: subject, industry, geography, analysis type (e.g. solar → batteries; adding competitive benchmarking as a new discipline; Saudi & UAE → a region we never researched).
- **Narrowing a core factor stays cheap.** "Saudi & UAE → UAE only" touches geography but re-cuts data we already hold → Minor/Substantial, not New. New is *expanding or switching* into un-researched identity, never narrowing within it.
- **When unsure Substantial vs New, default Substantial.** The generosity/retention bias — keep the user in the seamless pre-paid zone; reserve the New hand-off for *unambiguous* identity changes.

---

## The currency: edit tokens

**Why tokens, not a fixed "revision":** Jayant's cost varies by change type, so a flat revision unit is a lossy fudge — we'd lose on the expensive ones, overcharge the cheap ones. Tokens track real compute and stay fair both ways. (The earlier "1–3 revisions per change" was already a coarse tokenization — this is the honest version.)

**The mechanism is simple (Joy/Jayant, 2026-08-15):**
- **One concrete anchor:** an **infographic or image regeneration ≈ $0.50 (≈ 500 tokens or less)**, so **~$1 ≈ 1,000 tokens.** Text edits cost less; a big multi-section change costs more. Everything else scales off actual compute — no pre-mapping.
- **Utilization is actual, reported per call.** Jayant and Joy fix a **target margin** (say ~50%); the engine loads real compute cost to that margin and **returns the tokens utilized after each call.** The balance draws down by *actual* usage, and that returned data **feeds back to refine the product's own predictions** over time.
- **Two pools (Joy, 2026-08-15; unified to money 2026-08-18):**
  - **Free allowance — locked to its report.** Each report ships with a **tier-scaled** free edit allowance (Brief **15,000** · Study **80,000** · Intelligence **300,000** credits; a $15 Brief a little, an $80 report more — $15 of edit value on a $15 Brief would be too much), usable **only on that report**, spent **first**.
  - **Overflow = the account money balance, not a separate token pool (Joy, 2026-08-18).** Once a report's free allowance is spent, further edits draw the **same Research Budget / wallet balance** (dollars) that analyses and outputs draw — converted at ~1,000 credits ≈ $1. There is **no separate "edit-token wallet"** and **no second currency.** Because the free allowance is sized generously, overflow is the exception, not the norm.
- **Buying more = the wallet top-up — no separate mechanism (Joy, 2026-08-18).** "Buy more edit budget" is just **topping up the Research Budget balance** (the existing Wallet top-up). The top-up dialog **defaults to a tier-based amount — Professional $20 · Business $50 · Enterprise $100 — adjustable up or down in $10 increments** ($10 minimum). If a balance already exists, the top-up adds to it. No pack SKU, no per-edit price tag. *(Supersedes the earlier "$5 increments" framing.)*
- **Charts are free** — cheap re-plots, and they're the substance. **Infographics and images** consume credits like any regeneration. **Never meter a chart.**

**Wallet = money, ledger = utilization (Joy, 2026-08-18).** The Wallet never categorises items into different currencies or buckets — it shows **one money balance.** The **activity ledger** shows utilization as dollar line-items, and **edits roll up per report** (one line per report — "Edits · *[report]*" −$X — not one line per regeneration; matches "no taxi meter"). Analyses, outputs, and overflow edits are all just ledger lines in the same balance.

---

## Metering — actual, not pre-quoted

This has to feel like a **bundled allowance, not a taxi meter.** The rules that make that true:

1. **Meter *actual* consumption. Do not pre-quote a price per edit.** Predicting a change's cost is unreliable, and a safe estimate would always be a *ceiling* — so we'd forever show more than we use, manufacturing the exact anxiety we're avoiding. (Joy, 2026-08-15.)
2. **No live meter, and NO persistent budget chrome (Joy, 2026-08-18).** The Edit surface is a **conversation** (a scrolling Work-Card thread), so the budget is *not* shown as a persistent bar, counter, or readout — any such element would either scroll away with the thread or crowd the drawer. Instead the state is **conversational**: editing from the included bundle is **silent** (State 1); when the bundle is spent, a **Product-voice status line** appears in the thread — *"That's used up this report's included edits — I'll draw further edits from your budget from here"* (State 2, product voice / quiet mode — italic + grey dot, muted — NOT Caspr's analytical voice; see the two-voice rule in `../product/app-shell-framework.md` §5); an edit that would exceed the balance raises the **edge-prompt** (State 3). The old `↻ x/10` counter is retired and removed from the Figma frames. *(Supersedes the earlier "reads like a persistent credit balance" framing.)*
3. **Interrupt only at the edge.** Substantial edits draw *silently* from the balance. We surface a prompt **only** when an edit would exceed what's left: *"This is a larger edit than your remaining budget — top up to continue"* → opens the **Wallet top-up** (tier-default $20/$50/$100, $10 increments), which adds to the same balance.
4. **Minor edits show `0 tokens` explicitly.** Not merely unmetered — the interface *shows* a Minor edit consumed **0 tokens**, a positive signal that says "tinker freely, this is free." It's the reassurance that keeps small refinements anxiety-free.
5. **Why low-stakes is fine (Joy's reasoning):** the tokens are free with the report and locked to it, so by the time a user exhausts them they're already committed — they paid upfront, found the report useful, and have been refining for a while. A $10 top-up after hours of valuable work is reasonable, not a barrier. We do *not* need heroic anti-anxiety machinery; a visible balance, `0` on minor edits, and an edge-prompt are enough.

---

## The nudges — the existing UI pattern, nothing special

Substantial edits use the product's **already-defined nudge pattern**: options the user can select, or write their own. **No special cost treatment** — no prominent "do it all" default, no per-option price tags, no bespoke cost-menu. Simple. (Joy, 2026-08-15.)

- Only **coherent** options are offered; **dependent** sub-changes are bundled (adding tariffs pulls the exec-summary update along with it).
- Cost isn't shown per nudge — it's metered against the balance in the background.

---

## New — a hand-off, not a paywall

- On a clear identity shift, Caspr nudges: *"This looks like a different analysis — I'll start it in a new window and carry over everything from here."* A **"Start as a new analysis →"** action opens a fresh canvas pre-loaded with the conversation context, so the user never re-explains.
- **The gate is the pricing authority for New** — it sees how much the scope changed and prices accordingly (Joy, 2026-08-15):
  - **Same scope, new data (refresh): 50%.** The user re-enters the cycle (layout → questions → theater) with today's data and refines as needed. Illustrative $8 / $40 / $150. This is the Updates barrier — the moment to sell a refresh, not to tax an edit.
  - **New scope** (topic / geography / sector / core subject): **full price** of a fresh analysis.
  - **Tier change** (depth, e.g. Brief ↔ Study): **full price** of the new tier.
- The **never-surprise gate** applies here (real new money): always confirmed before any charge.

---

## Visual staleness (a narrow case)

Because Minor edits don't regenerate, a minor text edit can leave an infographic factually stale (text says 45%, the graphic still shows 40%).

- Offer to **regenerate it** (a Substantial edit, tokens) or **flag it inline** — *"Reflects an earlier version · Refresh."*
- **Exporting** an output (PDF/PPTX) with a stale-flagged visual **prompts**: *"One visual is out of date — refresh, or export as-is."* Prompt, don't block — protects the boardroom-ready promise.

---

## Living document

- The **Minor / Substantial / New** classification is the fuzzy part, and it's done **product-side against the agreed rules** (not a special engine signal) — Minor = inline/no-regen, Substantial = regeneration within the analysis's identity, New = a scope/gate-parameter change. The engine returns actual tokens per call, and that data **feeds back to refine the product's predictions.** Generosity bias: Substantial when unsure. The **fail-safe** — real money only ever charged behind an explicit gate (New / top-up) — is what makes an imperfect classifier safe to ship.
- **Resolved (Joy/Jayant, 2026-08-15):** rate anchor ≈ $1 / 1k tokens (visual regen ≈ $0.50); classification is product-side, refined by returned-token data; refresh = 50% same-scope, full for new-scope / tier-change (priced at the gate); capacity near-immediate (theater 5–30s, then streaming) → **no queue.** ~~Top-ups = $5 increments~~ **→ superseded 2026-08-18: top-ups = the Wallet top-up (tier-default $20/$50/$100, $10 increments), adding to the one money balance; overflow edits draw that balance, not a separate token pool (see "Two pools" above).**
- **Resolved (Joy, 2026-08-17): margin is NOT a product-side concern.** Jayant's API returns **already-marked-up** token numbers per call; the product records and charges them **as-is** — no margin percentage is set, computed, or stored product-side. (Supersedes the earlier "product/Jayant fix a target margin" framing: the markup is baked into what the API returns.)
- **Still open:** the tier-scaled **free bundle sizes** (the retention dial — sized so a normal user rarely tops up).
