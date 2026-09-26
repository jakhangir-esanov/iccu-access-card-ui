import { formatNumber } from '@core/i18n/number-format';
import { useLocale } from '@core/i18n/use-i18n';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@shared/ui/table';
import type { ChartRow, ChartSeries } from './chart-types';

interface ChartTableProps {
  readonly labelHeader: string;
  readonly rows: readonly ChartRow[];
  readonly series: readonly ChartSeries[];
}

export function ChartTable({ labelHeader, rows, series }: ChartTableProps) {
  const { locale } = useLocale();
  return (
    <div className="max-h-80 overflow-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{labelHeader}</TableHead>
            {series.map((item) => (
              <TableHead key={item.id} className="text-right">
                {item.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.key}>
              <TableCell>{row.label}</TableCell>
              {series.map((item) => (
                <TableCell key={item.id} className="text-right tabular-nums">
                  {formatNumber(row.values[item.id] ?? 0, locale)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
