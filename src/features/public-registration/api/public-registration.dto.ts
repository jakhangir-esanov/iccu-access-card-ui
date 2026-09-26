import type { DocumentType } from '@shared/models/document-type';
import type { ReaderCategory } from '@shared/models/reader-category';

export interface SubmitRegistrationRequestDto {
  readonly category: ReaderCategory;
  readonly lastName: string;
  readonly firstName: string;
  readonly middleName: string | null;
  readonly birthDate: string;
  readonly phone: string;
  readonly documentType: DocumentType;
  readonly documentNumber: string;
  readonly photoFileId: string;
  readonly consentGiven: boolean;
}

export interface SubmitRegistrationResponseDto {
  readonly code: string;
  readonly expiresAt: string;
}
