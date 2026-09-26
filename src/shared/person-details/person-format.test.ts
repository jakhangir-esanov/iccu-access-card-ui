import { describe, expect, it } from 'vitest';
import { DocumentType } from '@shared/models/document-type';
import { ReaderCategory } from '@shared/models/reader-category';
import { toPersonDetailsFormInput } from './person-details-form';
import { formatFullName, formatPhone } from './person-format';

describe('formatFullName', () => {
  it('should join all three parts when the middle name is present', () => {
    expect(
      formatFullName({ lastName: 'Karimova', firstName: 'Gulnoza', middleName: 'Anvar qizi' }),
    ).toBe('Karimova Gulnoza Anvar qizi');
  });

  it('should skip the middle name when it is missing', () => {
    expect(formatFullName({ lastName: 'Karimov', firstName: 'Ali', middleName: null })).toBe(
      'Karimov Ali',
    );
  });
});

describe('formatPhone', () => {
  it('should group the digits when the number is Uzbek', () => {
    expect(formatPhone('+998905551234')).toBe('+998 90 555 12 34');
  });

  it('should return the value unchanged when it is not a stored Uzbek number', () => {
    expect(formatPhone('12345')).toBe('12345');
  });
});

describe('toPersonDetailsFormInput', () => {
  it('should turn stored details into form strings when a record is edited', () => {
    expect(
      toPersonDetailsFormInput({
        category: ReaderCategory.Employee,
        lastName: 'Toshmatov',
        firstName: 'Botir',
        middleName: null,
        birthDate: '1985-03-12',
        phone: '+998931112233',
        documentType: DocumentType.BirthCertificate,
        documentNumber: 'ITN1234567',
      }),
    ).toEqual({
      category: '6',
      lastName: 'Toshmatov',
      firstName: 'Botir',
      middleName: '',
      birthDate: '1985-03-12',
      phone: '931112233',
      documentType: '1',
      documentNumber: 'ITN1234567',
    });
  });
});
