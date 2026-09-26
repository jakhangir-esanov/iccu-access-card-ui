import type { QueryParams } from './api-types';

export const API_PREFIX = '/api';

export function buildUrl(path: string, query?: QueryParams): string {
  const url = `${API_PREFIX}${path}`;
  if (query === undefined) {
    return url;
  }
  const search = new URLSearchParams();
  for (const [name, value] of Object.entries(query)) {
    if (value !== null && value !== undefined && value !== '') {
      search.append(name, String(value));
    }
  }
  const encoded = search.toString();
  return encoded === '' ? url : `${url}?${encoded}`;
}
