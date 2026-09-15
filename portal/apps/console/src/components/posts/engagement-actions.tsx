'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

import { markEngagement, type DecideState } from '@/app/(console)/content-social/tasks/actions';

const INITIAL: DecideState = { errors: [] };

/**
 * Close an engagement target once the person has acted on the platform — or decided not to.
 *
 * Two buttons and no text box. ⑰ rule 1: "The desk surfaces the target and the fact; it
 * never posts, never drafts a finished comment for one-click sending." The words are typed
 * on LinkedIn, by the person whose name is on them; this only records that it happened.
 */
export function EngagementActions({ targetId, doneLabel }: { readonly targetId: string; readonly doneLabel: string }) {
  const [state, action] = useActionState(markEngagement, INITIAL);

  return (
    <div className="engage__actions">
      <form action={action}>
        <input type="hidden" name="targetId" value={targetId} />
        <input type="hidden" name="status" value="done" />
        <Button primary pending="Saving">
          {doneLabel}
        </Button>
      </form>
      <form action={action}>
        <input type="hidden" name="targetId" value={targetId} />
        <input type="hidden" name="status" value="skipped" />
        <Button pending="Saving">Skip</Button>
      </form>
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
