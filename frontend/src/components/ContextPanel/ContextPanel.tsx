'use client';

import { Globe, Languages } from 'lucide-react';
import { useDecisionStore } from '@/stores/decisionStore';
import { useContextAnalysis, useTranslationRisk } from '@/hooks/useContextApi';
import { ConfidenceMeter, UncertaintyBadge, ScoreBar } from '@/components/shared';
import styles from './ContextPanel.module.scss';

export default function ContextPanel() {
  const selectedContentId = useDecisionStore((s) => s.selectedContentId);
  const { data: context } = useContextAnalysis(selectedContentId);
  const { data: translationData } = useTranslationRisk(selectedContentId);

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h3>
          <span className={styles.headerIcon}><Globe size={15} /></span>
          Multilingual Context
        </h3>
      </div>

      {!selectedContentId || !context ? (
        <div className={styles.empty}>Select content for context analysis</div>
      ) : (
        <div className={styles.body}>
          <div className={styles.langHeader}>
            <span className={styles.langName}>{context.detectedLanguage}</span>
            {context.dialectHint && (
              <span className={styles.dialectHint}>{context.dialectHint}</span>
            )}
            <UncertaintyBadge level={context.ambiguityLevel} />
          </div>

          <div className={styles.metrics}>
            <div className={styles.metric}>
              <div className={styles.metricLabel}>Context Dependency</div>
              <div className={styles.metricValue}>
                {(context.contextDependencyScore * 100).toFixed(0)}%
              </div>
            </div>
            <div className={styles.metric}>
              <div className={styles.metricLabel}>Translation Risk</div>
              <div className={styles.metricValue} style={{
                color: context.translationRisk > 0.6 ? 'var(--risk-high)' : 'var(--text-primary)'
              }}>
                {(context.translationRisk * 100).toFixed(0)}%
              </div>
            </div>
            <div className={styles.metric}>
              <div className={styles.metricLabel}>Ambiguity Level</div>
              <div className={styles.metricValue}>
                {(context.ambiguityLevel * 100).toFixed(0)}%
              </div>
            </div>
            <div className={styles.metric}>
              <div className={styles.metricLabel}>Cultural Sensitivity</div>
              <div className={styles.metricValue}>
                {(context.culturalSensitivity * 100).toFixed(0)}%
              </div>
            </div>
          </div>

          <ScoreBar
            label="Context Dep."
            value={context.contextDependencyScore}
            color="var(--accent-purple)"
          />
          <ScoreBar
            label="Trans. Risk"
            value={context.translationRisk}
            color="var(--accent-amber)"
          />

          <ConfidenceMeter
            value={1 - context.ambiguityLevel}
            label="Context Clarity"
          />

          {translationData && (
            <div className={styles.contextBar}>
              <span className={styles.contextIcon}><Languages size={16} /></span>
              <span className={styles.contextText}>
                {translationData.details || 'Translation analysis available'}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
