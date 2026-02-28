'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { ContextAnalysis } from '@/types';

export function useContextAnalysis(contentId: string | null) {
  return useQuery({
    queryKey: ['ai', 'context', contentId],
    queryFn: () => api.get<ContextAnalysis>(`/api/ai/context?id=${contentId}`),
    enabled: !!contentId,
    refetchInterval: 20_000,
  });
}

export function useTranslationRisk(contentId: string | null) {
  return useQuery({
    queryKey: ['ai', 'translation-risk', contentId],
    queryFn: () =>
      api.get<{ translationRisk: number; details: string }>(
        `/api/ai/translation-risk?id=${contentId}`
      ),
    enabled: !!contentId,
    refetchInterval: 30_000,
  });
}
