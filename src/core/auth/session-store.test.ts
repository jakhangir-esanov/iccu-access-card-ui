import { describe, expect, it, vi } from 'vitest';
import { ApiError, HttpErrorCode } from '@core/http/api-error';
import { UserRole } from '@shared/models/user-role';
import type { AuthApi } from './auth.service';
import type { AuthSession } from './auth-user';
import { SessionStore } from './session-store';

const session = (accessToken: string): AuthSession => ({
  accessToken,
  expiresAt: '2099-01-01T00:00:00Z',
  user: { id: 'u1', username: 'admin', fullName: 'Administrator', role: UserRole.Admin },
});

const unauthorized = () => new ApiError({ status: 401, code: 'User.InvalidRefreshToken' });

function fakeApi(overrides: Partial<AuthApi> = {}) {
  return {
    login: vi.fn<AuthApi['login']>().mockResolvedValue(session('login-token')),
    refresh: vi.fn<AuthApi['refresh']>().mockResolvedValue(session('refresh-token')),
    logout: vi.fn<AuthApi['logout']>().mockResolvedValue(undefined),
    ...overrides,
  };
}

describe('SessionStore', () => {
  it('should restore the session once when restore is called several times', async () => {
    const api = fakeApi();
    const store = new SessionStore(api);

    await Promise.all([store.restore(), store.restore()]);
    await store.restore();

    expect(api.refresh).toHaveBeenCalledTimes(1);
    expect(store.getState()).toMatchObject({ status: 'authenticated' });
    expect(store.accessToken()).toBe('refresh-token');
  });

  it('should become anonymous without a reason when there is no refresh cookie', async () => {
    const store = new SessionStore(fakeApi({ refresh: vi.fn().mockRejectedValue(unauthorized()) }));

    await store.restore();

    expect(store.getState()).toEqual({
      status: 'anonymous',
      reason: null,
      returnToLocation: true,
    });
  });

  it('should keep the error code as the reason when the library network blocks the API', async () => {
    const blocked = new ApiError({ status: 403, code: HttpErrorCode.OutsideLibraryNetwork });
    const store = new SessionStore(fakeApi({ refresh: vi.fn().mockRejectedValue(blocked) }));

    await store.restore();

    expect(store.getState()).toMatchObject({ reason: HttpErrorCode.OutsideLibraryNetwork });
  });

  it('should share one refresh call when refresh is requested concurrently', async () => {
    const api = fakeApi();
    const store = new SessionStore(api);

    const results = await Promise.all([store.refresh(), store.refresh()]);

    expect(results).toEqual([true, true]);
    expect(api.refresh).toHaveBeenCalledTimes(1);
  });

  it('should report an expired session and notify listeners when a refresh fails after sign-in', async () => {
    const api = fakeApi({ refresh: vi.fn().mockRejectedValue(unauthorized()) });
    const store = new SessionStore(api);
    const signedOut = vi.fn();
    store.onSignedOut(signedOut);
    await store.login({ username: 'admin', password: 'x' });

    const refreshed = await store.refresh();

    expect(refreshed).toBe(false);
    expect(store.getState()).toMatchObject({ reason: HttpErrorCode.Unauthorized });
    expect(store.accessToken()).toBeNull();
    expect(signedOut).toHaveBeenCalledTimes(1);
  });

  it('should sign out locally without a return location when the backend logout fails', async () => {
    const api = fakeApi({ logout: vi.fn().mockRejectedValue(new Error('offline')) });
    const store = new SessionStore(api);
    await store.login({ username: 'admin', password: 'x' });

    await store.logout();

    expect(store.getState()).toEqual({
      status: 'anonymous',
      reason: null,
      returnToLocation: false,
    });
  });

  it('should mark the session expired when expire is called while signed in', async () => {
    const store = new SessionStore(fakeApi());
    await store.login({ username: 'admin', password: 'x' });

    store.expire();

    expect(store.getState()).toEqual({
      status: 'anonymous',
      reason: HttpErrorCode.Unauthorized,
      returnToLocation: true,
    });
  });

  it('should notify subscribers when the state changes', async () => {
    const store = new SessionStore(fakeApi());
    const listener = vi.fn();
    store.subscribe(listener);

    await store.login({ username: 'admin', password: 'x' });

    expect(listener).toHaveBeenCalled();
    expect(store.getState()).toMatchObject({ user: { fullName: 'Administrator' } });
  });
});

describe('SessionStore.freshAccessToken', () => {
  const LOGIN_AT = Date.parse('2026-09-26T14:00:00Z');
  const expiringSession: AuthSession = {
    ...session('login-token'),
    expiresAt: '2026-09-26T14:15:00Z',
  };

  it('should return the current token when it is valid for more than a minute', async () => {
    const api = fakeApi({ login: vi.fn().mockResolvedValue(expiringSession) });
    const store = new SessionStore(api);
    await store.login({ username: 'admin', password: 'x' });

    const token = await store.freshAccessToken(LOGIN_AT);

    expect(token).toBe('login-token');
    expect(api.refresh).not.toHaveBeenCalled();
  });

  it('should refresh first when the token expires within a minute', async () => {
    const api = fakeApi({ login: vi.fn().mockResolvedValue(expiringSession) });
    const store = new SessionStore(api);
    await store.login({ username: 'admin', password: 'x' });

    const token = await store.freshAccessToken(Date.parse('2026-09-26T14:14:30Z'));

    expect(token).toBe('refresh-token');
    expect(api.refresh).toHaveBeenCalledTimes(1);
  });

  it('should return null when the refresh fails', async () => {
    const store = new SessionStore(fakeApi({ refresh: vi.fn().mockRejectedValue(unauthorized()) }));

    expect(await store.freshAccessToken(LOGIN_AT)).toBeNull();
  });
});
