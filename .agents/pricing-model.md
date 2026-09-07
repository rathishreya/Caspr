# Caspr Pricing Model

*Authoritative reference for product, engineering, and finance*
*Last updated: 2026-08-18 — see "Update — output base clarified" at the end of this document*

---

## 1. Model Overview

Caspr uses a **Research Budget** model. Users authorise a monthly Research Budget — a single number that funds both platform access and analyses. There are no separate subscription fees, no seat charges, and no token metering.

Each month, the user's Research Budget is recharged by exactly the amount consumed in the previous cycle. Unused analysis balance carries forward automatically. The user is never charged for value they did not receive.

**One number. One charge. No line items.**

---

## 2. Definitions

| Term | Definition |
|---|---|
| **Research Budget (B)** | The monthly amount the user authorises, in USD. Minimum $200. |
| **Platform Fee (F)** | 7% of B, deducted from each monthly recharge. Covers platform access, standing features, and retention services. Never shown as a separate line to the user. |
| **Analysis Budget Cap (A)** | The maximum spendable analysis balance: A = B × 0.93. |
| **Analysis Balance** | The user's current spendable balance for running analyses. Always ≤ A (except when promotional credits push it above). |
| **Monthly Recharge (R)** | The amount charged to the user's card each billing cycle. R = F + top-up, where top-up restores Analysis Balance to A. |
| **Billing Anchor Date** | The day-of-month on which the account was first charged. Recharges occur on this date each month. |
| **Analysis Reservation** | A hold placed on the Analysis Balance at the moment an analysis begins. Released on failure; finalised on completion. |
| **Milestone** | A Research Budget threshold that unlocks additional product features. |
| **Promotional Credit** | Non-refundable gifted balance issued by Caspr (e.g., referrals, campaigns). Tracked separately from paid balance. Expires in 90 days. |
| **Free Trial Balance** | The gifted $100 issued to new accounts (or $150 for Academic Accounts). Platform fee waived. Tracked separately. Expires 90 days from account creation. |
| **Academic Account** | A Caspr account verified as belonging to a current student at an accredited institution. Eligible for Academic pricing, waived platform fee, and the Research Dollars programme. No subscription required — top-up only billing model. |
| **Academic Club Account** | A pooled-budget account created by a verified Academic Account holder on behalf of a recognised student club or society. Operates on a monthly pooled budget at Academic pricing with no platform fee. Uses the Enterprise pool mechanic (§5.2). |
| **Academic Pricing** | Discounted per-analysis prices applicable to Academic Accounts and Academic Club Accounts: Brief $8, Study $40. Intelligence is not available at Academic pricing. Premium Data Add-ons are available at standard rates. |
| **Research Dollars** | Promotional credits earned by Academic Account holders through specific automated earn events. Governed by standard promotional credit rules (§10.9) with modified expiry (180 days) and a lifetime cap ($200 per account). Tagged `reason: 'research_dollars'` in the promo ledger. |
| **Share Card** | A unique branded analysis summary card generated from the Caspr dashboard by an Academic Account holder. Contains a tracked short link (`caspr.ai/s/[unique-id]`). Used to trigger the Social Share earn event when 10 unique engagement events are recorded. |
| **Graduation Conversion** | The automated event fired when an Academic Account transitions to standard pricing. Issues a one-time $100 promotional credit and updates account type to standard. |

---

## 3. Research Budget Mechanics

### 3.1 Core Formula

```
F  = B × 0.07                          // Platform fee (always charged)
A  = B × 0.93                          // Analysis budget cap

top_up = max(0, A − analysis_balance)  // Amount needed to restore balance to cap
R  = F + top_up                        // Total monthly charge to card

// After successful charge:
analysis_balance = analysis_balance + top_up
// (balance is now restored to A, or unchanged if already ≥ A)
```

**Minimum monthly charge:** F (when analysis_balance = A — no analyses were run)
**Maximum monthly charge:** B (when analysis_balance = 0 — full budget was consumed)

### 3.2 Worked Examples

**Example A — Partial use:**
- Budget: $200 → F = $14, A = $186
- Month 1 charge: $200. Analysis balance: $186.
- User runs 1 Study ($80). Balance: $106.
- Month 2: top_up = $186 − $106 = $80. R = $14 + $80 = **$94**.
- After charge: analysis_balance = $186.

**Example B — No use:**
- Budget: $200 → F = $14, A = $186
- Month 1 charge: $200. Analysis balance: $186.
- No analyses run.
- Month 2: top_up = $186 − $186 = $0. R = $14 + $0 = **$14**.
- After charge: analysis_balance = $186.

**Example C — Full use:**
- Budget: $200 → F = $14, A = $186
- Month 1 charge: $200. Analysis balance: $186.
- User runs 2 Studies ($160) + 1 Brief ($15) = $175. Balance: $11.
- Month 2: top_up = $186 − $11 = $175. R = $14 + $175 = **$189**.
- After charge: analysis_balance = $186.

**Example D — Heavy month, partial rollover:**
- Budget: $600 → F = $42, A = $558
- Month 1 charge: $600. Balance: $558.
- User runs 6 Studies ($480). Balance: $78.
- Month 2: top_up = $558 − $78 = $480. R = $42 + $480 = **$522**.

### 3.3 Balance Tracking

The system maintains three separate balance ledgers per account. When charging for an analysis, balances are consumed in the following order:

1. **Free Trial Balance** — consumed first; expires 90 days from account creation; non-refundable
2. **Promotional Credit Balance** — consumed second; each credit has its own expiry (default 90 days from issuance); non-refundable
3. **Paid Analysis Balance** — consumed last; refundable on cancellation

Refund calculations reference only the Paid Analysis Balance.

### 3.4 Balance Rounding

All balance calculations use two decimal places (cents). Platform fee is rounded to the nearest cent using standard rounding (half-up). Recharge amounts are rounded to the nearest cent. Analysis prices are fixed whole-dollar amounts — no rounding required on deductions.

---

## 4. Analysis Catalogue

### 4.1 Analysis Depths (tiers)

> **Depth ≠ Type.** Brief / Study / Intelligence are **depths** (scope & price) — NOT the kind of analysis. Any analysis *Type* can be run at any depth. The 5 cross-depth analysis **Types** (Market Analysis · Diligence · Deal Sourcing · Research Synthesis · Strategy) and the `Type · Status` eyebrow are defined in `docs/product/app-shell-framework.md` §18. The 10 Brief templates in §4.2 below are **Brief-depth instances** that roll up into those 5 Types.

| Depth | Price | Description | Approx. time |
|---|---|---|---|
| **Brief** | $15 | 3–5 page structured briefing note. Ten types — see `brief-spec.md` for full catalogue and content structure. Sourced from live data and the curated corpus. Every data point cited to source. | ~15 min |
| **Study** | $80 | Deep methodology, scenario analysis, multi-source synthesis — **every alternative weighed, every conclusion defensible**. Boardroom-ready PDF or editable PPTX. Business cases, investment theses, market research. | 1–2 hrs |
| **Intelligence** | $300 (in-budget) / $399 (à la carte) | Multiple analytical models challenging and validating each other. Highest rigour, maximum source depth. Due diligence, M&A, board-level strategy. | Up to 24 hrs |
| **Premium Data Add-on** | $20–$60 per add-on | Optional pre-run addition of expensive third-party data sources (Bloomberg, PitchBook, specialist regulatory databases). Price varies by source and shown to user before the analysis runs. | — |

### 4.2 Brief Types (sub-catalogue)

Ten Brief types are defined in full in `brief-spec.md`, including content structure, section-by-section specification, and ICP mapping. Summary:

| # | Brief type | Core question |
|---|---|---|
| 1 | Market Sector Brief | What is this market and who is in it? |
| 2 | Competitive Landscape Brief | Who are the players and how are they positioned? |
| 3 | Company Profile Brief | Who is this company and what do I need to know? |
| 4 | Executive Profile Brief | Who am I meeting and what is their background? |
| 5 | Country / Geography Brief | What are the conditions in this market? |
| 6 | Sector Investment Brief | Is this sector worth investing in right now? |
| 7 | Regulatory Overview Brief | What are the rules and what is changing? |
| 8 | Category Brief | What is the state of this product category? |
| 9 | M&A Target Brief | Is this company worth pursuing? |
| 10 | Market Entry Brief | Should we enter this market, and how? |

Brief type is inferred from the user's prompt. Ambiguous prompts trigger a single clarifying question. See `brief-spec.md` for prompt detection guidance.

### 4.3 À la Carte Intelligence

Intelligence analyses are available without a Research Budget subscription at $399 per analysis. Available to all users including free trial and expired accounts. Charged as a one-time payment to the card on file. Not drawn from any balance. Subject to standard refund rules (if analysis fails to deliver output, full refund).

### 4.4 Premium Data Add-on Rules

- The system detects which premium data sources are required before starting the analysis.
- If premium sources are available, the user is shown: *"This analysis would benefit from [source name]. Add for $[X]?"* with options to include or skip.
- The add-on cost is reserved from the analysis balance before the analysis begins (together with the base analysis cost).
- If the user has insufficient balance to cover base cost + add-on: prompt to top up. Do not allow partial add-ons.
- If the data source fails to return data: release the add-on reservation. The analysis may continue without the premium data if the user accepts, or be cancelled with full refund.
- Add-on charges are finalised on analysis completion.
- Add-on charges are non-refundable once the data has been fetched, regardless of whether the analysis itself was useful.

### 4.5 Re-analysis (Updates re-run) — *Phase 2 (deferred)*

> **Deferred to Phase 2** (Joy, 2026-07-31). The Updates feature that triggers re-analysis is batch-driven and ships in Phase 2 — see `docs/product/updates-feature-phase2.md`. Pricing below is locked and waiting. "Coming soon" in the UI until then.

A **re-analysis** re-runs an existing analysis against freshly sourced data. It is triggered from the report's **Updates** tab, which surfaces new intelligence Caspr has found since the report was last run (each with a High/Med/Low impact indicator). "The world has changed" — the user re-analyses to bring the report current.

**Product semantics (locked with Joy, 2026-07-31):**
- A re-analysis produces a **new version** of the *same* analysis (v3 → v4) on the Versions stack — **not** a new report. The prior version is retained; the diff is the value.
- It reuses the existing scope, structure, and layout — no clarifying round, no layout-proposal step. The action seeds a pre-filled prompt (the new signals loaded as context) that the user may steer before committing.
- The verb shown to users is **"re-analyse"** (not "regenerate" — which is reserved for re-rendering a stale *output* format, §on report-actions model).

**Pricing:**

| Account | Re-analysis price | Basis |
|---|---|---|
| **Standard** | **50% of the fresh depth price** | Brief $15 → **$8** · Study $80 → **$40** · Intelligence $300 → **$150** |
| **Academic** | **20% discount on the academic depth price** (low academic margins) | Academic Brief $8 → **$6** · Academic Study $40 → **$32** |

- Re-analysis is charged like any analysis: reserved on start, finalised on completion, released on system-error failure (§10.2, §9.3). Drawn from balance in the standard spend order (§3.3).
- 50% (standard) reflects that compute for a re-run is materially lower than a cold start (cached corpus, fixed scope/structure), though not trivial. Exact factor pending Jayant compute validation (§13, item 12).
- Prices round half-up to the nearest whole dollar.
- Premium Data Add-ons on a re-analysis follow §4.4 at standard rates (not discounted).

### 4.6 In-report generation metering — edit credits & output generation

Two in-report actions are metered **separately from the analysis price**. Both are surfaced in the product (Edit mode + the Generate Output screen) and are good candidates to show on the website as transparent, usage-based extras. Full visual model: `docs/product/visualization-library.md`.

#### A. Edit credits (post-generation editing) — METERED IN CREDITS, included per analysis

*Full model: `docs/app-handoff/EDIT-ECONOMICS.md` (locked v1). This is the pricing summary.* *(Retires the earlier visual-revision quota — Brief 2 · Study 10 · Intelligence 25, $5 per 10 — and its `↻ x/10` counter.)*

Editing a finished report is metered in **edit credits**, an allowance **included in every analysis** and scaled to tier. Credits are edit *tokens* under the hood — `EDIT-ECONOMICS.md` anchors **≈ 1,000 credits ≈ $1** of compute; a bespoke image/infographic regeneration ≈ 500 credits, a text edit less.

- **Included per analysis (Joy, 2026-08-18):** Brief **15,000** · Study **80,000** · Intelligence **300,000** credits. Sized as a **benefit, not a fee** — a Study's 80,000 covers *rewriting every section of a 100-page report twice over*.
- **What spends credits:** only a **Substantial** edit — a regeneration that touches sections, a visual, or the layout (may pull new data as long as the analysis's *identity* is unchanged). **Minor** edits (applied inline — reword, reorder, re-emphasize, re-plot a chart) are **free and unlimited** and show **0 credits**. A scope/identity change (subject, industry, geography, analysis type) is **New** — a fresh analysis, not an edit.
- **Charts are always free** (deterministic re-plots). **Infographics and images** consume credits like any regeneration. Never meter a chart.
- **Free allowance first, then the money balance (Joy, 2026-08-18).** The tier's free allowance is **locked to its report** and spent first. Overflow edits then draw the **same Research Budget / wallet balance** (dollars) that analyses and outputs draw — ~1,000 credits ≈ $1. **No separate edit-token pool, no second currency.** Because the free allowance is generous, overflow is the exception.
- **Buying more = the Wallet top-up — no separate mechanism (Joy, 2026-08-18).** Topping up adds to the Research Budget balance (§8.3). The top-up dialog **defaults to a tier-based amount — Professional $20 · Business $50 · Enterprise $100 — adjustable ± $10** ($10 minimum, $10 increments). *(Supersedes the earlier "$5 increments" / "Visual Pack" framing.)*
- **Wallet = money, ledger = utilization.** The Wallet shows **one money balance**, never a separate token bucket. Edit charges appear in the activity ledger as **per-report rolled-up dollar lines** ("Edits · *[report]*" −$X), alongside analysis and output lines.
- **No live meter.** A calm balance that reads like a purchased-credit balance ("plenty of edit budget" / "running low"), never a `↻ x/10` counter or a number ticking down; interrupt **only at the edge** — when an edit would exceed the remaining balance, which opens the Wallet top-up.
- **Margin:** Jayant's API returns **already-marked-up** credit counts per call; the product records and charges them as-is — no margin is set or stored product-side (Joy, 2026-08-17).

#### B. Output generation (rendered deliverables) — PER-OUTPUT, value-priced

An **output** = one rendered deliverable file = **one format in one language**, produced by **Jayant's output-generation API** (never product-side). Unlike visual revisions (A — iterative attempts, so a cheap pack), outputs are **finished, standalone work products** (a translated 80-page report, an editable board deck, a formatted model) and are **value-priced per output**.

- **Included in the analysis price (the base):** the **tier's committed output set** — Brief **PDF · MD**; Study and Intelligence **PDF · PPTX · XLSX · CSV · MD** (`gate-output-spec.md` §4 is the authority) — in the user's **native / working language**, generated *natively in that language* (not English-then-translated). Caspr is **multilingual by default** — a user's own language is never a surcharge. **A Brief does not ship a deck**; a Brief as PPTX is an out-of-tier format and is charged.
- **Charged per output** beyond the base (a **format outside the tier's set**, each **additional language**, and **re-generations** after edits):

  | Output | Price |
  |---|---|
  | PDF · DOCX · XLSX · CSV | **$5** |
  | PPTX (slides) | **$10** |
  | MD | **free** (all tiers) |

  (Format × language: a French deck = $10, a French PDF = $5.)
- **Value basis, not cost.** The next-best alternative — professional translation (thousands), a designer-built deck ($50–500), analyst hours — costs far more; $5–10 is a bargain that still captures value. A flat $2 would price a real work product like a toggle.
- **No quota, no pack.** Per-output prices appear in the gate and **sum (in red) into the Generate button** (`gate-output-spec.md` §2). There is **no "x of N free" counter and no top-up bundle** for outputs. *(This retires the earlier Brief 0 / Study 5 / Intelligence 10 quota.)*
- **Consider a per-language premium** — a translation is a *rewrite*, not a format-conversion (higher value + cost); decide on Jayant's translation cost (§13, item 15).
- **Routing:** the **gate** is the initial generation; **subsequent** generations (added languages, re-gens after edits) run through the **Generate Output screen** — same table, same API. Full model: `gate-output-spec.md`.

---

## 5. Feature Milestone Unlocks

Features unlock when the user's authorised Research Budget meets or exceeds the milestone threshold. Feature access is determined by the authorised budget amount, not the current balance.

> **⚠ Renamed and restructured 2026-08-26. `Try · Solo · Team · Org` supersedes `Professional · Business ·
> Enterprise`.** This table is now a **summary**; the authoritative model — collaboration roles, whose budget
> pays, Data Room scopes — is [`docs/product/access-model.md`](../docs/product/access-model.md).
> **Do not restate it here.** A second copy is how the Signals and Monthly Brief forks began.

| Mode | Budget threshold | Features unlocked |
|---|---|---|
| **Try** | none | Every depth · every output on that depth's menu, purchasable · Ask Caspr · citations · receive and read a shared analysis |
| **Solo** | $200+ | + output editing · section refinement · follow-up queries · **Updates** |
| **Team** ⭐ | $600+ | + **Data Room** (data upload) · collaborative editing |
| **Org** | $1,800+, **committed** | + team seats (pooled) · **Org-scoped Data Room** · SSO · API access · Projects · 24/7 desk · dedicated onboarding · first custom template |

**Three changes beyond the rename:**

- **The $300-depth gate is removed.** It was redundant — a $200 budget yields ~$186 and cannot buy a $300
  analysis, so the arithmetic already gates it. Any mode may run any depth its balance covers.
- **~~Caspr Signals~~ is retired** into Insights, and **Monthly Brief folds into Updates.** Neither is a
  tiered feature. See `CONCEPTS.md`.
- **Org is committed spend — used or lost, not delta-recharged.** §3.1's carry-forward applies to Try, Solo
  and Team only. ⚠ **§9.1 needs a matching Org carve-out**, and the *"never charged for value you did not
  receive"* line must be scoped to self-serve.

### 5.1 Unlock Rules

- **Upgrade:** User increases budget to meet or exceed a new milestone threshold. Feature access is granted immediately on confirmation of the budget change. The new budget amount takes effect at the next billing cycle.
- **Downgrade:** User decreases budget below a milestone threshold. Feature access revoked at the end of the current billing cycle. The new budget amount takes effect at the next billing cycle.
- **In-progress analyses:** If a downgrade causes feature revocation (e.g., Intelligence is mid-run when the downgrade takes effect at cycle end), the in-progress analysis completes uninterrupted. No new analyses at the revoked tier are permitted from cycle end onward.
- **Minimum budget:** $200. Users cannot set a budget below this amount.
- **Maximum budget:** No hard cap. Custom Enterprise budgets scale at 7% platform fee automatically. Amounts above $10,000/month require manual approval from the Caspr team before activation.

### 5.2 Team Seats (Enterprise Milestone)

- The $1,800 budget is shared (pooled) across all seats on the account.
- Default seat count: 3. Additional seats available as a paid add-on (pricing TBD).
- Account admin controls: can set a per-user monthly spending sub-limit (optional). Default: no sub-limit.
- All billing is to the admin account's payment method.
- If a per-user sub-limit is set and a team member reaches it: that member's analysis access is suspended until the next billing cycle or until the admin raises the limit. The shared pool may still have balance.
- When a team member is removed: their completed analyses and reports are retained in the admin account. Their access is revoked immediately.

---

## 6. Free Trial

- New accounts receive a **$100 gifted Research Budget**.
- **Platform fee is waived** on the free trial. The full $100 is available as analysis balance.
- No credit card required during free trial.
- Free trial balance is tracked in its own ledger (separate from paid analysis balance).
- **Expiry:** 90 days from account creation date. Any remaining free trial balance is forfeited at expiry.
- **Conversion to paid:** When the user sets a Research Budget and adds a payment method, the free trial balance expires immediately. The first paid cycle begins. There is no carryover of free trial balance into the paid account.
- **Free trial exhaustion (before 90 days):** When free trial balance reaches $0, the user is prompted to set a Research Budget and add a payment method. Until they do, no further analyses can be run. The account remains accessible (view-only).
- A user may only receive one free trial. Accounts created with the same email address, payment method, or device fingerprint as a prior free trial account are not eligible for a new free trial.

---

## 7. Billing Rules

### 7.1 Billing Cycle

- **Anchor date:** The day of month on which the account was first charged (paid cycle start). Recharges occur on the same day each month.
- **Month definition:** Calendar month. For anchor dates of 29, 30, or 31, billing occurs on the last day of shorter months (e.g., anchor date 31 → February bill date is 28th or 29th).
- **First charge:** Full Research Budget amount (B), regardless of how far into a billing cycle the user signed up. No proration on first charge.
- **Subsequent charges:** Delta recharge (R = F + top_up) as defined in Section 3.

### 7.2 Currency

- All prices are denominated in **USD**.
- Users outside the US are charged in USD. Currency conversion is handled by the payment processor (Stripe) at the exchange rate at the time of charge.
- Caspr does not offer local-currency pricing at this time. This may change as regional volumes warrant.

### 7.3 Minimum Charge

The minimum monthly charge is the platform fee F = B × 0.07. For the minimum budget of $200, this is $14. No charge below $14 will be issued on an active paid account.

If the computed recharge R rounds to less than $0.50 (Stripe's minimum charge), the charge is deferred and accumulated to the following month's recharge.

### 7.4 Budget Changes

**Increase:**
- Effective: next billing cycle.
- Feature unlock: immediate on confirmation (no charge until next cycle).
- The user's current analysis balance and billing cycle are unaffected.

**Decrease:**
- Effective: next billing cycle.
- Feature revocation: end of current billing cycle.
- Cannot decrease below $200 (minimum budget).
- Cannot decrease below the current analysis balance (i.e., if the user has a $300 analysis balance, the minimum new budget is $323 = $300 / 0.93, rounded up to the next $1).
  *Rationale: analysis budget cap A = B × 0.93 must be ≥ current balance to avoid a logical inconsistency.*

**Cancellation:**
- User can cancel at any time.
- Access continues to the end of the current billing cycle.
- At cycle end: paid analysis balance is refunded (see Section 9). No further recharges.

### 7.5 Annual Commitment (Future — Not Currently Implemented)

Annual commitment is reserved for future implementation. When introduced:
- Billing remains monthly delta recharge.
- Committing to 12 months unlocks discounted analysis prices (e.g., Study $70 instead of $80).
- No prepayment required. Monthly charges continue unchanged.
- Early cancellation: standard prices applied retroactively to all analyses run in the commitment period. Difference billed as a one-time adjustment.

---

## 8. Payment Processing

### 8.1 Payment Methods

- Accepted: major credit and debit cards (Visa, Mastercard, Amex, Discover) via Stripe.
- Digital wallets (Apple Pay, Google Pay) accepted for free trial conversion and top-ups.
- Bank transfers (ACH, SEPA): available for Enterprise accounts on request ($1,800+ budget).
- Users may store one primary and one backup payment method.
- If primary payment fails, backup is attempted automatically before the retry sequence begins.

### 8.2 Failed Payment Handling

If a monthly recharge fails:

| Day | Action |
|---|---|
| Day 0 | Charge fails. Retry immediately (once). |
| Day 1 | Retry. Email notification to user: "Payment failed — please update your payment method." |
| Day 3 | Retry. Second email: "Action required — your Research Budget could not be recharged." |
| Day 5 | Retry. Third email (urgent): "Analysis access will be suspended in 2 days if payment is not resolved." |
| Day 7 | **Analysis access suspended.** User can view existing reports and account. No new analyses. Balance is preserved. Email: "Your account has been suspended due to non-payment." |
| Day 14 | Final notice: "Your account will be cancelled in 7 days." |
| Day 21 | **Account cancelled.** Paid analysis balance refunded automatically (see Section 9). |

- During the grace period (Day 0–7): if the user updates their payment method, the outstanding charge is retried immediately and the cycle resets.
- After suspension (Day 7–21): same — user can reinstate by updating payment method.
- After cancellation (Day 21+): account data retained for 90 days, then scheduled for deletion. User can reactivate within 90 days by contacting support; their balance history is restored but the forfeited balance is not.

### 8.3 Top-Ups

Users may top up their analysis balance at any time outside the monthly recharge cycle. **This is the single top-up mechanism for everything — analyses, outputs, and overflow edit credits alike (Joy, 2026-08-18). There is no separate "buy edit credits / tokens" flow.**
- **Amount (updated 2026-08-18):** the dialog **defaults to a tier-based amount — Professional $20 · Business $50 · Enterprise $100** — and the user can **adjust up or down in $10 increments** (minimum $10). *(Supersedes the earlier flat "$20 minimum"; presets on the Wallet top-up screen are $20 / $50 / $100 + Custom.)*
- Top-up credited directly to Paid Analysis Balance (does not affect the authorised Research Budget amount or billing anchor date). If a balance already exists, the top-up adds to it.
- Top-up is NOT subject to platform fee.
- Top-up balance is refundable if unused (subject to the same refund rules as Paid Analysis Balance).
- Top-up does not trigger feature milestone unlocks (only the authorised Research Budget amount determines milestones).

---

## 9. Refund Policy

### 9.1 Refundable Items

| Item | Refundable? | Conditions |
|---|---|---|
| Paid Analysis Balance (unused) | **Yes — always** | Refunded in full upon cancellation. Caspr does not retain unearned analysis funds. |
| Platform Fee (first charge only) | **Yes — within 7 days** | If the account is cancelled within 7 days of the very first paid charge, the platform fee for that cycle is refunded in full. This applies once per account, on initial charge only. |
| Platform Fee (ongoing) | **No** | Platform access, Monthly Brief, and Caspr Signals were available for the billing period. |
| Completed analyses | **No** | Output was delivered. Exception: if Caspr fails to deliver output due to a system error, the full analysis cost is credited back to the Paid Analysis Balance automatically. |
| Premium Data Add-on (data fetched) | **No** | Third-party data cost is incurred at the time of the query. |
| Premium Data Add-on (data fetch failed) | **Yes** | Add-on reservation released to balance if the data source fails to return data. |
| Free Trial Balance | **No** | Gifted — not refundable. |
| Promotional Credits | **No** | Gifted — not refundable. |
| Top-up Balance (unused) | **Yes** | Treated as Paid Analysis Balance. Refunded on cancellation. |

### 9.2 Refund Process

- Refunds are issued to the original payment method.
- Processing time: 5–10 business days (varies by card network and bank).
- If the original payment method is no longer valid (expired card, closed account): Caspr will issue a bank transfer or store credit at the user's election.
- Refunds are denominated in USD. The user's bank applies the prevailing exchange rate for non-USD accounts; Caspr is not responsible for exchange rate differences between charge and refund dates.

### 9.3 Refund Eligibility for Non-Delivery

If an analysis is initiated but fails to produce output due to a Caspr system error:
- The full analysis cost (base + any add-on) is credited to the Paid Analysis Balance automatically within 24 hours.
- No manual request required.
- The user is notified by email with the credit amount and new balance.

If a user believes an analysis produced materially incorrect output (factual errors, missing sections), they may submit a support request. Caspr will review. Discretionary credits may be issued at Caspr's judgment. This is not a guaranteed refund pathway.

### 9.4 Chargebacks & Disputes

- Caspr will contest chargebacks for delivered analyses with evidence of delivery (analysis logs, output metadata, IP/session data).
- If a chargeback is upheld by the card network: the account is immediately suspended pending investigation. Accumulated balance is frozen during the dispute period.
- Fraudulent chargeback attempts (where analysis output was received and used) may result in permanent account termination.

---

## 10. Edge Cases & Engineering Specifications

### 10.1 Insufficient Balance

Before starting any analysis:
```
required = analysis_cost + add_on_cost (if selected)
if total_spendable_balance < required:
    block analysis
    show: "You need $[shortfall] more to run this analysis. [Top up] [Choose a different analysis]"
```

`total_spendable_balance` = free_trial_balance + promo_balance + paid_analysis_balance

Do not allow analyses to begin if balance is insufficient. No overdraft. No deferred charging.

### 10.2 Analysis Reservation

```
// On analysis start:
reserve(analysis_cost + add_on_cost)
  → decrement spendable balance by reservation amount
  → hold in reserved_balance ledger
  → record reservation_id, analysis_id, timestamp

// On analysis completion:
finalise(reservation_id)
  → move from reserved_balance to revenue
  → deduct from balance ledger permanently

// On analysis failure (system error):
release(reservation_id)
  → move reserved amount back to paid_analysis_balance
  → notify user of credit

// On analysis failure (user cancellation mid-run):
[define separately — is user cancellation a refund event? Recommended: no refund if analysis is already in progress beyond X% completion threshold — engineering to define threshold]
```

### 10.3 Concurrent Analyses

- Multiple analyses may run concurrently if the combined reservation does not exceed the available balance.
- Team accounts (Enterprise): reservations are drawn from the shared pool. Per-user sub-limits, if set, are enforced per-user at reservation time.
- If a concurrent analysis would exceed the available balance: queue it. Do not partially reserve.

### 10.4 Analysis Initiated at Low Balance

If a user starts an analysis and their balance is exactly sufficient (e.g., $80 balance, $80 Study), the full balance is reserved. If a concurrent action (e.g., a team member's analysis) would then fail to reserve: it is queued, not silently failed. The user initiating the queued analysis is notified.

### 10.5 Premium Data Add-On — Partial Source Availability

If an analysis requires 2 premium sources and the user selects both, but only 1 source successfully returns data:
- Credit the failed source's cost back to balance automatically.
- Allow the analysis to continue with the available source.
- Notify the user: "One premium data source was unavailable. $[X] has been credited back to your Research Budget."

### 10.6 Budget Increase — Balance Cap Adjustment

When a user increases their Research Budget (e.g., $200 → $600):
- New A = $600 × 0.93 = $558 (effective from next billing cycle).
- Current analysis balance is unaffected until next billing cycle.
- At next billing cycle: recharge formula applies with new B = $600.
- If current balance > new A (unlikely, but possible with promo credits): no top-up; charge platform fee only.

### 10.7 Budget Decrease — Balance Cap Floor

```
minimum_new_budget = ceil(current_analysis_balance / 0.93)
// User cannot set budget below this amount.
// Prevents a logical state where balance > cap.
```

### 10.8 Free Trial Conversion

```
// On user confirming first paid Research Budget:
expire(free_trial_balance)  // set to 0, non-refundable
create_paid_account(budget=B, anchor_date=today)
charge(B)  // first full charge
set analysis_balance = B × 0.93
```

No carryover of free trial balance to paid account.

### 10.9 Promotional Credits

```
promo_credit {
  amount: decimal
  issued_date: date
  expiry_date: date  // default: issued_date + 90 days
  reason: string     // e.g., "referral", "campaign_Q1_2026"
  refundable: false
}
```

On expiry: balance forfeited silently. No notification required (though a 7-day pre-expiry reminder email is recommended to drive engagement).

Consumed before paid balance in analysis charges. Not included in cancellation refund calculation.

### 10.10 Refund on Cancellation — Calculation

```
refund_amount = paid_analysis_balance + unused_top_up_balance
// Excludes: free_trial_balance, promo_balance, platform_fees_paid

if (cancellation_within_7_days_of_first_ever_charge AND first_paid_cycle):
    refund_amount += platform_fee_charged_this_cycle
```

### 10.11 Account Reinstatement After Cancellation

- Within 90 days of cancellation: user may reinstate account. Billing anchor resets to reinstatement date. New first charge = full B. Prior analysis history and saved reports are restored.
- After 90 days: account and data scheduled for deletion. No reinstatement.

### 10.12 Multiple Accounts

One free trial per person/entity. Matching criteria (any one of): email address, verified payment method, device fingerprint. If duplicate detected: second account does not receive free trial; support team notified.

### 10.13 Intelligence À La Carte — Payment

Charged as a one-time payment; not drawn from Research Budget or any balance ledger. Processed immediately on user confirmation. Refundable only if analysis fails to deliver output (system error).

---

## 11. Tax & Global Compliance

### 11.1 General Approach

Caspr uses Stripe Tax for automated calculation and collection. Tax is calculated at checkout based on the user's billing address. Prices displayed on the pricing page are exclusive of tax. Tax is shown as a separate line at checkout.

### 11.2 Jurisdiction-Specific Notes

| Region | Tax type | Rate | Notes |
|---|---|---|---|
| **United States** | Sales tax (varies) | 0–12% | Only certain states tax SaaS. Stripe Tax handles per-state rules. |
| **European Union** | VAT | 15–27% (local rate) | B2B: reverse charge applies if user provides a valid VAT number. B2C: charge local rate. EU OSS applies. |
| **United Kingdom** | VAT | 20% | Applies to both B2B (no reverse charge for UK post-Brexit) and B2C. |
| **Australia** | GST | 10% | Applies to digital services supplied to Australian residents. |
| **Canada** | GST/HST | 5–15% (varies by province) | Stripe Tax handles. |
| **UAE** | VAT | 5% | Applies to digital services. Caspr may need UAE VAT registration above registration threshold. |
| **India** | GST | 18% | Complex: also subject to TDS (Tax Deducted at Source) under Section 194-O for platform transactions. Indian users may require local payment processing entity. Flag for legal review before launch in India. |
| **Singapore** | GST | 9% | Applies to B2C digital services from overseas suppliers. Stripe Tax handles. |

### 11.3 VAT/GST Number Collection

- At signup, B2B users may provide a VAT/GST/tax registration number.
- Validated via Stripe's tax ID validation. If valid: reverse charge or zero-rate applied as appropriate.
- Invalid or absent tax ID: local tax rate applied.
- Tax invoices are issued automatically by Stripe and available in the user's billing dashboard.

### 11.4 Refunds and Tax

When refunding the Paid Analysis Balance:
- If tax was charged on the original payment: the tax portion is refunded proportionally.
- Example: user in Germany (19% VAT) paid $200 + $38 VAT = $238 total. Refund of $100 analysis balance = $100 + $19 VAT refunded = $119 total.
- Stripe handles the tax reclaim in the refund flow automatically.

### 11.5 Data Residency & Privacy

- EU/UK users: data processed under GDPR. Data Processing Agreement (DPA) available on request.
- Account deletion requests: processed within 30 days per GDPR Article 17. Anonymised transaction records (amounts, dates, no PII) retained for 7 years for accounting compliance.
- India: data localisation requirements may apply. Flag for legal review.

---

## 12. Retention Features

These features are part of the paid account and drive re-engagement. Engineering specs below.

### 12.1 Caspr Monthly Brief

- Every active account (including free trial and lapsed) receives one auto-generated Brief per month at no charge to their analysis balance.
- User selects a standing topic at onboarding (e.g., "Electric Vehicles in Southeast Asia"). Can be changed from the dashboard at any time.
- Auto-trigger: on the 1st of each month, the system initiates a Brief on the saved topic without user action.
- Delivered by email as a PDF attachment + link to the report in the dashboard.
- Brief ends with 3 suggested follow-up questions: *"Run a full Study on [topic]?"*
- Cost: compute cost absorbed by Caspr (not charged to analysis balance).
- If auto-trigger fails (system error): retry within 24 hours. If retry fails: skip that month's brief for that user (do not backfill).

> **[JAYANT]** Can the system auto-trigger a Brief on a saved topic without user input? What is the infrastructure cost at 1,500+ users from day one?

### 12.2 Caspr Signals

- Weekly email digest of 3–5 developments on each of the user's watched topics.
- A lightweight source-and-summarise pass — not a full analysis.
- Watched topic limits: 1 topic on Professional milestone, 3 topics on Business+.
- Each digest item includes a link that pre-populates a Study prompt in the dashboard (one click to initiate).
- Cost: compute cost absorbed by Caspr.
- Frequency: weekly, delivered on a consistent day (e.g., Monday morning user's local time).
- Users can pause or unsubscribe from Signals without affecting their account.

> **[JAYANT]** What is the compute cost of a lightweight weekly data pull + short summary per watched topic? If substantially below a Brief, Signals can scale to all users at negligible marginal cost.

### 12.3 Research Budget Rollover

The rollover mechanic is built into the core billing formula (Section 3). No separate engineering work required beyond the delta recharge calculation. Unused analysis balance automatically carries forward; the recharge only restores what was consumed. This is the default behaviour of the model — not a separate feature to build.

---

## 13. Technical Validation Required

Items pending confirmation from Jayant before finalising:

| # | Question | Impacts |
|---|---|---|
| 1 | Actual compute cost per Brief (P50 and P95)? | Viability of $15 price point |
| 2 | Actual compute cost per Study (P50 and P95)? | Viability of $80 price point |
| 3 | Actual compute cost per Intelligence (P50 and P95)? | Viability of $300 price point |
| 4 | P95 cost spread — how much more expensive is a worst-case analysis vs. average? | Whether P85 pricing absorbs the tail or needs a hard cost cap per tier |
| 5 | Which paid APIs are planned for integration, and at what per-call cost? | Premium Data Add-on price range ($20–$60) |
| 6 | Can the system detect premium data requirements before running and surface cost upfront? | Viability of opt-in Premium Data Add-on mechanic |
| 7 | Is Intelligence (multi-model challenge) implemented, in development, or conceptual? | Whether to launch Intelligence at product launch or gate it |
| 8 | Is per-analysis billing infrastructure built (balance ledger, reservation system)? | Timeline for new pricing launch |
| 9 | Can Monthly Brief auto-trigger at 1,500+ users from day one? At what compute cost? | Viability of retention feature at scale |
| 10 | Can Signals be run at substantially lower compute cost than a Brief? | Viability of weekly cadence at scale |
| 11 | What is the current average cost per report under the token model? | Baseline to validate proposed tier prices |
| 12 | Compute cost of a **re-analysis** (re-run on existing scope + cached corpus) vs. a fresh run? | Whether the 50% standard / 20%-off academic re-analysis price holds margin |
| 13 | Cost per **output generation** (assemble + render one PDF vs PPTX vs XLSX via the output API, visuals already produced)? | Validates margin on the per-output prices ($5 docs/data · $10 slides — §4.6-B) |
| 14 | Per-generation cost of a **bespoke image** vs. a **bespoke infographic** (post token-cap)? | Confirms the edit-credit rate (≈ 1,000 credits ≈ $1; image/infographic regen ≈ 500 credits) holds margin (§4.6-A) |
| 15 | Can the analysis be **generated natively in the user's language** (not English→translate)? And cost of an **additional-language** output vs a same-language re-gen? | Whether the multilingual base is cost-free (§4.6-B), and whether additional languages need a per-language premium |

---

## 14. Pricing Summary (Quick Reference)

| Item | Price |
|---|---|
| Brief (all types) | $15 |
| Study | $80 |
| Intelligence (in-budget) | $300 |
| Intelligence (à la carte) | $399 |
| Re-analysis (standard) | 50% of fresh depth price — Brief $8 · Study $40 · Intelligence $150 |
| Re-analysis (academic) | 20% off academic price — Brief $6 · Study $32 |
| Premium Data Add-on | $20–$60 (varies by source) |
| Edit credits included (per analysis) | Brief 15,000 · Study 80,000 · Intelligence 300,000 |
| Edit-credit overflow | Draws the same Research Budget / wallet balance (~1,000 credits ≈ $1) — no separate pool |
| Top-up (one mechanism: analyses + outputs + edits) | Tier-default $20 / $50 / $100, adjustable ± $10 ($10 min); adds to balance |
| Output base (included) | The tier's committed set — Brief MD·PDF · Study/Intelligence MD·PDF·PPTX·XLSX·CSV — in the user's native language |
| Additional outputs (per output, value-priced) | PDF·DOCX·XLSX·CSV **$5** · PPTX **$10** · MD free · +language = per-output |
| **Custom template — one-time setup, per template** | **$1,000** · three for **$2,500** · Business and above may purchase · **Enterprise includes the first** · Phase 1.5 |
| Platform fee | 7% of Research Budget (internal — not user-facing) |
| Minimum Research Budget | $200/month |
| Free Trial | $100 gifted, no credit card, 90-day expiry |
| Professional milestone | $200 budget |
| Business milestone | $600 budget |
| Enterprise milestone | $1,800 budget |
| **— Academic Tier —** | |
| Academic Brief | $8 |
| Academic Study | $40 |
| Academic Intelligence | Not available |
| Academic platform fee | Waived |
| Academic free trial | $150 gifted, no credit card, 90-day expiry |
| Academic billing model | Top-up only (no subscription) — minimum top-up $20 |
| Academic Club minimum pool budget | $100/month |
| Research Dollars lifetime cap | $200 per Academic Account |
| Share Card engagement threshold | 10 unique events (30-day window) |
| Graduation conversion credit | $100 promotional credit, 180-day expiry |

---

## 15. Academic Tier

### 15.1 Overview

The Academic Tier provides verified students at accredited institutions with access to Caspr at discounted per-analysis pricing, no platform fee, and no subscription requirement. Two account structures exist: an individual Academic Account and a shared Academic Club Account. Both are governed by this section in addition to general rules in Sections 2–14 where not superseded.

**Key differences from standard accounts:**

| Parameter | Standard Account | Academic Account | Academic Club Account |
|---|---|---|---|
| Analysis prices | Standard (§4.1) | Brief $8, Study $40 | Brief $8, Study $40 |
| Intelligence | Available | Not available | Not available |
| Platform fee | 7% of Research Budget | Waived | Waived |
| Billing model | Monthly subscription (min. $200) | Top-up only, no subscription | Monthly pooled budget (min. $100) |
| Free trial | $100 gifted | $150 gifted | N/A (pool is admin-funded) |
| Minimum top-up | $20 | $20 | $20 (pool top-up) |
| Research Dollars | Not applicable | Up to $200 lifetime | Up to $200 (admin's personal account) |
| Graduation conversion | Not applicable | Automatic on trigger | N/A |

---

### 15.2 Academic Account Eligibility and Verification

#### Tier 1 — Auto-approved domain patterns

Accounts created with an institutional email matching any of the following domain suffix patterns are automatically granted Academic status on email verification click. No additional steps required.

Approved suffixes: `.edu` `.ac.uk` `.edu.au` `.ac.nz` `.edu.sg` `.edu.in` `.ac.in` `.edu.cn` `.edu.hk` `.ac.za` `.edu.mx` `.edu.br` `.ac.jp` `.ac.at` `.ac.be` `.edu.bg` `.ac.cy` `.edu.ee` `.edu.fi` `.edu.fr` `.ac.de` `.edu.it` `.edu.es` `.edu.nl` `.edu.se` `.edu.dk` `.edu.pl` `.edu.pt` `.edu.gr` `.edu.hu` `.edu.ro`

In addition, all domains in the Hipo university-domains-list repository (9,600+ institutions globally) are pre-approved at Tier 1 at launch. This list is imported at deployment and refreshed quarterly.

#### Tier 2 — Institutional email, unlisted domain

Any institutional email domain not in the Tier 1 list that (a) successfully receives a Caspr verification email and (b) the student clicks the verification link is admitted to Academic tier. The domain is added to the Tier 2 whitelist automatically on first successful verification. Future signups from the same domain are promoted to Tier 1 at the next quarterly refresh.

#### Document Request — No institutional email

For students whose institution does not issue distinct institutional email addresses, two paths exist:

**Path A — Student Document Request**

Student submits via `caspr.ai/academic/verify`:
- University name
- Personal email address (used as account email)
- One supporting document: student ID card, current enrolment letter, or tuition fee receipt. Must show name + institution name + current academic year.

Review SLA: 48 hours. On approval: account created with Academic status. `academic_verification.expiry_date` set to stated graduation year + 6 months. On rejection: applicant notified with reason.

**Path B — University Domain Activation (Institution-Initiated)**

An institution's IT administrator, student services representative, or student union officer may submit a domain activation request via `caspr.ai/academic/institution`. On approval: all students at that institution gain Tier 2 auto-verification immediately. Domain activation is permanent unless revoked for abuse. Caspr may proactively solicit domain activations from target institutions as part of club partnership outreach.

#### Verification record

```
academic_verification {
  status:            enum('tier1', 'tier2', 'document_approved', 'pending', 'none', 'graduated', 'revoked')
  verified_domain:   string | null
  verified_email:    string
  verification_date: date
  institution_name:  string | null   // populated for document requests and domain activations
  expiry_date:       date | null     // null for Tier 1/2; set for document accounts
}
```

---

### 15.3 Academic Pricing and Billing Model

#### Analysis prices

| Analysis | Academic price | Notes |
|---|---|---|
| Brief | $8 | All four Brief types available |
| Study | $80 → **$40** | Standard price discounted 50% |
| Intelligence | **Not available** | See §15.9, Edge Case 1 |
| Premium Data Add-on | $20–$60 (standard rate) | Not discounted — third-party cost passed through |

#### No subscription model

Academic Accounts do not set a Research Budget and do not enter the monthly subscription billing cycle. The "set a Research Budget to continue" gate shown to standard accounts on free trial exhaustion is **bypassed** for Academic Accounts. After free trial exhaustion, Academic Account holders add funds via top-up only (§8.3 rules apply; minimum $20; no platform fee on top-up).

Analysis balance spend order is unchanged (§3.3): Free Trial Balance → Promotional Credits (Research Dollars) → Paid Analysis Balance.

#### Free trial

Academic Accounts receive **$150 gifted** at account creation (vs. $100 standard). All free trial rules in §6 apply with this modification only. The `account_type = 'academic'` flag determines the gifted amount at issuance.

#### Feature availability

Academic Accounts do not have milestone thresholds. Feature set is fixed:

| Feature | Academic Account |
|---|---|
| Brief | ✓ |
| Study | ✓ |
| Intelligence | ✗ |
| Data upload | ✗ |
| Output editing / section refinement | ✗ |
| Follow-up queries | ✗ |
| Caspr Monthly Brief (§12.1) | ✓ |
| Caspr Signals — 1 topic (§12.2) | ✓ |
| SSO / API | ✗ |

---

### 15.4 Academic Club Account

#### Structure

An Academic Club Account is created by a verified Academic Account holder ("club admin") on behalf of a recognised student club or society. It uses the Enterprise pooled-budget mechanics (§5.2) with Academic pricing and no platform fee.

```
academic_club {
  club_id:                        uuid
  club_name:                      string
  admin_account_id:               uuid        // must be a verified Academic Account
  members:                        [account_id] // verified Academic Accounts only
  pool_budget:                    decimal     // monthly pooled budget (min. $100)
  pool_balance:                   decimal     // current spendable pool balance
  activation_status:              enum('pending', 'active', 'suspended', 'dissolved')
  activation_threshold_reached:   boolean     // true when 20th member runs first analysis
  bonus_awarded:                  boolean     // true when $20 pool bonus has been issued
  created_date:                   date
}
```

#### Minimum activation threshold

The club account is considered activated when **20 members** have each run at least one analysis. The $20 Research Dollar pool bonus is issued automatically when the 20th qualifying member completes their first analysis. The threshold is a one-time event — it does not reverse if membership later drops below 20.

#### Club pool billing

```
// Club pool recharge (monthly — no platform fee):
pool_top_up      = max(0, pool_budget − pool_balance)
club_monthly_charge = pool_top_up    // no platform fee; minimum charge is $0
```

The club admin may top up the pool at any time (minimum $20, same as §8.3). Email notification to club admin when pool balance drops below $20.

#### Club admin benefit

The club admin's personal Academic Account receives **$50 in Research Dollars** per month, issued automatically on the club's billing date while the club account is active and the admin holds admin status. These credits expire 180 days from issuance. Credits are drawn from Caspr (not from the club pool).

#### Member access

- Members join via invite link generated by the club admin.
- Only verified Academic Accounts may join.
- Per-user sub-limits: optional, same mechanic as §5.2.
- All analyses by members are drawn from the club pool at Academic prices.
- Club admin's personal analyses are drawn from their personal account balance (not the club pool).

---

### 15.5 Research Dollars Programme

Research Dollars are promotional credits issued to Academic Account holders through automated earn events. Governed by §10.9 with the following modifications:

- **Expiry:** 180 days from issuance (not standard 90 days)
- **Lifetime cap:** $200 in total earned Research Dollars per account (historical total, including expired — see enforcement logic below)
- **Ledger tag:** `reason: 'research_dollars'`
- **Scope:** Individual Academic Accounts only. The club pool bonus ($20) is a separate pool-level promotional credit, not counted toward the individual cap.

#### Earn events — all fully automated

| Event | Amount | Trigger |
|---|---|---|
| Referral signup | $15 | New account created via referring student's referral link |
| Referral activation | $10 | Referred account completes its first analysis |
| Onboarding completion | $5 | Profile fully completed AND first Caspr Signals topic saved |
| Club activation | $20 (to club pool) | 20th club member completes their first analysis |
| Share Card engagement | $10 | Share Card reaches 10 unique engagement events (§15.6) |

#### Lifetime cap enforcement

```
// Before issuing any Research Dollars earn event:
total_earned = SUM(amount)
               FROM promo_credits
               WHERE account_id = this_account
                 AND reason = 'research_dollars'
               // includes expired credits — lifetime total, not current balance

if total_earned + earn_amount > 200:
    earn_amount = max(0, 200 − total_earned)
    // Issue partial amount if cap would be exceeded
    // Issue nothing if cap already reached
```

---

### 15.6 Share Card

#### Generation

- Available to any Academic Account holder from any completed analysis in their dashboard.
- **One Share Card per analysis.** A new card cannot be generated for the same analysis (prevents tracking-reset gaming).
- Card contents: analysis title, one auto-selected key insight from the executive summary, university name (user opt-in), "Analysed with Caspr Academic" badge, unique tracked short link (`caspr.ai/s/[unique-id]`).
- Format: PNG image file, downloadable for sharing on any platform.
- Expiry: **30 days** from generation. After expiry the tracked link resolves to an acquisition landing page, not a 404.

#### Engagement tracking and uniqueness

```
share_card {
  card_id:                  uuid
  owner_account_id:         uuid
  analysis_id:              uuid
  owner_fingerprint:        string    // device fingerprint + IP hash at generation time
                                      // clicks from this fingerprint are never counted
  created_at:               datetime
  expires_at:               datetime  // created_at + 30 days
  unique_engagement_count:  integer
  threshold_reached:        boolean   // true when unique_engagement_count >= 10
  earn_event_fired:         boolean
}

share_card_event {
  card_id:            uuid
  timestamp:          datetime
  ip_hash:            string    // SHA-256 of IP address — not stored raw
  device_fingerprint: string
  counted:            boolean   // false if: duplicate within 24h, owner fingerprint, or card expired
}
```

**Uniqueness rule:** An engagement event is counted as unique if the `(ip_hash, device_fingerprint)` combination has not been seen for this `card_id` within the preceding **24-hour window**. One device+IP counts once per 24 hours per card.

**Owner exclusion:** Clicks from the card owner's `owner_fingerprint` are never counted, regardless of IP.

**Threshold:** 10 unique engagement events. On the 10th event: `earn_event_fired = true` and $10 Research Dollars are issued (subject to lifetime cap in §15.5). The earn event fires exactly once per card — further engagement events are recorded but do not trigger additional credits.

**Progress visibility:** The card owner's dashboard shows real-time progress: *"X of 10 clicks received."* Counter stops incrementing after earn event fires or card expires.

---

### 15.7 Graduation Conversion

#### Trigger conditions

Graduation conversion fires when any of the following occurs on an Academic Account:

1. **Email hard bounce:** The verified academic email returns a permanent failure (550 / 5.1.1 / user-not-found) on any system-generated send. **30-day grace period** applies: user is notified and prompted to verify a new institutional email. If verified within 30 days, grace period resets. If not, conversion fires at grace period end.

2. **Profile-initiated transition:** User updates their account profile with an employer name and a non-academic primary email address.

3. **Expiry date reached (document accounts only):** The `expiry_date` field in `academic_verification` is reached (graduation year + 6 months).

#### Conversion sequence

```
// On graduation conversion trigger:

// 1. Wait for any in-progress analysis to complete (do not interrupt)
//    If an analysis reservation is active: defer conversion until reservation finalises or releases

// 2. Update account type
account.type                       = 'standard'
academic_verification.status       = 'graduated'

// 3. Retain all existing balances — do not zero out
//    Research Dollars in promo_balance: unchanged, retain original 180-day expiry dates
//    Paid Analysis Balance: unchanged and refundable as per §9

// 4. Issue graduation credit (one-time — check before issuing)
if NOT EXISTS (SELECT 1 FROM promo_credits
               WHERE account_id = this_account AND reason = 'graduation_conversion'):
    issue_promo_credit(
      account_id,
      amount  = 100,
      reason  = 'graduation_conversion',
      expiry  = today + 180 days
    )

// 5. Send graduation conversion email
send_email('graduation_conversion_notice', {
  credit_amount:       100,
  credit_expiry:       today + 180 days,
  professional_url:    'caspr.ai/pricing'
})

// 6. On next login: prompt user to set a Research Budget
//    (standard account requires subscription to run analyses after balance exhaustion)
```

**Post-graduation pricing:** Standard analysis prices apply immediately on conversion. Academic prices no longer apply even when spending Research Dollars earned as a student (§15.9, Edge Case 4).

---

### 15.8 Academic Club Dissolution and Admin Transition

#### Club admin graduation or departure

When the club admin triggers graduation conversion or manually removes themselves as admin:

1. System checks for an eligible successor: another club member with Academic Account status.
2. If successor identified: admin role transferred; both parties notified.
3. If no successor: club account enters a **30-day suspension**. Analyses blocked. Members notified. Existing reports remain accessible.
4. If no new admin is assigned within 30 days: club is dissolved. Paid pool balance is refunded to the outgoing admin's payment method. Research Dollar pool credits are forfeited (non-refundable).

#### Voluntary dissolution

Club admin may dissolve the club at any time from the dashboard:
- Paid pool balance (monthly charges and top-ups): **refunded in full**
- Research Dollar pool credits: **non-refundable** (forfeited)

---

### 15.9 Academic Tier — Edge Cases and Engineering Specifications

**Edge Case 1: Intelligence analysis attempt on Academic Account**
```
if account.type == 'academic' AND analysis.type IN ('intelligence', 'intelligence_alacarte'):
    block analysis
    show: "Intelligence analyses are available on Professional accounts and above.
           Upgrade your account to access Intelligence."
    // À la carte Intelligence is also blocked — no price point exists for academic Intelligence
```

**Edge Case 2: Academic account attempting to set a Research Budget subscription**
```
if account.type == 'academic' AND user initiates 'set_research_budget' flow:
    redirect to top-up flow
    show: "Academic accounts add funds as needed — no monthly subscription required.
           Add a minimum of $20 to continue."
```

**Edge Case 3: Free trial exhausted on Academic Account**
```
// Academic accounts do NOT hit the standard 'set Research Budget' gate on trial exhaustion.
if account.type == 'academic' AND all_balances == 0:
    block analysis
    show: "Your Research Budget is empty. Add funds to continue."
    CTA: top-up flow (minimum $20)
    // Do NOT show: "Set your monthly Research Budget"
    // Do NOT prompt for a subscription
```

**Edge Case 4: Research Dollars spent post-graduation at standard prices**
```
// Research Dollars earned during academic period retain their balance and expiry on graduation.
// Post-graduation, analyses are charged at STANDARD prices.
// Research Dollars cover the standard price, not the academic price.
// Example: $40 Research Dollars remaining. User runs a Study post-graduation.
//   Standard Study = $80. Research Dollars cover $40. Remaining $40 from paid balance.
//   Academic price ($40) does NOT apply post-graduation.
```

**Edge Case 5: Share Card — owner self-click prevention**
```
// At card generation: record owner_fingerprint (device fingerprint + IP hash).
// On each engagement event: if event fingerprint matches owner_fingerprint → counted = false.
// Owner's clicks never count toward the 10-event threshold regardless of IP.
```

**Edge Case 6: Share Card — engagement after expiry**
```
// After 30-day expiry: tracked link resolves to acquisition landing page.
// Engagement events after expiry: counted = false. Threshold cannot be reached post-expiry.
// If threshold was reached before expiry: earn event already fired — no action needed.
// If threshold was not reached before expiry: earn event is not fired. $10 not awarded.
```

**Edge Case 7: Club pool insufficient for member analysis**
```
if club_pool_balance < analysis_cost:
    block analysis
    show (to member):  "Club Research Budget is insufficient. Contact your club admin to add funds."
    notify (to admin): "A member attempted an analysis but the pool balance is too low.
                        Current balance: $[X]. Add funds to restore access."
```

**Edge Case 8: Club monthly charge of $0**
```
// If no analyses were run: pool_balance == pool_budget (unchanged).
// pool_top_up = max(0, pool_budget − pool_balance) = 0.
// No charge issued to club admin's payment method.
// Academic Club accounts have no platform fee minimum — $0 charge is correct and expected.
// Contrast with standard accounts: minimum charge is always F = B × 0.07.
```

**Edge Case 9: Fraudulent Academic Account (non-student detected)**
```
if fraud_confirmed:
    account.type                   = 'standard'
    academic_verification.status   = 'revoked'
    // Zero out remaining Research Dollars in promo_balance (reason = 'research_dollars')
    // Prior completed analyses: NOT refunded (output was delivered)
    // Free trial balance already consumed: not affected
    notify: user ("Your Academic status has been removed. Standard pricing applies from [date].")
    flag: support_review_queue
```

**Edge Case 10: Multiple academic email addresses, one person**
```
// Standard duplicate detection (§10.12) applies.
// One Academic Account per person regardless of number of .edu addresses owned.
// Matching: device fingerprint, payment method (if added), email domain patterns.
// Second academic account: academic benefits not granted; support notified.
```

**Edge Case 11: Premium Data Add-on on Academic Account**
```
// Premium Data Add-ons are available to Academic Accounts.
// Add-on prices are NOT discounted — standard rates ($20–$60).
// Total required = analysis_cost (academic) + add_on_cost (standard).
// If total_spendable_balance < total_required: block. Prompt to top up.
// Add-on rules in §4.4 apply unchanged.
```

**Edge Case 12: Graduation conversion with in-progress analysis**
```
// If any graduation trigger fires while an analysis reservation is active:
//   Defer conversion. Set pending_graduation = true.
//   On reservation finalise or release: execute conversion sequence immediately.
// No analysis is mid-priced. Academic price applies to the in-progress analysis
// because the reservation was made at academic prices before conversion fired.
```

**Edge Case 13: Referral earn event where both parties are Academic Accounts**
```
// Referral earn events ($15 on signup, $10 on first analysis): paid to the REFERRER only.
// The referred account receives the standard Academic free trial ($150) — not an additional bonus.
// The two earn events are independent of whether the referred account is academic or standard.
```

**Edge Case 14: Club size drops below 20 after activation**
```
// Club activation is a one-time threshold event — it does not reverse.
// If membership drops below 20 after activation: club remains active.
// The $20 pool bonus already awarded is not reversed.
// Remaining members continue to draw from the pool at academic prices.
```

**Edge Case 15: Academic account with Tier 2 domain later promoted to Tier 1**
```
// When a Tier 2 domain is promoted to Tier 1 (quarterly refresh or manual addition):
// Existing accounts verified under Tier 2 from that domain: no change required.
//   academic_verification.status remains 'tier2' — the account is already verified.
// New signups from that domain: auto-admitted at Tier 1 going forward.
```

---

## Update — output base clarified (2026-08-18)

**Changed:** §4.6-B and §14 previously stated the included output base as **"ALL formats — MD·PDF·PPTX·XLSX·CSV"**
with no tier qualifier. That contradicted `docs/product/gate-output-spec.md` §4, which restricts Brief to
**PDF · MD**.

**Resolved by Joy (2026-08-18) in favour of `gate-output-spec.md`:** "all outputs" means all *committed* outputs
— **the tier's set**, not every format. **A Brief does not ship a deck.** A Brief requested as PPTX is an
out-of-tier format and is charged at the per-output price.

**Sections touched:** §4.6-B base bullet and the charged-beyond list (now names out-of-tier formats explicitly) ·
§14 Pricing Summary "Output base (included)" row.

**Nothing else changed** — per-output prices, the multilingual-by-default rule and the native-language base are
all unaffected.

*Flagged for Jayant's team: the gate's included-set logic should read from the tier table in
`gate-output-spec.md` §4, which was already correct.*
