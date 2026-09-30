import type { TranslationKey } from '@core/i18n/translations/dictionary';

export const Gender = {
  Male: 0,
  Female: 1,
} as const;

export type Gender = (typeof Gender)[keyof typeof Gender];

export const GENDERS: readonly Gender[] = Object.values(Gender);

export const GENDER_LABELS: Readonly<Record<Gender, TranslationKey>> = {
  [Gender.Male]: 'enums.gender.male',
  [Gender.Female]: 'enums.gender.female',
};

export function isGender(value: unknown): value is Gender {
  return GENDERS.some((gender) => gender === value);
}

export function toGenderOrNull(value: unknown): Gender | null {
  return isGender(value) ? value : null;
}
