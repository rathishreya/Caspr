#!/usr/bin/env node
/**
 * Self-test for the conformance harness.
 *
 *   node conformance/selftest/run.mjs
 *
 * A conformance runner that is not itself tested is an opinion about the code.
 * The fixture under ./fixture carries one deliberate violation per detector, plus
 * two controls that must NOT fire — a legitimate `outline: none` paired with a
 * replacement ring, and a correctly-reasoned suppression.
 *
 * Three real bugs in the runner were found by exactly this fixture during
 * authoring — a trailing-`**` glob that never matched files, numeric patterns
 * that missed JSX bare numbers, and a line-window paired check that produced
 * false negatives on dense CSS. It stays because the next three will be found
 * the same way.
 *
 * Exit 0 all assertions hold · 1 one or more failed.
 */

import { execFileSync } from 'node:child_process';
import { writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const RUNNER = join(HERE, '..', 'run.mjs');
const PARITY = join(HERE, '..', 'contract-parity.mjs');
const FIXTURE = join(HERE, 'fixture');

// `shell: true` on purpose. Without it, execFileSync('npm', …) throws
// spawnSync ENOENT on Windows outside an npm lifecycle script — the exact
// defect recorded as finding 6 of TEST-HANDOVER-2026-08-25.md. Here we invoke
// process.execPath directly, which sidesteps it entirely.
function runJson(script, args) {
  const out = execFileSync(process.execPath, [script, ...args], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    maxBuffer: 32 * 1024 * 1024,
  });
  return JSON.parse(out);
}

function tryRunJson(script, args) {
  try { return runJson(script, args); }
  catch (e) {
    // a non-zero exit is expected for a fixture full of violations
    if (e.stdout) { try { return JSON.parse(e.stdout); } catch { /* fall through */ } }
    throw e;
  }
}

/* ── assertions ───────────────────────────────────────────────────────────── */

const results = [];
function check(name, fn) {
  try {
    const detail = fn();
    results.push({ name, ok: true, detail });
  } catch (e) {
    results.push({ name, ok: false, detail: e.message });
  }
}
function expect(cond, msg) { if (!cond) throw new Error(msg); return msg; }

const report = tryRunJson(RUNNER, ['--root', FIXTURE, '--tier', '1', '--format', 'json']);
const byId = Object.fromEntries(report.rules.map((r) => [r.id, r]));
const verdict = (id) => byId[id]?.verdict;
const count = (id) => byId[id]?.count ?? 0;

/* every detector fires at least once */
const MUST_FAIL = [
  ['STRUCT-01', 'forbidPath — root barrel'],
  ['STRUCT-02', 'forbidPath — trailing ** must match files, not just directories'],
  ['STRUCT-08', 'forbidPattern — fixture imported from the API client'],
  ['TRANSPORT-01', 'forbidPattern — EventSource'],
  ['SEAM-01', 'forbidPattern — res.json() as T'],
  ['SEAM-03', 'forbidPattern — fixture as a prop default'],
  ['SEAM-04', 'forbidPattern — money defaulted to zero'],
  ['SEAM-06', 'forbidPattern — paginated call with no explicit limit'],
  ['COLOR-01', 'forbidPattern — banned grey as a text fill'],
  ['RADIUS-01', 'numericScale — off-scale radius, JSX bare number'],
  ['SPACE-01', 'numericScale — off-scale padding, JSX bare number'],
  ['TYPE-01', 'forbidPattern + allowPattern — a fourth font'],
  ['FOCUS-01', 'forbidPattern — the stale 2px ring'],
  ['FOCUS-03', 'pairedInBlock — outline:none with no replacement'],
  ['FOCUS-06', 'requirePattern — no skip link'],
  ['MOTION-01', 'requirePattern — no prefers-reduced-motion'],
  ['A11Y-01', 'forbidPattern — onClick on a div'],
  ['SECRET-04', 'forbidPath — a document in the repo'],
];
for (const [id, why] of MUST_FAIL) {
  check(`${id} fires  (${why})`, () =>
    expect(verdict(id) === 'FAIL', `expected FAIL, got ${verdict(id)}`));
}

/* controls — these must NOT fire */
check('FOCUS-03 spares a legitimate outline:none with a replacement ring', () => {
  const f = byId['FOCUS-03'].findings;
  expect(f.every((x) => !/\.ok\b/.test(x.text)), `.ok was wrongly flagged: ${JSON.stringify(f)}`);
  return `${f.length} finding(s), none of them .ok`;
});

check('FOCUS-04 honours a reasoned suppression', () => {
  const s = byId['FOCUS-04'].suppressed || [];
  expect(s.length >= 1, 'the reasoned suppression was not recorded');
  expect(s.every((x) => x.valid), 'a reasoned suppression was marked invalid');
  return `${s.length} suppression(s), all with a reason`;
});

/* UNCHECKED is never a pass — the eslint 'e2e/**' bug */
check('a rule whose globs match nothing reports UNCHECKED, not PASS', () => {
  const u = report.rules.filter((r) => r.verdict === 'UNCHECKED' && /matched no files/.test(r.why || ''));
  expect(u.length >= 1, 'no rule reported UNCHECKED for an empty glob scope');
  return `${u.length} rule(s) correctly UNCHECKED`;
});

check('non-static rules are declared UNCHECKED rather than omitted', () => {
  const u = report.rules.filter((r) => r.verdict === 'UNCHECKED' && /not runnable in this ring/.test(r.why || ''));
  expect(u.length >= 5, `expected deferred rules to be visible, saw ${u.length}`);
  return `${u.length} deferred rule(s) visible in the report`;
});

/* contract parity reproduces the $NaN bug */
check('contract-parity catches the $NaN casing bug as CRITICAL', () => {
  const p = tryRunJson(PARITY, [
    '--openapi', join(HERE, 'parity', 'openapi.json'),
    '--contract', join(HERE, 'parity', 'contract'),
    '--format', 'json',
  ]);
  const crit = p.findings.filter((f) => f.severity === 'critical' && f.axis === 'casing');
  expect(crit.length >= 1, 'no critical casing finding');
  expect(crit.some((f) => f.field === 'spendableCents'),
    `spendableCents not flagged; got ${crit.map((f) => f.field).join(', ')}`);
  return `${crit.length} critical casing finding(s), incl. spendableCents`;
});

check('contract-parity reports unpaired types rather than passing them', () => {
  const p = tryRunJson(PARITY, [
    '--openapi', join(HERE, 'parity', 'openapi.json'),
    '--contract', join(HERE, 'parity', 'contract'),
    '--format', 'json',
  ]);
  return `${p.unpaired.length} unpaired type(s) reported`;
});

/* ── CRED family — fixtures generated at runtime, never committed ─────────── */
/*
 * A test fixture for a secret scanner must not itself be a credential-shaped
 * file sitting in the tree — it would trip CRED-01 and CRED-03 on every run and
 * teach everyone to ignore them. So these are written to a temp directory,
 * asserted against, and deleted.
 *
 * The AWS key below is `AKIAIOSFODNN7EXAMPLE`, the example value AWS publishes
 * in its own documentation. It is in every scanner's allowlist and grants
 * nothing. Nothing here is a real credential, and nothing here is a *realistic*
 * fake either — R-SHR-2 forbids inventing plausible ones.
 */

const CRED_DIR = join(tmpdir(), 'caspr-conformance-credtest');

function writeCredFixture() {
  rmSync(CRED_DIR, { recursive: true, force: true });
  mkdirSync(join(CRED_DIR, '.claude'), { recursive: true });

  // CRED-03: a credential shape inside an agent config file
  writeFileSync(join(CRED_DIR, 'CLAUDE.md'),
    ['# Project', '', 'Use the key AKIA' + 'IOSFODNN7EXAMPLE for the bucket.', ''].join('\n'));

  // CRED-04: zero-width joiner + a right-to-left override, the Rules File Backdoor channel
  writeFileSync(join(CRED_DIR, 'AGENTS.md'),
    '# Agents\n\nNormal line.\nHidden​instruction here.\nAnd ‮reversed‬ text.\n');

  // CRED-05: a Cyrillic "а" (U+0430) inside an otherwise-Latin token.
  // Renders identically to Latin "a". No non-printing filter will ever see it.
  writeFileSync(join(CRED_DIR, '.claude', 'notes.md'),
    '# Notes\n\nDeploy to the cаspr-api service.\n');

  // CRED-01: a credential FILE present in the tree
  writeFileSync(join(CRED_DIR, '.env'), 'DATABASE_URL=postgresql://u:p@h/db\n');
  // control — .env.example must NOT be flagged
  writeFileSync(join(CRED_DIR, '.env.example'), 'DATABASE_URL=CASPR_DUMMY_DSN_postgres\n');

  // CRED-15: the Ahrefs_Key.txt shape — a bare opaque token alone in a small
  // file. No credential prefix, no credential-shaped filename. Neither the path
  // rule nor the content-shape rule sees it; only the file-shape rule does.
  writeFileSync(join(CRED_DIR, 'Some_Key.txt'), 'a7Fq2LmXo9Rt4Wz1Bd6Yh3Kn8Pv5Cs0Ej\n');
  // control — ordinary short prose must NOT be flagged
  writeFileSync(join(CRED_DIR, 'note.txt'), 'remember\n');

  return CRED_DIR;
}

let credReport = null;
try {
  const dir = writeCredFixture();
  credReport = tryRunJson(RUNNER, ['--root', dir, '--tier', '1', '--family', 'CRED', '--format', 'json']);
} catch (e) {
  credReport = { error: String(e?.message || e) };
}

const credById = credReport?.rules
  ? Object.fromEntries(credReport.rules.map((r) => [r.id, r]))
  : {};

check('CRED-01 flags a .env in the tree', () =>
  expect(credById['CRED-01']?.verdict === 'FAIL',
    `expected FAIL, got ${credById['CRED-01']?.verdict}`));

check('CRED-01 spares .env.example (placeholders are Tier 3)', () => {
  const f = credById['CRED-01']?.findings || [];
  expect(!f.some((x) => /\.env\.example/.test(x.file)), '.env.example was wrongly flagged');
  return `${f.length} finding(s), none of them .env.example`;
});

check('CRED-03 flags a credential shape in an agent config file', () =>
  expect(credById['CRED-03']?.verdict === 'FAIL',
    `expected FAIL, got ${credById['CRED-03']?.verdict}`));

check('CRED-04 flags zero-width and bidi controls', () => {
  const r = credById['CRED-04'];
  expect(r?.verdict === 'FAIL', `expected FAIL, got ${r?.verdict}`);
  return `${r.count} finding(s)`;
});

check('CRED-05 catches a Cyrillic confusable inside a Latin token', () => {
  const r = credById['CRED-05'];
  expect(r?.verdict === 'FAIL', `expected FAIL, got ${r?.verdict}`);
  expect((r.findings || []).some((f) => /Cyrillic/.test(f.text)),
    `no Cyrillic mix reported; got ${JSON.stringify(r.findings)}`);
  return r.findings[0].text.slice(0, 70);
});

check('CRED-05 does not fire on ordinary single-script prose', () => {
  const f = credById['CRED-05']?.findings || [];
  expect(f.length <= 2, `too many hits (${f.length}) — the confusable check is over-firing`);
  return `${f.length} finding(s) across the fixture`;
});

check('CRED-15 catches a bare opaque token alone in a small file', () => {
  const r = credById['CRED-15'];
  expect(r?.verdict === 'FAIL', `expected FAIL, got ${r?.verdict}`);
  expect((r.findings || []).some((f) => /Some_Key\.txt/.test(f.file)),
    `Some_Key.txt not flagged; got ${JSON.stringify(r.findings)}`);
  return `${r.count} finding(s)`;
});

check('CRED-15 never prints the token it found (R-CLS-4)', () => {
  const r = credById['CRED-15'];
  const leaked = (r.findings || []).filter((f) => /a7Fq2LmXo9Rt/.test(f.text));
  expect(leaked.length === 0, 'the runner echoed the token it was reporting');
  return 'reports length and path only';
});

check('CRED-15 spares ordinary short prose', () => {
  const f = credById['CRED-15']?.findings || [];
  expect(!f.some((x) => /note\.txt/.test(x.file)), 'note.txt was wrongly flagged');
  return 'prose not flagged';
});

/* ── exceptions — the three states that must behave differently ───────────── */

function credWithExceptions(exc) {
  const f = join(CRED_DIR, '_exceptions.json');
  writeFileSync(f, JSON.stringify({ exceptions: exc }));
  const r = tryRunJson(RUNNER, ['--root', CRED_DIR, '--only', 'CRED-15', '--exceptions', f, '--format', 'json']);
  return r.rules.find((x) => x.id === 'CRED-15');
}

check('a live dated exception excuses the finding', () => {
  const r = credWithExceptions([{
    rule: 'CRED-15', path: 'Some_Key.txt', reason: 'test', owner: 'joy@caspr.ai',
    approved: '2026-08-25', expires: '2099-01-01',
  }]);
  expect(r.verdict === 'PASS', `expected PASS, got ${r.verdict}`);
  return 'excused, and recorded as deferred rather than fixed';
});

check('an EXPIRED exception fails again, naming the owner', () => {
  const r = credWithExceptions([{
    rule: 'CRED-15', path: 'Some_Key.txt', reason: 'test', owner: 'joy@caspr.ai',
    approved: '2026-01-01', expires: '2026-02-01',
  }]);
  expect(r.verdict === 'FAIL', `expected FAIL, got ${r.verdict}`);
  expect(r.findings.some((f) => /EXCEPTION EXPIRED/.test(f.text)), 'expiry not reported');
  expect(r.findings.some((f) => /joy@caspr\.ai/.test(f.text)), 'owner not named');
  return 'an exception that outlives its justification is a rule quietly deleted';
});

check('an exception with NO expiry is not honoured (R-VER-3)', () => {
  const r = credWithExceptions([{
    rule: 'CRED-15', path: 'Some_Key.txt', reason: 'test', owner: 'joy@caspr.ai', approved: '2026-08-25',
  }]);
  expect(r.verdict === 'FAIL', `expected FAIL, got ${r.verdict}`);
  expect(r.findings.some((f) => /NO EXPIRY/.test(f.text)), 'undated exception was silently honoured');
  return 'undated exceptions are refused, not obeyed';
});

check('an exception for a DIFFERENT path does not excuse this finding', () => {
  const r = credWithExceptions([{
    rule: 'CRED-15', path: 'some/other/file.txt', reason: 'test', owner: 'joy@caspr.ai',
    approved: '2026-08-25', expires: '2099-01-01',
  }]);
  expect(r.verdict === 'FAIL', `a path-scoped exception leaked to another file (got ${r.verdict})`);
  return 'exceptions are scoped to their path';
});

try { rmSync(CRED_DIR, { recursive: true, force: true }); } catch { /* best effort */ }

/* ── output ───────────────────────────────────────────────────────────────── */

console.log('\nconformance self-test\n');
let failed = 0;
for (const r of results) {
  if (!r.ok) failed++;
  console.log(`  ${r.ok ? '✓' : '✗'} ${r.name}`);
  if (!r.ok) console.log(`      ${r.detail}`);
}
console.log(`\n  ${results.length - failed}/${results.length} passed\n`);
process.exit(failed ? 1 : 0);
