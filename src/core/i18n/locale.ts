export const LOCALES = ['uz', 'ru', 'en'] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'uz';

export const INTL_LOCALES: Readonly<Record<Locale, string>> = {
  uz: 'uz-Latn',
  ru: 'ru',
  en: 'en-GB',
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value);
}
