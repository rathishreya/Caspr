import { CAC_CEILING, LAUNCH_BURST_TOTAL, PAID_CONDITIONS, paidEngine } from '@caspr-portal/domain';
import type { Metadata } from 'next';
import Link from 'next/link';

import { Icon } from '@/components/icons';
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

      <section className="panel panel--wide">
        <div className="panel__title">
          <h2 className="t-title-m">The four conditions</h2>
          <span className="t-meta text-tertiary">ACTIVATION FRAMEWORK §4.1 · ALL FOUR, NOT ANY</span>
        </div>

        <div className="gates">
          {PAID_CONDITIONS.map((condition) => (
            <div key={condition.id} className={condition.met ? 'gate gate--met' : 'gate'}>
              <span className="gate__mark">
                <Icon name={condition.met ? 'check' : 'close'} size={16} />
              </span>
              <div className="gate__body">
                <p className="t-title-m">{condition.condition}</p>
                <p className="t-body-s text-secondary">{condition.standing}</p>
                <p className="t-meta text-tertiary">{condition.establishedIn}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="t-body-s text-secondary" style={{ marginTop: 'var(--space-4)' }}>
          ⚠ At the peak, condition 2 may still be unmet — the hire lands in 8&ndash;12 weeks. The burst may
          run anyway, because it carries its own kill rules. The ongoing engine may not, because a paused
          campaign with nobody to diagnose it is a paused campaign forever.
        </p>
      </section>

      <p className="t-body-s text-secondary" style={{ maxWidth: '72ch' }}>
        <strong>Why this workstream is empty and that is the plan.</strong> Performance
        is one of five workstreams and the only one whose correct state today is off. The owner is a new
        hire who is also hired explicitly to disagree — to read x and p and argue with the kill conditions —
        which is the function the TL&rsquo;s departure actually removed.{' '}
        <Link className="t-label" href="/performance/paid">
          The burst, the kill rules and Meta →
        </Link>
      </p>
    </>
  );
}
