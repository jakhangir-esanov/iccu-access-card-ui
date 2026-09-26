import { describe, expect, it } from 'vitest';
import { UserRole } from '@shared/models/user-role';
import { toCreateUserRequest, toUser } from '../api/users.mapper';
import { UserStatus, statusOf } from './user';
import { parseUserFilter, toUserQuery } from './user-filter';
import { createUserFormSchema, editUserFormSchema } from './user-form.schema';

const VALID_CREATE = {
  username: ' Kutubxonachi.1 ',
  fullName: ' Test Kutubxonachi ',
  role: '0',
  newPassword: 'Kitob2026',
  confirmPassword: 'Kitob2026',
};

describe('createUserFormSchema', () => {
  it('should trim and lower-case the username when the form is valid', () => {
    const values = createUserFormSchema.parse(VALID_CREATE);

    expect(toCreateUserRequest(values)).toEqual({
      username: 'kutubxonachi.1',
      fullName: 'Test Kutubxonachi',
      role: UserRole.Receptionist,
      password: 'Kitob2026',
    });
  });

  it.each(['ab', 'ali vali', 'ali@lib', 'а'.repeat(5), 'x'.repeat(51)])(
    'should reject the username %s',
    (username) => {
      const result = createUserFormSchema.safeParse({ ...VALID_CREATE, username });

      expect(result.error?.issues[0]?.message).toBe('validation.username');
    },
  );

  it('should report a mismatch when the confirmation differs', () => {
    const result = createUserFormSchema.safeParse({ ...VALID_CREATE, confirmPassword: 'x' });

    expect(result.error?.issues.map((issue) => [issue.path[0], issue.message])).toEqual([
      ['confirmPassword', 'validation.passwordsMismatch'],
    ]);
  });
});

describe('editUserFormSchema', () => {
  it('should turn the role into a number when the form is saved', () => {
    expect(editUserFormSchema.parse({ fullName: 'Ali', role: '1', isActive: false })).toEqual({
      fullName: 'Ali',
      role: UserRole.Admin,
      isActive: false,
    });
  });
});

describe('statusOf', () => {
  it.each([
    [true, false, UserStatus.Active],
    [true, true, UserStatus.LockedOut],
    [false, true, UserStatus.Inactive],
  ])('should treat active %s and locked %s as %s', (isActive, isLockedOut, expected) => {
    expect(statusOf({ isActive, isLockedOut })).toBe(expected);
  });
});

describe('user filter', () => {
  const read = (values: Record<string, string>) => (name: string) => values[name] ?? '';

  it('should send role and activity when the URL has them', () => {
    const filter = parseUserFilter(read({ role: '0', isActive: 'false', search: ' ali ' }));

    expect(toUserQuery(filter)).toEqual({ search: 'ali', role: 0, isActive: 'false' });
  });

  it('should ignore values when they are unknown', () => {
    expect(parseUserFilter(read({ role: '5', isActive: 'maybe' }))).toEqual({
      search: '',
      role: null,
      isActive: null,
    });
  });
});

describe('toUser', () => {
  it('should fall back to the receptionist role when the role is unknown', () => {
    const user = toUser({
      id: 'u1',
      username: 'x',
      fullName: 'X',
      role: 9,
      isActive: true,
      isLockedOut: false,
      lastLoginAt: null,
      createdAt: '2026-09-26T13:24:02Z',
    });

    expect(user.role).toBe(UserRole.Receptionist);
  });
});
