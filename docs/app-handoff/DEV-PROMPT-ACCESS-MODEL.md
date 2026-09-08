# Dev prompt — the access model

*2026-08-26. Paste into the dev session. Design owns the Figma copy; this is behaviour, schema and billing.*

**Spec:** [`docs/product/access-model.md`](../product/access-model.md) — read it in full before starting.
**Also:** `.agents/pricing-model.md` §3 and §5 *(§5 now defers to the access model — do not re-implement from
it)* · `docs/product/document-taxonomy.md` §B.

---

## 1 · Pricing — three changes

| | |
|---|---|
| **1.1** | **Retire the $399 à-la-carte price entirely.** `pricing-model` §4.3 and §10.13. **One price per analysis at every mode: `$15 · $80 · $300`.** With top-up available to anyone, a no-subscription price point has nothing left to do |
| **1.2** | **Remove the $300-depth milestone gate.** Redundant — a $200 budget yields ~$186 and cannot cover a $300 analysis, so the balance already gates it. **Any mode may run any depth its balance covers** |
| **1.3** | **The budget is a floor, not a cap.** Top-up at any mode, any time. Already true via §8.3 — confirm no gate blocks it |

---

## 2 · Modes and gates

`Professional · Business · Enterprise` → **`Try · Solo · Team · Org`**. Thresholds unchanged: none / $200 / $600 / $1,800.

| Gate | At | Note |
|---|---|---|
| Output editing · section refinement · follow-up queries · Updates | **Solo** | Moved **down** from Business |
| Data Room upload · collaborative editing | **Team** | |
| Org-scoped Data Room · SSO · API · Projects · seats | **Org** | |

**Never gated, at any mode including Try and an expired trial:** running an analysis at any depth ·
**every citation** · **the Ask Caspr citation layer** · receiving and reading a shared analysis.

---

## 3 · ⚠ Billing — Org does not delta-recharge

**Try, Solo and Team** keep §3.1 delta recharge: unused balance carries forward, the next charge restores only
what was consumed.

**Org is committed spend — charged in full monthly, per seat, regardless of consumption. Used or lost.**

> **Why it matters mechanically:** under delta recharge, **revenue equals consumption plus fee**, so a declared
> budget is a ceiling rather than a commitment and raising it earns nothing. Committed spend is the only
> mechanism that makes a seat price real.

**Two knock-ons:**
- **`refund-policy.md` §9.1 refunds unused balance on cancellation** — needs an Org carve-out. **Legal review, not a code change alone**
- Minimum 3 seats. **Seats 4+ pricing is TBD** (`pricing-model` §5.2) — build the seat model, leave the rate configurable

---

## 4 · Collaboration

### 4.1 Roles

| Role | Can |
|---|---|
| **Owner** | Everything. Their budget funds the analysis and all editing on it |
| **Editor** | Refine, re-visualise, run follow-ups **on the owner's analysis, from the owner's wallet** |
| **Viewer** | Read · every citation · Ask Caspr. **Free, unmetered, always** |

### 4.2 ⚠ The two-pots rule — get this exactly right

> **Editing on an owner's analysis always debits the owner's wallet.**
> **A new collaborator's own $100 trial is never touched by it.**

The invited user's trial credit is reserved for **their own first analysis**. No cap logic, no shared pool, no
bleed in either direction.

**An editor cannot *start* an analysis on someone else's account** — that is what keeps the funnel intact.

### 4.3 Generation bills the actor

Any generation **outside** an owner's analysis debits the actor's own balance. A viewer can never spend
another user's budget except through the editor role that owner explicitly granted.

---

## 5 · Data Room — schema change

**⚠ `document-taxonomy` §B1 currently uses `public` / `private` to mean *output eligibility*, not visibility.**
Adding a visibility scope that also says *public* would give one field name two meanings.

| Field | Values | Governs |
|---|---|---|
| **`confidentiality`** *(rename of `classification`)* | `confidential` *(default)* · `publishable` | Whether outputs drawing on it may be surfaced publicly — `/samples`, shareable links. Feeds §A.9 provenance |
| **`visibility`** *(new)* | `only_me` *(default)* · `team` · `org` | Who can see the file |

**Both default closed**, per §B1's own asymmetry: *forgetting to mark it open is an inconvenience; forgetting
to mark it closed is a leak.*

**Migration:** existing `private` → `confidential` + `only_me`; existing `public` → `publishable` + `only_me`.
**Visibility must not be inferred from confidentiality** — they are orthogonal.

### 5.1 Share grants

- A file is shared **per analysis, per share, explicitly, defaulting to no**
- A grant never changes the persistent `visibility` field — same rule as the Gate-1 checkbox in §B2
- **A claim sourced from an unshared file renders: the claim, the source named as private, no content**
- **Provenance is unaffected by editing.** An analysis touching a confidential file stays `includes_private` and can never reach `/samples` or a public link, whoever edits it

---

## 6 · Renames in code and copy strings

| From | To |
|---|---|
| `Professional` · `Business` · `Enterprise` *(as plan names)* | `Try` · `Solo` · `Team` · `Org` |
| `Monthly Brief` | **`Updates`** |
| `Caspr Signals` | **Removed** — retired into Insights. Delete the tiered watched-topic feature and its settings |
| `classification` | `confidentiality` |

**`The Signal`** — singular, the in-report sentiment layer — is unaffected and must not be swept.

---

## 7 · New lint rules to implement

| | |
|---|---|
| **`COPY-11a`** | **The Research Budget is never framed as a subscription price.** Fails on `/mo`, `per month`, `monthly`, `starting at` within ~30 chars of `$200` / `$600` / `$1,800` |
| **`COPY-11b`** | **⚠ *"only charged for what you run"* and equivalents are FALSE and must fail.** `R = F + top_up` — **the fee is charged every month regardless of use** ($14 at a $200 budget, even at zero consumption; $94 for one $80 analysis). Fails on `only.*charged.*(you )?(run\|use)`, `never charged unless`, `pay only for what`. **Permitted:** *unused balance carries forward* · *restores only what you consumed* · *a quiet month costs less* |
| **`COPY-07b`** | **A depth name never appears without its deliverable type.** Full spec at `CONVENTIONS-CONFORMANCE-SPEC` §3.9 |

---

## 8 · Open — do not guess

**Seats 4+ pricing** · **whether Insights gates and where** · **the `public` field rename's migration cost**.
