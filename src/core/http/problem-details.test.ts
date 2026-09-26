import { describe, expect, it } from 'vitest';
import { HttpErrorCode } from './api-error';
import { toApiError, toFieldName } from './problem-details';

const MESSAGES = { en: 'Already reviewed.', uz: "Ko'rib chiqilgan.", ru: 'Уже рассмотрена.' };

describe('toApiError', () => {
  it('should use the title as the code when the body is ProblemDetails', () => {
    const error = toApiError({
      status: 409,
      contentType: 'application/problem+json',
      body: {
        title: 'RegistrationRequest.NotPending',
        status: 409,
        messages: MESSAGES,
        traceId: '00-abc-01',
      },
    });

    expect(error.status).toBe(409);
    expect(error.code).toBe('RegistrationRequest.NotPending');
    expect(error.messages).toEqual(MESSAGES);
    expect(error.traceId).toBe('00-abc-01');
    expect(error.fieldErrors).toEqual([]);
  });

  it('should strip the details prefix from field names when validation errors arrive', () => {
    const error = toApiError({
      status: 400,
      contentType: 'application/problem+json',
      body: {
        title: HttpErrorCode.Validation,
        errors: [
          { propertyName: 'details.phone', code: 'Reader.InvalidPhone', messages: MESSAGES },
          { propertyName: 'consentGiven', code: 'NotEmptyValidator' },
        ],
      },
    });

    expect(error.fieldErrors).toEqual([
      { field: 'phone', code: 'Reader.InvalidPhone', messages: MESSAGES },
      { field: 'consentGiven', code: 'NotEmptyValidator', messages: null },
    ]);
  });

  it.each([
    [401, '', HttpErrorCode.Unauthorized],
    [403, '', HttpErrorCode.Forbidden],
    [403, 'text/html', HttpErrorCode.OutsideLibraryNetwork],
    [429, '', HttpErrorCode.TooManyRequests],
    [502, 'text/html', HttpErrorCode.Unexpected],
    [404, '', HttpErrorCode.UnexpectedResponse],
  ])('should map status %i (%s) to %s when the body is empty', (status, contentType, code) => {
    expect(toApiError({ status, contentType, body: null }).code).toBe(code);
  });

  it('should treat an HTML body as bodiless when nginx answers', () => {
    const error = toApiError({
      status: 403,
      contentType: 'text/html; charset=utf-8',
      body: '<html>403 Forbidden</html>',
    });

    expect(error.code).toBe(HttpErrorCode.OutsideLibraryNetwork);
    expect(error.messages).toBeNull();
  });
});

describe('toFieldName', () => {
  it('should keep the name when there is no details prefix', () => {
    expect(toFieldName('username')).toBe('username');
  });
});
