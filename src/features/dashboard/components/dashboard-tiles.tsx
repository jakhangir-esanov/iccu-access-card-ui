import {
  BadgeCheckIcon,
  CalendarDaysIcon,
  CircleAlertIcon,
  ClockIcon,
  InboxIcon,
  UserPlusIcon,
  UsersIcon,
} from 'lucide-react';
import { AppPath } from '@core/config/app-paths';
import { useT } from '@core/i18n/use-i18n';
import { StatTile } from '@shared/components/charts/stat-tile';
import type { DashboardTotals } from '../models/dashboard';

interface DashboardTilesProps {
  readonly totals: DashboardTotals;
  readonly pendingRequests: number;
}

export function DashboardTiles({ totals, pendingRequests }: DashboardTilesProps) {
  const t = useT();
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
      <StatTile label={t('dashboard.tiles.total')} value={totals.total} icon={UsersIcon} />
      <StatTile label={t('dashboard.tiles.active')} value={totals.active} icon={BadgeCheckIcon} />
      <StatTile
        label={t('dashboard.tiles.expiringSoon')}
        value={totals.expiringSoon}
        icon={ClockIcon}
        tone="attention"
      />
      <StatTile
        label={t('dashboard.tiles.expired')}
        value={totals.expired}
        icon={CircleAlertIcon}
        tone="attention"
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
        label={t('dashboard.tiles.pendingRequests')}
        value={pendingRequests}
        icon={InboxIcon}
        to={AppPath.registrationRequests}
        tone={pendingRequests > 0 ? 'attention' : 'default'}
      />
    </div>
  );
}
