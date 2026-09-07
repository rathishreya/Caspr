# Caspr — Product Marketing Context

*The master reference. For GTM strategy, website, digital marketing collateral and sales enablement.*
*Last updated: 2026-08-20 — positioning refresh.*
*Previously `strategy/caspr-gtm-reference.md`. Restored to the conventional path so it loads by default.*

> **Single sources of truth.** Positioning: [`docs/site-truth.md`](../docs/site-truth.md) §1.0 ·
> ICP messages: [`icp-copy.md`](icp-copy.md) · Pricing: [`pricing-model.md`](pricing-model.md) ·
> Voice: [`brand-guidelines.md`](brand-guidelines.md). Where this file and one of those disagree,
> the specific file wins and this one gets corrected.

---

## 1. Product Identity

### The One-Liner
> Caspr turns a single business prompt into a boardroom-ready analysis — cited to source, delivered in minutes — at a fraction of the cost of a consulting firm.

### Tagline
**Caspr means Business.**

Double meaning — both active at all times:
- Serious and professional. Not for casual use.
- Built specifically for business tasks.

### The Message Stack (locked 2026-08-19)

| | |
|---|---|
| **Category** | Analytical AI |
| **Identity** | **Not an assistant. An analyst.** |
| **Promise** | **Arrive certain.** |
| **Proof** | **Every source, credible. Every claim, triangulated. Every report, defensible.** |

Canonical definition and the rules that come with it: `docs/site-truth.md` §1.0.

### Category
**Analytical AI.**

*"While the world was building generative AI, we built analytical AI."*

Generative AI is optimised for language: generating text, summarising, chatting. Caspr is built differently — a proprietary system of specialised analytical models engineered for working with data, applying research methodology, and producing defensible strategic output. The architecture is different because the purpose is different.

### Core Value Proposition
A user enters a single business prompt. Caspr interrogates it with clarifying questions, structures the research methodology, and returns a boardroom-ready output — PDF or editable PPTX — with data, charts, citations, and structured narrative. Total user interaction time: 2 minutes. Total wait time: 15 minutes to 2 hours depending on analysis depth. Every insight cited to a credible source.

### The Aha Moment
Receiving a complete, boardroom-ready analysis — the kind that previously cost $5,000–$50,000 from a boutique research firm and took 2–6 weeks — in under 15 minutes, for $80. The first time a user receives this output, they understand the product. Everything before that moment is activation.

---

## 2. The Product Experience

### The 2-Minute Interaction Model
Total user interaction time to start a full analysis: **2–2.5 minutes.**

This is the single most important fact about the product for marketing purposes. Users consistently overestimate how long they need to invest. The real number is 2 minutes — after which Caspr works independently and the user does something else.

Communicate this prominently on: homepage, signup page, onboarding overlay, email sequences, ad copy.

### Complete User Journey (Proposed UI — post-enhancement)

**1. Signup**
Email + password or Google SSO. No credit card. Immediately credited with $100 gifted Research Budget (90-day expiry).

**2. Persona and use case onboarding** *(deferred — see Activation note below)*
- "What best describes you?" — persona selection (Consultant / Investor / Corporate Strategy / Founder / etc.)
- "What do you want to research?" — use case selection (Due Diligence / Business Case / Market Research / Competitive Analysis / Investment Thesis / RFP / Industry Research)
- These questions are collected either post-signup or during the generation carousel — not as a mandatory pre-analysis gate.

**3. Homescreen**
Welcome screen with:
- Personalised greeting ("Welcome, [Name].")
- Single primary CTA: "+ Start"
- Library of use-case folders: Industry Benchmarking · Due Diligence · Business Plans · RFPs · Market Insight · Primary Research · My Files · Ongoing Chats
- Search bar (searches across titles, metadata, conversation, and report content)
- Wallet balance visible in header: Analysis Balance in dollars (e.g., "$186 available")

**4. Analysis depth selection** *(pre-layout — critical step)*
After the user types their prompt, before any layout is generated, Caspr recommends an analysis depth:

> *"Based on your prompt, I'd recommend a Study ($80). What level of analysis do you need?*
> - Brief — $15 · 1–3 page overview · ~15 minutes
> - Study — $80 · Full boardroom-ready analysis · ~15 minutes user time · **Recommended**
> - Intelligence — $300 · Multi-model validation · Up to 24 hours · Board-level rigour (Business+)"*

This step discloses cost before commitment and naturally surfaces the Intelligence tier as an upgrade path.

**5. Layout proposal**
Caspr proposes a structured table of contents calibrated to the selected depth. User reviews.

**6. Clarifying questions**
Caspr asks 5 targeted questions to refine scope, audience, depth, and requirements. User answers. Caspr revises layout. User approves final structure.

**7. Stage Gate 1 — Pre-analysis configuration**
Before analysis starts, a single modal captures:

| Setting | Options | Tier gate |
|---|---|---|
| Language style | Consulting / Strategic · Executive · Academic · Technical · Narrative | All tiers |
| Output language | English (default) + Arabic, French, German, Spanish, Portuguese, Russian, Mandarin, Japanese | Business+ for non-English |
| Output template | Caspr default · [Enterprise: your firm's template] | Enterprise only (one-time setup) |
| Cost confirmation | "This Study will use $80 from your Research Budget. Balance after: $[X]." | All tiers |

User clicks "Start Analysis."

**8. Generation — The carousel engagement model**
Analysis runs in the background (10-20 minutes for a Study). During this time, a rotating carousel keeps the user engaged through three types of content:

*Type 1 — Progress transparency (always shown first):*
"Scanning 1,247 credible sources on [topic]..." (live counter where possible)
"Cross-referencing market sizing data from 6 independent sources..."
"Writing your Executive Summary..."

*Type 2 — Professional context questions (replaces upfront profiling):*
Caspr asks contextual questions that improve future analyses — shown as conversational prompts, not a survey:
- "Who's the primary audience for this analysis?" (Board / Client / Internal / Investors)
- "Will you be presenting this directly, or sharing it for others to read?" (informs format recommendation)
- "Is this part of a larger project?" (triggers Project creation for Enterprise users)
- "Any specific conclusions you're hoping to validate — or challenge?"
- "First time running this type of analysis?" (suppresses beginner tooltips for power users)

*Type 3 — Feature education (contextual to this report type):*
"Once generated, click any section to edit or re-analyze it directly."
"Download as boardroom-ready PDF or editable PPTX — ready to present."
"Click any red dot in the report to ask Caspr about that specific claim."

**9. HTML preview**
Full report viewable in-browser before download. User can:
- Read and review all sections
- Edit any section inline
- Hit "Re-analyze" on any section for deeper analysis
- Click red dots (Ask Caspr) for inline source and reasoning explanation
- Navigate via the report table of contents

**10. Stage Gate 2 — Generate Output**
User selects output format(s):

| Format | Availability |
|---|---|
| PDF | All tiers |
| Editable PPTX | Business+ *(locked but visible on Professional)* |
| Word document | Business+ *(locked but visible on Professional)* |
| Infographic summary | Business+ *(locked but visible on Professional)* |

Locked formats show: "Available on Business. [Upgrade]"

This is the highest-converting upgrade surface in the product — the user is at peak engagement, holding a complete analysis, deciding how to present it.

**11. Post-report: query mode**
The same chat window transitions from report creation to report querying. The input changes to: "Ask a question about this report..." The user can interrogate any section, ask follow-up questions, or request a linked analysis.

### The Library Architecture

**Use-case folders** (system-created, fixed):
- Industry Benchmarking
- Due Diligence
- Business Plans
- RFPs
- Market Insight
- Market Research
- Ongoing Chats (incomplete analyses / drafts)

**Projects** *(Enterprise tier only — visible but locked on lower tiers)*
User-created containers for multi-report engagements. A PE firm working a deal creates a "Project Titan" project containing their due diligence, market sizing, and competitive analysis reports — regardless of which folders each lives in. Projects are the lens; folders are the container. Reports don't move — they appear in both.

Upgrade trigger: When a user runs their second related analysis, Caspr surfaces: *"Working on a multi-part engagement? Group analyses in a Project — available on Business. [Upgrade]"*

**Search**
Searches across: Titles · Metadata · Conversation · Report Content (compute-intensive — opt-in, not default). Recent searches saved. Results organised by Ongoing / Recently Accessed / Recently Created.

---

## 3. Pricing & Business Model

### Research Budget Model
One number. One charge. No confusion.

The user authorises a monthly Research Budget. 93% is available as their Analysis Balance to run reports. 7% is a platform fee — **this is internal only and is never shown to users.** Unused balance carries forward automatically. Only what was consumed is recharged each month (delta recharge).

This means: a user who runs no analyses in a month pays only the platform fee ($14 on the Professional milestone). A user who runs $186 of analyses pays $200. There is no penalty for idle months beyond the minimum platform fee.

### Milestones

| Milestone | Monthly Budget | Analysis Balance | Key features |
|---|---|---|---|
| **Free Trial** | $100 gifted | $100 (no platform fee) | Brief + Study · English only · Caspr template · 90-day expiry · no credit card |
| **Professional** | $200+ | ~$186 | Brief + Study · Monthly Brief · Caspr Signals (1 topic) · English only |
| **Business** | $600+ | ~$558 | All Professional + Intelligence · Data upload · All output formats · All languages · Caspr Signals (3 topics) |
| **Enterprise** | $1,800+ | ~$1,674 (team-pooled) | All Business + Projects · Team seats · SSO · API · Custom template · Priority support |

### Analysis Prices

| Analysis | Price | Output | Time |
|---|---|---|---|
| **Brief** | $15 | 1–3 page structured document | ~15 minutes |
| **Study** | $80 | Boardroom-ready 100-page PDF or PPTX | ~15 min user time, 1-2 hrs total |
| **Intelligence** | $300 (in-budget) / $399 (à la carte) | Multi-model validated, board-level rigour | Up to 24 hours |
| **Premium Data Add-on** | $20–60 per source | Bloomberg, PitchBook etc. surfaced pre-run | — |

*Intelligence à la carte ($399): available to any user without a subscription. No commitment required.*

### Feature Tier Gates

| Feature | Professional | Business | Enterprise |
|---|---|---|---|
| Brief | ✓ | ✓ | ✓ |
| Study | ✓ | ✓ | ✓ |
| Intelligence | — | ✓ | ✓ |
| PDF output | ✓ | ✓ | ✓ |
| PPTX output | — | ✓ | ✓ |
| Word output | — | ✓ | ✓ |
| Infographic | — | ✓ | ✓ |
| English output | ✓ | ✓ | ✓ |
| All languages | — | ✓ | ✓ |
| Private data upload | — | ✓ | ✓ |
| Monthly Brief | ✓ | ✓ | ✓ |
| Caspr Signals | 1 topic | 3 topics | Unlimited |
| Projects | — | — | ✓ |
| Team seats | — | — | ✓ (pooled wallet) |
| Custom template | — | **may purchase** | ✓ **first included** |
| SSO | — | — | ✓ |
| API access | — | — | ✓ |

**Custom template (updated 2026-08-21, Joy).** **$1,000 one-time per template · three for $2,500.** Not per report — the template persists and applies to every subsequent report. **Repeatable**: consultants and agencies work across client brands, and people change jobs, so a user may hold several. **Business and above may purchase; Enterprise includes the first.** **Phase 1.5 — not live at launch, and must not be presented as available.** Mechanics: `docs/product/phase-map.md`.

### Response commitment — 2 hours, round the clock (LOCKED 2026-08-21, Joy)

**Custom-template enquiries are answered within 2 hours, 24/7, all year.** No business-hours qualifier, no timezone, no "next working day". A request at 23:00 is answered by 01:00.

**This is a positioning asset, not just an operations promise.** The alternative the buyer is weighing — a design agency — replies in days. Two hours at any hour is a differentiator worth stating plainly in the commercial proposal, in sales conversations, and on the site.

**The exact string, unqualified, in all three product surfaces:** *"Requested · reply within 2 hours."*

**Scope — confirmed 2026-08-21 (Joy): the custom-template request inbox only, for now.**

**This is NOT a general support SLA and must never be written as one.** No page, deck or email may say *"2-hour support"*, *"24/7 support"* or *"we reply in 2 hours"* unqualified-by-subject. The claim is always attached to its subject: *"custom-template requests, answered within 2 hours."*

*"For now"* is Joy's wording — the scope may widen later. Until it does, widening it in copy is an overclaim.

### Wallet Display (new design — Research Budget model)

**Free trial state:**
```
Trial Balance: $100.00
[████████████░░░] $0 used · $100.00 remaining
Expires: [date] (90 days)
No credit card required.
[ Set up your Research Budget ]
```

**Active subscriber state:**
```
Research Budget          Business
Monthly Budget:   $600.00
Analysis Balance: $558.00
[████████░░░░░░] $42.00 used · $558.00 remaining
Recharges: 1 Jun 2026

Analysis Prices: Brief $15 · Study $80 · Intelligence $300

Recent:
  [Report title]     −$80     [date]
  [Report title]     −$80     [date]
  
[ Upgrade Budget ]  [ View full history ]
```

**Low balance state:**
```
Analysis Balance: $38.00
[██░░░░░░░░░░░░░] 
⚠ Enough for 2 Briefs. Insufficient for a Study ($80).
[ Add to Budget ]  [ Run a Brief instead ]
```

---

## 4. Target Market

### ICP Priority Order

| Priority | Segment | Who | Core need |
|---|---|---|---|
| 1 | **Consulting firms** | Associates, Engagement Managers, Research leads | Speed up desk research; reduce junior analyst hours on secondary research |
| 2 | **Strategy teams / C-suite** — *incl. Corporate Development* | CSO, VP Strategy, Chief of Staff, CEO; in-house BD / Corp Dev leads | On-demand strategic intelligence without retaining a firm; **strategic-acquirer** target evaluation (fit, synergy, capability) |
| 3 | **Investors** | PE, VC, Hedge Funds, Family Offices, Investment banks | Deal sourcing, sector research, due diligence, investment theses; **financial-acquirer** M&A |
| 4 | **Category managers** | Retail, eCommerce, FMCG | Competitive landscape, market sizing, trend analysis |
| 5 | **Marketing & Ad agencies** | Strategists, planners, new business leads | Client industry deep-dives, pitch research, competitive audits |
| 6 | **Graduate researchers** | Masters, PhD students | Literature synthesis, market context for dissertations |
| 7 | **Market Research professionals** | Research analysts, managers, directors; freelancers | The unbillable pre-fieldwork desk research layer on every engagement |
| 8 | **Startups (fundraising)** | Founders, CEOs | Market size slides, investor-ready business cases |

**Corp Dev / M&A reassigned 2026-08-19 (Joy).** Corporate Development is a strategy function that executes through acquisition → folded into ICP 2. M&A as pure financial deal-making → ICP 3. The two differ by **acquirer lens**: a financial acquirer buys for return on capital (the asset stands alone); a **strategic acquirer** buys for fit with the business already owning it. Same output shape, different vocabulary and lead metric. Registers: `docs/report-guidance/report-style-guide.md` §10.2 / §10.3 / §10.7. Market Research professionals — a full persona in `icp-personas.md` — takes the vacated slot 7.

### ICP Profiles

#### ICP 1: Consulting Firms
**Role:** Associates, Engagement Managers at strategy consultancies, boutique firms, Big 4
**Pain:** Secondary research is the most time-consuming part of any engagement. Junior analyst hours are expensive and slow. Clients expect 48-hour turnarounds. Freelance analysts add overhead and inconsistency.
**Buying trigger:** "I need a market landscape on a sector I've never covered, for a client briefing in two days."
**Key message:** *"Your research is only as good as your sources. Caspr pulls from 25M+ curated, credible sources — the same databases your firm pays for, synthesised in hours."*
**Proof point:** Primary research firm using Caspr for the secondary research component of client deliverables.
**Upgrade path:** Professional → Business (for output language + PPTX) → Enterprise (for team wallet, custom template with firm branding)
**Objection:** "Our clients expect proprietary research." → Caspr provides the baseline intelligence that frees your team to do the proprietary layer.

#### ICP 2: Strategy Teams / C-Suite
**Role:** CSO, VP Strategy, Chief of Staff at corporates and multinationals
**Pain:** They don't have a research team. Commissioning a consulting firm takes 6-8 weeks and costs $50K+. They make decisions without adequate information because getting the information costs too much.
**Buying trigger:** "I need a business case for the board meeting in 3 weeks. I don't have time to commission a firm."
**Key message:** *"The analysis your board expects. Without the firm, the timeline, or the invoice."*
**Proof point:** "A business case that used to take 6 weeks and $150,000. Caspr: 2 hours and $80."
**Upgrade path:** Professional → Business for multi-language output (multinational teams)

#### ICP 3: Investors (PE / VC / Family Offices)
**Role:** Investment analysts, Associates, Partners at PE firms, VC funds, family offices
**Pain:** Deal flow requires rapid market context. Full due diligence takes months and costs six figures. Preliminary research to decide whether to pursue a deal is unstructured and inconsistent.
**Buying trigger:** "I have a deal landing on my desk Monday. I need market context on the sector before I meet the founder."
**Key message:** *"Upload the data room. Caspr provides the market intelligence around it. The investment memo writes itself."*
**Proof point:** Intelligence tier designed specifically for due diligence depth. Data upload on Business+ integrates proprietary data room files with curated market intelligence.
**Upgrade path:** Professional (quick sector briefs) → Business (Intelligence tier for deal-level rigour) → Enterprise (team wallet for deal teams)

#### ICP 4: Category Managers
**Role:** Category managers, buyers, trade marketing leads at retail and eCommerce
**Pain:** Market sizing and competitive landscape data is expensive from subscriptions (Statista, Euromonitor) and comes without synthesis or narrative.
**Buying trigger:** "I need to justify a new category expansion to the buying committee."
**Key message:** *"Market sizing, competitive landscape, trend analysis — in 15 minutes, for the price of a data subscription you'll actually use."*

#### ICP 5: Agencies
**Role:** Strategists, planners, new business leads at marketing and ad agencies
**Pain:** Client onboarding requires deep sector research. New business pitches need market intelligence. Both are time-consuming and often deprioritised.
**Buying trigger:** "We just won a new client in a sector we've never covered. Briefing is Friday."
**Key message:** *"Know your client's market better than they do. Before the briefing."*

### Use Cases by ICP

| ICP | Brief use cases | Study use cases | Intelligence use cases |
|---|---|---|---|
| Consulting | Sector primer, competitor profile, meeting prep | Market landscape, business case, strategy review | M&A target assessment, full due diligence |
| Strategy / C-Suite | Industry briefing, quick competitive scan | Business case, investment thesis, board deck research | Board-level strategy, market entry |
| Investors | Company profile, sector overview | Market sizing, investment thesis | Full due diligence, LP report context |
| Category managers | Trend brief, competitor brief | Category landscape, market sizing | — |
| Agencies | Client sector brief | Pitch research, competitive audit | — |
| Corporate Dev / M&A | Target company profile | Market mapping, deal rationale | Acquisition due diligence |
| Startups | Market quick scan | Investor-ready business case, market size | — |

### Sample Prompts (for marketing use — demonstrate breadth)
- "Market research of the commercial real estate sector in Dubai"
- "Business case for setting up an electric vehicle manufacturing facility in India"
- "Identify the top 5 acquisition targets for a regional FMCG business in Europe"
- "Due diligence analysis on a mid-market SaaS company in the cybersecurity sector"
- "Investment thesis for the Indian renewable energy sector"
- "Competitive landscape analysis of the UK digital banking market"
- "RFP supporting document for a national infrastructure project in Saudi Arabia"
- "Company profile: KLMB Investment Group, with market context"

### Anti-Persona
- Users needing real-time data dashboards or BI (not Caspr's purpose)
- Users needing primary research — surveys, interviews, original data collection
- Users looking for a general AI assistant or chatbot

---

## 5. Competitive Positioning

### The Category Claim
> *"Generative AI writes. Analytical AI analyses."*

Caspr is the only product that has made Analytical AI its category. Every major AI player (OpenAI, Perplexity, Google, Anthropic) is building on LLMs optimised for language. Caspr is built on a different architecture for a different purpose. This is not a marketing claim — it is a design choice made from day one.

The category advantage: OpenAI, Google, and Anthropic cannot credibly enter Analytical AI without admitting the limitations of their LLMs. Caspr's category is structurally defensible.

### Head-to-Head

**vs. ChatGPT / Claude / Perplexity (LLMs)**
- They generate plausible text. Caspr produces defensible analysis.
- They hallucinate data. Caspr cites every insight to a credible source.
- They produce chat responses. Caspr produces structured 100-page documents.
- They are general purpose. Caspr is purpose-built for business analysis.
- Copy: *"Not a language model. An analytical one."*

**vs. McKinsey / BCG / Top-tier consulting**
- Minimum engagement: $50,000–$1,000,000+. Caspr Study: $80.
- Timeline: 8–16 weeks. Caspr: hours.
- This is not a percentage comparison. It is a different order of magnitude.
- Note: Caspr does not replace top-tier strategic advisory relationships. It replaces the research and analysis layer that consulting firms delegate to junior analysts — which is most of what clients pay for.

**vs. Boutique research agencies**
- $5,000–$50,000 per report, 2–6 week turnaround, retainer often required. Caspr Study: $80, hours not weeks, no contract.
- 96–99% cheaper. Not a rounding error.

**vs. Statista / IBISWorld / Euromonitor**
- They sell raw data. No synthesis, no narrative, no conclusions.
- A Caspr Study includes the data AND the analysis layer: methodology, conclusions, scenario analysis, recommendations.
- Cost: $995–$1,995 for data. Caspr: $80 for data + analysis.

**vs. In-house analyst teams**
- Caspr does not replace analysts. It removes the grunt work (gathering, structuring, formatting) so analysts spend time thinking, not searching.
- Framing: "An analyst that does the research so your analysts can do the analysis."

**vs. DIY (Google + hours of your own time)**
- Time cost: 3–8 hours minimum for a credible piece of research. Senior professional hourly cost: $100–$500/hr. Total cost: $300–$4,000 in time alone.
- Quality: Fragmented sources, no synthesis, no structured output.
- Caspr: $80, 2 minutes of interaction, analyst-grade output.

---

## 6. Messaging Architecture

### Primary Message (used everywhere)

| | |
|---|---|
| **Identity** | **Not an assistant. An analyst.** |
| **Promise** | **Arrive certain.** |
| **Proof** | **Every source, credible. Every claim, triangulated. Every report, defensible.** |

Identity is the hero, promise sits beneath it, proof is the fold below. Homepage, signup page,
onboarding overlay.

**Retired 2026-08-20:** *"2 minutes of your time. 15 minutes of Caspr's."* The 2-minute interaction
model is still true and still useful — it answers *"how much work is this?"* — but it is a supporting
fact on the how-it-works fold, not the primary message. Leading on speed puts Caspr in a race it will
lose as the category commoditises.

### Messages by ICP

**Moved.** The eight ICP message sets — primary, secondary, proof and CTA, with copy notes, ad
creative and email subject lines — live in [`icp-copy.md`](icp-copy.md) and nowhere else. This file
held a second, shorter table of them; it drifted out of date and has been removed rather than
maintained in parallel.

### Content Pillars

Every piece of content maps to at least one. Content that maps to none should not be created.

**Pillar 1: From Weeks to Minutes**
The research that used to take a team of consultants a month. Caspr: hours, not weeks.
- Brief in 15 minutes — cited market overview, company profile, competitive landscape
- Study in 1-2 hours — boardroom-ready 100-page PDF or editable PPTX
- Intelligence in under 24 hours — due diligence depth that used to take a month
- 2 minutes of interaction, then Caspr works independently

**Pillar 2: Analyst-Grade Output**
Depth, structure, and currency required for serious decisions — not summaries, not chat.
- Rigorous research methodology — it **weighs** and **concludes**; it does not retrieve
- Real-time live data and a curated corpus — what it **sources**: today's reality, not static training data
- 25M+ curated, credible sources — every conclusion defensible
- Every insight cited to source — defensible in front of a board, client, or investor

**Pillar 3: A Fraction of the Cost**
Institutional-quality analysis. Without the institutional price tag.
- Study at $80 vs. $5,000–$50,000 from a boutique research agency: 96–99% cheaper
- vs. McKinsey or BCG: a different order of magnitude — their minimum exceeds $50,000
- No retainer, no contract, no relationship overhead
- First $100 in analysis free — try before committing a dollar

**Pillar 4: Analytical AI, Not Generative AI**
Built for analysis from the ground up.
- Generative AI produces language. Analytical AI produces conclusions.
- **Weigh** applies strategic methodology — it reasons over sources, not just retrieves
- Every insight traceable to a credible source
- The standard for serious professionals, not general audiences

---

## 7. Key Claims & Proof Points

### Claims with numbers (use these — do not paraphrase)

| Claim | Number | Context |
|---|---|---|
| Brief delivery | 15 minutes | From prompt to cited output |
| Study user interaction | 2 minutes | User's active time before analysis runs independently |
| Study total time | 1–2 hours | Full analysis generation |
| Intelligence total time | Up to 24 hours | Multi-model validation |
| Source pool | 25M+ | Curated, credible sources — not web-scraped |
| Brief cost | $15 | Per Brief analysis |
| Study cost | $80 | Per Study analysis |
| Study vs. boutique agency | 96–99% cheaper | $80 vs. $5,000–$50,000 |
| Free trial | $100 | Gifted Research Budget, no credit card |
| Free trial reach | 1 Study + change / 6 Briefs | What $100 buys |
| Signups | 1,500+ | Current base to re-engage |

### Social Proof
- Primary research firm using Caspr for the secondary research component of client deliverables (agency-as-customer model)
- Senior market research professionals ready to provide written and video testimonials — **collecting these is the highest-priority conversion asset**

### Proof Point Framing by Channel

**For ads:** Lead with the price contrast.
*"$80 vs. $50,000. Same output. Fewer weeks."*

**For the homepage:** Lead with the time contrast.
*"The research your team would spend three weeks on. Caspr: this afternoon."*

**For email sequences:** Lead with the use case.
*"[Prompt example] — here's what a Caspr Study on this topic looks like."*

**For LinkedIn:** Lead with the category claim.
*"Generative AI writes. Analytical AI analyses. There's a difference."*

---

## 8. Objections & Responses

| Objection | Response |
|---|---|
| "Can I trust AI-generated data?" | Caspr is Analytical AI, not a chatbot. 25M+ curated, credible sources. Every insight linked to its source. You can trace every claim before presenting it. Try it free — judge by the output. |
| "Will it be good enough to present externally?" | Boardroom-ready PDF or editable PPTX with charts, narrative, and cited sources. "Published by Caspr Research" on the cover. Designed by someone who spent 15 years producing exactly this kind of analysis at McKinsey. |
| "Isn't this just another LLM?" | No. Generative AI produces language. Analytical AI produces conclusions. Different architecture, different purpose, different output. ChatGPT can't write a 100-page market analysis cited to source. Caspr does it in hours. |
| "Our use cases are too complex / niche." | The clarifying question flow is designed for highly specific, complex prompts. Intelligence tier runs multiple analytical models validating each other — it is designed for the hardest questions. |
| "We already have an analyst team." | Caspr handles the research layer — gathering, structuring, synthesising — so your analysts spend time on judgment and recommendation, not search and formatting. |
| "What about confidential / proprietary data?" | Private data upload (Business+) integrates your proprietary files with Caspr's curated sources. Your data stays in your environment. Enterprise tier includes data sovereignty controls. |
| "The price seems too low to be credible." | The cost comparison is with the human hours it replaces, not with an equivalent AI tool. $80 for a Study replaces 3–8 analyst hours at $50–$500/hour. The output quality is the answer — try it free. |

---

## 9. Brand Identity

### Visual Identity
- **Logo:** "Caspr." — heavy editorial serif with a red dot as the full stop. The period is part of the brand mark, not punctuation.
- **Palette:** Black `#000000` · White `#FFFFFF` · Red `#E8453C` (the dot)
- **Aesthetic register:** Premium financial press. The visual language of the FT, Bloomberg, The Economist. No gradients, no cartoon illustrations, no rounded-everything SaaS aesthetic.

### Voice: The Trusted Senior Analyst
Caspr speaks like the most credible person in the room. Arrives with the numbers done, speaks in conclusions not caveats, never wastes a word. Not the friendly colleague who helps you out — the authoritative source you trust in front of a board.

| Attribute | What it means in practice |
|---|---|
| **Precise** | Every word earns its place. No padding, no qualifications that don't add meaning. |
| **Authoritative** | Speaks in conclusions. Confident without hedging. Never says "may" when it means "does." |
| **Dry wit** | Intelligence is the humour. An observation that makes the reader feel clever for getting it. Never announced, never explained. |
| **Commercially sharp** | Always anchors to business outcomes and numbers. "15 minutes" not "fast." "$80 vs. $50,000" not "cost-effective." |
| **Respectful** | Trusts the reader's intelligence completely. Never over-explains. |

### Writing Rules
1. **Pain first, feature never.** Start with the reader's experience. Arrive at the product through the problem.
2. **Conclusions, not descriptions.** Don't describe what Caspr does. Tell them what they get.
3. **Numbers anchor everything.** When you have a specific number, use it. When you don't, find one or remove the claim.
4. **Second person, always.** "You" not "users." "Your business case" not "business cases generated by the platform."
5. **No exclamation points.** Ever. Confidence does not require punctuation.
6. **Short sentences.** If a sentence has more than two clauses, split it.
7. **Lead with Analytical AI.** It is the sharpest single differentiator. Use it before describing any feature.
8. **Do not use "LAM."** Use "Analytical AI," **"Source. Assess. Conclude."**, or "purpose-built for analysis."

### Approved Copy (tone calibration)
- *"15 minutes. Cited to source."*
- *"100 pages. 2 hours. Boardroom-ready."*
- *"The $200,000 question. For $80."*
- *"Stop Googling. Start analyzing."*
- *"Analyst-grade insights. Without the analyst retainer."*
- *"Your competitors are still waiting for the research."*
- *"While the world was building generative AI, we built analytical AI."*
- *"Generative AI writes. Analytical AI analyses."*
- *"Built for analysis, not conversation."*
- *"2 minutes of your time. 15 minutes of Caspr's."*
- *"An analyst that works 24/7. First $100 free."*

### Copy Filter
*"Would a Senior Partner at a consulting firm find this sharp and credible — or roll their eyes?"*

### Words to Avoid
LAM · chatbot · LLM (when describing Caspr) · web scraping · hallucinate · platform · leverages · algorithms · optimise workflows · powerful AI · revolutionary · game-changing · disruptive · "excited to announce" · "Here's how:" · insights (overused) · fast/affordable/comprehensive (replace with specific numbers)

---

## 10. Switching Dynamics

**Push** (what drives them away from current approach):
*"Our last research project cost $200K and took 6 weeks. We need something faster for exploratory questions."*

**Pull** (what attracts them to Caspr):
*"I can get a 100-page business case in hours for $80. That's a no-brainer for first-pass analysis."*

**Habit** (what keeps them stuck):
*"We've always used a research firm. The board expects that level of rigour."*

**Anxiety** (what worries them about switching):
*"Will AI-generated research be credible enough to present to investors / the board / a client?"*

**The anxiety response:** This is the #1 objection. Address it with:
1. The Ask Caspr feature — every claim has a source, visible on demand
2. The founder story — built by someone who set this standard for 15 years at McKinsey
3. The free trial — judge by the output before committing any money

---

## 11. Customer Language

### How customers describe the problem
- "We spend a fortune on consultants for research we need quickly."
- "I need a credible business case but I don't have 3 months."
- "ChatGPT makes up data. I need something I can actually cite."
- "My analyst team doesn't have bandwidth for exploratory research."

### How customers describe the solution
- "It's like having a business analyst on demand."
- "The questions it asks me actually made me think about things I'd missed."
- "The output looks like something from a consulting firm."
- "I presented it directly to the board without editing it."

### Glossary

| Term | Meaning for external audiences |
|---|---|
| Brief | 1–3 page structured analysis in ~15 minutes. Market Brief, Company Brief, Competitive Brief, Profile Brief. |
| Study | Full boardroom-ready analysis in 1-2 hours. 100-page PDF or editable PPTX. The core Caspr product. |
| Intelligence | Multi-model validated analysis in up to 24 hours. Highest rigour. For due diligence, M&A, board-level decisions. |
| Research Budget | Monthly budget the user authorises. 93% is available for analyses. The rest is the platform fee (never shown). |
| Analysis Balance | The dollar amount available to spend on analyses. What the user sees in the wallet. |
| **Source** | What comes in — the 25M+ curated, credible corpus, the live feeds that keep it current, and the client's own material. *Every source, credible.* |
| **Weigh** | Reconciling what the sources disagree on — judging credibility, separating a definitional difference from a genuine one. *Every claim, triangulated.* |
| **Conclude** | Structuring a position that survives the room. *Every report, defensible.* |
| ~~The Thinking Brain~~ · ~~The Learning Brain~~ | **Retired together, 2026-08-27** — [`../docs/source-assess-conclude.md`](../docs/source-assess-conclude.md). Do not reintroduce, including the word *brain* |
| Ask Caspr | Inline feature: click any claim in a generated report to see its source, reasoning, and supporting data. |
| Projects | Enterprise-tier feature for grouping multiple analyses by client engagement or project. |
| Premium Data Add-on | Optional high-cost third-party data sources (Bloomberg, PitchBook etc.) surfaced pre-analysis, priced $20–60 each. |

---

## 12. Founder Story

*(Background credibility asset. Used on About page, investor materials, PR. Does not lead marketing copy.)*

**Joy Sharma** (CEO) is a former McKinsey consultant (US and Middle East) who advised major private sector and government organisations on strategy and business transformation. After McKinsey, he founded EZ — a global B2B services company serving 100+ multinationals, bootstrapped to profitable, multi-million dollar revenue, double-digit CAGR, now independently run as Chairman. EZ's core offering was business intelligence and analytical services — the human-powered version of exactly what Caspr automates.

**Jayant** (CTO) was recruited by Joy at EZ, rose to lead AI and Technology, and left to co-found Caspr.

**Why this matters:** Caspr is not built by technologists who identified a market opportunity. It is built by someone who has been the consultant producing this analysis (McKinsey), run the service operation delivering it at scale to multinationals (EZ), and now automated it (Caspr). This directly answers the #1 credibility objection: *"Will AI-generated research be good enough to present to a board?"*

**One-sentence usage:** *"Caspr was built by a former McKinsey consultant who spent 15 years producing exactly this kind of analysis — and then automated it."*

**Use in:** About page, PR, investor materials, LinkedIn thought leadership, testimonial framing.
**Do not use in:** Ad copy, product emails, or anywhere Caspr's output should speak for itself.

---

## 13. Current State & Priorities

### Funnel (as of 2026-05-09) — **the old pitch. Read as history, not as a baseline**

| Stage | Number | Notes |
|---|---|---|
| Signups | 1,500+ | Strong top-of-funnel |
| Activated (≥1 analysis generated) | Unknown — measure immediately | Critical unknown |
| Paid users | ~2 | <0.1% signup-to-paid conversion |

### Diagnosis — restated 2026-08-20 (Joy)

**These numbers describe a retired pitch.** That cohort arrived through positioning that no longer exists, pricing that has been retired, and targeting that was never ICP-specific — so the conversion rate measures the acquisition, not the product. Treating it as an activation failure was the error; the likelier reading is that the wrong people signed up with the wrong expectation.

**The strategy is forward-looking:** a net-new funnel run correctly for the first time — right message, right ICP, accurate understanding of the value, carried from awareness to paid. Repeatable and scalable. The existing 1,600 is a bonus, not the plan.

**Until the rebuilt website and app are live, nothing activates** — see `gtm-strategy.md` §2, principle 1.

Full reasoning: `gtm-strategy.md` §1.

### Funnel KPIs

| Metric | Target |
|---|---|
| Activation rate (signup → first analysis) | Baseline → 40%+ |
| Time-to-first-analysis | Minimise |
| Trial-to-paid (signup → Research Budget) | ~0.1% → 3–5% |
| MRR | Track weekly |

### Immediate Priorities
1. **Re-engage the 1,500 signups** — activation email sequence with specific, compelling use-case prompts (see `caspr-tool-suggestions.md` item 14)
2. **Collect testimonials** — senior market research professionals are willing; this is the highest-priority conversion asset; directly addresses the #1 objection
3. **Measure activation baseline** — determine what % of signups have generated ≥1 analysis before any campaign spending
4. **Ship the UI enhancements** — particularly onboarding flow, Stage Gate 1, new wallet, and the "2 minutes / 15 minutes" communication

### Evidence of Product-Market Fit
- Primary research firm using Caspr for client deliverables — agency-as-customer model
- Joy Sharma's own account: 60+ reports across due diligence, market research, competitive analysis, financial analysis, business proposals — confirming broad "Caspr means Business" scope
- Senior market research professionals willing to give testimonials

---

## 14. Website & Digital Marketing Notes

### Homepage hierarchy (recommended)
1. **Hero:** The primary message + the 2-minute / 15-minute claim
2. **Social proof bar:** Trusted By logos + "1,057,368 sources and counting"
3. **How it works:** The 5-step flow (prompt → depth → layout → configure → receive output)
4. **Analysis types:** Brief / Study / Intelligence — with prices, times, and example outputs
5. **ICP sections:** Separate above-the-fold messages for Consulting / Investors / Strategy teams
6. **Competitive anchor:** The price comparison ($80 vs. $5,000–$50,000)
7. **The category claim:** Analytical AI vs. Generative AI
8. **Founder credibility:** One sentence, not a section
9. **CTA:** "$100 free. No credit card. Start now."

### Signup page
- Headline: "Analytical AI for Business" *(replaces current "AI for Market Research")*
- Sub-headline: "2 minutes of your time. 15 minutes of Caspr's."
- Trust signals: Trusted By logos
- CTA: "Start for free — $100 in analysis, no credit card"

### Ad creative direction
Lead with the price contrast (most proven anchor):
- *"Don't spend a dime on market research before knowing this."*
- Three proof points: $80 vs. $5,000–$50,000 · 25M+ curated sources · 50+ sectors
- CTA: "First $100 free. No credit card."

For LinkedIn (ICP-targeted):
- Consulting: *"Your research in hours. Your analyst's time back."*
- Investors: *"Upload the data room. The investment memo writes itself."*
- Strategy: *"The $200,000 question. For $80."*

### Email sequence (for 1,500 existing signups)
Five-email activation sequence — see `caspr-tool-suggestions.md` item 14 for full brief.

Compressed version for existing signups (2-week sequence):
- Email 1 — "Caspr has improved since you last saw it." (product update + specific prompt)
- Email 2 — "What are you trying to figure out?" (use case education with Brief/Study/Intelligence examples)
- Email 3 — "We'd like to know what would make Caspr useful for you." (2-question survey + re-engagement)
