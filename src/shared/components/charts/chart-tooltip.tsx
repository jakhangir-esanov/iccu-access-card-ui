import { formatNumber } from '@core/i18n/number-format';
import { useLocale } from '@core/i18n/use-i18n';
import { cn } from 'cn';
import type { ChartSeries } from './chart-types';

interface TooltipEntry {
  readonly dataKey?: unknown;
  readonly name?: unknown;
  readonly value?: unknown;
}

interface ChartTooltipProps {
  readonly active?: boolean;
  readonly label?: string | number;
  readonly payload?: readonly TooltipEntry[];
  readonly series: readonly ChartSeries[];
}

export function ChartTooltip({ active, payload, label, series }: ChartTooltipProps) {
  const { locale } = useLocale();
  if (active !== true || payload === undefined || payload.length === 0) {
    return null;
  }
  return (
    <div className="grid gap-1 rounded-md border bg-popover px-3 py-2 text-xs text-popover-foreground shadow-sm">
      <p className="font-medium">{label}</p>
      {payload.map((entry) => {
        const match = series.find((item) => item.id === entry.dataKey);
        return (
          <p key={String(entry.dataKey)} className="flex items-center gap-2 text-muted-foreground">
            <span className={cn('size-2 rounded-full', match?.swatchClass)} aria-hidden />
            {match?.label ?? String(entry.name)}
            <span className="ml-auto pl-3 font-semibold text-foreground tabular-nums">
              {formatNumber(typeof entry.value === 'number' ? entry.value : 0, locale)}
            </span>
          </p>
        );
      })}
    </div>
  );
}
