/**
 * Week arithmetic for the console.
 *
 * Every stored instant is an ISO 8601 string with an offset. Rendering happens in exactly
 * one zone, declared below, and nothing in this package ever reads the host's local time —
 * a console whose week boundary moves with the server it runs on is a console whose counts
 * cannot be trusted.
 */

/**
 * The console's clock.
 *
 * One zone, not two, and it is the team's rather than the market's. The operating model ㉘
 * makes the United States the primary market, but that decides *when the generator picks a
 * slot*, not what clock the operations console reads: the review deadline (runbook §1,
 * Mon 18:00), the queue-open notification and the Wednesday review are all team events. A
 * screen showing publish slots on one clock and deadlines on another is a screen that will
 * eventually be read wrong at 17:55 on a Monday.
 */
export const PORTAL_TIME_ZONE = 'Asia/Kolkata';

/** The operating week runs Monday to Sunday — runbook §1, and the Figma frame. */
const DAYS_IN_WEEK = 7;

export interface CalendarDay {
  /** `YYYY-MM-DD` in `PORTAL_TIME_ZONE`. Stable across hosts, so it is safe as a React key. */
  readonly date: string;
  /** `MON` … `SUN`. */
  readonly weekdayLabel: string;
  /** Day of month, unpadded — `18`. */
  readonly dayOfMonth: string;
  /** True when the day is wholly behind `now`. The Figma frame dims Monday for this reason. */
  readonly isPast: boolean;
  readonly isToday: boolean;
}

export interface WeekRange {
  /** Monday, `YYYY-MM-DD`. */
  readonly start: string;
  /** Sunday, `YYYY-MM-DD`. */
  readonly end: string;
  readonly days: readonly CalendarDay[];
  /** `18 – 24 AUG`, or `29 SEP – 5 OCT` when the week straddles a month. */
  readonly label: string;
  /**
   * True when `now` falls inside this week.
   *
   * It is what decides whether `isPast` should be *drawn*. Receding the days already
   * behind you is useful while you are working the current week; on a week you have
   * navigated to, every day is behind you or none is, and dimming all seven says nothing
   * while making the whole screen look faded. See the Calendar.
   */
  readonly containsToday: boolean;
}

const PARTS = new Intl.DateTimeFormat('en-GB', {
  timeZone: PORTAL_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  weekday: 'short',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

/**
 * Weekday from a `YYYY-MM-DD`, which `dateOnly` pins to midday UTC — so this formatter
 * reads UTC deliberately. Running it in the console's zone would re-apply an offset that
 * `zonedDate` has already applied.
 */
const WEEKDAY_SHORT = new Intl.DateTimeFormat('en-GB', { timeZone: 'UTC', weekday: 'short' });

/**
 * `en-US`, deliberately, and only here.
 *
 * `en-GB` abbreviates September as `Sept` — four characters where every other month is
 * three. In a fixed-width mono label that one month is visibly wider than the other
 * eleven, and the header stops lining up for a twelfth of the year. Everything else in
 * the console is `en-GB`.
 */
const MONTH_SHORT = new Intl.DateTimeFormat('en-US', {
  timeZone: 'UTC',
  month: 'short',
});

interface ZonedParts {
  year: number;
  month: number;
  day: number;
  weekday: string;
  hour: number;
  minute: number;
}

function zonedParts(instant: Date): ZonedParts {
  const found: Record<string, string> = {};
  for (const part of PARTS.formatToParts(instant)) {
    if (part.type !== 'literal') found[part.type] = part.value;
  }
  return {
    year: Number(found.year),
    month: Number(found.month),
    day: Number(found.day),
    weekday: (found.weekday ?? '').toUpperCase(),
    hour: Number(found.hour),
    minute: Number(found.minute),
  };
}

/** `YYYY-MM-DD` for an instant, in the console's zone. */
export function zonedDate(instant: Date | string): string {
  const parsed = typeof instant === 'string' ? new Date(instant) : instant;
  const { year, month, day } = zonedParts(parsed);
  return `${year}-${pad(month)}-${pad(day)}`;
}

/** `MON` … `SUN` for an instant, in the console's zone. */
export function zonedWeekday(instant: Date | string): string {
  return WEEKDAY_SHORT.format(dateOnly(zonedDate(instant))).toUpperCase();
}

/** `HH:MM`, 24-hour, in the console's zone. Rendered in DM Mono. */
export function zonedTime(instant: Date | string): string {
  const parsed = typeof instant === 'string' ? new Date(instant) : instant;
  const { hour, minute } = zonedParts(parsed);
  return `${pad(hour)}:${pad(minute)}`;
}

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

/** Midday UTC avoids every offset edge — the calendar only ever needs the date, not the instant. */
function dateOnly(iso: string): Date {
  return new Date(`${iso}T12:00:00Z`);
}

function addDays(iso: string, days: number): string {
  const shifted = new Date(dateOnly(iso).getTime() + days * 86_400_000);
  return shifted.toISOString().slice(0, 10);
}

const WEEKDAY_INDEX: Readonly<Record<string, number>> = {
  MON: 0,
  TUE: 1,
  WED: 2,
  THU: 3,
  FRI: 4,
  SAT: 5,
  SUN: 6,
};

/**
 * The Monday of the week containing `instant`, as `YYYY-MM-DD` in the console's zone.
 */
export function weekStart(instant: Date | string): string {
  const date = zonedDate(instant);
  const weekday = WEEKDAY_SHORT.format(dateOnly(date)).toUpperCase();
  return addDays(date, -(WEEKDAY_INDEX[weekday] ?? 0));
}

/**
 * Build the seven-column week that the calendar grid renders.
 *
 * `now` is passed rather than read so that the same week renders identically on the server
 * and in the browser — a `Date.now()` inside this function is a hydration mismatch waiting
 * for a page load that straddles midnight.
 */
export function buildWeek(startDate: string, now: Date): WeekRange {
  const today = zonedDate(now);
  const days: CalendarDay[] = [];

  for (let offset = 0; offset < DAYS_IN_WEEK; offset += 1) {
    const date = addDays(startDate, offset);
    days.push({
      date,
      weekdayLabel: WEEKDAY_SHORT.format(dateOnly(date)).toUpperCase(),
      dayOfMonth: String(Number(date.slice(8, 10))),
      isPast: date < today,
      isToday: date === today,
    });
  }

  const end = addDays(startDate, DAYS_IN_WEEK - 1);
  return {
    start: startDate,
    end,
    days,
    label: weekLabel(startDate, end),
    containsToday: days.some((day) => day.isToday),
  };
}

/**
 * `18 – 24 AUG` · `29 SEP – 5 OCT`.
 *
 * An en dash, not a tilde: design spec §5A.6 records that DM Mono's tilde sits at
 * mid-height and reads as a hyphen at 11px. That has been hit three times; it is a
 * standing rule, not an observation.
 */
export function weekLabel(startDate: string, endDate: string): string {
  const startMonth = MONTH_SHORT.format(dateOnly(startDate)).toUpperCase();
  const endMonth = MONTH_SHORT.format(dateOnly(endDate)).toUpperCase();
  const startDay = Number(startDate.slice(8, 10));
  const endDay = Number(endDate.slice(8, 10));

  return startMonth === endMonth
    ? `${startDay} – ${endDay} ${endMonth}`
    : `${startDay} ${startMonth} – ${endDay} ${endMonth}`;
}

/** Shift a week by whole weeks. Negative goes back. */
export function shiftWeek(startDate: string, weeks: number): string {
  return addDays(startDate, weeks * DAYS_IN_WEEK);
}

/**
 * Minutes rendered for a mono label.
 *
 * ⛔ Never prefix with `~`. Design spec §5A.6: `~16 MIN LEFT` renders as `-16 MIN LEFT`
 * in DM Mono at 11px. The written form is `EST 16 MIN LEFT`.
 */
export function estimateLabel(minutes: number): string {
  return `EST ${Math.max(0, Math.round(minutes))} MIN LEFT`;
}
