# Website updates from the product build — 2026-08-22

What changed in the core files since the copy deck was written, what it breaks, and what I propose.
**Proposal only — nothing executed.**

**Files read for this pass:** `docs/product/phase-map.md` **(new, 21 Aug)** · `docs/product/ai-disclosure-spec.md`
**(new, 21 Aug)** · `.agents/pricing-model.md` §14 (21 Aug) · `.agents/product-marketing-context.md`
(**22 Aug — newest file in the repo**) · `docs/product/document-taxonomy.md` Facet 3 (21 Aug) ·
`docs/product/gate-output-spec.md` §5 (21 Aug).

**Good news first:** the **ladder is unchanged**. `document-taxonomy.md` Facet 3 still reads Market Research
Brief/Study/Intelligence · Investment & Deal Screen/Thesis/Diligence · Academic $8/$40. Everything built into
Figma on the ladder blocks and the `/pricing` ladder table stands.

---

# 1 · The big one — **features are gated by milestone, and the site has never said so**

`product-marketing-context.md` now carries a **Feature Tier Gates** table that does not appear anywhere on the
website. It changes what we may claim on almost every page.

| Feature | Free trial | Professional $200 | Business $600 | Enterprise $1,800 |
|---|---|---|---|---|
| Brief · Study | ✓ | ✓ | ✓ | ✓ |
| **Intelligence** | — | **—** | ✓ | ✓ |
| **PDF** | ✓ | ✓ | ✓ | ✓ |
| **PPTX · Word · Infographic** | — | **—** | ✓ | ✓ |
| **English only** | ✓ | **✓ English only** | — | — |
| **All languages** | — | **—** | ✓ | ✓ |
| Private data upload | — | — | ✓ | ✓ |
| Custom template | — | — | may purchase | first included |

### What this breaks

**1.1 · The multilingual story is wrong as written.** *"Written in your language. Not translated into it."*
is on the homepage and implies universality. **Languages are a Business unlock.** A Professional or free-trial
user gets English only. As written, the fold promises something two-thirds of the plan ladder cannot do.

**1.2 · The inclusion line conflates two different things.** *"Your language. Included. Every format your tier
delivers…"* — I wrote **tier** meaning Brief/Study/Intelligence. Formats are gated by **milestone**, not by
analysis depth. A Professional user running a Study gets **PDF only**, not the PPTX the copy implies.

**1.3 · "Boardroom-ready PDF or editable PPTX" is Business-and-above.** That phrase is in the homepage How It
Works, the ICP output showcase, and most ICP subheads. For a Professional user it is not true.

**1.4 · The free trial's limits are never stated.** *"First $100 on Caspr"* appears on every page. The trial is
**Brief and Study only, English only, Caspr template only**. A trial user cannot run the Intelligence the
`/pricing` page sells them.

### Proposed

- **Rewrite the inclusion line** to name the milestone, not the analysis tier:
  > **Every format, in your language.** PDF on every plan. PPTX, Word and infographics from Business. All
  > languages from Business.
- **Add a gating column to the `/pricing` plan cards** — the site currently sells three budget levels with no
  statement of what each unlocks beyond Intelligence and data upload.
- **Qualify the multilingual fold** — keep the differentiator (native, not translated), add one line:
  *"Available from the Business milestone."* The claim survives; the promise becomes true.
- **State the trial's shape** in the `/pricing` FAQ: what $100 buys, and that it runs Brief and Study in English.

---

# 2 · Custom template — **must not be presented as available**

`product-marketing-context.md` is explicit: *"Phase 1.5 — not live at launch, and must not be presented as
available."* The `/enterprise` block I built this session says *"$1,000 one-time, one week"* as a live offer.
**That block is wrong on four counts.**

| | Built in Figma | Correct |
|---|---|---|
| Price | $1,000 one-time | **$1,000 per template · three for $2,500** |
| Who | Enterprise only | **Business and above may purchase · Enterprise includes the first** |
| When | presented as live | **Phase 1.5 — not at launch** |
| Timing claim | "one week" | **2-hour response to enquiry**, 24/7. Setup turnaround is not stated in the specs |

**And there is a genuine asset here I did not have before.** The 2-hour response is locked, unqualified, round
the clock, and `product-marketing-context.md` calls it *"a positioning asset… worth stating plainly in the
commercial proposal, in sales conversations, and on the site."* A design agency replies in days.

**Proposed:** keep the block on `/enterprise`, reframed as an enquiry rather than a product —
> **Coming with your own brand on it.** Your deck master and document styling, mapped onto Caspr's report
> structure once and applied to every report after. $1,000 per template, three for $2,500. Enterprise includes
> the first. **Every enquiry answered within two hours, any hour.**

⚠ **Needs your call:** does a Phase 1.5 item belong on the site at all before it ships? My view is yes as an
enquiry — it qualifies Enterprise leads, which `phase-map.md` says is its real job — but "must not be presented
as available" is a line I will not interpret on my own.

---

# 3 · `/ai-disclosure` — a new page, legally required, already in force

`ai-disclosure-spec.md` (new, 21 Aug). **EU AI Act Article 50 has been in force since 2 August 2026.**

- **Article 50(1)** — the spec argues Caspr sits inside the "obvious to a reasonable person" exemption, and
  cites **our marketing site as part of that argument**: the category stated as Analytical AI, and the homepage
  H1 *"Not an assistant. An analyst."* The hero we built this week is load-bearing for a compliance position.
- The mitigation is **a short `/ai-disclosure` page** plus a persistent footer link — no banner, no modal.
- **Article 50(2)** is the one with teeth and it is an export-pipeline concern, not a website one.

**Proposed:**
- **New page `/ai-disclosure`** — what Caspr is, how an analysis is sourced, weighed and concluded, that outputs are
  generated and cited, where sources come from. Short, plain, no marketing register.
- **Footer link** in Trust & Legal: `Security · Privacy · Terms · AI disclosure · GDPR · Refund Policy`
- **Do not** add a banner or interstitial. The spec is explicit that it would damage the first-run experience,
  which is where activation already fails.

---

# 4 · Smaller corrections

| | Change | Where it lands |
|---|---|---|
| **4.1** | **Edit-credit overflow is now answerable.** Overflow draws the same Research Budget balance — **~1,000 credits ≈ $1, no separate pool**. One wallet, one number | The edit-credit FAQ, which currently stops at the allowance and says nothing about exceeding it |
| **4.2** | **Top-ups are one mechanism** for analyses, outputs and edits — tier-default **$20 / $50 / $100**, adjustable in $10 steps | `/pricing` FAQ. Currently unmentioned anywhere |
| **4.3** | **Infographics are a named output**, gated to Business+ | The output list, wherever formats are named |
| **4.4** | **Caspr Signals** — 1 topic Professional · 3 Business · **Unlimited Enterprise** | The plan cards already say 1 and 3; Enterprise "unlimited" is new |
| **4.5** | **Projects** is an Enterprise-only feature | `/enterprise` — currently absent from the site |

---

# 5 · Contradictions I will not resolve on my own

These are places where two current core files disagree. Per the working standard, I stop and flag rather than pick.

| # | The conflict | Why it matters |
|---|---|---|
| **C-1** | **Is Intelligence live at launch?** `product-marketing-context.md` (22 Aug) sells it — Business+, $300/$399, "designed specifically for due diligence depth". But `phase-map.md` (21 Aug), `architecture-alignment-v4.md` and `app-shell-framework.md` all list **"Intelligence depth" as Phase 2**, a *coming-soon placeholder in the UI*. The website sells Intelligence on the homepage, `/pricing`, all 8 ICP ladders, the nav dropdown, a dedicated `/analyses/intelligence` page and the footer. **If it is not available at launch, that is the single largest copy exposure on the site.** My reading is that "Intelligence depth" means a deeper capability rather than the $300 rung — but I am not confident, and the cost of being wrong is high |
| **C-2** | **Does Business "All languages" mean free, or just unlocked?** The milestone table says Business includes *All languages*. `pricing-model.md` §4.6-B still charges **$5–10 per output per additional language**. Unlocked-but-charged and included-free are very different pages |
| **C-3** | **Brief length.** `product-marketing-context.md` says **1–3 pages**; `site-truth.md` §6 and `gate-output-spec.md` say **3–5**. I corrected the site to 3–5 this week. One of the two files is wrong |

---

# 6 · Proposed sequence

1. **Rule on C-1.** Everything else is small; this one determines whether eight ICP ladder blocks and the whole `/pricing` page are selling something available.
2. **Milestone gating (§1)** — the largest true copy change. It affects the homepage, `/pricing`, all 8 ICP pages and the multilingual fold.
3. **Custom template reframe (§2)** — one fold, already built wrong, quick to fix once you rule on placement.
4. **`/ai-disclosure` (§3)** — new page plus a footer link. Legally in force now, and cheap.
5. **§4 corrections** — fold into the next `/pricing` pass.

**Not affected, and worth saying:** the eight ICP heroes, the eight problem folds, the What Arrives folds, the
ladder blocks and the ladder table are all still correct. Nothing in this pass touches the work built this week
except the `/enterprise` template block and the multilingual/inclusion lines.

---

# 7 · Build log — 2026-08-22

Everything below is **built in Figma**. The live website has not been touched, per the Figma-first sequence.

### Ladder rung descriptors — the one REWRITE verdict in the copy deck

Applied to all 7 ICP pages carrying ladder blocks (`/consulting` `/strategy` `/investors` `/agencies`
`/startups` `/category-managers` `/market-research`). Rungs now explain before they name —
*"Screen — is this worth a second meeting"*, *"Thesis — the view you take to IC"*,
*"Diligence — deal-grade, with the market around your data room"*. `/academic` has no rung row by design.

### Homepage

| Was | Now |
|---|---|
| *"The $50,000 question. From $15."* | **"One budget. Three depths of answer."** — the anchor was doing damage, not work (`site-truth.md` §1.3) |
| *"The same analysis costs $50,000 from a consulting firm…"* | Research Budget mechanics: set a ceiling, unused balance carries forward |
| Engine stat *"Zero / hallucinations"* | **"Every figure / attributed to a named source"** — the retired claim is gone |
| Engine *"1M+"* sources | **25M+** — matched to the canonical number |
| How It Works had no support line | *"15 minutes. 100 pages. Cited to source."* lands here, demoted from hero per the tiering |

### Milestone gating — §1, the largest true copy change

The site never stated that **formats and languages are gated by plan, not by analysis depth**. Now it does:

- **Plan cards** (`/pricing`, both breakpoints) — Professional gains *"PDF and Markdown output — English only"*;
  Business gains *"All output formats"* and *"All languages — generated natively"*; Enterprise gains
  **Projects** and **Caspr Signals — unlimited topics**, both previously absent from the site (§4.4, §4.5)
- **Professional's Study bullet** said *"100-page PDF or PPTX"* — it cannot. Now *"100-page analysis"*
- **Inclusion line** rewritten to name the milestone rather than the tier — this was §1.2's conflation
- **Formats FAQ** rewritten: *"Output formats are set by your plan, not by the analysis"*
- **Free-trial FAQ** now states the trial's shape — Briefs and Studies, English, PDF and Markdown (§1.4)
- **Multilingual fold** keeps the differentiator and adds *"Available on the Business plan and above"* (§1.1)
- **Homepage pricing cards** dropped *"in your language"* from the format lists, with the gating stated once
  beneath the row instead

### `/enterprise` custom template — was wrong on all four counts (§2)

Now: **$1,000 per template, three for $2,500 · Enterprise includes the first · every enquiry answered within
two hours, any hour.** The agency comparison is stated out loud, which `phase-map.md` is explicit about —
without it a low price reads as low value. Eyebrow changed from `OPTIONAL` to `YOUR OWN TEMPLATE`, since
Enterprise includes the first. **Presented as available** per your ruling that Phase 1.5 is launch scope.

### `/ai-disclosure` — new page, desktop and mobile (§3)

Nine sections, plain register, no marketing voice: what Caspr is · how an analysis is produced (**sourced, weighed, concluded** — and that a human is not in the loop) · where sources come from · how outputs are marked, visible
and machine-readable · what Caspr does **not** mark (your Data Room uploads) · limits · zero training · contact.
Built on the Refund Policy shell so it inherits the legal-page register, and it reuses the contact address
already published there rather than inventing one. Lives on the legal page, now renamed
`⚖ /privacy · /terms · /refund · /ai-disclosure`.

**Footer link added to both chrome components** — so it propagated to all 34 frames in one edit. No banner,
no modal, exactly as the spec requires.

### `/security` — I was wrong about this one

I recorded it as blocked, on the grounds that the desktop frame was a stale ICP clone. **The content is
correct and complete** — certifications, data architecture, zero-training, retention, objection handling and
a five-question FAQ all present and matching mobile. Only the **fold names** were ICP leftovers
(`03 Pain Points`, `04 Solution`, `05 Pricing Strip`). Renamed to match mobile; one divergent Zero-Training
sentence aligned to the better mobile wording. Nothing was rebuilt.

### Phase 2 "coming soon" — nothing to do

Swept the whole file for Insights, Updates / What Changed, and Connect-a-source. **None of them appear
anywhere on the website** — all 95 matches were *"every insight cited"* or *"data sources"*. There is nothing
to flag. The only Phase-2 exposure is C-1 below.

---

## Still open after this pass

| | |
|---|---|
| **C-1 — the one blocker** | **Is Intelligence live at launch?** Unchanged and still unresolved. `phase-map.md` lists *"Intelligence depth"* under Phase 2; `product-marketing-context.md` sells the $300 rung throughout. Your instruction was that Phase 2 items get flagged *coming soon* — applied literally to Intelligence, that would gut the $300 rung on the homepage, `/pricing`, all 8 ICP ladders, the nav dropdown and the footer. I have **not** touched it. My reading remains that *"Intelligence depth"* names a deeper capability rather than the $300 rung, but the cost of being wrong is the largest on the site |
| **C-2** | Business *"All languages"* — included free, or unlocked but still $5–10 per output per language? The plan card now says *"All languages — generated natively"*, which reads as included. `pricing-model.md` §4.6-B still charges |
| **C-3** | Brief length — 1–3 pages (`product-marketing-context.md`) vs 3–5 (`site-truth.md`, `gate-output-spec.md`). Site says 3–5 |
| **Projects contradiction** | `product-marketing-context.md` line 167 upgrade trigger says Projects is *"available on Business"*; the feature tables at lines 190 and 219 say **Enterprise only**. I built to the tables |
| **`/security` hero** | Carries a meta line *and* a trust-chip row saying nearly the same thing (`ISO 27001:2022 · GDPR · SOC 2…` then three chips repeating it). Redundant, but deleting published proof points is your call, not mine |
| **OD-10** | ✅ **Closed on figures 2026-08-25** — [`od-10-results.md`](od-10-results.md). Seven priced comparables across four sellers, plus three institutional access statements for the student context. **No comparison fold is waiting on research any more** |

---

# 8 · The offer change — built 2026-08-24

**Driver:** the GTM rework of 2026-08-24. Read for this pass: [`channel-model.md`](gtm/channel-model.md) §4
(rewritten 16:12) · [`site-truth.md`](site-truth.md) §1.0 (16:00) · [`gtm-strategy.md`](../.agents/gtm-strategy.md)
§11–13 (15:36) · [`website-session-prompt.md`](website-session-prompt.md) §6 (16:15) ·
[`icp-copy.md`](../.agents/icp-copy.md) v3 for ICP register.

**This contradicted work built earlier the same day.** The milestone-gating pass wrote *"Your first $100 is on
Caspr — no credit card"* into homepage microcopy hours before reading a strategy that moves the $100 off
acquisition surfaces entirely. That line is now gone. Worth noting as the cost of building before reading.

### The structural change

The $100 moved from **hook** to **closer**, and the primary CTA everywhere stopped selling an account.

| | Was | Now |
|---|---|---|
| Nav | *"Start Free →"* ×38 | **"Ask a question →"** — one component edit, 38 frames |
| Homepage hero microcopy | *"No credit card · 25M+ · From $15"* | **"No account needed · 25M+ curated sources"** — the bigger claim, and cost is the third act |
| Primary buttons | *"Start Free — first $100 on Caspr"* ×40 | Eight distinct ICP CTAs, below |
| Final CTA headline | *"Your first $100. On us."* | **"Arrive certain."** — the locked promise |
| Final CTA body | — | The offer as `site-truth` §1.0 states it: *ask a real question, answer the two it asks back, see the analysis it plans* |
| Eyebrow | *"START FOR FREE"* | **"USE IT FIRST"** |

### The eight ICP CTAs — traceable, per rule 5

| Page | CTA | Origin |
|---|---|---|
| `/consulting` | **Ask for the landscape →** | `icp-copy` :39 *"hands you the landscape"* |
| `/strategy` | **Ask for the analysis you need →** | `icp-personas` :159 *"I have the judgment to know what analysis I need"* |
| `/investors` | **Ask about a target →** | `icp-copy` :89 *"a quick screen, a full thesis, or deal-grade diligence"* |
| `/agencies` | **Ask about your client's industry →** | `icp-copy` :111 *"Know your client's industry better than they do"* |
| `/startups` | **Ask for your market size →** | `icp-personas` :431 *"stuck on this slide for two weeks"* |
| `/category-managers` | **Ask about your category →** | `icp-personas` :640 *"premium meal kits in the UK specifically"* |
| `/market-research` | **Ask for the context layer →** | `icp-copy` :165 *"the pre-fieldwork context layer"* |
| `/academic` | **Ask about the industry →** | `icp-personas` :723 *"an industry primer for five sectors"* |

**The approved CTAs in `icp-copy.md` v3 did not survive re-judging.** All eight led on *free* — written hours
before the offer locked. Re-judged per §4 of the session prompt, not overridden casually.

### Where the $100 now lives — your call, applied

Three surfaces, all **after** the product has been shown, none before:

1. **The product showcase** — `04c Output Showcase` caption on all eight ICP pages, and `07 What Arrives` on
   the homepage. Your instruction: *"most importantly it should be present on the product showcase before we
   are asking the user to signup."* `/academic` correctly reads **$150**
2. **`/pricing`** — plan cards and the free-trial FAQ, where a buyer is evaluating and `site-truth` §6 lists it
   as canonical
3. **`06b Objection Handling`** on every ICP page — the risk reversal, per `gtm-strategy` §12 part 3

Everything else — nav, heroes, pricing strips, final CTAs, `/about`, `/security`, 404, the button component —
is clear of it. **Sweep confirms zero remaining instances of "Start Free" anywhere in the file.**

### Also closed this pass

- **Two more retired claims found and killed** — *"0 / Hallucinations"* on the mobile What Arrives stat row,
  and *"Zero hallucinations by design"* on `/about` (both breakpoints). Now *"Every figure / attributed to a
  named source"*
- **The 12 orphan pages, linked** (`channel-model` §4, a 3.1 organic-search dependency) — `/market-research`
  and `/corporate-dev` added to footer **Solutions**, `/customers` to **Company**, and a **Compare** link to
  the `/vs` index under **Product**. Both footer components, so all 34 frames. The nine `/vs/*` pages
  cross-link from the index rather than getting nine footer rows — five fixed columns leave no room for a
  sixth, and the `/vs` index is already Tier 2 scope

### Two repairs worth recording

- A microcopy rule over-matched and overwrote `/strategy`'s comparison line. **Reconstructed** as *"A business
  case that used to take $150,000 and six weeks. Caspr: two hours and $80."* — the tail is inferred from
  `site-truth` §6 (Study $80, 1–2 hrs), not recovered. **Check it reads as you wrote it**
- The showcase credit first landed *inside* the video-player mock on all eight ICP pages, and then on the
  serif headline on mobile. Both backed out; it now sits on the caption line

### Still not done — needs dev, not Figma

| | |
|---|---|
| **`icp_hint` + `utm_*` on every CTA** | `channel-model` §4 calls this the requirement that makes the whole thing work, and it is a link-parameter spec, not copy. **Every CTA must land on a pre-filled, ICP-relevant question.** Needs writing into the dev round |
| **Structured data** | Zero JSON-LD on any page. `Organization`, `BreadcrumbList`, `Article`, `VideoObject`, `SoftwareApplication`. No `aggregateRating` on our own pages |
| **`/samples` with three real reports** | Now a **proof gate** — `gtm-strategy` §11 blocks all paid spend until it exists. It is still Tier 3 and `channel-model` §3.3 says it should not be |
| **Programmatic templates + glossary** | Tier 2 build, and the single largest swing factor in the channel model (~85 vs ~265 signups a month) |
