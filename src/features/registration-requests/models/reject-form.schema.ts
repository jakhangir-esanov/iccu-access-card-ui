import { z } from 'zod';
import { i18nKey } from '@core/i18n/translation-key';

export const REJECTION_REASON_MAX_LENGTH = 500;

export const rejectFormSchema = z.object({
  reason: z
    .string()
    .trim()
    .min(1, { error: i18nKey('validation.required'), abort: true })
    .max(REJECTION_REASON_MAX_LENGTH, { error: i18nKey('validation.tooLong') }),
});

export type RejectFormValues = z.infer<typeof rejectFormSchema>;

export const EMPTY_REJECT_FORM: RejectFormValues = { reason: '' };

export const REJECT_FORM_FIELDS = ['reason'] as const;
