# App Session — Positioning Alignment Brief

**Paste into a fresh session rooted at `G:\My Drive\Caspr\caspr-claude-core`.** Self-contained.

*Version 1 — 2026-08-20. Written after the positioning was locked the same day.*

---

## 0 · What this is, and what it is not

Caspr's positioning was locked on 2026-08-20. **Most of what follows is copy.** The app's structure, flows,
components and locked visual decisions are correct and stay as they are.

**But six things are not copy**, and those are the reason this brief exists. They are in §6. Read them before
concluding this is a find-and-replace job — and equally, **do not use them as licence to redesign the app.**
The bar for changing anything structural here is that the positioning is otherwise unbacked in the product.

---

## 1 · The working standard

This is the commercial foundation of the business. The failure mode below is not hypothetical — it happened
on 2026-08-20 and cost a day.

A session was asked to write eight ICP headlines. It had a tidy summary table loaded, wrote from that, and
produced eight variations of one idea. Asked to improve them, it diagnosed a *craft* problem, added a
rhetorical turn to each, and produced eight better-sounding versions of the same single idea — because the
problem was never craft. The material it needed was in a 76KB primary source it never opened.

**The seven rules — `CLAUDE.md` §5. Each has a test.**

| | Rule | Test |
|---|---|---|
| **1** | **Name the sources before producing** — by filename and section. If something relevant exists and you skipped it, say so | Is there a visible list naming files, not categories? |
| **2** | **Primary over summary.** A spec index is a map; the spec is the territory. Never write from the map | Can you quote the line that produced each decision? |
| **3** | **Prior sessions are a source.** `search_session_transcripts` holds months of decisions, including ones explicitly rejected. **The app specs are dense with "explored and rejected" notes — re-proposing a rejected option is the most likely way to waste this session** | Did you search before proposing? |
| **4** | **Existing output is evidence, not an anchor.** Read the Figma and the specs. State what you keep and why, what you depart from and why | Is there an explicit keep/depart list? |
| **5** | **Traceable, or flagged as invented.** Every changed string and every proposal points at a locked decision, a spec line, or a stated assumption | For each change, can you name its origin? |
| **6** | **Diagnose the layer before redrafting.** Name whether something failed on input, structure or craft before rewriting | Was the failing layer named first? |
| **7** | **If gathering feels like a detour, it is the work** | Did you defer a lookup to keep producing? |

**Rule 3 matters more here than anywhere.** The app specs record what was tried and rejected — LHS-graph/RHS-list
for the Theater, the 44:56 split, the "squarish" graph, "Popular Opinion" as a name, single-quote attribution on
The Signal. Proposing any of those again wastes everyone's time.

---

## 2 · Read these first — binding

| File | Why |
|---|---|
| `docs/site-truth.md` §1.0 | The locked positioning stack and its three rules |
| `.agents/brand-guidelines.md` | Voice. Content pillars reordered 2026-08-20 |
| `.agents/icp-copy.md` **v3** | Approved ICP messages — the register the app should echo |
| `docs/product/design-guidelines.md` | **The consolidated visual system.** Binding |
| `docs/product/app-shell-framework.md` | Shell, panes, drawers, The Signal (§17) |
| `docs/product/visual-design-language.md` | Tokens, type, surfaces |
| `docs/product/onboarding-understanding.md` | Signup-is-the-tool. **Relevant to §6.3** |
| `docs/product/gate-output-spec.md` | The gate — scope, params, pricing surface |
| `docs/product/theater-visualization-spec.md` | The generation spectacle. **Relevant to §6.4** |
| `docs/report-guidance/report-style-guide.md` | Report typography, evidence classes, The Signal (§9a) |
| `docs/product/copy-standards.md` | In-product copy rules |
| `docs/product/motion-and-interaction-states.md` | Motion, states |
| `.agents/pricing-model.md` · `docs/product/document-taxonomy.md` | Canonical numbers; type/ladder vocabulary |

**Figma — app file `y2F394I4CwEeSzH2kKuDCt`.** Read before proposing. **Invoke `anthropic-skills:figma-use`
before every `use_figma` call** — mandatory, and skipping it causes hard-to-debug failures.

---

## 3 · Skills

| Skill | When |
|---|---|
| `anthropic-skills:figma-use` | **Mandatory before every `use_figma` call** |
| `marketing-skills:copywriting` | Any user-facing string |
| `marketing-skills:copy-editing` | The line-by-line pass at the end |
| `anthropic-skills:design-motion-principles` | Only if motion changes are proposed |

---

## 4 · The positioning

| | |
|---|---|
| **Category** | Analytical AI |
| **Identity** | **Not an assistant. An analyst.** |
| **Promise** | **Arrive certain.** |
| **Proof** | **Every source, credible. Every claim, triangulated. Every report, defensible.** |

**Three rules:**

1. **Never name a competitor or the LLM category** in any user-facing string.
2. **Never frame proof as work for the user.** *Verify · check the source · traceable · see for yourself* all sell the user more labour and contradict the promise. **The red dot exists so the user has the answer when the room asks — not so they can confirm Caspr is honest.** This is the single most common error to look for.
3. **Cost is stated plainly, never sold.** The gate itemises; it does not persuade.

**Retired claims — remove wherever they appear:** *"Zero hallucinations"* · *"LAM" / "Large Analysis Model"* ·
any source count other than **25M+** · *"SOC 2 certified"* (only *"SOC 2 Type I audit in progress"*).

---

## 5 · The copy work

Straightforward. Sweep every user-facing string against §4.

**Known instances to fix:**

- **Onboarding first-time-user page** carries the retired hero *"15 minutes. 100 pages. Cited to source."* → the approved homepage hero is *"Not an assistant. An analyst."* with *"Any question your board will ask — answered, sourced, and ready before they ask it."* Adapt for the in-product context; do not paste the website's microcopy row
- **Any citation microcopy** phrased as verification — tooltips, panel headers, empty states, help text
- **Any source count** that is not 25M+
- **Chat greeting, assessment stage card, quick-start tags** — check against the current stack
- **Gate copy** — confirm it itemises without persuading

**Also flag, do not fix:** the same strings in `docs/app-handoff/*` and the Figma text nodes, so the dev handover
and the design file do not diverge from each other.

---

## 6 · The six things that are not copy

Each is a real gap between what the positioning claims and what the product currently expresses. **Propose;
do not build.** Joy decides.

### 6.1 "Every claim, triangulated" has no expression in the product

This is a headline proof beat and **nothing in the report shows it.** The user sees cited findings and The
Signal. They never see that sources disagreed, that alternatives were considered, or that one was chosen over
another with a reason.

This matters commercially: Joy's position is that the differentiator is not *where the number came from* — any
tool can cite — but **why that source and not the other, and how conflicting figures were triangulated.** If
that is the claim, the report has to carry it.

**Propose the lightest treatment that would satisfy it.** A methodology note per section, an expandable on a
triangulated figure, a "sources considered" line. Do not design a feature; propose the smallest thing that makes
the claim true.

### 6.2 The report has two evidence classes and needs a third

`report-style-guide.md` §9a and `app-shell-framework.md` §17 already establish a **two-class system**, and it is
well designed: **cited** findings in the editorial serif with red-dot citations, and **The Signal** — crowd
sentiment — in sans on a cool-grey tint with aggregate attribution.

There is no class for **derived**: a figure that exists because Caspr triangulated it, since no single source
carried it. Today it either looks cited or it looks like opinion, and it is neither.

**The vocabulary to solve this already exists** — surface tint, typeface class, attribution style. Propose a
third class using that grammar. **Do not invent a new visual language for it.**

*Boundary: the underlying methodology work is a separate session, handed to Jayant. This item is only about how a
derived figure is presented once it exists.*

### 6.3 Asking-before-working is now the identity, and the spec treats it as friction

`onboarding-understanding.md` frames the 2-minute interaction — clarifying questions, layout approval — as a cost
to minimise. Under **"Not an assistant. An analyst"**, those two moments *are* the identity: an analyst scopes the
question before working, and shows you the structure before producing.

`gtm-strategy` principle 4 was rewritten on 2026-08-20 for the same reason — the 2-minute model is now a
supporting fact, not the primary message.

**The question for this session:** should the clarifying-question and layout-approval moments be given more
presence rather than less? Argue it either way, with evidence from the spec and from `icp-personas.md` — note
`:1` in the customer-language section: *"The questions it asks me actually made me think about things I'd
missed."* That is a user describing the identity, unprompted, and it is currently unexploited.

### 6.4 What the Theater dramatises

The Theater is the most-watched moment in the product. If it dramatises **breadth and speed**, it performs the
retired positioning. If it dramatises **source selection and credibility**, it performs the current one.

Read `theater-visualization-spec.md` and report which it currently does. If it is the former, propose the
smallest change that shifts it. **The locked layout is not in question** — list-narrow-left, graph-wide-right,
25:75, and the alternatives already explicitly rejected. This is about what the animation *says*, not where it sits.

### 6.5 Two design rationales rest on a retired claim

Both `app-shell-framework.md` §17 and `report-style-guide.md` §9a justify The Signal's treatment on *"Caspr's
credibility rests on every insight cited, zero hallucination."* **That claim is retired.**

The treatment is almost certainly still right. The *stated reason* is not, and a future session rebuilding from
it will rebuild from a dead claim. **Restate the rationale** against *every source credible, every conclusion
defensible* — and confirm the treatment still follows from it.

### 6.6 The red dot is the proof, and it is framed as a chore

Joy confirmed the red dot is already the mechanism for *"every report, defensible"*, and that it is built.
So the proof exists — **the framing around it may be inverting its value.**

Audit every surface where citations appear: labels, tooltips, first-run explanation, help. Anything that presents
them as *something the user should check* converts the product's strongest asset into homework. The correct frame
is readiness — the answer is there the moment the room asks for it.

---

## 7 · What is locked — do not reopen

- **The eight FINAL UI decisions** — white chrome, three fonts, the `595:2` icon set, four drawer detents, the async drawer, the white Theater variant
- **The 0 / 2 radius scale**, the spacing scale, the token layer
- **Report typography** and the two existing evidence classes
- **Theater layout** — 25:75, list-narrow-left, graph-wide-right
- **Gate structure** — single pre-generation confirmation of all parameters
- **Navigation model** — Analyses as home, the draft/filed gate, drawer semantics

**Clone, never hand-rebuild.** Reuse and modify existing components. This is a standing instruction from Joy and
it has been broken before.

---

## 8 · Output

**One file: `docs/app-positioning-alignment.md`.** No Figma edits until Joy approves.

**Part A — Copy sweep.** Every string to change: location (screen, frame ID, spec line), current text, proposed
text, and which rule it breaks. Include the app-handoff and Figma instances so they stay in sync.

**Part B — The six proposals.** For each item in §6: what the gap is, the *smallest* change that closes it, what
it costs in design and engineering, and what happens if it is not done. **Recommend, do not hedge.** Where you
think an item needs no change, say so and defend it — "no change" is a valid, useful answer.

**Part C — Close.**
1. **Sources opened** — the rule-1 list
2. **Keep / depart** — what you kept from the specs and Figma, and why
3. **Rejected options re-checked** — what you searched in transcripts, and what you confirmed was already rejected
4. **Flags** — anything needing a decision, a fact, or Jayant

---

## 9 · How this will be judged

- **Is Part A complete?** A missed string on a screen the user sees every day is worse than a debatable proposal.
- **Is every §6 proposal the *smallest* thing that closes the gap**, or is it a redesign wearing a rationale?
- **Did you re-propose anything the specs already record as rejected?** That is the clearest sign the primary sources were not read.
- **Does anything you wrote ask the user to do work?**
- **Can each change be traced to a rule or a spec line?**
