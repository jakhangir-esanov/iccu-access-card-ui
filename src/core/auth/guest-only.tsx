import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router';
import { PageLoader } from '@shared/components/page-loader';
import { readReturnPath } from './return-path';
import { sessionStore } from './session';
import { useSession } from './use-auth';

export function GuestOnly() {
  const session = useSession();
  const location = useLocation();

  useEffect(() => {
    void sessionStore.restore();
  }, []);

  if (session.status === 'authenticated') {
    return <Navigate to={readReturnPath(location.state)} replace />;
  }
  if (session.status === 'anonymous') {
    return <Outlet />;
  }
  return <PageLoader />;
}
