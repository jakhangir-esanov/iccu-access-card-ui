import { z } from 'zod';
import { i18nKey } from '@core/i18n/translation-key';
import {
  EMPTY_PERSON_DETAILS,
  PERSON_DETAILS_FIELDS,
  PHONE_RULE_OPTIONS,
  personDetailsShape,
  phoneRule,
  withNormalizedPhone,
} from '@shared/person-details/person-details.schema';

export function createRegistrationFormSchema(today: string) {
  return z
    .object({
      ...personDetailsShape(today),
      photoFileId: z.string().min(1, { error: i18nKey('validation.photoRequired') }),
      consentGiven: z.boolean().refine((given) => given, {
        error: i18nKey('validation.consentRequired'),
      }),
    })
    .superRefine(phoneRule, PHONE_RULE_OPTIONS)
    .transform(withNormalizedPhone);
}

type RegistrationFormSchema = ReturnType<typeof createRegistrationFormSchema>;

export type RegistrationFormInput = z.input<RegistrationFormSchema>;

export type RegistrationFormValues = z.output<RegistrationFormSchema>;

export const EMPTY_REGISTRATION_FORM: RegistrationFormInput = {
  ...EMPTY_PERSON_DETAILS,
  photoFileId: '',
  consentGiven: false,
};

export const REGISTRATION_FORM_FIELDS = [
  ...PERSON_DETAILS_FIELDS,
  'photoFileId',
  'consentGiven',
] as const satisfies readonly (keyof RegistrationFormInput)[];
