/**
 * The roster — who says what, and what they never say.
 *
 * Lanes from `content-engine-operating-model.md` ㉖, which is Joy's
 * `Caspr-dm-handover/02-linkedin-profiles/audit.md` §5 with the roles named.
 *
 * Names, roles and headlines from the same audit, §1 and §4. **Corrected 2026-09-15:** this
 * file carried Kartikey as "Design" and Keshav as "Engineer"; the audit, which was written
 * against the live profiles, gives Senior Frontend Engineer and Data Scientist. The headline
 * is the §4 rewrite — applied in week 0, before anything in this console publishes — because
 * it is the line LinkedIn prints under the name on every post and comment.
 *
 * This is a register: the engine executes against it and cannot edit it.
 */

export interface VoiceLane {
  readonly id: string;
  readonly person: string;
  /** As LinkedIn shows it. */
  readonly fullName: string;
  readonly role: string;
  /** The line under the name on every post — audit §4. */
  readonly headline: string;
  /** What this person carries, in their own voice. */
  readonly lane: string;
  /** Origination cadence. `null` means comments only. */
  readonly cadence: 'weekly' | 'fortnightly' | null;
  /** ⛔ Subjects this lane never carries. A derivative outside it is not generated. */
  readonly never: readonly string[];
}

export const VOICE_LANES: readonly VoiceLane[] = [
  {
    id: 'joy',
    person: 'Joy',
    fullName: 'Joy Sharma',
    role: 'CEO',
    headline: 'Founder & CEO — Analytical AI for business analysis. Ex-McKinsey.',
    lane: 'The analyst — findings from real analyses, the category argument, ICP pain, customer stories',
    cadence: 'weekly',
    never: ['Technical architecture', 'Generic AI commentary'],
  },
  {
    id: 'jayant',
    person: 'Jayant',
    fullName: 'Jayant Jha',
    role: 'CTO',
    headline: 'Co-founder & CTO, Caspr — building Analytical AI: research methodology, live data, cited output.',
    lane: 'The builder — how Caspr sources live, why citation is hard, evaluation, security, honest trade-offs',
    cadence: 'weekly',
    never: ['Marketing claims', 'Pricing'],
  },
  {
    id: 'dixit',
    person: 'Dixit',
    fullName: 'Dixit Chand',
    role: 'Data Scientist',
    headline: 'Data Scientist, Caspr — retrieval, evaluation and citation systems for Analytical AI.',
    lane: 'Retrieval, evaluation, hallucination measurement, agent design',
    cadence: 'fortnightly',
    never: ['Product roadmap'],
  },
  {
    id: 'amit',
    person: 'Amit',
    fullName: 'Amit Kotnala',
    role: 'AI Software Engineer',
    headline: 'AI Software Engineer, Caspr — founding team. Building the analysis engine.',
    lane: 'The engineer at work — what shipped, what broke, what the team learned',
    cadence: 'fortnightly',
    never: ['Strategy', 'Positioning'],
  },
  {
    id: 'kartikey',
    person: 'Kartikey',
    fullName: 'Kartikey Bajpai',
    role: 'Senior Frontend Engineer',
    headline: 'Senior Frontend Engineer, Caspr — the interface for Analytical AI.',
    lane: 'Long documents, citation UI, reading experience, performance',
    cadence: 'fortnightly',
    never: ['Anything speaking for the company'],
  },
  {
    id: 'keshav',
    person: 'Keshav',
    fullName: 'Keshav Jha',
    role: 'Data Scientist',
    headline: 'Data Scientist, Caspr — analysis pipelines and evaluation.',
    lane: 'Useful technical notes from inside the build',
    cadence: 'fortnightly',
    never: ['Anything speaking for the company'],
  },
  {
    id: 'naman',
    person: 'Naman',
    fullName: 'Naman Bhatia',
    role: 'AI Software Engineer',
    headline: 'AI Software Engineer, Caspr — founding team.',
    lane: 'Comments only for 8 weeks, then joins the engineer lane',
    cadence: null,
    never: [],
  },
];

const BY_ID = new Map(VOICE_LANES.map((lane) => [lane.id, lane]));

export function voiceLane(id: string): VoiceLane | undefined {
  return BY_ID.get(id);
}

/** Display name for a lane id, falling back to the id so a surface never renders blank. */
export function personName(id: string | null): string {
  if (id === null) return 'Caspr';
  return BY_ID.get(id)?.person ?? id;
}

/**
 * ⛔ Never two people on the same subject in the same week. ㉖.
 *
 * The operating model is specific that this is enforced at the work order — "a work order
 * that would assign the same `topic_id` to two lanes in one week **fails to generate the
 * second**, rather than producing it and hoping review catches it."
 *
 * The calendar surfaces the violation rather than fixing it: by the time an item is on a
 * slot, generation has already happened, and a collision here means the guard upstream
 * did not hold. That is a defect worth showing, not one worth hiding.
 *
 * @returns one entry per topic carried by more than one lane in the week.
 */
export function laneCollisions(
  items: readonly { topicId: string; voiceLane: string | null }[],
): ReadonlyArray<{ topicId: string; lanes: readonly string[] }> {
  const byTopic = new Map<string, Set<string>>();

  for (const item of items) {
    if (item.voiceLane === null) continue;
    let lanes = byTopic.get(item.topicId);
    if (!lanes) {
      lanes = new Set<string>();
      byTopic.set(item.topicId, lanes);
    }
    lanes.add(item.voiceLane);
  }

  return [...byTopic.entries()]
    .filter(([, lanes]) => lanes.size > 1)
    .map(([topicId, lanes]) => ({ topicId, lanes: [...lanes].sort() }));
}
