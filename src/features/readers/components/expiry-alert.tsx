import { TriangleAlertIcon } from 'lucide-react';
import { formatDateOnly } from '@core/i18n/date-format';
import { useT } from '@core/i18n/use-i18n';
import { CardStatus, cardStatusOf } from '@shared/models/card-status';
import { Alert, AlertTitle } from '@shared/ui/alert';
import type { Reader } from '../models/reader';

export function ExpiryAlert({
  reader,
  today,
}: {
  readonly reader: Reader;
  readonly today: string;
}) {
  const t = useT();
  const status = cardStatusOf(reader.expiresOn, today);
  if (status === CardStatus.Active) {
    return null;
  }
  const text =
    status === CardStatus.Expired
      ? t('readers.detail.expiredHint')
      : t('readers.detail.expiringHint', { date: formatDateOnly(reader.expiresOn) });
  return (
    <Alert variant={status === CardStatus.Expired ? 'destructive' : 'default'}>
      <TriangleAlertIcon aria-hidden />
      <AlertTitle>{text}</AlertTitle>
    </Alert>
  );
}
