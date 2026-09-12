/**
 * Portal design tokens — the canonical values.
 *
 * Source of truth: `docs/gtm/portal-design-spec.md` §3 (Drive). Every value below is
 * quoted from that table. `tokens.css` in this package is the CSS mirror; the two are
 * asserted equal by `tokens.test.ts`, so a value can never move in one and not the other.
 *
 * ⛔ Do not hardcode a hex, a spacing number or a radius anywhere else in the tree.
 *    Design spec §3: "Values are canonical; do not hardcode hex."
 */

/**
 * Portal / Colour.
 *
 * Two rules carry more meaning than the values do:
 *
 *  1. `surfaceCard` (white) means ONE thing — content under judgement (§2). Spending it
 *     on emphasis destroys the semantic that lets a reviewer read the screen without a
 *     legend.
 *  2. `accentAttention` is attention, never decoration and never a category (§1 rule 4).
 *     In the product app red means *citation*; here it means rejected, stale, over
 *     threshold, defect. Using it for both would confuse someone who uses both surfaces.
 */
export const colour = {
  surfaceBase: '#0C0B09',
  surfaceRaised: '#161512',
  surfaceHover: '#211F1C',
  surfaceCard: '#FFFFFF',
  surfaceCardSub: '#F6F5F3',
  borderDefault: '#2E2C28',
  borderStrong: '#403E39',
  borderCard: '#E2E1DE',
  textPrimary: '#F5F4F0',
  textSecondary: '#9C9A94',
  textTertiary: '#5C5A55',
  textOnCard: '#0A0A0A',
  textOnCardSub: '#5C5B58',
  accentAttention: '#E8453C',
  accentHover: '#F05048',
  accentWash: '#2A1512',
} as const;

/** Portal / Space — 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64. The product app's scale, unchanged. */
export const space = [4, 8, 12, 16, 24, 32, 48, 64] as const;

/** ⛔ No other radii exist. Design spec §3: `radius/none` = 0 · `radius/sm` = 2. */
export const radius = { none: 0, sm: 2 } as const;

/**
 * Type ramp — design spec §3.
 *
 * DM Mono is numbers, codes, timestamps and short uppercase labels. **Never prose.**
 * Inter never carries a metric that sits alone.
 * Instrument Serif appears exactly once, in the wordmark (§1 decision 2).
 */
export const type = {
  titleL: { family: 'inter', weight: 500, size: 20, lineHeight: 28 },
  titleM: { family: 'inter', weight: 500, size: 16, lineHeight: 24 },
  bodyM: { family: 'inter', weight: 400, size: 14, lineHeight: 20 },
  bodyS: { family: 'inter', weight: 400, size: 13, lineHeight: 18 },
  label: { family: 'inter', weight: 500, size: 12, lineHeight: 16 },
  meta: { family: 'mono', weight: 400, size: 11, lineHeight: 16, tracking: 0.04 },
  metaBold: { family: 'mono', weight: 500, size: 11, lineHeight: 16, tracking: 0.04 },
  dataM: { family: 'mono', weight: 500, size: 14, lineHeight: 20 },
  dataL: { family: 'mono', weight: 500, size: 28, lineHeight: 32 },
  wordmark: { family: 'serif', weight: 400, size: 20, lineHeight: 24 },
} as const;

/**
 * Layout — design spec §6 and `portal-responsive-spec.md` §3.
 *
 * The rail collapse is built first and deliberately: 220 → 64 frees 156px, which takes
 * the 900px work area from 600 to 756 and fixes four of the six tables that break there
 * (responsive spec §5). The horizontal-scroll container is a backstop, not the mechanism.
 */
export const layout = {
  railExpanded: 220,
  railCollapsed: 64,
  /** Below this the console does not render — it routes to the Personal Queue (§10). */
  consoleMinWidth: 900,
  /** Rail collapses to icons below this. */
  railCollapseWidth: 1180,
  workPaddingX: 40,
  workPaddingY: 28,
  /** Gutters absorb the loss before content does — responsive spec rule 4. */
  workPaddingXCompact: 20,
  /** ≥ 44px on mobile. A 34px button was caught and corrected on the Personal Queue (§6). */
  minTapTarget: 44,
} as const;

/**
 * Motion — design spec §14.2. Almost none, and one exception that is not in this build.
 *
 * The console is used for twenty concentrated minutes at a time; motion spends the
 * attention the review needs. The 120ms cross-fade exists only on review-mode advance,
 * and `prefers-reduced-motion` disables even that.
 */
export const motion = {
  none: '0ms',
  reviewAdvanceCrossFade: '120ms',
} as const;

export type Colour = keyof typeof colour;
export type TypeStyle = keyof typeof type;
