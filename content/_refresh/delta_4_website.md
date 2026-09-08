# Delta 4 — Website plan vs. content library

Read: `docs/site-truth.md` (labeled "the reference the website derives from" — treated as primary truth),
`docs/website-proposal-v2.md`, `docs/website-copy-step2.md`, `docs/website-workplan.md`, and
`content/_refresh/current_assumptions.md` (what the 113-card library currently encodes).

---

## CURRENT FACTS

### Site structure / sitemap

- **Figma has 16 designed pages. The live site has ~38 routes** (website-workplan.md §1.5): *"Figma has 16
  pages. The live site has ~38 routes."* ~22 live routes have **no Figma design at all**: `/market-research` ·
  `/corporate-dev` · `/customers` · `/samples` · `/blog` · `/refund` · `/use-cases/*` (6) · `/analyses/*` (3) ·
  `/vs/*` (9).
- **Orphans** — live, in the sitemap, linked from **no nav or footer**: `/market-research`, `/corporate-dev`,
  `/customers`, and all nine `/vs/*` pages (site-truth §3.2, proposal-v2 §1.2). `/corporate-dev` is a full 8th
  ICP page nobody can currently reach.
- **9 ICP pages**: `/consulting` `/strategy` `/investors` `/corporate-dev` `/agencies` `/startups`
  `/category-managers` `/market-research` `/academic`, plus `/pricing`, `/about`, `/security` and homepage among
  the 16 designed.
- **Use-case pages (6 live)**: `/use-cases/market-research` (✓ a deliverable type) · `/use-cases/business-case`
  (✓ a deliverable type) · `/use-cases/due-diligence` (a *tier*, being merged) · `/use-cases/investment-thesis`
  (a *tier* of the same type, being merged into the same page) · `/use-cases/competitive-analysis` (a *sub-type*,
  being demoted to a section) · `/use-cases/rfp-response` (not in the taxonomy at all, but site-truth §3.1 says
  *"Keep the page. Maps to Business Case → sales."*, though formally still open as OD-6).
- **`/blog`** is "linked in the primary nav on every page" but currently a **stub**; 5 seed posts are specified
  in a separate doc (`pages-for-production.md`, not read here).
- **No help-centre page anywhere in the site plan.** The only "Get Help" surface described in any of the four
  docs is app-internal (not mentioned by these docs at all — confirmed absent, not just unmentioned).
- **`/glossary`** appears exactly once, in website-workplan.md's Tier 3 "growth" list, alongside "more `/vs/*`"
  and programmatic SEO templates — named but **not designed, not specced, not built**.
- **`/samples`** — "Three cards, all 'Report coming soon.' No files." (workplan Tier 0) — this is the landing
  spot for 20+ "See a sample report →" CTAs site-wide.

### Positioning / messaging

- **Category frame (site-truth §1.1):** *"Caspr competes with research, not with AI tools."* The LLM comparison
  is confined to one page, `/vs/chatgpt` — *"Raising it anywhere else invites the frame we're trying to avoid."*
- **Three differentiators, in priority order (site-truth §1.2):** (1) Your question, not theirs (2) Today's data
  (3) 15 minutes, not weeks. *"Cost is the fourth argument, not the first."*
- **The anchor is a case study, not a range (site-truth §1.3, Joy-decided):** each use case carries a named,
  cited, dated comparable report vs. a commissioned-study estimate vs. Caspr — not a generic price range.
- **A 4-row comparison band** (Cost / Time / Data / The question — proposal-v2 §1.1) replaces the current
  homepage line *"The $50,000 question. From $15,"* which the proposal calls implausible at a 600× gap.
- **Tier vocabulary is NOT universal (site-truth §2):** five deliverable types share one $15/$80/$300 ladder,
  each with its own rung names — Market Research: Brief/Study/Intelligence; Investment & Deal: Screen/Thesis/
  Diligence; Business Case: no $15 rung, Sales deck/Board paper/Strategic options; Academic: Brief $8/Study $40,
  no Intelligence; Legal: Screen/Review/Deep, **explicitly "not for the website."**
- `/investors` and `/startups` currently mislabel their ladders with Brief/Study/Intelligence — flagged **High
  severity** in proposal-v2 §2.

### Pricing / product claims the site may state (site-truth §6, "the only figures the website may state")

Brief/Study/Intelligence $15/$80/$300 · Intelligence à la carte $399 · Academic Brief/Study $8/$40 · Milestones
Professional $200 / Business $600 / Enterprise $1,800 · minimum Research Budget $200/month · free trial $100
no-card 90-day expiry, **Academic $150** · Enterprise 3 seats $1,674 pooled · edit credits 15,000/80,000/300,000
· extra outputs $5 (PDF/DOCX/XLSX/CSV) / $10 (PPTX) / MD free · premium data add-on $20–60 · **25M+** sources ·
Brief 3–5 pages ~15 min · Study ~100 pages, 1–2 hours · Intelligence up to 24 hours, multi-model · platform fee
7% internal-only · re-analysis 50% (Phase 2, not for the site).

Two of these are explicitly **not yet safe to publish**: the 25M+ source count "needs a statable basis" (§7),
and the entire comparison-band cost/time table is unsourced pending Joy's sign-off (OD-1).

---

## CHANGED vs the library

### Does the site plan include a home for Website-surface content (B/H/J)?

**Confirmed match, no change needed to the surface split itself.** current_assumptions.md states: *"Surface
tag: App / Website / Both. In-app Help = 6 pills above. Website = B, H, J (blog/glossary/use-case)."* This lines
up exactly with what the site plan actually has: ICP pages + `/vs/*` for **B**, ICP + use-case pages for **H**,
and a (currently unbuilt) `/glossary` for **J**. No website help-centre concept exists anywhere in the four site
docs, confirming the library's assumption that "Get Help" is app-only.

**What's changed underneath that split:**

1. **`1M+` → `25M+` sources.** Library states 1M+ throughout the pricing note and the standard report-format
   claim. website-copy-step2.md confirms 25M+ as an already-executed Figma correction across 77 nodes. But
   site-truth §7 still lists the 25M+ figure itself as **"needs a statable basis"** before publishing — treat
   as the new number to adopt, but not yet fully locked.
2. **Report-format claim conflates tiers.** The library's standing line — *"~100-page boardroom-ready PDF or
   editable PPTX, under 15 minutes"* — pairs Study's page count (~100 pages) with Brief's turnaround (~15 min).
   Site-truth §6 splits these by tier: Brief 3–5 pages/~15 min, Study ~100 pages/1–2 hours, Intelligence up to
   24 hours/multi-model. (This same imprecision is in `CLAUDE.md`'s own tagline, so it isn't library-only.)
3. **"Editing = a metered re-generation" is the retired model.** current_assumptions.md describes editing this
   way (2/10/25 revision quota + $5-per-10 top-up). The landed model, confirmed in website-workplan.md §2.1 and
   website-copy-step2.md §3, is **included edit credits** (15,000/80,000/300,000), positioned explicitly as
   *"a benefit, not a fee"* — no metering, no top-up purchase, one FAQ entry, nowhere else. Direct contradiction.
4. **Tier vocabulary presented as universal in the library's pricing section** ("Brief $15 · Study $80 ·
   Intelligence $300") — site-truth §2 is explicit this is the Market Research ladder only. Any H card for
   Investors, Corporate Dev, Strategy, or Startups using this vocabulary is now wrong for that page.
5. **Multilingual is entirely absent from the library** — pricing, product-flow, and voice sections in
   current_assumptions.md never mention language. Site plan ranks it **P1/High** (proposal-v2 §2.3) with full
   drafted copy (website-copy-step2.md §5): headline *"Written in your language. Not translated into it,"* hero
   proof line *"Your language, natively,"* one confirmed exception (Arabic uses translation, deliberately).
6. **Academic-specific free trial ($150) missing.** Library states only "$100 Research Budget," no academic
   variant. Site-truth §6 lists Academic trial as $150.
7. **Minimum Research Budget ($200/month) missing from the library**, same gap flagged on the live site itself
   (workplan P9: "implied by the plan cards, never stated").
8. **Style vs. template — unresolved between the two site docs.** site-truth §4/§5 says output style
   (investor/consulting/academic register) is **"LIVE at launch"** and belongs in the headline anchor argument.
   website-proposal-v2 §3 says *"launch is a single Caspr template... [style] Coming soon. Must not be promised
   as live."* These directly conflict. Recommend treating site-truth.md as authoritative (it self-describes as
   the file everything else derives from) but confirm with Joy before any B copy asserts style selection as a
   live, launch-day capability — the library should not resolve this silently either way.
9. **Testimonials/social proof still placeholder (OD-7, unchanged from what CLAUDE.md already notes):**
   site-truth §7 — *"every testimonial and the TRUSTED BY logo row are placeholders, in Figma and live... Any
   page built on social proof is blocked until real ones exist."* Any library card that implies live customer
   testimonials exist would be a contradiction; none currently observed, but worth a scan.
10. **Synthetic panels / primary research wording rule** — must say "AI-simulated," never implying real
    respondents (site-truth §7, proposal-v2 §5 calls this *"the single highest-risk copy line on the roadmap"*).
    Not addressed in current_assumptions.md; any B/H/J card touching panels or primary research needs this.
11. **Legal Document type is explicitly excluded from the website** ("Nothing on the site" — site-truth §4,
    §3.1) pending a Lawyers ICP and legal sign-off. If any library card references Legal Document as a live
    website use case, it contradicts the site plan outright.

### Messaging/positioning shifts the library's copy must follow

- Lead with the **research-firm anchor and named case studies**, not a generic price range, and never invite
  the ChatGPT/LLM comparison outside `/vs/chatgpt`.
- Cost is the **fourth** argument, never the first, in any differentiator copy.
- Charts/framework infographics and multilingual are **under-sold, headline-worthy** capabilities the library
  should now treat as first-tier differentiators (B), not footnotes.
- "No hidden fees" framing stands but is reframed: extra formats/languages are **services**, not concealed fees
  — gate itemizes everything before commitment (workplan §2.1a).

---

## CONTENT IMPACT

### B (What Makes Caspr Different) — target pages

| B content about | Site home |
|---|---|
| Category frame / "research not AI" | Homepage comparison band, `/vs/chatgpt` |
| The 3 differentiators (your question / today's data / 15 min) | Homepage anchor fold, every ICP page's case-study block |
| Named-comparable case studies | Per use-case/ICP page (site-truth §1.3), homepage high-level version |
| Style (investor/consulting/academic register) | Anchor argument fold — **status disputed, see CHANGED item 8; do not write as settled** |
| Charts & framework infographics | New `/visuals` (not yet built) |
| Multilingual by default | New `/languages` (not yet built) + homepage hero proof line — **entirely absent from the library today** |
| Data Room / upload-your-own-files | New `/data` (not yet built) |
| "Caspr gets to know you" (retention) | `/pricing`, next to the budget explanation — **not in the library at all** |
| Client templates (Enterprise) | `/enterprise` only, quoted not listed — **not in the library at all** |
| Insights dashboards | Possible "coming soon" page, contingent on open decision OD-4 — do not write a firm card yet |
| Connectors (Bloomberg/Refinitiv/S&P/PitchBook) | Named on a roadmap page only, "coming soon" — matches library's existing "Connected = COMING SOON," no change needed |
| Legal Document type | **No page anywhere.** Any B card referencing it is a contradiction — pull it |
| Competitor comparisons | The 9 `/vs/*` pages (Statista, IBISWorld, Euromonitor, Mintel, Gartner, PitchBook, ChatGPT, Perplexity, consulting-firms) — orphaned today, will be linked from the comparison band + a new `/vs` index |

### H (Use Cases by Role) — target pages

- The 9 ICP pages are the home for role-based H cards. Each will show **every deliverable-type ladder that ICP
  actually buys** (site-truth §2.1), not one universal Brief/Study/Intelligence block — H cards for
  `/investors` and `/corporate-dev` must use **Screen/Thesis/Diligence**; H cards for `/startups` must reflect
  the Business Case ladder (pitch, $15/$80 only, no $300 rung).
- `/use-cases/*` pages are the home for deliverable-type H cards, but the URL set is mid-change:
  due-diligence + investment-thesis → merge into `/use-cases/investment-deal`; competitive-analysis → demotes
  to a section of `/use-cases/market-research`; rfp-response → kept, remapped to Business Case → sales.
- **Clear home:** ICP role cards; deliverable-type cards for Market Research and Business Case.
- **Needs remapping:** any H card keyed to the old `/use-cases/due-diligence` or `/use-cases/investment-thesis`
  URLs, or to Competitive Analysis as a standalone page.
- **No home yet, roadmap only:** Academic Club / Research Dollars / Share Card programme (Tier 3,
  `/academic/clubs`) — not in the library.

### J (Glossary) — target page

**No live or designed glossary page exists.** It appears exactly once, in website-workplan.md's Tier 3 list:
*"`/glossary` (AI-search surface)."* No structure, no term list, no placement spec. Every J card in the library
currently has **no confirmed destination** — J cards can be drafted against product truth now, but cannot be
marked "shipped" or URL-mapped until `/glossary` exists in Figma. This is the single biggest structural gap for
Website-surface content.

### A / F (Both-surface) — target pages

- **A (Getting Started):** maps to homepage hero, the new `/product` page ("the app, shown... the page the site
  has never had"), and free-trial mechanics — needs the 90-day expiry, no-card terms, and the **Academic $150**
  trial variant surfaced.
- **F (Pricing & Budget):** `/pricing` is the home — comparison band, restructured Analysis Types (ladder as
  spine with per-type rung names, not three universal cards), FAQ entries for inclusion/what's-included, edit
  credits, and the **$200/month minimum Research Budget** (currently unstated on the live site too).

### NEW website content the site plan implies but the library lacks (one-line briefs)

1. **`/languages` page** — multilingual-by-default: native generation in the user's working language,
   translation used only where it demonstrably outperforms (confirmed exception: Arabic).
2. **`/visuals` page** — charts and business-framework infographics (2×2s, magic-quadrant style, value chains)
   as a headline capability, not a buried detail of "100-page PDF."
3. **`/data` page** — Data Room: upload PDF/XLSX/CSV/DOCX, private-by-default classification, Business-milestone
   unlock; connectors named as coming-soon only.
4. **Per-use-case anchor case study** — for each ICP/use-case page, one real named report + price + publish
   date vs. a commissioned-study estimate vs. Caspr's $80/15-minute answer, cited and dated (site-truth §1.3–1.4).
5. **`/vs` index page** — landing page homing the 9 orphaned comparison pages.
6. **"Caspr gets to know you" retention section on `/pricing`** — the bridge argument from a one-off $80 Study
   to a standing $200/month budget, based on profile-building across runs.
7. **`/product` page** — the app itself, shown: conversation → layout → gate → Theater → report. Currently the
   site has never displayed the product.
8. **`/use-cases/investment-deal`** — merged page replacing due-diligence + investment-thesis, showing the full
   Screen → Thesis → Diligence ladder.
9. **`/enterprise` client-template content** — "Caspr in your house template," $1,000 one-time setup, ~1 week
   turnaround, delivered by the Caspr team; quoted, not listed as a SKU.
10. **`/glossary` page itself** — currently a one-line roadmap mention with no structure; needs to exist before
    any J card can be marked as having a real home.
11. **`/academic/clubs` + `/academic/research-dollars`** — Academic Club, Research Dollars, Share Card
    programme, referenced in Tier 3 growth, entirely absent from the library.
12. **Blog seed posts (5)** — `/blog` is a stub linked in primary nav; seed posts are specified in
    `pages-for-production.md` (not read in this pass) — worth a follow-up check against the library's B/H drafts
    for topic overlap.

### Contradictions to flag (summary)

- Library's "1M+" vs. site's "25M+" (and the 25M+ figure itself is pending sourcing sign-off).
- Library's single "100-page / 15-minute" claim vs. the tier-specific truth (Brief 3–5pp/15min, Study
  ~100pp/1–2hr, Intelligence up to 24hr) — also present in `CLAUDE.md`'s own tagline.
- Library's "editing = a metered re-generation" vs. the landed **included edit-credits** model (no metering).
- Library's universal Brief/Study/Intelligence pricing language vs. site-truth's per-deliverable-type ladder
  names (Screen/Thesis/Diligence for Investment & Deal; Business Case has no universal $15/$300 rungs).
- Missing from the library entirely: multilingual, Academic $150 trial, $200/month minimum budget, client
  templates, "Caspr gets to know you" retention story.
- Site-plan internal conflict (not the library's fault, but will land on the library if unresolved): whether
  output style is live at launch (site-truth) or coming-soon (proposal-v2).
- Legal Document type must not appear as a live website use case anywhere in B/H/J.
