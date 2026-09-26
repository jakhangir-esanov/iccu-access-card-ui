import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { useAuth, type Auth } from '@core/auth/use-auth';
import { renderWithProviders } from '@test/render-with-providers';
import { toReader } from '../api/readers.mapper';
import { deleteReader, renewReader } from '../api/readers.service';
import { READER_DTO } from '../test/reader-fixtures';
import { ReaderActions } from './reader-actions';

vi.mock('../api/readers.service', () => ({
  renewReader: vi.fn(),
  deleteReader: vi.fn(),
}));

vi.mock('@core/auth/use-auth', () => ({ useAuth: vi.fn() }));

const reader = toReader(READER_DTO);

function renderAs(isAdmin: boolean) {
  vi.mocked(useAuth).mockReturnValue({ isAdmin } as Auth);
  renderWithProviders(<ReaderActions reader={reader} />);
}

describe('ReaderActions', () => {
  it('should renew the card and report the new date when the user confirms', async () => {
    vi.mocked(renewReader).mockResolvedValue({ issuedOn: '2026-09-26', expiresOn: '2028-09-26' });
    renderAs(false);

    await userEvent.click(screen.getByRole('button', { name: 'Uzaytirish' }));
    await userEvent.click(screen.getByRole('button', { name: 'Tasdiqlash' }));

    expect(renewReader).toHaveBeenCalledWith('reader-1');
    expect(await screen.findByText('Karta 26.09.2028 gacha uzaytirildi.')).toBeInTheDocument();
  });

  it('should not renew when the user cancels', async () => {
    renderAs(false);

    await userEvent.click(screen.getByRole('button', { name: 'Uzaytirish' }));
    await userEvent.click(screen.getByRole('button', { name: 'Bekor qilish' }));

    expect(renewReader).not.toHaveBeenCalled();
  });

  it('should hide the delete action when the user is a receptionist', () => {
    renderAs(false);

    expect(screen.queryByRole('button', { name: "O'chirish" })).not.toBeInTheDocument();
  });

  it('should delete after a destructive confirmation when the user is an admin', async () => {
    vi.mocked(deleteReader).mockResolvedValue(undefined);
    renderAs(true);

    await userEvent.click(screen.getByRole('button', { name: "O'chirish" }));
    const dialog = await screen.findByRole('alertdialog');
    await userEvent.click(within(dialog).getByRole('button', { name: "O'chirish" }));

    expect(deleteReader).toHaveBeenCalledWith('reader-1');
  });
});
