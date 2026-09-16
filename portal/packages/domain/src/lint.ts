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
 *
 * ⚑ **`L12`–`L17` are additions, 2026-09-16**, from two documents Joy updated on 2026-09-14
 * and 2026-09-15: the **GTM activation framework v2** (§5 the stance library, §6.4 "the
 * linter blocks") and the **content repository's Voice Cheat Sheet, Pass 4** ("supersede
 * anything above that conflicts"). They are numbered after §4.1's set rather than folded
 * into it, so a rule Joy wrote and a rule taken from her later decisions stay distinguishable.
 */

import { copyLinesByTier } from './library';

export type DeterministicRuleId =
  | 'L01'
  | 'L02'
  | 'L03'
  | 'L04'
  | 'L05'
  | 'L06'
  | 'L07'
  | 'L10'
  | 'L12'
  | 'L13'
  | 'L14'
  | 'L15'
  | 'L16'
  | 'L17';
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
  { id: 'L12', name: 'Retired vocabulary', onFail: 'regenerate' },
  { id: 'L13', name: 'Retired plan names', onFail: 'regenerate' },
  { id: 'L14', name: 'Budget written as a subscription price', onFail: 'block' },
  { id: 'L15', name: 'Proof framed as the reader’s work', onFail: 'regenerate' },
  { id: 'L16', name: 'Not live at launch, written as live', onFail: 'block' },
  { id: 'L17', name: 'Claims register', onFail: 'regenerate' },
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

/**
 * `L12` — words the company retired, 2026-08-27 and 2026-09-15.
 *
 * *Thinking* and *Learning* went with the two brains (`CLAUDE.md`: "Never reintroduce
 * either, or the word *brain*"), and *weigh* lost to *Assess* — "having just retired
 * *thinking* for being colonised, adopting a second contested word would be the same
 * mistake twice". **Caspr Signals** is a name collision: the Signal is the opinion layer
 * inside a report, never a plan feature and never priced.
 *
 * ⚠ `learning` and `weigh` are matched only where they read as ours — *the learning brain*,
 * *we weigh*, *weighing the sources*. "Machine learning" and "the weight of evidence" are
 * ordinary English, and a rule that fires on those is a rule reviewers learn to ignore.
 */
const L12 = /\bbrains?\b|\bthinking brain\b|\blearning brain\b|Caspr Signals|\b(?:we|caspr) weighs?\b|\bweigh(?:s|ed|ing)? (?:the )?(?:sources|claims|evidence|figures)\b/gi;

/**
 * `L13` — the retired plan names. Try · Solo · Team · Org, and nothing else.
 *
 * Matched with their noun, never bare: `Business` is an ordinary word, and *Caspr means
 * Business* is the tagline. What is wrong is `Business` **as a plan**.
 */
const L13 =
  /\b(?:Professional|Business|Enterprise|Free|Plus|Pro)\s+(?:plan|tier|milestone|subscription)\b|\b(?:at|on|with|unlocks? at|comes with)\s+(?:Professional|Business|Enterprise)\b/gi;

/**
 * `L14` — the Research Budget written as a bill. `COPY-11a` / `COPY-11b`.
 *
 * "$200 a month of research" is the budget. "$200 a month" is a subscription price, and the
 * product does not have one — which is why this blocks rather than regenerating.
 *
 * ⚠ Price framings only. A bare `from $15` is the approved analysis-price line and a bare
 * `$5.86bn` is a market figure — the first draft of this rule flagged the ready meals range,
 * which is exactly the false positive that teaches a reviewer to stop reading the linter.
 */
const L14 =
  /\$\d[\d,.]*\s*(?:\/\s*mo\b|\/\s*month\b|\s*(?:a|per)\s+month(?! of research))|\bstarting at \$\d[\d,.]*|\bthe \$\d[\d,.]*\s+plan\b|only what you run is recharged/gi;

/**
 * `L15` — proof as labour for the reader. Brand rule 2, and Pass 4 restates it.
 *
 * "Describe the artefact; never assign the labour." Citations answer *when the room asks*,
 * not *so you can check*. The verbs are matched where they take the reader as their subject.
 */
const L15 =
  /\bverify (?:it|them|any|every|the)\b|\bverify for yourself\b|\bcheck the working\b|\baudit it yourself\b|\bsee for yourself\b|\bspot-check\b|\bfact-check (?:it|them|every|each)\b/gi;

/**
 * `L16` — what is not live at launch, written as though it were.
 *
 * Pass 4's list: the $300 depth (Intelligence · Diligence · Strategic options), Insights,
 * Updates, Connect-a-source, Legal Document, the Alerts bell. Allowed with *coming soon* or
 * *not yet live* within 120 characters, which is how the repository itself writes them.
 */
const L16 = /\$300 depth|\bIntelligence\b|\bConnect-a-source\b|\bthe Alerts bell\b/g;
const NOT_LIVE = /\b(?:coming soon|not (?:yet )?live|later phase|phase 2)\b/i;
const NOT_LIVE_WINDOW = 120;

/**
 * `L17` — the claims register's own prohibitions (activation framework §5).
 *
 * "Never in a draft: anything about EV charging · unqualified *every claim, triangulated* —
 * say *a Study* · any comparison led by price." Naming an AI tool belongs here too: §6.4
 * blocks it, and the one permitted category line never names a product.
 */
const L17 = /\bEV charging\b|every claim,? triangulated|\b(?:ChatGPT|Perplexity|Gemini|Copilot|Claude|Bard)\b/gi;

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

/** A term that is allowed once the text says it is not live — `L16`. */
function notLiveAsLive(text: string): LintFinding[] {
  return matchAll(L16, text, 'L16').filter((finding) => {
    const start = Math.max(0, finding.index - NOT_LIVE_WINDOW);
    const end = Math.min(text.length, finding.index + finding.match.length + NOT_LIVE_WINDOW);
    return !NOT_LIVE.test(text.slice(start, end));
  });
}

/** `L17`, minus the one qualified use the register allows: "a Study" beside the proof line. */
function claimsRegister(text: string): LintFinding[] {
  return matchAll(L17, text, 'L17').filter(
    (finding) => !(/^every claim/i.test(finding.match) && /\ba Study\b/i.test(text)),
  );
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
    ...matchAll(L12, text, 'L12'),
    ...matchAll(L13, text, 'L13'),
    ...matchAll(L14, text, 'L14'),
    ...matchAll(L15, text, 'L15'),
    ...notLiveAsLive(text),
    ...claimsRegister(text),
  ].sort((a, b) => a.index - b.index);

  const blocking = new Set(DETERMINISTIC_RULES.filter((r) => r.onFail === 'block').map((r) => r.id));

  return {
    ran: DETERMINISTIC_RULES,
    findings,
    notRun: UNRUN_RULES,
    blocked: findings.some((finding) => blocking.has(finding.rule)),
  };
}
