import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { renderWithProviders } from '@test/render-with-providers';
import type { DashboardDto } from '../api/dashboard.dto';
import { toDashboard } from '../api/dashboard.mapper';
import { fetchDashboard } from '../api/dashboard.service';
import { toDayRows } from '../models/dashboard-charts';
import { DashboardPage } from './dashboard-page';

vi.mock('../api/dashboard.service', () => ({ fetchDashboard: vi.fn() }));

vi.mock('@core/realtime/use-registration-submitted', () => ({
  useRegistrationSubmitted: vi.fn(),
}));

const DASHBOARD: DashboardDto = {
  totals: {
    total: 1284,
    active: 1200,
    expired: 84,
    expiringSoon: 17,
    registeredToday: 4,
    registeredThisMonth: 96,
  },
  pendingRequests: 3,
  byCategory: [
    { category: 1, count: 700 },
    { category: 42, count: 5 },
  ],
  lastDays: [
    { day: '2026-09-26', count: 3 },
    { day: '2026-09-27', count: 4 },
  ],
};

describe('toDashboard', () => {
  it('should drop categories the UI does not know when the backend sends them', () => {
    expect(toDashboard(DASHBOARD).byCategory).toEqual([{ category: 1, count: 700 }]);
  });
});

describe('toDayRows', () => {
  it('should label each day as day.month when the chart rows are built', () => {
    expect(toDayRows(toDashboard(DASHBOARD).lastDays)[0]).toEqual({
      key: '2026-09-26',
      label: '26.09',
      values: { count: 3 },
    });
  });
});

describe('DashboardPage', () => {
  it('should show every total and link pending requests when the dashboard loads', async () => {
    vi.mocked(fetchDashboard).mockResolvedValue(DASHBOARD);

    renderWithProviders(<DashboardPage />);

    expect(await screen.findByText('Jami kitobxonlar')).toBeInTheDocument();
    expect(screen.getByText('1 284')).toBeInTheDocument();
    expect(screen.getByText('30 kunda tugaydi').parentElement).toHaveTextContent('17');
    expect(screen.getByRole('link', { name: /Kutilayotgan arizalar/ })).toHaveAttribute(
      'href',
      '/admin/requests',
    );
  });

  it('should explain the failure when the dashboard cannot be loaded', async () => {
    vi.mocked(fetchDashboard).mockRejectedValue(new Error('offline'));

    renderWithProviders(<DashboardPage />);

    expect(await screen.findByRole('alert')).toHaveTextContent(
      "Dashboard ma'lumotini yuklab bo'lmadi.",
    );
  });
});
