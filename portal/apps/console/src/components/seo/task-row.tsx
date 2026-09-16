'use client';

import { SEO_TASK_LABEL, type SeoTask } from '@caspr-portal/domain';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

import { completeSeoTask, type SeoState } from '@/app/(console)/seo/actions';
import { Icon } from '@/components/icons';

const INITIAL: SeoState = { errors: [] };

/**
 * One SEO task.
 *
 * Three a week — schema, internal links, metadata (`operations-runbook.md` §4). They are
 * derivative work at 1–2 minutes each rather than origination at 8–15, which is why there is
 * no review gate here and no reason code: the cost of getting one wrong is doing it again.
 *
 * Each says **which clock it moves**, because a week of three tasks all on the same component
 * is a week that moved one clock and let two stand still — and with three running on three
 * different horizons, that is the easiest mistake to make without noticing.
 */
export function TaskRow({ task }: { readonly task: SeoTask }) {
  const [state, action] = useActionState(completeSeoTask, INITIAL);

  return (
    <form className={task.done ? 'task task--done' : 'task'} action={action}>
      <input type="hidden" name="taskId" value={task.id} />

      <div className="task__id">
        <p className="task__title t-body-m">
          {task.title}
          {task.debt === true && <span className="task__debt t-meta">DEBT</span>}
        </p>
        <p className="task__meta t-meta">
          {SEO_TASK_LABEL[task.kind]} · moves {task.serves}
        </p>
      </div>

      <p className="task__what t-body-s">{task.what}</p>

      <div className="task__act">{task.done ? <Done /> : <Tick />}</div>

      {state.errors.length > 0 && (
        <p className="target__error t-body-s" role="alert">
          {state.errors.join(' ')}
        </p>
      )}
    </form>
  );
}

function Tick() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn btn--approve" disabled={pending}>
      {pending ? 'Closing' : 'Done'}
    </button>
  );
}

function Done() {
  return (
    <span className="task__closed t-meta">
      <Icon name="check" size={14} /> Closed
    </span>
  );
}
