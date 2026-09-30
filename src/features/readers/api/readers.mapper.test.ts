import { describe, expect, it } from 'vitest';
import { Citizenship } from '@shared/models/citizenship';
import { Gender } from '@shared/models/gender';
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
      gender: Gender.Female,
      citizenship: Citizenship.Uzbekistan,
      source: RegistrationSource.SelfService,
      createdByName: 'Resepshn Xodimi',
    });
    expect(reader).not.toHaveProperty('isExpired');
  });

  it('should fall back to safe enum values when the backend sends unknown numbers', () => {
    const reader = toReader({ ...READER_DTO, category: 42, gender: 9, citizenship: 5, source: 7 });

    expect(reader.category).toBe(ReaderCategory.Pupil);
    expect(reader.gender).toBeNull();
    expect(reader.citizenship).toBeNull();
    expect(reader.source).toBe(RegistrationSource.Reception);
  });

  it('should keep gender and citizenship empty when an old reader has none', () => {
    const reader = toReader({ ...READER_DTO, gender: null, citizenship: null });

    expect([reader.gender, reader.citizenship]).toEqual([null, null]);
  });
});

describe('toReaderListItem', () => {
  it('should map gender and citizenship when a list row is mapped', () => {
    expect(toReaderListItem(READER_LIST_ITEM_DTO)).toMatchObject({
      gender: Gender.Female,
      citizenship: Citizenship.Uzbekistan,
    });
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
      gender: Gender.Male,
      citizenship: Citizenship.Foreign,
      phone: '+79012345678',
      photoFileId: 'photo-2',
    };

    expect(toSaveReaderRequest(values)).toEqual(values);
  });
});
