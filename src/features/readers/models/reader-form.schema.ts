import { z } from 'zod';
import { i18nKey } from '@core/i18n/translation-key';
import { toPersonDetailsFormInput } from '@shared/person-details/person-details-form';
import {
  EMPTY_PERSON_DETAILS,
  PERSON_DETAILS_FIELDS,
  PHONE_RULE_OPTIONS,
  personDetailsShape,
  phoneRule,
  withNormalizedPhone,
} from '@shared/person-details/person-details.schema';
import type { Reader } from './reader';

export function createReaderFormSchema(today: string) {
  return z
    .object({
      ...personDetailsShape(today),
      photoFileId: z.string().min(1, { error: i18nKey('validation.photoRequired') }),
    })
    .superRefine(phoneRule, PHONE_RULE_OPTIONS)
    .transform(withNormalizedPhone);
}

type ReaderFormSchema = ReturnType<typeof createReaderFormSchema>;

export type ReaderFormInput = z.input<ReaderFormSchema>;

export type ReaderFormValues = z.output<ReaderFormSchema>;

export const EMPTY_READER_FORM: ReaderFormInput = { ...EMPTY_PERSON_DETAILS, photoFileId: '' };

export const READER_FORM_FIELDS = [
  ...PERSON_DETAILS_FIELDS,
  'photoFileId',
] as const satisfies readonly (keyof ReaderFormInput)[];

export function toReaderFormInput(reader: Reader): ReaderFormInput {
  return { ...toPersonDetailsFormInput(reader), photoFileId: reader.photoFileId };
}
