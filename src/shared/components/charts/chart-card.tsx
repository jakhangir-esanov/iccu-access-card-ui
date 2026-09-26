import { BarChart3Icon, TableIcon } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { useT } from '@core/i18n/use-i18n';
import { Button } from '@shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@shared/ui/card';

interface ChartCardProps {
  readonly title: string;
  readonly subtitle?: string;
  readonly chart: ReactNode;
  readonly table: ReactNode;
}

export function ChartCard({ title, subtitle, chart, table }: ChartCardProps) {
  const t = useT();
  const [showTable, setShowTable] = useState(false);
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-3">
        <div className="grid gap-1">
          <CardTitle>{title}</CardTitle>
          {subtitle !== undefined && <CardDescription>{subtitle}</CardDescription>}
        </div>
        <Button
          variant="ghost"
          size="sm"
          aria-pressed={showTable}
          onClick={() => {
            setShowTable((current) => !current);
          }}
        >
          {showTable ? <BarChart3Icon aria-hidden /> : <TableIcon aria-hidden />}
          {t(showTable ? 'charts.showChart' : 'charts.showTable')}
        </Button>
      </CardHeader>
      <CardContent>{showTable ? table : chart}</CardContent>
    </Card>
  );
}
