import {
  COLD_KILL_SAMPLE,
  COLD_RULES,
  COLD_VOLUME,
  LIFECYCLE_TRIGGERS,
  STREAMS,
  coldSendable,
} from '@caspr-portal/domain';
import type { Metadata } from 'next';

import { Tile } from '@/components/primitives/tile';

export const metadata: Metadata = { title: 'Email — Sequences' };

/**
 * Email ▸ Sequences — the workstream's own object.
 *
 * Two engines live here and they are built on opposite principles.
 *
 *   LIFECYCLE   fires on **what someone did**, not on what day it is. §8.2 replaces the
 *               calendar outline in `.agents/gtm-strategy.md` §9 outright — that one was
 *               written for the retired pricing, and a calendar sends the day-3 email on day
 *               three whether or not the person has done anything
 *   COLD        fires only when `fact_lookup` returns a sourced finding. **No finding, no
 *               send** — and there is no fallback frame, because a fallback frame is how
 *               research-led outreach quietly becomes a mail merge
 */
export default function EmailSequences() {
  const cold = STREAMS.find((stream) => stream.id === 'cold');

  // The gate, run on the three cases worth seeing. Shown as outcomes rather than described,
  // because "no finding, no send" is a rule people believe until they watch it refuse.
  const cases = [
    { label: 'A US partner at a vertical-SaaS fund, finding attached', input: { finding: 'Two most-cited revenue multiples for the sector: 8.5× forward and 3.3× trailing, unreconciled', frameApproved: true, recipientRegion: 'US', sentThisWeek: 12 } },
    { label: 'The same person, nothing well-sourced returned', input: { finding: null, frameApproved: true, recipientRegion: 'US', sentThisWeek: 12 } },
    { label: 'A London partner, finding attached', input: { finding: 'A sourced sector figure', frameApproved: true, recipientRegion: 'UK', sentThisWeek: 12 } },
    { label: 'Before Joy has approved the frames', input: { finding: 'A sourced sector figure', frameApproved: false, recipientRegion: 'US', sentThisWeek: 0 } },
  ];

  return (
    <div className="board">
      <div className="tiles">
        <Tile label="LIFECYCLE TRIGGERS" value={String(LIFECYCLE_TRIGGERS.length)} note="One action per email, founder-signed. Behaviour, never a calendar." />
        <Tile
          label="COLD, PER WEEK"
          value={`${COLD_VOLUME.min}–${COLD_VOLUME.max}`}
          note="Low volume on its own domain is what makes research-led cold email consistent with channel-model §7, which rules out cold email at volume."
        />
        <Tile
          label="KILL CONDITION"
          value={`<10% / ${COLD_KILL_SAMPLE}`}
          note="Response under 10% over 100 messages and the stream pauses itself. Joy decides whether it resumes."
        />
        <Tile
          label="APPROVAL"
          value="Once"
          attention={cold?.live === false}
          note="Joy approves the frames rendered on ~10 real examples — so she approves what recipients will read, not an abstract template. Never individual messages."
        />
      </div>

      <section className="panel panel--wide">
        <div className="panel__title">
          <h2 className="t-title-m">New sign-ups — triggered by what they do</h2>
          <span className="t-meta text-tertiary">
            THE HIGHEST-LEVERAGE EMAIL WE SEND · ACTIVATION IS THE FIRST GATE TO x
          </span>
        </div>

        <div className="table-scroll">
          <table className="table">
            <thead>
              <tr>
                <th className="t-meta keep">Trigger</th>
                <th className="t-meta fill">The email</th>
                <th className="t-meta keep">Why</th>
              </tr>
            </thead>
            <tbody>
              {LIFECYCLE_TRIGGERS.map((trigger) => (
                <tr key={trigger.id}>
                  <td className="t-body-s keep">{trigger.trigger}</td>
                  <td className="t-body-s text-secondary">{trigger.email}</td>
                  <td className="t-body-s text-tertiary keep">{trigger.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="t-body-s text-secondary" style={{ marginTop: 'var(--space-4)' }}>
          ⚠ Every budget figure in these follows COPY-11a / COPY-11b: <em>&ldquo;$200 a month of
          research&rdquo;</em>, never a subscription price, and never <em>&ldquo;only what you run is
          recharged&rdquo;</em> — the fee is charged whether or not anything runs, so that line is false.
        </p>
      </section>

      <section className="panel panel--wide">
        <div className="panel__title">
          <h2 className="t-title-m">Cold outreach — the gate</h2>
          <span className="t-meta text-tertiary">NO FINDING, NO SEND</span>
        </div>

        <div className="table-scroll">
          <table className="table">
            <thead>
              <tr>
                <th className="t-meta">Case</th>
                <th className="t-meta nowrap">Sends</th>
                <th className="t-meta fill">Why</th>
              </tr>
            </thead>
            <tbody>
              {cases.map((example) => {
                const verdict = coldSendable(example.input);
                return (
                  <tr key={example.label}>
                    <td className="t-body-s">{example.label}</td>
                    <td className={verdict.ok ? 't-meta nowrap' : 't-meta text-attention nowrap'}>
                      {verdict.ok ? 'Sends' : 'Skipped'}
                    </td>
                    <td className="t-body-s text-secondary">{verdict.reason}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="t-body-m text-secondary" style={{ marginTop: 'var(--space-4)', maxWidth: '72ch' }}>
          What the recipient reads is one reconciliation about their own sector —{' '}
          <em>
            &ldquo;Your fund covers vertical SaaS. The two most-cited revenue multiples for the sector are
            8.5× and 3.3× — one forward, one trailing, and neither source says which. Here&rsquo;s the
            reconciliation.&rdquo;
          </em>{' '}
          <span className="t-meta-bold">fact_lookup is a lookup</span>, never an $80 analysis per prospect.
        </p>
      </section>

      <section className="panel panel--wide">
        <div className="panel__title">
          <h2 className="t-title-m">The rules cold outreach runs under</h2>
        </div>
        {COLD_RULES.map((rule) => (
          <div key={rule.rule} className="stack-row">
            <p className="t-body-s">{rule.rule}</p>
            <p className="t-body-s text-secondary">{rule.detail}</p>
          </div>
        ))}
      </section>

      <section className="panel panel--wide">
        <div className="panel__title">
          <h2 className="t-title-m">The Record&rsquo;s subscribers</h2>
          <span className="t-meta text-tertiary">NO NURTURE SEQUENCE, DELIBERATELY</span>
        </div>
        <p className="t-body-m text-secondary" style={{ maxWidth: '72ch' }}>
          A welcome — the strongest past issue, their sector&rsquo;s index row, and <em>run it on
          yours</em> — and then the issues.{' '}
          <span className="t-meta-bold">The subscription is to be told, not to gain access</span>, so
          nothing here pushes them to sign up. An issue&rsquo;s email sends automatically once the issue is
          approved: it was already reviewed as origination, and a second release adds nothing but a delay.
        </p>
      </section>
    </div>
  );
}
