# Evaluation rubric — pre-registered

*Written 2026-08-25, **before any analysis in the corpus has been produced.***

> **⚠ Amended 2026-08-27 — terminology only, criteria untouched.** The proof line changed to
> **"every claim, triangulated · every report, defensible"**
> ([`source-assess-conclude.md`](source-assess-conclude.md)), and quotations of it here were updated to match.
> **No answer key, threshold, gate or scale was altered.** Recorded because §1 forbids quiet rewriting of this
> file, and a terminology sweep is still an edit.
*Grades the outputs from [`report-corpus-brief.md`](report-corpus-brief.md) · tracker: [`report-corpus-tracker.xlsx`](report-corpus-tracker.xlsx)*

---

## 1 · Why this exists before the outputs do

**A rubric written after seeing results gets bent to fit them.** Not dishonestly — it happens by reading a good
output and thinking *"yes, that's what good looks like."* The criteria drift toward whatever arrived.

**So the criteria are fixed now, and the answer keys are written down now, while nothing is known about how
Caspr will handle them.** Whatever the outputs show, they are scored against this file.

> **This is pre-registration, and it is the same discipline the product is sold on.** A company whose position
> is *"every claim, triangulated"* cannot evaluate itself by choosing the standard after seeing the result.

**If this rubric turns out to be wrong** — a criterion that measures the wrong thing — **it gets amended in
writing, with the reason, and the amendment is dated.** It does not get quietly rewritten.

---

## 2 · Gate 0 — the binary one

### Every citation resolves.

**Not a graded dimension. A gate.** Checked on every analysis before anything else is looked at.

| | |
|---|---|
| **Fails if** | Any link 404s, any source is unreachable, any figure appears without an attributable source, any citation points at something that does not contain the claim |
| **Consequence** | **That analysis does not go on `/samples`, regardless of how good it is** |
| **If it fails at any material rate across the corpus** | **Stop.** This is a product defect, not a content problem, and it must reach Jayant before anything publishes |

**Why it is a gate and not a score.** `/samples` exists to answer the credibility objection. **A dead link on
the page that answers the credibility objection does more damage than having no page at all** — and it is the
first thing a competitor reading closely will check.

---

## 3 · The six pre-registered answer keys

**Six subjects where the published sources have already been read. The honest answer is known. These are
scored, not assessed.**

**Uniform scale:**

| | |
|---|---|
| **PASS** | Surfaces the conflict **and** explains what drives it |
| **PARTIAL** | Surfaces the conflict without explaining it. **Still better than every free AI answer** — and short of what we claim |
| **FAIL** | Returns one figure as the answer |

---

### Key 1 · US public EV charging — *Brief, $15*

| Source | 2025 | Counting |
|---|---|---|
| IBISWorld | **$414.3M** | Establishment revenue |
| Next MSC | $423.1M | "EV charging market" |
| Mordor — *Equipment* | **$2.25bn** · 9.88% | Equipment |
| Mordor — *Systems **and** Equipment* | **$4.95bn** · 27.65% | Systems + equipment |
| Grand View | $5.09bn *(2024)* · 30.3% | Infrastructure |

**PASS requires:** the spread named, what each figure counts, and **which one answers the user's question.**
**Bonus, not required:** noticing that **one publisher gives $2.25bn and $4.95bn for the same country and year**,
separated by two words in a product title.

> **12× spread. $15. This is the cheapest and most instrumented test in the corpus.**

---

### Key 2 · Saudi industrial valves — *Study, $80*

**IMARC $725.0M against MarkNtel $990M — 36% apart, same market, neither page acknowledging the other.**

**PASS requires:** both figures, both publishers named, and a statement of what differs — scope, base year or
definition. **FAIL is picking one**, which is what every free AI answer does.

---

### Key 3 · Copper production by country — *Brief, $15*

**⚠ This is a definitional trap, and calling it a disagreement is a FAIL.**

Mine production (Chile largest) against refined production (China ~48%) **measure different things.**

| | |
|---|---|
| **PASS** | States that the two most-cited answers measure different things, and answers for the one the user meant |
| **PARTIAL** | Gives one basis and labels it correctly, without noting the other |
| **FAIL** | **"Sources disagree"** — or gives one figure with no basis stated |

**This is the single most diagnostic item in the corpus.** Conflating a definitional difference with a
disagreement is *precisely* the sloppiness Caspr sells against. **Getting it wrong here would mean the product
does the thing our own marketing attacks.**

---

### Key 4 · Vertical SaaS revenue multiples — *Study, $80*

**8.5× NTM against 3.3× TTM — a 2.5× swing that is entirely forward-versus-trailing.**

**PASS requires:** every multiple carrying its basis. An investor who puts the wrong one in an IC memo has a
real problem, and this is the definitional error that costs the investor ICP most.

---

### Keys 5 and 6 · ⚠ The paired test — this is the sharpest thing in the rubric

**Two analyses, one underlying contradiction, asked two different ways.**

| | Corpus # | Prompt | Depth |
|---|---|---|---|
| **A** | **2** | *Category read on premium ready meals in Southeast England — size, growth and who's winning. Sourced.* | Study |
| **B** | **16** | *Reconcile the conflicting market size estimates for UK ready meals.* | Study |

**The known contradiction: $5.86bn at 4.95% CAGR against $6.46bn at 12.4% CAGR** — same market, same base
year.

**B asks for the reconciliation explicitly. A does not.**

> **The question this pair answers: does Caspr surface a disagreement only when asked, or always?**

| Outcome | What it means |
|---|---|
| **Both surface it** | **The strongest possible result.** The behaviour is a property of the analysis, not of the prompt. *"Every claim, triangulated"* is literally true and we can say so |
| **Only B surfaces it** | **The claim needs qualifying.** Caspr reconciles on request. That is still valuable and it is **not** what the proof line currently says |
| **Neither** | The central claim is not supported by the product, and **the marketing has to change before the product does** |

**No other pair in the corpus tests a brand claim this directly.** Run both, and run them independently.

**A carries a second test:** the sub-national, sub-category intersection. **The honest answer may be
*not-found* — and that is a PASS**, provided it says so plainly rather than substituting the UK figure without
flagging the substitution.

---

## 4 · Graded dimensions — everything else

**Applied to all 23. Three levels: strong · adequate · weak.** Deliberately coarse — finer grading on 23
samples would be false precision.

| | Dimension | What "strong" looks like |
|---|---|---|
| **1** | **Reaches a conclusion** | Answers the question asked. *"Speaks in conclusions, not caveats"* is a brand claim; description dressed as analysis is the failure |
| **2** | **Weighs the alternative** | The rejected option appears, with why. Absent this, a third of the proof line is unsupported |
| **3** | **Freshness handled** | Figures older than 18 months are flagged rather than repeated. Test cases: #7 quick-commerce, #20 battery storage |
| **4** | **Source discrimination** | Independent analysis distinguished from supplier-funded content. Test cases: #11 cybersecurity, #18 AI coding assistants |
| **5** | **The Signal never borrows cited authority** | Aggregate sentiment visibly a different class of evidence — [`report-guidance/report-style-guide.md`](report-guidance/report-style-guide.md):533 |
| **6** | **Not-found stated plainly** | *"No credible published source gives this number."* **This is a strength, and scoring it as a weakness would be the single easiest way to corrupt this evaluation.** Test cases: #22 Gulf healthcare, #2 sub-national |
| **7** | **Register** | Reads as an analyst, not an assistant. No hedging, no padding, no exclamation points |

### PDF-only dimensions

| | |
|---|---|
| **8** | **Renders as a board document.** Would a person put it in front of a board without reformatting it |
| **9** | **⚠ The AI-provenance mark is present and intact** — cover foot and XMP/OOXML, per [`product/ai-disclosure-spec.md`](product/ai-disclosure-spec.md). **EU AI Act Article 50(2). A missing mark is a compliance defect, not a design note** |

---

## 5 · The standard for claiming an advantage in public

**This is what the whole exercise is for, and it is where evaluations usually go soft.**

**An advantage may be claimed publicly only if all four hold:**

| | |
|---|---|
| **1** | **It is demonstrated in a specific, named output** — traceable to one analysis, not to an impression across several |
| **2** | **It survives the comparison being stated fairly.** Never against a straw alternative, never claiming scope equivalence a 250-page report does not have |
| **3** | **It repeats.** Visible in at least two analyses, or it is an anecdote |
| **4** | **The counter-case is known.** We can say where it does *not* hold. **An advantage with no known boundary has not been tested, only observed** |

### What gets written down even though nobody wants it

| | |
|---|---|
| **1** | **Every Gate 0 failure**, by analysis |
| **2** | **Every answer key missed** — and *how* it was missed, which matters more than the score |
| **3** | **Anything Caspr did worse than a free alternative would have.** If a free AI answer would have served the user better on any of these 23, **that is the most important sentence in the assessment** |

> **A proof layer assembled only from the runs that went well is not proof.** The first person to notice will
> be a competitor reading `/samples` closely, and they will be right.

---

## 6 · What I will produce

| | |
|---|---|
| **1** | **A scored table** — 23 rows, Gate 0, the six keys, the nine dimensions |
| **2** | **The honest assessment** — where Caspr is genuinely better, where it is equivalent, where it is not, each traced to a named output |
| **3** | **A shortlist for `/samples`** — which of the 23 are strong enough to publish, and which are not |
| **4** | **A defect list for Jayant**, separated from the marketing findings — Gate 0 failures and provenance-mark issues are product bugs, not content problems |

**Item 3 is the one that unblocks paid spend.** Three publishable analyses is the gate; **23 produced against a
gate of 3 means we can afford to be genuinely selective**, which is the point of producing more than we need.
