import { create } from 'zustand';
import type { ContentItem, ContentStage, StageMetadata } from '@/types';

interface ContentState {
  items: Map<string, ContentItem>;
  meta: Map<string, StageMetadata>;
  stageFilter: ContentStage | null;

  upsertItem: (item: ContentItem) => void;
  updateStage: (id: string, stage: ContentStage) => void;
  applyDecay: (id: string, factor: number) => void;
  setFilter: (stage: ContentStage | null) => void;
  getStale: () => ContentItem[];
}

const STALE_THRESHOLD_MS = 30_000;

export const useContentStore = create<ContentState>((set, get) => ({
  items: new Map(),
  meta: new Map(),
  stageFilter: null,

  upsertItem: (item) =>
    set((state) => {
      const items = new Map(state.items);
      const meta = new Map(state.meta);
      items.set(item.id, item);
      meta.set(item.id, {
        lastUpdated: Date.now(),
        confidence: item.languageConfidence,
        decayApplied: false,
        stale: false,
      });
      return { items, meta };
    }),

  updateStage: (id, stage) =>
    set((state) => {
      const items = new Map(state.items);
      const existing = items.get(id);
      if (!existing) return state;
      items.set(id, { ...existing, stage });
      const meta = new Map(state.meta);
      meta.set(id, {
        ...(meta.get(id) || { confidence: 0, decayApplied: false, stale: false }),
        lastUpdated: Date.now(),
      });
      return { items, meta };
    }),

  applyDecay: (id, factor) =>
    set((state) => {
      const items = new Map(state.items);
      const existing = items.get(id);
      if (!existing) return state;
      items.set(id, {
        ...existing,
        initialRisk: existing.initialRisk * factor,
        decayFactor: factor,
      });
      const meta = new Map(state.meta);
      meta.set(id, {
        ...(meta.get(id) || { confidence: 0, stale: false }),
        lastUpdated: Date.now(),
        decayApplied: true,
      });
      return { items, meta };
    }),

  setFilter: (stage) => set({ stageFilter: stage }),

  getStale: () => {
    const { items, meta } = get();
    const now = Date.now();
    const stale: ContentItem[] = [];
    items.forEach((item, id) => {
      const m = meta.get(id);
      if (m && now - m.lastUpdated > STALE_THRESHOLD_MS) {
        stale.push(item);
      }
    });
    return stale;
  },
}));
