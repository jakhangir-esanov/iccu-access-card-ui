import type { TranslationKey } from '@core/i18n/translations/dictionary';

export const Citizenship = {
  Uzbekistan: 0,
  Foreign: 1,
} as const;

export type Citizenship = (typeof Citizenship)[keyof typeof Citizenship];

export const CITIZENSHIPS: readonly Citizenship[] = Object.values(Citizenship);

export const CITIZENSHIP_LABELS: Readonly<Record<Citizenship, TranslationKey>> = {
  [Citizenship.Uzbekistan]: 'enums.citizenship.uzbekistan',
  [Citizenship.Foreign]: 'enums.citizenship.foreign',
};

export function isCitizenship(value: unknown): value is Citizenship {
  return CITIZENSHIPS.some((citizenship) => citizenship === value);
}

export function toCitizenshipOrNull(value: unknown): Citizenship | null {
  return isCitizenship(value) ? value : null;
}
