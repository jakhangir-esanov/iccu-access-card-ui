import {
  BarChart3Icon,
  BookUserIcon,
  InboxIcon,
  LayoutDashboardIcon,
  UsersIcon,
  type LucideIcon,
} from 'lucide-react';
import { AppPath } from '@core/config/app-paths';
import type { TranslationKey } from '@core/i18n/translations/dictionary';

export interface MenuItem {
  readonly path: string;
  readonly label: TranslationKey;
  readonly icon: LucideIcon;
  readonly adminOnly: boolean;
  readonly exact: boolean;
}

export const ADMIN_MENU: readonly MenuItem[] = [
  {
    path: AppPath.admin,
    label: 'nav.dashboard',
    icon: LayoutDashboardIcon,
    adminOnly: false,
    exact: true,
  },
  {
    path: AppPath.registrationRequests,
    label: 'nav.registrationRequests',
    icon: InboxIcon,
    adminOnly: false,
    exact: false,
  },
  {
    path: AppPath.readers,
    label: 'nav.readers',
    icon: BookUserIcon,
    adminOnly: false,
    exact: false,
  },
  {
    path: AppPath.reports,
    label: 'nav.reports',
    icon: BarChart3Icon,
    adminOnly: false,
    exact: false,
  },
  { path: AppPath.users, label: 'nav.users', icon: UsersIcon, adminOnly: true, exact: false },
];

export function menuFor(isAdmin: boolean): readonly MenuItem[] {
  return ADMIN_MENU.filter((item) => isAdmin || !item.adminOnly);
}
