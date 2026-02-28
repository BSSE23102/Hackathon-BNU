'use client';

import { Wallet, TrendingUp } from 'lucide-react';
import { useCostStore } from '@/stores/costStore';
import { useCostCurrent, useCostProjection } from '@/hooks/useCostApi';
import styles from './CostDashboard.module.scss';

export default function CostDashboard() {
  const { current, projection, getBurnRatio, isCritical } = useCostStore();
  useCostCurrent();
  useCostProjection();

  const burnRatio = getBurnRatio();
  const critical = isCritical();

  const formatCurrency = (n: number) =>
    `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const barColor =
    burnRatio > 0.9 ? 'var(--risk-high)' :
    burnRatio > 0.7 ? 'var(--risk-medium)' : 'var(--accent-blue)';

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h3>
          <span className={styles.headerIcon}><Wallet size={15} /></span>
          Cost Governance
        </h3>
        {critical && (
          <span style={{ fontSize: '0.65rem', color: 'var(--risk-high)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <TrendingUp size={12} /> OVER BUDGET
          </span>
        )}
      </div>

      <div className={styles.body}>
        {current && (
          <>
            <div className={styles.mainMetrics}>
              <div className={styles.metricBox}>
                <div className={styles.metricLabel}>Monthly Spend</div>
                <div className={styles.metricValue} style={{
                  color: burnRatio > 0.8 ? 'var(--risk-high)' : 'var(--text-primary)'
                }}>
                  {formatCurrency(current.monthlySpend)}
                </div>
                <div className={styles.metricSub}>of {formatCurrency(current.budget)}</div>
              </div>
              <div className={styles.metricBox}>
                <div className={styles.metricLabel}>Cost / Action</div>
                <div className={styles.metricValue}>
                  {formatCurrency(current.costPerAction)}
                </div>
                <div className={styles.metricSub}>per moderation</div>
              </div>
              <div className={styles.metricBox}>
                <div className={styles.metricLabel}>Model Usage</div>
                <div className={styles.metricValue}>
                  {formatCurrency(current.modelUsageCost)}
                </div>
                <div className={styles.metricSub}>AI inference</div>
              </div>
            </div>

            <div className={styles.budgetBar}>
              <div className={styles.budgetHeader}>
                <span className={styles.budgetLabel}>Budget Utilization</span>
                <span className={styles.budgetValue}>{(burnRatio * 100).toFixed(1)}%</span>
              </div>
              <div className={styles.track}>
                <div
                  className={styles.fill}
                  style={{
                    width: `${Math.min(burnRatio * 100, 100)}%`,
                    background: barColor,
                  }}
                />
                <div className={styles.threshold} style={{ left: '80%' }} />
              </div>
            </div>
          </>
        )}

        {projection && (
          <div className={`${styles.projectionBlock} ${projection.willExceedBudget ? styles.danger : styles.safe}`}>
            <div className={styles.projTitle}>
              {projection.willExceedBudget
                ? `Projected overage: ${formatCurrency(projection.projectedOverage)}`
                : 'On track — within budget'}
            </div>
            <div className={styles.projDetails}>
              {projection.daysRemaining} days remaining | Projected: {formatCurrency(projection.projectedMonthly)}
            </div>
            {projection.suggestedActions.length > 0 && (
              <ul className={styles.suggestions}>
                {projection.suggestedActions.map((action, i) => (
                  <li key={i}>{action}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
