# Website copy — the binding rules

*2026-08-26. One place, so the copy pass and every future session check against a list rather than six files.*

**Consolidates:** `CLAUDE.md` §5 and the product section · `CONCEPTS.md` · `CONVENTIONS-CONFORMANCE-SPEC` §3.9
· `site-truth.md` §7 · `od-10-results.md` §4 · `gtm/guerrilla-campaign-plan.md` §1, §8 ·
`entry-routes-and-cta.md` · `report-evaluation-2026-08.md` §10.4 · and the decisions taken in the
2026-08-26 structure session, several of which existed nowhere until now.

---

## 1 · Voice and positioning

| | Rule |
|---|---|
| **1.1** | **Never name a competitor or the LLM category in lead copy.** Not in a hero, a headline or an ad. The generative contrast lives on `/vs/*`, in social and in founder writing |
| **1.2** | **Never frame proof as work for the reader.** *Verify · check the working · traceable · see for yourself · audit it* all sell more labour and contradict the promise. **Describe the artefact; never assign the labour** |
| **1.3** | **Cost is the third act.** Time and quality lead. Cost appears in proof lines, never in a headline |
| **1.4** | **Analyst, not advisor and not expert.** Advisor competes with the buyer; expert asks to be trusted on reputation we have not got |
| **1.5** | No exclamation points. Ever. Banned: *platform · leverages · algorithms · workflows · powerful AI · revolutionary · game-changing · chatbot · web scraping · hallucinate · "excited to announce"* |

---

## 2 · The depth ladder — the most-repeated error in this project

**`$15 · $80 · $300` are universal. The names are not.**

| Type | $15 | $80 | $300 |
|---|---|---|---|
| Market Research | Brief | Study | Intelligence |
| Investment & Deal | Screen | Thesis | Diligence |
| Business Case | Pitch *(no $300)* | Sales deck · Board paper · Proposal | Board paper · Strategic options |
| Academic | **$8** Brief | **$40** Study | *(none)* |

| | Rule |
|---|---|
| **2.1** | **Never write a depth name without its type.** *"Brief · Study · Intelligence"* standing alone is the Market Research ladder passed off as universal. Enforced as `COPY-07b` |
| **2.2** | Write **"the $300 depth"** for the rung across all types; **"a Study"** only when the subject is Market Research |
| **2.3** | **Availability exceptions travel with the ladder wherever it appears** — Market Sizing has no $15 · Executive Profile has no $300 · pitch decks have no $300 · Strategic Options has no $15 |
| **2.4** | **Depth is levels of decomposition, not pages.** One level · two · three. **Never state a page count** — the topic decides length, and the corpus delivered 35–70pp against a claimed 100 |
| **2.5** | ***"Every claim, triangulated"* is a level-two-and-above property, not unconditional.** `report-evaluation` §10.4: do not ship the unqualified line on the strength of this corpus |

**⚠ Queued:** the tree model needs writing into `document-taxonomy` §Facet 3, `CONCEPTS.md`, `site-truth` §6,
`pricing-model.md`, `report-guidance/tier-*` and the `CLAUDE.md` table. Not yet done.

---

## 3 · The offer and CTAs

| | Rule |
|---|---|
| **3.1** | **`Run the analysis` is the only primary CTA**, every surface. **`Run analysis`** in the mobile header only — chrome compresses, content does not |
| **3.2** | **`Log in` is text**, always reachable in one tap. Sentence case, never Title Case |
| **3.3** | **No per-ICP CTA variants.** Each ICP has eight prompts; a button narrows to one and the landing screen immediately widens. Personalisation lives in the flipping placeholder |
| **3.4** | **`$100` never inside a button.** Fine in body and description text. **Stated once on the website** — the homepage final CTA — and once in-product at the gate |
| **3.5** | **`No account needed`**, not *no credit card*. It is the bigger claim and the true differentiator |
| **3.6** | Every CTA carries `icp_hint` and `utm_*` and lands on a **pre-filled, ICP-relevant question** |
| **3.7** | Retired: *Ask Caspr* as a CTA *(the generative-AI idiom)* · *Start free* · *Get the read* · *Verify* · *Research* · bare *Analyse* |

---

## 4 · Claims

| | Rule |
|---|---|
| **4.1** | **Never invent a competitor's price, publication date or page count.** Every figure is a published list price read from the seller's own page, **carrying its URL, currency and observation date** |
| **4.2** | **A vendor's blog range is never a market fact.** *"Drive Research states $20,000–50,000"* is defensible; *"custom research costs $20,000–50,000"* is not |
| **4.3** | **Attack the format and the economics. Never the firms or their data quality.** We cite these publishers as sources — discrediting them discredits our own output |
| **4.4** | The published word is **`Age`**. *Staleness* is an internal name. Never *outdated*, *stale*, *unreliable*. **Where a figure is current, say so** |
| **4.5** | **`25M+`** sources, never `1M+`. **"Zero hallucinations" is retired** — an absolute is the most attackable claim available |
| **4.6** | **Never *"SOC 2 certified"*** — only *"SOC 2 Type I audit in progress"* |
| **4.7** | **Self-verified compliance reads as features, not credentials.** *"Works with screen readers · keyboard navigable throughout"*, never *"certified"*. Accessibility and GDPR are self-verified; ISO 27001:2022 is externally audited and stays a credential |
| **4.8** | **Synthetic panels are AI-simulated audience response.** Never *"primary research"*, never implying real respondents |
| **4.9** | **Testimonials and TRUSTED BY are invented placeholders.** Write no new attributed quotes — a regulated claim in the US, UK and EU |
| **4.10** | **The 7% platform fee is internal.** Never named, never itemised. The charge and the amount available for analyses are both stated; the fee itself never is |
| **4.11** | **⛔ The Research Budget is never a subscription price.** It is money set aside to spend on your own analyses. **Never** *from $200/mo · per month · starting at · the $200 plan*. **Always** *$200 a month of research · set aside $200 · a $200 Research Budget* |
| **4.12** | **⚠ And never write *"you are only charged for what you run"* — it is false.** `pricing-model` §3.1: `R = F + top_up`, and **the fee is charged every month regardless of use**. On a $200 budget: **$14 if nothing ran · $94 for one $80 analysis** *(the $80 top-up plus the fee)* · $189 at heavy use. **What is true and may be written:** *unused balance carries forward* · *the next month restores only what you consumed* · *a quiet month costs far less than a busy one*. Enforced as `COPY-11a` / `COPY-11b` |
| **4.13** | **Two figures, and they travel together.** Every budget shown to a user carries **what is set aside** *and* **what is available for analyses** — *$200 a month of research · ~$186 for analyses*. **$600 → ~$558 · $1,800 → ~$1,674 pooled.** The app's wallet header reads **`$186 available`**, so a page showing only the gross figure sets up a first login that shows less than the page promised. `pages-for-production.md:55` · `CLAUDE.md:150–152` |
| **4.14** | **⛔ But the fee itself is never named.** No *platform fee*, no *7%*, no *$14 / $42 / $126*, and no worked charge example on any public surface. **Show gross and available; explain neither.** The mechanics belong in the pricing and refund terms. **⚠ Note the tension with 4.13** — a reader who subtracts gets $14 with no label, which is deliberate and flagged for Joy's ruling in [`copy-pricing.md`](copy-pricing.md) flag 8 |

---

## 5 · Product facts that constrain copy

| | Rule |
|---|---|
| **5.1** | **Formats and languages are gated by plan, not by depth.** PDF and Markdown on every plan; PPTX, Word, XLSX, CSV and infographics from Business, as are all languages |
| **5.2** | **Everything unbuilt still ships, tagged `Coming soon`** — the $300 depth, Insights, Updates, connect-a-source. The team removes a tag rather than commissioning a page |
| **5.3** | **Legal Document is excluded entirely** — no type, no sub-types, no use cases, no nav entry. The one exception to 5.2 |
| **5.4** | **Phase, not status.** Website and app go live together, so *"is it built yet"* is never the question. A live-today feature is never tagged |
| **5.5** | **The Signal** is the opinion and sentiment layer **inside a report**. Singular, never tiered, never priced. ~~Caspr Signals~~ is retired and folds into Insights |
| **5.6** | **Trust pages describe what Caspr is and does.** **Never interpret the reader's own obligations** — *"your firm permits this"* is a claim about their policy, not ours |
| **5.7** | **No tier name without explanation.** A first-time reader has never seen *Brief* or *Screen* — say what they get before naming the rung |

---

## 6 · Method

| | Rule |
|---|---|
| **6.1** | **Write in layers, not page by page.** All eyebrows site-wide · then all headlines · then body · then CTAs. **Read the headline list as a list** before moving on |
| **6.2** | **Primary over summary.** `icp-personas.md` over any table that summarises it. Quote the source line that produced each headline |
| **6.3** | **Traceable, or flagged as invented.** Every headline, claim and price points at a research finding, a recorded decision, or a stated assumption |
| **6.4** | **Every template carries an AEO answer block** — one paragraph, top, answering that page's question before any marketing. It is the citation target |
| **6.5** | **FAQ questions come from `presence-metric.md`'s baskets**, never invented. `FAQPage` schema is for answer engines only — Google deprecated FAQ rich results on 7 May 2026 |
| **6.6** | **Rule 6 hygiene pass before anything publishes.** `clean-user-facing-text`, prose only, `--no-normalize-spaces`. **Never on a product deliverable**, which must keep its AI provenance mark |

---

## 7 · Open, and blocking nothing

| | |
|---|---|
| **1** | **Pricing needs one more pass before `/pricing` copy** — the two gating cuts (by analysis type, by plan tier) need reconciling, and whether a zero-commitment single-analysis option exists |
| **2** | **`$1,800` reads as more than three Business seats when it is the same money pooled** — three $558 budgets strand, one $1,674 pool does not. The argument is not currently made anywhere |
| **3** | **The tree-model depth update** to the core docs, §2 above |
