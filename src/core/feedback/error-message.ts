import { HttpErrorCode, isApiError, type FieldError } from '@core/http/api-error';
import type { LocalizedMessages } from '@core/http/api-types';
import type { Locale } from '@core/i18n/locale';
import type { Translate } from '@core/i18n/translate';
import type { TranslationKey } from '@core/i18n/translations/dictionary';

export type MessageSource =
  | { readonly kind: 'key'; readonly key: TranslationKey }
  | { readonly kind: 'localized'; readonly messages: LocalizedMessages };

const TRANSPORT_ERROR_KEYS: Readonly<Partial<Record<string, TranslationKey>>> = {
  [HttpErrorCode.Unauthorized]: 'errors.unauthorized',
  [HttpErrorCode.Forbidden]: 'errors.forbidden',
  [HttpErrorCode.OutsideLibraryNetwork]: 'errors.outsideLibraryNetwork',
  [HttpErrorCode.TooManyRequests]: 'errors.tooManyRequests',
  [HttpErrorCode.NetworkUnavailable]: 'errors.network',
};

const FALLBACK_ERROR_KEYS: Readonly<Partial<Record<string, TranslationKey>>> = {
  [HttpErrorCode.Validation]: 'errors.validation',
  [HttpErrorCode.DuplicateKey]: 'errors.duplicateKey',
};

const VALIDATOR_KEYS: Readonly<Partial<Record<string, TranslationKey>>> = {
  NotEmptyValidator: 'validation.required',
  NotNullValidator: 'validation.required',
  MaximumLengthValidator: 'validation.tooLong',
  MinimumLengthValidator: 'validation.tooShort',
  LengthValidator: 'validation.invalidLength',
};

const VALIDATOR_SUFFIX = 'Validator';

const byKey = (key: TranslationKey): MessageSource => ({ kind: 'key', key });

export function describeError(error: unknown): MessageSource {
  if (!isApiError(error)) {
    return byKey('errors.unexpected');
  }
  if (TRANSPORT_ERROR_KEYS[error.code] === undefined && error.messages !== null) {
    return { kind: 'localized', messages: error.messages };
  }
  return describeErrorCode(error.code);
}

export function describeErrorCode(code: string): MessageSource {
  return byKey(TRANSPORT_ERROR_KEYS[code] ?? FALLBACK_ERROR_KEYS[code] ?? 'errors.unexpected');
}

export function describeFieldError(fieldError: FieldError): MessageSource {
  if (fieldError.code.endsWith(VALIDATOR_SUFFIX) || fieldError.messages === null) {
    return byKey(VALIDATOR_KEYS[fieldError.code] ?? 'validation.invalid');
  }
  return { kind: 'localized', messages: fieldError.messages };
}

export function resolveMessage(source: MessageSource, t: Translate, locale: Locale): string {
  if (source.kind === 'key') {
    return t(source.key);
  }
  const { messages } = source;
  const text = messages[locale] || messages.uz || messages.en || messages.ru;
  return text === '' ? t('errors.unexpected') : text;
}
