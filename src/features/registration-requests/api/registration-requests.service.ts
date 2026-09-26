import { apiClient } from '@core/http/api-client';
import type { PagedList } from '@core/http/api-types';
import { toPageQuery, type PageRequest } from '@core/http/paging';
import { toRequestQuery, type RequestFilter } from '../models/request-filter';
import type {
  ApproveRegistrationResponseDto,
  RegistrationRequestDto,
  RegistrationRequestListItemDto,
  RejectRegistrationRequestDto,
  UpdateRegistrationRequestDto,
} from './registration-requests.dto';

const BASE_PATH = '/registration-requests';

export function fetchRegistrationRequests(
  filter: RequestFilter,
  page: PageRequest,
): Promise<PagedList<RegistrationRequestListItemDto>> {
  return apiClient.getPage<RegistrationRequestListItemDto>(BASE_PATH, {
    query: { ...toRequestQuery(filter), ...toPageQuery(page) },
  });
}

export function fetchRegistrationRequest(id: string): Promise<RegistrationRequestDto> {
  return apiClient.get<RegistrationRequestDto>(`${BASE_PATH}/${id}`);
}

export function updateRegistrationRequest(
  id: string,
  request: UpdateRegistrationRequestDto,
): Promise<void> {
  return apiClient.put(`${BASE_PATH}/${id}`, request);
}

export function approveRegistrationRequest(id: string): Promise<ApproveRegistrationResponseDto> {
  return apiClient.post<ApproveRegistrationResponseDto>(`${BASE_PATH}/${id}/approve`);
}

export function rejectRegistrationRequest(
  id: string,
  request: RejectRegistrationRequestDto,
): Promise<void> {
  return apiClient.post(`${BASE_PATH}/${id}/reject`, request);
}
