import { QueryClient } from '@tanstack/react-query';
import { sessionStore } from '@core/auth/session';

const STALE_TIME_MS = 30_000;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: STALE_TIME_MS,
      retry: false,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
});

sessionStore.onSignedOut(() => {
  queryClient.clear();
});
