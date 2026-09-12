/**
 * Portal schema — Drizzle over Postgres.
 *
 * Postgres rather than DynamoDB, decided at scaffold time and recorded in build spec §5:
 * "The model is a chain of one-to-manys — item → version → decision → publish → stale flag
 * — the dashboard is aggregate joins over exactly that chain, and volume is ~23 items a
 * week. DynamoDB would force denormalisation to buy scale we will never need."
 *
 * Entity shapes are build spec §4, extended per §4.1. Enum members are imported from
 * `@caspr-portal/domain` rather than retyped, so a value cannot exist in the database that
 * the application does not know about.
 */

import {
  CHANNELS,
  FUNNEL_STAGES,
  ICPS,
  ITEM_STATUSES,
  PILLARS,
  REJECT_CODES,
} from '@caspr-portal/domain';
import { relations } from 'drizzle-orm';
import {
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';

export const channelEnum = pgEnum('channel', CHANNELS);
export const itemStatusEnum = pgEnum('item_status', ITEM_STATUSES);
export const pillarEnum = pgEnum('pillar', PILLARS);
export const funnelStageEnum = pgEnum('funnel_stage', FUNNEL_STAGES);
export const icpEnum = pgEnum('icp', ICPS);
export const rejectCodeEnum = pgEnum('reject_code', REJECT_CODES);
export const itemTypeEnum = pgEnum('item_type', [
  'analysis',
  'search_answer',
  'permission',
  'derivative',
  'personal',
  'outreach',
]);
export const sourceableEnum = pgEnum('sourceable', ['found', 'thin', 'not_found']);
export const reviewActionEnum = pgEnum('review_action', ['approve', 'reject', 'hold']);

/**
 * `content_items`.
 *
 * The generation-brief columns (`writing_brief`, `proof_points`, `target_keyword`, …) sit
 * here rather than in a sibling table — build spec §4.1: "Extend `ContentItem` with those
 * fields rather than paralleling them. A second schema means two places to change when the
 * model moves, and they will diverge."
 */
export const contentItems = pgTable(
  'content_items',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    channel: channelEnum('channel').notNull(),
    type: itemTypeEnum('type').notNull(),
    title: text('title').notNull(),
    /** Null for company voice. Otherwise a roster lane id. */
    voiceLane: text('voice_lane'),
    narrative: text('narrative').notNull(),
    pillar: pillarEnum('pillar').notNull(),
    funnelStage: funnelStageEnum('funnel_stage').notNull(),
    icp: icpEnum('icp'),
    status: itemStatusEnum('status').notNull().default('generated'),
    assignedReviewer: text('assigned_reviewer'),
    scheduledFor: timestamp('scheduled_for', { withTimezone: true }),

    /** The `fact_lookup` probe verdict — build spec §3.2. `not_found` demotes at ranking. */
    sourceable: sourceableEnum('sourceable').notNull().default('thin'),
    /** Set by the hygiene stage between approval and publish — §3.6a. */
    hygieneAppliedAt: timestamp('hygiene_applied_at', { withTimezone: true }),

    /** The subject. One topic, one lane, one week — operating model ㉖. */
    topicId: text('topic_id').notNull(),

    // ── The generation brief, adopted from the existing card schema (§4.1) ──
    customerQuestion: text('customer_question'),
    targetKeyword: text('target_keyword'),
    writingBrief: text('writing_brief'),
    proofPoints: jsonb('proof_points').$type<string[]>().notNull().default([]),
    cta: text('cta'),
    wordCount: integer('word_count'),

    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    // The calendar reads one week at a time; this is the index it reads through.
    index('content_items_scheduled_for_idx').on(table.scheduledFor),
    index('content_items_status_idx').on(table.status),
    index('content_items_reviewer_idx').on(table.assignedReviewer),
    // Supports the one-subject-one-lane-one-week check without a table scan.
    index('content_items_topic_idx').on(table.topicId, table.scheduledFor),
  ],
);

/** Every generation of an item, kept — the rejection ledger needs the pair. §3.5. */
export const contentVersions = pgTable(
  'content_versions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    itemId: uuid('item_id')
      .notNull()
      .references(() => contentItems.id, { onDelete: 'cascade' }),
    versionN: integer('version_n').notNull(),
    body: text('body').notNull(),
    /** Origination is frontier, transformation is cheap — §3.2. Recorded, so the split is auditable. */
    modelUsed: text('model_used').notNull(),
    promptContextHash: text('prompt_context_hash').notNull(),
    /** Resolved citations. `L22` fetches; an unresolved one blocks the item. §3.3. */
    citations: jsonb('citations')
      .$type<
        { url: string; publisher: string; publishedOn: string; quotedClaim: string; resolvedAt: string | null }[]
      >()
      .notNull()
      .default([]),
    generatedAt: timestamp('generated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex('content_versions_item_version_uq').on(table.itemId, table.versionN)],
);

/**
 * `review_decisions`.
 *
 * `seconds_spent` is on the row because build spec §4 says why: "not surveillance — it is
 * how the generator sizes next week's volume to the real review budget", and design spec
 * §5A.3 makes it the only honest source for the minutes-remaining estimate.
 *
 * A reject carries a note of ≤200 characters, enforced here as well as in the form: §3.4
 * makes the note the input to both the regeneration prompt and the ledger, so an empty one
 * loses the compounding asset, not just a field.
 */
export const reviewDecisions = pgTable(
  'review_decisions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    versionId: uuid('version_id')
      .notNull()
      .references(() => contentVersions.id, { onDelete: 'cascade' }),
    reviewer: text('reviewer').notNull(),
    action: reviewActionEnum('action').notNull(),
    reasonCode: rejectCodeEnum('reason_code'),
    note: text('note'),
    secondsSpent: integer('seconds_spent').notNull(),
    decidedAt: timestamp('decided_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index('review_decisions_version_idx').on(table.versionId)],
);

/** Where an item actually went. `artefact_type` is here because hygiene branches on it (§3.6a). */
export const publishRecords = pgTable(
  'publish_records',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    itemId: uuid('item_id')
      .notNull()
      .references(() => contentItems.id, { onDelete: 'cascade' }),
    channel: channelEnum('channel').notNull(),
    /** ⛔ A generated PDF is never hygiene-passed — its AI-provenance mark is a legal requirement. */
    artefactType: text('artefact_type').notNull(),
    externalId: text('external_id'),
    url: text('url'),
    publishedAt: timestamp('published_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index('publish_records_item_idx').on(table.itemId)],
);

export const contentItemsRelations = relations(contentItems, ({ many }) => ({
  versions: many(contentVersions),
  publishRecords: many(publishRecords),
}));

export const contentVersionsRelations = relations(contentVersions, ({ one, many }) => ({
  item: one(contentItems, { fields: [contentVersions.itemId], references: [contentItems.id] }),
  decisions: many(reviewDecisions),
}));

export const reviewDecisionsRelations = relations(reviewDecisions, ({ one }) => ({
  version: one(contentVersions, {
    fields: [reviewDecisions.versionId],
    references: [contentVersions.id],
  }),
}));

export const publishRecordsRelations = relations(publishRecords, ({ one }) => ({
  item: one(contentItems, { fields: [publishRecords.itemId], references: [contentItems.id] }),
}));
