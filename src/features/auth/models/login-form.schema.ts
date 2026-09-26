import { z } from 'zod';
import { i18nKey } from '@core/i18n/translation-key';

const USERNAME_MAX_LENGTH = 50;
const PASSWORD_MAX_LENGTH = 128;

const required = { error: i18nKey('validation.required') };
const tooLong = { error: i18nKey('validation.tooLong') };

export const loginFormSchema = z.object({
  username: z.string().trim().min(1, required).max(USERNAME_MAX_LENGTH, tooLong),
  password: z.string().min(1, required).max(PASSWORD_MAX_LENGTH, tooLong),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;

export const EMPTY_LOGIN_FORM: LoginFormValues = { username: '', password: '' };

export const LOGIN_FORM_FIELDS = ['username', 'password'] as const;
