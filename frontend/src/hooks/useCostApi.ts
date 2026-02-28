'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useCostStore } from '@/stores/costStore';
import { useSocket } from './useSocket';
import { NAMESPACES } from '@/lib/socket';
import type { CostCurrent, CostProjection } from '@/types';

export function useCostCurrent() {
  const { setCurrent } = useCostStore();

  const query = useQuery({
    queryKey: ['cost', 'current'],
    queryFn: async () => {
      const data = await api.get<CostCurrent>('/api/cost/current');
      setCurrent(data);
      return data;
    },
    refetchInterval: 10_000,
  });

  useSocket(NAMESPACES.COST, {
    'cost:update': (data) => setCurrent(data as CostCurrent),
  });

  return query;
}

export function useCostProjection() {
  const { setProjection } = useCostStore();

  return useQuery({
    queryKey: ['cost', 'projection'],
    queryFn: async () => {
      const data = await api.get<CostProjection>('/api/cost/projection');
      setProjection(data);
      return data;
    },
    refetchInterval: 30_000,
  });
}
