import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route, Routes } from 'react-router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError } from '@core/http/api-error';
import { Citizenship } from '@shared/models/citizenship';
import { Gender } from '@shared/models/gender';
import { ReaderCategory } from '@shared/models/reader-category';
import { RegistrationRequestStatus } from '@shared/models/registration-request-status';
import { renderWithProviders } from '@test/render-with-providers';
import type { RegistrationRequestDto } from '../api/registration-requests.dto';
import {
  approveRegistrationRequest,
  fetchRegistrationRequest,
  rejectRegistrationRequest,
} from '../api/registration-requests.service';
import { RequestPage } from './request-page';

vi.mock('../api/registration-requests.service', () => ({
  fetchRegistrationRequests: vi.fn(),
  fetchRegistrationRequest: vi.fn(),
  updateRegistrationRequest: vi.fn(),
  approveRegistrationRequest: vi.fn(),
  rejectRegistrationRequest: vi.fn(),
}));

vi.mock('@shared/components/authorized-image', () => ({
  AuthorizedImage: () => <div data-testid="authorized-image" />,
}));

const SAMPLE_REQUEST: RegistrationRequestDto = {
  id: 'req-1',
  photoFileId: 'photo-1',
  code: '0001',
  status: RegistrationRequestStatus.Pending,
  category: ReaderCategory.Student,
  lastName: 'Karimova',
  firstName: 'Gulnoza',
  middleName: 'Anvar qizi',
  birthDate: '2004-05-17',
  gender: Gender.Female,
  citizenship: Citizenship.Foreign,
  phone: '+998905551234',
  submittedAt: '2026-09-26T17:06:55.082Z',
  expiresAt: '2026-09-27T17:06:55.082Z',
  reviewedAt: null,
  reviewedByName: null,
  rejectionReason: null,
  readerId: null,
  registeredReaderId: null,
  registeredReaderCardNumber: null,
};

const NOW = new Date('2026-09-26T18:00:00Z');

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(NOW);
});

afterEach(() => {
  vi.useRealTimers();
});

function renderRequestPage() {
  return renderWithProviders(
    <Routes>
      <Route path="/admin/requests/:id" element={<RequestPage />} />
    </Routes>,
    '/admin/requests/req-1',
  );
}

describe('RequestPage', () => {
  it('should render request details when request is loaded', async () => {
    vi.mocked(fetchRegistrationRequest).mockResolvedValue(SAMPLE_REQUEST);

    renderRequestPage();

    expect(await screen.findByText('Ariza 0001')).toBeInTheDocument();
    expect(screen.getByText('Karimova')).toBeInTheDocument();
    expect(screen.getByText('Gulnoza')).toBeInTheDocument();
    expect(screen.getByText('Ayol')).toBeInTheDocument();
    expect(screen.getByText('Chet el fuqarosi')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Tasdiqlash' })).toBeEnabled();
  });

  it('should display duplicate phone warning and disable approve when reader already registered', async () => {
    vi.mocked(fetchRegistrationRequest).mockResolvedValue({
      ...SAMPLE_REQUEST,
      registeredReaderId: 'reader-42',
      registeredReaderCardNumber: '0000042',
    });

    renderRequestPage();

    expect(
      await screen.findByText('Bu telefon raqami bilan kitobxon allaqachon bor (karta 0000042).'),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Tasdiqlash' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Kitobxonni ochish' })).toBeInTheDocument();
  });

  it('should call approve when confirmation dialog is accepted', async () => {
    vi.mocked(fetchRegistrationRequest).mockResolvedValue(SAMPLE_REQUEST);
    vi.mocked(approveRegistrationRequest).mockResolvedValue({
      readerId: 'reader-1',
      cardNumber: '0000001',
    });

    renderRequestPage();

    const approveButton = await screen.findByRole('button', { name: 'Tasdiqlash' });
    await userEvent.click(approveButton);

    const dialogConfirmButton = await screen.findByRole('button', { name: 'Tasdiqlash' });
    await userEvent.click(dialogConfirmButton);

    await waitFor(() => {
      expect(approveRegistrationRequest).toHaveBeenCalledWith('req-1');
    });
  });

  it('should show the backend message when approval fails', async () => {
    vi.mocked(fetchRegistrationRequest).mockResolvedValue(SAMPLE_REQUEST);
    vi.mocked(approveRegistrationRequest).mockRejectedValue(
      new ApiError({
        status: 409,
        code: 'RegistrationRequest.Expired',
        messages: { en: 'Expired.', uz: "Arizaning muddati o'tgan.", ru: 'Истёк.' },
      }),
    );

    renderRequestPage();

    await userEvent.click(await screen.findByRole('button', { name: 'Tasdiqlash' }));
    await userEvent.click(await screen.findByRole('button', { name: 'Tasdiqlash' }));

    expect(await screen.findByText("Arizaning muddati o'tgan.")).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Ariza 0001');
  });

  it('should submit rejection when reason is provided', async () => {
    vi.mocked(fetchRegistrationRequest).mockResolvedValue(SAMPLE_REQUEST);
    vi.mocked(rejectRegistrationRequest).mockResolvedValue(undefined);

    renderRequestPage();

    const rejectButton = await screen.findByRole('button', { name: 'Rad etish' });
    await userEvent.click(rejectButton);

    const reasonInput = await screen.findByLabelText('Sabab');
    await userEvent.type(reasonInput, 'Hujjat muddati tugagan');

    const submitReject = screen.getByRole('button', { name: 'Rad etish' });
    await userEvent.click(submitReject);

    await waitFor(() => {
      expect(rejectRegistrationRequest).toHaveBeenCalledWith('req-1', {
        reason: 'Hujjat muddati tugagan',
      });
    });
  });

  it('should keep the dialog open and show the backend message when rejection fails', async () => {
    vi.mocked(fetchRegistrationRequest).mockResolvedValue(SAMPLE_REQUEST);
    vi.mocked(rejectRegistrationRequest).mockRejectedValue(
      new ApiError({
        status: 409,
        code: 'RegistrationRequest.NotPending',
        messages: { en: 'Reviewed.', uz: "Ariza allaqachon ko'rib chiqilgan.", ru: 'Рассмотрена.' },
      }),
    );

    renderRequestPage();

    await userEvent.click(await screen.findByRole('button', { name: 'Rad etish' }));
    await userEvent.type(await screen.findByLabelText('Sabab'), 'Takroriy ariza');
    await userEvent.click(screen.getByRole('button', { name: 'Rad etish' }));

    expect(await screen.findByText("Ariza allaqachon ko'rib chiqilgan.")).toBeInTheDocument();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByLabelText('Sabab')).toHaveValue('Takroriy ariza');
  });
});
