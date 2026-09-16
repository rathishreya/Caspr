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
          : result.reason === 'window_closed'
            ? 'This daily post was not approved within 24 hours, so it has been discarded. It is kept in the history below and cannot be published.'
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

  redirect(`${queuePath(formData.get('from'))}?${params.toString()}#decide` as Route);
}

/**
 * Back to the queue the decision was taken from — This week or Today.
 *
 * Allow-listed rather than echoed. `from` arrives in a form body, so trusting it would let a
 * crafted request turn an approval into an open redirect; the two queues are the only two
 * answers there are.
 */
function queuePath(from: FormDataEntryValue | null): string {
  return from === '/content-social/today' ? '/content-social/today' : '/content-social/tasks';
}

/** The three endings §6.5 allows once a card is open. `open` is not one of them. */
function isClosingStatus(value: FormDataEntryValue | null): value is 'done' | 'skipped' | 'not_my_lane' {
  return value === 'done' || value === 'skipped' || value === 'not_my_lane';
}

/**
 * Record that a person acted on an engagement target, skipped it, or sent it back.
 *
 * Not a review decision, and deliberately a separate action: engagement sits outside the
 * review gate (operating model ㉖), so it carries no reason code, no note and no minutes.
 * The person has already done the real work on the platform; this only closes the loop so
 * the target stops asking.
 */
export async function markEngagement(_previous: DecideState, formData: FormData): Promise<DecideState> {
  const id = formData.get('targetId');
  const status = formData.get('status');
  if (typeof id !== 'string' || !isClosingStatus(status)) {
    return { errors: ['That action did not arrive whole. Reload and try again.'] };
  }

  const changed = await getRepository().markEngagement(id, status);
  if (!changed) {
    return { errors: ['This one was already closed — by you in another tab, or by a teammate.'] };
  }

  revalidatePath('/content-social', 'layout');
  // Engagement lives on Today and only on Today — everything it carries is under 72 hours old.
  redirect('/content-social/today#engage' as Route);
}
