import { COLD_KILL_SAMPLE, COMPLAINT_INVESTIGATE, EMAIL_EXCEPTIONS } from '@caspr-portal/domain';
import type { Metadata } from 'next';

import { State } from '@/components/primitives/state';

export const metadata: Metadata = { title: 'Email — Tasks' };

/**
 * Email ▸ Tasks — the exceptions, which are the whole job.
 *
 * ⚑ **This tab holds exceptions, not work**, because §8.5 designs the workstream to need
 * nobody: *"once approved, email needs no standing owner. It needs someone to receive the
 * exceptions, and every exception pauses itself first."*
 *
 * **The ordering is the design.** Each row stops sending *before* it tells a person — a
 * reviewer who has to notice a deliverability breach in order to stop it will notice it on
 * Monday, by which point the domain is already burnt.
 */
export default function EmailTasks() {
  // Nothing is sending, so nothing has fired. Shown as the empty state it is, with the
  // exceptions listed underneath as what would arrive here rather than as arrivals.
  const firing: readonly string[] = [];

  return (
    <div className="board">
      {firing.length === 0 ? (
        <State
          kind="empty"
          headline="No exception is open."
          consequence="Correctly empty, and on a normal week it stays that way — nothing sends yet, and once it does, email is designed to run without anyone opening this tab."
        />
      ) : null}

      <section aria-labelledby="exceptions-heading">
        <div className="board-head">
          <h3 id="exceptions-heading" className="t-title-m">
            What would arrive here <span className="board-count t-meta">{EMAIL_EXCEPTIONS.length}</span>
          </h3>
          <span className="board-hint t-body-s">
            Every one pauses first and reaches a person second.
          </span>
        </div>

        <div className="table-scroll">
          <table className="table">
            <thead>
              <tr>
                <th className="t-meta">Exception</th>
                <th className="t-meta">What happens automatically</th>
                <th className="t-meta fill">Reaches</th>
              </tr>
            </thead>
            <tbody>
              {EMAIL_EXCEPTIONS.map((exception) => (
                <tr key={exception.id}>
                  <td className="t-body-s">{exception.exception}</td>
                  <td className={exception.automatic === '—' ? 't-body-s text-tertiary' : 't-body-s'}>
                    {exception.automatic}
                  </td>
                  <td className="t-body-s text-secondary">{exception.reaches}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel panel--wide">
        <div className="panel__title">
          <h2 className="t-title-m">Why a reply is an exception rather than a conversation</h2>
        </div>
        <p className="t-body-m text-secondary" style={{ maxWidth: '72ch' }}>
          The emails are founder-signed, so a reply arrives expecting the founder. The sequence stops for
          that person immediately and the reply reaches Joy&rsquo;s inbox — never a sequence step, never an
          auto-responder.{' '}
          <span className="t-meta-bold">
            &ldquo;Replies — never. One exchange and it breaks.&rdquo;
          </span>{' '}
          A founder email that bounces replies into a void is worse than no founder email.
        </p>
      </section>

      <p className="t-body-s text-secondary" style={{ maxWidth: '72ch' }}>
        Two thresholds do the work of a reviewer here: complaints above{' '}
        {(COMPLAINT_INVESTIGATE * 100).toFixed(1)}% pause sending, and a cold response rate under 10% over{' '}
        {COLD_KILL_SAMPLE} messages pauses that stream. Both were agreed before anything sent, which is the
        only time a threshold can be set honestly.
      </p>
    </div>
  );
}
