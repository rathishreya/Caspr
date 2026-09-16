import {
  COLD_VOLUME,
  COMPLAINT_CEILING,
  SENDING_DOMAINS,
  SEND_WINDOW,
  STREAMS,
  WARMING_PER_DAY,
  WARMING_WEEKS,
  checkEmail,
  readSendGate,
} from '@caspr-portal/domain';
import type { Metadata } from 'next';
import Link from 'next/link';

import { Icon } from '@/components/icons';
import { Tile } from '@/components/primitives/tile';
import { getRepository } from '@/lib/repository';

export const metadata: Metadata = { title: 'Email — Dashboard' };

/**
 * Email ▸ Dashboard — what is holding the send, and who has to move it.
 *
 * ⚑ **Rebuilt 2026-09-17.** It carried four panels describing the streams, the rules and the
 * domains. What a person needs on opening this workstream is one thing: **why nothing is
 * sending, and whose move it is** — so that is the screen.
 *
 * The domains lead because §14 dependency 5 calls them the longest lead time in the project
 * and *"nothing else depends on it, so start it first."* Everything else waits on them.
 */
export default async function EmailDashboard() {
  const emails = await getRepository().emails();
  const gate = readSendGate();
  const drafts = emails.filter((email) => email.state === 'draft');
  const blocked = drafts.filter((email) => checkEmail(email).length > 0);
  const warm = SENDING_DOMAINS.filter((domain) => domain.ready).length;

  return (
    <>
      <Link className="banner banner--link" href="/email/tasks">
        <span className="t-meta-bold banner__headline">
          {drafts.length} EMAILS NEED SIGN-OFF · {gate.blocking.length} PRECONDITIONS UNMET
        </span>
        <span className="t-body-s banner__detail">
          Signing off is not sending. It can be done today and should be — the gate and the sign-off are
          separate on purpose. Open Tasks →
        </span>
      </Link>

      <div className="tiles">
        <Tile
          label="DOMAINS WARM"
          value={`${warm} / ${SENDING_DOMAINS.length}`}
          attention={warm < SENDING_DOMAINS.length}
          note={`${WARMING_WEEKS} weeks each at ${WARMING_PER_DAY.min}–${WARMING_PER_DAY.max} a day. The longest lead time in the project, and nothing else depends on it — so it starts first.`}
        />
        <Tile
          label="PRECONDITIONS"
          value={`${gate.met} / ${gate.total}`}
          attention={!gate.canSend}
          note={gate.says}
        />
        <Tile
          label="NEED SIGN-OFF"
          value={String(drafts.length)}
          attention={drafts.length > 0}
          note={
            blocked.length > 0
              ? `${blocked.length} cannot be signed off until the copy is fixed.`
              : 'Every draft is clean. Joy signs off the first email of any sequence.'
          }
        />
        <Tile
          label="STREAMS LIVE"
          value={`${STREAMS.filter((stream) => stream.live).length} / ${STREAMS.length}`}
          attention
          note="Four lists, never merged. Someone who subscribed to be told about research did not ask for product email."
        />
        <Tile
          label="COLD, PER WEEK"
          value={`${COLD_VOLUME.min}–${COLD_VOLUME.max}`}
          note={`After one approval from Joy. Complaints held under ${(COMPLAINT_CEILING * 100).toFixed(1)}%, and sending pauses itself above it.`}
        />
      </div>

      {/* ── WHOSE MOVE ─────────────────────────────────────────────────────── */}
      <section aria-labelledby="blocking-heading">
        <div className="board-head">
          <h3 id="blocking-heading" className="t-title-m">
            Whose move it is <span className="board-count t-meta">{gate.blocking.length}</span>
          </h3>
          <span className="board-hint t-body-s">
            All five, not any. This is a one-shot asset and sending early wastes it.
          </span>
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
          {gate.blocking.map((row) => (
            <div key={row.id} className="gate">
              <span className="gate__mark">
                <Icon name="close" size={16} />
              </span>
              <div className="gate__body">
                <p className="t-title-m">{row.what}</p>
                <p className="t-body-s text-secondary">{row.why}</p>
                <p className="t-meta text-tertiary">{row.owner}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <p className="t-body-s text-secondary" style={{ maxWidth: '72ch' }}>
        <strong>On a normal week, nobody touches email.</strong> It runs once approved, every exception
        pauses itself before it reaches anyone, and the send window is {SEND_WINDOW}.{' '}
        <Link className="t-label" href="/email/sequences">
          Every email, as it arrives →
        </Link>
      </p>
    </>
  );
}
