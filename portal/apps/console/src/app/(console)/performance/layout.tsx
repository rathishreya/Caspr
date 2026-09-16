import { paidEngine } from '@caspr-portal/domain';
import type { ReactNode } from 'react';

import { Tabs } from '@/components/primitives/tabs';
import { ScreenHeader } from '@/components/shell/screen-header';
import { WORKSTREAM_TABS } from '@/lib/nav';
import { getRepository } from '@/lib/repository';

/**
 * Performance.
 *
 * **Dormant by design**, and the console's job is to show why rather than to show nothing.
 * `activation-framework.md` §4 lists the paid engine as "built, dormant"; §4.1 gives four
 * conditions that must all hold before it wakes, and none of them is a date.
 */
export const dynamic = 'force-dynamic';

export default async function PerformanceLayout({ children }: { readonly children: ReactNode }) {
  const engine = paidEngine();
  const drafts = (await getRepository().ads()).filter((ad) => ad.state === 'draft').length;

  return (
    <>
      <ScreenHeader
        title="Performance"
        meta={
          <span className="t-meta text-tertiary">
            {engine.state === 'dormant' ? 'DORMANT — 4 GATES' : 'READY'}
          </span>
        }
      />
      {/*
        ⛔ No badge on Tasks or Paid. A badge means "this needs you", and the four unmet
        conditions do not: activation, a hire, the testimonial programme and /samples close
        from other workstreams. The standing belongs in the header, which is where it is.
        ✅ Ads does carry one — a drafted ad genuinely waits on a person here, and it can be
        approved today even though nothing spends until the gates open.
      */}
      <Tabs tabs={WORKSTREAM_TABS['performance'] ?? []} label="Performance" badges={{ ads: drafts }} />
      {children}
    </>
  );
}
