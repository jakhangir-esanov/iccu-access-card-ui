import { useT } from '@core/i18n/use-i18n';
import { CARD_STATUS_LABELS, CardStatus } from '@shared/models/card-status';
import { Badge, type BadgeVariant } from '@shared/ui/badge';

const STATUS_VARIANTS: Readonly<Record<CardStatus, BadgeVariant>> = {
  [CardStatus.Active]: 'success',
  [CardStatus.ExpiringSoon]: 'warning',
  [CardStatus.Expired]: 'destructive',
};

export function CardStatusBadge({ status }: { readonly status: CardStatus }) {
  const t = useT();
  return <Badge variant={STATUS_VARIANTS[status]}>{t(CARD_STATUS_LABELS[status])}</Badge>;
}
