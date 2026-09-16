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

import { Tile } from '@/components/primitives/tile';
import { getRepository } from '@/lib/repository';

export const metadata: Metadata = { title: 'Email — Dashboard' };

/**
 * Email ▸ Dashboard — what is holding the send, and who has to move it.
 *
 * ⚑ **Rebuilt 2026-09-17, then cut back the same day.** It carried four panels describing the
 * streams, the rules and the domains; the rebuild replaced them with one listing what is
 * holding every send, and that went too. What is left is the banner and five numbers, which
 * is what a person needs on opening a workstream that nobody touches in a normal week.
 *
 * **The gate did not move.** `readSendGate` still refuses every schedule while a precondition
 * is unmet, the PRECONDITIONS tile still says how many and why, and each email card still
 * names what is holding it — on the email it is holding, which is a better place to meet a
 * rule than a list.
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
