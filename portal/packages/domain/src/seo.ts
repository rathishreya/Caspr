/**
 * SEO — the rank read-out, and the backlog that feeds it.
 *
 * The workstream has two halves and they answer different questions.
 *
 *   `p`          *"do we exist at the moment the buyer looks"* — four surfaces, per ICP,
 *                monthly, and **frozen** (`presence.ts`)
 *   the read-out *"and if not, why not"* — top-100 position, who ranks above us, whether an
 *                AI Overview fired, and the play each of those implies
 *
 * ⚑ **They are deliberately separate**, by `activation-framework.md` §0.5 decision 28:
 * *"top-100 rank tracking and the Overview flag become an SEO read-out, **outside `p`**."*
 * Position 34 is not presence — nobody looks at page four — but it is the difference between
 * *"we have no page for this"* and *"we have a page and it does not rank"*, which are
 * opposite jobs. Folding rank into `p` would let a page climbing from 60 to 30 flatter a
 * metric that should not have moved at all.
 *
 * Framework §15 item 14 is what this file builds: *"the SEO rank read-out — top-100
 * positions per question, who ranks above, the Overview flag, and the play it implies."*
 */

import { basketFor, type PresenceIcp } from './presence';

/** §13.2 — what SEO puts out in a standard week, and how each of it reaches the world. */
export interface SeoCadenceRow {
  readonly what: string;
  readonly perWeek: string;
  readonly mode: 'auto' | 'manual';
  readonly who: string;
  readonly note: string;
}

export const SEO_CADENCE: readonly SeoCadenceRow[] = [
  {
    what: 'Search answers',
    perWeek: '2',
    mode: 'auto',
    who: 'SEO + origination review',
    note: 'Publishes once approved. Our own page, and where every other surface links.',
  },
  {
    what: 'Directory submissions',
    perWeek: '~2.5',
    mode: 'manual',
    who: 'SEO',
    note: 'A form, not a relationship — which is the line that keeps it here rather than in Earned Media.',
  },
  {
    what: 'Backlink conversations',
    perWeek: '~3.5',
    mode: 'manual',
    who: 'SEO',
    note: 'Third-party pages that rank are where 6.5× of citations come from.',
  },
  {
    what: 'The monthly p reading',
    perWeek: 'monthly',
    mode: 'manual',
    who: 'SEO, interim',
    note: 'Reading zero before Day 1. Held by SEO until the earned-media hire lands.',
  },
];

/**
 * Whether Google put an AI Overview on the query at all.
 *
 * **Decision 28: no AI Overview counts as a miss on that surface** — for `p`. Here the flag
 * is read the other way round and means something useful: a question with no Overview is one
 * where the ranking page still gets the click, and a question with an Overview we are absent
 * from is a click that never happens.
 */
export const OVERVIEW_STATES = ['ours', 'others', 'none', 'unknown'] as const;
export type OverviewState = (typeof OVERVIEW_STATES)[number];

export const OVERVIEW_LABEL: Readonly<Record<OverviewState, string>> = {
  ours: 'Overview cites us',
  others: 'Overview, not us',
  none: 'No Overview',
  unknown: 'Not read',
};

/** What ranks above us, and whether it is a page we could be on. */
export const COMPETITOR_KINDS = ['roundup', 'directory', 'competitor', 'publisher', 'other'] as const;
export type CompetitorKind = (typeof COMPETITOR_KINDS)[number];

export interface RankAbove {
  readonly domain: string;
  readonly kind: CompetitorKind;
  readonly position: number;
}

export interface RankRow {
  /** The basket question this reads. The read-out follows `p`'s basket, so the two agree. */
  readonly questionId: string;
  /** 1–100, or null when we are outside the top 100 — which is most of them at reading zero. */
  readonly position: number | null;
  /** Our page for this question, or null when none exists. */
  readonly url: string | null;
  readonly above: readonly RankAbove[];
  readonly overview: OverviewState;
  /**
   * True when the row is illustrative rather than measured. **Nothing in this console shows
   * an unmarked number it did not measure** — the DataForSEO credential is still to be
   * rotated (§14 dependency 3), so no real reading exists yet.
   */
  readonly illustrative?: true;
}

export const PLAYS = ['write_the_page', 'the_page_does_not_rank', 'get_listed', 'hold', 'defend'] as const;
export type Play = (typeof PLAYS)[number];

export interface PlayReading {
  readonly play: Play;
  readonly headline: string;
  readonly what: string;
}

/**
 * The play a row implies.
 *
 * Derived, never typed in. A read-out whose recommendation is a free-text column becomes a
 * column of opinions, and then the question is whose. Four inputs decide it: do we have a
 * page, does it rank, is there a third-party page above us that we could be listed on, and
 * did an Overview fire.
 *
 * **The order matters.** A missing page beats everything — there is nothing to optimise. A
 * listable page above us beats our own ranking work, because §3 of `presence-metric.md`
 * puts 6.5× of citations on third-party pages, and a roundup is a conversation rather than
 * six months of domain authority.
 */
export function rankPlay(row: RankRow): PlayReading {
  const listable = row.above.find((entry) => entry.kind === 'roundup' || entry.kind === 'directory');

  if (row.url === null) {
    return {
      play: 'write_the_page',
      headline: 'No page for this question',
      what: 'Nothing to rank. It becomes a search answer in the backlog — two go out a week.',
    };
  }

  if (row.position !== null && row.position <= 3) {
    return {
      play: 'defend',
      headline: `Ranking ${row.position}`,
      what:
        row.overview === 'others'
          ? 'We rank and the Overview cites someone else — the position is real and the click may not be. Worth a look at what the Overview is quoting.'
          : 'Held. Nothing to do but keep the page true as the numbers behind it move.',
    };
  }

  if (listable !== undefined) {
    return {
      play: 'get_listed',
      headline: `${listable.domain} ranks ${listable.position}`,
      what: `A ${listable.kind} we could be on outranks us. Getting listed is a backlink conversation; out-ranking it is six months. This is where 6.5× of citations come from.`,
    };
  }

  if (row.position === null) {
    return {
      play: 'the_page_does_not_rank',
      headline: 'Outside the top 100',
      what: 'The page exists and is not in the race. Either the question is not what the page answers, or nothing links to it.',
    };
  }

  return {
    play: 'the_page_does_not_rank',
    headline: `Ranking ${row.position}`,
    what:
      row.position <= 10
        ? 'Page one but not the answer. Closest thing to a free win in this table.'
        : 'The page exists and does not rank. Links, or the wrong page against the question.',
  };
}

/** Rows worth someone's Tuesday, hardest-won first: free wins, then listings, then pages. */
export function rankOrder(rows: readonly RankRow[]): readonly RankRow[] {
  const rank: Readonly<Record<Play, number>> = {
    the_page_does_not_rank: 0,
    get_listed: 1,
    write_the_page: 2,
    defend: 3,
    hold: 4,
  };
  return [...rows].sort((a, b) => {
    const byPlay = rank[rankPlay(a).play] - rank[rankPlay(b).play];
    if (byPlay !== 0) return byPlay;
    return (a.position ?? 999) - (b.position ?? 999);
  });
}

export interface RankSummary {
  readonly read: number;
  readonly pageOne: number;
  readonly topThree: number;
  readonly unranked: number;
  readonly noPage: number;
  readonly overviewsSeen: number;
  readonly overviewsOurs: number;
  readonly byPlay: ReadonlyArray<{ readonly play: Play; readonly count: number }>;
}

export function rankSummary(rows: readonly RankRow[]): RankSummary {
  const counts = new Map<Play, number>();
  for (const row of rows) {
    const { play } = rankPlay(row);
    counts.set(play, (counts.get(play) ?? 0) + 1);
  }

  return {
    read: rows.length,
    pageOne: rows.filter((row) => row.position !== null && row.position <= 10).length,
    topThree: rows.filter((row) => row.position !== null && row.position <= 3).length,
    unranked: rows.filter((row) => row.position === null && row.url !== null).length,
    noPage: rows.filter((row) => row.url === null).length,
    overviewsSeen: rows.filter((row) => row.overview === 'ours' || row.overview === 'others').length,
    overviewsOurs: rows.filter((row) => row.overview === 'ours').length,
    byPlay: PLAYS.map((play) => ({ play, count: counts.get(play) ?? 0 })).filter((row) => row.count > 0),
  };
}

/** How much of an ICP's basket the read-out has covered. */
export function readOutCoverage(icp: PresenceIcp, rows: readonly RankRow[]): { readonly read: number; readonly basket: number } {
  const basket = basketFor(icp);
  const ids = new Set(basket.map((question) => question.id));
  return { read: rows.filter((row) => ids.has(row.questionId)).length, basket: basket.length };
}

/**
 * The backlog — the two manual routes, and what state each one is in.
 *
 * §12: *"a directory submission is a form; converting an editor is a relationship."* That
 * sentence is the whole split between this backlog and Earned Media's pipeline, and it is
 * why a guest post is not here.
 */
export const BACKLOG_KINDS = ['search_answer', 'directory', 'backlink'] as const;
export type BacklogKind = (typeof BACKLOG_KINDS)[number];

export const BACKLOG_KIND_LABEL: Readonly<Record<BacklogKind, string>> = {
  search_answer: 'Search answer',
  directory: 'Directory',
  backlink: 'Backlink conversation',
};

export const BACKLOG_STATES = ['queued', 'in_progress', 'submitted', 'live', 'declined'] as const;
export type BacklogState = (typeof BACKLOG_STATES)[number];

export const BACKLOG_STATE_LABEL: Readonly<Record<BacklogState, string>> = {
  queued: 'Queued',
  in_progress: 'In progress',
  submitted: 'Submitted',
  live: 'Live',
  declined: 'Declined',
};

export interface BacklogItem {
  readonly id: string;
  readonly kind: BacklogKind;
  readonly title: string;
  /** The basket question it serves, when it serves one. The backlog answers to `p`. */
  readonly questionId: string | null;
  readonly state: BacklogState;
  readonly note: string;
  readonly illustrative?: true;
}

/** Waiting on a person, in the order a person would take them. */
export function openBacklog(items: readonly BacklogItem[]): readonly BacklogItem[] {
  const order: Readonly<Record<BacklogState, number>> = {
    in_progress: 0,
    queued: 1,
    submitted: 2,
    live: 3,
    declined: 4,
  };
  return [...items]
    .filter((item) => item.state !== 'live' && item.state !== 'declined')
    .sort((a, b) => order[a.state] - order[b.state]);
}
