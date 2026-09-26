import { Outlet } from 'react-router';
import { RealtimeProvider } from '@core/realtime/realtime-provider';
import { RegistrationAlerts } from '@core/realtime/registration-alerts';
import { AdminSidebar } from './admin-sidebar';
import { LocaleSwitcher } from './locale-switcher';
import { RealtimeIndicator } from './realtime-indicator';
import { UserMenu } from './user-menu';

export function AdminLayout() {
  return (
    <RealtimeProvider>
      <RegistrationAlerts />
      <div className="flex min-h-svh">
        <div className="contents print:hidden">
          <AdminSidebar />
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-14 items-center justify-end gap-1 border-b bg-card px-6 print:hidden">
            <RealtimeIndicator />
            <LocaleSwitcher />
            <UserMenu />
          </header>
          <main className="flex-1 p-6 print:p-0">
            <Outlet />
          </main>
        </div>
      </div>
    </RealtimeProvider>
  );
}
