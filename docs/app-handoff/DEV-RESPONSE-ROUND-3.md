# Response — dev prompt round 3

**Date:** 2026-08-21. **Answering:** [`DEV-PROMPT-ROUND-3.md`](DEV-PROMPT-ROUND-3.md).

**Confirmed: the design session has nothing outstanding to deliver.** Everything in §8 is mine, on Jayant, or deferred by Joy. Round 3 does add five items to *my* list that were not on it before — those are unblocked and are listed in §3 below.

---

## 1 · §3's corrected CSS — verified in a layout engine, not read

This is the one claim where being wrong twice would have cost a rebuilt shell, so I measured it rather than accepting it. The declaration was applied to a real flex container and the children measured at five widths:

| Container | rail | pane | buffer L | **centre** | buffer R |
|---:|---:|---:|---:|---:|---:|
| 1440 | 64 | 390 | 93 | **800** | 93 |
| 1280 | 64 | 390 | 13 | **800** | 13 |
| 1254 | 64 | 390 | 0 | **800** | 0 |
| 1220 | 64 | 390 | 0 | **766** | 0 |
| 1180 | 64 | 390 | 0 | **726** | 0 |

Every number in §3's table reproduces exactly. **Accepted as the shell spec.**

The mechanism is worth stating because it is not obvious and it is what makes the correction work: shrinkage is distributed in proportion to `flex-shrink × flex-basis`, and the buffers have a **basis of 0**. That gives them a shrink weight of zero — they cannot shrink, because they only ever existed as leftover growth in the first place. The centre carries the entire deficit. "Buffers give way before the centre does" is not implemented by a rule about buffers; it falls out of their basis being 0.

**One finding: `min-width: 560px` never engages.** At the 1180 structural switch the centre is 726. It would only reach 560 at a container width of 1014, which is 166px below the point where the three-column layout has already become one column plus drawer. The floor is therefore inert — correct, but doing no work.

Keeping it, with the reason recorded: it is the constraint that becomes live if the 1180 switch ever moves down. It should not be read as "the centre is allowed to reach 560", because in this composition it cannot.

---

## 2 · §4 — the pixel movements are accepted, not regressions

Recorded here so a future audit does not re-litigate them: the eight movements in §4 are the conversion normalising off-scale gaps to the §2 scale, and the build follows the converted frames. `27 → 24`, `x20 → x16`, `528 → 540`, `479 → 494`, `10/12 → 12`, `9 → 8`, `240 → 258`.

The framing worth keeping is §5.2's: *loose nodes hide this class of defect; containers surface it.* A −2px overlap that survived two audits because the rendered text happened to sit clear of the card is exactly what a coordinate audit cannot catch and a container makes unarguable. That is the same failure mode as 829 tests passing in jsdom, which has no layout engine — both measured something adjacent to the thing that mattered.

---

## 3 · What round 3 adds to my list

Five items, all unblocked. None is a design decision and none needs an answer to start.

| | Item | From |
|---|---|---|
| 1 | **Spacing scale as tokens** — `4 · 8 · 12 · 16 · 20 · 24 · 32 · 48 · 64`, and the nesting technique of one gap per wrapper mirrored in JSX | §2 |
| 2 | **The corrected shell CSS** — replaces what §10b originally said | §3 |
| 3 | **`brand/black` never as app text** — a second lint beside the contrast one. `#0a0a0a` is website chrome only | §1.3 |
| 4 | **The six layout patterns encoded as components** — right-aligned bubble, numbered question row, `or` divider, chat bubble, card/row stacks, list runs | §6 |
| 5 | **Focus ring 1.5px, offset 2px unchanged** — updates the focus implementation I had not yet written | §7 |

On §6: *"text is a child; frame hugs"* is the one I would have got wrong. A fixed box with text positioned over it is precisely what 836 absolute positions produced, and it is the defect that does not appear until real text is longer than the fixture.

---

## 4 · §1.4 — accepted, and split in two

**Agreed: one implementation, and the shared package is the right shape.** `Header`, `Footer`, `Wordmark`, `CTAButton` as presentational components taking `href` strings and a `LinkComponent` prop.

**The drift is already real, and I checked rather than assumed.** Four hand-built `<header>` blocks exist in `apps/web/src/pages/onboarding/`:

- `AuthScreen.tsx:32` · `FirstTimeUserPage.tsx:59` · `LoginPage.tsx:79` — all three carry the identical class string `relative h-[56px] bg-paper shell:h-[72px]`
- `OnboardingToolLayout.tsx:41` — `relative h-[72px] bg-paper`, already diverged

Three copies of one string and a fourth that has drifted. That is the rule's case made in the code.

**Splitting it, because the two halves have different risk:**

- **Now, and mine alone:** one header/footer implementation *inside the app*, consumed by all four onboarding surfaces. Entirely within `caspr-app`, unblocked, no cross-repo question.
- **Flagged for Joy, not started:** promoting it to a package the **website** also consumes. The website repo is separate and frozen; extracting into it is a scope decision rather than a build step, and I am not making it silently. **Nothing is lost by sequencing it second** — the app collapses four copies to one either way, and the package extraction is then a move rather than a rewrite.

Also agreed on rejecting the second option: signup *is* the live tool, gated at the value moment, so serving onboarding from the website would mean the website needs the app runtime.

---

## 5 · The three open questions

| | Question | State |
|---|---|---|
| 1 | Does the API return `sourceCount` and `model` for export metadata? | **Jayant, asked.** Not blocking — the export pipeline is built to write whatever it is given and omit what it is not |
| 2 | C2PA now, or XMP-only? | **Answered: XMP-only**, built so a manifest can be added without rework |
| 3 | Does the footer link alone satisfy AI Act 50(1)? | **Deferred by Joy**, not blocking. Article 50 is enforceable 2 August 2026 |

---

## 6 · The pending list, unchanged

Round 3 changes nothing about what is blocked on other people. That list is still exactly four, and all four are credentials or a scope answer:

1. A Postgres instance and its `DATABASE_URL`, plus one `rds_superuser` run to apply the schema and create the login role
2. Where `new.caspr.ai/app` deploys, and how code gets there
3. The Stripe webhook pointed at the deployed URL, and that endpoint's signing secret
4. Does the Google sign-in button need to work for testing?
