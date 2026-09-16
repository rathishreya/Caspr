import {
  COLD_VOLUME,
  COMPLAINT_CEILING,
  COMPLAINT_INVESTIGATE,
  EMAIL_RULES,
  LIFECYCLE_TRIGGERS,
  SENDING_DOMAINS,
  STREAMS,
  WARMING_PER_DAY,
  WARMING_WEEKS,
} from '@caspr-portal/domain';
import type { Metadata } from 'next';
import Link from 'next/link';

import { Icon } from '@/components/icons';
import { Tile } from '@/components/primitives/tile';

export const metadata: Metadata = { title: 'Email — Dashboard' };

/**
 * Email ▸ Dashboard.
 *
 * The two sending domains come first, and not for tidiness: `activation-framework.md` §14
 * dependency 5 calls them **the longest lead time in the project** — ~3 weeks each, and
 * every other row on this screen is waiting on them. A dashboard that led with stream
 * statuses would bury the one fact that determines when any of it starts.
 */
export default function EmailDashboard() {
  const live = STREAMS.filter((stream) => stream.live).length;
  const warm = SENDING_DOMAINS.filter((domain) => domain.ready).length;

  return (
    <>
      <div className="banner">
        <span className="t-meta-bold banner__headline">NOTHING IS SENDING — BOTH DOMAINS ARE STILL COLD</span>
        <span className="t-body-s banner__detail">
          ~3 weeks of warming each, at {WARMING_PER_DAY.min}&ndash;{WARMING_PER_DAY.max} a day, and the
          campaign schedule follows the warming rather than the other way round. It is the longest lead time
          in the project, so it starts now whatever else does not.
        </span>
      </div>

      <div className="tiles">
        <Tile
          label="STREAMS LIVE"
          value={`${live} / ${STREAMS.length}`}
          attention={live < STREAMS.length}
          note="Four lists, never merged. Someone who subscribed to be told about research did not ask for product email."
        />
        <Tile
          label="DOMAINS WARM"
          value={`${warm} / ${SENDING_DOMAINS.length}`}
          attention={warm < SENDING_DOMAINS.length}
          note={`${WARMING_WEEKS} weeks each. Marketing carries three streams; cold outreach sends from its own domain entirely.`}
        />
        <Tile
          label="LIFECYCLE TRIGGERS"
          value={String(LIFECYCLE_TRIGGERS.length)}
          note="Behaviour, never a calendar. A calendar sequence sends the day-3 email whether or not the person did anything."
        />
        <Tile
          label="COLD VOLUME"
          value={`${COLD_VOLUME.min}–${COLD_VOLUME.max}`}
          note="A week, after one approval. Research-led and low-volume, which is what keeps it inside channel-model §7 rather than against it."
        />
        <Tile
          label="COMPLAINT CEILING"
          value={`${(COMPLAINT_CEILING * 100).toFixed(1)}%`}
          note={`Above ${(COMPLAINT_INVESTIGATE * 100).toFixed(1)}% and it is investigated before the next send. Above this, sending pauses itself.`}
        />
      </div>

      <section className="panel panel--wide">
        <div className="panel__title">
          <h2 className="t-title-m">The two sending domains</h2>
          <span className="t-meta text-tertiary">THE LONGEST LEAD TIME IN THE PROJECT</span>
        </div>

        <div className="gates">
          {SENDING_DOMAINS.map((domain) => (
            <div key={domain.id} className={domain.ready ? 'gate gate--met' : 'gate'}>
              <span className="gate__mark">
                <Icon name={domain.ready ? 'check' : 'close'} size={16} />
              </span>
              <div className="gate__body">
                <p className="t-title-m">{domain.label}</p>
                <p className="t-body-s text-secondary">{domain.carries}</p>
                <p className="t-meta text-tertiary">
                  {domain.warmedFrom === null ? 'Warming has not started' : `Warming from ${domain.warmedFrom}`}
                </p>
              </div>
            </div>
          ))}
        </div>

        <p className="t-body-s text-secondary" style={{ marginTop: 'var(--space-4)' }}>
          The marketing subdomain only, for the owned streams — never the transactional identity. A
          deliverability problem on the marketing domain that took the transactional one with it would stop
          password resets, which is a product outage caused by a marketing send.
        </p>
      </section>

      <section className="panel panel--wide">
        <div className="panel__title">
          <h2 className="t-title-m">Four streams</h2>
          <span className="t-meta text-tertiary">NEVER MERGED</span>
        </div>

        <div className="table-scroll">
          <table className="table">
            <thead>
              <tr>
                <th className="t-meta keep">Stream</th>
                <th className="t-meta nowrap">Sends from</th>
                <th className="t-meta fill">Standing</th>
                <th className="t-meta keep">Waiting on</th>
              </tr>
            </thead>
            <tbody>
              {STREAMS.map((stream) => (
                <tr key={stream.id}>
                  <td className="t-body-s keep">
                    {stream.label}
                    <br />
                    <span className="t-body-s text-tertiary">{stream.who}</span>
                  </td>
                  <td className="t-meta nowrap">{stream.domain === 'cold' ? 'The cold domain' : 'Marketing'}</td>
                  <td className="t-body-s text-secondary">{stream.status}</td>
                  <td className={stream.blockedBy === null ? 't-body-s keep' : 't-body-s text-attention keep'}>
                    {stream.blockedBy ?? 'Nothing'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel panel--wide">
        <div className="panel__title">
          <h2 className="t-title-m">The rules across all four</h2>
          <span className="t-meta text-tertiary">ACTIVATION FRAMEWORK §8.1</span>
        </div>
        {EMAIL_RULES.map((rule) => (
          <div key={rule.rule} className="stack-row">
            <p className="t-body-s">{rule.rule}</p>
            <p className="t-body-s text-secondary">{rule.detail}</p>
          </div>
        ))}
      </section>

      <p className="t-body-s text-secondary" style={{ maxWidth: '72ch' }}>
        <span className="t-meta-bold">On a normal week, nobody touches email.</span> It runs once approved,
        and every exception pauses itself before it reaches anyone — which is why{' '}
        <Link className="t-label" href="/email/tasks">
          Tasks
        </Link>{' '}
        holds exceptions rather than work.
      </p>
    </>
  );
}
