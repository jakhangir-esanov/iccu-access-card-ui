import { describe, expect, it } from 'vitest';
import { addMonths, daysBetween, startOfMonth } from './date-only';

describe('date-only', () => {
  it('should return the first day when the month start is asked', () => {
    expect(startOfMonth('2026-09-27')).toBe('2026-09-01');
  });

  it.each([
    ['2026-01-31', 1, '2026-02-01'],
    ['2026-12-15', 1, '2027-01-01'],
    ['2026-03-01', -3, '2025-12-01'],
  ])('should move %s by %i months to the month start %s', (date, months, expected) => {
    expect(addMonths(date, months)).toBe(expected);
  });

  it('should count days between two dates when the range crosses a leap day', () => {
    expect(daysBetween('2028-02-28', '2028-03-01')).toBe(2);
    expect(daysBetween('2026-09-27', '2026-09-01')).toBe(-26);
  });
});
