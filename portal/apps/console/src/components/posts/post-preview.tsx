import {
  CHANNEL_CREATIVE,
  CREATIVE_CANVASES,
  creativeFor,
  voiceLane,
  type ContentItem,
  type CreativeSpec,
  type ExternalPost,
  type PostAttachment,
  type PostLink,
  type PostVersion,
} from '@caspr-portal/domain';
import type { ReactNode } from 'react';

import { authorOf } from '@/lib/platforms';

export type PreviewMode = 'light' | 'dark';

/** A rendered creative, as the preview places it. */
interface Picture {
  readonly src: string;
  readonly alt: string;
  readonly width: number;
  readonly height: number;
}

/**
 * The post, exactly as the platform will show it.
 *
 * Asked for directly, 2026-09-15: "I want to see the exact post that we are going to post,
 * in that same way." So each channel is drawn in its own interface — LinkedIn's card and
 * fold, X's post and thread line, Instagram's square, a Reddit comment under its thread, a
 * Quora answer, a forum reply, the caspr.ai article — with nothing of the console's on it.
 *
 * Where a post carries an image it is the real one, rendered from its data
 * (`/api/creatives`), placed where `flowcharts/I-platforms.mmd` says that platform puts it:
 * LinkedIn under the text with the link in the first comment (A1), X on the first post of a
 * thread with the link on the last (B1), Instagram as the post itself (C1).
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
  const picture = pictureFor(item, version);

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
            picture={picture}
            firstComment={body.link}
          />
        </Stage>
      );

    case 'x':
      return (
        <Stage platform="x" mode={mode}>
          <article className="pv pv-x" aria-label={body.posts.length > 1 ? 'Thread on X' : 'Post on X'}>
            {body.posts.map((text, index) => {
              const first = index === 0;
              const last = index === body.posts.length - 1;
              return (
                <div key={index} className="pv-x__post">
                  <div className="pv-x__rail">
                    <span className="pv-x__avatar" aria-hidden="true">
                      C<span className="pv-li__dot">.</span>
                    </span>
                    {!last && <span className="pv-x__thread" aria-hidden="true" />}
                  </div>
                  <div className="pv-x__body">
                    <div className="pv-x__head">
                      <span className="pv-x__name">Caspr</span>
                      <span className="pv-x__muted">@caspr_ai · now</span>
                    </div>
                    <p className="pv-x__text">{text}</p>
                    {first && picture !== null && (
                      <div className="pv-x__card">
                        <CreativeImage picture={picture} className="pv-x__image" />
                      </div>
                    )}
                    {first && picture === null && body.attachment !== null && (
                      <div className="pv-x__card">
                        <div className="pv-x__card-media">{attachmentLabel(body.attachment)}</div>
                      </div>
                    )}
                    {last && body.link !== null && (
                      <div className="pv-x__card">
                        <div className="pv-x__card-media">{hostOf(body.link)}</div>
                        <div className="pv-x__card-body">{body.link.label}</div>
                      </div>
                    )}
                    <XActions />
                  </div>
                </div>
              );
            })}
          </article>
        </Stage>
      );

    case 'instagram':
      return (
        <Stage platform="instagram" mode={mode}>
          <article className="pv pv-ig" aria-label="Post on Instagram">
            <header className="pv-ig__head">
              <span className="pv-ig__ring" aria-hidden="true">
                <span className="pv-ig__avatar">
                  C<span className="pv-li__dot">.</span>
                </span>
              </span>
              <span className="pv-ig__user">caspr.ai</span>
              <span className="pv-ig__dots" aria-hidden="true">
                ···
              </span>
            </header>
            {picture === null ? (
              <div className="pv-ig__missing">No image — Instagram cannot publish this post</div>
            ) : (
              <CreativeImage picture={picture} className="pv-ig__image" />
            )}
            <InstagramActions />
            <InstagramCaption id={`fold-${item.id}`} caption={body.caption} />
            <p className="pv-ig__when">Just now</p>
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
              {picture !== null && (
                <figure className="pv-blog__hero">
                  <CreativeImage picture={picture} className="pv-blog__hero-image" />
                  <figcaption className="pv-blog__hero-caption">
                    Also the link preview wherever this page is shared
                  </figcaption>
                </figure>
              )}
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

      if (item.channel === 'quora') {
        return (
          <Stage platform="quora" mode={mode}>
            <QuoraAnswer
              question={body.threadQuestion}
              illustrative={body.illustrative}
              name={lane?.fullName ?? author.name}
              credential={lane?.headline ?? null}
              paragraphs={body.paragraphs}
              link={body.link}
            />
          </Stage>
        );
      }

      if (item.channel === 'reddit' || site === 'Reddit') {
        return (
          <Stage platform="reddit" mode={mode}>
            <article className="pv pv-rd" aria-label={`Reply on ${place ?? 'Reddit'}`}>
              <div className="pv-rd__venue">{place ?? body.venue}</div>
              <h3 className="pv-rd__title">{body.threadQuestion}</h3>
              {body.illustrative && <span className="pv-rd__stand-in">Stand-in thread — no listener runs yet</span>}
              <div className="pv-rd__comment">
                <span className="pv-rd__avatar" aria-hidden="true">
                  {author.name.slice(0, 1)}
                </span>
                <div>
                  <div className="pv-rd__meta">
                    <span className="pv-rd__user">{redditHandle(author.name)}</span> · just now
                  </div>
                  <div className="pv-rd__text">
                    {body.paragraphs.map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                    {body.link !== null && (
                      <p>
                        <span className="pv-rd__link">{body.link.url}</span>
                      </p>
                    )}
                  </div>
                  <div className="pv-rd__actions" aria-hidden="true">
                    <span>⇧ Vote ⇩</span>
                    <span>Reply</span>
                    <span>Award</span>
                    <span>Share</span>
                  </div>
                </div>
              </div>
            </article>
          </Stage>
        );
      }

      return (
        <Stage platform="forum" mode={mode}>
          <article className="pv pv-fm" aria-label={`Reply on ${body.venue}`}>
            <div className="pv-fm__crumb">{body.venue.replaceAll(' · ', ' › ')}</div>
            <h3 className="pv-fm__title">{body.threadQuestion}</h3>
            {body.illustrative && <span className="pv-fm__stand-in">Stand-in thread — no listener runs yet</span>}
            <div className="pv-fm__post">
              <div className="pv-fm__author">
                <span className="pv-fm__avatar" aria-hidden="true">
                  {author.name.slice(0, 1)}
                </span>
                <span className="pv-fm__name">{author.name}</span>
                <span className="pv-fm__rank">Member</span>
              </div>
              <div className="pv-fm__content">
                <div className="pv-fm__meta">Just now · #reply</div>
                <div className="pv-fm__text">
                  {body.paragraphs.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                  {body.link !== null && <p className="pv-fm__link">{body.link.url}</p>}
                </div>
                <div className="pv-fm__actions" aria-hidden="true">
                  <span>Quote</span>
                  <span>Reply</span>
                  <span>Like</span>
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
 * The console's own line under a post with an image: what it is, and the one button runtime
 * spec §5 asks for — "Download image". Outside the platform frame on purpose; nothing in it
 * appears on the platform.
 */
export function CreativeBar({ item, version }: { readonly item: ContentItem; readonly version: PostVersion }) {
  const spec = creativeFor(version);
  if (spec === null) return null;
  const canvas = spec.template === 'hero' ? CREATIVE_CANVASES.hero : CREATIVE_CANVASES.social;
  const name = spec.template === 'atom' ? 'The atom' : spec.template === 'hero' ? 'Hero image' : 'Card';
  return (
    <p className="creative-bar t-body-s">
      <span className="t-meta-bold">{name}</span>
      <span className="t-meta text-tertiary">
        {canvas.width} × {canvas.height} · PNG · version {version.versionN}
      </span>
      <span className="text-secondary">{CHANNEL_CREATIVE[item.channel].rule}</span>
      <a className="creative-bar__download t-label" href={`${srcOf(item, version)}&download=1`} download>
        Download image
      </a>
    </p>
  );
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
        picture={null}
        firstComment={null}
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
  readonly platform: 'linkedin' | 'x' | 'instagram' | 'reddit' | 'quora' | 'forum' | 'blog';
  readonly mode: PreviewMode;
  readonly children: ReactNode;
}) {
  return (
    <div className={`pv-stage pv-stage--${platform}${mode === 'dark' ? ' pv-stage--dark' : ''}`}>{children}</div>
  );
}

function srcOf(item: ContentItem, version: PostVersion): string {
  return `/api/creatives/${encodeURIComponent(item.id)}?v=${version.versionN}`;
}

function pictureFor(item: ContentItem, version: PostVersion): Picture | null {
  const spec = creativeFor(version);
  if (spec === null) return null;
  const canvas = spec.template === 'hero' ? CREATIVE_CANVASES.hero : CREATIVE_CANVASES.social;
  return { src: srcOf(item, version), alt: altText(spec), ...canvas };
}

/** Everything printed on the card, in reading order — the image says nothing the alt text does not. */
function altText(spec: CreativeSpec): string {
  switch (spec.template) {
    case 'card':
      return [spec.eyebrow, spec.headline, spec.standfirst, spec.source].filter(Boolean).join('. ');
    case 'atom':
      return [
        spec.eyebrow,
        spec.headline,
        ...spec.figures.map((f) => `${f.publisher}, ${f.period}: ${f.display}`),
        spec.source,
      ].join('. ');
    case 'hero':
      return `${spec.headline}. ${spec.standfirst}`;
  }
}

function CreativeImage({ picture, className }: { readonly picture: Picture; readonly className: string }) {
  // A plain img: the route already returns the exact PNG, and an optimiser would re-encode it.
  return (
    <img
      className={className}
      src={picture.src}
      alt={picture.alt}
      width={picture.width}
      height={picture.height}
      loading="lazy"
      decoding="async"
    />
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
  picture,
  firstComment,
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
  readonly picture: Picture | null;
  /** A1: "link in the FIRST COMMENT, never the body". */
  readonly firstComment: PostLink | null;
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
  const avatar = isCaspr ? (
    <>
      C<span className="pv-li__dot">.</span>
    </>
  ) : (
    (initials ?? initialsOf(name))
  );

  return (
    <article className="pv pv-li" aria-label={`LinkedIn post by ${name}`}>
      <header className="pv-li__head">
        <span className={avatarClass} aria-hidden="true">
          {avatar}
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

      {picture !== null ? (
        <CreativeImage picture={picture} className="pv-li__image" />
      ) : (
        attachment !== null && (
          <div className="pv-li__card">
            <div className="pv-li__card-media">{attachmentLabel(attachment)}</div>
          </div>
        )
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

      {firstComment !== null && (
        <div className="pv-li__comments">
          <div className="pv-li__comment">
            <span className={`${avatarClass} pv-li__avatar--small`} aria-hidden="true">
              {avatar}
            </span>
            <div className="pv-li__bubble">
              <span className="pv-li__comment-name">
                {name} <span className="pv-li__author-badge">Author</span>
              </span>
              <span className="pv-li__comment-text">
                {firstComment.label}: <span className="pv-li__tag">{hostOf(firstComment)}{pathOf(firstComment)}</span>
              </span>
            </div>
          </div>
          <span className="pv-li__comment-note">The link goes in the first comment, never the post</span>
        </div>
      )}
    </article>
  );
}

/** A Quora answer: the question as the page title, the answerer's credential, the answer, the link. */
function QuoraAnswer({
  question,
  illustrative,
  name,
  credential,
  paragraphs,
  link,
}: {
  readonly question: string;
  readonly illustrative: boolean;
  readonly name: string;
  readonly credential: string | null;
  readonly paragraphs: readonly string[];
  readonly link: PostLink | null;
}) {
  return (
    <article className="pv pv-qa" aria-label="Answer on Quora">
      <h3 className="pv-qa__question">{question}</h3>
      {illustrative && <span className="pv-qa__stand-in">Stand-in question — no listener runs yet</span>}
      <div className="pv-qa__answer">
        <header className="pv-qa__head">
          <span className="pv-qa__avatar" aria-hidden="true">
            {initialsOf(name)}
          </span>
          <span className="pv-qa__who">
            <span className="pv-qa__name">
              {name}
              {credential !== null && <span className="pv-qa__credential"> · {credential}</span>}
            </span>
            <span className="pv-qa__meta">Answered just now</span>
          </span>
        </header>
        <div className="pv-qa__text">
          {paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
          {link !== null && (
            <p>
              <span className="pv-qa__link">{link.url}</span>
            </p>
          )}
        </div>
        <footer className="pv-qa__actions" aria-hidden="true">
          <span className="pv-qa__vote">
            <span>▲ Upvote</span>
            <span className="pv-qa__down">▼</span>
          </span>
          <span>Comment</span>
          <span>Share</span>
        </footer>
      </div>
    </article>
  );
}

/** C1: "caption: first ~125 chars show before 'more'". The fold is where the platform puts it. */
function InstagramCaption({ id, caption }: { readonly id: string; readonly caption: string }) {
  const FOLD = 125;
  if (caption.length <= FOLD) {
    return (
      <p className="pv-ig__caption">
        <span className="pv-ig__user">caspr.ai</span> {caption}
      </p>
    );
  }
  return (
    <div className="pv-ig__captionwrap">
      <input id={id} type="checkbox" className="pv-li__toggle" aria-label="Show the whole caption" />
      <p className="pv-ig__caption pv-ig__caption--short">
        <span className="pv-ig__user">caspr.ai</span> {caption.slice(0, FOLD).trimEnd()}…{' '}
        <label htmlFor={id} className="pv-ig__more">
          more
        </label>
      </p>
      <p className="pv-ig__caption pv-ig__caption--full">
        <span className="pv-ig__user">caspr.ai</span> {caption}
      </p>
    </div>
  );
}

function InstagramActions() {
  const icon = (d: string) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
  return (
    <div className="pv-ig__actions" aria-hidden="true">
      {icon('M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z')}
      {icon('M20 12a8 8 0 1 1-3.3-6.5L21 4l-1.2 4.2A8 8 0 0 1 20 12z')}
      {icon('M21 3 10 14M21 3l-7 18-4-7-7-4z')}
      <span className="pv-ig__save">{icon('M6 3h12v18l-6-5-6 5z')}</span>
    </div>
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

/** A document or a visual without data behind it — named, never drawn as if it existed. */
function attachmentLabel(attachment: PostAttachment): string {
  return attachment.kind === 'visual' ? `${attachment.label} — no image data yet, so this posts as text` : attachment.label;
}

function hostOf(link: PostLink): string {
  return new URL(link.url).hostname;
}

function pathOf(link: PostLink): string {
  const { pathname } = new URL(link.url);
  return pathname === '/' ? '' : pathname;
}

/** A person posts to Reddit from their own account — ㉛. The handle is a stand-in, and looks like one. */
function redditHandle(name: string): string {
  return `u/${name.toLowerCase().replace(/[^a-z]+/g, '_')}`;
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
