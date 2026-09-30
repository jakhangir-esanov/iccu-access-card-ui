import { describe, expect, it } from 'vitest';
import { Citizenship } from '@shared/models/citizenship';
import { Gender } from '@shared/models/gender';
import { ReaderCategory } from '@shared/models/reader-category';
import { toRegistrationReceipt, toSubmitRegistrationRequest } from './public-registration.mapper';

describe('toSubmitRegistrationRequest', () => {
  it('should copy every field the backend expects when the form is valid', () => {
    const values = {
      category: ReaderCategory.PhD,
      lastName: 'Karimov',
      firstName: 'Anvar',
      middleName: null,
      birthDate: '1990-01-02',
      gender: Gender.Male,
      citizenship: Citizenship.Uzbekistan,
      phone: '+998901234567',
      photoFileId: 'file-1',
      consentGiven: true,
    };

    expect(toSubmitRegistrationRequest(values)).toEqual(values);
  });
});

describe('toRegistrationReceipt', () => {
  it('should keep the code and the expiry when the backend accepts the request', () => {
    expect(toRegistrationReceipt({ code: '0001', expiresAt: '2026-09-27T14:17:19Z' })).toEqual({
      code: '0001',
      expiresAt: '2026-09-27T14:17:19Z',
    });
  });
});
