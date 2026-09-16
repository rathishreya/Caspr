import { COMPONENT_REGISTER, component, type ClockReading } from '@caspr-portal/domain';

import { Icon } from '@/components/icons';

/**
 * The three clocks.
 *
 * ⚑ This is the screen `portal-design-spec.md` §10 records being redrawn on 2026-08-25:
 * *"SEO ▸ Dashboard — corrected to **three kill conditions on three clocks**."* The
 * correction it carries is `docs/seo/decision.md` §1 — one kill condition measured only the
 * slowest third of the channel and ignored the two-thirds that pay fastest.
 *
 * Three cards, never a summary row, because a summary is the thing being corrected. They are
 * ordered by speed rather than by importance: presence reads in weeks and needs nothing
 * published, citation in months, ranking in six. A reader should be able to see, without
 * reading a word, that the fastest one is the one nobody has started.
 */
export function Clocks({ readings }: { readonly readings: readonly ClockReading[] }) {
  return (
    <section className="clocks" aria-label="The three discoverability clocks">
      {COMPONENT_REGISTER.map((definition) => {
        const reading = readings.find((row) => row.component === definition.id);
        return reading === undefined ? null : <Clock key={definition.id} reading={reading} />;
      })}
    </section>
  );
}

function Clock({ reading }: { readonly reading: ClockReading }) {
  const definition = component(reading.component);
  const stopped = reading.state === 'not_started';

  return (
    <article className={stopped ? 'clock clock--stopped' : reading.killed ? 'clock clock--killed' : 'clock'}>
      <header className="clock__head">
        <span className="clock__name t-title-m">{definition.name}</span>
        <span className="clock__speed t-meta">{definition.speed}</span>
      </header>

      <p className="clock__what t-body-s">{definition.what}</p>

      {/*
        The reading is the largest thing on the card, and it is a fraction rather than a
        percentage on purpose: 0 / 25 says what is missing, 0% says only that nothing
        happened. The denominator is the work somebody has to do.
      */}
      <p className="clock__figure">
        <span className={stopped ? 't-data-l clock__have clock__have--stopped' : 't-data-l clock__have'}>
          {reading.have}
        </span>
        {reading.of !== null && <span className="t-data-l clock__of"> / {reading.of}</span>}
      </p>
      <p className="clock__measure t-meta">{definition.measure}</p>

      <div className="clock__track" role="img" aria-label={`${Math.round(reading.sampleShare * 100)}% of the way to a reading`}>
        <div className="clock__fill" style={{ width: `${Math.max(1, reading.sampleShare * 100)}%` }} />
      </div>

      <p className={stopped ? 'clock__says t-body-s clock__says--stopped' : 'clock__says t-body-s'}>
        {stopped && <Icon name="alert" size={14} />}
        {reading.says}
      </p>

      <dl className="clock__facts">
        <div>
          <dt className="t-meta">Kill condition</dt>
          <dd className="t-body-s">{definition.kill}</dd>
        </div>
        <div>
          <dt className="t-meta">{stopped ? 'Starts when' : 'Started'}</dt>
          <dd className="t-body-s">
            {stopped ? definition.startsWhen : `${reading.startedOn} — day ${reading.daysRunning}`}
          </dd>
        </div>
        {reading.readsOn !== null && (
          <div>
            <dt className="t-meta">Reads on</dt>
            <dd className="t-body-s">
              {reading.readsOn}
              {reading.daysToRead !== null && (
                <span className="text-tertiary"> · {reading.daysToRead} days</span>
              )}
            </dd>
          </div>
        )}
      </dl>
    </article>
  );
}
