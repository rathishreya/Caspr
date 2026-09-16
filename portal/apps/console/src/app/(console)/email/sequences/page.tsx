import {
  SEGMENTS,
  SEND_WINDOW,
  SEQUENCES,
  checkEmail,
  readSendGate,
  type EmailDraft,
} from '@caspr-portal/domain';
import type { Metadata } from 'next';

import { Tile } from '@/components/primitives/tile';
import { EmailCard } from '@/components/email/email-card';
import { getRepository } from '@/lib/repository';

export const metadata: Metadata = { title: 'Email — Sequences' };

/**
 * Email ▸ Sequences — the emails themselves.
 *
 * ⚑ **Rebuilt 2026-09-17**, on the instruction that this be execution rather than reading.
 * The previous version described four streams correctly and gave nobody anything to do. This
 * one holds the twelve emails that exist, each drawn as it arrives, each with the two
 * decisions it needs.
 *
 * **Sign off and Schedule are separate, and that gap is the safety of the whole workstream.**
 * `operations-runbook.md` §8 puts Joy's sign-off on the first email of any sequence; the five
 * preconditions decide when anything may send. An email can be right for months before it may
 * go — and collapsing the two would make approving copy the same act as sending to 1,600
 * people.
 *
 * ⚑ **The preconditions list came off this screen the same day it went on.** `readSendGate`
 * still refuses every schedule, the tile still says how many are unmet and why, and each card
 * names what is holding that email — on the email it is holding, which is where a rule is
 * worth meeting.
 */
export default async function EmailSequences() {
  const emails = await getRepository().emails();
  const gate = readSendGate();

  const needSignOff = emails.filter((email) => email.state === 'draft');
  const blocked = needSignOff.filter((email) => checkEmail(email).length > 0);
  const scheduled = emails.filter((email) => email.state === 'scheduled');

  return (
    <div className="board">
      <div className="tiles">
        <Tile
          label="EMAILS WRITTEN"
          value={String(emails.length)}
          note={`${SEQUENCES.length} sequences. Copy is final where the spec says so; the rest is written to its brief.`}
        />
        <Tile
          label="NEED SIGN-OFF"
          value={String(needSignOff.length)}
          attention={needSignOff.length > 0}
          note={
            blocked.length > 0
              ? `${blocked.length} cannot be signed off until the copy is fixed.`
              : 'Joy signs off the first email of any sequence.'
          }
        />
        <Tile
          label="PRECONDITIONS"
          value={`${gate.met} / ${gate.total}`}
          attention={!gate.canSend}
          note={gate.says}
        />
        <Tile
          label="SCHEDULED"
          value={String(scheduled.length)}
          note={`Nothing sends until every precondition holds. Send window: ${SEND_WINDOW}.`}
        />
      </div>

      {/* ── THE SEQUENCES ──────────────────────────────────────────────────── */}
      {SEQUENCES.map((sequence) => {
        const mine = emails
          .filter((email) => email.sequenceId === sequence.id)
          .sort((a, b) => a.day - b.day);
        if (mine.length === 0) return null;

        return (
          <section key={sequence.id} className="board-part" aria-labelledby={`seq-${sequence.id}`}>
            <h2 id={`seq-${sequence.id}`} className="board-part__title">
              {sequence.name} <span className="board-count t-meta">{mine.length}</span>
            </h2>
            <p className="board-part__lede t-body-m">
              {sequence.audience} · {sequence.trigger}. <span className="text-tertiary">{sequence.goal}</span>
            </p>

            <div className="mails">
              {mine.map((email) => (
                <EmailCard key={email.id} email={email} gate={gate} />
              ))}
            </div>

            {sequence.id === 'reengagement' && <SegmentStrip emails={mine} />}
          </section>
        );
      })}
    </div>
  );
}

/**
 * Who gets which of the five.
 *
 * Kept because it changes **what is sent to whom**, which is an operating decision rather
 * than a description — and S4's row is the one a scheduling tool will break if nobody has
 * written it down.
 */
function SegmentStrip({ emails }: { readonly emails: readonly EmailDraft[] }) {
  return (
    <div className="segments">
      {SEGMENTS.map((segment) => (
        <div key={segment.id} className={segment.emails === null ? 'segment segment--none' : 'segment'}>
          <p className="segment__id t-meta">
            {segment.id} · {segment.name}
          </p>
          <p className="t-body-s">{segment.definition}</p>
          <p className="segment__gets t-meta">
            {segment.emails === null ? 'Nothing' : segment.emails}
            {segment.id === 'S2' && ` · ${emails.filter((e) => e.variantFor?.includes('S2')).length} variant`}
          </p>
        </div>
      ))}
    </div>
  );
}
