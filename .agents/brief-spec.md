# Caspr Brief — Output Specification

*For: Engineering (Jayant's team) and Product*
*Last updated: 2026-06-29 · **partially superseded 2026-08-19***
*Reads alongside: pricing-model.md (§4.1–4.2)*

> ## ⚠ PARTIALLY SUPERSEDED — read this first
>
> **The per-type "questions this Brief answers" and "what this Brief does not do" blocks below are superseded by [`docs/report-guidance/type-market-research.md`](../docs/report-guidance/type-market-research.md).**
>
> That file carries the same questions **generalised across all three tiers** (this document specified them at Brief tier only), extended with two sub-types that did not exist here (`market_sizing`, `trends`), and paired with the register and visual guidance the generation pipeline actually loads. **It is the operative source. Build against it.**
>
> **What in this document remains canonical:**
> - **§ Prompt Detection** — type inference from the prompt, and the single-clarifying-question rule. Referenced by `document-taxonomy.md` and the entry flow.
> - **§ The Brief / Study Boundary** — the *what* vs *so what / now what* principle. Now generalised as the cumulative-tier rule in `report-guidance/00-resolution-map.md` § Tier semantics, but the reasoning here is the origin and worth reading.
> - **§ Output Format Standard** — superseded on page count only (`brief-design-v2.md`: 4–6 pages including cover).
>
> **Why this document was not simply deleted:** the ten Brief types and their ceilings originated here, and the reasoning behind each *"what this does not do"* block is the clearest statement of why the tiers are priced apart. Kept as the origin document; not kept as a second live copy of the specification.

---

## Purpose

This document specifies the output standard and content intent for all Brief types. It is a guide for what good looks like — not a rigid template. Caspr should use judgment on format, structure, and which data signals matter most for a given prompt. The spec sets direction; Caspr sets execution.

---

## Output Format Standard

| Parameter | Specification |
|---|---|
| **Page count** | 3–5 A4 pages |
| **Format** | PDF (primary). No PPTX for Briefs — that is Study territory. |
| **Cover** | Brief title, topic, date generated, Caspr wordmark. Not counted in the 3–5 page body. |
| **Citations** | Every factual claim cited to source. Reference list on final page, not counted toward page limit. |
| **Density** | Tight. No padding. A Brief is a structured briefing note, not a miniature Study. |
| **Generation time** | Target: ≤15 minutes. |

---

## The Brief / Study Boundary

This is the most important commercial principle governing all Brief output.

A Brief answers **what**. A Study answers **so what** and **now what**.

The Brief gives the reader enough to be informed — to walk into a meeting, have the conversation, and know what questions to ask. It does not give them enough to make the decision. That is the Study's job.

**The Brief ceiling:** structured facts, key players, headline numbers, recent developments, and a set of crisp takeaways. No scenario analysis. No strategic recommendations. No financial modelling. No "what should I do." Those are Study outputs.

**The natural upsell:** every Brief should close with a suggested Study prompt — one sentence that shows the reader what deeper analysis would look like. *"A full Study on this topic would cover market entry scenarios, financial benchmarking, and a competitive positioning assessment."* This is not a hard sell — it is an honest signal that there is more to know.

---

## Brief Types

---

### 1. Market Sector Brief

**When it's used:** Before a client meeting, a pitch, a first investor call, or a new engagement in an unfamiliar sector. The reader needs to speak credibly about a market they have not covered before.

**Primary ICPs:** Consulting, Agency Strategists, Startup Founders, Graduate Students

**Prompt example:** *"Overview of the UK logistics-tech market"*

---

**The questions this Brief answers for the ICP:**
- How big is this market and how fast is it growing?
- Who are the main players and what do they do?
- What is happening in this market right now?
- What are the forces shaping where it is going?
- What are the 2–3 things I need to know before walking into a room?

---

**What the Brief should cover:**

The market size and growth rate, anchored to a credible named source. The key sub-segments — what the market actually consists of, not just a headline number. The leading players, described in terms of what they do and how they compete, not just a list of names. A snapshot of recent activity: significant deals, launches, or shifts in the last 12 months. The structural trends that are defining the market's direction.

**Nice to have, where relevant and available:** market concentration (fragmented vs. dominated by a few players), geographic breakdown, any regulatory or macro forces that are directly shaping the market right now, and a named example or two that makes the abstract concrete.

---

**What this Brief does not do — and why:**

It does not analyse what the trends mean for a specific business, evaluate market entry strategy, or recommend which segment to target. It does not model market share scenarios or forecast disruption. Those are Study outputs. The Brief gives the reader the lay of the land. The Study tells them what to do with it.

---

### 2. Competitive Landscape Brief

**When it's used:** Before a pitch, a strategy session, or a board question about the competition. The reader needs to know who the players are, how they are positioned, and where the gaps are.

**Primary ICPs:** Consulting, Agency Strategists, Strategy Professionals, Category Managers

**Prompt example:** *"Competitive landscape for cloud-based ERP systems for mid-market manufacturers"*

---

**The questions this Brief answers for the ICP:**
- Who are the main competitors and what do they actually offer?
- How is the market structured — is it winner-takes-all or fragmented?
- What are the key differentiators between players?
- What are the most significant recent competitive moves?
- Where are the gaps or underserved positions?

---

**What the Brief should cover:**

An honest characterisation of how competitive the space is — whether a handful of players dominate or the market is genuinely fragmented. A clear-eyed look at the main competitors: what they do, who they serve, and what actually makes them different from each other (not marketing claims, but observable differences in product, price, go-to-market, or customer base). The most significant recent moves — who is expanding, acquiring, pricing aggressively, or losing ground. Visible gaps in the market where no player is clearly winning.

**Nice to have, where relevant and available:** approximate revenue or scale indicators for the key players, customer segments that are particularly well or poorly served, and any pricing or business model differences that define the competitive dynamic.

---

**What this Brief does not do — and why:**

It does not recommend a competitive strategy, evaluate how a specific company should position itself, or model share-shift scenarios. It does not assess where to attack or which competitor is most vulnerable. That is the Study.

---

### 3. Company Profile Brief

**When it's used:** Before a sales meeting, a due diligence kick-off, a partnership discussion, or a board conversation about a competitor. The reader needs to know who this company is before the meeting.

**Primary ICPs:** Investors, Consulting, Strategy Professionals, Agency Strategists

**Prompt example:** *"Company profile: Celonis SE"*

---

**The questions this Brief answers for the ICP:**
- What does this company actually do and how does it make money?
- How big is it and how fast is it growing?
- Who runs it and what are they trying to build?
- Where does it sit relative to its main competitors?
- What has happened recently that I should know about before walking in?

---

**What the Brief should cover:**

What the company does — in plain language, not its own marketing copy. Its ownership structure and scale (headcount, geographies, whether it is public, private, or PE-backed). Its revenue model and, where available, its financial trajectory. Who leads it and what their relevant background is. How it competes — not a generic description of its market, but how this company specifically sits relative to the two or three nearest competitors. The most important recent developments: funding, leadership changes, product launches, acquisitions, press.

**Nice to have, where relevant and available:** key named customers if in the public record, any known strategic priorities or M&A ambitions the leadership has stated publicly, and any red flags or reputational signals worth knowing.

---

**What this Brief does not do — and why:**

It does not evaluate whether to acquire, partner with, or compete against this company. It does not model the financial upside of a relationship or assess fit against a specific strategic thesis. That is the Study.

---

### 4. Executive Profile Brief

**When it's used:** Before meeting someone for the first time — a prospect, an investor, an acquisition target's CEO, a board candidate. The reader needs to know who they are walking into the room with.

**Primary ICPs:** Investors, Consulting (partner-level prep), Strategy Professionals, Agency Strategists

**Prompt example:** *"Profile: Sarah Thompson, CFO, Delivery Hero SE"*

---

**The questions this Brief answers for the ICP:**
- What has this person done and how did they get here?
- What are they known for and what do they care about professionally?
- What have they said publicly that is relevant to this meeting?
- What is the one thing I most need to know before sitting down with them?

---

**What the Brief should cover:**

Their current role and how long they have held it. A career history that explains how they got here — not an exhaustive CV, but the roles that matter for context. Their education, briefly. What they are known to be focused on in their current role, drawn from public statements, interviews, or press. Relevant public record: press mentions, speaking appearances, published writing, board seats.

**Nice to have, where relevant and available:** any known professional opinions or positions directly relevant to the meeting's topic, connections or prior relationships with key people the reader knows, and any reputation signals (known for being data-driven, known for aggressive M&A, known for operational focus, etc.).

---

**What this Brief does not do — and why:**

It does not assess how to negotiate with this person, what offer structure they would find compelling, or how to manage the relationship over time. That is judgment the reader applies. The Brief gives them the factual foundation to walk in prepared.

---

### 5. Country / Geography Brief

**When it's used:** Before evaluating a market entry, advising a client with operations in the region, assessing an investment target, or preparing a case competition on a geography the reader does not know.

**Primary ICPs:** Consulting, Investors, Strategy Professionals, Graduate Students

**Prompt example:** *"Market conditions for logistics-tech businesses entering Vietnam"*

---

**The questions this Brief answers for the ICP:**
- What is the macro context — how big, how fast-growing, how stable?
- How developed is the specific sector of interest in this market?
- Who are the established local players?
- What does the regulatory and investment environment look like for a foreign entrant?
- What are the headline risks?

---

**What the Brief should cover:**

The macro baseline: GDP, population, growth trajectory, and one-sentence characterisation of the economic context. The state of the specific sector in this geography — its size, maturity, and what is driving it. The key local players and their approximate position. The regulatory environment as it affects the type of business in the prompt — licensing, ownership rules, data requirements. The foreign investment climate: how open the market is and what the entry conditions look like in practice. The most important country-specific risks.

**Nice to have, where relevant and available:** recent notable foreign entrants and how they entered, any government-stated industrial policy relevant to the sector, and infrastructure or payments context if directly relevant to the business model.

---

**What this Brief does not do — and why:**

It does not recommend whether to enter, which entry route to take, or how to sequence the expansion. It does not model the commercial opportunity or size the realistic addressable market for a specific business. That is the Study.

---

### 6. Sector Investment Brief

**When it's used:** Before a first meeting with a founder in a new sector, before putting pen to paper on an investment memo, or before an IC discussion about whether to build a thesis in a space. The investor needs to know whether the sector is worth looking at.

**Primary ICPs:** Investors (PE, VC, HF, Family Offices)

**Prompt example:** *"Investment landscape for B2B fleet-management SaaS in Europe"*

---

**The questions this Brief answers for the ICP:**
- Is this sector actively being invested in, or has the window passed?
- Who is investing and at what stage?
- What are deals being done at — what are the valuation benchmarks?
- Have there been meaningful exits, and at what returns?
- What are the risks that could hurt returns in this sector?

---

**What the Brief should cover:**

A crisp sector definition and size. Recent deal activity — the most significant transactions in the last 12–18 months, with names, sizes, and investors where in the public record. The funds most active in this space and what their positioning signals about where capital is going. Valuation benchmarks where data exists — revenue multiples for SaaS, EBITDA multiples for PE — and how these have moved. Notable exits and what they returned. The headwinds: what would compress valuations or slow activity.

**Nice to have, where relevant and available:** early signals of category convergence or platform risk, any regulatory tailwinds or headwinds specific to this sector, and whether there is a clear market leader emerging or whether the market remains open.

---

**What this Brief does not do — and why:**

It does not assess a specific company, build a financial model, or recommend whether to invest. It does not write the investment thesis. The Brief tells the investor whether the sector is worth their time. The Study builds the case for a specific decision.

---

### 7. Regulatory Overview Brief

**When it's used:** Before a market entry assessment, a compliance question, a risk section in a board paper, or a policy brief. The reader needs to understand the rules that govern a sector before going further.

**Primary ICPs:** Strategy Professionals, Investors, Consulting

**Prompt example:** *"Regulatory environment for consumer data use in digital advertising in the EU"*

---

**The questions this Brief answers for the ICP:**
- What are the key regulations that apply to this sector or activity?
- Who enforces them and what are the consequences of non-compliance?
- What has enforcement looked like recently — are regulators active?
- What is changing, and when?
- What does a new entrant need to have in place before operating?

---

**What the Brief should cover:**

The primary regulations in force — named, with jurisdiction and the regulator responsible. A practical description of what compliance requires, not a legal summary. Recent enforcement activity that signals how aggressive regulators are in practice. Upcoming changes with expected timelines. The practical checklist for a new market entrant: what must be in place before the first customer can pay.

**Nice to have, where relevant and available:** jurisdictional differences that matter for a business operating across geographies, any safe harbours or compliance shortcuts that are widely used in the industry, and any recent court rulings or guidance that have shifted how existing rules are being interpreted.

---

**What this Brief does not do — and why:**

It does not provide legal advice, assess the compliance posture of a specific business, or recommend a compliance strategy. It does not model the cost of compliance or evaluate regulatory risk against a specific business plan. That requires a Study — and, in many cases, a lawyer.

---

### 8. Category Brief

**When it's used:** Before a category review, a supplier negotiation, a ranging decision, or a board presentation on category performance. The reader needs a fast, independent read on what is happening in a product category.

**Primary ICPs:** Category / Commercial Managers (retail, eCommerce, FMCG)

**Prompt example:** *"UK premium ready-meals category — market snapshot"*

---

**The questions this Brief answers for the ICP:**
- How big is this category and is it growing?
- Who are the leading brands and how are they positioned?
- What are shoppers and consumers actually doing differently?
- What innovation is happening and what does it signal?
- Which channels are winning?

---

**What the Brief should cover:**

Category size and growth — value and volume where available, from a named source. The key sub-segments and which are growing faster or slower than the category average. The leading brands, their positioning, and their approximate market share. The demand-side trends that are driving the category — not generic consumer trends, but ones with evidence specific to this category. Recent product or format innovation that signals where the category is heading. The channel picture: how the category is distributed and where share is shifting.

**Nice to have, where relevant and available:** private label penetration and trajectory, any price architecture dynamics (premiumisation or trading down), and any supplier or retailer moves that are reshaping category structure.

---

**What this Brief does not do — and why:**

It does not recommend a ranging strategy, evaluate specific SKUs for listing or delisting, or advise on supplier negotiations. It does not model the P&L impact of category decisions. That is a Study — or a category review built on top of one.

---

### 9. M&A Target Brief

**When it's used:** After identifying a potential acquisition target and before a first approach or IC discussion. The reader needs a fast, credible read on whether this company is worth pursuing further.

**Primary ICPs:** Investors (PE, Corporate Dev / M&A teams)

**Prompt example:** *"M&A target brief: Freightos Ltd"*

---

**The questions this Brief answers for the ICP:**
- What does this company do and how does it make money?
- What are its scale and financial trajectory?
- What would an acquirer actually be buying — technology, customers, market position, team?
- How does it sit in its competitive market?
- What are the headline risks a buyer needs to know about?

---

**What the Brief should cover:**

The company's ownership, scale, and geographies. Its financial snapshot — revenue, growth, and profitability signal, with whatever is in the public record. A clear articulation of what an acquirer would gain: the technology, customer base, market position, or team that makes this target interesting. Its competitive position — is it a leader, a challenger, or a niche player with a defensible position? The 3–4 most important risks a buyer should investigate: customer concentration, key-person dependency, IP exposure, regulatory licences. Recent developments that are directly relevant to an acquisition conversation.

**Nice to have, where relevant and available:** any stated strategic ambitions of the current owners, signs of prior M&A interest (rumoured approaches, banker mandates in the press), and any integration complexity signals (tech stack, culture, geography).

---

**What this Brief does not do — and why:**

It does not value the business, model synergies, or recommend a bid price. It does not assess strategic fit against a specific acquirer's portfolio or thesis. It does not replace due diligence. The Brief answers: is this worth a serious look? The Study answers: what would we be buying and what is it worth?

---

### 10. Market Entry Brief

**When it's used:** When evaluating whether to enter a new market, geography, or product category — before committing to a full strategy process. The reader needs a structured first-pass view to decide whether to go further.

**Primary ICPs:** Strategy Professionals, Startup Founders, Consulting

**Prompt example:** *"Market entry brief: UK market for US-based enterprise HR software vendors"*

---

**The questions this Brief answers for the ICP:**
- Is the market opportunity real and material?
- How competitive and entrenched is the incumbent landscape?
- What are the realistic routes in?
- What regulatory or compliance hurdles exist?
- What separates successful entrants from those who failed?
- What are the headline risks?

---

**What the Brief should cover:**

The size and growth of the addressable opportunity in the target market — with a realistic sense of what is actually serviceable, not just the TAM. An honest read on competitive density: how many established players there are and how entrenched they are. The viable entry routes and a one-line assessment of each — not a full evaluation, but enough to know which deserve more investigation. The regulatory or compliance requirements before trading. The 3–4 factors that have determined success or failure for prior entrants in this market. The headline risks.

**Nice to have, where relevant and available:** any recent comparable entrants and how they fared, whether the market has a cultural or relationship dynamic that affects how foreign players are received, and any timing considerations (regulatory windows, market inflection points, incumbent weakness).

---

**What this Brief does not do — and why:**

It does not recommend whether to enter or which route to take. It does not model the financial return, size the investment required, or build the business case. It does not assess fit against a specific company's capabilities or constraints. The Brief answers: is this worth a serious look? The Study builds the case for the decision.

---

## Summary Table

| # | Brief Type | Core question it answers | Primary ICP |
|---|---|---|---|
| 1 | Market Sector Brief | What is this market and who is in it? | Consulting, Agency, Founders, Students |
| 2 | Competitive Landscape Brief | Who are the players and how are they positioned? | Consulting, Agency, Strategy, Category Managers |
| 3 | Company Profile Brief | Who is this company and what do I need to know before the meeting? | Investors, Consulting, Strategy |
| 4 | Executive Profile Brief | Who am I meeting and what is their background? | Investors, Consulting, Strategy |
| 5 | Country / Geography Brief | What are the conditions in this market? | Consulting, Investors, Strategy, Students |
| 6 | Sector Investment Brief | Is this sector worth investing in right now? | Investors |
| 7 | Regulatory Overview Brief | What are the rules and what is changing? | Strategy, Investors, Consulting |
| 8 | Category Brief | What is the state of this product category? | Category / Commercial Managers |
| 9 | M&A Target Brief | Is this company worth pursuing? | Investors, Corporate Dev |
| 10 | Market Entry Brief | Should we enter this market, and how? | Strategy, Founders, Consulting |

---

## Prompt Detection

Brief type is inferred from the user's prompt before generation begins. Where the prompt is ambiguous between types (e.g., "tell me about Waymo" could be a Company Profile Brief or a Competitive Landscape Brief), a single clarifying question resolves it: *"Are you looking for a profile of Waymo specifically, or the competitive landscape of the autonomous vehicle market?"*

---

## Relationship to Existing Pricing Model

The four Brief types in pricing-model.md §4.2 are superseded by this document. The mapping is:

| Old (pricing-model.md §4.2) | New (this document) |
|---|---|
| Market Brief | Brief Type 1: Market Sector Brief |
| Company Brief | Brief Type 3: Company Profile Brief |
| Competitive Brief | Brief Type 2: Competitive Landscape Brief |
| Profile Brief | Brief Type 4: Executive Profile Brief |

Brief Types 5–10 are new additions. pricing-model.md §4.2 already references this document.
