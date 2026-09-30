import type { QueryParams } from '@core/http/api-types';
import { SortOrder, type Sorting } from '@core/http/paging';
import { isCardStatus, type CardStatus } from '@shared/models/card-status';
import { isCitizenship, type Citizenship } from '@shared/models/citizenship';
import { isGender, type Gender } from '@shared/models/gender';
import { isReaderCategory, type ReaderCategory } from '@shared/models/reader-category';
import { isRegistrationSource, type RegistrationSource } from '@shared/models/registration-source';

export const ReaderFilterParam = {
  search: 'search',
  category: 'category',
  gender: 'gender',
  citizenship: 'citizenship',
  source: 'source',
  status: 'status',
  registeredFrom: 'registeredFrom',
  registeredTo: 'registeredTo',
} as const;

export type ReaderFilterName = (typeof ReaderFilterParam)[keyof typeof ReaderFilterParam];

export const READER_FILTER_NAMES: readonly ReaderFilterName[] = Object.values(ReaderFilterParam);

export interface ReaderFilter {
  readonly search: string;
  readonly category: ReaderCategory | null;
  readonly gender: Gender | null;
  readonly citizenship: Citizenship | null;
  readonly source: RegistrationSource | null;
  readonly status: CardStatus | null;
  readonly registeredFrom: string;
  readonly registeredTo: string;
}

export const DEFAULT_READER_SORT: Sorting = { field: 'cardNumber', order: SortOrder.Descending };

function parseEnum<T>(value: string, guard: (candidate: unknown) => candidate is T): T | null {
  if (value === '') {
    return null;
  }
  const parsed = Number(value);
  return guard(parsed) ? parsed : null;
}

export function parseReaderFilter(read: (name: ReaderFilterName) => string): ReaderFilter {
  return {
    search: read(ReaderFilterParam.search),
    category: parseEnum(read(ReaderFilterParam.category), isReaderCategory),
    gender: parseEnum(read(ReaderFilterParam.gender), isGender),
    citizenship: parseEnum(read(ReaderFilterParam.citizenship), isCitizenship),
    source: parseEnum(read(ReaderFilterParam.source), isRegistrationSource),
    status: parseEnum(read(ReaderFilterParam.status), isCardStatus),
    registeredFrom: read(ReaderFilterParam.registeredFrom),
    registeredTo: read(ReaderFilterParam.registeredTo),
  };
}

export function toReaderQuery(filter: ReaderFilter): QueryParams {
  return { ...filter, search: filter.search.trim() };
}

export function hasActiveFilter(filter: ReaderFilter): boolean {
  return Object.values(toReaderQuery(filter)).some((value) => value !== null && value !== '');
}
