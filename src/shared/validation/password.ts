import { z } from 'zod';
import { i18nKey } from '@core/i18n/translation-key';

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 128;
const LETTER = /\p{L}/u;
const DIGIT = /\d/;

const passwordRule = { error: i18nKey('validation.password') };

export const newPasswordSchema = z
  .string()
  .min(PASSWORD_MIN_LENGTH, passwordRule)
  .max(PASSWORD_MAX_LENGTH, passwordRule)
  .regex(LETTER, passwordRule)
  .regex(DIGIT, passwordRule);

export const PASSWORDS_MISMATCH = {
  path: ['confirmPassword'],
  error: i18nKey('validation.passwordsMismatch'),
};

export function passwordsMatch(values: {
  readonly newPassword: string;
  readonly confirmPassword: string;
}): boolean {
  return values.newPassword === values.confirmPassword;
}
