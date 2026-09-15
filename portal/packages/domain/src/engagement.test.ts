import { describe, expect, it } from 'vitest';

import {
  MENTION_SOURCES,
  TEAM_POST_CEILING,
  actedFrom,
  inboundResponse,
  isInbound,
  surfacing,
  teamPostCeilingReached,
  type EngagementTarget,
} from './engagement';
import { REFERENCE_ENGAGEMENT } from './reference-engagement';

const byId = new Map(REFERENCE_ENGAGEMENT.map((t) => [t.id, t]));
const target = (id: string) => byId.get(id)!;

describe('outbound — ⑰ and ㉕', () => {
  it('surfaces a comment that carries a fact and a source', () => {
    expect(surfacing(target('en-c1'))).toEqual({ surfaced: true });
    expect(surfacing(target('en-c2'))).toEqual({ surfaced: true });
  });

  /** ㉕ tier 3 — "Read only. Comment · repost · quote · react. Anything visible" is never. */
  it('never surfaces anything visible on an observe-tier account, even with a fact', () => {
    const result = surfacing(target('en-f1'));
    expect(result.surfaced).toBe(false);
    if (!result.surfaced) expect(result.why).toContain('read only');
  });

  /** ⑰: "If the_fact_to_bring is empty, the target does not appear." */
  it('drops a target with no fact to bring, however viral the post', () => {
    const result = surfacing(target('en-f2'));
    expect(result.surfaced).toBe(false);
    if (!result.surfaced) expect(result.why).toContain('applause');
  });

  it('keeps reposts to tier 1 — a tier 2 account gets a comment at most', () => {
    const result = surfacing(target('en-f3'));
    expect(result.surfaced).toBe(false);
    if (!result.surfaced) expect(result.why).toContain('tier 1');
    expect(surfacing({ ...target('en-f3'), accountTier: 1 })).toEqual({ surfaced: true });
  });
});

describe('inbound — a tag or a reshare takes its response from the tagger’s tier', () => {
  it('always surfaces an inbound act, so a person knows it happened', () => {
    for (const t of REFERENCE_ENGAGEMENT.filter((t) => isInbound(t.kind))) {
      expect(surfacing(t)).toEqual({ surfaced: true });
    }
  });

  it('replies to an engage-tier tag that we have something true to say about', () => {
    expect(inboundResponse(target('en-m1'))).toBe('reply');
  });

  it('shows no visible reaction to an observe-tier tag', () => {
    expect(inboundResponse(target('en-m2'))).toBe('read_only');
  });

  it('answers a reshare that carries a line of its own, and not a bare one', () => {
    expect(inboundResponse(target('en-r1'))).toBe('reply');
    expect(inboundResponse(target('en-r2'))).toBe('nothing');
  });

  it('reposts with a line when a tier 1 account tags us', () => {
    expect(inboundResponse({ ...target('en-m1'), accountTier: 1 })).toBe('repost_with_line');
  });
});

describe('the team-post ceiling — ㉖ constraint 3', () => {
  const teamComment = (id: string, status: EngagementTarget['status'] = 'open'): EngagementTarget => ({
    ...target('en-c1'),
    id,
    teamPost: true,
    status,
    post: { ...target('en-c1').post, id: 'team-post-1' },
  });

  it('stops at three of seven, and a skipped target does not count', () => {
    const two = [teamComment('a'), teamComment('b'), teamComment('c', 'skipped')];
    expect(teamPostCeilingReached(two, 'team-post-1')).toBe(false);
    const three = [...two, teamComment('d')];
    expect(teamPostCeilingReached(three, 'team-post-1')).toBe(true);
    expect(TEAM_POST_CEILING).toBe(3);
  });
});

describe('where each act is carried out — design spec §5 rule 4', () => {
  it('keeps company-account acts in the console and personal acts on the Personal Queue', () => {
    expect(actedFrom({ assignedTo: 'social' })).toBe('console');
    expect(actedFrom({ assignedTo: 'joy' })).toBe('personal_queue');
  });
});

describe('where a tag can reach us', () => {
  it('claims detection only where it has been verified', () => {
    const reach = Object.fromEntries(MENTION_SOURCES.map((s) => [s.surface, s.reach]));
    expect(reach).toEqual({
      'LinkedIn Company Page': 'yes',
      'Personal LinkedIn profiles': 'no',
      X: 'no',
      Reddit: 'unverified',
    });
  });

  it('only shows inbound acts from a surface that can deliver them', () => {
    for (const t of REFERENCE_ENGAGEMENT.filter((t) => isInbound(t.kind))) {
      expect(t.post.platform).toBe('linkedin');
      expect(t.about).toBe('caspr');
    }
  });

  it('marks every stand-in post as a stand-in', () => {
    expect(REFERENCE_ENGAGEMENT.every((t) => t.illustrative)).toBe(true);
  });
});
