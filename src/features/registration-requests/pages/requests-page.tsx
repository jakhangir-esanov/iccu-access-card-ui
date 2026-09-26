import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { AppPath } from '@core/config/app-paths';
import { useT } from '@core/i18n/use-i18n';
import { useRegistrationSubmitted } from '@core/realtime/use-registration-submitted';
import { DataTablePager } from '@shared/components/data-table/data-table-pager';
import { useTableSearchParams } from '@shared/components/data-table/use-table-search-params';
import { FormAlert } from '@shared/components/form/form-alert';
import { PageHeader } from '@shared/components/page-header';
import {
  registrationRequestKeys,
  useRegistrationRequests,
} from '../api/registration-requests.queries';
import { RequestFilters } from '../components/request-filters';
import { RequestsTable } from '../components/requests-table';
import {
  DEFAULT_REQUEST_SORT,
  RequestFilterParam,
  parseStatusFilter,
  toStatusParam,
  type RequestFilter,
} from '../models/request-filter';

const EMPTY_ROWS: never[] = [];

export function RequestsPage() {
  const t = useT();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const table = useTableSearchParams(DEFAULT_REQUEST_SORT);
  const filter: RequestFilter = {
    status: parseStatusFilter(table.filter(RequestFilterParam.status)),
    search: table.filter(RequestFilterParam.search),
  };
  const requests = useRegistrationRequests(filter, table.page);

  useRegistrationSubmitted(() => {
    void queryClient.invalidateQueries({ queryKey: registrationRequestKeys.all });
  });

  return (
    <section className="grid gap-6">
      <PageHeader title={t('requests.title')} />
      <RequestFilters
        filter={filter}
        onStatusChange={(status) => {
          table.setFilter(RequestFilterParam.status, toStatusParam(status));
        }}
        onSearchChange={(search) => {
          table.setFilter(RequestFilterParam.search, search);
        }}
      />
      <FormAlert message={requests.isError ? t('table.loadFailed') : null} />
      <RequestsTable
        rows={requests.data?.rows ?? EMPTY_ROWS}
        sorting={table.page.sort ?? null}
        onSortingChange={table.setSort}
        isLoading={requests.isFetching}
        onOpen={(request) => {
          void navigate(`${AppPath.registrationRequests}/${request.id}`);
        }}
      />
      <DataTablePager
        first={table.page.first}
        rows={table.page.rows}
        total={requests.data?.total ?? 0}
        onChange={table.setPage}
      />
    </section>
  );
}
