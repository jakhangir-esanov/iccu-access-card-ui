import type { RouteObject } from 'react-router';
import { AppSegment } from '@core/config/app-paths';

export const registrationRequestsRoutes: RouteObject = {
  path: AppSegment.registrationRequests,
  children: [
    {
      index: true,
      lazy: async () => {
        const { RequestsPage } = await import('./pages/requests-page');
        return { Component: RequestsPage };
      },
    },
    {
      path: ':id',
      lazy: async () => {
        const { RequestPage } = await import('./pages/request-page');
        return { Component: RequestPage };
      },
    },
  ],
};
