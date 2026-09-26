import { UserPlusIcon } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useAuth } from '@core/auth/use-auth';
import { useT } from '@core/i18n/use-i18n';
import { DataTablePager } from '@shared/components/data-table/data-table-pager';
import { useTableSearchParams } from '@shared/components/data-table/use-table-search-params';
import { FormAlert } from '@shared/components/form/form-alert';
import { Button } from '@shared/ui/button';
import { useUsers } from '../api/users.queries';
import { CreateUserDialog } from '../components/create-user-dialog';
import { EditUserDialog } from '../components/edit-user-dialog';
import { ResetPasswordDialog } from '../components/reset-password-dialog';
import { UserFilters } from '../components/user-filters';
import { UsersTable } from '../components/users-table';
import type { User } from '../models/user';
import { DEFAULT_USER_SORT, parseUserFilter } from '../models/user-filter';

const EMPTY_ROWS: never[] = [];

type OpenDialog =
  | { readonly kind: 'create' }
  | { readonly kind: 'edit'; readonly user: User }
  | { readonly kind: 'reset'; readonly user: User };

export function UsersPage() {
  const t = useT();
  const { user: currentUser } = useAuth();
  const table = useTableSearchParams(DEFAULT_USER_SORT);
  const filter = parseUserFilter(table.filter);
  const users = useUsers(filter, table.page);
  const [dialog, setDialog] = useState<OpenDialog | null>(null);
  const close = () => {
    setDialog(null);
  };
  const edit = useCallback((user: User) => {
    setDialog({ kind: 'edit', user });
  }, []);
  const resetPassword = useCallback((user: User) => {
    setDialog({ kind: 'reset', user });
  }, []);

  return (
    <section className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">{t('users.title')}</h1>
        <Button
          onClick={() => {
            setDialog({ kind: 'create' });
          }}
        >
          <UserPlusIcon aria-hidden />
          {t('users.create')}
        </Button>
      </div>
      <UserFilters filter={filter} onChange={table.setFilter} />
      <FormAlert message={users.isError ? t('table.loadFailed') : null} />
      <UsersTable
        rows={users.data?.rows ?? EMPTY_ROWS}
        currentUserId={currentUser?.id ?? null}
        sorting={table.page.sort ?? null}
        onSortingChange={table.setSort}
        isLoading={users.isFetching}
        onEdit={edit}
        onResetPassword={resetPassword}
      />
      <DataTablePager
        first={table.page.first}
        rows={table.page.rows}
        total={users.data?.total ?? 0}
        onChange={table.setPage}
      />
      {dialog?.kind === 'create' && <CreateUserDialog onClose={close} />}
      {dialog?.kind === 'edit' && (
        <EditUserDialog
          user={dialog.user}
          isSelf={dialog.user.id === currentUser?.id}
          onClose={close}
        />
      )}
      {dialog?.kind === 'reset' && <ResetPasswordDialog user={dialog.user} onClose={close} />}
    </section>
  );
}
