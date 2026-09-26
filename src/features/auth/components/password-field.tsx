import type { UseFormRegisterReturn } from 'react-hook-form';
import type { TranslationKey } from '@core/i18n/translations/dictionary';
import { FormField } from '@shared/components/form/form-field';
import { PasswordInput } from '@shared/components/form/password-input';

interface PasswordFieldProps {
  readonly id: string;
  readonly label: TranslationKey;
  readonly autoComplete: 'current-password' | 'new-password';
  readonly error: string | undefined;
  readonly registration: UseFormRegisterReturn;
  readonly className?: string;
}

export function PasswordField({
  id,
  label,
  autoComplete,
  error,
  registration,
  className,
}: PasswordFieldProps) {
  return (
    <FormField id={id} label={label} error={error}>
      <PasswordInput
        id={id}
        autoComplete={autoComplete}
        aria-invalid={error !== undefined}
        className={className}
        {...registration}
      />
    </FormField>
  );
}
