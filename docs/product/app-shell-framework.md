# Caspr App — Shell & Motion Framework (Mobile-first)

> ## ⚠️ NAV SUPERSEDED — read this before trusting any nav detail below
> This doc predates the final navigation (Joy, 2026-08-10). Wherever the text below says **Home**, **Settings**, **Profile**, an **icon-only rail**, or lists nav differently, it is **out of date**. The **built rail (`626:76`) + `navigation-flow-map.md` + `DEV-HANDOVER.md` win.** Final nav:
> - **Desktop rail (labelled, icon + label):** top — **Analyses · Documents · Insights · Data Room**; bottom cluster — **Alerts (bell) · Help · Wallet (`$balance`) · Account**. No "Settings" (settings live inside Account); "Profile" is now **Account**; first item is **Analyses**, not "Home".
> - **Mobile bottom nav:** **Analyses · Documents · Wallet · More**. Insights lives in **More** (Insights · Data Room · Help · Account). The mobile header carries the **notification bell** (the wallet balance moved to the Wallet tab).
> - **Notifications:** toasts + a bell entry point exist; the **Alerts / Notification-Center screen is Phase 2** (bell is a stub until Joy designs it). See `notifications-spec.md`.
>
> The shell mechanics below (detents, work surface, motion, scrim, z-order, responsive tiers) remain valid — only the nav item names/layout are superseded.

**Status:** LOCKED — 2026-07-10 (Joy). **Amended 2026-07-13:** (1) nav rail's "Memory" destination renamed to **"Data Room"** — see `document-taxonomy.md` §B for the tagging model this now covers; (2) entry flow gains a **conditional intent-confirmation beat** and **deliverable archetypes** (§1a bullet 3, §6 phase 1b, new §6a) — the first move now forks by confirmed deliverable, so a Brief / DD no longer opens with a Study-shaped section layout.
**Scope:** Product application shell, navigation, the Caspr work surface, and motion.
**Supersedes:** the three-column shell described in `product-design-spec-draft.md §4.2` and `visual-design-language.md Part VII` wherever they conflict. Those docs remain valid for tokens, typography registers, report/editorial styling, and screen-level content.
**Reads with:** `visual-design-language.md` (tokens, five registers), `product-design-spec-draft.md` (screen specs).

Design mobile-first. Desktop and larger formats derive from this (see §9).

---

## 1. First principle

The document is the star. Caspr is one surface, not a set of panels. Chrome yields to content. Every decision below follows from these three sentences.

The earlier three-column model (persistent left file drawer + right Caspr panel) is retired. It scattered Caspr's voice across left / centre / right and never gave the document the centre cleanly. This framework gives Caspr **one home** and the document **the stage**.

---

## 1a. One front door, many roads (entry architecture)

**Every piece of work starts in one place — the prompt.** There is no "pick your use case" menu that forks users into separate sections before Caspr helps. Locked 2026-07-11.

- **Why not fork:** forcing a user to self-classify ("is this a company profile, an M&A brief, or full due diligence?") *before* Caspr engages undercuts the core differentiator — Caspr is the informed one that already knows. Prompt-detection (`brief-spec.md §Prompt Detection`) is smarter than a menu. A nav full of use-case sections also grows unbounded and contradicts the single-surface model.
- **Discovery — accelerators, not forks.** The landing surfaces use-case entry points (Due diligence · Competitive benchmark · Draft a legal memo · Ask a target audience…) as **chips/tiles around the prompt** that *prime* it and bias the flow — they do **not** wall the user into a separate section. This solves activation (the #1 problem — users seeing Caspr's range), **personalizes by ICP** (a PE user sees DD/M&A first; a consultant sees market/competitive — a fixed nav can't do that), and **mirrors the website's** use-case pages for landing continuity. The list can grow forever because it's a curated suggestion surface, not fixed navigation.
- **The flow adapts *after* the prompt, via a conditional intent-confirmation beat — amended 2026-07-13.** *(This replaces the earlier "most deliverables share one skeleton, steps emphasized by type" claim, which under-specified how differently each deliverable must* **open***. See §6a.)* A single prompt — *"Instagram sneaker business, North India"* — under-determines the **deliverable intent** (depth × job): quick market-size Brief? full market Study? business case? valuation-grade due diligence? Rendering a Study-shaped section layout by default silently re-signals the v1 failure — *"Caspr makes studies."* So:
  - **When intent is ambiguous** (the common case), Caspr's first response is **not** a section layout but a short, prompt-seeded confirmation in its own voice — *"I can take this several ways:"* → **[Quick market size] · [Full market study] · [Business case to enter] · [Assess a target's valuation]** — each a coherent deliverable bundling a depth + type. This is **not** the banned pre-menu (see *Why not fork*): the user never self-classifies into abstract categories before Caspr engages — Caspr reads the prompt and proposes concrete, specific deliverables. It demonstrates range (activation) and comprehension (anti-"just another LLM") at the exact decision moment.
  - **When intent is confident** (e.g. *"M&A target brief: Freightos Ltd"*), skip the beat and proceed directly — the same discipline as `brief-spec.md §Prompt Detection`'s clarify-only-when-ambiguous rule, applied to the *intent* axis rather than only the *type* axis.
  - **The chosen deliverable then opens into one of ~3 first-move archetypes** (not one workflow per type — that's the unbounded failure): *structure-proposal* (the §6 skeleton), *brief-considerations*, *input-gathering* (DD → Data Room first). Full table in §6a.
- **Deliverable type is a tag, never a nav section.** Every output — report, DD, legal doc, research study — lands in **Docs**, tagged by type (taxonomy workstream → `document-taxonomy.md`). "Where it lives" = Docs, always. "What it is" = a facet. Return-to-in-progress = Drafts/Continue (§13). Even a multi-week DD workspace needs no new nav — it's an in-progress document you reopen.
- **The only thing that ever forks a lifecycle is *latency*, not research-type.** Caspr's sources are a latency spectrum: indexed corpus (instant) · live pipelines (seconds) · **synthetic/AI primary research — digital twin panels (seconds)** · fielded human panels (days/weeks). The first three all fit the single flow. **Synthetic primary research is a *source*, not a section** — a premium data add-on toggled at the Gate (`pricing-model.md` already anticipates "Premium Data Add-on, opt-in, shown pre-run"), and it can appear as a candidate spoke in the Theatre. **Only fielded human primary research** (real respondents, a fielding wait, negotiated turnaround/price) is a genuinely different lifecycle — still reached via the prompt, its own spec, built much later, rare enough to defer.

---

## 2. The regions (mobile)

Three permanent regions plus one shape-shifting surface.

```
┌─────────────────────────────┐
│ Header — two-tier            │  §3
├─────────────────────────────┤
│                             │
│  Centre — the document /    │  §5, §6
│  the active mode            │
│                             │
│  ╭── Work Card ───────────╮ │  §5  (the one Caspr surface)
│  ╰────────────────────────╯ │
├─────────────────────────────┤
│ Bottom nav — persistent      │  §4
└─────────────────────────────┘
```

---

## 3. Header — two-tier, collapsing

Two stacked bars. This is the locked resolution of the "where does the title go" question (chosen over title-on-drawer, because persistence wins).

**Tier 1 — Brand bar (always present):** logo (wordmark, `assets/logo/`) left · wallet + `+` (new analysis) right. Never carries the report title. Never crowded.

**Tier 2 — Context strip (only when an analysis is open):** `‹ back` · report title (full width, truncates with ellipsis) · `⋯` actions (share / export / rename). Faint `surface-1` tint so the two tiers read as distinct. This tier is where the title lives and where per-report actions finally have a home.

Both tiers collapse on scroll — see §8.

---

## 4. Bottom nav — persistent

Four destinations. Full-screen swaps, standard mobile tab pattern.

| Tab | Holds |
|---|---|
| **Home / Caspr** | Landing; recent work; `+` starts a new analysis |
| **Docs** | Library — finished analyses, drafts, in-progress (avoid the word "chats") |
| **Insights** | Customizable dashboards (industry / geo / theme) + topic feeds. Ships tagged **Soon** — its own workstream |
| **More** | Profile, wallet, uploaded files/data |

Persistent except when hidden by scroll (§8) or covered by a full-screen surface (§5, §6).

---

## 5. The Work Card — one surface, changes size not identity

The single home for **all** Caspr interaction: the prompt, file attach, gate choices, the get-to-know-you conversation, tool education, Ask Caspr, and output selection. It is the same surface throughout the analysis lifecycle — it changes **size**, never identity.

**It is born full-screen.** At compose/brief time there is no report yet, so the surface owns the whole **centre** — not "a drawer at full height." Prompt, files, depth live here. "Full-screen" means the surface owns the centre, **not** that the shell disappears — the persistent nav stays through compose; only the theatre truly hides it (§6). A lone `×` is not enough of an escape at the entry point.

**It compresses into a bottom card** at **"Generate" — after the structure is agreed, before the theatre** (see the corrected order in §6). The full-screen brief animates down and docks into the bottom card so that the Source Web theatre gets the **entire centre** to play out. This compression is the signature Aha beat (§7). Its content becomes the card's scrollback — the brief (§10). *(Earlier drafts fired this at "Start research," before any structure existed — that was wrong; corrected in §6.)*

**It lives as a card thereafter** — Peek / Half / Full — beneath the emerging and then finished report.

**Detents:** Peek (~76px: handle + one line) · Half (~48%) · Full (~90%). **The nav (and the pane switcher / selector) stays visible below the card at _every_ detent — Full included.** A Full-detent card sits *above* the nav, never over it. **The nav hides in only two places: document read-mode** (tap-to-immerse — the user taps the document; header + nav both recede — §8) **and the Theatre** (§6, true immersion). *(Corrected — Joy, 2026-08-18: an earlier draft wrongly said Full hides the nav. It does not.)*

**Content is a deterministic function of phase** (§6). One phase → one card face. This discipline is what stops Caspr's voice from scattering again.

**The thread:** for any analysis the card reads top-to-bottom as **Brief** (prompt · depth · files · clarifying Q&A) → divider → **Ask Caspr** (live Q&A). It is the same input field the whole way; "report generation starts with Ask Caspr" is literally true — the field that took *"analyse this market"* becomes the field that asks *"about this figure."* (Scope — whole report / section / fact — is a chip on that field; design parked, see Open.)

**Clarifying-questions grammar (locked 2026-07-13):** when the pre-generation clarifying questions appear in the drawer (§6 phase 4), they are **the same conversation continuing, not a form.** Caspr's asks render in the **normal chat sans (Inter), un-bubbled and left-aligned** — *not* Instrument Serif, not a labelled "form" block — because this is literally the compose conversation relocated from the centre into the drawer at the compression beat, and it must read as continuous. The user's own turns are right-aligned soft bubbles. **The prior exchange scrolls up** (the compose prompt and any earlier turns are above, in the same thread). Questions are answered **together, in one prose reply** via the docked input — never a forced one-at-a-time march (rejected: a live one-question-at-a-time thread — it turns a 15-second clarification into a typing chore right before Generate, and reintroduces chatbot cadence we don't want). Same grammar governs the returning greeting (§16b) and the carousel copy — one consistent Caspr voice.

**Two voices — Caspr (the analyst) vs the Product (the app) (locked 2026-08-18, Joy).** Two speakers appear in the work surface, and they are visually distinct so the user always knows who is talking:
- **Caspr — the analyst.** Analytical dialogue: proposals, clarifying questions, Ask-Caspr answers. **Upright Inter, ink (`#1A1A17`), un-bubbled, left-aligned.** User turns stay right-aligned soft bubbles.
- **The Product — the app.** Everything the product says *as itself*: the relationship / get-to-know engagement during the busy phases, **and** status narration ("Initiating Learning Brain…") and account/state events (e.g. the edit-budget crossing). **Italic Inter with a small grey outline dot (`#8A887F`, ~7px) leading the line.** One voice, **two loudnesses**: **engaging** (warm `#34332F`) for relationship conversation; **quiet** (muted `#5C5B58`, smaller) for status/account notices. **There is no separate "notification" style — status is just the quiet mode of the product voice.** The red ● stays reserved for citations / Ask-Caspr and is **never** the product-voice mark.

The two registers never blur: Caspr analyses; the Product reports on itself and your account. This also bounds injection — the only things that enter the thread as *product* voice are (a) the busy-phase relationship module and status narration, and (b) discrete account/state notices; ordinary editing stays Caspr-and-user.

**Phase markers are product voice too — no third treatment (Joy, 2026-08-18).** Lifecycle phase markers (`Initiating Learning Brain`, `Generating the report`, `Creating outputs`, `Report generated · 13 Jul`) are **not** a separate label style. The earlier centred-caps-between-hairlines treatment is **retired**. The pattern is:

> **a full-width hairline, then the product-voice line beneath it — left-aligned, italic, muted, with the grey dot.**

So a phase marker is simply a *quiet-mode product line preceded by a rule*. Sentence case, never caps. This is the treatment locked in the voice comparison.

**Alignment (unchanged, and it governs both voices):** Caspr **and** the Product are **always left-aligned**, full column width, un-bubbled. **Only the user is right-aligned**, in a hug-width bordered bubble. Nothing else ever sits right.

**Applied 2026-08-18** across the Theater / Generation (incl. `failed`, `Contact support`, `Creating`) / Layout-Canvas / Ask-Caspr frames, desktop + mobile: every relationship (get-to-know) turn → engaging mode; every status narration, status recap and phase marker → quiet mode; Caspr's analytical lines left upright.

**Ask Caspr — two entry modes (mechanism confirmed 2026-07-13; the red-dot path is already built by Jayant's team):**
1. **The docked input** — whole-report or section-scoped questions, answered in the flowing cited dialogue (Caspr un-bubbled, user turns right-bubbled).
2. **Red dots embedded throughout the report** — placed wherever there is **a source to cite or a calculation to explain.** Every dot is **one identical red dot** (no visual sub-types; the answer reveals whether it's a citation or a calc walkthrough). Tapping one **opens/raises the Ask Caspr drawer, pre-scoped to that figure, with Caspr's provenance answer as the first reply** — *"where does this number come from? how was it triangulated?"* — then the user continues in the same thread. This is the interactive expression of "every insight cited to source," and the emotional core is **"the analyst on call"**: every figure in the report is one tap away from an explanation. It makes the credibility claim *touchable*, not just stated.

**The input field's screen position is fixed, always** — this is the concrete consequence of "same input field the whole way," and it's a hard rule, not a guideline. On the 390×844 mobile shell, the field sits with its top edge at **y=744** (absolute, measured from the shell's own top) in **every** state: centre-only / no drawer (Compose, instant structure, live refinement — phases 1–3, where there's no drawer chrome at all, the field sits directly on the canvas), Peek, Half, and Full. It never moves to make room for other content — other content (structure cards, questions, gate options) is laid out *above* it in whatever space remains, and a drawer that needs more room grows **upward** (its bottom edge stays pinned) rather than pushing the field down. In Full detent the **nav still shows** (see §5 Detents — Full does *not* hide the nav), so the field sits at y=744 with the nav in its usual place below it, exactly as at every other detent. Built as a real component, **Docked Input Bar** (`🧩 Components — Core`) — paperclip leading (visible empty-state per the attach spec), placeholder text (per-screen override), red/grey send trailing. Every screen uses an instance of it, never a hand-copied frame.

---

## 6. Lifecycle sequence + detents

**This order is corrected (2026-07-11) from the original screen spec and from earlier drafts of this doc.** The key inversion: the **structure and questions come first — fast and cheap — and the Theatre fires *after* the user commits ("Generate"), not before.** Theatre is the deep source-research for an already-agreed structure, feeding Generation directly — it is not "figure out what to research."

| # | Phase | Centre | Work surface (drawer) | Nav |
|---|---|---|---|---|
| 1 | **Compose / Brief** | The surface owns the centre (greeting · prompt · file attach) | *is* the centre | visible |
| 1b | **Intent confirmation** *(conditional — added 2026-07-13)* | **Only when deliverable intent is ambiguous:** the surface offers 2–4 prompt-seeded deliverable options in Caspr's voice (*"I can take this several ways…"*), each bundling a depth + type. **Skipped entirely when intent is confident.** The pick selects the first-move archetype for phase 2. See §6a. | *is* the centre | visible |
| 2 | **Instant structure** *(structure-proposal archetype)* | For a Study / Business case, the surface resolves into section cards, **near-instant, from the indexed corpus — no spinner, no animation.** The *absence* of visible work is the aha: Caspr already knows the domain. **Other archetypes open differently here — a Brief shows considerations + refining Qs, DD asks for the Data Room — see §6a.** | *is* the centre | visible |
| 3 | **Live refinement** | Cards update and bullet points fill over a few seconds as live pipelines ping. Light per-card treatment (subtle fade-in) — **not** the starfield; that's reserved for §Theatre. *(Structure-proposal archetype; other archetypes may skip.)* | *is* the centre | visible |
| 4 | **Clarifying questions** | Structure canvas (may update as answers come in) | Card · Half — the clarifying questions | visible |
| 5 | **Gate** (style · language · template · **premium data / Data Room selection / final files**) | Structure canvas | Card · Half — the gate choices | visible |
| — | **"Generate" → COMPRESSION** | *(brief + structure + answers dock into the bottom card)* | — | — |
| 6 | **Theatre** (Learning Brain / Source Web) | Source Web plays **full-screen** — deep-researches sources *for the fixed structure*; **does not alter the structure.** Full spec: `theater-visualization-spec.md`. | Card · Peek (narration) | **hidden** (only true immersion) |
| 7 | **Generation** | Report builds progressively into the agreed structure | Card · **Peek = status / Half = engagement carousel** (§16) | visible |
| 8 | **Reading** | The finished report | Card · Peek (Ask Caspr); brief in scrollback | visible (collapses on scroll, §8) |

**The pivot (compression → theatre) fires at "Generate"** — after structure and questions are settled, so the theatre owns the full screen and researches a structure that's already locked. For the **structure-proposal** archetype, phases 2–3 (instant structure + live refine) are "Aha Moment 1" — the aha is speed + evident domain knowledge, not spectacle. For the other archetypes (§6a), the equivalent aha lands one beat earlier, at the **intent-confirmation** step: Caspr reading a bare prompt and offering the *right several ways to take it* is itself the "it already understands" moment.

**Note on "Generate":** the Gate's confirm is a plain **Generate** button *unless* the user chooses to keep refining (more prompt detail, more files) — refinement loops back through 2–5 without committing. Committing is the only thing that fires compression.

---

## 6a. Deliverable archetypes — how the first move forks (added 2026-07-13)

The §6 lifecycle is the **structure-proposal** path — correct for a Study or Business case, and *misleading* for others: an instant section-card layout is already a commitment to one deliverable shape, so rendering it by default for a Brief or a due diligence mis-signals what Caspr is (the v1 "study generator" problem). After the intent-confirmation beat (§6 phase 1b / §1a), the chosen deliverable opens into **one of a small, closed set of first-move archetypes.** The set is deliberately capped — one workflow per research-type is the unbounded failure §1a bans; these collapse many types into few *opens*:

| Archetype | Deliverables (research types) | First move — *replaces §6 phase 2* | Then |
|---|---|---|---|
| **Structure-proposal** | Study, Business case, Market sector, Market sizing, Strategic options, Competitive landscape | Instant section-card layout (§6 phases 2–3) — the domain-knowledge aha | → clarifying Qs → Gate → Generate |
| **Brief-considerations** | Any deliverable at **Brief** depth | **No section canvas.** A tight scope confirmation + 2–3 refining questions. A Brief is a briefing note by definition (`brief-spec.md`); a multi-section layout oversells what $15 buys. | → Gate → Generate (short) |
| **Input-gathering** | Due diligence · *(later: primary research)* | **Ask for the input first.** DD → *"point me to the Data Room"* (file-attach heavy) **before** proposing any public-source structure — the user's own data is the spine, not an afterthought. | → ingest → structure → Gate → Generate |

**Design rules that keep this from sliding back into a fork:**
- **Depth and type resolve together, not as two menus.** Each intent-confirmation option bundles a depth + type (e.g. *"Assess a target's valuation"* = `due_diligence` × Intelligence; *"Quick market size"* = `market_sizing` × Brief). This **subsumes the earlier "type-aware depth gate" idea** — don't ask depth and type as separate questions; offer bundled deliverables and back both out of the one the user picks.
- **Primary research is a *deferred* archetype.** Per §1a, fielded human primary research is a later/rare lifecycle and synthetic panels are a **Gate-level source add-on**, not a front-door deliverable — so the *"survey ready, or build one?"* open is **future, not v1.** The model must not preclude it; we don't build it now.
- **All archetypes share infrastructure and land in Docs** (§1a: "deliverable type is a tag, never a nav section"). What forks is the **handholding**, not the navigation — no new nav destination, no self-classification menu.
- **The archetype is a consequence of the confirmed intent, never a fourth thing the user picks.** The user picks a *deliverable*; the archetype is how Caspr opens it.

---

## 7. Motion grammar

- **The compression is a signature beat**, not a generic slide. It is the emotional pivot of the whole flow — the moment the user's conversation visibly folds into the card and the machine takes the stage. Treat it with the same care as the Source Web → badge shrink already in the motion spec; they are the same motion family.
- **Dual collapse** of header + nav on scroll (§8).
- **Tap-to-toggle** immersive reading (§8).
- Durations/easings inherit `visual-design-language.md Part VI`. Compression uses a page-level transition (~400ms, `--ease-standard`) with the surface scaling/translating to the docked card rect while the centre wipes in.
- `prefers-reduced-motion`: compression becomes an instant cut (brief is already in the card; report space simply appears).

---

## 8. Scroll & immersion

Principle: hide **ambient** chrome; keep **orientation + the core action** reachable.

**Hide on scroll-down, restore on scroll-up (and at top / bottom of document):**
- Bottom nav (~56px reclaimed)
- Brand bar (Tier 1) (~52px reclaimed)
- The Ask Caspr peek bar

**Collapse, don't kill:** the two header tiers **merge into one thin bar** carrying just `‹ back` + truncated title. Orientation never disappears — this is why the context strip (§3) beats title-on-drawer.

**Never fully hidden:** a way back, and a way to summon Ask Caspr — the collapsed bar keeps an Ask icon, or a small floating pill appears once the peek bar hides.

**Tap-to-toggle immersive read:** a single tap on the document drops **all** chrome for full-bleed reading; tap again to restore. Coexists with scroll-hide (scroll for casual browsing, tap for deep reading of a long document).

---

## 9. Desktop & other formats

- **Desktop:** the bottom nav becomes a **full left rail** — every destination laid out, nothing compressed into "More". Top group: Home · Docs · Insights · Data Room. Bottom-aligned utility group: Settings · Help. Below that, an **Account Cluster** (§9a) — Wallet and Profile as elevated status cards, not plain rows. The two-tier header persists (back · title · ⋯). **The Work Card stays a bottom pull-up** (as on mobile) on working screens — *not* a side console (this corrects an earlier draft of this doc). The document keeps the centre.

### 9a. Left Rail replaces "More" entirely — no desktop equivalent screen (locked 2026-07-18)

Mobile's "More" hub existed to compensate for the bottom nav's limited slots (4 tabs). Desktop's full rail already surfaces every destination More hid — Data Room, Wallet, Profile, Settings, Help are all persistent rail items/cards. **Do not build a desktop "More" screen** — it would just be a redundant list of things already one click away in the rail. Sign-out (More's one item with no rail home) is reachable as a confirmation overlay from Settings instead (see below).

**Confirmation overlays on desktop (locked 2026-07-18):** transient confirmations (sign-out, delete) are NOT full-width bottom drawers on desktop — that treatment is reserved for the Work Card's real content states. A confirmation is a centred modal card (~480px, capped width, not edge-to-edge) over a dimmed backdrop, bottom-anchored flush to the shell's bottom edge, same emphasis pattern as mobile (default/safe action visually heavier — e.g. black "Stay signed in" — than the destructive one).

**Expanded Shell mechanics (implementation note):** the Content Column's three children (Context Bar · Content · Bottom Drawer) sit in a VERTICAL auto-layout — this is intentional, not a bug: Content has `layoutSizingVertical: FILL`, so it automatically fills whatever space remains between the (optionally hidden) Context Bar and the (variant-sized) Drawer, keeping the Drawer flush to the bottom without manual y math. Only override this (`col.layoutMode = 'NONE'`) for screens with no drawer where Content should take the full 900px height — and if you do, don't also try to keep a drawer as a sibling, since a fixed-height Content will push the drawer out of frame.

**Desktop content geometry — margins, gaps, layout-mode discipline (locked 2026-07-19, fixing a real bug).** Found on review: Structure (both states) and Gate had cards touching edge-to-edge with no gap, hugging the left edge instead of sitting centered under the drawer, and the drawer's docked input bar sitting at a different inset than the cards above it. Root cause: `Content` itself (not just the Content Column wrapper above) ALSO ships as a VERTICAL auto-layout frame by inheritance from the master — a second, independent auto-layout scope nested inside the first. Manual `.x`/`.y` on ITS children silently collapsed to `x=0` with `itemSpacing=0`, wiping out both the intended margin and the gap between cards. Same failure mode, one level deeper than the Content-Column-level mechanic above — easy to fix one and miss the other, which is exactly what happened. Rules, now mandatory for every desktop content build:
1. **Every content-bearing frame gets `layoutMode = 'NONE'` before manual positioning — no exceptions, checked at every nesting level** (Content Column wrapper, `Content` itself, the Drawer's inner `Content`). Never assume a frame is already free-form because a sibling or parent was fixed.
2. **Canonical margin: 40px each side of the 880px Content Column → 800px usable content width.** This same 40/800/40 split applies uniformly to the Context Bar title, `Content`'s cards/text, AND the Drawer's inner content — so everything shares one left/right edge and reads as a single aligned column. Any full-bleed exception (Reading's cover) is a deliberate, named exception, not a default to reach for.
3. **Card/section vertical rhythm: an explicit gap, never `itemSpacing = 0`.** Stack cards with either real auto-layout carrying a deliberate `itemSpacing` (12px, matching mobile's card gap) or manual y-positioning with a GAP constant added between each card's bottom and the next card's top. Cards should never render edge-to-edge unless that's a named "seamless list" design — none of our card content is.
4. **The Drawer's outer frame always matches the Content Column width exactly (880px, flush `x=0`) — it never carries its own margin.** Only its INNER content gets the 40px margin from rule 2. A "drawer looks off-center" symptom is usually not the drawer's own position — check the content above it for a lost margin first.
5. **Verify with actual values, not just a screenshot.** A screenshot at typical build-time zoom (0.6–0.7×) can make a margin/gap bug look plausible, because sequential top-to-bottom order survives even when the margin and gap are both wrong. After building, read back `layoutMode`, `itemSpacing`, and a child's `x` directly to confirm the frame is actually in the state you intended — especially on anything cloned from a component master.

### 9b. Left Rail — top row, icon set, account cluster (locked)

- **Top row:** wordmark left, `+New` right — same row, both pinned to the wordmark's 24px height (not a stacked row below the logo). The button is a 24×24 red circle, not the larger 36px mobile-header version.
- **Every nav item gets its own icon** — no shared/generic glyph. Set: Home (house) · Docs (page with folded corner) · Insights (trending-up arrow) · Data Room (folder) · Settings (sliders — three horizontal tracks with offset knobs, *not* a sun/cog silhouette, which reads as brightness) · Help (question mark in a circle). Icons are 20px, stroke `text/secondary` (red + `accent/default` only for the active state, as on Home).
- **Account Cluster** (bottom of rail, below Settings/Help): Wallet and Profile are **same-size bordered cards** (188×68, radius 10, 1px `border` stroke, white fill — not plain nav rows and not full-black like the mobile wallet card, which would be too heavy at rail width), each with a **right-aligned outward chevron**. Wallet: `WALLET` eyebrow (red, Inter Semi Bold 9px) · balance in DM Mono 16px (matches the header wallet chip's numeral treatment) · plan tier beneath. Profile: avatar + name in Instrument Serif 16px (identity, not wayfinding — consistent with §11e) + role beneath, mirroring the info density of the mobile Profile identity card. Rationale: on mobile the header chip keeps the balance ambient at all times; desktop has no header, so the rail's account cluster is what carries that ambient status.

- **Report rendering:** every report opens with a **cover** mirroring the PDF cover page — a dark, sector-photographic zone with title, depth mark, badge, date; **Brief and Study covers differ** (`report-style-guide.md` / `brief-design-v2.md`). The cover brings colour to the minimal white app. Report body = **one block per section**: **cards on web**, **divider-separated on mobile**.
- **Responsive strategy — two archetypes, not per-device.** We never design per device (that never ends — tablets, foldables, native). We design **two archetypes chosen by available width:**
  - **Compact** — single column · **bottom nav + bottom drawer** (phones, tablet portrait, folded foldables).
  - **Expanded** — **left rail + centred column + bottom drawer** (desktop, tablet landscape, large tablets, unfolded foldables).
- **Responsive backbone:** the content column is fluid — `min(880px, 100% − margins)`. That single rule *is* the reflow; only the **chrome (nav)** switches archetype. Switch at **~1180px** ("does the rail + 880 + comfortable margins fit"): `< ~1180 → Compact`, `≥ ~1180 → Expanded`. Consequence: most tablets are Compact; large tablets/laptops/desktops Expanded. **Tablet portrait = Compact** (thumb-first, mobile-first-consistent).
- **Reflow within an archetype** (implemented in CSS; Figma shows representative widths only): cover grid 2-up Compact → 3–4-up Expanded (column caps 880); drawer full-width Compact / 880 Expanded; cards, lists, forms single-column capped at 880.
- **Native apps:** archetype-agnostic **atoms + molecules port directly** (tokens, buttons, covers, chips, drawer contents). A native app = Compact archetype + native shell conventions (safe areas, gestures); iPad = Compact/Expanded by orientation. Only the *shell* is ever platform-specific. Web-first, native-ready — build nothing native now, block nothing native later.
- **Component consequence:** build **two shells — Compact and Expanded** (each with its own nav + drawer chrome); **atoms and molecules are shared, built once.** Showcase each shell at a representative width (390 Compact · 1440 Expanded) + one tablet check (~834 Compact) to validate reflow — those are compositions, not new components.

---

## 10. The brief / provenance

The pre-generation conversation (prompt · depth · files · Caspr's clarifying questions and the user's answers) is the **brief** that produced the report — provenance, not disposable chat.

- It lives at the **top of the Work Card's thread** for that analysis; reachable by scrolling the card up, or via `⋯ → View the brief`.
- Framed as a **structured record** (Prompt · Depth · Files · Clarifications), not a bubble transcript — this honors the "not a chatbot / no persistent chat log" principle while still giving people their conversation back.
- **Incomplete briefs** (abandoned before generation) live in **Docs** as in-progress; reopening one restores the Work Card to that point.

---

## 11. Layout — one centred column, chrome in the margins

- **A single fixed, centred content column (~880px)** is used by *every* surface — chat, Documents, Wallet, Profile, report. Mobile-first; canvas shows on both flanks on desktop. (Validate exact value in Figma; 920 is the ceiling before reading measure suffers.)
- **The centre section spans the full width right of the rail — flanks included — filled with the centre's tone; content is merely width-limited (~880) and centred within it (revised 2026-07-19).** Earlier drafts treated the flanks as a distinct "reserved canvas lane for chrome," which boxed the 880 column as a panel floating in canvas and made the floating header's tone bleed into the mismatched margins. **Do not box the column.** The area right of the rail is ONE surface (white on sheet-modes, canvas on card-modes, per §12); the header, drawer, and cards read as distinct elements *on* that surface. (The v1.1 edit rail, when it ships, defines its own re-flow, §15 — it does not pre-reserve a canvas margin now.)
- **v1 centering (locked 2026-07-18):** with no edit rail live yet, the 880 column centres **symmetrically in the space remaining after the rail** — `column.x = railWidth + (shellWidth − railWidth − 880) / 2`, giving equal left/right margins (170px each at 1440 shell width). Do NOT reserve an oversized dead right margin for the not-yet-designed edit rail — an empty lopsided margin reads as broken layout, not "reserved space." Edit mode (v1.1) is a distinct mode (§15) and gets to define its own re-flow when it ships; v1's balance shouldn't be sacrificed for it today.
- **Desktop nav = expanded with labels by default** (icon + label, Claude-style), collapsible to an icon rail. Top group: Home · Docs · Insights · Data Room. Bottom-aligned utility rows: Settings · Help. Below that, the Wallet/Profile Account Cluster (§9a). `+New` sits top-right of the rail, beside the wordmark.
- Report body text may indent to ~740 within the 880 column for reading measure; section headers, callouts, and tables use the full width.

### 11a. Alignment — left by default, centred only for threshold moments

**Locked 2026-07-13.** The rule encodes one question: *is this surface asking for one thing, or is it content to work through?*

- **Left-align by default.** Caspr's register is FT / Bloomberg / The Economist — serious analytical content is left-aligned, and left is what creates the **scan spine** everything hangs off: section numbers, list rows, form labels, bullets, citations. This is ~90% of the app — report body, structure cards, gate, settings, wallet, help results, Data Room, Documents.
- **Centre only "threshold moments"** — a surface that is a **single focal object with no reading flow, list, or scan structure**. The eye should land on it as one object, not read down it:
  - the greeting / **Compose** invitation (the only lifecycle screen that qualifies),
  - full-screen empty states ("no documents yet"),
  - confirmations (the sign-out sheet's title + body),
  - terminal success / completion moments.
- **Never centre** anything with internal structure or multiple fields: report body, cards, gate options, settings groups, data tables, any multi-field form. Centring these is the single fastest way to make an analyst tool read as a consumer app.
- **Desktop:** identical logic. Centred content centres **within the ~880 column**, never the full viewport — the column's own centring in the viewport is *layout*, not text-alignment, and the two must not be conflated.

**Consequence for Compose (and the fixed-input rule, §5):** Compose is a centred hero — headline, prompt, accelerator chips, footnote all centred, composed vertically as an invitation. This does **not** contradict the input field's fixed y=744 position, because that invariant binds **once an analysis exists** (phase 2 onward, §6). Compose is pre-analysis: the prompt is the hero, and it **docks down into the Peek drawer at the y=744 slot on first send** — the first beat of the input's journey (hero → Peek → Half → compression).

### 11b. Page titles — every screen gets one; the report's strip is not the pattern

**Locked 2026-07-13.** Every screen carries a title (a nav label is small, peripheral, and 800px away at the bottom — it does not do a title's job). But the **§3 context strip is reading-mode chrome** — a tinted band that persists, collapses on scroll (§8), and carries per-report `⋯` actions. Wearing it on Settings makes Settings look like an open report. Two distinct treatments:

- **Open report** (Reading · Generation · Structure · Gate) → the **§3 context strip**, unchanged. It earns the band: it persists, collapses, and has real actions.
- **Every other screen** → a **title row**, one line, ~52px:
  - **Serif title (Instrument Serif 24px) at x=16** — on the same left spine as the cards and rows beneath it. A leading chevron would push the title off that spine; this is why the icon goes right.
  - **Right-side action, vertically centred to the title** (it is a control sharing a row, not a word in the title's sentence — baseline-aligning makes it sink under the serif).
  - **No rule beneath** (revised 2026-07-13, Joy) — a hairline was tried and cut: it added a line under an already-strong serif title, and was inconsistent with the serif *section* headers (Settings) which carry no rules. Whitespace separates the title row from content.

**The right-side action reflects what leaving actually means** — "Back everywhere" is wrong, because half these screens have no parent:

| Screen type | Right side | Goes to |
|---|---|---|
| **Tab root** (Documents, More, Home, Insights) | *nothing* — title only | — (you arrived via the tab; there is no parent, and no tab bar puts Back at its root) |
| **Drill-in** (Wallet · Settings · Help · Data Room) | **"Back"** (text, not a glyph) | its parent (More) |
| **Picker with a confirm** (Data Room opened from the Gate) | **"Cancel"** | parent (the Gate), **discarding** changes |
| **Open report** | context strip `‹` + `⋯` | wherever it was opened from |

**"Back" as a word, not an arrow:** it sits in the register the app already speaks (same weight/colour as "Sign out", "Upload a file"), and a word cannot be misread the way a left-pointing chevron on the *right* edge can. **"Cancel" on pickers is not cosmetic** — a picker already has a commit button, so "Back" would leave it ambiguous whether exiting applies or discards the selection. Cancel discards, the button applies: the standard picker contract.

### 11c. The primary commit button — fixed at y=686

**Locked 2026-07-13.** The prompt bar owns a fixed slot at **y=744–780** (§5) and the nav starts at 788, so a bottom-pinned button cannot go below 744 — it must sit *above* the prompt bar. That leaves exactly one position:

- **y=686, height 46, width 358, 16px side margins** → bottom edge 732, clearing the prompt bar by 12px.
- **The same position whether or not a prompt bar is present.** Where there is none (Help's ticket form), ~56px sits empty below it — the cost of one memorable location.
- **Why beyond consistency:** 686 is in the one-handed thumb zone, and a commit action that never moves builds muscle memory — you stop *looking* for Generate.
- **Scope:** the screen's **single primary commit action** (Generate · Send to support · Use these N files). **Exempt:** inline/secondary buttons that flow with content (Wallet's Top up / Increase budget — list actions, not the screen's commit), and modal action sheets (sign-out), which are transient overlays with their own internal layout.

**Desktop derivation — fixed y=840 (input) / y=782 (button), locked 2026-07-19 (revised same day).** The desktop build initially missed this rule entirely — the input bar and commit button floated to whatever y fell out of each drawer's own height, exactly the bug the mobile rule exists to prevent. Ported by re-deriving the same invariant against the desktop shell's own floor:
- **Mobile's invariant is "distance from the floor," not a memorable absolute y.** Mobile floor = 788 (shell 844 − nav 56). Input top = 744 = floor − 44. Button top = 686 = floor − 102 (= input − 12 − button height).
- **Desktop has no bottom nav — the drawer sits flush to the shell's bottom edge (900).** The first port naively used floor = 900 → input 856, which left the input bottom only **7px** above the raw screen edge with *nothing below it* (mobile's 8px works only because a 56px nav sits below providing mass). That reads as jammed. **Corrected: the desktop drawer carries a 24px bottom breathing inset — the desktop equivalent of the mobile nav's mass — so the effective floor is 900 − 24 = 876.**
  - **Input bar top = 876 − 36 = 840** (24px clear below it to the screen edge; width 800, 40px side margins per §9b).
  - **Primary commit button top = 840 − 12 − 46 = 782** (12px above the input; same rule as mobile — same position whether or not a companion input sits below it: Help's ticket-form "Send to support" has no input row, still sits at 782).
- **Peek drawers grow from 76 → 92 on desktop.** A 76px Peek can't hold the handle + input with 24px bottom breathing (it crowds the handle at the top). At 92 the drawer bottom stays flush at 900, top moves to 808, and the handle keeps ~15px clearance above the input. Half/Full/custom-tall drawers are unaffected (already tall; the input just moves up 17px within them).
- **Applies to every desktop drawer with a docked input and/or primary commit button** (Structure ×2, Gate, Reading, Help's escalation form) — verified against all, not just the one a bug report named.

### 11c-bis. The floating header — how the desktop column is grounded (locked 2026-07-19)

An 880-wide centred column floating on an undifferentiated canvas reads as "floaty" — the column has no top edge and (before this) shared the exact canvas tone of the dead margins, so nothing said *where the workspace was*. Rejected fixes, in order: a larger serif masthead title (didn't generalize, competed with content), a tonal margin shift, and a framed-lane hairline (too weak on taupe-on-taupe). **Locked solution: a floating header bar that mirrors the bottom drawer**, bracketing the workspace top-and-bottom.
- **Geometry mirrors the drawer exactly:** 880 wide, same x-origin (flush with the drawer's left/right edges), 16px corner radius, soft drop shadow (drawer casts up `offset y −3`; header casts down `offset y +3`, same 20px blur / 10% black). Fill `#F6F5F3` (surface/1) to match the drawer. It floats: 16px gap above (from shell top), content starts at **y=88** (16 pad + 56 header + 16 gap).
- **Two content treatments, matching the two approved mobile header patterns (locked 2026-07-19):**
  - **Document header** — for *in-document* report screens (Structure ×2, Gate, Generation, Reading): **‹ back chevron · title · ⋯** overflow. Mirrors the mobile two-tier Context Strip. Component `Floating Header — Desktop`.
  - **Page header** — for *every non-report screen* (Wallet, Budget, Help ×2, Data Room ×2, Settings, Profile, Documents, contextual Data Room, sign-out bg): **title · action-word on the right**, NO chevron, NO ⋯. Mirrors the mobile treatment-F row (§11b "Back as a word, not an arrow"). Component `Floating Header — Page`. The action word is **"Back"** for drill-ins, **"Cancel"** for pickers (contextual Data Room — the picker contract, §11b), and **absent** for tab-roots reached straight from the rail with nowhere to go back to (Documents). This resolves the earlier "back-chevron on tab-roots is meaningless" flag — the word treatment already carries the distinction, so no boolean prop was needed after all.
- **Title in Instrument Serif 20** in both treatments (the same display face as a step's serif headline). In the Document header the chevron and ⋯ sit at a symmetric 20px inset; in the Page header the title and action word sit at the 20px insets.
- **Components:** `Floating Header — Desktop` (Document) and `Floating Header — Page` on 🧩 Components — Core; every desktop screen carries the appropriate instance, title + action word overridden per screen.
- **Applied to all desktop screens EXCEPT two deliberate exceptions:** **Theater** (full immersion, rail + chrome hidden — a header would break it) and **Compose** (pre-report entry hero "What are you researching today?" — no report title exists yet, nothing to put in the bar). **Reading keeps the header** *above* its dark cover (the cover drops its now-duplicate title, keeping eyebrow + subtitle + page-count) — the white masthead over the dark cover reads as editorial, not conflicting.
- **Consequence for content:** the header now carries the page/section title, so the in-content title row (the old serif title + "Back") and the Report-Creation **eyebrow + serif step-headline** ("YOUR REPORT STRUCTURE" / "Here's how I've structured this.") are removed as redundant — the header names the screen, the content gets straight to work.
### 11c-sexies. No shadows except the bottom drawer (locked 2026-07-19)

**The bottom drawer is the ONLY surface in the app with a drop shadow.** Everything else — the floating header, report-page boxes (§12 squared pages), cards — sits flat, separated by tone/hairline, never elevation. A first build added a shadow to the floating header (to visually match/pair it with the drawer) and to the Reading/Generation report-page boxes (a "paper lift" for realism) — both wrong: stacking soft shadows everywhere is a 2000s skeuomorphic habit, not this brand's flat, editorial register. The header is already differentiated by tone (§12) and doesn't need elevation to read as chrome; report pages are differentiated by their squared-vs-rounded radius (§11d) and sitting on the canvas desk, not by a shadow. **If a surface needs to read as "above" something else, reach for tone or the hairline first — shadow is reserved for the one surface that's genuinely temporary/overlaid (the drawer).**

### 11c-quinquies. Desktop scrollbar — for genuinely unbounded content only (locked 2026-07-19)

Desktop has no native mobile-style momentum scroll affordance, so any region whose content is **unbounded in real product use** (not just today's sample data) needs a visible scroll indicator. **Component `Scrollbar — Desktop`** (+ a horizontal variant): a 4px rounded track (`border`, 50% opacity) with a 4px rounded thumb (`border/strong`, ~35% of track length, positioned to imply "more below/right") — thin and quiet, not an OS scrollbar. Inset 12px from the region's right edge (or bottom edge for horizontal).

- **Applies to:** Reading & Generation (report sheet — a real report runs many pages, today's 1-section mock fits but production won't), Documents' "Recent" cover strip (horizontal — a library has far more than 5 items), Data Room's file list, Wallet's activity ledger, Help's search results.
- **Does NOT apply to:** anything with a fixed, small cardinality — Structure/Gate's outline cards (capped at report section count), Budget tiers (fixed 3), Settings rows, Profile's context list, empty states. Don't add a scrollbar as decoration; only where the content is structurally open-ended.
- **The test to apply going forward:** not "does this static mock overflow its frame" (it usually won't — screens are built to fit) but **"is this list/document unbounded in real usage."** A transaction ledger, a search-results list, and a multi-page report are always unbounded; a fixed settings form or a 3-tier pricing table never is.
- **Track spans the visible viewport, not the content.** For canvas-centre modes (Reading/Generation) the track stops where the overlay drawer begins (§12) — it represents the visible page window, not the sheet continuing behind the drawer.
- **Position: flush to the true screen edge, not inset near the 880 column's own edge (fixed 2026-07-19).** First build put it inside `Content`, 12px from the column's right edge — inside the ~170px reserved margin, floating with dead space on both sides. Wrong: a scrollbar belongs to the *scrollable viewport* (everything right of the rail), not to the narrower content measure inside it, exactly like a native browser scrollbar sits at the window edge regardless of how narrow the reading column is. **Fix: reparent to the shell (not `Content`), `x = shellWidth − 4 − 16`.**
- **Exception — a scroll region NESTED inside a bounded panel (a drawer, a modal) gets its OWN scrollbar at THAT panel's edge, not the screen's.** This isn't a contradiction of the rule above — it's the same principle at a smaller scope: the scrollbar always belongs to its nearest scrollable container. Documents' library grid/list, scrolling *inside* the drawer, uses `x = drawerWidth − 4 − 16` (drawer-relative), because the drawer is itself a self-contained floating panel, the way a sidebar or a card with internal overflow gets its own scrollbar in any desktop app. A page-level region (Reading's sheet, Wallet's ledger) uses the shell-edge rule above; a panel-nested region uses the panel's own edge.

### 11c-septies. Documents library — grid and Details (list) views, both scroll vertically (locked 2026-07-19)

Documents' "Recent" surface was first built as a single horizontal row of covers with a horizontal scrollbar — wrong on two counts: the library is conceptually a **grid** (many rows), not a filmstrip, and a grid scrolls vertically. Fixed: the drawer now shows **2+ rows of covers**, clips (`clipsContent`), and scrolls vertically via the nested-panel scrollbar rule above.

**Added a second view — Details (list)**, matching the Windows Explorer / Finder "list view" pattern, for scanning many documents by metadata rather than browsing covers:
- **A view toggle** (two small icon buttons, grid | list, 28×28, active state = `surface/2` bg + `accent/default` icon) sits top-right of the "Recent" row, present on both views so switching is always visible.
- **Details row: no cover thumbnail** — just a title (Inter Medium), a small Depth Badge (cloned from the existing component, not redrawn) for Type, then Sector / Tags / Date in plain `text/secondary`/`text/tertiary` columns, separated by a column-header row and hairline row dividers (`border`, 60% opacity). This is deliberately minimal — the badge is the only "visual," everything else is text, optimized for scanning density over browsing.
- **Column widths must clear the widest badge label** — `INTELLIGENCE` is meaningfully wider than `STUDY`/`BRIEF`; size the Type→Sector gap off the actual widest badge, not the shortest.
- Both views live as separate frames for now (`Documents — Desktop`, `Documents — Desktop (Details view)`) since Figma can't express interactive state toggling — flag to engineering that the toggle switches between these two layouts in place, not a navigation.

**The folder-tab row shape IS the Details view, not a third toggle option (revised 2026-07-19).** First pass added Grid/List/Folder as three separate toggled views; Joy corrected this — the folder-tab card is an *alternate visual for the one Details view*, so the toggle stays **two options (grid | list)**, and the old plain-table Details layout was replaced outright by the folder-tab version, not kept alongside it. Four further refinements from the initial mock, all locked:
1. **All text fields bottom-align to one shared baseline** (Name, Type badge, Sector, Tags, Published) — despite the row's stepped background having two different heights, the text reads as a single flat row. Anchor every field to the row's shared bottom edge (`bottomY − padding − textHeight`), not to each rect's own vertical centre.
2. **The step corner is rounded, not square** — a small radius (~8px) on the tab's outer top-right and the body's outer top-left turns the transition into a smooth curve rather than a sharp notch. Achieved as two adjacent rectangles (not a hand-drawn vector path) with per-corner radii — simpler to build and maintain than a bezier outline.
3. **No group dividers.** The "grouped by Type" tab-divider concept from the first mock is dropped — flat, ungrouped row list, which frees the vertical space the dividers took and shows more documents per screen.
4. **Cards are white** (not `surface/1`) **and the column-header row returns** (Type · Sector · Tags · **Published**, not "Date" — a report is *published*, not merely dated) since Type is no longer implied by a group header and needs its own column again. Type keeps the neutral Depth Badge (cloned, not redrawn); Sector/Tags/Published are plain text.

**Five further refinements, all locked (2026-07-19, second pass):**
5. **No hairline under the column headers** — removed; the white cards against the canvas drawer already separate header from content, a rule was redundant.
6. **Only the tab rect keeps rounded corners; the body rect is fully square (all 4 corners = 0).** The rounding lives entirely in the "tab" piece (top-left + the step corner) — the body is a plain rectangular card underneath, closer to a real folder's silhouette (rounded tab, square body) than rounding both pieces.
7. **The Type badge fill is dropped (transparent)** — it now reads as plain small-caps text, matching Sector/Tags/Published's register instead of standing out as a boxed pill (which, now that dividers are gone and cards are white, read as a redundant grey box against white).
8. **Card height trimmed 20%** (tab 44→36, body 32→26, step 12→10) — frees enough vertical room to show more rows per screen without scrolling as much; row count in the reference build went 6→9.
9. **A z-order bug fixed**, not a design change: an earlier verification step (grouping two rectangles for an isolated zoom screenshot, then ungrouping) pushed those two rects to the top of the layer stack, hiding the first row's text underneath them. Rebuilt clean. **Lesson: group/ungroup for a one-off screenshot check is not neutral — ungroup re-inserts children at the end of their new parent, silently changing z-order. Prefer a fresh isolated node or `find`-based screenshot region over group+ungroup when you only need a peek.**

**Three more refinements, all locked (2026-07-21, third pass) — this supersedes refinement 1 above:**
10. **Detail fields (Type badge, Sector, Tags, Published) vertically centre within the body rectangle's own height**, not anchored to the row's shared bottom edge as refinement 1 originally specified. All four now share one literal height (14px — the badge's frame was resized down to match, its label repositioned inside it) so centring produces one identical, pixel-exact baseline across all four columns.
11. **The Name/title text bottom-aligns to that same baseline** — i.e. to the actual rendered bottom edge of the (now-centred) detail fields, not to the row's shared bottom edge. Title and details still read as one flat row; the anchor just moved from "the row's outer edge" to "where the details actually sit now."
12. **Zero gap between the column-header row and the first card** — the first row's top edge sits directly at the header labels' own bottom edge (no added buffer). The folder tab's own shape (it steps up above the body) now supplies the entire visual separation between the header and the list, so an explicit gap was redundant.

**Outline-vs-filled tested, filled kept; two column fixes locked (2026-07-21, fourth pass):**
- **Tested an outline-only card treatment on one row** (canvas-colour fill + white stroke, matching the drawer background instead of solid white) via `figma.union()` — a true boolean merge of the tab+body rectangles into one continuous silhouette, since two independently-stroked rectangles would show a visible seam at the step (confirmed: **the two-rectangle approach cannot support an outline treatment**, only a real unioned shape can). Joy's call after comparing: **filled (solid white) reads better** — kept, outline treatment not applied further. The union technique is now the correct fallback if this direction is revisited.
- **Published-column overflow fixed.** Column was left-aligned with a fixed-width box that let long values ("2 weeks ago", "3 weeks ago") run past the card's right edge. Fixed: **Published right-aligns to a fixed edge 14px inside the card's right edge** (matching the 14px left inset used elsewhere), so every value shares one right edge regardless of string length — the standard convention for a date/timestamp column, and it structurally can't overflow again.
- **Column headers realigned to match** — Type/Sector/Tags/Published headers now sit at the exact x used by their column's detail text (headers had drifted out of sync with a couple of column x-shifts made across earlier passes). Also fixed a latent collision: the **Type badge's widest label ("INTELLIGENCE", 90px) was overflowing its 62px-wide badge frame** into the Sector column once Sector moved closer in an earlier fix — widened the Type column's reserved space and re-spaced Sector/Tags/Published off the columns' actual measured content widths (not guessed), not just their fixed box widths, to prevent recurrence.
- **Type column still visibly misaligned after the fix above — a second, hidden cause.** The badge frame's own x matched the "Type" header's x, but the badge's cloned component carries its own **auto-layout with an 8px left padding**, which silently re-applies itself on every resize — so the visible label kept rendering 8px right of where the frame's `x` said it was, no matter how many times the frame's `x`/width were corrected. Fixed by zeroing the badge's `paddingLeft`. **Lesson: when a cloned instance/component won't visually align despite its frame's `x` being correct, check for auto-layout on the clone — padding is a second, independent source of visual offset that frame-level `x` fixes don't touch.**

**Colour stays neutral** (unchanged from the original correction) — no per-type hues; nowhere else in the system encodes category by colour, and red stays reserved as the singular brand/action accent.
**Grouping-by-lens is moot now** that dividers are gone — the "Recent ▾" facet pill still governs the flat list's *sort order*, it just no longer produces visual section breaks.
One frame now: `Documents — Desktop (Details view)` — the earlier plain-table frame and the "Folder view" frame are the same frame; the plain-table version was deleted, not kept as a duplicate.

### 11c-quater. Desktop earns its space — it is not stretched mobile (locked 2026-07-19)

§11a governs *alignment* (left vs centre) and says desktop uses "identical logic" — but it only ever addressed text alignment, never **width/measure behaviour**, so left-aligned *short* content (e.g. the Documents facet pills) that fills a 390 mobile column reads as lost and lopsided in an 880 desktop column. These five rules close that gap. Desktop keeps mobile's *structure* but uses its extra room deliberately:
1. **Measure — a related control cluster shares one width.** Never a full-width element towering over short siblings. Command/form clusters cap at a comfortable measure (~520–560px) left-aligned, with the right as the reserved chrome lane. **Full-width stays only for things that genuinely fill it:** the docked prompt/search bar *inside a drawer*, data tables, and cover/card grids. (Fixes the Documents search-full-width-over-short-pills weirdness.)
2. **Columns scale with width.** Grids gain columns by available width — document **covers: 3-up mobile / 5-up desktop** (and smaller per cover, not the oversized 2-up/4-up); card grids reflow `minmax()`.
3. **Emphasis scales with width.** Display / hero data — corpus metrics, wallet balance, big counts — steps *up* in size on desktop (e.g. Documents metric numerals ~24px desktop vs ~13px mobile). Desktop affords display figures; mobile can't.
4. **Presence.** Compact mobile *rows* may become carded or more generously spaced on desktop where it aids scanning — not decoration. (E.g. a dense mobile list can gain padding/cards on desktop.)
5. **Colour (§12).** Restore white centres on desktop; drawer = inverse of centre; nav white; header white; conditional drawer↔nav divider. This is the paired colour half of "earning the space."

The through-line: **desktop is a re-composition at the same information architecture, not a scaled screenshot of mobile.** Same screens, same order, same components — but measure, columns, type scale, and surface tone all re-tuned for the wider canvas.

### 11c-ter. Buttons are auto-width on desktop, never full-column (locked 2026-07-19)

A primary button stretched to the full 800px content width reads as a mobile artifact on desktop — on mobile a full-width CTA is thumb-friendly and correct, but at 800px it looks broken. **Desktop rule: action buttons hug their label + ~24–28px horizontal padding; only text *inputs* stay full-width** (a full-width prompt bar / search field is correct — it's a field, not a button).
- **Single primary commit** (Generate · $80, Use these N files, Send to support, Upload a file): **~35% of the content width (280px on the 800 content) and CENTRED** (revised 2026-07-19 from an earlier right-aligned auto-width — auto-width read as weak/small, and centred keeps the mobile-first full-width-CTA instinct at desktop scale). Still pinned to the fixed button y (§11c, y=782 for drawer commits).
- **Action pairs** (Wallet's Top up + Increase budget): two equal buttons (~240px each, 30%) **centred as a group** with a 12px gap, primary first — not two half-width buttons stretched to fill the row.
- Only text **inputs/search fields stay full-width** — a full-width prompt bar is correct (it's a field, not a button).
- **Modal-sheet buttons** (sign-out) stay full-width of their *sheet* (~480px) — a narrow modal is the one place full-width is still right.

### 11d. Corner radius encodes what a thing is

**Locked 2026-07-13.** Radius is not decoration — it carries meaning, and the system already follows this implicitly:

| Radius | Meaning | Where |
|---|---|---|
| **Pill (fully round)** | **Caspr's conversational voice** | the prompt bar / Docked Input Bar, chips, facet pills |
| **6px** | a **utility field or control** | search, Settings rows, Gate selectors, ticket-form fields, buttons |
| **12px** | a **discrete object you could pick up** | structure cards, the wallet card, covers, the drawer |

The prompt bar's pill is therefore *exclusive* — a search field is not Caspr talking, so it is 6px, not a pill. (The `Input` master originally shipped at radius 0, which is none of the three; corrected.)

### 11e. Where the serif lives — display voice, not wayfinding

**Locked 2026-07-13 (Joy: "limit logo font" — sub-menu headings had crept into serif).** Instrument Serif is Caspr's *display voice*; using it for every little heading dilutes the register that makes the covers and titles land. The rule:

- **Serif (Instrument Serif):** the **screen title** (one per screen, §11b) · genuine **editorial display** — the compose invitation, the structure headline, report section titles, covers · **identity** (the profile name with its red period). Moments where Caspr is *speaking or presenting*. **Serif is never used for numbers** — even large display figures.
- **DM Mono (the number face):** all **display figures, metrics, balances, and key statistics** — the corpus metrics ("2,847 documents · 18 industries…"), the wallet balance, price/stat figures. Nothing else uses DM Mono. (This corrects an earlier draft of this bullet that wrongly placed the wallet balance / display figures under serif — production already renders them in DM Mono.)
- **Sub-section headings within a screen** (Included / Excluded / Security / Notifications / Context questions / …) = **Inter Semi Bold ~13.5px, sentence case, black.** They are wayfinding labels, not voice. Note this is *not* a return to the eyebrow (10px tracked caps grey) — sentence case at reading size, no tracking.
- One serif title per screen; everything below it navigates in sans.

### 11f. Milestone-gated features — visible, never hidden

**Locked 2026-07-13.** Features above the user's current Research Budget milestone (Intelligence · data upload · editing at Business; SSO · API · seats at Enterprise) are **present in the UI, not removed**. Tapping one opens the **unlock sheet** — a bottom action sheet (same chrome as the sign-out sheet): serif headline naming the feature and its tier ("Intelligence unlocks at Business."), one sentence on what the tier adds, a red "Increase to $X/mo" commit, and a plain "Not now."

- Discovery is the point: a hidden feature can't sell the upgrade; a visible one the user *wanted* just did.
- **The tray is contextual only — it is never a standalone screen.** It appears at the moment a locked affordance is tapped, nowhere else. (Budget tiers, reached from the Wallet's milestone strip, is reference material — each tier lists its cumulative unlocks — but it is a screen the user seeks out, not the tray.)

**Touchpoint inventory (2026-07-13) — every place a locked element appears and the tray can fire:**

*Business gate (Intelligence · data upload · editing):*
1. **Compose — depth selection**: the Intelligence depth option, visible but locked for Professional/free-trial users. *(Depth UI not yet in the mobile frames — apply the lock state when it's built.)*
2. **Gate — contextual Data Room**: "+ Upload more files" (data upload is Business).
3. **Data Room (general)**: the "+ Upload" header link and the empty-state "Upload a file" button.
4. **Reading — edit affordances** (v1.1): per-section Edit control and report-title `⋯ → Edit`.
5. **Onboarding walkthrough**: any tier-tagged feature shown during first-run links to the same tray.

*Enterprise gate (SSO · API · 3 seats):*
6. **Settings — Security**: SSO row (add when built; locked pre-Enterprise).
7. **Sharing / collaboration**: "invite your team" in the share flow (seats).
8. **API access**: Settings / desktop developer surface.

*Balance and trial gates — sibling trays, different content (top-up / start-a-budget, not a tier pitch):*
9. **Gate — Generate with insufficient balance** → top-up tray (`pricing-model.md §12`: prompt to top up; no partial add-ons, no overdraft).
10. **Free-trial exhaustion or expiry** → set-a-Research-Budget tray; account is view-only until then. The single biggest conversion moment in the product.

**Intelligence nuance:** its tray must offer **both** paths per the pricing model — upgrade to Business ($300 in-budget thereafter) **or** run this one à la carte at $399 with no subscription. Suppressing the à-la-carte path to force the subscription would contradict locked pricing.

*Not gates (don't use the tray):* Insights ("Soon" — roadmap), Connected sources ("Coming soon" — roadmap).

## 12. The drawer's two identities (colour cue)

**FULL 3-ZONE COLOUR SYSTEM — 2 tones, locked 2026-07-19 (supersedes the accreted per-screen tones below).** The app grew three near-identical off-whites (`#FFFFFF` nav / `#F6F5F3` drawer / `#ECEAE6` canvas — each ~4% apart) so no zone separated; desktop also silently lost mobile's white centres. Collapsed to **two tones that each mean something**, and `#F6F5F3` is **retired** from the zone system:
- **`canvas #ECEAE6` = chrome / desk / browse** — the recessed frame: nav margins on desktop, and any *filing/browsing* surface (the Documents library drawer).
- **`white #FFFFFF` = work / paper / voice** — section cards, the report sheet, command surfaces, drill-in content, and the Caspr drawer.

Zone assignments:
- **NAV** (left rail + bottom nav) = **white, constant** (chosen 2026-07-19 over canvas — smaller change, no selection-highlight/cluster re-tune). It's the persistent chrome; it never recolours per tab.
- **CENTRE** = **`canvas`** on *card-composition* modes (Report Creation stages, Compose) so white cards pop off it; **`white`** on *sheet/content* modes (Documents, Reading, Generation, and every drill-in — Wallet, Settings, Help, Data Room, Profile, Budget). **Desktop had lost these white centres — restore them to match mobile.**
- **DRAWER** = the **tonal inverse of its centre** — `white` over a canvas centre (Report Creation: Caspr's voice), `canvas` over a white centre (Documents library, Reading Ask, Generation). This *guarantees* the pull-up reads as a distinct overlay, and it stays one tone across Peek/Half/Full (no colour change on resize).
- **FLOATING HEADER** = the **tonal inverse of its centre, matched with the drawer** (validated 2026-07-19 — a white header on a white centre only read via its shadow, too weak; canvas reads as a clear top band). So header + drawer are **always a matched bracket pair, both the inverse of the centre**: white over a canvas centre, canvas over a white centre. It reads cleanly because the **full-width centre section (§11) means the flanks beside it match the centre** — so the inverse-tone header/drawer sit as distinct bands on a uniform surface, not bleeding into mismatched margins (that mismatch was the header-conflict bug, fixed here).
- **DIVIDER between drawer ↔ nav (mobile only)** = **present only when the two share a tone.** Report Creation: drawer white = nav white → an **inset hairline** (not edge-to-edge) separates them. Everywhere else: drawer canvas ≠ nav white → the tone separates them, no divider. (Joy's refinement 2026-07-19: divider *only* when same-tone.)

*(Historical, kept to read older frames: Report Creation centre canvas / drawer white; Documents inverted centre-white/drawer-canvas; the Caspr drawer was briefly `#F6F5F3` at all detents. The system above finalizes and generalizes all of it.)*
- **Elevation** — a **soft, diffuse** drop-shadow (`y:-2, blur 40, ~5% black`) at the drawer's top edge (revised 2026-07-19). The earlier tighter `y:-3, blur 20, 10%` shadow, at desktop's 880px width, cast a crisp full-width band that read as an **opaque bar / border** above the drawer — not the soft elevation intended. Diffusing it (bigger blur, lower opacity) keeps the lift without the bar.
- **Desktop detent heights (revised 2026-07-19, supersedes the "Half varies by content" framing below): Peek 92 · Half 326 · Full 440 — three fixed tiers, not a continuum.** First pass ported mobile's 408 unchanged for every non-Peek drawer, which left dead air on light-content screens; the fix at the time was to let "Half" mean two different heights depending on content, which just relabeled the inconsistency instead of resolving it (Joy: "I thought we agreed on half and full — instead of introducing something less than half," use the new smaller size as Half everywhere and promote the taller one to Full). **Locked, matching mobile's Peek/Half/Full model:**
  - **Half = 326** — for light/parked content: Structure's conversation drawer, Documents' browse-preview grid (deliberately shows a partial second row + scroll, not the full library at once).
  - **Full = 440** — for dense functional content: Generation's carousel, Help's escalation form. (Distinct from mobile's Full=760/desktop's existing 390-wide Full component variant, which is sized for a different, not-yet-built "expanded chat" state — this 440 is desktop's own Full tier for drawer content, not a resize of that component.)
  - **Gate stays custom at 520** — an itemized list + total + commit button is denser than either standard tier; treat as a named exception the way mobile's Gate already was, not a third in-between size.
  - The floor-fixed input/button positions (§11c) are unaffected by any of this — they're anchored to the shell, not the drawer's own height.
- **Drag handle** — mobile 44×5px; **desktop 160×6px** (revised 2026-07-19). A 44px handle is lost on an 880px drawer; a wide grip reads clearly as "drag me." (Considered matching the full ~280px button width; that read as a divider, so 160 is the grip that's clearly wide without becoming a rule.) Soft grey, centred, pill radius.
- **Theater's receded detent** (2026-07-19) — Theater uses neither Peek nor a light drawer. It gets a **Receded** state: a ~22px dark sliver (`#1C1A19`, lifted from the `#0A0908` theater), handle only, **no content** — it signals the drawer exists without breaking immersion. See §9a Theater.

Net: **`canvas`** = the substantive *work* surface (structure canvas, the library) · **white** = active Caspr voice or the document itself · **`surface-1`** = the *quiet Peek weight* of Caspr's voice. Three tokens, each a specific job; elevation + handle carry the separation regardless of what's behind. Theatre (black centre) is the one unresolved case — needs its own dark-mode Peek tone, deferred.

Same Peek / Half / Full detents; both platforms.

## 13. Documents — the faceted library

A faceted **intelligence library**, not folders alone. Only **project** is a folder; depth, research type, sector/geo/theme, and status are **facets** (auto-tagged — the controlled vocabulary is a separate workstream → `document-taxonomy.md`, handoff to Jayant).

- **Landing = a calm command surface:** a search bar + facet **pills** (the lens — organise-by *and* filter) + **corpus metrics** ("N documents · X industries · Y geographies · Z research types"). Metrics are interactive (tap "18 industries" → the sector lens).
- **Documents shown as covers** (dark, with depth + type badges) — what brings colour and makes the space read unmistakably as documents.
- **Default state: the drawer peeks**, pre-loaded with **Recent + Drafts** ("Continue where you left off") — never a cold start. Engaging a pill/search expands the drawer and re-organises to the chosen lens.
- **Drafts** (chats that never became a report) = a **system drawer** (alongside "All documents") **and** surfaced on the landing for resume. Generating a report graduates a draft out of Drafts.
- **Search:** default = **title + metadata** (instant, Supabase). Opt-in **"search inside"** = full text + the brief (Jayant's content store — a search endpoint to add to the API contract).

## 14. Open → centre transition (the keystone motion)

- Tap a cover in the Documents drawer → **shared-element lift**: the cover scales and rises out of the drawer into the centre, settling as the report at the content column (the cover *becomes* the document's top).
- **Simultaneously** the drawer cross-fades `canvas → #FFFFFF`, covers fade out, the Ask Caspr (or current-stage) surface fades in, and the drawer eases to Peek.
- ~400ms, one continuous beat. It is the **mirror of the compression** (§5): the brief folds *in*; a document lifts *out* — same motion family. You pull a document out of the drawer, and Caspr is what's left to talk to it.

## 15. Edit — v1.1 (NOT in v1)

**v1 = create → read → review → Ask Caspr, shipped end-to-end to deployment. All editing is v1.1**, built while v1 is in test.

- Three affordances: **manual** (type into a section), **conversational** (tell Caspr to rewrite — the mobile-primary path), **revise-with-data** (attach a file/dataset to a section → Caspr regenerates *that section*).
- Triggers: per-section **Edit** at the top-right of each section card (hover-revealed on desktop) + global via the report-title `⋯`.
- Desktop edit is a distinct **mode**: document in the centre, a **vertical edit rail on the right screen edge** (document tools — format, structure, insert, revise-with-data) living in the right margin. Edit-mode must visually declare itself so the rail never contradicts the default drawer-only shell.
- **Business+ tier.** Mobile = conversational + annotate only (no manual WYSIWYG).
- **Edit indicators (change bars):** a block changed in the current edit session shows a **red vertical bar in the report's left margin**, aligned to the edited block. The bars **clear on Save** (changes commit to a new version) and **reappear as new edits are made** — a lightweight "what's changed since the last saved version" cue for unsaved edits.
- **Current interaction model — left pane, contextual (supersedes the "vertical edit rail on the right screen edge" above).** Entering Edit turns the **left pane** into a contextual menu keyed to the centre selection: heading `EDIT` with **Save · Discard** on its RHS (Save = red-outlined, creates a new version); a **selection indicator** (which block/element is selected); a **toolbar that swaps by selection** — *text* → paragraph style · B/I/U/S · align L/C/R/J · bulleted+numbered lists · link · font · size · **undo/redo**; *chart* → chart type · style · data; *cover* → cover image · infographic · layout; then **Caspr's conversation** (a Caspr opener describing what it can do + suggestions) and the **"Edit with Caspr" prompt** in its usual bottom position, with the report-view selector still visible. **Mobile** drops the manual toolbar entirely — a single-line *"Inline editing is desktop-only — edit with Caspr here."* note replaces it — and keeps the conversational path + undo/redo. Full model in the report-actions model.

---

## 16. The engagement layer — "sitting in the client's office"

**Locked 2026-07-13 (Joy).** The idea: while the Learning + Thinking Brains work, recreate what a consultant does in the room — a lightly casual exchange that reads the person, builds rapport, and (on our side) builds the user profile that raises share-of-wallet. The hard constraint: **the user only engages if it visibly improves their output — now or next.** A generic "tell us about yourself" form is the anti-pattern; it's the consultant *not* reading the room.

**Two moments, different permission levels — do not conflate:**

### 16a. During Generation — the carousel (not a conversation)

Fires **only in Generation** (phase 7), *after the theatre's spectacle has landed* — never over the theatre itself (a question popping over the cinematic Source Web undercuts "it's working hard for me"). **It is a tap-based carousel, not a typed chat** — nobody wants to type mid-flow.

- **Surface:** the Generation drawer. **Peek = one-line status** (`surface-1`, glance-and-ignore); **pull to Half = the carousel** (white, Caspr's voice). The report keeps assembling in the centre throughout — engagement is always opt-in, never blocks.
- **A rotating deck; the mix shifts with relationship stage:**
  - **Read the work** (always) — "What's this one for?" → pills [live deal · case study · market monitoring · exploring]. Profile-building is a *byproduct*, never the stated goal.
  - **Teach the tool** (early only, decays) — "When this lands, ask Caspr about any figure — it'll cite the source."
  - **Early finding** (always) — a real stat locked in by the analysis so far ("Early read: three regions hold 78% of global volume") — builds anticipation for the output.
  - **Feedback** (later) — "Your EV study — did it hold up in the room?" → rating. Improves the model, closes the loop.
  - **Continuity** (later) — "Last time: the logistics target. Did the deal move?" — meeting a person again, mid-work. This is where **16b's returning-user context folds back into A.**
- **Voice = the Trusted Senior Analyst** (CLAUDE.md): dry, precise, commercially sharp, no exclamation, speaks in conclusions. "What's this one for?" not "Tell us about your project!"
- **Data:** answers write to the **Context Layer** (§4.12 in `product-design-spec-draft.md`) — the same store that pre-selects the Gate's **Style** (§Gate) and personalises Compose accelerators, next-analysis suggestions, and Data Room relevance flagging. Each is a reason to run *more* analyses → share-of-wallet.

### 16b. The returning greeting — meeting a person again

On sign-in, **not** "Good morning." A dry, specific callback to the user's live context ("The logistics acquisition — still live?" / "Battery supply-chain — still the question?"), drawn from the Context Layer + their recent work. Persona-first: it should read like someone who *remembers the room*, not a notification. Delivered on the returning-user landing (onboarding/greeting surface). The **value must be shown back**, not just collected — e.g. "Because you present to ICs, I've defaulted your reports to that style; change it anytime" — so the user feels the profile working for them.

**Payoff logic (why users engage):** A's payoff is *this* output (visible now); B's is the *next* one (stated honestly — "this'll make your next one sharper"). Never ask a profiling question whose payoff the user can't see.

---

## 17. The Signal — the opinion / sentiment layer in reports

**Locked 2026-07-13 (Joy).** Reports may include blocks of **opinion / sentiment gathered from crowd-sourced-but-credible sources** — social-media mining, news, interviews, and forums (Reddit, Quora, Wiki, X). This is **an additional layer of intelligence — more than promised**, NOT a weaker cousin of the cited data. Framing is "we promised curated, cited data — and we *also* captured what the market actually thinks," never a disclaimer.

- **Name:** **The Signal** — reframes opinion as *leading intelligence* (sentiment often moves before the data confirms it); spans crowd sentiment *and* named thought-leaders under one label. (Rejected: "Popular Opinion" — excludes top voices, faintly dismissive.)
- **The reader must feel it's a different *class* of evidence** than the cited data — without reading as *lesser*. **Why (restated 2026-08-20):** Caspr's proof is **"every source, credible. Every claim, triangulated. Every report, defensible."** Cited findings carry a named, credible source; The Signal carries an *aggregate* — real intelligence, but attributable to a body of sentiment rather than to a source you could put in front of a board. The two must therefore look different, or the aggregate borrows the authority of the cited. *(Supersedes the earlier justification "every insight cited, zero hallucination" — that claim is retired. The treatment below is unchanged: it follows from the restated reason just as well.)* Achieved by three levers together:
  1. **Tint** — a faint cool-grey block (`~#F2F2F4`), off the report's white document surface.
  2. **Typeface** — sans (Inter), deliberately **not** the editorial serif (serif is Caspr's *authority/cited* voice, §11e — putting crowd opinion in it would read as endorsement).
  3. **Aggregate attribution, never a single citation** — a synthesized statement ("The market thinks…"), attributed in bulk ("~2,400 mentions across forums, X and Reddit, and 9 named operators on the record · date range"). The single-quote treatment was rejected — invites "who said that, is it representative?"
- **Attribution copy = bonus framing, not caveat:** "The market's view — captured beyond the cited record…" (NOT "sentiment, not curated data").
- **In the document flow, full column width — NOT a sidebar.** It sits between sections/paragraphs like an aside the eye lands on, part of the argument.
- **Header:** a small soundwave icon + `THE SIGNAL` label (Inter Semi Bold 10px, tracked).
- Full report-render spec belongs in `report-style-guide.md` (see its Signal section); this is the app-shell placement rule.

---

## 18. Analysis identity — Type · Depth · Status (three orthogonal attributes, locked 2026-07-24)

Every analysis is described by **three independent attributes**. They are orthogonal — any Type can be produced at any Depth — and each one **locks in at a different point in the journey**. Conflating them (esp. treating the Brief/Study/Intelligence tiers as "types") is a recurring error; they are *depths*, not *kinds*.

| Attribute | Answers | Values | Locks in |
|---|---|---|---|
| **Type** (discipline) | *what kind* of analysis | the 5 core types below | when the user picks from Caspr's first set of proposed directions |
| **Depth** (tier) | *how much* — scope & price | Brief · Study · Intelligence | at the Gate (see `pricing-model.md`) |
| **Status** (lifecycle) | *where in the journey* | Draft · Generating · Complete | automatically, throughout |

**The 5 core Types (lean taxonomy — Joy chose the lean set over the granular 8):**
1. **Market Analysis** — market sizing, segmentation, growth, competitive landscape & positioning
2. **Diligence** — company profiles, commercial due diligence, target/company evaluation
3. **Deal Sourcing** — M&A and investment target identification & screening
4. **Research Synthesis** — primary research, literature/evidence synthesis, regulatory & legal landscape
5. **Strategy** — GTM, market entry, business case, investment thesis

**The eyebrow = `Type · Status`, and it fills in left-to-right as each attribute resolves** (Depth is NOT in the eyebrow — it rides as a separate tier badge, because it is price/scope, not identity):

| Journey stage | Known | Eyebrow | Tier badge |
|---|---|---|---|
| New prompt (pre-direction) | Status only | `NEW ANALYSIS` | — |
| Direction picked → Gate | Type + Draft | `MARKET ANALYSIS · DRAFT` | — |
| At the Gate onward | + Depth | `MARKET ANALYSIS · DRAFT` | `STUDY` appears |
| Generating | Status→Generating | `MARKET ANALYSIS · GENERATING` | `STUDY` |
| Filed / open document | Status→Complete | `MARKET ANALYSIS` (status rests) | `STUDY` |

**Correlation with the two library surfaces (one vocabulary, three places):**
- **Eyebrow Type** ↔ **Documents library** primary tag (same token — the `MARKET ANALYSIS` in the open title is the same chip in the library).
- **Tier badge** ↔ the Gate decision + a **Documents library** secondary filter.
- **Status** ↔ the **Analyses list** chip (Analyses is present-tense work → it shows lifecycle).

Implemented in `Screen Title — Dark v3` (Figma `659:2`): the overline carries `Type · Status`, updated per stage during assembly.

---

## Open / parked

- **Edit-mode entry** — a **reveal button / simple icon** (Joy's idea) as the way into edit; decide at detailed design.
- **Edit mode + depth** — detailed interaction design deferred to the v1.1 pass.
- **Document tag taxonomy** — carved into its own session (running); output → `document-taxonomy.md`, handed to Jayant.
- **Ask Caspr scope UI** — whole report vs section vs a single fact; scope chip on the Ask field. Design when we spec Ask Caspr.
- **Two-segment card header** (`Brief · Ask Caspr`) — add only if testing shows scroll-to-brief is hard to find.

---

*Document: app-shell-framework.md · Owner: Joy · Locked 2026-07-11.*
*Exploration frames: Figma `🧭 Exploration · Mobile + Desktop` (file `y2F394I4CwEeSzH2kKuDCt`).*
