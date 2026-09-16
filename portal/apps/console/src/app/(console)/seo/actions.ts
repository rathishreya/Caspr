'use server';

import { APPROACH_STATES, type ApproachState } from '@caspr-portal/domain';
import { revalidatePath } from 'next/cache';

import { getRepository } from '@/lib/repository';
import { getSession } from '@/lib/session';

export interface SeoState {
  readonly errors: readonly string[];
}

function isApproachState(value: FormDataEntryValue | null): value is ApproachState {
  return typeof value === 'string' && (APPROACH_STATES as readonly string[]).includes(value);
}

/**
 * Move one approach along the target list.
 *
 * ⚑ **This is the only thing on the discoverability workstream a person moves by hand, and
 * it is the thing the presence kill condition reads** — 3 inclusions after 25 approaches
 * (`.agents/gtm-strategy.md` §3.1a). So it is a real write with a real gate rather than a
 * checkbox: the state machine in `approach.ts` decides what may follow what, and this action
 * is the only caller that can reach it.
 *
 * Nothing here is a review decision. An approach carries no reason code and no note: the
 * person has already done the work — submitted the form, sent the pitch, joined the thread —
 * and this records the outcome so the clock can be read.
 */
export async function advanceApproach(_previous: SeoState, formData: FormData): Promise<SeoState> {
  const session = getSession();
  // Build spec §3.10: a Contributor has their own personal queue only. Outreach is not theirs
  // to log, whatever a crafted request says.
  if (session.role === 'contributor') {
    return { errors: ['Logging an approach needs the Reviewer role. Ask an Owner to change it in Admin.'] };
  }

  const id = formData.get('approachId');
  const to = formData.get('to');
  if (typeof id !== 'string' || !isApproachState(to)) {
    return { errors: ['That did not arrive whole. Reload and try again.'] };
  }

  const moved = await getRepository().advanceApproach(id, to);
  if (!moved) {
    return {
      errors: [
        'That move is not one this row can make. An approach goes out once and lands once — a target that was declined and is pitched again is a new row, because the denominator has to keep its own history.',
      ],
    };
  }

  // The dashboard's presence clock, the Tasks queue and the Backlog all read the same count.
  revalidatePath('/seo', 'layout');
  return { errors: [] };
}

/**
 * Tick off one SEO task.
 *
 * Three a week — schema, internal links, metadata (`operations-runbook.md` §4). They are
 * derivative work, 1–2 minutes each, which is why there is no review gate on them and no
 * undo: the cost of getting one wrong is doing it again.
 */
export async function completeSeoTask(_previous: SeoState, formData: FormData): Promise<SeoState> {
  const session = getSession();
  if (session.role === 'contributor') {
    return { errors: ['Closing an SEO task needs the Reviewer role.'] };
  }

  const id = formData.get('taskId');
  if (typeof id !== 'string') return { errors: ['That did not arrive whole. Reload and try again.'] };

  const done = await getRepository().completeSeoTask(id);
  if (!done) return { errors: ['That task is not in this week. Reload to see the current list.'] };

  revalidatePath('/seo', 'layout');
  return { errors: [] };
}

/*
 * ⛔ Nothing but async functions may be exported from a "use server" file — a constant here
 * fails the whole module at evaluation, which takes both actions down with it and turns
 * every write on this workstream into a 500. Route constants live in `lib/nav.ts`.
 */
