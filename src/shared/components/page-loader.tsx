import { Loader2Icon } from 'lucide-react';
import { useT } from '@core/i18n/use-i18n';

export function PageLoader() {
  const t = useT();
  return (
    <div role="status" className="flex min-h-svh items-center justify-center text-primary">
      <Loader2Icon className="size-8 animate-spin" aria-hidden />
      <span className="sr-only">{t('common.loading')}</span>
    </div>
  );
}
