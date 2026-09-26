import { formatDayMonth } from '@core/i18n/date-format';
import type { ChartRow } from '@shared/components/charts/chart-types';
import type { DayCount } from './dashboard';

export const COUNT_SERIES_ID = 'count';

export function toDayRows(days: readonly DayCount[]): ChartRow[] {
  return days.map((row) => ({
    key: row.day,
    label: formatDayMonth(row.day),
    values: { [COUNT_SERIES_ID]: row.count },
  }));
}
