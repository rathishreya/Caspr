# Conventions conformance — the rule register

**Purpose.** Every convention this project has agreed, expressed as a numbered rule
a machine can check and a reviewer can cite. One ID per rule, one source per rule,
one verdict per rule.

**Status:** register v1, 2026-08-25. Authored by the conformance session.
**Authority:** this document is the *why*. [`conformance/rules.json`](conformance/rules.json)
is the *what runs*. They are kept in step by `SPEC-DRIFT` (§6.3) — a rule in one
and not the other is a build failure, not a discrepancy to live with.

**This session changes no code.** It reads, it measures, it reports. Fixes belong
to the dev session, which is the same convention `TEST-HANDOVER-2026-08-20.md`
established and which closed 12 of 16 findings last time.

---

## 0 · How to read this

Every rule carries five fields.

| Field | Meaning |
|---|---|
| **ID** | Stable. Never reused, never renumbered. Cite it in review comments |
| **Rule** | The requirement, stated so a yes/no answer exists |
| **Source** | The document and section it comes from. **No rule exists without one** |
| **Tier** | **1** = locked, blocking. **2** = proposed, advisory only |
| **Check** | How it is verified — `static`, `build`, `runtime`, `repo`, or `manual` |

**A rule with no source is not a rule.** Nothing in this register is my opinion
about good engineering. Where I thought something *should* be a rule but could not
find a decision behind it, it is listed in §7 as a gap for Joy, not smuggled in as
a requirement.

---

## 1 · What counts as a standard here

This is the load-bearing decision in the whole exercise, so it is stated first.

### 1.1 Tier 1 — locked, and therefore blocking

A convention is Tier 1 when a document says it was decided, names who decided it,
and no later document overturns it. These are the six:

| Document | Locked | What it governs |
|---|---|---|
| [`FRONTEND-CONVENTIONS-RECONCILED.md`](FRONTEND-CONVENTIONS-RECONCILED.md) | 2026-08-21, *"Status: locked. Everything below is a decision, not a proposal"* | Structure, transport, naming, layering |
| [`design-guidelines.md`](../product/design-guidelines.md) | §§ locked 2026-07-24 → 2026-08-21 | Colour, contrast, radius, spacing, typography, shell, responsive |
| [`focus-keyboard-spec.md`](../product/focus-keyboard-spec.md) | 2026-08-21 | Focus indicator, target sizes, keyboard models |
| [`ai-disclosure-spec.md`](../product/ai-disclosure-spec.md) | 2026-08-21 | EU AI Act Art. 50 surfaces and metadata |
| [`copy-standards.md`](../product/copy-standards.md) | Owner Joy, 2026-08-10, *"enforced at build"* | Product UI copy, terminology, Lingo tokens |
| [`motion-and-interaction-states.md`](../product/motion-and-interaction-states.md) | Owner Joy, 2026-08-10 | Motion tokens, frequency gate, reduced-motion |

Plus the three habits [`TEST-SESSION-PROMPT-2026-08-25.md`](TEST-SESSION-PROMPT-2026-08-25.md) §8
records as *"now enforced by tests rather than intention"* — they read as rules, they
are cited as rules, and they are the direct cause of the `$NaN` class of bug. They
are Tier 1 (family **SEAM**).

### 1.2 Tier 2 — proposed, and therefore advisory only

[`ENGINEERING-STANDARDS-PROPOSAL.md`](ENGINEERING-STANDARDS-PROPOSAL.md) opens with
**"Status: proposal, nothing adopted"** and closes by asking Joy three direct
questions. I searched the later documents and the session transcripts and **found no
answer to any of the three.** Until they are answered, every requirement in that
document is measured and reported, and none of it fails a build.

**This distinction is the point.** A compliance report that fails the build on ASVS
Level 2, Conventional Commits and a 300-line file budget — none of which anyone
agreed to — is a report that gets muted within a week. Tier 2 exists so the numbers
are visible without being enforced.

The three unanswered questions, restated so they are not lost:

1. **SOC 2 Type II or ISO 27001 first?** A revenue-geography decision. Note that
   [`security-posture.md`](../../.agents/security-posture.md) §1 already claims
   **ISO 27001:2022 active** and **SOC 2 Type I in progress** — which may mean the
   proposal's §7 is asking a question the business has already answered elsewhere,
   and the two documents need reconciling regardless of the standards work.
2. **ASVS Level 2 confirmed, or Level 1?**
3. **Do the Tier 1 legal items (AI Act, PCI script inventory, security headers)
   proceed now, separately from any rebuild?**

### 1.3 What is deliberately excluded

- **Anything from a `DEV-PROMPT-*` or `DEV-RESPONSE-*` exchange that was not
  subsequently locked.** Those are working conversations; treating them as standards
  would freeze half-finished thinking.
- **Pixel fidelity.** [`PIXEL-AUDIT-PROTOCOL.md`](PIXEL-AUDIT-PROTOCOL.md) measures a
  build against Figma coordinates. [`DESIGN-INPUTS-RESPONSE.md`](DESIGN-INPUTS-RESPONSE.md)
  is explicit that this was *"correct answers, wrong question"* and that
  **"where the frame and this CSS disagree, the CSS wins."** Conformance checks the
  declared rules, not the drawn frames.
- **Behavioural correctness.** That is the test session's job and it already has a
  live convention. This register checks *how the code is written*, not *what it does*.

---

## 2 · Conflicts found between locked documents

Three. Each is resolved here, and each resolution is itself a finding the dev session
should act on, because a stale locked document will be built from.

### 2.1 Focus ring thickness — **1.5px wins**

| Document | Says | Date |
|---|---|---|
| `motion-and-interaction-states.md` §4 | *"2px `--accent` (red) focus ring at 2px offset"* | 2026-08-10 |
| `DESIGN-INPUTS-RESPONSE.md` §6b | *"Ring **2px**, `focus/ring`"* | 2026-08-21 |
| **`focus-keyboard-spec.md` §1** | **"Ring 1.5px"** — with the reasoning: 2px perimeter is **2.4.13, which is AAA**; we hold **AA**, where 1.4.11's 3:1 is the measurable requirement | **2026-08-21, locked** |
| `design-guidelines.md` §10a | **"1.5px ring, 2px offset"** — *"(1.5px, not 2: the 2px perimeter is a AAA rule; we hold AA)"* | 2026-08-21, locked |

**Resolution: 1.5px.** Two locked documents agree on it and give a reason; the two
that say 2px are the earlier drafts of the same decision. `FOCUS-01` encodes 1.5px.

**Action for the dev session:** `motion-and-interaction-states.md` §4 still says 2px
and is the document a developer implementing hover/focus states would most naturally
open. It needs a one-line correction pointing at `focus-keyboard-spec.md`.

### 2.2 Target size — 24×24 and ≥44 are both true, and they are not the same rule

`motion-and-interaction-states.md` §4 says *"Hit targets ≥44px on Compact."*
`focus-keyboard-spec.md` §2 and `design-guidelines.md` §10a say **24×24 minimum**.

**Resolution: both stand, at different strengths.** 24×24 is **WCAG 2.5.8 AA — the
legal floor**, and is what `TARGET-01` enforces as blocking. 44px on compact is a
design preference with no regulation behind it; it is `TARGET-02`, advisory. Reporting
a 30px control on mobile as a legal accessibility failure would be wrong, and the kind
of wrong that discredits the rest of the report.

### 2.3 Error text colour — flagged in the source, still unresolved

`motion-and-interaction-states.md` §4 closes with: *"Tokens `--error #B91C1C` /
`--error-subtle #FEE2E2` exist but are **not** used in the shipped states — keep to
brand red for error text unless Joy decides otherwise (flag)."*

But `design-guidelines.md` §1 (locked 2026-08-21, later) rules that **`#e8453c` may
never be a text fill on a light surface** — 3.93:1, below 4.5:1 — and that red text on
light is **`#be3530`**.

**Resolution: `#be3530`.** The contrast ruling is later, locked, and has a regulator
behind it. Error text in brand red on a white background is an accessibility failure
whatever the motion document says. Encoded as `COLOR-01`; the motion document's note is
superseded and should say so.

> These three are exactly the drift `CLAUDE.md` predicts when a decision lives in more
> than one place. `SPEC-DRIFT` (§6.3) is the mechanism that stops the next one.

---

## 3 · Tier 1 — the blocking register

`Check` values: **static** = text/AST scan, no build. **build** = needs `npm run build`.
**runtime** = needs a browser. **repo** = git or GitHub metadata. **manual** = a human.

### 3.1 Family `STRUCT` — structure and layering
Source: `FRONTEND-CONVENTIONS-RECONCILED.md` Part 3, Problems #7/#8/#10/#11.

| ID | Rule | Source | Check |
|---|---|---|---|
| `STRUCT-01` | No `features/index.ts` or `components/index.ts` root barrel — *"root barrels kill tree-shaking and create cycles"* | Problem #8 | static |
| `STRUCT-02` | No global `hooks/`, `utils/`, `services/` or `constants/` directory under `src/` | *What not to do* | static |
| `STRUCT-03` | Tests are colocated. No `__tests__/` directory anywhere | Part 3 · Structure | static |
| `STRUCT-04` | One `index.ts` per feature, exporting only the public surface | Problem #8 | static |
| `STRUCT-05` | `*Page` = route wrapper · `*Screen` = feature composition · `*Pane` = column. Registered as two checks, because the two directions fail differently: **`STRUCT-05a`** — no `*Screen` in `pages/`; **`STRUCT-05b`** — no `*Page` inside a feature | Problem #10 | static |
| `STRUCT-06` | Pages are route adapters, 5–20 lines | Problem #1 | static |
| `STRUCT-07` | No feature imports from `app/shell`; no page imports another page | Problem #6 | static |
| `STRUCT-08` | Fixtures never come from the API client — nothing outside `data/` imports `MOCK_*` from `mockClient` | Problem #5 | static |
| `STRUCT-09` | `@/` resolves to `src/`. No import ascending three or more levels (`../../../`) | Problem #8 | static |
| `STRUCT-10` | No Feature-Sliced Design layout (`entities/`, `widgets/`, `shared/lib/`) | *What not to do* | static |

### 3.2 Family `TRANSPORT` — the client seam
Source: `FRONTEND-CONVENTIONS-RECONCILED.md` Part 3 · Transport, and S1/S2.

| ID | Rule | Source | Check |
|---|---|---|---|
| `TRANSPORT-01` | **`EventSource` is forbidden.** *"a token in a query string is a token in every access log"* — SSE uses `fetch` + `Authorization` | Transport | static |
| `TRANSPORT-02` | No axios, and no second fetch wrapper. One seam: `CasprClient` | Transport | static |
| `TRANSPORT-03` | Every REST call uses `config.apiBase`, never `VITE_BACKEND_ORIGIN` concatenated with a path | S2 | static |
| `TRANSPORT-04` | `VITE_BACKEND_ORIGIN` stays a bare origin — no path segment in the env value or its default | S2 | static |
| `TRANSPORT-05` | `client.wallet.reserve` and `client.wallet.resolveReservation` **do not exist** on the seam — *"not deprecated, not left returning 501 — removed"* | S1 §1 | static |
| `TRANSPORT-06` | No hardcoded origin or `localhost` literal in `src/` (the existing `caspr/no-hardcoded-origin` rule) | build config | static |
| `TRANSPORT-07` | Transport refreshes **once** on 401; a second 401 is a dead session, not a loop | Transport | static + manual |
| `TRANSPORT-08` | `output_ready` URLs are resolved against the MCP origin, and `javascript:` / `data:` are refused | Streams | static |
| `TRANSPORT-09` | WebSocket close `4401` is not retried; other closes back off, 6 attempts, 15s cap | Streams | static |
| `TRANSPORT-10` | Nothing from the ez-caspr legacy catalog is present — no `/chat-stream?token=`, no `/wallet/tiers`, no Razorpay or PayPal, **no browser-side AWS keys** | Legacy | static |

### 3.3 Family `SEAM` — a cast is not a conversion
Source: `TEST-SESSION-PROMPT-2026-08-25.md` §8 and §3; `TEST-HANDOVER-2026-08-25.md` §7.

This family exists because six live screens showed invented data while every test
passed. It is the highest-value family in the register.

| ID | Rule | Source | Check |
|---|---|---|---|
| `SEAM-01` | **A cast is not a conversion.** No `res.json() as T` / `as Promise<T>` on a response body. A mapping function, or a lie that compiles | §8.1 | static |
| `SEAM-02` | A cast is permitted **exactly where the type is written in the wire's own casing.** A camelCase interface cast from a snake_case body is a defect | Handover §7 | static |
| `SEAM-03` | **A fixture is never a prop default.** Reachable only when a caller explicitly asks for it | §8.2 | static |
| `SEAM-04` | **Empty is empty, unknown is unknown.** No `?? 0` on a money field — *"`$0.00` on a wallet that failed to load is a confident wrong answer"* | §8.3 | static |
| `SEAM-05` | Every client method has a mounted route; every route has a caller | §3, §5.1 | static (cross-repo) |
| `SEAM-06` | No collection call relies on a server default page size — `limit` is explicit where the server defaults to 20 | Handover §2 | static |
| `SEAM-07` | Frontend contract types match the backend OpenAPI schema field-for-field, including casing | §3 | build (cross-repo) |

> `SEAM-07` is the one that would have caught `$NaN` mechanically rather than by
> someone noticing. See [`CONFORMANCE-CI-ARCHITECTURE.md`](CONFORMANCE-CI-ARCHITECTURE.md) §4.

### 3.4 Family `COLOR` — palette and contrast
Source: `design-guidelines.md` §1.

| ID | Rule | Source | Check |
|---|---|---|---|
| `COLOR-01` | **`#9c9b98`, `#8a8a85`, `#8b8a96` and `#e8453c` may never be a text fill on a light surface.** Valid as hairline, stroke, divider, dot and area fill | §1 Text contrast, rule 1 — *"This is lintable"* | static |
| `COLOR-02` | Red text on light is **`#be3530`** (5.61:1) | §1 | static |
| `COLOR-03` | **`brand/black` `#0a0a0a` is website chrome only. Never app text.** App text black is `#1a1a17` | §1, Joy 2026-08-21 | static |
| `COLOR-04` | The quiet text ramp is **three levels**: `#1a1a17` → `#5c5b58` → `#75746f`. No fourth quiet grey as text | §1 rule 2 | static |
| `COLOR-05` | **Opaque accent only.** No tint, no pale fill, no `rgba()` or opacity-modified accent as a surface | §1 | static |
| `COLOR-06` | No hand-typed hex outside the token definition file — colour resolves through a token | §1 grey ramp | static |
| `COLOR-07` | Every text colour reaches **4.5:1** against its background | §1 | runtime (axe) |

### 3.5 Family `RADIUS` / `SPACE` / `TYPE` — the scales
Source: `design-guidelines.md` §2, §9, §3, §11.0b.

| ID | Rule | Source | Check |
|---|---|---|---|
| `RADIUS-01` | Radius is **0 · 2 · 12 · 20** only. Pills, progress bars, pager dots and glyphs are fully-rounded and out of scope | §2 | static |
| `RADIUS-02` | **12px is overlay surfaces only** — modals, confirmation cards, popovers. Content and layout cards are 2 | §2 B2 ruling | static |
| `RADIUS-03` | Controls inside a 12px overlay stay at 2 | §2 | static |
| `SPACE-01` | Every gap and pad is **4 · 8 · 12 · 16 · 20 · 24 · 32 · 48 · 64**. Nothing else | §9 | static |
| `TYPE-01` | **Three fonts, no others** — Instrument Serif (display/brand), Inter (all UI), DM Mono (figures) | §3 | static |
| `TYPE-02` | Instrument Serif is **never** used for wayfinding or nav | §3 | static + manual |
| `TYPE-03` | Fluid type (`clamp()`) for display sizes only. **UI text stays fixed px** so the user's font setting is respected | §10b rule 2 | static |
| `TYPE-04` | Italic is exclusive to the product voice and a selection echo in a user bubble | §11.0b | manual |

### 3.6 Family `SHELL` — the responsive model
Source: `design-guidelines.md` §10b. **The CSS in §10b is authoritative over any Figma frame.**

| ID | Rule | Source | Check |
|---|---|---|---|
| `SHELL-01` | The flex declaration is exact: rail `0 0 64px` · pane `0 0 390px` · buffer `1 1 0` · centre `0 1 800px; min-width:560px` | §10b | static |
| `SHELL-02` | **One structural breakpoint, ~1180.** No second viewport breakpoint, no separate tablet layout | §10b | static |
| `SHELL-03` | **Container queries on components, not viewport queries.** A component responds to its container | §10b rule 1 | static |
| `SHELL-04` | Bottom nav is persistent and **top-most in z-order**; drawers rise to the nav's top edge (788), never the frame bottom (844) | §10 | static + runtime |
| `SHELL-05` | Layout is flow/grid first. `position: absolute` only for true overlays | Proposal §9 *(see note)* | static |

> **`SHELL-05` note.** The layout rule is stated in `ENGINEERING-STANDARDS-PROPOSAL.md`
> §9, which is Tier 2 — but `DESIGN-INPUTS-RESPONSE.md` (locked) treats absolute
> positioning as the root defect behind both the responsiveness and accessibility
> failures, and §10b's whole model presumes flow. **Placed in Tier 1 on that basis, and
> flagged here as the one Tier 1 rule whose promotion is my judgement rather than an
> explicit lock.** If Joy disagrees, it moves to Tier 2 and nothing else changes.

### 3.7 Family `FOCUS` / `TARGET` / `KBD` — accessibility
Source: `focus-keyboard-spec.md`; `design-guidelines.md` §10a.

| ID | Rule | Source | Check |
|---|---|---|---|
| `FOCUS-01` | One indicator everywhere: **1.5px ring, 2px offset, radius = element radius + 2** (see §2.1) | §1 | static |
| `FOCUS-02` | **`:focus-visible`, never bare `:focus`** for the ring. Mouse users see nothing | §1 rule 2 | static |
| `FOCUS-03` | **Never `outline: none` without a replacement ring in the same rule** | §1 rule 1 | static |
| `FOCUS-04` | The 2px offset is never collapsed to zero — it is what keeps the ring legal on an accent-filled control | §1 | static |
| `FOCUS-05` | The ring is never clipped by an ancestor `overflow: hidden` (WCAG 2.4.11) | §1 rule 3 | runtime |
| `FOCUS-06` | A visually-hidden **"Skip to content"** is the first tabbable element, targeting the centre column | §3.6 | static |
| `TARGET-01` | Interactive targets are **≥24×24** (WCAG 2.5.8 AA). Decorative dots and citation dots inline in a sentence are exempt | §2 | runtime |
| `KBD-01` | Focus returns to the trigger when a drawer, dialog or menu closes — *"the most common keyboard regression"* | §3.1 | runtime |
| `KBD-02` | Confirms open focus on the **safe** control, never the destructive one | §3.4 | runtime |
| `KBD-03` | Drawer `Esc` steps **down one detent**, never straight to dismissed | §3.1 | runtime |
| `KBD-04` | Pane switcher is **manual activation** — arrowing must not fire Ask/Versions loads | §3.2 | runtime |
| `KBD-05` | Icon-only controls carry an `aria-label` | motion §5 | static |
| `A11Y-01` | Interactive elements are `<button>`/`<a>`, not `onClick` on a `div` or `span` | proposal §4 evidence *(see note)* | static |
| `A11Y-02` | Documents have heading structure — `<h1>`–`<h6>`, not styled `<span>`s | proposal §4 evidence *(see note)* | static |

> **`A11Y-01` / `A11Y-02` note.** Both are measured in `ENGINEERING-STANDARDS-PROPOSAL.md`
> §4 (16 headings across 151 files; 218 `onClick` vs 202 `<button>`) — a Tier 2 document.
> They are Tier 1 here because **WCAG 2.2 AA is the referenced standard in
> `design-guidelines.md` §1 (locked)**, and both are AA failures under it. The
> *standard* is locked even though the document that counted the violations is not.

### 3.8 Family `MOTION`
Source: `motion-and-interaction-states.md`.

| ID | Rule | Source | Check |
|---|---|---|---|
| `MOTION-01` | **`prefers-reduced-motion: reduce` is mandatory** — every motion has a reduced alternative. *"No exceptions"* | §1 | static |
| `MOTION-02` | Duration comes from a token — `instant/fast/base/settle/signature`. No raw ms literal in a transition | §2 | static |
| `MOTION-03` | **No `box-shadow`** except the bottom drawer, modal cards and a dragged row. Hover uses border, background or 1–2% scale | §1 | static |
| `MOTION-04` | Keyboard-initiated changes are **never** animated | §1 frequency gate | static |
| `MOTION-05` | Frequent interactions (tag flip, tab switch, scroll) are instant — no tween | §6 | manual |

### 3.9 Family `COPY`
Source: `copy-standards.md`; `brand-guidelines.md`.

Scoped to **user-facing strings only** — JSX text, and string literals in
`*.copy.ts` / `content` modules. Never to identifiers, API fields, comments or tests.

| ID | Rule | Source | Check |
|---|---|---|---|
| `COPY-01` | **No exclamation points. Ever** | §1 | static |
| `COPY-02` | Banned vocabulary: *platform · leverage(s) · algorithms · workflows · powerful AI · robust · seamless · revolutionary · game-changing · chatbot · web scraping · hallucinate · "excited to announce" · "Here's how:"* | §1 | static |
| `COPY-03` | **"budget"**, never "plan", in user-facing copy. *(Scoping matters — `plan` is a legitimate API field since `8f18fce`, and the check must not fire on it)* | §2 | static |
| `COPY-04` | **"Top up"** verb · **"top-up"** noun. Never mixed | §2 | static |
| `COPY-05` | Exact balances carry two decimals (`$186.00`); marketing figures carry none (`$80`) | §2 | static |
| `COPY-06` | **Sentence case** for UI labels and buttons, except proper nouns | §2 | static |
| `COPY-07a` | Capitalised as proper nouns: **Data Room · Research Budget · Brief · Study · Intelligence**. File states: **Included / Excluded / Public / Private** | §2 | static |
| `COPY-07b` | **⛔ A depth name never appears without its deliverable type.** `Brief`/`Study`/`Intelligence` is the **Market Research** ladder only. Use **"the $300 depth"** for the rung across all types | §2 · `document-taxonomy` §A.3 | static |
| `COPY-08` | Errors carry reason **and** reassurance. Red text only — no tint fills, no stripes | §2 | manual |
| `COPY-09` | Depths, file states and wallet terms are **never** Lingo-aliased. Only Type/Sub-type labels resolve at runtime | §3 | static |
| `COPY-10` | Caspr's dialogue is engine output — frames hold samples. **Never hardcode Caspr dialogue copy** | design-guidelines §11.0b | static |
| `COPY-11a` | **The Research Budget is never framed as a subscription price.** Fails on `/mo`, `per month`, `monthly` or `starting at` within ~30 chars of a budget figure ($200 / $600 / $1,800) | `CLAUDE.md` · `pricing-model` §3.1 | static |
| `COPY-11b` | **⚠ *"only charged for what you run"* and equivalents are FALSE and must fail.** `R = F + top_up` — **the platform fee is charged every month regardless of use** ($14 at a $200 budget, even at zero consumption). Fails on `only.*charged.*(you )?(run\|use)`, `never charged unless`, `pay only for what`. **Permitted:** *unused balance carries forward* · *restores only what you consumed* · *a quiet month costs less* | `pricing-model` §3.1–3.2 | static |

#### Implementing `COPY-07b` — the depth-qualification check

**Why this is a lint rule and not a style note.** *"Brief · Study · Intelligence"* stated as a universal ladder
is the single most-repeated error in this project. It has reached `CLAUDE.md`, `site-truth`, the website
copy, the Figma file and the content library — each time as a caveat sitting downstream of the framing, and
each time the caveat lost. **A sentence people are asked to remember does not survive; a failing check does.**

**The check, over user-facing copy strings only:**

1. **Fail** any string containing two or more of `Brief` · `Study` · `Intelligence` in a list *(separated by
   `·`, `/`, `,` or `and`)* **unless** `Market Research` appears in the same string or the enclosing block.
   This is the canonical failing shape.
2. **Fail** any single depth name adjacent to a price *(within ~40 chars of `$15`, `$80`, `$300`, `$8`, `$40`)*
   with no deliverable type named in the same block.
3. **Pass** `the $15 depth` · `the $80 depth` · `the $300 depth` — the type-neutral form, which is the
   replacement to steer authors toward.

**Allow-list, because these are correct and must not fire:** `Screen`/`Thesis`/`Diligence` beside
`Investment & Deal` · `Brief`/`Study` beside `Academic` *(with `$8`/`$40`)* · any depth name inside a table
row whose first cell names a deliverable type · `analysis-taxonomy` and API-field contexts, which
`COPY-03`'s scoping precedent already excludes.

**Also required, and not a string check:** wherever a ladder is rendered, its **availability exceptions**
travel with it — *Market Sizing has no $15 · Executive Profile has no $300 · pitch decks have no $300 ·
Strategic Options has no $15.* Flag as `manual` until the ladder component carries them as data.

### 3.10 Family `AIACT` — EU AI Act Article 50
Source: `ai-disclosure-spec.md`. **In force since 2 August 2026.**

| ID | Rule | Source | Check |
|---|---|---|---|
| `AIACT-01` | Every onboarding footer carries `Security · Privacy · Terms · AI disclosure · © 2026 Caspr`, and the AI-disclosure link resolves | §1 | static + runtime |
| `AIACT-02` | Exported PDFs carry XMP: `xmp:CreatorTool`, `dc:creator`, `dc:date`, `caspr:aiGenerated`, `caspr:generatedAt`, `caspr:analysisType`, `caspr:depth`, `caspr:sourceCount` | §2.2 | build |
| `AIACT-03` | Exported PPTX carries OOXML core properties plus the `caspr:*` custom part | §2.2 | build |
| `AIACT-04` | The mark **survives editing** and is **re-stamped on regeneration** | §2.3 | build |
| `AIACT-05` | The mark is **not conditional on tier** — free-trial output carries it identically | §2.3 | build |
| `AIACT-06` | **Uploaded source documents are never marked.** Only the deliverable | §2.3 | build |

> **`AIACT-02`–`06` are the compliance obligation with a regulator attached, and they
> are the register's largest blind spot.** They live in the export pipeline, which is
> item 13 on the design session's handover list and marked **"yours"** to dev. If the
> pipeline is not built, these are not failures — they are unimplemented. The check
> must report *absent* distinctly from *wrong*, and §7.2 covers this.

### 3.11 Family `SECRET`
Source: `CLAUDE.md` team-repository rule; `FRONTEND-CONVENTIONS-RECONCILED.md` Part 4.

| ID | Rule | Source | Check |
|---|---|---|---|
| `SECRET-01` | **No server secret in the frontend repo.** Only `VITE_*`, which are public the moment the app builds | `CLAUDE.md` — *"the reason the split earns its cost"* | static |
| `SECRET-02` | No `.env` committed in either repo | `CLAUDE.md` | repo |
| `SECRET-03` | No AWS key, RDS password, SES credential or Stripe secret in tracked files | Part 4 | static |
| `SECRET-04` | **No document files in either repo** beyond `README.md` / `README-DEV.md` — *"two live copies of a document is not redundancy, it is a fork"* | `CLAUDE.md` | repo |
| `SECRET-05` | The retired `Caspr-Joy/Caspr-app` remote appears in no config | `CLAUDE.md` | repo |

### 3.12 Family `CRED` — credential exposure
Source: [`ai-credential-exposure-rules.md`](../../ai-credential-exposure-rules.md) — Jayant, 2026-08-25.
58 rules, 41 `[P0]`, **binding**. Scope extended to this Drive folder by Joy, 2026-08-25.

**Why Drive is in scope when the standard says "repository working tree".** This folder
is the root of *every* session — including sessions with no code access — and unlike a
repo it is replicated to Google's cloud continuously. `Ahrefs_Key.txt` sat at its root
in plaintext precisely because the standard, read literally, did not reach here.

| ID | Rule | Jayant's rule | Check |
|---|---|---|---|
| `CRED-01` | No credential file in any agent-readable tree | `R-CTX-1` [P0] | static |
| `CRED-02` | Ignore rules carry every required exclusion | `R-CTX-2` [P0] · `R-VER-1` | static |
| `CRED-03` | No plaintext credential in agent or MCP config | `R-VER-2` [P0] | static |
| `CRED-04` | No bidi or zero-width characters in agent config | `R-CTX-7` [P0] · `R-VER-1` | static |
| `CRED-05` | No mixed-script confusable token in agent config | `R-CTX-7` [P0] · `R-VER-1` | static |
| `CRED-06` | MCP config holds no plaintext long-lived token | `R-CTX-8` [P0] | static |
| `CRED-07` | Placeholders use `CASPR_DUMMY_<TYPE>_<DESCRIPTOR>` | `R-SHR-2` [P0] | static |
| `CRED-08` | No `$HOME`, parent or Docker-socket mount in a runner | `R-CTX-11` [P0] | static |
| `CRED-09` | Secret scanning runs in CI and blocks | `R-RSP-1` [P0] | static |
| `CRED-10` | No hardcoded credential in source | `R-SHR-8` · `R-CLS-2` [P0] | static |
| `CRED-11` | Harness launched with `env -i` and an explicit passlist | `R-CTX-5` [P0] | **manual** |
| `CRED-12` | Agent credentials are short-lived and task-scoped | `R-AGT-2` · `R-VER-3` [P0] | manual |
| `CRED-13` | Only approved providers receive Caspr content | `R-VND-1` [P0] | manual |
| `CRED-14` | Every secret definition records its tier | `R-CLS-6` · `R-VER-4` | manual |
| `CRED-15` | No file whose entire content is a single opaque token | `R-CTX-1` [P0] · `R-CLS-2` | static |

**Three of these deserve their reasoning recorded.**

**`CRED-05` needs its own detector, and the standard says why.** Confusables are ordinary
printable characters — a Cyrillic `а` inside an otherwise-Latin identifier renders
identically to Latin `a`, and **no zero-width or non-printing filter will ever flag it**.
`CRED-04` and `CRED-05` fail differently and neither catches the other. Detection is
per *token*, not per line: a document may legitimately discuss Greek and Latin in one
sentence; the attack is one word drawing on two scripts.

**`CRED-15` exists because `CRED-01` missed the finding that prompted all of this.**
`Ahrefs_Key.txt` is 40 bytes at this folder's root. Its name does not match `*.key`,
`*.pem` or `.env`, so the path rule missed it. Its content carries no recognisable
prefix like `sk-` or `AKIA`, so the shape rule missed it. What it *is* — a tiny file
holding one structureless token and nothing else — turned out to be the only reliable
signal, and it is close to unambiguous: prose has spaces, config has separators, code
has syntax. The rule reports the **path and byte count, never the content** (`R-CLS-4`).

> **A second defect surfaced fixing this, and it was worse.** The runner's file walker
> filtered by extension, and **`.txt` was not on the list** — so `Ahrefs_Key.txt` was
> never visited by *any* rule in the register. Adding `.txt` and the other
> credential-bearing formats took the walked-file count on this folder from **449 to
> 594**. 145 files had been invisible to every check, and every one of them reported
> PASS. This is the `UNCHECKED`-is-not-`PASS` principle failing one level lower down
> than the verdict system can see: a rule cannot report that it did not look at a file
> it was never offered.

**`CRED-11` is unverifiable from inside the agent, by construction.** `R-CTX-5` requires
the harness to be launched with `env -i` and an explicit passlist. Checking would mean
running `printenv` — which `R-CTX-3` forbids returning to context. **The rule makes
itself uncheckable by the thing it constrains**, which is not a flaw: it means
verification belongs to external infrastructure review, and the register says so rather
than pretending otherwise.

---

## 4 · Tier 2 — the advisory register

Measured every run, reported every run, **fails nothing**. Promotion to Tier 1 needs
one answer from Joy per row.

| ID | Measure | Proposal target | Source |
|---|---|---|---|
| `ADV-SEC-01` | ASVS 5.0.0 Level 2 coverage | L2, ~350 requirements | §1 |
| `ADV-SEC-02` | Security headers present | CSP w/ per-request nonce + `strict-dynamic`, `nosniff`, HSTS, `frame-ancestors`, Referrer-Policy, Permissions-Policy — *"We currently ship none of these"* | §1 |
| `ADV-SEC-03` | PCI SAQ A script inventory on payment pages | Every script inventoried, justified, integrity-verified (6.4.3) + tamper detection (11.6.1) | §5 |
| `ADV-PERF-01` | Initial JS, compressed | **< 200 KB** — last measured **206.76 KB** | §6 |
| `ADV-PERF-02` | LCP p75 | < 2.5 s | §6 |
| `ADV-PERF-03` | INP p75 | < 200 ms | §6 |
| `ADV-PERF-04` | CLS p75 | < 0.1 | §6 |
| `ADV-QUAL-01` | ESLint rule count | typescript-eslint **strict** + jsx-a11y + react-hooks — was **3 rules total** | §9 |
| `ADV-QUAL-02` | Prettier + `.editorconfig` | present — was none | §9 |
| `ADV-QUAL-03` | `noUncheckedIndexedAccess` | on — was partial | §9 |
| `ADV-QUAL-04` | Largest file | ~300 lines — was **813** | §9 |
| `ADV-QUAL-05` | ADRs | present — was none | §9 |
| `ADV-QUAL-06` | Conventional Commits | adopted — was prose | §9 |
| `ADV-SUPPLY-01` | CycloneDX SBOM at build time | signed, attached to the artifact | §8 |
| `ADV-SUPPLY-02` | SLSA provenance | Build L2 → L3 | §8 |
| `ADV-TEST-01` | Playwright width matrix | 360 / 768 / 1024 / 1280 / 1440 / 1920 | §9 |
| `ADV-TEST-02` | axe in CI | present | §9 |
| `ADV-TEST-03` | Lighthouse CI | present, budgeted | §9 |
| `ADV-TEST-04` | Visual regression | present | §9 |
| `ADV-AI-01` | OWASP LLM Top 10 2025 + Agentic 2026 mapping | documented | §2 |

**One Tier 2 row deserves separate attention: `ADV-QUAL-04`.** The proposal's own
§9 footnote admits the thresholds there are *"proposals, not citations"*. A 300-line
budget is a defensible convention but an arbitrary number, and enforcing it would
churn files for no measured benefit. Recommend measuring the distribution and setting
a ratchet — *may shrink, may never grow* — which is the mechanism already in use for
the white-on-accent contrast list.

---

## 5 · The width and zoom matrix

From `design-guidelines.md` §10b, verbatim, because a partial matrix is worse than none:

**Widths:** 320 · 390 · 768 · 834 · 1024 · 1180 · 1280 · 1440 · 1512 · 1920
**Zoom:** 100 / 125 / 150 % at each
**Plus:** foldable folded and unfolded

Three of these widths are load-bearing rather than routine, and a run that skips them
is not a run:

| Width | Why |
|---|---|
| **1254** | Where the buffers reach 0. The centre begins to shrink here and nowhere earlier |
| **1180** | The single structural breakpoint. Three columns become one column plus drawer |
| **560** | The centre's floor. Below it the layout is out of specification |

Note the proposal's matrix (§9: 360/768/1024/1280/1440/1920) **is not the same list**
and omits 1180 and 1254 — the two widths where this specific layout actually changes.
`design-guidelines.md` §10b is the one to build to.

---

## 6 · Verdict semantics

### 6.1 Four outcomes, not two

| Outcome | Meaning |
|---|---|
| **PASS** | Checked, conformant |
| **FAIL** | Checked, violated. Tier 1 fails the build |
| **ABSENT** | The surface does not exist yet. **Not a failure** — an unbuilt export pipeline cannot violate `AIACT-02` |
| **UNCHECKED** | The check could not run. **Always reported, never silent** |

**`ABSENT` and `UNCHECKED` exist because of a specific failure recorded in
`TEST-HANDOVER-2026-08-25.md` §0c:** two of the most valuable tests in the repo failed
at *import*, which read as a build error rather than as lost coverage, and stayed lost.
A conformance run that cannot distinguish "clean" from "did not run" reproduces that
bug at the level of the whole suite.

### 6.2 Suppression

A rule may be suppressed inline, and only with a reason and an owner:

```ts
// conformance-ignore COLOR-01 -- dark card; #e8453c passes on #0b0b09. joy 2026-08-25
```

A bare ignore is itself a failure. Suppressions are counted and listed in every report,
so the total is visible and can be ratcheted downward.

### 6.3 `SPEC-DRIFT` — the anti-fork check

**The problem.** `CLAUDE.md` forbids a document living in two places, because the
copies drift — `THEATER-SOURCE-DECODE-MOTION.md` is the recorded precedent. But CI runs
on GitHub and cannot read Google Drive, so the rules must exist in the repo somehow.

**The resolution, and it turns on a distinction `CLAUDE.md` already draws.** The rule
says *"code is source, tests, **config**, build files, and migration SQL."*
`rules.json` **is config** — it is what a linter reads, in the same class as
`eslint.config.js`. It belongs in the repo. This prose document — the *why*, the
sources, the reasoning — stays on Drive and is never copied.

So there is exactly one duplicated artefact: the **list of rule IDs**. `SPEC-DRIFT`
reconciles it:

- Every ID in `rules.json` appears in §3 or §4 of this document, and every ID here
  appears in `rules.json`
- The `specVersion` in `rules.json` matches this document's version header
- **It runs from the Drive side** — this session, or a scheduled one with access to
  both — because only that side can see both halves

Nothing else crosses. The reasoning never enters the repo, and the machine-readable
list is never hand-authored twice.

---

## 7 · Gaps — what this register cannot tell you

Stated plainly, because a conformance report that implies full coverage is worse than
one that admits its edges.

### 7.1 No rule exists, and one probably should

Found while reading, with nothing to cite behind it. **These are questions for Joy, not
rules I have adopted:**

1. **Backend conventions are almost entirely unwritten.** `ruff` and `mypy --strict`
   are named in the test brief; beyond that there is no equivalent of
   `FRONTEND-CONVENTIONS-RECONCILED.md` for the Python service. Router layout, schema
   naming, service/repository boundaries, error-shape conventions, migration rules —
   none of it is decided in writing. The backend is where the money lives.
2. **Test coverage floors are per-repo, not per-module.** 80% overall passes while
   `wallet/service.py` sits at 51% and `profile/service.py` at 66% — *"the two newest
   modules, handling money and personalisation."* A per-module floor would have caught
   that; nothing currently does.
3. **No convention governs the `pending` / disabled coming-soon state**, which has now
   produced two separate bugs (a live-looking toggle, then a `danger` row ignoring
   `pending`). The pattern is settled in practice and unwritten.
4. **No accessibility acceptance criterion for a new screen.** WCAG 2.2 AA is named as
   the target; nothing says what a developer must run before opening a PR.

### 7.2 Cannot be checked statically, and needs a running stack

`FOCUS-05` · `TARGET-01` · `KBD-01`–`04` · `COLOR-07` · `AIACT-02`–`06` · every `ADV-PERF-*`.

Two of those groups matter more than the rest:

- **The keyboard family is entirely runtime.** `KBD-01` — focus returning to the
  trigger — is called out in the source as *"the most common keyboard regression"*, and
  no static check can see it. It needs Playwright.
- **The AI Act family needs a generated file to inspect.** Until the export pipeline
  exists, `AIACT-02`–`06` report `ABSENT`, and `ABSENT` on a live legal obligation is a
  standing item for Joy rather than a clean result.

### 7.3 The jsdom problem, restated

`ENGINEERING-STANDARDS-PROPOSAL.md` §9: the existing suite runs in **jsdom, which has no
layout engine** — `getBoundingClientRect` returns zeros. **No layout, target-size,
overlap or focus-clipping rule in this register can be verified by the existing 829
tests.** `SHELL-*`, `TARGET-01` and `FOCUS-05` need a real browser or they are not
being checked, whatever a green suite says.

### 7.4 This register has not yet been run

Authored from the specifications, against a codebase this session **cannot read** —
`gh` is not installed and both repos are private. Every rule is therefore
**unvalidated against real source**. The first run will produce false positives; the
calibration pass is expected and is part of the work, not a defect in it.

---

## 8 · Provenance

Every rule above traces to a document in this folder or `docs/product/`. Sources read
in full for this register:

`FRONTEND-CONVENTIONS-RECONCILED.md` · `ENGINEERING-STANDARDS-PROPOSAL.md` ·
`TEST-SESSION-PROMPT-2026-08-25.md` · `TEST-HANDOVER-2026-08-25.md` ·
`DESIGN-INPUTS-RESPONSE.md` · `../product/design-guidelines.md` ·
`../product/focus-keyboard-spec.md` · `../product/ai-disclosure-spec.md` ·
`../product/copy-standards.md` · `../product/motion-and-interaction-states.md` ·
`../../.agents/security-posture.md` · `../../CLAUDE.md`

Read in part, for cross-checking: `BUILD-STATUS-2026-08-25.md` ·
`BUILD-STATUS-2026-08-24.md` · `PIXEL-AUDIT-PROTOCOL.md`.

**Not read, and possibly relevant:** `../product/api-spec-v2.md` (641 lines) and
`../product/architecture-alignment-final.md` (684 lines). Both are large and describe
the contract rather than the conventions; they are the first place to look when
calibrating `SEAM-05` and `SEAM-07`, which are the two rules most likely to need them.

---

*Conformance session · 2026-08-25. Companion:
[`CONFORMANCE-CI-ARCHITECTURE.md`](CONFORMANCE-CI-ARCHITECTURE.md) — how this runs on
every push. Machine register: [`conformance/rules.json`](conformance/rules.json).*
