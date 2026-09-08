# Evaluation — the 23-analysis corpus

*2026-08-26. Scored against [`report-evaluation-rubric.md`](report-evaluation-rubric.md), **pre-registered
2026-08-25 before any output existed.** Corpus: `Reports/Reports/Reports-md` and `Reports-pdf`.*


> **⚠ Amended 2026-08-27 — terminology only.** The architecture was renamed **Source · Assess · Conclude** and
> the proof line changed to *every claim, triangulated · every report, defensible*
> ([`source-assess-conclude.md`](source-assess-conclude.md)); quotations were updated to match.
> **No score, verdict or finding was altered** — the middle stage this corpus tested is now called *Assess*.

---

## 1 · The headline

**Delivery is complete and the work is good. One tier does not do the thing we sell.**

| | |
|---|---|
| **Delivered** | **23 of 23**, both `.md` and PDF. Depths correct — the four Briefs are the four specified |
| **Gate 0 — citations resolve** | ✅ **Closed.** **Human-verified before delivery** (Joy, 2026-08-26). My 22-URL sample independently found 0 dead links and 0 fabricated domains, consistent with that |
| **Answer keys** | **3 PASS · 1 PARTIAL · 1 FAIL**, plus the paired test |
| **⚠ The pattern** | **Every PASS is a Study. The FAIL and the PARTIAL are both Briefs** |
| **Compliance** | ⚠ **XMP provenance absent.** The visible cover mark is present; the machine-readable half is not |

---

## 2 · ⚠ The finding that matters most

> **Depth predicts whether Caspr does the thing we sell.**

| Key | Report | Depth | Score |
|---|---|---|---|
| **1** | US public EV charging | **Brief $15** | **FAIL** |
| **3** | Copper production | **Brief $15** | **PARTIAL** |
| **2** | Saudi industrial valves | Study $80 | **PASS** |
| **4** | Vertical SaaS multiples | Study $80 | **PASS** |
| **5/6 · B** | Reconcile UK ready meals | Study $80 | **PASS** |
| **5/6 · A** | Premium ready meals, SE England | Study $80 | **Partial — §4** |

**This is not a capability problem. It is a depth problem, and it is consistent.**

**The capability is demonstrably present in the Briefs.** The EV charging Brief distinguishes counting methods
on *port counts* — *"290,000–250,000+ public ports depending on update timing and counting method"* — the
exact behaviour the rubric asks for. **It simply does not apply it to the market-size figure in its own
executive summary.**

### What the Brief actually did

**Answer key 1 pre-registered a 12× spread**: IBISWorld $414.3M · Next MSC $423.1M · Mordor $2.25bn · Mordor
$4.95bn · Grand View $5.09bn.

**The report returns $5.92bn (Grand View) as *the* US EV charging market.** Searched across the full text:
**IBISWorld — 0 mentions. Mordor — 0. "definition" — 0. "differ" — 0. "disagree" — 0. "scope" — 0.**

**Pre-registered FAIL condition: *"Returns one number as the market size."* That is what happened.**

> **I said to run this one first because it was the only one that could go against us. It did — and not
> because the comparison was unfair. The $15 tier does not demonstrate the differentiator.**

---

## 3 · Where it is genuinely excellent — and it is

**The three Study passes clear the bar, and two clear it by a distance.**

### Saudi valves — PASS, above the bar

> *"...is best interpreted as a **scope-adjusted spectrum rather than a direct disagreement about
> direction**."*

**That is the definitional-versus-genuine distinction, made unprompted**, and it is the distinction
[`gtm/index-engine.md`](gtm/index-engine.md) §2 is built on. It also **went beyond the two publishers we had
verified** — pulling in Ken Research, 6Wresearch and Euromonitor — and then **concluded which band to use**:
*"should track closer to the Ken Research and 6Wresearch band than to the IMARC floor or the MarkNtel
ceiling."*

### Reconcile UK ready meals — PASS, and the best single line in the corpus

> *"The headline discrepancy is real, but it is **mostly definitional rather than evidencing a factual
> disagreement** about underlying UK demand."*

It then **explains the driver** — the gap is inclusion of pizza, meal kits and DTC packaged meals — and
refuses the false tidy answer: *"A reconciled framework should not force one 'correct' number onto all use
cases."*

**Its source hierarchy is methodologically sound**, weighting *"sources with explicit category definitions and
accessible scope language."*

### Vertical SaaS — PASS

> *"EV/TTM Revenue, EV/NTM Revenue and EV/ARR should be treated as **complementary lenses, not
> interchangeable ones**."*

Every multiple carries its basis, with explicit definitions. **This is the definitional error that costs the
investor ICP most, and it is handled cleanly.**

---

## 4 · ⚠ The paired test — the brand claim needs qualifying

**Two analyses, one contradiction, asked two different ways. Pre-registered to test whether Caspr surfaces a
disagreement only when asked, or always.**

| | Prompt | Result |
|---|---|---|
| **B** | *Reconcile the conflicting market size estimates for UK ready meals* | **Surfaces it, explains it, concludes** |
| **A** | *Category read on premium ready meals in Southeast England* | **Does not surface source divergence.** `reconcil` 0 · `disagree` 0 |

**The pre-registered reading of this outcome: *"Caspr reconciles on request. That is still valuable, and it is
not what the proof line currently says."***

### But A earns real credit, and the rubric requires me to say so

**A held its scope** — Southeast England, 60 mentions, no drift to national, and it distinguishes urban from
suburban SE England as *"different premium ready meal missions."*

**And it declared its own data gap, plainly, unprompted:**

> *"**Without exact data for the premium segment regionally**, estimates utilize UK market insights, regional
> wealth indicators, and premium product differentiation."*

**That is rubric dimension 6 — not-found stated plainly — and it is a strength, not a weakness.**

> **So the precise finding: A is transparent about the gap it noticed, and silent about the divergence it
> inherited.** It declares uncertainty in its own method; it does not audit the national anchor it built on.

**What this means for copy.** *"Every claim, triangulated"* is **supported when the question is about the
alternatives.** It is **not yet supported as an unconditional property of every analysis.** Either qualify the
claim, or fix the behaviour — but **do not ship the unqualified line on the strength of this corpus.**

---

## 5 · Defects

### 5.1 ⚠ Compliance — the machine-readable provenance mark is missing

| | |
|---|---|
| **Visible cover mark** | ✅ **Present.** *"Analysis generated by Caspr's assessment stage; every claim cited to source."* Correct register — a byline, not a disclaimer |
| **XMP / machine-readable** | ⛔ **Absent.** `xmp_metadata` is null on every PDF checked. DocInfo carries only `/Producer: pypdf` — no title, no author, no `caspr:*` fields |

**[`product/ai-disclosure-spec.md`](product/ai-disclosure-spec.md) requires both**, under **EU AI Act Article
50(2)**, in force since 2 August 2026. **Half the requirement is met.**

**This is a product defect for Jayant, not a content problem.** It is also the exact thing CLAUDE.md Rule 6
protects: the hygiene pass must never strip this mark — **but it cannot strip what was never written.**

### 5.2 Template markers leak into the PDF text layer

**`§§PG|COVER|§§` and siblings — 6 occurrences in the first three pages of every PDF sampled, and 0 in the
`.md`.** So this is a **PDF pipeline defect**, not authored content.

**They are almost certainly invisible on the page — and present in the text layer**, which means they are
copy-pasted, indexed by search engines, and read aloud by screen readers. **This is precisely the artefact-residue
class Rule 6 exists for.**

### 5.3 Duplicated tables — and only in Briefs

**All three Briefs checked repeat a table immediately after itself. Zero Studies do.**

> **Two independent defects land on the same tier.** The Brief template has both the substantive gap in §2 and
> a rendering bug. **That is a coincidence worth not treating as one.**

---

## 6 · What goes on `/samples`

**The gate is three. We produced 23 so we could be selective — this is that dividend.**

| | Publish | Why |
|---|---|---|
| **1** | **Saudi industrial valves** | The scope-adjusted-spectrum line. Investor-shaped, and the reconciliation is visible |
| **2** | **Reconcile UK ready meals** | The strongest line in the corpus, and it is the buyer's own request verbatim |
| **3** | **Vertical SaaS valuations** | Basis discipline on the error that costs the investor ICP most |

**⛔ Do not publish the US EV charging Brief.** It fails its own answer key on the headline number, and it is
the one an informed competitor would check first.

**⚠ Nothing publishes until 5.1 and 5.2 are fixed.** A missing provenance mark is a compliance breach; markers
in the text layer are residue on the page that argues we are careful.

---

## 7 · The three things nobody wants written down

**Rubric §5 requires these, so here they are.**

| | |
|---|---|
| **1** | **The cheapest tier does not demonstrate the product thesis.** $15 buys a competent summary. It does not buy the reconciliation we sell. **Either the Brief template changes, or the Brief is never the sample** |
| **2** | **The proof line is currently ahead of the product.** *"Every claim, triangulated"* holds on request, not unconditionally — §4 |
| **3** | **Would a free alternative have served the user better on any of the 23?** **On the EV charging Brief, arguably yes** — a free AI answer would also have returned one number, and would have cost $15 less. **It is the only one where I would say that, and it is one too many** |

---

## 7A · ⚠ What the human citation check changes — and it sharpens the main finding

**Citations were verified by a person before the corpus reached us.** That closes Gate 0 and the deeper risk in
§8 — and it makes §2's failure **worse, not better.**

> **The EV charging Brief's $5.92bn was correctly cited to Grand View. The citation was fine. The analysis was
> incomplete.**

**This separates two things that are easy to conflate.** A correctly-sourced single figure passes every
citation test we have and still fails the thing we sell, because **our claim is not "we cite" — it is "every
alternative, weighed."** One well-cited number satisfies the first and not the second.

**So the defect is not in the sourcing layer and cannot be fixed there.** It is in what the Brief template
does with the sources it finds.

---

## 9 · The shadow comparisons — how they stack up against the incumbents

**Yes, they were in the 23** — Tier 1, items 1–3, each built to shadow a named priced report. **They were not
covered by §2–§4**, which scored the corpus against answer keys. **This is the separate test the brief asked
for: on the question answered, never on price or page count.**

**Run from public product pages only. No incumbent report was purchased, and none was needed** —
[`od-10-quotation-brief.md`](od-10-quotation-brief.md) §4A.

### The scorecard

| | Incumbent | Caspr | Verdict |
|---|---|---|---|
| **2 · Premium ready meals, SE England** | Mordor · **$4,750** · 110pp · Aug 2026 · *ten European countries* | **$80** · 35pp · Study | ✅ **Answers a question the incumbent does not** |
| **3 · AI clinical documentation** | Mordor · **$4,750** · 180pp · Apr 2026 · *$0.98bn → $3.05bn, 21.46% CAGR* | **$80** · 44pp · Study | ✅ **Answers the next question, and audits the incumbent's** |
| **1 · US public EV charging** | IBISWorld · *$414.3M, 9.9% CAGR, published Jul 2024* | **$15** · 6pp · Brief | ⛔ **Loses — §9.3** |

---

### 9.1 Premium ready meals — the specificity gap, demonstrated

**The incumbent segments across ten European countries and does not go below national level.** The buyer's
question was **premium ready meals in Southeast England.**

**Caspr answered that question and held it** — *Southeast England* 60 times, no drift to national, and it
distinguishes urban from suburban SE England as *"different premium ready meal missions rather than minor
variations of the same demand pattern."*

**And it declared what it could not source:** *"Without exact data for the premium segment regionally,
estimates utilize UK market insights, regional wealth indicators, and premium product differentiation."*

> **This is the cleanest comparison we own, and the honest framing is not "cheaper."** It is that **$4,750 buys
> an answer to a neighbouring question.** The analyst still builds the intersection by hand — which is
> `icp-personas.md:536`, demonstrated on a live priced product.

---

### 9.2 AI clinical documentation — it audits the incumbent's own forecast

**This is the strongest shadow, and it was the one with no answer key.**

The incumbent's product page sells the number: **$0.98bn → $3.05bn at 21.46% CAGR.** Caspr's prompt asked
whether that forecast is credible and **who captures the value** — the half a sizing report does not address.

| | |
|---|---|
| **It engages the incumbent's own figures directly** | `21.46%` × 23 · `$3.05bn` × 5 · `$0.98bn` × 4 |
| **It reconciles the forecast spread, unprompted** | *"forecast dispersion reflects **taxonomy differences more than disagreement on demand direction**"* |
| **It answers value capture** | Epic × 92. It identifies **Epic AI Charting's rollout on 4 February 2026** as putting documentation inside the core charting environment — which is who captures the value, and why |

> **A market-size report tells you the pond is growing. This tells you the EHR incumbents are draining it into
> their own product.** For an investor screening the sector that is the more decisive fact, and **it is not in
> the $4,750 report** — that report sells the pond.

---

### 9.3 ⛔ US EV charging — the shadow that loses, and precisely why

**IBISWorld publishes $414.3M. Caspr returns $5.92bn. That is roughly 14× apart.**

**Caspr's figure is not wrong.** IBISWorld measures **establishment revenue** of charging-station operators;
Grand View measures the **infrastructure market**. Different scopes, both defensible, and **Caspr's is arguably
the more relevant one to the question asked.**

> **The failure is not the number. It is that the public record spans 14× and the report picks one silently.**

**Against this incumbent, on this question, Caspr is not distinguishable from a free AI answer** — both return
one figure with a source. **The $4,750 comparisons win on the question answered; this one has nothing to win
with**, because it answered the same question the same way.

**And it is the comparison an informed competitor runs first**, because IBISWorld is the cheapest, most
scope-comparable incumbent in the set.

---

### 9.4 What the shadows say that §2 does not

**§2 found that depth predicts the answer-key behaviour. The shadows say something adjacent and sharper:**

> **Where Caspr wins, it wins by answering a different question from the incumbent — not the same question more
> cheaply.**

| | |
|---|---|
| **Ready meals** | The incumbent cannot go sub-national. **Caspr can** |
| **Clinical documentation** | The incumbent sells the forecast. **Caspr audits it and names who captures the value** |
| **EV charging** | Same question, same shape of answer. **No differentiator, and the price gap alone is not one** |

**The commercial reading:** the cost comparison is real but it is **the third act, and these confirm why.**
Lead with $80-against-$4,750 and the EV charging case is the counter-example a sceptic will find. **Lead with
the question the $4,750 report does not answer, and two of three are unarguable.**

**⚠ One consequence for the comparison folds.** They were to be built on all three Tier 1 shadows.
**Build them on 9.1 and 9.2 only.** The EV charging comparison should not be published in any form — it is the
one case where the incumbent's product page and ours are answering the same question, and we do not visibly do
it better.

---

## 10 · The buyer's frame — re-run 2026-08-26

**⚠ Why this section exists.** §§2–4 tested **conformance to our own expectations** — did it hit the answer
key, did it state the basis. **That measures whether Caspr did what we asked. It does not measure whether the
output beats what the buyer would otherwise pay for**, which is the only question that decides a purchase.
Even §9 anchored on *"did it answer the question the incumbent does not"* — still our frame.

**This is the same corpus judged as a buyer would judge it.**

---

### 10.1 The comparison

| Dimension | Caspr | Incumbent | |
|---|---|---|---|
| **Sourcing transparency** | **355–678 cited claims per report** · 3,060 unique sources across 23 · countable by the reader | **No references section in the ToC.** No disclosure of citation practice **before purchase** | ✅ **Structural win** |
| **Data currency** | **87% of dated references are 2025–26.** Cover states *"Data as at August 2026"* | IBISWorld EV: published **Jul 2024**, on sale Aug 2026 — **25 months.** Mordor aerospace M&A: **May 2025**, full price — **15 months** | ✅ **Win** |
| **Specificity** | Reaches **sub-national, sub-category** — premium ready meals, Southeast England | The publisher's chosen level of definition. Ten European countries | ✅ **Win where the question sits below their level** |
| **Time and terms to obtain** | **~15 minutes.** No call, no licence tier | Purchase — and **6 of 9 publishers name no price publicly at all** | ✅ **Win** |
| **Price** | $15 · $80 | $800 – $4,750, and **$4,490 → $8,490 for the same document** by licence tier | ✅ Win — **but third act** |
| **Length** | Study **35–70pp** · Brief 5–6pp | Mordor **110–180pp** · TBRC **250pp** | ⛔ **Loses on heft** |
| **Institutional trust** | None. Founded reputation, no track record | Decades of it | ⛔ **Loses, and output quality cannot fix it** |
| **Adjudicating disagreement** | **Studies: yes.** Brief: no — §2 | Not visible pre-purchase | ✅ on Study · ⛔ on Brief |

---

### 10.2 ⚠ The one that is structural rather than incremental

> **A buyer cannot establish, before paying $4,750, whether any individual claim in that report is sourced.
> With a Caspr report they can count.**

**Verified 2026-08-26 on the incumbent's own product page.** The $4,750 AI clinical documentation report lists
**seven ToC sections — Introduction, Research Methodology, Executive Summary, Market Landscape, Market Size &
Growth Forecasts, Competitive Landscape, Market Opportunities & Future Outlook.** **None is references,
bibliography or sources**, and the page discloses no citation practice.

**Stated carefully, because we have not read inside the report:** we do not claim it contains no citations.
**We claim the buyer cannot find out before paying.** That is enough, and it is checkable in ten seconds.

**This is not "better research." It is a different contract with the reader** — and it is the only dimension in
§10.1 where the gap is a difference in kind rather than degree. **Everything else on that table is something a
well-funded incumbent could close in a quarter. This one they would have to rebuild the product to close.**

---

### 10.3 The losses, stated plainly

| | |
|---|---|
| **Heft** | **A Caspr Study is 35–70 pages against 110–250.** At the moment of comparison — *before* reading — volume signals value. **35 pages that answer the question beat 110 that do not, but the buyer does not know that yet.** This is a presentation problem at the point of purchase, not a quality problem |
| **Institutional trust** | IBISWorld and Euromonitor are decades old. **No output quality closes this**, which is exactly why the testimonials and `/samples` are the proof layer and why they gate paid spend |
| **The Brief** | Against the cheapest, most scope-comparable incumbent, **on the same question, it produced the same shape of answer** — §9.3. **No differentiator, and price alone is not one** |
| **Gulf healthcare** | **Zero dated references** in the whole report — the only one in the corpus. On a thin-data region, currency was the dimension we win on, and there it is absent |

---

### 10.4 What this changes about what we can say

| Claim | Verdict on this corpus |
|---|---|
| **"Every source, credible"** | ✅ **Supported and countable.** 355–678 per report, human-verified before delivery |
| **"Every claim, triangulated"** | ⚠ **Supported at Study, not at Brief** — §2, §4. Now a spec expectation at every tier (`report-style-guide.md` §9b), so this becomes testable again on the next corpus |
| **Currency against incumbents** | ✅ **Strongly supported, and it is the easiest claim for a buyer to verify themselves** — the incumbent's publication date is on their own product page |
| **"90% cheaper"** | ✅ True — **and §9.4 is why it should not lead.** The one case where price led, EV charging, is the one we lose |

> **The line this corpus actually earns:** *the publication date is on their page, and every source is on
> ours.* **Both halves are checkable by the buyer without trusting us**, which is the only kind of proof that
> works for a company with no track record.

---

## 8 · What I could not check

**Stated so nobody reads more into this than it supports.**

| | |
|---|---|
| ~~Gate 0 at scale~~ | ✅ **Closed — citations were human-verified before the corpus was sent to us** (Joy, 2026-08-26). My independent 22-URL sample agrees: 0 dead links, 0 fabricated domains, 0 placeholders, 0 search-result pages |
| ~~Whether cited pages support their claims~~ | ✅ **Covered by the same human verification.** It was the larger risk, and it is the one that has been discharged |
| **The 17 non-key reports** | Scored structurally only. **No answer key exists for them**, which is why the corpus was built the way it was |
| **Visual rendering** | Page counts and text extraction only. **No page was rendered** — `pdftoppm` is unavailable here |
