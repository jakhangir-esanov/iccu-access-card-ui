import { useCallback } from 'react';
import { useSearchParams } from 'react-router';
import type { PageRequest, Sorting } from '@core/http/paging';
import { readPageRequest, writeFilter, writePage, writeSort } from './table-search-params';

export interface TableSearchParams {
  readonly page: PageRequest;
  readonly filter: (name: string) => string;
  readonly setPage: (first: number, rows: number) => void;
  readonly setSort: (sort: Sorting | null) => void;
  readonly setFilter: (name: string, value: string) => void;
}

const REPLACE = { replace: true } as const;

export function useTableSearchParams(defaultSort: Sorting | null): TableSearchParams {
  const [params, setParams] = useSearchParams();
  const update = useCallback(
    (write: (current: URLSearchParams) => URLSearchParams) => {
      setParams(write, REPLACE);
    },
    [setParams],
  );
  return {
    page: readPageRequest(params, defaultSort),
    filter: (name) => params.get(name) ?? '',
    setPage: (first, rows) => {
      update((current) => writePage(current, first, rows));
    },
    setSort: (sort) => {
      update((current) => writeSort(current, sort));
    },
    setFilter: (name, value) => {
      update((current) => writeFilter(current, name, value));
    },
  };
}
