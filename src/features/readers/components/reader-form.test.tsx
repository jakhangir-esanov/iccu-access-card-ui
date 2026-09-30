import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ApiError } from '@core/http/api-error';
import { Citizenship } from '@shared/models/citizenship';
import { Gender } from '@shared/models/gender';
import { renderWithProviders } from '@test/render-with-providers';
import type { ReaderDto } from '../api/readers.dto';
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
  code: 'Reader.PhoneAlreadyRegistered',
  messages: {
    en: 'Already registered.',
    uz: "Bu telefon raqami bilan kitobxon allaqachon ro'yxatdan o'tgan.",
    ru: 'Уже зарегистрирован.',
  },
});

function renderForm(onSubmit = vi.fn().mockResolvedValue(undefined), dto: ReaderDto = READER_DTO) {
  renderWithProviders(
    <ReaderForm
      initialValues={toReaderFormInput(toReader(dto))}
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

    await userEvent.selectOptions(screen.getByLabelText('Jinsi'), '0');
    await userEvent.click(screen.getByRole('button', { name: 'Saqlash' }));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        gender: Gender.Male,
        citizenship: Citizenship.Uzbekistan,
        phone: '+998905551234',
        photoFileId: 'photo-1',
        middleName: 'Anvar qizi',
      }),
    );
  });

  it('should take a full international number when the reader becomes a foreign citizen', async () => {
    const onSubmit = renderForm();

    await userEvent.selectOptions(screen.getByLabelText('Fuqaroligi'), '1');
    expect(screen.queryByText('+998')).not.toBeInTheDocument();
    await userEvent.clear(screen.getByLabelText('Telefon'));
    await userEvent.type(screen.getByLabelText('Telefon'), '+7 (901) 234-56-78');
    await userEvent.click(screen.getByRole('button', { name: 'Saqlash' }));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ citizenship: Citizenship.Foreign, phone: '+79012345678' }),
    );
  });

  it('should ask for gender and citizenship when an old reader has none', async () => {
    const onSubmit = renderForm(undefined, { ...READER_DTO, gender: null, citizenship: null });

    await userEvent.click(screen.getByRole('button', { name: 'Saqlash' }));

    expect(await screen.findAllByText("Maydon to'ldirilishi shart.")).toHaveLength(2);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('should show the backend message when the phone is already registered', async () => {
    renderForm(vi.fn().mockRejectedValue(DUPLICATE));

    await userEvent.click(screen.getByRole('button', { name: 'Saqlash' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      "Bu telefon raqami bilan kitobxon allaqachon ro'yxatdan o'tgan.",
    );
  });
});
