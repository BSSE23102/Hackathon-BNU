'use client';

import { Shuffle, AlertCircle } from 'lucide-react';
import { useAdaptationStore } from '@/stores/adaptationStore';
import { useAdaptationUsage, useAdaptationRisk, useAdaptationRotate } from '@/hooks/useAdaptationApi';
import { ScoreBar } from '@/components/shared';
import styles from './AdaptationMonitor.module.scss';

export default function AdaptationMonitor() {
  const { usage, risk, rotation, isPredictable, needsRotation } = useAdaptationStore();
  useAdaptationUsage();
  useAdaptationRisk();
  useAdaptationRotate();

  const getDiversityColor = (score: number) =>
    score > 0.7 ? 'var(--risk-low)' :
    score > 0.4 ? 'var(--accent-amber)' : 'var(--risk-high)';

  const getEffColor = (eff: number) =>
    eff > 0.7 ? 'var(--risk-low)' :
    eff > 0.4 ? 'var(--accent-amber)' : 'var(--risk-high)';

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h3>
          <span className={styles.headerIcon}><Shuffle size={15} /></span>
          Adaptation Monitor
        </h3>
        {isPredictable() && (
          <span style={{ fontSize: '0.65rem', color: 'var(--risk-high)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <AlertCircle size={12} /> PREDICTABLE
          </span>
        )}
      </div>

      <div className={styles.body}>
        {/* Diversity gauge */}
        {usage && (
          <div className={styles.diversityGauge}>
            <div
              className={styles.gaugeRing}
              style={{
                borderColor: getDiversityColor(usage.diversityScore),
                color: getDiversityColor(usage.diversityScore),
              }}
            >
              {(usage.diversityScore * 100).toFixed(0)}
            </div>
            <div className={styles.gaugeInfo}>
              <div className={styles.gaugeLabel}>Technique Diversity</div>
              <div className={styles.gaugeDesc}>
                {usage.techniques.length} techniques active
              </div>
            </div>
          </div>
        )}

        {/* Risk alert */}
        {risk && (
          <div className={`${styles.riskAlert} ${
            risk.predictabilityScore > 0.7 ? styles.critical :
            risk.predictabilityScore > 0.4 ? styles.warning : styles.ok
          }`}>
            <div className={styles.alertTitle}>
              Predictability: {(risk.predictabilityScore * 100).toFixed(0)}%
            </div>
            <div className={styles.alertDesc}>
              Detection risk: {(risk.detectionRisk * 100).toFixed(0)}% |
              Rotation urgency: {(risk.rotationUrgency * 100).toFixed(0)}%
            </div>
          </div>
        )}

        {risk && (
          <>
            <ScoreBar
              label="Predictability"
              value={risk.predictabilityScore}
              color="var(--risk-high)"
            />
            <ScoreBar
              label="Detection Risk"
              value={risk.detectionRisk}
              color="var(--accent-amber)"
            />
          </>
        )}

        {/* Technique list */}
        {usage && usage.techniques.length > 0 && (
          <div className={styles.techniques}>
            <div className={styles.techTitle}>Active Techniques</div>
            <div className={styles.techList}>
              {usage.techniques.map((tech) => (
                <div key={tech.name} className={styles.techItem}>
                  <span className={styles.techName}>{tech.name}</span>
                  <span className={styles.techUsage}>×{tech.usageCount}</span>
                  <span className={styles.techEff} style={{ color: getEffColor(tech.effectiveness) }}>
                    {(tech.effectiveness * 100).toFixed(0)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rotation suggestion */}
        {rotation && needsRotation() && (
          <div className={styles.rotation}>
            <div className={styles.rotTitle}>Rotation Suggested</div>
            <div className={styles.rotDetail}>
              Switch from <strong>{rotation.currentTechnique}</strong> to{' '}
              <strong>{rotation.suggestedTechnique}</strong>
              <br />
              {rotation.reason}
            </div>
            <div className={styles.rotImprovement}>
              Expected improvement: +{(rotation.expectedImprovement * 100).toFixed(0)}%
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
