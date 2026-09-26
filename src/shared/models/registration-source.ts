import type { TranslationKey } from '@core/i18n/translations/dictionary';

export const RegistrationSource = {
  Reception: 0,
  SelfService: 1,
} as const;

export type RegistrationSource = (typeof RegistrationSource)[keyof typeof RegistrationSource];

export const REGISTRATION_SOURCES: readonly RegistrationSource[] =
  Object.values(RegistrationSource);

export const REGISTRATION_SOURCE_LABELS: Readonly<Record<RegistrationSource, TranslationKey>> = {
  [RegistrationSource.Reception]: 'enums.registrationSource.reception',
  [RegistrationSource.SelfService]: 'enums.registrationSource.selfService',
};

export function isRegistrationSource(value: unknown): value is RegistrationSource {
  return REGISTRATION_SOURCES.some((source) => source === value);
}
