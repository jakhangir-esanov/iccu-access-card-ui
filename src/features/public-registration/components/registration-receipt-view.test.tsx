import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { renderWithProviders } from '@test/render-with-providers';
import { RegistrationReceiptView } from './registration-receipt-view';

describe('RegistrationReceiptView', () => {
  it('should show the code and the Tashkent expiry time when a request is received', () => {
    renderWithProviders(
      <RegistrationReceiptView
        receipt={{ code: '0427', expiresAt: '2026-09-27T17:06:00Z' }}
        onRestart={vi.fn()}
      />,
    );

    expect(screen.getByRole('status')).toHaveTextContent('0427');
    expect(screen.getByText('Ariza 27.09.2026 22:06 gacha amal qiladi.')).toBeInTheDocument();
  });

  it('should start a new form when the visitor asks for it', async () => {
    const onRestart = vi.fn();
    renderWithProviders(
      <RegistrationReceiptView
        receipt={{ code: '0001', expiresAt: '2026-09-27T00:00:00Z' }}
        onRestart={onRestart}
      />,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Yangi anketa' }));

    expect(onRestart).toHaveBeenCalledTimes(1);
  });
});
