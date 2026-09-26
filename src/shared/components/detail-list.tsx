import type { ReactNode } from 'react';
import type { TranslationKey } from '@core/i18n/translations/dictionary';
import { useT } from '@core/i18n/use-i18n';

export interface DetailRow {
  readonly label: TranslationKey;
  readonly value: ReactNode;
}

export function DetailList({ rows }: { readonly rows: readonly DetailRow[] }) {
  const t = useT();
  return (
    <dl className="grid grid-cols-[max-content_1fr] gap-x-6 gap-y-2 text-sm">
      {rows.map((row) => (
        <div key={row.label} className="contents">
          <dt className="text-muted-foreground">{t(row.label)}</dt>
          <dd className="font-medium">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}
