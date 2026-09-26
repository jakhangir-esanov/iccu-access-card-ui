import { useSyncExternalStore } from 'react';
import { UserRole } from '@shared/models/user-role';
import type { AuthUser, Credentials } from './auth-user';
import { sessionStore } from './session';
import type { SessionState } from './session-store';

export interface Auth {
  readonly session: SessionState;
  readonly user: AuthUser | null;
  readonly isAdmin: boolean;
  readonly login: (credentials: Credentials) => Promise<AuthUser>;
  readonly logout: () => Promise<void>;
  readonly endSession: () => void;
}

const login = (credentials: Credentials) => sessionStore.login(credentials);
const logout = () => sessionStore.logout();
const endSession = () => {
  sessionStore.end();
};

export function useSession(): SessionState {
  return useSyncExternalStore(sessionStore.subscribe, sessionStore.getState);
}

export function useAuth(): Auth {
  const session = useSession();
  const user = session.status === 'authenticated' ? session.user : null;
  return {
    session,
    user,
    isAdmin: user?.role === UserRole.Admin,
    login,
    logout,
    endSession,
  };
}
