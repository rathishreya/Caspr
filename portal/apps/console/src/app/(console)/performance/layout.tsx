import { paidEngine } from '@caspr-portal/domain';
import type { ReactNode } from 'react';

import { Tabs } from '@/components/primitives/tabs';
import { ScreenHeader } from '@/components/shell/screen-header';
import { WORKSTREAM_TABS } from '@/lib/nav';

/**
 * Performance.
 *
 * **Dormant by design**, and the console's job is to show why rather than to show nothing.
 * `activation-framework.md` §4 lists the paid engine as "built, dormant"; §4.1 gives four
 * conditions that must all hold before it wakes, and none of them is a date.
 */
export const dynamic = 'force-dynamic';

export default function PerformanceLayout({ children }: { readonly children: ReactNode }) {
  const engine = paidEngine();

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
        ⛔ No badge, on any tab. A badge means "this needs you", and nothing here does: the
        four unmet conditions are activation, a hire, the testimonial programme and
        /samples — not one of them closes from this workstream. The count belongs in the
        header, as a standing, which is where it is.
      */}
      <Tabs tabs={WORKSTREAM_TABS['performance'] ?? []} label="Performance" />
      {children}
    </>
  );
}
