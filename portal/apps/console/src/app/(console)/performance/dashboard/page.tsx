import { CAC_CEILING, LAUNCH_BURST_TOTAL, paidEngine } from '@caspr-portal/domain';
import type { Metadata } from 'next';
import Link from 'next/link';

import { Tile } from '@/components/primitives/tile';

export const metadata: Metadata = { title: 'Performance — Dashboard' };

/**
 * Performance ▸ Dashboard — four gates, and what each one is waiting on.
 *
 * ⚑ **This screen exists to be read while nothing is running.** A workstream that shows an
 * empty chart teaches people to stop opening it; a workstream that names the four things
 * standing between here and spend is read by whoever can move one of them.
 *
 * The distinction that governs everything below is `activation-framework.md` §4.2: **the
 * launch burst is not the paid engine.** The burst is one $1,500 line at the peak, safe
 * without a reviewer because it runs on kill rules agreed in advance. The engine is ongoing
 * acquisition, and condition 2 is a person in a seat.
 *
 * ⚑ **The four-condition panel came out 2026-09-16.** The conditions have not changed and
 * `PAID_CONDITIONS` still gates `paidEngine()` — the banner and the first tile read from it.
 * What went is the list, which a person read once and then scrolled past every time after.
 */
export default function PerformanceDashboard() {
  const engine = paidEngine();

  return (
    <>
      <div className="banner">
        <span className="t-meta-bold banner__headline">{engine.headline.toUpperCase()}</span>
        <span className="t-body-s banner__detail">
          All four, not any. Paid traffic arriving at a site with no testimonials and no samples spends the
          one thing that cannot be re-spent — a first impression.
        </span>
      </div>

      <div className="tiles">
        <Tile
          label="CONDITIONS MET"
          value={`${engine.met} / ${engine.total}`}
          attention={engine.state === 'dormant'}
          note="The paid engine is built. It does not run until every one of them holds."
        />
        <Tile label="ONGOING SPEND" value="$0" note="And correctly so. Nothing is being throttled; nothing has been switched on." />
        <Tile
          label="THE LAUNCH BURST"
          value={`$${LAUNCH_BURST_TOTAL.toLocaleString('en-US')}`}
          note="One time, at the peak, governed by the week-4 gate — not by these four conditions. See Paid."
        />
        <Tile
          label="CAC CEILING"
          value={`$${CAC_CEILING}`}
          note="Agreed in advance, which is the point. A threshold set while a campaign runs is set by whoever wants it to keep running."
        />
      </div>

      <Link className="t-label" href="/performance/ads">
        The ads, and which angle each one tests →
      </Link>
    </>
  );
}
