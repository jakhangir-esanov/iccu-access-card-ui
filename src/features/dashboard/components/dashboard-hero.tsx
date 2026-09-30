import { InboxIcon, PlusIcon } from 'lucide-react';
import { Link } from 'react-router';
import { AppPath, newReaderPath } from '@core/config/app-paths';
import { formatNumber } from '@core/i18n/number-format';
import { useLocale, useT } from '@core/i18n/use-i18n';
import { Button } from '@shared/ui/button';

interface DashboardHeroProps {
  readonly name: string;
  readonly pendingRequests: number | null;
}

export function DashboardHero({ name, pendingRequests }: DashboardHeroProps) {
  const t = useT();
  const { locale } = useLocale();
  return (
    <section className="ornament-girih flex flex-wrap items-center justify-between gap-6 rounded-2xl bg-deep px-9 py-8 text-deep-foreground [--ornament-opacity:0.18]">
      <div className="grid gap-2.5">
        <p className="text-xs font-bold tracking-[0.18em] text-gold uppercase">
          {t('app.libraryName')}
        </p>
        <h1 className="font-display text-4xl leading-tight font-semibold">
          {t('dashboard.welcome', { name })}
        </h1>
      </div>
      <div className="flex flex-wrap gap-3">
        <Button
          asChild
          variant="outline"
          className="border-deep-foreground/30 bg-transparent text-deep-foreground hover:bg-deep-foreground/10 hover:text-deep-foreground dark:bg-transparent"
        >
          <Link to={AppPath.registrationRequests}>
            <InboxIcon aria-hidden />
            {t('dashboard.tiles.pendingRequests')}
            {pendingRequests !== null && (
              <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-gold px-2 text-xs font-extrabold text-gold-foreground tabular-nums">
                {formatNumber(pendingRequests, locale)}
              </span>
            )}
          </Link>
        </Button>
        <Button asChild variant="gold">
          <Link to={newReaderPath}>
            <PlusIcon aria-hidden />
            {t('readers.create')}
          </Link>
        </Button>
      </div>
    </section>
  );
}
