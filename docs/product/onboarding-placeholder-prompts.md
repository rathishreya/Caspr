# First-run placeholder prompts — the ICP library

**Status:** locked 2026-08-20 (Joy). Implements the flipping placeholder in `onboarding-understanding.md` §"ICP-based personalization".

The prompt bar on the first-time-user page cycles through example prompts. **Which set it cycles depends on the entry ICP**, detected from the referrer path / UTM off the marketing pages, or from the signup segment. This file is that content.

---

## 1 · Why the placeholder carries the personalisation

**The dividing line is the prompt bar** (Joy, 2026-08-20): *"don't change any text above the prompt bar."*

**Nothing above the bar ever varies** — the hero stack (*"You're in. Let's get to work." / "Not an assistant. An analyst." / "Every source, credible…"*) is identical for every visitor. It is the positioning; it does not get re-cut per audience.

**Three things vary by ICP:**

1. **The flipping placeholder prompts** — §3 of this file.
2. **The card `↳` examples** — §5, one per Type per ICP.
3. **Card order** — the ICP's lead Type goes first, and takes the full-width card on mobile.

**Both card text lines above the example are fixed** — ① the Type name (`Market Analysis`, `Diligence`, `Deal Sourcing`, `Research Synthesis`, `Strategy`) and ② the one-liner beneath it (*"Market size, competition, category reads"*). Those are the taxonomy and its definition (`app-shell-framework.md` §18); they read identically to every visitor. Only the `↳` example on line ③ changes.

**Why the placeholder carries the most weight.** It is subtle, it draws the eye by moving, and it sits inside the one element the user must touch. Personalisation lands as *recognition* — "that is my question" — rather than as the page announcing that it knows who you are. And because it is only ever a placeholder, a wrong ICP guess costs nothing.

## 2 · Mechanics

| | |
|---|---|
| **Set size** | 5–10 prompts per ICP. Eight is the working default. |
| **Order** | As listed. The first prompt is the strongest and should be the one shown on load. |
| **Cycle** | One at a time, in order, looping. Pauses on focus — the moment the user clicks in, the flipping stops and the field clears to a plain prompt. |
| **Fallback** | The **Generic** set (§3.9) whenever no ICP is known — direct traffic, stripped referrer, homepage entry. |
| **Never** | Do not flip while the user is typing. Do not use a prompt as a *value* — placeholder only, so nothing is submitted that the user did not write. |

**Detection is a hint, not a filter.** A wrong guess must cost nothing: all five Type cards stay on screen in every case, and the placeholder is only an example. This is why the personalisation reorders and re-flavours rather than hides — see `onboarding-understanding.md` §"ICP-based personalization".

## 3 · The sets

Every prompt below is drawn from a pain point stated in the ICP's own language in [`../../.agents/icp-personas.md`](../../.agents/icp-personas.md). Line references are to that file. Nothing here is invented voice.

### 3.1 Consulting — `/consulting`
*Lead Type: Market Analysis. Source: personas L63–79 — sector rotation, 48-hour pitch, defensibility, reconciling conflicting sources.*

1. Industry primer on commercial logistics in the Nordics — I'm on the project Monday.
2. Competitive teardown of the UK pet nutrition category.
3. Market sizing for industrial automation in Mexico to 2030.
4. Reconcile the conflicting market size estimates for global cold chain.
5. Who are the top 10 players in European medtech distribution, and how do they compete?
6. What's driving margin compression in third-party logistics?
7. Build the fact base for a cost-reduction case in automotive aftermarket.
8. Category read on premium spirits in Southeast Asia — sourced.

### 3.2 Strategy / Corp Dev — `/strategy`
*Lead Type: Strategy. Source: personas L156–171 — bandwidth not judgment, board questions every unattributed number, structured argument over a list.*

1. Should we enter the Brazilian payments market?
2. Business case for expanding into Gulf healthcare services.
3. Size the addressable market for our B2B segment, with sources.
4. Which adjacent markets could we credibly move into?
5. What are our competitors investing in, and what does it signal?
6. Market entry options for India — routes, risks, sizing.
7. Where is our category heading over the next five years?
8. Build the board pack fact base for our FY27 growth plan.

### 3.3 Investors — `/investors`
*Lead Type: Diligence / Deal Sourcing. Source: personas L247–262 — "research librarian", GP asks for a defensible answer in 24 hours, auction speed, sell-side bias.*

1. Due-diligence read on Acme Corp ahead of a Series B.
2. Acquisition targets in European logistics tech.
3. What's the market size for EV charging in Southeast Asia, to 2030?
4. Investment thesis for vertical SaaS in insurance.
5. Commercial diligence on a mid-market dental roll-up.
6. Is the growth in this category structural or cyclical?
7. Screen the UK facilities-management market for platform assets.
8. Who else is active in this space, and what have they paid?

### 3.4 Agencies — `/agencies`
*Lead Type: Market Analysis. Source: personas L345–360 — "fake expert in 3 days", unbillable pitch overhead, needs a structured document not an internet summary.*

1. Client industry deep-dive for a pitch on Thursday.
2. Category landscape for premium haircare in the UK.
3. Competitive positioning map for the pitch — five brands.
4. Who is winning in B2B fintech marketing, and why?
5. What's changing in the consumer's path to purchase in grocery?
6. Build the market section of our RFP response.
7. Cultural and category context for a beauty brand entering Korea.
8. What does the data say about ad spend shifts in retail media?

### 3.5 Startups — `/startups`
*Lead Type: Strategy. Source: personas L437–452 — TAM defensibility at seed, 15 hours with nothing defensible, no research budget.*

1. Investor-ready market sizing for my product.
2. TAM, SAM and SOM for B2B climate software in Europe — cited.
3. Build the business case for our Series A raise.
4. Who are my real competitors, and how are they funded?
5. What will investors push back on in my market slide?
6. Is this market growing fast enough to raise on?
7. Market context for our seed deck.
8. Size the opportunity for our product in the US.

### 3.6 Market research — `/market-research`
*Lead Type: Research Synthesis. Source: personas L525–540 — "research before I can do the research", thin context sections lose proposals, syndicated data misses the subcategory.*

1. Market landscape of commercial real estate in the Gulf.
2. Category primer before we design the discussion guide.
3. Premium ready meals in Southeast England — the cut syndicated data misses.
4. Build the context section for our proposal.
5. Triangulate the market size — the syndicated numbers disagree.
6. What's the competitive structure of wearables in B2B healthcare?
7. Desk research context for a category we're about to field in.
8. Sector background for a client who expects Tier 1 depth.

### 3.7 Category managers — `/category-managers`
*Lead Type: Market Analysis. Source: personas L626–641 — sell-out data doesn't say why, supplier-funded research is biased, 4 of 6 weeks lost to research, specificity.*

1. Category read on premium meal kits in the UK specifically.
2. Why is my category slowing, and where is it going?
3. Independent view on the segment — not supplier-funded.
4. Build my category review fact base.
5. What's driving premiumisation in ambient grocery?
6. What's happening in private label in this category?
7. Competitive landscape for the aisle, with sources.
8. Where should we take range architecture next year?

### 3.8 Academic — `/academic`
*Lead Type: Research Synthesis. Source: personas L715–730 — campus-only databases, hallucinated citations from generative tools, 5–10 industry primers before recruiting, the dissertation context chapter.*

1. Market context chapter for my dissertation.
2. Industry primer on renewable energy for recruiting season.
3. Size the market for my case competition — with sources I can cite.
4. Literature synthesis on platform competition.
5. Sector overview for a consulting interview on Thursday.
6. Regulatory landscape for EU AI, for my thesis.
7. What's the evidence base on gig-economy labour markets?
8. Competitive analysis of the airline industry, cited.

### 3.9 Generic — no ICP known *(fallback)*
*Spread across all five Types so every visitor sees themselves within one cycle. Prompts 1–5 are the canonical card examples from `onboarding-understanding.md`.*

1. Size the EV charging market in Southeast Asia to 2030.
2. Due-diligence read on Acme Corp ahead of a Series B.
3. Acquisition targets in European logistics tech.
4. What's changing in EU AI regulation, and who's exposed?
5. Build the business case for entering India's EV fleet market.
6. Competitive teardown of the UK pet nutrition category.
7. Market entry options for the Gulf — routes, risks, sizing.
8. Category read on premium meal kits in the UK specifically.

---

## 4 · Voice rules for anyone adding to these

- **First person, as the user would type it.** Not *"Analyse the market for…"* — that is Caspr's voice. *"Size the market for…"* is theirs.
- **Specific enough to be believable.** A named geography, sector or company beats a placeholder every time. Generic prompts teach the user to write generic prompts.
- **No feature words.** Never *"with citations from 25M+ sources"*. The prompt is the user's question, not the pitch.
- **No exclamation points, ever.** Standard brand rule.
- **Traceable.** A new prompt should be defensible against a line in `icp-personas.md`. If it cannot be, it is invented — label it as such in review.

---

## 5 · Card `↳` examples per ICP

The five Type cards each carry a click-to-prefill example on line ③. **That line varies by ICP; lines ① and ② do not.** Same voice rules as §4.

Read each row as: *when the entry ICP is X, card `Market Analysis` shows this example.* **The card order also changes** — the ICP's lead Type (bold) goes first and takes the full-width mobile card.

### Consulting — lead: **Market Analysis**
| Card | `↳` example |
|---|---|
| **Market Analysis** | Competitive teardown of the UK pet nutrition category. |
| Diligence | Company profile on a logistics target before Monday's kickoff. |
| Deal Sourcing | Which players could consolidate European medtech distribution? |
| Research Synthesis | What's driving margin compression in third-party logistics? |
| Strategy | Build the fact base for a cost-reduction case in automotive aftermarket. |

### Strategy / Corp Dev — lead: **Strategy**
| Card | `↳` example |
|---|---|
| **Strategy** | Should we enter the Brazilian payments market? |
| Market Analysis | Size the addressable market for our B2B segment, with sources. |
| Diligence | Profile the two competitors our board keeps naming. |
| Deal Sourcing | Which adjacent markets could we credibly move into? |
| Research Synthesis | What regulation is about to reshape our category? |

### Investors — lead: **Diligence**
| Card | `↳` example |
|---|---|
| **Diligence** | Due-diligence read on Acme Corp ahead of a Series B. |
| Deal Sourcing | Acquisition targets in European logistics tech. |
| Market Analysis | What's the market size for EV charging in Southeast Asia, to 2030? |
| Research Synthesis | Is the growth in this category structural or cyclical? |
| Strategy | Investment thesis for vertical SaaS in insurance. |

### Agencies — lead: **Market Analysis**
| Card | `↳` example |
|---|---|
| **Market Analysis** | Category landscape for premium haircare in the UK. |
| Diligence | Company profile on the client before Thursday's pitch. |
| Deal Sourcing | Which brands in this category are likely to move agency? |
| Research Synthesis | What's changing in the consumer's path to purchase in grocery? |
| Strategy | Build the market section of our RFP response. |

### Startups — lead: **Strategy**
| Card | `↳` example |
|---|---|
| **Strategy** | Build the business case for our Series A raise. |
| Market Analysis | TAM, SAM and SOM for B2B climate software in Europe — cited. |
| Diligence | Who are my real competitors, and how are they funded? |
| Deal Sourcing | Which acquirers buy companies like mine? |
| Research Synthesis | What will investors push back on in my market slide? |

### Market research — lead: **Research Synthesis**
| Card | `↳` example |
|---|---|
| **Research Synthesis** | Category primer before we design the discussion guide. |
| Market Analysis | Market landscape of commercial real estate in the Gulf. |
| Diligence | Profile the three brands the client wants benchmarked. |
| Deal Sourcing | Which subcategories are attracting investment? |
| Strategy | Build the context section for our proposal. |

### Category managers — lead: **Market Analysis**
| Card | `↳` example |
|---|---|
| **Market Analysis** | Category read on premium meal kits in the UK specifically. |
| Diligence | Profile the challenger brand taking share in my aisle. |
| Deal Sourcing | Which suppliers should we be talking to next year? |
| Research Synthesis | What's driving premiumisation in ambient grocery? |
| Strategy | Where should we take range architecture next year? |

### Academic — lead: **Research Synthesis**
| Card | `↳` example |
|---|---|
| **Research Synthesis** | Literature synthesis on platform competition. |
| Market Analysis | Size the market for my case competition — with sources I can cite. |
| Diligence | Company profile on an airline for my case study. |
| Deal Sourcing | Which firms are consolidating in this sector? |
| Strategy | Market context chapter for my dissertation. |

### Generic — no ICP known *(fallback)*
The canonical set from `onboarding-understanding.md`, lead **Market Analysis**:

| Card | `↳` example |
|---|---|
| **Market Analysis** | Size the EV charging market in Southeast Asia to 2030. |
| Diligence | Due-diligence read on Acme Corp ahead of a Series B. |
| Deal Sourcing | Acquisition targets in European logistics tech. |
| Research Synthesis | What's changing in EU AI regulation, and who's exposed? |
| Strategy | Build the business case for entering India's EV fleet market. |

---

## 6 · The fixed card text — for reference, not for editing

Lines ① and ② are **identical for every visitor**. They are reproduced here only so nobody has to go looking for them while wiring the variable line ③.

| ① Type name | ② One-liner *(fixed)* |
|---|---|
| Market Analysis | Market size, competition, category reads |
| Diligence | Company, target and executive deep-dives |
| Deal Sourcing | Acquisition targets and investable sectors |
| Research Synthesis | Regulatory and evidence — one clear read |
| Strategy | Market entry, business cases, theses |

Source: `onboarding-understanding.md` §"The 5 cards = the 5 core Types". A per-ICP variant of line ② was drafted and **rejected** (Joy, 2026-08-20) — the Type and its definition read the same to everyone; the example on line ③ carries the recognition.

---

*Design session · 2026-08-20. Derived from `.agents/icp-personas.md`; implements `onboarding-understanding.md` §ICP-based personalization.*
