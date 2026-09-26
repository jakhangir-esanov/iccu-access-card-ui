import type { TranslationKey } from '@core/i18n/translations/dictionary';
import { isReportGrouping, ReportGrouping } from '@shared/models/report-grouping';
import { daysBetween, startOfMonth } from '@shared/utils/date-only';

export const ReportParam = {
  from: 'from',
  to: 'to',
  groupBy: 'groupBy',
} as const;

export const MAX_REPORT_DAYS = 1098;

const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

export interface ReportQuery {
  readonly from: string;
  readonly to: string;
  readonly groupBy: ReportGrouping;
}

function readDate(value: string, fallback: string): string {
  return DATE_ONLY.test(value) ? value : fallback;
}

export function parseReportQuery(read: (name: string) => string, today: string): ReportQuery {
  const groupBy = Number(read(ReportParam.groupBy));
  return {
    from: readDate(read(ReportParam.from), startOfMonth(today)),
    to: readDate(read(ReportParam.to), today),
    groupBy:
      read(ReportParam.groupBy) !== '' && isReportGrouping(groupBy) ? groupBy : ReportGrouping.Day,
  };
}

export function reportRangeError(query: ReportQuery): TranslationKey | null {
  const days = daysBetween(query.from, query.to);
  if (days < 0) {
    return 'reports.invalidRange';
  }
  return days > MAX_REPORT_DAYS ? 'reports.tooLong' : null;
}
