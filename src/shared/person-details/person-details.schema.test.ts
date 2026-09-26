import { describe, expect, it } from 'vitest';
import { DocumentType } from '@shared/models/document-type';
import { ReaderCategory } from '@shared/models/reader-category';
import {
  EMPTY_PERSON_DETAILS,
  createPersonDetailsSchema,
  type PersonDetailsFormInput,
} from './person-details.schema';

const schema = createPersonDetailsSchema('2026-09-26');

const VALID: PersonDetailsFormInput = {
  category: '1',
  lastName: ' Karimova ',
  firstName: 'Gulnoza',
  middleName: '',
  birthDate: '2004-05-17',
  phone: '90 555 12 34',
  documentType: '0',
  documentNumber: 'ad 765-4321',
};

const issuesOf = (input: PersonDetailsFormInput) => {
  const result = schema.safeParse(input);
  return result.success
    ? {}
    : Object.fromEntries(result.error.issues.map((issue) => [issue.path.join('.'), issue.message]));
};

describe('createPersonDetailsSchema', () => {
  it('should normalize the values when the form is valid', () => {
    expect(schema.parse(VALID)).toEqual({
      category: ReaderCategory.Student,
      lastName: 'Karimova',
      firstName: 'Gulnoza',
      middleName: null,
      birthDate: '2004-05-17',
      phone: '+998905551234',
      documentType: DocumentType.Passport,
      documentNumber: 'AD7654321',
    });
  });

  it('should report every required field when the form is empty', () => {
    expect(issuesOf(EMPTY_PERSON_DETAILS)).toMatchObject({
      category: 'validation.required',
      lastName: 'validation.required',
      firstName: 'validation.required',
      birthDate: 'validation.required',
      phone: 'validation.phone',
      documentNumber: 'validation.required',
    });
  });

  it('should use the passport message when a passport number is wrong', () => {
    expect(issuesOf({ ...VALID, documentNumber: 'I-TN 1234567' })).toEqual({
      documentNumber: 'validation.passport',
    });
  });

  it('should accept a birth certificate number when the type is birth certificate', () => {
    expect(issuesOf({ ...VALID, documentType: '1', documentNumber: 'I-TN 1234567' })).toEqual({});
  });

  it('should reject names and dates when they break the rules', () => {
    expect(
      issuesOf({ ...VALID, firstName: 'Ali2', middleName: '-x', birthDate: '2026-09-26' }),
    ).toEqual({
      firstName: 'validation.name',
      middleName: 'validation.name',
      birthDate: 'validation.birthDate',
    });
  });
});
