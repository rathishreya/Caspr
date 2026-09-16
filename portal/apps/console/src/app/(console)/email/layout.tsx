import type { ReactNode } from 'react';

import { Tabs } from '@/components/primitives/tabs';
import { ScreenHeader } from '@/components/shell/screen-header';
import { WORKSTREAM_TABS } from '@/lib/nav';
import { getRepository } from '@/lib/repository';

/**
 * Email.
 *
 * ⚑ **The surface with no owner** — `activation-framework.md` §0.5 decision 25 and §8.5:
 * *"Email has no standing owner — it runs once approved. Joy owns the exceptions."* And the
 * line that decides the whole shape of these three screens: **on a normal week, nobody
 * touches email.**
 *
 * So Email is not a queue. It is a statement of what is running and what has stopped itself,
 * and the Tasks tab holds exceptions rather than work. A surface that asked someone to check
 * on email daily would be the wrong shape for a thing designed to need nobody.
 *
 * The surface stays **reassignable to any user**, which is why nothing here names a person
 * except where the spec does.
 */
export const dynamic = 'force-dynamic';

export default async function EmailLayout({ children }: { readonly children: ReactNode }) {
  // The badge counts what actually waits on a person: emails needing sign-off. Exceptions
  // would count too, and none has fired — nothing is sending.
  const drafts = (await getRepository().emails()).filter((email) => email.state === 'draft').length;

  return (
    <>
      <ScreenHeader
        title="Email"
        meta={<span className="t-meta text-tertiary">NO STANDING OWNER · EXCEPTIONS ROUTE TO JOY</span>}
      />
      <Tabs tabs={WORKSTREAM_TABS['email'] ?? []} label="Email" badges={{ tasks: drafts }} />
      {children}
    </>
  );
}
