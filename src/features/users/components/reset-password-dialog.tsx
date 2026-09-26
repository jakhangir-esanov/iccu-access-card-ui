import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useMessage } from '@core/feedback/use-message';
import { useNotify } from '@core/feedback/use-notify';
import { useT } from '@core/i18n/use-i18n';
import { useResetUserPassword } from '../api/users.queries';
import type { User } from '../models/user';
import {
  EMPTY_RESET_PASSWORD_FORM,
  RESET_PASSWORD_FORM_FIELDS,
  resetPasswordFormSchema,
  type ResetPasswordFormValues,
} from '../models/user-form.schema';
import { PasswordPairFields } from './password-pair-fields';
import { UserDialogFrame } from './user-dialog-frame';
import { unplacedErrorMessage } from './user-form-errors';

interface ResetPasswordDialogProps {
  readonly user: User;
  readonly onClose: () => void;
}

export function ResetPasswordDialog({ user, onClose }: ResetPasswordDialogProps) {
  const t = useT();
  const message = useMessage();
  const notify = useNotify();
  const reset = useResetUserPassword(user.id);
  const [failure, setFailure] = useState<string | null>(null);
  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: EMPTY_RESET_PASSWORD_FORM,
  });

  const submit = form.handleSubmit(async ({ newPassword }) => {
    setFailure(null);
    try {
      await reset.mutateAsync(newPassword);
      notify.success('users.reset.done');
      onClose();
    } catch (error) {
      setFailure(
        unplacedErrorMessage<ResetPasswordFormValues>(error, {
          fields: RESET_PASSWORD_FORM_FIELDS,
          setError: form.setError,
          message,
        }),
      );
    }
  });

  return (
    <FormProvider {...form}>
      <UserDialogFrame
        title={t('users.reset.title')}
        description={t('users.reset.description', { name: user.fullName })}
        failure={failure}
        isPending={reset.isPending}
        onClose={onClose}
        onSubmit={() => void submit()}
      >
        <PasswordPairFields />
      </UserDialogFrame>
    </FormProvider>
  );
}
