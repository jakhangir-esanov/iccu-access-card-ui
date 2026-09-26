import { isUserRole, UserRole } from '@shared/models/user-role';
import type { User } from '../models/user';
import type { CreateUserFormValues, EditUserFormValues } from '../models/user-form.schema';
import type { CreateUserRequestDto, UpdateUserRequestDto, UserDto } from './users.dto';

export function toUser(dto: UserDto): User {
  return {
    id: dto.id,
    username: dto.username,
    fullName: dto.fullName,
    role: isUserRole(dto.role) ? dto.role : UserRole.Receptionist,
    isActive: dto.isActive,
    isLockedOut: dto.isLockedOut,
    lastLoginAt: dto.lastLoginAt,
    createdAt: dto.createdAt,
  };
}

export function toCreateUserRequest(values: CreateUserFormValues): CreateUserRequestDto {
  return {
    username: values.username,
    fullName: values.fullName,
    role: values.role,
    password: values.newPassword,
  };
}

export function toUpdateUserRequest(values: EditUserFormValues): UpdateUserRequestDto {
  return { fullName: values.fullName, role: values.role, isActive: values.isActive };
}
