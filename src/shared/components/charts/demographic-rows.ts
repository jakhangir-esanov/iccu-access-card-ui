import type { Translate } from '@core/i18n/translate';
import type { TranslationKey } from '@core/i18n/translations/dictionary';
import { CITIZENSHIPS, CITIZENSHIP_LABELS, type Citizenship } from '@shared/models/citizenship';
import { GENDERS, GENDER_LABELS, type Gender } from '@shared/models/gender';
import type { ChartRow } from './chart-types';

const NOT_SPECIFIED_KEY = 'none';

export interface GenderCountLike {
  readonly gender: Gender | null;
  readonly count: number;
}

export interface CitizenshipCountLike {
  readonly citizenship: Citizenship | null;
  readonly count: number;
}

interface OptionCount<T extends number> {
  readonly value: T | null;
  readonly count: number;
}

function toOptionRows<T extends number>(
  options: readonly T[],
  labels: Readonly<Record<T, TranslationKey>>,
  counts: readonly OptionCount<T>[],
  seriesId: string,
  t: Translate,
): ChartRow[] {
  const countOf = (value: T | null) => counts.find((row) => row.value === value)?.count ?? 0;
  const rows: ChartRow[] = options.map((option) => ({
    key: String(option),
    label: t(labels[option]),
    values: { [seriesId]: countOf(option) },
  }));
  const notSpecified = countOf(null);
  return notSpecified === 0 ? rows : [...rows, notSpecifiedRow(notSpecified, seriesId, t)];
}

function notSpecifiedRow(count: number, seriesId: string, t: Translate): ChartRow {
  return { key: NOT_SPECIFIED_KEY, label: t('enums.notSpecified'), values: { [seriesId]: count } };
}

export function toGenderRows(
  counts: readonly GenderCountLike[],
  seriesId: string,
  t: Translate,
): ChartRow[] {
  const optionCounts = counts.map((row) => ({ value: row.gender, count: row.count }));
  return toOptionRows(GENDERS, GENDER_LABELS, optionCounts, seriesId, t);
}

export function toCitizenshipRows(
  counts: readonly CitizenshipCountLike[],
  seriesId: string,
  t: Translate,
): ChartRow[] {
  const optionCounts = counts.map((row) => ({ value: row.citizenship, count: row.count }));
  return toOptionRows(CITIZENSHIPS, CITIZENSHIP_LABELS, optionCounts, seriesId, t);
}
