import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { I18nProvider } from '@core/i18n/i18n-provider';
import { ConfirmProvider } from './confirm-provider';
import { useConfirm } from './use-confirm';

function Probe() {
  const confirm = useConfirm();
  const [answer, setAnswer] = useState('none');
  const ask = async () => {
    const confirmed = await confirm({ description: 'errors.forbidden', destructive: true });
    setAnswer(String(confirmed));
  };
  return (
    <>
      <button type="button" onClick={() => void ask()}>
        ask
      </button>
      <output>{answer}</output>
    </>
  );
}

const renderProbe = () =>
  render(
    <I18nProvider>
      <ConfirmProvider>
        <Probe />
      </ConfirmProvider>
    </I18nProvider>,
  );

describe('ConfirmProvider', () => {
  it('should resolve true when the user confirms', async () => {
    renderProbe();

    await userEvent.click(screen.getByRole('button', { name: 'ask' }));
    expect(screen.getByRole('alertdialog')).toHaveTextContent('Ishonchingiz komilmi?');
    await userEvent.click(screen.getByRole('button', { name: 'Tasdiqlash' }));

    expect(screen.getByRole('status')).toHaveTextContent('true');
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
  });

  it('should resolve false when the user cancels', async () => {
    renderProbe();

    await userEvent.click(screen.getByRole('button', { name: 'ask' }));
    await userEvent.click(screen.getByRole('button', { name: 'Bekor qilish' }));

    expect(screen.getByRole('status')).toHaveTextContent('false');
  });
});
