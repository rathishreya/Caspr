# Conformance handover — 2026-08-25

For the dev session, and for Joy where marked. Findings ordered by what to act on
first.

**This session changed no code and holds no repository access.** Everything below
was found by reading the specifications against each other, which means every
finding is real *now* and none of them depends on the harness ever running.

| | |
|---|---|
| Rule register | 109 rules · Tier 1 **88** · Tier 2 **21** |
| Runnable as static checks today | **68** |
| Deferred by declaration | runtime 13 · build 9 · manual 16 · repo 3 |
| Harness | built, validated against a fixture, **never run against Caspr source** |
| `SPEC-DRIFT` | ✓ in step |

Documents produced:

- [`CONVENTIONS-CONFORMANCE-SPEC.md`](CONVENTIONS-CONFORMANCE-SPEC.md) — the register: every rule, its source, its tier
- [`CONFORMANCE-CI-ARCHITECTURE.md`](CONFORMANCE-CI-ARCHITECTURE.md) — four rings, the ratchet, the adoption sequence
- [`conformance/`](conformance/) — the runner, the register, contract parity, the workflow, `SPEC-DRIFT`

---

## 0 · Joy — three decisions, and one of them has a regulator

Nothing below is an engineering call.

### 0a · `ENGINEERING-STANDARDS-PROPOSAL.md` asked you three questions and has no answer

It is dated 2026-08-20 and opens **"Status: proposal, nothing adopted."** I searched
the later documents and the session transcripts; none of the three is answered
anywhere. Until they are, **everything in that document is advisory** — ASVS,
Conventional Commits, Prettier, ADRs, the 300-line budget, the 200 KB bundle budget.

That is a deliberate choice, not an omission. A report that fails the build on things
nobody agreed to gets muted within a week.

The three: **SOC 2 or ISO 27001 first · ASVS L2 or L1 · do the Tier 1 legal items
proceed now, separately from any rebuild.**

### 0b · The proposal's §7 and `security-posture.md` §1 contradict each other

`ENGINEERING-STANDARDS-PROPOSAL.md` §7 asks which certification to pursue first and
recommends leading with your higher-revenue geography.

[`.agents/security-posture.md`](../../.agents/security-posture.md) §1 — dated
2026-05-14, *"all items confirmed by Jayant"* — already states **ISO 27001:2022 ✓
Active, independently audited** and **SOC 2 Type I audit initiated Q2 2026.** Those
claims are cleared for marketing use and appear in approved copy.

**Both cannot be current.** Either the certification exists and §7 is asking a settled
question, or the marketing claims are ahead of the facts. The second reading is the
one worth checking urgently, because ISO 27001 appears in shipped copy and in
enterprise objection handling.

**This is a factual question for you and Jayant, and it is not something I can
resolve from documents.**

### 0c · EU AI Act Article 50(2) — in force, and nothing implements it

`ai-disclosure-spec.md` §2.2 specifies the machine-readable marking. It has been in
force since **2 August 2026**. Every PDF and PPTX Caspr produces is generated content
and must carry it.

It is item 13 on the design session's handover list, marked **"yours"** to dev, and
`BUILD-STATUS-2026-08-25.md` does not record it as done. Five register rules
(`AIACT-02`–`06`) will report **ABSENT** rather than FAIL, because an unbuilt pipeline
cannot violate an export rule — but **ABSENT on a live legal obligation is a standing
item, not a clean result.**

---

## 1 · HIGH — Three locked documents contradict each other

Each is resolved in the spec §2. Each resolution is itself a fix, because a stale
locked document will be built from.

### 1.1 Focus ring — `motion-and-interaction-states.md` §4 says 2px; the answer is 1.5px

| Document | Says |
|---|---|
| `motion-and-interaction-states.md` §4 (2026-08-10) | 2px ring |
| `DESIGN-INPUTS-RESPONSE.md` §6b (2026-08-21) | 2px ring |
| **`focus-keyboard-spec.md` §1 (locked 2026-08-21)** | **1.5px** — 2px perimeter is 2.4.13, **AAA**; we hold **AA** |
| **`design-guidelines.md` §10a (locked 2026-08-21)** | **1.5px** |

**Why this one bites.** `motion-and-interaction-states.md` §4 is the *hover / focus /
pressed / disabled* table — the single most likely document for a developer
implementing interaction states to open. It is the one that is wrong.

**Fix:** one line in §4 pointing at `focus-keyboard-spec.md`. Register rule
`FOCUS-01` flags `outline: 2px` in source.

### 1.2 Target size — 24×24 and ≥44 are different rules and must not be merged

`motion-and-interaction-states.md` §4 says *"Hit targets ≥44px on Compact."*
`focus-keyboard-spec.md` §2 says **24×24**.

Both stand, at different strengths. **24×24 is WCAG 2.5.8 AA — the legal floor**
(`TARGET-01`, Tier 1). 44px on compact is a design preference with no regulation
behind it (`TARGET-02`, Tier 2).

**Why it matters:** reporting a 30px control on mobile as a legal accessibility
failure would be wrong, and that kind of wrong discredits the rest of a report.

### 1.3 Error text colour — the motion doc's own flag is now answered, and it did not notice

`motion-and-interaction-states.md` §4 ends: *"keep to brand red for error text unless
Joy decides otherwise (flag)."*

`design-guidelines.md` §1 (locked 2026-08-21, later) decided otherwise:
**`#e8453c` may never be a text fill on a light surface** — 3.93:1, below 4.5:1 — and
red text on light is **`#be3530`** (5.61:1).

**Error text in brand red on white is an accessibility failure**, whatever the motion
document still says. `COLOR-01` and `COLOR-02` encode it.

---

## 2 · MEDIUM — The backend has almost no written conventions

`FRONTEND-CONVENTIONS-RECONCILED.md` is 231 lines of locked decisions. There is no
equivalent for the Python service. `ruff` and `mypy --strict` are named in the test
brief and that is the whole of it.

Undecided in writing: router layout, schema naming, service/repository boundaries,
error-shape conventions, migration rules, where business logic may live.

**The backend is where the money is.** `wallet/service.py` is at **51% coverage** and
`profile/service.py` at **66%** — the two newest modules, handling money and
personalisation — while the repo passes its 80% floor overall.

**Two things follow, and the second is cheap:**

1. A backend conventions document is worth writing, and this register has a
   backend-shaped hole until it exists.
2. **A per-module coverage floor would have caught the 51% and nothing currently
   does.** A repo-wide floor is passed by exactly the modules that need it least.

---

## 3 · MEDIUM — Where ADRs live is an unresolved conflict, not a check

`ENGINEERING-STANDARDS-PROPOSAL.md` §9 wants ADRs, noting their absence is *"how the
backend language was chosen invisibly."*

`CLAUDE.md` keeps every document on Drive, and permits only `README.md` /
`README-DEV.md` in a repo. **An ADR is a document.** But an ADR that is not beside the
code it governs loses most of its value, which is being found by the person changing
that code.

Registered as `ADV-QUAL-05`, `check: manual`, with the conflict stated rather than
silently resolved. **This is a rule-of-the-house question for Joy**, and it is the one
place I found where two of your own standards genuinely pull against each other with
no later decision settling it.

---

## 4 · The register's own blind spots — stated so nothing reads as coverage

- **The jsdom problem.** The existing 829 tests run in jsdom, which has no layout
  engine. **No `SHELL`, `TARGET` or `FOCUS-05` rule can be verified by them** — 13
  runtime rules need a real browser or they are not being checked, whatever a green
  suite says.
- **The keyboard family is entirely runtime.** `KBD-01` — focus returning to the
  trigger — is named in the source as *"the most common keyboard regression"* and no
  static check can see it.
- **`SEAM-05` and `SEAM-07` need both repos at the revisions that co-deploy.** A PR
  knows only its own repo. They belong in the pre-deploy ring.
- **Two large specs were not read**: `api-spec-v2.md` (641 lines) and
  `architecture-alignment-final.md` (684). Both describe the contract rather than the
  conventions, and both are the first place to look when calibrating `SEAM-05` and
  `SEAM-07`.

---

## 5 · What the harness does, and what it has not done

**Validated against a synthetic fixture**, not against Caspr source:

- All seven detectors fire; the four verdicts (PASS · FAIL · **ABSENT** · **UNCHECKED**) are distinguished
- Suppression requires a reason — **a bare ignore is itself a failure**, and that fails the run
- The ratchet round-trips: identical tree exits 0, one new violation exits 1
- All four formats render; SARIF validates as 2.1.0
- `SPEC-DRIFT` runs and reports in step
- **`contract-parity.mjs` reproduces the `$NaN` bug.** Given a wire sending
  `spendable_cents` and a type declaring `spendableCents`, it reports **CRITICAL ·
  casing** and exits 1. It also catches the nullability drift the backend introduced
  at `8f18fce`

**Three bugs were found in my own code by that fixture** and fixed: a trailing-`**`
glob that never matched files, numeric patterns that missed JSX bare numbers, and a
line-window paired check that produced false negatives on dense CSS. That is the
argument for the fixture, and the same argument applies to the first real run.

**Not done: a single rule has been checked against real Caspr code.** Expect false
positives. Rules marked `"calibration": true` — `SPACE-01`, `COLOR-06`, `COPY-02`,
`SHELL-05` most of all — cast a wide net by design, and the right threshold is a
judgement only the source can settle.

---

## 6 · What I would do next, in order

1. **Joy:** answer §0a, check §0b. Both gate what the register is allowed to enforce.
2. **Dev:** the three one-line document corrections in §1. Cheapest fixes here by a distance.
3. **Dev:** install `conformance/`, run it, calibrate. Half a day, and it produces the first real numbers.
4. **Dev:** commit `baseline.json`, add stage 9 to `gate` in **report-only** mode.
   **Do not turn on blocking** — `npm run gate` is already red on `main` at three of
   eight stages, and a second ignored gate is worse than none.
5. **Dev:** backend emits and diffs `contract/openapi.json`. That single step unlocks
   `SEAM-07`, which is the rule that catches the `$NaN` class mechanically.
6. **Test session:** the runtime families ride on the Playwright width matrix that
   §5.2 of the test brief already wants. Not new work — a second reason for it.

---

## 7 · Lane safety

Per `TEST-SESSION-PROMPT-2026-08-25.md` §6, new files are the test lane's by default.
**Everything here is new files in a new directory.** Installing it edits exactly two
existing files — one `package.json` script line and one new workflow file. Nothing
touches `src/**` or any unit test the dev session may be mid-edit in.

---

*Conformance session · 2026-08-25. No application file was read or edited; this
session holds no repository access.*
