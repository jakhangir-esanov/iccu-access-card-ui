import type { UserRole } from '@shared/models/user-role';

export interface AuthUser {
  readonly id: string;
  readonly username: string;
  readonly fullName: string;
  readonly role: UserRole;
}

export interface Credentials {
  readonly username: string;
  readonly password: string;
}

export interface AuthSession {
  readonly accessToken: string;
  readonly expiresAt: string;
  readonly user: AuthUser;
}
