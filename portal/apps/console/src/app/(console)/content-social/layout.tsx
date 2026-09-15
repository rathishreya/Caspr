import { REFERENCE_WEEK_START, isUnreviewed } from '@caspr-portal/domain';
import type { ReactNode } from 'react';

import { Tabs } from '@/components/primitives/tabs';
import { ScreenHeader } from '@/components/shell/screen-header';
import { CONTENT_SOCIAL_TABS } from '@/lib/nav';
import { getRepository } from '@/lib/repository';
import { CHANNEL_WORKSTREAM } from '@/lib/workstream';

/**
 * Content & Social.
 *
 * One workstream, not two. §5, decision taken by Joy 2026-08-20: "A blog post and its
 * seven voiced variants are one artefact; splitting them would break the repurposing flow
 * the CMS is built around."
 *
 * The title and tab strip live in the layout so the three tabs cannot drift apart — a tab
 * that renders its own header is a tab that will eventually render a different one.
 */
/**
 * Rendered per request. Every tab reads the review queue, and a decision taken on one tab
 * has to be true on the others the moment it commits — a prerendered badge that still says
 * six after the sixth approval is the kind of number people learn to stop reading.
 */
export const dynamic = 'force-dynamic';

export default async function ContentSocialLayout({ children }: { readonly children: ReactNode }) {
  const items = await getRepository().itemsForWeek(REFERENCE_WEEK_START);
  const waiting = items.filter(
    (item) => CHANNEL_WORKSTREAM[item.channel] === 'content-social' && isUnreviewed(item),
  ).length;

  return (
    <>
      <ScreenHeader title="Content & Social" />
      <Tabs tabs={CONTENT_SOCIAL_TABS} label="Content & Social" badges={{ tasks: waiting }} />
      {children}
    </>
  );
}
