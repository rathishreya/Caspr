# Caspr GTM Portal — `team.caspr.ai`

The operations console where the week's marketing work is generated, reviewed, published
and measured.

**This tree is code only.** Every specification, decision record and runbook lives on
Drive under `docs/gtm/`, per the standing rule in `CLAUDE.md`. Two live copies of a
document is not redundancy, it is a fork.

**Specifications this build implements** — read them there, not here:

| | |
|---|---|
| `docs/gtm/portal-build-spec.md` | what it does |
| `docs/gtm/portal-design-spec.md` | what it looks like, and why |
| `docs/gtm/portal-responsive-spec.md` | how it behaves between 900 and 1440 |
| `docs/gtm/operations-runbook.md` | how it is run once built |
| `docs/gtm/content-engine-operating-model.md` | the registers the engine executes against |

---

## What is in this build

Two surfaces, and the shell they share.

| Screen | Route |
|---|---|
| **Content Calendar** — System ▸ Calendar | `/calendar` |
| **Content & Social ▸ Dashboard** | `/content-social/dashboard` |
| **Content & Social ▸ Tasks** | `/content-social/tasks` |
| **Content & Social ▸ Library** | `/content-social/library` |

Every other destination in the navigation tree renders a state that says what it will be
and that it is sequenced rather than blocked. **Nothing in this console dead-ends** —
design spec §11A.

**Review mode is not here, and its absence is load-bearing.** Design spec §5A decision 2
gives review exactly one entry point, on My Week. The Tasks tab lists items and links
there; it never starts the flow. Two entry points would mean two mental models of what
reviewing is.

---

## Running it

```bash
npm install
npm run dev            # http://localhost:3000
```

No database is required. Absent `DATABASE_URL` the console serves the 23-item **reference
week** from `@caspr-portal/domain` — build spec §0: *"Build against mocks for everything
BLOCKED and PARTIAL. The portal is a shell that renders, queues and records — it can be
built end to end before a single upstream feed exists."* A footnote on each screen says
which adapter answered.

```bash
npm run gate           # lint · typecheck · test · build. Run this before pushing.
npm test               # vitest
npm run db:generate    # drizzle-kit, after a schema change
```

**Secrets.** Nothing in this repo holds a live value. `DATABASE_URL`,
`WATERMARKS_SERVICE_URL` and the Cognito variables are injected from AWS Secrets Manager at
runtime; `.env.example` carries their names and `.gitignore` refuses every other env file.
Build spec §7, `CLAUDE.md` Rule 7.

---

## Layout

```
packages/tokens     the design tokens, in TypeScript and CSS, asserted equal by a test
packages/domain     types, registers and every pure calculation the screens read
packages/db         Drizzle schema and the Postgres client
apps/console        the Next.js app
```

**Why the calculations sit in `domain` rather than in the pages.** The Calendar's header
reads `22 SCHEDULED · 1 HOLDING` and its banner promises that nothing publishes unreviewed.
That promise is the strongest thing the product says. A count maintained by hand beside a
grid that disagrees with it would make the promise look like decoration — so both come from
`buildCalendarWeek`, and a test asserts the pair.

---

## Five decisions worth knowing before changing anything

**1 · White means one thing.** Design spec §2: *"White means: this needs your decision.
Dark means: this is yours to use."* No screen in this build shows content under judgement,
so no screen in this build is white. Using `surface/card` for emphasis would spend a
semantic the review console depends on.

**2 · Red means attention, and nothing else.** In the product app red means *citation*.
Here it means rejected, stale, over threshold, defect. That is why the focus ring is white,
why a bar is neutral until it breaches a cap, and why the reference-data footnote is a grey
line rather than a red panel. `#E8453C` also measures 3.93:1 and fails 4.5:1 on white — the
dark ground is compliance, not taste.

**3 · The rail collapse was built first.** Responsive spec §5: 220px → 64px frees 156px,
which takes the 900px work area from 600 to 756 and fixes four of the six tables that break
there. The horizontal-scroll container is a backstop, not the mechanism. Below 900 the
console does not render at all — it routes to the Personal Queue, in CSS, with both trees in
the document so there is no measurement and no flash of the wrong one.

**4 · Almost no motion, and no spinners.** Design spec §14.2. Transitions and animations are
disabled globally in `tokens.css` rather than left to discipline. A loading state is text
that names what is running and when it ends. The one exception — a 120ms cross-fade on
review-mode advance — belongs to a screen that is not in this build.

**5 · No hardcoded colour outside `packages/tokens`.** Enforced by an eslint rule, not by
review. The single exception is `apps/console/src/app/icon.svg`, which cannot read a CSS
custom property; the reason is written inside the file.

---

## One correction to the design reference

The Figma Calendar frame is captioned `18 – 24 AUG` with Monday on the 18th. **18 August
2026 is a Tuesday.** The Monday of that week is the 17th, so the reference week runs 17–23
and every weekday carries the content the frame put on it. A mock is allowed to be wrong
about a date; a calendar is not.
