import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router';
import { AppPath } from '@core/config/app-paths';
import { PageLoader } from '@shared/components/page-loader';
import { toReturnState } from './return-path';
import { sessionStore } from './session';
import { useSession } from './use-auth';

export function RequireAuth() {
  const session = useSession();
  const location = useLocation();

  useEffect(() => {
    void sessionStore.restore();
  }, []);

  if (session.status === 'authenticated') {
    return <Outlet />;
  }
  if (session.status === 'anonymous') {
    return (
      <Navigate
        to={AppPath.login}
        replace
        state={session.returnToLocation ? toReturnState(location.pathname, location.search) : null}
      />
    );
  }
  return <PageLoader />;
}
