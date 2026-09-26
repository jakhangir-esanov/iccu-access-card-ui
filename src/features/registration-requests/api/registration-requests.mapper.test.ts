import { describe, expect, it } from 'vitest';
import { DocumentType } from '@shared/models/document-type';
import { ReaderCategory } from '@shared/models/reader-category';
import { RegistrationRequestStatus } from '@shared/models/registration-request-status';
import type { RegistrationRequest } from '../models/registration-request';
import type {
  ApproveRegistrationResponseDto,
  RegistrationRequestDto,
  RegistrationRequestListItemDto,
} from './registration-requests.dto';
import {
  toApproval,
  toPersonDetailsFormInput,
  toRegistrationRequest,
  toRegistrationRequestListItem,
  toUpdateRegistrationRequest,
} from './registration-requests.mapper';

const SAMPLE_LIST_ITEM_DTO: RegistrationRequestListItemDto = {
  id: 'req-1',
  photoFileId: 'photo-1',
  code: '0001',
  status: RegistrationRequestStatus.Pending,
  category: ReaderCategory.Student,
  lastName: 'Karimova',
  firstName: 'Gulnoza',
  middleName: 'Anvar qizi',
  phone: '+998905551234',
  submittedAt: '2026-09-26T17:06:55.082Z',
  expiresAt: '2026-09-27T17:06:55.082Z',
  reviewedAt: null,
  reviewedByName: null,
  hasRegisteredDocument: false,
};

const SAMPLE_DETAIL_DTO: RegistrationRequestDto = {
  ...SAMPLE_LIST_ITEM_DTO,
  birthDate: '2004-05-17',
  documentType: DocumentType.Passport,
  documentNumber: 'AD7654321',
  rejectionReason: null,
  readerId: null,
  registeredReaderId: null,
  registeredReaderCardNumber: null,
};

describe('registration-requests.mapper', () => {
  it('should map list item dto to model when dto is valid', () => {
    const item = toRegistrationRequestListItem(SAMPLE_LIST_ITEM_DTO);

    expect(item.id).toBe('req-1');
    expect(item.code).toBe('0001');
    expect(item.fullName).toBe('Karimova Gulnoza Anvar qizi');
    expect(item.status).toBe(RegistrationRequestStatus.Pending);
    expect(item.category).toBe(ReaderCategory.Student);
  });

  it('should map detail dto to model when registered reader is present', () => {
    const dto: RegistrationRequestDto = {
      ...SAMPLE_DETAIL_DTO,
      registeredReaderId: 'reader-99',
      registeredReaderCardNumber: '0000042',
    };

    const request = toRegistrationRequest(dto);

    expect(request.id).toBe('req-1');
    expect(request.registeredReader).toEqual({
      id: 'reader-99',
      cardNumber: '0000042',
    });
  });

  it('should fallback to default status when status enum is unknown', () => {
    const item = toRegistrationRequestListItem({
      ...SAMPLE_LIST_ITEM_DTO,
      status: 999,
    });

    expect(item.status).toBe(RegistrationRequestStatus.Pending);
  });

  it('should format update dto when person details are provided', () => {
    const dto = toUpdateRegistrationRequest({
      category: ReaderCategory.Professor,
      lastName: 'Alimov',
      firstName: 'Bekzod',
      middleName: null,
      birthDate: '1985-01-01',
      phone: '+998901112233',
      documentType: DocumentType.Passport,
      documentNumber: 'AA1234567',
    });

    expect(dto).toEqual({
      category: ReaderCategory.Professor,
      lastName: 'Alimov',
      firstName: 'Bekzod',
      middleName: null,
      birthDate: '1985-01-01',
      phone: '+998901112233',
      documentType: DocumentType.Passport,
      documentNumber: 'AA1234567',
    });
  });

  it('should map approval dto when response is returned', () => {
    const approvalDto: ApproveRegistrationResponseDto = {
      readerId: 'r-1',
      cardNumber: '0000001',
    };

    expect(toApproval(approvalDto)).toEqual({
      readerId: 'r-1',
      cardNumber: '0000001',
    });
  });

  it('should map request to person details form input when editing', () => {
    const request: RegistrationRequest = {
      ...toRegistrationRequest(SAMPLE_DETAIL_DTO),
      phone: '+998905551234',
    };

    const input = toPersonDetailsFormInput(request);

    expect(input).toEqual({
      category: String(ReaderCategory.Student),
      lastName: 'Karimova',
      firstName: 'Gulnoza',
      middleName: 'Anvar qizi',
      birthDate: '2004-05-17',
      phone: '905551234',
      documentType: String(DocumentType.Passport),
      documentNumber: 'AD7654321',
    });
  });
});
