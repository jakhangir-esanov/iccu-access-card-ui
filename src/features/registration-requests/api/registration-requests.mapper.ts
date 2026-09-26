import { isDocumentType, DocumentType } from '@shared/models/document-type';
import { isReaderCategory, ReaderCategory } from '@shared/models/reader-category';
import {
  isRegistrationRequestStatus,
  RegistrationRequestStatus,
} from '@shared/models/registration-request-status';
import type {
  PersonDetails,
  PersonDetailsFormInput,
} from '@shared/person-details/person-details.schema';
import { toPersonDetailsFormInput as toSharedPersonDetailsFormInput } from '@shared/person-details/person-details-form';
import { formatFullName } from '@shared/person-details/person-format';
import type {
  Approval,
  RegisteredReader,
  RegistrationRequest,
  RegistrationRequestListItem,
} from '../models/registration-request';
import type {
  ApproveRegistrationResponseDto,
  RegistrationRequestDto,
  RegistrationRequestListItemDto,
  UpdateRegistrationRequestDto,
} from './registration-requests.dto';

const toStatus = (value: number) =>
  isRegistrationRequestStatus(value) ? value : RegistrationRequestStatus.Pending;
const toCategory = (value: number) => (isReaderCategory(value) ? value : ReaderCategory.Pupil);
const toDocumentType = (value: number) => (isDocumentType(value) ? value : DocumentType.Passport);

export function toRegistrationRequestListItem(
  dto: RegistrationRequestListItemDto,
): RegistrationRequestListItem {
  return {
    id: dto.id,
    photoFileId: dto.photoFileId,
    code: dto.code,
    status: toStatus(dto.status),
    category: toCategory(dto.category),
    fullName: formatFullName(dto),
    phone: dto.phone,
    submittedAt: dto.submittedAt,
    expiresAt: dto.expiresAt,
    hasRegisteredDocument: dto.hasRegisteredDocument,
  };
}

function toRegisteredReader(dto: RegistrationRequestDto): RegisteredReader | null {
  if (dto.registeredReaderId === null) {
    return null;
  }
  return { id: dto.registeredReaderId, cardNumber: dto.registeredReaderCardNumber ?? '' };
}

export function toRegistrationRequest(dto: RegistrationRequestDto): RegistrationRequest {
  return {
    id: dto.id,
    photoFileId: dto.photoFileId,
    code: dto.code,
    status: toStatus(dto.status),
    category: toCategory(dto.category),
    lastName: dto.lastName,
    firstName: dto.firstName,
    middleName: dto.middleName,
    fullName: formatFullName(dto),
    birthDate: dto.birthDate,
    phone: dto.phone,
    documentType: toDocumentType(dto.documentType),
    documentNumber: dto.documentNumber,
    submittedAt: dto.submittedAt,
    expiresAt: dto.expiresAt,
    reviewedAt: dto.reviewedAt,
    reviewedByName: dto.reviewedByName,
    rejectionReason: dto.rejectionReason,
    readerId: dto.readerId,
    registeredReader: toRegisteredReader(dto),
  };
}

export function toUpdateRegistrationRequest(details: PersonDetails): UpdateRegistrationRequestDto {
  return {
    category: details.category,
    lastName: details.lastName,
    firstName: details.firstName,
    middleName: details.middleName,
    birthDate: details.birthDate,
    phone: details.phone,
    documentType: details.documentType,
    documentNumber: details.documentNumber,
  };
}

export function toApproval(dto: ApproveRegistrationResponseDto): Approval {
  return { readerId: dto.readerId, cardNumber: dto.cardNumber };
}

export function toPersonDetailsFormInput(request: RegistrationRequest): PersonDetailsFormInput {
  return toSharedPersonDetailsFormInput(request);
}
