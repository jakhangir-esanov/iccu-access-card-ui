import type { RouteObject } from 'react-router';
import { ANY_PATH } from '@core/config/app-paths';

export const notFoundRoute: RouteObject = {
  path: ANY_PATH,
  lazy: { Component: async () => (await import('./pages/not-found-page')).NotFoundPage },
};
