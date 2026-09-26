import { ApiError, HttpErrorCode } from './api-error';
import { isRecord, readMessages, readString } from './json-reader';

const OK_STATUS = 200;

export function unwrapResult(body: unknown): unknown {
  if (!isRecord(body)) {
    return undefined;
  }
  if (body.isFailure === true) {
    throw failureOf(body.error);
  }
  return body.data;
}

function failureOf(error: unknown): ApiError {
  if (!isRecord(error)) {
    return new ApiError({ status: OK_STATUS, code: HttpErrorCode.UnexpectedResponse });
  }
  return new ApiError({
    status: OK_STATUS,
    code: readString(error, 'code') ?? HttpErrorCode.UnexpectedResponse,
    messages: readMessages(error.messages),
  });
}
