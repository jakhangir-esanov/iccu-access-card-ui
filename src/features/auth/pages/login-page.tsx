import { useT } from '@core/i18n/use-i18n';
import { BrandMark } from '@core/layout/brand-mark';
import { LocaleSwitcher } from '@core/layout/locale-switcher';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@shared/ui/card';
import { LoginForm } from '../components/login-form';

export function LoginPage() {
  const t = useT();
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center gap-8 bg-[radial-gradient(circle_at_top,var(--color-accent),transparent_60%)] px-4 py-10">
      <div className="absolute top-4 right-4">
        <LocaleSwitcher />
      </div>
      <BrandMark tone="dark" />
      <Card className="w-full max-w-sm border-t-4 border-t-gold">
        <CardHeader>
          <CardTitle className="text-xl">{t('auth.login.title')}</CardTitle>
          <CardDescription>{t('auth.login.subtitle')}</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}
