/**
 * Stat tile and bar — the two data forms this build needs.
 *
 * Design spec §8: "Pick the form first. A single headline figure is a stat tile, not a
 * chart. Magnitude across categories is horizontal bars."
 *
 * And the rule that decides the colour: "Red is never a series colour. […] A bar turns red
 * only when it breaches a threshold or flags a defect. Colouring bars by category would
 * make red mean 'the fifth reason' and stop it meaning attention."
 */

export function Tile({
  label,
  value,
  note,
  attention = false,
}: {
  readonly label: string;
  readonly value: string;
  readonly note?: string;
  /** True only when the figure breaches a threshold. Never for emphasis. */
  readonly attention?: boolean;
}) {
  return (
    <div className="tile">
      <span className="t-meta tile__label">{label}</span>
      <span className={attention ? 't-data-l tile__value tile__value--attention' : 't-data-l tile__value'}>
        {value}
      </span>
      {note !== undefined && <span className="t-body-s tile__note">{note}</span>}
    </div>
  );
}

export function Bar({
  fraction,
  over = false,
  label,
}: {
  /** 0–1. Clamped, so a bad input cannot draw outside the track. */
  readonly fraction: number;
  readonly over?: boolean;
  /** Read by assistive tech in place of the mark. */
  readonly label: string;
}) {
  const clamped = Math.min(1, Math.max(0, fraction));
  return (
    <div
      className="bar-track"
      role="img"
      aria-label={`${label}: ${Math.round(clamped * 100)}%`}
    >
      <div
        className={over ? 'bar-fill bar-fill--over' : 'bar-fill'}
        style={{ width: `${clamped * 100}%` }}
      />
    </div>
  );
}
