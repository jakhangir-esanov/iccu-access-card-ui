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

export const changePasswordFormSchema = z
  .object({
    currentPassword: z.string().min(1, { error: i18nKey('validation.required') }),
    newPassword: newPasswordSchema,
    confirmPassword: z.string(),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    path: ['confirmPassword'],
    error: i18nKey('validation.passwordsMismatch'),
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordFormSchema>;

export const EMPTY_CHANGE_PASSWORD_FORM: ChangePasswordFormValues = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};

export const CHANGE_PASSWORD_FORM_FIELDS = ['currentPassword', 'newPassword'] as const;
