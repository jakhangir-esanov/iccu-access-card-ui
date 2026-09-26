import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useMessage } from '@core/feedback/use-message';
import { useNotify } from '@core/feedback/use-notify';
import { useT } from '@core/i18n/use-i18n';
import { FormField } from '@shared/components/form/form-field';
import { Input } from '@shared/ui/input';
import { useCreateUser } from '../api/users.queries';
import {
  CREATE_USER_FORM_FIELDS,
  EMPTY_CREATE_USER_FORM,
  createUserFormSchema,
  type CreateUserFormInput,
  type CreateUserFormValues,
} from '../models/user-form.schema';
import { PasswordPairFields } from './password-pair-fields';
import { RoleField } from './role-field';
import { UserDialogFrame } from './user-dialog-frame';
import { unplacedErrorMessage } from './user-form-errors';

export function CreateUserDialog({ onClose }: { readonly onClose: () => void }) {
  const t = useT();
  const message = useMessage();
  const notify = useNotify();
  const create = useCreateUser();
  const [failure, setFailure] = useState<string | null>(null);
  const form = useForm<CreateUserFormInput, unknown, CreateUserFormValues>({
    resolver: zodResolver(createUserFormSchema),
    defaultValues: EMPTY_CREATE_USER_FORM,
  });
  const { register, formState } = form;

  const submit = form.handleSubmit(async (values) => {
    setFailure(null);
    try {
      await create.mutateAsync(values);
      notify.success('users.form.created');
      onClose();
    } catch (error) {
      setFailure(
        unplacedErrorMessage<CreateUserFormInput>(error, {
          fields: CREATE_USER_FORM_FIELDS,
          setError: form.setError,
          message,
          usernameField: 'username',
        }),
      );
    }
  });

  return (
    <FormProvider {...form}>
      <UserDialogFrame
        title={t('users.form.createTitle')}
        failure={failure}
        isPending={create.isPending}
        onClose={onClose}
        onSubmit={() => void submit()}
      >
        <FormField
          id="username"
          label="users.form.username"
          error={formState.errors.username?.message}
        >
          <Input
            id="username"
            autoComplete="off"
            autoCapitalize="none"
            aria-invalid={formState.errors.username !== undefined}
            {...register('username')}
          />
        </FormField>
        <FormField
          id="fullName"
          label="users.form.fullName"
          error={formState.errors.fullName?.message}
        >
          <Input
            id="fullName"
            autoComplete="off"
            aria-invalid={formState.errors.fullName !== undefined}
            {...register('fullName')}
          />
        </FormField>
        <RoleField />
        <PasswordPairFields />
      </UserDialogFrame>
    </FormProvider>
  );
}
