import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { PageRequest } from '@core/http/paging';
import type { ReaderFilter } from '../models/reader-filter';
import type { ReaderFormValues } from '../models/reader-form.schema';
import {
  toCardValidity,
  toCreatedReader,
  toReader,
  toReaderListItem,
  toSaveReaderRequest,
} from './readers.mapper';
import {
  createReader,
  deleteReader,
  exportReaders,
  fetchReader,
  fetchReaders,
  recordCardPrint,
  renewReader,
  updateReader,
  uploadReaderPhoto,
} from './readers.service';

export const readerKeys = {
  all: ['readers'] as const,
  list: (filter: ReaderFilter, page: PageRequest) =>
    [...readerKeys.all, 'list', filter, page] as const,
  detail: (id: string) => [...readerKeys.all, 'detail', id] as const,
};

export function useReaders(filter: ReaderFilter, page: PageRequest) {
  return useQuery({
    queryKey: readerKeys.list(filter, page),
    queryFn: async () => {
      const result = await fetchReaders(filter, page);
      return { rows: result.data.map(toReaderListItem), total: result.totalCount };
    },
    placeholderData: keepPreviousData,
  });
}

export function useReader(id: string) {
  return useQuery({
    queryKey: readerKeys.detail(id),
    queryFn: async () => toReader(await fetchReader(id)),
  });
}

function useInvalidateReaders() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: readerKeys.all });
}

export function useCreateReader() {
  const invalidate = useInvalidateReaders();
  return useMutation({
    mutationFn: async (values: ReaderFormValues) =>
      toCreatedReader(await createReader(toSaveReaderRequest(values))),
    onSuccess: invalidate,
  });
}

export function useUpdateReader(id: string) {
  const invalidate = useInvalidateReaders();
  return useMutation({
    mutationFn: (values: ReaderFormValues) => updateReader(id, toSaveReaderRequest(values)),
    onSuccess: invalidate,
  });
}

export function useRenewReader(id: string) {
  const invalidate = useInvalidateReaders();
  return useMutation({
    mutationFn: async () => toCardValidity(await renewReader(id)),
    onSuccess: invalidate,
  });
}

export function useRecordCardPrint(id: string) {
  const invalidate = useInvalidateReaders();
  return useMutation({ mutationFn: () => recordCardPrint(id), onSuccess: invalidate });
}

export function useDeleteReader(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteReader(id),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: readerKeys.detail(id) });
      return queryClient.invalidateQueries({ queryKey: readerKeys.all });
    },
  });
}

export function useExportReaders() {
  return useMutation({ mutationFn: (filter: ReaderFilter) => exportReaders(filter) });
}

export function useUploadReaderPhoto() {
  return useMutation({ mutationFn: (photo: Blob) => uploadReaderPhoto(photo) });
}
