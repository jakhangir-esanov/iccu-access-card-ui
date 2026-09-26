import { apiClient } from '@core/http/api-client';
import type { ReportQuery } from '../models/report-query';
import type { RegistrationReportDto } from './reports.dto';

export function fetchRegistrationReport(query: ReportQuery): Promise<RegistrationReportDto> {
  return apiClient.get<RegistrationReportDto>('/reports/registrations', {
    query: { from: query.from, to: query.to, groupBy: query.groupBy },
  });
}
