# Website Work Plan — Aug 2026

Follows [`figma-vs-live-diff.md`](figma-vs-live-diff.md).

**Approach (Joy, this session): Figma-first. The live website is NOT to be touched until the end.**
1. Fix the regression in Figma — correct the stale frames so Figma is accurate again
2. Update the existing 16 page designs (product-truth edits, Part 2)
3. Design the new pages in Figma (Part 3)
4. **Freeze Figma as absolute truth**
5. One dev round — build a pixel-identical version of the frozen Figma

**No live-site edits in the meantime** — including the Tier 0 items in §3. They are recorded there so they get
picked up in the dev round; the only one worth starting early is generating the three real sample reports, because
that is product work, not website work.

**Decided:** ICP hero → security micro-copy, stat row dropped · secondary CTA → bare text link (retire the
bordered `Button / Secondary` from `921:2`) · FAQ → keep the accordion, add `FAQPage` JSON-LD (see §1.6).

## Progress — step 1 in flight

**Done in Figma:**
- **Componentised the chrome.** The file had *zero* components; nav and footer were duplicated frames 34× each.
  Created `🧩 Chrome Components` (`1130:2`) holding `Chrome / Nav / Desktop`, `Chrome / Footer / Desktop`,
  `Chrome / Nav / Mobile`, `Chrome / Footer / Mobile`, plus `Chrome / Wordmark / Ink` and `… / Paper`.
  All **68** duplicated frames swapped for instances across all 15 page frames — zero height deltas, zero leftovers.
- **#22 Wordmark** — Instrument Serif outlined wordmark with the true-circle red dot, imported from
  `assets/logo/`, stroke flattened into the outline so it scales, ink and paper variants.
- **#25 Copyright** → "© 2026 Caspr Holding Pte Ltd. All rights reserved."
- **#26 Tagline** → "…for business analysis, not conversation." (+ fixed the resulting 8px overlap with the
  social icons in the fixed-position desktop footer).
- **#29 Footer links** — added Sample Reports · Category Managers · Academic · Investment Thesis · RFP Response
  and the right-aligned "Caspr means Business.", desktop and mobile.

- **#23 Academic pricing (desktop)** — the approved `PROPOSAL · Academic Pricing v2` content is now the
  `05 Pricing Strip` on `🖥 Desktop — Academic`, rebuilt on the 1440 grid (120px gutter, heading left, cards
  centred). Section 380 → 890. The old horizontal strip carried a `SPACE_BETWEEN` auto-layout that had to be
  repacked. **Approval label dropped.**

- **#23 Academic pricing (mobile)** — `📱 Mobile — Academic` → `05 Pricing Strip` (`490:49`) rebuilt: the stale
  3-block strip ($8/$40/$300), the standalone "Start with $150 free. No credit card." line and the trailing CTA
  frame all removed; the two approved cards cloned from desktop and stacked at 350 wide, 24px gap. Section
  846 → 1406.
- **#23 deltas (both approved, both applied desktop + mobile)** — second headline line *"Cited to source.
  Defensible in front of any judge."* and the centred footnote *"Intelligence analyses are available on a
  standard account."*

- **#31 Sample-report link** — `See a sample report →` added to the final CTA on all 8 ICP pages, desktop and
  mobile (16 frames), **stacked below the button and centred** per the designed final-CTA pattern (#10), not
  inline as live has it.
- **#34 Favicon** — `FAVICON` artboards at 512 / 180 / 32 on `🎨 Component States`, built from the exact `C.`
  monogram path in `caspr-web/lib/iconMark.ts`, stroke flattened so it holds at 16px.
- **Secondary CTA retired** — `Button / Secondary / Default|Hover` on `921:2` are now
  `Link / Secondary / Default|Hover`: border and fill removed, Inter **Medium** 14, default `--text-secondary`,
  hover `--text-primary` — matching both the page frames and the build.
- **#24 DM Mono** — measured before changing. Figma already used DM Mono in 247 places; live's rule is
  *standalone metric tokens are mono, prose containing numbers stays Inter*. Applied to the 13 evidenced
  mismatches: homepage hero proof rows (desktop + mobile), homepage mobile analysis meta rows, and the
  `/pricing` analysis meta labels (desktop + mobile). Meta labels set to **11px** to match live and the homepage
  cards, and the separator rhythm tightened 16 → 14 so the widest rows clear their card.

### Step 1 is complete

All five §1.1 corrections and all applicable §1.2 additions are in. #30 was dropped by decision, #28 needed no
work (the dropdowns were already designed on `921:2`), and #33 — the ~22 live routes with no Figma design — is
step 3 work, not regression work.

**Deliberately left alone in the mono sweep, for review rather than assumption:** the output-showcase captions
(`146 pages · 15 minutes · Every insight cited to source`), the Trust Strip line, and every prose string that
merely contains a number. Live renders all of these in Inter.

### Step 2 executed — copy approved and taken into the designs

Copy source: [`website-copy-step2.md`](website-copy-step2.md). Screens and folds changed are listed there under
"What changed, by screen". Five items need your eye on review — the dropped "Zero hallucinations" claim, the
multilingual section's placement, the merged inclusion line, a desktop/mobile FAQ copy divergence that predates
this work, and one claim in my earlier notes that turned out to be wrong.

## 1.6 FAQ — accordion stays, add structured data

Checked against the live pages: the answer text **is** in the server-rendered HTML inside every `<details>`,
with no `hidden` attribute, so HTML-parsing crawlers see it and Google weights accordion content fully.
The narrow risk is extractors that read *rendered visible* text — demonstrated in this session, where an
`innerText` read of the `/pricing` FAQ returned six questions, six `+` glyphs and no answers.

The bigger gap: **the site has no structured data of any kind, on any page.** No `FAQPage`, no
`SoftwareApplication`, no `Organization`. Adding `FAQPage` JSON-LD makes the open-vs-closed question moot and is
what actually drives FAQ rich results and clean question→answer pairing for answer engines. Added to Tier 0.

Consequence: the 21 Category-1 findings need **no separate dev tickets**. Figma is already right on all of them;
the rebuild fixes them by definition. They are listed in §1.3 only as the record of what the rebuild will change.

---

# 1 · Getting Figma accurate

## 1.1 Corrections — Figma is stale, live is right (5)

These are the Category-2 rows. Change Figma to match the live site.

| # | Where | Change |
|---|---|---|
| 22 | Nav + footer, **every page** (16 desktop + 16 mobile frames) | Replace the Source Serif `Caspr.` wordmark with the current Instrument Serif wordmark — outlined, baked bold, true-circle red dot. Master in `assets/logo/`. Place as a **component instance**, not redrawn per frame |
| 23 | `🎓 /academic` → `05 Pricing Strip` (`402:84`) | Promote the approved `PROPOSAL · Academic Pricing v2` (`1110:2`) into the main frame. Replaces the stale 3-block $8/$40/$300 strip with the shipped 2-card academic-rate treatment |
| 24 | Proof rows, meta rows, stat numerals, all pages | Inter → **DM Mono** (`--font-mono`), matching the live token set |
| 25 | Footer, every page | `© 2026 Caspr.ai · All rights reserved.` → `© 2026 Caspr Holding Pte Ltd. All rights reserved.` |
| 26 | Footer, every page | Tagline → `Analytical AI — purpose-built for business analysis, not conversation.` |

## 1.2 Additions — built after the freeze, absent from Figma (7)

**These matter more than the corrections.** A pixel-identical rebuild from a Figma that doesn't contain them would
*delete shipped work*. Each needs an explicit keep/drop.

| # | Element | Recommendation |
|---|---|---|
| 28 | Nav dropdowns — Solutions (7), Use Cases (6), Analyses (3 with `$15 · 15 min` sub-labels) + mobile drawer | **Add to Figma.** Without them the nav can't reach 20+ live pages |
| 29 | Footer link additions — Sample Reports, Category Managers, Academic, Investment Thesis, RFP Response; plus the right-aligned `Caspr means Business.` | **Add to Figma** |
| 30 | ICP hero **3-up mono stat row** (`25M+ / <15 min / 100 pages`) | **DROP** — decided. The designed security micro-copy keeps the slot (§1.4) |
| 31 | `See a sample report →` beside the button in the ICP final CTA | **Add to Figma** |
| 32 | `/academic` footnote — "Intelligence analyses are available on a standard account." | **Add to Figma** (comes with the `1110:2` promotion) |
| 33 | ~22 live routes with **no Figma design at all** | **Scope decision — see §1.5** |
| 34 | Favicon — the `C.` monogram | **Add an artboard** so the file is complete |

## 1.3 What the rebuild will fix on its own (21 — no action needed now)

Figma is already correct on all of these; they exist here so nobody re-litigates them during the build.

**Two component mismatches** — the build reused `AnalysisCard` where the design specifies something else:
`/pricing → 04 Analysis Types` should be the numbered editorial card (red serif `01`, inline `$15 · ~15 min ·
1–3 pages`, red dot bullets, **no CTA**), and the **ICP `05 Pricing Strip`** should be a 380px strip with one CTA,
not a 931px three-card grid. Between them these account for 8 pages.

**Buttons** — primary sizes 304×48 / 282–320×52 / 160×40 (live ships one 253×44 everywhere); ghost-on-dark should be
white-filled, not black-on-black. **Markers** — red dot ellipse, not em-dash or grey. **Homepage hero** —
`--text-secondary` not tertiary, H1 line-height 80, stack gaps 24/32/44. **Secondary link** — stacked below the CTA
on the homepage hero and every final CTA. **ICP final-CTA copy** — `GET STARTED`, the $100 line, ICP-specific button
label. **Chrome** — 72px nav, Title Case footer headings. **Section background** — `--surface-0` dark, not `--ink`.
**Plus the one Cat-3 item:** the ICP hero security micro-copy ("Client data never leaves your account. ISO
27001:2022 certified →") is designed but was never built.

**FAQ → open Q&A list (your call, decided).** Figma is already correct — no Figma change; the rebuild replaces the
`<details>` accordions on `/pricing`, all 8 ICP pages and `/security`.

## 1.4 ICP hero — security line keeps the slot (DECIDED)

They occupy the same slot under the CTA row, and you can't have both without the hero growing.

- **Figma** puts the security micro-copy there: *"Client data never leaves your account. ISO 27001:2022 certified →"*
- **Live** puts a 3-up mono stat row there: `25M+ curated sources · <15 min Brief turnaround · 100 pages Study deliverable`

The stats repeat numbers already stated in the headline and subhead. The security line answers the objection that
consulting and investor buyers actually raise, and it's the only inbound link to `/security` from those pages.
**Decided: restore the security line, drop the stat row.**

## 1.5 Freeze scope: 16 pages designed, ~22 pages never designed

Figma has 16 pages. The live site has ~38 routes. These are live, in the sitemap, and have **no Figma design**:

`/market-research` · `/corporate-dev` · `/customers` · `/samples` · `/blog` · `/refund` ·
`/use-cases/*` (6) · `/analyses/*` (3) · `/vs/*` (9)

Per the decided sequence, these fall into step 3 — "design the new pages" — alongside the Tier 1 product pages in
§3. Nothing is rebuilt until they exist in Figma. Order within step 3 is a scheduling call, not a scope call:
the 22 already-built routes need designs that *document and correct* what exists; the Tier 1 pages are net-new.

---

# 2 · Product truth — Figma edits (after §1, before the rebuild)

The Figma was drawn in May. The gate, output, editing and academic models have all been locked since. Twelve gaps.

## 2.1 Edit credits — the landed model (Joy, 2026-08-18)

**Superseded.** The visual-revision quota (Brief 2 · Study 10 · Intelligence 25, `$5` per 10) is retired. The
landed model is **edit credits, included per analysis**:

| Tier | Edit credits |
|---|---|
| Brief | **15,000** |
| Study | **80,000** |
| Intelligence | **300,000** |

**Positioning (decided): a benefit, not a fee.** The headline is *the ability to edit a report after it is
generated*. Treatment:
- **Tier comparison charts** — a row, where a comparison chart exists
- **FAQ** — one entry explaining what an edit credit is and what the allowance buys in practice
- **Nowhere else.** No pricing-table line item, no dedicated page, no mention in hero or card copy

### 2.1a "No hidden fees" — settled: the claim stands (Joy, 2026-08-18)

Extra formats and additional languages **stay charged**. Joy's position: nothing is hidden — the gate itemises
every charge before commitment — and a translation or an out-of-tier format is an additional *service*, not a
concealed fee. **Agreed.** Nothing is disclosed late, and the comparison the line actually makes on the page is
to retainers and per-seat pricing, both of which Caspr genuinely doesn't have. The line does not change.

**The site is under-claiming, not over-claiming.** Per `pricing-model.md` §4.6-B the base is *all formats in the
user's own working language, generated natively in that language — not English-then-translated*. So a French
user's French report is **included**; the charge only applies to a **second** language. That is a far stronger
and more defensible story than the page currently tells, and language is not mentioned anywhere on the site.
The fix is therefore **an inclusion line, not a caveat**:

> Every format — PDF, PPTX, XLSX, CSV, Markdown — in your language. Included.

**Resolved:** "all outputs" means all **committed** outputs — the tier's set. Brief stays PDF + MD; it does not
ship a deck. `gate-output-spec.md` §4 is correct; `pricing-model.md` §4.6-B overstates it and should be
corrected to *"the tier's committed output set, in the user's working language"*.

Consequence for copy: the **format** claim is per-tier and lives on the analysis card; only the **language**
claim is universal and belongs in the headline. Drafts in [`website-copy-step2.md`](website-copy-step2.md).

**Confirmed by Joy:** the edit-credit allowance covers "rewrite every section of a 100-page Study twice over" ·
generation is genuinely native, **except Arabic**, where the translation engine outperforms native generation
and is used deliberately.

**Never use the cost rationale publicly.** "We pay for the APIs" is a sound internal reason and a weak external
one — users don't buy our cost structure. The public rationale is value: a translated 80-page report is a new
work product, not a toggle.

**Placement (proposal, for §2 approval):** inclusion line on `/pricing` and the analysis cards · one FAQ entry
("What costs extra?") covering additional languages, out-of-tier formats and the edit-credit allowance ·
multilingual promoted to a feature in its own right (P1).

**Process (Joy):** these updates get **evaluated → proposed → agreed → then executed in Figma.** Nothing in §2 is
to be built until it has been through that loop. Recorded here as input to the proposal, not as a work order.

**✅ Spec drift resolved (2026-08-18).** `.agents/pricing-model.md` §4.6-A + §14 + §13 have been rewritten from the
retired **2/10/25 revision quota / `$5 per 10`** to the landed **edit-credit model** (Brief 15,000 · Study 80,000 ·
Intelligence 300,000 credits included; no live counter — model `EDIT-ECONOMICS.md`). The
same unify was applied to `visualization-library.md` §6–§7.5 and `design-guidelines.md` (the `↻ x/10` counter is
retired everywhere). `gate-output-spec.md` §2.2/§4 already carry the correct **per-output** model (no quota, no pack).

**✅ Wallet unification (2026-08-18).** Edit overflow draws the **one money balance** (no separate token pool); "buy
more" = the existing **Wallet top-up** (tier-default $20/$50/$100, $10 increments) — one mechanism for analyses +
outputs + edits. Wallet = money, ledger = utilization (edits roll up per report). Figma top-up presets retargeted +
`↻` counter removed. Full build brief: `docs/app-handoff/EDIT-CREDITS-WALLET-DEV-NOTES.md`. These are the documents
Jayant's team builds the gate from — all now consistent ahead of the app handover.

## 2.2 The biggest missed asset: multilingual by default

The product generates **natively in the user's working language** — not English-then-translated — at **no surcharge**.
The website does not mention language anywhere. It is a real differentiator on every `/vs` page, the unlock for
non-English markets with zero product work, and a large programmatic-SEO surface.

## 2.3 The rest

| | Gap | Where it lands | Priority |
|---|---|---|---|
| P1 | **Multilingual by default** — absent entirely | new `/languages`, hero proof row, analysis cards | **High** |
| P2 | **Output formats** (MD·PDF·PPTX·XLSX·CSV base by tier) + per-output pricing | new `/outputs`, `/pricing` | **High** |
| P3 | **`25M+` → `25M+` curated sources** — wrong in ~6 places, in Figma *and* live | site-wide sweep | **High** |
| P4 | **Brief length contradiction** — site says "1–3 pages", product spec says "a 3–5 page note" | analysis cards, `/analyses/brief`, nav sub-label | **High** |
| P5 | **The product is never shown** — the app now exists (conversation → layout → gate → Theater → report); the site still sells a static mock | new `/product`, homepage showcase | **High** |
| P6 | **Premium Data Add-ons** ($20–60, opt-in, priced pre-run) | `/outputs` or `/pricing` | Medium |
| P7 | **Edit credits** — 15k Brief · 80k Study · 300k Intelligence, included. Positioned as *"edit your report after it's generated"* | tier comparison row + one FAQ entry, nowhere else (§2.1) | Medium |
| P8 | **Free-trial mechanics** — $100 is stated, the **90-day expiry** and no-card terms are not | `/pricing` FAQ | Medium |
| P9 | **Minimum Research Budget $200** — implied by the plan cards, never stated | `/pricing` FAQ | Medium |
| P10 | **Data upload, output editing, Ask-Caspr follow-ups** — sold as Business unlocks, never explained or shown | new `/data`, `/product` | Medium |
| P11 | **Intelligence à la carte $399** — only inside a collapsed FAQ | `/analyses/intelligence`, `/pricing` | Medium |
| P12 | **Academic Club, Research Dollars, Share Card** — a whole programme, none of it on the site | new `/academic/clubs` | Medium |
| — | **Re-analysis at 50%** (Brief $8 · Study $40 · Intelligence $150) | hold — Updates is Phase 2 "coming soon" in-app | Defer |

---

# 3 · Pages to design

## Tier 0 — broken promises (not design work; fix regardless of the Figma track)

| | State | Why it's urgent |
|---|---|---|
| **`/samples`** | Three cards, all **"Report coming soon"**. No files | **Every** "See a sample report →" on the site — 20+ CTAs across the homepage, `/pricing` and all 8 ICP pages — lands here. The site's entire secondary conversion path, empty. Needs 3 real generated reports (consulting landscape · investment due diligence · category study). **This one needs you, not dev** |
| **`/careers`** · **`/contact`** | Both 404 | Linked in the footer on every page. Enterprise and press have no route in |
| **`/blog`** | Stub | Linked in the primary nav on every page. The 5 seed posts are specified in `pages-for-production.md` |
| **Orphans** | `/market-research`, `/corporate-dev`, `/customers`, 9 × `/vs/*` | Live, in the sitemap, linked from no nav or footer. 12 pages with zero internal link equity; `/corporate-dev` is a full 8th ICP page nobody can reach |
| **No structured data** | Zero JSON-LD on any page — no `FAQPage`, `SoftwareApplication`, `Organization`, `BreadcrumbList` | The cheapest AI-search and rich-result win available, and the reason the FAQ accordion question stops mattering (§1.6) |
| **Small** | `/privacy` has no `#gdpr` anchor (footer link lands silently at the top) · `/refund` missing from `sitemap.ts` · Trust Strip renders on `/` and `/pricing` but not on the ICP pages | |

## Tier 1 — the product launch set (design in Figma alongside the app)

| Page | Purpose |
|---|---|
| **`/product`** | The app, shown. Conversation → layout → gate → Theater → report. The page the site has never had |
| **`/outputs`** | Every format, any language. Base by tier, per-output pricing, revision allowance. Carries P2/P6/P7 |
| **`/languages`** | Multilingual by default. Differentiator page + programmatic SEO seed |
| **`/data`** | Upload your own documents; data room; isolation and deletion. Pairs with `/security` |
| **`/signals`** | Caspr Signals + Monthly Brief — retention features already sold on the plan cards |
| **`/api`** | Enterprise API access. Procurement asks for it by name |
| **`/changelog`** | Ships the day the app does; feeds the in-app "Caspr update" engagement card |
| **`/status`** | Uptime. Enterprise procurement expects it |

## Tier 2 — trust & procurement

`/dpa` · `/cookies` · `/subprocessors` · `/gdpr` (standalone, replacing the dead anchor) · expand `/security` with
the two-tier data architecture and deletion-certificate process from `security-posture.md`.

## Tier 3 — growth

`/academic/clubs` + `/academic/research-dollars` · blog posts 6–20 · programmatic SEO templates
(`[industry] market research report`, `market size of [industry]`, `business case for [X] in [country]`) ·
`/glossary` (AI-search surface) · more `/vs/*`.

## One thing to settle before the app ships

Every CTA points at `https://caspr.ai/signup`. Per `onboarding-understanding.md`, **signup is now the live tool** —
the user prompts first and hits the gate at the value moment. The website's job at that seam changes from "send them
to a form" to "hand them into the product with their intent intact." The CTA should carry the ICP/use-case context
as a query param so the app can pre-load the right first prompt.

---

# Sequence

| | Work | Blocked by |
|---|---|---|
| **1** | Figma corrections (§1.1) + additions (§1.2) | — *in progress* |
| **2** | Product-truth edits into the 16 existing designs (§2) | the §2.1 pricing-transparency conversation |
| **3** | Design the new pages (§3 — the 22 undesigned live routes + Tier 1) | — |
| **4** | **Freeze Figma** | — |
| **5** | One dev round — pixel-identical build, Tier 0 fixes folded in | freeze complete |

**The live site is not touched until step 5.** The only thing worth starting now outside Figma is generating the
three real sample reports through the product — `/samples` currently answers 20+ "See a sample report →" CTAs with
"coming soon", and that is product work, not website work.
