import type { ReactNode } from 'react';

import { Rail } from '@/components/shell/rail';
import { getSession } from '@/lib/session';

/**
 * Two zones: the rail and one work area. Never three. Design spec §1 decision 3.
 *
 * The under-900 message is rendered alongside the console rather than instead of it, and
 * CSS picks. §10 and frame `65:1584`: it "routes to the Personal Queue rather than
 * dead-ending", because that is what a phone user is almost always there to do.
 */
export function Shell({ children }: { readonly children: ReactNode }) {
  const session = getSession();

  return (
    <>
      <div className="shell">
        <Rail session={session} />
        <main className="work">{children}</main>
      </div>
      <NarrowRoute />
    </>
  );
}

function NarrowRoute() {
  return (
    <div className="narrow-route">
      {/*
        Deliberately not the rail's classes: those carry the 900–1179 collapse rules,
        which would hide the wordmark on the very screen that has no rail to collapse.
      */}
      <div className="t-wordmark">
        Caspr<span className="narrow-route__dot">.</span>{' '}
        <span className="t-meta narrow-route__team">TEAM</span>
      </div>
      <div className="stack">
        <h1 className="t-title-l">The console is a desk instrument.</h1>
        <p className="t-body-m text-secondary">
          Review is a desk act — the densest screen in the product, and designing it for a phone
          would compromise it. Open this on a screen 900px or wider.
        </p>
        <p className="t-body-m text-secondary">
          If you came here to approve your own posts or leave your comments for the week, that lives
          on the Personal Queue, which is built for a phone.
        </p>
        {/*
          A real destination, not a dead end. The Personal Queue is a separate surface for
          the seven core-team members who never open the console (§5 rule 4).
        */}
        <a className="t-label" href="/personal-queue" style={{ color: 'var(--accent-attention)' }}>
          Go to the Personal Queue →
        </a>
      </div>
    </div>
  );
}
