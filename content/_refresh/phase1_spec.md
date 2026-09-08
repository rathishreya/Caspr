# Phase 1 — Corrections + Voice Sweep (execution spec for rewriters)

You are updating EXISTING canonical help answers for Caspr. For each card assigned to you, return the UPDATED answer. Apply (1) the VOICE SWEEP to every card, and (2) the FACTUAL CORRECTIONS only to the specific cards listed. Do NOT otherwise rewrite — preserve correct content, the Trusted-Senior-Analyst tone, length band, and the CTA. If a card needs no change, still return it (unchanged) so the set is complete.

## VOICE SWEEP — apply to EVERY assigned card
- **"plan" → "budget"** when it means the subscription/milestone/Research Budget. (NOT when "plan" is the verb — "plan your research" stays.) Milestones are **budgets**: Professional / Business / Enterprise.
- **Capitalize the product nouns** wherever they appear as the product term: **Data Room, Research Budget, Brief, Study, Intelligence, Ask Caspr**, and the Data Room groups **Included / Excluded / Connected**. Leave generic uses lowercase.
- **Currency:** exact account balances → two decimals (`$186.00`); marketing/price figures → whole (`$15`, `$80`, `$200/mo`).
- **"top up"** (verb) / **"top-up"** (noun).
- **"analysis"** = the act; **"report" / "document"** = the output — use consistently.
- **Sentence case** for any quoted UI label/button.
- Keep ALL existing hard rules: NO exclamation points; banned words (platform, leverage(s), algorithms, workflows, powerful AI, revolutionary, game-changing); never "LAM"; "chatbot / web scraping / hallucinate" only as contrast; never mention the internal platform fee.
- If a card quotes any of these OLD UI lines, update to the new wording:
  - gate: "Happy to dig in…" → **"Let's scope it. What angle —…"**
  - wallet: "Increase your budget for more depth and features." → **"More budget, more depth — Business unlocks upload, editing, Intelligence."**
  - payment failed: "…no money left your account." → **"…no funds were taken."**

## GLOBAL FACTUAL CORRECTIONS — apply wherever they appear in an assigned card
- **"1M+ sources" → "25M+ sources"** (and "1 million+" → "25 million+"). New curated-source count.
- **Never pair "100 pages" with "15 minutes."** Correct by tier: **Brief = 3–5 pages, ~15 minutes**; **Study = ~100 pages, 1–2 hours**; **Intelligence = up to 24 hours, multi-model**. For a general claim, either attribute page-count/time to the right tier or keep it tier-neutral ("a boardroom-ready, fully-cited report").

## PER-CARD FACTUAL CORRECTIONS (only these cards get factual edits beyond the globals)

**A — Getting Started**
- **A-02** — the confirm-to-generate step happens **in chat** (the user tells Caspr to generate), not by clicking a button. On a first-time user's first run the gate that appears shows **no price** (that arrives after signup). Keep the rest of the steps accurate.
- **A-04** — correct the full sequence: prompt → *(intent confirmation, only if intent is ambiguous)* → layout canvas *(with clarifying questions running alongside in a drawer, a brief "Learning" wait)* → gate → **generate (confirmed in chat)** → Theater/Generation → report.
- **A-06** — tie duration to tier (Brief ~15 min; Study 1–2 hours; Intelligence up to 24 hours). Remove any "100 pages in 15 minutes" implication.
- **A-12** — FIX: the pre-signup gate shows **no price** ("confirm scope and price" is wrong → "confirm the scope; the price appears once you're in"). Generation is triggered by confirming in chat; Theater is already playing behind the signup wall; the wall appears on gate-click **or** after ~3 seconds of Theater.

**B — Differentiators**
- **B-01, B-04, B-06** — apply 25M+ everywhere "1M+" appears.

**C — Running an Analysis**
- **C-12** — still atomic (no pause, no stop), but add the nuance: requests made after the **Creating** stage begins **queue to the next version** (they are not silently lost). You may name the status spine: **Learning → Analyzing → Generating → Creating**.

**D — Understanding Your Report**
- **D-01** — if it lists the switcher tabs, they are **Contents · Ask Caspr · Edit · Outputs · Updates** (Versions is NOT among them).
- **D-02** — page count belongs to Study (~100 pages); Brief is 3–5 pages. Apply 25M+ if present.
- **D-13** — FIX: **Versions is reached from the report's `⋯` menu, not the pane switcher** (the switcher is Contents · Ask Caspr · Edit · Outputs · Updates). Keep the timeline / version-pinned-outputs content.
- **D-16** — add the status spine (Learning → Analyzing → Generating → Creating) and the **Creating cutoff** ("Finalizing your outputs — new requests will apply to the next version."). Note get-to-know is a rotating family of message formats, up to 3 per run.

**F — Pricing & Budget**
- **F-05** — API: soften. API access is described as an **Enterprise** capability, but the customer-facing API is not yet specified — keep it high-level and append `[VERIFY: customer-facing API scope not yet specced]`. Do not describe endpoints/auth.

**G — Account, Security & Teams**
- **G-05** — same API softening as F-05 (this is the API card): Enterprise capability, `[VERIFY: customer-facing API scope]`, no endpoints.
- **G-06** — current account IA: a flat mobile menu (Identity card · Research profile · Security · Notifications · Preferences · Sign out); **Context questions is folded into Research profile** (not a separate item); the scoped destructive actions live on their own screens; Account's own danger zone is just **Delete account**.
- **G-08** — add: on mobile, the Wallet is a primary bottom-nav tab showing a live balance; (Insights moved into "More"). Balance figures use two decimals.
- **G-09** — Research profile now absorbs Context questions (the get-to-know questions are the input; the Research profile / Memories list is the output). Add the new **"Reset research profile"** control (clears every learned fact in one action).
- **G-11** — Security's danger card now holds **only Delete account** ("Reset account" was removed). Password / two-factor / devices content unchanged.
- **G-12** — REWRITE: there is no longer a single "Reset account." Reframe around **Delete account** — the only account-level destructive action (forfeits remaining balance, type DELETE to confirm, retained for legal/GDPR) — and point to the three scoped resets that now live on their own screens: **Reset Research profile**, **Reset Data Room**, and **Delete all documents**. (Retitle toward "Deleting your account" if natural.)
- **G-13** — add: on mobile, Get Help is reached via the "More" tab, not a standalone bottom-nav destination.

**H — Use Cases by Role**
- **H-02 (investors), H-07 (corporate dev)** — the deliverable ladder for these roles is **Screen / Thesis / Diligence**, NOT Brief / Study / Intelligence. Keep the price points, but name the rungs correctly and note that Caspr names the deliverable to fit the reader's field.
- **H-08 (founders/fundraising)** — use Business-Case framing (a pitch / business case), not the universal Brief/Study/Intelligence ladder.

**J — Glossary**
- **J-04 (Research Budget)** — "budget" not "plan"; note the $200/month minimum.
- **J-05 (Brief/Study/Intelligence)** — keep these as the three **depths** (fixed, always Brief/Study/Intelligence). Add one line that the *deliverable* name a user sees can adapt to their field (e.g. Screen/Thesis/Diligence for investors), while the depth underneath is unchanged. Prices unchanged.
- Any J card mentioning "1M+" → 25M+.

**K — Data Room** (the per-row `☰` menu was removed — access is now a checkbox on each row + a selection toolbar)
- **K-04 (Private/Public)** — add: Private/Public can be toggled in **bulk** across a multi-file selection via the action toolbar; remove any "from its menu" phrasing.
- **K-05 (Included vs Excluded)** — mechanism rewrite: select file(s) with the row checkbox → **Include / Exclude** buttons appear in the action toolbar (the old row menu is gone); works for one file or many at once. Drag still works.
- **K-06 (keep-but-exclude)** — same mechanism; good place to note the Data Room has no Archive — **Exclude is its non-destructive declutter**.
- **K-07 (delete a file)** — mechanism rewrite: select via checkbox → red **Delete** in the toolbar; now supports **single, multiple, and select-all** delete with a live-count confirm ("Delete N sources?"); keep the Move-to-Excluded-first / Delete-permanently framing for the single case.

## NOT in Phase 1 (do not touch these — parked for Phase 2)
- E-01 … E-05 (editing economics — pending a product decision).
- Any NEW card (Academic, Notifications, Documents lifecycle, sample report, Insights, etc.).

## Output format
Return ONLY a valid JSON array to your assigned output file: `[{"id":"A-01","answer":"...","changed":"voice|voice+facts|none"}]`. Escape newlines. `changed` = a short tag of what you altered.
