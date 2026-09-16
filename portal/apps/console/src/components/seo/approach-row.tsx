'use client';

import {
  APPROACH_NEXT,
  APPROACH_STATE_LABEL,
  SHAPE_HOW,
  SHAPE_LABEL,
  SHAPE_OWNER,
  type Approach,
} from '@caspr-portal/domain';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

import { advanceApproach, type SeoState } from '@/app/(console)/seo/actions';
import { Icon } from '@/components/icons';

const INITIAL: SeoState = { errors: [] };

/**
 * One target, and what can be done to it.
 *
 * ⚑ **The buttons are the state machine, not a menu.** `approach.ts` decides what may follow
 * what, and the row renders exactly the moves that row can make — so `identified` offers
 * *Sent it*, and `approached` offers the three ways it can land. A terminal row offers
 * nothing, because a declined roundup that is pitched again is a new row: the denominator has
 * to keep its own history or the kill condition means nothing.
 *
 * ⚠ **A row whose owner has not been hired is disabled and says so.** `operations-runbook.md`
 * §2A: *"a directory submission is a form; converting an editor at The Drum is a
 * relationship. The current SEO practitioner is tactical and does not do this."* Editorial
 * pitches lapse until the earned-media hire lands, and that should be visible as a decision
 * rather than discovered as a silence.
 */
export function ApproachRow({ approach }: { readonly approach: Approach }) {
  const [state, action] = useActionState(advanceApproach, INITIAL);
  const moves = APPROACH_NEXT[approach.state];
  const owner = SHAPE_OWNER[approach.shape];
  const lapsed = owner === 'earned_media';
  const terminal = moves.length === 0;

  return (
    <article className={terminal ? 'target target--closed' : 'target'} aria-label={approach.domain}>
      <div className="target__id">
        <p className="target__domain t-body-m">
          {approach.domain}
          {approach.priority === true && (
            <span className="target__priority t-meta" title="Confirmed across two independent query families">
              PRIORITY
            </span>
          )}
        </p>
        <p className="target__meta t-meta">
          {SHAPE_LABEL[approach.shape]}
          {approach.position !== null && <> · ranks {approach.position}</>} · {approach.questionId}
        </p>
      </div>

      <div className="target__body">
        <p className="t-body-s">{approach.why}</p>
        <p className="t-body-s text-tertiary">{SHAPE_HOW[approach.shape]}</p>
      </div>

      <div className="target__act">
        <span className={`tag tag--${approach.state} t-meta`}>{APPROACH_STATE_LABEL[approach.state]}</span>

        {lapsed && approach.state === 'identified' ? (
          <span className="target__lapsed t-body-s">
            <Icon name="alert" size={14} /> Lapsed — no owner
          </span>
        ) : (
          moves.map((move) => (
            <form key={move} action={action}>
              <input type="hidden" name="approachId" value={approach.id} />
              <input type="hidden" name="to" value={move} />
              <Move to={move} />
            </form>
          ))
        )}

        {approach.approachedOn !== undefined && (
          <span className="t-meta text-tertiary">sent {approach.approachedOn}</span>
        )}
      </div>

      {state.errors.length > 0 && (
        <p className="target__error t-body-s" role="alert">
          {state.errors.join(' ')}
        </p>
      )}
    </article>
  );
}

/** The word on the button is what the person did, not what the system will do. */
const MOVE_LABEL: Readonly<Record<string, { readonly label: string; readonly pending: string; readonly kind: string }>> = {
  approached: { label: 'Sent it', pending: 'Logging', kind: 'btn btn--primary' },
  included: { label: 'Included', pending: 'Logging', kind: 'btn btn--approve' },
  declined: { label: 'Declined', pending: 'Logging', kind: 'btn btn--reject' },
  no_reply: { label: 'No reply', pending: 'Logging', kind: 'btn' },
};

function Move({ to }: { readonly to: string }) {
  const { pending } = useFormStatus();
  const move = MOVE_LABEL[to] ?? { label: to, pending: 'Saving', kind: 'btn' };
  return (
    <button type="submit" className={move.kind} disabled={pending}>
      {pending ? move.pending : move.label}
    </button>
  );
}
