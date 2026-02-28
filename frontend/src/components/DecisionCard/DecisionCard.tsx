'use client';

import { Scale } from 'lucide-react';
import { useDecisionStore } from '@/stores/decisionStore';
import { useDecisionRecommend, useTrustPrediction } from '@/hooks/useDecisionApi';
import { ConfidenceMeter, ScoreBar, UncertaintyBadge } from '@/components/shared';
import styles from './DecisionCard.module.scss';

export default function DecisionCard() {
  const selectedContentId = useDecisionStore((s) => s.selectedContentId);
  const recommendations = useDecisionStore((s) => s.recommendations);
  const trustPredictions = useDecisionStore((s) => s.trustPredictions);

  useDecisionRecommend(selectedContentId);
  useTrustPrediction(selectedContentId);

  const rec = selectedContentId ? recommendations.get(selectedContentId) : null;
  const trust = selectedContentId ? trustPredictions.get(selectedContentId) : null;

  const confidenceShift = rec && trust
    ? trust.predictedTrust - trust.currentTrust
    : 0;

  const shiftClass =
    confidenceShift > 0.05 ? styles.positive :
    confidenceShift < -0.05 ? styles.negative : styles.neutral;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3>
          <span className={styles.headerIcon}><Scale size={15} /></span>
          Decision Support
        </h3>
        {rec && <UncertaintyBadge level={1 - rec.confidence} />}
      </div>

      {!selectedContentId || !rec ? (
        <div className={styles.empty}>Select content for decision analysis</div>
      ) : (
        <div className={styles.body}>
          {/* Action scores */}
          <div className={styles.scores}>
            <ScoreBar
              label="Auto-action"
              value={rec.autoActionScore}
              color="var(--accent-blue)"
            />
            <ScoreBar
              label="Escalation"
              value={rec.escalationScore}
              color="var(--accent-amber)"
            />
            <ScoreBar
              label="Defer"
              value={rec.deferScore}
              color="var(--accent-purple)"
            />
          </div>

          {/* Trust block */}
          {trust && (
            <div className={styles.trustBlock}>
              <div className={styles.trustItem}>
                <div className={styles.trustLabel}>Current Trust</div>
                <div className={styles.trustValue}>
                  {(trust.currentTrust * 100).toFixed(1)}%
                </div>
              </div>
              <div className={styles.trustItem}>
                <div className={styles.trustLabel}>Predicted Trust</div>
                <div className={styles.trustValue}>
                  {(trust.predictedTrust * 100).toFixed(1)}%
                </div>
              </div>
              <div className={styles.trustItem}>
                <div className={styles.trustLabel}>Volatility</div>
                <div className={styles.trustValue}>
                  {(trust.volatility * 100).toFixed(1)}%
                </div>
              </div>
              <div className={styles.trustItem}>
                <div className={styles.trustLabel}>Trust Shift</div>
                <div className={`${styles.confidenceShift} ${shiftClass}`}>
                  {confidenceShift > 0 ? '+' : ''}{(confidenceShift * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          )}

          {/* Trust impact */}
          <ConfidenceMeter value={rec.confidence} label="Decision Confidence" />

          {/* Reasoning */}
          {rec.reasoning.length > 0 && (
            <div className={styles.reasoning}>
              <div className={styles.reasonTitle}>Reasoning Signals</div>
              <ul className={styles.reasonList}>
                {rec.reasoning.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
