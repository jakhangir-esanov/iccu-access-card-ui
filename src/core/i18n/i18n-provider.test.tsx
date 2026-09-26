import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import { I18nProvider } from './i18n-provider';
import { useLocale, useT } from './use-i18n';

function Probe() {
  const t = useT();
  const { setLocale } = useLocale();
  return (
    <>
      <p>{t('common.cancel')}</p>
      <button
        type="button"
        onClick={() => {
          setLocale('ru');
        }}
      >
        ru
      </button>
    </>
  );
}

const renderProbe = () =>
  render(
    <I18nProvider>
      <Probe />
    </I18nProvider>,
  );

describe('I18nProvider', () => {
  afterEach(() => {
    localStorage.clear();
  });

  it('should render Uzbek when nothing is stored', () => {
    renderProbe();

    expect(screen.getByText('Bekor qilish')).toBeInTheDocument();
    expect(document.documentElement.lang).toBe('uz');
  });

  it('should switch the language and remember it when the locale changes', async () => {
    renderProbe();

    await userEvent.click(screen.getByRole('button', { name: 'ru' }));

    expect(screen.getByText('Отмена')).toBeInTheDocument();
    expect(document.documentElement.lang).toBe('ru');
    expect(localStorage.getItem('iccu.locale')).toBe('ru');
  });

  it('should start in the stored language when one was saved before', () => {
    localStorage.setItem('iccu.locale', 'en');

    renderProbe();

    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('should fall back to Uzbek when the stored value is not a locale', () => {
    localStorage.setItem('iccu.locale', 'de');

    renderProbe();

    expect(screen.getByText('Bekor qilish')).toBeInTheDocument();
  });
});
