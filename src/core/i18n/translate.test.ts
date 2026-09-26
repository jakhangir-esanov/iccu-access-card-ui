import { describe, expect, it } from 'vitest';
import { LOCALES } from './locale';
import { createTranslator, flattenDictionary, interpolate } from './translate';
import { DICTIONARIES } from './translations/dictionaries';

describe('interpolate', () => {
  it('should replace placeholders when params are given', () => {
    expect(interpolate('{name} kodi {code}', { name: 'Ariza', code: '0427' })).toBe(
      'Ariza kodi 0427',
    );
  });

  it('should keep a placeholder when its param is missing', () => {
    expect(interpolate('Kod: {code}', {})).toBe('Kod: {code}');
  });
});

describe('createTranslator', () => {
  it('should return the text of the key when the key exists', () => {
    expect(createTranslator(DICTIONARIES.ru)('common.cancel')).toBe('Отмена');
  });
});

describe('dictionaries', () => {
  const uzKeys = [...flattenDictionary(DICTIONARIES.uz).keys()];

  it.each(LOCALES)('should have the same keys as uz when the locale is %s', (locale) => {
    expect([...flattenDictionary(DICTIONARIES[locale]).keys()]).toEqual(uzKeys);
  });

  it.each(LOCALES)('should have no empty text when the locale is %s', (locale) => {
    const empty = [...flattenDictionary(DICTIONARIES[locale])].filter(([, text]) => text === '');

    expect(empty).toEqual([]);
  });
});
