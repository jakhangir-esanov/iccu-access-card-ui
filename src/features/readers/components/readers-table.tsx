import { useMemo } from 'react';
import type { Sorting } from '@core/http/paging';
import { formatDateOnly, formatDateTime } from '@core/i18n/date-format';
import type { Translate } from '@core/i18n/translate';
import { useT } from '@core/i18n/use-i18n';
import { DataTable } from '@shared/components/data-table/data-table';
import { createDataTableColumnHelper } from '@shared/components/data-table/data-table-columns';
import { OptionalLabel } from '@shared/components/optional-label';
import { cardStatusOf } from '@shared/models/card-status';
import { CITIZENSHIP_LABELS } from '@shared/models/citizenship';
import { GENDER_LABELS } from '@shared/models/gender';
import { READER_CATEGORY_LABELS } from '@shared/models/reader-category';
import { formatPhone } from '@shared/person-details/person-format';
import { Badge } from '@shared/ui/badge';
import type { ReaderListItem } from '../models/reader';
import { CardStatusBadge } from './card-status-badge';

const column = createDataTableColumnHelper<ReaderListItem>();

function createColumns(t: Translate, today: string) {
  return column.columns([
    column.accessor('cardNumber', {
      header: () => t('readers.columns.cardNumber'),
      cell: ({ getValue }) => (
        <span className="font-bold tracking-[0.06em] text-primary tabular-nums">{getValue()}</span>
      ),
    }),
    column.accessor('fullName', {
      id: 'lastName',
      header: () => t('readers.columns.fullName'),
      cell: ({ getValue }) => (
        <span className="block min-w-40 font-semibold whitespace-normal">{getValue()}</span>
      ),
    }),
    column.accessor('category', {
      header: () => t('readers.columns.category'),
      cell: ({ getValue }) => (
        <Badge variant="secondary">{t(READER_CATEGORY_LABELS[getValue()])}</Badge>
      ),
    }),
    column.accessor('phone', {
      header: () => t('readers.columns.phone'),
      enableSorting: false,
      cell: ({ getValue }) => <span className="whitespace-nowrap">{formatPhone(getValue())}</span>,
    }),
    column.accessor('gender', {
      header: () => t('readers.columns.gender'),
      cell: ({ getValue }) => <OptionalLabel value={getValue()} labels={GENDER_LABELS} />,
    }),
    column.accessor('citizenship', {
      header: () => t('readers.columns.citizenship'),
      cell: ({ getValue }) => <OptionalLabel value={getValue()} labels={CITIZENSHIP_LABELS} />,
    }),
    column.accessor('expiresOn', {
      header: () => t('readers.columns.expiresOn'),
      cell: ({ getValue }) => (
        <span className="flex max-w-40 flex-wrap items-center gap-x-2 gap-y-1.5">
          {formatDateOnly(getValue())}
          <CardStatusBadge status={cardStatusOf(getValue(), today)} />
        </span>
      ),
    }),
    column.accessor('createdAt', {
      header: () => t('readers.columns.createdAt'),
      cell: ({ getValue }) => (
        <span className="whitespace-nowrap text-muted-foreground tabular-nums">
          {formatDateTime(getValue())}
        </span>
      ),
    }),
  ]);
}

interface ReadersTableProps {
  readonly rows: ReaderListItem[];
  readonly today: string;
  readonly sorting: Sorting | null;
  readonly onSortingChange: (sorting: Sorting | null) => void;
  readonly isLoading: boolean;
  readonly onOpen: (reader: ReaderListItem) => void;
}

export function ReadersTable({
  rows,
  today,
  sorting,
  onSortingChange,
  isLoading,
  onOpen,
}: ReadersTableProps) {
  const t = useT();
  const columns = useMemo(() => createColumns(t, today), [t, today]);
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
