import { apiClient } from '@core/http/api-client';

export interface ChangePasswordRequest {
  readonly currentPassword: string;
  readonly newPassword: string;
}

export function changePassword(request: ChangePasswordRequest): Promise<void> {
  return apiClient.post('/auth/change-password', request);
}
