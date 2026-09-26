import { describe, expect, it } from 'vitest';
import { REJECTION_REASON_MAX_LENGTH, rejectFormSchema } from './reject-form.schema';

describe('rejectFormSchema', () => {
  it('should fail when reason is empty', () => {
    const result = rejectFormSchema.safeParse({ reason: '' });

    expect(result.success).toBe(false);
  });

  it('should fail when reason is whitespace only', () => {
    const result = rejectFormSchema.safeParse({ reason: '   ' });

    expect(result.success).toBe(false);
  });

  it('should pass when reason is valid text', () => {
    const result = rejectFormSchema.safeParse({ reason: "Hujjat muddati o'tgan" });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.reason).toBe("Hujjat muddati o'tgan");
    }
  });

  it('should trim surrounding whitespace when reason is valid', () => {
    const result = rejectFormSchema.safeParse({ reason: '  Rasm sifatsiz  ' });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.reason).toBe('Rasm sifatsiz');
    }
  });

  it('should fail when reason exceeds max length', () => {
    const longText = 'a'.repeat(REJECTION_REASON_MAX_LENGTH + 1);
    const result = rejectFormSchema.safeParse({ reason: longText });

    expect(result.success).toBe(false);
  });
});
