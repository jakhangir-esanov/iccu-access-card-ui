import { describe, expect, it } from 'vitest';
import { changePasswordFormSchema } from './change-password-form.schema';

const messagesOf = (values: Record<string, string>) => {
  const result = changePasswordFormSchema.safeParse(values);
  return result.success ? [] : result.error.issues.map((issue) => issue.message);
};

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
