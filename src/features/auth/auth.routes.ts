import type { RouteObject } from 'react-router';
import { AppSegment } from '@core/config/app-paths';

export const loginRoute: RouteObject = {
  path: AppSegment.login,
  lazy: { Component: async () => (await import('./pages/login-page')).LoginPage },
};

export const changePasswordRoute: RouteObject = {
  path: AppSegment.password,
  lazy: {
    Component: async () => (await import('./pages/change-password-page')).ChangePasswordPage,
  },
};

export const forbiddenRoute: RouteObject = {
  path: AppSegment.forbidden,
  lazy: { Component: async () => (await import('./pages/forbidden-page')).ForbiddenPage },
};
