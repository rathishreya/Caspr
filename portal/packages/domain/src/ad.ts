/**
 * Ads — every one we would run, and the machinery that decides whether it stays.
 *
 * ⚑ **Paid is a validation instrument, not an acquisition channel** — `channel-model.md`
 * §3.6, and it is the sentence this whole surface is built around:
 *
 * > *"Its job is to find out **which message converts, cheaply**, so the owned engine knows
 * > what to amplify. At ~$850 deployable it buys ~10 signups a month — real, but never the
 * > funnel."*
 *
 * That changes what an ad **is** here. It is not a unit of spend chasing a signup; it is **an
 * angle under test**, and its output is a finding the owned engine uses. Ten signups do not
 * pay for a workstream. Knowing which of nine angles a buyer responds to does.
 *
 * So every ad declares the angle it is testing, and the angles are the **stance library's**
 * (`stance.ts`, framework §5) — the same nine the conversation engine draws from, against the
 * same claims register. An ad testing a claim the drafts may not make would be testing
 * something we could never then amplify.
 *
 * **Google Search first, not LinkedIn** (§3.6): high commercial intent at materially lower
 * cost per click, where *"LinkedIn charges $8–18 to interrupt someone who wasn't looking."*
 */

import { STANCE_ANGLES, type StanceAngle } from './stance';

/** Where an ad can run, in the order paid opens them. */
export const AD_PLATFORMS = ['google_search', 'meta_feed', 'meta_reel', 'linkedin'] as const;
export type AdPlatform = (typeof AD_PLATFORMS)[number];

export const AD_PLATFORM_LABEL: Readonly<Record<AdPlatform, string>> = {
  google_search: 'Google Search',
  meta_feed: 'Meta feed',
  meta_reel: 'Meta reel',
  linkedin: 'LinkedIn',
};

export interface PlatformRule {
  readonly id: AdPlatform;
  readonly name: string;
  /** What this placement is for. Never "awareness". */
  readonly job: string;
  /** Why it is open, or why it is not. */
  readonly standing: string;
  readonly open: boolean;
  /** Character ceilings the platform enforces. Nulls where a field does not exist there. */
  readonly limits: {
    readonly headline: number | null;
    readonly description: number | null;
    /** The body copy shown before a "more" truncation. */
    readonly primary: number | null;
  };
  readonly creative: { readonly width: number; readonly height: number } | null;
  /** Hashtags: a count, and zero means the placement has no such thing. */
  readonly hashtags: number;
}

/**
 * ⚠ **Meta can only ever be retargeting** — framework §9.1. Cold job-title, industry and
 * company-size targeting was removed in January 2026, and a custom audience needs 1,000
 * people before Meta serves anything. Nothing here can open it early.
 */
export const AD_PLATFORM_RULES: readonly PlatformRule[] = [
  {
    id: 'google_search',
    name: 'Google Search',
    job: 'Catch someone who is already looking. The only placement where intent arrives with the click.',
    standing: 'First, and the whole of the launch burst unless the Meta audience reaches 1,000 by week 8.',
    open: true,
    limits: { headline: 30, description: 90, primary: null },
    creative: null,
    hashtags: 0,
  },
  {
    id: 'meta_feed',
    name: 'Meta feed',
    job: 'The recall layer. Not where they discover Caspr — where they remember it, at 9pm, with more mind space.',
    standing: 'Retargeting only, and only once an audience reaches 1,000. Never interest or job-title targeting.',
    open: false,
    limits: { headline: 40, description: 30, primary: 125 },
    creative: { width: 1080, height: 1080 },
    hashtags: 2,
  },
  {
    id: 'meta_reel',
    name: 'Meta reel',
    job: 'The finding in 10 seconds, or an expert micro-cut. Vertical, captioned, source line on screen.',
    standing: 'Waits on cutdowns existing. The engine writes the script and the caption; it does not make video.',
    open: false,
    limits: { headline: 40, description: null, primary: 125 },
    creative: { width: 1080, height: 1920 },
    hashtags: 2,
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    job: 'Retargeting, and the two high-value ICPs search does not reach.',
    standing:
      'Later, deliberately. $8–18 to interrupt someone who was not looking, against a search click from someone who was.',
    open: false,
    limits: { headline: 70, description: 70, primary: 150 },
    creative: { width: 1200, height: 628 },
    hashtags: 2,
  },
];

export function platformRule(id: AdPlatform): PlatformRule {
  const found = AD_PLATFORM_RULES.find((rule) => rule.id === id);
  if (found === undefined) throw new Error(`No ad platform ${id}`);
  return found;
}

/**
 * The standing checklist — `operations-runbook.md` §7.
 *
 * *"Free, controllable, and it is what produces the multi-section look in a paid result."*
 * Two of the six carry their exact copy, because they were written once and are not a
 * per-campaign decision.
 */
export const CALLOUT_ASSETS = '$100 free · No credit card · Cited to source';
export const STRUCTURED_SNIPPETS = 'Types: Market Research, Business Case, Due Diligence, Investment Thesis';
export const SITELINKS_MIN = 4;
export const SITELINKS_MAX = 6;

export interface CampaignCheck {
  readonly id: string;
  readonly what: string;
  readonly detail: string;
}

export const CAMPAIGN_CHECKLIST: readonly CampaignCheck[] = [
  { id: 'sitelinks', what: 'Sitelink assets', detail: `${SITELINKS_MIN}–${SITELINKS_MAX} deep links, each with a description.` },
  { id: 'callouts', what: 'Callout assets', detail: CALLOUT_ASSETS },
  { id: 'snippets', what: 'Structured snippet assets', detail: STRUCTURED_SNIPPETS },
  {
    id: 'landing',
    what: 'Landing page matches ad intent',
    detail: 'Never point a use-case ad at the homepage. The click was for something specific.',
  },
  { id: 'utm', what: 'UTM parameters and icp_hint on every destination', detail: 'No attribution, no x.' },
  {
    id: 'tracking',
    what: 'Conversion tracking confirmed firing',
    detail: 'Before spend begins, not after. A campaign measured from day three has three days nobody can read.',
  },
];

/** The five states an ad moves through. Nothing skips, and nothing returns from `killed`. */
export const AD_STATES = ['draft', 'approved', 'live', 'paused', 'killed'] as const;
export type AdState = (typeof AD_STATES)[number];

export const AD_STATE_LABEL: Readonly<Record<AdState, string>> = {
  draft: 'Needs a decision',
  approved: 'Approved',
  live: 'Live',
  paused: 'Paused',
  killed: 'Killed',
};

/**
 * ⚑ **`killed` is terminal, and `paused` is not.**
 *
 * A kill rule pauses so a person can diagnose (`operations-runbook.md` §7); killing is the
 * decision that follows, and a killed angle is a finding. Letting a killed ad go back to live
 * would let somebody quietly re-run a message that already failed, which is the one thing a
 * validation instrument must not permit.
 */
export const AD_NEXT: Readonly<Record<AdState, readonly AdState[]>> = {
  draft: ['approved'],
  approved: ['live'],
  live: ['paused'],
  paused: ['live', 'killed'],
  killed: [],
};

export function canMoveAd(from: AdState, to: AdState): boolean {
  return AD_NEXT[from].includes(to);
}

/**
 * Whether an ad can be sent back to be rebuilt.
 *
 * Anything but a killed one. A live ad being revised is a live ad coming down — which is
 * correct, because the thing running is no longer the thing anybody approved.
 */
export function canReviseAd(state: AdState): boolean {
  return state !== 'killed';
}

export interface AdCopy {
  /** Search takes several; social takes one. Each is held to the platform's ceiling. */
  readonly headlines: readonly string[];
  readonly descriptions: readonly string[];
  /** The body copy on a social placement. Null on search, which has no such field. */
  readonly primary: string | null;
  readonly hashtags: readonly string[];
  /** Where the click lands. The intent rule is checked against it. */
  readonly landingPath: string;
}

export interface Ad {
  readonly id: string;
  readonly platform: AdPlatform;
  /** The angle under test. Always one of the stance library's. */
  readonly angle: StanceAngle;
  /** Who it is aimed at. Paid runs narrow while `x@6` is unread. */
  readonly icp: string;
  readonly copy: AdCopy;
  /** The image or video this ad carries, where the placement has one. */
  readonly creative: { readonly headline: string; readonly support: string; readonly source: string } | null;
  readonly state: AdState;
  readonly metrics: AdMetrics | null;
  readonly note: string;
  /**
   * The last instruction somebody gave the writer about this ad.
   *
   * ⚑ **A reviewer types an instruction, never the ad.** The same rule the post queue
   * follows: the words that go out are written against the claims register by the engine, and
   * a human rewriting them in a text box is how an unchecked claim reaches a placement with
   * money behind it. So a revision says *what to change*, the ad is rebuilt, and the rebuilt
   * ad comes back through the same approval.
   */
  readonly revision?: { readonly note: string; readonly at: string };
}

/** The same ceiling the post queue uses, so an instruction means the same length everywhere. */
export const AD_PROMPT_MAX = 400;

/** What a live ad has done. Null until it has run. */
export interface AdMetrics {
  readonly impressions: number;
  readonly clicks: number;
  readonly conversions: number;
  readonly spend: number;
}

export function ctr(metrics: AdMetrics): number {
  return metrics.impressions === 0 ? 0 : metrics.clicks / metrics.impressions;
}

export function cac(metrics: AdMetrics): number | null {
  return metrics.conversions === 0 ? null : metrics.spend / metrics.conversions;
}

/*
 * `operations-runbook.md` §7, and the thresholds are what make the burst safe with no
 * reviewer. `CAC_CEILING` lives in `paid.ts` — one ceiling, read by the workstream's tiles
 * and by every ad, because two copies of a threshold is how they drift apart.
 */
export { CAC_CEILING } from './paid';
import { CAC_CEILING } from './paid';

export const CTR_FLOOR = 0.01;
export const CTR_SAMPLE = 500;
export const CLICKS_BEFORE_A_VERDICT = 100;

export type AdVerdict = 'no_reading' | 'working' | 'rewrite' | 'pause';

export interface AdReading {
  readonly verdict: AdVerdict;
  /** What the numbers say, in one line. */
  readonly says: string;
  /** What to do, and it is never "monitor". */
  readonly act: string;
  /** Which rule fired, where one did. */
  readonly rule: string | null;
}

/**
 * Is it working?
 *
 * **Order matters, and it is the runbook's.** CAC is read first because it is the only rule
 * that can fire on an ad that looks healthy; a rewrite is proposed before a pause, because
 * *"rewrite the ad, do not raise the bid"*; and nothing is read at all before its sample
 * exists — an ad killed at forty impressions was never tested.
 */
export function readAd(metrics: AdMetrics | null): AdReading {
  if (metrics === null || metrics.impressions === 0) {
    return {
      verdict: 'no_reading',
      says: 'Has not run.',
      act: 'Nothing to read. An ad paused before its sample exists was never tested.',
      rule: null,
    };
  }

  const cost = cac(metrics);
  if (cost !== null && cost > CAC_CEILING) {
    return {
      verdict: 'pause',
      says: `$${Math.round(cost)} a customer, over the $${CAC_CEILING} ceiling.`,
      act: 'Pause. Diagnose before resuming — the ceiling was agreed in advance for exactly this moment.',
      rule: `CAC above $${CAC_CEILING}`,
    };
  }

  if (metrics.clicks >= CLICKS_BEFORE_A_VERDICT && metrics.conversions === 0) {
    return {
      verdict: 'pause',
      says: `${metrics.clicks} clicks, no conversions.`,
      act: 'Pause. The landing page or the targeting is wrong — the ad did its job and something after it did not.',
      rule: `Zero conversions after ${CLICKS_BEFORE_A_VERDICT} clicks`,
    };
  }

  if (metrics.impressions >= CTR_SAMPLE && ctr(metrics) < CTR_FLOOR) {
    return {
      verdict: 'rewrite',
      says: `${(ctr(metrics) * 100).toFixed(2)}% click-through, under ${CTR_FLOOR * 100}%.`,
      act: 'Rewrite the ad. Do not raise the bid — a higher bid buys more impressions of a message nobody wants.',
      rule: `CTR below ${CTR_FLOOR * 100}% after ${CTR_SAMPLE} impressions`,
    };
  }

  if (metrics.clicks < CLICKS_BEFORE_A_VERDICT && metrics.impressions < CTR_SAMPLE) {
    return {
      verdict: 'no_reading',
      says: `${metrics.impressions} impressions, ${metrics.clicks} clicks.`,
      act: `Too early. ${CTR_SAMPLE} impressions or ${CLICKS_BEFORE_A_VERDICT} clicks before any rule reads.`,
      rule: null,
    };
  }

  return {
    verdict: 'working',
    says:
      cost === null
        ? `${(ctr(metrics) * 100).toFixed(2)}% click-through, no conversions yet.`
        : `$${Math.round(cost)} a customer at ${(ctr(metrics) * 100).toFixed(2)}% click-through.`,
    act: 'Inside every rule. This is the angle to tell the owned engine about.',
    rule: null,
  };
}

/**
 * What is wrong with the copy, before anybody approves it.
 *
 * Two kinds of rule, and they fail differently. **Platform limits** get the ad truncated or
 * rejected by the network. **Brand rules** get it published as something we do not say —
 * `CLAUDE.md`'s voice rules and the `COPY-11a`/`COPY-11b` budget framings, which are the ones
 * that would be wrong in public with money behind them.
 */
export interface CopyProblem {
  readonly field: string;
  readonly what: string;
  readonly fix: string;
  readonly weight: 'blocking' | 'quality';
}

/** ⛔ `CLAUDE.md`: never name a competitor or the LLM category in lead copy. */
const COMPETITOR = /\b(chatgpt|perplexity|gemini|copilot|claude|openai|ibisworld|statista|gartner|mckinsey)\b/i;
/** ⛔ The budget is never a subscription price — `COPY-11a`. */
const PRICE_AS_SUBSCRIPTION = /\b(?:from|starting at)\s*\$\d|\$\d[\d,.]*\s*(?:\/\s*mo\b|\/\s*month\b|a month\b(?! of research))|\bthe \$\d[\d,.]*\s+plan\b/i;
/** ⛔ Words the brand does not use. */
const AVOID = /\b(platform|leverages?|powerful ai|revolutionary|game.?changing|chatbot|cutting.?edge|seamless)\b/i;

export function checkAdCopy(ad: Ad): readonly CopyProblem[] {
  const rule = platformRule(ad.platform);
  const problems: CopyProblem[] = [];
  const all = [...ad.copy.headlines, ...ad.copy.descriptions, ad.copy.primary ?? ''].filter(Boolean);

  if (rule.limits.headline !== null) {
    for (const headline of ad.copy.headlines) {
      if (headline.length > rule.limits.headline) {
        problems.push({
          field: `Headline “${headline.slice(0, 28)}…”`,
          what: `${headline.length} characters, over ${rule.limits.headline}.`,
          fix: `${AD_PLATFORM_LABEL[ad.platform]} cuts it. Rewrite to ${rule.limits.headline}.`,
          weight: 'blocking',
        });
      }
    }
  }

  if (rule.limits.description !== null) {
    for (const description of ad.copy.descriptions) {
      if (description.length > rule.limits.description) {
        problems.push({
          field: 'Description',
          what: `${description.length} characters, over ${rule.limits.description}.`,
          fix: `Rewrite to ${rule.limits.description}. What is past it is not shown.`,
          weight: 'blocking',
        });
      }
    }
  }

  if (rule.limits.primary !== null && ad.copy.primary !== null && ad.copy.primary.length > rule.limits.primary) {
    problems.push({
      field: 'Primary text',
      what: `${ad.copy.primary.length} characters — ${rule.limits.primary} show before “more”.`,
      fix: 'Put the whole point before the truncation. Nobody taps “more” to find out whether it was worth it.',
      weight: 'quality',
    });
  }

  if (ad.copy.hashtags.length > rule.hashtags) {
    problems.push({
      field: 'Hashtags',
      what: `${ad.copy.hashtags.length}, and ${rule.hashtags === 0 ? 'this placement has none' : `the limit is ${rule.hashtags}`}.`,
      fix:
        rule.hashtags === 0
          ? 'Search ads have no hashtags. Remove them.'
          : 'Two at most. More reads as reach-seeking, which is the opposite of the register.',
      weight: rule.hashtags === 0 ? 'blocking' : 'quality',
    });
  }

  for (const text of all) {
    if (text.includes('!')) {
      problems.push({
        field: 'Tone',
        what: 'An exclamation point.',
        fix: 'Never, in any copy. The voice is the most credible person in the room, and they do not shout.',
        weight: 'blocking',
      });
      break;
    }
  }

  const named = all.find((text) => COMPETITOR.test(text));
  if (named !== undefined) {
    problems.push({
      field: 'Lead copy',
      what: `Names a competitor or the LLM category: “${COMPETITOR.exec(named)?.[0]}”.`,
      fix: 'Naming them concedes we are in the same category. That contrast belongs on /vs/, in social and in founder content — never in an ad.',
      weight: 'blocking',
    });
  }

  const priced = all.find((text) => PRICE_AS_SUBSCRIPTION.test(text));
  if (priced !== undefined) {
    problems.push({
      field: 'The figure',
      what: 'The Research Budget is written as a subscription price.',
      fix: '“$200 a month of research”, never “from $200/mo”. And it never travels without “unused balance carries forward”.',
      weight: 'blocking',
    });
  }

  const avoided = all.find((text) => AVOID.test(text));
  if (avoided !== undefined) {
    problems.push({
      field: 'Wording',
      what: `Uses “${AVOID.exec(avoided)?.[0]}”.`,
      fix: 'On the avoid list. Precise, authoritative, commercially sharp — and none of those words is any of the three.',
      weight: 'quality',
    });
  }

  // §7's landing rule: never point a use-case ad at the homepage.
  if (ad.copy.landingPath === '/' && ad.angle !== 'identity') {
    problems.push({
      field: 'Landing page',
      what: 'Points at the homepage.',
      fix: 'Never point a use-case ad at the homepage. The click was for something specific; send it there.',
      weight: 'blocking',
    });
  }

  return problems;
}

/** Ads whose copy has a blocking problem cannot be approved. */
export function adApprovable(ad: Ad): boolean {
  return ad.state === 'draft' && !checkAdCopy(ad).some((problem) => problem.weight === 'blocking');
}

/**
 * The ad's image, as a creative spec the existing renderer already draws.
 *
 * ⚑ **The free creative generator was already in this repo**, and it is better than anything
 * bought or bolted on: `creatives/render.tsx` draws a 1080×1080 card with `next/og`, from the
 * brand tokens, with no service to keep running and no per-image cost. It is deterministic —
 * the same ad renders the same picture every time — which a generative image tool is not, and
 * that matters more here than novelty: an ad creative that drifts between renders is an ad
 * nobody can approve.
 *
 * The renderer also **refuses**: a headline that would overflow is not drawn, and the refusal
 * names what did not fit rather than handing back a broken picture.
 *
 * Meta's feed takes exactly the canvas the card already uses. A reel is 1080×1920 and is not
 * drawn here, because the engine writes the script and the caption and does not make video.
 */
export function adCreativeSpec(ad: Ad): {
  readonly template: 'card';
  readonly eyebrow: string;
  readonly headline: string;
  readonly standfirst: string;
  readonly source: string | null;
} | null {
  if (ad.creative === null) return null;
  return {
    template: 'card',
    eyebrow: AD_PLATFORM_LABEL[ad.platform].toUpperCase(),
    headline: ad.creative.headline,
    standfirst: ad.creative.support,
    source: ad.creative.source,
  };
}

export interface SpendReading {
  readonly spend: number;
  readonly budget: number;
  readonly conversions: number;
  readonly cac: number | null;
  readonly live: number;
  readonly killed: number;
  /** Angles with a live or finished reading — what paid has actually learnt. */
  readonly anglesTested: number;
  readonly anglesTotal: number;
}

export function readSpend(ads: readonly Ad[], budget: number): SpendReading {
  const withMetrics = ads.filter((ad) => ad.metrics !== null);
  const spend = withMetrics.reduce((sum, ad) => sum + (ad.metrics?.spend ?? 0), 0);
  const conversions = withMetrics.reduce((sum, ad) => sum + (ad.metrics?.conversions ?? 0), 0);

  return {
    spend,
    budget,
    conversions,
    cac: conversions === 0 ? null : spend / conversions,
    live: ads.filter((ad) => ad.state === 'live').length,
    killed: ads.filter((ad) => ad.state === 'killed').length,
    anglesTested: new Set(withMetrics.map((ad) => ad.angle)).size,
    anglesTotal: STANCE_ANGLES.length,
  };
}
