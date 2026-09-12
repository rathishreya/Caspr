/**
 * The content item and the vocabulary around it.
 *
 * Shapes come from `portal-build-spec.md` §4 and §4.1. §4.1 is emphatic that the existing
 * card schema is adopted rather than paralleled — "a second schema means two places to
 * change when the model moves, and they will diverge" — so the generation-brief fields sit
 * on `ContentItem` itself rather than in a sibling type.
 */

/**
 * Where an item goes.
 *
 * `community` and `outreach` are here and they are deliberately never automated —
 * build spec §3.6: "Automated posting here gets accounts banned and burns the channel
 * permanently." The portal surfaces the thread and drafts the reply; a person posts it.
 */
export const CHANNELS = [
  'linkedin',
  'linkedin_page',
  'x',
  'blog',
  'email',
  'community',
  'outreach',
] as const;
export type Channel = (typeof CHANNELS)[number];

/** How a channel is published. Build spec §3.6. */
export const CHANNEL_PUBLISH_MODE: Readonly<Record<Channel, 'automated' | 'assisted' | 'human_only'>> = {
  blog: 'automated',
  email: 'automated',
  linkedin_page: 'automated',
  linkedin: 'automated',
  x: 'automated',
  /** ⛔ Permanently out of scope for automation — build spec §11. */
  community: 'human_only',
  outreach: 'human_only',
};

/**
 * Item lifecycle.
 *
 * `holding` is a first-class status, not an absence of one. Runbook §1: "Unreviewed items
 * hold — nothing publishes unreviewed", and build spec §3.6: "There is no timeout that
 * pushes it live."
 */
export const ITEM_STATUSES = [
  'generated',
  'linted',
  'in_review',
  'approved',
  'rejected',
  'holding',
  'scheduled',
  'published',
] as const;
export type ItemStatus = (typeof ITEM_STATUSES)[number];

/**
 * Reject reason taxonomy — fixed, in this order. Build spec §3.4.
 *
 * The order is load-bearing: design spec §5A.3 keys them `1`–`0` in review mode and says
 * "muscle memory is the point". Reordering this array silently rebinds ten keyboard
 * shortcuts for three people who review 23 items a week.
 */
export const REJECT_CODES = [
  'FACT_WRONG',
  'STALE_NUMBER',
  'UNSUPPORTED_CLAIM',
  'OFF_VOICE',
  'BANNED_TERM',
  'WRONG_CTA',
  'DUPLICATE',
  'LEGAL_RISK',
  'BOUNDARY_BREACH',
  'WEAK',
] as const;
export type RejectCode = (typeof REJECT_CODES)[number];

/** Content pillars, post-2026-08-20 reorder. `brand-guidelines.md` is the authority. */
export const PILLARS = [
  'analyst_not_assistant',
  'analytical_ai',
  'weeks_to_minutes',
  'fraction_of_cost',
  'your_data_is_yours',
] as const;
export type Pillar = (typeof PILLARS)[number];

/** Funnel stage — orthogonal to narrative, and it decides the CTA. Operating model ㉗. */
export const FUNNEL_STAGES = ['awareness', 'consideration', 'intent', 'retention'] as const;
export type FunnelStage = (typeof FUNNEL_STAGES)[number];

/**
 * ⚠ An awareness post has no link to stamp, which is why awareness cannot be measured by
 * the Performance Desk and must not be judged by it. Operating model ㉗.
 */
export const STAGES_CARRYING_ICP_HINT: ReadonlySet<FunnelStage> = new Set<FunnelStage>([
  'consideration',
  'intent',
]);

/**
 * The eight ICPs, in CLAUDE.md's order. `icp_hint` on a stamped link is one of these.
 */
export const ICPS = [
  'consulting',
  'strategy',
  'investors',
  'category_managers',
  'agencies',
  'graduate_researchers',
  'market_research',
  'startups',
] as const;
export type Icp = (typeof ICPS)[number];

/** A citation, resolved. Design spec §5A.3: the reviewer judges support, not a URL. */
export interface Citation {
  readonly url: string;
  readonly publisher: string;
  readonly publishedOn: string;
  /** The figure or sentence being leant on, quoted. */
  readonly quotedClaim: string;
  /**
   * `L22` must FETCH the source, not check the field is non-empty — build spec §3.3:
   * "a populated-but-dead citation is worse than no citation."
   */
  readonly resolvedAt: string | null;
}

/**
 * The `fact_lookup` probe verdict. Build spec §3.2: it demotes a candidate regardless of
 * its demand, because "a weak analysis published under our own name costs more than the
 * traffic is worth".
 */
export type SourceableVerdict = 'found' | 'thin' | 'not_found';

export interface ContentItem {
  readonly id: string;
  readonly channel: Channel;
  /** Type A published analysis · Type B search answer · Type C permission layer. §3.7. */
  readonly type: 'analysis' | 'search_answer' | 'permission' | 'derivative' | 'personal' | 'outreach';
  readonly title: string;
  /** Null for company-voice items. Non-null means a named person's lane owns it. */
  readonly voiceLane: string | null;
  readonly narrative: string;
  readonly pillar: Pillar;
  readonly funnelStage: FunnelStage;
  readonly icp: Icp | null;
  readonly status: ItemStatus;
  readonly assignedReviewer: string | null;
  /** ISO 8601, with offset. Null for an item that has no slot yet. */
  readonly scheduledFor: string | null;
  readonly citations: readonly Citation[];
  /** The `fact_lookup` probe, §3.2. */
  readonly sourceable: SourceableVerdict;
  /** Set by the hygiene stage between approval and publish. §3.6a. */
  readonly hygieneAppliedAt: string | null;
  /** Whose subject this is, for the one-subject-one-person-one-week check. ㉖. */
  readonly topicId: string;
}

/**
 * An item publishes only if a person decided it should.
 *
 * Build spec §3.6 states it as an absolute — "Unreviewed content never publishes. There is
 * no timeout that pushes it live." Expressed here as a predicate so no surface has to
 * re-derive it, and so the calendar's counts and the publisher agree by construction.
 */
export function willPublish(item: Pick<ContentItem, 'status'>): boolean {
  return item.status === 'approved' || item.status === 'scheduled' || item.status === 'published';
}

/**
 * An item that is holding, in review, or still linting is unreviewed at the deadline —
 * and it rolls rather than publishing.
 */
export function isUnreviewed(item: Pick<ContentItem, 'status'>): boolean {
  return item.status === 'generated' || item.status === 'linted' || item.status === 'in_review';
}

/**
 * Channel labels, uppercase, for the mono `Meta` style. Never used in prose.
 *
 * `linkedin_page` reads `COMPANY` rather than `LINKEDIN PAGE`: at 11px in a 145px calendar
 * column the longer label ellipsises, and a truncated label is worse than a shorter true
 * one. It also matches how the items themselves are titled — "Company — the $600m gap".
 */
export const CHANNEL_LABEL: Readonly<Record<Channel, string>> = {
  linkedin: 'LINKEDIN',
  linkedin_page: 'COMPANY',
  x: 'X',
  blog: 'BLOG',
  email: 'EMAIL',
  community: 'COMMUNITY',
  outreach: 'OUTREACH',
};
