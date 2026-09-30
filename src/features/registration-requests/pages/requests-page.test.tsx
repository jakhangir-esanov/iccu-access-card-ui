import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ReaderCategory } from '@shared/models/reader-category';
import { RegistrationRequestStatus } from '@shared/models/registration-request-status';
import { renderWithProviders } from '@test/render-with-providers';
import type { RegistrationRequestListItemDto } from '../api/registration-requests.dto';
import { fetchRegistrationRequests } from '../api/registration-requests.service';
import { RequestsPage } from './requests-page';

vi.mock('../api/registration-requests.service', () => ({
  fetchRegistrationRequests: vi.fn(),
  fetchRegistrationRequest: vi.fn(),
  updateRegistrationRequest: vi.fn(),
  approveRegistrationRequest: vi.fn(),
  rejectRegistrationRequest: vi.fn(),
}));

vi.mock('@core/realtime/use-registration-submitted', () => ({
  useRegistrationSubmitted: vi.fn(),
}));

const SAMPLE_ROW: RegistrationRequestListItemDto = {
  id: 'req-1',
  photoFileId: 'photo-1',
  code: '0001',
  status: RegistrationRequestStatus.Pending,
  category: ReaderCategory.Student,
  lastName: 'Karimova',
  firstName: 'Gulnoza',
  middleName: 'Anvar qizi',
  phone: '+998905551234',
  submittedAt: '2026-09-26T17:06:55.082Z',
  expiresAt: '2026-09-27T17:06:55.082Z',
  reviewedAt: null,
  reviewedByName: null,
  hasRegisteredPhone: false,
};

describe('RequestsPage', () => {
  it('should render table rows when request data is loaded', async () => {
    vi.mocked(fetchRegistrationRequests).mockResolvedValue({
      data: [SAMPLE_ROW],
      totalCount: 1,
    });

    renderWithProviders(<RequestsPage />);

    expect(await screen.findByText('0001')).toBeInTheDocument();
    expect(screen.getByText('Karimova Gulnoza Anvar qizi')).toBeInTheDocument();
    expect(screen.getByText('Talaba')).toBeInTheDocument();
    expect(screen.getAllByText('Kutilmoqda')).toHaveLength(2);
  });

  it('should display error message when request loading fails', async () => {
    vi.mocked(fetchRegistrationRequests).mockRejectedValue(new Error('Network error'));

    renderWithProviders(<RequestsPage />);

    expect(await screen.findByText("Ma'lumotni yuklab bo'lmadi.")).toBeInTheDocument();
  });
});
