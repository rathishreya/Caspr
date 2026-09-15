import {
  contentItems,
  contentVersions,
  getDatabase,
  isDatabaseConfigured,
  reviewDecisions,
} from '@caspr-portal/db';
import {
  PRIOR_WINDOW_COUNTS,
  REFERENCE_DECISIONS,
  REFERENCE_POSTS,
  REFERENCE_WEEK,
  isDecidable,
  shiftWeek,
  statusAfter,
  type ContentItem,
  type DecisionInput,
  type PostVersion,
  type RejectCode,
  type ReviewDecisionRecord,
} from '@caspr-portal/domain';
import { and, desc, eq, gte, inArray, lt } from 'drizzle-orm';

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
  | { readonly ok: false; readonly reason: 'not_found' | 'already_decided' };

export interface ContentRepository {
  /** Items whose slot falls in the seven days from `weekStartDate`. */
  itemsForWeek(weekStartDate: string): Promise<readonly ContentItem[]>;
  /** The current version of each of those items, keyed by item id. */
  versionsForWeek(weekStartDate: string): Promise<ReadonlyMap<string, PostVersion>>;
  /** Every decision taken on those items, including the ones that were superseded. */
  decisionsForWeek(weekStartDate: string): Promise<readonly ReviewDecisionRecord[]>;
  /** Narrative counts already spent in the three weeks before `weekStartDate`. */
  priorNarrativeCounts(weekStartDate: string): Promise<ReadonlyMap<string, number>>;
  /**
   * Commit a decision against an item's current version.
   *
   * One write, and it is final — design spec §5A decision 5, "commit on action, no batch
   * save, no undo". An item that has already been decided refuses a second decision rather
   * than overwriting the first.
   */
  decide(input: DecisionInput, reviewer: string): Promise<DecideResult>;
  /** Which adapter answered. Surfaced on screen rather than hidden — see `FeedNotice`. */
  readonly kind: 'postgres' | 'reference';
}

function inWeek(item: ContentItem, weekStartDate: string): boolean {
  if (item.scheduledFor === null) return false;
  const date = item.scheduledFor.slice(0, 10);
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

  #current(item: ContentItem): ContentItem {
    const status = this.#statuses.get(item.id);
    return status === undefined ? item : { ...item, status };
  }

  async itemsForWeek(weekStartDate: string): Promise<readonly ContentItem[]> {
    return REFERENCE_WEEK.filter((item) => inWeek(item, weekStartDate)).map((item) => this.#current(item));
  }

  async versionsForWeek(weekStartDate: string): Promise<ReadonlyMap<string, PostVersion>> {
    const ids = new Set((await this.itemsForWeek(weekStartDate)).map((item) => item.id));
    return new Map(REFERENCE_POSTS.filter((v) => ids.has(v.itemId)).map((v) => [v.itemId, v]));
  }

  async decisionsForWeek(weekStartDate: string): Promise<readonly ReviewDecisionRecord[]> {
    const ids = new Set((await this.itemsForWeek(weekStartDate)).map((item) => item.id));
    return [...REFERENCE_DECISIONS, ...this.#decisions].filter((decision) => ids.has(decision.itemId));
  }

  async priorNarrativeCounts(): Promise<ReadonlyMap<string, number>> {
    return PRIOR_WINDOW_COUNTS;
  }

  async decide(input: DecisionInput, reviewer: string): Promise<DecideResult> {
    const seed = REFERENCE_WEEK.find((item) => item.id === input.itemId);
    if (!seed) return { ok: false, reason: 'not_found' };

    const current = this.#current(seed);
    if (!isDecidable(current)) return { ok: false, reason: 'already_decided' };

    this.#statuses.set(seed.id, statusAfter(input.action));
    this.#decisions.push({
      itemId: seed.id,
      reviewer,
      action: input.action,
      reasonCode: input.reasonCode,
      secondsSpent: input.secondsSpent,
    });

    return { ok: true, item: this.#current(seed) };
  }
}

class PostgresRepository implements ContentRepository {
  readonly kind = 'postgres' as const;

  async itemsForWeek(weekStartDate: string): Promise<readonly ContentItem[]> {
    const db = getDatabase();
    const from = new Date(`${weekStartDate}T00:00:00+05:30`);
    const to = new Date(`${shiftWeek(weekStartDate, 1)}T00:00:00+05:30`);

    const rows = await db
      .select()
      .from(contentItems)
      .where(and(gte(contentItems.scheduledFor, from), lt(contentItems.scheduledFor, to)));

    return rows.map(toDomain);
  }

  async versionsForWeek(weekStartDate: string): Promise<ReadonlyMap<string, PostVersion>> {
    const items = await this.itemsForWeek(weekStartDate);
    if (items.length === 0) return new Map();

    const db = getDatabase();
    const ids = items.map((item) => item.id);

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
    return db
      .select({
        itemId: contentVersions.itemId,
        reviewer: reviewDecisions.reviewer,
        action: reviewDecisions.action,
        reasonCode: reviewDecisions.reasonCode,
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
      if (!isDecidable(toDomain(row))) return { ok: false, reason: 'already_decided' } as const;

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
