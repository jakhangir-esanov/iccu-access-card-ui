import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { I18nContext, type I18nContextValue } from './i18n-context';
import type { Locale } from './locale';
import { readStoredLocale, storeLocale } from './locale-storage';
import { createTranslator } from './translate';
import { DICTIONARIES } from './translations/dictionaries';

export function I18nProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [locale, setLocaleState] = useState<Locale>(readStoredLocale);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    storeLocale(next);
    setLocaleState(next);
  }, []);

  const value = useMemo<I18nContextValue>(
    () => ({ locale, setLocale, t: createTranslator(DICTIONARIES[locale]) }),
    [locale, setLocale],
  );

  return <I18nContext value={value}>{children}</I18nContext>;
}
