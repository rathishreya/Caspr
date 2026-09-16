'use client';

import { PUBLISH_MODE_LABEL, stance, type EngagementDraft, type PublishMode } from '@caspr-portal/domain';
import { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';

import { markEngagement, type DecideState } from '@/app/(console)/content-social/tasks/actions';

const INITIAL: DecideState = { errors: [] };

/**
 * The drafted reply, and the four things a person can do with it.
 *
 * ⚑ **Changed 2026-09-16**, following `activation-framework.md` §0.3 decision 14 and §6.4:
 * the desk now drafts. It reverses ⑰ rule 1 ("never drafts a finished comment"), and Joy's
 * reason is the one that matters: *"People operate from emotion — drafts from approved lines
 * are the brand-safety mechanism."* The guard rail moves rather than disappearing: two or
 * three variants, each in that person's lane, each carrying its own sourced finding, and a
 * person approves every word before it reaches a platform.
 *
 * §6.5's four actions are the four here — Approve · Edit · Skip · Not my lane — where
 * *approve* is the one tap (§6.6): the post opens on the platform with the comment copied,
 * ready to paste, roughly five seconds. **Never the API**, and not for technical reasons:
 * LinkedIn's 2026 enforcement pushes a third-party comment out of *Most relevant* and shows
 * it only to the commenter's own network, "so the creator's audience, the reason we comment,
 * never sees it".
 *
 * ⚑ **Edit is now real** (2026-09-16, on request: *"user can interact with the posts and
 * comments and can change it using prompts"*). A comment and a post are changed in opposite
 * ways here, deliberately:
 *
 *   A POST       the reviewer writes an **instruction**, the writer rewrites, and the new
 *                version comes back through review. Nobody types published company copy.
 *   A COMMENT    the person types the **words**, because they were always going to — it goes
 *                out under their name, from their account, and §6.5 gives them Edit outright.
 *
 * What is edited never leaves the browser: it is copied to the clipboard and pasted on the
 * platform, exactly as an untouched draft is. The draft on record stays what the engine
 * wrote, so the ledger keeps saying what was drafted rather than what was posted.
 */
export function EngagementActions({
  targetId,
  doneLabel,
  drafts,
  publishMode,
  postUrl,
}: {
  readonly targetId: string;
  readonly doneLabel: string;
  readonly drafts: readonly EngagementDraft[];
  readonly publishMode: PublishMode;
  /** The post on the platform. Null while no listener runs, which is most of this build. */
  readonly postUrl: string | null;
}) {
  const [state, action] = useActionState(markEngagement, INITIAL);
  const [chosen, setChosen] = useState(drafts[0]?.id ?? '');
  const [copied, setCopied] = useState(false);
  /** Edited text, by draft id. Absent means untouched — so "Reset" knows there is nothing to undo. */
  const [edits, setEdits] = useState<Readonly<Record<string, string>>>({});
  const [editing, setEditing] = useState(false);

  const draft = drafts.find((d) => d.id === chosen) ?? drafts[0];
  const text = draft === undefined ? '' : (edits[draft.id] ?? draft.text);
  const changed = draft !== undefined && edits[draft.id] !== undefined && edits[draft.id] !== draft.text;

  function pick(id: string) {
    setChosen(id);
    setCopied(false);
    setEditing(false);
  }

  async function copy() {
    if (draft === undefined) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      // Clipboard access can be refused. The text is on screen and selectable either way,
      // which is why this says what happened rather than failing silently.
      setCopied(false);
    }
  }

  return (
    <div className="drafts">
      {drafts.length > 0 && (
        <fieldset className="drafts__set">
          <legend className="drafts__legend t-meta">
            {drafts.length} drafts · {PUBLISH_MODE_LABEL[publishMode]} · a person approves every word
          </legend>
          {drafts.map((option) => (
            <label key={option.id} className={option.id === chosen ? 'draft draft--on' : 'draft'}>
              <input
                type="radio"
                name={`draft-${targetId}`}
                value={option.id}
                checked={option.id === chosen}
                onChange={() => pick(option.id)}
              />
              <span className="draft__body">
                <span className="draft__angle t-meta">
                  {stance(option.stance).angle}
                  {option.id === chosen && changed && <span className="draft__edited"> · edited by you</span>}
                </span>
                {option.id === chosen && editing ? (
                  <textarea
                    className="draft__field t-body-m"
                    value={text}
                    rows={Math.max(3, Math.ceil(text.length / 64))}
                    aria-label="Your words for this comment"
                    onChange={(event) => {
                      setEdits((current) => ({ ...current, [option.id]: event.target.value }));
                      setCopied(false);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === 'Escape') setEditing(false);
                    }}
                  />
                ) : (
                  <span className="draft__text t-body-m">{option.id === chosen ? text : option.text}</span>
                )}
                <span className="draft__basis t-meta text-tertiary">{option.basis}</span>
              </span>
            </label>
          ))}
        </fieldset>
      )}

      <div className="engage__actions">
        {draft !== undefined && (
          <>
            <button
              type="button"
              className={editing ? 'btn btn--active' : 'btn'}
              aria-pressed={editing}
              onClick={() => setEditing((open) => !open)}
            >
              {editing ? 'Done editing' : 'Edit'}
            </button>
            {changed && (
              <button
                type="button"
                className="btn"
                onClick={() => {
                  setEdits(({ [draft.id]: _dropped, ...rest }) => rest);
                  setCopied(false);
                }}
              >
                Reset to the draft
              </button>
            )}
          </>
        )}

        {draft !== undefined && publishMode === 'one_tap' && (
          <>
            {postUrl === null ? (
              <span className="drafts__note t-body-s text-tertiary">
                No post link yet — the listener is not running, so this one cannot open on the platform.
              </span>
            ) : (
              <a className="btn btn--primary" href={postUrl} target="_blank" rel="noreferrer" onClick={copy}>
                Open and paste
              </a>
            )}
            <button type="button" className="btn" onClick={copy}>
              {copied ? 'Copied' : 'Copy text'}
            </button>
          </>
        )}

        <form action={action}>
          <input type="hidden" name="targetId" value={targetId} />
          <input type="hidden" name="status" value="done" />
          <Button primary={publishMode !== 'one_tap'} pending="Saving">
            {doneLabel}
          </Button>
        </form>
        <form action={action}>
          <input type="hidden" name="targetId" value={targetId} />
          <input type="hidden" name="status" value="skipped" />
          <Button pending="Saving">Skip</Button>
        </form>
        <form action={action}>
          <input type="hidden" name="targetId" value={targetId} />
          <input type="hidden" name="status" value="not_my_lane" />
          <Button pending="Saving">Not my lane</Button>
        </form>
      </div>

      {state.errors.length > 0 && (
        <p className="engage__error t-body-s" role="alert">
          {state.errors.join(' ')}
        </p>
      )}
    </div>
  );
}

function Button({ children, pending, primary = false }: { readonly children: string; readonly pending: string; readonly primary?: boolean }) {
  const status = useFormStatus();
  return (
    <button type="submit" className={primary ? 'btn btn--primary' : 'btn'} disabled={status.pending}>
      {status.pending ? pending : children}
    </button>
  );
}
