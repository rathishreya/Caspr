# Conformance — delivery package

**What this is.** A conventions-conformance harness for `caspr-frontend` and
`caspr-backend`. It checks how the code is *written* against the conventions this
project has locked — not what it does. Behavioural correctness stays with the test
session and its existing convention.

**Where it goes.** Copy this directory to `conformance/` at the repo root, and
`ci/conformance.yml` to `.github/workflows/conformance.yml`. It stays on Drive only
until then; once installed, **the Drive copy of the code is deleted** and Drive keeps
the specification alone. Two live copies of anything is a fork.

| File | Goes to | What |
|---|---|---|
| `run.mjs` | `conformance/run.mjs` | The runner. Zero dependencies, Node 20+ |
| `rules.json` | `conformance/rules.json` | The machine register — **config**, never hand-edited |
| `contract-parity.mjs` | `conformance/contract-parity.mjs` | `SEAM-07` — OpenAPI ↔ TS contract |
| `selftest/` | `conformance/selftest/` | The harness's own tests — 24 assertions |
| `ci/conformance.yml` | `.github/workflows/conformance.yml` | Rings 2 and 3 |
| `README.md` | `conformance/README.md` | This file |
| `spec-drift.mjs` | **stays on Drive** | The only check that must see both halves |

**The reasoning is not here and never will be.** It lives on Drive:

- [`CONVENTIONS-CONFORMANCE-SPEC.md`](../CONVENTIONS-CONFORMANCE-SPEC.md) — every rule, its source, its tier, the conflicts resolved
- [`CONFORMANCE-CI-ARCHITECTURE.md`](../CONFORMANCE-CI-ARCHITECTURE.md) — the four rings, the adoption sequence

---

## Run it

```bash
node conformance/run.mjs --tier 1 --mode report
```

```bash
node conformance/run.mjs --tier 1 --mode ratchet
```

```bash
node conformance/contract-parity.mjs --openapi backend-openapi.json --contract packages/contract/src
```

```bash
node conformance/selftest/run.mjs
```

The self-test runs first in CI. A runner whose detectors have quietly stopped firing
reports a clean tree — the worst failure mode a conformance gate has, because it looks
like success.

### Options

| | |
|---|---|
| `--root <dir>` | Repo root to scan (default: cwd) |
| `--tier 1\|2\|all` | **1** = locked, blocking. **2** = proposed, advisory |
| `--mode report\|ratchet\|strict` | `report` never fails · `ratchet` fails on regression · `strict` fails on any violation |
| `--write-baseline` | Rewrite `baseline.json` from this run |
| `--format text\|md\|json\|sarif` | Repeatable |
| `--out <file>` | Write the last `--format` to a file |
| `--only ID,ID` · `--family NAME` | Narrow the run |

---

## The four verdicts

Two would not be enough.

| | |
|---|---|
| **PASS** | Checked, conformant |
| **FAIL** | Checked, violated |
| **ABSENT** | The surface does not exist yet. An unbuilt export pipeline cannot violate an export rule |
| **UNCHECKED** | The check could not run — **and this is never reported as a pass** |

`UNCHECKED` exists because of two specific incidents. `eslint.config.js:107` exempted
`'e2e/**'`, a pattern that resolved from the repo root and therefore **never matched
anything** — the rule passed for weeks without running. And two of the repo's most
valuable tests failed at *import*, which read as a build error rather than as lost
coverage, so the coverage stayed lost.

**Any rule whose include globs match zero files reports `UNCHECKED`, not `PASS`.**

---

## The ratchet

The gate is red on `main` today. Adding another blocking gate to a repo whose gate is
already ignored produces one outcome. So:

```bash
node conformance/run.mjs --tier 1 --write-baseline   # once, after calibration
```

From then on a rule's finding count **may shrink and may never grow.** New code is
held to the standard; existing code is paid down deliberately. When a count reaches
zero the rule can be promoted to hard-fail and never regress.

Same mechanism already in use for the white-on-accent contrast list.

---

## Suppression

```ts
// conformance-ignore COLOR-01 -- dark card; #e8453c passes on #0b0b09. joy 2026-08-25
```

A reason of at least eight characters is required. **A bare ignore is itself a
failure** and fails the run. Suppression totals are printed every run and are
themselves ratcheted.

---

## Tier 2 is advisory, deliberately

[`ENGINEERING-STANDARDS-PROPOSAL.md`](../ENGINEERING-STANDARDS-PROPOSAL.md) opens with
*"Status: proposal, nothing adopted"* and asks Joy three questions that have no answer
in any later document. ASVS Level 2, Conventional Commits, the 300-line file budget,
Prettier, ADRs and the bundle budget are therefore **measured and reported, and fail
nothing.**

A report that fails the build on things nobody agreed to is a report that gets muted.

---

## Before you trust a single result

**This has never run against Caspr source.** It was authored from the specifications,
by a session with no access to either repository, and validated only against a
synthetic fixture with planted violations.

What that fixture *did* establish:

- All seven detectors fire correctly, and the four verdicts are distinguished
- Suppression works, and a bare ignore fails
- The ratchet round-trips — identical tree passes, one new violation fails
- All four output formats render; the SARIF validates as 2.1.0
- `contract-parity.mjs` reproduces the `$NaN` bug: given a wire sending
  `spendable_cents` and a type declaring `spendableCents`, it reports **CRITICAL ·
  casing** and exits 1

What it did not establish: **whether any of the 67 rules matches real Caspr code.**
Expect false positives on the first run. Rules carrying `"calibration": true` in
`rules.json` are the ones I already expect to need tuning — `SPACE-01`, `COLOR-06`,
`COPY-02` and `SHELL-05` most of all, because each casts a wide net by design and the
right threshold is a judgement only the source can settle.

**Calibration is step 2 of the adoption sequence, not a defect in the harness.**
