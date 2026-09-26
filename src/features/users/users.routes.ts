import type { RouteObject } from 'react-router';
import { AppSegment } from '@core/config/app-paths';

export const usersRoute: RouteObject = {
  path: AppSegment.users,
  lazy: { Component: async () => (await import('./pages/users-page')).UsersPage },
};
