import type { TranslationKey } from '@core/i18n/translations/dictionary';

export const ReaderCategory = {
  Pupil: 0,
  Student: 1,
  Master: 2,
  PhD: 3,
  DSc: 4,
  Professor: 5,
  Employee: 6,
  User: 7,
} as const;

export type ReaderCategory = (typeof ReaderCategory)[keyof typeof ReaderCategory];

export const READER_CATEGORIES: readonly ReaderCategory[] = Object.values(ReaderCategory);

export const READER_CATEGORY_LABELS: Readonly<Record<ReaderCategory, TranslationKey>> = {
  [ReaderCategory.Pupil]: 'enums.readerCategory.pupil',
  [ReaderCategory.Student]: 'enums.readerCategory.student',
  [ReaderCategory.Master]: 'enums.readerCategory.master',
  [ReaderCategory.PhD]: 'enums.readerCategory.phd',
  [ReaderCategory.DSc]: 'enums.readerCategory.dsc',
  [ReaderCategory.Professor]: 'enums.readerCategory.professor',
  [ReaderCategory.Employee]: 'enums.readerCategory.employee',
  [ReaderCategory.User]: 'enums.readerCategory.user',
};

export function isReaderCategory(value: unknown): value is ReaderCategory {
  return READER_CATEGORIES.some((category) => category === value);
}
