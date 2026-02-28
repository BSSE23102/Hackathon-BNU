'use client';

import styles from './shared.module.scss';

interface ScoreBarProps {
  label: string;
  value: number;    // 0–1
  color?: string;
}

export function ScoreBar({ label, value, color = 'var(--accent-blue)' }: ScoreBarProps) {
  const pct = Math.round(value * 100);

  return (
    <div className={styles.scoreBar}>
      <span className={styles.barLabel}>{label}</span>
      <div className={styles.barTrack}>
        <div
          className={styles.barFill}
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <span className={styles.barValue}>{pct}%</span>
    </div>
  );
}
