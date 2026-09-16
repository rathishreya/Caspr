import {
  REFERENCE_WEEK_START,
  buildWeek,
  estimateLabel,
  estimateReviewMinutes,
  isUnreviewed,
  milestonesForWeek,
  platformWeek,
  reviewHealth,
  willPublish,
} from '@caspr-portal/domain';
import type { Metadata } from 'next';

import { Icon } from '@/components/icons';
import { FeedNotice } from '@/components/primitives/feed-notice';
import { State } from '@/components/primitives/state';
import { OpenOnHash } from '@/components/posts/open-on-hash';
import { PlatformWeekGrid } from '@/components/posts/platform-week-grid';
import { Confirmation, PlatformFilter, PostRows, Waiting, bySlot } from '@/components/posts/queue';
import { CONTENT_SOCIAL_CHANNELS, isContentSocialChannel, PLATFORM_NAME, PLATFORM_REGISTER } from '@/lib/platforms';
import { getRepository } from '@/lib/repository';
import { CHANNEL_WORKSTREAM } from '@/lib/workstream';

export const metadata: Metadata = { title: 'Content & Social — This week' };

const BASE = '/content-social/tasks';

interface PageProps {
  readonly searchParams: Promise<{ platform?: string; done?: string; did?: string }>;
}

/**
 * Content & Social ▸ This week — the weekly drain.
 *
 * ⚑ **Split from the single Tasks board on 2026-09-16**, at the workstream owner's request:
 * *"daily & weekly stuff ko alag rakh, so that it is manageable for the team."* The split is
 * Joy's own — `activation-framework.md` §10, **one queue, two drains**:
 *
 *   WEEKLY  72 hours of shelf life or more · generated Thursday, reviewed to Monday 18:00,
 *           published Tuesday–Sunday · the DM team carries it → **this screen**
 *   DAILY   under 72 hours · the morning queue and anything reactive · each person clears
 *           their own, in minutes → **Today**
 *
 * One queue underneath, still: both screens read the same repository, take decisions through
 * the same action, and feed the same badge. What is split is the attention, not the data.
 *
 * ⚠ **A deliberate departure from design spec §5A decision 2**, taken 2026-09-15: §5A made My
 * Week the single entry into review, and this tab takes a decision. What that rule protected
 * is kept — one decision component, one server action, the ten codes in fixed order, a
 * required note, commit on action.
 */
export default async function ThisWeek({ searchParams }: PageProps) {
  const params = await searchParams;
  const platform = isContentSocialChannel(params.platform) ? params.platform : null;

  const repository = getRepository();
  const now = repository.clock();
  const start = REFERENCE_WEEK_START;
  const [all, versions, decisions] = await Promise.all([
    repository.itemsForWeek(start),
    repository.versionsForWeek(start),
    repository.decisionsForWeek(start),
  ]);

  const week = buildWeek(start, now);
  const workstream = all.filter((item) => CHANNEL_WORKSTREAM[item.channel] === 'content-social');
  const weekly = workstream.filter((item) => item.track === 'weekly');
  const visible = platform === null ? weekly : weekly.filter((item) => item.channel === platform);

  const waiting = bySlot(visible.filter(isUnreviewed));
  const paused = bySlot(visible.filter((item) => item.status === 'holding' || item.status === 'rejected'));
  const decided = bySlot(visible.filter(willPublish));

  const queueSize = weekly.filter(isUnreviewed).length;
  const health = reviewHealth(decisions.filter((d) => weekly.some((item) => item.id === d.itemId)));
  const minutes = estimateReviewMinutes(queueSize, health.meanSeconds);
  const deadline = milestonesForWeek(week)[0];
  const monday = week.days[0];

  return (
    <div className="board">
      <OpenOnHash />

      <p className="board-status t-meta">
        <span>{week.label}</span>
        <span>{weekly.length} this week</span>
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

      <details className="reveal">
        <summary className="reveal__summary">
          <span className="t-title-m">The week, by platform</span>
          <span className="t-body-s text-secondary">
            {weekly.length} posts · every time opens its post
          </span>
          <Icon name="chevron-down" size={16} className="reveal__chevron" />
        </summary>
        <div className="reveal__body">
          <PlatformWeekGrid week={week} rows={platformWeek(week, weekly, CONTENT_SOCIAL_CHANNELS)} />
          <PlatformRegister />
        </div>
      </details>

      <PlatformFilter active={platform} items={weekly} basePath={BASE} />

      <section id="decide" aria-labelledby="decide-heading">
        <div className="board-head">
          {/*
            ⚑ The keyboard legend was removed 2026-09-16 on request. It is not lost: every key
            is printed on the button it fires, inside the decision control, where a person
            reads it at the moment they would use it rather than once at the top of a board.
          */}
          <h3 id="decide-heading" className="t-title-m">
            Needs your decision <span className="board-count t-meta">{waiting.length}</span>
          </h3>
        </div>

        <Confirmation done={params.done} did={params.did} items={weekly} decisions={decisions} />

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
            {waiting.map((item) => (
              <Waiting
                key={item.id}
                item={item}
                version={versions.get(item.id)}
                platform={platform}
                now={now}
                basePath={BASE}
              />
            ))}
          </div>
        )}
      </section>

      {paused.length > 0 && (
        <section aria-labelledby="paused-heading">
          <div className="board-head">
            <h3 id="paused-heading" className="t-title-m">
              Held and being changed <span className="board-count t-meta">{paused.length}</span>
            </h3>
            <span className="board-hint t-body-s">Off the calendar until they come back with a decision.</span>
          </div>
          <PostRows items={paused} versions={versions} decisions={decisions} />
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
                </h4>
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

/**
 * Which platforms, and why — every one someone might expect, including the ones left out.
 * Folded inside the week, because it answers a question once.
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
