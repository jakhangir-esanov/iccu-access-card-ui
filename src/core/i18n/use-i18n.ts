import { use } from 'react';
import { I18nContext, type I18nContextValue } from './i18n-context';
import type { Translate } from './translate';

function useI18nContext(): I18nContextValue {
  const context = use(I18nContext);
  if (context === null) {
    throw new Error('I18nProvider is missing above this component');
  }
  return context;
}

export function useT(): Translate {
  return useI18nContext().t;
}

export function useLocale(): Pick<I18nContextValue, 'locale' | 'setLocale'> {
  const { locale, setLocale } = useI18nContext();
  return { locale, setLocale };
}
