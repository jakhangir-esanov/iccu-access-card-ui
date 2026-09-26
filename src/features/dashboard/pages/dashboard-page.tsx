import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@core/auth/use-auth';
import { useT } from '@core/i18n/use-i18n';
import { useRegistrationSubmitted } from '@core/realtime/use-registration-submitted';
import { toCategoryRows } from '@shared/components/charts/category-rows';
import { ChartCard } from '@shared/components/charts/chart-card';
import { ChartTable } from '@shared/components/charts/chart-table';
import { CHART_PALETTE, type ChartSeries } from '@shared/components/charts/chart-types';
import { ColumnChart } from '@shared/components/charts/column-chart';
import { HorizontalBarChart } from '@shared/components/charts/horizontal-bar-chart';
import { FormAlert } from '@shared/components/form/form-alert';
import { dashboardKeys, useDashboard } from '../api/dashboard.queries';
import { DashboardTiles } from '../components/dashboard-tiles';
import { COUNT_SERIES_ID, toDayRows } from '../models/dashboard-charts';

export function DashboardPage() {
  const t = useT();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const dashboard = useDashboard();
  const series: ChartSeries = {
    id: COUNT_SERIES_ID,
    label: t('charts.count'),
    ...CHART_PALETTE[0],
  };

  useRegistrationSubmitted(() => {
    void queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
  });

  const data = dashboard.data;
  const dayRows = data === undefined ? [] : toDayRows(data.lastDays);
  const categoryRows =
    data === undefined ? [] : toCategoryRows(data.byCategory, COUNT_SERIES_ID, t);

  return (
    <section className="grid gap-6">
      <h1 className="text-2xl font-semibold">
        {t('dashboard.welcome', { name: user?.fullName ?? '' })}
      </h1>
      <FormAlert message={dashboard.isError ? t('dashboard.loadFailed') : null} />
      {data !== undefined && (
        <>
          <DashboardTiles totals={data.totals} pendingRequests={data.pendingRequests} />
          <div className="grid gap-6 xl:grid-cols-[3fr_2fr]">
            <ChartCard
              title={t('dashboard.lastDays.title')}
              subtitle={t('dashboard.lastDays.subtitle')}
              chart={<ColumnChart rows={dayRows} series={[series]} />}
              table={<ChartTable labelHeader={t('charts.date')} rows={dayRows} series={[series]} />}
            />
            <ChartCard
              title={t('dashboard.byCategory.title')}
              subtitle={t('dashboard.byCategory.subtitle')}
              chart={<HorizontalBarChart rows={categoryRows} series={series} />}
              table={
                <ChartTable
                  labelHeader={t('charts.category')}
                  rows={categoryRows}
                  series={[series]}
                />
              }
            />
          </div>
        </>
      )}
    </section>
  );
}
