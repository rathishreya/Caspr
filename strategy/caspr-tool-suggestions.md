# Caspr Tool Suggestions: Items to Fix & Build

*For engineering and product team*
*Last updated: 2026-05-09*
*Based on: live product walkthrough, Joy's brief, brand guidelines, product marketing context, pricing model*

---

## Priority Legend
- 🔴 **Immediate** — No or minimal dev. High impact on activation and brand. Should ship in current sprint.
- 🟡 **Short-term** — Light dev. High strategic value. Target: within 4 weeks.
- 🟢 **Roadmap** — Significant dev. Foundational for growth. Target: next 90 days.

---

## Brand & Positioning Sync

### 🔴 1. Update chat greeting
**What:** The opening message when a user starts a new report says "Hello! I'm Caspr, your market research assistant."
**Why fix:** "Caspr means Business" was finalised as the brand positioning. The greeting positions Caspr as a market research tool only. Users who come for due diligence, a business case, or an RFP see a mismatch immediately.
**Fix:** Update to reflect the full scope. Suggested:
> "Hello. I'm Caspr — Analytical AI for business. What are you trying to figure out?"

Or, more direct:
> "Tell me what you need to know. I'll have a boardroom-ready analysis ready in minutes."

---

### 🔴 2. Fix "Large Analysis Model" copy on home screen
**What:** Assessment card reads "Large Analysis Model developed by us to generate..."
**Why fix:** Brand guidelines explicitly prohibit "LAM" — the architecture claim is not ready to defend publicly. "Large Analysis Model" is the expanded form. This is a live brand violation.
**Fix:** Replace with: "Analytical AI, purpose-built to generate Qualitative & Quantitative analysis like a senior research analyst."

---

### 🔴 3. Update quick-start tags on Reports page
**What:** Tags below the prompt input read: "Market Landscape, Industry benchmarking, Distruptive Trends, Competitor analysis, Workforce of the Future"
**Why fix:** (a) "Distruptive" is misspelled. (b) Tags reflect old market research positioning, not Caspr means Business. They don't show Due Diligence, Business Case, RFP, Investment Thesis — the use cases Caspr now claims.
**Fix:**
- Fix typo: "Disruptive Trends"
- Replace or extend tags with: Business Case, Due Diligence, Market Research, Investment Thesis, Competitive Landscape, RFP

---

### 🟡 4. Update home screen from brochure to action
**What:** The home screen carousel shows marketing copy about features (sourcing stage, assessment stage, Advanced Data Visualisations). Users cannot act on this information.
**Why fix:** First-time users land here and don't know what to type. The home screen should drive first-report creation, not explain features.
**Fix:** Replace or supplement the carousel with a direct prompt input: "What do you need to know?" — starts a new report from the home screen. Keep source counter as a trust signal. Move feature education to onboarding tooltips or a dedicated help section.

---

## Navigation & Dead Links

### 🔴 5. Remove Insights from sidebar navigation
**What:** The "Insights" nav item navigates to a 404 page.
**Why fix:** Every user sees this on every page. Clicking it produces an error. Removes credibility.
**Fix option A:** Remove the nav item entirely until Insights is built.
**Fix option B:** Replace with a placeholder page that explains what Insights will do and invites users to register interest (captures intent data).

---

### 🔴 6. Replace "coming soon" on Updates tab
**What:** The Updates tab in every report view shows: "This feature is coming soon. Wait for us to cook it up for you!"
**Why fix:** Occupies prime real estate in every single report view and delivers nothing. Undermines trust.
**Fix option A:** Remove the tab until the feature is built.
**Fix option B:** Replace with useful content — e.g., suggested follow-up analyses based on the current report topic.

---

## File Upload Modal

### 🟡 7. Improve file upload modal UX
**What:** When a user sends their first message in a new report, a modal appears ("How would you like your output?") showing a file upload area. The Confirm button is disabled unless a file is uploaded. The X to close is present but visually small.
**Context:** The intent is correct — uploading proprietary data before layout generation improves the proposed structure. However, most users don't have files ready on their first prompt and don't realise they can close the modal and proceed without uploading.
**Fix:**
- Make the close button (X) larger and more prominent
- Add copy below the title: "Don't have files? Close this and continue — you can always add context in the chat."
- Enable Confirm by default (even without a file) with label: "Proceed" — and rename to "Proceed with files" when a file is uploaded
- Consider: rename the modal title from "How would you like your output?" to "Add reference files (optional)" — the current title implies output format selection, which is not what this modal does
- Long-term: consider whether the modal better serves users after the layout is proposed rather than before the first message (the user may not know what they want to upload until they see the structure)

---

## Post-Generation Experience

### 🔴 8. Re-enable engagement after report generation
**What:** "Chat disabled for this report" appears in the chat panel after a report is generated.
**Why fix:** Users who want to refine, ask follow-up questions, or start a linked analysis have no path forward. This is a dead end at the point of highest engagement.
**Fix:** Replace "Chat disabled" with:
- "Run a follow-up analysis" — opens a new chat with current report as context
- "Refine a section" — allows targeted edits to specific sections
- At minimum: "Start a new report on a related topic" with a pre-populated prompt based on the current report subject

---

### 🟡 9. Surface PPTX output earlier
**What:** PPTX is a live feature but only appears at the Generate Output stage. The Output tab shows only a PDF. Many users don't know PPTX exists.
**Why fix:** Editable PPTX is a significant differentiator — it enables users to present the analysis to clients and boards. Hiding it until the final step undersells a core value.
**Fix:**
- Add to the Output tab header: "PDF and PPTX available — click Generate Output to select"
- Show both format options on report cards in the reports library
- Add PPTX explicitly to the home screen carousel tip (currently says "generate quick presentations" but doesn't say PPTX)

---

## Pricing & Wallet

### 🟡 10. Translate tokens to reports in Wallet
**What:** Wallet shows "387,500 tokens available." This is meaningless to users.
**Why fix:** Users don't know how many reports they can run. This creates anxiety and reduces willingness to experiment.
**Fix:** Below the token count, add: "≈ [N] studies remaining" calculated at 12,500 tokens each.
Note: "Token" as a term will disappear when the Research Budget model is implemented — the fix above is for the interim state.

---

### 🟢 11. Implement Research Budget pricing model
**What:** The Research Budget model (designed in pricing-model.md) replaces the token model entirely. It is a fundamental improvement in how value is communicated and how billing works.
**Why now:** The model was finalised. It removes every point of confusion in the current token model and aligns pricing with how users think about their spending.

**In-product implementation required:**

**Wallet page redesign:**
- Show: Research Budget (authorised monthly amount), Analysis Balance (what can be spent), Platform fee (internal — do not surface to user), Recharge date
- Replace transaction history format: show as "Studies run", "Balance remaining", "Next recharge" rather than raw token ledger
- Free trial view: show "$100 gifted balance" with expiry date and progress bar

**Pre-analysis cost display:**
- Before a user starts an analysis, show the cost: "This Study will use $80 from your Research Budget. Balance after: $[X]."
- For users with insufficient balance: "You need $[shortfall] more. Top up or choose a shorter analysis."

**Premium data source workflow:**
- Before analysis starts, surface available premium sources: "This analysis would benefit from [Bloomberg/PitchBook]. Add for $[X]?" with Accept / Skip options
- Show cost impact on balance before confirming

**Change Plan flow:**
- Replace plan cards (Free/Plus/Pro) with milestone cards (Professional/Business/Enterprise)
- Show current milestone, next milestone, features that unlock on upgrade
- Show dollar value: "At $600/month, you have $558 available for analysis each month"

**Free Trial:**
- On first login: show "$100 gifted Research Budget" prominently with countdown to expiry
- On free trial exhaustion: show balance remaining, cost of the next analysis, and a "Set up your Research Budget" CTA

---

## Positioning Sync (Caspr means Business)

### 🟡 12. Update all in-product copy to reflect Caspr means Business
**Scope:** The entire product currently uses market research language. "Caspr means Business" was finalised as the brand positioning. All in-product text should reflect the broader scope.

**Specific items to update:**

| Location | Current | Proposed |
|---|---|---|
| Chat greeting | "your market research assistant" | Reflects full scope — see item 1 |
| Right panel empty state | "Start a conversation...to create a market research report." | "Start a conversation...to create a boardroom-ready analysis." |
| Reports page empty state | "Found a new topic to research?" | "What do you need to know?" |
| New Report button | "+ New Report" | Can stay, but tooltip should say "Start an analysis" |
| Output tab empty state | "No Report Selected or Generated" | "No analysis selected or generated" |
| assessment stage card | "Large Analysis Model" | "Analytical AI" (see item 2) |

---

### 🟢 13. Add onboarding sample reports
**What:** New users have no sample reports, no guided experience, and no indication of what a finished Caspr analysis looks like.
**Why fix:** The product's quality is its best sales argument. New users should see it within 60 seconds of signing up — before they run their first analysis.
**Fix:** On first login, show 3 sample reports (read-only, non-editable) in the reports library — one per key use case:
1. A market research Study (e.g., "India EV Market Overview")
2. A business case Study (e.g., "Business Case: Electric Vehicle Manufacturing in India")
3. A due diligence Study (e.g., "KLMB Investment Firm: Due Diligence Analysis")

These samples should be clickable, showing full Preview + PDF Output — so users see the depth of output before typing their first prompt.

---

## Activation (Highest Priority)

### 🔴 14. Build and send activation email sequence
**What:** 1,500 signups. No activation emails exist. This is the single highest-leverage action available.
**Why fix:** Users who signed up liked the concept but don't have top-of-mind recall. The tool has improved significantly. They don't know. An email sequence is the only mechanism to reach them before the Caspr Signals / Monthly Brief infrastructure is built.

**Recommended sequence (5 emails):**

**Email 1 — Day 0 (on signup):** Activation
Subject: "Your first analysis is ready to run."
Core: Single CTA to run first report. Include a specific example prompt for their likely use case. "Paste this into Caspr right now: [prompt]."

**Email 2 — Day 3 (if no report generated):** Use Case Education
Subject: "What are you trying to figure out?"
Core: Show 3 specific use cases with example outputs. "Business case for [X]. Competitive landscape of [Y]. Due diligence on [Z]. Each one takes 15 minutes."

**Email 3 — Day 7 (if no report generated):** Social Proof
Subject: "A primary research firm is using Caspr for client deliverables."
Core: Brief story of how the paid user (primary research firm) uses Caspr. Proof that the output is deliverable-grade.

**Email 4 — Day 14:** Product Update
Subject: "Caspr has improved since you last saw it."
Core: 2–3 specific things that have improved. Reinvite to try. New example prompt.

**Email 5 — Day 30:** The Direct Ask
Subject: "We'd like to know what would make Caspr useful for you."
Core: 2-question survey. What use case brought you to Caspr? What would make you use it regularly? Generates data + re-engages.

**For existing 1,500 signups:** Run a compressed version — emails 2, 3, and 5 — over 2 weeks. Do not send email 1 (too late for "just signed up" framing).

---

## Roadmap Items (For Engineering Scoping)

### 🟢 15. File drawer — use case architecture
Reorganise the reports library from flat chronological list to folder structure by use case. Include sample reports in each folder for new users. Separate Scans (Brief), Studies, and Intelligence within each folder. Support multiple output formats and versions per analysis.

### 🟢 16. Ask Caspr — pulsating red dot citation model
Replace superscript citation numbers with pulsating red dots on every claim. Click opens inline chat panel. Caspr explains the claim: which sources, what the analysis concluded, and why. Follow-up questions supported. Long-term goal: Caspr cited as a source (like Bloomberg or Gartner), not verified as a tool.

### 🟢 17. Premium data source approval workflow
Before analysis starts, detect which premium data sources are relevant. Surface to user: "[Source name]: $[X]. Add to this analysis?" Accept / Skip. Reserve cost from balance before analysis begins. If source fails to return data: credit back and notify. This workflow also clarifies what "Premium Data Add-on" means in pricing — currently a pricing line item with no visible product surface.

### 🟢 18. Output format and language tier-gating
Output formats (PDF, PPTX, Word) and language options become feature unlocks tied to milestones. This creates a visible, meaningful upgrade motivation beyond report volume. Surface at Generate Output step: "Unlock PPTX and 10+ languages — upgrade to Business."

### 🟢 19. Caspr Signals MVP
Weekly email digest on a watched topic. This is the recall mechanism — the most direct solution to the top-of-mind problem. Even a lightweight version (sourcing stage pull, simple email, one pre-populated link back to a Study prompt) should ship before any paid acquisition begins.

### 🟢 20. Monthly Brief automation
Auto-generated Brief on a user's chosen topic, delivered on the 1st of each month. Delivered as email + in-dashboard. Ends with suggested follow-up Studies. Cost absorbed by Caspr. Available to all active accounts.
