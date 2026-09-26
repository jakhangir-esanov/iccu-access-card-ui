import { describe, expect, it } from 'vitest';
import { SortOrder, toPageQuery, toSnakeCase } from './paging';

describe('toSnakeCase', () => {
  it.each([
    ['lastName', 'last_name'],
    ['expiresOn', 'expires_on'],
    ['cardNumber', 'card_number'],
    ['id', 'id'],
  ])('should turn %s into %s', (field, expected) => {
    expect(toSnakeCase(field)).toBe(expected);
  });
});

describe('toPageQuery', () => {
  it('should send snake_case sort field and order when sorting is set', () => {
    const query = toPageQuery({
      first: 50,
      rows: 25,
      sort: { field: 'createdAt', order: SortOrder.Descending },
    });

    expect(query).toEqual({ first: 50, rows: 25, sortField: 'created_at', sortOrder: -1 });
  });

  it('should leave sorting to the backend default when sorting is not set', () => {
    expect(toPageQuery({ first: 0, rows: 10 })).toEqual({
      first: 0,
      rows: 10,
      sortField: null,
      sortOrder: null,
    });
  });
});
