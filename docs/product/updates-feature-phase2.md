# Updates & Re-analysis — Phase 2 (deferred)

*Status: **DEFERRED to Phase 2.** Marked "Coming soon" in the product UI (alongside Intelligence depth).*
*Decision owner: Joy · Recorded: 2026-07-31*
*Design reference: Figma `Working · Updates — Desktop v3` (`1099:2`) — the built desktop screen, kept as the Phase 2 target.*

---

## What the feature is

**Updates** = new intelligence Caspr has found since a report was generated. It surfaces new sources/findings relevant to an existing report, shows the **impact** of each (High / Med / Low via a 3-segment intensity bar), and — when the user chooses — lets them **re-analyse** to bring the report current.

It does two jobs at once: it adds ongoing value to a delivered report (the Learning Brain made visible), and it nudges paid **re-analysis** (a monetization loop).

---

## Why it's deferred to Phase 2

The naive implementation is expensive: detecting "what changed" by **re-running the analysis** per report, on demand, burns full analysis compute every time — it does not scale to many reports × many users.

The cost-effective architecture (Joy, 2026-07-31) is **batch, not on-demand**:

1. A **daily batch job indexes newly ingested sources** (the Learning Brain's normal intake).
2. It **tags/matches new sources to previously generated reports** — by topic, entities, geographies, and the report's section structure.
3. It **pipes the relevant updates to affected users** as the Updates feed — each tagged with which report section it touches and an impact rating.

This amortizes one indexing pass across all reports and users, instead of paying for N re-analyses. **Discovery of updates is batch-driven and cheap; the expensive re-analysis only runs if the user pays for it.** Building this pipeline is Phase 2 work — hence the deferral and the "Coming soon" marking now.

---

## What to KEEP when we build it

**Show the user exactly what gets impacted in the report** (Joy liked this). Each update is tagged to the report section(s) it affects; clicking **"affects §X"** scrolls/highlights that section in the centre report. This is high-value and low-cost — it's a tag produced by the batch matcher, not a re-computation. It also walks the user toward the Re-analyse CTA.

---

## Re-analysis (the paid re-run) — parked, pricing already locked

Re-analysis re-runs the analysis on today's data and produces a **new version** of the same report (v1 → v2) on the Versions stack — **not** a new report. Rationale and pricing are locked and waiting:

- **Verb:** "re-analyse" ("the world has changed"). Deliberately distinct from "regenerate" (= re-render a stale *output* format).
- **New version, not new report:** the v-to-v diff is the payoff; keeps the library to one canonical report per question; makes the Learning Brain tangible.
- **Seeds a pre-filled prompt** (the new signals as context) the user can steer before committing — not a silent one-click run.
- **Pricing:** 50% of the fresh depth price standard (Study $80 → $40); academic 20% off only, low margins (academic Study $40 → $32). Recorded in `.agents/pricing-model.md` §4.5 (flagged Phase 2).

Re-analysis is the monetization layer on top of the free, batch-driven feed.

---

## Source access & the moat (provenance, not full-source-in-centre)

When we build the update/citation click behaviour, the rule (reasoned 2026-07-31):

- **The moat is curation + synthesis, not the raw documents.** Individual sources are largely public; defensibility is *which* 25M+ sources we curated + the Thinking Brain's triangulation + the Learning Brain's delta detection. A single source viewed once gives none of that away — but a systematic, harvestable map of *which sources back which claims* edges toward exposing the corpus.
- **Cite generously per-claim; never expose a bulk, browsable source graph.**
- **Don't render the full external source in the centre.** The centre is the product (the report); filling it with a third-party article reframes Caspr as an aggregator and collapses "we did the analysis" into "here's a link." It also creates copyright/hosting/liability exposure.
- **Do show a provenance/evidence view in the pane** (same surface as the red-dot citations): publisher · date · credibility · the exact excerpt/figure cited · Caspr's triangulation and why it moves the report. This satisfies "shows its work, cited to source" without reproducing the work.
- **Link-out, don't embed:** a discreet "open source ↗" opens the raw article in a new browser tab (per-click, off our surface) — serves the power user without hosting anything.
- **Exception:** a user's **own uploaded documents** can open in the centre — their data, no moat, no copyright.

---

## UI state now

- **Updates** — the 5th report-view selector tab exists (built) but is marked **"Coming soon"**; the `1099:2` desktop frame is the Phase 2 design reference.
- **Intelligence** — the depth is marked **"Coming soon"** (Phase 2). Pricing already specced ($300 in-budget / $399 à la carte) for when it ships.

---

*When we return: build the daily batch indexer + report-tagging pipeline first (the cheap discovery layer), keep the section-impact view, then turn on the paid re-analysis loop at the locked pricing.*
