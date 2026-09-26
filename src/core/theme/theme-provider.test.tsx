import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { I18nProvider } from '@core/i18n/i18n-provider';
import { THEME_STORAGE_KEY } from './theme';
import { ThemeProvider } from './theme-provider';
import { ThemeToggle } from './theme-toggle';
import { useTheme } from './use-theme';

function ThemeConsumerProbe() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <span data-testid="resolved">{resolvedTheme}</span>
      <button
        type="button"
        onClick={() => {
          setTheme('dark');
        }}
      >
        Set Dark
      </button>
      <button
        type="button"
        onClick={() => {
          setTheme('light');
        }}
      >
        Set Light
      </button>
    </div>
  );
}

describe('ThemeProvider and ThemeToggle', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = '';
  });

  it('provides default system theme and updates on setTheme', async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <ThemeConsumerProbe />
      </ThemeProvider>,
    );

    expect(screen.getByTestId('theme')).toHaveTextContent('system');
    await user.click(screen.getByRole('button', { name: 'Set Dark' }));
    expect(screen.getByTestId('theme')).toHaveTextContent('dark');
    expect(screen.getByTestId('resolved')).toHaveTextContent('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');

    await user.click(screen.getByRole('button', { name: 'Set Light' }));
    expect(screen.getByTestId('theme')).toHaveTextContent('light');
    expect(screen.getByTestId('resolved')).toHaveTextContent('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('light');
  });

  it('renders ThemeToggle dropdown and allows selection', async () => {
    const user = userEvent.setup();
    render(
      <I18nProvider>
        <ThemeProvider>
          <ThemeToggle />
        </ThemeProvider>
      </I18nProvider>,
    );

    const toggleButton = screen.getByRole('button', { name: 'Mavzu' });
    await user.click(toggleButton);

    const darkOption = await screen.findByRole('menuitemradio', { name: /Tungi rejim/i });
    await user.click(darkOption);

    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
  });
});
