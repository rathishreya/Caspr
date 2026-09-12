import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import { colour, layout, radius, space } from './index';

const css = readFileSync(fileURLToPath(new URL('./tokens.css', import.meta.url)), 'utf8');

function cssVar(name: string): string {
  const match = new RegExp(`--${name}:\\s*([^;]+);`).exec(css);
  if (!match?.[1]) throw new Error(`--${name} is not declared in tokens.css`);
  return match[1].trim();
}

/**
 * The design spec's rule is "values are canonical; do not hardcode hex". Two copies of a
 * palette is the same failure mode as two copies of a document: they drift, and then
 * nothing is the answer. These tests are the mechanism that stops it.
 */
describe('tokens.css mirrors index.ts', () => {
  const pairs: ReadonlyArray<readonly [string, string]> = [
    ['surface-base', colour.surfaceBase],
    ['surface-raised', colour.surfaceRaised],
    ['surface-hover', colour.surfaceHover],
    ['surface-card', colour.surfaceCard],
    ['surface-card-sub', colour.surfaceCardSub],
    ['border-default', colour.borderDefault],
    ['border-strong', colour.borderStrong],
    ['border-card', colour.borderCard],
    ['text-primary', colour.textPrimary],
    ['text-secondary', colour.textSecondary],
    ['text-tertiary', colour.textTertiary],
    ['text-on-card', colour.textOnCard],
    ['text-on-card-sub', colour.textOnCardSub],
    ['accent-attention', colour.accentAttention],
    ['accent-hover', colour.accentHover],
    ['accent-wash', colour.accentWash],
  ];

  it.each(pairs)('--%s', (name, value) => {
    expect(cssVar(name).toLowerCase()).toBe(value.toLowerCase());
  });

  it('carries the full space scale, in order', () => {
    space.forEach((value, index) => {
      expect(cssVar(`space-${index + 1}`)).toBe(`${value}px`);
    });
  });

  it('declares exactly two radii', () => {
    expect(cssVar('radius-none')).toBe(`${radius.none}px`);
    expect(cssVar('radius-sm')).toBe(`${radius.sm}px`);
    const declared = css.match(/--radius-[a-z]+:/g) ?? [];
    expect(declared).toHaveLength(2);
  });

  it('carries the rail widths the responsive spec depends on', () => {
    expect(cssVar('rail-expanded')).toBe(`${layout.railExpanded}px`);
    expect(cssVar('rail-collapsed')).toBe(`${layout.railCollapsed}px`);
  });
});

describe('the rules the palette encodes', () => {
  /**
   * Responsive spec §5: collapsing 220 → 64 frees 156px, taking the 900px work area from
   * 600 to 756, which fixes four of the six tables that break there. If someone widens
   * the collapsed rail, the arithmetic that justified building it first stops holding.
   */
  it('the rail collapse frees the 156px the build order was decided on', () => {
    expect(layout.railExpanded - layout.railCollapsed).toBe(156);
  });

  it('the console floor and the rail-collapse threshold are distinct bands', () => {
    expect(layout.consoleMinWidth).toBeLessThan(layout.railCollapseWidth);
  });

  /** Design spec §6: ≥ 44px on mobile — a 34px button was caught and corrected once. */
  it('holds the minimum tap target at 44px', () => {
    expect(layout.minTapTarget).toBeGreaterThanOrEqual(44);
  });
});
