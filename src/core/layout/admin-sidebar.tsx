import { NavLink } from 'react-router';
import { useAuth } from '@core/auth/use-auth';
import { useT } from '@core/i18n/use-i18n';
import { cn } from 'cn';
import { menuFor } from './admin-menu';
import { BrandMark } from './brand-mark';

const LINK_CLASS =
  'flex items-center gap-3 rounded-lg border-l-2 px-3 py-2 text-sm font-medium transition-colors';

export function AdminSidebar() {
  const t = useT();
  const { isAdmin } = useAuth();
  return (
    <aside className="flex w-64 shrink-0 flex-col gap-6 bg-sidebar px-3 py-5 text-sidebar-foreground">
      <div className="px-2">
        <BrandMark tone="light" />
      </div>
      <nav aria-label={t('app.name')} className="grid gap-1">
        {menuFor(isAdmin).map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.exact}
            className={({ isActive }) =>
              cn(
                LINK_CLASS,
                isActive
                  ? 'border-sidebar-primary bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'border-transparent text-sidebar-foreground/80 hover:bg-sidebar-accent/60',
              )
            }
          >
            <item.icon className="size-4" aria-hidden />
            {t(item.label)}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
