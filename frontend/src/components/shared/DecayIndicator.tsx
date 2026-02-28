'use client';

import styles from './shared.module.scss';

interface DecayIndicatorProps {
  decayFactor: number;    // 0–1
  elapsed?: number;       // ms since last update
  label?: string;
}

export function DecayIndicator({ decayFactor, elapsed, label }: DecayIndicatorProps) {
  const status = decayFactor > 0.9 ? 'fresh' : decayFactor > 0.5 ? 'active' : 'stale';
  const elapsedStr = elapsed
    ? elapsed < 60_000
      ? `${Math.round(elapsed / 1000)}s ago`
      : `${Math.round(elapsed / 60_000)}m ago`
    : null;

  return (
    <div className={`${styles.decayIndicator} ${styles[status]}`}>
      <span className={styles.icon} />
      <span>{label ?? `Decay: ${(decayFactor * 100).toFixed(0)}%`}</span>
      {elapsedStr && <span>({elapsedStr})</span>}
    </div>
  );
}
