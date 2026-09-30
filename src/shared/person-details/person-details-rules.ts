import { Citizenship } from '@shared/models/citizenship';

export const NAME_MAX_LENGTH = 100;
export const NAME_PATTERN = /^\s*\p{L}[\p{L}\p{M}'ʻʼ‘’` -]*$/u;
export const EARLIEST_BIRTH_DATE = '1900-01-01';

const PHONE_COUNTRY_CODE = '998';
const PHONE_NATIONAL_LENGTH = 9;
const PHONE_FULL_LENGTH = 12;
const INTERNATIONAL_MIN_LENGTH = 8;
const INTERNATIONAL_MAX_LENGTH = 15;
const LEADING_ZERO = '0';
const NON_DIGIT = /\D/g;

function normalizeUzbekPhone(digits: string): string | null {
  const full = digits.length === PHONE_NATIONAL_LENGTH ? `${PHONE_COUNTRY_CODE}${digits}` : digits;
  const isValid = full.length === PHONE_FULL_LENGTH && full.startsWith(PHONE_COUNTRY_CODE);
  return isValid ? `+${full}` : null;
}

function normalizeInternationalPhone(digits: string): string | null {
  const isValid =
    digits.length >= INTERNATIONAL_MIN_LENGTH &&
    digits.length <= INTERNATIONAL_MAX_LENGTH &&
    !digits.startsWith(LEADING_ZERO);
  return isValid ? `+${digits}` : null;
}

export function normalizePhone(phone: string, citizenship: Citizenship | null): string | null {
  const digits = phone.replace(NON_DIGIT, '');
  const uzbekPhone = normalizeUzbekPhone(digits);
  if (uzbekPhone !== null || citizenship !== Citizenship.Foreign) {
    return uzbekPhone;
  }
  return normalizeInternationalPhone(digits);
}

export function isValidBirthDate(birthDate: string, today: string): boolean {
  return birthDate >= EARLIEST_BIRTH_DATE && birthDate < today;
}
