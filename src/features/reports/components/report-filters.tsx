import { useT } from '@core/i18n/use-i18n';
import {
  isReportGrouping,
  REPORT_GROUPING_LABELS,
  REPORT_GROUPINGS,
  type ReportGrouping,
} from '@shared/models/report-grouping';
import { Input } from '@shared/ui/input';
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
    <div className="flex flex-wrap items-end gap-3">
      <div className="grid gap-1.5">
        <Label htmlFor="report-from">{t('reports.from')}</Label>
        <Input
          id="report-from"
          type="date"
          value={query.from}
          max={query.to}
          onChange={(event) => {
            onChange(ReportParam.from, event.target.value);
          }}
        />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="report-to">{t('reports.to')}</Label>
        <Input
          id="report-to"
          type="date"
          value={query.to}
          min={query.from}
          max={today}
          onChange={(event) => {
            onChange(ReportParam.to, event.target.value);
          }}
        />
      </div>
      <div className="grid gap-1.5">
        <span className="text-sm font-medium">{t('reports.groupBy')}</span>
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
    </div>
  );
}
