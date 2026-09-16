import { describe, expect, it } from 'vitest';

import {
  CONTENT_SOCIAL_TABS,
  NAV,
  NAV_DESTINATIONS,
  UNBUILT_SLUGS,
  WORKSTREAM_TABS,
  WORKSTREAM_THIRD_TAB,
  destinationBySlug,
} from './nav';

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

/**
 * §12 gives every workstream three tabs, and the third is that workstream's own object.
 * Four of the five are built; a rail row that is `built` and whose tabs point nowhere is the
 * one way this tree can lie, so the two are checked against each other.
 */
describe('the workstream tabs', () => {
  it('gives every built workstream three tabs, starting at its rail destination', () => {
    for (const id of ['content-social', 'seo', 'performance', 'email']) {
      const tabs = WORKSTREAM_TABS[id];
      const destination = NAV_DESTINATIONS.find((d) => d.id === id);
      expect(tabs, id).toHaveLength(3);
      expect(destination?.built, id).toBe(true);
      expect(tabs?.[0]?.href, id).toBe(destination?.href);
    }
  });

  it('names the third tab the same way in the tabs and in the register', () => {
    for (const [id, tabs] of Object.entries(WORKSTREAM_TABS)) {
      expect(WORKSTREAM_THIRD_TAB[id], id).toBe(tabs[2]?.label);
    }
  });

  it('keeps every tab under its own workstream’s path', () => {
    for (const [id, tabs] of Object.entries(WORKSTREAM_TABS)) {
      for (const tab of tabs) expect(tab.href.startsWith(`/${id}/`), `${id} → ${tab.href}`).toBe(true);
    }
  });

  it('leaves Earned Media unbuilt, with its promise recorded', () => {
    expect(NAV_DESTINATIONS.find((d) => d.id === 'earned-media')?.built).toBe(false);
    expect(WORKSTREAM_THIRD_TAB['earned-media']).toBe('Pipeline');
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
