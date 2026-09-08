# Delta 5 — Voice / Sample Reports / API

Audit of `docs/product/copy-standards.md`, `docs/app-handoff/SAMPLE-REPORTS.md`, and `docs/product/api-spec-v2.md` against `content/_refresh/current_assumptions.md`.

---

## CURRENT FACTS

### 1. Copy-standards — voice/terminology/capitalization rules

**Rules that ADD TO the library's current voice rules** (current_assumptions §Voice only lists banned words + "no exclamation points"):

- **"budget" never "plan."** New, explicit. `current_assumptions.md` itself uses "Plans (monthly budget / usable)" as a section header — the library's own working vocabulary violates this rule.
- **"analysis" = the act, "report / document" = the output.** Not previously codified; a distinction the library should apply consistently.
- **Capitalize Data Room · Research Budget · Brief · Study · Intelligence** wherever they appear. Not previously codified as a capitalization rule (Brief/Study/Intelligence are named in the library but capitalization wasn't a stated standard).
- **File states are exactly: Included / Excluded / Public / Private.** This is narrower/different from what the library currently describes (see CHANGED below).
- **"Top up" (verb) / "top-up" (noun)** — hyphenation rule, not previously stated.
- **Currency formatting:** exact balances → two decimals (`$186.00`); marketing/price figures → no decimals (`$80`, `$200/mo`). Doc explicitly flags "legacy `$186` vs `$186.00` drift — standardise on build," meaning this is a known live inconsistency, not yet resolved anywhere including the library.
- **Sentence case for UI labels/buttons**, not Title Case (except brand/product proper nouns) — not previously stated as a rule.
- **Errors carry reason + reassurance**, red text only, no tint fills/stripes — new, specific.
- **Specific UI copy edits applied this pass** (table in doc): gate compose line, wallet-pane copy, and payment-failed copy all changed to new exact wording (see CHANGED below).

**New concept not represented in the library at all** — the **Lingo layer** (§3): deliverable Type/Sub-type labels are **ICP-variable**, resolved at runtime by a `(slug × account-ICP)` lookup, not hardcoded. Confirmed aliases: `business_case` → Business Case (default) / Pitch Deck (founder) / Sales Deck (sales) / Board Paper (strategy); `market_sizing` → TAM; `due_diligence` → DD. Depths, file states, wallet/budget terms, and system/UI labels are explicitly **fixed, never aliased**.

### 2. Sample reports — do they exist?

**No.** `SAMPLE-REPORTS.md` is explicitly "PLACEHOLDER SPEC (v1, 2026-08-17)" — the *mechanism* (data model, seeding, archive/delete behaviour, live Ask/Edit/Outputs) is fully specified, but the *content* (which topics, which conversations) is **deliberately deferred**: "once the app is live, Joy generates real reports and hands their conversations + outputs over to seed as the samples." The doc's own open-questions list confirms topic/count is still undecided ("Deferred — decided when Joy generates the real ones").

**Not enough to resolve cards A-11, D-06, H-11 or the report-anatomy visuals** as concrete, topic-specific content. What IS confirmed and usable now: the *behavioral* facts — a sample is a real finished report seeded into every account (new and existing), fully live (Ask/Edit/Outputs work), free to open/edit (edits don't meter or persist to the shared seed — pending final confirm), labelled with a `Sample` chip + reader banner (exact treatment TBD), and archivable/deletable per-user. Report-anatomy structure (cover, sections, exec summary, red-dot citations) is independently confirmed by api-spec-v2 §6–7, so anatomy visuals can be built generically — just not populated with a real seeded example yet.

### 3. API — is there a user-facing API story?

**No.** `api-spec-v2.md` is a backend-to-backend integration **contract between Caspr's product backend and Jayant's AI service** (the "Thinking/sourcing stage" engine) — MCP/SSE/WebSocket transports, JWT auth between the two services, section/citation/chart data shapes, generation lifecycle events. It is explicitly addressed "For: Jayant (CTO) and the backend team." There is no public API surface, no customer-facing API key/portal concept, no developer authentication flow for end users anywhere in this document.

This does **not** map to the "Enterprise unlocks... API" claim already in the pricing model (`current_assumptions.md` and `.agents/pricing-model.md`). That customer-facing Enterprise API feature is **unaddressed** by this spec — api-spec-v2 governs the internal AI-service integration, not what an Enterprise customer would actually get. No help/docs content is warranted from this document as written.

---

## CHANGED vs the library

Voice-rule changes the answers must follow:
1. Replace "plan" language with "budget" wherever the library currently uses it (starting with the library's own "Plans (monthly budget / usable)" framing).
2. Enforce capitalization on Data Room · Research Budget · Brief · Study · Intelligence across all cards.
3. Apply the two-decimal-vs-whole-number currency rule: wallet/balance figures get `.00`, marketing/pricing-page figures stay whole.
4. Sentence case on any UI-label strings quoted inside cards.
5. Update any card that paraphrases or quotes the old gate/wallet/payment-failed copy to the new wording:
   - Gate: "Happy to dig in. What angle —…" → "Let's scope it. What angle —…"
   - Wallet: "Increase your budget for more depth and features." → "More budget, more depth — Business unlocks upload, editing, Intelligence."
   - Payment failed: "…no money left your account." → "…no funds were taken."

Banned/preferred terms added: "budget" (preferred) vs "plan" (banned); "top up" (verb)/"top-up" (noun) hyphenation; file-state vocabulary tightened to Included/Excluded/Public/Private (see flag below — the library also uses "Connected" as a third Data Room group, which copy-standards is silent on).

New non-voice addition with content consequences: the **Lingo/ICP-alias layer** — deliverable names are audience-adaptive (Pitch Deck, Sales Deck, Board Paper, TAM, DD), not fixed. The library currently has no concept of this and describes deliverable types with one fixed vocabulary.

Whether "sample report" content can now be produced: **No, not with real topics/screenshots.** Only mechanism-level, topic-agnostic copy can be written today (e.g., "open the sample already in your account"). Cards naming a specific sample topic or showing its content must wait for Joy's post-launch seeding.

---

## CONTENT IMPACT

**Voice sweep** (describe the sweep, not every card): run a library-wide pass across all 113 cards for (a) "plan" → "budget" language, especially F Pricing & Budget and G Account; (b) capitalization of Data Room/Research Budget/Brief/Study/Intelligence; (c) currency formatting split (exact balance vs marketing figure) in F and G/Wallet cards; (d) sentence-case on any quoted UI strings; (e) refresh any card quoting the three specific UI lines that changed (gate, wallet, payment-failed). Also flag for product/Joy: copy-standards' fixed file-state list (Included/Excluded/Public/Private) drops "Connected," which the library still uses as a live Data Room group (Bloomberg/Refinitiv/S&P/PitchBook, COMING SOON) — confirm before scrubbing "Connected" from K cards.

**Sample-report cards A-11, D-06, H-11 — status: BLOCKED, mechanism-only.** Cannot be written as topic-specific content yet. Recommend: keep these cards on [VERIFY]/placeholder, or write them at the behavioral level only (a sample is a real, fully-live, cited report already sitting in your Documents when you sign up — no charge, ask it questions, export it) without naming a topic. Report-anatomy visuals can be built now from the confirmed structural facts (cover → exec summary with infographic → sections with inline red-dot citations → Ask/Edit/Outputs/Versions) sourced from api-spec-v2 §6–9, since that structure is independent of which topic eventually seeds.

**New API/developer-docs cards needed: none, currently.** api-spec-v2.md is an internal AI-service integration contract, not a customer-facing API story — it gives no basis for a help/blog/developer-docs card. Flag instead: the existing pricing claim "Enterprise unlocks... API" has no supporting spec for what a customer-facing API would actually look like (auth, endpoints, docs). Do not draft any Enterprise-API help content until Joy/Jayant produce a customer-facing spec — creating one now would be fabricated.

**Unconfirmed / flag for Joy:**
- Data Room "Connected" group's continued existence (copy-standards' file-state list omits it).
- Sample report topics, count, and which existing card(s) they'll seed for (A-11/D-06/H-11) — explicitly deferred in the source doc.
- Sample-edit economics (free + non-persistent vs metered) — "pending final confirm" in SAMPLE-REPORTS.md.
- `Sample` chip/banner label treatment and copy — design pass not yet done.
- Customer-facing Enterprise "API" feature scope — not covered by api-spec-v2, which is backend/CTO-facing only.
