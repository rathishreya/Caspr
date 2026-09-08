# Caspr Product Review: What's Working, Gaps & Enhancements

*Based on: live product walkthrough (2026-05-08), Joy's roadmap brief, brand guidelines, Figma assets*
*Last updated: 2026-05-09*

---

## What's Working Well

### 1. Core Analysis Engine
The output quality is the product's strongest asset. The "Cultural Intelligence in Global Leadership" report showed a well-structured Executive Summary with genuine analytical depth — not a summary, actual conclusions. The HTML preview before PDF generation is well-designed: users see the full report in-browser and can edit before committing to an output format. This review-before-download mechanic is correct and differentiating.

### 2. The 2-Minute Interaction Model
The actual user interaction time is 2–2.5 minutes — type prompt, review layout, answer clarifying questions, confirm structure, hit generate. This is the Aha! moment premise made real. If users understood this before signing up, activation would be significantly higher. It is not communicated anywhere visible.

### 3. Two-Panel Chat + Preview Layout
The split-screen design (chat on left, report preview on right with Preview / Output tabs) is logical and clean. Users can see the report building without leaving the chat context. The tab structure (Preview / Output / Updates) correctly separates in-progress preview from final deliverables.

### 4. Report Library with Status Indicators
The searchable reports list (Draft / Analysis Completed / Output Generated) gives power users a clear view of their work. The stats dashboard (Joy's Reports: 1 Draft, 10 Analysis Completed, 35 Output Generated) is useful. The "View All" with prompt input on the reports list page is a lower-friction entry point than the "New Report" button.

### 5. Versioning
Output files are versioned (V1.pdf, V2.pdf). Small detail, large professional credibility signal.

### 6. Source Count on Home Screen
"1,057,368 sources & counting" — animated, live counter — is the best trust signal on the page. It is specific, it moves, and it signals scale without any marketing language.

### 7. The Figma Ad Creatives
The extracted Figma assets include a strong ad creative format:
- "Don't spend a dime on market research before knowing this."
- Three specific proof points with numbers: $2K–$20K per report from research firms, 25M+ curated sources, 50+ sectors
- "No guesswork. No noise. Only Caspr."
This is on-brand and usable. The comparison to research firms ($2K–$20K/report) is the right anchor for the market research ICP.

### 8. Report Cover Branding
The sample PDF cover ("India AI Impact Summit 2026: Strategic Analysis — Published by: Caspr Research") is strong. "Published by: Caspr Research" positions the output as an institutional-quality document, not an AI-generated file. This is a credibility signal that should be highlighted in marketing.

---

## Gaps

### Gap 1: Activation — No Email Sequence
The #1 gap. 1,500 signups, activation rate unknown, ~2 paid users. Users sign up and receive nothing. No onboarding email. No prompt to run their first report. No reminder. No "here's what others are doing with Caspr." The tool has improved significantly since most users signed up — they don't know. This is addressable immediately without any product change.

### Gap 2: No Onboarding Experience Inside the Product
New users land on the home dashboard and see a tips carousel, their (empty) reports list, and a "New Report" button. There is no guided first-run experience, no sample reports to explore, no pre-populated prompt to try. The planned file drawer with samples addresses this — but the current product leaves first-time users to figure it out.

### Gap 3: Recall Problem — No Ongoing Presence
Users who signed up (many via a WhatsApp group) liked the product but don't think of Caspr when a relevant need arises. This is a category creation challenge: the habit of commissioning AI analysis doesn't exist yet. Caspr Signals and Monthly Brief (designed, not live) solve this directly — but until they're built, there is no mechanism to stay top-of-mind between active use sessions.

### Gap 4: Greeting Misalignment
The chat greeting — "Hello! I'm Caspr, your **market research** assistant." — contradicts the Caspr means Business positioning. A user who came to Caspr for a due diligence report or a business case reads this and wonders if they're in the right place.

### Gap 5: File Upload Modal UX
The modal appears immediately when a user tries to send their first message. The Confirm button is disabled by default (only activates when a file is uploaded). The X close button is present but small and visually de-emphasised. Most users will not understand that closing the modal allows them to proceed without files. The intent is correct (uploading before layout generation gives better output) but the execution creates confusion and likely causes drop-off.

### Gap 6: Dead Navigation
- **Insights** (sidebar nav item): 404. Shown to every user on every page. Either build it or remove it.
- **Updates tab**: "This feature is coming soon. Wait for us to cook it up for you." Occupies a prime tab position in every report view and delivers nothing.

### Gap 7: Chat Disabled After Report Generation
Once a report is generated, the chat panel shows "Chat disabled for this report." Users cannot ask follow-up questions, request refinements, or query sections. Given that the planned Ask Caspr feature (pulsating red dots) will eventually enable in-report queries, this is a placeholder for a capability that should already exist.

### Gap 8: Quick-Start Tags Don't Reflect Caspr means Business
The tags on the Reports page — "Market Landscape, Industry benchmarking, Distruptive Trends [typo], Competitor analysis, Workforce of the Future" — read as market research prompts. They don't show the Due Diligence, Business Case, RFP, Investment Thesis, or Competitor Analysis use cases that Caspr now claims.

### Gap 9: Home Screen Copy Not Driving Action
The home screen carousel is educational marketing, not action-driving onboarding. "Assessment. Large Analysis Model developed by us to generate Qualitative & Quantitative Insights like a Research Analyst" is describing the product, not compelling a first report. Users who land here don't know what to type.

### Gap 10: Token Model Is Not Communicated
Users on the Free plan have no clear sense of how many reports they can run. "387,500 tokens" means nothing. "~2 full reports remaining" would. The current Wallet page shows transaction history (12,500 tokens per report) but doesn't translate this into report count upfront. The Research Budget model solves this — but until then, the token model needs a plain-language translation.

### Gap 11: Positioning Mismatch — "LAM" on Home Screen
Assessment card says "Large Analysis Model developed by us." The brand guidelines explicitly prohibit "LAM" — the architecture claim is not yet ready to defend publicly. "Large Analysis Model" is the expanded form of LAM. This needs to change to "Analytical AI" or "purpose-built for analysis."

### Gap 12: PPTX Is Hidden
The home screen carousel mentions PPTX exists. The Output tab shows only a PDF. PPTX is actually live — it appears at the Generate Output stage. Users who don't reach Generate Output never discover it. This is a significant feature being undersold.

---

## Suggested Enhancements

### Immediate (No or Minimal Dev Required)

**E1. Update chat greeting**
From: "Hello! I'm Caspr, your market research assistant."
To something reflecting the full scope — e.g.: "Hello. I'm Caspr. Tell me what you're trying to figure out — I'll turn it into a boardroom-ready analysis."

**E2. Remove Insights from sidebar**
Dead link. Remove entirely or replace with a "Coming Soon" page that captures interest.

**E3. Replace "coming soon" on Updates tab**
Either build the feature or remove the tab. If keeping: replace the copy with something that explains what Updates will do and invites users to request it.

**E4. Update quick-start tags**
Current: Market Landscape, Industry benchmarking, Distruptive Trends, Competitor analysis, Workforce of the Future
Proposed: Business Case, Due Diligence, Market Research, Competitor Landscape, Investment Thesis, RFP

**E5. Fix "Large Analysis Model" copy on home screen**
Replace with: "Analytical AI, purpose-built to generate..." — consistent with brand positioning and avoids the LAM claim.

**E6. Translate tokens to reports in Wallet**
Below "387,500 tokens" show: "≈ 31 studies remaining" (based on 12,500 per study). Make the balance legible.

**E7. Fix typo on Reports page**
"Distruptive Trends" → "Disruptive Trends"

---

### Short-Term (Light Dev)

**E8. File upload modal — UX improvements**
- Make the X close button more prominent and add explicit copy: "No file? No problem — close this and continue."
- Rename "Confirm" to "Proceed without files" when no file is uploaded (or enable Confirm by default with optional upload)
- Add brief explanation of why uploading now produces better output (one line below the title)
- Consider moving the modal to appear after layout proposal, as originally intended — this is the more logical position since users don't always know what they'll want to upload until they see the structure

**E9. Re-enable follow-up after report generation**
Allow users to start a new chat thread linked to a completed report. At minimum, replace "Chat disabled" with: "Start a follow-up analysis" that opens a new chat with the completed report as context.

**E10. Add PPTX to report cards**
On the Output tab and report cards, show both output options available: PDF and PPTX. "Generate Output → PDF or PPTX" should be visible before users reach that step.

**E11. Add report count to home screen**
"Joy has generated 46 reports." Small, specific, motivating for active users. For new users, replace with: "Your first report is free. Takes 15 minutes."

---

### Medium-Term (Requires Dev)

**E12. Activation email sequence (highest priority)**
Design and send a 5-email sequence to all 1,500 existing signups. See tool-suggestions.md for full brief.

**E13. Sample reports onboarding (aligned with file drawer)**
Before the file drawer is built: add 2–3 sample reports (one per key use case) visible to new users on first login. Make them clickable to read full preview. This removes the cold-start problem and demonstrates output quality before the user types their first prompt.

**E14. Research Budget pricing model implementation**
Full redesign of Wallet page. See tool-suggestions.md for in-product spec.

**E15. Caspr Signals MVP**
Weekly digest email on a watched topic. This is the recall mechanism. Even a basic version (sourcing stage lightweight pull, simple email format) solves the top-of-mind problem. Should be built before spending on acquisition.

**E16. Update home screen from marketing to action**
Replace the tip carousel with a direct prompt: "What do you need to know?" with a text input that starts a new report. The home screen should be a command centre, not a brochure.

---

### Strategic (Aligned with Roadmap)

**E17. File drawer — use case folder architecture**
The planned redesign organises reports by use case with sample reports inside each folder. This simultaneously solves onboarding (samples), navigation (structure), and positioning (shows breadth of use cases on login). Design is in progress per Figma.

**E18. Ask Caspr — pulsating red dot citation model**
Replace superscript citations with pulsating red dots. Click → Caspr explains the claim with sources and analysis context. This moves the trust model from "verify every source yourself" to "ask Caspr about any claim." The end state positions Caspr as a citable source (like Bloomberg or Gartner), not a tool.

**E19. Premium data source workflow**
Before analysis starts: surface which premium data sources are available (Bloomberg, PitchBook etc.) and their cost. User opts in or skips. This surfaces value that currently runs in the background, and creates a clear tier-gating mechanism.

**E20. Due diligence positioning activation**
The data upload feature (Plus+) already enables a due diligence workflow. The positioning for it does not yet exist. Near-term action: build one landing page and one LinkedIn post targeting PE/VC using the line: "Upload the data room. Caspr provides the market intelligence around it. The investment memo writes itself." One credible reference from a PE user unlocks the segment.

**E21. Output format and language tier-gating**
As noted by Joy: output formats (PDF, PPTX, Word) and languages can be feature unlocks tied to milestones. This creates a clear upgrade motivation beyond just report volume.
