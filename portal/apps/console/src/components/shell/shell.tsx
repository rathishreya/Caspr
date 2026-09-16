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
        <h1 className="t-title-l">Open the console on a laptop or desktop.</h1>
        <p className="t-body-m text-secondary">
          Reviewing posts is done at a desk. It is the densest screen in the product, and squeezing it
          onto a phone would make every decision on it worse.
        </p>
        <p className="t-body-m text-secondary">
          Approving your own posts and leaving your comments for the week will live on the Personal
          Queue, which is built for a phone. It is specified and not built yet.
        </p>
        {/*
          Corrected 2026-09-15: this was a link to /personal-queue, which does not exist, so a
          screen meant to route instead ended on a 404. Until the queue is built the honest
          thing is to say so — design spec §11A: an empty state must say which kind it is.
        */}
      </div>
    </div>
  );
}
