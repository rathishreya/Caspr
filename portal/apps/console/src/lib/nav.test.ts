import { describe, expect, it } from 'vitest';

import { CONTENT_SOCIAL_TABS, NAV, NAV_DESTINATIONS, UNBUILT_SLUGS, WORKSTREAM_THIRD_TAB, destinationBySlug } from './nav';

/**
 * The navigation tree is design spec §5, and two of its rules are checkable here rather
 * than in review.
 */
describe('the tree', () => {
  it('is the corrected workstream tree, not the retired flat list', () => {
    expect(NAV.map((section) => section.id)).toEqual(['landing', 'workstreams', 'system']);
    // Five workstreams since 2026-09-14 — Earned Media is the fifth (framework §0.1 row 6).
    expect(NAV[1]?.destinations.map((d) => d.id)).toEqual([
      'content-social',
      'seo',
      'performance',
      'email',
      'earned-media',
    ]);
    expect(NAV[2]?.destinations.map((d) => d.id)).toEqual([
      'calendar',
      'dashboard',
      'truth',
      'ledger',
      'admin',
    ]);
  });

  it('gives every destination a purpose, so no rail row is unexplained', () => {
    for (const destination of NAV_DESTINATIONS) {
      expect(destination.purpose.length).toBeGreaterThan(20);
    }
  });
});

/**
 * The tabs changed on 2026-09-16 and the change is worth holding: the queue split in two, and
 * the Library was removed. Both were asked for, and neither should come back by accident —
 * a rebuilt Library tab pointing at a route that no longer exists would 404 in the rail.
 */
describe("Content & Social's tabs", () => {
  it('is Dashboard, This week and Today — the queue split by clock, with no Library', () => {
    expect(CONTENT_SOCIAL_TABS.map((tab) => tab.id)).toEqual(['dashboard', 'tasks', 'today']);
    expect(CONTENT_SOCIAL_TABS.map((tab) => tab.label)).toEqual(['Dashboard', 'This week', 'Today']);
    expect(CONTENT_SOCIAL_TABS.some((tab) => tab.href.includes('library'))).toBe(false);
  });

  it('names the same third tab in the register the rail reads', () => {
    expect(WORKSTREAM_THIRD_TAB['content-social']).toBe(CONTENT_SOCIAL_TABS[2]?.label);
  });

  it('starts at the workstream destination in the rail', () => {
    const workstream = NAV_DESTINATIONS.find((d) => d.id === 'content-social');
    expect(CONTENT_SOCIAL_TABS[0]?.href).toBe(workstream?.href);
  });
});

describe('destinationBySlug', () => {
  /**
   * The regression this exists for: `Content & Social` points at
   * `/content-social/dashboard`, so a suffix match on `/dashboard` returned the built
   * workstream and the System Dashboard stub 404ed. Two destinations here share a last
   * path segment.
   */
  it('does not confuse the System Dashboard with the workstream tab that ends the same way', () => {
    const found = destinationBySlug('dashboard');
    expect(found?.id).toBe('dashboard');
    expect(found?.built).toBe(false);
  });

  it('resolves every slug the not-built route generates', () => {
    for (const slug of UNBUILT_SLUGS) {
      const found = destinationBySlug(slug);
      expect(found, `no destination for /not-built/${slug}`).toBeDefined();
      expect(found?.built).toBe(false);
    }
  });

  it('returns nothing for a slug that is not in the tree', () => {
    expect(destinationBySlug('review-queue')).toBeUndefined();
    expect(destinationBySlug('content-social')).toBeUndefined();
  });

  it('generates a stub for every unbuilt destination and no others', () => {
    const unbuilt = NAV_DESTINATIONS.filter((d) => !d.built);
    expect(UNBUILT_SLUGS).toHaveLength(unbuilt.length);
    expect(UNBUILT_SLUGS).toContain('my-week');
    expect(UNBUILT_SLUGS).not.toContain('calendar');
  });
});
