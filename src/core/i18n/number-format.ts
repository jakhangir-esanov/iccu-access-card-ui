import { INTL_LOCALES, type Locale } from './locale';

export function formatNumber(value: number, locale: Locale): string {
  return new Intl.NumberFormat(INTL_LOCALES[locale]).format(value);
}
