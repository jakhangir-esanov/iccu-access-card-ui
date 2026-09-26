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

export const MenuGroup = {
  main: 'main',
  management: 'management',
} as const;

export type MenuGroup = (typeof MenuGroup)[keyof typeof MenuGroup];

export interface MenuItem {
  readonly path: string;
  readonly label: TranslationKey;
  readonly icon: LucideIcon;
  readonly group: MenuGroup;
  readonly adminOnly: boolean;
  readonly exact: boolean;
}

export interface MenuSection {
  readonly group: MenuGroup;
  readonly label: TranslationKey;
  readonly items: readonly MenuItem[];
}

const GROUP_LABELS: Readonly<Record<MenuGroup, TranslationKey>> = {
  [MenuGroup.main]: 'nav.groups.main',
  [MenuGroup.management]: 'nav.groups.management',
};

export const ADMIN_MENU: readonly MenuItem[] = [
  {
    path: AppPath.admin,
    label: 'nav.dashboard',
    icon: LayoutDashboardIcon,
    group: MenuGroup.main,
    adminOnly: false,
    exact: true,
  },
  {
    path: AppPath.registrationRequests,
    label: 'nav.registrationRequests',
    icon: InboxIcon,
    group: MenuGroup.main,
    adminOnly: false,
    exact: false,
  },
  {
    path: AppPath.readers,
    label: 'nav.readers',
    icon: BookUserIcon,
    group: MenuGroup.main,
    adminOnly: false,
    exact: false,
  },
  {
    path: AppPath.reports,
    label: 'nav.reports',
    icon: BarChart3Icon,
    group: MenuGroup.management,
    adminOnly: false,
    exact: false,
  },
  {
    path: AppPath.users,
    label: 'nav.users',
    icon: UsersIcon,
    group: MenuGroup.management,
    adminOnly: true,
    exact: false,
  },
];

export function menuFor(isAdmin: boolean): readonly MenuItem[] {
  return ADMIN_MENU.filter((item) => isAdmin || !item.adminOnly);
}

export function menuSectionsFor(isAdmin: boolean): readonly MenuSection[] {
  const items = menuFor(isAdmin);
  return Object.values(MenuGroup)
    .map((group) => ({
      group,
      label: GROUP_LABELS[group],
      items: items.filter((item) => item.group === group),
    }))
    .filter((section) => section.items.length > 0);
}
