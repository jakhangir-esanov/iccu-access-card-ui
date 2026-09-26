import { describe, expect, it } from 'vitest';
import { UserRole } from '@shared/models/user-role';
import { toAuthSession } from './auth.mapper';

const dto = (role: number) => ({
  accessToken: 'jwt',
  expiresAt: '2026-09-26T14:32:15.8763086Z',
  user: { id: 'u1', username: 'admin', fullName: 'Administrator', role },
});

describe('toAuthSession', () => {
  it('should map the token and the user when the response is valid', () => {
    expect(toAuthSession(dto(1))).toEqual({
      accessToken: 'jwt',
      expiresAt: '2026-09-26T14:32:15.8763086Z',
      user: { id: 'u1', username: 'admin', fullName: 'Administrator', role: UserRole.Admin },
    });
  });

  it('should fall back to the least privileged role when the role is unknown', () => {
    expect(toAuthSession(dto(7)).user.role).toBe(UserRole.Receptionist);
  });
});
