import { Outlet } from 'react-router';
import { AdminSidebar } from './admin-sidebar';
import { LocaleSwitcher } from './locale-switcher';
import { UserMenu } from './user-menu';

export function AdminLayout() {
  return (
    <div className="flex min-h-svh">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center justify-end gap-1 border-b bg-card px-6">
          <LocaleSwitcher />
          <UserMenu />
        </header>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
