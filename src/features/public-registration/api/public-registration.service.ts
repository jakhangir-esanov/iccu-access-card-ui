import { apiClient } from '@core/http/api-client';
import type {
  SubmitRegistrationRequestDto,
  SubmitRegistrationResponseDto,
} from './public-registration.dto';

const PHOTO_FIELD = 'file';
const PHOTO_FILE_NAME = 'photo.jpg';

export function uploadPublicPhoto(photo: Blob): Promise<string> {
  const form = new FormData();
  form.append(PHOTO_FIELD, photo, PHOTO_FILE_NAME);
  return apiClient.post<string>('/public/files', form);
}

export function submitRegistration(
  request: SubmitRegistrationRequestDto,
): Promise<SubmitRegistrationResponseDto> {
  return apiClient.post<SubmitRegistrationResponseDto>('/public/registrations', request);
}
