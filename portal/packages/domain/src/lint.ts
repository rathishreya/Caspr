/**
 * ⑫ The Linter — the deterministic half.
 *
 * `docs/gtm/content-engine.md` §4.1 splits the rule set in two: **deterministic** checks
 * (`L01`–`L11`, "string, regex or table lookup. No model call") and **semantic** checks
 * (`L20`–`L24`, a model call each). This file is the first half, as far as it can run with
 * nothing but the text in hand.
 *
 * Three rules from §4.1 are deliberately absent, and each one says so on screen rather than
 * reading as passed:
 *
 *  · `L06` needs the canonical facts table, which the truth layer builds. Only the tokens
 *    §4.1 itself names as known-stale are matched here.
 *  · `L09` "capitalised and unexplained on a first-touch surface" needs to know what counts
 *    as an explanation. A regex would flag every correct use of the word.
 *  · `L11` needs ninety days of published history to compare against.
 *
 * `L08` (channel constraints) lives in `post.ts`, beside the channel rules it enforces.
 */

import { copyLinesByTier } from './library';

export type DeterministicRuleId = 'L01' | 'L02' | 'L03' | 'L04' | 'L05' | 'L06' | 'L07' | 'L10';
export type UnrunRuleId = 'L09' | 'L11' | 'L20' | 'L21' | 'L22' | 'L23' | 'L24';

export interface LintRule {
  readonly id: DeterministicRuleId | UnrunRuleId;
  readonly name: string;
  /** On fail, per §4.1. `block` never regenerates — it escalates. */
  readonly onFail: 'regenerate' | 'block';
}

export interface LintFinding {
  readonly rule: DeterministicRuleId;
  readonly match: string;
  readonly index: number;
}

export interface LintReport {
  /** Every rule that ran, whether or not it found anything. */
  readonly ran: readonly LintRule[];
  readonly findings: readonly LintFinding[];
  /**
   * Rules that exist and did not run here.
   *
   * Reported, never omitted. A reviewer shown "linter cleared" when four checks never ran
   * would be told the machine had done work it had not — which is the opposite of what the
   * cleared strip exists for (design spec §5A.6).
   */
  readonly notRun: readonly (LintRule & { readonly why: string })[];
  /** True when a finding carries `block` — §4.1: "Block, do not regenerate. Escalate". */
  readonly blocked: boolean;
}

export const DETERMINISTIC_RULES: readonly LintRule[] = [
  { id: 'L01', name: 'Banned vocabulary', onFail: 'regenerate' },
  { id: 'L02', name: 'Contrast-only terms', onFail: 'regenerate' },
  { id: 'L03', name: 'Prohibited claims', onFail: 'regenerate' },
  { id: 'L04', name: 'Exclamation points', onFail: 'regenerate' },
  { id: 'L05', name: 'Retired copy', onFail: 'regenerate' },
  { id: 'L06', name: 'Known-stale numbers', onFail: 'regenerate' },
  { id: 'L07', name: 'Brand boundary', onFail: 'block' },
  { id: 'L10', name: 'Platform-fee mention', onFail: 'block' },
];

export const UNRUN_RULES: readonly (LintRule & { readonly why: string })[] = [
  { id: 'L09', name: 'Tier-name bareness', onFail: 'regenerate', why: 'Needs to know what counts as an explanation' },
  { id: 'L11', name: 'Duplication', onFail: 'regenerate', why: 'Needs 90 days of published history' },
  { id: 'L20', name: 'Reader labour', onFail: 'regenerate', why: 'Semantic — a model call' },
  { id: 'L21', name: 'Competitor in lead copy', onFail: 'regenerate', why: 'Semantic — a model call' },
  { id: 'L22', name: 'Citation resolves', onFail: 'regenerate', why: 'Must fetch the source, not read the field' },
  { id: 'L23', name: 'Cost leads', onFail: 'regenerate', why: 'Semantic, and calendar-aware' },
  { id: 'L24', name: 'Disclosure present', onFail: 'regenerate', why: 'Semantic — a model call' },
];

/** §4.1 `L01`, verbatim. Word-boundary match. */
const L01 =
  /\b(?:platform|leverag(?:e|es|ed|ing)|algorithms?|workflows?|powerful AI|revolutionary|game-changing|excited to announce)\b/gi;

/** §4.1 `L02` — permitted only within 200 characters of a negation. */
const L02 = /\b(?:chatbots?|web scraping|hallucinat\w*)\b/gi;
const NEGATION = /\b(?:not|never|unlike|rather than)\b/i;
const NEGATION_WINDOW = 200;

/** §4.1 `L03`, verbatim. `LAM` is case-sensitive — "lam" is not the claim. */
const L03 = /\bLAM\b|Large Analysis Model|SOC 2 certified|zero hallucinations?/g;

/**
 * §4.1 `L06` — the tokens the section itself names as known-stale.
 *
 * `Plus` and `Pro` are also on that list, as retired plan names. They are not matched
 * here: as bare words they occur in ordinary prose ("pros and cons", "plus a note"), and a
 * rule that fires on correct copy teaches reviewers to ignore it.
 */
const L06 = /1M\+|\$50\/mo\b/g;

/** §4.1 `L07`. Any occurrence, anywhere. */
const L07 = /ghost research/gi;

/**
 * §4.1 `L10` — `7%` or "platform fee".
 *
 * The lookbehind stops `17%` and `4.7%` matching. Both are ordinary figures; the fee is
 * the one that must never leave the building (CLAUDE.md, pricing).
 */
const L10 = /(?<![\d.])7%|platform fee/gi;

function matchAll(pattern: RegExp, text: string, rule: DeterministicRuleId): LintFinding[] {
  const found: LintFinding[] = [];
  for (const m of text.matchAll(pattern)) {
    found.push({ rule, match: m[0], index: m.index ?? 0 });
  }
  return found;
}

function contrastOnly(text: string): LintFinding[] {
  return matchAll(L02, text, 'L02').filter((finding) => {
    const start = Math.max(0, finding.index - NEGATION_WINDOW);
    const end = Math.min(text.length, finding.index + finding.match.length + NEGATION_WINDOW);
    return !NEGATION.test(text.slice(start, end));
  });
}

function retiredCopy(text: string): LintFinding[] {
  const lower = text.toLowerCase();
  const found: LintFinding[] = [];
  // One source for retired lines: the Library. A second list here would drift from it.
  for (const retired of copyLinesByTier('retired')) {
    const index = lower.indexOf(retired.line.toLowerCase());
    if (index >= 0) found.push({ rule: 'L05', match: retired.line, index });
  }
  return found;
}

/**
 * Run every deterministic rule that can run on text alone.
 *
 * `L04` treats any `!` as a finding. §4.1 exempts "a quoted source", and none of the post
 * bodies carry one — a body that does will need the quote marked before this can tell.
 */
export function lintDeterministic(text: string): LintReport {
  const findings = [
    ...matchAll(L01, text, 'L01'),
    ...contrastOnly(text),
    ...matchAll(L03, text, 'L03'),
    ...matchAll(/!/g, text, 'L04'),
    ...retiredCopy(text),
    ...matchAll(L06, text, 'L06'),
    ...matchAll(L07, text, 'L07'),
    ...matchAll(L10, text, 'L10'),
  ].sort((a, b) => a.index - b.index);

  const blocking = new Set(DETERMINISTIC_RULES.filter((r) => r.onFail === 'block').map((r) => r.id));

  return {
    ran: DETERMINISTIC_RULES,
    findings,
    notRun: UNRUN_RULES,
    blocked: findings.some((finding) => blocking.has(finding.rule)),
  };
}
