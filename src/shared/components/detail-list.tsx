import type { ReactNode } from 'react';
import type { TranslationKey } from '@core/i18n/translations/dictionary';
import { useT } from '@core/i18n/use-i18n';
import { cn } from 'cn';

export interface DetailRow {
  readonly label: TranslationKey;
  readonly value: ReactNode;
}

interface DetailListProps {
  readonly rows: readonly DetailRow[];
  readonly className?: string;
}

export function DetailList({ rows, className }: DetailListProps) {
  const t = useT();
  return (
    <dl className={cn('grid grid-cols-2 gap-x-8 gap-y-5', className)}>
      {rows.map((row) => (
        <div key={row.label} className="grid content-start gap-1.5">
          <dt className="text-[0.6875rem] font-bold tracking-[0.08em] text-muted-foreground uppercase">
            {t(row.label)}
          </dt>
          <dd className="text-[0.9375rem] font-semibold break-words">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}
