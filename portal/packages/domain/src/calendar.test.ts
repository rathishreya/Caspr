import { describe, expect, it } from 'vitest';

import { buildCalendarWeek, unreviewedBanner } from './calendar';
import type { ContentItem } from './content-item';
import { REFERENCE_WEEK, REFERENCE_WEEK_START } from './reference-week';

const NOW = new Date('2026-08-20T09:00:00+05:30');

function item(overrides: Partial<ContentItem> & Pick<ContentItem, 'id'>): ContentItem {
  return {
    channel: 'x',
    type: 'derivative',
    title: 'Untitled',
    voiceLane: null,
    narrative: 'N1',
    pillar: 'analyst_not_assistant',
    funnelStage: 'awareness',
    icp: null,
    status: 'scheduled',
    assignedReviewer: null,
    scheduledFor: '2026-08-18T09:00:00+05:30',
    citations: [],
    sourceable: 'found',
    hygieneAppliedAt: null,
    topicId: 'topic',
    ...overrides,
  };
}

describe('the reference week matches the frame it was drawn from', () => {
  const calendar = buildCalendarWeek(REFERENCE_WEEK_START, REFERENCE_WEEK, NOW);

  it('reads 22 SCHEDULED · 1 HOLDING, computed rather than stated', () => {
    expect(calendar.counts).toEqual({ scheduled: 22, holding: 1, unreviewed: 1 });
  });

  it('is the full weekly volume the review budget is sized against', () => {
    expect(REFERENCE_WEEK).toHaveLength(23);
  });

  it('leaves Monday to the two runbook fixtures and no content', () => {
    const monday = calendar.columns[0];
    expect(monday?.cards).toHaveLength(0);
    expect(monday?.milestones.map((m) => `${m.time} ${m.label}`)).toEqual([
      '18:00 Review deadline',
      '20:00 Approved content scheduled',
    ]);
  });

  it('orders each day by slot', () => {
    for (const column of calendar.columns) {
      const times = column.cards.map((card) => card.time);
      expect([...times].sort()).toEqual(times);
    }
  });

  it('places every item on a day of the week it was scheduled for', () => {
    const placed = calendar.columns.flatMap((column) => column.cards).length;
    expect(placed).toBe(REFERENCE_WEEK.length);
    expect(calendar.unscheduled).toHaveLength(0);
  });
});

describe('counts follow the publish rule, not the status label', () => {
  /**
   * Build spec §3.6 is absolute: "Unreviewed content never publishes. There is no timeout
   * that pushes it live." Anything that has not been decided must count as holding on the
   * grid, whatever its status is called.
   */
  it.each(['generated', 'linted', 'in_review', 'holding', 'rejected'] as const)(
    'counts a %s item as holding',
    (status) => {
      const calendar = buildCalendarWeek(
        REFERENCE_WEEK_START,
        [item({ id: 'a', status })],
        NOW,
      );
      expect(calendar.counts.holding).toBe(1);
      expect(calendar.counts.scheduled).toBe(0);
      expect(calendar.columns[1]?.cards[0]?.holding).toBe(true);
    },
  );

  it.each(['approved', 'scheduled', 'published'] as const)('counts a %s item as scheduled', (status) => {
    const calendar = buildCalendarWeek(REFERENCE_WEEK_START, [item({ id: 'a', status })], NOW);
    expect(calendar.counts.scheduled).toBe(1);
    expect(calendar.counts.holding).toBe(0);
  });

  it('separates "held by a reviewer" from "nobody has reached it"', () => {
    const calendar = buildCalendarWeek(
      REFERENCE_WEEK_START,
      [item({ id: 'held', status: 'holding' }), item({ id: 'waiting', status: 'in_review' })],
      NOW,
    );
    // Both hold. Only one is unreviewed, and only that one is the banner's business.
    expect(calendar.counts.holding).toBe(2);
    expect(calendar.counts.unreviewed).toBe(1);
    const reasons = calendar.columns[1]?.cards.map((card) => card.holdingReason) ?? [];
    expect(new Set(reasons).size).toBe(2);
  });
});

describe('items outside the week', () => {
  it('excludes a slot in an adjacent week rather than clamping it into view', () => {
    const calendar = buildCalendarWeek(
      REFERENCE_WEEK_START,
      [item({ id: 'next-week', scheduledFor: '2026-08-25T09:00:00+05:30' })],
      NOW,
    );
    expect(calendar.counts.scheduled).toBe(0);
  });

  it('surfaces an item with no slot rather than dropping it', () => {
    const calendar = buildCalendarWeek(
      REFERENCE_WEEK_START,
      [item({ id: 'no-slot', scheduledFor: null })],
      NOW,
    );
    expect(calendar.unscheduled.map((i) => i.id)).toEqual(['no-slot']);
  });
});

describe('unreviewedBanner', () => {
  it('is absent when everything has a decision', () => {
    expect(unreviewedBanner({ scheduled: 23, holding: 0, unreviewed: 0 })).toBeNull();
  });

  it('matches the frame for a single item', () => {
    expect(unreviewedBanner({ scheduled: 22, holding: 1, unreviewed: 1 })?.headline).toBe(
      '1 ITEM UNREVIEWED — IT WILL NOT PUBLISH',
    );
  });

  it('pluralises', () => {
    expect(unreviewedBanner({ scheduled: 19, holding: 4, unreviewed: 4 })?.headline).toBe(
      '4 ITEMS UNREVIEWED — IT WILL NOT PUBLISH',
    );
  });
});
