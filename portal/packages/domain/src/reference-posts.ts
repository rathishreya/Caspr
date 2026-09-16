/**
 * The words of the reference week — one current version per Content & Social post.
 *
 * Design spec §9: "Every screen is populated with real content — never lorem, never
 * placeholder." A review surface is the strictest case of that rule: a reviewer judging
 * plausible-looking filler learns nothing about whether the voice survives the interface.
 *
 * **Every figure in these posts has a source in the repository**, and `researchBasis`
 * names it as `file :line` or `file §section`:
 *
 *  · `$5.86bn · 4.95%` against `$6.46bn · 12.4%` (UK ready meals), `$725.0M` against
 *    `$990M` (Saudi industrial valves), `8.5x` against `3.3x` (SaaS multiples), and the
 *    copper split — all from `index-engine.md` §1, measured on page one of search
 *  · the four hours, the two or three days, the six weeks — buyer research in
 *    `icp-personas.md`, and **presented as buyer research, never as a survey statistic**
 *
 * Nothing here is an invented number. Where a post carries an opinion rather than a
 * finding, it is an attributed opinion from the named person, which is the other half of
 * the hard gate (`content-engine-prompts.md` §0).
 *
 * The community threads are stand-ins and say so (`illustrative: true`): there is no live
 * listener yet, so no real thread exists to quote.
 *
 * Every version here passes its own channel rules and the deterministic linter. That is a
 * test, not a hope — `reference-posts.test.ts`.
 */

import type { CreativeSpec } from './creative';
import type { PostVersion } from './post';

const SAMPLES = 'https://caspr.ai/samples';
const BLOG = 'https://caspr.ai/blog';

/**
 * The week's cards. Figures and sources as the posts that carry them state them.
 *
 * Only the valves card is drawn as **the atom**, because only the valves figures have a
 * publisher and a period in this repository: IMARC Group, $725.0M, 2025 (`Reports-md/Saudi
 * Arabia Industrial Valves Market v1.md` :70, `index-engine.md` §6.1) and MarkNtel Advisors,
 * $990M, 2025 (same line; `seo/hybrid-validation.md` :17, "same market, same year"). The
 * ready meals figures have neither on record, so they go out as a card with the post's own
 * source line — ⑪: "a chart that drops the publisher is not the atom".
 */
const READY_MEALS_CARD: CreativeSpec = {
  template: 'card',
  eyebrow: 'UK ready meals · same basis, same year',
  headline: '$5.86bn or $6.46bn',
  standfirst: 'Two published estimates of one market: a $600m gap in size and a 2.5× gap in growth. It does not close.',
  source: "Source: Caspr's ready meals reconciliation",
};

const VALVES_ATOM: CreativeSpec = {
  template: 'atom',
  eyebrow: 'Industrial valves · Saudi Arabia',
  headline: '36% apart',
  figures: [
    { display: '$725.0M', value: 725, publisher: 'IMARC Group', period: '2025' },
    { display: '$990M', value: 990, publisher: 'MarkNtel Advisors', period: '2025' },
  ],
  source: 'Source: IMARC Group; MarkNtel Advisors. Market size, 2025.',
};

export const REFERENCE_POSTS: readonly PostVersion[] = [
  // ── TUE 18 ────────────────────────────────────────────────────────────────
  {
    itemId: 'ci-0418-02',
    versionN: 1,
    modelTier: 'haiku',
    researchBasis: ['icp-personas.md :59', 'icp-personas.md :72'],
    regeneratedAfter: null,
    body: {
      kind: 'linkedin',
      paragraphs: [
        'Four hours of research. Three usable data points.',
        'That is the first night of a lot of engagements. The slide is a 2x2 with empty boxes. Three market sizes sit in three tabs, and none of them says how it was built.',
        'The cause is not effort. Associates rotate sectors constantly — pharma last month, logistics this month — and every rotation restarts the same job. The first hours go to assembling numbers rather than judging them.',
        'Three conflicting figures is not a research failure. It is the research. The question that matters is whether the three measure the same thing. Usually they do not, and none of the pages says so.',
        'The hours worth protecting are the ones spent deciding what a number means. Everything before that is assembly: the part a partner never sees and a client never pays for.',
      ],
      hashtags: ['consulting'],
      link: null,
      attachment: null,
    },
  },
  {
    itemId: 'ci-0418-03',
    versionN: 2,
    modelTier: 'frontier',
    researchBasis: [
      'icp-personas.md :618',
      'icp-personas.md :622',
      'icp-personas.md :634',
      'icp-personas.md :635',
    ],
    regeneratedAfter: {
      code: 'STALE_NUMBER',
      note: 'States the six-week window as a survey average. It is how buyers describe the cycle, not a measured figure.',
    },
    body: {
      kind: 'blog',
      slug: 'what-a-category-review-asks-for',
      headline: 'What a category review asks for, and where the research runs out',
      standfirst:
        'A category review answers four questions before it makes a recommendation. The research for the first three usually stops one level above the decision.',
      paragraphs: [
        'A category review has to answer four things: how big the market is and how fast it is growing, who competes in it, what shoppers are doing differently, and what that means for the range. The first three are research. The fourth is the recommendation, and it is only as defensible as the three beneath it.',
        "Category managers in Caspr's buyer research describe a demanding cycle: three or four major reviews a year, each starting the research again for a slightly different cut of the market, and a six-week window in which the research can take four of the weeks.",
        'The usual sources cover the category well and the subcategory poorly. Internal sales data is strong. Shelf walks are manual. Syndicated reports describe the category the business subscribes to, not the subcategory the ranging decision turns on.',
      ],
      cta: 'Bring the subcategory your next review turns on.',
      targetQuery: 'what goes in a category review',
    },
  },
  {
    itemId: 'ci-0418-04',
    versionN: 1,
    modelTier: 'haiku',
    researchBasis: ['index-engine.md §1'],
    regeneratedAfter: null,
    body: {
      kind: 'x',
      posts: [
        "$5.86bn or $6.46bn. Two published estimates of the UK ready meals market, same definition, same base year. Before either goes in a deck, the sentence that matters is the one saying they disagree. Source: Caspr's ready meals reconciliation.",
      ],
      link: null,
      attachment: null,
    },
    creative: READY_MEALS_CARD,
  },
  {
    itemId: 'ci-0418-05',
    versionN: 1,
    modelTier: 'haiku',
    researchBasis: ['index-engine.md §1', 'index-engine.md §2'],
    regeneratedAfter: null,
    body: {
      kind: 'linkedin',
      paragraphs: [
        'Two published estimates of the UK ready meals market use the same definition and the same base year. One puts it at $5.86bn, growing 4.95% a year. The other puts it at $6.46bn, growing 12.4%.',
        'That is a $600m gap in size and a 2.5× gap in growth, on a like-for-like basis.',
        'Most disagreement between published figures is definitional. Mine production against refined production. Trailing revenue against forward revenue. Those gaps close the moment the basis is stated.',
        'This one does not close. Same scope, same year, and the sources still disagree.',
        'A figure with a spread that wide belongs in a deck with its range attached, not with whichever end was found first.',
      ],
      hashtags: [],
      link: { url: SAMPLES, label: 'UK ready meals — the full reconciliation, free to read' },
      attachment: null,
    },
    creative: READY_MEALS_CARD,
  },

  // ── WED 19 ────────────────────────────────────────────────────────────────
  {
    itemId: 'ci-0419-01',
    versionN: 1,
    modelTier: 'frontier',
    researchBasis: ['index-engine.md §1', 'index-engine.md §2'],
    regeneratedAfter: null,
    body: {
      kind: 'blog',
      slug: 'why-market-figures-disagree',
      headline: 'Two figures that disagree are usually measuring different things',
      standfirst:
        'Most gaps between published market figures close the moment each one states its basis. The gaps that do not close are the finding.',
      paragraphs: [
        'When two published figures for the same market disagree, the first question is whether they measure the same thing. Often they do not. The most-cited copper figures split between mine production and refined production. Revenue multiples split between trailing and forward revenue.',
        'Definitional gaps are the common case and the easy one. State the basis of each figure and the disagreement becomes a footnote: multiples of 8.5x and 3.3x look like a 2.5× swing until one is labelled forward revenue and the other trailing.',
        'The harder case is a genuine disagreement: same definition, same base year, different answer. Published estimates of the UK ready meals market run from $5.86bn to $6.46bn on a like-for-like basis. That gap does not close, and the defensible way to use either number is with the other beside it.',
      ],
      cta: 'Bring a market where the published figures do not agree.',
      targetQuery: 'why do market size estimates differ',
    },
  },
  {
    itemId: 'ci-0419-02',
    versionN: 1,
    modelTier: 'haiku',
    researchBasis: [],
    regeneratedAfter: null,
    body: {
      kind: 'linkedin',
      paragraphs: [
        'A translated source is a second source.',
        'When a figure is published in Japanese or German and read through a translation, the number usually survives. The definition often does not. Two measures that differ in the original can land on near-identical phrases in English, and nothing in the translated sentence tells you which one you are holding.',
        'So the rule I hold is simple and expensive: read a source in the language it was published in, cite it in that language, and translate the explanation rather than the evidence.',
        'That costs more at every step. Retrieval has to work across scripts. Matching has to cope with the same company written three ways. The citation has to point at the original wording, because the person relying on it will eventually need the sentence the publisher actually wrote.',
        'The trade-off is worth it. A translation error in prose is awkward. A translation error in a definition produces a confident number that measures the wrong thing.',
      ],
      hashtags: [],
      link: null,
      attachment: null,
    },
  },
  {
    itemId: 'ci-0419-03',
    versionN: 1,
    modelTier: 'haiku',
    researchBasis: ['index-engine.md §1', 'seo/hybrid-validation.md :17'],
    regeneratedAfter: null,
    body: {
      kind: 'instagram',
      caption: 'Source: IMARC Group; MarkNtel Advisors. Saudi Arabia industrial valves, market size, 2025.',
    },
    creative: VALVES_ATOM,
  },
  {
    itemId: 'ci-0419-04',
    versionN: 1,
    modelTier: 'haiku',
    researchBasis: ['icp-personas.md :72', 'index-engine.md §2'],
    regeneratedAfter: null,
    body: {
      kind: 'community',
      venue: 'Reddit · r/consulting',
      threadQuestion:
        'New sector every few months. How do you get to a defensible market size without losing a week?',
      illustrative: true,
      paragraphs: [
        'Three habits have saved me the most time when a new sector lands.',
        'First, collect every published size before trusting any of them, and write the basis next to each: what is counted, which year, which currency, retail or wholesale value. Most of the spread disappears at this step. Two figures that measure different things are not a disagreement. They are a footnote nobody wrote.',
        'Second, where two sources share a basis and still disagree, keep both and show the range. Picking one hides the most useful thing you learned.',
        'Third, find the official series underneath the commercial reports. Business counts and statistics-office releases move slowly, but they rarely contradict themselves, and they give you a floor to test everything else against.',
        'Once you stop treating each number as an answer and start treating it as a claim with a basis, the first pass takes an afternoon rather than a week.',
        'Disclosure, since it is relevant here: I run Caspr, which reconciles published figures this way. The method works without it.',
      ],
      link: null,
    },
  },
  {
    itemId: 'ci-0419-05',
    versionN: 1,
    modelTier: 'haiku',
    researchBasis: [],
    regeneratedAfter: null,
    body: {
      kind: 'linkedin',
      paragraphs: [
        'A freshness job is mostly a job about not re-reading things.',
        'The obvious design fetches every source on a schedule and compares the result with last time. It works, and at any real volume it spends most of its effort establishing that nothing changed.',
        'The version I have been working on inverts that. Each source carries the signals that predict change: when it last moved, how often its publisher revises, whether a new edition has been announced. Sources that rarely move are revisited rarely. Sources with a release calendar are revisited the day after release.',
        'Two things surprised me. Revisions matter more than new publications, because a revised figure quietly replaces the old one at the same address. And the hard part is not detecting a change. It is deciding whether the change is material enough to flag everything that cited the old value.',
        'Staleness is a property of the claim, not the file.',
      ],
      hashtags: [],
      link: null,
      attachment: null,
    },
  },

  // ── THU 20 ────────────────────────────────────────────────────────────────
  {
    itemId: 'ci-0420-01',
    versionN: 2,
    modelTier: 'frontier',
    researchBasis: [
      'icp-personas.md :519',
      'icp-personas.md :521',
      'icp-personas.md :527',
      'icp-personas.md :531',
    ],
    regeneratedAfter: {
      code: 'WEAK',
      note: 'Opens on the method, not the finding. The two days do not appear until the fourth paragraph.',
    },
    body: {
      kind: 'blog',
      slug: 'desk-research-before-fieldwork',
      headline: 'Every study starts with two days nobody bills for',
      standfirst:
        'Before a screener is written or a discussion guide drafted, someone has to learn the category. That work is research in its own right, and it rarely reaches an invoice.',
      paragraphs: [
        'In the buyer research behind Caspr, market researchers described the same thing in almost the same words: every new project starts with two or three days of desk research that no one bills the client for. The study cannot be designed until the researcher knows the players, the market dynamics and what consumers have already said in published work.',
        'The subscription library covers the category. It rarely covers the subcategory at the granularity the study needs, so the rest is assembled by hand from trade press and industry databases.',
        'The proposal stage is worse. A credible scope has to show category knowledge before the client has agreed to pay for anything, and when the pitch does not convert, those hours are gone.',
        'The irony is not lost on anyone in the trade. The work that comes before a research project is itself a research task, and it needs the same triangulation as the deliverable it feeds.',
      ],
      cta: 'Bring the category your next study starts in.',
      targetQuery: 'desk research before fieldwork',
    },
  },
  {
    itemId: 'ci-0420-02',
    versionN: 1,
    modelTier: 'haiku',
    researchBasis: ['icp-personas.md :618', 'icp-personas.md :634'],
    regeneratedAfter: null,
    body: {
      kind: 'linkedin',
      paragraphs: [
        "Six weeks for a forty-page category review, and the research can take four of them. That is how category managers in Caspr's buyer research describe the cycle.",
        'Every review asks the same four things: the size and growth of the market, who competes in it, what shoppers are doing differently, and what all of that means for the range. The first three are research. The fourth is a recommendation, and it stands on the three beneath it.',
        'The research tends to run out one level too high. Syndicated coverage describes the category. The ranging decision is about the subcategory.',
        'We set out the four questions, and where the usual sources stop, in a short piece for category teams.',
      ],
      hashtags: [],
      link: {
        url: `${BLOG}/what-a-category-review-asks-for`,
        label: 'What a category review asks for, and where the research runs out',
      },
      attachment: null,
    },
    creative: {
      template: 'card',
      eyebrow: 'Category reviews',
      headline: 'Six weeks. The research can take four',
      standfirst: 'How category managers describe the cycle of a forty-page review.',
      source: "Source: Caspr's buyer research with category managers",
    },
  },
  {
    itemId: 'ci-0420-03',
    versionN: 1,
    modelTier: 'haiku',
    researchBasis: [],
    regeneratedAfter: null,
    body: {
      kind: 'linkedin',
      paragraphs: [
        'Most retrieval evaluations measure the wrong half of the problem.',
        'They ask whether the right document came back. That is necessary and nowhere near sufficient. For analysis, the question is whether the right passage came back, from the right edition, with its definition intact.',
        "I now score three things separately. Recall of the passage, not the document: a report can be the correct source and still be cited for a figure on the wrong page. Edition: a figure from last year's edition of the right report is a wrong figure with a correct-looking citation. Basis: if the passage says wholesale value and the claim says market size, retrieval succeeded and the answer failed.",
        'A single relevance score hides all three. Separating them made our headline numbers worse and our answers better, which is roughly how you know an evaluation has started measuring something real.',
      ],
      hashtags: [],
      link: null,
      attachment: null,
    },
  },
  {
    itemId: 'ci-0420-04',
    versionN: 1,
    modelTier: 'haiku',
    researchBasis: ['icp-personas.md :622', 'icp-personas.md :634', 'icp-personas.md :635'],
    regeneratedAfter: null,
    body: {
      kind: 'x',
      posts: [
        "6 weeks to produce a 40-page category review, and the research takes 4 of them. That is how category managers describe the cycle in Caspr's buyer research.",
        'The syndicated report covers the category. It rarely covers the subcategory the ranging decision is actually about, so the last mile is built by hand from shelf walks and trade press.',
        '3 or 4 major reviews a year, each starting the research again for a slightly different cut of the market. The gap is not access to data. The data stops one level above the decision.',
      ],
      link: null,
      attachment: null,
    },
  },
  {
    itemId: 'ci-0420-05',
    versionN: 1,
    modelTier: 'haiku',
    researchBasis: ['icp-personas.md :255', 'index-engine.md §2'],
    regeneratedAfter: null,
    body: {
      kind: 'community',
      venue: 'Wall Street Oasis · Private Equity',
      threadQuestion:
        'GP wants a market size for a sector we are screening by tomorrow. Where do you get a number you would actually defend?',
      illustrative: true,
      paragraphs: [
        'The number you can defend is rarely the first one you find, and it is almost never a single figure. What holds up in an IC memo is a range with its basis stated.',
        'In 24 hours, this is what works.',
        'Pull every published estimate you can and record, for each, what is counted, the base year, the currency, and whether it is revenue or volume. Discard nothing yet.',
        'Group the figures by basis. Estimates built on different definitions are not in conflict. They answer different questions, and you want the one that matches the thesis.',
        'Within a group, if two credible sources still disagree, present both. A spread shown openly survives questioning. A single number chosen quietly does not, the moment someone on the committee finds the other one.',
        'Where you can, anchor the range to something structural: filings from the largest players, or official statistics for the sector.',
        'Full disclosure: I run Caspr, which reconciles published figures this way. The approach is the same with or without it.',
      ],
      link: null,
    },
  },

  // ── FRI 21 ────────────────────────────────────────────────────────────────
  {
    itemId: 'ci-0421-01',
    versionN: 1,
    modelTier: 'frontier',
    researchBasis: ['CLAUDE.md · The two acquirer lenses'],
    regeneratedAfter: null,
    body: {
      kind: 'blog',
      slug: 'strategic-vs-financial-acquirer',
      headline: 'A strategic acquirer reads the same target for a different number',
      standfirst:
        'Financial and strategic buyers can look at one company and need two different reports. The market sizing barely changes. Almost every sentence around it does.',
      paragraphs: [
        'A financial acquirer buys for return on capital, so the asset has to stand on its own. A strategic acquirer buys for fit with a business it already owns, so the same asset is read for synergy, capability and defensive position.',
        'The reports look alike. The vocabulary and the lead metric do not. A financial buyer leads with return on capital. A strategic buyer leads with what the combined business can do that neither could do alone, and with what a competitor could do if it bought the target first.',
        'Material written for one reader reads wrongly to the other. The market sizing can stay identical while the framing of every finding around it changes, because the question underneath has moved from whether the asset pays to whether it fits.',
      ],
      cta: 'Bring the target, and say which kind of acquirer you are.',
      targetQuery: 'strategic vs financial acquirer',
    },
  },
  {
    itemId: 'ci-0421-02',
    versionN: 1,
    modelTier: 'haiku',
    researchBasis: [],
    regeneratedAfter: null,
    body: {
      kind: 'linkedin',
      paragraphs: [
        'What broke this week: a calendar that believed 18 August 2026 was a Monday.',
        'It was a Tuesday. The label came from a design mock drawn against the previous year, and the code trusted the label instead of computing the day.',
        'Nothing crashed. Every column was one day out, which is the worst kind of bug, because it looks right.',
        'The fix took ten minutes. The lesson took longer to write down. A date without a timezone is not a date. A week without a stated first day is not a week. A fixture copied from a picture inherits every mistake in the picture.',
        'We now compute the weekday from the date itself, pin the timezone in one place, and run the week-boundary tests on a machine set to a different zone from ours.',
        'Small thing. It is also the class of error that is hardest to notice in anything built on dates.',
      ],
      hashtags: [],
      link: null,
      attachment: null,
    },
  },
  {
    itemId: 'ci-0421-04',
    versionN: 2,
    modelTier: 'haiku',
    researchBasis: ['index-engine.md §1', 'index-engine.md §2'],
    regeneratedAfter: {
      code: 'DUPLICATE',
      note: "Repeats the UK ready meals figures from Tuesday's post. Same week, same audience.",
    },
    body: {
      kind: 'x',
      posts: [
        "36% apart. Two published estimates of the industrial valves market in Saudi Arabia: $725.0M and $990M. Source: Caspr's review of page-one market figures.",
        'Not every gap is a disagreement. Revenue multiples of 8.5x and 3.3x look 2.5× apart until one is labelled forward revenue and the other trailing.',
        'The gaps that survive a stated basis are the finding. Same market, same definition, different answer: that range is the number, not either end of it.',
      ],
      link: null,
      attachment: null,
    },
    // B1: "card on the FIRST post".
    creative: VALVES_ATOM,
  },

  // ── SAT 22 ────────────────────────────────────────────────────────────────
  {
    itemId: 'ci-0422-01',
    versionN: 1,
    modelTier: 'haiku',
    researchBasis: ['icp-personas.md :618', 'icp-personas.md :622', 'icp-personas.md :634'],
    regeneratedAfter: null,
    body: {
      kind: 'community',
      venue: 'Quora',
      threadQuestion: 'What should a category review include?',
      illustrative: true,
      paragraphs: [
        'Four things, in this order: how big the market is and how fast it is growing, who competes in it, what shoppers are doing differently, and what all of that means for the range.',
        'The first three are research and the fourth is the recommendation. A recommendation is only as defensible as the three beneath it, so most of the effort belongs there.',
        'The trap is depth in the wrong place. Syndicated reports usually cover the category well and the subcategory the ranging decision is about poorly, so the last mile gets built by hand from shelf walks and trade press.',
        'We set out the four questions, and where the usual sources stop, at Caspr.',
      ],
      link: {
        url: `${BLOG}/what-a-category-review-asks-for`,
        label: 'What a category review asks for, and where the research runs out',
      },
    },
  },

  // ── SUN 23 ────────────────────────────────────────────────────────────────
  {
    itemId: 'ci-0423-03',
    versionN: 1,
    modelTier: 'haiku',
    researchBasis: [],
    regeneratedAfter: null,
    body: {
      kind: 'linkedin',
      paragraphs: [
        'A 100-page report is not read. It is searched.',
        'Long analyses are rarely read from page one. People arrive with a question already formed, go straight to the section that answers it, and leave. The design problem is not typography for page 40. It is getting someone to page 40 in one move, and back out with the citation intact.',
        'Three things I have changed my mind about.',
        'The contents page is a navigation surface, not a formality. It deserves the same attention as any screen.',
        'Citations belong beside the claim, not at the back. A reader who has to leave a paragraph to find its source has already stopped reading the paragraph.',
        'A chart has to carry its own source line. Charts get pasted into other documents, and anything not printed on the chart itself is lost the moment that happens.',
        'Long documents are reference material. Designing them like a story is the most common mistake I see.',
      ],
      hashtags: [],
      link: null,
      attachment: null,
    },
  },
];

/**
 * The daily track's two posts. Their trigger is illustrative — no listener runs — and their
 * claims are not: ESOMAR's figure is `icp-personas.md :511`, and the citation rule is the
 * build spec's own, `§3.3`.
 */
export const REFERENCE_DAILY_POSTS: readonly PostVersion[] = [
  {
    itemId: 'ci-0417-d1',
    versionN: 1,
    modelTier: 'haiku',
    researchBasis: ['icp-personas.md :511', 'icp-personas.md :527'],
    regeneratedAfter: null,
    respondsTo: {
      summary: 'A thread on agency margins quoting the size of the research industry as if every hour in it were billed.',
      illustrative: true,
    },
    body: {
      kind: 'x',
      posts: [
        "$153bn: the global market research industry, per ESOMAR. The desk research before every study sits outside that figure, because nobody bills for it. Source: ESOMAR, and Caspr's buyer research.",
      ],
      link: null,
      attachment: null,
    },
    creative: {
      template: 'card',
      eyebrow: 'The global market research industry',
      headline: '$153bn',
      standfirst: 'The desk research before every study sits outside that figure, because nobody bills for it.',
      source: "Source: ESOMAR, 2025. Caspr's buyer research.",
    },
  },
  {
    itemId: 'ci-0417-d2',
    versionN: 1,
    modelTier: 'haiku',
    researchBasis: ['portal-build-spec.md §3.3'],
    regeneratedAfter: null,
    respondsTo: {
      summary: 'A widely shared post about research reports whose citations lead nowhere.',
      illustrative: true,
    },
    body: {
      kind: 'linkedin',
      paragraphs: [
        'A citation that does not open is worse than no citation.',
        'It looks like proof, and it is not. Anyone who relies on a figure and finds its source empty does not conclude that a link broke. They conclude the figure was never sourced.',
        'So a source counts once it has been fetched and read, not when the field beside the claim has been filled in. A populated citation and a resolved one look identical on the page. Only one of them is evidence.',
      ],
      hashtags: [],
      link: null,
      attachment: null,
    },
    // A position, not a figure — so no source line, as on the house card it follows (§6.1).
    creative: {
      template: 'card',
      eyebrow: 'Citations',
      headline: 'A citation that does not open is worse than none',
      standfirst: 'A source counts once it has been fetched and read, not when the field beside the claim is filled in.',
      source: null,
    },
  },
];

/**
 * The words of the two discarded weekend posts — kept, because the history is of what was
 * written and not approved, not just that something was. Both figures are `index-engine.md`
 * §1; the point both make is its §2: "The finding is that nobody says so."
 */
export const REFERENCE_DAILY_HISTORY_POSTS: readonly PostVersion[] = [
  {
    itemId: 'ci-0416-d1',
    versionN: 1,
    modelTier: 'haiku',
    researchBasis: ['index-engine.md §1', 'index-engine.md §2'],
    regeneratedAfter: null,
    respondsTo: {
      summary: 'A post ranking copper producers by country from a single chart, without saying which stage it counted.',
      illustrative: true,
    },
    body: {
      kind: 'linkedin',
      paragraphs: [
        'Chile is the largest copper producer. China accounts for 48% of refined copper.',
        'Both are cited as copper production by country, and both are true. They count different stages: one what comes out of the mine, the other what comes out of the refinery.',
        'A ranking built on one and read as the other is not a rounding error. It names a different country.',
      ],
      hashtags: [],
      link: null,
      attachment: null,
    },
  },
  {
    itemId: 'ci-0415-d1',
    versionN: 1,
    modelTier: 'haiku',
    researchBasis: ['index-engine.md §1', 'index-engine.md §2'],
    regeneratedAfter: null,
    respondsTo: {
      summary: 'A thread comparing SaaS valuations across two reports without saying which revenue each multiple is based on.',
      illustrative: true,
    },
    body: {
      kind: 'x',
      posts: [
        "8.5x or 3.3x. Both are quoted as SaaS revenue multiples. One is on forward revenue, the other on trailing, and neither page says which. Source: Caspr's review of page-one market figures.",
      ],
      link: null,
      attachment: null,
    },
  },
];

const BY_ITEM = new Map(
  [...REFERENCE_POSTS, ...REFERENCE_DAILY_POSTS, ...REFERENCE_DAILY_HISTORY_POSTS].map((version) => [
    version.itemId,
    version,
  ]),
);

export function referencePostFor(itemId: string): PostVersion | undefined {
  return BY_ITEM.get(itemId);
}
