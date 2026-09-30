import { useFormContext } from 'react-hook-form';
import type { TranslationKey } from '@core/i18n/translations/dictionary';
import { useT } from '@core/i18n/use-i18n';
import { FormField } from '@shared/components/form/form-field';
import { Input } from '@shared/ui/input';
import type { PersonDetailsFormInput } from './person-details.schema';

type NameField = 'lastName' | 'firstName' | 'middleName';

const NAME_FIELDS: readonly {
  readonly name: NameField;
  readonly label: TranslationKey;
  readonly autoComplete: string;
}[] = [
  { name: 'firstName', label: 'person.firstName', autoComplete: 'given-name' },
  { name: 'lastName', label: 'person.lastName', autoComplete: 'family-name' },
  { name: 'middleName', label: 'person.middleName', autoComplete: 'additional-name' },
];

export function PersonNameFields() {
  const t = useT();
  const { register, formState } = useFormContext<PersonDetailsFormInput>();
  return NAME_FIELDS.map(({ name, label, autoComplete }) => {
    const error = formState.errors[name]?.message;
    return (
      <FormField key={name} id={name} label={label} error={error}>
        <Input
          id={name}
          autoComplete={autoComplete}
          autoCapitalize="words"
          placeholder={name === 'middleName' ? t('person.optional') : undefined}
          aria-invalid={error !== undefined}
          {...register(name)}
        />
      </FormField>
    );
  });
}
