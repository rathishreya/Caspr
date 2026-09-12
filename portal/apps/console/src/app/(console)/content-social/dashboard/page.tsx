import {
  CHANNEL_LABEL,
  CHANNEL_PUBLISH_MODE,
  REFERENCE_WEEK_START,
  REJECT_RATE_BAND,
  REJECT_RATE_READING,
  VOICE_LANES,
  buildWeek,
  isUnreviewed,
  narrativeMix,
  reviewHealth,
  willPublish,
  type Channel,
  type ContentItem,
  type NarrativeMixRow,
} from '@caspr-portal/domain';
import type { Metadata } from 'next';

import { FeedNotice } from '@/components/primitives/feed-notice';
import { State } from '@/components/primitives/state';
import { Bar, Tile } from '@/components/primitives/tile';
import { getRepository } from '@/lib/repository';
import { CHANNEL_WORKSTREAM } from '@/lib/workstream';

export const metadata: Metadata = { title: 'Content & Social — Dashboard' };

/**
 * Content & Social ▸ Dashboard. Figma `50:723`.
 *
 * A per-workstream dashboard, not a copy of the System one. §5: "Per-workstream dashboards
 * roll up into the System one; a specialist reading a single shared dashboard reads mostly
 * noise."
 *
 * So it answers four questions a social specialist actually has on a Thursday morning:
 * what is in the week, is the review calibrated, is the mix varied enough to survive the
 * fan-out, and is anyone's lane silent.
 */
export default async function ContentSocialDashboard() {
  const repository = getRepository();
  const start = REFERENCE_WEEK_START;

  const [all, decisions, priorCounts] = await Promise.all([
    repository.itemsForWeek(start),
    repository.decisionsForWeek(start),
    repository.priorNarrativeCounts(start),
  ]);

  const items = all.filter((item) => CHANNEL_WORKSTREAM[item.channel] === 'content-social');
  const week = buildWeek(start, new Date());
  const health = reviewHealth(decisions.filter((d) => items.some((i) => i.id === d.itemId)));
  const mix = narrativeMix(items, priorCounts);
  const awaiting = items.filter(isUnreviewed).length;

  return (
    <>
      <div className="tiles">
        <Tile label={`IN THE WEEK · ${week.label}`} value={String(items.length)} note="Items on this workstream's calendar." />
        <Tile
          label="WILL PUBLISH"
          value={String(items.filter(willPublish).length)}
          note="Decided, hygiene-passed, scheduled."
        />
        <Tile
          label="AWAITING A DECISION"
          value={String(awaiting)}
          attention={awaiting > 0}
          note={awaiting > 0 ? 'It holds at the deadline. It does not publish.' : 'The queue is clear.'}
        />
        <Tile
          label="REJECT RATE"
          value={`${Math.round(health.rejectRate * 100)}%`}
          attention={health.attention}
          note={REJECT_RATE_READING[health.verdict]}
        />
        <Tile
          label="REVIEW TIME SPENT"
          value={`${health.minutesSpent}m`}
          note={`${health.decisions} decisions, ${health.meanSeconds}s each on average. Measured, not assumed.`}
        />
      </div>

      {/*
        The two bar panels sit side by side; the two tables take the full measure.
        A table that has to scroll inside half a 1440 layout is not using the responsive
        spec's backstop, it is asking the reader to work around a layout choice.
      */}
      <div className="grid-2">
        <NarrativePanel mix={mix} />
        <RejectionPanel health={health} />
        <ChannelPanel items={items} />
        <LanePanel items={items} />
      </div>

      <div style={{ marginTop: 'var(--space-6)' }}>
        <FeedNotice />
      </div>
    </>
  );
}

function ChannelPanel({ items }: { readonly items: readonly ContentItem[] }) {
  const channels = [...new Set(items.map((item) => item.channel))].sort();

  return (
    <section className="panel panel--wide">
      <div className="panel__title">
        <h2 className="t-title-m">By channel</h2>
        <span className="t-meta text-tertiary">SCHEDULED · HOLDING · HOW IT GOES OUT</span>
      </div>

      <div className="table-scroll">
        <table className="table">
          <thead>
            <tr>
              <th className="t-meta">Channel</th>
              <th className="t-meta num">Sched</th>
              <th className="t-meta num">Hold</th>
              <th className="t-meta fill">Publishes</th>
            </tr>
          </thead>
          <tbody>
            {channels.map((channel) => {
              const forChannel = items.filter((item) => item.channel === channel);
              const holding = forChannel.filter((item) => !willPublish(item)).length;
              return (
                <tr key={channel}>
                  <td className="t-body-s">{CHANNEL_LABEL[channel]}</td>
                  <td className="t-body-s num">{forChannel.length - holding}</td>
                  <td className={holding > 0 ? 't-body-s num text-attention' : 't-body-s num'}>
                    {holding}
                  </td>
                  <td className="t-body-s text-secondary">{publishNote(channel)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/**
 * ⛔ Reddit, WSO, ESOMAR, PrepLounge and every forum are permanently out of scope for
 * automation — build spec §11 — because "automated posting here gets accounts banned and
 * burns the channel permanently". The column says so on the screen rather than leaving it
 * to somebody's memory of a document.
 */
function publishNote(channel: Channel): string {
  switch (CHANNEL_PUBLISH_MODE[channel]) {
    case 'automated':
      return 'Automatically, on schedule';
    case 'assisted':
      return 'Packed for a person to post';
    case 'human_only':
      return 'A person posts it. Never automated';
  }
}

function NarrativePanel({ mix }: { readonly mix: readonly NarrativeMixRow[] }) {
  const used = mix.filter((row) => row.count > 0);

  return (
    <section className="panel">
      <div className="panel__title">
        <h2 className="t-title-m">Narrative mix</h2>
        <span className="t-meta text-tertiary">AGAINST THE REGISTER&rsquo;S CAPS</span>
      </div>

      {used.length === 0 ? (
        <State
          kind="empty"
          headline="No items in this workstream this week."
          consequence="Nothing to vary yet. The mix appears once the week's work order runs."
        />
      ) : (
        <>
          {used.map((row) => (
            <div key={row.id} className="mix-row mix-row--reason">
              <span className="mix-row__id">
                <span className="t-meta">{row.id}</span>{' '}
                <span className="t-body-s">{row.name}</span>
              </span>
              <Bar fraction={row.share} over={row.overCap} label={row.name} />
              <span className={row.overCap ? 't-meta mix-row__value mix-row__value--over' : 't-meta mix-row__value'}>
                {Math.round(row.share * 100)}%
              </span>
            </div>
          ))}
          <p className="t-body-s text-secondary" style={{ marginTop: 'var(--space-3)' }}>
            A pillar says what claim. A narrative says how it is told — without it, twenty items on
            one pillar become twenty versions of one post. Two are capped: the journey at one per
            four weeks, the product at 15%.
          </p>
        </>
      )}
    </section>
  );
}

function RejectionPanel({ health }: { readonly health: ReturnType<typeof reviewHealth> }) {
  const max = Math.max(1, ...health.byReason.map((reason) => reason.count));

  return (
    <section className="panel">
      <div className="panel__title">
        <h2 className="t-title-m">Rejections by reason</h2>
        <span className="t-meta text-tertiary">
          HEALTH BAND {Math.round(REJECT_RATE_BAND.min * 100)}–{Math.round(REJECT_RATE_BAND.max * 100)}%
        </span>
      </div>

      {health.byReason.length === 0 ? (
        <State
          kind="empty"
          headline="Nothing was rejected this week."
          consequence="Below 2% sustained means the criteria need tightening, not that the generator got better. One clear week is not a signal."
        />
      ) : (
        <>
          {/*
            Direct-labelled, one series, no legend — §8. The label is the reason code
            itself because that is the identity; the bar carries only magnitude.
          */}
          {health.byReason.map((reason) => (
            <div key={reason.code} className="mix-row mix-row--reason">
              <span className="t-meta mix-row__id">{reason.code}</span>
              <Bar
                fraction={reason.count / max}
                /*
                 * §8: red is never a series colour. A bar turns red only when it flags a
                 * defect — and BANNED_TERM is exactly that: build spec §3.4 says it "also
                 * raises a linter defect, since this should have been caught upstream".
                 */
                over={reason.code === 'BANNED_TERM'}
                label={reason.code}
              />
              <span
                className={
                  reason.code === 'BANNED_TERM'
                    ? 't-meta mix-row__value mix-row__value--over'
                    : 't-meta mix-row__value'
                }
              >
                {reason.code === 'BANNED_TERM' ? `${reason.count} DEFECT` : reason.count}
              </span>
            </div>
          ))}
          <p className="t-body-s text-secondary" style={{ marginTop: 'var(--space-3)' }}>
            A BANNED_TERM rejection is also a linter defect — the machine should have caught it,
            and the reviewer did the machine&rsquo;s job.
          </p>
        </>
      )}
    </section>
  );
}

function LanePanel({ items }: { readonly items: readonly ContentItem[] }) {
  return (
    <section className="panel panel--wide">
      <div className="panel__title">
        <h2 className="t-title-m">Voice lanes</h2>
        <span className="t-meta text-tertiary">ONE SUBJECT · ONE PERSON · ONE WEEK</span>
      </div>

      <div className="table-scroll">
        <table className="table">
          <thead>
            <tr>
              <th className="t-meta nowrap">Person</th>
              <th className="t-meta">Cadence</th>
              <th className="t-meta num">This week</th>
              <th className="t-meta fill">Never</th>
            </tr>
          </thead>
          <tbody>
            {VOICE_LANES.map((lane) => {
              const count = items.filter((item) => item.voiceLane === lane.id).length;
              return (
                <tr key={lane.id}>
                  {/* The identity column. Rule 2: it never drops and never shrinks. */}
                  <td className="t-body-s nowrap">
                    {lane.person}
                    <span className="t-meta text-tertiary"> {lane.role}</span>
                  </td>
                  <td className="t-body-s text-secondary">
                    {lane.cadence === null ? 'Comments only' : lane.cadence}
                  </td>
                  <td className="t-body-s num">{count}</td>
                  <td className="t-body-s text-secondary">
                    {lane.never.length === 0 ? '—' : lane.never.join(' · ')}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="t-body-s text-secondary" style={{ marginTop: 'var(--space-4)' }}>
        An empty slot beats a lane violation. Where no lane covers a subject, the derivative is not
        generated at all.
      </p>
    </section>
  );
}
