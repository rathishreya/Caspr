# Dev ask — split Style from Template in the gate spec

**For:** the app/dev session · **Approved by:** Joy, 2026-08-18 · **Affects:**
`docs/product/gate-output-spec.md` §5 (and §2.1's Style row), `.agents/pricing-model.md`

---

## The problem

`gate-output-spec.md` §5 currently treats **style** and **template** as one thing:

> **Launch = a single Caspr template.** Style is not just visual — it governs content treatment: text style,
> vocabulary, density, chart/infographic style, output length, and appendices.
> […] **Future — user-defined custom templates.** **OPEN pricing decision** […] *(Not in launch scope.)*

Read today, that tells a developer to build **one** style option at launch. That is wrong. They are two separate
features with different scope, different delivery, and different commercials — and one of them ships now.

---

## What is actually true

### Style — ships at launch, self-serve, included

How the analysis is **written**: vocabulary and jargon, section titles, register, density, length, appendices.
The conventions differ by audience — investors title and phrase things one way, consulting decks another,
academic work another again.

- **Multiple styles at launch**, not one
- **Included** in the analysis price
- Chosen **pre-generation** (free). Changing style **after** generation is a re-generation and draws an output
  charge — unchanged from the current spec
- A **single-select** in the gate accordion, exactly as §2.1 already describes

**Needed from product:** the canonical list of style values for launch. Working assumption is
`consulting · investor · academic · default` — please confirm the list and the slugs.

### Template — committed, but a service, not a launch selector

The **client's own house format**: their deck master, their document styling.

- **$1,000 one-time setup**
- **1 week turnaround**, delivered by **team Caspr** — not self-serve
- Client provides samples of the vertical-format and PPT outputs they need, or just the `.potx`
- **Enterprise offering.** Sold alongside SSO and API, quoted rather than listed
- **Not a gate selector at launch.** Once an account has a provisioned template it should appear as an option in
  the same Style row — visible only to accounts that have one

This closes the "OPEN pricing decision" in the current §5.

---

## The ask

1. **Rewrite §5** as two subsections — `5a Style` and `5b Client template` — with the content above. Delete
   "Launch = a single Caspr template"; it is wrong in both halves.
2. **§2.1 Style row** — confirm the row is a single-select over the style list, and that its RHS reads
   `Included` at the gate (already correct in §2.2).
3. **Build the style selector against a list, not a constant.** Whatever the launch list turns out to be, the
   gate should read it from config so adding a style later is not a UI change.
4. **Template provisioning is an account-level attribute**, not an analysis parameter. It needs somewhere to
   live on the account record, and the gate needs to conditionally show it.
5. **`pricing-model.md`** — add the $1,000 template setup as a **service line**, explicitly outside the Research
   Budget ladder. It must not appear as a fourth analysis price.

---

## Why it matters now

The website is being rebuilt against `site-truth.md`, which treats style as a **launch capability and a
headline differentiator** — an off-the-shelf research report cannot be written in your house register, and that
is one of the three arguments the new pricing anchor rests on. If the build ships one style, the site is
overclaiming on its most load-bearing page.

Conversely, template must **not** be described as self-serve anywhere. It carries a delivery obligation and a
one-week turnaround; "upload your deck and we'll match it" would be a promise the product cannot keep.

---

## Still open

- The canonical style list and slugs (above)
- What a client pays when they rebrand and need the template redone — full $1,000 again, or a lower refresh fee?
  (`site-truth.md` OD-11)
