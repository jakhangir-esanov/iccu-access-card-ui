import { useState } from 'react';
import { useSearchParams } from 'react-router';
import { describeError } from '@core/feedback/error-message';
import { useMessage } from '@core/feedback/use-message';
import { toTashkentDateOnly } from '@core/i18n/date-format';
import { useT } from '@core/i18n/use-i18n';
import { FormAlert } from '@shared/components/form/form-alert';
import { PageHeader } from '@shared/components/page-header';
import { useRegistrationReport } from '../api/reports.queries';
import { ReportByUser } from '../components/report-by-user';
import { ReportCharts } from '../components/report-charts';
import { ReportFilters } from '../components/report-filters';
import { ReportSummary } from '../components/report-summary';
import { parseReportQuery, reportRangeError } from '../models/report-query';

const REPLACE = { replace: true } as const;

export function ReportsPage() {
  const t = useT();
  const message = useMessage();
  const [today] = useState(() => toTashkentDateOnly(new Date()));
  const [params, setParams] = useSearchParams();
  const query = parseReportQuery((name) => params.get(name) ?? '', today);
  const rangeError = reportRangeError(query);
  const report = useRegistrationReport(query, rangeError === null);

  const alert =
    rangeError !== null
      ? t(rangeError)
      : report.isError
        ? message(describeError(report.error))
        : null;

  return (
    <section className="grid gap-6">
      <PageHeader title={t('reports.title')} />
      <ReportFilters
        query={query}
        today={today}
        onChange={(name, value) => {
          setParams((current) => {
            const next = new URLSearchParams(current);
            next.set(name, value);
            return next;
          }, REPLACE);
        }}
      />
      <FormAlert message={alert} />
      {report.data !== undefined && rangeError === null && (
        <div className={report.isFetching ? 'grid gap-6 opacity-60' : 'grid gap-6'}>
          <ReportSummary report={report.data} />
          <ReportCharts report={report.data} />
          <ReportByUser rows={report.data.byUser} />
        </div>
      )}
    </section>
  );
}
