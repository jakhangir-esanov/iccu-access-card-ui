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
