import { formatNumber } from '@core/i18n/number-format';
import { useLocale, useT } from '@core/i18n/use-i18n';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@shared/ui/table';
import type { EmployeeTotal } from '../models/registration-report';

export function ReportByUser({ rows }: { readonly rows: readonly EmployeeTotal[] }) {
  const t = useT();
  const { locale } = useLocale();
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('reports.byUser.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        {rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t('reports.byUser.empty')}</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('charts.employee')}</TableHead>
                <TableHead className="text-right">{t('charts.count')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.userId}>
                  <TableCell>{row.fullName}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatNumber(row.count, locale)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
