import { describe, expect, it } from 'vitest';
import { DocumentType } from '@shared/models/document-type';
import {
  NAME_PATTERN,
  isValidBirthDate,
  isValidDocumentNumber,
  normalizeDocumentNumber,
  normalizePhone,
} from './person-details-rules';

describe('normalizePhone', () => {
  it.each([
    ['90 123 45 67', '+998901234567'],
    ['+998 (90) 123-45-67', '+998901234567'],
    ['998901234567', '+998901234567'],
  ])('should turn %s into %s', (phone, expected) => {
    expect(normalizePhone(phone)).toBe(expected);
  });

  it.each(['12345', '7 901 234 56 78', '99890123456', ''])(
    'should reject %s when it is not an Uzbek number',
    (phone) => {
      expect(normalizePhone(phone)).toBeNull();
    },
  );
});

describe('normalizeDocumentNumber', () => {
  it.each([
    ['ad 765-4321', 'AD7654321'],
    ['I-TN 1234567', 'ITN1234567'],
    ['№ 12.34#56', '123456'],
  ])('should turn %s into %s', (number, expected) => {
    expect(normalizeDocumentNumber(number)).toBe(expected);
  });
});

describe('isValidDocumentNumber', () => {
  it.each([
    [DocumentType.Passport, 'AA1234567', true],
    [DocumentType.Passport, 'aa 123 45 67', true],
    [DocumentType.Passport, 'A1234567', false],
    [DocumentType.Passport, 'AA123456', false],
    [DocumentType.BirthCertificate, 'I-TN 1234567', true],
    [DocumentType.BirthCertificate, 'ABCDEFG', false],
    [DocumentType.BirthCertificate, '12345', false],
  ])('should check type %i number %s as %s', (type, number, expected) => {
    expect(isValidDocumentNumber(type, number)).toBe(expected);
  });
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
