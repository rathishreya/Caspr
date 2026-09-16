import { EMAIL_EXCEPTIONS, checkEmail, readSendGate } from '@caspr-portal/domain';
import type { Metadata } from 'next';
import Link from 'next/link';

import { State } from '@/components/primitives/state';
import { EmailCard } from '@/components/email/email-card';
import { getRepository } from '@/lib/repository';

export const metadata: Metadata = { title: 'Email — Tasks' };

/**
 * Email ▸ Tasks — what needs a person.
 *
 * ⚑ **Rebuilt 2026-09-17.** It held a table of the five exception kinds, which was true and
 * was not work. Now that the emails exist there is real work, and it is the same shape as
 * every other queue in this console: sign it off, change it, or leave it.
 *
 * On a normal week this is empty, and that is the design — §8.5: *"once approved, email needs
 * no standing owner. It needs someone to receive the exceptions, and every exception pauses
 * itself first."* The exceptions appear here only when one has fired.
 */
export default async function EmailTasks() {
  const emails = await getRepository().emails();
  const gate = readSendGate();

  const drafts = emails.filter((email) => email.state === 'draft');
  const blocked = drafts.filter((email) => checkEmail(email).length > 0);
  const clean = drafts.filter((email) => !blocked.includes(email));
  const ready = emails.filter((email) => email.state === 'approved');

  // Nothing is sending, so nothing has raised an exception. Shown as the empty state it is.
  const firing: readonly string[] = [];

  return (
    <div className="board">
      <p className="board-status t-meta">
        <span>{drafts.length} need sign-off</span>
        {blocked.length > 0 && <span className="text-attention">{blocked.length} blocked by their copy</span>}
        <span>{ready.length} signed off, waiting on the gate</span>
        <span className={gate.canSend ? undefined : 'text-attention'}>
          {gate.met} of {gate.total} preconditions
        </span>
      </p>

      {blocked.length > 0 && (
        <section aria-labelledby="blocked-heading">
          <div className="board-head">
            <h3 id="blocked-heading" className="t-title-m">
              Cannot be signed off <span className="board-count t-meta">{blocked.length}</span>
            </h3>
            <span className="board-hint t-body-s">
              The copy breaks a rule that would be wrong in an inbox with a founder&rsquo;s name on it.
            </span>
          </div>
          <div className="mails">
            {blocked.map((email) => (
              <EmailCard key={email.id} email={email} gate={gate} />
            ))}
          </div>
        </section>
      )}

      <section aria-labelledby="signoff-heading">
        <div className="board-head">
          <h3 id="signoff-heading" className="t-title-m">
            Waiting on sign-off <span className="board-count t-meta">{clean.length}</span>
          </h3>
          <span className="board-hint t-body-s">
            Signing off is not sending. Nothing schedules until all five preconditions hold, so this can be
            done today and should be.
          </span>
        </div>

        {clean.length === 0 ? (
          <State
            kind="empty"
            headline="Every email is signed off."
            consequence="Finished, not unassigned. New drafts arrive when a trigger is added or an email is sent back to be rewritten."
          />
        ) : (
          <div className="mails">
            {clean.map((email) => (
              <EmailCard key={email.id} email={email} gate={gate} />
            ))}
          </div>
        )}
      </section>

      {/* ── EXCEPTIONS ─────────────────────────────────────────────────────── */}
      <section aria-labelledby="exceptions-heading">
        <div className="board-head">
          <h3 id="exceptions-heading" className="t-title-m">
            Exceptions <span className="board-count t-meta">{firing.length}</span>
          </h3>
          <span className="board-hint t-body-s">
            Every one pauses itself first and reaches a person second — a reviewer who has to notice a
            deliverability breach in order to stop it will notice it on Monday.
          </span>
        </div>

        {firing.length === 0 ? (
          <State
            kind="empty"
            headline="No exception is open."
            consequence={`Correctly empty, and on a normal week it stays that way — nothing is sending, and once it does, ${EMAIL_EXCEPTIONS.length - 1} of the ${EMAIL_EXCEPTIONS.length} kinds pause the stream before anybody is told.`}
          />
        ) : null}
      </section>

      <p className="t-body-s text-secondary" style={{ maxWidth: '72ch' }}>
        <Link className="t-label" href="/email/sequences">
          Every email, and what is holding the send →
        </Link>
      </p>
    </div>
  );
}
