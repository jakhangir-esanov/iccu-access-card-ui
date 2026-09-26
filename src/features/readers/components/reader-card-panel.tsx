import { IdCardIcon } from 'lucide-react';
import { formatDateOnly, formatDateTime } from '@core/i18n/date-format';
import { useT } from '@core/i18n/use-i18n';
import { DetailList } from '@shared/components/detail-list';
import { cardStatusOf } from '@shared/models/card-status';
import type { Reader } from '../models/reader';
import { CardStatusBadge } from './card-status-badge';

interface ReaderCardPanelProps {
  readonly reader: Reader;
  readonly today: string;
}

export function ReaderCardPanel({ reader, today }: ReaderCardPanelProps) {
  const t = useT();
  return (
    <section className="grid gap-4 rounded-lg border border-t-4 border-t-gold bg-card p-5">
      <header className="flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 font-semibold">
          <IdCardIcon className="size-5 text-primary" aria-hidden />
          {t('readers.detail.card')}
        </h2>
        <CardStatusBadge status={cardStatusOf(reader.expiresOn, today)} />
      </header>
      <div className="grid gap-1">
        <span className="text-xs text-muted-foreground">{t('readers.detail.cardNumber')}</span>
        <span className="font-mono text-4xl font-bold tracking-[0.15em] text-primary tabular-nums">
          {reader.cardNumber}
        </span>
      </div>
      <DetailList
        rows={[
          { label: 'readers.detail.issuedOn', value: formatDateOnly(reader.issuedOn) },
          { label: 'readers.detail.expiresOn', value: formatDateOnly(reader.expiresOn) },
          { label: 'readers.detail.printCount', value: reader.printCount },
          {
            label: 'readers.detail.lastPrintedAt',
            value:
              reader.lastPrintedAt === null
                ? t('readers.detail.never')
                : formatDateTime(reader.lastPrintedAt),
          },
        ]}
      />
    </section>
  );
}
