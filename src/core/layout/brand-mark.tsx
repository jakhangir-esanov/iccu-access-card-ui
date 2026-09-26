import { useT } from '@core/i18n/use-i18n';
import emblemUrl from '@shared/assets/iccu-emblem.png';
import { cn } from 'cn';

interface BrandMarkProps {
  readonly tone: 'light' | 'dark';
  readonly size?: 'default' | 'lg';
}

const TONE_CLASSES: Readonly<Record<BrandMarkProps['tone'], string>> = {
  light: 'text-sidebar-foreground [&_small]:text-sidebar-foreground/65',
  dark: 'text-foreground [&_small]:text-muted-foreground',
};

export function BrandMark({ tone, size = 'default' }: BrandMarkProps) {
  const t = useT();
  const isLarge = size === 'lg';
  return (
    <div className={cn('flex items-center gap-3.5', TONE_CLASSES[tone])}>
      <img
        src={emblemUrl}
        alt=""
        className={cn('shrink-0 object-contain', isLarge ? 'size-16' : 'size-14')}
      />
      <div className="grid gap-1">
        <span
          className={cn(
            'font-display leading-none font-bold tracking-[0.06em]',
            isLarge ? 'text-4xl' : 'text-3xl',
          )}
        >
          {t('app.name')}
        </span>
        <small className="text-xs leading-snug">{t('app.fullName')}</small>
      </div>
    </div>
  );
}
