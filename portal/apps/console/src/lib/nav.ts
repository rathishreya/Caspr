import type { Route } from 'next';

import type { IconName } from '@/components/icons';

/**
 * The navigation tree — design spec §5.
 *
 * The tree is the corrected one, not the original flat list. §5 records why the flat list
 * failed: it was "an index of how the system works, not how the team thinks", and it left
 * "where do I go?" with no answer because "a filter was doing the job of a destination".
 *
 * Two levels, never three (§5 rule 1). Every level is a decision taken before work starts,
 * and that is what kills ops tools.
 */

export interface NavDestination {
  readonly id: string;
  readonly label: string;
  readonly icon: IconName;
  readonly href: Route;
  /**
   * False for destinations in the tree that this build does not implement.
   *
   * They stay in the rail rather than being removed: the tree is the team's mental model,
   * and a rail that shows only what is finished teaches the wrong shape of the product.
   * They route to a state that names what they will be — nothing in this console
   * dead-ends (§11A).
   */
  readonly built: boolean;
  /** What the destination is for. Shown on the not-built state, and as the link title. */
  readonly purpose: string;
}

export interface NavSection {
  readonly id: string;
  /** Uppercase mono section label, or null for the ungrouped landing destination. */
  readonly label: string | null;
  readonly destinations: readonly NavDestination[];
}

function unbuilt(slug: string): Route {
  return `/not-built/${slug}` as Route;
}

export const NAV: readonly NavSection[] = [
  {
    id: 'landing',
    label: null,
    destinations: [
      {
        id: 'my-week',
        label: 'My Week',
        icon: 'week',
        href: unbuilt('my-week'),
        built: false,
        purpose:
          "Every person's landing. Aggregates review items and tasks across the workstreams they own, and it is the single entry point into review mode.",
      },
    ],
  },
  {
    id: 'workstreams',
    label: 'WORKSTREAMS',
    destinations: [
      {
        id: 'content-social',
        label: 'Content & Social',
        icon: 'content',
        href: '/content-social/dashboard' as Route,
        built: true,
        purpose:
          'The largest workstream. A blog post and its voiced variants are one artefact, which is why content and social are not split.',
      },
      {
        id: 'seo',
        label: 'SEO',
        icon: 'search',
        href: unbuilt('seo'),
        built: false,
        purpose:
          'Search, plus the two backlink routes that moved here when Relationships dissolved: directories and guest posts.',
      },
      {
        id: 'performance',
        label: 'Performance',
        icon: 'paid',
        href: unbuilt('performance'),
        built: false,
        purpose: 'Paid and attribution under one node, because the TL is a performance marketer.',
      },
      {
        id: 'email',
        label: 'Email',
        icon: 'email',
        href: unbuilt('email'),
        built: false,
        purpose: 'Sequences, suppression and the five send preconditions.',
      },
    ],
  },
  {
    id: 'system',
    label: 'SYSTEM',
    destinations: [
      {
        id: 'calendar',
        label: 'Calendar',
        icon: 'calendar',
        href: '/calendar' as Route,
        built: true,
        purpose: 'All-up, filterable by workstream.',
      },
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: 'dashboard',
        href: unbuilt('dashboard'),
        built: false,
        purpose: 'The roll-up across workstreams. Per-workstream dashboards feed it.',
      },
      {
        id: 'truth',
        label: 'Truth',
        icon: 'truth',
        href: unbuilt('truth'),
        built: false,
        purpose:
          'Stale flags. A number moves in a source document and every live page carrying the old one is flagged here.',
      },
      {
        id: 'ledger',
        label: 'Ledger',
        icon: 'ledger',
        href: unbuilt('ledger'),
        built: false,
        purpose:
          "Reject calibration. Every rejection is kept, so the same mistake cannot come back — the portal's compounding asset.",
      },
      {
        id: 'admin',
        label: 'Admin',
        icon: 'settings',
        href: unbuilt('admin'),
        built: false,
        purpose:
          'People, roles and integrations. There is no signup page, so invite from here is the only route in.',
      },
    ],
  },
];

export const NAV_DESTINATIONS: readonly NavDestination[] = NAV.flatMap(
  (section) => section.destinations,
);

/** Slugs the not-built route generates. Derived, so a new stub cannot be forgotten. */
export const UNBUILT_SLUGS: readonly string[] = NAV_DESTINATIONS.filter(
  (destination) => !destination.built,
).map((destination) => destination.href.split('/').at(-1) ?? '');

export function destinationBySlug(slug: string): NavDestination | undefined {
  return NAV_DESTINATIONS.find((destination) => destination.href.endsWith(`/${slug}`));
}

/**
 * Content & Social's tabs.
 *
 * "Dashboard and Tasks are universal. The third tab is that workstream's own object" —
 * §5. For this workstream the own-object is the Library.
 */
export const CONTENT_SOCIAL_TABS = [
  { id: 'dashboard', label: 'Dashboard', href: '/content-social/dashboard' as Route },
  { id: 'tasks', label: 'Tasks', href: '/content-social/tasks' as Route },
  { id: 'library', label: 'Library', href: '/content-social/library' as Route },
] as const;
