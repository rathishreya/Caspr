/**
 * The daily track's clock.
 *
 * `content-engine-runtime-spec.md` §5A.3 rule 4, as decided 2026-09-10:
 *
 *   "It never expires — after 48 hours unreviewed it DEMOTES. Nothing is discarded. The item
 *    stops being a *today* item and joins the weekly queue as an ordinary derivative."
 *
 * Why both halves hold: a reply that arrives a week after the conversation ended is not
 * late, it is embarrassing — so it stops being a today item. But the writing and the
 * sourcing are already paid for, so it becomes a normal derivative rather than waste.
 */

import { isUnreviewed, type ContentItem } from './content-item';

export const DAILY_DEMOTE_HOURS = 48;

export type DailyState =
  | { readonly kind: 'weekly' }
  /** Still a today item. `hoursLeft` is whole hours, rounded down, never negative. */
  | { readonly kind: 'today'; readonly hoursLeft: number }
  /** Past 48 hours with no decision: it waits in the weekly queue now, and says why. */
  | { readonly kind: 'demoted' }
  /** Decided in time. The clock no longer matters. */
  | { readonly kind: 'decided' };

export function dailyState(item: Pick<ContentItem, 'track' | 'generatedAt' | 'status'>, now: Date): DailyState {
  if (item.track === 'weekly') return { kind: 'weekly' };
  if (!isUnreviewed(item)) return { kind: 'decided' };

  const ageHours = (now.getTime() - new Date(item.generatedAt).getTime()) / 3_600_000;
  if (ageHours >= DAILY_DEMOTE_HOURS) return { kind: 'demoted' };
  return { kind: 'today', hoursLeft: Math.max(0, Math.floor(DAILY_DEMOTE_HOURS - ageHours)) };
}
