# Gate & Output Generation — Spec

*Locked with Joy 2026-08-04. Governs the pre-generation gate, the parameters it confirms, output generation, and the post-gate flow. Pricing basis: `.agents/pricing-model.md` §4.6. UI: `design-guidelines.md` §11–12, Figma `y2F394I4CwEeSzH2kKuDCt`.*

## 1. What the gate is

The gate is the **single pre-generation confirmation** — the LHS pane commit point that appears after the conversation and the layout. It confirms **everything Caspr is about to produce**, all **pre-populated by Caspr** and all **changeable**, then commits.

**The scope lives in the CENTRE, not the gate.** The layout/structure the user reviews (Layout Canvas) *is* the scope. The gate does not re-display it — the gate is the *parameters + price + commit* surface.

## 2. Gate parameters (Caspr pre-sets; user can change)

| Parameter | Caspr default | Change effect |
|---|---|---|
| **Type · Tier** | inferred from the ask (`Type` + `Tier` = Brief/Study/Intelligence) | changing **Tier** (or Type) **re-generates the layout in the centre → the gate re-appears** with the new scope + price |
| **Output formats** | by tier (§4) | multi-select; formats beyond the default draw the output quota — **no re-layout** |
| **Language(s)** | English (base, always on) | multi-select; each additional language = 1 output — **no re-layout** |
| **Style / template** | the single Caspr template (launch) | see §5 — governs content treatment; chosen pre-first-generation (free); changing after generation = a metered output |
| **Premium Data Add-ons** | detected pre-run (`pricing-model.md` §4.4) | opt-in, shown with price |
| **Price** | analysis price (by tier) + add-ons | updates inline |
| **Commit** | — | "Generate · $price" (app) / "Start free — first $100" (onboarding) |

**Re-generation rule:** only **Tier / Type** re-runs the layout (→ gate re-appears). Formats, languages, style, and premium-data changes update the gate summary + price **inline**, no re-layout — keeps the loop tight.

**Tier-change confirmation (DEV).** Because Tier change **rebuilds the layout from scratch and the approved structure cannot be recovered**, and because users may approve a Study layout then switch to Brief to save money, **changing the Tier after a layout has been approved fires a one-time confirmation dialog.**

- **Scoped to the pane** — the scrim + dialog cover the LHS pane only (x 64–424), *not* the whole screen; the centre layout stays visible. Reference: `Gate — Desktop v3 · Tier-change warning (ref)` `1472:2`.
- **`Don't show this again`** checkbox (per-user preference; suppresses future warnings).
- Actions: **`Keep [current tier]`** (cancel) · **`Rebuild as [new tier]`** (proceed → re-layout → gate re-appears).
- Does **not** fire on the very first tier pick (before any layout exists) — only once a layout has been approved/drafted for the current tier.
- **Headline is constant:** *"This rebuilds the structure."* **The body depends on (current tier → new tier)** — actual copy:

  | From → To | Body |
  |---|---|
  | Study → Brief | "Brief is a 3–5 page note, not a full analysis. Caspr redraws the outline from scratch — the Study layout you approved won't come back." |
  | Study → Intelligence | "Intelligence runs multiple models over a deeper structure. Caspr redraws the outline from scratch — the Study layout you approved won't come back." |
  | Brief → Study | "A Study is a full, multi-section analysis. Caspr redraws the outline from scratch — the Brief layout you approved won't come back." |
  | Brief → Intelligence | "Intelligence runs multiple models over a far deeper structure. Caspr redraws the outline from scratch — the Brief layout you approved won't come back." |
  | Intelligence → Study | "A Study is a single-model analysis over a lighter structure. Caspr redraws the outline from scratch — the Intelligence layout you approved won't come back." |
  | Intelligence → Brief | "Brief is a 3–5 page note, a fraction of this depth. Caspr redraws the outline from scratch — the Intelligence layout you approved won't come back." |

### 2.1 Gate UI — the accordion pattern (LOCKED 2026-08-04)

The parameter block is a nested accordion, styled like the Contents TOC. **No section eyebrow** — it flows inline off the conversation (a single Caspr line, e.g. "That's the scope. Confirm the output, then generate:").

- **Each row is two lines:** title (Inter Medium) on line 1, the current selection as an **italic descriptor** on line 2. Tapping expands the row **in place**.
- **RHS is reserved strictly for price** — every row can carry a cost. Value/descriptor and the expand **chevron (`›`, at the extreme right edge of the divider)** live in the left/edge, never the price column.
- **Expand type by selection kind:** single-select → **radios** (Tier, Style); multi-select → **checkboxes** (Output formats, Languages); **Data & sources expands inline too** (files + premium toggle) — *not* a navigation to a separate Data Room surface (on mobile that surface would render in the drawer anyway, so navigating is pure friction).
- **Selected / paid prices are RED; everything else grey ("Included" = £0).** The red numbers **visually sum to the red Generate button** (e.g. Study `$80` + premium `+$25` = `Generate · $105`). This replaces a Total row — **the button *is* the total.**
- **Dividers match the button width exactly** (no wider on the RHS).
- **Vertical rhythm is uniform and matches the gate exactly** — expanded option rows (radios/checkboxes) use the same pitch as the collapsed rows (≈28px per option, ≈44px per two-line row); never tighter. The expanded state must read identically whether it's Tier radios or Formats checkboxes.
- The commit button is the running total; `Or refine further…` input stays docked below.

### 2.2 Output pricing inside the gate (DEV)

Outputs are **per-output, value-priced — NO quota, NO top-up pack** (both retired). Full model + prices: `pricing-model.md` §4.6-B.

- **The base — all tier formats in the user's native language — is `Included`.** Because the base already covers every format, **the only paid dimension at the gate is an additional LANGUAGE**; extra formats (outside the tier base) and re-generations run post-analysis on the **Generate Output screen** (same table).
- **On expand, each option's RHS shows its own price** — `Included` for the base, `+$5` (PDF/DOCX/XLSX/CSV) or `+$10` (PPTX) for a paid output. MD is always free.
- **An output = one file = one format × one language — MULTIPLICATIVE.** Adding a language delivers each selected format in it: a French **PDF + PPTX = +$5 + $10 = +$15**. Recompute + show the running cost **live** as the user ticks options.
- **Paid outputs sum (in red) into the Generate button** — same red-sum as tier + premium (§2.1). The button is the total; there is no counter.
- **Consider a per-language premium** — a translation is a rewrite, not a format-conversion (higher value + cost); decide on Jayant's translation cost (`pricing-model.md` §13, item 15).
- **Other rows:** **Tier** = base analysis price. **Style** at the gate = `Included` (post-gen style changes metered separately, §5). **Data & sources** = premium-data add-on (`+$X`, §4.4).

## 3. First-shot generation

Hitting Generate produces the **tier's default format set, in English** (not "everything"). Extras are opt-in and draw the output quota (§4.6-B). Type/Tier works across use cases (due diligence, primary research, academic, etc.) — the tier, not the use case, sets the defaults.

## 4. Output — included base set by tier

Every base output is generated in the user's **native / working language** (see §6 — multilingual by default). MD is free in all tiers.

| Tier | Included base (native language) |
|---|---|
| **Brief** | PDF · MD |
| **Study** | PDF · PPTX · XLSX · CSV · MD |
| **Intelligence** | PDF · PPTX · XLSX · CSV · MD |

- **The base set is included** in the analysis price (Brief kept light — a note, no deck; Study/Intelligence get the full deck + data).
- **Beyond the base — PER-OUTPUT, value-priced** (`pricing-model.md` §4.6-B), NOT a quota: additional **languages** (any format in a new language), a **format outside the tier base** (e.g. a Brief → PPTX), and **re-generations** after edits. Prices: PDF·DOCX·XLSX·CSV **$5**, PPTX **$10**, MD free. They **sum in red into the Generate button**.
- **Architecture:** every output is rendered by **Jayant's output-generation API**, never product-side. Product sends report state → receives the file(s). (`visualization-library.md` §7.)
### 4.1 Generate Output screen — the card mechanic (DEV)

The Working **Generate Output** screen (`923:2405` desktop / `1283:3112` mobile, via the `Outputs` tab) uses a **card-per-output** model:
- **`+ Generate`** re-opens a **gate-style accordion** (the same output selector — formats × languages, per-output prices, red-sum).
- On confirm, the pane populates with **one card per output** queued (e.g. `PPTX · French — $10`, `PDF · Spanish — $5`), each showing **format · language · price** and a **remove (×)**.
- A **dotted-border "add" card** sits at the top → re-opens the accordion → appends more cards.
- The per-output prices **sum dynamically into the Generate button** at the foot; **removing a card updates the total live**.
- Same per-output table (§4.6-B) and Jayant API as the gate — it's the *subsequent-generation* instance of the one shared output model.

**The add-output accordion — editable vs. locked split (BUILT 2026-08-04).** Clicking `+ Add output` opens the gate accordion **cloned into the post-analysis context**, where the analysis is already done and only *export* choices remain. Reference: `Working · Generate Output — Desktop v3 · Add output (ref)` `1500:2`.
- **EDITABLE (what you export):** `Output formats` (checkboxes, per-output prices) · `Language` (radios — one batch per confirm) · `Style`.
- **LOCKED / read-only (what the analysis *is*):** `Tier` and `Data & sources / Premium` — shown **greyed, no chevron, no price**, tagged `· fixed`. All parameters are *shown* (full context); only the export ones are interactive. You cannot change what the report *is* from here — that would re-run the analysis; you only choose what to render from it.
- Already-delivered options read as done (e.g. English = *native · delivered*, greyed). Selected format prices are **red and sum into the `Add to queue · +$N` button**. On confirm → the accordion collapses and spawns one output card per selected format × language, appended to the queue (§4.1 card mechanic).

- **Same output model at the gate AND post-analysis — build once, reuse.** The gate's output section and the **Working "Generate Output" screen** (`923:2405` desktop / `1283:3112` mobile, reached via the `Outputs` tab) are the *same* control set (format checkboxes · language multi-select · style) over the *same* report-level output quota. The **gate = the initial generation** (first delivered set, included). **Generate Output = subsequent generations** — extra formats/languages, or re-generations after edits — each drawing the quota (Brief 0 · Study 5 · Intelligence 10), then the `Add 10 for $5` top-up. Same `"x of y remaining"` counter, same multiplicative math (formats × languages), same Jayant API call. The two surfaces should share one component.

## 5. Style / template

- **Launch = a single Caspr template.** Style is **not just visual** — it governs **content treatment**: text style, vocabulary, density, chart/infographic style, output length, and appendices.

> **On the wire: `gate.style = "caspr_default"`, and nothing else. Ruled by Joy, 2026-08-21.**
> `api-spec-v2.md` carried an enum — `mbb · big4 · academic · pe · scholarly · enterprise` — which contradicted this section. Those are **audience labels**, a crude proxy for the ICP that `client_knowledge.icp` now carries properly across ten researched profiles (`report-guidance/report-style-guide.md §10`). Two fields deciding one thing drift, with no defined winner.
> **The six house styles are retired.** Content treatment is **auto-resolved** from `deliverable_type` × `tier` × `icp` — see `report-guidance/00-resolution-map.md`. The user never self-classifies; the Style row stays *"Caspr default · Included"*.
> The field remains on the wire as the reserved slot for the user-defined custom templates below. Contract change in flight: `app-handoff/DEV-PROMPT-RESOLUTION-KEYS.md` → `api-spec-v3.md`.
- Style is a **pre-first-generation choice** (baked into the first-shot at no extra cost). **Changing style after generation = a re-generation = a metered output.**
- **User style requests** ("make it denser", "add an appendix", "more visual", "tighten the vocabulary") are a **metered generation** — a deliberate rev-gen opportunity.
- **User-defined custom templates — DECIDED 2026-08-21 (Joy). Phase 1.5.**
  **One-time setup per template, $1,000. Not per report.** Three for $2,500. The template persists and applies to every subsequent report.
  - **Business ($600) and above may purchase.** **Enterprise ($1,800) includes the first**; additional at $1,000.
  - **A user may hold several templates** — consultants and agencies work across client brands, and people change jobs. The offer is per-template and repeatable, not a one-per-account unlock.
  - `gate.style` remains the reserved wire slot; `template_id` stays `null` until Phase 1.5 ships.
  - **Why $1,000 when the substitute costs more.** A boutique agency charges **$1,500–3,500** for a branded deck template, and $2,000–5,000 for a comprehensive one. We sit under that deliberately: the number has to clear without deliberation, and the first template's real job is to **qualify an Enterprise lead**, not to earn margin. **The commercial proposal must say this out loud** — *"less than a design agency charges for the template alone, and this one applies itself to every report you run after it"* — so the price reads as evidence, not as a discount.
  - Superseded: the earlier "$1,000 per instance" framing, and the open one-time-vs-per-report question.

## 6. Languages

English is the always-included base. The gate/output selector is **multi-select**; each **additional language = one output** (draws the quota, then charged). Language changes do not re-run the layout.

## 7. Post-gate lock

Once past the gate, **generation is atomic**: no pause, no stop, no mid-process edits. All changes happen **after completion, through Edit mode**. No pause/stop UI.

## 8. Chat access during & after generation

- The conversation's permanent home is **"Ask Caspr"** — read-only scope history at the top, live Q&A continuing below.
- **Ask Caspr is accessible from the generation screen onward.** During Theater it surfaces as the **get-to-know drawer** (conversation history + get-to-know Q&A, collapsible to Peek to watch the Theater). After generation it's the Ask tab on the working report.
- The get-to-know is **engagement + profile-building for future runs** — consistent with the lock, it does not alter the in-flight report.
- Only window where chat is not surfaced: gate-click → generation-start (seconds).

### 8.0 One thread — the get-to-know IS a Caspr message (LOCKED 2026-08-06)

**There is no separate "get-to-know" surface.** The earlier build presented get-to-know as its own spotlight/carousel drawer *alongside* the Ask Caspr chat — two mental models in one pane, which never felt seamless (you couldn't move from the question to Ask and back without a mode-switch). **Resolved: get-to-know is simply Caspr's proactive message at the head of the single Ask Caspr thread.** There is nothing to navigate *between* because they are the same surface.

- The pane **is** Ask Caspr (the switcher already shows only `Ask Caspr` active during Theater/Generation). **Pane heading at this stage = `WHILE CASPR WORKS`** (not `ASK CASPR` — the tab is Ask Caspr but the heading names the moment).
- Thread continuity: the original ask as a **user bubble**, Caspr's reply (`Proposed a Study — $80. Generating now.`), then a **product-voice notification line** reading **`Sourcing now — assessing and concluding follow.`** Then the get-to-know as a **Caspr message** + its visual + options.

  > **⚠ Corrected 2026-09-01 — this bullet described a format that had already been retired.**
  >
  > It previously specified *"the hairline+centered-label format ... here it reads `INITIATING LEARNING BRAIN`"*. Two things were wrong with that, and `DEV-BRIEF.md` §10 was right:
  >
  > 1. **The centred-caps-between-hairlines phase label is retired** (`DEV-BRIEF.md` §10 → §2.1), in the same sweep that turned `OR JUST ASK` / `OR STEER BY INTENT` into product voice. **The file had already been migrated** — what is drawn in `763:77` / `760:66` / `775:2` is **Inter Italic 13 `#5c5b58`, left-aligned, sentence case, with a product-voice dot and a single `#ececea` hairline above**. Not centred, not caps, not between hairlines.
  > 2. **`Learning Brain` is retired vocabulary** — see `source-assess-conclude.md`. Never *brain*, *thinking*, *reasoning* or *cognitive*.
  >
  > **The two specs were not actually in conflict about the slot** — only about its styling and its string. The slot survives as **one product-voice line**, which is why it does **not** carry the `SOURCING → ASSESSING → CONCLUDING` lockup: that lockup narrates a running sequence, and this node fires once. Applied to all **8** instances 2026-09-01.
- **§11 conversation styling is mandatory** (not a heading look): Caspr **nudge** (directive question) = Inter **Regular 13** ink `#1a1a17`; Caspr **reply** (conversational) = Inter **Regular 13** grey `#5c5b58`; **never Medium/bold**. **User bubble = white fill + 1px `#e2e1de` border, 2px radius**, right-aligned (pops off canvas) — *not* a grey pill. (The older `Working · Ask Caspr` `810:2147/944:1394` still show a grey bubble — pre-§11; the rule is white+hairline and wins.)
- **Revisit = scroll up** (options stay live/tappable). **Answer = tap an option or just type** in the docked input — both continue the same scroll.
- Built: `Theater — Desktop v3` `763:77` + `Theater — Mobile v3` `760:66` (carousel dots removed; hero serif → Regular 13; options → 2×2 **intent-glyph grid** = the prompt's visual).

### 8.0.1 Engagement formats — one family, varied to avoid monotony (planned)

Get-to-know is one *type* of proactive Caspr message. To keep the thread from feeling repetitive across runs, Caspr rotates a **family of in-thread engagement formats**. **Every format carries a visual — none is a bare line of Caspr text** (Joy, 2026-08-06). Reference: `Engagement Formats — Ask Caspr thread (ref)` `1525:2`.

| Format | Visual | Input |
|---|---|---|
| **Prompt · options** | 2×2 **intent-glyph grid** (target / document / bars / crosshair) | tap an option |
| **Poll** | **aggregate result bars** (`62%` …) revealed after voting + "you voted · N readers" | single vote → reveal |
| **Info visual** | stat + **sparkline** (`$412bn` + mini bars + context) | none — ambient |
| **Feedback** | **report-cover thumbnail** + **star row** (★★★★☆) | tap rating |
| **Caspr update** | **feature thumbnail** + `NEW` tag + `See what's new →` | link out |

**Interaction (LOCKED):** on pick, the card's **visual is replaced by a right-aligned user bubble** (the chosen answer, white+hairline per §11), then Caspr sends the **next** format. Decline or type **"stop"** → no more appear this run. Same collapse if the user asks their own question (the thread pivots to that).

**Pacing (LOCKED):** **up to 3 per generation**, **one at a time**, never blocks the report; stops on **"stop"** or when the user asks their own question. Tunable.

Dev note: implement as a typed `EngagementMessage` union rendered in the Ask thread; Caspr's server decides which format to inject and when (engagement + profile-building), never blocking or altering the in-flight report. Extensible — new formats slot into the same union.

### 8.1 Pane-switcher activation by stage (DEV)

The `Contents · Ask Caspr · Edit · Outputs · Updates` switcher activates **progressively** — a tab is live only once the thing it points at exists:

| Flow stage | Active tab(s) |
|---|---|
| Conversation · Layout · Gate | *no switcher — still building the analysis* |
| **Learning + Generating** (Theater/Generation) | **Ask Caspr only** — all others **disabled** (dimmed, ~40% opacity, not clickable) |
| **Report complete** (Working) | Contents · Ask Caspr · Edit · Outputs active; **Updates = "coming soon"** until new signals arrive (Phase 2) |

Rationale: during generation nothing exists to navigate, edit, or export — only the conversation is live, so **Ask Caspr is the sole active tab**; on completion the rest unlock together. Applied on Theater — Desktop v3.

## 9. Related

- **Contents view** (the report TOC, `Contents` tab) — built: `Working · Contents — Desktop v3` + `— Mobile v3`.
  - **Nesting by tier:** Brief = flat (or omitted for very short briefs); Study + Intelligence = nested (sections + sub-sections). Row style = the Welcome analyses list (number · title · page · chevron · hairline).
  - **Scroll-sync (scroll-spy) — DEV:** the TOC and the report scroll are two-way linked. As the user scrolls the report in the centre, the current **section _and_ sub-section** highlight automatically; tapping a TOC row scrolls the report to it.
  - **Highlight treatment:** the **current leaf row** (whatever level you are actually at) gets the **red accent text**. When the leaf is a sub-section, its **parent section** carries a lighter breadcrumb cue — the parent's *number* in red, title in ink (NOT full red text) — one dominant "you are here" plus branch context, never two competing full-red rows.
- Metering: `pricing-model.md` §4.6 (edit credits A · output generation B). Edit model: `EDIT-ECONOMICS.md`; visual model: `visualization-library.md`.

---

## Open items (pending Joy / Jayant)

1. **Custom user-template pricing** — one-time setup fee vs. per-report (§5). Defines paid-feature status.
2. **Charged-beyond output price/bundle** — pending Jayant's per-output cost (`pricing-model.md` §13, item 13).
3. Confirm the by-tier format defaults in §4 (esp. XLSX in Study + Intelligence, MD in all).

*Owner: Joy · 2026-08-04.*

---

## Update — status spine + Creating cutoff (2026-08-17)

- **Status spine `Learning → Analyzing → Generating → Creating` lives in the report-title eyebrow only** (`TYPE · DEPTH · STATUS`). In the chat it is narrated **conversationally**, not as a progress bar: inline rule-text-rule dividers mark phase transitions; the user's mid-run answers render as an **italicised reply bubble**, Caspr's mid-run notes as an **italicised statement**. Built: Generation desktop `775:2` + mobile `777:83`.
- **Creating is the v1/v2 cutoff.** At Creating start the eyebrow reads `… · CREATING`, a `CREATING OUTPUTS` divider appears, and the chat shows *"Finalizing your outputs — new requests will apply to the next version."* Pre-Creating edits fold into v1; post-Creating requests queue to v2 (routing already in the build). Built: Creating cutoff desktop `2186:4565` + mobile `2187:4708`.
- **No queued screen.** Jayant confirmed capacity (theater 5s→~30s then streaming); remove the queued-position path. Only a rare async *"at capacity — we'll notify you"* fallback (no position counter) if a start can't be guaranteed.
- **Edit economics** (what a finished report costs to change) live in `../app-handoff/EDIT-ECONOMICS.md`; the gate is the pricing authority for a re-analyse (same-scope refresh 50%, new-scope / tier-change full).
