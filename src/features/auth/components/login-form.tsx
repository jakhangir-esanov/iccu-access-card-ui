import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useSession } from '@core/auth/use-auth';
import { describeError, describeErrorCode } from '@core/feedback/error-message';
import { useMessage } from '@core/feedback/use-message';
import { useT } from '@core/i18n/use-i18n';
import { applyServerErrors } from '@shared/components/form/apply-server-errors';
import { FormAlert } from '@shared/components/form/form-alert';
import { FormField } from '@shared/components/form/form-field';
import { Button } from '@shared/ui/button';
import { Input } from '@shared/ui/input';
import { useLoginMutation } from '../api/auth.queries';
import {
  EMPTY_LOGIN_FORM,
  LOGIN_FORM_FIELDS,
  loginFormSchema,
  type LoginFormValues,
} from '../models/login-form.schema';

function useAlertMessage(loginError: unknown): string | null {
  const session = useSession();
  const message = useMessage();
  if (loginError !== null) {
    return message(describeError(loginError));
  }
  if (session.status === 'anonymous' && session.reason !== null) {
    return message(describeErrorCode(session.reason));
  }
  return null;
}

export function LoginForm() {
  const t = useT();
  const message = useMessage();
  const login = useLoginMutation();
  const alert = useAlertMessage(login.error);
  const { register, handleSubmit, setError, formState } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: EMPTY_LOGIN_FORM,
  });
  const { errors } = formState;

  const submit = handleSubmit((values) => {
    login.mutate(values, {
      onError: (error) =>
        applyServerErrors<LoginFormValues>(error, { fields: LOGIN_FORM_FIELDS, setError, message }),
    });
  });

  return (
    <form noValidate onSubmit={(event) => void submit(event)} className="grid gap-4">
      <FormAlert message={alert} />
      <FormField id="username" label="auth.login.username" error={errors.username?.message}>
        <Input
          id="username"
          autoComplete="username"
          autoFocus
          aria-invalid={errors.username !== undefined}
          {...register('username')}
        />
      </FormField>
      <FormField id="password" label="auth.login.password" error={errors.password?.message}>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          aria-invalid={errors.password !== undefined}
          {...register('password')}
        />
      </FormField>
      <Button type="submit" size="lg" className="mt-2" disabled={login.isPending}>
        {t('auth.login.submit')}
      </Button>
    </form>
  );
}
