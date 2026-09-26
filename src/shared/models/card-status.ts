import type { TranslationKey } from '@core/i18n/translations/dictionary';
import { addDays } from '@shared/utils/date-only';

export const CardStatus = {
  Active: 0,
  ExpiringSoon: 1,
  Expired: 2,
} as const;

export type CardStatus = (typeof CardStatus)[keyof typeof CardStatus];

export const CARD_STATUSES: readonly CardStatus[] = Object.values(CardStatus);

export const CARD_STATUS_LABELS: Readonly<Record<CardStatus, TranslationKey>> = {
  [CardStatus.Active]: 'enums.cardStatus.active',
  [CardStatus.ExpiringSoon]: 'enums.cardStatus.expiringSoon',
  [CardStatus.Expired]: 'enums.cardStatus.expired',
};

export const EXPIRING_SOON_DAYS = 30;

export function isCardStatus(value: unknown): value is CardStatus {
  return CARD_STATUSES.some((status) => status === value);
}

export function cardStatusOf(expiresOn: string, today: string): CardStatus {
  if (expiresOn < today) {
    return CardStatus.Expired;
  }
  return expiresOn <= addDays(today, EXPIRING_SOON_DAYS)
    ? CardStatus.ExpiringSoon
    : CardStatus.Active;
}
