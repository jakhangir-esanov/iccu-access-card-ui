import { ChevronDownIcon, KeyRoundIcon, LogOutIcon, UserRoundIcon } from 'lucide-react';
import { Link } from 'react-router';
import { useAuth } from '@core/auth/use-auth';
import { AppPath } from '@core/config/app-paths';
import { useT } from '@core/i18n/use-i18n';
import { USER_ROLE_LABELS } from '@shared/models/user-role';
import { Button } from '@shared/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@shared/ui/dropdown-menu';

export function UserMenu() {
  const t = useT();
  const { user, logout } = useAuth();
  if (user === null) {
    return null;
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <UserRoundIcon aria-hidden />
          {user.fullName}
          <ChevronDownIcon aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-56">
        <DropdownMenuLabel className="grid">
          <span>{user.fullName}</span>
          <span className="text-xs font-normal text-muted-foreground">
            {user.username} · {t(USER_ROLE_LABELS[user.role])}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to={AppPath.password}>
            <KeyRoundIcon aria-hidden />
            {t('layout.changePassword')}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => void logout()}>
          <LogOutIcon aria-hidden />
          {t('layout.signOut')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
