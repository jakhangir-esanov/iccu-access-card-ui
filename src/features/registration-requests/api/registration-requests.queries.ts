import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { PageRequest } from '@core/http/paging';
import type { PersonDetails } from '@shared/person-details/person-details.schema';
import type { RequestFilter } from '../models/request-filter';
import {
  toApproval,
  toRegistrationRequest,
  toRegistrationRequestListItem,
  toUpdateRegistrationRequest,
} from './registration-requests.mapper';
import {
  approveRegistrationRequest,
  fetchRegistrationRequest,
  fetchRegistrationRequests,
  rejectRegistrationRequest,
  updateRegistrationRequest,
} from './registration-requests.service';

export const registrationRequestKeys = {
  all: ['registration-requests'] as const,
  list: (filter: RequestFilter, page: PageRequest) =>
    [...registrationRequestKeys.all, 'list', filter, page] as const,
  detail: (id: string) => [...registrationRequestKeys.all, 'detail', id] as const,
};

export function useRegistrationRequests(filter: RequestFilter, page: PageRequest) {
  return useQuery({
    queryKey: registrationRequestKeys.list(filter, page),
    queryFn: async () => {
      const result = await fetchRegistrationRequests(filter, page);
      return { rows: result.data.map(toRegistrationRequestListItem), total: result.totalCount };
    },
    placeholderData: keepPreviousData,
    staleTime: 0,
  });
}

export function useRegistrationRequest(id: string) {
  return useQuery({
    queryKey: registrationRequestKeys.detail(id),
    queryFn: async () => toRegistrationRequest(await fetchRegistrationRequest(id)),
  });
}

function useInvalidateRequests() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: registrationRequestKeys.all });
}

export function useUpdateRegistrationRequest(id: string) {
  const invalidate = useInvalidateRequests();
  return useMutation({
    mutationFn: (details: PersonDetails) =>
      updateRegistrationRequest(id, toUpdateRegistrationRequest(details)),
    onSettled: invalidate,
  });
}

export function useApproveRegistrationRequest(id: string) {
  const invalidate = useInvalidateRequests();
  return useMutation({
    mutationFn: async () => toApproval(await approveRegistrationRequest(id)),
    onSettled: invalidate,
  });
}

export function useRejectRegistrationRequest(id: string) {
  const invalidate = useInvalidateRequests();
  return useMutation({
    mutationFn: (reason: string) => rejectRegistrationRequest(id, { reason }),
    onSettled: invalidate,
  });
}
