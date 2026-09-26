export interface UserDto {
  readonly id: string;
  readonly username: string;
  readonly fullName: string;
  readonly role: number;
  readonly isActive: boolean;
  readonly isLockedOut: boolean;
  readonly lastLoginAt: string | null;
  readonly createdAt: string;
}

export interface CreateUserRequestDto {
  readonly username: string;
  readonly fullName: string;
  readonly role: number;
  readonly password: string;
}

export interface UpdateUserRequestDto {
  readonly fullName: string;
  readonly role: number;
  readonly isActive: boolean;
}

export interface ResetPasswordRequestDto {
  readonly newPassword: string;
}
