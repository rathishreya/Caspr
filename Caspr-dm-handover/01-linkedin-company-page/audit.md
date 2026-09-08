# LinkedIn Company Page — audit and rebuild

*Audited 2026-08-19. Page: `linkedin.com/company/caspr-for-market-research/` · ID `108139853` · 202 followers.*
*Owner: Marketing TL. Nothing here needs dev — it is all Page settings and assets.*

---

## 1 · The state of it

| Field | Current | Assessment |
|---|---|---|
| **Tagline** | `AI for Market Research` | **The retired positioning.** This line appears everywhere the Page is referenced |
| **URL slug** | `caspr-for-market-research` | The retired positioning baked into the URL |
| **Industry** | `Market Research` | Categorises Caspr as a research firm, not analytical AI software |
| **About — source count** | `500,000+ Verified Sources` | **Wrong.** Canonical is 25M+ |
| **Logo** | Old bold-serif `Caspr.` wordmark | Superseded by the Instrument Serif outlined wordmark with the true-circle red dot |
| **Cover** | Old marketing graphic, 1128×191 | Carries "market research reports" copy. Superseded |
| **Location** | **Not set** | Lost discoverability; LinkedIn prompts for it |
| **Founded / specialties / HQ** | **Empty** | Free search surface, unused |
| **Custom button** | Not configured | No route to signup from the Page |
| **Posts** | **None in 90 days** | Dormant |
| **Followers** | 202 | Against Joy's 22,161 |
| **Employees listed** | 9, but Joy, Jayant and Amit are not among them | Consequence of the four-way company-name split |

---

## 2 · Three findings that matter more than the cosmetics

### 2.1 Caspr publicly states three different source counts

| Where | Figure |
|---|---|
| Company Page About | **500,000+** |
| Company Page posts, and one other Caspr property | **1,000,000+** |
| Canonical truth (`site-truth.md` §6) | **25,000,000+** |

For a company whose entire argument is *"every insight cited to a credible source,"* publishing three different figures for its own source count is the most damaging inconsistency on this page. Anyone who checks — which is exactly what a sceptical research buyer does — finds the citation brand cannot cite itself.

**Fix everywhere in the same pass. 25M+ or nothing.**

### 2.2 The Page sells a capability the website is forbidden to mention

The About section lists *"Legal professionals requiring defensible research."*

`site-truth.md` §4 is explicit that the Legal Document type gets **"Nothing on the site"** pending the Lawyers ICP work and legal sign-off, and that any legal output ships only as *a draft for a lawyer to review*, never as advice.

The Company Page is publicly advertising it anyway. **Remove the line.**

### 2.3 Impressions without posts — where is this coming from?

The admin dashboard shows **47,080 post impressions in 7 days, up 157.6%**, alongside **0 new followers**, **17 page visitors**, and **no posts in 90 days**.

Impressions at that scale with no organic posting and no follower growth suggests paid distribution is running. If so, money is currently being spent driving traffic to a Page that says "AI for Market Research" and claims 500,000 sources.

**Marketing TL: confirm what is running in the ad account before anything else on this list.** If spend is live, pause it until §3 is done.

---

## 3 · The rebuild

### 3.1 Text fields

| Field | Set to |
|---|---|
| **Name** | `Caspr` |
| **Tagline** | `Analytical AI — purpose-built for business analysis, not conversation.` |
| **Industry** | `Software Development` — with `Business Intelligence Platforms` if a second is permitted |
| **Company size** | `2-10 employees` |
| **Type** | `Privately Held` |
| **Founded** | 2025 — confirm |
| **Headquarters** | Singapore |
| **Location** | Add the registered Singapore address of **Caspr Holding Pte. Ltd.** Add Delhi/Gurugram as a second location |
| **Website** | `https://caspr.ai` |
| **Custom button** | `Visit website` → `https://caspr.ai/?utm_source=linkedin&utm_medium=organic&utm_campaign=company_page&icp_hint=general` |
| **Specialties** | market research · competitive analysis · due diligence · investment research · business cases · market sizing · strategic analysis · analytical AI · cited research · market intelligence |

Specialties are a free keyword surface that feeds LinkedIn's own search. Ten entries, no cost.

### 3.2 About us — replacement copy

Written to brand voice. No exclamation points, no banned vocabulary, no unverifiable claims, 25M+ throughout, legal removed.

> Caspr is Analytical AI — purpose-built for business analysis, not conversation.
>
> A single prompt becomes a boardroom-ready analysis. Caspr asks what it needs to know, structures the research, and returns a cited document in minutes. Not a draft. Not a summary. Work you can put in front of a board.
>
> **What makes it different**
>
> **Analytical, not generative.** Every analysis is sourced, weighed and concluded — Caspr reads 25M+ curated and live sources, weighs what they disagree on, and reaches a defensible conclusion, so the analysis reflects today, not a training cut-off.
>
> **25M+ curated sources.** Documents, government databases and news feeds — curated and credible. Not web scraping.
>
> **Every insight cited.** Click any claim and see the source behind it. Defensible before you present it.
>
> **Built for the work you already do.** Market research. Competitive landscapes. Due diligence. Investment theses. Business cases. Market sizing.
>
> **Who uses it**
> Consultants, strategy teams, investors, corporate development, agencies and researchers who need analyst-grade depth without an analyst timeline.
>
> 15 minutes. 100 pages. Cited to source.
>
> Start free — $100 in analysis, no credit card. https://caspr.ai

### 3.3 Logo

| | Spec |
|---|---|
| **Upload** | 300×300 px, PNG, transparent background |
| **Artwork** | The current Instrument Serif wordmark — outlined, baked bold, true-circle red dot. Master in `assets/logo/` |
| **Caution** | LinkedIn crops the logo to a circle in most placements. Test at 48px — if the wordmark becomes illegible, use the **`C.` monogram** instead. The monogram exists at 512/180/32 on the `🎨 Component States` Figma page, built from `caspr-web/lib/iconMark.ts` |

**Recommendation: use the `C.` monogram.** It survives the circular crop and the 48px feed avatar, which is where nearly all impressions happen. The full wordmark belongs on the cover, where it has room.

### 3.4 Cover image

| | Spec |
|---|---|
| **Dimensions** | 1128 × 191 px |
| **Format** | PNG |
| **Safe area** | The left ~220px sits behind the logo on desktop and is cropped on mobile. **Nothing important there** |

**Design direction** — three options, in order of preference:

1. **The claim, set in type.** `--dark-surface-0` `#0C0B09` ground, `15 minutes. 100 pages. Cited to source.` in Instrument Serif, `#F5F4F0`, with the red dot as the full stop. Quiet, editorial, unmistakably the brand. Reads at every size.
2. **Real output.** A cropped spread of an actual Caspr report — table of contents or a data table — on the dark ground, with one line of Inter over it. Consistent with the "show the output" principle, and it shows the product rather than describing it.
3. **The category line.** `Analytical AI — not generative.` Same treatment as option 1.

Avoid stock imagery, avoid a team photo, avoid anything with a UI screenshot in it that will be stale in a month.

### 3.5 The URL slug

Current: `linkedin.com/company/caspr-for-market-research/`
Proposed: `linkedin.com/company/caspr-ai/` — or `casprai` if taken.

**Weigh before changing.** The slug carries the retired positioning and is visible in every link, which argues for the change. But LinkedIn does not redirect the old vanity URL, so any existing inbound link breaks. At 202 followers and with the Page linked from few places, **the cost is low and the change is worth making now** — it only gets more expensive.

Check for existing links first: the website footer, email signatures, the app, press mentions. Update them in the same pass.

---

## 4 · The employee-listing problem

Only four of the team appear as employees, because the seven profiles list the company four different ways. Joy, Jayant and Amit are absent from a Page that should show all seven.

Employees are a Page's most-viewed module and its cheapest distribution: every employee post is attributable to the Page. Fixing the tagging in [`../02-linkedin-profiles/audit.md`](../02-linkedin-profiles/audit.md) §2.1 fixes this automatically — **no separate work.**

Note that Joy's profile carries both brands by decision, so Joy will appear under whichever position is set to display. Setting Caspr as the displayed position puts Joy on this Page.

---

## 5 · Existing posts — leave or delete

Posts still live on the Page contain `Large Analysis Model (LAM)`, `1 million curated sources`, and `It's AI for market research`.

**Recommendation: hide rather than delete.** LinkedIn permits deletion but not editing. Deleting removes the engagement history; leaving them contradicts current positioning on a public page.

- **Delete** anything containing **"LAM" or "Large Analysis Model"** — that claim is explicitly prohibited and cannot stand publicly
- **Delete** anything stating a source count other than 25M+
- **Leave** posts that are merely off-tone. They are old, they are dated on the page, and the new cadence will bury them within a fortnight

---

## 6 · Order of work

| | Action | Owner |
|---|---|---|
| **1** | Confirm what is running in the ad account; pause if live (§2.3) | Marketing TL |
| **2** | Delete the prohibited posts (§5) | Social |
| **3** | Tagline, industry, About, location, specialties, custom button (§3.1–3.2) | Social |
| **4** | Logo — `C.` monogram at 300×300 (§3.3) | Social |
| **5** | Cover — direction agreed with Joy, then produced (§3.4) | DM editor |
| **6** | Slug change, with inbound links updated in the same pass (§3.5) | Social |
| **7** | Team re-tag, which fixes the employee list (§4) | Each person |
| **8** | Resume posting on the portal's schedule | Portal |

Items 1–4 are same-day. Nothing here waits for the portal.
