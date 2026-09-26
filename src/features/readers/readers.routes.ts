import type { RouteObject } from 'react-router';
import { AppSegment } from '@core/config/app-paths';

const loadForms = () => import('./pages/reader-form-page');

export const readersRoutes: RouteObject = {
  path: AppSegment.readers,
  children: [
    {
      index: true,
      lazy: { Component: async () => (await import('./pages/readers-page')).ReadersPage },
    },
    {
      path: AppSegment.create,
      lazy: { Component: async () => (await loadForms()).NewReaderPage },
    },
    {
      path: ':id',
      lazy: { Component: async () => (await import('./pages/reader-page')).ReaderPage },
    },
    {
      path: `:id/${AppSegment.edit}`,
      lazy: { Component: async () => (await loadForms()).EditReaderPage },
    },
  ],
};
