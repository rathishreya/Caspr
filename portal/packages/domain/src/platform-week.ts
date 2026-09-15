/**
 * The week, by platform.
 *
 * The Calendar answers "what goes out on Thursday". A person running one workstream asks
 * the other question first — "what is going to LinkedIn this week, and when" — because the
 * platforms have different owners, different rules and different tolerances (operating
 * model ㉛). This is that pivot: platforms down, days across.
 */

import { isUnreviewed, willPublish, type Channel, type ContentItem } from './content-item';
import { zonedDate, zonedTime, type WeekRange } from './week';

export interface PlatformSlot {
  readonly itemId: string;
  readonly time: string;
  readonly title: string;
  /** Nobody has decided it yet. What the queue counts. */
  readonly needsDecision: boolean;
  /**
   * It will go out. Colour follows this, not `needsDecision` — the same predicate the
   * Calendar's HOLDING tag uses, so a held or regenerating post is marked on both screens,
   * and the two never disagree about what is going out on Thursday.
   */
  readonly publishes: boolean;
}

export interface PlatformWeekRow {
  readonly channel: Channel;
  readonly count: number;
  readonly needsDecision: number;
  /** One entry per day of the week, Monday first, each in slot order. */
  readonly days: readonly (readonly PlatformSlot[])[];
}

/**
 * Build the matrix for the given channels, in the order given.
 *
 * A channel with nothing this week still gets a row. An empty row says "nothing is going to
 * this platform", which is information; a missing row says nothing at all.
 */
export function platformWeek(
  week: WeekRange,
  items: readonly ContentItem[],
  channels: readonly Channel[],
): readonly PlatformWeekRow[] {
  const dayIndex = new Map(week.days.map((day, index) => [day.date, index]));

  return channels.map((channel) => {
    const days: PlatformSlot[][] = week.days.map(() => []);
    let count = 0;
    let needsDecision = 0;

    for (const item of items) {
      if (item.channel !== channel || item.scheduledFor === null) continue;
      const index = dayIndex.get(zonedDate(item.scheduledFor));
      if (index === undefined) continue;

      const pending = isUnreviewed(item);
      days[index]?.push({
        itemId: item.id,
        time: zonedTime(item.scheduledFor),
        title: item.title,
        needsDecision: pending,
        publishes: willPublish(item),
      });
      count += 1;
      if (pending) needsDecision += 1;
    }

    for (const slots of days) slots.sort((a, b) => a.time.localeCompare(b.time));
    return { channel, count, needsDecision, days };
  });
}
