import { useT } from '@core/i18n/use-i18n';
import { toCategoryRows } from '@shared/components/charts/category-rows';
import { ChartCard } from '@shared/components/charts/chart-card';
import { ChartTable } from '@shared/components/charts/chart-table';
import { CHART_PALETTE, type ChartSeries } from '@shared/components/charts/chart-types';
import { ColumnChart } from '@shared/components/charts/column-chart';
import { HorizontalBarChart } from '@shared/components/charts/horizontal-bar-chart';
import type { RegistrationReport } from '../models/registration-report';
import {
  RECEPTION_SERIES_ID,
  SELF_SERVICE_SERIES_ID,
  fillPeriods,
  toPeriodRows,
} from '../models/report-periods';

const COUNT_SERIES_ID = 'count';

interface ReportChartsProps {
  readonly report: RegistrationReport;
}

export function ReportCharts({ report }: ReportChartsProps) {
  const t = useT();
  const [firstColor, secondColor] = CHART_PALETTE;
  const sourceSeries: readonly ChartSeries[] = [
    { id: RECEPTION_SERIES_ID, label: t('enums.registrationSource.reception'), ...firstColor },
    {
      id: SELF_SERVICE_SERIES_ID,
      label: t('enums.registrationSource.selfService'),
      ...secondColor,
    },
  ];
  const countSeries: ChartSeries = { id: COUNT_SERIES_ID, label: t('charts.count'), ...firstColor };
  const periodRows = toPeriodRows(fillPeriods(report, report.byPeriod), report.groupBy, t);
  const categoryRows = toCategoryRows(report.byCategory, COUNT_SERIES_ID, t);

  return (
    <div className="grid gap-6 xl:grid-cols-[3fr_2fr]">
      <ChartCard
        title={t('reports.byPeriod.title')}
        subtitle={t('reports.byPeriod.subtitle')}
        chart={<ColumnChart rows={periodRows} series={sourceSeries} />}
        table={
          <ChartTable labelHeader={t('charts.period')} rows={periodRows} series={sourceSeries} />
        }
      />
      <ChartCard
        title={t('reports.byCategory.title')}
        chart={<HorizontalBarChart rows={categoryRows} series={countSeries} />}
        table={
          <ChartTable
            labelHeader={t('charts.category')}
            rows={categoryRows}
            series={[countSeries]}
          />
        }
      />
    </div>
  );
}
