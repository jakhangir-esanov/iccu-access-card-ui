import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { I18nProvider } from '@core/i18n/i18n-provider';
import { PasswordInput } from './password-input';

function renderPasswordInput(props: React.ComponentProps<typeof PasswordInput> = {}) {
  return render(
    <I18nProvider>
      <PasswordInput data-testid="pwd-input" {...props} />
    </I18nProvider>,
  );
}

describe('PasswordInput', () => {
  it('renders initially with type password and show password label', () => {
    renderPasswordInput();
    const input = screen.getByTestId('pwd-input');
    expect(input).toHaveAttribute('type', 'password');
    expect(screen.getByRole('button', { name: "Parolni ko'rsatish" })).toBeInTheDocument();
  });

  it('toggles password visibility when button is clicked', async () => {
    const user = userEvent.setup();
    renderPasswordInput();

    const toggleButton = screen.getByRole('button', { name: "Parolni ko'rsatish" });
    await user.click(toggleButton);

    const input = screen.getByTestId('pwd-input');
    expect(input).toHaveAttribute('type', 'text');
    expect(screen.getByRole('button', { name: 'Parolni yashirish' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Parolni yashirish' }));
    expect(input).toHaveAttribute('type', 'password');
    expect(screen.getByRole('button', { name: "Parolni ko'rsatish" })).toBeInTheDocument();
  });

  it('disables both input and toggle button when disabled', () => {
    renderPasswordInput({ disabled: true });
    expect(screen.getByTestId('pwd-input')).toBeDisabled();
    expect(screen.getByRole('button', { name: "Parolni ko'rsatish" })).toBeDisabled();
  });
});
