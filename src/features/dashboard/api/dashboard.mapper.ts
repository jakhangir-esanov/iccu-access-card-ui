import { isReaderCategory } from '@shared/models/reader-category';
import type { CategoryCount, Dashboard } from '../models/dashboard';
import type { CategoryCountDto, DashboardDto } from './dashboard.dto';

export function toCategoryCounts(rows: readonly CategoryCountDto[]): CategoryCount[] {
  return rows.flatMap((row) =>
    isReaderCategory(row.category) ? [{ category: row.category, count: row.count }] : [],
  );
}

export function toDashboard(dto: DashboardDto): Dashboard {
  return {
    totals: { ...dto.totals },
    pendingRequests: dto.pendingRequests,
    byCategory: toCategoryCounts(dto.byCategory),
    lastDays: dto.lastDays.map((row) => ({ day: row.day, count: row.count })),
  };
}
