import type { RouteObject } from 'react-router';

export const dashboardRoute: RouteObject = {
  index: true,
  lazy: { Component: async () => (await import('./pages/dashboard-page')).DashboardPage },
};
