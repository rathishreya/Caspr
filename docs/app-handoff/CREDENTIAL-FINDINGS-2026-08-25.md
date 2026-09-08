# Credential exposure — findings and hardwiring

**Against:** [`ai-credential-exposure-rules.md`](../../ai-credential-exposure-rules.md) (Jayant, 2026-08-25 — 58 rules, 41 `[P0]`).
**For:** Joy, and Jayant as security owner.
**Method:** the standard read in full, then a scan of the Drive tree by **filename and pattern count only**. No credential value was read into a model context at any point, deliberately — `R-CLS-4` makes partial disclosure full disclosure, so even a prefix would have been a disclosure.

---

## 0 · Two live findings

### 0.1 `Ahrefs_Key.txt` — **P0, rotate today**

| | |
|---|---|
| **Path** | `Ahrefs_Key.txt`, at the root of this Drive folder |
| **Shape** | 40 bytes · one line · a single 40-character opaque token, nothing else |
| **Tier** | **1** — `R-CLS-2`, "third-party API key (any environment)"; `R-CLS-5` step 2, grants access to a billable account |
| **Rule** | `R-CTX-1` [P0] — secrets never live in a tree an agent can read |

**Why this is not a near-miss.** That folder is the root of **every session in this project**, including sessions with no code access. Any session that ran a broad `grep`, `cat` or `find` over it pulled the value into a model context. I cannot know whether one did, and `R-AI-1` makes the default deny. It is also on Google Drive, so it has been **replicated to cloud storage** for as long as it has existed.

Under `R-RSP-3` that is a disclosure, and a Tier 1 value that entered a disclosure surface is compromised.

**Remediation, in this order — the order matters:**

1. **Rotate the Ahrefs key** at Ahrefs.
2. **Confirm the old value fails** (`R-RSP-4` — rotation is not complete until it does).
3. **Then** delete the file.

Deleting before rotating destroys the evidence of what needs rotating. **No agent should delete it** — that is a human action, and the [CLAUDE.md](../../CLAUDE.md) Rule 7 protocol says so explicitly.

### 0.2 `docs/app-handoff/CASPR-KEYS-REQUEST.txt` — **needs your eyes, not mine**

109 lines. **Two lines match real credential prefixes**, and the file carries only **one** placeholder-style marker — so those two are probably values, not examples.

I have not read it and will not. Open it yourself and decide:

- **Format examples / requested shapes** → Tier 2, fine where it is.
- **Delivered values** → Tier 1. Rotate each, then remove them from the file.

---

## 1 · What was hardwired

Per your instruction — *"everywhere that ensures they are followed"* — all four layers.

| Layer | What | Where |
|---|---|---|
| **Agent behaviour** | Rule 7: four prohibitions, plus the on-discovery protocol | [`CLAUDE.md`](../../CLAUDE.md) |
| **Harness** | 19 `Read()` denies on credential paths · 6 `Bash()` denies on `printenv`, `env`, `ps auxeww`, `aws configure get`, `gcloud auth print-access-token`, `terraform output` | `.claude/settings.json` |
| **Conformance** | 15 `CRED-*` rules, each mapped to Jayant's rule IDs | [`CONVENTIONS-CONFORMANCE-SPEC.md`](CONVENTIONS-CONFORMANCE-SPEC.md) §3.12 |
| **Routine** | Pre-flight scan that **refuses to run**, plus redaction of every artifact | `caspr-release-check` |

**The pre-flight is the one that changes behaviour most.** `caspr-release-check` now scans both repos *and* the Drive folder before doing anything, and aborts if a credential is present — because testing against a tree holding a live credential copies it into a worktree, into test output, and into artifacts on cloud-replicated storage. It is verified working: run today, it aborted on `Ahrefs_Key.txt` with exit 2, naming the path and never the value.

**Artifact redaction closes a surface this project created this week.** Everything `caspr-release-check` writes lands on Drive. A pytest traceback carrying a DSN, or an assertion echoing a token, would be permanent. All writes now route through a redactor that names the *kind* of value found and never a character of it.

---

## 2 · Gaps in the standard

Six, ordered by how much they cost.

### 2.1 It is written for repositories; the largest surface here is a Drive folder

`R-CTX-1` says "repository working tree". But [CLAUDE.md](../../CLAUDE.md) Rule 1 makes `G:\My Drive\Caspr\caspr-claude-core` the root of every session, and it is cloud-replicated in a way a local repo is not. **That omission is exactly how finding 0.1 survived.**

**Closed** by extending scope (Joy, 2026-08-25) — recorded in CLAUDE.md Rule 7 and in the `CRED` family. **Worth folding back into Jayant's document**, since the same gap exists for anyone else reading it literally.

### 2.2 No protocol for what an agent does when it *finds* a credential

`R-RSP-5` covers reporting after the fact. Nothing tells the agent: stop, do not read it, report the path and never the value. **The default helpful behaviour is to `cat` the file to see what it is** — which converts a filesystem problem into a disclosure.

**Closed** in CLAUDE.md Rule 7. Belongs in the standard as an `R-RSP` rule.

### 2.3 Build and test artifacts are not in the `R-AI-2` disclosure-surface table

The table has eight rows — prompt, file read, tool output, process env, agent config, memory, telemetry, retrieved content. **Test output is not one of them**, and it is among the most likely: a failing assertion prints what it compared.

**Closed** for this project by redaction. **Should be a ninth row** in `R-AI-2`.

### 2.4 Appendix E item 3 contradicts `security-posture.md`

Appendix E records the approved-provider list as **"not started"**. But [`.agents/security-posture.md`](../../.agents/security-posture.md) §2 already names Anthropic, OpenAI and Google with executed DPAs and Zero Data Retention, marked *"all items confirmed by Jayant"* and cleared for marketing use.

Either that is the approved list, or one document is stale. **This is the second contradiction between two Jayant-confirmed documents** — the first, still open, is `ENGINEERING-STANDARDS-PROPOSAL.md` §7 asking which certification to pursue while `security-posture.md` §1 states ISO 27001:2022 is already active. Both are recorded as `CRED-13` and in the conformance handover.

### 2.5 `R-CTX-5` cannot be verified from inside the agent

It requires the harness to be launched with `env -i` and an explicit passlist. Checking would mean running `printenv` — which `R-CTX-3` forbids returning to context. **The rule makes itself uncheckable by the thing it constrains.**

That is not a defect; it means verification is an infrastructure-review item. Registered as `CRED-11`, `check: manual`, with the reason stated rather than quietly dropped. **But it is very likely being violated right now** — these sessions launch from an interactive Windows shell, which is exactly the case the rule names as richer than any CI step.

### 2.6 `R-VER-1`'s confusables check had no implementation anywhere

The document is right that a non-printing filter will never find them, and right that it needs a script-mixing check. Nothing implemented one.

**Closed** — `CRED-05` does per-token script detection across Latin, Cyrillic, Greek and Armenian. Verified against a planted Cyrillic `а` inside `cаspr-api`.

---

## 3 · A defect in my own work, recorded because it is the most instructive thing here

The first version of `CRED-01` **passed on this folder** — the folder with a live API key at its root.

Two independent reasons, and the second is worse than the first:

1. **The rule was too narrow.** `**/*.key` does not match `Ahrefs_Key.txt`, and the content has no recognisable prefix, so the shape rule missed it too. Fixed by adding `CRED-15`, which detects the file *shape*: a small file whose entire content is one structureless token.

2. **The runner never looked at the file at all.** The file walker filtered by extension and **`.txt` was not on the list**. Adding the credential-bearing formats took the walked-file count on this folder from **449 to 594** — **145 files were invisible to every rule in the register, and every one reported PASS.**

The second is the important one. The whole verdict system rests on `UNCHECKED` never being reported as `PASS` — but **a rule cannot report that it failed to examine a file it was never offered.** The blindness was one level below where the verdict system can see it.

**The general lesson, and it applies to the whole register:** a conformance run's coverage claim is only as good as its file discovery. Any scanner with an allowlist of extensions has this failure mode. Worth checking whatever else in this project filters files before scanning them.

---

## 4 · Open, and needing you or Jayant

| # | Item | Owner | Status |
|---|---|---|---|
| 1 | **Rotate the Ahrefs key**, confirm the old fails, then delete the file | Joy | **open — P0** |
| 2 | **Read `CASPR-KEYS-REQUEST.txt`** and classify its two credential-shaped lines | Joy | **open** |
| 3 | Reconcile Appendix E item 3 with `security-posture.md` §2 | Jayant | open (§2.4) |
| 4 | Reconcile `ENGINEERING-STANDARDS-PROPOSAL.md` §7 with the ISO 27001 claim | Jayant | open, carried from the conformance pass |
| 5 | Confirm the agent harness launch environment (`R-CTX-5` / `CRED-11`) | Jayant | open — not checkable from inside |
| 6 | Fold gaps §2.1, §2.2 and §2.3 back into the standard | Jayant | proposed |
| 7 | Appendix E item 1 — security owner set to **`security@caspr.ai`** (Joy, 2026-08-25) | — | **closed**, needs reflecting in the source document |

**Note on item 7.** Appendix E named *"Jayant (joy@caspr.ai)"* — a person at someone else's address, on the role that `R-CLS-2`, `R-RSP-5` and `R-VER-5` all route to. As written, exposure reports would have reached Joy while the document said they reached Jayant. Now `security@caspr.ai`, which already exists as the general security contact in `security-posture.md` §11, and which closes the open item properly rather than leaving it interim.

---

*Conformance session · 2026-08-25. No credential value was read into a model context in producing this document.*
