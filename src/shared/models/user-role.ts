import type { TranslationKey } from '@core/i18n/translations/dictionary';

export const UserRole = {
  Receptionist: 0,
  Admin: 1,
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const USER_ROLE_LABELS: Readonly<Record<UserRole, TranslationKey>> = {
  [UserRole.Receptionist]: 'roles.receptionist',
  [UserRole.Admin]: 'roles.admin',
};

export function isUserRole(value: unknown): value is UserRole {
  return value === UserRole.Receptionist || value === UserRole.Admin;
}
