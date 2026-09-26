import type { UserRole } from '@shared/models/user-role';

export const UserStatus = {
  Active: 'active',
  Inactive: 'inactive',
  LockedOut: 'lockedOut',
} as const;

export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];

export interface User {
  readonly id: string;
  readonly username: string;
  readonly fullName: string;
  readonly role: UserRole;
  readonly isActive: boolean;
  readonly isLockedOut: boolean;
  readonly lastLoginAt: string | null;
  readonly createdAt: string;
}

export function statusOf(user: Pick<User, 'isActive' | 'isLockedOut'>): UserStatus {
  if (!user.isActive) {
    return UserStatus.Inactive;
  }
  return user.isLockedOut ? UserStatus.LockedOut : UserStatus.Active;
}
