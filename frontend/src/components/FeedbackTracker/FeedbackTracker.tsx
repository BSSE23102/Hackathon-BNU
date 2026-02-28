'use client';

import { MessageCircle, AlertOctagon } from 'lucide-react';
import { useDecisionStore } from '@/stores/decisionStore';
import { useFeedbackStore } from '@/stores/feedbackStore';
import { useFeedbackConfidence, useFeedbackConflict } from '@/hooks/useFeedbackApi';
import { ConfidenceMeter } from '@/components/shared';
import styles from './FeedbackTracker.module.scss';

export default function FeedbackTracker() {
  const selectedContentId = useDecisionStore((s) => s.selectedContentId);
  const { confidences, conflicts, isPoisoned } = useFeedbackStore();

  useFeedbackConfidence(selectedContentId);
  useFeedbackConflict(selectedContentId);

  const fc = selectedContentId ? confidences.get(selectedContentId) : null;
  const conflict = selectedContentId ? conflicts.get(selectedContentId) : null;
  const poisoned = selectedContentId ? isPoisoned(selectedContentId) : false;

  const getHealthColor = (health: number) =>
    health > 0.7 ? 'var(--risk-low)' :
    health > 0.4 ? 'var(--accent-amber)' : 'var(--risk-high)';

  const getBiasSeverityColor = (severity: number) =>
    severity > 0.7 ? 'var(--risk-high)' :
    severity > 0.4 ? 'var(--accent-amber)' : 'var(--risk-low)';

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h3>
          <span className={styles.headerIcon}><MessageCircle size={15} /></span>
          Feedback Reliability
        </h3>
      </div>

      {!selectedContentId || !fc ? (
        <div className={styles.empty}>Select content for feedback analysis</div>
      ) : (
        <div className={styles.body}>
          {poisoned && (
            <div className={styles.poisonWarning}>
              <AlertOctagon size={14} />
              Feedback loop potentially poisoned — low reliability
            </div>
          )}

          {/* Health gauge */}
          <div className={styles.healthGauge}>
            <div
              className={styles.ring}
              style={{
                borderColor: getHealthColor(fc.loopHealth),
                color: getHealthColor(fc.loopHealth),
              }}
            >
              {(fc.loopHealth * 100).toFixed(0)}
            </div>
            <div className={styles.healthInfo}>
              <div className={styles.healthLabel}>Loop Health</div>
              <div className={styles.healthSubtext}>
                Disagreement: {(fc.reviewerDisagreement * 100).toFixed(0)}%
              </div>
            </div>
          </div>

          <ConfidenceMeter value={fc.labelConfidence} label="Label Confidence" />

          {/* Bias signals */}
          {fc.biasSignals.length > 0 && (
            <div className={styles.biasSignals}>
              <div className={styles.biasTitle}>Bias Signals</div>
              <div className={styles.biasList}>
                {fc.biasSignals.map((signal, i) => (
                  <div key={i} className={styles.biasItem}>
                    <span
                      className={styles.biasDot}
                      style={{ background: getBiasSeverityColor(signal.severity) }}
                    />
                    <span className={styles.biasType}>{signal.type}</span>
                    <span className={styles.biasDesc}>{signal.description}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Conflict */}
          {conflict && conflict.conflictRate > 0 && (
            <div className={styles.conflictBlock}>
              <div className={styles.conflictTitle}>
                Conflict Rate: {(conflict.conflictRate * 100).toFixed(0)}%
              </div>
              <div className={styles.conflictLabels}>
                {conflict.conflictingLabels.map((label, i) => (
                  <span key={i}>{label}</span>
                ))}
              </div>
              <div className={styles.resolution}>
                Resolution: {conflict.resolution}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
