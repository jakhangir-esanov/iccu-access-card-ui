import { Navigate, type RouteObject } from 'react-router';
import { GuestOnly } from '@core/auth/guest-only';
import { RequireAuth } from '@core/auth/require-auth';
import { AppPath, AppSegment } from '@core/config/app-paths';
import { AdminLayout } from '@core/layout/admin-layout';
import { changePasswordRoute, forbiddenRoute, loginRoute } from '@features/auth/auth.routes';
import { dashboardRoute } from '@features/dashboard/dashboard.routes';
import { notFoundRoute } from '@features/not-found/not-found.routes';

const adminRoutes: RouteObject = {
  path: AppSegment.admin,
  children: [
    { element: <GuestOnly />, children: [loginRoute] },
    {
      element: <RequireAuth />,
      children: [
        {
          element: <AdminLayout />,
          children: [dashboardRoute, changePasswordRoute, forbiddenRoute, notFoundRoute],
        },
      ],
    },
  ],
};

export const appRoutes: RouteObject[] = [
  { path: AppPath.root, element: <Navigate to={AppPath.admin} replace /> },
  adminRoutes,
  notFoundRoute,
];
