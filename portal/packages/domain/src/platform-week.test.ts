import { describe, expect, it } from 'vitest';

import { platformWeek } from './platform-week';
import { REFERENCE_WEEK, REFERENCE_WEEK_START } from './reference-week';
import { buildWeek } from './week';

const WEEK = buildWeek(REFERENCE_WEEK_START, new Date('2026-08-17T14:00:00+05:30'));
const CHANNELS = ['linkedin', 'linkedin_page', 'x', 'blog', 'community'] as const;

describe('platformWeek', () => {
  const rows = platformWeek(WEEK, REFERENCE_WEEK, CHANNELS);

  it('keeps the channel order it was given', () => {
    expect(rows.map((row) => row.channel)).toEqual([...CHANNELS]);
  });

  it('counts every Content & Social post exactly once', () => {
    expect(rows.reduce((sum, row) => sum + row.count, 0)).toBe(19);
    expect(Object.fromEntries(rows.map((row) => [row.channel, row.count]))).toEqual({
      linkedin: 6,
      linkedin_page: 2,
      x: 5,
      blog: 4,
      community: 2,
    });
  });

  it('carries the six posts waiting on a decision', () => {
    expect(rows.reduce((sum, row) => sum + row.needsDecision, 0)).toBe(6);
  });

  it('puts each post on its own day, Monday first', () => {
    const linkedin = rows.find((row) => row.channel === 'linkedin')!;
    expect(linkedin.days).toHaveLength(7);
    expect(linkedin.days[0]).toEqual([]);
    expect(linkedin.days[1]?.map((slot) => slot.time)).toEqual(['09:00']);
    expect(linkedin.days[2]?.map((slot) => slot.time)).toEqual(['09:00', '18:00']);
  });

  /**
   * The matrix and the Calendar answer the same question — what goes out — so they mark the
   * same posts. A held post is not waiting on a decision in the queue's sense, and it still
   * does not publish.
   */
  it('marks a held post as not going out without counting it as waiting', () => {
    const held = REFERENCE_WEEK.map((item) =>
      item.id === 'ci-0420-04' ? { ...item, status: 'holding' as const } : item,
    );
    const x = platformWeek(WEEK, held, CHANNELS).find((row) => row.channel === 'x')!;
    const slot = x.days.flat().find((s) => s.itemId === 'ci-0420-04')!;
    expect(slot.needsDecision).toBe(false);
    expect(slot.publishes).toBe(false);
    expect(x.needsDecision).toBe(0);
  });

  it('keeps a row for a platform with nothing this week', () => {
    const empty = platformWeek(WEEK, [], CHANNELS);
    expect(empty).toHaveLength(5);
    expect(empty.every((row) => row.count === 0)).toBe(true);
  });
});
