import {
  BadgeCheckIcon,
  CalendarDaysIcon,
  CircleAlertIcon,
  ClockIcon,
  UserPlusIcon,
  UsersIcon,
} from 'lucide-react';
import { useT } from '@core/i18n/use-i18n';
import { StatTile } from '@shared/components/charts/stat-tile';
import type { DashboardTotals } from '../models/dashboard';

interface DashboardTilesProps {
  readonly totals: DashboardTotals;
}

export function DashboardTiles({ totals }: DashboardTilesProps) {
  const t = useT();
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      <StatTile label={t('dashboard.tiles.total')} value={totals.total} icon={UsersIcon} />
      <StatTile
        label={t('dashboard.tiles.active')}
        value={totals.active}
        icon={BadgeCheckIcon}
        tone="success"
      />
      <StatTile
        label={t('dashboard.tiles.expiringSoon')}
        value={totals.expiringSoon}
        icon={ClockIcon}
        tone="warning"
      />
      <StatTile
        label={t('dashboard.tiles.registeredToday')}
        value={totals.registeredToday}
        icon={UserPlusIcon}
      />
      <StatTile
        label={t('dashboard.tiles.registeredThisMonth')}
        value={totals.registeredThisMonth}
        icon={CalendarDaysIcon}
      />
      <StatTile
        label={t('dashboard.tiles.expired')}
        value={totals.expired}
        icon={CircleAlertIcon}
        tone="danger"
      />
    </div>
  );
}
