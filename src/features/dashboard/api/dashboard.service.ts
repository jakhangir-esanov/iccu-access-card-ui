import { apiClient } from '@core/http/api-client';
import type { DashboardDto } from './dashboard.dto';

export function fetchDashboard(): Promise<DashboardDto> {
  return apiClient.get<DashboardDto>('/dashboard');
}
