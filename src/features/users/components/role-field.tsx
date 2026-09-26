import { useFormContext } from 'react-hook-form';
import { useT } from '@core/i18n/use-i18n';
import { FormField } from '@shared/components/form/form-field';
import { USER_ROLE_LABELS, USER_ROLES } from '@shared/models/user-role';
import { NativeSelect, NativeSelectOption } from '@shared/ui/native-select';

export function RoleField() {
  const t = useT();
  const { register, formState } = useFormContext<{ role: string }>();
  return (
    <FormField id="role" label="users.form.role" error={formState.errors.role?.message}>
      <NativeSelect id="role" className="w-full" {...register('role')}>
        {USER_ROLES.map((role) => (
          <NativeSelectOption key={role} value={role}>
            {t(USER_ROLE_LABELS[role])}
          </NativeSelectOption>
        ))}
      </NativeSelect>
    </FormField>
  );
}
