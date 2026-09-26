import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useMessage } from '@core/feedback/use-message';
import { useNotify } from '@core/feedback/use-notify';
import { useT } from '@core/i18n/use-i18n';
import { FormField } from '@shared/components/form/form-field';
import { USER_ROLE_LABELS } from '@shared/models/user-role';
import { Checkbox } from '@shared/ui/checkbox';
import { Input } from '@shared/ui/input';
import { useUpdateUser } from '../api/users.queries';
import type { User } from '../models/user';
import {
  EDIT_USER_FORM_FIELDS,
  editUserFormSchema,
  toEditUserFormInput,
  type EditUserFormInput,
  type EditUserFormValues,
} from '../models/user-form.schema';
import { RoleField } from './role-field';
import { UserDialogFrame } from './user-dialog-frame';
import { unplacedErrorMessage } from './user-form-errors';

interface EditUserDialogProps {
  readonly user: User;
  readonly isSelf: boolean;
  readonly onClose: () => void;
}

export function EditUserDialog({ user, isSelf, onClose }: EditUserDialogProps) {
  const t = useT();
  const message = useMessage();
  const notify = useNotify();
  const update = useUpdateUser(user.id);
  const [failure, setFailure] = useState<string | null>(null);
  const form = useForm<EditUserFormInput, unknown, EditUserFormValues>({
    resolver: zodResolver(editUserFormSchema),
    defaultValues: toEditUserFormInput(user),
  });
  const { register, formState, control } = form;

  const submit = form.handleSubmit(async (values) => {
    setFailure(null);
    try {
      await update.mutateAsync(values);
      notify.success('users.form.saved');
      onClose();
    } catch (error) {
      setFailure(
        unplacedErrorMessage<EditUserFormInput>(error, {
          fields: EDIT_USER_FORM_FIELDS,
          setError: form.setError,
          message,
        }),
      );
    }
  });

  return (
    <FormProvider {...form}>
      <UserDialogFrame
        title={t('users.form.editTitle')}
        description={user.username}
        failure={failure}
        isPending={update.isPending}
        onClose={onClose}
        onSubmit={() => void submit()}
      >
        <FormField
          id="fullName"
          label="users.form.fullName"
          error={formState.errors.fullName?.message}
        >
          <Input
            id="fullName"
            aria-invalid={formState.errors.fullName !== undefined}
            {...register('fullName')}
          />
        </FormField>
        {isSelf ? (
          <p className="text-sm text-muted-foreground">
            {t(USER_ROLE_LABELS[user.role])}. {t('users.form.selfHint')}
          </p>
        ) : (
          <>
            <RoleField />
            <Controller
              control={control}
              name="isActive"
              render={({ field }) => (
                <label htmlFor="isActive" className="grid gap-1 text-sm">
                  <span className="flex items-center gap-2 font-medium">
                    <Checkbox
                      id="isActive"
                      ref={field.ref}
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked === true);
                      }}
                    />
                    {t('users.form.isActive')}
                  </span>
                  <span className="text-muted-foreground">{t('users.form.deactivateHint')}</span>
                </label>
              )}
            />
          </>
        )}
      </UserDialogFrame>
    </FormProvider>
  );
}
