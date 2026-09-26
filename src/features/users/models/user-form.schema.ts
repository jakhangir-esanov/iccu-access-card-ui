import { z } from 'zod';
import { i18nKey } from '@core/i18n/translation-key';
import { isUserRole, UserRole } from '@shared/models/user-role';
import { PASSWORDS_MISMATCH, newPasswordSchema, passwordsMatch } from '@shared/validation/password';
import type { User } from './user';

const USERNAME_PATTERN = /^[A-Za-z0-9._-]{3,50}$/;
const FULL_NAME_MAX_LENGTH = 150;

const required = { error: i18nKey('validation.required'), abort: true };

const fullNameSchema = z
  .string()
  .trim()
  .min(1, required)
  .max(FULL_NAME_MAX_LENGTH, { error: i18nKey('validation.tooLong') });

const roleSchema = z
  .string()
  .refine((value) => isUserRole(Number(value)), required)
  .transform(Number)
  .refine(isUserRole);

export const createUserFormSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(1, required)
      .regex(USERNAME_PATTERN, { error: i18nKey('validation.username') })
      .transform((username) => username.toLowerCase()),
    fullName: fullNameSchema,
    role: roleSchema,
    newPassword: newPasswordSchema,
    confirmPassword: z.string(),
  })
  .refine(passwordsMatch, PASSWORDS_MISMATCH);

export const editUserFormSchema = z.object({
  fullName: fullNameSchema,
  role: roleSchema,
  isActive: z.boolean(),
});

export const resetPasswordFormSchema = z
  .object({ newPassword: newPasswordSchema, confirmPassword: z.string() })
  .refine(passwordsMatch, PASSWORDS_MISMATCH);

export type CreateUserFormInput = z.input<typeof createUserFormSchema>;
export type CreateUserFormValues = z.output<typeof createUserFormSchema>;
export type EditUserFormInput = z.input<typeof editUserFormSchema>;
export type EditUserFormValues = z.output<typeof editUserFormSchema>;
export type ResetPasswordFormValues = z.output<typeof resetPasswordFormSchema>;

export const EMPTY_CREATE_USER_FORM: CreateUserFormInput = {
  username: '',
  fullName: '',
  role: String(UserRole.Receptionist),
  newPassword: '',
  confirmPassword: '',
};

export const EMPTY_RESET_PASSWORD_FORM: ResetPasswordFormValues = {
  newPassword: '',
  confirmPassword: '',
};

export const CREATE_USER_FORM_FIELDS = ['username', 'fullName', 'role', 'newPassword'] as const;
export const EDIT_USER_FORM_FIELDS = ['fullName', 'role', 'isActive'] as const;
export const RESET_PASSWORD_FORM_FIELDS = ['newPassword'] as const;

export function toEditUserFormInput(user: User): EditUserFormInput {
  return { fullName: user.fullName, role: String(user.role), isActive: user.isActive };
}
