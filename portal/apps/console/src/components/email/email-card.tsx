'use client';

import {
  AD_PROMPT_MAX,
  EMAIL_STATE_LABEL,
  SENDER_LABEL,
  checkEmail,
  emailSchedulable,
  type EmailDraft,
  type SendGate,
} from '@caspr-portal/domain';
import { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';

import { moveEmail, reviseEmail, type EmailActionState } from '@/app/(console)/email/actions';
import { Icon } from '@/components/icons';

const INITIAL: EmailActionState = { errors: [] };

/**
 * One email, as it arrives.
 *
 * ⚑ **Drawn as an inbox row opened**, the same principle the post and ad previews follow: a
 * reviewer approving a rendering of the thing is approving the thing, where a reviewer
 * approving a table of fields is approving their own imagination of it. The sender line and
 * the preview text are shown because they are read more than the body is.
 *
 * The decisions sit in a column on the right — the post queue's shape, and the same control.
 *
 * ⚠ **Sign off and Schedule are two buttons for one reason.** An email can be right months
 * before it may send. Sign-off is about the words; scheduling is about the five preconditions
 * and a warm domain, and the card says which one is holding it.
 */
export function EmailCard({ email, gate }: { readonly email: EmailDraft; readonly gate: SendGate }) {
  const [state, action] = useActionState(moveEmail, INITIAL);
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const problems = checkEmail(email);
  const schedulable = emailSchedulable(email, gate);

  /** Subject, preview and body, in the order an ESP's form asks for them. */
  async function copyAll() {
    const text = [
      `FROM      ${SENDER_LABEL[email.sender]}`,
      `SUBJECT   ${email.subject}`,
      `PREVIEW   ${email.preview}`,
      '',
      ...email.body,
      ...(email.cta === null ? [] : ['', `CTA  ${email.cta}`]),
    ].join('\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      // Refused clipboard access. The email is on screen and selectable either way.
      setCopied(false);
    }
  }

  return (
    <article className={`mail mail--${email.state}`} aria-label={email.subject}>
      <header className="mail__head">
        <span className="t-meta-bold">Day {email.day}</span>
        <span className="t-meta">{SENDER_LABEL[email.sender]}</span>
        {email.variantFor !== undefined && (
          <span className="t-meta text-tertiary">variant for {email.variantFor.join(', ')}</span>
        )}
        <span className={`tag tag--${email.state} t-meta`}>{EMAIL_STATE_LABEL[email.state]}</span>
      </header>

      <div className="mail__body">
        <div className="mail__preview">
          {/* The inbox, before anyone opens it. */}
          <div className="inbox">
            <p className="inbox__from">{SENDER_LABEL[email.sender]}</p>
            <p className="inbox__subject">{email.subject}</p>
            <p className="inbox__preview">{email.preview}</p>
            <div className="inbox__body">
              {email.body.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
            {email.cta !== null && <p className="inbox__cta">{email.cta}</p>}
          </div>

          <p className="mail__purpose t-body-s text-secondary">{email.purpose}</p>

          {email.cta === null && (
            <p className="t-body-s text-tertiary">
              No call to action, and that is the decision — an email that asks for something before it has
              earned the open spends credibility it does not have.
            </p>
          )}

          {email.revision !== undefined && (
            <p className="ad__revision t-body-s">
              <span className="t-meta">Change asked for {email.revision.at}</span> &ldquo;{email.revision.note}
              &rdquo;
              <span className="text-tertiary">
                {' '}
                — ⑩ the Writer is not built yet, so the instruction is recorded and the email waits here.
              </span>
            </p>
          )}

          {problems.length > 0 && (
            <div className="ad__problems">
              <p className="t-meta text-attention">
                <Icon name="alert" size={13} /> {problems.length} before it can be signed off
              </p>
              {problems.map((problem) => (
                <div key={problem.what} className="ad__problem">
                  <p className="t-body-s">{problem.what}</p>
                  <p className="t-body-s text-tertiary">{problem.fix}</p>
                </div>
              ))}
            </div>
          )}

          {email.state === 'approved' && !schedulable.ok && (
            <p className="t-body-s text-attention">Cannot schedule — {schedulable.why}</p>
          )}
        </div>

        <div className="decide__rail" role="group" aria-label="Decide this email">
          {email.state === 'draft' && (
            <Move action={action} id={email.id} to="approved" label="Sign off" kind="approve" disabled={problems.length > 0} />
          )}
          {email.state === 'approved' && (
            <Move
              action={action}
              id={email.id}
              to="scheduled"
              label="Schedule"
              kind="primary"
              disabled={!schedulable.ok}
            />
          )}
          {email.state === 'scheduled' && (
            <Move action={action} id={email.id} to="paused" label="Pause" kind="reject" />
          )}
          {email.state === 'paused' && (
            <Move action={action} id={email.id} to="scheduled" label="Resume" kind="approve" />
          )}

          <button type="button" className="btn" onClick={copyAll}>
            {copied ? 'Copied' : 'Copy the email'}
          </button>

          {email.state !== 'sent' && (
            <button
              type="button"
              className={open ? 'btn btn--active' : 'btn'}
              aria-expanded={open}
              aria-controls={`revise-${email.id}`}
              onClick={() => setOpen((was) => !was)}
            >
              Change it…
            </button>
          )}
        </div>
      </div>

      {open && <RevisePanel email={email} onDone={() => setOpen(false)} />}

      {state.errors.length > 0 && (
        <p className="ad__error t-body-s" role="alert">
          {state.errors.join(' ')}
        </p>
      )}
    </article>
  );
}

function RevisePanel({ email, onDone }: { readonly email: EmailDraft; readonly onDone: () => void }) {
  const [state, action] = useActionState(reviseEmail, INITIAL);
  const [note, setNote] = useState('');

  return (
    <form
      id={`revise-${email.id}`}
      className="reject revise"
      action={(formData) => {
        action(formData);
        onDone();
      }}
    >
      <input type="hidden" name="emailId" value={email.id} />
      <div className="revise__body">
        <p className="t-meta reject__legend">Change it</p>
        <p className="revise__lede t-body-s">
          Say what to change. The email is rewritten from your words and comes back for the same sign-off —
          you never type the email itself. It goes out with a founder&rsquo;s name on it.
        </p>
        <label className="reject__note">
          <textarea
            name="note"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            maxLength={AD_PROMPT_MAX}
            required
            rows={3}
            placeholder="Cut the third paragraph. The apology is doing too much work."
          />
        </label>
        <div className="reject__actions">
          <ReviseSubmit />
          <button type="button" className="btn" onClick={onDone}>
            Cancel
          </button>
          <span className={note.length > AD_PROMPT_MAX - 40 ? 'revise__count revise__count--near t-meta' : 'revise__count t-meta'}>
            {note.length} / {AD_PROMPT_MAX}
          </span>
        </div>
        {state.errors.length > 0 && (
          <p className="ad__error t-body-s" role="alert">
            {state.errors.join(' ')}
          </p>
        )}
      </div>
    </form>
  );
}

function Move({
  action,
  id,
  to,
  label,
  kind,
  disabled = false,
}: {
  readonly action: (formData: FormData) => void;
  readonly id: string;
  readonly to: string;
  readonly label: string;
  readonly kind: 'approve' | 'reject' | 'primary';
  readonly disabled?: boolean;
}) {
  return (
    <form action={action}>
      <input type="hidden" name="emailId" value={id} />
      <input type="hidden" name="to" value={to} />
      <Submit label={label} kind={kind} disabled={disabled} />
    </form>
  );
}

function Submit({
  label,
  kind,
  disabled,
}: {
  readonly label: string;
  readonly kind: 'approve' | 'reject' | 'primary';
  readonly disabled: boolean;
}) {
  const { pending } = useFormStatus();
  const className = kind === 'approve' ? 'btn btn--approve' : kind === 'reject' ? 'btn btn--reject' : 'btn btn--primary';
  return (
    <button type="submit" className={className} disabled={pending || disabled} aria-disabled={pending || disabled}>
      {pending ? 'Saving' : label}
    </button>
  );
}

function ReviseSubmit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn btn--primary" disabled={pending}>
      {pending ? 'Sending' : 'Send to the writer'}
    </button>
  );
}
