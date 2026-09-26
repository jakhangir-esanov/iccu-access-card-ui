import { TriangleAlertIcon } from 'lucide-react';
import { useMemo } from 'react';
import type { Sorting } from '@core/http/paging';
import { formatDateTime } from '@core/i18n/date-format';
import type { Translate } from '@core/i18n/translate';
import { useT } from '@core/i18n/use-i18n';
import { AuthorizedImage } from '@shared/components/authorized-image';
import { DataTable } from '@shared/components/data-table/data-table';
import { createDataTableColumnHelper } from '@shared/components/data-table/data-table-columns';
import { READER_CATEGORY_LABELS } from '@shared/models/reader-category';
import { formatPhone } from '@shared/person-details/person-format';
import type { RegistrationRequestListItem } from '../models/registration-request';
import { RequestStatusBadge } from './request-status-badge';

const column = createDataTableColumnHelper<RegistrationRequestListItem>();

function createColumns(t: Translate) {
  return column.columns([
    column.display({
      id: 'photo',
      header: () => <span className="sr-only">{t('requests.columns.photo')}</span>,
      cell: ({ row }) => (
        <AuthorizedImage
          fileId={row.original.photoFileId}
          alt={row.original.fullName}
          className="aspect-[3/4] w-11 rounded-lg border"
        />
      ),
    }),
    column.accessor('code', {
      header: () => t('requests.columns.code'),
      cell: ({ getValue }) => (
        <span className="text-base font-bold tracking-[0.06em] text-primary tabular-nums">
          {getValue()}
        </span>
      ),
    }),
    column.accessor('fullName', {
      id: 'lastName',
      header: () => t('requests.columns.fullName'),
      cell: ({ row }) => (
        <span className="flex items-center gap-2 font-semibold">
          {row.original.fullName}
          {row.original.hasRegisteredDocument && (
            <TriangleAlertIcon
              className="size-4 text-gold"
              aria-label={t('requests.duplicateShort')}
            />
          )}
        </span>
      ),
    }),
    column.accessor('category', {
      header: () => t('requests.columns.category'),
      cell: ({ getValue }) => t(READER_CATEGORY_LABELS[getValue()]),
    }),
    column.accessor('phone', {
      header: () => t('requests.columns.phone'),
      enableSorting: false,
      cell: ({ getValue }) => <span className="whitespace-nowrap">{formatPhone(getValue())}</span>,
    }),
    column.accessor('submittedAt', {
      header: () => t('requests.columns.submittedAt'),
      cell: ({ getValue }) => (
        <span className="whitespace-nowrap">{formatDateTime(getValue())}</span>
      ),
    }),
    column.accessor('status', {
      header: () => t('requests.columns.status'),
      cell: ({ getValue }) => <RequestStatusBadge status={getValue()} />,
    }),
  ]);
}

interface RequestsTableProps {
  readonly rows: RegistrationRequestListItem[];
  readonly sorting: Sorting | null;
  readonly onSortingChange: (sorting: Sorting | null) => void;
  readonly isLoading: boolean;
  readonly onOpen: (request: RegistrationRequestListItem) => void;
}

export function RequestsTable({
  rows,
  sorting,
  onSortingChange,
  isLoading,
  onOpen,
}: RequestsTableProps) {
  const t = useT();
  const columns = useMemo(() => createColumns(t), [t]);
  return (
    <DataTable
      columns={columns}
      rows={rows}
      getRowId={(row) => row.id}
      sorting={sorting}
      onSortingChange={onSortingChange}
      isLoading={isLoading}
      onRowClick={onOpen}
    />
  );
}
