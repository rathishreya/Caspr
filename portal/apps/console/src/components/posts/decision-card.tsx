'use client';

import {
  NOTE_MAX_CHARS,
  REJECT_CODES,
  REJECT_CODE_MEANING,
  rejectCodeForKey,
  rejectCodeKey,
  type DecisionAction,
  type RejectCode,
} from '@caspr-portal/domain';
import { useActionState, useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { useFormStatus } from 'react-dom';

import { decide, type DecideState } from '@/app/(console)/content-social/tasks/actions';
import { Icon } from '@/components/icons';

const INITIAL: DecideState = { errors: [] };

/**
 * One post awaiting a decision, and the three things a reviewer can do to it.
 *
 * Design spec §5A.1 decides how a decision behaves, and every rule is kept here:
 *
 *  · 4 — every action advances. The post leaves the queue the moment it is decided.
 *  · 5 — commit on action. Each button is its own form; there is nothing to save.
 *  · 6 — keyboard-first, with the hints visible: `A` · `R` · `H`, and `1`–`0` for a reason.
 *  · 7 — no edit affordance exists. The post above is not a text field, and nothing here
 *        can make it one. "The way to enforce that is to have nowhere to type."
 *
 * §5A.3: "Reject is one screen, never two. The artefact stays visible while the reason is
 * chosen — a reviewer who has to remember what they objected to writes a worse note."
 */
export function DecisionCard({
  itemId,
  title,
  platform,
  children,
}: {
  readonly itemId: string;
  readonly title: string;
  /** The board's current platform filter, carried through so the view survives a decision. */
  readonly platform: string | null;
  /** The context strip, the artefact and its facts — rendered on the server. */
  readonly children: ReactNode;
}) {
  const [state, formAction] = useActionState(decide, INITIAL);
  const [rejecting, setRejecting] = useState(false);
  const [code, setCode] = useState<RejectCode | null>(null);
  const [note, setNote] = useState('');

  const approveForm = useRef<HTMLFormElement>(null);
  const holdForm = useRef<HTMLFormElement>(null);
  const firstCode = useRef<HTMLInputElement>(null);
  const noteField = useRef<HTMLTextAreaElement>(null);

  /**
   * When the reviewer started on this post.
   *
   * Started on first attention — pointer or focus — rather than on page load: six posts
   * render at once, and timing the sixth from the moment the page opened would record the
   * five before it as time spent on it (build spec §4, `seconds_spent`).
   */
  const startedAt = useRef<number | null>(null);
  const markStarted = () => {
    startedAt.current ??= Date.now();
  };

  useEffect(() => {
    if (rejecting) firstCode.current?.focus();
  }, [rejecting]);

  const submitWith = (action: DecisionAction) => (formData: FormData) => {
    const seconds = startedAt.current === null ? 1 : (Date.now() - startedAt.current) / 1000;
    formData.set('secondsSpent', String(Math.round(seconds)));
    formData.set('action', action);
    formAction(formData);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    const target = event.target as HTMLElement;
    if (target.tagName === 'TEXTAREA') {
      if (event.key === 'Escape') setRejecting(false);
      return;
    }

    const key = event.key.toLowerCase();

    if (rejecting) {
      const picked = rejectCodeForKey(key);
      if (picked !== null) {
        event.preventDefault();
        setCode(picked);
        noteField.current?.focus();
      } else if (key === 'escape') {
        event.preventDefault();
        setRejecting(false);
      }
      // A and H do nothing while a rejection is being written. A stray key must not turn a
      // half-written rejection into an approval.
      return;
    }

    if (key === 'a') {
      event.preventDefault();
      approveForm.current?.requestSubmit();
    } else if (key === 'h') {
      event.preventDefault();
      holdForm.current?.requestSubmit();
    } else if (key === 'r') {
      event.preventDefault();
      setRejecting(true);
    }
  };

  const hidden = (
    <>
      <input type="hidden" name="itemId" value={itemId} />
      {platform !== null && <input type="hidden" name="platform" value={platform} />}
    </>
  );

  return (
    <section
      className="decide"
      id={`post-${itemId}`}
      aria-label={`Decide: ${title}`}
      aria-keyshortcuts="A R H"
      tabIndex={0}
      onKeyDown={onKeyDown}
      onPointerEnter={markStarted}
      onFocus={markStarted}
    >
      {children}

      <div className="decide__actions">
        <form ref={approveForm} action={submitWith('approve')}>
          {hidden}
          <Submit variant="primary" shortcut="A" pendingLabel="Approving">
            Approve
          </Submit>
        </form>

        <button
          type="button"
          className={rejecting ? 'btn btn--active' : 'btn'}
          aria-expanded={rejecting}
          aria-controls={`reject-${itemId}`}
          onClick={() => setRejecting((open) => !open)}
        >
          Reject… <kbd className="kbd">R</kbd>
        </button>

        <form ref={holdForm} action={submitWith('hold')}>
          {hidden}
          <Submit shortcut="H" pendingLabel="Holding">
            Hold
          </Submit>
        </form>

        <span className="decide__hint t-body-s">No editing — a rejection regenerates the post with your note applied.</span>
      </div>

      {rejecting && (
        <form id={`reject-${itemId}`} className="reject" action={submitWith('reject')}>
          {hidden}
          <fieldset className="reject__codes">
            <legend className="t-meta reject__legend">Why — pick one, or press 1–0</legend>
            {REJECT_CODES.map((candidate, index) => (
              <label
                key={candidate}
                className={candidate === 'BANNED_TERM' ? 'code code--defect' : 'code'}
              >
                <input
                  ref={index === 0 ? firstCode : undefined}
                  type="radio"
                  name="reasonCode"
                  value={candidate}
                  checked={code === candidate}
                  onChange={() => setCode(candidate)}
                  required
                />
                <span className="code__key t-meta">{rejectCodeKey(candidate)}</span>
                <span className="code__name t-meta-bold">{candidate}</span>
                <span className="code__meaning t-body-s">{REJECT_CODE_MEANING[candidate]}</span>
                {candidate === 'BANNED_TERM' && (
                  // §5A.3: BANNED_TERM "means the linter should have caught it — the reject
                  // panel says so, and it raises a linter defect."
                  <span className="code__defect t-body-s">
                    <Icon name="alert" size={14} /> The machine should have caught this. It will be fixed.
                  </span>
                )}
              </label>
            ))}
          </fieldset>

          <label className="reject__note">
            <span className="t-meta reject__legend">Note — it goes into the regeneration prompt and the ledger</span>
            <textarea
              ref={noteField}
              name="note"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              maxLength={NOTE_MAX_CHARS}
              required
              rows={2}
              placeholder="What is wrong, in a sentence the writer can act on."
            />
            <span className={note.length > NOTE_MAX_CHARS - 20 ? 'reject__count reject__count--near t-meta' : 'reject__count t-meta'}>
              {note.length} / {NOTE_MAX_CHARS}
            </span>
          </label>

          <div className="reject__actions">
            <Submit variant="primary" pendingLabel="Rejecting">
              Reject and regenerate
            </Submit>
            <button type="button" className="btn" onClick={() => setRejecting(false)}>
              Cancel <kbd className="kbd">Esc</kbd>
            </button>
          </div>
        </form>
      )}

      {state.errors.length > 0 && (
        <div className="decide__errors" role="alert">
          {state.errors.map((error) => (
            <p key={error} className="t-body-s">
              {error}
            </p>
          ))}
        </div>
      )}
    </section>
  );
}

/**
 * A submit button that says what is running while it runs.
 *
 * §14.2 rule 2: "No spinners anywhere. A loading state is text that names what is running."
 */
function Submit({
  children,
  pendingLabel,
  shortcut,
  variant,
}: {
  readonly children: ReactNode;
  readonly pendingLabel: string;
  readonly shortcut?: string;
  readonly variant?: 'primary';
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className={variant === 'primary' ? 'btn btn--primary' : 'btn'}
      disabled={pending}
      aria-disabled={pending}
    >
      {pending ? pendingLabel : children}
      {shortcut !== undefined && <kbd className="kbd">{shortcut}</kbd>}
    </button>
  );
}
