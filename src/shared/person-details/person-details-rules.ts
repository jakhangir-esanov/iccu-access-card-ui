import { DocumentType } from '@shared/models/document-type';

export const NAME_MAX_LENGTH = 100;
export const NAME_PATTERN = /^\s*\p{L}[\p{L}\p{M}'ʻʼ‘’` -]*$/u;
export const EARLIEST_BIRTH_DATE = '1900-01-01';

const PHONE_COUNTRY_CODE = '998';
const PHONE_NATIONAL_LENGTH = 9;
const PHONE_FULL_LENGTH = 12;
const NON_DIGIT = /\D/g;

const DOCUMENT_SEPARATORS = /[\s\-№#.]/g;
const PASSPORT_PATTERN = /^[A-Z]{2}\d{7}$/;
const BIRTH_CERTIFICATE_PATTERN = /^(?=.*\d)[\p{Lu}\d]{6,20}$/u;

const DOCUMENT_PATTERNS: Readonly<Record<DocumentType, RegExp>> = {
  [DocumentType.Passport]: PASSPORT_PATTERN,
  [DocumentType.BirthCertificate]: BIRTH_CERTIFICATE_PATTERN,
};

export function normalizePhone(phone: string): string | null {
  const digits = phone.replace(NON_DIGIT, '');
  const full = digits.length === PHONE_NATIONAL_LENGTH ? `${PHONE_COUNTRY_CODE}${digits}` : digits;
  const isValid = full.length === PHONE_FULL_LENGTH && full.startsWith(PHONE_COUNTRY_CODE);
  return isValid ? `+${full}` : null;
}

export function normalizeDocumentNumber(documentNumber: string): string {
  return documentNumber.toUpperCase().replace(DOCUMENT_SEPARATORS, '');
}

export function isValidDocumentNumber(type: DocumentType, documentNumber: string): boolean {
  return DOCUMENT_PATTERNS[type].test(normalizeDocumentNumber(documentNumber));
}

export function isValidBirthDate(birthDate: string, today: string): boolean {
  return birthDate >= EARLIEST_BIRTH_DATE && birthDate < today;
}
