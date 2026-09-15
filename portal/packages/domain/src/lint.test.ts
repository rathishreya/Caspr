import { describe, expect, it } from 'vitest';

import { lintDeterministic } from './lint';

const rules = (text: string) => lintDeterministic(text).findings.map((f) => f.rule);

describe('L01 banned vocabulary — content-engine.md §4.1', () => {
  it.each([
    'Our platform does the rest.',
    'It leverages every source.',
    'Built on proprietary algorithms.',
    'Fits your existing workflow.',
    'A revolutionary approach.',
    'We are excited to announce it.',
  ])('flags: %s', (text) => {
    expect(rules(text)).toContain('L01');
  });

  it('matches on word boundaries, so an ordinary word containing a banned one passes', () => {
    // "platforms" is still the banned word; "flatform" and "algorithmic-free" are not in §4.1.
    expect(rules('The report sits on a flatform shelf.')).toEqual([]);
  });
});

describe('L02 contrast-only terms', () => {
  it('permits the term beside a negation', () => {
    expect(rules('Caspr is not a chatbot.')).toEqual([]);
  });

  it('flags the term with no negation nearby', () => {
    expect(rules('Ask the chatbot for a number.')).toContain('L02');
  });
});

describe('L03 prohibited claims', () => {
  it('flags LAM, and only in capitals', () => {
    expect(rules('Caspr is a LAM.')).toContain('L03');
    expect(rules('Spring lamb, sourced locally.')).toEqual([]);
  });

  it('flags a certification Caspr does not hold', () => {
    expect(rules('We are SOC 2 certified.')).toContain('L03');
  });
});

describe('L04, L05, L06', () => {
  it('flags any exclamation point', () => {
    expect(rules('Arrive certain!')).toContain('L04');
  });

  it('flags retired copy, read from the Library rather than a second list', () => {
    expect(rules('Stop Googling. Start analyzing.')).toContain('L05');
  });

  it('flags the stale tokens §4.1 names', () => {
    expect(rules('Over 1M+ sources.')).toContain('L06');
  });
});

describe('L07 and L10 block rather than regenerate', () => {
  it('blocks the brand boundary', () => {
    const report = lintDeterministic('A note on Ghost Research.');
    expect(report.findings.map((f) => f.rule)).toContain('L07');
    expect(report.blocked).toBe(true);
  });

  it('blocks the platform fee, and does not mistake 17% or 4.7% for it', () => {
    expect(lintDeterministic('A 7% fee applies.').blocked).toBe(true);
    expect(rules('Growth of 17% and 4.7% a year.')).toEqual([]);
  });

  it('does not block on a regenerate-only finding', () => {
    expect(lintDeterministic('Arrive certain!').blocked).toBe(false);
  });
});

describe('the report never claims a check it did not run', () => {
  it('lists the rules that need the engine as not run, each with a reason', () => {
    const report = lintDeterministic('Clean copy.');
    expect(report.notRun.map((r) => r.id)).toEqual(['L09', 'L11', 'L20', 'L21', 'L22', 'L23', 'L24']);
    expect(report.notRun.every((r) => r.why.length > 0)).toBe(true);
  });
});
