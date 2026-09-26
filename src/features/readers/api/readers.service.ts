import { apiClient, type DownloadedFile } from '@core/http/api-client';
import type { PagedList } from '@core/http/api-types';
import { toPageQuery, type PageRequest } from '@core/http/paging';
import { toReaderQuery, type ReaderFilter } from '../models/reader-filter';
import type {
  CreateReaderResponseDto,
  ReaderDto,
  ReaderListItemDto,
  RenewReaderResponseDto,
  SaveReaderRequestDto,
} from './readers.dto';

const BASE_PATH = '/readers';
const PHOTO_FIELD = 'file';
const PHOTO_FILE_NAME = 'photo.jpg';

export function fetchReaders(
  filter: ReaderFilter,
  page: PageRequest,
): Promise<PagedList<ReaderListItemDto>> {
  return apiClient.getPage<ReaderListItemDto>(BASE_PATH, {
    query: { ...toReaderQuery(filter), ...toPageQuery(page) },
  });
}

export function fetchReader(id: string): Promise<ReaderDto> {
  return apiClient.get<ReaderDto>(`${BASE_PATH}/${id}`);
}

export function createReader(request: SaveReaderRequestDto): Promise<CreateReaderResponseDto> {
  return apiClient.post<CreateReaderResponseDto>(BASE_PATH, request);
}

export function updateReader(id: string, request: SaveReaderRequestDto): Promise<void> {
  return apiClient.put(`${BASE_PATH}/${id}`, request);
}

export function renewReader(id: string): Promise<RenewReaderResponseDto> {
  return apiClient.post<RenewReaderResponseDto>(`${BASE_PATH}/${id}/renew`);
}

export function deleteReader(id: string): Promise<void> {
  return apiClient.delete(`${BASE_PATH}/${id}`);
}

export function exportReaders(filter: ReaderFilter): Promise<DownloadedFile> {
  return apiClient.getFile(`${BASE_PATH}/export`, { query: toReaderQuery(filter) });
}

export function uploadReaderPhoto(photo: Blob): Promise<string> {
  const form = new FormData();
  form.append(PHOTO_FIELD, photo, PHOTO_FILE_NAME);
  return apiClient.post<string>('/files', form);
}
