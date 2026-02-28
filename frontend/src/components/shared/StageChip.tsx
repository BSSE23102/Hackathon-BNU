'use client';

import styles from './shared.module.scss';
import type { ContentStage } from '@/types';

interface StageChipProps {
  stage: ContentStage;
}

export function StageChip({ stage }: StageChipProps) {
  return <span className={`${styles.stageChip} ${styles[stage]}`}>{stage}</span>;
}
