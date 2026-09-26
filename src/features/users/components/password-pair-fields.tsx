import { useFormContext } from 'react-hook-form';
import { FormField } from '@shared/components/form/form-field';
import { Input } from '@shared/ui/input';

interface PasswordPair {
  readonly newPassword: string;
  readonly confirmPassword: string;
}

export function PasswordPairFields() {
  const { register, formState } = useFormContext<PasswordPair>();
  const { errors } = formState;
  return (
    <>
      <FormField id="newPassword" label="users.form.password" error={errors.newPassword?.message}>
        <Input
          id="newPassword"
          type="password"
          autoComplete="new-password"
          aria-invalid={errors.newPassword !== undefined}
          {...register('newPassword')}
        />
      </FormField>
      <FormField
        id="confirmPassword"
        label="users.form.confirmPassword"
        error={errors.confirmPassword?.message}
      >
        <Input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          aria-invalid={errors.confirmPassword !== undefined}
          {...register('confirmPassword')}
        />
      </FormField>
    </>
  );
}
