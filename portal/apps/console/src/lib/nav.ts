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
        href: '/seo/dashboard' as Route,
        built: true,
        purpose:
          'p — presence per ICP, frozen for a year — and the rank read-out that says why a question misses. Plus directories and backlink conversations, the two routes that stayed when Relationships dissolved.',
      },
      {
        id: 'performance',
        label: 'Performance',
        icon: 'paid',
        href: '/performance/dashboard' as Route,
        built: true,
        purpose:
          'Spend, and the four gates that hold it shut. Dormant by design — the console shows why rather than showing nothing.',
      },
      {
        id: 'email',
        label: 'Email',
        icon: 'email',
        href: '/email/dashboard' as Route,
        built: true,
        purpose:
          'Four streams, never merged. No standing owner — it runs once approved, and every exception pauses itself and reaches Joy.',
      },
      {
        id: 'earned-media',
        label: 'Earned Media',
        icon: 'earned',
        href: unbuilt('earned-media'),
        built: false,
        purpose:
          'The fifth workstream, added 2026-09-14. Exclusives, pitches, podcasts, expert practitioners and the creator pipeline — every author who replies to one of our comments. Owned by the earned-media hire; until they land, editorial pitching lapses and the pipeline accumulates.',
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

export const UNBUILT_PREFIX = '/not-built/';

/** Slugs the not-built route generates. Derived, so a new stub cannot be forgotten. */
export const UNBUILT_SLUGS: readonly string[] = NAV_DESTINATIONS.filter(
  (destination) => !destination.built,
).map((destination) => destination.href.slice(UNBUILT_PREFIX.length));

/**
 * ⚠ Matched on the whole path, not on a suffix.
 *
 * A suffix match looked equivalent and was not: `Content & Social` points at
 * `/content-social/dashboard`, which ends with `/dashboard`, so `destinationBySlug('dashboard')`
 * returned the built workstream and the System Dashboard stub 404ed. Two destinations in
 * this tree share a last path segment, and more will.
 */
export function destinationBySlug(slug: string): NavDestination | undefined {
  return NAV_DESTINATIONS.find((destination) => destination.href === `${UNBUILT_PREFIX}${slug}`);
}

/**
 * Content & Social's tabs.
 *
 * ⚑ **Changed 2026-09-16**, both halves at the workstream owner's request.
 *
 * **Tasks became two tabs** — *"daily & weekly stuff ko alag rakh, so that it is manageable
 * for the team."* That is Joy's own split, in `activation-framework.md` §10: **one queue, two
 * drains**. Weekly is 72 hours of shelf life or more, generated Thursday and reviewed to
 * Monday 18:00; daily is everything under it, cleared the same day. Two audiences, two
 * rhythms, and putting them in one list meant the 24-hour clock was buried under posts that
 * had until Monday.
 *
 * **Library was removed** — *"remove library from content & social."* §5 wanted a third tab
 * that is "that workstream's own object", and the Library was a browse surface for posts
 * already visible in the queue and the Calendar. A tab nobody opens is worse than no tab: it
 * competes for the one glance a person gives the row.
 *
 * So the own-object here is now **Today**, which is a real object — the morning queue, the
 * 24-hour clock, and the history of what the window closed on.
 */
export interface WorkstreamTab {
  readonly id: string;
  readonly label: string;
  readonly href: Route;
}

/**
 * Every workstream's tabs — `activation-framework.md` §12.
 *
 * *"Dashboard and Tasks are universal. The third tab is that workstream's own object."* The
 * third tab is where each workstream stops looking like the others, and §12 names them:
 * Backlog · Paid · Sequences · Pipeline.
 *
 * ⚑ **Content & Social is the exception and has been since 2026-09-16**: its Tasks split in
 * two along Joy's own §10 line — 72 hours of shelf life or more is This week, under it is
 * Today — so its own-object tab is Today rather than a fourth thing.
 */
export const WORKSTREAM_TABS: Readonly<Record<string, readonly WorkstreamTab[]>> = {
  'content-social': [
    { id: 'dashboard', label: 'Dashboard', href: '/content-social/dashboard' as Route },
    { id: 'tasks', label: 'This week', href: '/content-social/tasks' as Route },
    { id: 'today', label: 'Today', href: '/content-social/today' as Route },
  ],
  /**
   * ⚑ **Four tabs, not three** — 2026-09-16, on the workstream owner's ask that the whole
   * site's and every post's SEO be managed from here.
   *
   * §12 gives SEO "Dashboard · Tasks · Backlog", and Backlog was a thin surface: a to-do list
   * beside the to-do list. What was actually missing is the thing an SEO person opens first —
   * **the site**. So the workstream's own object is two objects, and each tab answers one
   * plain question:
   *
   *   Dashboard  how are we doing?      the three clocks
   *   Pages      is the site right?     every page and post, what is wrong, how to fix it
   *   Links      are links coming in?   the routes, the target list, the entity
   *   Tasks      what do I do today?    the week
   *
   * The backlog did not disappear: its debt is in Tasks, its standard and its families are in
   * Pages, and its target list is in Links — each next to the work it governs rather than in
   * a list of its own.
   */
  seo: [
    { id: 'dashboard', label: 'Dashboard', href: '/seo/dashboard' as Route },
    { id: 'pages', label: 'Pages', href: '/seo/pages' as Route },
    { id: 'links', label: 'Links', href: '/seo/links' as Route },
    { id: 'tasks', label: 'Tasks', href: '/seo/tasks' as Route },
  ],
  /**
   * ⚑ **Ads joined Performance 2026-09-16.** §12 gives it Dashboard · Tasks · Paid, and Paid
   * is the money — the burst, the kill rules, Meta's reality. The ads themselves had nowhere
   * to live, and they are the workstream's actual object: every ad we would run, the angle it
   * tests, its copy, its creative and whether it is working.
   */
  performance: [
    { id: 'dashboard', label: 'Dashboard', href: '/performance/dashboard' as Route },
    { id: 'ads', label: 'Ads', href: '/performance/ads' as Route },
    { id: 'tasks', label: 'Tasks', href: '/performance/tasks' as Route },
    { id: 'paid', label: 'Paid', href: '/performance/paid' as Route },
  ],
  email: [
    { id: 'dashboard', label: 'Dashboard', href: '/email/dashboard' as Route },
    { id: 'tasks', label: 'Tasks', href: '/email/tasks' as Route },
    { id: 'sequences', label: 'Sequences', href: '/email/sequences' as Route },
  ],
};

/** Content & Social's tabs, by the name the rest of the app already imports. */
export const CONTENT_SOCIAL_TABS = WORKSTREAM_TABS['content-social'] as readonly WorkstreamTab[];

/**
 * The third tab of each workstream — §12. Kept for Earned Media, which is still unbuilt:
 * the not-built state names what a destination will be, and "Tasks · Pipeline" is a more
 * honest promise than "coming soon".
 */
export const WORKSTREAM_THIRD_TAB: Readonly<Record<string, string>> = {
  'content-social': 'Today',
  // SEO's own object is the site. §12 said "Backlog"; that turned out to be a to-do list
  // beside the to-do list, and the thing actually missing was every page and post.
  seo: 'Pages',
  // Performance's own object is the ad set; Paid is the money around it.
  performance: 'Ads',
  email: 'Sequences',
  'earned-media': 'Pipeline',
};
