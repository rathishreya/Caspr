import {
  CHANNEL_LABEL,
  CHANNEL_PUBLISH_MODE,
  PUBLISH_MODE_LABEL,
  PUBLISH_MODE_MEANING,
  REFERENCE_WEEK_START,
  dailyDeadline,
  dailyState,
  isUnreviewed,
  postText,
  type ContentItem,
  type PostVersion,
  type ReviewDecisionRecord,
} from '@caspr-portal/domain';
import type { Route } from 'next';
import Link from 'next/link';

import { Icon } from '@/components/icons';
import { State } from '@/components/primitives/state';
import { DecisionCard } from '@/components/posts/decision-card';
import { instantLabel, PostFailures, slotLabel } from '@/components/posts/post-facts';
import { CreativeBar, PostPreview } from '@/components/posts/post-preview';
import { authorOf, CONTENT_SOCIAL_CHANNELS, PLATFORM_NAME } from '@/lib/platforms';

/**
 * The pieces both queues are made of.
 *
 * ⚑ Extracted 2026-09-16, when the board split in two at the workstream owner's request:
 * *"daily & weekly stuff ko alag rakh, so that it is manageable for the team."* That split is
 * also Joy's — `activation-framework.md` §10, **one queue, two drains**: everything with 72
 * hours or more of shelf life is the weekly drain, and everything under it is the daily one.
 * Two screens, one set of components, so a decision cannot mean two different things
 * depending on which tab it was taken from.
 */

/**
 * The two queues, and only the two.
 *
 * Typed as a union rather than `string` so a filter link and a post-decision redirect are
 * checked against `typedRoutes` at build time. A third queue would have to be added here
 * before it could be linked to, which is the point.
 */
export type QueuePath = '/content-social/tasks' | '/content-social/today';

export function Waiting({
  item,
  version,
  platform,
  now,
  basePath,
}: {
  readonly item: ContentItem;
  readonly version: PostVersion | undefined;
  readonly platform: string | null;
  readonly now: Date;
  readonly basePath: QueuePath;
}) {
  return (
    <DecisionCard
      itemId={item.id}
      title={item.title}
      platform={platform}
      basePath={basePath}
      failures={version === undefined ? null : <PostFailures item={item} version={version} />}
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

export function bySlot(items: readonly ContentItem[]): ContentItem[] {
  return [...items].sort((a, b) => (a.scheduledFor ?? '9').localeCompare(b.scheduledFor ?? '9'));
}

/**
 * When, where, whose — and nothing else. Everything a reviewer might want to know *about*
 * the post stays off the post itself.
 */
export function ContextStrip({
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
      <span className="t-meta text-tertiary">
        {PUBLISH_MODE_LABEL[CHANNEL_PUBLISH_MODE[item.channel]]} — {PUBLISH_MODE_MEANING[CHANNEL_PUBLISH_MODE[item.channel]]}
      </span>
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

export function MissingVersion() {
  return (
    <State
      kind="degraded"
      headline="This slot has no words yet."
      consequence="The item exists but no version has been generated for it, so there is nothing to approve. It holds at the deadline and does not publish."
    />
  );
}

export function PlatformFilter({
  active,
  items,
  basePath,
}: {
  readonly active: string | null;
  readonly items: readonly ContentItem[];
  readonly basePath: QueuePath;
}) {
  const link = (channel: string | null): Route =>
    channel === null ? basePath : `${basePath}?platform=${channel}`;

  return (
    <nav className="pills" aria-label="Filter posts by platform">
      <Link className="pill" href={link(null)} aria-current={active === null ? 'true' : undefined}>
        All <span className="pill__count">{items.length}</span>
      </Link>
      {CONTENT_SOCIAL_CHANNELS.map((channel) => {
        const count = items.filter((item) => item.channel === channel).length;
        if (count === 0) return null;
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

export function PostRows({
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
        const revised = last?.action === 'revise';
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
              <span className="row__status t-meta">
                {revised ? 'Being changed' : (STATUS_LABEL[item.status] ?? item.status)}
              </span>
              <Icon name="chevron-down" size={16} className="row__chevron" />
            </summary>

            <div className="row__detail">
              <p className="row__decided t-body-s">
                {item.status === 'discarded'
                  ? `Written ${instantLabel(item.generatedAt)} and not approved by ${instantLabel(dailyDeadline(item))}, so it was discarded. It stays here as a record; it cannot be approved or published.`
                  : revised
                    ? `Change asked for by ${last?.reviewer ?? 'a reviewer'}: “${last?.note ?? ''}” — ⑩ the Writer is not built yet, so the instruction is recorded and the post waits here.`
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
                  <PostFailures item={item} version={version} />
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
export function Confirmation({
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
  if (item === undefined || !['approve', 'reject', 'hold', 'revise'].includes(did ?? '')) return null;

  const mode = CHANNEL_PUBLISH_MODE[item.channel];
  const code = [...decisions].reverse().find((d) => d.itemId === item.id && d.action === 'reject')?.reasonCode;
  const when = item.scheduledFor === null ? 'the next open window' : slotLabel(item);

  const verdict =
    did === 'approve' ? 'Approved' : did === 'reject' ? `Rejected${code ? ` — ${code}` : ''}` : did === 'revise' ? 'Change requested' : 'Held';
  const next =
    did === 'approve'
      ? mode === 'manual'
        ? `Surfaced to ${authorOf(item).name} on ${when} to post by hand.`
        : mode === 'release'
          ? `Hygiene pass, then a person releases it to ${PLATFORM_NAME[item.channel]} at ${when}.`
          : `Hygiene pass, then ${PLATFORM_NAME[item.channel]} at ${when}.`
      : did === 'reject'
        ? 'It regenerates with your note applied and comes back to this queue.'
        : did === 'revise'
          ? 'Your instruction is recorded. The post comes back as a new version for the same review.'
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
