'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useFeedbackStore } from '@/stores/feedbackStore';
import type { FeedbackConfidence, FeedbackConflict } from '@/types';

export function useFeedbackConfidence(contentId: string | null) {
  const { setConfidence } = useFeedbackStore();

  return useQuery({
    queryKey: ['feedback', 'confidence', contentId],
    queryFn: async () => {
      const data = await api.get<FeedbackConfidence>(
        `/api/feedback/confidence?id=${contentId}`
      );
      setConfidence(data);
      return data;
    },
    enabled: !!contentId,
    refetchInterval: 15_000,
  });
}

export function useFeedbackConflict(contentId: string | null) {
  const { setConflict } = useFeedbackStore();

  return useQuery({
    queryKey: ['feedback', 'conflict', contentId],
    queryFn: async () => {
      const data = await api.get<FeedbackConflict>(
        `/api/feedback/conflict?id=${contentId}`
      );
      setConflict(data);
      return data;
    },
    enabled: !!contentId,
    refetchInterval: 15_000,
  });
}
