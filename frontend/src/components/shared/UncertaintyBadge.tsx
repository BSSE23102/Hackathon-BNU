'use client';

import styles from './shared.module.scss';

interface UncertaintyBadgeProps {
  level: number;   // 0–1
  label?: string;
}

export function UncertaintyBadge({ level, label }: UncertaintyBadgeProps) {
  const tier =
    level > 0.75 ? 'veryHigh' :
    level > 0.5 ? 'high' :
    level > 0.25 ? 'moderate' : 'low';

  const text = label ?? (
    level > 0.75 ? 'Very High Uncertainty' :
    level > 0.5 ? 'High Uncertainty' :
    level > 0.25 ? 'Moderate Uncertainty' : 'Low Uncertainty'
  );

  return <span className={`${styles.uncertaintyBadge} ${styles[tier]}`}>{text}</span>;
}
