import { EllipsisIcon, KeyRoundIcon, PencilIcon } from 'lucide-react';
import { useMemo } from 'react';
import type { Sorting } from '@core/http/paging';
import { formatDateTime } from '@core/i18n/date-format';
import type { Translate } from '@core/i18n/translate';
import { useT } from '@core/i18n/use-i18n';
import { DataTable } from '@shared/components/data-table/data-table';
import { createDataTableColumnHelper } from '@shared/components/data-table/data-table-columns';
import { USER_ROLE_LABELS, UserRole } from '@shared/models/user-role';
import { Badge, type BadgeVariant } from '@shared/ui/badge';
import { Button } from '@shared/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@shared/ui/dropdown-menu';
import { statusOf, type User } from '../models/user';
import { UserStatusBadge } from './user-status-badge';

const column = createDataTableColumnHelper<User>();

const ROLE_VARIANTS: Readonly<Record<UserRole, BadgeVariant>> = {
  [UserRole.Receptionist]: 'secondary',
  [UserRole.Admin]: 'warning',
};

const MUTED_CELL = 'text-muted-foreground tabular-nums';

interface UserActions {
  readonly onEdit: (user: User) => void;
  readonly onResetPassword: (user: User) => void;
}

function createColumns(t: Translate, currentUserId: string | null, actions: UserActions) {
  return column.columns([
    column.accessor('fullName', {
      header: () => t('users.columns.fullName'),
      cell: ({ row }) => (
        <span className="font-semibold">
          {row.original.fullName}
          {row.original.id === currentUserId && (
            <Badge variant="muted" className="ml-2.5 h-6 px-2.5 text-xs">
              {t('users.you')}
            </Badge>
          )}
        </span>
      ),
    }),
    column.accessor('username', {
      header: () => t('users.columns.username'),
      cell: ({ getValue }) => <span className="text-muted-foreground">{getValue()}</span>,
    }),
    column.accessor('role', {
      header: () => t('users.columns.role'),
      cell: ({ getValue }) => (
        <Badge variant={ROLE_VARIANTS[getValue()]}>{t(USER_ROLE_LABELS[getValue()])}</Badge>
      ),
    }),
    column.display({
      id: 'status',
      header: () => t('users.columns.status'),
      cell: ({ row }) => <UserStatusBadge status={statusOf(row.original)} />,
    }),
    column.accessor('lastLoginAt', {
      header: () => t('users.columns.lastLoginAt'),
      cell: ({ getValue }) => {
        const value = getValue();
        return (
          <span className={MUTED_CELL}>
            {value === null ? t('users.never') : formatDateTime(value)}
          </span>
        );
      },
    }),
    column.accessor('createdAt', {
      header: () => t('users.columns.createdAt'),
      cell: ({ getValue }) => <span className={MUTED_CELL}>{formatDateTime(getValue())}</span>,
    }),
    column.display({
      id: 'actions',
      header: () => <span className="sr-only">{t('users.columns.actions')}</span>,
      cell: ({ row }) => <UserRowActions user={row.original} actions={actions} />,
    }),
  ]);
}

function UserRowActions({ user, actions }: { readonly user: User; readonly actions: UserActions }) {
  const t = useT();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon-sm"
          className="rounded-full"
          aria-label={`${t('users.columns.actions')}: ${user.fullName}`}
        >
          <EllipsisIcon aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-auto min-w-56">
        <DropdownMenuItem
          onSelect={() => {
            actions.onEdit(user);
          }}
        >
          <PencilIcon aria-hidden />
          {t('users.actions.edit')}
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => {
            actions.onResetPassword(user);
          }}
        >
          <KeyRoundIcon aria-hidden />
          {t('users.actions.resetPassword')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface UsersTableProps extends UserActions {
  readonly rows: User[];
  readonly currentUserId: string | null;
  readonly sorting: Sorting | null;
  readonly onSortingChange: (sorting: Sorting | null) => void;
  readonly isLoading: boolean;
}

export function UsersTable({
  rows,
  currentUserId,
  sorting,
  onSortingChange,
  isLoading,
  onEdit,
  onResetPassword,
}: UsersTableProps) {
  const t = useT();
  const columns = useMemo(
    () => createColumns(t, currentUserId, { onEdit, onResetPassword }),
    [t, currentUserId, onEdit, onResetPassword],
  );
  return (
    <DataTable
      columns={columns}
      rows={rows}
      getRowId={(row) => row.id}
      sorting={sorting}
      onSortingChange={onSortingChange}
      isLoading={isLoading}
    />
  );
}
