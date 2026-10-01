import { describe, expect, it } from 'vitest';
import { toReader } from '../api/readers.mapper';
import { READER_DTO } from '../test/reader-fixtures';
import { toCardFace } from './card-face';

describe('toCardFace', () => {
  it('should print the name and the Uzbek category in capitals when the card is built', () => {
    const face = toCardFace(toReader({ ...READER_DTO, category: 2 }));

    expect(face).toEqual({
      fullName: 'KARIMOVA GULNOZA ANVAR QIZI',
      isLongName: false,
      category: 'MAGISTR',
      cardNumber: '0000001',
      issuedOn: '26.09.2026',
      expiresOn: '26.09.2028',
      photoFileId: 'photo-1',
    });
  });

  it.each([
    [0, "O'QUVCHI"],
    [6, 'XODIM'],
    [7, 'FOYDALANUVCHI'],
  ])('should print category %i as %s when the card is built', (category, expected) => {
    expect(toCardFace(toReader({ ...READER_DTO, category })).category).toBe(expected);
  });

  it('should keep Uzbek apostrophes when the name has them', () => {
    const face = toCardFace(
      toReader({ ...READER_DTO, lastName: 'Bo‘ritosheva', middleName: null }),
    );

    expect(face.fullName).toBe('BO‘RITOSHEVA GULNOZA');
  });

  it('should use the compact name size when the name is 30 characters or longer', () => {
    const face = toCardFace(
      toReader({ ...READER_DTO, lastName: 'Abdurahmonova', middleName: 'Abdurashidovna' }),
    );

    expect(face.fullName).toBe('ABDURAHMONOVA GULNOZA ABDURASHIDOVNA');
    expect(face.isLongName).toBe(true);
  });
});
