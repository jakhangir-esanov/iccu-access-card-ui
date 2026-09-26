import { FileSpreadsheetIcon, PlusIcon } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '@core/auth/use-auth';
import { newReaderPath, readerPath } from '@core/config/app-paths';
import { useNotify } from '@core/feedback/use-notify';
import { toTashkentDateOnly } from '@core/i18n/date-format';
import { useT } from '@core/i18n/use-i18n';
import { DataTablePager } from '@shared/components/data-table/data-table-pager';
import { useTableSearchParams } from '@shared/components/data-table/use-table-search-params';
import { FormAlert } from '@shared/components/form/form-alert';
import { Button } from '@shared/ui/button';
import { saveFile } from '@shared/utils/save-file';
import { useExportReaders, useReaders } from '../api/readers.queries';
import { ReaderFilters } from '../components/reader-filters';
import { ReadersTable } from '../components/readers-table';
import {
  DEFAULT_READER_SORT,
  READER_FILTER_NAMES,
  parseReaderFilter,
} from '../models/reader-filter';

const EMPTY_ROWS: never[] = [];
const EXPORT_FALLBACK_NAME = 'kitobxonlar.xlsx';

export function ReadersPage() {
  const t = useT();
  const navigate = useNavigate();
  const notify = useNotify();
  const { isAdmin } = useAuth();
  const [today] = useState(() => toTashkentDateOnly(new Date()));
  const table = useTableSearchParams(DEFAULT_READER_SORT);
  const filter = parseReaderFilter(table.filter);
  const readers = useReaders(filter, table.page);
  const exporter = useExportReaders();

  const exportList = () => {
    exporter.mutate(filter, {
      onSuccess: (file) => {
        saveFile(file.blob, file.fileName ?? EXPORT_FALLBACK_NAME);
      },
      onError: notify.failure,
    });
  };

  return (
    <section className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">{t('readers.title')}</h1>
        <div className="flex flex-wrap gap-2">
          {isAdmin && (
            <Button variant="outline" disabled={exporter.isPending} onClick={exportList}>
              <FileSpreadsheetIcon aria-hidden />
              {t('readers.export')}
            </Button>
          )}
          <Button asChild>
            <Link to={newReaderPath}>
              <PlusIcon aria-hidden />
              {t('readers.create')}
            </Link>
          </Button>
        </div>
      </div>
      <ReaderFilters
        filter={filter}
        onChange={table.setFilter}
        onClear={() => {
          table.clearFilters(READER_FILTER_NAMES);
        }}
      />
      <FormAlert message={readers.isError ? t('table.loadFailed') : null} />
      <ReadersTable
        rows={readers.data?.rows ?? EMPTY_ROWS}
        today={today}
        sorting={table.page.sort ?? null}
        onSortingChange={table.setSort}
        isLoading={readers.isFetching}
        onOpen={(reader) => {
          void navigate(readerPath(reader.id));
        }}
      />
      <DataTablePager
        first={table.page.first}
        rows={table.page.rows}
        total={readers.data?.total ?? 0}
        onChange={table.setPage}
      />
    </section>
  );
}
