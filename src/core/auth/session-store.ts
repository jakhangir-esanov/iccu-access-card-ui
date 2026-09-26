import { HttpErrorCode, isApiError } from '@core/http/api-error';
import type { AuthApi } from './auth.service';
import type { AuthSession, AuthUser, Credentials } from './auth-user';

export type SessionState =
  | { readonly status: 'unknown' }
  | { readonly status: 'restoring' }
  | {
      readonly status: 'anonymous';
      readonly reason: string | null;
      readonly returnToLocation: boolean;
    }
  | { readonly status: 'authenticated'; readonly user: AuthUser };

type Listener = () => void;

const UNAUTHORIZED_STATUS = 401;

export class SessionStore {
  readonly #api: AuthApi;
  readonly #listeners = new Set<Listener>();
  readonly #signedOutListeners = new Set<Listener>();
  #state: SessionState = { status: 'unknown' };
  #token: string | null = null;
  #restoring: Promise<void> | null = null;
  #refreshing: Promise<boolean> | null = null;

  constructor(api: AuthApi) {
    this.#api = api;
  }

  readonly getState = (): SessionState => this.#state;

  readonly subscribe = (listener: Listener): (() => void) => {
    this.#listeners.add(listener);
    return () => this.#listeners.delete(listener);
  };

  onSignedOut(listener: Listener): () => void {
    this.#signedOutListeners.add(listener);
    return () => this.#signedOutListeners.delete(listener);
  }

  accessToken(): string | null {
    return this.#token;
  }

  restore(): Promise<void> {
    if (this.#restoring === null && this.#state.status === 'unknown') {
      this.#setState({ status: 'restoring' });
      this.#restoring = this.refresh().then(() => undefined);
    }
    return this.#restoring ?? Promise.resolve();
  }

  refresh(): Promise<boolean> {
    this.#refreshing ??= this.#runRefresh().finally(() => {
      this.#refreshing = null;
    });
    return this.#refreshing;
  }

  async login(credentials: Credentials): Promise<AuthUser> {
    const session = await this.#api.login(credentials);
    this.#start(session);
    return session.user;
  }

  async logout(): Promise<void> {
    await this.#api.logout().catch(signOutLocallyWhenBackendFails);
    this.#end(null, false);
  }

  expire(): void {
    if (this.#state.status === 'authenticated') {
      this.#end(HttpErrorCode.Unauthorized, true);
    }
  }

  end(): void {
    this.#end(null, false);
  }

  async #runRefresh(): Promise<boolean> {
    const wasAuthenticated = this.#state.status === 'authenticated';
    try {
      this.#start(await this.#api.refresh());
      return true;
    } catch (error) {
      this.#end(reasonOf(error, wasAuthenticated), true);
      return false;
    }
  }

  #start(session: AuthSession): void {
    this.#token = session.accessToken;
    this.#setState({ status: 'authenticated', user: session.user });
  }

  #end(reason: string | null, returnToLocation: boolean): void {
    const wasAuthenticated = this.#state.status === 'authenticated';
    this.#token = null;
    this.#setState({ status: 'anonymous', reason, returnToLocation });
    if (wasAuthenticated) {
      this.#signedOutListeners.forEach((listener) => {
        listener();
      });
    }
  }

  #setState(state: SessionState): void {
    this.#state = state;
    this.#listeners.forEach((listener) => {
      listener();
    });
  }
}

function signOutLocallyWhenBackendFails(): void {
  return;
}

function reasonOf(error: unknown, wasAuthenticated: boolean): string | null {
  if (!isApiError(error)) {
    return HttpErrorCode.Unexpected;
  }
  if (error.status === UNAUTHORIZED_STATUS) {
    return wasAuthenticated ? HttpErrorCode.Unauthorized : null;
  }
  return error.code;
}
