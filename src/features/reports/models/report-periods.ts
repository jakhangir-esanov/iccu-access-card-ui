import { formatDayMonth, formatMonth } from '@core/i18n/date-format';
import type { Translate } from '@core/i18n/translate';
import type { ChartRow } from '@shared/components/charts/chart-types';
import { ReportGrouping } from '@shared/models/report-grouping';
import { addDays, addMonths, startOfMonth } from '@shared/utils/date-only';
import type { PeriodTotals } from './registration-report';
import type { ReportQuery } from './report-query';

export const RECEPTION_SERIES_ID = 'reception';
export const SELF_SERVICE_SERIES_ID = 'selfService';

function periodKeys(query: ReportQuery): string[] {
  const isMonthly = query.groupBy === ReportGrouping.Month;
  const first = isMonthly ? startOfMonth(query.from) : query.from;
  const last = isMonthly ? startOfMonth(query.to) : query.to;
  const keys: string[] = [];
  for (let key = first; key <= last; key = isMonthly ? addMonths(key, 1) : addDays(key, 1)) {
    keys.push(key);
  }
  return keys;
}

export function fillPeriods(query: ReportQuery, rows: readonly PeriodTotals[]): PeriodTotals[] {
  return periodKeys(query).map(
    (period) =>
      rows.find((row) => row.period === period) ?? {
        period,
        total: 0,
        reception: 0,
        selfService: 0,
      },
  );
}

export function toPeriodRows(
  periods: readonly PeriodTotals[],
  groupBy: ReportGrouping,
  t: Translate,
): ChartRow[] {
  return periods.map((row) => ({
    key: row.period,
    label:
      groupBy === ReportGrouping.Month ? formatMonth(row.period, t) : formatDayMonth(row.period),
    values: { [RECEPTION_SERIES_ID]: row.reception, [SELF_SERVICE_SERIES_ID]: row.selfService },
  }));
}
