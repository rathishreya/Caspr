import { CHANNEL_PUBLISH_MODE, personName, voiceLane, type Channel, type ContentItem } from '@caspr-portal/domain';

import { CHANNEL_WORKSTREAM } from '@/lib/workstream';

/**
 * The platforms Content & Social publishes to, in the order the board shows them.
 *
 * Derived from `CHANNEL_WORKSTREAM` so a channel moved between workstreams moves here too,
 * and ordered by operating model ㉛: LinkedIn is "the spine", so it leads; the platforms a
 * person posts to by hand follow the automated ones; our own site and the forums close.
 */
const ORDER: readonly Channel[] = [
  'linkedin',
  'linkedin_page',
  'x',
  'instagram',
  'reddit',
  'quora',
  'blog',
  'community',
];

export const CONTENT_SOCIAL_CHANNELS: readonly Channel[] = ORDER.filter(
  (channel) => CHANNEL_WORKSTREAM[channel] === 'content-social',
);

/** Names as a person says them. The uppercase mono channel codes stay for labels. */
export const PLATFORM_NAME: Readonly<Record<Channel, string>> = {
  linkedin: 'LinkedIn',
  linkedin_page: 'LinkedIn Page',
  x: 'X',
  instagram: 'Instagram',
  reddit: 'Reddit',
  quora: 'Quora',
  blog: 'Blog',
  community: 'Forums',
  email: 'Email',
  outreach: 'Outreach',
};

export function isContentSocialChannel(value: string | undefined): value is Channel {
  return CONTENT_SOCIAL_CHANNELS.some((channel) => channel === value);
}

/**
 * Which platforms, and why — operating model ㉛, "who posts what, where, when".
 *
 * Every platform someone might expect is listed, including the ones deliberately left out,
 * because "why is Facebook not here" deserves the same one-line answer as "why is Reddit".
 */
export interface PlatformRole {
  readonly name: string;
  readonly role: string;
  readonly cadence: string;
  readonly on: 'posts' | 'posts_by_hand' | 'engagement' | 'not_a_channel';
}

export const PLATFORM_REGISTER: readonly PlatformRole[] = [
  {
    name: 'LinkedIn',
    role: 'The spine. Our buyer’s working feed — founders and team, each in their own lane.',
    cadence: 'Founder posts Tue and Thu · team 3 a week',
    on: 'posts',
  },
  {
    name: 'LinkedIn Page',
    role: 'The company’s voice. Findings, charts and carousels.',
    cadence: '1 a day',
    on: 'posts',
  },
  {
    name: 'X',
    role: 'Secondary. Investors and technical readers. We publish; we do not read.',
    cadence: '2 a day',
    on: 'posts',
  },
  {
    name: 'Instagram',
    role: 'A repost surface for chart cards. Our buyer does not choose a research tool here, so it costs nothing extra and is expected to earn nothing.',
    cadence: '3 a week · no copy written',
    on: 'posts',
  },
  {
    name: 'Reddit',
    role: 'Highest trust, lowest tolerance. A person posts, never a brand account, never link-first.',
    cadence: '1 a day at most, rotating person and subreddit',
    on: 'posts_by_hand',
  },
  {
    name: 'Quora',
    role: 'The one that compounds. An answer ranks in search and feeds answer engines for years.',
    cadence: '5 short answers a week, each linking to our own page',
    on: 'posts_by_hand',
  },
  {
    name: 'Blog',
    role: 'Our own page. Search answers and analyses — where every other platform links.',
    cadence: '2 search answers a week',
    on: 'posts',
  },
  {
    name: 'Forums',
    role: 'Wall Street Oasis, PrepLounge, ESOMAR — where the ICP already talks shop.',
    cadence: 'Only when a real thread exists',
    on: 'posts_by_hand',
  },
  {
    name: 'Hacker News',
    role: 'Jayant, Dixit and Keshav, as themselves, on technical threads. Never the brand.',
    cadence: '2–3 a week, when relevant',
    on: 'engagement',
  },
  {
    name: 'Facebook',
    role: 'Not a channel. The Page exists so the company looks real to anyone who checks, and mirrors the LinkedIn Page. Nothing is planned or measured on it.',
    cadence: '—',
    on: 'not_a_channel',
  },
  {
    name: 'YouTube · TikTok',
    role: 'Out of scope. Video belongs to the DM team’s editor, not the engine.',
    cadence: '—',
    on: 'not_a_channel',
  },
];

export interface Author {
  readonly name: string;
  readonly detail: string;
  /** Initials for a square avatar — the console has no circles, only the two radii. */
  readonly mark: string;
  /** True for the company's own accounts, which wear the wordmark rather than initials. */
  readonly company: boolean;
}

/** Who the reader will see this post come from. */
export function authorOf(item: ContentItem): Author {
  if (item.voiceLane === null) {
    return {
      name: 'Caspr',
      detail: item.channel === 'blog' ? 'caspr.ai' : 'Company account',
      mark: 'C',
      company: true,
    };
  }
  const lane = voiceLane(item.voiceLane);
  const name = personName(item.voiceLane);
  return {
    name,
    detail:
      CHANNEL_PUBLISH_MODE[item.channel] === 'human_only'
        ? `Posts by hand, from ${name}'s own account`
        : `${lane?.role ?? 'Team'} · Caspr`,
    mark: name.slice(0, 1).toUpperCase(),
    company: false,
  };
}
