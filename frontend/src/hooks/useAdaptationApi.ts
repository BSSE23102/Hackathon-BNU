'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAdaptationStore } from '@/stores/adaptationStore';
import type { AdaptationUsage, AdaptationRisk, RotationSuggestion } from '@/types';

export function useAdaptationUsage() {
  const { setUsage } = useAdaptationStore();

  return useQuery({
    queryKey: ['adaptation', 'usage'],
    queryFn: async () => {
      const data = await api.get<AdaptationUsage>('/api/adaptation/usage');
      setUsage(data);
      return data;
    },
    refetchInterval: 20_000,
  });
}

export function useAdaptationRisk() {
  const { setRisk } = useAdaptationStore();

  return useQuery({
    queryKey: ['adaptation', 'risk'],
    queryFn: async () => {
      const data = await api.get<AdaptationRisk>('/api/adaptation/risk');
      setRisk(data);
      return data;
    },
    refetchInterval: 15_000,
  });
}

export function useAdaptationRotate() {
  const { setRotation } = useAdaptationStore();

  return useQuery({
    queryKey: ['adaptation', 'rotate'],
    queryFn: async () => {
      const data = await api.get<RotationSuggestion>('/api/adaptation/rotate');
      setRotation(data);
      return data;
    },
    refetchInterval: 60_000,
  });
}
