import { CompassIcon } from 'lucide-react';
import { Link } from 'react-router';
import { AppPath } from '@core/config/app-paths';
import { useT } from '@core/i18n/use-i18n';
import { MessagePanel } from '@shared/components/message-panel';
import { Button } from '@shared/ui/button';

export function NotFoundPage() {
  const t = useT();
  return (
    <MessagePanel
      icon={CompassIcon}
      title={t('notFound.title')}
      description={t('notFound.description')}
      action={
        <Button asChild variant="outline">
          <Link to={AppPath.admin}>{t('notFound.home')}</Link>
        </Button>
      }
    />
  );
}
