/**
 * Engagement — everything that is not a post we write.
 *
 * `content-engine-operating-model.md` ㉖ draws the line once and it holds everywhere:
 *
 *   CREATION   posts, blogs, analyses, emails        → through review, always (⑬)
 *   ENGAGEMENT comments, reposts, reactions           → no review gate; "a person, on-platform,
 *                                                       always"
 *
 * Engagement then splits by direction, which is the part this file adds:
 *
 *   OUTBOUND   we act on someone else's post  — comment · repost with a line
 *   INBOUND    someone acts on ours           — tagged us (mention) · reshared us
 *
 * Outbound rules are Joy's and already written: ⑰ the Comment Desk and ㉕ the Amplify
 * Register. **Inbound had no rule anywhere in the specification** (found 2026-09-15). The
 * rule chosen here invents nothing new: an inbound act inherits the tier of the account
 * that made it, and that tier's permitted action decides the response — so the register
 * that governs what we *start* also governs how we *answer*.
 */

export const ENGAGEMENT_KINDS = ['comment', 'repost', 'mention', 'reshare'] as const;
export type EngagementKind = (typeof ENGAGEMENT_KINDS)[number];

export function isInbound(kind: EngagementKind): boolean {
  return kind === 'mention' || kind === 'reshare';
}

/** ㉕ — four tiers, four permissions. */
export type AmplifyTier = 1 | 2 | 3 | 4;

export interface TierDefinition {
  readonly tier: AmplifyTier;
  readonly name: string;
  /** What we may do visibly on this account's posts. Empty means read only. */
  readonly permits: readonly ('repost' | 'comment')[];
}

export const AMPLIFY_TIERS: Readonly<Record<AmplifyTier, TierDefinition>> = {
  1: { tier: 1, name: 'Amplify', permits: ['repost', 'comment'] },
  2: { tier: 2, name: 'Engage', permits: ['comment'] },
  3: { tier: 3, name: 'Observe', permits: [] },
  4: { tier: 4, name: 'Competitor', permits: [] },
};

export type EngagementPlatform = 'linkedin' | 'x' | 'reddit';

/** Someone else's post, as it appears on the platform. */
export interface ExternalPost {
  readonly id: string;
  readonly platform: EngagementPlatform;
  readonly author: string;
  readonly authorDetail: string;
  readonly authorIsCompany: boolean;
  readonly text: string;
  readonly postedAt: string;
}

export interface EngagementTarget {
  readonly id: string;
  readonly kind: EngagementKind;
  readonly surfacedAt: string;
  readonly post: ExternalPost;
  /** The account's tier on the register, or `null` when it is not on it. */
  readonly accountTier: AmplifyTier | null;
  /** The post is a teammate's own — ㉖'s three-of-seven ceiling applies. */
  readonly teamPost: boolean;
  readonly whyRelevant: string;
  /**
   * ⑰'s guard rail, and it is a data constraint rather than a judgement: "If
   * `the_fact_to_bring` is empty, the target does not appear. The engine cannot surface a
   * post we have nothing to say about, which means it cannot generate applause."
   */
  readonly factToBring: string | null;
  readonly ourSource: string | null;
  /** A roster lane id, or `social` for the company's own accounts. */
  readonly assignedTo: string;
  /** For inbound acts: who was tagged or reshared — `caspr` for the Company Page. */
  readonly about: string | null;
  /** A stand-in: no listener runs yet, so no real post exists to quote. */
  readonly illustrative: boolean;
  readonly status: 'open' | 'done' | 'skipped';
}

export type Surfacing = { readonly surfaced: true } | { readonly surfaced: false; readonly why: string };

/**
 * Whether a target reaches a person at all.
 *
 * Outbound targets are filtered by the register and by the guard rail. Inbound acts are
 * always surfaced — someone has acted on us, and a person should know — and the tier then
 * decides what, if anything, we do back (`inboundResponse`).
 */
export function surfacing(target: EngagementTarget): Surfacing {
  if (isInbound(target.kind)) return { surfaced: true };

  const tier = target.accountTier;
  if (tier === 3 || tier === 4) {
    return {
      surfaced: false,
      why: `${AMPLIFY_TIERS[tier].name} tier — read only. Nothing visible, ever (㉕).`,
    };
  }
  if (target.kind === 'repost' && tier !== 1) {
    return {
      surfaced: false,
      why: 'Reposts are for tier 1 only. "We do not lend our feed to people we have no relationship with" (㉕).',
    };
  }
  if (!target.factToBring?.trim() || !target.ourSource?.trim()) {
    return {
      surfaced: false,
      why: 'No fact to bring. A comment with nothing to add is applause, so the target never appears (⑰).',
    };
  }
  return { surfaced: true };
}

export type InboundResponse = 'repost_with_line' | 'reply' | 'read_only' | 'nothing';

/** What we do back when someone tags or reshares us. */
export function inboundResponse(target: EngagementTarget): InboundResponse {
  const tier = target.accountTier;
  if (tier === 3 || tier === 4) return 'read_only';

  const hasFact = Boolean(target.factToBring?.trim() && target.ourSource?.trim());
  // A bare reshare carries no words of its own. There is nothing to answer, and a reaction
  // is untracked by design: "a like with a target is bought engagement with extra steps".
  if (target.kind === 'reshare' && target.post.text.trim().length === 0) return 'nothing';
  if (!hasFact) return 'nothing';
  if (tier === 1 && target.kind === 'mention') return 'repost_with_line';
  return 'reply';
}

export const INBOUND_RESPONSE_LABEL: Readonly<Record<InboundResponse, string>> = {
  repost_with_line: 'Repost with a line of our own',
  reply: 'Reply, with the fact below',
  read_only: 'Read only — no visible reaction',
  nothing: 'Nothing needed',
};

/**
 * ㉖ constraint 3: "At most 3 of 7 on any one post — a ceiling, and nobody is assigned."
 * The uniformity is the tell.
 */
export const TEAM_POST_CEILING = 3;

export function teamPostCeilingReached(targets: readonly EngagementTarget[], postId: string): boolean {
  const onPost = targets.filter(
    (t) => t.teamPost && t.post.id === postId && t.kind === 'comment' && t.status !== 'skipped',
  );
  return onPost.length >= TEAM_POST_CEILING;
}

/**
 * Where the act is carried out.
 *
 * Design spec §5 rule 4: "Individual posting is not in this tree. The core team's Personal
 * Queue is a separate mobile surface for seven people who never open the console." So a
 * target for Joy is Joy's to act on, from Joy's queue; a target for the company's accounts is
 * the Social specialist's, here.
 */
export function actedFrom(target: Pick<EngagementTarget, 'assignedTo'>): 'console' | 'personal_queue' {
  return target.assignedTo === 'social' ? 'console' : 'personal_queue';
}

/**
 * Where a tag can actually reach this console — measured, not assumed.
 *
 * The answer differs by surface, and pretending otherwise would promise a notification that
 * never arrives.
 */
export interface MentionSource {
  readonly surface: string;
  readonly reach: 'yes' | 'no' | 'unverified';
  readonly how: string;
}

export const MENTION_SOURCES: readonly MentionSource[] = [
  {
    surface: 'LinkedIn Company Page',
    reach: 'yes',
    how: 'organizationalEntityNotifications: SHARE_MENTION when a post tags the Page, SHARE when a post is reshared, COMMENT on our posts. Webhook, or a 60-day pull. Needs rw_organization_admin. Verified 2026-09-15 against LinkedIn’s documentation. A tag inside a comment is not in the documented action list.',
  },
  {
    surface: 'Personal LinkedIn profiles',
    reach: 'no',
    how: 'LinkedIn has no member-notification API, and reading member activity needs r_member_social — which build spec §6.1 forbids requesting. The person sees the tag in their own notifications.',
  },
  {
    surface: 'X',
    reach: 'no',
    how: 'Reading mentions is a paid tier, and X was decided publish-only (operating model, source register).',
  },
  {
    surface: 'Reddit',
    reach: 'unverified',
    how: 'The Reddit API is understood to expose username mentions for an account we authenticate. Not confirmed — its documentation could not be fetched on 2026-09-15. Check before building.',
  },
];
