import { useFormContext } from 'react-hook-form';
import type { TranslationKey } from '@core/i18n/translations/dictionary';
import { useT } from '@core/i18n/use-i18n';
import { FormField } from '@shared/components/form/form-field';
import { NativeSelect, NativeSelectOption } from '@shared/ui/native-select';
import type { PersonDetailsFormInput } from './person-details.schema';

type OptionField = 'category' | 'gender' | 'citizenship';

interface PersonOptionFieldProps<T extends number> {
  readonly name: OptionField;
  readonly label: TranslationKey;
  readonly options: readonly T[];
  readonly optionLabels: Readonly<Record<T, TranslationKey>>;
}

export function PersonOptionField<T extends number>({
  name,
  label,
  options,
  optionLabels,
}: PersonOptionFieldProps<T>) {
  const t = useT();
  const { register, formState } = useFormContext<PersonDetailsFormInput>();
  const error = formState.errors[name]?.message;
  return (
    <FormField id={name} label={label} error={error}>
      <NativeSelect
        id={name}
        className="w-full"
        aria-invalid={error !== undefined}
        {...register(name)}
      >
        <NativeSelectOption value="" disabled>
          {t('person.choose')}
        </NativeSelectOption>
        {options.map((option) => (
          <NativeSelectOption key={option} value={option}>
            {t(optionLabels[option])}
          </NativeSelectOption>
        ))}
      </NativeSelect>
    </FormField>
  );
}
