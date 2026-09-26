export const REGISTRATIONS_HUB_URL = '/api/hubs/registrations';

export const REGISTRATION_SUBMITTED_EVENT = 'RegistrationSubmitted';

export interface RegistrationSubmittedNotice {
  readonly id: string;
  readonly code: string;
  readonly fullName: string;
  readonly submittedAt: string;
}

export function toRegistrationSubmittedNotice(
  payload: unknown,
): RegistrationSubmittedNotice | null {
  if (typeof payload !== 'object' || payload === null) {
    return null;
  }
  const { id, code, fullName, submittedAt }: Readonly<Record<string, unknown>> = { ...payload };
  const isNotice =
    typeof id === 'string' &&
    typeof code === 'string' &&
    typeof fullName === 'string' &&
    typeof submittedAt === 'string';
  return isNotice ? { id, code, fullName, submittedAt } : null;
}
