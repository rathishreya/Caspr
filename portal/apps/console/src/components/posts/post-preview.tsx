import { voiceLane, type ContentItem, type ExternalPost, type PostAttachment, type PostLink, type PostVersion } from '@caspr-portal/domain';
import type { ReactNode } from 'react';

import { authorOf } from '@/lib/platforms';

export type PreviewMode = 'light' | 'dark';

/**
 * The post, exactly as the platform will show it.
 *
 * Asked for directly, 2026-09-15: "I want to see the exact post that we are going to post,
 * in that same way." So each channel is drawn in its own interface — LinkedIn's card and
 * fold, X's post and thread line, a Reddit comment under its thread, the caspr.ai article —
 * with nothing of the console's on it.
 *
 * `mode` carries design spec §2 into the platform's own language: light while the post
 * waits on a decision, dark once it does not. Every platform here has both.
 */
export function PostPreview({
  item,
  version,
  mode,
}: {
  readonly item: ContentItem;
  readonly version: PostVersion;
  readonly mode: PreviewMode;
}) {
  const { body } = version;
  const author = authorOf(item);
  const lane = item.voiceLane === null ? undefined : voiceLane(item.voiceLane);

  switch (body.kind) {
    case 'linkedin':
      return (
        <Stage platform="linkedin" mode={mode}>
          <LinkedInCard
            foldId={`fold-${item.id}`}
            name={lane?.fullName ?? author.name}
            headline={lane?.headline ?? null}
            company={item.voiceLane === null}
            when="Now"
            paragraphs={body.paragraphs}
            hashtags={body.hashtags}
            attachment={body.attachment}
            link={body.link}
          />
        </Stage>
      );

    case 'x':
      return (
        <Stage platform="x" mode={mode}>
          <article className="pv pv-x" aria-label="Post on X">
            {body.posts.map((text, index) => (
              <div key={index} className="pv-x__post">
                <div className="pv-x__rail">
                  <span className="pv-x__avatar" aria-hidden="true">
                    C<span className="pv-li__dot">.</span>
                  </span>
                  {index < body.posts.length - 1 && <span className="pv-x__thread" aria-hidden="true" />}
                </div>
                <div className="pv-x__body">
                  <div className="pv-x__head">
                    <span className="pv-x__name">Caspr</span>
                    <span className="pv-x__muted">· now</span>
                  </div>
                  <p className="pv-x__text">{text}</p>
                  {index === body.posts.length - 1 && body.attachment !== null && (
                    <div className="pv-x__card">
                      <div className="pv-x__card-media">{pendingVisual(body.attachment)}</div>
                    </div>
                  )}
                  {index === body.posts.length - 1 && body.link !== null && (
                    <div className="pv-x__card">
                      <div className="pv-x__card-media">{hostOf(body.link)}</div>
                      <div className="pv-x__card-body">{body.link.label}</div>
                    </div>
                  )}
                  <XActions />
                </div>
              </div>
            ))}
          </article>
        </Stage>
      );

    case 'blog':
      return (
        <Stage platform="blog" mode={mode}>
          <article className="pv pv-blog" aria-label="Article on caspr.ai">
            <div className="pv-blog__bar">
              <span className="pv-blog__mark">
                Caspr<span className="pv-blog__mark-dot">.</span>
              </span>
              <span className="pv-blog__nav">Blog</span>
            </div>
            <div className="pv-blog__page">
              <p className="pv-blog__crumb">caspr.ai / blog / {body.slug}</p>
              <h3 className="pv-blog__title">{body.headline}</h3>
              <p className="pv-blog__dek">{body.standfirst}</p>
              <div className="pv-blog__body">
                {body.paragraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
              <p className="pv-blog__cta">{body.cta}</p>
            </div>
          </article>
        </Stage>
      );

    case 'community': {
      const [site, place] = body.venue.split(' · ');
      const reddit = site === 'Reddit';
      return (
        <Stage platform="community" mode={mode}>
          <article className="pv pv-rd" aria-label={`Reply on ${site}`}>
            <div className="pv-rd__venue">{reddit ? place : body.venue}</div>
            <h3 className="pv-rd__title">{body.threadQuestion}</h3>
            {body.illustrative && <span className="pv-rd__stand-in">Stand-in thread — no listener runs yet</span>}
            <div className="pv-rd__comment">
              <span className="pv-rd__avatar" aria-hidden="true">
                {author.name.slice(0, 1)}
              </span>
              <div>
                <div className="pv-rd__meta">
                  <span className="pv-rd__user">{author.name}</span> · just now · posted by hand
                </div>
                <div className="pv-rd__text">
                  {body.paragraphs.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
                <div className="pv-rd__actions" aria-hidden="true">
                  <span>▲ Vote ▼</span>
                  <span>Reply</span>
                  <span>Share</span>
                </div>
              </div>
            </div>
          </article>
        </Stage>
      );
    }
  }
}

/**
 * Someone else's post — for a comment target, a tag or a reshare.
 *
 * Always the platform's dark mode: it is not ours to approve (§2).
 */
export function ExternalPostPreview({
  post,
  now,
  reshareOf,
}: {
  readonly post: ExternalPost;
  readonly now: Date;
  /** For a reshare: the words are theirs; the post underneath is ours. */
  readonly reshareOf?: string;
}) {
  const paragraphs = post.text.trim().length === 0 ? [] : post.text.split(/\n{2,}/);
  return (
    <Stage platform="linkedin" mode="dark">
      <LinkedInCard
        foldId={`fold-${post.id}`}
        name={post.author}
        headline={post.authorDetail}
        company={post.authorIsCompany}
        initials={post.authorIsCompany ? post.author.slice(0, 1) : initialsOf(post.author)}
        when={relativeTime(post.postedAt, now)}
        paragraphs={paragraphs}
        hashtags={[]}
        attachment={null}
        link={null}
        embedded={reshareOf}
      />
    </Stage>
  );
}

function Stage({
  platform,
  mode,
  children,
}: {
  readonly platform: 'linkedin' | 'x' | 'blog' | 'community';
  readonly mode: PreviewMode;
  readonly children: ReactNode;
}) {
  return (
    <div className={`pv-stage pv-stage--${platform}${mode === 'dark' ? ' pv-stage--dark' : ''}`}>{children}</div>
  );
}

/** Lines the text will take at LinkedIn's feed width, counting the blank line between paragraphs. */
function estimatedLines(paragraphs: readonly string[], extraLines: number): number {
  const CHARS_PER_LINE = 68;
  const text = paragraphs.reduce((sum, p) => sum + Math.max(1, Math.ceil(p.length / CHARS_PER_LINE)), 0);
  return text + Math.max(0, paragraphs.length - 1) + extraLines;
}

function LinkedInCard({
  foldId,
  name,
  headline,
  company,
  initials,
  when,
  paragraphs,
  hashtags,
  attachment,
  link,
  embedded,
}: {
  readonly foldId: string;
  readonly name: string;
  readonly headline: string | null;
  readonly company: boolean;
  readonly initials?: string;
  readonly when: string;
  readonly paragraphs: readonly string[];
  readonly hashtags: readonly string[];
  readonly attachment: PostAttachment | null;
  readonly link: PostLink | null;
  readonly embedded?: string;
}) {
  const folds = estimatedLines(paragraphs, hashtags.length > 0 ? 2 : 0) > 3;
  const isCaspr = company && name === 'Caspr';
  // Square for any company, as LinkedIn draws it. The wordmark serif is Caspr's alone —
  // another company's initial in it would read as one of ours.
  const avatarClass = isCaspr
    ? 'pv-li__avatar pv-li__avatar--company pv-li__avatar--caspr'
    : company
      ? 'pv-li__avatar pv-li__avatar--company'
      : 'pv-li__avatar';

  return (
    <article className="pv pv-li" aria-label={`LinkedIn post by ${name}`}>
      <header className="pv-li__head">
        <span className={avatarClass} aria-hidden="true">
          {isCaspr ? (
            <>
              C<span className="pv-li__dot">.</span>
            </>
          ) : (
            (initials ?? initialsOf(name))
          )}
        </span>
        <span className="pv-li__who">
          <span className="pv-li__name">{name}</span>
          {headline !== null && <span className="pv-li__headline">{headline}</span>}
          <span className="pv-li__meta">
            {when} • <Globe />
          </span>
        </span>
        <span className="pv-li__dots" aria-hidden="true">
          ···
        </span>
      </header>

      {paragraphs.length > 0 && (
        <div className="pv-li__textwrap">
          {folds && <input id={foldId} type="checkbox" className="pv-li__toggle" aria-label="Show the whole post" />}
          <p className={folds ? 'pv-li__text pv-li__text--fold' : 'pv-li__text'}>
            {withMentions(paragraphs.join('\n\n'))}
            {hashtags.length > 0 && '\n\n'}
            {hashtags.map((tag, index) => (
              <span key={tag}>
                {index > 0 && ' '}
                <span className="pv-li__tag">#{tag}</span>
              </span>
            ))}
          </p>
          {folds && (
            <label htmlFor={foldId} className="pv-li__more">
              …more
            </label>
          )}
        </div>
      )}

      {embedded !== undefined && (
        <div className="pv-li__card">
          <div className="pv-li__card-body">
            <span className="pv-li__card-host">Reshared from Caspr</span>
            <span className="pv-li__card-title">{embedded}</span>
          </div>
        </div>
      )}

      {attachment !== null && (
        <div className="pv-li__card">
          <div className="pv-li__card-media">{pendingVisual(attachment)}</div>
        </div>
      )}

      {link !== null && (
        <div className="pv-li__card">
          <div className="pv-li__card-media">{hostOf(link)}</div>
          <div className="pv-li__card-body">
            <span className="pv-li__card-title">{link.label}</span>
            <span className="pv-li__card-host">{hostOf(link)}</span>
          </div>
        </div>
      )}

      <footer className="pv-li__actions" aria-hidden="true">
        <span className="pv-li__action">
          <LinkedInIcon d="M7 10v11M7 10l4-7c1.5 0 2.5 1 2.5 2.5V9h5.2c1.2 0 2.1 1.1 1.8 2.3l-1.8 7.4c-.2.8-1 1.3-1.8 1.3H7" />
          Like
        </span>
        <span className="pv-li__action">
          <LinkedInIcon d="M4 5h16v11H9l-5 4z" />
          Comment
        </span>
        <span className="pv-li__action">
          <LinkedInIcon d="M17 3l3 3-3 3M4 11V9a3 3 0 0 1 3-3h13M7 21l-3-3 3-3M20 13v2a3 3 0 0 1-3 3H4" />
          Repost
        </span>
        <span className="pv-li__action">
          <LinkedInIcon d="M21 3 10 14M21 3l-7 18-4-7-7-4z" />
          Send
        </span>
      </footer>
    </article>
  );
}

function LinkedInIcon({ d }: { readonly d: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

function Globe() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.7 3.5 5.7 3.5 9s-1 6.3-3.5 9c-2.5-2.7-3.5-5.7-3.5-9s1-6.3 3.5-9z" />
    </svg>
  );
}

function XActions() {
  const icon = (d: string, label: string) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-label={label} role="img">
      <path d={d} />
    </svg>
  );
  return (
    <div className="pv-x__actions" aria-hidden="true">
      {icon('M4 5h16v11H9l-5 4z', 'Reply')}
      {icon('M17 3l3 3-3 3M4 11V9a3 3 0 0 1 3-3h13M7 21l-3-3 3-3M20 13v2a3 3 0 0 1-3 3H4', 'Repost')}
      {icon('M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z', 'Like')}
      {icon('M5 20V11M12 20V5M19 20v-6', 'Views')}
      {icon('M12 3v12M7 8l5-5 5 5M5 21h14', 'Share')}
    </div>
  );
}

/**
 * Where an image would be. ⑪ the Visual Desk is not built, and without the image-metadata
 * service no image may publish (build spec §3.6a) — so the placeholder says the post goes
 * out as text, rather than implying a picture that will not appear.
 */
function pendingVisual(attachment: PostAttachment): string {
  return attachment.kind === 'visual'
    ? `${attachment.label} — not rendered yet, so this posts as text only`
    : attachment.label;
}

function hostOf(link: PostLink): string {
  return new URL(link.url).hostname;
}

/** LinkedIn sets a tagged account in its link colour, which is how a reader spots the tag. */
function withMentions(text: string): ReactNode[] {
  return text.split(/(@[A-Za-z][\w.]*)/).map((part, index) =>
    part.startsWith('@') ? (
      <span key={index} className="pv-li__tag">
        {part.slice(1)}
      </span>
    ) : (
      part
    ),
  );
}

function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('');
}

/** `now`, `55m`, `3h`, `2d` — LinkedIn's own shorthand. */
export function relativeTime(iso: string, now: Date): string {
  const minutes = Math.max(0, Math.round((now.getTime() - new Date(iso).getTime()) / 60_000));
  if (minutes < 1) return 'Now';
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
}
