/**
 * The daily track's clock.
 *
 * ⚠ **Reverses the 2026-09-10 decision** recorded in `content-engine-runtime-spec.md` §5A.3
 * rule 4 ("after 48 hours unreviewed it DEMOTES. Nothing is discarded"). Changed 2026-09-15
 * at the Content & Social owner's instruction:
 *
 *   "for daily stuff, if it's not approved in 24hr discard it but keep a history of such thing."
 *
 * What the old rule protected is kept in a different form. It demoted rather than discarded
 * because the writing and the sourcing were already paid for. Now the post leaves the queue
 * but not the record: a discarded item keeps its words and its version, and the board lists
 * it under its own heading. What is given up is reuse — a reply to a conversation that has
 * moved on is not published later as a derivative.
 *
 * The window runs from generation, not from when someone first opened it. A daily post
 * answers something happening today; the conversation does not wait for the reviewer.
 */

import { willPublish, type ContentItem } from './content-item';

export const DAILY_WINDOW_HOURS = 24;

export type DailyState =
  | { readonly kind: 'weekly' }
  /**
   * Not approved yet, and inside the window — waiting, held or regenerating alike.
   * `hoursLeft` is whole hours, rounded down, never negative.
   */
  | { readonly kind: 'today'; readonly hoursLeft: number }
  /** Not approved inside the window. Off the queue for good; kept in the history. */
  | { readonly kind: 'discarded'; readonly discardedAt: string }
  /** Approved in time. The clock no longer matters. */
  | { readonly kind: 'decided' };

type Clocked = Pick<ContentItem, 'track' | 'generatedAt' | 'status'>;

/** When the window closes, as an ISO instant. */
export function dailyDeadline(item: Pick<ContentItem, 'generatedAt'>): string {
  return new Date(new Date(item.generatedAt).getTime() + DAILY_WINDOW_HOURS * 3_600_000).toISOString();
}

export function dailyState(item: Clocked, now: Date): DailyState {
  if (item.track === 'weekly') return { kind: 'weekly' };
  if (willPublish(item)) return { kind: 'decided' };

  const deadline = dailyDeadline(item);
  const msLeft = new Date(deadline).getTime() - now.getTime();
  if (item.status === 'discarded' || msLeft <= 0) return { kind: 'discarded', discardedAt: deadline };
  return { kind: 'today', hoursLeft: Math.max(0, Math.floor(msLeft / 3_600_000)) };
}

/**
 * The sweep, as a pure function.
 *
 * The engine writes `discarded` when the window closes. Until that job exists — and in the
 * gap between the window closing and the job running — every read applies the same rule, so
 * no screen can show a post as approvable after its window has closed.
 */
export function sweepDaily<T extends Clocked>(item: T, now: Date): T {
  if (item.status === 'discarded') return item;
  return dailyState(item, now).kind === 'discarded' ? { ...item, status: 'discarded' } : item;
}

/** A daily post that was waiting, held or regenerating when its window closed. */
export function wasDiscarded(item: Clocked): boolean {
  return item.track === 'daily' && item.status === 'discarded';
}
