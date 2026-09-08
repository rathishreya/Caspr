#!/usr/bin/env node
/**
 * Caspr conventions conformance runner.
 *
 * Zero dependencies, Node 20+. It must be able to run before `npm ci` has
 * succeeded, and it must never be the reason the dependency tree breaks.
 *
 * Rules:      ./rules.json   (config — generated from the Drive spec, never hand-edited)
 * Spec:       G:\My Drive\Caspr\caspr-claude-core\docs\app-handoff\CONVENTIONS-CONFORMANCE-SPEC.md
 * Baseline:   ./baseline.json (the ratchet — counts may shrink, never grow)
 *
 * Usage
 *   node conformance/run.mjs [options]
 *
 *     --root <dir>        repo root to scan          (default: cwd)
 *     --rules <file>      rule register              (default: conformance/rules.json)
 *     --baseline <file>   ratchet file               (default: conformance/baseline.json)
 *     --exceptions <file> dated exception register  (default: conformance/exceptions.json)
 *     --tier <1|2|all>    which tier to enforce      (default: 1)
 *     --mode <report|ratchet|strict>                 (default: report)
 *     --write-baseline    rewrite the baseline from this run and exit 0
 *     --format <text|md|json|sarif>  repeatable      (default: text)
 *     --out <file>        write the last --format to a file instead of stdout
 *     --only <ID,ID>      run just these rule ids
 *     --family <NAME>     run just this family
 *
 * Exit codes
 *   0  conformant for the selected mode
 *   1  Tier-1 violations beyond what the mode permits
 *   2  runner error (bad rules file, unreadable root)
 *
 * Verdicts — four, not two. UNCHECKED is never collapsed into PASS.
 *   PASS       checked, conformant
 *   FAIL       checked, violated
 *   ABSENT     the surface does not exist yet (an unbuilt export pipeline
 *              cannot violate an export rule)
 *   UNCHECKED  the check could not run — most often because its include globs
 *              matched no files, which is the `'e2e/**'` bug that let a lint
 *              rule pass for weeks without ever matching anything
 */

import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));

/* ── verdicts ─────────────────────────────────────────────────────────────── */

const PASS = 'PASS';
const FAIL = 'FAIL';
const ABSENT = 'ABSENT';
const UNCHECKED = 'UNCHECKED';

/* ── argv ─────────────────────────────────────────────────────────────────── */

function parseArgs(argv) {
  const o = {
    root: process.cwd(),
    rules: join(HERE, 'rules.json'),
    baseline: join(HERE, 'baseline.json'),
    exceptions: join(HERE, 'exceptions.json'),
    tier: '1',
    mode: 'report',
    writeBaseline: false,
    formats: [],
    out: null,
    only: null,
    family: null,
  };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    const next = () => argv[++i];
    if (a === '--root') o.root = next();
    else if (a === '--rules') o.rules = next();
    else if (a === '--baseline') o.baseline = next();
    else if (a === '--exceptions') o.exceptions = next();
    else if (a === '--tier') o.tier = next();
    else if (a === '--mode') o.mode = next();
    else if (a === '--write-baseline') o.writeBaseline = true;
    else if (a === '--format') o.formats.push(next());
    else if (a === '--out') o.out = next();
    else if (a === '--only') o.only = next().split(',').map((s) => s.trim());
    else if (a === '--family') o.family = next();
    else if (a === '--help' || a === '-h') { console.log(HELP); process.exit(0); }
    else { console.error(`unknown option: ${a}`); process.exit(2); }
  }
  if (o.formats.length === 0) o.formats = ['text'];
  return o;
}

const HELP = readFileSync(fileURLToPath(import.meta.url), 'utf8')
  .split('\n')
  .filter((l) => l.startsWith(' *'))
  .map((l) => l.replace(/^ \*ends?/, '').replace(/^ \* ?/, ''))
  .join('\n');

/* ── a small glob matcher (no dependencies) ───────────────────────────────── */
/* Supports ** , * , ? and {a,b}. Paths are POSIX-normalised before matching so
   the same rule file works on Windows and Linux — the `lazy.bundle.test.ts`
   lesson: a check that behaves differently per platform is worse than no check. */

function globToRegExp(glob) {
  let re = '';
  for (let i = 0; i < glob.length; i++) {
    const c = glob[i];
    if (c === '*') {
      if (glob[i + 1] === '*') {
        // ** — spans directory separators
        i++;
        if (glob[i + 1] === '/') {
          i++;
          re += '(?:.*/)?';          // **/ — zero or more leading segments
        } else {
          re += '.*';                // trailing ** — everything below, files included
        }
      } else {
        re += '[^/]*';
      }
    } else if (c === '?') re += '[^/]';
    else if (c === '{') {
      const close = glob.indexOf('}', i);
      if (close === -1) { re += '\\{'; continue; }
      const alts = glob.slice(i + 1, close).split(',');
      re += `(?:${alts.map(escapeRe).join('|')})`;
      i = close;
    } else re += escapeRe(c);
  }
  return new RegExp(`^${re}$`);
}

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function matchesAny(path, globs) {
  if (!globs || globs.length === 0) return false;
  return globs.some((g) => globToRegExp(g).test(path));
}

/* ── file walk ────────────────────────────────────────────────────────────── */

const ALWAYS_SKIP = new Set([
  'node_modules', '.git', 'dist', 'build', 'coverage', '.next', '.turbo',
  '.venv', 'venv', '__pycache__', '.pytest_cache', '.mypy_cache', '.ruff_cache',
  'playwright-report', 'test-results', '.vite', '.cache',
]);

const TEXT_EXT = new Set([
  '.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.py', '.css', '.scss',
  '.html', '.json', '.yml', '.yaml', '.toml', '.md', '.sql', '.sh', '.env',
  // Credential-bearing formats. `.txt` is here because it was missing, and
  // `Ahrefs_Key.txt` was therefore never walked at all — the credential rules
  // reported PASS on a folder that had a live API key at its root.
  '.txt', '.cfg', '.ini', '.conf', '.properties', '.pem', '.key', '.p12',
  '.pfx', '.tfstate', '.tfvars', '.xml', '.csv',
]);

function walk(root) {
  const out = [];
  const stack = [root];
  while (stack.length) {
    const dir = stack.pop();
    let entries;
    try { entries = readdirSync(dir, { withFileTypes: true }); }
    catch { continue; }
    for (const e of entries) {
      const full = join(dir, e.name);
      if (e.isDirectory()) {
        if (ALWAYS_SKIP.has(e.name)) continue;
        stack.push(full);
      } else if (e.isFile()) {
        const dot = e.name.lastIndexOf('.');
        const ext = dot === -1 ? '' : e.name.slice(dot);
        let size = 0;
        try { size = statSync(full).size; } catch { continue; }
        // Extensionless small files are walked too: `credentials`, `kubeconfig`
        // and `id_ed25519` all carry no extension, and all three are named
        // explicitly in R-CTX-2's required exclusion list.
        const extensionlessCandidate = ext === '' && size <= 65_536;
        if (!TEXT_EXT.has(ext) && !e.name.startsWith('.env') && !extensionlessCandidate) continue;
        if (size > 2_000_000) continue; // a 2MB source file is not source
        out.push(posix(relative(root, full)));
      }
    }
  }
  return out.sort();
}

const posix = (p) => p.split(sep).join('/');

/* ── suppression ──────────────────────────────────────────────────────────── */
/* A bare ignore is itself a failure: a reason and an owner are required.
     // conformance-ignore COLOR-01 -- dark card; #e8453c passes here. joy 2026-08-25 */

const SUPPRESS_RE = /conformance-ignore\s+([A-Z][A-Z0-9-]*)\s*(--\s*(.*))?/;

function suppressionFor(lines, lineIdx, ruleId) {
  for (const idx of [lineIdx, lineIdx - 1]) {
    if (idx < 0 || idx >= lines.length) continue;
    const m = SUPPRESS_RE.exec(lines[idx]);
    if (!m) continue;
    if (m[1] !== ruleId) continue;
    const reason = (m[3] || '').trim();
    return { valid: reason.length >= 8, reason, line: idx + 1 };
  }
  return null;
}

/* ── detectors ────────────────────────────────────────────────────────────── */

function selectFiles(files, detect) {
  const inc = detect.include || ['**/*'];
  const exc = detect.exclude || [];
  return files.filter((f) => matchesAny(f, inc) && !matchesAny(f, exc));
}

function readLines(root, f) {
  try { return readFileSync(join(root, f), 'utf8').split(/\r?\n/); }
  catch { return null; }
}

/** Regex must not appear. */
function forbidPattern(ctx, rule) {
  const { root, files } = ctx;
  const d = rule.detect;
  const scope = selectFiles(files, d);
  if (scope.length === 0) return unchecked(rule, 'include globs matched no files');
  const re = new RegExp(d.pattern, d.flags || '');
  const allow = d.allowPattern ? new RegExp(d.allowPattern, d.flags || '') : null;
  const findings = [];
  const suppressed = [];
  for (const f of scope) {
    const lines = readLines(root, f);
    if (!lines) continue;
    for (let i = 0; i < lines.length; i++) {
      re.lastIndex = 0;
      if (!re.test(lines[i])) continue;
      if (allow && allow.test(lines[i])) continue;
      const sup = suppressionFor(lines, i, rule.id);
      if (sup) { suppressed.push({ file: f, line: i + 1, ...sup }); continue; }
      findings.push({ file: f, line: i + 1, text: lines[i].trim().slice(0, 200) });
    }
  }
  return { verdict: findings.length ? FAIL : PASS, findings, suppressed, scanned: scope.length };
}

/** Regex must appear at least `min` times across the scope. */
function requirePattern(ctx, rule) {
  const { root, files } = ctx;
  const d = rule.detect;
  const scope = selectFiles(files, d);
  if (scope.length === 0) return unchecked(rule, 'include globs matched no files');
  const re = new RegExp(d.pattern, d.flags || '');
  let hits = 0;
  const where = [];
  for (const f of scope) {
    const lines = readLines(root, f);
    if (!lines) continue;
    for (let i = 0; i < lines.length; i++) {
      re.lastIndex = 0;
      if (re.test(lines[i])) { hits++; where.push({ file: f, line: i + 1 }); }
    }
  }
  const min = d.min ?? 1;
  if (hits >= min) return { verdict: PASS, findings: [], suppressed: [], scanned: scope.length };
  return {
    verdict: d.absentIfMissing ? ABSENT : FAIL,
    findings: [{ file: '(scope)', line: 0, text: `expected ≥${min} occurrence(s) of /${d.pattern}/, found ${hits}` }],
    suppressed: [], scanned: scope.length, sample: where.slice(0, 3),
  };
}

/** A path matching these globs must not exist. */
function forbidPath(ctx, rule) {
  const d = rule.detect;
  const hits = ctx.files.filter((f) => matchesAny(f, d.include || []));
  return {
    verdict: hits.length ? FAIL : PASS,
    findings: hits.map((f) => ({ file: f, line: 0, text: 'path must not exist' })),
    suppressed: [], scanned: ctx.files.length,
  };
}

/** At least one path matching these globs must exist. */
function requirePath(ctx, rule) {
  const d = rule.detect;
  const hits = ctx.files.filter((f) => matchesAny(f, d.include || []));
  if (hits.length) return { verdict: PASS, findings: [], suppressed: [], scanned: ctx.files.length };
  return {
    verdict: d.absentIfMissing ? ABSENT : FAIL,
    findings: [{ file: '(repo)', line: 0, text: `no path matched ${JSON.stringify(d.include)}` }],
    suppressed: [], scanned: ctx.files.length,
  };
}

/**
 * Extract a numeric capture group and assert it is on an allowed scale.
 * This is how RADIUS-01 and SPACE-01 are checked: the design system says
 * radius is 0/2/12/20 and spacing is 4/8/12/16/20/24/32/48/64 and *nothing else*,
 * so any other literal is the finding.
 */
function numericScale(ctx, rule) {
  const { root, files } = ctx;
  const d = rule.detect;
  const scope = selectFiles(files, d);
  if (scope.length === 0) return unchecked(rule, 'include globs matched no files');
  const re = new RegExp(d.pattern, d.flags && d.flags.includes('g') ? d.flags : (d.flags || '') + 'g');
  const allowed = new Set((d.allowed || []).map(Number));
  const ignoreValues = new Set((d.ignoreValues || []).map(Number));
  const findings = [];
  const suppressed = [];
  for (const f of scope) {
    const lines = readLines(root, f);
    if (!lines) continue;
    for (let i = 0; i < lines.length; i++) {
      re.lastIndex = 0;
      let m;
      while ((m = re.exec(lines[i])) !== null) {
        const raw = m[1];
        if (raw === undefined) continue;
        const v = Number(raw);
        if (Number.isNaN(v)) continue;
        if (allowed.has(v) || ignoreValues.has(v)) continue;
        const sup = suppressionFor(lines, i, rule.id);
        if (sup) { suppressed.push({ file: f, line: i + 1, ...sup }); continue; }
        findings.push({ file: f, line: i + 1, text: `${v} is off-scale — allowed: ${[...allowed].join(' · ')}` });
      }
    }
  }
  return { verdict: findings.length ? FAIL : PASS, findings, suppressed, scanned: scope.length };
}

/**
 * Return the innermost {...} block containing `pos`, or null.
 *
 * FOCUS-03 says `outline: none` is acceptable "only where a custom ring is
 * drawn in the same rule". A line window gets that wrong in dense CSS — an
 * `outline-offset` belonging to a *different* selector four lines up will
 * satisfy it. The block is the unit the spec actually names, so that is the
 * unit checked; the line window survives only as a fallback for files with no
 * braces at all.
 */
function enclosingBlock(text, pos) {
  let depth = 0, start = -1;
  for (let i = pos; i >= 0; i--) {
    const c = text[i];
    if (c === '}') depth++;
    else if (c === '{') { if (depth === 0) { start = i; break; } depth--; }
  }
  if (start === -1) return null;
  depth = 0;
  let end = text.length - 1;
  for (let i = start + 1; i < text.length; i++) {
    const c = text[i];
    if (c === '{') depth++;
    else if (c === '}') { if (depth === 0) { end = i; break; } depth--; }
  }
  return text.slice(start, end + 1);
}

/** `pattern` is only legal when `requires` appears in the same block. */
function pairedInBlock(ctx, rule) {
  const { root, files } = ctx;
  const d = rule.detect;
  const scope = selectFiles(files, d);
  if (scope.length === 0) return unchecked(rule, 'include globs matched no files');
  const re = new RegExp(d.pattern, d.flags || '');
  const req = new RegExp(d.requires, d.flags || '');
  const win = d.window ?? 6;
  const findings = [];
  const suppressed = [];
  for (const f of scope) {
    const lines = readLines(root, f);
    if (!lines) continue;
    const text = lines.join('\n');
    // line index → character offset, computed once per file
    const offsets = [];
    let acc = 0;
    for (const l of lines) { offsets.push(acc); acc += l.length + 1; }

    for (let i = 0; i < lines.length; i++) {
      re.lastIndex = 0;
      const m = re.exec(lines[i]);
      if (!m) continue;

      // Anchor on the match, not the line start — a line start sits *before*
      // its own opening brace, so scanning back from it balances the whole
      // file out to nothing and finds no block at all.
      const block = enclosingBlock(text, offsets[i] + m.index);
      let scopeText, scopeName;
      if (block) { scopeText = block; scopeName = 'the same block'; }
      else {
        const from = Math.max(0, i - win);
        const to = Math.min(lines.length, i + win + 1);
        scopeText = lines.slice(from, to).join('\n');
        scopeName = `${win} lines`;
      }
      req.lastIndex = 0;
      if (req.test(scopeText)) continue;

      const sup = suppressionFor(lines, i, rule.id);
      if (sup) { suppressed.push({ file: f, line: i + 1, ...sup }); continue; }
      findings.push({ file: f, line: i + 1, text: `${lines[i].trim().slice(0, 120)} — no /${d.requires}/ in ${scopeName}` });
    }
  }
  return { verdict: findings.length ? FAIL : PASS, findings, suppressed, scanned: scope.length };
}

/** Cap on a numeric property of files, e.g. line count. */
function fileMetric(ctx, rule) {
  const { root, files } = ctx;
  const d = rule.detect;
  const scope = selectFiles(files, d);
  if (scope.length === 0) return unchecked(rule, 'include globs matched no files');
  const findings = [];
  for (const f of scope) {
    const lines = readLines(root, f);
    if (!lines) continue;
    const n = lines.length;
    if (d.maxLines != null && n > d.maxLines) {
      findings.push({ file: f, line: 0, text: `${n} lines > ${d.maxLines}` });
    }
  }
  findings.sort((a, b) => parseInt(b.text) - parseInt(a.text));
  return { verdict: findings.length ? FAIL : PASS, findings, suppressed: [], scanned: scope.length };
}

/**
 * Every pattern in `patterns` must appear somewhere in the scope.
 * For R-CTX-2, where a .gitignore has to carry nine specific exclusions and
 * naming one rule per pattern would bury the register.
 */
function requireAll(ctx, rule) {
  const { root, files } = ctx;
  const d = rule.detect;
  const scope = selectFiles(files, d);
  if (scope.length === 0) {
    return d.absentIfMissing
      ? { verdict: ABSENT, findings: [], suppressed: [], scanned: 0, why: 'no file in scope' }
      : unchecked(rule, 'include globs matched no files');
  }
  const text = scope.map((f) => (readLines(root, f) || []).join('\n')).join('\n');
  const missing = (d.patterns || []).filter((p) => !new RegExp(p, d.flags || '').test(text));
  return {
    verdict: missing.length ? FAIL : PASS,
    findings: missing.map((p) => ({ file: scope[0], line: 0, text: `missing required entry: ${p}` })),
    suppressed: [], scanned: scope.length,
  };
}

/**
 * Mixed-script confusables — R-CTX-7 / R-VER-1.
 *
 * The standard is explicit that this needs its own check: confusables are
 * ordinary printable characters, so no zero-width or non-printing filter will
 * ever flag them. A Cyrillic `а` inside an otherwise-Latin identifier renders
 * identically to a Latin `a` and is invisible to a human reviewer.
 *
 * Detection is per TOKEN, not per line: a document may legitimately discuss
 * Greek and Latin in the same sentence. The attack is a single word drawing on
 * two scripts at once.
 */
const SCRIPTS = [
  ['Latin', /[A-Za-z]/],
  ['Cyrillic', /[Ѐ-ӿ]/],
  ['Greek', /[Ͱ-Ͽ]/],
  ['Armenian', /[԰-֏]/],
];

function scriptsIn(token) {
  const found = [];
  for (const [name, re] of SCRIPTS) if (re.test(token)) found.push(name);
  return found;
}

function mixedScript(ctx, rule) {
  const { root, files } = ctx;
  const d = rule.detect;
  const scope = selectFiles(files, d);
  if (scope.length === 0) return unchecked(rule, 'include globs matched no files');
  const findings = [];
  const suppressed = [];
  // a token is a run of letters/digits/_/-/. — i.e. an identifier, host or path segment
  const TOKEN = /[\p{L}\p{N}_.-]{2,}/gu;
  for (const f of scope) {
    const lines = readLines(root, f);
    if (!lines) continue;
    for (let i = 0; i < lines.length; i++) {
      TOKEN.lastIndex = 0;
      let m;
      while ((m = TOKEN.exec(lines[i])) !== null) {
        const scripts = scriptsIn(m[0]);
        if (scripts.length < 2) continue;
        const sup = suppressionFor(lines, i, rule.id);
        if (sup) { suppressed.push({ file: f, line: i + 1, ...sup }); continue; }
        findings.push({
          file: f, line: i + 1,
          // the token itself is printed: it is the finding, and a reviewer
          // cannot act on "there is a confusable somewhere on this line"
          text: `token mixes ${scripts.join(' + ')} — "${m[0]}" (renders as Latin, is not)`,
        });
      }
    }
  }
  return { verdict: findings.length ? FAIL : PASS, findings, suppressed, scanned: scope.length };
}

/**
 * A small file whose entire content is one opaque high-entropy token.
 *
 * This exists because the first version of CRED-01 missed the actual finding.
 * `Ahrefs_Key.txt` is 40 bytes at a folder root: the name does not match
 * `*.key`, `*.pem` or `.env`, and the content carries no recognisable prefix
 * like `sk-` or `AKIA`, so neither the path rule nor the shape rule saw it.
 *
 * What it *is* — a tiny file containing a single structureless token and
 * nothing else — is the strongest available signal, and it is close to
 * unambiguous: real prose has spaces, real config has separators, real code has
 * syntax. A bare 20+ character token alone in a file is a credential almost
 * every time.
 *
 * Reports the path and the byte count. Never the content. (R-CLS-4: partial
 * disclosure is full disclosure, so the runner must not echo even a prefix.)
 */
function opaqueSecretFile(ctx, rule) {
  const { root, files } = ctx;
  const d = rule.detect;
  const scope = selectFiles(files, d);
  if (scope.length === 0) return unchecked(rule, 'include globs matched no files');
  const maxBytes = d.maxBytes ?? 512;
  const minLen = d.minTokenLength ?? 20;
  const TOKEN_ONLY = new RegExp(`^[A-Za-z0-9_\\-+=/.]{${minLen},}$`);
  const findings = [];
  const suppressed = [];

  for (const f of scope) {
    let raw;
    try {
      const stat = statSync(join(root, f));
      if (stat.size > maxBytes || stat.size < minLen) continue;
      raw = readFileSync(join(root, f), 'utf8');
    } catch { continue; }

    const lines = raw.split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (lines.length !== 1) continue;
    const tok = lines[0].trim();
    // A `KEY=VALUE` line is config, not a bare token. `.env.example` holding
    // `DATABASE_URL=CASPR_DUMMY_DSN_postgres` is a correct placeholder and must
    // not be reported — flagging it would train people to ignore this rule.
    if (tok.includes('=') || tok.includes(':')) continue;
    if (/CASPR_DUMMY_/.test(tok)) continue;
    if (!TOKEN_ONLY.test(tok)) continue;
    // a single long word of ordinary letters is prose, not a token
    if (/^[A-Za-z.]+$/.test(tok)) continue;

    const sup = suppressionFor(raw.split(/\r?\n/), 0, rule.id);
    if (sup) { suppressed.push({ file: f, line: 1, ...sup }); continue; }
    findings.push({
      file: f, line: 1,
      text: `${tok.length}-character opaque token, alone in a ${raw.length}-byte file — content deliberately not shown`,
    });
  }
  return { verdict: findings.length ? FAIL : PASS, findings, suppressed, scanned: scope.length };
}

function unchecked(rule, why) {
  return { verdict: UNCHECKED, findings: [], suppressed: [], scanned: 0, why };
}

const DETECTORS = {
  forbidPattern, requirePattern, forbidPath, requirePath,
  numericScale, pairedInBlock, fileMetric, requireAll, mixedScript, opaqueSecretFile,
};

/* ── run ──────────────────────────────────────────────────────────────────── */

function run(opts) {
  if (!existsSync(opts.root)) { console.error(`root not found: ${opts.root}`); process.exit(2); }
  if (!existsSync(opts.rules)) { console.error(`rules not found: ${opts.rules}`); process.exit(2); }

  let register;
  try { register = JSON.parse(readFileSync(opts.rules, 'utf8')); }
  catch (e) { console.error(`rules.json is not valid JSON: ${e.message}`); process.exit(2); }

  const files = walk(opts.root);
  const ctx = { root: opts.root, files };

  let rules = register.rules;
  if (opts.only) rules = rules.filter((r) => opts.only.includes(r.id));
  if (opts.family) rules = rules.filter((r) => r.family === opts.family);
  if (opts.tier !== 'all') rules = rules.filter((r) => String(r.tier) === String(opts.tier));

  // Only `static` rules execute here. runtime/build/repo/manual rules are
  // declared so they appear in the report as UNCHECKED with a reason, rather
  // than silently vanishing — which is how coverage gets lost.
  const results = [];
  for (const rule of rules) {
    if (rule.check !== 'static') {
      results.push({ rule, verdict: UNCHECKED, findings: [], suppressed: [], scanned: 0,
        why: `check kind "${rule.check}" — not runnable in this ring` });
      continue;
    }
    const fn = DETECTORS[rule.detect?.kind];
    if (!fn) {
      results.push({ rule, verdict: UNCHECKED, findings: [], suppressed: [], scanned: 0,
        why: `no detector for kind "${rule.detect?.kind}"` });
      continue;
    }
    let r;
    try { r = fn(ctx, rule); }
    catch (e) { r = { verdict: UNCHECKED, findings: [], suppressed: [], scanned: 0, why: `detector threw: ${e.message}` }; }
    results.push({ rule, ...r });
  }

  return { register, results, fileCount: files.length };
}

/* ── exceptions ───────────────────────────────────────────────────────────── */
/*
 * A documented, dated, owned exception — R-VER-3: "a static key requires a
 * documented exception with an expiry date."
 *
 * Three properties, and each one is load-bearing:
 *
 *   - It is a FILE, not an inline comment. The CRED findings are about a file's
 *     existence, and an inline suppression cannot express that — worse, adding a
 *     comment line to a single-token file makes it multi-line and CRED-15 stops
 *     firing altogether. A silent hole is the opposite of an exception.
 *   - It EXPIRES. An exception with no end date is a rule that was quietly
 *     deleted. On expiry the finding returns as a FAIL, loudly.
 *   - It is COUNTED. Every report shows the live exceptions and the days left,
 *     so deferral stays visible rather than becoming the new normal.
 */
function loadExceptions(path) {
  if (!existsSync(path)) return [];
  try {
    const raw = JSON.parse(readFileSync(path, 'utf8'));
    return Array.isArray(raw.exceptions) ? raw.exceptions : [];
  } catch { return []; }
}

function applyExceptions(results, exceptions, today) {
  if (!exceptions.length) return results;
  const now = today ? new Date(today) : new Date();

  return results.map((r) => {
    if (r.verdict !== FAIL) return r;
    const forRule = exceptions.filter((e) => e.rule === r.rule.id);
    if (!forRule.length) return r;

    const kept = [];
    const excused = [];
    const expired = [];

    for (const f of r.findings) {
      const e = forRule.find((x) => !x.path || f.file === x.path || f.file.endsWith('/' + x.path));
      if (!e) { kept.push(f); continue; }
      if (!e.expires) {
        kept.push({ ...f, text: `${f.text} — exception has NO EXPIRY and is not honoured (R-VER-3)` });
        continue;
      }
      const days = Math.ceil((new Date(e.expires) - now) / 86_400_000);
      if (days < 0) {
        expired.push({ ...f, text: `${f.text} — EXCEPTION EXPIRED ${e.expires} (${-days}d ago), owner ${e.owner || 'unnamed'}` });
      } else {
        excused.push({ ...f, expires: e.expires, daysLeft: days, owner: e.owner, reason: e.reason });
      }
    }

    const findings = [...kept, ...expired];
    return {
      ...r,
      findings,
      excused,
      verdict: findings.length ? FAIL : PASS,
      exceptionNote: excused.length
        ? `${excused.length} excused · expires ${excused[0].expires} (${excused[0].daysLeft}d) · ${excused[0].owner || 'unowned'}`
        : undefined,
    };
  });
}

/* ── ratchet ──────────────────────────────────────────────────────────────── */

function loadBaseline(path) {
  if (!existsSync(path)) return null;
  try { return JSON.parse(readFileSync(path, 'utf8')); }
  catch { return null; }
}

function applyRatchet(results, baseline) {
  const base = baseline?.counts || {};
  return results.map((r) => {
    const count = r.findings.length;
    const was = base[r.rule.id];
    let ratchet = 'new';
    if (was === undefined) ratchet = 'unbaselined';
    else if (count > was) ratchet = 'regressed';
    else if (count < was) ratchet = 'improved';
    else ratchet = 'held';
    return { ...r, count, baselineCount: was, ratchet };
  });
}

/* ── reporting ────────────────────────────────────────────────────────────── */

const ICON = { [PASS]: '✓', [FAIL]: '✗', [ABSENT]: '·', [UNCHECKED]: '?' };

function renderText(run, ratcheted, opts) {
  const L = [];
  L.push('');
  L.push(`Caspr conventions conformance — spec v${run.register.specVersion}`);
  L.push(`root ${opts.root}`);
  L.push(`${run.fileCount} files · ${ratcheted.length} rules · tier ${opts.tier} · mode ${opts.mode}`);
  L.push('');

  const byFamily = new Map();
  for (const r of ratcheted) {
    if (!byFamily.has(r.rule.family)) byFamily.set(r.rule.family, []);
    byFamily.get(r.rule.family).push(r);
  }

  for (const [fam, rs] of byFamily) {
    L.push(`── ${fam} ${'─'.repeat(Math.max(0, 60 - fam.length))}`);
    for (const r of rs) {
      const mark = ICON[r.verdict];
      const tail =
        r.verdict === FAIL ? `${r.count} finding${r.count === 1 ? '' : 's'}${r.baselineCount !== undefined ? ` (baseline ${r.baselineCount}, ${r.ratchet})` : ''}`
        : r.verdict === UNCHECKED ? r.why || 'not run'
        : r.verdict === ABSENT ? 'surface not present'
        : `${r.scanned} file${r.scanned === 1 ? '' : 's'}`;
      L.push(`  ${mark} ${r.rule.id.padEnd(14)} ${tail}`);
      if (r.verdict === FAIL) {
        for (const f of r.findings.slice(0, 5)) {
          L.push(`        ${f.file}${f.line ? ':' + f.line : ''}  ${f.text}`);
        }
        if (r.findings.length > 5) L.push(`        … ${r.findings.length - 5} more`);
      }
      if (r.exceptionNote) L.push(`        excepted: ${r.exceptionNote}`);
      if (r.excused?.length && r.verdict === PASS) {
        L.push(`        ${r.excused.length} finding(s) held under a dated exception — not fixed, deferred`);
      }
      if (r.suppressed?.length) {
        const bad = r.suppressed.filter((s) => !s.valid).length;
        L.push(`        ${r.suppressed.length} suppressed${bad ? ` — ${bad} WITHOUT A REASON (itself a failure)` : ''}`);
      }
    }
    L.push('');
  }

  const t = tally(ratcheted);
  L.push('─'.repeat(64));
  L.push(`  PASS ${t.pass}   FAIL ${t.fail}   ABSENT ${t.absent}   UNCHECKED ${t.unchecked}`);
  L.push(`  ${t.findings} finding(s) · ${t.suppressed} suppression(s) · ${t.regressed} regressed`);
  L.push('');
  if (t.unchecked) {
    L.push('  UNCHECKED is not a pass. Those rules did not run — see the reason on each.');
    L.push('');
  }
  return L.join('\n');
}

function renderMarkdown(run, ratcheted, opts) {
  const t = tally(ratcheted);
  const L = [];
  L.push(`## Conventions conformance — spec v${run.register.specVersion}`);
  L.push('');
  L.push(`\`${run.fileCount}\` files · \`${ratcheted.length}\` rules · tier \`${opts.tier}\` · mode \`${opts.mode}\``);
  L.push('');
  L.push('| | Count |');
  L.push('|---|---:|');
  L.push(`| ✓ PASS | ${t.pass} |`);
  L.push(`| ✗ FAIL | ${t.fail} |`);
  L.push(`| · ABSENT | ${t.absent} |`);
  L.push(`| ? UNCHECKED | ${t.unchecked} |`);
  L.push(`| **Findings** | **${t.findings}** |`);
  L.push(`| Regressed vs baseline | ${t.regressed} |`);
  L.push('');
  const fails = ratcheted.filter((r) => r.verdict === FAIL);
  if (fails.length) {
    L.push('### Failing rules');
    L.push('');
    L.push('| Rule | Findings | Baseline | Statement |');
    L.push('|---|---:|---:|---|');
    for (const r of fails.sort((a, b) => b.count - a.count)) {
      L.push(`| \`${r.rule.id}\` | ${r.count} | ${r.baselineCount ?? '—'} | ${r.rule.statement} |`);
    }
    L.push('');
  }
  const unrun = ratcheted.filter((r) => r.verdict === UNCHECKED);
  if (unrun.length) {
    L.push('### Not checked — these are not passes');
    L.push('');
    L.push('| Rule | Why |');
    L.push('|---|---|');
    for (const r of unrun) L.push(`| \`${r.rule.id}\` | ${r.why || 'not run'} |`);
    L.push('');
  }
  return L.join('\n');
}

function renderSarif(run, ratcheted) {
  const rules = ratcheted.map((r) => ({
    id: r.rule.id,
    name: r.rule.id,
    shortDescription: { text: r.rule.statement },
    fullDescription: { text: `${r.rule.statement}\n\nSource: ${r.rule.source}` },
    helpUri: 'https://drive.google.com/caspr-claude-core/docs/app-handoff/CONVENTIONS-CONFORMANCE-SPEC.md',
    properties: { tier: r.rule.tier, family: r.rule.family },
    defaultConfiguration: { level: r.rule.tier === 1 ? 'error' : 'note' },
  }));
  const results = [];
  for (const r of ratcheted) {
    for (const f of r.findings) {
      results.push({
        ruleId: r.rule.id,
        level: r.rule.tier === 1 ? 'error' : 'note',
        message: { text: `${r.rule.statement} — ${f.text}` },
        locations: [{
          physicalLocation: {
            artifactLocation: { uri: f.file },
            region: { startLine: Math.max(1, f.line || 1) },
          },
        }],
      });
    }
  }
  return JSON.stringify({
    $schema: 'https://json.schemastore.org/sarif-2.1.0.json',
    version: '2.1.0',
    runs: [{ tool: { driver: { name: 'caspr-conformance', version: String(run.register.specVersion), rules } }, results }],
  }, null, 2);
}

function renderJson(run, ratcheted, opts) {
  return JSON.stringify({
    specVersion: run.register.specVersion,
    root: opts.root,
    fileCount: run.fileCount,
    tally: tally(ratcheted),
    rules: ratcheted.map((r) => ({
      id: r.rule.id, family: r.rule.family, tier: r.rule.tier, check: r.rule.check,
      verdict: r.verdict, count: r.findings.length, baselineCount: r.baselineCount,
      ratchet: r.ratchet, why: r.why, scanned: r.scanned,
      findings: r.findings, suppressed: r.suppressed,
    })),
  }, null, 2);
}

function tally(rs) {
  const t = { pass: 0, fail: 0, absent: 0, unchecked: 0, findings: 0, suppressed: 0, regressed: 0, badSuppressions: 0 };
  for (const r of rs) {
    if (r.verdict === PASS) t.pass++;
    else if (r.verdict === FAIL) t.fail++;
    else if (r.verdict === ABSENT) t.absent++;
    else t.unchecked++;
    t.findings += r.findings.length;
    t.suppressed += r.suppressed?.length || 0;
    t.badSuppressions += (r.suppressed || []).filter((s) => !s.valid).length;
    if (r.ratchet === 'regressed') t.regressed++;
  }
  return t;
}

/* ── main ─────────────────────────────────────────────────────────────────── */

const opts = parseArgs(process.argv);
const result = run(opts);
const exceptions = loadExceptions(opts.exceptions);
const excepted = applyExceptions(result.results, exceptions);
const baseline = loadBaseline(opts.baseline);
const ratcheted = applyRatchet(excepted, baseline);

if (opts.writeBaseline) {
  const counts = {};
  for (const r of ratcheted) if (r.verdict === FAIL) counts[r.rule.id] = r.findings.length;
  writeFileSync(opts.baseline, JSON.stringify({
    specVersion: result.register.specVersion,
    note: 'The ratchet. Counts may shrink and may never grow. Regenerate only to record a deliberate, reviewed increase.',
    counts,
  }, null, 2) + '\n');
  console.log(`baseline written: ${opts.baseline} (${Object.keys(counts).length} rules with findings)`);
  process.exit(0);
}

for (const fmt of opts.formats) {
  let text;
  if (fmt === 'text') text = renderText(result, ratcheted, opts);
  else if (fmt === 'md') text = renderMarkdown(result, ratcheted, opts);
  else if (fmt === 'json') text = renderJson(result, ratcheted, opts);
  else if (fmt === 'sarif') text = renderSarif(result, ratcheted);
  else { console.error(`unknown format: ${fmt}`); process.exit(2); }

  if (opts.out && fmt === opts.formats[opts.formats.length - 1]) writeFileSync(opts.out, text + '\n');
  else console.log(text);
}

const t = tally(ratcheted);
let exit = 0;
if (opts.mode === 'strict') exit = t.fail > 0 || t.badSuppressions > 0 ? 1 : 0;
else if (opts.mode === 'ratchet') exit = t.regressed > 0 || t.badSuppressions > 0 ? 1 : 0;
else exit = 0; // report

if (exit === 1) {
  const causes = [];
  if (opts.mode === 'ratchet' && t.regressed > 0) {
    causes.push(`${t.regressed} rule(s) regressed against the baseline — counts may shrink, never grow`);
  }
  if (opts.mode === 'strict' && t.fail > 0) {
    causes.push(`${t.fail} rule(s) failing, ${t.findings} finding(s)`);
  }
  if (t.badSuppressions > 0) {
    causes.push(`${t.badSuppressions} suppression(s) with no reason — a bare ignore is itself a failure`);
  }
  console.error(`\nconformance failed:\n  - ${causes.join('\n  - ')}`);
}
process.exit(exit);
