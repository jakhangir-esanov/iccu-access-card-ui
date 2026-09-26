import type { QueryParams } from '@core/http/api-types';
import { SortOrder, type Sorting } from '@core/http/paging';
import { isUserRole, type UserRole } from '@shared/models/user-role';

export const UserFilterParam = {
  search: 'search',
  role: 'role',
  isActive: 'isActive',
} as const;

export const ActiveFilter = {
  Active: 'true',
  Inactive: 'false',
} as const;

export type ActiveFilter = (typeof ActiveFilter)[keyof typeof ActiveFilter];

export interface UserFilter {
  readonly search: string;
  readonly role: UserRole | null;
  readonly isActive: ActiveFilter | null;
}

export const DEFAULT_USER_SORT: Sorting = { field: 'fullName', order: SortOrder.Ascending };

function parseActive(value: string): ActiveFilter | null {
  return value === ActiveFilter.Active || value === ActiveFilter.Inactive ? value : null;
}

export function parseUserFilter(read: (name: string) => string): UserFilter {
  const roleParam = read(UserFilterParam.role);
  const role = Number(roleParam);
  return {
    search: read(UserFilterParam.search),
    role: roleParam !== '' && isUserRole(role) ? role : null,
    isActive: parseActive(read(UserFilterParam.isActive)),
  };
}

export function toUserQuery(filter: UserFilter): QueryParams {
  return { search: filter.search.trim(), role: filter.role, isActive: filter.isActive };
}
