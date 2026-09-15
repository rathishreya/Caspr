import {
  CHANNEL_LABEL,
  CHANNEL_PUBLISH_MODE,
  REFERENCE_WEEK_START,
  buildWeek,
  estimateLabel,
  estimateReviewMinutes,
  isUnreviewed,
  milestonesForWeek,
  narrative,
  platformWeek,
  postText,
  reviewHealth,
  willPublish,
  type ContentItem,
  type PostVersion,
  type ReviewDecisionRecord,
} from '@caspr-portal/domain';
import type { Metadata, Route } from 'next';
import Link from 'next/link';

import { Icon } from '@/components/icons';
import { FeedNotice } from '@/components/primitives/feed-notice';
import { State } from '@/components/primitives/state';
import { DecisionCard } from '@/components/posts/decision-card';
import { OpenOnHash } from '@/components/posts/open-on-hash';
import { PostArtefact } from '@/components/posts/post-artefact';
import { PostFacts, slotLabel } from '@/components/posts/post-facts';
import { PlatformWeekGrid } from '@/components/posts/platform-week-grid';
import { authorOf, CONTENT_SOCIAL_CHANNELS, isContentSocialChannel, PLATFORM_NAME } from '@/lib/platforms';
import { getRepository } from '@/lib/repository';
import { CHANNEL_WORKSTREAM } from '@/lib/workstream';

export const metadata: Metadata = { title: 'Content & Social — Tasks' };

interface PageProps {
  readonly searchParams: Promise<{ platform?: string; done?: string; did?: string }>;
}

/**
 * Content & Social ▸ Tasks — every post this week, by platform, and the decision on each.
 *
 * ⚠ **A deliberate departure from design spec §5A decision 2**, taken 2026-09-15 at the
 * workstream owner's request ("yaha seedha approval wali chiz honi h"). §5A made My Week the
 * single entry into review and said the workstream Tasks tabs "show items but do not start
 * the flow". This tab now takes a decision.
 *
 * What §5A was protecting, and how each is kept:
 *
 *  · *"Two entries mean two mental models of what reviewing is."* — There is one decision
 *    component and one server action. Approve, reject, hold; the ten codes in the fixed
 *    order, keyed `1`–`0`; the required note; no edit affordance. Review mode, when it is
 *    built, uses the same action — two doors, one room.
 *  · *"The '52 minutes left' estimate stops meaning anything."* — Every decision commits to
 *    the same queue. The estimate on this page, the badge on the tab and the Calendar's
 *    banner all read the same data, so a decision here moves all of them.
 *  · *Commit on action, no undo.* — Kept. A decided post is read-only here.
 *
 * What does not survive: the *uninterrupted* flow. A reviewer working this tab sees the
 * rail and the other posts. That is the trade the owner chose — context over a full-screen
 * takeover — and review mode remains the place for clearing a whole queue in one sitting.
 *
 * §2 still decides the surfaces: **only a post waiting on a decision is white.** Decided
 * posts open on the dark ground, because nothing about them needs a person now.
 */
export default async function ContentSocialTasks({ searchParams }: PageProps) {
  const params = await searchParams;
  const platform = isContentSocialChannel(params.platform) ? params.platform : null;

  const repository = getRepository();
  const start = REFERENCE_WEEK_START;
  const [all, versions, decisions] = await Promise.all([
    repository.itemsForWeek(start),
    repository.versionsForWeek(start),
    repository.decisionsForWeek(start),
  ]);

  const week = buildWeek(start, new Date());
  const workstream = all.filter((item) => CHANNEL_WORKSTREAM[item.channel] === 'content-social');
  const visible = platform === null ? workstream : workstream.filter((item) => item.channel === platform);

  const waiting = bySlot(visible.filter(isUnreviewed));
  const paused = bySlot(visible.filter((item) => item.status === 'holding' || item.status === 'rejected'));
  const decided = bySlot(visible.filter(willPublish));

  const queueSize = workstream.filter(isUnreviewed).length;
  const health = reviewHealth(decisions.filter((d) => workstream.some((item) => item.id === d.itemId)));
  const minutes = estimateReviewMinutes(queueSize, health.meanSeconds);
  const deadline = milestonesForWeek(week)[0];
  const monday = week.days[0];

  return (
    <div className="board">
      <OpenOnHash />

      <p className="board-status t-meta">
        <span>{week.label}</span>
        <span>{workstream.length} posts</span>
        <span className={queueSize > 0 ? 'text-attention' : undefined}>
          {queueSize === 0 ? 'nothing waiting' : `${queueSize} need${queueSize === 1 ? 's' : ''} a decision`}
        </span>
        {queueSize > 0 && <span>{minutes === null ? 'no estimate yet' : estimateLabel(minutes)}</span>}
        {deadline !== undefined && monday !== undefined && (
          <span>
            Review by {monday.weekdayLabel} {monday.dayOfMonth} · {deadline.time}
          </span>
        )}
      </p>

      <section aria-labelledby="week-heading">
        <div className="board-head">
          <h2 id="week-heading" className="t-title-m">
            The week, by platform
          </h2>
          <span className="board-hint t-body-s">Every time opens its post.</span>
        </div>
        <PlatformWeekGrid week={week} rows={platformWeek(week, workstream, CONTENT_SOCIAL_CHANNELS)} />
      </section>

      <PlatformFilter active={platform} items={workstream} />

      <section id="decide" aria-labelledby="decide-heading">
        <div className="board-head">
          <h2 id="decide-heading" className="t-title-m">
            Needs your decision <span className="board-count t-meta">{waiting.length}</span>
          </h2>
          {waiting.length > 0 && (
            <span className="board-hint t-body-s">
              Click a post, then <kbd className="kbd">A</kbd> approve · <kbd className="kbd">R</kbd> reject ·{' '}
              <kbd className="kbd">H</kbd> hold
            </span>
          )}
        </div>

        <Confirmation done={params.done} did={params.did} items={workstream} decisions={decisions} />

        {waiting.length === 0 ? (
          <State
            kind="empty"
            headline={
              platform === null
                ? 'Every post this week has a decision.'
                : `No ${PLATFORM_NAME[platform]} post is waiting on a decision.`
            }
            consequence={
              platform === null
                ? 'Finished, not unassigned. The next queue opens Thursday at 06:00, with one notification.'
                : 'Correctly empty for this platform. Clear the filter to see the rest of the queue.'
            }
          />
        ) : (
          <div className="decide-list">
            {waiting.map((item) => {
              const version = versions.get(item.id);
              return (
                <DecisionCard key={item.id} itemId={item.id} title={item.title} platform={platform}>
                  <ContextStrip item={item} version={version} />
                  {version === undefined ? (
                    <MissingVersion />
                  ) : (
                    <div className="artefact">
                      <div className="artefact__post">
                        <PostArtefact item={item} version={version} />
                      </div>
                      <PostFacts item={item} version={version} />
                    </div>
                  )}
                </DecisionCard>
              );
            })}
          </div>
        )}
      </section>

      {paused.length > 0 && (
        <section aria-labelledby="paused-heading">
          <div className="board-head">
            <h2 id="paused-heading" className="t-title-m">
              Held and regenerating <span className="board-count t-meta">{paused.length}</span>
            </h2>
            <span className="board-hint t-body-s">Off the calendar until they come back with a decision.</span>
          </div>
          <PostRows items={paused} versions={versions} decisions={decisions} />
        </section>
      )}

      <section aria-labelledby="decided-heading">
        <div className="board-head">
          <h2 id="decided-heading" className="t-title-m">
            Approved and scheduled <span className="board-count t-meta">{decided.length}</span>
          </h2>
          <span className="board-hint t-body-s">Nothing to do. Open any post to read it as it will go out.</span>
        </div>

        {decided.length === 0 ? (
          <State
            kind="empty"
            headline={
              platform === null ? 'Nothing is approved yet.' : `Nothing on ${PLATFORM_NAME[platform]} is approved yet.`
            }
            consequence="Posts arrive here the moment they are approved. Unreviewed posts never publish."
          />
        ) : (
          CONTENT_SOCIAL_CHANNELS.map((channel) => {
            const group = decided.filter((item) => item.channel === channel);
            if (group.length === 0) return null;
            return (
              <div key={channel} className="platform-group">
                <h3 className="platform-group__head">
                  <span className="t-body-s">{PLATFORM_NAME[channel]}</span>
                  <span className="t-meta text-tertiary">{group.length}</span>
                  {CHANNEL_PUBLISH_MODE[channel] === 'human_only' && (
                    <span className="t-meta text-tertiary">· a person posts these, always</span>
                  )}
                </h3>
                <PostRows items={group} versions={versions} decisions={decisions} />
              </div>
            );
          })
        )}
      </section>

      <FeedNotice />
    </div>
  );
}

function bySlot(items: readonly ContentItem[]): ContentItem[] {
  return [...items].sort((a, b) => (a.scheduledFor ?? '').localeCompare(b.scheduledFor ?? ''));
}

const TYPE_LABEL: Readonly<Record<ContentItem['type'], string>> = {
  analysis: 'Published analysis',
  search_answer: 'Search answer',
  permission: 'Permission layer',
  derivative: 'Derivative',
  personal: 'Personal post',
  outreach: 'Reply',
};

/**
 * Design spec §5A.2 — "context: channel · type · voice lane · scheduled for". On the dark
 * ground, above the white artefact: the console describes the post; the post is the post.
 */
function ContextStrip({ item, version }: { readonly item: ContentItem; readonly version: PostVersion | undefined }) {
  const told = narrative(item.narrative);
  return (
    <div className="decide__context">
      <span className="decide__slot t-data-m">{slotLabel(item)}</span>
      <span className="t-meta-bold">{CHANNEL_LABEL[item.channel]}</span>
      <span className="t-meta">{TYPE_LABEL[item.type]}</span>
      <span className="t-meta">{item.voiceLane === null ? 'Company voice' : `${authorOf(item).name}'s lane`}</span>
      {told !== undefined && (
        <span className="t-meta">
          {told.id} {told.name}
        </span>
      )}
      <span className="t-meta">{item.funnelStage}</span>
      <span className="t-meta text-tertiary">{item.assignedReviewer ?? 'Unassigned'}</span>
      {version?.regeneratedAfter != null && (
        <span className="decide__regenerated t-body-s">
          <span className="t-meta-bold">Version {version.versionN}</span> — regenerated after{' '}
          <span className="t-meta-bold">{version.regeneratedAfter.code}</span>: “{version.regeneratedAfter.note}”
        </span>
      )}
    </div>
  );
}

function MissingVersion() {
  return (
    <State
      kind="degraded"
      headline="This slot has no words yet."
      consequence="The item exists but no version has been generated for it, so there is nothing to approve. It holds at the deadline and does not publish."
    />
  );
}

function PlatformFilter({ active, items }: { readonly active: string | null; readonly items: readonly ContentItem[] }) {
  const link = (channel: string | null) =>
    ({ pathname: '/content-social/tasks', query: channel === null ? {} : { platform: channel } }) as const;

  return (
    <nav className="pills" aria-label="Filter by platform">
      <Link className="pill" href={link(null)} aria-current={active === null ? 'true' : undefined}>
        All <span className="pill__count">{items.length}</span>
      </Link>
      {CONTENT_SOCIAL_CHANNELS.map((channel) => {
        const count = items.filter((item) => item.channel === channel).length;
        const waiting = items.filter((item) => item.channel === channel && isUnreviewed(item)).length;
        return (
          <Link
            key={channel}
            className="pill"
            href={link(channel)}
            aria-current={active === channel ? 'true' : undefined}
          >
            {PLATFORM_NAME[channel]} <span className="pill__count">{count}</span>
            {waiting > 0 && (
              <span className="pill__waiting" aria-label={`${waiting} waiting`}>
                {waiting}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}

const STATUS_LABEL: Partial<Record<ContentItem['status'], string>> = {
  approved: 'Approved',
  scheduled: 'Scheduled',
  published: 'Published',
  holding: 'Held',
  rejected: 'Regenerating',
};

function PostRows({
  items,
  versions,
  decisions,
}: {
  readonly items: readonly ContentItem[];
  readonly versions: ReadonlyMap<string, PostVersion>;
  readonly decisions: readonly ReviewDecisionRecord[];
}) {
  return (
    <div className="rows">
      {items.map((item) => {
        const version = versions.get(item.id);
        const lead = version === undefined ? '' : firstLine(version);
        const last = [...decisions].reverse().find((d) => d.itemId === item.id);
        return (
          <details key={item.id} className="row" id={`post-${item.id}`}>
            <summary className="row__summary">
              <span className="row__when t-data-m">{slotLabel(item)}</span>
              <span className="row__who t-body-s">{authorOf(item).name}</span>
              <span className="row__title t-body-s">{item.title}</span>
              <span className="row__lead t-body-s">{lead}</span>
              <span className="row__status t-meta">{STATUS_LABEL[item.status] ?? item.status}</span>
              <Icon name="chevron-down" size={16} className="row__chevron" />
            </summary>

            <div className="row__detail">
              <p className="row__decided t-body-s">
                {item.status === 'rejected'
                  ? `Rejected${last?.reasonCode ? ` — ${last.reasonCode}` : ''}. It regenerates with the note applied and returns to the queue. ⑩ the Writer is not built yet, so in this build it waits here.`
                  : item.status === 'holding'
                    ? 'Held for discussion. It stays off the calendar until someone decides it.'
                    : `${STATUS_LABEL[item.status] ?? 'Decided'}${last ? ` by ${last.reviewer}` : ''}.${
                        version?.regeneratedAfter != null
                          ? ` Version ${version.versionN}, regenerated after ${version.regeneratedAfter.code}.`
                          : ''
                      }`}
              </p>
              {version === undefined ? (
                <MissingVersion />
              ) : (
                <div className="artefact artefact--decided">
                  <div className="artefact__post">
                    <PostArtefact item={item} version={version} />
                  </div>
                  <PostFacts item={item} version={version} />
                </div>
              )}
            </div>
          </details>
        );
      })}
    </div>
  );
}

function firstLine(version: PostVersion): string {
  const { body } = version;
  if (body.kind === 'blog') return body.headline;
  return postText(body).split('\n')[0] ?? '';
}

/**
 * The confirmation after a decision — the feedback §14.2 insists on without motion.
 *
 * "Approve and next-item are the same keystroke, so without it the screen looks like it
 * ignored you." Here the post leaves the queue and this line says where it went.
 */
function Confirmation({
  done,
  did,
  items,
  decisions,
}: {
  readonly done: string | undefined;
  readonly did: string | undefined;
  readonly items: readonly ContentItem[];
  readonly decisions: readonly ReviewDecisionRecord[];
}) {
  const item = items.find((candidate) => candidate.id === done);
  if (item === undefined || (did !== 'approve' && did !== 'reject' && did !== 'hold')) return null;

  const handPosted = CHANNEL_PUBLISH_MODE[item.channel] === 'human_only';
  const code = [...decisions].reverse().find((d) => d.itemId === item.id && d.action === 'reject')?.reasonCode;

  const verdict = did === 'approve' ? 'Approved' : did === 'reject' ? `Rejected${code ? ` — ${code}` : ''}` : 'Held';
  const next =
    did === 'approve'
      ? handPosted
        ? `Surfaced to ${authorOf(item).name} on ${slotLabel(item)} to post by hand.`
        : `Hygiene pass, then ${PLATFORM_NAME[item.channel]} at ${slotLabel(item)}.`
      : did === 'reject'
        ? 'It regenerates with your note applied and comes back to this queue.'
        : 'Off the calendar until someone decides it.';

  return (
    <p className="band" role="status">
      <span className="t-meta-bold">{verdict}</span>
      <span className="t-body-s">{item.title}</span>
      <span className="t-body-s text-secondary">{next}</span>
      <Link className="band__link t-label" href={`/calendar?week=${REFERENCE_WEEK_START}` as Route}>
        See the Calendar →
      </Link>
    </p>
  );
}
