import { useT } from '@core/i18n/use-i18n';
import { FilterPanel } from '@shared/components/filter-panel';
import { DatePicker } from '@shared/components/form/date-picker';
import {
  isReportGrouping,
  REPORT_GROUPING_LABELS,
  REPORT_GROUPINGS,
  type ReportGrouping,
} from '@shared/models/report-grouping';
import { Label } from '@shared/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@shared/ui/tabs';
import { ReportParam, type ReportQuery } from '../models/report-query';

interface ReportFiltersProps {
  readonly query: ReportQuery;
  readonly today: string;
  readonly onChange: (name: string, value: string) => void;
}

export function ReportFilters({ query, today, onChange }: ReportFiltersProps) {
  const t = useT();
  return (
    <FilterPanel className="flex flex-wrap items-end gap-4">
      <div className="grid w-48 gap-1.5">
        <Label htmlFor="report-from">{t('reports.from')}</Label>
        <DatePicker
          id="report-from"
          value={query.from}
          max={query.to}
          onChange={(value) => {
            onChange(ReportParam.from, value);
          }}
        />
      </div>
      <div className="grid w-48 gap-1.5">
        <Label htmlFor="report-to">{t('reports.to')}</Label>
        <DatePicker
          id="report-to"
          value={query.to}
          min={query.from}
          max={today}
          onChange={(value) => {
            onChange(ReportParam.to, value);
          }}
        />
      </div>
      <div className="grid gap-1.5">
        <span className="text-sm font-semibold">{t('reports.groupBy')}</span>
        <Tabs
          value={String(query.groupBy)}
          onValueChange={(value) => {
            if (isReportGrouping(Number(value))) {
              onChange(ReportParam.groupBy, value);
            }
          }}
        >
          <TabsList>
            {REPORT_GROUPINGS.map((grouping: ReportGrouping) => (
              <TabsTrigger key={grouping} value={String(grouping)}>
                {t(REPORT_GROUPING_LABELS[grouping])}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
    </FilterPanel>
  );
}
