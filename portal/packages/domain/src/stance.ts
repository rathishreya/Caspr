/**
 * The stance library — `activation-framework.md` §5.
 *
 * "Every conversation out there is one of these shapes, and the website already has a locked
 * answer for each. Drafts draw only from this library — and only from claims
 * `website-copy-deck.md`'s claims register marks *may be used*."
 *
 * This is the file the conversation engine drafts against (§0.3 decision 14: "The portal
 * drafts; nobody writes from scratch. People operate from emotion — drafts from approved
 * lines are the brand-safety mechanism"). It is a library of angles, not a script: the lines
 * below may be used verbatim, and everything around them is the person's own.
 *
 * ⚠ Every line here is quoted from §5. Nothing is paraphrased and nothing is added — a
 * "close enough" rewrite of an approved line is an unapproved line.
 */

export const STANCE_ANGLES = [
  'identity',
  'sourcing',
  'what_research_costs',
  'icp_wounds',
  'the_promise',
  'your_data',
  'the_record',
  'multilingual',
  'category_education',
] as const;
export type StanceAngle = (typeof STANCE_ANGLES)[number];

export interface Stance {
  readonly id: StanceAngle;
  /** The shape of the conversation out there. §5's first column. */
  readonly when: string;
  readonly angle: string;
  /** Lines a draft may use verbatim. §5's third column. */
  readonly lines: readonly string[];
  /** What may be brought as evidence beside them, and what may not. */
  readonly evidence: string | null;
}

export const STANCE_LIBRARY: readonly Stance[] = [
  {
    id: 'identity',
    when: '“Research is dying” · “AI replaces analysts”',
    angle: 'The identity',
    lines: [
      'Not an assistant. An analyst.',
      'Caspr does not hand you a summary and leave the judgment to you.',
      'Research isn’t dying — the unreconciled number is',
    ],
    evidence: 'A Study reconciled conflicting sources in three published analyses',
  },
  {
    id: 'sourcing',
    when: '“Can you trust AI for research?”',
    angle: 'Sourcing',
    lines: ['When the room asks where the number came from, the answer is already on the page.'],
    evidence: '355–678 named sources per analysis, human-verified · ⛔ never verify or check',
  },
  {
    id: 'what_research_costs',
    when: '“Research is slow, stale, expensive”',
    angle: 'What research costs',
    lines: [
      'Buy the report. Commission the study. Or ask the question.',
      'An off-the-shelf report answers the question its publisher chose.',
    ],
    evidence: '87% of sources dated 2025–26 · price comes last, never first',
  },
  {
    id: 'icp_wounds',
    when: '“Drowning in desk research”',
    angle: 'The ICP wounds',
    lines: [
      'Sixty per cent finding it. Forty per cent thinking about it.',
      'The bottleneck was never the judgment.',
      'The same conclusion. Three days late.',
      'Two or three days at the start of every project. Nobody bills them.',
    ],
    evidence: 'The persona line behind each',
  },
  {
    id: 'the_promise',
    when: 'High-stakes decisions · boards · IC',
    angle: 'The promise',
    lines: [
      'Arrive certain.',
      'For decisions that can’t afford to be wrong.',
      'Any question your board will ask — answered, sourced, and ready before they ask it.',
    ],
    evidence: null,
  },
  {
    id: 'your_data',
    when: '“Is client data safe in AI?”',
    angle: 'Your data is your data',
    lines: ['Uploaded documents never reach an external AI provider. Never trains any model.'],
    evidence: 'ISO 27001:2022 · link to /security',
  },
  {
    id: 'the_record',
    when: '“Which market number is right?”',
    angle: 'The Record',
    lines: [
      'Two credible sources, 36% apart, on the same market',
      'These measure different things — and nobody says so',
    ],
    evidence: 'Saudi valves · UK ready meals · copper mine vs refined · SaaS forward vs trailing multiples',
  },
  {
    id: 'multilingual',
    when: 'Global teams · “AI thinks in English”',
    angle: 'Multilingual',
    lines: ['Written in your language. Not translated into it.'],
    evidence: null,
  },
  {
    id: 'category_education',
    when: 'Posts comparing AI tools',
    angle: 'Category education — with care',
    lines: ['While the world was building generative AI, we built analytical AI'],
    evidence: '⛔ No tool is ever named',
  },
];

const BY_ID = new Map(STANCE_LIBRARY.map((stance) => [stance.id, stance]));

export function stance(id: StanceAngle): Stance {
  // Every id in the union has a row; the map lookup is total by construction.
  return BY_ID.get(id)!;
}

/**
 * §5's own list, and `guerrilla-evaluation.md` §4's rule beneath it.
 *
 * Shown beside the drafts rather than kept in the linter alone: a person approving a comment
 * should be able to see what the engine was not allowed to write.
 */
export const NEVER_IN_A_DRAFT: readonly string[] = [
  'Anything about EV charging',
  'Unqualified “every claim, triangulated” — say “a Study”',
  'Any comparison led by price',
  'Verify · check the working · audit it yourself',
  'Naming an AI tool, or the category, outside the one category-education line',
  'Attacking a firm or its data — attack the format and the economics. We cite these publishers',
];
