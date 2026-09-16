import {
  AD_BUDGET_MONTHLY,
  AD_PLATFORM_LABEL,
  AD_PLATFORM_RULES,
  CAMPAIGN_CHECKLIST,
  STANCE_LIBRARY,
  checkAdCopy,
  readAd,
  readSpend,
  type Ad,
  type AdPlatform,
} from '@caspr-portal/domain';
import type { Metadata } from 'next';

import { State } from '@/components/primitives/state';
import { Tile } from '@/components/primitives/tile';
import { AdCard } from '@/components/performance/ad-card';
import { getRepository } from '@/lib/repository';

export const metadata: Metadata = { title: 'Performance — Ads' };

/**
 * Performance ▸ Ads — every ad, the angle it tests, and whether it is working.
 *
 * ⚑ **An ad here is an angle under test, not a unit of spend.** `channel-model.md` §3.6:
 * paid is *"a validation instrument, not an acquisition channel — its job is to find out
 * which message converts, cheaply, so the owned engine knows what to amplify."* At ~$850
 * deployable it buys about ten signups a month, which is real and is never the funnel.
 *
 * So the screen is organised by **placement**, and every ad names the stance-library angle it
 * is testing. Nine angles, and the count of them that have a reading is the number this
 * workstream is actually judged on — more than the signups are.
 */
export default async function PerformanceAds() {
  const ads = await getRepository().ads();
  const spend = readSpend(ads, AD_BUDGET_MONTHLY);

  const drafts = ads.filter((ad) => ad.state === 'draft');
  const needFixing = drafts.filter((ad) => checkAdCopy(ad).some((problem) => problem.weight === 'blocking'));
  const notWorking = ads.filter((ad) => ['rewrite', 'pause'].includes(readAd(ad.metrics).verdict) && ad.metrics !== null);

  return (
    <div className="board">
      <p className="lede t-body-m">
        Paid is a validation instrument. Its job is to find out which message converts, cheaply, so the
        owned engine knows what to amplify — which is why every ad here names the angle it is testing, and
        why nine angles matter more than ten signups.
      </p>

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
      </div>

      {notWorking.length > 0 && (
        <section aria-labelledby="notworking-heading">
          <div className="board-head">
            <h3 id="notworking-heading" className="t-title-m">
              Not working <span className="board-count t-meta">{notWorking.length}</span>
            </h3>
            <span className="board-hint t-body-s">
              A rule has fired. Rewrite the ad or pause it — never raise the bid, which buys more impressions
              of a message nobody wanted.
            </span>
          </div>
          <div className="ads">
            {notWorking.map((ad) => (
              <AdCard key={ad.id} ad={ad} />
            ))}
          </div>
        </section>
      )}

      {AD_PLATFORM_RULES.map((rule) => (
        <PlatformSection key={rule.id} platform={rule.id} ads={ads.filter((ad) => ad.platform === rule.id)} />
      ))}

      <section className="panel panel--wide">
        <div className="panel__title">
          <h2 className="t-title-m">On every campaign, before a dollar moves</h2>
          <span className="t-meta text-tertiary">FREE, CONTROLLABLE, AND IT IS WHAT PRODUCES THE MULTI-SECTION LOOK</span>
        </div>
        <div className="stack">
          {CAMPAIGN_CHECKLIST.map((check) => (
            <div key={check.id} className="stack-row">
              <p className="t-body-s">{check.what}</p>
              <p className="t-body-s text-secondary">{check.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="panel panel--wide">
        <div className="panel__title">
          <h2 className="t-title-m">The nine angles</h2>
          <span className="t-meta text-tertiary">THE SAME LIBRARY THE DRAFTS DRAW FROM</span>
        </div>
        <p className="t-body-s text-secondary" style={{ maxWidth: '72ch' }}>
          An ad testing a claim the conversation engine may not make would be testing something we could
          never then amplify. Same library, same claims register.
        </p>
        <div className="angles">
          {STANCE_LIBRARY.map((row) => {
            const tested = ads.filter((ad) => ad.angle === row.id);
            const live = tested.filter((ad) => ad.metrics !== null).length;
            return (
              <div key={row.id} className={live > 0 ? 'angle angle--tested' : 'angle'}>
                <p className="t-body-m">{row.angle}</p>
                <p className="t-meta text-tertiary">
                  {tested.length === 0
                    ? 'No ad on it'
                    : live > 0
                      ? `${live} reading${live === 1 ? '' : 's'}`
                      : `${tested.length} drafted, none run`}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
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
