import { useAuth } from '@core/auth/use-auth';
import { useT } from '@core/i18n/use-i18n';

export function DashboardPage() {
  const t = useT();
  const { user } = useAuth();
  return (
    <h1 className="text-2xl font-semibold">
      {t('dashboard.welcome', { name: user?.fullName ?? '' })}
    </h1>
  );
}
