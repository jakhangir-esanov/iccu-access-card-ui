import { describe, expect, it } from 'vitest';
import { changePasswordFormSchema, newPasswordSchema } from './change-password-form.schema';

const messagesOf = (values: Record<string, string>) => {
  const result = changePasswordFormSchema.safeParse(values);
  return result.success ? [] : result.error.issues.map((issue) => issue.message);
};

describe('newPasswordSchema', () => {
  it.each(['Resep12345', 'Parol2026', 'Ўзбек1234'])('should accept %s', (password) => {
    expect(newPasswordSchema.safeParse(password).success).toBe(true);
  });

  it.each(['short1', '1234567890', 'onlyletters', 'a'.repeat(128) + '1'])(
    'should reject %s',
    (password) => {
      expect(newPasswordSchema.safeParse(password).success).toBe(false);
    },
  );
});

describe('changePasswordFormSchema', () => {
  it('should report a mismatch on the confirm field when the passwords differ', () => {
    const result = changePasswordFormSchema.safeParse({
      currentPassword: 'old',
      newPassword: 'Resep12345',
      confirmPassword: 'Resep12346',
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual(['confirmPassword']);
    expect(result.error?.issues[0]?.message).toBe('validation.passwordsMismatch');
  });

  it('should require the current password when it is empty', () => {
    expect(
      messagesOf({ currentPassword: '', newPassword: 'Resep12345', confirmPassword: 'Resep12345' }),
    ).toEqual(['validation.required']);
  });
});
