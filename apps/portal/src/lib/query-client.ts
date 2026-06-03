import { QueryClient } from "@tanstack/react-query";

const QUERY_STALE_TIME_MS = 60_000;

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 1,
        staleTime: QUERY_STALE_TIME_MS,
      },
    },
  });
}
