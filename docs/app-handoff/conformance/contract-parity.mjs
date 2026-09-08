#!/usr/bin/env node
/**
 * SEAM-07 — contract parity between the backend's OpenAPI schema and the
 * frontend's TypeScript contract types.
 *
 * Zero dependencies. Node 20+.
 *
 *   node conformance/contract-parity.mjs \
 *     --openapi backend-openapi.json \
 *     --contract packages/contract/src \
 *     [--map conformance/contract-map.json] \
 *     [--format text|md|json] [--out FILE]
 *
 * WHY THIS EXISTS
 *
 *   getSnapshot did `res.json() as WalletSnapshot`.
 *   The server sends `spendable_cents`. The type declares `spendableCents`.
 *   Every field was undefined and the app header rendered $NaN on every screen.
 *
 *   Both repos were green. Both suites passed. Each side of the seam was
 *   internally consistent and nothing tested the join. A cast is a claim, not a
 *   conversion — it compiles either way.
 *
 * THREE AXES, because the bug above failed on the second:
 *
 *   1. presence     a field on one side and not the other
 *   2. casing       spendable_cents vs spendableCents with no mapper between
 *   3. nullability  the backend made budget_cents nullable at 8f18fce; a
 *                   non-nullable frontend type is the next $NaN
 *
 * Exit 0 clean · 1 parity violations · 2 runner error.
 */

import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

/* ── args ─────────────────────────────────────────────────────────────────── */

const args = {};
for (let i = 2; i < process.argv.length; i += 2) {
  const k = process.argv[i]?.replace(/^--/, '');
  if (!k) break;
  args[k] = process.argv[i + 1];
}
if (!args.openapi || !args.contract) {
  console.error('usage: contract-parity.mjs --openapi <file> --contract <dir> [--map <file>] [--format text|md|json] [--out <file>]');
  process.exit(2);
}
for (const p of [args.openapi, args.contract]) {
  if (!existsSync(p)) { console.error(`not found: ${p}`); process.exit(2); }
}

/* ── the backend side: OpenAPI component schemas ──────────────────────────── */

let spec;
try { spec = JSON.parse(readFileSync(args.openapi, 'utf8')); }
catch (e) { console.error(`openapi is not valid JSON: ${e.message}`); process.exit(2); }

const schemas = spec?.components?.schemas || {};

/** { WalletRead: { spendable_cents: {nullable:false}, ... } } */
const wire = {};
for (const [name, def] of Object.entries(schemas)) {
  if (!def || typeof def !== 'object') continue;
  const props = def.properties;
  if (!props) continue;
  const required = new Set(def.required || []);
  const fields = {};
  for (const [f, fdef] of Object.entries(props)) {
    fields[f] = { nullable: isNullable(fdef) || !required.has(f) };
  }
  wire[name] = fields;
}

/** FastAPI emits `anyOf: [{...}, {type: 'null'}]` for Optional[...]. */
function isNullable(fdef) {
  if (!fdef || typeof fdef !== 'object') return false;
  if (fdef.nullable === true) return true;
  if (Array.isArray(fdef.type) && fdef.type.includes('null')) return true;
  if (Array.isArray(fdef.anyOf) && fdef.anyOf.some((s) => s?.type === 'null')) return true;
  if (Array.isArray(fdef.oneOf) && fdef.oneOf.some((s) => s?.type === 'null')) return true;
  return false;
}

/* ── the frontend side: TS interfaces and type aliases ────────────────────── */

function walkTs(dir) {
  const out = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, e.name);
    if (e.isDirectory()) { if (e.name !== 'node_modules') out.push(...walkTs(full)); }
    else if (['.ts', '.tsx'].includes(extname(e.name)) && !e.name.endsWith('.test.ts')) out.push(full);
  }
  return out;
}

/**
 * A regex parser, deliberately. Pulling in the TypeScript compiler would make
 * this the one check that cannot run when the dependency tree is broken —
 * which is exactly when a contract has most likely just moved.
 *
 * Handles: `export interface X { ... }` and `export type X = { ... }`.
 * Does NOT handle: intersections, generics, mapped types. Those are reported as
 * UNPARSED rather than silently treated as empty — an empty parse that reads as
 * a pass is how coverage gets lost.
 */
const DECL = /export\s+(?:interface\s+(\w+)\s*(?:extends\s+[\w<>,\s]+)?\{|type\s+(\w+)\s*=\s*\{)/g;
const FIELD = /^\s*(?:readonly\s+)?(['"]?)([A-Za-z_$][\w$]*)\1(\?)?\s*:\s*([^;\n]+)/;

const ts = {};
const unparsed = [];

for (const file of walkTs(args.contract)) {
  const text = readFileSync(file, 'utf8');
  DECL.lastIndex = 0;
  let m;
  while ((m = DECL.exec(text)) !== null) {
    const name = m[1] || m[2];
    const open = text.indexOf('{', m.index + m[0].length - 1);
    const body = braceBody(text, open);
    if (body == null) { unparsed.push({ name, file, why: 'unbalanced braces' }); continue; }
    if (/\bextends\b|&\s*\{|<[A-Z]/.test(m[0])) unparsed.push({ name, file, why: 'extends/intersection/generic — fields may be incomplete' });

    const fields = {};
    for (const line of body.split('\n')) {
      const f = FIELD.exec(line);
      if (!f) continue;
      const [, , key, optional, type] = f;
      fields[key] = { nullable: Boolean(optional) || /\bnull\b|\bundefined\b/.test(type), type: type.trim() };
    }
    ts[name] = { fields, file };
  }
}

function braceBody(text, open) {
  if (open < 0) return null;
  let depth = 0;
  for (let i = open; i < text.length; i++) {
    if (text[i] === '{') depth++;
    else if (text[i] === '}') { depth--; if (depth === 0) return text.slice(open + 1, i); }
  }
  return null;
}

/* ── pairing ──────────────────────────────────────────────────────────────── */

const snake = (s) => s.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase();

/**
 * Which TS type corresponds to which wire schema. An explicit map wins;
 * otherwise pair on an exact name match, then on a snake/camel-insensitive one.
 */
const explicit = args.map && existsSync(args.map) ? JSON.parse(readFileSync(args.map, 'utf8')) : {};
const pairs = [];
const unpaired = [];

for (const tsName of Object.keys(ts)) {
  const mapped = explicit[tsName];
  if (mapped) {
    if (wire[mapped]) { pairs.push([tsName, mapped]); continue; }
    unpaired.push({ tsName, why: `mapped to "${mapped}", which is not in the OpenAPI schema` });
    continue;
  }
  if (wire[tsName]) { pairs.push([tsName, tsName]); continue; }
  const loose = Object.keys(wire).find((w) => snake(w) === snake(tsName));
  if (loose) { pairs.push([tsName, loose]); continue; }
  unpaired.push({ tsName, why: 'no schema of a matching name — add it to --map, or it is not a wire type' });
}

/* ── the three axes ───────────────────────────────────────────────────────── */

const findings = [];

for (const [tsName, wireName] of pairs) {
  const tsFields = ts[tsName].fields;
  const wireFields = wire[wireName];
  const file = ts[tsName].file;

  for (const [tsKey, tsDef] of Object.entries(tsFields)) {
    // 1 · presence — exact
    if (Object.prototype.hasOwnProperty.call(wireFields, tsKey)) {
      // 3 · nullability
      if (wireFields[tsKey].nullable && !tsDef.nullable) {
        findings.push({
          axis: 'nullability', severity: 'high', type: tsName, wire: wireName, field: tsKey, file,
          detail: `wire may send null; the type declares it non-nullable (${tsDef.type})`,
        });
      }
      continue;
    }
    // 2 · casing — the axis that produced $NaN
    const asSnake = snake(tsKey);
    if (Object.prototype.hasOwnProperty.call(wireFields, asSnake)) {
      findings.push({
        axis: 'casing', severity: 'critical', type: tsName, wire: wireName, field: tsKey, file,
        detail: `wire sends "${asSnake}", the type declares "${tsKey}". Every read is undefined unless a mapper converts it — a cast will not`,
      });
      continue;
    }
    findings.push({
      axis: 'presence', severity: 'high', type: tsName, wire: wireName, field: tsKey, file,
      detail: `declared on the type, absent from the wire schema — always undefined`,
    });
  }

  // presence, other direction: the wire sends something the type never models
  for (const wireKey of Object.keys(wireFields)) {
    if (Object.prototype.hasOwnProperty.call(tsFields, wireKey)) continue;
    const camel = Object.keys(tsFields).find((k) => snake(k) === wireKey);
    if (camel) continue; // already reported as casing
    findings.push({
      axis: 'presence', severity: 'low', type: tsName, wire: wireName, field: wireKey, file,
      detail: 'sent by the wire, not modelled on the type — usually fine, occasionally a missed feature',
    });
  }
}

/* ── report ───────────────────────────────────────────────────────────────── */

const RANK = { critical: 0, high: 1, low: 2 };
findings.sort((a, b) => RANK[a.severity] - RANK[b.severity]);

const fmt = args.format || 'text';
let out;

if (fmt === 'json') {
  out = JSON.stringify({ pairs: pairs.length, findings, unpaired, unparsed }, null, 2);
} else if (fmt === 'md') {
  const L = ['## Contract parity — SEAM-07', '',
    `\`${pairs.length}\` type pairs · \`${findings.length}\` findings · \`${unpaired.length}\` unpaired · \`${unparsed.length}\` unparsed`, ''];
  if (findings.length) {
    L.push('| Severity | Axis | Type | Field | Detail |', '|---|---|---|---|---|');
    for (const f of findings) L.push(`| ${f.severity} | ${f.axis} | \`${f.type}\` | \`${f.field}\` | ${f.detail} |`);
    L.push('');
  }
  if (unpaired.length) {
    L.push('### Unpaired types — not checked, not passed', '');
    for (const u of unpaired) L.push(`- \`${u.tsName}\` — ${u.why}`);
    L.push('');
  }
  if (unparsed.length) {
    L.push('### Partially parsed — fields may be incomplete', '');
    for (const u of unparsed) L.push(`- \`${u.name}\` (${u.file}) — ${u.why}`);
  }
  out = L.join('\n');
} else {
  const L = ['', 'Contract parity — SEAM-07',
    `${pairs.length} type pairs · ${findings.length} findings · ${unpaired.length} unpaired · ${unparsed.length} unparsed`, ''];
  for (const f of findings) {
    L.push(`  [${f.severity.toUpperCase()}] ${f.axis}  ${f.type}.${f.field}`);
    L.push(`      ${f.detail}`);
    L.push(`      ${f.file}`);
  }
  if (unpaired.length) {
    L.push('', '  Unpaired — NOT CHECKED, and not a pass:');
    for (const u of unpaired) L.push(`      ${u.tsName} — ${u.why}`);
  }
  if (unparsed.length) {
    L.push('', '  Partially parsed — fields may be incomplete:');
    for (const u of unparsed) L.push(`      ${u.name} — ${u.why}`);
  }
  L.push('');
  out = L.join('\n');
}

if (args.out) writeFileSync(args.out, out + '\n'); else console.log(out);

const blocking = findings.filter((f) => f.severity !== 'low').length;
if (blocking) console.error(`\ncontract parity: ${blocking} blocking finding(s).`);
process.exit(blocking ? 1 : 0);
