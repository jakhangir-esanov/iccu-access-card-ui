import { formatDateOnly } from '@core/i18n/date-format';
import { createTranslator } from '@core/i18n/translate';
import { DICTIONARIES } from '@core/i18n/translations/dictionaries';
import { READER_CATEGORY_LABELS } from '@shared/models/reader-category';
import type { Reader } from './reader';

export const CARD_TEXT = {
  center: 'Islamic Civilization Center in Uzbekistan',
  title: 'Library Card',
  library: 'Library',
  cardNumber: 'Card No.',
  issuedOn: 'Date of issue',
  expiresOn: 'Date of expiry',
  websiteLabel: 'Website',
  website: 'elibrary.cisc.uz',
  phoneLabel: 'Phone',
  phone: '+998 (71) 227 15 48',
} as const;

const CARD_LOCALE = 'en';
const LONG_NAME_FROM = 30;
const translateForCard = createTranslator(DICTIONARIES[CARD_LOCALE]);

export interface CardFace {
  readonly fullName: string;
  readonly isLongName: boolean;
  readonly category: string;
  readonly cardNumber: string;
  readonly issuedOn: string;
  readonly expiresOn: string;
  readonly photoFileId: string;
}

export function toCardFace(reader: Reader): CardFace {
  const fullName = reader.fullName.toLocaleUpperCase(CARD_LOCALE);
  return {
    fullName,
    isLongName: fullName.length >= LONG_NAME_FROM,
    category: translateForCard(READER_CATEGORY_LABELS[reader.category]).toLocaleUpperCase(
      CARD_LOCALE,
    ),
    cardNumber: reader.cardNumber,
    issuedOn: formatDateOnly(reader.issuedOn),
    expiresOn: formatDateOnly(reader.expiresOn),
    photoFileId: reader.photoFileId,
  };
}
