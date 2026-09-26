import type { TranslationKey } from '@core/i18n/translations/dictionary';

export const RegistrationRequestStatus = {
  Pending: 0,
  Approved: 1,
  Rejected: 2,
  Expired: 3,
} as const;

export type RegistrationRequestStatus =
  (typeof RegistrationRequestStatus)[keyof typeof RegistrationRequestStatus];

export const REGISTRATION_REQUEST_STATUSES: readonly RegistrationRequestStatus[] =
  Object.values(RegistrationRequestStatus);

export const REGISTRATION_REQUEST_STATUS_LABELS: Readonly<
  Record<RegistrationRequestStatus, TranslationKey>
> = {
  [RegistrationRequestStatus.Pending]: 'requests.status.pending',
  [RegistrationRequestStatus.Approved]: 'requests.status.approved',
  [RegistrationRequestStatus.Rejected]: 'requests.status.rejected',
  [RegistrationRequestStatus.Expired]: 'requests.status.expired',
};

export function isRegistrationRequestStatus(value: unknown): value is RegistrationRequestStatus {
  return REGISTRATION_REQUEST_STATUSES.some((status) => status === value);
}
