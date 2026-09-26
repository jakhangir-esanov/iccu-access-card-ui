import { DEFAULT_LOCALE, isLocale, type Locale } from './locale';

const LOCALE_STORAGE_KEY = 'iccu.locale';

export function readStoredLocale(): Locale {
  try {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
    return isLocale(stored) ? stored : DEFAULT_LOCALE;
  } catch {
    return DEFAULT_LOCALE;
  }
}

export function storeLocale(locale: Locale): boolean {
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    return true;
  } catch {
    return false;
  }
}
