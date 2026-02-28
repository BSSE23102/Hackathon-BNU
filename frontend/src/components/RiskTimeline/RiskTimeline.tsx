'use client';

import { ShieldAlert } from 'lucide-react';
import { useDecisionStore } from '@/stores/decisionStore';
import { useRiskStore } from '@/stores/riskStore';
import { useRiskCurrent, useRiskDecay } from '@/hooks/useRiskApi';
import { ConfidenceMeter, DecayIndicator } from '@/components/shared';
import styles from './RiskTimeline.module.scss';

export default function RiskTimeline() {
  const selectedContentId = useDecisionStore((s) => s.selectedContentId);
  const getTimeline = useRiskStore((s) => s.getTimeline);
  const decays = useRiskStore((s) => s.decays);

  useRiskCurrent(selectedContentId);
  const { data: decay } = useRiskDecay(selectedContentId);

  const timeline = selectedContentId ? getTimeline(selectedContentId) : [];
  const decayData = selectedContentId ? decays.get(selectedContentId) : null;

  const getRiskColor = (score: number) =>
    score > 0.7 ? 'var(--risk-high)' : score > 0.4 ? 'var(--risk-medium)' : 'var(--risk-low)';

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h3>
          <span className={styles.headerIcon}><ShieldAlert size={15} /></span>
          Risk Timeline
        </h3>
      </div>

      {!selectedContentId ? (
        <div className={styles.empty}>Select content to view risk evolution</div>
      ) : (
        <div className={styles.body}>
          {/* Mini bar chart */}
          {timeline.length > 0 && (
            <div className={styles.chart}>
              {timeline.map((snap, i) => (
                <div
                  key={i}
                  className={styles.bar}
                  style={{
                    height: `${Math.max(snap.score * 100, 4)}%`,
                    background: getRiskColor(snap.score),
                    opacity: 0.5 + snap.decayFactor * 0.5,
                  }}
                  data-tooltip={`${(snap.score * 100).toFixed(0)}% — ${snap.model}`}
                />
              ))}
            </div>
          )}

          {/* Decay stats */}
          {decayData && (
            <div className={styles.decayInfo}>
              <div className={styles.stat}>
                <div className={styles.statLabel}>Current Score</div>
                <div className={styles.statValue} style={{ color: getRiskColor(decayData.currentScore) }}>
                  {(decayData.currentScore * 100).toFixed(1)}%
                </div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statLabel}>Half-Life</div>
                <div className={styles.statValue}>{(decayData.halfLife / 1000).toFixed(0)}s</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statLabel}>Decay Rate</div>
                <div className={styles.statValue}>{(decayData.decayRate * 100).toFixed(1)}%</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statLabel}>Elapsed</div>
                <div className={styles.statValue}>{(decayData.elapsed / 1000).toFixed(0)}s</div>
              </div>
            </div>
          )}

          {/* Snapshot list */}
          <div className={styles.timeline} style={{ marginTop: '12px' }}>
            {timeline.slice().reverse().slice(0, 10).map((snap, i) => (
              <div key={i} className={styles.snapshot}>
                <span className={styles.time}>{formatTime(snap.timestamp)}</span>
                <span className={styles.model}>{snap.model}</span>
                <span className={styles.score} style={{ color: getRiskColor(snap.score) }}>
                  {(snap.score * 100).toFixed(0)}%
                </span>
                <span className={styles.decay}>
                  <DecayIndicator decayFactor={snap.decayFactor} />
                </span>
              </div>
            ))}
          </div>

          {timeline.length > 0 && (
            <div style={{ marginTop: '12px' }}>
              <ConfidenceMeter
                value={timeline[timeline.length - 1].score}
                label="Latest Risk Confidence"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
