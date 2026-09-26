import { useT } from '@core/i18n/use-i18n';
import {
  REGISTRATION_REQUEST_STATUS_LABELS,
  RegistrationRequestStatus,
} from '@shared/models/registration-request-status';
import { Badge } from '@shared/ui/badge';

const STATUS_CLASSES: Readonly<Record<RegistrationRequestStatus, string>> = {
  [RegistrationRequestStatus.Pending]: 'bg-gold/15 text-foreground',
  [RegistrationRequestStatus.Approved]: 'bg-turquoise/15 text-accent-foreground',
  [RegistrationRequestStatus.Rejected]: 'bg-destructive/10 text-destructive',
  [RegistrationRequestStatus.Expired]: 'bg-muted text-muted-foreground',
};

export function RequestStatusBadge({ status }: { readonly status: RegistrationRequestStatus }) {
  const t = useT();
  return (
    <Badge variant="secondary" className={STATUS_CLASSES[status]}>
      {t(REGISTRATION_REQUEST_STATUS_LABELS[status])}
    </Badge>
  );
}
