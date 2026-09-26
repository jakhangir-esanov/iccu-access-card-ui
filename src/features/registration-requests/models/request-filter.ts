import { SortOrder, type Sorting } from '@core/http/paging';
import {
  isRegistrationRequestStatus,
  RegistrationRequestStatus,
} from '@shared/models/registration-request-status';

export const RequestFilterParam = {
  status: 'status',
  search: 'search',
} as const;

export const ALL_STATUSES = 'all';

export type StatusFilter = RegistrationRequestStatus | typeof ALL_STATUSES;

export interface RequestFilter {
  readonly status: StatusFilter;
  readonly search: string;
}

export const DEFAULT_REQUEST_SORT: Sorting = { field: 'submittedAt', order: SortOrder.Descending };

export function parseStatusFilter(value: string): StatusFilter {
  if (value === ALL_STATUSES) {
    return ALL_STATUSES;
  }
  const status = Number(value);
  return value !== '' && isRegistrationRequestStatus(status)
    ? status
    : RegistrationRequestStatus.Pending;
}

export function toStatusParam(status: StatusFilter): string {
  return status === RegistrationRequestStatus.Pending ? '' : String(status);
}

export function toRequestQuery(filter: RequestFilter) {
  return {
    status: filter.status === ALL_STATUSES ? null : filter.status,
    search: filter.search.trim(),
  };
}
