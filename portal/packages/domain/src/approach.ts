/**
 * The target list — the work that moves the presence clock.
 *
 * `docs/gtm/presence-baseline-2026-08.md` §4 produced this list by running the basket
 * questions and writing down who was actually there. It is not a keyword pull and it is not
 * a guess:
 *
 * > *"The domains that own these questions were the point of the ~15-domain Ahrefs
 * > qualification pull. **Running the questions produced the list directly.** Ahrefs would add
 * > traffic and authority figures; it was never going to change *who* is there."*
 *
 * ⚑ **The shape decides who does the work, and it is the load-bearing field.** §4:
 *
 * > *"Directories are a form and a login. Editorial roundups are outreach to a named editor.
 * > **A forum thread is neither, and it is the only one that could go wrong.**"*
 *
 * That split is also the SEO / Earned Media boundary. `operations-runbook.md` §2A: a
 * directory submission is a form; converting an editor at The Drum is a relationship, and
 * the current SEO practitioner is tactical and does not do it. So **editorial pitches lapse
 * until the earned-media hire lands** — a decision, not a discovery, and this file marks
 * which rows are lapsed rather than quietly listing them as work.
 */

export const APPROACH_SHAPES = ['directory', 'roundup', 'forum', 'competitor', 'skip'] as const;
export type ApproachShape = (typeof APPROACH_SHAPES)[number];

export const SHAPE_LABEL: Readonly<Record<ApproachShape, string>> = {
  directory: 'Directory',
  roundup: 'Editorial roundup',
  forum: 'Forum thread',
  competitor: 'Competitor page',
  skip: 'Skip',
};

export const SHAPE_HOW: Readonly<Record<ApproachShape, string>> = {
  directory: 'A form and a login. SEO submits it.',
  roundup: 'A pitch to a named editor. Earned Media — lapsed until that hire lands.',
  forum: 'A person posts, always. Become a real participant first; never automate it.',
  competitor: 'Not a page we can join. Read it for what it claims, and move on.',
  skip: 'Low value. Not worth the outreach hours.',
};

/** Who can actually do it today, which is not the same as who owns it on paper. */
export const SHAPE_OWNER: Readonly<Record<ApproachShape, 'seo' | 'earned_media' | 'social' | 'nobody'>> = {
  directory: 'seo',
  roundup: 'earned_media',
  forum: 'social',
  competitor: 'nobody',
  skip: 'nobody',
};

export const APPROACH_STATES = ['identified', 'approached', 'included', 'declined', 'no_reply'] as const;
export type ApproachState = (typeof APPROACH_STATES)[number];

export const APPROACH_STATE_LABEL: Readonly<Record<ApproachState, string>> = {
  identified: 'Identified',
  approached: 'Approached',
  included: 'Included',
  declined: 'Declined',
  no_reply: 'No reply',
};

/**
 * Where a state can go next.
 *
 * `identified → approached` is the only move that counts toward the sample, and
 * `approached → included` is the only one that counts toward the bar. Terminal states have
 * no exits: a declined roundup that is pitched again is a new row, not an edit, because the
 * denominator has to keep its own history for the kill condition to mean anything.
 */
export const APPROACH_NEXT: Readonly<Record<ApproachState, readonly ApproachState[]>> = {
  identified: ['approached'],
  approached: ['included', 'declined', 'no_reply'],
  included: [],
  declined: [],
  no_reply: [],
};

export function canAdvance(from: ApproachState, to: ApproachState): boolean {
  return APPROACH_NEXT[from].includes(to);
}

export interface Approach {
  readonly id: string;
  readonly domain: string;
  readonly shape: ApproachShape;
  /** The basket question this domain owns. The target list came out of running them. */
  readonly questionId: string;
  /** The position it held when the baseline ran, where one was recorded. */
  readonly position: number | null;
  readonly state: ApproachState;
  /** Why this one, in one line. Sourced to the baseline. */
  readonly why: string;
  /** True for the one target confirmed across two independent query families. */
  readonly priority?: true;
  /** ISO date the approach was sent, once it has been. */
  readonly approachedOn?: string;
}

/**
 * The sample and the bar — `.agents/gtm-strategy.md` §3.1a.
 *
 * **Under 3 inclusions after 25 approaches.** Both halves matter: the bar is 3, and it is not
 * read until 25 have gone out. Reading it at four approaches would kill the fastest component
 * of the channel in its second week.
 */
export const APPROACH_SAMPLE = 25;
export const INCLUSION_BAR = 3;
/** `operations-runbook.md` §6 — the monthly targets that were already there. */
export const DIRECTORIES_PER_MONTH = 10;
export const BACKLINK_CONVERSATIONS_PER_MONTH = 15;

export interface ApproachProgress {
  readonly identified: number;
  readonly approached: number;
  readonly included: number;
  readonly declined: number;
  readonly noReply: number;
  /** Rows nobody can act on today, because their owner has not been hired. */
  readonly lapsed: number;
  readonly sample: number;
  readonly bar: number;
  readonly readable: boolean;
  readonly killed: boolean;
}

export function approachProgress(approaches: readonly Approach[]): ApproachProgress {
  const count = (state: ApproachState) => approaches.filter((row) => row.state === state).length;
  // Every row that left `identified` counts toward the sample, whatever it became.
  const approached = approaches.filter((row) => row.state !== 'identified').length;
  const included = count('included');

  return {
    identified: count('identified'),
    approached,
    included,
    declined: count('declined'),
    noReply: count('no_reply'),
    lapsed: approaches.filter((row) => row.state === 'identified' && SHAPE_OWNER[row.shape] === 'earned_media').length,
    sample: APPROACH_SAMPLE,
    bar: INCLUSION_BAR,
    readable: approached >= APPROACH_SAMPLE,
    killed: approached >= APPROACH_SAMPLE && included < INCLUSION_BAR,
  };
}

/**
 * What can be sent today, most actionable first.
 *
 * ⚑ **A row whose owner has not been hired is not in this list.** It is not work; it is a
 * vacancy, and `lapsedApproaches` carries it separately. Mixing the two would put nine rows
 * on a queue where four can be acted on, and a queue that lies about its own size stops being
 * read.
 *
 * ⚠ **This is why the priority target does not appear here.** `cybernews.com` is the one
 * domain confirmed across two independent query families — the single best target on the
 * list — and it is an editorial pitch, so nobody can send it until the earned-media hire
 * lands. That is worth seeing plainly rather than softening.
 */
export function nextApproaches(approaches: readonly Approach[]): readonly Approach[] {
  const rank: Readonly<Record<ApproachShape, number>> = {
    directory: 0,
    roundup: 1,
    forum: 2,
    competitor: 3,
    skip: 4,
  };
  return approaches
    .filter(
      (row) =>
        row.state === 'identified' &&
        row.shape !== 'skip' &&
        row.shape !== 'competitor' &&
        SHAPE_OWNER[row.shape] !== 'earned_media',
    )
    .sort((a, b) => {
      if (a.priority !== b.priority) return a.priority === true ? -1 : 1;
      const byShape = rank[a.shape] - rank[b.shape];
      if (byShape !== 0) return byShape;
      return (a.position ?? 99) - (b.position ?? 99);
    });
}

/** Identified, worth doing, and waiting on a hire. Counted, never queued. */
export function lapsedApproaches(approaches: readonly Approach[]): readonly Approach[] {
  return approaches.filter(
    (row) => row.state === 'identified' && SHAPE_OWNER[row.shape] === 'earned_media',
  );
}

/**
 * When the presence clock started: the day the **first** approach went out.
 *
 * Not the day the baseline was taken. The baseline measured where we stood; it did not start
 * anything, and dating the clock from it would credit the channel with weeks in which nobody
 * did the work. `startsWhen` says *"the first approach is sent"* and this is that date.
 */
export function firstApproachOn(approaches: readonly Approach[]): string | null {
  const dates = approaches
    .map((row) => row.approachedOn)
    .filter((date): date is string => date !== undefined)
    .sort();
  return dates[0] ?? null;
}

/**
 * The SEO task queue — `operations-runbook.md` §4.
 *
 * **Three a week: schema, internal links, metadata.** They are derivative review, not
 * origination: 1–2 minutes each rather than 8–15, which is the entire reason the weekly
 * volume fits in one person's 2.5 hours.
 */
export const SEO_TASK_KINDS = ['schema', 'internal_links', 'metadata', 'entity', 'technical'] as const;
export type SeoTaskKind = (typeof SEO_TASK_KINDS)[number];

export const SEO_TASK_LABEL: Readonly<Record<SeoTaskKind, string>> = {
  schema: 'Schema',
  internal_links: 'Internal links',
  metadata: 'Metadata',
  entity: 'Entity signals',
  technical: 'Technical',
};

export const SEO_TASKS_PER_WEEK = 3;

export interface SeoTask {
  readonly id: string;
  readonly kind: SeoTaskKind;
  readonly title: string;
  readonly what: string;
  /** Which clock it moves — so a week of tasks is never all on one component by accident. */
  readonly serves: 'presence' | 'citation' | 'ranking';
  readonly done: boolean;
  /** True where this closes a named gap in the site rather than adding something new. */
  readonly debt?: true;
}

export function openTasks(tasks: readonly SeoTask[]): readonly SeoTask[] {
  return tasks.filter((task) => !task.done);
}
