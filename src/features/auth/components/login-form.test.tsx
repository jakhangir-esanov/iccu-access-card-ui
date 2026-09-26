import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { authApi } from '@core/auth/auth.service';
import { sessionStore } from '@core/auth/session';
import { ApiError, HttpErrorCode } from '@core/http/api-error';
import { UserRole } from '@shared/models/user-role';
import { renderWithProviders } from '@test/render-with-providers';
import { LoginForm } from './login-form';

vi.mock('@core/auth/auth.service', () => ({
  authApi: { login: vi.fn(), refresh: vi.fn(), logout: vi.fn() },
}));

const MESSAGES = {
  en: 'Invalid username or password.',
  uz: "Login yoki parol noto'g'ri.",
  ru: 'Неверный логин или пароль.',
};

async function submit(username: string, password: string) {
  await userEvent.type(screen.getByLabelText('Login'), username);
  await userEvent.type(screen.getByLabelText('Parol'), password);
  await userEvent.click(screen.getByRole('button', { name: 'Kirish' }));
}

describe('LoginForm', () => {
  afterEach(() => {
    sessionStore.end();
  });

  it('should show required messages and not call the backend when the fields are empty', async () => {
    renderWithProviders(<LoginForm />);

    await userEvent.click(screen.getByRole('button', { name: 'Kirish' }));

    expect(await screen.findAllByText("Maydon to'ldirilishi shart.")).toHaveLength(2);
    expect(authApi.login).not.toHaveBeenCalled();
  });

  it('should sign in with trimmed credentials when the form is valid', async () => {
    vi.mocked(authApi.login).mockResolvedValue({
      accessToken: 'jwt',
      expiresAt: '2026-09-26T15:00:00Z',
      user: { id: 'u1', username: 'admin', fullName: 'Administrator', role: UserRole.Admin },
    });
    renderWithProviders(<LoginForm />);

    await submit(' admin ', 'Admin12345');

    expect(authApi.login).toHaveBeenCalledWith({ username: 'admin', password: 'Admin12345' });
    expect(sessionStore.getState()).toMatchObject({ status: 'authenticated' });
  });

  it('should show the backend message when the credentials are wrong', async () => {
    vi.mocked(authApi.login).mockRejectedValue(
      new ApiError({ status: 401, code: 'User.InvalidCredentials', messages: MESSAGES }),
    );
    renderWithProviders(<LoginForm />);

    await submit('admin', 'wrong-pass');

    expect(await screen.findByRole('alert')).toHaveTextContent("Login yoki parol noto'g'ri.");
  });

  it('should show our text when the login is rate limited', async () => {
    vi.mocked(authApi.login).mockRejectedValue(
      new ApiError({ status: 429, code: HttpErrorCode.TooManyRequests }),
    );
    renderWithProviders(<LoginForm />);

    await submit('admin', 'wrong-pass');

    expect(await screen.findByRole('alert')).toHaveTextContent("So'rovlar juda ko'p");
  });

  it('should toggle password visibility when clicking the eye button', async () => {
    renderWithProviders(<LoginForm />);

    const passwordInput = screen.getByLabelText('Parol');
    expect(passwordInput).toHaveAttribute('type', 'password');

    const toggleButton = screen.getByRole('button', { name: "Parolni ko'rsatish" });
    await userEvent.click(toggleButton);

    expect(passwordInput).toHaveAttribute('type', 'text');
    expect(screen.getByRole('button', { name: 'Parolni yashirish' })).toBeInTheDocument();
  });
});
