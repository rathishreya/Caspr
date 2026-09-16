import {
  CHANNEL_LABEL,
  CHANNEL_PUBLISH_MODE,
  PUBLISH_MODE_LABEL,
  PUBLISH_MODE_MEANING,
  REFERENCE_WEEK_START,
  buildWeek,
  dailyDeadline,
  dailyState,
  estimateLabel,
  estimateReviewMinutes,
  isInbound,
  isUnreviewed,
  milestonesForWeek,
  personName,
  platformWeek,
  postText,
  reviewHealth,
  surfacing,
  inboundResponse,
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
import { EngagementBoard } from '@/components/posts/engagement-board';
import { OpenOnHash } from '@/components/posts/open-on-hash';
import { instantLabel, PostChecks, slotLabel } from '@/components/posts/post-facts';
import { CreativeBar, PostPreview } from '@/components/posts/post-preview';
import { PlatformWeekGrid } from '@/components/posts/platform-week-grid';
import {
  authorOf,
  CONTENT_SOCIAL_CHANNELS,
  isContentSocialChannel,
  PLATFORM_NAME,
  PLATFORM_REGISTER,
} from '@/lib/platforms';
import { getRepository } from '@/lib/repository';
import { CHANNEL_WORKSTREAM } from '@/lib/workstream';

export const metadata: Metadata = { title: 'Content & Social — Tasks' };

interface PageProps {
  readonly searchParams: Promise<{ platform?: string; done?: string; did?: string }>;
}

/**
 * Content & Social ▸ Tasks — the week's work, split the way the engine splits it.
 *
 *   POSTS        what we write. Every one passes review before anything publishes.
 *                ├ today — the daily clock: no slot, 24 hours to approve, then discarded
 *                │         and kept in the history
 *                └ this week — the weekly clock: a slot on the calendar
 *   ENGAGEMENT   what we do on other people's posts, and what they do on ours.
 *                No review — "a person, on-platform, always" (operating model ㉖).
 *                ├ tagged and reshared — inbound
 *                ├ comment — outbound, with a fact to bring
 *                └ repost with a line — outbound, tier 1 only
 *
 * ⚠ **A deliberate departure from design spec §5A decision 2**, taken 2026-09-15 at the
 * workstream owner's request ("yaha seedha approval wali chiz honi h"). §5A made My Week the
 * single entry into review. This tab now takes a decision. What that rule protected is kept:
 * one decision component and one server action, the ten codes in fixed order, the required
 * note, no edit affordance, commit on action, and a single queue that the tab badge, the
 * estimate and the Calendar's banner all read. What is given up is the uninterrupted
 * full-screen flow, which review mode keeps.
 *
 * Posts are shown as the platform shows them (2026-09-15: "I want to see the exact post").
 * §2 survives in the platform's own terms — its light mode while a post waits on a decision,
 * its dark mode once it does not.
 */
export default async function ContentSocialTasks({ searchParams }: PageProps) {
  const params = await searchParams;
  const platform = isContentSocialChannel(params.platform) ? params.platform : null;

  const repository = getRepository();
  const now = repository.clock();
  const start = REFERENCE_WEEK_START;
  const [all, versions, decisions, engagement, discardedAll] = await Promise.all([
    repository.itemsForWeek(start),
    repository.versionsForWeek(start),
    repository.decisionsForWeek(start),
    repository.engagementsForWeek(start),
    repository.dailyHistory(),
  ]);
  const discarded = discardedAll.filter(
    (item) => CHANNEL_WORKSTREAM[item.channel] === 'content-social' && (platform === null || item.channel === platform),
  );
  const discardedVersions = await repository.versionsFor(discarded.map((item) => item.id));

  const week = buildWeek(start, now);
  const workstream = all.filter((item) => CHANNEL_WORKSTREAM[item.channel] === 'content-social');
  const visible = platform === null ? workstream : workstream.filter((item) => item.channel === platform);

  const waiting = visible.filter(isUnreviewed);
  const today = waiting
    .filter((item) => dailyState(item, now).kind === 'today')
    .sort((a, b) => a.generatedAt.localeCompare(b.generatedAt));
  // A daily post past its window is `discarded` by the time it is read, so it is never here.
  const thisWeek = bySlot(waiting.filter((item) => item.track === 'weekly'));
  const paused = bySlot(visible.filter((item) => item.status === 'holding' || item.status === 'rejected'));
  const decided = bySlot(visible.filter(willPublish));

  const queueSize = workstream.filter(isUnreviewed).length;
  const health = reviewHealth(decisions.filter((d) => workstream.some((item) => item.id === d.itemId)));
  const minutes = estimateReviewMinutes(queueSize, health.meanSeconds);
  const deadline = milestonesForWeek(week)[0];
  const monday = week.days[0];

  const openEngagement = engagement.filter(
    (t) => t.status === 'open' && (isInbound(t.kind) ? !['read_only', 'nothing'].includes(inboundResponse(t)) : surfacing(t).surfaced),
  ).length;

  const dailyCount = workstream.filter((item) => item.track === 'daily').length;
  const weeklyCount = workstream.length - dailyCount;

  const firstTeamPost = bySlot(workstream.filter((item) => item.voiceLane !== null && item.channel === 'linkedin'))[0];

  return (
    <div className="board">
      <OpenOnHash />

      <p className="board-status t-meta">
        <span>{week.label}</span>
        <span>
          {weeklyCount} this week · {dailyCount} today
        </span>
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

      <nav className="board-jump" aria-label="On this page">
        <a href="#posts" className="board-jump__link">
          <span className="t-title-m">Posts</span>
          <span className="t-body-s text-secondary">Reviewed before anything publishes</span>
          <span className={queueSize > 0 ? 't-meta text-attention' : 't-meta text-tertiary'}>{queueSize} waiting</span>
        </a>
        <a href="#engage" className="board-jump__link">
          <span className="t-title-m">Engagement</span>
          <span className="t-body-s text-secondary">No review — a person acts on the platform</span>
          <span className="t-meta text-tertiary">{openEngagement} to act on</span>
        </a>
      </nav>

      {/* ── POSTS ──────────────────────────────────────────────────────────── */}
      <section id="posts" className="board-part" aria-labelledby="posts-heading">
        <h2 id="posts-heading" className="board-part__title">
          Posts
        </h2>

        <section aria-labelledby="week-heading">
          <div className="board-head">
            <h3 id="week-heading" className="t-title-m">
              The week, by platform
            </h3>
            <span className="board-hint t-body-s">Every time opens its post.</span>
          </div>
          <PlatformWeekGrid week={week} rows={platformWeek(week, workstream, CONTENT_SOCIAL_CHANNELS)} />
          {dailyCount > 0 && (
            <p className="engage-note t-body-s">
              {dailyCount} daily {dailyCount === 1 ? 'post has' : 'posts have'} no slot. A daily post goes out at the
              next open window once approved, so it never takes a place on the calendar — and if it is not approved
              within 24 hours of being written, it is discarded.
            </p>
          )}
          <PlatformRegister />
        </section>

        <PlatformFilter active={platform} items={workstream} />

        <section id="decide" aria-labelledby="decide-heading">
          <div className="board-head">
            <h3 id="decide-heading" className="t-title-m">
              Needs your decision <span className="board-count t-meta">{waiting.length}</span>
            </h3>
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
              {today.length > 0 && (
                <h4 className="queue-group t-meta">
                  <span className="text-attention">⏱ Today</span> · the daily clock · {today.length}
                </h4>
              )}
              {today.map((item) => (
                <Waiting key={item.id} item={item} version={versions.get(item.id)} platform={platform} now={now} />
              ))}
              {today.length > 0 && thisWeek.length > 0 && (
                <h4 className="queue-group t-meta">This week · the weekly clock · {thisWeek.length}</h4>
              )}
              {thisWeek.map((item) => (
                <Waiting key={item.id} item={item} version={versions.get(item.id)} platform={platform} now={now} />
              ))}
            </div>
          )}
        </section>

        {paused.length > 0 && (
          <section aria-labelledby="paused-heading">
            <div className="board-head">
              <h3 id="paused-heading" className="t-title-m">
                Held and regenerating <span className="board-count t-meta">{paused.length}</span>
              </h3>
              <span className="board-hint t-body-s">Off the calendar until they come back with a decision.</span>
            </div>
            <PostRows items={paused} versions={versions} decisions={decisions} />
          </section>
        )}

        {discarded.length > 0 && (
          <section id="discarded" aria-labelledby="discarded-heading">
            <div className="board-head">
              <h3 id="discarded-heading" className="t-title-m">
                Discarded — not approved in 24 hours <span className="board-count t-meta">{discarded.length}</span>
              </h3>
              <span className="board-hint t-body-s">
                Daily posts only. Kept with their words, never published, never brought back.
              </span>
            </div>
            <PostRows items={discarded} versions={discardedVersions} decisions={decisions} />
          </section>
        )}

        <section aria-labelledby="decided-heading">
          <div className="board-head">
            <h3 id="decided-heading" className="t-title-m">
              Approved and scheduled <span className="board-count t-meta">{decided.length}</span>
            </h3>
            <span className="board-hint t-body-s">Nothing to do. Open any post to see it as it goes out.</span>
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
                  <h4 className="platform-group__head">
                    <span className="t-body-s">{PLATFORM_NAME[channel]}</span>
                    <span className="t-meta text-tertiary">{group.length}</span>
                    <span className="t-meta text-tertiary">
                      · {PUBLISH_MODE_LABEL[CHANNEL_PUBLISH_MODE[channel]].toLowerCase()} —{' '}
                      {PUBLISH_MODE_MEANING[CHANNEL_PUBLISH_MODE[channel]]}
                    </span>
                  </h4>
                  <PostRows items={group} versions={versions} decisions={decisions} />
                </div>
              );
            })
          )}
        </section>
      </section>

      {/* ── ENGAGEMENT ─────────────────────────────────────────────────────── */}
      <section id="engage" className="board-part" aria-labelledby="engage-heading">
        <h2 id="engage-heading" className="board-part__title">
          Engagement
        </h2>
        <p className="board-part__lede t-body-m">
          Nothing here goes through review, because nothing here is written by the engine. It finds the post and the
          one fact worth bringing; a person writes the words, on the platform, under their own name.
        </p>
        <EngagementBoard
          targets={engagement}
          now={now}
          firstTeamPost={
            firstTeamPost === undefined ? null : `${personName(firstTeamPost.voiceLane)}'s, ${slotLabel(firstTeamPost)}`
          }
        />
      </section>

      <FeedNotice />
    </div>
  );
}

function Waiting({
  item,
  version,
  platform,
  now,
}: {
  readonly item: ContentItem;
  readonly version: PostVersion | undefined;
  readonly platform: string | null;
  readonly now: Date;
}) {
  return (
    <DecisionCard
      itemId={item.id}
      title={item.title}
      platform={platform}
      checks={version === undefined ? null : <PostChecks item={item} version={version} />}
    >
      <ContextStrip item={item} version={version} now={now} />
      {version === undefined ? (
        <MissingVersion />
      ) : (
        <div className="decide__preview">
          <PostPreview item={item} version={version} mode="light" />
          <CreativeBar item={item} version={version} />
        </div>
      )}
    </DecisionCard>
  );
}

/**
 * Which platforms, and why — every one someone might expect, including the ones left out.
 * Folded: it answers a question once, and the board is for the week's work.
 */
function PlatformRegister() {
  const ON_LABEL = {
    posts: 'We post',
    posts_by_hand: 'A person posts',
    engagement: 'Replies only',
    not_a_channel: 'Not a channel',
  } as const;
  return (
    <details className="register">
      <summary className="register__summary t-body-s">
        Which platforms, and why — {PLATFORM_REGISTER.filter((p) => p.on !== 'not_a_channel').length} in use,{' '}
        {PLATFORM_REGISTER.filter((p) => p.on === 'not_a_channel').length} left out on purpose
        <Icon name="chevron-down" size={14} className="register__chevron" />
      </summary>
      <div className="table-scroll">
        <table className="register__table">
          <thead>
            <tr>
              <th className="t-meta" scope="col">
                Platform
              </th>
              <th className="t-meta" scope="col">
                How
              </th>
              <th className="t-meta" scope="col">
                Why it is here
              </th>
              <th className="t-meta" scope="col">
                Cadence
              </th>
            </tr>
          </thead>
          <tbody>
            {PLATFORM_REGISTER.map((platform) => (
              <tr key={platform.name} className={platform.on === 'not_a_channel' ? 'register__row--out' : undefined}>
                <th scope="row" className="t-body-s">
                  {platform.name}
                </th>
                <td className="t-meta">{ON_LABEL[platform.on]}</td>
                <td className="t-body-s">{platform.role}</td>
                <td className="t-body-s text-secondary">{platform.cadence}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="checks__source t-meta">operating model ㉛ · flowcharts/I-platforms.mmd</p>
    </details>
  );
}

function bySlot(items: readonly ContentItem[]): ContentItem[] {
  return [...items].sort((a, b) => (a.scheduledFor ?? '9').localeCompare(b.scheduledFor ?? '9'));
}

/**
 * When, where, whose — and nothing else. Everything a reviewer might want to know *about*
 * the post lives in the folded checks, not on top of the post.
 */
function ContextStrip({
  item,
  version,
  now,
}: {
  readonly item: ContentItem;
  readonly version: PostVersion | undefined;
  readonly now: Date;
}) {
  const clock = dailyState(item, now);
  return (
    <div className="decide__context">
      {clock.kind === 'today' ? (
        <span className="decide__today t-meta-bold">
          ⏱ Today · {clock.hoursLeft === 0 ? 'discarded within the hour' : `${clock.hoursLeft}h left to approve`}
        </span>
      ) : (
        <span className="decide__slot t-data-m">{slotLabel(item)}</span>
      )}
      <span className="t-meta-bold">{CHANNEL_LABEL[item.channel]}</span>
      <span className="t-meta">{item.voiceLane === null ? 'Company voice' : `${authorOf(item).name}'s post`}</span>
      {version?.respondsTo !== undefined && (
        <span className="decide__regenerated t-body-s">
          <span className="t-meta-bold">Responds to</span> {version.respondsTo.summary}
          {version.respondsTo.illustrative && <span className="text-tertiary"> (illustrative)</span>}
        </span>
      )}
      {version?.regeneratedAfter != null && (
        <span className="decide__regenerated t-body-s">
          <span className="t-meta-bold">Version {version.versionN}</span> — regenerated after{' '}
          <span className="t-meta-bold">{version.regeneratedAfter.code}</span>: &ldquo;{version.regeneratedAfter.note}&rdquo;
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
    <nav className="pills" aria-label="Filter posts by platform">
      <Link className="pill" href={link(null)} aria-current={active === null ? 'true' : undefined}>
        All <span className="pill__count">{items.length}</span>
      </Link>
      {CONTENT_SOCIAL_CHANNELS.map((channel) => {
        const count = items.filter((item) => item.channel === channel).length;
        const waiting = items.filter((item) => item.channel === channel && isUnreviewed(item)).length;
        return (
          <Link key={channel} className="pill" href={link(channel)} aria-current={active === channel ? 'true' : undefined}>
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
  discarded: 'Discarded',
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
              <span className="row__when t-data-m">
                {item.status === 'discarded'
                  ? instantLabel(dailyDeadline(item))
                  : item.scheduledFor === null
                    ? 'Next window'
                    : slotLabel(item)}
              </span>
              <span className="row__who t-body-s">{authorOf(item).name}</span>
              <span className="row__title t-body-s">{item.title}</span>
              <span className="row__lead t-body-s">{lead}</span>
              <span className="row__status t-meta">{STATUS_LABEL[item.status] ?? item.status}</span>
              <Icon name="chevron-down" size={16} className="row__chevron" />
            </summary>

            <div className="row__detail">
              <p className="row__decided t-body-s">
                {item.status === 'discarded'
                  ? `Written ${instantLabel(item.generatedAt)} and not approved by ${instantLabel(dailyDeadline(item))}, so it was discarded. It stays here as a record; it cannot be approved or published.`
                  : item.status === 'rejected'
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
                <>
                  <PostPreview item={item} version={version} mode="dark" />
                  <CreativeBar item={item} version={version} />
                  <PostChecks item={item} version={version} />
                </>
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

  const mode = CHANNEL_PUBLISH_MODE[item.channel];
  const code = [...decisions].reverse().find((d) => d.itemId === item.id && d.action === 'reject')?.reasonCode;
  const when = item.scheduledFor === null ? 'the next open window' : slotLabel(item);

  const verdict = did === 'approve' ? 'Approved' : did === 'reject' ? `Rejected${code ? ` — ${code}` : ''}` : 'Held';
  const next =
    did === 'approve'
      ? mode === 'manual'
        ? `Surfaced to ${authorOf(item).name} on ${when} to post by hand.`
        : mode === 'release'
          ? `Hygiene pass, then a person releases it to ${PLATFORM_NAME[item.channel]} at ${when}.`
          : `Hygiene pass, then ${PLATFORM_NAME[item.channel]} at ${when}.`
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

