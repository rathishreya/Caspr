# Content Engine — Session Brief

**Paste into a fresh session rooted at `G:\My Drive\Caspr\caspr-claude-core`.** Self-contained.

*Version 2 — 2026-08-20. **v1 asked this session to decide what the machine makes. That is now decided.*** [`content-approach.md`](content-approach.md) settles the content model, the editorial line, the source rule and the selection system. **This session builds the machine.**

---

## 0 · What changed, and what your job is now

v1 was written when the content model did not exist. It asked for a content model, a source map, an editorial line, a repurposing graph, generation prompts, a linter and a capacity plan — seven things, of which the first three were strategy.

**The strategy is done.** `content-approach.md` decides:

- **Four content types.** Published analysis (1–2/month) · search answers (2/week) · the permission layer (~10, front-loaded) · derivatives (~20/week). Nothing is originated on-channel
- **The editorial line** — one argument in three movements over twelve weeks
- **The source rule** — cited, or it does not ship
- **How topics get picked** — a four-source demand pipeline that ranks, and a human who chooses
- **The 113-card library question** — resolved. It is a product support corpus; three of its eleven categories hand over

> **Your job is the working machinery: the demand intake, the generation prompts, the linter, the repurposing graph, and the twelve-week calendar. Not the strategy above them.**

**If you find something in `content-approach.md` that is wrong, say so and argue it.** Do not silently redesign it — but do not treat it as sacred either. Rule 4 below applies to it exactly as it applies to everything else.

---

## 0.1 · Scope boundary — what this session does NOT write

**The launch content is written by the website session**, from [`website-session-prompt.md`](../website-session-prompt.md). Two sessions writing the same pages is the fork this project has already paid for once.

| Not yours | Whose |
|---|---|
| The six permission-layer pieces | Website session |
| The `/alternatives/*` pages | Website session |
| Page copy of any kind | Website session |
| The portal's screens | Portal build — paused pending this session |

**You build the thing that produces content every week from launch onward.** The website session writes the content that has to exist *on day one*.

> **Capability complete, throughput configurable.** Build every capability the engine will need, then run it narrow. Widening — more ICPs, more channels, higher volume — must be a **configuration change, never a build.** Anything that would require Joy to return and commission an add-on when a signal fires is a design failure: the signal surfaces automatically and the response is one action.

---

## 1 · The working standard

`CLAUDE.md` §5 applies in full. **Rules 2 and 5 do most of the work here.**

**The failure that produced these rules**, so it is not repeated: a session was asked for eight ICP headlines, had a tidy summary table loaded, wrote from it, and produced eight variations on one idea. The material it needed was in a 76KB primary source it never opened. The best line on the live site — *"Your library closed at 9pm. Your case brief doesn't care."* — was **found** at `icp-personas.md:709`, not invented.

**That is the method for this entire session.** The engine's job is not to generate plausible marketing. It is to surface what is already true and already researched, at volume.

| | Rule | Test |
|---|---|---|
| **1** | Name the sources before producing — by filename and section | Is there a visible list naming files? |
| **2** | **Primary over summary.** Never write from a map when the territory exists | Can you quote the line that produced each item? |
| **3** | **Prior sessions are a source.** Search transcripts before assuming anything is undecided | Did you search first? |
| **4** | Existing output is evidence, not an anchor. State what you keep and depart from, and why | Is there an explicit keep/depart list? |
| **5** | **Traceable, or flagged as invented** | For each item, can you name its origin? |
| **6** | Diagnose the layer — input, structure or craft — before redrafting | Was the failing layer named first? |
| **7** | If gathering feels like a detour, it is the work | Did you defer a lookup to keep producing? |

---

## 2 · Read these first — binding

| File | Why |
|---|---|
| **`docs/gtm/content-approach.md`** | **The specification you are implementing.** Four types, the editorial line, the selection system, the resolved decisions |
| `docs/gtm/channel-model.md` | Where each item goes, who owns it, its kill condition |
| `docs/gtm/gtm-api-contract.md` | The four tools the engine calls, and the call order that keeps it cheap |
| **`.agents/icp-personas.md`** | **The primary source.** Eight day-in-the-life narratives, Pain-In-Their-Own-Language, and the Objections tables — which is where `content-approach.md` §2 came from. **Open it. Do not work from §2's summary of it** |
| `.agents/icp-copy.md` **v3** | The eight approved ICP message sets, each cited to a persona line |
| `docs/site-truth.md` | §1.0 positioning · §2 the ladder · §6 canonical numbers · §7 claims register |
| `.agents/brand-guidelines.md` | Voice, the five content pillars, banned vocabulary |
| `.agents/product-marketing-context.md` | Master reference — journey, business model, objections, customer language |
| `caspr-dm-handover/02-linkedin-profiles/audit.md` §5 | **The seven voice lanes.** Every personal post generates into one of these |
| `docs/gtm/operations-runbook.md` §1–4 | The weekly cycle, who reviews what, and the volume table **that `content-approach.md` §6 corrects** |
| `docs/gtm/portal-build-spec.md` §3.1–3.5 | Truth layer, generator, linter, review queue, rejection ledger — what you plug into |
| `docs/gtm/portal-design-spec.md` §5 | The workstream tree |
| `docs/gtm/reengagement-sequence.md` | Founder-voice email already written — the model for that register |
| **`content/caspr-help-content-repository.xlsx`** | **Open the workbook itself.** `content-approach.md` §7 hands over categories **B, H and J** only — and §9 flags that it was resolved from summaries, not from the cards. Verify before using them |
| `content/pass3-change-proposal.md` | **A2 and A4 are factually wrong in the cards today.** They must not propagate into published marketing |
| `content/assets/visuals/*` | Existing diagrams, infographics, social cards. Inventory before commissioning anything new |

**Also search transcripts** (`search_session_transcripts`) — nine Caspr sessions, including "Caspr help content repository", which built the 113 cards. Its reasoning is recorded and largely unread.

---

## 3 · Skills

| Skill | When |
|---|---|
| `marketing-skills:copywriting` | Any actual copy, including inside generation prompts |
| `marketing-skills:social-content` | Channel specs, short-form, repurposing |
| `marketing-skills:programmatic-seo` · `ai-seo` · `seo-audit` | The search-answer layer and the answer-engine surface |
| `marketing-skills:email-sequence` | Lifecycle email content |
| `marketing-skills:marketing-psychology` | When something needs to land harder |
| `dataviz` | Before any chart or visual asset spec |
| `marketing-skills:content-strategy` | Only if you are arguing with `content-approach.md` — not to redo it |

---

## 4 · The rule the whole engine rests on

> **Cited, or it does not ship.** Every generated item carries either a finding traceable to a real Caspr analysis, or an attributed opinion from a named person. An item with neither is not generated.

This is the defence against a company whose entire positioning is *"we are not the machine that produces confident unsourced text"* publishing exactly that. `icp-personas.md:720` is a buyer describing the failure: *"ChatGPT gives me numbers. When I ask for the source, it makes one up."*

**The supply consequence is now costed and scheduled**, which v1 flagged as uncosted: 1–2 published analyses a month, $80 each at list, topic chosen from the demand pipeline, commissioned by a named human. **The engine's fuel is not the constraint. Attention is.**

---

## 5 · What to build

### 5.1 The demand intake

**The selection system in `content-approach.md` §5, made real.** Four signal sources; **three work pre-launch and one does not.**

| | Signal | Pre-launch? |
|---|---|---|
| 1 | Prompt clusters — `demand_signal`, per `gtm-api-contract.md` §4 | **No.** No users yet |
| 2 | Search volume and trend | Yes |
| 3 | Community question flow — r/consulting, r/MBA, WSO, #mrx, ESOMAR | Yes |
| 4 | Event flow — M&A, funding, regulatory change by sector | Yes |

**Specify:** how each is collected, how often, how they are normalised onto one ranked candidate list, and how the weighting shifts to signal 1 once volume exists. **Output is a ranked list with the evidence attached** — signal source, volume, trend, ICP served, and whether Caspr can source it well. A human picks from the top.

**Two owned datasets are mineable today** and should be, before launch: Joy's 60+ analyses already run, and the segmentation export of the 1,600 (pending from Jayant's team).

**Be honest about signals 2–4.** Name the actual sources and how they are read. If one of them needs a paid tool or a manual hour a week, say so — the budget is $1,000/month total and `channel-model.md` §6 already flags SEO resourcing as thin.

### 5.2 The generation prompts

**The engine's working parts, not illustrations.** One per content type, plus one per derivative format.

Each assembles: canonical facts from `site-truth.md` §6 · voice rules · the assigned lane (for personal posts) · **active failure modes from the rejection ledger** · the source material · the citation the item must carry.

**Model tiering:** frontier for origination (types A, B, C); Haiku for transformation (type D, ~80% of volume).

### 5.3 The linter rule set

**Machine-runnable rules, not prose a human interprets.** From `site-truth.md` §7 and `brand-guidelines.md`:

banned vocabulary · prohibited claims · stale or unmatched numbers · **competitor or LLM-category naming in lead copy** · **reader-labour framing** (*verify · check the working · traceable · see for yourself · audit*) · the Ghost Research boundary · **citation presence** · tier-name usage without explanation · per-channel length and format constraints · duplication against everything already published.

**Two that need care:** *reader-labour framing* is a phrase-level rule with real false-positive risk, and *citation presence* must check that a citation resolves, not merely that a citation field is populated.

### 5.4 The repurposing graph

Concrete. One origination → its exact derivatives, each with model tier and assigned reviewer.

`content-approach.md` §3D counts **17–24 derivatives from one published analysis** and confirms the CMS screen's "twenty" — **but only for type A.** A search page fans out to 3–4; the permission layer barely fans out at all. **Correct the screen to read "one published analysis", not "one blog post."**

### 5.5 The twelve-week calendar

**Derived from the editorial line in `content-approach.md` §4 — three movements, one argument.** Not a fresh topic brainstorm.

Per week: which items, which type, which movement, which channel, which reviewer. **Every topic traceable (rule 5). Anything invented, labelled invented.**

### 5.6 Volume against capacity — measured, not assumed

`content-approach.md` §6 rebuilds the runbook's flat 70 minutes into origination (8–15 min each) vs derivative (1–2 min each), landing at **~23 items in 50–85 minutes.**

**Those per-item costs are judgement, and §9 of that document says so.** Specify how they get **measured in week one** and what happens to the volume plan if the ratio does not hold. The whole capacity case rests on it.

---

## 6 · Open questions — genuinely open, unlike v1's

v1 posed three questions that are now answered in `content-approach.md` §10. These are not.

**Where does the rejection ledger's feedback actually land?** `portal-build-spec.md` §3.5 says reject reasons feed active failure modes back into generation prompts. **Specify the mechanism** — how a reason code becomes a prompt constraint, how a constraint expires when it stops firing, and how the loop is prevented from accumulating a hundred stale rules that make every prompt worse.

**What does the engine do in the weeks with no published analysis?** At 1–2 a month, roughly half the weeks have no type-A origination — and type A is what most derivatives derive from. **Either the fan-out spreads across weeks by design, or the derivative volume is lumpy.** Say which, explicitly.

**What is the cold-start content?** The engine's first week has no rejection ledger, no prompt clusters, and no published analysis to derive from. **Week one is a different problem from week ten** and needs its own answer.

---

## 7 · Output

**`docs/gtm/content-engine.md`** — §5.1 to §5.6.

**`docs/gtm/content-engine-prompts.md`** — the generation prompts, kept separate because they iterate against the rejection ledger and should not churn the spec.

Close with:

1. **Sources opened** — the rule-1 list, naming files and sections
2. **Keep / depart** — on `content-approach.md` specifically, and on the runbook volume table
3. **Traceability** — anything invented, labelled
4. **Portal implications** — what in `portal-build-spec.md` or `portal-design-spec.md` this changes. **The portal build is paused pending this, so be explicit**
5. **Flags** — decisions, facts or dependencies needing Joy

---

## 8 · How this will be judged

- **Is the demand intake real?** Named sources, a stated cadence, an honest cost — or a diagram of a pipeline that nobody can run.
- **Are the generation prompts usable as written**, or are they descriptions of prompts?
- **Are the linter rules machine-runnable**, or prose?
- **Does the calendar carry the argument** from `content-approach.md` §4, or is it a list of topics?
- **Is the cold-start answered?** Week one is the week most likely to be improvised, and improvisation is what the rejection ledger exists to prevent.
- **Was the workbook actually opened** before categories B, H and J were treated as source material?
