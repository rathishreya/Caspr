/**
 * The calendar's derived state.
 *
 * Everything the Calendar screen shows in its header and its banner is computed here from
 * the items themselves. Nothing is passed in as a count.
 *
 * That is not tidiness. The banner says "IT WILL NOT PUBLISH", which is a promise about
 * system behaviour (build spec §3.6: "Unreviewed content never publishes. There is no
 * timeout that pushes it live."). A hand-maintained number that disagrees with the grid
 * below it would make the strongest guarantee in the product look like decoration.
 */

import { isUnreviewed, willPublish, type ContentItem } from './content-item';
import { buildWeek, zonedDate, zonedTime, type CalendarDay, type WeekRange } from './week';

/**
 * A fixture of the weekly cycle rather than a piece of content — runbook §1.
 *
 * Derived from the cadence, never seeded, so it cannot fall out of step with the rhythm
 * the whole system runs on.
 */
export interface WeekMilestone {
  readonly id: string;
  readonly date: string;
  readonly time: string;
  readonly label: string;
}

/** Runbook §1, the two Monday fixtures the Figma frame shows. */
export function milestonesForWeek(week: WeekRange): readonly WeekMilestone[] {
  const monday = week.days[0];
  if (!monday) return [];
  return [
    { id: `${monday.date}-deadline`, date: monday.date, time: '18:00', label: 'Review deadline' },
    { id: `${monday.date}-scheduled`, date: monday.date, time: '20:00', label: 'Approved content scheduled' },
  ];
}

export interface CalendarCard {
  readonly item: ContentItem;
  readonly time: string;
  /**
   * True when the item is on the calendar but will not go out.
   *
   * Deliberately derived from `willPublish` rather than from a status literal: a reviewer's
   * explicit hold and an item nobody has reached yet are different causes with the same
   * consequence, and the consequence is what the grid is answering.
   */
  readonly holding: boolean;
  /** Why it is holding, for the tag's title attribute. `null` when it is not. */
  readonly holdingReason: string | null;
}

export interface CalendarColumn {
  readonly day: CalendarDay;
  readonly milestones: readonly WeekMilestone[];
  readonly cards: readonly CalendarCard[];
}

export interface CalendarCounts {
  readonly scheduled: number;
  readonly holding: number;
  /** Awaiting a decision. This is the number the banner names. */
  readonly unreviewed: number;
}

export interface CalendarWeek {
  readonly week: WeekRange;
  readonly columns: readonly CalendarColumn[];
  readonly counts: CalendarCounts;
  /** Items with a status but no slot. Shown as a state, never dropped silently. */
  readonly unscheduled: readonly ContentItem[];
}

function holdingReasonFor(item: ContentItem): string | null {
  if (willPublish(item)) return null;
  switch (item.status) {
    case 'holding':
      return 'Held for discussion by its reviewer';
    case 'rejected':
      return 'Rejected — regenerating with the correction applied';
    default:
      return 'Not yet decided. It rolls at the deadline rather than publishing';
  }
}

/**
 * Group a week's items into seven columns, in slot order, with the week's counts.
 *
 * `now` is a parameter so the server and the browser agree on which days are past —
 * see `week.ts`.
 */
export function buildCalendarWeek(
  startDate: string,
  items: readonly ContentItem[],
  now: Date,
): CalendarWeek {
  const week = buildWeek(startDate, now);
  const milestones = milestonesForWeek(week);
  const inWeek = new Set(week.days.map((day) => day.date));

  const cardsByDate = new Map<string, CalendarCard[]>();
  const unscheduled: ContentItem[] = [];

  for (const item of items) {
    if (item.scheduledFor === null) {
      unscheduled.push(item);
      continue;
    }
    const date = zonedDate(item.scheduledFor);
    if (!inWeek.has(date)) continue;

    const card: CalendarCard = {
      item,
      time: zonedTime(item.scheduledFor),
      holding: !willPublish(item),
      holdingReason: holdingReasonFor(item),
    };
    const bucket = cardsByDate.get(date);
    if (bucket) bucket.push(card);
    else cardsByDate.set(date, [card]);
  }

  for (const bucket of cardsByDate.values()) {
    // Slot order, then title, so the grid is stable when two items share a slot.
    bucket.sort((a, b) => a.time.localeCompare(b.time) || a.item.title.localeCompare(b.item.title));
  }

  const columns: CalendarColumn[] = week.days.map((day) => ({
    day,
    milestones: milestones.filter((milestone) => milestone.date === day.date),
    cards: cardsByDate.get(day.date) ?? [],
  }));

  const onGrid = columns.flatMap((column) => column.cards.map((card) => card.item));

  return {
    week,
    columns,
    counts: {
      scheduled: onGrid.filter(willPublish).length,
      holding: onGrid.filter((item) => !willPublish(item)).length,
      unreviewed: onGrid.filter(isUnreviewed).length,
    },
    unscheduled,
  };
}

export interface UnreviewedBanner {
  /** `1 ITEM UNREVIEWED — IT WILL NOT PUBLISH` */
  readonly headline: string;
  readonly detail: string;
}

/**
 * The banner, or `null` when every item on the grid has a decision.
 *
 * Returning `null` rather than an "all clear" band is deliberate. Design spec §2 gives the
 * accent one job — attention — and a permanent green-equivalent strip is exactly the kind
 * of chrome people stop seeing, which is what makes the red one stop working too.
 */
export function unreviewedBanner(counts: CalendarCounts): UnreviewedBanner | null {
  if (counts.unreviewed === 0) return null;
  const noun = counts.unreviewed === 1 ? 'ITEM' : 'ITEMS';
  return {
    headline: `${counts.unreviewed} ${noun} UNREVIEWED — IT WILL NOT PUBLISH`,
    detail: 'Nothing publishes unreviewed. Review by Mon 18:00 or it rolls.',
  };
}
