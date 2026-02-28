'use client';

import { useEffect } from 'react';
import { Radio } from 'lucide-react';
import { useContentStore } from '@/stores/contentStore';
import { useDecisionStore } from '@/stores/decisionStore';
import { useContentStream } from '@/hooks/useContentApi';
import { StageChip, DecayIndicator } from '@/components/shared';
import type { ContentStage } from '@/types';
import styles from './ContentStream.module.scss';

const STAGES: (ContentStage | null)[] = [null, 'arriving', 'queued', 'analyzing', 'deciding', 'reviewing', 'acted'];

export default function ContentStream() {
  const { items, stageFilter, setFilter } = useContentStore();
  const { selectContent, selectedContentId } = useDecisionStore();
  const { data, isLoading } = useContentStream();

  const { upsertItem } = useContentStore();
  useEffect(() => {
    if (data) {
      data.forEach((item) => upsertItem(item));
    }
  }, [data, upsertItem]);

  const filtered = Array.from(items.values())
    .filter((item) => !stageFilter || item.stage === stageFilter)
    .sort((a, b) => b.timestamp - a.timestamp);

  const getRiskColor = (risk: number) =>
    risk > 0.7 ? 'var(--risk-high)' : risk > 0.4 ? 'var(--risk-medium)' : 'var(--risk-low)';

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h3>
          <span className={styles.headerIcon}><Radio size={15} /></span>
          Live Content Stream
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500 }}>
            {filtered.length} items
          </span>
          <span className={styles.liveIndicator} />
        </div>
      </div>

      <div className={styles.filters}>
        {STAGES.map((stage) => (
          <button
            key={stage ?? 'all'}
            className={stageFilter === stage ? styles.active : ''}
            onClick={() => setFilter(stage)}
          >
            {stage ?? 'All'}
          </button>
        ))}
      </div>

      <div className={styles.list}>
        {isLoading && <div className={styles.empty}>Connecting to content stream...</div>}
        {!isLoading && filtered.length === 0 && (
          <div className={styles.empty}>No content in current filter</div>
        )}
        {filtered.map((item) => (
          <div
            key={item.id}
            className={`${styles.item} ${selectedContentId === item.id ? styles.selected : ''}`}
            onClick={() => selectContent(item.id)}
          >
            <span className={styles.id}>{item.id.slice(0, 12)}</span>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <StageChip stage={item.stage} />
              <span className={styles.lang}>
                {item.languageGuess} ({Math.round(item.languageConfidence * 100)}%)
              </span>
            </div>
            <DecayIndicator decayFactor={item.decayFactor} />
            <span className={styles.risk} style={{ color: getRiskColor(item.initialRisk) }}>
              {(item.initialRisk * 100).toFixed(0)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
