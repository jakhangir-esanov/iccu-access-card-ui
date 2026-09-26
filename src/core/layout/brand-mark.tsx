import { useT } from '@core/i18n/use-i18n';
import emblemUrl from '@shared/assets/iccu-emblem.png';

interface BrandMarkProps {
  readonly tone: 'light' | 'dark';
  readonly size?: 'default' | 'lg';
}

const TONE_CLASSES: Readonly<Record<BrandMarkProps['tone'], string>> = {
  light: 'text-sidebar-foreground [&_small]:text-sidebar-foreground/70',
  dark: 'text-foreground [&_small]:text-muted-foreground',
};

export function BrandMark({ tone, size = 'default' }: BrandMarkProps) {
  const t = useT();
  const isLarge = size === 'lg';
  return (
    <div className={`flex items-center gap-3.5 ${TONE_CLASSES[tone]}`}>
      <img
        src={emblemUrl}
        alt=""
        className={`${isLarge ? 'size-12' : 'size-10'} shrink-0 object-contain drop-shadow-sm`}
      />
      <div className="grid leading-tight">
        <span className={`${isLarge ? 'text-lg' : 'text-base'} font-semibold tracking-wide`}>
          {t('app.name')}
        </span>
        <small className={isLarge ? 'text-sm' : 'text-xs'}>{t('app.fullName')}</small>
      </div>
    </div>
  );
}
