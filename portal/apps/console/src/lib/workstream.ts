import type { Channel } from '@caspr-portal/domain';

/**
 * Which workstream owns a channel.
 *
 * The Calendar is "all-up, filterable by workstream" (design spec §5), and a filter needs
 * a mapping. It is written down here, once, because two of the four assignments are
 * decisions rather than obvious facts:
 *
 *  · **blog → Content & Social.** §11 retires the standalone Blog CMS into
 *    Content & Social ▸ Tasks. The blog is not an SEO surface that marketing borrows; it
 *    is the workstream's own object being published.
 *
 *  · **outreach → SEO.** When Relationships dissolved (§5), its work redistributed:
 *    "guest posts and directories → SEO (both are backlink routes) · podcasts and
 *    community threads → Content & Social". A Quirks.com pitch is a guest post.
 *
 * `community` follows the same sentence in the other direction, and `email` is its own
 * workstream. Performance owns no content channel — it owns spend.
 */
export const CHANNEL_WORKSTREAM: Readonly<Record<Channel, string>> = {
  linkedin: 'content-social',
  linkedin_page: 'content-social',
  x: 'content-social',
  blog: 'content-social',
  community: 'content-social',
  outreach: 'seo',
  email: 'email',
};

export const WORKSTREAM_FILTERS = [
  { id: 'all', label: 'ALL' },
  { id: 'content-social', label: 'CONTENT & SOCIAL' },
  { id: 'seo', label: 'SEO' },
  { id: 'email', label: 'EMAIL' },
] as const;

export type WorkstreamFilter = (typeof WORKSTREAM_FILTERS)[number]['id'];

export function isWorkstreamFilter(value: string | undefined): value is WorkstreamFilter {
  return WORKSTREAM_FILTERS.some((filter) => filter.id === value);
}

export function matchesWorkstream(channel: Channel, filter: WorkstreamFilter): boolean {
  return filter === 'all' || CHANNEL_WORKSTREAM[channel] === filter;
}
