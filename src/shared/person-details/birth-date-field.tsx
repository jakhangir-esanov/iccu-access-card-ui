import { Controller, useFormContext } from 'react-hook-form';
import { DatePicker } from '@shared/components/form/date-picker';
import { FormField } from '@shared/components/form/form-field';
import { EARLIEST_BIRTH_DATE } from './person-details-rules';
import type { PersonDetailsFormInput } from './person-details.schema';

export function BirthDateField({ today }: Readonly<{ today: string }>) {
  const { control } = useFormContext<PersonDetailsFormInput>();
  return (
    <Controller
      control={control}
      name="birthDate"
      render={({ field, fieldState }) => (
        <FormField id="birthDate" label="person.birthDate" error={fieldState.error?.message}>
          <DatePicker
            ref={field.ref}
            id="birthDate"
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            min={EARLIEST_BIRTH_DATE}
            max={today}
            invalid={fieldState.error !== undefined}
            newestYearFirst
          />
        </FormField>
      )}
    />
  );
}
