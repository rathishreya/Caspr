# `p` — pre-launch baseline

*Measured 2026-08-25. Method and basket: [`presence-metric.md`](presence-metric.md).*

---

## 1 · Why this was taken now

**A pre-launch baseline is perishable.** Once The Record publishes, the guerrilla campaign runs and the
rebuilt site goes live, **there is no way back to a clean "before."** Every later reading of `p` is measured
against something, and this is that something.

**It is also the only honest way to claim the channel worked.** A rise from an unrecorded start is an
assertion. A rise from a recorded zero is a measurement.

---

## 2 · ⚠ What was measured, and what was not

**This is a partial baseline and is labelled as one.**

| | Leg | Measured? |
|---|---|---|
| **Ranking** | Does Caspr appear in the results a search returns | ✅ **Yes** |
| **Citation** | Does Caspr appear in the third-party pages that answer the question | ✅ **Yes** |
| **AI presence** | Does Caspr appear in a ChatGPT / Perplexity / Gemini answer | ❌ **No** — those surfaces are not reachable from this session |

**Basket coverage: a subset of the CORE 15**, not the full per-ICP baskets. The questions run were the
highest-intent in the set — **C1, C6**, plus **C2 already on record** from the SEO pass.

> **The missing leg is the one that matters most and it must be run manually before Day 1.** Whoever owns the
> monthly reading — still an open decision — should run the full CORE 15 across all four surfaces and append
> to this file. **It is roughly an hour and it cannot be reconstructed afterwards.**

---

## 3 · The reading

### `p` = 0

**Caspr appears in nothing.** Not in a result, not in a roundup, not in an answer, on any question tested.

| | Question | Caspr present |
|---|---|---|
| **C1** | best AI tool for market research | **No** |
| **C2** | best AI deep research tool *(recorded earlier — `docs/seo/decision.md`)* | **No** |
| **C6** | alternatives to IBISWorld | **No** |

**This is the expected result and it is still worth recording.** A zero that was measured is a different
object from a zero that was assumed.

---

## 4 · The outreach target list — and it no longer waits on Ahrefs

**The domains that own these questions were the point of the ~15-domain Ahrefs qualification pull. Running the
questions produced the list directly.** Ahrefs would add traffic and authority figures; it was never going to
change *who* is there.

### C1 · "best AI tool for market research"

| Domain | Shape |
|---|---|
| **cybernews.com** | Editorial roundup. **⚠ Also ranked for the AI-deep-research family in the earlier pass — confirmed across two query families, so it is the priority target** |
| pollfish.com | Vendor blog roundup |
| gwi.com | Vendor blog roundup — **and GWI Spark is named first in the answer.** Their own content ranks for the category they compete in |
| sembly.ai | Vendor blog roundup |
| standard-insights.com | Vendor blog roundup |

### C6 · "alternatives to IBISWorld"

| Domain | Shape |
|---|---|
| **g2.com** · **sourceforge.net** · **slashdot.org** | Directory listings. **Inclusion is a form submission, not outreach** |
| **datarade.ai** | Data-provider directory. Directly relevant — IBISWorld is listed there |
| **cbinsights.com** | Competitor-intelligence page |
| **searchfunder.com** | ⚠ **A community forum thread, not a roundup** — a real acquirer asking real peers. **Investor-ICP adjacent.** Never automate a post here; a person posts, always |
| similarsitesearch.com | Low-value aggregator. Skip |

> **The split matters for who does the work.** Directories are a form and a login. Editorial roundups are
> outreach to a named editor. **A forum thread is neither, and it is the only one that could go wrong.**

---

## 5 · ⚠ The finding that was not the point of the exercise

**The tools named in the answer to *"best AI tool for market research"* are: GWI Spark, nexos.ai, Yabble,
DoReveal, Notably, Manus, Optimo, Glimpse.**

**Almost none of them do what Caspr does.**

| What they are | Examples |
|---|---|
| **Qualitative synthesis** — turning interview and open-end data into insight | Yabble, DoReveal, Notably |
| **Trend and signal detection** | Glimpse, Optimo |
| **Consumer-data platforms with an AI layer** | GWI Spark |
| **Workflow aggregation over multiple models** | nexos.ai |
| **Actually generates a market research report** | **Manus, and essentially only Manus** |

**Two readings, and they point in opposite directions:**

| | |
|---|---|
| **Opportunity** | **The category as currently answered contains no analyst-grade report generator.** The question is being answered by tools that solve a different problem, which means the position is genuinely open |
| **Problem** | **A buyer searching this phrase is shown survey and qual tools.** If that is the phrase our ICP uses, we are competing for a term whose answer set has already been shaped around something else — and reshaping an established answer set is far harder than entering an empty one |

**Which reading is right depends on a question we have not answered: is *"AI tool for market research"* even the
phrase our buyer uses?** The persona research says investors and consultants describe the job, not the tool
category — *"industry primer on commercial logistics in the Nordics"*, not *"AI market research tool."*

> **This strengthens the existing decision rather than changing it.** [`docs/seo/decision.md`](../seo/decision.md)
> already ranks **roundup and directory inclusion first** and **job-shaped content over category terms** —
> because CPC discriminates buyer from student far better than volume does. **This is the same conclusion
> arriving from a different direction, which is the most reassuring way for a conclusion to arrive.**

---

## 6 · What to do with this

| | |
|---|---|
| **1** | **Run the missing AI-surface leg before Day 1.** CORE 15 × ChatGPT, Perplexity, Gemini. An hour, unrecoverable afterwards |
| **2** | **The target list above is actionable now.** Directories are a form; editorial roundups are outreach; **searchfunder is a person, and never automated** |
| **3** | **The Ahrefs roundup-qualification pull is no longer blocking.** It would refine priority within a list we now have. Reduce it or drop it |
| **4** | **Do not re-baseline after publishing starts.** Append readings to this file; never overwrite it |
