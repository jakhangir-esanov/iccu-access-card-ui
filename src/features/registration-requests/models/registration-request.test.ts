import { describe, expect, it } from 'vitest';
import { DocumentType } from '@shared/models/document-type';
import { ReaderCategory } from '@shared/models/reader-category';
import { RegistrationRequestStatus } from '@shared/models/registration-request-status';
import { canApprove, isOpenForReview, type RegistrationRequest } from './registration-request';

const BASE_REQUEST: RegistrationRequest = {
  id: 'req-1',
  photoFileId: 'photo-1',
  code: '0001',
  status: RegistrationRequestStatus.Pending,
  category: ReaderCategory.Student,
  lastName: 'Karimova',
  firstName: 'Gulnoza',
  middleName: null,
  fullName: 'Karimova Gulnoza',
  birthDate: '2004-05-17',
  phone: '+998905551234',
  documentType: DocumentType.Passport,
  documentNumber: 'AD7654321',
  submittedAt: '2026-09-26T17:00:00Z',
  expiresAt: '2026-09-27T17:00:00Z',
  reviewedAt: null,
  reviewedByName: null,
  rejectionReason: null,
  readerId: null,
  registeredReader: null,
};

describe('registration-request models', () => {
  const now = new Date('2026-09-26T18:00:00Z');

  it('should return true for isOpenForReview when request is pending and not expired', () => {
    expect(isOpenForReview(BASE_REQUEST, now)).toBe(true);
  });

  it('should return false for isOpenForReview when request is expired', () => {
    const expiredRequest = {
      ...BASE_REQUEST,
      expiresAt: '2026-09-26T12:00:00Z',
    };

    expect(isOpenForReview(expiredRequest, now)).toBe(false);
  });

  it('should return false for isOpenForReview when request is already approved', () => {
    const approvedRequest = {
      ...BASE_REQUEST,
      status: RegistrationRequestStatus.Approved,
    };

    expect(isOpenForReview(approvedRequest, now)).toBe(false);
  });

  it('should return true for canApprove when open for review and no registered reader', () => {
    expect(canApprove(BASE_REQUEST, now)).toBe(true);
  });

  it('should return false for canApprove when registered reader already exists', () => {
    const duplicateRequest: RegistrationRequest = {
      ...BASE_REQUEST,
      registeredReader: { id: 'reader-1', cardNumber: '0000001' },
    };

    expect(canApprove(duplicateRequest, now)).toBe(false);
  });
});
