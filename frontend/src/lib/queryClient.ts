'use client';

import { QueryClient } from '@tanstack/react-query';

let client: QueryClient | null = null;

export function getQueryClient(): QueryClient {
  if (!client) {
    client = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 5_000,
          refetchInterval: 15_000,
          retry: 2,
          refetchOnWindowFocus: true,
        },
      },
    });
  }
  return client;
}
