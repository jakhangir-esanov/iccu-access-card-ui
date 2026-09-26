import { describe, expect, it } from 'vitest';
import { CardStatus } from '@shared/models/card-status';
import { ReaderCategory } from '@shared/models/reader-category';
import {
  hasActiveFilter,
  parseReaderFilter,
  toReaderQuery,
  type ReaderFilterName,
} from './reader-filter';

const reading =
  (values: Partial<Record<ReaderFilterName, string>>) =>
  (name: ReaderFilterName): string =>
    values[name] ?? '';

describe('parseReaderFilter', () => {
  it('should read enums and dates when the URL has valid values', () => {
    const filter = parseReaderFilter(
      reading({ category: '5', status: '2', registeredFrom: '2026-01-01', search: 'ali' }),
    );

    expect(filter).toEqual({
      search: 'ali',
      category: ReaderCategory.Professor,
      source: null,
      status: CardStatus.Expired,
      registeredFrom: '2026-01-01',
      registeredTo: '',
    });
  });

  it('should ignore enums when the URL value is unknown', () => {
    const filter = parseReaderFilter(reading({ category: '99', source: 'x', status: '' }));

    expect([filter.category, filter.source, filter.status]).toEqual([null, null, null]);
  });
});

describe('toReaderQuery', () => {
  it('should trim the search text when the query is built', () => {
    const filter = parseReaderFilter(reading({ search: '  0000001 ', category: '0' }));

    expect(toReaderQuery(filter)).toMatchObject({ search: '0000001', category: 0 });
  });
});

describe('hasActiveFilter', () => {
  it('should be false when nothing is selected', () => {
    expect(hasActiveFilter(parseReaderFilter(reading({})))).toBe(false);
  });

  it('should be true when the category is Pupil, whose value is zero', () => {
    expect(hasActiveFilter(parseReaderFilter(reading({ category: '0' })))).toBe(true);
  });
});
