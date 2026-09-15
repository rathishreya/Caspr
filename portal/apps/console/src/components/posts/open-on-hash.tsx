'use client';

import { useEffect } from 'react';

/**
 * Open a collapsed post when a link points at it.
 *
 * The platform matrix links every time chip to its post by `#post-<id>`. For a post
 * waiting on a decision the target is already open; for a decided one it sits inside a
 * closed `<details>`, and a link that scrolls to a closed row has not actually shown the
 * reader anything. This opens it — on arrival, and on every later hash change.
 */
export function OpenOnHash() {
  useEffect(() => {
    const open = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (!id.startsWith('post-')) return;
      const target = document.getElementById(id);
      if (target instanceof HTMLDetailsElement) target.open = true;
      target?.scrollIntoView({ block: 'start' });
    };
    open();
    window.addEventListener('hashchange', open);
    return () => window.removeEventListener('hashchange', open);
  }, []);

  return null;
}
