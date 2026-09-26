import { useT } from '@core/i18n/use-i18n';

interface BrandMarkProps {
  readonly tone: 'light' | 'dark';
}

const TONE_CLASSES: Readonly<Record<BrandMarkProps['tone'], string>> = {
  light: 'text-sidebar-foreground [&_small]:text-sidebar-foreground/70',
  dark: 'text-foreground [&_small]:text-muted-foreground',
};

export function BrandMark({ tone }: BrandMarkProps) {
  const t = useT();
  return (
    <div className={`flex items-center gap-3 ${TONE_CLASSES[tone]}`}>
      <svg viewBox="0 0 32 32" className="size-9 shrink-0" aria-hidden>
        <rect width="32" height="32" rx="7" className="fill-primary" />
        <path d="M16 5l3.2 7.8L27 16l-7.8 3.2L16 27l-3.2-7.8L5 16l7.8-3.2z" className="fill-gold" />
      </svg>
      <div className="grid leading-tight">
        <span className="text-base font-semibold tracking-wide">{t('app.name')}</span>
        <small className="text-xs">{t('app.fullName')}</small>
      </div>
    </div>
  );
}
