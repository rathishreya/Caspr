/**
 * The signed-in person.
 *
 * Auth is Cognito (build spec §5, §3.10). Until it is wired, this returns the reviewer the
 * Figma frames are drawn with, behind the shape the real session will have — so the rail
 * footer, the queue assignment and the workstream list all read from one place and none of
 * them has to change when Cognito lands.
 *
 * ⛔ There is no signup page. Invite from Admin is the only route in (§3.10b), which is
 * why this module has no notion of an anonymous visitor: an unauthenticated request is a
 * redirect at the edge, not a state a screen renders.
 */

export type Role = 'owner' | 'reviewer' | 'contributor';

export interface Session {
  readonly name: string;
  readonly roleLabel: string;
  readonly role: Role;
  /** Workstream ids from the nav tree. Named in the rail footer so the tree is never abstract. */
  readonly ownsWorkstreams: readonly string[];
}

export function getSession(): Session {
  return {
    name: 'Priya',
    roleLabel: 'Marketing TL',
    role: 'reviewer',
    // §5 rule 3: the mapping is not 1:1 — the TL owns Performance and Email.
    ownsWorkstreams: ['performance', 'email'],
  };
}
