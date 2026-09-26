import { useT } from '@core/i18n/use-i18n';
import {
  REGISTRATION_REQUEST_STATUS_LABELS,
  RegistrationRequestStatus,
} from '@shared/models/registration-request-status';
import { Badge, type BadgeVariant } from '@shared/ui/badge';

const STATUS_VARIANTS: Readonly<Record<RegistrationRequestStatus, BadgeVariant>> = {
  [RegistrationRequestStatus.Pending]: 'warning',
  [RegistrationRequestStatus.Approved]: 'success',
  [RegistrationRequestStatus.Rejected]: 'destructive',
  [RegistrationRequestStatus.Expired]: 'muted',
};

export function RequestStatusBadge({ status }: { readonly status: RegistrationRequestStatus }) {
  const t = useT();
  return (
    <Badge variant={STATUS_VARIANTS[status]}>{t(REGISTRATION_REQUEST_STATUS_LABELS[status])}</Badge>
  );
}
