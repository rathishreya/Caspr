/**
 * Review health.
 *
 * Two numbers the dashboard reads, and both have thresholds somebody argued about.
 *
 * `portal-build-spec.md` §3.5 sets the outer bounds: "above 20% the generator is
 * miscalibrated and gets fixed rather than the humans absorbing it. Below 2% reviewers are
 * rubber-stamping and the criteria need tightening." `portal-design-spec.md` §8 asks for a
 * health band on the chart, at 5–15%.
 *
 * The distinction matters and is kept: **inside the band is healthy, outside it is worth
 * noticing, and past the outer bound is a defect that gets acted on.** A single red line
 * at 20% would hide the middle case, which is the one that shows up first.
 */

import type { RejectCode } from './content-item';

export interface ReviewDecisionRecord {
  readonly itemId: string;
  readonly reviewer: string;
  readonly action: 'approve' | 'reject' | 'hold';
  readonly reasonCode: RejectCode | null;
  /** Measured, never assumed. Build spec §4. */
  readonly secondsSpent: number;
}

/** Health band on the reject rate — design spec §8. */
export const REJECT_RATE_BAND = { min: 0.05, max: 0.15 } as const;
/** Outer bounds at which it stops being calibration and becomes a defect — build spec §3.5. */
export const REJECT_RATE_BOUNDS = { rubberStamping: 0.02, miscalibrated: 0.2 } as const;

export type RejectRateVerdict = 'rubber_stamping' | 'below_band' | 'healthy' | 'above_band' | 'miscalibrated';

export interface ReviewHealth {
  readonly decisions: number;
  readonly rejections: number;
  readonly rejectRate: number;
  readonly verdict: RejectRateVerdict;
  /** True when the verdict warrants the accent colour. Nothing else turns red. */
  readonly attention: boolean;
  /** Total review time actually spent, in minutes. */
  readonly minutesSpent: number;
  /** Mean seconds per decision — the input to any honest remaining-time estimate. */
  readonly meanSeconds: number;
  readonly byReason: ReadonlyArray<{ readonly code: RejectCode; readonly count: number }>;
}

export function reviewHealth(decisions: readonly ReviewDecisionRecord[]): ReviewHealth {
  const total = decisions.length;
  const rejections = decisions.filter((d) => d.action === 'reject');
  const rate = total === 0 ? 0 : rejections.length / total;
  const seconds = decisions.reduce((sum, d) => sum + d.secondsSpent, 0);

  const counts = new Map<RejectCode, number>();
  for (const rejection of rejections) {
    if (rejection.reasonCode === null) continue;
    counts.set(rejection.reasonCode, (counts.get(rejection.reasonCode) ?? 0) + 1);
  }

  const verdict = verdictFor(total, rate);

  return {
    decisions: total,
    rejections: rejections.length,
    rejectRate: rate,
    verdict,
    attention: verdict === 'miscalibrated' || verdict === 'rubber_stamping',
    minutesSpent: Math.round(seconds / 60),
    meanSeconds: total === 0 ? 0 : Math.round(seconds / total),
    byReason: [...counts.entries()]
      .map(([code, count]) => ({ code, count }))
      .sort((a, b) => b.count - a.count || a.code.localeCompare(b.code)),
  };
}

function verdictFor(total: number, rate: number): RejectRateVerdict {
  // With no decisions there is nothing to calibrate; calling that "rubber-stamping" would
  // put the console into an attention state on its first Thursday morning.
  if (total === 0) return 'healthy';
  if (rate < REJECT_RATE_BOUNDS.rubberStamping) return 'rubber_stamping';
  if (rate < REJECT_RATE_BAND.min) return 'below_band';
  if (rate > REJECT_RATE_BOUNDS.miscalibrated) return 'miscalibrated';
  if (rate > REJECT_RATE_BAND.max) return 'above_band';
  return 'healthy';
}

export const REJECT_RATE_READING: Readonly<Record<RejectRateVerdict, string>> = {
  rubber_stamping: 'Below 2%. Reviewers are rubber-stamping and the criteria need tightening.',
  below_band: 'Under the 5–15% health band. Watch it rather than act on it.',
  healthy: 'Inside the 5–15% health band.',
  above_band: 'Over the 5–15% health band. Watch it rather than act on it.',
  miscalibrated: 'Above 20%. The generator is miscalibrated and gets fixed — the humans do not absorb it.',
};
