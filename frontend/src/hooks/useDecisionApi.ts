'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useSocket } from './useSocket';
import { useDecisionStore } from '@/stores/decisionStore';
import { NAMESPACES } from '@/lib/socket';
import type { DecisionRecommendation, TrustPrediction } from '@/types';

export function useDecisionRecommend(contentId: string | null) {
  const { setRecommendation } = useDecisionStore();

  const query = useQuery({
    queryKey: ['decision', 'recommend', contentId],
    queryFn: async () => {
      const data = await api.get<DecisionRecommendation>(
        `/api/decision/recommend?id=${contentId}`
      );
      setRecommendation(data);
      return data;
    },
    enabled: !!contentId,
    refetchInterval: 10_000,
  });

  useSocket(NAMESPACES.DECISION, {
    'decision:update': (data) => setRecommendation(data as DecisionRecommendation),
  });

  return query;
}

export function useTrustPrediction(contentId: string | null) {
  const { setTrustPrediction } = useDecisionStore();

  return useQuery({
    queryKey: ['trust', 'prediction', contentId],
    queryFn: async () => {
      const data = await api.get<TrustPrediction>(
        `/api/trust/prediction?id=${contentId}`
      );
      setTrustPrediction(data);
      return data;
    },
    enabled: !!contentId,
    refetchInterval: 15_000,
  });
}
