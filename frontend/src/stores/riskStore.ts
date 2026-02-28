import { create } from 'zustand';
import type { RiskSnapshot, RiskDecay, StageMetadata } from '@/types';

interface RiskState {
  snapshots: Map<string, RiskSnapshot[]>;
  decays: Map<string, RiskDecay>;
  meta: Map<string, StageMetadata>;

  pushSnapshot: (snap: RiskSnapshot) => void;
  setDecay: (decay: RiskDecay) => void;
  getTimeline: (contentId: string) => RiskSnapshot[];
  getLatestScore: (contentId: string) => number | null;
}

const MAX_HISTORY = 50;

export const useRiskStore = create<RiskState>((set, get) => ({
  snapshots: new Map(),
  decays: new Map(),
  meta: new Map(),

  pushSnapshot: (snap) =>
    set((state) => {
      const snapshots = new Map(state.snapshots);
      const existing = snapshots.get(snap.contentId) || [];
      const updated = [...existing, snap].slice(-MAX_HISTORY);
      snapshots.set(snap.contentId, updated);
      const meta = new Map(state.meta);
      meta.set(snap.contentId, {
        lastUpdated: Date.now(),
        confidence: snap.score,
        decayApplied: snap.decayFactor < 1,
        stale: false,
      });
      return { snapshots, meta };
    }),

  setDecay: (decay) =>
    set((state) => {
      const decays = new Map(state.decays);
      decays.set(decay.contentId, decay);
      return { decays };
    }),

  getTimeline: (contentId) => get().snapshots.get(contentId) || [],

  getLatestScore: (contentId) => {
    const history = get().snapshots.get(contentId);
    if (!history || history.length === 0) return null;
    return history[history.length - 1].score;
  },
}));
