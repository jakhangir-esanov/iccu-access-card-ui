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
    <section className="grid content-start gap-6 rounded-2xl border border-t-4 border-t-gold bg-card p-6">
      <header className="flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2.5 font-display text-2xl font-semibold">
          <IdCardIcon className="size-5 text-gold-ink" aria-hidden />
          {t('readers.detail.card')}
        </h2>
        <CardStatusBadge status={cardStatusOf(reader.expiresOn, today)} />
      </header>
      <div className="ornament-girih grid gap-2 overflow-hidden rounded-xl bg-deep px-5 py-4 text-deep-foreground [--ornament-opacity:0.16]">
        <span className="text-[0.6875rem] font-bold tracking-[0.12em] text-gold uppercase">
          {t('readers.detail.cardNumber')}
        </span>
        <span className="text-4xl font-extrabold tracking-[0.14em] tabular-nums">
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
