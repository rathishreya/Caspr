# Conformance in CI — architecture

**The ask (Joy, 2026-08-25):** *"these tests should also run each time new code is
pushed to production."*

**The answer in one line:** conformance becomes a **ninth stage of `npm run gate`**
plus a **pre-deploy job**, sharing one dependency-free runner and one rule file, landing
**report-only behind a ratchet** rather than blocking on day one.

Companion to [`CONVENTIONS-CONFORMANCE-SPEC.md`](CONVENTIONS-CONFORMANCE-SPEC.md),
which holds the rules themselves.

---

## 0 · The constraint that shapes everything

**`npm run gate` is currently red on `main`** — three of eight stages fail, and
`TEST-HANDOVER-2026-08-25.md` §0 records that it *"has been failing since before this
brief was written, which means nothing is currently blocking on it."*

Adding a blocking gate to a repo whose gate is already ignored produces one outcome:
the new gate gets ignored too, or switched off within a week. So the sequence below is
not "install and enforce". It is:

1. **Land silent.** Report-only. Nothing fails. Nothing changes for anyone.
2. **Snapshot.** The first clean run writes `conformance-baseline.json` — the count of
   existing violations per rule.
3. **Ratchet.** From that day, a count may **shrink and may never grow.** New code is
   held to the standard; existing code is paid down deliberately.
4. **Promote.** A rule whose count reaches zero flips to hard-fail and can never
   regress.

This is not a new mechanism here — it is exactly the one already in use for the
white-on-accent contrast list: *"On the ESLint ratchet; the list may shrink and may
never grow."* Reusing it means no one has to be argued into it.

---

## 1 · Four rings

Each ring runs a superset of the one before, and the split is by **what the check can
see**, not by preference.

| Ring | Where | Cost | Runs | Blocking |
|---|---|---|---|---|
| **0** | Pre-commit hook (opt-in) | < 2 s | Changed files, `static` only | No — advisory, bypassable |
| **1** | `npm run gate` stage 9 | < 10 s | All `static` rules, whole tree | Ratchet |
| **2** | PR job | ~4 min | Ring 1 + `runtime` (Playwright, axe) | Ratchet + inline annotations |
| **3** | **Pre-deploy** | ~8 min | Ring 2 + `build` + **cross-repo** | **Hard — this is the production gate** |
| **4** | Weekly schedule | — | `SPEC-DRIFT`, Tier 2 trend, dependency drift | No — opens issues |

**Ring 1 is the one that matters most**, because it runs everywhere `gate` runs —
a developer's laptop, a PR, a push, a release. One command, same result. That is why
the runner is **dependency-free**: it must execute before `npm ci` has necessarily
succeeded, and it must never be the reason the dependency tree breaks.

### Why Ring 3 is separate from Ring 2

Two families cannot run on a PR:

- **`SEAM-07`** (frontend contract types vs. backend OpenAPI) needs **both repos at the
  revisions that are about to ship together.** A PR knows only its own repo.
- **`AIACT-02`–`06`** need a **generated PDF/PPTX** to inspect, which needs the export
  pipeline running against a built artifact.

Ring 3 is the first point where both exist. It is also the last point before a user
sees the result, which is the right place for a hard gate.

---

## 2 · Where the pieces live

```
caspr-frontend/
  conformance/
    rules.json          ← the machine register. Generated from the spec, never hand-edited
    run.mjs             ← the runner. Zero dependencies, Node 20+
    checks/*.mjs        ← one module per family
    baseline.json       ← the ratchet. Committed. Only ever shrinks
  .github/workflows/
    conformance.yml     ← Rings 2 and 3
  package.json          ← "gate": "... && npm run conformance"

caspr-backend/
  conformance/          ← same runner, Python-aware checks
  contract/openapi.json ← committed snapshot, regenerated + diffed on every build
```

**And on Drive, never copied into either repo:**

```
docs/app-handoff/
  CONVENTIONS-CONFORMANCE-SPEC.md    ← the why, the sources, the reasoning
  CONFORMANCE-CI-ARCHITECTURE.md     ← this file
  conformance/                       ← the delivery package, until the dev session installs it
```

### The one thing that exists twice, and how it is kept honest

`CLAUDE.md` is unambiguous that a document living in two places is *"not redundancy, it
is a fork"*, and names `THEATER-SOURCE-DECODE-MOTION.md` as the precedent. So the split
has to be principled rather than convenient.

**It turns on a distinction `CLAUDE.md` already draws:** *"code is source, tests,
**config**, build files, and migration SQL."*

| Artefact | Lives | Because |
|---|---|---|
| The reasoning, the sources, the conflicts, the tiers | **Drive only** | It is a specification. It is read by Joy and by sessions, not by a machine |
| `rules.json` — IDs, patterns, severities | **Repo only** | It is **config**. A linter reads it. Same class as `eslint.config.js` |

**Exactly one thing is duplicated: the list of rule IDs.** `SPEC-DRIFT` reconciles it —
every ID in `rules.json` must appear in the spec and vice versa, and the `specVersion`
must match. It runs from the **Drive side** (Ring 4), because only a session with both
halves can see both halves. CI never reads Drive; Drive never holds a second copy of the
config.

---

## 3 · Trigger matrix

```yaml
# Ring 2 — every PR
on:
  pull_request:
    branches: [main]

# Ring 3 — the production gate
on:
  push:
    branches: [main]        # main is what deploys to new.caspr.ai/app
  workflow_dispatch:        # manual re-run without a commit
```

**Ring 3 must sit between build and push-to-ECR**, not after deploy:

```
checkout → npm ci → gate (incl. Ring 1) → build
   → Ring 3 conformance ──── FAIL ──→ stop. No image. No deploy.
   │
   └── PASS → docker build → push ECR → EKS rollout
```

A conformance check that runs after the rollout is a report, not a gate. The whole
value is being the last thing that can say no.

---

## 4 · The cross-repo check, in detail

**`SEAM-07` is the highest-value rule in the register** and the only one that needs
machinery rather than a regex, so it gets its own section.

**What it prevents.** `getSnapshot` did `res.json() as WalletSnapshot`. The server sent
`spendable_cents`; the type declared `spendableCents`. Every field was `undefined` and
the app header rendered **`$NaN` on every screen**. Both repos were green. Both test
suites passed. *"Each side of the seam was internally consistent and nothing tested the
join."*

**How it is caught mechanically:**

1. **Backend, every build:** FastAPI already knows its schema. Emit it —
   `python -m app.openapi > contract/openapi.json` — and **fail the build if the
   committed file differs.** The snapshot is then always current, and any contract
   change shows up as a reviewable line in the PR diff rather than as a surprise.
2. **Frontend, Ring 3:** fetch the backend's `contract/openapi.json` at the revision
   about to co-deploy, and compare every response model against the corresponding type
   in `packages/contract`.
3. **Compare on three axes**, because the `$NaN` bug failed on the second:
   - **Field presence** — a field in one and not the other
   - **Casing** — `spendable_cents` vs `spendableCents` with no mapper between them
   - **Nullability** — the backend made `budget_cents` nullable at `8f18fce`; a
     non-nullable frontend type is the next `$NaN`

**The rule that makes it tractable**, lifted verbatim from `TEST-HANDOVER-2026-08-25.md`
§7 — this is the finding that closed the cast audit, and it is what turns a judgement
call into a check:

> *A cast is safe exactly where the type is written in the wire's own casing.*

So `SEAM-01` and `SEAM-02` reduce to: **a cast whose target type is snake_case is
permitted; a cast whose target type is camelCase is a defect.** That is mechanical.

---

## 5 · Reporting

Four outputs, each for a different reader.

| Output | Goes to | Reader |
|---|---|---|
| **SARIF** | GitHub code scanning | The developer, inline on the diff line |
| **Markdown** | `$GITHUB_STEP_SUMMARY` | Whoever opens the run |
| **JSON** | Build artifact, 90-day retention | The trend, and Ring 4 |
| **`HANDOVER.md`** | Drive, `docs/app-handoff/` | Joy, and the dev session |

Every report carries all four verdicts — **PASS · FAIL · ABSENT · UNCHECKED** — and
`UNCHECKED` is never collapsed into a pass.

**That last point is not pedantry.** `TEST-HANDOVER-2026-08-25.md` §0c records two of
the most valuable tests in the repo failing at *import*, which read as a build error
rather than as lost coverage — so the coverage stayed lost and the suite looked fine.
A conformance run that cannot distinguish "clean" from "did not run" reproduces that
exact bug at the scale of the whole suite. `UNCHECKED` is a first-class outcome and it
appears in the summary line.

---

## 6 · Failure modes this design is built against

Named up front, because each has already happened once here.

| Failure | Precedent | Mitigation |
|---|---|---|
| **Gate goes red and gets ignored** | Happening now — 3 of 8 stages | Land report-only. Ratchet. Never a big-bang enforcement |
| **A glob never matches and the rule silently passes** | `'e2e/**'` at `eslint.config.js:107` never matched anything | Every rule declares `expectMatches: true`. **A rule that matches zero files reports `UNCHECKED`, not `PASS`** |
| **The rules and the spec drift apart** | `THEATER-SOURCE-DECODE-MOTION.md` | `SPEC-DRIFT`, Ring 4 |
| **A test passes on Linux and fails on Windows** | `lazy.bundle.test.ts` — `execFileSync('npm')` without `shell: true` | Runner is pure Node, no shelling out, no path assumptions |
| **The suite reports coverage it does not have** | jsdom has no layout engine; `getBoundingClientRect` returns zeros | Layout, target-size and focus-clipping rules are **runtime-only by declaration** and refuse to run in jsdom |
| **Suppressions accumulate invisibly** | — | Every suppression needs a reason and an owner; the total is printed every run and is itself ratcheted |
| **A new file lands outside the checked tree** | — | The runner walks from the repo root, not from a configured list |

---

## 7 · Adoption sequence

Sized so nothing here is a project.

| Step | Work | Owner | Blocking on |
|---|---|---|---|
| 1 | Copy `conformance/` into `caspr-frontend`, add `"conformance"` to `package.json` scripts | dev | — |
| 2 | Run it. **Expect false positives** — the rules were authored against the specs, never against the source | dev | — |
| 3 | Calibrate: fix patterns, mark genuine exceptions, delete rules that cannot be checked cleanly | dev + this session | 2 |
| 4 | Commit `baseline.json`. Add stage 9 to `gate`, **report-only** | dev | 3 |
| 5 | Turn on the ratchet — counts may shrink, never grow | dev | 4 |
| 6 | Backend: emit + diff `contract/openapi.json` | dev | — |
| 7 | Ring 3 job with `SEAM-07` | dev | 6 |
| 8 | Playwright width matrix + axe → the `runtime` families | test session | — |
| 9 | Promote zeroed rules to hard-fail | dev | 5 |

**Steps 1–5 are a day.** Steps 6–7 are the high-value ones and depend only on FastAPI
already knowing its own schema. Step 8 is the largest and is already the test session's
outstanding §5.2 item, so it is not new work — conformance just gives it a second
reason to exist.

---

## 8 · Lane safety

`TEST-SESSION-PROMPT-2026-08-25.md` §6 splits the lanes: *"New files anywhere are yours
by default"*, and application `src/**` belongs to the dev session.

**Everything here is new files in a new directory.** The only edits to existing files
are two lines:

- `package.json` — one script entry, one word appended to `gate`
- `.github/workflows/` — one new file

Neither touches `src/**`. Neither touches a unit test the dev session may be mid-edit
in. There is no merge-conflict surface.

---

## 9 · What this architecture does not do

- **It does not check behaviour.** A conformant screen can still be wrong. The test
  session's convention — *"a finding without a failing test is an opinion"* — is
  unchanged and this does not replace it.
- **It does not read Google Drive from CI.** By design. Only Ring 4, from the Drive
  side, sees both halves.
- **It does not enforce Tier 2.** ASVS, Conventional Commits, the 300-line budget and
  the rest are measured and reported until Joy answers the proposal's three questions.
- **It has never been run.** Authored against the specifications, against a codebase
  this session cannot read. Step 2 above exists because of that, and the first run
  should be read as calibration data rather than as findings.

---

*Conformance session · 2026-08-25.*
