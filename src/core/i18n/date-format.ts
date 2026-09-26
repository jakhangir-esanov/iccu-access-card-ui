import type { Translate } from './translate';
import type { TranslationKey } from './translations/dictionary';

export const APP_TIME_ZONE = 'Asia/Tashkent';

type DatePart = 'year' | 'month' | 'day' | 'hour' | 'minute';

const tashkentParts = new Intl.DateTimeFormat('en-GB', {
  timeZone: APP_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
});

function partsInTashkent(moment: Date): Readonly<Record<DatePart, string>> {
  const parts = tashkentParts.formatToParts(moment);
  const pick = (type: DatePart) => parts.find((part) => part.type === type)?.value ?? '';
  return {
    year: pick('year'),
    month: pick('month'),
    day: pick('day'),
    hour: pick('hour'),
    minute: pick('minute'),
  };
}

export function formatDateTime(isoUtc: string): string {
  const { year, month, day, hour, minute } = partsInTashkent(new Date(isoUtc));
  return `${day}.${month}.${year} ${hour}:${minute}`;
}

export function formatDateOnly(dateOnly: string): string {
  const [year, month, day] = dateOnly.split('-');
  return `${day ?? ''}.${month ?? ''}.${year ?? ''}`;
}

export function toTashkentDateOnly(moment: Date): string {
  const { year, month, day } = partsInTashkent(moment);
  return `${year}-${month}-${day}`;
}

const MONTH_KEYS: readonly TranslationKey[] = [
  'months.jan',
  'months.feb',
  'months.mar',
  'months.apr',
  'months.may',
  'months.jun',
  'months.jul',
  'months.aug',
  'months.sep',
  'months.oct',
  'months.nov',
  'months.dec',
];

export function formatMonth(dateOnly: string, t: Translate): string {
  const [year = '', month = ''] = dateOnly.split('-');
  const key = MONTH_KEYS[Number(month) - 1];
  return key === undefined ? dateOnly : `${t(key)} ${year}`;
}

export function formatDayMonth(dateOnly: string): string {
  const [, month, day] = dateOnly.split('-');
  return `${day ?? ''}.${month ?? ''}`;
}
