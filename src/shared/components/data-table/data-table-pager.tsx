import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useT } from '@core/i18n/use-i18n';
import { Button } from '@shared/ui/button';
import { NativeSelect, NativeSelectOption } from '@shared/ui/native-select';
import { PAGE_SIZES } from './table-search-params';

interface DataTablePagerProps {
  readonly first: number;
  readonly rows: number;
  readonly total: number;
  readonly onChange: (first: number, rows: number) => void;
}

export function DataTablePager({ first, rows, total, onChange }: DataTablePagerProps) {
  const t = useT();
  const from = total === 0 ? 0 : first + 1;
  const to = Math.min(first + rows, total);
  return (
    <div className="flex flex-wrap items-center justify-end gap-4 px-1 text-sm font-medium text-muted-foreground">
      <label className="flex items-center gap-2">
        {t('table.rowsPerPage')}
        <NativeSelect
          size="sm"
          value={rows}
          onChange={(event) => {
            onChange(0, Number(event.target.value));
          }}
        >
          {PAGE_SIZES.map((size) => (
            <NativeSelectOption key={size} value={size}>
              {size}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      </label>
      <span aria-live="polite" className="text-foreground tabular-nums">
        {t('table.range', { from, to, total })}
      </span>
      <Button
        variant="outline"
        size="icon"
        aria-label={t('table.previous')}
        disabled={first === 0}
        onClick={() => {
          onChange(Math.max(first - rows, 0), rows);
        }}
      >
        <ChevronLeftIcon aria-hidden />
      </Button>
      <Button
        variant="outline"
        size="icon"
        aria-label={t('table.next')}
        disabled={first + rows >= total}
        onClick={() => {
          onChange(first + rows, rows);
        }}
      >
        <ChevronRightIcon aria-hidden />
      </Button>
    </div>
  );
}
