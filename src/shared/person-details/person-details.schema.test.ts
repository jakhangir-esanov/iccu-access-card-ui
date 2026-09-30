import { describe, expect, it } from 'vitest';
import { Citizenship } from '@shared/models/citizenship';
import { Gender } from '@shared/models/gender';
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
  gender: '1',
  citizenship: '0',
  phone: '90 555 12 34',
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
      gender: Gender.Female,
      citizenship: Citizenship.Uzbekistan,
      phone: '+998905551234',
    });
  });

  it('should default the citizenship to Uzbekistan when the form is new', () => {
    expect(EMPTY_PERSON_DETAILS.citizenship).toBe(String(Citizenship.Uzbekistan));
  });

  it('should report every required field when the form is empty', () => {
    expect(issuesOf({ ...EMPTY_PERSON_DETAILS, citizenship: '' })).toEqual({
      category: 'validation.required',
      lastName: 'validation.required',
      firstName: 'validation.required',
      birthDate: 'validation.required',
      gender: 'validation.required',
      citizenship: 'validation.required',
      phone: 'validation.required',
    });
  });

  it('should use the Uzbek phone message when a citizen of Uzbekistan has a foreign number', () => {
    expect(issuesOf({ ...VALID, phone: '+7 901 234 56 78' })).toEqual({
      phone: 'validation.phone',
    });
  });

  it('should keep the international number when the reader is a foreign citizen', () => {
    const result = schema.parse({ ...VALID, citizenship: '1', phone: '+7 (901) 234-56-78' });

    expect([result.citizenship, result.phone]).toEqual([Citizenship.Foreign, '+79012345678']);
  });

  it('should use the international message when a foreign number is too short', () => {
    expect(issuesOf({ ...VALID, citizenship: '1', phone: '12345' })).toEqual({
      phone: 'validation.internationalPhone',
    });
  });

  it('should check the phone format when another field breaks a format rule', () => {
    expect(issuesOf({ ...VALID, firstName: 'Ali2', phone: '123' })).toEqual({
      firstName: 'validation.name',
      phone: 'validation.phone',
    });
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
