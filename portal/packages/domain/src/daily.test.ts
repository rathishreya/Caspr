import { describe, expect, it } from 'vitest';

import { DAILY_WINDOW_HOURS, dailyDeadline, dailyState, sweepDaily } from './daily';
import { REFERENCE_NOW } from './reference-engagement';
import { REFERENCE_DAILY_HISTORY, REFERENCE_WEEK } from './reference-week';

const generated = '2026-08-17T08:15:00+05:30';
const hoursAfter = (h: number) => new Date(new Date(generated).getTime() + h * 3_600_000);
const daily = (status: 'in_review' | 'holding' | 'rejected' | 'approved' | 'discarded') =>
  ({ track: 'daily', generatedAt: generated, status }) as const;

describe('dailyState — 24 hours to approve, or discarded (2026-09-15)', () => {
  it('ignores the weekly track entirely', () => {
    expect(dailyState({ track: 'weekly', generatedAt: generated, status: 'in_review' }, hoursAfter(100))).toEqual({
      kind: 'weekly',
    });
  });

  it('counts down whole hours while it is still a today item', () => {
    expect(dailyState(daily('in_review'), hoursAfter(5.75))).toEqual({ kind: 'today', hoursLeft: 18 });
  });

  it('keeps counting while a post is held or regenerating — neither is an approval', () => {
    expect(dailyState(daily('holding'), hoursAfter(23.5))).toEqual({ kind: 'today', hoursLeft: 0 });
    expect(dailyState(daily('rejected'), hoursAfter(30))).toEqual({
      kind: 'discarded',
      discardedAt: dailyDeadline({ generatedAt: generated }),
    });
  });

  it('discards at exactly 24 hours, not a minute later', () => {
    expect(dailyState(daily('in_review'), hoursAfter(DAILY_WINDOW_HOURS - 1 / 60)).kind).toBe('today');
    expect(dailyState(daily('in_review'), hoursAfter(DAILY_WINDOW_HOURS)).kind).toBe('discarded');
  });

  it('stops counting once someone has approved it', () => {
    expect(dailyState(daily('approved'), hoursAfter(60))).toEqual({ kind: 'decided' });
  });

  it('dates the discard to the window closing, however late it is read', () => {
    expect(dailyState(daily('discarded'), hoursAfter(200))).toEqual({
      kind: 'discarded',
      discardedAt: new Date('2026-08-18T08:15:00+05:30').toISOString(),
    });
  });

  it('gives the reference daily posts 18 hours on Monday afternoon', () => {
    const now = new Date(REFERENCE_NOW);
    for (const item of REFERENCE_WEEK.filter((i) => i.track === 'daily')) {
      expect(dailyState(item, now)).toEqual({ kind: 'today', hoursLeft: 18 });
    }
  });
});

describe('sweepDaily', () => {
  const now = new Date(REFERENCE_NOW);

  /** The history is kept: the item survives with its words, only its status changes. */
  it('discards both weekend posts, whether or not the engine wrote it yet', () => {
    const swept = REFERENCE_DAILY_HISTORY.map((item) => sweepDaily(item, now));
    expect(swept.map((item) => item.status)).toEqual(['discarded', 'discarded']);
    expect(swept.map((item) => item.id)).toEqual(REFERENCE_DAILY_HISTORY.map((item) => item.id));
  });

  it('never touches a weekly post, or a daily post still inside its window', () => {
    for (const item of REFERENCE_WEEK) expect(sweepDaily(item, now)).toBe(item);
  });

  /** A timeout that takes a post off the queue — never one that publishes it. */
  it('never turns an unapproved post into one that publishes', () => {
    const swept = sweepDaily({ ...daily('in_review'), id: 'x' }, hoursAfter(30));
    expect(swept.status).toBe('discarded');
  });
});
