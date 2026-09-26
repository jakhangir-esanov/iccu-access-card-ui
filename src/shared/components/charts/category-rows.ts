import type { Translate } from '@core/i18n/translate';
import {
  READER_CATEGORIES,
  READER_CATEGORY_LABELS,
  type ReaderCategory,
} from '@shared/models/reader-category';
import type { ChartRow } from './chart-types';

export interface CategoryCountLike {
  readonly category: ReaderCategory;
  readonly count: number;
}

export function toCategoryRows(
  counts: readonly CategoryCountLike[],
  seriesId: string,
  t: Translate,
): ChartRow[] {
  return READER_CATEGORIES.map((category) => ({
    category,
    count: counts.find((row) => row.category === category)?.count ?? 0,
  }))
    .sort((left, right) => right.count - left.count)
    .map(({ category, count }) => ({
      key: String(category),
      label: t(READER_CATEGORY_LABELS[category]),
      values: { [seriesId]: count },
    }));
}
