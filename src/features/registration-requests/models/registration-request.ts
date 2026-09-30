import type { Citizenship } from '@shared/models/citizenship';
import type { Gender } from '@shared/models/gender';
import type { ReaderCategory } from '@shared/models/reader-category';
import {
  RegistrationRequestStatus,
  type RegistrationRequestStatus as Status,
} from '@shared/models/registration-request-status';

export interface RegistrationRequestListItem {
  readonly id: string;
  readonly photoFileId: string;
  readonly code: string;
  readonly status: Status;
  readonly category: ReaderCategory;
  readonly fullName: string;
  readonly phone: string;
  readonly submittedAt: string;
  readonly expiresAt: string;
  readonly hasRegisteredPhone: boolean;
}

export interface RegisteredReader {
  readonly id: string;
  readonly cardNumber: string;
}

export interface RegistrationRequest {
  readonly id: string;
  readonly photoFileId: string;
  readonly code: string;
  readonly status: Status;
  readonly category: ReaderCategory;
  readonly lastName: string;
  readonly firstName: string;
  readonly middleName: string | null;
  readonly fullName: string;
  readonly birthDate: string;
  readonly gender: Gender | null;
  readonly citizenship: Citizenship | null;
  readonly phone: string;
  readonly submittedAt: string;
  readonly expiresAt: string;
  readonly reviewedAt: string | null;
  readonly reviewedByName: string | null;
  readonly rejectionReason: string | null;
  readonly readerId: string | null;
  readonly registeredReader: RegisteredReader | null;
}

export interface Approval {
  readonly readerId: string;
  readonly cardNumber: string;
}

export function isOpenForReview(
  request: Pick<RegistrationRequest, 'status' | 'expiresAt'>,
  now: Date,
): boolean {
  return (
    request.status === RegistrationRequestStatus.Pending &&
    Date.parse(request.expiresAt) > now.getTime()
  );
}

export function canApprove(request: RegistrationRequest, now: Date): boolean {
  return isOpenForReview(request, now) && request.registeredReader === null;
}
