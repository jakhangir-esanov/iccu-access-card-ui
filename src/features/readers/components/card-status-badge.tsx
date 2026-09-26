import { useT } from '@core/i18n/use-i18n';
import { CARD_STATUS_LABELS, CardStatus } from '@shared/models/card-status';
import { Badge } from '@shared/ui/badge';

const STATUS_CLASSES: Readonly<Record<CardStatus, string>> = {
  [CardStatus.Active]: 'bg-turquoise/15 text-accent-foreground',
  [CardStatus.ExpiringSoon]: 'bg-gold/20 text-foreground',
  [CardStatus.Expired]: 'bg-destructive/10 text-destructive',
};

export function CardStatusBadge({ status }: { readonly status: CardStatus }) {
  const t = useT();
  return (
    <Badge variant="secondary" className={STATUS_CLASSES[status]}>
      {t(CARD_STATUS_LABELS[status])}
    </Badge>
  );
}
