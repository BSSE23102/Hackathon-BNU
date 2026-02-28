import { create } from 'zustand';
import type { FeedbackConfidence, FeedbackConflict, StageMetadata } from '@/types';

interface FeedbackState {
  confidences: Map<string, FeedbackConfidence>;
  conflicts: Map<string, FeedbackConflict>;
  meta: Map<string, StageMetadata>;

  setConfidence: (fc: FeedbackConfidence) => void;
  setConflict: (fc: FeedbackConflict) => void;
  isPoisoned: (contentId: string) => boolean;
  getLoopHealth: (contentId: string) => number;
}

export const useFeedbackStore = create<FeedbackState>((set, get) => ({
  confidences: new Map(),
  conflicts: new Map(),
  meta: new Map(),

  setConfidence: (fc) =>
    set((state) => {
      const confidences = new Map(state.confidences);
      const meta = new Map(state.meta);
      confidences.set(fc.contentId, fc);
      meta.set(fc.contentId, {
        lastUpdated: Date.now(),
        confidence: fc.labelConfidence,
        decayApplied: false,
        stale: fc.loopHealth < 0.3,
      });
      return { confidences, meta };
    }),

  setConflict: (fc) =>
    set((state) => {
      const conflicts = new Map(state.conflicts);
      conflicts.set(fc.contentId, fc);
      return { conflicts };
    }),

  isPoisoned: (contentId) => {
    const fc = get().confidences.get(contentId);
    return fc ? fc.loopHealth < 0.2 : false;
  },

  getLoopHealth: (contentId) => {
    const fc = get().confidences.get(contentId);
    return fc?.loopHealth ?? 1;
  },
}));
