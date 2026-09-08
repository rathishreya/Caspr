#!/usr/bin/env node
/**
 * caspr-release-check — the unattended test + conformance routine.
 *
 * Zero dependencies. Node 20+. Cross-platform.
 *
 *   node run.mjs [options]
 *
 *     --frontend <dir>   frontend repo   (default: C:\Users\joysh\Claude-Local\caspr-app)
 *     --backend <dir>    backend repo    (default: C:\Users\joysh\Claude-Local\caspr-backend)
 *     --drive <dir>      Drive root      (default: G:\My Drive\Caspr\caspr-claude-core)
 *     --ref <rev>        what to test    (default: HEAD)
 *     --only T0,CONF     run a subset
 *     --skip-install     reuse an existing worktree's deps (fast re-run)
 *     --keep-worktree    leave the worktrees in place for inspection
 *     --out <dir>        artifact directory (default: <drive>/docs/app-handoff/release-check-artifacts)
 *
 * DESIGN RULES — each one is here because of a specific recorded failure.
 *
 *   1. NEVER BLOCK. stdin is /dev/null and every step has a timeout. A step
 *      that cannot run reports BLOCKED with a reason; it does not wait.
 *      A background routine cannot answer a prompt.
 *
 *   2. TEST A COMMIT, NOT A DESK. Everything runs in a detached git worktree at
 *      a named SHA. The dev session is committing while this runs; findings
 *      against a half-saved tree correspond to nothing. Uncommitted files are
 *      counted and reported as excluded, never silently included.
 *
 *   3. BLOCKED IS NOT PASS. A tier whose tooling is absent, or whose service is
 *      down, is reported as BLOCKED. Two of this repo's most valuable tests once
 *      failed at *import*, which read as a build error rather than as lost
 *      coverage — so the coverage stayed lost.
 *
 *   4. NOTHING THAT SPENDS MONEY. T4 real-pipeline, T5c and T6 need Jayant's
 *      live service and consume analysis budget. T5b needs written authorization
 *      that does not yet exist. None of them are in this routine, and they are
 *      listed as OUT_OF_SCOPE in the report so their absence is visible.
 *
 *   5. shell:true ON WINDOWS. execFileSync('npm', …) without it throws
 *      spawnSync npm ENOENT outside an npm lifecycle script — finding 6 of
 *      TEST-HANDOVER-2026-08-25.md.
 *
 * Exit 0 clean · 1 failures found · 2 routine error.
 */

import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync, existsSync, rmSync, readFileSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const IS_WIN = process.platform === 'win32';

/* ── verdicts ─────────────────────────────────────────────────────────────── */

const PASS = 'PASS';
const FAIL = 'FAIL';
const BLOCKED = 'BLOCKED';      // could not run — never a pass
const SKIPPED = 'SKIPPED';      // deselected by --only
const OUT_OF_SCOPE = 'OUT_OF_SCOPE';

/* ── args ─────────────────────────────────────────────────────────────────── */

const opts = {
  frontend: 'C:\\Users\\joysh\\Claude-Local\\caspr-app',
  backend: 'C:\\Users\\joysh\\Claude-Local\\caspr-backend',
  drive: 'G:\\My Drive\\Caspr\\caspr-claude-core',
  ref: 'HEAD',
  only: null,
  skipInstall: false,
  keepWorktree: false,
  out: null,
};
for (let i = 2; i < process.argv.length; i++) {
  const a = process.argv[i];
  const next = () => process.argv[++i];
  if (a === '--frontend') opts.frontend = next();
  else if (a === '--backend') opts.backend = next();
  else if (a === '--drive') opts.drive = next();
  else if (a === '--ref') opts.ref = next();
  else if (a === '--only') opts.only = next().split(',').map((s) => s.trim().toUpperCase());
  else if (a === '--skip-install') opts.skipInstall = true;
  else if (a === '--keep-worktree') opts.keepWorktree = true;
  else if (a === '--out') opts.out = next();
  else { console.error(`unknown option: ${a}`); process.exit(2); }
}
opts.out = opts.out || join(opts.drive, 'docs', 'app-handoff', 'release-check-artifacts');

/* ── process helpers ──────────────────────────────────────────────────────── */

/**
 * stdio[0] is 'ignore' on purpose — the child gets no stdin, so an interactive
 * prompt reads EOF and dies instead of hanging the routine forever.
 */
function sh(cmd, args, { cwd, timeout = 300_000, env = {} } = {}) {
  // Windows needs a shell to resolve `npm` / `npx` / `uv`, which are .cmd
  // shims — but a shell also splits `C:\Program Files\nodejs\node.exe` at the
  // space and reports "not recognized as an operable program". So: shell only
  // for bare command names, never for a path.
  const needsShell = IS_WIN && !cmd.includes('\\') && !cmd.includes('/');
  const r = spawnSync(cmd, args, {
    cwd,
    encoding: 'utf8',
    timeout,
    shell: needsShell,
    windowsHide: true,
    stdio: ['ignore', 'pipe', 'pipe'],
    maxBuffer: 64 * 1024 * 1024,
    env: { ...process.env, CI: '1', FORCE_COLOR: '0', NO_COLOR: '1', ...env },
  });
  return {
    code: r.status,
    ok: r.status === 0,
    out: (r.stdout || '').toString(),
    err: (r.stderr || '').toString(),
    timedOut: r.error?.code === 'ETIMEDOUT' || r.signal === 'SIGTERM',
    spawnError: r.error && r.error.code !== 'ETIMEDOUT' ? r.error.message : null,
  };
}

const have = (cmd, args = ['--version']) => sh(cmd, args, { timeout: 20_000 }).ok;

function git(repo, args, timeout = 60_000) {
  return sh('git', ['-C', repo, ...args], { timeout });
}

/* ── worktrees ────────────────────────────────────────────────────────────── */

const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const WT_ROOT = join(tmpdir(), 'caspr-release-check', stamp);
const worktrees = [];

function prepareRepo(label, repoPath) {
  const info = { label, repoPath, ok: false };

  if (!existsSync(repoPath)) {
    info.reason = `repository not found at ${repoPath}`;
    return info;
  }
  const isRepo = git(repoPath, ['rev-parse', '--git-dir']);
  if (!isRepo.ok) {
    info.reason = `not a git repository: ${isRepo.err.trim() || isRepo.spawnError || 'unknown'}`;
    return info;
  }

  info.sha = git(repoPath, ['rev-parse', opts.ref]).out.trim();
  info.shortSha = info.sha.slice(0, 7);
  info.branch = git(repoPath, ['rev-parse', '--abbrev-ref', 'HEAD']).out.trim();
  info.subject = git(repoPath, ['log', '-1', '--pretty=%s', opts.ref]).out.trim();

  // Uncommitted work is NOT tested — it is counted and reported as excluded.
  const dirty = git(repoPath, ['status', '--porcelain']).out.trim();
  info.dirtyFiles = dirty ? dirty.split('\n').length : 0;

  const dest = join(WT_ROOT, label);
  mkdirSync(dirname(dest), { recursive: true });
  const add = git(repoPath, ['worktree', 'add', '--detach', dest, info.sha], 180_000);
  if (!add.ok) {
    info.reason = `git worktree add failed: ${(add.err || add.out).trim().slice(0, 300)}`;
    return info;
  }
  worktrees.push({ repoPath, dest });
  info.worktree = dest;
  info.ok = true;
  return info;
}

function cleanupWorktrees() {
  if (opts.keepWorktree) return;
  for (const { repoPath, dest } of worktrees) {
    git(repoPath, ['worktree', 'remove', '--force', dest], 120_000);
  }
  try { rmSync(WT_ROOT, { recursive: true, force: true }); } catch { /* best effort */ }
}

/* ── credential safety ────────────────────────────────────────────────────── */

const CONF = join(opts.drive, 'docs', 'app-handoff', 'conformance');

/**
 * Redact credential shapes from anything written to disk.
 *
 * Everything this routine writes lands in the Drive folder, which is replicated
 * to Google's cloud and read by every session. A pytest traceback carrying a
 * DSN, or a failing assertion echoing a token, would be a permanent disclosure
 * — and `R-AI-2` does not list build artifacts as a surface, which is precisely
 * why it needed adding.
 *
 * Redaction is lossy on purpose: the replacement names the KIND of value found
 * so a reader knows what to look for, and never a character of the value
 * (`R-CLS-4` — partial disclosure is full disclosure).
 */
const REDACTIONS = [
  [/AKIA[0-9A-Z]{16}/g, '«REDACTED aws-access-key-id»'],
  [/\bsk-[A-Za-z0-9]{20,}/g, '«REDACTED api-key»'],
  [/\bsk_(live|test)_[0-9a-zA-Z]{8,}/g, '«REDACTED stripe-key»'],
  [/\bwhsec_[0-9a-zA-Z]{8,}/g, '«REDACTED webhook-secret»'],
  [/\bgh[pousr]_[0-9A-Za-z]{20,}/g, '«REDACTED github-token»'],
  [/\bgithub_pat_[0-9A-Za-z_]{20,}/g, '«REDACTED github-pat»'],
  [/\bxox[baprs]-[0-9A-Za-z-]{10,}/g, '«REDACTED slack-token»'],
  [/-----BEGIN[A-Z ]*PRIVATE KEY-----[\s\S]*?-----END[A-Z ]*PRIVATE KEY-----/g, '«REDACTED private-key»'],
  [/\b(postgres(ql)?|mysql|redis|mongodb)(\+[a-z]+)?:\/\/[^:/\s]+:[^@\s]+@/gi, '$1://«REDACTED»:«REDACTED»@'],
  [/\b(Authorization|X-Api-Key)\s*:\s*\S+/gi, '$1: «REDACTED»'],
  [/\b([A-Z0-9_]*(?:SECRET|PASSWORD|TOKEN|API_?KEY|PRIVATE_?KEY)[A-Z0-9_]*)\s*=\s*\S+/g, '$1=«REDACTED»'],
];

function redact(text) {
  if (!text) return text;
  let out = String(text);
  for (const [re, rep] of REDACTIONS) out = out.replace(re, rep);
  return out;
}

/** Write a file with redaction applied. Nothing in this routine writes raw. */
function writeRedacted(path, text) {
  writeFileSync(path, redact(text));
}

/**
 * Pre-flight — refuse to run if a credential is present in anything we touch.
 *
 * A test run against a tree containing a live credential copies that credential
 * into a worktree, into test output, and into artifacts on cloud-replicated
 * storage. Aborting is cheaper than every downstream consequence, and the
 * standard's default is deny (`R-AI-1`).
 */
function preflightCredentialScan(targets) {
  if (!existsSync(join(CONF, 'run.mjs'))) {
    return { ok: false, blocked: true, reason: `conformance harness not found at ${CONF} — cannot verify credential safety, so not proceeding` };
  }
  const offences = [];
  for (const { label, dir } of targets) {
    if (!dir || !existsSync(dir)) continue;
    const r = sh(process.execPath, [
      join(CONF, 'run.mjs'), '--root', dir, '--family', 'CRED', '--tier', '1', '--format', 'json',
    ], { timeout: 300_000 });
    let parsed;
    try { parsed = JSON.parse(r.out); } catch {
      offences.push({ label, rule: '(runner)', text: `credential scan did not complete: ${firstError(r)}` });
      continue;
    }
    for (const rule of parsed.rules) {
      if (rule.verdict !== 'FAIL') continue;
      for (const f of rule.findings) {
        offences.push({ label, rule: rule.id, text: `${f.file} — ${f.text}` });
      }
    }
  }
  return { ok: offences.length === 0, offences };
}

/* ── step definitions ─────────────────────────────────────────────────────── */

/**
 * Each step returns a verdict. `pre` may return a string to BLOCK with a reason.
 * `parse` turns raw output into a short human summary — the report should be
 * readable without opening the artifacts.
 */
function buildSteps(fe, be) {
  const steps = [];
  const feCwd = fe.ok ? fe.worktree : null;
  const beCwd = be.ok ? be.worktree : null;

  /* ---- install ---- */
  steps.push({
    id: 'FE-INSTALL', tier: 'setup', repo: 'frontend', name: 'npm ci',
    timeout: 1_200_000,
    pre: () => {
      if (!feCwd) return fe.reason;
      if (!have('npm')) return 'npm not on PATH';
      // `npm ci` requires a lockfile and fails with a cryptic EUSAGE without one
      if (!existsSync(join(feCwd, 'package-lock.json'))) {
        return 'no package-lock.json at the repo root — `npm ci` needs one. Reproducible installs are the point; not falling back to `npm install`';
      }
      return null;
    },
    run: () => sh('npm', ['ci'], { cwd: feCwd, timeout: 1_200_000 }),
    parse: (r) => (r.ok ? 'dependencies installed' : firstError(r)),
  });

  steps.push({
    id: 'BE-INSTALL', tier: 'setup', repo: 'backend', name: 'uv sync',
    timeout: 900_000,
    pre: () => (!beCwd ? be.reason : !have('uv') ? 'uv not on PATH — see the brief: uv may be absent on Windows' : null),
    run: () => sh('uv', ['sync'], { cwd: beCwd, timeout: 900_000 }),
    parse: (r) => (r.ok ? 'python environment ready' : firstError(r)),
  });

  /* ---- T0 + T1 frontend: the gate ---- */
  steps.push({
    id: 'T0', tier: 'T0', repo: 'frontend', name: 'Static gate (lint · typecheck · secrets · audit · unit · build · size)',
    timeout: 1_800_000,
    needs: 'FE-INSTALL',
    run: () => sh('npm', ['run', 'gate'], { cwd: feCwd, timeout: 1_800_000 }),
    parse: (r) => (r.ok ? 'all gate stages green' : summariseGate(r)),
  });

  /* ---- T1 backend ---- */
  steps.push({
    id: 'T1-BE', tier: 'T1', repo: 'backend', name: 'pytest (unit + integration, pgserver)',
    timeout: 1_800_000,
    needs: 'BE-INSTALL',
    run: () => sh('uv', ['run', 'pytest', '-q', '--no-header'], { cwd: beCwd, timeout: 1_800_000 }),
    parse: (r) => summarisePytest(r),
  });

  steps.push({
    id: 'T5a-RUFF', tier: 'T5a', repo: 'backend', name: 'ruff',
    timeout: 300_000,
    needs: 'BE-INSTALL',
    run: () => sh('uv', ['run', 'ruff', 'check', '.'], { cwd: beCwd, timeout: 300_000 }),
    parse: (r) => (r.ok ? 'clean' : lastLines(r.out || r.err, 3)),
  });

  steps.push({
    id: 'T5a-MYPY', tier: 'T5a', repo: 'backend', name: 'mypy --strict',
    timeout: 600_000,
    needs: 'BE-INSTALL',
    run: () => sh('uv', ['run', 'mypy', '--strict', 'src'], { cwd: beCwd, timeout: 600_000 }),
    parse: (r) => (r.ok ? 'clean' : lastLines(r.out || r.err, 3)),
  });

  /* ---- T3 lab performance / layout ---- */
  steps.push({
    id: 'T3', tier: 'T3', repo: 'frontend', name: 'Playwright (layout + geometry)',
    timeout: 1_800_000,
    needs: 'FE-INSTALL',
    pre: () => (!feCwd ? fe.reason : null),
    run: () => {
      const inst = sh('npx', ['playwright', 'install', '--with-deps', 'chromium'],
        { cwd: join(feCwd, 'apps', 'web'), timeout: 900_000 });
      if (!inst.ok && !/already installed/i.test(inst.out + inst.err)) {
        return { ...inst, blockedReason: 'playwright browsers unavailable' };
      }
      return sh('npx', ['playwright', 'test', '--reporter=line'],
        { cwd: join(feCwd, 'apps', 'web'), timeout: 1_800_000 });
    },
    parse: (r) => summarisePlaywright(r),
  });

  /* ---- conformance: run from Drive, so it works before it is installed ---- */
  steps.push({
    id: 'CONF-SELFTEST', tier: 'CONF', repo: 'drive', name: 'Conformance harness self-test',
    timeout: 300_000,
    pre: () => (existsSync(join(CONF, 'selftest', 'run.mjs')) ? null : `harness not found at ${CONF}`),
    run: () => sh(process.execPath, [join(CONF, 'selftest', 'run.mjs')], { timeout: 300_000 }),
    parse: (r) => lastLines(r.out || r.err, 2),
    // A harness whose detectors have stopped firing reports a clean tree.
    // That is the worst failure mode a gate has, because it looks like success.
    critical: true,
  });

  steps.push({
    id: 'CONF-FE', tier: 'CONF', repo: 'frontend', name: 'Conventions conformance — frontend (Tier 1)',
    timeout: 600_000,
    needs: 'CONF-SELFTEST',
    pre: () => (!feCwd ? fe.reason : existsSync(join(CONF, 'run.mjs')) ? null : `harness not found at ${CONF}`),
    run: () => sh(process.execPath, [
      join(CONF, 'run.mjs'), '--root', feCwd, '--tier', '1', '--mode', 'report', '--format', 'json',
    ], { timeout: 600_000 }),
    parse: (r) => summariseConformance(r),
    artifact: 'conformance-frontend.json',
    verdictFrom: conformanceVerdict,
    softFail: true,   // never calibrated against real source — reported, not gating
  });

  steps.push({
    id: 'CONF-FE-T2', tier: 'CONF', repo: 'frontend', name: 'Conventions conformance — frontend (Tier 2, advisory)',
    timeout: 600_000,
    needs: 'CONF-SELFTEST',
    pre: () => (!feCwd ? fe.reason : existsSync(join(CONF, 'run.mjs')) ? null : `harness not found at ${CONF}`),
    run: () => sh(process.execPath, [
      join(CONF, 'run.mjs'), '--root', feCwd, '--tier', '2', '--mode', 'report', '--format', 'json',
    ], { timeout: 600_000 }),
    parse: (r) => summariseConformance(r),
    artifact: 'conformance-frontend-tier2.json',
    advisory: true,
  });

  steps.push({
    id: 'CONF-BE', tier: 'CONF', repo: 'backend', name: 'Conventions conformance — backend (Tier 1)',
    timeout: 600_000,
    needs: 'CONF-SELFTEST',
    pre: () => (!beCwd ? be.reason : existsSync(join(CONF, 'run.mjs')) ? null : `harness not found at ${CONF}`),
    run: () => sh(process.execPath, [
      join(CONF, 'run.mjs'), '--root', beCwd, '--tier', '1', '--mode', 'report', '--format', 'json',
    ], { timeout: 600_000 }),
    parse: (r) => summariseConformance(r),
    artifact: 'conformance-backend.json',
    verdictFrom: conformanceVerdict,
    softFail: true,
  });

  /* ---- SEAM-07 contract parity, if the backend publishes its schema ---- */
  steps.push({
    id: 'SEAM-07', tier: 'CONF', repo: 'cross', name: 'Contract parity — OpenAPI vs packages/contract',
    timeout: 300_000,
    pre: () => {
      if (!feCwd || !beCwd) return 'both repos required';
      const spec = join(beCwd, 'contract', 'openapi.json');
      if (!existsSync(spec)) {
        return 'backend does not publish contract/openapi.json yet — this is step 6 of the conformance adoption sequence and it is the check that catches the $NaN class mechanically';
      }
      return null;
    },
    run: () => sh(process.execPath, [
      join(CONF, 'contract-parity.mjs'),
      '--openapi', join(beCwd, 'contract', 'openapi.json'),
      '--contract', join(feCwd, 'packages', 'contract', 'src'),
      '--format', 'json',
    ], { timeout: 300_000 }),
    parse: (r) => summariseParity(r),
    artifact: 'contract-parity.json',
    verdictFrom: parityVerdict,
  });

  return steps;
}


/** Tier 1 conformance: the tally decides, not the exit code. */
function conformanceVerdict(r) {
  try { return JSON.parse(r.out).tally.fail > 0 ? FAIL : PASS; }
  catch { return FAIL; }
}

/** Contract parity: any critical or high finding is a failure. */
function parityVerdict(r) {
  try {
    const d = JSON.parse(r.out);
    return d.findings.some((f) => f.severity !== 'low') ? FAIL : PASS;
  } catch { return FAIL; }
}

/* ── output summarisers ───────────────────────────────────────────────────── */

const lastLines = (s, n) => (s || '').trim().split('\n').filter(Boolean).slice(-n).join(' · ').slice(0, 300) || '(no output)';

function firstError(r) {
  if (r.timedOut) return 'TIMED OUT';
  if (r.spawnError) return r.spawnError;
  const m = (r.err || r.out).split('\n').find((l) => /error|ERR!|failed/i.test(l));
  return (m || lastLines(r.err || r.out, 1)).trim().slice(0, 240);
}

function summariseGate(r) {
  if (r.timedOut) return 'TIMED OUT';
  const text = r.out + r.err;
  const stages = [];
  for (const s of ['lint', 'typecheck', 'secret', 'audit', 'test', 'tools', 'build', 'size']) {
    if (new RegExp(`${s}[^\\n]*(fail|error)`, 'i').test(text)) stages.push(s);
  }
  const errs = (text.match(/error/gi) || []).length;
  return stages.length
    ? `failing stage(s): ${stages.join(', ')} · ~${errs} error line(s)`
    : firstError(r);
}

function summarisePytest(r) {
  const text = r.out + r.err;
  const m = /(\d+) failed.*?(\d+) passed|(\d+) passed/.exec(text);
  const cov = /TOTAL\s+\d+\s+\d+\s+(\d+(?:\.\d+)?)%/.exec(text);
  const tail = lastLines(text, 1);
  const parts = [];
  if (m) parts.push(m[0]);
  else parts.push(tail);
  if (cov) parts.push(`coverage ${cov[1]}%`);
  return parts.join(' · ').slice(0, 240);
}

function summarisePlaywright(r) {
  if (r.blockedReason) return r.blockedReason;
  const text = r.out + r.err;
  const m = /(\d+)\s+passed|(\d+)\s+failed/g;
  const hits = text.match(m);
  return hits ? hits.join(' · ') : lastLines(text, 2);
}

function summariseConformance(r) {
  try {
    const d = JSON.parse(r.out);
    const t = d.tally;
    return `PASS ${t.pass} · FAIL ${t.fail} · ABSENT ${t.absent} · UNCHECKED ${t.unchecked} · ${t.findings} finding(s)`;
  } catch { return firstError(r); }
}

function summariseParity(r) {
  try {
    const d = JSON.parse(r.out);
    const crit = d.findings.filter((f) => f.severity === 'critical').length;
    const high = d.findings.filter((f) => f.severity === 'high').length;
    return `${d.pairs} pair(s) · ${crit} critical · ${high} high · ${d.unpaired.length} unpaired`;
  } catch { return firstError(r); }
}

/* ── execution ────────────────────────────────────────────────────────────── */

function selected(step) {
  if (!opts.only) return true;
  return opts.only.includes(step.id.toUpperCase()) || opts.only.includes(step.tier.toUpperCase());
}

function execute(steps) {
  const results = [];
  const done = new Map();

  for (const step of steps) {
    const t0 = Date.now();

    if (!selected(step)) {
      results.push({ ...meta(step), verdict: SKIPPED, summary: 'deselected by --only', ms: 0 });
      done.set(step.id, SKIPPED);
      continue;
    }

    // an upstream setup step that did not pass blocks everything that needs it
    if (step.needs && done.get(step.needs) !== PASS) {
      const why = done.has(step.needs)
        ? `${step.needs} did not pass (${done.get(step.needs)})`
        : `${step.needs} did not run`;
      results.push({ ...meta(step), verdict: BLOCKED, summary: why, ms: 0 });
      done.set(step.id, BLOCKED);
      continue;
    }

    const pre = step.pre?.();
    if (pre) {
      results.push({ ...meta(step), verdict: BLOCKED, summary: pre, ms: 0 });
      done.set(step.id, BLOCKED);
      continue;
    }

    process.stderr.write(`  running ${step.id} — ${step.name}\n`);
    let r;
    try { r = step.run(); }
    catch (e) { r = { ok: false, code: -1, out: '', err: String(e?.message || e) }; }

    const ms = Date.now() - t0;
    let verdict;
    if (r.blockedReason) verdict = BLOCKED;
    else if (r.timedOut) verdict = BLOCKED;
    else if (r.spawnError) verdict = BLOCKED;
    else verdict = r.ok ? PASS : FAIL;

    // A step may derive its verdict from its OUTPUT rather than its exit code.
    // The conformance runner exits 0 in report mode by design, so trusting the
    // exit code alone would render "FAIL 9 · 10 findings" as a green tick.
    if (verdict === PASS && step.verdictFrom) verdict = step.verdictFrom(r) ?? PASS;

    const summary = r.timedOut
      ? `TIMED OUT after ${Math.round((step.timeout || 0) / 1000)}s`
      : r.spawnError ? `could not start: ${r.spawnError}`
      : (step.parse?.(r) ?? (r.ok ? 'ok' : firstError(r)));

    results.push({ ...meta(step), verdict, summary, ms, code: r.code, raw: r });
    done.set(step.id, verdict);
  }
  return results;
}

const meta = (s) => ({
  id: s.id, tier: s.tier, repo: s.repo, name: s.name,
  softFail: !!s.softFail, advisory: !!s.advisory, critical: !!s.critical,
  artifact: s.artifact || null,
});

/* ── report ───────────────────────────────────────────────────────────────── */

const ICON = { [PASS]: '✅', [FAIL]: '❌', [BLOCKED]: '🚧', [SKIPPED]: '⏭️', [OUT_OF_SCOPE]: '⛔' };

const OUT_OF_SCOPE_TIERS = [
  ['T2', 'Journey suites', 'Do not exist yet. Playwright covers layout geometry; the backend `tests/e2e/` holds only `__init__.py`. This is §5.2 of the test brief and the highest-value outstanding item'],
  ['T4', 'Load (real pipeline)', 'Burns Jayant\'s GPU budget. The spec bounds a real run to ~20 concurrent and load-tests our layer against a stub'],
  ['T5b', 'Active security scanning', 'Requires written authorization from Jayant naming scope, environment, window and an abort signal. Not drafted. Excluded permanently until it exists'],
  ['T5c', 'Model protection / prompt injection', 'Needs the live AI service and consumes analysis budget'],
  ['T6', 'Output quality evaluation', 'Needs live APIs. `AI__BASE_URL` does not resolve, so the two spending calls answer 503'],
];

function render(fe, be, results) {
  const L = [];
  const when = new Date().toISOString().replace('T', ' ').slice(0, 16) + ' UTC';
  const t = tally(results);

  L.push(`# Release check — ${when}`);
  L.push('');
  L.push('Automated. Produced by `caspr-release-check`. **No application file was modified**;');
  L.push('every suite ran in a detached git worktree and the worktree was removed afterwards.');
  L.push('');
  L.push('| | |');
  L.push('|---|---|');
  L.push(`| Frontend | ${repoCell(fe)} |`);
  L.push(`| Backend | ${repoCell(be)} |`);
  L.push(`| Result | **${t.fail} failing** · ${t.blocked} blocked · ${t.pass} passing |`);
  L.push('');

  const dirty = [fe, be].filter((r) => r.ok && r.dirtyFiles > 0);
  if (dirty.length) {
    L.push('> **Uncommitted work was not tested.** ' +
      dirty.map((r) => `${r.label}: ${r.dirtyFiles} modified file(s)`).join(' · ') +
      '. This report describes the commit named above, not the working tree.');
    L.push('');
  }

  /* — what to fix first — */
  const fails = results.filter((r) => r.verdict === FAIL && !r.advisory);
  L.push('---');
  L.push('');
  if (fails.length) {
    L.push('## Fix first');
    L.push('');
    L.push('| | Step | What |');
    L.push('|---|---|---|');
    for (const r of fails) L.push(`| ${r.softFail ? '⚠️' : '❌'} | \`${r.id}\` ${r.name} | ${r.summary} |`);
    L.push('');
    if (fails.some((r) => r.softFail)) {
      L.push('⚠️ = conformance, **never calibrated against real source**. Treat the first run as');
      L.push('calibration data, not as findings. Rules marked `"calibration": true` cast a wide net by design.');
      L.push('');
    }
  } else {
    L.push('## Fix first');
    L.push('');
    L.push('Nothing failing. Check the blocked list below before reading that as green.');
    L.push('');
  }

  /* — full results — */
  L.push('## All steps');
  L.push('');
  L.push('| | Step | Repo | Result | Time |');
  L.push('|---|---|---|---|---|');
  for (const r of results) {
    L.push(`| ${ICON[r.verdict]} | \`${r.id}\` ${r.name} | ${r.repo} | ${r.summary} | ${fmtMs(r.ms)} |`);
  }
  L.push('');

  /* — blocked — */
  const blocked = results.filter((r) => r.verdict === BLOCKED);
  if (blocked.length) {
    L.push('## Blocked — not run, and not a pass');
    L.push('');
    L.push('A step that could not run is reported here rather than omitted. Two of this repo\'s');
    L.push('most valuable tests once failed at *import*, which read as a build error rather than');
    L.push('as lost coverage — so the coverage stayed lost.');
    L.push('');
    for (const r of blocked) L.push(`- \`${r.id}\` **${r.name}** — ${r.summary}`);
    L.push('');
  }

  /* — out of scope — */
  L.push('## Deliberately not run');
  L.push('');
  L.push('Listed so their absence is visible rather than assumed.');
  L.push('');
  L.push('| Tier | | Why |');
  L.push('|---|---|---|');
  for (const [id, name, why] of OUT_OF_SCOPE_TIERS) L.push(`| ⛔ \`${id}\` | ${name} | ${why} |`);
  L.push('');

  L.push('---');
  L.push('');
  L.push(`*Artifacts: \`${opts.out}\`. Regenerate with \`caspr-release-check\`.*`);
  L.push('');
  return L.join('\n');
}

const repoCell = (r) =>
  r.ok ? `\`${r.shortSha}\` on \`${r.branch}\` — ${r.subject || '(no subject)'}` : `**unavailable** — ${r.reason}`;

const fmtMs = (ms) => (ms < 1000 ? `${ms}ms` : ms < 60_000 ? `${(ms / 1000).toFixed(1)}s` : `${Math.round(ms / 60_000)}m`);

function tally(rs) {
  const t = { pass: 0, fail: 0, blocked: 0, skipped: 0 };
  for (const r of rs) {
    if (r.verdict === PASS) t.pass++;
    else if (r.verdict === FAIL) t.fail++;
    else if (r.verdict === BLOCKED) t.blocked++;
    else t.skipped++;
  }
  return t;
}

/* ── main ─────────────────────────────────────────────────────────────────── */

process.stderr.write('\ncaspr-release-check\n');

// Clear the artifact directory first. A log from a previous run sitting beside
// a current report is worse than no log — it reads as evidence for this run.
try { rmSync(opts.out, { recursive: true, force: true }); } catch { /* first run */ }
mkdirSync(opts.out, { recursive: true });
mkdirSync(WT_ROOT, { recursive: true });

let results = [];
let fe, be;
try {
  if (!have('git')) { console.error('git is not on PATH'); process.exit(2); }

  process.stderr.write('  preparing worktrees\n');
  fe = prepareRepo('frontend', opts.frontend);
  be = prepareRepo('backend', opts.backend);

  // Pre-flight. Nothing else runs until this passes.
  process.stderr.write('  pre-flight credential scan\n');
  const pf = preflightCredentialScan([
    { label: 'frontend', dir: fe.worktree },
    { label: 'backend', dir: be.worktree },
    { label: 'drive', dir: opts.drive },
  ]);
  if (!pf.ok) {
    const lines = [
      `# Release check — ABORTED ${stamp.slice(0, 10)}`, '',
      '**A credential is present in a tree this run would have touched, so nothing was run.**', '',
      'Testing against a tree holding a live credential copies it into a worktree, into',
      'test output, and into artifacts on cloud-replicated storage. Aborting is cheaper',
      'than any of that. `ai-credential-exposure-rules.md` R-AI-1 — the default is deny.', '',
    ];
    if (pf.blocked) lines.push(`- ${pf.reason}`);
    else {
      lines.push('| Where | Rule | Finding |', '|---|---|---|');
      for (const o of pf.offences) lines.push(`| ${o.label} | \`${o.rule}\` | ${o.text} |`);
      lines.push('', '**Values are never shown** — only the path and the shape (R-CLS-4).', '',
        'Rotate the credential first (R-RSP-3), confirm the old value fails (R-RSP-4),',
        'then remove the file and re-run. Do not delete before rotating: that destroys',
        'the evidence of what needs rotating.');
    }
    const abortPath = join(opts.drive, 'docs', 'app-handoff', `RELEASE-CHECK-ABORTED-${stamp.slice(0, 10)}.md`);
    writeRedacted(abortPath, lines.join('\n') + '\n');
    cleanupWorktrees();
    process.stderr.write(`\n  ABORTED — credential present. See ${abortPath}\n\n`);
    console.log(abortPath);
    process.exit(2);
  }

  results = execute(buildSteps(fe, be));

  // artifacts
  for (const r of results) {
    if (r.artifact && r.raw?.out) {
      try { writeRedacted(join(opts.out, r.artifact), r.raw.out); } catch { /* best effort */ }
    }
    if (r.raw && (r.verdict === FAIL || r.verdict === BLOCKED)) {
      const log = [`# ${r.id} — ${r.name}`, `exit ${r.code}`, '', '## stdout', r.raw.out || '(empty)', '', '## stderr', r.raw.err || '(empty)'].join('\n');
      try { writeRedacted(join(opts.out, `${r.id}.log`), log); } catch { /* best effort */ }
    }
    delete r.raw;
  }
} finally {
  cleanupWorktrees();
}

const md = render(fe, be, results);
const reportName = `RELEASE-CHECK-${stamp.slice(0, 10)}.md`;
const reportPath = join(opts.drive, 'docs', 'app-handoff', reportName);
writeRedacted(reportPath, md);
writeRedacted(join(opts.out, 'results.json'), JSON.stringify({
  ref: opts.ref, frontend: fe, backend: be, results, generatedAt: new Date().toISOString(),
}, null, 2));

const t = tally(results);
process.stderr.write(`\n  ${t.pass} passed · ${t.fail} failed · ${t.blocked} blocked · ${t.skipped} skipped\n`);
process.stderr.write(`  report    ${reportPath}\n`);
process.stderr.write(`  artifacts ${opts.out}\n\n`);

console.log(reportPath);
process.exit(t.fail > 0 ? 1 : 0);
