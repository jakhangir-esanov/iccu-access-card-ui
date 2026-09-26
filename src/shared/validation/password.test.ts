import { describe, expect, it } from 'vitest';
import { newPasswordSchema } from './password';

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
