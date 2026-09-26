import { describe, expect, it } from 'vitest';
import { SortOrder } from '@core/http/paging';
import { readPageRequest, writeFilter, writePage, writeSort } from './table-search-params';

const DEFAULT_SORT = { field: 'cardNumber', order: SortOrder.Descending };

describe('readPageRequest', () => {
  it('should use defaults when the URL has no table params', () => {
    expect(readPageRequest(new URLSearchParams(), DEFAULT_SORT)).toEqual({
      first: 0,
      rows: 10,
      sort: DEFAULT_SORT,
    });
  });

  it('should read paging and sorting when the URL has them', () => {
    const params = new URLSearchParams('first=25&rows=25&sort=lastName:asc');

    expect(readPageRequest(params, DEFAULT_SORT)).toEqual({
      first: 25,
      rows: 25,
      sort: { field: 'lastName', order: SortOrder.Ascending },
    });
  });

  it('should ignore values when they are not allowed', () => {
    const params = new URLSearchParams('first=-5&rows=1000');

    expect(readPageRequest(params, null)).toEqual({ first: 0, rows: 10, sort: null });
  });
});

describe('writers', () => {
  it('should reset the page when a filter changes', () => {
    const next = writeFilter(new URLSearchParams('first=50&status=1'), 'search', 'ali');

    expect(next.toString()).toBe('status=1&search=ali');
  });

  it('should drop a filter when its value is empty', () => {
    expect(writeFilter(new URLSearchParams('search=ali'), 'search', '').toString()).toBe('');
  });

  it('should write the sort and reset the page when sorting changes', () => {
    const next = writeSort(new URLSearchParams('first=10'), {
      field: 'expiresOn',
      order: SortOrder.Descending,
    });

    expect(next.toString()).toBe('sort=expiresOn%3Adesc');
  });

  it('should keep filters when the page changes', () => {
    expect(writePage(new URLSearchParams('search=ali'), 20, 10).toString()).toBe(
      'search=ali&first=20&rows=10',
    );
  });
});
