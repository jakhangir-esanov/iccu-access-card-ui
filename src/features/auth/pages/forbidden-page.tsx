import { ShieldAlertIcon } from 'lucide-react';
import { useT } from '@core/i18n/use-i18n';
import { MessagePanel } from '@shared/components/message-panel';

export function ForbiddenPage() {
  const t = useT();
  return (
    <MessagePanel
      icon={ShieldAlertIcon}
      title={t('auth.forbidden.title')}
      description={t('auth.forbidden.description')}
    />
  );
}
