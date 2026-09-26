import { Navigate, Outlet } from 'react-router';
import { AppPath } from '@core/config/app-paths';
import { useAuth } from './use-auth';

export function RequireAdmin() {
  const { isAdmin } = useAuth();
  return isAdmin ? <Outlet /> : <Navigate to={AppPath.forbidden} replace />;
}
