import { useT } from '@core/i18n/use-i18n';
import type { TranslationKey } from '@core/i18n/translations/dictionary';
import { Badge } from '@shared/ui/badge';
import { UserStatus } from '../models/user';

const STATUS_LABELS: Readonly<Record<UserStatus, TranslationKey>> = {
  [UserStatus.Active]: 'users.status.active',
  [UserStatus.Inactive]: 'users.status.inactive',
  [UserStatus.LockedOut]: 'users.status.lockedOut',
};

const STATUS_CLASSES: Readonly<Record<UserStatus, string>> = {
  [UserStatus.Active]: 'bg-turquoise/15 text-accent-foreground',
  [UserStatus.Inactive]: 'bg-muted text-muted-foreground',
  [UserStatus.LockedOut]: 'bg-destructive/10 text-destructive',
};

export function UserStatusBadge({ status }: { readonly status: UserStatus }) {
  const t = useT();
  return (
    <Badge
      variant="secondary"
      className={STATUS_CLASSES[status]}
      title={status === UserStatus.LockedOut ? t('users.lockedHint') : undefined}
    >
      {t(STATUS_LABELS[status])}
    </Badge>
  );
}
