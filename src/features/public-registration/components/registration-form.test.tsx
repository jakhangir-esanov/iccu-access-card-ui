import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ApiError, HttpErrorCode } from '@core/http/api-error';
import { renderWithProviders } from '@test/render-with-providers';
import { submitRegistration } from '../api/public-registration.service';
import { RegistrationForm } from './registration-form';

vi.mock('../api/public-registration.service', () => ({
  uploadPublicPhoto: vi.fn(),
  submitRegistration: vi.fn(),
}));

vi.mock('@shared/components/photo/photo-field', () => ({
  PhotoField: ({
    onChange,
    error,
  }: {
    readonly onChange: (fileId: string | null) => void;
    readonly error?: string;
  }) => (
    <>
      <span>{error}</span>
      <button
        type="button"
        onClick={() => {
          onChange('photo-1');
        }}
      >
        photo
      </button>
    </>
  ),
}));

vi.mock('@shared/components/form/date-picker', () => ({
  DatePicker: ({
    id,
    value,
    onChange,
  }: {
    readonly id: string;
    readonly value: string;
    readonly onChange: (value: string) => void;
  }) => (
    <input
      id={id}
      value={value}
      onChange={(event) => {
        onChange(event.target.value);
      }}
    />
  ),
}));

async function fillValidForm() {
  await userEvent.click(screen.getByRole('button', { name: 'photo' }));
  await userEvent.selectOptions(screen.getByLabelText('Toifa'), '1');
  await userEvent.type(screen.getByLabelText('Familiya'), 'Karimova');
  await userEvent.type(screen.getByLabelText('Ism'), 'Gulnoza');
  await userEvent.type(screen.getByLabelText("Tug'ilgan sana"), '2004-05-17');
  await userEvent.type(screen.getByLabelText('Telefon'), '90 555 12 34');
  await userEvent.type(screen.getByLabelText('Hujjat raqami'), 'ad 765-4321');
  await userEvent.click(screen.getByRole('checkbox'));
  await userEvent.click(screen.getByRole('button', { name: 'Yuborish' }));
}

describe('RegistrationForm', () => {
  it('should send normalized values and report the receipt when the form is valid', async () => {
    vi.mocked(submitRegistration).mockResolvedValue({
      code: '0427',
      expiresAt: '2026-09-27T09:00:00Z',
    });
    const onSubmitted = vi.fn();
    renderWithProviders(<RegistrationForm onSubmitted={onSubmitted} />);

    await fillValidForm();

    expect(submitRegistration).toHaveBeenCalledWith({
      category: 1,
      lastName: 'Karimova',
      firstName: 'Gulnoza',
      middleName: null,
      birthDate: '2004-05-17',
      phone: '+998905551234',
      documentType: 0,
      documentNumber: 'AD7654321',
      photoFileId: 'photo-1',
      consentGiven: true,
    });
    expect(onSubmitted).toHaveBeenCalledWith({ code: '0427', expiresAt: '2026-09-27T09:00:00Z' });
  });

  it('should show a backend field error under its field when validation fails on the server', async () => {
    vi.mocked(submitRegistration).mockRejectedValue(
      new ApiError({
        status: 400,
        code: HttpErrorCode.Validation,
        fieldErrors: [
          {
            field: 'phone',
            code: 'Reader.InvalidPhone',
            messages: { en: 'Bad phone.', uz: "Telefon noto'g'ri.", ru: 'Плохой.' },
          },
        ],
      }),
    );
    renderWithProviders(<RegistrationForm onSubmitted={vi.fn()} />);

    await fillValidForm();

    expect(await screen.findByText("Telefon noto'g'ri.")).toBeInTheDocument();
  });

  it('should explain the rate limit when too many forms are sent', async () => {
    vi.mocked(submitRegistration).mockRejectedValue(
      new ApiError({ status: 429, code: HttpErrorCode.TooManyRequests }),
    );
    renderWithProviders(<RegistrationForm onSubmitted={vi.fn()} />);

    await fillValidForm();

    expect(await screen.findByRole('alert')).toHaveTextContent("So'rovlar juda ko'p");
  });

  it('should ask for the photo and the consent when they are missing', async () => {
    renderWithProviders(<RegistrationForm onSubmitted={vi.fn()} />);

    await userEvent.click(screen.getByRole('button', { name: 'Yuborish' }));

    expect(await screen.findByText('validation.photoRequired')).toBeInTheDocument();
    expect(screen.getByText('Rozilik belgilanishi shart.')).toBeInTheDocument();
    expect(submitRegistration).not.toHaveBeenCalled();
  });
});
