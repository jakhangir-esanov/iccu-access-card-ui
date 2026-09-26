import { NavLink } from 'react-router';
import { useAuth } from '@core/auth/use-auth';
import { useT } from '@core/i18n/use-i18n';
import { KhatamStar } from '@shared/components/ornaments/khatam-star';
import { cn } from 'cn';
import { menuSectionsFor, type MenuItem, type MenuSection } from './admin-menu';
import { BrandMark } from './brand-mark';
import { RealtimeIndicator } from './realtime-indicator';

const LINK_CLASS =
  'flex h-12 items-center gap-3.5 rounded-xl px-4 text-[0.9375rem] font-semibold transition-colors outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring';

function SidebarLink({ item }: Readonly<{ item: MenuItem }>) {
  const t = useT();
  return (
    <NavLink
      to={item.path}
      end={item.exact}
      className={({ isActive }) =>
        cn(
          LINK_CLASS,
          isActive
            ? 'bg-sidebar-accent text-sidebar-accent-foreground ring-1 ring-sidebar-border ring-inset'
            : 'text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground',
        )
      }
    >
      {({ isActive }) => (
        <>
          <item.icon className={cn('size-5', isActive && 'text-sidebar-primary')} aria-hidden />
          <span className="flex-1">{t(item.label)}</span>
          {isActive && <KhatamStar className="text-sidebar-primary" />}
        </>
      )}
    </NavLink>
  );
}

function SidebarSection({ section }: Readonly<{ section: MenuSection }>) {
  const t = useT();
  return (
    <div className="grid gap-1">
      <p className="px-4 pb-2 text-[0.6875rem] font-bold tracking-[0.18em] text-sidebar-primary/85 uppercase">
        {t(section.label)}
      </p>
      <ul className="grid gap-1">
        {section.items.map((item) => (
          <li key={item.path}>
            <SidebarLink item={item} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function AdminSidebar() {
  const t = useT();
  const { isAdmin } = useAuth();
  return (
    <aside className="sticky top-0 flex h-svh w-72 shrink-0 flex-col bg-sidebar text-sidebar-foreground">
      <div className="ornament-girih px-6 pt-7 pb-6 [--ornament-opacity:0.16]">
        <BrandMark tone="light" />
      </div>
      <div className="ornament-strip mx-6 opacity-70" />
      <nav
        aria-label={t('app.name')}
        className="grid flex-1 content-start gap-6 overflow-y-auto px-4 py-7"
      >
        {menuSectionsFor(isAdmin).map((section) => (
          <SidebarSection key={section.group} section={section} />
        ))}
      </nav>
      <div className="px-6 pb-7">
        <RealtimeIndicator />
      </div>
    </aside>
  );
}
