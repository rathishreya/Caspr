import { EMAIL_EXCEPTIONS } from '@caspr-portal/domain';
import type { ReactNode } from 'react';

import { Tabs } from '@/components/primitives/tabs';
import { ScreenHeader } from '@/components/shell/screen-header';
import { WORKSTREAM_TABS } from '@/lib/nav';

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

export default function EmailLayout({ children }: { readonly children: ReactNode }) {
  // Nothing is sending, so nothing has raised an exception. The badge counts what has
  // actually fired — never how many kinds of exception exist.
  const firing = EMAIL_EXCEPTIONS.filter(() => false).length;

  return (
    <>
      <ScreenHeader
        title="Email"
        meta={<span className="t-meta text-tertiary">NO STANDING OWNER · EXCEPTIONS ROUTE TO JOY</span>}
      />
      <Tabs tabs={WORKSTREAM_TABS['email'] ?? []} label="Email" badges={{ tasks: firing }} />
      {children}
    </>
  );
}
