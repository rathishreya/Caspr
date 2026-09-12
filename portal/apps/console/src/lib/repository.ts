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
  REFERENCE_WEEK,
  shiftWeek,
  type ContentItem,
  type ReviewDecisionRecord,
} from '@caspr-portal/domain';
import { and, eq, gte, inArray, lt } from 'drizzle-orm';

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

export interface ContentRepository {
  /** Items whose slot falls in the seven days from `weekStartDate`. */
  itemsForWeek(weekStartDate: string): Promise<readonly ContentItem[]>;
  /** Every decision taken on those items, including the ones that were superseded. */
  decisionsForWeek(weekStartDate: string): Promise<readonly ReviewDecisionRecord[]>;
  /** Narrative counts already spent in the three weeks before `weekStartDate`. */
  priorNarrativeCounts(weekStartDate: string): Promise<ReadonlyMap<string, number>>;
  /** Which adapter answered. Surfaced on screen rather than hidden — see `FeedNotice`. */
  readonly kind: 'postgres' | 'reference';
}

class ReferenceRepository implements ContentRepository {
  readonly kind = 'reference' as const;

  async itemsForWeek(weekStartDate: string): Promise<readonly ContentItem[]> {
    const end = shiftWeek(weekStartDate, 1);
    return REFERENCE_WEEK.filter((item) => {
      if (item.scheduledFor === null) return false;
      const date = item.scheduledFor.slice(0, 10);
      return date >= weekStartDate && date < end;
    });
  }

  async decisionsForWeek(weekStartDate: string): Promise<readonly ReviewDecisionRecord[]> {
    const ids = new Set((await this.itemsForWeek(weekStartDate)).map((item) => item.id));
    return REFERENCE_DECISIONS.filter((decision) => ids.has(decision.itemId));
  }

  async priorNarrativeCounts(): Promise<ReadonlyMap<string, number>> {
    return PRIOR_WINDOW_COUNTS;
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

    return rows;
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

let cached: ContentRepository | undefined;

export function getRepository(): ContentRepository {
  cached ??= isDatabaseConfigured() ? new PostgresRepository() : new ReferenceRepository();
  return cached;
}
