import { create } from 'zustand';
import type { DecisionRecommendation, TrustPrediction, StageMetadata } from '@/types';

interface DecisionState {
  recommendations: Map<string, DecisionRecommendation>;
  trustPredictions: Map<string, TrustPrediction>;
  meta: Map<string, StageMetadata>;
  selectedContentId: string | null;

  setRecommendation: (rec: DecisionRecommendation) => void;
  setTrustPrediction: (pred: TrustPrediction) => void;
  selectContent: (id: string | null) => void;
  getConfidenceShift: (id: string) => number;
}

export const useDecisionStore = create<DecisionState>((set, get) => ({
  recommendations: new Map(),
  trustPredictions: new Map(),
  meta: new Map(),
  selectedContentId: null,

  setRecommendation: (rec) =>
    set((state) => {
      const recommendations = new Map(state.recommendations);
      const meta = new Map(state.meta);
      const prev = recommendations.get(rec.contentId);
      recommendations.set(rec.contentId, rec);
      meta.set(rec.contentId, {
        lastUpdated: Date.now(),
        confidence: rec.confidence,
        decayApplied: false,
        stale: prev ? Math.abs(prev.confidence - rec.confidence) > 0.2 : false,
      });
      return { recommendations, meta };
    }),

  setTrustPrediction: (pred) =>
    set((state) => {
      const trustPredictions = new Map(state.trustPredictions);
      trustPredictions.set(pred.contentId, pred);
      return { trustPredictions };
    }),

  selectContent: (id) => set({ selectedContentId: id }),

  getConfidenceShift: (id) => {
    const meta = get().meta.get(id);
    const rec = get().recommendations.get(id);
    if (!meta || !rec) return 0;
    return rec.confidence - meta.confidence;
  },
}));
