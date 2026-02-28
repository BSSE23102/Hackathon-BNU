'use client';

import { useState } from 'react';
import { Zap, Users, CircleDollarSign, X } from 'lucide-react';
import { useFailureSignals } from '@/hooks/useFailureApi';
import type { FailureSignal } from '@/types';
import styles from './FailureOverlay.module.scss';

const FAILURE_CONFIG: Record<FailureSignal['type'], { icon: React.ReactNode; className: string; title: string }> = {
  'signal-collapse': {
    icon: <Zap size={18} style={{ color: '#7c3aed' }} />,
    className: styles.signalCollapse,
    title: 'Model Signal Collapse',
  },
  'human-overload': {
    icon: <Users size={18} style={{ color: '#b45309' }} />,
    className: styles.humanOverload,
    title: 'Human Review Overload',
  },
  'budget-exhaustion': {
    icon: <CircleDollarSign size={18} style={{ color: '#dc2626' }} />,
    className: styles.budgetExhaustion,
    title: 'Budget Exhaustion',
  },
};

export default function FailureOverlay() {
  const { activeFailures } = useFailureSignals();
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const visibleFailures = activeFailures.filter(
    (f) => !dismissed.has(f.type)
  );

  if (visibleFailures.length === 0) return null;

  const getSeverityClass = (severity: number) =>
    severity > 0.8 ? styles.critical :
    severity > 0.5 ? styles.high : styles.medium;

  const formatSince = (ts: number) => {
    const mins = Math.floor((Date.now() - ts) / 60_000);
    return mins < 1 ? 'Just now' : `${mins}m ago`;
  };

  return (
    <div className={styles.overlay}>
      {visibleFailures.map((failure) => {
        const config = FAILURE_CONFIG[failure.type];
        return (
          <div key={failure.type} className={`${styles.banner} ${config.className}`}>
            <span className={styles.icon}>{config.icon}</span>
            <div className={styles.content}>
              <div className={styles.title}>{config.title}</div>
              <div className={styles.message}>{failure.message}</div>
              <div className={styles.since}>Active since: {formatSince(failure.since)}</div>
            </div>
            <span className={`${styles.severity} ${getSeverityClass(failure.severity)}`}>
              {(failure.severity * 100).toFixed(0)}%
            </span>
            <button
              className={styles.dismiss}
              onClick={() => setDismissed((prev) => { const next = new Set(Array.from(prev)); next.add(failure.type); return next; })}
              aria-label="Dismiss"
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
