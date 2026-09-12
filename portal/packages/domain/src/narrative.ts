/**
 * The narrative register — how a thing is told, as distinct from what it claims.
 *
 * `content-engine-operating-model.md` ㉗. The reason it exists, in its own words: "A pillar
 * says what claim. A narrative says how it is told. Today only the pillar exists — which is
 * why fan-outs read the same: twenty items on one pillar with no instruction to vary the
 * telling produce twenty versions of one post."
 *
 * Two of the eight are capped, and both caps have a stated reason. The caps are the only
 * part of this register a surface has to compute, so they live here rather than in a page.
 */

export const NARRATIVES = ['N1', 'N2', 'N3', 'N4', 'N5', 'N6', 'N7', 'N8'] as const;
export type Narrative = (typeof NARRATIVES)[number];

export interface NarrativeDefinition {
  readonly id: Narrative;
  readonly name: string;
  readonly readsLike: string;
  readonly lanes: readonly string[];
  readonly cap: NarrativeCap;
}

export type NarrativeCap =
  | { readonly kind: 'none' }
  /** A share of the week's items, expressed 0–1. */
  | { readonly kind: 'share'; readonly max: number; readonly why: string }
  /** At most `max` items in a rolling window of `weeks`. */
  | { readonly kind: 'frequency'; readonly max: number; readonly weeks: number; readonly why: string }
  /** Allowed, but only on the surfaces named. */
  | { readonly kind: 'surface'; readonly only: readonly string[]; readonly why: string };

export const NARRATIVE_REGISTER: readonly NarrativeDefinition[] = [
  {
    id: 'N1',
    name: 'The finding',
    readsLike: 'Two sources price this market $600m apart. Here is which is right.',
    lanes: ['joy'],
    cap: { kind: 'none' },
  },
  {
    id: 'N2',
    name: 'The build',
    readsLike: 'Keeping 25M sources current is a freshness problem, not a size problem.',
    lanes: ['jayant', 'dixit'],
    cap: { kind: 'none' },
  },
  {
    id: 'N3',
    name: "The customer's day",
    readsLike: "Your library closed at 9pm. Your case brief doesn't care.",
    lanes: ['joy'],
    cap: { kind: 'none' },
  },
  {
    id: 'N4',
    name: 'The journey',
    readsLike: 'Why we started, what we got wrong, what changed',
    lanes: ['joy'],
    cap: {
      kind: 'frequency',
      max: 1,
      weeks: 4,
      why: 'Every startup over-uses it and it converts nobody who was not already interested. It is brand, and brand is not the current constraint.',
    },
  },
  {
    id: 'N5',
    name: 'What the product does',
    readsLike: 'The gate, the citation panel, Ask Caspr',
    lanes: ['joy', 'kartikey'],
    cap: {
      kind: 'share',
      max: 0.15,
      why: 'Above ~15% the feed becomes a product blog, and an analyst who posts only about their own tool stops reading as an analyst.',
    },
  },
  {
    id: 'N6',
    name: 'The teardown',
    readsLike: 'A method critiqued — how a TAM gets to be wrong',
    lanes: ['joy', 'dixit'],
    cap: { kind: 'none' },
  },
  {
    id: 'N7',
    name: 'The category argument',
    readsLike: 'While the world was building generative AI, we built analytical AI',
    lanes: ['joy'],
    cap: {
      kind: 'surface',
      only: ['/vs/*', 'social', 'founder'],
      why: 'Naming the category concedes we are in it. Never a hero, headline or ad — CLAUDE.md rule 1.',
    },
  },
  {
    id: 'N8',
    name: 'Ship notes',
    readsLike: 'What shipped, what broke, what we learned',
    lanes: ['amit', 'keshav', 'naman'],
    cap: { kind: 'none' },
  },
];

const BY_ID = new Map(NARRATIVE_REGISTER.map((n) => [n.id, n]));

export function narrative(id: string): NarrativeDefinition | undefined {
  return BY_ID.get(id as Narrative);
}

export interface NarrativeMixRow {
  readonly id: Narrative;
  readonly name: string;
  readonly count: number;
  readonly share: number;
  readonly cap: NarrativeCap;
  /** True when the week's mix exceeds a stated cap. Renders in the accent colour. */
  readonly overCap: boolean;
}

/**
 * The week's mix against the register's caps.
 *
 * `frequency` caps span four weeks, so they cannot be judged from one week alone —
 * `priorWindowCounts` carries the count already spent in the rolling window. Passing an
 * empty map means "no history", which under-reports rather than over-reports; the caller
 * that has the history is the one that should supply it.
 */
export function narrativeMix(
  items: readonly { narrative: string }[],
  priorWindowCounts: ReadonlyMap<string, number> = new Map(),
): readonly NarrativeMixRow[] {
  const total = items.length;
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item.narrative, (counts.get(item.narrative) ?? 0) + 1);
  }

  return NARRATIVE_REGISTER.map((definition) => {
    const count = counts.get(definition.id) ?? 0;
    const share = total === 0 ? 0 : count / total;
    return {
      id: definition.id,
      name: definition.name,
      count,
      share,
      cap: definition.cap,
      overCap: exceedsCap(definition.cap, {
        count,
        share,
        windowCount: count + (priorWindowCounts.get(definition.id) ?? 0),
      }),
    };
  });
}

function exceedsCap(
  cap: NarrativeCap,
  observed: { count: number; share: number; windowCount: number },
): boolean {
  switch (cap.kind) {
    case 'none':
    case 'surface':
      return false;
    case 'share':
      return observed.share > cap.max;
    case 'frequency':
      return observed.windowCount > cap.max;
  }
}
