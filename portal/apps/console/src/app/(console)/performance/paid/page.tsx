import {
  KILL_RULES,
  LAUNCH_BURST_TOTAL,
  META_AUDIENCES,
  META_AUDIENCE_MINIMUM,
  META_DECISION_WEEK,
  META_GUARDRAILS,
  META_NEVER,
  META_REALITY,
  burstSplit,
} from '@caspr-portal/domain';
import type { Metadata } from 'next';

import { Icon } from '@/components/icons';
import { Bar, Tile } from '@/components/primitives/tile';

export const metadata: Metadata = { title: 'Performance — Paid' };

/**
 * Performance ▸ Paid — the workstream's own object.
 *
 * Three things, and the first is the one people get wrong. **The launch burst is not the
 * paid engine** (§4.2): one $1,500 line at the peak, governed by the week-4 gate and safe
 * without a reviewer because its kill rules were agreed in advance.
 *
 * Its split is **decided by a number, not a judgement** (§0.5 decision 23): Meta serves
 * nothing to an audience under 1,000 people, so money moved there before the audience exists
 * buys delivery we cannot get. That is also why the audiences accumulate from Day 1 at $0 —
 * so the decision at week 8 is a reading rather than a guess.
 */
export default function PerformancePaid() {
  // No audience exists yet: the Meta tag is a §14 dependency and is not live, so the honest
  // input is zero. Shown as the decision it produces rather than as a number we measured.
  const audienceToday = 0;
  const split = burstSplit(audienceToday);

  return (
    <div className="board">
      <div className="tiles">
        <Tile label="THE BURST" value={`$${LAUNCH_BURST_TOTAL.toLocaleString('en-US')}`} note="One time, at the peak. Governed by the week-4 gate, not by the engine's four conditions." />
        <Tile label="ON SEARCH" value={`$${split.search.toLocaleString('en-US')}`} note={split.why} />
        <Tile
          label="ON META"
          value={`$${split.meta.toLocaleString('en-US')}`}
          note={`Only if the audience reaches ${META_AUDIENCE_MINIMUM.toLocaleString('en-US')} by week ${META_DECISION_WEEK}. Otherwise all of it stays on search.`}
        />
        <Tile
          label="META AUDIENCE"
          value={audienceToday.toLocaleString('en-US')}
          attention
          note="The tag is not live yet — a §14 dependency. Audiences accumulate at $0 from Day 1, which is what makes week 8 a reading rather than a guess."
        />
      </div>

      <section className="panel panel--wide">
        <div className="panel__title">
          <h2 className="t-title-m">Kill rules, agreed in advance</h2>
          <span className="t-meta text-tertiary">OPERATIONS RUNBOOK §7</span>
        </div>

        <div className="table-scroll">
          <table className="table">
            <thead>
              <tr>
                <th className="t-meta nowrap">Trigger</th>
                <th className="t-meta fill">Action</th>
                <th className="t-meta nowrap">Fires</th>
              </tr>
            </thead>
            <tbody>
              {KILL_RULES.map((rule) => (
                <tr key={rule.trigger}>
                  <td className="t-body-s nowrap">{rule.trigger}</td>
                  <td className="t-body-s text-secondary">{rule.action}</td>
                  <td className="t-meta nowrap">{rule.automatic ? 'Automatically' : 'As an alert'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="t-body-s text-secondary" style={{ marginTop: 'var(--space-4)' }}>
          The two that pause on their own are what make the burst safe while condition 2 — a reviewer in the
          seat — is still unmet. Budget changes are made by the owner and logged. No silent increases.
        </p>
      </section>

      <div className="grid-2">
        <section className="panel">
          <div className="panel__title">
            <h2 className="t-title-m">Why Meta can only be retargeting</h2>
            <span className="t-meta text-tertiary">2026 REALITY</span>
          </div>
          {META_REALITY.map((row) => (
            <div key={row.what} className="stack-row">
              <p className="t-body-s">{row.what}</p>
              <p className="t-body-s text-secondary">{row.reality}</p>
            </div>
          ))}
          <p className="t-body-s text-attention" style={{ marginTop: 'var(--space-3)' }}>
            ⛔ {META_NEVER}
          </p>
          <p className="t-body-s text-secondary" style={{ marginTop: 'var(--space-3)' }}>
            LinkedIn and X reach the ICP in analytical mode. Meta reaches the same person at 9pm, with more
            mind space. Meta is not where they discover Caspr — it is where they remember it.
          </p>
        </section>

        <section className="panel">
          <div className="panel__title">
            <h2 className="t-title-m">The audiences</h2>
            <span className="t-meta text-tertiary">ACCUMULATING FROM DAY 1 · AT $0</span>
          </div>
          {META_AUDIENCES.map((audience) => (
            <div key={audience.name} className="stack-row">
              <p className="t-body-s">
                {audience.name}{' '}
                <span className="t-meta text-tertiary">{audience.size === null ? 'NOT YET BUILDING' : audience.size}</span>
              </p>
              <p className="t-body-s text-secondary">{audience.how}</p>
            </div>
          ))}
          <div style={{ marginTop: 'var(--space-3)' }}>
            <Bar fraction={audienceToday / META_AUDIENCE_MINIMUM} label="Meta audience against the 1,000 minimum" />
          </div>
          <p className="t-meta text-tertiary" style={{ marginTop: 'var(--space-2)' }}>
            {audienceToday.toLocaleString('en-US')} of {META_AUDIENCE_MINIMUM.toLocaleString('en-US')} — the point
            at which Meta will serve anything at all
          </p>
        </section>
      </div>

      <section className="panel panel--wide">
        <div className="panel__title">
          <h2 className="t-title-m">Three guardrails</h2>
          <span className="t-meta text-tertiary">ONE OF THEM IS ENFORCED IN THE BUILD</span>
        </div>

        <div className="gates">
          {META_GUARDRAILS.map((guardrail) => (
            <div key={guardrail.rule} className={guardrail.enforced ? 'gate gate--met' : 'gate'}>
              <span className="gate__mark">
                <Icon name={guardrail.enforced ? 'check' : 'alert'} size={16} />
              </span>
              <div className="gate__body">
                <p className="t-title-m">{guardrail.rule}</p>
                <p className="t-body-s text-secondary">{guardrail.detail}</p>
                <p className="t-meta text-tertiary">
                  {guardrail.enforced ? 'Enforced in the build' : 'Held by a person, not by the code'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
