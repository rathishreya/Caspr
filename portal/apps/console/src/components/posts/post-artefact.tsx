import type { ContentItem, PostBody, PostVersion } from '@caspr-portal/domain';

import { authorOf, PLATFORM_NAME, type Author } from '@/lib/platforms';

/**
 * The post, exactly as it will publish.
 *
 * Design spec §5A.2: "THE ARTEFACT — white. The item exactly as it will publish." So nothing
 * here decorates the words — no highlighted hook, no inline annotations. What the reviewer
 * is told *about* the post lives beside it in the facts panel; what they read is the post.
 *
 * It renders each channel in its own structure — where the thread breaks, where the blog's
 * headline sits against its body — but in the console's type and palette, not the
 * platform's. The reviewer is judging the words and their shape. LinkedIn's blue would
 * import a fourth colour into a system that has three (§8), and teach nothing.
 */
export function PostArtefact({ item, version }: { readonly item: ContentItem; readonly version: PostVersion }) {
  const author = authorOf(item);
  return <Body body={version.body} author={author} channelName={PLATFORM_NAME[item.channel]} />;
}

function Body({
  body,
  author,
  channelName,
}: {
  readonly body: PostBody;
  readonly author: Author;
  readonly channelName: string;
}) {
  switch (body.kind) {
    case 'linkedin':
      return (
        <article className="post">
          <AuthorLine author={author} where={channelName} />
          <div className="post__body">
            {body.paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
          {body.hashtags.length > 0 && (
            <p className="post__tags">{body.hashtags.map((tag) => `#${tag}`).join(' ')}</p>
          )}
          {body.attachment !== null && <Attachment label={body.attachment.label} kind={body.attachment.kind} />}
          {body.link !== null && <LinkPreview url={body.link.url} label={body.link.label} />}
        </article>
      );

    case 'x':
      return (
        <article className="post">
          <AuthorLine
            author={author}
            where={body.posts.length > 1 ? `X · thread of ${body.posts.length}` : 'X'}
          />
          <ol className={body.posts.length > 1 ? 'post__thread' : 'post__thread post__thread--single'}>
            {body.posts.map((text, index) => (
              <li key={index} className="post__tweet">
                <p>{text}</p>
                <span className="post__count t-meta" aria-label={`${[...text].length} characters`}>
                  {[...text].length}
                </span>
              </li>
            ))}
          </ol>
          {body.attachment !== null && <Attachment label={body.attachment.label} kind={body.attachment.kind} />}
          {body.link !== null && <LinkPreview url={body.link.url} label={body.link.label} />}
        </article>
      );

    case 'blog':
      return (
        <article className="post">
          <p className="post__url t-meta">caspr.ai/blog/{body.slug}</p>
          <h3 className="post__headline">{body.headline}</h3>
          <p className="post__standfirst">{body.standfirst}</p>
          <div className="post__body">
            {body.paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
          <p className="post__cta">{body.cta}</p>
        </article>
      );

    case 'community':
      return (
        <article className="post">
          <div className="post__question">
            <span className="t-meta">
              {body.venue} · the thread
              {body.illustrative && <span className="post__stand-in"> · illustrative</span>}
            </span>
            <p>{body.threadQuestion}</p>
          </div>
          <AuthorLine author={author} where="Reply" />
          <div className="post__body">
            {body.paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </article>
      );
  }
}

function AuthorLine({ author, where }: { readonly author: Author; readonly where: string }) {
  return (
    <header className="post__author">
      <span className={author.company ? 'post__avatar post__avatar--company' : 'post__avatar'} aria-hidden="true">
        {author.mark}
        {author.company && <span className="post__avatar-dot">.</span>}
      </span>
      <span className="post__who">
        <span className="post__name">{author.name}</span>
        <span className="post__detail">{author.detail}</span>
      </span>
      <span className="post__where t-meta">{where}</span>
    </header>
  );
}

function Attachment({ kind, label }: { readonly kind: 'document' | 'visual'; readonly label: string }) {
  return (
    <div className="post__attachment">
      <span className="t-meta">{kind === 'visual' ? 'Visual' : 'Document attached'}</span>
      <span>{label}</span>
      {kind === 'visual' && (
        // ⑪ the Visual Desk does not exist yet, and without the image-metadata service an
        // image may not publish at all (build spec §3.6a). The reviewer approves the words
        // knowing that — not an image they assume will appear.
        <span className="post__pending">
          Renders when ⑪ the Visual Desk is built. Until then this posts as text only.
        </span>
      )}
    </div>
  );
}

function LinkPreview({ url, label }: { readonly url: string; readonly label: string }) {
  const host = new URL(url);
  return (
    <div className="post__link">
      <span className="t-meta">{`${host.hostname}${host.pathname === '/' ? '' : host.pathname}`}</span>
      <span>{label}</span>
    </div>
  );
}
