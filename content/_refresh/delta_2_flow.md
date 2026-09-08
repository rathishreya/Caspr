# Delta 2 — Product Flow (vs. content library "Product flow" + onboarding assumptions)

*Sources read (latest truth): `docs/product/gate-output-spec.md` (locked 2026-08-04, updated 2026-08-17), `docs/product/onboarding-understanding.md` (locked 2026-07-31, updated 2026-08-17), `docs/product/navigation-flow-map.md` (owner Joy, 2026-08-10). Compared against `content/_refresh/current_assumptions.md`.*

---

## CURRENT FACTS

### End-to-end path (app, post-signup)
`Welcome/Compose` —send→ **[Intent confirmation, cond.]** —pick→ **Instant structure** (Layout Canvas) → **Live refine**, with **clarifying Qs running in a drawer (Half) alongside** the structure → **Gate** —"Generate"→ **[COMPRESSION ~400ms]** → **Theatre** (nav hidden) → **Generation** → **Working / Reading** report. (`navigation-flow-map.md` §2.)

- **Intent confirmation is conditional** — shown only when deliverable intent is ambiguous: "2–4 prompt-seeded options (each = depth × type). Confident prompt → skipped." Picking one selects an **archetype**: **structure-proposal** (→ section canvas, the default path) · **brief-considerations** (→ scope + 2–3 Qs, **no canvas**) · **input-gathering / DD** (→ **Data Room first**, then structure). Layout is not universal — some archetypes skip the canvas entirely.
- **The 3–5s question-wait is a state of the layout canvas, not a separate screen.** Draft layout shows immediately; eyebrow reads `… · LEARNING`; questions are replaced by a red pulse dot + *"Reading your live pipelines to sharpen the questions…"* + `PREPARING YOUR QUESTIONS` + skeleton bars. (`onboarding-understanding.md`, Update 2026-08-17.)

### The gate
- "The gate is the **single pre-generation confirmation**... confirms **everything Caspr is about to produce**, all **pre-populated by Caspr** and all **changeable**, then commits." Scope lives in the centre (the Layout Canvas); the gate is "the *parameters + price + commit* surface." (`gate-output-spec.md` §1.)
- Parameters: **Type · Tier**, **Output formats**, **Language(s)**, **Style / template**, **Premium Data Add-ons**, **Price**, **Commit** (`Generate · $price` in-app / `Start free — first $100` in onboarding). (§2.)
- **Re-generation rule:** only changing **Tier or Type re-runs the layout** (gate re-appears). Formats, languages, style, and premium-data changes "update the gate summary + price **inline**, no re-layout." (§2.)
- **Tier-change confirmation:** once a layout has been approved, changing Tier fires a **one-time confirmation dialog**, scoped to the LHS pane only (not full-screen), with a `Don't show this again` checkbox and actions `Keep [current tier]` / `Rebuild as [new tier]`. Headline is constant — *"This rebuilds the structure."* — body copy varies by the from→to pair (six exact variants given in §2, e.g. Study→Brief: *"Brief is a 3–5 page note, not a full analysis. Caspr redraws the outline from scratch — the Study layout you approved won't come back."*). Does **not** fire on the very first tier pick. (§2.)
- **Output pricing at the gate:** the base (all tier formats, native language) is `Included`; **the only paid dimension at the gate is an additional language**; extra formats outside the tier base and re-generations happen post-analysis on the Outputs screen. An output = **one format × one language**, multiplicative (e.g. French PDF+PPTX = $5+$10=$15). Paid items sum in red into the Generate button — "the button *is* the total." (§2.2.)
- **Insufficient budget:** `Top up $54 to run` appears at the gate when budget < cost → routes to Wallet top-up. (`navigation-flow-map.md` §2.)
- **First-shot generation** produces "the **tier's default format set, in English** (not 'everything')." (§3.)
- **Output base by tier:** Brief = PDF·MD. Study/Intelligence = PDF·PPTX·XLSX·CSV·MD. Beyond-base pricing: PDF/DOCX/XLSX/CSV $5, PPTX $10, MD free — same table used at the gate and on the post-analysis Outputs screen. (§4.)

### Generation
- **"Once past the gate, generation is atomic: no pause, no stop, no mid-process edits. All changes happen after completion, through Edit mode. No pause/stop UI."** (§7 — verbatim, unchanged in substance.)
- **No queued screen.** "Jayant confirmed capacity (theater 5s→~30s then streaming); remove the queued-position path." Only a rare async "at capacity — we'll notify you" fallback, no position counter. (Update 2026-08-17.)
- **Status spine — NEW (2026-08-17):** `Learning → Analyzing → Generating → Creating` lives in the report-title eyebrow (`TYPE · DEPTH · STATUS`); narrated conversationally in the chat, not a progress bar (rule-text-rule phase dividers; user replies italicised, Caspr's mid-run notes italicised).
- **Creating cutoff — NEW:** "Creating is the v1/v2 cutoff." At Creating start, eyebrow reads `… · CREATING`, a `CREATING OUTPUTS` divider appears, and chat shows *"Finalizing your outputs — new requests will apply to the next version."* Pre-Creating edits fold into v1; **post-Creating requests queue to v2** (routing already built). This nuances the "atomic, no mid-run edits" rule: you *can* ask something mid-run, it just resolves into the next version rather than the current one.
- **Ask Caspr is the only live surface during generation.** Only window with no chat at all is gate-click → generation-start (seconds).
- **Get-to-know has no separate surface (LOCKED 2026-08-06).** It is Caspr's proactive message **at the head of the single Ask Caspr thread** — "There is nothing to navigate *between* because they are the same surface." Pane heading during this stage = `WHILE CASPR WORKS` (not "Ask Caspr"). Thread: user's original ask → Caspr's reply (*"Proposed a Study — $80. Generating now."*) → notification divider `INITIATING LEARNING BRAIN` → get-to-know as a Caspr message.
- **Engagement formats — a rotating family, not just Q&A:** Prompt·options (2×2 intent-glyph grid) · Poll (result bars) · Info visual (stat+sparkline, ambient) · Feedback (report-cover thumbnail + star rating) · Caspr update (feature thumbnail + "See what's new →"). Up to **3 per generation**, one at a time; stops on "stop" or the user's own question; never blocks the report.

### Report switcher tabs — exact current set
**`Contents · Ask Caspr · Edit · Outputs · Updates`** — five tabs. **Versions is NOT in this switcher** — it's reached from the report's `⋯` menu / actions model, separate from the pane-switcher. (`gate-output-spec.md` §8.1 and `navigation-flow-map.md` §2a both state this identically — cross-confirmed.)

Progressive activation:
| Flow stage | Active tab(s) |
|---|---|
| Conversation · Layout · Gate | no switcher at all |
| Learning + Generating (Theater/Generation) | **Ask Caspr only** — rest dimmed ~40% opacity, not clickable |
| Report complete (Working) | Contents · Ask Caspr · Edit · Outputs active; **Updates = "coming soon"** |

Per-tab behaviour, verbatim/paraphrased:
- **Contents** — the report TOC; nesting by tier (Brief flat/omitted, Study+Intelligence nested); **scroll-sync (scroll-spy)** two-way link between TOC and report scroll; current leaf row gets red-accent text, parent section gets a lighter red-number breadcrumb (never two full-red rows).
- **Ask Caspr** — "cited Q&A thread (docked input + red-dot citations anywhere in the report ⤢ open Ask scoped to that figure)." Read-only scope history at top, live Q&A below. Accessible from the generation screen onward; asking never alters the report (only Edit mode does).
- **Edit** — "contextual proposal pane (Chart/Visual families) — v1.1."
- **Outputs** — "generate/download outputs by tier (metered)" — the Generate Output screen, **card-per-output** model: `+ Generate` reopens a gate-style accordion; confirm spawns one card per format×language with a price and a remove (×); prices sum live into the Generate button. The **add-output accordion locks Tier and Data & sources** (`· fixed`, greyed, no chevron/price) — only Output formats / Language / Style are editable post-analysis.
- **Updates** — re-analyse feed, **Soon (Phase 2)**.
- **Versions** — reached via `⋯`, not the switcher (per above).

### Citations
Unchanged from the library's description: inline **red dots** anywhere in the report → tap opens **Ask Caspr scoped to that figure**; the full source list is the report's **last card**. No numbered footnotes, no separate sources tab.

### Theater
Immersive Source-Web spectacle while Caspr works; collapsible **Ask Caspr side drawer** (get-to-know + conversation) with a "Peek" collapse state to keep watching Theater. Carries the status-spine eyebrow and the Creating-cutoff system message described above. Nav is **hidden** during Theatre.

### Onboarding (signup → first run)
**Core concept: "onboarding IS the live tool, gated at the value moment."** Unauthenticated users actually run the real tool up to the point of maximum earned value, and only then hit signup.

Exact flow (`onboarding-understanding.md`, refined 2026-08-01):
1. **First-time-user page** — site nav (top-right = "Login") + welcome "You're in. Let's get to work." + prompt bar + **5 Type cards** (Market Analysis · Diligence · Deal Sourcing · Research Synthesis · Strategy — the 5 core Types only; **Depths (Brief/Study/Intelligence) stay OUT of the first run**, chosen later at the gate). ICP-personalized reordering/example-prompt-swap when the entry ICP is detected from referrer/UTM; falls back to generic if unknown.
2. **Conversation + layout** — tool converses in the pane while structure cards fill the centre.
3. **User confirms "generate" IN CHAT** (not by clicking a button). Caspr replies *"…calling my Ghost minions to read the sources…"* — **this is what starts the Theater** in the centre, and **the gate slides in inline (pane/drawer) with a `Start free — first $100 on Caspr` button and NO COST SHOWN.** Quote: *"the Theater is real work — it can't start before the user says go... the gate is no longer the trigger for anything; it's the signup capture layered over a Theater that's already earned its wow."*
4. **Signup wall** fires on **`click the gate button` OR `the Theater has played ~3 seconds`** — overlays the dimmed Theater (translucent dark from below the header). The `Start free` button stays a button, never converts to a chat nudge.
5. **Returning users** see the Login overlay instead.

Design-system note: rendered with the **web-app fonts** (Instrument Serif / Inter / DM Mono) even though the reference Figma file uses Source Serif Pro — dev must pull live `caspr-web` components (Header/Footer/Wordmark/CTAButton), not rebuild from the Figma frames.

**Sample reports — NEW, primary activation asset (Update 2026-08-17):** "a real, finished, cited report **seeded into every account**, left post-generation so Ask/Edit/Outputs are live." Mechanism documented separately (`app-handoff/SAMPLE-REPORTS.md`); content populated post-launch. This did not exist in the library's account of onboarding at all.

**Draft-title convention (Update 2026-08-17):** pre-prompt/draft analysis title reads muted "New analysis" (sentence case) — never an ellipsis; `…` is reserved for in-progress states.

### Navigation map (nav items)
- **Mobile bottom nav (restructured 2026-08-10):** **Analyses · Documents · Wallet · More.** The former Insights tab **became Wallet**; balance moved off the header into this tab; header now carries a notification bell instead. **Insights moved into "More."** More ⤢ opens a sheet: **Insights (Soon) · Data Room · Help · Account.**
- **Desktop left rail (icon + LABEL, built 2026-08-10):** top group **Analyses · Documents · Insights · Data Room**; bottom cluster **Alerts (bell, Phase 2 stub) · Help · Wallet · Account**. **No separate Settings destination** — settings live inside Account. This supersedes the older icon-only / Settings+Profile-card rail spec.
- **Insights is a genuinely new nav destination** — present in both shells, tagged **Soon** (Phase 2, teaser only, not a live dashboard).
- Documents, Data Room, Account/Wallet structure otherwise consistent with the library's existing category K/G descriptions (not the focus of this delta).

---

## CHANGED vs. the library

1. **Switcher tab set is wrong in the library.** Library says the switcher is *Contents · Ask Caspr · Edit · Outputs/Generate Output · **Versions** · Updates*. Current spec (cross-confirmed in two docs) says the switcher is **Contents · Ask Caspr · Edit · Outputs · Updates — Versions is not in it**, reached instead via the report's `⋯` menu. This affects any card that enumerates the switcher tabs, most directly **D-13**.

2. **Onboarding sequencing is more specific and partly different from a generic "prompt→layout→gate→generate" description.** The trigger to start Theater/generation is the user **confirming "generate" in chat**, not clicking a gate button — the gate itself appears *after* Theater has already started, showing **no price**, only a `Start free — first $100` CTA. Signup fires on **gate-click OR Theater-3-seconds**, whichever comes first. None of this granularity is in the library's flow line or in A-02/A-04's briefs.

3. **A-12's claim that the pre-signup gate lets you "confirm scope and price" is inaccurate** — the onboarding gate explicitly shows **no cost**; price only becomes visible once the account exists (post-signup gate instance in the normal in-app lifecycle).

4. **New conditional step: Intent confirmation** (2–4 archetype options, ambiguous-intent only) sits between the prompt and the layout. Not mentioned anywhere in the library's A-category or C-01.

5. **Layout Canvas is not universal.** Two of three archetypes bypass or defer it: **brief-considerations** (scope + 2–3 Qs, no canvas) and **input-gathering/DD** (Data Room first, then structure). C-01's brief presents "after the prompt, Caspr proposes a structured layout" as the single path.

6. **New generation-stage vocabulary:** the status spine `Learning → Analyzing → Generating → Creating` and the **Creating cutoff** (post-Creating requests queue to the *next version* rather than being silently blocked) refine the "atomic, no pause" rule the library states in C-12. The rule itself (no pause/stop) still holds, but "no mid-process edits" now has a precise mechanism (queues to v2) instead of being a flat no.

7. **"No queued screen"** — an explicit removal (2026-08-17) of a queued-position UI that may have been assumed/described elsewhere; only a rare capacity-fallback message remains, no position counter.

8. **Get-to-know reframed as a message format family, not a fixed set of "questions."** The library (via D-16's brief) describes "answer Caspr's get-to-know prompts" generically; the current spec defines five distinct engagement formats (prompt-options, poll, info-visual, feedback/star-rating, Caspr-update/link-out), capped at 3 per run, living inside the single Ask Caspr thread (no separate surface — this was explicitly un-shipped as a two-surface model on 2026-08-06).

9. **Budget-shortfall path at the gate is new content:** `Top up $54 to run` → Wallet top-up, not previously covered by any C-category card.

10. **New nav destination: Insights** (Soon/Phase 2) appears in both the mobile "More" sheet and the desktop rail. Not referenced anywhere in `current_assumptions.md`. Related: **Wallet moved from header balance to its own bottom-nav tab** (mobile); header now shows a notification bell instead. Rail no longer has a separate "Settings" — folded into Account. (Category G/K territory — flagged here because it's a nav-map fact, listed for completeness even though G/K cards are outside this delta's assigned ranges.)

11. **Sample reports are a new, load-bearing onboarding mechanism** with no prior card coverage — every account is seeded with a finished, cited sample report specifically to solve the activation-gap problem named in `CLAUDE.md` ("Immediate Priorities" #1–3). This is arguably the single most content-relevant addition in this delta.

12. Everything else the library states about the flow — Welcome → Conversation → Layout → Gate → Theater/Generation (atomic) → Working report; citations as red dots scoped via Ask; Tier-change rebuilding the layout — is **confirmed unchanged** in substance, only enriched with the specifics above.

---

## CONTENT IMPACT

### A — Getting Started
- **A-01** (What is Caspr?) — no flow content, unaffected.
- **A-02** (How to run your first analysis) — brief is a generic step list (prompt → layout → questions → run → report). **Needs a rewrite of the mid-sequence**: the confirm-to-generate step happens **in chat**, not via a distinct "Run" action, and the gate that appears is the onboarding gate (no price shown pre-signup) if this is a first-time user's first run.
- **A-03** (Prompt-writing) — no flow-sequence claims, unaffected.
- **A-04** (What happens after you hit submit) — brief omits the **Gate**, **Theater/Generation**, and the conditional **Intent confirmation** step entirely, and states clarifying questions come strictly after the layout when they can run concurrently in a drawer. Needs a full sequence correction: prompt → [intent confirmation, if ambiguous] → layout canvas (+ clarifying Qs alongside, "Learning" wait state) → gate → generate (chat-confirmed, not button-only in onboarding) → Theater/Generation (with status spine, Creating cutoff) → report.
- **A-05** (Why Caspr asks clarifying questions) — still accurate; optional enrichment: the questions arrive during a "Learning" state of the layout canvas itself, not a separate screen, with the specific copy *"Reading your live pipelines to sharpen the questions…"*.
- **A-12** (What happens when you sign up) — **factual error to fix**: the pre-signup gate shows **no price** ("scope and price" is wrong — should be "scope; price appears once you're in"). Also missing: generation is triggered by confirming in chat (not a button), Theater is already playing behind the signup wall, and the wall fires on click-or-3-seconds.

### C — Running an Analysis
- **C-01** (Understanding the layout proposal) — needs a caveat that the layout canvas is the default path but two archetypes (brief-considerations, DD/input-gathering) route differently (no canvas, or Data Room first).
- **C-02** (Adjusting the layout) — unaffected, still accurate.
- **C-10** (The gate: confirming before you generate) — accurate and well-aligned with the spec; optional enrichment: mention the insufficient-budget path (`Top up $X to run`).
- **C-11** (Changing scope at the gate) — accurate on substance (Tier change rebuilds, one-time warning); could be enriched with the exact confirmation-dialog mechanics (scoped to the pane only, "Don't show this again," the six from→to copy variants) if the help card ever needs to match an on-screen dialog verbatim.
- **C-12** (Can you pause a generation?) — core "No, atomic" claim still correct, but **needs the Creating-cutoff nuance**: requests made after the "Creating" stage begins don't just vanish — they queue to the next version. Should also fold in the status-spine language (Learning → Analyzing → Generating → Creating) since users will see it on screen.

### D — Understanding Your Report
- **D-01** (How to read your report) — unaffected in substance; if it lists the switcher tabs, must drop Versions from that list.
- **D-02** (Anatomy of a report) — unaffected.
- **D-03** (Verifying a citation) — unaffected, matches spec.
- **D-04** (Can you trust Caspr's numbers?) — unaffected.
- **D-05** (PDF vs. editable PPTX) — flow facts (PPTX included in Study/Intelligence base) confirmed; the **Business-plan gate on editing** is a pricing-model claim outside this delta's read scope — not contradicted here but not confirmed either.
- **D-06** (Inside an Intelligence report) — unaffected by this delta.
- **D-07** (Turning your report into a board deck) — unaffected in substance.
- **D-08** (Output formats) — **[VERIFY] flag can be resolved**: gate-output-spec.md §4 confirms this card's numbers exactly (Brief PDF+MD; Study/Intelligence PDF·PPTX·XLSX·CSV·MD; per-output $5/$10, MD free). Recommend cross-checking against `pricing-model.md` directly before fully clearing the flag, since that file wasn't part of this delta's read set.
- **D-09** (Report in another language) — **[VERIFY] partially resolved**: base-English-included + per-output multi-select pricing confirmed. But flag as **unconfirmed/open**: spec §2.2 notes "Consider a per-language premium — a translation is a rewrite, not a format-conversion... decide on Jayant's translation cost" — this is an **open pricing decision**, so today's per-output price may not be final.
- **D-10** (Changing your report's style) — accurate, confirmed unchanged (free pre-first-gen, metered after; custom templates out of launch scope, pricing model TBD).
- **D-11** (Ask Caspr, explained) — accurate; enrich with: pane heading during generation is literally `WHILE CASPR WORKS` (not "Ask Caspr"), and get-to-know lives at the head of this same thread (no separate surface).
- **D-12** (Citations) — unaffected, confirmed accurate verbatim.
- **D-13** (Versions, explained) — **needs a correction**: Versions is described in a way that could read as a switcher tab; per current docs it is explicitly **not** in the pane-switcher (`Contents · Ask Caspr · Edit · Outputs · Updates`) and is reached instead from the report's `⋯` menu. The rest of the brief (timeline, outputs pinned to versions, generated on command) is still accurate.
- **D-14** (Contents view) — unaffected, confirmed accurate including the scroll-sync and highlight-treatment details.
- **D-15** (Updates — coming soon) — unaffected, confirmed still Phase 2/Soon.
- **D-16** (Theater, explained) — **needs additions**: the status-spine eyebrow (Learning → Analyzing → Generating → Creating), the Creating-cutoff system message (*"Finalizing your outputs — new requests will apply to the next version."*), and that get-to-know is a rotating family of five message formats (not just questions), capped at 3 per run.
- **D-17** (Charts and visuals) — the docs read for this delta don't cover Edit-mode/visualization-library specifics beyond a pointer; **flag as unconfirmed by this delta** — needs a separate check against `visualization-library.md` / `design-guidelines.md` §12 (out of this delta's scope).

### E — Editing & Refining
- **E-01** (How to edit your report) — flow claim ("changes happen after completion, through Edit mode") confirmed by §7. Deeper Edit-mode mechanics (Chart/Visual families) not covered by the docs read here — **flag as unconfirmed**, defer to a pass against the Edit-mode docs.
- **E-02** (Exporting to PowerPoint) — flow/pricing facts (PPTX in Study/Intelligence base, $10 if outside base) confirmed; the **Business-plan gate specifically on editing** is outside this delta's read scope — not contradicted, not confirmed.
- **E-03** (Requesting a follow-up analysis) — should reflect the Creating-cutoff timing nuance: a follow-up asked before "Creating" starts can still fold into the current version; after, it queues to the next version.
- **E-04** (Refining a single section) — same Creating-cutoff nuance as E-03.
- **E-05** (Adding formats or languages later) — confirmed accurate against §4.1: card-per-output queue, Tier/Data&sources locked (`· fixed`, greyed) in the add-output accordion, only formats/language/style editable. No change needed; could enrich with the exact "· fixed" tag language.

### NEW cards needed
1. **"There's already a sample report in your account"** — explain the seeded sample report (finished, cited, with Ask/Edit/Outputs live) as the fastest way to see what a Caspr report looks like before running your own. Pill: **Basics**. *(Unconfirmed detail: exact framing/copy — mechanism doc `app-handoff/SAMPLE-REPORTS.md` not read in this delta; content itself is "populated post-launch" per the source doc.)*
2. **"What is Insights?"** — short coming-soon explainer for the new Insights nav tab (dashboards, Phase 2, present but non-functional). Pill: **Basics** (or **Reports**).
3. **"What happens if I don't have enough budget to generate?"** — explain the `Top up $X to run` prompt at the gate and the route to Wallet top-up. Pill: **Pricing**.
4. **"Where did Versions go?"** — short clarifier that Versions lives behind the report's `⋯` menu, not the Contents/Ask/Edit/Outputs/Updates switcher, since this is a real structural change from an earlier assumption. Pill: **Reports**.
5. *(Optional, lower priority)* **"What Caspr is doing while it works"** — a short explainer of the Learning → Analyzing → Generating → Creating status spine and what happens if you ask for something mid-run (queues to the next version once Creating starts). Pill: **Reports** or **Analyses**.

### Unconfirmed / flagged for follow-up
- D-17, E-01, E-03, E-04's deeper Edit-mode mechanics — not covered by the three docs read for this delta; needs a pass against `docs/product/design-guidelines.md` §12 and the visualization-library / EDIT-ECONOMICS references.
- D-05/D-07/E-01/E-02's "Business plan unlocks editing/PPTX export" claims — consistent with `CLAUDE.md`'s pricing summary but not independently confirmed by the three docs read here (they describe analysis **Tier**, a different axis from the monthly **plan milestone**); worth a terminology-precision pass so content never conflates "Tier" (Brief/Study/Intelligence, per-analysis) with "plan" (Professional/Business/Enterprise, monthly).
- D-09's per-language pricing — flagged as an **open decision** in the spec itself (possible future per-language premium), not just a stale-library issue.
- Sample-reports card (#1 above) — mechanism exists per the spec but its actual copy/UX isn't detailed in the docs read; treat the new card as a stub pending `SAMPLE-REPORTS.md`.

---
*Prepared for the help/blog/social content refresh. Categories F (Pricing), G (Account), H–K were out of scope for this pass except where nav-map facts (Insights, Wallet-tab move) were directly relevant to flagging new destinations.*
