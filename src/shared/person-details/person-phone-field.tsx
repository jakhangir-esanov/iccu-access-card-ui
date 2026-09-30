import { useFormContext, useWatch } from 'react-hook-form';
import { useT } from '@core/i18n/use-i18n';
import { FormField } from '@shared/components/form/form-field';
import { Citizenship } from '@shared/models/citizenship';
import { Input } from '@shared/ui/input';
import type { PersonDetailsFormInput } from './person-details.schema';

const PHONE_PREFIX = '+998';

export function PersonPhoneField() {
  const t = useT();
  const { register, formState } = useFormContext<PersonDetailsFormInput>();
  const citizenship = useWatch<PersonDetailsFormInput, 'citizenship'>({ name: 'citizenship' });
  const isForeign = citizenship === String(Citizenship.Foreign);
  const error = formState.errors.phone?.message;
  const input = (
    <Input
      id="phone"
      type="tel"
      inputMode="tel"
      autoComplete={isForeign ? 'tel' : 'tel-national'}
      placeholder={t(
        isForeign ? 'person.internationalPhonePlaceholder' : 'person.phonePlaceholder',
      )}
      aria-invalid={error !== undefined}
      {...register('phone')}
    />
  );
  return (
    <FormField id="phone" label="person.phone" error={error}>
      {isForeign ? (
        input
      ) : (
        <div className="flex items-center gap-2">
          <span className="flex h-11 shrink-0 items-center rounded-xl border bg-muted px-3.5 text-[0.9375rem] font-semibold text-muted-foreground tabular-nums">
            {PHONE_PREFIX}
          </span>
          {input}
        </div>
      )}
    </FormField>
  );
}
