import {
  AD_BUDGET_MONTHLY,
  AD_KPI,
  AD_PLATFORM_LABEL,
  AD_PLATFORM_RULES,
  PAID_AND_P,
  STANCE_LIBRARY,
  X_GATE,
  checkAdCopy,
  readSpend,
  stance,
  type Ad,
  type AdPlatform,
  type StanceAngle,
} from '@caspr-portal/domain';
import type { Metadata, Route } from 'next';
import Link from 'next/link';

import { State } from '@/components/primitives/state';
import { Tile } from '@/components/primitives/tile';
import { AdCard } from '@/components/performance/ad-card';
import { getRepository } from '@/lib/repository';

export const metadata: Metadata = { title: 'Performance — Ads' };

interface PageProps {
  readonly searchParams: Promise<{ on?: string; angle?: string }>;
}

/**
 * Performance ▸ Ads — every ad, the angle it tests, and whether it is working.
 *
 * ⚑ **An ad here is an angle under test, not a unit of spend.** `channel-model.md` §3.6:
 * paid is *"a validation instrument, not an acquisition channel — its job is to find out
 * which message converts, cheaply, so the owned engine knows what to amplify."*
 *
 * ⚑ **Two reference panels came out 2026-09-16** — the campaign checklist and the nine
 * angles — and a filter went in where they were. The angles are still on every ad's header,
 * which is where they are useful; a list of nine was a thing to read once. `CAMPAIGN_CHECKLIST`
 * and `STANCE_LIBRARY` are unchanged and still exported.
 *
 * The filter is the workstream's own request: one row of pills to shuffle across every
 * placement and every angle, because *"different ads per place, different angle"* only reads
 * as a system if you can slice it both ways.
 */
export default async function PerformanceAds({ searchParams }: PageProps) {
  const params = await searchParams;
  const ads = await getRepository().ads();
  const spend = readSpend(ads, AD_BUDGET_MONTHLY);

  const onPlatform = AD_PLATFORM_RULES.some((rule) => rule.id === params.on)
    ? (params.on as AdPlatform)
    : null;
  const onAngle = STANCE_LIBRARY.some((row) => row.id === params.angle)
    ? (params.angle as StanceAngle)
    : null;
  const visible = ads.filter(
    (ad) => (onPlatform === null || ad.platform === onPlatform) && (onAngle === null || ad.angle === onAngle),
  );

  const drafts = ads.filter((ad) => ad.state === 'draft');
  const needFixing = drafts.filter((ad) => checkAdCopy(ad).some((problem) => problem.weight === 'blocking'));
  const filtered = onPlatform !== null || onAngle !== null;

  return (
    <div className="board">
      <div className="tiles">
        <Tile
          label="ANGLES UNDER TEST"
          value={`${spend.anglesTested} / ${spend.anglesTotal}`}
          attention={spend.anglesTested === 0}
          note="The stance library's nine. An angle with no reading is a message we still cannot tell the owned engine about."
        />
        <Tile
          label="SPENT"
          value={`$${spend.spend}`}
          note={`Of ~$${AD_BUDGET_MONTHLY} a month deployable. Nothing spends until all four gates hold.`}
        />
        <Tile
          label="COST A SIGNUP"
          value={spend.cac === null ? '—' : `$${Math.round(spend.cac)}`}
          attention={spend.cac !== null && spend.cac > 300}
          note="Against the $300 ceiling, agreed in advance. A threshold set mid-campaign is set by whoever wants it to keep running."
        />
        <Tile
          label="NEEDS A DECISION"
          value={String(drafts.length)}
          attention={drafts.length > 0}
          note={
            needFixing.length > 0
              ? `${needFixing.length} cannot be approved until the copy is fixed.`
              : 'Every draft is clean and can be approved.'
          }
        />
        {/*
          §1: every task declares which KPI it serves. This one answers it for the whole
          workstream, and the interesting half is the half that says no.
        */}
        <Tile
          label="SERVES"
          value={AD_KPI}
          note={`Revenue per $1 of spend, read against the x@${X_GATE} gate. ${PAID_AND_P}`}
        />
      </div>

      {/*
        ⚑ One row, not three. Nine angles as pills wrapped across three lines and the state
        row added a fourth — a filter bar taller than the first ad is not a filter bar, it is
        a menu. Placement stays as pills because there are five and they fit; the angle became
        a select because nine long labels never will.
      */}
      <nav className="pills" aria-label="Filter ads">
        <Pill active={onPlatform === null} params={params} drop="on" label="Every placement" count={ads.length} />
        {AD_PLATFORM_RULES.map((rule) => (
          <Pill
            key={rule.id}
            active={onPlatform === rule.id}
            params={params}
            set={{ on: rule.id }}
            label={AD_PLATFORM_LABEL[rule.id]}
            count={ads.filter((ad) => ad.platform === rule.id).length}
          />
        ))}
        <AngleFilter params={params} ads={ads} active={onAngle} />
      </nav>

      {/*
        ⚑ Added 2026-09-16, after a filtered URL read as "where did the other ads go".
        A filter that hides 17 of 18 rows and says so only in the label of a collapsed
        dropdown is a filter that looks like a bug. This line always says how many of the
        whole set are showing, and carries the way out.
      */}
      {filtered && (
        <p className="showing t-body-s">
          Showing <strong>{visible.length}</strong> of {ads.length} ads
          {onPlatform !== null && <> on {AD_PLATFORM_LABEL[onPlatform]}</>}
          {onAngle !== null && <> · {stance(onAngle).angle}</>}
          <Link className="showing__clear t-label" href="/performance/ads">
            Show every ad →
          </Link>
        </p>
      )}

      {visible.length === 0 ? (
        <State
          kind="empty"
          headline="Nothing matches that."
          consequence="Correctly empty for this combination. Clear a filter to see the rest of the ad set."
        />
      ) : filtered ? (
        <section aria-label="Filtered ads">
          <div className="ads">
            {visible.map((ad) => (
              <AdCard key={ad.id} ad={ad} />
            ))}
          </div>
        </section>
      ) : (
        AD_PLATFORM_RULES.map((rule) => (
          <PlatformSection key={rule.id} platform={rule.id} ads={visible.filter((ad) => ad.platform === rule.id)} />
        ))
      )}
    </div>
  );
}

/**
 * The angle filter, as links inside a disclosure.
 *
 * ⚑ Not a `<select>`. A native select would need JavaScript to navigate, and every other
 * filter in this console is a link — so a bookmarked or shared URL keeps the filter, and the
 * back button undoes it. A `<details>` gives the compactness of a dropdown with none of that
 * given up.
 */
function AngleFilter({
  params,
  ads,
  active,
}: {
  readonly params: Record<string, string | undefined>;
  readonly ads: readonly Ad[];
  readonly active: StanceAngle | null;
}) {
  return (
    <details className="drop">
      {/*
        `aria-current` when an angle is set, so a chosen filter looks chosen. Collapsed, this
        summary is the only thing on screen that says one is on.
      */}
      <summary
        className="pill drop__summary"
        aria-label="Filter ads by angle"
        aria-current={active === null ? undefined : 'true'}
      >
        {active === null ? 'Any angle' : stance(active).angle}
        <span className="pill__count">{active === null ? ads.length : ads.filter((ad) => ad.angle === active).length}</span>
      </summary>
      <div className="drop__menu">
        <Pill active={active === null} params={params} drop="angle" label="Any angle" count={ads.length} />
        {STANCE_LIBRARY.map((row) => (
          <Pill
            key={row.id}
            active={active === row.id}
            params={params}
            set={{ angle: row.id }}
            label={row.angle}
            count={ads.filter((ad) => ad.angle === row.id).length}
          />
        ))}
      </div>
    </details>
  );
}

/**
 * A filter pill that keeps the other filters.
 *
 * Every pill carries the current query forward and changes only its own key, so picking a
 * placement does not silently drop the angle somebody already chose — which is the whole
 * point of having two axes.
 */
function Pill({
  active,
  params,
  set,
  drop,
  label,
  count,
}: {
  readonly active: boolean;
  readonly params: Record<string, string | undefined>;
  readonly set?: Record<string, string>;
  readonly drop?: string;
  readonly label: string;
  readonly count: number;
  readonly href?: string;
}) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries({ ...params, ...(set ?? {}) })) {
    if (value !== undefined && key !== drop) query.set(key, value);
  }
  const suffix = query.toString();

  return (
    <Link
      className={count === 0 ? 'pill pill--empty' : 'pill'}
      href={`/performance/ads${suffix === '' ? '' : `?${suffix}`}` as Route}
      aria-current={active ? 'true' : undefined}
    >
      {label} <span className="pill__count">{count}</span>
    </Link>
  );
}

function PlatformSection({ platform, ads }: { readonly platform: AdPlatform; readonly ads: readonly Ad[] }) {
  const rule = AD_PLATFORM_RULES.find((candidate) => candidate.id === platform);
  if (rule === undefined) return null;

  return (
    <section className="board-part" aria-labelledby={`platform-${platform}`}>
      <h2 id={`platform-${platform}`} className="board-part__title">
        {AD_PLATFORM_LABEL[platform]} <span className="board-count t-meta">{ads.length}</span>
        {!rule.open && <span className="tag t-meta">Not open</span>}
      </h2>
      <p className="board-part__lede t-body-m">
        {rule.job} <span className="text-tertiary">{rule.standing}</span>
      </p>

      {ads.length === 0 ? (
        <State
          kind="empty"
          headline={`No ads built for ${AD_PLATFORM_LABEL[platform]}.`}
          consequence={rule.standing}
        />
      ) : (
        <div className="ads">
          {ads.map((ad) => (
            <AdCard key={ad.id} ad={ad} />
          ))}
        </div>
      )}
    </section>
  );
}
