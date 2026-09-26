import { ApiError, HttpErrorCode, type FieldError } from './api-error';
import { isRecord, readMessages, readString, type JsonRecord } from './json-reader';

const NESTED_DETAILS_PREFIX = 'details.';
const HTML_CONTENT_TYPE = 'text/html';
const FORBIDDEN_STATUS = 403;
const SERVER_ERROR_FROM = 500;

const STATUS_CODES: Readonly<Partial<Record<number, string>>> = {
  401: HttpErrorCode.Unauthorized,
  403: HttpErrorCode.Forbidden,
  429: HttpErrorCode.TooManyRequests,
};

export interface ErrorResponse {
  readonly status: number;
  readonly contentType: string;
  readonly body: unknown;
}

export function toApiError(response: ErrorResponse): ApiError {
  const { status, body } = response;
  if (isRecord(body) && readString(body, 'title') !== null) {
    return fromProblem(status, body);
  }
  return new ApiError({ status, code: codeForBodilessStatus(response) });
}

export function toFieldName(propertyName: string): string {
  return propertyName.startsWith(NESTED_DETAILS_PREFIX)
    ? propertyName.slice(NESTED_DETAILS_PREFIX.length)
    : propertyName;
}

function fromProblem(status: number, problem: JsonRecord): ApiError {
  return new ApiError({
    status,
    code: readString(problem, 'title') ?? HttpErrorCode.UnexpectedResponse,
    messages: readMessages(problem.messages),
    fieldErrors: readFieldErrors(problem.errors),
    traceId: readString(problem, 'traceId'),
  });
}

function readFieldErrors(value: unknown): readonly FieldError[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter(isRecord).map((entry) => ({
    field: toFieldName(readString(entry, 'propertyName') ?? ''),
    code: readString(entry, 'code') ?? HttpErrorCode.Validation,
    messages: readMessages(entry.messages),
  }));
}

function codeForBodilessStatus({ status, contentType }: ErrorResponse): string {
  if (status === FORBIDDEN_STATUS && contentType.includes(HTML_CONTENT_TYPE)) {
    return HttpErrorCode.OutsideLibraryNetwork;
  }
  const known = STATUS_CODES[status];
  if (known !== undefined) {
    return known;
  }
  return status >= SERVER_ERROR_FROM ? HttpErrorCode.Unexpected : HttpErrorCode.UnexpectedResponse;
}
