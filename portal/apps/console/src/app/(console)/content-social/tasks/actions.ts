'use server';

import { validateDecision } from '@caspr-portal/domain';
import type { Route } from 'next';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { getRepository } from '@/lib/repository';
import { getSession } from '@/lib/session';

export interface DecideState {
  readonly errors: readonly string[];
}

/**
 * Commit one review decision.
 *
 * The form validates as a courtesy; this validates because it is the only check that a
 * request cannot skip. The rules are the domain's, so the form and this action cannot
 * disagree about what a valid rejection is.
 */
export async function decide(_previous: DecideState, formData: FormData): Promise<DecideState> {
  const session = getSession();

  // Build spec §3.10: a Contributor has "own personal queue only". Review is not theirs to
  // take, whatever a crafted request says.
  if (session.role === 'contributor') {
    return { errors: ['Reviewing posts needs the Reviewer role. Ask an Owner to change it in Admin.'] };
  }

  const validated = validateDecision({
    itemId: formData.get('itemId'),
    action: formData.get('action'),
    reasonCode: formData.get('reasonCode'),
    note: formData.get('note'),
    secondsSpent: formData.get('secondsSpent'),
  });
  if (!validated.ok) return { errors: validated.errors };

  const result = await getRepository().decide(validated.value, `${session.name} — ${session.roleLabel}`);
  if (!result.ok) {
    return {
      errors: [
        result.reason === 'already_decided'
          ? 'Someone decided this post while it was open. Their decision stands — decisions commit on action and are not overwritten.'
          : 'This post is no longer in the week. Reload to see the current queue.',
      ],
    };
  }

  // Everything that counts decisions reads from the same data: the tab badge, the queue,
  // the dashboard's reject rate, the Calendar's banner. All of it moves together.
  revalidatePath('/content-social', 'layout');
  revalidatePath('/calendar');

  const params = new URLSearchParams({ done: result.item.id, did: validated.value.action });
  const platform = formData.get('platform');
  if (typeof platform === 'string' && platform.length > 0) params.set('platform', platform);

  redirect(`/content-social/tasks?${params.toString()}#decide` as Route);
}
