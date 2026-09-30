import { describe, expect, it } from 'vitest';
import { Citizenship } from '@shared/models/citizenship';
import { NAME_PATTERN, isValidBirthDate, normalizePhone } from './person-details-rules';

describe('normalizePhone', () => {
  it.each([
    ['90 123 45 67', '+998901234567'],
    ['+998 (90) 123-45-67', '+998901234567'],
    ['998901234567', '+998901234567'],
  ])('should turn %s into %s when the reader is a citizen of Uzbekistan', (phone, expected) => {
    expect(normalizePhone(phone, Citizenship.Uzbekistan)).toBe(expected);
  });

  it.each(['12345', '7 901 234 56 78', '99890123456', ''])(
    'should reject %s when a citizen of Uzbekistan has no Uzbek number',
    (phone) => {
      expect(normalizePhone(phone, Citizenship.Uzbekistan)).toBeNull();
    },
  );

  it('should accept only Uzbek numbers when the citizenship is not chosen', () => {
    expect(normalizePhone('90 123 45 67', null)).toBe('+998901234567');
    expect(normalizePhone('+7 901 234 56 78', null)).toBeNull();
  });

  it.each([
    ['+7 901 234 56 78', '+79012345678'],
    ['+49 (151) 1234-5678', '+4915112345678'],
    ['12345678', '+12345678'],
    ['90 123 45 67', '+998901234567'],
  ])('should turn %s into %s when the reader is a foreign citizen', (phone, expected) => {
    expect(normalizePhone(phone, Citizenship.Foreign)).toBe(expected);
  });

  it.each(['1234567', '+1234567890123456', '0049 151 1234 5678', ''])(
    'should reject %s when a foreign number is outside 8-15 digits or starts with zero',
    (phone) => {
      expect(normalizePhone(phone, Citizenship.Foreign)).toBeNull();
    },
  );
});

describe('NAME_PATTERN', () => {
  it.each(["O'g'ilov", 'Oʻgʻilov', 'Abdulla-Xo‘ja', 'Анна Мария', 'Karimova'])(
    'should accept %s',
    (name) => {
      expect(NAME_PATTERN.test(name)).toBe(true);
    },
  );

  it.each(["'Ali", 'Ali2', '-Vali', 'Vali!'])('should reject %s', (name) => {
    expect(NAME_PATTERN.test(name)).toBe(false);
  });
});

describe('isValidBirthDate', () => {
  const today = '2026-09-26';

  it.each([
    ['1900-01-01', true],
    ['2026-09-25', true],
    ['1899-12-31', false],
    ['2026-09-26', false],
  ])('should check %s as %s', (date, expected) => {
    expect(isValidBirthDate(date, today)).toBe(expected);
  });
});
