import {
  CHANNEL_LABEL,
  CHANNEL_PUBLISH_MODE,
  REFERENCE_WEEK_START,
  isUnreviewed,
  personName,
  willPublish,
  zonedTime,
  zonedWeekday,
  type ContentItem,
} from '@caspr-portal/domain';
import type { Metadata } from 'next';
import Link from 'next/link';

import { FeedNotice } from '@/components/primitives/feed-notice';
import { State } from '@/components/primitives/state';
import { getRepository } from '@/lib/repository';
import { getSession } from '@/lib/session';
import { CHANNEL_WORKSTREAM } from '@/lib/workstream';

export const metadata: Metadata = { title: 'Content & Social — Tasks' };

/**
 * Content & Social ▸ Tasks. Figma `38:653`, absorbing the retired standalone Blog CMS.
 *
 * ⚠ The single most important thing about this screen is what it does **not** do.
 *
 * Design spec §5A decision 2: "One entry point: My Week. Workstream Tasks tabs show items
 * but do not start the flow — two entries mean two mental models of what 'reviewing' is.
 * The tabs link to My Week's start button."
 *
 * And §5 rule 2: review is a mode, not a node. "If review fragments into four workstream
 * inboxes, someone with items in three has to visit three places and the '52 minutes left'
 * estimate stops meaning anything."
 *
 * So every row here is scannable and none of them is a way in. There is one button, and it
 * goes to My Week.
 */
export default async function ContentSocialTasks() {
  const repository = getRepository();
  const session = getSession();

  const all = await repository.itemsForWeek(REFERENCE_WEEK_START);
  const items = all.filter((item) => CHANNEL_WORKSTREAM[item.channel] === 'content-social');

  const awaiting = items.filter(isUnreviewed);
  const byHand = items.filter((item) => CHANNEL_PUBLISH_MODE[item.channel] === 'human_only');
  const automated = items.filter(
    (item) => CHANNEL_PUBLISH_MODE[item.channel] !== 'human_only' && willPublish(item),
  );

  return (
    <>
      <section
        className="banner"
        style={
          awaiting.length === 0
            ? { background: 'var(--surface-raised)', borderColor: 'var(--border-default)' }
            : undefined
        }
      >
        <span className={awaiting.length === 0 ? 't-meta-bold text-secondary' : 't-meta-bold banner__headline'}>
          {awaiting.length === 0
            ? 'NOTHING AWAITING A DECISION IN THIS WORKSTREAM'
            : `${awaiting.length} AWAITING A DECISION`}
        </span>
        {/*
          The only route into review, and it is deliberately somewhere else. A second
          entry point would fragment the queue that the three-minute review depends on.
        */}
        <Link className="t-label" href="/not-built/my-week" style={{ color: 'var(--accent-attention)' }}>
          Review starts on My Week, across every workstream you own →
        </Link>
      </section>

      <div className="stack">
        <TaskTable
          title="Awaiting a decision"
          caption="Scannable here. Decided on My Week — this tab never starts the flow."
          items={awaiting}
          empty={
            <State
              kind="empty"
              headline="Every item in this workstream has a decision."
              consequence={`Finished, not unassigned. ${session.name} has nothing outstanding here.`}
            />
          }
        />

        <TaskTable
          title="Yours to do by hand"
          caption="Community threads and publisher pitches. The portal surfaces the thread and drafts the reply; a person posts it, always."
          items={byHand}
          empty={
            <State
              kind="empty"
              headline="No hand-posted work this week."
              consequence="Correctly empty. Community and outreach slots are generated only when a real thread or target exists."
            />
          }
        />

        <TaskTable
          title="Going out on its own"
          caption="Nothing to do. Listed so the week reads complete rather than looking thin."
          items={automated}
          empty={
            <State
              kind="empty"
              headline="Nothing is scheduled to publish automatically."
              consequence="Either the week has not been generated yet, or everything in it is hand-posted."
            />
          }
        />
      </div>

      <div style={{ marginTop: 'var(--space-6)' }}>
        <FeedNotice />
      </div>
    </>
  );
}

function TaskTable({
  title,
  caption,
  items,
  empty,
}: {
  readonly title: string;
  readonly caption: string;
  readonly items: readonly ContentItem[];
  readonly empty: React.ReactNode;
}) {
  return (
    <section className="panel">
      <div className="panel__title">
        <h2 className="t-title-m">{title}</h2>
        <span className="t-meta text-tertiary">{items.length}</span>
      </div>
      <p className="t-body-s text-secondary" style={{ marginBottom: 'var(--space-4)' }}>
        {caption}
      </p>

      {items.length === 0 ? (
        empty
      ) : (
        <div className="table-scroll">
          <table className="table">
            <thead>
              <tr>
                {/*
                  The day, then the time. Sixteen rows whose slots read 09:00, 11:00,
                  14:00, 08:00 are sorted correctly and look shuffled — the day is what
                  makes the sequence legible.
                */}
                <th className="t-meta">Day</th>
                <th className="t-meta">Slot</th>
                <th className="t-meta">Channel</th>
                <th className="t-meta fill">Item</th>
                <th className="t-meta">Voice</th>
                <th className="t-meta">Reviewer</th>
                <th className="t-meta">Sourced</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="t-meta text-secondary">
                    {item.scheduledFor ? zonedWeekday(item.scheduledFor) : '—'}
                  </td>
                  <td className="t-data-m">{item.scheduledFor ? zonedTime(item.scheduledFor) : '—'}</td>
                  <td className="t-meta text-secondary">{CHANNEL_LABEL[item.channel]}</td>
                  <td className="t-body-s">{item.title}</td>
                  <td className="t-body-s text-secondary">
                    {item.voiceLane === null ? 'Company' : personName(item.voiceLane)}
                  </td>
                  <td className="t-body-s text-secondary">{item.assignedReviewer ?? 'Unassigned'}</td>
                  <td className="t-body-s">
                    <SourceableTag item={item} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

/**
 * The `fact_lookup` verdict, shown rather than buried.
 *
 * Build spec §3.2: the probe "demotes a candidate regardless of its demand", because "a
 * high-volume question Caspr cannot source well produces a weak analysis, and a weak
 * analysis published under our own name costs more than the traffic is worth."
 *
 * `not_found` is not an error state. Design spec §11A calls "no credible published source
 * gives this number" "the most important state in the system […] It is the argument for
 * the product, and it ships."
 */
function SourceableTag({ item }: { readonly item: ContentItem }) {
  switch (item.sourceable) {
    case 'found':
      return <span className="t-meta text-secondary">FOUND</span>;
    case 'thin':
      return (
        <span className="tag t-meta" title="Sourceable, but thinly. It ranks lower, it is not blocked.">
          THIN
        </span>
      );
    case 'not_found':
      return (
        <span
          className="tag tag--attention t-meta"
          title="No credible published source gives this number. Not an error — it is the finding."
        >
          NO SOURCE
        </span>
      );
  }
}
