import { useT } from '@core/i18n/use-i18n';
import type { TranslationKey } from '@core/i18n/translations/dictionary';
import { Badge, type BadgeVariant } from '@shared/ui/badge';
import { UserStatus } from '../models/user';

const STATUS_LABELS: Readonly<Record<UserStatus, TranslationKey>> = {
  [UserStatus.Active]: 'users.status.active',
  [UserStatus.Inactive]: 'users.status.inactive',
  [UserStatus.LockedOut]: 'users.status.lockedOut',
};

const STATUS_VARIANTS: Readonly<Record<UserStatus, BadgeVariant>> = {
  [UserStatus.Active]: 'success',
  [UserStatus.Inactive]: 'muted',
  [UserStatus.LockedOut]: 'destructive',
};

export function UserStatusBadge({ status }: { readonly status: UserStatus }) {
  const t = useT();
  return (
    <Badge
      variant={STATUS_VARIANTS[status]}
      title={status === UserStatus.LockedOut ? t('users.lockedHint') : undefined}
    >
      {t(STATUS_LABELS[status])}
    </Badge>
  );
}
