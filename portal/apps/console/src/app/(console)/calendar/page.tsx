import {
  CHANNEL_LABEL,
  REFERENCE_WEEK_START,
  buildCalendarWeek,
  laneCollisions,
  personName,
  shiftWeek,
  unreviewedBanner,
  type CalendarCard,
  type CalendarColumn,
} from '@caspr-portal/domain';
import type { Metadata } from 'next';
import Link from 'next/link';

import { Icon } from '@/components/icons';
import { FeedNotice } from '@/components/primitives/feed-notice';
import { State } from '@/components/primitives/state';
import { ScreenHeader } from '@/components/shell/screen-header';
import { getRepository } from '@/lib/repository';
import {
  WORKSTREAM_FILTERS,
  isWorkstreamFilter,
  matchesWorkstream,
  type WorkstreamFilter,
} from '@/lib/workstream';

export const metadata: Metadata = { title: 'Calendar' };

const WEEK_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

interface PageProps {
  readonly searchParams: Promise<{ week?: string; workstream?: string }>;
}

/**
 * Content Calendar — System ▸ Calendar. Figma `21:201`.
 *
 * Everything in the header is derived from the items on the grid (see
 * `buildCalendarWeek`). The banner is the strongest promise in the product — "nothing
 * publishes unreviewed" — and a hand-kept count that disagreed with the grid below it
 * would make that promise look like decoration.
 *
 * Week and filter live in the URL rather than in component state. A calendar someone is
 * asked about at 17:50 on a Monday is a calendar someone needs to be able to paste into
 * a message.
 */
export default async function CalendarPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const start = params.week && WEEK_PATTERN.test(params.week) ? params.week : REFERENCE_WEEK_START;
  const filter: WorkstreamFilter = isWorkstreamFilter(params.workstream) ? params.workstream : 'all';

  const repository = getRepository();
  const all = await repository.itemsForWeek(start);
  const items = all.filter((item) => matchesWorkstream(item.channel, filter));

  // `now` is resolved once, on the server, and threaded through — so "past" and "today"
  // are the same fact everywhere on the page.
  const now = new Date();
  const calendar = buildCalendarWeek(start, items, now);
  const banner = unreviewedBanner(calendar.counts);
  const collisions = laneCollisions(items);

  return (
    <>
      <ScreenHeader
        title="Calendar"
        meta={
          <>
            <WeekNav start={start} label={calendar.week.label} filter={filter} />
            <span className="t-meta">
              {calendar.counts.scheduled} SCHEDULED · {calendar.counts.holding} HOLDING
            </span>
          </>
        }
      />

      {banner !== null && (
        <div className="banner" role="alert">
          <span className="t-meta-bold banner__headline">{banner.headline}</span>
          <span className="t-body-s banner__detail">{banner.detail}</span>
        </div>
      )}

      {/*
        One subject, one person, one week (operating model ㉖). The engine is meant to
        refuse the second item at the work order rather than generate it and hope review
        catches it — so a collision reaching the calendar is a defect upstream, and the
        calendar's job is to say so rather than to render it quietly.
      */}
      {collisions.length > 0 && (
        <div style={{ marginBottom: 'var(--space-5)' }}>
          <State
            kind="degraded"
            headline={`${collisions.length} subject${collisions.length === 1 ? '' : 's'} carried by two lanes this week.`}
            consequence={collisions
              .map((c) => `${c.topicId}: ${c.lanes.map(personName).join(' and ')}`)
              .join(' · ')}
          />
        </div>
      )}

      <WorkstreamFilterRow start={start} active={filter} />

      {items.length === 0 ? (
        <State
          kind="empty"
          headline="No items in this workstream this week."
          consequence="Correctly empty rather than unfinished — the filter is narrowing a real week. Clear it to see the rest."
        />
      ) : (
        <div className="week-scroll">
          <div className="week-grid">
            {calendar.columns.map((column) => (
              <DayColumn
                key={column.day.date}
                column={column}
                /*
                 * Recede past days only while this is the week being worked. On a week
                 * navigated to, all seven days are behind you or none is — dimming every
                 * column tells the reader nothing and fades the whole screen.
                 */
                recedePast={calendar.week.containsToday}
              />
            ))}
          </div>
        </div>
      )}

      <div style={{ marginTop: 'var(--space-6)' }}>
        <FeedNotice />
      </div>
    </>
  );
}

function WeekNav({
  start,
  label,
  filter,
}: {
  readonly start: string;
  readonly label: string;
  readonly filter: WorkstreamFilter;
}) {
  const query = (week: string) => ({ week, ...(filter === 'all' ? {} : { workstream: filter }) });

  return (
    <span className="week-nav">
      <Link
        className="week-nav__button"
        href={{ pathname: '/calendar', query: query(shiftWeek(start, -1)) }}
        aria-label="Previous week"
      >
        <Icon name="chevron-left" size={16} />
      </Link>
      <span className="t-meta-bold" style={{ minWidth: '104px', textAlign: 'center' }}>
        {label}
      </span>
      <Link
        className="week-nav__button"
        href={{ pathname: '/calendar', query: query(shiftWeek(start, 1)) }}
        aria-label="Next week"
      >
        <Icon name="chevron-right" size={16} />
      </Link>
    </span>
  );
}

function WorkstreamFilterRow({
  start,
  active,
}: {
  readonly start: string;
  readonly active: WorkstreamFilter;
}) {
  return (
    <nav
      aria-label="Filter by workstream"
      style={{
        display: 'flex',
        gap: 'var(--space-4)',
        marginBottom: 'var(--space-5)',
        flexWrap: 'wrap',
      }}
    >
      {WORKSTREAM_FILTERS.map((option) => (
        <Link
          key={option.id}
          className="t-meta"
          href={{
            pathname: '/calendar',
            query: { week: start, ...(option.id === 'all' ? {} : { workstream: option.id }) },
          }}
          aria-current={option.id === active ? 'true' : undefined}
          style={{
            color: option.id === active ? 'var(--text-primary)' : 'var(--text-tertiary)',
            borderBottom:
              option.id === active ? '1px solid var(--text-primary)' : '1px solid transparent',
            paddingBottom: '2px',
          }}
        >
          {option.label}
        </Link>
      ))}
    </nav>
  );
}

function DayColumn({
  column,
  recedePast,
}: {
  readonly column: CalendarColumn;
  readonly recedePast: boolean;
}) {
  const { day } = column;
  const past = recedePast && day.isPast;
  return (
    <section className={past ? 'week-col week-col--past' : 'week-col'}>
      <h2 className={day.isToday ? 'week-col__head week-col__head--today' : 'week-col__head'}>
        <span className="t-meta-bold week-col__weekday">{day.weekdayLabel}</span>
        <span className="t-meta week-col__date">{day.dayOfMonth}</span>
      </h2>

      {column.milestones.map((milestone) => (
        <div key={milestone.id} className="milestone">
          <span className="t-meta milestone__time">{milestone.time}</span>
          <span className="t-body-s milestone__label">{milestone.label}</span>
        </div>
      ))}

      {column.cards.map((card) => (
        <ItemCard key={card.item.id} card={card} />
      ))}
    </section>
  );
}

function ItemCard({ card }: { readonly card: CalendarCard }) {
  const { item } = card;
  const author = item.voiceLane === null ? null : personName(item.voiceLane);

  return (
    <article
      className={card.holding ? 'card card--holding' : 'card'}
      // The reason is on the element rather than in a tooltip-only affordance: "held by a
      // reviewer" and "nobody has reached it" have the same consequence and different fixes.
      title={card.holdingReason ?? undefined}
    >
      <div className="card__head">
        <span className="t-data-m card__time">{card.time}</span>
        <span className="t-meta card__channel">{CHANNEL_LABEL[item.channel]}</span>
      </div>
      <div className="t-body-s card__title">{item.title}</div>
      {card.holding && (
        <span className="t-meta card__flag">
          HOLDING
          {/* Colour is never the only signal — the word is there for everyone. */}
          <span className="sr-only"> — {card.holdingReason}</span>
        </span>
      )}
      {author !== null && (
        <span className="sr-only">
          {' '}
          In {author}&rsquo;s voice lane.
        </span>
      )}
    </article>
  );
}
