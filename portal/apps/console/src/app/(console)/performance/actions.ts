'use server';

import { AD_STATES, type AdState } from '@caspr-portal/domain';
import { revalidatePath } from 'next/cache';

import { getRepository } from '@/lib/repository';
import { getSession } from '@/lib/session';

export interface AdActionState {
  readonly errors: readonly string[];
}

function isAdState(value: FormDataEntryValue | null): value is AdState {
  return typeof value === 'string' && (AD_STATES as readonly string[]).includes(value);
}

/**
 * Move one ad along its lifecycle.
 *
 * ⚑ **The same shape as a content decision, and deliberately not the same action.** A post is
 * reviewed against the claims register and the voice; an ad is approved against those *and*
 * against money — it has a budget behind it, a landing page that has to match, and a kill
 * rule waiting. Sharing `decide` would have meant one reason-code list serving two different
 * questions.
 *
 * What is shared is the shape a person already knows: approve, hold, and a rejection that
 * carries its reason.
 */
export async function moveAd(_previous: AdActionState, formData: FormData): Promise<AdActionState> {
  const session = getSession();
  if (session.role === 'contributor') {
    return { errors: ['Deciding an ad needs the Reviewer role. Ask an Owner to change it in Admin.'] };
  }

  const id = formData.get('adId');
  const to = formData.get('to');
  if (typeof id !== 'string' || !isAdState(to)) {
    return { errors: ['That did not arrive whole. Reload and try again.'] };
  }

  const moved = await getRepository().moveAd(id, to);
  if (!moved) {
    return {
      errors: [
        'That move is not one this ad can make. A killed angle stays killed — paid is a validation instrument, and re-running a message that already lost is what would make it a worthless one.',
      ],
    };
  }

  revalidatePath('/performance', 'layout');
  return { errors: [] };
}
