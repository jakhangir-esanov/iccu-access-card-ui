import { describe, expect, it } from 'vitest';
import { ApiError, HttpErrorCode } from '@core/http/api-error';
import { createTranslator } from '@core/i18n/translate';
import { DICTIONARIES } from '@core/i18n/translations/dictionaries';
import { describeError, describeFieldError, resolveMessage } from './error-message';

const MESSAGES = { en: 'Card expired.', uz: 'Karta muddati tugagan.', ru: 'Срок карты истёк.' };
const t = createTranslator(DICTIONARIES.uz);

describe('describeError', () => {
  it('should use backend messages when a catalog error has them', () => {
    const error = new ApiError({ status: 409, code: 'Reader.X', messages: MESSAGES });

    expect(describeError(error)).toEqual({ kind: 'localized', messages: MESSAGES });
  });

  it.each([
    [HttpErrorCode.Unauthorized, 'errors.unauthorized'],
    [HttpErrorCode.OutsideLibraryNetwork, 'errors.outsideLibraryNetwork'],
    [HttpErrorCode.TooManyRequests, 'errors.tooManyRequests'],
    [HttpErrorCode.NetworkUnavailable, 'errors.network'],
    [HttpErrorCode.DuplicateKey, 'errors.duplicateKey'],
    ['Something.Unknown', 'errors.unexpected'],
  ])('should use our key when the code is %s without messages', (code, key) => {
    expect(describeError(new ApiError({ status: 400, code }))).toEqual({ kind: 'key', key });
  });

  it('should use the unexpected key when the error is not an ApiError', () => {
    expect(describeError(new TypeError('boom'))).toEqual({ kind: 'key', key: 'errors.unexpected' });
  });
});

describe('describeFieldError', () => {
  it('should use our translation when the code is a FluentValidation validator', () => {
    const source = describeFieldError({
      field: 'lastName',
      code: 'NotEmptyValidator',
      messages: { en: "'Last Name' must not be empty.", uz: '', ru: '' },
    });

    expect(source).toEqual({ kind: 'key', key: 'validation.required' });
  });

  it('should use backend messages when the code is from the error catalog', () => {
    const source = describeFieldError({
      field: 'phone',
      code: 'Reader.InvalidPhone',
      messages: MESSAGES,
    });

    expect(source).toEqual({ kind: 'localized', messages: MESSAGES });
  });

  it('should fall back to invalid when the validator is not mapped', () => {
    const source = describeFieldError({ field: 'x', code: 'EnumValidator', messages: null });

    expect(source).toEqual({ kind: 'key', key: 'validation.invalid' });
  });
});

describe('resolveMessage', () => {
  it('should pick the text of the current locale when messages are localized', () => {
    expect(resolveMessage({ kind: 'localized', messages: MESSAGES }, t, 'ru')).toBe(
      'Срок карты истёк.',
    );
  });

  it('should fall back to another language when the current one is empty', () => {
    const messages = { en: 'Only English', uz: '', ru: '' };

    expect(resolveMessage({ kind: 'localized', messages }, t, 'ru')).toBe('Only English');
  });

  it('should translate the key when the source is a key', () => {
    expect(resolveMessage({ kind: 'key', key: 'errors.network' }, t, 'uz')).toBe(
      "Server bilan aloqa yo'q. Internet yoki tarmoqni tekshiring.",
    );
  });
});
