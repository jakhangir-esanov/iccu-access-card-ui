import { keepPreviousData, useQuery } from '@tanstack/react-query';
import type { ReportQuery } from '../models/report-query';
import { toRegistrationReport } from './reports.mapper';
import { fetchRegistrationReport } from './reports.service';

export const reportKeys = {
  registrations: (query: ReportQuery) => ['reports', 'registrations', query] as const,
};

export function useRegistrationReport(query: ReportQuery, enabled: boolean) {
  return useQuery({
    queryKey: reportKeys.registrations(query),
    queryFn: async () => toRegistrationReport(await fetchRegistrationReport(query)),
    placeholderData: keepPreviousData,
    enabled,
  });
}
