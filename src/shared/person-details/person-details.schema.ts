import { z } from 'zod';
import { i18nKey } from '@core/i18n/translation-key';
import type { TranslationKey } from '@core/i18n/translations/dictionary';
import { Citizenship, isCitizenship } from '@shared/models/citizenship';
import { isGender } from '@shared/models/gender';
import { isReaderCategory } from '@shared/models/reader-category';
import {
  NAME_MAX_LENGTH,
  NAME_PATTERN,
  isValidBirthDate,
  normalizePhone,
} from './person-details-rules';

const issue = (key: TranslationKey) => ({ error: key });
const required = { error: i18nKey('validation.required'), abort: true };

const PHONE_ERRORS: Readonly<Record<Citizenship, TranslationKey>> = {
  [Citizenship.Uzbekistan]: 'validation.phone',
  [Citizenship.Foreign]: 'validation.internationalPhone',
};

const PHONE_RULE_FIELDS: readonly PropertyKey[] = ['phone', 'citizenship'];

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

function enumSelectSchema<T extends number>(isValue: (value: unknown) => value is T) {
  return z
    .string()
    .refine((value) => value !== '' && isValue(Number(value)), required)
    .transform(Number)
    .refine(isValue);
}

export function personDetailsShape(today: string) {
  return {
    category: enumSelectSchema(isReaderCategory),
    lastName: nameSchema,
    firstName: nameSchema,
    middleName: optionalNameSchema,
    birthDate: z
      .string()
      .min(1, required)
      .refine((date) => isValidBirthDate(date, today), issue('validation.birthDate')),
    gender: enumSelectSchema(isGender),
    citizenship: enumSelectSchema(isCitizenship),
    phone: z.string().trim().min(1, required),
  };
}

interface PhoneFields {
  readonly citizenship: Citizenship;
  readonly phone: string;
}

export function phoneRule(values: PhoneFields, context: z.RefinementCtx): void {
  if (normalizePhone(values.phone, values.citizenship) !== null) {
    return;
  }
  context.addIssue({ code: 'custom', path: ['phone'], message: PHONE_ERRORS[values.citizenship] });
}

function isPhoneRuleIssue(fieldIssue: z.core.$ZodRawIssue): boolean {
  const field = fieldIssue.path?.[0];
  return field !== undefined && PHONE_RULE_FIELDS.includes(field);
}

export const PHONE_RULE_OPTIONS = {
  when: (payload: z.core.ParsePayload) => !payload.issues.some(isPhoneRuleIssue),
};

export function withNormalizedPhone<T extends PhoneFields>(values: T): T {
  return { ...values, phone: normalizePhone(values.phone, values.citizenship) ?? values.phone };
}

export function createPersonDetailsSchema(today: string) {
  return z
    .object(personDetailsShape(today))
    .superRefine(phoneRule, PHONE_RULE_OPTIONS)
    .transform(withNormalizedPhone);
}

export type PersonDetailsFormInput = z.input<ReturnType<typeof createPersonDetailsSchema>>;

export type PersonDetails = z.output<ReturnType<typeof createPersonDetailsSchema>>;

export const EMPTY_PERSON_DETAILS: PersonDetailsFormInput = {
  category: '',
  lastName: '',
  firstName: '',
  middleName: '',
  birthDate: '',
  gender: '',
  citizenship: String(Citizenship.Uzbekistan),
  phone: '',
};

export const PERSON_DETAILS_FIELDS = [
  'category',
  'lastName',
  'firstName',
  'middleName',
  'birthDate',
  'gender',
  'citizenship',
  'phone',
] as const satisfies readonly (keyof PersonDetailsFormInput)[];
