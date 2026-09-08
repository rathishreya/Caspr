# The Content Engine

*2026-08-24. Built to [`content-engine-prompt.md`](content-engine-prompt.md) v2.*

**Companion:** [`content-engine-prompts.md`](content-engine-prompts.md) — the prompts themselves, separated because they iterate against the rejection ledger and should not churn this spec.

---

## 0 · Scope, narrowed by work already done

The brief asked for six things. **Two were completed after it was written** and are not repeated here:

| | Status |
|---|---|
| §5.5 The twelve-week calendar | ✅ [`content-calendar.md`](content-calendar.md) |
| §5.6 Volume against capacity | ✅ `content-calendar.md` §1.1 and §5.4 — 23 items, 62–77 min of 450 |

**So this session builds five things:** the demand intake, the generation assembly, the hygiene stage, the linter rule set, and the repurposing graph — plus the cold start, which was an open question.

### Type A has a name and a second format

**Type A is *The Record*** — the publication, not a series of unrelated posts ([`launch-plan.md`](launch-plan.md) §2). Issue 1 is **Caspr run on the market research industry itself**, landing week 3.

**And it carries a recurring second format the content model did not have: the staleness index** ([`guerrilla-campaign-plan.md`](guerrilla-campaign-plan.md) §4) — monthly, per sector, launching at the campaign peak. **It generates differently from a published analysis** and has its own prompt (`content-engine-prompts.md` §1A) and its own non-negotiable human step: **the currency check.**

### Sources opened

`docs/gtm/content-approach.md` · `channel-model.md` · `gtm-api-contract.md` · `content-calendar.md` · `operations-runbook.md` §1–6 · **`portal-build-spec.md` §3.1–3.10** · `portal-design-spec.md` §5 · `reengagement-sequence.md` §1–3 · `.agents/icp-personas.md` *(pain and objections, all eight, in full)* · **`.agents/icp-copy.md` v3** · `.agents/brand-guidelines.md` · `docs/site-truth.md` §7 · `caspr-dm-handover/02-linkedin-profiles/audit.md` §5 · **`content/caspr-help-content-repository.xlsx` — Answer Cards, Voice Cheat Sheet, README, opened directly** · `content/pass3-change-proposal.md`.

**Not opened:** `content/_refresh/delta_1..5` — superseded by `pass3-change-proposal.md`, which consolidates them and is dated later. `product-marketing-context.md` — its content reaches this work through `icp-copy` v3 and `site-truth`, both of which are more current.

---

## 1 · Three findings that change what gets built

### 1.1 ⛔ The Voice Cheat Sheet is a truth-layer hazard

**The workbook carries a `Voice Cheat Sheet` tab whose stated purpose is *"read before writing any Card"*, and it contains an `APPROVED LINES (reuse verbatim where they fit)` block.**

**Three of those lines are retired or demoted**, per `CLAUDE.md` and `brand-guidelines.md`:

| Line in the sheet | Actual status |
|---|---|
| *"Stop Googling. Start analyzing."* | **RETIRED** — names a competitor's product and tells the reader they are doing it wrong |
| *"Your competitors are still waiting for the research."* | **RETIRED** — speed-led and combative; the voice is calm authority |
| *"15 minutes. 100 pages. Cited to source."* · *"The $200,000 question. For $80."* | **DEMOTED** — supporting only, never a hero |
| *"While the world was building generative AI…"* | **Category education only** — never a hero, headline or ad |

**And its `KEY FACTS (never contradict)` block states `Zero hallucinations`** — which `website-session-prompt.md` instructs to delete from the homepage as a retired claim.

> **A sheet that says "reuse verbatim" and lists retired copy is worse than no sheet.** If the truth layer ingests it, the engine generates retired positioning at volume and the linter cannot catch it — because the linter's own rules would have been built from the same file.

**Action: the Voice Cheat Sheet is excluded from the truth layer** until it is reconciled. Voice comes from `brand-guidelines.md` and the tiered approved-copy list in `CLAUDE.md`. **This is a correction to `portal-build-spec` §3.1's source list by omission** — the workbook is not on it, and must not be added without this fix.

### 1.2 Every Pillar value in the workbook is against the retired numbering

The `Pillar` column is populated on all 114 cards. **It predates the 2026-08-20 reorder.**

`B-01 Analytical AI vs Generative AI` is tagged **pillar 4** — which under the current scheme is *A Fraction of the Cost*. `J-04 Research Budget` is tagged **pillar 3** — now *From Weeks to Minutes*.

**The mapping is recoverable, not lost:** the old order was `1 Weeks-to-Minutes · 2 Analyst-Grade · 3 Fraction-of-Cost · 4 Analytical AI`. Every value needs remapping before any card is used for anything, and **a remap is a one-line transform, not a re-tagging exercise.**

### 1.3 The card schema is the item schema — do not invent a second one

The `Answer Cards` sheet carries 28 columns. **Strip the help-desk-specific ones and what remains is exactly a generation brief:**

`Question (customer words)` · `Working Title` · `ICP` · `Buyer Stage` · `Pillar` · `Target Keyword` · **`Writing Brief (what to cover)`** · **`Proof Points / Sources to cite`** · `CTA` · `Word Count` · `Visual Type` · `Surfaces` · `Status` · `Owner` · `Destination`

**That is the structure the generator assembles from, and it already exists, populated, for 114 items.** `portal-build-spec` §4's data model should adopt it rather than parallel it.

**And 30 of the cards are marketing content already specced:** `B` ×10 (differentiators), `H` ×12 (use cases), `J` ×8 (glossary). **`H-09` to `H-12` — market sizing, competitive landscape, due diligence, pitch research — are type-B job-shaped search answers, already written as briefs with target keywords.** They are the first four search answers, not new work.

---

## 2 · The demand intake

**Four signals. Three run pre-launch; one does not.** Full design rationale in `content-approach.md` §5.

| | Signal | Source | Cadence | Pre-launch |
|---|---|---|---|---|
| **1** | **Prompt clusters** | `demand_signal` — `gtm-api-contract.md` §4 | Weekly | **No** |
| **2** | **Search demand** | Google Search Console once ranking; keyword volume/trend before | Weekly | Yes |
| **3** | **Community question flow** | Manually logged from the threads Social already reads | Weekly, in the Wednesday review | Yes |
| **4** | **Sector event flow** | M&A, funding, regulatory change, in the two launch ICPs' sectors | Weekly | Yes |

### 2.1 What it produces

**One ranked candidate list, with the evidence attached.** Never a topic; always a candidate plus its reason.

```
{ candidate, signal_source, volume, trend_vs_prior, icp_served,
  sourceable (fact_lookup probe: found | thin | not_found), rank }
```

**`sourceable` is the field that stops the obvious mistake.** A high-demand question Caspr cannot source well produces a weak analysis — so the pipeline probes `fact_lookup` before ranking, and a `not_found` demotes a candidate regardless of its volume.

### 2.2 Weighting, and how it shifts

**Launch:** signals 2, 3, 4 at roughly equal weight. **Once `demand_signal` returns clusters above the suppression threshold**, signal 1 takes primacy — it is the only one drawn from actual buyers rather than proxies.

**The shift is a config value, not a rebuild.** Per the standing rule: widening is configuration.

### 2.3 The honest cost

**Signals 2 and 4 need a person, weekly.** Search trend can be automated once GSC has data; before that it is a manual pull. Event flow is a scan, roughly 20 minutes.

**Signal 3 is free because Social is already in those threads** — it is a logging discipline, not new work. **Add it to the Wednesday review as a standing item, or it will not happen.**

### 2.4 Two owned datasets to mine before launch

**Joy's 60+ existing analyses** and **the segmentation export of the 1,600** (pending). Both say what was actually asked for, by whom. **Neither is in the pipeline design above because both are one-time** — they seed the initial candidate list, they do not recur.

---

## 3 · Generation — the assembly

**The prompts are in [`content-engine-prompts.md`](content-engine-prompts.md).** This is what gets assembled into them.

### 3.1 Context blocks, in assembly order

| | Block | Source | Applies to |
|---|---|---|---|
| **1** | **Canonical facts** | Truth layer §3.1 — `site-truth` §6, `pricing-model` | All |
| **2** | **Prohibitions** | The linter rule set, §4 below, restated as instructions | All |
| **3** | **Voice** | `brand-guidelines.md` + the tiered copy list in `CLAUDE.md`. **Not the Voice Cheat Sheet** — §1.1 | All |
| **4** | **Active failure modes** | Rejection ledger §3.5 — the live list, not the whole history | All |
| **5** | **The item brief** | The card schema, §1.3 | All |
| **6** | **Source material** | The parent item, or `retrieve_analysis` / `fact_lookup` | All |
| **7** | **ICP message set** | `icp-copy.md` v3 — Primary, Secondary, Proof, CTA, copy notes | ICP-targeted items |
| **8** | **Voice lane** | `audit.md` §5 | Personal posts only |
| **9** | **Channel constraints** | Length, format, link and hashtag limits | Channel items |

### 3.2 Model tiering

Per `portal-build-spec` §3.2, and it is a cost control not a preference:

| Tier | Work |
|---|---|
| **Frontier** | Published analysis framing · search answers · permission layer · founder posts · outreach first drafts · anything taking a position |
| **Haiku** | Every derivative — voiced variants, threads, glossary entries, metadata, subtitles, internal-link updates |

**~80% of volume is Haiku.** That is what keeps the bill at $40–100/month.

### 3.3 The hard gate, enforced at generation

> **Cited, or it does not ship.** Every item carries a finding traceable to a real Caspr analysis, or an attributed opinion from a named person. **An item with neither is not generated** — the generator refuses rather than producing something the linter then rejects.

---

## 4 · The linter rule set — machine-runnable

**Two classes, and the distinction matters for how each is implemented.**

### 4.1 Deterministic — string, regex or table lookup. No model call

| ID | Check | Implementation | On fail |
|---|---|---|---|
| `L01` | Banned vocabulary | Word-boundary match: `platform · leverage(s|d|ing) · algorithm(s) · workflow(s) · powerful AI · revolutionary · game-changing · excited to announce` | Regenerate |
| `L02` | Contrast-only terms | `chatbot · web scraping · hallucinate` — **permitted only within 200 chars of a negation** (`not`, `never`, `unlike`, `rather than`). Otherwise fail | Regenerate |
| `L03` | Prohibited claims | `LAM` · `Large Analysis Model` · `SOC 2 certified` · `zero hallucination(s)` | Regenerate |
| `L04` | Exclamation points | `!` anywhere outside a quoted source | Regenerate |
| `L05` | Retired copy | Exact-match against the retired list in `CLAUDE.md` — *"Stop Googling…"*, *"Your competitors are still waiting…"* | Regenerate |
| `L06` | Stale numbers | Every numeric token matched against the canonical facts table. `1M+`, `$50/mo`, `Plus`, `Pro` are known-stale | Regenerate |
| `L07` | Ghost boundary | Any occurrence of the firm's name, in body, alt text, filename or metadata | **Block, do not regenerate. Escalate** |
| `L08` | Channel constraints | Length, link count, hashtag count per channel | Regenerate |
| `L09` | Tier-name bareness | `Brief` · `Study` · `Intelligence` capitalised and unexplained on a first-touch surface | Regenerate |
| `L10` | Platform-fee mention | `7%` or `platform fee` | **Block. Internal only** |
| `L11` | Duplication | Cosine similarity > 0.85 against everything published in 90 days | Regenerate |

### 4.2 Semantic — needs a model call, and each has a false-positive cost

| ID | Check | Rule | Note |
|---|---|---|---|
| `L20` | **Reader labour** | Does any sentence assign the reader work to verify? *verify · check the working · see for yourself · audit it · confirm* | **Highest false-positive risk on the list.** *"Every source is here"* passes; *"check every source"* fails. Tune against the ledger, and log every catch for review in month one |
| `L21` | **Competitor in lead copy** | Named competitor or the LLM category in a headline, hero, first line, or any ad | Body copy on `/vs/*`, `/alternatives/*`, social and founder content is exempt |
| `L22` | **Citation resolves** | Every claim of fact carries a source **and the source resolves** | **Must fetch, not just check the field is non-empty.** A populated-but-dead citation is worse than none |
| `L23` | **Cost leads** | Does price appear in the headline or first sentence? | Permitted in movement 3 weeks only — a calendar-aware rule |
| `L24` | **Disclosure present** | Any item touching the research sector carries the standing note | `guerrilla-evaluation.md` §5.1 |

**`L22` is the one that earns its cost.** Everything else protects the voice; this one protects the standard the company is sold on.

### 4.3 Calibration

**Linter failures regenerate silently and never reach a human** (`portal-build-spec` §3.3). **But every `BANNED_TERM` rejection by a human is a linter defect** — the rule should have caught it. Track defects per rule; a rule with defects is incomplete, not the reviewer's problem.

---

## 4A · The hygiene stage — between approval and publish

**`CLAUDE.md` Rule 6 is a hard rule and the engine had no stage for it.** Nothing generated leaves for a
public surface until it has been through a text-hygiene pass. **The engine publishes to public surfaces.**

**Where it sits: after human approval, before the publisher.** Not before review — a reviewer should read
what was written, not a cleaned version of it — and not after publish, which is too late.

```
generate → linter → review queue → APPROVED → [ HYGIENE ] → publisher
```

### 4A.1 Which tool, and the dependency that decides it

| Tool | Does | Needs |
|---|---|---|
| **`anthropic-skills:clean-user-facing-text`** | Deterministic Unicode pass on prose — zero-width characters, homoglyphs, anomalous spaces | Self-contained Python. **No service. This is the default** |
| `anthropic-skills:remove-ai-marks` | The same, plus container and image metadata (C2PA, EXIF, XMP) | **An HTTP service at `WATERMARKS_SERVICE_URL`** |

> **`remove-ai-marks` is a thin client over a service that must be running, and it is not currently reachable.**
> The engine runs on AWS, not a laptop. **The service deploys alongside the portal or this stage silently
> degrades to the text-only path** — which is acceptable for prose and insufficient for published images.

**Flags, fixed:** `--no-normalize-spaces` by default. **Never `--aggressive-homoglyphs`, `--nfkc` or
`--strip-emoji-glue`** — they alter multilingual text and typography.

**Prose only.** Protect code, commands, paths, URLs, identifiers, exact values and citations. **Never run a
whole-file clean when a hit falls inside a protected span** — a mangled citation URL is a broken proof.

### 4A.2 ⛔ The boundary the engine must encode, because Type A sits on both sides of it

**The published analysis is a Caspr-generated PDF.** Per [`docs/product/ai-disclosure-spec.md`](../product/ai-disclosure-spec.md)
every Caspr PDF and PPTX must carry an AI-provenance mark — visible on the cover, machine-readable in XMP —
under EU AI Act Article 50(2), **and that mark must survive editing.**

**So one issue of The Record is two objects with opposite rules:**

| Object | Hygiene pass? |
|---|---|
| **The PDF deliverable** | **NEVER.** It is a product deliverable. Stripping its provenance mark is a compliance breach |
| The report **web page**, the standfirst, the atom, every derivative | **Yes.** These are published marketing prose |

**The publisher must branch on artefact type, not on item type.** An item whose payload includes a generated
PDF passes the PDF through untouched and cleans only the surrounding prose.

**Two things this stage never does:** claim or imply human authorship — the skills' own ethics note forbids it
and it would be self-defeating here — and strip a required disclosure, including the standing note on any
issue touching the research sector.

---

## 5 · The repurposing graph — corrected

### 5.1 The conflict

**`portal-build-spec` §3.7 fans a blog post out to seven LinkedIn variants — one per voice lane. That cannot run**, for two independent reasons:

1. **`audit.md` §5 states: *"Never two people on the same subject in the same week."*** Seven variants of one post is precisely that, seven times over
2. **The lanes are not interchangeable.** Jayant's lane is *"never marketing claims; never pricing"*; Kartikey's is *"never anything speaking for the company."* A generic post cannot be voiced into those lanes — it would violate them

**And the source is wrong.** §3.7 fans out from a *blog post*; `content-approach.md` §3D establishes that the 17–24 fan-out comes from a **published analysis**. A search answer fans out to 3–4.

### 5.2 The corrected graph

```
PUBLISHED ANALYSIS  (Type A · 1 per 3 weeks · frontier)
  ├── Report page + PDF                                    1    SEO+TL
  ├── LinkedIn — Joy            (analyst lane)             1    TL
  ├── LinkedIn — Jayant         (builder lane, own angle)  1    TL
  ├── LinkedIn — rotating team  (1–2, own lanes only)      1–2  Social
  ├── X posts                                              3    Social
  ├── The atom — one chart, source-stamped                 1    Social
  ├── Charts as social cards                               1–3  Social
  ├── Community contributions (only where on-topic)        2–4  Social
  ├── Email block                                          1    TL
  ├── Search-page updates using its figures                2–3  SEO
  └── Outreach hooks                                       2–3  TL
                                                    TOTAL  16–23

SEARCH ANSWER  (Type B · 2 per week · frontier)
  ├── 1 X post · 1 team LinkedIn (lane-matched)            2
  ├── Glossary/internal-link updates                       1–2
  └── Outreach hook where genuinely relevant               0–1
                                                    TOTAL  3–5

PERMISSION LAYER  (Type C · ~10 once)
  └── Linked from ICP pages, FAQ, activation email         0 recurring
```

**The `/market-size/*` pages are generated, not fanned out**, and are not review-queue items — the template is reviewed once.

### 5.3 Two rules the graph must enforce

- **Lane integrity.** A derivative is only generated for a person whose lane covers the subject. **If no lane fits, the derivative is not generated** — an empty slot beats a lane violation
- **One subject, one person, one week.** The graph checks the week's assignments before generating

**Correct `portal-build-spec` §3.7 and the CMS screen accordingly** — "one blog post becomes twenty" is true only of type A, and only as *"one published analysis."*

---

## 6 · Cold start — weeks 1 and 2

**The open question from the brief. Nothing in week one is generated from nothing.**

| Missing on day one | Substitute |
|---|---|
| Prompt clusters | Signals 2–4, plus the two owned datasets in §2.4 |
| A rejection ledger | **Joy's corrections during the outreach bootstrap.** An hour a day for two weeks, editing rather than composing — those corrections seed the active-failure-mode list |
| A published analysis to derive from | **Joy's 60+ existing analyses** and the three `/samples` reports. Real, cited, and live on day one |
| Case material | The ten testimonials |
| Search answers | **`H-09` to `H-12` in the workbook** — market sizing, competitive landscape, due diligence, pitch research. Already briefed with target keywords. **The first four search answers are pre-written work, not new work** |

**Week one's queue is therefore fully sourced before the engine generates a single original item.**

---

## 7 · Portal implications — the build is paused pending this, so these are explicit

| | Change to `portal-build-spec.md` |
|---|---|
| **1** | **§3.1 truth layer — do not add the workbook's Voice Cheat Sheet.** §1.1. If it is added later, it must be reconciled first |
| **2** | **§3.7 repurposing graph is wrong** — replace with §5.2. Source is a published analysis, not a blog post; seven-lane fan-out violates the lane rules |
| **3** | **§4 data model — adopt the card schema** rather than paralleling it. §1.3 |
| **4** | **§3.3 linter — replace the rule table** with §4.1 and §4.2, which separate deterministic from semantic and name the false-positive risks |
| **5** | **§3.2 generator — add `sourceable` probing** to topic selection, and the `demand_signal` intake |
| **6** | **CMS screen copy** — "one blog post becomes twenty items" → "one published analysis" |
| **7** | **§3.6 publisher — add the hygiene stage** (§4A) between approval and publish, **branching on artefact type**: generated PDFs pass through untouched, prose is cleaned. **And deploy the hygiene service with the portal** — it is not reachable today |

---

## 8 · Keep / depart

**Kept:** the portal's module structure, the reject taxonomy (10 codes, unchanged), model tiering, the review-queue three-action model, the workstream tree, the card schema, and `H-09`–`H-12` and `J-01`–`J-08` as pre-written type-B work.

**Departed:** `portal-build-spec` §3.7's fan-out (§5.1); the Voice Cheat Sheet as a voice source (§1.1); the workbook's Pillar values (§1.2); and the runbook's flat review budget, already corrected on 2026-08-24.

---

## 9 · Traceability

**Invented, and labelled:** the `sourceable` probe (§2.1) · the deterministic/semantic linter split and every rule ID (§4) · the corrected fan-out counts (§5.2) · the cold-start substitutions (§6). All are constructed over the sources rather than found in them.

**Found, not invented:** every voice and claims rule (`brand-guidelines`, `site-truth` §7) · the lane rules (`audit.md` §5) · the reject taxonomy and module structure (`portal-build-spec` §3) · the card schema and the 30 handover cards (the workbook) · the retired-copy list (`CLAUDE.md`).

**Estimates:** the 0.85 duplication threshold and the 200-character negation window in `L02` are starting values, not measurements. **Both need tuning against the ledger in month one.**

---

## 10 · Flags for Joy

| | |
|---|---|
| **1** | **The Voice Cheat Sheet must be reconciled or retired.** It instructs writers to reuse retired copy verbatim, and it is the file most likely to be read by someone writing quickly. §1.1 |
| **2** | **Remap the workbook's Pillar column.** One transform, but nothing should use those values until it runs. §1.2 |
| **3** | **`L20` reader-labour needs a month of supervised catches** before it runs unattended. It is the rule most likely to reject good copy |
| **4** | **Signals 2 and 4 need ~30 minutes a week from a named person.** Unassigned, it does not happen and the pipeline quietly reverts to somebody's hunch |
| **5** | **`zero hallucinations` appears as a claim in the workbook and as a card** (`B-06`, *"What 'zero hallucinations' really means"*). If the claim is retired, that card is retired with it |
