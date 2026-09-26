import { useT } from '@core/i18n/use-i18n';
import emblemUrl from '@shared/assets/iccu-emblem.png';

export function PageLoader() {
  const t = useT();
  return (
    <div
      role="status"
      className="ornament-girih flex min-h-svh flex-col items-center justify-center gap-6 bg-sidebar [--ornament-opacity:0.12]"
    >
      <img src={emblemUrl} alt="" className="size-24 animate-pulse object-contain" />
      <div className="ornament-strip w-32 opacity-70" />
      <span className="sr-only">{t('common.loading')}</span>
    </div>
  );
}
