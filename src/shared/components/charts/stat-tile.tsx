import type { LucideIcon } from 'lucide-react';
import { Link } from 'react-router';
import { formatNumber } from '@core/i18n/number-format';
import { useLocale } from '@core/i18n/use-i18n';
import { cn } from 'cn';

export type StatTone = 'primary' | 'success' | 'warning' | 'danger';

interface StatTileProps {
  readonly label: string;
  readonly value: number;
  readonly icon: LucideIcon;
  readonly to?: string;
  readonly tone?: StatTone;
}

const TONE_CLASSES: Readonly<Record<StatTone, string>> = {
  primary: 'bg-accent text-accent-foreground',
  success: 'bg-turquoise-soft text-turquoise-ink',
  warning: 'bg-gold-soft text-gold-ink',
  danger: 'bg-destructive-soft text-destructive-ink',
};

export function StatTile({ label, value, icon: Icon, to, tone = 'primary' }: StatTileProps) {
  const { locale } = useLocale();
  const content = (
    <>
      <span className="grid gap-3">
        <span className="text-sm leading-snug font-semibold text-muted-foreground">{label}</span>
        <span className="text-4xl leading-none font-extrabold tracking-tight tabular-nums">
          {formatNumber(value, locale)}
        </span>
      </span>
      <span
        className={cn(
          'flex h-13 w-12 shrink-0 items-end justify-center rounded-[50%_50%_0.625rem_0.625rem/62%_62%_0.625rem_0.625rem] pb-3',
          TONE_CLASSES[tone],
        )}
      >
        <Icon className="size-5" aria-hidden />
      </span>
    </>
  );
  const className = 'flex items-start justify-between gap-4 rounded-2xl border bg-card p-6';
  if (to === undefined) {
    return <div className={className}>{content}</div>;
  }
  return (
    <Link
      to={to}
      className={cn(className, 'transition-colors hover:border-gold/60 hover:bg-gold-soft/30')}
    >
      {content}
    </Link>
  );
}
