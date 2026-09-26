import { z } from 'zod';
import { i18nKey } from '@core/i18n/translation-key';
import { PASSWORDS_MISMATCH, newPasswordSchema, passwordsMatch } from '@shared/validation/password';

export const changePasswordFormSchema = z
  .object({
    currentPassword: z.string().min(1, { error: i18nKey('validation.required') }),
    newPassword: newPasswordSchema,
    confirmPassword: z.string(),
  })
  .refine(passwordsMatch, PASSWORDS_MISMATCH);

export type ChangePasswordFormValues = z.infer<typeof changePasswordFormSchema>;

export const EMPTY_CHANGE_PASSWORD_FORM: ChangePasswordFormValues = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};

export const CHANGE_PASSWORD_FORM_FIELDS = ['currentPassword', 'newPassword'] as const;
