import { flattenDictionary } from './translate';
import type { TranslationKey } from './translations/dictionary';
import { uz } from './translations/uz';

const KNOWN_KEYS: ReadonlySet<string> = new Set(flattenDictionary(uz).keys());

export function i18nKey(key: TranslationKey): TranslationKey {
  return key;
}

export function isTranslationKey(value: unknown): value is TranslationKey {
  return typeof value === 'string' && KNOWN_KEYS.has(value);
}
