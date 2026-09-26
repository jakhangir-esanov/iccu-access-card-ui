import type { QueryParams } from './api-types';

export const SortOrder = {
  Ascending: 1,
  Descending: -1,
} as const;

export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];

export interface Sorting {
  readonly field: string;
  readonly order: SortOrder;
}

export interface PageRequest {
  readonly first: number;
  readonly rows: number;
  readonly sort?: Sorting | null;
}

export const DEFAULT_PAGE_SIZE = 10;

const CAPITAL_LETTER = /[A-Z]/g;

export function toSnakeCase(name: string): string {
  return name.replace(CAPITAL_LETTER, (letter) => `_${letter.toLowerCase()}`);
}

export function toPageQuery(page: PageRequest): QueryParams {
  return {
    first: page.first,
    rows: page.rows,
    sortField: page.sort ? toSnakeCase(page.sort.field) : null,
    sortOrder: page.sort?.order ?? null,
  };
}
