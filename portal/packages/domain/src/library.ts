/**
 * Content & Social ▸ Library — approved copy, in tiers.
 *
 * Design spec §5A.7 explains why the tier travels with the line rather than sitting in a
 * governance document: the content library's Voice Cheat Sheet carried retired lines under
 * a heading reading "APPROVED LINES (reuse verbatim where they fit)" until 2026-08-24.
 * "A flat list of good lines is how a retired line gets reused — nobody re-reads the
 * governance doc, they copy from the nearest list."
 *
 * Retired lines are listed rather than deleted, so nobody re-proposes them in good faith.
 * The linter blocks them upstream regardless; the Library is where a person finds out why.
 *
 * Source: `CLAUDE.md` › Brand Identity › Approved copy. That file is the authority; this
 * is a transcription of it and must not acquire a line the authority does not carry.
 */

export const COPY_TIERS = ['lead', 'supporting', 'category_education', 'retired'] as const;
export type CopyTier = (typeof COPY_TIERS)[number];

export interface CopyTierDefinition {
  readonly id: CopyTier;
  /** Uppercase, for the mono section label. */
  readonly label: string;
  /** Where a line in this tier may appear — the whole point of the tier. */
  readonly permits: string;
  /** True for the tier the accent colour marks. Exactly one tier is blocked. */
  readonly blocked: boolean;
}

export const COPY_TIER_REGISTER: readonly CopyTierDefinition[] = [
  {
    id: 'lead',
    label: 'LEAD',
    permits: 'Hero-eligible. Headlines, heroes, ad creative, anywhere.',
    blocked: false,
  },
  {
    id: 'supporting',
    label: 'SUPPORTING',
    permits: 'Folds, proof lines and ad creative. Never a hero.',
    blocked: false,
  },
  {
    id: 'category_education',
    label: 'CATEGORY EDUCATION ONLY',
    permits: '/vs/* pages, social and founder content. Never a hero, headline or ad.',
    blocked: false,
  },
  {
    id: 'retired',
    label: 'RETIRED',
    permits: 'Blocked at the linter. Listed so it is not re-proposed in good faith.',
    blocked: true,
  },
];

export interface CopyLine {
  readonly id: string;
  readonly tier: CopyTier;
  readonly line: string;
  /** Where it is used, or — for a retired line — why it lost. */
  readonly note: string;
  /** The surface it is locked to, when it is locked to one. */
  readonly placement: string | null;
}

export const COPY_LIBRARY: readonly CopyLine[] = [
  {
    id: 'lead-h1',
    tier: 'lead',
    line: 'Not an assistant. An analyst.',
    note: 'The homepage H1. Locked 2026-08-20.',
    placement: 'caspr.ai — homepage H1',
  },
  {
    id: 'lead-subhead',
    tier: 'lead',
    line: 'Any question your board will ask — answered, sourced, and ready before they ask it.',
    note: 'Homepage subhead.',
    placement: 'caspr.ai — homepage',
  },
  {
    id: 'lead-promise',
    tier: 'lead',
    line: 'Arrive certain.',
    note: 'The promise in the message stack.',
    placement: null,
  },
  {
    id: 'lead-proof',
    tier: 'lead',
    line: 'Every source, credible. Every claim, triangulated. Every report, defensible.',
    note: 'The proof line. It restates Source · Assess · Conclude as a sentence.',
    placement: null,
  },
  {
    id: 'lead-investors',
    tier: 'lead',
    line: 'You were hired to evaluate businesses. Not to be a research librarian.',
    note: 'Found in the research, not written for it.',
    placement: '/investors',
  },
  {
    id: 'lead-academic',
    tier: 'lead',
    line: "Your library closed at 9pm. Your case brief doesn't care.",
    note: 'Lifted from a day-in-the-life narrative at icp-personas.md line 709.',
    placement: '/academic',
  },
  {
    id: 'lead-market-research',
    tier: 'lead',
    line: 'You research for a living. You still have to research before you can research.',
    note: 'The unbillable pre-fieldwork layer, in the buyer’s own words.',
    placement: '/market-research',
  },
  {
    id: 'supporting-speed',
    tier: 'supporting',
    line: '15 minutes. 100 pages. Cited to source.',
    note: 'Demoted 2026-08-20. True, and still good on the how-it-works fold — but leading on speed puts Caspr in a race it loses as the category commoditises.',
    placement: 'How-it-works fold',
  },
  {
    id: 'supporting-cost',
    tier: 'supporting',
    line: 'The $200,000 question. For $80.',
    note: 'Cost is the third act, never the hook.',
    placement: null,
  },
  {
    id: 'supporting-retainer',
    tier: 'supporting',
    line: 'Analyst-grade insights. Without the analyst retainer.',
    note: 'Proof line.',
    placement: null,
  },
  {
    id: 'category-generative',
    tier: 'category_education',
    line: 'While the world was building generative AI, we built analytical AI.',
    note: 'Naming the category concedes we are in it. Category education only.',
    placement: '/vs/*, social, founder content',
  },
  {
    id: 'retired-googling',
    tier: 'retired',
    line: 'Stop Googling. Start analyzing.',
    note: 'Names a competitor’s product, and instructs the reader that they are doing it wrong. Both off-register.',
    placement: null,
  },
  {
    id: 'retired-competitors',
    tier: 'retired',
    line: 'Your competitors are still waiting for the research.',
    note: 'Speed-led and combative. The voice is calm authority, not rivalry.',
    placement: null,
  },
];

export function copyLinesByTier(tier: CopyTier): readonly CopyLine[] {
  return COPY_LIBRARY.filter((line) => line.tier === tier);
}
