import { fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route, Routes } from 'react-router';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderWithProviders } from '@test/render-with-providers';
import { fetchReader, recordCardPrint } from '../api/readers.service';
import { READER_DTO } from '../test/reader-fixtures';
import { ReaderCardPage } from './reader-card-page';

vi.mock('../api/readers.service', () => ({
  fetchReader: vi.fn(),
  recordCardPrint: vi.fn(),
}));

vi.mock('@shared/components/authorized-image', () => ({
  AuthorizedImage: ({ alt, onLoad }: { readonly alt: string; readonly onLoad?: () => void }) => (
    <img alt={alt} onLoad={onLoad} />
  ),
}));

async function renderCardPage() {
  vi.mocked(fetchReader).mockResolvedValue(READER_DTO);
  renderWithProviders(
    <Routes>
      <Route path="/admin/readers/:id/card" element={<ReaderCardPage />} />
    </Routes>,
    '/admin/readers/reader-1/card',
  );
  fireEvent.load(await screen.findByAltText('KARIMOVA GULNOZA ANVAR QIZI'));
}

async function printAndAnswer(answer: string) {
  const print = vi.spyOn(window, 'print').mockImplementation(() => {
    window.dispatchEvent(new Event('afterprint'));
  });
  await userEvent.click(screen.getByRole('button', { name: /Chop etish/ }));
  await userEvent.click(await screen.findByRole('button', { name: answer }));
  return print;
}

describe('ReaderCardPage', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should show both sides with the card data when the reader is loaded', async () => {
    await renderCardPage();

    expect(screen.getByText('KARIMOVA GULNOZA ANVAR QIZI')).toBeInTheDocument();
    expect(screen.getByText('TALABA')).toBeInTheDocument();
    expect(screen.getByText('0000001')).toBeInTheDocument();
    expect(screen.getByText('Orqa tomoni')).toBeInTheDocument();
  });

  it('should print the Uzbek front text and a barcode of the card number when the reader is loaded', async () => {
    await renderCardPage();

    expect(screen.getByText('Oʻzbekistondagi Islom sivilizatsiyasi')).toBeInTheDocument();
    expect(screen.getByText('Berilgan sana: 26.09.2026')).toBeInTheDocument();
    expect(screen.getByText('Amal qilish muddati: 26.09.2028')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: '0000001' })).toBeInTheDocument();
  });

  it('should record the print when the user confirms the card came out', async () => {
    vi.mocked(recordCardPrint).mockResolvedValue(undefined);
    await renderCardPage();

    const print = await printAndAnswer('Ha, chop etildi');

    expect(print).toHaveBeenCalledTimes(1);
    expect(recordCardPrint).toHaveBeenCalledWith('reader-1');
    expect(await screen.findByText('Chop etish qayd qilindi.')).toBeInTheDocument();
  });

  it('should not record the print when the user says it was not printed', async () => {
    await renderCardPage();

    await printAndAnswer('Bekor qilish');

    expect(recordCardPrint).not.toHaveBeenCalled();
  });

  it('should wait for the photo before printing when it is still loading', async () => {
    vi.mocked(fetchReader).mockResolvedValue(READER_DTO);
    renderWithProviders(
      <Routes>
        <Route path="/admin/readers/:id/card" element={<ReaderCardPage />} />
      </Routes>,
      '/admin/readers/reader-1/card',
    );

    expect(await screen.findByRole('button', { name: /Rasm yuklanmoqda/ })).toBeDisabled();
  });
});
