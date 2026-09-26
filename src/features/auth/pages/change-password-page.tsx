import { useT } from '@core/i18n/use-i18n';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@shared/ui/card';
import { ChangePasswordForm } from '../components/change-password-form';

export function ChangePasswordPage() {
  const t = useT();
  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle className="text-xl">{t('auth.password.title')}</CardTitle>
        <CardDescription>{t('auth.password.hint')}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChangePasswordForm />
      </CardContent>
    </Card>
  );
}
