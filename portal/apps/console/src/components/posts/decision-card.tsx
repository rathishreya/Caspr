'use client';

import {
  NOTE_MAX_CHARS,
  PROMPT_MAX_CHARS,
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
 * One post awaiting a decision, and the four things a reviewer can do to it.
 *
 * Design spec §5A.1 decides how a decision behaves, and its rules are kept here:
 *
 *  · 4 — every action advances. The post leaves the queue the moment it is decided.
 *  · 5 — commit on action. Each button is its own form; there is nothing to save.
 *  · 6 — keyboard-first, with the hints visible: `A` · `R` · `H` · `E`, and `1`–`0` for a reason.
 *
 * ⚑ **Two departures, both taken 2026-09-16 at the Content & Social owner's request.**
 *
 * 1. **The actions stand in a column beside the post, and approve is green.** §1 decision 4
 *    reserves colour for attention; two irreversible actions that look identical on the
 *    busiest screen in the console cost more than the second accent does.
 * 2. **`Revise` exists** — *"user can interact with the posts and can change it using
 *    prompts."* §5A.1 rule 7 said no edit affordance should exist, and **the reviewer still
 *    does not type the post**: they type an instruction, the writer rewrites, and the new
 *    version comes back through this same review. Nobody edits published text in place.
 *
 * §5A.3 still holds: "Reject is one screen, never two. The artefact stays visible while the
 * reason is chosen" — and the same is true of a revision prompt.
 */
export function DecisionCard({
  itemId,
  title,
  platform,
  basePath,
  failures,
  children,
}: {
  readonly itemId: string;
  readonly title: string;
  /** The board's current platform filter, carried through so the view survives a decision. */
  readonly platform: string | null;
  /**
   * Which of the two queues this card was decided from — `/content-social/tasks` or
   * `/content-social/today`. The action redirects back to it, so a decision taken on Today
   * does not land the reviewer on This week with their place lost.
   */
  readonly basePath: string;
  /**
   * Failed checks only, or null when everything passed.
   *
   * The full checks panel was removed on request. What is left is the half a reviewer cannot
   * do without: when the machine found something, it says so; when it found nothing, it says
   * nothing rather than filling the screen with ticks.
   */
  readonly failures: ReactNode;
  /** The context strip and the post as it will publish — rendered on the server. */
  readonly children: ReactNode;
}) {
  const [state, formAction] = useActionState(decide, INITIAL);
  const [panel, setPanel] = useState<'none' | 'reject' | 'revise'>('none');
  const [code, setCode] = useState<RejectCode | null>(null);
  const [note, setNote] = useState('');
  const [prompt, setPrompt] = useState('');

  const approveForm = useRef<HTMLFormElement>(null);
  const holdForm = useRef<HTMLFormElement>(null);
  const firstCode = useRef<HTMLInputElement>(null);
  const noteField = useRef<HTMLTextAreaElement>(null);
  const promptField = useRef<HTMLTextAreaElement>(null);

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
    if (panel === 'reject') firstCode.current?.focus();
    if (panel === 'revise') promptField.current?.focus();
  }, [panel]);

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
      if (event.key === 'Escape') setPanel('none');
      return;
    }

    const key = event.key.toLowerCase();

    if (panel === 'reject') {
      const picked = rejectCodeForKey(key);
      if (picked !== null) {
        event.preventDefault();
        setCode(picked);
        noteField.current?.focus();
      } else if (key === 'escape') {
        event.preventDefault();
        setPanel('none');
      }
      // A and H do nothing while a rejection is being written. A stray key must not turn a
      // half-written rejection into an approval.
      return;
    }
    if (panel === 'revise') {
      if (key === 'escape') {
        event.preventDefault();
        setPanel('none');
      }
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
      setPanel('reject');
    } else if (key === 'e') {
      event.preventDefault();
      setPanel('revise');
    }
  };

  const hidden = (
    <>
      <input type="hidden" name="itemId" value={itemId} />
      <input type="hidden" name="from" value={basePath} />
      {platform !== null && <input type="hidden" name="platform" value={platform} />}
    </>
  );

  return (
    <section
      className="decide"
      id={`post-${itemId}`}
      aria-label={`Decide: ${title}`}
      aria-keyshortcuts="A R H E"
      tabIndex={0}
      onKeyDown={onKeyDown}
      onPointerEnter={markStarted}
      onFocus={markStarted}
    >
      <div className="decide__split">
        <div className="decide__post">{children}</div>

        <div className="decide__rail">
          <form ref={approveForm} action={submitWith('approve')}>
            {hidden}
            <Submit variant="approve" shortcut="A" pendingLabel="Approving">
              Approve
            </Submit>
          </form>

          <button
            type="button"
            className={panel === 'reject' ? 'btn btn--reject btn--active' : 'btn btn--reject'}
            aria-expanded={panel === 'reject'}
            aria-controls={`reject-${itemId}`}
            onClick={() => setPanel((open) => (open === 'reject' ? 'none' : 'reject'))}
          >
            Reject… <kbd className="kbd">R</kbd>
          </button>

          <form ref={holdForm} action={submitWith('hold')}>
            {hidden}
            <Submit shortcut="H" pendingLabel="Holding">
              Hold
            </Submit>
          </form>

          <button
            type="button"
            className={panel === 'revise' ? 'btn btn--active' : 'btn'}
            aria-expanded={panel === 'revise'}
            aria-controls={`revise-${itemId}`}
            onClick={() => setPanel((open) => (open === 'revise' ? 'none' : 'revise'))}
          >
            Change it… <kbd className="kbd">E</kbd>
          </button>

          {failures !== null && <div className="decide__failures">{failures}</div>}
        </div>
      </div>

      {panel === 'revise' && (
        <form id={`revise-${itemId}`} className="reject" action={submitWith('revise')}>
          {hidden}
          <label className="reject__note">
            <span className="t-meta reject__legend">
              What to change — the writer rewrites it from this. You never type the post itself
            </span>
            <textarea
              ref={promptField}
              name="note"
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              maxLength={PROMPT_MAX_CHARS}
              required
              rows={3}
              placeholder="Cut the last paragraph and lead on the $600m gap. Keep the source line."
            />
            <span className={prompt.length > PROMPT_MAX_CHARS - 40 ? 'reject__count reject__count--near t-meta' : 'reject__count t-meta'}>
              {prompt.length} / {PROMPT_MAX_CHARS}
            </span>
          </label>

          <div className="reject__actions">
            <Submit variant="primary" pendingLabel="Sending">
              Send to the writer
            </Submit>
            <button type="button" className="btn" onClick={() => setPanel('none')}>
              Cancel <kbd className="kbd">Esc</kbd>
            </button>
            <span className="decide__hint t-body-s">
              ⑩ the Writer is not built yet, so the instruction is recorded and the post waits here.
            </span>
          </div>
        </form>
      )}

      {panel === 'reject' && (
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
            <Submit variant="reject" pendingLabel="Rejecting">
              Reject and regenerate
            </Submit>
            <button type="button" className="btn" onClick={() => setPanel('none')}>
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
  readonly variant?: 'primary' | 'approve' | 'reject';
}) {
  const { pending } = useFormStatus();
  const className =
    variant === 'approve'
      ? 'btn btn--approve'
      : variant === 'reject'
        ? 'btn btn--reject btn--reject-solid'
        : variant === 'primary'
          ? 'btn btn--primary'
          : 'btn';
  return (
    <button type="submit" className={className} disabled={pending} aria-disabled={pending}>
      {pending ? pendingLabel : children}
      {shortcut !== undefined && <kbd className="kbd">{shortcut}</kbd>}
    </button>
  );
}
