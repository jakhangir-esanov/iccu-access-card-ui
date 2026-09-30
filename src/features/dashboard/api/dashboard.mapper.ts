import { toCitizenshipOrNull } from '@shared/models/citizenship';
import { toGenderOrNull } from '@shared/models/gender';
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
    byGender: dto.byGender.map((row) => ({
      gender: toGenderOrNull(row.gender),
      count: row.count,
    })),
    byCitizenship: dto.byCitizenship.map((row) => ({
      citizenship: toCitizenshipOrNull(row.citizenship),
      count: row.count,
    })),
    lastDays: dto.lastDays.map((row) => ({ day: row.day, count: row.count })),
  };
}
