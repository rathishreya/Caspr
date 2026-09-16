/**
 * Performance — spend, and the gates that hold it shut.
 *
 * This workstream is **dormant by design**, and the console's job is to show why rather than
 * to show nothing. `activation-framework.md` §4 lists the paid engine as *"built, dormant"*,
 * and §4.1 gives four conditions that must **all** hold before it wakes.
 *
 * ⚑ **Two different things, and confusing them is the failure this file exists to prevent.**
 * §4.2 is explicit: *"the launch burst is not the paid engine."*
 *
 *   THE BURST   a one-time $1,500 campaign line, governed by the **week-4 gate**, safe
 *               without a reviewer because it runs on automatic kill rules
 *   THE ENGINE  ongoing acquisition, governed by **§4.1's four conditions**, and condition 2
 *               is a person in a seat
 *
 * ⚠ At the peak, condition 2 may still be unmet — the hire lands in 8–12 weeks. The burst
 * may run anyway. The engine may not.
 */

/** §4.1 — all four, not any. Each names the document that established it. */
export interface PaidCondition {
  readonly id: number;
  readonly condition: string;
  readonly establishedIn: string;
  readonly met: boolean;
  /** What is true today. Never a promise about when it changes. */
  readonly standing: string;
}

export const PAID_CONDITIONS: readonly PaidCondition[] = [
  {
    id: 1,
    condition: 'Net-new activation ≥ 25%',
    establishedIn: '.agents/gtm-strategy.md §2',
    met: false,
    standing:
      'Unmeasured. The old cohort’s activation was never measured at all, so there is no baseline to improve on — the net-new funnel is the first honest reading.',
  },
  {
    id: 2,
    condition: 'A reviewer is in the seat',
    establishedIn: 'operations-runbook.md §2A',
    met: false,
    standing: 'The hire lands in 8–12 weeks. Until then nobody diagnoses a paused campaign.',
  },
  {
    id: 3,
    condition: 'Real testimonials published',
    establishedIn: 'operations-runbook.md §7',
    met: false,
    standing:
      'Senior market-research professionals have agreed to written and video testimonials. None published, and the releases must cover self-posting and disclosure first.',
  },
  {
    id: 4,
    condition: '/samples holds three real reports',
    establishedIn: 'operations-runbook.md §7',
    met: false,
    standing: 'Paid traffic with nothing to look at converts nobody, and spends the first impression doing it.',
  },
];

export type PaidState = 'dormant' | 'ready';

export interface PaidEngineReading {
  readonly state: PaidState;
  readonly met: number;
  readonly total: number;
  readonly blocking: readonly PaidCondition[];
  readonly headline: string;
}

export function paidEngine(conditions: readonly PaidCondition[] = PAID_CONDITIONS): PaidEngineReading {
  const blocking = conditions.filter((condition) => !condition.met);
  const met = conditions.length - blocking.length;

  return {
    state: blocking.length === 0 ? 'ready' : 'dormant',
    met,
    total: conditions.length,
    blocking,
    headline:
      blocking.length === 0
        ? 'All four conditions hold. The engine can run.'
        : `${blocking.length} of ${conditions.length} conditions unmet. The engine stays dormant — all four, not any.`,
  };
}

/**
 * The launch burst — §4.2 and §0.5 decision 23.
 *
 * $1,500, one time, at the peak. The split is **conditional on a number**, not on a
 * judgement: Meta serves nothing to an audience under 1,000 people (§9.1), so spending there
 * before the audience exists would buy delivery we cannot get.
 */
export const LAUNCH_BURST_TOTAL = 1500;
export const META_SPLIT = 500;
export const META_AUDIENCE_MINIMUM = 1000;
export const META_DECISION_WEEK = 8;

export interface BurstSplit {
  readonly search: number;
  readonly meta: number;
  readonly why: string;
}

/**
 * Decision 23: *"$1,000 search · $500 Meta retargeting — **only if** Meta audiences reach
 * 1,000 by week 8. Otherwise all $1,500 stays on search."*
 *
 * `audienceSize` is the accumulated custom audience; audiences build from Day 1 at $0 (§9.6),
 * which is the whole reason this can be decided at week 8 rather than guessed at week 1.
 */
export function burstSplit(audienceSize: number, atWeek: number = META_DECISION_WEEK): BurstSplit {
  if (atWeek < META_DECISION_WEEK) {
    return {
      search: LAUNCH_BURST_TOTAL,
      meta: 0,
      why: `Not decided until week ${META_DECISION_WEEK}. Until then the audience is still accumulating, at $0.`,
    };
  }
  if (audienceSize >= META_AUDIENCE_MINIMUM) {
    return {
      search: LAUNCH_BURST_TOTAL - META_SPLIT,
      meta: META_SPLIT,
      why: `The audience reached ${audienceSize.toLocaleString('en-US')} by week ${META_DECISION_WEEK}. Meta will serve.`,
    };
  }
  return {
    search: LAUNCH_BURST_TOTAL,
    meta: 0,
    why: `The audience is ${audienceSize.toLocaleString('en-US')}, under the ${META_AUDIENCE_MINIMUM.toLocaleString('en-US')} Meta needs before it serves anything. All of it stays on search.`,
  };
}

/**
 * Kill rules, agreed in advance — `operations-runbook.md` §7.
 *
 * **Agreed in advance is the point.** A threshold set while a campaign is running is a
 * threshold set by whoever wants the campaign to keep running. These are what make the burst
 * safe without a reviewer in the seat.
 */
export interface KillRule {
  readonly trigger: string;
  readonly action: string;
  /** True where the portal pauses on its own rather than raising an alert for a person. */
  readonly automatic: boolean;
}

export const KILL_RULES: readonly KillRule[] = [
  { trigger: 'CAC above $300', action: 'Pause the campaign. Diagnose before resuming.', automatic: true },
  {
    trigger: 'Zero conversions after 100 clicks',
    action: 'Pause. The landing page or the targeting is wrong.',
    automatic: true,
  },
  {
    trigger: 'CTR below 1% on search after 500 impressions',
    action: 'Rewrite the ad. Do not raise the bid.',
    automatic: false,
  },
  { trigger: 'Spend pacing above plan', action: 'Automatic alert. The TL adjusts.', automatic: false },
];

export const CAC_CEILING = 300;

/** Meta is the recall layer, and it can only ever be retargeting — §9.1's four 2026 facts. */
export const META_REALITY: readonly { readonly what: string; readonly reality: string }[] = [
  { what: 'Cold targeting', reality: 'Job title, industry and company-size targeting removed in January 2026.' },
  { what: 'Custom audiences', reality: 'Need at least 1,000 people before Meta serves ads.' },
  { what: 'Uploaded lists', reality: 'B2B lists match only 20–40% — work emails are rarely a Facebook login.' },
  { what: 'Automated targeting', reality: 'Wants ~50 conversions a week to learn.' },
];

export interface MetaAudience {
  readonly name: string;
  readonly how: string;
  readonly size: number | null;
  readonly illustrative?: true;
}

/** §9.2 — the four audiences, accumulating from Day 1 at $0. */
export const META_AUDIENCES: readonly MetaAudience[] = [
  { name: 'Visitors to the marketing site', how: 'Meta’s tag, from Day 1', size: null },
  {
    name: 'The Record’s subscribers',
    how: 'The list, uploaded — likely a better match than sign-ups, since newsletters are often subscribed with a personal email (plausible; the match rate will tell)',
    size: null,
  },
  { name: 'People who watched our clips on Meta', how: 'Anyone who watches half', size: null },
  { name: 'Lookalikes of subscribers', how: 'Once 1,000 exist', size: null },
];

/**
 * §9.5 — three guardrails, and the first is enforced in the build rather than trusted.
 *
 * A tag that could pass a prompt, an analysis title or Data Room content would contradict
 * Pillar 5 — *your data is your data* — which is not a claim a marketing tag gets to weaken.
 */
export const META_GUARDRAILS: readonly { readonly rule: string; readonly detail: string; readonly enforced: boolean }[] = [
  {
    rule: 'The tag runs on the marketing site only',
    detail:
      'Never in the app, the open run, or any page where a prompt is typed. A tag that could pass a prompt, an analysis title or Data Room content would contradict Pillar 5 and gtm-api-contract.md §4.2.',
    enforced: true,
  },
  {
    rule: 'Consent first',
    detail:
      'The tag respects the cookie decision. Subscriber lists are uploaded only if the privacy notice covers ad matching.',
    enforced: false,
  },
  {
    rule: 'Measured as an assist',
    detail:
      '~20% of each audience is held back, and return visits, branded search and subscriber-to-sign-up rates are compared. On last-click, Meta always looks weak.',
    enforced: false,
  },
];

/** ⛔ §9.2. The one line that is never a setting. */
export const META_NEVER = 'Never interest or job-title targeting.';
