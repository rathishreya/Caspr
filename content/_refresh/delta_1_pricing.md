# Delta 1 — Pricing

*Audit of `.agents/pricing-model.md` (last updated 2026-08-18) and `docs/app-handoff/EDIT-ECONOMICS.md` (locked model v1, 2026-08-15) against `content/_refresh/current_assumptions.md`'s pricing section.*

---

## CURRENT FACTS

**Model:** Research Budget model. One monthly number funds platform access + analyses. No separate subscription fees, no seat charges, no token metering of the underlying LLM. "One number. One charge. No line items."

**Core formula:**
- Platform Fee `F = B × 0.07` (always charged, never shown to the user as a line item)
- Analysis Budget Cap `A = B × 0.93`
- Monthly Recharge `R = F + top_up`, where `top_up = max(0, A − analysis_balance)`
- Minimum monthly charge = F (e.g. $14 on a $200 budget). Maximum monthly charge = B.
- Unused analysis balance carries forward automatically — the recharge only restores what was consumed ("delta recharge").

**Free Trial (standard):**
- **$100 gifted Research Budget.** Platform fee waived — full $100 usable.
- **No credit card required.**
- **Expires 90 days** from account creation; unused balance forfeited at expiry.
- On converting to paid: trial balance expires immediately, no carryover.
- One free trial per person (matched by email, payment method, or device fingerprint).

**Analysis (depth) prices:**
| Depth | Price | Notes |
|---|---|---|
| Brief | **$15** | 3–5 pages, 10 types, sourcing stage, ~15 min |
| Study | **$80** | Full assessment stage engagement, 1–2 hrs |
| Intelligence | **$300 in-budget / $399 à la carte** | Multi-model challenge, up to 24 hrs. À la carte available to *all* users incl. free trial/expired accounts, one-time card charge, not drawn from any balance |
| Premium Data Add-on | **$20–$60** | Optional, price shown pre-run, opt-in |

**Re-analysis (Updates tab re-run — Phase 2, "Coming soon," pricing locked but not yet live):**
- Standard: **50% of fresh depth price** — Brief $8 · Study $40 · Intelligence $150
- Academic: **20% off academic price** — Brief $6 · Study $32

**Feature Milestones (unlocked by *authorised* budget, not current balance):**
| Milestone | Threshold | Unlocks |
|---|---|---|
| Professional | $200+ | Brief, Study; solo use; Monthly Brief; Caspr Signals (1 topic) |
| Business | $600+ | + Intelligence; data upload; output editing; section refinement; follow-up queries; Caspr Signals (3 topics) |
| Enterprise | $1,800+ | + team seats (pooled budget, 3 default); SSO; API; priority support; dedicated onboarding |

- Minimum budget $200. No hard maximum (custom Enterprise budgets >$10,000/mo need manual approval).
- Upgrade: feature unlock immediate, new budget amount takes effect next cycle. Downgrade: feature revocation at end of current cycle.

**Output pricing (rendered deliverables — per Jayant's output API):**
- **Included in the analysis price:** the tier's committed set, generated natively in the user's language (no translation surcharge for own-language). **Brief = PDF·MD. Study/Intelligence = PDF·PPTX·XLSX·CSV·MD.** A Brief does not ship a deck — PPTX on a Brief is out-of-tier and charged.
- **Charged per output beyond the base** (out-of-tier format, each additional language, re-generations after edits):
  | Output | Price |
  |---|---|
  | PDF · DOCX · XLSX · CSV | **$5** |
  | PPTX (slides) | **$10** |
  | MD | **free**, all tiers |
- No quota, no top-up pack for outputs — prices sum per-output into the Generate button total. (This retired the earlier Brief-0/Study-5/Intelligence-10 free-output-count model.)

> **✅ CONFLICT RESOLVED (2026-08-18) — read this first.** The two mechanics below have been **unified into one edit-credit model**; the count model (`§4.6-A` "Brief 2 · Study 10 · Intelligence 25 · $5 per 10") is **retired**. Landed model: edit **credits** included per analysis — **Brief 15,000 · Study 80,000 · Intelligence 300,000** (Joy, 2026-08-18); user-chosen **$5-increment** top-ups, cross-report; **no live counter** (calm balance, edge-only prompt); charts free, image/infographic generation draws credits (≈500 each). Authority: `EDIT-ECONOMICS.md` + `pricing-model.md` §4.6-A (both now consistent). **Editing copy IS now publishable** — the "do not publish a specific top-up mechanic" holds below are lifted. The two "TBD" bullets at the end of this doc (allowance sizes; pack-vs-increment) are **resolved**.

**Editing / revision economics — the two source mechanics, now unified (history retained below for context):**

1. `pricing-model.md` §4.6-A, "Visual revisions": charts + templated infographics are free/unlimited; only a *model-generated* image/infographic consumes a revision. **Included per analysis: Brief 2 · Study 10 · Intelligence 25. Top-up: $5 per 10 revisions (flat pack).**

2. `EDIT-ECONOMICS.md` (locked model, numbers illustrative pending Jayant): a broader **three-bucket edit classification**, of which visual regen is one case:
   - **Minor** (inline, no regen — reword/reorder/re-emphasize/re-plot a chart): **free, unlimited**, UI explicitly shows **"0 tokens."**
   - **Substantial** (a regeneration — section/visual/layout change, may pull new data, but analysis *identity* unchanged): **metered in edit tokens**, drawn from the report's bundled allowance.
   - **New** (identity change — subject/industry/geography/analysis-type expands or switches): hands off to a **new analysis** at the gate, priced as: same-scope refresh 50% (Brief $8/Study $40/Intelligence $150, same numbers as re-analysis above) · new-scope full price · tier-change full price. Narrowing scope (e.g. "Saudi & UAE → UAE only") stays Substantial, not New.
   - **Currency = edit tokens**, not a flat "revision" unit. Anchor: **image/infographic regen ≈ $0.50 ≈ ≤500 tokens; ~$1 ≈ 1,000 tokens.** Text edits cost less; big multi-section changes cost more. Utilization is actual/metered per API call, not pre-quoted.
   - **Two pools → unified to money (Joy, 2026-08-18):** a **free allowance bundled per report** (Brief 15k · Study 80k · Intelligence 300k credits) usable only on that report, spent first; then **overflow draws the one account money balance** (Research Budget / wallet) — **not** a separate purchased-token pool. Top-up = the Wallet top-up ($20/$50/$100 tier-default, $10 increments).
   - Charts are **never** metered, in any framing.
   - No live ticking meter; a prompt appears only when an edit would exceed remaining balance ("top up $10 to continue").
   - Margin: Jayant's API returns already-marked-up token numbers; product records/charges as-is, no product-side margin logic.
   - Visual staleness: a Minor text edit can leave an infographic stale; user is offered "Refresh" (Substantial, tokens) or an inline stale-flag; export of a stale-flagged visual prompts (not blocks).

**Premium Data Add-on rules:** system detects need pre-run, shown as "Add for $[X]?", reserved with base cost, non-refundable once data fetched, refunded if source fails to return data.

**Billing:** anchor date = day first charged; first charge = full B, no proration; subsequent charges = delta recharge. All prices in USD (Stripe handles conversion/tax). Failed payment: retries Day 0/1/3/5, suspension Day 7, cancellation Day 21 (balance refunded).

**Top-ups:** user-chosen amount, **minimum $20**, credited directly to paid balance, **not subject to platform fee**, refundable if unused, does **not** trigger milestone unlocks.

**Refunds:** unused paid analysis balance — always refundable on cancellation. Platform fee refundable only within 7 days of first-ever charge. Completed analyses non-refundable except system-error non-delivery (auto full credit within 24h). Free trial balance and promo credits never refundable.

**Team seats (Enterprise):** $1,800 budget pooled across seats; default 3 seats; additional seats paid add-on, **pricing TBD**; optional per-user spending sub-limit set by admin.

**Annual commitment:** reserved for future — **not currently implemented.** Do not publish as live (e.g. "Study $70/yr" discount is not real yet).

**Academic Tier — entirely new pricing track, currently undocumented in the library:**
| Parameter | Standard | Academic Account | Academic Club |
|---|---|---|---|
| Brief / Study | $15 / $80 | **$8 / $40** | $8 / $40 |
| Intelligence | $300/$399 | **Not available** | Not available |
| Platform fee | 7% | **Waived** | Waived |
| Billing | Subscription, min $200 | **Top-up only, min $20, no subscription** | Pooled budget, min $100/mo |
| Free trial | $100 | **$150 gifted, 90-day** | N/A (admin-funded pool) |

- Verification: `.edu`-style domain auto-approval (Tier 1, incl. Hipo 9,600+ institution list), Tier 2 unlisted-domain email verification, or document request (student ID/enrolment letter/fee receipt, 48h SLA).
- **Research Dollars** (promo credits, academic-only): 180-day expiry, **$200 lifetime cap**. Earn events: referral signup $15, referral activation $10, onboarding completion $5, club activation $20 (to pool), Share Card engagement $10.
- **Share Card:** viral share asset, one per analysis, 30-day expiry, PNG, tracked link; $10 Research Dollars on reaching **10 unique engagement events**.
- **Graduation Conversion:** on email bounce (30-day grace), employer profile update, or document-account expiry → converts to standard pricing, issues **one-time $100 promotional credit (180-day expiry)**. Research Dollars retained but spent at *standard* prices post-graduation.
- **Academic Club Account:** pooled budget (Enterprise mechanic), min $100/mo, activates (one-time $20 pool bonus) at 20 members' first analyses; admin's personal account earns $50 Research Dollars/month while club active.

---

## CHANGED vs the library

| # | Item | Library (current_assumptions.md) said | Now (authoritative) | Delta type |
|---|---|---|---|---|
| 1 | **Editing model** | "Editing = a metered re-generation." (one line, no framework) | Full **Minor / Substantial / New** classification with a distinct **edit-token currency**, free per-report allowance, $5-increment top-ups, "0 tokens" UI treatment for Minor, edge-only top-up prompts, visual-staleness handling, and a **New** hand-off path with its own gate pricing (50%/full/full). | **Major expansion** — library's one-liner is now a whole sub-system. |
| 2 | **Visual revision pricing — two conflicting numbers** | Not mentioned at all in library | `pricing-model.md` §4.6-A: **fixed pack, "$5 per 10 revisions,"** included Brief 2/Study 10/Intelligence 25. `EDIT-ECONOMICS.md`: **flexible $5-increment top-ups** (user picks amount), and reframes the whole thing as **token consumption** (≈500 tokens per image/infographic regen), explicitly calling the old "1–3 revisions per change" framing "a coarse tokenization" being superseded. | **New content, and an unresolved internal conflict** — the two source docs disagree on whether top-ups are a fixed 10-pack or a free-form $5-increment purchase. Needs a product decision before publishing; do not pick one silently. |
| 3 | **Milestone unlock detail** | "Business unlocks Intelligence, data upload, editing. Enterprise unlocks SSO, API, seats." | Adds: Professional now explicitly includes **Monthly Brief** and **Caspr Signals (1 topic)**; Business explicitly adds **section refinement**, **follow-up queries**, **Caspr Signals (3 topics)**; Enterprise explicitly adds **priority support**, **dedicated onboarding**, and confirms **3 pooled seats by default** with **additional seats as a paid add-on, price TBD**. | **New detail** on an existing fact — not contradictory, but the library is incomplete on what each tier unlocks. |
| 4 | **Academic Tier** | Not mentioned anywhere | Full parallel pricing track: Brief $8/Study $40, no Intelligence, no platform fee, $150 free trial, top-up-only billing, Research Dollars, Share Card, Academic Club, Graduation Conversion. | **Entirely new** — biggest single gap. |
| 5 | **Re-analysis pricing** | Not mentioned; library only notes Updates tab is "COMING SOON" | Pricing is now **locked**: standard 50% of fresh price (Brief $8/Study $40/Intelligence $150), academic 20% off academic price. Feature itself still Phase 2/not live. | **New but not yet publishable** — pricing exists ahead of the feature shipping. |
| 6 | **Output base tier-gating** | Already correctly states Brief = PDF·MD only (not all formats) | Confirmed unchanged — `pricing-model.md` itself notes an internal correction on 2026-08-18 (an earlier draft wrongly said "all formats" for every tier); the library's existing text already matches the corrected, current truth. | **No change needed** — validates existing copy. |
| 7 | **Top-up mechanics** | Not mentioned | Minimum top-up **$20** (standard accounts), **not subject to platform fee**, does not trigger milestone unlocks, refundable if unused. | **New content.** |
| 8 | **Refund policy specifics** | Not mentioned beyond "unused balance carries forward" | Platform fee refundable only within 7 days of first charge (once per account); completed analyses non-refundable except system-error non-delivery (auto-credited within 24h); free trial/promo credits never refundable. | **New content**, useful for an FAQ/objection-handling card. |
| 9 | **Failed payment / suspension timeline** | Not mentioned | Day 0/1/3/5 retries, Day 7 suspension, Day 14 final notice, Day 21 cancellation + refund. | **New content** — likely lower priority for marketing but relevant to a billing-trust FAQ. |
| 10 | **Annual commitment** | Not mentioned | Explicitly **not implemented**, reserved for future (illustrative example: Study $70/yr). | **New** — flag as do-not-publish; a placeholder for future messaging only. |
| 11 | **Free trial standard numbers** | $100, no card, 90-day expiry | Unchanged — confirmed exactly as library states. | No change. |
| 12 | **Core analysis prices (Brief/Study/Intelligence/Add-on)** | $15/$80/$300 in-budget/$399 à la carte/$20–60 | Unchanged — confirmed exactly. | No change. |
| 13 | **Plan/budget numbers** | Professional $200(~$186)/Business $600(~$558)/Enterprise $1,800(~$1,674, 3 seats) | Unchanged — confirmed exactly (0.93 analysis cap math holds). | No change. |
| 14 | **7% platform fee, never shown** | Stated | Unchanged — confirmed, still never shown to users. | No change. |
| 15 | **Carry-forward mechanic** | "Unused balance carries forward" | Unchanged, and now has a full engineering formula (§3, §12.3) if more precision is wanted for a "how billing works" explainer. | No change to the fact; more depth available if desired. |

---

## CONTENT IMPACT

*Note: this audit had access to `current_assumptions.md`'s summary only, not the full 113-card outline/titles, so card-to-topic mapping below is inferred from the category definitions given (F = Pricing & Budget, A = Getting Started, D = Understanding Your Report, E = Editing & Refining, J = Glossary) and the pricing facts each card ID would plausibly own. Confirm exact card titles against the source xlsx before editing.*

**F-01..F-10 (Pricing & Budget) — the primary impact zone.**
- Any card explaining **"how the Research Budget works"** (formula, recharge, carry-forward): no factual change, but can now cite the precise formula/worked examples in §3 if more rigor is wanted.
- Any card on **free trial terms**: no change to the standard $100/90-day facts; **must add a note or a separate card if Academic $150 trial is going to be surfaced anywhere** (website vs. app-only decision needed).
- Any card on **plan/milestone comparison** (Professional/Business/Enterprise): update the "what's unlocked" list — add Monthly Brief + Caspr Signals (1 topic) to Professional; add section refinement, follow-up queries, Caspr Signals (3 topics) to Business; add priority support, dedicated onboarding, "3 seats default / additional seats TBD pricing" to Enterprise.
- Any card on **output/format pricing**: verify wording already matches tier-gated base (Brief PDF·MD only) — if it does, no change; if any card still implies "all formats included," fix it (unlikely per current_assumptions.md, but check against actual card text).
- Any card on **editing/revision cost**: this is the biggest rewrite. Must be rebuilt around Minor/Substantial/New, the "0 tokens" framing, the free-per-report allowance + $5-increment top-up, and flag the **unresolved conflict** between the fixed-10-pack revision model and the flexible-token model (item 2 above) — do not publish a specific top-up mechanic until product confirms which is current.
- **No card currently exists for re-analysis pricing** (Brief $8/Study $40/Intelligence $150) — hold this back since the Updates feature itself is Phase 2/not live; do not publish ahead of the feature.
- **No card currently exists for the Academic Tier** at all — this needs multiple new cards (see below).
- Refund/top-up/failed-payment mechanics: if F-series includes a billing-trust or "what if my payment fails" card, update with the Day 0–21 timeline and the refund table; if no such card exists, consider a new one.

**A-08, A-10 (Getting Started)** — likely onboarding/signup and free-trial-start cards. If A-08/A-10 describe signup flow or "what do I get free," confirm the $100/no-card/90-day claim is still stated correctly (unchanged) and decide whether an Academic-track signup variant needs mentioning here or is deferred to a dedicated Academic card/section.

**D-08, D-09, D-10 (Understanding Your Report)** — likely output-format / deliverable cards. Confirm any card describing "what file formats you get" reflects the tier-gated base (Brief PDF·MD; Study/Intelligence PDF·PPTX·XLSX·CSV·MD) and the per-output pricing table ($5 docs/data, $10 PPTX, MD free, no quota/pack). This should already be correct per current_assumptions.md, but verify literal card text, especially any card that might still reference the retired "Brief 0/Study 5/Intelligence 10 free outputs" quota model.

**E-01..E-05 (Editing & Refining)** — needs the deepest rewrite in this refresh. Currently these cards presumably describe editing as a flat "metered re-generation." They must be rebuilt to cover: the Minor/Substantial/New distinction, that Minor edits are free and show "0 tokens," that Substantial edits draw from a bundled per-report allowance then a purchased cross-report balance, that charts are never metered, and that a "New" identity-change edit hands off to a new analysis priced via the gate. Flag the token-vs-revision-pack conflict (item 2) prominently since it affects exact copy about what a top-up buys.

**J-04 (Glossary: Research Budget)** — verify definition matches: "the monthly amount the user authorises... minimum $200," and consider whether to add Academic Account's top-up-only variant as a glossary note (no Research Budget/subscription for Academic accounts).

**J-05 (Glossary: Brief/Study/Intelligence)** — prices unchanged ($15/$80/$300-$399); confirm definitions still match depth descriptions in §4.1 (Brief ~15 min/10 types; Study 1–2 hrs; Intelligence up to 24 hrs, multi-model). Consider adding a note that Intelligence is unavailable on Academic accounts if the glossary scope covers account-type variance.

**New cards / topics needed (not currently in the 113-card library):**
1. **"What is the Academic Tier / Academic pricing"** (F-series or new K/H-adjacent card) — one-liner: explains $8 Brief / $40 Study, no platform fee, $150 free trial, top-up-only billing for verified students.
2. **"How do I verify as a student"** — one-liner: explains `.edu`-style auto-approval vs. document request vs. institution domain activation, 48h SLA.
3. **"Research Dollars"** (glossary/FAQ) — one-liner: explains the academic promo-credit earn program, $200 lifetime cap, 180-day expiry.
4. **"Academic Club accounts"** — one-liner: explains pooled club budgets, 20-member activation bonus, admin benefits.
5. **"How editing is priced" rewrite** (see E-01..E-05 above; effectively a new card set given the scope of change) — one-liner: explains the Minor/free vs Substantial/metered vs New/new-analysis framework.
6. **"Re-analysis / Updates pricing"** — one-liner: explains the 50%-of-fresh-price refresh model — **hold as draft, do not publish** until the Updates feature ships (Phase 2).

**Unconfirmed / TBD — do not publish as fact:**
- ~~Exact tier-scaled free edit-token allowance sizes~~ — **RESOLVED (Joy, 2026-08-18): Brief 15,000 · Study 80,000 · Intelligence 300,000 edit credits, included per analysis.** Positioned as a benefit ("edit your report after it's generated"), not a fee.
- ~~Whether visual-revision top-ups are a fixed $5/10-pack or a flexible $5-increment purchase~~ — **RESOLVED (Joy, 2026-08-18): there is NO separate edit-credit top-up.** Overflow past a report's free allowance draws the **one account money balance**; buying more = the **Wallet top-up** (tier-default $20/$50/$100, $10 increments). Wallet = money, ledger = utilization. (`EDIT-ECONOMICS.md` · `account-wallet-screens.md` §4.)
- **Additional Enterprise seat pricing** (stated as "TBD" in pricing-model.md §5.2).
- All items in pricing-model.md §13 "Technical Validation Required" — every analysis/output/revision price is described as pending Jayant's compute-cost validation; treat current numbers as the working figures for content, but do not present them as immutable if the content team wants a hedge.
- **Annual commitment discount pricing** (e.g. "Study $70") — explicitly not implemented; do not publish.

---
