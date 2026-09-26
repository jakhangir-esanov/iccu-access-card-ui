import { useMutation } from '@tanstack/react-query';
import type { Credentials } from '@core/auth/auth-user';
import { useAuth } from '@core/auth/use-auth';
import { changePassword, type ChangePasswordRequest } from './password.service';

export function useLoginMutation() {
  const { login } = useAuth();
  return useMutation({ mutationFn: (credentials: Credentials) => login(credentials) });
}

export function useChangePasswordMutation() {
  return useMutation({ mutationFn: (request: ChangePasswordRequest) => changePassword(request) });
}
