import type { LucideIcon } from 'lucide-react';
import { Link } from 'react-router';
import { formatNumber } from '@core/i18n/number-format';
import { useLocale } from '@core/i18n/use-i18n';
import { cn } from 'cn';

interface StatTileProps {
  readonly label: string;
  readonly value: number;
  readonly icon: LucideIcon;
  readonly to?: string;
  readonly tone?: 'default' | 'attention';
}

export function StatTile({ label, value, icon: Icon, to, tone = 'default' }: StatTileProps) {
  const { locale } = useLocale();
  const content = (
    <>
      <span className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
        {label}
        <Icon
          className={cn('size-4', tone === 'attention' ? 'text-gold' : 'text-primary')}
          aria-hidden
        />
      </span>
      <span className="text-3xl font-semibold">{formatNumber(value, locale)}</span>
    </>
  );
  const className = 'grid gap-2 rounded-xl border bg-card p-4 shadow-xs';
  if (to === undefined) {
    return <div className={className}>{content}</div>;
  }
  return (
    <Link
      to={to}
      className={cn(className, 'transition-colors hover:border-primary/40 hover:bg-accent/40')}
    >
      {content}
    </Link>
  );
}
