import { QrCodeIcon, SigmaIcon, UserRoundCheckIcon } from 'lucide-react';
import { useT } from '@core/i18n/use-i18n';
import { StatTile } from '@shared/components/charts/stat-tile';
import type { RegistrationReport } from '../models/registration-report';

export function ReportSummary({ report }: { readonly report: RegistrationReport }) {
  const t = useT();
  const reception = report.byPeriod.reduce((sum, row) => sum + row.reception, 0);
  const selfService = report.byPeriod.reduce((sum, row) => sum + row.selfService, 0);
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <StatTile label={t('reports.total')} value={report.total} icon={SigmaIcon} />
      <StatTile
        label={t('enums.registrationSource.reception')}
        value={reception}
        icon={UserRoundCheckIcon}
      />
      <StatTile label={t('reports.online')} value={selfService} icon={QrCodeIcon} />
    </div>
  );
}
