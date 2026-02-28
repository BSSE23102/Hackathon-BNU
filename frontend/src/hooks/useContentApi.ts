'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useSocket } from './useSocket';
import { useContentStore } from '@/stores/contentStore';
import { NAMESPACES } from '@/lib/socket';
import type { ContentItem } from '@/types';

export function useContentStream() {
  const { upsertItem, updateStage } = useContentStore();

  const query = useQuery({
    queryKey: ['content', 'stream'],
    queryFn: () => api.get<ContentItem[]>('/api/content/stream'),
    refetchInterval: 10_000,
  });

  useSocket(NAMESPACES.CONTENT, {
    'content:new': (data) => upsertItem(data as ContentItem),
    'content:stage': (data) => {
      const { id, stage } = data as { id: string; stage: ContentItem['stage'] };
      updateStage(id, stage);
    },
    'content:update': (data) => upsertItem(data as ContentItem),
  });

  return query;
}
