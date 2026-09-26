import { describe, expect, it } from 'vitest';
import { DocumentType } from '@shared/models/document-type';
import { ReaderCategory } from '@shared/models/reader-category';
import { RegistrationSource } from '@shared/models/registration-source';
import { READER_DTO, READER_LIST_ITEM_DTO } from '../test/reader-fixtures';
import { toReader, toReaderListItem, toSaveReaderRequest } from './readers.mapper';

describe('toReader', () => {
  it('should map enums and build the full name when the reader is loaded', () => {
    const reader = toReader(READER_DTO);

    expect(reader).toMatchObject({
      fullName: 'Karimova Gulnoza Anvar qizi',
      category: ReaderCategory.Student,
      documentType: DocumentType.Passport,
      source: RegistrationSource.SelfService,
      documentNumber: 'AD7654321',
      createdByName: 'Resepshn Xodimi',
    });
    expect(reader).not.toHaveProperty('isExpired');
  });

  it('should fall back to safe enum values when the backend sends unknown numbers', () => {
    const reader = toReader({ ...READER_DTO, category: 42, documentType: 9, source: 7 });

    expect(reader.category).toBe(ReaderCategory.Pupil);
    expect(reader.documentType).toBe(DocumentType.Passport);
    expect(reader.source).toBe(RegistrationSource.Reception);
  });
});

describe('toReaderListItem', () => {
  it('should keep the masked document number when a list row is mapped', () => {
    expect(toReaderListItem(READER_LIST_ITEM_DTO).documentNumberMasked).toBe('AD***4321');
  });
});

describe('toSaveReaderRequest', () => {
  it('should send the person fields and the photo when the form is saved', () => {
    const values = {
      category: ReaderCategory.Employee,
      lastName: 'Toshmatov',
      firstName: 'Botir',
      middleName: null,
      birthDate: '1985-03-12',
      phone: '+998931112233',
      documentType: DocumentType.Passport,
      documentNumber: 'AB1234567',
      photoFileId: 'photo-2',
    };

    expect(toSaveReaderRequest(values)).toEqual(values);
  });
});
