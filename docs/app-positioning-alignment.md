# App ⇄ positioning alignment — response to the brief

**Responding to:** `docs/app-session-prompt.md` v1 (2026-08-20) · **Date:** 2026-08-20 · Figma `y2F394I4CwEeSzH2kKuDCt`

**Headline: the app is in better shape against the new positioning than the brief assumes.** The copy sweep is **six instances, not a sweep**, and the single item the brief calls "the most common error to look for" — citations framed as work for the user — **has zero instances anywhere.** Of the six non-copy items, I recommend building **one**, folding one, re-scoping one, deferring one, and pushing back on one.

**Executed in this pass:** §6.5 only (two spec files). Everything else is proposed, per §8.

---

## Part A — Copy sweep

Measured, not estimated. Every instance below was located by search across `docs/product`, `docs/report-guidance`, `docs/app-handoff`, the Figma app file, and the running build at commit `08b9d38`.

### A.1 To change

| # | Where | Current | Proposed | Rule |
|---|---|---|---|---|
| 1 | **Build** `pages/HelpPage.tsx:58` | "**1M+** curated sources — documents, government databases and news feeds…" | "**25M+** curated sources…" | §4 retired claims — source count must be 25M+ |
| 2 | **Build** `pages/LayoutCanvasPage.tsx:115` *(code comment)* | comment says `CLAUDE.md` positions Caspr on **1M+** | stale — `CLAUDE.md` now says 25M+. Update or delete | Same. A comment, but it will mislead the next dev |
| 3 | **Build** `pages/onboarding/FirstTimeUserPage.tsx:102` | "15 minutes.  100 pages.  Cited to source." | **"Not an assistant. An analyst."** | §5 — retired hero |
| 4 | **Figma** `1171:4` (First-Time User — Desktop, 22px) | same string | same | §5 — keep file and build in sync |
| 5 | **Figma** `1289:385` (First-Time User — Mobile, 20px) | same string | same | §5 |
| 6 | **Specs** `app-shell-framework.md` §17 · `report-style-guide.md` §9a | rationale rests on *"zero hallucination"* | restated — **done, see Part B/6.5** | §4 retired claims |

### A.2 Verified clean — no action

- **"Zero hallucinations"** — no user-facing instance in the build or Figma. The only two occurrences were the §6.5 *rationale* lines, now restated.
- **"LAM" / "Large Analysis Model"** — zero instances anywhere.
- **"SOC 2 certified"** — zero instances.
- **Source counts** — every *spec* reference already says 25M+. Only the build's Help page lags.
- **Citations framed as verification** — **zero instances.** Every `verify` hit across `docs/product` is JWT, OTP or phone verification, or a build-process instruction. The citation-adjacent user copy that exists reads as *readiness*, already correct: *"cited, never leaked"* (Data Room), *"boardroom-ready, cited to source"* (Documents).

### A.3 Space check on the hero — measured, not assumed

Measured live at 390×844. The hero is **Instrument Serif 17/17 in a 358px column**, currently one line.

| String | Lines | Height |
|---|---|---|
| Current — "15 minutes. 100 pages. Cited to source." | 1 | 17px |
| Proposed headline — "Not an assistant. An analyst." | **1** | 17px |
| Proposed sub-line — "Any question your board will ask — answered, sourced, and ready before they ask it." | **2** | 34px |

**The headline swaps one-for-one and costs nothing.** The sub-line is a genuine addition: +34px plus a gap. I had estimated four lines; at serif 17 it is two — **correcting my own earlier over-estimate.** It is affordable on the first-time-user page, but it is not free, and the brief presents it as a straight swap.

**Recommendation: take the headline; treat the sub-line as a separate decision.**

---

## Part B — The six proposals

### 6.1 "Every claim, triangulated" → **fold into 6.6. No new feature.**

**The brief's premise does not hold.** `app-shell-framework.md:127` specifies the red dot is placed *"wherever there is a source to cite **or a calculation to explain**"*, and its first reply answers *"where does this number come from? **how was it triangulated?**"*

And the build already performs it. `features/reader/AskCasprPane.tsx:102`:

> *"IMF's 2026 outlook puts the 2030 market at $390bn; BloombergNEF at $431bn. Caspr triangulates $412bn — a 21% CAGR — weighting BNEF's bottom-up fleet data against IMF's macro model."*

Two sources disagreeing, the derived figure, and the reason one was weighted over the other. **That is "every claim, triangulated," shipping today.**

**The real gap is discoverability, not capability** — nothing tells the user that tapping a dot yields reasoning rather than a URL. That is a framing problem, which is 6.6.

**Cost of the brief's version:** a methodology note or an expandable per figure — new component, new report layout rules, and a **second inline marker competing with the red dot**. §4 rule 2 and 6.6 both make the red dot *the* proof mechanism; yesterday's voice work explicitly reserved red for citations. Adding a second marker near figures is the most expensive mistake available here.

**Recommendation: no feature. Close it through 6.6 framing.** If anything is added later, it belongs *inside* the red-dot answer, never beside it.

### 6.2 Third evidence class (derived) → **defer.**

Real gap, correctly identified, and the brief is right that the vocabulary exists.

**But it is speculative ahead of capability.** The brief concedes the methodology is a separate session with Jayant. Designing how a derived figure looks before we can produce one risks designing for the wrong thing — and a third surface tint or typeface is exactly the drift `FIGMA-FINAL-ALIGNMENT` §1.1 was written to kill (*"two greens 20 apart"*).

**If forced to propose now:** the lightest treatment is **attribution text, not a new surface** — the existing cited class with an aggregate-style attribution line (*"Triangulated from IMF, BNEF — see reasoning"*). That reuses the grammar without adding a third visual family.

**Recommendation: defer until Jayant's methodology exists.** Revisit with real derived figures in hand. **Cost of not doing it now: none** — no user sees a derived figure today.

### 6.3 Asking-before-working → **push back, or bound it tightly.**

I agree with the *strategic* read: under "Not an assistant. An analyst," scoping and structure-approval are the identity, and `icp-personas.md` has a user saying so unprompted.

**But "more presence" cannot mean "more space."** Measured yesterday:

- The mobile Half drawer is **408px**, with the docked input pinned at drawer-y **314** — leaving roughly **250–290px** of usable thread.
- **Three states already overflow and clip** (`Ask Caspr — Mobile`, `Generation · Creating`, the State-2 ref).
- The turn gap was tightened **24 → 16 yesterday** at Joy's direction, because the pane felt *too sparse*.

Giving these moments more vertical presence pulls directly against a container that is full and was just deliberately compressed.

**And the obvious execution is already rejected.** `app-shell-framework.md:107`: questions are answered *"together, in one prose reply… never a forced one-at-a-time march (rejected: a live one-question-at-a-time thread — it turns a 15-second clarification into a typing chore right before Generate)."* The brief's own Rule 3 warns about exactly this.

**Recommendation: no structural change.** If pursued, bound it to **copy and hierarchy** — how Caspr introduces the questions, not how much room they occupy. The one place with actual space is **onboarding**, which runs the 24px centre rhythm rather than the 16px pane rhythm.

### 6.4 What the Theater dramatises → **re-scope to a label. It already does both.**

The spec answers the brief's question directly:

- `theater-visualization-spec.md:16` — *"Investigation, **not discovery**, is what's being watched."* Candidate spokes are connected from the very first frame precisely so it does not read as "look how much we found."
- `:71` — **partial resolution is the required normal case**: *"never force every spoke to eventually turn red."* Only some candidates yield something. **That is source selection, dramatised.**

So credibility and selection are already the substance. **Breadth lives in exactly one element:** the `SOURCES REVIEWED` count hero (`:206`).

**Recommendation: no animation change.** If the balance needs shifting, change the **count hero's label** — one string — so the number reads as *reviewed and judged* rather than *volume*. The locked 25:75 layout is untouched either way.

### 6.5 Two rationales rest on a retired claim → **done.**

Correct, cheap, and the only item with a genuine decay risk: a future session rebuilding from a dead claim.

**Executed.** Both rationales restated against *"every source, credible. Every claim, triangulated. Every report, defensible"*:

- `app-shell-framework.md` §17 — the reason is now that cited findings carry a **named credible source** while The Signal carries an **aggregate**; both are real intelligence, but only one can be put in front of a board *as a source*. So they must not look alike, or the aggregate borrows the cited finding's authority.
- `report-style-guide.md` §9a — same restatement.

**The treatment is unchanged and still follows** — arguably more tightly than before, since the new reason is about *attributability*, which is exactly what tint/typeface/attribution encode.

### 6.6 The red dot framed as a chore → **do it. But it is already almost clean.**

The principle is right and it is the highest-leverage framing rule in the brief.

**Audited: zero instances of chore-framing.** No user-facing string in the build or Figma asks the user to verify, check, or confirm anything about a citation. The existing copy already reads as readiness.

**So the work is not remediation — it is the missing positive.** Nothing currently tells the user what the red dot *offers*. Per 6.1, tapping one yields triangulation reasoning, and that is invisible until you try it.

**Recommendation — the smallest thing that closes both 6.1 and 6.6:** one first-run line, in the product voice, the first time a report is opened. Framed as readiness, never as an instruction. Something in the shape of:

> *Every figure carries its reasoning — tap any red dot for the sources behind it and why they were weighted.*

One string, one first-run surface, no new component, no second marker. **Cost:** a copy decision. **If not done:** the strongest proof asset stays undiscoverable, and "every claim, triangulated" remains a claim the product can back but never mentions.

---

## Part C — Close

### C.1 Sources opened

`docs/app-session-prompt.md` · `docs/product/app-shell-framework.md` (§5 red dot `:127`, clarifying-questions grammar `:107`, §17 `:528–532`) · `docs/report-guidance/report-style-guide.md` §9a `:496–500` · `docs/product/theater-visualization-spec.md` (`:16`, `:71`, `:145`, `:206`) · `docs/product/design-guidelines.md` §11.0/§11.0b/§11 · `docs/app-handoff/DEV-BRIEF.md` · `docs/app-handoff/PIXEL-AUDIT-FINDINGS-2026-08-20.md` · the running build at `08b9d38` (`HelpPage.tsx`, `LayoutCanvasPage.tsx`, `FirstTimeUserPage.tsx`, `AskCasprPane.tsx`, `DocumentsStates.tsx`, `DataRoomStates.tsx`) · Figma pages `184:2`, `184:3`.

**Not opened, and why:** `.agents/icp-copy.md` v3 and `docs/site-truth.md` §1.0 — the positioning stack is restated verbatim in the brief §4 and in `CLAUDE.md`, and no proposal here turns on ICP-specific wording. `icp-personas.md` — cited second-hand from the brief for the one customer quote in 6.3; if 6.3 is pursued, that source must be opened properly.

### C.2 Keep / depart

**Keep:** the two-class evidence system · the red dot as the single proof mechanism · the locked Theater layout and its investigation-not-discovery framing · the clarifying-questions grammar (answered together, never one-at-a-time) · the 16px pane rhythm set yesterday · all eight FINAL UI decisions.

**Depart:** only the two §6.5 rationale sentences — the *reason*, not the treatment.

### C.3 Rejected options re-checked

Confirmed already rejected in the specs, and **not** re-proposed here: one-question-at-a-time clarifying thread (`app-shell-framework.md:107`) · "Popular Opinion" as a name for The Signal (§17) · LHS-graph/RHS-list Theater, the 44:56 split, the "squarish" graph (`theater-visualization-spec.md`) · a second visual sub-type for red dots (`:127` — *"one identical red dot, no visual sub-types"*), which is what 6.1's expandable would have reintroduced.

### C.4 Flags

1. **Build copy fixes — written up:** [`app-handoff/DEV-PROMPT-POSITIONING-COPY.md`](app-handoff/DEV-PROMPT-POSITIONING-COPY.md). Items 1–2 are safe to take now; **item 3 (the hero) is held** — see flag 3a.
2. **Figma hero (A.1 items 4–5) awaits approval** — per §8, no Figma edits made.
3. **The hero sub-line is a separate decision** (A.3) — the headline is free, the sub-line costs 34px.
3a. **The hero is three lines, not one — and the brief's swap would duplicate.** `FirstTimeUserPage.tsx:95–103` stacks: `h1` *"You're in. Let's get to work."* → `p` *"Analytical AI for business professionals — analysis, not conversation."* → `p` *"15 minutes. 100 pages. Cited to source."* (the retired line). **Line 2 already carries the positioning** — *"analysis, not conversation"* says substantially what *"Not an assistant. An analyst."* says, so dropping the proposed swap into line 3 leaves two adjacent lines making one point. Joy chooses: **(a)** line 3 → the proof line · **(b)** delete line 3 · **(c)** identity in line 3 and soften line 2. **Figma (`1171:4`, `1289:385`) must change first** — we shipped a build ahead of the file once this week and it produced a bug report against correct work.
4. **6.2 needs Jayant** before it can be designed honestly.
5. **6.3 needs Joy's ruling** — I recommend no structural change; if it proceeds, it must be bounded to copy and hierarchy.
6. **6.4's count-hero label** is a one-string change I can draft once someone confirms the balance actually needs shifting — the spec suggests it does not.
