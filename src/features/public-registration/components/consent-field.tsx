import { Controller, useFormContext } from 'react-hook-form';
import { isTranslationKey } from '@core/i18n/translation-key';
import { useT } from '@core/i18n/use-i18n';
import { Checkbox } from '@shared/ui/checkbox';
import type { RegistrationFormInput } from '../models/registration-form.schema';

export function ConsentField() {
  const t = useT();
  const { control } = useFormContext<RegistrationFormInput>();
  return (
    <Controller
      control={control}
      name="consentGiven"
      render={({ field, fieldState }) => {
        const error = fieldState.error?.message;
        return (
          <div className="grid gap-1.5">
            <label htmlFor="consentGiven" className="flex items-start gap-3 text-sm leading-snug">
              <Checkbox
                id="consentGiven"
                ref={field.ref}
                className="mt-0.5"
                checked={field.value}
                aria-invalid={error !== undefined}
                onCheckedChange={(checked) => {
                  field.onChange(checked === true);
                }}
                onBlur={field.onBlur}
              />
              <span>{t('publicRegistration.consent')}</span>
            </label>
            {error !== undefined && (
              <p className="text-sm text-destructive">
                {isTranslationKey(error) ? t(error) : error}
              </p>
            )}
          </div>
        );
      }}
    />
  );
}
