/**
 * States — three kinds, and they are not interchangeable. Design spec §11A.
 *
 *   EMPTY     "nothing here"     → often the reader does nothing. It must say WHICH:
 *                                  finished, unassigned, or correctly empty.
 *   LOADING   "nothing yet"      → wait. Name what is running and when it ends.
 *   DEGRADED  "something stopped" → act. Name what it BLOCKS, never "an error occurred".
 *
 * "A generic `No data` hides which of the three you are in — and the difference between
 * 'you are done', 'come back in an hour' and 'nothing can publish' is the entire message."
 *
 * The API makes the consequence a required argument. There is no way to render one of
 * these with only a headline, which is the rule enforced in the type system rather than
 * in a review comment.
 */

export type StateKind = 'empty' | 'loading' | 'degraded';

const KIND_LABEL: Record<StateKind, string> = {
  empty: 'EMPTY',
  loading: 'LOADING',
  degraded: 'DEGRADED',
};

export function State({
  kind,
  headline,
  consequence,
}: {
  readonly kind: StateKind;
  /** What is true. One line. */
  readonly headline: string;
  /** What it means for the reader. Required — this is the half people leave out. */
  readonly consequence: string;
}) {
  return (
    <div
      className={kind === 'degraded' ? 'state state--degraded' : 'state'}
      role={kind === 'degraded' ? 'alert' : undefined}
    >
      <span className="t-meta state__kind">{KIND_LABEL[kind]}</span>
      <span className="t-title-m">{headline}</span>
      <span className="t-body-m state__consequence">{consequence}</span>
    </div>
  );
}

/**
 * ⛔ No spinner exists in this console. §14.2 rule 2: "A loading state is text that names
 * what is running and when it ends." This is that text, and it is what a Suspense boundary
 * falls back to.
 */
export function Loading({
  what,
  ends,
}: {
  readonly what: string;
  readonly ends: string;
}) {
  return <State kind="loading" headline={what} consequence={ends} />;
}
