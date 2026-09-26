import { useQuery } from '@tanstack/react-query';
import { toDashboard } from './dashboard.mapper';
import { fetchDashboard } from './dashboard.service';

export const dashboardKeys = {
  all: ['dashboard'] as const,
};

export function useDashboard() {
  return useQuery({
    queryKey: dashboardKeys.all,
    queryFn: async () => toDashboard(await fetchDashboard()),
    staleTime: 0,
  });
}
