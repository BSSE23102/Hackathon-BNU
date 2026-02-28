import { create } from 'zustand';
import type { HumanCapacity, ReviewPriority, StageMetadata } from '@/types';

interface HumanReviewState {
  capacity: HumanCapacity | null;
  priorities: Map<string, ReviewPriority>;
  meta: StageMetadata | null;

  setCapacity: (cap: HumanCapacity) => void;
  setPriority: (p: ReviewPriority) => void;
  getQueue: () => ReviewPriority[];
  isOverloaded: () => boolean;
}

export const useHumanReviewStore = create<HumanReviewState>((set, get) => ({
  capacity: null,
  priorities: new Map(),
  meta: null,

  setCapacity: (cap) =>
    set({
      capacity: cap,
      meta: {
        lastUpdated: Date.now(),
        confidence: cap.availableSlots / cap.totalSlots,
        decayApplied: false,
        stale: false,
      },
    }),

  setPriority: (p) =>
    set((state) => {
      const priorities = new Map(state.priorities);
      priorities.set(p.contentId, p);
      return { priorities };
    }),

  getQueue: () => {
    const arr = Array.from(get().priorities.values());
    return arr.sort((a, b) => b.priorityScore - a.priorityScore);
  },

  isOverloaded: () => {
    const cap = get().capacity;
    if (!cap) return false;
    return cap.availableSlots <= 0;
  },
}));
