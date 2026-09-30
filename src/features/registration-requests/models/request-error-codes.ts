export const RequestErrorCode = {
  NotPending: 'RegistrationRequest.NotPending',
  Expired: 'RegistrationRequest.Expired',
  PhoneAlreadyRegistered: 'Reader.PhoneAlreadyRegistered',
} as const;

const STALE_REQUEST_CODES: ReadonlySet<string> = new Set(Object.values(RequestErrorCode));

export function meansRequestChanged(code: string): boolean {
  return STALE_REQUEST_CODES.has(code);
}
