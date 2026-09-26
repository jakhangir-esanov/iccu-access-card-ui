import type { DocumentType } from '@shared/models/document-type';
import type { ReaderCategory } from '@shared/models/reader-category';
import type { RegistrationSource } from '@shared/models/registration-source';

interface ReaderPerson {
  readonly category: ReaderCategory;
  readonly lastName: string;
  readonly firstName: string;
  readonly middleName: string | null;
  readonly fullName: string;
  readonly birthDate: string;
  readonly phone: string;
  readonly documentType: DocumentType;
}

interface ReaderCard {
  readonly id: string;
  readonly photoFileId: string;
  readonly cardNumber: string;
  readonly source: RegistrationSource;
  readonly issuedOn: string;
  readonly expiresOn: string;
  readonly printCount: number;
  readonly createdAt: string;
}

export interface ReaderListItem extends ReaderPerson, ReaderCard {
  readonly documentNumberMasked: string;
}

export interface Reader extends ReaderPerson, ReaderCard {
  readonly documentNumber: string;
  readonly lastPrintedAt: string | null;
  readonly createdByName: string | null;
  readonly updatedAt: string | null;
}

export interface CreatedReader {
  readonly id: string;
  readonly cardNumber: string;
}

export interface CardValidity {
  readonly issuedOn: string;
  readonly expiresOn: string;
}
