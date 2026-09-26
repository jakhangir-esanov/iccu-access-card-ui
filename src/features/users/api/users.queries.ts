import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { PageRequest } from '@core/http/paging';
import type { UserFilter } from '../models/user-filter';
import type { CreateUserFormValues, EditUserFormValues } from '../models/user-form.schema';
import { toCreateUserRequest, toUpdateUserRequest, toUser } from './users.mapper';
import { createUser, fetchUsers, resetUserPassword, updateUser } from './users.service';

export const userKeys = {
  all: ['users'] as const,
  list: (filter: UserFilter, page: PageRequest) => [...userKeys.all, 'list', filter, page] as const,
};

export function useUsers(filter: UserFilter, page: PageRequest) {
  return useQuery({
    queryKey: userKeys.list(filter, page),
    queryFn: async () => {
      const result = await fetchUsers(filter, page);
      return { rows: result.data.map(toUser), total: result.totalCount };
    },
    placeholderData: keepPreviousData,
  });
}

function useInvalidateUsers() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: userKeys.all });
}

export function useCreateUser() {
  const invalidate = useInvalidateUsers();
  return useMutation({
    mutationFn: (values: CreateUserFormValues) => createUser(toCreateUserRequest(values)),
    onSuccess: invalidate,
  });
}

export function useUpdateUser(id: string) {
  const invalidate = useInvalidateUsers();
  return useMutation({
    mutationFn: (values: EditUserFormValues) => updateUser(id, toUpdateUserRequest(values)),
    onSuccess: invalidate,
  });
}

export function useResetUserPassword(id: string) {
  return useMutation({
    mutationFn: (newPassword: string) => resetUserPassword(id, { newPassword }),
  });
}
