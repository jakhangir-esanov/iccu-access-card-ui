import type { Citizenship } from '@shared/models/citizenship';
import type { Gender } from '@shared/models/gender';
import type { ReaderCategory } from '@shared/models/reader-category';
import type { RegistrationSource } from '@shared/models/registration-source';

interface ReaderPerson {
  readonly category: ReaderCategory;
  readonly lastName: string;
  readonly firstName: string;
  readonly middleName: string | null;
  readonly fullName: string;
  readonly birthDate: string;
  readonly gender: Gender | null;
  readonly citizenship: Citizenship | null;
  readonly phone: string;
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

export type ReaderListItem = ReaderPerson & ReaderCard;

export interface Reader extends ReaderPerson, ReaderCard {
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
