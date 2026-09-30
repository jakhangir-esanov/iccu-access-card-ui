import { toCitizenshipOrNull } from '@shared/models/citizenship';
import { toGenderOrNull } from '@shared/models/gender';
import { isReaderCategory } from '@shared/models/reader-category';
import { isReportGrouping, ReportGrouping } from '@shared/models/report-grouping';
import type { RegistrationReport } from '../models/registration-report';
import type { RegistrationReportDto } from './reports.dto';

export function toRegistrationReport(dto: RegistrationReportDto): RegistrationReport {
  return {
    from: dto.from,
    to: dto.to,
    groupBy: isReportGrouping(dto.groupBy) ? dto.groupBy : ReportGrouping.Day,
    total: dto.total,
    byPeriod: dto.byPeriod.map((row) => ({ ...row })),
    byCategory: dto.byCategory.flatMap((row) =>
      isReaderCategory(row.category) ? [{ category: row.category, count: row.count }] : [],
    ),
    byGender: dto.byGender.map((row) => ({
      gender: toGenderOrNull(row.gender),
      count: row.count,
    })),
    byCitizenship: dto.byCitizenship.map((row) => ({
      citizenship: toCitizenshipOrNull(row.citizenship),
      count: row.count,
    })),
    byUser: [...dto.byUser]
      .map((row) => ({ ...row }))
      .sort((left, right) => right.count - left.count),
  };
}
