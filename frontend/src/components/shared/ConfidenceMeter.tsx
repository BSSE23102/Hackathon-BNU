'use client';

import styles from './shared.module.scss';

interface ConfidenceMeterProps {
  value: number;          // 0–1
  label?: string;
  showValue?: boolean;
}

export function ConfidenceMeter({ value, label = 'Confidence', showValue = true }: ConfidenceMeterProps) {
  const pct = Math.round(value * 100);
  const level = value < 0.35 ? 'low' : value < 0.65 ? 'medium' : 'high';

  return (
    <div className={styles.confidenceMeter}>
      <div className={styles.label}>
        <span>{label}</span>
        {showValue && <span>{pct}%</span>}
      </div>
      <div className={styles.track}>
        <div
          className={`${styles.fill} ${styles[level]}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
