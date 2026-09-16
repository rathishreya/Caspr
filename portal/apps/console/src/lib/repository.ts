import {
  contentItems,
  contentVersions,
  engagementTargets,
  getDatabase,
  isDatabaseConfigured,
  reviewDecisions,
} from '@caspr-portal/db';
import {
  DAILY_WINDOW_HOURS,
  ILLUSTRATIVE_READINGS,
  PRIOR_WINDOW_COUNTS,
  REFERENCE_ADS,
  REFERENCE_APPROACHES,
  REFERENCE_SEO_TASKS,
  REFERENCE_DAILY_HISTORY,
  REFERENCE_DAILY_HISTORY_POSTS,
  REFERENCE_DAILY_POSTS,
  REFERENCE_DECISIONS,
  REFERENCE_ENGAGEMENT,
  REFERENCE_NOW,
  REFERENCE_POSTS,
  REFERENCE_WEEK,
  canAdvance,
  canMoveAd,
  isDecidable,
  shiftWeek,
  statusAfter,
  sweepDaily,
  type Ad,
  type AdState,
  type AmplifyTier,
  type Approach,
  type ApproachState,
  type SeoTask,
  type ContentItem,
  type DecisionInput,
  type EngagementPlatform,
  type EngagementTarget,
  type EngagementStatus,
  type PostVersion,
  type RejectCode,
  type ReviewDecisionRecord,
} from '@caspr-portal/domain';
import { and, desc, eq, gte, inArray, isNull, lt, ne, or } from 'drizzle-orm';

/**
 * Data access.
 *
 * Build spec §0 is explicit about how this build is sequenced: "Build against mocks for
 * everything BLOCKED and PARTIAL. The portal is a shell that renders, queues and records —
 * it can be built end to end before a single upstream feed exists. […] Everything else is
 * a mock behind a real interface."
 *
 * So there is one interface and two adapters. The Postgres adapter is the real one and it
 * is selected the moment `DATABASE_URL` is present; the in-memory adapter serves the
 * reference week. Neither is a special case inside a page — a screen asks the repository
 * and gets items.
 */

export type DecideResult =
  | { readonly ok: true; readonly item: ContentItem }
  | { readonly ok: false; readonly reason: 'not_found' | 'already_decided' | 'window_closed' };

export interface ContentRepository {
  /**
   * The time the data is true at.
   *
   * The reference week is a fixed Monday afternoon, and every clock on screen - the daily
   * track's 24 hours, "surfaced 2h ago" - has to run from that moment, or a fixture from
   * August reads as weeks stale. A database is live, so its clock is the real one.
   */
  clock(): Date;
  /**
   * Items in the seven days from `weekStartDate`: weekly items by their slot, and daily
   * items, which have no slot until approved, by when they were generated.
   */
  itemsForWeek(weekStartDate: string): Promise<readonly ContentItem[]>;
  /** The current version of each of those items, keyed by item id. */
  versionsForWeek(weekStartDate: string): Promise<ReadonlyMap<string, PostVersion>>;
  /** The current version of each named item, keyed by item id. */
  versionsFor(itemIds: readonly string[]): Promise<ReadonlyMap<string, PostVersion>>;
  /** One item and its current version, wherever it sits in time — what a rendered image needs. */
  post(itemId: string): Promise<{ readonly item: ContentItem; readonly version: PostVersion } | null>;
  /**
   * Daily posts whose 24-hour window closed without an approval, newest first.
   *
   * The history the Content & Social owner asked to keep (2026-09-15). Not scoped to a week:
   * a post generated on Sunday is discarded on Monday, and it belongs to both.
   */
  dailyHistory(limit?: number): Promise<readonly ContentItem[]>;
  /** Every decision taken on those items, including the ones that were superseded. */
  decisionsForWeek(weekStartDate: string): Promise<readonly ReviewDecisionRecord[]>;
  /** Narrative counts already spent in the three weeks before `weekStartDate`. */
  priorNarrativeCounts(weekStartDate: string): Promise<ReadonlyMap<string, number>>;
  /**
   * Commit a decision against an item's current version.
   *
   * One write, and it is final — design spec §5A decision 5, "commit on action, no batch
   * save, no undo". An item that has already been decided refuses a second decision rather
   * than overwriting the first. A daily post whose window has closed refuses too
   * (`window_closed`), even if the sweep has not written `discarded` yet.
   */
  decide(input: DecisionInput, reviewer: string): Promise<DecideResult>;
  /** Comments, reposts, tags and reshares surfaced in the week. Outside the review gate. */
  engagementsForWeek(weekStartDate: string): Promise<readonly EngagementTarget[]>;
  /** Record that a person acted on a target, chose not to, or sent it back as not theirs. */
  markEngagement(id: string, status: EngagementStatus): Promise<boolean>;

  /**
   * The discoverability target list, with whatever has happened to each row.
   *
   * Approaches are the only thing on this workstream a person moves by hand, and they are
   * what the presence kill condition reads — 3 inclusions after 25 approaches. So the count
   * has to be real state rather than a fixture, or the clock on the dashboard is a picture.
   */
  approaches(): Promise<readonly Approach[]>;
  /**
   * Move one approach along.
   *
   * Refuses a move the state machine does not allow, rather than overwriting. A declined
   * roundup that gets pitched again is a new row, not an edit: the denominator has to keep
   * its own history or the kill condition means nothing.
   */
  advanceApproach(id: string, to: ApproachState): Promise<boolean>;
  /** This week's SEO tasks — three a week, plus the site's standing debt. */
  seoTasks(): Promise<readonly SeoTask[]>;
  /** Tick one off. Idempotent: ticking a done task is not an error, it is a no-op. */
  completeSeoTask(id: string): Promise<boolean>;

  /** Every ad, drafted or running, with whatever it has done. */
  ads(): Promise<readonly Ad[]>;
  /**
   * Move one ad along its lifecycle.
   *
   * Refuses a move the lifecycle does not allow — and `killed` has no exits, so a failed
   * angle cannot quietly come back. Paid is a validation instrument; re-running a message
   * that already lost is the one thing that would make it a worthless one.
   */
  moveAd(id: string, to: AdState): Promise<boolean>;

  /** Which adapter answered. Surfaced on screen rather than hidden — see `FeedNotice`. */
  readonly kind: 'postgres' | 'reference';
}

function inWeek(item: ContentItem, weekStartDate: string): boolean {
  const anchor = item.track === 'daily' && item.scheduledFor === null ? item.generatedAt : item.scheduledFor;
  if (anchor === null) return false;
  const date = anchor.slice(0, 10);
  return date >= weekStartDate && date < shiftWeek(weekStartDate, 1);
}

const ALL_REFERENCE_ITEMS: readonly ContentItem[] = [...REFERENCE_WEEK, ...REFERENCE_DAILY_HISTORY];

function surfacedInWeek(surfacedAt: string, weekStartDate: string): boolean {
  const date = surfacedAt.slice(0, 10);
  return date >= weekStartDate && date < shiftWeek(weekStartDate, 1);
}

/**
 * The reference adapter.
 *
 * Decisions are kept in memory, on top of the fixture, so approving a post moves it — off
 * the queue, onto the Calendar, into the dashboard's reject rate — exactly as it will with a
 * database. They last as long as the server process, and the footnote on every screen says
 * so. Nothing is written to disk: the fixture is the seed, and a demo that edited its own
 * seed would drift from the file everyone else reads.
 */
class ReferenceRepository implements ContentRepository {
  readonly kind = 'reference' as const;

  readonly #statuses = new Map<string, ContentItem['status']>();
  readonly #decisions: ReviewDecisionRecord[] = [];
  readonly #engagement = new Map<string, EngagementTarget['status']>();
  readonly #approaches = new Map<string, { readonly state: ApproachState; readonly on: string }>();
  readonly #tasksDone = new Set<string>();
  readonly #ads = new Map<string, AdState>();

  clock(): Date {
    return new Date(REFERENCE_NOW);
  }

  /** The fixture, the decisions taken on it, then the daily sweep — in that order. */
  #current(item: ContentItem): ContentItem {
    const status = this.#statuses.get(item.id);
    return sweepDaily(status === undefined ? item : { ...item, status }, this.clock());
  }

  async itemsForWeek(weekStartDate: string): Promise<readonly ContentItem[]> {
    return REFERENCE_WEEK.filter((item) => inWeek(item, weekStartDate)).map((item) => this.#current(item));
  }

  async versionsForWeek(weekStartDate: string): Promise<ReadonlyMap<string, PostVersion>> {
    return this.versionsFor((await this.itemsForWeek(weekStartDate)).map((item) => item.id));
  }

  async versionsFor(itemIds: readonly string[]): Promise<ReadonlyMap<string, PostVersion>> {
    const ids = new Set(itemIds);
    return new Map(
      [...REFERENCE_POSTS, ...REFERENCE_DAILY_POSTS, ...REFERENCE_DAILY_HISTORY_POSTS]
        .filter((v) => ids.has(v.itemId))
        .map((v) => [v.itemId, v]),
    );
  }

  async post(itemId: string) {
    const seed = ALL_REFERENCE_ITEMS.find((item) => item.id === itemId);
    const version = (await this.versionsFor([itemId])).get(itemId);
    return seed === undefined || version === undefined ? null : { item: this.#current(seed), version };
  }

  async dailyHistory(limit = 50): Promise<readonly ContentItem[]> {
    return ALL_REFERENCE_ITEMS.map((item) => this.#current(item))
      .filter((item) => item.track === 'daily' && item.status === 'discarded')
      .sort((a, b) => b.generatedAt.localeCompare(a.generatedAt))
      .slice(0, limit);
  }

  async decisionsForWeek(weekStartDate: string): Promise<readonly ReviewDecisionRecord[]> {
    const ids = new Set((await this.itemsForWeek(weekStartDate)).map((item) => item.id));
    return [...REFERENCE_DECISIONS, ...this.#decisions].filter((decision) => ids.has(decision.itemId));
  }

  async priorNarrativeCounts(): Promise<ReadonlyMap<string, number>> {
    return PRIOR_WINDOW_COUNTS;
  }

  async decide(input: DecisionInput, reviewer: string): Promise<DecideResult> {
    const seed = ALL_REFERENCE_ITEMS.find((item) => item.id === input.itemId);
    if (!seed) return { ok: false, reason: 'not_found' };

    const current = this.#current(seed);
    if (current.status === 'discarded') return { ok: false, reason: 'window_closed' };
    if (!isDecidable(current)) return { ok: false, reason: 'already_decided' };

    this.#statuses.set(seed.id, statusAfter(input.action));
    this.#decisions.push({
      itemId: seed.id,
      reviewer,
      action: input.action,
      reasonCode: input.reasonCode,
      // What the reviewer asked for. On `revise` it is the instruction the writer works from,
      // so the queue can show it back — "Change asked for by …" — rather than only the fact
      // that a change was asked for.
      ...(input.note === null ? {} : { note: input.note }),
      secondsSpent: input.secondsSpent,
    });

    return { ok: true, item: this.#current(seed) };
  }

  async engagementsForWeek(weekStartDate: string): Promise<readonly EngagementTarget[]> {
    return REFERENCE_ENGAGEMENT.filter((t) => surfacedInWeek(t.surfacedAt, weekStartDate)).map((t) => {
      const status = this.#engagement.get(t.id);
      return status === undefined ? t : { ...t, status };
    });
  }

  async markEngagement(id: string, status: EngagementStatus): Promise<boolean> {
    const target = REFERENCE_ENGAGEMENT.find((t) => t.id === id);
    if (!target || this.#engagement.has(id)) return false;
    this.#engagement.set(id, status);
    return true;
  }

  async approaches(): Promise<readonly Approach[]> {
    return REFERENCE_APPROACHES.map((row) => {
      const moved = this.#approaches.get(row.id);
      return moved === undefined ? row : { ...row, state: moved.state, approachedOn: moved.on };
    });
  }

  async advanceApproach(id: string, to: ApproachState): Promise<boolean> {
    const current = (await this.approaches()).find((row) => row.id === id);
    if (current === undefined || !canAdvance(current.state, to)) return false;
    this.#approaches.set(id, {
      state: to,
      // The date the approach went out is set once, on the move out of `identified`, and
      // carried forward. An inclusion three weeks later did not happen on the day it landed.
      on: current.approachedOn ?? this.clock().toISOString().slice(0, 10),
    });
    return true;
  }

  async seoTasks(): Promise<readonly SeoTask[]> {
    return REFERENCE_SEO_TASKS.map((task) =>
      this.#tasksDone.has(task.id) ? { ...task, done: true } : task,
    );
  }

  async completeSeoTask(id: string): Promise<boolean> {
    if (!REFERENCE_SEO_TASKS.some((task) => task.id === id)) return false;
    this.#tasksDone.add(id);
    return true;
  }

  async ads(): Promise<readonly Ad[]> {
    return REFERENCE_ADS.map((ad) => {
      const state = this.#ads.get(ad.id) ?? ad.state;
      // An ad only has numbers once it is live or past it. A draft showing a click-through
      // rate would be showing a reading of something that never ran.
      const reading = ILLUSTRATIVE_READINGS[ad.id];
      const metrics =
        reading !== undefined && (state === 'live' || state === 'paused' || state === 'killed') ? reading : null;
      return { ...ad, state, metrics };
    });
  }

  async moveAd(id: string, to: AdState): Promise<boolean> {
    const current = (await this.ads()).find((ad) => ad.id === id);
    if (current === undefined || !canMoveAd(current.state, to)) return false;
    this.#ads.set(id, to);
    return true;
  }
}

class PostgresRepository implements ContentRepository {
  readonly kind = 'postgres' as const;

  clock(): Date {
    return new Date();
  }

  async itemsForWeek(weekStartDate: string): Promise<readonly ContentItem[]> {
    const db = getDatabase();
    const from = new Date(`${weekStartDate}T00:00:00+05:30`);
    const to = new Date(`${shiftWeek(weekStartDate, 1)}T00:00:00+05:30`);

    const rows = await db
      .select()
      .from(contentItems)
      .where(
        or(
          and(gte(contentItems.scheduledFor, from), lt(contentItems.scheduledFor, to)),
          and(
            eq(contentItems.track, 'daily'),
            isNull(contentItems.scheduledFor),
            gte(contentItems.createdAt, from),
            lt(contentItems.createdAt, to),
          ),
        ),
      );

    const now = this.clock();
    return rows.map((row) => sweepDaily(toDomain(row), now));
  }

  async post(itemId: string) {
    const db = getDatabase();
    const [row] = await db.select().from(contentItems).where(eq(contentItems.id, itemId)).limit(1);
    if (!row) return null;
    const version = (await this.versionsFor([itemId])).get(itemId);
    return version === undefined ? null : { item: sweepDaily(toDomain(row), this.clock()), version };
  }

  async dailyHistory(limit = 50): Promise<readonly ContentItem[]> {
    const db = getDatabase();
    const closedBefore = new Date(this.clock().getTime() - DAILY_WINDOW_HOURS * 3_600_000);
    // Written `discarded` by the sweep, or past the window and not yet swept. Approved posts
    // are excluded by status, so the second arm cannot pull in anything that published.
    const rows = await db
      .select()
      .from(contentItems)
      .where(
        and(
          eq(contentItems.track, 'daily'),
          or(
            eq(contentItems.status, 'discarded'),
            and(
              lt(contentItems.createdAt, closedBefore),
              ne(contentItems.status, 'approved'),
              ne(contentItems.status, 'scheduled'),
              ne(contentItems.status, 'published'),
            ),
          ),
        ),
      )
      .orderBy(desc(contentItems.createdAt))
      .limit(limit);
    const now = this.clock();
    return rows.map((row) => sweepDaily(toDomain(row), now));
  }

  async engagementsForWeek(weekStartDate: string): Promise<readonly EngagementTarget[]> {
    const db = getDatabase();
    const from = new Date(`${weekStartDate}T00:00:00+05:30`);
    const to = new Date(`${shiftWeek(weekStartDate, 1)}T00:00:00+05:30`);
    const rows = await db
      .select()
      .from(engagementTargets)
      .where(and(gte(engagementTargets.surfacedAt, from), lt(engagementTargets.surfacedAt, to)));

    return rows.map((row) => ({
      id: row.id,
      kind: row.kind,
      surfacedAt: row.surfacedAt.toISOString(),
      post: {
        id: row.externalPostId,
        platform: row.platform as EngagementPlatform,
        author: row.postAuthor,
        authorDetail: row.postAuthorDetail,
        authorIsCompany: row.postAuthorIsCompany,
        text: row.postText,
        postedAt: row.postedAt.toISOString(),
      },
      accountTier: row.accountTier as AmplifyTier | null,
      teamPost: row.teamPost,
      whyRelevant: row.whyRelevant,
      factToBring: row.factToBring,
      ourSource: row.ourSource,
      assignedTo: row.assignedTo,
      about: row.about,
      illustrative: false,
      drafts: row.drafts,
      status: row.status,
    }));
  }

  async markEngagement(id: string, status: EngagementStatus): Promise<boolean> {
    const db = getDatabase();
    const updated = await db
      .update(engagementTargets)
      .set({ status, actedAt: new Date() })
      .where(and(eq(engagementTargets.id, id), eq(engagementTargets.status, 'open')))
      .returning({ id: engagementTargets.id });
    return updated.length > 0;
  }

  /*
   * ⚑ Discoverability has no tables yet, and this adapter says so rather than pretending.
   *
   * Build spec §0: the portal is a shell that renders, queues and records — build against
   * mocks for everything BLOCKED, and make the boundary visible. The target list came out of
   * a reading taken by hand on 2026-08-25; the schema for it lands with the DataForSEO
   * integration, which is itself gated on a credential rotation (§14 dependency 3).
   *
   * Returning the fixture here would be worse than returning nothing: a person on the
   * database adapter would move an approach, see it move, and lose it on the next deploy.
   */
  async approaches(): Promise<readonly Approach[]> {
    return [];
  }

  async advanceApproach(): Promise<boolean> {
    return false;
  }

  async seoTasks(): Promise<readonly SeoTask[]> {
    return [];
  }

  async completeSeoTask(): Promise<boolean> {
    return false;
  }

  /* Ads have no tables either, and for the same reason — see the note above. */
  async ads(): Promise<readonly Ad[]> {
    return [];
  }

  async moveAd(): Promise<boolean> {
    return false;
  }

  async versionsForWeek(weekStartDate: string): Promise<ReadonlyMap<string, PostVersion>> {
    return this.versionsFor((await this.itemsForWeek(weekStartDate)).map((item) => item.id));
  }

  async versionsFor(itemIds: readonly string[]): Promise<ReadonlyMap<string, PostVersion>> {
    if (itemIds.length === 0) return new Map();

    const db = getDatabase();
    const ids = [...itemIds];

    const versions = await db
      .select()
      .from(contentVersions)
      .where(inArray(contentVersions.itemId, ids))
      .orderBy(desc(contentVersions.versionN));

    // The rejection that produced a version sits on the version before it.
    const rejections = await db
      .select({
        itemId: contentVersions.itemId,
        versionN: contentVersions.versionN,
        reasonCode: reviewDecisions.reasonCode,
        note: reviewDecisions.note,
      })
      .from(reviewDecisions)
      .innerJoin(contentVersions, eq(reviewDecisions.versionId, contentVersions.id))
      .where(and(inArray(contentVersions.itemId, ids), eq(reviewDecisions.action, 'reject')));

    const rejectionOn = new Map(rejections.map((r) => [`${r.itemId}:${r.versionN}`, r]));
    const current = new Map<string, PostVersion>();

    for (const row of versions) {
      if (current.has(row.itemId)) continue; // ordered newest first; the first seen is current
      const previous = rejectionOn.get(`${row.itemId}:${row.versionN - 1}`);
      current.set(row.itemId, {
        itemId: row.itemId,
        versionN: row.versionN,
        modelTier: /haiku/i.test(row.modelUsed) ? 'haiku' : 'frontier',
        body: row.payload,
        researchBasis: row.researchBasis,
        creative: row.creative,
        regeneratedAfter:
          previous?.reasonCode != null
            ? { code: previous.reasonCode as RejectCode, note: previous.note ?? '' }
            : null,
      });
    }

    return current;
  }

  async decisionsForWeek(weekStartDate: string): Promise<readonly ReviewDecisionRecord[]> {
    const items = await this.itemsForWeek(weekStartDate);
    if (items.length === 0) return [];

    const db = getDatabase();
    const rows = await db
      .select({
        itemId: contentVersions.itemId,
        reviewer: reviewDecisions.reviewer,
        action: reviewDecisions.action,
        reasonCode: reviewDecisions.reasonCode,
        note: reviewDecisions.note,
        secondsSpent: reviewDecisions.secondsSpent,
      })
      .from(reviewDecisions)
      .innerJoin(contentVersions, eq(reviewDecisions.versionId, contentVersions.id))
      .where(
        inArray(
          contentVersions.itemId,
          items.map((item) => item.id),
        ),
      );

    // The column is nullable and the field is optional — the same absence, spelled two ways.
    // Mapping it here keeps `note === undefined` the only thing the console has to test.
    return rows.map(({ note, ...rest }) => (note === null ? rest : { ...rest, note }));
  }

  async priorNarrativeCounts(weekStartDate: string): Promise<ReadonlyMap<string, number>> {
    const db = getDatabase();
    // N4 is capped at one per four weeks, so the window is the three weeks behind this one.
    const from = new Date(`${shiftWeek(weekStartDate, -3)}T00:00:00+05:30`);
    const to = new Date(`${weekStartDate}T00:00:00+05:30`);

    const rows = await db
      .select({ narrative: contentItems.narrative })
      .from(contentItems)
      .where(and(gte(contentItems.scheduledFor, from), lt(contentItems.scheduledFor, to)));

    const counts = new Map<string, number>();
    for (const row of rows) counts.set(row.narrative, (counts.get(row.narrative) ?? 0) + 1);
    return counts;
  }

  async decide(input: DecisionInput, reviewer: string): Promise<DecideResult> {
    const db = getDatabase();

    return db.transaction(async (tx) => {
      // Lock the item row: two reviewers pressing approve on the same post at the same
      // moment must produce one decision and one refusal, not two decisions.
      const [row] = await tx
        .select()
        .from(contentItems)
        .where(eq(contentItems.id, input.itemId))
        .for('update');
      if (!row) return { ok: false, reason: 'not_found' } as const;

      const swept = sweepDaily(toDomain(row), this.clock());
      if (swept.status === 'discarded') {
        // Write what every read already shows, so the sweep and the refusal agree.
        if (row.status !== 'discarded') {
          await tx
            .update(contentItems)
            .set({ status: 'discarded', updatedAt: new Date() })
            .where(eq(contentItems.id, input.itemId));
        }
        return { ok: false, reason: 'window_closed' } as const;
      }
      if (!isDecidable(swept)) return { ok: false, reason: 'already_decided' } as const;

      const [version] = await tx
        .select({ id: contentVersions.id })
        .from(contentVersions)
        .where(eq(contentVersions.itemId, input.itemId))
        .orderBy(desc(contentVersions.versionN))
        .limit(1);
      if (!version) return { ok: false, reason: 'not_found' } as const;

      await tx.insert(reviewDecisions).values({
        versionId: version.id,
        reviewer,
        action: input.action,
        reasonCode: input.reasonCode,
        note: input.note,
        secondsSpent: input.secondsSpent,
      });

      const [updated] = await tx
        .update(contentItems)
        .set({ status: statusAfter(input.action), updatedAt: new Date() })
        .where(eq(contentItems.id, input.itemId))
        .returning();

      return { ok: true, item: toDomain(updated ?? row) } as const;
    });
  }
}

type Row = typeof contentItems.$inferSelect;

function toDomain(row: Row): ContentItem {
  return {
    id: row.id,
    channel: row.channel,
    track: row.track,
    generatedAt: row.createdAt.toISOString(),
    type: row.type,
    title: row.title,
    voiceLane: row.voiceLane,
    narrative: row.narrative,
    pillar: row.pillar,
    funnelStage: row.funnelStage,
    icp: row.icp,
    status: row.status,
    assignedReviewer: row.assignedReviewer,
    scheduledFor: row.scheduledFor?.toISOString() ?? null,
    // Citations live on the version, not the item. The calendar does not need them, and
    // fetching them for twenty-three cards would be a join nobody reads.
    citations: [],
    sourceable: row.sourceable,
    hygieneAppliedAt: row.hygieneAppliedAt?.toISOString() ?? null,
    topicId: row.topicId,
  };
}

/**
 * One repository per server process.
 *
 * Kept on `globalThis` rather than in a module variable: in development, Next re-evaluates
 * modules on edit, and a module-level cache would silently discard every decision taken
 * against the reference adapter the moment a file was saved.
 */
const globalStore = globalThis as typeof globalThis & { __casprRepository?: ContentRepository };

export function getRepository(): ContentRepository {
  globalStore.__casprRepository ??= isDatabaseConfigured()
    ? new PostgresRepository()
    : new ReferenceRepository();
  return globalStore.__casprRepository;
}
