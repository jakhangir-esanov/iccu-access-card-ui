import { describe, expect, it } from 'vitest';
import { buildUrl } from './query-string';

describe('buildUrl', () => {
  it('should prefix the path with /api when there is no query', () => {
    expect(buildUrl('/readers')).toBe('/api/readers');
  });

  it('should skip empty values when the query has them', () => {
    const url = buildUrl('/readers', {
      search: 'Aliyev Vali',
      category: 0,
      source: null,
      status: undefined,
      registeredFrom: '',
      isActive: false,
    });

    expect(url).toBe('/api/readers?search=Aliyev+Vali&category=0&isActive=false');
  });

  it('should drop the question mark when every value is empty', () => {
    expect(buildUrl('/users', { search: '' })).toBe('/api/users');
  });
});
