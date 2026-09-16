import {
  DAILY_WINDOW_HOURS,
  REFERENCE_WEEK_START,
  dailyState,
  inboundResponse,
  isInbound,
  isUnreviewed,
  personName,
  surfacing,
} from '@caspr-portal/domain';
import type { Metadata } from 'next';

import { FeedNotice } from '@/components/primitives/feed-notice';
import { State } from '@/components/primitives/state';
import { EngagementBoard } from '@/components/posts/engagement-board';
import { OpenOnHash } from '@/components/posts/open-on-hash';
import { slotLabel } from '@/components/posts/post-facts';
import { Confirmation, PlatformFilter, PostRows, Waiting, bySlot } from '@/components/posts/queue';
import { isContentSocialChannel } from '@/lib/platforms';
import { getRepository } from '@/lib/repository';
import { CHANNEL_WORKSTREAM } from '@/lib/workstream';

export const metadata: Metadata = { title: 'Content & Social — Today' };

const BASE = '/content-social/today';

interface PageProps {
  readonly searchParams: Promise<{ platform?: string; done?: string; did?: string }>;
}

/**
 * Content & Social ▸ Today — the daily drain.
 *
 * `activation-framework.md` §10: everything with **under 72 hours** of shelf life — the
 * morning queue and anything reactive — cleared by each person in a few minutes a day,
 * rather than waiting for Monday's deadline. Three things live here and nowhere else:
 *
 *   POSTS        the daily track. Written this morning, **24 hours to approve**, then
 *                discarded and kept in the history (`daily.ts`)
 *   ENGAGEMENT   the conversation engine's drafts — no review gate, a person on the
 *                platform, one tap (framework §6)
 *   DISCARDED    what the window closed on, with its words, so the rule can be judged
 *
 * Split from the weekly board 2026-09-16 at the workstream owner's request. The weekly
 * screen says so too, and each links to the other.
 */
export default async function Today({ searchParams }: PageProps) {
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

  const workstream = all.filter((item) => CHANNEL_WORKSTREAM[item.channel] === 'content-social');
  const daily = workstream.filter((item) => item.track === 'daily');
  const visible = platform === null ? daily : daily.filter((item) => item.channel === platform);

  const waiting = visible
    .filter((item) => isUnreviewed(item) && dailyState(item, now).kind === 'today')
    .sort((a, b) => a.generatedAt.localeCompare(b.generatedAt));
  const decided = bySlot(visible.filter((item) => !isUnreviewed(item) && item.status !== 'discarded'));

  const discarded = discardedAll.filter(
    (item) => CHANNEL_WORKSTREAM[item.channel] === 'content-social' && (platform === null || item.channel === platform),
  );
  const discardedVersions = await repository.versionsFor(discarded.map((item) => item.id));

  const openEngagement = engagement.filter(
    (t) =>
      t.status === 'open' &&
      (isInbound(t.kind) ? !['read_only', 'nothing'].includes(inboundResponse(t)) : surfacing(t).surfaced),
  ).length;

  const firstTeamPost = bySlot(
    workstream.filter((item) => item.voiceLane !== null && item.channel === 'linkedin'),
  )[0];

  const soonest = waiting
    .map((item) => dailyState(item, now))
    .reduce<number | null>((min, state) => (state.kind === 'today' ? Math.min(min ?? 99, state.hoursLeft) : min), null);

  return (
    <div className="board">
      <OpenOnHash />

      <p className="board-status t-meta">
        <span>Today</span>
        <span className={waiting.length > 0 ? 'text-attention' : undefined}>
          {waiting.length === 0 ? 'no post on the clock' : `${waiting.length} on the ${DAILY_WINDOW_HOURS}-hour clock`}
        </span>
        {soonest !== null && <span>{soonest === 0 ? 'one discards within the hour' : `soonest discards in ${soonest}h`}</span>}
        <span>{openEngagement} conversations to act on</span>
      </p>

      {/*
        The filter is a child of the board, never of a section: `.pills` carries a negative
        bottom margin tuned to the board's own gap, and nested one level deeper it pulls the
        first decision card up over the pills.
      */}
      {daily.length > 1 && <PlatformFilter active={platform} items={daily} basePath={BASE} />}

      {/* ── POSTS ──────────────────────────────────────────────────────────── */}
      <section id="decide" aria-labelledby="today-heading">
        <div className="board-head">
          <h3 id="today-heading" className="t-title-m">
            Written today <span className="board-count t-meta">{waiting.length}</span>
          </h3>
          <span className="board-hint t-body-s">
            No calendar slot — it goes out at the next open window once approved, and is discarded if nobody approves it
            within {DAILY_WINDOW_HOURS} hours. <kbd className="kbd">A</kbd> approve · <kbd className="kbd">R</kbd>{' '}
            reject · <kbd className="kbd">H</kbd> hold · <kbd className="kbd">E</kbd> change it.
          </span>
        </div>

        <Confirmation done={params.done} did={params.did} items={daily} decisions={decisions} />

        {waiting.length === 0 ? (
          <State
            kind="empty"
            headline="Nothing is on today's clock."
            consequence="Correctly empty. The daily track only generates when a conversation is worth answering the same day — silence here is the engine declining to invent one."
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

      {decided.length > 0 && (
        <section aria-labelledby="today-decided-heading">
          <div className="board-head">
            <h3 id="today-decided-heading" className="t-title-m">
              Decided today <span className="board-count t-meta">{decided.length}</span>
            </h3>
            <span className="board-hint t-body-s">Approved posts go out at the next open window.</span>
          </div>
          <PostRows items={decided} versions={versions} decisions={decisions} />
        </section>
      )}

      {/* ── ENGAGEMENT ─────────────────────────────────────────────────────── */}
      <section id="engage" className="board-part" aria-labelledby="engage-heading">
        <h2 id="engage-heading" className="board-part__title">
          Conversations
        </h2>
        <p className="board-part__lede t-body-m">
          Nothing here goes through review. The engine finds the post and the fact worth bringing and drafts two ways to
          say it; a person picks one, changes what they want, and posts it under their own name.
        </p>
        <EngagementBoard
          targets={engagement}
          now={now}
          firstTeamPost={
            firstTeamPost === undefined ? null : `${personName(firstTeamPost.voiceLane)}'s, ${slotLabel(firstTeamPost)}`
          }
        />
      </section>

      {/* ── HISTORY ────────────────────────────────────────────────────────── */}
      {discarded.length > 0 && (
        <section id="discarded" aria-labelledby="discarded-heading">
          <div className="board-head">
            <h3 id="discarded-heading" className="t-title-m">
              Discarded — not approved in {DAILY_WINDOW_HOURS} hours{' '}
              <span className="board-count t-meta">{discarded.length}</span>
            </h3>
            <span className="board-hint t-body-s">
              Kept with their words, never published, never brought back. The history is what shows whether the window is
              too short or the reviewers too few.
            </span>
          </div>
          <PostRows items={discarded} versions={discardedVersions} decisions={decisions} />
        </section>
      )}

      <FeedNotice />
    </div>
  );
}
