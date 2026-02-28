'use client';

import { Activity } from 'lucide-react';
import ContentStream from '@/components/ContentStream/ContentStream';
import RiskTimeline from '@/components/RiskTimeline/RiskTimeline';
import DecisionCard from '@/components/DecisionCard/DecisionCard';
import HumanAllocator from '@/components/HumanAllocator/HumanAllocator';
import ContextPanel from '@/components/ContextPanel/ContextPanel';
import FeedbackTracker from '@/components/FeedbackTracker/FeedbackTracker';
import CostDashboard from '@/components/CostDashboard/CostDashboard';
import AdaptationMonitor from '@/components/AdaptationMonitor/AdaptationMonitor';
import FailureOverlay from '@/components/FailureOverlay/FailureOverlay';
import styles from './dashboard.module.scss';

export default function DashboardPage() {
  return (
    <>
      <FailureOverlay />

      <div className={styles.dashboard}>
        {/* Top bar */}
        <div className={styles.topBar}>
          <div className={styles.branding}>
            <h1><Activity size={20} style={{ marginRight: 8, verticalAlign: 'middle' }} />Adaptive Moderation</h1>
            <span className={styles.subtitle}>Real-time decision support under uncertainty</span>
          </div>
          <div className={styles.status}>
            <span className={`${styles.connDot} ${styles.connected}`} />
            <span>Live</span>
          </div>
        </div>

        {/* Row 1: Content ingest + Risk analysis */}
        <div className={`${styles.row} ${styles.cols2}`}>
          <ContentStream />
          <RiskTimeline />
        </div>

        {/* Row 2: Decision + Human allocation */}
        <div className={`${styles.row} ${styles.cols2}`}>
          <DecisionCard />
          <HumanAllocator />
        </div>

        {/* Row 3: Context + Feedback + Cost */}
        <div className={`${styles.row} ${styles.cols3}`}>
          <ContextPanel />
          <FeedbackTracker />
          <CostDashboard />
        </div>

        {/* Row 4: Adaptation */}
        <AdaptationMonitor />
      </div>
    </>
  );
}
