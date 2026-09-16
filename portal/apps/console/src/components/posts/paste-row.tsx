'use client';

import { useState } from 'react';

import { Icon } from '@/components/icons';

/**
 * Copy the post, and open the box it goes into.
 *
 * ⚑ Added 2026-09-16 on request: *"give me a copy paste option, also a redirection link —
 * like jaha exactly mujhe isko paste krna ho."*
 *
 * Five of our eight channels reach their platform through a person: the four on `manual`
 * publish mode post by hand, and the LinkedIn Page is released by hand. For those five the
 * console's job does not end at "approved" — it ends when the words are in the box. Copying
 * is offered on every post regardless, because a person who wants the text has a reason and
 * the alternative is selecting it out of a preview by dragging.
 *
 * **Never an API post.** Framework §6.6 is about comments, and the reasoning carries: a
 * third-party post is ranked down and shown to fewer people than one typed on the platform.
 * The clipboard is the integration.
 *
 * `url` is null whenever the exact destination is not knowable from here — an unconnected
 * Page, a subreddit chosen on the day, a question, a thread. Then this says where the words
 * go in words, and does not offer a link that would be a guess.
 */
export function PasteRow({
  text,
  platform,
  where,
  url,
}: {
  readonly text: string;
  readonly platform: string;
  /** Where the words go, in a person's terms — shown whether or not there is a link. */
  readonly where: string;
  readonly url: string | null;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      // Clipboard access can be refused. The post is on screen and selectable either way,
      // so this says what happened rather than pretending it worked.
      setCopied(false);
    }
  }

  return (
    <div className="paste">
      <button type="button" className="btn" onClick={copy}>
        <Icon name={copied ? 'check' : 'copy'} size={14} />
        {copied ? 'Copied' : 'Copy the post'}
      </button>

      {url === null ? (
        <span className="paste__where t-body-s">Paste it into {where}.</span>
      ) : (
        <>
          <a className="btn" href={url} target="_blank" rel="noreferrer" onClick={copy}>
            Open {platform}
            <Icon name="external" size={14} />
          </a>
          <span className="paste__where t-body-s">Opens {where}, with the post already copied.</span>
        </>
      )}
    </div>
  );
}
