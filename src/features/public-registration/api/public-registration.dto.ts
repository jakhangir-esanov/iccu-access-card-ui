import type { Citizenship } from '@shared/models/citizenship';
import type { Gender } from '@shared/models/gender';
import type { ReaderCategory } from '@shared/models/reader-category';

export interface SubmitRegistrationRequestDto {
  readonly category: ReaderCategory;
  readonly lastName: string;
  readonly firstName: string;
  readonly middleName: string | null;
  readonly birthDate: string;
  readonly gender: Gender;
  readonly citizenship: Citizenship;
  readonly phone: string;
  readonly photoFileId: string;
  readonly consentGiven: boolean;
}

export interface SubmitRegistrationResponseDto {
  readonly code: string;
  readonly expiresAt: string;
}
