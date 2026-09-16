'use client';

import {
  AD_PLATFORM_LABEL,
  AD_PROMPT_MAX,
  AD_STATE_LABEL,
  REEL_SECONDS,
  adCanvas,
  adMissing,
  canReviseAd,
  checkAdCopy,
  ctr,
  readAd,
  stance,
  type Ad,
} from '@caspr-portal/domain';
import { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';

import { moveAd, reviseAd, type AdActionState } from '@/app/(console)/performance/actions';
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
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const canvas = adCanvas(ad.platform);
  const problems = checkAdCopy(ad);
  const missing = adMissing(ad);

  /**
   * Everything the ad account asks for, in the order its form asks for it.
   *
   * Field labels included on purpose — a person pasting into three separate boxes needs to
   * know which block is which, and a wall of unlabelled lines is how a description ends up in
   * a headline field.
   */
  async function copyAll() {
    const lines = [
      `${AD_PLATFORM_LABEL[ad.platform]} · ${stance(ad.angle).angle} · ${ad.icp}`,
      '',
      ...(ad.copy.headlines.length > 0 ? ['HEADLINES', ...ad.copy.headlines, ''] : []),
      ...(ad.copy.descriptions.length > 0 ? ['DESCRIPTIONS', ...ad.copy.descriptions, ''] : []),
      ...(ad.copy.primary === null ? [] : ['PRIMARY TEXT', ad.copy.primary, '']),
      ...(ad.copy.hashtags.length > 0 ? ['HASHTAGS', ad.copy.hashtags.join(' '), ''] : []),
      `FINAL URL  https://caspr.ai${ad.copy.landingPath}`,
    ];
    try {
      await navigator.clipboard.writeText(lines.join('\n'));
      setCopied(true);
    } catch {
      // Clipboard access can be refused. Everything here is on screen and selectable, so
      // this says what happened rather than pretending it worked.
      setCopied(false);
    }
  }
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
          {ad.platform === 'google_search' ? (
            <SearchPreview ad={ad} />
          ) : ad.platform === 'linkedin' ? (
            <LinkedInPreview ad={ad} />
          ) : (
            <SocialPreview ad={ad} />
          )}
          <p className="ad__where t-meta text-tertiary">
            → {ad.copy.landingPath}
            {canvas !== null && ad.creative !== null && (
              <>
                {' · '}
                {canvas.width} × {canvas.height}
              </>
            )}
          </p>

          {ad.video !== undefined && (
            <div className={ad.video.cut === null ? 'vid vid--uncut' : 'vid'}>
              <p className="vid__head t-meta">
                {ad.video.cut === null ? 'No cut yet' : 'Cut'} · {ad.video.seconds}s vertical ·{' '}
                {REEL_SECONDS.min}–{REEL_SECONDS.max}s
              </p>
              <p className="t-body-s">{ad.video.script}</p>
              <p className="t-body-s text-tertiary">{ad.video.captions}</p>
              {ad.video.cut === null && (
                <p className="t-body-s text-attention">
                  The image above is the cover frame, not the ad. The engine writes the script and the
                  caption; the DM team&rsquo;s editor makes the cut — and this cannot go live until they do.
                </p>
              )}
            </div>
          )}

          <p className="t-body-s text-secondary">{ad.note}</p>

          {missing.length > 0 && (
            <p className="t-body-s text-attention">Cannot run — {missing.join(' · ')}.</p>
          )}

          {ad.revision !== undefined && (
            <p className="ad__revision t-body-s">
              <span className="t-meta">Change asked for {ad.revision.at}</span> &ldquo;{ad.revision.note}&rdquo;
              <span className="text-tertiary">
                {' '}
                — ⑩ the Writer is not built yet, so the instruction is recorded and the ad waits here.
              </span>
            </p>
          )}

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
        </div>

        {/*
          The decisions in a column beside the ad, the same shape the post queue uses. A row
          of buttons under a creative puts the decision below the fold on anything taller than
          a search result, and this is the screen a person works down.
        */}
        <div className="decide__rail" role="group" aria-label="Decide this ad">
          {ad.state === 'draft' && (
            <Move action={action} id={ad.id} to="approved" label="Approve" kind="approve" disabled={blocking.length > 0} />
          )}
          {/*
            ⚑ Publish, not "set live". No ad API is connected, so publishing is a person
            pasting this into the ad account — the same honesty the engagement queue uses for
            one tap. The button copies the copy first, so the paste is already loaded.
          */}
          {ad.state === 'approved' && (
            <Move
              action={action}
              id={ad.id}
              to="live"
              label="Publish"
              kind="primary"
              onBefore={copyAll}
              disabled={missing.length > 0}
            />
          )}
          {ad.state === 'live' && <Move action={action} id={ad.id} to="paused" label="Pause" kind="reject" />}
          {ad.state === 'paused' && (
            <>
              <Move action={action} id={ad.id} to="live" label="Resume" kind="approve" onBefore={copyAll} />
              <Move action={action} id={ad.id} to="killed" label="Kill this angle" kind="reject" />
            </>
          )}

          <button type="button" className="btn" onClick={copyAll}>
            {copied ? 'Copied' : 'Copy the copy'}
          </button>

          {ad.creative !== null && (
            <a className="btn" href={`/api/ad-creatives/${ad.id}?download=1`} download>
              Download image
            </a>
          )}

          {canReviseAd(ad.state) && (
            <button
              type="button"
              className={open ? 'btn btn--active' : 'btn'}
              aria-expanded={open}
              aria-controls={`revise-${ad.id}`}
              onClick={() => setOpen((was) => !was)}
            >
              Change it…
            </button>
          )}
        </div>
      </div>

      {ad.state === 'draft' && blocking.length > 0 && (
        <p className="ad__blocked t-body-s">
          {blocking.length} blocking {blocking.length === 1 ? 'problem' : 'problems'} — fix the copy before
          this can be approved.
        </p>
      )}

      {ad.state === 'killed' && (
        <p className="ad__blocked t-body-s text-tertiary">
          Killed. The angle is a finding — it does not come back, and the owned engine should know.
        </p>
      )}

      {open && <RevisePanel ad={ad} onDone={() => setOpen(false)} />}

      {state.errors.length > 0 && (
        <p className="ad__error t-body-s" role="alert">
          {state.errors.join(' ')}
        </p>
      )}
    </article>
  );
}

/**
 * Say what to change, and the ad is rebuilt.
 *
 * ⚑ **The reviewer never types the ad.** They type an instruction; the writer rewrites
 * against the claims register; the rebuilt ad comes back through the same approval. Money
 * behind a placement is exactly the wrong place for a human to paste unchecked copy.
 */
function RevisePanel({ ad, onDone }: { readonly ad: Ad; readonly onDone: () => void }) {
  const [state, action] = useActionState(reviseAd, INITIAL);
  const [note, setNote] = useState('');

  return (
    <form
      id={`revise-${ad.id}`}
      className="reject revise"
      action={(formData) => {
        action(formData);
        onDone();
      }}
    >
      <input type="hidden" name="adId" value={ad.id} />
      <div className="revise__body">
        <p className="t-meta reject__legend">Change it</p>
        <p className="revise__lede t-body-s">
          Say what to change. The ad is rebuilt from your words and comes back for the same approval — you
          never type the ad itself.
          {ad.state === 'live' && ' It comes down while it is rebuilt: what is running is no longer what was approved.'}
        </p>

        <label className="reject__note">
          <textarea
            name="note"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            maxLength={AD_PROMPT_MAX}
            required
            rows={3}
            placeholder="Lead on the four-hours line instead of the price. Keep the $100 free callout."
          />
        </label>

        <div className="reject__actions">
          <ReviseSubmit />
          <button type="button" className="btn" onClick={onDone}>
            Cancel
          </button>
          <span className={note.length > AD_PROMPT_MAX - 40 ? 'revise__count revise__count--near t-meta' : 'revise__count t-meta'}>
            {note.length} / {AD_PROMPT_MAX}
          </span>
        </div>

        {state.errors.length > 0 && (
          <p className="ad__error t-body-s" role="alert">
            {state.errors.join(' ')}
          </p>
        )}
      </div>
    </form>
  );
}

function ReviseSubmit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn btn--primary" disabled={pending}>
      {pending ? 'Sending' : 'Send to the writer'}
    </button>
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

/**
 * A sponsored LinkedIn post: the company line, the copy, a 1.91:1 image, then the strip.
 *
 * Its own greys, for the same reason the other two use theirs — approving it in the house
 * palette would hide how it reads where it appears.
 */
function LinkedInPreview({ ad }: { readonly ad: Ad }) {
  return (
    <div className="liad">
      <div className="liad__head">
        <span className="liad__mark">C.</span>
        <span>
          <span className="liad__name">Caspr</span>
          <span className="liad__sub t-body-s">Promoted</span>
        </span>
      </div>
      <p className="liad__primary">{ad.copy.primary}</p>
      {ad.creative !== null && (
        /* Already exactly 1200 × 628 from the renderer — next/image would re-encode it. */
        <img className="liad__image" src={`/api/ad-creatives/${ad.id}`} alt={ad.creative.headline} />
      )}
      <div className="liad__strip">
        <span className="liad__headline">{ad.copy.headlines[0]}</span>
        <span className="liad__desc t-body-s">
          caspr.ai · {ad.copy.descriptions[0]}
        </span>
      </div>
      {ad.copy.hashtags.length > 0 && <p className="liad__tags t-body-s">{ad.copy.hashtags.join(' ')}</p>}
    </div>
  );
}

/** A feed post, as Meta renders it: primary text, image, then the headline strip. */
function SocialPreview({ ad }: { readonly ad: Ad }) {
  const vertical = ad.platform === 'meta_reel';
  return (
    <div className={vertical ? 'feedad feedad--reel' : 'feedad'}>
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
  onBefore,
}: {
  readonly action: (formData: FormData) => void;
  readonly id: string;
  readonly to: string;
  readonly label: string;
  readonly kind: 'approve' | 'reject' | 'primary';
  readonly disabled?: boolean;
  /** Runs as the move commits — Publish loads the clipboard on its way past. */
  readonly onBefore?: () => void;
}) {
  return (
    <form
      action={(formData) => {
        onBefore?.();
        action(formData);
      }}
    >
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
