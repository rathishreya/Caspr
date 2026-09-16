'use server';

import { AD_PROMPT_MAX, EMAIL_STATES, type EmailState } from '@caspr-portal/domain';
import { revalidatePath } from 'next/cache';

import { getRepository } from '@/lib/repository';
import { getSession } from '@/lib/session';

export interface EmailActionState {
  readonly errors: readonly string[];
}

function isEmailState(value: FormDataEntryValue | null): value is EmailState {
  return typeof value === 'string' && (EMAIL_STATES as readonly string[]).includes(value);
}

/**
 * Move one email along.
 *
 * ⚑ **Sign-off and scheduling are two moves, and keeping them apart is the safety of this
 * workstream.** `operations-runbook.md` §8: *"Joy signs off the first email of any sequence."*
 * An email can be signed off months before the five preconditions hold — collapsing the two
 * would make approving copy the same act as sending it to 1,600 people.
 */
export async function moveEmail(_previous: EmailActionState, formData: FormData): Promise<EmailActionState> {
  const session = getSession();
  if (session.role === 'contributor') {
    return { errors: ['Signing off an email needs the Reviewer role. Ask an Owner to change it in Admin.'] };
  }

  const id = formData.get('emailId');
  const to = formData.get('to');
  if (typeof id !== 'string' || !isEmailState(to)) {
    return { errors: ['That did not arrive whole. Reload and try again.'] };
  }

  const moved = await getRepository().moveEmail(id, to);
  if (!moved) {
    return {
      errors: [
        'That move is not one this email can make. A sent email is in somebody’s inbox — nothing here reaches it.',
      ],
    };
  }

  revalidatePath('/email', 'layout');
  return { errors: [] };
}

/**
 * Send an email back to be rewritten, with the instruction attached.
 *
 * The same rule as the post queue and the ads: **the reviewer types an instruction, never the
 * email.** Founder-signed copy rewritten in a text box is how a claim nobody checked arrives
 * in an inbox under a real person's name.
 */
export async function reviseEmail(_previous: EmailActionState, formData: FormData): Promise<EmailActionState> {
  const session = getSession();
  if (session.role === 'contributor') {
    return { errors: ['Changing an email needs the Reviewer role.'] };
  }

  const id = formData.get('emailId');
  const note = formData.get('note');
  if (typeof id !== 'string' || typeof note !== 'string' || note.trim().length === 0) {
    return { errors: ['Say what to change. The writer works from your words, so an empty instruction is not one.'] };
  }
  if (note.length > AD_PROMPT_MAX) {
    return { errors: [`${note.length} characters, and the limit is ${AD_PROMPT_MAX}.`] };
  }

  const revised = await getRepository().reviseEmail(id, note.trim());
  if (!revised) {
    return { errors: ['A sent email cannot be rewritten. It is already in somebody’s inbox.'] };
  }

  revalidatePath('/email', 'layout');
  return { errors: [] };
}
