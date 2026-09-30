import type { TranslationKey } from '@core/i18n/translations/dictionary';
import { useT } from '@core/i18n/use-i18n';

const EMPTY_VALUE = '—';

interface OptionalLabelProps<T extends number> {
  readonly value: T | null;
  readonly labels: Readonly<Record<T, TranslationKey>>;
}

export function OptionalLabel<T extends number>({ value, labels }: OptionalLabelProps<T>) {
  const t = useT();
  if (value === null) {
    return <span className="text-muted-foreground">{EMPTY_VALUE}</span>;
  }
  return <span className="whitespace-nowrap">{t(labels[value])}</span>;
}
