import { checkAdCopy, paidEngine, readAd } from '@caspr-portal/domain';
import type { Metadata } from 'next';
import Link from 'next/link';

import { State } from '@/components/primitives/state';
import { AdCard } from '@/components/performance/ad-card';
import { getRepository } from '@/lib/repository';

export const metadata: Metadata = { title: 'Performance — Tasks' };

/**
 * Performance ▸ Tasks — the ads that need a person.
 *
 * ⚑ **Rebuilt 2026-09-16.** This was a list of the four conditions the workstream waits on,
 * which was true and was not work: not one of them closes from here. Now that ads exist there
 * is real work, and it is the same shape as the content queue — approve, change it, or take
 * something down.
 *
 * Two kinds, and the order is the urgency. **Something a rule has fired on** is money moving
 * badly right now. **Something waiting on a decision** can be approved today even though
 * nothing spends until the gates open — and approving early is not premature, it is the only
 * way the ad set is ready on the day they do.
 */
export default async function PerformanceTasks() {
  const ads = await getRepository().ads();
  const engine = paidEngine();

  const firing = ads.filter((ad) => ad.metrics !== null && ['rewrite', 'pause'].includes(readAd(ad.metrics).verdict));
  const drafts = ads.filter((ad) => ad.state === 'draft');
  const blocked = drafts.filter((ad) => checkAdCopy(ad).some((problem) => problem.weight === 'blocking'));
  const clean = drafts.filter((ad) => !blocked.includes(ad));

  return (
    <div className="board">
      <p className="board-status t-meta">
        <span>{drafts.length} waiting on a decision</span>
        {blocked.length > 0 && <span className="text-attention">{blocked.length} blocked by their copy</span>}
        {firing.length > 0 && <span className="text-attention">{firing.length} a rule has fired on</span>}
        <span>{engine.met} of {engine.total} gates</span>
      </p>

      {firing.length > 0 && (
        <section aria-labelledby="firing-heading">
          <div className="board-head">
            <h3 id="firing-heading" className="t-title-m">
              A rule has fired <span className="board-count t-meta">{firing.length}</span>
            </h3>
            <span className="board-hint t-body-s">
              Rewrite it or take it down — never raise the bid, which buys more impressions of a message
              nobody wanted.
            </span>
          </div>
          <div className="ads">
            {firing.map((ad) => (
              <AdCard key={ad.id} ad={ad} />
            ))}
          </div>
        </section>
      )}

      {blocked.length > 0 && (
        <section aria-labelledby="blocked-heading">
          <div className="board-head">
            <h3 id="blocked-heading" className="t-title-m">
              Cannot be approved yet <span className="board-count t-meta">{blocked.length}</span>
            </h3>
            <span className="board-hint t-body-s">
              The copy breaks a rule that would be wrong in public with money behind it. Change it, and it
              comes back here.
            </span>
          </div>
          <div className="ads">
            {blocked.map((ad) => (
              <AdCard key={ad.id} ad={ad} />
            ))}
          </div>
        </section>
      )}

      <section aria-labelledby="drafts-heading">
        <div className="board-head">
          <h3 id="drafts-heading" className="t-title-m">
            Waiting on a decision <span className="board-count t-meta">{clean.length}</span>
          </h3>
          <span className="board-hint t-body-s">
            Approving is not premature. Nothing spends until all four gates hold — it is the only way the ad
            set is ready on the day they do.
          </span>
        </div>

        {clean.length === 0 ? (
          <State
            kind="empty"
            headline="Every ad has a decision."
            consequence="Finished, not unassigned. New ads arrive when an angle needs testing or a rule kills one."
          />
        ) : (
          <div className="ads">
            {clean.map((ad) => (
              <AdCard key={ad.id} ad={ad} />
            ))}
          </div>
        )}
      </section>

      <p className="t-body-s text-secondary" style={{ maxWidth: '72ch' }}>
        <Link className="t-label" href="/performance/ads">
          Every ad, filterable by placement and angle →
        </Link>
      </p>
    </div>
  );
}
