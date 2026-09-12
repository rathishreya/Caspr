/**
 * The roster — who says what, and what they never say.
 *
 * Lifted verbatim from `content-engine-operating-model.md` ㉖ (which is Joy's `audit.md`
 * §5 lanes with the roles named). This is a register: the engine executes against it and
 * cannot edit it.
 */

export interface VoiceLane {
  readonly id: string;
  readonly person: string;
  readonly role: string;
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
    role: 'CEO',
    lane: 'The analyst — findings from real analyses, the category argument, ICP pain, customer stories',
    cadence: 'weekly',
    never: ['Technical architecture', 'Generic AI commentary'],
  },
  {
    id: 'jayant',
    person: 'Jayant',
    role: 'CTO',
    lane: 'The builder — how Caspr sources live, why citation is hard, evaluation, security, honest trade-offs',
    cadence: 'weekly',
    never: ['Marketing claims', 'Pricing'],
  },
  {
    id: 'dixit',
    person: 'Dixit',
    role: 'Applied scientist',
    lane: 'Retrieval, evaluation, hallucination measurement, agent design',
    cadence: 'fortnightly',
    never: ['Product roadmap'],
  },
  {
    id: 'amit',
    person: 'Amit',
    role: 'AI engineer',
    lane: 'The engineer at work — what shipped, what broke, what the team learned',
    cadence: 'fortnightly',
    never: ['Strategy', 'Positioning'],
  },
  {
    id: 'kartikey',
    person: 'Kartikey',
    role: 'Design',
    lane: 'Long documents, citation UI, reading experience, performance',
    cadence: 'fortnightly',
    never: ['Anything speaking for the company'],
  },
  {
    id: 'keshav',
    person: 'Keshav',
    role: 'Engineer',
    lane: 'Useful technical notes from inside the build',
    cadence: 'fortnightly',
    never: ['Anything speaking for the company'],
  },
  {
    id: 'naman',
    person: 'Naman',
    role: 'AI engineer',
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
