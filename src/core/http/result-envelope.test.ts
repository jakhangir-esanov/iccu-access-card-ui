import { describe, expect, it } from 'vitest';
import { ApiError } from './api-error';
import { unwrapResult } from './result-envelope';

describe('unwrapResult', () => {
  it('should return data when the envelope succeeded', () => {
    const body = { data: { code: '0001' }, isSuccess: true, isFailure: false };

    expect(unwrapResult(body)).toEqual({ code: '0001' });
  });

  it('should return undefined when a command returns an envelope without data', () => {
    expect(unwrapResult({ isSuccess: true, isFailure: false })).toBeUndefined();
  });

  it('should return undefined when the body is empty', () => {
    expect(unwrapResult(null)).toBeUndefined();
  });

  it('should throw an ApiError with the error code when the envelope failed', () => {
    const body = {
      isSuccess: false,
      isFailure: true,
      error: { code: 'Reader.NotFound', messages: { en: 'Not found', uz: 'Topilmadi', ru: '' } },
    };

    expect(() => unwrapResult(body)).toThrow(ApiError);
    expect(() => unwrapResult(body)).toThrow('Reader.NotFound');
  });
});
