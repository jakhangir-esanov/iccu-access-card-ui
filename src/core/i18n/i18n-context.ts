import { createContext } from 'react';
import type { Locale } from './locale';
import type { Translate } from './translate';

export interface I18nContextValue {
  readonly locale: Locale;
  readonly setLocale: (locale: Locale) => void;
  readonly t: Translate;
}

export const I18nContext = createContext<I18nContextValue | null>(null);
