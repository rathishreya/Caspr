# Caspr content repository — README, voice and card index

*One Answer, Four Surfaces — the source of truth for Help Centre, Blog, Social & Video.*
**Status: Pass 4 applied 2026-09-15** — 122 cards aligned to the 2026-09-15 decisions (Source · Assess · Conclude; Try/Solo/Team/Org; the non-utilization fee; Data Room public-default; 2FA/OAuth/templates; the $300 depth **Coming soon**). App export at `content/export/help-app.json`.

> ⚑ **Transcribed into the repository 2026-09-16** from the PDF Joy shared, so the portal's linter and the engine's prompts can cite the copy rules by name. **The spreadsheet on Drive stays the source of truth**, and it holds one thing this file does not: the **canonical answers** themselves (the `Canonical Answer` column, ~122 finished texts). What is here is the part the engine needs — the voice rules, the card index, and the change log. If the two disagree, the spreadsheet wins.

---

## What this file is

A repository of **Answer Cards**. Each Card = **one customer question + one canonical answer**, written once and rendered into every surface (in-app Get Help, website blog, social post, video/screenshots). **Write once here; publish everywhere.**

**Tabs in the spreadsheet:** README · Voice Cheat Sheet · Answer Cards · Frame Manifest (the app screens Joy must finalize before UI assets can be built).

**How a writer uses it.** Pick a row (filter `Status='To write'`, sort by Wave). Everything needed is in the row: Writing Brief, Proof Points, Target Keyword, Max Depth, CTA, Word Count. Write in the Voice tab's tone, paste into `Canonical Answer`, set `Status='Draft'`. **Rows are independent — many writers in parallel.**

**The depth ladder.** `L1` Micro (≤280 char: social, tooltips) · `L2` Help (150–400 wd) · `L3` Blog (800–2000 wd: SEO/AI-search) · `L4` Rich (video / annotated screenshots). **Always write L2 first (the atom); higher levels expand it.**

**The ten categories.** A Getting Started · B What Makes Caspr Different · C Running an Analysis · D Understanding Your Report · E Editing & Refining · F Pricing & Budget · G Account, Security & Teams · H Use Cases by Role · I Troubleshooting · J Glossary — **plus K Data & the Data Room**, added in Pass 2.

**Waves.** 1 Activation (first-report path + money questions) · 2 Positioning (differentiators, glossary) · 3 Depth & Use Cases · 4 Long tail (account, troubleshooting).

**Programmatic scale, beyond the seed cards.** Categories B & H template at scale from the same canonical Cards: *market size of [industry]* · *Caspr for [role]* · *business case for [X] in [country]* · *acquisition targets in [sector]*.

**Asset status values.** *Ready to build now* (concept diagrams, infographics, concept videos, social graphics) · *Await Figma frames* (annotated screenshots + walkthrough videos) · *Await sample report* · *n/a (text only)*.

---

## Voice Cheat Sheet — read before writing any card

**Voice: The Trusted Senior Analyst.** The most credible person in the room. Arrives with the numbers done, speaks in conclusions not caveats, never wastes a word.

**The message stack — locked 2026-08-20. Everything below serves this.**

- **Category:** Analytical AI · **Identity:** *"Not an assistant. An analyst."* · **Promise:** *"Arrive certain."*
- **Proof:** *"Every source, credible. Every claim, triangulated. Every report, defensible."*

**Three rules that come with it — absolute**

- **Never name a competitor or the LLM category in LEAD copy** (hero, headline, first line, any ad). The contrast is category education — `/vs/*`, `/alternatives/*`, social, founder content only.
- **Never frame proof as work for the reader.** No *verify*, *check the working*, *see for yourself*, *audit it*. **Describe the artefact; never assign the labour.**
- **Cost is the third act. Price never leads a headline.**

**Do**

- Lead with the answer (the conclusion), then support it.
- Anchor with numbers: *15 minutes*, *100 pages*, *90% cheaper*, *from $15* — not *fast*, *affordable*.
- Every insight cited to a source. Trust the reader; do not over-explain.
- Dry wit allowed — intelligence is the humour, never announced.
- Say *Analytical AI*, *Source. Assess. Conclude.*, *purpose-built for analysis*.

**Do not**

- **No exclamation points. Ever.**
- No hedging, no caveat-stacking, no padding.
- **Banned words:** platform, leverage(s), algorithms, workflows, powerful AI, revolutionary, game-changing.
- **Banned framings:** *excited to announce*, *Here's how:*, emoji-led hype.
- **Do NOT use "LAM"** — the architecture claim is not public. Use *Analytical AI* / *Source. Assess. Conclude.*
- Use *chatbot*, *web scraping*, *hallucinate* **only to name what Caspr is NOT**.

**Approved copy — tiered.** A line's tier is **where it may appear**, not how good it is. Full list: `CLAUDE.md`.

- **LEAD — hero-eligible:** *Not an assistant. An analyst.* (the homepage H1) · *Arrive certain.* · *Every source, credible. Every claim, triangulated. Every report, defensible.* · *Caspr means Business.*
- **SUPPORTING — folds, proof lines, ad creative. Never a hero:** *15 minutes. 100 pages. Cited to source.* · *The $200,000 question. For $80.* · *Analyst-grade insights. Without the analyst retainer.*
- **CATEGORY EDUCATION ONLY** — `/vs/*`, `/alternatives/*`, social, founder writing. Never a hero, headline or ad: *While the world was building generative AI, we built analytical AI.*
- **RETIRED — DO NOT USE:** *Stop Googling. Start analyzing.* (names a competitor's product **and** tells the reader they are doing it wrong) · *Your competitors are still waiting for the research.* (speed-led and combative; the voice is calm authority, not rivalry).

**Key facts (never contradict)**

- **Output:** boardroom-ready PDF or editable PPTX, every insight cited. **Page count and time are by depth:** Brief 3–5 pp / ~15 min · Study ~100 pp / 1–2 hrs · Intelligence up to 24 hrs, multi-model.
- **Data:** 25M+ curated credible sources (documents, government databases, news feeds) — **not web scraping**. Every insight cited to a named, retrievable source.
- **Source · Assess · Conclude** *(retired: Thinking/Learning Brain — **never use *brain* / *thinking* / *learning* / *weigh***)*. Source = every source, credible (25M+ corpus + live feeds + your material) · Assess = every claim, triangulated · Conclude = every report, defensible.
- **Free trial:** $100 Research Budget, no credit card, 90-day expiry.
- **Prices** — universal points **$15 / $80 / $300**; **names are per deliverable type.** MR = Brief/Study/Intelligence · Investment = Screen/Thesis/Diligence · Academic = $8/$40. **The $300 depth is Coming soon at launch. Never a depth name without its type.**
- **Plans = Try / Solo / Team / Org** (never Professional/Business/Enterprise/Free/Plus/Pro). Try: none, $100 gifted, 90-day. Solo: **$200 a month of research**. Team: **$600**. Org: a licence — **$1,000/seat/mo billed annually, 5-seat min, shared pool. Full budget usable (no 7% fee).**
- Solo adds editing + the Data Room (25 GB) + Updates (coming). Team adds a shared Data Room (100 GB) + collaborative editing. Org adds SSO/API/Projects/pooled 200 GB per seat. **Depth is NOT plan-gated** — every plan gets every (live) depth.
- **Non-utilization fee model:** the full Research Budget loads, **no fee upfront**; use a tenth of it in a cycle → no fee; below that, the shortfall is a *Non-utilization fee* line. **Unused balance carries forward.** The Research Budget is **not** a subscription price — *"$200 a month of research"*, never *"$200/mo"*.

**Pass-3 copy standards (2026-08-18)**

- Say **budget**, never *plan*, for the subscription/milestone/Research Budget.
- Capitalize the product nouns: Data Room, Research Budget, Brief, Study, Intelligence, Ask Caspr, Included/Excluded/Connected.
- Currency: exact balances two decimals (86.00); marketing/price figures whole (5, 0, 00/mo).
- *top up* (verb) / *top-up* (noun). *analysis* = the act; *report*/*document* = the output.
- Sources = **25M+** (was 1M+). **Report page/time is BY DEPTH — never pair "100 pages" with "15 minutes".**
- Report switcher = Contents · Ask Caspr · Edit · Outputs · Updates (**Versions is via the ⋯ menu**, not the switcher).
- Data Room actions = row checkbox + selection toolbar (the ≡ row-menu is gone). *Reset account* removed → 3 scoped resets + Delete account.
- Deliverable **names** adapt by ICP (Screen/Thesis/Diligence, Pitch Deck, TAM, DD); the three **depths** stay Brief/Study/Intelligence.
- Editing = **included edit credits** by depth (Brief 15,000 / Study 80,000 / Intelligence 300,000), **a benefit not a fee**, Solo unlock. Do not surface token top-ups in copy. New scope = a new analysis priced at the gate.

**PASS-4 UPDATES (2026-09-15) — supersede anything above that conflicts**

- Message stack: *Not an assistant. An analyst.* · *Arrive certain.* · *Every source, credible. Every claim, triangulated. Every report, defensible.*
- **Analyst, not advisor/expert.** Never name a competitor or the LLM category in lead copy (category education only on `/vs`, social, founder content).
- **Never frame proof as work for the reader** — no *verify*, *audit it yourself*, *check the working*. Citations answer *"when the room asks"*.
- **The Signal** (singular, the opinion/sentiment layer inside a report) is real, **never priced. "Caspr Signals" is RETIRED — never write it.**
- **Data Room UPLOAD defaults to Included + Public** (confirm-not-private prompt). Prompt-bar attachment = **Excluded + Private**. *Public* = a publicly available doc Caspr may use in its research; *Private* = only your analyses. **(Reversed from the old "private by default".)**
- Editing = included edit credits (Brief 15,000 / Study 80,000 / Intelligence 300,000), a benefit not a fee, **Solo** unlock. **Templates are LIVE at launch** ($1,000/template, 3 for $2,500).
- **2FA = authenticator app only** (8 backup codes, trust-device 30 days). Sign in with Google/LinkedIn/Microsoft. Support: **desk@caspr.ai**, reply within one working day (*"Message the desk"*).
- **Coming soon (not live):** the $300 depth, Insights, Updates, Connect-a-source, Legal Document, the Alerts bell.

---

## The card index

*122 cards. `Surfaces` is where the answer renders; `Max depth` is the ladder rung it is written to. Canonical answers live in the spreadsheet.*

### A · Getting Started

| ID | Question | Surfaces | Depth | Wave |
|---|---|---|---|---|
| A-01 | What is Caspr and what does it do? | Help · Blog · Social · Video | L4 | 1 |
| A-02 | How do I create my first analysis? | Help · Video | L4 | 1 |
| A-03 | What should I type in the prompt box? | Help · Blog · Social · Video | L4 | 1 |
| A-04 | What happens after I submit a prompt? | Help · Video | L3 | 1 |
| A-05 | Why is Caspr asking me clarifying questions? | Help · Social | L2 | 1 |
| A-06 | How long does an analysis take? | Help · Social | L2 | 1 |
| A-07 | What do I get at the end — PDF or PPTX? | Help | L2 | 1 |
| A-08 | What is the $100 free Research Budget? | Help · Blog · Social | L3 | 1 |
| A-09 | Do I need a credit card to start? | Help · Social | L1 | 1 |
| A-10 | Brief vs Study vs Intelligence — which do I pick first? | Help · Blog | L3 | 1 |
| A-11 | Can I see an example report before I run one? | Help · Blog · Social | L3 | 1 |
| A-12 | What happens when I sign up? | Help · Video | L3 | 1 |

### B · What Makes Caspr Different

| ID | Question | Surfaces | Depth | Wave |
|---|---|---|---|---|
| B-01 | What is Analytical AI, and how is it different from Generative AI? | Help · Blog · Social · Video | L4 | 2 |
| B-02 | How does Caspr handle sources that disagree? *(Assess)* | Help · Blog · Social · Video | L4 | 2 |
| B-03 | How current is Caspr's data? *(Source)* | Help · Blog · Social · Video | L4 | 2 |
| B-04 | Where does Caspr get its data? | Help · Blog · Social | L3 | 2 |
| B-05 | How does Caspr cite its sources? | Help · Blog · Social · Video | L4 | 2 |
| B-06 | What does "zero hallucinations" actually mean? | Help · Blog · Social | L3 | 2 |
| B-07 | Why doesn't Caspr just scrape the web? | Help · Blog · Social | L3 | 2 |
| B-08 | Is Caspr a chatbot? | Help · Blog · Social | L3 | 2 |
| B-09 | How up-to-date is Caspr's data? | Help · Social | L2 | 2 |
| B-10 | How is Caspr different from using ChatGPT for research? | Help · Blog · Social | L3 | 2 |

### C · Running an Analysis

| ID | Question | Surfaces | Depth | Wave |
|---|---|---|---|---|
| C-01 | What is the structured layout proposal? | Help · Video | L3 | 3 |
| C-02 | Can I change the layout before it runs? | Help · Video | L2 | 3 |
| C-03 | How do I choose the right depth for my question? | Help · Blog | L3 | 3 |
| C-04 | What is a Premium Data Add-on, and when is it worth it? | Help · Blog | L3 | 3 |
| C-05 | Can I upload my own data? | Help | L2 | 3 |
| C-06 | Can I run multiple analyses at once? | Help | L2 | 3 |
| C-07 | What topics and industries can Caspr analyze? | Help · Blog | L3 | 3 |
| C-08 | Can Caspr analyze a specific company or niche market? | Help · Blog | L3 | 3 |
| C-09 | What regions and languages does Caspr cover? **[VERIFY]** | Help | L2 | 4 |
| C-10 | What is the gate before I generate? | Help · Video | L2 | 3 |
| C-11 | Can I change the report before it generates? | Help | L2 | 3 |
| C-12 | Can I pause or stop a report while it generates? | Help | L2 | 4 |

### D · Understanding Your Report

| ID | Question | Surfaces | Depth | Wave |
|---|---|---|---|---|
| D-01 | How to read your Caspr report | Help · Video | L4 | 3 |
| D-02 | What's inside a 100-page report? | Help · Blog · Video | L4 | 3 |
| D-03 | Where does each claim come from? | Help | L2 | 3 |
| D-04 | Can I trust the numbers? | Help · Blog · Social | L3 | 3 |
| D-05 | PDF vs editable PPTX — what's the difference? | Help | L2 | 3 |
| D-06 | What is Intelligence and what makes it deeper? *(Coming soon)* | Help · Blog | L3 | 3 |
| D-07 | How do I turn a Caspr report into my board deck? | Help · Blog | L3 | 3 |
| D-08 | What output formats do I get? | Help | L2 | 3 |
| D-09 | Can I get my report in another language? | Help | L2 | 3 |
| D-10 | Can I change the report's style or template? | Help | L2 | 3 |
| D-11 | What is Ask Caspr? | Help · Video | L3 | 3 |
| D-12 | How do citations work in my report? *(the red dot)* | Help · Video | L3 | 3 |
| D-13 | What are Versions? | Help | L2 | 3 |
| D-14 | What is the Contents view? | Help | L2 | 3 |
| D-15 | What are Updates? *(Coming soon)* | Help | L1 | 4 |
| D-16 | What is Theater? | Help · Video | L2 | 3 |
| D-17 | What are the charts and visuals in my report? | Help | L2 | 4 |

### E · Editing & Refining

| ID | Question | Surfaces | Depth | Wave |
|---|---|---|---|---|
| E-01 | How to edit your report | Help · Video | L3 | 3 |
| E-02 | How to export to PowerPoint | Help | L2 | 3 |
| E-03 | How to request a follow-up analysis | Help · Video | L3 | 3 |
| E-04 | How to refine one section without re-running everything | Help | L2 | 3 |
| E-05 | How do I get more formats or languages after generating? | Help | L2 | 3 |
| E-06 | What are edit credits? | Help · Blog | L2 | 2 |
| E-07 | Can I get reports in my own template? | Help · Blog | L2 | 1 |

### F · Pricing & Budget

| ID | Question | Surfaces | Depth | Wave |
|---|---|---|---|---|
| F-01 | How does Caspr pricing work? | Help · Blog | L3 | 1 |
| F-02 | What is a Research Budget? | Help · Social | L2 | 1 |
| F-03 | How much does each analysis cost? | Help · Social | L2 | 1 |
| F-04 | What happens to unused budget? | Help | L2 | 1 |
| F-05 | What's included at each plan? **[VERIFY: API scope]** | Help · Blog | L3 | 1 |
| F-06 | Can I buy Intelligence without a subscription? | Help · Social | L2 | 1 |
| F-07 | How does the free trial work? | Help · Blog · Social | L3 | 1 |
| F-08 | What's your refund policy? | Help | L2 | 4 |
| F-09 | How do I upgrade or change plans? | Help | L2 | 4 |
| F-10 | Is Caspr really cheaper than an analyst or agency? | Help · Blog · Social | L3 | 1 |
| F-11 | What is the non-utilization fee? | Help · Blog | L2 | 1 |
| F-12 | How does the Org plan work? | Help · Blog | L2 | 1 |

### G · Account, Security & Teams

| ID | Question | Surfaces | Depth | Wave |
|---|---|---|---|---|
| G-01 | Is my data private and secure? **[VERIFY]** | Help · Blog | L3 | 4 |
| G-02 | Who can see my analyses? **[VERIFY]** | Help | L2 | 4 |
| G-03 | How do team seats work? | Help | L2 | 4 |
| G-04 | Does Caspr support SSO? | Help | L2 | 4 |
| G-05 | Is there an API? **[VERIFY]** | Help | L2 | 4 |
| G-06 | How do I manage my account settings? | Help | L2 | 4 |
| G-07 | Can I share a report with my team? **[VERIFY]** | Help | L2 | 4 |
| G-08 | Where do I see my balance and spending? | Help | L2 | 4 |
| G-09 | How does Caspr learn about me (Research profile)? | Help | L2 | 4 |
| G-10 | How do I change my language or output style? | Help | L2 | 4 |
| G-11 | How do I secure my account? | Help | L2 | 4 |
| G-12 | What's the difference between resetting and deleting my account? | Help | L2 | 4 |
| G-13 | How do I get help or contact support? | Help | L2 | 4 |
| G-14 | How do I set up two-factor authentication? | Help | L2 | 1 |
| G-15 | Can I sign in with Google, LinkedIn or Microsoft? | Help · Blog | L2 | 1 |
| G-16 | What can Editors and Viewers do on a Team? | Help | L2 | 1 |

### H · Use Cases by Role

| ID | Question | Surfaces | Depth | Wave |
|---|---|---|---|---|
| H-01 | How do consulting firms use Caspr? | Help · Blog · Social | L3 | 3 |
| H-02 | How do investors use Caspr for due diligence? | Help · Blog · Social | L3 | 3 |
| H-03 | How do strategy teams and the C-suite use Caspr? | Help · Blog | L3 | 3 |
| H-04 | How do category managers use Caspr? | Help · Blog | L3 | 3 |
| H-05 | How do agencies use Caspr for pitches? | Help · Blog | L3 | 3 |
| H-06 | How do graduate researchers use Caspr? | Help · Blog | L3 | 3 |
| H-07 | How do corporate dev and M&A teams use Caspr? | Help · Blog | L3 | 3 |
| H-08 | How do startups use Caspr to raise capital? | Help · Blog · Social | L3 | 3 |
| H-09 | How do I do market sizing with Caspr? | Help · Blog | L3 | 3 |
| H-10 | How do I run a competitive landscape analysis? | Help · Blog | L3 | 3 |
| H-11 | How do I run due diligence with Caspr? | Help · Blog | L3 | 3 |
| H-12 | How do I use Caspr for client and pitch research? | Help · Blog | L3 | 3 |

### I · Troubleshooting · J · Glossary · K · Data & the Data Room

| ID | Question | Surfaces | Depth | Wave |
|---|---|---|---|---|
| I-01 | My report is taking longer than expected | Help | L2 | 4 |
| I-02 | I've run out of Research Budget — what now? | Help | L2 | 4 |
| I-03 | My report missed what I wanted — how do I fix the prompt? | Help · Blog | L3 | 4 |
| I-04 | How do I report an issue or reach support? | Help | L1 | 4 |
| J-01 | What is Analytical AI? *(definition)* | Help · Social | L1 | 2 |
| J-02 | What does Assess mean? | Help · Social | L1 | 2 |
| J-03 | What does Source mean? | Help · Social | L1 | 2 |
| J-04 | What is a Research Budget? *(definition)* | Help · Social | L1 | 2 |
| J-05 | What are Brief, Study and Intelligence? | Help · Social | L1 | 2 |
| J-06 | What is a boardroom-ready report? | Help · Social | L1 | 2 |
| J-07 | What is a citation in a Caspr report? | Help · Social | L1 | 2 |
| J-08 | What is the layout proposal? | Help · Social | L1 | 2 |
| K-01 | What is the Data Room? | Help · Video | L3 | 3 |
| K-02 | What file types can I upload? | Help | L2 | 3 |
| K-03 | How do I upload a file? | Help · Video | L2 | 3 |
| K-04 | What's the difference between Private and Public files? | Help | L2 | 3 |
| K-05 | What do Included and Excluded mean? | Help | L2 | 3 |
| K-06 | How do I stop Caspr using a file without deleting it? | Help | L2 | 3 |
| K-07 | How do I delete a file? | Help | L2 | 3 |
| K-08 | Can I connect Bloomberg, Refinitiv or other data sources? *(Coming soon)* | Help | L1 | 4 |
| K-09 | What happens to the files I upload? | Help | L2 | 4 |
| K-10 | Can I organise files into Projects? | Help | L1 | 4 |
| K-11 | How much can I store in the Data Room? | Help | L2 | 1 |
| K-12 | What's the difference between Public and Private files? | Help · Blog | L2 | 1 |

---

## Frame manifest — the app screens that gate the assets

*`Needs Figma Frames? = Yes` means the asset shows real product UI and is blocked until the named frames are finalized. **F20 is a real report export, not a design frame.***

| Frame | App screen | Cards |
|---|---|---|
| F1 | Home / prompt entry (empty prompt box) | 4 |
| F2 | Prompt entered / example prompt typed | 2 |
| F3 | Structured layout proposal | 4 |
| F4 | Layout editing (add / remove / reorder) | 1 |
| F5 | Clarifying questions | 3 |
| F6 | Analysis running / progress | 2 |
| F7 | Report delivered — cover / executive summary | 6 |
| F8 | Report — full content section | 2 |
| F9 | Report — cited insight (citation UI close-up) | 4 |
| F10 | Report — source trace | 2 |
| F11 | Report — navigation / table of contents | 2 |
| F12 | Editing the report (text edit) | 2 |
| F13 | Export — PPTX / PDF | 4 |
| F14 | Follow-up / refine a section | 2 |
| F15 | Depth selection | 0 |
| F16 | Premium Data Add-on (pre-run pricing) | 1 |
| F17 | Account — budget / usage | 4 |
| F18 | Billing / plans / upgrade | 2 |
| F19 | Share a report with team | 1 |
| **F20** | **A real generated SAMPLE REPORT (content, from Joy)** | 6 |
| F21 | Data upload | 1 |
| F22 | Dashboard / multiple analyses / history | 1 |

---

## Change log

**Pass 2 — 2026-08-08.** Added the `Surface` column (Website / App / Both) and a `Coming Soon?` flag to every card; in-app Get Help uses 6 pills (All · Basics · Analyses · Pricing · Reports · Account — B, H, J are website); replaced the F1–F22 placeholders with real Figma node IDs. **28 new cards, 82 → 110**, including the whole K Data & the Data Room category.

**Pass 3 / Phase 1 — 2026-08-18.** 1M+ → **25M+** everywhere; tagline de-paired (page count and time are by depth); voice sweep (plan→budget, product-noun capitalization, currency, top up/top-up); Versions off the switcher; G-12 rewritten around Delete account plus three scoped resets; Data Room mechanics moved to checkbox + selection toolbar; tier names made non-universal; onboarding corrected. **QA clean: 0 exclamation points, 0 banned words, 0 remaining "1M+".**

**2026-08-24.** Voice Cheat Sheet reconciled — retired copy removed, the remaining lines tiered LEAD / SUPPORTING / CATEGORY-EDUCATION, the message stack and the three positioning rules added, *Zero hallucinations* replaced with *every insight cited to a named, retrievable source*. Pillar column remapped to the post-2026-08-20 numbering (**a mechanical remap, not a semantic re-tag**).

**Pass 4 — 2026-09-15.** 122 cards aligned to that day's decisions: Source · Assess · Conclude replaces the retired brains across A, B, D, H and J; Business → **Solo** and Enterprise → **Org** everywhere; the **non-utilization fee** replaces the 7% platform fee and delta-recharge framing; the $300 depth marked **Coming soon** and de-gated from plans; Data Room defaults reversed to **Included + Public** with a confirm-not-private step; *verify* / proof-as-work removed under brand rule 2; templates moved to live at launch. **Eight new cards:** F-11 Non-utilization fee · F-12 How Org works · K-11 Data Room storage · K-12 Public vs Private · G-14 Two-factor setup · G-15 Sign in with Google/LinkedIn/Microsoft · E-07 Reports in your own template · G-16 Editors and Viewers on a Team.

**Still held for Joy — `Publish Ready = HOLD`, needs confirmation:**

| Card | What must be confirmed |
|---|---|
| **C-09** | The exact regions and languages with strong vs limited source coverage, and whether output languages beyond English are supported |
| **F-05 · G-05** | Customer-facing API scope — not yet specced |
| **G-01** | Certification status and audit scope, plus SOC 2 / DPA / data-residency commitments, with the security and compliance team |
| **G-02** | Default visibility at Org — what, if anything, an admin can see of a member's individual analyses without an explicit share |
| **G-07** | In-app collaborative-editing mechanics for Team (real-time vs turn-based), and whether Org supports cross-team sharing beyond Data Room access |
