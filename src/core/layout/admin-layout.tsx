import { Outlet } from 'react-router';
import { RealtimeProvider } from '@core/realtime/realtime-provider';
import { RegistrationAlerts } from '@core/realtime/registration-alerts';
import { AdminSidebar } from './admin-sidebar';
import { AdminTopbar } from './admin-topbar';

export function AdminLayout() {
  return (
    <RealtimeProvider>
      <RegistrationAlerts />
      <div className="flex min-h-svh">
        <div className="contents print:hidden">
          <AdminSidebar />
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <AdminTopbar />
          <main className="flex-1">
            <div className="mx-auto w-full max-w-[90rem] px-10 pt-8 pb-12 print:max-w-none print:p-0">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </RealtimeProvider>
  );
}
