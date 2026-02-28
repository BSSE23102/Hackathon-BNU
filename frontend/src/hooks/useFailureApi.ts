'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { FailureSignal } from '@/types';

export function useFailureSignals() {
  const signalCollapse = useQuery({
    queryKey: ['failure', 'signal-collapse'],
    queryFn: () => api.get<FailureSignal>('/api/failure/signal-collapse'),
    refetchInterval: 5_000,
  });

  const humanOverload = useQuery({
    queryKey: ['failure', 'human'],
    queryFn: () => api.get<FailureSignal>('/api/failure/human'),
    refetchInterval: 5_000,
  });

  const budgetExhaustion = useQuery({
    queryKey: ['failure', 'budget'],
    queryFn: () => api.get<FailureSignal>('/api/failure/budget'),
    refetchInterval: 5_000,
  });

  const activeFailures: FailureSignal[] = [];

  if (signalCollapse.data?.active) activeFailures.push(signalCollapse.data);
  if (humanOverload.data?.active) activeFailures.push(humanOverload.data);
  if (budgetExhaustion.data?.active) activeFailures.push(budgetExhaustion.data);

  return {
    signalCollapse,
    humanOverload,
    budgetExhaustion,
    activeFailures,
    hasFailure: activeFailures.length > 0,
  };
}
