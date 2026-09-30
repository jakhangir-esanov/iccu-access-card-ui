export interface RegistrationRequestListItemDto {
  readonly id: string;
  readonly photoFileId: string;
  readonly code: string;
  readonly status: number;
  readonly category: number;
  readonly lastName: string;
  readonly firstName: string;
  readonly middleName: string | null;
  readonly phone: string;
  readonly submittedAt: string;
  readonly expiresAt: string;
  readonly reviewedAt: string | null;
  readonly reviewedByName: string | null;
  readonly hasRegisteredPhone: boolean;
}

export interface RegistrationRequestDto {
  readonly id: string;
  readonly photoFileId: string;
  readonly code: string;
  readonly status: number;
  readonly category: number;
  readonly lastName: string;
  readonly firstName: string;
  readonly middleName: string | null;
  readonly birthDate: string;
  readonly gender: number | null;
  readonly citizenship: number | null;
  readonly phone: string;
  readonly submittedAt: string;
  readonly expiresAt: string;
  readonly reviewedAt: string | null;
  readonly reviewedByName: string | null;
  readonly rejectionReason: string | null;
  readonly readerId: string | null;
  readonly registeredReaderId: string | null;
  readonly registeredReaderCardNumber: string | null;
}

export interface UpdateRegistrationRequestDto {
  readonly category: number;
  readonly lastName: string;
  readonly firstName: string;
  readonly middleName: string | null;
  readonly birthDate: string;
  readonly gender: number;
  readonly citizenship: number;
  readonly phone: string;
}

export interface ApproveRegistrationResponseDto {
  readonly readerId: string;
  readonly cardNumber: string;
}

export interface RejectRegistrationRequestDto {
  readonly reason: string;
}
