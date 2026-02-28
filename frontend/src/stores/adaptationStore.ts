import { create } from 'zustand';
import type { AdaptationUsage, AdaptationRisk, RotationSuggestion, StageMetadata } from '@/types';

interface AdaptationState {
  usage: AdaptationUsage | null;
  risk: AdaptationRisk | null;
  rotation: RotationSuggestion | null;
  meta: StageMetadata | null;

  setUsage: (u: AdaptationUsage) => void;
  setRisk: (r: AdaptationRisk) => void;
  setRotation: (r: RotationSuggestion) => void;
  isPredictable: () => boolean;
  needsRotation: () => boolean;
}

export const useAdaptationStore = create<AdaptationState>((set, get) => ({
  usage: null,
  risk: null,
  rotation: null,
  meta: null,

  setUsage: (u) =>
    set({
      usage: u,
      meta: {
        lastUpdated: Date.now(),
        confidence: u.diversityScore,
        decayApplied: false,
        stale: false,
      },
    }),

  setRisk: (r) => set({ risk: r }),
  setRotation: (r) => set({ rotation: r }),

  isPredictable: () => {
    const risk = get().risk;
    return risk ? risk.predictabilityScore > 0.7 : false;
  },

  needsRotation: () => {
    const risk = get().risk;
    return risk ? risk.rotationUrgency > 0.6 : false;
  },
}));
