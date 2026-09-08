# Content Library — Change Proposal (Pass 3)

*Prepared 2026-08-18 from a full re-read of the latest specs (pricing-model, gate-output, onboarding, navigation-flow, item-management, account-wallet, notifications, copy-standards, site-truth + website plan, edit-economics, sample-reports, api-spec). Source diffs saved in `content/_refresh/delta_1..5`. This is a PROPOSAL — nothing in the library has been changed yet.*

## Verdict

**The foundation is intact — the skeleton did not move.** Confirmed unchanged: Brief/Study/Intelligence **$15 / $80 / $300** (à la carte $399), budgets **$200 / $600 / $1,800**, the **$100 / 90-day / no-card** trial, the **7% internal fee**, tier-gated output formats, per-output **$5 / $10 / MD-free**, carry-forward, citations-as-red-dots, the Welcome→Layout→Gate→Theater→Report spine, and the "Data Room / Included / Excluded / Connected" taxonomy.

**But the library can't ship as-is.** There are ~9 factual corrections (a couple that would embarrass us), a library-wide voice sweep, ~15 cards needing rewrites, ~18 new help cards, a parallel website-content track, and a set of decisions only you can make. None of it is a teardown; it's a disciplined update.

---

## A. Correct now — factual errors & stale claims (no decision needed)

| # | Fix | Affected cards / assets |
|---|---|---|
| A1 | **"25M+ sources" → "25M+ sources"** (global). *Note: site-truth §7 says 25M+ still "needs a statable basis" — adopt the number, but it isn't publicly locked.* | B-01, B-04, J-glossary, voice brief, functionality context, diagram `b04_data_sources`, concept videos, anywhere "25M+" appears |
| A2 | **Split the "~100 pages / 15 minutes" claim by tier** — it currently pairs Study's page count with Brief's speed. Brief **3–5 pp / ~15 min**; Study **~100 pp / 1–2 hrs**; Intelligence **up to 24 hrs, multi-model**. | The recurring tagline in A-01, A-06, D-02, the voice brief, most report-format mentions (also in CLAUDE.md's tagline — flag) |
| A3 | **Report switcher = Contents · Ask Caspr · Edit · Outputs · Updates.** Versions is **no longer a switcher tab** — it lives behind the report's `⋯` menu. | D-13 (rewrite placement), D-01 (if it lists tabs), + new clarifier card (D-22) |
| A4 | **Tier names are NOT universal.** Brief/Study/Intelligence is the *Market Research* ladder only. Investment & Deal = **Screen / Thesis / Diligence**; Business Case = **Sales deck / Board paper** (no $15 rung); Academic = **Brief $8 / Study $40**. | H-02, H-07, H-08 (investors/corp-dev/startups), J-05, all use-case-page mappings |
| A5 | **Soften the Enterprise "API" claim** — no customer-facing API spec exists (api-spec is backend-only). Mark `[VERIFY]`, don't describe an API that isn't defined. | F-05, G-05 |
| A6 | **Data Room row `☰` menu is gone** → checkbox + selection toolbar (Include · Exclude · Make private/public · Delete), single/multi/select-all. | K-04, K-05, K-06, K-07 + annotated screenshots `k04_file_actions`, `k07_delete`, walkthrough `wv_k03` (visually stale) |
| A7 | **Onboarding gate shows NO price** pre-signup; generation is triggered by confirming **"generate" in chat** (not a button); Theater plays behind the signup wall; wall fires on click-or-~3s. | A-12 (factual error: "confirm scope and price"), A-02, A-04 (sequence) |
| **A8** | **The `Voice Cheat Sheet` tab lists RETIRED copy under “APPROVED LINES (reuse verbatim where they fit)”.** *“Stop Googling. Start analyzing.”* and *“Your competitors are still waiting for the research.”* are **retired**; *“15 minutes. 100 pages. Cited to source.”* and *“The $200,000 question. For $80.”* are **demoted — supporting only, never a hero**; *“While the world was building generative AI…”* is **category-education only** (`CLAUDE.md`, tiered copy list). Its `KEY FACTS (never contradict)` block also states **“Zero hallucinations”**, a retired claim. **This is the file most likely to be opened by someone writing at speed, and it currently tells them to reuse retired positioning verbatim.** | `Voice Cheat Sheet` tab — and **excluded from the GTM engine's truth layer until reconciled** (`docs/gtm/content-engine.md` §1.1) |
| **A9** | **Every `Pillar` value across all 114 cards uses the retired numbering.** The 2026-08-20 reorder makes them wrong — `B-01 Analytical AI vs Generative AI` is tagged pillar 4, which is now *A Fraction of the Cost*. The old order was `1 Weeks-to-Minutes · 2 Analyst-Grade · 3 Fraction-of-Cost · 4 Analytical AI`, so the remap is mechanical — **but nothing should read the column until it has run** | `Answer Cards` → `Pillar`, all rows |

---

## B. Voice / terminology sweep — copy-standards.md (library-wide, mechanical)

Run one pass across all 113 answers:
- **"plan" → "budget"** everywhere (including our own category-F framing).
- **Capitalize** Data Room · Research Budget · Brief · Study · Intelligence.
- **Currency:** exact balances two decimals (`$186.00`); marketing/price figures whole (`$80`, `$200/mo`).
- **Sentence case** for any quoted UI label/button.
- **"top up"** (verb) / **"top-up"** (noun).
- **"analysis"** = the act; **"report / document"** = the output.
- Update the three cards that quote now-changed UI lines (gate compose, wallet copy, payment-failed copy).
- **NEW — the "Lingo" layer:** deliverable names are audience-adaptive (Business Case → **Pitch Deck** for founders / **Sales Deck** for sales / **Board Paper** for strategy; market sizing → **TAM**; due diligence → **DD**). The library treats deliverable names as fixed — H/use-case cards should reflect that the name adapts to the reader's ICP.

---

## C. Rewrites needed (not copy edits)

- **E-01 … E-05 (editing)** — the library's "editing = a metered re-generation" is the **retired** model. The landed public story (website) is **included edit credits (15,000 / 80,000 / 300,000 by tier), "a benefit, not a fee."** The pricing/edit-economics spec instead describes a **Minor(free) / Substantial(metered tokens) / New(new analysis)** system with top-ups — and the two source docs disagree on top-up mechanics. **Blocked on Decision 1.**
- **G-12 (Reset vs Delete account)** — "Reset account" was **removed**. Now: three scoped resets (Reset Research profile / Reset Data Room / Delete all documents) each in their own screen, plus **Delete account** as the only account-level destructive action. Rewrite or split. **Decision 2.**
- **D-13 (Versions)** — correct placement (behind `⋯`, not a switcher tab); rest of the content stands.
- **A-12 (onboarding)** — rewrite per A7.
- **K-04/05/06/07 (Data Room mechanics)** — rewrite to the checkbox/selection-toolbar model; add bulk private/public and multi/select-all delete.
- **G-06 / G-09 / G-11 (account IA)** — flat mobile menu; Context questions folded into Research profile (+ its new "Reset research profile" control); Security danger card = Delete account only.
- **D-16 (Theater)** — add the status spine (**Learning → Analyzing → Generating → Creating**) and the **Creating cutoff** (post-Creating requests queue to the next version); note get-to-know is a rotating family of 5 message formats.
- **C-12 (pause/stop)** — still "atomic," but add the Creating-cutoff nuance (mid-run asks queue to v2, they don't vanish).

---

## D. New cards to add (~18 help cards + a website track)

**Academic tier (4)** — zero coverage today; maps to the Graduate-researcher ICP + `/academic`:
- Academic pricing ($8 / $40, $150 trial, no platform fee, top-up billing) · Student verification (.edu / documents) · Research Dollars (glossary/FAQ) · Academic Clubs.

**Notifications (3)** — zero coverage:
- Notification toasts (live) · Bell / Alerts (Center is **coming soon** — do not overstate) · Notification preferences (Account → Notifications, live).

**Documents lifecycle (4)** — new capabilities:
- Delete a single report · Archive & restore a report · Add a report to your Data Room · Delete all documents (scoped danger).

**Data Room (2):**
- Reset your Data Room · Selecting & acting on multiple files (or fold into K-05/07).

**Flow / activation (5):**
- **The sample report already in your account** (the new #1 activation asset — behavioral copy only until you seed real topics) · What is Insights (coming soon) · Not enough budget to generate (`Top up $X to run`) · Where did Versions go · *(optional)* What Caspr is doing while it works (status spine).

**Website-content track (~12, separate from help cards)** — the site plan finally gives B/H/J homes and names new page content the library should feed: `/languages` (multilingual — a headline differentiator we don't cover), `/visuals` (charts/framework infographics as a headline capability), the "Caspr gets to know you" retention story on `/pricing`, Enterprise client templates, per-ICP **named case studies** (the site's anchor argument, replacing generic price ranges), `/product` page, `/vs` index for the 9 comparison pages, `$200/month minimum budget` statement, and 5 blog seed posts.

---

## E. Visuals to redo

- **Data Room annotated screenshots** (`k04_file_actions`, `k07_delete`) + walkthrough `wv_k03` — re-pull from the updated checkbox/toolbar frames.
- **Any "25M+" in graphics** — `b04_data_sources` diagram, concept videos → 25M+.
- **Pricing infographics** — core numbers unchanged, so most stand; only touch any that depict the edit model.
- Buildable-now: report-anatomy visuals (structure confirmed by api-spec §6–9), even before real sample topics exist.

---

## F. HOLD — in spec but not live / unresolved (do NOT publish)

Re-analysis/Updates pricing (Phase 2) · Insights dashboard (Soon) · Notification Center (bell is a stub) · Annual-commitment discount (not implemented) · **sample-report topic-specific content** (deferred until you seed real ones — A-11/D-06/H-11 stay behavioral-only) · custom-template pricing (TBD) · exact edit-token allowance sizes + fixed-pack-vs-$5-increment conflict · additional Enterprise seat pricing (TBD) · testimonials/social proof (placeholder) · **Legal Document type** (excluded from website) · "synthetic panels" must always read **"AI-simulated."**

---

## Decisions I need from you (these gate the rest)

1. **Editing story:** publish it as **"included edit credits"** (the website line) or as the **token + top-up** system (the pricing/edit-economics spec)? They conflict, and it blocks the E-01…E-05 rewrite.
2. **G-12:** rewrite as one "Delete your account" card with cross-links to the three scoped resets, or split into four cards?
3. **Documents-lifecycle cards** (delete/archive/add-to-Data-Room/delete-all): widen category **K**, put them in **D**, or a new mini-category?
4. **`/glossary`:** build it (so the J cards get a real home) or hold J shipping until it exists?
5. **Output style at launch:** live (site-truth) or coming-soon (website-proposal-v2)? Blocks D-10 and the B style copy.
6. **Academic tier:** is it launching, and how much goes on the website vs app help?
7. **Sign-offs before publish:** the **25M+** basis, and the homepage comparison-band cost/time numbers.

---

## Recommended sequence

- **Phase 1 — do now (no decisions):** the voice sweep (B) + factual corrections A1–A7 + the mechanically-clear rewrites (Data Room checkbox model, G-12 → delete-only, Versions placement, A-12 onboarding, account IA). Also flip resolvable `[VERIFY]` flags where a spec now confirms the fact.
- **Phase 2 — after decisions 1–6:** editing economics, the Academic cluster, Documents-lifecycle placement, glossary, style copy.
- **Phase 3 — website track:** map B/H/J to real pages/URLs and draft the new website content.
- **Ongoing HOLD:** everything in F, revisited as features ship.

Net effect: **113 → ~131 help cards**, plus a ~12-item website-content track, plus ~5 visuals redone. About a day of my time across the three phases once the seven decisions are made.
