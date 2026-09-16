import { REFERENCE_RANKS, openBacklog, rankPlay, REFERENCE_BACKLOG } from '@caspr-portal/domain';
import type { ReactNode } from 'react';

import { Tabs } from '@/components/primitives/tabs';
import { ScreenHeader } from '@/components/shell/screen-header';
import { WORKSTREAM_TABS } from '@/lib/nav';

/**
 * SEO.
 *
 * Two halves, and they answer different questions. `p` asks *"do we exist at the moment the
 * buyer looks"* — four surfaces, per ICP, monthly, and frozen for a year. The rank read-out
 * asks *"and if not, why not"*, and `activation-framework.md` §0.5 decision 28 keeps it
 * deliberately **outside** `p`.
 *
 * The owner also carries `p` reading zero until the earned-media hire lands (§12).
 */
export const dynamic = 'force-dynamic';

export default function SeoLayout({ children }: { readonly children: ReactNode }) {
  // Tasks is what the read-out implies — a question with no page, or a page that does not
  // rank. Backlog is what someone has already picked up. The two badges are different work.
  const plays = REFERENCE_RANKS.filter((row) => {
    const { play } = rankPlay(row);
    return play === 'write_the_page' || play === 'the_page_does_not_rank' || play === 'get_listed';
  }).length;

  return (
    <>
      <ScreenHeader title="SEO" />
      <Tabs
        tabs={WORKSTREAM_TABS['seo'] ?? []}
        label="SEO"
        badges={{ tasks: plays, backlog: openBacklog(REFERENCE_BACKLOG).length }}
      />
      {children}
    </>
  );
}
