import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { renderWithProviders } from '@test/render-with-providers';
import { fetchRegistrationReport } from '../api/reports.service';
import { ReportsPage } from './reports-page';

vi.mock('../api/reports.service', () => ({ fetchRegistrationReport: vi.fn() }));

describe('ReportsPage', () => {
  it('should show the totals and employees when the report loads', async () => {
    vi.mocked(fetchRegistrationReport).mockResolvedValue({
      from: '2026-09-01',
      to: '2026-09-27',
      groupBy: 0,
      total: 5,
      byPeriod: [{ period: '2026-09-26', total: 5, reception: 2, selfService: 3 }],
      byCategory: [{ category: 1, count: 5 }],
      byGender: [{ gender: 1, count: 5 }],
      byCitizenship: [{ citizenship: 0, count: 5 }],
      byUser: [{ userId: 'u1', fullName: 'Resepshn Xodimi', count: 2 }],
    });

    renderWithProviders(<ReportsPage />, '/admin/reports?from=2026-09-01&to=2026-09-27');

    expect(await screen.findByText("Jami ro'yxatdan o'tganlar")).toBeInTheDocument();
    expect(screen.getByText("Jami ro'yxatdan o'tganlar").parentElement).toHaveTextContent('5');
    const [receptionTile] = screen.getAllByText('Qabulxona');
    expect(receptionTile?.parentElement).toHaveTextContent('2');
    expect(screen.getByText("Onlayn ro'yxatdan o'tganlar").parentElement).toHaveTextContent('3');
    expect(screen.getByText('Resepshn Xodimi')).toBeInTheDocument();
    expect(fetchRegistrationReport).toHaveBeenCalledWith({
      from: '2026-09-01',
      to: '2026-09-27',
      groupBy: 0,
    });
  });

  it('should not ask the backend when the range is reversed', async () => {
    renderWithProviders(<ReportsPage />, '/admin/reports?from=2026-09-27&to=2026-09-01');

    expect(await screen.findByRole('alert')).toHaveTextContent(
      "Tugash sanasi boshlanishdan oldin bo'lmasligi kerak.",
    );
    expect(fetchRegistrationReport).not.toHaveBeenCalled();
  });
});
