import { isUserRole, UserRole } from '@shared/models/user-role';
import type { AuthResponseDto, AuthUserDto } from './auth.dto';
import type { AuthSession, AuthUser } from './auth-user';

export function toAuthUser(dto: AuthUserDto): AuthUser {
  return {
    id: dto.id,
    username: dto.username,
    fullName: dto.fullName,
    role: isUserRole(dto.role) ? dto.role : UserRole.Receptionist,
  };
}

export function toAuthSession(dto: AuthResponseDto): AuthSession {
  return { accessToken: dto.accessToken, expiresAt: dto.expiresAt, user: toAuthUser(dto.user) };
}
