import { describe, expect, it } from 'vitest';

import {
  buildWeek,
  estimateLabel,
  shiftWeek,
  weekLabel,
  weekStart,
  zonedDate,
  zonedTime,
  zonedWeekday,
} from './week';

const AUG_20_MIDWEEK = new Date('2026-08-20T09:00:00+05:30');

describe('weekStart', () => {
  it('returns the Monday of the containing week', () => {
    expect(weekStart(AUG_20_MIDWEEK)).toBe('2026-08-17');
  });

  it('treats Monday as the start, not the end', () => {
    expect(weekStart(new Date('2026-08-17T00:30:00+05:30'))).toBe('2026-08-17');
  });

  it('keeps Sunday in the week that opened on the preceding Monday', () => {
    expect(weekStart(new Date('2026-08-23T23:30:00+05:30'))).toBe('2026-08-17');
  });
});

describe('buildWeek', () => {
  const week = buildWeek('2026-08-17', new Date('2026-08-20T09:00:00+05:30'));

  it('produces seven columns, Monday first', () => {
    expect(week.days).toHaveLength(7);
    expect(week.days.map((day) => day.weekdayLabel)).toEqual([
      'MON',
      'TUE',
      'WED',
      'THU',
      'FRI',
      'SAT',
      'SUN',
    ]);
  });

  it('labels the week the way the header reads', () => {
    expect(week.label).toBe('17 – 23 AUG');
  });

  it('names both months when the week straddles one', () => {
    expect(weekLabel('2026-09-28', '2026-10-04')).toBe('28 SEP – 4 OCT');
  });

  it('marks past days so the grid can recede them, and marks exactly one today', () => {
    expect(week.days.filter((day) => day.isPast).map((day) => day.date)).toEqual([
      '2026-08-17',
      '2026-08-18',
      '2026-08-19',
    ]);
    expect(week.days.filter((day) => day.isToday)).toHaveLength(1);
  });

  it('does not read the host clock — the same inputs give the same week anywhere', () => {
    const again = buildWeek('2026-08-17', new Date('2026-08-20T09:00:00+05:30'));
    expect(again).toEqual(week);
  });
});

describe('shiftWeek', () => {
  it('moves by whole weeks in both directions, across a month boundary', () => {
    expect(shiftWeek('2026-08-17', 1)).toBe('2026-08-24');
    expect(shiftWeek('2026-08-17', -1)).toBe('2026-08-10');
    expect(shiftWeek('2026-08-31', 1)).toBe('2026-09-07');
  });
});

describe('zoned rendering', () => {
  it('renders an instant in the console zone, not the host zone', () => {
    // 03:30 UTC is 09:00 in Asia/Kolkata. A host in UTC must still print 09:00.
    expect(zonedTime('2026-08-19T03:30:00Z')).toBe('09:00');
    expect(zonedDate('2026-08-19T03:30:00Z')).toBe('2026-08-19');
  });

  it('names the weekday from the console zone, not the host zone', () => {
    // 20:00 UTC on Sunday is 01:30 Monday in Asia/Kolkata — a different day and a
    // different week. A host in UTC must still say MON.
    expect(zonedWeekday('2026-08-23T20:00:00Z')).toBe('MON');
    expect(zonedWeekday('2026-08-18T03:30:00Z')).toBe('TUE');
  });

  it('keeps a late-evening slot on its own day', () => {
    expect(zonedDate('2026-08-23T12:30:00Z')).toBe('2026-08-23');
    expect(zonedTime('2026-08-23T12:30:00Z')).toBe('18:00');
  });
});

describe('estimateLabel', () => {
  /**
   * Design spec §5A.6 — DM Mono's tilde sits at mid-height and reads as a hyphen at 11px,
   * turning "~16 MIN LEFT" into "-16 MIN LEFT". Hit three times; it is a standing rule.
   */
  it('never emits a tilde', () => {
    expect(estimateLabel(16)).toBe('EST 16 MIN LEFT');
    expect(estimateLabel(16)).not.toContain('~');
  });

  it('floors at zero rather than counting down past the deadline', () => {
    expect(estimateLabel(-4)).toBe('EST 0 MIN LEFT');
  });
});
