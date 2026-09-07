# Website revision — consolidated state and plan

*2026-08-24. Written after five days of inputs landed across three parallel workstreams (product, GTM, design).
Supersedes the sequencing in [`website-workplan.md`](website-workplan.md); does not supersede
[`website-session-prompt.md`](website-session-prompt.md), which stays binding on standard, voice and facts.*

---

## 0 · Sources opened

Per rule 1, by file and section. **Today:**

| File | Read |
|---|---|
| `docs/website-session-prompt.md` | **In full** — the 18:10 version, which is 6KB longer than the 16:15 version I worked from earlier today |
| `docs/gtm/plan.md` | In full — §1 launch ICPs, §8 decisions |
| `docs/gtm/content-approach.md` | In full — §2 five persona findings, §3 four content types, §3B market-size, §5 topic pipeline, §7A the data boundary, §10 decisions |
| `docs/gtm/channel-model.md` | §3.8 (free tool retired), §4 (what the website must provide) |
| `.agents/gtm-strategy.md` | §5, §11 (purpose, `x`, gates), §12 (credibility objection), §13 |
| `docs/site-truth.md` | In full |
| `.agents/icp-copy.md` v3 | All eight ICP message sets |
| `CLAUDE.md` | Rule 6 text hygiene — current in context, matches the 17:16 write |
| `docs/product/phase-map.md` · `ai-disclosure-spec.md` · `.agents/product-marketing-context.md` | Read earlier this week for the product pass |

**Prior sessions searched** (rule 3): `permission layer`, `website-copy-deck`, `alternatives/ibisworld`.
Every hit traces to one session — **GTM execution layer**, today. Nothing older contradicts the new material,
and `/alternatives/*` has no prior history at all. It is genuinely new.

**Not read this session, and it matters:** `.agents/icp-personas.md` in full. I read the persona and pain
sections for all eight in an earlier session and have been working from those notes since. **The brief requires
a full re-read before writing ICP copy** — that is rule 2, and the failure it exists to prevent. It is the first
item in Phase 1 below, not a box already ticked.

---

## 1 · The one thing in the brief I would argue

**§6 says: copy deck first, Joy approves, then Figma. "Do not edit Figma."**

That sequence has already been overridden — by Joy, deliberately, on 2026-08-21:

> *"I find it hard to react to text files — so why don't you complete the pass and then build the website
> pages — I will review directly in Figma."*

So the current state is the inverse of what the brief assumes. **Figma is ahead of the deck.** Sixteen pages
are built, the offer change is applied across all of them, and `docs/website-copy-deck.md` describes an earlier
state of the world. Re-imposing the gate now would mean writing a deck about work already built, and then asking
Joy to approve it in the exact format they have said does not work for them.

**What I recommend instead, and it keeps everything the brief actually cares about:**

| Brief's intent | How it survives |
|---|---|
| Joy approves before it ships | **Approval happens in Figma**, as Joy asked. The freeze is the gate, not the deck |
| Rule 5 — cited, or it does not ship | **The deck becomes the traceability record**, written alongside the build rather than before it. This is genuinely missing today and is the real gap |
| Voice consistency across 40 pages (§4 layered method) | **Still binding, and still the main risk.** Layers are how the copy gets written; Figma is only where it lands |
| Joy has read none of the Figma copy | **Fixed by a short companion note per review round** — decisions and flags only, not a 40-page deck |

**The deck is not cancelled. Its job changes from gate to audit trail.** If you would rather hold the original
gate, say so and I will write the deck first — but it costs roughly a week and lands in a format you have told
me you cannot react to.

---

## 2 · Everything provided, consolidated

Five days, three workstreams. Grouped by what it changes.

### 2.1 Positioning and offer — settled

| | Decision | Source |
|---|---|---|
| Message stack | Category **Analytical AI** · Identity **"Not an assistant. An analyst."** · Promise **"Arrive certain."** · Proof **"Every source, credible…"** | `site-truth` §1.0, locked 08-19 |
| **The offer** | **"Ask a question. No account needed."** $100 moves hook → closer and leaves acquisition surfaces | `site-truth` §1.0, locked 08-20 |
| Three rules | No competitor in lead copy · never frame proof as reader labour · cost is the third act | `site-truth` §1.0 |
| Anchor | A **cited case study per use case**, not ranges | `site-truth` §1.3 |
| Ladders | Use cases, not price lists — every relevant type per ICP page | `site-truth` §2.1 |

### 2.2 The launch ICPs — new, 2026-08-20

**Investors primary, Consultants secondary.** Criterion: approved budget plus a directly reachable
decision-maker. **Emphasis, not scope — all eight pages still ship.**

- `/investors` and `/consulting` are the two pages worth extra passes
- Homepage proof should skew to **an IC memo and a client deck**, not a dissertation chapter
- **Market Research is explicitly not a launch ICP** — ships unchanged, gets no homepage real estate. Longest
  objection table in the research, including *"Isn't this a threat to my job?"*
- Agencies and Strategy open in Phase 2 — a configuration change, not a build

### 2.3 Three new page families — new, 2026-08-20/24

| Family | Count | Why it exists |
|---|---|---|
| **`/alternatives/*`** | 8 | **Nobody searches "Caspr vs IBISWorld" — they have never heard of Caspr.** The query with volume is `IBISWorld alternatives`. Four persona sets say the buyer's mental shelf is research databases, not AI tools. Highest commercial intent on the site |
| **`/market-size/*`** | template + index | **Generated, not written**, from `fact_lookup`. Three states — and the **disagreement state is the hero**: three credible figures side by side, never averaged. `not_found` is a published answer and the best pitch on the site |
| **The permission layer** | 6 of 10 | *"Is this allowed?"* appears in **all six** objection tables in six institutional forms. Zero content anywhere. Highest ratio of conversion value to production cost available |

**The constraint on all six permission pieces:** describe what Caspr **is and does**. **Never interpret the
reader's own obligations** — *"your firm permits this"* is a claim about their policy, not ours.

### 2.4 Scope changes to the existing plan

- **`/samples` promoted Tier 3 → Tier 2.** It is the answer to the credibility objection in five of six
  objection tables, and `gtm-strategy` §11 makes it a **proof gate that blocks all paid spend**
- **The nine `/vs/*` pages are kept and fixed, not deleted** — rewritten to current positioning, linked into
  nav and footer, moved out of "Phase 3 — not launch-critical"
- **The free tool is retired** — no second front door in front of a product that is already free. Its page
  design survives as `/market-size/*`
- **Multilingual parked to Phase 1.5** — website stays English at launch

### 2.5 Product facts that changed the copy

Milestone feature gates (formats and languages gated by plan, not by analysis depth) · custom template
$1,000/three for $2,500, Business+ may purchase, Enterprise includes the first, **2-hour response unqualified** ·
`/ai-disclosure` required by EU AI Act Art 50, in force since 2 August · Projects and unlimited Signals are
Enterprise-only.

### 2.6 Constraints that bind the work

**CLAUDE.md Rule 6 — text hygiene before publication.** Every published marketing artefact goes through
`clean-user-facing-text` before it leaves. **The hard boundary: it never touches a product deliverable**, which
is legally required to carry its AI provenance mark. We mark what we sell; we clean what we publish about
ourselves. The hygiene service must deploy with the portal — it is currently not running.

**`content-approach` §7A — the engine never originates data.** Every number comes from the product. **A number
the product cannot source does not get published.** This governs `/market-size/*` and `/alternatives/*` alike.

---

## 3 · What is actually built

**17 Figma pages, covering all 16 Tier-1 surfaces** (the legal page carries privacy, terms, refund and
ai-disclosure), plus componentised chrome and a component-states page.

**Done and verified this week:**

- Offer change applied site-wide — nav retired across 38 frames in one component edit, eight distinct ICP CTAs,
  `$100` off every acquisition surface and onto the showcase, `/pricing` and objection folds
- Milestone gating — plan cards, inclusion line, formats FAQ, free-trial FAQ, multilingual fold
- `/ai-disclosure` built, desktop and mobile, footer-linked through both chrome components
- `/enterprise` custom-template block corrected on all four counts
- Ladder rung descriptors rewritten across seven ICP pages
- Retired claims removed — "Zero hallucinations" in three places, `1M+` → `25M+`
- The 12 orphan pages linked into both footers

**Never reviewed as prose by Joy** — the brief flags this and it is still true: ladder rung descriptors
(~32 frames) · the register fold's eight variants · the `/pricing` ladder table and retention fold · the
`/enterprise` house-template block · the `/academic` pricing line · and now everything from today's offer pass.

---

## 4 · Dependencies and blockers

| # | Blocker | Blocks | Owner |
|---|---|---|---|
| **B1** | ~~OD-10~~ — ✅ **done 2026-08-25**, [`od-10-results.md`](od-10-results.md) | Every comparison fold, the homepage cost band, **and the pricing claims on all 8 `/alternatives/*`** are unblocked. **The rule that made it slow still stands:** an incumbent's price is read from the incumbent's own page with an observation date, or it does not ship | ✅ |
| **B2** | **C-1 — is Intelligence live at launch?** `phase-map` lists "Intelligence depth" as Phase 2; `product-marketing-context` sells the $300 rung everywhere | The $300 rung on the homepage, `/pricing`, 8 ICP ladders, nav dropdown, footer. **Largest single copy exposure on the site** | **Joy / Jayant** |
| **B3** | ~~3 real reports~~ — ✅ **satisfied 2026-08-26. 23 produced, three selected on evidence:** **Saudi industrial valves** · **Reconcile UK ready meals** · **Vertical SaaS valuations** | `/samples`, and therefore **all paid spend** (proof gate). **⚠ Two product defects block publication** — missing XMP provenance and template markers in the PDF text layer, [`report-evaluation-2026-08.md`](report-evaluation-2026-08.md) §5. With Jayant | ✅ |
| **B4** | **10 real testimonials** | Testimonial folds going live with attributed quotes. Regulated claim in US/UK/EU | Joy — §13 item 1 |
| **B5** | **`fact_lookup`** | `/market-size/*` content. **Not the template** — that can be designed now | Jayant |
| **B6** | **C-2 — Business "All languages": included, or unlocked but charged?** | The plan card now reads as included; `pricing-model` §4.6-B still charges $5–10 per output per language | Joy |
| **B7** | **`icp_hint` + `utm_*` spec** | The personalisation the onboarding already has, and attribution — therefore `x` itself | Dev round |

**B2 is the one I would resolve first.** Everything else has a workaround; that one determines whether eight
ICP ladders and the whole `/pricing` page are selling something that exists.

---

## 5 · The plan

### Phase 0 — reconcile (½ day, unblocked)

1. **Re-read `icp-personas.md` in full**, all eight persona and pain sections. Rule 2. Not optional, and not
   already done in this session
2. **Start the deck as an audit trail** — page by page, Source line per item, KEEP/REWRITE/CUT on everything
   Joy has never read
3. **Ship the short companion note** — decisions and flags only, so Joy reviews in Figma with a one-page
   crib rather than a 40-page document

### Phase 1 — Tier 1 to review-ready (2–3 days)

| | Work |
|---|---|
| 1.1 | **`/investors` and `/consulting` extra passes** — the two launch ICPs, per `plan.md` §1 |
| 1.2 | **Homepage proof skews to IC memo and client deck.** The What Arrives mock already shows an investment report — that is aligned; the testimonial and example content is not |
| 1.3 | **Re-judge the never-reviewed copy** — ladder rungs, register fold ×8, `/pricing` table, `/enterprise` block, `/academic` line |
| 1.4 | **Objection folds get their permission-layer links** — written with the targets as placeholders until Phase 2 lands |
| 1.5 | **Comparison folds** — surrounding copy written; **placeholders can now be replaced with real figures** ([`od-10-results.md`](od-10-results.md) §2) |

**Gate: Joy reviews Tier 1 in Figma.**

### Phase 2 — the launch-critical new families (3–4 days)

**I recommend cutting Tier 2 to what a channel actually needs on Day 1.** Every item below is named in
`channel-model` §4 or `content-approach` as a channel dependency or an objection-blocker:

| Ship at launch | Why |
|---|---|
| **The permission layer ×6** | Copy-only. ICP objection folds link to them; without them those folds either say nothing or over-claim |
| **`/alternatives/*` ×8** | One template, eight instances. Search compounds slowly — publishing late costs months of ranking, and this is the highest-intent set on the site |
| **`/samples`** | Proof gate. Blocks paid spend entirely |
| **`/market-size` template + index** | Template designable now; content waits on B5. **The index is the internal-linking asset the site currently lacks** |
| **`/vs` index + the nine `/vs/*` rewritten and linked** | They already exist and rank for nothing because nothing links to them. Cheap |
| **`/careers` and `/contact`** | **The footer already links them.** They must exist or those links 404 |
| **`/use-cases/investment-deal`** | The merge target for due-diligence and investment-thesis, and the page the primary launch ICP lands on |

| Defer past launch | Why it can wait |
|---|---|
| `/product` · `/data-room` · `/outputs` · `/visuals` · `/roadmap` · insights coming-soon | Product-detail surface. No channel depends on any of them on Day 1 |
| `/languages` | Already parked to Phase 1.5 with the multilingual decision |

### Phase 3 — freeze and build

Figma freeze → **one dev round, pixel-identical**. Carried into that round as spec, not design:

- **Structured data** — `Organization`, `BreadcrumbList`, `Article`, `VideoObject`, `SoftwareApplication`.
  Zero JSON-LD on the site today. **No `aggregateRating` on our own pages.** `Dataset` on `/market-size` results
- **`icp_hint` + `utm_*` on every CTA, landing on a pre-filled ICP-relevant question** (B7)
- **The text-hygiene service deployed with the portal** — `plan.md` §8 decision 5

### Running in parallel, not on the critical path

Joy's three demonstration analyses (B3) · testimonial collection (B4) · OD-10 sourcing (B1) ·
`fact_lookup` and `demand_signal` from Jayant's team (B5).

---

## 6 · Decisions — taken 2026-08-24

| | Decision | Consequence |
|---|---|---|
| **1** | **The deck is the audit trail, not the gate.** Joy reviews in Figma; the deck carries the rule-5 Source lines alongside the build; each review round gets a one-page decisions-and-flags note | §1 stands. The brief's §6 gate is formally superseded |
| **2** | **Intelligence is NOT live at launch — flagged coming soon** | See §6.1. This is the largest single change in the plan |
| **3** | **All of Tier 2 ships.** Not the seven-family cut I proposed — the full set | ~25 new pages on top of 16 Tier-1 surfaces. See §6.2 for how this is sequenced so the freeze is not held hostage |
| **4** | **B6 — languages free or charged** | Still open. Minor: one plan card, one FAQ |

### 6.1 · The $300 depth is coming soon — across all five types

**Decided: the whole depth, not just the Market Research rung.** `phase-map.md` lists *"Intelligence depth"*,
and **depth is the taxonomy's word for the rung**, orthogonal to type. So the $300 rung is coming soon
wherever it appears, under every one of its names:

| Type | $300 rung | At launch |
|---|---|---|
| Market Research | **Intelligence** | Coming soon |
| Investment & Deal | **Diligence** | Coming soon |
| Business Case | **Board paper · Strategic options** | Coming soon |
| Academic Research | *(no $300 rung)* | — |

**This costs the top rung on `/investors`, the primary launch ICP.** That is the honest reading and it was
taken with the cost understood. Every ladder collapses to two live rungs plus a signposted third.

**The treatment is flag, not delete** — per Joy's standing instruction that Phase 2 items are covered and
marked, never skipped. The rung keeps its place in the ladder so the shape of the offer stays legible and the
roadmap is visible.

**Surfaces affected:** homepage pricing cards · `/pricing` analysis-type cards, ladder table, plan cards and
the Intelligence FAQ · eight ICP ladder blocks · nav Analyses dropdown · footer Product column · `/investors`
solution fold and FAQ · `/enterprise` included list.

**Copy that must go, because it sells the rung as purchasable today:** *"Intelligence reports are available
à la carte for $399 — no plan required"* · *"Business and Enterprise subscribers access them at $300 within
their budget"* · *"Intelligence ($300) — multi-model, up to 24 hrs"* as a Business unlock.

#### Applied 2026-08-24 — built, not just planned

| Surface | Treatment |
|---|---|
| **8 ICP ladder blocks**, both breakpoints | Rung kept in place, price kept, descriptor carries **· Coming soon**. The ladder shape stays legible and the roadmap is visible |
| **Homepage** Intelligence card | Eyebrow **INTELLIGENCE · COMING SOON**; CTA changed from *"Ask a question"* to *"Coming soon"* — a live CTA on an unavailable tier is the misleading bit |
| **`/pricing`** analysis-type card 03 | Description opens *"Coming soon."* |
| **`/pricing`** ladder table | Footnote extended: *"The $300 depth is coming soon — Intelligence, Diligence and Strategic options alike."* Both breakpoints |
| **`/pricing`** Business plan card | *"Intelligence ($300) — coming soon."* The body no longer budgets against it — *"enough for seven Studies a month"* replaces *"or one Intelligence with $258 left in reserve"* |
| **`/pricing`** FAQ | *"How is Intelligence priced?"* → **"When does Intelligence arrive?"**, answered under all three rung names |
| **`/investors`** hero stats | **`24 hrs / Intelligence-tier analysis`** and **`$399`** both went — they were selling the unavailable rung. Now `1–2 hrs / From data room to IC-ready` and `$80 / A full market view, not a retainer` |
| **`/investors`** subhead, solution fold, strip eyebrow, 2 FAQ pairs | Diligence reframed as *"to come"*; *"IC-GRADE INTELLIGENCE"* → *"IC-GRADE ANALYSIS"*; both tier FAQs rewritten |
| **`/strategy`** framework FAQ | The answer sold the tier twice. Rewritten around what actually ships |
| **`/enterprise`** · **`/academic`** | *"Brief and Study access · Intelligence on release"* · *"Intelligence runs on a standard account, and is coming soon"* |

**Deliberately not touched, and it needs your call:** **Terms of Use §4.4, *"Intelligence À La Carte"***, still
states the tier *"is available as a one-time purchase without an active subscription."* It is the only place
left on the site that sells it. **Editing a published legal document is not a copy decision** — flagging rather
than acting.

**One design refinement worth a pass later:** *"· Coming soon"* currently inherits the descriptor's grey. In
red, or as a small pill, it would read at a glance rather than on reading. Deferred, not forgotten.

**Two generic-language traps avoided:** roughly twenty uses of *"intelligence"* on the site are not the rung —
*"market intelligence"*, *"category intelligence"*, *"IC-ready intelligence"*, and `/strategy`'s
*"the constraint is bandwidth, not intelligence."* None were touched.

### 6.2 · Sequencing Tier 2 so the freeze is not held hostage

All of Tier 2 ships, but not in one block. **Channel dependencies first, product-detail surface last**, so that
if anything slips it is `/roadmap` and not `/samples`:

| Wave | Pages | Rationale |
|---|---|---|
| **2a** | permission layer ×6 · `/alternatives/*` ×8 · `/samples` · `/careers` · `/contact` | Objection-blockers, the highest-intent search family, the proof gate, and two pages the footer already links |
| **2b** | `/market-size` template + index · `/vs` index + nine `/vs/*` rewrites · `/use-cases/investment-deal` | Internal-linking assets and the primary launch ICP's use-case page |
| **2c** | `/product` · `/data-room` · `/outputs` · `/visuals` · `/roadmap` · insights coming-soon | Product-detail surface. Nothing depends on these on Day 1 |

`/languages` stays parked with the Phase 1.5 multilingual decision.

---

*Nothing in this plan touches the live website. The Figma file is the working surface until the freeze.*

---

# 7 · CTA and nav pass — 2026-08-26

**Read for this pass:** [`entry-routes-and-cta.md`](entry-routes-and-cta.md) (locked 25–26 Aug, self-declared
source) · [`website-copy-deck.md`](website-copy-deck.md) (pass 1 + 2, CTA lines updated 25 Aug) ·
[`seo/decision.md`](seo/decision.md) · `site-truth.md` §1.0 · the **live nav at new.caspr.ai**, measured.

### The CTA changed, and it superseded two days of work

**`Ask a question →` and the eight ICP-specific CTAs are gone.** `entry-routes-and-cta.md` §5 kills the whole
family — *"Ask Caspr"* is named there as **the generative-AI idiom**, borrowing the category we decline to be
in — and §6 rules out per-ICP variants entirely: each ICP has eight prompts in the locked library, so a button
narrows to one and the landing screen immediately widens to a bar cycling all eight.

**One phrase, every surface: `Run the analysis`.** 78 CTAs replaced across 16 pages and both breakpoints.
Mobile **header** shortens to `Run analysis` (§3.1 — chrome compresses, content does not); every body CTA keeps
the article on all viewports. Sweep confirms zero survivors of the retired pattern.

**Homepage final CTA restored to the deck.** Eyebrow hidden — dropped 25 Aug by Joy because it restated the
offer its own headline already makes. Headline back to **"Your first $100. On us."** from my *"Arrive certain."*
The two move together: drop the eyebrow while keeping my headline and the offer is stated **zero** times.

### The nav now matches the live site — and that resolved a spec conflict

The Figma nav matched **neither** the live site nor `entry-routes` §3.2. Measured at 1440 and 390:

| | Live | §3.2 "canonical" | Figma before |
|---|---|---|---|
| Band | **65** | 72 | 72 |
| Nav links | Inter Medium **13** | Medium 14 | Medium 14 |
| Carets | **↓ 10px** on the three dropdowns | — | none |
| Wordmark | **66×32** at 113,16 | — | 68×33 at 120,20 |
| Button | h**44** · r**4** · Semi Bold 13 · pad 24 | h39 · r2 · Medium 14 · pad 20 | h40 · r4 |

**Ruled (Joy): live wins for the website; §3.2 continues to govern the 30 onboarding screens.** Both navs
rebuilt to live geometry, with two deliberate departures:

- **`Log in` stays** — `entry-routes` §3 requires it on every website page; live does not have it yet
- **The mobile button stays** — live mobile carries only a wordmark and hamburger; the spec requires a button

**Consequence to hold:** the website header and the app header now differ (65 vs 72 band, radius 4 vs 2).
Defensible — one is marketing chrome, the other is product chrome — but §3.2 calls itself canonical *"so this
is never re-derived"*, and it should be annotated to say it governs onboarding rather than every surface.

**The 7px band shrink is safe.** Every page top-frame is `VERTICAL` auto-layout, so content pulled up cleanly;
verified no gap on desktop or mobile.

**Wordmark:** resized the existing vector component to live's 66×32 rather than re-importing the SVG. The last
import produced a white-block background and a synthetic-bold stroke that would not scale — not worth re-running
for a result already achieved.

### Analyses dropdown — Intelligence flagged

**It was the last surface selling the $300 depth as available.** Only the *Solutions* panel existed in Figma;
the Analyses panel lives on the live site alone. Built **`Nav / Panel — Analyses`** on the Component States
page: Brief `$15 · 15 min` · Study `$80 · 1–2 hrs` · Intelligence `$300 · 24 hrs · **Coming soon**`, the flag
set in accent so it reads at a glance.

### Not acted on — flagged instead

| | Conflict | Why I stopped |
|---|---|---|
| **1** | **How many times may the $100 appear?** `entry-routes` §7 says *"stated exactly once on the website… nowhere else."* The deck puts it in the ICP final-CTA body on all eight pages, the `/pricing` plan-card footnote, and the homepage pricing microcopy | The deck's note says it *"restores the $100 line, which the build dropped"* — i.e. it was reacting to my removal. Then `entry-routes` landed 29 minutes later saying once. Both are yours, and I am not choosing between them |
| **2** | **`/pricing` final CTA** — deck says *"as homepage"*, which would state the offer a second time | Same conflict, one fold |
| **3** | **`site-truth` §1.0 is now stale** — still records the hook as *"Ask a question. No account needed."* `entry-routes` supersedes it and closes site-truth's own line 45 | Editing the binding facts file is your call, not mine |
| **4** | **`/alternatives/*` cut from 8 pages to 1** (`seo/decision.md` §2 — ~490 searches/month total and G2 owns those SERPs, replaced by roundup and directory inclusion). My Phase 2 wave 2a assumed eight | Changes the plan above; §6.2 needs revising |
| **5** | **AEO as a build standard, a declared sitemap, and `Organization` schema** are now required of every template (`seo/decision.md` §4, §3A.3) | Dev-round spec, not Figma |
