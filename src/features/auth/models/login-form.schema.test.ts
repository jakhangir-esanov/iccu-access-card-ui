import { describe, expect, it } from 'vitest';
import { loginFormSchema } from './login-form.schema';

describe('loginFormSchema', () => {
  it('should trim the username when it has spaces around it', () => {
    expect(loginFormSchema.parse({ username: '  admin ', password: 'x' }).username).toBe('admin');
  });

  it('should require both fields when they are empty', () => {
    const result = loginFormSchema.safeParse({ username: ' ', password: '' });

    expect(result.error?.issues.map((issue) => issue.message)).toEqual([
      'validation.required',
      'validation.required',
    ]);
  });

  it('should reject a username when it is longer than 50 characters', () => {
    expect(loginFormSchema.safeParse({ username: 'a'.repeat(51), password: 'x' }).success).toBe(
      false,
    );
  });
});
