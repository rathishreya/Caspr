import { CHANNEL_PUBLISH_MODE, personName, voiceLane, type Channel, type ContentItem } from '@caspr-portal/domain';

import { CHANNEL_WORKSTREAM } from '@/lib/workstream';

/**
 * The platforms Content & Social publishes to, in the order the board shows them.
 *
 * Derived from `CHANNEL_WORKSTREAM` so a channel moved between workstreams moves here too,
 * and ordered by the platform matrix's own ranking — LinkedIn is "the spine" (operating
 * model ㉛), so it leads.
 */
const ORDER: readonly Channel[] = ['linkedin', 'linkedin_page', 'x', 'blog', 'community'];

export const CONTENT_SOCIAL_CHANNELS: readonly Channel[] = ORDER.filter(
  (channel) => CHANNEL_WORKSTREAM[channel] === 'content-social',
);

/** Names as a person says them. The uppercase mono channel codes stay for labels. */
export const PLATFORM_NAME: Readonly<Record<Channel, string>> = {
  linkedin: 'LinkedIn',
  linkedin_page: 'LinkedIn Page',
  x: 'X',
  blog: 'Blog',
  community: 'Community',
  email: 'Email',
  outreach: 'Outreach',
};

export function isContentSocialChannel(value: string | undefined): value is Channel {
  return CONTENT_SOCIAL_CHANNELS.some((channel) => channel === value);
}

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
