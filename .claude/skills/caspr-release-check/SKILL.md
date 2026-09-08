---
name: caspr-release-check
description: Run the unattended test and conformance sweep across caspr-frontend and caspr-backend, and write a report for the dev session to fix from. Use when Joy asks to run the tests, run a release check, check what is broken, produce a test report, or check conformance before a deploy. Runs T0 static gate, T1 unit and contract, T3 lab performance, T5a static security and the full conventions conformance harness against a temporary git worktree. Never modifies application code.
---

# caspr-release-check

Runs the test tiers and the conformance harness against a **committed** state of both
repositories, then writes one report the dev session can work from.

**It changes no application code.** Every suite runs in a detached git worktree that is
removed afterwards. This is the whole reason it can run unattended.

---

## Run it

```bash
node ".claude/skills/caspr-release-check/run.mjs"
```

Run it **in the background** — a full sweep is 10–30 minutes, most of it `npm ci`,
Playwright and pytest. Use the Bash tool with `run_in_background: true` and tell Joy
it is running; do not poll it. You will be re-invoked when it exits.

Then read the report path it prints on stdout, summarise the **Fix first** section for
Joy, and stop. Do not fix anything — the dev session owns that, and this routine's
value depends on it staying read-only.

### Options worth knowing

| | |
|---|---|
| `--only T0,CONF` | Run a subset. Accepts step ids (`T0`, `CONF-FE`) or tiers (`CONF`, `T5a`) |
| `--ref <sha>` | Test a specific commit instead of `HEAD` |
| `--skip-install` | Reuse an existing worktree's dependencies. Much faster; only valid on a re-run |
| `--keep-worktree` | Leave the worktrees for inspection when something needs debugging |
| `--frontend` · `--backend` · `--drive` | Override the default paths |

A conformance-only pass takes seconds and is the right thing for a quick check:

```bash
node ".claude/skills/caspr-release-check/run.mjs" --only CONF
```

---

## Pre-flight — it may refuse to run, and that is correct

Before anything else, the routine scans **both repos and the Drive folder** for
credentials. If it finds one it **aborts with exit 2** and runs nothing.

That is not a malfunction. Testing against a tree holding a live credential copies it
into a worktree, into test output, and into artifacts on cloud-replicated storage —
`ai-credential-exposure-rules.md` `R-AI-1`, the default is deny.

**When it aborts, do not work around it.** Report to Joy: the **path**, the rule id, and
nothing else. Never the value, never a prefix, never the length of the secret itself
(`R-CLS-4` — partial disclosure is full disclosure). Remediation is **rotate first,
confirm the old value fails, then delete** — and the agent never deletes a credential
file, because deleting before rotating destroys the evidence of what needs rotating.

Everything the routine writes is **redacted** on the way out, so a traceback carrying a
DSN cannot become a permanent artifact on Drive.

## What it runs

| Step | Tier | What |
|---|---|---|
| *pre-flight* | CRED | Credential scan of both repos and Drive. **Aborts the run on any hit** |
| `FE-INSTALL` · `BE-INSTALL` | setup | `npm ci` · `uv sync` in the worktrees |
| `T0` | T0 | `npm run gate` — lint, typecheck, secret scan, dep audit, unit, tools, build, bundle size |
| `T1-BE` | T1 | `pytest` — unit and integration against pgserver |
| `T5a-RUFF` · `T5a-MYPY` | T5a | `ruff` · `mypy --strict` |
| `T3` | T3 | Playwright — layout and geometry |
| `CONF-SELFTEST` | CONF | The conformance harness's own 24 assertions. **Gates the conformance steps** |
| `CONF-FE` · `CONF-BE` | CONF | Conventions conformance, Tier 1 |
| `CONF-FE-T2` | CONF | Tier 2, advisory — the unadopted proposal, measured not enforced |
| `SEAM-07` | CONF | Contract parity, OpenAPI vs `packages/contract` |

## What it deliberately does not run

Listed in every report so their absence is visible rather than assumed.

| Tier | Why |
|---|---|
| **T2** journeys | They do not exist yet |
| **T4** load, real pipeline | Burns Jayant's GPU budget |
| **T5b** active security scanning | **Requires written authorization from Jayant.** Excluded permanently until that letter exists |
| **T5c** model protection · **T6** output eval | Need the live AI service and consume analysis budget |

**Do not add any of these to the routine.** T5b in particular is the one item here
that could cause a real incident between Joy and Jayant's team. If Joy asks for them,
say what is missing rather than running them.

---

## The four verdicts

| | |
|---|---|
| ✅ **PASS** | Ran, clean |
| ❌ **FAIL** | Ran, found something |
| 🚧 **BLOCKED** | **Could not run.** Never a pass — tooling absent, upstream step failed, service down |
| ⛔ **OUT_OF_SCOPE** | Deliberately excluded, with the reason printed |

`BLOCKED` is a first-class outcome because of a specific incident: two of the repo's
most valuable tests failed at *import*, which read as a build error rather than as lost
coverage, so the coverage stayed lost. **When summarising for Joy, always state the
blocked count — a run with 8 blocked steps is not a green run.**

---

## Output

- **Report:** `docs/app-handoff/RELEASE-CHECK-<date>.md` — handover-shaped, Fix-first at the top
- **Artifacts:** `docs/app-handoff/release-check-artifacts/` — per-step logs, conformance JSON, `results.json`

The artifact directory is cleared at the start of every run. A log from a previous run
sitting beside a current report reads as evidence for this run.

Exit `0` clean · `1` failures found · `2` routine error.

---

## Notes that matter

**Uncommitted work is not tested.** The worktree is at a commit. The report counts
modified files and says so. If Joy wants work-in-progress tested, she needs to commit
it first — and the report will name the SHA either way.

**The first conformance run is calibration, not findings.** The 109 rules were authored
from the written conventions and have never run against Caspr source. Expect false
positives; rules marked `"calibration": true` cast a wide net by design. Report them
as calibration data and say so.

**`npm run gate` is red on `main`** at three of eight stages, and has been since before
this routine existed. A red `T0` is expected until that is fixed — check the artifact
log to see whether it is the known three or something new.

---

*Companion documents on Drive: [`CONVENTIONS-CONFORMANCE-SPEC.md`](../../../docs/app-handoff/CONVENTIONS-CONFORMANCE-SPEC.md) ·
[`CONFORMANCE-CI-ARCHITECTURE.md`](../../../docs/app-handoff/CONFORMANCE-CI-ARCHITECTURE.md). The
testing tier model is `docs/superpowers/specs/2026-08-12-product-testing-apparatus-design.md` §5.*
