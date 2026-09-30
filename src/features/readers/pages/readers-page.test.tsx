import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { useAuth, type Auth } from '@core/auth/use-auth';
import { renderWithProviders } from '@test/render-with-providers';
import { exportReaders, fetchReaders } from '../api/readers.service';
import { READER_LIST_ITEM_DTO } from '../test/reader-fixtures';
import { ReadersPage } from './readers-page';

vi.mock('../api/readers.service', () => ({
  fetchReaders: vi.fn(),
  exportReaders: vi.fn(),
}));

vi.mock('@core/auth/use-auth', () => ({ useAuth: vi.fn() }));

vi.mock('@shared/utils/save-file', () => ({ saveFile: vi.fn() }));

function signInAs(isAdmin: boolean) {
  vi.mocked(useAuth).mockReturnValue({ isAdmin } as Auth);
}

describe('ReadersPage', () => {
  it('should show readers when the list is loaded', async () => {
    signInAs(false);
    vi.mocked(fetchReaders).mockResolvedValue({ data: [READER_LIST_ITEM_DTO], totalCount: 1 });

    renderWithProviders(<ReadersPage />, '/admin/readers');

    expect(await screen.findByText('0000001')).toBeInTheDocument();
    expect(screen.getByText('Karimova Gulnoza Anvar qizi')).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'Ayol' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: "O'zbekiston fuqarosi" })).toBeInTheDocument();
    expect(screen.getByText('1-1 / 1')).toBeInTheDocument();
  });

  it('should hide the export when the user is a receptionist', async () => {
    signInAs(false);
    vi.mocked(fetchReaders).mockResolvedValue({ data: [], totalCount: 0 });

    renderWithProviders(<ReadersPage />, '/admin/readers');

    expect(await screen.findByText("Ma'lumot yo'q")).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Excelga eksport/ })).not.toBeInTheDocument();
  });

  it('should export with the current filter when an admin asks for Excel', async () => {
    signInAs(true);
    vi.mocked(fetchReaders).mockResolvedValue({ data: [], totalCount: 0 });
    vi.mocked(exportReaders).mockResolvedValue({ blob: new Blob(['x']), fileName: 'k.xlsx' });

    renderWithProviders(<ReadersPage />, '/admin/readers?category=1&search=ali');
    await userEvent.click(await screen.findByRole('button', { name: /Excelga eksport/ }));

    expect(exportReaders).toHaveBeenCalledWith(
      expect.objectContaining({ category: 1, search: 'ali' }),
    );
  });
});
