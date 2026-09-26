import type { TranslationKey } from '@core/i18n/translations/dictionary';

export const DocumentType = {
  Passport: 0,
  BirthCertificate: 1,
} as const;

export type DocumentType = (typeof DocumentType)[keyof typeof DocumentType];

export const DOCUMENT_TYPES: readonly DocumentType[] = Object.values(DocumentType);

export const DOCUMENT_TYPE_LABELS: Readonly<Record<DocumentType, TranslationKey>> = {
  [DocumentType.Passport]: 'enums.documentType.passport',
  [DocumentType.BirthCertificate]: 'enums.documentType.birthCertificate',
};

export function isDocumentType(value: unknown): value is DocumentType {
  return DOCUMENT_TYPES.some((type) => type === value);
}
