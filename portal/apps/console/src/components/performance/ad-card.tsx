'use client';

import {
  AD_PLATFORM_LABEL,
  AD_STATE_LABEL,
  checkAdCopy,
  ctr,
  platformRule,
  readAd,
  stance,
  type Ad,
} from '@caspr-portal/domain';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

import { moveAd, type AdActionState } from '@/app/(console)/performance/actions';
import { Icon } from '@/components/icons';

const INITIAL: AdActionState = { errors: [] };

/**
 * One ad: the angle it tests, how it reads, what it costs, and what to do about it.
 *
 * ⚑ **The ad is shown as the placement shows it**, the same principle the post previews
 * follow — a search ad as three headlines and two descriptions, a Meta ad as an image with
 * primary text above it. A reviewer approving a rendering of the thing is approving the
 * thing; a reviewer approving a table of fields is approving their own imagination of it.
 *
 * **Blocking copy problems disable approval.** An exclamation point, a named competitor, the
 * budget written as a subscription price — those are not opinions, and letting somebody
 * approve past them would make the check decorative.
 */
export function AdCard({ ad }: { readonly ad: Ad }) {
  const [state, action] = useActionState(moveAd, INITIAL);
  const rule = platformRule(ad.platform);
  const problems = checkAdCopy(ad);
  const blocking = problems.filter((problem) => problem.weight === 'blocking');
  const reading = readAd(ad.metrics);

  return (
    <article className={`ad ad--${ad.state}`} aria-label={`${AD_PLATFORM_LABEL[ad.platform]}: ${ad.copy.headlines[0] ?? ad.id}`}>
      <header className="ad__head">
        <span className="t-meta-bold">{AD_PLATFORM_LABEL[ad.platform]}</span>
        <span className="t-meta">{stance(ad.angle).angle}</span>
        <span className="t-meta text-tertiary">{ad.icp}</span>
        <span className={`tag tag--${ad.state} t-meta`}>{AD_STATE_LABEL[ad.state]}</span>
      </header>

      <div className="ad__body">
        <div className="ad__preview">
          {ad.platform === 'google_search' ? <SearchPreview ad={ad} /> : <SocialPreview ad={ad} />}
          <p className="ad__where t-meta text-tertiary">
            → {ad.copy.landingPath} · {rule.job}
          </p>
        </div>

        <div className="ad__side">
          <p className="t-body-s text-secondary">{ad.note}</p>

          {ad.metrics !== null && (
            <div className={reading.verdict === 'working' ? 'ad__reading ad__reading--ok' : 'ad__reading'}>
              <p className="t-meta">{reading.rule === null ? 'Reading' : reading.rule}</p>
              <p className="t-body-m">{reading.says}</p>
              <p className="t-body-s text-secondary">{reading.act}</p>
              <p className="ad__numbers t-meta text-tertiary">
                {ad.metrics.impressions.toLocaleString('en-US')} impressions ·{' '}
                {ad.metrics.clicks} clicks · {(ctr(ad.metrics) * 100).toFixed(2)}% ·{' '}
                {ad.metrics.conversions} signups · ${ad.metrics.spend}
              </p>
            </div>
          )}

          {problems.length > 0 && (
            <div className="ad__problems">
              <p className="t-meta text-attention">
                <Icon name="alert" size={13} /> {problems.length} before it can run
              </p>
              {problems.map((problem) => (
                <div key={`${problem.field}-${problem.what}`} className="ad__problem">
                  <p className="t-body-s">
                    {problem.field} — {problem.what}
                  </p>
                  <p className="t-body-s text-tertiary">{problem.fix}</p>
                </div>
              ))}
            </div>
          )}

          <div className="ad__act">
            {ad.state === 'draft' && (
              <>
                <Move action={action} id={ad.id} to="approved" label="Approve" kind="approve" disabled={blocking.length > 0} />
                <span className="t-body-s text-tertiary">
                  {blocking.length > 0
                    ? `${blocking.length} blocking ${blocking.length === 1 ? 'problem' : 'problems'} — fix the copy first.`
                    : 'Approved ads wait for the gates. Nothing spends today.'}
                </span>
              </>
            )}
            {ad.state === 'approved' && <Move action={action} id={ad.id} to="live" label="Set live" kind="primary" />}
            {ad.state === 'live' && (
              <Move action={action} id={ad.id} to="paused" label="Pause" kind="reject" />
            )}
            {ad.state === 'paused' && (
              <>
                <Move action={action} id={ad.id} to="live" label="Resume" kind="approve" />
                <Move action={action} id={ad.id} to="killed" label="Kill this angle" kind="reject" />
              </>
            )}
            {ad.state === 'killed' && (
              <span className="t-body-s text-tertiary">
                Killed. The angle is a finding — it does not come back, and the owned engine should know.
              </span>
            )}
          </div>

          {state.errors.length > 0 && (
            <p className="ad__error t-body-s" role="alert">
              {state.errors.join(' ')}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}

/** A search result, as Google renders it. */
function SearchPreview({ ad }: { readonly ad: Ad }) {
  return (
    <div className="serp">
      <p className="serp__url">
        <span className="serp__badge">Sponsored</span> caspr.ai{ad.copy.landingPath}
      </p>
      <p className="serp__title">{ad.copy.headlines.join(' | ')}</p>
      <p className="serp__desc">{ad.copy.descriptions.join(' ')}</p>
    </div>
  );
}

/** A feed post, as Meta renders it: primary text, image, then the headline strip. */
function SocialPreview({ ad }: { readonly ad: Ad }) {
  return (
    <div className="feedad">
      <p className="feedad__primary">{ad.copy.primary}</p>
      {ad.creative !== null && (
        /*
         * A plain <img>, not next/image. The renderer already returns a PNG at exactly the
         * canvas Meta wants, and next/image would proxy and re-encode a picture that is
         * already the right size — for an ad creative that is a round trip through a
         * compressor for no gain.
         */
        <img className="feedad__image" src={`/api/ad-creatives/${ad.id}`} alt={ad.creative.headline} />
      )}
      <div className="feedad__strip">
        <span className="feedad__domain t-meta">CASPR.AI</span>
        <span className="feedad__headline">{ad.copy.headlines[0]}</span>
        <span className="feedad__desc t-body-s">{ad.copy.descriptions[0]}</span>
      </div>
      {ad.copy.hashtags.length > 0 && (
        <p className="feedad__tags t-body-s">{ad.copy.hashtags.join(' ')}</p>
      )}
    </div>
  );
}

function Move({
  action,
  id,
  to,
  label,
  kind,
  disabled = false,
}: {
  readonly action: (formData: FormData) => void;
  readonly id: string;
  readonly to: string;
  readonly label: string;
  readonly kind: 'approve' | 'reject' | 'primary';
  readonly disabled?: boolean;
}) {
  return (
    <form action={action}>
      <input type="hidden" name="adId" value={id} />
      <input type="hidden" name="to" value={to} />
      <Submit label={label} kind={kind} disabled={disabled} />
    </form>
  );
}

function Submit({
  label,
  kind,
  disabled,
}: {
  readonly label: string;
  readonly kind: 'approve' | 'reject' | 'primary';
  readonly disabled: boolean;
}) {
  const { pending } = useFormStatus();
  const className = kind === 'approve' ? 'btn btn--approve' : kind === 'reject' ? 'btn btn--reject' : 'btn btn--primary';
  return (
    <button type="submit" className={className} disabled={pending || disabled} aria-disabled={pending || disabled}>
      {pending ? 'Saving' : label}
    </button>
  );
}
