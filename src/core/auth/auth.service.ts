import { apiClient, type RequestOptions } from '@core/http/api-client';
import type { AuthResponseDto } from './auth.dto';
import { toAuthSession } from './auth.mapper';
import type { AuthSession, Credentials } from './auth-user';

const WITHOUT_REFRESH: RequestOptions = { retryOnUnauthorized: false };

export interface AuthApi {
  readonly login: (credentials: Credentials) => Promise<AuthSession>;
  readonly refresh: () => Promise<AuthSession>;
  readonly logout: () => Promise<void>;
}

export const authApi: AuthApi = {
  login: async (credentials) =>
    toAuthSession(
      await apiClient.post<AuthResponseDto>('/auth/login', credentials, WITHOUT_REFRESH),
    ),
  refresh: async () =>
    toAuthSession(
      await apiClient.post<AuthResponseDto>('/auth/refresh', undefined, WITHOUT_REFRESH),
    ),
  logout: () => apiClient.post('/auth/logout', undefined, WITHOUT_REFRESH),
};
