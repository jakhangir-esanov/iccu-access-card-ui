import { useT } from '@core/i18n/use-i18n';
import { ChartCard } from './chart-card';
import { ChartTable } from './chart-table';
import type { ChartRow, ChartSeries } from './chart-types';
import {
  toCitizenshipRows,
  toGenderRows,
  type CitizenshipCountLike,
  type GenderCountLike,
} from './demographic-rows';
import { HorizontalBarChart } from './horizontal-bar-chart';

interface DemographicChartsProps {
  readonly byGender: readonly GenderCountLike[];
  readonly byCitizenship: readonly CitizenshipCountLike[];
  readonly series: ChartSeries;
}

interface CountCardProps {
  readonly title: string;
  readonly labelHeader: string;
  readonly rows: readonly ChartRow[];
  readonly series: ChartSeries;
}

function CountCard({ title, labelHeader, rows, series }: CountCardProps) {
  return (
    <ChartCard
      title={title}
      chart={<HorizontalBarChart rows={rows} series={series} />}
      table={<ChartTable labelHeader={labelHeader} rows={rows} series={[series]} />}
    />
  );
}

export function DemographicCharts({ byGender, byCitizenship, series }: DemographicChartsProps) {
  const t = useT();
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <CountCard
        title={t('charts.byGender')}
        labelHeader={t('charts.gender')}
        rows={toGenderRows(byGender, series.id, t)}
        series={series}
      />
      <CountCard
        title={t('charts.byCitizenship')}
        labelHeader={t('charts.citizenship')}
        rows={toCitizenshipRows(byCitizenship, series.id, t)}
        series={series}
      />
    </div>
  );
}
