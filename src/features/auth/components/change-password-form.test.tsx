import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { authApi } from '@core/auth/auth.service';
import { sessionStore } from '@core/auth/session';
import { ApiError } from '@core/http/api-error';
import { UserRole } from '@shared/models/user-role';
import { renderWithProviders } from '@test/render-with-providers';
import { changePassword } from '../api/password.service';
import { ChangePasswordForm } from './change-password-form';

vi.mock('../api/password.service', () => ({ changePassword: vi.fn() }));
vi.mock('@core/auth/auth.service', () => ({
  authApi: { login: vi.fn(), refresh: vi.fn(), logout: vi.fn() },
}));

async function signIn() {
  vi.mocked(authApi.login).mockResolvedValue({
    accessToken: 'jwt',
    user: { id: 'u1', username: 'resepshn', fullName: 'Resepshn', role: UserRole.Receptionist },
  });
  await sessionStore.login({ username: 'resepshn', password: 'x' });
}

async function fill(current: string, next: string, confirm: string) {
  await userEvent.type(screen.getByLabelText('Joriy parol'), current);
  await userEvent.type(screen.getByLabelText('Yangi parol'), next);
  await userEvent.type(screen.getByLabelText('Yangi parolni takrorlang'), confirm);
  await userEvent.click(screen.getByRole('button', { name: "O'zgartirish" }));
}

describe('ChangePasswordForm', () => {
  it('should end the session when the password is changed', async () => {
    await signIn();
    vi.mocked(changePassword).mockResolvedValue(undefined);
    renderWithProviders(<ChangePasswordForm />);

    await fill('Resep12345', 'Resep67890', 'Resep67890');

    expect(changePassword).toHaveBeenCalledWith({
      currentPassword: 'Resep12345',
      newPassword: 'Resep67890',
    });
    expect(sessionStore.getState()).toEqual({
      status: 'anonymous',
      reason: null,
      returnToLocation: false,
    });
  });

  it('should put the backend message under the current password when it is wrong', async () => {
    vi.mocked(changePassword).mockRejectedValue(
      new ApiError({
        status: 400,
        code: 'User.WrongCurrentPassword',
        messages: { en: 'Wrong.', uz: "Joriy parol noto'g'ri.", ru: 'Неверно.' },
      }),
    );
    renderWithProviders(<ChangePasswordForm />);

    await fill('NotMine123', 'Resep67890', 'Resep67890');

    expect(await screen.findByText("Joriy parol noto'g'ri.")).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('should not call the backend when the confirmation differs', async () => {
    renderWithProviders(<ChangePasswordForm />);

    await fill('Resep12345', 'Resep67890', 'Resep67891');

    expect(await screen.findByText('Parollar bir xil emas.')).toBeInTheDocument();
    expect(changePassword).not.toHaveBeenCalled();
  });
});
