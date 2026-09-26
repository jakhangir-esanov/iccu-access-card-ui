import { describe, expect, it } from 'vitest';
import { userInitials } from './user-initials';

describe('userInitials', () => {
  it('should take the first letters of the first two words when the name has three words', () => {
    expect(userInitials('Aliyeva Dilnoza Rustamovna')).toBe('AD');
  });

  it('should skip apostrophes and extra spaces when the name starts with them', () => {
    expect(userInitials("  'Oktam   Karimov ")).toBe('OK');
  });

  it('should upper-case Cyrillic letters when the name is in Russian', () => {
    expect(userInitials('иванова анна')).toBe('ИА');
  });

  it('should return an empty string when the name has no letters', () => {
    expect(userInitials(' - ')).toBe('');
  });
});
