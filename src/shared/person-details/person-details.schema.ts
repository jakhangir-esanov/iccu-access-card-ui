import { z } from 'zod';
import { i18nKey } from '@core/i18n/translation-key';
import type { TranslationKey } from '@core/i18n/translations/dictionary';
import { DocumentType, isDocumentType } from '@shared/models/document-type';
import { isReaderCategory } from '@shared/models/reader-category';
import {
  NAME_MAX_LENGTH,
  NAME_PATTERN,
  isValidBirthDate,
  isValidDocumentNumber,
  normalizeDocumentNumber,
  normalizePhone,
} from './person-details-rules';

const issue = (key: TranslationKey) => ({ error: key });
const required = { error: i18nKey('validation.required'), abort: true };

const DOCUMENT_NUMBER_ERRORS: Readonly<Record<DocumentType, TranslationKey>> = {
  [DocumentType.Passport]: 'validation.passport',
  [DocumentType.BirthCertificate]: 'validation.birthCertificate',
};

const nameSchema = z
  .string()
  .trim()
  .min(1, required)
  .max(NAME_MAX_LENGTH, issue('validation.tooLong'))
  .regex(NAME_PATTERN, issue('validation.name'));

const optionalNameSchema = z
  .string()
  .trim()
  .max(NAME_MAX_LENGTH, issue('validation.tooLong'))
  .refine((name) => name === '' || NAME_PATTERN.test(name), issue('validation.name'))
  .transform((name) => (name === '' ? null : name));

const categorySchema = z
  .string()
  .refine((value) => value !== '' && isReaderCategory(Number(value)), required)
  .transform(Number)
  .refine(isReaderCategory);

const documentTypeSchema = z
  .string()
  .refine((value) => value !== '' && isDocumentType(Number(value)), required)
  .transform(Number)
  .refine(isDocumentType);

export function personDetailsShape(today: string) {
  return {
    category: categorySchema,
    lastName: nameSchema,
    firstName: nameSchema,
    middleName: optionalNameSchema,
    birthDate: z
      .string()
      .min(1, required)
      .refine((date) => isValidBirthDate(date, today), issue('validation.birthDate')),
    phone: z
      .string()
      .refine((phone) => normalizePhone(phone) !== null, issue('validation.phone'))
      .transform((phone) => normalizePhone(phone) ?? phone),
    documentType: documentTypeSchema,
    documentNumber: z.string().trim().min(1, required).transform(normalizeDocumentNumber),
  };
}

interface DocumentFields {
  readonly documentType: DocumentType;
  readonly documentNumber: string;
}

export function documentNumberRule(values: DocumentFields, context: z.RefinementCtx): void {
  const { documentType, documentNumber } = values;
  if (documentNumber === '' || isValidDocumentNumber(documentType, documentNumber)) {
    return;
  }
  context.addIssue({
    code: 'custom',
    path: ['documentNumber'],
    message: DOCUMENT_NUMBER_ERRORS[documentType],
  });
}

export function createPersonDetailsSchema(today: string) {
  return z.object(personDetailsShape(today)).superRefine(documentNumberRule);
}

export type PersonDetailsFormInput = z.input<ReturnType<typeof createPersonDetailsSchema>>;

export type PersonDetails = z.output<ReturnType<typeof createPersonDetailsSchema>>;

export const EMPTY_PERSON_DETAILS: PersonDetailsFormInput = {
  category: '',
  lastName: '',
  firstName: '',
  middleName: '',
  birthDate: '',
  phone: '',
  documentType: String(DocumentType.Passport),
  documentNumber: '',
};

export const PERSON_DETAILS_FIELDS = [
  'category',
  'lastName',
  'firstName',
  'middleName',
  'birthDate',
  'phone',
  'documentType',
  'documentNumber',
] as const satisfies readonly (keyof PersonDetailsFormInput)[];
