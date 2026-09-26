import type { RouteObject } from 'react-router';

export const publicRegistrationRoute: RouteObject = {
  index: true,
  lazy: {
    Component: async () =>
      (await import('./pages/public-registration-page')).PublicRegistrationPage,
  },
};
