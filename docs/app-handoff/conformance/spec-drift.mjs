#!/usr/bin/env node
/**
 * SPEC-DRIFT — the anti-fork check.
 *
 * THIS FILE STAYS ON DRIVE. It is the one check that must see both halves, and
 * CI cannot read Google Drive. Run it from a session that has both.
 *
 *   node spec-drift.mjs
 *   node spec-drift.mjs --spec ../CONVENTIONS-CONFORMANCE-SPEC.md --rules rules.json
 *
 * WHY
 *   CLAUDE.md: "two live copies of a document is not redundancy, it is a fork" —
 *   and names THEATER-SOURCE-DECODE-MOTION.md as the precedent, where the copies
 *   drifted and "the spec" stopped having a single answer.
 *
 *   The reasoning lives on Drive and is never copied. rules.json lives in the
 *   repo because it is *config* — a linter reads it, same class as
 *   eslint.config.js. So exactly one thing exists twice: the list of rule ids.
 *   This reconciles that list, and nothing else crosses.
 *
 * Exit 0 in step · 1 drifted · 2 runner error.
 */

import { readFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));

const args = {};
for (let i = 2; i < process.argv.length; i += 2) {
  const k = process.argv[i]?.replace(/^--/, '');
  if (k) args[k] = process.argv[i + 1];
}

const specPath = resolve(args.spec || join(HERE, '..', 'CONVENTIONS-CONFORMANCE-SPEC.md'));
const rulesPath = resolve(args.rules || join(HERE, 'rules.json'));

for (const p of [specPath, rulesPath]) {
  if (!existsSync(p)) { console.error(`not found: ${p}`); process.exit(2); }
}

let reg;
try { reg = JSON.parse(readFileSync(rulesPath, 'utf8')); }
catch (e) { console.error(`rules.json is not valid JSON: ${e.message}`); process.exit(2); }

const spec = readFileSync(specPath, 'utf8');

/**
 * A spec rule deliberately implemented as more than one register entry.
 * Recorded here so the split is a decision, not drift — the whole point of the
 * check is that an unexplained difference fails.
 */
const ALIASES = {
  'STRUCT-05': ['STRUCT-05a', 'STRUCT-05b'],
};

const registerIds = reg.rules.map((r) => r.id);
const duplicates = registerIds.filter((id, i) => registerIds.indexOf(id) !== i);

// Rule ids as the spec writes them: inside backticks, FAMILY-NNN shaped.
const specIds = new Set(
  (spec.match(/`([A-Z][A-Z0-9]*-[A-Z0-9-]+)`/g) || []).map((s) => s.replace(/`/g, ''))
);

const families = new Set(registerIds.map((id) => id.split('-')[0]));
const known = new Set(registerIds);

// Expand aliases in both directions before comparing.
const specExpanded = new Set();
for (const id of specIds) {
  if (ALIASES[id]) ALIASES[id].forEach((a) => specExpanded.add(a));
  else specExpanded.add(id);
}
const aliasTargets = new Set(Object.values(ALIASES).flat());

const inRegisterNotSpec = registerIds.filter((id) => !specExpanded.has(id));
const inSpecNotRegister = [...specIds].filter(
  (id) => !known.has(id) && !ALIASES[id] && !aliasTargets.has(id) && families.has(id.split('-')[0])
);

// specVersion must match the spec's own header.
const headerVersion = /register v(\d+)/.exec(spec)?.[1];
const versionMismatch = headerVersion && headerVersion !== String(reg.specVersion)
  ? `spec header says v${headerVersion}, rules.json says v${reg.specVersion}`
  : null;

// Every rule must cite a source. A rule with no source is not a rule.
const sourceless = reg.rules.filter((r) => !r.source || r.source.trim().length < 8).map((r) => r.id);

/* ── report ───────────────────────────────────────────────────────────────── */

const problems = [];
if (duplicates.length) problems.push(`duplicate ids in the register: ${duplicates.join(', ')}`);
if (inRegisterNotSpec.length) problems.push(`in rules.json but not in the spec: ${inRegisterNotSpec.join(', ')}`);
if (inSpecNotRegister.length) problems.push(`in the spec but not in rules.json: ${inSpecNotRegister.join(', ')}`);
if (versionMismatch) problems.push(versionMismatch);
if (sourceless.length) problems.push(`rules with no source — a rule with no source is not a rule: ${sourceless.join(', ')}`);

const byCheck = {};
for (const r of reg.rules) byCheck[r.check] = (byCheck[r.check] || 0) + 1;

console.log('');
console.log('SPEC-DRIFT');
console.log(`  spec   ${specPath}`);
console.log(`  rules  ${rulesPath}`);
console.log('');
console.log(`  ${registerIds.length} registered · ${specIds.size} cited in the spec · ${Object.keys(ALIASES).length} documented split(s)`);
console.log(`  tier 1 ${reg.rules.filter((r) => r.tier === 1).length} · tier 2 ${reg.rules.filter((r) => r.tier === 2).length}`);
console.log(`  ${Object.entries(byCheck).map(([k, v]) => `${k} ${v}`).join(' · ')}`);
console.log('');

if (!problems.length) {
  console.log('  ✓ in step — the register and the specification agree');
  console.log('');
  process.exit(0);
}

console.log('  ✗ drifted');
for (const p of problems) console.log(`      - ${p}`);
console.log('');
console.log('  Fix the register or the spec — not by deleting the check. This is the');
console.log('  mechanism that stops the next THEATER-SOURCE-DECODE-MOTION.md.');
console.log('');
process.exit(1);
