import { CalendarDaysIcon } from 'lucide-react';
import { useState } from 'react';
import { formatLongDate } from '@core/i18n/date-format';
import { useT } from '@core/i18n/use-i18n';
import { LocaleSwitcher } from './locale-switcher';
import { UserMenu } from './user-menu';

export function AdminTopbar() {
  const t = useT();
  const [today] = useState(() => new Date());
  return (
    <div className="sticky top-0 z-30 bg-card/95 backdrop-blur print:hidden">
      <header className="flex h-20 items-center justify-between gap-6 px-10">
        <p className="flex items-center gap-2.5 text-sm font-semibold text-muted-foreground">
          <CalendarDaysIcon className="size-4.5 text-gold-ink" aria-hidden />
          {formatLongDate(today, t)}
        </p>
        <div className="flex items-center gap-3">
          <LocaleSwitcher />
          <span className="h-8 w-px bg-border" aria-hidden />
          <UserMenu />
        </div>
      </header>
      <div className="ornament-strip opacity-60" />
    </div>
  );
}
