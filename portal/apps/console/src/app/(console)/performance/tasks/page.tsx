import { PAID_CONDITIONS, paidEngine } from '@caspr-portal/domain';
import type { Metadata } from 'next';
import Link from 'next/link';

import { State } from '@/components/primitives/state';

export const metadata: Metadata = { title: 'Performance — Tasks' };

/**
 * Performance ▸ Tasks.
 *
 * ⚑ **Correctly empty, and it says which.** Design spec §11A: an empty state must name its
 * kind on the first line — finished, unassigned, or correctly empty — because *"the
 * difference between 'you are done', 'come back in an hour' and 'nothing can publish' is the
 * entire message."*
 *
 * There is no paid work this week because there is no paid spend, and there is no paid spend
 * because four conditions do not hold. None of the four is Performance's to close — they sit
 * with activation, a hire, the testimonial programme and `/samples`. So this screen names
 * them and points at where each is actually moving, rather than inventing a queue to look
 * busy.
 */
export default function PerformanceTasks() {
  const engine = paidEngine();

  return (
    <div className="board">
      <State
        kind="empty"
        headline="No paid work this week, and none is missing."
        consequence={`The engine is dormant on ${engine.blocking.length} of ${engine.total} conditions, and not one of them is closed from this workstream. Tasks appear here the week the engine wakes.`}
      />

      <section aria-labelledby="waiting-heading">
        <div className="board-head">
          <h3 id="waiting-heading" className="t-title-m">
            What this is waiting on <span className="board-count t-meta">{engine.blocking.length}</span>
          </h3>
          <span className="board-hint t-body-s">Each sits with another workstream or another person.</span>
        </div>

        <div className="table-scroll">
          <table className="table">
            <thead>
              <tr>
                <th className="t-meta nowrap">Condition</th>
                <th className="t-meta fill">Standing today</th>
                <th className="t-meta nowrap">Established in</th>
              </tr>
            </thead>
            <tbody>
              {PAID_CONDITIONS.map((condition) => (
                <tr key={condition.id}>
                  <td className={condition.met ? 't-body-s' : 't-body-s text-attention'}>{condition.condition}</td>
                  <td className="t-body-s text-secondary">{condition.standing}</td>
                  <td className="t-meta text-tertiary nowrap">{condition.establishedIn}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <p className="t-body-s text-secondary" style={{ maxWidth: '72ch' }}>
        The one thing that does run before any of this is the launch burst — one $1,500 line at the peak,
        on the week-4 gate rather than these four.{' '}
        <Link className="t-label" href="/performance/paid">
          See Paid →
        </Link>
      </p>
    </div>
  );
}
