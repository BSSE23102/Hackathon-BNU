'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useSocket } from './useSocket';
import { useRiskStore } from '@/stores/riskStore';
import { NAMESPACES } from '@/lib/socket';
import type { RiskSnapshot, RiskDecay } from '@/types';

export function useRiskCurrent(contentId: string | null) {
  const { pushSnapshot } = useRiskStore();

  const query = useQuery({
    queryKey: ['risk', 'current', contentId],
    queryFn: () => api.get<RiskSnapshot>(`/api/risk/current?id=${contentId}`),
    enabled: !!contentId,
    refetchInterval: 8_000,
  });

  useSocket(NAMESPACES.RISK, {
    'risk:update': (data) => {
      const snap = data as RiskSnapshot;
      pushSnapshot(snap);
    },
  });

  return query;
}

export function useRiskDecay(contentId: string | null) {
  const { setDecay } = useRiskStore();

  return useQuery({
    queryKey: ['risk', 'decay', contentId],
    queryFn: async () => {
      const data = await api.get<RiskDecay>(`/api/risk/decay?id=${contentId}`);
      setDecay(data);
      return data;
    },
    enabled: !!contentId,
    refetchInterval: 12_000,
  });
}
