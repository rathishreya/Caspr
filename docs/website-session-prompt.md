# Website Session — Brief

**Paste into a fresh session rooted at `G:\My Drive\Caspr\caspr-claude-core`.** Self-contained.

*Version 1 — 2026-08-20. Supersedes [`copy-deck-brief.md`](copy-deck-brief.md), whose layered method is kept
verbatim and whose calibration examples, positioning order and ICP instruction are corrected.*

---

## 0 · The working standard — read before anything else

This is the commercial foundation of the business, not a content task. The failure mode below is not
hypothetical: it happened on 2026-08-20, twice, and cost a day.

**What went wrong.** A session was asked to write the eight ICP headlines. It had `site-truth` §2.1 loaded — a
tidy table mapping every ICP to its trigger events. It wrote from that table. Trigger events are deadline-shaped
by definition, so it produced eight variations on *"the deadline is Thursday and you don't know the sector."*
Surface variety, one idea underneath. Asked to improve them, it diagnosed a craft problem, added a rhetorical
turn to each, and produced eight better-sounding versions of the same single idea — because the problem was
never craft.

**The material was already there.** `icp-personas.md` holds eight day-in-the-life narratives at ~76KB. The best
line on the live site — *"Your library closed at 9pm. Your case brief doesn't care."* — is lifted almost
verbatim from line 709 of that file. It was **found, not written.** So are these, all sitting unused until
someone opened the file: *"I'm paid to evaluate businesses, not to be a research librarian"* (`:249`) ·
*"I become a fake expert in 3 days"* (`:347`) · *"I still have to do research before I can do the research"*
(`:529`) · *"4 hours compiling what amounts to 3 usable data points"* (`:57`).

### The seven rules — `CLAUDE.md` §5. Each has a test you must be able to pass.

| | Rule | Test |
|---|---|---|
| **1** | **Name the sources before producing.** State which you opened, by filename and section. If something relevant exists and you skipped it, say so and why | Is there a visible list, naming files not categories? |
| **2** | **Primary over summary. Always.** A table or index is a map. Never write from a map when the territory exists. **`icp-personas.md` over `site-truth` §2.1** — that specific substitution is what failed | Can you quote the source line that produced each headline? |
| **3** | **Prior sessions are a source.** Months of decisions are searchable with `search_session_transcripts`. Search before assuming anything is undecided or untried | Did you search before calling something open? |
| **4** | **Existing output is evidence, not an anchor.** Read the live site and the Figma. State explicitly what you keep and why, what you depart from and why | Is there an explicit keep/depart list with reasons? |
| **5** | **Traceable, or flagged as invented.** Every headline, claim and price points at a research finding, a recorded decision, or a stated assumption. Anything else is labelled invented | For each line, can you name its origin? |
| **6** | **Diagnose the layer before redrafting.** When something is rejected, name whether it failed on input, structure or craft *before* rewriting. If you cannot state distinct substance per item, the problem is upstream | Was the failing layer named before v2? |
| **7** | **If gathering feels like a detour, it is the work.** The moment "I should go look at that" gets deferred because there is output waiting, the rule has already broken | Did you defer a lookup to keep producing? |

**Rule 5 is the one that matters most**, because it is the standard the product itself is sold on. *Cited, or it
does not ship* applies to your work too.

---

## 1 · Read these first — binding, in this order

**Do not write a word until all of these are open.** State which you read (rule 1).

| File | Why | Weight |
|---|---|---|
| **`.agents/icp-personas.md`** | **The primary source.** Eight day-in-the-life narratives and Pain-In-Their-Own-Language. Every good line on this site came from here. Read the persona and pain sections for all eight, in full | **Highest** |
| `docs/site-truth.md` | §1.0 positioning stack and homepage hero · §1.3 comparison anchors · §2 the ladder · §6 canonical numbers · §7 claims register · §8 open decisions | Binding on facts |
| `.agents/icp-copy.md` **v3** | The eight approved ICP message sets, each cited to its persona line. **Approved by Joy 2026-08-20** | Approved — use as written |
| `.agents/product-marketing-context.md` | Master reference: journey, business model, competitive positioning, objections, customer language, switching dynamics | Context |
| `.agents/brand-guidelines.md` | Voice, content pillars (reordered 2026-08-20), writing rules | Binding on voice |
| **`.agents/website-visual-design-guidelines.md`** | **The visual system.** Type ramp, colour tokens, spacing, layout, alignment philosophy | **Binding on design** |
| `.agents/website-architecture.md` | Page hierarchy, nav spec, SEO intent, internal linking, URL conventions | Structure |
| `docs/phase-b-fold-map.md` | Fold-by-fold: what stays, changes, is new, goes | Structure |
| `docs/website-workplan.md` | Where the Figma work actually stands, and the freeze sequence | State |
| `docs/website-copy-step2.md` | Copy previously approved — **now needs re-judging.** See §4 | Re-judge |
| **`docs/od-10-results.md`** | **Five cited competitor comparables**, with URLs and observation dates. The comparison folds depend on it | **Binding on comparison copy** |
| `.agents/pricing-model.md` · `.agents/security-posture.md` | Canonical prices; cleared security claims | Binding on facts |
| **`docs/gtm/content-approach.md`** | **§2 — five findings from the personas that decide what several of these pages must do**, each cited to a line. §3B is the `/market-size/*` design | **Binding on §6** |
| `docs/gtm/plan.md` §1 | **Which ICPs launch, and why.** Affects emphasis across the site — see below | Binding on emphasis |
| `docs/gtm/channel-model.md` §4 | What each acquisition channel needs from the site | Context |
| `CLAUDE.md` | Positioning, the tiered approved-copy list, the seven rules **and Rule 6, text hygiene before publication** | Binding |

> ⛔ **One trap, named so you do not walk into it.** `docs/website/icp-pages-seo.md` carries **“H1 (existing — do not change)” on eight pages whose heroes were all replaced** by `icp-copy.md` v3. **Acting on it reverts approved copy.** It is banner-marked SUPERSEDED. Its keyword-intent lines were assumed, never measured — **a full SEO research pass is pending a keyword tool**, so treat titles and meta descriptions as draft-and-revisit rather than final.

**Also read, as evidence not as anchor (rule 4):** the live site at **new.caspr.ai** — all nine ICP pages, the
homepage, `/pricing`, `/security`. Some of it is better than anything you will write. `/academic` and
`/agencies` heroes are already approved to stay.

**If site-truth and any other file disagree, site-truth wins.** If site-truth and reality disagree, stop and flag it.

---

## 2 · Skills — invoke, don't improvise

| Skill | When |
|---|---|
| `marketing-skills:copywriting` | Before writing any page copy |
| `marketing-skills:marketing-psychology` | When a headline needs to land harder — devices, framing, loss aversion |
| `marketing-skills:copy-editing` | After the deck drafts, line-by-line pass |
| `marketing-skills:page-cro` | Homepage, `/pricing`, ICP pages — structure and conversion, not just words |
| `marketing-skills:site-architecture` | Nav, hierarchy, internal linking, the orphan-page fix |
| `marketing-skills:seo-audit` · `ai-seo` · `schema-markup` | SEO pass and structured data (§6) |
| `anthropic-skills:figma-use` | **Mandatory before every `use_figma` call** |
| `anthropic-skills:figma-generate-design` | Building or updating full pages in Figma |

---

## 3 · The positioning — locked 2026-08-20

| | |
|---|---|
| **Category** | Analytical AI |
| **Identity** | **Not an assistant. An analyst.** |
| **Promise** | **Arrive certain.** |
| **Proof** | **Every source, credible. Every claim, triangulated. Every report, defensible.** |

**Homepage hero — approved, use verbatim:**

> # Not an assistant. An analyst.
> Any question your board will ask — answered, sourced, and ready before they ask it.
>
> **[ Ask a question ]**
> `No account needed · 25M+ curated sources · From $15`

---

### The offer — approved 2026-08-20. This is the biggest change on the site

**The product and the marketing had diverged.** Per `docs/product/onboarding-understanding.md`, **signup is now
the tool**: the visitor writes a prompt, answers the clarifying questions, watches the layout build and the
Theater start — **all before any account exists.** The wall fires at peak intent, and the gate button already
reads *"Start free — first $100 on Caspr."*

**The site never caught up, and currently states the offer three different ways:** the nav says *"Start Free →"*,
the homepage subhead says *"From $15. No subscription required."*, and the ICP CTAs say *"first $100 free, no
credit card."* **Three offers, one product. Close this in one pass.**

**The offer, stated:**

> **Use Caspr before you sign up.** Ask a real question, answer the two it asks back, and see the analysis it
> plans — the structure, the sections, the sources it will read. Sign up only when you want it finished.

**The structural change: the $100 moves from hook to closer.**

| | Was | Now |
|---|---|---|
| **Hook** — gets a stranger to engage | *"Start free — $100, no credit card"* | **"Ask a question. No account needed."** |
| **Closer** — converts at the signup wall | *(absent from the site)* | **"$100 on us"** — already built into the product gate |

**Why.** At the wall the visitor has written a prompt, answered questions and approved a structure — effort
invested, value seen. The credit lands on top of that instead of trying to buy a stranger's attention. And by
then **$100 finally means something, because they have seen what an analysis is.** As a hook it is an abstract
number for an unknown unit.

**What this changes across the site:**

- **Primary CTA everywhere becomes an invitation to use it**, not to register. *"Ask a question"* on the
  homepage; ICP pages may use their own phrasing but must invite the question, never the account
- **`No credit card` → `No account needed`** in the hero microcopy. It is the bigger claim and the true
  differentiator
- **The $100 disappears from acquisition surfaces.** It belongs at the gate, which the product already handles
- **Nav CTA `Start Free →` is retired** — it sells an account

**And the requirement that makes it work:**

> **Every CTA must carry `icp_hint` and land the visitor on a pre-filled, ICP-relevant question.**

The onboarding already reorders its five Type cards and swaps example prompts by `icp_hint`. A consultant
arriving from `/consulting` should find a consulting question already in the box. **A generic homepage landing
wastes the personalisation that is already built.**

**One risk to hold in mind while writing:** this offer invites judgement *earlier* than the old one. If the
pre-signup experience underwhelms, it fails harder. Write the surrounding copy so the promise matches what the
first sixty seconds actually delivers — do not oversell the layout step.

---

### Three rules that come with it

1. **Never name a competitor or the LLM category in lead copy.** Naming them concedes we are in the same category. The generative contrast is **category education** — `/vs/*`, social, founder content only. Never a hero, headline or ad.
2. **Never frame proof as work for the reader.** *Verify · check the working · traceable · see for yourself · audit it* all sell more labour and contradict the promise. **Describe the artefact; never assign the labour.** Citations answer *"when the room asks"*, not *"so you can confirm we are honest."*
3. **Cost is the third act.** Time and quality lead. Cost appears in proof lines and ad creative, never in a headline.

### Calibration — the current target

**Lead copy, hero-eligible:**
> *"Not an assistant. An analyst."*
> *"You were hired to evaluate businesses. Not to be a research librarian."*
> *"Your library closed at 9pm. Your case brief doesn't care."*
> *"You research for a living. You still have to research before you can research."*

**Supporting only — never a hero:** *"15 minutes. 100 pages. Cited to source."* · *"The $200,000 question. For $80."*
**Category education only:** *"While the world was building generative AI, we built analytical AI."*
**Retired:** *"Stop Googling. Start analyzing."* · *"Your competitors are still waiting for the research."*

The full tiered list is in `CLAUDE.md`. **Note what changed:** the first two calibration examples in the
previous brief are now demoted. Writing to them reproduces the old positioning.

---

### The launch ICPs — decided 2026-08-20. This changes emphasis, not scope

**Investors (ICP 3) primary, Consultants (ICP 1) secondary.** Criterion was an approved budget plus a
directly reachable decision-maker — no procurement, no approval chain. Reasoning in
[`plan.md`](gtm/plan.md) §1.

**All eight ICP pages still ship, and all eight heroes are already approved.** What changes:

- **`/investors` and `/consulting` are the two pages to get right**, and the two worth extra passes
- **The homepage's proof and example content should skew to those two rooms** — an IC memo and a client
  deck, not a dissertation chapter
- **Market Research (ICP 6) is explicitly not a launch ICP.** Its page ships unchanged; it does not get
  homepage real estate. It has the longest objection table in the research, including
  *"Isn't this a threat to my job?"* (`:557`) — that page needs care, not prominence
- **The permission layer's first six** are weighted to compliance, client deliverables and IC memos for
  the same reason

---

## 4 · Method — write in layers, not page by page

**Kept verbatim from the previous brief. It is the single most important instruction here.** Voice drift across
40 pages is the main risk, and writing page-by-page guarantees it.

1. **All eyebrows, site-wide.** One pass. They should read as one set.
2. **All headlines, site-wide.** One pass. **Read them as a list before moving on** — any that sound like a different writer, rewrite.
3. **All body copy**, fold by fold.
4. **All CTAs and microcopy.**
5. **Read the headline list once more** against the calibration above.

### The ICP correction — this is where the last attempt failed

The previous brief said to write ICP heroes *"from that ICP's trigger events."* **That instruction is wrong and
it is what produced eight identical headlines.** Trigger events are deadlines. Write instead from the
**persona narrative and the Pain-In-Their-Own-Language sections** — where the texture lives.

**The eight heroes are already written and approved** in `icp-copy.md` v3, each cited to its persona line. Use
them. Your job on the ICP pages is everything *beneath* the hero — pain folds, objections, FAQ, register,
comparison — and that work has the same requirement: **eight different wounds, in eight different registers.**
Do not write one page and find-replace the nouns.

### Re-judging previously approved copy

`website-copy-step2.md` was approved before the positioning changed. **Read every line against §3.** Most will
survive. Anything leading on speed, volume or cost, and anything that assigns the reader work, does not. Mark
each **KEEP / REWRITE / CUT** with one line of reasoning.

Same treatment for copy that went into Figma but was never reviewed as prose — the ICP ladder rung descriptors
(~32 frames), the register fold's eight variants, the `/pricing` ladder table and retention fold, the
`/enterprise` house-template block, the `/academic` academic-pricing line. **Joy has read none of it.**

---

## 5 · Visual design — stay inside the existing language

**Do not invent a new visual system.** `website-visual-design-guidelines.md` is binding, and the Figma file
already carries a componentised chrome and a token layer.

- **Type:** Instrument Serif (display, **never below 32px**) · Inter (body/UI) · DM Mono (**numbers only**, never prose)
- **Colour:** `--ink` `#0A0A0A` · `--accent` `#E8453C` **exactly** — not `#EF4444`, not `#FF4444` · dark surfaces `#0C0B09`
- **Components:** reuse and modify what exists. **Clone, never hand-rebuild** — this is a standing instruction from Joy and it has been broken before
- **Chrome:** `Chrome / Nav` and `Chrome / Footer` are components. Use instances; never redraw

New folds inherit the existing spacing scale, alignment philosophy and section rhythm. If a fold genuinely needs
something the system lacks, **propose it as a system addition** rather than a one-off.

---

## 6 · Scope and sequence

**Do not skip to Figma.** Joy approves the copy deck first.

| Step | Work | Gate |
|---|---|---|
| **1** | **Copy deck** — `docs/website-copy-deck.md`. Tier 1 first, complete | **Joy approves** |
| **2** | **Figma** — apply approved copy to the 16 designed pages; design the new ones | Joy reviews |
| **3** | **Freeze Figma** | — |
| **4** | One dev round — pixel-identical build | — |

**Tier 1 — the 16 designed pages.** `/` · `/pricing` · the 8 ICP pages · `/enterprise` · `/security` · `/about` (verify only) · `/privacy` `/terms` `/refund` · 404.

**Tier 2 — new pages, after Tier 1 approval.** **`/alternatives/*` (8 — new, and the highest commercial intent on the site)** · **the `/market-size/*` template + index** · **the 6 permission-layer pieces** · `/samples` **(promoted from Tier 3 — it is the answer to the credibility objection in five of six persona objection tables)** · `/product` · `/data-room` · `/outputs` · `/languages` · `/visuals` · `/use-cases/investment-deal` · `/vs` index · `/roadmap` · insights coming-soon · `/careers` · `/contact`.

**Tier 3 — undesigned live pages.** `/use-cases/*` (6) · `/analyses/*` (3) · **`/vs/*` (9 — rewrite to current positioning and link into nav/footer; the only sanctioned home for the generative contrast)** · `/customers` · `/blog` · `/corporate-dev`.

### Ship with the copy, regardless of tier

- **`1M+` → `25M+`** — wrong in the homepage microcopy and across ICP subheads
- **Delete "Zero hallucinations"** from the homepage microcopy — retired claim
- **Move `From $15`** out of the homepage subhead into microcopy
- **`No credit card` → `No account needed`** in the hero microcopy — see the offer, §3
- **Retire the nav CTA `Start Free →`** and every acquisition-surface CTA that sells an account rather than inviting a question
- **Remove `$100` from acquisition surfaces** — it is the closer at the gate, not the hook
- **Structured data** — `Organization`, `BreadcrumbList`, `Article`/`BlogPosting`, `VideoObject`, `SoftwareApplication`. The site has **zero JSON-LD on any page**. **Do not add `aggregateRating`** to our own pages. `FAQPage` may stay for answer engines but **Google deprecated FAQ rich results on 7 May 2026** — do not justify it on those grounds
- **The 12 orphan pages** — `/market-research`, `/corporate-dev`, `/customers` and nine `/vs/*` are live, in the sitemap, linked from no nav or footer. They are also why the site earns no organic sitelinks
- **CTA parameters** — every outbound CTA carries `utm_*` and `icp_hint`, **and lands on a pre-filled ICP-relevant question**, so the onboarding personalisation and the attribution both work

### From the channel model — added 2026-08-20

[`docs/gtm/channel-model.md`](gtm/channel-model.md) §4. **These are acquisition-channel dependencies, not
nice-to-haves: each one is a channel that cannot run without it.**

- **Programmatic SEO templates and a glossary** — organic search is the only channel that compounds without
  more human hours, and it is the difference between ~85 and ~265 signups a month. It needs job-shaped query
  templates (*"market size of [industry]"*, *"[industry] competitive analysis"*) and a glossary as an
  answer-engine surface. **Meet the ICP at the job, never at the category — nobody searches "analytical AI"**
- **`/samples` holding three real reports** — it is the credibility artefact for communities, for paid, and for
  every founder-outreach message. Community and trade credibility depends on *showing* output, not describing
  it. It is currently Tier 3 and it should not be
- **The nine `/vs/*` pages linked and internally cross-linked** — they are the only sanctioned home for the
  generative contrast and they currently rank for nothing because nothing links to them

### `/alternatives/*` — a new page family. Approved by Joy 2026-08-20

**The reasoning, because it changes how you should think about the whole comparison layer.** Four persona
sets say, unprompted, that the buyer's mental shelf is research databases and not AI tools — *"a research
compilation tool, not an AI product — same category as IBISWorld"* (`icp-personas.md:276`) · *"the same
bracket as Statista or IBISWorld… a market data synthesis tool, not an AI writing product"* (`:556`) ·
*"the same category as IBISWorld or Mintel"* (`:745`).

Six of the nine live `/vs/*` pages already name that shelf. **But the query shape is wrong for where Caspr
is.**

> **Nobody searches "Caspr vs IBISWorld." They have never heard of Caspr.** A `vs` page targets a query that
> only exists once you are already known. The query with volume today is **`IBISWorld alternatives`.**

> ⛔ **CUT TO ONE PAGE, 2026-08-25 — measured, not assumed.** `ibisworld alternatives` has **0 US searches
> a month**; `euromonitor alternatives` **0**; the whole family totals ~490. **And the SERPs are owned
> end-to-end by G2, Slashdot, SourceForge, Craft and Datarade — no vendor page ranks at all.**

**Build one page** covering `pitchbook alternatives` and `statista alternatives` (~300/mo combined).
**The rest of the effort goes to getting Caspr listed on the pages that already rank** — G2, Datarade,
Capterra. See [`docs/seo/decision.md`](seo/decision.md).

**Keep and fix, do not delete, the nine `/vs/*` pages.** Rewrite to current positioning, link them into nav
and footer, and move them out of *"Phase 3 — not launch-critical"* in `pages-for-production.md`.

**The honesty rule from `pages-for-production.md` governs both families and is not negotiable:** state
where Caspr wins *and* where it does not — real-time news, primary research, qualitative fieldwork.
**Do not invent incumbent prices, page counts or publication dates** — that is OD-10 territory (§8), and
inventing a competitor's price on a page whose entire argument is *"we cite"* is the worst available
own goal.

### `/market-size/*` — a generated page family. Approved 2026-08-24

**Not written by a person, and not a tool.** One page per sector–geography intersection, generated from the product's `fact_lookup` — full design in [`content-approach.md`](gtm/content-approach.md) §3B.

**You design the template, not the pages.** Three states, and the second is the one that matters:

| State | Shows |
|---|---|
| **Found, agreed** | The figure · unit · period · basis · publisher · date, source resolvable |
| **Found, disagreeing** | **All credible candidates, side by side. Never averaged, never resolved** |
| **`not_found`** | *"No credible published source gives a market size for this. That is not a gap in our data — it is the reason this analysis has to be built rather than looked up."* |

**The disagreement state is the differentiator.** Every competitor renders one clean averaged number. Showing three that conflict, each attributed, is *"Every source, credible. Every claim, triangulated"* made visible — **design it as the hero of the page, not as an error state.**

**Also needed:** `/market-size` as an index of every generated page — **the internal-linking asset the site currently lacks** — and `Dataset` + `Organization` JSON-LD on results.

**Every result page ends with a real research question about that market, pre-filled, one click into the product**, carrying `icp_hint` and `utm_*`. That CTA is the whole conversion mechanism: **no gate, no email capture, no account ask anywhere on these pages.**

### The permission layer — six evergreen pieces. Approved by Joy 2026-08-20

**The most universal objection in the persona research has no content anywhere on the site.** *"Is this
allowed?"* appears in **all six** objection tables, in six institutional forms: firm AI policy (`:94`),
procurement threshold (`:186`), compliance review (`:276`), agency IT (`:556`), client confidentiality
(`:559`), dissertation supervisor (`:745`).

**Write six** — full rationale and titles in [`docs/gtm/content-approach.md`](gtm/content-approach.md) §10:
what Caspr is in compliance's terms · using output in a client deliverable · citing sources from an
analysis · Caspr for a dissertation · what procurement category Caspr sits in · *is using a research tool
cheating?* (founder-voiced).

**The constraint on all six:** describe what Caspr **is and does** — where inputs go, what is retained, what
is never trained on. **Never interpret the reader's own obligations.** *"Your firm permits this"* is a claim
about their policy, not ours, and it is not ours to make.

**These are what the ICP-page objection folds link to.** Without them those folds either say nothing or
over-claim.

---

## 7 · Facts you may state

Only what is in `site-truth.md` §6:

**The three depths — `$15 · $80 · $300`, names per type** (never write a depth name without its type:
Market Research *Brief/Study/Intelligence* · Investment & Deal *Screen/Thesis/Diligence* · Business Case
*rungs by sub-type* · Academic **$8 / $40**, no third depth) · $300 depth à la carte **$399** ·
milestones **$200 / $600 / $1,800** · minimum budget **$200** · free trial **$100, no card, 90-day expiry** ·
edit credits **15,000 / 80,000 / 300,000** · extra outputs **$5** (PDF/DOCX/XLSX/CSV), **$10** (PPTX), MD free ·
premium data **$20–60** · house template **$1,000, one week** · **25M+** sources · Brief **3–5 pages** ·
Study **~100 pages, 1–2 hrs** · Intelligence **up to 24 hrs**.

**Never:** the 7% platform fee (internal) · **"LAM"** · **"SOC 2 certified"** (only *"SOC 2 Type I audit in
progress"*) · legal advice or the Legal Document type · fieldwork claims. **Synthetic panels are AI-simulated** —
never primary research.

**The ladder is not universal.** Brief/Study/Intelligence is the *Market Research* ladder. Investment & Deal uses
Screen/Thesis/Diligence. Business Case has its own rungs and gaps. `site-truth` §2.

**No tier names without explanation.** *Brief*, *Study*, *Intelligence* are Caspr vocabulary. A first-time reader
has never seen them — say what they get before naming the rung. This was a real error on `/academic`.

---

## 8 · Blocked — do not invent

### The comparison folds — **now partially unblocked**

**Five real comparables are sourced and citable** — [`docs/od-10-results.md`](od-10-results.md), every price
read from the seller's own page on 2026-08-24 with its URL:

| Seller | Single-user price | Pages |
|---|---|---|
| IBISWorld — Industry Spotlight | **US $800** | 10–20 |
| IBISWorld — Industry Research | **US $2,850** | **not published — do not cite one** |
| The Business Research Company | **US $4,490** | 250 |
| Mordor Intelligence | **US $4,750** | 110–120 |
| Statista | ~$700/mo, annual | **no per-report option exists** |

**Against the $80 Study that is 10× to 59×.** Use these. **Cite the URL and the observation date on every one.**

**Three things in that file are stronger than the price table and should shape the copy:**

- **The specificity gap, demonstrated.** Mordor's *Europe Ready Meals* costs **$4,750** and segments across ten
  European countries. The buyer's question — `icp-personas.md:536` — was *premium ready meals in Southeast
  England.* **The report does not answer it.** That is a fact about coverage, never a judgement about quality
- **The price is a list price, not a costing.** Two Mordor reports, different sectors, different depth, published
  fifteen months apart — **identical $4,750**
- **A fifteen-month-old report sells at full price today.** State the publication date. Never the word *stale*

**Still placeholder:** three of the nine buyer contexts — agency strategist, founder TAM, and the graduate
student, whose comparable is **access rather than a purchase** and must not be given a list price.

**The rule is unchanged where a figure is missing: do not invent competitor prices, publication dates or page
counts.** The brand's entire claim is that it cites, and this is the one fold where that claim can be destroyed.

**Testimonials and the TRUSTED BY row** are invented placeholders, in Figma and live. Real ones arrive in 2–3
weeks. Leave as-is; **write no new fictional attributed quotes.** Attributed quotes from named people at named
employers on a public page are a regulated claim in the US, UK and EU.

---

## 9 · Output

**Step 1 deliverable: one file, `docs/website-copy-deck.md`.** Not Figma edits.

Per page, per fold:

```
### [Page] · [Fold name]          KEEP / EDIT / NEW / CUT
Eyebrow:
Headline:
Body:
CTA / microcopy:
Source:   ← the persona line, decision or file that produced this (rule 5)
Note:     ← only where a choice needs explaining or a fact needs sign-off
```

Close the deck with:

1. **The headline list** — every headline on the site, in order, so voice can be judged in one read
2. **Sources opened** — the rule-1 list, naming files and sections
3. **Keep / depart** — what you kept from the live site and Figma, and why; what you departed from, and why
4. **Decisions taken** — anywhere you chose between defensible options
5. **Flags** — anything you could not write without a fact, a decision or a sign-off

**Do not edit Figma. Do not touch the live site.** The deck is the deliverable, and Joy approves it before
anything moves.

---

## 10 · How this will be judged

- **Can every headline be traced to a source?** If not, it is invented and must say so.
- **Do the eight ICP pages read as eight different people's problems**, or one problem with the nouns swapped?
- **Read the headline list end to end.** Does it sound like one writer with a point of view, or a template?
- **Does anything ask the reader to do work?** If so, rewrite it.
- **Does anything name a competitor above the fold?** If so, cut it.
- **Is any number unmatched to `site-truth` §6?** If so, it does not ship.
