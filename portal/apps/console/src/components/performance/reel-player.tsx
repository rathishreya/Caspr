'use client';

import { REEL_SECONDS, checkVideo, frameAt, frameDuration, type Ad, type AdVideo } from '@caspr-portal/domain';
import { useEffect, useRef, useState } from 'react';

import { Icon } from '@/components/icons';

/**
 * The reel, playing.
 *
 * ⚑ **This is not an MP4 and does not pretend to be one.** ⑪ is explicit — *"video editing,
 * the DM team's editor owns this"* — so there is no cut, and inventing a video file here would
 * be inventing the one artefact this engine cannot make.
 *
 * What it is instead is the **storyboard, played at its real timings**: every frame drawn by
 * the same generator on the same vertical canvas, held for the seconds the script gives it,
 * with the line that plays over it. That is a thing an editor can cut from and a reviewer can
 * judge — which a cover frame is not, because a reel's whole argument is the order.
 *
 * **Drawn as Meta draws a reel, not as a feed post.** A reel has no white card: the video is
 * full-bleed, the primary text sits over the bottom of it, and the call to action is a bar
 * beneath. The feed preview's card would have been the wrong placement rendered confidently.
 *
 * Everything below the CTA bar is the console's, not the ad's — controls, the filmstrip, the
 * standing on the cut — and it is outside the rendering for that reason.
 *
 * ⚠ **A deliberate departure from §14.2 rule 1**, "no transitions, no motion". That rule is
 * about the interface, and it is right: a table that animates wastes a reader's attention.
 * This is not the interface — it is the artefact, and the artefact moves. Nothing else on this
 * screen does, it plays only when asked, and it never loops on its own.
 */
export function ReelPlayer({ ad, video }: { readonly ad: Ad; readonly video: AdVideo }) {
  const [second, setSecond] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const index = frameAt(video, second);
  const frame = video.frames[index];
  const problems = checkVideo(video);

  useEffect(() => {
    if (!playing) return;
    // Quarter-second ticks: fine enough for a three-second hold, coarse enough that a long
    // reel is not a thousand renders.
    timer.current = setInterval(() => {
      setSecond((was) => {
        const next = was + 0.25;
        if (next >= video.seconds) {
          setPlaying(false);
          return 0;
        }
        return next;
      });
    }, 250);
    return () => {
      if (timer.current !== null) clearInterval(timer.current);
    };
  }, [playing, video.seconds]);

  return (
    <div className="reel">
      <div className="reel__stage">
        {/* The frame is a PNG from the same route every other creative uses — one generator. */}
        <img
          className="reel__frame"
          src={`/api/ad-creatives/${ad.id}?frame=${index}`}
          alt={frame === undefined ? 'Reel frame' : `${frame.headline}. ${frame.support}`}
        />

        {/* A progress bar, because a reel has one and it is how anybody reads the pacing. */}
        <div className="reel__progress" aria-hidden="true">
          <span style={{ width: `${Math.min(100, (second / video.seconds) * 100)}%` }} />
        </div>

        {frame !== undefined && (
          // Burned in, because §9.3 specifies captions and most of this feed is muted.
          <p className="reel__caption">{frame.line}</p>
        )}

        <div className="reel__overlay">
          <p className="reel__account">Caspr</p>
          <p className="reel__primary">{ad.copy.primary}</p>
          {ad.copy.hashtags.length > 0 && <p className="reel__tags">{ad.copy.hashtags.join(' ')}</p>}
        </div>
      </div>

      {/* Meta's own CTA bar, which is where a reel ad's headline actually appears. */}
      <div className="reel__cta">
        <span className="reel__cta-head">{ad.copy.headlines[0]}</span>
        <span className="reel__cta-btn">Sign up</span>
      </div>

      <div className="reel__controls">
        <button
          type="button"
          className="btn btn--primary"
          onClick={() => {
            if (second >= video.seconds) setSecond(0);
            setPlaying((was) => !was);
          }}
        >
          {playing ? 'Pause' : second > 0 ? 'Resume' : 'Play'}
        </button>
        <span className="reel__time t-data-m">
          {second.toFixed(1)}s / {video.seconds}s
        </span>
        <span className="t-meta text-tertiary">
          Frame {index + 1} of {video.frames.length} · holds {frameDuration(video, index)}s
        </span>
      </div>

      {/* The filmstrip is the scrubber: each frame is as wide on it as it is long in the cut. */}
      <div className="reel__strip" role="group" aria-label="Frames">
        {video.frames.map((row, i) => (
          <button
            key={row.at}
            type="button"
            className={i === index ? 'reel__cell reel__cell--on' : 'reel__cell'}
            style={{ flexGrow: frameDuration(video, i) }}
            onClick={() => {
              setPlaying(false);
              setSecond(row.at);
            }}
          >
            <span className="t-meta">{row.at}s</span>
            <span className="reel__cell-head t-body-s">{row.headline}</span>
          </button>
        ))}
      </div>

      {video.cut === null && (
        <p className="reel__note t-body-s">
          <Icon name="alert" size={13} /> The storyboard at its real timings, not the cut. The engine writes
          the script and draws every frame; the DM team&rsquo;s editor makes the video — and this cannot go
          live until they do.
        </p>
      )}

      {problems.length > 0 && (
        <p className="reel__note t-body-s text-attention">
          {problems.join(' · ')}. A micro-cut runs {REEL_SECONDS.min}–{REEL_SECONDS.max}s.
        </p>
      )}
    </div>
  );
}
