import { describe, expect, it } from 'vitest';
import { formatDateOnly, formatDateTime, formatLongDate, toTashkentDateOnly } from './date-format';
import { createTranslator } from './translate';
import { en } from './translations/en';

describe('formatDateTime', () => {
  it('should show Tashkent time when the backend sends UTC', () => {
    expect(formatDateTime('2026-09-26T14:17:20.417635Z')).toBe('26.09.2026 19:17');
  });

  it('should move to the next day when UTC evening is past midnight in Tashkent', () => {
    expect(formatDateTime('2026-09-26T20:30:00Z')).toBe('27.09.2026 01:30');
  });
});

describe('formatDateOnly', () => {
  it('should show day.month.year when the value is a DateOnly string', () => {
    expect(formatDateOnly('2008-03-07')).toBe('07.03.2008');
  });
});

describe('toTashkentDateOnly', () => {
  it('should return the Tashkent date when UTC is still the previous day', () => {
    expect(toTashkentDateOnly(new Date('2026-09-26T19:30:00Z'))).toBe('2026-09-27');
  });

  it('should return the same date when it is daytime in Tashkent', () => {
    expect(toTashkentDateOnly(new Date('2026-09-26T06:00:00Z'))).toBe('2026-09-26');
  });
});

describe('formatLongDate', () => {
  it('should name the Tashkent weekday when UTC is still the previous day', () => {
    expect(formatLongDate(new Date('2026-09-26T20:30:00Z'), createTranslator(en))).toBe(
      'Sunday, 27.09.2026',
    );
  });
});
