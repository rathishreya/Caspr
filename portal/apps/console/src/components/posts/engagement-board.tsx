import {
  AMPLIFY_TIERS,
  DAILY_APPROVAL_CAP,
  ENGAGEMENT_STATUS_LABEL,
  INBOUND_RESPONSE_LABEL,
  MAX_PEOPLE_PER_EXTERNAL_POST,
  MENTION_SOURCES,
  NEVER_IN_A_DRAFT,
  actedFrom,
  engagementPublishMode,
  inboundResponse,
  isInbound,
  personName,
  surfacing,
  type EngagementTarget,
} from '@caspr-portal/domain';

import { State } from '@/components/primitives/state';
import { EngagementActions } from '@/components/posts/engagement-actions';
import { ExternalPostPreview, relativeTime } from '@/components/posts/post-preview';

/**
 * Engagement — the half of the week that never passes through review.
 *
 * Operating model ㉖: creation goes through review, always; engagement does not, because "a
 * person, on-platform, always" writes it. The board shows what was surfaced, why, the one
 * fact to bring — and, since 2026-09-14, the drafts.
 *
 * ⚑ The drafts are Joy's reversal of ⑰ rule 1, not a loosening of it
 * (`activation-framework.md` §0.3 decision 14): "The portal drafts; nobody writes from
 * scratch." Two variants per target, each in one person's lane, each carrying its own
 * finding — and the words still reach the platform through a person, one tap at a time.
 *
 * Ordered by who is waiting on whom. Someone who tagged us is waiting on us, so inbound comes
 * first; a comment target waits on nobody.
 */
export function EngagementBoard({
  targets,
  now,
  firstTeamPost,
}: {
  readonly targets: readonly EngagementTarget[];
  readonly now: Date;
  /** The first teammate's post of the week, as `Joy, TUE 18 · 09:00` — or null. */
  readonly firstTeamPost: string | null;
}) {
  const open = targets.filter((t) => t.status === 'open');
  const inbound = open.filter((t) => isInbound(t.kind));
  const outbound = open.filter((t) => !isInbound(t.kind));
  const comments = outbound.filter((t) => t.kind === 'comment' && surfacing(t).surfaced);
  const reposts = outbound.filter((t) => t.kind === 'repost' && surfacing(t).surfaced);
  const filtered = outbound.filter((t) => !surfacing(t).surfaced);
  const closed = targets.filter((t) => t.status !== 'open');
  const actedToday = closed.filter((t) => t.status === 'done').length;

  const needsNothing = inbound.filter((t) => ['read_only', 'nothing'].includes(inboundResponse(t)));
  const needsAct = inbound.filter((t) => !needsNothing.includes(t));

  return (
    <div className="engage-board">
      <p className="engage-caps t-body-s">
        <span className="t-meta-bold">Caps</span> {actedToday} of {DAILY_APPROVAL_CAP} approvals used today ·{' '}
        at most {MAX_PEOPLE_PER_EXTERNAL_POST} of us on any one external post · no third-party engagement tools,
        ever. <span className="text-tertiary">Ten a day is what a real professional does; more is what pod
        detection looks for.</span>
      </p>

      <section aria-labelledby="inbound-heading">
        <div className="board-head">
          <h3 id="inbound-heading" className="t-title-m">
            Tagged and reshared <span className="board-count t-meta">{needsAct.length}</span>
          </h3>
          <span className="board-hint t-body-s">Someone acted on us. What we do back follows their tier on the register.</span>
        </div>

        {needsAct.length === 0 ? (
          <State
            kind="empty"
            headline="Nobody who tagged or reshared us needs an answer."
            consequence="Correctly empty — a tag from an account we only observe, or a bare reshare, needs nothing from us."
          />
        ) : (
          <div className="engage-list">
            {needsAct.map((target) => (
              <EngagementCard key={target.id} target={target} now={now} />
            ))}
          </div>
        )}

        {needsNothing.length > 0 && (
          <details className="engage-quiet">
            <summary className="t-body-s">
              {needsNothing.length} more that need nothing from us — seen, and why
            </summary>
            <ul>
              {needsNothing.map((target) => (
                <li key={target.id} className="engage-quiet__row t-body-s">
                  <span className="t-meta">{kindLabel(target)}</span> {target.post.author} —{' '}
                  {INBOUND_RESPONSE_LABEL[inboundResponse(target)]}.{' '}
                  <span className="text-tertiary">{quietReason(target)}</span>
                </li>
              ))}
            </ul>
          </details>
        )}

        <details className="engage-quiet">
          <summary className="t-body-s">Where a tag can reach this console</summary>
          <ul>
            {MENTION_SOURCES.map((source) => (
              <li key={source.surface} className="engage-quiet__row t-body-s">
                <span className={source.reach === 'yes' ? 't-meta' : 't-meta text-tertiary'}>
                  {source.reach === 'yes' ? 'Arrives' : source.reach === 'no' ? 'Never arrives' : 'Unverified'}
                </span>{' '}
                <strong>{source.surface}</strong> — <span className="text-secondary">{source.how}</span>
              </li>
            ))}
          </ul>
        </details>
      </section>

      <section aria-labelledby="comment-heading">
        <div className="board-head">
          <h3 id="comment-heading" className="t-title-m">
            Comment <span className="board-count t-meta">{comments.length}</span>
          </h3>
          <span className="board-hint t-body-s">A fact to bring, from the person&rsquo;s own lane. The words are theirs.</span>
        </div>

        {comments.length === 0 ? (
          <State
            kind="empty"
            headline="No post worth a comment today."
            consequence="Correctly empty. A target appears only with a fact to bring — nothing to add means no comment."
          />
        ) : (
          <div className="engage-list">
            {comments.map((target) => (
              <EngagementCard key={target.id} target={target} now={now} />
            ))}
          </div>
        )}

        {firstTeamPost !== null && (
          <p className="engage-note t-body-s">
            Team-post targets appear when a teammate&rsquo;s post goes live, at most three of seven on any one post. The
            first this week is {firstTeamPost}.
          </p>
        )}
      </section>

      <section aria-labelledby="repost-heading">
        <div className="board-head">
          <h3 id="repost-heading" className="t-title-m">
            Repost with a line <span className="board-count t-meta">{reposts.length}</span>
          </h3>
          <span className="board-hint t-body-s">Tier 1 only, and never without a sentence of our own.</span>
        </div>

        {reposts.length === 0 ? (
          <State
            kind="empty"
            headline="No account is on tier 1 yet, so there is nothing to repost."
            consequence="Tier 1 is customers, testimonial participants and people who cite us. It fills as the testimonial programme lands — until then a repost would lend our feed to someone we have no relationship with."
          />
        ) : (
          <div className="engage-list">
            {reposts.map((target) => (
              <EngagementCard key={target.id} target={target} now={now} />
            ))}
          </div>
        )}
      </section>

      {filtered.length > 0 && (
        <details className="engage-quiet">
          <summary className="t-body-s">{filtered.length} the Listener found and the rules stopped — and why</summary>
          <ul>
            {filtered.map((target) => {
              const result = surfacing(target);
              return (
                <li key={target.id} className="engage-quiet__row t-body-s">
                  <span className="t-meta">{kindLabel(target)}</span> {target.post.author} —{' '}
                  <span className="text-secondary">{result.surfaced ? '' : result.why}</span>
                </li>
              );
            })}
          </ul>
        </details>
      )}

      <details className="engage-quiet">
        <summary className="t-body-s">What a draft may never contain</summary>
        <ul>
          {NEVER_IN_A_DRAFT.map((rule) => (
            <li key={rule} className="engage-quiet__row t-body-s">
              {rule}
            </li>
          ))}
        </ul>
        <p className="checks__source t-meta">activation framework §5 · the claims register</p>
      </details>

      {closed.length > 0 && (
        <p className="engage-note t-body-s">
          {closed.length} closed this week —{' '}
          {(['done', 'skipped', 'not_my_lane'] as const)
            .map((status) => `${closed.filter((t) => t.status === status).length} ${ENGAGEMENT_STATUS_LABEL[status].toLowerCase()}`)
            .join(', ')}
          .
        </p>
      )}
    </div>
  );
}

function EngagementCard({ target, now }: { readonly target: EngagementTarget; readonly now: Date }) {
  const inbound = isInbound(target.kind);
  const response = inbound ? inboundResponse(target) : null;
  const where = actedFrom(target);
  const who = target.assignedTo === 'social' ? 'Social specialist, from the Caspr Page' : personName(target.assignedTo);

  return (
    <article className="engage" aria-label={`${kindLabel(target)}: ${target.post.author}`}>
      <div className="engage__context">
        <span className="engage__kind t-meta-bold">{kindLabel(target)}</span>
        <span className="t-meta">LinkedIn</span>
        <span className="t-meta">surfaced {relativeTime(target.surfacedAt, now)} ago</span>
        {target.accountTier !== null && (
          <span className="t-meta">
            Tier {target.accountTier} · {AMPLIFY_TIERS[target.accountTier].name}
          </span>
        )}
        {target.illustrative && <span className="t-meta text-tertiary">Illustrative post</span>}
      </div>

      <div className="engage__grid">
        <ExternalPostPreview
          post={target.post}
          now={now}
          reshareOf={target.kind === 'reshare' ? 'A Caspr Page post from last week' : undefined}
        />

        <div className="engage__brief">
          {response !== null && (
            <p className="engage__row">
              <span className="engage__label t-meta">Do</span>
              <span className="t-body-s">{INBOUND_RESPONSE_LABEL[response]}</span>
            </p>
          )}
          <p className="engage__row">
            <span className="engage__label t-meta">Why</span>
            <span className="t-body-s text-secondary">{target.whyRelevant}</span>
          </p>
          {target.factToBring !== null && (
            <div className="engage__fact">
              <span className="engage__label t-meta">Bring this</span>
              <p className="t-body-m">{target.factToBring}</p>
              <p className="t-meta text-tertiary">{target.ourSource}</p>
            </div>
          )}
          <p className="engage__row">
            <span className="engage__label t-meta">Who</span>
            <span className="t-body-s">
              {who}
              {where === 'personal_queue' && (
                <span className="text-tertiary"> — on their Personal Queue, typed by them on LinkedIn</span>
              )}
            </span>
          </p>
          <EngagementActions
            targetId={target.id}
            doneLabel={inbound ? 'Replied' : 'Commented'}
            drafts={target.drafts}
            publishMode={engagementPublishMode(target.post.platform)}
            // No listener runs yet, so no target carries a real post link — §6.6's one tap
            // needs one, and saying so beats a button that goes nowhere.
            postUrl={null}
          />
        </div>
      </div>
    </article>
  );
}

function kindLabel(target: EngagementTarget): string {
  switch (target.kind) {
    case 'mention':
      return target.about === 'caspr' ? 'Tagged Caspr' : `Tagged ${personName(target.about)}`;
    case 'reshare':
      return 'Reshared our post';
    case 'comment':
      return 'Comment';
    case 'repost':
      return 'Repost';
  }
}

function quietReason(target: EngagementTarget): string {
  if (target.accountTier === 3 || target.accountTier === 4) {
    return `${AMPLIFY_TIERS[target.accountTier].name} tier on the register: nothing visible, ever.`;
  }
  if (target.kind === 'reshare' && target.post.text.trim().length === 0) {
    return 'A bare reshare has no words to answer, and reactions are never assigned.';
  }
  return 'Nothing true to add, and a thank-you with nothing in it is applause.';
}
