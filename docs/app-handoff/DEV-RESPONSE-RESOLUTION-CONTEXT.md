# Response — resolution keys, and where user context actually lives

**Answering:** Joy, 2026-08-21 — *"other than report creation you would need to consider similar approaches to Caspr replies and Ask Caspr… maybe tag the information to a specific conversation when it starts… but a user may come back after several weeks… also this does not specify anything about customization per user from the saved memories. How is all this being handled between you and the Caspr API?"*

**Against:** [`DEV-PROMPT-RESOLUTION-KEYS.md`](DEV-PROMPT-RESOLUTION-KEYS.md) · [`00-resolution-map.md`](../report-guidance/00-resolution-map.md) · `api-spec-v2.md` · and the running code.

**Short answer to the last question: none of it is being handled.** Not partially — not at all. Verified below.

---

## 1 · What is actually true today

The prompt warned that it was written from specs and might overstate the gap. It **understates** it. Every line here is from the code, not the docs.

| Claim in the prompt | What the code does |
|---|---|
| `icp` *"present but untyped"* | Present and **always empty**. `client_knowledge: {}` is hardcoded at both call sites — [`realClient.ts:244`](../../../Claude-Local/caspr-app/apps/web/src/data/realClient.ts) and `AnalysisSession.tsx:167`. Not free-form and populated. Literally `{}` |
| `users.icp_category` may not be written at onboarding | The column exists (`auth/models.py:38`) and **nothing anywhere writes it** |
| — | ICP *is* derived, at `firstRunContent.ts:60` — **from the landing-page URL path**. It reorders first-run cards, then is discarded on navigation. It never reaches the account or the wire |
| — | **Ask Caspr sends nothing about the user.** `realClient.ts:271` puts `analysis_id`, `question`, `section_id`, `anchor_id`, `version_id` on the query string. That is the entire payload |
| — | **Memories are in `localStorage`** (`profileStore.ts:19`). Browser-local. Lost on a device change, invisible to the server, never on any wire |

So the honest state is: **the app knows who the user is for about ninety seconds on their first visit, uses it to sort five cards, and throws it away.**

The file that stores memories already says what should happen — `profileStore.ts:9`: *"localStorage is the placeholder… the Research Profile is server-side data… this moves behind the API the moment there is one to move it to."* **There is one now.** That comment is a commitment I can now honour.

---

## 2 · Why the prompt is not comprehensive — you are right, and here is the shape of what it misses

The prompt is scoped to `trigger_generation`. Caspr speaks to the user on **three** surfaces, and they are not equally served:

| Surface | Carries today | Should carry |
|---|---|---|
| `propose_layout` + the pre-gate conversation — *Caspr's replies, the clarifying questions, the "I can take this several ways" beat* | `client_knowledge: {}` | person context — this is where register is set for the whole conversation |
| `trigger_generation` — *the report* | `client_knowledge: {}` | everything: the prompt's five keys, frozen |
| `ask_caspr` — *post-report Q&A, possibly weeks later* | **nothing** | person context, plus the frozen report context |

The middle one is the only one the prompt addresses. The first is where the user forms their impression of whether Caspr understands them — before they have paid anything.

---

## 3 · The answer to "tag at conversation start, or resolve fresh?" — both, and the split line already exists

Your instinct to bind context at the start is right, and the flaw you spotted is real: a user returning in six weeks would get a stale picture of themselves.

**The tension dissolves once you notice these are two different kinds of thing.** And the resolution map already separates them — it just does not say so out loud:

> | Key | Source (from `00-resolution-map.md`) |
> |---|---|
> | `deliverable_type`, `sub_type` | Prompt detection + **user confirm** |
> | `tier`, `format`, `language` | **the Gate** |
> | `icp` | **User account attribute** — *"never asked per report"* |

Read that column and the rule writes itself:

> **Keys that come from the analysis freeze at the gate. Keys that come from the account resolve on every call.**

In layer terms — **L2 is analysis-scoped and frozen. L3 is person-scoped and fresh. L1 render keys are frozen** (a re-export must produce the same document). **L0 has no keys at all.**

This is not a new rule. It is the existing layer stack read for lifetime instead of for content.

### Why the gate is the freeze point

It is already the line the whole product turns on: before it nothing is committed, after it the analysis is a paid artifact. It is where the wallet reserves, where the price is fixed, and where the tier stops being changeable. Making it the context freeze point adds no new concept.

### What this gives you for the six-weeks-later case

| | Frozen (replayed from the analysis) | Fresh (resolved now) |
|---|---|---|
| Ask Caspr, six weeks on | `deliverable_type`, `sub_type`, `tier`, `language`, `guidance_version`, `primary_data.method` | `icp`, memories, preferences |

**The report does not change. The way Caspr talks to you does.** Ask quotes figures from a document written under last month's rules, so it must stay consistent with that document — but it is a *conversation*, and it should be held with the person as they are known today. The frozen half keeps the answer honest about the report; the fresh half keeps it addressed to a person.

That also gives a clean answer to a question nobody has asked yet: **what happens when guidance is versioned up mid-life of an analysis?** Nothing. The report replays `guidance_version: 1.0.0` forever. The map already requires this stamp for reproducibility; freezing it is what makes the stamp mean something.

---

## 4 · Two objects, one envelope

Rather than five loose keys added to three different calls:

```jsonc
"context": {
  "analysis": {                     // FROZEN at gate. Stored by us. Replayed verbatim.
    "deliverable_type": "investment_deal",
    "sub_type": "company",
    "tier": "study",
    "language": "en-GB",
    "primary_data": { "method": "none" },
    "guidance_version": "1.0.0"
  },
  "user": {                         // RESOLVED per call, by us, from the account.
    "icp": "investors",             // one of the ten §10 keys, or null → §10.9
    "preferences": { }              // bounded, typed, user-visible. See §6.
  }
}
```

One envelope, three calls, additive. A service that ignores it entirely keeps working — which is the standard `API-CONTRACT-REVISION-2026-08-18.md` sets.

**`context.analysis` is absent before the gate** — by definition, nothing is confirmed yet. `propose_layout` and pre-gate replies carry `context.user` alone. That absence is meaningful and should not be faked with defaults.

---

## 5 · Who owns what — the division you asked about

The contract has one half of this written (`api-spec-v2.md` §1.8): *"Our backend sees identifiers, status and money, never research content."* **The mirror half has never been written: what may the AI service know about the person?** Today the answer is `sub` and nothing else, by accident rather than decision.

Proposed, and it follows from §1.8 rather than competing with it:

| | Owns | Never holds |
|---|---|---|
| **Us — app + proxy** | the **person**: account, ICP, memories, preferences, research profile. The system of record | research content |
| **Jayant — Caspr API** | the **analysis**: content, sections, reasoning, sources | the user store. It never queries us |

**We resolve; they receive.** The engine gets `icp: "investors"` — an answer — not a pile of memories to interpret. Resolution logic stays in one place, which is the map's own principle: *guidance constrains the outcome, never the method.*

**Where the context is assembled matters, and it splits cleanly along the proxy line I already built:**

- `trigger_generation` and `generate_output` **pass through our service**, so we stamp `context` server-side at commit. It cannot be forged, and the report's provenance is ours.
- `propose_layout` and `ask_caspr` **go direct**, so the browser attaches the `context.user` it was given at sign-in.

**A browser could lie about its own ICP on those two.** It does not matter, and it is worth being explicit about why: `context.user` is **preference data, not entitlement data.** Claiming to be an investor gets you a differently-registered answer about your own analysis on your own money. Everything that *is* an entitlement — tier, price, credits, formats — already travels the proxied path and is already server-decided. Re-proxying an SSE stream to defend a preference would buy nothing and cost exactly the complexity the split was drawn to avoid.

---

## 6 · Memories — and the one decision that is genuinely yours

Memories are user-authored statements about themselves, captured by the engagement carousel and listed on the account screen with an `✕` to forget (`account-wallet-screens.md` §2A). They are personal data.

**Sending them to the AI service widens the data flow across the §1.8 boundary in the direction that has never been specified.** That is a posture decision, not a technical one, so it is yours. My recommendation:

> **Raw memories stay ours. What crosses the wire is what they resolve to.**

Concretely — two tiers, and only the second travels:

| | Stays product-side | Crosses to the engine |
|---|---|---|
| Free-text memories — *"I mostly look at UK mid-market"*, *"I hate hedged language"* | ✅ the list the account screen shows, with `✕` | ❌ never sent raw |
| Resolved keys and bounded preferences — `icp`, output language, regions of interest, exclusions | | ✅ typed fields, user-visible, individually removable |

Three reasons this is the right line, in order of weight:

1. **A free-text dump is unreviewable.** Nobody can look at a payload and say whether it is appropriate. A typed allowlist can be read in five seconds and audited in a conformance test, the same way §1.7 already asserts the absence of model internals.
2. **`✕` has to mean something.** *"Forget every memory Caspr has about you"* is a promise on the Reset Research Profile confirm (`2195:2927`). If raw memories have been forwarded on every call for six months, we cannot keep it. Resolved keys we can — they are recomputed each call from data we still hold.
3. **It costs almost nothing.** L3 is **additive only** by the map's own rule — *"the output must be complete, correct and excellent with no ICP data at all."* Personalisation is enhancement, never dependency. So the conservative line degrades to exactly the state we are already shipping.

**The one thing I need from you: is that line right, or do you want raw memories going to the engine?** Everything else in this document I can build without an answer. This one changes the shape of what I store and what I send, so I would rather ask once than rebuild.

> **Answered by Joy, 2026-08-21 — and §6 above is overweighted. See §9.** She proposed composing the memories into a `user_persona`. Checking the memory bank rather than assuming changed the calculus: memories are **authored sentences from a bounded set**, not free user text, so the *"unreviewable dump"* argument in reason 1 largely falls away. Reason 2 — the `✕` promise — still stands and still decides the mechanism.

---

## 7 · What this changes about the prompt's items 1–3

Nothing is withdrawn. Two are sharpened:

**Item 1 (`icp` controlled key)** — the prompt asks me to check three things. Answers: the column is never written; the proxy has nothing to forward because the value is `{}`; and there is no stored display label to map, because there is no stored value.

There *is* a derived one, and it is a **guess from a URL**, which must not silently become a fact. So `icp` needs a companion: **`icp_source: 'inferred' | 'stated'`.** Path-derived writes `inferred`; the carousel or profile writes `stated` and wins. Without it, a user who landed on `/academic` while browsing is an academic forever, and nobody can tell that we made it up.

**Item 2 (`deliverable_type` / `sub_type`)** — unchanged and correct, and the freeze rule tells us exactly where it lives: captured at intent-confirmation on the draft, persisted across a tier change, frozen into `context.analysis` at the gate. I now have the table to hold it — the `library_documents` row already carries `type`, and the pre-gate conversation already persists to `conversation_turns`.

**Item 3 (`primary_data.method`)** — unchanged, and it belongs in `context.analysis` (frozen), never in `context.user`. It is a property of how the analysis was run. This remains the only item that can produce a materially wrong claim to a user.

---

## 8 · What I will build, and what I will not

**Mine, unblocked, starting now:**

1. **Memories move server-side** — table, endpoints, and `profileStore` swapped behind the API. Its own comment already commits to this and the API now exists. Independent of every decision above.
2. **`icp_category` + `icp_source` written** — at signup from the entry path as `inferred`, overwritten as `stated` by the carousel.
3. **`client_knowledge: {}` replaced** with a real resolved `context.user` at both call sites.
4. **`deliverable_type` / `sub_type` captured** at intent-confirmation and carried to the gate.
5. **`context.analysis` frozen and stamped server-side** at commit, in the proxy, including `guidance_version`.

**Needs Jayant** — the engine must accept the envelope, and `ask_caspr` must accept a body at all (it is a GET with query params today; a context object does not belong on a query string, so this is a shape change, not a field addition).

**Needs you** — §6's line on raw memories. And item 4 of the original prompt (`gate.style` → `caspr_default`) is already ruled; I am carrying it as ruled, not re-opening it.

**On `api-spec-v3.md`:** the prompt asks for it. I will write it, but it should carry the envelope in §4's shape rather than five loose fields bolted to one call — otherwise v4 has to undo it the first time Ask needs context. That is the substantive change this response makes to the deliverable.

---

## 9 · `user_persona` — feasible, and cheaper than it looks

**Joy, 2026-08-21:** *"wouldn't it be cool if we talk to the user in language customized to them… summarize the memories into a `user_persona` and pass to Caspr every time a new report is generated or when the user returns after new memories have been created. Is that feasible, and what is the cost implication?"*

**Yes. And the cost is close to zero — for a reason that is not obvious until you look at the memory bank.**

### 9.1 · No summarization is needed, because memories are not free text

I assumed in §6 that memories were user-written. They are not. **Every memory is a pre-authored sentence attached to a bounded option.** From `features/engagement/content.ts`:

```ts
key: 'audience',
question: 'Who reads this one — you, or a committee?',
options: [
  { id: 'self',      label: 'Me',          memory: 'Reads analyses personally' },
  { id: 'team',      label: 'My team',     memory: 'Shares analyses with a team' },
  { id: 'committee', label: 'A committee', memory: 'Output goes to investment committees' },
]
```

**27 authored strings across the whole system** — 22 in the question bank, 5 templated from usage in `dynamic.ts` (*"Focuses on logistics"*, *"Prefers Study-depth analyses"*). There is no path by which a user types a memory.

So the persona is not a summary. It is a **projection of `(key → authored sentence)` into a paragraph** — a `SELECT`, an ordering, and a join. That changes four things at once:

| | Consequence |
|---|---|
| **Cost** | **No model call. No tokens. No inference budget.** Not "cheap" — free |
| **Determinism** | The same memories always compose the same persona. A model summary drifts between calls, and two reports run a minute apart would be personalised differently for no reason |
| **Explainability** | Every clause traces to a question the user answered and can point at. *"Why did it say that about me?"* has an answer |
| **The `✕` promise** | Removing a memory removes exactly one clause. A model summary cannot be un-summarised, so a forgotten memory would survive inside a paragraph nobody can edit |

That last one is the whole of my §6 reason 2, and it survives intact. It is also what decides the mechanism below.

### 9.2 · Compose at request time — which removes the scheduling question entirely

Your framing was *"pass it when a new report is generated, or when the user returns after new memories have been created."* That implies a stored persona, a dirty flag, and a decision about when to refresh.

**None of that is needed.** Because composition is free and deterministic, the persona is built in the proxy at request time from the current memory rows. There is no stored copy to go stale, no regeneration to schedule, and no window in which a forgotten memory is still in flight.

It also lands exactly on the freeze/fresh split in §3: the persona is `context.user`, so it resolves fresh on every call — including an Ask six weeks later, which was the case that started this.

### 9.3 · The one real cost, and it is not ours to control

A Pass-1 guidance bundle is large. Measured:

| Bundle | Bytes | ≈ tokens |
|---|---:|---:|
| `report-style-guide.md` (L0 + L3) | 76,174 | ~19,000 |
| `type-market-research.md` (L2) | 18,919 | ~4,700 |
| `components.md` (L1b) | 20,707 | ~5,200 |
| **Pass 1, one analysis** | **115,800** | **~29,000** |

A persona is 200–400 characters — **~100 tokens, about 0.3% of that bundle.** Carrying it costs nothing.

**What can cost a great deal is where it sits in the prompt.** That ~29,000-token bundle is identical for every user running the same type and tier, which makes it the ideal prompt-cache prefix. A per-user string placed **before** it makes the prefix unique per user and the cache never hits. On the caching schemes I know of a cache read runs around a tenth of a fresh input token, so the difference between the two placements is roughly an order of magnitude on the largest part of every prompt.

> **Contract requirement for Jayant: `context.user` must be appended after the guidance bundle, never prepended.** Same for anything else per-user or per-request.

This is worth stating explicitly because it is invisible from our side — we cannot see his prompt assembly, and the feature would work perfectly either way while quietly costing ten times more one way than the other. It is the single highest-leverage sentence in the v3 contract.

### 9.4 · Provenance — stamp it, do not store it

The persona is fresh by design, so a report generated in August and an Ask answered in October ran under different personas. That is intended. But it means *"why does this report read this way"* needs an answer.

**Put a `persona_hash` in `context.analysis`** — a hash of the composed string at commit. Sixteen bytes, frozen with `guidance_version`, and it makes a report explainable without storing a second copy of the user's profile against every analysis they ever ran.

### 9.5 · What it must never do — the register rule

The appeal of this is real, and so is the way it goes wrong. **The persona governs how Caspr pitches an answer. It is never quoted back.**

*"As someone who runs diligence on live deals and reports to an investment committee, you'll want…"* is off-register in two ways at once: it spends words on the reader instead of the analysis, and an analyst who knows the room does not announce that they know the room. They just pitch it correctly. `brand-guidelines.md`: *"Trusts the reader's intelligence. Never over-explains."*

The existing layer rules already say this and need no amendment — **L3 is GUIDANCE and additive-only; L0 Voice is RULES and absolute.** A persona is L3 input. It may modulate depth, vocabulary and what gets spelled out. It can never license a sentence about the user, and it can never be a dependency: `§10.9` remains the most-used profile at launch and the output must be excellent with no persona at all.

### 9.6 · One defect found, and fixed

`content.ts:118` read `memory: 'Reads analyses himself'` — one of 27 strings, assuming the user's gender from nothing.

Harmless while it sat in `localStorage`. **Not harmless once it becomes an input the engine reads**, because a model given a gendered clause about the reader will mirror it in the output — and a report that refers to a user as "he" on the strength of a copy default is a bad first impression we would have manufactured ourselves.

Now `'Reads analyses personally'`. 40 engagement tests pass.

### 9.7 · Answer to the question, in one line

**Feasible, free to compute, ~0.3% to carry, and the only cost that matters is a prompt-cache placement rule that has to be written into the contract because it is Jayant's side of the wire.**
