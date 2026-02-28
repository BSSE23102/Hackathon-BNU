'use client';

import { Users, AlertTriangle } from 'lucide-react';
import { useHumanReviewStore } from '@/stores/humanReviewStore';
import { useHumanCapacity } from '@/hooks/useHumanApi';
import styles from './HumanAllocator.module.scss';

export default function HumanAllocator() {
  const { capacity, getQueue, isOverloaded } = useHumanReviewStore();
  useHumanCapacity();

  const queue = getQueue().slice(0, 8);
  const overloaded = isOverloaded();

  const usageRatio = capacity
    ? capacity.usedSlots / capacity.totalSlots
    : 0;

  const barColor =
    usageRatio > 0.9 ? 'var(--risk-high)' :
    usageRatio > 0.7 ? 'var(--risk-medium)' : 'var(--accent-blue)';

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h3>
          <span className={styles.headerIcon}><Users size={15} /></span>
          Human Allocator
        </h3>
        <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 500 }}>
          20/hr limit
        </span>
      </div>

      <div className={styles.body}>
        {overloaded && (
          <div className={styles.overloadWarning}>
            <AlertTriangle size={14} />
            Review capacity exhausted — all slots occupied
          </div>
        )}

        {capacity && (
          <>
            <div className={styles.capacityBar}>
              <div className={styles.capacityHeader}>
                <span className={styles.capacityLabel}>Slot Usage</span>
                <span className={styles.capacityValue}>
                  {capacity.usedSlots}/{capacity.totalSlots}
                </span>
              </div>
              <div className={styles.track}>
                <div
                  className={styles.fill}
                  style={{
                    width: `${usageRatio * 100}%`,
                    background: barColor,
                  }}
                />
              </div>
            </div>

            <div className={styles.stats}>
              <div className={styles.stat}>
                <div className={styles.statLabel}>Available</div>
                <div className={styles.statValue}>{capacity.availableSlots}</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statLabel}>Avg Review</div>
                <div className={styles.statValue}>{capacity.avgReviewTime}s</div>
              </div>
            </div>
          </>
        )}

        {queue.length > 0 && (
          <div className={styles.queue}>
            <div className={styles.queueTitle}>Priority Queue</div>
            <div className={styles.queueList}>
              {queue.map((item, i) => (
                <div key={item.contentId} className={styles.queueItem}>
                  <span className={styles.position}>#{i + 1}</span>
                  <span className={styles.contentId}>
                    {item.contentId.slice(0, 12)}
                  </span>
                  <span className={styles.priority}>
                    {(item.priorityScore * 100).toFixed(0)}
                  </span>
                  <span className={styles.expectedValue}>
                    EV: {item.expectedValue.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
