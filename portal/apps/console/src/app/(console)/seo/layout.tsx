import { nextApproaches, openTasks } from '@caspr-portal/domain';
import type { ReactNode } from 'react';

import { Tabs } from '@/components/primitives/tabs';
import { ScreenHeader } from '@/components/shell/screen-header';
import { WORKSTREAM_TABS } from '@/lib/nav';
import { getRepository } from '@/lib/repository';

/**
 * SEO — or rather, **discoverability**, which is what the channel turned out to be.
 *
 * `docs/seo/decision.md` §1, 2026-08-25: *"The channel is not SEO. It is discoverability —
 * and its fastest, highest-intent components are not search at all."* Three things were
 * bundled under one name and they behave nothing alike: presence reads in weeks, citation in
 * months, ranking in six. Each has its own kill condition, and this workstream's screens are
 * built around that split rather than around a single health number.
 *
 * The rail still says SEO because that is what the team calls the seat. The header says what
 * the seat actually covers.
 */
export const dynamic = 'force-dynamic';

export default async function SeoLayout({ children }: { readonly children: ReactNode }) {
  const repository = getRepository();
  const [approaches, tasks] = await Promise.all([repository.approaches(), repository.seoTasks()]);

  return (
    <>
      <ScreenHeader
        title="SEO"
        meta={<span className="t-meta text-tertiary">DISCOVERABILITY — PRESENCE · CITATION · RANKING</span>}
      />
      {/*
        Tasks carries what a person can do today: the approaches they can actually send plus
        the open task list. Backlog carries what is owed. Neither badge counts rows nobody
        can act on — a lapsed editorial pitch is not work, it is a vacancy.
      */}
      <Tabs
        tabs={WORKSTREAM_TABS['seo'] ?? []}
        label="SEO"
        badges={{ tasks: openTasks(tasks).length, links: nextApproaches(approaches).length }}
      />
      {children}
    </>
  );
}
