const MS_PER_DAY = 86_400_000;
const DATE_ONLY_LENGTH = 10;
const MONTH_LENGTH = 7;
const FIRST_DAY_SUFFIX = '-01';

function toUtc(dateOnly: string): Date {
  return new Date(`${dateOnly}T00:00:00Z`);
}

export function addDays(dateOnly: string, days: number): string {
  const moment = toUtc(dateOnly).getTime() + days * MS_PER_DAY;
  return new Date(moment).toISOString().slice(0, DATE_ONLY_LENGTH);
}

export function startOfMonth(dateOnly: string): string {
  return `${dateOnly.slice(0, MONTH_LENGTH)}${FIRST_DAY_SUFFIX}`;
}

export function addMonths(dateOnly: string, months: number): string {
  const date = toUtc(startOfMonth(dateOnly));
  date.setUTCMonth(date.getUTCMonth() + months);
  return date.toISOString().slice(0, DATE_ONLY_LENGTH);
}

const DATE_ONLY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const PAD_LENGTH = 2;
const PAD_CHAR = '0';

export function toLocalDate(dateOnly: string): Date | undefined {
  const match = DATE_ONLY_PATTERN.exec(dateOnly);
  if (match === null) {
    return undefined;
  }
  const [, year, month, day] = match;
  return new Date(Number(year), Number(month) - 1, Number(day));
}

export function fromLocalDate(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(PAD_LENGTH, PAD_CHAR);
  const day = String(date.getDate()).padStart(PAD_LENGTH, PAD_CHAR);
  return `${String(date.getFullYear())}-${month}-${day}`;
}

export function daysBetween(from: string, to: string): number {
  return Math.round((toUtc(to).getTime() - toUtc(from).getTime()) / MS_PER_DAY);
}
