import type { TranslationKey } from '@core/i18n/translations/dictionary';
import { useT } from '@core/i18n/use-i18n';
import { Label } from '@shared/ui/label';
import { NativeSelect, NativeSelectOption } from '@shared/ui/native-select';

interface ReaderFilterSelectProps<TValue extends number> {
  readonly id: string;
  readonly label: TranslationKey;
  readonly value: TValue | null;
  readonly options: readonly TValue[];
  readonly labels: Readonly<Record<TValue, TranslationKey>>;
  readonly onChange: (value: string) => void;
}

export function ReaderFilterSelect<TValue extends number>({
  id,
  label,
  value,
  options,
  labels,
  onChange,
}: ReaderFilterSelectProps<TValue>) {
  const t = useT();
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id}>{t(label)}</Label>
      <NativeSelect
        id={id}
        className="w-full"
        value={value === null ? '' : String(value)}
        onChange={(event) => {
          onChange(event.target.value);
        }}
      >
        <NativeSelectOption value="">{t('readers.filters.all')}</NativeSelectOption>
        {options.map((option) => (
          <NativeSelectOption key={option} value={option}>
            {t(labels[option])}
          </NativeSelectOption>
        ))}
      </NativeSelect>
    </div>
  );
}
