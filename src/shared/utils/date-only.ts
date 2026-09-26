const MS_PER_DAY = 86_400_000;
const DATE_ONLY_LENGTH = 10;

export function addDays(dateOnly: string, days: number): string {
  const moment = new Date(`${dateOnly}T00:00:00Z`).getTime() + days * MS_PER_DAY;
  return new Date(moment).toISOString().slice(0, DATE_ONLY_LENGTH);
}
