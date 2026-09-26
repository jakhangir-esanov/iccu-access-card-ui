import { apiClient } from '@core/http/api-client';
import { authApi } from './auth.service';
import { SessionStore } from './session-store';

export const sessionStore = new SessionStore(authApi);

apiClient.connectSession({
  accessToken: () => sessionStore.accessToken(),
  refresh: () => sessionStore.refresh(),
  expire: () => {
    sessionStore.expire();
  },
});
