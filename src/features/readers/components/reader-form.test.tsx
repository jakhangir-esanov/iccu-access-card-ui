import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ApiError } from '@core/http/api-error';
import { renderWithProviders } from '@test/render-with-providers';
import { toReader } from '../api/readers.mapper';
import { toReaderFormInput } from '../models/reader-form.schema';
import { READER_DTO } from '../test/reader-fixtures';
import { ReaderForm } from './reader-form';

vi.mock('../api/readers.service', () => ({ uploadReaderPhoto: vi.fn() }));

vi.mock('@shared/components/photo/photo-field', () => ({
  PhotoField: () => <span>photo</span>,
}));

const DUPLICATE = new ApiError({
  status: 409,
  code: 'Reader.DocumentAlreadyRegistered',
  messages: {
    en: 'Already registered.',
    uz: "Bu hujjat bilan kitobxon allaqachon ro'yxatdan o'tgan.",
    ru: 'Уже зарегистрирован.',
  },
});

function renderForm(onSubmit = vi.fn().mockResolvedValue(undefined)) {
  renderWithProviders(
    <ReaderForm
      initialValues={toReaderFormInput(toReader(READER_DTO))}
      isPending={false}
      onSubmit={onSubmit}
      onCancel={vi.fn()}
    />,
  );
  return onSubmit;
}

describe('ReaderForm', () => {
  it('should submit normalized values and keep the photo when an existing reader is saved', async () => {
    const onSubmit = renderForm();

    await userEvent.clear(screen.getByLabelText('Hujjat raqami'));
    await userEvent.type(screen.getByLabelText('Hujjat raqami'), 'ad 765 4321');
    await userEvent.click(screen.getByRole('button', { name: 'Saqlash' }));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        documentNumber: 'AD7654321',
        phone: '+998905551234',
        photoFileId: 'photo-1',
        middleName: 'Anvar qizi',
      }),
    );
  });

  it('should show the backend message when the document is already registered', async () => {
    renderForm(vi.fn().mockRejectedValue(DUPLICATE));

    await userEvent.click(screen.getByRole('button', { name: 'Saqlash' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      "Bu hujjat bilan kitobxon allaqachon ro'yxatdan o'tgan.",
    );
  });
});
