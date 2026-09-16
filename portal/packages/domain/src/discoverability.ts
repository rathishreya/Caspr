/**
 * Discoverability — three components, three clocks, three kill conditions.
 *
 * ⚑ **The channel is not SEO, and the mislabel was doing real damage.**
 * [`docs/seo/decision.md`](../../../../docs/seo/decision.md) §1, 2026-08-25:
 *
 * > *"Three different things were bundled under 'SEO', and they behave nothing alike. […] I
 * > built the channel model on (a), gave it the swing-factor role, and set its kill condition
 * > as 'nothing in the top 20 after six months.' **That measures the slowest, riskiest third
 * > of the channel and ignores the two-thirds that pay fastest.**"*
 *
 * `.agents/gtm-strategy.md` §3.1a carries the correction: **one kill condition per
 * component**, and `portal-design-spec.md` §10 records the Figma frame being redrawn to match
 * — *"SEO ▸ Dashboard — corrected 2026-08-25 to three kill conditions on three clocks."*
 *
 * This file is that correction, in code. A single `seoHealth()` returning one verdict would
 * reintroduce the exact error the correction exists to undo.
 *
 * ⏱ **A clock that has not started is the most important thing this file models.** §3A.2:
 * *"the same page published on a DR-20 domain in month 1 and a DR-40 domain in month 12
 * performs differently — and the DR-40 is only available in month 12 if the work started in
 * month 1."* A six-month clock that nobody started is not "on track". It is six months that
 * have not begun, and the console says so.
 */

export const COMPONENTS = ['presence', 'citation', 'ranking'] as const;
export type Component = (typeof COMPONENTS)[number];

export interface ComponentDefinition {
  readonly id: Component;
  readonly name: string;
  /** What it actually means, in a buyer's terms rather than a channel's. */
  readonly what: string;
  /** How long before the reading means anything. */
  readonly speed: string;
  readonly risk: string;
  /** The measure the kill condition reads. */
  readonly measure: string;
  /** The bar, and the sample it is read over. */
  readonly kill: string;
  /** Months from the clock starting before the kill condition may be read at all. */
  readonly readsAfterMonths: number;
  /** What starts this clock — never a date, always an event. */
  readonly startsWhen: string;
  /** Why it is ordered where it is. §2 of the decision record. */
  readonly why: string;
}

/**
 * In the order the decision record ranks them — **not** in the order the old channel model
 * did. §1: *"(b) and (c) should be producing signal by week 4–8. They are cheap, they hit
 * purchase intent, and they need no ranking. (a) is a bet placed now that pays from month 6 —
 * worth placing, not worth leaning on."*
 */
export const COMPONENT_REGISTER: readonly ComponentDefinition[] = [
  {
    id: 'presence',
    name: 'Presence',
    what: 'Being in the lists buyers and AI answers already read — roundups, G2, Datarade, Capterra.',
    speed: 'Weeks',
    risk: 'Near zero',
    measure: 'Inclusions, against the 25-approach sample',
    kill: 'Under 3 inclusions after 25 approaches',
    readsAfterMonths: 0,
    startsWhen: 'The first approach is sent. Nothing has to be published first.',
    why: 'Purchase intent by definition, immediate on inclusion, and outreach rather than ranking. 6.5× more citations come via third parties than via our own domain.',
  },
  {
    id: 'citation',
    name: 'Citation',
    what: 'Being named as a source when an AI answers the question.',
    speed: 'Weeks to months',
    risk: 'Near zero',
    measure: 'Tracked queries where an AI answer names us',
    kill: 'Not cited in any AI answer for 10 tracked queries after 3 months',
    readsAfterMonths: 3,
    startsWhen: 'The first page publishes to the AEO standard. The clock is on publishing, not on building.',
    why: 'The AI-tools category is being chosen right now on citation quality, which is our exact claim. Citing sources is +40% AI visibility; a low-authority domain gains up to 115%.',
  },
  {
    id: 'ranking',
    name: 'Ranking',
    what: 'Our own pages appearing in the results a search returns.',
    speed: 'Six months',
    risk: 'Thin-content penalty, domain-wide',
    measure: 'Target queries with a page in the top 20',
    kill: 'No page in the top 20 for any target query after 6 months',
    readsAfterMonths: 6,
    startsWhen: 'The first seeded page is indexed. Building it is not starting it.',
    why: 'A bet placed now that pays from month 6 — worth placing, not worth leaning on. Search does not fail fast, and killing it early is the classic error.',
  },
];

export function component(id: Component): ComponentDefinition {
  const found = COMPONENT_REGISTER.find((candidate) => candidate.id === id);
  if (found === undefined) throw new Error(`No discoverability component ${id}`);
  return found;
}

/** What a clock is doing right now. */
export type ClockState = 'not_started' | 'running' | 'readable';

export interface ClockReading {
  readonly component: Component;
  readonly state: ClockState;
  /** ISO date the clock started, or null when nothing has started it. */
  readonly startedOn: string | null;
  /** Days elapsed since it started. Zero while it has not. */
  readonly daysRunning: number;
  /** The date the kill condition may first be read, or null while the clock is stopped. */
  readonly readsOn: string | null;
  readonly daysToRead: number | null;
  /** Where the measure stands: `have` against `bar`, over a sample of `of`. */
  readonly have: number;
  readonly bar: number;
  readonly of: number | null;
  /** Progress toward being readable at all — the sample, not the bar. */
  readonly sampleShare: number;
  /** True only when the condition may be read AND it has failed. */
  readonly killed: boolean;
  /** One line: what this clock says today. */
  readonly says: string;
}

const DAY = 24 * 60 * 60 * 1000;

function addMonths(iso: string, months: number): string {
  const date = new Date(`${iso}T00:00:00Z`);
  date.setUTCMonth(date.getUTCMonth() + months);
  return date.toISOString().slice(0, 10);
}

function daysBetween(fromIso: string, to: Date): number {
  return Math.floor((to.getTime() - new Date(`${fromIso}T00:00:00Z`).getTime()) / DAY);
}

export interface ClockInput {
  readonly component: Component;
  /** ISO date, or null when the event in `startsWhen` has not happened. */
  readonly startedOn: string | null;
  /** Inclusions · cited queries · pages in the top 20. */
  readonly have: number;
  /**
   * The denominator the card shows: the 25-approach sample · queries tracked · target
   * queries. **Always the target, never the progress** — a presence card reading `0 / 0`
   * because no approaches have gone out is true and useless, and the denominator on a clock
   * card is there to say how much work the reading needs.
   */
  readonly of?: number;
  /**
   * Presence only: approaches actually sent. The sample the condition reads at is 25 of
   * these, and it is separate from `of` for the reason above.
   */
  readonly sent?: number;
}

/**
 * Read one clock.
 *
 * ⚠ **A condition is never read before its sample exists.** Presence reads on a count — 25
 * approaches — and the two slower ones read on a date. Reading "0 inclusions" after four
 * approaches would kill the fastest component of the channel in its second week, which is the
 * mirror image of the mistake the correction fixed.
 */
export function readClock(input: ClockInput, now: Date): ClockReading {
  const definition = component(input.component);
  const bar = input.component === 'presence' ? 3 : 1;

  if (input.startedOn === null) {
    return {
      component: input.component,
      state: 'not_started',
      startedOn: null,
      daysRunning: 0,
      readsOn: null,
      daysToRead: null,
      have: input.have,
      bar,
      of: input.of ?? null,
      sampleShare: 0,
      killed: false,
      says: `Not started. ${definition.startsWhen}`,
    };
  }

  const daysRunning = Math.max(0, daysBetween(input.startedOn, now));

  // Presence reads on a sample of approaches, not on a calendar.
  if (definition.readsAfterMonths === 0) {
    const sample = 25;
    const sent = input.sent ?? 0;
    const readable = sent >= sample;
    return {
      component: input.component,
      state: readable ? 'readable' : 'running',
      startedOn: input.startedOn,
      daysRunning,
      readsOn: null,
      daysToRead: null,
      have: input.have,
      bar,
      of: input.of ?? sample,
      sampleShare: Math.min(1, sent / sample),
      killed: readable && input.have < bar,
      says: readable
        ? input.have < bar
          ? `${input.have} inclusions from ${sent} approaches. Under the bar of ${bar} — the kill condition reads, and it has failed.`
          : `${input.have} inclusions from ${sent} approaches. Above the bar of ${bar}.`
        : `${sent} approaches sent. ${sample - sent} more before the condition may be read at all.`,
    };
  }

  const readsOn = addMonths(input.startedOn, definition.readsAfterMonths);
  const daysToRead = daysBetween(new Date().toISOString().slice(0, 10), new Date(`${readsOn}T00:00:00Z`));
  const readable = daysBetween(readsOn, now) >= 0;

  return {
    component: input.component,
    state: readable ? 'readable' : 'running',
    startedOn: input.startedOn,
    daysRunning,
    readsOn,
    daysToRead: Math.max(0, daysToRead),
    have: input.have,
    bar,
    of: input.of ?? null,
    sampleShare: Math.min(1, daysRunning / (definition.readsAfterMonths * 30)),
    killed: readable && input.have < bar,
    says: readable
      ? input.have < bar
        ? `${definition.readsAfterMonths} months elapsed and ${input.have} of ${input.of ?? '—'}. The kill condition reads, and it has failed.`
        : `${input.have} of ${input.of ?? '—'}. Above the bar.`
      : `Day ${daysRunning} of ${definition.readsAfterMonths * 30}. Not read before ${readsOn} — search does not fail fast, and killing it early is the classic error.`,
  };
}

/**
 * The six levers — `docs/seo/decision.md` §3B.
 *
 * *"Everything starts in the first fortnight. Only item 5 has a gate, and the gate is on
 * scale rather than existence."* That last clause is the whole of §3A: **starting is not
 * scaling**, and gating the *start* of a six-month lever on an eight-week test pushes results
 * to month ten for no reason.
 */
export interface Lever {
  readonly id: string;
  readonly name: string;
  readonly starts: string;
  readonly scalesOn: string;
  /** Which clock this lever moves. */
  readonly serves: Component | 'all';
  readonly started: boolean;
  readonly note: string;
}

export const LEVERS: readonly Lever[] = [
  {
    id: 'inclusion',
    name: 'Roundup and directory inclusion',
    starts: 'Week 1',
    scalesOn: 'Immediate — inclusion is the outcome',
    serves: 'presence',
    started: false,
    note: 'The fastest search-adjacent win available. A directory is a form and a login; an editorial roundup is a pitch to a named editor.',
  },
  {
    id: 'aeo',
    name: 'AEO as a build standard',
    starts: 'Week 1',
    scalesOn: 'No gate. It is a bar, not a bet',
    serves: 'citation',
    started: false,
    note: 'Costs almost nothing at build time and is expensive to retrofit. No downside case exists.',
  },
  {
    id: 'authority',
    name: 'Authority building — backlinks, digital PR',
    starts: 'Week 1',
    scalesOn: 'Continuous. Never gated',
    serves: 'ranking',
    started: false,
    note: 'Domain authority is the multiplier on every other search play, and it was sitting below items that pay faster.',
  },
  {
    id: 'entity',
    name: 'Entity establishment — Wikidata, schema, consistency',
    starts: 'Week 1',
    scalesOn: 'Continuous. Never gated',
    serves: 'citation',
    started: false,
    note: 'The cheapest long lever there is, and it was not previously proposed at all. Wikipedia alone is ~7.8% of ChatGPT citations.',
  },
  {
    id: 'data_pages',
    name: 'Data pages — 40 seeded',
    starts: 'Week 1–2',
    scalesOn: 'The conversion test at ~1,000 sessions',
    serves: 'ranking',
    started: false,
    note: 'The first 40 are the test. Failing it means not scaling to 4,000 — it does not mean the 40 should not exist.',
  },
  {
    id: 'record',
    name: 'The Record',
    starts: 'Already scheduled',
    scalesOn: 'Already funded',
    serves: 'all',
    started: false,
    note: 'Original research is rung 1 of data defensibility, and Caspr’s own output is the strongest link magnet available.',
  },
];

/**
 * The discriminator that runs through all of it — **CPC, not volume.**
 *
 * §2: *"`secondary research` at $9 is a student. `competitive landscape analysis` at $300 is
 * a buyer. Advertisers will not pay $300 to reach an undergraduate, and no volume figure
 * tells you that."*
 */
export const BUYER_CPC_FLOOR = 100;
export const STUDENT_CPC_CEILING = 20;

export type Audience = 'buyer' | 'mixed' | 'student';

export function audienceFromCpc(cpc: number | null): Audience {
  if (cpc === null) return 'mixed';
  if (cpc >= BUYER_CPC_FLOOR) return 'buyer';
  if (cpc <= STUDENT_CPC_CEILING) return 'student';
  return 'mixed';
}

export const AUDIENCE_LABEL: Readonly<Record<Audience, string>> = {
  buyer: 'Buyer',
  mixed: 'Mixed',
  student: 'Student',
};

/**
 * What the workstream puts out in a standard week and month.
 *
 * Weekly from `activation-framework.md` §13.2 and `operations-runbook.md` §4; monthly from
 * the runbook's §6 targets, which already existed before the channel was re-scoped.
 */
export interface CadenceRow {
  readonly what: string;
  readonly rate: string;
  readonly mode: 'auto' | 'manual' | 'review';
  readonly serves: Component;
  readonly note: string;
  /** True where nobody can do it today — the owner has not been hired. */
  readonly lapsed?: true;
}

export const SEO_CADENCE: readonly CadenceRow[] = [
  {
    what: 'Search answers',
    rate: '2 a week',
    mode: 'review',
    serves: 'ranking',
    note: 'Origination, frontier model, 20–30 minutes of review with the TL. Our own page, and where every other surface links.',
  },
  {
    what: 'SEO tasks — schema, internal links, metadata',
    rate: '3 a week',
    mode: 'manual',
    serves: 'citation',
    note: 'Derivative review: 1–2 minutes each rather than 8–15. The reason the week fits in one person’s 2.5 hours.',
  },
  {
    what: 'Directory and listing submissions',
    rate: '10 a month',
    mode: 'manual',
    serves: 'presence',
    note: 'A form and a login. The fastest search-adjacent win available, and it needs nothing published first.',
  },
  {
    what: 'Backlink conversations',
    rate: '15 a month',
    mode: 'manual',
    serves: 'ranking',
    note: 'Domain authority is the multiplier on every other search play. Paid link-building is a penalty risk and off-brand for a company selling defensibility.',
  },
  {
    what: 'Editorial roundup pitches',
    rate: 'lapsed',
    mode: 'manual',
    serves: 'presence',
    note: 'A pitch to a named editor is a relationship, not a form. It belongs to the earned-media hire, who lands in 8–12 weeks.',
    lapsed: true,
  },
  {
    what: 'The p reading',
    rate: 'monthly',
    mode: 'manual',
    serves: 'citation',
    note: 'Roughly an hour. Held by SEO on an interim basis until the earned-media hire takes it.',
  },
];
