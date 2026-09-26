import type { RouteObject } from 'react-router';
import { AppSegment } from '@core/config/app-paths';

export const reportsRoute: RouteObject = {
  path: AppSegment.reports,
  lazy: { Component: async () => (await import('./pages/reports-page')).ReportsPage },
};
