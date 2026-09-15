import { describe, expect, it } from 'vitest';

import { DAILY_DEMOTE_HOURS, dailyState } from './daily';
import { REFERENCE_NOW } from './reference-engagement';
import { REFERENCE_WEEK } from './reference-week';

const generated = '2026-08-17T08:15:00+05:30';
const hoursAfter = (h: number) => new Date(new Date(generated).getTime() + h * 3_600_000);

describe('dailyState — runtime spec §5A.3 rule 4', () => {
  it('ignores the weekly track entirely', () => {
    expect(dailyState({ track: 'weekly', generatedAt: generated, status: 'in_review' }, hoursAfter(100))).toEqual({
      kind: 'weekly',
    });
  });

  it('counts down whole hours while it is still a today item', () => {
    expect(dailyState({ track: 'daily', generatedAt: generated, status: 'in_review' }, hoursAfter(5.75))).toEqual({
      kind: 'today',
      hoursLeft: 42,
    });
  });

  /** "Nothing is discarded. The item stops being a today item and joins the weekly queue." */
  it('demotes at 48 hours — it does not expire', () => {
    const state = dailyState({ track: 'daily', generatedAt: generated, status: 'in_review' }, hoursAfter(DAILY_DEMOTE_HOURS));
    expect(state).toEqual({ kind: 'demoted' });
  });

  it('stops counting once someone has decided it', () => {
    expect(dailyState({ track: 'daily', generatedAt: generated, status: 'approved' }, hoursAfter(60))).toEqual({
      kind: 'decided',
    });
  });

  it('gives the reference daily posts 42 hours on Monday afternoon', () => {
    const now = new Date(REFERENCE_NOW);
    for (const item of REFERENCE_WEEK.filter((i) => i.track === 'daily')) {
      expect(dailyState(item, now)).toEqual({ kind: 'today', hoursLeft: 42 });
    }
  });
});
