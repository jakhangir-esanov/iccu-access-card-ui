import type { UseFormRegisterReturn } from 'react-hook-form';
import type { TranslationKey } from '@core/i18n/translations/dictionary';
import { FormField } from '@shared/components/form/form-field';
import { Input } from '@shared/ui/input';

interface PasswordFieldProps {
  readonly id: string;
  readonly label: TranslationKey;
  readonly autoComplete: 'current-password' | 'new-password';
  readonly error: string | undefined;
  readonly registration: UseFormRegisterReturn;
}

export function PasswordField({
  id,
  label,
  autoComplete,
  error,
  registration,
}: PasswordFieldProps) {
  return (
    <FormField id={id} label={label} error={error}>
      <Input
        id={id}
        type="password"
        autoComplete={autoComplete}
        aria-invalid={error !== undefined}
        {...registration}
      />
    </FormField>
  );
}
