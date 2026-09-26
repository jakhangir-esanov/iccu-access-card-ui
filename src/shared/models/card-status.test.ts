import { describe, expect, it } from 'vitest';
import { addDays } from '@shared/utils/date-only';
import { CardStatus, cardStatusOf } from './card-status';

const TODAY = '2026-09-26';

describe('cardStatusOf', () => {
  it.each([
    ['2026-09-25', CardStatus.Expired],
    ['2026-09-26', CardStatus.ExpiringSoon],
    ['2026-10-26', CardStatus.ExpiringSoon],
    ['2026-10-27', CardStatus.Active],
    ['2028-09-26', CardStatus.Active],
  ])('should treat a card valid until %s as %i', (expiresOn, expected) => {
    expect(cardStatusOf(expiresOn, TODAY)).toBe(expected);
  });
});

describe('addDays', () => {
  it('should cross month and year ends when days are added', () => {
    expect(addDays('2026-12-20', 30)).toBe('2027-01-19');
  });

  it('should handle leap years when February is crossed', () => {
    expect(addDays('2028-02-28', 1)).toBe('2028-02-29');
  });
});
