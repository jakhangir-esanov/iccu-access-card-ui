import type { TranslationKey } from '@core/i18n/translations/dictionary';

export const ReportGrouping = {
  Day: 0,
  Month: 1,
} as const;

export type ReportGrouping = (typeof ReportGrouping)[keyof typeof ReportGrouping];

export const REPORT_GROUPINGS: readonly ReportGrouping[] = Object.values(ReportGrouping);

export const REPORT_GROUPING_LABELS: Readonly<Record<ReportGrouping, TranslationKey>> = {
  [ReportGrouping.Day]: 'reports.day',
  [ReportGrouping.Month]: 'reports.month',
};

export function isReportGrouping(value: unknown): value is ReportGrouping {
  return REPORT_GROUPINGS.some((grouping) => grouping === value);
}
