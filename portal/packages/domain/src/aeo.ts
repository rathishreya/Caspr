/**
 * AEO — the build standard, the site's debt, and the one test that decides the data pages.
 *
 * `docs/seo/decision.md` §2 item 2: **AEO as a build standard — every template, not a content
 * family.** *"Costs almost nothing at build time, expensive to retrofit. No downside case
 * exists."* That is why it is modelled as a checklist a page either meets or does not, rather
 * than as a score somebody argues about.
 *
 * The evidence is specific and it is the reason the standard is not optional:
 * **citing sources +40% AI visibility · statistics +37% · a low-authority domain up to +115%**
 * — *"the single most relevant finding for a site with no authority."*
 */

export const AEO_CHECKS = ['answer_block', 'sourced_figures', 'comparison_table', 'schema', 'freshness'] as const;
export type AeoCheck = (typeof AEO_CHECKS)[number];

export interface AeoCheckDefinition {
  readonly id: AeoCheck;
  readonly label: string;
  readonly what: string;
  /** What the evidence says this one is worth, where the decision record gives a figure. */
  readonly worth: string | null;
}

export const AEO_STANDARD: readonly AeoCheckDefinition[] = [
  {
    id: 'answer_block',
    label: '40–60 word answer block',
    what: 'The query is answered in the first two sentences. Search readers do not scroll to find out whether you know.',
    worth: null,
  },
  {
    id: 'sourced_figures',
    label: 'Every figure with its source and date',
    what: 'Inline, never a footnote. A NOT_FOUND figure is stated plainly — do not estimate, do not infer, do not hedge it into existence.',
    worth: 'Citing sources: +40% AI visibility',
  },
  {
    id: 'comparison_table',
    label: 'A comparison table',
    what: 'The shape an AI answer lifts most readily, and the shape a buyer scans.',
    worth: 'Statistics: +37%',
  },
  {
    id: 'schema',
    label: 'Schema',
    what: 'Organization, BreadcrumbList, Article — the site carries zero JSON-LD on any page today.',
    worth: 'Low-authority domain: up to +115%',
  },
  {
    id: 'freshness',
    label: 'A visible freshness stamp',
    what: 'On the page, not in a meta tag. A reader deciding whether to trust a figure asks how old it is first.',
    worth: null,
  },
];

export interface AeoPage {
  readonly id: string;
  readonly path: string;
  readonly title: string;
  /** Which of the five it currently meets. */
  readonly meets: readonly AeoCheck[];
  readonly published: boolean;
  readonly note: string;
}

export function aeoMissing(page: AeoPage): readonly AeoCheckDefinition[] {
  return AEO_STANDARD.filter((check) => !page.meets.includes(check.id));
}

export function aeoComplete(page: AeoPage): boolean {
  return aeoMissing(page).length === 0;
}

/**
 * The site's own debt — `.agents/gtm-strategy.md` §4 and `docs/seo/decision.md` §3A.3.
 *
 * Every one of these is a named, measured gap rather than a good idea. They are listed
 * together because they share a property that makes them easy to defer forever: **each is
 * cheap now and expensive later**, and none of them produces a number this month.
 */
export interface SiteDebt {
  readonly id: string;
  readonly what: string;
  readonly standing: string;
  readonly blocks: string;
  readonly done: boolean;
}

export const SITE_DEBT: readonly SiteDebt[] = [
  {
    id: 'json-ld',
    what: 'Structured data — Organization, BreadcrumbList, Article, VideoObject, SoftwareApplication',
    standing: 'The site has zero JSON-LD on any page.',
    blocks: 'Both the AEO standard and entity establishment. It is the same work twice over.',
    done: false,
  },
  {
    id: 'sitemap',
    what: 'A declared sitemap',
    standing: 'None exists today.',
    blocks: 'Indexation — and the ranking clock cannot start until pages are indexed.',
    done: false,
  },
  {
    id: 'orphans',
    what: 'The 12 orphan pages linked into nav and footer',
    standing: 'Twelve pages exist and nothing links to them.',
    blocks: 'Internal linking, which is one of the three weekly SEO task kinds.',
    done: false,
  },
  {
    id: 'utm',
    what: 'utm_* on every outbound link',
    standing: 'Not instrumented.',
    blocks: 'Attribution, and therefore x. A channel that produces sessions we cannot attribute reads as a channel that produces nothing.',
    done: false,
  },
  {
    id: 'templates',
    what: 'Programmatic templates and a glossary',
    standing: 'Not built.',
    blocks: 'The 40 seeded data pages, which are the conversion test.',
    done: false,
  },
];

/**
 * Entity establishment — §3A.3, *"the cheapest long lever there is."*
 *
 * ⛔ **Do not create a Wikipedia page for ourselves.** Notability and conflict-of-interest
 * rules make a self-authored page a liability rather than an asset. *"Earn the citations
 * first; the page follows or it does not."*
 */
export const WIKIPEDIA_SHARE_OF_CHATGPT_CITATIONS = 0.078;

export interface EntitySignal {
  readonly id: string;
  readonly what: string;
  readonly standing: string;
  readonly done: boolean;
  readonly forbidden?: true;
}

export const ENTITY_SIGNALS: readonly EntitySignal[] = [
  {
    id: 'org-schema',
    what: 'Organization schema with consistent naming, founding, location and identifiers',
    standing: 'Already in the website scope — now with a second reason.',
    done: false,
  },
  {
    id: 'wikidata',
    what: 'A Wikidata entry',
    standing: 'Permitted and straightforward, unlike Wikipedia. Caspr has none.',
    done: false,
  },
  {
    id: 'consistency',
    what: 'Consistent entity signals across every directory, profile and listing',
    standing: 'Every approach on the target list is also an entity signal, if the details match.',
    done: false,
  },
  {
    id: 'citable-sources',
    what: 'Being mentioned in the kind of source Wikipedia would cite',
    standing: 'What makes a page possible later. The Record is the strongest route we own.',
    done: false,
  },
  {
    id: 'no-wikipedia',
    what: 'A self-authored Wikipedia page',
    standing: 'Never. Notability and conflict-of-interest rules make it a liability, not an asset.',
    done: false,
    forbidden: true,
  },
];

/**
 * T4 — the one test that decides the data pages.
 *
 * `docs/seo/hybrid-validation.md` §5. Three pages to the AEO standard on commercial-CPC
 * shapes, each showing the figure, every source, and **the disagreement stated plainly**.
 *
 * **Kill: under 1% reaching `prompt_submitted` after 1,000 sessions** — the same bar the free
 * tool was held to. And §3A.1 moved what the gate governs: *"the gate moves from start to
 * scale."* Failing it means not going from 40 pages to 4,000. It does not mean the 40 should
 * not exist; they remain a citation and brand asset either way, and they cost a cached
 * `fact_lookup` each.
 */
export const DATA_PAGE_SEED = 40;
export const CONVERSION_TEST = { sessions: 1000, bar: 0.01 } as const;

export interface ConversionReading {
  readonly sessions: number;
  readonly promptSubmitted: number;
  readonly rate: number;
  readonly readable: boolean;
  readonly passed: boolean;
  readonly says: string;
}

export function readConversionTest(sessions: number, promptSubmitted: number): ConversionReading {
  const rate = sessions === 0 ? 0 : promptSubmitted / sessions;
  const readable = sessions >= CONVERSION_TEST.sessions;

  return {
    sessions,
    promptSubmitted,
    rate,
    readable,
    passed: readable && rate >= CONVERSION_TEST.bar,
    says: readable
      ? rate >= CONVERSION_TEST.bar
        ? `${(rate * 100).toFixed(1)}% reached a prompt. Above the 1% bar — the programmatic bet is on.`
        : `${(rate * 100).toFixed(1)}% reached a prompt, under the 1% bar. Do not scale from ${DATA_PAGE_SEED} to thousands. The pages stay as a citation asset.`
      : `${sessions.toLocaleString('en-US')} of ${CONVERSION_TEST.sessions.toLocaleString('en-US')} sessions. The test does not read yet, and the ${DATA_PAGE_SEED} pages exist either way.`,
  };
}

/**
 * The hypothesis the test exists to check — §3.1 of the validation doc, and it is worth
 * carrying on the screen because it is what the pages are designed around.
 *
 * *"Someone searching `copper production by country` wants a number. We give them the number.
 * They leave."* The answer is a design answer rather than a rebuttal: **the conversion
 * mechanic is not the number, it is the disagreement.** A reader who arrives wanting one
 * figure and discovers two credible sources differ by 36% now has a problem they did not know
 * they had — and resolving it is the product.
 */
export const DISAGREEMENT_HYPOTHESIS =
  'The conversion mechanic is not the number, it is the disagreement. A reader who arrives wanting one figure and finds two credible sources 36% apart now has a problem they did not know they had — and resolving it is the product.';

/** §3.3 of the validation doc — a real cost, and it cuts both ways. */
export const AI_OVERVIEW_SHARE = 0.45;
export const AI_OVERVIEW_CLICK_LOSS = 0.58;
