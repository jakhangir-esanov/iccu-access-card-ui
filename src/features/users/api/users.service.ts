import { apiClient } from '@core/http/api-client';
import type { PagedList } from '@core/http/api-types';
import { toPageQuery, type PageRequest } from '@core/http/paging';
import { toUserQuery, type UserFilter } from '../models/user-filter';
import type {
  CreateUserRequestDto,
  ResetPasswordRequestDto,
  UpdateUserRequestDto,
  UserDto,
} from './users.dto';

const BASE_PATH = '/users';

export function fetchUsers(filter: UserFilter, page: PageRequest): Promise<PagedList<UserDto>> {
  return apiClient.getPage<UserDto>(BASE_PATH, {
    query: { ...toUserQuery(filter), ...toPageQuery(page) },
  });
}

export function createUser(request: CreateUserRequestDto): Promise<string> {
  return apiClient.post<string>(BASE_PATH, request);
}

export function updateUser(id: string, request: UpdateUserRequestDto): Promise<void> {
  return apiClient.put(`${BASE_PATH}/${id}`, request);
}

export function resetUserPassword(id: string, request: ResetPasswordRequestDto): Promise<void> {
  return apiClient.post(`${BASE_PATH}/${id}/reset-password`, request);
}
