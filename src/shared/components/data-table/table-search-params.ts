import { DEFAULT_PAGE_SIZE, SortOrder, type PageRequest, type Sorting } from '@core/http/paging';

export const PAGE_SIZES = [10, 25, 50] as const;

export const TableParam = {
  first: 'first',
  rows: 'rows',
  sort: 'sort',
} as const;

const SORT_SEPARATOR = ':';
const DESCENDING = 'desc';
const ASCENDING = 'asc';

function readNumber(params: URLSearchParams, name: string): number | null {
  const value = Number(params.get(name));
  return Number.isInteger(value) && value >= 0 ? value : null;
}

function readSort(params: URLSearchParams, fallback: Sorting | null): Sorting | null {
  const [field, direction] = (params.get(TableParam.sort) ?? '').split(SORT_SEPARATOR);
  if (field === undefined || field === '') {
    return fallback;
  }
  return { field, order: direction === DESCENDING ? SortOrder.Descending : SortOrder.Ascending };
}

export function readPageRequest(params: URLSearchParams, defaultSort: Sorting | null): PageRequest {
  const rows = readNumber(params, TableParam.rows);
  return {
    first: readNumber(params, TableParam.first) ?? 0,
    rows: PAGE_SIZES.find((size) => size === rows) ?? DEFAULT_PAGE_SIZE,
    sort: readSort(params, defaultSort),
  };
}

export function writeSort(params: URLSearchParams, sort: Sorting | null): URLSearchParams {
  const next = new URLSearchParams(params);
  next.delete(TableParam.first);
  if (sort === null) {
    next.delete(TableParam.sort);
    return next;
  }
  const direction = sort.order === SortOrder.Descending ? DESCENDING : ASCENDING;
  next.set(TableParam.sort, `${sort.field}${SORT_SEPARATOR}${direction}`);
  return next;
}

export function writePage(params: URLSearchParams, first: number, rows: number): URLSearchParams {
  const next = new URLSearchParams(params);
  next.set(TableParam.first, String(first));
  next.set(TableParam.rows, String(rows));
  return next;
}

export function writeFilter(params: URLSearchParams, name: string, value: string): URLSearchParams {
  const next = new URLSearchParams(params);
  next.delete(TableParam.first);
  if (value === '') {
    next.delete(name);
  } else {
    next.set(name, value);
  }
  return next;
}
