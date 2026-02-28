'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useSocket } from './useSocket';
import { useHumanReviewStore } from '@/stores/humanReviewStore';
import { NAMESPACES } from '@/lib/socket';
import type { HumanCapacity, ReviewPriority } from '@/types';

export function useHumanCapacity() {
  const { setCapacity } = useHumanReviewStore();

  const query = useQuery({
    queryKey: ['human', 'capacity'],
    queryFn: async () => {
      const data = await api.get<HumanCapacity>('/api/human/capacity');
      setCapacity(data);
      return data;
    },
    refetchInterval: 5_000,
  });

  useSocket(NAMESPACES.HUMAN, {
    'human:capacity': (data) => setCapacity(data as HumanCapacity),
    'human:priority': (data) => {
      useHumanReviewStore.getState().setPriority(data as ReviewPriority);
    },
  });

  return query;
}

export function useHumanPriority(contentId: string | null) {
  const { setPriority } = useHumanReviewStore();

  return useQuery({
    queryKey: ['human', 'priority', contentId],
    queryFn: async () => {
      const data = await api.get<ReviewPriority>(
        `/api/human/priority?id=${contentId}`
      );
      setPriority(data);
      return data;
    },
    enabled: !!contentId,
    refetchInterval: 8_000,
  });
}

export function useAmbiguity(contentId: string | null) {
  return useQuery({
    queryKey: ['ai', 'ambiguity', contentId],
    queryFn: () => api.get<{ ambiguityLevel: number }>(`/api/ai/ambiguity?id=${contentId}`),
    enabled: !!contentId,
  });
}
