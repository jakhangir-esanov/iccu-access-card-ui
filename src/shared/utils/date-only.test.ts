import { describe, expect, it } from 'vitest';
import { addMonths, daysBetween, fromLocalDate, startOfMonth, toLocalDate } from './date-only';

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

describe('toLocalDate', () => {
  it('should build a local midnight date when the value is a DateOnly string', () => {
    const date = toLocalDate('2004-05-17');

    expect(date?.getFullYear()).toBe(2004);
    expect(date?.getMonth()).toBe(4);
    expect(date?.getDate()).toBe(17);
    expect(date?.getHours()).toBe(0);
  });

  it('should return undefined when the value is empty or malformed', () => {
    expect(toLocalDate('')).toBeUndefined();
    expect(toLocalDate('17.05.2004')).toBeUndefined();
  });
});

describe('fromLocalDate', () => {
  it('should pad month and day when they are single digits', () => {
    expect(fromLocalDate(new Date(2004, 0, 7))).toBe('2004-01-07');
  });

  it('should round-trip when a DateOnly string is converted both ways', () => {
    const date = toLocalDate('1999-12-31');

    expect(date === undefined ? '' : fromLocalDate(date)).toBe('1999-12-31');
  });
});
