import type { PlatformSlot, PlatformWeekRow, WeekRange } from '@caspr-portal/domain';

function stateOf(slot: PlatformSlot): string {
  if (slot.needsDecision) return 'needs a decision';
  if (!slot.publishes) return 'will not go out — held or regenerating';
  return '';
}

import { PLATFORM_NAME } from '@/lib/platforms';

/**
 * The week, by platform — "kya post hai, kab jaani hai", at a glance.
 *
 * Every time chip is a link to the post itself. A chip for a post that will not go out —
 * undecided, held or regenerating — wears the attention colour; nothing else does, so the
 * posts that need a person read before the nineteen are counted (§1 decision 4 — red is
 * attention, never a category).
 */
export function PlatformWeekGrid({
  week,
  rows,
}: {
  readonly week: WeekRange;
  readonly rows: readonly PlatformWeekRow[];
}) {
  return (
    <div className="pw-scroll">
      <table className="pw">
        <caption className="sr-only">
          Posts this week by platform and day. Each time links to its post.
        </caption>
        <thead>
          <tr>
            <th scope="col" className="pw__corner t-meta">
              Platform
            </th>
            {week.days.map((day) => (
              <th key={day.date} scope="col" className="pw__day t-meta">
                {day.weekdayLabel} <span className="pw__date">{day.dayOfMonth}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.channel}>
              <th scope="row" className="pw__platform">
                <span className="t-body-s">{PLATFORM_NAME[row.channel]}</span>
                <span className="pw__count t-meta">{row.count}</span>
              </th>
              {row.days.map((slots, index) => (
                <td key={week.days[index]?.date ?? index} className="pw__cell">
                  {slots.length === 0 ? (
                    <span className="pw__none" aria-label="Nothing">
                      ·
                    </span>
                  ) : (
                    slots.map((slot) => (
                      <a
                        key={slot.itemId}
                        href={`#post-${slot.itemId}`}
                        className={slot.publishes ? 'chip' : 'chip chip--attention'}
                        title={`${slot.title}${stateOf(slot) === '' ? '' : ` — ${stateOf(slot)}`}`}
                      >
                        {slot.time}
                        {!slot.publishes && <span className="sr-only">, {stateOf(slot)}</span>}
                      </a>
                    ))
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
