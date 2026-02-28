import { create } from 'zustand';
import type { CostCurrent, CostProjection, StageMetadata } from '@/types';

interface CostState {
  current: CostCurrent | null;
  projection: CostProjection | null;
  meta: StageMetadata | null;
  history: { timestamp: number; spend: number }[];

  setCurrent: (c: CostCurrent) => void;
  setProjection: (p: CostProjection) => void;
  getBurnRatio: () => number;
  isCritical: () => boolean;
}

const MAX_COST_HISTORY = 100;

export const useCostStore = create<CostState>((set, get) => ({
  current: null,
  projection: null,
  meta: null,
  history: [],

  setCurrent: (c) =>
    set((state) => ({
      current: c,
      meta: {
        lastUpdated: Date.now(),
        confidence: 1 - c.monthlySpend / c.budget,
        decayApplied: false,
        stale: false,
      },
      history: [
        ...state.history.slice(-MAX_COST_HISTORY + 1),
        { timestamp: Date.now(), spend: c.monthlySpend },
      ],
    })),

  setProjection: (p) => set({ projection: p }),

  getBurnRatio: () => {
    const c = get().current;
    if (!c || c.budget === 0) return 0;
    return c.monthlySpend / c.budget;
  },

  isCritical: () => {
    const p = get().projection;
    return p?.willExceedBudget ?? false;
  },
}));
