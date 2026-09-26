import { UserRoundIcon } from 'lucide-react';
import { cn } from 'cn';
import { userInitials } from './user-initials';

interface UserAvatarProps {
  readonly fullName: string;
  readonly size?: 'default' | 'lg';
  readonly className?: string;
}

const SIZE_CLASSES: Readonly<Record<NonNullable<UserAvatarProps['size']>, string>> = {
  default: 'size-10 text-lg ring-offset-2',
  lg: 'size-14 text-2xl ring-offset-[3px]',
};

export function UserAvatar({ fullName, size = 'default', className }: UserAvatarProps) {
  const initials = userInitials(fullName);
  return (
    <span
      aria-hidden
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full bg-sidebar font-display font-bold text-gold ring-[1.5px] ring-gold ring-offset-card',
        SIZE_CLASSES[size],
        className,
      )}
    >
      {initials === '' ? <UserRoundIcon className="size-1/2" /> : initials}
    </span>
  );
}
