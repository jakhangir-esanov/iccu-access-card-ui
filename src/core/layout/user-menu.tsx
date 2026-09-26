import { ChevronDownIcon, ChevronRightIcon, KeyRoundIcon, LogOutIcon } from 'lucide-react';
import { Link } from 'react-router';
import type { AuthUser } from '@core/auth/auth-user';
import { useAuth } from '@core/auth/use-auth';
import { AppPath } from '@core/config/app-paths';
import { useT } from '@core/i18n/use-i18n';
import { ThemeMenuGroup } from '@core/theme/theme-menu-group';
import { KhatamStar } from '@shared/components/ornaments/khatam-star';
import { USER_ROLE_LABELS } from '@shared/models/user-role';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@shared/ui/dropdown-menu';
import { UserAvatar } from './user-avatar';

const ICON_TILE_CLASS = 'flex size-9 items-center justify-center rounded-lg';

function UserMenuTrigger({ user }: Readonly<{ user: AuthUser }>) {
  const t = useT();
  return (
    <DropdownMenuTrigger
      aria-label={t('layout.account')}
      className="flex h-13 items-center gap-3 rounded-full border bg-card py-1.5 pr-4 pl-1.5 text-left transition-colors outline-none hover:border-gold/70 focus-visible:ring-3 focus-visible:ring-ring/50 data-[state=open]:border-gold data-[state=open]:ring-4 data-[state=open]:ring-gold/15"
    >
      <UserAvatar fullName={user.fullName} />
      <span className="grid gap-0.5 leading-tight">
        <span className="text-[0.9375rem] font-bold">{user.fullName}</span>
        <span className="text-[0.8125rem] text-muted-foreground">
          {t(USER_ROLE_LABELS[user.role])}
        </span>
      </span>
      <ChevronDownIcon className="size-4 text-muted-foreground" aria-hidden />
    </DropdownMenuTrigger>
  );
}

function UserMenuHeader({ user }: Readonly<{ user: AuthUser }>) {
  const t = useT();
  return (
    <div className="ornament-girih grid gap-3.5 bg-deep px-5 py-5 text-deep-foreground [--ornament-opacity:0.18]">
      <div className="flex items-center gap-3.5">
        <UserAvatar fullName={user.fullName} size="lg" className="ring-offset-deep" />
        <div className="grid min-w-0 gap-1">
          <span className="truncate font-display text-2xl leading-tight font-semibold">
            {user.fullName}
          </span>
          <span className="truncate text-[0.8125rem] text-deep-foreground/70">{user.username}</span>
        </div>
      </div>
      <span className="flex w-fit items-center gap-2 rounded-full bg-gold/20 px-3 py-1 text-[0.8125rem] font-bold text-gold ring-1 ring-gold/45 ring-inset">
        <KhatamStar />
        {t(USER_ROLE_LABELS[user.role])}
      </span>
    </div>
  );
}

export function UserMenu() {
  const t = useT();
  const { user, logout } = useAuth();
  if (user === null) {
    return null;
  }
  return (
    <DropdownMenu>
      <UserMenuTrigger user={user} />
      <DropdownMenuContent align="end" sideOffset={10} className="w-84 p-0">
        <UserMenuHeader user={user} />
        <div className="grid gap-1 p-2">
          <DropdownMenuItem asChild>
            <Link to={AppPath.password}>
              <span className={`${ICON_TILE_CLASS} bg-gold-soft text-gold-ink`}>
                <KeyRoundIcon aria-hidden />
              </span>
              <span className="flex-1 font-semibold">{t('layout.changePassword')}</span>
              <ChevronRightIcon className="text-muted-foreground" aria-hidden />
            </Link>
          </DropdownMenuItem>
          <DropdownMenuLabel>{t('theme.title')}</DropdownMenuLabel>
          <div className="px-2 pb-1">
            <ThemeMenuGroup />
          </div>
          <div className="ornament-strip mx-3 my-2 opacity-50" />
          <DropdownMenuItem variant="destructive" onSelect={() => void logout()}>
            <span className={`${ICON_TILE_CLASS} bg-destructive-soft`}>
              <LogOutIcon aria-hidden />
            </span>
            <span className="font-bold">{t('layout.signOut')}</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
