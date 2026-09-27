import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { useAuth, type Auth } from '@core/auth/use-auth';
import { ApiError } from '@core/http/api-error';
import { renderWithProviders } from '@test/render-with-providers';
import type { UserDto } from '../api/users.dto';
import { createUser, fetchUsers, updateUser } from '../api/users.service';
import { UsersPage } from './users-page';

vi.mock('../api/users.service', () => ({
  fetchUsers: vi.fn(),
  createUser: vi.fn(),
  updateUser: vi.fn(),
  resetUserPassword: vi.fn(),
}));

vi.mock('@core/auth/use-auth', () => ({ useAuth: vi.fn() }));

const ADMIN: UserDto = {
  id: 'admin-1',
  username: 'admin',
  fullName: 'Administrator',
  role: 1,
  isActive: true,
  isLockedOut: false,
  lastLoginAt: '2026-09-26T19:23:16Z',
  createdAt: '2026-09-26T13:24:02Z',
};

const RECEPTIONIST: UserDto = {
  ...ADMIN,
  id: 'user-2',
  username: 'resepshn',
  fullName: 'Resepshn Xodimi',
  role: 0,
  isLockedOut: true,
  lastLoginAt: null,
};

const messages = (uz: string) => ({ en: uz, uz, ru: uz });

async function renderPage() {
  vi.mocked(useAuth).mockReturnValue({ user: { id: 'admin-1' } } as Auth);
  vi.mocked(fetchUsers).mockResolvedValue({ data: [ADMIN, RECEPTIONIST], totalCount: 2 });
  renderWithProviders(<UsersPage />, '/admin/users');
  await screen.findByText('Resepshn Xodimi');
}

async function openRowAction(name: string, action: string) {
  await userEvent.click(screen.getByRole('button', { name: `Amallar: ${name}` }));
  await userEvent.click(await screen.findByRole('menuitem', { name: action }));
  return screen.findByRole('dialog');
}

describe('UsersPage', () => {
  it('should mark the current user and a locked account when the list loads', async () => {
    await renderPage();

    expect(screen.getByText('siz')).toBeInTheDocument();
    expect(screen.getByText('Bloklangan')).toBeInTheDocument();
    expect(screen.getByText('Hali kirmagan')).toBeInTheDocument();
  });

  it('should put a taken username under its field when creating fails', async () => {
    vi.mocked(createUser).mockRejectedValue(
      new ApiError({
        status: 409,
        code: 'User.UsernameTaken',
        messages: messages('Bu login band.'),
      }),
    );
    await renderPage();

    await userEvent.click(screen.getByRole('button', { name: /Yangi foydalanuvchi/ }));
    const dialog = await screen.findByRole('dialog');
    await userEvent.type(within(dialog).getByLabelText('Login'), 'Admin');
    await userEvent.type(within(dialog).getByLabelText('F.I.Sh.'), 'Test');
    await userEvent.type(within(dialog).getByLabelText('Parol'), 'Kitob2026');
    await userEvent.type(within(dialog).getByLabelText('Parolni takrorlang'), 'Kitob2026');
    await userEvent.click(within(dialog).getByRole('button', { name: 'Saqlash' }));

    expect(await within(dialog).findByText('Bu login band.')).toBeInTheDocument();
    expect(createUser).toHaveBeenCalledWith({
      username: 'admin',
      fullName: 'Test',
      role: 0,
      password: 'Kitob2026',
    });
  });

  it('should show a non-field backend error inside the dialog when saving fails', async () => {
    vi.mocked(updateUser).mockRejectedValue(
      new ApiError({
        status: 409,
        code: 'User.CannotDemoteSelf',
        messages: messages("O'zingizni o'chira olmaysiz."),
      }),
    );
    await renderPage();

    const dialog = await openRowAction('Resepshn Xodimi', 'Tahrirlash');
    await userEvent.click(within(dialog).getByRole('button', { name: 'Saqlash' }));

    expect(await within(dialog).findByRole('alert')).toHaveTextContent(
      "O'zingizni o'chira olmaysiz.",
    );
  });

  it('should hide role and activity controls when admins edit themselves', async () => {
    await renderPage();

    const dialog = await openRowAction('Administrator', 'Tahrirlash');

    expect(within(dialog).queryByLabelText('Rol')).not.toBeInTheDocument();
    expect(within(dialog).getByText(/O'z rolingizni o'zgartira olmaysiz/)).toBeInTheDocument();
  });
});
