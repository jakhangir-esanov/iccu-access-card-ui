import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type UseFormSetError } from 'react-hook-form';
import { useAuth } from '@core/auth/use-auth';
import { describeError, type MessageSource } from '@core/feedback/error-message';
import { useMessage } from '@core/feedback/use-message';
import { useNotify } from '@core/feedback/use-notify';
import { hasErrorCode } from '@core/http/api-error';
import { useT } from '@core/i18n/use-i18n';
import { applyServerErrors } from '@shared/components/form/apply-server-errors';
import { FormAlert } from '@shared/components/form/form-alert';
import { Button } from '@shared/ui/button';
import { useChangePasswordMutation } from '../api/auth.queries';
import { AuthErrorCode } from '../models/auth-error-codes';
import {
  CHANGE_PASSWORD_FORM_FIELDS,
  EMPTY_CHANGE_PASSWORD_FORM,
  changePasswordFormSchema,
  type ChangePasswordFormValues,
} from '../models/change-password-form.schema';
import { PasswordField } from './password-field';

type FormSetError = UseFormSetError<ChangePasswordFormValues>;

function placeError(error: unknown, setError: FormSetError, message: (s: MessageSource) => string) {
  if (hasErrorCode(error, AuthErrorCode.WrongCurrentPassword)) {
    setError('currentPassword', { type: 'server', message: message(describeError(error)) });
    return true;
  }
  return applyServerErrors<ChangePasswordFormValues>(error, {
    fields: CHANGE_PASSWORD_FORM_FIELDS,
    setError,
    message,
  });
}

export function ChangePasswordForm() {
  const t = useT();
  const message = useMessage();
  const notify = useNotify();
  const { endSession } = useAuth();
  const mutation = useChangePasswordMutation();
  const { register, handleSubmit, setError, formState } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordFormSchema),
    defaultValues: EMPTY_CHANGE_PASSWORD_FORM,
  });
  const { errors } = formState;
  const unplacedError =
    mutation.error !== null && Object.keys(errors).length === 0
      ? message(describeError(mutation.error))
      : null;

  const submit = handleSubmit(({ currentPassword, newPassword }) => {
    mutation.mutate(
      { currentPassword, newPassword },
      {
        onSuccess: () => {
          notify.success('auth.password.changed');
          endSession();
        },
        onError: (error) => placeError(error, setError, message),
      },
    );
  });

  return (
    <form noValidate onSubmit={(event) => void submit(event)} className="grid gap-4">
      <FormAlert message={unplacedError} />
      <PasswordField
        id="currentPassword"
        label="auth.password.current"
        autoComplete="current-password"
        error={errors.currentPassword?.message}
        registration={register('currentPassword')}
      />
      <PasswordField
        id="newPassword"
        label="auth.password.next"
        autoComplete="new-password"
        error={errors.newPassword?.message}
        registration={register('newPassword')}
      />
      <PasswordField
        id="confirmPassword"
        label="auth.password.confirm"
        autoComplete="new-password"
        error={errors.confirmPassword?.message}
        registration={register('confirmPassword')}
      />
      <Button type="submit" className="justify-self-start" disabled={mutation.isPending}>
        {t('auth.password.submit')}
      </Button>
    </form>
  );
}
