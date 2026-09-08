# Language capability — what we can actually claim

> ## PARKED TO PHASE 1.5 — Joy, 2026-08-22
>
> Multilingual is **not launch scope**. Revisit this document when Phase 1.5 opens.
>
> **What that means for the website now:** English only. The multilingual fold and the *"Written in your
> language"* claim stay in Figma but must not ship as a launch promise — they belong with the Phase 1.5 wave.
> The `/languages` page moves out of the Tier 2 build list.
>
> Analysis below is complete and stands. Open when needed: the four-axis priority table (§11) is the decision
> artefact; the testing list is Russian · Turkish · Polish · Ukrainian · Traditional Chinese.

**2026-08-22.** Answers "which languages should Caspr support at launch, and how confident are we in each."

---

## 1 · The finding that changes the question

**Caspr's reports are not written by Claude.**

`.agents/security-posture.md` §2 defines a two-tier architecture:

| Tier | What it does | Models |
|---|---|---|
| **Tier 1** | Query clarification, report summarisation, follow-up Q&A — **the conversation** | Anthropic (Claude), OpenAI, Google |
| **Tier 2** | Competitive intelligence, trend extraction, entity recognition, sector classification, **synthesis, long-context document analysis** — **the report** | **Qwen** (Alibaba) · **GLM** (Zhipu) · **Kimi** (Moonshot), self-hosted on Caspr's AWS |

So Claude's multilingual ability governs **how well Caspr talks to the user**. It does not govern **what language
a 100-page cited report can be written in**. That is a Qwen / GLM / Kimi question, and only Jayant can answer it.

**A consistency check that supports this.** You said Arabic is the one language where our translation engine beats
native generation. Claude's published Arabic score is **97.2% of English** — among its strongest. If Caspr's
native Arabic were constrained by Claude, Arabic would not be the exception. It is the exception because Tier 2
is the constraint. That is worth knowing before we pick a launch set off the wrong table.

---

## 2 · Claude's published multilingual performance

Source: [platform.claude.com/docs/en/build-with-claude/multilingual-support](https://platform.claude.com/docs/en/build-with-claude/multilingual-support), retrieved 2026-08-22.

**Benchmark:** MMLU, human-translated into 14 languages by professional translators (OpenAI `simple-evals`).
Zero-shot chain-of-thought, with extended thinking. Scores are **relative to English = 100%**.

| Language | Claude Sonnet 4.5 | Claude Haiku 4.5 |
|---|---|---|
| English (baseline) | 100% | 100% |
| **Spanish** | **98.2%** | 96.4% |
| **Italian** | **97.9%** | 96.0% |
| **Portuguese (Brazil)** | **97.8%** | 96.1% |
| **French** | **97.5%** | 95.7% |
| **Indonesian** | **97.3%** | 94.2% |
| **Arabic** | **97.2%** | 92.5% |
| **German** | **97.0%** | 94.3% |
| **Chinese (Simplified)** | **96.9%** | 94.2% |
| **Japanese** | **96.8%** | 93.5% |
| **Korean** | **96.7%** | 93.3% |
| **Hindi** | **96.7%** | 92.4% |
| Bengali | 95.4% | 90.4% |
| Swahili | 91.1% | 78.3% |
| Yoruba | 79.7% | 52.7% |

Anthropic adds: *"Claude is capable in many languages beyond those benchmarked… Test with any languages relevant
to your specific use cases."*

### Two caveats that matter more than the numbers

1. **MMLU measures comprehension, not composition.** It is a multiple-choice knowledge test. A 97% relative score
   says Claude *understands* the language nearly as well as English. It says **nothing** about whether it writes
   fluent, register-correct, board-grade prose in it. Those are different capabilities, and the second is what we
   are selling.
2. **The published table is Sonnet 4.5 and Haiku 4.5**, not the current Opus tier. Opus would presumably score
   higher, but that is an assumption — Anthropic has not published it.

---

## 3 · Confidence, stated honestly

Three different confidence levels are in play, and conflating them is how we would end up over-promising.

| | What we would be claiming | Evidence | Confidence |
|---|---|---|---|
| **A** | Caspr can *converse* with a user in language X | The table above, cited | **High** for the top 11 · Medium for Bengali · Low for Swahili, Yoruba |
| **B** | Caspr can *write a 100-page cited report* in language X | **None.** Wrong model family, and no generation benchmark exists | **Unknown** — must not be claimed |
| **C** | That report reads like a native analyst wrote it, in the right register | None. This is the *"Written in your language. Not translated into it."* claim | **Unknown** — currently unevidenced on the live site |

**Claim C is already on the homepage.** It went into Figma this week. It is the strongest language claim we make
and it currently rests on `pricing-model.md` §4.6-B asserting it, not on a measurement. `site-truth.md` §7 already
flags it as needing Jayant's sign-off. This report does not change that — it sharpens why it matters.

---

## 4 · Proposed launch set — and what each tier is waiting on

Ordered by evidence, not by market size. Market priority is your call and cuts across this.

| Tier | Languages | Rationale | Blocker |
|---|---|---|---|
| **1 — launch** | English · Spanish · French · German · Portuguese (BR) · Italian | Top of the benchmark, Latin script, no typography work, largest business-research markets outside English | Tier 2 generation eval |
| **2 — launch if Tier 2 confirms** | Chinese (Simplified) · Japanese · Korean | Strong scores. **Qwen/GLM/Kimi are Chinese-origin — Chinese is likely their strongest non-English language.** CJK typography in PDF/PPTX needs font embedding work | Tier 2 eval + font pipeline |
| **3 — deliberate, probably post-launch** | **Arabic** | Claude scores it high; you report native generation is weak, so it runs through translation. RTL is a **full design and render workstream** — website, report PDF, PPTX, and charts | RTL design + render + the translation path |
| **4 — not at launch** | Indonesian · Hindi · Bengali · Swahili · Yoruba | Indonesian and Hindi score well but the near-term business-research market is thinner; the last two are materially weaker | Market call, not capability |

---

## 5 · The eval that would replace all this inference

Cheap, and it converts claim B and C from assumption to evidence.

1. Take **three real Caspr prompts** across different deliverable types.
2. Generate each in **English plus five candidate languages**, natively.
3. Have a **native-speaker professional in that field** — not a translator — score each on four axes:
   **terminology accuracy · register (does it read like an analyst) · structural fidelity · citation integrity**.
4. Repeat with the translation path for the same prompts.
5. Ship the languages that pass; route the rest through translation, as Arabic already is.

That is roughly a week and a handful of reviewers, and it is the difference between *"Written in your language"*
being a claim we can defend and one we cannot.

---

## 6 · Website multilingual, and the seam nobody has costed

You proposed: site in multiple languages, RTL for Arabic, auto-detected by region, header switcher.

**The website and the product are separate decisions and separate costs.** Translating static site copy is cheap
and safe. Generating reports in a language is a capability question with an unknown answer. They should not ship
as one promise.

**The seam to be careful about.** Per the milestone table in `product-marketing-context.md`, **all languages are a
Business ($600) unlock** — Free trial and Professional are **English only**. So:

> A French visitor is auto-detected, lands on a French site, reads *"Written in your language"*, signs up on the
> free trial — and gets an English report.

That is the worst possible first run, and it is the direct consequence of localising the site without gating the
message. If we localise, the language gate has to be visible on the pricing page **in that language**, and the
trial's English-only limit has to be stated before signup, not discovered after.

**On RTL specifically:** Arabic is not a translation task, it is a layout task — mirrored grids, mirrored nav and
icons, bidirectional runs where Latin brand names and numerals sit inside Arabic text, and the same again inside
the PDF and PPTX renderer and every chart. Worth doing, worth scoping as its own workstream.

---

## 7 · Mid-conversation switching and mixed language

Anthropic's own guidance is directly relevant and short:

> *"Claude infers the response language from the conversation, but for production applications you should state
> the target language explicitly. The most reliable place to do this is the system prompt, which keeps the
> instruction stable across every turn."*

So the robust design is **an explicit, sticky language setting**, not per-turn inference:

- **Detect once**, at first prompt, and **state it back** — the get-to-know thread already exists for exactly this
  kind of confirmation, and it is one line: *"Answering in French — say the word to switch."*
- **Persist it** on the analysis, so every turn and every output inherits one value rather than re-inferring.
- **A mid-conversation switch is an explicit action**, not a guess. Inferring it from one code-switched sentence
  will misfire on exactly the users who code-switch most — which is most bilingual professionals.
- **Mixed-language input is normal and should not change the output language.** A French analyst quoting an
  English press release is not asking for an English report.
- **The output language is a gate parameter, not a chat behaviour** — `gate-output-spec.md` §6 already treats
  language as a gate multi-select. Conversation language and report language should be able to differ.

---

## 8 · What needs Jayant

| # | Question |
|---|---|
| 1 | **Which languages can Qwen / GLM / Kimi generate long-form analysis in, at what quality?** This is the actual launch-set question |
| 2 | Is *"reasons and writes natively, not translated"* true per language — and where is the line drawn? |
| 3 | Does the PDF/PPTX renderer support CJK font embedding and RTL layout today, or is that new work? |
| 4 | Where does the language decision live — is it stamped on the analysis record and inherited by every output? |

*Tier-2 generation confidence: Joy and Jayant have this in hand (2026-08-22). Questions 1 and 2 above are
answered off-document; kept for the record only.*

---

# 9 · OpenAI — the same benchmark, made comparable

Source: [github.com/openai/simple-evals](https://github.com/openai/simple-evals/blob/main/multilingual_mmlu_benchmark_results.md), retrieved 2026-08-22.

**This is the same dataset Anthropic used** — MMLU translated into the same 14 languages by the same professional
human translators. That makes it a genuine like-for-like comparison, which is rare.

**One adjustment was required.** OpenAI publishes **absolute** scores with **no English row**; Anthropic publishes
**relative to English**. To compare them I took the English MMLU scores from the `simple-evals` README and
normalised. **The relative columns below are my calculation, not published figures** — the arithmetic is
`language ÷ English`, and the baselines are stated so it can be checked.

**English baselines used:** o3-high **92.9** · gpt-4.1 **90.2** · gpt-4o-mini **82.0**.

### Relative to English (100%)

| Language | Claude Sonnet 4.5 *(published)* | **o3-high** *(derived)* | **gpt-4.1** *(derived)* |
|---|---|---|---|
| Spanish | 98.2% | 98.1% | 97.1% |
| Italian | 97.9% | **98.2%** | 96.3% |
| Portuguese (Brazil) | 97.8% | **98.0%** | 96.5% |
| French | 97.5% | 97.5% | 96.5% |
| Indonesian | **97.3%** | 96.7% | 95.2% |
| Arabic | 97.2% | **97.3%** | 93.6% |
| German | 97.0% | **97.4%** | 94.8% |
| Chinese (Simplified) | **96.9%** | 96.1% | 95.5% |
| Japanese | **96.8%** | 95.8% | 94.9% |
| Korean | **96.7%** | 96.1% | 94.1% |
| Hindi | 96.7% | 96.7% | 93.3% |
| Bengali | **95.4%** | 94.5% | 91.7% |
| Swahili | 91.1% | **92.6%** | 88.1% |
| Yoruba | 79.7% | **84.0%** | 71.7% |

### Small models — where the vendors actually diverge

| Language | Claude Haiku 4.5 *(published)* | **gpt-4o-mini** *(derived)* | Gap |
|---|---|---|---|
| Spanish | 96.4% | 94.4% | +2.0 |
| French | 95.7% | 93.4% | +2.3 |
| German | 94.3% | 90.6% | +3.7 |
| Chinese (Simplified) | 94.2% | 89.1% | +5.1 |
| Japanese | 93.5% | 88.5% | +5.0 |
| Korean | 93.3% | 87.8% | +5.5 |
| **Arabic** | **92.5%** | 86.5% | **+6.0** |
| **Hindi** | **92.4%** | 84.4% | **+8.0** |
| **Bengali** | **90.4%** | 80.2% | **+10.2** |
| Swahili | 78.3% | 75.5% | +2.8 |
| Yoruba | 52.7% | 55.9% | −3.2 |

### What the comparison actually says

1. **At the frontier the two are the same.** Claude Sonnet 4.5 and o3-high sit within about a point of each other
   on eleven of fourteen languages. **Vendor choice is not a language-capability decision at the top end** — pick
   on cost, latency, retention terms and architecture instead.
2. **gpt-4.1 carries a consistently larger language penalty** than either frontier model — 2–4 points below on
   most languages, and 3.6 points below Claude on Arabic.
3. **The real divergence is in the cheap models, and it is large.** Claude Haiku 4.5 beats gpt-4o-mini by
   **6 points on Arabic, 8 on Hindi, 10 on Bengali**. If any part of the pipeline routes non-English work to a
   small model to save cost, that choice is worth far more in those languages than the frontier choice is.
4. **Yoruba is the one place OpenAI leads** — o3-high 84.0% against Claude's 79.7%, and gpt-4o-mini edges Haiku.
   Not relevant to our launch set, but it is the exception to note rather than smooth over.

### The same two caveats still hold

**MMLU measures comprehension, not composition.** Both tables tell us how well a model *understands* a language,
not whether it writes board-grade prose in it. And these are different model generations evaluated at different
times — the relative normalisation controls for raw capability, which is exactly why it is the fair comparison,
but it does not make the models contemporaries.

---

# 10 · What is missing from both tables — and why it is not a capability signal

**Both vendors use one dataset.** The 14 locales are **OpenAI's MMMLU** release
([huggingface.co/datasets/openai/MMMLU](https://huggingface.co/datasets/openai/MMMLU)) — `AR · BN · DE · ES_LA ·
FR · HI · ID · IT · JA · KO · PT_BR · SW_KE · YO_NG · ZH_CN`. Anthropic evaluates against it. So "neither vendor
publishes Russian" is not two independent judgments — **it is one dataset used twice.**

**Absent:** Russian, Ukrainian, Polish, Czech — the **entire Slavic family** — plus Dutch, Turkish, Vietnamese,
Thai, Persian, Hebrew.

**No selection rationale is published**, for inclusions or exclusions. The stated motivation is inclusivity —
*"By prioritizing high-quality translations, we aim to make AI technology more inclusive and effective for users
worldwide"* — with Yoruba named as the low-resource case.

### Reading it — labelled by confidence

| | Assessment |
|---|---|
| **Not a capability gap** — high confidence | Russian is a very high-resource language, abundant in web-scale corpora. The set *includes* Swahili and Yoruba, which are far lower-resource and score far worse. If the aim were avoiding embarrassment you would drop Yoruba, not Russian. There is no plausible mechanism by which Russian trails Bengali or Indonesian |
| **Partly commercial** — medium confidence | Neither OpenAI nor Anthropic offers service in Russia or Belarus. Human translation of a 14,000-question test set is expensive, and a market you cannot sell into is a weak case for that spend |
| **Mostly a framing artefact** — medium confidence | Fourteen locales bought regional spread — Africa, South Asia, South-East Asia, East Asia, Middle East, Latin America, Western Europe. Under an "underrepresented communities" framing Russian is neither underrepresented nor low-resource, so it does not earn a slot. Slavic loses out as a family, not as a country |

**Against the purely geopolitical read:** the set also omits Dutch, Polish, Turkish, Vietnamese and Hebrew. It is
a small curated sample, not a list with Russia struck off it.

### What it means for us

- **Absence is not weakness.** If Russian were measured it would very likely sit with the top Romance and
  Germanic languages. We simply have **no citable figure**, so we cannot publish a claim about it.
- **If Russian matters commercially, it needs our own eval** — the §5 eval, with Russian added. That converts it
  from inference to evidence in the same week of work.
- **The market is not Russia.** Sanctions make that moot. It is Russian-speaking business populations elsewhere —
  the Gulf, Kazakhstan, the Baltics, Israel, Germany. For a business with Middle East roots that is a real
  audience, and a different one from the country.
- **The same logic covers every unlisted language.** Dutch, Polish and Turkish are all likely strong and all
  equally unevidenced. Treat "not in the table" as *unmeasured*, never as *unsupported*.

---

# 11 · Priority, driven by the business model

## The rule that reorders everything

**Language priority is not market size. It is market size × the degree to which professional research is
actually conducted in that language.**

Caspr sells to consultants, strategy teams, investors, agencies and research professionals with **$600+/month**
budgets. In several of the richest such markets, that work is already done in English — a Dutch PE associate
writes the IC memo in English, an Indian GCC runs its research function in English, an Israeli VC deck is in
English. Localising for them buys almost nothing.

The languages that matter are the ones where a **board paper, an IC memo or a category review is genuinely
written in the local language.**

## Four separate decisions, not one

A single "supported languages" list would be wrong, because four different things are being decided and they do
not correlate. **Russian is the proof:** high value as a *source* language, near-zero as a *website* language.

| Axis | The question | What drives it | Cost to add |
|---|---|---|---|
| **SOURCE** | What can the sourcing stage **read**? | Where economically significant material is published and **not mirrored in English** | Lowest — corpus coverage, no UI or render work |
| **CONVERSATION** | What can the user **talk to Caspr in**? | User comfort. Broader than output — people will discuss in their own language then take an English deliverable | Low — Tier 1, and the strongest measured area |
| **REPORT OUTPUT** | What is the **deliverable** written in? | Whether the board paper / IC memo / category review is genuinely local | Highest — generation quality, fonts, RTL, charts, QA |
| **WEBSITE** | What do we **market** in? | Acquisition: SEO, trust, conversion. Also the only axis with a sanctions dimension | Medium — static copy, plus RTL where relevant |

**Source is the cheapest and most undervalued.** Reading Russian filings to produce an English IC memo needs no
Russian typography, no Russian marketing and no Russian customer. It is nearly pure upside.

## The comprehensive table

**H** = launch priority · **M** = second wave · **L** = not now. **Measured** = present in MMMLU.

| Language | Source | Conv. | Report | Web | Note | Measured |
|---|:--:|:--:|:--:|:--:|---|:--:|
| **English** | H | H | H | H | Baseline everywhere | ✓ |
| **French** | **H** | **H** | **H** | **H** | France, Belgium, Switzerland, Luxembourg, Québec, Francophone Africa. Deliverables genuinely French | ✓ 97.5% |
| **German** | **H** | **H** | **H** | **H** | DACH. Domestic filings and press poorly mirrored in English. Board papers are German | ✓ 97.0% |
| **Spanish** | **H** | **H** | **H** | **H** | Spain + LatAm. Highest measured score | ✓ **98.2%** |
| **Arabic** | M | **H** | **H** | **H** | Gulf: sovereign funds, corp dev, government-adjacent strategy. **Founder distribution advantage.** RTL is a real workstream | ✓ 97.2% |
| **Russian** | **H** | M | M | **L** | **Cross-border deal flow** — counterparties, filings, energy, metals, commodities, Central Asia. Users sit *outside* Russia: Gulf, Kazakhstan, Baltics, Cyprus, Germany, Israel. **Read it and converse in it; do not market into Russia** | ✗ |
| **Chinese (Simplified)** | **H** | M | M | L | Vast material not mirrored in English — filings, industry press, policy. Near-term *users* are Singapore, Taiwan, Hong Kong | ✓ 96.9% |
| **Japanese** | **H** | **H** | M | M | Domestic disclosure poorly mirrored in English. Business genuinely Japanese. CJK font work; exacting quality bar | ✓ 96.8% |
| **Portuguese (BR)** | M | M | M | M | Real Brazilian consulting, PE and category market. Latin script, cheap | ✓ 97.8% |
| **Italian** | M | M | M | M | Solid corporate base, low delivery cost | ✓ 97.9% |
| **Korean** | M | M | M | M | Chaebol strategy teams. CJK cost, smaller market | ✓ 96.7% |
| **Turkish** | M | M | M | L | Business runs in Turkish. Bridge market between EU, Gulf and Central Asia | ✗ |
| **Polish** | M | M | M | L | Fast-growing services and corporate market; work is genuinely Polish | ✗ |
| **Ukrainian** | **M** | L | L | L | Reconstruction, agriculture, defence, energy deal flow. **Source value only** | ✗ |
| **Chinese (Traditional)** | M | M | M | L | Taiwan and Hong Kong filings — semiconductors, finance | ✗ |
| **Dutch** | M | L | L | L | Filings have source value; professionals work in English | ✗ |
| **Nordics** (SV·DA·NO·FI) | M | L | L | L | Same shape as Dutch — read the filings, market in English | ✗ |
| **Hebrew** | M | L | L | L | Israeli filings and tech press. VC sector operates in English | ✗ |
| **Indonesian** | M | M | L | L | Domestic disclosure; developing buyer maturity | ✓ 97.3% |
| **Vietnamese** | **M** | L | L | L | Supply-chain relocation makes it a rising *source* language | ✗ |
| **Hindi** | L | M | L | L | **High-priority market, low-priority language.** Indian consulting, GCCs and research agencies run in English | ✓ 96.7% |
| **Thai · Malay · Tagalog** | L | L | L | L | Later | ✗ |
| **Bengali · Urdu** | L | L | L | L | Later | Bengali ✓ 95.4% |
| **Czech · Hungarian · Romanian · Greek** | L | L | L | L | CEE second wave, after Polish | ✗ |
| **Persian** | L | L | L | L | Sanctioned; limited commercial case | ✗ |
| **Swahili · Yoruba** | L | L | L | L | Africa growth story, but not this buyer yet. Francophone Africa is served by French | ✓ |

## What this produces as a launch set

| Axis | Launch |
|---|---|
| **SOURCE** | English · French · German · Spanish · **Russian** · **Chinese (Simp.)** · Japanese · Arabic — then Portuguese, Italian, Korean, Ukrainian, Dutch, Nordics |
| **CONVERSATION** | English · French · German · Spanish · Arabic · Japanese — widest cheap win; extend on demand |
| **REPORT OUTPUT** | English · French · German · Spanish · **Arabic** — the five that justify the delivery cost |
| **WEBSITE** | English · French · German · Spanish · **Arabic (RTL)** — Japanese second wave |

**Report output is deliberately the shortest list.** It is the only axis carrying font, RTL, chart and QA cost,
and the only one where a bad result is visible to a client.

## What still needs testing

Everything in the HIGH and MEDIUM report-output set is already measured. The gaps sit in **source** and
**conversation**, where they matter less but are worth confirming:

**Test:** Russian · Turkish · Polish · Ukrainian · Traditional Chinese — five, and Russian is the only one on the
critical path.

## One compliance note

**Sanctions restrict who we sell to, not what we read.** Analysing Russian-language material and serving
Russian-speaking users in the Gulf, Kazakhstan or the Baltics is a different matter from selling into Russia.
Before marketing to any Russian-speaking segment, that distinction needs a proper export-control and
sanctions-screening review — **the customer's jurisdiction is the test, not the language they read.**
