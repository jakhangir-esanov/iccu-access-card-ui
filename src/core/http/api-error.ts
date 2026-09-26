import type { LocalizedMessages } from './api-types';

export const HttpErrorCode = {
  Validation: 'General.Validation',
  Unexpected: 'General.Unexpected',
  DuplicateKey: 'Conflict.DuplicateKey',
  Unauthorized: 'Http.Unauthorized',
  Forbidden: 'Http.Forbidden',
  OutsideLibraryNetwork: 'Http.OutsideLibraryNetwork',
  TooManyRequests: 'Http.TooManyRequests',
  NetworkUnavailable: 'Http.NetworkUnavailable',
  UnexpectedResponse: 'Http.UnexpectedResponse',
} as const;

export interface FieldError {
  readonly field: string;
  readonly code: string;
  readonly messages: LocalizedMessages | null;
}

export interface ApiErrorInit {
  readonly status: number;
  readonly code: string;
  readonly messages?: LocalizedMessages | null;
  readonly fieldErrors?: readonly FieldError[];
  readonly traceId?: string | null;
}

export class ApiError extends Error {
  override readonly name = 'ApiError';
  readonly status: number;
  readonly code: string;
  readonly messages: LocalizedMessages | null;
  readonly fieldErrors: readonly FieldError[];
  readonly traceId: string | null;

  constructor(init: ApiErrorInit) {
    super(init.code);
    this.status = init.status;
    this.code = init.code;
    this.messages = init.messages ?? null;
    this.fieldErrors = init.fieldErrors ?? [];
    this.traceId = init.traceId ?? null;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export function hasErrorCode(error: unknown, code: string): error is ApiError {
  return isApiError(error) && error.code === code;
}
